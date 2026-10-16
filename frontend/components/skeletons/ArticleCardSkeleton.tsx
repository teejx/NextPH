import React from 'react';

export interface ArticleCardSkeletonProps {
  compact?: boolean;
  className?: string;
}

export const ArticleCardSkeleton: React.FC<ArticleCardSkeletonProps> = ({
  compact = false,
  className = '',
}) => {
  if (compact) {
    return (
      <article
        aria-hidden="true"
        className={`animate-pulse flex gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-b-0 items-center ${className}`}
      >
        <div className="h-18 w-20 shrink-0 overflow-hidden rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        <div className="grow min-w-0 space-y-2">
          <div className="h-2.5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3.5 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3.5 w-3/4 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2 w-16 rounded-xs bg-zinc-200 dark:bg-zinc-800 mt-1" />
        </div>
      </article>
    );
  }

  return (
    <article
      aria-hidden="true"
      className={`animate-pulse flex flex-col overflow-hidden rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 ${className}`}
    >
      <div className="aspect-16/10 w-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-col grow p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2.5 w-20 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="space-y-2 pt-1">
          <div className="h-4 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-4/5 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-2/3 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
          <div className="h-3 w-20 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-14 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </article>
  );
};
