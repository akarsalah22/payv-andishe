"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { TelegramIcon } from "@/components/TelegramIcon";
import { YouTubeIcon } from "@/components/YouTubeIcon";
import { OkRuIcon } from "@/components/OkRuIcon";
import { TelegramParts, type TelegramPartItem } from "@/components/TelegramParts";
import { LiteYouTube } from "@/components/LiteYouTube";
import { getEmbedInfo, extractOkRuVideoId } from "@/lib/videoEmbed";
import { toKurdishNumber, normalizeCategory, type Film, type FilmPart } from "@/data/films";

export interface FilmInteractiveViewerProps {
  film: Partial<Film>;
  episodes?: FilmPart[];
  okruEmbedUrl?: string | null;
  okruSource?: string;
  youtubeId?: string | null;
  watchUrl?: string;
  className?: string;
}

/**
 * Resolves the primary playable stream URL for a given episode/part.
 */
function getEpisodePlayableUrl(part: FilmPart | TelegramPartItem): string {
  if (part.youtubeUrl && part.youtubeUrl.trim()) return part.youtubeUrl.trim();
  if (part.okruUrl && part.okruUrl.trim()) return part.okruUrl.trim();
  if (part.url && !part.url.includes("t.me")) return part.url.trim();
  if (part.telegramUrl && !part.telegramUrl.includes("t.me")) return part.telegramUrl.trim();
  return (part.url || part.telegramUrl || "").trim();
}

