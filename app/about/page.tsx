import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft, ExternalLink, Sparkles } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';
import { TelegramIcon } from '@/components/TelegramIcon';
import { readAboutContent } from '@/lib/storage';

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const about = await readAboutContent();
  return {
    title: `${about.title} | میدیای ئیسلامی`,
    description: about.subtitle || 'پلاتفۆرمێکی تایبەتمەند بۆ ناساندنی بەرهەمە سینەمایی و ئەدەبییە ئیسلامییەکان',
  };
}

export default async function AboutPage() {
  const about = await readAboutContent();

  return (
    <main
      dir="rtl"
      className="flex-1 flex flex-col items-center px-4 sm:px-6 md:px-8 max-w-3xl mx-auto w-full py-8 sm:py-16 space-y-12 sm:space-y-16 text-right select-none"
    >
      {/* Top Breadcrumb */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400 tracking-normal">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-amber-500 transition-colors">
            سەرەکی
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200">دەربارە</span>
        </div>

        <span className="text-zinc-400 dark:text-zinc-500">میدیای ئیسلامی</span>
      </div>

      {/* 1. Dignified Page Header (Concise & Punchy) */}
      <header className="w-full text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal sm:leading-relaxed">
          {about.title}
        </h1>

        <p className="text-base sm:text-lg font-normal font-sirwan text-zinc-600 dark:text-zinc-400 leading-relaxed tracking-normal max-w-xl mx-auto">
          {about.subtitle}
        </p>
      </header>

      {/* 2. Mission Section (پەیامی ئێمە) */}
      <section className="w-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/20 space-y-3.5 text-right shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-semibold font-sirwan text-amber-900 dark:text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{about.missionTitle}</span>
        </div>
        <p className="text-sm sm:text-base font-normal font-sirwan text-zinc-700 dark:text-zinc-300 leading-relaxed sm:leading-loose">
          {about.missionText}
        </p>
      </section>

      {/* 3. Features & Pillars Grid */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        {about.features.map((feat, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-white/95 dark:bg-zinc-900/85 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-amber-500/30 dark:hover:border-amber-500/30 space-y-2.5 text-right shadow-xs transition-all duration-200"
          >
            <span className="text-xs font-semibold font-sirwan text-amber-600 dark:text-amber-400 block">
              {`٠${index + 1}`} / تایبەتمەندی
            </span>
            <h3 className="text-base font-bold font-peshang text-zinc-900 dark:text-zinc-100">
              {feat.title}
            </h3>
            <p className="text-xs sm:text-sm font-sirwan text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </section>

      {/* 4. Dedicated Feedback & Contact Callout */}
      <section className="w-full rounded-2xl border border-amber-900/10 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/85 p-6 sm:p-8 text-center space-y-5 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center mx-auto shadow-sm">
          <InstagramIcon className="w-6 h-6" strokeWidth={1.75} />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 dark:bg-pink-500/15 text-pink-700 dark:text-pink-400 text-xs font-semibold font-sirwan border border-pink-500/20">
            <span>پەیجی فەرمی</span>
            <span>•</span>
            <span dir="ltr" className="font-mono">@hamahang_bwn</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
            پەیوەندی و پێشنیازەکان
          </h2>

          <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 leading-relaxed">
            بۆ هەر پرسیارێک، سەرنج، ڕەخنە یان پێشنیازێک دەربارەی کارەکان و باشترکردنی پڕۆژەکە، دەتوانیت لە ڕێگەی نامەی ڕاستەوخۆ (Direct) لە ئینستاگرام پەیوەندیمان پێوە بکەیت.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://ig.me/m/hamahang_bwn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold font-sirwan text-xs sm:text-sm tracking-normal shadow-sm transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
          >
            <InstagramIcon className="w-4.5 h-4.5" strokeWidth={2} />
            <span>ناردنی پەیام لە ئینستاگرام (Direct)</span>
          </a>

          <a
            href="https://instagram.com/hamahang_bwn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium font-sirwan text-xs sm:text-sm tracking-normal transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
          >
            <span>سەردانی پەیج</span>
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
          </a>
        </div>
      </section>

      {/* 5. Grounded & Modest Telegram Invitation */}
      <section className="w-full pt-10 border-t border-zinc-200/80 dark:border-zinc-800/80 text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
            بەشداربوون لە کەناڵی تێلیگرام
          </h3>
          <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            بۆ داگرتن و بینینی بەرهەمەکان و ئاگاداربوون لە وتارە نوێیەکان، دەتوانیت هاوڕێمان بیت لە تێلیگرام.
          </p>
        </div>

        <div className="pt-2">
          <a
            href="https://t.me/mediay_islamy"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-sirwan text-xs sm:text-sm tracking-normal shadow-sm transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation tap-highlight-transparent"
          >
            <TelegramIcon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span>پەیوەستبوون بە کەناڵی تێلیگرام</span>
          </a>
        </div>
      </section>

      {/* 6. Clean Navigation: Return to Home */}
      <div className="pt-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group"
        >
          <span>گەڕانەوە بۆ لاپەڕەی سەرەکی</span>
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
        </Link>
      </div>
    </main>
  );
}
