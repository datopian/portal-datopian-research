# PortalJS Research Data Portal Customisation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand a UAE Ministry of Investment PortalJS demo into a generic PortalJS Research Data Portal demo — new colour scheme, copy, logo, homepage structure, and placeholder research stories.

**Architecture:** Front-end-only changes. The CKAN backend is already pointed at `@datopian-research` in `.env`. No data model or API changes. All colour theming derives from a single `themeColor` variable in `tailwind.config.js`. Stories use the existing MDX infrastructure but with no embedded charts.

**Tech Stack:** Next.js 13, TypeScript, Tailwind CSS, SCSS, `next-mdx-remote`, `@portaljs/ckan`

---

## File Map

**Modified:**
- `tailwind.config.js` — accent colour token
- `styles/globals.scss` — hero glow gradient
- `next-seo.config.js` — site title, description, keywords
- `components/home/heroSectionLight/index.tsx` — logo, headline, subtitle, prompts, remove `chartData` prop
- `themes/lighter/header.tsx` — logo path
- `components/home/FeaturedStoriesSection.tsx` — subtitle text
- `pages/index.tsx` — remove CSV fetches + `ChartsSection`, add `FeaturedDatasets`, reorder sections
- `pages/stories/[slug].tsx` — remove old cover imports, `STORY_COMPONENTS`, `storyComponents`; fix org link

**Created:**
- `components/home/FeaturedDatasets.tsx` — new featured datasets grid section
- `content/stories/open-science-rising.mdx`
- `content/stories/open-science-rising.cover.ts`
- `content/stories/data-for-health.mdx`
- `content/stories/data-for-health.cover.ts`
- `public/images/story-covers/open-science-rising.svg`
- `public/images/story-covers/data-for-health.svg`

**Deleted:**
- `content/stories/beyond-oil.mdx`
- `content/stories/beyond-oil.cover.ts`
- `content/stories/the-world-comes-to-uae.mdx`
- `content/stories/the-world-comes-to-uae.cover.ts`
- `public/images/story-covers/beyond-oil.svg`
- `public/images/story-covers/the-world-comes-to-uae.svg`

---

## Task 1: Accent colour + hero glow

**Files:**
- Modify: `tailwind.config.js:5`
- Modify: `styles/globals.scss:34-38`

- [ ] **Step 1: Update theme colour**

In `tailwind.config.js`, change line 5:
```js
const themeColor = "#2563eb";
```

- [ ] **Step 2: Update hero glow gradient**

In `styles/globals.scss`, replace the `.hero-glow` block (lines 34–38):
```scss
.hero-glow {
  background:
    radial-gradient(ellipse 80% 55% at 50% 40%, rgba(37,99,235,0.11) 0%, rgba(37,99,235,0.04) 45%, #ffffff 70%),
    radial-gradient(ellipse 55% 45% at 5% 95%, rgba(11,45,67,0.08) 0%, transparent 65%);
}
```

- [ ] **Step 3: Verify**

Run `npm run dev`, open `http://localhost:3000`. Confirm:
- All accent-coloured elements (hover states, links, borders) are blue, not gold
- Hero section has a subtle blue glow instead of gold

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js styles/globals.scss
git commit -m "feat: change accent colour from gold to blue"
```

---

## Task 2: SEO meta

**Files:**
- Modify: `next-seo.config.js`

- [ ] **Step 1: Update named exports**

In `next-seo.config.js`:

Change line 3:
```js
export const siteTitle = "PortalJS Research Data Portal";
```

Change lines 5–8 (the `description` export):
```js
export const description =
  "Discover and explore academic and scientific datasets. Search, preview, and analyse open research data powered by PortalJS.";
```

- [ ] **Step 2: Update keywords meta tag**

Find `additionalMetaTags` in the default export. Update the `keywords` entry's `content`:
```js
{
  name: "keywords",
  content: "PortalJS, research data, academic datasets, open science, data portal, datopian",
},
```

- [ ] **Step 3: Verify**

Run `npm run dev`, open `http://localhost:3000`. Open browser DevTools → Elements → `<head>`. Confirm:
- `<title>` contains "PortalJS Research Data Portal"
- `<meta name="description">` contains the new research-focused text

- [ ] **Step 4: Commit**

```bash
git add next-seo.config.js
git commit -m "feat: update SEO meta for research portal"
```

---

## Task 3: Logo

