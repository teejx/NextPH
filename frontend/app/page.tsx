import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Compass, Cpu, Coffee } from 'lucide-react';
import { getArticles, getFeaturedStory, getTrendingStories } from '../lib/wordpress/client';
import { StoryCard } from '../components/StoryCard';
import { TrendingSection } from '../components/TrendingSection';
import { NewsletterSection } from '../components/NewsletterSection';
import { AdSlot } from '../components/AdSlot';

export const revalidate = 120; // 2-minute ISR

export default async function HomePage() {
  const [featuredStory, trendingStories, techFeed, travelFeed, lifestyleFeed, latestFeed] =
    await Promise.all([
      getFeaturedStory(),
      getTrendingStories(5),
      getArticles({ categorySlug: 'tech', perPage: 3 }),
      getArticles({ categorySlug: 'travel', perPage: 3 }),
      getArticles({ categorySlug: 'lifestyle', perPage: 3 }),
      getArticles({ perPage: 6 }),
    ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Ad Slot (disabled by default) */}
      <AdSlot placement="leaderboard" />

      {/* Hero Lead Section & Trending Column */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8">
          {featuredStory ? (
            <StoryCard article={featuredStory} variant="hero" priorityImage={true} />
          ) : (
            <div className="py-12 text-center text-[#76716B]">No featured stories published yet.</div>
          )}
        </div>
        <div className="lg:col-span-4">
          <TrendingSection stories={trendingStories} />
        </div>
      </section>

      {/* In-feed Ad Slot (disabled by default) */}
      <AdSlot placement="in-feed" />

      {/* Latest Stories Grid */}
      <section className="mt-16 border-t border-[#CCC7BD] pt-10" aria-labelledby="latest-stories-heading">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#C43622]" />
            <h2 id="latest-stories-heading" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#141312]">
              Latest Dispatches
            </h2>
          </div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#76716B]">
            All Categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestFeed.articles.slice(0, 6).map((article) => (
            <StoryCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      </section>

      {/* Tech Section Feed */}
      <section className="mt-16 border-t border-[#CCC7BD] pt-10" aria-labelledby="tech-section-heading">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-[#C43622]" />
            <h2 id="tech-section-heading" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#141312]">
              Technology & Innovation
            </h2>
          </div>
          <Link
            href="/tech"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C43622] hover:underline"
          >
            <span>Explore Tech</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techFeed.articles.map((article) => (
            <StoryCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      </section>

      {/* Travel Section Feed */}
      <section className="mt-16 border-t border-[#CCC7BD] pt-10" aria-labelledby="travel-section-heading">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#C43622]" />
            <h2 id="travel-section-heading" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#141312]">
              Archipelago Travel
            </h2>
          </div>
          <Link
            href="/travel"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C43622] hover:underline"
          >
            <span>Explore Travel</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {travelFeed.articles.map((article) => (
            <StoryCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      </section>

      {/* Lifestyle Section Feed */}
      <section className="mt-16 border-t border-[#CCC7BD] pt-10" aria-labelledby="lifestyle-section-heading">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-[#C43622]" />
            <h2 id="lifestyle-section-heading" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#141312]">
              Contemporary Lifestyle & Culture
            </h2>
          </div>
          <Link
            href="/lifestyle"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C43622] hover:underline"
          >
            <span>Explore Lifestyle</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lifestyleFeed.articles.map((article) => (
            <StoryCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      </section>

      {/* Popular Topics / Tags Strip */}
      <section className="mt-16 rounded-sm border border-[#CCC7BD] bg-white p-6 sm:p-8 text-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#76716B]">Explore Popular Topics</h3>
        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          {['fintech', 'batanes', 'ecotourism', 'culinary', 'space-science', 'coffee', 'palawan', 'digital-economy'].map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="rounded-full border border-[#CCC7BD] px-4 py-1.5 text-xs font-semibold text-[#141312] transition-colors hover:border-[#141312] hover:bg-[#F3EFEA] hover:text-[#C43622]"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <NewsletterSection />
    </div>
  );
}
