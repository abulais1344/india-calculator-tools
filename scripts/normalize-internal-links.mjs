import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function walkHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    if (entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkHtml(full));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

const replacements = [
  ["href=\"index.html\" class=\"brand\"", "href=\"/\" class=\"brand\""],
  ["href=\"../index.html\" class=\"brand\"", "href=\"/\" class=\"brand\""],
  ["href=\"index.html\">Home", "href=\"/\">Home"],
  ["href=\"../index.html\">Home", "href=\"/\">Home"],
  ["href=\"blog/index.html\"", "href=\"/blog/\""],
  ["href=\"index.html\">Blog", "href=\"/blog/\">Blog"],
  ["href=\"../blog/index.html\"", "href=\"/blog/\""],
  ["href=\"./index.html\">Home", "href=\"/\">Home"]
];

let changedFiles = 0;
let totalReplacements = 0;

for (const file of walkHtml(ROOT)) {
  const original = fs.readFileSync(file, "utf8");
  let updated = original;
  let fileReplacements = 0;

  for (const [from, to] of replacements) {
    const parts = updated.split(from);
    if (parts.length > 1) {
      fileReplacements += parts.length - 1;
      updated = parts.join(to);
    }
  }

  if (updated !== original) {
    fs.writeFileSync(file, updated, "utf8");
    changedFiles += 1;
    totalReplacements += fileReplacements;
  }
}

console.log(`Normalized links in ${changedFiles} files with ${totalReplacements} replacements.`);