**Files:**
- Modify: `components/home/heroSectionLight/index.tsx:34-39`
- Modify: `themes/lighter/header.tsx:14`

- [ ] **Step 1: Update hero logo**

In `components/home/heroSectionLight/index.tsx`, update the `<Image>` element (around line 33):
```tsx
<Image
  src="/images/logos/MainLogo.svg"
  alt="PortalJS Research Data Portal"
  width={280}
  height={137}
  style={{ objectFit: "contain" }}
  priority
/>
```

- [ ] **Step 2: Update theme header logo**

In `themes/lighter/header.tsx`, change line 14:
```ts
const portalLogo = "/images/logos/MainLogo.svg";
```

- [ ] **Step 3: Verify**

Run `npm run dev`. Confirm the UAE Ministry of Investment logo no longer appears anywhere on the homepage or header.

- [ ] **Step 4: Commit**

```bash
git add components/home/heroSectionLight/index.tsx themes/lighter/header.tsx
git commit -m "feat: replace MOI logo with PortalJS logo"
```

---

## Task 4: Hero section text + remove chartData prop

**Files:**
- Modify: `components/home/heroSectionLight/index.tsx`

- [ ] **Step 1: Update SUGGESTED_PROMPTS**

Replace the `SUGGESTED_PROMPTS` array at the top of the file:
```ts
const SUGGESTED_PROMPTS = [
  "Show datasets published in the last year",
  "What climate datasets are available?",
  "Find datasets about public health",
  "Which organisations have the most datasets?",
];
```

- [ ] **Step 2: Update headline and subtitle**

In the JSX, change the `<h1>` content:
```tsx
<h1 className="font-black text-[42px] md:text-[58px] leading-tight text-gray-900">
  Research Data{" "}
  <span className="text-accent">Intelligence</span>
</h1>
```

Change the `<p>` subtitle:
```tsx
<p className="text-gray-500 text-[17px] md:text-[19px] max-w-xl mx-auto">
  Explore academic and scientific datasets.
  Ask anything in plain English.
</p>
```

- [ ] **Step 3: Remove chartData prop**

Remove `chartData: ChartData` from the component's props destructuring and type annotation. The component signature should become:
```tsx
export default function HeroSectionLight({
  stats,
}: {
  stats: {
    orgCount: number;
    groupCount: number;
    datasetCount: number;
    visualizationCount: number;
  };
})
```

Also remove the `ChartData` type import if it was used only for this prop.

- [ ] **Step 4: Verify**

Run `npm run dev`. Confirm hero headline reads "Research Data Intelligence" with blue accent, subtitle is research-focused, and suggested prompt chips are updated.

- [ ] **Step 5: Commit**

```bash
git add components/home/heroSectionLight/index.tsx
git commit -m "feat: rebrand hero section for research portal"
```

---

## Task 5: FeaturedDatasets component

**Files:**
- Create: `components/home/FeaturedDatasets.tsx`

- [ ] **Step 1: Create the component**

