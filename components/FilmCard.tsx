import Image from 'next/image';
import { Send } from 'lucide-react';
import type { Film } from '@/data/films';

interface FilmCardProps {
  film: Film;
}

export function FilmCard({ film }: FilmCardProps) {
  return (
    <article
      dir="rtl"
      className="group relative rounded-2xl border border-[#ede8e1] dark:border-zinc-800/70 bg-white/70 dark:bg-[#16171b] p-3.5 sm:p-4 transition-all duration-200 hover:border-[#d49757]/40 dark:hover:border-[#d49757]/30 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] flex flex-row gap-3.5 sm:gap-4 overflow-hidden text-right min-h-[156px] sm:min-h-[172px] select-none tap-highlight-transparent"
    >
      {/* Right Side: Movie Poster Thumbnail (In RTL, 1st flex item is naturally at start/right) */}
      <div className="relative w-24 sm:w-28 md:w-32 shrink-0 aspect-[2/3] rounded-xl overflow-hidden bg-stone-200 dark:bg-zinc-800 shadow-xs">
        <Image
          src={film.posterUrl}
          alt={film.titleKurdish}
          fill
          unoptimized={film.posterUrl.startsWith('data:')}
          sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* Left Side: Film Information & Action Button */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="space-y-1.5">
          {/* Kurdish Movie Title */}
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#d49757] transition-colors leading-normal">
            {film.titleKurdish}
          </h3>

          {/* Meta line: جۆر: [Genre] • ساڵ: [Year] */}
          <div className="flex items-center gap-1.5 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400 tracking-normal">
            <span>جۆر: {film.genres[0]}</span>
            <span>•</span>
            <span>ساڵ: {film.year}</span>
          </div>

          {/* Synopsis (uniform 2 lines with relaxed line-height) */}
          <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed tracking-normal pt-0.5">
            {film.description}
          </p>
        </div>

        {/* Telegram CTA Button (Pill-shaped with smooth active touch animation) */}
        <div className="pt-2 sm:pt-3">
          <a
            href={film.telegramPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d49757]/10 hover:bg-[#d49757] text-[#d49757] hover:text-zinc-950 border border-[#d49757]/30 text-xs font-medium font-sirwan tracking-normal transition-transform duration-150 ease-out active:scale-95 shadow-xs cursor-pointer touch-manipulation select-none"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>بینینی فیلم لە تێلیگرام</span>
          </a>
        </div>
      </div>
    </article>
  );
}
