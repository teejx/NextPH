import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '../../../lib/wordpress/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ articles: [] });
  }

  const { articles, totalArticles, totalPages } = await getArticles({
    search: q.trim(),
    perPage: 12,
  });

  return NextResponse.json({
    articles,
    totalArticles,
    totalPages,
  });
}
