'use client';

import React, { useState } from 'react';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="rounded-xs border border-zinc-200 bg-zinc-50 p-8 text-center shadow-xs animate-in fade-in-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="mt-4 font-sans text-lg font-black tracking-tight text-zinc-950">
          Dispatch Received
        </h4>
        <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm mx-auto">
          Thank you for reaching out to the WHAT&apos;S NEXT PH editorial desk. Our editors review every tip, pitch, and inquiry with care.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex text-xs font-bold uppercase tracking-wider text-zinc-900 underline underline-offset-4 hover:text-black cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4 text-sm" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="contact-name" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">
          Your Name
        </label>
        <input
          type="text"
          id="contact-name"
          required
          placeholder="e.g. Maria Santos"
          className="mt-1.5 w-full rounded-xs border border-zinc-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 transition-colors focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">
          Email Address
        </label>
        <input
          type="email"
          id="contact-email"
          required
          placeholder="maria@example.com"
          className="mt-1.5 w-full rounded-xs border border-zinc-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 transition-colors focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">
          Department / Subject
        </label>
        <select
          id="contact-subject"
          className="mt-1.5 w-full rounded-xs border border-zinc-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 transition-colors focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
        >
          <option>Story Tip / Confidential Lead</option>
          <option>Freelance Editorial Pitch</option>
          <option>Factual Correction Request</option>
          <option>Press & Media Inquiries</option>
          <option>General Reader Feedback</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">
          Message & Details
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          placeholder="Provide a summary of your pitch, lead, or inquiry..."
          className="mt-1.5 w-full rounded-xs border border-zinc-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 transition-colors focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xs bg-zinc-950 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-zinc-950 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Submit Dispatch</span>
            <Send className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </form>
  );
};
