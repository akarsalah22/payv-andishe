"use client";

import { Copy } from 'lucide-react';
import { useToast } from '@/components/ToastContext';

interface CopyLinkButtonProps {
  url?: string;
  className?: string;
}

export function CopyLinkButton({ url, className }: CopyLinkButtonProps) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      const linkToCopy = url || (typeof window !== 'undefined' ? window.location.href : '');
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(linkToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = linkToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      showToast('بەستەر کۆپی کرا', { type: 'success' });
    } catch {
      showToast('کردارەکە سەرکەوتوو نەبوو، دووبارە هەوڵبدەرەوە', { type: 'error' });
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        className ||
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-sirwan bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700 transition-transform duration-150 ease-out active:scale-95 select-none tap-highlight-transparent cursor-pointer touch-manipulation"
      }
      title="کۆپیکردنی بەستەری وتار"
    >
      <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
      <span className="hidden sm:inline">کۆپیکردنی بەستەر</span>
    </button>
  );
}

