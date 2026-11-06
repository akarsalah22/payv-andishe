import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-vazir)', 'var(--font-vazirmatn)', 'sans-serif'],
        peshang: ['var(--font-peshang)', 'sans-serif'],
        sirwan: ['var(--font-sirwan)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

