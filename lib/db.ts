import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { SAMPLE_FILMS, type Film } from '@/data/films';
import { SAMPLE_ARTICLES, type Article } from '@/data/articles';

function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL
  );
}

let sqlInstance: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> | null {
  const url = getDatabaseUrl();
  if (!url) return null;
  if (!sqlInstance) {
    sqlInstance = neon(url);
  }
  return sqlInstance;
}

let tablesInitialized = false;

/**
 * Initializes the database tables and seeds initial data if tables are empty.
 */
export async function ensureDbInitialized(): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;
  if (tablesInitialized) return true;

  try {
    // 1. Create films table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS films (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title_kurdish TEXT NOT NULL,
        original_title TEXT,
        year INTEGER NOT NULL,
        duration TEXT NOT NULL,
        category TEXT NOT NULL,
        genres JSONB NOT NULL DEFAULT '[]'::jsonb,
        poster_url TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        telegram_post_url TEXT NOT NULL,
        platform TEXT DEFAULT 'telegram',
        watch_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Ensure columns exist if table was created in an earlier migration
    await sql.query(`
      ALTER TABLE films ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'telegram';
    `);

    await sql.query(`
      ALTER TABLE films ADD COLUMN IF NOT EXISTS watch_url TEXT;
    `);

    // 2. Create articles table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content JSONB NOT NULL DEFAULT '[]'::jsonb,
        category TEXT NOT NULL,
        read_time TEXT NOT NULL,
        date TEXT NOT NULL,
        cover_image TEXT NOT NULL,
        image_url TEXT,
        author TEXT NOT NULL DEFAULT 'میدیای ئیسلامی',
        pdf_url TEXT,
        external_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await sql.query(`
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS pdf_url TEXT;
    `);

    await sql.query(`
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS external_url TEXT;
    `);

    // 3. Create site_settings table for dynamic settings like About page
    await sql.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Seed films if empty
    const filmCountResult = await sql.query('SELECT COUNT(*)::int AS count FROM films;');
    const filmCount = (filmCountResult[0] as { count: number })?.count || 0;

    if (filmCount === 0) {
      for (const film of SAMPLE_FILMS) {
        await sql.query(
          `
          INSERT INTO films (
            id, slug, title_kurdish, original_title, year, duration,
            category, genres, poster_url, description, telegram_post_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING;
          `,
          [
            film.id,
            film.slug,
            film.titleKurdish,
            film.originalTitle,
            film.year,
            film.duration,
            film.category,
            JSON.stringify(film.genres),
            film.posterUrl,
            film.description,
            film.telegramPostUrl,
          ]
        );
      }
    }

    // 4. Seed articles if empty
    const articleCountResult = await sql.query('SELECT COUNT(*)::int AS count FROM articles;');
    const articleCount = (articleCountResult[0] as { count: number })?.count || 0;

    if (articleCount === 0) {
      for (const article of SAMPLE_ARTICLES) {
        await sql.query(
          `
          INSERT INTO articles (
            id, slug, title, excerpt, content, category, read_time,
            date, cover_image, image_url, author
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING;
          `,
          [
            article.id,
            article.slug,
            article.title,
            article.excerpt,
            JSON.stringify(article.content),
            article.category,
            article.readTime,
            article.date,
            article.coverImage,
            article.imageUrl,
            article.author,
          ]
        );
      }
    }

    tablesInitialized = true;
    return true;
  } catch (err) {
    console.error('Error initializing database tables:', err);
    return false;
  }
}

interface FilmDbRow {
  id: string;
  slug: string;
  titleKurdish: string;
  originalTitle: string | null;
  year: number | string;
  duration: string;
  category: Film['category'];
  genres: string[] | string;
  posterUrl: string;
  description: string | null;
  telegramPostUrl: string;
  platform?: Film['platform'];
  watchUrl?: string;
}

interface ArticleDbRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[] | string;
  category: Article['category'];
  readTime: string;
  date: string;
  coverImage: string;
  imageUrl: string | null;
  author: string | null;
  pdfUrl?: string | null;
  externalUrl?: string | null;
}

/**
 * Fetch all films from Neon Postgres, ordered by creation date descending.
 */
export async function getFilmsFromDb(): Promise<Film[] | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureDbInitialized();
    const rows = await sql.query(`
      SELECT
        id,
        slug,
        title_kurdish AS "titleKurdish",
        original_title AS "originalTitle",
        year,
        duration,
        category,
        genres,
        poster_url AS "posterUrl",
        description,
        telegram_post_url AS "telegramPostUrl",
        platform,
        watch_url AS "watchUrl"
      FROM films
      ORDER BY created_at DESC;
    `);

    return (rows as unknown as FilmDbRow[]).map((r) => {
      const activeUrl = r.watchUrl || r.telegramPostUrl || '';
      const activePlatform = r.platform || (activeUrl.includes('youtu') ? 'youtube' : 'telegram');
      return {
        id: r.id,
        slug: r.slug,
        titleKurdish: r.titleKurdish,
        originalTitle: r.originalTitle || r.titleKurdish,
        year: Number(r.year),
        duration: r.duration,
        category: r.category,
        genres: Array.isArray(r.genres) ? r.genres : JSON.parse(typeof r.genres === 'string' ? r.genres : '[]'),
        posterUrl: r.posterUrl,
        description: r.description || '',
        platform: activePlatform,
        watchUrl: activeUrl,
        telegramPostUrl: r.telegramPostUrl || activeUrl,
      };
    });
  } catch (err) {
    console.error('Failed to get films from DB:', err);
    return null;
  }
}

