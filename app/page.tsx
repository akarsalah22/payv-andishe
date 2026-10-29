import Link from 'next/link';
import { Clapperboard, BookOpen, Send, ChevronLeft } from 'lucide-react';
import { readFilms, readArticles } from '@/lib/storage';
import { FilmCard } from '@/components/FilmCard';
import { ArticleCard } from '@/components/ArticleCard';
import { TelegramBanner } from '@/components/TelegramBanner';

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [films, articles] = await Promise.all([readFilms(), readArticles()]);
  const featuredFilms = films.slice(0, 4);
  const featuredArticles = articles.slice(0, 3);

  return (
    <main
      dir="rtl"
      className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-12 sm:py-20 space-y-20 sm:space-y-28 text-right"
    >
      {/* 1. Hero Section */}
      <section className="w-full max-w-3xl mx-auto text-center space-y-6 pt-2 sm:pt-6 select-none">
        {/* Stately Kurdish Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal sm:leading-relaxed">
          پانتاییەک بۆ سینەما، ئەدەب و ئەندێشە
        </h1>

        {/* Concise Subtitle (1-2 sentences) */}
        <p className="text-base sm:text-lg font-normal font-sirwan text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed tracking-normal">
          ئەرشیڤێکی مۆدێرنی کوردییە بۆ ناساندنی شاکارەکانی سینەما و ئەنیمەیشن، هاوتەریب لەگەڵ خوێندنەوەی وتاری هزری و ناساندنی کتێبە ناوازەکان.
        </p>

        {/* Balanced Primary CTAs & Secondary Telegram Link */}
        <div className="flex flex-col items-center gap-3.5 pt-2">
          {/* Two Balanced Primary Section Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto sm:flex sm:w-auto sm:items-center sm:justify-center">
            {/* Button 1: فیلم و ئەنیمەیشن -> /films */}
            <Link
              href="/films"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 active:bg-stone-200 dark:bg-zinc-900/70 dark:hover:bg-zinc-800 dark:active:bg-zinc-800 border border-stone-300/70 hover:border-amber-500/40 dark:border-zinc-700/60 dark:hover:border-amber-500/40 text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 font-medium font-sirwan text-sm tracking-normal transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <Clapperboard className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" strokeWidth={1.75} />
              <span>فیلم و ئەنیمەیشن</span>
            </Link>

            {/* Button 2: نووسین و وتار -> /articles */}
            <Link
              href="/articles"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 active:bg-stone-200 dark:bg-zinc-900/70 dark:hover:bg-zinc-800 dark:active:bg-zinc-800 border border-stone-300/70 hover:border-amber-500/40 dark:border-zinc-700/60 dark:hover:border-amber-500/40 text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 font-medium font-sirwan text-sm tracking-normal transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" strokeWidth={1.75} />
              <span>نووسین و وتار</span>
            </Link>
          </div>

          {/* Secondary Telegram Link */}
          <a
            href="https://t.me/payvandishe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-500/10 text-xs sm:text-sm font-medium font-sirwan tracking-normal transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>کەناڵی تێلیگرام</span>
          </a>
        </div>
      </section>

      {/* 2. Featured Cinema Section ("شاکارە هەڵبژێردراوەکان") */}
      <section className="w-full space-y-6">
        <div className="flex items-end justify-between border-b border-[#ede8e1] dark:border-zinc-800/70 pb-4">
          <div>
            <span className="text-xs font-semibold font-sirwan text-[#d49757] tracking-normal block mb-1">
              سینەما و ئەنیمەیشن
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
              شاکارە هەڵبژێردراوەکان
            </h2>
          </div>

          <Link
            href="/films"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 hover:text-[#d49757] dark:hover:text-[#d49757] tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group"
          >
            <span>بینینی هەمووی</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
          </Link>
        </div>

        {/* Responsive Grid with refined FilmCard component */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {featuredFilms.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </section>

      {/* 3. Featured Literature Section ("نوێترین وتار و ڕامانەکان") */}
      <section className="w-full space-y-6">
        <div className="flex items-end justify-between border-b border-[#ede8e1] dark:border-zinc-800/70 pb-4">
          <div>
            <span className="text-xs font-semibold font-sirwan text-[#d49757] tracking-normal block mb-1">
              ئەدەب و هزر
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
              نوێترین وتار و ڕامانەکان
            </h2>
          </div>

          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 hover:text-[#d49757] dark:hover:text-[#d49757] tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group"
          >
            <span>گشت وتارەکان</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
          </Link>
        </div>

        {/* Responsive Grid of Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} priority={index === 0} />
          ))}
        </div>
      </section>

      {/* 4. Telegram Channel Showcase Banner */}
      <TelegramBanner />
    </main>
  );
}
