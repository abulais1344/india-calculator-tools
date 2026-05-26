# 30-Day CTR and Revenue Dashboard

Use this sheet every 7 days for 30 days after deployment.

## Goal

- Raise CTR from low-snippet pages that already have impressions.
- Prioritize pages near average position 5 to 15 because they have fastest CTR upside.
- Convert higher clicks into better ad and affiliate revenue.

## Weekly KPI Targets

- Site CTR target: from current baseline to at least 0.9% in 30 days.
- High-impression page target: at least 1.2% CTR for pages with 500+ weekly impressions.
- Click growth target: at least +20% week over week for optimized pages.

## Tracking Cadence

- Day 0: deploy and request indexing for updated URLs.
- Day 7: first comparison against previous 7 days.
- Day 14: keep winners, rewrite weak snippets.
- Day 21: improve internal linking on pages still below target CTR.
- Day 30: finalize winning templates and roll out to similar pages.

## Core Dashboard Table

| Date | Query Group | Landing Page | Impressions | Clicks | CTR | Avg Position | Revenue (Ad + Affiliate) | CTR Target | Gap | Action This Week |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| YYYY-MM-DD | Age intent | /age-calculator.html | 0 | 0 | 0.00% | 0.0 | 0 | 1.50% | 0.00% | Update title and snippet hooks |
| YYYY-MM-DD | Percentage intent | /percentage-calculator.html | 0 | 0 | 0.00% | 0.0 | 0 | 1.20% | 0.00% | Improve query-match examples |
| YYYY-MM-DD | Marks out-of intent | /percentage/362-out-of-500 | 0 | 0 | 0.00% | 0.0 | 0 | 1.20% | 0.00% | Test formula-first title |
| YYYY-MM-DD | Electricity unit-rate intent | /electricity/1-unit-electricity-cost-india | 0 | 0 | 0.00% | 0.0 | 0 | 1.00% | 0.00% | Add rate-year in snippet |
| YYYY-MM-DD | Provider bill-rate intent | /electricity/jusco-bill-calculator | 0 | 0 | 0.00% | 0.0 | 0 | 1.00% | 0.00% | Add city and per-unit phrase |

## Query Cluster Monitoring

Track these clusters in Search Console performance compare mode.

- age calculator of india
- x out of y as percentage
- 1 unit electricity cost in india
- provider-specific electricity rate terms
- marks percentage calculator terms

## Prioritization Rule

Always optimize in this order.

1. Impressions >= 500 and CTR < 1.0%
2. Impressions 200 to 499 and CTR < 0.8%
3. Impressions < 200 and Avg Position <= 12

## Revenue Estimation Block

Use this quick model each week.

- Expected Clicks = Impressions x CTR
- Incremental Clicks = New Clicks - Baseline Clicks
- Estimated Revenue Lift = Incremental Clicks x Revenue Per Click

Add a row per page.

| Landing Page | Baseline CTR | New CTR | Weekly Impressions | Baseline Clicks | New Clicks | Incremental Clicks | Revenue Per Click | Estimated Weekly Lift |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| /age-calculator.html | 0.30% | 1.10% | 6500 | 20 | 72 | 52 | 0.05 | 2.60 |

## Weekly Decision Checklist

- Keep: pages where CTR improved by at least +0.3 points.
- Rework: pages with flat CTR but high impressions.
- Expand: copy winning title pattern to similar slug pages.
- Internal links: add money-tool links on top pages with increasing clicks.

## 30-Day Exit Criteria

- Site-level CTR improved by at least 2x from baseline.
- At least 5 high-impression pages cross 1.0% CTR.
- Positive week-over-week click trend in at least 3 query clusters.
- Revenue trend improves for two consecutive weekly windows.
