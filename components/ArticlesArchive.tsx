"use client";

import { useState, useMemo, useEffect } from 'react';
import { ArticleCard } from './ArticleCard';
import { ARTICLE_CATEGORIES, type Article, type ArticleCategory } from '@/data/articles';

interface ArticlesArchiveProps {
  initialArticles: Article[];
}

export function ArticlesArchive({ initialArticles }: ArticlesArchiveProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [activeCategory, setActiveCategory] = useState<'هەمووی' | ArticleCategory>('هەمووی');

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
        // fallback
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

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'هەمووی') return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory, articles]);

  return (
    <div className="w-full space-y-8" dir="rtl">
      {/* Interactive Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {ARTICLE_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium font-sirwan tracking-normal transition-all duration-200 ease-in-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs border border-amber-500'
                  : 'bg-white/70 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border border-stone-200 dark:border-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-amber-500/30'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Responsive Grid: 1 column on mobile, 2-3 columns on desktop */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[350px]">
        {filteredArticles.map((article, index) => (
          <ArticleCard key={article.id} article={article} priority={index === 0} />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="w-full py-16 text-center text-zinc-500 dark:text-zinc-400 text-sm font-sirwan tracking-normal">
          هیچ بابەتێک لەم پۆلێنەدا بەردەست نییە.
        </div>
      )}
    </div>
  );
}
