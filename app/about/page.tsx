import Link from 'next/link';
import type { Metadata } from 'next';
import { Send, ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'دەربارەی پەیڤ و ئەندێشە | پانتاییەک بۆ سینەما و ئەدەب',
  description: 'ئەرشیڤێکی سەربەخۆ بۆ ناساندنی شاکارەکانی سینەما، ئەنیمەیشن، وتاری هزری و تێڕامان لە ئەدەب بە زمانی کوردی',
};

export default function AboutPage() {
  return (
    <main
      dir="rtl"
      className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full py-12 sm:py-20 space-y-16 text-right select-none"
    >
      {/* Top Breadcrumb */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-stone-200/80 dark:border-zinc-800/80 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400 tracking-normal">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-amber-500 transition-colors">
            سەرەکی
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200">دەربارە</span>
        </div>

        <span className="text-zinc-400 dark:text-zinc-500">پەیڤ و ئەندێشە</span>
      </div>

      {/* 1. Dignified Page Header (No AI Sparkle Badge) */}
      <header className="w-full text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal sm:leading-relaxed">
          دەربارەی پەیڤ و ئەندێشە
        </h1>

        <p className="text-base sm:text-lg font-normal font-sirwan text-zinc-600 dark:text-zinc-400 leading-relaxed tracking-normal max-w-xl mx-auto">
          ئەرشیڤێکی سەربەخۆ بۆ یادەوەریی سینەما، سەنگینیی پەیڤ و تێڕامان لە فیکر و ئەدەب.
        </p>
      </header>

      {/* 2. Authentic Literary Narrative (Curator's Note) */}
      <article className="w-full space-y-10 text-zinc-800 dark:text-zinc-200 font-sirwan text-base sm:text-[17px] leading-[2.3] tracking-normal text-justify">
        {/* Section 1: بۆچی ئەم ئەرشیفە؟ */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-peshang text-zinc-900 dark:text-zinc-100 tracking-normal border-b border-stone-200/60 dark:border-zinc-800/80 pb-2.5">
            بۆچی ئەم ئەرشیفە؟
          </h2>
          <p>
            «پەیڤ و ئەندێشە» لە وەستانێک لە بەردەم لێشاوی خێرای شاشەکانەوە دەستی پێکرد. لە سەردەمێکدا کە ئەلگۆریتمەکان هەموو چرکەیەکی سەرنجمان بۆ لای ناوەڕۆکی کاتی و کاتکوشتن دەبەن، ئەم پانتاییە هەوڵێکە بۆ گەڕانەوە بۆ بەها بنەڕەتییەکانی تێڕامان و هێمنی؛ شوێنێک کە تێیدا هونەر و نووسین لە ژاوەژاوی ڕۆژانە جیا دەکرێنەوە.
          </p>
          <p>
            ئەم پلاتفۆرمە نە دەزگایەکی بازرگانییە و نە شوێنکەوتەی ڕیتمی بەپەلەی سۆشیال میدیایە. ئامانجمان تەنیا کۆکردنەوە و ئەرشیڤکردنی ئەو شاکارە دەگمەنانەیە کە شایستەی ئەوەن بە ئارامی لەگەڵیان بژین و چەندین جار بگەڕێینەوە سەریان.
          </p>
        </section>

        {/* Section 2: ڕوانگەی ئێمە بۆ سینەما و ئەدەب */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-peshang text-zinc-900 dark:text-zinc-100 tracking-normal border-b border-stone-200/60 dark:border-zinc-800/80 pb-2.5">
            ڕوانگەی ئێمە بۆ سینەما و ئەدەب
          </h2>
          <p>
            سینەما لە دیدی ئێمەدا تەنیا نمایشکردنی چیرۆکێک نییە، بەڵکو پەنجەرەیەکە بۆ دەستلێدانی خودی کات، هەستکردن بە قورساییی بوونی مرۆڤ و تێگەیشتن لە برینەکانی ژیان. لە شاکارە هێمن و شاعیرانەکانی ئەندرێی تارکۆڤسکی و ئینگمار بێرگمانەوە، تا جیهانە ئەفسوناوی و بێگەردەکانی هایاو میازاکی و ستۆدیۆ گێبلی، هەوڵ دەدەین ئەو بەرهەمانە بخەینە بەر دید کە تەنیا سەیریان ناکەیت، بەڵکو لە ناخدا جێ دەمێننەوە.
          </p>
          <p>
            هاوتەریب لەگەڵ شریتەکانی فیلم، پەیڤ و ئەندێشە ڕووبەرێکە بۆ وتاری شیکاری و خوێندنەوەی قووڵی کتێب. باوەڕمان وایە کە خوێندنەوە پێویستی بە پشوو و تەنیایییەکی بەپیت هەیە. لێرەدا دەقەکان بە زمانی کوردیی پاراو و لەسەرخۆ داڕێژراون تا هاوڕێی تێفکرین و پرسیارە بوونگەرایییەکانی خوێنەر بن.
          </p>
        </section>

        {/* Section 3: ئەرشیفی هەمیشەیی */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-peshang text-zinc-900 dark:text-zinc-100 tracking-normal border-b border-stone-200/60 dark:border-zinc-800/80 pb-2.5">
            ئەرشیفی هەمیشەیی لە تێلیگرام
          </h2>
          <p>
            بۆ پاراستنی ئەم شاکارانە بە بەرزترین کوالێتیی دەنگ و ڕەنگ، و دەستەبەرکردنی ئازادیی دەستڕاگەیشتن بەبێ سانسۆر و بەربەستی تەکنیکی، کەناڵی تێلیگرامی «پەیڤ و ئەندێشە» وەک ئەرشیفێکی هەمیشەیی کاردەکات. هەر فیلمێک، کورتەفیلمێک یان بابەتێکی پێشکەشکراو، ڕاستەوخۆ بە شێوازێکی پوخت لەوێدا کۆگاکراوە بۆ ئەوەی هەمیشە لە بەردەستی بینەردا بێت.
          </p>
        </section>
      </article>

      {/* 3. Grounded & Modest Telegram Invitation */}
      <section className="w-full pt-10 border-t border-stone-200/80 dark:border-zinc-800/80 text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
            بەشداربوون لە کەناڵی تێلیگرام
          </h3>
          <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            بۆ داگرتن و بینینی بەرهەمەکان بە کوالێتی بەرز و ئاگاداربوون لە وتارە نوێیەکان، دەتوانیت هاوڕێمان بیت لە تێلیگرام.
          </p>
        </div>

        <div className="pt-2">
          <a
            href="https://t.me/payvandishe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold font-sirwan text-xs sm:text-sm tracking-normal shadow-sm transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation tap-highlight-transparent"
          >
            <Send className="w-4 h-4" strokeWidth={1.75} />
            <span>پەیوەستبوون بە کەناڵی تێلیگرام</span>
          </a>
        </div>
      </section>

      {/* 4. Clean Navigation: Return to Home */}
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
