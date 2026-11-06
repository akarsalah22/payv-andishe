"use client";

import { useState, useMemo, useEffect, useCallback, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { X, SearchX } from 'lucide-react';
import { FilmCard } from './FilmCard';
import { SearchBar, DEFAULT_SEARCH_CATEGORIES } from './SearchBar';
import type { Film } from '@/data/films';
import { filterFilms } from '@/lib/search';

interface FilmsArchiveProps {
  initialFilms: Film[];
}

export function FilmsArchive({ initialFilms }: FilmsArchiveProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [films, setFilms] = useState<Film[]>(initialFilms);

  // Read initial query parameters from URL
  const queryParam = searchParams.get('q') || searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'هەمووی';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);

  // Synchronize state when URL query parameters change externally
  const qFromParams = searchParams.get('q') || searchParams.get('search') || '';
  const categoryFromParams = searchParams.get('category') || 'هەمووی';

  useEffect(() => {
    setSearchQuery(qFromParams);
    setActiveCategory(categoryFromParams);
  }, [qFromParams, categoryFromParams]);

  // Push updated query parameters to the URL
  const updateUrlParams = useCallback(
    (newQuery: string, newCategory: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newQuery.trim()) {
        params.set('q', newQuery.trim());
        params.delete('search');
      } else {
        params.delete('q');
        params.delete('search');
      }

      if (newCategory && newCategory !== 'هەمووی') {
        params.set('category', newCategory);
      } else {
        params.delete('category');
      }

      const queryString = params.toString();
      startTransition(() => {
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  // Fetch updated films from API on mount
  useEffect(() => {
    const loadFilms = async () => {
      try {
        const res = await fetch('/api/films');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFilms(data);
            return;
          }
        }
      } catch {
        // fallback to initialFilms
      }
    };

    loadFilms();
  }, []);

  // Filtered films using Kurdish/Arabic normalization
  const filteredFilms = useMemo(() => {
    return filterFilms(films, searchQuery, activeCategory);
  }, [films, searchQuery, activeCategory]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams(val, activeCategory);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    updateUrlParams(searchQuery, category);
  };

  const handleResetAll = () => {
    setSearchQuery('');
    setActiveCategory('هەمووی');
    updateUrlParams('', 'هەمووی');
  };

  const hasActiveFilters = searchQuery.trim().length > 0 || activeCategory !== 'هەمووی';

  return (
    <div className="w-full space-y-8" dir="rtl">
      {/* Search Input Bar & Category Filters (Instant client filter with 300ms debounce & Random movie picker) */}
      <SearchBar
        value={searchQuery}
        onSearchChange={handleSearchChange}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categories={DEFAULT_SEARCH_CATEGORIES}
        placeholder="گەڕان لە نێو فیلم، زنجیرە و کارتۆنەکان (بە کوردی یان عەرەبی)..."
        films={films}
        showRandomButton={true}
      />

      {/* Results Count & Active Search Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs font-sirwan text-zinc-500 dark:text-zinc-400 px-1 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-3">
          <span>
            {filteredFilms.length} فیلم دۆزرایەوە لە کۆی {films.length}
          </span>
          <button
            type="button"
            onClick={handleResetAll}
            className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            پیشاندانی هەمووی
          </button>
        </div>
      )}

      {/* Responsive Grid: 2 columns on mobile, scaling up smoothly to 6 columns on wide desktop */}
      {filteredFilms.length > 0 ? (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5 lg:gap-6 min-h-[300px]">
          {filteredFilms.map((film, index) => (
            <FilmCard key={film.id || (film as any)._id || index} film={film} priority={index === 0} />
          ))}
        </div>
      ) : (
        /* Empty State UI */
        <div className="w-full py-16 px-4 text-center space-y-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto text-amber-500 shadow-xs">
            <SearchX className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 tracking-normal">
              هیچ ئەنجامێک بۆ ئەم گەڕانە نەدۆزرایەوە
            </h3>
            <p className="text-xs sm:text-sm font-sirwan text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {searchQuery
                ? `هیچ فیلمێک بە وشەی «${searchQuery}» لەم بەشەدا نەدۆزرایەوە.`
                : 'هیچ فیلمێک لەم پۆلێنەدا بەردەست نییە.'}
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-900 dark:text-amber-400 hover:text-zinc-950 dark:hover:text-zinc-950 border border-amber-500/30 text-xs font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs select-none"
            >
              <X className="w-3.5 h-3.5" />
              <span>پاککردنەوەی گەڕان و پیشاندانی هەمووی</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
