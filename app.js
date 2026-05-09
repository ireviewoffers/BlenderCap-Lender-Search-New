const lenders = [
  {
    name: "Atlas Commercial Capital",
    type: "CRE",
    location: "National",
    description:
      "Bridge and permanent debt for stabilized retail, multifamily, and industrial properties.",
    minAmount: 1000000,
    maxAmount: 25000000,
    rate: 7.1,
    closeDays: 24,
    match: 96,
    tags: ["Bridge", "Multifamily", "Industrial"],
  },
  {
    name: "Harbor SBA Partners",
    type: "SBA",
    location: "West Coast",
    description:
      "Owner-occupied real estate and acquisition financing with SBA 7(a) and 504 programs.",
    minAmount: 250000,
    maxAmount: 5000000,
    rate: 8.4,
    closeDays: 42,
    match: 89,
    tags: ["SBA 7(a)", "Owner-occupied", "Acquisition"],
  },
  {
    name: "Northline Equipment Finance",
    type: "Equipment",
    location: "Midwest",
    description:
      "Fast approvals for yellow iron, fleet, manufacturing, and medical equipment purchases.",
    minAmount: 75000,
    maxAmount: 3500000,
    rate: 6.8,
    closeDays: 10,
    match: 93,
    tags: ["Fleet", "Manufacturing", "Medical"],
  },
  {
    name: "BluePeak Working Capital",
    type: "Working Capital",
    location: "National",
    description:
      "Flexible revolving lines for growth-stage companies with repeat revenue and seasonal demand.",
    minAmount: 100000,
    maxAmount: 2000000,
    rate: 9.2,
    closeDays: 7,
    match: 85,
    tags: ["Revolving line", "Seasonal", "Growth"],
  },
  {
    name: "Summit Private Credit",
    type: "CRE",
    location: "Southeast",
    description:
      "Structured private credit for construction takeouts, value-add assets, and complex sponsors.",
    minAmount: 5000000,
    maxAmount: 60000000,
    rate: 8.1,
    closeDays: 18,
    match: 91,
    tags: ["Private credit", "Value-add", "Takeout"],
  },
  {
    name: "Keystone Business Bank",
    type: "Working Capital",
    location: "Northeast",
    description:
      "Relationship banking for established operators seeking term loans and operating lines.",
    minAmount: 500000,
    maxAmount: 10000000,
    rate: 7.6,
    closeDays: 30,
    match: 88,
    tags: ["Term loan", "Operating line", "Bank"],
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const form = document.querySelector("#search-form");
const lenderGrid = document.querySelector("#lender-grid");
const template = document.querySelector("#lender-card-template");
const resultCount = document.querySelector("#result-count");
const resultLabel = document.querySelector("#result-label");
const lenderCount = document.querySelector("#lender-count");

function formatAmountRange(lender) {
  return `${currencyFormatter.format(lender.minAmount)} - ${currencyFormatter.format(
    lender.maxAmount,
  )}`;
}

function lenderMatchesSearch(lender, filters) {
  const searchableText = [
    lender.name,
    lender.type,
    lender.location,
    lender.description,
    ...lender.tags,
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

    return b.match - a.match;
  });
}

function getFilters() {
  const formData = new FormData(form);

  return {
    query: String(formData.get("query") || "").trim().toLowerCase(),
    product: String(formData.get("product") || "all"),
    amount: Number(formData.get("amount") || 0),
    sort: String(formData.get("sort") || "match"),
  };
}

function createLenderCard(lender) {
  const card = template.content.firstElementChild.cloneNode(true);

  card.querySelector(".lender-type").textContent = `${lender.type} | ${lender.location}`;
  card.querySelector("h3").textContent = lender.name;
  card.querySelector(".match-score").textContent = `${lender.match}% match`;
  card.querySelector(".description").textContent = lender.description;
  card.querySelector(".amount").textContent = formatAmountRange(lender);
  card.querySelector(".rate").textContent = `${lender.rate.toFixed(1)}%`;
  card.querySelector(".speed").textContent = `${lender.closeDays} days`;

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
    "No lenders match those filters yet. Try a broader product or smaller amount.";
  lenderGrid.append(empty);
}

function renderLenders() {
  const filters = getFilters();
  const filteredLenders = sortLenders(
    lenders.filter((lender) => lenderMatchesSearch(lender, filters)),
    filters.sort,
  );

  lenderGrid.replaceChildren();
  resultCount.textContent = filteredLenders.length;
  resultLabel.textContent = filteredLenders.length === 1 ? "match" : "matches";

  if (filteredLenders.length === 0) {
    renderEmptyState();
    return;
  }

  filteredLenders.forEach((lender) => {
    lenderGrid.append(createLenderCard(lender));
  });
}

lenderCount.textContent = lenders.length;
form.addEventListener("input", renderLenders);
renderLenders();
