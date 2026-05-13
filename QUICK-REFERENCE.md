# CalcVerse - Developer Quick Reference

A quick lookup guide for common tasks and important information.

## 🚀 Daily Commands

```bash
# Start development server (hot reload)
npm run dev
# Visit → http://localhost:3000

# Build for production
npm run build

# Start production server locally
npm start

# Generate/update sitemap with all dynamic URLs
npm run generate-sitemap

# Check code quality
npm run lint

# Verify TypeScript compilation
npx tsc --noEmit
```

## 📁 Where to Find Things

| Need | Location | Line Range |
|------|----------|------------|
| Add FAQ | `lib/faq-data.ts` | Lines 1-50 |
| Add calculator | `lib/calculators.ts` | Lines 1-100 |
| Update SEO logic | `lib/seo-utils.ts` | Entire file |
| Add percentage page | `app/percentage/[slug]/page.tsx` | Automatic |
| Add electricity page | `app/electricity/[slug]/page.tsx` | Automatic |
| Change global styles | `app/globals.css` | Entire file |
| Update homepage | `app/page.tsx` | Entire file |
| Update navigation | `app/layout.tsx` | Lines 1-50 |
| Update footer | `app/layout.tsx` | Lines 200-250 |
| Modify header | `app/layout.tsx` | Lines 50-100 |

## 🔧 Common Tasks

### Add New Electricity Provider

```typescript
// In lib/seo-utils.ts, find ELECTRICITY_PROVIDERS array:

{
  id: 'new-provider',
  name: 'New Provider Name',
  state: 'State Name',
  slug: 'new-provider-bill-calculator',
  unitRate: 8.5
}

// Then run:
npm run generate-sitemap
npm run build
```

### Add New Common Percentage

```typescript
// In lib/seo-utils.ts, find TOP_PERCENTAGES array:

{ obtained: 440, total: 600 },

// Then run:
npm run generate-sitemap
npm run build

// Tests: Visit /percentage/440-out-of-600
```

### Update FAQ Questions

```typescript
// In lib/faq-data.ts, find PERCENTAGE_FAQS:

{
  question: "Your new question here?",
  answer: "Your detailed answer here."
}

// Auto-updates on all percentage pages during build
npm run build
```

### Change Meta Description Format

```typescript
// In lib/seo-utils.ts, find generatePercentageMetaDescription():

export function generatePercentageMetaDescription(...) {
  return `Your new format: ${obtained} out of ${total} = ${percentage}%`;
}

// Applies to all pages automatically
npm run build
```

### Add Internal Link to a Page

```tsx
// In any .tsx component:

import Link from 'next/link';

<Link href="/percentage-calculator">
  Percentage Calculator
</Link>

// For SEO:
<Link href="/marks-percentage-calculator" className="text-blue-600 hover:underline">
  Calculate percentage from marks
</Link>
```

## 📊 SEO Key Metrics Location

| Metric | Tracks | Where |
|--------|--------|-------|
| Titles | CTR optimization | `lib/seo-utils.ts:generatePercentageTitle()` |
| Descriptions | CTR optimization | `lib/seo-utils.ts:generatePercentageMetaDescription()` |
| FAQ schema | Rich results | `app/components/Schema.tsx` |
| Breadcrumb | Navigation hierarchy | `app/components/RelatedCalculators.tsx` |
| Links | Internal linking | `lib/calculators.ts` → RELATED_CALCULATORS |
| Sitemap | Crawlability | `scripts/generate-sitemap.mjs` |

## 🌐 Important URLs

| Resource | URL |
|----------|-----|
| **Homepage** | http://localhost:3000 |
| **Example percentage page** | http://localhost:3000/percentage/438-out-of-600 |
| **Example electricity page** | http://localhost:3000/electricity/jusco-bill-calculator |
| **Google Rich Results Test** | https://search.google.com/test/rich-results |
| **PageSpeed Insights** | https://pagespeed.web.dev |
| **Search Console** | https://search.google.com/search-console |
| **GitHub** | https://github.com/yourusername/india-calculator-tools |
| **Production** | https://calcverse.in |

## 🐛 Debugging Common Issues

### Page returns 404
```bash
# 1. Check slug format
# Should be: "{number}-out-of-{number}"
# Example: "438-out-of-600"

# 2. Verify in lib/seo-utils.ts parsePercentageUrlSlug():
const pattern = /^(\d+)-out-of-(\d+)$/;

# 3. Test regex:
# "438-out-of-600" ✓ (matches)
# "438 out of 600" ✗ (wrong format - no dashes)
```

### Schema validation fails
```bash
# 1. Test: https://search.google.com/test/rich-results
# 2. Check /app/components/Schema.tsx for proper JSON.stringify()
# 3. Verify FAQ structure in lib/faq-data.ts
# 4. Look for unescaped quotes in FAQS
```

### Styles not applying
```bash
# 1. Check globals.css is imported in app/layout.tsx
# 2. Run: npm run build
# 3. Clear .next directory: rm -rf .next
# 4. Rebuild: npm run build
```

### Sitemap empty or missing URLs
```bash
# 1. Run: npm run generate-sitemap
# 2. Check: cat public/sitemap.xml
# 3. Verify TOP_PERCENTAGES array in scripts/generate-sitemap.mjs
# 4. Verify ELECTRICITY_PROVIDERS array exists
```

## 📈 Performance Tips

### Reduce build time
```bash
# Build cache is in .next/
# Clearing it forces full rebuild
rm -rf .next/
npm run build  # Takes longer first time
npm run build  # Faster on second build (incremental)
```

