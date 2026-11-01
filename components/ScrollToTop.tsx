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
      className={`fixed bottom-6 right-6 z-50 w-11 h-11 rounded-2xl flex items-center justify-center bg-zinc-900/80 backdrop-blur-md border border-white/10 text-white shadow-xl hover:bg-amber-500 hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer select-none tap-highlight-transparent ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ChevronUp className="w-5 h-5 transition-transform duration-200" strokeWidth={2.5} />
    </button>
  );
}

