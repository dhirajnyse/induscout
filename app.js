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
  confidence: "all",
  priority: "balanced",
  datasheetOnly: false,
  verifiedOnly: false,
  shortlist: [],
  compare: [],
  notes: loadNotes(),
  activeProductId: null
};

const els = {
  search: document.querySelector("#globalSearch"),
  heroSearch: document.querySelector("#heroSearch"),
  finderSearch: document.querySelector("#finderSearchInput"),
  finderSearchForm: document.querySelector("#finderSearch"),
  category: document.querySelector("#categoryFilter"),
  region: document.querySelector("#regionFilter"),
  sourceType: document.querySelector("#sourceTypeFilter"),
  confidence: document.querySelector("#confidenceFilter"),
  datasheetOnly: document.querySelector("#datasheetOnly"),
  verifiedOnly: document.querySelector("#verifiedOnly"),
  saveSession: document.querySelector("#saveSession"),
  loadSession: document.querySelector("#loadSession"),
  exportSession: document.querySelector("#exportSession"),
  importSession: document.querySelector("#importSession"),
  importSessionFile: document.querySelector("#importSessionFile"),
  sessionStatus: document.querySelector("#sessionStatus"),
  productRequestPanel: document.querySelector("#productRequestPanel"),
  requestPart: document.querySelector("#requestPart"),
  requestBrand: document.querySelector("#requestBrand"),
  requestCategory: document.querySelector("#requestCategory"),
  requestCountry: document.querySelector("#requestCountry"),
  requestUrgency: document.querySelector("#requestUrgency"),
  requestQuantity: document.querySelector("#requestQuantity"),
  requestNotes: document.querySelector("#requestNotes"),
  copyProductRequest: document.querySelector("#copyProductRequest"),
  resultCount: document.querySelector("#resultCount"),
  resultSummary: document.querySelector("#resultSummary"),
  results: document.querySelector("#resultsGrid"),
  sourceGrid: document.querySelector("#sourceGrid"),
  sourceDirectory: document.querySelector("#sourceDirectory"),
  categoryGrid: document.querySelector("#categoryGrid"),
  priorityButtons: [...document.querySelectorAll("[data-priority]")],
  reset: document.querySelector("#resetFilters"),
  shortlistDrawer: document.querySelector("#shortlistDrawer"),
  productDetail: document.querySelector("#productDetail"),
  shortlistToggle: document.querySelector("#shortlistToggle"),
  closeShortlist: document.querySelector("#closeShortlist"),
  closeProductDetail: document.querySelector("#closeProductDetail"),
  scrim: document.querySelector("#scrim"),
  shortlistItems: document.querySelector("#shortlistItems"),
  productDetailContent: document.querySelector("#productDetailContent"),
  shortlistCount: document.querySelector("#shortlistCount"),
  clearShortlist: document.querySelector("#clearShortlist"),
  copyShortlist: document.querySelector("#copyShortlist"),
  downloadRfqPack: document.querySelector("#downloadRfqPack"),
  downloadShortlistXlsx: document.querySelector("#downloadShortlistXlsx"),
  downloadShortlist: document.querySelector("#downloadShortlist"),
  exportShortlist: document.querySelector("#exportShortlist"),
  openCompare: document.querySelector("#openCompare"),
  compareCount: document.querySelector("#compareCount"),
  compareSummary: document.querySelector("#compareSummary"),
  compareGrid: document.querySelector("#compareGrid"),
  clearCompare: document.querySelector("#clearCompare"),
  copyCompare: document.querySelector("#copyCompare"),
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
  hydrateFromUrl();
  renderCategories();
  renderSources();
  renderSourceDirectory();
  wireEvents();
  renderCompare();
  render();
}

function hydrateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").trim();
  const category = (params.get("category") || "").trim();

  if (query) {
    state.query = query;
    els.search.value = query;
    els.finderSearch.value = query;
  }

  if (category && categories.includes(category)) {
    state.category = category;
    els.category.value = category;
  }
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
    setQuery(els.search.value);
    document.querySelector("#finder").scrollIntoView({ behavior: "smooth", block: "start" });
    render();
  });

  els.search.addEventListener("input", (event) => {
    setQuery(event.target.value);
    render();
  });

  els.finderSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setQuery(els.finderSearch.value);
    render();
  });

  els.finderSearch.addEventListener("input", (event) => {
    setQuery(event.target.value);
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

  els.confidence.addEventListener("change", (event) => {
    state.confidence = event.target.value;
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
    applySession({
      filters: defaultFilters()
    });
    render();
  });

  els.results.addEventListener("click", (event) => {
    const requestButton = event.target.closest("[data-open-product-request]");
    const shortlistButton = event.target.closest("[data-add]");
    const compareButton = event.target.closest("[data-compare]");
    const detailButton = event.target.closest("[data-detail]");

    if (requestButton) {
      openProductRequestPanel();
      return;
    }

    if (shortlistButton) {
      toggleShortlist(shortlistButton.dataset.add);
    }

    if (compareButton) {
      toggleCompare(compareButton.dataset.compare);
    }

    if (detailButton) {
      openProductDetail(detailButton.dataset.detail);
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
  els.openCompare.addEventListener("click", () => {
    document.querySelector("#compare").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  els.clearCompare.addEventListener("click", () => {
    state.compare = [];
    renderCompare();
    render();
  });
  els.copyCompare.addEventListener("click", copyCompare);
  els.compareGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-compare]");
    if (button) {
      toggleCompare(button.dataset.removeCompare);
    }
  });
  els.closeShortlist.addEventListener("click", closeShortlist);
  els.closeProductDetail.addEventListener("click", closeProductDetail);
  els.scrim.addEventListener("click", closeOverlays);
  els.productDetailContent.addEventListener("click", (event) => {
    const copyButton = event.target.closest("[data-copy-rfq]");
    const supplierButton = event.target.closest("[data-copy-supplier]");
    const updateButton = event.target.closest("[data-copy-update]");
    const briefButton = event.target.closest("[data-copy-brief]");
    const shortlistButton = event.target.closest("[data-detail-add]");
    const compareButton = event.target.closest("[data-detail-compare]");

    if (copyButton) {
      copyProductRfq(copyButton.dataset.copyRfq);
    }

    if (supplierButton) {
      copySupplierOutreach(supplierButton.dataset.copySupplier, supplierButton);
    }

    if (briefButton) {
      copyProcurementBrief(briefButton.dataset.copyBrief, briefButton);
    }

    if (updateButton) {
      copyDataUpdate(updateButton.dataset.copyUpdate);
    }

    if (shortlistButton) {
      toggleShortlist(shortlistButton.dataset.detailAdd);
      openProductDetail(shortlistButton.dataset.detailAdd);
    }

    if (compareButton) {
      toggleCompare(compareButton.dataset.detailCompare);
      openProductDetail(compareButton.dataset.detailCompare);
    }
  });
  els.productDetailContent.addEventListener("input", (event) => {
    if (event.target.matches("[data-buyer-note]")) {
      state.notes[event.target.dataset.buyerNote] = event.target.value;
      saveNotes();
    }
  });
  els.clearShortlist.addEventListener("click", () => {
    state.shortlist = [];
    renderShortlist();
    render();
  });
  els.copyShortlist.addEventListener("click", copyShortlist);
  els.downloadRfqPack.addEventListener("click", downloadRfqPack);
  els.downloadShortlistXlsx.addEventListener("click", downloadShortlistXlsx);
  els.downloadShortlist.addEventListener("click", downloadShortlistCsv);
  els.saveSession.addEventListener("click", saveSession);
  els.loadSession.addEventListener("click", loadSession);
  els.exportSession.addEventListener("click", exportSessionFile);
  els.importSession.addEventListener("click", () => els.importSessionFile.click());
  els.importSessionFile.addEventListener("change", importSessionFile);
  els.copyProductRequest.addEventListener("click", copyProductRequest);
}

function setQuery(value) {
  const rawValue = String(value);
  state.query = rawValue.trim();

  if (document.activeElement !== els.search) {
    els.search.value = rawValue;
  }

  if (document.activeElement !== els.finderSearch) {
    els.finderSearch.value = rawValue;
  }
}

function render() {
  const matches = products
    .filter(matchesFilters)
    .sort((a, b) => b[state.priority] - a[state.priority]);

  updateShortlistControls();
  els.resultCount.textContent = `${matches.length} ${matches.length === 1 ? "product" : "products"}`;
  els.resultSummary.textContent = summaryText(matches.length);

  if (!matches.length) {
    els.results.innerHTML = `
      <div class="empty-state request-empty">
        <strong>No products match this search yet.</strong>
        <p>Try a broader keyword, source type, or region. If the item is still missing, create a product request so the exact part, sources, alternates, and datasheet path can be reviewed.</p>
        <button class="ghost-button" type="button" data-open-product-request>Open product request</button>
      </div>
    `;
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
  const confidenceMatch = state.confidence === "all" || confidenceForProduct(product).level === state.confidence;
  const datasheetMatch = !state.datasheetOnly || product.datasheet;
  const verifiedMatch = !state.verifiedOnly || product.verified;

  return queryMatch && categoryMatch && regionMatch && sourceTypeMatch && confidenceMatch && datasheetMatch && verifiedMatch;
}

function summaryText(count) {
  if (!state.query && state.category === "all" && state.region === "all" && state.sourceType === "all" && state.confidence === "all") {
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
  const isCompared = state.compare.includes(product.id);
  const confidence = confidenceForProduct(product);
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
          <div class="badge-stack">
            <span class="badge ${product.verified ? "" : "amber"}">${product.verified ? "Verified signal" : "Needs verification"}</span>
            <span class="confidence-badge ${confidence.level}">${escapeHtml(confidence.label)}</span>
          </div>
        </div>
        <p class="description">${escapeHtml(product.description)}</p>
        <div class="product-flags">
          <span>${escapeHtml(product.family)}</span>
          <span>Lifecycle: ${escapeHtml(product.lifecycle)}</span>
          <span>Certs: ${escapeHtml(certs)}</span>
          <span>Trust: ${escapeHtml(confidence.short)}</span>
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
          <button class="detail-action" type="button" data-detail="${escapeHtml(product.id)}">Details / RFQ</button>
          <button class="${isShortlisted ? "remove-action" : ""}" type="button" data-add="${escapeHtml(product.id)}">${isShortlisted ? "Remove shortlist" : "Add to shortlist"}</button>
          <button class="secondary-action" type="button" data-compare="${escapeHtml(product.id)}">${isCompared ? "In compare" : "Compare"}</button>
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

function confidenceForProduct(product) {
  const hasStrongSource = product.sources.some((source) => ["OEM", "Distributor"].includes(source.type));
  const hasMultipleSources = product.sources.length >= 3;

  if (!product.verified) {
    return {
      level: "review",
      label: "Review required",
      short: "Needs source verification",
      reason: "Source signal, seller path, certification, or alternate validity needs additional buyer checks."
    };
  }

  if (product.verified && product.datasheet && hasStrongSource) {
    return {
      level: "high",
      label: "High confidence",
      short: "Verified source + datasheet",
      reason: "Verified source signal, datasheet availability, and OEM or distributor path are present."
    };
  }

  if (product.verified || (product.datasheet && hasMultipleSources)) {
    return {
      level: "standard",
      label: "Standard confidence",
      short: "Useful discovery record",
      reason: "Several procurement signals are present, but buyer confirmation is still required."
    };
  }

  return {
    level: "review",
    label: "Review required",
    short: "Needs buyer verification",
    reason: "Source path, datasheet, supplier status, or alternate validity needs additional checks."
  };
}

function confidenceForSource(source) {
  if (source.type === "OEM" || source.type === "Distributor") {
    return { level: "high", label: "Primary trust path" };
  }

  if (source.type === "Data" || source.type === "RFQ") {
    return { level: "standard", label: "Discovery path" };
  }

  return { level: "review", label: "Verify seller terms" };
}

function openProductDetail(id) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  closeShortlist();
  state.activeProductId = id;
  els.productDetailContent.innerHTML = productDetailTemplate(product);
  els.productDetail.classList.add("open");
  els.productDetail.setAttribute("aria-hidden", "false");
  els.scrim.classList.add("open");
}

function productDetailTemplate(product) {
  const score = product[state.priority];
  const note = state.notes[product.id] || "";
  const isShortlisted = state.shortlist.includes(product.id);
  const isCompared = state.compare.includes(product.id);
  const confidence = confidenceForProduct(product);
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check with supplier";
  const sourceActions = product.sources.map(detailSourceTemplate).join("");
  const specs = product.specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("");
  const applications = product.applications.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const alternates = product.alternatives.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `
    <article class="detail-product">
      <div class="detail-title">
        <span>${escapeHtml(product.category)}</span>
        <h3>${escapeHtml(product.brand)} ${escapeHtml(product.sku)}</h3>
        <p>${escapeHtml(product.name)}</p>
      </div>
      <div class="detail-confidence ${confidence.level}">
        <span>${escapeHtml(confidence.label)}</span>
        <strong>${escapeHtml(confidence.reason)}</strong>
      </div>
      <div class="verification-note">
        <strong>Verify before buying</strong>
        <span>Confirm exact part number, compatibility, datasheet revision, certificate availability, warranty path, stock, pricing, and seller terms with the supplier.</span>
      </div>
      <div class="detail-score">
        <div>
          <span>${escapeHtml(state.priority)} fit</span>
          <strong>${score}</strong>
        </div>
        <div class="bar" aria-hidden="true"><i style="width:${score}%"></i></div>
      </div>
      <p class="detail-description">${escapeHtml(product.description)}</p>
      <div class="detail-actions">
        <button class="${isShortlisted ? "remove-action" : ""}" type="button" data-detail-add="${escapeHtml(product.id)}">${isShortlisted ? "Remove shortlist" : "Add to shortlist"}</button>
        <button class="secondary-action" type="button" data-detail-compare="${escapeHtml(product.id)}">${isCompared ? "In compare" : "Compare"}</button>
      </div>
      <div class="detail-facts">
        <div><span>Family</span><strong>${escapeHtml(product.family)}</strong></div>
        <div><span>Lead time</span><strong>${escapeHtml(product.lead)}</strong></div>
        <div><span>MOQ</span><strong>${escapeHtml(product.moq)}</strong></div>
        <div><span>Lifecycle</span><strong>${escapeHtml(product.lifecycle)}</strong></div>
        <div><span>Datasheet</span><strong>${product.datasheet ? "Available" : "Check"}</strong></div>
        <div><span>Certifications</span><strong>${escapeHtml(certs)}</strong></div>
        <div><span>Confidence</span><strong>${escapeHtml(confidence.short)}</strong></div>
      </div>
      <div class="brief-builder">
        <div>
          <h4>Procurement brief</h4>
          <p>Copy a buyer-ready internal note with fit score, source paths, alternates, and verification checks.</p>
        </div>
        <button type="button" data-copy-brief="${escapeHtml(product.id)}">Copy procurement brief</button>
      </div>
      <div class="detail-section">
        <h4>Specifications</h4>
        <ul class="detail-pills">${specs}</ul>
      </div>
      <div class="detail-section">
        <h4>Applications</h4>
        <ul class="detail-pills">${applications}</ul>
      </div>
      <div class="detail-section">
        <h4>Alternates</h4>
        <ul class="detail-pills">${alternates}</ul>
      </div>
      <div class="detail-section">
        <h4>Source actions</h4>
        <div class="detail-sources">${sourceActions}</div>
      </div>
      <form class="rfq-builder" id="rfqBuilder">
        <div class="rfq-heading">
          <h4>RFQ request pack</h4>
          <p>Fill what you know, then copy a clean request for email or supplier portals. Ask the supplier to confirm all commercial and technical details.</p>
        </div>
        <div class="rfq-grid">
          <label>Quantity
            <input id="rfqQuantity" type="text" value="${escapeHtml(defaultQuantity(product.moq))}" autocomplete="off">
          </label>
          <label>Delivery country
            <input id="rfqCountry" type="text" placeholder="e.g. UAE, India, USA" autocomplete="off">
          </label>
          <label>Target date
            <input id="rfqDate" type="date">
          </label>
          <label>Urgency
            <select id="rfqUrgency">
              <option>Standard sourcing</option>
              <option>Urgent breakdown</option>
              <option>Project tender</option>
              <option>Budgetary quote</option>
            </select>
          </label>
        </div>
        <label class="rfq-check"><input id="rfqAlternates" type="checkbox" checked> Accept equivalent alternates if exact part is unavailable</label>
        <label class="note-field">Buyer notes
          <textarea id="buyerNotes" data-buyer-note="${escapeHtml(product.id)}" rows="5" placeholder="Add project, compatibility, certificate, or supplier instructions">${escapeHtml(note)}</textarea>
        </label>
        <div class="rfq-copy-actions">
          <button type="button" data-copy-rfq="${escapeHtml(product.id)}">Copy RFQ request</button>
          <button class="secondary-copy" type="button" data-copy-supplier="${escapeHtml(product.id)}">Copy supplier email</button>
          <button class="muted-copy" type="button" data-copy-brief="${escapeHtml(product.id)}">Copy procurement brief</button>
        </div>
      </form>
      <form class="data-update-builder">
        <div class="rfq-heading">
          <h4>Report or update product data</h4>
          <p>Use this when a product record has a missing source, outdated lead time, wrong alternate, or certification concern.</p>
        </div>
        <div class="rfq-grid">
          <label>Issue type
            <select id="dataIssueType">
              <option>Missing buying source</option>
              <option>Wrong or outdated specification</option>
              <option>Datasheet or certificate issue</option>
              <option>Alternate product concern</option>
              <option>Supplier verification concern</option>
            </select>
          </label>
          <label>Your contact
            <input id="dataReporterContact" type="text" placeholder="Optional email or company" autocomplete="off">
          </label>
        </div>
        <label class="note-field">Suggested correction or evidence
          <textarea id="dataCorrection" rows="4" placeholder="Paste corrected source link, datasheet note, supplier name, or issue details"></textarea>
        </label>
        <button type="button" data-copy-update="${escapeHtml(product.id)}">Copy data update request</button>
      </form>
    </article>
  `;
}

function detailSourceTemplate(source) {
  const confidence = confidenceForSource(source);
  return `
    <a class="${escapeHtml(confidence.level)}" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
      <span>${escapeHtml(source.type)}</span>
      <strong>${escapeHtml(source.name)}</strong>
      <small>${escapeHtml(source.action)} &middot; ${escapeHtml(source.region)} &middot; ${escapeHtml(confidence.label)}</small>
    </a>
  `;
}

function toggleCompare(id) {
  if (state.compare.includes(id)) {
    state.compare = state.compare.filter((item) => item !== id);
  } else {
    if (state.compare.length >= 4) {
      state.compare.shift();
    }
    state.compare.push(id);
  }

  renderCompare();
  render();
}

function renderCompare() {
  const selected = state.compare.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  setText(els.compareCount, selected.length);
  setText(
    els.compareSummary,
    selected.length
      ? `${selected.length} ${selected.length === 1 ? "product" : "products"} selected for comparison`
      : "No products selected for comparison"
  );

  if (!selected.length) {
    els.compareGrid.innerHTML = `
      <div class="empty-state compare-empty">
        Use the Compare button on product cards to build a side-by-side procurement view.
      </div>
    `;
    return;
  }

  els.compareGrid.innerHTML = selected.map(compareTemplate).join("");
}

function compareTemplate(product) {
  const score = product[state.priority];
  const sourceNames = product.sources.map((source) => `${source.type}: ${source.name}`).join(", ");
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check";

  return `
    <article class="compare-card">
      <div class="compare-card-head">
        <div>
          <span>${escapeHtml(product.category)}</span>
          <h3>${escapeHtml(product.brand)} ${escapeHtml(product.sku)}</h3>
        </div>
        <button type="button" data-remove-compare="${escapeHtml(product.id)}" aria-label="Remove ${escapeHtml(product.name)} from comparison">&times;</button>
      </div>
      <p>${escapeHtml(product.name)}</p>
      <div class="compare-score">
        <span>${escapeHtml(state.priority)} fit</span>
        <strong>${score}</strong>
        <div class="bar" aria-hidden="true"><i style="width:${score}%"></i></div>
      </div>
      <dl class="compare-list">
        <div><dt>Lead time</dt><dd>${escapeHtml(product.lead)}</dd></div>
        <div><dt>MOQ</dt><dd>${escapeHtml(product.moq)}</dd></div>
        <div><dt>Lifecycle</dt><dd>${escapeHtml(product.lifecycle)}</dd></div>
        <div><dt>Datasheet</dt><dd>${product.datasheet ? "Yes" : "Check"}</dd></div>
        <div><dt>Certs</dt><dd>${escapeHtml(certs)}</dd></div>
        <div><dt>Sources</dt><dd>${escapeHtml(sourceNames)}</dd></div>
        <div><dt>Alternates</dt><dd>${escapeHtml(product.alternatives.join(", "))}</dd></div>
      </dl>
      <a class="button-link ghost-button" href="${escapeHtml(product.sources[0].url)}" target="_blank" rel="noreferrer">Open primary source</a>
    </article>
  `;
}

function removeFromShortlist(id) {
  state.shortlist = state.shortlist.filter((item) => item !== id);
  renderShortlist();
  render();
}

function toggleShortlist(id) {
  if (state.shortlist.includes(id)) {
    state.shortlist = state.shortlist.filter((item) => item !== id);
  } else {
    state.shortlist.push(id);
  }
  renderShortlist();
  render();
}

function renderShortlist() {
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  updateShortlistControls(selected);

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

function updateShortlistControls(selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean)) {
  const count = selected.length;
  els.shortlistCount.textContent = count;
  els.exportShortlist.textContent = count ? `Export shortlist (${count})` : "Export shortlist";
  els.shortlistToggle.setAttribute("aria-label", count ? `Open shortlist with ${count} ${count === 1 ? "item" : "items"}` : "Open shortlist");
}

function defaultFilters() {
  return {
    query: "",
    category: "all",
    region: "all",
    sourceType: "all",
    confidence: "all",
    priority: "balanced",
    datasheetOnly: false,
    verifiedOnly: false
  };
}

function createSessionSnapshot() {
  return {
    app: "InduScout",
    version: "1.9",
    savedAt: new Date().toISOString(),
    filters: {
      query: state.query,
      category: state.category,
      region: state.region,
      sourceType: state.sourceType,
      confidence: state.confidence,
      priority: state.priority,
      datasheetOnly: state.datasheetOnly,
      verifiedOnly: state.verifiedOnly
    },
    shortlist: state.shortlist.filter((id) => products.some((product) => product.id === id)),
    compare: state.compare.filter((id) => products.some((product) => product.id === id)),
    notes: Object.fromEntries(
      Object.entries(state.notes).filter(([id, note]) => products.some((product) => product.id === id) && String(note).trim())
    )
  };
}

function applySession(session) {
  const filters = { ...defaultFilters(), ...(session.filters || {}) };
  const validProductIds = new Set(products.map((product) => product.id));

  state.query = String(filters.query || "");
  state.category = categories.includes(filters.category) ? filters.category : "all";
  state.region = filters.region || "all";
  state.sourceType = filters.sourceType || "all";
  state.confidence = filters.confidence || "all";
  state.priority = ["balanced", "fastest", "cost"].includes(filters.priority) ? filters.priority : "balanced";
  state.datasheetOnly = Boolean(filters.datasheetOnly);
  state.verifiedOnly = Boolean(filters.verifiedOnly);
  state.shortlist = [...new Set(session.shortlist || [])].filter((id) => validProductIds.has(id));
  state.compare = [...new Set(session.compare || [])].filter((id) => validProductIds.has(id)).slice(0, 4);
  state.notes = { ...state.notes, ...(session.notes || {}) };

  setQuery(state.query);
  els.category.value = state.category;
  els.region.value = state.region;
  els.sourceType.value = state.sourceType;
  els.confidence.value = state.confidence;
  els.datasheetOnly.checked = state.datasheetOnly;
  els.verifiedOnly.checked = state.verifiedOnly;
  els.priorityButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.priority === state.priority);
  });
  saveNotes();
  renderCompare();
  renderShortlist();
  closeOverlays();
}

function saveSession() {
  try {
    window.localStorage.setItem("induscoutSession", JSON.stringify(createSessionSnapshot()));
    setSessionStatus("Session saved locally");
  } catch {
    setSessionStatus("Session could not be saved");
  }
}

function loadSession() {
  try {
    const rawSession = window.localStorage.getItem("induscoutSession");
    if (!rawSession) {
      setSessionStatus("No saved session found");
      return;
    }
    applySession(JSON.parse(rawSession));
    render();
    setSessionStatus("Saved session loaded");
  } catch {
    setSessionStatus("Saved session could not be loaded");
  }
}

function exportSessionFile() {
  const snapshot = createSessionSnapshot();
  downloadFile(`InduScout-Session-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(snapshot, null, 2), "application/json;charset=utf-8");
  setSessionStatus("Session JSON exported");
}

function importSessionFile(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      applySession(JSON.parse(String(reader.result || "{}")));
      render();
      setSessionStatus("Session JSON imported");
    } catch {
      setSessionStatus("Session JSON could not be imported");
    }
  });
  reader.readAsText(file);
}

function setSessionStatus(message) {
  els.sessionStatus.textContent = message;
  setTimeout(() => {
    els.sessionStatus.textContent = "Save shortlist, filters, compare list, and notes locally.";
  }, 1800);
}

function openProductRequestPanel() {
  if (state.query && !els.requestPart.value.trim()) {
    els.requestPart.value = state.query;
  }
  if (state.category !== "all" && categories.includes(state.category)) {
    els.requestCategory.value = state.category;
  }
  els.productRequestPanel.open = true;
  els.productRequestPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => {
    els.requestPart.focus({ preventScroll: true });
  }, 250);
}

async function copyProductRequest() {
  const selectedCategory = requestFieldValue(els.requestCategory, "Not sure");
  const requestText = `InduScout product request
Prepared from InduScout finder on ${formatCopyDate()}

Requested item or part number: ${requestFieldValue(els.requestPart, state.query || "TBC")}
Brand or maker: ${requestFieldValue(els.requestBrand, "TBC")}
Likely category: ${selectedCategory}
Delivery country: ${requestFieldValue(els.requestCountry, "TBC")}
Urgency: ${requestFieldValue(els.requestUrgency, "Standard sourcing")}
Quantity: ${requestFieldValue(els.requestQuantity, "TBC")}

Current finder context:
- Search query: ${state.query || "None"}
- Category filter: ${state.category === "all" ? "All categories" : state.category}
- Region filter: ${state.region === "all" ? "Global" : state.region}
- Source type filter: ${state.sourceType === "all" ? "All source types" : state.sourceType}
- Confidence filter: ${state.confidence === "all" ? "All confidence levels" : state.confidence}

Application or notes:
${requestFieldValue(els.requestNotes, "No extra notes added")}

Please help identify the exact part number, manufacturer page, datasheet, authorized distributors or supplier paths, alternates for technical review, lead time, MOQ, certifications, and buying/source links.

InduScout is a discovery and RFQ preparation aid. Final purchasing validation remains with the buyer and supplier.`;

  try {
    await navigator.clipboard.writeText(requestText);
    els.copyProductRequest.textContent = "Product request copied";
    setTimeout(() => {
      els.copyProductRequest.textContent = "Copy product request";
    }, 1400);
  } catch {
    window.prompt("Copy product request", requestText);
  }
}

function requestFieldValue(element, fallback) {
  const value = String(element?.value || "").trim();
  return value || fallback;
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

function downloadRfqPack() {
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);

  if (!selected.length) {
    els.downloadRfqPack.textContent = "Add items first";
    setTimeout(() => {
      els.downloadRfqPack.textContent = "Download RFQ pack";
    }, 1200);
    return;
  }

  const totalSources = selected.reduce((count, product) => count + product.sources.length, 0);
  const isoDate = new Date().toISOString().slice(0, 10);
  const productWord = selected.length === 1 ? "Product" : "Products";
  const packFilenameBase = `InduScout-RFQ-Pack-${isoDate}-${selected.length}-${productWord}`;
  const packTitle = `InduScout RFQ Pack - ${isoDate} - ${selected.length} ${productWord}`;
  const productCards = selected
    .map((product, index) => {
      const confidence = confidenceForProduct(product);
      const sources = product.sources
        .map((source) => `<li><strong>${escapeHtml(source.type)}:</strong> <a href="${escapeHtml(source.url)}">${escapeHtml(source.name)}</a></li>`)
        .join("");
      const notes = state.notes[product.id] || "None added";
      return `
        <section class="product">
          <div class="product-head">
            <div>
              <p class="eyebrow">Item ${index + 1}</p>
              <h2>${escapeHtml(product.brand)} ${escapeHtml(product.sku)} - ${escapeHtml(product.name)}</h2>
              <p>${escapeHtml(product.description)}</p>
            </div>
            <div class="score">
              <span>${escapeHtml(priorityLabel())} fit</span>
              <strong>${escapeHtml(product[state.priority])}</strong>
            </div>
          </div>
          <dl>
            <div><dt>Category</dt><dd>${escapeHtml(product.category)}</dd></div>
            <div><dt>Family</dt><dd>${escapeHtml(product.family)}</dd></div>
            <div><dt>Lead time</dt><dd>${escapeHtml(product.lead)}</dd></div>
            <div><dt>MOQ</dt><dd>${escapeHtml(product.moq)}</dd></div>
            <div><dt>Lifecycle</dt><dd>${escapeHtml(product.lifecycle)}</dd></div>
            <div><dt>Datasheet</dt><dd>${product.datasheet ? "Available" : "Check with supplier"}</dd></div>
            <div><dt>Certifications</dt><dd>${escapeHtml(product.certifications.join(", ") || "Check with supplier")}</dd></div>
            <div><dt>Confidence</dt><dd>${escapeHtml(confidence.label)} - ${escapeHtml(confidence.reason)}</dd></div>
          </dl>
          <h3>Key specifications</h3>
          <ul>${product.specs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <h3>Applications</h3>
          <ul>${product.applications.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <h3>Alternates for review</h3>
          <ul>${product.alternatives.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <h3>Source paths</h3>
          <ul>${sources}</ul>
          <h3>Buyer notes</h3>
          <p class="notes">${escapeHtml(notes)}</p>
        </section>
      `;
    })
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(packTitle)}</title>
    <style>
      @page { size: A4; margin: 11mm; }
      :root { color: #0f172a; background: #f8fafc; font-family: Arial, sans-serif; }
      body { margin: 0; padding: 24px; font-size: 14px; line-height: 1.45; }
      main { max-width: 980px; margin: 0 auto; }
      header, section, .checklist { background: #ffffff; border: 1px solid #dbe4ef; border-radius: 8px; box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08); }
      header { padding: 22px; margin-bottom: 14px; }
      h1, h2, h3, p { margin-top: 0; }
      h1 { font-size: 30px; margin-bottom: 8px; }
      h2 { font-size: 20px; margin-bottom: 8px; }
      h3 { font-size: 12px; margin: 14px 0 6px; text-transform: uppercase; color: #007a78; }
      a { color: #007a78; }
      .print-toolbar { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 14px; max-width: 980px; margin: 0 auto 14px; padding: 12px; background: #ffffff; border: 1px solid #dbe4ef; border-radius: 8px; box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12); }
      .print-toolbar button { min-height: 42px; padding: 0 18px; color: #ffffff; background: #0f172a; border: 1px solid #0f172a; border-radius: 8px; font-weight: 700; }
      .print-toolbar span { color: #475569; font-size: 12px; }
      .meta { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 14px; }
      .meta div, dl div { padding: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
      .meta span, dt, .eyebrow { display: block; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; }
      .meta strong, dd { margin: 3px 0 0; font-weight: 700; }
      .product { padding: 18px; margin-bottom: 14px; }
      .product-head { display: grid; grid-template-columns: minmax(0, 1fr) 94px; gap: 14px; align-items: start; }
      .score { text-align: right; padding: 10px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; }
      .score strong { display: block; font-size: 30px; }
      dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 12px 0 0; }
      ul { margin: 0; padding-left: 22px; }
      li { margin: 3px 0; }
      .notes { padding: 8px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; }
      .checklist { padding: 18px; }
      .disclaimer { margin-top: 14px; color: #475569; font-size: 12px; }
      @media print {
        body { background: #ffffff; padding: 0; font-size: 11px; line-height: 1.28; }
        main { max-width: none; }
        .print-toolbar { display: none; }
        header, section, .checklist { box-shadow: none; border-radius: 0; }
        header { padding: 0 0 8px; margin: 0 0 8px; border: 0; border-bottom: 2px solid #007a78; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        h2 { font-size: 15px; margin-bottom: 4px; }
        h3 { font-size: 10px; margin: 8px 0 3px; }
        .meta { margin-top: 8px; gap: 4px; }
        .meta div, dl div { padding: 5px; }
        .product { padding: 8px 0; margin: 0; border: 0; border-top: 1px solid #dbe4ef; break-inside: auto; page-break-inside: auto; }
        .product-head { grid-template-columns: minmax(0, 1fr) 64px; gap: 8px; }
        .score { padding: 5px; }
        .score strong { font-size: 22px; }
        dl { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; margin-top: 6px; }
        ul { padding-left: 16px; }
        li { margin: 1px 0; }
        .notes { padding: 5px; }
        .checklist { padding: 8px 0 0; border: 0; border-top: 2px solid #007a78; }
        .disclaimer { margin-top: 8px; font-size: 10px; }
        a { color: inherit; text-decoration: none; }
      }
    </style>
  </head>
  <body>
    <div class="print-toolbar">
      <button type="button" onclick="window.print()">Save as PDF</button>
      <span>Suggested PDF name: ${escapeHtml(packFilenameBase)}.pdf</span>
    </div>
    <main>
      <header>
        <p class="eyebrow">InduScout sourcing document</p>
        <h1>RFQ Shortlist Pack</h1>
        <p>Prepared for buyer review, supplier outreach, and RFQ preparation. Confirm all purchase decisions with the OEM, authorized distributor, or supplier.</p>
        <div class="meta">
          <div><span>Prepared</span><strong>${escapeHtml(formatCopyDate())}</strong></div>
          <div><span>Products</span><strong>${selected.length}</strong></div>
          <div><span>Source links</span><strong>${totalSources}</strong></div>
          <div><span>Fit priority</span><strong>${escapeHtml(priorityLabel())}</strong></div>
        </div>
      </header>
      ${productCards}
      <div class="checklist">
        <h2>Buyer verification checklist</h2>
        <ul>
          <li>Confirm exact part number, suffix, voltage, size, material, and configuration.</li>
          <li>Confirm compatibility with installed equipment or project specification.</li>
          <li>Request latest datasheet, certificate, warranty path, and country of origin.</li>
          <li>Confirm stock, unit price, offer validity, lead time, MOQ, payment terms, delivery terms, and seller legitimacy.</li>
          <li>Treat alternates as technical review items, not automatic substitutes.</li>
        </ul>
        <p class="disclaimer">InduScout is a discovery and RFQ preparation aid. Final purchasing validation remains with the buyer and supplier.</p>
      </div>
    </main>
  </body>
</html>`;

  downloadFile(`${packFilenameBase}.html`, html, "text/html;charset=utf-8");
  els.downloadRfqPack.textContent = "RFQ pack downloaded";
  setTimeout(() => {
    els.downloadRfqPack.textContent = "Download RFQ pack";
  }, 1200);
}

function downloadShortlistCsv() {
  const table = shortlistExportTable();
  if (!table.rows.length) {
    els.downloadShortlist.textContent = "Add items first";
    setTimeout(() => {
      els.downloadShortlist.textContent = "Download CSV";
    }, 1200);
    return;
  }

  const csv = [table.headers, ...table.rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  downloadFile(`induscout-shortlist-${new Date().toISOString().slice(0, 10)}.csv`, `\ufeff${csv}`, "text/csv;charset=utf-8");

  els.downloadShortlist.textContent = "CSV downloaded";
  setTimeout(() => {
    els.downloadShortlist.textContent = "Download CSV";
  }, 1200);
}

function downloadShortlistXlsx() {
  const table = shortlistExportTable();
  if (!table.rows.length) {
    els.downloadShortlistXlsx.textContent = "Add items first";
    setTimeout(() => {
      els.downloadShortlistXlsx.textContent = "Download XLSX";
    }, 1200);
    return;
  }

  const workbook = createXlsxWorkbook(table.headers, table.rows);
  downloadFile(
    `InduScout-Shortlist-${new Date().toISOString().slice(0, 10)}.xlsx`,
    workbook,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  els.downloadShortlistXlsx.textContent = "XLSX downloaded";
  setTimeout(() => {
    els.downloadShortlistXlsx.textContent = "Download XLSX";
  }, 1200);
}

function shortlistExportTable() {
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const headers = [
    "Brand",
    "SKU",
    "Product Name",
    "Category",
    "Family",
    "Lifecycle",
    "Fit Priority",
    "Fit Score",
    "Lead Time",
    "MOQ",
    "Datasheet",
    "Certifications",
    "Specifications",
    "Applications",
    "Alternates",
    "Source Names",
    "Source URLs",
    "Primary Source",
    "Buyer Notes"
  ];
  const rows = selected.map((product) => {
    const sourceNames = product.sources.map((source) => `${source.type}: ${source.name}`).join(" | ");
    const sourceUrls = product.sources.map((source) => source.url).join(" | ");
    return [
      product.brand,
      product.sku,
      product.name,
      product.category,
      product.family,
      product.lifecycle,
      priorityLabel(),
      product[state.priority],
      product.lead,
      product.moq,
      product.datasheet ? "Yes" : "Check",
      product.certifications.join(" | ") || "Check with supplier",
      product.specs.join(" | "),
      product.applications.join(" | "),
      product.alternatives.join(" | "),
      sourceNames,
      sourceUrls,
      product.sources[0]?.url || "",
      state.notes[product.id] || ""
    ];
  });
  return { headers, rows };
}

async function copyCompare() {
  const selected = state.compare.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const text = selected.length
    ? selected
        .map((product, index) => {
          const sources = product.sources.map((source) => `${source.type} - ${source.name}: ${source.url}`).join("; ");
          const certs = product.certifications.length ? product.certifications.join(", ") : "Check";
          return `${index + 1}. ${product.brand} ${product.sku} - ${product.name}
Category: ${product.category}
${state.priority} fit: ${product[state.priority]}
Lead time: ${product.lead}
MOQ: ${product.moq}
Lifecycle: ${product.lifecycle}
Datasheet: ${product.datasheet ? "Yes" : "Check"}
Certifications: ${certs}
Alternatives: ${product.alternatives.join(", ")}
Sources: ${sources}`;
        })
        .join("\n\n")
    : "No InduScout products selected for comparison.";

  try {
    await navigator.clipboard.writeText(text);
    els.copyCompare.textContent = "Copied";
    setTimeout(() => {
      els.copyCompare.textContent = "Copy comparison";
    }, 1200);
  } catch {
    window.prompt("Copy comparison", text);
  }
}

async function copyProductRfq(id) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const quantity = getFieldValue("#rfqQuantity", defaultQuantity(product.moq));
  const country = getFieldValue("#rfqCountry", "TBC");
  const targetDate = getFieldValue("#rfqDate", "TBC");
  const urgency = getFieldValue("#rfqUrgency", "Standard sourcing");
  const acceptAlternates = document.querySelector("#rfqAlternates")?.checked ? "Yes" : "No";
  const buyerNotes = getFieldValue("#buyerNotes", "None added");
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check with supplier";
  const sources = product.sources.map((source) => `${source.type} - ${source.name}: ${source.url}`).join("; ");
  const text = `RFQ request prepared with InduScout

Product: ${product.brand} ${product.sku} - ${product.name}
Category: ${product.category}
Family: ${product.family}
Required quantity: ${quantity}
Delivery country: ${country}
Target date: ${targetDate}
Urgency: ${urgency}
Accept alternates: ${acceptAlternates}

Key specifications: ${product.specs.join(", ")}
Applications: ${product.applications.join(", ")}
Certifications requested: ${certs}
Known alternates: ${product.alternatives.join(", ")}
Preferred source links: ${sources}

Buyer notes:
${buyerNotes}

Please confirm exact part number, compatibility, datasheet revision, price, lead time, stock availability, warranty path, certificate availability, country of origin, and payment/delivery terms before order placement.`;

  try {
    await navigator.clipboard.writeText(text);
    const button = els.productDetailContent.querySelector("[data-copy-rfq]");
    if (button) {
      button.textContent = "RFQ copied";
      setTimeout(() => {
        button.textContent = "Copy RFQ request";
      }, 1200);
    }
  } catch {
    window.prompt("Copy RFQ request", text);
  }
}

async function copySupplierOutreach(id, triggerButton) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const quantity = getFieldValue("#rfqQuantity", defaultQuantity(product.moq));
  const country = getFieldValue("#rfqCountry", "TBC");
  const targetDate = getFieldValue("#rfqDate", "TBC");
  const urgency = getFieldValue("#rfqUrgency", "Standard sourcing");
  const acceptAlternates = document.querySelector("#rfqAlternates")?.checked ? "Yes" : "No";
  const buyerNotes = getFieldValue("#buyerNotes", "None added");
  const certs = product.certifications.length ? product.certifications.join(", ") : "Please confirm available certificates";
  const alternatives = product.alternatives.length ? product.alternatives.map((item) => `- ${item}`).join("\n") : "- None listed";
  const text = `Subject: RFQ - ${product.brand} ${product.sku} - ${product.name}

Hello,

Please provide your quotation and availability for the item below.

Product: ${product.brand} ${product.sku} - ${product.name}
Category: ${product.category}
Family: ${product.family}
Description: ${product.description}
Required quantity: ${quantity}
Delivery country: ${country}
Target date: ${targetDate}
Urgency: ${urgency}
Accept equivalent alternates if exact part is unavailable: ${acceptAlternates}

Key specifications:
${product.specs.map((item) => `- ${item}`).join("\n")}

Certifications requested:
${certs}

Please confirm:
- Exact part number, suffix, voltage, size, material, and configuration.
- Current stock, unit price, currency, offer validity, MOQ, and pack quantity.
- Lead time, delivery terms, payment terms, and shipping weight or dimensions if available.
- Latest datasheet revision, certificate availability, warranty path, and country of origin.
- Whether supply is through an OEM, authorized distributor, or other verified channel.

Known alternates for technical review only:
${alternatives}

Buyer notes:
${buyerNotes}

Thank you.`;

  try {
    await navigator.clipboard.writeText(text);
    const button = triggerButton || els.productDetailContent.querySelector("[data-copy-supplier]");
    if (button) {
      button.textContent = "Supplier email copied";
      setTimeout(() => {
        button.textContent = "Copy supplier email";
      }, 1200);
    }
  } catch {
    window.prompt("Copy supplier email", text);
  }
}

async function copyProcurementBrief(id, triggerButton) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const confidence = confidenceForProduct(product);
  const certs = product.certifications.length ? product.certifications.join(", ") : "Check with supplier";
  const sources = product.sources
    .map((source) => {
      const sourceConfidence = confidenceForSource(source);
      return `- ${source.type} - ${source.name} (${sourceConfidence.label}): ${source.url}`;
    })
    .join("\n");
  const note = state.notes[product.id] || "None added";
  const text = `InduScout procurement brief
Prepared from InduScout beta catalog on ${formatCopyDate()}

Product: ${product.brand} ${product.sku} - ${product.name}
Category: ${product.category}
Family: ${product.family}
Lifecycle: ${product.lifecycle}
${priorityLabel()} fit score: ${product[state.priority]}
Lead time signal: ${product.lead}
MOQ signal: ${product.moq}
Datasheet signal: ${product.datasheet ? "Available" : "Check with supplier"}
Certifications to request: ${certs}

Confidence:
${confidence.label} - ${confidence.reason}

Why this record may fit:
${product.description}

Key specifications:
${product.specs.map((item) => `- ${item}`).join("\n")}

Common applications:
${product.applications.map((item) => `- ${item}`).join("\n")}

Known alternates to review:
${product.alternatives.map((item) => `- ${item}`).join("\n")}

Source paths:
${sources}

Buyer notes:
${note}

Verification checklist before order:
- Confirm exact part number, suffix, voltage, size, material, and configuration.
- Confirm compatibility with installed equipment or project specification.
- Request latest datasheet, certificate, warranty path, and country of origin.
- Confirm stock, price, lead time, payment terms, delivery terms, and seller legitimacy.
- Treat alternates as technical review items, not automatic substitutes.

InduScout is a discovery and RFQ preparation aid. Final purchasing validation remains with the buyer and supplier.`;

  try {
    await navigator.clipboard.writeText(text);
    const button = triggerButton || els.productDetailContent.querySelector("[data-copy-brief]");
    if (button) {
      button.textContent = "Brief copied";
      setTimeout(() => {
        button.textContent = "Copy procurement brief";
      }, 1200);
    }
  } catch {
    window.prompt("Copy procurement brief", text);
  }
}

async function copyDataUpdate(id) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const confidence = confidenceForProduct(product);
  const issueType = getFieldValue("#dataIssueType", "Product data update");
  const reporter = getFieldValue("#dataReporterContact", "Not provided");
  const correction = getFieldValue("#dataCorrection", "No correction details added");
  const sources = product.sources.map((source) => `${source.type} - ${source.name}: ${source.url}`).join("; ");
  const text = `InduScout product data update request

Product: ${product.brand} ${product.sku} - ${product.name}
Category: ${product.category}
Current confidence: ${confidence.label}
Issue type: ${issueType}
Reporter/contact: ${reporter}

Suggested correction or evidence:
${correction}

Current specs: ${product.specs.join(", ")}
Current alternates: ${product.alternatives.join(", ")}
Current source links: ${sources}

Please review this record and update source confidence, specifications, alternates, datasheet status, or supplier links if the evidence is valid.`;

  try {
    await navigator.clipboard.writeText(text);
    const button = els.productDetailContent.querySelector("[data-copy-update]");
    if (button) {
      button.textContent = "Update request copied";
      setTimeout(() => {
        button.textContent = "Copy data update request";
      }, 1200);
    }
  } catch {
    window.prompt("Copy data update request", text);
  }
}

function openShortlist() {
  closeProductDetail();
  renderShortlist();
  els.shortlistDrawer.classList.add("open");
  els.shortlistDrawer.setAttribute("aria-hidden", "false");
  els.scrim.classList.add("open");
}

function closeShortlist() {
  els.shortlistDrawer.classList.remove("open");
  els.shortlistDrawer.setAttribute("aria-hidden", "true");
  if (!els.productDetail.classList.contains("open")) {
    els.scrim.classList.remove("open");
  }
}

function closeProductDetail() {
  state.activeProductId = null;
  els.productDetail.classList.remove("open");
  els.productDetail.setAttribute("aria-hidden", "true");
  if (!els.shortlistDrawer.classList.contains("open")) {
    els.scrim.classList.remove("open");
  }
}

function closeOverlays() {
  closeShortlist();
  closeProductDetail();
}

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function getFieldValue(selector, fallback) {
  const value = document.querySelector(selector)?.value.trim();
  return value || fallback;
}

function defaultQuantity(moq) {
  const numeric = String(moq).match(/\d+/);
  return numeric ? numeric[0] : "";
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function createXlsxWorkbook(headers, rows) {
  const allRows = [headers, ...rows];
  const files = [
    {
      path: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`
    },
    {
      path: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`
    },
    {
      path: "docProps/app.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>InduScout</Application>
</Properties>`
    },
    {
      path: "docProps/core.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>InduScout Shortlist</dc:title>
  <dc:creator>InduScout</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
</cp:coreProperties>`
    },
    {
      path: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Shortlist" sheetId="1" r:id="rId1"/></sheets>
</workbook>`
    },
    {
      path: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
    },
    {
      path: "xl/styles.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9EDEB"/><bgColor indexed="64"/></patternFill></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`
    },
    {
      path: "xl/worksheets/sheet1.xml",
      content: buildWorksheetXml(allRows)
    }
  ];

  return createZip(files);
}

function buildWorksheetXml(rows) {
  const columnWidths = [18, 16, 34, 26, 28, 14, 16, 10, 15, 10, 12, 24, 36, 36, 40, 40, 58, 36, 42];
  const cols = columnWidths
    .map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`)
    .join("");
  const sheetRows = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, columnIndex) => {
          const ref = `${columnName(columnIndex + 1)}${rowIndex + 1}`;
          const style = rowIndex === 0 ? 1 : 2;
          return `<c r="${ref}" t="inlineStr" s="${style}"><is><t>${xmlEscape(value)}</t></is></c>`;
        })
        .join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");
  const lastCell = `${columnName(rows[0].length)}${rows.length}`;

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="A1:${lastCell}"/>
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <cols>${cols}</cols>
  <sheetData>${sheetRows}</sheetData>
  <autoFilter ref="A1:${lastCell}"/>
</worksheet>`;
}

function createZip(files) {
  const records = [];
  const centralRecords = [];
  let offset = 0;
  const now = new Date();
  const modTime = ((now.getHours() & 31) << 11) | ((now.getMinutes() & 63) << 5) | ((now.getSeconds() / 2) & 31);
  const modDate = (((now.getFullYear() - 1980) & 127) << 9) | (((now.getMonth() + 1) & 15) << 5) | (now.getDate() & 31);

  files.forEach((file) => {
    const nameBytes = utf8Bytes(file.path);
    const dataBytes = utf8Bytes(file.content);
    const crc = crc32(dataBytes);
    const localHeader = zipLocalHeader(nameBytes, dataBytes.length, crc, modTime, modDate);
    records.push(localHeader, nameBytes, dataBytes);
    centralRecords.push(zipCentralHeader(nameBytes, dataBytes.length, crc, modTime, modDate, offset), nameBytes);
    offset += localHeader.length + nameBytes.length + dataBytes.length;
  });

  const centralSize = centralRecords.reduce((size, item) => size + item.length, 0);
  const endRecord = zipEndRecord(files.length, centralSize, offset);
  return concatBytes([...records, ...centralRecords, endRecord]);
}

function zipLocalHeader(nameBytes, size, crc, modTime, modDate) {
  const bytes = new Uint8Array(30);
  writeUint32(bytes, 0, 0x04034b50);
  writeUint16(bytes, 4, 20);
  writeUint16(bytes, 6, 0x0800);
  writeUint16(bytes, 8, 0);
  writeUint16(bytes, 10, modTime);
  writeUint16(bytes, 12, modDate);
  writeUint32(bytes, 14, crc);
  writeUint32(bytes, 18, size);
  writeUint32(bytes, 22, size);
  writeUint16(bytes, 26, nameBytes.length);
  return bytes;
}

function zipCentralHeader(nameBytes, size, crc, modTime, modDate, offset) {
  const bytes = new Uint8Array(46);
  writeUint32(bytes, 0, 0x02014b50);
  writeUint16(bytes, 4, 20);
  writeUint16(bytes, 6, 20);
  writeUint16(bytes, 8, 0x0800);
  writeUint16(bytes, 10, 0);
  writeUint16(bytes, 12, modTime);
  writeUint16(bytes, 14, modDate);
  writeUint32(bytes, 16, crc);
  writeUint32(bytes, 20, size);
  writeUint32(bytes, 24, size);
  writeUint16(bytes, 28, nameBytes.length);
  writeUint32(bytes, 42, offset);
  return bytes;
}

function zipEndRecord(count, centralSize, centralOffset) {
  const bytes = new Uint8Array(22);
  writeUint32(bytes, 0, 0x06054b50);
  writeUint16(bytes, 8, count);
  writeUint16(bytes, 10, count);
  writeUint32(bytes, 12, centralSize);
  writeUint32(bytes, 16, centralOffset);
  return bytes;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  bytes.forEach((byte) => {
    crc = (crc >>> 8) ^ crc32Table()[(crc ^ byte) & 0xff];
  });
  return (crc ^ 0xffffffff) >>> 0;
}

function crc32Table() {
  if (!crc32Table.cache) {
    crc32Table.cache = Array.from({ length: 256 }, (_, index) => {
      let c = index;
      for (let bit = 0; bit < 8; bit += 1) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      return c >>> 0;
    });
  }
  return crc32Table.cache;
}

function concatBytes(chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
}

function utf8Bytes(value) {
  return new TextEncoder().encode(value);
}

function writeUint16(bytes, offset, value) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
}

function writeUint32(bytes, offset, value) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
  bytes[offset + 2] = (value >>> 16) & 0xff;
  bytes[offset + 3] = (value >>> 24) & 0xff;
}

function columnName(index) {
  let name = "";
  let current = index;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    current = Math.floor((current - 1) / 26);
  }
  return name;
}

function xmlEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    };
    return map[character];
  });
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function priorityLabel() {
  return `${state.priority.charAt(0).toUpperCase()}${state.priority.slice(1)}`;
}

function formatCopyDate() {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());
}

function loadNotes() {
  try {
    return JSON.parse(window.localStorage.getItem("induscoutBuyerNotes") || "{}");
  } catch {
    return {};
  }
}

function saveNotes() {
  try {
    window.localStorage.setItem("induscoutBuyerNotes", JSON.stringify(state.notes));
  } catch {
    // Notes are a convenience only; the RFQ still works if storage is blocked.
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
