"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  BookOpen,
  Trash2,
  ExternalLink,
  Eye,
  RefreshCw,
  LogOut,
  X,
  Clapperboard,
  Upload,
  Pencil,
  Search,
  ShieldCheck,
  Copy,
  Info,
  Sparkles,
  Check,
  RotateCcw,
  Sliders,
  Maximize2,
  Crop,
  Move,
  Film as FilmIcon,
  FileText,
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';
import { SAMPLE_FILMS, type Film, type FilmCategory, type FilmPlatform, type FilmPart, normalizeFilmParts, toKurdishNumber } from '@/data/films';
import { SAMPLE_ARTICLES, type Article, type ArticleCategory } from '@/data/articles';
import { DEFAULT_ABOUT_SETTINGS, type AboutSettings } from '@/data/about';
import { DEFAULT_HOME_SETTINGS, type HomeSettings } from '@/data/homeSettings';
import {
  DEFAULT_MOVIES_PAGE_SETTINGS,
  type MoviesPageSettings,
  DEFAULT_WRITINGS_PAGE_SETTINGS,
  type WritingsPageSettings,
} from '@/data/pageSettings';
import { FilmCard } from '@/components/FilmCard';
import { TelegramIcon } from '@/components/TelegramIcon';
import { InstagramIcon } from '@/components/InstagramIcon';
import { YouTubeIcon } from '@/components/YouTubeIcon';
import { ArticleCard } from '@/components/ArticleCard';
import { matchesSearchQuery } from '@/lib/search';

type AdminTab = 'films' | 'articles' | 'about' | 'home' | 'moviesPage' | 'writingsPage' | 'create';
type CreateItemType = 'film' | 'article';

