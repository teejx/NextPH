import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '../../../lib/wordpress/client';
import { searchRateLimit, getClientIp, rateLimitResponse } from '../../../lib/rate-limit';

export async function GET(req: NextRequest) {
  // Rate limit: 30 requests per minute per IP
  const ip = getClientIp(req);
  const rl = await searchRateLimit(ip);
  if (!rl.success) {
    return rateLimitResponse(rl, 'Search rate limit exceeded. Please wait a moment before searching again.');
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ articles: [] });
  }

  const { articles, totalArticles, totalPages } = await getArticles({
    search: q.trim(),
    perPage: 12,
  });

  return NextResponse.json(
    {
      articles,
      totalArticles,
      totalPages,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
