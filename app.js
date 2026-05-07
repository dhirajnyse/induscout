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
    Object.assign(state, {
      query: "",
      category: "all",
      region: "all",
      sourceType: "all",
      confidence: "all",
      priority: "balanced",
      datasheetOnly: false,
      verifiedOnly: false
    });
    setQuery("");
    els.category.value = "all";
    els.region.value = "all";
    els.sourceType.value = "all";
    els.confidence.value = "all";
    els.datasheetOnly.checked = false;
    els.verifiedOnly.checked = false;
    els.priorityButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.priority === "balanced");
    });
    render();
  });

  els.results.addEventListener("click", (event) => {
    const shortlistButton = event.target.closest("[data-add]");
    const compareButton = event.target.closest("[data-compare]");
    const detailButton = event.target.closest("[data-detail]");

    if (shortlistButton) {
      addToShortlist(shortlistButton.dataset.add);
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
      addToShortlist(shortlistButton.dataset.detailAdd);
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
  els.downloadShortlist.addEventListener("click", downloadShortlistCsv);
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
          <button type="button" data-add="${escapeHtml(product.id)}">${isShortlisted ? "Shortlisted" : "Add to shortlist"}</button>
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
        <button type="button" data-detail-add="${escapeHtml(product.id)}">${isShortlisted ? "Shortlisted" : "Add to shortlist"}</button>
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
    <title>InduScout RFQ Pack</title>
    <style>
      :root { color: #0f172a; background: #f8fafc; font-family: Arial, sans-serif; }
      body { margin: 0; padding: 32px; }
      main { max-width: 980px; margin: 0 auto; }
      header, section, .checklist { background: #ffffff; border: 1px solid #dbe4ef; border-radius: 8px; box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08); }
      header { padding: 28px; margin-bottom: 18px; }
      h1, h2, h3, p { margin-top: 0; }
      h1 { font-size: 34px; margin-bottom: 8px; }
      h2 { font-size: 22px; margin-bottom: 8px; }
      h3 { font-size: 14px; margin: 20px 0 8px; text-transform: uppercase; color: #007a78; }
      a { color: #007a78; }
      .meta { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 20px; }
      .meta div, dl div { padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
      .meta span, dt, .eyebrow { display: block; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; }
      .meta strong, dd { margin: 3px 0 0; font-weight: 700; }
      .product { padding: 24px; margin-bottom: 18px; }
      .product-head { display: grid; grid-template-columns: minmax(0, 1fr) 110px; gap: 20px; align-items: start; }
      .score { text-align: right; padding: 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; }
      .score strong { display: block; font-size: 34px; }
      dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 18px 0 0; }
      ul { margin: 0; padding-left: 22px; }
      li { margin: 5px 0; }
      .notes { padding: 12px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; }
      .checklist { padding: 24px; }
      .disclaimer { margin-top: 20px; color: #475569; font-size: 13px; }
      @media print {
        body { background: #ffffff; padding: 0; }
        header, section, .checklist { box-shadow: none; break-inside: avoid; }
        a { color: inherit; text-decoration: none; }
      }
    </style>
  </head>
  <body>
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

  downloadFile(`induscout-rfq-pack-${new Date().toISOString().slice(0, 10)}.html`, html, "text/html;charset=utf-8");
  els.downloadRfqPack.textContent = "RFQ pack downloaded";
  setTimeout(() => {
    els.downloadRfqPack.textContent = "Download RFQ pack";
  }, 1200);
}

function downloadShortlistCsv() {
  const selected = state.shortlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);

  if (!selected.length) {
    els.downloadShortlist.textContent = "Add items first";
    setTimeout(() => {
      els.downloadShortlist.textContent = "Download CSV";
    }, 1200);
    return;
  }

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
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  downloadFile(`induscout-shortlist-${new Date().toISOString().slice(0, 10)}.csv`, `\ufeff${csv}`, "text/csv;charset=utf-8");

  els.downloadShortlist.textContent = "CSV downloaded";
  setTimeout(() => {
    els.downloadShortlist.textContent = "Download CSV";
  }, 1200);
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
