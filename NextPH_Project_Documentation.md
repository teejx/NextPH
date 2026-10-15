# NextPH

## Website Project Documentation & Technical Specification

*Version 1.1  |  16 October 2026  |  Build-ready specification*

A responsive, media-rich editorial website for technology, travel, lifestyle, and trending stories. The frontend and backend will be maintained in separate folders and deployed as separate services.

| Layer | Recommendation |
| --- | --- |
| Frontend | Next.js (React + TypeScript), deployed to Cloudflare Workers |
| CMS / backend | Self-hosted WordPress on a PHP-compatible host; use the WordPress REST API |
| Database | MySQL/MariaDB included with WordPress hosting; no separate database at launch |
| Media | WordPress Media Library for images/GIFs; responsive embeds for trusted video providers; optional R2 offload later |

---

# Document Contents

- 1. Executive Summary
- 2. Goals, Scope, and Non-Goals
- 3. Recommended Architecture
- 4. Technology Stack and Key Decisions
- 5. Functional Requirements
- 6. WordPress Content Model and API
- 7. Media Upload and Delivery
- 8. Repository and Folder Structure
- 9. Database and Cost Strategy
- 10. Performance, Traffic Readiness, Security, and SEO
- 11. MCP Recommendations
- 12. Implementation Roadmap
- 13. Acceptance Criteria
- 14. Deployment and Operations Checklist
- 15. Risks and Mitigations
- 16. AI Coding-Agent Handoff
- 17. Official References
---

# 1. Executive Summary

NextPH is a digital editorial publication covering technology, travel, lifestyle, and trending stories. Visitors should be able to browse a featured homepage, explore topic sections, search articles, open shareable article pages, and consume image, GIF, and video content on desktop, tablet, and mobile devices.

The recommended design is a headless CMS architecture: WordPress is the publishing and administration backend, while a separate Next.js application renders the public website. Administrators, Editors, and Authors work in the WordPress dashboard; the frontend reads public published content through the WordPress REST API. This avoids building a CMS from scratch and keeps frontend presentation independent of editorial tools.

For a content-heavy site, SEO and social sharing are important. Use Next.js, a React framework, rather than a client-only React SPA as the default. Server rendering and static generation can deliver article content and metadata more reliably to search crawlers and social link previews. Deploy the frontend to Cloudflare Workers after validating the chosen Next.js deployment adapter against the features the site uses. Cloudflare currently documents vinext as its preferred route for new Next.js apps, but identifies it as beta; validate it in staging before production and do not adopt a beta path without a compatibility check [1].

WordPress itself still needs a PHP-compatible hosting environment and a MySQL/MariaDB database. Cloudflare is the frontend/runtime, DNS, CDN, and security layer; it does not remove the need for a normal WordPress host. Start with the database included in that hosting plan. Add Cloudflare D1 only if a separate feature later needs its own small application database; D1 is SQLite-based and does not replace WordPress MySQL/MariaDB. [3, 9]

# 2. Goals, Scope, and Non-Goals

## Goals

- Publish timely editorial content under Tech, Travel, and Lifestyle categories, plus a curated Trending Stories section.
- Give administrators, editors, and authors a reliable WordPress editorial workflow for drafts, revisions, scheduling, categories, featured media, and publication review.
- Support images and animated GIFs uploaded through WordPress, plus embedded videos from trusted providers. Direct video uploads and self-hosted video delivery are out of scope for v1.
- Provide a polished, responsive reading experience across small phones, large phones, tablets, laptops, and wide desktop displays.
- Protect editorial access and credentials, make pages fast for visitors, and preserve content through backups.
- Keep frontend source code and custom backend code in separate folders within one repository, while deploying them independently.
## Initial scope

- Public homepage, topic archive pages, story/article pages, search results, and static pages such as About and Contact.
- WordPress admin for content management, media library, user roles, and editorial workflow.
- SEO metadata, sitemap, canonical URLs, Open Graph previews, accessible page structure, analytics, and error monitoring.
- Caching, security settings, backups, deployment environments, and basic load/performance tests before launch.
## Non-goals for the first release

- Building a custom React admin dashboard that duplicates WordPress admin. Use /wp-admin at launch.
- A user accounts, comments, or community system unless a product decision explicitly adds them.
- A standalone database for articles. WordPress already owns the editorial data and its database.
- Self-hosting large video files on a low-cost shared WordPress disk as the default delivery strategy.
# 3. Recommended Architecture

The following diagram describes the intended separation. The frontend and WordPress backend are separate deployable services; the repository merely keeps their source and deployment files organized together.

