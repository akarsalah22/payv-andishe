"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock, Calendar, Send, BookOpen, Copy } from 'lucide-react';
import type { Article } from '@/data/articles';
import { useToast } from '@/components/ToastContext';

interface ArticleReaderClientProps {
  slug: string;
}

export function ArticleReaderClient({ slug }: ArticleReaderClientProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const handleCopyLink = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : '';
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      showToast('بەستەر کۆپی کرا', { type: 'success' });
    } catch {
      showToast('کردارەکە سەرکەوتوو نەبوو، دووبارە هەوڵبدەرەوە', { type: 'error' });
    }
  };

  useEffect(() => {
    const loadArticle = async () => {
      // 1. Try local storage first
      try {
        const stored = localStorage.getItem('payvandishe_articles');
        if (stored) {
          const parsed: Article[] = JSON.parse(stored);
          const found = parsed.find((a) => a.slug === slug);
          if (found) {
            setArticle(found);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // ignore
      }

      // 2. Try fetching from /api/articles
      try {
        const res = await fetch('/api/articles');
        if (res.ok) {
          const data: Article[] = await res.json();
          const found = data.find((a) => a.slug === slug);
          if (found) {
            setArticle(found);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // ignore
      }

      setIsLoading(false);
    };

    loadArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-xs font-sirwan text-zinc-400">
        چاوەڕوان بە بۆ بارکردنی وتار...
      </div>
    );
  }

  if (!article) {
    notFound();
  }

  const imageSource = article.coverImage || article.imageUrl;
  const shareTelegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    `https://payvandishe.com/articles/${article.slug}`
  )}&text=${encodeURIComponent(article.title)}`;

  return (
    <article
      dir="rtl"
      className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full py-10 sm:py-16 space-y-10 text-right"
    >
      {/* Top Back Navigation */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-[#ede8e1] dark:border-zinc-800/80">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 hover:text-[#d49757] dark:text-zinc-400 dark:hover:text-[#d49757] tracking-normal transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent group"
        >
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
          <span>گەڕانەوە بۆ وتارەکان</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-sirwan bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700 transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent cursor-pointer touch-manipulation"
            title="کۆپیکردنی بەستەری وتار"
          >
            <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">کۆپیکردنی بەستەر</span>
          </button>

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

      {/* Article Header */}
      <header className="w-full max-w-2xl mx-auto space-y-6 text-right">
        {/* Category & Meta pills */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-sirwan bg-[#d49757]/15 text-[#d49757] border border-[#d49757]/30 tracking-normal shadow-2xs">
            {article.category}
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-[#d49757]" strokeWidth={1.75} />
            <span>{article.readTime}</span>
          </span>

          <span className="text-zinc-300 dark:text-zinc-700">•</span>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium font-sirwan text-zinc-500 dark:text-zinc-400">
            <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{article.date}</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal sm:leading-relaxed align-baseline">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <div className="p-4 rounded-xl bg-stone-100/70 dark:bg-zinc-900/50 border-s-4 border-[#d49757] border-y border-e border-[#ede8e1] dark:border-zinc-800/80">
            <p className="text-sm sm:text-base font-normal font-sirwan text-zinc-700 dark:text-zinc-300 leading-relaxed tracking-normal">
              {article.excerpt}
            </p>
          </div>
        )}
      </header>

      {/* Cover Image Container */}
      {imageSource && (
        <div className="w-full max-w-3xl mx-auto relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-200 dark:bg-zinc-800 border border-[#ede8e1] dark:border-zinc-800 shadow-md">
          <Image
            src={imageSource}
            alt={article.title}
            fill
            priority
            unoptimized={imageSource.startsWith('data:')}
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

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
                کەناڵی فەرمیی پەیڤ و ئەندێشە
              </h3>
              <p className="text-xs font-sirwan text-zinc-600 dark:text-zinc-400">
                بۆ خوێندنەوەی بەردەوامی وتاری هزری و بینینی شاکارەکانی سینەما
              </p>
            </div>
          </div>

          <div className="pt-1">
            <a
              href="https://t.me/payvandishe"
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

