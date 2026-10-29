"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring if needed
    console.error('App runtime error caught:', error);
  }, [error]);

  return (
    <main
      dir="rtl"
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 min-h-[60vh] text-center space-y-6 select-none"
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#d49757] shadow-sm">
        <AlertCircle className="w-8 h-8" strokeWidth={1.5} />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100">
          هەڵەیەک لە بارکردنی پەڕەکەدا ڕوویدا
        </h1>
        <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-500 dark:text-zinc-400 leading-relaxed">
          ئارام بە، پەڕەکە تووشی کێشەیەکی کاتی بووەتەوە. دەتوانیت دووبارە هەوڵبدەیتەوە یان بگەڕێیتەوە بۆ سەرەکی.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d49757] hover:bg-[#c28747] text-zinc-950 font-bold font-sirwan text-sm tracking-normal transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={1.75} />
          <span>دووبارە هەوڵبدەرەوە</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#ede8e1] dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 hover:bg-stone-100/70 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 font-medium font-sirwan text-sm tracking-normal transition-all duration-200 active:scale-[0.98]"
        >
          <Home className="w-4 h-4 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} />
          <span>گەڕانەوە بۆ سەرەکی</span>
        </Link>
      </div>
    </main>
  );
}

