const builtInLenders = [
  {
    id: "atlas-commercial-capital",
    name: "Atlas Commercial Capital",
    type: "CRE",
    location: "National",
    description:
      "Bridge and permanent debt for stabilized retail, multifamily, and industrial properties.",
    minAmount: 1000000,
    maxAmount: 25000000,
    rate: 7.1,
    closeDays: 24,
    baseFit: 96,
    collateral: ["Real estate", "Business assets"],
    strengths: [
      "Comfortable with complex commercial real estate collateral.",
      "National footprint keeps geography from becoming a blocker.",
      "Good fit for larger requests that need institutional execution.",
    ],
    tags: ["Bridge", "Multifamily", "Industrial"],
  },
  {
    id: "harbor-sba-partners",
    name: "Harbor SBA Partners",
    type: "SBA",
    location: "West Coast",
    description:
      "Owner-occupied real estate and acquisition financing with SBA 7(a) and 504 programs.",
    minAmount: 250000,
    maxAmount: 5000000,
    rate: 8.4,
    closeDays: 42,
    baseFit: 89,
    collateral: ["Real estate", "Business assets", "Operating cash flow"],
    strengths: [
      "Strong SBA fit for owner-occupied properties and acquisitions.",
      "Best for borrowers that can support standard SBA documentation.",
      "Useful when lower down payment is more important than closing speed.",
    ],
    tags: ["SBA 7(a)", "Owner-occupied", "Acquisition"],
  },
  {
    id: "northline-equipment-finance",
    name: "Northline Equipment Finance",
    type: "Equipment",
    location: "Midwest",
    description:
      "Fast approvals for yellow iron, fleet, manufacturing, and medical equipment purchases.",
    minAmount: 75000,
    maxAmount: 3500000,
    rate: 6.8,
    closeDays: 10,
    baseFit: 93,
    collateral: ["Equipment", "Business assets"],
    strengths: [
      "Specialized equipment underwriting shortens review cycles.",
      "Strong match when the equipment itself is the primary collateral.",
      "Fast close profile works well for time-sensitive purchases.",
    ],
    tags: ["Fleet", "Manufacturing", "Medical"],
  },
  {
    id: "bluepeak-working-capital",
    name: "BluePeak Working Capital",
    type: "Working Capital",
    location: "National",
    description:
      "Flexible revolving lines for growth-stage companies with repeat revenue and seasonal demand.",
    minAmount: 100000,
    maxAmount: 2000000,
    rate: 9.2,
    closeDays: 7,
    baseFit: 85,
    collateral: ["Operating cash flow", "Business assets"],
    strengths: [
      "Useful for quick liquidity needs and seasonal working capital gaps.",
      "National coverage supports borrowers outside a single bank footprint.",
      "Fastest sample lender for scenarios where speed matters most.",
    ],
    tags: ["Revolving line", "Seasonal", "Growth"],
  },
  {
    id: "summit-private-credit",
    name: "Summit Private Credit",
    type: "CRE",
    location: "Southeast",
    description:
      "Structured private credit for construction takeouts, value-add assets, and complex sponsors.",
    minAmount: 5000000,
    maxAmount: 60000000,
    rate: 8.1,
    closeDays: 18,
    baseFit: 91,
    collateral: ["Real estate"],
    strengths: [
      "Handles larger and more structured commercial real estate requests.",
      "Private credit profile fits value-add and construction takeout stories.",
      "Can move faster than a traditional bank on complex collateral.",
    ],
    tags: ["Private credit", "Value-add", "Takeout"],
  },
  {
    id: "keystone-business-bank",
    name: "Keystone Business Bank",
    type: "Working Capital",
    location: "Northeast",
    description:
      "Relationship banking for established operators seeking term loans and operating lines.",
    minAmount: 500000,
    maxAmount: 10000000,
    rate: 7.6,
    closeDays: 30,
    baseFit: 88,
    collateral: ["Business assets", "Operating cash flow", "Real estate"],
    strengths: [
      "Relationship-bank profile fits established operating companies.",
      "Balances pricing and structure for term loans or operating lines.",
      "Good option when the borrower values bank relationship support.",
    ],
    tags: ["Term loan", "Operating line", "Bank"],
  },
];

const presets = {
  property: {
    product: "CRE",
    amount: 2500000,
    region: "National",
    urgency: "standard",
    collateral: "Real estate",
  },
  equipment: {
    product: "Equipment",
    amount: 850000,
    region: "Midwest",
    urgency: "fast",
    collateral: "Equipment",
  },
  growth: {
    product: "Working Capital",
    amount: 1200000,
    region: "Northeast",
    urgency: "fast",
    collateral: "Operating cash flow",
  },
};

