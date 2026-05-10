const { cpSync, mkdirSync, rmSync, existsSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const out = join(root, "public");

if (existsSync(out)) {
  rmSync(out, { recursive: true });
}
mkdirSync(out);

const assets = [
  "index.html",
  "admin.html",
  "app.js",
  "admin.js",
  "styles.css",
];

for (const file of assets) {
  cpSync(join(root, file), join(out, file));
}

console.log(`Built public/ with ${assets.length} files.`);
