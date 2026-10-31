"use client";

import { InstagramIcon } from './InstagramIcon';

export function FloatingInstagramContact() {
  return (
    <aside
      aria-label="پەیوەندی لە ڕێگەی ئینستاگرام"
      className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 select-none print:hidden"
    >
      <div className="relative group flex items-center">
        {/* Sleek Floating Action Button */}
        <a
          href="https://ig.me/m/hamahang_bwn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="پەیام بنێرە / تێبینی لە ئینستاگرام (@hamahang_bwn)"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center bg-white/95 dark:bg-zinc-900/95 text-zinc-700 dark:text-zinc-200 border border-amber-200/80 dark:border-zinc-800 shadow-lg hover:shadow-xl hover:shadow-pink-500/20 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent transition-all duration-300 ease-out active:scale-95 cursor-pointer touch-manipulation tap-highlight-transparent"
        >
          <InstagramIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.85} />
        </a>

        {/* Subtle Hover Tooltip (Desktop) */}
        <div
          role="tooltip"
          className="hidden sm:group-hover:flex items-center gap-1.5 absolute left-14 bottom-1/2 translate-y-1/2 px-3 py-1.5 rounded-xl bg-zinc-900/95 dark:bg-zinc-100/95 text-zinc-100 dark:text-zinc-900 text-xs font-sirwan font-medium tracking-normal whitespace-nowrap shadow-md pointer-events-none transition-all duration-200 animate-in fade-in slide-in-from-left-2 backdrop-blur-xs"
        >
          <span>پەیام بنێرە / تێبینی</span>
          <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[10px]" dir="ltr">@hamahang_bwn</span>
        </div>
      </div>
    </aside>
  );
}

