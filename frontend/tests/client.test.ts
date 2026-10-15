import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeVideoEmbedUrl, transformWPPost } from '../lib/wordpress/client';
import { WPPostRaw } from '../lib/wordpress/types';

describe('WordPress Client Data Utilities', () => {
  describe('sanitizeHtml', () => {
    it('removes malicious script tags and inline handlers', () => {
      const malicious = '<p>Normal text</p><script>alert("xss")</script><img src="x" onerror="alert(1)">';
      const clean = sanitizeHtml(malicious);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('onerror');
      expect(clean).toContain('<p>Normal text</p>');
    });

    it('preserves valid editorial markup and block elements', () => {
      const valid = '<h2>Editorial Header</h2><p>Paragraph with <strong>bold</strong> and <em>italic</em>.</p><blockquote>Quote</blockquote>';
      const clean = sanitizeHtml(valid);
      expect(clean).toBe(valid);
    });
  });

  describe('sanitizeVideoEmbedUrl', () => {
    it('safely converts standard YouTube watch URLs to privacy-enhanced embed URLs', () => {
      const ytUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const embed = sanitizeVideoEmbedUrl(ytUrl);
      expect(embed).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    });

    it('safely converts youtu.be short URLs', () => {
      const shortYt = 'https://youtu.be/dQw4w9WgXcQ';
      const embed = sanitizeVideoEmbedUrl(shortYt);
      expect(embed).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    });

    it('safely converts Vimeo URLs', () => {
      const vimeoUrl = 'https://vimeo.com/76979871';
      const embed = sanitizeVideoEmbedUrl(vimeoUrl);
      expect(embed).toBe('https://player.vimeo.com/video/76979871');
    });

    it('rejects untrusted domains and arbitrary URLs', () => {
      const untrusted = 'https://sketchy-site.example/video.mp4';
      const embed = sanitizeVideoEmbedUrl(untrusted);
      expect(embed).toBeNull();
    });
  });

  describe('transformWPPost', () => {
    it('correctly maps raw WordPress post fields to normalized Article format', () => {
      const rawPost: WPPostRaw = {
        id: 42,
        date: '2026-10-15T09:00:00Z',
        modified: '2026-10-15T10:00:00Z',
        slug: 'test-article-slug',
        status: 'publish',
        type: 'post',
        link: 'https://cms.nextph.example/test-article-slug',
        title: { rendered: 'Test Editorial Title' },
        content: { rendered: '<p>Test editorial body content with multiple words.</p>' },
        excerpt: { rendered: '<p>Test excerpt summary.</p>' },
        author: 1,
        featured_media: 10,
        categories: [101],
        tags: [201],
        meta: {
          _nextph_is_featured: true,
          _nextph_is_trending: true,
        },
        _embedded: {
          author: [
            {
              id: 1,
              name: 'Maria Santos',
              url: '',
              description: 'Tech journalist',
              link: '',
              slug: 'maria-santos',
            },
          ],
          'wp:featuredmedia': [
            {
              id: 10,
              date: '2026-10-15T09:00:00Z',
              source_url: 'https://cms.nextph.example/wp-content/uploads/hero.jpg',
              alt_text: 'Hero photo',
            },
          ],
          'wp:term': [
            [
              {
                id: 101,
                name: 'Tech',
                slug: 'tech',
                count: 5,
                description: '',
                link: '',
                taxonomy: 'category',
                parent: 0,
              },
            ],
            [
              {
                id: 201,
                name: 'Fintech',
                slug: 'fintech',
                count: 3,
                description: '',
                link: '',
                taxonomy: 'post_tag',
              },
            ],
          ],
        },
      };

      const article = transformWPPost(rawPost);
      expect(article.id).toBe('42');
      expect(article.title).toBe('Test Editorial Title');
      expect(article.slug).toBe('test-article-slug');
      expect(article.excerpt).toBe('Test excerpt summary.');
      expect(article.category.name).toBe('Tech');
      expect(article.author.name).toBe('Maria Santos');
      expect(article.isFeatured).toBe(true);
      expect(article.isTrending).toBe(true);
    });
  });
});
