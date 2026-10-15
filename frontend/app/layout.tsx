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
    default: 'NextPH — Filipino Digital Magazine | Tech, Travel & Lifestyle',
    template: '%s | NextPH',
  },
  description:
    'NextPH is a modern Filipino digital magazine covering technology innovations, archipelago travel, contemporary lifestyle, and curated trending stories.',
  keywords: ['Philippines', 'Filipino', 'Technology', 'Travel', 'Lifestyle', 'Trending', 'Digital Magazine'],
  authors: [{ name: 'NextPH Editorial Desk' }],
  creator: 'NextPH',
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'NextPH',
    title: 'NextPH — Filipino Digital Magazine',
    description:
      'Curated stories in technology breakthroughs, archipelago journeys, and contemporary culture from the Philippines.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NextPH — Contemporary Filipino Digital Magazine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextPH — Filipino Digital Magazine',
    description:
      'Curated stories in technology breakthroughs, archipelago journeys, and contemporary culture from the Philippines.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#141312] font-sans antialiased selection:bg-[#FDF1EE] selection:text-[#C43622]">
        {/* Skip to Content for Screen Readers & Keyboard Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-[#141312] focus:px-4 focus:py-2 focus:text-white focus:outline-2 focus:outline-[#C43622]"
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
