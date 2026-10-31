"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Send, ChevronLeft } from 'lucide-react';
import type { Film } from '@/data/films';
import type { Article } from '@/data/articles';
import { ArticleCard } from './ArticleCard';

interface HomeContentProps {
  films: Film[];
  articles: Article[];
}

const CATEGORIES = ['هەمووی', 'سینەما', 'ئەنیمەیشن', 'کتێب و وتار'] as const;
type CategoryType = (typeof CATEGORIES)[number];

export function HomeContent({ films, articles }: HomeContentProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('هەمووی');

  const displayedFilms = useMemo(() => {
    if (activeCategory === 'هەمووی') return films.slice(0, 4);
    if (activeCategory === 'سینەما') {
      return films.filter((f) => f.category === 'سینەمایی' || f.category === 'کورتە فیلم');
    }
    if (activeCategory === 'ئەنیمەیشن') {
      return films.filter((f) => f.category === 'ئەنیمەیشن');
    }
    return [];
  }, [activeCategory, films]);

  const showCinemaSection = activeCategory === 'هەمووی' || activeCategory === 'سینەما' || activeCategory === 'ئەنیمەیشن';
  const showArticlesSection = activeCategory === 'هەمووی' || activeCategory === 'کتێب و وتار';

  return (
    <div className="w-full space-y-16 sm:space-y-24" dir="rtl">
      {/* Quick Filter / Category Pills (Horizontal scrolling on mobile) */}
      <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-1">
        <div className="inline-flex items-center gap-2 p-1 rounded-full bg-stone-100/60 dark:bg-zinc-900/50 border border-[#ede8e1] dark:border-zinc-800/80">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium font-sirwan tracking-normal whitespace-nowrap transition-all duration-200 ease-in-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent ${
                  isActive
                    ? 'bg-[#d49757] text-zinc-950 font-bold border border-[#d49757] shadow-xs'
                    : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-[#ede8e1]/50 dark:hover:bg-zinc-800/40'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Cinema & Animation Section (Real Responsive Card Grid: 2 cols on mobile, 4 on desktop) */}
      {showCinemaSection && displayedFilms.length > 0 && (
        <section className="w-full space-y-6">
          <div className="flex items-end justify-between border-b border-[#ede8e1] dark:border-zinc-800/70 pb-4">
            <div>
              <span className="text-xs font-semibold font-sirwan text-[#d49757] tracking-normal block mb-1">
                سینەما و ئەنیمەیشن
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
                {activeCategory === 'ئەنیمەیشن'
                  ? 'ئەنیمەیشنە هەڵبژێردراوەکان'
                  : activeCategory === 'سینەما'
                  ? 'شاکارە سینەمایییەکان'
                  : 'شاکارە هەڵبژێردراوەکان'}
              </h2>
            </div>

            <Link
              href="/films"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium font-sirwan text-zinc-600 dark:text-zinc-400 hover:text-[#d49757] dark:hover:text-[#d49757] tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent"
            >
              <span>بینینی هەمووی</span>
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedFilms.map((film, index) => (
              <div
                key={film.id}
                className="group rounded-2xl border border-[#ede8e1] dark:border-zinc-800/80 bg-white/70 dark:bg-[#16171b] p-3 sm:p-3.5 transition-all duration-200 hover:border-[#d49757]/40 dark:hover:border-[#d49757]/30 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] flex flex-col justify-between select-none tap-highlight-transparent"
              >
                <div className="space-y-3">
                  {/* Poster container with ambient overlay */}
                  <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-stone-200 dark:bg-zinc-800 shadow-xs">
                    <img
                      src={film.posterUrl || '/placeholder.jpg'}
                      alt={film.titleKurdish}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== '/placeholder.jpg') {
                          target.src = '/placeholder.jpg';
                        }
                      }}
                    />
                    {/* Ambient Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    {/* Top Start: Genre Badge */}
                    <div className="absolute top-2 start-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium font-sirwan bg-black/60 backdrop-blur-md text-white border border-white/10 tracking-normal">
                        {film.genres[0]}
                      </span>
                    </div>

                    {/* Top End: Year */}
                    <div className="absolute top-2 end-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium font-sans bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {film.year}
                      </span>
                    </div>

                    {/* Bottom Duration info */}
                    <div className="absolute bottom-2 start-2 end-2 text-right">
                      <span className="text-[11px] text-zinc-300 font-sans font-medium drop-shadow-xs">
                        {film.duration}
                      </span>
                    </div>
                  </div>

                  {/* Content details (Unified baseline for Kurdish typography) */}
                  <div className="space-y-1 text-right">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#d49757] transition-colors leading-normal">
                      {film.titleKurdish}
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-sans truncate">
                      {film.originalTitle}
                    </p>
                  </div>
                </div>

                {/* Direct Telegram Action Button */}
                <div className="pt-3 mt-2 border-t border-[#ede8e1]/70 dark:border-zinc-800/70">
                  <a
                    href={film.telegramPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 sm:py-2 rounded-xl bg-[#d49757]/10 hover:bg-[#d49757] text-[#d49757] hover:text-zinc-950 border border-[#d49757]/25 text-xs font-semibold font-sirwan tracking-normal transition-transform duration-150 ease-out active:scale-95 shadow-2xs cursor-pointer touch-manipulation select-none"
                  >
                    <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>بینین لە تێلیگرام</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Literature & Articles Grid (Real Editorial Cards Feed) */}
      {showArticlesSection && (
        <section className="w-full space-y-6">
          <div className="flex items-end justify-between border-b border-[#ede8e1] dark:border-zinc-800/70 pb-4">
            <div>
              <span className="text-xs font-semibold font-sirwan text-[#d49757] tracking-normal block mb-1">
                ئەدەب و فیکر
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
                نوێترین وتار و خوێندنەوەکان
              </h2>
            </div>

            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium font-sirwan text-zinc-600 dark:text-zinc-400 hover:text-[#d49757] dark:hover:text-[#d49757] tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent"
            >
              <span>گشت وتارەکان</span>
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article, index) => (
              <ArticleCard key={article.id} article={article} priority={index === 0} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

