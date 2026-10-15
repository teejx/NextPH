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
      <header className="border-b border-zinc-200 pb-8 pt-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Editorial Curation</span>
        <h1 className="mt-2 font-sans text-3xl sm:text-5xl font-black tracking-tight text-zinc-950">
          Trending Stories
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
          Editorially selected stories capturing significant cultural shifts, technology milestones, and archipelago travel developments.
        </p>
      </header>

      <AdSlot placement="leaderboard" />

      <main className="mt-10">
        <div className="bg-white rounded-xs border border-zinc-200 p-6 sm:p-10 shadow-xs">
          <div className="divide-y divide-zinc-100">
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
