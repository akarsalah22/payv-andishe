import { promises as fs } from "fs";
import path from "path";
import { SAMPLE_FILMS, type Film } from "@/data/films";
import { SAMPLE_ARTICLES, type Article } from "@/data/articles";

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

export async function readFilms(): Promise<Film[]> {
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
    console.error("Error reading films:", error);
    return SAMPLE_FILMS;
  }
}

export async function writeFilms(films: Film[]): Promise<void> {
  await ensureDirectory();
  await fs.writeFile(filmsFilePath, JSON.stringify(films, null, 2), "utf-8");
}

export async function readArticles(): Promise<Article[]> {
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
    console.error("Error reading articles:", error);
    return SAMPLE_ARTICLES;
  }
}

export async function writeArticles(articles: Article[]): Promise<void> {
  await ensureDirectory();
  await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), "utf-8");
}
