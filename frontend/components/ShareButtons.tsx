'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
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

  return (
    <div className="flex flex-wrap items-center gap-2 py-4" aria-label="Social sharing options">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#76716B] mr-2">Share Story:</span>

      {/* Native Web Share Button */}
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#CCC7BD] bg-white px-3 py-1.5 text-xs font-medium text-[#141312] transition-colors hover:border-[#141312] hover:bg-[#FBF9F5] focus-visible:outline-2 focus-visible:outline-[#C43622]"
        title="Share via device options"
        aria-label="Share story via system menu"
      >
        <Share2 className="h-3.5 w-3.5 text-[#C43622]" />
        <span>Share</span>
      </button>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#CCC7BD] bg-white px-3 py-1.5 text-xs font-medium text-[#141312] transition-colors hover:border-[#141312] hover:bg-[#FBF9F5] focus-visible:outline-2 focus-visible:outline-[#C43622]"
        aria-label={copied ? 'Story link copied to clipboard' : 'Copy link to story'}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-600" />
            <span className="text-green-700 font-semibold">Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon className="h-3.5 w-3.5 text-[#76716B]" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Accessible direct share links without tracking SDKs */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full border border-[#CCC7BD] bg-white px-3 py-1.5 text-xs font-medium text-[#141312] hover:border-[#141312] hover:bg-[#FBF9F5] focus-visible:outline-2 focus-visible:outline-[#C43622]"
        aria-label="Share on X (formerly Twitter)"
      >
        X
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full border border-[#CCC7BD] bg-white px-3 py-1.5 text-xs font-medium text-[#141312] hover:border-[#141312] hover:bg-[#FBF9F5] focus-visible:outline-2 focus-visible:outline-[#C43622]"
        aria-label="Share on Facebook"
      >
        Facebook
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full border border-[#CCC7BD] bg-white px-3 py-1.5 text-xs font-medium text-[#141312] hover:border-[#141312] hover:bg-[#FBF9F5] focus-visible:outline-2 focus-visible:outline-[#C43622]"
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </a>
    </div>
  );
};
