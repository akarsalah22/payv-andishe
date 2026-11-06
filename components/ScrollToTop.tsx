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
      aria-label="گەڕانەوە بۆ سەرەوە"
      title="گەڕانەوە بۆ سەرەوە"
      className={`group fixed bottom-6 right-6 z-40 p-3 rounded-full flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer select-none tap-highlight-transparent transition-all duration-300 ease-in-out bg-zinc-950 border border-zinc-850 shadow-xl text-amber-400 hover:bg-zinc-900 hover:text-amber-300 active:scale-90 active:bg-amber-500 active:text-zinc-950 dark:bg-zinc-150 dark:border-zinc-300 dark:shadow-2xl dark:text-amber-700 dark:hover:bg-white dark:hover:text-amber-600 dark:active:scale-90 dark:active:bg-amber-500 dark:active:text-white ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" strokeWidth={2.25} />
    </button>
  );
}

export default ScrollToTop;
