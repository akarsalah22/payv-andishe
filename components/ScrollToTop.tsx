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
      className={`fixed bottom-6 left-6 z-40 p-3 rounded-full bg-white/90 text-zinc-800 border border-zinc-200/90 hover:bg-zinc-100 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/60 dark:hover:bg-zinc-700 shadow-lg backdrop-blur-sm active:scale-90 transition-all duration-300 cursor-pointer select-none tap-highlight-transparent flex items-center justify-center min-w-[44px] min-h-[44px] ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 hover:-translate-y-0.5" strokeWidth={2} />
    </button>
  );
}

export default ScrollToTop;
