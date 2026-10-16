'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../lib/wordpress/types';
import { isGifImage, isVideoMedia } from '../lib/media';

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
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch pt-6 pb-10">
      {/* Primary Featured Story Card (16:9 1080p Widescreen Carousel Container) */}
      <div
        className="lg:col-span-8 group relative overflow-hidden rounded-xs bg-[#111113] text-white w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] sm:min-h-[440px] lg:min-h-[460px] flex flex-col justify-between shadow-md"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured Stories Carousel"
        aria-live="polite"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {/* Full-bleed Images Stack: full card occupancy for big photos, fade fallback for narrow photos */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {stories.map((story, idx) => {
            const isSmallWidth =
              story.featuredImage.width && story.featuredImage.height
                ? story.featuredImage.width / story.featuredImage.height < 1.25
                : false;

            return (
              <Link
                key={`hero-img-${story.id}-${idx}`}
                href={`/story/${story.slug}`}
                tabIndex={idx === currentIndex ? 0 : -1}
                aria-label={`Read ${story.title}`}
                className={`absolute inset-0 block transition-opacity duration-700 ease-in-out ${
                  idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                {isSmallWidth ? (
                  /* Fallback for narrow/portrait photos: positioned on right with smooth fade into dark on left */
                  <>
                    <div className="absolute inset-0 w-full h-full flex justify-end items-center">
                      <div className="relative w-full sm:w-[65%] h-full">
                        <Image
                          src={story.featuredImage.url}
                          alt={story.featuredImage.alt || story.title}
                          fill
                          priority={idx === 0}
                          unoptimized={isGifImage(story.featuredImage.url)}
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          className="object-contain object-right pointer-events-none"
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111113] via-[#111113]/85 via-45% to-transparent pointer-events-none z-10" />
                  </>
                ) : (
                  /* 1080p / wide landscape photo: occupies the WHOLE feature area without fade, just text with shadows */
                  <>
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <Image
                        src={story.featuredImage.url}
                        alt={story.featuredImage.alt || story.title}
                        fill
                        priority={idx === 0}
                        unoptimized={isGifImage(story.featuredImage.url)}
                        sizes="(max-width: 1024px) 100vw, 68vw"
                        className="object-cover object-center pointer-events-none"
                      />
                    </div>
                    {/* Subtle ambient darkening for crystal clear text legibility across all highlights */}
                    <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />
                  </>
                )}
              </Link>
            );
          })}
        </div>

        {/* Left-side Text Content Column with text drop shadows */}
        <div className="relative z-20 flex flex-col justify-between p-8 sm:p-10 lg:p-12 w-full md:w-[68%] lg:w-[62%] min-h-full pointer-events-none pb-16 sm:pb-20">
          <div className="pointer-events-auto transition-opacity duration-500 ease-out">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {currentStory.category.name}
              </span>
              {Boolean(currentStory.videoEmbedUrl || isVideoMedia(currentStory.featuredImage.url)) && (
                <span className="rounded-full bg-white/20 backdrop-blur-xs px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white drop-shadow-md">
                  VIDEO
                </span>
              )}
              {!Boolean(currentStory.videoEmbedUrl || isVideoMedia(currentStory.featuredImage.url)) && isGifImage(currentStory.featuredImage.url) && (
                <span className="rounded-full bg-white/20 backdrop-blur-xs px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white drop-shadow-md">
                  GIF
                </span>
              )}
            </div>
            <h1 className="mt-4 font-sans text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white group-hover:text-zinc-200 transition-colors drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <Link href={`/story/${currentStory.slug}`}>
                {currentStory.title}
              </Link>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-zinc-100 leading-relaxed line-clamp-3 max-w-md drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              {currentStory.excerpt}
            </p>
          </div>

          {/* Bottom-left: Read More CTA */}
          <div className="mt-8 pointer-events-auto">
            <Link
              href={`/story/${currentStory.slug}`}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white transition-transform hover:translate-x-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
            >
              <span>Read More</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Middle Bottom Pagination Controls */}
        {totalStories > 1 && (
          <div
            className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 pointer-events-auto"
            role="group"
            aria-label="Slide controls"
          >
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous story"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/10 transition-colors cursor-pointer"
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
                        ? 'h-2 w-7 rounded-full bg-white shadow-md'
                        : 'h-2 w-2 rounded-full bg-white/40 hover:bg-white/70'
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next story"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar: 3 Stacked Stories - Moved to right side with bigger pictures */}
      <div className="lg:col-span-4 flex flex-col justify-between divide-y divide-zinc-200 border-t border-b lg:border-t-0 lg:border-b-0 border-zinc-200 py-1 lg:py-0">
        {sidebarStories.slice(0, 3).map((story, idx) => (
          <article
            key={`hero-sidebar-${story.id}-${idx}`}
            className="group flex gap-4 sm:gap-5 py-4 first:pt-0 last:pb-0 items-center"
          >
            {/* Thumbnail: Rectangular & Bigger matching uploaded design */}
            <Link
              href={`/story/${story.slug}`}
              className="relative w-36 sm:w-40 lg:w-44 h-24 sm:h-28 lg:h-30 shrink-0 overflow-hidden rounded-xs bg-zinc-100 shadow-2xs"
            >
              <Image
                src={story.featuredImage.url}
                alt={story.featuredImage.alt || story.title}
                fill
                unoptimized={isGifImage(story.featuredImage.url)}
                sizes="(max-width: 1024px) 160px, 180px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {Boolean(story.videoEmbedUrl || isVideoMedia(story.featuredImage.url)) && (
                <span className="absolute top-2 right-2 z-10 rounded-full bg-zinc-950/85 backdrop-blur-xs px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                  VIDEO
                </span>
              )}
              {!Boolean(story.videoEmbedUrl || isVideoMedia(story.featuredImage.url)) && isGifImage(story.featuredImage.url) && (
                <span className="absolute top-2 right-2 z-10 rounded-full bg-zinc-950/85 backdrop-blur-xs px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                  GIF
                </span>
              )}
            </Link>

            {/* Details */}
            <div className="flex flex-col justify-center grow min-w-0">
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
