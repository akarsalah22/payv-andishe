"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type SupportedLanguage = "ku" | "ar" | "en";
export type Direction = "rtl" | "ltr";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  shortCode: string;
  dir: Direction;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "ku", name: "Kurdish", nativeName: "کوردی", shortCode: "KU", dir: "rtl" },
  { code: "ar", name: "Arabic", nativeName: "العربية", shortCode: "AR", dir: "rtl" },
  { code: "en", name: "English", nativeName: "English", shortCode: "EN", dir: "ltr" },
];

export const DICTIONARY: Record<SupportedLanguage, Record<string, string>> = {
  ku: {
    "nav.home": "سەرەکی",
    "nav.films": "فیلم و کارتۆن",
    "nav.articles": "نووسین و وتار",
    "nav.about": "دەربارە",
    "nav.admin": "بەڕێوەبردن",
    "nav.saved": "هەڵگیراوەکانم",
    "nav.surprise": "چی سەیر بکەم؟",
    "nav.surprise_search": "شتێکم بۆ هەڵبژێرە",
    "nav.surprise_loading": "هەڵدەبژێردرێت...",
    "nav.search": "گەڕان",
    "nav.search_placeholder": "گەڕان بەدوای فیلم، کارتۆن، ئایەت و کتێب...",
    "nav.search_input_placeholder": "گەڕان بۆ فیلم یان نووسین...",
    "nav.theme_toggle": "ڕووکاری تاریک / ڕووناک",
    "nav.open_menu": "کردنەوەی مێنیو",
    "nav.close_menu": "داخستنی مێنۆ",
    "nav.language": "زمان",
    "brand.title": "میدیای ئیسلامی",
    "footer.rights": "مافی سەرجەم بەرهەمەکان بۆ خاوەنەکانیان پارێزراوە 2026 میدیای ئیسلامی",
    "footer.top": "گەڕانەوە بۆ سەرەوە",
    "footer.desc": "ئەرشیڤێکی سەربەخۆی کوردییە بۆ ناساندنی فیلم و کارتۆنە ئیسلامێکان، وەدەقی ئیسلامی بە زمانی کوردی.",
    "footer.telegram": "تێلیگرام",
    "footer.instagram": "ئینستاگرام",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.films": "أفلام وكارتون",
    "nav.articles": "كتابات ومقالات",
    "nav.about": "حول الموقع",
    "nav.admin": "لوحة التحكم",
    "nav.saved": "المحفوظات",
    "nav.surprise": "ماذا أشاهد؟",
    "nav.surprise_search": "اختر لي شيئاً",
    "nav.surprise_loading": "جاري الاختيار...",
    "nav.search": "بحث",
    "nav.search_placeholder": "ابحث عن فيلم، كارتون، كتاب أو مقال...",
    "nav.search_input_placeholder": "ابحث عن فيلم أو مقال...",
    "nav.theme_toggle": "الوضع الداكن / الفاتح",
    "nav.open_menu": "فتح القائمة",
    "nav.close_menu": "إغلاق القائمة",
    "nav.language": "اللغة",
    "brand.title": "الإعلام الإسلامي",
    "footer.rights": "جميع الحقوق محفوظة © 2026 الإعلام الإسلامي",
    "footer.top": "الرجوع للأعلى",
    "footer.desc": "أرشيف مستقل لعرض وتوثيق الأفلام والرسوم المتحركة الإسلامية، والنصوص الهادفة.",
    "footer.telegram": "تيليجرام",
    "footer.instagram": "إنستغرام",
  },
  en: {
    "nav.home": "Home",
    "nav.films": "Movies & Animation",
    "nav.articles": "Articles & Books",
    "nav.about": "About",
    "nav.admin": "Admin",
    "nav.saved": "Watchlist",
    "nav.surprise": "Surprise Me",
    "nav.surprise_search": "Pick For Me",
    "nav.surprise_loading": "Picking...",
    "nav.search": "Search",
    "nav.search_placeholder": "Search for movies, animations, verses, or books...",
    "nav.search_input_placeholder": "Search for movies or writings...",
    "nav.theme_toggle": "Dark / Light Mode",
    "nav.open_menu": "Open Menu",
    "nav.close_menu": "Close Menu",
    "nav.language": "Language",
    "brand.title": "Islamic Media",
    "footer.rights": "All rights reserved © 2026 Islamic Media",
    "footer.top": "Back to top",
    "footer.desc": "An independent archive introducing educational Islamic films, cartoons, and literature.",
    "footer.telegram": "Telegram",
    "footer.instagram": "Instagram",
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  dir: Direction;
  isRtl: boolean;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ku",
  setLanguage: () => { },
  dir: "rtl",
  isRtl: true,
  t: (key: string, fallback?: string) => fallback || key,
});

const STORAGE_KEY = "preferred_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("ku");
  const [isMounted, setIsMounted] = useState(false);

  // Synchronize with stored preference on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (stored && (stored === "ku" || stored === "ar" || stored === "en")) {
        setLanguageState(stored);
        if (typeof document !== "undefined") {
          document.documentElement.lang = stored;
          document.documentElement.dir = stored === "en" ? "ltr" : "rtl";
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    }
  }, []);

  const dir: Direction = language === "en" ? "ltr" : "rtl";
  const isRtl = dir === "rtl";

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return (
        DICTIONARY[language]?.[key] ||
        DICTIONARY["ku"]?.[key] ||
        fallback ||
        key
      );
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

