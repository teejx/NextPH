# NextPH Architecture & System Design

## 1. System Overview

NextPH is a modern digital publication designed around a decoupled (headless) content architecture.

```text
Visitor (Mobile / Tablet / Desktop)
              │
              ▼ HTTPS
     Cloudflare Edge Network
     - Global Anycast CDN & DNS
     - WAF & DDoS Shielding
     - Edge Cache & Dynamic Compression
              │
              ▼
Next.js 15 Frontend (Cloudflare Workers / Node runtime)
     - App Router (React 19, Server Components)
     - Incremental Static Regeneration (2-min ISR)
     - Server-side HTML Sanitization (DOMPurify)
     - Responsive Media Optimization
              │
              ▼ REST API (HTTPS + Secrets Server-Side)
Headless WordPress CMS (PHP 8.3 + MariaDB 10.11)
     - Custom nextph-core Plugin
     - Gutenberg Editor & Media Library
     - Author Review Workflow (No direct publishing)
     - Instant Revalidation Webhook
```

## 2. Key Architecture Decisions

1. **Decoupled Frontend & Backend:**
   - Public traffic never directly hits the WordPress PHP origin; all reads are cached and routed via Next.js Server Components.
   - Prevents database connection exhaustion during high traffic spikes.

2. **Strict Editorial Roles & Security:**
   - Standard WordPress Author role allows `publish_posts` by default. `nextph-core` explicitly removes `publish_posts` from Authors, requiring review by Editors or Administrators.
   - Unpublished drafts are isolated behind a cryptographically strong preview secret; never served to public caches.

3. **Curated Trending System:**
   - Trending stories are explicitly flagged by editors using the `_nextph_is_trending` post meta flag.
   - Exposed via dedicated REST endpoint `GET /wp-json/nextph/v1/trending?limit=8`.
   - Prevents fabricated metrics and ensures journalistic curation.

4. **Honest Monetization & Newsletter Policies:**
   - Advertisement containers remain completely collapsed and load zero 3rd-party ad scripts while monetization is disabled (`NEXT_PUBLIC_ADS_ENABLED=false`).
   - Newsletter signup requires explicit consent, uses honeypot anti-bot protection, and in production fails closed without false success if no provider is configured.
