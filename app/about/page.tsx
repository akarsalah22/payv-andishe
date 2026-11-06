import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';
import { TelegramIcon } from '@/components/TelegramIcon';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'دەربارەی پلاتفۆرم | میدیای ئیسلامی',
  description: 'ئەم وێبسایتە دەستپێشخەرییەکی خۆبەخشانەیە بۆ ئەرشیفکردن و کۆکردنەوەی بەرهەم و وتار و فیلمە ناوازەکان بە زمانی کوردی',
};

export default function AboutPage() {
  return (
    <div
      dir="rtl"
      className="w-full py-8 sm:py-16 space-y-8 sm:space-y-12 text-right select-none flex-1 flex flex-col max-w-4xl mx-auto"
    >
      {/* Top Breadcrumb */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400 tracking-normal">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-amber-500 transition-colors">
            سەرەکی
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200">دەربارەی پلاتفۆرم</span>
        </div>

        <span className="text-zinc-400 dark:text-zinc-500">میدیای ئیسلامی</span>
      </div>

      {/* About Platform Content Box */}
      <div className="w-full max-w-2xl mx-auto space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed text-right font-sirwan">
        <h1 className="text-2xl sm:text-3xl font-bold font-peshang text-zinc-900 dark:text-white mb-4">
          دەربارەی پلاتفۆرم
        </h1>

        <p className="text-sm sm:text-base leading-relaxed sm:leading-loose">
          بەخێربێن؛ ئەم وێبسایتە دەستپێشخەرییەکی خۆبەخشانەیە بۆ ئەرشیفکردن و کۆکردنەوەی ئەو بەرهەم و وتار و فیلمە ناوازانەی بە زمانی کوردی لە سەرچاوە جیاوازەکاندا بڵاوکراونەتەوە، تا هەمووان بتوانن لە یەک شوێنی خاوێن و بێبەرامبەردا دەستیان پێیان بگات.
        </p>

        <p className="text-sm sm:text-base leading-relaxed sm:leading-loose">
          سەرجەم مافە مەعنەوییەکانی بەرهەمەکان، ڤیدیۆکان و وەرگێڕانەکان بۆ کەناڵ و وەرگێڕ و خاوەنە ڕەسەنەکانیان پارێزراون. ئێمە تەنها ئەرکی ڕێکخستن و ئاسانکاریی گەیشتن بە ناوەرۆکەکان لە ئەستۆ دەگرین.
        </p>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            بۆ هەر پێشنیار، تێبینی، یان داواکارییەکی لابردنی بەرهەم، دەتوانن لە ڕێگەی بەستەرەکانی خوارەوە پەیوەندیمان پێوە بکەن.
          </p>
        </div>

        {/* Contact Links (بەستەرەکانی خوارەوە) */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Instagram Button */}
          <a
            href="https://instagram.com/hamahang_bwn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-pink-500/50 dark:hover:border-pink-500/50 transition-all duration-200 group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0 shadow-xs">
                <InstagramIcon className="w-4.5 h-4.5" strokeWidth={2} />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold font-peshang text-zinc-900 dark:text-zinc-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors block">
                  ئینستاگرام
                </span>
                <span dir="ltr" className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  @hamahang_bwn
                </span>
              </div>
            </div>
            <span className="text-xs font-sirwan text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
              پەیام بنێرە ←
            </span>
          </a>

          {/* Telegram Button */}
          <a
            href="https://t.me/mediay_islamy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-200 group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-xs">
                <TelegramIcon className="w-4.5 h-4.5" />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold font-peshang text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors block">
                  تێلیگرام
                </span>
                <span dir="ltr" className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  @mediay_islamy
                </span>
              </div>
            </div>
            <span className="text-xs font-sirwan text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
              کەناڵی فەرمی ←
            </span>
          </a>
        </div>
      </div>

      {/* Return to Home */}
      <div className="pt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group"
        >
          <span>گەڕانەوە بۆ لاپەڕەی سەرەکی</span>
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}
