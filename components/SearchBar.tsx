"use client";

import { useState, useEffect, useRef, useTransition } from 'react';
import { Search, X } from 'lucide-react';
import { RandomMovieButton } from './RandomMovieButton';
import type { Film } from '@/data/films';

export const DEFAULT_SEARCH_CATEGORIES = [
  'هەمووی',
  'فیلم',
  'کارتۆن',
  'زنجیرە',
  'دۆبلاژ',
  'ژێرنووس',
] as const;

export type SearchCategory = (typeof DEFAULT_SEARCH_CATEGORIES)[number] | string;

export interface SearchBarProps {
  value: string;
  onSearchChange: (query: string) => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: readonly string[] | string[];
  placeholder?: string;
  debounceMs?: number;
  showRandomButton?: boolean;
  films?: Film[];
  className?: string;
}

export function SearchBar({
  value,
  onSearchChange,
  activeCategory = 'هەمووی',
  onCategoryChange,
  categories = DEFAULT_SEARCH_CATEGORIES,
  placeholder = 'گەڕان لە نێو فیلم، زنجیرە و ئەنیمەیشنەکان (بە کوردی یان عەرەبی)...',
  debounceMs = 300,
  showRandomButton = true,
  films = [],
  className = '',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [, startTransition] = useTransition();

  // Keep local input in sync if parent value changes externally (e.g. from URL)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = (nextVal: string) => {
    setLocalValue(nextVal);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      startTransition(() => {
        onSearchChange(nextVal);
      });
    }, debounceMs);
  };

  const handleClear = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setLocalValue('');
    startTransition(() => {
      onSearchChange('');
    });
  };

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-4 ${className}`} dir="rtl">
      {/* Top Search Input & Optional Discovery Action */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 group transition-all duration-300">
          <input
            type="text"
            value={localValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            className="w-full py-3 px-12 text-sm rounded-2xl outline-none transition-all duration-300 font-sirwan bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-200/80 shadow-xs hover:border-amber-500/60 hover:shadow-[0_0_16px_rgba(245,158,11,0.15)] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:bg-zinc-900/90 dark:text-white dark:placeholder-zinc-500 dark:border-zinc-800 dark:hover:border-amber-500/60 dark:hover:shadow-[0_0_18px_rgba(245,158,11,0.2)] dark:focus:border-amber-500 dark:focus:ring-amber-500/30"
            dir="rtl"
            aria-label="گەڕان"
          />

          {/* Search Icon (Synchronized hover state) */}
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500 pointer-events-none transition-colors duration-300 group-hover:text-amber-500 group-focus-within:text-amber-500 dark:group-hover:text-amber-400 dark:group-focus-within:text-amber-400"
            strokeWidth={2}
          />

          {/* Clear button */}
          {localValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="پاککردنەوەی گەڕان"
              aria-label="پاککردنەوەی گەڕان"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Discovery Button: "شتێکم بۆ هەڵبژێرە" */}
        {showRandomButton && (
          <div className="shrink-0 flex justify-center sm:justify-start">
            <RandomMovieButton films={films} variant="search" />
          </div>
        )}
      </div>

      {/* Quick Category Filter Pills */}
      {onCategoryChange && categories && categories.length > 0 && (
        <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-1 gap-2 flex-nowrap sm:flex-wrap px-0.5 select-none">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`shrink-0 px-4 py-2 sm:py-1.5 rounded-full text-xs sm:text-sm font-sirwan tracking-normal active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-black font-bold shadow-xs border border-amber-500 scale-[1.02]'
                    : 'bg-zinc-100/90 hover:bg-zinc-200/90 text-zinc-600 hover:text-zinc-900 border border-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-zinc-400 dark:hover:text-zinc-200 dark:border-zinc-750/70'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

