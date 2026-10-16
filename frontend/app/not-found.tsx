import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Compass } from 'lucide-react';

const SECTIONS = [
  { name: 'News', href: '/news' },
  { name: 'Tech', href: '/tech' },
  { name: 'Travel', href: '/travel' },
  { name: 'Lifestyle', href: '/lifestyle' },
  { name: 'Trending', href: '/trending' },
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {/* Modern 404 Eyebrow / Indicator */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6">
          <Compass className="h-3.5 w-3.5" />
          <span>Error 404 • Missing Dispatch</span>
        </div>

        <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          Story Not Found
        </h1>

        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          The dispatch you are looking for may have been archived, moved, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 dark:bg-zinc-100 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white dark:text-zinc-950 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm hover:shadow"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 transition-all hover:border-zinc-950 dark:hover:border-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
          >
            <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <span>Search Archive</span>
          </Link>
        </div>

        {/* Primary Editorial Sections */}
        <div className="mt-14 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Explore Editorial Sections
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SECTIONS.map((section) => (
              <Link
                key={section.name}
                href={section.href}
                className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 transition-colors hover:border-zinc-950 dark:hover:border-zinc-300 hover:bg-zinc-950 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950"
              >
                {section.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
