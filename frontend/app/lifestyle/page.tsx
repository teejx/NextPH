import React from 'react';
import type { Metadata } from 'next';
import { getArticles } from '../../lib/wordpress/client';
import { StoryCard } from '../../components/StoryCard';
import { NewsletterSection } from '../../components/NewsletterSection';
import { AdSlot } from '../../components/AdSlot';

export const metadata: Metadata = {
  title: 'Contemporary Filipino Lifestyle & Culture',
  description:
    'Essays on Philippine culinary evolution, design, literature, artisanal heritage, and contemporary urban life.',
};

export const revalidate = 120;

export default async function LifestyleCategoryPage() {
  const { articles } = await getArticles({ categorySlug: 'lifestyle', perPage: 12 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-[#CCC7BD] pb-8 pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C43622]">Category Archive</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312]">
          Contemporary Lifestyle & Culture
        </h1>
        <p className="mt-3 text-base text-[#4A4642] max-w-2xl">
          Exploring the rich fabric of modern Philippine life: artisanal food movements, indigenous crafts, design, and cultural commentary.
        </p>
      </header>

      <AdSlot placement="leaderboard" />

      <main className="mt-10">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <StoryCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-[#76716B]">No stories found in this section yet.</div>
        )}
      </main>

      <NewsletterSection />
    </div>
  );
}
