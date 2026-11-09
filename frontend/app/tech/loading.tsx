import React from 'react';
import { ArticleCardSkeleton } from '../../components/skeletons/ArticleCardSkeleton';

export default function TechLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-hidden="true">
      {/* Category Header Skeleton */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-8 pt-4 animate-pulse space-y-3">
        <div className="h-3 w-28 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 sm:h-12 w-64 sm:w-80 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full max-w-xl rounded-xs bg-zinc-200 dark:bg-zinc-800" />
      </header>

      {/* Main Grid Skeleton */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
