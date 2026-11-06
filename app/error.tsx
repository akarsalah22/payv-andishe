"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, WifiOff } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('App runtime error caught:', error);
  }, [error]);

  return (
    <main
      dir="rtl"
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 min-h-[60vh] text-center space-y-6 select-none"
    >
      {/* Alert Emblem with soft amber glow */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-36 h-36 rounded-full bg-amber-500/10 blur-2xl -z-10" />
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm">
          <WifiOff className="w-8 h-8" strokeWidth={1.75} />
        </div>
      </div>

      {/* Headings */}
      <div className="space-y-2 max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100">
          کێشەیەک لە پەیوەندی دروستبوو
        </h1>
        <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 leading-relaxed">
          تکایە هێڵی ئینتەرنێتەکەت بپشکنە یان دواتر هەوڵ بدەرەوە.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {/* Retry Button */}
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-sirwan text-sm tracking-normal transition-all duration-200 shadow-md active:scale-95 cursor-pointer touch-manipulation min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={2} />
          <span>دووبارە تاقیکردنەوە</span>
        </button>

        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium font-sirwan text-sm tracking-normal transition-all duration-200 active:scale-95 min-h-[44px]"
        >
          <Home className="w-4 h-4 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} />
          <span>گەڕانەوە بۆ سەرەکی</span>
        </Link>
      </div>
    </main>
  );
}
