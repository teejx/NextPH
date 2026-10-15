'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-[#C43622]">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="mt-4 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#141312]">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-[#4A4642] leading-relaxed">
        Our editorial system encountered an unexpected disruption while loading this dispatch. Please try refreshing or return to the homepage.
      </p>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-sm bg-[#141312] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#C43622]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-sm border border-[#CCC7BD] bg-white px-5 py-2.5 text-xs font-semibold text-[#141312] hover:border-[#141312]"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
