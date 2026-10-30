"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Send,
  Home,
  Film,
  FileText,
  Info,
  ExternalLink,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SearchModal } from './SearchModal';

interface NavLinkItem {
  name: string;
  href: string;
  icon: typeof Home;
  isExternal?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { name: 'سەرەکی', href: '/', icon: Home },
  { name: 'فیلم و کارتۆن', href: '/films', icon: Film },
  { name: 'نووسین و وتار', href: '/articles', icon: FileText },
  { name: 'دەربارە', href: '/about', icon: Info },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const pathname = usePathname();

  // Check if admin is currently authenticated in session
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth =
          sessionStorage.getItem('admin_auth') === 'true' ||
          sessionStorage.getItem('payvandishe_admin_session') === 'true';
        setIsAdminAuthenticated(isAuth);
      } catch {
        setIsAdminAuthenticated(false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('focus', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('focus', checkAuth);
    };
  }, [pathname]);

  // Prevent mobile scroll chaining / lock body scroll when drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
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
  const isLinkActive = (href: string, isExternal?: boolean) => {
    if (isExternal || href.startsWith('#')) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#ede8e1]/80 bg-[#faf8f5]/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-[#121316]/80 transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo / Clean Title */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-zinc-900 dark:text-zinc-100 transition-colors select-none"
          >
            <span className="text-xl sm:text-2xl font-bold font-peshang tracking-normal group-hover:text-[#d49757] transition-colors">
              میدیای ئیسلامی
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href, link.isExternal);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`rounded-xl px-3.5 py-1.5 text-sm font-medium font-sirwan tracking-normal transition-all duration-150 ease-out active:scale-95 select-none tap-highlight-transparent ${active
                      ? 'bg-[#d49757]/10 text-[#d49757] border border-[#d49757]/30 font-bold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-[#ede8e1]/60 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions (Admin Quick-Link, Search, Telegram, Theme Toggle, Mobile Hamburger Button) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Authenticated Admin Quick-Link */}
            {isAdminAuthenticated && (
              <Link
                href="/admin"
                aria-label="پەنێڵی بەڕێوەبردن"
                title="پەنێڵی بەڕێوەبردن"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-[#d49757] text-xs font-semibold font-sirwan transition-all duration-150 ease-out active:scale-95 shadow-2xs select-none tap-highlight-transparent"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#d49757]" strokeWidth={1.75} />
                <span className="hidden sm:inline">بەڕێوەبردن</span>
              </Link>
            )}

            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="گەڕان"
              title="گەڕان"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-[#ede8e1]/60 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60 transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <Search className="h-4.5 w-4.5 text-[#d49757]" strokeWidth={1.75} />
            </button>

            {/* Telegram Channel Icon Button */}
            <a
              href="https://t.me/mediay_islami"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="کەناڵی تێلیگرام"
              title="کەناڵی فەرمی لە تێلیگرام"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2.5 text-zinc-600 hover:text-sky-600 hover:bg-sky-500/10 dark:text-zinc-400 dark:hover:text-sky-400 dark:hover:bg-sky-500/10 transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <Send className="h-4.5 w-4.5" strokeWidth={1.75} />
            </a>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="کردنەوەی مێنیو"
              aria-expanded={isMenuOpen}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2.5 text-zinc-700 hover:text-zinc-900 hover:bg-[#ede8e1]/60 dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60 transition-transform duration-150 ease-out active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d49757]/40 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Native Fluid Sliding Drawer) */}
      <div
        className={`fixed inset-0 z-[99] md:hidden transition-all duration-300 ${isMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
          }`}
        role="dialog"
        aria-modal="true"
        dir="rtl"
      >
        {/* Backdrop Fade Overlay */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/70 transition-opacity duration-300 ease-out cursor-pointer ${isMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          aria-hidden="true"
        />

        {/* Sliding Drawer Container from the Right Side */}
        <div
          className={`fixed inset-y-0 right-0 w-[85%] max-w-xs bg-[#faf8f5] dark:bg-[#121316] text-[#1c1b18] dark:text-[#eeeff2] border-l border-[#ede8e1] dark:border-zinc-800 p-6 shadow-2xl flex flex-col justify-between z-[100] overflow-y-auto transform transition-transform duration-300 ease-out text-right ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div>
            {/* Header inside drawer */}
            <div className="flex items-center justify-between pb-5 border-b border-[#ede8e1] dark:border-zinc-800/80">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="select-none"
              >
                <span className="text-lg font-bold font-peshang tracking-normal text-zinc-900 dark:text-zinc-100">
                  میدیای ئیسلامی
                </span>
              </Link>

              {/* Clear X close button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="داخستنی مێنۆ"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-[#ede8e1]/60 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Quick Search Button in Drawer */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="mt-5 w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#ede8e1] dark:border-zinc-800 bg-stone-100/70 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-sirwan hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-[#d49757]/40 transition-all duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <Search className="w-4 h-4 text-[#d49757]" strokeWidth={1.75} />
              <span>گەڕان بۆ فیلم یان وتار...</span>
            </button>

            {/* Navigation Links with generous tap targets */}
            <nav className="mt-6 flex flex-col space-y-1.5">
              {/* Authenticated Admin Link in Drawer */}
              {isAdminAuthenticated && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-semibold font-sirwan transition-all duration-150 ease-out active:scale-95 select-none tap-highlight-transparent mb-1"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#d49757]" strokeWidth={1.75} />
                    <span>پەنێڵی بەڕێوەبردن</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-sans font-bold">
                    بەردەستە
                  </span>
                </Link>
              )}

              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href, link.isExternal);
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3.5 py-3 px-3.5 rounded-xl text-base font-medium font-sirwan tracking-normal transition-all duration-150 ease-out active:scale-95 select-none tap-highlight-transparent ${active
                        ? 'bg-[#d49757]/10 text-[#d49757] font-bold border-r-2 border-[#d49757]'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-[#d49757] dark:hover:text-[#d49757] hover:bg-[#ede8e1]/40 dark:hover:bg-zinc-900/40'
                      }`}
                  >
                    <IconComponent className="h-4.5 w-4.5 text-zinc-400 shrink-0" strokeWidth={1.75} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Area: Telegram Card & Compact Theme Switcher */}
          <div className="pt-6 border-t border-[#ede8e1] dark:border-zinc-800/80 flex flex-col gap-4">
            {/* Premium Telegram Channel Card */}
            <a
              href="https://t.me/mediay_islami"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#d49757]/10 hover:bg-[#d49757]/15 border border-[#d49757]/25 text-zinc-900 dark:text-zinc-100 transition-all duration-200 active:scale-[0.98] cursor-pointer touch-manipulation select-none tap-highlight-transparent"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#d49757] text-zinc-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Send className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs sm:text-sm font-bold font-peshang tracking-normal">کەناڵی فەرمی تێلیگرام</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sirwan">بۆ بینینی فیلم و بابەتەکان</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#d49757] group-hover:translate-x-[-2px] transition-transform" strokeWidth={1.75} />
            </a>

            {/* Compact Theme Switcher */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium font-sirwan text-zinc-600 dark:text-zinc-400">ڕووکاری تاریک / ڕووناک</span>
              <ThemeToggle />
            </div>
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
