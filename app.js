const catalog = window.INDUSCOUT_DATA || {};
const products = catalog.products || [];
const categoryTaxonomy = catalog.categoryTaxonomy || [];
const sourceChannels = catalog.sourceChannels || [];
const sourceDirectory = catalog.sourceDirectory || [];

const state = {
  query: "",
  category: "all",
  region: "all",
  sourceType: "all",
  priority: "balanced",
  datasheetOnly: false,
  verifiedOnly: false,
  shortlist: []
};

const els = {
  search: document.querySelector("#globalSearch"),
  heroSearch: document.querySelector("#heroSearch"),
  category: document.querySelector("#categoryFilter"),
  region: document.querySelector("#regionFilter"),
  sourceType: document.querySelector("#sourceTypeFilter"),
  datasheetOnly: document.querySelector("#datasheetOnly"),
  verifiedOnly: document.querySelector("#verifiedOnly"),
  resultCount: document.querySelector("#resultCount"),
  resultSummary: document.querySelector("#resultSummary"),
  results: document.querySelector("#resultsGrid"),
  sourceGrid: document.querySelector("#sourceGrid"),
  sourceDirectory: document.querySelector("#sourceDirectory"),
  categoryGrid: document.querySelector("#categoryGrid"),
  priorityButtons: [...document.querySelectorAll("[data-priority]")],
  reset: document.querySelector("#resetFilters"),
  shortlistDrawer: document.querySelector("#shortlistDrawer"),
  shortlistToggle: document.querySelector("#shortlistToggle"),
  closeShortlist: document.querySelector("#closeShortlist"),
  scrim: document.querySelector("#scrim"),
  shortlistItems: document.querySelector("#shortlistItems"),
  shortlistCount: document.querySelector("#shortlistCount"),
  clearShortlist: document.querySelector("#clearShortlist"),
  copyShortlist: document.querySelector("#copyShortlist"),
  exportShortlist: document.querySelector("#exportShortlist"),
  categoryCount: document.querySelector("#categoryCount"),
  productCount: document.querySelector("#productCount"),
  sourceCount: document.querySelector("#sourceCount")
};

const categories = categoryTaxonomy.length
  ? categoryTaxonomy.map((category) => category.name)
  : [...new Set(products.map((product) => product.category))].sort();

const sourceTypes = [...new Set(products.flatMap((product) => product.sources.map((source) => source.type)))].sort();

function init() {
  renderMetrics();
  populateFilters();
  renderCategories();
  renderSources();
  renderSourceDirectory();
  wireEvents();
  render();
}

function populateFilters() {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    els.category.append(option);
  });

  sourceTypes.forEach((sourceType) => {
    const option = document.createElement("option");
    option.value = sourceType;
    option.textContent = sourceType;
    els.sourceType.append(option);
  });
}

function renderMetrics() {
  const sourceLinkCount = products.reduce((total, product) => total + product.sources.length, 0);
  setText(els.categoryCount, categoryTaxonomy.length || categories.length);
  setText(els.productCount, products.length);
  setText(els.sourceCount, sourceLinkCount);
}

function wireEvents() {
  els.heroSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = els.search.value.trim();
    document.querySelector("#finder").scrollIntoView({ behavior: "smooth", block: "start" });
    render();
  });

  els.search.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    render();
  });

  els.category.addEventListener("change", (event) => {
    state.category = event.target.value;
    render();
  });

  els.region.addEventListener("change", (event) => {
    state.region = event.target.value;
    render();
  });

  els.sourceType.addEventListener("change", (event) => {
    state.sourceType = event.target.value;
    render();
  });

  els.datasheetOnly.addEventListener("change", (event) => {
    state.datasheetOnly = event.target.checked;
    render();
  });

  els.verifiedOnly.addEventListener("change", (event) => {
    state.verifiedOnly = event.target.checked;
    render();
  });

  els.priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.priority = button.dataset.priority;
      els.priorityButtons.forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });

  els.reset.addEventListener("click", () => {
    Object.assign(state, {
      query: "",
      category: "all",
      region: "all",
      sourceType: "all",
      priority: "balanced",
      datasheetOnly: false,
      verifiedOnly: false
    });
    els.search.value = "";
    els.category.value = "all";
    els.region.value = "all";
    els.sourceType.value = "all";
    els.datasheetOnly.checked = false;
    els.verifiedOnly.checked = false;
    els.priorityButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.priority === "balanced");
    });
    render();
  });

  els.results.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) {
      addToShortlist(button.dataset.add);
    }
  });

  els.categoryGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category-select]");
    if (!button) {
      return;
    }
    state.category = button.dataset.categorySelect;
    els.category.value = state.category;
    document.querySelector("#finder").scrollIntoView({ behavior: "smooth", block: "start" });
    render();
  });

  els.shortlistToggle.addEventListener("click", openShortlist);
  els.exportShortlist.addEventListener("click", openShortlist);
  els.closeShortlist.addEventListener("click", closeShortlist);
  els.scrim.addEventListener("click", closeShortlist);
  els.clearShortlist.addEventListener("click", () => {
    state.shortlist = [];
    renderShortlist();
    render();
  });
  els.copyShortlist.addEventListener("click", copyShortlist);
}

