import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Cpu, Sparkles } from 'lucide-react';
import { getArticles, getFeaturedStory, getTrendingStories } from '../lib/wordpress/client';
import { HeroSection } from '../components/HeroSection';
import { CategoryStrip } from '../components/CategoryStrip';
import { LatestGridSection } from '../components/LatestGridSection';
import { StoryCard } from '../components/StoryCard';
import { AdSlot } from '../components/AdSlot';

export const revalidate = 120; // 2-minute ISR

export default async function HomePage() {
  const [featuredStory, trendingStories, techFeed, travelFeed, lifestyleFeed, latestFeed] =
    await Promise.all([
      getFeaturedStory(),
      getTrendingStories(5),
      getArticles({ categorySlug: 'tech', perPage: 4 }),
      getArticles({ categorySlug: 'travel', perPage: 4 }),
      getArticles({ categorySlug: 'lifestyle', perPage: 4 }),
      getArticles({ perPage: 10 }),
    ]);

  const leadStory = featuredStory || latestFeed.articles[0];

  if (!leadStory) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="font-sans text-2xl font-black text-zinc-900">No stories published yet</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Publish stories in WordPress or verify your API configuration.
        </p>
      </div>
    );
  }

  // Sidebar stories for hero (exclude lead story if present)
  const heroSidebar = (
    trendingStories.length >= 3
      ? trendingStories
      : latestFeed.articles.filter((a) => a.id !== leadStory.id)
  ).slice(0, 3);

  // Spotlight story for lower 3-column section (different from lead story)
  const spotlightStory =
    techFeed.articles.find((a) => a.id !== leadStory.id) ||
    travelFeed.articles.find((a) => a.id !== leadStory.id) ||
    latestFeed.articles.find((a) => a.id !== leadStory.id && !heroSidebar.some((s) => s.id === a.id)) ||
    leadStory;

  // 4 latest stories for lower 3-column section
  const latestListStories = latestFeed.articles
    .filter((a) => a.id !== leadStory.id && a.id !== spotlightStory.id)
    .slice(0, 4);

  // Additional curated dispatches from Tech & Travel
  const curatedStories = [
    ...techFeed.articles.filter((a) => a.id !== leadStory.id && a.id !== spotlightStory.id).slice(0, 2),
    ...travelFeed.articles.filter((a) => a.id !== leadStory.id && a.id !== spotlightStory.id).slice(0, 2),
  ].slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      {/* Top Leaderboard Ad Slot (disabled by default) */}
      <AdSlot placement="leaderboard" />

      {/* Main Hero Section: Dark Obsidian Card (8-col) + 3 Stacked Stories (4-col) */}
      <HeroSection leadStory={leadStory} sidebarStories={heroSidebar} />

      {/* 4-Card Photographic Category Navigation Strip */}
      <CategoryStrip />

      {/* 3-Column Lower Section: LATEST List + Editor Spotlight + STAY IN THE LOOP Newsletter */}
      <LatestGridSection
        latestStories={latestListStories.length > 0 ? latestListStories : latestFeed.articles.slice(0, 4)}
        spotlightStory={spotlightStory}
      />

      {/* In-feed Ad Slot (disabled by default) */}
      <AdSlot placement="in-feed" />

      {/* Curated Dispatches Grid */}
      {curatedStories.length > 0 && (
        <section className="mt-14 border-t border-zinc-200 pt-8" aria-labelledby="curated-stories-heading">
          <div className="flex items-center justify-between pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Curated Architecture & Culture
              </span>
              <h2 id="curated-stories-heading" className="mt-1 font-sans text-xl sm:text-2xl font-black text-zinc-950">
                Featured Dispatches
              </h2>
            </div>
            <Link
              href="/trending"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:text-zinc-600 transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {curatedStories.map((article) => (
              <StoryCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {/* Popular Topics / Tags Strip */}
      <section className="mt-14 rounded-xs border border-zinc-200 bg-white p-6 sm:p-8 text-center shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Explore Trending Topics
        </span>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {['fintech', 'batanes', 'ecotourism', 'culinary', 'space-science', 'coffee', 'palawan', 'digital-economy'].map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="rounded-full border border-zinc-200 px-3.5 py-1 text-xs font-bold text-zinc-900 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
