import React from "react";
import { FileText, Download } from "lucide-react";

export interface PdfDownloadCardProps {
  pdfUrl?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PdfDownloadCard({
  pdfUrl,
  title = "داگرتنی پەڕتووک / فایلی PDF",
  subtitle = "دەتوانیت تەواوی بابەتەکە بە شێوەی پەڕگە (PDF) بۆ خوێندنەوەی ئۆفلاین دابگریت",
  className = "",
}: PdfDownloadCardProps) {
  if (!pdfUrl) {
    return null;
  }

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden text-right transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700 ${className}`}
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        {/* Right side (start in RTL): Document Icon & Description */}
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200/60 dark:border-red-500/20 flex items-center justify-center shrink-0 shadow-inner">
            <FileText className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.8} />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400 border border-red-200 dark:border-red-500/25 shrink-0">
                PDF
              </span>
              <h3 className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 truncate">
                {title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-sirwan text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Left side (end in RTL): Download Action Button */}
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 text-white font-bold font-sirwan text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all duration-200 cursor-pointer touch-manipulation tap-highlight-transparent shrink-0"
        >
          <Download className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />
          <span>داگرتن (Download)</span>
        </a>
      </div>
    </div>
  );
}

export default PdfDownloadCard;

