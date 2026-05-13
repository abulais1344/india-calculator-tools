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
];

function walkHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "scripts" || entry.name === ".next" || entry.name === "app") continue;
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
  if (route.startsWith("/percentage/")) return "0.85";
  if (route.startsWith("/electricity/")) return "0.8";
  if (route.startsWith("/blog/")) return "0.8";
  if (["/about.html", "/contact.html", "/disclaimer.html", "/privacy-policy.html", "/terms.html"].includes(route)) return "0.8";
  return "0.7";
}

function freqFor(route) {
  if (route === "/" || route === "/blog/") return "weekly";
  if (route.startsWith("/percentage/") || route.startsWith("/electricity/")) return "monthly";
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

// Get all static HTML routes
const htmlFiles = walkHtml(ROOT);
let routes = htmlFiles
  .map((file) => path.relative(ROOT, file))
  .map((rel) => toPath(rel))
  .sort((a, b) => a.localeCompare(b));

// Add dynamic percentage calculator pages (from GSC top searches)
const percentageRoutes = TOP_PERCENTAGES.map(
  ({ obtained, total }) => `/percentage/${obtained}-out-of-${total}`
);

// Add dynamic electricity calculator pages
const electricityRoutes = ELECTRICITY_PROVIDERS.map(
  (provider) => `/electricity/${provider}`
);

// Combine all routes
routes = [...new Set([...routes, ...percentageRoutes, ...electricityRoutes])].sort((a, b) =>
  a.localeCompare(b)
);

const xml = buildSitemapXml(routes);
const percentageXml = buildSitemapXml(percentageRoutes);
const electricityXml = buildSitemapXml(electricityRoutes);

fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), xml, "utf8");
fs.writeFileSync(path.join(ROOT, "public", "sitemap-percentage.xml"), percentageXml, "utf8");
fs.writeFileSync(path.join(ROOT, "public", "sitemap-electricity.xml"), electricityXml, "utf8");

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${BASE_URL}/sitemap.xml`,
  `Sitemap: ${BASE_URL}/sitemap-percentage.xml`,
  `Sitemap: ${BASE_URL}/sitemap-electricity.xml`,
  ""
].join("\n");

fs.writeFileSync(path.join(ROOT, "public", "robots.txt"), robots, "utf8");

console.log(`✅ Sitemap generated successfully!`);
console.log(`   Total URLs: ${routes.length}`);
console.log(`   Static URLs: ${htmlFiles.length}`);
console.log(`   Percentage pages: ${percentageRoutes.length}`);
console.log(`   Electricity pages: ${electricityRoutes.length}`);
