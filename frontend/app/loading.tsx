import React from 'react';
import { HeroSkeleton } from '../components/skeletons/HeroSkeleton';
import { ArticleCardSkeleton } from '../components/skeletons/ArticleCardSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      {/* Top Leaderboard Placeholder */}
      <div className="my-6 hidden sm:block h-24 w-full rounded-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse" />

      {/* Hero Section Skeleton */}
      <HeroSkeleton />

      {/* Category Strip Placeholder */}
      <div className="my-8 flex items-center gap-3 overflow-hidden py-3 border-y border-zinc-200 dark:border-zinc-800 animate-pulse" aria-hidden="true">
        <div className="h-4 w-28 rounded-xs bg-zinc-200 dark:bg-zinc-800 shrink-0" />
        <div className="flex gap-2 shrink-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      </div>

      {/* Grid Feed Skeleton */}
      <section className="mt-12 space-y-8" aria-hidden="true">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 animate-pulse">
          <div className="h-6 w-44 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-20 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
