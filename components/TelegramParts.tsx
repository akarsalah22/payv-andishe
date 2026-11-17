"use client";

import React from "react";
import { ArrowLeft, Clock, Play, Volume2 } from "lucide-react";
import { TelegramIcon } from "@/components/TelegramIcon";
import { YouTubeIcon } from "@/components/YouTubeIcon";
import { toKurdishNumber } from "@/data/films";

export interface TelegramPartItem {
  partNumber: number;
  title?: string;
  youtubeUrl?: string;
  telegramUrl?: string;
  okruUrl?: string;
  duration?: string;
  url?: string;
  quality?: string;
}

export interface TelegramPartsProps {
  parts?: TelegramPartItem[];
  episodeUnit?: 'ئەڵقە' | 'بەش';
  activeEpisodeIndex?: number | null;
  onSelectEpisode?: (index: number) => void;
  className?: string;
}

export function TelegramParts({
  parts,
  episodeUnit = 'ئەڵقە',
  activeEpisodeIndex = null,
  onSelectEpisode,
  className = "",
}: TelegramPartsProps) {
  if (!parts || !Array.isArray(parts) || parts.length === 0) {
    return null;
  }

  const unitLabel = episodeUnit === 'بەش' ? 'بەش' : 'ئەڵقە';
  const headerLabel = episodeUnit === 'بەش' ? 'بەشەکانی بەرهەم' : 'ئەڵقەکانی بەرهەم';

  return (
    <section className={`w-full space-y-3.5 text-right ${className}`} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs font-sirwan shrink-0">
            {toKurdishNumber(parts.length)}
          </div>
          <h3 className="text-sm sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 truncate">
            <span>{headerLabel}</span>
            <span className="hidden sm:inline"> ({toKurdishNumber(parts.length)} {unitLabel})</span>
          </h3>
        </div>
        <span className="text-[11px] sm:text-xs font-sirwan text-zinc-500 dark:text-zinc-400 whitespace-nowrap shrink-0">
          <span className="sm:hidden">پەخشی ناوخۆیی</span>
          <span className="hidden sm:inline">تەماشاکردن ڕاستەوخۆ لە ماڵپەڕ</span>
        </span>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {parts.map((item, index) => {
          const teleUrl =
            item.telegramUrl || (item.url && item.url.includes("t.me") ? item.url : "");
          const ytUrl =
            item.youtubeUrl ||
            (item.url && (item.url.includes("youtu") || /^[a-zA-Z0-9_-]{11}$/.test(item.url))
              ? item.url
              : "");
          const displayTitle = item.title || (episodeUnit === 'بەش' ? `بەشی ${toKurdishNumber(item.partNumber || index + 1)}` : `ئەڵقەی ${toKurdishNumber(item.partNumber || index + 1)}`);
          const isActive = activeEpisodeIndex === index;

          // If onSelectEpisode is provided, use interactive in-site button
          if (onSelectEpisode) {
            return (
              <div
                key={item.partNumber || index}
                onClick={() => onSelectEpisode(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectEpisode(index);
                  }
                }}
                className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-right ${
                  isActive
                    ? "border-amber-500 bg-amber-500/10 dark:bg-amber-500/10 shadow-md ring-1 ring-amber-500/30"
                    : "bg-white dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:border-amber-500/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Part Number Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm font-sirwan transition-colors duration-200 ${
                      isActive
                        ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950"
                    }`}
                  >
                    {isActive ? (
                      <Volume2 className="w-4 h-4 animate-pulse" />
                    ) : (
                      toKurdishNumber(item.partNumber || index + 1)
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm sm:text-base font-bold font-sirwan truncate transition-colors ${
                          isActive
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400"
                        }`}
                      >
                        {displayTitle}
                      </h4>

                      {item.quality && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
                          {item.quality}
                        </span>
                      )}
                    </div>

                    {item.duration && (
                      <p className="text-[11px] font-sirwan text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{item.duration}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Optional External Telegram link if available */}
                  {teleUrl && (
                    <a
                      href={teleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="کردنەوە لە کەناڵی تێلیگرام"
                      className="p-2 rounded-xl text-sky-500 hover:bg-sky-500/15 transition-colors hidden sm:inline-flex"
                    >
                      <TelegramIcon className="w-4 h-4" />
                    </a>
                  )}

                  {/* Play Action Button / Playing Indicator */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 text-xs font-bold font-sirwan shrink-0 ${
                      isActive
                        ? "bg-amber-500 text-zinc-950 shadow-xs"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-zinc-950 animate-ping inline-block shrink-0" />
                        <span>ئێستا پەخش دەکرێت</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current shrink-0" />
                        <span>کردنەوە</span>
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 shrink-0" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Fallback if onSelectEpisode is not provided:
          const singleUrl = teleUrl || ytUrl || item.url || "#";
          const isYtOnly = Boolean(ytUrl && !teleUrl);
          const primaryUrl =
            isYtOnly && !singleUrl.startsWith("http")
              ? `https://www.youtube.com/watch?v=${singleUrl}`
              : singleUrl;

          return (
            <a
              key={item.partNumber || index}
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer touch-manipulation tap-highlight-transparent hover:border-amber-500/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm font-sirwan">
                  {toKurdishNumber(item.partNumber || index + 1)}
                </div>

                <div className="min-w-0 text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold font-sirwan text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {displayTitle}
                    </span>
                    {item.quality && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
                        {item.quality}
                      </span>
                    )}
                  </div>

                  {item.duration && (
                    <p className="text-[11px] font-sirwan text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{item.duration}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all duration-200 text-xs font-semibold font-sirwan shrink-0">
                <span>کردنەوە</span>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default TelegramParts;
