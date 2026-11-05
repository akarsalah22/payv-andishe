export function HorizontalFilmCardSkeleton() {
  return (
    <div
      dir="rtl"
      className="relative w-full aspect-[2/3] overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900 shadow-md select-none animate-pulse"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-stone-200/20 dark:bg-zinc-800/40" />
      {/* Category tag skeleton */}
      <div className="absolute top-2 right-2 h-4 w-12 rounded-md bg-zinc-700/60" />
      {/* Bottom title skeleton */}
      <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3.5 space-y-1.5">
        <div className="h-3.5 sm:h-4 w-3/4 rounded bg-zinc-700/60" />
      </div>
    </div>
  );
}

export function FilmCardSkeleton() {
  return <HorizontalFilmCardSkeleton />;
}

export function ArticleCardSkeleton() {
  return (
    <article
      dir="rtl"
      className="flex flex-col w-full overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 shadow-sm select-none animate-pulse"
      aria-hidden="true"
    >
      <div className="w-full h-52 sm:h-60 bg-zinc-200/60 dark:bg-zinc-800/60" />
      <div className="p-4 sm:p-5 flex flex-col gap-2.5">
        <div className="h-4 w-3/4 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-full rounded-md bg-zinc-200/70 dark:bg-zinc-800/70" />
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
          <div className="h-3 w-20 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
        </div>
      </div>
    </article>
  );
}

export function FilmsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full" dir="rtl">
      {Array.from({ length: count }).map((_, i) => (
        <HorizontalFilmCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ArticlesGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full" dir="rtl">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
