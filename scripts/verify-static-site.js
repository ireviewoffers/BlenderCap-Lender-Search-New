const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");

function verifyPage(fileName, requiredIds) {
  const filePath = join(root, fileName);
  const html = readFileSync(filePath, "utf8");

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

  const missingAssets = assets.filter((asset) => !existsSync(join(root, asset)));
  const missingIds = requiredIds.filter((id) => !ids.has(id));

  if (missingAssets.length > 0 || missingIds.length > 0) {
    console.error(`Verification failed for ${fileName}.`);
    if (missingAssets.length > 0) {
      console.error(`  Missing assets: ${missingAssets.join(", ")}`);
    }
    if (missingIds.length > 0) {
      console.error(`  Missing required DOM hooks: ${missingIds.join(", ")}`);
    }
    return false;
  }

  console.log(`${fileName}: passed (assets: ${assets.join(", ")})`);
  return true;
}

const indexOk = verifyPage("index.html", [
  "scenario-form",
  "search-form",
  "lender-grid",
  "lender-card-template",
  "shortlist-list",
  "lender-dialog",
  "copy-summary",
  "clear-shortlist",
  "top-match-name",
  "result-count",
]);

const adminOk = verifyPage("admin.html", [
  "upload-dropzone",
  "pdf-input",
  "upload-status",
  "uploaded-lenders-list",
  "stat-uploaded",
  "stat-total",
]);

if (!indexOk || !adminOk) {
  process.exit(1);
}

console.log("Static site verification passed.");
