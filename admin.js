const uploadStorageKey = "blendercap-demo-uploaded-lenders";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatAmount(amount) {
  return currencyFormatter.format(amount);
}

function formatAmountRange(lender) {
  return `${formatAmount(lender.minAmount)} - ${formatAmount(lender.maxAmount)}`;
}

/* ---- Storage ---- */

function loadUploadedLenders() {
  try {
    const parsed = JSON.parse(localStorage.getItem(uploadStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUploadedLenders(lenders) {
  localStorage.setItem(uploadStorageKey, JSON.stringify(lenders));
}

let uploadedLenders = loadUploadedLenders();

/* ---- DOM refs ---- */

const uploadDropzone = document.querySelector("#upload-dropzone");
const pdfInput = document.querySelector("#pdf-input");
const uploadStatus = document.querySelector("#upload-status");
const uploadedLendersList = document.querySelector("#uploaded-lenders-list");
const statBuiltIn = document.querySelector("#stat-built-in");
const statUploaded = document.querySelector("#stat-uploaded");
const statTotal = document.querySelector("#stat-total");
const uploadedActions = document.querySelector("#uploaded-actions");
const clearAllBtn = document.querySelector("#clear-all-uploaded");

const BUILT_IN_COUNT = 6;

/* ---- PDF parsing helpers ---- */

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function extractLenderName(text, fileName) {
  const titleLine = text.split(/\n/).find((l) => l.trim().length > 3 && l.trim().length < 80);
  if (titleLine) {
    const cleaned = titleLine.trim().replace(/^(lender\s+)?guidelines?\s*[-:.]?\s*/i, "").trim();
    if (cleaned.length > 2 && cleaned.length < 60) return cleaned;
  }
  return fileName.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function detectProducts(text) {
  const lower = text.toLowerCase();
  const products = [];
  const hasSba = /\bsba\b|small\s+business\s+admin/i.test(lower);
  if (hasSba) products.push("SBA");
  if (/\b(commercial\s+real\s+estate|cre\b|multifamily|industrial\s+propert|retail\s+propert)/i.test(lower) && !hasSba) products.push("CRE");
  if (/\bequipment\b/i.test(lower) && !hasSba) products.push("Equipment");
  if (/\b(working\s+capital|revolving\s+line|line\s+of\s+credit|operating\s+line)/i.test(lower)) products.push("Working Capital");
  return products.length > 0 ? products : ["Working Capital"];
}

function extractAmounts(text) {
  const amounts = [];
  const patterns = [
    /\$\s*([\d,.]+)\s*(?:k|K)\b/g,
    /\$\s*([\d,.]+)\s*(?:m|M|million)\b/g,
    /\$\s*([\d,.]+)\b/g,
  ];
  for (const [idx, pattern] of patterns.entries()) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      let value = parseFloat(match[1].replace(/,/g, ""));
      if (idx === 0) value *= 1000;
      else if (idx === 1) value *= 1000000;
      if (value >= 10000 && value <= 500000000) amounts.push(value);
    }
  }
  amounts.sort((a, b) => a - b);
  if (amounts.length >= 2) return { min: amounts[0], max: amounts[amounts.length - 1] };
  if (amounts.length === 1) return { min: Math.round(amounts[0] * 0.2), max: amounts[0] };
  return { min: 100000, max: 5000000 };
}

function extractRate(text) {
  const ratePatterns = [
    /(?:rate|apr|interest|pricing)[^.]*?([\d]+\.[\d]+)\s*%/gi,
    /(\d+\.\d+)\s*%\s*(?:to|[-–])\s*\d+\.\d+\s*%/g,
    /(?:from|starting\s+at)\s*([\d]+\.[\d]+)\s*%/gi,
  ];
  for (const pattern of ratePatterns) {
    const match = pattern.exec(text);
    if (match) {
      const rate = parseFloat(match[1]);
      if (rate >= 2 && rate <= 30) return rate;
    }
  }
  return 8.0;
}

function extractCloseDays(text) {
  const dayMatch = text.match(/(\d+)\s*(?:[-–]\s*\d+\s*)?(?:business\s+)?days?\s*(?:close|closing|turnaround|fund|approval)/i);
  if (dayMatch) {
    const days = parseInt(dayMatch[1], 10);
    if (days >= 1 && days <= 365) return days;
  }
  const weekMatch = text.match(/(\d+)\s*(?:[-–]\s*\d+\s*)?weeks?\s*(?:close|closing|turnaround|fund)/i);
  if (weekMatch) {
    const weeks = parseInt(weekMatch[1], 10);
    if (weeks >= 1 && weeks <= 52) return weeks * 7;
  }
  return 30;
}

function detectRegion(text) {
  const lower = text.toLowerCase();
  if (/\bnationwide\b|\bnational\b|\b(all\s+50|all\s+states)\b/.test(lower)) return "National";
  if (/\bwest\s*coast\b|\bcalifornia\b|\boregon\b|\bwashington\b|\bnevada\b/.test(lower)) return "West Coast";
  if (/\bmidwest\b|\billinois\b|\bohio\b|\bmichigan\b|\bwisconsin\b|\bindiana\b/.test(lower)) return "Midwest";
  if (/\bsoutheast\b|\bflorida\b|\bgeorgia\b|\bcarolina\b|\btennessee\b|\balabama\b/.test(lower)) return "Southeast";
  if (/\bnortheast\b|\bnew\s+york\b|\bnew\s+jersey\b|\bconnecticut\b|\bmassachusetts\b/.test(lower)) return "Northeast";
  return "National";
}

function detectCollateral(text) {
  const lower = text.toLowerCase();
  const collateral = [];
  if (/\breal\s+estate\b|\bproperty\b|\bmortgage\b/.test(lower)) collateral.push("Real estate");
  if (/\bequipment\b|\bvehicle\b|\bfleet\b|\bmachinery\b/.test(lower)) collateral.push("Equipment");
  if (/\bbusiness\s+assets?\b|\binventory\b|\breceivables?\b/.test(lower)) collateral.push("Business assets");
  if (/\bcash\s*flow\b|\brevenue\b|\bunsecured\b/.test(lower)) collateral.push("Operating cash flow");
  return collateral.length > 0 ? collateral : ["Business assets"];
}

function extractTags(text, products) {
  const tags = [];
  const lower = text.toLowerCase();
  const tagCandidates = [
    ["Bridge", /\bbridge\b/], ["Construction", /\bconstruction\b/], ["Acquisition", /\bacquisition\b/],
    ["Refinance", /\brefinanc/], ["SBA 7(a)", /\bsba\s*7\s*\(?a\)?/], ["SBA 504", /\bsba\s*504/],
    ["Owner-occupied", /\bowner[\s-]?occupied/], ["Multifamily", /\bmultifamily/],
    ["Industrial", /\bindustrial/], ["Fleet", /\bfleet\b/], ["Medical", /\bmedical\b/],
    ["Revolving line", /\brevolving/], ["Term loan", /\bterm\s+loan/],
    ["Seasonal", /\bseasonal\b/], ["Growth", /\bgrowth\b/], ["Startup", /\bstart\s*up/],
    ["Manufacturing", /\bmanufactur/], ["Retail", /\bretail\b/], ["Hospitality", /\bhospitality/],
    ["Healthcare", /\bhealthcare/], ["Agriculture", /\bagricult/], ["Franchise", /\bfranchise/],
  ];
  for (const [tag, pattern] of tagCandidates) {
    if (pattern.test(lower) && tags.length < 4) tags.push(tag);
  }
  if (tags.length === 0) tags.push(products[0] || "General");
  return tags;
}

function extractStrengths(text, products, region) {
  const strengths = [];
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 200);

  const strengthKeywords = /\b(speciali|expert|focus|strong|flexible|competitive|fast|quick|streamlined|dedicated|proven|experienced)\w*/i;
  for (const sentence of sentences) {
    if (strengthKeywords.test(sentence) && strengths.length < 3) {
      strengths.push(sentence);
    }
  }
  if (strengths.length < 3) {
    if (products.includes("CRE")) strengths.push("Lender guidelines indicate commercial real estate lending capability.");
    if (products.includes("SBA")) strengths.push("SBA program experience referenced in uploaded guidelines.");
    if (products.includes("Equipment")) strengths.push("Equipment financing products identified in guideline document.");
    if (products.includes("Working Capital")) strengths.push("Working capital and revolving line capabilities referenced.");
    if (region !== "National") strengths.push("Regional focus on the " + region + " market.");
  }
  return strengths.slice(0, 3);
}

function extractDescription(text) {
  const cleaned = text.replace(/\n+/g, " ").trim();
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 30 && s.length < 250 && !/^\d/.test(s) && !/^table\s+of/i.test(s));
  if (sentences.length > 0) {
    return sentences[0].length > 160 ? sentences[0].slice(0, 157) + "..." : sentences[0];
  }
  return "Lender guidelines uploaded via PDF. Review details for lending criteria and product fit.";
}

function parseLenderFromText(text, fileName) {
  const name = extractLenderName(text, fileName);
  const products = detectProducts(text);
  const amounts = extractAmounts(text);
  const region = detectRegion(text);
  const collateral = detectCollateral(text);
  const tags = extractTags(text, products);

  return {
    id: "uploaded-" + slugify(name) + "-" + Date.now(),
    name: name,
    type: products[0],
    location: region,
    description: extractDescription(text),
    minAmount: amounts.min,
    maxAmount: amounts.max,
    rate: extractRate(text),
    closeDays: extractCloseDays(text),
    baseFit: 80,
    collateral: collateral,
    strengths: extractStrengths(text, products, region),
    tags: tags,
    source: "pdf",
    sourceFile: fileName,
  };
}

async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = globalThis.pdfjsLib;
  if (!pdfjsLib) {
    throw new Error("PDF.js library not loaded. Please refresh the page and try again.");
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs";

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n\n");
}

/* ---- Rendering ---- */

function updateStats() {
  statBuiltIn.textContent = BUILT_IN_COUNT;
  statUploaded.textContent = uploadedLenders.length;
  statTotal.textContent = BUILT_IN_COUNT + uploadedLenders.length;
  uploadedActions.hidden = uploadedLenders.length === 0;
}

function renderUploadedLenders() {
  uploadedLendersList.replaceChildren();

  if (uploadedLenders.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No lenders uploaded yet. Add PDF guidelines above to get started.";
    uploadedLendersList.append(empty);
    return;
  }

  uploadedLenders.forEach((lender) => {
    const item = document.createElement("article");
    item.className = "uploaded-lender-item";

    const info = document.createElement("div");
    info.className = "upload-lender-info";

    const title = document.createElement("h3");
    title.textContent = lender.name;

    const meta = document.createElement("p");
    meta.className = "upload-lender-meta";
    meta.innerHTML =
      "<span>" + lender.type + "</span> &middot; " +
      "<span>" + formatAmountRange(lender) + "</span> &middot; " +
      "<span>" + lender.rate.toFixed(1) + "% from</span> &middot; " +
      "<span>" + lender.closeDays + "-day close</span>";

    const source = document.createElement("p");
    source.className = "upload-lender-source";
    source.innerHTML =
      '<span class="upload-badge">PDF</span> ' +
      (lender.sourceFile || "uploaded document");

    info.append(title, meta, source);

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-outline btn-danger";
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      uploadedLenders = uploadedLenders.filter((l) => l.id !== lender.id);
      saveUploadedLenders(uploadedLenders);
      renderAll();
    });

    item.append(info, removeBtn);
    uploadedLendersList.append(item);
  });
}

