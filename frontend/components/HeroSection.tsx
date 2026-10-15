import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Article } from '../lib/wordpress/types';

interface HeroSectionProps {
  leadStory: Article;
  sidebarStories: Article[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  leadStory,
  sidebarStories,
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6 pb-10">
      {/* Primary Featured Story Card (Dark Obsidian Container) */}
      <div className="lg:col-span-8 group relative overflow-hidden rounded-xs bg-[#111113] text-white min-h-[460px] flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          {/* Text Content Column */}
          <div className="md:col-span-7 flex flex-col justify-between p-8 sm:p-10 lg:p-12 z-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                {leadStory.category.name}
              </span>
              <h1 className="mt-4 font-sans text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                <Link href={`/story/${leadStory.slug}`}>
                  {leadStory.title}
                </Link>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-3 max-w-md">
                {leadStory.excerpt}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Link
                href={`/story/${leadStory.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white transition-transform hover:translate-x-1"
              >
                <span>Read More</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              {/* Slider dots indicator */}
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-white"></span>
                <span className="h-2 w-2 rounded-full bg-zinc-600"></span>
                <span className="h-2 w-2 rounded-full bg-zinc-600"></span>
                <span className="h-2 w-2 rounded-full bg-zinc-600"></span>
              </div>
            </div>
          </div>

          {/* Image Column (Bleeds cleanly into dark container) */}
          <div className="md:col-span-5 relative min-h-[280px] md:min-h-full overflow-hidden">
            <Image
              src={leadStory.featuredImage.url}
              alt={leadStory.featuredImage.alt || leadStory.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103 opacity-90"
            />
            {/* Subtle gradient vignette to blend into dark surface on left */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111113] via-transparent to-transparent opacity-80 md:opacity-60" />
          </div>
        </div>
      </div>

      {/* Right Sidebar: 3 Stacked Stories */}
      <div className="lg:col-span-4 flex flex-col justify-between divide-y divide-zinc-200 border-t border-b lg:border-t-0 lg:border-b-0 border-zinc-200 py-2 lg:py-0">
        {sidebarStories.slice(0, 3).map((story) => (
          <article key={story.id} className="group flex gap-4 py-4 first:pt-0 last:pb-0 items-center">
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
