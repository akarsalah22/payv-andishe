"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_STORAGE_KEY = 'pwa_prompt_dismissed_until';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Skip if already running inside installed standalone PWA
    if (typeof window === 'undefined') return;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    // 2. Check if user dismissed prompt recently
    try {
      const dismissedUntil = localStorage.getItem(DISMISS_STORAGE_KEY);
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        return;
      }
    } catch {
      // ignore
    }

    // 3. Listen for Android/Chrome PWA install prompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
    } catch (err) {
      console.error('Error during PWA installation:', err);
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(
        DISMISS_STORAGE_KEY,
        String(Date.now() + DISMISS_DURATION_MS)
      );
    } catch {
      // ignore
    }
  };

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <aside
      dir="rtl"
      role="banner"
      aria-label="داگرتنی وێبسایت وەک ئەپڵیکەیشن"
      className="fixed bottom-4 sm:bottom-6 inset-x-4 max-w-md mx-auto z-[90] animate-in slide-in-from-bottom-6 fade-in duration-300"
    >
      <div className="relative flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 text-zinc-900 dark:bg-zinc-950/95 dark:text-white border border-amber-500/35 shadow-2xl backdrop-blur-xl">
        {/* Right Info: Logo & Kurdish Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 shrink-0 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center p-1.5 shadow-xs">
            <Image
              src="/logo_web_new1.svg"
              alt="میدیای ئیسلامی"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="min-w-0 text-right">
            <h4 className="text-xs sm:text-sm font-bold font-peshang tracking-normal text-zinc-900 dark:text-white truncate">
              میدیای ئیسلامی وەک ئەپ
            </h4>
            <p className="text-[11px] sm:text-xs font-normal font-sirwan text-zinc-500 dark:text-zinc-400 truncate">
              ئەم وێبسایتە وەک ئەپ دابەزێنە لەسەر شاشەکەت
            </p>
          </div>
        </div>

        {/* Left Actions: Install & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold font-sirwan bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md transition-all duration-150 active:scale-95 cursor-pointer touch-manipulation whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>ئینستۆڵکردن</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="داخستنی ئاگاداری"
            title="دواتر"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-90 transition-all cursor-pointer touch-manipulation"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </aside>
  );
}

