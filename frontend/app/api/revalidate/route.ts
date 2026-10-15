import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('X-Revalidate-Secret');
    const configuredSecret = process.env.REVALIDATION_SECRET;

    if (!configuredSecret || secret !== configuredSecret) {
      return NextResponse.json({ error: 'Unauthorized webhook request.' }, { status: 401 });
    }

    const payload = await req.json().catch(() => ({}));
    const { slug } = payload;

    // Invalidate homepage, trending, and category listings
    revalidatePath('/');
    revalidatePath('/trending');
    revalidatePath('/tech');
    revalidatePath('/travel');
    revalidatePath('/lifestyle');

    if (slug) {
      revalidatePath(`/story/${slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      slug: slug || 'all',
    });
  } catch (error) {
    console.error('[Revalidate Webhook Error]', error);
    return NextResponse.json({ error: 'Revalidation failed.' }, { status: 500 });
  }
}
