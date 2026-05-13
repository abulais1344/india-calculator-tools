# CalcVerse Architecture Documentation

## System Overview

CalcVerse is a **Next.js 15** application with **programmatic SEO** architecture, featuring dynamic route generation for scaling content to hundreds of calculator combinations.

```
┌─────────────────────────────────────┐
│  Vercel / Next.js Runtime           │
├─────────────────────────────────────┤
│  App Router (app/)                  │
│  ├─ Dynamic Routes                  │
│  │  ├─ /percentage/[slug]          │ ← Handles 438-out-of-600, etc.
│  │  ├─ /electricity/[slug]         │ ← Handles JUSCO, MSEDCL, etc.
│  ├─ Static Pages                    │
│  │  ├─ / (Home)                    │
│  │  ├─ /[specific-calculators]     │ ← Future: migrate HTML pages
│  └─ API Routes (optional future)   │
├─────────────────────────────────────┤
│  SEO Layer                          │
│  ├─ Metadata API (Next.js)         │ ← generateMetadata()
│  ├─ Schema Markup (JSON-LD)        │ ← FAQ, Breadcrumb, HowTo
│  ├─ Sitemap Generation             │ ← generate-sitemap.mjs
│  └─ Robots.txt                     │
├─────────────────────────────────────┤
│  Content Layer                      │
│  ├─ lib/seo-utils.ts              │ ← Core SEO logic
│  ├─ lib/faq-data.ts               │ ← FAQ content
│  ├─ lib/calculators.ts            │ ← Calculator registry
│  └─ types/index.ts                │ ← TypeScript interfaces
├─────────────────────────────────────┤
│  Component Layer                    │
│  ├─ FAQSection.tsx                │ ← Reusable FAQ component
│  ├─ RelatedCalculators.tsx         │ ← Internal linking
│  └─ Schema.tsx                    │ ← JSON-LD injection
└─────────────────────────────────────┘
```

## Design Principles

### 1. DRY (Don't Repeat Yourself)
- **Centralized SEO logic** in `lib/seo-utils.ts`
- **Reusable components** for FAQ, related calculators, schema
- **Single source of truth** for calculator metadata in `lib/calculators.ts`
- **Result**: Easy to fix/update across entire site

### 2. Scalability
- **Programmatic content generation** - Add URLs without changing code
- **Dynamic routing** - Supports unlimited percentage combinations
- **Static generation** - Pre-renders top queries for performance
- **ISR (Incremental Static Regeneration)** - Updates without full rebuild

### 3. Performance
- **Code splitting** - Each route gets only needed code
- **Lazy loading** - Components load as needed
- **Caching strategy** - 1 hour server cache + 24h stale-while-revalidate
- **Optimized delivery** - Vercel Edge Network

### 4. SEO-First
- **Metadata-driven** - All SEO done via Next.js Metadata API
- **Schema at scale** - FAQ, Breadcrumb, HowTo on every page
- **Internal linking** - Related calculators on each page
- **Mobile-optimized** - Responsive design with fast loading

## Data Flow

### Dynamic Percentage Page Flow

```
URL Input: /percentage/438-out-of-600
    ↓
[slug] Route Matcher
    ↓
parsePercentageUrlSlug() → { obtained: 438, total: 600 }
    ↓
Parallel Execution:
├─ calculatePercentage(438, 600) → 73%
├─ getGradeClassification(73) → A (Good)
├─ generatePercentageTitle(438, 600, 73) → "438 out of 600 = 73%..."
├─ generatePercentageMetaDescription(...) → "Calculate 438 out of 600..."
├─ generateFAQSchema(PERCENTAGE_FAQS) → FAQ JSON-LD
└─ getRelatedCalculators() → [5 related calcs]
    ↓
Render Page Component with:
├─ Metadata (title, description, OG tags)
├─ Schema scripts (FAQ, Breadcrumb, HowTo)
├─ Result display (73%)
├─ Step-by-step explanation
├─ FAQ section
└─ Related calculators
    ↓
Output: Full SEO-optimized HTML
```

