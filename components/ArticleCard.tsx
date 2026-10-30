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
      className="group rounded-2xl border border-stone-200 dark:border-zinc-800/70 hover:border-amber-500/30 dark:hover:border-amber-500/30 bg-white dark:bg-[#16171b] p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] flex flex-col justify-between text-right select-none tap-highlight-transparent"
    >
      <div className="space-y-4">
        {/* Aspect Ratio Cover Image (16:9) with Skeleton Loader */}
        <Link
          href={`/articles/${article.slug}`}
          className="relative aspect-video w-full rounded-xl overflow-hidden block bg-stone-200 dark:bg-zinc-800 shadow-2xs"
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading={priority ? undefined : "lazy"}
          />
          {/* Subtle Ambient Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Pill Tag */}
          <div className="absolute top-2.5 start-2.5">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold font-sirwan bg-[#121316]/85 text-[#f3c88a] backdrop-blur-md border border-amber-500/30 shadow-xs">
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
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors leading-normal line-clamp-2">
            <Link href={`/articles/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Footer Action: درێژەی بابەت */}
      <div className="pt-4 mt-4 border-t border-stone-200/80 dark:border-zinc-800/70 flex items-center justify-between">
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold font-sirwan text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none"
        >
          <span>درێژەی بابەت</span>
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
        </Link>

        <span className="text-[11px] font-sirwan text-zinc-400 dark:text-zinc-500">
          {article.author}
        </span>
      </div>
    </article>
  );
}

