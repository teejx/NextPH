'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Globe } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Tech', href: '/tech' },
  { name: 'Travel', href: '/travel' },
  { name: 'Lifestyle', href: '/lifestyle' },
  { name: 'Trending', href: '/trending' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Current formatted date in Philippine context
  const currentDate = new Intl.DateTimeFormat('en-PH', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="w-full border-b border-[#CCC7BD] bg-[#FBF9F5]">
      {/* Top Edition & Date Bar */}
      <div className="border-b border-[#E8E4DD] bg-[#F3EFEA] px-4 py-1.5 text-xs text-[#76716B]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#141312] flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-[#C43622]" />
              Philippines Edition
            </span>
            <span className="hidden sm:inline text-[#CCC7BD]">|</span>
            <span className="hidden sm:inline">{currentDate}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline font-medium">Trending:</span>
            <div className="flex items-center gap-3 text-[11px]">
              <Link href="/tag/fintech" className="hover:text-[#C43622] hover:underline">
                #Fintech
              </Link>
              <Link href="/tag/batanes" className="hover:text-[#C43622] hover:underline">
                #Batanes
              </Link>
              <Link href="/tag/culinary" className="hover:text-[#C43622] hover:underline">
                #Culinary
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xs p-2 text-[#141312] hover:bg-[#F3EFEA] lg:hidden focus-visible:outline-2 focus-visible:outline-[#C43622]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo / Wordmark */}
          <Link href="/" className="group flex items-baseline gap-1 focus-visible:outline-2 focus-visible:outline-[#C43622]">
            <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#141312]">
              Next<span className="text-[#C43622]">PH</span>
            </span>
            <span className="hidden sm:inline-block h-2 w-2 rounded-full bg-[#C43622] ml-0.5"></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#C43622] focus-visible:outline-2 focus-visible:outline-[#C43622] ${
                  isActive ? 'text-[#C43622] border-b-2 border-[#C43622] pb-1' : 'text-[#141312]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Search Action */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-full border border-[#CCC7BD] bg-white px-3.5 py-1.5 text-xs font-medium text-[#141312] hover:border-[#141312] hover:text-[#C43622] focus-visible:outline-2 focus-visible:outline-[#C43622]"
            aria-label="Search stories"
          >
            <Search className="h-4 w-4 text-[#76716B]" />
            <span className="hidden sm:inline">Search</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#CCC7BD] bg-[#FBF9F5] px-6 py-6 lg:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold uppercase tracking-wider ${
                    isActive ? 'text-[#C43622]' : 'text-[#141312]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="border-t border-[#E8E4DD] pt-4 mt-2">
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-[#4A4642] hover:text-[#C43622]"
              >
                <Search className="h-4 w-4" />
                <span>Search Stories & Archives</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
