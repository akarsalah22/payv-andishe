import { FilmsGridSkeleton, ArticlesGridSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <div
      dir="rtl"
      className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-12 sm:py-20 space-y-16 sm:space-y-24 text-right animate-fade-in"
      aria-busy="true"
      aria-label="چاوەڕوان بە بۆ بارکردنی ناوەڕۆک..."
    >
      {/* Hero Skeleton */}
      <div className="w-full max-w-2xl mx-auto text-center space-y-4 pt-2 sm:pt-6 animate-pulse">
        <div className="h-10 sm:h-12 bg-stone-200/80 dark:bg-zinc-800/60 rounded-2xl w-3/4 mx-auto" />
        <div className="h-4 sm:h-5 bg-stone-200/60 dark:bg-zinc-800/40 rounded-xl w-5/6 mx-auto" />
        <div className="flex items-center justify-center gap-3 pt-3">
          <div className="h-10 w-36 rounded-xl bg-stone-200/80 dark:bg-zinc-800/60" />
          <div className="h-10 w-36 rounded-xl bg-stone-200/60 dark:bg-zinc-800/40" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="w-full flex justify-center py-1">
        <div className="h-9 w-72 rounded-full bg-stone-200/70 dark:bg-zinc-800/50 animate-pulse" />
      </div>

      {/* Cinema section skeleton */}
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between border-b border-[#ede8e1] dark:border-zinc-800/70 pb-4">
          <div className="h-6 w-44 rounded-lg bg-stone-200/80 dark:bg-zinc-800/60 animate-pulse" />
          <div className="h-4 w-20 rounded-md bg-stone-200/60 dark:bg-zinc-800/40 animate-pulse" />
        </div>
        <FilmsGridSkeleton count={4} />
      </div>

      {/* Articles section skeleton */}
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between border-b border-[#ede8e1] dark:border-zinc-800/70 pb-4">
          <div className="h-6 w-44 rounded-lg bg-stone-200/80 dark:bg-zinc-800/60 animate-pulse" />
          <div className="h-4 w-20 rounded-md bg-stone-200/60 dark:bg-zinc-800/40 animate-pulse" />
        </div>
        <ArticlesGridSkeleton count={3} />
      </div>
    </div>
  );
}