function renderAll() {
  updateStats();
  renderUploadedLenders();
}

/* ---- Upload handlers ---- */

async function handlePdfUpload(files) {
  const pdfFiles = Array.from(files).filter(
    (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
  );

  if (pdfFiles.length === 0) {
    uploadStatus.innerHTML = '<span class="upload-error">Please select PDF files only.</span>';
    return;
  }

  uploadStatus.innerHTML =
    '<span class="upload-parsing"><span class="upload-spinner"></span> Parsing ' +
    pdfFiles.length + " file" + (pdfFiles.length > 1 ? "s" : "") + "...</span>";

  const results = { success: 0, failed: 0 };
  for (const file of pdfFiles) {
    try {
      const text = await extractTextFromPdf(file);
      if (text.trim().length < 20) { results.failed++; continue; }
      const lender = parseLenderFromText(text, file.name);
      uploadedLenders.push(lender);
      results.success++;
    } catch (err) {
      console.error("Failed to parse PDF:", file.name, err);
      results.failed++;
    }
  }

  saveUploadedLenders(uploadedLenders);
  renderAll();

  const totalLabel = uploadedLenders.length + " uploaded lender" + (uploadedLenders.length > 1 ? "s" : "") + " total";
  if (results.success > 0 && results.failed === 0) {
    uploadStatus.innerHTML =
      '<span class="upload-success">Added ' + results.success +
      " lender" + (results.success > 1 ? "s" : "") +
      " from PDF guidelines — " + totalLabel + ".</span>";
  } else if (results.success > 0) {
    uploadStatus.innerHTML =
      '<span class="upload-success">Added ' + results.success +
      " lender" + (results.success > 1 ? "s" : "") + " — " + totalLabel +
      '.</span> <span class="upload-error">' + results.failed +
      " file" + (results.failed > 1 ? "s" : "") + " could not be parsed.</span>";
  } else {
    uploadStatus.innerHTML =
      '<span class="upload-error">Could not extract lender data from the selected file' +
      (results.failed > 1 ? "s" : "") + ".</span>";
  }
}

/* ---- Event listeners ---- */

uploadDropzone.addEventListener("click", () => pdfInput.click());
uploadDropzone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); pdfInput.click(); }
});

pdfInput.addEventListener("change", () => {
  if (pdfInput.files.length > 0) handlePdfUpload(pdfInput.files);
  pdfInput.value = "";
});

uploadDropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadDropzone.classList.add("drag-over");
});

uploadDropzone.addEventListener("dragleave", () => {
  uploadDropzone.classList.remove("drag-over");
});

uploadDropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadDropzone.classList.remove("drag-over");
  if (event.dataTransfer.files.length > 0) handlePdfUpload(event.dataTransfer.files);
});

clearAllBtn.addEventListener("click", () => {
  uploadedLenders = [];
  saveUploadedLenders(uploadedLenders);
  uploadStatus.innerHTML = "";
  renderAll();
});

renderAll();
