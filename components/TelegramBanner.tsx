import { Send } from 'lucide-react';

export function TelegramBanner() {
  return (
    <section
      id="about"
      dir="rtl"
      className="w-full relative rounded-2xl sm:rounded-3xl border border-stone-200 bg-stone-100 text-stone-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 p-6 sm:p-8 md:p-10 shadow-xs text-right select-none transition-colors duration-200"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          {/* Channel Handle Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold font-sirwan text-amber-700 dark:text-amber-400 tracking-normal shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>کەناڵی فەرمی</span>
            <span className="text-stone-400 dark:text-zinc-500">•</span>
            <span dir="ltr" className="font-mono text-[11px] font-bold">@payvandishe</span>
          </div>

          {/* Stately Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-peshang tracking-normal text-stone-900 dark:text-zinc-100 leading-normal">
            پەیوەست بە بە کەناڵی فەرمیی پەیڤ و ئەندێشە
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base font-normal font-sirwan text-stone-600 dark:text-zinc-400 leading-relaxed tracking-normal">
            بۆ داگرتن و بینینی شاکارە سینەمایییەکان و ئەنیمەیشنەکان بە کوالێتی بەرز، گوێگرتن لە فایلە دەنگییەکان و ئاگاداربوون لە نوێترین وتار و ڕامانەکان، بەشداری لە کەناڵەکەمان بکە لە تێلیگرام.
          </p>
        </div>

        {/* Direct CTA Action Button */}
        <div className="shrink-0 w-full sm:w-auto">
          <a
            href="https://t.me/payvandishe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold font-sirwan text-sm tracking-normal shadow-sm transition-transform duration-150 ease-out active:scale-95 cursor-pointer touch-manipulation tap-highlight-transparent"
          >
            <Send className="w-4 h-4" strokeWidth={1.75} />
            <span>بەشداری لە کەناڵ</span>
          </a>
        </div>
      </div>
    </section>
  );
}