### SEO Content Generation

```
generateStatic Pages (Build Time)
    ├─ generateStaticParams() → [ {slug: "438-out-of-600"}, ... ]
    └─ generateMetadata({ params }) → Complete metadata
        ├─ title
        ├─ description
        ├─ canonical
        ├─ openGraph
        ├─ twitter
        └─ robots

Sitemap Generation (Manual: npm run generate-sitemap)
    ├─ Walks HTML files in /public (static pages)
    ├─ Generates TOP_PERCENTAGES URLs (GSC-based)
    ├─ Generates ELECTRICITY_PROVIDERS URLs
    └─ Creates /public/sitemap.xml with priorities
```

## Technology Stack

### Core
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety across codebase
- **Tailwind CSS** - Utility-first styling

### SEO & Content
- **Next.js Metadata API** - Dynamic meta tags & OG
- **JSON-LD** - Structured data markup
- **sitemap.mjs** - Programmatic sitemap generation

### Development
- **ESLint** - Code quality/linting
- **Node.js 18+** - Runtime

### Deployment
- **Vercel** - Recommended hosting (auto-optimized for Next.js)

## File Structure Explained

```
app/
├── layout.tsx              # Root layout + header/footer
│   └─ Applies to all pages
│   └─ Contains global meta tags, GA script
│   └─ Header, footer components
│   └─ 1000 lines max (keep focused)
│
├── page.tsx                # Homepage (/)
│   └─ Calculator category grid
│   └─ Featured programmatic page CTA
│   └─ Static generation recommended
│
├── globals.css             # Tailwind imports + custom CSS
│   └─ Body typography defaults
│   └─ Utility class definitions
│   └─ Responsive breakpoints
│
├── components/             # Reusable components
│   ├─ FAQSection.tsx       # FAQ accordion with schema
│   ├─ RelatedCalculators.tsx # Dynamic internal links
│   └─ Schema.tsx           # JSON-LD injection helper
│
├── percentage/             # Programmatic percentage route
│   └─ [slug]/page.tsx      # Dynamic page component
│       ├─ generateMetadata() - Dynamic SEO metadata
│       ├─ generateStaticParams() - Pre-renders top URLs
│       ├─ Page component - Renders UI
│       └─ 300+ lines (pagination, complex logic)
│
└── electricity/            # Programmatic electricity route
    └─ [slug]/page.tsx      # Similar structure to percentage

lib/
├── seo-utils.ts            # Core SEO utilities (500+ lines)
│   ├─ generateFAQSchema()           # FAQ JSON-LD
│   ├─ generateBreadcrumbSchema()    # Breadcrumb JSON-LD
│   ├─ generateHowToSchema()         # HowTo JSON-LD
│   ├─ generatePercentageTitle()     # CTR-optimized titles
│   ├─ generatePercentageMetad...()  # CTR-optimized descriptions
│   ├─ calculatePercentage()         # Core calculation
│   ├─ getGradeClassification()      # Grade lookup
│   ├─ parsePercentageUrlSlug()      # URL → numbers
│   ├─ generatePercentageUrlSlug()   # Numbers → URL
│   ├─ validatePercentageInput()     # Data validation
│   ├─ getCanonicalUrl()            # URL builder
│   └─ ELECTRICITY_PROVIDERS         # Provider data
│
├── faq-data.ts             # FAQ content (200+ lines)
│   ├─ PERCENTAGE_FAQS      # Q&A for percentage calcs
│   ├─ ELECTRICITY_FAQS     # Q&A for electricity bills
│   ├─ EMI_FAQS             # Q&A for loans
│   ├─ TAX_CALCULATOR_FAQS  # Q&A for tax
│   ├─ SIP_FAQS             # Q&A for investments
│   └─ getFAQsByCategory()  # Get FAQs by type
│
└── calculators.ts          # Calculator registry (200+ lines)
    ├─ CALCULATORS[]        # All calculator metadata
    ├─ getCalculatorById()  # Lookup by ID
    ├─ getRelatedCalculators() # For internal linking
    └─ CALCULATOR_CATEGORIES # Group by type

types/
└── index.ts                # TypeScript interfaces
    ├─ SEOMetadata          # Metadata shape
    ├─ FAQItem             # FAQ question/answer
    ├─ FAQSchema           # JSON-LD FAQ schema
    ├─ Calculator          # Calculator metadata
    ├─ ElectricityProvider  # Electricity provider data
    └─ PercentageCalculationResult # Calculation output

scripts/
└── generate-sitemap.mjs    # Sitemap generator (150+ lines)
    ├─ walkHtml()           # Find static HTML files
    ├─ generatePercentageURLs() # Dynamic URLs
    ├─ generateElectricityURLs() # Dynamic URLs
    ├─ generateSitemap()    # Create XML
    └─ Outputs: /public/sitemap.xml

public/
├── robots.txt              # SEO bot rules
├── sitemap.xml             # Generated automatically
└── images/
    ├─ logo.png
    ├─ og-image.png         # OpenGraph preview
    └─ favicon.ico

Root Files
├── package.json            # Dependencies, scripts
├── tsconfig.json           # TypeScript config (path mappings)
├── next.config.js          # Next.js config (caching, headers)
├── .eslintrc.json          # Linting rules
├── .env.example            # Env variable template
├── README.md               # Project overview
├── ARCHITECTURE.md         # This file
├── SEO-IMPLEMENTATION-CHECKLIST.md # Implementation tasks
└── GSC-INTEGRATION-GUIDE.md # Google Search Console setup
```

