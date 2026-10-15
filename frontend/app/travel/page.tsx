import React from 'react';
import type { Metadata } from 'next';
import { getArticles } from '../../lib/wordpress/client';
import { StoryCard } from '../../components/StoryCard';
import { NewsletterSection } from '../../components/NewsletterSection';
import { AdSlot } from '../../components/AdSlot';
import { Pagination } from '../../components/Pagination';

export const metadata: Metadata = {
  title: 'Archipelago Travel & Heritage Journeys',
  description:
    'Sustainable travel guides, cultural expeditions, and conservation initiatives across the Philippine islands.',
};

export const revalidate = 120;

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TravelCategoryPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const { articles, totalPages } = await getArticles({
    categorySlug: 'travel',
    page: currentPage,
    perPage: 9,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-[#CCC7BD] pb-8 pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C43622]">Category Archive</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312]">
          Archipelago Travel
        </h1>
        <p className="mt-3 text-base text-[#4A4642] max-w-2xl">
          Journeys across 7,000 islands with a focus on conservation, heritage preservation, sustainable ecotourism, and regional narratives.
        </p>
      </header>

      <AdSlot placement="leaderboard" />

      <main className="mt-10">
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <StoryCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/travel" />
          </>
        ) : (
          <div className="py-16 text-center text-[#76716B]">No stories found in this section yet.</div>
        )}
      </main>

      <NewsletterSection />
    </div>
  );
}
