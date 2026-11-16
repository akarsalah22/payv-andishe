import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ChevronLeft,
  Film as FilmIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import { readFilms } from '@/lib/storage';
import {
  SAMPLE_FILMS,
  getFilmById,
  getFilmBySlug,
  getFilmPlatform,
  getFilmWatchUrl,
  extractYouTubeId,
  getFilmTelegramParts,
  getOkRuEmbedUrl,
  normalizeCategory,
} from '@/data/films';
import { FilmCard } from '@/components/FilmCard';
import { ShareButton } from '@/components/ShareButton';
import { FavoriteButton } from '@/components/FavoriteButton';
import { FilmInteractiveViewer } from '@/components/FilmInteractiveViewer';

export const revalidate = 1800;
export const dynamicParams = true;

interface FilmPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: FilmPageProps): Promise<Metadata> {
  const { id } = await params;
  const rawId = id ? String(id).trim() : '';
  let decodedId = rawId;
  try {
    decodedId = decodeURIComponent(rawId).trim();
  } catch {
    // ignore
  }

  const films = await readFilms();
  const film =
    films.find(
      (f) =>
        f.id === rawId ||
        f.id === decodedId ||
        f.slug === rawId ||
        f.slug === decodedId ||
        f.id?.toLowerCase() === rawId.toLowerCase() ||
        f.id?.toLowerCase() === decodedId.toLowerCase() ||
        f.slug?.toLowerCase() === rawId.toLowerCase() ||
        f.slug?.toLowerCase() === decodedId.toLowerCase()
    ) ||
    SAMPLE_FILMS.find(
      (f) =>
        f.id === rawId ||
        f.id === decodedId ||
        f.slug === rawId ||
        f.slug === decodedId ||
        f.id?.toLowerCase() === rawId.toLowerCase() ||
        f.id?.toLowerCase() === decodedId.toLowerCase() ||
        f.slug?.toLowerCase() === rawId.toLowerCase() ||
        f.slug?.toLowerCase() === decodedId.toLowerCase()
    ) ||
    getFilmById(decodedId) ||
    getFilmBySlug(decodedId);

  if (!film) {
    return {
      title: 'فیلم نەدۆزرایەوە | میدیای ئیسلامی',
      description: 'فیلمی داواکراو بوونی نییە یان سڕدراوەتەوە.',
    };
  }

  const posterSrc = film.posterUrl || '/placeholder.jpg';
  const description =
    film.description ||
    `${film.titleKurdish} (${film.year}) - لە پۆلینی ${normalizeCategory(film.category)}. تەماشای بکە لە میدیای ئیسلامی.`;
  const shareableUrl = `https://mediay-islamy.vercel.app/films/${encodeURIComponent(film.slug || film.id)}`;
  const fullPosterUrl = posterSrc.startsWith('http')
    ? posterSrc
    : `https://mediay-islamy.vercel.app${posterSrc.startsWith('/') ? posterSrc : `/${posterSrc}`}`;

