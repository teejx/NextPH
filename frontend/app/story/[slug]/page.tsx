import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, RefreshCw, ChevronRight } from 'lucide-react';
import { getArticleBySlug, getArticles } from '../../../lib/wordpress/client';
import { ShareButtons } from '../../../components/ShareButtons';
import { VideoEmbed } from '../../../components/VideoEmbed';
import { StoryCard } from '../../../components/StoryCard';
import { NewsletterSection } from '../../../components/NewsletterSection';
import { AdSlot } from '../../../components/AdSlot';

interface StoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 120;

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Story Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/story/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.featuredImage.url,
          width: article.featuredImage.width,
          height: article.featuredImage.height,
          alt: article.featuredImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage.url],
    },
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Fetch related stories from same category
  const { articles: relatedStories } = await getArticles({
    categorySlug: article.category.slug,
    perPage: 4,
  });
  const filteredRelated = relatedStories.filter((a) => a.slug !== article.slug).slice(0, 3);

  const formattedPublishDate = new Date(article.publishedAt).toLocaleDateString('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedUpdateDate = new Date(article.updatedAt).toLocaleDateString('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const storyUrl = `${siteUrl}/story/${article.slug}`;

  // Structured Data (Schema.org NewsArticle JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: [article.featuredImage.url],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: [
      {
        '@type': 'Person',
        name: article.author.name,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'NextPH',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': storyUrl,
    },
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-300" />
          <Link href={`/${article.category.slug}`} className="hover:text-zinc-950 transition-colors">
            {article.category.name}
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-300" />
          <span className="text-zinc-700 truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Story Header */}
        <header className="mt-6 border-b border-zinc-200 pb-8">
          <Link
            href={`/${article.category.slug}`}
            className="inline-block text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
          >
            {article.category.name}
          </Link>

          <h1 className="mt-3 font-sans text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-zinc-950">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-4 text-lg sm:text-xl text-zinc-600 leading-relaxed font-light">
              {article.excerpt}
            </p>
          )}

          {/* Author & Timestamps Metadata Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-4 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              {article.author.avatarUrl && (
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-100">
                  <Image
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <span className="block font-bold text-zinc-950">{article.author.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">NextPH Editorial</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-zinc-500">
              <div className="flex items-center gap-1.5" title="Published date">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                <span>{formattedPublishDate}</span>
              </div>

              {article.updatedAt !== article.publishedAt && (
                <div className="flex items-center gap-1.5 text-zinc-500" title="Last updated date">
                  <RefreshCw className="h-3 w-3 text-zinc-400" />
                  <span>Updated {formattedUpdateDate}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5" title="Estimated reading time">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span>{article.readingTimeMinutes} min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Top Ad Slot (disabled by default) */}
        <AdSlot placement="leaderboard" />

        {/* Hero Featured Media */}
        {(() => {
          const isPortrait =
            article.featuredImage.width && article.featuredImage.height
              ? article.featuredImage.height > article.featuredImage.width * 1.05
              : false;

          return (
            <figure className={`my-8 ${isPortrait ? 'flex flex-col items-center' : ''}`}>
              <div
                className={`relative overflow-hidden rounded-xs border border-zinc-200 bg-zinc-100 ${
                  isPortrait
                    ? 'w-full max-w-md aspect-3/4 sm:aspect-2/3 shadow-xl ring-1 ring-zinc-900/5'
                    : 'w-full aspect-16/10 sm:aspect-16/9 shadow-xs'
                }`}
              >
                <Image
                  src={article.featuredImage.url}
                  alt={article.featuredImage.alt || article.title}
                  fill
                  priority
                  sizes={isPortrait ? '(max-width: 768px) 100vw, 448px' : '(max-width: 1024px) 100vw, 896px'}
                  className={`${isPortrait ? 'object-cover' : 'object-contain sm:object-cover'}`}
                />
              </div>
              {article.featuredImage.alt && (
                <figcaption className="mt-2 text-center text-xs text-zinc-500">
                  Photo: {article.featuredImage.alt}
                </figcaption>
              )}
            </figure>
          );
        })()}

        {/* Video Embed (if present) */}
        {article.videoEmbedUrl && (
          <VideoEmbed embedUrl={article.videoEmbedUrl} title={`${article.title} - Video Dispatch`} />
        )}

        {/* Article Body Content */}
        <div
          className="prose prose-zinc max-w-none text-zinc-900 leading-relaxed text-base sm:text-lg
            [&>p]:my-6 [&>p]:leading-relaxed
            [&>h2]:font-sans [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-black [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:tracking-tight
            [&>blockquote]:my-8 [&>blockquote]:border-l-2 [&>blockquote]:border-zinc-900 [&>blockquote]:pl-6 [&>blockquote]:font-sans [&>blockquote]:font-semibold [&>blockquote]:text-xl [&>blockquote]:text-zinc-800
            [&>ul]:my-6 [&>ul]:list-disc [&>ul]:pl-6
            [&>ol]:my-6 [&>ol]:list-decimal [&>ol]:pl-6
            [&>figure]:my-8 [&>figure>img]:rounded-xs"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Tags Row */}
        {article.tags.length > 0 && (
          <div className="mt-12 border-t border-zinc-200 pt-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">
              Related Topics
            </span>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="rounded-full border border-zinc-200 bg-white px-3.5 py-1 text-xs font-bold text-zinc-900 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Social Sharing Controls */}
        <div className="mt-8 border-t border-zinc-200 pt-4">
          <ShareButtons title={article.title} url={storyUrl} />
        </div>

        {/* Author Bio Box */}
        {article.author.bio && (
          <div className="mt-10 rounded-xs border border-zinc-200 bg-zinc-50 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            {article.author.avatarUrl && (
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-zinc-200 shrink-0">
                <Image
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-zinc-950">About {article.author.name}</h4>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">{article.author.bio}</p>
            </div>
          </div>
        )}

        {/* Related Stories */}
        {filteredRelated.length > 0 && (
          <section className="mt-16 border-t border-zinc-200 pt-10" aria-labelledby="related-heading">
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Continue Reading
              </span>
              <h2 id="related-heading" className="font-sans text-xl sm:text-2xl font-black text-zinc-950 mt-1">
                More in {article.category.name}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRelated.map((related) => (
                <StoryCard key={related.id} article={related} variant="standard" />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <NewsletterSection />
      </article>
    </>
  );
}
