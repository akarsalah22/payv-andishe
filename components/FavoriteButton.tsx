"use client";

import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useFavorites, type SavedItem } from '@/hooks/useFavorites';

export interface FavoriteButtonProps {
  item: SavedItem;
  className?: string;
  variant?: 'icon' | 'pill';
  showLabel?: boolean;
}

export function FavoriteButton({
  item,
  className = '',
  variant = 'icon',
  showLabel = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);

  const saved = isFavorite(item.id) || (item.slug ? isFavorite(item.slug) : false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Crucial: Stop navigation if inside a Link component
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    toggleFavorite(item);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const titleText = saved
    ? 'لابردن لە هەڵگیراوەکانم'
    : 'پاشەکەوتکردن لە هەڵگیراوەکانم';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={titleText}
        aria-label={titleText}
        aria-pressed={saved}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium font-sirwan transition-all duration-200 cursor-pointer select-none touch-manipulation active:scale-95 tap-highlight-transparent border ${
          saved
            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/35 shadow-2xs'
            : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
        } ${className}`}
      >
        <Bookmark
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            isAnimating ? 'scale-125' : 'scale-100'
          } ${
            saved
              ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400'
              : 'text-zinc-700 dark:text-zinc-300'
          }`}
          strokeWidth={saved ? 2.25 : 1.75}
        />
        <span className="hidden sm:inline tracking-normal whitespace-nowrap">
          {saved ? 'هەڵگیراوە' : 'پاشەکەوتکردن'}
        </span>
      </button>
    );
  }

  // Default: Elegant icon button with translucent backdrop
  return (
    <button
      type="button"
      onClick={handleClick}
      title={titleText}
      aria-label={titleText}
      aria-pressed={saved}
      className={`group relative p-2 rounded-full backdrop-blur-md transition-all duration-200 ease-out cursor-pointer select-none touch-manipulation active:scale-75 tap-highlight-transparent ${
        saved
          ? 'bg-amber-500/25 text-amber-500 border border-amber-500/40 shadow-sm scale-105'
          : 'bg-black/50 hover:bg-black/75 text-white/80 hover:text-white border border-white/20 hover:scale-105'
      } ${className}`}
    >
      <Bookmark
        className={`w-4 h-4 transition-transform duration-200 ease-out ${
          isAnimating ? 'scale-125' : 'scale-100'
        } ${
          saved
            ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400'
            : 'text-white'
        }`}
        strokeWidth={saved ? 2.5 : 1.75}
      />
      {showLabel && (
        <span className="sr-only">
          {saved ? 'لابردن لە هەڵگیراوەکان' : 'پاشەکەوتکردن'}
        </span>
      )}
    </button>
  );
}

