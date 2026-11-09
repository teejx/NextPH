'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Article } from '../lib/wordpress/types';
import { isGifImage, isVideoMedia } from '../lib/media';

interface LatestGridSectionProps {
  latestStories: Article[];
  spotlightStory: Article;
}

export const LatestGridSection: React.FC<LatestGridSectionProps> = ({
  latestStories,
  spotlightStory,
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed.');
      }
    } catch {
      setStatus('error');
      setMessage('A network error occurred.');
    }
  };

  return (
    <section className="py-10 border-t border-zinc-200 dark:border-zinc-800" aria-labelledby="latest-section-heading">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column 1: LATEST List (4-Cols) */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <h2 id="latest-section-heading" className="font-sans text-base font-black tracking-widest uppercase text-zinc-950 dark:text-zinc-50">
              Latest
            </h2>
            <Link
              href="/trending"
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {latestStories.slice(0, 4).map((story) => {
              const formattedDate = new Date(story.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              return (
                <article key={story.id} className="group flex gap-4 py-3.5 items-center">
                  <Link
                    href={`/story/${story.slug}`}
                    className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xs bg-zinc-100 dark:bg-zinc-800"
                  >
                    <Image
                      src={story.featuredImage.url}
                      alt={story.featuredImage.alt || story.title}
                      fill
                      unoptimized={isGifImage(story.featuredImage.url)}
                      sizes="72px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="grow">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      {story.category.name}
                    </span>
                    <h3 className="mt-0.5 font-sans text-xs sm:text-sm font-bold leading-snug text-zinc-950 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-2">
                      <Link href={`/story/${story.slug}`}>
                        {story.title}
                      </Link>
                    </h3>
                    <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {formattedDate}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Column 2: Editor Spotlight Feature (4-Cols) */}
        <div className="lg:col-span-4 border-t lg:border-t-0 border-zinc-200 dark:border-zinc-800 pt-6 lg:pt-0">
          <article className="group flex flex-col">
            <Link
              href={`/story/${spotlightStory.slug}`}
              className="relative aspect-16/10 w-full overflow-hidden rounded-xs bg-zinc-100 dark:bg-zinc-800"
            >
              <Image
                src={spotlightStory.featuredImage.url}
                alt={spotlightStory.featuredImage.alt || spotlightStory.title}
                fill
                unoptimized={isGifImage(spotlightStory.featuredImage.url)}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
              {Boolean(spotlightStory.videoEmbedUrl || isVideoMedia(spotlightStory.featuredImage.url)) && (
                <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-zinc-950/85 backdrop-blur-xs px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                  VIDEO
                </span>
              )}
              {!Boolean(spotlightStory.videoEmbedUrl || isVideoMedia(spotlightStory.featuredImage.url)) && isGifImage(spotlightStory.featuredImage.url) && (
                <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-zinc-950/85 backdrop-blur-xs px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                  GIF
                </span>
              )}
            </Link>

            <div className="mt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {spotlightStory.category.name}
              </span>
              <h3 className="mt-1 font-sans text-xl sm:text-2xl font-black leading-snug text-zinc-950 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                <Link href={`/story/${spotlightStory.slug}`}>
                  {spotlightStory.title}
                </Link>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                {spotlightStory.excerpt}
              </p>
              <Link
                href={`/story/${spotlightStory.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                <span>Read More</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </article>
        </div>

        {/* Column 3: Newsletter & Social Follow (4-Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 border-t lg:border-t-0 border-zinc-200 dark:border-zinc-800 pt-6 lg:pt-0">
          {/* Newsletter Box (Dark Landscape Background) */}
          <div className="relative overflow-hidden rounded-xs bg-zinc-900 text-white p-7 sm:p-8 min-h-[310px] flex flex-col justify-between">
            {/* Atmospheric Background Image */}
            <Image
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
              alt="Mountain landscape mist"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                Stay in the Loop
              </span>
              <h3 className="mt-2 font-sans text-2xl font-black text-white leading-tight">
                Get the latest from NEXT PH
              </h3>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                Tech, lifestyle, travel and trending — straight to your inbox.
              </p>
            </div>

            <div className="relative z-10 mt-6">
              {status === 'success' ? (
                <div className="flex items-center gap-2 rounded-xs bg-white/10 p-3 text-xs text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{message}</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <label htmlFor="loop-email" className="sr-only">
                    Your email address
                  </label>
                  <input
                    type="email"
                    id="loop-email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xs border-0 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-white dark:focus:ring-zinc-700"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-xs bg-zinc-950 dark:bg-zinc-100 py-2.5 text-xs font-black uppercase tracking-widest text-white dark:text-zinc-950 transition-colors hover:bg-black dark:hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <span className="inline-flex items-center gap-1.5 justify-center">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Subscribing...
                      </span>
                    ) : (
                      'Subscribe'
                    )}
                  </button>

                  {status === 'error' && (
                    <div className="flex items-center gap-1 text-[11px] text-red-300 mt-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{message}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Follow Us & Hashtag */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Follow Us
            </span>
            <div className="mt-3 flex items-center gap-4 text-zinc-900 dark:text-zinc-100">
              <a href="https://www.facebook.com/profile.php?id=61588088431567" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors" aria-label="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors" aria-label="Instagram">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors" aria-label="X (formerly Twitter)">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors" aria-label="YouTube">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors" aria-label="TikTok">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
            <span className="mt-3 block text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">
              #WhatsNEXTPH
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
