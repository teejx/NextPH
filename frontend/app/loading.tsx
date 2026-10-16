import React from 'react';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-6 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-xs mb-8" />

      {/* Hero Featured Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-10 border-b border-zinc-200 dark:border-zinc-800">
        {/* Main Hero Card Skeleton */}
        <div className="lg:col-span-8 rounded-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 aspect-16/10 p-8 flex flex-col justify-end gap-4">
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-9 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
          <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
        </div>

        {/* 3 Sidebar Posts Skeleton */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-center p-2 rounded-xs border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-900/40">
              <div className="h-24 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-xs shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
                <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Feed Skeleton */}
      <div className="mt-12 space-y-6">
        <div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-16/10 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
              <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
