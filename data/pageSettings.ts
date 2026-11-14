export interface MoviesPageSettings {
  badge: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  emptyMessage: string;
}

export interface WritingsPageSettings {
  badge: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  emptyMessage: string;
}

export const DEFAULT_MOVIES_PAGE_SETTINGS: MoviesPageSettings = {
  badge: 'ئەرشیڤی بینراو',
  title: 'فیلم، زنجیرە و کارتۆن',
  subtitle: 'کۆکراوەی شاکارە سینەمایییەکان، زنجیرەفیلم، کارتۆن و بەرهەمە هەڵبژێردراوەکان بە پەخشی ڕاستەوخۆ لە کەناڵی تێلیگرام.',
  searchPlaceholder: 'گەڕان لە نێو فیلم، کارتۆنەکان )...',
  emptyMessage: 'هیچ ئەنجامێک بۆ ئەم گەڕانە نەدۆزرایەوە',
};

export const DEFAULT_WRITINGS_PAGE_SETTINGS: WritingsPageSettings = {
  badge: 'ئەرشیڤی ئەدەب و فیکر',
  title: 'نووسین و دەقەکان',
  subtitle: 'تێڕامان لە ئایەتە پیرۆزەکان، دەقە دانسقەکان، ناساندنی کتێبە باشەکان و شیعری کوردی.',
  searchPlaceholder: 'گەڕان بەدوای وتار، نووسین، یان پەڕتووکدا...',
  emptyMessage: 'هیچ ئەنجامێک بۆ ئەم گەڕانە نەدۆزرایەوە',
};
