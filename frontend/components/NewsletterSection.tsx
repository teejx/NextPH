'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setFeedbackMessage('Please enter your email address.');
      return;
    }
    if (!consent) {
      setStatus('error');
      setFeedbackMessage('Please check the box to agree to our privacy policy and receive editorial dispatches.');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent,
          honeypot,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFeedbackMessage(data.message || 'Thank you for subscribing to The Next Dispatch.');
        setEmail('');
        setConsent(false);
      } else {
        setStatus('error');
        setFeedbackMessage(data.error || 'Subscription failed. Please check your information.');
      }
    } catch {
      setStatus('error');
      setFeedbackMessage('A network error occurred. Please try again.');
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="my-16 border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 py-12 px-6 sm:px-12 rounded-xs"
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
          <Mail className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
          The Next Dispatch
        </div>
        <h2 id="newsletter-heading" className="mt-4 text-2xl sm:text-3xl font-sans font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          Curated Filipino stories, delivered with editorial rigor.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Join thousands of discerning readers who receive our weekly briefing covering technology breakthroughs, archipelago journeys, and contemporary culture.
        </p>

        {status === 'success' ? (
          <div className="mt-8 flex items-center justify-center gap-3 rounded-xs bg-white dark:bg-zinc-800 p-6 border border-zinc-200 dark:border-zinc-700 text-left shadow-xs">
            <CheckCircle2 className="h-6 w-6 text-zinc-950 dark:text-zinc-50 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Subscription Confirmed</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{feedbackMessage}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 text-left max-w-xl mx-auto" noValidate>
            {/* Honeypot field for bot protection (hidden from assistive tech and humans) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website-hp">Leave this empty</label>
              <input
                type="text"
                id="website-hp"
                name="website-hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative grow">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="newsletter-email"
                  required
                  placeholder="Enter your email (e.g. editor@whatsnextph.ph)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors focus:border-zinc-950 dark:focus:border-zinc-100 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center rounded-xs bg-zinc-950 dark:bg-zinc-100 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white dark:text-zinc-950 transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 shrink-0 focus-visible:outline-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-zinc-100 cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>

            <div className="mt-3 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="newsletter-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded-xs border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 focus:ring-zinc-950 dark:focus:ring-zinc-100"
              />
              <label htmlFor="newsletter-consent" className="text-xs text-zinc-500 dark:text-zinc-400">
                I consent to receive weekly editorial newsletters from WHAT&apos;S NEXT PH. Unsubscribe at any time. Read our{' '}
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="underline font-semibold text-zinc-900 dark:text-zinc-200 hover:text-black dark:hover:text-white cursor-pointer inline transition-colors"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            {status === 'error' && (
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{feedbackMessage}</span>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Privacy Policy Modal with Scroll-to-Accept Enforcement */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onAccept={() => {
          setConsent(true);
          if (status === 'error' && feedbackMessage.includes('privacy')) {
            setStatus('idle');
            setFeedbackMessage('');
          }
        }}
      />
    </section>
  );
};
