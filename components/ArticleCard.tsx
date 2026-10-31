import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ChevronLeft } from 'lucide-react';
import type { Article } from '@/data/articles';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const imageSource = article.coverImage || article.imageUrl;

  return (
    <article
      dir="rtl"
      className="bg-white/90 border border-amber-200/60 shadow-sm dark:bg-zinc-900/90 dark:border-zinc-800 dark:shadow-none rounded-2xl overflow-hidden p-3.5 sm:p-4 flex flex-row md:flex-col items-center md:items-stretch gap-3 md:gap-2.5 justify-between hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-md transition-all select-none group"
    >
      {/* Cover Image Thumbnail (Compact row on mobile, toned down aspect-[16/10] on desktop) */}
      <Link
        href={`/articles/${article.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-full md:aspect-[16/10] md:h-44 shrink-0 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 shadow-xs border border-amber-100/60 dark:border-zinc-800/80 block cursor-pointer"
      >
        {/* Shimmer skeleton placeholder */}
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-200 via-stone-100 to-stone-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 animate-pulse pointer-events-none" />
        <Image
          src={imageSource}
          alt={article.title}
          fill
          priority={priority}
          unoptimized={imageSource?.startsWith('data:')}
          sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? undefined : "lazy"}
        />
        {/* Subtle Ambient Hover Overlay (Desktop only) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none hidden md:block" />

        {/* Category Pill Tag (Desktop only on top of image, on mobile placed in meta bar) */}
        <div className="absolute top-2.5 start-2.5 hidden md:block">
          <span className="px-2 py-0.5 rounded-lg text-xs font-semibold font-sirwan bg-black/75 text-amber-300 dark:text-amber-400 backdrop-blur-md border border-amber-500/30 shadow-xs">
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
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-900 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-500/25 font-medium text-xs md:hidden">
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

          {/* Excerpt (hidden on mobile to keep compact row height, visible on desktop) */}
          <p className="hidden md:block line-clamp-2 text-xs md:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Footer Action: Compact button */}
        <div className="pt-2 md:pt-2.5 md:mt-2.5 md:border-t md:border-amber-100 md:dark:border-zinc-800">
          <Link
            href={`/articles/${article.slug}`}
            className="inline-flex items-center justify-center gap-1.5 w-auto self-start md:w-full py-2 px-3 text-xs md:text-sm font-medium rounded-xl bg-amber-500/15 text-amber-900 hover:bg-amber-500 hover:text-black border border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-black dark:border-amber-500/20 transition-colors select-none shadow-2xs hover:shadow-xs"
          >
            <span>خوێندنەوەی وتار</span>
            <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </article>
  );
}
