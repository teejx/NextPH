'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  variant?: 'horizontal' | 'vertical';
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url, variant = 'horizontal' }) => {
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Share failed:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  if (variant === 'vertical') {
    return (
      <div className="flex flex-col items-center gap-3" aria-label="Social sharing options">
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
          Share
        </span>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white cursor-pointer"
          title={copied ? 'Link copied!' : 'Copy article link'}
          aria-label={copied ? 'Story link copied to clipboard' : 'Copy link to story'}
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
        </button>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 text-xs font-bold transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
          aria-label="Share on X (formerly Twitter)"
          title="Share on X (formerly Twitter)"
        >
          𝕏
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 text-xs font-bold transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          f
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 text-xs font-bold transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
        >
          in
        </a>

        {/* Native Share */}
        <button
          onClick={handleNativeShare}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white cursor-pointer"
          title="Share options"
          aria-label="Share via system menu"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Standard Horizontal Variant
  return (
    <div className="flex flex-wrap items-center gap-2.5 py-4" aria-label="Social sharing options">
      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-2">
        Share Dispatch:
      </span>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-800 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white cursor-pointer"
        aria-label={copied ? 'Story link copied to clipboard' : 'Copy link to story'}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">Link Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon className="h-3.5 w-3.5 text-zinc-500" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Native Web Share Button */}
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-800 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white cursor-pointer"
        title="Share via device options"
        aria-label="Share story via system menu"
      >
        <Share2 className="h-3.5 w-3.5 text-zinc-500" />
        <span>Share</span>
      </button>

      {/* Accessible direct share links */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-800 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white transition-colors"
        aria-label="Share on X (formerly Twitter)"
      >
        𝕏
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-800 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white transition-colors"
        aria-label="Share on Facebook"
      >
        Facebook
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-800 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white transition-colors"
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </a>
    </div>
  );
};
