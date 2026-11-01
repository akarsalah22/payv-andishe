export function HorizontalFilmCardSkeleton() {
  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-stone-200/80 dark:border-zinc-800/70 bg-white/70 dark:bg-[#16171b] p-3.5 sm:p-4 flex flex-row md:flex-col items-center md:items-stretch gap-3 md:gap-2.5 overflow-hidden text-right select-none animate-pulse"
      aria-hidden="true"
    >
      {/* Right Side: Poster thumbnail with matching dimensions */}
      <div className="relative w-20 h-28 sm:w-28 sm:h-40 md:w-full md:aspect-[2/3] md:h-80 shrink-0 rounded-xl overflow-hidden bg-stone-200/60 dark:bg-zinc-800/40" />

      {/* Left Side: Info & Button */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch md:self-auto py-0.5 md:py-0 md:space-y-2">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Title line */}
          <div className="h-4 sm:h-5 md:h-6 rounded-md bg-stone-200/60 dark:bg-zinc-800/40 w-3/4" />
          {/* Meta line */}
          <div className="h-3 sm:h-3.5 rounded-md bg-stone-200/60 dark:bg-zinc-800/40 w-1/2 md:w-1/3" />
          {/* Synopsis (hidden on mobile, visible on desktop) */}
          <div className="hidden md:block space-y-1.5 pt-1">
            <div className="h-3 rounded-md bg-stone-200/50 dark:bg-zinc-800/30 w-full" />
            <div className="h-3 rounded-md bg-stone-200/50 dark:bg-zinc-800/30 w-4/5" />
          </div>
        </div>

        {/* Button placeholder */}
        <div className="pt-2 md:pt-2.5 md:mt-2.5 md:border-t md:border-stone-200/60 md:dark:border-zinc-800/60">
          <div className="h-8 md:h-9 w-24 md:w-full rounded-xl bg-stone-200/60 dark:bg-zinc-800/40" />
        </div>
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
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900 shadow-md select-none animate-pulse"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-stone-200/20 dark:bg-zinc-800/40" />
      <div className="absolute top-2.5 sm:top-3 inset-x-0 px-2.5 sm:px-3 flex items-center justify-between">
        <div className="h-5 w-12 rounded-full bg-zinc-700/60" />
        <div className="h-5 w-14 rounded-full bg-zinc-700/60" />
      </div>
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex flex-col gap-1.5">
        <div className="h-4 w-3/4 rounded bg-zinc-700/60" />
        <div className="h-3 w-full rounded bg-zinc-700/40" />
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
