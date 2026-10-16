import { Article, PaginatedArticles, WPPostRaw, WPCategory, WPTag } from './types';
import { SAMPLE_FIXTURES } from './fixtures';
import { isGifImage, isVideoMedia, isTrustedVideoHost } from '../media';

const WP_API_URL = process.env.WORDPRESS_API_URL || 'https://cms.nextph.example/wp-json';

/**
 * Decode common HTML entities from WordPress post titles and excerpts.
 */
export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Sanitize untrusted WordPress block HTML on the server.
 * Edge-compatible (Cloudflare Workers & Next.js ISR safe, zero jsdom/filesystem dependency).
 * Allows standard editorial markup and videos while removing script, untrusted iframes, inline event handlers, and malicious URIs.
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  // 1. Remove dangerous executable/injection blocks: <script>, <style>, <object>, <embed>
  let clean = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 2. Sanitize <iframe> tags: preserve trusted YouTube and Vimeo video embeds, strip all other untrusted iframes
  clean = clean.replace(/<iframe\b([^>]*)>(.*?)<\/iframe>/gi, (match, attrs) => {
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      const src = srcMatch[1];
      if (
        src.startsWith('https://www.youtube.com/embed/') ||
        src.startsWith('https://www.youtube-nocookie.com/embed/') ||
        src.startsWith('https://player.vimeo.com/video/')
      ) {
        // Safe video embed: enforce lazy loading
        return `<iframe ${attrs} loading="lazy"></iframe>`;
      }
    }
    return '';
  });

  // 3. Optimize inline <video> tags: enforce preload="metadata" and playsinline for fast, smooth playback
  clean = clean.replace(/<video\b([^>]*)>/gi, (match, attrs) => {
    let updatedAttrs = attrs;
    if (!/preload=/i.test(updatedAttrs)) {
      updatedAttrs += ' preload="metadata"';
    }
    if (!/playsinline/i.test(updatedAttrs)) {
      updatedAttrs += ' playsinline';
    }
    return `<video ${updatedAttrs.trim()}>`;
  });

  // 4. Remove inline event handlers (onerror=, onclick=, onload=, etc.)
  clean = clean.replace(/\s+on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 5. Remove javascript:, data:, and vbscript: URIs in attributes
  clean = clean.replace(/(href|src)\s*=\s*['"]\s*(?:javascript|data|vbscript):[^'"]*['"]/gi, '$1="#"');

  return clean.trim();
}

/**
 * Validate and safely transform allowed video embed URLs (YouTube, Vimeo, and trusted direct video files).
 * Rejects untrusted external domains and arbitrary non-video URLs.
 */
