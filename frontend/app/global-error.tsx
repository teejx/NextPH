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
      <body className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans antialiased flex items-center justify-center p-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-6">
            <AlertTriangle className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
            <span>Critical Notice • Unexpected Disruption</span>
          </div>

          <h1 className="font-sans text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Something Went Wrong
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            A critical system disruption occurred while rendering this page.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 dark:bg-zinc-100 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white dark:text-zinc-950 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 transition-all hover:border-zinc-950 dark:hover:border-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
