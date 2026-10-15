import React from 'react';
import type { Metadata } from 'next';
import { getArticles } from '../../lib/wordpress/client';
import { StoryCard } from '../../components/StoryCard';
import { NewsletterSection } from '../../components/NewsletterSection';
import { AdSlot } from '../../components/AdSlot';
import { Pagination } from '../../components/Pagination';

export const metadata: Metadata = {
  title: 'News & National Dispatches — NextPH',
  description:
    'Authoritative coverage of Philippine national news, geopolitical developments, infrastructure, policy breakthroughs, and public affairs.',
};

export const revalidate = 120;

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function NewsCategoryPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const { articles, totalPages } = await getArticles({
    categorySlug: 'news',
    page: currentPage,
    perPage: 9,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Category Header */}
      <header className="border-b border-zinc-200 pb-8 pt-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Category Archive</span>
        <h1 className="mt-2 font-sans text-3xl sm:text-5xl font-black tracking-tight text-zinc-950">
          News & Dispatches
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
          Authoritative reporting on Philippine governance, regional foreign policy, energy grid transitions, and breaking national developments.
        </p>
      </header>

      <AdSlot placement="leaderboard" />

      {/* Stories Grid */}
      <main className="mt-10">
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <StoryCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/news" />
          </>
        ) : (
          <div className="py-16 text-center text-zinc-400">No stories found in this section yet.</div>
        )}
      </main>

      <NewsletterSection />
    </div>
  );
}
