'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Article } from '../../lib/wordpress/types';
import { StoryCard } from '../../components/StoryCard';

function SearchComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) {
        throw new Error('Search failed');
      }
      const data = await res.json();
      setResults(data.articles || []);
      setSearched(true);
    } catch {
      setError('Unable to complete search request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    });
    performSearch(query);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-[#CCC7BD] pb-8 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C43622]">Archive Search</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#141312]">
          Search NextPH Stories
        </h1>
        <p className="mt-3 text-sm text-[#4A4642]">
          Search our full catalog of Filipino technology, travel, lifestyle, and trending stories.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 relative" role="search">
          <label htmlFor="search-input" className="sr-only">
            Search stories
          </label>
          <div className="relative">
            <input
              type="search"
              id="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, topic, or author (e.g. Batanes, Fintech)..."
              className="w-full rounded-full border border-[#CCC7BD] bg-white py-3.5 pl-12 pr-28 text-sm text-[#141312] placeholder-[#76716B] shadow-xs focus:border-[#C43622] focus:outline-hidden"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#76716B]" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center rounded-full bg-[#141312] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#C43622] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </button>
          </div>
        </form>
      </header>

      {/* Results Area */}
      <main className="mt-10" aria-live="polite">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-[#76716B]">
            <Loader2 className="h-8 w-8 animate-spin text-[#C43622]" />
            <p className="mt-3 text-sm">Searching the editorial archive...</p>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-sm border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700 flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <div className="py-16 text-center text-[#76716B] max-w-md mx-auto">
            <h3 className="font-serif text-lg font-bold text-[#141312]">No stories matched your search</h3>
            <p className="mt-2 text-sm text-[#4A4642]">
              Try searching for broader keywords such as &ldquo;Tech&rdquo;, &ldquo;Travel&rdquo;, or &ldquo;Culture&rdquo;.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="mb-6 text-xs text-[#76716B]">
              Found <span className="font-bold text-[#141312]">{results.length}</span> stories matching &ldquo;{query}&rdquo;
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((article) => (
                <StoryCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-[#76716B]">
          <Loader2 className="h-8 w-8 animate-spin text-[#C43622]" />
        </div>
      }
    >
      <SearchComponent />
    </Suspense>
  );
}
