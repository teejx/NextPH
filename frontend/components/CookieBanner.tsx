'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem('nextph_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth entrance after page load
      const timer = setTimeout(() => {
        setVisible(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('nextph_cookie_consent', 'all');
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('nextph_cookie_consent', 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-5 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shrink-0">
          <Cookie className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-sans text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
            Editorial Privacy & Cookies
          </h3>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
            Data Dignity & Minimum Tracking
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        We use essential cookies to maintain your theme preferences, session security, and ensure fast edge caching of our dispatches. We never use surveillance trackers. Read our{' '}
        <Link
          href="/privacy-policy"
          className="underline font-semibold text-zinc-900 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleAcceptAll}
          className="flex-1 sm:flex-none rounded-full bg-zinc-950 dark:bg-zinc-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer text-center"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={handleEssentialOnly}
          className="flex-1 sm:flex-none rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:border-zinc-950 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer text-center"
        >
          Essential Only
        </button>
      </div>
    </aside>
  );
};
