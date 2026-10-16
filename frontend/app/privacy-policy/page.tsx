import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Database, Mail, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: "Privacy Policy — WHAT'S NEXT PH",
  description: "How WHAT'S NEXT PH collects, protects, and respects your personal data in accordance with the Data Privacy Act of 2012 (RA 10173).",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Data Dignity & Legal Compliance
          </span>
          <span className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1 text-[11px] font-mono font-medium text-zinc-600 dark:text-zinc-300">
            Effective: October 16, 2026
          </span>
        </div>
        <h1 className="mt-3 font-sans text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed font-light">
          Full compliance with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173), its Implementing Rules and Regulations, and global standards of digital dignity.
        </p>
      </header>

      {/* Main Sections */}
      <div className="mt-12 space-y-10 max-w-5xl">
        {/* Core Philosophy Banner */}
        <div className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-zinc-950 dark:text-zinc-50 shrink-0" />
            <h2 className="font-sans text-lg sm:text-xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
              Our Privacy Principle: Minimum Collection, Maximum Respect
            </h2>
          </div>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            We believe an editorial magazine exists to inform and inspire, not to track, profile, or monetize personal behavioral identities. We intentionally architect our platform to collect the absolute minimum data required to deliver high-quality journalism.
          </p>
        </div>

        {/* Section 1: What We Collect */}
        <div className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 sm:p-9 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <Database className="h-4 w-4" />
            </div>
            <h3 className="font-sans text-xl font-bold text-zinc-950 dark:text-zinc-50">
              1. Information We Collect
            </h3>
          </div>
          <div className="mt-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>We deliberately restrict data collection to the following voluntary interactions:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-zinc-950 dark:text-zinc-100">Newsletter Subscriptions:</strong> Your email address and double opt-in timestamp when voluntarily subscribing to <em>The Next Dispatch</em>.
              </li>
              <li>
                <strong className="text-zinc-950 dark:text-zinc-100">Editorial Inquiries:</strong> Contact information voluntarily submitted when sending story tips, pitches, or correction requests.
              </li>
              <li>
                <strong className="text-zinc-950 dark:text-zinc-100">Edge Telemetry:</strong> Anonymized, aggregated server telemetry (HTTP response codes, request volumes, origin country) used strictly for edge uptime, DDOS mitigation, and caching performance.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: What We Never Do */}
        <div className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 sm:p-9 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h3 className="font-sans text-xl font-bold text-zinc-950 dark:text-zinc-50">
              2. What We Never Do
            </h3>
          </div>
          <div className="mt-6 space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>To preserve reader dignity, WHAT&apos;S NEXT PH enforces the following strict prohibitions:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>We never sell, trade, rent, or distribute personal information to data brokers or advertising exchanges.</li>
              <li>We do not embed third-party surveillance beacons, cross-site trackers, or social tracking pixels.</li>
              <li>Commercial ad tracking scripts are permanently disabled across our codebase.</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Newsletter Processing */}
        <div className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 sm:p-9 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <Mail className="h-4 w-4" />
            </div>
            <h3 className="font-sans text-xl font-bold text-zinc-950 dark:text-zinc-50">
              3. Newsletter Consent & Double Opt-in
            </h3>
          </div>
          <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-3">
            <p>
              When you subscribe to our newsletter, your email address is handled via secure API integration. We enforce explicit consent with instant, one-click unsubscribe links present in every dispatch.
            </p>
            <p>
              You may withdraw your consent at any time, immediately purging your email from our active distribution lists.
            </p>
          </div>
        </div>

        {/* Section 4: Your Rights Under RA 10173 */}
        <div className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 sm:p-9 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <UserCheck className="h-4 w-4" />
            </div>
            <h3 className="font-sans text-xl font-bold text-zinc-950 dark:text-zinc-50">
              4. Data Subject Rights (Republic Act No. 10173)
            </h3>
          </div>
          <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-3">
            <p>
              As a data subject under Philippine law, you enjoy full statutory protections including:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xs border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 p-4">
                <strong className="block text-zinc-950 dark:text-zinc-50 font-bold text-xs uppercase tracking-wider">Right to Be Informed</strong>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 block">Full transparency on how your data is handled.</span>
              </div>
              <div className="rounded-xs border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 p-4">
                <strong className="block text-zinc-950 dark:text-zinc-50 font-bold text-xs uppercase tracking-wider">Right to Access</strong>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 block">Request copies of personal records in our possession.</span>
              </div>
              <div className="rounded-xs border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 p-4">
                <strong className="block text-zinc-950 dark:text-zinc-50 font-bold text-xs uppercase tracking-wider">Right to Object & Erasure</strong>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 block">Demand complete deletion of your records anytime.</span>
              </div>
              <div className="rounded-xs border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 p-4">
                <strong className="block text-zinc-950 dark:text-zinc-50 font-bold text-xs uppercase tracking-wider">Right to Redress</strong>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 block">Lodge inquiries with the National Privacy Commission.</span>
              </div>
            </div>
          </div>
        </div>

        {/* DPO Contact Box */}
        <div className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white p-7 sm:p-9 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Lock className="h-4 w-4 text-white" />
              <span>Data Protection Officer (DPO)</span>
            </div>
            <h4 className="mt-2 font-sans text-xl font-black text-white">
              Exercise Your Privacy Rights
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
              To request data removal, access records, or query our compliance protocols, contact our designated Data Protection Officer.
            </p>
          </div>
          <div className="shrink-0 flex flex-col gap-2">
            <a
              href="mailto:dpo@whatsnextph.local"
              className="inline-flex items-center gap-2 rounded-xs bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              <span>Contact DPO</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <span className="text-[11px] font-mono text-zinc-400 text-center select-all">
              dpo@whatsnextph.local
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