Create `components/home/FeaturedDatasets.tsx`:
```tsx
import { Dataset } from "@portaljs/ckan";
import DatasetCard from "@/components/dataset/search/DatasetCard";
import Link from "next/link";

export default function FeaturedDatasets({ datasets }: { datasets: Dataset[] }) {
  return (
    <section className="py-10 border-t border-gray-100">
      <div className="custom-container mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Featured Datasets</h2>
            <p className="mt-1 text-sm text-gray-500">
              A selection of open research datasets available on this portal.
            </p>
          </div>
          <Link
            href="/search"
            className="text-sm font-semibold text-accent hover:text-accent-600 flex items-center gap-1 transition-colors shrink-0"
          >
            View all datasets
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {datasets.slice(0, 4).map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run `npm run typecheck`. There should be no new type errors introduced by this file (the project has `ignoreBuildErrors: true` but it is still worth checking).

- [ ] **Step 3: Commit**

```bash
git add components/home/FeaturedDatasets.tsx
git commit -m "feat: add FeaturedDatasets homepage section"
```

---

## Task 6: Homepage restructure

**Files:**
- Modify: `pages/index.tsx`

- [ ] **Step 1: Remove UAE CSV fetches from getServerSideProps**

Remove the following from `getServerSideProps`:
- The `fetchCsv` call block fetching `importsRows`, `exportsRows`, `tradeRows`, `govtRows`
- The `chartData` construction object
- `chartData` from the returned `props`

Also remove the `aggregateByPeriod`, `topTradePartners`, and `govtFinancePoints` helper functions (lines ~24–59) — they are only used to build `chartData`.

- [ ] **Step 2: Remove ChartsSection import and usage**

Remove:
```ts
import ChartsSection from "@/components/home/visualizationsCarousel";
```

Remove from JSX:
```tsx
<ChartsSection data={chartData} />
```

Remove `ChartData`, `MonthlyPoint`, `TradePartner`, `GovtFinancePoint` from the type imports:
```ts
import type { ChartData, MonthlyPoint, TradePartner, GovtFinancePoint } from "@/types/chartData";
```

- [ ] **Step 3: Add FeaturedDatasets and reorder sections**

Add import:
```ts
import FeaturedDatasets from "@/components/home/FeaturedDatasets";
```

Update the `Home` component JSX to the new section order:
```tsx
return (
  <>
    <HomePageStructuredData />
    <HeroSectionLight stats={stats} />
    <FeaturedDatasets datasets={datasets} />
    <MainSection groups={groups} />
    <FeaturedStoriesSection stories={stories} />
  </>
);
```

Update the `Home` component's prop type — remove `chartData` from its signature.

- [ ] **Step 4: Verify**

Run `npm run dev`. Open `http://localhost:3000`. Confirm:
- No UAE chart carousel
- Featured Datasets section appears below the hero with dataset cards
- Browse by Topic appears next
- Featured Data Stories appears last
- No console errors

- [ ] **Step 5: Commit**

```bash
git add pages/index.tsx
git commit -m "feat: restructure homepage, replace charts with dataset cards"
```

---

## Task 7: FeaturedStoriesSection subtitle

**Files:**
- Modify: `components/home/FeaturedStoriesSection.tsx:14`

- [ ] **Step 1: Update subtitle**

In `components/home/FeaturedStoriesSection.tsx`, change the `<p>` subtitle on line 14:
```tsx
<p className="mt-1 text-sm text-gray-500">Data-driven narratives from the research community.</p>
```

- [ ] **Step 2: Commit**

```bash
git add components/home/FeaturedStoriesSection.tsx
git commit -m "feat: update stories section subtitle"
```

---

## Task 8: Story page surgery

**Files:**
- Modify: `pages/stories/[slug].tsx`

This task must be completed **before** deleting the old story files (Task 9). The static imports at the top of this file will cause a build error if the referenced files are deleted while the imports remain.

- [ ] **Step 1: Remove old cover imports**

Delete lines 9–10:
```ts
import * as beyondOilCovers from "../../content/stories/beyond-oil.cover";
import * as worldComesCovers from "../../content/stories/the-world-comes-to-uae.cover";
```

- [ ] **Step 2: Remove STORY_COMPONENTS constant**

Delete the entire `STORY_COMPONENTS` constant (lines 15–32):
```ts
const STORY_COMPONENTS: Record<string, Record<string, React.FC<{ title?: string }>>> = {
  "beyond-oil": { ... },
  "the-world-comes-to-uae": { ... },
};
```

- [ ] **Step 3: Remove storyComponents variable**

Delete line 69:
```ts
const storyComponents = STORY_COMPONENTS[slug] ?? {};
```

- [ ] **Step 4: Update MDXRemote usage**

On line 91, change:
```tsx
<MDXRemote {...mdxSource} components={storyComponents} />
```
to:
```tsx
<MDXRemote {...mdxSource} components={{}} />
```

- [ ] **Step 5: Fix related datasets org link**

On line 101, change:
```tsx
href={`/@moi-demo/${slug}`}
```
to:
```tsx
href={`/@datopian-research/${slug}`}
```

- [ ] **Step 6: Verify**

Run `npm run typecheck`. No errors from this file. Run `npm run dev` and navigate to `/stories` — any existing stories should still render without errors.

- [ ] **Step 7: Commit**

```bash
git add pages/stories/[slug].tsx
git commit -m "feat: remove UAE chart components from story page"
```

---

## Task 9: Replace story content and cover SVGs

