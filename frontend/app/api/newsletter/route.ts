import { NextRequest, NextResponse } from 'next/server';

interface NewsletterRequestBody {
  email?: string;
  consent?: boolean;
  honeypot?: string; // Bot protection field (should be empty)
}

export async function POST(req: NextRequest) {
  try {
    const body: NewsletterRequestBody = await req.json();
    const { email, consent, honeypot } = body;

    // 1. Bot protection: if honeypot is filled, silently discard or reject
    if (honeypot) {
      return NextResponse.json({ error: 'Invalid submission detected.' }, { status: 400 });
    }

    // 2. Validate email format
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 422 });
    }

    // 3. Require explicit consent
    if (!consent) {
      return NextResponse.json({ error: 'You must agree to receive editorial dispatches and accept our privacy policy.' }, { status: 422 });
    }

    const provider = process.env.NEWSLETTER_PROVIDER || (process.env.NODE_ENV === 'production' ? '' : 'mock');
    const apiKey = process.env.NEWSLETTER_API_KEY;
    const listId = process.env.NEWSLETTER_LIST_ID;

    // 4. In development or test, mock adapter is allowed
    if (provider === 'mock') {
      return NextResponse.json({
        success: true,
        message: 'Thank you for subscribing to The Next Dispatch. (Development Mock: No email sent).',
      });
    }

    // 5. Production check: Never report success if provider is unconfigured or credentials missing
    if (!provider || !apiKey || !listId || apiKey === 'placeholder_api_key_server_only') {
      console.error('[Newsletter Service] Production configuration error: Missing provider or API credentials.');
      return NextResponse.json(
        {
          error: 'Newsletter subscription service is currently unavailable. Please try again later or contact the editorial desk.',
        },
        { status: 503 }
      );
    }

    // Example Buttondown provider adapter implementation
    if (provider === 'buttondown') {
      const response = await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          tags: ['nextph-web'],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Newsletter Provider Error]', errorData);
        return NextResponse.json({ error: 'Unable to process subscription with provider.' }, { status: 502 });
      }

      return NextResponse.json({
        success: true,
        message: 'Please check your inbox to confirm your subscription to The Next Dispatch.',
      });
    }

    // Unrecognized provider
    return NextResponse.json(
      { error: `Configured provider "${provider}" is not supported.` },
      { status: 500 }
    );
  } catch (error) {
    console.error('[Newsletter Error]', error);
    return NextResponse.json({ error: 'An unexpected error occurred while processing your request.' }, { status: 500 });
  }
}
