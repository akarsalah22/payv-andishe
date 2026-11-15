"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight, ExternalLink, Tv } from "lucide-react";
import { LiteYouTube } from "@/components/LiteYouTube";
import { TelegramParts, type TelegramPartItem } from "@/components/TelegramParts";
import { TelegramIcon } from "@/components/TelegramIcon";
import { YouTubeIcon } from "@/components/YouTubeIcon";
import { OkRuIcon } from "@/components/OkRuIcon";
import { extractYouTubeId, extractOkRuVideoId, getOkRuEmbedUrl, toKurdishNumber } from "@/data/films";
import { getEmbedInfo } from "@/lib/videoEmbed";

export interface MediaViewerProps {
  title: string;
  posterUrl?: string;
  watchUrl?: string;
  telegramPostUrl?: string;
  youtubeId?: string;
  okruUrl?: string;
  parts?: TelegramPartItem[];
  className?: string;
}

function getEpisodePlayableUrl(part: TelegramPartItem): string {
  if (part.youtubeUrl && part.youtubeUrl.trim()) return part.youtubeUrl.trim();
  if (part.okruUrl && part.okruUrl.trim()) return part.okruUrl.trim();
  if (part.url && !part.url.includes("t.me")) return part.url.trim();
  if (part.telegramUrl && !part.telegramUrl.includes("t.me")) return part.telegramUrl.trim();
  return (part.url || part.telegramUrl || "").trim();
}

