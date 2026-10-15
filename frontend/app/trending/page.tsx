import React from 'react';
import type { Metadata } from 'next';
import { getTrendingStories } from '../../lib/wordpress/client';
import { StoryCard } from '../../components/StoryCard';
import { NewsletterSection } from '../../components/NewsletterSection';
import { AdSlot } from '../../components/AdSlot';

export const metadata: Metadata = {
  title: 'Trending Stories in the Philippines',
  description:
    'The most engaging and significant stories shaping contemporary discourse across the Philippines.',
};

export const revalidate = 120;

export default async function TrendingPage() {
  const stories = await getTrendingStories(12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-[#CCC7BD] pb-8 pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C43622]">Editorial Curation</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312]">
          Trending Stories
        </h1>
        <p className="mt-3 text-base text-[#4A4642] max-w-2xl">
          Editorially selected stories capturing significant cultural shifts, technology milestones, and archipelago travel developments.
        </p>
      </header>

      <AdSlot placement="leaderboard" />

      <main className="mt-10">
        <div className="bg-white rounded-sm border border-[#CCC7BD] p-6 sm:p-10">
          <div className="divide-y divide-[#E8E4DD]">
            {stories.map((story, index) => (
              <StoryCard key={story.id} article={story} variant="trending" rankIndex={index} />
            ))}
          </div>
        </div>
      </main>

      <NewsletterSection />
    </div>
  );
}
