"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
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
import { RandomMovieButton } from './RandomMovieButton';
import { LanguageSwitcher } from './LanguageSwitcher';
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
  { key: 'nav.films', defaultName: 'فیلم و کارتۆن', href: '/films', icon: Film },
  { key: 'nav.articles', defaultName: 'نووسین و وتار', href: '/articles', icon: FileText },
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
            className="flex items-center gap-1.5 group shrink-0 select-none cursor-pointer"
          >
            {/* Logo Container */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo_web_new1.svg"
                alt="میدیای ئیسلامی"
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain"
              />
            </div>

            {/* Brand Text */}
            <span className="text-[10px] sm:text-xs font-medium text-zinc-400 dark:text-zinc-400 whitespace-nowrap tracking-tight leading-none select-none">
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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

            {/* Random Discovery Action (Desktop) */}
            <RandomMovieButton variant="header" className="hidden lg:inline-flex" />

            {/* Saved Items (Watchlist) Quick Button */}
            <Link
              href="/saved"
              aria-label={`${t('nav.saved', 'هەڵگیراوەکانم')} (${favoritesCount})`}
              title={t('nav.saved', 'هەڵگیراوەکانم')}
              className={`relative p-1.5 sm:p-2 rounded-xl transition-all duration-200 flex items-center justify-center text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/80 active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent ${pathname === '/saved'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                : ''
                }`}
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-bold font-sans flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-200">
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
              className="p-1.5 sm:p-2 rounded-xl transition-all duration-200 flex items-center justify-center text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/80 dark:active:bg-zinc-700 active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
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
              className="md:hidden p-1.5 sm:p-2 rounded-xl transition-all duration-200 flex items-center justify-center text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/80 dark:active:bg-zinc-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer touch-manipulation select-none tap-highlight-transparent shrink-0"
            >
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Native Fluid Sliding Drawer) */}
      <div
        className={`fixed inset-0 z-[99] md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
          }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop Fade Overlay */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out cursor-pointer ${isMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          aria-hidden="true"
        />

        {/* Sliding Drawer Container from the Right Side (in RTL) or Left Side (in LTR) */}
        <div
          className={`fixed inset-y-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'
            } w-[68vw] max-w-[290px] min-w-[260px] bg-white/95 text-zinc-900 border-zinc-200 dark:bg-zinc-950/95 dark:text-zinc-100 dark:border-zinc-800/80 shadow-2xl flex flex-col justify-between z-[100] transform transition-transform duration-300 ease-out text-start ${isMenuOpen
              ? 'translate-x-0'
              : isRtl
                ? 'translate-x-full'
                : '-translate-x-full'
            }`}
        >
          {/* Header inside drawer */}
          <div className="h-14 px-3 flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 shrink-0">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-1.5 group shrink-0 select-none cursor-pointer"
            >
              <div className="relative w-6 h-6 shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/logo_web_new1.svg"
                  alt={t('brand.title', 'میدیای ئیسلامی')}
                  width={24}
                  height={24}
                  priority
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap tracking-tight leading-none select-none">
                {t('brand.title', 'میدیای ئیسلامی')}
              </span>
            </Link>

            {/* Small rounded close icon button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label={t('nav.close_menu', 'داخستنی مێنۆ')}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors duration-150 active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          {/* Middle Scrollable Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 flex flex-col gap-3">
            {/* Quick Action Bar (Search & Shuffle) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                aria-label={t('nav.search', 'گەڕان')}
                className="flex-1 min-w-0 flex items-center gap-2 py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 text-xs text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800 hover:border-amber-500/40 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all select-none cursor-pointer touch-manipulation active:scale-[0.98]"
              >
                <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{t('nav.search_input_placeholder', 'گەڕان...')}</span>
              </button>

              <RandomMovieButton
                variant="compact"
                label={t('nav.surprise_short', 'چی سەیر کەم؟')}
                onPick={() => setIsMenuOpen(false)}
                className="shrink-0 h-[34px] !py-1.5 !px-2.5 !rounded-xl !text-xs !bg-zinc-100 hover:!bg-zinc-200/80 dark:!bg-zinc-900/90 dark:hover:!bg-zinc-800 !border-zinc-200/60 dark:!border-zinc-800 hover:!border-amber-500/40 text-zinc-700 dark:text-zinc-300"
              />
            </div>

            {/* Navigation Links (Sleek List Style) */}
            <nav className="flex flex-col space-y-1">
              {NAV_LINKS_CONFIG.map((link) => {
                const active = isLinkActive(link.href, link.isExternal);
                const IconComponent = link.icon;
                const label = t(link.key, link.defaultName);
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    prefetch={false}
                    onClick={() => setIsMenuOpen(false)}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors select-none tap-highlight-transparent active:scale-[0.98] ${active
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                      }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 shrink-0 transition-colors ${active
                        ? 'text-amber-500'
                        : 'text-zinc-400 group-hover:text-amber-500'
                        }`}
                      strokeWidth={1.8}
                    />
                    <span>{label}</span>
                  </Link>
                );
              })}

              {/* Watchlist item */}
              <Link
                href="/saved"
                prefetch={false}
                onClick={() => setIsMenuOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors select-none tap-highlight-transparent active:scale-[0.98] ${pathname === '/saved'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
              >
                <Bookmark
                  className={`w-4 h-4 shrink-0 transition-colors ${pathname === '/saved'
                    ? 'text-amber-500'
                    : 'text-zinc-400 group-hover:text-amber-500'
                    }`}
                  strokeWidth={1.8}
                />
                <span>{t('nav.saved', 'هەڵگیراوەکانم')}</span>
                {favoritesCount > 0 && (
                  <span className="ms-auto bg-amber-500 text-zinc-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {/* Admin Link ("بەڕێوەبردن") */}
              {isAdminAuthenticated && (
                <div className="pt-2 mt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors select-none tap-highlight-transparent"
                  >
                    <ShieldCheck className="w-4 h-4 text-zinc-400" strokeWidth={1.8} />
                    <span>{t('nav.admin', 'بەڕێوەبردن')}</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* Footer Dock (Theme & Language) */}
          <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 p-3 flex items-center justify-between shrink-0">
            <LanguageSwitcher direction="up" showChevron />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Global Search Modal Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