```text
Visitor browser
    |
    v
Cloudflare edge / DNS / caching / WAF
    |
    v
Frontend: Next.js (React + TypeScript) on Cloudflare Workers
    |
    | public content requests over HTTPS
    v
WordPress REST API on a PHP-compatible host (cms.nextph.example)
    |
    v
MySQL or MariaDB supplied by the WordPress host

WordPress admin (/wp-admin)
    |-- article text, categories, authors, publish status
    |-- images and GIFs -> WordPress Media Library / optional R2 integration
    |-- videos -> trusted YouTube/Vimeo embeds via WordPress oEmbed
```

## Service responsibilities

| Service | Responsibility | Notes |
| --- | --- | --- |
| Cloudflare Workers | Render and deliver the React/Next.js public website | Use server-side rendering or static generation where appropriate; validate the deployment adapter. |
| WordPress host | Run WordPress, plugins, REST API, and /wp-admin | Must support current WordPress PHP/database requirements, HTTPS, backups, and uploads. |
| MySQL/MariaDB | Store posts, terms, user records, plugin data, and settings | Use the database included with WordPress hosting at first. |
| Cloudflare CDN/security | Cache public assets, protect the edge, manage DNS and TLS | Do not cache authenticated admin pages or private API responses indiscriminately. |
| Cloudflare R2 (optional later) | Offload suitable image/GIF objects if needed | Not required for v1; R2 is object storage, not the WordPress database. |

## Domain layout

Use a clear domain split, for example nextph.example for the public frontend and cms.nextph.example for WordPress. Replace the example domain after selecting and registering the real domain. The frontend fetches the public WordPress API over HTTPS. Restrict write actions to WordPress admin and server-side integrations; never put WordPress administrator credentials or application passwords in browser-delivered JavaScript.

# 4. Technology Stack and Key Decisions

| Area | Recommendation | Reason |
| --- | --- | --- |
| Frontend framework | Next.js with React and TypeScript | SEO-friendly rendering options, route-level metadata, and article-friendly URL structure. |
| UI / styling | Tailwind CSS v4 with accessible reusable components | Use one consistent styling system and shared design tokens; avoid mixing styling approaches without a reason. |
| Content backend | WordPress (self-hosted) as a headless CMS | Mature admin dashboard, media library, revisions, scheduling, user roles, and REST API. |
| API | WordPress REST API; custom endpoints only where needed | Avoid writing a second API layer unless a concrete requirement exists. |
| Hosting | Cloudflare Workers for the frontend; a separate PHP host for WordPress | Separates public delivery from the CMS runtime. |
| Version control | Git repository with frontend/backend folders; GitHub or equivalent remote | Traceable changes, review, issue tracking, and rollback. |
| Testing | Unit/component tests plus Playwright browser tests | Validate interactions, responsive layouts, and publishing-to-page behavior. |

Deployment note: Cloudflare currently recommends vinext for new Next.js applications on Workers but marks it beta. Scaffold with the official create-cloudflare CLI, run the documented compatibility check, and prove article rendering, metadata, WordPress API calls, image delivery, and cache refresh in staging. If a required feature is incompatible, use the documented OpenNext adapter path and rerun the same test suite [1, 2].

A static React SPA on Pages is a fallback only if the team accepts the SEO and routing trade-offs; Next.js server-rendered or statically generated article pages are the default for this publication.

# 5. Functional Requirements

## 5.0 Visual direction and layout

- Use an editorial-magazine visual language: prominent headlines, deliberate white space, a strong featured-story region, image-led cards, clear category labels, and restrained accent color.
- Use Tailwind CSS v4 for styling and accessible reusable UI primitives; shadcn/ui components may be used where they fit, but customize them so the result looks like an editorial publication rather than a generic SaaS dashboard.
- Recommended design tokens: warm off-white page background, near-black ink, neutral gray dividers, and one restrained red/coral accent; verify contrast and define colors as CSS variables.
- Use a readable sans-serif for interface/body text and a distinctive editorial display face for headlines; use responsive type scales, consistent spacing, and clear image aspect ratios.
- Header: NextPH wordmark, Home, Tech, Travel, Lifestyle, Trending, and accessible search. Desktop navigation is inline; mobile navigation becomes a keyboard-accessible menu.
- Homepage sequence: lead story/hero, trending strip or grid, latest stories, section feeds for Tech/Travel/Lifestyle, popular tags, newsletter signup, ad-slot placeholders hidden by default, and footer.
- Article layout: breadcrumb/category, headline, deck/excerpt, author/date row, hero media, body content, tags, social-share controls, related stories, newsletter module, disabled ad slots, and footer.
- Start mobile-first and verify at 360, 390, 768, 1024, and 1440 CSS pixels. Avoid horizontal overflow; maintain practical tap targets and responsive media.
## 5.1 Public website

