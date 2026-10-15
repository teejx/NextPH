'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

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
      className="my-16 border-y border-[#CCC7BD] bg-[#F3EFEA] py-12 px-6 sm:px-12 rounded-sm"
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FDF1EE] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#C43622]">
          <Mail className="h-3.5 w-3.5" />
          The Next Dispatch
        </div>
        <h2 id="newsletter-heading" className="mt-4 text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#141312]">
          Curated Filipino stories, delivered with editorial rigor.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#4A4642]">
          Join thousands of discerning readers who receive our weekly briefing covering technology breakthroughs, archipelago journeys, and contemporary culture.
        </p>

        {status === 'success' ? (
          <div className="mt-8 flex items-center justify-center gap-3 rounded-md bg-white p-6 border border-green-200 text-left shadow-xs">
            <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-[#141312]">Subscription Confirmed</h3>
              <p className="text-xs text-[#4A4642] mt-0.5">{feedbackMessage}</p>
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
                  placeholder="Enter your email (e.g. editor@nextph.ph)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-sm border border-[#CCC7BD] bg-white px-4 py-3 text-sm text-[#141312] placeholder-[#76716B] transition-colors focus:border-[#C43622] focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center rounded-sm bg-[#141312] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C43622] disabled:opacity-50 shrink-0 focus-visible:outline-2 focus-visible:outline-[#C43622]"
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
                className="mt-1 h-4 w-4 rounded-xs border-[#CCC7BD] text-[#C43622] focus:ring-[#C43622]"
              />
              <label htmlFor="newsletter-consent" className="text-xs text-[#76716B]">
                I consent to receive weekly editorial newsletters from NextPH. Unsubscribe at any time. Read our{' '}
                <Link href="/privacy-policy" className="underline hover:text-[#141312]">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {status === 'error' && (
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#C43622]" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{feedbackMessage}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
};
