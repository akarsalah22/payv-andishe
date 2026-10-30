"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock,
  User,
  KeyRound,
  Plus,
  BookOpen,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  LogOut,
  X,
  Clapperboard,
  Send,
  Upload,
  Pencil,
  Search,
  ShieldCheck,
  Copy,
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';
import { SAMPLE_FILMS, type Film, type FilmCategory } from '@/data/films';
import { SAMPLE_ARTICLES, type Article, type ArticleCategory } from '@/data/articles';
import { FilmCard } from '@/components/FilmCard';
import { ArticleCard } from '@/components/ArticleCard';

type AdminTab = 'films' | 'articles' | 'create';
type CreateItemType = 'film' | 'article';

const VALID_USER = (process.env.NEXT_PUBLIC_ADMIN_USER || "akar").trim();
const VALID_PASS = (process.env.NEXT_PUBLIC_ADMIN_PASS || "#akar123").trim();

// =========================================================================
// 1. SECURE USERNAME & PASSWORD LOGIN COMPONENT (Strict Authentication Gate)
// =========================================================================
interface AdminLoginProps {
  onSuccess: () => void;
}

function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUser = username.trim();
    const isUserValid = trimmedUser === VALID_USER || trimmedUser.toLowerCase() === VALID_USER.toLowerCase();
    const isPassValid = password === VALID_PASS;

    if (isUserValid && isPassValid) {
      try {
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("payvandishe_admin_session", "true");
        localStorage.removeItem("admin_auth"); // Purge legacy permanent bypass
      } catch {
        // ignore
      }
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <main
      dir="rtl"
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 min-h-[75vh] text-right select-none"
    >
      <div className="w-full max-w-md mx-auto bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-lg dark:bg-zinc-900/90 dark:border-zinc-800 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" strokeWidth={1.75} />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-peshang tracking-normal text-stone-900 dark:text-zinc-100">
            چوونەژوورەوەی بەڕێوەبەر
          </h1>
          <p className="text-xs sm:text-sm font-normal font-sirwan text-stone-600 dark:text-zinc-400 leading-relaxed">
            تکایە ناوی بەکارهێنەر و تێپەڕەوشە بنووسە
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/25 dark:text-rose-400 text-xs font-semibold font-sirwan text-right animate-in fade-in duration-200">
            ناوی بەکارهێنەر یان تێپەڕەوشە هەڵەیە!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="usernameInput"
              className="block text-xs font-semibold font-sirwan text-stone-700 dark:text-zinc-300"
            >
              ناوی بەکارهێنەر
            </label>
            <div className="relative w-full">
              <input
                id="usernameInput"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="ناوی بەکارهێنەر..."
                className="w-full pr-10 pl-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:focus:border-amber-500 dark:focus:ring-amber-500 transition-colors font-sans"
                autoFocus
                required
                autoComplete="username"
                dir="ltr"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-500 pointer-events-none">
                <User className="w-4 h-4" strokeWidth={1.75} />
              </div>
            </div>
          </div>

          {/* Field 2: Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="passwordInput"
              className="block text-xs font-semibold font-sirwan text-stone-700 dark:text-zinc-300"
            >
              تێپەڕەوشە
            </label>
            <div className="relative w-full">
              <input
                id="passwordInput"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="تێپەڕەوشە..."
                className="w-full pr-10 pl-11 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:focus:border-amber-500 dark:focus:ring-amber-500 transition-colors font-sans"
                required
                autoComplete="current-password"
                dir="ltr"
              />
              {/* Lucide KeyRound icon on the right (RTL) */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-500 pointer-events-none">
                <KeyRound className="w-4 h-4" strokeWidth={1.75} />
              </div>
              {/* Eye toggle button on the left */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? "شاردنەوەی تێپەڕەوشە" : "پیشاندانی تێپەڕەوشە"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#d49757] hover:bg-[#c28747] active:scale-95 text-zinc-950 font-bold font-sirwan text-sm tracking-normal shadow-sm transition-transform duration-150 ease-out cursor-pointer touch-manipulation tap-highlight-transparent"
            >
              چوونە ناو پەنێڵ
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-stone-200 dark:border-zinc-800">
          <Link
            href="/"
            className="text-xs font-sirwan text-stone-500 hover:text-stone-800 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
          >
            گەڕانەوە بۆ لاپەڕەی سەرەکی
          </Link>
        </div>
      </div>
    </main>
  );
}

// =========================================================================
// 2. AUTHENTICATED DASHBOARD COMPONENT (Full CRUD & Controls)
// =========================================================================
interface AdminDashboardProps {
  onLogout: () => void;
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  // Tab Navigation & Edit Modes
  const [activeTab, setActiveTab] = useState<AdminTab>('films');
  const [createType, setCreateType] = useState<CreateItemType>('film');
  const [editingFilmId, setEditingFilmId] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
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
  const [filmCategory, setFilmCategory] = useState<FilmCategory>('سینەمایی');
  const [filmGenres, setFilmGenres] = useState('دراما، سینەما');
  const [filmYear, setFilmYear] = useState<number>(new Date().getFullYear());
  const [filmDuration, setFilmDuration] = useState('١ کاتژمێر و ٥٠ خولەک');
  const [filmPosterUrl, setFilmPosterUrl] = useState('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80');
  const [filmTelegramUrl, setFilmTelegramUrl] = useState('https://t.me/mediay_islami');
  const [filmDescription, setFilmDescription] = useState('');

  // Article Form State
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [articleCategory, setArticleCategory] = useState<ArticleCategory>('ڕامان');
  const [articleReadTime, setArticleReadTime] = useState('٥ خولەک خوێندنەوە');
  const [articleCoverImage, setArticleCoverImage] = useState('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('پەیڤ و ئەندێشە');

  // Fetch films from API and synchronize with localStorage
  const fetchFilms = async () => {
    try {
      const res = await fetch('/api/films');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFilms(data);
          try {
            localStorage.setItem('payvandishe_films', JSON.stringify(data));
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
      const storedFilms = localStorage.getItem('payvandishe_films');
      if (storedFilms) {
        setFilms(JSON.parse(storedFilms));
      } else {
        setFilms(SAMPLE_FILMS);
        localStorage.setItem('payvandishe_films', JSON.stringify(SAMPLE_FILMS));
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
            localStorage.setItem('payvandishe_articles', JSON.stringify(data));
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
      const storedArticles = localStorage.getItem('payvandishe_articles');
      if (storedArticles) {
        setArticles(JSON.parse(storedArticles));
      } else {
        setArticles(SAMPLE_ARTICLES);
        localStorage.setItem('payvandishe_articles', JSON.stringify(SAMPLE_ARTICLES));
      }
    } catch {
      setArticles(SAMPLE_ARTICLES);
    }
  };

  // Initial load of data from disk API
  useEffect(() => {
    fetchFilms();
    fetchArticles();
  }, []);

  // Sync films to localStorage
  const saveFilmsToStorage = (updatedFilms: Film[]) => {
    setFilms(updatedFilms);
    try {
      localStorage.setItem('payvandishe_films', JSON.stringify(updatedFilms));
    } catch (e) {
      console.error('Error saving films:', e);
    }
  };

  // Sync articles to localStorage
  const saveArticlesToStorage = (updatedArticles: Article[]) => {
    setArticles(updatedArticles);
    try {
      localStorage.setItem('payvandishe_articles', JSON.stringify(updatedArticles));
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

  // Reset Form States
  const resetFilmForm = () => {
    setFilmTitleKurdish('');
    setFilmOriginalTitle('');
    setFilmCategory('سینەمایی');
    setFilmGenres('دراما، سینەما');
    setFilmYear(new Date().getFullYear());
    setFilmDuration('١ کاتژمێر و ٥٠ خولەک');
    setFilmPosterUrl('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80');
    setFilmTelegramUrl('https://t.me/mediay_islami');
    setFilmDescription('');
  };

  const resetArticleForm = () => {
    setArticleTitle('');
    setArticleSlug('');
    setArticleCategory('ڕامان');
    setArticleReadTime('٥ خولەک خوێندنەوە');
    setArticleCoverImage('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80');
    setArticleExcerpt('');
    setArticleContent('');
    setArticleAuthor('پەیڤ و ئەندێشە');
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
    setFilmTelegramUrl(film.telegramPostUrl);
    setFilmDescription(film.description);
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
      triggerToast('تکایە ناوی فیلم و بەستەری تێلیگرام بنووسە', undefined, 'error');
      return;
    }

    const genreList = filmGenres
      .split(/[,،]/)
      .map((g) => g.trim())
      .filter(Boolean);

    const isEditMode = Boolean(editingFilmId);
    const method = isEditMode ? 'PUT' : 'POST';

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
      description: filmDescription.trim() || 'ناساندنی ئەم شاکارە سینەمایییە لە کەناڵی تێلیگرام.',
      telegramPostUrl: filmTelegramUrl.trim(),
    };

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
          isEditMode ? 'زانیارییەکانی فیلم نوێکرانەوە' : 'فیلمەکە زیاد کرا',
          {
            href: '/films',
            label: 'بینینی بابەت',
          },
          'success'
        );
        setActiveTab('films');
        return;
      }
    } catch (err) {
      console.error('Error saving film via API, fallback to localStorage:', err);
    }

    // Fallback if API fails
    if (editingFilmId) {
      const updated = films.map((f) => (f.id === editingFilmId ? payload : f));
      saveFilmsToStorage(updated);
      triggerToast('زانیارییەکانی فیلم نوێکرانەوە', {
        href: '/films',
        label: 'بینینی بابەت',
      }, 'success');
    } else {
      const updated = [payload, ...films];
      saveFilmsToStorage(updated);
      triggerToast('فیلمەکە زیاد کرا', {
        href: '/films',
        label: 'بینینی بابەت',
      }, 'success');
    }
    setEditingFilmId(null);
    resetFilmForm();
    setActiveTab('films');
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
    setArticleAuthor(article.author || 'پەیڤ و ئەندێشە');
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
      triggerToast('تکایە ناونیشانی وتار و دەقی بابەتەکە بنووسە', undefined, 'error');
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
          author: articleAuthor.trim() || 'پەیڤ و ئەندێشە',
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
      console.error('Error saving article via API, falling back to localStorage:', err);
      if (isEditMode && editingArticle) {
        const updated = articles.map((a) => (a.id === editingArticle.id ? (payload as Article) : a));
        saveArticlesToStorage(updated);
      } else {
        const updated = [payload as Article, ...articles];
        saveArticlesToStorage(updated);
      }
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

  // Filtered Collections
  const filteredFilms = useMemo(() => {
    const q = filmsSearchQuery.trim().toLowerCase();
    if (!q) return films;
    return films.filter(
      (f) =>
        f.titleKurdish.toLowerCase().includes(q) ||
        (f.originalTitle && f.originalTitle.toLowerCase().includes(q)) ||
        f.year.toString().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.genres.some((g) => g.toLowerCase().includes(q))
    );
  }, [films, filmsSearchQuery]);

  const filteredArticles = useMemo(() => {
    const q = articlesSearchQuery.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.author && a.author.toLowerCase().includes(q)) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q))
    );
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
    telegramPostUrl: filmTelegramUrl.trim() || 'https://t.me/mediay_islami',
  }), [editingFilmId, filmTitleKurdish, filmOriginalTitle, filmYear, filmDuration, filmCategory, filmGenres, filmPosterUrl, filmDescription, filmTelegramUrl]);

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
    author: articleAuthor.trim() || 'پەیڤ و ئەندێشە',
  }), [editingArticle, articleTitle, articleSlug, articleExcerpt, articleContent, articleCategory, articleReadTime, articleCoverImage, articleAuthor]);

  return (
    <main
      dir="rtl"
      className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full py-10 space-y-8 text-right select-none"
    >
      {/* Admin Header & Session Controls Bar */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 dark:border-zinc-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold font-sirwan bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>بەخێربێیت بەڕێوەبەر</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100">
            بەڕێوەبردنی پەیڤ و ئەندێشە
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
            onClick={onLogout}
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer ${
              activeTab === 'films'
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer ${
              activeTab === 'articles'
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
            onClick={() => {
              setActiveTab('create');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 active:scale-95 cursor-pointer ${
              activeTab === 'create'
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
            <div className="text-center py-12 rounded-2xl border border-dashed border-stone-300 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/30 space-y-2">
              <Clapperboard className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-sm font-semibold font-sirwan text-zinc-600 dark:text-zinc-400">
                هیچ فیلمێک بەم زانیارییە نەدۆزرایەوە.
              </p>
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
                        src={film.posterUrl}
                        alt={film.titleKurdish}
                        fill
                        unoptimized={film.posterUrl.startsWith('data:')}
                        sizes="56px"
                        className="object-cover"
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
                    <a
                      href={film.telegramPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-500/20 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold font-sirwan transition-colors cursor-pointer"
                      title="تاقیکردنەوەی بەستەری تێلیگرام"
                    >
                      <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span className="hidden md:inline">تێلیگرام</span>
                    </a>

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
            <div className="text-center py-12 rounded-2xl border border-dashed border-stone-300 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/30 space-y-2">
              <BookOpen className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-sm font-semibold font-sirwan text-zinc-600 dark:text-zinc-400">
                هیچ وتارێک بەم زانیارییە نەدۆزرایەوە.
              </p>
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
                          src={cover}
                          alt={article.title}
                          fill
                          unoptimized={cover.startsWith('data:')}
                          sizes="80px"
                          className="object-cover"
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
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 cursor-pointer ${
                    createType === 'film'
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
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold font-sirwan transition-all duration-150 cursor-pointer ${
                    createType === 'article'
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
                        <option value="سینەمایی">سینەمایی</option>
                        <option value="ئەنیمەیشن">ئەنیمەیشن</option>
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

                  <div>
                    <label className="block text-xs font-semibold font-sirwan text-zinc-700 dark:text-zinc-300 mb-1">
                      بەستەری پۆستی تێلیگرام <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={filmTelegramUrl}
                      onChange={(e) => setFilmTelegramUrl(e.target.value)}
                      placeholder="https://t.me/mediay_islami/101"
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

                  {/* Action Buttons: Unified Save & Cancel */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#d49757] hover:bg-[#c28747] text-zinc-950 font-bold font-sirwan text-sm tracking-normal shadow-sm transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation tap-highlight-transparent"
                    >
                      {editingFilmId ? 'پاشەکەوتکردنی گۆڕانکارییەکان' : 'پاشەکەوتکردن و بڵاوکردنەوەی فیلم'}
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
                        <option value="ڕامان">ڕامان</option>
                        <option value="سینەما و هزر">سینەما و هزر</option>
                        <option value="کتێبناسی">کتێبناسی</option>
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
                        placeholder="پەیڤ و ئەندێشە"
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
    </main>
  );
}

// =========================================================================
// 3. MAIN ADMIN PAGE WRAPPER (Strict Route Protection)
// =========================================================================
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Strictly check active tab session on mount, purges permanent localStorage
  useEffect(() => {
    try {
      localStorage.removeItem("admin_auth"); // Purge legacy permanent bypass
      const sessionActive = sessionStorage.getItem("payvandishe_admin_session") === "true";
      setIsAuthenticated(sessionActive);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsReady(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("payvandishe_admin_session");
      sessionStorage.removeItem("payvandishe_admin_auth");
      sessionStorage.removeItem("admin_auth");
      localStorage.removeItem("admin_auth");
    } catch {
      // ignore
    }
  };

  // Prevent flash before checking session
  if (!isReady) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-xs font-sirwan text-stone-500 dark:text-zinc-400">
        چاوەڕوان بە...
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onSuccess={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}
