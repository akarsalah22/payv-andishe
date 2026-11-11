'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { X, Shuffle, Download, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { openPwaInstallModal } from '@/components/InstallPwaModal';

export { openPwaInstallModal } from '@/components/InstallPwaModal';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  favoritesCount?: number;
  isAdminAuthenticated?: boolean;
}

export function MobileMenu({
  isOpen,
  onClose,
  favoritesCount = 0,
  isAdminAuthenticated = false,
}: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, isRtl } = useLanguage();

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleSurpriseMe = async () => {
    onClose();
    try {
      const res = await fetch('/api/films');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const chosen = data[randomIndex];
          router.push(`/films/${encodeURIComponent(chosen.slug || chosen.id)}`);
          return;
        }
      }
    } catch {
      // fallback
    }
    router.push('/films');
  };

  const mainLinks = [
    { href: '/', key: 'nav.home', defaultLabel: 'سەرەتا' },
    { href: '/films', key: 'nav.movies', defaultLabel: 'فیلم و کارتۆن' },
    { href: '/articles', key: 'nav.writings', defaultLabel: 'نووسین' },
    { href: '/about', key: 'nav.about', defaultLabel: 'دەربارە' },
  ];

  return (
    <div
      className={`fixed inset-0 z-[99] md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
        }`}
      role="dialog"
      aria-modal="true"
    >
      {/* High-Contrast Dimming Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity duration-300 ease-out cursor-pointer ${isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        aria-hidden="true"
      />

      {/* Sliding Drawer Container */}
      <div
        className={`fixed inset-y-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'
          } w-[75vw] max-w-[320px] min-w-[270px] bg-white text-zinc-900 border-zinc-200 dark:bg-[#0c0c0e] dark:text-zinc-200 dark:border-zinc-800/80 shadow-2xl flex flex-col justify-between z-[100] transform transition-transform duration-300 ease-out text-start ${isOpen
            ? 'translate-x-0'
            : isRtl
              ? 'translate-x-full'
              : '-translate-x-full'
          }`}
      >
        {/* Header Bar */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 shrink-0">
          {/* Logo Mark with gold ribbon */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 group shrink-0 select-none cursor-pointer"
          >
            <div className="relative w-7 h-7 shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo_web_new1.svg"
                alt={t('brand.title', 'میدیای ئیسلامی')}
                width={28}
                height={28}
                priority={true}
                loading="eager"
                unoptimized
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap tracking-tight select-none">
              {t('brand.title', 'میدیای ئیسلامی')}
            </span>
          </Link>

          {/* Close Button (X) */}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('nav.close_menu', 'داخستنی مێنۆ')}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer select-none touch-manipulation active:scale-95"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Scrollable Middle: Divided List */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between">
          {/* Classic Divided Navigation List */}
          <nav className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 flex flex-col">
            {mainLinks.map((link) => {
              const active = isLinkActive(link.href);
              const label = t(link.key, link.defaultLabel);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  onClick={onClose}
                  className={`py-3.5 px-4 flex items-center justify-between text-[14px] transition-colors select-none tap-highlight-transparent ${active
                    ? 'text-amber-500 dark:text-amber-400 font-semibold bg-amber-500/5'
                    : 'font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 hover:text-amber-500 dark:hover:text-amber-400'
                    }`}
                >
                  <span>{label}</span>
                </Link>
              );
            })}

            {/* 5. هەڵگیراوەکانم (Bookmarks / Saved) */}
            <Link
              href="/saved"
              prefetch={false}
              onClick={onClose}
              className={`py-3.5 px-4 flex items-center justify-between text-[14px] transition-colors select-none tap-highlight-transparent ${pathname === '/saved'
                ? 'text-amber-500 dark:text-amber-400 font-semibold bg-amber-500/5'
                : 'font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 hover:text-amber-500 dark:hover:text-amber-400'
                }`}
            >
              <span>{t('nav.saved', 'هەڵگیراوەکانم')}</span>
              {favoritesCount > 0 && (
                <span className="text-xs text-amber-500 font-bold font-sans">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* 6. چی سەیر بکەم؟ (Surprise me / Random) */}
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="group w-full py-3.5 px-4 flex items-center justify-between text-[14px] font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 hover:text-amber-500 dark:hover:text-amber-400 transition-colors select-none cursor-pointer text-start"
            >
              <span>{t('nav.surprise', 'چی سەیر بکەم؟')}</span>
              <Shuffle className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-amber-500 shrink-0 transition-colors" strokeWidth={1.8} />
            </button>
          </nav>

          {/* Admin & Manual App Download (Subtle Bottom Section) */}
          <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col divide-y divide-zinc-200/40 dark:divide-zinc-800/40 mt-auto">
            {/* PWA Download Row */}
            <button
              type="button"
              onClick={() => {
                openPwaInstallModal();
                onClose();
              }}
              className="w-full py-3 px-4 flex items-center justify-between text-xs text-amber-500 hover:bg-amber-500/10 transition-colors select-none cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                <span>داگرتنی ئەپڵیکەیشن</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-500/30 font-bold font-sans">
                PWA
              </span>
            </button>

            {/* Admin Link */}
            {isAdminAuthenticated && (
              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className="py-3 px-4 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-2 transition-colors select-none"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                <span>{t('nav.admin', 'بەڕێوەبردن')}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Footer Dock (Theme & Language) */}
        <div className="relative z-20 p-3.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-transparent">
          <LanguageSwitcher direction="up" align="start" showChevron />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
