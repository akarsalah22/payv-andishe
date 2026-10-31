import Image from 'next/image';
import { Send, Calendar, Clock, Film as FilmIcon } from 'lucide-react';
import type { Film } from '@/data/films';

interface FilmCardProps {
  film: Film;
  priority?: boolean;
}

export function FilmCard({ film, priority = false }: FilmCardProps) {
  return (
    <article
      dir="rtl"
      className="bg-white/90 border border-amber-200/60 shadow-sm dark:bg-zinc-900/90 dark:border-zinc-800 dark:shadow-none rounded-xl md:rounded-2xl overflow-hidden p-2.5 sm:p-3 md:p-4 flex flex-row md:flex-col items-center md:items-stretch gap-3 sm:gap-3.5 md:gap-4 justify-between hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-md transition-all select-none group"
    >
      {/* Poster Image Thumbnail (Compact row on mobile, full aspect-[2/3] on desktop) */}
      <a
        href={film.telegramPostUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="relative w-20 h-28 sm:w-28 sm:h-36 md:w-full md:aspect-[2/3] md:h-72 shrink-0 rounded-lg md:rounded-2xl overflow-hidden bg-stone-100 dark:bg-zinc-800 shadow-xs border border-amber-100/60 dark:border-zinc-800/80 block cursor-pointer"
      >
        {/* Shimmer skeleton placeholder */}
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-200 via-stone-100 to-stone-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 animate-pulse pointer-events-none" />
        <Image
          src={film.posterUrl}
          alt={film.titleKurdish}
          fill
          priority={priority}
          unoptimized={film.posterUrl.startsWith('data:')}
          sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? undefined : "lazy"}
        />
        {/* Subtle Ambient Overlay (Desktop only) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none hidden md:block" />

        {/* Badges on Poster (hidden on compact mobile rows, visible on desktop cards) */}
        <div className="absolute top-2.5 start-2.5 hidden md:block">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold font-sirwan bg-black/75 text-amber-300 dark:text-amber-400 backdrop-blur-md border border-amber-500/30 shadow-xs">
            {film.genres[0]}
          </span>
        </div>

        <div className="absolute top-2.5 end-2.5 hidden md:block">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-sans bg-black/75 text-zinc-100 dark:text-zinc-200 backdrop-blur-md border border-white/10 shadow-xs">
            {film.year}
          </span>
        </div>
      </a>

      {/* Film Content: Title, Metadata, Description & Action Button */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch md:self-auto py-0.5 md:py-0 text-right">
        <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
          {/* Film Title */}
          <h3 className="text-sm sm:text-base md:text-lg font-semibold md:font-bold font-peshang text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-1">
            {film.titleKurdish}
          </h3>

          {/* Clean Inline Badges / Muted Metadata */}
          <div className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-md bg-amber-500/15 text-amber-900 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-500/25 font-medium text-[11px] sm:text-xs">
              <FilmIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-700 dark:text-amber-400" strokeWidth={1.75} />
              <span className="md:hidden">{film.genres[0]}</span>
              <span className="hidden md:inline">{film.genres.join('، ')}</span>
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-zinc-400 dark:text-zinc-500" strokeWidth={1.75} />
              <span>{film.year}</span>
            </span>
            {film.duration && (
              <>
                <span className="text-zinc-400 dark:text-zinc-600">•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-zinc-400 dark:text-zinc-500" strokeWidth={1.75} />
                  <span>{film.duration}</span>
                </span>
              </>
            )}
          </div>

          {/* Description (hidden on mobile to keep 3 items strictly fitting on screen, visible on desktop) */}
          <p className="hidden md:block text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {film.description}
          </p>
        </div>

        {/* Action Button: Compact inline button on mobile, full width on desktop */}
        <div className="pt-2 md:pt-4 md:mt-4 md:border-t md:border-amber-100 md:dark:border-zinc-800">
          <a
            href={film.telegramPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-auto self-start md:w-full py-1.5 px-3 md:py-2.5 md:px-4 rounded-lg md:rounded-xl bg-amber-500/15 text-amber-900 hover:bg-amber-500 hover:text-black border border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-black dark:border-amber-500/20 text-xs md:text-sm font-medium transition-colors select-none shadow-2xs hover:shadow-xs"
          >
            <Send className="w-3 h-3 md:w-4 md:h-4" strokeWidth={1.75} />
            <span>بینینی فیلم لە تێلیگرام</span>
          </a>
        </div>
      </div>
    </article>
  );
}
