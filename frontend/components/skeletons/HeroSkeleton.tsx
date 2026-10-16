import React from 'react';

export interface HeroSkeletonProps {
  className?: string;
}

export const HeroSkeleton: React.FC<HeroSkeletonProps> = ({ className = '' }) => {
  return (
    <section
      aria-hidden="true"
      className={`animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch pt-6 pb-10 ${className}`}
    >
      {/* Primary Featured Story Placeholder (8-col) */}
      <div className="lg:col-span-8 relative overflow-hidden rounded-xs bg-[#111113] border border-zinc-800 w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] sm:min-h-[440px] lg:min-h-[460px] flex flex-col justify-end p-6 sm:p-10 shadow-md">
        <div className="space-y-4 max-w-xl">
          {/* Category Pill */}
          <div className="h-3.5 w-24 rounded-full bg-zinc-800" />
          {/* Headline */}
          <div className="space-y-2.5">
            <div className="h-7 sm:h-9 w-full rounded-xs bg-zinc-800" />
            <div className="h-7 sm:h-9 w-3/4 rounded-xs bg-zinc-800" />
          </div>
          {/* Excerpt */}
          <div className="space-y-2 pt-1">
            <div className="h-3.5 w-full rounded-xs bg-zinc-800" />
            <div className="h-3.5 w-4/5 rounded-xs bg-zinc-800" />
          </div>
          {/* Read more CTA */}
          <div className="h-3.5 w-24 rounded-xs bg-zinc-800 pt-3" />
        </div>
      </div>

      {/* Right Sidebar: 3 Stacked Stories Placeholder (4-col) */}
      <div className="lg:col-span-4 flex flex-col justify-between divide-y divide-zinc-200 dark:divide-zinc-800 border-t border-b lg:border-t-0 lg:border-b-0 border-zinc-200 dark:border-zinc-800 py-1 lg:py-0">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-4 sm:gap-5 py-4 first:pt-0 last:pb-0 items-center"
          >
            <div className="w-36 sm:w-40 lg:w-44 h-24 sm:h-28 lg:h-30 shrink-0 overflow-hidden rounded-xs bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex flex-col justify-center grow min-w-0 space-y-2.5">
              <div className="h-2.5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-full rounded-xs bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-4/5 rounded-xs bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-20 rounded-xs bg-zinc-200 dark:bg-zinc-800 pt-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
