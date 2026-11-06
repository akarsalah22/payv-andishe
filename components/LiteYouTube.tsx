"use client";

import { useState } from "react";
import Image from "next/image";

export interface LiteYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
}

/**
 * Extracts a clean 11-character YouTube video ID if a full URL or param was provided.
 */
function cleanVideoId(rawIdOrUrl: string): string {
  if (!rawIdOrUrl) return "";
  const trimmed = rawIdOrUrl.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : trimmed;
}

export function LiteYouTube({ videoId, title, className = "" }: LiteYouTubeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const id = cleanVideoId(videoId);

  if (!id) return null;

  const thumbnailUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

  return (
    <div
      className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl ${className}`}
    >
      {isPlaying ? (
        <iframe
          src={iframeSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group relative w-full h-full block cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80"
          aria-label={`پەخشکردنی ${title}`}
        >
          {/* Optimized Next.js Thumbnail */}
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />

          {/* Vignette / Dark Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-200" />

          {/* Centered Sleek Red Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-11 sm:w-18 sm:h-12 bg-red-600/95 group-hover:bg-red-600 group-hover:scale-110 active:scale-95 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/70 transition-all duration-200">
              <svg
                className="w-6 h-6 fill-current translate-x-0.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

export default LiteYouTube;

