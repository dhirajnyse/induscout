const products = [
  {
    id: "ifm-ie5338",
    name: "IE5338 Inductive Proximity Sensor",
    brand: "IFM",
    sku: "IE5338",
    category: "Sensors",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "M12 inductive sensor for machine automation, position detection, and compact control cabinets.",
    specs: ["M12", "PNP", "NO", "10-30 VDC", "IP67"],
    datasheet: true,
    verified: true,
    speed: 86,
    cost: 69,
    balanced: 91,
    lead: "2-7 days",
    moq: "1 pc",
    alternatives: ["SICK IME12", "Pepperl+Fuchs NBB series"],
    sources: [
      { name: "OEM", url: "https://www.ifm.com/" },
      { name: "RS", url: "https://www.rs-online.com/" },
      { name: "EU Automation", url: "https://www.euautomation.com/" }
    ]
  },
  {
    id: "sick-ime12",
    name: "IME12 Inductive Proximity Sensor",
    brand: "SICK",
    sku: "IME12",
    category: "Sensors",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Industrial inductive sensor family for harsh environments and high switching accuracy.",
    specs: ["M12", "PNP/NPN", "Flush", "DC 3-wire", "IP67"],
    datasheet: true,
    verified: true,
    speed: 82,
    cost: 66,
    balanced: 87,
    lead: "3-10 days",
    moq: "1 pc",
    alternatives: ["IFM IE5338", "Omron E2E"],
    sources: [
      { name: "OEM", url: "https://www.sick.com/" },
      { name: "DigiKey", url: "https://www.digikey.com/" },
      { name: "Mouser", url: "https://www.mouser.com/" }
    ]
  },
  {
    id: "siemens-6es7214",
    name: "S7-1200 CPU 1214C Controller",
    brand: "Siemens",
    sku: "6ES7214",
    category: "Automation",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Compact PLC controller for small automation systems, machine builders, and panel upgrades.",
    specs: ["24 VDC", "Digital I/O", "PROFINET", "Compact PLC"],
    datasheet: true,
    verified: true,
    speed: 72,
    cost: 58,
    balanced: 82,
    lead: "1-4 weeks",
    moq: "1 pc",
    alternatives: ["Schneider Modicon M221", "Allen-Bradley Micro850"],
    sources: [
      { name: "OEM", url: "https://www.siemens.com/" },
      { name: "Radwell", url: "https://www.radwell.com/" },
      { name: "RS", url: "https://www.rs-online.com/" }
    ]
  },
  {
    id: "abb-acs580",
    name: "ACS580 General Purpose Drive",
    brand: "ABB",
    sku: "ACS580",
    category: "Drives",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Variable frequency drive for pumps, fans, conveyors, mixers, and general industrial motors.",
    specs: ["VFD", "3-phase", "IP21/IP55", "Modbus", "Energy optimizer"],
    datasheet: true,
    verified: true,
    speed: 68,
    cost: 64,
    balanced: 80,
    lead: "1-3 weeks",
    moq: "1 pc",
    alternatives: ["Siemens G120", "Danfoss VLT", "Schneider Altivar"],
    sources: [
      { name: "OEM", url: "https://global.abb/" },
      { name: "Galco", url: "https://www.galco.com/" },
      { name: "Automation24", url: "https://www.automation24.com/" }
    ]
  },
  {
    id: "schneider-atv320",
    name: "Altivar Machine ATV320 Drive",
    brand: "Schneider Electric",
    sku: "ATV320",
    category: "Drives",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Machine drive for asynchronous and synchronous motors in compact automation panels.",
    specs: ["VFD", "0.18-15 kW", "Modbus", "CANopen", "Safety STO"],
    datasheet: true,
    verified: true,
    speed: 74,
    cost: 61,
    balanced: 81,
    lead: "1-3 weeks",
    moq: "1 pc",
    alternatives: ["ABB ACS580", "Danfoss FC 51"],
    sources: [
      { name: "OEM", url: "https://www.se.com/" },
      { name: "Newark", url: "https://www.newark.com/" },
      { name: "RS", url: "https://www.rs-online.com/" }
    ]
  },
  {
    id: "skf-6205-2rs1",
    name: "6205-2RS1 Deep Groove Ball Bearing",
    brand: "SKF",
    sku: "6205-2RS1",
    category: "Bearings",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Sealed deep groove bearing for motors, pumps, gearboxes, and general rotating equipment.",
    specs: ["25 mm bore", "52 mm OD", "15 mm width", "Sealed", "Steel"],
    datasheet: true,
    verified: true,
    speed: 92,
    cost: 78,
    balanced: 93,
    lead: "1-5 days",
    moq: "1 pc",
    alternatives: ["NSK 6205DDU", "FAG 6205-2RSR", "Timken 205PP"],
    sources: [
      { name: "OEM", url: "https://www.skf.com/" },
      { name: "Motion", url: "https://www.motion.com/" },
      { name: "Grainger", url: "https://www.grainger.com/" }
    ]
  },
  {
    id: "festo-dsbc",
    name: "DSBC Pneumatic Cylinder",
    brand: "Festo",
    sku: "DSBC",
    category: "Pneumatics",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "ISO pneumatic actuator family for factory automation, packaging, and material handling.",
    specs: ["ISO 15552", "Double-acting", "Magnetic piston", "Adjustable cushioning"],
    datasheet: true,
    verified: true,
    speed: 77,
    cost: 63,
    balanced: 84,
    lead: "1-2 weeks",
    moq: "1 pc",
    alternatives: ["SMC CP96", "Norgren PRA"],
    sources: [
      { name: "OEM", url: "https://www.festo.com/" },
      { name: "TME", url: "https://www.tme.com/" },
      { name: "Automation24", url: "https://www.automation24.com/" }
    ]
  },
  {
    id: "smc-sy5000",
    name: "SY5000 Solenoid Valve",
    brand: "SMC",
    sku: "SY5000",
    category: "Pneumatics",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Compact directional control solenoid valve for pneumatic manifolds and automation systems.",
    specs: ["5-port", "24 VDC", "Manifold mount", "Low power"],
    datasheet: true,
    verified: true,
    speed: 80,
    cost: 67,
    balanced: 85,
    lead: "3-14 days",
    moq: "1 pc",
    alternatives: ["Festo VUVG", "Norgren V60"],
    sources: [
      { name: "OEM", url: "https://www.smcworld.com/" },
      { name: "RS", url: "https://www.rs-online.com/" },
      { name: "Grainger", url: "https://www.grainger.com/" }
    ]
  },
  {
    id: "grundfos-cr",
    name: "CR Vertical Multistage Pump",
    brand: "Grundfos",
    sku: "CR",
    category: "Pumps",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Vertical multistage centrifugal pump platform for water treatment, pressure boosting, and process duty.",
    specs: ["Vertical multistage", "Stainless options", "IE motor", "Mechanical seal"],
    datasheet: true,
    verified: true,
    speed: 60,
    cost: 56,
    balanced: 75,
    lead: "2-6 weeks",
    moq: "1 unit",
    alternatives: ["Lowara e-SV", "KSB Movitec"],
    sources: [
      { name: "OEM", url: "https://www.grundfos.com/" },
      { name: "PumpCatalog", url: "https://www.pumpcatalog.com/" },
      { name: "Thomasnet", url: "https://www.thomasnet.com/" }
    ]
  },
  {
    id: "ksb-eta",
    name: "Etanorm Standardized Pump",
    brand: "KSB",
    sku: "Etanorm",
    category: "Pumps",
    regions: ["Europe", "Middle East", "Asia"],
    description: "Standardized water pump family for utilities, HVAC, general industry, and process applications.",
    specs: ["Centrifugal", "EN 733", "Horizontal", "Long-coupled"],
    datasheet: true,
    verified: true,
    speed: 54,
    cost: 58,
    balanced: 72,
    lead: "3-8 weeks",
    moq: "1 unit",
    alternatives: ["Grundfos NB", "Wilo CronoNorm"],
    sources: [
      { name: "OEM", url: "https://www.ksb.com/" },
      { name: "IndustryStock", url: "https://www.industrystock.com/" },
      { name: "Alibaba", url: "https://www.alibaba.com/" }
    ]
  },
  {
    id: "asco-8210",
    name: "8210 Solenoid Valve",
    brand: "ASCO",
    sku: "8210",
    category: "Valves",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "General service solenoid valve for air, inert gas, water, and light oil applications.",
    specs: ["2-way", "Brass", "NBR options", "AC/DC coils"],
    datasheet: true,
    verified: true,
    speed: 78,
    cost: 65,
    balanced: 84,
    lead: "3-14 days",
    moq: "1 pc",
    alternatives: ["Burkert 6213", "Parker Gold Ring"],
    sources: [
      { name: "OEM", url: "https://www.emerson.com/" },
      { name: "Grainger", url: "https://www.grainger.com/" },
      { name: "MSC", url: "https://www.mscdirect.com/" }
    ]
  },
  {
    id: "burkert-6213",
    name: "6213 EV Solenoid Valve",
    brand: "Burkert",
    sku: "6213 EV",
    category: "Valves",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Servo-assisted diaphragm valve for neutral liquids and gases in industrial systems.",
    specs: ["2/2-way", "Servo-assisted", "Brass body", "DN 10-40"],
    datasheet: true,
    verified: true,
    speed: 70,
    cost: 62,
    balanced: 80,
    lead: "1-3 weeks",
    moq: "1 pc",
    alternatives: ["ASCO 8210", "Gemu solenoid series"],
    sources: [
      { name: "OEM", url: "https://www.burkert.com/" },
      { name: "RS", url: "https://www.rs-online.com/" },
      { name: "TME", url: "https://www.tme.com/" }
    ]
  },
  {
    id: "telemecanique-xs",
    name: "XS Inductive Sensor",
    brand: "Telemecanique Sensors",
    sku: "XS",
    category: "Sensors",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Rugged proximity sensor family for industrial automation and material handling equipment.",
    specs: ["Inductive", "M8/M12/M18", "PNP/NPN", "Flush/non-flush"],
    datasheet: true,
    verified: true,
    speed: 79,
    cost: 64,
    balanced: 83,
    lead: "3-12 days",
    moq: "1 pc",
    alternatives: ["IFM IE series", "SICK IME"],
    sources: [
      { name: "OEM", url: "https://tesensors.com/" },
      { name: "Newark", url: "https://www.newark.com/" },
      { name: "RS", url: "https://www.rs-online.com/" }
    ]
  },
  {
    id: "gates-spa",
    name: "SPA V-Belt",
    brand: "Gates",
    sku: "SPA",
    category: "Power Transmission",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Wrapped classical metric V-belt used in fans, compressors, conveyors, and industrial drives.",
    specs: ["Metric V-belt", "13 mm top width", "Wrapped", "Oil resistant"],
    datasheet: true,
    verified: false,
    speed: 90,
    cost: 82,
    balanced: 88,
    lead: "1-7 days",
    moq: "1 pc",
    alternatives: ["Optibelt SK", "Continental Conti-V"],
    sources: [
      { name: "OEM", url: "https://www.gates.com/" },
      { name: "Motion", url: "https://www.motion.com/" },
      { name: "Zoro", url: "https://www.zoro.com/" }
    ]
  },
  {
    id: "omron-my2n",
    name: "MY2N General Purpose Relay",
    brand: "Omron",
    sku: "MY2N",
    category: "Electrical",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Plug-in industrial relay for panels, controls, interlocks, and machine service replacements.",
    specs: ["DPDT", "Socket mount", "LED options", "AC/DC coils"],
    datasheet: true,
    verified: true,
    speed: 93,
    cost: 80,
    balanced: 94,
    lead: "1-5 days",
    moq: "1 pc",
    alternatives: ["Finder 55 series", "Schneider RXM"],
    sources: [
      { name: "OEM", url: "https://industrial.omron.eu/" },
      { name: "Mouser", url: "https://www.mouser.com/" },
      { name: "DigiKey", url: "https://www.digikey.com/" }
    ]
  },
  {
    id: "phoenix-pt",
    name: "PT Terminal Block",
    brand: "Phoenix Contact",
    sku: "PT",
    category: "Electrical",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Push-in terminal block system for control cabinets, machinery, and distribution panels.",
    specs: ["Push-in", "DIN rail", "Modular", "IEC rated"],
    datasheet: true,
    verified: true,
    speed: 89,
    cost: 76,
    balanced: 91,
    lead: "1-7 days",
    moq: "1 pc",
    alternatives: ["Wago 2002", "Weidmuller A-series"],
    sources: [
      { name: "OEM", url: "https://www.phoenixcontact.com/" },
      { name: "DigiKey", url: "https://www.digikey.com/" },
      { name: "TME", url: "https://www.tme.com/" }
    ]
  },
  {
    id: "bosch-rexroth-a10vso",
    name: "A10VSO Axial Piston Pump",
    brand: "Bosch Rexroth",
    sku: "A10VSO",
    category: "Hydraulics",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Variable displacement axial piston pump for open circuit industrial hydraulic systems.",
    specs: ["Open circuit", "Variable displacement", "Swashplate", "Industrial hydraulics"],
    datasheet: true,
    verified: true,
    speed: 48,
    cost: 50,
    balanced: 70,
    lead: "4-12 weeks",
    moq: "1 unit",
    alternatives: ["Parker PVplus", "Eaton Vickers PVB"],
    sources: [
      { name: "OEM", url: "https://www.boschrexroth.com/" },
      { name: "Hydraulics Online", url: "https://hydraulicsonline.com/" },
      { name: "Surplus Center", url: "https://www.surpluscenter.com/" }
    ]
  },
  {
    id: "parker-43",
    name: "43 Series Hydraulic Hose Fitting",
    brand: "Parker",
    sku: "43 Series",
    category: "Hydraulics",
    regions: ["Europe", "Middle East", "Asia", "North America"],
    description: "Crimp-style hydraulic hose fitting family for field service, mobile equipment, and MRO use.",
    specs: ["Crimp fitting", "Steel", "Multiple ends", "No-skive options"],
    datasheet: true,
    verified: false,
    speed: 88,
    cost: 73,
    balanced: 86,
    lead: "1-10 days",
    moq: "1 pc",
    alternatives: ["Gates MegaCrimp", "Eaton Winner"],
    sources: [
      { name: "OEM", url: "https://www.parker.com/" },
      { name: "Motion", url: "https://www.motion.com/" },
      { name: "MSC", url: "https://www.mscdirect.com/" }
    ]
  }
];

