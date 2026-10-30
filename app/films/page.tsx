import { Suspense } from 'react';
import Link from 'next/link';
import { Send, ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { readFilms } from '@/lib/storage';
import { FilmsArchive } from '@/components/FilmsArchive';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'فیلم و ئەنیمەیشن | پەیڤ و ئەندێشە',
  description: 'ئەرشیڤی شاکارە سینەمایییەکان و ئەنیمەیشنە ناوازەکان بە پەخشی ڕاستەوخۆ لە کەناڵی تێلیگرام',
};

export default async function FilmsPage() {
  const films = await readFilms();

  return (
    <div dir="rtl" className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-10 space-y-10 text-right">
      {/* Top Breadcrumb */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-[#ede8e1] dark:border-zinc-800/80 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400 tracking-normal">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#d49757] transition-colors">
            سەرەکی
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200">فیلم و ئەنیمەیشن</span>
        </div>

        <a
          href="https://t.me/mediay_islami"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:underline transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent"
        >
          <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>کەناڵی تێلیگرام</span>
        </a>
      </div>

      {/* Minimalist Header */}
      <div className="w-full max-w-2xl text-center space-y-3 py-2">
        <span className="text-xs font-semibold font-sirwan text-[#d49757] tracking-normal block">
          ئەرشیڤی بینراو
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
          فیلم و ئەنیمەیشن
        </h1>

        <p className="text-sm sm:text-base font-normal font-sirwan text-zinc-600 dark:text-zinc-400 leading-relaxed tracking-normal">
          کۆکراوەی شاکارە سینەمایییەکان و ئەنیمەیشنە هەڵبژێردراوەکان بە پەخشی ڕاستەوخۆ لە کەناڵی تێلیگرام.
        </p>
      </div>

      {/* Interactive Filters & 2-Column Responsive Grid */}
      <Suspense fallback={<div className="w-full py-16 text-center text-xs font-sirwan text-zinc-400">چاوەڕوانبە...</div>}>
        <FilmsArchive initialFilms={films} />
      </Suspense>

      {/* Return to Home Helper */}
      <div className="pt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold font-sirwan text-zinc-700 hover:text-[#d49757] dark:text-zinc-300 dark:hover:text-[#d49757] tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group"
        >
          <span>گەڕانەوە بۆ لاپەڕەی سەرەکی</span>
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}
