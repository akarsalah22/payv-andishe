import { promises as fs } from "fs";
import path from "path";
import { SAMPLE_FILMS, type Film } from "@/data/films";
import { SAMPLE_ARTICLES, type Article } from "@/data/articles";
import {
  getFilmsFromDb,
  upsertFilmToDb,
  deleteFilmFromDb,
  getArticlesFromDb,
  upsertArticleToDb,
  deleteArticleFromDb,
} from "./db";

const dataDir = path.join(process.cwd(), "data");
const filmsFilePath = path.join(dataDir, "films.json");
const articlesFilePath = path.join(dataDir, "articles.json");

async function ensureDirectory() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch {
    // ignore
  }
}

async function readLocalFilms(): Promise<Film[]> {
  try {
    await ensureDirectory();
    try {
      await fs.access(filmsFilePath);
    } catch {
      await fs.writeFile(filmsFilePath, JSON.stringify(SAMPLE_FILMS, null, 2), "utf-8");
      return SAMPLE_FILMS;
    }

    const data = await fs.readFile(filmsFilePath, "utf-8");
    if (!data.trim()) return SAMPLE_FILMS;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_FILMS;
  } catch (error) {
    console.error("Error reading local films backup:", error);
    return SAMPLE_FILMS;
  }
}

async function writeLocalFilms(films: Film[]): Promise<void> {
  try {
    await ensureDirectory();
    await fs.writeFile(filmsFilePath, JSON.stringify(films, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing local films backup:", error);
  }
}

async function readLocalArticles(): Promise<Article[]> {
  try {
    await ensureDirectory();
    try {
      await fs.access(articlesFilePath);
    } catch {
      await fs.writeFile(articlesFilePath, JSON.stringify(SAMPLE_ARTICLES, null, 2), "utf-8");
      return SAMPLE_ARTICLES;
    }

    const data = await fs.readFile(articlesFilePath, "utf-8");
    if (!data.trim()) return SAMPLE_ARTICLES;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_ARTICLES;
  } catch (error) {
    console.error("Error reading local articles backup:", error);
    return SAMPLE_ARTICLES;
  }
}

async function writeLocalArticles(articles: Article[]): Promise<void> {
  try {
    await ensureDirectory();
    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing local articles backup:", error);
  }
}

/**
 * Reads films actively from Neon Postgres database, falling back to local storage if DB is unreachable.
 */
export async function readFilms(): Promise<Film[]> {
  try {
    const dbFilms = await getFilmsFromDb();
    if (dbFilms && Array.isArray(dbFilms) && dbFilms.length > 0) {
      // Async background update to local backup
      writeLocalFilms(dbFilms).catch(() => {});
      return dbFilms;
    }
  } catch (err) {
    console.error("Neon DB readFilms error, falling back to local file:", err);
  }

  return await readLocalFilms();
}

/**
 * Saves films collection to Neon Postgres database and local storage.
 */
export async function writeFilms(films: Film[]): Promise<void> {
  await writeLocalFilms(films);

  for (const film of films) {
    try {
      await upsertFilmToDb(film);
    } catch (err) {
      console.error(`Failed to sync film ${film.id} to Neon DB:`, err);
    }
  }
}

/**
 * Saves a single film to Neon Postgres and updates local cache.
 */
export async function saveSingleFilm(film: Film): Promise<boolean> {
  const dbSuccess = await upsertFilmToDb(film);

  try {
    const localFilms = await readLocalFilms();
    const existingIndex = localFilms.findIndex((f) => f.id === film.id);
    let updated: Film[];
    if (existingIndex >= 0) {
      updated = [...localFilms];
      updated[existingIndex] = film;
    } else {
      updated = [film, ...localFilms];
    }
    await writeLocalFilms(updated);
  } catch {
    // ignore local cache error
  }

  return dbSuccess;
}

/**
 * Deletes a single film from Neon Postgres and updates local cache.
 */
export async function removeSingleFilm(id: string): Promise<boolean> {
  const dbSuccess = await deleteFilmFromDb(id);

  try {
    const localFilms = await readLocalFilms();
    const updated = localFilms.filter((f) => f.id !== id);
    await writeLocalFilms(updated);
  } catch {
    // ignore
  }

  return dbSuccess;
}

/**
 * Reads articles actively from Neon Postgres database, falling back to local storage if DB is unreachable.
 */
export async function readArticles(): Promise<Article[]> {
  try {
    const dbArticles = await getArticlesFromDb();
    if (dbArticles && Array.isArray(dbArticles) && dbArticles.length > 0) {
      // Async background update to local backup
      writeLocalArticles(dbArticles).catch(() => {});
      return dbArticles;
    }
  } catch (err) {
    console.error("Neon DB readArticles error, falling back to local file:", err);
  }

  return await readLocalArticles();
}

/**
 * Saves articles collection to Neon Postgres database and local storage.
 */
export async function writeArticles(articles: Article[]): Promise<void> {
  await writeLocalArticles(articles);

  for (const article of articles) {
    try {
      await upsertArticleToDb(article);
    } catch (err) {
      console.error(`Failed to sync article ${article.id} to Neon DB:`, err);
    }
  }
}

/**
 * Saves a single article to Neon Postgres and updates local cache.
 */
export async function saveSingleArticle(article: Article): Promise<boolean> {
  const dbSuccess = await upsertArticleToDb(article);

  try {
    const localArticles = await readLocalArticles();
    const existingIndex = localArticles.findIndex((a) => a.id === article.id);
    let updated: Article[];
    if (existingIndex >= 0) {
      updated = [...localArticles];
      updated[existingIndex] = article;
    } else {
      updated = [article, ...localArticles];
    }
    await writeLocalArticles(updated);
  } catch {
    // ignore
  }

  return dbSuccess;
}

/**
 * Deletes a single article from Neon Postgres and updates local cache.
 */
export async function removeSingleArticle(id: string): Promise<boolean> {
  const dbSuccess = await deleteArticleFromDb(id);

  try {
    const localArticles = await readLocalArticles();
    const updated = localArticles.filter((a) => a.id !== id);
    await writeLocalArticles(updated);
  } catch {
    // ignore
  }

  return dbSuccess;
}
