import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  Film as FilmIcon,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';
import { readFilms } from '@/lib/storage';
import { SAMPLE_FILMS, getFilmById, getFilmBySlug, getFilmPlatform, getFilmWatchUrl } from '@/data/films';
import { FilmCard } from '@/components/FilmCard';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { TelegramIcon } from '@/components/TelegramIcon';
import { YouTubeIcon } from '@/components/YouTubeIcon';

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface FilmPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: FilmPageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const films = await readFilms();
  const film =
    films.find((f) => String(f.id) === decodedId || f.slug === decodedId) ||
    SAMPLE_FILMS.find((f) => String(f.id) === decodedId || f.slug === decodedId) ||
    getFilmById(decodedId) ||
    getFilmBySlug(decodedId);

  if (!film) {
    return {
      title: 'فیلم نەدۆزرایەوە | میدیای ئیسلامی',
    };
  }

  const posterSrc = film.posterUrl || (film as any).image || '/placeholder.jpg';
  const description = film.description || `${film.titleKurdish} - پەخشی ڕاستەوخۆ لە کەناڵی تێلیگرام`;

  return {
    title: `${film.titleKurdish} | میدیای ئیسلامی`,
    description,
    openGraph: {
      title: film.titleKurdish,
      description,
      type: 'video.movie',
      locale: 'ckb_IQ',
      url: `https://mediay-islamy.vercel.app/films/${film.id || film.slug}`,
      images: [
        {
          url: posterSrc.startsWith('http') ? posterSrc : `https://mediay-islamy.vercel.app${posterSrc}`,
          width: 1200,
          height: 630,
          alt: film.titleKurdish,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: film.titleKurdish,
      description,
      images: [posterSrc.startsWith('http') ? posterSrc : `https://mediay-islamy.vercel.app${posterSrc}`],
    },
  };
}

export default async function FilmDetailsPage({ params }: FilmPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const films = await readFilms();
  const film =
    films.find((f) => String(f.id) === decodedId || f.slug === decodedId) ||
    SAMPLE_FILMS.find((f) => String(f.id) === decodedId || f.slug === decodedId) ||
    getFilmById(decodedId) ||
    getFilmBySlug(decodedId);

  if (!film) {
    notFound();
  }

  const posterSrc = film.posterUrl || (film as any).image || '/placeholder.jpg';
  const watchUrl = getFilmWatchUrl(film);
  const platform = getFilmPlatform(film);
  const isYouTube = platform === 'youtube';
  const shareTelegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    `https://mediay-islamy.vercel.app/films/${film.id || film.slug}`
  )}&text=${encodeURIComponent(film.titleKurdish)}`;

  // Related films from the same category or other featured films
  const relatedFilms = films
    .filter((f) => (f.id !== film.id && f.slug !== film.slug))
    .slice(0, 3);

  return (
    <article
      dir="rtl"
      className="flex-1 flex flex-col items-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto w-full py-6 sm:py-12 space-y-8 text-right"
    >
      {/* Top Breadcrumb & Action Navigation */}
      <div className="w-full flex items-center justify-between pb-4 sm:pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <Link
          href="/films"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group"
        >
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
          <span>گەڕانەوە بۆ فیلم و زنجیرەکان</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Copy Link Button */}
          <CopyLinkButton url={`https://mediay-islamy.vercel.app/films/${film.id || film.slug}`} />

          {/* Share to Telegram Button */}
          <a
            href={shareTelegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-sirwan bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20 transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none"
            title="هاوبەشکردن لە تێلیگرام"
          >
            <TelegramIcon className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span className="hidden sm:inline">هاوبەشکردن</span>
          </a>
        </div>
      </div>

      {/* Main Hero / Backdrop Showcase Card */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-200/80 dark:border-white/10 shadow-2xl">
        {/* Ambient Blurred Backdrop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={posterSrc}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Poster Card */}
          <div className="relative w-44 sm:w-56 md:w-60 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-zinc-900 group">
            <img
              src={posterSrc}
              alt={film.titleKurdish}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            {/* Subtle Gradient On Poster */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Details & Metadata Column */}
          <div className="flex-1 text-center md:text-right space-y-4 w-full">
            {/* Badges Bar */}
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-sirwan bg-amber-500 text-zinc-950 shadow-md">
                {film.category}
              </span>
              {film.genres && film.genres.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-full text-xs font-medium font-sirwan bg-white/15 text-white backdrop-blur-md border border-white/15 shadow-2xs"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Title & Original Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-peshang text-white leading-normal">
                {film.titleKurdish}
              </h1>
              {film.originalTitle && (
                <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1">
                  {film.originalTitle}
                </p>
              )}
            </div>

            {/* Quick Metadata Row */}
            <div className="flex items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-zinc-300 font-sirwan flex-wrap pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" strokeWidth={1.75} />
                <span>ساڵی بەرهەمهێنان: {film.year}</span>
              </span>
              {film.duration && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" strokeWidth={1.75} />
                    <span>ماوە: {film.duration}</span>
                  </span>
                </>
              )}
            </div>

            {/* Action Buttons: Watch on Telegram / YouTube & Share */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold font-sirwan text-sm sm:text-base active:scale-95 transition-all duration-200 cursor-pointer ${
                  isYouTube
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/25'
                }`}
              >
                {isYouTube ? (
                  <YouTubeIcon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                ) : (
                  <TelegramIcon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                )}
                <span>{isYouTube ? 'بینینی فیلم لە یووتووب' : 'بینینی فیلم لە تێلیگرام'}</span>
              </a>

              <CopyLinkButton
                url={`https://mediay-islamy.vercel.app/films/${film.id || film.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium font-sirwan text-sm border border-white/15 backdrop-blur-md active:scale-95 transition-all duration-200 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Full Synopsis / Story Section (کورتەی چیرۆک) */}
      <section className="w-full rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-8 space-y-4 shadow-sm text-right">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-200/70 dark:border-zinc-800/70">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FilmIcon className="w-4 h-4" strokeWidth={2} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
            کورتەی چیرۆک و دەربارە
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sirwan leading-loose whitespace-pre-line">
          {film.description || "شاکارێکی هەڵبژێردراو بە پەخشی کوالێتی بەرز لە کەناڵی تێلیگرامی میدیای ئیسلامی."}
        </p>
      </section>

      {/* Information Grid Cards */}
      <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 text-right space-y-1">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sirwan block">پۆلێن</span>
          <span className="text-xs sm:text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100">{film.category}</span>
        </div>
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 text-right space-y-1">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sirwan block">ساڵی بەرهەم</span>
          <span className="text-xs sm:text-sm font-bold font-sans text-zinc-900 dark:text-zinc-100">{film.year}</span>
        </div>
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 text-right space-y-1">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sirwan block">ماوە</span>
          <span className="text-xs sm:text-sm font-bold font-sirwan text-zinc-900 dark:text-zinc-100">{film.duration || 'دیارینەکراو'}</span>
        </div>
      </div>

      {/* Related Films / Recommendations Section */}
      {relatedFilms.length > 0 && (
        <section className="w-full space-y-5 pt-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" strokeWidth={2} />
              <h2 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                بەرهەمە پێشنیارکراوەکان
              </h2>
            </div>
            <Link
              href="/films"
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-semibold font-sirwan text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 transition-colors"
            >
              <span>گشت فیلمەکان</span>
              <ChevronLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
            {relatedFilms.map((f) => (
              <FilmCard key={f.id} film={f} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

