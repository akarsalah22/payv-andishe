export interface HomeSettings {
  id?: string;
  badgeText: string;
  title: string;
  subtitle: string;
  updatedAt?: string;
}

export const DEFAULT_HOME_SETTINGS: HomeSettings = {
  badgeText: 'پانتاییەک بۆ سینەما و ئەدەبی ئیسلامی',
  title: 'شوێنێک بۆ فیلم و نووسینی ئیسلامی',
  subtitle: 'ئەرشیفێکی کوردییە بۆ ناساندن و کۆکردنەوەی فیلم و ئەنیمەیشن، لەگەڵ خوێندنەوەی وتاری ئیسلامی و ناساندنی سەرچاوە پەروەردەییەکان.',
};