function render() {
  const matches = products
    .filter(matchesFilters)
    .sort((a, b) => b[state.priority] - a[state.priority]);

  els.resultCount.textContent = `${matches.length} ${matches.length === 1 ? "product" : "products"}`;
  els.resultSummary.textContent = summaryText(matches.length);

  if (!matches.length) {
    els.results.innerHTML = '<div class="empty-state">No products match this search yet. Try a broader keyword, source type, or region.</div>';
    return;
  }

  els.results.innerHTML = matches.map(productTemplate).join("");
}

function matchesFilters(product) {
  const haystack = [
    product.name,
    product.brand,
    product.sku,
    product.category,
    product.family,
    product.description,
    product.lifecycle,
    product.specs.join(" "),
    product.applications.join(" "),
    product.certifications.join(" "),
    product.alternatives.join(" "),
    product.sources.map((source) => `${source.name} ${source.type} ${source.region} ${source.action}`).join(" ")
  ]
    .join(" ")
    .toLowerCase();

  const queryTerms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
  const queryMatch = queryTerms.every((term) => haystack.includes(term));
  const categoryMatch = state.category === "all" || product.category === state.category;
  const regionMatch = state.region === "all" || product.regions.includes(state.region);
  const sourceTypeMatch = state.sourceType === "all" || product.sources.some((source) => source.type === state.sourceType);
  const datasheetMatch = !state.datasheetOnly || product.datasheet;
  const verifiedMatch = !state.verifiedOnly || product.verified;

  return queryMatch && categoryMatch && regionMatch && sourceTypeMatch && datasheetMatch && verifiedMatch;
}

function summaryText(count) {
  if (!state.query && state.category === "all" && state.region === "all" && state.sourceType === "all") {
    return "Showing beta catalog records";
  }
  if (!count) {
    return "No match in current beta catalog";
  }
  if (state.query) {
    return `Best matches for "${state.query}"`;
  }
  return "Filtered procurement matches";
}

function productTemplate(product) {
  const score = product[state.priority];
  const isShortlisted = state.shortlist.includes(product.id);
  const sourceLinks = product.sources.map(sourceLinkTemplate).join("");
  const applicationList = product.applications.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const specList = product.specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("");
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check";

  return `
    <article class="product-card">
      <div class="product-main">
        <div class="product-top">
          <div>
            <h3>${escapeHtml(product.name)}</h3>
            <div class="sku">${escapeHtml(product.brand)} &middot; ${escapeHtml(product.sku)} &middot; ${escapeHtml(product.category)}</div>
          </div>
          <span class="badge ${product.verified ? "" : "amber"}">${product.verified ? "Verified signal" : "Needs verification"}</span>
        </div>
        <p class="description">${escapeHtml(product.description)}</p>
        <div class="product-flags">
          <span>${escapeHtml(product.family)}</span>
          <span>Lifecycle: ${escapeHtml(product.lifecycle)}</span>
          <span>Certs: ${escapeHtml(certs)}</span>
        </div>
        <ul class="spec-list">
          ${specList}
        </ul>
        <ul class="application-list" aria-label="Common applications">
          ${applicationList}
        </ul>
        <div class="source-links">${sourceLinks}</div>
      </div>
      <div class="product-side">
        <div class="score">
          <span>${escapeHtml(state.priority)} fit</span>
          <strong>${score}</strong>
          <div class="bar" aria-hidden="true"><i style="width:${score}%"></i></div>
        </div>
        <div class="meta-list">
          <span>Lead time <b>${escapeHtml(product.lead)}</b></span>
          <span>MOQ <b>${escapeHtml(product.moq)}</b></span>
          <span>Datasheet <b>${product.datasheet ? "Yes" : "Check"}</b></span>
        </div>
        <div class="card-actions">
          <button type="button" data-add="${escapeHtml(product.id)}">${isShortlisted ? "Shortlisted" : "Add to shortlist"}</button>
          <a class="button-link ghost-button" href="${escapeHtml(product.sources[0].url)}" target="_blank" rel="noreferrer">Open primary source</a>
        </div>
      </div>
    </article>
  `;
}

