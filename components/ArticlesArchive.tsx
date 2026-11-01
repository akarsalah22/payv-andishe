"use client";

import { useState, useMemo, useEffect, useCallback, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, X, SearchX } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { ARTICLE_CATEGORIES, type Article, type ArticleCategory } from '@/data/articles';
import { filterArticles } from '@/lib/search';

interface ArticlesArchiveProps {
  initialArticles: Article[];
}

export function ArticlesArchive({ initialArticles }: ArticlesArchiveProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [articles, setArticles] = useState<Article[]>(initialArticles);

  // Read initial query parameters from URL
  const queryParam = searchParams.get('q') || searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'هەمووی';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState<'هەمووی' | ArticleCategory>(
    ARTICLE_CATEGORIES.includes(categoryParam as 'هەمووی' | ArticleCategory)
      ? (categoryParam as 'هەمووی' | ArticleCategory)
      : 'هەمووی'
  );

  // Synchronize state when URL query parameters change externally
  const qFromParams = searchParams.get('q') || searchParams.get('search') || '';
  const categoryFromParams = searchParams.get('category') || 'هەمووی';

  useEffect(() => {
    setSearchQuery(qFromParams);
    if (ARTICLE_CATEGORIES.includes(categoryFromParams as 'هەمووی' | ArticleCategory)) {
      setActiveCategory(categoryFromParams as 'هەمووی' | ArticleCategory);
    }
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

  // Fetch updated articles from API on mount
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setArticles(data);
            try {
              localStorage.setItem('payvandishe_articles', JSON.stringify(data));
            } catch {
              // ignore
            }
            return;
          }
        }
      } catch {
        // fallback to initialArticles
      }

      try {
        const stored = localStorage.getItem('payvandishe_articles');
        if (stored) {
          const parsed: Article[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setArticles(parsed);
          }
        }
      } catch {
        // fallback to initialArticles
      }
    };

    loadArticles();
  }, []);

  // Filtered articles using Kurdish/Arabic normalization
  const filteredArticles = useMemo(() => {
    return filterArticles(articles, searchQuery, activeCategory);
  }, [articles, searchQuery, activeCategory]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams(val, activeCategory);
  };

  const handleCategoryChange = (category: 'هەمووی' | ArticleCategory) => {
    setActiveCategory(category);
    updateUrlParams(searchQuery, category);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    updateUrlParams('', activeCategory);
  };

  const handleResetAll = () => {
    setSearchQuery('');
    setActiveCategory('هەمووی');
    updateUrlParams('', 'هەمووی');
  };

  const hasActiveFilters = searchQuery.trim().length > 0 || activeCategory !== 'هەمووی';

  return (
    <div className="w-full space-y-8" dir="rtl">
      {/* Search Input Bar & Category Filters */}
      <div className="w-full max-w-2xl mx-auto space-y-5">
        {/* Search Input */}
        <div className="relative w-full group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="گەڕان لە نێو نووسین و وتارەکان (بە کوردی یان عەرەبی)..."
            className="w-full px-5 py-3.5 pr-12 pl-11 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 bg-white/90 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200/90 dark:border-white/10 outline-none transition-all duration-300 ease-in-out hover:border-amber-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/70 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-900/90 focus:ring-4 focus:ring-amber-500/20 focus:shadow-[0_0_25px_rgba(245,158,11,0.25)] font-sirwan"
            dir="rtl"
          />
          {/* Search Icon with synchronized hover state */}
          <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400 transition-colors duration-300 group-hover:text-amber-400 group-focus-within:text-amber-400">
            <Search className="w-5 h-5" strokeWidth={2} />
          </span>

          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="پاککردنەوەی گەڕان"
              aria-label="پاککردنەوەی گەڕان"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Category Pills (Responsive: Smooth horizontal scroll on mobile, centered wrap on desktop) */}
        <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-1 gap-2 flex-nowrap sm:flex-wrap px-1">
          {ARTICLE_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`shrink-0 px-4 py-2 sm:py-1.5 rounded-full text-xs sm:text-sm font-sirwan tracking-normal active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent transition-colors duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-black font-semibold shadow-xs'
                    : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 transition-colors'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Active Search Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs font-sirwan text-zinc-500 dark:text-zinc-400 px-1 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-3">
          <span>
            {filteredArticles.length} وتار دۆزرایەوە لە کۆی {articles.length}
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

      {/* Responsive Grid: 1 column of compact rows on mobile, 3 columns on desktop */}
      {filteredArticles.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 min-h-[350px]">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={article.id || (article as any)._id || index} article={article} priority={index === 0} />
          ))}
        </div>
      ) : (
        /* Empty State UI */
        <div className="w-full py-16 px-4 text-center space-y-4 rounded-2xl border border-amber-900/10 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto text-amber-500 shadow-xs">
            <SearchX className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 tracking-normal">
              هیچ ئەنجامێک بۆ ئەم گەڕانە نەدۆزرایەوە
            </h3>
            <p className="text-xs sm:text-sm font-sirwan text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {searchQuery
                ? `هیچ وتارێک بە وشەی «${searchQuery}» لەم بەشەدا نەدۆزرایەوە.`
                : 'هیچ بابەتێک لەم پۆلێنەدا بەردەست نییە.'}
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