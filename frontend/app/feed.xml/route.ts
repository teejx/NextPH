import { NextResponse } from 'next/server';
import { getArticles } from '../../lib/wordpress/client';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { articles } = await getArticles({ perPage: 25 });

  const rssItems = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/story/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/story/${article.slug}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <category>${article.category.name}</category>
      <dc:creator><![CDATA[${article.author.name}]]></dc:creator>
    </item>`
    )
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NextPH — Modern Filipino Digital Magazine</title>
    <link>${siteUrl}</link>
    <description>Curated stories in technology breakthroughs, archipelago journeys, and contemporary culture from the Philippines.</description>
    <language>en-PH</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
