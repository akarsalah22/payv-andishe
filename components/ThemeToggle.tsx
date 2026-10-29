'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SunMedium, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="گۆڕینی دۆخی ڕووناکی و تاریکی"
        className={`inline-flex items-center justify-center rounded-xl min-w-[44px] min-h-[44px] p-2.5 text-zinc-400 dark:text-zinc-600 ${className}`}
      >
        <span className="w-5 h-5 block opacity-0" />
        {showLabel && <span className="ms-2 text-sm opacity-0 font-sirwan">دۆخ</span>}
      </button>
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="گۆڕینی دۆخی ڕووناکی و تاریکی"
      title={isDark ? 'گۆڕین بۆ دۆخی ڕووناک' : 'گۆڕین بۆ دۆخی تاریک'}
      className={`group relative inline-flex items-center justify-center rounded-xl min-w-[44px] min-h-[44px] p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-[#ede8e1]/60 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60 active:scale-95 transition-transform duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d49757]/40 cursor-pointer touch-manipulation select-none tap-highlight-transparent ${className}`}
    >
      {isDark ? (
        <SunMedium className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45 text-amber-400" strokeWidth={1.75} />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12 text-zinc-700" strokeWidth={1.75} />
      )}
      {showLabel && (
        <span className="ms-2 text-xs sm:text-sm font-medium font-sirwan tracking-normal text-zinc-700 dark:text-zinc-300">
          {isDark ? 'دۆخی ڕووناک' : 'دۆخی تاریک'}
        </span>
      )}
    </button>
  );
}
