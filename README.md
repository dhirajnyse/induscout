# InduScout

InduScout is a GitHub Pages-ready beta for a global industrial product finder. It helps procurement teams search industrial parts, compare source options, review confidence signals, check technical fit, review alternates before substitution, prepare RFQ-ready sourcing briefs, rank supplier paths, draft internal buyer decision memos, create PO-ready award handover packs, prepare supplier due-diligence checks, and assemble audit-ready buyer files.

Live site: https://dhirajnyse.github.io/induscout/

## What It Does

Industrial buyers often search across manufacturer pages, distributor catalogs, marketplaces, datasheets, RFQ networks, and old part numbers. InduScout is designed as a neutral discovery layer for that workflow.

- Find industrial products by part number, brand, category, application, or specification.
- Compare global and regional buying channels.
- Review confidence, datasheet, certification, lifecycle, lead-time, and alternate-product signals.
- Build shortlists, compare products, and copy RFQ-ready request text.
- Collect product data corrections and supplier/source suggestions.

## Current Beta

This v3.8 public beta is still static and lightweight, but it already demonstrates the core procurement workflow and adds buyer-useful crawlable SEO catalog pages. v3.8 adds an Alternate & Obsolescence Desk that reviews lifecycle risk, known replacement candidates, source evidence, constraints, and engineering sign-off needs before substitution.

- 12 procurement categories, 84 product records, and 252 product source links.
- Structured `catalog.js` data layer for products, taxonomy, source channels, and source directory entries.
- Search, category, region, source type, confidence, datasheet, and verified-signal filters.
- Project RFQ workspace for project name, buyer/company, contact, delivery country, target date, and project notes.
- Buyer Workspace dashboard with readiness score, shortlist count, quote count, follow-up count, saved request count, next actions, copyable workspace brief, and workspace JSON export.
- "Can't find it?" product request workflow for missing items, with saved request intake, copyable request text, research briefs, and a structured GitHub request path.
- Procurement fit scoring for balanced, speed, and cost priorities.
- Product confidence labels for high, standard, and review-required records.
- Source confidence hints and supplier trust passports for primary trust paths, discovery paths, RFQ paths, surplus paths, and seller-term verification.
- Copyable supplier trust checklists from product source cards and the source directory.
- Supplier Source Intake Desk for new source leads, website/evidence links, categories, regions, review status, verification notes, copyable review packets, and CSV/XLSX export.
- Evidence Review Board for source leads, missing-product requests, supplier replies, quote risks, and review-level catalog records, with copyable review report and JSON export.
- Buyer Decision Memo with readiness score, recommended action, quote lead, shortlist summary, evidence risks, source paths, copy action, and downloadable print-ready HTML.
- Award Handover pack with PO-readiness score, supplier lead, commercial readiness, blockers, PO fields, copyable handover note, supplier confirmation email, and downloadable HTML.
- Supplier Compliance Gate with compliance score, due-diligence checklist, supplier evidence requests, copyable compliance pack, supplier due-diligence email, and downloadable HTML.
- Buyer File / Audit Trail with file score, document checklist, session evidence timeline, copyable buyer file index, downloadable HTML, and buyer file JSON export.
- Supplier Scorecard with ranked supplier paths, score drivers, strengths, risks, next buyer action, copyable scorecard, downloadable HTML, and JSON export.
- Spec Match Desk with saved buyer requirement profile, technical fit scores, strengths, gaps, next buyer actions, copyable matrix, downloadable HTML, and JSON export.
- Alternate & Obsolescence Desk with base-product selection, replacement criticality, installed-equipment context, constraint checks, alternate scoring, copyable engineering review note, downloadable HTML, and JSON export.
- Catalog quality dashboard with verified coverage, datasheet coverage, confidence mix, category strength, source depth, and review queue.
- Product detail drawer with specifications, applications, alternates, source actions, and RFQ fields.
- Copyable procurement brief for internal buyer review, source validation, and shortlist decisions.
- Procurement brief action repeated near the RFQ copy controls so buyers can find it while preparing a request.
- Copyable supplier outreach email with subject line, quantity, delivery country, target date, alternates preference, confirmation checklist, and buyer notes.
- Copyable product-level RFQ request with quantity, delivery country, target date, urgency, alternates preference, and buyer notes.
- RFQ pack, XLSX, CSV, procurement brief, supplier email, and RFQ copy actions include project workspace context.
- Quote Tracker section for supplier, status, price, quantity, lead time, MOQ, payment terms, delivery terms, validity, source URL, notes, CSV/XLSX export, and follow-up email copy.
- Quote Decision Scoring for best current score, lowest price, fastest lead, review flags, validity risk, and commercial completeness.
- Supplier Inbox section for supplier reply status, missing certificates, alternates, revised prices, next actions, buyer response copy, CSV/XLSX export, and quote conversion.
- Supplier Scorecard combines quote, inbox, shortlist, compare, source lead, and source type evidence into a ranked supplier decision view.
- Security baseline with session import size checks, sanitized imported records, safe external-link handling, spreadsheet formula-injection protection, and safer downloaded filenames.
- Privacy & Trust Center explaining local browser storage, user-controlled exports, public beta limits, and future backend requirements.
- Copyable privacy brief for launch pages, buyer onboarding, GitHub documentation, or internal review.
- Product detail RFQ drawer includes a Track quote action that opens the selected product in the quote form.
- Copyable product data update/report request.
- Browser-saved buyer notes for each product.
- Save/load session desk for project profile, spec match requirements, alternate review setup, filters, shortlist, compare list, source intake, quote records, supplier replies, and notes, with JSON export/import for moving work between browsers or machines.
- Saved missing-product requests are included in session JSON export/import.
- Compare desk for up to four selected products.
- Shortlist drawer with exportable RFQ-style summary.
- Visible shortlist count on the finder export button, plus add/remove shortlist toggles on product cards and detail drawers.
- Downloadable RFQ shortlist pack as a concise print-ready HTML document with a Save as PDF button and suggested PDF filename.
- Downloadable native XLSX shortlist workbook with formatted headers, frozen header row, source links, and buyer notes.
- Downloadable shortlist CSV for spreadsheet, ERP prep, or internal buyer review.
- Buyer desk, trust layer, supplier trust passport directory, launch-readiness section, and roadmap.
- Static SEO category pages and product record pages generated from the catalog.
- Breadcrumbs, related records, buyer checklists, and richer structured data on SEO pages.
- SEO product pages include source-confidence notes, RFQ fields to send, and internal buyer paths.
- SEO category pages include sourcing guidance and RFQ preparation guidance.
- Static SEO pages can hand buyers back into the live finder with product or category filters prepared.
- Public GitHub issue paths for product data corrections, supplier/source suggestions, and feature requests.
- Launch-readiness guidance for sitemap checks, search indexing, and public beta verification.
- Clear beta and buyer-verification notices in the hero, finder, product detail, and copied RFQ text.
- Expanded sitemap with category and product URLs.
- Responsive corporate UI, SVG 3D-style brand mark, SEO metadata, social preview, and installable site manifest.

