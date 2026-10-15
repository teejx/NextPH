import React from 'react';
import type { Metadata } from 'next';
import { Mail, MapPin, Send } from 'lucide-react';
import { ContactForm } from '../../components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact the NextPH Editorial Desk',
  description: 'Get in touch with the NextPH team for story tips, editorial pitches, press inquiries, and reader feedback.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-[#CCC7BD] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C43622]">Contact & Inquiries</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312]">
          Get in Touch
        </h1>
        <p className="mt-3 text-base text-[#4A4642]">
          We welcome thoughtful story pitches, confidential news tips, corrections, and general feedback.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#141312]">Editorial Contacts</h2>
          
          <div className="mt-6 space-y-6 text-sm text-[#4A4642]">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-[#C43622] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#141312]">Story Tips & Press Releases</strong>
                <span className="text-[#76716B]">editor@nextph.example</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Send className="h-5 w-5 text-[#C43622] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#141312]">Pitching Guidelines</strong>
                <span className="text-[#76716B]">pitches@nextph.example</span>
                <p className="text-xs text-[#76716B] mt-1">
                  Please include a 2-paragraph summary, proposed sources, and sample writing clips.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#C43622] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#141312]">Office Location</strong>
                <span className="text-[#76716B]">Manila, National Capital Region, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client-side Contact Form */}
        <div className="rounded-sm border border-[#CCC7BD] bg-[#F3EFEA] p-6 sm:p-8">
          <h3 className="font-serif text-lg font-bold text-[#141312]">Send a Message</h3>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
