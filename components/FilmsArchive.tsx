"use client";

import { useState, useMemo, useEffect, useCallback, useTransition, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { X, SearchX, ChevronRight, ChevronLeft } from 'lucide-react';
import { FilmCard } from './FilmCard';
import { SearchBar, DEFAULT_SEARCH_CATEGORIES } from './SearchBar';
import type { Film } from '@/data/films';
import { filterFilms } from '@/lib/search';
import { DEFAULT_MOVIES_PAGE_SETTINGS, type MoviesPageSettings } from '@/data/pageSettings';

const ITEMS_PER_PAGE = 8;

function getPaginationItems(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: (number | 'ellipsis')[] = [];

  // Always show first page
  items.push(1);

  // Determine middle window around current
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) {
    items.push('ellipsis');
  }

  for (let i = left; i <= right; i++) {
    items.push(i);
  }

  if (right < total - 1) {
    items.push('ellipsis');
  }

  // Always show last page
  items.push(total);

  return items;
}

interface FilmsArchiveProps {
  initialFilms: Film[];
  pageSettings?: MoviesPageSettings;
}

export function FilmsArchive({ initialFilms, pageSettings }: FilmsArchiveProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const gridContainerRef = useRef<HTMLDivElement>(null);

  const [films, setFilms] = useState<Film[]>(initialFilms);

  // Read initial query parameters from URL
  const queryParam = searchParams.get('q') || searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'هەمووی';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Synchronize state when URL query parameters change externally
  const qFromParams = searchParams.get('q') || searchParams.get('search') || '';
  const categoryFromParams = searchParams.get('category') || 'هەمووی';

  useEffect(() => {
    setSearchQuery(qFromParams);
    setActiveCategory(categoryFromParams);
    setCurrentPage(1);
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

  const totalPages = Math.ceil(filteredFilms.length / ITEMS_PER_PAGE);
  const safeCurrentPage = totalPages <= 1 ? 1 : Math.min(Math.max(1, currentPage), totalPages);

  const paginatedFilms = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredFilms.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFilms, safeCurrentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;
    setCurrentPage(page);
    if (gridContainerRef.current) {
      const yOffset = -90; // offset for sticky navbar
      const y = gridContainerRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    updateUrlParams(val, activeCategory);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
    updateUrlParams(searchQuery, category);
  };

  const handleResetAll = () => {
    setSearchQuery('');
    setActiveCategory('هەمووی');
    setCurrentPage(1);
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
        placeholder={pageSettings?.searchPlaceholder || DEFAULT_MOVIES_PAGE_SETTINGS.searchPlaceholder}
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
        <div className="space-y-8">
          <div
            ref={gridContainerRef}
            className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5 lg:gap-6 min-h-[300px]"
          >
            {paginatedFilms.map((film, index) => (
              <FilmCard
                key={film.id || (film as any)._id || index}
                film={film}
                priority={index === 0 && safeCurrentPage === 1}
              />
            ))}
          </div>

          {/* Classic Minimalist Editorial Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10 mb-4 select-none">
              {/* Previous Page Button (Right side in RTL) */}
              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage <= 1}
                aria-label="لاپەڕەی پێشوو"
                className={`w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 transition-colors duration-150 ${
                  safeCurrentPage <= 1
                    ? 'opacity-35 pointer-events-none'
                    : 'hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer bg-transparent'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Page Number Buttons & Ellipsis */}
              {getPaginationItems(safeCurrentPage, totalPages).map((item, idx) => {
                if (item === 'ellipsis') {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="w-9 h-9 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-600 select-none font-medium"
                      aria-hidden="true"
                    >
                      ...
                    </span>
                  );
                }

                const isActive = item === safeCurrentPage;
                return (
                  <button
                    key={`page-${item}`}
                    type="button"
                    onClick={() => handlePageChange(item)}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`لاپەڕە ${item}`}
                    className={`w-9 h-9 rounded-lg tabular-nums text-sm font-medium transition-colors duration-150 flex items-center justify-center cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white border border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 font-semibold'
                        : 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 bg-transparent'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

              {/* Next Page Button (Left side in RTL) */}
              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage >= totalPages}
                aria-label="لاپەڕەی دواتر"
                className={`w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 transition-colors duration-150 ${
                  safeCurrentPage >= totalPages
                    ? 'opacity-35 pointer-events-none'
                    : 'hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer bg-transparent'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State UI */
        <div className="w-full py-16 px-4 text-center space-y-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto text-amber-500 shadow-xs">
            <SearchX className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 tracking-normal">
              {pageSettings?.emptyMessage || DEFAULT_MOVIES_PAGE_SETTINGS.emptyMessage}
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