- Editorial-magazine homepage with a lead/featured story, latest stories, a curated Trending Stories section, distinct Tech, Travel, and Lifestyle feeds, popular topics/tags, newsletter signup, and disabled ad placeholders.
- Public routes for Home, Tech, Travel, Lifestyle, Trending, Search, Article/Story, Tag archives, About, Contact, Privacy Policy, Editorial Policy, and Corrections.
- Article page with headline, summary/excerpt, author, publish/updated dates, category, hero image/GIF, body content, tag links, related stories, share controls, and social metadata.
- Search interface with debounced input, loading/error/no-results states, pagination, and keyboard-accessible controls.
- Social sharing using native share where supported plus accessible copy-link and share-link fallbacks; do not add tracking SDKs for sharing.
- Newsletter form with validation, consent notice, rate limiting, and double opt-in through a configured provider; do not show false success when production credentials are missing.
- Advertisement slot components exist for future use but are disabled by default. No ad network scripts, pixels, or monetized placements load in the initial release.
- Navigation remains usable at mobile widths with an accessible menu, visible keyboard focus, and correct semantic landmarks.
## 5.2 Admin and editorial workflow

- Use WordPress /wp-admin to create, edit, preview, schedule, publish, unpublish, and revise stories.
- Use three roles: Administrator (site settings, plugins, users, and all content); Editor (review, edit, publish, schedule, and manage stories/tags); Author (create/edit own stories and upload media but submit for review rather than publish directly). WordPress core Author permissions may allow publishing by default, so explicitly remove the relevant publish capabilities or create a reviewed custom role, and test capabilities server-side.
- Require a descriptive title, slug, category, excerpt, author, publication status, and appropriate featured media. Add custom fields only where WordPress core does not meet the need.
- Provide a secure preview route for drafts that validates a server-side secret, disables indexing, and bypasses public caches. Never expose draft content through anonymous endpoints.
- Refresh or invalidate public frontend caches after publish/update/unpublish events. The acceptance target is that published editorial changes are visible within two minutes.
- Keep WordPress as the admin interface. Do not build a separate React admin dashboard for the initial version.
## 5.3 Core story fields

| Field | Purpose |
| --- | --- |
| Title and slug | Readable headline and stable URL identifier. |
| Excerpt / summary | Homepage and section-card summary; fallback text should be generated only deliberately. |
| Body content | WordPress editor content; frontend should render supported blocks safely. |
| Categories and trending flag | Primary categories are Tech, Travel, and Lifestyle. Trending is a curated section/flag, not a required fourth post category. |
| Featured media | Main image or GIF for cards and article hero. Include meaningful alt text where applicable. |
| Video embed | A trusted provider URL or WordPress oEmbed block; allow YouTube and Vimeo initially. Never accept arbitrary iframe HTML. |
| Author and timestamps | Byline, publication date, updated date, and editorial attribution. |
| SEO fields | SEO title/description, canonical URL when required, and social-sharing image. |
| Status | Draft, pending review, scheduled/future, published, or private. Respect status in API queries. |

# 6. WordPress Content Model and API

Start with native WordPress posts and categories. Create Tech, Travel, and Lifestyle categories; implement Trending as an editor-controlled post meta flag exposed to REST by the nextph-core plugin, not as a required post category. Register any custom meta with a capability-aware permission callback and show_in_rest. The plugin should also provide a Featured toggle if needed for the homepage lead story.

## Useful REST endpoints

```text
GET  https://cms.nextph.example/wp-json/wp/v2/posts?categories={id}&_embed=1
GET  https://cms.nextph.example/wp-json/wp/v2/posts?search={term}&_embed=1
GET  https://cms.nextph.example/wp-json/wp/v2/posts?slug={slug}&_embed=1
GET  https://cms.nextph.example/wp-json/wp/v2/categories
GET  https://cms.nextph.example/wp-json/wp/v2/tags?orderby=count&order=desc&per_page=12
GET  https://cms.nextph.example/wp-json/wp/v2/media/{id}
GET  https://cms.nextph.example/wp-json/nextph/v1/trending?limit=8
POST https://nextph.example/api/newsletter
```

These are starting examples, not a complete API contract. Confirm category IDs, pagination, returned media shapes, embedded author/category records, and custom fields against the actual WordPress site. The WordPress REST API documents posts, categories, pages, media, search, and other resources [4, 5].

## API and cache rules

- Centralize API access in one frontend data-access module. Do not scatter raw fetch calls throughout components.
- Use typed response definitions and handle loading, empty, not-found, timeout, and API-error states.
- Use pagination parameters and request only the fields the UI needs where supported. Avoid fetching every story just to render one section.
- Cache only anonymous public content. Never let public cache keys serve drafts or previews; use no-store for preview responses and private/admin routes.
- Prefer server-side WordPress REST API calls from the Next.js/Worker runtime rather than direct browser-to-CMS calls. This avoids unnecessary CORS configuration and centralizes caching/error handling.
- Implement the public trending endpoint to return only published posts with the trending flag enabled, bounded limit (maximum 20), pagination-safe queries, and short-lived caching. If no posts are flagged, show a documented latest-stories fallback.
- Use bounded cache TTLs and, only after proving it works on the chosen Cloudflare runtime, a signed publish/update webhook for revalidation. Test publish, update, unpublish, and draft isolation.
- Treat REST response content as untrusted HTML: sanitize supported WordPress block markup on the server and allow only safe tags/attributes and trusted embed hosts.
# 7. Media Upload and Delivery