## Project Structure

```text
.
|-- index.html
|-- styles.css
|-- app.js
|-- catalog.js
|-- categories/
|   |-- index.html
|   `-- ...
|-- products/
|   |-- index.html
|   `-- ...
|-- tools/
|   `-- generate-seo-pages.js
|-- .github/
|   `-- ISSUE_TEMPLATE/
|-- assets/
|   |-- induscout-logo.svg
|   |-- induscout-social-card.jpg
|   |-- induscout-social-card.png
|   |-- induscout-social-card.svg
|   `-- induscout-touch-icon.png
|-- site.webmanifest
|-- sitemap.xml
|-- robots.txt
|-- SECURITY.md
|-- PRIVACY.md
|-- .nojekyll
|-- LICENSE
`-- README.md
```

## Launch On GitHub Pages

1. Upload the contents of this folder to the repository root.
2. Keep `catalog.js`, `assets`, `categories`, and `products` intact.
3. The `data` and `tools` folders are development backups only. They are not required for GitHub Pages upload.
4. In GitHub, open **Settings -> Pages**.
5. Publish from the `main` branch and root folder.
6. After deployment, hard refresh the live site.

## Regenerate SEO Pages

When the catalog changes, regenerate static category/product pages and the sitemap:

```bash
node tools/generate-seo-pages.js
```

The generator is for local development only. The public website does not need the `tools` folder after pages are generated.

## Data Quality Note

InduScout is a discovery and procurement workflow aid. Buyers must verify pricing, stock, compatibility, certifications, warranty path, seller terms, and source legitimacy with the seller or manufacturer before purchase.

## Security And Privacy Note

The current public beta is a static GitHub Pages app. It has no login system, no backend database, no payment flow, and no embedded API keys. Buyer notes, project context, spec match requirements, alternate review setup, quote records, supplier replies, source intake leads, and sessions are stored locally in the user's browser unless exported by the user.

- Do not enter confidential tender data, passwords, access tokens, payment details, or sensitive personal data into the public beta.
- Session JSON import is limited and sanitized before it is loaded into the app.
- CSV and XLSX exports protect cells that could be interpreted as spreadsheet formulas.
- Product and source links are restricted to safe web or email protocols before rendering.
- Use `SECURITY.md` for responsible disclosure and the security roadmap.
- Use `PRIVACY.md` for current public-beta data handling guidance.

## Public Feedback Paths

- Product data update: https://github.com/dhirajnyse/induscout/issues/new?template=product-data-update.yml
- Product request: https://github.com/dhirajnyse/induscout/issues/new?template=product-request.yml
- Supplier or source request: https://github.com/dhirajnyse/induscout/issues/new?template=supplier-source-request.yml
- Feature request: https://github.com/dhirajnyse/induscout/issues/new?template=feature-request.yml

## Roadmap

- Expand catalog depth category by category.
- Strengthen technical fit workflows with richer product attributes and engineering review evidence fields.
- Expand supplier intake into a governed submission and verification review workflow.
- Add saved projects and team collaboration.
- Add backend search, accounts, and structured supplier/product APIs.
- Add richer product detail pages for SEO as the catalog expands category by category.
