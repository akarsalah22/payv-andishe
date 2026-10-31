"use client";

import Link from 'next/link';
import { Clock, Calendar, ChevronLeft } from 'lucide-react';
import type { Article } from '@/data/articles';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const coverSrc =
    article.coverImage ||
    (article as any).image ||
    article.imageUrl ||
    '/placeholder-article.jpg';

  return (
    <article
      dir="rtl"
      className="bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/40 dark:hover:border-amber-400/30 active:scale-[0.98] select-none tap-highlight-transparent"
    >
      {/* Classic Editorial / Blog Landscape Header */}
      <Link
        href={`/articles/${article.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl sm:rounded-xl bg-zinc-100 dark:bg-zinc-800 block cursor-pointer"
      >
        <img
          src={coverSrc}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/placeholder-article.jpg') {
              target.src = '/placeholder-article.jpg';
            }
          }}
        />

        {/* Subtle Ambient Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        {/* Category Pill Tag on top of image */}
        <div className="absolute top-3 start-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold font-sirwan bg-black/75 text-amber-300 dark:text-amber-400 backdrop-blur-md border border-amber-500/30 shadow-xs transition-colors duration-200 hover:bg-amber-500/20">
            {article.category}
          </span>
        </div>
      </Link>

      {/* Article Content: Meta, Title, Excerpt & Read Action */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between text-right space-y-3">
        <div className="space-y-2">
          {/* Article Meta Bar (Reading time, Date, Author) */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
              <span>{article.readTime}</span>
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" strokeWidth={1.75} />
              <span>{article.date}</span>
            </span>
            {article.author && (
              <>
                <span className="text-zinc-400 dark:text-zinc-600">•</span>
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">{article.author}</span>
              </>
            )}
          </div>

          {/* Article Title */}
          <h3 className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
            <Link href={`/articles/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Footer Action: Alive & responsive button */}
        <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <Link
            href={`/articles/${article.slug}`}
            className="group/btn inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs sm:text-sm font-medium rounded-xl bg-amber-500/15 text-amber-900 border border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 hover:bg-amber-500 hover:text-black hover:shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all duration-200 select-none cursor-pointer"
          >
            <span>خوێندنەوەی وتار</span>
            <ChevronLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:-translate-x-1" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </article>
  );
}
