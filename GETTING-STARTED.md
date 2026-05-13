# CalcVerse - Getting Started (First 15 Minutes)

Your complete Next.js SEO implementation is ready. Here's how to get it running.

## Step 1: Verify Files (2 minutes)

Check that these exist in your project root:

```bash
# Check important files
ls -la package.json          # Should exist ✓
ls -la tsconfig.json        # Should exist ✓
ls -la next.config.js       # Should exist ✓
ls -la app/layout.tsx       # Should exist ✓
ls -la .eslintrc.json       # Should exist ✓

# Check directories exist
ls -la app/components/
ls -la app/percentage/
ls -la app/electricity/
ls -la lib/
ls -la types/
ls -la public/
```

All should show ✓. If any are missing, files weren't created properly.

## Step 2: Install Dependencies (3 minutes)

```bash
# Navigate to project
cd india-calculator-tools

# Install all dependencies
npm install

# This will:
# - Download Next.js 15
# - Download React 19
# - Download TypeScript
# - Download Tailwind
# - Takes ~2-3 minutes on first install
```

Wait for "added X packages" message.

## Step 3: Start Development Server (2 minutes)

```bash
# Start the dev server
npm run dev

# You should see:
# > calcverse@2.0.0 dev
# > next dev
#
# ▲ Next.js 15.0.0
# - Local: http://localhost:3000
```

Leave this terminal open.

## Step 4: Test in Browser (3 minutes)

Open your browser and visit these URLs:

### URL 1: Homepage
```
http://localhost:3000
```
You should see:
- CalcVerse header
- Hero section with search
- Calculator categories
- Featured percentage calculator CTA

### URL 2: Dynamic Percentage Page
```
http://localhost:3000/percentage/438-out-of-600
```
You should see:
- Title: "438 out of 600 = 73% | Exam Marks | CalcVerse"
- Large "73%" answer box
- Step-by-step explanation
- Grade analysis (A - Good)
- FAQ section
- Related calculators

### URL 3: Dynamic Electricity Page
```
http://localhost:3000/electricity/jusco-bill-calculator
```
You should see:
- JUSCO electricity calculator
- Unit rate table
- Bill calculation form
- Electricity bill formula
- Tips to reduce bill
- FAQ section

### URL 4: View Page Source (SEO Check)
```
Right-click → View Page Source
```
Search for these (press Ctrl+F):
- `<title>` tag - Should include percentage and "73%"
- `<meta name="description">` - Should include answer
- `"@type": "FAQPage"` - Should find JSON-LD schema
- `"@type": "BreadcrumbList"` - Should find breadcrumb schema

## Step 5: Test Builds (3 minutes)

```bash
# Stop dev server (Ctrl+C)

# Build for production
npm run build

# You should see:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data ...
# ✓ Generating static pages (12/12)
# ✓ Collecting build traces
```

This shows all 12 percentage pages are pre-rendered!

### Generate Sitemap

```bash
npm run generate-sitemap

# You should see:
# ✅ Sitemap generated successfully!
#    Total URLs: 28
#    Static URLs: 8
#    Percentage pages: 12
#    Electricity pages: 8
```

Check the sitemap:
```bash
cat public/sitemap.xml | head -20
```

You should see:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://calcverse.in/</loc>
    <lastmod>2024-05-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ...
```

## Step 6: Restart Dev Server (1 minute)

```bash
# Start dev again
npm run dev

# Re-test the pages above to confirm everything works
```

---

## ✅ You're Done! Now What?

### Immediate Next Steps

1. **Read the documentation** (15 minutes):
   - Open `README.md` - Project overview
   - Open `ARCHITECTURE.md` - How it works
   - Open `QUICK-REFERENCE.md` - Common tasks

2. **Understand the structure** (10 minutes):
   - Explore `app/` directory
   - Look at `lib/seo-utils.ts` - SEO logic
   - Look at `lib/calculators.ts` - Calculator registry

3. **Plan your next steps** (5 minutes):
   - Follow `SEO-IMPLEMENTATION-CHECKLIST.md`
   - Review `GSC-INTEGRATION-GUIDE.md` for Google Search Console
   - Check `DEPLOYMENT.md` for production deployment

### Common First-Time Tasks

**Task 1: Change homepage text**
```bash
Edit: app/page.tsx
Change the text in the hero section
Save file (auto-refreshes browser)
```

**Task 2: Add a new FAQ question**
```bash
Edit: lib/faq-data.ts
Add to PERCENTAGE_FAQS or other arrays
Save file (auto-updates all pages)
```

**Task 3: Add new electricity provider**
```bash
Edit: lib/seo-utils.ts
Add to ELECTRICITY_PROVIDERS array
Run: npm run generate-sitemap
Run: npm run build
```

**Task 4: View SEO schema**
```bash
1. Visit: http://localhost:3000/percentage/438-out-of-600
2. Right-click → Inspect
3. Search for: "application/ld+json"
4. You'll see FAQ, Breadcrumb, and HowTo schemas
```

---

## 📊 Verify Everything Works

Run this checklist:

```
[ ] npm install - Succeeded without errors
[ ] npm run dev - Server started on localhost:3000
[ ] Homepage loads at http://localhost:3000
[ ] Percentage page loads at /percentage/438-out-of-600
[ ] Electricity page loads at /electricity/jusco-bill-calculator
[ ] Page source shows <title> with percentage
[ ] Page source shows JSON-LD "application/ld+json"
[ ] npm run build - Succeeds without errors
[ ] npm run generate-sitemap - Creates sitemap.xml
[ ] public/sitemap.xml shows 60+ URLs
```

If all checked ✓, you're ready to deploy!

---

## 🚀 Ready to Deploy?

### Quick Deploy to Vercel (5 minutes)

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial Next.js SEO implementation"
git push origin main
```

