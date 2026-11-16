import { normalizeCategory, type Film } from '@/data/films';
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
 * Filters a list of films by search query and optional category / filter tag.
 */
export function filterFilms(films: Film[], query: string, category?: string): Film[] {
  let result = films;

  if (category && category !== 'هەمووی') {
    const target = category.trim();
    const targetUnspaced = target.replace(/\s+/g, '');

    result = result.filter((film) => {
      const filmCat = (film.category || '').trim();
      const filmCatUnspaced = filmCat.replace(/\s+/g, '');

      // 1. Direct or whitespace-normalized category match (e.g. "زنجیرەفیلم" matches "زنجیرە فیلم")
      if (filmCat === target || (filmCatUnspaced && filmCatUnspaced === targetUnspaced)) {
        return true;
      }

      // 2. زنجیرە فیلم (supports legacy زنجیرەفیلم or generic series)
      if (targetUnspaced === 'زنجیرەفیلم') {
        return (
          filmCatUnspaced === 'زنجیرەفیلم' ||
          (filmCat.includes('زنجیرە') && !filmCat.includes('کارتۆن'))
        );
      }

      // 3. زنجیرە کارتۆن (supports legacy زنجیرەکارتۆن)
      if (targetUnspaced === 'زنجیرەکارتۆن') {
        return (
          filmCatUnspaced === 'زنجیرەکارتۆن' ||
          (filmCat.includes('زنجیرە') && filmCat.includes('کارتۆن'))
        );
      }

      // 4. کورتە فیلم (supports legacy کورتەفیلم)
      if (targetUnspaced === 'کورتەفیلم') {
        return filmCatUnspaced === 'کورتەفیلم';
      }

      // 5. فیلم (standalone movies)
      if (target === 'فیلم') {
        return (
          filmCat === 'فیلم' ||
          filmCat === 'سینەمایی' ||
          (film as any).type === 'فیلم'
        );
      }

      // 6. کارتۆن
      if (target === 'کارتۆن') {
        return (
          filmCat === 'کارتۆن' ||
          filmCatUnspaced === 'زنجیرەکارتۆن' ||
          filmCat === 'ئەنیمەیشن' ||
          (film as any).type === 'کارتۆن'
        );
      }

      // 7. زنجیرە (Generic series filter)
      if (target === 'زنجیرە') {
        return (
          filmCatUnspaced === 'زنجیرەفیلم' ||
          filmCatUnspaced === 'زنجیرەکارتۆن' ||
          filmCat.includes('زنجیرە') ||
          (film.genres || []).some((g) => g.includes('زنجیرە')) ||
          film.titleKurdish?.includes('زنجیرە')
        );
      }

      // 8. دۆبلاژ
      if (target === 'دۆبلاژ') {
        const fullInfo = `${film.titleKurdish} ${film.description} ${(film.genres || []).join(' ')}`;
        return (
          (film.genres || []).some((g) => g.includes('دۆبلاژ')) ||
          normalizeKurdishText(fullInfo).includes('دوبلاژ') ||
          fullInfo.includes('دۆبلاژ')
        );
      }

      // 9. ژێرنووس
      if (target === 'ژێرنووس') {
        const fullInfo = `${film.titleKurdish} ${film.description} ${(film.genres || []).join(' ')}`;
        return (
          (film.genres || []).some((g) => g.includes('ژێرنووس')) ||
          normalizeKurdishText(fullInfo).includes('ژیرنووس') ||
          fullInfo.includes('ژێرنووس')
        );
      }

      return false;
    });
  }

  const cleanQuery = query.trim();
  if (!cleanQuery) return result;

  return result.filter((film) => {
    const searchableFields = [
      film.titleKurdish,
      film.originalTitle,
      film.description,
      film.category,
      normalizeCategory(film.category),
      ...(film.genres || []),
      film.year?.toString() || '',
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
    result = result.filter((article) => {
      if (article.category === category) return true;
      // Backward compatibility aliases for legacy category strings
      if (category === 'کتێب' && (article.category === ('کتێبناسی' as any) || (article as any).type === 'کتێب')) return true;
      if (category === 'شیعر' && (article.category === ('ئەدەب' as any) || (article as any).type === 'شیعر')) return true;
      if (category === 'دەق' && (article.category === ('ڕامان' as any) || article.category === ('سینەما و هزر' as any))) return true;
      return false;
    });
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
