import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  vazirmatnFont,
  peshangFont,
  sirwanFont,
  sirwan001Font,
  sirwan003Font,
} from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL('https://payvandishe.com'),
  title: {
    default: "پەیڤ و ئەندێشە | پانتاییەک بۆ سینەما و ئەدەب",
    template: "%s | پەیڤ و ئەندێشە",
  },
  description: "ئەرشیڤێکی مۆدێرنی کوردی تایبەت بە فیلم، ئەنیمەیشن، وتاری هزری و ناساندنی کتێبە ناوازەکان",
  keywords: [
    "سینەما",
    "فیلم",
    "ئەنیمەیشن",
    "ئەدەب",
    "کتێب",
    "وتار",
    "فیکر",
    "کوردی",
    "پەیڤ و ئەندێشە",
  ],
  authors: [{ name: "پەیڤ و ئەندێشە" }],
  creator: "پەیڤ و ئەندێشە",
  publisher: "پەیڤ و ئەندێشە",
  openGraph: {
    type: "website",
    locale: "ckb_IQ",
    url: "https://payvandishe.com",
    siteName: "پەیڤ و ئەندێشە",
    title: "پەیڤ و ئەندێشە | پانتاییەک بۆ سینەما و ئەدەب",
    description: "ئەرشیڤێکی مۆدێرنی کوردی تایبەت بە فیلم، ئەنیمەیشن، وتاری هزری و ناساندنی کتێبە ناوازەکان",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "پەیڤ و ئەندێشە | پانتاییەک بۆ سینەما و ئەدەب",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "پەیڤ و ئەندێشە | پانتاییەک بۆ سینەما و ئەدەب",
    description: "ئەرشیڤێکی مۆدێرنی کوردی تایبەت بە فیلم، ئەنیمەیشن، وتاری هزری و ناساندنی کتێبە ناوازەکان",
    images: ["/og-preview.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.svg",
  },
  manifest: "/manifest.json",
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
      className={`${vazirmatnFont.variable} ${peshangFont.variable} ${sirwanFont.variable} ${sirwan001Font.variable} ${sirwan003Font.variable}`}
    >
      <body className={`${vazirmatnFont.className} min-h-screen bg-[#faf8f5] text-[#1c1b18] antialiased transition-colors duration-200 dark:bg-[#121316] dark:text-[#eeeff2] flex flex-col selection:bg-[#d49757]/20 selection:text-[#d49757] text-right`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <Header />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
