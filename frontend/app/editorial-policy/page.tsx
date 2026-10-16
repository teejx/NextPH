import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Editorial Policy & Standards — WHAT'S NEXT PH",
  description: 'Our journalistic principles, fact-checking methodology, attribution standards, and ethical independence.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-[#CCC7BD] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C43622]">Standards & Integrity</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312]">
          Editorial Policy
        </h1>
        <p className="mt-3 text-sm text-[#76716B]">Our commitment to accuracy, independence, and fairness.</p>
      </header>

      <main className="prose prose-neutral mt-8 max-w-none text-[#141312] leading-relaxed text-base sm:text-lg">
        <h2>1. Accuracy and Verification</h2>
        <p>
          WHAT&apos;S NEXT PH is committed to verified reporting. Every piece of information, data metric, or quote is corroborated with original primary sources, direct interview transcripts, public filings, or accredited scientific publications before release.
        </p>

        <h2>2. Editorial Independence</h2>
        <p>
          Our editorial desk operates with complete editorial autonomy. Commercial partnerships, sponsorship opportunities, or upcoming product reviews never influence our news judgment or investigative tone. Any sponsored editorial feature in the future will be clearly and unambiguously labeled.
        </p>

        <h2>3. Transparent Trending Curation</h2>
        <p>
          Unlike legacy aggregators that fabricate popularity metrics or amplify clickbait loops, WHAT&apos;S NEXT PH’s <em>Trending Stories</em> are curated by seasoned editors who assess real-world cultural impact, technology significance, and reader relevance across the Philippine archipelago.
        </p>

        <h2>4. Use of AI and Synthetic Tools</h2>
        <p>
          WHAT&apos;S NEXT PH does not publish unvetted, auto-generated synthetic news articles. While our engineering team utilizes AI tools for grammar checks, transcription assistance, and code formatting, all editorial bylines belong to human writers and editors who take full responsibility for every published word.
        </p>
      </main>
    </div>
  );
}