## Dynamic Route Generation

### How `/percentage/[slug]` Works

**1. File Structure**
```
app/
  percentage/
    [slug]/
      page.tsx     ← Next.js recognizes [slug] as dynamic
```

**2. Request Matching**
```
User visits: /percentage/438-out-of-600
Router: "slug" parameter = "438-out-of-600"
```

**3. URL Parsing**
```typescript
parsePercentageUrlSlug("438-out-of-600")
  ├─ Regex: /^(\d+)-out-of-(\d+)$/
  ├─ Extract: obtained=438, total=600
  └─ Validate: Both numbers valid & reasonable range
```

**4. Pre-rendering at Build Time**
```typescript
export async function generateStaticParams() {
  return TOP_PERCENTAGES.map(({ obtained, total }) => ({
    slug: `${obtained}-out-of-${total}`  // "438-out-of-600"
  }));
}
```

**5. Metadata Generation**
```typescript
export async function generateMetadata({ params }) {
  const { obtained, total } = parsePercentageUrlSlug(params.slug);
  const percentage = calculatePercentage(obtained, total);
  
  return {
    title: generatePercentageTitle(obtained, total, percentage),
    description: generatePercentageMetaDescription(obtained, total, percentage),
    // ... more metadata
  };
}
```

**6. Page Rendering**
```typescript
export default function PercentageCalculatorPage({ params }) {
  const { obtained, total } = parsePercentageUrlSlug(params.slug);
  // Render page with calculated data
}
```

## SEO Strategy

### Content Scaling
```
Current: Fixed HTML pages (50 URLs)
After:   Fixed + Dynamic (200+ URLs)
         └─ Programmatic: /percentage/*, /electricity/*
         └─ One JS bundle serves all variations
         └─ Reduces maintenance 50%
```

### Internal Linking
```
Every page gets:
├─ Breadcrumbs (navigation + schema)
├─ Related calculators (5-6 links)
├─ Footer with major calculators
└─ Result: 50+ internal links per page
   Helps Google crawl faster & distributes PageRank
```

### Structured Data Strategy
```
FAQ Schema
  └─ Google shows Q&A in search results
  └─ Increases CTR by 10-20%
  
Breadcrumb Schema
  └─ Helps Google understand hierarchy
  └─ Shows breadcrumb in search results
  
HowTo Schema
  └─ Rich results for calculation steps
  └─ Users see how-to in search preview
  
Result: 3 different rich result types on every page
```