export function AdminDashboardClient() {
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    try {
      sessionStorage.removeItem("admin_auth");
      sessionStorage.removeItem("mediay_islamy_admin_session");
      sessionStorage.removeItem("mediay_islamy_admin_auth");
      sessionStorage.removeItem("payvandishe_admin_session");
      sessionStorage.removeItem("payvandishe_admin_auth");
      localStorage.removeItem("admin_auth");
    } catch {
      // ignore
    }
    window.location.href = '/admin';
  };
  // Tab Navigation & Edit Modes
  const [activeTab, setActiveTab] = useState<AdminTab>('films');
  const [createType, setCreateType] = useState<CreateItemType>('film');
  const [editingFilmId, setEditingFilmId] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isFilmSubmitting, setIsFilmSubmitting] = useState<boolean>(false);
  const [isArticleSubmitting, setIsArticleSubmitting] = useState<boolean>(false);

  // Search Queries for Lists
  const [filmsSearchQuery, setFilmsSearchQuery] = useState<string>('');
  const [articlesSearchQuery, setArticlesSearchQuery] = useState<string>('');

  // Toast Notification Hook
  const { showToast } = useToast();

  // Persistent Collections
  const [films, setFilms] = useState<Film[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // Film Form State
  const [filmTitleKurdish, setFilmTitleKurdish] = useState('');
  const [filmOriginalTitle, setFilmOriginalTitle] = useState('');
  const [filmCategory, setFilmCategory] = useState<FilmCategory>('فیلم');
  const [filmGenres, setFilmGenres] = useState('دراما، سینەما');
  const [filmYear, setFilmYear] = useState<number>(new Date().getFullYear());
  const [filmDuration, setFilmDuration] = useState('١ کاتژمێر و ٥٠ خولەک');
  const [filmPosterUrl, setFilmPosterUrl] = useState('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80');
  const [filmImageFit, setFilmImageFit] = useState<'contain' | 'cover'>('contain');
  const [filmImageZoom, setFilmImageZoom] = useState<number>(100);
  const [filmImagePosX, setFilmImagePosX] = useState<number>(50);
  const [filmImagePosY, setFilmImagePosY] = useState<number>(50);
  const [filmPlatform, setFilmPlatform] = useState<FilmPlatform>('telegram');
  const [filmTelegramUrl, setFilmTelegramUrl] = useState('https://t.me/mediay_islamy');
  const [filmDescription, setFilmDescription] = useState('');
  const [filmParts, setFilmParts] = useState<FilmPart[]>([]);

  // Article Form State
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [articleCategory, setArticleCategory] = useState<ArticleCategory>('ئایەت');
  const [articleReadTime, setArticleReadTime] = useState('٥ خولەک خوێندنەوە');
  const [articleCoverImage, setArticleCoverImage] = useState('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('میدیای ئیسلامی');
  const [articlePdfUrl, setArticlePdfUrl] = useState('');
  const [articleExternalUrl, setArticleExternalUrl] = useState('');

  // About Page Form State
  const [aboutTitle, setAboutTitle] = useState(DEFAULT_ABOUT_SETTINGS.title);
  const [aboutParagraph1, setAboutParagraph1] = useState(DEFAULT_ABOUT_SETTINGS.paragraph_1);
  const [aboutParagraph2, setAboutParagraph2] = useState(DEFAULT_ABOUT_SETTINGS.paragraph_2);
  const [aboutParagraph3, setAboutParagraph3] = useState(DEFAULT_ABOUT_SETTINGS.paragraph_3);
  const [aboutInstagramHandle, setAboutInstagramHandle] = useState(DEFAULT_ABOUT_SETTINGS.instagram_handle);
  const [aboutInstagramUrl, setAboutInstagramUrl] = useState(DEFAULT_ABOUT_SETTINGS.instagram_url);
  const [aboutTelegramHandle, setAboutTelegramHandle] = useState(DEFAULT_ABOUT_SETTINGS.telegram_handle);
  const [aboutTelegramUrl, setAboutTelegramUrl] = useState(DEFAULT_ABOUT_SETTINGS.telegram_url);
  const [isAboutSubmitting, setIsAboutSubmitting] = useState(false);
  const [isAboutLoading, setIsAboutLoading] = useState(false);

  // Home Hero Settings Form State
  const [homeBadgeText, setHomeBadgeText] = useState(DEFAULT_HOME_SETTINGS.badgeText);
  const [homeTitle, setHomeTitle] = useState(DEFAULT_HOME_SETTINGS.title);
  const [homeSubtitle, setHomeSubtitle] = useState(DEFAULT_HOME_SETTINGS.subtitle);
  const [isHomeSubmitting, setIsHomeSubmitting] = useState(false);
  const [isHomeLoading, setIsHomeLoading] = useState(false);

  // Movies Page Settings Form State
  const [moviesBadge, setMoviesBadge] = useState(DEFAULT_MOVIES_PAGE_SETTINGS.badge);
  const [moviesTitle, setMoviesTitle] = useState(DEFAULT_MOVIES_PAGE_SETTINGS.title);
  const [moviesSubtitle, setMoviesSubtitle] = useState(DEFAULT_MOVIES_PAGE_SETTINGS.subtitle);
  const [moviesSearchPlaceholder, setMoviesSearchPlaceholder] = useState(DEFAULT_MOVIES_PAGE_SETTINGS.searchPlaceholder);
  const [moviesEmptyMessage, setMoviesEmptyMessage] = useState(DEFAULT_MOVIES_PAGE_SETTINGS.emptyMessage);
  const [isMoviesSubmitting, setIsMoviesSubmitting] = useState(false);
  const [isMoviesLoading, setIsMoviesLoading] = useState(false);

  // Writings Page Settings Form State
  const [writingsBadge, setWritingsBadge] = useState(DEFAULT_WRITINGS_PAGE_SETTINGS.badge);
  const [writingsTitle, setWritingsTitle] = useState(DEFAULT_WRITINGS_PAGE_SETTINGS.title);
  const [writingsSubtitle, setWritingsSubtitle] = useState(DEFAULT_WRITINGS_PAGE_SETTINGS.subtitle);
  const [writingsSearchPlaceholder, setWritingsSearchPlaceholder] = useState(DEFAULT_WRITINGS_PAGE_SETTINGS.searchPlaceholder);
  const [writingsEmptyMessage, setWritingsEmptyMessage] = useState(DEFAULT_WRITINGS_PAGE_SETTINGS.emptyMessage);
  const [isWritingsSubmitting, setIsWritingsSubmitting] = useState(false);
  const [isWritingsLoading, setIsWritingsLoading] = useState(false);

  // Fetch films from API and synchronize with localStorage
  const fetchFilms = async () => {
    try {
      const res = await fetch('/api/films');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFilms(data);
          try {
            localStorage.setItem('mediay_islamy_films', JSON.stringify(data));
          } catch {
            // ignore
          }
          return;
        }
      }
    } catch (e) {
      console.error('Error fetching films from API:', e);
    }

    try {
      const storedFilms = localStorage.getItem('mediay_islamy_films') || localStorage.getItem('payvandishe_films');
      if (storedFilms) {
        setFilms(JSON.parse(storedFilms));
      } else {
        setFilms(SAMPLE_FILMS);
        localStorage.setItem('mediay_islamy_films', JSON.stringify(SAMPLE_FILMS));
      }
    } catch {
      setFilms(SAMPLE_FILMS);
    }
  };

  // Fetch articles from API and synchronize with localStorage
  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
          try {
            localStorage.setItem('mediay_islamy_articles', JSON.stringify(data));
          } catch {
            // ignore
          }
          return;
        }
      }
    } catch (e) {
      console.error('Error fetching articles from API:', e);
    }

    try {
      const storedArticles = localStorage.getItem('mediay_islamy_articles') || localStorage.getItem('payvandishe_articles');
      if (storedArticles) {
        setArticles(JSON.parse(storedArticles));
      } else {
        setArticles(SAMPLE_ARTICLES);
        localStorage.setItem('mediay_islamy_articles', JSON.stringify(SAMPLE_ARTICLES));
      }
    } catch {
      setArticles(SAMPLE_ARTICLES);
    }
  };

  // Fetch About page content from API
  const fetchAbout = async () => {
    setIsAboutLoading(true);
    try {
      const res = await fetch('/api/about');
      if (res.ok) {
        const data: AboutSettings = await res.json();
        if (data && data.title) {
          setAboutTitle(data.title || DEFAULT_ABOUT_SETTINGS.title);
          setAboutParagraph1(data.paragraph_1 || DEFAULT_ABOUT_SETTINGS.paragraph_1);
          setAboutParagraph2(data.paragraph_2 || DEFAULT_ABOUT_SETTINGS.paragraph_2);
          setAboutParagraph3(data.paragraph_3 || DEFAULT_ABOUT_SETTINGS.paragraph_3);
          setAboutInstagramHandle(data.instagram_handle || DEFAULT_ABOUT_SETTINGS.instagram_handle);
          setAboutInstagramUrl(data.instagram_url || DEFAULT_ABOUT_SETTINGS.instagram_url);
          setAboutTelegramHandle(data.telegram_handle || DEFAULT_ABOUT_SETTINGS.telegram_handle);
          setAboutTelegramUrl(data.telegram_url || DEFAULT_ABOUT_SETTINGS.telegram_url);
        }
      }
    } catch (e) {
      console.error('Error fetching about settings:', e);
    } finally {
      setIsAboutLoading(false);
    }
  };

  // Fetch Home page hero settings from API
  const fetchHome = async () => {
    setIsHomeLoading(true);
    try {
      const res = await fetch('/api/settings/home');
      if (res.ok) {
        const data: HomeSettings = await res.json();
        if (data) {
          if (data.badgeText) setHomeBadgeText(data.badgeText);
          if (data.title) setHomeTitle(data.title);
          if (data.subtitle) setHomeSubtitle(data.subtitle);
        }
      }
    } catch (e) {
      console.error('Error fetching home settings:', e);
    } finally {
      setIsHomeLoading(false);
    }
  };

  // Fetch Movies page settings from API
  const fetchMoviesSettings = async () => {
    setIsMoviesLoading(true);
    try {
      const res = await fetch('/api/settings/movies');
      if (res.ok) {
        const data: MoviesPageSettings = await res.json();
        if (data) {
          if (data.badge) setMoviesBadge(data.badge);
          if (data.title) setMoviesTitle(data.title);
          if (data.subtitle) setMoviesSubtitle(data.subtitle);
          if (data.searchPlaceholder) setMoviesSearchPlaceholder(data.searchPlaceholder);
          if (data.emptyMessage) setMoviesEmptyMessage(data.emptyMessage);
        }
      }
    } catch (e) {
      console.error('Error fetching movies settings:', e);
    } finally {
      setIsMoviesLoading(false);
    }
  };

  // Fetch Writings page settings from API
  const fetchWritingsSettings = async () => {
    setIsWritingsLoading(true);
    try {
      const res = await fetch('/api/settings/writings');
      if (res.ok) {
        const data: WritingsPageSettings = await res.json();
        if (data) {
          if (data.badge) setWritingsBadge(data.badge);
          if (data.title) setWritingsTitle(data.title);
          if (data.subtitle) setWritingsSubtitle(data.subtitle);
          if (data.searchPlaceholder) setWritingsSearchPlaceholder(data.searchPlaceholder);
          if (data.emptyMessage) setWritingsEmptyMessage(data.emptyMessage);
        }
      }
    } catch (e) {
      console.error('Error fetching writings settings:', e);
    } finally {
      setIsWritingsLoading(false);
    }
  };

  // Initial load of data from disk API
  useEffect(() => {
    fetchFilms();
    fetchArticles();
    fetchAbout();
    fetchHome();
    fetchMoviesSettings();
    fetchWritingsSettings();
  }, []);

  // Sync films to localStorage
  const saveFilmsToStorage = (updatedFilms: Film[]) => {
    setFilms(updatedFilms);
    try {
      localStorage.setItem('mediay_islamy_films', JSON.stringify(updatedFilms));
    } catch (e) {
      console.error('Error saving films:', e);
    }
  };

  // Sync articles to localStorage
  const saveArticlesToStorage = (updatedArticles: Article[]) => {
    setArticles(updatedArticles);
    try {
      localStorage.setItem('mediay_islamy_articles', JSON.stringify(updatedArticles));
    } catch (e) {
      console.error('Error saving articles:', e);
    }
  };

  // Auto-generate slug from title
  const handleTitleChangeForSlug = (title: string) => {
    setArticleTitle(title);
    if (!articleSlug || articleSlug === generateSlug(articleTitle)) {
      setArticleSlug(generateSlug(title));
    }
  };

  const generateSlug = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;
  };

  // Toast trigger (Concise & Dignified Kurdish Feedback)
  const triggerToast = (
    msg: string,
    link?: { href: string; label: string },
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    showToast(msg, { link, type });
  };

  // Copy Link Helper
  const handleCopyLink = async (url: string) => {
    try {
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
      triggerToast('بەستەر کۆپی کرا', undefined, 'success');
    } catch {
      triggerToast('کردارەکە سەرکەوتوو نەبوو، دووبارە هەوڵبدەرەوە', undefined, 'error');
    }
  };

  // Handle local image file upload & compression
  const handleFileUpload = (
    file: File,
    onSuccess: (dataUrl: string) => void
  ) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      triggerToast('تکایە تەنها فایلی وێنە هەڵبژێرە', undefined, 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          onSuccess(compressedDataUrl);
        } else {
          onSuccess(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Reset to default data
  const handleResetDefaults = () => {
    if (window.confirm('ئایا دڵنیایت لە گەڕاندنەوەی سەرجەم داتاکان بۆ دۆخی سەرەتایی بنەڕەت؟ هەموو گۆڕانکارییەکان دەسڕێنەوە.')) {
      saveFilmsToStorage(SAMPLE_FILMS);
      saveArticlesToStorage(SAMPLE_ARTICLES);
      setEditingFilmId(null);
      setEditingArticle(null);
      resetFilmForm();
      resetArticleForm();
      triggerToast('سەرجەم داتاکان بۆ دۆخی سەرەتایی گەڕێندرانەوە', undefined, 'info');
    }
  };

  const handleResetFilmFraming = () => {
    setFilmImageFit('contain');
    setFilmImageZoom(100);
    setFilmImagePosX(50);
    setFilmImagePosY(50);
  };

  // Reset Form States
  const resetFilmForm = () => {
    setFilmTitleKurdish('');
    setFilmOriginalTitle('');
    setFilmCategory('فیلم');
    setFilmGenres('دراما، سینەما');
    setFilmYear(new Date().getFullYear());
    setFilmDuration('١ کاتژمێر و ٥٠ خولەک');
    setFilmPosterUrl('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80');
    setFilmImageFit('contain');
    setFilmImageZoom(100);
    setFilmImagePosX(50);
    setFilmImagePosY(50);
    setFilmPlatform('telegram');
    setFilmTelegramUrl('https://t.me/mediay_islamy');
    setFilmDescription('');
    setFilmParts([]);
  };

  // Multi-Part Handlers
  const handleAddFilmPart = () => {
    const nextNum = filmParts.length + 1;
    setFilmParts((prev) => [
      ...prev,
      {
        partNumber: nextNum,
        title: `بەشی ${toKurdishNumber(nextNum)}`,
        telegramUrl: '',
        youtubeUrl: '',
        duration: '',
      },
    ]);
  };

  const handleRemoveFilmPart = (index: number) => {
    setFilmParts((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((p, i) => ({
        ...p,
        partNumber: i + 1,
      }));
    });
  };

  const handleFilmPartChange = (index: number, field: keyof FilmPart, value: string) => {
    setFilmParts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const resetArticleForm = () => {
    setArticleTitle('');
    setArticleSlug('');
    setArticleCategory('ئایەت');
    setArticleReadTime('٥ خولەک خوێندنەوە');
    setArticleCoverImage('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80');
    setArticleExcerpt('');
    setArticleContent('');
    setArticleAuthor('میدیای ئیسلامی');
    setArticlePdfUrl('');
    setArticleExternalUrl('');
  };

  // Start Editing Film
  const handleStartEditFilm = (film: Film) => {
    setEditingFilmId(film.id);
    setEditingArticle(null);
    setCreateType('film');
    setFilmTitleKurdish(film.titleKurdish);
    setFilmOriginalTitle(film.originalTitle || '');
    setFilmCategory(film.category);
    setFilmGenres(film.genres ? film.genres.join('، ') : '');
    setFilmYear(film.year);
    setFilmDuration(film.duration);
    setFilmPosterUrl(film.posterUrl);
    setFilmImageFit(film.imageFit || 'contain');
    setFilmImageZoom(film.imageZoom ?? 100);
    setFilmImagePosX(film.imagePosX ?? 50);
    setFilmImagePosY(film.imagePosY ?? 50);
    const link = film.watchUrl || film.telegramPostUrl || '';
    const platform = film.platform || (link.includes('youtu') ? 'youtube' : 'telegram');
    setFilmPlatform(platform);
    setFilmTelegramUrl(link);
    setFilmDescription(film.description);
    setFilmParts(film.parts && Array.isArray(film.parts) ? normalizeFilmParts(film.parts) : []);
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Editing Film
  const handleCancelEditFilm = () => {
    setEditingFilmId(null);
    resetFilmForm();
    setActiveTab('films');
  };

  // Save (Create or Update) Film
  const handleSaveFilm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filmTitleKurdish.trim() || !filmTelegramUrl.trim()) {
      triggerToast('تکایە ناوی فیلم و بەستەری بینین بنووسە', undefined, 'error');
      return;
    }

    const genreList = filmGenres
      .split(/[,،]/)
      .map((g) => g.trim())
      .filter(Boolean);

    const isEditMode = Boolean(editingFilmId);
    const method = isEditMode ? 'PUT' : 'POST';

    const sanitizedParts: FilmPart[] = filmParts
      .filter(
        (p) =>
          (p.title && p.title.trim()) ||
          (p.telegramUrl && p.telegramUrl.trim()) ||
          (p.youtubeUrl && p.youtubeUrl.trim())
      )
      .map((p, idx) => ({
        partNumber: idx + 1,
        title: p.title?.trim() || `بەشی ${toKurdishNumber(idx + 1)}`,
        telegramUrl: p.telegramUrl?.trim() || undefined,
        youtubeUrl: p.youtubeUrl?.trim() || undefined,
        duration: p.duration?.trim() || undefined,
        url: p.telegramUrl?.trim() || p.youtubeUrl?.trim() || p.url || '',
      }));

    const payload: Film = {
      id: editingFilmId || `film-${Date.now()}`,
      slug: generateSlug(filmTitleKurdish),
      titleKurdish: filmTitleKurdish.trim(),
      originalTitle: filmOriginalTitle.trim() || filmTitleKurdish.trim(),
      year: Number(filmYear) || 2024,
      duration: filmDuration.trim() || '٢ کاتژمێر',
      category: filmCategory,
      genres: genreList.length > 0 ? genreList : ['سینەما'],
      posterUrl:
        filmPosterUrl.trim() ||
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      description: filmDescription.trim() || 'ناساندنی ئەم شاکارە سینەمایییە.',
      platform: filmPlatform,
      watchUrl: filmTelegramUrl.trim(),
      telegramPostUrl: filmTelegramUrl.trim(),
      parts: sanitizedParts,
      imageFit: filmImageFit,
      imageZoom: filmImageZoom,
      imagePosX: filmImagePosX,
      imagePosY: filmImagePosY,
    };

    setIsFilmSubmitting(true);
    try {
      const res = await fetch('/api/films', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchFilms();
        setEditingFilmId(null);
        resetFilmForm();
        triggerToast(
          isEditMode ? 'زانیارییەکانی فیلم نوێکرانەوە' : 'فیلمەکە بە سەرکەوتوویی لە بنکەدراوە زیاد کرا',
          {
            href: '/films',
            label: 'بینینی بابەت',
          },
          'success'
        );
        setActiveTab('films');
        return;
      } else {
        const errorData = await res.json().catch(() => null);
        triggerToast(
          errorData?.error || 'تۆمارکردن لە سێرڤەر سەرکەوتوو نەبوو، دووبارە هەوڵبدەرەوە',
          undefined,
          'error'
        );
      }
    } catch (err) {
      console.error('Error saving film via API:', err);
      triggerToast('هەڵەیەک لە پەیوەندی بە سێرڤەر ڕوویدا', undefined, 'error');
    } finally {
      setIsFilmSubmitting(false);
    }
  };

  // Start Editing Article
  const handleStartEditArticle = (article: Article) => {
    setEditingArticle(article);
    setEditingFilmId(null);
    setCreateType('article');
    setArticleTitle(article.title);
    setArticleSlug(article.slug);
    setArticleCategory(article.category);
    setArticleReadTime(article.readTime);
    setArticleCoverImage(article.coverImage || article.imageUrl || '');
    setArticleExcerpt(article.excerpt);
    setArticleContent(Array.isArray(article.content) ? article.content.join('\n\n') : (article.content || ''));
    setArticleAuthor(article.author || 'میدیای ئیسلامی');
    setArticlePdfUrl(article.pdfUrl || '');
    setArticleExternalUrl(article.externalUrl || '');
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Editing Article
  const handleCancelEditArticle = () => {
    setEditingArticle(null);
    resetArticleForm();
    setActiveTab('articles');
  };

  // Form Submission Logic for Articles (PUT for update, POST for add)
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) {
      triggerToast('تکایە ناونیشانی نووسین و دەقی بابەتەکە بنووسە', undefined, 'error');
      return;
    }

    setIsArticleSubmitting(true);
    const isEditMode = Boolean(editingArticle);
    const method = isEditMode ? 'PUT' : 'POST';

    const paragraphs = articleContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const now = new Date();
    const kurdishMonths = [
      'کانوونی دووەم', 'شوبات', 'ئادار', 'نیسان', 'ئایار', 'حوزەیران',
      'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم',
    ];
    const dateFormatted = `${now.getDate()}ی ${kurdishMonths[now.getMonth()]}`;

    const payload = isEditMode && editingArticle
      ? {
        id: editingArticle.id,
        slug: articleSlug.trim() || editingArticle.slug,
        title: articleTitle.trim(),
        excerpt: articleExcerpt.trim() || (paragraphs[0] ? paragraphs[0].slice(0, 120) + '...' : editingArticle.excerpt),
        content: paragraphs.length > 0 ? paragraphs : editingArticle.content,
        category: articleCategory,
        readTime: articleReadTime.trim() || editingArticle.readTime,
        date: editingArticle.date || dateFormatted,
        coverImage: articleCoverImage.trim() || editingArticle.coverImage,
        imageUrl: articleCoverImage.trim() || editingArticle.imageUrl,
        author: articleAuthor.trim() || editingArticle.author,
        pdfUrl: articlePdfUrl.trim() || undefined,
        externalUrl: articleExternalUrl.trim() || undefined,
      }
      : {
        id: `article-${Date.now()}`,
        slug: articleSlug.trim() || generateSlug(articleTitle),
        title: articleTitle.trim(),
        excerpt: articleExcerpt.trim() || (paragraphs[0] ? paragraphs[0].slice(0, 120) + '...' : ''),
        content: paragraphs.length > 0 ? paragraphs : [articleContent],
        category: articleCategory,
        readTime: articleReadTime.trim() || '٥ خولەک خوێندنەوە',
        date: dateFormatted,
        coverImage: articleCoverImage.trim() || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
        imageUrl: articleCoverImage.trim() || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
        author: articleAuthor.trim() || 'میدیای ئیسلامی',
        pdfUrl: articlePdfUrl.trim() || undefined,
        externalUrl: articleExternalUrl.trim() || undefined,
      };

    try {
      const res = await fetch('/api/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchArticles();
        setEditingArticle(null);
        resetArticleForm();
        triggerToast(
          isEditMode ? 'گۆڕانکارییەکان پاشەکەوت کران' : 'وتارەکە بڵاوکرایەوە',
          {
            href: `/articles/${payload.slug}`,
            label: 'بینینی بابەت',
          },
          'success'
        );
        setActiveTab('articles');
      } else {
        const errorData = await res.json().catch(() => null);
        triggerToast(
          errorData?.error || 'کردارەکە سەرکەوتوو نەبوو، دووبارە هەوڵبدەرەوە',
          undefined,
          'error'
        );
      }
    } catch (err) {
      console.error('Error saving article via API:', err);
      triggerToast('هەڵەیەک لە پەیوەندی بە سێرڤەر ڕوویدا', undefined, 'error');
    } finally {
      setIsArticleSubmitting(false);
    }
  };

  // Delete Film
  const handleDeleteFilm = async (id: string, title: string) => {
    if (window.confirm(`ئایا دڵنیایت لە سڕینەوەی فیلمی «${title}»؟`)) {
      try {
        await fetch(`/api/films?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.error('API delete film error:', e);
      }
      const updated = films.filter((f) => f.id !== id);
      saveFilmsToStorage(updated);
      if (editingFilmId === id) {
        setEditingFilmId(null);
        resetFilmForm();
      }
      triggerToast('فیلمەکە سڕدرایەوە', undefined, 'success');
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string, title: string) => {
    if (window.confirm(`ئایا دڵنیایت لە سڕینەوەی وتاری «${title}»؟`)) {
      try {
        await fetch(`/api/articles?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.error('API delete error:', e);
      }
      const updated = articles.filter((a) => a.id !== id);
      saveArticlesToStorage(updated);
      if (editingArticle?.id === id) {
        setEditingArticle(null);
        resetArticleForm();
      }
      triggerToast('وتارەکە سڕدرایەوە', undefined, 'success');
    }
  };

  // Handle About Save
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutTitle.trim() || !aboutParagraph1.trim()) {
      triggerToast('تکایە ناونیشان و دەقی سەرەکی بنووسە', undefined, 'error');
      return;
    }

    setIsAboutSubmitting(true);
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aboutTitle,
          paragraph_1: aboutParagraph1,
          paragraph_2: aboutParagraph2,
          paragraph_3: aboutParagraph3,
          instagram_handle: aboutInstagramHandle,
          instagram_url: aboutInstagramUrl,
          telegram_handle: aboutTelegramHandle,
          telegram_url: aboutTelegramUrl,
        }),
      });

      if (res.ok) {
        triggerToast('زانیارییەکانی دەربارە بە سەرکەوتوویی پاشەکەوت کران', { href: '/about', label: 'بینینی پەڕە' }, 'success');
      } else {
        const errData = await res.json().catch(() => ({}));
        triggerToast(errData.error || 'هەڵەیەک ڕوویدا لە پاشەکەوتکردن', undefined, 'error');
      }
    } catch {
      triggerToast('هەڵەیەک ڕوویدا لە پەیوەندیکردن بە سێرڤەر', undefined, 'error');
    } finally {
      setIsAboutSubmitting(false);
    }
  };

  // Handle Home Settings Save
  const handleSaveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTitle.trim()) {
      triggerToast('تکایە ناونیشانی سەرەکی بنووسە', undefined, 'error');
      return;
    }

    setIsHomeSubmitting(true);
    try {
      const res = await fetch('/api/settings/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          badgeText: homeBadgeText,
          title: homeTitle,
          subtitle: homeSubtitle,
        }),
      });

      if (res.ok) {
        triggerToast('ڕێکخستنەکانی پەڕەی سەرەکی بە سەرکەوتوویی نوێکرانەوە', { href: '/', label: 'بینینی پەڕە' }, 'success');
      } else {
        const errData = await res.json().catch(() => ({}));
        triggerToast(errData.error || 'هەڵەیەک ڕوویدا لە پاشەکەوتکردن', undefined, 'error');
      }
    } catch {
      triggerToast('هەڵەیەک ڕوویدا لە پەیوەندیکردن بە سێرڤەر', undefined, 'error');
    } finally {
      setIsHomeSubmitting(false);
    }
  };

  // Handle Movies Page Settings Save
  const handleSaveMoviesSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moviesTitle.trim()) {
      triggerToast('تکایە ناونیشانی سەرەکی پەڕەی فیلمەکان بنووسە', undefined, 'error');
      return;
    }

    setIsMoviesSubmitting(true);
    try {
      const res = await fetch('/api/settings/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          badge: moviesBadge,
          title: moviesTitle,
          subtitle: moviesSubtitle,
          searchPlaceholder: moviesSearchPlaceholder,
          emptyMessage: moviesEmptyMessage,
        }),
      });

      if (res.ok) {
        triggerToast('ڕێکخستنەکانی پەڕەی فیلمەکان بە سەرکەوتوویی نوێکرانەوە', { href: '/films', label: 'بینینی پەڕە' }, 'success');
      } else {
        const errData = await res.json().catch(() => ({}));
        triggerToast(errData.error || 'هەڵەیەک ڕوویدا لە پاشەکەوتکردن', undefined, 'error');
      }
    } catch {
      triggerToast('هەڵەیەک ڕوویدا لە پەیوەندیکردن بە سێرڤەر', undefined, 'error');
    } finally {
      setIsMoviesSubmitting(false);
    }
  };

  // Handle Writings Page Settings Save
  const handleSaveWritingsSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writingsTitle.trim()) {
      triggerToast('تکایە ناونیشانی سەرەکی پەڕەی نووسینەکان بنووسە', undefined, 'error');
      return;
    }

    setIsWritingsSubmitting(true);
    try {
      const res = await fetch('/api/settings/writings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          badge: writingsBadge,
          title: writingsTitle,
          subtitle: writingsSubtitle,
          searchPlaceholder: writingsSearchPlaceholder,
          emptyMessage: writingsEmptyMessage,
        }),
      });

      if (res.ok) {
        triggerToast('ڕێکخستنەکانی پەڕەی نووسینەکان بە سەرکەوتوویی نوێکرانەوە', { href: '/articles', label: 'بینینی پەڕە' }, 'success');
      } else {
        const errData = await res.json().catch(() => ({}));
        triggerToast(errData.error || 'هەڵەیەک ڕوویدا لە پاشەکەوتکردن', undefined, 'error');
      }
    } catch {
      triggerToast('هەڵەیەک ڕوویدا لە پەیوەندیکردن بە سێرڤەر', undefined, 'error');
    } finally {
      setIsWritingsSubmitting(false);
    }
  };

  const handleResetAbout = () => {
    setAboutTitle(DEFAULT_ABOUT_SETTINGS.title);
    setAboutParagraph1(DEFAULT_ABOUT_SETTINGS.paragraph_1);
    setAboutParagraph2(DEFAULT_ABOUT_SETTINGS.paragraph_2);
    setAboutParagraph3(DEFAULT_ABOUT_SETTINGS.paragraph_3);
    setAboutInstagramHandle(DEFAULT_ABOUT_SETTINGS.instagram_handle);
    setAboutInstagramUrl(DEFAULT_ABOUT_SETTINGS.instagram_url);
    setAboutTelegramHandle(DEFAULT_ABOUT_SETTINGS.telegram_handle);
    setAboutTelegramUrl(DEFAULT_ABOUT_SETTINGS.telegram_url);
    triggerToast('زانیارییەکان گەڕێندرانەوە بۆ سەر دۆخی بنەڕەتی', undefined, 'info');
  };

  // Filtered Collections with Kurdish/Arabic normalization
  const filteredFilms = useMemo(() => {
    const q = filmsSearchQuery.trim();
    if (!q) return films;
    return films.filter((f) =>
      matchesSearchQuery(
        [
          f.titleKurdish,
          f.originalTitle,
          f.year.toString(),
          f.category,
          ...f.genres,
          f.description,
        ],
        q
      )
    );
  }, [films, filmsSearchQuery]);

  const filteredArticles = useMemo(() => {
    const q = articlesSearchQuery.trim();
    if (!q) return articles;
    return articles.filter((a) => {
      const content = Array.isArray(a.content)
        ? a.content.join(' ')
        : typeof a.content === 'string'
          ? a.content
          : '';
      return matchesSearchQuery(
        [
          a.title,
          a.category,
          a.author,
          a.excerpt,
          content,
        ],
        q
      );
    });
  }, [articles, articlesSearchQuery]);

  // Editing Item Titles for Banners
  const editingFilmTitle = useMemo(() => {
    if (!editingFilmId) return '';
    return films.find((f) => f.id === editingFilmId)?.titleKurdish || filmTitleKurdish || 'دیاریکراو';
  }, [editingFilmId, films, filmTitleKurdish]);

  // Live Film Preview Object
  const liveFilmSample: Film = useMemo(() => ({
    id: editingFilmId || 'preview',
    slug: 'preview',
    titleKurdish: filmTitleKurdish.trim() || 'ناوی فیلم لێرە دەردەکەوێت',
    originalTitle: filmOriginalTitle.trim() || 'Original Film Title',
    year: Number(filmYear) || 2024,
    duration: filmDuration.trim() || '٢ کاتژمێر',
    category: filmCategory,
    genres: filmGenres ? filmGenres.split(/[,،]/).map((g) => g.trim()).filter(Boolean) : ['سینەمایی'],
    posterUrl: filmPosterUrl.trim() || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    description: filmDescription.trim() || 'کورتەی ناساندنی فیلمەکە و تێڕوانینی فەلسەفی لەم شوێنەدا پیشاندەدرێت بە دوو دێڕی ڕێکخراو.',
    platform: filmPlatform,
    watchUrl: filmTelegramUrl.trim() || 'https://t.me/mediay_islamy',
    telegramPostUrl: filmTelegramUrl.trim() || 'https://t.me/mediay_islamy',
    parts: filmParts,
    imageFit: filmImageFit,
    imageZoom: filmImageZoom,
    imagePosX: filmImagePosX,
    imagePosY: filmImagePosY,
  }), [editingFilmId, filmTitleKurdish, filmOriginalTitle, filmYear, filmDuration, filmCategory, filmGenres, filmPosterUrl, filmDescription, filmTelegramUrl, filmPlatform, filmParts, filmImageFit, filmImageZoom, filmImagePosX, filmImagePosY]);

  // Live Article Preview Object
  const liveArticleSample: Article = useMemo(() => ({
    id: editingArticle?.id || 'preview',
    slug: articleSlug.trim() || 'preview',
    title: articleTitle.trim() || 'ناونیشانی وتارەکە لێرەدا دەردەکەوێت',
    excerpt: articleExcerpt.trim() || 'کورتەیەکی پێشەکی لەسەر ناوەڕۆکی ئەم وتارە و ئەو پرسیارە سەرەکییانەی کە دەوروژێنرێن.',
    content: [articleContent || 'ناوەڕۆکی تەواوی وتار...'],
    category: articleCategory,
    readTime: articleReadTime.trim() || '٥ خولەک خوێندنەوە',
    date: editingArticle?.date || 'ئەمڕۆ',
    coverImage: articleCoverImage.trim() || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    imageUrl: articleCoverImage.trim() || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    author: articleAuthor.trim() || 'میدیای ئیسلامی',
    pdfUrl: articlePdfUrl.trim() || undefined,
    externalUrl: articleExternalUrl.trim() || undefined,
  }), [editingArticle, articleTitle, articleSlug, articleExcerpt, articleContent, articleCategory, articleReadTime, articleCoverImage, articleAuthor, articlePdfUrl, articleExternalUrl]);

  return (
    <div
      dir="rtl"
      className="w-full py-10 space-y-8 text-right select-none flex-1 flex flex-col"
    >
      {/* Admin Header & Session Controls Bar */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 dark:border-zinc-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold font-sirwan bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>بەخێربێیت بەڕێوەبەر</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100">
            بەڕێوەبردنی میدیای ئیسلامی
          </h1>
          <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
            پەنێڵی تەواوی دەستکاریکردن، سڕینەوە و زیادکردنی فیلم و وتارەکان
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-150 active:scale-95 shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.75} />
            <span>سەردانی ماڵپەڕ ↗</span>
          </Link>

          <button
            type="button"
            onClick={handleResetDefaults}
            title="گەڕاندنەوەی سەرجەم داتاکان بۆ دۆخی سەرەتایی"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 hover:text-amber-600 transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">گەڕاندنەوەی بنەڕەت</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold font-sirwan hover:bg-rose-500/20 transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>چوونەدەرەوە</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar">
        <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-stone-100/80 dark:bg-zinc-900/80 border border-[#ede8e1] dark:border-zinc-800 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('films')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer ${activeTab === 'films'
                ? 'bg-[#d49757] text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>بەڕێوەبردنی فیلمەکان</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-sans font-bold">
              {films.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer ${activeTab === 'articles'
                ? 'bg-[#d49757] text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>بەڕێوەبردنی وتارەکان</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-sans font-bold">
              {articles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer ${activeTab === 'about'
                ? 'bg-[#d49757] text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
          >
            <Info className="w-4 h-4" />
            <span>بەڕێوەبردنی دەربارە</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer ${activeTab === 'home'
                ? 'bg-[#d49757] text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>پەڕەی سەرەکی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('moviesPage')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer ${activeTab === 'moviesPage'
                ? 'bg-[#d49757] text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
          >
            <FilmIcon className="w-4 h-4" />
            <span>پەڕەی فیلمەکان</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('writingsPage')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer ${activeTab === 'writingsPage'
                ? 'bg-[#d49757] text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
          >
            <FileText className="w-4 h-4" />
            <span>پەڕەی نووسینەکان</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('create');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer ${activeTab === 'create'
                ? 'bg-[#d49757] text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
          >
            {editingFilmId || editingArticle ? (
              <>
                <Pencil className="w-4 h-4" />
                <span>دۆخی دەستکاریکردن</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>زیادکردنی نوێ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: FILMS MANAGEMENT (List + Search + Edit + Delete)     */}
      {/* ========================================================= */}
      {activeTab === 'films' && (
        <div className="w-full space-y-5">
          {/* Controls Bar: Search & Quick Add */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-stone-200/80 dark:border-zinc-800 bg-white/70 dark:bg-[#16171b] shadow-2xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filmsSearchQuery}
                onChange={(e) => setFilmsSearchQuery(e.target.value)}
                placeholder="گەڕان بەدوای فیلم (ناوی کوردی، ئینگلیزی، ساڵ یان جۆر)..."
                className="w-full pr-10 pl-9 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/60 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
              />
              {filmsSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFilmsSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={() => {
                setEditingFilmId(null);
                setEditingArticle(null);
                setCreateType('film');
                resetFilmForm();
                setActiveTab('create');
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#d49757] hover:bg-[#c28747] text-zinc-950 font-bold font-sirwan text-xs sm:text-sm transition-all duration-150 active:scale-95 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>زیادکردنی فیلمی نوێ</span>
            </button>
          </div>

          {/* Films Counter */}
          <div className="flex items-center justify-between px-1 text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
            <span>
              پیشاندانی {filteredFilms.length} لە کۆی {films.length} فیلم
            </span>
            {filmsSearchQuery && (
              <button
                type="button"
                onClick={() => setFilmsSearchQuery('')}
                className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                پاککردنەوەی فلتەر
              </button>
            )}
          </div>

          {/* Films List */}
          {filteredFilms.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-stone-300 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/30 space-y-3">
              <Clapperboard className="w-8 h-8 text-[#d49757] mx-auto opacity-80" />
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                  {filmsSearchQuery ? 'هیچ ئەنجامێک بۆ ئەم گەڕانە نەدۆزرایەوە' : 'هیچ فیلمێک بەردەست نییە'}
                </p>
                <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
                  {filmsSearchQuery
                    ? `هیچ فیلمێک بە وشەی «${filmsSearchQuery}» نەدۆزرایەوە.`
                    : 'دەتوانیت لە ڕێگەی دوگمەی سەرەوە فیلمی نوێ زیاد بکەیت.'}
                </p>
              </div>
              {filmsSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFilmsSearchQuery('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d49757]/15 hover:bg-[#d49757] text-[#d49757] hover:text-zinc-950 text-xs font-sirwan font-semibold transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>پاککردنەوەی فلتەر</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFilms.map((film) => (
                <div
                  key={film.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-stone-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-[#16171b] shadow-2xs hover:border-[#d49757]/40 dark:hover:border-[#d49757]/30 transition-all duration-150"
                >
                  {/* Right Side: Poster Thumbnail + Meta */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-14 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-200 dark:bg-zinc-800 shadow-xs border border-black/5 dark:border-white/5">
                      <Image
                        src={film.posterUrl || '/placeholder.jpg'}
                        alt={film.titleKurdish}
                        fill
                        sizes="56px"
                        className="object-cover object-center"
                      />
                    </div>

                    <div className="min-w-0 text-right space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold font-peshang text-zinc-900 dark:text-zinc-100 truncate">
                          {film.titleKurdish}
                        </h3>
                        {film.originalTitle && film.originalTitle !== film.titleKurdish && (
                          <span className="text-xs text-zinc-400 font-sans dir-ltr">
                            ({film.originalTitle})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
                        <span className="font-sans font-medium">{film.year}</span>
                        <span>•</span>
                        <span>{film.duration}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold font-sirwan bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                          {film.category}
                        </span>
                        {film.genres[0] && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium font-sirwan bg-stone-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                            {film.genres[0]}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400 line-clamp-1 pt-0.5">
                        {film.description}
                      </p>
                    </div>
                  </div>

                  {/* Left Side: Action Buttons */}
                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-zinc-800/80">
                    {film.platform === 'youtube' || (film.watchUrl?.includes('youtu') || film.telegramPostUrl?.includes('youtu')) ? (
                      <a
                        href={film.watchUrl || film.telegramPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold font-sirwan transition-colors cursor-pointer"
                        title="تاقیکردنەوەی بەستەری یووتووب"
                      >
                        <YouTubeIcon className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <span className="hidden md:inline">یووتووب</span>
                      </a>
                    ) : (
                      <a
                        href={film.watchUrl || film.telegramPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-500/20 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold font-sirwan transition-colors cursor-pointer"
                        title="تاقیکردنەوەی بەستەری تێلیگرام"
                      >
                        <TelegramIcon className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <span className="hidden md:inline">تێلیگرام</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopyLink(film.telegramPostUrl)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-100/70 dark:bg-zinc-800/60 hover:bg-stone-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold font-sirwan transition-colors cursor-pointer"
                      title="کۆپیکردنی بەستەری تێلیگرام"
                    >
                      <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span className="hidden md:inline">کۆپیکردن</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEditFilm(film)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer"
                      title="دەستکاریکردنی فیلم"
                    >
                      <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>دەستکاریکردن</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFilm(film.id, film.titleKurdish)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer"
                      title="سڕینەوە"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span className="hidden sm:inline">سڕینەوە</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ARTICLES MANAGEMENT (List + Search + Edit + Delete)  */}
      {/* ========================================================= */}
      {activeTab === 'articles' && (
        <div className="w-full space-y-5">
          {/* Controls Bar: Search & Quick Add */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-stone-200/80 dark:border-zinc-800 bg-white/70 dark:bg-[#16171b] shadow-2xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={articlesSearchQuery}
                onChange={(e) => setArticlesSearchQuery(e.target.value)}
                placeholder="گەڕان بەدوای وتار (ناونیشان، نووسەر، کورتە یان پۆلێن)..."
                className="w-full pr-10 pl-9 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/60 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
              />
              {articlesSearchQuery && (
                <button
                  type="button"
                  onClick={() => setArticlesSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={() => {
                setEditingArticle(null);
                setEditingFilmId(null);
                setCreateType('article');
                resetArticleForm();
                setActiveTab('create');
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#d49757] hover:bg-[#c28747] text-zinc-950 font-bold font-sirwan text-xs sm:text-sm transition-all duration-150 active:scale-95 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>زیادکردنی وتاری نوێ</span>
            </button>
          </div>

          {/* Articles Counter */}
          <div className="flex items-center justify-between px-1 text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
            <span>
              پیشاندانی {filteredArticles.length} لە کۆی {articles.length} وتار
            </span>
            {articlesSearchQuery && (
              <button
                type="button"
                onClick={() => setArticlesSearchQuery('')}
                className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                پاککردنەوەی فلتەر
              </button>
            )}
          </div>

          {/* Articles List */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-stone-300 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/30 space-y-3">
              <BookOpen className="w-8 h-8 text-[#d49757] mx-auto opacity-80" />
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                  {articlesSearchQuery ? 'هیچ ئەنجامێک بۆ ئەم گەڕانە نەدۆزرایەوە' : 'هیچ وتارێک بەردەست نییە'}
                </p>
                <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
                  {articlesSearchQuery
                    ? `هیچ وتارێک بە وشەی «${articlesSearchQuery}» نەدۆزرایەوە.`
                    : 'دەتوانیت لە ڕێگەی دوگمەی سەرەوە وتاری نوێ بڵاوبکەیتەوە.'}
                </p>
              </div>
              {articlesSearchQuery && (
                <button
                  type="button"
                  onClick={() => setArticlesSearchQuery('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d49757]/15 hover:bg-[#d49757] text-[#d49757] hover:text-zinc-950 text-xs font-sirwan font-semibold transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>پاککردنەوەی فلتەر</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((article) => {
                const cover = article.coverImage || article.imageUrl;
                return (
                  <div
                    key={article.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-stone-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-[#16171b] shadow-2xs hover:border-[#d49757]/40 dark:hover:border-[#d49757]/30 transition-all duration-150"
                  >
                    {/* Right Side: Cover Thumbnail + Meta */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-stone-200 dark:bg-zinc-800 shadow-xs border border-black/5 dark:border-white/5">
                        <Image
                          src={cover || '/placeholder.jpg'}
                          alt={article.title}
                          fill
                          sizes="80px"
                          className="object-cover object-center"
                        />
                      </div>

                      <div className="min-w-0 text-right space-y-1">
                        <h3 className="text-base font-bold font-peshang text-zinc-900 dark:text-zinc-100 truncate">
                          {article.title}
                        </h3>

                        <div className="flex items-center gap-2 flex-wrap text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold font-sirwan bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                            {article.category}
                          </span>
                          {article.pdfUrl && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-sans bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              PDF
                            </span>
                          )}
                          {article.externalUrl && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold font-sirwan bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              سەرچاوە
                            </span>
                          )}
                          <span>•</span>
                          <span>{article.date}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                          {article.author && (
                            <>
                              <span>•</span>
                              <span>نووسەر: {article.author}</span>
                            </>
                          )}
                        </div>

                        <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400 line-clamp-1 pt-0.5">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Left Side: Action Buttons */}
                    <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-zinc-800/80">
                      <Link
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-100/70 dark:bg-zinc-800/60 hover:bg-stone-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold font-sirwan transition-colors"
                        title="بینینی بابەت لە ماڵپەڕ"
                      >
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span className="hidden md:inline">بینین</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(`${typeof window !== 'undefined' ? window.location.origin : ''}/articles/${article.slug}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-100/70 dark:bg-zinc-800/60 hover:bg-stone-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold font-sirwan transition-colors cursor-pointer"
                        title="کۆپیکردنی بەستەری وتار"
                      >
                        <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span className="hidden md:inline">کۆپیکردن</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEditArticle(article)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer"
                        title="دەستکاریکردنی وتار"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span>دەستکاریکردن</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(article.id, article.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer"
                        title="سڕینەوە"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span className="hidden sm:inline">سڕینەوە</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: UNIFIED ADD & EDIT EXPERIENCE                      */}
      {/* ========================================================= */}
      {activeTab === 'create' && (
        <div className="w-full space-y-6">
          {/* Editing Mode Banner (Shows when in edit mode) */}
          {(editingFilmId || editingArticle) && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-right shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Pencil className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-peshang text-amber-800 dark:text-amber-300">
                    {editingFilmId ? 'دۆخی دەستکاریکردنی فیلم' : 'دۆخی دەستکاریکردنی وتار'}
                  </h3>
                  <p className="text-xs font-sirwan text-zinc-600 dark:text-zinc-400">
                    {editingFilmId
                      ? `تۆ ئێستا دەستکاریی زانیارییەکانی فیلمی «${editingFilmTitle}» دەکەیت.`
                      : `تۆ ئێستا دەستکاریی زانیارییەکانی وتاری «${editingArticle?.title || articleTitle}» دەکەیت.`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={editingFilmId ? handleCancelEditFilm : handleCancelEditArticle}
                className="px-4 py-1.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
              >
                پاشگەزبوونەوە و داخستن
              </button>
            </div>
          )}

          {/* Type Segment Switcher (Only shown when creating brand new) */}
          {!editingFilmId && !editingArticle && (
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-stone-100/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCreateType('film')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 cursor-pointer ${createType === 'film'
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                >
                  <Clapperboard className="w-4 h-4" />
                  <span>زیادکردنی فیلم یان ئەنیمەیشن</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCreateType('article')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 cursor-pointer ${createType === 'article'
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>زیادکردنی وتار و نووسین</span>
                </button>
              </div>
            </div>
          )}

          {/* SUB-FORM 1: FILM FORM */}
          {createType === 'film' && (
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Column */}
              <div className="lg:col-span-7 rounded-2xl border border-stone-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-[#16171b] p-6 sm:p-7 shadow-xs space-y-5">
                <h2 className="text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 border-b border-stone-200/60 dark:border-zinc-800 pb-3">
                  {editingFilmId ? 'دەستکاریکردنی زانیارییەکانی فیلم' : 'فۆڕمی زیادکردنی فیلم یان کارتۆن'}
                </h2>

                <form onSubmit={handleSaveFilm} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        ناوی کوردی فیلم <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={filmTitleKurdish}
                        onChange={(e) => setFilmTitleKurdish(e.target.value)}
                        placeholder="نموونە: ڕۆشتووی ڕۆحەکان"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        ناوی ڕەسەن / ئینگلیزی
                      </label>
                      <input
                        type="text"
                        value={filmOriginalTitle}
                        onChange={(e) => setFilmOriginalTitle(e.target.value)}
                        placeholder="Spirited Away"
                        dir="ltr"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d49757]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        پۆلێن (Category)
                      </label>
                      <select
                        value={filmCategory}
                        onChange={(e) => setFilmCategory(e.target.value as FilmCategory)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
                      >
                        <option value="فیلم">فیلم</option>
                        <option value="زنجیرەفیلم">زنجیرەفیلم</option>
                        <option value="کارتۆن">کارتۆن</option>
                        <option value="زنجیرەکارتۆن">زنجیرەکارتۆن</option>
                        <option value="کورتە فیلم">کورتە فیلم</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        ساڵی بەرهەمهێنان
                      </label>
                      <input
                        type="number"
                        value={filmYear}
                        onChange={(e) => setFilmYear(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d49757]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        ماوەی فیلم
                      </label>
                      <input
                        type="text"
                        value={filmDuration}
                        onChange={(e) => setFilmDuration(e.target.value)}
                        placeholder="٢ کاتژمێر و ٥ خولەک"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      دەستەواژە / چەشنەکان (بە فاریزە جیاکراوە)
                    </label>
                    <input
                      type="text"
                      value={filmGenres}
                      onChange={(e) => setFilmGenres(e.target.value)}
                      placeholder="ئەنیمەیشن، سەرکێشی، خێزانی"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
                    />
                  </div>

                  {/* Poster Image File Upload & URL */}
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      پۆستەری فیلم (وێنە لە گەلەری یان بەستەر)
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-stone-300 dark:border-zinc-700 bg-stone-50/70 dark:bg-zinc-900/60 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-all active:scale-[0.99]">
                          <Upload className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
                          <span>هەڵبژاردنی وێنە لە گەلەری / ئامێر</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, (dataUrl) => {
                                  setFilmPosterUrl(dataUrl);
                                  triggerToast('وێنەکە دیاری کرا', undefined, 'success');
                                });
                              }
                            }}
                          />
                        </label>
                        {filmPosterUrl && filmPosterUrl.startsWith('data:image') && (
                          <button
                            type="button"
                            onClick={() => setFilmPosterUrl('')}
                            className="px-2.5 py-2 rounded-xl text-xs font-sirwan text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
                          >
                            سڕینەوە
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={filmPosterUrl}
                        onChange={(e) => setFilmPosterUrl(e.target.value)}
                        placeholder="یان بەستەری وێنە بنووسە: https://..."
                        dir="ltr"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d49757]"
                      />
                    </div>
                  </div>

                  {/* Card Image Framing Controls Section */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 dark:bg-zinc-900/60 border border-stone-200/90 dark:border-zinc-800 space-y-4">
                    {/* Header with Title & Reset Button */}
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200/70 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Crop className="w-4 h-4" strokeWidth={1.75} />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                            ڕێکخستنی دەرکەوتنی وێنە لە کارتدا
                          </h4>
                          <p className="text-[11px] font-sirwan text-zinc-500 dark:text-zinc-400">
                            دیاریکردنی شێوازی پڕکردنەوە، نزیککردنەوە و شوێنی سەنتەری وێنە
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetFilmFraming}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-sirwan text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 bg-white dark:bg-zinc-800 hover:bg-amber-500/10 border border-stone-200 dark:border-zinc-700 transition-colors cursor-pointer select-none"
                        title="ڕێکخستنەوەی سەرجەم ڕێکخستنەکان بۆ دۆخی بنەڕەتی"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>ڕێکخستنەوە</span>
                      </button>
                    </div>

                    {/* Content: Live Mini Card Preview + Sliders */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                      {/* 1. Live Mini Card Preview (w-36 aspect-[2/3]) */}
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className="relative w-36 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow-md">
                          {/* Background Layer (when contain) */}
                          {filmImageFit === 'contain' ? (
                            <>
                              <Image
                                src={filmPosterUrl.trim() || '/placeholder.jpg'}
                                alt=""
                                fill
                                aria-hidden="true"
                                unoptimized={filmPosterUrl.startsWith('data:')}
                                sizes="144px"
                                className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-45 pointer-events-none select-none"
                                onError={(e) => { (e.target as any).src = '/placeholder.jpg'; }}
                              />
                              <div className="relative z-10 w-full h-full overflow-hidden">
                                <Image
                                  src={filmPosterUrl.trim() || '/placeholder.jpg'}
                                  alt=""
                                  fill
                                  unoptimized={filmPosterUrl.startsWith('data:')}
                                  sizes="144px"
                                  className="w-full h-full object-contain select-none transition-transform duration-150"
                                  style={{
                                    objectPosition: `${filmImagePosX}% ${filmImagePosY}%`,
                                    transform: `scale(${filmImageZoom / 100})`,
                                  }}
                                  onError={(e) => { (e.target as any).src = '/placeholder.jpg'; }}
                                />
                              </div>
                            </>
                          ) : (
                            <div className="relative z-10 w-full h-full overflow-hidden">
                              <Image
                                src={filmPosterUrl.trim() || '/placeholder.jpg'}
                                alt=""
                                fill
                                unoptimized={filmPosterUrl.startsWith('data:')}
                                sizes="144px"
                                className="w-full h-full object-cover select-none transition-transform duration-150"
                                style={{
                                  objectPosition: `${filmImagePosX}% ${filmImagePosY}%`,
                                  transform: `scale(${filmImageZoom / 100})`,
                                }}
                                onError={(e) => { (e.target as any).src = '/placeholder.jpg'; }}
                              />
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-20" />

                          {/* Mini Title Overlay */}
                          <div className="absolute bottom-0 inset-x-0 p-2 z-30 text-right">
                            <span className="text-[10px] font-bold font-peshang text-white line-clamp-1">
                              {filmTitleKurdish.trim() || 'ناوی فیلم'}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-sirwan text-zinc-500 dark:text-zinc-400">
                          پێشبینینی کارت (Mini Preview)
                        </span>
                      </div>

                      {/* 2. Controls Grid */}
                      <div className="flex-1 w-full space-y-3.5">
                        {/* Display Mode Toggle */}
                        <div>
                          <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1.5">
                            شێوازی پیشاندان (Display Mode):
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setFilmImageFit('contain')}
                              className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-sirwan border transition-all cursor-pointer ${
                                filmImageFit === 'contain'
                                  ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-400 font-bold shadow-2xs'
                                  : 'border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 hover:border-amber-500/40'
                              }`}
                            >
                              <span className="font-bold">پیشاندانی هەمووی (contain)</span>
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">بێ بڕینەوە + پاشبنەمای لێڵ</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setFilmImageFit('cover')}
                              className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-sirwan border transition-all cursor-pointer ${
                                filmImageFit === 'cover'
                                  ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-400 font-bold shadow-2xs'
                                  : 'border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 hover:border-amber-500/40'
                              }`}
                            >
                              <span className="font-bold">پڕکردنەوەی کارت (cover)</span>
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">پڕکردنەوەی چوارچێوەکە</span>
                            </button>
                          </div>
                        </div>

                        {/* Zoom Slider */}
                        <div>
                          <div className="flex items-center justify-between text-xs font-sirwan mb-1">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              گەورەکردن و نزیککردنەوە (Zoom):
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-[11px]">
                              {filmImageZoom}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="180"
                            step="1"
                            value={filmImageZoom}
                            onChange={(e) => setFilmImageZoom(Number(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 dark:bg-zinc-700 rounded-lg"
                          />
                          <div className="flex justify-between text-[10px] font-sirwan text-zinc-400 mt-0.5">
                            <span>١٠٠٪ (ئاسایی)</span>
                            <span>١٤٠٪</span>
                            <span>١٨٠٪ (نزیککراو)</span>
                          </div>
                        </div>

                        {/* Horizontal Position Slider (X) */}
                        <div>
                          <div className="flex items-center justify-between text-xs font-sirwan mb-1">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              شوێنی ئاسۆیی (چەپ / ڕاست - X):
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono font-bold text-[11px]">
                              {filmImagePosX}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={filmImagePosX}
                            onChange={(e) => setFilmImagePosX(Number(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 dark:bg-zinc-700 rounded-lg"
                          />
                          <div className="flex justify-between text-[10px] font-sirwan text-zinc-400 mt-0.5">
                            <span>٠٪ (لای چەپ)</span>
                            <span>٥٠٪ (ناوەڕاست)</span>
                            <span>١٠٠٪ (لای ڕاست)</span>
                          </div>
                        </div>

                        {/* Vertical Position Slider (Y) */}
                        <div>
                          <div className="flex items-center justify-between text-xs font-sirwan mb-1">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              شوێنی ستوونی (سەروو / خواروو - Y):
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono font-bold text-[11px]">
                              {filmImagePosY}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={filmImagePosY}
                            onChange={(e) => setFilmImagePosY(Number(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 dark:bg-zinc-700 rounded-lg"
                          />
                          <div className="flex justify-between text-[10px] font-sirwan text-zinc-400 mt-0.5">
                            <span>٠٪ (سەرەوە)</span>
                            <span>٥٠٪ (ناوەڕاست)</span>
                            <span>١٠٠٪ (خوارەوە)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Streaming Platform Selector */}
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-2">
                      سەکۆی پەخش (Streaming Platform) <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFilmPlatform('telegram');
                          if (filmTelegramUrl.includes('youtu')) {
                            setFilmTelegramUrl('https://t.me/mediay_islamy');
                          }
                        }}
                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold font-sirwan border transition-all cursor-pointer ${filmPlatform === 'telegram'
                            ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-400 font-bold shadow-xs'
                            : 'border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-amber-500/40'
                          }`}
                      >
                        <TelegramIcon className="w-4 h-4 text-sky-500 shrink-0" />
                        <span>تێلیگرام (Telegram)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFilmPlatform('youtube');
                          if (filmTelegramUrl.includes('t.me')) {
                            setFilmTelegramUrl('https://www.youtube.com/watch?v=');
                          }
                        }}
                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold font-sirwan border transition-all cursor-pointer ${filmPlatform === 'youtube'
                            ? 'bg-red-500/15 border-red-500 text-red-700 dark:text-red-400 font-bold shadow-xs'
                            : 'border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-red-500/40'
                          }`}
                      >
                        <YouTubeIcon className="w-4 h-4 text-red-600 shrink-0" />
                        <span>یووتووب (YouTube)</span>
                      </button>
                    </div>
                  </div>

                  {/* Watch Link Input */}
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      {filmPlatform === 'youtube' ? 'لینکی فیلم لە یووتووب' : 'لینکی فیلم لە تێلیگرام'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={filmTelegramUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFilmTelegramUrl(val);
                        if (val.includes('youtu.be') || val.includes('youtube.com')) {
                          setFilmPlatform('youtube');
                        } else if (val.includes('t.me/')) {
                          setFilmPlatform('telegram');
                        }
                      }}
                      placeholder={
                        filmPlatform === 'youtube'
                          ? 'https://www.youtube.com/watch?v=... یان https://youtu.be/...'
                          : 'https://t.me/mediay_islamy/101'
                      }
                      dir="ltr"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d49757]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      کورتەی چیرۆک / ناساندن
                    </label>
                    <textarea
                      rows={3}
                      value={filmDescription}
                      onChange={(e) => setFilmDescription(e.target.value)}
                      placeholder="کورتەیەک دەربارەی بابەت و کاریگەریی فیلمەکە..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757] leading-relaxed"
                    />
                  </div>

                  {/* Multi-Part / Episodes Management */}
                  <div className="pt-3 border-t border-stone-200/80 dark:border-zinc-800/80 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <label className="block text-xs font-semibold font-sirwan text-zinc-900 dark:text-zinc-100">
                          بەشەکان یان ئەڵقەکان (Multi-Part Content)
                        </label>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sirwan mt-0.5">
                          بۆ فیلمی چەند بەشی یان زنجیرە (وەک بەشی ١، ٢، ٣...)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddFilmPart}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-sirwan bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all cursor-pointer active:scale-95 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>زیادکردنی بەش</span>
                      </button>
                    </div>

                    {filmParts.length === 0 ? (
                      <div className="p-3.5 rounded-xl bg-stone-50/60 dark:bg-zinc-900/40 border border-dashed border-stone-200 dark:border-zinc-800 text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sirwan">
                          ئەم بەرهەمە تاکە بەشە. ئەگەر چەند بەش یان ئەڵقەیە، لە سەرەوە کلیک لە «زیادکردنی بەش» بکە.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filmParts.map((part, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 space-y-3 relative transition-all"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-zinc-800/60">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs flex items-center justify-center font-sans shadow-2xs">
                                  {idx + 1}
                                </span>
                                <span className="text-xs font-bold font-sirwan text-zinc-900 dark:text-zinc-100">
                                  {part.title || `بەشی ${toKurdishNumber(idx + 1)}`}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveFilmPart(idx)}
                                className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="سڕینەوەی ئەم بەشە"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className="block text-[11px] font-medium font-sirwan text-zinc-600 dark:text-zinc-400 mb-1">
                                  ناوی بەش / ئەڵقە
                                </label>
                                <input
                                  type="text"
                                  value={part.title}
                                  onChange={(e) => handleFilmPartChange(idx, 'title', e.target.value)}
                                  placeholder="نموونە: بەشی یەکەم"
                                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-sirwan focus:outline-none focus:border-amber-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-medium font-sirwan text-zinc-600 dark:text-zinc-400 mb-1">
                                  ماوە (ئارەزوومەندانە)
                                </label>
                                <input
                                  type="text"
                                  value={part.duration || ''}
                                  onChange={(e) => handleFilmPartChange(idx, 'duration', e.target.value)}
                                  placeholder="٤٥ خولەک"
                                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-sirwan focus:outline-none focus:border-amber-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-medium font-sirwan text-zinc-600 dark:text-zinc-400 mb-1">
                                  لینکی تێلیگرام (Telegram URL)
                                </label>
                                <input
                                  type="url"
                                  dir="ltr"
                                  value={part.telegramUrl || ''}
                                  onChange={(e) => handleFilmPartChange(idx, 'telegramUrl', e.target.value)}
                                  placeholder="https://t.me/mediay_islamy/..."
                                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-sans focus:outline-none focus:border-amber-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-medium font-sirwan text-zinc-600 dark:text-zinc-400 mb-1">
                                  لینکی یووتووب (YouTube URL)
                                </label>
                                <input
                                  type="url"
                                  dir="ltr"
                                  value={part.youtubeUrl || ''}
                                  onChange={(e) => handleFilmPartChange(idx, 'youtubeUrl', e.target.value)}
                                  placeholder="https://youtube.com/watch?v=..."
                                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-sans focus:outline-none focus:border-amber-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Unified Save & Cancel */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isFilmSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-[#d49757] hover:bg-[#c28747] text-zinc-950 font-bold font-sirwan text-sm tracking-normal shadow-sm transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation tap-highlight-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isFilmSubmitting
                        ? 'تکایە چاوەڕوان بە...'
                        : editingFilmId
                          ? 'پاشەکەوتکردنی گۆڕانکارییەکان'
                          : 'پاشەکەوتکردن و بڵاوکردنەوەی فیلم'}
                    </button>
                    {editingFilmId && (
                      <button
                        type="button"
                        onClick={handleCancelEditFilm}
                        className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700 text-sm font-semibold font-sirwan transition-colors cursor-pointer"
                      >
                        پاشگەزبوونەوە
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Live Preview Side */}
              <div className="lg:col-span-5 space-y-3 sticky top-24">
                <div className="flex items-center gap-1.5 text-xs font-semibold font-sirwan text-zinc-500 dark:text-zinc-400">
                  <Eye className="w-4 h-4 text-[#d49757]" />
                  <span>پێشبینینی کارتی فیلم (Live Preview):</span>
                </div>

                <FilmCard film={liveFilmSample} />

                {filmParts.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#16171b] border border-stone-200/80 dark:border-zinc-800/80 space-y-2">
                    <span className="text-xs font-bold font-sirwan text-zinc-700 dark:text-zinc-300">
                      لیستی بەشەکان ({filmParts.length} بەش):
                    </span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                      {filmParts.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl bg-stone-50 dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800"
                        >
                          <span className="font-sirwan text-zinc-800 dark:text-zinc-200">
                            {p.title || `بەشی ${toKurdishNumber(i + 1)}`}
                          </span>
                          {p.duration && (
                            <span className="text-[11px] text-zinc-500 font-sirwan">{p.duration}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-FORM 2: ARTICLE FORM */}
          {createType === 'article' && (
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Column */}
              <div className="lg:col-span-7 rounded-2xl border border-stone-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-[#16171b] p-6 sm:p-7 shadow-xs space-y-5">
                <h2 className="text-lg font-bold font-peshang text-zinc-900 dark:text-zinc-100 border-b border-stone-200/60 dark:border-zinc-800 pb-3">
                  {editingArticle ? 'دەستکاریکردنی زانیارییەکانی وتار' : 'فۆڕمی زیادکردنی وتار و نووسین'}
                </h2>

                <form onSubmit={handleArticleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      ناونیشانی وتار <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={articleTitle}
                      onChange={(e) => handleTitleChangeForSlug(e.target.value)}
                      placeholder="نموونە: سینەمای تارکۆڤسکی و بەستنی کات"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        Slug (بەستەری URL)
                      </label>
                      <input
                        type="text"
                        value={articleSlug}
                        onChange={(e) => setArticleSlug(e.target.value)}
                        placeholder="tarkovsky-cinema-time"
                        dir="ltr"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d49757]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        پۆلێن (Category)
                      </label>
                      <select
                        value={articleCategory}
                        onChange={(e) => setArticleCategory(e.target.value as ArticleCategory)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
                      >
                        <option value="ئایەت">ئایەت</option>
                        <option value="دەق">دەق</option>
                        <option value="کتێب">کتێب</option>
                        <option value="شیعر">شیعر</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        کاتی پێویست بۆ خوێندنەوە
                      </label>
                      <input
                        type="text"
                        value={articleReadTime}
                        onChange={(e) => setArticleReadTime(e.target.value)}
                        placeholder="٥ خولەک خوێندنەوە"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        نووسەر / وەرگێڕ
                      </label>
                      <input
                        type="text"
                        value={articleAuthor}
                        onChange={(e) => setArticleAuthor(e.target.value)}
                        placeholder="میدیای ئیسلامی"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
                      />
                    </div>
                  </div>

                  {/* Cover Image File Upload & URL */}
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      وێنەی بەرگی وتار (وێنە لە گەلەری یان بەستەر)
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-stone-300 dark:border-zinc-700 bg-stone-50/70 dark:bg-zinc-900/60 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-all active:scale-[0.99]">
                          <Upload className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
                          <span>هەڵبژاردنی وێنە لە گەلەری / ئامێر</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, (dataUrl) => {
                                  setArticleCoverImage(dataUrl);
                                  triggerToast('وێنەکە دیاری کرا', undefined, 'success');
                                });
                              }
                            }}
                          />
                        </label>
                        {articleCoverImage && articleCoverImage.startsWith('data:image') && (
                          <button
                            type="button"
                            onClick={() => setArticleCoverImage('')}
                            className="px-2.5 py-2 rounded-xl text-xs font-sirwan text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
                          >
                            سڕینەوە
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={articleCoverImage}
                        onChange={(e) => setArticleCoverImage(e.target.value)}
                        placeholder="یان بەستەری وێنە بنووسە: https://..."
                        dir="ltr"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d49757]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      کورتەی وتار (Excerpt)
                    </label>
                    <textarea
                      rows={2}
                      value={articleExcerpt}
                      onChange={(e) => setArticleExcerpt(e.target.value)}
                      placeholder="کورتەیەک بە ۲ دێڕ بۆ ڕاکێشانی سەرنجی خوێنەر..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      دەقی تەواوی وتار (پەرەگرافەکان بە دوو ئینتەر جیا بکەرەوە) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={articleContent}
                      onChange={(e) => setArticleContent(e.target.value)}
                      placeholder="دەقی تەواوی وتارەکە لێرەدا بنووسە..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757] leading-loose"
                    />
                  </div>

                  {/* Additional Attachments: PDF Document & External Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/50 border border-stone-200/80 dark:border-zinc-800">
                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        فایلی PDF (داگرتن / خوێندنەوەی پەڕتووک یان وتار)
                      </label>
                      <input
                        type="url"
                        value={articlePdfUrl}
                        onChange={(e) => setArticlePdfUrl(e.target.value)}
                        placeholder="https://.../document.pdf"
                        dir="ltr"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d49757]"
                      />
                      <p className="text-[11px] font-sirwan text-zinc-500 dark:text-zinc-400 mt-1">
                        بەستەری ڕاستەوخۆ بۆ خوێندنەوە یان داگرتنی فایلی PDF
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                        بەستەری دەرەکی (External Link / سەرچاوەی بابەت)
                      </label>
                      <input
                        type="url"
                        value={articleExternalUrl}
                        onChange={(e) => setArticleExternalUrl(e.target.value)}
                        placeholder="https://example.com/source"
                        dir="ltr"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d49757]"
                      />
                      <p className="text-[11px] font-sirwan text-zinc-500 dark:text-zinc-400 mt-1">
                        لینکی ماڵپەڕ یان سەرچاوەی ئەسڵیی دەرەکی
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons: Unified Save & Cancel */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isArticleSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-[#d49757] hover:bg-[#c28747] text-zinc-950 font-bold font-sirwan text-sm tracking-normal shadow-sm transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation tap-highlight-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isArticleSubmitting
                        ? 'پاشەکەوتکردن...'
                        : editingArticle
                          ? 'پاشەکەوتکردنی گۆڕانکارییەکان'
                          : 'پاشەکەوتکردن و بڵاوکردنەوەی وتار'}
                    </button>
                    {editingArticle && (
                      <button
                        type="button"
                        onClick={handleCancelEditArticle}
                        className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700 text-sm font-semibold font-sirwan transition-colors cursor-pointer"
                      >
                        پاشگەزبوونەوە
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Live Preview Side */}
              <div className="lg:col-span-5 space-y-3 sticky top-24">
                <div className="flex items-center gap-1.5 text-xs font-semibold font-sirwan text-zinc-500 dark:text-zinc-400">
                  <Eye className="w-4 h-4 text-[#d49757]" />
                  <span>پێشبینینی کارتی وتار (Live Preview):</span>
                </div>

                <ArticleCard article={liveArticleSample} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: ABOUT PAGE MANAGEMENT (دەربارە)                    */}
      {/* ========================================================= */}
      {activeTab === 'about' && (
        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/70 dark:bg-[#16171b] border border-stone-200/80 dark:border-zinc-800 text-right shadow-2xs">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-400 text-xs font-semibold font-sirwan">
                <Info className="w-3.5 h-3.5" />
                <span>دەستکاریکردنی پەڕەی دەربارە</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                بەڕێوەبردنی زانیاری، پەیام و تایبەتمەندییەکان
              </h2>
              <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
                دەقی سەرەکی و پەیامی دەربارەی میدیای ئیسلامی بگۆڕە و ڕاستەوخۆ لە ماڵپەڕ نیشان دەدرێت.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/about"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-100/80 dark:bg-zinc-800 text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 hover:text-amber-600 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                <span>پەڕەی دەربارە ↗</span>
              </Link>

              <button
                type="button"
                onClick={handleResetAbout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-100/80 dark:bg-zinc-800 text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 hover:text-amber-600 transition-colors cursor-pointer"
                title="گەڕاندنەوە بۆ دەقی پێشینە"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>گەڕاندنەوە بۆ بنەڕەت</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Side (7 cols) */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSaveAbout}
                className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#16171b] border border-stone-200/80 dark:border-zinc-800 space-y-6 text-right shadow-2xs"
              >
                {/* 1. Page Title */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>ناونیشانی پەڕە</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      ناونیشانی سەرەکی (Title) *
                    </label>
                    <input
                      type="text"
                      value={aboutTitle}
                      onChange={(e) => setAboutTitle(e.target.value)}
                      required
                      placeholder="دەربارەی پلاتفۆرم"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757]"
                    />
                  </div>
                </div>

                {/* 2. Main Content Paragraphs */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>دەقە سەرەکییەکان (Content Paragraphs)</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      دەقی سەرەکی و ناساندن (Paragraph 1) *
                    </label>
                    <textarea
                      rows={4}
                      value={aboutParagraph1}
                      onChange={(e) => setAboutParagraph1(e.target.value)}
                      required
                      placeholder="بەخێربێن؛ ئەم وێبسایتە دەستپێشخەرییەکی خۆبەخشانەیە..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757] resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      مافی بەرهەمەکان و ڕوونکردنەوە (Paragraph 2)
                    </label>
                    <textarea
                      rows={4}
                      value={aboutParagraph2}
                      onChange={(e) => setAboutParagraph2(e.target.value)}
                      placeholder="سەرجەم مافە مەعنەوییەکانی بەرهەمەکان..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757] resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      تێبینی پەیوەندیکردن (Paragraph 3)
                    </label>
                    <textarea
                      rows={3}
                      value={aboutParagraph3}
                      onChange={(e) => setAboutParagraph3(e.target.value)}
                      placeholder="بۆ هەر پێشنیار، تێبینی، یان داواکارییەکی لابردنی بەرهەم..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-900 text-xs sm:text-sm font-sirwan focus:outline-none focus:border-[#d49757] resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* 3. Social Media & Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>تۆڕە کۆمەڵایەتییەکان و پەیوەندی (Social & Contact)</span>
                  </h3>

                  {/* Instagram Inputs */}
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/40 dark:bg-zinc-900/40 space-y-3">
                    <div className="text-xs font-bold font-sirwan text-pink-600 dark:text-pink-400 flex items-center gap-2">
                      <InstagramIcon className="w-4 h-4" />
                      <span>ئینستاگرام (Instagram)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1">
                          هەژماری ئینستاگرام (Handle)
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={aboutInstagramHandle}
                          onChange={(e) => setAboutInstagramHandle(e.target.value)}
                          placeholder="@hamahang_bwn"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono focus:outline-none focus:border-[#d49757]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1">
                          لینکی نامە و پەیج (URL)
                        </label>
                        <input
                          type="url"
                          dir="ltr"
                          value={aboutInstagramUrl}
                          onChange={(e) => setAboutInstagramUrl(e.target.value)}
                          placeholder="https://instagram.com/hamahang_bwn"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono focus:outline-none focus:border-[#d49757]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Telegram Inputs */}
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/40 dark:bg-zinc-900/40 space-y-3">
                    <div className="text-xs font-bold font-sirwan text-sky-600 dark:text-sky-400 flex items-center gap-2">
                      <TelegramIcon className="w-4 h-4 text-sky-500" />
                      <span>تێلیگرام (Telegram)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1">
                          کەناڵی تێلیگرام (Handle)
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={aboutTelegramHandle}
                          onChange={(e) => setAboutTelegramHandle(e.target.value)}
                          placeholder="@mediay_islamy"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono focus:outline-none focus:border-[#d49757]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1">
                          لینکی کەناڵ (URL)
                        </label>
                        <input
                          type="url"
                          dir="ltr"
                          value={aboutTelegramUrl}
                          onChange={(e) => setAboutTelegramUrl(e.target.value)}
                          placeholder="https://t.me/mediay_islamy"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono focus:outline-none focus:border-[#d49757]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4 border-t border-stone-100 dark:border-zinc-800 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isAboutSubmitting}
                    className="flex-1 py-3 px-6 rounded-xl bg-[#d49757] hover:bg-[#c28445] text-zinc-950 font-bold font-sirwan text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isAboutSubmitting ? 'پاشەکەوتکردن...' : 'پاشەکەوتکردنی گۆڕانکارییەکانی دەربارە'}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Side (5 cols) */}
            <div className="lg:col-span-5 space-y-4 sticky top-24">
              <div className="flex items-center gap-1.5 text-xs font-semibold font-sirwan text-zinc-500 dark:text-zinc-400">
                <Eye className="w-4 h-4 text-[#d49757]" />
                <span>پێشبینینی ڕاستەوخۆ لەسەر شێوازی پەڕەی دەربارە (Live Preview):</span>
              </div>

              {/* Exact Preview Replica matching app/about/page.tsx */}
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-950 border border-stone-200/80 dark:border-zinc-800 space-y-5 text-right shadow-md">
                {/* Simulated Language Switcher Banner */}
                <div className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-sirwan">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
                    <span className="text-amber-500">🌐</span>
                    <span>زمان / Language</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-zinc-950 font-bold">کوردی</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">العربية</span>
                  </div>
                </div>

                {/* Page Title */}
                <h1 className="text-xl sm:text-2xl font-bold font-peshang text-zinc-900 dark:text-white leading-normal">
                  {aboutTitle || 'دەربارەی پلاتفۆرم'}
                </h1>

                {/* Paragraph 1 */}
                <p className="text-xs sm:text-sm font-sirwan text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {aboutParagraph1 || DEFAULT_ABOUT_SETTINGS.paragraph_1}
                </p>

                {/* Paragraph 2 */}
                <p className="text-xs sm:text-sm font-sirwan text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {aboutParagraph2 || DEFAULT_ABOUT_SETTINGS.paragraph_2}
                </p>

                {/* Paragraph 3 / Note */}
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400 whitespace-pre-line">
                    {aboutParagraph3 || DEFAULT_ABOUT_SETTINGS.paragraph_3}
                  </p>
                </div>

                {/* Contact Action Buttons */}
                <div className="pt-2 space-y-2.5">
                  {/* Instagram Button */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0">
                        <InstagramIcon className="w-4 h-4" />
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-peshang text-zinc-900 dark:text-zinc-100 block">
                          ئینستاگرام
                        </span>
                        <span dir="ltr" className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                          {aboutInstagramHandle || DEFAULT_ABOUT_SETTINGS.instagram_handle}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-sirwan text-zinc-400">پەیام بنێرە ←</span>
                  </div>

                  {/* Telegram Button */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0">
                        <TelegramIcon className="w-4 h-4" />
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-peshang text-zinc-900 dark:text-zinc-100 block">
                          تێلیگرام
                        </span>
                        <span dir="ltr" className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                          {aboutTelegramHandle || DEFAULT_ABOUT_SETTINGS.telegram_handle}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-sirwan text-zinc-400">کەناڵی فەرمی ←</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: HOME HERO SETTINGS (پەڕەی سەرەکی)                     */}
      {/* ========================================================= */}
      {activeTab === 'home' && (
        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/70 dark:bg-[#16171b] border border-stone-200/80 dark:border-zinc-800 text-right shadow-2xs">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-400 text-xs font-semibold font-sirwan">
                <Sparkles className="w-3.5 h-3.5" />
                <span>دەستکاریکردنی پەڕەی سەرەکی</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                بەڕێوەبردنی بەشی سەرەکی (Hero Section)
              </h2>
              <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
                نیشانە، ناونیشان و وەسفی سەرەکی ماڵپەڕ بگۆڕە و ڕاستەوخۆ لە پەڕەی سەرەکی نوێ دەبێتەوە.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchHome}
                disabled={isHomeLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isHomeLoading ? 'animate-spin' : ''}`} />
                <span>نوێکردنەوە</span>
              </button>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 text-xs font-semibold font-sirwan transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>بینینی ماڵپەڕ</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Side (7 cols) */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSaveHome}
                className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#16171b] border border-stone-200/80 dark:border-zinc-800 space-y-6 text-right shadow-2xs"
              >
                {/* 1. Badge Text */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>نیشانەی سەرەوە (Badge Text)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      دەقی نیشانە کورتەکە
                    </label>
                    <input
                      type="text"
                      value={homeBadgeText}
                      onChange={(e) => setHomeBadgeText(e.target.value)}
                      placeholder="پانتاییەک بۆ سینەما و ئەدەبی ئیسلامی"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Main Title */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>ناونیشانی سەرەکی (Headline)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      ناونیشانی گەورەی سەرەکی
                    </label>
                    <input
                      type="text"
                      required
                      value={homeTitle}
                      onChange={(e) => setHomeTitle(e.target.value)}
                      placeholder="شوێنێک بۆ فیلم و نووسینی ئیسلامی"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-peshang focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Subtitle / Description */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>پێناسە و دەقی ژێرەوە (Subtitle)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      دەقی کورت و ڕوونکردنەوە
                    </label>
                    <textarea
                      rows={3}
                      value={homeSubtitle}
                      onChange={(e) => setHomeSubtitle(e.target.value)}
                      placeholder="ئەرشیفێکی کوردییە بۆ ناساندن و کۆکردنەوەی فیلم و ئەنیمەیشن..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors leading-relaxed"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isHomeSubmitting}
                    className="flex-1 py-3 px-6 rounded-xl bg-[#d49757] hover:bg-[#c28445] text-zinc-950 font-bold font-sirwan text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isHomeSubmitting ? 'پاشەکەوتکردن...' : 'پاشەکەوتکردنی ڕێکخستنەکانی پەڕەی سەرەکی'}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Side (5 cols) */}
            <div className="lg:col-span-5 space-y-4 sticky top-24">
              <div className="flex items-center gap-1.5 text-xs font-semibold font-sirwan text-zinc-500 dark:text-zinc-400">
                <Eye className="w-4 h-4 text-[#d49757]" />
                <span>پێشبینینی ڕاستەوخۆ (Live Preview):</span>
              </div>

              {/* Preview Container */}
              <div className="p-6 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-zinc-900/90 border border-stone-200/80 dark:border-zinc-800 space-y-6 text-center shadow-sm">
                {/* Subtle Brand Badge Preview */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-semibold font-sirwan tracking-normal shadow-2xs mx-auto">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>{homeBadgeText || 'نیشانەی سەرەوە'}</span>
                </div>

                {/* Stately Kurdish Headline Preview */}
                <h1 className="text-2xl sm:text-3xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
                  {homeTitle || 'ناونیشانی سەرەکی'}
                </h1>

                {/* Concise Subtitle Preview */}
                <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed tracking-normal">
                  {homeSubtitle || 'دەقی پێناسە و کورتەی پەڕەی سەرەکی...'}
                </p>

                {/* CTA Buttons Preview */}
                <div className="pt-2 flex items-center justify-center gap-2 pointer-events-none opacity-80">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-zinc-900/85 border border-zinc-200 dark:border-zinc-800 text-xs font-medium font-sirwan text-zinc-700 dark:text-zinc-300">
                    <Clapperboard className="w-3.5 h-3.5 text-amber-500" />
                    <span>فیلم و کارتۆن</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-zinc-900/85 border border-zinc-200 dark:border-zinc-800 text-xs font-medium font-sirwan text-zinc-700 dark:text-zinc-300">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                    <span>نووسین</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: MOVIES PAGE SETTINGS (پەڕەی فیلمەکان)                */}
      {/* ========================================================= */}
      {activeTab === 'moviesPage' && (
        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/70 dark:bg-[#16171b] border border-stone-200/80 dark:border-zinc-800 text-right shadow-2xs">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-400 text-xs font-semibold font-sirwan">
                <FilmIcon className="w-3.5 h-3.5" />
                <span>دەستکاریکردنی پەڕەی فیلم و کارتۆنەکان</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                بەڕێوەبردنی دەقەکانی پەڕەی فیلمەکان
              </h2>
              <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
                نیشانە، ناونیشانی سەرەکی، وەسف، دەقی گەڕان و پەیامی بەتاڵی پەڕەی فیلمەکان بگۆڕە و ڕاستەوخۆ نوێ دەبێتەوە.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchMoviesSettings}
                disabled={isMoviesLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isMoviesLoading ? 'animate-spin' : ''}`} />
                <span>نوێکردنەوە</span>
              </button>
              <Link
                href="/films"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 text-xs font-semibold font-sirwan transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>بینینی پەڕە</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Side (7 cols) */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSaveMoviesSettings}
                className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#16171b] border border-stone-200/80 dark:border-zinc-800 space-y-6 text-right shadow-2xs"
              >
                {/* 1. Badge Text */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>نیشانەی سەرەوە (Badge)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      دەقی نیشانە کورتەکە
                    </label>
                    <input
                      type="text"
                      value={moviesBadge}
                      onChange={(e) => setMoviesBadge(e.target.value)}
                      placeholder={DEFAULT_MOVIES_PAGE_SETTINGS.badge}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Main Title */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>ناونیشانی سەرەکی (Title)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      ناونیشانی گەورەی سەرەوە
                    </label>
                    <input
                      type="text"
                      value={moviesTitle}
                      onChange={(e) => setMoviesTitle(e.target.value)}
                      placeholder={DEFAULT_MOVIES_PAGE_SETTINGS.title}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* 3. Subtitle / Description */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>وەسف و کورتە (Subtitle)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      دەقی کورتەی ژێر ناونیشان
                    </label>
                    <textarea
                      rows={3}
                      value={moviesSubtitle}
                      onChange={(e) => setMoviesSubtitle(e.target.value)}
                      placeholder={DEFAULT_MOVIES_PAGE_SETTINGS.subtitle}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors resize-y"
                    />
                  </div>
                </div>

                {/* 4. Search Input Placeholder */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>دەقی ناو بۆکسی گەڕان (Search Placeholder)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      دەقی ڕێنمایی ناو خانەی گەڕان
                    </label>
                    <input
                      type="text"
                      value={moviesSearchPlaceholder}
                      onChange={(e) => setMoviesSearchPlaceholder(e.target.value)}
                      placeholder={DEFAULT_MOVIES_PAGE_SETTINGS.searchPlaceholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* 5. Empty State Message */}
                <div className="space-y-4 pb-2">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>پەیامی نەدۆزینەوەی ئەنجام (Empty State Message)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      دەقێک کاتێک هیچ فیلمێک بۆ فلتەر یان گەڕان نەدۆزرایەوە
                    </label>
                    <input
                      type="text"
                      value={moviesEmptyMessage}
                      onChange={(e) => setMoviesEmptyMessage(e.target.value)}
                      placeholder={DEFAULT_MOVIES_PAGE_SETTINGS.emptyMessage}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isMoviesSubmitting}
                    className="flex-1 py-3 px-6 rounded-xl bg-[#d49757] hover:bg-[#c28445] text-zinc-950 font-bold font-sirwan text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isMoviesSubmitting ? 'پاشەکەوتکردن...' : 'پاشەکەوتکردنی ڕێکخستنەکانی پەڕەی فیلمەکان'}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Side (5 cols) */}
            <div className="lg:col-span-5 space-y-4 sticky top-24">
              <div className="flex items-center gap-1.5 text-xs font-semibold font-sirwan text-zinc-500 dark:text-zinc-400">
                <Eye className="w-4 h-4 text-[#d49757]" />
                <span>پێشبینینی ڕاستەوخۆ (Live Preview):</span>
              </div>

              {/* Preview Container */}
              <div className="p-6 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-zinc-900/90 border border-stone-200/80 dark:border-zinc-800 space-y-5 text-center shadow-sm">
                {/* Badge Preview */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-semibold font-sirwan tracking-normal shadow-2xs mx-auto">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>{moviesBadge || DEFAULT_MOVIES_PAGE_SETTINGS.badge}</span>
                </div>

                {/* Title Preview */}
                <h1 className="text-2xl sm:text-3xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
                  {moviesTitle || DEFAULT_MOVIES_PAGE_SETTINGS.title}
                </h1>

                {/* Subtitle Preview */}
                <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed tracking-normal">
                  {moviesSubtitle || DEFAULT_MOVIES_PAGE_SETTINGS.subtitle}
                </p>

                {/* Search Bar Preview */}
                <div className="pt-2 pointer-events-none opacity-85">
                  <div className="relative w-full max-w-xs mx-auto">
                    <input
                      type="text"
                      readOnly
                      placeholder={moviesSearchPlaceholder || DEFAULT_MOVIES_PAGE_SETTINGS.searchPlaceholder}
                      className="w-full py-2 pr-9 pl-4 text-xs font-sirwan rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-right text-zinc-400"
                    />
                    <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                {/* Empty State Note Preview */}
                <div className="pt-2 border-t border-stone-100 dark:border-zinc-800/80 text-xs text-zinc-400 font-sirwan">
                  <span>دەقی نەدۆزینەوە: </span>
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">«{moviesEmptyMessage || DEFAULT_MOVIES_PAGE_SETTINGS.emptyMessage}»</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: WRITINGS PAGE SETTINGS (پەڕەی نووسینەکان)             */}
      {/* ========================================================= */}
      {activeTab === 'writingsPage' && (
        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/70 dark:bg-[#16171b] border border-stone-200/80 dark:border-zinc-800 text-right shadow-2xs">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-400 text-xs font-semibold font-sirwan">
                <FileText className="w-3.5 h-3.5" />
                <span>دەستکاریکردنی پەڕەی نووسین و وتارەکان</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-peshang text-zinc-900 dark:text-zinc-100">
                بەڕێوەبردنی دەقەکانی پەڕەی نووسینەکان
              </h2>
              <p className="text-xs font-sirwan text-zinc-500 dark:text-zinc-400">
                نیشانە، ناونیشانی سەرەکی، وەسف، دەقی گەڕان و پەیامی بەتاڵی پەڕەی نووسین و ئەدەب بگۆڕە و ڕاستەوخۆ نوێ دەبێتەوە.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchWritingsSettings}
                disabled={isWritingsLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isWritingsLoading ? 'animate-spin' : ''}`} />
                <span>نوێکردنەوە</span>
              </button>
              <Link
                href="/articles"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 text-xs font-semibold font-sirwan transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>بینینی پەڕە</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Side (7 cols) */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSaveWritingsSettings}
                className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#16171b] border border-stone-200/80 dark:border-zinc-800 space-y-6 text-right shadow-2xs"
              >
                {/* 1. Badge Text */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>نیشانەی سەرەوە (Badge)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      دەقی نیشانە کورتەکە
                    </label>
                    <input
                      type="text"
                      value={writingsBadge}
                      onChange={(e) => setWritingsBadge(e.target.value)}
                      placeholder={DEFAULT_WRITINGS_PAGE_SETTINGS.badge}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Main Title */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>ناونیشانی سەرەکی (Title)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      ناونیشانی گەورەی سەرەوە
                    </label>
                    <input
                      type="text"
                      value={writingsTitle}
                      onChange={(e) => setWritingsTitle(e.target.value)}
                      placeholder={DEFAULT_WRITINGS_PAGE_SETTINGS.title}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* 3. Subtitle / Description */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>وەسف و کورتە (Subtitle)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      دەقی کورتەی ژێر ناونیشان
                    </label>
                    <textarea
                      rows={3}
                      value={writingsSubtitle}
                      onChange={(e) => setWritingsSubtitle(e.target.value)}
                      placeholder={DEFAULT_WRITINGS_PAGE_SETTINGS.subtitle}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors resize-y"
                    />
                  </div>
                </div>

                {/* 4. Search Input Placeholder */}
                <div className="space-y-4 pb-5 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>دەقی ناو بۆکسی گەڕان (Search Placeholder)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      دەقی ڕێنمایی ناو خانەی گەڕان
                    </label>
                    <input
                      type="text"
                      value={writingsSearchPlaceholder}
                      onChange={(e) => setWritingsSearchPlaceholder(e.target.value)}
                      placeholder={DEFAULT_WRITINGS_PAGE_SETTINGS.searchPlaceholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* 5. Empty State Message */}
                <div className="space-y-4 pb-2">
                  <h3 className="text-sm font-bold font-peshang text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>پەیامی نەدۆزینەوەی ئەنجام (Empty State Message)</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 mb-1.5">
                      دەقێک کاتێک هیچ وتارێک بۆ فلتەر یان گەڕان نەدۆزرایەوە
                    </label>
                    <input
                      type="text"
                      value={writingsEmptyMessage}
                      onChange={(e) => setWritingsEmptyMessage(e.target.value)}
                      placeholder={DEFAULT_WRITINGS_PAGE_SETTINGS.emptyMessage}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm font-sirwan focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isWritingsSubmitting}
                    className="flex-1 py-3 px-6 rounded-xl bg-[#d49757] hover:bg-[#c28445] text-zinc-950 font-bold font-sirwan text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isWritingsSubmitting ? 'پاشەکەوتکردن...' : 'پاشەکەوتکردنی ڕێکخستنەکانی پەڕەی نووسینەکان'}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Side (5 cols) */}
            <div className="lg:col-span-5 space-y-4 sticky top-24">
              <div className="flex items-center gap-1.5 text-xs font-semibold font-sirwan text-zinc-500 dark:text-zinc-400">
                <Eye className="w-4 h-4 text-[#d49757]" />
                <span>پێشبینینی ڕاستەوخۆ (Live Preview):</span>
              </div>

              {/* Preview Container */}
              <div className="p-6 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-zinc-900/90 border border-stone-200/80 dark:border-zinc-800 space-y-5 text-center shadow-sm">
                {/* Badge Preview */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-semibold font-sirwan tracking-normal shadow-2xs mx-auto">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>{writingsBadge || DEFAULT_WRITINGS_PAGE_SETTINGS.badge}</span>
                </div>

                {/* Title Preview */}
                <h1 className="text-2xl sm:text-3xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100 leading-normal">
                  {writingsTitle || DEFAULT_WRITINGS_PAGE_SETTINGS.title}
                </h1>

                {/* Subtitle Preview */}
                <p className="text-xs sm:text-sm font-normal font-sirwan text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed tracking-normal">
                  {writingsSubtitle || DEFAULT_WRITINGS_PAGE_SETTINGS.subtitle}
                </p>

                {/* Search Bar Preview */}
                <div className="pt-2 pointer-events-none opacity-85">
                  <div className="relative w-full max-w-xs mx-auto">
                    <input
                      type="text"
                      readOnly
                      placeholder={writingsSearchPlaceholder || DEFAULT_WRITINGS_PAGE_SETTINGS.searchPlaceholder}
                      className="w-full py-2 pr-9 pl-4 text-xs font-sirwan rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-right text-zinc-400"
                    />
                    <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                {/* Empty State Note Preview */}
                <div className="pt-2 border-t border-stone-100 dark:border-zinc-800/80 text-xs text-zinc-400 font-sirwan">
                  <span>دەقی نەدۆزینەوە: </span>
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">«{writingsEmptyMessage || DEFAULT_WRITINGS_PAGE_SETTINGS.emptyMessage}»</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
