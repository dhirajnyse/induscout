# InduScout

InduScout is a GitHub Pages-ready beta for a global industrial product finder. It helps procurement teams search industrial parts, compare source options, review confidence signals, and prepare RFQ-ready sourcing briefs.

Live site: https://dhirajnyse.github.io/induscout/

## What It Does

Industrial buyers often search across manufacturer pages, distributor catalogs, marketplaces, datasheets, RFQ networks, and old part numbers. InduScout is designed as a neutral discovery layer for that workflow.

- Find industrial products by part number, brand, category, application, or specification.
- Compare global and regional buying channels.
- Review confidence, datasheet, certification, lifecycle, lead-time, and alternate-product signals.
- Build shortlists, compare products, and copy RFQ-ready request text.
- Collect product data corrections and supplier/source suggestions.

## Current Beta

This v1.9 public beta is still static and lightweight, but it already demonstrates the core procurement workflow and adds buyer-useful crawlable SEO catalog pages.

- 12 procurement categories, 60 product records, and 180 product source links.
- Structured `catalog.js` data layer for products, taxonomy, source channels, and source directory entries.
- Search, category, region, source type, confidence, datasheet, and verified-signal filters.
- "Can't find it?" product request workflow for missing items, with copyable request text and a structured GitHub request path.
- Procurement fit scoring for balanced, speed, and cost priorities.
- Product confidence labels for high, standard, and review-required records.
- Source confidence hints for primary trust paths, discovery paths, and seller-term verification.
- Product detail drawer with specifications, applications, alternates, source actions, and RFQ fields.
- Copyable procurement brief for internal buyer review, source validation, and shortlist decisions.
- Procurement brief action repeated near the RFQ copy controls so buyers can find it while preparing a request.
- Copyable supplier outreach email with subject line, quantity, delivery country, target date, alternates preference, confirmation checklist, and buyer notes.
- Copyable product-level RFQ request with quantity, delivery country, target date, urgency, alternates preference, and buyer notes.
- Copyable product data update/report request.
- Browser-saved buyer notes for each product.
- Save/load session desk for filters, shortlist, compare list, and notes, with JSON export/import for moving work between browsers or machines.
- Compare desk for up to four selected products.
- Shortlist drawer with exportable RFQ-style summary.
- Visible shortlist count on the finder export button, plus add/remove shortlist toggles on product cards and detail drawers.
- Downloadable RFQ shortlist pack as a concise print-ready HTML document with a Save as PDF button and suggested PDF filename.
- Downloadable native XLSX shortlist workbook with formatted headers, frozen header row, source links, and buyer notes.
- Downloadable shortlist CSV for spreadsheet, ERP prep, or internal buyer review.
- Buyer desk, trust layer, source directory, launch-readiness section, and roadmap.
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

## Public Feedback Paths

- Product data update: https://github.com/dhirajnyse/induscout/issues/new?template=product-data-update.yml
- Product request: https://github.com/dhirajnyse/induscout/issues/new?template=product-request.yml
- Supplier or source request: https://github.com/dhirajnyse/induscout/issues/new?template=supplier-source-request.yml
- Feature request: https://github.com/dhirajnyse/induscout/issues/new?template=feature-request.yml

## Roadmap

- Expand catalog depth category by category.
- Add supplier submission and verification review.
- Add saved projects and team collaboration.
- Add backend search, accounts, and structured supplier/product APIs.
- Add richer product detail pages for SEO as the catalog expands category by category.
