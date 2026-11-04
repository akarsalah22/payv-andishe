"use client";

import { useState } from "react";

interface CopyLinkButtonProps {
  url?: string;
  className?: string;
}

export function CopyLinkButton({ url, className }: CopyLinkButtonProps = {}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        const textToCopy = url || window.location.href;
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const defaultClasses = `px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border cursor-pointer select-none active:scale-95 ${
    copied
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700"
  }`;

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={className || defaultClasses}
      title="کۆپیکردنی بەستەر"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>کۆپیکرا!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>کۆپیکردنی بەستەر</span>
        </>
      )}
    </button>
  );
}

export default CopyLinkButton;