For the initial release, admins upload images and GIFs through the WordPress Media Library and embed videos from trusted third-party video providers. Avoid building direct video upload/hosting into v1; it adds service configuration and ongoing storage/delivery costs.

| Media type | Initial recommendation | Operational notes |
| --- | --- | --- |
| Images | WordPress Media Library | Generate/serve appropriate sizes; use modern formats where supported; keep editorial originals and add meaningful alt text. |
| Animated GIFs | WordPress Media Library for v1 | Set reasonable upload limits, set alt text where useful, lazy-load below-the-fold media, and avoid many large animations in the initial viewport. |
| Video | WordPress oEmbed / trusted provider embeds | Allow YouTube and Vimeo URLs initially. Render responsive embeds, lazy-load player frames, and never expose arbitrary raw iframe markup. No direct video uploads in v1. |
| Optional future media offload | Cloudflare R2 with a tested WordPress integration | R2 is object storage, not a relational database. Do not change media URLs or claim R2 support until upload, deletion, URL delivery, backup, and migration workflows have been tested [8]. |

## Video embed rules

1. Editor inserts a native WordPress Embed block or supplies a video URL from an allowed provider such as YouTube or Vimeo.
1. The frontend validates provider hostname and renders an accessible, responsive aspect-ratio container with lazy loading where supported.
1. Show a poster or placeholder before loading the remote player when possible to reduce initial page weight.
1. Reject unknown providers and never render arbitrary iframe HTML from a text field.
1. If direct uploads are requested in a later phase, evaluate a dedicated video service separately and update this specification before implementation.
Images and GIFs stay in the WordPress Media Library for v1. Cloudflare R2 offload is a later optimization, not a launch dependency; it requires an actual tested WordPress integration.

## Newsletter integration contract

- Build the signup UI and a server-side provider adapter, but do not hard-code provider credentials or provider-specific assumptions into client components.
- Use a development mock for automated tests. In production, fail closed with a clear configuration error if the provider is not configured; never report a subscription as complete when no provider accepted it.
- Require consent to receive email, show a link to the privacy policy, sanitize/validate input, add basic bot/rate-limit protection, and use the provider’s double-opt-in flow where supported.
- Store the provider key only as a server-side Cloudflare Worker secret or in the backend provider configuration. Do not put it in a NEXT_PUBLIC_ variable.
- Pick and configure the real newsletter service before launch; verify subscribe, confirmation, duplicate submission, unsubscribe, provider error, and privacy/data deletion flows.
# 8. Repository and Folder Structure

Keep frontend source and backend custom code clearly separate. Do not commit WordPress core, user uploads, database dumps, live secrets, or generated dependency folders into the application repository. Install WordPress through the host or a controlled local development environment, then version only the custom plugin/theme code and configuration that the team owns.

```text
nextph/
├── frontend/                         # Public Next.js / React website
│   ├── app/                           # Routes, layouts, metadata, loading/error states
│   │   ├── page.tsx                   # Homepage
│   │   ├── tech/
│   │   ├── travel/
│   │   ├── lifestyle/
│   │   ├── trending/
│   │   ├── story/[slug]/              # Article routes
│   │   ├── search/
│   │   ├── tag/[slug]/
│   │   ├── api/newsletter/route.ts    # Server-side newsletter provider adapter
│   │   ├── about/
│   │   ├── contact/
│   │   ├── privacy-policy/
│   │   ├── editorial-policy/
│   │   ├── corrections/
│   │   └── not-found.tsx
│   ├── components/                    # Navigation, cards, media, pagination, footer
│   ├── features/                      # Section/story-focused UI and logic
│   ├── lib/wordpress/                 # Typed REST client, queries, cache/revalidation
│   ├── styles/                        # Global tokens and shared styles (if needed)
│   ├── tests/                         # Frontend tests
│   ├── public/                        # Small static assets only
│   ├── .env.example
│   └── package.json
├── backend/                           # Custom code that extends WordPress
│   ├── wordpress/
│   │   └── wp-content/
│   │       ├── plugins/
│   │       │   └── nextph-core/        # Trending/featured meta, safe API endpoints, roles, cache webhook
│   │       └── mu-plugins/             # Optional site-wide code, used sparingly
│   └── local/                          # Optional local WordPress + MariaDB Compose setup
├── infrastructure/
│   ├── cloudflare/                    # Worker config, bindings, deployment notes
│   └── scripts/                       # Safe setup, backup, and release helpers
├── docs/                              # Architecture, runbook, API notes
├── .gitignore
└── README.md
```

