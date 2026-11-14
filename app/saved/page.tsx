"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bookmark,
  Trash2,
  Clapperboard,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  X,
  Sparkles,
} from 'lucide-react';
import { useFavorites, type SavedItem } from '@/hooks/useFavorites';

type FilterType = 'all' | 'movies' | 'writings';

export default function SavedPage() {
  const { favorites, removeFavorite, clearFavorites, isLoaded } = useFavorites();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const moviesCount = useMemo(
    () => favorites.filter((item) => item.type === 'movie').length,
    [favorites]
  );
  const writingsCount = useMemo(
    () => favorites.filter((item) => item.type === 'writing').length,
    [favorites]
  );

  const filteredItems = useMemo(() => {
    if (activeFilter === 'movies') {
      return favorites.filter((item) => item.type === 'movie');
    }
    if (activeFilter === 'writings') {
      return favorites.filter((item) => item.type === 'writing');
    }
    return favorites;
  }, [favorites, activeFilter]);

  const handleClearAll = () => {
    if (confirmClear) {
      clearFavorites();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  return (
    <div dir="rtl" className="w-full py-8 sm:py-12 flex-1 flex flex-col space-y-8 text-right">
      {/* Top Breadcrumb */}
      <div className="w-full flex items-center justify-between pb-4 sm:pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400 tracking-normal">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-amber-500 transition-colors">
            سەرەکی
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200">هەڵگیراوەکانم</span>
        </div>

        <span className="text-zinc-400 dark:text-zinc-500">میدیای ئیسلامی</span>
      </div>

      {/* Header Section */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-3 py-2 select-none">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 shadow-xs mb-1">
          <Bookmark className="w-6 h-6 fill-amber-500/30 text-amber-500" strokeWidth={1.75} />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
          هەڵگیراوەکانم
        </h1>

        <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          ئەو فیلم، کارتۆن و بابەتانەی لەسەر ئامێرەکەت پاشەکەوتت کردوون تاوەکو بە ئاسانی بیانبینیتەوە.
        </p>
      </div>

      {/* Main Content Area */}
      {!isLoaded ? (
        // Hydration Loading Skeleton
        <div className="w-full py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-sirwan text-zinc-400">چاوەڕوانبە...</p>
        </div>
      ) : favorites.length === 0 ? (
        /* Empty State */
        <div className="w-full max-w-xl mx-auto py-14 sm:py-20 px-6 text-center space-y-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-md">
            <Bookmark className="w-8 h-8 text-amber-500" strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
              هێشتا هیچ بەرهەمێکت پاشەکەوت نەکردووە
            </h3>
            <p className="text-xs sm:text-sm font-sirwan text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              دەتوانیت لە کاتی گەڕاندا لەسەر نیشانەی نیشانەکردن (Bookmark)ی هەر فیلمێک یان نووسینێک دابگریت تاوەکو لێرە پارێزراو بێت.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/films"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-semibold font-sirwan text-xs sm:text-sm shadow-md hover:bg-amber-400 transition-all duration-200 active:scale-95"
            >
              <Clapperboard className="w-4 h-4" />
              <span>گەڕان بەناو بەرهەمەکاندا</span>
            </Link>

            <Link
              href="/articles"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium font-sirwan text-xs sm:text-sm transition-all duration-200 active:scale-95 border border-zinc-200 dark:border-zinc-700"
            >
              <BookOpen className="w-4 h-4" />
              <span>خوێندنەوەی نووسینەکان  </span>
            </Link>
          </div>
        </div>
      ) : (
        /* Has Saved Items */
        <div className="w-full space-y-6">
          {/* Controls Bar: Filter Tabs & Clear All Button */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/70 dark:border-zinc-800/70 select-none">
            {/* Filter Tabs */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              {/* All */}
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sirwan font-medium transition-all duration-200 cursor-pointer ${activeFilter === 'all'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
              >
                <span>هەمووی</span>
                <span className="mr-1.5 text-[11px] opacity-80 font-sans">({favorites.length})</span>
              </button>

              {/* Movies */}
              <button
                type="button"
                onClick={() => setActiveFilter('movies')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sirwan font-medium transition-all duration-200 cursor-pointer ${activeFilter === 'movies'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
              >
                <span>فیلمەکان </span>
                <span className="mr-1.5 text-[11px] opacity-80 font-sans">({moviesCount})</span>
              </button>

              {/* Writings */}
              <button
                type="button"
                onClick={() => setActiveFilter('writings')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sirwan font-medium transition-all duration-200 cursor-pointer ${activeFilter === 'writings'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
              >
                <span>نووسینەکان </span>
                <span className="mr-1.5 text-[11px] opacity-80 font-sans">({writingsCount})</span>
              </button>
            </div>

            {/* Clear All Action */}
            <button
              type="button"
              onClick={handleClearAll}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sirwan transition-all duration-200 cursor-pointer select-none active:scale-95 ${confirmClear
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                : 'text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-500/10'
                }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{confirmClear ? 'دڵنیایت لە پاککردنەوە؟' : 'سڕینەوەی هەمووی'}</span>
            </button>
          </div>

          {/* Cards Grid */}
          {filteredItems.length === 0 ? (
            <div className="w-full py-12 text-center text-xs sm:text-sm font-sirwan text-zinc-400">
              هیچ بەرهەمێک لەم بەشەدا پاشەکەوت نەکراوە.
            </div>
          ) : (
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
              {filteredItems.map((item) => {
                const targetUrl =
                  item.type === 'movie'
                    ? `/films/${encodeURIComponent(item.slug || item.id)}`
                    : `/articles/${encodeURIComponent(item.slug || item.id)}`;

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10"
                  >
                    {/* Image Link Container */}
                    <Link
                      href={targetUrl}
                      className="relative block w-full aspect-[2/3] overflow-hidden bg-zinc-100 dark:bg-zinc-950"
                    >
                      <div className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-500 group-hover:scale-105 pointer-events-none">
                        {item.type === 'movie' && item.imageFit === 'contain' ? (
                          <>
                            {/* Ambient Blurred Background */}
                            <Image
                              src={item.imageUrl || '/placeholder.jpg'}
                              alt=""
                              fill
                              aria-hidden="true"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                              className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-45 pointer-events-none"
                            />
                            {/* Foreground Contained Poster */}
                            <div className="relative z-10 w-full h-full overflow-hidden">
                              <Image
                                src={item.imageUrl || '/placeholder.jpg'}
                                alt={item.title}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                className="w-full h-full object-contain transition-transform duration-300"
                                style={{
                                  objectPosition: `${item.imagePosX ?? 50}% ${item.imagePosY ?? 50}%`,
                                  transform: `scale(${(item.imageZoom ?? 100) / 100})`,
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="relative z-10 w-full h-full overflow-hidden">
                            <Image
                              src={item.imageUrl || '/placeholder.jpg'}
                              alt={item.title}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                              className="w-full h-full object-cover transition-transform duration-300"
                              style={{
                                objectPosition: `${item.imagePosX ?? 50}% ${item.imagePosY ?? 50}%`,
                                transform: `scale(${(item.imageZoom ?? 100) / 100})`,
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-20 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2 inset-x-2 flex items-center justify-between z-30 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-sirwan font-medium bg-black/60 backdrop-blur-md text-amber-400 border border-white/10">
                          {item.type === 'movie' ? (item.category || 'فیلم') : 'نووسین'}
                        </span>
                      </div>
                    </Link>

                    {/* Quick Removal Button (Top Left Overlay) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFavorite(item.id);
                      }}
                      title="سڕینەوە لە هەڵگیراوەکان"
                      aria-label="سڕینەوە لە هەڵگیراوەکان"
                      className="absolute top-2 left-2 z-20 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all duration-200 cursor-pointer active:scale-75 shadow-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Title & Info at Bottom */}
                    <div className="p-3 flex-1 flex flex-col justify-between gap-2 text-right">
                      <Link href={targetUrl} className="block">
                        <h4 className="text-xs sm:text-sm font-bold font-peshang text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                      </Link>

                      <div className="flex items-center justify-between text-[11px] font-sirwan text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                        <span>{item.type === 'movie' ? 'بینینی فیلم' : 'خوێندنەوە'}</span>
                        <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-amber-500" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

