import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#CCC7BD] bg-[#141312] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-black tracking-tight text-white">
                Next<span className="text-[#C43622]">PH</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-[#CCC7BD] leading-relaxed max-w-sm">
              NextPH is an independent Filipino digital publication covering technology breakthroughs, archipelago travel, contemporary lifestyle, and curated trending stories.
            </p>
            <div className="mt-6 text-xs text-[#76716B]">
              Published from Manila, Philippines.
            </div>
          </div>

          {/* Editorial Sections */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#CCC7BD] border-b border-[#4A4642] pb-2">
              Sections
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/tech" className="text-[#CCC7BD] hover:text-white transition-colors">
                  Tech & Telecom
                </Link>
              </li>
              <li>
                <Link href="/travel" className="text-[#CCC7BD] hover:text-white transition-colors">
                  Archipelago Travel
                </Link>
              </li>
              <li>
                <Link href="/lifestyle" className="text-[#CCC7BD] hover:text-white transition-colors">
                  Culture & Lifestyle
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-[#CCC7BD] hover:text-white transition-colors">
                  Trending Stories
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-[#CCC7BD] hover:text-white transition-colors">
                  Search Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Topics / Tags */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#CCC7BD] border-b border-[#4A4642] pb-2">
              Topics
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/tag/fintech" className="text-[#CCC7BD] hover:text-white transition-colors">
                  #Fintech
                </Link>
              </li>
              <li>
                <Link href="/tag/batanes" className="text-[#CCC7BD] hover:text-white transition-colors">
                  #Batanes
                </Link>
              </li>
              <li>
                <Link href="/tag/ecotourism" className="text-[#CCC7BD] hover:text-white transition-colors">
                  #Ecotourism
                </Link>
              </li>
              <li>
                <Link href="/tag/culinary" className="text-[#CCC7BD] hover:text-white transition-colors">
                  #Culinary
                </Link>
              </li>
              <li>
                <Link href="/tag/space-science" className="text-[#CCC7BD] hover:text-white transition-colors">
                  #SpaceScience
                </Link>
              </li>
            </ul>
          </div>

          {/* Informational & Standards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#CCC7BD] border-b border-[#4A4642] pb-2">
              Information
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-[#CCC7BD] hover:text-white transition-colors">
                  About NextPH
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#CCC7BD] hover:text-white transition-colors">
                  Contact & Pitch
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="text-[#CCC7BD] hover:text-white transition-colors">
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link href="/corrections" className="text-[#CCC7BD] hover:text-white transition-colors">
                  Corrections
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-[#CCC7BD] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#4A4642] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#76716B] gap-4">
          <p>© {new Date().getFullYear()} NextPH Media. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Crafted for speed on Cloudflare Workers & headless WordPress.
          </p>
        </div>
      </div>
    </footer>
  );
};
