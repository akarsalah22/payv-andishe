"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Calendar, ExternalLink, BookOpen } from "lucide-react";
import type { Article } from "@/data/articles";
import { ReadingToolbar, type FontSize } from "@/components/ReadingToolbar";
import { PdfDownloadCard } from "@/components/PdfDownloadCard";
import { ShareButton } from "@/components/ShareButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { TelegramIcon } from "@/components/TelegramIcon";

export interface ArticleReaderViewProps {
  article: Article;
}

const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  small: "text-sm sm:text-base leading-relaxed sm:leading-[2.2]",
  normal: "text-base sm:text-[17px] md:text-lg leading-loose sm:leading-[2.4]",
  large: "text-lg sm:text-xl leading-loose sm:leading-[2.6]",
  xlarge: "text-xl sm:text-2xl leading-loose sm:leading-[2.8]",
};

export function ArticleReaderView({ article }: ArticleReaderViewProps) {
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [imageError, setImageError] = useState(false);

  const imageSource = article.coverImage || article.imageUrl;
  const shareArticleUrl = `https://mediay-islamy.vercel.app/articles/${encodeURIComponent(article.slug || article.id)}`;
  const shareTelegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    shareArticleUrl
  )}&text=${encodeURIComponent(article.title)}`;

  // Word count for reading estimation calculation
  const totalWords = Array.isArray(article.content)
    ? article.content.join(" ").trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <article
      dir="rtl"
      className="w-full py-6 sm:py-12 space-y-8 text-right flex-1 flex flex-col max-w-4xl mx-auto"
    >
      {/* Top Back Navigation Bar */}
      <div className="w-full flex items-center justify-between pb-4 sm:pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group"
        >
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
          <span>گەڕانەوە بۆ بابەت و وتارەکان</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Favorite / Bookmark Button */}
          <FavoriteButton
            item={{
              id: article.id || article.slug,
              title: article.title,
              imageUrl: imageSource || '/placeholder-article.jpg',
              type: 'writing',
              slug: article.slug || article.id,
              category: article.category,
            }}
            variant="pill"
          />

          {/* Share Button */}
          <ShareButton
            title={article.title}
            text={`${article.title} - لە میدیای ئیسلامی`}
            url={shareArticleUrl}
          />

          {/* Telegram Share */}
          <a
            href={shareTelegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold font-sirwan bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20 transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none"
            title="هاوبەشکردن لە تێلیگرام"
          >
            <TelegramIcon className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span className="hidden sm:inline">تێلیگرام</span>
          </a>
        </div>
      </div>

      {/* Article Header (Editorial Hierarchy) */}
      <header className="w-full max-w-2xl mx-auto space-y-5 text-right">
        {/* Category Badge & Publication Date */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold font-sirwan bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 tracking-normal shadow-2xs">
            {article.category}
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.75} />
            <span>{article.date}</span>
          </span>

          {article.author && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400">
                {article.author}
              </span>
            </>
          )}
        </div>

        {/* Stately Kurdish Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal sm:leading-relaxed">
          {article.title}
        </h1>

        {/* Excerpt / Lead Teaser */}
        {article.excerpt && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/60 border-s-4 border-amber-500 border-y border-e border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs">
            <p className="text-sm sm:text-base font-normal font-sirwan text-zinc-700 dark:text-zinc-300 leading-relaxed tracking-normal">
              {article.excerpt}
            </p>
          </div>
        )}
      </header>

      {/* Book Cover / Featured Image */}
      <div className="my-2">
        {!imageError && imageSource ? (
          <div className="relative w-48 sm:w-64 aspect-[3/4] mx-auto rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900 group">
            <Image
              src={imageSource || "/placeholder.png"}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 640px) 192px, 256px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          /* Neat, styled book-cover placeholder */
          <div
            className="relative w-48 sm:w-64 aspect-[3/4] mx-auto rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 p-5 flex flex-col justify-between text-right select-none shadow-black/60"
            dir="rtl"
          >
            {/* Subtle book spine effect */}
            <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-gradient-to-l from-black/40 to-transparent border-l border-white/5 pointer-events-none" />

            {/* Top Badge & Icon */}
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-sirwan bg-amber-500/15 text-amber-400 border border-amber-500/25">
                {article.category}
              </span>
            </div>

            {/* Center Title & Accent */}
            <div className="space-y-2 py-3">
              <div className="w-6 h-0.5 bg-amber-500/60 rounded-full" />
              <h3 className="text-sm sm:text-base font-bold font-peshang text-white line-clamp-3 leading-snug">
                {article.title}
              </h3>
            </div>

            {/* Bottom Meta */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-sirwan text-zinc-400">
              <span className="truncate max-w-[130px]">{article.author || "میدیای ئیسلامی"}</span>
              <span className="text-[10px] text-amber-400/80 font-mono">PDF</span>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Interactive Reading Toolbar (Font Size Controls & Reading Time) */}
      <ReadingToolbar
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        readingTime={article.readTime}
        wordCount={totalWords}
        title={article.title}
        url={shareArticleUrl}
        item={{
          id: article.id || article.slug,
          title: article.title,
          imageUrl: imageSource || '/placeholder-article.jpg',
          type: 'writing',
          slug: article.slug || article.id,
          category: article.category,
        }}
      />

      {/* Focused Reading Body Text with Dynamic Font Size */}
      <div className="w-full max-w-2xl mx-auto space-y-6 pt-2">
        {article.content.map((paragraph, index) => (
          <p
            key={index}
            className={`font-normal font-sirwan text-zinc-800 dark:text-zinc-200 tracking-normal text-justify transition-all duration-200 ${FONT_SIZE_CLASSES[fontSize]}`}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Primary Call-to-Action: PDF Download Card */}
      {article.pdfUrl && (
        <div className="w-full max-w-2xl mx-auto pt-6">
          <PdfDownloadCard
            pdfUrl={article.pdfUrl}
            title={`داگرتنی فایلی PDF`}
            subtitle={`دەتوانیت تەواوی ئەم بابەتە (${article.title}) بە شێوەی پەڕگە بۆ خوێندنەوەی ئۆفلاین دابگریت.`}
          />
        </div>
      )}

      {/* Secondary Resource Link (if external URL present) */}
      {article.externalUrl && (
        <div className="w-full max-w-2xl mx-auto pt-2">
          <a
            href={article.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 hover:border-amber-500/40 dark:hover:border-amber-500/40 shadow-xs transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 block group-hover:text-amber-500 transition-colors">
                  سەرچاوەی دەرەکی / دەنگی
                </span>
                <span className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
                  بۆ بینینی زانیاری زیاتر یان گوێگرتن لە بەرهەمەکە
                </span>
              </div>
            </div>

            <span className="text-xs font-sirwan text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              کردنەوە ←
            </span>
          </a>
        </div>
      )}

      {/* Article Footer & Return to Archive */}
      <footer className="w-full max-w-2xl mx-auto pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-6">
        {/* Telegram Share Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="space-y-1 text-center sm:text-right">
            <span className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 block">
              ئەم وتارەت بەدڵ بوو؟
            </span>
            <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
              دەتوانیت لەگەڵ هاوڕێکانت لە تێلیگرام هاوبەشی پێبکەیت.
            </p>
          </div>

          <a
            href={shareTelegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold font-sirwan text-xs sm:text-sm tracking-normal shadow-sm transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
          >
            <TelegramIcon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span>هاوبەشکردن لە تێلیگرام</span>
          </a>
        </div>

        {/* Back to archive navigation */}
        <div className="text-center pt-2">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            <span>گەڕانەوە بۆ لیستی سەرجەم وتارەکان</span>
          </Link>
        </div>
      </footer>
    </article>
  );
}

export default ArticleReaderView;

