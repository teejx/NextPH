import React from 'react';
import { ArticleCardSkeleton } from './ArticleCardSkeleton';

export interface ArticlePageSkeletonProps {
  className?: string;
}

export const ArticlePageSkeleton: React.FC<ArticlePageSkeletonProps> = ({ className = '' }) => {
  return (
    <article aria-hidden="true" className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse ${className}`}>
      {/* Breadcrumb Navigation Placeholder */}
      <nav aria-label="Breadcrumb skeleton" className="flex items-center gap-2 text-xs">
        <div className="h-3 w-10 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <div className="h-3 w-16 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <div className="h-3 w-32 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
      </nav>

      {/* Story Header Placeholder */}
      <header className="mt-6 border-b border-zinc-200 dark:border-zinc-800 pb-8 max-w-4xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <div className="h-3 w-28 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="space-y-2.5 pt-1">
          <div className="h-8 sm:h-10 lg:h-12 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 sm:h-10 lg:h-12 w-4/5 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </header>

      {/* Hero Media Placeholder */}
      <div className="mt-8 aspect-16/10 sm:aspect-16/9 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />

      {/* 12-Column Content Layout */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Rail: Share Buttons Placeholder */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 flex flex-col items-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        </aside>

        {/* Center Column: Reading Prose Column (Max 740px) */}
        <div className="lg:col-span-8 max-w-[740px] mx-auto lg:mx-0 w-full space-y-6">
          {/* Paragraph 1 */}
          <div className="space-y-3">
            <div className="h-4 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-11/12 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-4/5 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Subheading placeholder */}
          <div className="pt-4">
            <div className="h-6 w-1/2 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Paragraph 2 */}
          <div className="space-y-3">
            <div className="h-4 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-3/4 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Blockquote Placeholder */}
          <div className="my-8 border-l-4 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-3 rounded-r-sm">
            <div className="h-5 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-4/5 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Paragraph 3 */}
          <div className="space-y-3">
            <div className="h-4 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-5/6 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Tags Row Placeholder */}
          <div className="mt-10 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <div className="h-3 w-24 rounded-xs bg-zinc-200 dark:bg-zinc-800 mb-3" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              ))}
            </div>
          </div>

          {/* Author Bio Box Placeholder */}
          <div className="mt-10 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <div className="grow space-y-2 w-full">
              <div className="h-4 w-36 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-4/5 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>

        {/* Right Rail: Sidebar Mini Feed Placeholder */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8">
          <div className="sticky top-28 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <div className="h-3 w-28 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-12 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <ArticleCardSkeleton key={i} compact />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
};
