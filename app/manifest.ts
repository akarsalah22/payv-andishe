import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'میدیای ئیسلامی',
    short_name: 'میدیای ئیسلامی', // Exactly "میدیای ئیسلامی" under the app icon on phone screens
    description: 'ئەرشیفێکی سەربەخۆی کوردییە بۆ ناساندنی فیلم و کارتۆنە ئیسلامییەکان',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
