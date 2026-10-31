import Link from 'next/link';
import {
  ChevronRight,
  Clock,
  Calendar,
  Send,
  BookOpen,
} from 'lucide-react';
import type { Metadata } from 'next';
import { getArticleBySlug } from '@/data/articles';
import { readArticles } from '@/lib/storage';
import { ArticleReaderClient } from '@/components/ArticleReaderClient';
import { CopyLinkButton } from '@/components/CopyLinkButton';

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const articles = await readArticles();
  const article = articles.find((a) => a.slug === decodedSlug) || getArticleBySlug(decodedSlug);

  if (!article) {
    return {
      title: 'وتار نەدۆزرایەوە | میدیای ئیسلامی',
    };
  }

  const imageSource = article.coverImage || article.imageUrl;

  return {
    title: `${article.title} | میدیای ئیسلامی`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      locale: 'ckb_IQ',
      url: `https://medyay-islami.vercel.app/articles/${article.slug}`,
      images: [
        {
          url: imageSource.startsWith('http') ? imageSource : `https://medyay-islami.vercel.app${imageSource}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [imageSource.startsWith('http') ? imageSource : `https://medyay-islami.vercel.app${imageSource}`],
    },
  };
}

export default async function ArticleReaderPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const articles = await readArticles();
  const article = articles.find((a) => a.slug === decodedSlug) || getArticleBySlug(decodedSlug);

  if (!article) {
    return <ArticleReaderClient slug={decodedSlug} />;
  }

  const imageSource = article.coverImage || article.imageUrl;
  const shareTelegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    `https://medyay-islami.vercel.app/articles/${article.slug}`
  )}&text=${encodeURIComponent(article.title)}`;

  return (
    <article
      dir="rtl"
      className="flex-1 flex flex-col items-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto w-full py-8 sm:py-16 space-y-10 text-right"
    >
      {/* Top Back Navigation */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group"
        >
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
          <span>گەڕانەوە بۆ وتارەکان</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Copy Link Button */}
          <CopyLinkButton />

          {/* Share Button (Top) */}
          <a
            href={shareTelegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-sirwan bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20 transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent cursor-pointer touch-manipulation"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>هاوبەشکردن</span>
          </a>
        </div>
      </div>

      {/* Article Header (Editorial Hierarchy) */}
      <header className="w-full max-w-2xl mx-auto space-y-6 text-right">
        {/* Category & Meta pills */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-sirwan bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 tracking-normal shadow-2xs">
            {article.category}
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.75} />
            <span>{article.readTime}</span>
          </span>

          <span className="text-zinc-300 dark:text-zinc-700">•</span>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" strokeWidth={1.75} />
            <span>{article.date}</span>
          </span>
        </div>

        {/* Stately Kurdish Title (Unified baseline & generous line-height) */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal sm:leading-relaxed align-baseline">
          {article.title}
        </h1>

        {/* 2-line Lead Teaser */}
        <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/50 border-s-4 border-amber-500 border-y border-e border-zinc-200/80 dark:border-zinc-800/80">
          <p className="text-sm sm:text-base font-normal font-sirwan text-zinc-700 dark:text-zinc-300 leading-relaxed tracking-normal">
            {article.excerpt}
          </p>
        </div>
      </header>

      {/* Cover Image Container with strictly defined 16:9 Aspect Ratio & fixed height */}
      <div className="w-full max-w-3xl mx-auto relative aspect-[16/9] sm:h-72 rounded-2xl overflow-hidden bg-stone-100 dark:bg-zinc-800 border border-amber-200/60 dark:border-zinc-800 shadow-md">
        <img
          src={imageSource || '/placeholder.jpg'}
          alt={article.title}
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Focused Reading Body Text */}
      <div className="w-full max-w-2xl mx-auto space-y-6 pt-2">
        {article.content.map((paragraph, index) => (
          <p
            key={index}
            className="text-base sm:text-[17px] font-normal font-sirwan text-zinc-800 dark:text-zinc-200 leading-[2.2] sm:leading-[2.4] tracking-normal text-justify"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Article Footer & Social Action */}
      <footer className="w-full max-w-2xl mx-auto pt-10 border-t border-[#ede8e1] dark:border-zinc-800/80 space-y-8">
        {/* Telegram Share Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/70 dark:bg-[#16171b] border border-[#ede8e1] dark:border-zinc-800 shadow-xs">
          <div className="space-y-1 text-center sm:text-right">
            <span className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 block">
              ئەم وتارەت بەدڵ بوو؟
            </span>
            <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
              دەتوانیت لەگەڵ هاوڕێکانت لە تێلیگرام هاوبەشی پێبکەیت.
            </p>
          </div>

          <a
            href={shareTelegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold font-sirwan text-xs sm:text-sm tracking-normal shadow-sm transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
          >
            <Send className="w-4 h-4" strokeWidth={1.75} />
            <span>هاوبەشکردن لە تێلیگرام</span>
          </a>
        </div>

        {/* Telegram Official Channel Invitation Card */}
        <div className="p-6 rounded-2xl bg-[#d49757]/10 border border-[#d49757]/25 text-right space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d49757] text-zinc-950 flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-base font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                کەناڵی فەرمیی میدیای ئیسلامی
              </h3>
              <p className="text-xs font-sirwan text-zinc-600 dark:text-zinc-400">
                بۆ خوێندنەوەی بەردەوامی وتاری ئیسلامی و بینینی فیلمە پەروەردەیەکان
              </p>
            </div>
          </div>

          <div className="pt-1">
            <a
              href="https://t.me/mediay_islami"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#d49757] hover:bg-[#c28747] text-zinc-950 font-bold font-sirwan text-sm tracking-normal shadow-sm transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <Send className="w-4 h-4" strokeWidth={1.75} />
              <span>پەیوەستبوون بە کەناڵی تێلیگرام</span>
            </a>
          </div>
        </div>

        {/* Back to archive navigation */}
        <div className="text-center pt-2">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 hover:text-[#d49757] dark:hover:text-[#d49757] tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            <span>گەڕانەوە بۆ لیستی سەرجەم وتارەکان</span>
          </Link>
        </div>
      </footer>
    </article>
  );
}

