import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <span className="font-serif text-6xl sm:text-8xl font-black text-[#C43622]">404</span>
      <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#141312]">
        Story or Dispatch Not Found
      </h1>
      <p className="mt-4 text-base text-[#4A4642] max-w-lg mx-auto leading-relaxed">
        The dispatch you are looking for may have been archived, renamed, or relocated. Please verify the URL or explore our primary sections below.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-sm bg-[#141312] px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#C43622] focus-visible:outline-2 focus-visible:outline-[#C43622]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-sm border border-[#CCC7BD] bg-white px-6 py-3 text-xs font-semibold text-[#141312] transition-colors hover:border-[#141312] hover:text-[#C43622] focus-visible:outline-2 focus-visible:outline-[#C43622]"
        >
          <Search className="h-4 w-4 text-[#76716B]" />
          <span>Search the Archive</span>
        </Link>
      </div>

      <div className="mt-12 border-t border-[#CCC7BD] pt-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#76716B]">Explore Top Sections</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/tech" className="text-xs font-semibold uppercase hover:text-[#C43622]">
            Tech
          </Link>
          <span className="text-[#CCC7BD]">•</span>
          <Link href="/travel" className="text-xs font-semibold uppercase hover:text-[#C43622]">
            Travel
          </Link>
          <span className="text-[#CCC7BD]">•</span>
          <Link href="/lifestyle" className="text-xs font-semibold uppercase hover:text-[#C43622]">
            Lifestyle
          </Link>
          <span className="text-[#CCC7BD]">•</span>
          <Link href="/trending" className="text-xs font-semibold uppercase hover:text-[#C43622]">
            Trending
          </Link>
        </div>
      </div>
    </div>
  );
}
