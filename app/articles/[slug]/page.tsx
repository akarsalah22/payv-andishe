import type { Metadata } from 'next';
import { getArticleBySlug } from '@/data/articles';
import { readArticles } from '@/lib/storage';
import { ArticleReaderView } from '@/components/ArticleReaderView';
import { ArticleReaderClient } from '@/components/ArticleReaderClient';

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = slug ? String(slug).trim() : '';
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug).trim();
  } catch {
    // ignore
  }

  const articles = await readArticles();
  const article =
    articles.find((a) => a.slug === rawSlug || a.slug === decodedSlug || a.id === rawSlug || a.id === decodedSlug) ||
    getArticleBySlug(decodedSlug);

  if (!article) {
    return {
      title: 'وتار نەدۆزرایەوە | میدیای ئیسلامی',
      description: 'وتاری داواکراو بوونی نییە یان سڕدراوەتەوە.',
    };
  }

  const imageSource = article.coverImage || article.imageUrl;
  const shareableUrl = `https://mediay-islamy.vercel.app/articles/${encodeURIComponent(article.slug || article.id)}`;
  const fullCoverUrl = imageSource
    ? imageSource.startsWith('http')
      ? imageSource
      : `https://mediay-islamy.vercel.app${imageSource.startsWith('/') ? imageSource : `/${imageSource}`}`
    : 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80';

  return {
    title: `${article.title} | میدیای ئیسلامی`,
    description: article.excerpt || `${article.title} - لە بەشی وتار و پەڕتووکەکانی میدیای ئیسلامی`,
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

export default async function ArticleReaderPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const rawSlug = slug ? String(slug).trim() : '';
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug).trim();
  } catch {
    // ignore
  }

  const articles = await readArticles();
  const article =
    articles.find((a) => a.slug === rawSlug || a.slug === decodedSlug || a.id === rawSlug || a.id === decodedSlug) ||
    getArticleBySlug(decodedSlug);

  // If not found in server DB/files, fallback to client reader for local storage / client fetch
  if (!article) {
    return <ArticleReaderClient slug={decodedSlug} />;
  }

  return <ArticleReaderView article={article} />;
}
