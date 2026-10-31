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
      className="bg-white/90 border border-amber-200/60 shadow-sm dark:bg-zinc-900/90 dark:border-zinc-800 dark:shadow-none rounded-2xl overflow-hidden p-3.5 sm:p-4 flex flex-row md:flex-col items-center md:items-stretch gap-3 md:gap-2.5 justify-between hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-md transition-all select-none group"
    >
      {/* Poster Image Thumbnail (Compact row on mobile, toned down aspect-[16/10] on desktop) */}
      <a
        href={film.telegramPostUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="relative w-20 h-28 sm:w-24 sm:h-32 md:w-full md:aspect-[16/10] md:h-44 shrink-0 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 shadow-xs border border-amber-100/60 dark:border-zinc-800/80 block cursor-pointer"
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
          <span className="px-2 py-0.5 rounded-lg text-xs font-semibold font-sirwan bg-black/75 text-amber-300 dark:text-amber-400 backdrop-blur-md border border-amber-500/30 shadow-xs">
            {film.genres[0]}
          </span>
        </div>

        <div className="absolute top-2.5 end-2.5 hidden md:block">
          <span className="px-2 py-0.5 rounded-lg text-xs font-bold font-sans bg-black/75 text-zinc-100 dark:text-zinc-200 backdrop-blur-md border border-white/10 shadow-xs">
            {film.year}
          </span>
        </div>
      </a>

      {/* Film Content: Title, Metadata, Description & Action Button */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch md:self-auto py-0.5 md:py-0 text-right md:space-y-2">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Film Title */}
          <h3 className="text-base md:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-1 md:line-clamp-2">
            {film.titleKurdish}
          </h3>

          {/* Clean Inline Badges / Muted Metadata */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-900 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-500/25 font-medium text-xs">
              <FilmIcon className="w-3 h-3 text-amber-700 dark:text-amber-400" strokeWidth={1.75} />
              <span className="md:hidden">{film.genres[0]}</span>
              <span className="hidden md:inline">{film.genres.join('، ')}</span>
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-400 dark:text-zinc-500" strokeWidth={1.75} />
              <span>{film.year}</span>
            </span>
            {film.duration && (
              <>
                <span className="text-zinc-400 dark:text-zinc-600">•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400 dark:text-zinc-500" strokeWidth={1.75} />
                  <span>{film.duration}</span>
                </span>
              </>
            )}
          </div>

          {/* Description (hidden on mobile to keep compact row height, visible on desktop) */}
          <p className="hidden md:block line-clamp-2 text-xs md:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {film.description}
          </p>
        </div>

        {/* Action Button: Compact button */}
        <div className="pt-2 md:pt-2.5 md:mt-2.5 md:border-t md:border-amber-100 md:dark:border-zinc-800">
          <a
            href={film.telegramPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-auto self-start md:w-full py-2 px-3 text-xs md:text-sm font-medium rounded-xl bg-amber-500/15 text-amber-900 hover:bg-amber-500 hover:text-black border border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-black dark:border-amber-500/20 transition-colors select-none shadow-2xs hover:shadow-xs"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>بینینی فیلم لە تێلیگرام</span>
          </a>
        </div>
      </div>
    </article>
  );
}
