"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/context/LanguageContext";

export interface LanguageSwitcherProps {
  className?: string;
  showChevron?: boolean;
  direction?: "down" | "up";
  align?: "start" | "end";
}

export function LanguageSwitcher({
  className = "",
  showChevron = false,
  direction = "down",
  align,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();

  const currentOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Resolve alignment:
  // In drawers / footers (direction === "up"), default to "start" to expand inwards towards the drawer center
  // In headers (direction === "down"), default to "end" to expand inwards towards the navbar center
  const resolvedAlign = align || (direction === "up" ? "start" : "end");
  const alignClasses =
    resolvedAlign === "start"
      ? "start-0 ltr:left-0 rtl:right-0 ltr:right-auto rtl:left-auto"
      : "end-0 ltr:right-0 rtl:left-0 ltr:left-auto rtl:right-auto";

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
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer select-none active:scale-95 touch-manipulation tap-highlight-transparent shrink-0"
      >
        <Globe className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={1.8} />
        <span className="font-mono font-bold uppercase tracking-wider text-[11px]">
          {currentOption.shortCode}
        </span>
        {showChevron && (
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${
              isOpen
                ? direction === "up"
                  ? ""
                  : "rotate-180"
                : direction === "up"
                ? "rotate-180"
                : ""
            }`}
          />
        )}
      </button>

      {/* Floating Dropdown Menu Card */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className={`absolute ${
            direction === "up"
              ? "bottom-full mb-2 origin-bottom"
              : "top-full mt-2 origin-top"
          } ${alignClasses} min-w-[140px] w-max max-w-[180px] p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-[70] animate-in fade-in zoom-in-95 duration-150`}
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
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer select-none text-start ${
                  isSelected
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 shrink-0">
                    {item.shortCode}
                  </span>
                  <span className={`truncate ${item.code === "en" ? "font-sans" : "font-sirwan"}`}>
                    {item.nativeName}
                  </span>
                </div>

                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 ms-1.5" strokeWidth={2.5} />
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
