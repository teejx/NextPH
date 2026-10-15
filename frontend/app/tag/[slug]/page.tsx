import React from 'react';
import type { Metadata } from 'next';
import { getArticles } from '../../../lib/wordpress/client';
import { StoryCard } from '../../../components/StoryCard';
import { NewsletterSection } from '../../../components/NewsletterSection';

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 120;

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  return {
    title: `#${decoded} Stories & Dispatches`,
    description: `Stories tagged with #${decoded} on NextPH.`,
  };
}

export default async function TagArchivePage({ params }: TagPageProps) {
  const { slug } = await params;
  const decodedTag = decodeURIComponent(slug);
  const { articles } = await getArticles({ tagSlug: decodedTag, perPage: 12 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-[#CCC7BD] pb-8 pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C43622]">Topic Archive</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312]">
          #{decodedTag}
        </h1>
        <p className="mt-3 text-base text-[#4A4642]">
          Curated stories and editorial features tagged under #{decodedTag}.
        </p>
      </header>

      <main className="mt-10">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <StoryCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-[#76716B]">No stories found under #{decodedTag}.</div>
        )}
      </main>

      <NewsletterSection />
    </div>
  );
}
