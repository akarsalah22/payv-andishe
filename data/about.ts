export interface AboutFeature {
  title: string;
  desc: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  missionTitle: string;
  missionText: string;
  features: AboutFeature[];
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  title: "دەربارەی پلاتفۆرم",
  subtitle: "دەستپێشخەرییەکی خۆبەخشانەیە بۆ ئەرشیفکردن و کۆکردنەوەی ئەو بەرهەم و وتار و فیلمە ناوازانەی بە زمانی کوردی لە سەرچاوە جیاوازەکاندا بڵاوکراونەتەوە، تا هەمووان بتوانن لە یەک شوێنی خاوێن و بێبەرامبەردا دەستیان پێیان بگات.",
  missionTitle: "مافی بەرهەمەکان",
  missionText: "سەرجەم مافە مەعنەوییەکانی بەرهەمەکان، ڤیدیۆکان و وەرگێڕانەکان بۆ کەناڵ و وەرگێڕ و خاوەنە ڕەسەنەکانیان پارێزراون. ئێمە تەنها ئەرکی ڕێکخستن و ئاسانکاریی گەیشتن بە ناوەرۆکەکان لە ئەستۆ دەگرین.",
  features: [
    {
      title: "پەیوەندی و تێبینی",
      desc: "بۆ هەر پێشنیار، تێبینی، یان داواکارییەکی لابردنی بەرهەم، دەتوانن لە ڕێگەی بەستەرەکانی خوارەوە پەیوەندیمان پێوە بکەن."
    }
  ]
};