### Optimize images
```tsx
// Use Next.js Image component:
import Image from 'next/image';

<Image 
  src="/logo.png" 
  width={280} 
  height={60}
  alt="CalcVerse Logo"
/>
```

### Lazy load components
```tsx
import dynamic from 'next/dynamic';

const FAQSection = dynamic(() => import('./FAQSection'));
// Loads only when needed
```

## 🔐 Security Checklist

- ✅ No secrets in code (use .env.local)
- ✅ Input validation in `lib/seo-utils.ts:validatePercentageInput()`
- ✅ SQL injection prevention (no database yet, but ready)
- ✅ XSS prevention via React escaping
- ✅ CSRF tokens (if form added later)

## 📱 Mobile Testing

```bash
# Test on your phone:
# 1. Get your machine IP: ipconfig (Windows) or ifconfig (Mac/Linux)
# 2. Start dev server: npm run dev
# 3. On phone: http://YOUR_IP:3000
# 4. Test /percentage/438-out-of-600
# 5. Check: Touch targets, text readable, no horizontal scroll
```

## 🚀 Deployment Hints

### Pre-deployment checklist
```bash
# 1. Verify build succeeds
npm run build

# 2. Verify sitemap generates
npm run generate-sitemap

# 3. Test locally
npm start
# Visit http://localhost:3000

# 4. Commit and push
git add .
git commit -m "Pre-production deployment"
git push origin main

# 5. Vercel auto-deploys from main branch!
```

### Verify deployment
```bash
# After Vercel deployment:
# 1. Visit https://calcverse.in/percentage/438-out-of-600
# 2. Check page source for meta tags
# 3. Visit https://calcverse.in/sitemap.xml (should show 60+ URLs)
# 4. Test in Google Rich Results Test
```

## 📚 Important Constants

```typescript
// Top search queries (from GSC) - in lib/seo-utils.ts
TOP_PERCENTAGES = [
  { obtained: 438, total: 600 },  // 76 impressions, update title first!
  { obtained: 380, total: 500 },  // 72 impressions
  // ... more
]

// Electricity providers - in lib/seo-utils.ts
ELECTRICITY_PROVIDERS = [
  { id: 'jusco', name: 'JUSCO', ... },  // Best performer: 8.3% CTR
  // ... more states
]

// Categories - in lib/calculators.ts
CALCULATOR_CATEGORIES = {
  percentage: ['percentage', 'marks-percentage', ...],
  electricity: [...],
  // ... more
}
```

## 🔗 Important Imports

```typescript
// Import SEO utils
import {
  generatePercentageTitle,
  generatePercentageMetaDescription,
  calculatePercentage,
  getGradeClassification,
  parsePercentageUrlSlug,
} from '@/lib/seo-utils';

// Import types
import { FAQItem, Calculator } from '@/types';

// Import FAQs
import { PERCENTAGE_FAQS } from '@/lib/faq-data';

// Import calculators
import { getRelatedCalculators } from '@/lib/calculators';
```

## 💡 Pro Tips

### Tip 1: Preview production locally
```bash
npm run build
npm start
# Tests actual production conditions
```

### Tip 2: See all dynamic pages generated
```bash
# After build:
ls -la .next/server/app/percentage/
# Shows all generated [slug] directories
```

### Tip 3: Monitor build size
```bash
npm run build
# Shows bundle analysis
# Look for "Packages: X MB" output
```

### Tip 4: Test SEO before deploy
```bash
# 1. Start dev server: npm run dev
# 2. View page source: Ctrl+U (Windows) or Cmd+U (Mac)
# 3. Check <title>, <meta name="description">
# 4. Search for "application/ld+json" for schema
```

### Tip 5: Add custom console logging
```typescript
// In dynamic pages for debugging:
if (process.env.NODE_ENV === 'development') {
  console.log('Slug:', params.slug);
  console.log('Parsed:', parsed);
}
```

## ⚡ Hot Reload Tips

### Reloader not updating?
```bash
# 1. Save file again
# 2. Check for syntax errors
# 3. Check terminal for build errors
# 4. Ctrl+Shift+R in browser (hard refresh)
```

### Cache issues?
```bash
# Clear browser cache:
# Chrome: DevTools → Settings → Network → "Disable cache" (while DevTools open)
# Or: Hard reload → Ctrl+Shift+R

# Clear Next.js cache:
rm -rf .next node_modules/.cache
npm run dev
```

## 📞 Need Help?

Check these files first:
1. **README.md** - General setup
2. **ARCHITECTURE.md** - How things work
3. **GSC-INTEGRATION-GUIDE.md** - SEO setup
4. **This file** - Quick answers

Then:
1. Check Next.js docs: https://nextjs.org/docs
2. Check GitHub discussions
3. Test with Google's tools

## ✨ Useful Next.js Features

```typescript
// Client component interactivity
'use client';

// Server-side data fetching
export async function generateMetadata() { }

// Dynamic parameter handling
export async function generateStaticParams() { }

// Image optimization
import Image from 'next/image';

// Font optimization
import { Inter } from 'next/font/google';

// Redirects
export const redirect = () => redirect('/path');

// Not found
import { notFound } from 'next/navigation';
```

---

**Last Updated**: May 2024
**For Questions**: Check README.md or ARCHITECTURE.md first
**Deploy With**: Vercel (fastest, easiest)
**Estimate Time**: 5-30 minutes depending on task
