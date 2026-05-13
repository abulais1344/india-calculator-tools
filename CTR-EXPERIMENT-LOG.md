# CTR Experiment Log

## Scope
- Focus cluster 1: Percentage pages
- Focus cluster 2: Electricity pages
- Goal: Improve CTR without losing average position

## Rules
- Run changes in controlled batches.
- Keep one primary hypothesis per batch.
- Compare like-for-like windows in Google Search Console.
- Judge by position buckets, not only overall CTR.

## Baseline Snapshot (2026-05-13)
- Property: https://calcverse.in/
- Page filter used: percentage page group (from GSC screenshot session)
- Observed sample values:
  - Total impressions: 643 vs 93 (compare window shown)
  - Average CTR: 0.2% vs 0%
  - Average position: 7.9 vs 6
- Interpretation: visibility growth is strong; click capture is the bottleneck.

## Active Experiments

| ID | Date | Cluster | Hypothesis | Change Set | Status | Review Date |
|---|---|---|---|---|---|---|
| EXP-001 | 2026-05-13 | Percentage + Electricity | More answer-first titles and query-aligned meta snippets improve CTR at similar positions | Updated title/description templates, query-style FAQs, top-page trust hooks, and cluster sitemaps | Running | 2026-05-27 |

## Change Set Details (EXP-001)
- Title/meta rewrites for both clusters:
  - lib/seo-utils.ts
- Query-matching FAQ rewrites:
  - lib/faq-data.ts
- Above-the-fold trust/freshness hooks:
  - app/percentage/[slug]/page.tsx
  - app/electricity/[slug]/page.tsx
- Dedicated cluster crawl surfaces:
  - scripts/generate-sitemap.mjs
  - public/sitemap-percentage.xml
  - public/sitemap-electricity.xml
  - public/robots.txt

## 14-Day Review Template

### 1) Performance Delta
- Date range A (new):
- Date range B (old):
- Cluster: Percentage / Electricity
- Clicks delta:
- Impressions delta:
- CTR delta:
- Avg position delta:

### 2) Position-Bucket CTR
- Bucket 1-3 CTR:
- Bucket 4-6 CTR:
- Bucket 7-10 CTR:
- Bucket 11-20 CTR:

### 3) Query-Level Winners
- Top improving queries (by CTR):
- Top improving queries (by clicks):
- New query entries (impressions > 20):

### 4) Query-Level Losses
- Biggest CTR drops:
- Biggest position drops:
- Suspected reason:

### 5) Decision
- Keep changes as-is / Iterate titles / Iterate descriptions / Expand pages
- Next experiment ID:
- Owner:
- Notes:

## Next Candidate Experiments
- EXP-002: Provider-specific Electricity title variants (short vs detailed)
- EXP-003: Percentage intent variants in first 140 chars of page copy
- EXP-004: FAQ wording A/B by high-impression query families
