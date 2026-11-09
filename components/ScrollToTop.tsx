"use client";

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

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
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
      aria-label="سەرکەوتن بۆ سەرەوە"
      title="سەرکەوتن بۆ سەرەوە"
      className={`group fixed bottom-6 right-6 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 cursor-pointer select-none tap-highlight-transparent transition-all duration-300 ease-in-out border shadow-lg bg-zinc-950 text-amber-400 border-zinc-800 hover:bg-zinc-900 hover:text-amber-300 active:scale-90 active:bg-amber-500 active:text-zinc-950 dark:bg-white dark:text-zinc-900 dark:border-zinc-200 dark:shadow-2xl dark:hover:bg-zinc-100 dark:hover:text-amber-600 dark:active:scale-90 dark:active:bg-amber-500 dark:active:text-zinc-950 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" strokeWidth={2.25} />
    </button>
  );
}

export default ScrollToTop;
