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
  {
    id: "pinnacle-home-lending",
    name: "Pinnacle Home Lending",
    type: "Conventional",
    location: "National",
    description:
      "Full-service conventional mortgage originator for primary residences, second homes, and investment properties.",
    minAmount: 100000,
    maxAmount: 750000,
    rate: 6.25,
    closeDays: 30,
    baseFit: 94,
    collateral: ["Real estate"],
    strengths: [
      "Strong conventional conforming product with competitive pricing.",
      "National reach with local processing for faster underwriting.",
      "Experienced with first-time buyers and investment properties.",
    ],
    tags: ["Conforming", "Primary residence", "Investment"],
  },
  {
    id: "liberty-fha-mortgage",
    name: "Liberty FHA Mortgage",
    type: "FHA",
    location: "National",
    description:
      "FHA-approved lender specializing in low down payment purchases and streamline refinances for qualifying borrowers.",
    minAmount: 75000,
    maxAmount: 500000,
    rate: 5.9,
    closeDays: 35,
    baseFit: 90,
    collateral: ["Real estate"],
    strengths: [
      "FHA expertise with 3.5% down payment programs for qualified buyers.",
      "Streamline refinance options simplify rate-and-term improvements.",
      "Strong track record with credit-challenged borrowers.",
    ],
    tags: ["FHA", "Low down payment", "Streamline refi"],
  },
  {
    id: "veterans-first-home-loans",
    name: "Veterans First Home Loans",
    type: "VA",
    location: "National",
    description:
      "Dedicated VA lender offering zero-down purchase and IRRRL refinance programs for eligible veterans and service members.",
    minAmount: 100000,
    maxAmount: 1500000,
    rate: 5.75,
    closeDays: 32,
    baseFit: 92,
    collateral: ["Real estate"],
    strengths: [
      "VA loan specialist with zero down payment for eligible borrowers.",
      "IRRRL streamline refinance reduces paperwork and closing costs.",
      "Dedicated to serving military families with personalized support.",
    ],
    tags: ["VA", "Zero down", "IRRRL"],
  },
  {
    id: "grandview-jumbo-mortgage",
    name: "Grandview Jumbo Mortgage",
    type: "Jumbo",
    location: "West Coast",
    description:
      "Jumbo and super-jumbo mortgage products for high-value properties in premium coastal markets.",
    minAmount: 750000,
    maxAmount: 10000000,
    rate: 6.8,
    closeDays: 28,
    baseFit: 87,
    collateral: ["Real estate"],
    strengths: [
      "Portfolio jumbo products with flexible guidelines for high-net-worth borrowers.",
      "West Coast focus with deep knowledge of premium property markets.",
      "Competitive pricing on super-jumbo loans above $2M.",
    ],
    tags: ["Jumbo", "Super-jumbo", "High-value"],
  },
  {
    id: "evergreen-construction-lending",
    name: "Evergreen Construction Lending",
    type: "Construction",
    location: "Southeast",
    description:
      "Single-close construction-to-permanent loans for custom homes and major renovation projects.",
    minAmount: 200000,
    maxAmount: 3000000,
    rate: 7.2,
    closeDays: 45,
    baseFit: 86,
    collateral: ["Real estate"],
    strengths: [
      "Single-close construction-to-perm simplifies the build process.",
      "Draw schedules and builder approval handled in-house.",
      "Southeast market expertise for new construction and major rehab.",
    ],
    tags: ["Construction", "Single-close", "Renovation"],
  },
];

const commercialPresets = {
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

const residentialPresets = {
  purchase: {
    product: "Conventional",
    amount: 450000,
    region: "National",
    urgency: "standard",
    collateral: "Real estate",
  },
  fha: {
    product: "FHA",
    amount: 350000,
    region: "National",
    urgency: "standard",
    collateral: "Real estate",
  },
  va: {
    product: "VA",
    amount: 500000,
    region: "National",
    urgency: "standard",
    collateral: "Real estate",
  },
};

let activeLoanType = "commercial";
let presets = commercialPresets;

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

/* ---- Loan type tabs (Residential / Commercial) ---- */

const presetRow = document.querySelector("#preset-row");
const commercialPresetButtons = {
  property: "Property purchase",
  equipment: "Equipment upgrade",
  growth: "Growth capital",
};
const residentialPresetButtons = {
  purchase: "Home purchase",
  fha: "FHA loan",
  va: "VA loan",
};

function switchLoanType(type) {
  activeLoanType = type;
  presets = type === "residential" ? residentialPresets : commercialPresets;

  document.querySelectorAll(".loan-type-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.loanType === type);
  });

  const buttons = type === "residential" ? residentialPresetButtons : commercialPresetButtons;
  presetRow.replaceChildren();
  const presetNames = Object.keys(buttons);
  presetNames.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.className = "preset" + (i === 0 ? " active" : "");
    btn.type = "button";
    btn.dataset.preset = name;
    btn.textContent = buttons[name];
    btn.addEventListener("click", () => setPreset(name));
    presetRow.append(btn);
  });

  setPreset(presetNames[0]);
}

document.querySelectorAll(".loan-type-tab").forEach((tab) => {
  tab.addEventListener("click", () => switchLoanType(tab.dataset.loanType));
});

document.querySelectorAll(".cta-card[data-loan-type]").forEach((card) => {
  card.addEventListener("click", () => switchLoanType(card.dataset.loanType));
});

renderAll();
