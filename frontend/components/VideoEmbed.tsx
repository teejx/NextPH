import React from 'react';
import { sanitizeVideoEmbedUrl } from '../lib/wordpress/client';

interface VideoEmbedProps {
  embedUrl?: string | null;
  title?: string;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  embedUrl,
  title = 'Embedded Video Story',
  className = '',
}) => {
  const safeUrl = sanitizeVideoEmbedUrl(embedUrl);

  if (!safeUrl) {
    return null;
  }

  return (
    <figure className={`my-8 overflow-hidden rounded-sm border border-[#E8E4DD] bg-black ${className}`}>
      <div className="relative aspect-video w-full">
        <iframe
          src={safeUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <figcaption className="bg-[#F3EFEA] px-4 py-2 text-center text-xs text-[#76716B]">
        {title} (Validated Trusted Provider Embed)
      </figcaption>
    </figure>
  );
};
