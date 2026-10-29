import Link from 'next/link';
import { Home, Clapperboard, Compass } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پەڕەکە نەدۆزرایەوە (٤٠٤) | پەیڤ و ئەندێشە',
  description: 'ئەم پەڕەیە لە ئەرشیڤی پەیڤ و ئەندێشەدا بەردەست نییە',
};

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 min-h-[70vh] text-center space-y-8 select-none"
    >
      {/* Cinematic 404 Emblem */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Warm Glow */}
        <div className="absolute w-48 h-48 rounded-full bg-[#d49757]/10 blur-3xl -z-10" />

        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-[#ede8e1] dark:border-zinc-800 flex items-center justify-center text-[#d49757] shadow-sm mb-2">
            <Compass className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <span className="text-5xl sm:text-6xl font-extrabold font-sans text-[#d49757]">
            ٤٠٤
          </span>
        </div>
      </div>

      {/* Headings & Cinematic Quote */}
      <div className="space-y-4 max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
          ئەم پەڕەیە لە ئەرشیڤدا نەدۆزرایەوە
        </h1>

        {/* Quiet literary quote */}
        <blockquote className="p-4 rounded-2xl bg-stone-100/60 dark:bg-zinc-900/40 border border-[#ede8e1] dark:border-zinc-800/80 text-xs sm:text-sm font-sirwan text-zinc-600 dark:text-zinc-400 italic leading-relaxed tracking-normal">
          «سینەما وەک گەشتێکی کتوپڕە؛ هەندێک جار دەگەینە شوێنێک کە هیچ ڕێگایەکی نەخشێنراوی لێ نییە، تەنها بێدەنگی و ڕامان...»
        </blockquote>

        <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-500 dark:text-zinc-400 leading-relaxed tracking-normal">
          ڕەنگە ناونیشانەکە بە نادروستی نووسرابێت یان پەڕەکە گواسترابێتەوە بۆ بەشێکی تر.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d49757] hover:bg-[#c28747] text-zinc-950 font-bold font-sirwan text-sm tracking-normal transition-all duration-200 shadow-sm active:scale-[0.98]"
        >
          <Home className="w-4 h-4" strokeWidth={1.75} />
          <span>گەڕانەوە بۆ سەرەکی</span>
        </Link>

        <Link
          href="/films"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#ede8e1] dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 hover:bg-stone-100/70 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 font-medium font-sirwan text-sm tracking-normal transition-all duration-200 active:scale-[0.98]"
        >
          <Clapperboard className="w-4 h-4 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} />
          <span>بینینی فیلمەکان</span>
        </Link>
      </div>
    </main>
  );
}

