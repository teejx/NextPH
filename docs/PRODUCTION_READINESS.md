# NextPH Production Readiness & Deployment Audit

**Current Branch:** `dev`  
**Target Production Architecture:** Cloudflare Workers (Frontend) + Dedicated PHP 8.3 / MariaDB 10.11 Host (Headless WordPress CMS)

---

## 1. Audit Summary: Is NextPH Production-Ready?

| Layer | Status | Notes |
|---|---|---|
| **Frontend Codebase** | ✅ **Ready** | Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4. Verified with `npm run build` and `npm run type-check`. |
| **Design System** | ✅ **Ready** | "Modern Archipelago Editorial" identity verified with Impeccable mechanical detector (0 defects). WCAG 2.1 AA accessible. |
| **Content Model & API** | ✅ **Ready** | Typed REST client, edge-safe HTML sanitization, YouTube/Vimeo embed validator, fallback fixtures, HTML entity decoder. |
| **Headless CMS Plugin** | ✅ **Ready** | `nextph-core` plugin handles trending/featured flags, strips Author publish permissions, creates default categories, adds sidebar meta box. |
| **SEO & Syndication** | ✅ **Ready** | NewsArticle JSON-LD structured data, Open Graph cards, dynamic sitemap (`/sitemap.xml`), robots.txt, and RSS 2.0 feed (`/feed.xml`). |
| **Testing** | ✅ **Ready** | 15 passing Vitest unit/integration tests; Playwright matrix for 360, 390, 768, 1024, and 1440 px viewports. |
| **Cloudflare Deployment** | ⏳ **Prerequisite** | Requires provisioning Cloudflare Worker secrets and executing `wrangler deploy`. |
| **Live Hosting Origin** | ⏳ **Prerequisite** | Requires a live PHP/MariaDB WordPress host and production domain (e.g. `nextph.ph`). |
| **Newsletter Provider** | ⏳ **Prerequisite** | Requires live API key from chosen provider (e.g. Buttondown). Fails closed safely until configured. |

---

## 2. Verified Technical Capabilities

1. **Edge-Safe Architecture:**
   - Zero Node filesystem or jsdom dependencies in the frontend bundle.
   - Total initial JavaScript payload is only **103 kB**.
   - Server-side rendering (SSR) and Incremental Static Regeneration (2-minute ISR).

2. **Security & Role Boundaries:**
   - Author role cannot publish directly; all posts require review and publication by Editors or Administrators.
   - Unpublished drafts are protected behind server secrets and bypass public caches.
   - No database credentials or secret API keys exist in client bundles or public repositories.

3. **Monetization & Newsletter Integrity:**
   - Ad placements remain completely hidden without reserving empty blank space while `NEXT_PUBLIC_ADS_ENABLED=false`.
   - Newsletter includes honeypot anti-bot protection, requires explicit privacy policy consent, and never reports false success in production.

---

## 3. Pre-Flight Launch Checklist (Before flipping to Production)

- [ ] **WordPress Staging / Production Host:**
  - Provision PHP 8.3+ host with HTTPS.
  - Install WordPress 6.7+.
  - Upload and activate `nextph-core` plugin from `backend/wordpress/wp-content/plugins/nextph-core`.
  - Set permalink structure to **Post name** (`/%postname%/`).
- [ ] **DNS & Edge Routing:**
  - Route apex domain `nextph.ph` (or chosen domain) to Cloudflare.
  - Route CMS subdomain `cms.nextph.ph` to WordPress host.
  - Enable Cloudflare SSL/TLS "Full (Strict)".
- [ ] **Cloudflare Worker Secrets:**
  ```bash
  wrangler secret put REVALIDATION_SECRET
  wrangler secret put WORDPRESS_PREVIEW_SECRET
  wrangler secret put NEWSLETTER_API_KEY
  wrangler secret put NEWSLETTER_LIST_ID
  ```
- [ ] **Database & Media Backups:**
  - Install `infrastructure/scripts/backup.sh` as a daily cron job.
  - Test restoration rehearsal with `infrastructure/scripts/restore.sh`.
