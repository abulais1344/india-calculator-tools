import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASE_URL = "https://calcverse.in";
const TODAY = new Date().toISOString().slice(0, 10);

// Top percentage calculations from Google Search Console
const TOP_PERCENTAGES = [
  { obtained: 438, total: 600 },
  { obtained: 380, total: 500 },
  { obtained: 438, total: 500 },
  { obtained: 320, total: 400 },
  { obtained: 300, total: 500 },
  { obtained: 250, total: 300 },
  { obtained: 200, total: 400 },
  { obtained: 470, total: 600 },
  { obtained: 480, total: 600 },
  { obtained: 360, total: 500 },
  { obtained: 500, total: 600 },
  { obtained: 450, total: 500 },
];

// Electricity providers for dynamic calculator pages
const ELECTRICITY_PROVIDERS = [
  "jusco-bill-calculator",
  "msedcl-bill-calculator",
  "bescom-bill-calculator",
  "kseb-bill-calculator",
  "tpddl-bill-calculator",
  "bses-rajdhani-bill-calculator",
  "wesco-bill-calculator",
  "tangedco-bill-calculator",
  "tneb-bill-calculator",
  "wbsedcl-bill-calculator",
];

const ELECTRICITY_SUPPORT_PAGES = [
  "/electricity",
  "/electricity/how-electricity-bill-is-calculated",
  "/electricity/electricity-slab-rate-explained",
  "/electricity/1-unit-electricity-cost-india",
  "/electricity/fixed-charge-vs-energy-charge",
];

const FINANCE_GUIDES = [
  "best-home-loan-tenure-india",
  "reduce-emi-without-refinance",
  "car-loan-down-payment-vs-emi",
  "personal-loan-eligibility-by-salary",
  "fixed-vs-floating-home-loan-rate",
  "should-you-prepay-home-loan-or-invest",
  "sip-vs-rd-for-monthly-savers",
  "monthly-sip-target-1-crore",
  "ppf-vs-sip-15-year-comparison",
  "income-tax-old-vs-new-regime-checklist",
  "salary-hike-percent-to-in-hand-impact",
  "ctc-to-in-hand-common-deductions",
  "break-even-point-for-small-business-india",
  "simple-vs-compound-interest-when-to-use",
  "gst-inclusive-vs-exclusive-price-formula",
  "fuel-cost-monthly-budget-by-commute",
  "loan-eligibility-before-home-search",
  "emergency-fund-vs-prepayment-priority",
  "rent-vs-buy-home-india-emi-lens",
  "fd-ladder-strategy-for-stable-cash-flow",
  "annual-bonus-allocation-rule-india",
];

const QUERY_LANDING_ROUTES = [
  "/438-out-of-500-as-a-percentage.html",
  "/438-out-of-600-as-a-percentage.html",
  "/age-calculator-of-india.html",
  "/bescom-electricity-rate-per-unit.html",
  "/bses-rajdhani-electricity-rate-per-unit.html",
  "/jusco-electricity-rate.html",
  "/jusco-electricity-bill-rate-per-unit-in-jamshedpur.html",
  "/kseb-electricity-rate-per-unit.html",
  "/msedcl-electricity-rate-per-unit.html",
  "/per-unit-electricity-rate-india.html",
  "/state-electricity-charges-india.html",
  "/tangedco-electricity-rate-per-unit.html",
  "/tneb-electricity-rate-per-unit.html",
  "/tpddl-electricity-rate-per-unit.html",
  "/what-is-the-price-of-1-kwh-electricity-in-india.html",
  "/wbsedcl-electricity-rate-per-unit.html",
];

function walkHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "scripts" || entry.name === ".next" || entry.name === "app" || entry.name === "public") continue;
      out.push(...walkHtml(full));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function toPath(rel) {
  const normalized = rel.replace(/\\/g, "/");
  if (normalized === "index.html") return "/";
  if (normalized.endsWith("/index.html")) return `/${normalized.slice(0, -"index.html".length)}`;
  return `/${normalized}`;
}

function priorityFor(route) {
  if (route === "/") return "1.0";
  if (route.includes("generator") || route.includes("calculator")) return "0.9";
  if (route === "/electricity") return "0.9";
  if (route === "/finance") return "0.9";
  if (route.startsWith("/percentage/")) return "0.85";
  if (route.startsWith("/electricity/")) return "0.8";
  if (route.startsWith("/finance/")) return "0.8";
  if (route.startsWith("/blog/")) return "0.8";
  if (["/about.html", "/contact.html", "/disclaimer.html", "/privacy-policy.html", "/terms.html"].includes(route)) return "0.8";
  return "0.7";
}

function freqFor(route) {
  if (route === "/" || route === "/blog/") return "weekly";
  if (route === "/electricity") return "weekly";
  if (route === "/finance") return "weekly";
  if (route.startsWith("/percentage/") || route.startsWith("/electricity/") || route.startsWith("/finance/")) return "monthly";
  return "monthly";
}

