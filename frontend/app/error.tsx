'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

const SECTIONS = [
  { name: 'News', href: '/news' },
  { name: 'Tech', href: '/tech' },
  { name: 'Travel', href: '/travel' },
  { name: 'Lifestyle', href: '/lifestyle' },
  { name: 'Trending', href: '/trending' },
];

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {/* Modern Error Eyebrow Indicator */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-6">
          <AlertTriangle className="h-3.5 w-3.5 text-zinc-900" />
          <span>System Notice • Unexpected Disruption</span>
        </div>

        <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950">
          Something Went Wrong
        </h1>

        <p className="mt-4 text-base sm:text-lg text-zinc-600 max-w-md mx-auto leading-relaxed">
          Our editorial platform encountered an unexpected disruption while loading this dispatch. Please try refreshing or return to the homepage.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-zinc-800 shadow-sm hover:shadow cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-900 transition-all hover:border-zinc-950 hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Primary Editorial Sections */}
        <div className="mt-14 border-t border-zinc-200 pt-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            Explore Editorial Sections
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SECTIONS.map((section) => (
              <Link
                key={section.name}
                href={section.href}
                className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-800 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
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
