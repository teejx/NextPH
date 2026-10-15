import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Article } from '../lib/wordpress/types';
import { StoryCard } from './StoryCard';

interface TrendingSectionProps {
  stories: Article[];
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ stories }) => {
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="trending-heading" className="rounded-sm border border-[#CCC7BD] bg-white p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-[#CCC7BD] pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#C43622]" />
          <h2 id="trending-heading" className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#141312]">
            Trending Stories
          </h2>
        </div>
        <Link
          href="/trending"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#C43622] hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-[#E8E4DD]">
        {stories.slice(0, 5).map((story, index) => (
          <StoryCard key={story.id} article={story} variant="trending" rankIndex={index} />
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[#E8E4DD] text-[11px] text-[#76716B] text-center">
        * Ranked by editorial curation and reader engagement.
      </div>
    </section>
  );
};
