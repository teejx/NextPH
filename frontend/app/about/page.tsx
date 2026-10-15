import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About NextPH — Filipino Digital Magazine',
  description:
    'Learn about NextPH, our editorial mission, coverage pillars, and dedication to modern Filipino digital journalism.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-[#CCC7BD] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C43622]">About NextPH</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312]">
          Modern Stories from the Philippine Archipelago
        </h1>
      </header>

      <main className="prose prose-neutral mt-8 max-w-none text-[#141312] leading-relaxed text-base sm:text-lg">
        <p className="lead font-serif text-xl sm:text-2xl text-[#4A4642]">
          NextPH is an independent digital magazine dedicated to examining the intersections of technology, archipelago travel, lifestyle, and contemporary culture across the Philippines and its global diaspora.
        </p>

        <h2>Our Mission</h2>
        <p>
          We believe Filipino stories deserve world-class digital presentation, rigorous reporting, and thoughtful design. From decentralized fintech networks transforming island trade to heritage preservation in Batanes, NextPH documents the forces shaping the country’s next decade.
        </p>

        <h2>Editorial Pillars</h2>
        <ul>
          <li>
            <strong>Technology & Innovation:</strong> Open finance, telecom expansion, regional startup hubs, space science, and digital policy.
          </li>
          <li>
            <strong>Archipelago Travel:</strong> Sustainable travel, indigenous heritage, marine conservation, and community-based ecotourism across 7,000+ islands.
          </li>
          <li>
            <strong>Contemporary Lifestyle:</strong> Culinary evolutions, artisanal craftsmanship, modern architecture, literature, and urban culture.
          </li>
          <li>
            <strong>Curated Trending:</strong> Editorially verified and significant developments shaping public discourse.
          </li>
        </ul>

        <h2>Built for Speed and Respect</h2>
        <p>
          We reject cluttered advertising takeovers, autoplay video distractions, and sensationalist clickbait. Our public website runs on edge infrastructure for instantaneous reading on any device, while our editorial desk operates on a secure headless CMS architecture.
        </p>
      </main>
    </div>
  );
}
