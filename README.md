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

This v0.8 version is still static and lightweight, but it already demonstrates the core procurement workflow and adds buyer-useful crawlable SEO catalog pages.

- 12 procurement categories, 36 product records, and 108 product source links.
- Structured `catalog.js` data layer for products, taxonomy, source channels, and source directory entries.
- Search, category, region, source type, confidence, datasheet, and verified-signal filters.
- Procurement fit scoring for balanced, speed, and cost priorities.
- Product confidence labels for high, standard, and review-required records.
- Source confidence hints for primary trust paths, discovery paths, and seller-term verification.
- Product detail drawer with specifications, applications, alternates, source actions, and RFQ fields.
- Copyable product-level RFQ request with quantity, delivery country, target date, urgency, alternates preference, and buyer notes.
- Copyable product data update/report request.
- Browser-saved buyer notes for each product.
- Compare desk for up to four selected products.
- Shortlist drawer with exportable RFQ-style summary.
- Buyer desk, trust layer, source directory, launch-readiness section, and roadmap.
- Static SEO category pages and product record pages generated from the catalog.
- Breadcrumbs, related records, buyer checklists, and richer structured data on SEO pages.
- Static SEO pages can hand buyers back into the live finder with product or category filters prepared.
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

## Roadmap

- Expand catalog depth category by category.
- Add supplier submission and verification review.
- Add saved projects and team collaboration.
- Add backend search, accounts, and structured supplier/product APIs.
- Add richer product detail pages for SEO as the catalog expands category by category.