The tree is a logical starting point; exact route and config files depend on the selected Next.js deployment path. Keep a separate frontend package.json. If custom WordPress code has Composer dependencies, add a backend/wordpress/composer.json. Keep the actual WordPress site directory and uploads outside Git unless there is a tightly controlled deployment reason to do otherwise.

## Environment variables

| Variable example | Where it belongs | Rule |
| --- | --- | --- |
| NEXT_PUBLIC_SITE_URL | Frontend public configuration | Canonical public origin only; safe to expose. |
| WORDPRESS_API_URL | Frontend server runtime | CMS REST API base URL. No WordPress credentials for public reads. |
| WORDPRESS_PREVIEW_SECRET | Frontend/Worker secret store | Optional; server-only, used to validate unpublished story previews. |
| NEWSLETTER_PROVIDER | Frontend/Worker runtime config | Use a provider adapter; development can use a mock, production must have a configured provider. |
| NEWSLETTER_API_KEY / NEWSLETTER_LIST_ID | Frontend/Worker secret store | Server-side only. Never prefix with NEXT_PUBLIC_. |
| NEXT_PUBLIC_ADS_ENABLED | Frontend public configuration | Set false for initial launch; no ad scripts should load. |
| Cloudflare API token | Cloudflare deployment secret store | Use scoped permissions and different staging/production credentials. |

Commit a .env.example containing names and harmless placeholders only. Put real secrets in the hosting platform’s secret manager or environment settings. Rotate any credential that is accidentally committed.

# 9. Database and Cost Strategy

## Primary recommendation: included MySQL/MariaDB

The cheapest sensible database for the initial NextPH build is the MySQL or MariaDB database included with the WordPress hosting plan. WordPress relies on a supported relational database for its posts, terms, users, settings, plugins, and metadata. Paying for another database to duplicate this information adds cost and operational complexity without a clear benefit. [4]

## When to consider Cloudflare D1

Cloudflare D1 is a serverless database based on SQLite. It can support separate custom app features if needed, but it is not a drop-in replacement for the MySQL/MariaDB database required by standard WordPress. Do not add D1 for the initial release; it would duplicate complexity without a stated requirement [9].

## Cost priorities

- Choose a PHP/WordPress host that includes a database, HTTPS, backup capability, and enough storage. Confirm resource limits, upload limits, CPU limits, and renewal price before choosing the cheapest advertised introductory plan.
- Use Cloudflare edge features where they fit, but budget for Workers usage, newsletter delivery, backups, and any optional media services.
- Keep images and GIFs in WordPress media initially; consider R2 only if storage/delivery economics or growth justify the additional integration work.
- Avoid adding Supabase, Firebase, or D1 merely because they have free tiers. Add another data service only when a concrete feature requires it.
# 10. Performance, Traffic Readiness, Security, and SEO

## Performance and traffic

- Serve public frontend code and static assets through Cloudflare; use immutable cache headers for versioned assets.
- Enable server-side rendering or static generation where appropriate, and cache public published article/category responses with a revalidation strategy.
- Optimize media sizes; generate responsive image sources; lazy-load below-the-fold images and video players; reserve width/height or aspect ratios to reduce layout shift.
- Use pagination and bounded query sizes rather than returning the entire archive on each request.
- Measure Core Web Vitals on representative mobile devices and slower connections. Test article pages with the heaviest permitted image/GIF/embed combination.
- Set hosting alerts for WordPress CPU, memory, disk, database, errors, and uptime where available. A CDN cannot fix an overloaded origin or a slow uncached API.
## Security

- Enforce HTTPS on both the public website and WordPress host; keep WordPress core, plugins, and PHP runtime updated.
- Use strong unique admin credentials, two-factor authentication where supported, and separate administrator/editor accounts. Remove unused accounts and plugins.
- Use least-privilege roles and capability checks for all custom WordPress abilities/endpoints. Validate and sanitize inputs; escape output; protect upload flows against abuse.
- Do not place WordPress application passwords, newsletter provider keys, database credentials, or Cloudflare API tokens in frontend code or public Git.
- Apply rate limits or bot protection to sensitive endpoints and login routes. Do not cache /wp-admin, authenticated APIs, previews, or draft responses as public content.
- Keep staging and production separate. Do not let AI/MCP tools change production content or infrastructure without explicit permission and review.
## SEO and accessibility

- Use readable article slugs, unique titles and meta descriptions, canonical URLs, XML sitemap, robots.txt, and Open Graph/Twitter-style social metadata.
- Add Article or NewsArticle structured data only when values are accurate and visibly represented on the page.
- Use semantic landmarks, heading levels in order, keyboard focus, contrast checks, labelled controls, and meaningful alt text.
- Use a clear date/byline policy. Distinguish publication date from last-updated date; never expose drafts as indexable articles.
- Test share previews for articles with and without a featured image, and handle deleted/renamed slugs with appropriate redirects when needed.
## Backups and recovery

