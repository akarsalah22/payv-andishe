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
      className="relative w-full aspect-[2/1] sm:aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900 shadow-sm select-none animate-pulse"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-stone-200/20 dark:bg-zinc-800/40" />
      <div className="absolute top-2 sm:top-3 inset-x-0 px-2 sm:px-3 flex items-center justify-between">
        <div className="h-4 sm:h-5 w-10 sm:w-12 rounded-full bg-zinc-700/60" />
        <div className="h-4 sm:h-5 w-12 sm:w-14 rounded-full bg-zinc-700/60" />
      </div>
      <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-4 flex flex-col gap-1 sm:gap-1.5">
        <div className="h-3 sm:h-4 w-3/4 rounded bg-zinc-700/60" />
        <div className="h-2.5 sm:h-3 w-full rounded bg-zinc-700/40" />
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
