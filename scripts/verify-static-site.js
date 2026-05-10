const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const html = readFileSync(join(root, "index.html"), "utf8");

function getAttributeValue(tag, attribute) {
  const match = tag.match(new RegExp(`${attribute}="([^"]+)"`));
  return match ? match[1] : null;
}

const assets = [...html.matchAll(/<(?:link|script)\b[^>]*>/g)]
  .map(([tag]) => getAttributeValue(tag, tag.startsWith("<link") ? "href" : "src"))
  .filter(Boolean)
  .filter((asset) => !asset.startsWith("http"));

const ids = new Set(
  [...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id),
);

const requiredIds = [
  "scenario-form",
  "search-form",
  "lender-grid",
  "lender-card-template",
  "shortlist-list",
  "lender-dialog",
  "copy-summary",
  "clear-shortlist",
  "upload-dropzone",
  "pdf-input",
  "upload-status",
  "uploaded-lenders-list",
];

const missingAssets = assets.filter((asset) => !existsSync(join(root, asset)));
const missingIds = requiredIds.filter((id) => !ids.has(id));

if (missingAssets.length > 0 || missingIds.length > 0) {
  console.error("Static site verification failed.");

  if (missingAssets.length > 0) {
    console.error(`Missing assets: ${missingAssets.join(", ")}`);
  }

  if (missingIds.length > 0) {
    console.error(`Missing required DOM hooks: ${missingIds.join(", ")}`);
  }

  process.exit(1);
}

console.log("Static site verification passed.");
console.log(`Verified assets: ${assets.join(", ")}`);
