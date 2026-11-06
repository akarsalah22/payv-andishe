"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import type { Article } from "@/data/articles";
import { ArticleReaderView } from "@/components/ArticleReaderView";

interface ArticleReaderClientProps {
  slug: string;
}

export function ArticleReaderClient({ slug }: ArticleReaderClientProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      // 1. Try local storage first
      try {
        const stored = localStorage.getItem("payvandishe_articles");
        if (stored) {
          const parsed: Article[] = JSON.parse(stored);
          const found = parsed.find(
            (a) => a.slug === slug || a.id === slug || a.slug === decodeURIComponent(slug)
          );
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
        const res = await fetch("/api/articles");
        if (res.ok) {
          const data: Article[] = await res.json();
          const found = data.find(
            (a) => a.slug === slug || a.id === slug || a.slug === decodeURIComponent(slug)
          );
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
      <div className="flex-1 flex items-center justify-center py-24 text-xs font-sirwan text-zinc-400">
        چاوەڕوان بە بۆ بارکردنی بابەت...
      </div>
    );
  }

  if (!article) {
    notFound();
  }

  return <ArticleReaderView article={article} />;
}

export default ArticleReaderClient;
