# PortalJS Research Data Portal — Customisation Spec

**Date:** 2026-03-24
**Project:** portal-datopian-research

---

## Overview

Customise the existing PortalJS frontend (forked from the UAE Ministry of Investment demo) to serve as a generic **PortalJS Research Data Portal** demo. The CKAN backend (`NEXT_PUBLIC_DMS=https://api.cloud.portaljs.com/@datopian-research`) is already in place. The work is entirely front-end: rebrand, recolour, replace UAE-specific content, restructure the homepage, and add placeholder research stories.

---

## Color & Global Styles

### `tailwind.config.js`
- Change `themeColor` from `"#92722a"` (gold) to `"#2563eb"` (blue-600)
- All `accent` colour tokens derive from this single variable — no other colour changes needed

### `styles/globals.scss`
- Update `.hero-glow` radial gradient: replace `rgba(146,114,42,...)` values with blue equivalents (`rgba(37,99,235,...)`) to match the new accent

---

## SEO / Meta (`next-seo.config.js`)

| Field | Old value | New value |
|---|---|---|
| `siteTitle` | `"PortalJS Open Data Portal"` | `"PortalJS Research Data Portal"` |
| `title` | `"PortalJS"` | `"PortalJS"` |
| `description` | generic open data copy | `"Discover and explore academic and scientific datasets. Search, preview, and analyse open research data powered by PortalJS."` |
| `keywords` | open data keywords | `"PortalJS, research data, academic datasets, open science, data portal, datopian"` |

---

## Hero Section (`components/home/heroSectionLight/index.tsx`)

| Element | Old | New |
|---|---|---|
| Logo `src` | `/images/moi-logo.svg` | `/images/logos/MainLogo.svg` |
| Logo `alt` | `"UAE Ministry of Investment"` | `"PortalJS Research Data Portal"` |
| Headline | `"UAE Investment Intelligence"` | `"Research Data Intelligence"` |
| Accent word | `"Intelligence"` | `"Intelligence"` (unchanged) |
| Subtitle | trade/finance copy | `"Explore academic and scientific datasets. Ask anything in plain English."` |
| `SUGGESTED_PROMPTS` | 4 UAE-specific prompts | 4 research-relevant prompts (see below) |

New `SUGGESTED_PROMPTS`:
```ts
const SUGGESTED_PROMPTS = [
  "Show datasets published in the last year",
  "What climate datasets are available?",
  "Find datasets about public health",
  "Which organisations have the most datasets?",
];
```

Remove the `chartData` prop from `HeroSectionLight` — it is no longer passed from the homepage.

---

## Homepage (`pages/index.tsx`)

### Remove
- The 4 UAE blob CSV fetches (`importsRows`, `exportsRows`, `tradeRows`, `govtRows`)
- `chartData` construction and prop
- `ChartsSection` import and JSX usage
- `ChartData`, `MonthlyPoint`, `TradePartner`, `GovtFinancePoint` type imports

### Add
- Import `FeaturedDatasets` from `@/components/home/FeaturedDatasets`
- Pass `datasets` prop to `FeaturedDatasets`

### New section order
```tsx
<HeroSectionLight stats={stats} />
<FeaturedDatasets datasets={datasets} />
<MainSection groups={groups} />
<FeaturedStoriesSection stories={stories} />
```

---

## New Component: `components/home/FeaturedDatasets.tsx`

A new section component that renders a grid of `DatasetCard` components.

**Props:** `{ datasets: Dataset[] }`

**Structure:**
- Section header: "Featured Datasets" (h2, same style as `MainSection`)
- Subheading: "A selection of open research datasets available on this portal."
- "View all datasets →" link to `/search`
- 2-column grid (`grid grid-cols-1 md:grid-cols-2 gap-4`) of `DatasetCard` components
- Renders at most 4 datasets (slice first 4 from the prop)

---

## `FeaturedStoriesSection` (`components/home/FeaturedStoriesSection.tsx`)

Update the subtitle text:
- Old: `"Data-driven narratives about UAE investment and trade."`
- New: `"Data-driven narratives from the research community."`

---

## Types (`types/chartData.ts`)

Remove UAE-specific types:
- `ChartData`
- `MonthlyPoint`
- `TradePartner`
- `GovtFinancePoint`

Keep `PlotModule` — it is referenced by story cover infrastructure and the visualisations carousel component.

---

## Stories

Replace the two UAE stories with two placeholder academic research stories. Stories are prose-only (no embedded `<Chart>` components).

### File changes

| Old file | New file |
|---|---|
| `content/stories/beyond-oil.mdx` | `content/stories/open-science-rising.mdx` |
| `content/stories/beyond-oil.cover.ts` | `content/stories/open-science-rising.cover.ts` |
| `content/stories/the-world-comes-to-uae.mdx` | `content/stories/data-for-health.mdx` |
| `content/stories/the-world-comes-to-uae.cover.ts` | `content/stories/data-for-health.cover.ts` |
| `public/images/story-covers/beyond-oil.svg` | `public/images/story-covers/open-science-rising.svg` |
| `public/images/story-covers/the-world-comes-to-uae.svg` | `public/images/story-covers/data-for-health.svg` |

### Story 1: "The Rise of Open Science"

**Slug:** `open-science-rising`

**Frontmatter:**
```yaml
title: "The Rise of Open Science"
date: "2026-03-24"
description: "How open-access mandates and preprint culture are accelerating the pace of scientific discovery by making research data freely available to all."
relatedDatasets: []
```

**Prose:** A narrative about the open science movement — covering the shift from paywalled journals to open repositories, FAIR data principles, and how shared datasets accelerate research. Placeholder text (~400 words). No charts.

### Story 2: "Data for Better Health"

**Slug:** `data-for-health`

**Frontmatter:**
```yaml
title: "Data for Better Health"
date: "2026-03-24"
description: "How openly shared epidemiological and clinical datasets are transforming public health research and enabling faster responses to emerging health challenges."
relatedDatasets: []
```

**Prose:** A narrative about open health data — covering disease surveillance datasets, the role of shared clinical trial data, and how open epidemiological records improve preparedness. Placeholder text (~400 words). No charts.

### Cover `.ts` files

Both `.cover.ts` files export no-op stubs (no `coverSpec`, no `coverCsvUrl`). The story page handles missing exports gracefully since `<Chart>` is not used in the MDX.

```ts
// content/stories/open-science-rising.cover.ts
export {};
```

### Cover SVGs

Simple blue-on-white placeholder SVGs (no generated chart). Each SVG is a 800x400 rectangle with a subtle blue gradient background and the story title as centred text.

---

## What Is Not In Scope

- Changes to the search page, dataset detail pages, or resource pages
- Changes to the groups/topics or organisations pages
- Adding real research chart data to stories
- Replacing topic icons (these come from CKAN and will update when the backend is populated)
- Changing the AI assistant (queryless) behaviour
