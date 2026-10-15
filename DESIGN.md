# Design System & Visual Specification: NextPH

<!-- impeccable:design-schema 1 -->

## Design Direction: Contemporary Minimalist Magazine (NEXT)

A sleek, high-contrast, modern editorial magazine aesthetic inspired by contemporary digital publications (Hypebeast, GQ, Kinfolk, Wired). It trades dated newsprint serifs and sepia paper for crisp, high-impact monochrome typography, dark cinematic overlay hero cards, icon-led category navigation strips, and razor-sharp editorial layouts.

---

## 1. Color System

| Token | CSS Variable | Hex Value | Usage / Intent |
|---|---|---|---|
| **Canvas / Ground** | `--color-ground` | `#FFFFFF` | Crisp, clean, pure white backdrop |
| **Dark Hero Surface** | `--color-dark-surface`| `#111113` | Deep obsidian card background for hero showcase |
| **Surface Subdued** | `--color-ground-subdued`| `#F4F4F5` | Light zinc surface for tags, thumbnails, and subtle contrast |
| **Ink Primary** | `--color-ink-primary` | `#09090B` | Jet black typography (WCAG AAA > 18:1) |
| **Ink Secondary** | `--color-ink-secondary` | `#52525B` | Article summaries, descriptions, captions |
| **Ink Muted** | `--color-ink-muted` | `#71717A` | Metadata, dates, reading times, subtle labels |
| **Border Subtle** | `--color-border-subtle` | `#E4E4E7` | Razor-thin hairline section dividers and card borders |
| **Border Strong** | `--color-border-strong` | `#27272A` | High-contrast inputs and dark card borders |
| **Accent / Micro-CTA**| `--color-accent` | `#09090B` | Minimalist monochrome emphasis and hover fills |

---

## 2. Typography

- **Display & Headlines:** Modern, high-impact geometric sans-serif (`Geist Sans`, `Inter`, or system neo-grotesque) with tight tracking (`-0.03em`) and high contrast.
- **Eyebrows & Navigation:** Bold, tracked uppercase with clean editorial slashes (`TECH  /  FASHION  /  TRAVEL  /  NEWS`), tracking (`+0.08em`).
- **Interactive CTAs:** Distinctive micro-action styling: `READ MORE  →` in tracked uppercase with arrow glyphs.

---

## 3. Structural Layout Grid & Signature Sections

### A. Minimalist Masthead
- Wordmark: Bold, modern, tracked **NEXT** (or **NEXTPH**).
- Navigation: Inline uppercase links separated by elegant slashes (`TECH  /  LIFESTYLE  /  TRAVEL  /  TRENDING`).
- Utility: Clean minimalist search and menu trigger buttons.

### B. Hero Dual-Zone (Top Viewport)
- **Primary Hero Showcase (Left, 8-Cols):**
  - Dark obsidian background (`#111113`).
  - Left content: Tracked category label, massive bold white headline, crisp white excerpt, `READ MORE  →` action, dot slider pagination indicator (`• ○ ○ ○`).
  - Right image: Sharp portrait or editorial figure seamlessly blending into the dark surface.
- **Trending Stories Stack (Right, 4-Cols):**
  - 3 stacked stories with square thumbnails on the left, tracked category label, 2-line bold headline, and `READ MORE  →` action, separated by hairline dividers.

### C. Category Visual Strip (Middle Row)
- 4 full-width photographic cards in a responsive grid.
- Dark photographic background with centered white stroke icon (Laptop for Tech, Hanger for Lifestyle, Plane for Travel, Newspaper for News/Trending).
- Centered uppercase category title and arrow (`→`).

### D. Lower Editorial Grid (3-Column Split)
- **Column 1 ("LATEST"):**
  - Header: "LATEST" with "VIEW ALL →".
  - 4 compact horizontal rows: square thumbnail, uppercase category, bold headline, published date.
- **Column 2 (Editor Spotlight):**
  - Large featured story card: full-width landscape photography, tracked category eyebrow, bold headline, excerpt, and `READ MORE  →`.
- **Column 3 (Newsletter & Community):**
  - "STAY IN THE LOOP" container with dark cinematic gradient backdrop, white bold headline ("Get the latest from NEXT PH"), subdeck, email input, and solid high-contrast "SUBSCRIBE" button.
  - "FOLLOW US" social icons row and `#WhatsNEXTPH` community hashtag.
