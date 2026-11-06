"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dices, Sparkles } from 'lucide-react';
import type { Film } from '@/data/films';
import { SAMPLE_FILMS } from '@/data/films';

interface RandomMovieButtonProps {
  films?: Film[];
  className?: string;
  variant?: 'primary' | 'subtle' | 'compact';
  onPick?: () => void;
}

export function RandomMovieButton({
  films = [],
  className = '',
  variant = 'primary',
  onPick,
}: RandomMovieButtonProps) {
  const router = useRouter();
  const [isPicking, setIsPicking] = useState(false);

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

      // Brief suspense delay for playful dice animation
      await new Promise((resolve) => setTimeout(resolve, 320));

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

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handlePickRandom}
        disabled={isPicking}
        title="چی سەیر بکەم؟ شتێکم بۆ هەڵبژێرە"
        aria-label="چی سەیر بکەم؟ شتێکم بۆ هەڵبژێرە"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sirwan font-medium transition-all duration-200 cursor-pointer select-none active:scale-95 disabled:opacity-60 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 ${className}`}
      >
        <span className={`text-base leading-none transition-transform duration-300 ${isPicking ? 'animate-spin' : ''}`}>
          🎲
        </span>
        <span>{isPicking ? 'دەگەڕێت...' : 'چی سەیر بکەم؟'}</span>
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
      className={`relative group inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-sirwan text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer select-none touch-manipulation active:scale-95 disabled:opacity-75 ${
        variant === 'subtle'
          ? 'bg-zinc-100 hover:bg-zinc-200/90 text-zinc-700 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
          : 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 hover:from-amber-500/25 hover:to-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:border-amber-500/50 shadow-xs hover:shadow-[0_0_16px_rgba(245,158,11,0.15)]'
      } ${className}`}
    >
      {/* Playful Dice Icon */}
      <span
        className={`text-lg sm:text-xl leading-none transition-transform duration-500 ease-out select-none ${
          isPicking ? 'rotate-[360deg] scale-110' : 'group-hover:rotate-12 group-hover:scale-110'
        }`}
      >
        🎲
      </span>

      <span className="font-medium tracking-normal">
        {isPicking ? 'هەڵدەبژێردرێت...' : 'شتێکم بۆ هەڵبژێرە'}
      </span>

      <Sparkles className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-amber-500 transition-opacity" />
    </button>
  );
}
