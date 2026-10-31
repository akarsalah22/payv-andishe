import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { readArticles } from '@/lib/storage';
import { ArticlesArchive } from '@/components/ArticlesArchive';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'نووسین، وتار و ئەندێشە | پەیڤ و ئەندێشە',
  description: 'کۆکراوەی وتاری هزری، ڕامانی فەلسەفی و ناساندنی کتێبە ناوازەکان بە زمانی شیرینی کوردی',
};

export default async function ArticlesPage() {
  const articles = await readArticles();

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 flex flex-col space-y-10 text-right">
      {/* Top Breadcrumb */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-[#ede8e1] dark:border-zinc-800/80 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400 tracking-normal">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#d49757] transition-colors">
            سەرەکی
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200">نووسین و وتارەکان</span>
        </div>

        <span className="text-zinc-400 dark:text-zinc-500">پەیڤ و ئەندێشە</span>
      </div>

      {/* Minimalist Header */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-4 py-2 select-none">
        <span className="text-xs font-semibold font-sirwan text-[#d49757] tracking-normal block text-center mx-auto">
          ئەرشیڤی ئەدەب و هزر
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal text-center mx-auto">
          نووسین، وتار و ئەندێشە
        </h1>

        <p className="text-sm sm:text-base font-normal font-sirwan text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed tracking-normal text-center">
          وتاری هزری، ڕامانی قووڵ بۆ کتێبە شاکارەکان و لێکۆڵینەوەی ئەدەبی بە زمانی کوردی.
        </p>
      </div>

      {/* Interactive Category Filter & Responsive Grid */}
      <Suspense fallback={<div className="w-full py-16 text-center text-xs font-sirwan text-zinc-400">چاوەڕوانبە...</div>}>
        <ArticlesArchive initialArticles={articles} />
      </Suspense>

      {/* Return to Home Helper */}
      <div className="pt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-stone-300/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium font-sirwan tracking-normal transition-all duration-150 ease-out active:scale-95 shadow-2xs select-none tap-highlight-transparent group"
        >
          <span>گەڕانەوە بۆ لاپەڕەی سەرەکی</span>
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}
