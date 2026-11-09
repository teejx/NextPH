import React from 'react';
import type { Metadata } from 'next';
import { getArticles } from '../../lib/wordpress/client';
import { StoryCard } from '../../components/StoryCard';
import { NewsletterSection } from '../../components/NewsletterSection';
import { AdSlot } from '../../components/AdSlot';
import { Pagination } from '../../components/Pagination';

export const metadata: Metadata = {
  title: 'Technology & Innovation in the Philippines',
  description:
    'Coverage of Philippine telecommunications, fintech, cloud adoption, space science, and digital infrastructure.',
};

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TechCategoryPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const { articles, totalPages } = await getArticles({
    categorySlug: 'tech',
    page: currentPage,
    perPage: 9,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Category Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-8 pt-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Category Archive</span>
        <h1 className="mt-2 font-sans text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          Technology & Innovation
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Tracking the digital transformation of the Philippines: open finance, startup ecosystems, telecom infrastructure, and emerging technologies.
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
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/tech" />
          </>
        ) : (
          <div className="py-16 text-center text-zinc-400 dark:text-zinc-500">No stories found in this section yet.</div>
        )}
      </main>

      <NewsletterSection />
    </div>
  );
}
