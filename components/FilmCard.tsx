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
      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden p-4 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-lg select-none group"
    >
      <div className="space-y-4">
        {/* Poster Image Container */}
        <div className="relative w-full aspect-[2/3] sm:h-72 rounded-2xl overflow-hidden bg-zinc-800 shadow-md">
          {/* Shimmer skeleton placeholder */}
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse pointer-events-none" />
          <Image
            src={film.posterUrl}
            alt={film.titleKurdish}
            fill
            priority={priority}
            unoptimized={film.posterUrl.startsWith('data:')}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={priority ? undefined : "lazy"}
          />
          {/* Subtle Ambient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Badges on Poster */}
          <div className="absolute top-2.5 start-2.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold font-sirwan bg-black/70 text-amber-400 backdrop-blur-md border border-amber-500/30 shadow-xs">
              {film.genres[0]}
            </span>
          </div>

          <div className="absolute top-2.5 end-2.5">
            <span className="px-2 py-1 rounded-lg text-xs font-bold font-sans bg-black/70 text-zinc-200 backdrop-blur-md border border-white/10 shadow-xs">
              {film.year}
            </span>
          </div>
        </div>

        {/* Film Title & Description */}
        <div className="space-y-2 text-right">
          <h3 className="text-lg font-bold font-peshang text-zinc-100 group-hover:text-amber-400 transition-colors leading-normal line-clamp-1">
            {film.titleKurdish}
          </h3>

          {/* Clean Inline Badges / Muted Metadata */}
          <div className="text-xs text-zinc-400 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <FilmIcon className="w-3.5 h-3.5 text-amber-400/80" strokeWidth={1.75} />
              <span>{film.genres.join('، ')}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.75} />
              <span>{film.year}</span>
            </span>
            {film.duration && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.75} />
                  <span>{film.duration}</span>
                </span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-400 line-clamp-2 leading-relaxed">
            {film.description}
          </p>
        </div>
      </div>

      {/* Action Button: Attractive Button with Icon */}
      <div className="pt-4 mt-4 border-t border-zinc-800">
        <a
          href={film.telegramPostUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black font-medium transition-colors select-none"
        >
          <Send className="w-4 h-4" strokeWidth={1.75} />
          <span>بینینی فیلم لە تێلیگرام</span>
        </a>
      </div>
    </article>
  );
}
