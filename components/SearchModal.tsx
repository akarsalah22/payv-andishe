"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  X,
  Film,
  FileText,
  Send,
  Clock,
  ChevronLeft,
  SearchX,
} from 'lucide-react';
import { SAMPLE_FILMS } from '@/data/films';
import { SAMPLE_ARTICLES } from '@/data/articles';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = [
  'ڕۆشتووی ڕۆحەکان',
  'ئەنیمەیشن',
  'نێوان ئەستێرەکان',
  'تارکۆڤسکی',
  'کافکا',
  'تەنیایی',
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [allFilms, setAllFilms] = useState(SAMPLE_FILMS);
  const [allArticles, setAllArticles] = useState(SAMPLE_ARTICLES);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync latest films and articles from persistent storage when opened
  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/films')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAllFilms(data);
      })
      .catch(() => {});

    fetch('/api/articles')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAllArticles(data);
      })
      .catch(() => {});
  }, [isOpen]);

  // Auto-focus input when modal opens & reset on close
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [isOpen]);

  // Subtle 150ms debounce to avoid violent re-rendering on keystrokes
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Real-time filtering engine using debounced query
  const cleanQuery = debouncedQuery.trim().toLowerCase();

  const matchingFilms = useMemo(() => {
    if (!cleanQuery) return [];
    return allFilms.filter((film) => {
      const kurdishTitle = film.titleKurdish.toLowerCase();
      const originalTitle = film.originalTitle.toLowerCase();
      const genres = film.genres.join(' ').toLowerCase();
      const description = film.description.toLowerCase();
      const year = film.year.toString();
      return (
        kurdishTitle.includes(cleanQuery) ||
        originalTitle.includes(cleanQuery) ||
        genres.includes(cleanQuery) ||
        description.includes(cleanQuery) ||
        year.includes(cleanQuery)
      );
    });
  }, [cleanQuery, allFilms]);

  const matchingArticles = useMemo(() => {
    if (!cleanQuery) return [];
    return allArticles.filter((article) => {
      const title = article.title.toLowerCase();
      const category = article.category.toLowerCase();
      const excerpt = article.excerpt.toLowerCase();
      return (
        title.includes(cleanQuery) ||
        category.includes(cleanQuery) ||
        excerpt.includes(cleanQuery)
      );
    });
  }, [cleanQuery, allArticles]);

  const totalResults = matchingFilms.length + matchingArticles.length;
  const hasSearched = cleanQuery.length > 0;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 transition-all duration-200 ease-out"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="گەڕانی گشتی لە ماڵپەڕ"
    >
      {/* Dark Ambient Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-200 ease-out cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Dialog Window */}
      <div className="relative w-full max-w-2xl bg-[#faf8f5] dark:bg-[#16171b] text-zinc-900 dark:text-zinc-100 rounded-2xl border border-[#ede8e1] dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col z-10 transition-all duration-200 ease-out text-right select-none">
        {/* 1. Unified Search Header Bar (Clean single row) */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-[#ede8e1] dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm shrink-0">
          {/* Right: Search Icon */}
          <Search className="w-5 h-5 text-[#d49757] shrink-0" strokeWidth={1.75} />

          {/* Middle: Input Field taking full available width */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="گەڕان بەدوای فیلم، ئەنیمەیشن، وتار و کتێب..."
            className="flex-1 min-w-0 bg-transparent text-sm sm:text-base font-sirwan text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none tracking-normal py-0.5"
          />

          {/* Left: Actions (Clear Query & Circular Icon-only Close Button) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setDebouncedQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-stone-200/60 dark:hover:bg-zinc-800/50 transition-all duration-150 ease-out active:scale-90 cursor-pointer touch-manipulation select-none"
                aria-label="سڕینەوەی دەق"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            )}

            {/* Circular Icon-only Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-stone-200/70 dark:hover:bg-zinc-800/50 active:scale-90 transition-all cursor-pointer touch-manipulation select-none tap-highlight-transparent"
              aria-label="داخستن"
              title="داخستن"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* 2. Results Container with Stable Height & Smooth Scrolling */}
        <div className="max-h-[60vh] min-h-[160px] overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-6 transition-all duration-200 ease-out">
          {/* Initial State: Subtle Kurdish Hint & Quick Suggestions */}
          {!hasSearched && (
            <div className="py-8 sm:py-10 px-4 text-center space-y-4 transition-opacity duration-200 ease-out">
              <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-500 dark:text-zinc-400 tracking-normal">
                فیلمێک، ساڵێک، یان بابەتێک بنووسە بۆ گەڕان...
              </p>

              {/* Quick suggestions pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      setDebouncedQuery(suggestion);
                    }}
                    className="px-3 py-1 rounded-full text-xs font-medium font-sirwan bg-stone-100 dark:bg-zinc-850/80 hover:bg-[#d49757]/15 hover:text-[#d49757] border border-stone-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation tracking-normal select-none tap-highlight-transparent"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Searched & Results Found with Smooth Opacity Transition */}
          {hasSearched && totalResults > 0 && (
            <div
              className={`space-y-6 transition-opacity duration-200 ease-out ${
                isSearching ? 'opacity-70' : 'opacity-100'
              }`}
            >
              {/* Group 1: فیلم و کارتۆن */}
              {matchingFilms.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold font-peshang text-[#d49757] tracking-normal pb-1 border-b border-[#ede8e1]/70 dark:border-zinc-800/60">
                    <Film className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>فیلم و کارتۆن ({matchingFilms.length})</span>
                  </div>

                  <div className="space-y-1.5">
                    {matchingFilms.map((film) => (
                      <a
                        key={film.id}
                        href={film.telegramPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 p-2 sm:p-2.5 rounded-xl bg-white/60 dark:bg-zinc-900/40 hover:bg-stone-100/70 dark:hover:bg-zinc-800/40 border border-[#ede8e1]/80 dark:border-zinc-800/80 hover:border-[#d49757]/40 dark:hover:border-[#d49757]/30 transition-all duration-150 ease-out active:scale-[0.99] cursor-pointer touch-manipulation select-none tap-highlight-transparent min-h-[68px]"
                      >
                        {/* Right: Poster & Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Poster Thumbnail */}
                          <div className="relative w-11 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-200 dark:bg-zinc-800 shadow-2xs">
                            <Image
                              src={film.posterUrl}
                              alt={film.titleKurdish}
                              fill
                              unoptimized={film.posterUrl.startsWith('data:')}
                              sizes="44px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          {/* Center: Title & Meta */}
                          <div className="min-w-0 text-right space-y-0.5">
                            <h4 className="text-sm font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 group-hover:text-[#d49757] transition-colors truncate">
                              {film.titleKurdish}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] font-sirwan text-zinc-500 dark:text-zinc-400">
                              <span className="font-sans font-medium">{film.year}</span>
                              <span>•</span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium font-sirwan bg-[#d49757]/15 text-[#d49757] border border-[#d49757]/25">
                                {film.genres[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Left: Telegram Action Badge */}
                        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#d49757]/10 group-hover:bg-[#d49757] text-[#d49757] group-hover:text-zinc-950 border border-[#d49757]/25 text-xs font-semibold font-sirwan transition-all duration-150">
                          <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
                          <span className="hidden sm:inline">تێلیگرام</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 2: نووسین و وتار */}
              {matchingArticles.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold font-peshang text-[#d49757] tracking-normal pb-1 border-b border-[#ede8e1]/70 dark:border-zinc-800/60">
                    <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>نووسین و وتار ({matchingArticles.length})</span>
                  </div>

                  <div className="space-y-1.5">
                    {matchingArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        onClick={onClose}
                        className="group flex items-center justify-between gap-3 p-2 sm:p-2.5 rounded-xl bg-white/60 dark:bg-zinc-900/40 hover:bg-stone-100/70 dark:hover:bg-zinc-800/40 border border-[#ede8e1]/80 dark:border-zinc-800/80 hover:border-[#d49757]/40 dark:hover:border-[#d49757]/30 transition-all duration-150 ease-out active:scale-[0.99] select-none tap-highlight-transparent min-h-[68px]"
                      >
                        {/* Right: Cover & Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Cover Thumbnail */}
                          <div className="relative w-11 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-200 dark:bg-zinc-800 shadow-2xs">
                            <Image
                              src={article.coverImage || article.imageUrl}
                              alt={article.title}
                              fill
                              unoptimized={(article.coverImage || article.imageUrl)?.startsWith('data:')}
                              sizes="44px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          {/* Center: Title & Meta */}
                          <div className="min-w-0 text-right space-y-0.5">
                            <h4 className="text-sm font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 group-hover:text-[#d49757] transition-colors truncate">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] font-sirwan text-zinc-500 dark:text-zinc-400">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium font-sirwan bg-[#d49757]/15 text-[#d49757] border border-[#d49757]/25">
                                {article.category}
                              </span>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#d49757]" strokeWidth={1.75} />
                                {article.readTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Left: Read Action */}
                        <div className="shrink-0 flex items-center gap-1 text-xs font-medium font-sirwan text-zinc-400 group-hover:text-[#d49757] transition-colors">
                          <span className="hidden sm:inline">خوێندنەوە</span>
                          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.75} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty Search State */}
          {hasSearched && totalResults === 0 && (
            <div className="py-10 px-4 text-center space-y-3 transition-opacity duration-200 ease-out">
              <div className="w-11 h-11 rounded-2xl bg-stone-100 dark:bg-zinc-850 border border-stone-200 dark:border-zinc-800 flex items-center justify-center mx-auto text-[#d49757]">
                <SearchX className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold font-peshang text-zinc-900 dark:text-zinc-100 tracking-normal">
                  هیچ ئەنجامێک بۆ ئەم گەڕانە نەدۆزرایەوە
                </h4>
                <p className="text-xs sm:text-sm font-sirwan text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto tracking-normal">
                  هیچ فیلمێک یان بابەتێک بە وشەی «{debouncedQuery}» لە ئەرشیڤدا بەردەست نییە.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Modal Bottom Bar */}
        <div className="px-4 py-2.5 border-t border-[#ede8e1]/80 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-950/40 flex items-center justify-between text-[11px] font-sirwan text-zinc-400 dark:text-zinc-500">
          <span>کرتە بکە بۆ کردنەوە یان داگرتنی بابەتەکە</span>
          <span className="font-sans">پەیڤ و ئەندێشە</span>
        </div>
      </div>
    </div>
  );
}
