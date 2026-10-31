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
      className="bg-white/90 border border-amber-200/60 shadow-sm dark:bg-zinc-900/90 dark:border-zinc-800 dark:shadow-none rounded-2xl overflow-hidden p-4 flex flex-col justify-between hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-md transition-all select-none group"
    >
      <div className="space-y-4">
        {/* Aspect Ratio Cover Image (16:9) with Fixed Height & Skeleton Loader */}
        <Link
          href={`/articles/${article.slug}`}
          className="relative w-full aspect-[16/9] sm:h-52 rounded-2xl overflow-hidden block bg-stone-100 dark:bg-zinc-800 shadow-xs border border-amber-100/60 dark:border-zinc-800/80"
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
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={priority ? undefined : "lazy"}
          />
          {/* Subtle Ambient Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Category Pill Tag */}
          <div className="absolute top-2.5 start-2.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold font-sirwan bg-black/75 text-amber-300 dark:text-amber-400 backdrop-blur-md border border-amber-500/30 shadow-xs">
              {article.category}
            </span>
          </div>
        </Link>

        {/* Article Meta Bar */}
        <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
            <span>{article.readTime}</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" strokeWidth={1.75} />
            <span>{article.date}</span>
          </span>
          {article.author && (
            <>
              <span>•</span>
              <span className="text-zinc-500 dark:text-zinc-400">{article.author}</span>
            </>
          )}
        </div>

        {/* Kurdish Title & Excerpt */}
        <div className="space-y-2 text-right">
          <h3 className="text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-normal line-clamp-2">
            <Link href={`/articles/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Footer Action: Attractive Button with Icon */}
      <div className="pt-4 mt-4 border-t border-amber-100 dark:border-zinc-800">
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-amber-500/15 text-amber-900 hover:bg-amber-500 hover:text-black border border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-black dark:border-amber-500/20 font-medium transition-colors select-none shadow-2xs hover:shadow-xs"
        >
          <span>خوێندنەوەی وتار</span>
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
        </Link>
      </div>
    </article>
  );
}
