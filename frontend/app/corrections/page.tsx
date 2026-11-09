import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCw, AlertTriangle, FileX, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: "Corrections & Retractions Policy — WHAT'S NEXT PH",
  description: "How WHAT'S NEXT PH handles factual corrections, updates, and clarifications with transparency and speed.",
};

const PROTOCOLS = [
  {
    icon: RefreshCw,
    title: 'Minor Factual & Typographical Fixes',
    level: 'Routine Update',
    desc: 'Spelling errors, minor grammatical slips, or formatting adjustments that do not alter the factual meaning of a sentence are corrected promptly in the live dispatch.',
  },
  {
    icon: AlertTriangle,
    title: 'Substantive Factual Corrections',
    level: 'Public Editorial Note',
    desc: 'Any misstatement of fact, figure, name, company affiliation, or quote is corrected in the text and accompanied by a visible, timestamped editorial note at the top or bottom of the story detailing what was altered.',
  },
  {
    icon: FileX,
    title: 'Retractions & Fundamental Flaws',
    level: 'Full Retraction Notice',
    desc: 'If an article\'s core finding is discovered to be materially false or uncorroborated, WHAT\'S NEXT PH will publish an explicit retraction notice detailing the findings and circumstances behind the error.',
  },
];

export default function CorrectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Accountability & Transparency
        </span>
        <h1 className="mt-3 font-sans text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
          Corrections & Retractions
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed font-light">
          Our standard for prompt, honest, and public rectifications of errors across all platforms.
        </p>
      </header>

      {/* Core Commitment */}
      <div className="mt-12 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-6 sm:p-8 max-w-4xl">
        <h2 className="font-sans text-lg sm:text-xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
          Our Standard of Total Transparency
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          WHAT&apos;S NEXT PH strives for uncompromising precision. When errors occur, our ethical obligation is to acknowledge and correct them transparently and quickly—never quietly overwriting history or hiding mistakes.
        </p>
      </div>

      {/* Protocols Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROTOCOLS.map((protocol) => {
          const Icon = protocol.icon;
          return (
            <div
              key={protocol.title}
              className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {protocol.level}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-4 font-sans text-base font-bold text-zinc-950 dark:text-zinc-50">
                  {protocol.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {protocol.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reporting Channel Box */}
      <div className="mt-12 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 sm:p-9 shadow-xs max-w-4xl">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Reader Submissions
        </span>
        <h3 className="mt-1 font-sans text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
          How to Report a Correction
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          If you detect a factual error in any WHAT&apos;S NEXT PH article, please email our accountability desk at{' '}
          <strong className="text-zinc-950 dark:text-zinc-50 select-all font-mono text-xs">corrections@whatsnextph.local</strong> or submit through our contact desk.
        </p>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Please include the story URL, headline, the exact paragraph in question, and links or documentation supporting the correct information.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xs bg-zinc-950 dark:bg-zinc-100 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <span>Submit via Contact Form</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href="mailto:corrections@whatsnextph.local"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Direct Email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
