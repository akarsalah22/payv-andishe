import { ArticleCardSkeleton } from '@/components/Skeletons';

export default function ArticlesLoading() {
  return (
    <div
      dir="rtl"
      className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-10 space-y-10 text-right animate-pulse"
      aria-busy="true"
      aria-label="چاوەڕوان بە بۆ بارکردنی وتارەکان..."
    >
      {/* Breadcrumb Skeleton */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-stone-200/80 dark:border-zinc-800/80">
        <div className="h-4 w-32 rounded-md bg-stone-200/60 dark:bg-zinc-800/40" />
        <div className="h-4 w-20 rounded-md bg-stone-200/60 dark:bg-zinc-800/40" />
      </div>

      {/* Header Skeleton */}
      <div className="w-full max-w-2xl text-center space-y-3 py-2">
        <div className="h-4 w-24 rounded-md bg-stone-200/60 dark:bg-zinc-800/40 mx-auto" />
        <div className="h-8 sm:h-10 w-56 rounded-xl bg-stone-200/60 dark:bg-zinc-800/40 mx-auto" />
        <div className="h-4 w-3/4 rounded-md bg-stone-200/60 dark:bg-zinc-800/40 mx-auto" />
      </div>

      {/* Filter pills skeleton */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-stone-200/60 dark:bg-zinc-800/40" />
        ))}
      </div>

      {/* Real Articles Grid Skeleton matching ArticlesArchive */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[350px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
