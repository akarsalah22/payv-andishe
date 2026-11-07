"use client";

import React from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/LanguageContext";

export function AboutLanguageBanner() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      dir="rtl"
      className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-3.5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs select-none transition-colors"
    >
      {/* Label with Globe Icon */}
      <div className="flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Globe className="w-4 h-4" strokeWidth={1.8} />
        </div>
        <span className="text-xs sm:text-sm font-semibold font-sirwan">
          زمان / Language / اللغة
        </span>
      </div>

      {/* Language Options as interactive pills */}
      <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap w-full sm:w-auto">
        {SUPPORTED_LANGUAGES.map((item) => {
          const isSelected = item.code === language;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLanguage(item.code)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-sirwan transition-all duration-150 cursor-pointer active:scale-95 touch-manipulation tap-highlight-transparent ${
                isSelected
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-xs border border-amber-500 scale-[1.02]"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-700/60"
              }`}
            >
              <span>{item.nativeName}</span>
              {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AboutLanguageBanner;