### Crawl Efficiency
```
Sitemap (60+ URLs)
  ├─ Tells Google exactly what to crawl
  ├─ No mystery URLs
  └─ Fast crawl coverage

Robots.txt
  ├─ Blocks AI bots (save bandwidth)
  ├─ References sitemap
  └─ no-follow on dynamic sort/filter

Meta Tags
  ├─ Canonical URLs prevent duplicates
  ├─ noindex invalid queries
  └─ nofollow on filter/tracking params
```

## Performance Optimization

### Code Splitting
```
Each route gets minimal code:
  /percentage/438-out-of-600
    └─ Only percentage page + shared layout
    └─ Not other calculators' bundles
    
Result: ~20KB page, 100KB shared layout
        vs. 500KB if bundled together
```

### Static Generation
```
Top 12 percentages generated at build time:
  ├─ /percentage/438-out-of-600 (pre-built HTML)
  ├─ /percentage/380-out-of-500 (pre-built HTML)
  └─ ... (10 more)

Result: Served instantly from Vercel Edge
        Response time: <50ms
```

### Caching Strategy
```
Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400

Breakdown:
├─ max-age=0: Don't cache in browser (always fresh)
├─ s-maxage=3600: Cache on server for 1 hour
├─ stale-while-revalidate=86400: Serve stale for 24h while updating
└─ public: CDN can cache

Result:
  ├─ First user: Gets fresh page (1-2s)
  ├─ Next 3,600 seconds: All users get cached (50ms)
  ├─ After 3,600s: Serves old page while regenerating
  └─ Net: 99.99% fast responses, always up-to-date
```

## Maintenance & Updates

### Adding New Electricity Provider

1. **Add to provider list** (`lib/seo-utils.ts`):
```typescript
ELECTRICITY_PROVIDERS.push({
  slug: 'new-provider-bill-calculator',
  name: 'New Provider',
  state: 'State Name',
  unitRate: 8.5
});
```

2. **Generate static params** (automatic)
3. **Rebuild sitemap**:
```bash
npm run generate-sitemap
```

4. **Deploy**:
```bash
git push  # Auto-deploys on Vercel
```

5. **Verify in GSC**: Check new URL indexed

### Fixing High-Impression Query

1. **Find in GSC**: "438 out of 600 as percentage" - 76 impressions, 0% CTR
2. **Update metadata** (`lib/seo-utils.ts`):
```typescript
function generatePercentageMetaDescription(obtained, total, percentage) {
  // Make it include the answer percentage
  return `${obtained} out of ${total} = ${percentage}% | Formula & explanation`;
}
```
3. **Build & deploy**: `npm run build && git push`
4. **Wait 1-2 weeks** for Google to re-crawl
5. **Monitor CTR** in GSC

## Future Extensibility

### Blog Integration
```
/blog/[query]/page.tsx
  ├─ generateStaticParams() returns top 100 questions
  ├─ Metadata: Auto-generated from query
  ├─ Content: Could pull from CMS or database
  └─ Links: To related calculators
```

### API Layer (Future)
```
/api/calculate/percentage → JSON response
  ├─ Accepts: ?obtained=438&total=600
  ├─ Returns: { percentage: 73, grade: "A", ... }
  └─ Enables: Mobile app, embeds, integrations
```

### Database Integration (Optional)
```
Features to enable:
  ├─ Save favorite calculations
  ├─ User accounts
  ├─ Usage analytics
  └─ Premium features
```

## Deployment Checklist

- [ ] All environment variables set
- [ ] `npm run build` succeeds
- [ ] `npm run generate-sitemap` generates 60+ URLs
- [ ] Sitemap XML is valid
- [ ] Dynamic pages render correctly
- [ ] schema.org validates all JSON-LD
- [ ] Robots.txt references sitemap
- [ ] GSC domain verification done
- [ ] Sitemap submitted to GSC
- [ ] Core Web Vitals monitored

---

**Architecture Last Updated**: May 2024
**Next.js Version**: 15.0+
**React Version**: 19.0+
**Maintained For**: Long-term scalability and SEO optimization
