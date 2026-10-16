import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Shield, Eye, Cpu, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: "Editorial Policy & Standards — WHAT'S NEXT PH",
  description: 'Our journalistic principles, fact-checking methodology, attribution standards, and ethical independence.',
};

const PRINCIPLES = [
  {
    num: '01',
    icon: CheckCircle2,
    title: 'Accuracy & Primary Verification',
    body: 'Every factual assertion, data point, or quote is verified with primary sources, interview transcripts, official public records, or accredited research publications before publication. When reporting on emerging technology, data claims are independently vetted by subject specialists.',
  },
  {
    num: '02',
    icon: Shield,
    title: 'Uncompromised Independence',
    body: 'Our newsroom operates with total editorial autonomy. Commercial relationships, technology brand access, or advertising arrangements never dictate coverage decisions or tonal rigor. Any sponsored editorial collaboration is unambiguously flagged.',
  },
  {
    num: '03',
    icon: Eye,
    title: 'Transparent Editorial Curation',
    body: 'Unlike legacy aggregators that fabricate trending algorithms to amplify engagement bait, WHAT\'S NEXT PH curation is guided by seasoned editors who evaluate societal consequence, technological depth, and cultural longevity across the archipelago.',
  },
  {
    num: '04',
    icon: Cpu,
    title: 'Human Bylines & Synthetic Media Standards',
    body: 'WHAT\'S NEXT PH does not publish automated, unvetted synthetic news articles. While our engineers utilize AI assistants for transcript cleanup, syntax proofreading, and code formatting, every byline belongs to human writers who take personal responsibility for every sentence.',
  },
];

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="border-b border-zinc-200 pb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
          Standards & Integrity
        </span>
        <h1 className="mt-3 font-sans text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-tight">
          Editorial Policy & Standards
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 max-w-3xl leading-relaxed font-light">
          Our foundational commitment to verified truth, source protection, journalistic independence, and respectful presentation.
        </p>
      </header>

      {/* Principles Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {PRINCIPLES.map((principle) => {
          const Icon = principle.icon;
          return (
            <div
              key={principle.title}
              className="group rounded-xs border border-zinc-200 bg-white p-7 sm:p-9 shadow-xs hover:border-zinc-950 transition-colors"
            >
              <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
                <span className="font-mono text-xs font-bold text-zinc-400 tracking-wider">
                  {principle.num}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xs bg-zinc-100 text-zinc-900 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <h2 className="mt-5 font-sans text-xl font-bold tracking-tight text-zinc-950">
                {principle.title}
              </h2>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                {principle.body}
              </p>
            </div>
          );
        })}
      </div>

      {/* Cross-Link Bar */}
      <div className="mt-12 rounded-xs border border-zinc-200 bg-zinc-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-sans text-base font-bold text-zinc-950">
            Have a question about our reporting or spotted a factual inaccuracy?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Read our transparent corrections protocol or contact our accountability desk.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/corrections"
            className="inline-flex items-center gap-2 rounded-xs bg-zinc-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition-colors"
          >
            <span>Corrections Policy</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xs border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:border-zinc-950 transition-colors"
          >
            <span>Contact Desk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