Schedule automated database and media backups with retention (for example, daily backups with a reasonable rolling window), keep a copy outside the primary WordPress host, and test a restoration before launch. A backup is not proven until a restore has succeeded. Record how to restore WordPress, media, custom plugin code, DNS, and frontend deployment.

# 11. MCP Recommendations

MCP servers are development/operations helpers, not part of the website runtime. Since the coding tool is not decided yet, select the editor/agent first and then add compatible MCPs. Start small: current documentation and browser testing are more valuable initially than giving an agent write access to production infrastructure.

| MCP | Priority | Use in NextPH | Safety guidance |
| --- | --- | --- | --- |
| Context7 MCP | Strongly recommended | Fetches current, version-specific documentation for Next.js, React, Tailwind, and other libraries [13]. | Follow the client-specific official setup; remote access may use OAuth or an API key depending on the client. Keep credentials outside the repository and treat retrieved material as external input. |
| Playwright MCP — @playwright/mcp | Strongly recommended | Browser automation to inspect desktop/mobile/tablet layouts, navigation, search, newsletter validation, story pages, and responsive embeds [12]. | Use local/staging and test accounts. MCP browser runs complement, but do not replace, committed automated Playwright tests. |
| Cloudflare Docs MCP — https://docs.mcp.cloudflare.com/mcp | Recommended | Read current Cloudflare documentation for Workers, caching, DNS, and R2 without needing account write access [10]. | Prefer this for research and configuration lookup before enabling account-level access. |
| Cloudflare API MCP — https://mcp.cloudflare.com/mcp | Optional at deployment time | Inspect or manage Cloudflare resources when the account and staging environment exist [11]. | Start with minimal permissions, staging only, and require explicit approval for DNS, secrets, and production deploys. |
| GitHub MCP | Optional | Useful if the source repository, issues, pull requests, and CI live on GitHub [14]. | Start read-only; review write/push/merge operations and do not grant unnecessary access to secrets. |
| WordPress MCP Adapter | Optional / later | May expose selected WordPress abilities to AI agents; not required to build the public site [15]. | Enable on staging only and expose read-only abilities first. Avoid publish, user-management, and delete actions for unaudited agents. |

## Suggested order of setup

1. Begin with Context7 and Playwright MCP. They help the agent use current library APIs and verify the running UI without granting infrastructure access.
1. Add Cloudflare Docs MCP during implementation research. Add Cloudflare API MCP only when the agent needs to inspect or deploy a staging resource.
1. Connect GitHub MCP only if using GitHub for the repository and issue workflow.
1. Consider the WordPress MCP Adapter later, on staging, if AI-assisted content operations are genuinely needed. The normal REST API and WordPress dashboard are sufficient for building this site.
Do not copy a client-specific MCP configuration into the repository before the coding tool is chosen. Follow the official setup instructions for the selected client, review every tool and permission, and never connect an unaudited write-capable MCP to production.

# 12. Implementation Roadmap

| Phase | Deliverables | Exit condition |
| --- | --- | --- |
| 1. Foundation | Create repository; scaffold frontend; provision staging WordPress host; connect REST API; set up environment variables and deployment pipeline. | A test story appears on a deployed frontend without any secret exposed in the browser. |
| 2. Editorial model | Configure categories, roles, custom fields, featured media, and article preview. Add custom plugin code only for fields/integrations WordPress does not already provide. | An editor can draft, preview, schedule, publish, revise, and unpublish a story. |
| 3. Public site UI | Build homepage, category archives, article routes, search, responsive navigation, related stories, 404 and loading/error states. | Core flows pass at phone, tablet, laptop, and desktop sizes. |
| 4. Media and newsletter | Optimize responsive image/GIF handling; implement trusted YouTube/Vimeo embeds; add a provider-backed newsletter adapter, consent, and anti-abuse controls. | Images/GIFs and embedded videos render responsively; newsletter signup is proven with the configured provider. |
| 5. SEO and caching | Metadata, sitemap, canonical URLs, structured data, cache revalidation on publish/update, redirects where needed. | Search/share preview tests pass and new publishing updates public content in the expected time window. |
| 6. Security and operations | Roles, MFA where supported, backup/restore test, error monitoring, rate limiting, staging/production separation, secrets audit. | Restore drill and pre-launch security checklist completed. |
| 7. Load and launch | Run browser tests, performance audits, and controlled load tests; check origin capacity and edge caching; document rollback. | Critical defects resolved and launch/rollback steps are documented. |

# 13. Acceptance Criteria

The project should not be considered launch-ready until the following checks pass:

