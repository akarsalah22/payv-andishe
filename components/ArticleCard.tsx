"use client";

import Link from 'next/link';
import { Clock, Calendar, ChevronLeft } from 'lucide-react';
import type { Article } from '@/data/articles';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const coverSrc = article.coverImage || article.imageUrl || (article as any).image || '/placeholder.jpg';

  return (
    <article
      dir="rtl"
      className="bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-sm rounded-2xl overflow-hidden p-3.5 sm:p-4 flex flex-row md:flex-col items-center md:items-stretch gap-3 md:gap-2.5 justify-between group transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/40 dark:hover:border-amber-400/30 active:scale-[0.98] select-none tap-highlight-transparent"
    >
      {/* Cover Image Thumbnail (Compact row on mobile, natural aspect-[16/10] on desktop) */}
      <Link
        href={`/articles/${article.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-full md:aspect-[16/10] shrink-0 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 shadow-xs border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-sm block cursor-pointer"
      >
        <img
          src={coverSrc}
          alt={article.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/placeholder.jpg') {
              target.src = '/placeholder.jpg';
            }
          }}
        />

        {/* Subtle Ambient Hover Overlay (Desktop only) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none hidden md:block" />

        {/* Category Pill Tag (Desktop only on top of image, on mobile placed in meta bar) */}
        <div className="absolute top-2.5 start-2.5 hidden md:block">
          <span className="px-2 py-0.5 rounded-lg text-xs font-semibold font-sirwan bg-black/75 text-amber-300 dark:text-amber-400 backdrop-blur-md border border-amber-500/30 shadow-xs transition-colors duration-200 hover:bg-amber-500/20">
            {article.category}
          </span>
        </div>
      </Link>

      {/* Article Content: Title, Category, Reading Time, Date & Read Action */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch md:self-auto py-0.5 md:py-0 text-right md:space-y-2">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Article Title */}
          <h3 className="text-base md:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
            <Link href={`/articles/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Article Meta Bar (Category badge, Reading time, Date) */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 flex-wrap">
            {/* Category Pill on Mobile (compact badge) */}
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-900 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-500/25 font-medium text-xs md:hidden transition-colors duration-200 hover:bg-amber-500/20">
              {article.category}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600 md:hidden">•</span>

            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
              <span>{article.readTime}</span>
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-400 dark:text-zinc-500" strokeWidth={1.75} />
              <span>{article.date}</span>
            </span>
            {article.author && (
              <>
                <span className="text-zinc-400 dark:text-zinc-600 hidden md:inline">•</span>
                <span className="text-zinc-500 dark:text-zinc-400 hidden md:inline">{article.author}</span>
              </>
            )}
          </div>

          {/* Excerpt directly below metadata on mobile & desktop */}
          <p className="text-xs md:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Footer Action: Alive & responsive button */}
        <div className="pt-2 md:pt-2.5 md:mt-2.5 md:border-t md:border-zinc-200/80 md:dark:border-zinc-800/80">
          <Link
            href={`/articles/${article.slug}`}
            className="group/btn inline-flex items-center justify-center gap-1.5 w-auto self-start md:w-full py-2 px-3 text-xs md:text-sm font-medium rounded-xl bg-amber-500/15 text-amber-900 border border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 hover:bg-amber-500 hover:text-black hover:shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all duration-200 select-none cursor-pointer"
          >
            <span>خوێندنەوەی وتار</span>
            <ChevronLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:-translate-x-1" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </article>
  );
}
