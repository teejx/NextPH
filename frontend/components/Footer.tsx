import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800 bg-[#0B0B0C] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-sans text-xl sm:text-2xl font-black tracking-tight text-white">
                WHAT&apos;S NEXT <span className="text-zinc-500 font-light">PH</span>
              </span>
            </Link>
            <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              WHAT&apos;S NEXT PH is an independent Filipino digital magazine covering technology breakthroughs, archipelago travel, contemporary lifestyle, and curated trending stories.
            </p>
            <div className="mt-6 text-[11px] uppercase tracking-wider text-zinc-500">
              Published from Manila, Philippines
            </div>
          </div>

          {/* Editorial Sections */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 border-b border-zinc-800 pb-2">
              Sections
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/news" className="text-zinc-400 hover:text-white transition-colors">
                  News & Dispatches
                </Link>
              </li>
              <li>
                <Link href="/tech" className="text-zinc-400 hover:text-white transition-colors">
                  Tech & Telecom
                </Link>
              </li>
              <li>
                <Link href="/travel" className="text-zinc-400 hover:text-white transition-colors">
                  Archipelago Travel
                </Link>
              </li>
              <li>
                <Link href="/lifestyle" className="text-zinc-400 hover:text-white transition-colors">
                  Culture & Lifestyle
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-zinc-400 hover:text-white transition-colors">
                  Trending Stories
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-zinc-400 hover:text-white transition-colors">
                  Search Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Topics / Tags */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 border-b border-zinc-800 pb-2">
              Topics
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/tag/fintech" className="text-zinc-400 hover:text-white transition-colors">
                  #Fintech
                </Link>
              </li>
              <li>
                <Link href="/tag/batanes" className="text-zinc-400 hover:text-white transition-colors">
                  #Batanes
                </Link>
              </li>
              <li>
                <Link href="/tag/ecotourism" className="text-zinc-400 hover:text-white transition-colors">
                  #Ecotourism
                </Link>
              </li>
              <li>
                <Link href="/tag/culinary" className="text-zinc-400 hover:text-white transition-colors">
                  #Culinary
                </Link>
              </li>
              <li>
                <Link href="/tag/space-science" className="text-zinc-400 hover:text-white transition-colors">
                  #SpaceScience
                </Link>
              </li>
            </ul>
          </div>

          {/* Informational & Standards */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 border-b border-zinc-800 pb-2">
              Information
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
                  About WHAT&apos;S NEXT PH
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">
                  Contact & Pitch
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="text-zinc-400 hover:text-white transition-colors">
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link href="/corrections" className="text-zinc-400 hover:text-white transition-colors">
                  Corrections
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-zinc-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} WHAT&apos;S NEXT PH Media. All rights reserved.</p>
          <p className="text-center sm:text-right font-mono text-[11px]">
            Cloudflare Workers & Headless WordPress
          </p>
        </div>
      </div>
    </footer>
  );
};