const uploadedLenders = [];
const uploadStorageKey = "blendercap-demo-uploaded-lenders";

function getAllLenders() {
  return [...builtInLenders, ...uploadedLenders];
}

function loadUploadedLenders() {
  try {
    const parsed = JSON.parse(localStorage.getItem(uploadStorageKey) || "[]");
    if (Array.isArray(parsed)) {
      uploadedLenders.length = 0;
      parsed.forEach((l) => uploadedLenders.push(l));
    }
  } catch { /* ignore corrupt storage */ }
}

function saveUploadedLenders() {
  localStorage.setItem(uploadStorageKey, JSON.stringify(uploadedLenders));
}

loadUploadedLenders();

const storageKey = "blendercap-demo-shortlist";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const scenarioForm = document.querySelector("#scenario-form");
const searchForm = document.querySelector("#search-form");
const lenderGrid = document.querySelector("#lender-grid");
const template = document.querySelector("#lender-card-template");
const resultCount = document.querySelector("#result-count");
const resultLabel = document.querySelector("#result-label");
const lenderCount = document.querySelector("#lender-count");
const heroBestFit = document.querySelector("#hero-best-fit");
const heroShortlistCount = document.querySelector("#hero-shortlist-count");
const topMatchName = document.querySelector("#top-match-name");
const topMatchSummary = document.querySelector("#top-match-summary");
const topMatchMeter = document.querySelector("#top-match-meter");
const scenarioSummary = document.querySelector("#scenario-summary");
const shortlistList = document.querySelector("#shortlist-list");
const copySummaryButton = document.querySelector("#copy-summary");
const clearShortlistButton = document.querySelector("#clear-shortlist");
const copyStatus = document.querySelector("#copy-status");
const dialog = document.querySelector("#lender-dialog");
const dialogClose = document.querySelector("#dialog-close");

let rankedLenders = [];
let shortlist = loadShortlist();

function formatAmount(amount) {
  return currencyFormatter.format(amount);
}

function formatAmountRange(lender) {
  return `${formatAmount(lender.minAmount)} - ${formatAmount(lender.maxAmount)}`;
}

function getFormValue(form, name, fallback = "") {
  const formData = new FormData(form);
  return String(formData.get(name) || fallback);
}

function getScenario() {
  return {
    product: getFormValue(scenarioForm, "product", "CRE"),
    amount: Number(getFormValue(scenarioForm, "amount", "0")),
    region: getFormValue(scenarioForm, "region", "National"),
    urgency: getFormValue(scenarioForm, "urgency", "standard"),
    collateral: getFormValue(scenarioForm, "collateral", "Real estate"),
  };
}

function getFilters() {
  return {
    query: getFormValue(searchForm, "query").trim().toLowerCase(),
    product: getFormValue(searchForm, "product", "all"),
    amount: Number(getFormValue(searchForm, "amount", "0")),
    sort: getFormValue(searchForm, "sort", "fit"),
  };
}

function calculateFit(lender, scenario) {
  let score = Math.round(lender.baseFit * 0.18);
  const notes = [];

  if (lender.type === scenario.product) {
    score += 30;
    notes.push(`Product match for ${scenario.product}.`);
  } else if (
    scenario.product === "SBA" &&
    lender.collateral.includes("Real estate") &&
    lender.maxAmount <= 10000000
  ) {
    score += 10;
    notes.push("Possible SBA-adjacent fit for real estate-backed request.");
  }

  if (scenario.amount >= lender.minAmount && scenario.amount <= lender.maxAmount) {
    score += 25;
    notes.push(`Loan size fits the ${formatAmountRange(lender)} range.`);
  } else if (scenario.amount < lender.minAmount && lender.minAmount - scenario.amount <= 500000) {
    score += 10;
    notes.push("Requested amount is near this lender's minimum.");
  } else if (scenario.amount <= lender.maxAmount) {
    score += 8;
    notes.push("Lender has enough maximum capacity for the request.");
  }

  if (lender.location === "National" || scenario.region === "National") {
    score += 12;
    notes.push("National coverage supports the selected region.");
  } else if (lender.location === scenario.region) {
    score += 15;
    notes.push(`Regional focus matches ${scenario.region}.`);
  }

  const targetDays = { fast: 14, standard: 45, flexible: 90 }[scenario.urgency];
  if (lender.closeDays <= targetDays) {
    score += 15;
    notes.push(`Estimated ${lender.closeDays}-day close fits the timeline.`);
  } else if (lender.closeDays <= targetDays + 14) {
    score += 7;
    notes.push("Close speed is close to the requested timeline.");
  }

  if (lender.collateral.includes(scenario.collateral)) {
    score += 10;
    notes.push(`Underwrites ${scenario.collateral.toLowerCase()} collateral.`);
  }

  return {
    score: Math.min(score, 99),
    notes: notes.slice(0, 3),
  };
}

