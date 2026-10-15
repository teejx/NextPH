export interface WPPostRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: 'news' | 'tech' | 'travel' | 'lifestyle' | string;
  taxonomy: string;
  parent: number;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls?: Record<string, string>;
}

export interface WPMediaItem {
  id: number;
  date: string;
  source_url: string;
  alt_text: string;
  media_details?: {
    width: number;
    height: number;
    file: string;
    sizes?: Record<string, { source_url: string; width: number; height: number }>;
  };
}

export interface WPPostRaw {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'future' | 'private';
  type: string;
  link: string;
  title: WPPostRendered;
  content: WPPostRendered;
  excerpt: WPPostRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  meta?: {
    _nextph_is_featured?: boolean;
    _nextph_is_trending?: boolean;
    [key: string]: unknown;
  };
  _embedded?: {
    author?: WPAuthor[];
    'wp:featuredmedia'?: WPMediaItem[];
    'wp:term'?: Array<Array<WPCategory | WPTag>>;
  };
}

/**
 * Normalized Article structure for NextPH frontend components.
 */
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  author: {
    id: number;
    name: string;
    slug: string;
    avatarUrl?: string;
    bio?: string;
  };
  featuredImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  isFeatured?: boolean;
  isTrending?: boolean;
  videoEmbedUrl?: string | null;
}

export interface PaginatedArticles {
  articles: Article[];
  totalPages: number;
  totalArticles: number;
  currentPage: number;
}
