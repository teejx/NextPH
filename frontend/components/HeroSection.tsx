'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../lib/wordpress/types';

interface HeroSectionProps {
  leadStory?: Article;
  featuredStories?: Article[];
  sidebarStories: Article[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  leadStory,
  featuredStories = [],
  sidebarStories,
}) => {
  // Normalize stories: prioritize featuredStories array, fallback to leadStory
  const stories = (
    featuredStories.length > 0
      ? featuredStories
      : leadStory
      ? [leadStory]
      : []
  ).slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalStories = stories.length;
  const currentStory = stories[currentIndex] || stories[0];

  const handleNext = useCallback(() => {
    if (totalStories <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalStories);
  }, [totalStories]);

  const handlePrev = useCallback(() => {
    if (totalStories <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalStories) % totalStories);
  }, [totalStories]);

  // Auto-advance carousel every 5.5 seconds unless user is hovering/interacting
  useEffect(() => {
    if (totalStories <= 1 || isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [totalStories, isPaused, handleNext]);

  if (!currentStory) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6 pb-10">
      {/* Primary Featured Story Card (Dark Obsidian Carousel Container) */}
      <div
        className="lg:col-span-8 group relative overflow-hidden rounded-xs bg-[#111113] text-white min-h-[440px] sm:min-h-[480px] flex flex-col justify-between"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured Stories Carousel"
        aria-live="polite"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {/* Right-side Images Stack: cross-fades smoothly between carousel items */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-[58%] lg:w-[60%] h-full overflow-hidden">
          {stories.map((story, idx) => (
            <Link
              key={`hero-img-${story.id}-${idx}`}
              href={`/story/${story.slug}`}
              tabIndex={idx === currentIndex ? 0 : -1}
              aria-label={`Read ${story.title}`}
              className={`absolute inset-0 block transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              <Image
                src={story.featuredImage.url}
                alt={story.featuredImage.alt || story.title}
                fill
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />
              {/* Smooth directional fade into solid black on the left side */}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111113] via-[#111113]/70 via-30% to-transparent pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* Left-side Text Content Column */}
        <div className="relative z-20 flex flex-col justify-between p-8 sm:p-10 lg:p-12 w-full md:w-[60%] lg:w-[55%] min-h-[440px] sm:min-h-[480px] pointer-events-none">
          <div className="pointer-events-auto transition-opacity duration-500 ease-out">
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              {currentStory.category.name}
            </span>
            <h1 className="mt-4 font-sans text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              <Link href={`/story/${currentStory.slug}`}>
                {currentStory.title}
              </Link>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-3 max-w-md">
              {currentStory.excerpt}
            </p>
          </div>

          {/* Bottom Bar: Read More CTA + Interactive Carousel Controls */}
          <div className="mt-8 flex items-center justify-between gap-4 pointer-events-auto">
            <Link
              href={`/story/${currentStory.slug}`}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white transition-transform hover:translate-x-1"
            >
              <span>Read More</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Carousel navigation: Chevrons + Pill Dots */}
            {totalStories > 1 && (
              <div className="flex items-center gap-2" role="group" aria-label="Slide controls">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous story"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-1.5" role="tablist" aria-label="Stories">
                  {stories.map((story, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={`hero-dot-${story.id}-${idx}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Slide ${idx + 1}: ${story.title}`}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'h-2 w-6 rounded-full bg-white shadow-xs'
                            : 'h-2 w-2 rounded-full bg-zinc-600 hover:bg-zinc-400'
                        }`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next story"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar: 3 Stacked Stories */}
      <div className="lg:col-span-4 flex flex-col justify-between divide-y divide-zinc-200 border-t border-b lg:border-t-0 lg:border-b-0 border-zinc-200 py-2 lg:py-0">
        {sidebarStories.slice(0, 3).map((story, idx) => (
          <article key={`hero-sidebar-${story.id}-${idx}`} className="group flex gap-4 py-4 first:pt-0 last:pb-0 items-center">
            {/* Thumbnail */}
            <Link
              href={`/story/${story.slug}`}
              className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xs bg-zinc-100"
            >
              <Image
                src={story.featuredImage.url}
                alt={story.featuredImage.alt || story.title}
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>

            {/* Details */}
            <div className="flex flex-col justify-center grow">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {story.category.name}
              </span>
              <h2 className="mt-1 font-sans text-sm sm:text-base font-bold leading-snug text-zinc-950 group-hover:text-zinc-600 transition-colors line-clamp-2">
                <Link href={`/story/${story.slug}`}>
                  {story.title}
                </Link>
              </h2>
              <Link
                href={`/story/${story.slug}`}
                className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-900 hover:text-black"
              >
                <span>Read More</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