  return {
    title: `${film.titleKurdish} | میدیای ئیسلامی`,
    description,
    alternates: {
      canonical: shareableUrl,
    },
    openGraph: {
      title: `${film.titleKurdish} | میدیای ئیسلامی`,
      description,
      type: 'video.movie',
      locale: 'ckb_IQ',
      url: shareableUrl,
      siteName: 'میدیای ئیسلامی',
      images: [
        {
          url: fullPosterUrl,
          width: 1200,
          height: 630,
          alt: film.titleKurdish,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${film.titleKurdish} | میدیای ئیسلامی`,
      description,
      images: [fullPosterUrl],
    },
  };
}

export default async function FilmDetailsPage({ params }: FilmPageProps) {
  const { id } = await params;
  const rawId = id ? String(id).trim() : '';
  let decodedId = rawId;
  try {
    decodedId = decodeURIComponent(rawId).trim();
  } catch {
    // ignore
  }

  const films = await readFilms();
  const film =
    films.find(
      (f) =>
        f.id === rawId ||
        f.id === decodedId ||
        f.slug === rawId ||
        f.slug === decodedId ||
        f.id?.toLowerCase() === rawId.toLowerCase() ||
        f.id?.toLowerCase() === decodedId.toLowerCase() ||
        f.slug?.toLowerCase() === rawId.toLowerCase() ||
        f.slug?.toLowerCase() === decodedId.toLowerCase()
    ) ||
    SAMPLE_FILMS.find(
      (f) =>
        f.id === rawId ||
        f.id === decodedId ||
        f.slug === rawId ||
        f.slug === decodedId ||
        f.id?.toLowerCase() === rawId.toLowerCase() ||
        f.id?.toLowerCase() === decodedId.toLowerCase() ||
        f.slug?.toLowerCase() === rawId.toLowerCase() ||
        f.slug?.toLowerCase() === decodedId.toLowerCase()
    ) ||
    getFilmById(decodedId) ||
    getFilmBySlug(decodedId);

  if (!film) {
    notFound();
  }

  const posterSrc = film.posterUrl || '/placeholder.jpg';
  const watchUrl = getFilmWatchUrl(film);
  const platform = getFilmPlatform(film);

  const youtubeId =
    film.youtubeId ||
    extractYouTubeId(film.watchUrl) ||
    extractYouTubeId(film.telegramPostUrl);

  const telegramParts = getFilmTelegramParts(film);

  const okruSource =
    film.okru_url ||
    film.okruUrl ||
    (platform === 'okru' ? film.watchUrl : undefined) ||
    (film.watchUrl?.includes('ok.ru') ? film.watchUrl : undefined);

  const okruEmbedUrl = getOkRuEmbedUrl(okruSource);

  const shareFilmUrl = `https://mediay-islamy.vercel.app/films/${encodeURIComponent(film.slug || film.id)}`;

  // Related films from other entries
  const relatedFilms = films
    .filter((f) => f.id !== film.id && f.slug !== film.slug)
    .slice(0, 6);

  return (
    <article
      dir="rtl"
      className="w-full py-6 sm:py-12 space-y-10 text-right flex-1 flex flex-col"
    >
      {/* Top Breadcrumb & Action Navigation */}
      <div className="w-full flex items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <Link
          href="/films"
          className="inline-flex items-center gap-1.5 text-sm font-medium font-sirwan text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 whitespace-nowrap transition-colors duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group shrink-0"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 shrink-0" strokeWidth={1.8} />
          <span>گەڕانەوە</span>
          <span className="hidden sm:inline">بۆ فیلم و کارتۆنەکان</span>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Bookmark / Save Button */}
          <FavoriteButton
            item={{
              id: film.id || film.slug,
              title: film.titleKurdish,
              imageUrl: posterSrc,
              type: 'movie',
              slug: film.slug || film.id,
              category: normalizeCategory(film.category),
              year: film.year,
              duration: film.duration,
              imageFit: film.imageFit,
              imageZoom: film.imageZoom,
              imagePosX: film.imagePosX,
              imagePosY: film.imagePosY,
            }}
            variant="pill"
          />

          {/* Native Web Share Button */}
          <ShareButton
            title={film.titleKurdish}
            text={`${film.titleKurdish} (${film.year}) - لە میدیای ئیسلامی`}
            url={shareFilmUrl}
          />
        </div>
      </div>

      {/* Main Interactive Hero Showcase & In-Site Theater Video Player */}
      <FilmInteractiveViewer
        film={film}
        episodes={telegramParts}
        okruEmbedUrl={okruEmbedUrl}
        okruSource={okruSource}
        youtubeId={film.youtubeId || youtubeId || undefined}
        watchUrl={watchUrl}
      />

      {/* Full Synopsis / Story Section (کورتەی چیرۆک) */}
      <section className="w-full rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-8 space-y-4 shadow-xs text-right">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-200/70 dark:border-zinc-800/70">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FilmIcon className="w-4 h-4" strokeWidth={2} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
            کورتەی چیرۆک:
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sirwan leading-loose whitespace-pre-line">
          {film.description || "شاکارێکی هەڵبژێردراو لە کەناڵی تێلیگرامی میدیای ئیسلامی."}
        </p>
      </section>

      {/* Related Films / Recommendations Section */}
      {relatedFilms.length > 0 && (
        <section className="w-full space-y-5 pt-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
            <h2 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
              بەرهەمە پێشنیارکراوەکان
            </h2>
            <Link
              href="/films"
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-semibold font-sirwan text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 transition-colors"
            >
              <span>گشت فیلمەکان</span>
              <ChevronLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-5 lg:gap-6">
            {relatedFilms.map((f, idx) => (
              <FilmCard key={f.id || f.slug || idx} film={f} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
