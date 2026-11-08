import { promises as fs } from "fs";
import path from "path";
import { SAMPLE_FILMS, type Film, normalizeFilmParts } from "@/data/films";
import { SAMPLE_ARTICLES, type Article } from "@/data/articles";
import { DEFAULT_ABOUT_SETTINGS, type AboutSettings, DEFAULT_ABOUT_CONTENT, type AboutContent } from "@/data/about";
import { DEFAULT_HOME_SETTINGS, type HomeSettings } from "@/data/homeSettings";
import {
  getFilmsFromDb,
  upsertFilmToDb,
  deleteFilmFromDb,
  getArticlesFromDb,
  upsertArticleToDb,
  deleteArticleFromDb,
  getSettingFromDb,
  setSettingInDb,
  getHomeSettingsFromDb,
  updateHomeSettingsInDb,
  getAboutSettingsFromDb,
  updateAboutSettingsInDb,
} from "./db";

const dataDir = path.join(process.cwd(), "data");
const filmsFilePath = path.join(dataDir, "films.json");
const articlesFilePath = path.join(dataDir, "articles.json");
const aboutFilePath = path.join(dataDir, "about.json");
const homeSettingsFilePath = path.join(dataDir, "home_settings.json");

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
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((f: Record<string, unknown>) => ({
        ...f,
        parts: f.parts ? normalizeFilmParts(f.parts) : undefined,
      })) as unknown as Film[];
    }
    return SAMPLE_FILMS;
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

/**
 * Normalizes any raw parsed JSON into valid AboutSettings with fallbacks.
 */
function normalizeAboutSettings(parsed: any): AboutSettings {
  if (!parsed || typeof parsed !== "object") return DEFAULT_ABOUT_SETTINGS;
  return {
    title: parsed.title || DEFAULT_ABOUT_SETTINGS.title,
    paragraph_1: parsed.paragraph_1 || parsed.subtitle || DEFAULT_ABOUT_SETTINGS.paragraph_1,
    paragraph_2: parsed.paragraph_2 || parsed.missionText || DEFAULT_ABOUT_SETTINGS.paragraph_2,
    paragraph_3: parsed.paragraph_3 || (Array.isArray(parsed.features) && parsed.features[0]?.desc) || DEFAULT_ABOUT_SETTINGS.paragraph_3,
    instagram_handle: parsed.instagram_handle || DEFAULT_ABOUT_SETTINGS.instagram_handle,
    instagram_url: parsed.instagram_url || DEFAULT_ABOUT_SETTINGS.instagram_url,
    telegram_handle: parsed.telegram_handle || DEFAULT_ABOUT_SETTINGS.telegram_handle,
    telegram_url: parsed.telegram_url || DEFAULT_ABOUT_SETTINGS.telegram_url,
  };
}

/**
 * Reads local backup for About settings.
 */
export async function readLocalAbout(): Promise<AboutSettings> {
  try {
    await ensureDirectory();
    try {
      await fs.access(aboutFilePath);
    } catch {
      await fs.writeFile(aboutFilePath, JSON.stringify(DEFAULT_ABOUT_SETTINGS, null, 2), "utf-8");
      return DEFAULT_ABOUT_SETTINGS;
    }

    const data = await fs.readFile(aboutFilePath, "utf-8");
    if (!data.trim()) return DEFAULT_ABOUT_SETTINGS;
    const parsed = JSON.parse(data);
    return normalizeAboutSettings(parsed);
  } catch (error) {
    console.error("Error reading local about backup:", error);
    return DEFAULT_ABOUT_SETTINGS;
  }
}

/**
 * Writes local backup for About settings.
 */
export async function writeLocalAbout(content: AboutSettings): Promise<void> {
  try {
    await ensureDirectory();
    await fs.writeFile(aboutFilePath, JSON.stringify(content, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing local about backup:", error);
  }
}

/**
 * Reads About settings actively from Neon Postgres (about_settings table), falling back to local file.
 */
export async function readAboutSettings(): Promise<AboutSettings> {
  try {
    const dbAbout = await getAboutSettingsFromDb();
    if (dbAbout && typeof dbAbout === "object" && dbAbout.title) {
      writeLocalAbout(dbAbout).catch(() => {});
      return { ...DEFAULT_ABOUT_SETTINGS, ...dbAbout };
    }
  } catch (err) {
    console.error("Neon DB readAboutSettings error, falling back to local file:", err);
  }

  return await readLocalAbout();
}

/**
 * Saves About settings to Neon Postgres and updates local backup.
 */
export async function saveAboutSettings(content: AboutSettings): Promise<boolean> {
  await writeLocalAbout(content);
  try {
    const dbUpdated = await updateAboutSettingsInDb(content);
    // Also mirror to site_settings for maximum redundancy
    await setSettingInDb("about_settings", content).catch(() => {});
    return dbUpdated;
  } catch (err) {
    console.error("Failed to sync about settings to Neon DB:", err);
    return false;
  }
}

// Aliases for compatibility
export const readAboutContent = readAboutSettings;
export const saveAboutContent = saveAboutSettings;

/**
 * Reads local backup for Homepage Hero settings.
 */
export async function readLocalHomeSettings(): Promise<HomeSettings> {
  try {
    await ensureDirectory();
    try {
      await fs.access(homeSettingsFilePath);
    } catch {
      await fs.writeFile(homeSettingsFilePath, JSON.stringify(DEFAULT_HOME_SETTINGS, null, 2), "utf-8");
      return DEFAULT_HOME_SETTINGS;
    }

    const data = await fs.readFile(homeSettingsFilePath, "utf-8");
    if (!data.trim()) return DEFAULT_HOME_SETTINGS;
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === "object" ? { ...DEFAULT_HOME_SETTINGS, ...parsed } : DEFAULT_HOME_SETTINGS;
  } catch (error) {
    console.error("Error reading local home settings backup:", error);
    return DEFAULT_HOME_SETTINGS;
  }
}

/**
 * Writes local backup for Homepage Hero settings.
 */
export async function writeLocalHomeSettings(settings: HomeSettings): Promise<void> {
  try {
    await ensureDirectory();
    await fs.writeFile(homeSettingsFilePath, JSON.stringify(settings, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing local home settings backup:", error);
  }
}

/**
 * Reads Homepage Hero settings actively from Neon Postgres, falling back to local file.
 */
export async function readHomeSettings(): Promise<HomeSettings> {
  try {
    const dbSettings = await getHomeSettingsFromDb();
    if (dbSettings && typeof dbSettings === "object" && dbSettings.title) {
      writeLocalHomeSettings(dbSettings).catch(() => {});
      return { ...DEFAULT_HOME_SETTINGS, ...dbSettings };
    }
  } catch (err) {
    console.error("Neon DB readHomeSettings error, falling back to local file:", err);
  }

  return await readLocalHomeSettings();
}

/**
 * Saves Homepage Hero settings to Neon Postgres and updates local backup.
 */
export async function saveHomeSettings(settings: HomeSettings): Promise<boolean> {
  await writeLocalHomeSettings(settings);
  try {
    return await updateHomeSettingsInDb(settings);
  } catch (err) {
    console.error("Failed to sync home settings to Neon DB:", err);
    return false;
  }
}

