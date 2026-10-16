import React from 'react';
import { sanitizeVideoEmbedUrl } from '../lib/wordpress/client';
import { isVideoMedia } from '../lib/media';

interface VideoEmbedProps {
  embedUrl?: string | null;
  title?: string;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  embedUrl,
  title = 'Embedded Video Dispatch',
  className = '',
}) => {
  const safeUrl = sanitizeVideoEmbedUrl(embedUrl);

  if (!safeUrl) {
    return null;
  }

  const isDirectVideo = isVideoMedia(safeUrl);

  return (
    <figure className={`my-8 overflow-hidden rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-sm ${className}`}>
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        {isDirectVideo ? (
          <video
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
            title={title}
          >
            <source src={safeUrl} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={safeUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>
      <figcaption className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        {title}
      </figcaption>
    </figure>
  );
};

