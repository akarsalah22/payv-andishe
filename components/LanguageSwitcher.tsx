"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/context/LanguageContext";

export interface LanguageSwitcherProps {
  className?: string;
  showChevron?: boolean;
}

export function LanguageSwitcher({ className = "", showChevron = false }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, isRtl } = useLanguage();

  const currentOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-start ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="گۆڕینی زمان / Change language / تغيير اللغة"
        title="گۆڕینی زمان / Language / اللغة"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer select-none active:scale-95 touch-manipulation tap-highlight-transparent"
      >
        <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" strokeWidth={1.8} />
        <span className="font-mono font-bold uppercase tracking-wider text-[11px]">
          {currentOption.shortCode}
        </span>
        {showChevron && (
          <ChevronDown
            className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* Floating Dropdown Menu Card */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute top-full mt-2 w-36 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150 ltr:right-0 rtl:left-0 origin-top"
        >
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(item.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none ${
                  isSelected
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">
                    {item.shortCode}
                  </span>
                  <span className={item.code === "en" ? "font-sans" : "font-sirwan"}>
                    {item.nativeName}
                  </span>
                </div>

                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;

