import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { readArticles, readWritingsPageSettings } from '@/lib/storage';
import { ArticlesArchive } from '@/components/ArticlesArchive';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'نووسین، شیعر و کتێبەکان | میدیای ئیسلامی',
  description: 'ناساندنی کتێب و شیعری کوردی',
};

export default async function ArticlesPage() {
  const [articles, pageSettings] = await Promise.all([
    readArticles(),
    readWritingsPageSettings(),
  ]);

  return (
    <div dir="rtl" className="w-full py-8 sm:py-12 flex-1 flex flex-col space-y-10 text-right">
      {/* Top Breadcrumb */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400 tracking-normal">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-amber-500 transition-colors">
            سەرەکی
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200">{pageSettings.title}</span>
        </div>

        <span className="text-zinc-400 dark:text-zinc-500">میدیای ئیسلامی</span>
      </div>

      {/* Minimalist Header */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-4 py-2 select-none">
        <span className="text-xs font-semibold font-sirwan text-amber-600 dark:text-amber-400 tracking-normal block text-center mx-auto">
          {pageSettings.badge}
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal text-center mx-auto">
          {pageSettings.title}
        </h1>

        <p className="text-sm sm:text-base font-normal font-sirwan text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed tracking-normal text-center whitespace-pre-line">
          {pageSettings.subtitle}
        </p>
      </div>

      {/* Interactive Category Filter & Responsive Grid */}
      <Suspense fallback={<div className="w-full py-16 text-center text-xs font-sirwan text-zinc-400">چاوەڕوانبە...</div>}>
        <ArticlesArchive initialArticles={articles} pageSettings={pageSettings} />
      </Suspense>

      {/* Return to Home Helper */}
      <div className="pt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-zinc-900/70 hover:bg-amber-500/10 dark:hover:bg-amber-500/10 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-amber-500/30 text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium font-sirwan tracking-normal transition-all duration-150 ease-out active:scale-95 shadow-2xs select-none tap-highlight-transparent group"
        >
          <span>گەڕانەوە بۆ لاپەڕەی سەرەکی</span>
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}
