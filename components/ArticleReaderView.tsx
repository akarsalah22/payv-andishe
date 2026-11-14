"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Calendar, ExternalLink, BookOpen } from "lucide-react";
import type { Article } from "@/data/articles";
import { ReadingToolbar, type FontSize } from "@/components/ReadingToolbar";
import { PdfDownloadCard } from "@/components/PdfDownloadCard";
import { ShareButton } from "@/components/ShareButton";
import { FavoriteButton } from "@/components/FavoriteButton";

export interface ArticleReaderViewProps {
  article: Article;
}

const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  small: "text-sm sm:text-base leading-relaxed sm:leading-[2.2]",
  normal: "text-base sm:text-lg leading-relaxed sm:leading-[2.4]",
  large: "text-lg sm:text-xl leading-relaxed sm:leading-[2.6]",
  xlarge: "text-xl sm:text-2xl leading-relaxed sm:leading-[2.8]",
};

export function ArticleReaderView({ article }: ArticleReaderViewProps) {
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [imageError, setImageError] = useState(false);

  const imageSource = article.coverImage || (article as any).image || article.imageUrl;
  const imageFit = article.imageFit ?? 'contain';
  const imageZoom = article.imageZoom ?? 100;
  const imagePosX = article.imagePosX ?? 50;
  const imagePosY = article.imagePosY ?? 50;

  const shareArticleUrl = `https://mediay-islamy.vercel.app/articles/${encodeURIComponent(article.slug || article.id)}`;

  // Resolve body paragraphs with graceful fallback to excerpt / informative reader text
  const contentParagraphs = useMemo(() => {
    let rawList: string[] = [];
    const rawContent: unknown = article.content || (article as any).description;

    if (Array.isArray(rawContent)) {
      rawList = rawContent.filter((p): p is string => typeof p === "string" && p.trim().length > 0);
    } else if (typeof rawContent === "string" && rawContent.trim()) {
      // Split by double newlines into separate paragraphs if available, preserving single newlines for poetry couplets
      const split = rawContent.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
      rawList = split.length > 0 ? split : [rawContent.trim()];
    }

    if (rawList.length > 0) {
      return rawList;
    }

    if (article.excerpt && article.excerpt.trim()) {
      return [
        article.excerpt.trim(),
        "دەقی تەواوی ئەم بابەتە لە ڕێگەی فایلی پەڕتووک و نووسینەکەوە لە خوارەوە بەردەست کراوە بۆ خوێندنەوە و داگرتن."
      ];
    }

    return [
      "دەقی تەواوی ئەم بەرهەمە لە ڕێگەی فایلی PDF لە خوارەوە بەردەستە تاوەکو بتوانن بە کوالێتی بەرز بیخوێننەوە و پاشەکەوتی بکەن."
    ];
  }, [article.content, (article as any).description, article.excerpt]);

  // Word count for reading estimation calculation
  const totalWords = useMemo(() => {
    return contentParagraphs.join(" ").trim().split(/\s+/).filter(Boolean).length;
  }, [contentParagraphs]);

  return (
    <article
      dir="rtl"
      className="w-full py-6 sm:py-12 space-y-8 text-right flex-1 flex flex-col max-w-4xl mx-auto"
    >
      {/* Top Back Navigation Bar */}
      <div className="w-full flex items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm font-medium font-sirwan text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 whitespace-nowrap transition-colors duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group shrink-0"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 shrink-0" strokeWidth={1.8} />
          <span>گەڕانەوە</span>
          <span className="hidden sm:inline">بۆ بابەت و نووسینەکان</span>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
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
            <Calendar className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={1.8} />
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
            <p className="text-sm sm:text-base font-normal font-sirwan text-zinc-700 dark:text-zinc-300 leading-relaxed tracking-normal whitespace-pre-line break-words">
              {article.excerpt}
            </p>
          </div>
        )}
      </header>

      {/* Book Cover / Featured Image - Wide Landscape Aspect Ratio (16:9) matching card */}
      <div className="my-2">
        {!imageError && imageSource ? (
          <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-900 my-5 shadow-lg group">
            {/* Main Foreground Image */}
            <img
              src={imageSource}
              alt={article.title}
              onError={() => setImageError(true)}
              className={`w-full h-full ${imageFit === 'contain' ? 'object-contain relative z-10' : 'object-cover'}`}
              style={{
                objectPosition: `${imagePosX}% ${imagePosY}%`,
                transform: `scale(${imageZoom / 100})`,
              }}
            />
            {/* Ambient Blurred Background Layer for Contain Mode */}
            {imageFit === 'contain' && (
              <img
                src={imageSource}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-45 pointer-events-none"
              />
            )}
          </div>
        ) : (
          /* Neat, styled wide-aspect placeholder when image is absent or errors */
          <div
            className="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-950 p-6 sm:p-8 flex flex-col justify-between text-right select-none my-5"
            dir="rtl"
          >
            {/* Subtle book spine effect */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-black/10 dark:from-black/40 to-transparent border-l border-zinc-300/40 dark:border-white/5 pointer-events-none" />

            {/* Top Badge & Icon */}
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-sirwan bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                {article.category}
              </span>
            </div>

            {/* Center Title & Accent */}
            <div className="space-y-2.5 py-4">
              <div className="w-8 h-0.5 bg-amber-500/60 rounded-full" />
              <h3 className="text-base sm:text-xl font-bold font-peshang text-zinc-900 dark:text-white line-clamp-2 leading-snug">
                {article.title}
              </h3>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-zinc-300/70 dark:border-zinc-800/80 flex items-center justify-between text-xs font-sirwan text-zinc-600 dark:text-zinc-400">
              <span className="truncate max-w-[200px]">{article.author || "میدیای ئیسلامی"}</span>
              <span className="text-xs text-amber-600 dark:text-amber-400/80 font-mono">PDF</span>
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
      <div className="w-full max-w-2xl mx-auto space-y-6 pt-4 pb-2">
        {contentParagraphs.map((paragraph, index) => (
          <div
            key={index}
            className={`text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal font-sirwan whitespace-pre-line break-words tracking-normal transition-all duration-200 ${FONT_SIZE_CLASSES[fontSize]}`}
          >
            {paragraph}
          </div>
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
      <footer className="w-full max-w-2xl mx-auto pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
        {/* Back to archive navigation */}
        <div className="text-center">
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