- Homepage and Tech, Travel, Lifestyle, Trending, Search, Tag, and static informational routes render the right data and states.
- An editor can create a draft, preview it, publish it, edit it, schedule it, and unpublish it using WordPress admin.
- Published content updates reach the public frontend through the agreed revalidation/cache process.
- Article pages have unique titles, metadata, canonical URLs, social preview metadata, and a valid not-found state.
- Images and GIFs display with appropriate sizing and alt text; trusted YouTube/Vimeo embeds render responsively without arbitrary iframe HTML.
- Newsletter form validates input, records consent, resists basic abuse, uses double opt-in, and reports success only after the provider accepts the request.
- Ad placement components are present but disabled; when NEXT_PUBLIC_ADS_ENABLED=false, no advertising SDKs or network calls load.
- Authors can submit drafts for review but cannot publish directly; Editors can review and publish; Administrators retain full management capability.
- No secret credentials are bundled into frontend assets, committed to Git, or returned by public APIs.
- Core flows work with keyboard navigation and a screen reader-friendly heading/landmark structure.
- Layouts are tested at representative viewport widths, such as 360 px, 390 px, 768 px, 1024 px, and 1440 px, without horizontal overflow.
- Performance tests cover homepage and article pages on mobile conditions; oversized media and layout shifts are addressed.
- Automated backups exist and a restore test has been completed; a rollback path is documented.
- Staging and production configurations are separate, the domain has HTTPS, and the site has basic uptime/error visibility.
- A controlled load test validates the expected traffic level, WordPress origin capacity, cache behavior, and error rate before launch.
# 14. Deployment and Operations Checklist

## Before initial deployment

- Register the domain and configure DNS in Cloudflare.
- Provision HTTPS-enabled WordPress hosting with database, backup capability, and enough disk space. At the time of writing, WordPress recommends PHP 8.3+, MariaDB 10.11+ or MySQL 8.0+, and HTTPS; confirm the current official requirements before purchasing a plan.
- Create a separate staging CMS and frontend environment.
- Configure public WordPress API URL and server-only secrets; verify frontend bundles contain no private credentials.
- Set the Cloudflare Worker/Next.js deployment path and lock package versions. Run a staging compatibility test for rendering, API calls, image delivery, and cache revalidation.
- Add basic availability and application-error monitoring; configure backups and retention.
## Release day

- Run unit, integration, and Playwright browser tests against the release candidate.
- Check homepage and article page performance, SEO metadata, sitemap, search, mobile navigation, and media playback.
- Verify cache behavior with a new story, an updated story, and an unpublished/draft story.
- Confirm the latest database/media backup exists and rollback commands/steps are accessible.
- Review Cloudflare and WordPress logs immediately after release, and keep a named person responsible for rollback decisions.
## Ongoing operations

- Apply WordPress core/plugin and frontend dependency security updates on a regular schedule.
- Review traffic, cache hit ratio, WordPress origin resource use, media storage, newsletter provider costs, and monthly costs.
- Run a backup restore rehearsal periodically and after meaningful infrastructure changes.
- Remove unused plugins, accounts, secrets, and MCP abilities; review permissions whenever team responsibilities change.
# 15. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| News pages fail to refresh after publishing | Use a deliberate cache invalidation/revalidation webhook; test publish, update, unpublish, and draft paths. |
| Unexpected hosting or media costs | Set usage alerts; compare WordPress-host renewal terms and review Cloudflare Worker, R2, and newsletter pricing before launch. |
| Frontend SEO or link previews are incomplete | Prefer server rendering/static generation; test actual source HTML, metadata, sitemap, and social previews. |
| WordPress origin becomes a bottleneck | Cache public content, paginate queries, monitor origin resources, optimize plugins/database, and load-test expected peak traffic. |
| Secrets leak into the client or repository | Keep credentials server-side, use secret stores, scan Git history, rotate exposed credentials, and restrict MCP/token scopes. |
| MCP tool can perform unsafe production actions | Use staging, a dedicated user, least privilege, read-only abilities first, and human review for publishing/deleting/deploying. |
| Framework deployment adapter lacks a needed feature | Run a compatibility spike early, pin versions, keep a deployment smoke test, and avoid depending on unverified beta behavior. |

# 16. AI Coding-Agent Handoff

Give the AI coding agent this complete specification plus the copy/paste prompt below. The agent should work in small, testable phases, inspect current vendor documentation through Context7 and official docs, and never invent successful deployment, API, or newsletter behavior.

## Required build order

