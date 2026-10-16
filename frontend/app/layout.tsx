import type { Metadata } from 'next';
import { Newsreader, Inter } from 'next/font/google';
import '../styles/globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-editorial-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-editorial-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "WHAT'S NEXT PH — Filipino Digital Magazine | Tech, Travel & Lifestyle",
    template: "%s | WHAT'S NEXT PH",
  },
  description:
    "WHAT'S NEXT PH is a modern Filipino digital magazine covering technology innovations, archipelago travel, contemporary lifestyle, and curated trending stories.",
  keywords: ['Philippines', 'Filipino', 'Technology', 'Travel', 'Lifestyle', 'Trending', 'Digital Magazine'],
  authors: [{ name: "WHAT'S NEXT PH Editorial Desk" }],
  creator: "WHAT'S NEXT PH",
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: "WHAT'S NEXT PH",
    title: "WHAT'S NEXT PH — Filipino Digital Magazine",
    description:
      'Curated stories in technology breakthroughs, archipelago journeys, and contemporary culture from the Philippines.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "WHAT'S NEXT PH — Contemporary Filipino Digital Magazine",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "WHAT'S NEXT PH — Filipino Digital Magazine",
    description:
      'Curated stories in technology breakthroughs, archipelago journeys, and contemporary culture from the Philippines.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${newsreader.variable} ${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950">
        {/* Skip to Content for Screen Readers & Keyboard Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-white focus:outline-2 focus:outline-zinc-400"
        >
          Skip to main content
        </a>

        <Header />
        <main id="main-content" className="grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
