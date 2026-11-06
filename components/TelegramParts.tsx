import React from "react";
import { ArrowLeft } from "lucide-react";
import { TelegramIcon } from "@/components/TelegramIcon";

export interface TelegramPartItem {
  partNumber: number;
  url: string;
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
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400 flex items-center justify-center">
            <TelegramIcon className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100">
            بەشەکانی بەرهەم ({parts.length} بەش)
          </h3>
        </div>
        <span className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
          تەماشاکردن لە کەناڵی تێلیگرام
        </span>
      </div>

      {/* Responsive Grid: 1 column on mobile, 2 columns on tablet, 3 columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {parts.map((item) => (
          <a
            key={item.partNumber}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-sky-500/50 dark:hover:border-sky-500/50 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer touch-manipulation tap-highlight-transparent"
          >
            {/* Start Side: Telegram icon + Label + Quality badge */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                <TelegramIcon className="w-5 h-5 shrink-0" />
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm sm:text-base font-bold font-sirwan text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  بەشی {item.partNumber}
                </span>

                {item.quality && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-mono font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
                    {item.quality}
                  </span>
                )}
              </div>
            </div>

            {/* Other End: Action badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all duration-200 text-xs font-semibold font-sirwan shrink-0">
              <span>کردنەوە</span>
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default TelegramParts;

