# Design System & Visual Specification: NextPH

<!-- impeccable:design-schema 1 -->

## Design Direction: Modern Archipelago Editorial

NextPH's visual identity balances the intellectual authority of classic broadsheets with the sleek speed and vibrant warmth of contemporary digital journalism in the Philippines. It avoids generic tech blog tropes (gratuitous gradients, bloated rounded corners, pastel pills, floating decorative glass cards) in favor of crisp typographic hierarchy, intentional editorial whitespace, structured column grids, and purposeful imagery.

---

## 1. Color System

The palette uses a warm, tactile editorial ground that reduces eye strain, paired with high-contrast near-black ink, tactile divider grays, and a distinctive Filipino editorial accent inspired by deep terracotta / vermilion.

| Token | CSS Variable | Hex Value | Usage / Intent |
|---|---|---|---|
| **Ground (Canvas)** | `--color-ground` | `#FBF9F5` | Primary warm off-white newsprint paper ground |
| **Ground Elevated** | `--color-ground-elevated` | `#FFFFFF` | Card/modal elevated surface |
| **Ground Subdued** | `--color-ground-subdued` | `#F3EFEA` | Secondary section background, newsletter block, code/quote blocks |
| **Ink Primary** | `--color-ink-primary` | `#141312` | High-contrast headline and body text (WCAG AAA: > 14:1) |
| **Ink Secondary** | `--color-ink-secondary` | `#4A4642` | Decks, article excerpts, bylines, timestamps (WCAG AA: > 7:1) |
| **Ink Muted** | `--color-ink-muted` | `#76716B` | Captions, metadata, inactive states, placeholder text (WCAG AA: 4.6:1) |
| **Border Subtle** | `--color-border-subtle` | `#E8E4DD` | Hairline editorial dividers, card outlines, subtle grid rules |
| **Border Strong** | `--color-border-strong` | `#CCC7BD` | Active inputs, table headers, dark dividers |
| **Accent Primary** | `--color-accent` | `#C43622` | Editorial vermilion/coral accent for category badges, breaking tickers, active states |
| **Accent Hover** | `--color-accent-hover` | `#A62B1A` | Darkened interactive accent |
| **Accent Subdued** | `--color-accent-subdued` | `#FDF1EE` | Category pill tints, subtle highlight washes |

---

## 2. Typography

NextPH utilizes a dual-font typographic system:
- **Headlines & Editorial Titles:** Distinctive editorial display serif with character, refined proportions, and sharp serifs (`Newsreader`, `Georgia`, or modern editorial serif).
- **Body, Navigation & Metadata:** Modern, neutral, highly legible sans-serif with high x-height and clear numerals (`Geist Sans`, `Inter`, or system sans).

### Type Scale

| Style | Font Family | Size (Mobile → Desktop) | Weight | Line Height | Tracking |
|---|---|---|---|---|---|
| **Display Hero** | Serif | `2.5rem (40px) → 3.75rem (60px)` | 700 / Bold | 1.08 | `-0.03em` |
| **Headline 1** | Serif | `2rem (32px) → 2.75rem (44px)` | 700 / Bold | 1.15 | `-0.025em` |
| **Headline 2** | Serif | `1.5rem (24px) → 2rem (32px)` | 600 / Semi | 1.2 | `-0.02em` |
| **Headline 3** | Serif | `1.25rem (20px) → 1.5rem (24px)` | 600 / Semi | 1.25 | `-0.015em` |
| **Story Deck / Lead** | Sans | `1.125rem (18px) → 1.25rem (20px)` | 400 / Regular | 1.5 | `0` |
| **Body Longform** | Sans | `1.0625rem (17px) → 1.125rem (18px)` | 400 / Regular | 1.65 | `0` (Max 68ch measure) |
| **Body Interface** | Sans | `0.9375rem (15px)` | 400/500 | 1.45 | `0` |
| **Category Eyebrow**| Sans | `0.75rem (12px)` | 700 / Bold | 1.2 | `+0.06em` (Uppercase) |
| **Metadata / Caption**| Sans | `0.8125rem (13px)` | 400/500 | 1.4 | `0` |

---

## 3. Grid & Spacing System

- **Base Unit:** 4px / 8px incremental scale (`--space-1: 4px`, `--space-2: 8px`, `--space-4: 16px`, `--space-6: 24px`, `--space-8: 32px`, `--space-12: 48px`, `--space-16: 64px`, `--space-24: 96px`).
- **Page Container:** Max width `1360px` with responsive horizontal gutters:
  - Mobile (`< 768px`): `16px` padding
  - Tablet (`768px - 1023px`): `24px` padding
  - Desktop (`>= 1024px`): `32px` to `48px` padding
- **Editorial Columns:**
  - Desktop Homepage: 12-column grid (8-col lead/main feed + 4-col curated trending & sidebar)
  - Article Page: 8-col readable center column (max-width `720px` for reading body, max-width `1100px` for hero media)

---

## 4. Key Component Anatomy

### 1. Header & Navigation
- Top notification / date & edition bar: Current Philippine date, edition tag, trending topic pills.
- Main Masthead: Bold NextPH wordmark with editorial dignity; desktop inline navigation (Tech, Travel, Lifestyle, Trending, Search); search trigger icon button.
- Mobile Drawer: Sliding accessible navigation with category links, search bar, and social icons.

### 2. Story Cards
- **Hero Lead Card:** Large 16:9 or 3:2 landscape imagery, category tag, massive serif headline, rich excerpt, author avatar, byline, reading time.
- **Section Feature Card:** 16:10 image, category pill, 2-line serif headline, timestamp.
- **Compact List / Trending Card:** Ranked numeral (01, 02, 03) in crisp vermilion accent, tight headline, category, and date.
- **Image Treatment:** Subtle `1px` border subtle, clean aspect ratio (`aspect-[16/10]`), lazy loaded with placeholder shimmer.

### 3. Article Detail Layout
- Category pill & breadcrumb.
- Story headline (`h1`), deck/lead paragraph, author byline row with publication timestamp, updated timestamp, and reading time.
- Hero media with photo credit & caption.
- Sanitized article body with custom block typography (drop caps, pull quotes with left editorial hairline, code snippets, responsive YouTube/Vimeo embeds).
- Tag pills row.
- Native/Web Share API with accessible clipboard copy fallback.
- Related Stories 3-card grid.

### 4. Newsletter Module ("The Next Dispatch")
- High-contrast editorial container with subtle ground wash.
- Clear value proposition, email input, consent checkbox link to Privacy Policy, submit button with loading spinner, validation errors, and success message.

### 5. Advertisement Placeholders
- Responsive container components for future standard ad units (Leaderboard 728×90 / 970×250, MPU 300×250).
- When `NEXT_PUBLIC_ADS_ENABLED=false`, renders as hidden / 0-height element without reserving empty blank space or loading scripts.

---

## 5. Responsive Breakpoint Guarantees

- **360px (Small Mobile):** Single-column layout, compact masthead, stacked metadata, zero horizontal overflow.
- **390px (Standard Mobile):** Optimal mobile reading experience, comfortable 16px gutters, 44px+ touch targets.
- **768px (Tablet):** 2-column story cards, side-by-side trending feeds, full search bar.
- **1024px (Laptop):** 3-column category grids, persistent sidebar widgets, sticky header option.
- **1440px (Wide Desktop):** Generous whitespace margins, multi-column editorial magazine hero presentation.
