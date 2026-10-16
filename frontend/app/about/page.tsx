import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Laptop, Plane, Shirt, Radio, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: "About WHAT'S NEXT PH — Filipino Digital Magazine",
  description:
    "Learn about WHAT'S NEXT PH, our editorial mission, coverage pillars, and dedication to modern Filipino digital journalism.",
};

const PILLARS = [
  {
    icon: Laptop,
    name: 'Technology & Innovation',
    slug: '/tech',
    desc: 'Decentralized finance, telecom expansion, regional startup ecosystems, space science, and national digital policy.',
  },
  {
    icon: Plane,
    name: 'Archipelago Travel',
    slug: '/travel',
    desc: 'Sustainable expeditions, indigenous heritage, marine conservation, and community-rooted ecotourism across 7,000+ islands.',
  },
  {
    icon: Shirt,
    name: 'Culture & Lifestyle',
    slug: '/lifestyle',
    desc: 'Culinary reinventions, contemporary architecture, artisanal craft, independent literature, and urban style movements.',
  },
  {
    icon: Radio,
    name: 'News & Dispatches',
    slug: '/news',
    desc: 'Critical national reporting, energy transitions, regional affairs, and verifiable cultural milestones.',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Modern Header */}
      <header className="border-b border-zinc-200 pb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
          About WHAT&apos;S NEXT PH
        </span>
        <h1 className="mt-3 font-sans text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-tight">
          Modern Stories from the Philippine Archipelago
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 max-w-3xl leading-relaxed font-light">
          An independent digital publication examining the intersections of technology breakthroughs, archipelago journeys, contemporary culture, and the forces shaping our islands.
        </p>
      </header>

      {/* Main Content Grid */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Core Narrative (7-Cols) */}
        <div className="lg:col-span-7 space-y-8 text-zinc-700 leading-relaxed text-base sm:text-lg font-normal">
          <div className="rounded-xs border border-zinc-200 bg-zinc-50/80 p-6 sm:p-8">
            <h2 className="font-sans text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
              Our Mission
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
              We believe Filipino stories deserve world-class digital presentation, rigorous reporting, and uncompromising design craft. From decentralized fintech networks transforming island trade to heritage preservation in Batanes, WHAT&apos;S NEXT PH documents the visionaries, creators, and communities building what comes next.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
              Editorial Rigor & Independence
            </h3>
            <p className="mt-2 text-sm sm:text-base text-zinc-600 leading-relaxed">
              Our journalism operates with total editorial independence. We do not run paid editorial masquerades, sensationalist clickbait, or unverified automated articles. Every dispatch is researched, written, and verified by human contributors committed to truth and cultural nuance.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
              Built for Speed & Reader Respect
            </h3>
            <p className="mt-2 text-sm sm:text-base text-zinc-600 leading-relaxed">
              We reject intrusive advertising popups and surveillance trackers. Our platform is powered by modern edge architecture for near-instantaneous page loads across mobile networks, paired with a secure headless CMS that gives our editorial team maximum velocity.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xs bg-zinc-950 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-black"
            >
              <span>Pitch a Story</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/editorial-policy"
              className="inline-flex items-center gap-2 rounded-xs border border-zinc-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-900 transition-colors hover:border-zinc-950"
            >
              <span>Editorial Policy</span>
            </Link>
          </div>
        </div>

        {/* Pillars & Architecture Sidebar (5-Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xs border border-zinc-200 bg-white p-6 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-4">
              Coverage Pillars
            </span>
            <div className="divide-y divide-zinc-100">
              {PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.name} className="py-4 first:pt-0 last:pb-0 group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-zinc-100 text-zinc-900 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <Link
                        href={pillar.slug}
                        className="font-sans text-sm font-bold text-zinc-950 hover:text-zinc-600 transition-colors"
                      >
                        {pillar.name}
                      </Link>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500 leading-relaxed pl-11">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Architecture Trust Badges */}
          <div className="rounded-xs border border-zinc-200 bg-zinc-50 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-zinc-950 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-zinc-950 uppercase tracking-wider">
                  Ethical Journalism
                </strong>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Full adherence to the Philippine Data Privacy Act of 2012 and strict editorial verification standards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-zinc-950 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-zinc-950 uppercase tracking-wider">
                  Edge Delivery
                </strong>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Static compilation and edge caching for sub-100ms response times anywhere in the archipelago.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
