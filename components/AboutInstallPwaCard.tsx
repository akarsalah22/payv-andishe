'use client';

import React from 'react';
import { Download, Check } from 'lucide-react';
import { usePwa } from '@/context/PwaContext';
import { openPwaInstallModal } from '@/components/InstallPwaModal';

export function AboutInstallPwaCard() {
  const { isStandalone, triggerInstall } = usePwa();

  const handleInstallClick = async () => {
    try {
      localStorage.setItem('pwa_prompt_shown_once', 'true');
    } catch {
      // ignore
    }

    // 1. Try native install prompt first (triggers native WebAPK installer on Android / App prompt on Desktop)
    const installed = await triggerInstall();
    if (installed) {
      return;
    }

    // 2. If no deferredPrompt available (or on iOS Safari), open step-by-step modal
    openPwaInstallModal();
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6 shadow-xs select-none">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              داگرتنی ئەپڵیکەیشنی میدیای ئیسلامی
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-bold font-sans">
              PWA
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            دەتوانیت ماڵپەڕەکە وەک بەرنامەیەکی سەربەخۆ لەسەر کۆمپیوتەر (Windows/macOS) یان مۆبایلەکەت دابمەزرێنیت.
          </p>
        </div>
      </div>

      {/* Install Action Button or Installed Badge */}
      {isStandalone ? (
        <div className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 select-none">
          <Check className="w-4 h-4" strokeWidth={2.5} />
          <span>دامەزراوە لەسەر ئامێرەکەت</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>داگرتن</span>
        </button>
      )}
    </div>
  );
}

export default AboutInstallPwaCard;
