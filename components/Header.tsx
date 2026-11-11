"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Home,
  Film,
  FileText,
  Info,
  Search,
  ShieldCheck,
  Bookmark,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SearchModal } from './SearchModal';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { LogoReveal } from './LogoReveal';
import { useLanguage } from '@/context/LanguageContext';
import { useFavorites } from '@/hooks/useFavorites';

interface NavLinkConfig {
  key: string;
  defaultName: string;
  href: string;
  icon: typeof Home;
  isExternal?: boolean;
}

const NAV_LINKS_CONFIG: NavLinkConfig[] = [
  { key: 'nav.home', defaultName: 'سەرەکی', href: '/', icon: Home },
  { key: 'nav.films', defaultName: 'فیلم', href: '/films', icon: Film },
  { key: 'nav.articles', defaultName: 'نووسین', href: '/articles', icon: FileText },
  { key: 'nav.about', defaultName: 'دەربارە', href: '/about', icon: Info },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();
  const { t, isRtl } = useLanguage();

  // Check if admin is currently authenticated via synchronous client cookie (runs strictly once on mount)
  useEffect(() => {
    const isAuth =
      typeof document !== 'undefined' &&
      document.cookie.includes('admin_logged_in=true');
    setIsAdminAuthenticated(isAuth);
  }, []);

  // Listen to cross-tab storage changes (e.g. login/logout in another window)
  useEffect(() => {
    const handleStorageChange = () => {
      const isAuth =
        typeof document !== 'undefined' &&
        document.cookie.includes('admin_logged_in=true');
      setIsAdminAuthenticated(isAuth);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Prevent mobile scroll chaining / lock body scroll when drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isMenuOpen]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K for search, Escape for closing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check if a link is currently active
  const isLinkActive = useCallback(
    (href: string, isExternal?: boolean) => {
      if (isExternal || href.startsWith('#')) return false;
      if (href === '/') return pathname === '/';
      return pathname.startsWith(href);
    },
    [pathname]
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-[#121214]/80 backdrop-blur-md transition-colors duration-300">
        <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-3.5 sm:px-6 lg:px-8">
          {/* Brand Logo / Clean Title */}
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0 select-none cursor-pointer py-1 px-3 sm:px-4"
          >
            {/* Cinematic SVG Stroke Logo Reveal */}
            <div className="transition-transform duration-200 group-hover:scale-105">
              <LogoReveal className="w-8 h-8 sm:w-9 sm:h-9" size={36} priority={true} />
            </div>

            {/* Brand Text (Hidden on mobile phones, visible on tablet & desktop) */}
            <span className="hidden sm:inline font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap tracking-tight leading-none select-none">
              {t('brand.title', 'میدیای ئیسلامی')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {NAV_LINKS_CONFIG.map((link) => {
              const active = isLinkActive(link.href, link.isExternal);
              const label = t(link.key, link.defaultName);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  prefetch={false}
                  className={`rounded-xl px-3.5 py-1.5 text-sm font-medium tracking-normal transition-all duration-200 ease-out active:scale-95 select-none tap-highlight-transparent ${active
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold'
                    : 'text-zinc-600 hover:text-amber-600 hover:bg-amber-500/10 dark:text-zinc-400 dark:hover:text-amber-400 dark:hover:bg-amber-500/10'
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Actions (Admin Quick-Link, Random Discovery, Search, Language Switcher, Theme Toggle, Mobile Hamburger Button) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Authenticated Admin Quick-Link */}
            {isAdminAuthenticated && (
              <Link
                href="/admin/dashboard"
                aria-label={t('nav.admin', 'بەڕێوەبردن')}
                title={t('nav.admin', 'بەڕێوەبردن')}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold font-sirwan transition-all duration-200 ease-out active:scale-95 shadow-2xs select-none tap-highlight-transparent"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.75} />
                <span className="hidden sm:inline">{t('nav.admin', 'بەڕێوەبردن')}</span>
              </Link>
            )}

            {/* Saved Items (Watchlist) Quick Button */}
            <Link
              href="/saved"
              aria-label={`${t('nav.saved', 'هەڵگیراوەکانم')} (${favoritesCount})`}
              title={t('nav.saved', 'هەڵگیراوەکانم')}
              className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/80 active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent ${pathname === '/saved'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                : ''
                }`}
            >
              <Bookmark className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={1.8} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-bold font-sans flex items-center justify-center shadow-xs pointer-events-none animate-badge-enter">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label={t('nav.search', 'گەڕان')}
              title={t('nav.search', 'گەڕان')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/80 dark:active:bg-zinc-700 active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <Search className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={1.8} />
            </button>

            {/* Language Switcher (Hidden on mobile header, available in drawer and about page) */}
            <div className="hidden md:flex items-center">
              <LanguageSwitcher />
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Mobile Hamburger Button (Safe tap zone without edge clipping) */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label={t('nav.open_menu', 'کردنەوەی مێنیو')}
              aria-expanded={isMenuOpen}
              className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/80 dark:active:bg-zinc-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <Menu className="w-5 h-5 shrink-0" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {/* Classic Minimalist Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        favoritesCount={favoritesCount}
        isAdminAuthenticated={isAdminAuthenticated}
      />

      {/* Global Search Modal Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
