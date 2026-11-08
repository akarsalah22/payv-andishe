"use client";

import React from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { TelegramIcon } from "@/components/TelegramIcon";
import { YouTubeIcon } from "@/components/YouTubeIcon";

export interface TelegramPartItem {
  partNumber: number;
  title?: string;
  youtubeUrl?: string;
  telegramUrl?: string;
  duration?: string;
  url?: string;
  quality?: string;
}

export interface TelegramPartsProps {
  parts?: TelegramPartItem[];
  className?: string;
}

export function TelegramParts({ parts, className = "" }: TelegramPartsProps) {
  if (!parts || !Array.isArray(parts) || parts.length === 0) {
    return null;
  }

  return (
    <section className={`w-full space-y-3.5 text-right ${className}`} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs font-sans">
            {parts.length}
          </div>
          <h3 className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100">
            بەشەکانی بەرهەم ({parts.length} بەش)
          </h3>
        </div>
        <span className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
          تەماشاکردن و داگرتن
        </span>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {parts.map((item) => {
          const teleUrl = item.telegramUrl || (item.url && item.url.includes("t.me") ? item.url : "");
          const ytUrl = item.youtubeUrl || (item.url && (item.url.includes("youtu") || /^[a-zA-Z0-9_-]{11}$/.test(item.url)) ? item.url : "");
          const singleUrl = teleUrl || ytUrl || item.url || "#";
          const hasBoth = Boolean(teleUrl && ytUrl);
          const isYtOnly = Boolean(ytUrl && !teleUrl);
          const displayTitle = item.title || `بەشی ${item.partNumber}`;

          if (hasBoth) {
            return (
              <div
                key={item.partNumber}
                className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:border-amber-500/40 transition-all duration-200 gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 font-sans">
                      {item.partNumber}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold font-sirwan text-zinc-900 dark:text-zinc-100 truncate">
                        {displayTitle}
                      </h4>
                      {item.duration && (
                        <p className="text-[11px] font-sirwan text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{item.duration}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {item.quality && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
                      {item.quality}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={teleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white transition-all text-xs font-semibold font-sirwan cursor-pointer"
                  >
                    <TelegramIcon className="w-3.5 h-3.5" />
                    <span>تێلیگرام</span>
                  </a>

                  <a
                    href={ytUrl.startsWith("http") ? ytUrl : `https://www.youtube.com/watch?v=${ytUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all text-xs font-semibold font-sirwan cursor-pointer"
                  >
                    <YouTubeIcon className="w-3.5 h-3.5" />
                    <span>یووتووب</span>
                  </a>
                </div>
              </div>
            );
          }

          const primaryUrl = isYtOnly && !singleUrl.startsWith("http")
            ? `https://www.youtube.com/watch?v=${singleUrl}`
            : singleUrl;

          return (
            <a
              key={item.partNumber}
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer touch-manipulation tap-highlight-transparent ${
                isYtOnly
                  ? "hover:border-red-500/50 dark:hover:border-red-500/50"
                  : "hover:border-sky-500/50 dark:hover:border-sky-500/50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    isYtOnly
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-sky-500/10 text-sky-500 dark:text-sky-400"
                  }`}
                >
                  {isYtOnly ? <YouTubeIcon className="w-5 h-5 shrink-0" /> : <TelegramIcon className="w-5 h-5 shrink-0" />}
                </div>

                <div className="min-w-0 text-right">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm sm:text-base font-bold font-sirwan text-zinc-900 dark:text-zinc-100 transition-colors ${
                        isYtOnly ? "group-hover:text-red-600 dark:group-hover:text-red-400" : "group-hover:text-sky-600 dark:group-hover:text-sky-400"
                      }`}
                    >
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
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>{item.duration}</span>
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 text-xs font-semibold font-sirwan shrink-0 ${
                  isYtOnly
                    ? "bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white"
                    : "bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white"
                }`}
              >
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