1. Phase A - repository and smoke test: create frontend/ and backend/; scaffold the Cloudflare-ready Next.js project; set up TypeScript, Tailwind CSS v4, linting, tests, and a WordPress staging connection. Prove one public article page before building every route.
1. Phase B - WordPress foundation: document staging/production host setup; implement the version-controlled nextph-core plugin for trending/featured flags, author review permissions, required custom REST fields, and the safe trending endpoint. Do not commit WordPress core, uploads, database dumps, or secrets.
1. Phase C - responsive UI: build shared design tokens, navigation, footer, story cards, featured story, category archive, article template, search, tags, related stories, newsletter, and disabled ad-slot components.
1. Phase D - SEO, caching, and protection: implement metadata, canonical URLs, XML sitemap, robots.txt, Article structured data, server-side API client, bounded cache, preview isolation, sanitized rich content, and rate-limited newsletter handling.
1. Phase E - verification: add unit/integration tests and Playwright tests for public routes, mobile navigation, search, media embeds, newsletter errors/success in mocked tests, author/editor permission behavior, and draft isolation.
1. Phase F - launch readiness: document setup and deployment, verify backups/restore and environment separation, test post publish/update/unpublish refresh, check keyboard accessibility, audit bundle/secrets, and run a controlled load/performance test.
## Copy/paste build prompt

```text
You are the lead engineer implementing NextPH. Treat this specification as the source of truth. Build a production-conscious editorial publication with a Next.js (React + TypeScript) frontend in /frontend and a separately maintained WordPress backend extension in /backend. Deploy the frontend to Cloudflare Workers and use the WordPress REST API for content. WordPress and its MySQL/MariaDB database run on a separate PHP-compatible host.

Required features: editorial-magazine responsive design; homepage with featured/latest stories and section feeds; Tech, Travel, Lifestyle, Trending, Search, story detail, tags/popular topics, related stories, social share, newsletter signup, and informational pages. Admin, Editor, and Author operate through WordPress wp-admin. Authors submit drafts for editor review; editors/admins publish. Explicitly remove WordPress core Author publishing capabilities or create a custom role, and test the restriction server-side. The custom nextph-core plugin should expose editor-controlled featured/trending metadata safely through REST. Images/GIFs are uploaded to WordPress Media Library; videos are embedded only from trusted providers (YouTube/Vimeo) in v1. Ad slot components exist but remain disabled and load no ad scripts because monetization is off initially.

Use Tailwind CSS v4, accessible reusable components, server-rendered/SEO-friendly article pages, typed WordPress data functions, safe HTML sanitization, cache isolation for drafts/previews, bounded query sizes, and responsive images. Use the current Cloudflare Next.js deployment guide; vinext is documented as the recommended default but is beta, so run the compatibility check and a staging proof-of-concept before committing. Use a documented fallback adapter if any required feature fails.

Use a provider adapter for newsletters: development tests may mock it, but production must not report success unless a configured provider accepts the subscription. Implement consent, privacy notice, validation, rate limiting/bot protection, and double opt-in. Keep secrets server-side in Cloudflare/hosting secret stores. Never commit credentials or put secrets in NEXT_PUBLIC_ variables.

Begin by inspecting the repository and current official docs. Present a short implementation plan and identify unknown deployment credentials as configuration placeholders; do not ask for secrets in chat. Implement one phase at a time. After every phase, run lint, type-check, tests, and build; fix errors before proceeding. Add Playwright browser tests and verify 360, 390, 768, 1024, and 1440 px widths. Include README/setup instructions, .env.example with placeholders, WordPress host setup, Cloudflare deployment, backup/restore, and acceptance-test steps. Never claim deployment, provider integration, or production readiness until tested. Do not modify production resources or publish real content without explicit approval.
```

# 17. Official References

Platform features, pricing, and MCP compatibility can change. Re-check official documentation before implementation and before production deployment. Accessed/verified 16 October 2026.

- [1] Cloudflare Workers: Next.js and vinext deployment guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- [2] Cloudflare Workers: OpenNext adapter / fallback: https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/
- [3] WordPress hosting requirements: https://wordpress.org/about/requirements/
- [4] WordPress REST API handbook and endpoint reference: https://developer.wordpress.org/rest-api/reference/
- [5] WordPress REST API: Posts: https://developer.wordpress.org/rest-api/reference/posts/
- [6] WordPress REST API authentication: https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/
- [7] WordPress roles and capabilities: https://developer.wordpress.org/plugins/users/roles-and-capabilities/
- [8] Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- [9] Cloudflare D1 SQL behavior and SQLite compatibility: https://developers.cloudflare.com/d1/sql-api/sql-statements/
- [10] Cloudflare Documentation MCP server: https://docs.mcp.cloudflare.com/mcp
- [11] Cloudflare API MCP server: https://github.com/cloudflare/mcp
- [12] Microsoft Playwright MCP: https://github.com/microsoft/playwright-mcp
- [13] Upstash Context7 MCP: https://github.com/upstash/context7
- [14] GitHub MCP Server: https://github.com/github/github-mcp-server
- [15] WordPress.org MCP Adapter plugin (optional): https://wordpress.org/plugins/mcp-adapter/

End of document. This is the build baseline. Replace example domains and configure hosting/provider accounts before launch; validate the Cloudflare runtime, newsletter provider, performance limits, and expected traffic in staging.
