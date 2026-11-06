import Link from 'next/link';
import { Home, Compass, Film } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ئەم بەشە یان فیلمە نەدۆزرایەوە (٤٠٤) | میدیای ئیسلامی',
  description: 'ئەم پەڕەیە لە ئەرشیڤی میدیای ئیسلامیدا بەردەست نییە',
};

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 min-h-[65vh] text-center space-y-8 select-none"
    >
      {/* 404 Emblem */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-44 h-44 rounded-full bg-amber-500/10 blur-3xl -z-10" />

        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-zinc-900 border border-amber-500/25 dark:border-zinc-800 flex items-center justify-center text-amber-500 shadow-sm mb-2">
            <Compass className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <span className="text-5xl sm:text-6xl font-extrabold font-sans text-amber-500">
            ٤٠٤
          </span>
        </div>
      </div>

      {/* Headings */}
      <div className="space-y-3 max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
          ئەم بەشە یان فیلمە نەدۆزرایەوە
        </h1>
        <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-500 dark:text-zinc-400 leading-relaxed">
          ڕەنگە بەستەرەکە گۆڕدرابێت، سڕدرابێتەوە یان بە نادروستی نوسرابێت.
        </p>
      </div>

      {/* Primary Actions with >=44px touch targets */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-sirwan text-sm tracking-normal transition-all duration-200 shadow-md active:scale-95 min-h-[44px]"
        >
          <Home className="w-4 h-4" strokeWidth={1.75} />
          <span>گەڕانەوە بۆ پەڕەی سەرەکی</span>
        </Link>

        <Link
          href="/films"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium font-sirwan text-sm tracking-normal transition-all duration-200 active:scale-95 min-h-[44px]"
        >
          <Film className="w-4 h-4 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} />
          <span>ئەرشیڤی فیلمەکان</span>
        </Link>
      </div>
    </main>
  );
}
