'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full border border-zinc-200 bg-transparent" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50/80 text-zinc-800 transition-all duration-300 hover:border-zinc-950 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 cursor-pointer overflow-hidden shadow-2xs"
    >
      <div className="relative h-4 w-4">
        {/* Sun Icon (light mode) */}
        <Sun
          className={`absolute inset-0 h-4 w-4 transition-all duration-500 transform ${
            isDark
              ? 'rotate-90 scale-0 opacity-0 text-amber-400'
              : 'rotate-0 scale-100 opacity-100 text-zinc-900'
          }`}
        />
        {/* Moon Icon (dark mode) */}
        <Moon
          className={`absolute inset-0 h-4 w-4 transition-all duration-500 transform ${
            isDark
              ? 'rotate-0 scale-100 opacity-100 text-zinc-100'
              : '-rotate-90 scale-0 opacity-0 text-zinc-400'
          }`}
        />
      </div>
    </button>
  );
};
