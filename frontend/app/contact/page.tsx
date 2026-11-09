import React from 'react';
import type { Metadata } from 'next';
import { Mail, MapPin, Send, Clock, Shield } from 'lucide-react';
import { ContactForm } from '../../components/ContactForm';

export const metadata: Metadata = {
  title: "Contact the WHAT'S NEXT PH Editorial Desk",
  description: "Get in touch with the WHAT'S NEXT PH team for story tips, editorial pitches, press inquiries, and reader feedback.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Contact & Inquiries
        </span>
        <h1 className="mt-3 font-sans text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
          Get in Touch
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed font-light">
          We welcome confidential story leads, freelance pitches, reader corrections, and media inquiries from across the archipelago.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Editorial Channels (5-Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs">
            <h2 className="font-sans text-lg sm:text-xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Direct Desks
            </h2>
            <div className="mt-6 space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
                    Story Leads & News Tips
                  </strong>
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 select-all">
                    editor@whatsnextph.local
                  </span>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    For time-sensitive reports, breaking developments, or encrypted documents.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
                    Freelance Pitch Desk
                  </strong>
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 select-all">
                    pitches@whatsnextph.local
                  </span>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    Include a 2-paragraph premise, intended primary sources, and 2 sample writing links.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
                    Editorial Bureau
                  </strong>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Manila, National Capital Region, Philippines
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Response Promise Card */}
          <div className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6 space-y-4">
            <div className="flex items-center gap-3 text-zinc-950 dark:text-zinc-50 font-bold text-xs uppercase tracking-wider">
              <Clock className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
              <span>Response Turnaround</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Our editorial staff aims to acknowledge story pitches and leads within 48 business hours. Verified factual corrections are prioritized immediately.
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
              <Shield className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
              <span>Source confidentiality respected under Philippine journalist privilege.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form (7-Cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 sm:p-9 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Digital Dispatch
            </span>
            <h3 className="mt-1 font-sans text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
              Send a Message to the Desk
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Fill out the form below and your message will be routed directly to the appropriate section editor.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
