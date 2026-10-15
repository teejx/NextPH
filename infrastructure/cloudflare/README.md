# Cloudflare Workers Deployment Guide for NextPH Frontend

NextPH's frontend is designed for edge delivery on Cloudflare Workers using OpenNext / Next.js adapter.

## Deployment Architecture

```text
Visitor Browser
    │
    ▼ (HTTPS)
Cloudflare Edge Network (DNS, CDN, Caching, WAF)
    │
    ▼
Cloudflare Worker (Next.js SSR / ISR Runtime)
    │
    ▼ (REST API over HTTPS)
Self-hosted WordPress CMS (cms.nextph.example)
    │
    ▼
MariaDB / MySQL Database
```

## Setup & Secrets Configuration

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```

3. Set Server-Side Secrets (never expose in client bundles or Git):
   ```bash
   wrangler secret put REVALIDATION_SECRET
   wrangler secret put WORDPRESS_PREVIEW_SECRET
   wrangler secret put NEWSLETTER_API_KEY
   wrangler secret put NEWSLETTER_LIST_ID
   ```

4. Build and Deploy:
   ```bash
   cd frontend
   npx @opennextjs/cloudflare build
   npx wrangler deploy
   ```

## Production Verification Checklist

- [ ] Custom domain routed via Cloudflare DNS (e.g. `nextph.ph` or `nextph.example`).
- [ ] SSL/TLS set to "Full (strict)".
- [ ] Edge cache rules configured to bypass `/api/*` and preview routes.
- [ ] Webhook revalidation endpoint tested with WordPress publish actions.
- [ ] Zero secrets found in public JavaScript bundles.
