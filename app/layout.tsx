import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/components/ToastContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { InstallPwaModal } from "@/components/InstallPwaModal";
import {
  peshangFont,
  sirwanFont,
  sirwan001Font,
  sirwan003Font,
} from "@/lib/fonts";

const vazir = Vazirmatn({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-vazir',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mediay-islamy.vercel.app'),
  title: {
    default: 'میدیای ئیسلامی | سەکۆیەک بۆ فیلم و نووسین ',
    template: '%s | میدیای ئیسلامی',
  },
  description: 'سەکۆیەکی کوردی بۆ ناساندنی فیلم و کارتۆنی پەروەردەیی، نووسین، دەق، فیکر، فەرموودە و مێژووی ئیسلام.',
  keywords: [
    'میدیای ئیسلامی',
    'ئیسلام',
    'ئایەت',
    'حەدیس',
    'دەق',
    'نووسین',
    'ئەدەب',
    'فیکر',
    'پەروەردە',
    'مێژوو',
    'فیلم',
    'کارتۆن',
  ],
  authors: [{ name: 'میدیای ئیسلامی' }],
  creator: 'میدیای ئیسلامی',
  publisher: 'میدیای ئیسلامی',
  openGraph: {
    title: 'میدیای ئیسلامی | سەکۆیەک بۆ فیلم و نووسین ',
    description: 'سەکۆیەکی کوردی بۆ ناساندنی فیلم و کارتۆنی پەروەردەیی، نووسین، دەق، فیکر، فەرموودە و مێژووی ئیسلام.',
    url: 'https://mediay-islamy.vercel.app',
    siteName: 'میدیای ئیسلامی',
    locale: 'ckb_IQ',
    type: 'website',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'میدیای ئیسلامی | سەکۆیەک بۆ فیلم و نووسین',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'میدیای ئیسلامی | سەکۆیەک بۆ فیلم و نووسین',
    description: 'سەکۆیەکی کوردی بۆ ناساندنی فیلم و کارتۆنی پەروەردەیی، نووسین، دەق، فیکر، فەرموودە و مێژووی ئیسلام.',
    images: ['/logo.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo_web_new1.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'میدیای ئیسلامی',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ku"
      dir="rtl"
      suppressHydrationWarning
      className={`${vazir.variable} ${peshangFont.variable} ${sirwanFont.variable} ${sirwan001Font.variable} ${sirwan003Font.variable} scroll-smooth`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preload" href="/logo_web_new1.svg" as="image" type="image/svg+xml" fetchPriority="high" />
        <meta name="apple-mobile-web-app-title" content="میدیای ئیسلامی" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className={`${vazir.className} font-sans bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors antialiased w-full max-w-[100vw] min-h-screen flex flex-col selection:bg-amber-500/20 selection:text-amber-600 dark:selection:text-amber-400 text-start overflow-x-hidden relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <ToastProvider>
              <Header />
              <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col overflow-x-hidden">
                {children}
              </main>
              <Footer />
              <InstallPwaModal />
              <ScrollToTop />
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
