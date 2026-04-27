import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASE_URL = "https://calcverse.in";
const TODAY = new Date().toISOString().slice(0, 10);

function walkHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "scripts") continue;
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
  if (route.startsWith("/blog/")) return "0.8";
  if (["/about.html", "/contact.html", "/disclaimer.html", "/privacy-policy.html", "/terms.html"].includes(route)) return "0.8";
  return "0.7";
}

function freqFor(route) {
  if (route === "/" || route === "/blog/") return "weekly";
  return "monthly";
}

const htmlFiles = walkHtml(ROOT);
const routes = htmlFiles
  .map((file) => path.relative(ROOT, file))
  .map((rel) => toPath(rel))
  .sort((a, b) => a.localeCompare(b));

const xml = [
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

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${BASE_URL}/sitemap.xml`,
  ""
].join("\n");

fs.writeFileSync(path.join(ROOT, "robots.txt"), robots, "utf8");

console.log(`Generated sitemap.xml with ${routes.length} URLs and updated robots.txt.`);