function getRankedLenders() {
  const scenario = getScenario();
  return getAllLenders()
    .map((lender) => ({
      ...lender,
      fit: calculateFit(lender, scenario),
    }))
    .sort((a, b) => b.fit.score - a.fit.score);
}

function lenderMatchesSearch(lender, filters) {
  const searchableText = [
    lender.name,
    lender.type,
    lender.location,
    lender.description,
    ...lender.tags,
    ...lender.strengths,
  ]
    .join(" ")
    .toLowerCase();

  const matchesQuery =
    filters.query.length === 0 || searchableText.includes(filters.query);
  const matchesProduct = filters.product === "all" || lender.type === filters.product;
  const matchesAmount = lender.maxAmount >= filters.amount;

  return matchesQuery && matchesProduct && matchesAmount;
}

function sortLenders(lenderList, sortBy) {
  return [...lenderList].sort((a, b) => {
    if (sortBy === "rate") {
      return a.rate - b.rate;
    }

    if (sortBy === "speed") {
      return a.closeDays - b.closeDays;
    }

    if (sortBy === "amount") {
      return b.maxAmount - a.maxAmount;
    }

    return b.fit.score - a.fit.score;
  });
}

function createDefinition(label, value) {
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.textContent = label;
  description.textContent = value;
  wrapper.append(term, description);

  return wrapper;
}

function renderScenarioSummary() {
  const scenario = getScenario();
  scenarioSummary.replaceChildren(
    createDefinition("Need", scenario.product),
    createDefinition("Amount", formatAmount(scenario.amount)),
    createDefinition("Region", scenario.region),
    createDefinition(
      "Timeline",
      {
        fast: "ASAP",
        standard: "30 to 45 days",
        flexible: "Flexible",
      }[scenario.urgency],
    ),
  );
}

function renderTopMatch() {
  const topMatch = rankedLenders[0];
  if (!topMatch) {
    return;
  }

  heroBestFit.textContent = `${topMatch.fit.score}%`;
  topMatchName.textContent = topMatch.name;
  topMatchSummary.textContent =
    topMatch.fit.notes[0] || "This lender is currently the best fit for the request.";
  topMatchMeter.style.width = `${topMatch.fit.score}%`;
}

function getLenderInitials(name) {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function createLenderCard(lender) {
  const card = template.content.firstElementChild.cloneNode(true);
  const isShortlisted = shortlist.includes(lender.id);

  card.dataset.lenderId = lender.id;
  card.classList.toggle("is-shortlisted", isShortlisted);
  card.querySelector(".lender-initials").textContent = getLenderInitials(lender.name);
  card.querySelector(".lender-type").textContent = `${lender.type} | ${lender.location}`;
  card.querySelector("h3").textContent = lender.name;
  card.querySelector(".match-badge").textContent = `${lender.fit.score}% fit`;
  card.querySelector(".description").textContent = lender.description;
  card.querySelector(".amount").textContent = formatAmountRange(lender);
  card.querySelector(".rate").textContent = `${lender.rate.toFixed(1)}%`;
  card.querySelector(".speed").textContent = `${lender.closeDays} days`;
  card.querySelector(".detail-button").dataset.lenderId = lender.id;
  card.querySelector(".shortlist-button").dataset.lenderId = lender.id;
  card.querySelector(".shortlist-button").textContent = isShortlisted ? "Saved" : "Save";

  const fitNotes = card.querySelector(".fit-notes");
  lender.fit.notes.forEach((note) => {
    const item = document.createElement("li");
    item.textContent = note;
    fitNotes.append(item);
  });

  const tags = card.querySelector(".tags");
  lender.tags.forEach((tag) => {
    const pill = document.createElement("span");
    pill.className = "tag";
    pill.textContent = tag;
    tags.append(pill);
  });

  return card;
}

function renderEmptyState() {
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent =
    "No lenders match those filters yet. Try a broader product, amount, or keyword.";
  lenderGrid.append(empty);
}

function renderLenders() {
  const filters = getFilters();
  const filteredLenders = sortLenders(
    rankedLenders.filter((lender) => lenderMatchesSearch(lender, filters)),
    filters.sort,
  );

  lenderGrid.replaceChildren();
  resultCount.textContent = filteredLenders.length;
  resultLabel.textContent = filteredLenders.length === 1 ? "Matching Lender" : "Matching Lenders";

  if (filteredLenders.length === 0) {
    renderEmptyState();
    return;
  }

  filteredLenders.forEach((lender) => {
    lenderGrid.append(createLenderCard(lender));
  });
}

function loadShortlist() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const all = getAllLenders();
    return Array.isArray(parsed)
      ? parsed.filter((id) => all.some((lender) => lender.id === id))
      : [];
  } catch {
    return [];
  }
}

