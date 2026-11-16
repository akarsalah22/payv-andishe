"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Trash2,
  Clapperboard,
  BookOpen,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useFavorites, type SavedItem } from '@/hooks/useFavorites';
import { normalizeCategory, type Film } from '@/data/films';
import type { Article } from '@/data/articles';

type FilterType = 'all' | 'movies' | 'writings';

function MovieCard({
  item,
  liveFilm,
  onRemove,
}: {
  item: SavedItem;
  liveFilm?: Film;
  onRemove: (id: string) => void;
}) {
  const targetUrl = `/films/${encodeURIComponent(liveFilm?.slug || item.slug || liveFilm?.id || item.id)}`;
  const initialPoster =
    liveFilm?.posterUrl ||
    item.imageUrl ||
    item.image ||
    item.coverImage ||
    '/placeholder.jpg';
  const [posterSrc, setPosterSrc] = useState(initialPoster);

  // Sync framing strictly with live database, ignoring stale localStorage settings.
  // Defaults strictly to 'cover' so posters fill the entire 2:3 frame edge-to-edge with zero black bars.
  const fit = liveFilm?.imageFit === 'contain' ? 'contain' : 'cover';
  const zoom = liveFilm?.imageZoom ?? 100;
  const posX = liveFilm?.imagePosX ?? 50;
  const posY = liveFilm?.imagePosY ?? 50;
  const title = liveFilm?.titleKurdish || item.title;
  const category =
    liveFilm?.category ||
    item.category ||
    (item.type === 'cartoon' ? 'کارتۆن' : 'فیلم');

  return (
    <Link
      href={targetUrl}
      className="group relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 block shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 focus:outline-none select-none tap-highlight-transparent"
    >
      {/* Poster Image with Dashboard Framing */}
      {fit === 'contain' && (
        <img
          src={posterSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-45 pointer-events-none"
        />
      )}
      <img
        src={posterSrc}
        alt={title}
        onError={() => setPosterSrc('/placeholder.jpg')}
        className={`w-full h-full transition-transform duration-300 ${
          fit === 'contain' ? 'relative z-10 object-contain' : 'object-cover'
        }`}
        style={{
          objectPosition: `${posX}% ${posY}%`,
          transform: `scale(${zoom / 100})`,
        }}
      />

      {/* Bottom Dark Gradient Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

      {/* Top-Left Remove / Unsave Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(item.id);
        }}
        aria-label="لابردن لە هەڵگیراوەکان"
        title="لابردن لە هەڵگیراوەکان"
        className="absolute top-3 left-3 z-30 w-8 h-8 rounded-full bg-amber-500/20 hover:bg-red-500/90 text-amber-400 hover:text-white backdrop-blur-md border border-amber-500/30 flex items-center justify-center transition-colors cursor-pointer active:scale-90"
      >
        <Bookmark className="w-4 h-4 fill-current" />
      </button>

      {/* Top-Right Category Badge */}
      <span className="absolute top-3 right-3 z-30 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-zinc-100 text-[11px] font-bold font-sirwan">
        {normalizeCategory(category)}
      </span>

      {/* Bottom-Right Title Inside Poster */}
      <div className="absolute bottom-3 inset-x-3 z-30 text-right">
        <h3 className="text-sm sm:text-base font-bold font-peshang text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}

function WritingCard({
  item,
  liveArticle,
  onRemove,
}: {
  item: SavedItem;
  liveArticle?: Article;
  onRemove: (id: string) => void;
}) {
  const targetUrl = `/articles/${encodeURIComponent(liveArticle?.slug || item.slug || liveArticle?.id || item.id)}`;
  const imageSource =
    liveArticle?.coverImage ||
    item.coverImage ||
    item.image ||
    item.imageUrl ||
    '/placeholder-article.jpg';

  const fit = item.imageFit ?? 'cover';
  const zoom = item.imageZoom ?? 100;
  const posX = item.imagePosX ?? 50;
  const posY = item.imagePosY ?? 50;
  const title = liveArticle?.title || item.title;
  const category = liveArticle?.category || item.category || 'نووسین';

  return (
    <div
      key={item.id}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10"
    >
      {/* Writings Cover: 16:9 Landscape Video Aspect Ratio */}
      <Link href={targetUrl} className="relative block w-full overflow-hidden">
        <div className="relative w-full aspect-video overflow-hidden bg-zinc-900">
          <img
            src={imageSource}
            alt={title}
            className={`w-full h-full ${
              fit === 'contain' ? 'object-contain relative z-10' : 'object-cover'
            }`}
            style={{
              objectPosition: `${posX}% ${posY}%`,
              transform: `scale(${zoom / 100})`,
            }}
          />
          {fit === 'contain' && (
            <img
              src={imageSource}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-45 pointer-events-none"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-20 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-2 inset-x-2 flex items-center justify-between z-30 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-sirwan font-medium bg-black/60 backdrop-blur-md text-amber-400 border border-white/10">
              {category}
            </span>
          </div>
        </div>
      </Link>

      {/* Quick Removal Button (Top Left Overlay) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(item.id);
        }}
        title="سڕینەوە لە هەڵگیراوەکان"
        aria-label="سڕینەوە لە هەڵگیراوەکان"
        className="absolute top-2 left-2 z-30 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all duration-200 cursor-pointer active:scale-75 shadow-xs"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Title & Info at Bottom */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5 text-right">
        <Link href={targetUrl} className="block">
          <h4 className="text-xs sm:text-sm font-bold font-peshang text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug">
            {title}
          </h4>
        </Link>

        <div className="flex items-center justify-between text-[11px] font-sirwan text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
          <span>خوێندنەوە</span>
          <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-amber-500" />
        </div>
      </div>
    </div>
  );
}

export default function SavedPage() {
  const { favorites, removeFavorite, clearFavorites, isLoaded } = useFavorites();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  // Live media maps for syncing framing and metadata
  const [liveFilms, setLiveFilms] = useState<Record<string, Film>>({});
  const [liveArticles, setLiveArticles] = useState<Record<string, Article>>({});

  useEffect(() => {
    // Fetch live films from database
    fetch('/api/films')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Film[]) => {
        if (Array.isArray(data)) {
          const map: Record<string, Film> = {};
          for (const f of data) {
            if (f.id) map[f.id.trim().toLowerCase()] = f;
            if (f.slug) map[f.slug.trim().toLowerCase()] = f;
            if (f.titleKurdish) map[f.titleKurdish.trim().toLowerCase()] = f;
          }
          setLiveFilms(map);
        }
      })
      .catch((err) => {
        console.error('Failed to sync live films for bookmarks:', err);
      });

    // Fetch live articles from database
    fetch('/api/articles')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Article[]) => {
        if (Array.isArray(data)) {
          const map: Record<string, Article> = {};
          for (const a of data) {
            if (a.id) map[a.id.trim().toLowerCase()] = a;
            if (a.slug) map[a.slug.trim().toLowerCase()] = a;
            if (a.title) map[a.title.trim().toLowerCase()] = a;
          }
          setLiveArticles(map);
        }
      })
      .catch((err) => {
        console.error('Failed to sync live articles for bookmarks:', err);
      });
  }, []);

  const isMovieType = (type?: string) => type === 'movie' || type === 'cartoon';
  const isWritingType = (type?: string) => type === 'writing' || type === 'article';

  const savedMovies = useMemo(
    () => favorites.filter((item) => isMovieType(item.type)),
    [favorites]
  );

  const savedWritings = useMemo(
    () => favorites.filter((item) => isWritingType(item.type)),
    [favorites]
  );

  const moviesCount = savedMovies.length;
  const writingsCount = savedWritings.length;

  const handleClearAll = () => {
    if (confirmClear) {
      clearFavorites();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  const findLiveFilm = (item: SavedItem): Film | undefined => {
    const idKey = item.id ? item.id.trim().toLowerCase() : '';
    const slugKey = item.slug ? item.slug.trim().toLowerCase() : '';
    const titleKey = item.title ? item.title.trim().toLowerCase() : '';
    return liveFilms[idKey] || (slugKey ? liveFilms[slugKey] : undefined) || (titleKey ? liveFilms[titleKey] : undefined);
  };

  const findLiveArticle = (item: SavedItem): Article | undefined => {
    const idKey = item.id ? item.id.trim().toLowerCase() : '';
    const slugKey = item.slug ? item.slug.trim().toLowerCase() : '';
    const titleKey = item.title ? item.title.trim().toLowerCase() : '';
    return liveArticles[idKey] || (slugKey ? liveArticles[slugKey] : undefined) || (titleKey ? liveArticles[titleKey] : undefined);
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
              <span>خوێندنەوەی نووسینەکان</span>
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
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sirwan font-medium transition-all duration-200 cursor-pointer ${
                  activeFilter === 'all'
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
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sirwan font-medium transition-all duration-200 cursor-pointer ${
                  activeFilter === 'movies'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <span>فیلمەکان</span>
                <span className="mr-1.5 text-[11px] opacity-80 font-sans">({moviesCount})</span>
              </button>

              {/* Writings */}
              <button
                type="button"
                onClick={() => setActiveFilter('writings')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sirwan font-medium transition-all duration-200 cursor-pointer ${
                  activeFilter === 'writings'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <span>نووسینەکان</span>
                <span className="mr-1.5 text-[11px] opacity-80 font-sans">({writingsCount})</span>
              </button>
            </div>

            {/* Clear All Action */}
            <button
              type="button"
              onClick={handleClearAll}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sirwan transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                confirmClear
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  : 'text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{confirmClear ? 'دڵنیایت لە پاککردنەوە؟' : 'سڕینەوەی هەمووی'}</span>
            </button>
          </div>

          {/* Cards Content Area */}
          {activeFilter === 'all' ? (
            /* "هەمووی" (All) Tab: Two Distinct Sections Separated Vertically */
            <div className="w-full space-y-10">
              {/* Movies & Cartoons Section */}
              {savedMovies.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <span>فیلم و کارتۆنەکان</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-sans">
                        {savedMovies.length}
                      </span>
                    </h2>
                  </div>

                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {savedMovies.map((item) => (
                      <MovieCard
                        key={item.id}
                        item={item}
                        liveFilm={findLiveFilm(item)}
                        onRemove={removeFavorite}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Writings Section */}
              {savedWritings.length > 0 && (
                <section
                  className={`space-y-4 ${
                    savedMovies.length > 0
                      ? 'pt-8 border-t border-zinc-200/70 dark:border-zinc-800/70'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <span>نووسینەکان</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-sans">
                        {savedWritings.length}
                      </span>
                    </h2>
                  </div>

                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                    {savedWritings.map((item) => (
                      <WritingCard
                        key={item.id}
                        item={item}
                        liveArticle={findLiveArticle(item)}
                        onRemove={removeFavorite}
                      />
                    ))}
                  </div>
                </section>
              )}

              {savedMovies.length === 0 && savedWritings.length === 0 && (
                <div className="w-full py-12 text-center text-xs sm:text-sm font-sirwan text-zinc-400">
                  هیچ بەرهەمێک لەم بەشەدا پاشەکەوت نەکراوە.
                </div>
              )}
            </div>
          ) : activeFilter === 'movies' ? (
            /* "فیلمەکان" Tab */
            savedMovies.length === 0 ? (
              <div className="w-full py-12 text-center text-xs sm:text-sm font-sirwan text-zinc-400">
                هیچ فیلمێک لەم بەشەدا پاشەکەوت نەکراوە.
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
                {savedMovies.map((item) => (
                  <MovieCard
                    key={item.id}
                    item={item}
                    liveFilm={findLiveFilm(item)}
                    onRemove={removeFavorite}
                  />
                ))}
              </div>
            )
          ) : (
            /* "نووسینەکان" Tab */
            savedWritings.length === 0 ? (
              <div className="w-full py-12 text-center text-xs sm:text-sm font-sirwan text-zinc-400">
                هیچ نووسینێک لەم بەشەدا پاشەکەوت نەکراوە.
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                {savedWritings.map((item) => (
                  <WritingCard
                    key={item.id}
                    item={item}
                    liveArticle={findLiveArticle(item)}
                    onRemove={removeFavorite}
                  />
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
