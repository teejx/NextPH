import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdSlot } from '../components/AdSlot';
import { ShareButtons } from '../components/ShareButtons';

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
});
