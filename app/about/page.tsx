import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';
import { TelegramIcon } from '@/components/TelegramIcon';
import { AboutLanguageBanner } from '@/components/AboutLanguageBanner';
import { AboutInstallPwaCard } from '@/components/AboutInstallPwaCard';
import { readAboutSettings } from '@/lib/storage';
import { DEFAULT_ABOUT_SETTINGS } from '@/data/about';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'دەربارەی پلاتفۆرم | میدیای ئیسلامی',
  description: 'ئەم وێبسایتە دەستپێشخەرییەکی خۆبەخشانەیە بۆ ئەرشیفکردن و کۆکردنەوەی بەرهەم و نووسین و فیلمە پەروەردەیەکان بە زمانی کوردی',
};

export default async function AboutPage() {
  const about = await readAboutSettings();

  const title = about.title || DEFAULT_ABOUT_SETTINGS.title;
  const paragraph_1 = about.paragraph_1 || DEFAULT_ABOUT_SETTINGS.paragraph_1;
  const paragraph_2 = about.paragraph_2 || DEFAULT_ABOUT_SETTINGS.paragraph_2;
  const paragraph_3 = about.paragraph_3 || DEFAULT_ABOUT_SETTINGS.paragraph_3;
  const instagram_handle = about.instagram_handle || DEFAULT_ABOUT_SETTINGS.instagram_handle;
  const instagram_url = about.instagram_url || DEFAULT_ABOUT_SETTINGS.instagram_url;
  const telegram_handle = about.telegram_handle || DEFAULT_ABOUT_SETTINGS.telegram_handle;
  const telegram_url = about.telegram_url || DEFAULT_ABOUT_SETTINGS.telegram_url;

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
          <span className="text-zinc-900 dark:text-zinc-200">{title}</span>
        </div>

        <span className="text-zinc-400 dark:text-zinc-500">میدیای ئیسلامی</span>
      </div>

      {/* About Platform Content Box */}
      <div className="w-full max-w-2xl mx-auto space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed text-right font-sirwan">
        {/* Language Switcher Section */}
        <AboutLanguageBanner />

        {/* PWA Install Card on About Page */}
        <AboutInstallPwaCard />

        <h1 className="text-2xl sm:text-3xl font-bold font-peshang text-zinc-900 dark:text-white mb-4">
          {title}
        </h1>

        <p className="text-sm sm:text-base leading-relaxed sm:leading-loose whitespace-pre-line">
          {paragraph_1}
        </p>

        <p className="text-sm sm:text-base leading-relaxed sm:leading-loose whitespace-pre-line">
          {paragraph_2}
        </p>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-pre-line">
            {paragraph_3}
          </p>
        </div>

        {/* Contact Links (بەستەرەکانی خوارەوە) */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Instagram Button */}
          <a
            href={instagram_url}
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
                  {instagram_handle}
                </span>
              </div>
            </div>
            <span className="text-xs font-sirwan text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
              پەیام بنێرە ←
            </span>
          </a>

          {/* Telegram Button */}
          <a
            href={telegram_url}
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
                  {telegram_handle}
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
