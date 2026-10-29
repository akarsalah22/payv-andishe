"use client";

import { useState, useMemo, useEffect } from 'react';
import { FilmCard } from './FilmCard';
import { FILM_CATEGORIES, type Film, type FilmCategory } from '@/data/films';

interface FilmsArchiveProps {
  initialFilms: Film[];
}

export function FilmsArchive({ initialFilms }: FilmsArchiveProps) {
  const [films, setFilms] = useState<Film[]>(initialFilms);
  const [activeCategory, setActiveCategory] = useState<'هەمووی' | FilmCategory>('هەمووی');

  useEffect(() => {
    const loadFilms = async () => {
      try {
        const res = await fetch('/api/films');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFilms(data);
            try {
              localStorage.setItem('payvandishe_films', JSON.stringify(data));
            } catch {
              // ignore
            }
            return;
          }
        }
      } catch {
        // fallback
      }

      try {
        const stored = localStorage.getItem('payvandishe_films');
        if (stored) {
          const parsed: Film[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFilms(parsed);
          }
        }
      } catch {
        // fallback to initialFilms
      }
    };

    loadFilms();
  }, []);

  const filteredFilms = useMemo(() => {
    if (activeCategory === 'هەمووی') return films;
    return films.filter((film) => film.category === activeCategory);
  }, [activeCategory, films]);

  return (
    <div className="w-full space-y-8" dir="rtl">
      {/* Interactive Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {FILM_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium font-sirwan tracking-normal transition-all duration-200 ease-in-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent ${
                isActive
                  ? 'bg-[#d49757] text-zinc-950 font-bold shadow-xs'
                  : 'bg-white/70 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border border-[#ede8e1] dark:border-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-[#d49757]/30'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Responsive Grid: 1 column on mobile, 2 columns on tablet & desktop */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[300px]">
        {filteredFilms.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>

      {filteredFilms.length === 0 && (
        <div className="w-full py-16 text-center text-zinc-500 dark:text-zinc-400 text-sm font-sirwan tracking-normal">
          هیچ بەرهەمێک لەم بەشەدا بەردەست نییە.
        </div>
      )}
    </div>
  );
}
