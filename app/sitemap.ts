import type { MetadataRoute } from 'next';
import { readFilms, readArticles } from '@/lib/storage';
import { SAMPLE_FILMS } from '@/data/films';
import { SAMPLE_ARTICLES } from '@/data/articles';

export const revalidate = 1800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mediay-islamy.vercel.app';
  const now = new Date();

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/films`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writings`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/saved`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Dynamic Film / Movie Routes
  let filmRoutes: MetadataRoute.Sitemap = [];
  try {
    const films = await readFilms();
    const pool = films && films.length > 0 ? films : SAMPLE_FILMS;

    filmRoutes = pool.flatMap((film) => {
      const slugOrId = encodeURIComponent(film.slug || film.id);
      return [
        {
          url: `${baseUrl}/films/${slugOrId}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.85,
        },
        {
          url: `${baseUrl}/movies/${slugOrId}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.85,
        },
      ];
    });
  } catch {
    filmRoutes = SAMPLE_FILMS.map((film) => ({
      url: `${baseUrl}/films/${encodeURIComponent(film.slug || film.id)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  }

  // 3. Dynamic Article / Writing Routes
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await readArticles();
    const pool = articles && articles.length > 0 ? articles : SAMPLE_ARTICLES;

    articleRoutes = pool.flatMap((article) => {
      const slugOrId = encodeURIComponent(article.slug || article.id);
      return [
        {
          url: `${baseUrl}/articles/${slugOrId}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.85,
        },
        {
          url: `${baseUrl}/writings/${slugOrId}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.85,
        },
      ];
    });
  } catch {
    articleRoutes = SAMPLE_ARTICLES.map((article) => ({
      url: `${baseUrl}/articles/${encodeURIComponent(article.slug || article.id)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  }

  return [...staticRoutes, ...filmRoutes, ...articleRoutes];
}
