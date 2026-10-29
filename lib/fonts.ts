import localFont from 'next/font/local';
import { Vazirmatn } from 'next/font/google';

// 1. Google Font Vazirmatn (High quality Kurdish / Arabic font)
export const vazirmatnFont = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// 2. Peshang Des 5 Bold (Titles, branding, and hero headlines)
export const peshangFont = localFont({
  src: '../public/font/Peshang_Des_5_Bold.ttf',
  variable: '--font-peshang',
  display: 'swap',
  weight: '700',
});

// 3. Sirwan Main Font (Readable modern Kurdish body & UI text)
export const sirwanFont = localFont({
  src: '../public/font/sirwan_font.ttf',
  variable: '--font-sirwan',
  display: 'swap',
});

// 4. Sirwan 001 (SiRWAN.ttf)
export const sirwan001Font = localFont({
  src: '../public/font/SiRWAN.ttf',
  variable: '--font-sirwan1',
  display: 'swap',
});

// 5. Sirwan 003 (SiRWAN_1.ttf)
export const sirwan003Font = localFont({
  src: '../public/font/SiRWAN_1.ttf',
  variable: '--font-sirwan2',
  display: 'swap',
});
