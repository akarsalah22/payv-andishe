"use client";

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { Article } from '@/data/articles';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const coverSrc =
    article.coverImage ||
    (article as any).image ||
    article.imageUrl ||
    '/placeholder-article.jpg';

  const readingTimeText =
    (article as any).readingTime ||
    article.readTime ||
    '٥ خولەک';

  return (
    <Link
      href={`/articles/${article.slug}`}
      dir="rtl"
      className="relative block w-full aspect-[2/1] sm:aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer border border-white/10 bg-zinc-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 active:scale-[0.98] select-none tap-highlight-transparent"
    >
      {/* 100% Fill Image Background with Dark Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-xl sm:rounded-2xl">
        <img
          src={coverSrc}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/placeholder-article.jpg') {
              target.src = '/placeholder-article.jpg';
            }
          }}
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 transition-opacity duration-300" />
      </div>

      {/* Top Badges (Header) */}
      <div className="absolute top-2 sm:top-3 inset-x-0 px-2.5 sm:px-3 flex items-center justify-between z-20 pointer-events-none" dir="rtl">
        {/* Category & Resource Badges on the right */}
        <div className="flex items-center gap-1.5">
          <span className="shrink-0 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold font-sirwan rounded-full bg-amber-500 text-zinc-950 shadow-md">
            {article.category}
          </span>
          {article.pdfUrl && (
            <span className="shrink-0 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold font-sans rounded-full bg-rose-600/90 text-white shadow-sm">
              PDF
            </span>
          )}
        </div>

        {/* Reading Time Badge on the left */}
        <span className="shrink-0 inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-medium font-sirwan rounded-full bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10 shadow-sm">
          <svg className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{readingTimeText}</span>
        </span>
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-4 z-20 flex flex-col gap-0.5 sm:gap-1 text-right font-sirwan" dir="rtl">
        <h3 className="text-xs sm:text-base font-bold font-peshang text-white group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug">
          {article.title}
        </h3>
        <p className="text-[10px] sm:text-xs text-zinc-300/90 line-clamp-1 sm:line-clamp-2 leading-relaxed">
          {article.excerpt || (article as any).summary || (article as any).description}
        </p>
        <div className="mt-0.5 sm:mt-1 inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
          <span>خوێندنەوەی وتار</span>
          <ChevronLeft className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2} />
        </div>
      </div>
    </Link>
  );
}