**Files:**
- Delete: `content/stories/beyond-oil.mdx`, `content/stories/beyond-oil.cover.ts`
- Delete: `content/stories/the-world-comes-to-uae.mdx`, `content/stories/the-world-comes-to-uae.cover.ts`
- Delete: `public/images/story-covers/beyond-oil.svg`, `public/images/story-covers/the-world-comes-to-uae.svg`
- Create: `content/stories/open-science-rising.mdx`
- Create: `content/stories/open-science-rising.cover.ts`
- Create: `content/stories/data-for-health.mdx`
- Create: `content/stories/data-for-health.cover.ts`
- Create: `public/images/story-covers/open-science-rising.svg`
- Create: `public/images/story-covers/data-for-health.svg`

- [ ] **Step 1: Delete old story files**

```bash
rm content/stories/beyond-oil.mdx
rm content/stories/beyond-oil.cover.ts
rm content/stories/the-world-comes-to-uae.mdx
rm content/stories/the-world-comes-to-uae.cover.ts
rm public/images/story-covers/beyond-oil.svg
rm public/images/story-covers/the-world-comes-to-uae.svg
```

- [ ] **Step 2: Create open-science-rising.cover.ts**

Create `content/stories/open-science-rising.cover.ts`:
```ts
export {};
```

- [ ] **Step 3: Create data-for-health.cover.ts**

Create `content/stories/data-for-health.cover.ts`:
```ts
export {};
```

- [ ] **Step 4: Create open-science-rising.mdx**

Create `content/stories/open-science-rising.mdx`:
```mdx
---
title: "The Rise of Open Science"
date: "2026-03-24"
description: "How open-access mandates and preprint culture are accelerating the pace of scientific discovery by making research data freely available to all."
relatedDatasets: []
---

For most of the twentieth century, scientific knowledge lived behind paywalls. A researcher in Nairobi, a student in São Paulo, a public health official in Manila — all faced the same barrier: pay to read, or go without. The internet changed everything except the business model.

That began to shift in the early 2000s, when a handful of funding agencies started attaching conditions to their grants: if public money paid for research, the public should be able to read it. The Budapest Open Access Initiative of 2002 gave this movement a name and a philosophy. arXiv, the preprint server founded at Los Alamos in 1991, gave it a working proof of concept.

## The FAIR Principles

In 2016, a group of researchers published what became the guiding framework for open research data: the FAIR principles. Data should be **Findable** — assigned persistent identifiers, indexed in searchable resources. **Accessible** — retrievable via open protocols, with clear licence terms. **Interoperable** — described with shared vocabularies so that datasets from different sources can be combined. **Reusable** — richly described so that a researcher who didn't collect the data can understand and build on it.

FAIR is not open access by another name. A dataset can be FAIR and still be proprietary — discoverable and well-described but accessible only to those with authorisation. But in practice, the two movements reinforce each other. Funders who require open access increasingly also require FAIR data management plans.

## Preprints and the Speed of Science

The COVID-19 pandemic compressed a decade of open-science adoption into eighteen months. Researchers posted findings to medRxiv and bioRxiv before peer review. Public health agencies cited preprints in policy briefings. The genome sequence of SARS-CoV-2 was shared on a public database within days of the first cases being identified.

The tradeoffs were visible in real time: faster dissemination, but also faster spread of errors. A preprint claiming a common heart drug worsened outcomes was downloaded hundreds of thousands of times before being retracted. The scientific community is still working through what a healthier preprint culture looks like.

## Data Repositories as Infrastructure

Underlying the open science movement is a layer of infrastructure that rarely gets headlines: the data repositories. Zenodo, run by CERN and the European Commission, hosts over three million research outputs. Figshare, the UK Data Service, Dryad, the Harvard Dataverse — each serves a different community with different norms and different data types.

What has become clear is that data sharing requires more than good intentions. It requires repositories with sustainable funding, curation staff who can check and improve metadata, and community standards that tell researchers what a well-described dataset actually looks like.

The portal you are browsing now is part of that infrastructure. Every dataset here carries the metadata needed to find it, understand it, and reuse it — a small contribution to the larger project of making scientific knowledge a public good.
```

- [ ] **Step 5: Create data-for-health.mdx**

