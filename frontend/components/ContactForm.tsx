'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-sm border border-green-200 bg-white p-6 text-center shadow-xs">
        <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
        <h4 className="mt-3 font-serif text-lg font-bold text-[#141312]">Message Received</h4>
        <p className="mt-1 text-xs text-[#4A4642]">
          Thank you for reaching out to the WHAT&apos;S NEXT PH editorial desk. We review every pitch and inquiry promptly.
        </p>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4 text-sm" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="contact-name" className="block text-xs font-semibold text-[#141312]">
          Your Name
        </label>
        <input
          type="text"
          id="contact-name"
          required
          placeholder="Juan dela Cruz"
          className="mt-1.5 w-full rounded-sm border border-[#CCC7BD] bg-white px-3.5 py-2.5 text-[#141312] focus:border-[#C43622] focus:outline-hidden"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-xs font-semibold text-[#141312]">
          Email Address
        </label>
        <input
          type="email"
          id="contact-email"
          required
          placeholder="juan@example.com"
          className="mt-1.5 w-full rounded-sm border border-[#CCC7BD] bg-white px-3.5 py-2.5 text-[#141312] focus:border-[#C43622] focus:outline-hidden"
        />
      </div>
      <div>
        <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#141312]">
          Subject
        </label>
        <select
          id="contact-subject"
          className="mt-1.5 w-full rounded-sm border border-[#CCC7BD] bg-white px-3.5 py-2.5 text-[#141312] focus:border-[#C43622] focus:outline-hidden"
        >
          <option>Story Tip / News Lead</option>
          <option>Freelance Editorial Pitch</option>
          <option>Correction Request</option>
          <option>General Feedback</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-[#141312]">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          placeholder="Describe your pitch or news tip in detail..."
          className="mt-1.5 w-full rounded-sm border border-[#CCC7BD] bg-white px-3.5 py-2.5 text-[#141312] focus:border-[#C43622] focus:outline-hidden"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-sm bg-[#141312] py-3 text-xs font-semibold text-white transition-colors hover:bg-[#C43622] focus-visible:outline-2 focus-visible:outline-[#C43622]"
      >
        Submit Dispatch
      </button>
    </form>
  );
};