const sourceChannels = [
  {
    type: "Manufacturer",
    title: "Official OEM pages",
    body: "Best for datasheets, certifications, manuals, configuration rules, lifecycle notices, and authorized partners.",
    url: "https://www.globalspec.com/"
  },
  {
    type: "Distributor",
    title: "Authorized distributors",
    body: "Best for genuine stock, warranty path, regional delivery, tax invoices, and quick small-quantity buying.",
    url: "https://www.rs-online.com/"
  },
  {
    type: "Marketplace",
    title: "Industrial marketplaces",
    body: "Useful for broad discovery, alternative suppliers, international availability, and hard-to-find products.",
    url: "https://www.alibaba.com/"
  },
  {
    type: "RFQ Network",
    title: "Quote-first sourcing",
    body: "Useful for pumps, valves, obsolete parts, custom assemblies, bulk orders, and project procurement.",
    url: "https://www.thomasnet.com/"
  }
];

const state = {
  query: "",
  category: "all",
  region: "all",
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
  datasheetOnly: document.querySelector("#datasheetOnly"),
  verifiedOnly: document.querySelector("#verifiedOnly"),
  resultCount: document.querySelector("#resultCount"),
  resultSummary: document.querySelector("#resultSummary"),
  results: document.querySelector("#resultsGrid"),
  sourceGrid: document.querySelector("#sourceGrid"),
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
  exportShortlist: document.querySelector("#exportShortlist")
};

