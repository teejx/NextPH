import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — NextPH',
  description: 'How NextPH collects, protects, and respects your personal data in accordance with the Data Privacy Act of 2012 (RA 10173).',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-[#CCC7BD] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C43622]">Legal & Compliance</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312]">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[#76716B]">Last updated: October 16, 2026</p>
      </header>

      <main className="prose prose-neutral mt-8 max-w-none text-[#141312] leading-relaxed text-base sm:text-lg">
        <p>
          NextPH is committed to protecting your privacy and complying with the <strong>Philippine Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, its Implementing Rules and Regulations, and global standards of data dignity.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We deliberately minimize data collection. We collect only:
        </p>
        <ul>
          <li>
            <strong>Newsletter Subscription Data:</strong> Your email address and subscription timestamp when you voluntarily opt-in to receive <em>The Next Dispatch</em>.
          </li>
          <li>
            <strong>Editorial Inquiries:</strong> Contact information voluntarily provided when submitting story pitches or corrections.
          </li>
          <li>
            <strong>Edge Telemetry:</strong> Aggregated, anonymized server-level metrics (such as page request volume and HTTP status codes) to ensure uptime and detect security abuse.
          </li>
        </ul>

        <h2>2. What We Do NOT Collect</h2>
        <ul>
          <li>We do not sell, rent, or trade your personal information to third-party data brokers.</li>
          <li>We do not employ cross-site tracking scripts, behavioral surveillance beacons, or covert advertising pixels.</li>
          <li>Our advertising placement slots remain strictly disabled and load zero commercial tracking scripts.</li>
        </ul>

        <h2>3. Newsletter Processing and Double Opt-in</h2>
        <p>
          When subscribing to our newsletter, we use verified email delivery adapters that support double opt-in confirmation. You may withdraw consent or unsubscribe at any time via the one-click unsubscribe link included in the footer of every dispatch.
        </p>

        <h2>4. Data Subject Rights</h2>
        <p>
          Under the Data Privacy Act of 2012, you hold the right to be informed, right to access, right to object, right to erasure or blocking, and right to damages. To exercise any of these rights, contact our Data Protection Officer at <code>dpo@nextph.example</code>.
        </p>
      </main>
    </div>
  );
}
