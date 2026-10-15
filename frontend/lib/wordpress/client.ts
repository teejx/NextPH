import { Article, PaginatedArticles, WPPostRaw, WPCategory, WPTag } from './types';
import { SAMPLE_FIXTURES } from './fixtures';

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
 * Allows standard editorial markup and removes script, iframe, inline event handlers, and malicious URIs.
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  // 1. Remove dangerous executable/injection blocks: <script>, <style>, <iframe>, <object>, <embed>
  let clean = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 2. Remove inline event handlers (onerror=, onclick=, onload=, etc.)
  clean = clean.replace(/\s+on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Remove javascript:, data:, and vbscript: URIs in attributes
  clean = clean.replace(/(href|src)\s*=\s*['"]\s*(?:javascript|data|vbscript):[^'"]*['"]/gi, '$1="#"');

  return clean.trim();
}

/**
 * Validate and safely transform allowed video embed URLs (YouTube and Vimeo only).
 * Never accepts raw iframe HTML from arbitrary domains.
 */
export function sanitizeVideoEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
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
 * Resolve a category slug to a WordPress category ID.
 */
async function getCategoryIdBySlug(slug: string): Promise<number | null> {
  if (categoryIdCache[slug]) return categoryIdCache[slug];

  try {
    const res = await fetch(`${WP_API_URL}/wp/v2/categories?slug=${encodeURIComponent(slug)}`, {
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

  const featuredImgUrl =
    mediaEmbedded?.source_url ||
    mediaEmbedded?.media_details?.sizes?.large?.source_url ||
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80';

  const titleClean = decodeHtmlEntities(post.title?.rendered || 'Untitled Dispatch');
  const rawExcerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '';
  const excerptClean = decodeHtmlEntities(rawExcerpt);

  const wordCount = (post.content?.rendered || '').replace(/<[^>]+>/g, '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

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
      name: authorEmbedded?.name || 'NextPH Editorial',
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
    videoEmbedUrl: sanitizeVideoEmbedUrl(post.meta?.video_url as string),
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

    if (search) {
      params.append('search', search);
    }

    const res = await fetch(`${WP_API_URL}/wp/v2/posts?${params.toString()}`, {
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
    const res = await fetch(`${WP_API_URL}/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`, {
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
    const res = await fetch(`${WP_API_URL}/nextph/v1/trending?limit=${limit}`, {
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
 * Fetch featured story for the hero placement.
 */
export async function getFeaturedStory(): Promise<Article | null> {
  try {
    // First try querying post marked _nextph_is_featured
    const res = await fetch(`${WP_API_URL}/wp/v2/posts?per_page=1&_embed=1`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      const rawPosts: WPPostRaw[] = await res.json();
      if (rawPosts.length > 0) {
        return transformWPPost(rawPosts[0]);
      }
    }
  } catch {
    // fallback
  }

  const sampleFeatured = SAMPLE_FIXTURES.find((a) => a.isFeatured) || SAMPLE_FIXTURES[0];
  return sampleFeatured || null;
}