function saveShortlist() {
  localStorage.setItem(storageKey, JSON.stringify(shortlist));
}

function toggleShortlist(lenderId) {
  if (shortlist.includes(lenderId)) {
    shortlist = shortlist.filter((id) => id !== lenderId);
  } else {
    shortlist = [...shortlist, lenderId];
  }

  saveShortlist();
  renderAll();
}

function renderShortlist() {
  heroShortlistCount.textContent = shortlist.length;
  shortlistList.replaceChildren();

  if (shortlist.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No lenders saved yet. Add lenders from the ranked results.";
    shortlistList.append(empty);
    return;
  }

  shortlist
    .map((id) => rankedLenders.find((lender) => lender.id === id))
    .filter(Boolean)
    .forEach((lender) => {
      const item = document.createElement("article");
      item.className = "shortlist-item";

      const copy = document.createElement("div");
      const title = document.createElement("h3");
      const detail = document.createElement("p");
      title.textContent = lender.name;
      detail.textContent = `${lender.fit.score}% fit | ${formatAmountRange(
        lender,
      )} | ${lender.rate.toFixed(1)}% from`;
      copy.append(title, detail);

      const remove = document.createElement("button");
      remove.className = "button button-ghost";
      remove.type = "button";
      remove.dataset.lenderId = lender.id;
      remove.textContent = "Remove";

      item.append(copy, remove);
      shortlistList.append(item);
    });
}

function setPreset(presetName) {
  const preset = presets[presetName];
  if (!preset) {
    return;
  }

  Object.entries(preset).forEach(([name, value]) => {
    const field = scenarioForm.elements[name];
    if (field) {
      field.value = value;
    }
  });

  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === presetName);
  });

  renderAll();
}

function updateActivePreset() {
  const scenario = getScenario();
  const activePreset = Object.entries(presets).find(([, preset]) =>
    Object.entries(preset).every(([name, value]) => scenario[name] === value),
  );

  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.classList.toggle("active", activePreset?.[0] === button.dataset.preset);
  });
}

function openLenderDialog(lenderId) {
  const lender = rankedLenders.find((item) => item.id === lenderId);
  if (!lender) {
    return;
  }

  document.querySelector("#dialog-type").textContent = `${lender.type} | ${lender.location}`;
  document.querySelector("#dialog-name").textContent = lender.name;
  document.querySelector("#dialog-description").textContent = lender.description;
  document.querySelector("#dialog-amount").textContent = formatAmountRange(lender);
  document.querySelector("#dialog-rate").textContent = `${lender.rate.toFixed(1)}%`;
  document.querySelector("#dialog-speed").textContent = `${lender.closeDays} days`;

  const strengths = document.querySelector("#dialog-strengths");
  strengths.replaceChildren();
  lender.strengths.forEach((strength) => {
    const item = document.createElement("li");
    item.textContent = strength;
    strengths.append(item);
  });

  const guidelinesSection = document.querySelector("#dialog-guidelines-section");
  const sourceFile = document.querySelector("#dialog-source-file");
  if (lender.source === "pdf" && lender.sourceFile) {
    guidelinesSection.hidden = false;
    sourceFile.textContent = lender.sourceFile;
  } else {
    guidelinesSection.hidden = true;
  }

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeDialog() {
  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

function buildShortlistSummary() {
  const scenario = getScenario();
  const savedLenders = shortlist
    .map((id) => rankedLenders.find((lender) => lender.id === id))
    .filter(Boolean);

  if (savedLenders.length === 0) {
    return "No lenders have been shortlisted yet.";
  }

  const lines = [
    "BlenderCap demo shortlist",
    `Scenario: ${scenario.product}, ${formatAmount(scenario.amount)}, ${scenario.region}`,
    "",
    ...savedLenders.map(
      (lender) =>
        `${lender.name}: ${lender.fit.score}% fit, ${formatAmountRange(lender)}, ${lender.rate.toFixed(
          1,
        )}% from, ${lender.closeDays}-day close`,
    ),
  ];

  return lines.join("\n");
}

async function copyShortlistSummary() {
  const summary = buildShortlistSummary();

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = summary;
      document.body.append(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    copyStatus.textContent = "Shortlist summary copied.";
  } catch {
    copyStatus.textContent = summary;
  }
}

function renderAll() {
  lenderCount.textContent = getAllLenders().length;
  rankedLenders = getRankedLenders();
  renderScenarioSummary();
  renderTopMatch();
  renderLenders();
  renderShortlist();
  renderUploadedLendersList();
}

lenderCount.textContent = getAllLenders().length;

scenarioForm.addEventListener("input", () => {
  updateActivePreset();
  renderAll();
});

scenarioForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

searchForm.addEventListener("input", renderLenders);
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => setPreset(button.dataset.preset));
});