function sourceLinkTemplate(source) {
  return `
    <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer" title="${escapeHtml(source.action)}">
      <span>${escapeHtml(source.type)}</span>
      ${escapeHtml(source.name)}
    </a>
  `;
}

function renderCategories() {
  els.categoryGrid.innerHTML = categoryTaxonomy
    .map((category) => {
      const productCount = products.filter((product) => product.category === category.name).length;
      const focus = category.focus.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

      return `
        <article class="category-card">
          <span>${productCount} beta records</span>
          <h3>${escapeHtml(category.name)}</h3>
          <p>${escapeHtml(category.summary)}</p>
          <ul>${focus}</ul>
          <button type="button" data-category-select="${escapeHtml(category.name)}">View matches</button>
        </article>
      `;
    })
    .join("");
}

function renderSources() {
  els.sourceGrid.innerHTML = sourceChannels
    .map(
      (source) => `
        <article class="source-card">
          <span>${escapeHtml(source.type)}</span>
          <h3>${escapeHtml(source.title)}</h3>
          <p>${escapeHtml(source.body)}</p>
          <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">Explore source</a>
        </article>
      `
    )
    .join("");
}

function renderSourceDirectory() {
  els.sourceDirectory.innerHTML = sourceDirectory
    .map(
      (source) => `
        <article class="directory-card">
          <div>
            <span>${escapeHtml(source.type)}</span>
            <h3>${escapeHtml(source.name)}</h3>
          </div>
          <p>${escapeHtml(source.bestFor)}</p>
          <small>${escapeHtml(source.regions.join(", "))}</small>
          <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">Open</a>
        </article>
      `
    )
    .join("");
}

function addToShortlist(id) {
  if (!state.shortlist.includes(id)) {
    state.shortlist.push(id);
  }
  renderShortlist();
  render();
}

function removeFromShortlist(id) {
  state.shortlist = state.shortlist.filter((item) => item !== id);
  renderShortlist();
  render();
}

function renderShortlist() {
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  els.shortlistCount.textContent = selected.length;

  if (!selected.length) {
    els.shortlistItems.innerHTML = '<div class="empty-state">Your shortlist is empty. Add products from the finder to draft an RFQ.</div>';
    return;
  }

  els.shortlistItems.innerHTML = selected
    .map(
      (product) => `
        <article class="shortlist-item">
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.brand)} &middot; ${escapeHtml(product.sku)}</p>
          <p>Alternatives: ${escapeHtml(product.alternatives.join(", "))}</p>
          <button type="button" data-remove="${escapeHtml(product.id)}">Remove</button>
        </article>
      `
    )
    .join("");

  els.shortlistItems.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeFromShortlist(button.dataset.remove));
  });
}

async function copyShortlist() {
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const text = selected.length
    ? selected
        .map((product, index) => {
          const sources = product.sources.map((source) => `${source.type} - ${source.name}: ${source.url}`).join("; ");
          return `${index + 1}. ${product.brand} ${product.sku} - ${product.name}
Category: ${product.category}
Specs: ${product.specs.join(", ")}
Applications: ${product.applications.join(", ")}
Alternatives: ${product.alternatives.join(", ")}
Sources: ${sources}`;
        })
        .join("\n\n")
    : "InduScout RFQ shortlist is empty.";

  try {
    await navigator.clipboard.writeText(text);
    els.copyShortlist.textContent = "Copied";
    setTimeout(() => {
      els.copyShortlist.textContent = "Copy RFQ summary";
    }, 1200);
  } catch {
    window.prompt("Copy RFQ summary", text);
  }
}

function openShortlist() {
  renderShortlist();
  els.shortlistDrawer.classList.add("open");
  els.shortlistDrawer.setAttribute("aria-hidden", "false");
  els.scrim.classList.add("open");
}

function closeShortlist() {
  els.shortlistDrawer.classList.remove("open");
  els.shortlistDrawer.setAttribute("aria-hidden", "true");
  els.scrim.classList.remove("open");
}

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return map[character];
  });
}

init();
