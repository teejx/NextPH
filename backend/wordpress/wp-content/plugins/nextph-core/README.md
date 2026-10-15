# NextPH Core WordPress Plugin

`nextph-core` is the dedicated backend extension for the headless WordPress CMS powering **NextPH**.

## Key Features

1. **Editorial Metadata Registration (`show_in_rest`):**
   - `_nextph_is_featured`: Boolean flag designating an article for the homepage lead/hero slot.
   - `_nextph_is_trending`: Boolean flag designating an article as an editorially curated trending story.
   - Capability-gated: only users with `edit_others_posts` (Editors and Administrators) can toggle these flags.

2. **Curated Trending REST API Endpoint:**
   - Route: `GET /wp-json/nextph/v1/trending?limit=8`
   - Returns published posts with `_nextph_is_trending = 1`.
   - Bounded queries (maximum 20 items) with fallback to recent published stories if fewer items are flagged.
   - Public cache headers (`Cache-Control: public, max-age=120, s-maxage=300`).

3. **Strict Publishing Role Capabilities:**
   - **Administrator:** Full configuration, user and plugin management.
   - **Editor:** Can review, edit, schedule, and publish all posts and terms.
   - **Author:** Can create and edit their own posts and upload media, but **cannot publish directly** (`publish_posts` capability is explicitly removed). Authors must submit stories for editorial review.

4. **Cache Invalidation Webhook:**
   - Hooks into `transition_post_status` on publish, update, and trash events.
   - Sends an authorized webhook to Next.js (`POST /api/revalidate`) with header `X-Revalidate-Secret` to purge stale edge caches within seconds.

## Installation

1. Copy or symlink this folder to your WordPress installation's `wp-content/plugins/nextph-core`.
2. Activate via WordPress Dashboard > Plugins > NextPH Core, or via WP-CLI:
   ```bash
   wp plugin activate nextph-core
   ```
3. In `wp-config.php`, optionally configure revalidation constants:
   ```php
   define('NEXTPH_REVALIDATE_URL', 'https://nextph.example/api/revalidate');
   define('NEXTPH_REVALIDATE_SECRET', 'your-strong-revalidation-secret');
   ```
