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
      className="group rounded-2xl border border-stone-200 dark:border-zinc-800/80 hover:border-amber-500/40 dark:hover:border-amber-500/30 bg-white dark:bg-zinc-900/90 p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] flex flex-col justify-between text-right overflow-hidden select-none tap-highlight-transparent"
    >
      <div className="space-y-4">
        {/* Aspect Ratio Cover Image (16:9) with Skeleton Loader */}
        <Link
          href={`/articles/${article.slug}`}
          className="relative w-full aspect-video rounded-xl overflow-hidden block bg-stone-200 dark:bg-zinc-800 shadow-xs"
          tabIndex={-1}
          aria-hidden="true"
        >
          {/* Shimmer skeleton placeholder */}
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-200 via-stone-100 to-stone-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 animate-pulse pointer-events-none" />
          <Image
            src={imageSource}
            alt={article.title}
            fill
            priority={priority}
            unoptimized={imageSource?.startsWith('data:')}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading={priority ? undefined : "lazy"}
          />
          {/* Subtle Ambient Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Pill Tag */}
          <div className="absolute top-2.5 start-2.5">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold font-sirwan bg-black/70 text-amber-300 backdrop-blur-md border border-amber-500/30 shadow-xs">
              {article.category}
            </span>
          </div>
        </Link>

        {/* Article Meta Bar */}
        <div className="flex items-center gap-3 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.75} />
            <span>{article.readTime}</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" strokeWidth={1.75} />
            <span>{article.date}</span>
          </span>
        </div>

        {/* Kurdish Title & Excerpt */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-normal line-clamp-2">
            <Link href={`/articles/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Footer Action: درێژەی وتار as a polished badge button */}
      <div className="pt-4 mt-4 border-t border-stone-200/80 dark:border-zinc-800/80 flex items-center justify-between">
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-zinc-950 dark:hover:text-zinc-950 border border-amber-500/25 text-xs font-bold font-sirwan tracking-normal transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none group/btn"
        >
          <span>درێژەی وتار</span>
          <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-x-1" strokeWidth={2} />
        </Link>

        <span className="text-[11px] font-sirwan text-zinc-400 dark:text-zinc-500">
          {article.author}
        </span>
      </div>
    </article>
  );
}

