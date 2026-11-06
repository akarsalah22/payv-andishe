"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { LiteYouTube } from "@/components/LiteYouTube";
import { TelegramParts, type TelegramPartItem } from "@/components/TelegramParts";
import { TelegramIcon } from "@/components/TelegramIcon";
import { YouTubeIcon } from "@/components/YouTubeIcon";
import { extractYouTubeId } from "@/data/films";

export interface MediaViewerProps {
  title: string;
  posterUrl?: string;
  watchUrl?: string;
  telegramPostUrl?: string;
  youtubeId?: string;
  parts?: TelegramPartItem[];
  className?: string;
}

export function MediaViewer({
  title,
  posterUrl,
  watchUrl,
  telegramPostUrl,
  youtubeId,
  parts = [],
  className = "",
}: MediaViewerProps) {
  // 1. YouTube Identification
  const resolvedYouTubeId =
    youtubeId ||
    extractYouTubeId(watchUrl) ||
    extractYouTubeId(telegramPostUrl);

  if (resolvedYouTubeId) {
    return (
      <section className={`w-full space-y-3.5 text-right ${className}`} dir="rtl">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600/10 text-red-600 flex items-center justify-center">
              <YouTubeIcon className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100">
              پەخشی ڕاستەوخۆ
            </h2>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${resolvedYouTubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-sirwan text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
          >
            <span>کردنەوە لە یووتووب</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <LiteYouTube videoId={resolvedYouTubeId} title={title} />
      </section>
    );
  }

  // 2. Multi-Part Telegram Content
  const hasMultipleParts = Array.isArray(parts) && parts.length > 1;

  if (hasMultipleParts) {
    return (
      <section className={`w-full space-y-4 text-right ${className}`} dir="rtl">
        <TelegramParts parts={parts} />
      </section>
    );
  }

  // 3. Single Telegram Media Card (High-End & Polished)
  const targetTelegramUrl =
    (parts && parts.length === 1 ? parts[0].url : "") ||
    watchUrl ||
    telegramPostUrl ||
    "https://t.me/mediay_islamy";

  return (
    <section
      className={`relative w-full rounded-3xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-10 text-center shadow-lg dark:shadow-xl transition-colors duration-200 ${className}`}
      dir="rtl"
    >
      {/* Background Banner / Backdrop with Elegant Dark Overlay */}
      {posterUrl && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={posterUrl}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover blur-xl opacity-15 dark:opacity-25 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/70 dark:from-zinc-950 dark:via-zinc-950/85 dark:to-zinc-950/60" />
        </div>
      )}

      {/* Foreground Content */}
      <div className="relative z-10 max-w-xl mx-auto space-y-5 flex flex-col items-center">
        {/* Telegram Icon Badge */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25 flex items-center justify-center shadow-lg shadow-sky-500/10 transition-transform duration-300 hover:scale-105">
          <TelegramIcon className="w-8 h-8 sm:w-9 sm:h-9" />
        </div>

        {/* Clean Kurdish Notice & Movie Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold font-sirwan text-sky-700 dark:text-sky-400">
            <span>کەناڵی فەرمی</span>
            <span>•</span>
            <span dir="ltr" className="font-mono">@mediay_islamy</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-peshang text-zinc-900 dark:text-white">
            ئەم بەرهەمە لە کەناڵی تێلیگرام بەردەستە
          </h3>

          <p className="text-xs sm:text-sm font-sirwan text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            دەتوانیت تەواوی ئەم بەرهەمە بە کوالێتی بەرز و بێ کێشە لە ڕێگەی کەناڵی فەرمی تێلیگرام ببینیت و دایبگریت.
          </p>
        </div>

        {/* Direct Action Button */}
        <div className="pt-2 w-full sm:w-auto">
          <a
            href={targetTelegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-bold font-sirwan text-sm sm:text-base shadow-xl shadow-sky-500/25 transition-all duration-200 cursor-pointer touch-manipulation tap-highlight-transparent"
          >
            <TelegramIcon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span>بینین و داگرتن لە تێلیگرام</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default MediaViewer;
