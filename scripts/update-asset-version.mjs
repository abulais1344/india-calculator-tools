import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const VERSION = "20260427-5";

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let out = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "scripts") continue;
      out = out.concat(walk(full));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

for (const file of walk(ROOT)) {
  let text = fs.readFileSync(file, "utf8");
  text = text.replace(/styles\.min\.css(?:\?v=[^"']+)?/g, `styles.min.css?v=${VERSION}`);
  text = text.replace(/app\.min\.js(?:\?v=[^"']+)?/g, `app.min.js?v=${VERSION}`);
  fs.writeFileSync(file, text, "utf8");
}

console.log(`Updated asset version to ${VERSION}`);
