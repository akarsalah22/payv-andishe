"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  useEffect(() => {
    if (liveFilm?.posterUrl && liveFilm.posterUrl !== posterSrc) {
      setPosterSrc(liveFilm.posterUrl);
    }
  }, [liveFilm?.posterUrl, posterSrc]);

  // NEVER default to 'contain' while live data is loading, and never trust stale imageFit from localStorage snapshot.
  // Defaults strictly to 'cover' on first paint and for all standard full-bleed media.
  const fit = liveFilm?.imageFit || 'cover';
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
      dir="rtl"
      className="group relative block aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 focus:outline-none select-none tap-highlight-transparent"
    >
      {/* Exact Full-Bleed 2:3 Framing with Smooth Hover Scale */}
      <div className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none">
        {fit === 'contain' ? (
          <>
            <img
              src={posterSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-45 pointer-events-none select-none"
            />
            <div className="relative z-10 w-full h-full overflow-hidden">
              <img
                src={posterSrc}
                alt={title}
                onError={() => setPosterSrc('/placeholder.jpg')}
                className="w-full h-full object-contain transition-transform duration-300 select-none"
                style={{
                  objectPosition: `${posX}% ${posY}%`,
                  transform: `scale(${zoom / 100})`,
                }}
              />
            </div>
          </>
        ) : (
          <div className="relative z-10 w-full h-full overflow-hidden">
            <img
              src={posterSrc}
              alt={title}
              onError={() => setPosterSrc('/placeholder.jpg')}
              className="w-full h-full object-cover transition-transform duration-300 select-none"
              style={{
                objectPosition: `${posX}% ${posY}%`,
                transform: `scale(${zoom / 100})`,
              }}
            />
          </div>
        )}
      </div>

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
    liveArticle?.imageUrl ||
    item.coverImage ||
    item.imageUrl ||
    item.image ||
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80';
  const [imageSrc, setImageSrc] = useState(imageSource);
  const title = liveArticle?.title || item.title;
  const category = liveArticle?.category || item.category || 'نووسین';
  const readTime = liveArticle?.readTime || '٥ خولەک';

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white/70 dark:bg-[#16171b] border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10">
      {/* Top Image Container */}
      <Link href={targetUrl} className="relative aspect-[16/9] w-full overflow-hidden block">
        <img
          src={imageSrc}
          alt={title}
          onError={() =>
            setImageSrc(
              'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80'
            )
          }
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Top-Right Category Pill */}
        <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold font-sirwan">
          {category}
        </span>

        {/* Bottom Read Time */}
        <span className="absolute bottom-2 right-2 text-[10px] font-sans text-zinc-300">
          {readTime}
        </span>
      </Link>

      {/* Top-Left Delete Button */}
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

export function SavedPageClient() {
  const { favorites, removeFavorite, clearFavorites, updateFavorites, isLoaded } = useFavorites();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [confirmClear, setConfirmClear] = useState(false);
  const pathname = usePathname();

  // Live media maps for syncing framing and metadata
  const [liveFilms, setLiveFilms] = useState<Record<string, Film>>({});
  const [liveArticles, setLiveArticles] = useState<Record<string, Article>>({});

  useEffect(() => {
    let isCancelled = false;

    const loadLiveDataAndMigrate = async () => {
      try {
        const timestamp = Date.now();
        const [filmsRes, articlesRes] = await Promise.all([
          fetch(`/api/films?t=${timestamp}`, { cache: 'no-store' }),
          fetch(`/api/articles?t=${timestamp}`, { cache: 'no-store' }),
        ]);

        const filmsData: Film[] = filmsRes.ok ? await filmsRes.json() : [];
        const articlesData: Article[] = articlesRes.ok ? await articlesRes.json() : [];

        if (isCancelled) return;

        if (Array.isArray(filmsData) && filmsData.length > 0) {
          const map: Record<string, Film> = {};
          for (const f of filmsData) {
            if (f.id) map[f.id.trim().toLowerCase()] = f;
            if (f.slug) map[f.slug.trim().toLowerCase()] = f;
            if (f.titleKurdish) map[f.titleKurdish.trim().toLowerCase()] = f;
          }
          setLiveFilms(map);
        }

        if (Array.isArray(articlesData) && articlesData.length > 0) {
          const map: Record<string, Article> = {};
          for (const a of articlesData) {
            if (a.id) map[a.id.trim().toLowerCase()] = a;
            if (a.slug) map[a.slug.trim().toLowerCase()] = a;
            if (a.title) map[a.title.trim().toLowerCase()] = a;
          }
          setLiveArticles(map);
        }

        // Auto-migrate localStorage bookmarks with fresh database framing and metadata
        if (typeof window !== 'undefined' && Array.isArray(filmsData) && filmsData.length > 0) {
          try {
            const raw = localStorage.getItem('mediay_islamy_favorites_v1');
            const stored: SavedItem[] = raw ? JSON.parse(raw) : [];
            if (Array.isArray(stored) && stored.length > 0) {
              const filmsMap = new Map<string, Film>();
              for (const f of filmsData) {
                if (f.id) filmsMap.set(f.id.trim().toLowerCase(), f);
                if (f.slug) filmsMap.set(f.slug.trim().toLowerCase(), f);
                if (f.titleKurdish) filmsMap.set(f.titleKurdish.trim().toLowerCase(), f);
              }

              const articlesMap = new Map<string, Article>();
              if (Array.isArray(articlesData)) {
                for (const a of articlesData) {
                  if (a.id) articlesMap.set(a.id.trim().toLowerCase(), a);
                  if (a.slug) articlesMap.set(a.slug.trim().toLowerCase(), a);
                  if (a.title) articlesMap.set(a.title.trim().toLowerCase(), a);
                }
              }

              let hasChanges = false;
              const migrated = stored.map((item) => {
                const isMovie = item.type === 'movie' || item.type === 'cartoon';
                const isWriting = item.type === 'writing' || item.type === 'article';

                if (isMovie) {
                  const idKey = item.id ? item.id.trim().toLowerCase() : '';
                  const slugKey = item.slug ? item.slug.trim().toLowerCase() : '';
                  const titleKey = item.title ? item.title.trim().toLowerCase() : '';
                  const live = filmsMap.get(idKey) || (slugKey ? filmsMap.get(slugKey) : undefined) || (titleKey ? filmsMap.get(titleKey) : undefined);

                  if (live) {
                    const newTitle = live.titleKurdish || item.title;
                    const newImage = live.posterUrl || item.imageUrl;
                    const newCategory = normalizeCategory(live.category) || item.category;
                    const newFit = live.imageFit || 'cover';
                    const newZoom = live.imageZoom ?? 100;
                    const newPosX = live.imagePosX ?? 50;
                    const newPosY = live.imagePosY ?? 50;

                    if (
                      item.title !== newTitle ||
                      item.imageUrl !== newImage ||
                      item.category !== newCategory ||
                      item.imageFit !== newFit ||
                      item.imageZoom !== newZoom ||
                      item.imagePosX !== newPosX ||
                      item.imagePosY !== newPosY
                    ) {
                      hasChanges = true;
                      return {
                        ...item,
                        title: newTitle,
                        imageUrl: newImage,
                        category: newCategory,
                        imageFit: newFit,
                        imageZoom: newZoom,
                        imagePosX: newPosX,
                        imagePosY: newPosY,
                      };
                    }
                  } else if (item.imageFit === 'contain') {
                    // Purge stale contain to cover even if live lookup is not found
                    hasChanges = true;
                    return {
                      ...item,
                      imageFit: 'cover' as const,
                    };
                  }
                } else if (isWriting) {
                  const idKey = item.id ? item.id.trim().toLowerCase() : '';
                  const slugKey = item.slug ? item.slug.trim().toLowerCase() : '';
                  const titleKey = item.title ? item.title.trim().toLowerCase() : '';
                  const live = articlesMap.get(idKey) || (slugKey ? articlesMap.get(slugKey) : undefined) || (titleKey ? articlesMap.get(titleKey) : undefined);

                  if (live) {
                    const newTitle = live.title || item.title;
                    const newImage = live.coverImage || item.imageUrl;
                    const newCategory = live.category || item.category;

                    if (
                      item.title !== newTitle ||
                      item.imageUrl !== newImage ||
                      item.category !== newCategory
                    ) {
                      hasChanges = true;
                      return {
                        ...item,
                        title: newTitle,
                        imageUrl: newImage,
                        category: newCategory,
                      };
                    }
                  }
                }
                return item;
              });

              if (hasChanges) {
                updateFavorites(migrated);
              }
            }
          } catch (migrationErr) {
            console.error('Failed to auto-migrate bookmarks in localStorage:', migrationErr);
          }
        }
      } catch (err) {
        console.error('Failed to sync live media for bookmarks:', err);
      }
    };

    loadLiveDataAndMigrate();

    return () => {
      isCancelled = true;
    };
  }, [pathname, updateFavorites]);

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
        <div className="w-full max-w-md mx-auto py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <Bookmark className="w-8 h-8" strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold font-peshang text-zinc-800 dark:text-zinc-200">
              هیچ بەرهەمێکت هەڵنەگرتووە!
            </h2>
            <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
              دەتوانیت لە ڕێگەی کرتەکردن لەسەر نیشانەی Bookmark لەسەر هەر فیلم، کارتۆن یان نووسینێک لێرەدا پاشەکەوتیان بکەیت.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/films"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold font-sirwan text-xs hover:bg-amber-400 transition-colors shadow-sm"
            >
              <Clapperboard className="w-4 h-4" />
              <span>فیلم و کارتۆنەکان</span>
            </Link>

            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium font-sirwan text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>نووسینەکان</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Controls Bar: Filters & Clear All */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-sirwan transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-2xs border border-zinc-200/80 dark:border-zinc-700/80'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                هەمووی ({favorites.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('movies')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-sirwan transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'movies'
                    ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-2xs border border-zinc-200/80 dark:border-zinc-700/80'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                فیلم و کارتۆن ({moviesCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('writings')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-sirwan transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'writings'
                    ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-2xs border border-zinc-200/80 dark:border-zinc-700/80'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                نووسینەکان ({writingsCount})
              </button>
            </div>

            {/* Clear All Trigger */}
            <button
              type="button"
              onClick={handleClearAll}
              className={`text-xs font-sirwan flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer self-end sm:self-auto shrink-0 ${
                confirmClear
                  ? 'bg-red-500 text-white font-bold animate-pulse'
                  : 'text-zinc-500 hover:text-red-500 hover:bg-red-500/10'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{confirmClear ? 'دڵنیایت لە سڕینەوەی هەمووی؟' : 'سڕینەوەی هەمووی'}</span>
            </button>
          </div>

          {/* Movies / Cartoons Grid */}
          {(activeFilter === 'all' || activeFilter === 'movies') && savedMovies.length > 0 && (
            <div className="space-y-4">
              {activeFilter === 'all' && (
                <div className="flex items-center gap-2 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-2">
                  <Clapperboard className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                    فیلم و کارتۆنە هەڵگیراوەکان
                  </h3>
                  <span className="text-xs font-sirwan text-zinc-400">({moviesCount})</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                {savedMovies.map((movie) => (
                  <MovieCard
                    key={`fav-movie-${movie.id}`}
                    item={movie}
                    liveFilm={findLiveFilm(movie)}
                    onRemove={removeFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Writings Grid */}
          {(activeFilter === 'all' || activeFilter === 'writings') && savedWritings.length > 0 && (
            <div className="space-y-4 pt-4">
              {activeFilter === 'all' && (
                <div className="flex items-center gap-2 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-2">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                    نووسینە هەڵگیراوەکان
                  </h3>
                  <span className="text-xs font-sirwan text-zinc-400">({writingsCount})</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedWritings.map((writing) => (
                  <WritingCard
                    key={`fav-writing-${writing.id}`}
                    item={writing}
                    liveArticle={findLiveArticle(writing)}
                    onRemove={removeFavorite}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
