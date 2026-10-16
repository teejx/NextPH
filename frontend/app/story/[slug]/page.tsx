import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { getArticleBySlug, getArticles } from '../../../lib/wordpress/client';
import { ShareButtons } from '../../../components/ShareButtons';
import { VideoEmbed } from '../../../components/VideoEmbed';
import { StoryCard } from '../../../components/StoryCard';
import { NewsletterSection } from '../../../components/NewsletterSection';
import { AdSlot } from '../../../components/AdSlot';
import { isGifImage } from '../../../lib/media';

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
      name: "WHAT'S NEXT PH",
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

      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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
          <span className="text-zinc-700 truncate max-w-md">{article.title}</span>
        </nav>

        {/* Story Header */}
        <header className="mt-6 border-b border-zinc-200 pb-8 max-w-4xl">
          <div className="flex items-center gap-3">
            <Link
              href={`/${article.category.slug}`}
              className="inline-block text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
            >
              {article.category.name}
            </Link>
            <span className="text-zinc-300">•</span>
            <time dateTime={article.publishedAt} className="text-xs text-zinc-500 font-medium">
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>

          <h1 className="mt-3 font-sans text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-zinc-950">
            {article.title}
          </h1>
        </header>

        {/* Top Ad Slot (disabled by default) */}
        <AdSlot placement="leaderboard" />


        {/* Video Embed (if present and distinct from featured media) */}
        {article.videoEmbedUrl && article.videoEmbedUrl !== article.featuredImage.url && (
          <VideoEmbed embedUrl={article.videoEmbedUrl} title={`${article.title} - Video Dispatch`} />
        )}

        {/* Editorial Main Content Layout (12-Col Grid) */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Rail: Sticky Social Sharing (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 flex flex-col items-center">
              <ShareButtons variant="vertical" title={article.title} url={storyUrl} />
            </div>
          </aside>

          {/* Center Column: Reading Prose Column (Max 740px / 65-75ch optimal measure) */}
          <div className="lg:col-span-8 max-w-[740px] mx-auto lg:mx-0 w-full">
            {/* Article Body Content */}
            <div
              className="prose prose-zinc max-w-none break-words text-zinc-900
                [&>p]:my-6 [&>p]:text-[17px] [&>p]:sm:text-[18px] [&>p]:leading-[1.85] [&>p]:text-zinc-800
                [&>h2]:font-sans [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-black [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:tracking-tight [&>h2]:text-zinc-950
                [&>h3]:font-sans [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:font-bold [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:tracking-tight [&>h3]:text-zinc-900
                [&>blockquote]:my-8 [&>blockquote]:border-l-4 [&>blockquote]:border-zinc-950 [&>blockquote]:bg-zinc-50 [&>blockquote]:py-4 [&>blockquote]:px-6 [&>blockquote]:italic [&>blockquote]:text-xl [&>blockquote]:text-zinc-900 [&>blockquote]:rounded-r-sm
                [&>ul]:my-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2
                [&>ol]:my-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2
                [&>figure]:my-8 [&>figure>img]:rounded-xs [&>figure>img]:w-full [&>figure>img]:h-auto
                [&>figure>figcaption]:mt-2 [&>figure>figcaption]:text-center [&>figure>figcaption]:text-xs [&>figure>figcaption]:text-zinc-500
                [&>p>img]:my-6 [&>p>img]:rounded-xs [&>p>img]:max-w-full [&>p>img]:h-auto
                [&>video]:my-8 [&>video]:w-full [&>video]:aspect-video [&>video]:rounded-xs [&>video]:bg-black [&>video]:shadow-sm
                [&>figure.wp-block-video]:my-8 [&>figure.wp-block-video]:w-full
                [&>figure.wp-block-video>video]:w-full [&>figure.wp-block-video>video]:rounded-xs [&>figure.wp-block-video>video]:bg-black [&>figure.wp-block-video>video]:shadow-sm
                [&>iframe]:my-8 [&>iframe]:w-full [&>iframe]:aspect-video [&>iframe]:rounded-xs [&>iframe]:bg-black
                [&>figure.wp-block-embed]:my-8 [&>figure.wp-block-embed]:w-full
                [&_.wp-block-embed__wrapper]:relative [&_.wp-block-embed__wrapper]:aspect-video [&_.wp-block-embed__wrapper>iframe]:absolute [&_.wp-block-embed__wrapper>iframe]:inset-0 [&_.wp-block-embed__wrapper>iframe]:h-full [&_.wp-block-embed__wrapper>iframe]:w-full [&_.wp-block-embed__wrapper>iframe]:rounded-xs
                [&>a]:text-zinc-950 [&>a]:underline [&>a]:decoration-zinc-400 [&>a]:underline-offset-4 hover:[&>a]:decoration-zinc-950"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {/* Tags Row */}
            {article.tags.length > 0 && (
              <div className="mt-10 border-t border-zinc-200 pt-6">
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

            {/* Mobile Share Controls */}
            <div className="mt-8 border-t border-zinc-200 pt-4 lg:hidden">
              <ShareButtons title={article.title} url={storyUrl} />
            </div>

            {/* Author Bio Box */}
            <div className="mt-10 rounded-xs border border-zinc-200 bg-zinc-50 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              {article.author.avatarUrl ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-zinc-200 shrink-0 border border-zinc-200">
                  <Image
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xl uppercase shrink-0">
                  {article.author.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-sm font-bold text-zinc-950">{article.author.name}</h4>
                  <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-700">
                    Author
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
                  {article.author.bio ||
                    `${article.author.name} is a contributing writer at WHAT'S NEXT PH covering cutting-edge developments, news, and deep analysis.`}
                </p>
              </div>
            </div>
          </div>

          {/* Right Rail: Contextual Editorial Sidebar (Desktop Sticky) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8">
            <div className="sticky top-28 space-y-8">
              {/* Category Mini Feed */}
              {filteredRelated.length > 0 && (
                <div className="rounded-xs border border-zinc-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      More in {article.category.name}
                    </span>
                    <Link
                      href={`/${article.category.slug}`}
                      className="text-[11px] font-bold text-zinc-900 hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {filteredRelated.slice(0, 3).map((rel) => (
                      <article key={rel.id} className="group flex gap-3 items-start">
                        <Link
                          href={`/story/${rel.slug}`}
                          className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xs bg-zinc-100"
                        >
                          <Image
                            src={rel.featuredImage.url}
                            alt={rel.featuredImage.alt || rel.title}
                            fill
                            unoptimized={isGifImage(rel.featuredImage.url)}
                            sizes="80px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/story/${rel.slug}`}
                            className="block text-xs font-bold text-zinc-900 leading-snug group-hover:text-zinc-600 line-clamp-2"
                          >
                            {rel.title}
                          </Link>
                          <time dateTime={rel.publishedAt} className="block mt-1 text-[10px] text-zinc-400 font-medium">
                            {new Date(rel.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Editorial Trust Badge */}
              <div className="rounded-xs border border-zinc-200 bg-zinc-50 p-5 text-xs text-zinc-600 space-y-2">
                <div className="flex items-center gap-2 text-zinc-950 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Editorial Standards</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-500">
                  WHAT&apos;S NEXT PH operates under strict fact-checking, independence, and correction standards.
                </p>
                <Link
                  href="/editorial-policy"
                  className="inline-block text-[11px] font-bold text-zinc-900 hover:underline pt-1"
                >
                  Read our Editorial Policy &rarr;
                </Link>
              </div>

              {/* Newsletter Micro Box */}
              <div className="rounded-xs border border-zinc-900 bg-zinc-950 p-5 text-white">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  Newsletter
                </span>
                <h4 className="font-sans text-sm font-bold leading-tight">
                  Stay Ahead of What&apos;s Next
                </h4>
                <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                  Get the top dispatches delivered straight to your inbox daily.
                </p>
                <Link
                  href="#newsletter-signup"
                  className="mt-3 block text-center rounded-xs bg-white py-2 px-3 text-xs font-bold text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  Subscribe Free
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Stories (Full Width Section) */}
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
        <div id="newsletter-signup">
          <NewsletterSection />
        </div>
      </article>
    </>
  );
}
