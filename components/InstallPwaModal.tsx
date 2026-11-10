"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X, Smartphone, Laptop } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    __deferredPwaPrompt__?: BeforeInstallPromptEvent | null;
  }
}

const SHOWN_ONCE_KEY = "pwa_prompt_shown_once";

/**
 * Dispatch custom event to programmatically trigger the PWA install modal from anywhere (e.g. mobile drawer menu or about page).
 */
export function openPwaInstallModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-pwa-install-modal"));
  }
}

export function InstallPwaModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Detect iOS device
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(isIosDevice);

    // 2. Check standalone mode (already running as standalone PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    // 3. Listen for programmatic trigger (from mobile menu or any button)
    const handleProgrammaticOpen = () => {
      setIsVisible(true);
    };
    window.addEventListener("open-pwa-install-modal", handleProgrammaticOpen);

    // 4. Capture native browser install prompt event (Android / Chrome / Edge / Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      window.__deferredPwaPrompt__ = promptEvent;

      // Auto-popup strictly ONCE per user/browser across all sessions and reloads
      if (!isStandalone) {
        try {
          const alreadyShown = localStorage.getItem(SHOWN_ONCE_KEY);
          if (!alreadyShown) {
            // Mark shown immediately to prevent duplicate triggers on quick reloads
            localStorage.setItem(SHOWN_ONCE_KEY, "true");
            setTimeout(() => {
              setIsVisible(true);
            }, 2500);
          }
        } catch {
          // ignore
        }
      }
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      window.__deferredPwaPrompt__ = null;
      try {
        localStorage.setItem(SHOWN_ONCE_KEY, "true");
      } catch {
        // ignore
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 5. For iOS Safari (which doesn't fire beforeinstallprompt), check auto-popup once
    if (isIosDevice && !isStandalone) {
      try {
        const alreadyShown = localStorage.getItem(SHOWN_ONCE_KEY);
        if (!alreadyShown) {
          localStorage.setItem(SHOWN_ONCE_KEY, "true");
          setTimeout(() => {
            setIsVisible(true);
          }, 2500);
        }
      } catch {
        // ignore
      }
    }

    return () => {
      window.removeEventListener("open-pwa-install-modal", handleProgrammaticOpen);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    try {
      localStorage.setItem(SHOWN_ONCE_KEY, "true");
    } catch {
      // ignore
    }

    const promptEvent = deferredPrompt || (typeof window !== "undefined" ? window.__deferredPwaPrompt__ : null);
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === "accepted") {
          setIsVisible(false);
        }
      } catch (err) {
        console.error("Error during PWA installation:", err);
      } finally {
        setDeferredPrompt(null);
        if (typeof window !== "undefined") {
          window.__deferredPwaPrompt__ = null;
        }
      }
    } else {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(SHOWN_ONCE_KEY, "true");
    } catch {
      // ignore
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
      dir="rtl"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
    >
      {/* Click outside to dismiss */}
      <div
        className="fixed inset-0"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet Card */}
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white dark:bg-zinc-950 border-t sm:border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-7 shadow-2xl z-10 text-right animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300 space-y-5">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="داخستن"
          className="absolute top-4 left-4 p-2 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>

        {/* Header: Logo, Badges & Titles */}
        <div className="flex items-start gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 p-2.5 flex items-center justify-center shrink-0 shadow-sm">
            <Image
              src="/logo_web_new1.svg"
              alt="میدیای ئیسلامی"
              width={52}
              height={52}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
            {/* Badges Row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-sirwan bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/70 dark:border-zinc-700/70">
                <Smartphone className="w-3 h-3 text-amber-500" />
                <span>Android</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-sirwan bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/70 dark:border-zinc-700/70">
                <Smartphone className="w-3 h-3 text-sky-500" />
                <span>iOS</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-sirwan bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/70 dark:border-zinc-700/70">
                <Laptop className="w-3 h-3 text-emerald-500" />
                <span>Desktop</span>
              </span>
            </div>

            <h3
              id="pwa-install-title"
              className="text-base sm:text-lg font-bold font-peshang text-zinc-900 dark:text-white leading-tight"
            >
              داگرتنی ئەپڵیکەیشنی میدیای ئیسلامی
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm font-sirwan text-zinc-600 dark:text-zinc-300 leading-relaxed">
          بۆ دەستگەیشتنی خێراتر، بێ کێشە، و ئەزموونێکی وەک ئەپ، ماڵپەڕەکە بخەرە سەر شاشەی ئامێرەکەت (کۆمپیوتەر یان مۆبایل).
        </p>

        {/* Dynamic Platform Content */}
        {isIos ? (
          /* iOS Step-by-Step Guide Card */
          <div className="space-y-4">
            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 p-4 space-y-3">
              <h4 className="text-xs font-bold font-sirwan text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <span>بۆ دابەزاندن لەسەر ئایفۆن (iOS / Safari):</span>
              </h4>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 font-sans">
                    ١
                  </div>
                  <p className="text-xs font-sirwan text-zinc-700 dark:text-zinc-300 leading-normal">
                    لە خوارەوەی وێبگەڕ کلیک لەسەر دوگمەی هاوبەشکردن (
                    <span className="font-semibold text-zinc-900 dark:text-white">Share</span>{" "}
                    <span className="inline-flex items-center text-sky-500 font-bold">⎋</span>
                    ) بکە.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 font-sans">
                    ٢
                  </div>
                  <p className="text-xs font-sirwan text-zinc-700 dark:text-zinc-300 leading-normal">
                    پاشان بژاردەی «زیادکردن بۆ سەر شاشەی سەرەکی» (
                    <span className="font-semibold text-zinc-900 dark:text-white">Add to Home Screen</span>{" "}
                    <span className="inline-flex items-center text-amber-500 font-bold">⊞</span>
                    ) هەڵبژێرە.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-zinc-950 font-bold font-sirwan text-sm transition-all shadow-md cursor-pointer"
            >
              تێگەیشتم
            </button>
          </div>
        ) : (
          /* Android & Desktop Action Row */
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sirwan text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              دواتر
            </button>

            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold font-sirwan text-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" strokeWidth={2.2} />
              <span>داگرتن</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstallPwaModal;
