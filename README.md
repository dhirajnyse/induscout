# InduScout

InduScout is an early GitHub Pages-ready beta for a global industrial product finder. It helps procurement teams search industrial parts, compare supplier channels, review key specifications, and build a shortlist before requesting quotes or buying from source links.

Live site: https://dhirajnyse.github.io/induscout/

## Vision

Industrial buyers waste time searching manufacturer catalogs, distributor sites, marketplace listings, PDFs, and old part numbers. InduScout aims to become a neutral discovery layer for industrial procurement:

- Find exact industrial products by part number, brand, category, or specification.
- Compare global and regional buying channels.
- Surface datasheets, compliance signals, lead-time hints, and replacement options.
- Help buyers build a shortlist before purchase or RFQ.

## Current Beta

This v0.5 version is a static frontend with a structured procurement catalog, early buyer workflow tools, and visible trust signals. It is designed to launch easily on GitHub Pages while the product model, supplier data strategy, and category focus mature.

Features included:

- 12 procurement categories, 36 product records, and 108 product source links.
- Separate `data/catalog.js` data layer for product records, taxonomy, source channels, and source directory entries.
- Search by keyword, brand, model, SKU, category, application, source type, and spec terms.
- Category, region, source type, confidence, datasheet, and verified-signal filters.
- Procurement fit scoring.
- Product confidence labels for high, standard, and review-required records.
- Source confidence hints for primary trust paths, discovery paths, and seller-term verification.
- Product detail drawer with specifications, applications, alternates, source actions, and RFQ fields.
- Copyable product-level RFQ request with quantity, delivery country, target date, urgency, alternates preference, and buyer notes.
- Copyable product data update/report request for missing sources, outdated specs, certificate issues, or supplier verification concerns.
- Browser-saved buyer notes for each product.
- Compare desk for up to four selected products.
- Copyable comparison brief for sourcing discussions.
- Supplier/source cards for OEM, distributor, marketplace, RFQ, surplus, and data sources.
- Launch source directory with global distributor, marketplace, RFQ, and specification-discovery starting points.
- Buyer desk with RFQ checklist, supplier listing prompt, and data expansion priorities.
- Trust layer explaining confidence levels and the data update workflow.
- Shortlist drawer with exportable RFQ-style summary.
- Responsive corporate UI and SVG 3D-style brand mark.
- SEO metadata, social sharing preview, and installable site manifest.

## Launch On GitHub Pages

1. Create a GitHub repository named `induscout`.
2. Upload the files in this folder to the repository root.
3. In GitHub, open **Settings -> Pages**.
4. Select the default branch and root folder.
5. Publish.

## Important Note

The beta is for product discovery and procurement workflow planning only. Pricing, stock, compatibility, certifications, and supplier claims must be verified with the seller or manufacturer before purchase.
