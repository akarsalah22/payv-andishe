"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shuffle } from 'lucide-react';
import type { Film } from '@/data/films';
import { SAMPLE_FILMS } from '@/data/films';

interface RandomMovieButtonProps {
  films?: Film[];
  className?: string;
  variant?: 'header' | 'compact' | 'search' | 'primary' | 'subtle';
  label?: string;
  onPick?: () => void;
}

export function RandomMovieButton({
  films = [],
  className = '',
  variant = 'search',
  label,
  onPick,
}: RandomMovieButtonProps) {
  const router = useRouter();
  const [isPicking, setIsPicking] = useState(false);

  const isHeader = variant === 'header' || variant === 'compact';
  const defaultLabel = isHeader ? 'چی سەیر بکەم؟' : 'شتێکم بۆ هەڵبژێرە';
  const displayLabel = label || defaultLabel;

  const handlePickRandom = async () => {
    if (isPicking) return;
    setIsPicking(true);

    try {
      let pool = films;

      // If no films passed in props, fetch active film list from API
      if (!pool || pool.length === 0) {
        try {
          const res = await fetch('/api/films');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              pool = data;
            }
          }
        } catch {
          // fallback to SAMPLE_FILMS
        }
      }

      if (!pool || pool.length === 0) {
        pool = SAMPLE_FILMS;
      }

      // Brief delay for satisfying micro-interaction
      await new Promise((resolve) => setTimeout(resolve, 300));

      const randomIndex = Math.floor(Math.random() * pool.length);
      const chosen = pool[randomIndex];

      if (chosen) {
        onPick?.();
        const targetPath = `/films/${encodeURIComponent(chosen.slug || chosen.id)}`;
        router.push(targetPath);
      }
    } finally {
      // Release picking state after navigation is triggered
      setTimeout(() => setIsPicking(false), 500);
    }
  };

  if (isHeader) {
    return (
      <button
        type="button"
        onClick={handlePickRandom}
        disabled={isPicking}
        title="چی سەیر بکەم؟ شتێکم بۆ هەڵبژێرە"
        aria-label="چی سەیر بکەم؟ شتێکم بۆ هەڵبژێرە"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all group cursor-pointer select-none touch-manipulation disabled:opacity-60 active:scale-95 ${className}`}
      >
        <Shuffle
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-500 group-hover:rotate-180 active:rotate-90 ${
            isPicking ? 'animate-spin' : ''
          }`}
          strokeWidth={2}
        />
        <span className="font-sirwan tracking-normal">
          {isPicking ? 'هەڵدەبژێردرێت...' : displayLabel}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePickRandom}
      disabled={isPicking}
      title="نازانیت چی سەیر بکەیت؟ لێرە دابگرە تا فیلمێکت بۆ هەڵبژێرین"
      aria-label="چی سەیر بکەم؟ شتێکم بۆ هەڵبژێرە"
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 active:scale-95 transition-all group cursor-pointer select-none touch-manipulation disabled:opacity-60 ${className}`}
    >
      <Shuffle
        className={`w-4 h-4 shrink-0 transition-transform duration-500 group-hover:rotate-180 active:rotate-90 ${
          isPicking ? 'animate-spin' : ''
        }`}
        strokeWidth={2}
      />
      <span className="font-sirwan tracking-normal">
        {isPicking ? 'هەڵدەبژێردرێت...' : displayLabel}
      </span>
    </button>
  );
}
