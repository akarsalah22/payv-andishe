"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Film } from '@/data/films';
import { FavoriteButton } from './FavoriteButton';

interface FilmCardProps {
  film: Film;
  priority?: boolean;
}

export function FilmCard({ film, priority = false }: FilmCardProps) {
  const filmDetailsUrl = `/films/${film.id || film.slug}`;
  const initialPoster =
    film.posterUrl ||
    (film as any).image ||
    (film as any).backdropUrl ||
    '/placeholder.jpg';
  const [posterSrc, setPosterSrc] = useState(initialPoster);
  const filmTitle = film.titleKurdish || (film as any).title || '';

  return (
    <Link
      href={filmDetailsUrl}
      dir="rtl"
      className="group relative block w-full aspect-[2/3] overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 shadow-sm dark:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg dark:hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_0_15px_rgba(245,158,11,0.15)] focus:outline-none select-none tap-highlight-transparent"
    >
      {/* Poster Image with Next.js Image optimization & priority */}
      <Image
        src={posterSrc}
        alt={filmTitle}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        onError={() => setPosterSrc('/placeholder.jpg')}
      />

      {/* Elegant Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      {/* Subtle Optional Quality / Category Tag & Parts Badge */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 flex-wrap pointer-events-none z-10">
        {film.category && (
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-medium font-sirwan text-zinc-300 border border-white/10 tracking-normal">
            {film.category}
          </span>
        )}
        {film.parts && film.parts.length > 1 && (
          <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-zinc-950 font-bold text-[10px] font-sirwan shadow-xs">
            {film.parts.length} بەش
          </span>
        )}
      </div>

      {/* Top Left: Quick Save Button */}
      <div className="absolute top-2 left-2 z-20">
        <FavoriteButton
          item={{
            id: film.id || film.slug,
            title: filmTitle,
            imageUrl: posterSrc,
            type: 'movie',
            slug: film.slug || film.id,
            category: film.category,
            year: film.year,
            duration: film.duration,
          }}
        />
      </div>

      {/* Title Only at Bottom */}
      <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3.5 z-10 text-right" dir="rtl">
        <h3 className="text-xs sm:text-sm font-bold font-peshang text-white group-hover:text-amber-400 transition-colors line-clamp-1 sm:line-clamp-2 leading-snug tracking-normal">
          {filmTitle}
        </h3>
      </div>
    </Link>
  );
}
