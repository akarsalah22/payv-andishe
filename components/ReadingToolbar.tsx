"use client";

import React from "react";
import { Clock } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

export type FontSize = "small" | "normal" | "large" | "xlarge";

export interface ReadingToolbarProps {
  fontSize: FontSize;
  onFontSizeChange: (newSize: FontSize) => void;
  readingTime?: string;
  wordCount?: number;
  title: string;
  url?: string;
  className?: string;
}

const ORDERED_SIZES: FontSize[] = ["small", "normal", "large", "xlarge"];

function toKurdishDigits(num: number | string): string {
  const kurdishDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num).replace(/[0-9]/g, (d) => kurdishDigits[parseInt(d, 10)]);
}

export function ReadingToolbar({
  fontSize,
  onFontSizeChange,
  readingTime,
  wordCount,
  title,
  url,
  className = "",
}: ReadingToolbarProps) {
  const currentIndex = ORDERED_SIZES.indexOf(fontSize);

  const canZoomOut = currentIndex > 0;
  const canZoomIn = currentIndex < ORDERED_SIZES.length - 1;

  const handleZoomOut = () => {
    if (canZoomOut) {
      onFontSizeChange(ORDERED_SIZES[currentIndex - 1]);
    }
  };

  const handleZoomIn = () => {
    if (canZoomIn) {
      onFontSizeChange(ORDERED_SIZES[currentIndex + 1]);
    }
  };

  // Format reading time text cleanly
  const displayReadingTime = (() => {
    if (readingTime) {
      const cleaned = readingTime.replace(/خوێندنەوە/g, "").trim();
      return `خوێندنەوە: ${cleaned}`;
    }
    if (wordCount && wordCount > 0) {
      const minutes = Math.max(1, Math.ceil(wordCount / 200));
      return `خوێندنەوە: ${toKurdishDigits(minutes)} خولەک`;
    }
    return "خوێندنەوە: ٥ خولەک";
  })();

  return (
    <div
      className={`sticky top-20 z-30 w-full max-w-2xl mx-auto my-4 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-2.5 shadow-lg flex items-center justify-between gap-2.5 select-none ${className}`}
      dir="rtl"
    >
      {/* 1. Estimated Reading Time Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs font-medium font-sirwan text-zinc-300">
        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" strokeWidth={1.75} />
        <span className="whitespace-nowrap">{displayReadingTime}</span>
      </div>

      {/* 2. Controls: Font Resizing (A- / A+) & Share Button */}
      <div className="flex items-center gap-2">
        {/* Font Size Adjusters */}
        <div className="inline-flex items-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 p-0.5">
          {/* Zoom Out Button (A-) */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={!canZoomOut}
            aria-label="بچووککردنەوەی فۆنت"
            title="بچووککردنەوەی فۆنت (A-)"
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all duration-150 active:scale-95 cursor-pointer ${
              canZoomOut
                ? "text-zinc-200 hover:text-white hover:bg-zinc-700"
                : "text-zinc-500 cursor-not-allowed opacity-50"
            }`}
          >
            A-
          </button>

          <span className="w-px h-3.5 bg-zinc-700/80 my-auto" />

          {/* Zoom In Button (A+) */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={!canZoomIn}
            aria-label="گەورەکردنی فۆنت"
            title="گەورەکردنی فۆنت (A+)"
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all duration-150 active:scale-95 cursor-pointer ${
              canZoomIn
                ? "text-zinc-200 hover:text-white hover:bg-zinc-700"
                : "text-zinc-500 cursor-not-allowed opacity-50"
            }`}
          >
            A+
          </button>
        </div>

        {/* 3. Share Button */}
        <ShareButton
          title={title}
          text={title}
          url={url}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-sirwan bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 transition-all duration-150 active:scale-95 cursor-pointer touch-manipulation"
        />
      </div>
    </div>
  );
}

export default ReadingToolbar;

