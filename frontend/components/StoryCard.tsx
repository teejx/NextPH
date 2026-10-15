import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Article } from '../lib/wordpress/types';

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
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Hero Lead Variant
  if (variant === 'hero') {
    return (
      <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#CCC7BD] pb-10">
        <div className="lg:col-span-7 overflow-hidden rounded-sm bg-[#F3EFEA]">
          <Link href={`/story/${article.slug}`} className="block relative aspect-16/10 w-full overflow-hidden">
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.alt || article.title}
              fill
              priority={priorityImage}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
            />
          </Link>
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <Link
              href={`/${article.category.slug}`}
              className="text-xs font-bold uppercase tracking-wider text-[#C43622] hover:underline"
            >
              {article.category.name}
            </Link>
            <span className="text-[#CCC7BD]">•</span>
            <span className="text-xs text-[#76716B]">{formattedDate}</span>
          </div>

          <h1 className="mt-3 font-serif text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-[#141312] group-hover:text-[#C43622] transition-colors">
            <Link href={`/story/${article.slug}`}>{article.title}</Link>
          </h1>

          <p className="mt-3 text-base text-[#4A4642] line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-[#E8E4DD] pt-4">
            <div className="flex items-center gap-3">
              {article.author.avatarUrl && (
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#E8E4DD]">
                  <Image
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-xs font-medium text-[#141312]">{article.author.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#76716B]">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readingTimeMinutes} min read</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Trending Ranked Variant
  if (variant === 'trending') {
    const formattedRank = rankIndex !== undefined ? String(rankIndex + 1).padStart(2, '0') : null;
    return (
      <article className="group flex items-start gap-4 py-4 border-b border-[#E8E4DD] last:border-b-0">
        {formattedRank && (
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#C43622] leading-none shrink-0 w-8">
            {formattedRank}
          </span>
        )}
        <div className="grow">
          <Link
            href={`/${article.category.slug}`}
            className="text-[11px] font-bold uppercase tracking-wider text-[#76716B] hover:text-[#C43622]"
          >
            {article.category.name}
          </Link>
          <h4 className="mt-1 font-serif text-base font-semibold leading-snug text-[#141312] group-hover:text-[#C43622] transition-colors">
            <Link href={`/story/${article.slug}`}>{article.title}</Link>
          </h4>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-[#76716B]">
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
      <article className="group flex gap-4 py-3 border-b border-[#E8E4DD] last:border-b-0 items-center">
        <div className="relative h-18 w-24 shrink-0 overflow-hidden rounded-xs bg-[#F3EFEA]">
          <Image
            src={article.featuredImage.url}
            alt={article.featuredImage.alt || article.title}
            fill
            sizes="96px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="grow">
          <Link
            href={`/${article.category.slug}`}
            className="text-[10px] font-bold uppercase tracking-wider text-[#C43622]"
          >
            {article.category.name}
          </Link>
          <h4 className="mt-0.5 font-serif text-sm font-semibold leading-snug text-[#141312] group-hover:text-[#C43622] transition-colors line-clamp-2">
            <Link href={`/story/${article.slug}`}>{article.title}</Link>
          </h4>
          <span className="text-[11px] text-[#76716B] mt-1 block">{formattedDate}</span>
        </div>
      </article>
    );
  }

  // Standard Grid Card Variant
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-[#E8E4DD] bg-white transition-shadow hover:shadow-sm">
      <Link href={`/story/${article.slug}`} className="block relative aspect-16/10 w-full overflow-hidden bg-[#F3EFEA]">
        <Image
          src={article.featuredImage.url}
          alt={article.featuredImage.alt || article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
        />
      </Link>
      <div className="flex flex-col grow p-5">
        <div className="flex items-center justify-between text-xs">
          <Link
            href={`/${article.category.slug}`}
            className="font-bold uppercase tracking-wider text-[#C43622] hover:underline"
          >
            {article.category.name}
          </Link>
          <span className="text-[#76716B]">{formattedDate}</span>
        </div>

        <h3 className="mt-2.5 font-serif text-lg sm:text-xl font-bold leading-snug text-[#141312] group-hover:text-[#C43622] transition-colors line-clamp-2">
          <Link href={`/story/${article.slug}`}>{article.title}</Link>
        </h3>

        <p className="mt-2 text-sm text-[#4A4642] line-clamp-2 leading-relaxed grow">
          {article.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-[#E8E4DD] pt-3 text-xs text-[#76716B]">
          <span>By {article.author.name}</span>
          <span>{article.readingTimeMinutes} min read</span>
        </div>
      </div>
    </article>
  );
};