function buildSitemapXml(routes) {
  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    ...routes.map((route) => [
      "  <url>",
      `    <loc>${BASE_URL}${route}</loc>`,
      `    <lastmod>${TODAY}</lastmod>`,
      `    <changefreq>${freqFor(route)}</changefreq>`,
      `    <priority>${priorityFor(route)}</priority>`,
      "  </url>"
    ].join("\n")),
    "</urlset>",
    ""
  ].join("\n");
}

function buildSitemapIndex(entries) {
  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    ...entries.map((name) => [
      "  <sitemap>",
      `    <loc>${BASE_URL}/${name}</loc>`,
      `    <lastmod>${TODAY}</lastmod>`,
      "  </sitemap>",
    ].join("\n")),
    "</sitemapindex>",
    "",
  ].join("\n");
}

function writeToTargets(fileName, content) {
  fs.writeFileSync(path.join(ROOT, fileName), content, "utf8");
  fs.writeFileSync(path.join(ROOT, "public", fileName), content, "utf8");
}

// Get all static HTML routes
const htmlFiles = walkHtml(ROOT);
let routes = htmlFiles
  .map((file) => path.relative(ROOT, file))
  .map((rel) => toPath(rel))
  .sort((a, b) => a.localeCompare(b));

// Exclude Google verification files from sitemap; these are not SEO landing pages.
routes = routes.filter((route) => !/^\/google[a-z0-9]+\.html$/i.test(route));

// Add dynamic percentage calculator pages (from GSC top searches)
const percentageRoutes = TOP_PERCENTAGES.map(
  ({ obtained, total }) => `/percentage/${obtained}-out-of-${total}`
);

// Add dynamic electricity calculator pages
const electricityRoutes = ELECTRICITY_PROVIDERS.map(
  (provider) => `/electricity/${provider}`
);

// Add electricity hub and supporting guides
const electricitySupportRoutes = ELECTRICITY_SUPPORT_PAGES;

// Add finance long-tail route pages
const financeRoutes = ["/finance", ...FINANCE_GUIDES.map((slug) => `/finance/${slug}`)];

// Split static routes into core and blog clusters
const staticBlogRoutes = routes.filter((route) => route.startsWith("/blog/"));
const staticCoreRoutes = routes.filter((route) => !route.startsWith("/blog/"));

// Add query pages to core sitemap bucket
const coreRoutes = [...new Set([...staticCoreRoutes, ...QUERY_LANDING_ROUTES])].sort((a, b) =>
  a.localeCompare(b)
);

const blogRoutes = [...new Set(staticBlogRoutes)].sort((a, b) => a.localeCompare(b));
const percentageSitemapRoutes = [...new Set(percentageRoutes)].sort((a, b) => a.localeCompare(b));
const electricitySitemapRoutes = [...new Set([...electricityRoutes, ...electricitySupportRoutes])].sort((a, b) =>
  a.localeCompare(b)
);
const financeSitemapRoutes = [...new Set(financeRoutes)].sort((a, b) => a.localeCompare(b));

// Combined route count for diagnostics only
const allRoutes = [...new Set([...coreRoutes, ...blogRoutes, ...percentageSitemapRoutes, ...electricitySitemapRoutes, ...financeSitemapRoutes])].sort((a, b) =>
  a.localeCompare(b)
);

const coreXml = buildSitemapXml(coreRoutes);
const blogXml = buildSitemapXml(blogRoutes);
const percentageXml = buildSitemapXml(percentageSitemapRoutes);
const electricityXml = buildSitemapXml(electricitySitemapRoutes);
const financeXml = buildSitemapXml(financeSitemapRoutes);
const sitemapIndexXml = buildSitemapIndex([
  "sitemap-core.xml",
  "sitemap-blog.xml",
  "sitemap-percentage.xml",
  "sitemap-electricity.xml",
  "sitemap-finance.xml",
]);

writeToTargets("sitemap.xml", sitemapIndexXml);
writeToTargets("sitemap-core.xml", coreXml);
writeToTargets("sitemap-blog.xml", blogXml);
writeToTargets("sitemap-percentage.xml", percentageXml);
writeToTargets("sitemap-electricity.xml", electricityXml);
writeToTargets("sitemap-finance.xml", financeXml);

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${BASE_URL}/sitemap.xml`,
  ""
].join("\n");

fs.writeFileSync(path.join(ROOT, "robots.txt"), robots, "utf8");
fs.writeFileSync(path.join(ROOT, "public", "robots.txt"), robots, "utf8");

console.log(`✅ Sitemap index generated successfully!`);
console.log(`   Total URLs: ${allRoutes.length}`);
console.log(`   Static core URLs: ${coreRoutes.length}`);
console.log(`   Static blog URLs: ${blogRoutes.length}`);
console.log(`   Percentage pages: ${percentageSitemapRoutes.length}`);
console.log(`   Electricity pages: ${electricitySitemapRoutes.length}`);
console.log(`   Finance pages: ${financeSitemapRoutes.length}`);
