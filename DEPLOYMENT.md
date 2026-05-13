# CalcVerse - Deployment Guide

Complete step-by-step guide to deploy CalcVerse to production.

## Quick Start (Recommended: Vercel)

Vercel is the optimal choice for Next.js. Takes ~5 minutes total.

### Step 1: Connect GitHub Repository

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your GitHub URL: `https://github.com/yourusername/india-calculator-tools`
4. Click "Import"

### Step 2: Configure Project

Form will appear:

```
Project Name: india-calculator-tools
Framework: Next.js ✓ (auto-detected)
Node Version: 20.x ✓ (recommended)
```

Keep defaults, click "Deploy"

### Step 3: Watch Deployment

Vercel shows real-time logs:
```
✅ Analyzed 25 files
✅ Installing dependencies...
✅ Building application...
✅ Generated sitemap: 62 URLs
✅ Deployed to vercel.app
```

Takes ~2-3 minutes for first deploy.

### Step 4: Custom Domain

After deployment succeeds:

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter: `calcverse.in`
4. Follow DNS instructions from your registrar
5. Vercel auto-provisions SSL certificate

**DNS Setup** (varies by registrar):
- GoDaddy: Add CNAME record
- Namecheap: Add CNAME record
- etc.

Takes 24-48 hours for DNS propagation.

### Step 5: Automatic Deployments

After initial setup, Vercel handles everything:

```
You push code → Vercel auto-builds → Deploys to production
Process: ~2 minute build → live
```

No manual steps needed on subsequent updates!

---

## Alternative: Deploy to Netlify

### Step 1: Connect Repository

1. Go to: https://app.netlify.com/start
2. Connect GitHub account
3. Select repository
4. Click "Next"

### Step 2: Build Settings

```
Build command: npm run build
Publish directory: .next
Node version: 20
```

### Step 3: Environment Variables

Add in Netlify dashboard:
- NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

### Step 4: Deploy

Click "Deploy site"

**Note**: Netlify requires adapter for Next.js. Vercel is simpler.

---

## Alternative: Deploy to Node.js Server (Self-Hosted)

### Prerequisites
- Server with Node.js 20.x installed
- Ubuntu/Debian recommended
- SSH access

### Step 1: Install Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version  # v20.x.x
npm --version   # v10.x.x
```

### Step 2: Clone Repository

```bash
# SSH into server
ssh user@your-server.com

# Navigate to apps directory
cd /home/user/apps

# Clone repository
git clone https://github.com/yourusername/india-calculator-tools.git
cd india-calculator-tools
```

### Step 3: Install & Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Generate sitemap with all URLs
npm run generate-sitemap

# Verify build succeeded
ls -la .next  # Should show directory
```

### Step 4: Start Application

```bash
# Start production server
npm start
# Listens on localhost:3000

# In background with PM2 (recommended)
npm install -g pm2
pm2 start "npm start" --name "calcverse"
pm2 startup
pm2 save
```

### Step 5: Setup Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/default

