'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ArrowRight, Loader2 } from 'lucide-react';
import { Article } from '../lib/wordpress/types';
import { isGifImage } from '../lib/media';

const NAV_ITEMS = [
  { name: 'News', href: '/news' },
  { name: 'Tech', href: '/tech' },
  { name: 'Lifestyle', href: '/lifestyle' },
  { name: 'Travel', href: '/travel' },
  { name: 'Trending', href: '/trending' },
];

const ALL_CATEGORIES = [
  { name: 'News', slug: 'news', desc: 'National news, geopolitics & policy' },
  { name: 'Tech', slug: 'tech', desc: 'Fintech, telecom & digital innovation' },
  { name: 'Lifestyle', slug: 'lifestyle', desc: 'Culinary arts, design & contemporary culture' },
  { name: 'Travel', slug: 'travel', desc: 'Archipelago journeys & ecotourism' },
  { name: 'Trending', slug: 'trending', desc: 'Curated dispatches shaping discourse' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input when search bar opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchOpen]);

  // Click outside listener to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  // Handle live search debouncing
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.articles || []);
        }
      } catch {
        // Keep existing results or empty
      } finally {
        setIsSearching(false);
      }
    }, 200);
  };

  // When user hits Enter, navigate to full search page
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        const targetQuery = searchQuery.trim();
        setSearchOpen(false);
        router.push(`/search?q=${encodeURIComponent(targetQuery)}`);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  const handleSelectPost = (slug: string) => {
    setSearchOpen(false);
    router.push(`/story/${slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    setSearchOpen(false);
    router.push(`/${slug}`);
  };

  // Filter categories matching query
  const matchingCategories = searchQuery.trim()
    ? ALL_CATEGORIES.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 relative">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center font-sans text-xl sm:text-2xl font-black tracking-tight text-zinc-950 transition-opacity hover:opacity-80"
          >
            <span>WHAT&apos;S NEXT</span>
            <span className="text-zinc-400 font-light ml-1.5 text-lg sm:text-xl">PH</span>
          </Link>

          {/* Desktop Navigation with Minimalist Editorial Slashes (hidden when search is active on smaller screens) */}
          <nav
            className={`hidden ${
              searchOpen ? 'lg:flex' : 'md:flex'
            } items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-800`}
            aria-label="Main navigation"
          >
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

        {/* Right Actions & Live Search Line */}
        <div className="flex items-center gap-3">
          {searchOpen ? (
            /* Search Line & Live Dropdown Container */
            <div ref={searchContainerRef} className="relative flex items-center">
              <div className="flex items-center w-60 sm:w-80 md:w-96 border-b border-zinc-900 pb-1.5 transition-all">
                <Search className="h-4 w-4 text-zinc-950 mr-2 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search posts or categories..."
                  autoComplete="off"
                  spellCheck={false}
                  style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-zinc-950 placeholder-zinc-400 border-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 ring-0 shadow-none appearance-none"
                  aria-label="Search posts or categories"
                />
                {isSearching ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500 shrink-0 mr-1" />
                ) : searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      searchInputRef.current?.focus();
                    }}
                    className="text-zinc-400 hover:text-zinc-950 mr-1 p-0.5 outline-none focus:outline-none cursor-pointer"
                    aria-label="Clear query"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-2.5 text-zinc-500 hover:text-zinc-950 text-xs font-bold uppercase tracking-wider p-1 outline-none focus:outline-none cursor-pointer"
                aria-label="Close search"
              >
                Close
              </button>

              {/* Instant Search Results Dropdown */}
              {(searchQuery.trim().length > 0 || searchResults.length > 0) && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 md:w-[440px] rounded-xs border border-zinc-200 bg-white shadow-2xl z-50 overflow-hidden divide-y divide-zinc-100 max-h-[480px] overflow-y-auto animate-in fade-in-50 zoom-in-95">
                  {/* Matching Categories Pill Section */}
                  {matchingCategories.length > 0 && (
                    <div className="p-3 bg-zinc-50/70">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2 px-1">
                        Matching Categories
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchingCategories.map((cat) => (
                          <button
                            key={cat.slug}
                            type="button"
                            onClick={() => handleSelectCategory(cat.slug)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-colors cursor-pointer text-left"
                          >
                            <span>{cat.name}</span>
                            <span className="text-[10px] text-zinc-400 font-normal">
                              →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Posts Section */}
                  {isSearching ? (
                    <div className="p-6 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                      Searching stories...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="p-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block px-2.5 py-1.5">
                        Stories ({searchResults.length})
                      </span>
                      <div className="divide-y divide-zinc-100">
                        {searchResults.slice(0, 5).map((article) => (
                          <button
                            key={article.id}
                            type="button"
                            onClick={() => handleSelectPost(article.slug)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xs hover:bg-zinc-50 transition-colors text-left group cursor-pointer"
                          >
                            {article.featuredImage?.url && (
                              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xs bg-zinc-100">
                                <Image
                                  src={article.featuredImage.url}
                                  alt={article.title}
                                  fill
                                  unoptimized={isGifImage(article.featuredImage.url)}
                                  sizes="44px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="grow min-w-0">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block">
                                {article.category.name}
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-zinc-950 group-hover:text-zinc-600 transition-colors truncate">
                                {article.title}
                              </p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-zinc-500">
                      No stories found for &ldquo;{searchQuery}&rdquo;.
                    </div>
                  )}

                  {/* Press Enter Footer Link to Search Page */}
                  <button
                    type="button"
                    onClick={() => {
                      const q = searchQuery.trim();
                      setSearchOpen(false);
                      router.push(`/search?q=${encodeURIComponent(q)}`);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold uppercase tracking-wider text-zinc-900 border-t border-zinc-200 transition-colors cursor-pointer"
                  >
                    <span>
                      Press <kbd className="px-1.5 py-0.5 rounded-xs bg-zinc-200 text-zinc-800 text-[10px]">Enter</kbd> to see full archive results
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Search Trigger Button */
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-zinc-800 transition-colors hover:bg-zinc-100 hover:text-black outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
              aria-label="Open search line"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2 text-zinc-800 transition-colors hover:bg-zinc-100 hover:text-black focus-visible:outline-2 focus-visible:outline-black md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-6 py-6 animate-in slide-in-from-top-2 md:hidden">
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
                About WHAT&apos;S NEXT PH
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
