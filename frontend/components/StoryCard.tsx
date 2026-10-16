import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Article } from '../lib/wordpress/types';
import { isGifImage, isVideoMedia } from '../lib/media';

interface StoryCardProps {
  article: Article;
  variant?: 'hero' | 'standard' | 'compact' | 'trending';
  rankIndex?: number;
  priorityImage?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  article,
  variant = 'standard',
  rankIndex,
  priorityImage = false,
}) => {
  const isGif = isGifImage(article.featuredImage.url);
  const hasVideo = Boolean(article.videoEmbedUrl || isVideoMedia(article.featuredImage.url));

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Hero Lead Variant
  if (variant === 'hero') {
    return (
      <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-zinc-200 pb-10">
        <div className="lg:col-span-7 overflow-hidden rounded-xs bg-zinc-100 relative">
          <Link href={`/story/${article.slug}`} className="block relative aspect-16/10 w-full overflow-hidden">
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.alt || article.title}
              fill
              priority={priorityImage}
              unoptimized={isGif}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            />
            {hasVideo && (
              <span className="absolute top-3 right-3 z-10 rounded-full bg-zinc-950/85 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                VIDEO
              </span>
            )}
            {!hasVideo && isGif && (
              <span className="absolute top-3 right-3 z-10 rounded-full bg-zinc-950/85 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                GIF
              </span>
            )}
          </Link>
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <Link
              href={`/${article.category.slug}`}
              className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black"
            >
              {article.category.name}
            </Link>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-400">{formattedDate}</span>
          </div>

          <h2 className="mt-3 font-sans text-2xl sm:text-4xl font-black leading-tight tracking-tight text-zinc-950 group-hover:text-zinc-600 transition-colors">
            <Link href={`/story/${article.slug}`}>{article.title}</Link>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-600 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
            <Link
              href={`/story/${article.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:text-black"
            >
              <span>Read More</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <span className="text-xs text-zinc-400">{article.readingTimeMinutes} min read</span>
          </div>
        </div>
      </article>
    );
  }

  // Trending Ranked Variant
  if (variant === 'trending') {
    const formattedRank = rankIndex !== undefined ? String(rankIndex + 1).padStart(2, '0') : null;
    return (
      <article className="group flex items-start gap-4 py-4 border-b border-zinc-100 last:border-b-0">
        {formattedRank && (
          <span className="font-sans text-2xl sm:text-3xl font-black text-zinc-300 group-hover:text-black transition-colors leading-none shrink-0 w-8">
            {formattedRank}
          </span>
        )}
        <div className="grow">
          <Link
            href={`/${article.category.slug}`}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black"
          >
            {article.category.name}
          </Link>
          <h4 className="mt-1 font-sans text-sm sm:text-base font-bold leading-snug text-zinc-950 group-hover:text-zinc-600 transition-colors">
            <Link href={`/story/${article.slug}`}>{article.title}</Link>
          </h4>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>
        </div>
      </article>
    );
  }

  // Compact Variant (e.g. sidebars or list rows)
  if (variant === 'compact') {
    return (
      <article className="group flex gap-4 py-3 border-b border-zinc-100 last:border-b-0 items-center">
        <div className="relative h-18 w-20 shrink-0 overflow-hidden rounded-xs bg-zinc-100">
          <Image
            src={article.featuredImage.url}
            alt={article.featuredImage.alt || article.title}
            fill
            unoptimized={isGif}
            sizes="80px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="grow">
          <Link
            href={`/${article.category.slug}`}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
          >
            {article.category.name}
          </Link>
          <h4 className="mt-0.5 font-sans text-xs sm:text-sm font-bold leading-snug text-zinc-950 group-hover:text-zinc-600 transition-colors line-clamp-2">
            <Link href={`/story/${article.slug}`}>{article.title}</Link>
          </h4>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mt-1 block">{formattedDate}</span>
        </div>
      </article>
    );
  }

  // Standard Grid Card Variant
  return (
    <article className="group flex flex-col overflow-hidden rounded-xs border border-zinc-200 bg-white transition-all hover:shadow-md">
      <Link href={`/story/${article.slug}`} className="block relative aspect-16/10 w-full overflow-hidden bg-zinc-100">
        <Image
          src={article.featuredImage.url}
          alt={article.featuredImage.alt || article.title}
          fill
          unoptimized={isGif}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
        />
        {hasVideo && (
          <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-zinc-950/85 backdrop-blur-xs px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
            VIDEO
          </span>
        )}
        {!hasVideo && isGif && (
          <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-zinc-950/85 backdrop-blur-xs px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
            GIF
          </span>
        )}
      </Link>
      <div className="flex flex-col grow p-5">
        <div className="flex items-center justify-between text-xs">
          <Link
            href={`/${article.category.slug}`}
            className="font-bold uppercase tracking-widest text-[10px] text-zinc-500 hover:text-black"
          >
            {article.category.name}
          </Link>
          <span className="text-[11px] text-zinc-400">{formattedDate}</span>
        </div>

        <h3 className="mt-2 font-sans text-base sm:text-lg font-bold leading-snug text-zinc-950 group-hover:text-zinc-600 transition-colors line-clamp-2">
          <Link href={`/story/${article.slug}`}>{article.title}</Link>
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed grow">
          {article.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
          <Link
            href={`/story/${article.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:text-black"
          >
            <span>Read More</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <span className="text-xs text-zinc-400">{article.readingTimeMinutes} min read</span>
        </div>
      </div>
    </article>
  );
};
