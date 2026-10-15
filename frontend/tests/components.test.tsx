import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdSlot } from '../components/AdSlot';
import { ShareButtons } from '../components/ShareButtons';
import { HeroSection } from '../components/HeroSection';
import { Article } from '../lib/wordpress/types';

describe('Frontend Component Guarantees', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('AdSlot Component', () => {
    it('renders null and reserves zero DOM space when NEXT_PUBLIC_ADS_ENABLED is false', () => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = 'false';
      const { container } = render(<AdSlot placement="leaderboard" />);
      expect(container.firstChild).toBeNull();
    });

    it('renders designated ad container only when NEXT_PUBLIC_ADS_ENABLED is explicitly true', () => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = 'true';
      render(<AdSlot placement="leaderboard" />);
      const ad = screen.getByLabelText('Advertisement');
      expect(ad).toBeInTheDocument();
      expect(screen.getByText(/Sponsored Content Slot/i)).toBeInTheDocument();
    });
  });

  describe('ShareButtons Component', () => {
    it('renders accessible share and copy link controls', () => {
      render(<ShareButtons title="Sample Article" url="http://localhost:3000/story/sample" />);
      expect(screen.getByLabelText('Copy link to story')).toBeInTheDocument();
      expect(screen.getByLabelText('Share on X (formerly Twitter)')).toBeInTheDocument();
      expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument();
    });
  });

  describe('HeroSection Carousel Component', () => {
    const mockStories: Article[] = [
      {
        id: '1',
        slug: 'story-1',
        title: 'Story 1 Title',
        excerpt: 'Excerpt 1',
        content: '<p>Content</p>',
        featuredImage: { url: 'https://images.unsplash.com/photo-1?q=80', alt: 'Img 1' },
        category: { id: 1, name: 'Tech', slug: 'tech' },
        tags: [],
        author: { name: 'Author 1', avatarUrl: null, bio: null },
        publishedAt: '2026-10-15T00:00:00Z',
        modifiedAt: '2026-10-15T00:00:00Z',
        readingTimeMinutes: 3,
        isFeatured: true,
        isTrending: false,
      },
      {
        id: '2',
        slug: 'story-2',
        title: 'Story 2 Title',
        excerpt: 'Excerpt 2',
        content: '<p>Content</p>',
        featuredImage: { url: 'https://images.unsplash.com/photo-2?q=80', alt: 'Img 2' },
        category: { id: 2, name: 'News', slug: 'news' },
        tags: [],
        author: { name: 'Author 2', avatarUrl: null, bio: null },
        publishedAt: '2026-10-15T00:00:00Z',
        modifiedAt: '2026-10-15T00:00:00Z',
        readingTimeMinutes: 2,
        isFeatured: true,
        isTrending: false,
      },
    ];

    const mockSidebar: Article[] = [
      {
        id: '3',
        slug: 'story-3',
        title: 'Sidebar Story 3',
        excerpt: 'Sidebar Excerpt',
        content: '<p>Content</p>',
        featuredImage: { url: 'https://images.unsplash.com/photo-3?q=80', alt: 'Img 3' },
        category: { id: 3, name: 'Travel', slug: 'travel' },
        tags: [],
        author: { name: 'Author 3', avatarUrl: null, bio: null },
        publishedAt: '2026-10-15T00:00:00Z',
        modifiedAt: '2026-10-15T00:00:00Z',
        readingTimeMinutes: 4,
        isFeatured: false,
        isTrending: true,
      },
    ];

    it('renders hero carousel and allows switching active slide with controls', () => {
      render(<HeroSection featuredStories={mockStories} sidebarStories={mockSidebar} />);
      expect(screen.getByText('Story 1 Title')).toBeInTheDocument();
      expect(screen.getByText('Sidebar Story 3')).toBeInTheDocument();

      const nextButton = screen.getByLabelText('Next story');
      fireEvent.click(nextButton);

      expect(screen.getByText('Story 2 Title')).toBeInTheDocument();
    });
  });
});
