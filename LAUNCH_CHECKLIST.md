# InduScout v2.4 Launch Checklist

Use this checklist after each public GitHub Pages upload.

## Upload

- Upload the clean package contents to the repository root.
- Keep `index.html`, `app.js`, `catalog.js`, `styles.css`, `assets`, `categories`, `products`, `sitemap.xml`, `robots.txt`, `.nojekyll`, and `.github`.
- Do not upload local development-only `data` or `tools` folders.
- Wait for the GitHub Pages workflow to complete successfully.

## Live Smoke Test

- Open `https://dhirajnyse.github.io/induscout/`.
- Confirm the hero counters show 12 categories, 84 product records, and 252 source links.
- Open Finder and search for `Danfoss FC 51`.
- Hard refresh once after upload and confirm Finder still renders products; v2.4 keeps the cache-safety guard for GitHub Pages mixed HTML/JavaScript loads.
- Confirm the Finder shows the buyer verification reminder above search.
- Fill the Project RFQ workspace, save it, copy the project brief, and confirm the shortlist drawer shows project context.
- Search for a missing item, open `Can't find it? Create a product request`, save the request, copy the product request, copy the research brief, and confirm saved requests can be loaded or removed.
- Open the Quality dashboard and confirm verified coverage, datasheet coverage, high-confidence count, category strength rows, and review queue render.
- Open Sources, confirm supplier trust passport cards render, and copy one source checklist.
- Open a product detail drawer, copy one source trust checklist, and confirm it includes source role, verification checklist, risk notes, and product context.
- Open the Sensors category SEO page and use the finder handoff link.
- Open one product page, such as `/products/pepperl-fuchs-nbb/`, and use the product finder handoff link.
- Confirm SEO category pages show sourcing guidance and RFQ preparation guidance.
- Confirm SEO product pages show source-confidence notes and RFQ fields to send.
- Open one product detail drawer and confirm the verify-before-buying notice appears before RFQ fields.
- Copy one procurement brief from the RFQ drawer and confirm it includes sources, alternates, confidence, and verification checklist.
- Copy one supplier email from the RFQ drawer and confirm it includes a subject line, quantity, delivery country, target date, confirmation checklist, and buyer notes.
- Click `Track quote` from a product detail drawer and confirm the Quotes section opens with that product selected.
- Save one quote with supplier, status, unit price, quantity, lead time, payment terms, delivery terms, and notes.
- Confirm the Quote Tracker summary counts update, the saved quote card appears, and the Load, Copy follow-up, and Remove actions work.
- Export the quote tracker as CSV and XLSX.
- Save a session with one shortlist item, one compare item, filters, and notes; reload the page, load session, and confirm work is restored.
- Export a session JSON, import it, and confirm shortlist and filters are restored.
- Add one product to shortlist and confirm `Export shortlist (1)` appears in Finder and the product button changes to `Remove shortlist`.
- Click `Remove shortlist` and confirm the count returns to zero.
- Add two products to shortlist, download RFQ pack, confirm the HTML file opens with product details, source links, verification checklist, and a Save as PDF button.
- Confirm RFQ pack, XLSX, and CSV include project name, buyer/company, contact, delivery country, target date, and project notes.
- Use the RFQ pack Save as PDF button and confirm the first PDF page starts with visible pack content.
- Add two products to shortlist, download XLSX, and confirm it opens in Excel without the CSV feature-loss warning.
- Add two products to shortlist, download CSV, and confirm it opens in Excel with source links and buyer notes.
- Check the back-to-top button after scrolling.

## Search Readiness

- Confirm `https://dhirajnyse.github.io/induscout/sitemap.xml` loads.
- Confirm `https://dhirajnyse.github.io/induscout/robots.txt` references the sitemap.
- Submit the sitemap in Google Search Console after the site is verified.
- Re-submit the sitemap after major catalog expansions.

## Data Quality

- Treat every product record as discovery support, not final purchasing advice.
- Review product data update issues before changing catalog records.
- Prefer OEM, authorized distributor, datasheet, or strong supplier evidence when raising confidence.
- Keep alternates conservative until compatibility evidence is available.

## Next Growth

- Expand catalog depth category by category.
- Add richer regional availability notes.
- Build supplier submission review rules.
- Plan backend search only after static catalog workflow is stable.
