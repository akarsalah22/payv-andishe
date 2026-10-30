"use client";

import Link from 'next/link';
import { Send, ChevronUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer
      className="mt-20 sm:mt-28 border-t border-[#ede8e1] dark:border-zinc-800/70 bg-[#faf8f5]/80 dark:bg-[#121316]/80 backdrop-blur-sm transition-colors duration-300"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#ede8e1]/70 dark:border-zinc-800/50">
          {/* Identity & Motto */}
          <div className="space-y-2 max-w-md text-right">
            <span className="text-xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 block">
              میدیای ئیسلامی
            </span>
            <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 leading-relaxed tracking-normal">
              ئەرشیڤێکی سەربەخۆی کوردییە بۆ ناساندنی فیلم و کارتۆنە ئیسلامێکان، وەدەقی ئیسلامی بە زمانی کوردی.
            </p>
          </div>

          {/* Quick Nav Links: (سەرەکی, فیلم و کارتۆن, نووسین و وتار, دەربارە, تێلیگرام) */}
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium font-sirwan text-zinc-600 dark:text-zinc-400 tracking-normal">
            <Link
              href="/"
              className="hover:text-[#d49757] transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent"
            >
              سەرەکی
            </Link>
            <Link
              href="/films"
              className="hover:text-[#d49757] transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent"
            >
              فیلم و کارتۆن
            </Link>
            <Link
              href="/articles"
              className="hover:text-[#d49757] transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent"
            >
              نووسین و وتار
            </Link>
            <Link
              href="/about"
              className="hover:text-[#d49757] transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent"
            >
              دەربارە
            </Link>
            <a
              href="https://t.me/mediay_islami"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent"
            >
              <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>تێلیگرام</span>
            </a>
          </nav>
        </div>

        {/* Bottom copyright & Back to Top button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-500 tracking-normal text-right">
          <div className="flex items-center gap-2">
            <p>هەموو مافەکانی پارێزراوە © 2026 میدیای ئیسلامی</p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="گەڕانەوە بۆ سەرەوە"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ede8e1] dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 hover:bg-stone-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-[#d49757] dark:hover:text-[#d49757] transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
          >
            <ChevronUp className="w-3.5 h-3.5 text-[#d49757]" strokeWidth={2} />
            <span>گەڕانەوە بۆ سەرەوە</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