export function FilmInteractiveViewer({
  film,
  episodes = [],
  okruEmbedUrl,
  okruSource,
  youtubeId,
  watchUrl,
  className = "",
}: FilmInteractiveViewerProps) {
  // State for currently playing episode index in theater player
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState<number | null>(null);
  // State for playing single film
  const [isPlayingSingle, setIsPlayingSingle] = useState(false);

  const hasEpisodes = Array.isArray(episodes) && episodes.length > 0;
  const posterSrc = film.posterUrl || "/placeholder.jpg";
  const fit = film.imageFit ?? "contain";
  const zoom = (film.imageZoom ?? 100) / 100;
  const posX = film.imagePosX ?? 50;
  const posY = film.imagePosY ?? 50;
  const isDataUrl = posterSrc.startsWith("data:");

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

  // Currently selected episode details
  const currentEpisode =
    activeEpisodeIndex !== null && episodes[activeEpisodeIndex]
      ? episodes[activeEpisodeIndex]
      : null;

  const currentEpisodePlayableUrl = currentEpisode
    ? getEpisodePlayableUrl(currentEpisode)
    : "";

  const currentEmbedInfo = currentEpisodePlayableUrl
    ? getEmbedInfo(currentEpisodePlayableUrl)
    : null;

  return (
    <div className={`w-full space-y-10 text-right ${className}`} dir="rtl">
      {/* 1. Main Hero / Backdrop Showcase Card */}
      <div className="relative w-full rounded-3xl overflow-hidden p-6 sm:p-8 transition-colors duration-200 bg-white border border-zinc-200 shadow-md dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-2xl">
        {/* Ambient Blurred Backdrop (Dark mode only for cinematic glow, clean white in light mode) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block">
          <Image
            src={posterSrc}
            alt=""
            aria-hidden="true"
            fill
            sizes="100px"
            className="object-cover blur-2xl opacity-25 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/85 to-zinc-900/40" />
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Poster Card with Custom Framing & Zoom Clipping */}
          <div className="relative w-44 sm:w-56 md:w-60 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-zinc-200/80 dark:border-white/15 bg-zinc-100 dark:bg-zinc-800 group">
            <div className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none">
              {fit === "contain" ? (
                <>
                  <Image
                    src={posterSrc}
                    alt=""
                    fill
                    aria-hidden="true"
                    unoptimized={isDataUrl}
                    sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 240px"
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-45 pointer-events-none select-none"
                  />
                  <div className="relative z-10 w-full h-full overflow-hidden">
                    <Image
                      src={posterSrc}
                      alt={film.titleKurdish || ""}
                      fill
                      priority
                      unoptimized={isDataUrl}
                      sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 240px"
                      className="w-full h-full object-contain transition-transform duration-300 select-none"
                      style={{
                        objectPosition: `${posX}% ${posY}%`,
                        transform: `scale(${zoom})`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="relative z-10 w-full h-full overflow-hidden">
                  <Image
                    src={posterSrc}
                    alt={film.titleKurdish || ""}
                    fill
                    priority
                    unoptimized={isDataUrl}
                    sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 240px"
                    className="w-full h-full object-cover transition-transform duration-300 select-none"
                    style={{
                      objectPosition: `${posX}% ${posY}%`,
                      transform: `scale(${zoom})`,
                    }}
                  />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-20" />
          </div>

          {/* Details & Metadata Column */}
          <div className="flex-1 text-center md:text-right space-y-4 w-full">
            {/* Badges Bar */}
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              {film.category && (
                <span className="px-3 py-1 rounded-full text-xs font-bold font-sirwan bg-amber-500 text-zinc-950 shadow-sm">
                  {normalizeCategory(film.category)}
                </span>
              )}
              {film.genres &&
                Array.from(new Set(film.genres.map((g) => g.trim()).filter(Boolean))).map(
                  (g, idx) => (
                    <span
                      key={`genre-${g}-${idx}`}
                      className="px-2.5 py-1 rounded-full text-xs font-medium font-sirwan bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-200 border border-zinc-200/80 dark:border-white/10 shadow-2xs"
                    >
                      {g}
                    </span>
                  )
                )}
            </div>

            {/* Title & Original Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-peshang text-zinc-900 dark:text-white leading-normal">
                {film.titleKurdish}
              </h1>
              {film.originalTitle && (
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans mt-1">
                  {film.originalTitle}
                </p>
              )}
            </div>

            {/* Quick Metadata Row */}
            <div className="flex items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-sirwan flex-wrap pt-1">
              {film.year && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500 dark:text-amber-400" strokeWidth={1.75} />
                  <span>ساڵی بەرهەمهێنان: {film.year}</span>
                </span>
              )}
              {film.duration && (
                <>
                  <span className="text-zinc-400 dark:text-zinc-600">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" strokeWidth={1.75} />
                    <span>ماوە: {film.duration}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. In-Site Video Theater Section */}
      <section id="in-site-player" className="w-full scroll-mt-24 space-y-6">
        {hasEpisodes ? (
          /* Multi-Episode Series Mode */
          <div className="w-full space-y-4">
            {activeEpisodeIndex !== null && currentEpisode ? (
              /* Active Theater Player Container */
              <div className="w-full space-y-2.5 sm:space-y-3.5 rounded-2xl sm:rounded-3xl bg-zinc-900 border border-zinc-800 p-3 sm:p-6 shadow-2xl">
                {/* Top Bar with Media Title, Episode Title & Close Button */}
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
                        {film.titleKurdish} —{" "}
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

                {/* 16:9 Responsive Video Container */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl relative">
                  {currentEmbedInfo?.type === "video" ? (
                    <video
                      key={currentEmbedInfo.src}
                      src={currentEmbedInfo.src}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : currentEmbedInfo?.type === "iframe" ? (
                    <iframe
                      key={currentEmbedInfo.src}
                      src={currentEmbedInfo.src}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen
                      loading="lazy"
                      title={`${film.titleKurdish} - ${currentEpisode.title || activeEpisodeIndex + 1}`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <p className="text-sm text-zinc-300 font-sirwan">
                        ئەم ئەڵقەیە لە ڕێگەی تێلیگرامەوە بەردەستە:
                      </p>
                      {currentEpisodePlayableUrl && (
                        <a
                          href={currentEpisodePlayableUrl}
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

                {/* Next / Previous Episode Controls Bar (when episodes > 1) */}
                {episodes.length > 1 && (
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
                        {toKurdishNumber(activeEpisodeIndex + 1)} / {toKurdishNumber(episodes.length)}
                      </span>
                      <span className="hidden sm:inline">
                        ئەڵقەی{" "}
                        <span className="text-amber-400">
                          {toKurdishNumber(activeEpisodeIndex + 1)}
                        </span>{" "}
                        لە {toKurdishNumber(episodes.length)}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={activeEpisodeIndex === episodes.length - 1}
                      onClick={() => handleSelectEpisode(activeEpisodeIndex + 1)}
                      className={`inline-flex items-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:h-auto sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold font-sirwan transition-all cursor-pointer whitespace-nowrap ${
                        activeEpisodeIndex === episodes.length - 1
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
              <div className="w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleSelectEpisode(0)}
                  className="group relative w-full aspect-video flex flex-col items-center justify-center text-center px-4 cursor-pointer focus:outline-none select-none overflow-hidden"
                  aria-label="تەماشاکردنی ئەڵقەی ١"
                >
                  {/* 1. Subtle Dimmed Backdrop */}
                  {posterSrc && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <Image
                        src={posterSrc}
                        alt=""
                        aria-hidden="true"
                        fill
                        unoptimized={isDataUrl}
                        className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60" />
                    </div>
                  )}

                  {/* 2. Center Play Trigger (No Yellow Box/Pill) */}
                  <div className="z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 group-hover:bg-white/25 border border-white/30 backdrop-blur-md flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current translate-x-[1px]" />
                  </div>

                  <span className="mt-3 z-10 text-sm sm:text-base font-bold text-white">
                    تەماشاکردن
                  </span>
                </button>
              </div>
            )}

            {/* Episode List Grid Component */}
            <div className="pt-2">
              <TelegramParts
                parts={episodes}
                activeEpisodeIndex={activeEpisodeIndex}
                onSelectEpisode={handleSelectEpisode}
              />
            </div>
          </div>
        ) : okruEmbedUrl ? (
          /* Single Film: OK.ru Direct Video Player */
          !isPlayingSingle ? (
            <div className="w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsPlayingSingle(true)}
                className="group relative w-full aspect-video flex flex-col items-center justify-center text-center px-4 cursor-pointer focus:outline-none select-none overflow-hidden"
                aria-label="تەماشاکردنی فیلم"
              >
                {/* 1. Subtle Dimmed Backdrop */}
                {posterSrc && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <Image
                      src={posterSrc}
                      alt=""
                      aria-hidden="true"
                      fill
                      unoptimized={isDataUrl}
                      className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60" />
                  </div>
                )}

                {/* 2. Center Play Trigger (No Yellow Box/Pill) */}
                <div className="z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 group-hover:bg-white/25 border border-white/30 backdrop-blur-md flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current translate-x-[1px]" />
                </div>

                <span className="mt-3 z-10 text-sm sm:text-base font-bold text-white">
                  تەماشاکردن
                </span>
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
                    {film.titleKurdish} — <span className="text-orange-400">OK.ru</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {okruSource && (
                    <a
                      href={
                        okruSource.startsWith("http")
                          ? okruSource
                          : `https://ok.ru/video/${extractOkRuVideoId(okruSource)}`
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
                  src={okruEmbedUrl}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  allowFullScreen
                  loading="lazy"
                  title={film.titleKurdish || "OK.ru video"}
                />
              </div>
            </div>
          )
        ) : youtubeId ? (
          /* Single Film: YouTube Player */
          !isPlayingSingle ? (
            <div className="w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsPlayingSingle(true)}
                className="group relative w-full aspect-video flex flex-col items-center justify-center text-center px-4 cursor-pointer focus:outline-none select-none overflow-hidden"
                aria-label="تەماشاکردنی فیلم"
              >
                {/* 1. Subtle Dimmed Backdrop */}
                {posterSrc && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <Image
                      src={posterSrc}
                      alt=""
                      aria-hidden="true"
                      fill
                      unoptimized={isDataUrl}
                      className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60" />
                  </div>
                )}

                {/* 2. Center Play Trigger (No Yellow Box/Pill) */}
                <div className="z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 group-hover:bg-white/25 border border-white/30 backdrop-blur-md flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current translate-x-[1px]" />
                </div>

                <span className="mt-3 z-10 text-sm sm:text-base font-bold text-white">
                  تەماشاکردن
                </span>
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
                    {film.titleKurdish} — <span className="text-red-400">یووتووب</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
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

              <LiteYouTube videoId={youtubeId} title={film.titleKurdish || ""} />
            </div>
          )
        ) : (
          /* Single Film: Telegram Viewer Card */
          <div
            className="relative w-full rounded-3xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-10 text-center shadow-lg dark:shadow-xl transition-colors duration-200"
            dir="rtl"
          >
            {posterSrc && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                  src={posterSrc}
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
                  href={watchUrl || film.telegramPostUrl || "https://t.me/mediay_islamy"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-bold font-sirwan text-sm sm:text-base shadow-xl shadow-sky-500/25 transition-all duration-200 cursor-pointer"
                >
                  <TelegramIcon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span>بینین و داگرتن لە تێلیگرام</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default FilmInteractiveViewer;