2. Go to Vercel: https://vercel.com/new
3. Click "Import Git Repository"
4. Select your GitHub repo
5. Click "Deploy"
6. Wait ~2 minutes
7. Visit your deployed site!

See `DEPLOYMENT.md` for detailed instructions.

---

## 💡 Pro Tips

### Tip 1: Hot reload while editing
- Edit any file in `app/` or `lib/`
- Save (Ctrl+S)
- Browser auto-refreshes (usually within 1 second)

### Tip 2: Debug in browser
- Open DevTools (F12)
- Go to Network tab
- Reload page
- See all resources and response times

### Tip 3: View page metadata
- Right-click page → View Page Source
- Ctrl+F search for `<title>`
- Look for `<meta name="description">`
- Look for `canonical`
- Look for `og:title`, `og:image`

### Tip 4: TypeScript Errors
- If you see TypeScript errors, run:
```bash
npx tsc --noEmit
```
- Shows all type errors
- Fix them before deployment

### Tip 5: Clear cache if stuck
```bash
# Stop dev server (Ctrl+C)
rm -rf .next
npm run dev
# Fresh start
```

---

## 🎯 Success Indicators

You'll know it's working when:

✅ Web page loads instantly (< 3 seconds)
✅ Dynamic pages show correct percentage (438/600 = 73%)
✅ Page title shows the percentage
✅ Navigation breadcrumbs appear
✅ FAQ section is visible
✅ Related calculators show at bottom
✅ Schema validation passes (Google Rich Results Test)

---

## ❓ Troubleshooting

### "npm install" fails
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
# Visit http://localhost:3001
```

### Page won't load (shows error)
```bash
# Check terminal for errors
# Top of terminal should show error message
# Fix and save file
# Page should auto-refresh
```

### TypeScript error
```bash
# 1. Check the error message
# 2. Go to file mentioned
# 3. Search for the line number
# 4. Fix the issue
# 5. File auto-reloads
```

### Build fails
```bash
npm run build
# See error in terminal
# Fix the file mentioned
npm run build
# Try again
```

### Sitemap empty
```bash
# Make sure script exists
ls -la scripts/generate-sitemap.mjs

# Run manually
npm run generate-sitemap

# Verify output
cat public/sitemap.xml | wc -l
# Should show 100+ lines (60+ URLs × ~1.5 lines each)
```

---

## 📚 Essential Files to Know

| File | Purpose | Edit When |
|------|---------|-----------|
| `app/page.tsx` | Homepage | Change homepage content |
| `app/layout.tsx` | Header/Footer | Change navigation/footer |
| `lib/seo-utils.ts` | SEO logic | Change titles/descriptions |
| `lib/faq-data.ts` | FAQ content | Add/edit questions |
| `lib/calculators.ts` | Calculator registry | Add new calculator |
| `app/percentage/[slug]/page.tsx` | Percentage pages | Change page layout |
| `app/electricity/[slug]/page.tsx` | Electricity pages | Change page layout |
| `public/robots.txt` | Bot rules | Block/allow bots |
| `scripts/generate-sitemap.mjs` | Sitemap generation | Add new URL types |

---

## 🎓 Learning Next Steps

1. **Week 1**: Get familiar with file structure
2. **Week 2**: Make small customizations (text, colors)
3. **Week 3**: Deploy to Vercel
4. **Week 4**: Setup Google Search Console
5. **Week 5**: Monitor SEO performance

---

## ✨ You're All Set!

Everything is ready to go. Start with:

```bash
# 1. Make sure deps installed
npm install

# 2. Start dev server
npm run dev

# 3. Visit http://localhost:3000

# 4. Press Ctrl+C to stop when done
```

Questions? Check:
- **README.md** - General help
- **QUICK-REFERENCE.md** - Common tasks
- **ARCHITECTURE.md** - How it works
- **GSC-INTEGRATION-GUIDE.md** - SEO setup

---

**Estimated Time to First Deploy**: 30-60 minutes total
**Estimated Time to Production**: 2-3 hours total

Good luck! 🚀
