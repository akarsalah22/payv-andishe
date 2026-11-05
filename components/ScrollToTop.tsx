"use client";

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsVisible(window.scrollY > 300);
      }
    };

    // Check initial scroll position on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="گەڕانەوە بۆ سەرەوە"
      title="گەڕانەوە بۆ سەرەوە"
      className={`group fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-lg border cursor-pointer select-none tap-highlight-transparent transition-all duration-300 ease-in-out hover:scale-105 active:scale-90 active:opacity-90 bg-zinc-900 text-white border-zinc-700 hover:bg-amber-500 hover:text-black hover:border-amber-500 active:bg-amber-600 dark:bg-white dark:text-zinc-900 dark:border-zinc-200 dark:shadow-white/5 dark:hover:bg-amber-500 dark:hover:text-black dark:hover:border-amber-400 dark:active:bg-amber-500 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ChevronUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" strokeWidth={2.5} />
    </button>
  );
}