export function sanitizeVideoEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const trimmed = url.trim();
    if (!trimmed) return null;

    // Check direct video file (.mp4, .webm, .ogg, .mov, .m4v)
    if (isVideoMedia(trimmed)) {
      if (isTrustedVideoHost(trimmed)) {
        return trimmed;
      }
      return null;
    }

    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    // YouTube
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      let videoId = '';
      if (host.includes('youtu.be')) {
        videoId = parsed.pathname.slice(1);
      } else if (parsed.searchParams.has('v')) {
        videoId = parsed.searchParams.get('v') || '';
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.replace('/embed/', '');
      }
      return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : null;
    }

    // Vimeo
    if (host.includes('vimeo.com')) {
      const match = parsed.pathname.match(/\/(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

// In-memory cache for category IDs
const categoryIdCache: Record<string, number> = {};

/**
 * Resilient WordPress REST API fetcher.
 * Automatically tries primary configured URL (e.g. https://whatsnextph.local/wp-json),
 * with seamless fallback to previous development domain during migration.
 */
async function fetchWP(pathAndQuery: string, options?: RequestInit): Promise<Response> {
  const primaryUrl = `${WP_API_URL}${pathAndQuery}`;
  try {
    const res = await fetch(primaryUrl, options);
    if (res.ok || res.status === 404) return res;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production' && WP_API_URL.includes('whatsnextph')) {
      try {
        const fallbackRes = await fetch(`http://nextph-cms.local/wp-json${pathAndQuery}`, options);
        if (fallbackRes.ok) return fallbackRes;
      } catch {
        // ignore fallback failure and throw original error
      }
    }
    throw err;
  }

  if (process.env.NODE_ENV !== 'production' && WP_API_URL.includes('whatsnextph')) {
    try {
      const fallbackRes = await fetch(`http://nextph-cms.local/wp-json${pathAndQuery}`, options);
      if (fallbackRes.ok) return fallbackRes;
    } catch {
      // ignore
    }
  }

  return fetch(primaryUrl, options);
}

/**
 * Resolve a category slug to a WordPress category ID.
 */
async function getCategoryIdBySlug(slug: string): Promise<number | null> {
  if (categoryIdCache[slug]) return categoryIdCache[slug];

  try {
    const res = await fetchWP(`/wp/v2/categories?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const categories: WPCategory[] = await res.json();
      if (categories.length > 0) {
        categoryIdCache[slug] = categories[0].id;
        return categories[0].id;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

const tagIdCache: Record<string, number> = {};

/**
 * Resolve a tag slug to a WordPress tag ID.
 */
async function getTagIdBySlug(slug: string): Promise<number | null> {
  if (tagIdCache[slug]) return tagIdCache[slug];

  try {
    const res = await fetchWP(`/wp/v2/tags?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const tags: WPTag[] = await res.json();
      if (tags.length > 0) {
        tagIdCache[slug] = tags[0].id;
        return tags[0].id;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Transform a raw WordPress REST API post into a normalized Article.
 */
export function transformWPPost(post: WPPostRaw): Article {
  const authorEmbedded = post._embedded?.author?.[0];
  const mediaEmbedded = post._embedded?.['wp:featuredmedia']?.[0];
  const termsEmbedded = post._embedded?.['wp:term'] || [];

  const categories: WPCategory[] = (termsEmbedded[0] as WPCategory[]) || [];
  const tags: WPTag[] = (termsEmbedded[1] as WPTag[]) || [];

  // Pick primary category, prioritizing standard pillars if multiple exist
  const prioritizedPillar = categories.find((c) =>
    ['news', 'tech', 'travel', 'lifestyle'].includes(c.slug.toLowerCase())
  );
  const primaryCategory = prioritizedPillar || categories[0] || {
    id: 1,
    name: 'General',
    slug: 'general',
  };

  // Extract featured image from embedded media or first inline content image
  let contentImgUrl: string | null = null;
  if (!mediaEmbedded?.source_url && post.content?.rendered) {
    const match = post.content.rendered.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1]) {
      contentImgUrl = match[1];
    }
  }

  const fallbackImgUrl =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80';

  // If the media source URL is an animated GIF, always use original source_url
  // because WordPress PHP GD / image resizing often strips animation frames in thumbnail sizes
  const isFeaturedGif = isGifImage(mediaEmbedded?.source_url);
  const featuredImgUrl =
    (isFeaturedGif
      ? mediaEmbedded?.source_url || mediaEmbedded?.media_details?.sizes?.full?.source_url
      : mediaEmbedded?.source_url ||
        mediaEmbedded?.media_details?.sizes?.large?.source_url ||
        mediaEmbedded?.media_details?.sizes?.full?.source_url) ||
    contentImgUrl ||
    fallbackImgUrl;

  const titleClean = decodeHtmlEntities(post.title?.rendered || 'Untitled Dispatch');
  const rawExcerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '';
  const excerptClean = decodeHtmlEntities(rawExcerpt)
    .replace(/\[(&hellip;|&#8230;|…|\.{3})\]/g, '…')
    .trim();

  const wordCount = (post.content?.rendered || '').replace(/<[^>]+>/g, '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  // Extract video URL from meta or embedded post content (native <video> or YouTube/Vimeo)
  let extractedVideoUrl: string | null = null;
  const rawVideoMeta =
    (post.meta?._nextph_video_url as string) ||
    (post.meta?.video_url as string) ||
    (post.meta?.video as string) ||
    (post.meta?.video_embed as string);

  if (rawVideoMeta) {
    extractedVideoUrl = sanitizeVideoEmbedUrl(rawVideoMeta);
  } else if (post.content?.rendered) {
    const videoMatch = post.content.rendered.match(/<(?:video|source)[^>]+src=["']([^"']+)["']/i);
    if (videoMatch && videoMatch[1]) {
      extractedVideoUrl = sanitizeVideoEmbedUrl(videoMatch[1]);
    } else {
      const iframeMatch = post.content.rendered.match(/<iframe[^>]+src=["']([^"']+(?:youtube|youtu\.be|vimeo)[^"']+)["']/i);
      if (iframeMatch && iframeMatch[1]) {
        extractedVideoUrl = sanitizeVideoEmbedUrl(iframeMatch[1]);
      }
    }
  }

  return {
    id: String(post.id),
    slug: post.slug,
    title: titleClean,
    excerpt: excerptClean,
    contentHtml: sanitizeHtml(post.content?.rendered || ''),
    publishedAt: post.date,
    updatedAt: post.modified,
    readingTimeMinutes: readingTime,
    category: {
      id: primaryCategory.id,
      name: decodeHtmlEntities(primaryCategory.name),
      slug: primaryCategory.slug,
    },
    tags: tags.map((t) => ({ id: t.id, name: decodeHtmlEntities(t.name), slug: t.slug })),
    author: {
      id: authorEmbedded?.id || 1,
      name: authorEmbedded?.name || "WHAT'S NEXT PH Editorial",
      slug: authorEmbedded?.slug || 'editorial',
      avatarUrl: authorEmbedded?.avatar_urls?.['96'] || authorEmbedded?.avatar_urls?.['48'],
      bio: authorEmbedded?.description,
    },
    featuredImage: {
      url: featuredImgUrl,
      alt: mediaEmbedded?.alt_text || titleClean,
      width: mediaEmbedded?.media_details?.width || 1200,
      height: mediaEmbedded?.media_details?.height || 800,
    },
    isFeatured: Boolean(post.meta?._nextph_is_featured),
    isTrending: Boolean(post.meta?._nextph_is_trending),
    videoEmbedUrl: extractedVideoUrl,
  };
}

/**
 * Fetch articles with pagination and category/search filters.
 */
export async function getArticles(options: {
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  page?: number;
  perPage?: number;
} = {}): Promise<PaginatedArticles> {
  const { categorySlug, tagSlug, search, page = 1, perPage = 10 } = options;

  try {
    const params = new URLSearchParams({
      _embed: '1',
      page: String(page),
      per_page: String(perPage),
    });

    if (categorySlug) {
      const categoryId = await getCategoryIdBySlug(categorySlug);
      if (categoryId) {
        params.append('categories', String(categoryId));
      }
    }

    if (tagSlug) {
      const tagId = await getTagIdBySlug(tagSlug);
      if (tagId) {
        params.append('tags', String(tagId));
      } else {
        // Fallback: search by tag keyword if taxonomy ID is not found
        params.append('search', tagSlug);
      }
    }

    if (search) {
      params.append('search', search);
    }

    const res = await fetchWP(`/wp/v2/posts?${params.toString()}`, {
      next: { revalidate: 120 }, // 2-minute ISR
    });

    if (!res.ok) {
      throw new Error(`WordPress API returned status ${res.status}`);
    }

    const totalArticles = parseInt(res.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const rawPosts: WPPostRaw[] = await res.json();

    return {
      articles: rawPosts.map(transformWPPost),
      totalPages,
      totalArticles,
      currentPage: page,
    };
  } catch (error) {
    console.warn(`[WordPress API] Unable to connect to ${WP_API_URL}. Falling back to sample fixtures. Error:`, error instanceof Error ? error.message : error);

    // Filter development sample fixtures
    let filtered = [...SAMPLE_FIXTURES];

    if (categorySlug) {
      filtered = filtered.filter((a) => a.category.slug.toLowerCase() === categorySlug.toLowerCase());
    }

    if (tagSlug) {
      filtered = filtered.filter((a) => a.tags.some((t) => t.slug.toLowerCase() === tagSlug.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.name.toLowerCase().includes(q) ||
          a.tags.some((t) => t.name.toLowerCase().includes(q))
      );
    }

    const totalArticles = filtered.length;
    const totalPages = Math.ceil(totalArticles / perPage) || 1;
    const offset = (page - 1) * perPage;
    const articles = filtered.slice(offset, offset + perPage);

    return {
      articles,
      totalPages,
      totalArticles,
      currentPage: page,
    };
  }
}

/**
 * Fetch a single published article by slug.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetchWP(`/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`, {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      throw new Error(`WordPress API returned ${res.status}`);
    }

    const rawPosts: WPPostRaw[] = await res.json();
    if (!rawPosts || rawPosts.length === 0) {
      const sample = SAMPLE_FIXTURES.find((a) => a.slug === slug);
      return sample || null;
    }

    return transformWPPost(rawPosts[0]);
  } catch {
    const sample = SAMPLE_FIXTURES.find((a) => a.slug === slug);
    return sample || null;
  }
}

/**
 * Fetch curated trending stories.
 */
export async function getTrendingStories(limit: number = 6): Promise<Article[]> {
  try {
    const res = await fetchWP(`/nextph/v1/trending?limit=${limit}&_embed=1`, {
      next: { revalidate: 120 },
    });

    if (res.ok) {
      const rawPosts: WPPostRaw[] = await res.json();
      return rawPosts.map(transformWPPost);
    }
    throw new Error(`Trending endpoint status ${res.status}`);
  } catch {
    return SAMPLE_FIXTURES.filter((a) => a.isTrending).slice(0, limit);
  }
}

/**
 * Fetch featured stories for the hero placement carousel.
 */
export async function getFeaturedStories(limit: number = 4): Promise<Article[]> {
  try {
    const res = await fetchWP(`/wp/v2/posts?per_page=${limit}&_embed=1`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      const rawPosts: WPPostRaw[] = await res.json();
      if (rawPosts.length > 0) {
        return rawPosts.map(transformWPPost);
      }
    }
  } catch {
    // fallback
  }

  const sampleFeatured = SAMPLE_FIXTURES.filter((a) => a.isFeatured);
  if (sampleFeatured.length > 0) {
    return sampleFeatured.slice(0, limit);
  }
  return SAMPLE_FIXTURES.slice(0, limit);
}

/**
 * Fetch single featured story for fallback hero placement.
 */
export async function getFeaturedStory(): Promise<Article | null> {
  const stories = await getFeaturedStories(1);
  return stories[0] || null;
}

/**
 * Fetch dynamic tags from WordPress for the trending topics strip.
 */
export async function getTags(limit: number = 10): Promise<WPTag[]> {
  const editorialDefaults: WPTag[] = [
    { id: 101, name: 'Tech', slug: 'tech', count: 12, description: '', link: '', taxonomy: 'post_tag' },
    { id: 102, name: 'Travel', slug: 'travel', count: 9, description: '', link: '', taxonomy: 'post_tag' },
    { id: 103, name: 'Lifestyle', slug: 'lifestyle', count: 8, description: '', link: '', taxonomy: 'post_tag' },
    { id: 104, name: 'News', slug: 'news', count: 7, description: '', link: '', taxonomy: 'post_tag' },
    { id: 105, name: 'Innovation', slug: 'innovation', count: 6, description: '', link: '', taxonomy: 'post_tag' },
    { id: 106, name: 'Culture', slug: 'culture', count: 5, description: '', link: '', taxonomy: 'post_tag' },
    { id: 107, name: 'Heritage', slug: 'heritage', count: 4, description: '', link: '', taxonomy: 'post_tag' },
    { id: 108, name: 'Design', slug: 'design', count: 3, description: '', link: '', taxonomy: 'post_tag' },
  ];

  try {
    const res = await fetchWP(`/wp/v2/tags?per_page=${limit}&orderby=count&order=desc`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const tags: WPTag[] = await res.json();
      if (tags && tags.length > 0) {
        const existingSlugs = new Set(tags.map((t) => t.slug.toLowerCase()));
        const merged = [...tags, ...editorialDefaults.filter((d) => !existingSlugs.has(d.slug))];
        return merged.slice(0, limit);
      }
    }
  } catch {
    // fallback
  }

  return editorialDefaults.slice(0, limit);
}
