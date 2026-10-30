import type { Film } from '@/data/films';
import type { Article } from '@/data/articles';

/**
 * Normalizes Kurdish and Arabic text for robust, keyboard-agnostic search matching.
 *
 * Mappings implemented:
 * - (ي / ى / ێ -> ی)
 * - (ك / ڪ -> ک)
 * - (ه / ة / ھ / ە -> ه)
 * - (أ / إ / آ / ٱ / ئ -> ا)
 * - (ؤ / ۆ -> و)
 * - (ڕ -> ر)
 * - (ڵ -> ل)
 * - Removes Arabic diacritics / harakat (\u064B-\u065F, \u0670)
 * - Removes Tatweel / Kashida (\u0640)
 * - Removes Zero-Width Non-Joiner (ZWNJ), ZWJ, and invisible control characters
 */
export function normalizeKurdishText(input: string | undefined | null): string {
  if (!input) return '';

  return input
    .toString()
    .toLowerCase()
    // 1. Remove Arabic Harakat / diacritics
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // 2. Remove Tatweel / Kashida (ـ)
    .replace(/\u0640/g, '')
    // 3. Remove zero-width & formatting characters (ZWNJ, ZWJ, LTR/RTL marks, BOM)
    .replace(/[\u200B-\u200F\uFEFF\u00AD]/g, '')
    // 4. Map Kaf variants: Arabic ك and Swash ڪ -> Kurdish/Persian ک
    .replace(/[كڪ]/g, 'ک')
    // 5. Map Yeh variants: Arabic ي, Alef Maksura ى, Kurdish ێ -> Kurdish ی
    .replace(/[يىێ]/g, 'ی')
    // 6. Map Heh / Teh Marbuta / Ae variants: ة, ھ, ە -> ه
    .replace(/[ةەھ]/g, 'ه')
    // 7. Map Alef / Hamza variants: أ, إ, آ, ٱ, ئ -> ا
    .replace(/[أإآٱئ]/g, 'ا')
    // 8. Map Waw variants: ؤ, ۆ -> و
    .replace(/[ؤۆ]/g, 'و')
    // 9. Map Kurdish emphatic consonants for flexible matching: ڕ -> ر, ڵ -> ل
    .replace(/ڕ/g, 'ر')
    .replace(/ڵ/g, 'ل')
    // 10. Trim and collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalization variant that treats short Kurdish vowels / heh flexibly
 * to bridge differences between Arabic phonetic spelling and Kurdish orthography.
 */
function normalizeLoose(input: string | undefined | null): string {
  return normalizeKurdishText(input).replace(/ه/g, '');
}

/**
 * Checks whether a target text (or array of fields) matches the search query using both strict and flexible normalization.
 */
export function matchesSearchQuery(
  haystack: string | (string | undefined | null)[] | undefined | null,
  query: string
): boolean {
  if (!query || !query.trim()) return true;
  if (!haystack) return false;

  const rawText = Array.isArray(haystack) ? haystack.filter(Boolean).join(' ') : haystack;

  const nHaystack = normalizeKurdishText(rawText);
  const nQuery = normalizeKurdishText(query);

  if (!nQuery) return true;

  const lHaystack = normalizeLoose(rawText);
  const lQuery = normalizeLoose(query);

  const queryTerms = nQuery.split(' ').filter(Boolean);
  const looseTerms = lQuery.split(' ').filter(Boolean);

  return queryTerms.every((term, idx) => {
    // 1. Direct normalized substring match
    if (nHaystack.includes(term)) return true;

    // 2. Loose phonetic match (ignoring heh/ae differences)
    const lTerm = looseTerms[idx];
    if (lTerm && lTerm.length >= 2 && lHaystack.includes(lTerm)) {
      return true;
    }

    return false;
  });
}

/**
 * Filters a list of films by search query and optional category.
 */
export function filterFilms(films: Film[], query: string, category?: string): Film[] {
  let result = films;

  if (category && category !== 'هەمووی') {
    result = result.filter((film) => film.category === category);
  }

  const cleanQuery = query.trim();
  if (!cleanQuery) return result;

  return result.filter((film) => {
    const searchableFields = [
      film.titleKurdish,
      film.originalTitle,
      film.description,
      film.category,
      ...film.genres,
      film.year.toString(),
    ].join(' ');

    return matchesSearchQuery(searchableFields, cleanQuery);
  });
}

/**
 * Filters a list of articles by search query and optional category.
 */
export function filterArticles(articles: Article[], query: string, category?: string): Article[] {
  let result = articles;

  if (category && category !== 'هەمووی') {
    result = result.filter((article) => article.category === category);
  }

  const cleanQuery = query.trim();
  if (!cleanQuery) return result;

  return result.filter((article) => {
    const content = Array.isArray(article.content)
      ? article.content.join(' ')
      : typeof article.content === 'string'
      ? article.content
      : '';

    const searchableFields = [
      article.title,
      article.excerpt,
      article.category,
      article.author,
      content,
    ].join(' ');

    return matchesSearchQuery(searchableFields, cleanQuery);
  });
}
