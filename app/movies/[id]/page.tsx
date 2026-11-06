import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { readFilms } from '@/lib/storage';
import { SAMPLE_FILMS, getFilmById, getFilmBySlug } from '@/data/films';

export const revalidate = 1800;
export const dynamicParams = true;

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MovieDetailPageProps): Promise<Metadata> {
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
        f.slug === decodedId
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
    `${film.titleKurdish} (${film.year}) - لە پۆلینی ${film.category}. تەماشای بکە لە میدیای ئیسلامی.`;
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

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  redirect(`/films/${encodeURIComponent(id)}`);
}
