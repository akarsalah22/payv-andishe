import Image from 'next/image';
import { Send } from 'lucide-react';
import type { Film } from '@/data/films';

interface FilmCardProps {
  film: Film;
  priority?: boolean;
}

export function FilmCard({ film, priority = false }: FilmCardProps) {
  return (
    <article
      dir="rtl"
      className="group relative rounded-2xl border border-stone-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 hover:border-amber-500/40 dark:hover:border-amber-500/30 p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] flex flex-col justify-between text-right overflow-hidden select-none tap-highlight-transparent"
    >
      <div className="space-y-4">
        {/* Movie Poster Thumbnail with defined 2:3 AspectRatio and Skeleton Loader */}
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-stone-200 dark:bg-zinc-800 shadow-xs">
          {/* Shimmer skeleton placeholder */}
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-200 via-stone-100 to-stone-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 animate-pulse pointer-events-none" />
          <Image
            src={film.posterUrl}
            alt={film.titleKurdish}
            fill
            priority={priority}
            unoptimized={film.posterUrl.startsWith('data:')}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading={priority ? undefined : "lazy"}
          />
          {/* Subtle Ambient Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

          {/* Badges Overlay on Poster */}
          <div className="absolute top-2.5 start-2.5">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold font-sirwan bg-black/70 text-amber-300 backdrop-blur-md border border-amber-500/30 shadow-xs">
              {film.genres[0]}
            </span>
          </div>

          <div className="absolute top-2.5 end-2.5">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-sans bg-black/70 text-zinc-100 backdrop-blur-md border border-white/10 shadow-xs">
              {film.year}
            </span>
          </div>

          {film.duration && (
            <div className="absolute bottom-2.5 start-2.5">
              <span className="text-[11px] text-zinc-300 font-sans font-medium drop-shadow-sm">
                {film.duration}
              </span>
            </div>
          )}
        </div>

        {/* Film Information & Synopsis */}
        <div className="space-y-2">
          {/* Kurdish Movie Title */}
          <h3 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-normal line-clamp-1">
            {film.titleKurdish}
          </h3>

          {/* Meta line: جۆر: [Genre] • ساڵ: [Year] */}
          <div className="flex items-center gap-2 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400">
            <span>جۆر: {film.genres.join('، ')}</span>
            <span>•</span>
            <span>ساڵ: {film.year}</span>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {film.description}
          </p>
        </div>
      </div>

      {/* Telegram Action Button (Polished button with icon) */}
      <div className="pt-4 mt-4 border-t border-stone-200/80 dark:border-zinc-800/80">
        <a
          href={film.telegramPostUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-zinc-950 font-bold font-sirwan text-xs sm:text-sm tracking-normal shadow-sm transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
        >
          <Send className="w-4 h-4" strokeWidth={1.75} />
          <span>بینینی فیلم لە تێلیگرام</span>
        </a>
      </div>
    </article>
  );
}
