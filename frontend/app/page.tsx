import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getArticles, getFeaturedStories, getTrendingStories, getTags } from '../lib/wordpress/client';
import { HeroSection } from '../components/HeroSection';
import { CategoryStrip } from '../components/CategoryStrip';
import { LatestGridSection } from '../components/LatestGridSection';
import { StoryCard } from '../components/StoryCard';
import { AdSlot } from '../components/AdSlot';
import { Article } from '../lib/wordpress/types';

export const revalidate = 120; // 2-minute ISR

export default async function HomePage() {
  const [featuredStories, trendingStories, newsFeed, techFeed, travelFeed, lifestyleFeed, latestFeed, popularTags] =
    await Promise.all([
      getFeaturedStories(4),
      getTrendingStories(6),
      getArticles({ categorySlug: 'news', perPage: 4 }),
      getArticles({ categorySlug: 'tech', perPage: 4 }),
      getArticles({ categorySlug: 'travel', perPage: 4 }),
      getArticles({ categorySlug: 'lifestyle', perPage: 4 }),
      getArticles({ perPage: 12 }),
      getTags(12),
    ]);

  const leadStory = featuredStories[0] || latestFeed.articles[0];

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

  // Set of IDs used in the hero carousel to prevent immediate duplication in hero sidebar
  const heroCarouselIds = new Set(featuredStories.map((s) => s.id));

  // Sidebar stories for hero: Pick up to 3 distinct stories
  const heroCandidates = [
    ...trendingStories.filter((a) => !heroCarouselIds.has(a.id)),
    ...latestFeed.articles.filter((a) => !heroCarouselIds.has(a.id)),
    ...trendingStories, // fallback if not enough candidates
  ];
  const seenHeroSidebarIds = new Set<string>();
  const heroSidebar: Article[] = [];
  for (const story of heroCandidates) {
    if (!seenHeroSidebarIds.has(story.id)) {
      seenHeroSidebarIds.add(story.id);
      heroSidebar.push(story);
      if (heroSidebar.length >= 3) break;
    }
  }

  // Spotlight story for lower 3-column section (distinct from hero carousel)
  const spotlightStory =
    newsFeed.articles.find((a) => !heroCarouselIds.has(a.id) && !seenHeroSidebarIds.has(a.id)) ||
    techFeed.articles.find((a) => !heroCarouselIds.has(a.id) && !seenHeroSidebarIds.has(a.id)) ||
    travelFeed.articles.find((a) => !heroCarouselIds.has(a.id) && !seenHeroSidebarIds.has(a.id)) ||
    latestFeed.articles.find((a) => !heroCarouselIds.has(a.id) && !seenHeroSidebarIds.has(a.id)) ||
    leadStory;

  // 4 latest stories for lower 3-column section (excluding spotlight story)
  const usedForSpotlight = new Set([spotlightStory.id]);
  const latestListStories = latestFeed.articles
    .filter((a) => !usedForSpotlight.has(a.id))
    .slice(0, 4);

  // Curated dispatches: strictly de-duplicated by ID to prevent any duplicate key errors
  // Prioritizes stories marked as curated trending, then pillar category stories
  const rawCurated = [
    ...trendingStories.filter((a) => !heroCarouselIds.has(a.id) && a.id !== spotlightStory.id),
    ...newsFeed.articles.filter((a) => a.id !== spotlightStory.id),
    ...techFeed.articles.filter((a) => a.id !== spotlightStory.id),
    ...travelFeed.articles.filter((a) => a.id !== spotlightStory.id),
    ...lifestyleFeed.articles.filter((a) => a.id !== spotlightStory.id),
    ...latestFeed.articles.filter((a) => a.id !== spotlightStory.id),
  ];
  const seenCuratedIds = new Set<string>();
  const curatedStories: Article[] = [];
  for (const story of rawCurated) {
    if (!seenCuratedIds.has(story.id)) {
      seenCuratedIds.add(story.id);
      curatedStories.push(story);
      if (curatedStories.length >= 4) break;
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      {/* Top Leaderboard Ad Slot (disabled by default) */}
      <AdSlot placement="leaderboard" />

      {/* Main Hero Section: Dark Obsidian Carousel (8-col) + 3 Stacked Stories (4-col) */}
      <HeroSection
        leadStory={leadStory}
        featuredStories={featuredStories}
        sidebarStories={heroSidebar}
      />

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
            {curatedStories.map((article, idx) => (
              <StoryCard
                key={`curated-${article.id}-${idx}`}
                article={article}
                variant="standard"
              />
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
          {popularTags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className="rounded-full border border-zinc-200 px-3.5 py-1 text-xs font-bold text-zinc-900 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
