export type FilmCategory =
  | 'فیلم'
  | 'زنجیرەفیلم'
  | 'کارتۆن'
  | 'زنجیرەکارتۆن'
  | 'کورتە فیلم'
  | 'سینەمایی' // پشتیوانی پێشوو
  | 'ئەنیمەیشن'; // پشتیوانی پێشوو

export interface Film {
  id: string;
  slug: string;
  titleKurdish: string;
  originalTitle: string;
  year: number;
  duration: string;
  category: FilmCategory;
  genres: string[];
  posterUrl: string;
  description: string;
  telegramPostUrl: string;
}

export const FILM_CATEGORIES: ('هەمووی' | FilmCategory)[] = [
  'هەمووی',
  'فیلم',
  'زنجیرەفیلم',
  'کارتۆن',
  'زنجیرەکارتۆن',
  'کورتە فیلم',
];

export const ADMIN_FILM_CATEGORIES = [
  'فیلم',
  'زنجیرەفیلم',
  'کارتۆن',
  'زنجیرەکارتۆن',
  'کورتە فیلم',
] as const;

export const SAMPLE_FILMS: Film[] = [
  {
    id: '1',
    slug: 'spirited-away',
    titleKurdish: 'ڕۆشتووی ڕۆحەکان',
    originalTitle: 'Spirited Away',
    year: 2001,
    duration: '٢ کاتژمێر و ٥ خولەک',
    category: 'کارتۆن',
    genres: ['کارتۆن', 'سەرکێشی'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    description: 'شاکارێکی ئەفسوناوی میازاکی؛ کچۆڵەیەک دەکەوێتە جیهانی ڕۆحەکان و دەبێت بە ئازایەتی خێزانەکەی ڕزگار بکات.',
    telegramPostUrl: 'https://t.me/mediay_islamy',
  },
  {
    id: '2',
    slug: 'interstellar',
    titleKurdish: 'نێوان ئەستێرەکان',
    originalTitle: 'Interstellar',
    year: 2014,
    duration: '٢ کاتژمێر و ٤٩ خولەک',
    category: 'فیلم',
    genres: ['زانستی خەیاڵی', 'دراما'],
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    description: 'گەشتێکی قووڵ و فەلسەفی لە نێو بۆشایی گەردووندا بۆ دۆزینەوەی نشینگەیەکی نوێ بۆ مرۆڤایەتی.',
    telegramPostUrl: 'https://t.me/mediay_islamy',
  },
  {
    id: '3',
    slug: 'the-shawshank-redemption',
    titleKurdish: 'ڕزگاربوون لە شاوڕەنگ',
    originalTitle: 'The Shawshank Redemption',
    year: 1994,
    duration: '٢ کاتژمێر و ٢٢ خولەک',
    category: 'فیلم',
    genres: ['دراما', 'تاوان'],
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    description: 'چیرۆکێکی کاریگەر لەسەر بەهای هیوا، دانبەخۆداگرتن و دۆستایەتی لە تاریکترین ڕۆژەکانی زینداندا.',
    telegramPostUrl: 'https://t.me/mediay_islamy',
  },
  {
    id: '4',
    slug: 'prophet-joseph',
    titleKurdish: 'زنجیرەی حەزرەتی یوسف (س.خ)',
    originalTitle: 'Prophet Joseph Series',
    year: 2008,
    duration: '٤٥ ئەڵقە',
    category: 'زنجیرەفیلم',
    genres: ['مێژوویی', 'ئیسلامی'],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    description: 'شاکارێکی مێژوویی و ئیسلامی پڕ لە پەند و وانەی ژیان کە بە وردی چیرۆکی ژیانی پێغەمبەر یوسف (س.خ) دەگێڕێتەوە.',
    telegramPostUrl: 'https://t.me/mediay_islamy',
  },
  {
    id: '5',
    slug: 'the-red-balloon',
    titleKurdish: 'باڵۆنە سوورەکە',
    originalTitle: 'The Red Balloon (Le Ballon Rouge)',
    year: 1956,
    duration: '٣٤ خولەک',
    category: 'کورتە فیلم',
    genres: ['کورتە فیلم', 'خەیاڵی'],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    description: 'کورتە فیلمێکی شاکاری فەڕەنسی لەسەر دۆستایەتی سۆزدارانەی کوڕێکی بچووک و باڵۆنێکی جادوویی لە پاریس.',
    telegramPostUrl: 'https://t.me/mediay_islamy',
  },
  {
    id: '6',
    slug: 'quran-stories-series',
    titleKurdish: 'چیرۆکەکانی قورئان بۆ منداڵان',
    originalTitle: 'Quran Stories Animation Series',
    year: 2018,
    duration: '٣٠ ئەڵقە',
    category: 'زنجیرەکارتۆن',
    genres: ['کارتۆن', 'پەروەردەیی'],
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    description: 'زنجیرەیەکی کارتۆنی بەپێز و پەروەردەیی بۆ منداڵان لەسەر پەند و چیرۆکە جوانەکانی قورئانی پیرۆز.',
    telegramPostUrl: 'https://t.me/mediay_islamy',
  },
  {
    id: '7',
    slug: 'my-neighbor-totoro',
    titleKurdish: 'تۆتۆرۆی دراوسێم',
    originalTitle: 'My Neighbor Totoro',
    year: 1988,
    duration: '١ کاتژمێر و ٢٦ خولەک',
    category: 'کارتۆن',
    genres: ['کارتۆن', 'خێزانی'],
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    description: 'سەرکێشییەکی پڕ لە پاکی و سۆزی منداڵانە لەگەڵ بوونەوەرە ئەفسوناوییەکانی دارستان لە گوندێکی ژاپۆن.',
    telegramPostUrl: 'https://t.me/mediay_islamy',
  },
  {
    id: '8',
    slug: 'the-pianist',
    titleKurdish: 'پیانۆژەن',
    originalTitle: 'The Pianist',
    year: 2002,
    duration: '٢ کاتژمێر و ٣٠ خولەک',
    category: 'فیلم',
    genres: ['دراما', 'مێژوویی'],
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    description: 'خەباتی پیانۆژەنێکی بەتوانا بۆ مانەوە لە ژیاندا لە نێو جەنگ و وێرانییەکانی پۆڵۆنیادا.',
    telegramPostUrl: 'https://t.me/mediay_islamy',
  },
];

export function getFilmById(id: string): Film | undefined {
  return SAMPLE_FILMS.find((film) => film.id === id || film.slug === id);
}

export function getFilmBySlug(slug: string): Film | undefined {
  return SAMPLE_FILMS.find((film) => film.slug === slug || film.id === slug);
}

