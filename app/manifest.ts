import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'میدیای ئیسلامی | پانتاییەک بۆ سینەما و ئەدەبی ئیسلامی',
    short_name: 'میدیای ئیسلامی',
    description: 'ئەرشیفێکی کوردییە بۆ ناساندن و کۆکردنەوەی فیلم، زنجیرە و کارتۆن، لەگەڵ خوێندنەوەی دەقی بەپێز و سەرچاوە پەروەردەییەکان.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    orientation: 'portrait',
    dir: 'rtl',
    lang: 'ckb',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
  };
}