upstream calcverse {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name calcverse.in www.calcverse.in;

  # Redirect to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name calcverse.in www.calcverse.in;

  # SSL certificates (get from Let's Encrypt)
  ssl_certificate /etc/letsencrypt/live/calcverse.in/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/calcverse.in/privkey.pem;

  # Proxy to Node.js
  location / {
    proxy_pass http://calcverse;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Cache static files
  location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

### Step 6: Setup SSL with Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d calcverse.in -d www.calcverse.in

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Step 7: Reload Nginx

```bash
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

Visit: https://calcverse.in - Should work!

### Step 8: Monitoring

```bash
# Watch logs
pm2 logs calcverse

# Monitor CPU/Memory
pm2 monit

# Check status
pm2 status
```

---

## Environment Variables Setup

### For All Deployments

Create `.env.local` in project root:

```bash
# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Contact form email (optional)
# CONTACT_EMAIL=admin@calcverse.in

# Database (optional)
# DATABASE_URL=postgresql://user:password@host/db

# API (optional)
# NEXT_PUBLIC_API_URL=https://api.calcverse.in
```

### Vercel-Specific Setup

In Vercel dashboard → Project Settings → Environment Variables:

```
Name: NEXT_PUBLIC_GA_ID
Value: G-XXXXXXXXXX
Environments: Production, Preview, Development
```

### Netlify-Specific Setup

In Netlify dashboard → Site settings → Build & deploy → Environment:

```
Key: NEXT_PUBLIC_GA_ID
Value: G-XXXXXXXXXX
```

---

## Post-Deployment Checklist

After deploying to production:

### ✅ Verify Site Works

```bash
# Test homepage
curl https://calcverse.in -I
# Should return 200

# Test dynamic page
curl https://calcverse.in/percentage/438-out-of-600 -I
# Should return 200, not 404

# Test electricity page
curl https://calcverse.in/electricity/jusco-bill-calculator -I
# Should return 200
```

### ✅ Check Sitemap

```bash
curl https://calcverse.in/sitemap.xml | head -20
# Should show XML with 60+ URLs
```

### ✅ Verify SEO

1. **Meta Tags**:
   - View page source (Ctrl+U in browser)
   - Check `<title>` has percentage (e.g., "438 out of 600 = 73%")
   - Check `<meta name="description">`
   - Check `<link rel="canonical">`

2. **Schema Markup**:
   - Use Google Rich Results Test: https://search.google.com/test/rich-results
   - Input: https://calcverse.in/percentage/438-out-of-600
   - Should show green checkmark, valid FAQ schema

3. **Mobile**:
   - Use Google Mobile-Friendly Test: https://search.google.com/mobile-friendly
   - Should show "Page is mobile friendly"

### ✅ Setup Google Search Console

1. Go to: https://search.google.com/search-console
2. Click "Add property"
3. Choose URL prefix: https://calcverse.in
4. Verify (via analytics or DNS)
5. Submit sitemap: https://calcverse.in/sitemap.xml
6. Wait 24-48 hours for initial crawl

### ✅ Setup Google Analytics

1. Go to: https://analytics.google.com
2. Create new property for calcverse.in
3. Get measurement ID: G-XXXXXXXXXX
4. Add to `.env.local`: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
5. Rebuild & deploy: `npm run build && git push`
6. Verify in GA: Home page should show 1 user (you)

### ✅ Performance Check

1. Go to: https://pagespeed.web.dev
2. Enter: https://calcverse.in
3. Check scores:
   - **Lighthouse Score**: Should be 90+
   - **LCP**: Should be <2.5s
   - **FID**: Should be <100ms
   - **CLS**: Should be <0.1

### ✅ Security Headers

1. Verify with: https://securityheaders.com
2. Enter: https://calcverse.in
3. Check for:
   - ✅ X-Frame-Options: DENY
   - ✅ X-Content-Type-Options: nosniff
   - ✅ Referrer-Policy set

---

## Monitoring & Maintenance

### Daily
- Check Vercel email alerts (if any)
- Check Application Insights for errors

### Weekly
- Visit https://calcverse.in site manually
- Check Google Search Console for crawl errors
- Review GA for traffic patterns

### Monthly
- Check Core Web Vitals in GSC
- Review top queries in GSC → Performance
- Monitor indexed pages count
- Check backlinks/referring domains

### Quarterly
- Full SEO audit
- Update electricity provider rates if changed
- Add new common percentage calculations
- Review and update FAQs

---

## Rollback (If Deployment Fails)

### On Vercel
1. Go to Deployments tab
2. Click previous working deployment
3. Click "Promote to Production"
4. Takes 1 minute

### On Self-Hosted
```bash
# Revert to previous version
git log --oneline  # See history
git revert COMMIT_HASH
npm run build
# Restart: pm2 restart calcverse
```

---

## Database Backups (For Future)

When adding database (optional):

```bash
# Daily backup to S3
0 2 * * * backup.sh

# In backup.sh
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
aws s3 cp backup_*.sql s3://calcverse-backups/
```

---

## Scaling Considerations

### 1,000 pageviews/month
- Current setup is fine
- Vercel free tier handles this

### 10,000 pageviews/month
- Still fine on Vercel
- Monitor bandwidth usage

### 100,000+ pageviews/month
- Consider:
  - Vercel Pro ($20/month)
  - Add caching layer (Redis optional)
  - Database for user data (PostgreSQL recommended)
  - CDN (Vercel provides)

---

## Troubleshooting Deployments

### Build Fails: "npm ERR! missing script: build"
```bash
# Fix: Check package.json has build script
npm run build
# If error, check tsconfig.json for errors
```

### 500 Error on /percentage/438-out-of-600
```bash
# Check: Is [slug] directory properly named?
ls -la app/percentage/
# Should show: [slug]

# Rebuild:
npm run build
```

### Sitemap not updating after new pages
```bash
# Run generator manually
npm run generate-sitemap

# Verify output
cat public/sitemap.xml | grep percentage
# Should show new URLs

# Resubmit in GSC
```

### Static pages not pre-rendering
```bash
# Check generateStaticParams
grep "generateStaticParams" app/percentage/\[slug\]/page.tsx

# If missing, update pages to include:
export async function generateStaticParams() {
  return TOP_PERCENTAGES.map(/* ... */);
}
```

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Node.js**: https://nodejs.org/docs
- **Nginx**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/docs/

---

**Deployment Last Updated**: May 2024
**Recommended**: Vercel for easiest setup
**Time to Deploy**: 5 minutes (Vercel) to 30 minutes (Self-hosted)
