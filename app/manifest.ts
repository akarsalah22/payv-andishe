import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'میدیای ئیسلامی | سەکۆی فیکر، پەروەردە و ئەدەب',
    short_name: 'میدیای ئیسلامی',
    description: 'سەکۆیەکی کوردی بۆ ناساندنی فیلم و کارتۆنی پەروەردەیی، نووسین، دەق، فیکر، فەرموودە و مێژووی ئیسلام.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    orientation: 'portrait',
    dir: 'rtl',
    lang: 'ckb',
    icons: [
      {
        src: '/logo_web_new1.svg',
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

