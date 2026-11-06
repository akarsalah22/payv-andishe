"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import type { Article } from '@/data/articles';
import { FavoriteButton } from './FavoriteButton';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const initialCover =
    article.coverImage ||
    (article as any).image ||
    article.imageUrl ||
    '/placeholder-article.jpg';
  const [coverSrc, setCoverSrc] = useState(initialCover);

  const readingTimeText =
    (article as any).readingTime ||
    article.readTime ||
    '٥ خولەک';

  return (
    <Link
      href={`/articles/${article.slug}`}
      dir="rtl"
      className="group flex flex-col w-full h-full overflow-hidden rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/80 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 active:scale-[0.99] select-none tap-highlight-transparent text-right"
    >
      {/* 1. Dedicated Image Container with object-contain to prevent cropping book covers/sheets */}
      <div className="relative w-full h-52 sm:h-60 overflow-hidden bg-zinc-100/90 dark:bg-zinc-950/60 flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800/60 p-2.5 sm:p-3">
        {/* Crisp foreground image: 100% visible, preserves original aspect ratio without aggressive cropping */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={coverSrc}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-contain p-1.5 rounded-lg transition-transform duration-500 ease-out group-hover:scale-105"
            onError={() => {
              if (coverSrc !== '/placeholder-article.jpg') {
                setCoverSrc('/placeholder-article.jpg');
              }
            }}
          />
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-0 px-2.5 sm:px-3 flex items-center justify-between z-20 pointer-events-none" dir="rtl">
          {/* Category & PDF Badges */}
          <div className="flex items-center gap-1.5">
            <span className="shrink-0 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold font-sirwan rounded-full bg-amber-500 text-zinc-950 shadow-sm">
              {article.category}
            </span>
            {article.pdfUrl && (
              <span className="shrink-0 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold font-sans rounded-full bg-rose-600 text-white shadow-sm">
                PDF
              </span>
            )}
          </div>

          {/* Reading Time Badge */}
          <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] sm:text-[11px] font-medium font-sirwan rounded-full bg-black/60 dark:bg-black/70 backdrop-blur-md text-zinc-200 border border-white/10 shadow-sm">
            <svg className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{readingTimeText}</span>
          </span>
        </div>

        {/* Quick Save Bookmark Button */}
        <div className="absolute bottom-2.5 left-2.5 z-20">
          <FavoriteButton
            item={{
              id: article.id || article.slug,
              title: article.title,
              imageUrl: coverSrc,
              type: 'writing',
              slug: article.slug || article.id,
              category: article.category,
            }}
          />
        </div>
      </div>

      {/* 2. Dedicated Text & Content Area (separated from the image to prevent clashing) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 text-right font-sirwan" dir="rtl">
        <div className="space-y-1.5">
          <h3 className="text-sm sm:text-base font-bold font-peshang text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {article.excerpt || (article as any).summary || (article as any).description}
          </p>
        </div>

        {/* Footer Meta Row */}
        <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {article.date || 'ئەرشیڤی وتار'}
          </span>
          <div className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 group-hover:text-amber-500 transition-colors">
            <span>خوێندنەوەی وتار</span>
            <ChevronLeft className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={2} />
          </div>
        </div>
      </div>
    </Link>
  );
}