Create `content/stories/data-for-health.mdx`:
```mdx
---
title: "Data for Better Health"
date: "2026-03-24"
description: "How openly shared epidemiological and clinical datasets are transforming public health research and enabling faster responses to emerging health challenges."
relatedDatasets: []
---

In the summer of 2003, a novel coronavirus spread from Guangdong province to thirty-seven countries in a matter of weeks. The scientific response was swift by the standards of the time — the genome was sequenced, diagnostic tests were developed, and transmission chains were mapped. But the data underpinning that response lived in disconnected silos: hospital records in one system, laboratory results in another, travel data in a third.

The lesson was not lost on the research community. Over the following decade, a quiet revolution in health data sharing began to take shape.

## Disease Surveillance Goes Open

The Global Health Observatory, maintained by the World Health Organisation, now publishes over a thousand indicator datasets covering mortality, disease burden, health system capacity, and risk factors across nearly every country in the world. The data is freely downloadable, documented in multiple languages, and updated on a regular cycle.

At the national level, many countries have followed suit. The United States Centers for Disease Control publishes granular surveillance data on influenza, COVID-19, foodborne illness, and dozens of other conditions. The European Centre for Disease Prevention and Control does the same for the EU. These datasets have become foundational inputs for academic research, insurance actuaries, hospital capacity planners, and journalists alike.

## Clinical Trials and the Reproducibility Problem

Clinical trials generate some of the most consequential data in science — evidence about whether treatments work, for whom, and at what cost. For most of the twentieth century, that data stayed with the pharmaceutical companies and academic medical centres that ran the trials. Negative results went unpublished. Subgroup analyses were cherry-picked.

The AllTrials campaign, launched in 2013, pushed for registration of all trials and publication of all results. The International Committee of Medical Journal Editors made trial registration a condition of publication. Regulatory agencies in the US and EU began requiring data sharing as a condition of approval for some drug categories.

The result is not a solved problem — compliance remains uneven, and the infrastructure for sharing individual patient data while preserving privacy is still being built. But the direction of travel is clear.

## Genomic Data and the Population Studies

Biobanks — repositories of biological samples and associated health data donated by research participants — have become engines of discovery. The UK Biobank holds data on half a million participants. The All of Us Research Program in the United States is building a cohort that reflects the full diversity of the American population.

These resources have accelerated research into the genetic architecture of common diseases, drug responses, and the long-term effects of environmental exposures. They have also raised new questions about consent, privacy, and who benefits from research conducted on populations that have historically been excluded from clinical trials.

The datasets available on this portal represent a small slice of this broader ecosystem — but they are part of the same project: making health data available to the researchers, policymakers, and practitioners who need it to improve human wellbeing.
```

- [ ] **Step 6: Create cover SVGs**

Create `public/images/story-covers/open-science-rising.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#eff6ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#dbeafe;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg)" />
  <text x="400" y="180" font-family="Inter, sans-serif" font-size="32" font-weight="800" fill="#1e40af" text-anchor="middle">The Rise of Open Science</text>
  <text x="400" y="230" font-family="Inter, sans-serif" font-size="16" fill="#3b82f6" text-anchor="middle">PortalJS Research Data Portal</text>
</svg>
```

Create `public/images/story-covers/data-for-health.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#eff6ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#dbeafe;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg)" />
  <text x="400" y="180" font-family="Inter, sans-serif" font-size="32" font-weight="800" fill="#1e40af" text-anchor="middle">Data for Better Health</text>
  <text x="400" y="230" font-family="Inter, sans-serif" font-size="16" fill="#3b82f6" text-anchor="middle">PortalJS Research Data Portal</text>
</svg>
```

- [ ] **Step 7: Verify**

Run `npm run dev`. Navigate to `http://localhost:3000/stories`. Confirm:
- Two story cards appear: "The Rise of Open Science" and "Data for Better Health"
- Story cover images render (blue gradient SVGs)
- Click each story — prose renders correctly, no errors

- [ ] **Step 8: Commit**

```bash
git add content/stories/ public/images/story-covers/
git rm content/stories/beyond-oil.mdx content/stories/beyond-oil.cover.ts
git rm content/stories/the-world-comes-to-uae.mdx content/stories/the-world-comes-to-uae.cover.ts
git rm public/images/story-covers/beyond-oil.svg public/images/story-covers/the-world-comes-to-uae.svg
git commit -m "feat: replace UAE stories with research placeholder stories"
```

---

## Final verification

- [ ] Run `npm run dev` and check each page: `/`, `/stories`, `/stories/open-science-rising`, `/stories/data-for-health`, `/search`, `/organizations`, `/groups`
- [ ] Confirm no UAE branding remains visible anywhere
- [ ] Confirm accent colour is blue throughout (links, hover states, badges)
- [ ] Confirm no console errors on any page
- [ ] Run `npm run typecheck` — no new type errors