lenderGrid.addEventListener("click", (event) => {
  const detailButton = event.target.closest(".detail-button");
  const shortlistButton = event.target.closest(".shortlist-button");

  if (detailButton) {
    openLenderDialog(detailButton.dataset.lenderId);
  }

  if (shortlistButton) {
    toggleShortlist(shortlistButton.dataset.lenderId);
  }
});

shortlistList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("button[data-lender-id]");
  if (removeButton) {
    toggleShortlist(removeButton.dataset.lenderId);
  }
});

copySummaryButton.addEventListener("click", copyShortlistSummary);
clearShortlistButton.addEventListener("click", () => {
  shortlist = [];
  saveShortlist();
  copyStatus.textContent = "";
  renderAll();
});
dialogClose.addEventListener("click", closeDialog);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    closeDialog();
  }
});

/* ---- PDF upload and lender extraction ---- */

const uploadDropzone = document.querySelector("#upload-dropzone");
const pdfInput = document.querySelector("#pdf-input");
const uploadStatus = document.querySelector("#upload-status");
const uploadedLendersList = document.querySelector("#uploaded-lenders-list");

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
  if (tags.length === 0) {
    tags.push(products[0] || "General");
  }
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
    pdfFiles.length +
    " file" +
    (pdfFiles.length > 1 ? "s" : "") +
    "...</span>";

  const results = { success: 0, failed: 0 };
  for (const file of pdfFiles) {
    try {
      const text = await extractTextFromPdf(file);
      if (text.trim().length < 20) {
        results.failed++;
        continue;
      }
      const lender = parseLenderFromText(text, file.name);
      uploadedLenders.push(lender);
      results.success++;
    } catch (err) {
      console.error("Failed to parse PDF:", file.name, err);
      results.failed++;
    }
  }

  saveUploadedLenders();
  shortlist = loadShortlist();
  renderAll();

  const totalUploaded = uploadedLenders.length;
  const totalLabel = totalUploaded + " uploaded lender" + (totalUploaded > 1 ? "s" : "") + " total";

  if (results.success > 0 && results.failed === 0) {
    uploadStatus.innerHTML =
      '<span class="upload-success">Added ' +
      results.success +
      " lender" +
      (results.success > 1 ? "s" : "") +
      " from PDF guidelines — " + totalLabel + ".</span>";
  } else if (results.success > 0 && results.failed > 0) {
    uploadStatus.innerHTML =
      '<span class="upload-success">Added ' +
      results.success +
      " lender" +
      (results.success > 1 ? "s" : "") +
      " — " + totalLabel +
      '.</span> <span class="upload-error">' +
      results.failed +
      " file" +
      (results.failed > 1 ? "s" : "") +
      " could not be parsed.</span>";
  } else {
    uploadStatus.innerHTML =
      '<span class="upload-error">Could not extract lender data from the selected file' +
      (results.failed > 1 ? "s" : "") +
      ".</span>";
  }
}

function removeUploadedLender(lenderId) {
  const index = uploadedLenders.findIndex((l) => l.id === lenderId);
  if (index !== -1) {
    uploadedLenders.splice(index, 1);
    saveUploadedLenders();
    shortlist = shortlist.filter((id) => id !== lenderId);
    saveShortlist();
    renderAll();
  }
}

function renderUploadedLendersList() {
  uploadedLendersList.replaceChildren();
  if (uploadedLenders.length === 0) return;

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
    removeBtn.className = "button button-ghost";
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeUploadedLender(lender.id));

    item.append(info, removeBtn);
    uploadedLendersList.append(item);
  });
}

uploadDropzone.addEventListener("click", () => pdfInput.click());
uploadDropzone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    pdfInput.click();
  }
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

renderAll();
