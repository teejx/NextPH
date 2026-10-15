'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Tech', href: '/tech' },
  { name: 'Lifestyle', href: '/lifestyle' },
  { name: 'Travel', href: '/travel' },
  { name: 'Trending', href: '/trending' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center font-sans text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 transition-opacity hover:opacity-80"
          >
            NEXT<span className="text-zinc-400 font-light ml-0.5 text-xl sm:text-2xl">PH</span>
          </Link>

          {/* Desktop Navigation with Minimalist Editorial Slashes */}
          <nav className="hidden md:flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-800" aria-label="Main navigation">
            {NAV_ITEMS.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <React.Fragment key={item.href}>
                  <Link
                    href={item.href}
                    className={`transition-colors hover:text-black ${
                      isActive ? 'text-black underline underline-offset-4 decoration-2' : 'text-zinc-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                  {index < NAV_ITEMS.length - 1 && (
                    <span className="text-zinc-300 font-light select-none">/</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Search & Menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="rounded-full p-2 text-zinc-800 transition-colors hover:bg-zinc-100 hover:text-black focus-visible:outline-2 focus-visible:outline-black"
            aria-label="Search stories"
          >
            <Search className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2 text-zinc-800 transition-colors hover:bg-zinc-100 hover:text-black focus-visible:outline-2 focus-visible:outline-black"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-6 py-6 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4 text-sm font-bold uppercase tracking-wider" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-zinc-800 hover:text-black"
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-zinc-100 pt-4 mt-2">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-xs text-zinc-500 hover:text-black"
              >
                About NextPH
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-xs text-zinc-500 hover:text-black"
              >
                Contact & Pitch
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
