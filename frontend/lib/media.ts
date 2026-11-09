/**
 * Media detection and optimization utilities.
 * Handles GIFs, HTML5 video formats, and video provider embeds.
 */

const TRUSTED_VIDEO_HOSTS = [
  'localhost',
  '127.0.0.1',
  'whatsnextph.local',
  'nextph-cms.local',
  'cms.nextph.example',
  'whatsnextph',
];

/**
 * Detect if a media URL points to an animated GIF.
 */
export function isGifImage(url?: string | null): boolean {
  if (!url) return false;
  return /\.gif(\?.*)?$/i.test(url.trim());
}

/**
 * Detect if a media URL points to a direct video file.
 */
export function isVideoMedia(url?: string | null): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url.trim());
}

/**
 * Validate whether a video URL host is trusted (local CMS or configured production).
 */
export function isTrustedVideoHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    
    // Check built-in trusted local and dev hosts
    if (TRUSTED_VIDEO_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
      return true;
    }

    // Check environment-configured URLs
    if (process.env.WORDPRESS_API_URL) {
      try {
        const wpHost = new URL(process.env.WORDPRESS_API_URL).hostname.toLowerCase();
        if (host === wpHost || host.endsWith(`.${wpHost}`)) return true;
      } catch {
        // ignore
      }
    }

    if (process.env.NEXT_PUBLIC_SITE_URL) {
      try {
        const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname.toLowerCase();
        if (host === siteHost || host.endsWith(`.${siteHost}`)) return true;
      } catch {
        // ignore
      }
    }

    return false;
  } catch {
    return false;
  }
}
