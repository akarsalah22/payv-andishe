export function HorizontalFilmCardSkeleton() {
  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-stone-200/80 dark:border-zinc-800/70 bg-white/70 dark:bg-[#16171b] p-3.5 sm:p-4 flex flex-row gap-3.5 sm:gap-4 overflow-hidden text-right min-h-[156px] sm:min-h-[172px] select-none animate-pulse"
      aria-hidden="true"
    >
      {/* Right Side: Poster thumbnail with matching 2/3 aspect ratio */}
      <div className="relative w-24 sm:w-28 md:w-32 shrink-0 aspect-[2/3] rounded-xl overflow-hidden bg-stone-200/60 dark:bg-zinc-800/40" />

      {/* Left Side: Info & Button */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="space-y-2">
          {/* Title line */}
          <div className="h-5 sm:h-6 rounded-md bg-stone-200/60 dark:bg-zinc-800/40 w-3/4" />
          {/* Meta line */}
          <div className="h-3.5 rounded-md bg-stone-200/60 dark:bg-zinc-800/40 w-1/3" />
          {/* Synopsis (2 lines) */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 rounded-md bg-stone-200/50 dark:bg-zinc-800/30 w-full" />
            <div className="h-3 rounded-md bg-stone-200/50 dark:bg-zinc-800/30 w-4/5" />
          </div>
        </div>

        {/* Button placeholder */}
        <div className="pt-2 sm:pt-3">
          <div className="h-7 w-36 rounded-full bg-stone-200/60 dark:bg-zinc-800/40" />
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
      className="rounded-2xl border border-stone-200/80 dark:border-zinc-800/70 bg-white/70 dark:bg-[#16171b] p-5 flex flex-col justify-between min-h-[350px] animate-pulse text-right select-none"
      aria-hidden="true"
    >
      <div className="space-y-4">
        {/* Aspect Ratio Cover (16:9) */}
        <div className="relative aspect-video w-full rounded-xl bg-stone-200/60 dark:bg-zinc-800/40 overflow-hidden" />

        {/* Meta Line */}
        <div className="flex items-center gap-3">
          <div className="h-3.5 w-24 rounded-md bg-stone-200/60 dark:bg-zinc-800/40" />
          <div className="h-3.5 w-20 rounded-md bg-stone-200/60 dark:bg-zinc-800/40" />
        </div>

        {/* Title & Excerpt */}
        <div className="space-y-2">
          <div className="h-5 bg-stone-200/60 dark:bg-zinc-800/40 rounded-md w-11/12" />
          <div className="h-3.5 bg-stone-200/50 dark:bg-zinc-800/30 rounded-md w-full" />
          <div className="h-3.5 bg-stone-200/50 dark:bg-zinc-800/30 rounded-md w-4/5" />
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-4 mt-4 border-t border-stone-200/80 dark:border-zinc-800/70 flex items-center justify-between">
        <div className="h-4 w-24 rounded-md bg-stone-200/60 dark:bg-zinc-800/40" />
        <div className="h-3.5 w-16 rounded-md bg-stone-200/50 dark:bg-zinc-800/30" />
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
