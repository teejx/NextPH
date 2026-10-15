# NextPH — Modern Filipino Digital Magazine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-green?style=flat&logo=vitest)](https://vitest.dev/)

NextPH is a modern digital publication covering technology breakthroughs, archipelago travel, contemporary lifestyle, and curated trending stories across the Philippines.

Built with a decoupled headless architecture featuring a **Next.js 15 (React 19, TypeScript, Tailwind CSS v4)** frontend designed for edge delivery on **Cloudflare Workers**, backed by a separately hosted **WordPress (PHP 8.3 + MariaDB 10.11)** headless content management system.

GitHub Repository: [https://github.com/teejx/NextPH](https://github.com/teejx/NextPH)

---

## Key Features

- **Editorial Homepage:** Hero lead story, editorially curated trending section, latest dispatches, and category feeds.
- **Section & Archive Pages:** Dedicated hubs for Tech & Telecom, Archipelago Travel, Contemporary Lifestyle, Trending Stories, and Tag topics with responsive grids.
- **Story Detail Experience:** Rich editorial presentation with reading times, bylines, update timestamps, photo credits, sanitized block content, YouTube/Vimeo video embeds, tag pills, and Web Share API / Copy Link buttons.
- **Search System:** Search interface with debounced queries, live query updates, loading skeletons, and empty state handling.
- **Newsletter Integration ("The Next Dispatch"):** Server-side provider adapter with honeypot bot defense, consent validation, and production fail-closed security.
- **Disabled Ad Placeholders:** Monetization components are present in layout but strictly disabled by default (`NEXT_PUBLIC_ADS_ENABLED=false`), loading zero tracking scripts or external network calls.
- **Editorial Roles & Security:** Custom `nextph-core` WordPress plugin removes publishing capabilities from Authors (requiring editorial review) and exposes editor-controlled trending/featured flags to REST.
- **Instant Edge Revalidation:** Webhook invalidates Next.js ISR caches on post publish, update, or unpublish events.
- **SEO & Social Sharing:** Dynamic Open Graph metadata, Twitter Cards, Schema.org `NewsArticle` JSON-LD structured data, XML sitemaps, and robots.txt.
- **Accessibility & Design Standards:** WCAG 2.1 AA contrast compliance, keyboard focus rings, semantic HTML landmarks, and skip-to-content navigation.

---

## Repository Structure

```text
NextPH/
├── frontend/                          # Next.js 15 App Router website
│   ├── app/                           # App Router routes & API endpoints
│   │   ├── (categories)/              # /tech, /travel, /lifestyle, /trending
│   │   ├── story/[slug]/              # Article detail route with JSON-LD
│   │   ├── search/                    # Search interface wrapped in Suspense
│   │   ├── tag/[slug]/                # Tag archives
│   │   ├── api/newsletter/            # Server-side newsletter provider adapter
│   │   ├── api/revalidate/            # Cache invalidation webhook
│   │   ├── api/search/                # Archive search endpoint
│   │   ├── about/, contact/, ...      # Informational and policy pages
│   │   ├── sitemap.ts, robots.ts      # Automated SEO discovery
│   │   ├── layout.tsx, not-found.tsx  # Editorial shell, skip-to-content, 404
│   │   └── error.tsx                  # Client error boundary
│   ├── components/                    # Header, Footer, StoryCard, TrendingSection, AdSlot...
│   ├── lib/wordpress/                 # Typed REST client, HTML sanitization, fixtures
│   ├── styles/                        # Tailwind CSS v4 globals & design tokens
│   ├── tests/                         # Vitest unit tests & Playwright e2e specs
│   ├── playwright.config.ts           # Multi-device viewport testing matrix
│   ├── vitest.config.ts               # Unit test configuration
│   └── .env.example                   # Harmless configuration placeholders
├── backend/                           # WordPress backend extension
│   ├── wordpress/wp-content/plugins/
│   │   └── nextph-core/               # Custom plugin: trending/featured flags, roles, webhook
│   └── local/                         # Docker Compose local WordPress + MariaDB environment
├── infrastructure/
│   ├── cloudflare/                    # Wrangler configuration & deployment guides
│   └── scripts/                       # Database backup & disaster recovery helpers
├── docs/                              # Architecture & runbooks
├── PRODUCT.md                         # Durable product specification & principles
├── DESIGN.md                          # Visual design tokens & editorial typography system
├── LICENSE                            # MIT License
└── README.md
```

---

## Quick Start (Frontend)

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```

2. **Copy environment configuration:**
   ```bash
   cp .env.example .env.local
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser. (The app will automatically use clearly identified sample fixtures if the WordPress REST API is not yet running).

5. **Run test suites:**
   ```bash
   npm run type-check   # Validate TypeScript types (tsc --noEmit)
   npm test             # Run Vitest unit & integration tests
   npm run build        # Verify production build & route optimization
   ```

---

## WordPress CMS Backend

In production, WordPress runs on a separate PHP 8.3 / MariaDB host with HTTPS.

### Local Development via Docker Compose:
A pre-configured Docker Compose environment is provided in `backend/local/`:
```bash
cd backend/local
docker compose up -d
```
Access WordPress at `http://localhost:8080` and activate the **NextPH Core** plugin mounted in `/wp-content/plugins/nextph-core`.

### Publishing Roles:
| Role | Capabilities |
|---|---|
| **Administrator** | Full site configuration, user management, and plugins |
| **Editor** | Review, edit, schedule, and publish all posts and manage categories/tags |
| **Author** | Draft and edit own articles, upload media; **cannot publish directly** |

---

## Environment Variables

| Variable | Target | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Frontend Public | Canonical public origin (e.g. `https://nextph.example`) |
| `WORDPRESS_API_URL` | Frontend Server | WordPress REST API base URL |
| `WORDPRESS_PREVIEW_SECRET` | Secret Store | Token used to validate unpublished story drafts |
| `REVALIDATION_SECRET` | Secret Store | Webhook secret for instant cache purging on publish |
| `NEWSLETTER_PROVIDER` | Frontend Server | Provider adapter (`mock`, `buttondown`, `mailchimp`, `convertkit`) |
| `NEWSLETTER_API_KEY` | Secret Store | Provider API key (server-side only, never `NEXT_PUBLIC_`) |
| `NEWSLETTER_LIST_ID` | Secret Store | Provider audience/list identifier |
| `NEXT_PUBLIC_ADS_ENABLED` | Frontend Public | Ad slots toggle (defaults to `false`) |

---

## License

This project is licensed under the [MIT License](LICENSE).