const categories = [...new Set(products.map((product) => product.category))].sort();

function init() {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    els.category.append(option);
  });

  renderSources();
  wireEvents();
  render();
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
      priority: "balanced",
      datasheetOnly: false,
      verifiedOnly: false
    });
    els.search.value = "";
    els.category.value = "all";
    els.region.value = "all";
    els.datasheetOnly.checked = false;
    els.verifiedOnly.checked = false;
    els.priorityButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.priority === "balanced");
    });
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
    els.results.innerHTML = '<div class="empty-state">No products match this search yet. Try a broader keyword or reset filters.</div>';
    return;
  }

  els.results.innerHTML = matches.map(productTemplate).join("");

  els.results.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => addToShortlist(button.dataset.add));
  });
}

function matchesFilters(product) {
  const haystack = [
    product.name,
    product.brand,
    product.sku,
    product.category,
    product.description,
    product.specs.join(" "),
    product.alternatives.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  const queryTerms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
  const queryMatch = queryTerms.every((term) => haystack.includes(term));
  const categoryMatch = state.category === "all" || product.category === state.category;
  const regionMatch = state.region === "all" || product.regions.includes(state.region);
  const datasheetMatch = !state.datasheetOnly || product.datasheet;
  const verifiedMatch = !state.verifiedOnly || product.verified;

  return queryMatch && categoryMatch && regionMatch && datasheetMatch && verifiedMatch;
}

function summaryText(count) {
  if (!state.query && state.category === "all" && state.region === "all") {
    return "Showing launch catalog samples";
  }
  if (!count) {
    return "No match in prototype catalog";
  }
  if (state.query) {
    return `Best matches for "${state.query}"`;
  }
  return "Filtered procurement matches";
}

function productTemplate(product) {
  const score = product[state.priority];
  const isShortlisted = state.shortlist.includes(product.id);
  const sourceLinks = product.sources
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.name}</a>`)
    .join("");

  return `
    <article class="product-card">
      <div class="product-main">
        <div class="product-top">
          <div>
            <h3>${product.name}</h3>
            <div class="sku">${product.brand} · ${product.sku} · ${product.category}</div>
          </div>
          <span class="badge ${product.verified ? "" : "amber"}">${product.verified ? "Verified signal" : "Needs verification"}</span>
        </div>
        <p class="description">${product.description}</p>
        <ul class="spec-list">
          ${product.specs.map((spec) => `<li>${spec}</li>`).join("")}
        </ul>
        <div class="source-links">${sourceLinks}</div>
      </div>
      <div class="product-side">
        <div class="score">
          <span>${state.priority} fit</span>
          <strong>${score}</strong>
          <div class="bar" aria-hidden="true"><i style="width:${score}%"></i></div>
        </div>
        <div class="meta-list">
          <span>Lead time <b>${product.lead}</b></span>
          <span>MOQ <b>${product.moq}</b></span>
          <span>Datasheet <b>${product.datasheet ? "Yes" : "Check"}</b></span>
        </div>
        <div class="card-actions">
          <button type="button" data-add="${product.id}">${isShortlisted ? "Shortlisted" : "Add to shortlist"}</button>
          <button class="ghost-button" type="button" onclick="window.open('${product.sources[0].url}', '_blank', 'noreferrer')">Open OEM source</button>
        </div>
      </div>
    </article>
  `;
}

function renderSources() {
  els.sourceGrid.innerHTML = sourceChannels
    .map(
      (source) => `
        <article class="source-card">
          <span>${source.type}</span>
          <h3>${source.title}</h3>
          <p>${source.body}</p>
          <a href="${source.url}" target="_blank" rel="noreferrer">Explore source</a>
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
          <h3>${product.name}</h3>
          <p>${product.brand} · ${product.sku}</p>
          <p>Alternatives: ${product.alternatives.join(", ")}</p>
          <button type="button" data-remove="${product.id}">Remove</button>
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
          const sources = product.sources.map((source) => `${source.name}: ${source.url}`).join("; ");
          return `${index + 1}. ${product.brand} ${product.sku} - ${product.name}\nSpecs: ${product.specs.join(", ")}\nAlternatives: ${product.alternatives.join(", ")}\nSources: ${sources}`;
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

init();
