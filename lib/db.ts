import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { SAMPLE_FILMS, type Film, type FilmPart, normalizeFilmParts } from '@/data/films';
import { SAMPLE_ARTICLES, type Article } from '@/data/articles';
import { DEFAULT_HOME_SETTINGS, type HomeSettings } from '@/data/homeSettings';
import { DEFAULT_ABOUT_SETTINGS, type AboutSettings } from '@/data/about';

/**
 * Automatically converts an unpooled Neon connection URL to a pooled connection URL (with -pooler)
 * to prevent exhausting Neon's free-tier connection limits and compute hours.
 */
export function toPooledConnectionString(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  if (rawUrl.includes('-pooler')) return rawUrl;

  // Replace Neon endpoint hostname ep-xxx.xxx.neon.tech with ep-xxx-pooler.xxx.neon.tech
  if (rawUrl.includes('.neon.tech')) {
    return rawUrl.replace(/@(ep-[a-zA-Z0-9-]+)(?!-pooler)\./, '@$1-pooler.');
  }
  return rawUrl;
}

function getDatabaseUrl(): string | undefined {
  const url =
    process.env.DATABASE_URL_POOLED ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  return toPooledConnectionString(url);
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

    await sql.query(`
      ALTER TABLE films ADD COLUMN IF NOT EXISTS parts JSONB DEFAULT '[]'::jsonb;
    `);

    await sql.query(`
      ALTER TABLE films ADD COLUMN IF NOT EXISTS image_fit TEXT DEFAULT 'contain';
    `);

    await sql.query(`
      ALTER TABLE films ADD COLUMN IF NOT EXISTS image_zoom INTEGER DEFAULT 100;
    `);

    await sql.query(`
      ALTER TABLE films ADD COLUMN IF NOT EXISTS image_pos_x INTEGER DEFAULT 50;
    `);

    await sql.query(`
      ALTER TABLE films ADD COLUMN IF NOT EXISTS image_pos_y INTEGER DEFAULT 50;
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

    // 4. Create home_settings table for dynamic homepage hero settings
    await sql.query(`
      CREATE TABLE IF NOT EXISTS home_settings (
        id TEXT PRIMARY KEY DEFAULT 'hero',
        badge_text TEXT DEFAULT 'پانتاییەک بۆ سینەما و ئەدەبی ئیسلامی',
        title TEXT DEFAULT 'شوێنێک بۆ فیلم و نووسینی ئیسلامی',
        subtitle TEXT DEFAULT 'ئەرشیفێکی کوردییە بۆ ناساندن و کۆکردنەوەی فیلم و ئەنیمەیشن، لەگەڵ خوێندنەوەی وتاری ئیسلامی و ناساندنی سەرچاوە پەروەردەییەکان.',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sql.query(`
      INSERT INTO home_settings (id, badge_text, title, subtitle)
      VALUES ('hero', 'پانتاییەک بۆ سینەما و ئەدەبی ئیسلامی', 'شوێنێک بۆ فیلم و نووسینی ئیسلامی', 'ئەرشیفێکی کوردییە بۆ ناساندن و کۆکردنەوەی فیلم و ئەنیمەیشن، لەگەڵ خوێندنەوەی وتاری ئیسلامی و ناساندنی سەرچاوە پەروەردەییەکان.')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 5. Create about_settings table for dynamic about page settings
    await sql.query(`
      CREATE TABLE IF NOT EXISTS about_settings (
        id TEXT PRIMARY KEY DEFAULT 'default',
        title TEXT DEFAULT 'دەربارەی پلاتفۆرم',
        paragraph_1 TEXT DEFAULT 'بەخێربێن؛ ئەم وێبسایتە دەستپێشخەرییەکی خۆبەخشانەیە بۆ ئەرشیفکردن و کۆکردنەوەی ئەو بەرهەم و وتار و فیلمە ناوازانەی بە زمانی کوردی لە سەرچاوە جیاوازەکاندا بڵاوکراونەتەوە، تا هەمووان بتوانن لە یەک شوێنی خاوێن و بێبەرامبەردا دەستیان پێیان بگات.',
        paragraph_2 TEXT DEFAULT 'سەرجەم مافە مەعنەوییەکانی بەرهەمەکان، ڤیدیۆکان و وەرگێڕانەکان بۆ کەناڵ و وەرگێڕ و خاوەنە ڕەسەنەکانیان پارێزراون. ئێمە تەنها ئەرکی ڕێکخستن و ئاسانکاریی گەیشتن بە ناوەرۆکەکان لە ئەستۆ دەگرین.',
        paragraph_3 TEXT DEFAULT 'بۆ هەر پێشنیار، تێبینی، یان داواکارییەکی لابردنی بەرهەم، دەتوانن لە ڕێگەی بەستەرەکانی خوارەوە پەیوەندیمان پێوە بکەن.',
        instagram_handle TEXT DEFAULT '@hamahang_bwn',
        instagram_url TEXT DEFAULT 'https://instagram.com/hamahang_bwn',
        telegram_handle TEXT DEFAULT '@mediay_islamy',
        telegram_url TEXT DEFAULT 'https://t.me/mediay_islamy',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sql.query(`
      INSERT INTO about_settings (
        id, title, paragraph_1, paragraph_2, paragraph_3,
        instagram_handle, instagram_url, telegram_handle, telegram_url
      ) VALUES (
        'default',
        'دەربارەی پلاتفۆرم',
        'بەخێربێن؛ ئەم وێبسایتە دەستپێشخەرییەکی خۆبەخشانەیە بۆ ئەرشیفکردن و کۆکردنەوەی ئەو بەرهەم و وتار و فیلمە ناوازانەی بە زمانی کوردی لە سەرچاوە جیاوازەکاندا بڵاوکراونەتەوە، تا هەمووان بتوانن لە یەک شوێنی خاوێن و بێبەرامبەردا دەستیان پێیان بگات.',
        'سەرجەم مافە مەعنەوییەکانی بەرهەمەکان، ڤیدیۆکان و وەرگێڕانەکان بۆ کەناڵ و وەرگێڕ و خاوەنە ڕەسەنەکانیان پارێزراون. ئێمە تەنها ئەرکی ڕێکخستن و ئاسانکاریی گەیشتن بە ناوەرۆکەکان لە ئەستۆ دەگرین.',
        'بۆ هەر پێشنیار، تێبینی، یان داواکارییەکی لابردنی بەرهەم، دەتوانن لە ڕێگەی بەستەرەکانی خوارەوە پەیوەندیمان پێوە بکەن.',
        '@hamahang_bwn',
        'https://instagram.com/hamahang_bwn',
        '@mediay_islamy',
        'https://t.me/mediay_islamy'
      ) ON CONFLICT (id) DO NOTHING;
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
  parts?: FilmPart[] | string | null;
  imageFit?: 'contain' | 'cover';
  imageZoom?: number | string | null;
  imagePosX?: number | string | null;
  imagePosY?: number | string | null;
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
        watch_url AS "watchUrl",
        parts,
        image_fit AS "imageFit",
        image_zoom AS "imageZoom",
        image_pos_x AS "imagePosX",
        image_pos_y AS "imagePosY"
      FROM films
      ORDER BY created_at DESC;
    `);

    return (rows as unknown as FilmDbRow[]).map((r) => {
      const activeUrl = r.watchUrl || r.telegramPostUrl || '';
      const activePlatform = r.platform || (activeUrl.includes('youtu') ? 'youtube' : 'telegram');
      let parsedParts: FilmPart[] = [];
      if (r.parts) {
        if (Array.isArray(r.parts)) {
          parsedParts = normalizeFilmParts(r.parts);
        } else if (typeof r.parts === 'string') {
          try {
            parsedParts = normalizeFilmParts(JSON.parse(r.parts));
          } catch {
            parsedParts = [];
          }
        }
      }

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
        parts: parsedParts,
        imageFit: (r.imageFit === 'cover' ? 'cover' : 'contain') as 'contain' | 'cover',
        imageZoom: typeof r.imageZoom === 'number' ? r.imageZoom : r.imageZoom ? Number(r.imageZoom) : 100,
        imagePosX: typeof r.imagePosX === 'number' ? r.imagePosX : r.imagePosX ? Number(r.imagePosX) : 50,
        imagePosY: typeof r.imagePosY === 'number' ? r.imagePosY : r.imagePosY ? Number(r.imagePosY) : 50,
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
        platform, watch_url, parts, image_fit, image_zoom, image_pos_x, image_pos_y, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
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
        parts = EXCLUDED.parts,
        image_fit = EXCLUDED.image_fit,
        image_zoom = EXCLUDED.image_zoom,
        image_pos_x = EXCLUDED.image_pos_x,
        image_pos_y = EXCLUDED.image_pos_y,
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
        JSON.stringify(film.parts ? normalizeFilmParts(film.parts) : []),
        film.imageFit || 'contain',
        film.imageZoom ?? 100,
        film.imagePosX ?? 50,
        film.imagePosY ?? 50,
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

/**
 * Get dynamic home hero settings from Neon Postgres.
 */
export async function getHomeSettingsFromDb(): Promise<HomeSettings | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureDbInitialized();
    const rows = await sql.query(`
      SELECT id, badge_text, title, subtitle, updated_at
      FROM home_settings
      WHERE id = 'hero'
      LIMIT 1;
    `);

    if (rows && rows.length > 0) {
      const row = rows[0] as {
        id?: string;
        badge_text?: string;
        title?: string;
        subtitle?: string;
        updated_at?: string;
      };
      return {
        id: row.id || 'hero',
        badgeText: row.badge_text ?? DEFAULT_HOME_SETTINGS.badgeText,
        title: row.title ?? DEFAULT_HOME_SETTINGS.title,
        subtitle: row.subtitle ?? DEFAULT_HOME_SETTINGS.subtitle,
        updatedAt: row.updated_at ? String(row.updated_at) : undefined,
      };
    }
    return null;
  } catch (err) {
    console.error('Failed to get home settings from DB:', err);
    return null;
  }
}

/**
 * Update dynamic home hero settings in Neon Postgres.
 */
export async function updateHomeSettingsInDb(settings: Partial<HomeSettings>): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  try {
    await ensureDbInitialized();
    const badgeText = settings.badgeText ?? DEFAULT_HOME_SETTINGS.badgeText;
    const title = settings.title ?? DEFAULT_HOME_SETTINGS.title;
    const subtitle = settings.subtitle ?? DEFAULT_HOME_SETTINGS.subtitle;

    await sql.query(
      `
      INSERT INTO home_settings (id, badge_text, title, subtitle, updated_at)
      VALUES ('hero', $1, $2, $3, NOW())
      ON CONFLICT (id) DO UPDATE SET
        badge_text = EXCLUDED.badge_text,
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        updated_at = NOW();
      `,
      [badgeText, title, subtitle]
    );
    return true;
  } catch (err) {
    console.error('Failed to update home settings in DB:', err);
    return false;
  }
}

/**
 * Get dynamic About page settings from Neon Postgres.
 */
export async function getAboutSettingsFromDb(): Promise<AboutSettings | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureDbInitialized();
    const rows = await sql.query(`
      SELECT id, title, paragraph_1, paragraph_2, paragraph_3,
             instagram_handle, instagram_url, telegram_handle, telegram_url, updated_at
      FROM about_settings
      WHERE id = 'default'
      LIMIT 1;
    `);

    if (rows && rows.length > 0) {
      const row = rows[0] as {
        id?: string;
        title?: string;
        paragraph_1?: string;
        paragraph_2?: string;
        paragraph_3?: string;
        instagram_handle?: string;
        instagram_url?: string;
        telegram_handle?: string;
        telegram_url?: string;
        updated_at?: string;
      };
      return {
        title: row.title ?? DEFAULT_ABOUT_SETTINGS.title,
        paragraph_1: row.paragraph_1 ?? DEFAULT_ABOUT_SETTINGS.paragraph_1,
        paragraph_2: row.paragraph_2 ?? DEFAULT_ABOUT_SETTINGS.paragraph_2,
        paragraph_3: row.paragraph_3 ?? DEFAULT_ABOUT_SETTINGS.paragraph_3,
        instagram_handle: row.instagram_handle ?? DEFAULT_ABOUT_SETTINGS.instagram_handle,
        instagram_url: row.instagram_url ?? DEFAULT_ABOUT_SETTINGS.instagram_url,
        telegram_handle: row.telegram_handle ?? DEFAULT_ABOUT_SETTINGS.telegram_handle,
        telegram_url: row.telegram_url ?? DEFAULT_ABOUT_SETTINGS.telegram_url,
      };
    }
    return null;
  } catch (err) {
    console.error('Failed to get about settings from DB:', err);
    return null;
  }
}

/**
 * Update dynamic About page settings in Neon Postgres.
 */
export async function updateAboutSettingsInDb(settings: Partial<AboutSettings>): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  try {
    await ensureDbInitialized();
    const title = settings.title ?? DEFAULT_ABOUT_SETTINGS.title;
    const paragraph_1 = settings.paragraph_1 ?? DEFAULT_ABOUT_SETTINGS.paragraph_1;
    const paragraph_2 = settings.paragraph_2 ?? DEFAULT_ABOUT_SETTINGS.paragraph_2;
    const paragraph_3 = settings.paragraph_3 ?? DEFAULT_ABOUT_SETTINGS.paragraph_3;
    const instagram_handle = settings.instagram_handle ?? DEFAULT_ABOUT_SETTINGS.instagram_handle;
    const instagram_url = settings.instagram_url ?? DEFAULT_ABOUT_SETTINGS.instagram_url;
    const telegram_handle = settings.telegram_handle ?? DEFAULT_ABOUT_SETTINGS.telegram_handle;
    const telegram_url = settings.telegram_url ?? DEFAULT_ABOUT_SETTINGS.telegram_url;

    await sql.query(
      `
      INSERT INTO about_settings (
        id, title, paragraph_1, paragraph_2, paragraph_3,
        instagram_handle, instagram_url, telegram_handle, telegram_url, updated_at
      ) VALUES ('default', $1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        paragraph_1 = EXCLUDED.paragraph_1,
        paragraph_2 = EXCLUDED.paragraph_2,
        paragraph_3 = EXCLUDED.paragraph_3,
        instagram_handle = EXCLUDED.instagram_handle,
        instagram_url = EXCLUDED.instagram_url,
        telegram_handle = EXCLUDED.telegram_handle,
        telegram_url = EXCLUDED.telegram_url,
        updated_at = NOW();
      `,
      [
        title,
        paragraph_1,
        paragraph_2,
        paragraph_3,
        instagram_handle,
        instagram_url,
        telegram_handle,
        telegram_url,
      ]
    );
    return true;
  } catch (err) {
    console.error('Failed to update about settings in DB:', err);
    return false;
  }
}


