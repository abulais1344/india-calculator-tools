import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASE_URL = "https://calcverse.in";
const SITE_TITLE = "CalcVerse - Free India Utility Tools";
const REQUIRED_KEYWORDS = [
  "gst calculator",
  "rent receipt generator",
  "salary slip generator India",
  "free India utility tools",
  "CalcVerse"
];

function walkHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkHtml(full));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function routeFromRel(rel) {
  const normalized = rel.replace(/\\/g, "/");
  if (normalized === "index.html") return "/";
  if (normalized.endsWith("/index.html")) return `/${normalized.slice(0, -"index.html".length)}`;
  return `/${normalized}`;
}

function upsertMeta(html, name, content) {
  const tag = `<meta name="${name}" content="${content}">`;
  const re = new RegExp(`<meta\\s+name=["']${name}["'][^>]*>`, "i");
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<meta name="viewport"[^>]*>\n?/i, (m) => `${m}\n  ${tag}`);
}

function upsertCanonical(html, href) {
  const tag = `<link rel="canonical" href="${href}">`;
  const re = /<link\s+rel=["']canonical["'][^>]*>/i;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<meta name="keywords"[^>]*>\n?/i, (m) => `${m}\n  ${tag}`);
}

function cleanTitle(raw) {
  return raw
    .replace(/\s*\|\s*CalcVerse\s*-\s*Free India Utility Tools\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeKeywords(existing) {
  const split = existing
    ? existing
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const merged = [...split, ...REQUIRED_KEYWORDS];
  const seen = new Set();
  const out = [];
  for (const k of merged) {
    const key = k.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(k);
  }
  return out.join(", ");
}

function removeSeoBlocks(html) {
  return html
    .replace(/\n?\s*<meta\s+property=["']og:title["'][^>]*>/gi, "")
    .replace(/\n?\s*<meta\s+property=["']og:description["'][^>]*>/gi, "")
    .replace(/\n?\s*<meta\s+property=["']og:type["'][^>]*>/gi, "")
    .replace(/\n?\s*<meta\s+property=["']og:url["'][^>]*>/gi, "")
    .replace(/\n?\s*<meta\s+property=["']og:site_name["'][^>]*>/gi, "")
    .replace(/\n?\s*<meta\s+property=["']og:image["'][^>]*>/gi, "")
    .replace(/\n?\s*<meta\s+name=["']twitter:card["'][^>]*>/gi, "")
    .replace(/\n?\s*<meta\s+name=["']twitter:title["'][^>]*>/gi, "")
    .replace(/\n?\s*<meta\s+name=["']twitter:description["'][^>]*>/gi, "")
    .replace(/\n?\s*<meta\s+name=["']google-site-verification["'][^>]*>/gi, "")
    .replace(/\n?\s*<script\s+async\s+src=["']https:\/\/www.googletagmanager.com\/gtag\/js\?id=[^"']+["']><\/script>/gi, "")
    .replace(/\n?\s*<script>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];[\s\S]*?gtag\("config",\s*"[^"]+"\);\s*<\/script>/gi, "");
}

function buildSeoBlock(title, description, canonical) {
  return [
    `  <meta property="og:title" content="${title}">`,
    `  <meta property="og:description" content="${description}">`,
    '  <meta property="og:type" content="website">',
    `  <meta property="og:url" content="${canonical}">`,
    '  <meta property="og:site_name" content="CalcVerse">',
    '  <meta property="og:image" content="https://calcverse.in/favicon.ico">',
    '  <meta name="twitter:card" content="summary_large_image">',
    `  <meta name="twitter:title" content="${title}">`,
    `  <meta name="twitter:description" content="${description}">`,
    '  <meta name="google-site-verification" content="GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE">',
    '  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>',
    '  <script>',
    '    window.dataLayer = window.dataLayer || [];',
    '    function gtag(){dataLayer.push(arguments);}',
    '    gtag("js", new Date());',
    '    gtag("config", "G-XXXXXXXXXX");',
    '  </script>'
  ].join("\n");
}

const htmlFiles = walkHtml(ROOT).filter((f) => !f.includes(`${path.sep}node_modules${path.sep}`));
let updated = 0;

for (const filePath of htmlFiles) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");
  let html = fs.readFileSync(filePath, "utf8");

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?\s*>/i);
  const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["']([\s\S]*?)["']\s*\/?\s*>/i);

  const currentTitle = titleMatch ? cleanTitle(titleMatch[1]) : "Free Online India Utility Tools";
  const title = rel === "index.html" ? SITE_TITLE : `${currentTitle} | ${SITE_TITLE}`;
  const description = descMatch?.[1]?.trim() || "Free online India utility tools including GST calculator, rent receipt generator, and salary slip generator.";
  const keywords = mergeKeywords(keywordsMatch?.[1] || "");
  const canonical = `${BASE_URL}${routeFromRel(rel)}`;

  html = removeSeoBlocks(html);
  html = titleMatch ? html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`) : html.replace(/<meta charset=[^>]*>\n?/i, (m) => `${m}  <title>${title}</title>\n`);
  html = upsertMeta(html, "description", description);
  html = upsertMeta(html, "keywords", keywords);
  html = upsertCanonical(html, canonical);

  const seoBlock = buildSeoBlock(title, description, canonical);
  if (!html.includes('property="og:title"')) {
    html = html.replace(/<link rel="canonical"[^>]*>\n?/i, (m) => `${m}${seoBlock}\n`);
  }

  html = html.replace(/(<link rel="canonical"[^>]*>)\s*<meta property="og:title"/i, "$1\n  <meta property=\"og:title\"");

  fs.writeFileSync(filePath, html, "utf8");
  updated += 1;
}

console.log(`Updated SEO tags in ${updated} HTML files.`);