/**
 * Insert or update a film in Neon Postgres.
 */
export async function upsertFilmToDb(film: Film): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  try {
    await ensureDbInitialized();
    const watchLink = film.watchUrl || film.telegramPostUrl || '';
    const platform = film.platform || (watchLink.includes('youtu') ? 'youtube' : 'telegram');

    await sql.query(
      `
      INSERT INTO films (
        id, slug, title_kurdish, original_title, year, duration,
        category, genres, poster_url, description, telegram_post_url,
        platform, watch_url, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title_kurdish = EXCLUDED.title_kurdish,
        original_title = EXCLUDED.original_title,
        year = EXCLUDED.year,
        duration = EXCLUDED.duration,
        category = EXCLUDED.category,
        genres = EXCLUDED.genres,
        poster_url = EXCLUDED.poster_url,
        description = EXCLUDED.description,
        telegram_post_url = EXCLUDED.telegram_post_url,
        platform = EXCLUDED.platform,
        watch_url = EXCLUDED.watch_url,
        updated_at = NOW();
      `,
      [
        film.id,
        film.slug,
        film.titleKurdish,
        film.originalTitle,
        film.year,
        film.duration,
        film.category,
        JSON.stringify(film.genres),
        film.posterUrl,
        film.description,
        film.telegramPostUrl || watchLink,
        platform,
        watchLink,
      ]
    );
    return true;
  } catch (err) {
    console.error('Failed to upsert film in DB:', err);
    return false;
  }
}

/**
 * Delete a film from Neon Postgres.
 */
export async function deleteFilmFromDb(id: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  try {
    await ensureDbInitialized();
    await sql.query('DELETE FROM films WHERE id = $1;', [id]);
    return true;
  } catch (err) {
    console.error('Failed to delete film from DB:', err);
    return false;
  }
}

/**
 * Fetch all articles from Neon Postgres, ordered by creation date descending.
 */
export async function getArticlesFromDb(): Promise<Article[] | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureDbInitialized();
    const rows = await sql.query(`
      SELECT
        id,
        slug,
        title,
        excerpt,
        content,
        category,
        read_time AS "readTime",
        date,
        cover_image AS "coverImage",
        image_url AS "imageUrl",
        author,
        pdf_url AS "pdfUrl",
        external_url AS "externalUrl"
      FROM articles
      ORDER BY created_at DESC;
    `);

    return (rows as unknown as ArticleDbRow[]).map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      content: Array.isArray(r.content) ? r.content : JSON.parse(typeof r.content === 'string' ? r.content : '[]'),
      category: r.category,
      readTime: r.readTime,
      date: r.date,
      coverImage: r.coverImage,
      imageUrl: r.imageUrl || r.coverImage,
      author: r.author || 'میدیای ئیسلامی',
      pdfUrl: r.pdfUrl || undefined,
      externalUrl: r.externalUrl || undefined,
    }));
  } catch (err) {
    console.error('Failed to get articles from DB:', err);
    return null;
  }
}

/**
 * Insert or update an article in Neon Postgres.
 */
export async function upsertArticleToDb(article: Article): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  try {
    await ensureDbInitialized();
    await sql.query(
      `
      INSERT INTO articles (
        id, slug, title, excerpt, content, category, read_time,
        date, cover_image, image_url, author, pdf_url, external_url, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        category = EXCLUDED.category,
        read_time = EXCLUDED.read_time,
        date = EXCLUDED.date,
        cover_image = EXCLUDED.cover_image,
        image_url = EXCLUDED.image_url,
        author = EXCLUDED.author,
        pdf_url = EXCLUDED.pdf_url,
        external_url = EXCLUDED.external_url,
        updated_at = NOW();
      `,
      [
        article.id,
        article.slug,
        article.title,
        article.excerpt,
        JSON.stringify(article.content),
        article.category,
        article.readTime,
        article.date,
        article.coverImage,
        article.imageUrl || article.coverImage,
        article.author,
        article.pdfUrl || null,
        article.externalUrl || null,
      ]
    );
    return true;
  } catch (err) {
    console.error('Failed to upsert article in DB:', err);
    return false;
  }
}

/**
 * Delete an article from Neon Postgres.
 */
export async function deleteArticleFromDb(id: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  try {
    await ensureDbInitialized();
    await sql.query('DELETE FROM articles WHERE id = $1;', [id]);
    return true;
  } catch (err) {
    console.error('Failed to delete article from DB:', err);
    return false;
  }
}

/**
 * Get dynamic key-value setting from Neon Postgres.
 */
export async function getSettingFromDb<T>(key: string): Promise<T | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureDbInitialized();
    const rows = await sql.query('SELECT value FROM site_settings WHERE key = $1 LIMIT 1;', [key]);
    if (rows && rows.length > 0) {
      const val = (rows[0] as { value: any }).value;
      return typeof val === 'string' ? JSON.parse(val) : val;
    }
    return null;
  } catch (err) {
    console.error(`Failed to get setting ${key} from DB:`, err);
    return null;
  }
}

/**
 * Set dynamic key-value setting in Neon Postgres.
 */
export async function setSettingInDb<T>(key: string, value: T): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  try {
    await ensureDbInitialized();
    await sql.query(
      `
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = NOW();
      `,
      [key, JSON.stringify(value)]
    );
    return true;
  } catch (err) {
    console.error(`Failed to set setting ${key} in DB:`, err);
    return false;
  }
}


