'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-950 font-sans antialiased flex items-center justify-center p-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-6">
            <AlertTriangle className="h-3.5 w-3.5 text-zinc-900" />
            <span>Critical Notice • Unexpected Disruption</span>
          </div>

          <h1 className="font-sans text-4xl sm:text-5xl font-black tracking-tight text-zinc-950">
            Something Went Wrong
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 max-w-md mx-auto leading-relaxed">
            A critical system disruption occurred while rendering this page.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-zinc-800 shadow-sm cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-900 transition-all hover:border-zinc-950 hover:bg-zinc-50"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
