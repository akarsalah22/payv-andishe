import type { Metadata } from 'next';
import { getArticleBySlug } from '@/data/articles';
import { readArticles } from '@/lib/storage';
import { ArticleReaderView } from '@/components/ArticleReaderView';
import { ArticleReaderClient } from '@/components/ArticleReaderClient';

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface WritingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: WritingPageProps): Promise<Metadata> {
  const { id } = await params;
  const rawId = id ? String(id).trim() : '';
  let decodedId = rawId;
  try {
    decodedId = decodeURIComponent(rawId).trim();
  } catch {
    // ignore
  }

  const articles = await readArticles();
  const article =
    articles.find(
      (a) =>
        a.id === rawId ||
        a.id === decodedId ||
        a.slug === rawId ||
        a.slug === decodedId
    ) || getArticleBySlug(decodedId);

  if (!article) {
    return {
      title: 'بابەت نەدۆزرایەوە | میدیای ئیسلامی',
      description: 'بابەتی داواکراو بوونی نییە یان سڕدراوەتەوە.',
    };
  }

  const imageSource = article.coverImage || article.imageUrl;
  const shareableUrl = `https://mediay-islamy.vercel.app/writings/${encodeURIComponent(article.id || article.slug)}`;
  const fullCoverUrl = imageSource
    ? imageSource.startsWith('http')
      ? imageSource
      : `https://mediay-islamy.vercel.app${imageSource.startsWith('/') ? imageSource : `/${imageSource}`}`
    : 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80';

  return {
    title: `${article.title} | میدیای ئیسلامی`,
    description: article.excerpt || `${article.title} - لە میدیای ئیسلامی`,
    alternates: {
      canonical: shareableUrl,
    },
    openGraph: {
      title: `${article.title} | میدیای ئیسلامی`,
      description: article.excerpt || article.title,
      type: 'article',
      locale: 'ckb_IQ',
      url: shareableUrl,
      siteName: 'میدیای ئیسلامی',
      images: [
        {
          url: fullCoverUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | میدیای ئیسلامی`,
      description: article.excerpt || article.title,
      images: [fullCoverUrl],
    },
  };
}

export default async function WritingDetailPage({ params }: WritingPageProps) {
  const { id } = await params;
  const rawId = id ? String(id).trim() : '';
  let decodedId = rawId;
  try {
    decodedId = decodeURIComponent(rawId).trim();
  } catch {
    // ignore
  }

  const articles = await readArticles();
  const article =
    articles.find(
      (a) =>
        a.id === rawId ||
        a.id === decodedId ||
        a.slug === rawId ||
        a.slug === decodedId
    ) || getArticleBySlug(decodedId);

  if (!article) {
    return <ArticleReaderClient slug={decodedId} />;
  }

  return <ArticleReaderView article={article} />;
}
