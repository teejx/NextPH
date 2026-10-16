import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Corrections & Retractions Policy — WHAT'S NEXT PH",
  description: "How WHAT'S NEXT PH handles factual corrections, updates, and clarifications with transparency and speed.",
};

export default function CorrectionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-[#CCC7BD] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C43622]">Accountability</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312]">
          Corrections & Retractions
        </h1>
        <p className="mt-3 text-sm text-[#76716B]">Our standard for prompt, honest corrections.</p>
      </header>

      <main className="prose prose-neutral mt-8 max-w-none text-[#141312] leading-relaxed text-base sm:text-lg">
        <p>
          WHAT&apos;S NEXT PH strives for total factual precision. When an error of fact or attribution occurs, our policy is to correct it transparently, explicitly, and as quickly as possible.
        </p>

        <h2>How Corrections Are Handled</h2>
        <ul>
          <li>
            <strong>Minor Typos & Grammar:</strong> Spelling, grammar, or minor styling fixes that do not change the factual meaning of a sentence are corrected directly.
          </li>
          <li>
            <strong>Substantive Corrections:</strong> Any correction of fact, name spelling, figure, data point, or quote is clearly identified with an editorial note appended to the top or bottom of the story, noting what was changed and the timestamp of the update.
          </li>
          <li>
            <strong>Retractions:</strong> If a story’s central premise is determined to be false or fundamentally flawed, WHAT&apos;S NEXT PH will issue an explicit retraction explaining the background of the error.
          </li>
        </ul>

        <h2>Reporting an Error</h2>
        <p>
          If you identify an error in any WHAT&apos;S NEXT PH story, please contact our editorial desk immediately at{' '}
          <a href="mailto:corrections@whatsnextph.example">corrections@whatsnextph.example</a> or via our{' '}
          <Link href="/contact" className="underline">
            Contact Form
          </Link>
          . Please cite the article URL, headline, paragraph in question, and your supporting documentation.
        </p>
      </main>
    </div>
  );
}
