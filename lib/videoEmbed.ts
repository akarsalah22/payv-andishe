/**
 * Universal Video Embed Converter
 * Supports YouTube, OK.ru, Direct Video Files (.mp4, .webm, .m3u8), and generic embed URLs.
 */

export type EmbedType = 'iframe' | 'video';

export interface EmbedInfo {
  type: EmbedType;
  src: string;
}

/**
 * Extracts YouTube video ID from various standard YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
 * - Direct 11-char ID
 */
export function extractYouTubeId(urlOrId?: string | null): string | null {
  if (!urlOrId) return null;
  const trimmed = String(urlOrId).trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+?&v=|shorts\/|live\/))([\w-]{11})/i
  );
  return match ? match[1] : null;
}

/**
 * Extracts numeric video ID from various OK.ru video link formats:
 * - https://ok.ru/video/1234567890
 * - https://m.ok.ru/video/1234567890
 * - https://ok.ru/videoembed/1234567890
 * - Pure numeric ID: "1234567890"
 */
export function extractOkRuVideoId(urlOrId?: string | null): string | null {
  if (!urlOrId) return null;
  const trimmed = String(urlOrId).trim();
  if (!trimmed) return null;

  if (/^\d{8,18}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(
    /(?:ok\.ru\/(?:video|videoembed|live)\/|ok\.ru\/.*?\/video\/)(\d+)/i
  );
  if (match) return match[1];

  const genericMatch = trimmed.match(/ok\.ru.*?(\d{8,18})/i);
  return genericMatch ? genericMatch[1] : null;
}

/**
 * Checks whether a URL points directly to a video file (.mp4, .webm, .m3u8, .ogg)
 */
export function isDirectVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return (
      pathname.endsWith('.mp4') ||
      pathname.endsWith('.webm') ||
      pathname.endsWith('.m3u8') ||
      pathname.endsWith('.ogg')
    );
  } catch {
    const clean = String(url).split('?')[0].split('#')[0].toLowerCase();
    return (
      clean.endsWith('.mp4') ||
      clean.endsWith('.webm') ||
      clean.endsWith('.m3u8') ||
      clean.endsWith('.ogg')
    );
  }
}

/**
 * Converts standard video URLs into playable in-site embed sources.
 *
 * 1. YouTube URLs:
 *    -> { type: 'iframe', src: 'https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1' }
 * 2. OK.ru URLs:
 *    -> { type: 'iframe', src: 'https://ok.ru/videoembed/${ID}?autoplay=1' }
 * 3. Direct Video Files (.mp4, .webm, .m3u8):
 *    -> { type: 'video', src: url }
 * 4. Other Embed URLs:
 *    -> { type: 'iframe', src: url }
 */
export function getEmbedInfo(url?: string | null): EmbedInfo | null {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (!trimmed) return null;

  // 1. YouTube
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // 2. OK.ru
  const okId = extractOkRuVideoId(trimmed);
  if (okId) {
    return {
      type: 'iframe',
      src: `https://ok.ru/videoembed/${okId}?autoplay=1`,
    };
  }

  // 3. Direct Video Files (.mp4, .webm, .m3u8)
  if (isDirectVideoUrl(trimmed)) {
    return {
      type: 'video',
      src: trimmed,
    };
  }

  // 4. Other Embed URLs
  if (/^https?:\/\//i.test(trimmed)) {
    // If it's a telegram post link (e.g., https://t.me/channel/123), we can support telegram widget embed or leave as fallback
    if (trimmed.includes('t.me/')) {
      const tgMatch = trimmed.match(/t\.me\/([a-zA-Z0-9_]+)\/(\d+)/i);
      if (tgMatch) {
        return {
          type: 'iframe',
          src: `https://t.me/${tgMatch[1]}/${tgMatch[2]}?embed=1&mode=dark`,
        };
      }
    }
    return {
      type: 'iframe',
      src: trimmed,
    };
  }

  return null;
}
