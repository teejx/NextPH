# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, React, TypeScript), Tailwind CSS v4, deployed to Cloudflare Workers; headless WordPress REST API backend on separate PHP/MySQL host.

## Users

- **Readers:** Contemporary Filipino digital natives, professionals, travelers, tech enthusiasts, and the global diaspora seeking curated, reliable, and engaging editorial stories in technology, travel, lifestyle, and trending culture.
- **Editorial Team:**
  - *Administrators:* Full system configuration, plugin and user management, and overall publishing oversight.
  - *Editors:* Review, edit, schedule, publish, and curate stories, featured picks, and trending tags.
  - *Authors:* Draft and edit their own articles and upload media; submit drafts for review without direct publish capability.

## Product Purpose

Deliver a modern, fast, media-rich editorial digital publication for the Philippines that covers Tech, Travel, Lifestyle, and curated Trending stories with journalistic dignity, polished visual hierarchy, and an uncluttered, responsive reading experience.

## Positioning

A design-forward Filipino digital publication that treats lifestyle, travel, tech, and cultural trends with editorial rigor, visual craft, and blazing speed—providing an elevated alternative to bloated, ad-cluttered tabloids and generic content mills.

## Operating Context

- Readers browse on diverse devices and connections: small mobile screens (360px–390px), tablets (768px), laptops (1024px), and wide desktop displays (1440px+), often on mobile cellular data in the Philippines and overseas.
- Headless CMS architecture: Editorial staff works exclusively in WordPress `/wp-admin`; public visitors access the server-rendered Next.js frontend deployed to Cloudflare Workers edge.
- Public content is served via the WordPress REST API over HTTPS with edge caching; previews and drafts remain authenticated and isolated.

## Capabilities and Constraints

- **Editorial Homepage:** Hero/lead story, curated trending strip/grid, latest stories, section feeds (Tech, Travel, Lifestyle), popular topics/tags, newsletter module, and disabled ad slots.
- **Category & Archive Pages:** Dedicated feeds for Tech, Travel, Lifestyle, Trending, and tag archives with pagination/incremental loading.
- **Article Detail Page:** Headline, excerpt, author byline, publish and update timestamps, category badge, hero image/GIF with alt text, sanitized WordPress block content, trusted video embeds (YouTube & Vimeo only), tags, native/copy social sharing, related stories, and newsletter module.
- **Search System:** Search interface with debounced queries, loading skeletons, error handling, empty states, and keyboard navigation.
- **Newsletter Integration:** Server-side provider adapter; fails closed when unconfigured in production; includes consent notice, validation, and rate limiting.
- **Ad Components:** Reusable ad placement containers present in layout but strictly disabled by default (`NEXT_PUBLIC_ADS_ENABLED=false`), zero third-party ad scripts loaded.
- **Informational Pages:** About, Contact, Privacy Policy, Editorial Policy, and Corrections.
- **WordPress Integration:** Custom `nextph-core` plugin for trending/featured metadata, safe REST endpoints, server-side author capability restrictions, and cache revalidation webhook support.

## Brand Commitments

- **Name:** NextPH
- **Voice:** Discerning, contemporary, vibrant yet trustworthy, curious, and culturally attuned to the modern Philippines.
- **Tone:** Polished editorial standard, respectful, engaging without sensationalist clickbait.
- **Language:** English, naturally integrating Filipino cultural contexts and references.

## Evidence on Hand

- Project Technical Specification (`NextPH_Project_Documentation.md`)
- AI Coding-Agent Build Prompt (`NextPH_AI_Builder_Prompt.md`)
- Initial Start Guide (`START_HERE_NextPH.txt`)

## Product Principles

1. **Editorial Dignity Over Noise:** Typographic hierarchy, generous whitespace, and purposeful layout grids prioritize reader focus over chaotic banners or aggressive animations.
2. **Speed & Edge Reliability:** Lightweight server-rendered pages, responsive modern image formats, and edge caching ensure instant page loads across any network.
3. **Journalistic Integrity & Transparency:** Curated trending criteria are editorially governed; view counts are never fabricated; newsletter subscriptions never report false success.
4. **Security & Boundary Isolation:** Strict boundary between public frontend and CMS; drafts and preview tokens never leak into public caches or client bundles.

## Accessibility & Inclusion

- Target WCAG 2.1 AA compliance.
- Contrast ratios: minimum 4.5:1 for body and placeholder text, 3:1 for large display headers.
- Semantic HTML landmarks (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`).
- Strict heading hierarchy (h1 through h4 without skipping levels).
- High-visibility keyboard focus rings and minimum 44×44px touch targets.
- Screen-reader accessible forms, buttons, and social share actions.
