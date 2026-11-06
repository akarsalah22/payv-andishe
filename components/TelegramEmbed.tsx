import React from "react";
import { TelegramIcon } from "@/components/TelegramIcon";

export interface TelegramEmbedProps {
  postUrl: string;
  title?: string;
  className?: string;
}

export function TelegramEmbed({
  postUrl,
  title = "پەخشی ڤیدیۆی تێلیگرام",
  className = "",
}: TelegramEmbedProps) {
  const directUrl = postUrl.startsWith("http") ? postUrl : `https://t.me/${postUrl}`;

  return (
    <div
      className={`w-full flex flex-col justify-center items-center py-6 px-4 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xl ${className}`}
      dir="rtl"
      aria-label={title}
    >
      <a
        href={directUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold font-sirwan text-white bg-sky-500 hover:bg-sky-400 active:scale-95 transition-all duration-150 cursor-pointer"
      >
        <TelegramIcon className="w-5 h-5 shrink-0" />
        <span>بینین و داگرتن لە تێلیگرام</span>
      </a>
    </div>
  );
}

export default TelegramEmbed;