export function MediaViewer({
  title,
  posterUrl,
  watchUrl,
  telegramPostUrl,
  youtubeId,
  okruUrl,
  parts = [],
  className = "",
}: MediaViewerProps) {
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState<number | null>(null);
  const [isPlayingSingle, setIsPlayingSingle] = useState(false);

  const hasMultipleParts = Array.isArray(parts) && parts.length > 0;

  const handleSelectEpisode = (index: number) => {
    setActiveEpisodeIndex(index);
    setTimeout(() => {
      const playerEl = document.getElementById("in-site-player");
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  const handleClosePlayer = () => {
    setActiveEpisodeIndex(null);
    setIsPlayingSingle(false);
  };

  // 1. Multi-Part / Multi-Episode Interactive Theater Player
  if (hasMultipleParts) {
    const currentEpisode =
      activeEpisodeIndex !== null && parts[activeEpisodeIndex]
        ? parts[activeEpisodeIndex]
        : null;

    const currentEpisodeUrl = currentEpisode
      ? getEpisodePlayableUrl(currentEpisode)
      : "";

    const currentEmbed = currentEpisodeUrl ? getEmbedInfo(currentEpisodeUrl) : null;

    return (
      <section id="in-site-player" className={`w-full space-y-6 text-right ${className}`} dir="rtl">
        {activeEpisodeIndex !== null && currentEpisode ? (
          <div className="w-full space-y-2.5 sm:space-y-3.5 rounded-2xl sm:rounded-3xl bg-zinc-900 border border-zinc-800 p-3 sm:p-6 shadow-2xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </div>
                <div className="min-w-0 flex-1 text-right">
                  {/* Mobile concise title */}
                  <p className="sm:hidden text-xs font-semibold font-sirwan text-zinc-100 truncate">
                    {currentEpisode.title || `ئەڵقەی ${toKurdishNumber(activeEpisodeIndex + 1)}`}
                  </p>
                  {/* Desktop full title */}
                  <h2 className="hidden sm:block text-sm sm:text-base font-bold font-peshang text-white truncate">
                    {title} —{" "}
                    <span className="text-amber-400">
                      {currentEpisode.title || `ئەڵقەی ${toKurdishNumber(activeEpisodeIndex + 1)}`}
                    </span>
                  </h2>
                </div>
              </div>

              {/* Mobile icon-only close button */}
              <button
                type="button"
                onClick={handleClosePlayer}
                aria-label="داخستن"
                title="داخستنی پەخشکەر"
                className="sm:hidden w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Desktop close button */}
              <button
                type="button"
                onClick={handleClosePlayer}
                title="داخستنی پەخشکەر"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold font-sirwan transition-colors cursor-pointer shrink-0"
              >
                <span>داخستن</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 16:9 Responsive Player */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl relative">
              {currentEmbed?.type === "video" ? (
                <video
                  key={currentEmbed.src}
                  src={currentEmbed.src}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : currentEmbed?.type === "iframe" ? (
                <iframe
                  key={currentEmbed.src}
                  src={currentEmbed.src}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  loading="lazy"
                  title={`${title} - ${currentEpisode.title || activeEpisodeIndex + 1}`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <p className="text-sm text-zinc-300 font-sirwan">
                    ئەم ئەڵقەیە لە ڕێگەی تێلیگرامەوە بەردەستە:
                  </p>
                  {currentEpisodeUrl && (
                    <a
                      href={currentEpisodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold font-sirwan text-sm transition-all"
                    >
                      <TelegramIcon className="w-4 h-4" />
                      <span>کردنەوە لە تێلیگرام</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Next / Prev Controls */}
            {parts.length > 1 && (
              <div className="flex items-center justify-between gap-2 pt-2 sm:pt-2">
                <button
                  type="button"
                  disabled={activeEpisodeIndex === 0}
                  onClick={() => handleSelectEpisode(activeEpisodeIndex - 1)}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:h-auto sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium sm:font-bold font-sirwan transition-all cursor-pointer whitespace-nowrap ${
                    activeEpisodeIndex === 0
                      ? "opacity-30 cursor-not-allowed bg-zinc-800/80 sm:bg-zinc-800 text-zinc-500 border border-transparent"
                      : "border border-zinc-700/60 sm:border-transparent bg-zinc-800/80 sm:bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white active:scale-95"
                  }`}
                >
                  <ChevronRight className="w-4 h-4 shrink-0" />
                  <span className="sm:hidden">پێشوو</span>
                  <span className="hidden sm:inline">ئەڵقەی پێشوو</span>
                </button>

                <div className="text-xs sm:text-sm font-medium sm:font-bold font-sirwan text-zinc-400 tabular-nums whitespace-nowrap">
                  <span className="sm:hidden">
                    {toKurdishNumber(activeEpisodeIndex + 1)} / {toKurdishNumber(parts.length)}
                  </span>
                  <span className="hidden sm:inline">
                    ئەڵقەی{" "}
                    <span className="text-amber-400">
                      {toKurdishNumber(activeEpisodeIndex + 1)}
                    </span>{" "}
                    لە {toKurdishNumber(parts.length)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={activeEpisodeIndex === parts.length - 1}
                  onClick={() => handleSelectEpisode(activeEpisodeIndex + 1)}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:h-auto sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold font-sirwan transition-all cursor-pointer whitespace-nowrap ${
                    activeEpisodeIndex === parts.length - 1
                      ? "opacity-30 cursor-not-allowed bg-zinc-800 text-zinc-500"
                      : "bg-amber-500 hover:bg-amber-400 text-zinc-950 active:scale-95 shadow-sm shadow-amber-500/20"
                  }`}
                >
                  <span className="sm:hidden">دواتر</span>
                  <span className="hidden sm:inline">ئەڵقەی دواتر</span>
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Authentic 16:9 Cinema Screen Stage (Idle State) */
          <div className="w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/90 shadow-2xl">
            <button
              type="button"
              onClick={() => handleSelectEpisode(0)}
              className="group relative w-full aspect-video flex flex-col items-center justify-center text-center px-4 cursor-pointer focus:outline-none select-none overflow-hidden"
              aria-label="تەماشاکردنی زنجیرەکە"
            >
              {/* 1. Subtle Dimmed Backdrop */}
              {posterUrl && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <Image
                    src={posterUrl}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/60" />
                </div>
              )}

              {/* 2. Top-Right Minimal Screen Indicator Badge */}
              <div className="absolute top-3.5 right-3.5 z-20 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/10 text-[11px] font-medium font-sirwan text-zinc-300">
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>شاشەی پەخش</span>
              </div>

              {/* 3. Center Interactive Cinema Play Trigger */}
              <div className="z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/12 group-hover:bg-amber-500 border border-white/25 group-hover:border-amber-400 backdrop-blur-md flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-xl">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-zinc-950 fill-current translate-x-[1px] transition-colors duration-200" />
              </div>

              {/* Clear Screen Label Below the Play Button */}
              <div className="mt-3.5 z-20 text-center">
                <p className="text-sm sm:text-base font-bold font-peshang text-white">
                  لێرە تەماشای زنجیرەکە بکە — ئەڵقەی ١
                </p>
                <p className="text-xs font-sirwan text-zinc-400 mt-1">
                  کرتە لە شاشەکە بکە یان ئەڵقەیەک لە خوارەوە هەڵبژێرە
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Episode List */}
        <TelegramParts
          parts={parts}
          activeEpisodeIndex={activeEpisodeIndex}
          onSelectEpisode={handleSelectEpisode}
        />
      </section>
    );
  }

  // 2. OK.ru Video Embed Check (Single Film)
  const resolvedOkRuEmbedUrl = getOkRuEmbedUrl(
    okruUrl || (watchUrl?.includes("ok.ru") ? watchUrl : undefined)
  );
  if (resolvedOkRuEmbedUrl) {
    const rawOkRuSource = okruUrl || watchUrl || "";
    return (
      <section id="in-site-player" className={`w-full space-y-6 text-right ${className}`} dir="rtl">
        {!isPlayingSingle ? (
          <div className="w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/90 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsPlayingSingle(true)}
              className="group relative w-full aspect-video flex flex-col items-center justify-center text-center px-4 cursor-pointer focus:outline-none select-none overflow-hidden"
              aria-label="تەماشاکردنی فیلمەکە"
            >
              {/* 1. Subtle Dimmed Backdrop */}
              {posterUrl && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <Image
                    src={posterUrl}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/60" />
                </div>
              )}

              {/* 2. Top-Right Minimal Screen Indicator Badge */}
              <div className="absolute top-3.5 right-3.5 z-20 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/10 text-[11px] font-medium font-sirwan text-zinc-300">
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>شاشەی پەخش</span>
              </div>

              {/* 3. Center Interactive Cinema Play Trigger */}
              <div className="z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/12 group-hover:bg-amber-500 border border-white/25 group-hover:border-amber-400 backdrop-blur-md flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-xl">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-zinc-950 fill-current translate-x-[1px] transition-colors duration-200" />
              </div>

              {/* Clear Screen Label Below the Play Button */}
              <div className="mt-3.5 z-20 text-center">
                <p className="text-sm sm:text-base font-bold font-peshang text-white">
                  لێرە تەماشای فیلمەکە بکە
                </p>
                <p className="text-xs font-sirwan text-zinc-400 mt-1">
                  کرتە لە شاشەکە بکە بۆ دەستپێکردنی پەخش
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div className="w-full space-y-2.5 sm:space-y-3.5 rounded-2xl sm:rounded-3xl bg-zinc-900 border border-zinc-800 p-3 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-500 flex items-center justify-center shrink-0">
                  <OkRuIcon className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold font-peshang text-white truncate">
                  {title} — <span className="text-orange-400">OK.ru</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {rawOkRuSource && (
                  <a
                    href={
                      rawOkRuSource.startsWith("http")
                        ? rawOkRuSource
                        : `https://ok.ru/video/${extractOkRuVideoId(rawOkRuSource)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-orange-400 text-xs font-semibold font-sirwan transition-colors"
                  >
                    <span>کردنەوە لە OK.ru</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleClosePlayer}
                  aria-label="داخستن"
                  title="داخستنی پەخشکەر"
                  className="sm:hidden w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleClosePlayer}
                  title="داخستنی پەخشکەر"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold font-sirwan transition-colors cursor-pointer shrink-0"
                >
                  <span>داخستن</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl">
              <iframe
                src={resolvedOkRuEmbedUrl}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                loading="lazy"
                title={title}
              />
            </div>
          </div>
        )}
      </section>
    );
  }

  // 3. YouTube Identification (Single Film)
  const resolvedYouTubeId =
    youtubeId ||
    extractYouTubeId(watchUrl) ||
    extractYouTubeId(telegramPostUrl);

  if (resolvedYouTubeId) {
    return (
      <section id="in-site-player" className={`w-full space-y-6 text-right ${className}`} dir="rtl">
        {!isPlayingSingle ? (
          <div className="w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/90 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsPlayingSingle(true)}
              className="group relative w-full aspect-video flex flex-col items-center justify-center text-center px-4 cursor-pointer focus:outline-none select-none overflow-hidden"
              aria-label="تەماشاکردنی فیلمەکە"
            >
              {/* 1. Subtle Dimmed Backdrop */}
              {posterUrl && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <Image
                    src={posterUrl}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/60" />
                </div>
              )}

              {/* 2. Top-Right Minimal Screen Indicator Badge */}
              <div className="absolute top-3.5 right-3.5 z-20 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/10 text-[11px] font-medium font-sirwan text-zinc-300">
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>شاشەی پەخش</span>
              </div>

              {/* 3. Center Interactive Cinema Play Trigger */}
              <div className="z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/12 group-hover:bg-amber-500 border border-white/25 group-hover:border-amber-400 backdrop-blur-md flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-xl">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-zinc-950 fill-current translate-x-[1px] transition-colors duration-200" />
              </div>

              {/* Clear Screen Label Below the Play Button */}
              <div className="mt-3.5 z-20 text-center">
                <p className="text-sm sm:text-base font-bold font-peshang text-white">
                  لێرە تەماشای فیلمەکە بکە
                </p>
                <p className="text-xs font-sirwan text-zinc-400 mt-1">
                  کرتە لە شاشەکە بکە بۆ دەستپێکردنی پەخش
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div className="w-full space-y-2.5 sm:space-y-3.5 rounded-2xl sm:rounded-3xl bg-zinc-900 border border-zinc-800 p-3 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-red-600/15 text-red-500 flex items-center justify-center shrink-0">
                  <YouTubeIcon className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold font-peshang text-white truncate">
                  {title} — <span className="text-red-400">یووتووب</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.youtube.com/watch?v=${resolvedYouTubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-red-400 text-xs font-semibold font-sirwan transition-colors"
                >
                  <span>کردنەوە لە یووتووب</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleClosePlayer}
                  aria-label="داخستن"
                  title="داخستنی پەخشکەر"
                  className="sm:hidden w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleClosePlayer}
                  title="داخستنی پەخشکەر"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold font-sirwan transition-colors cursor-pointer shrink-0"
                >
                  <span>داخستن</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <LiteYouTube videoId={resolvedYouTubeId} title={title} />
          </div>
        )}
      </section>
    );
  }

  // 4. Single Telegram Media Card (Fallback)
  const targetTelegramUrl =
    watchUrl ||
    telegramPostUrl ||
    "https://t.me/mediay_islamy";

  return (
    <section
      id="in-site-player"
      className={`relative w-full rounded-3xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-10 text-center shadow-lg dark:shadow-xl transition-colors duration-200 ${className}`}
      dir="rtl"
    >
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

      <div className="relative z-10 max-w-xl mx-auto space-y-5 flex flex-col items-center">
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25 flex items-center justify-center shadow-lg shadow-sky-500/10 transition-transform duration-300 hover:scale-105">
          <TelegramIcon className="w-8 h-8 sm:w-9 sm:h-9" />
        </div>

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
            دەتوانیت تەواوی ئەم بەرهەمە لە ڕێگەی کەناڵی فەرمی تێلیگرام ببینیت و دایبگریت.
          </p>
        </div>

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
