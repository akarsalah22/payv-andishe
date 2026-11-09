"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useToast } from "@/components/ToastContext";

export interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

export function ShareButton({
  title,
  text,
  url,
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleShare = async () => {
    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");
    const shareData = {
      title,
      text: text || title,
      url: shareUrl,
    };

    // 1. Mobile Web Share API support
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        // User cancelled or dismissed share dialog
        if ((err as { name?: string })?.name === "AbortError") {
          return;
        }
        // Fall back to clipboard copy on failure
      }
    }

    // 2. Desktop Fallback: Clipboard Copy
    try {
      if (typeof window !== "undefined") {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }

        setCopied(true);
        showToast("بەستەرەکە کۆپی کرا!", { type: "success" });
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (copyErr) {
      console.error("Clipboard copy failed:", copyErr);
    }
  };

  const defaultClasses = `inline-flex items-center justify-center gap-1.5 h-9 min-w-[38px] px-3 rounded-xl text-xs font-medium font-sirwan transition-all duration-200 cursor-pointer select-none active:scale-95 touch-manipulation tap-highlight-transparent border shrink-0 ${
    copied
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-2xs"
      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
  }`;

  return (
    <button
      type="button"
      onClick={handleShare}
      className={className || defaultClasses}
      aria-label="هاوبەشکردن"
      title="هاوبەشکردن"
    >
      {copied ? (
        <>
          <Check className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-500 shrink-0" strokeWidth={2.25} />
          <span className="hidden sm:inline">بەستەرەکە کۆپی کرا!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.8} />
          <span className="hidden sm:inline">هاوبەشکردن</span>
        </>
      )}
    </button>
  );
}

export default ShareButton;

