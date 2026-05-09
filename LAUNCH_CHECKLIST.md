# InduScout v4.3 Launch Checklist

Use this checklist after each public GitHub Pages upload.

## Upload

- Upload the clean package contents to the repository root.
- Keep `index.html`, `app.js`, `catalog.js`, `styles.css`, `assets`, `categories`, `products`, `sitemap.xml`, `robots.txt`, `.nojekyll`, and `.github`.
- Do not upload local development-only `data` or `tools` folders.
- Wait for the GitHub Pages workflow to complete successfully.

## Live Smoke Test

- Open `https://dhirajnyse.github.io/induscout/`.
- Confirm the hero counters show 12 categories, 84 product records, and 252 source links.
- Confirm the top navigation stays on one professional row on desktop and the secondary sections open from the More menu.
- Open Finder and search for `Danfoss FC 51`.
- Hard refresh once after upload and confirm Finder still renders products; v2.4 keeps the cache-safety guard for GitHub Pages mixed HTML/JavaScript loads.
- Confirm the Finder shows the buyer verification reminder above search.
- Fill the Project RFQ workspace, save it, copy the project brief, and confirm the shortlist drawer shows project context.
- Open Workspace and confirm readiness score, shortlist count, quote count, follow-up count, request count, project facts, lane cards, and next actions render.
- Copy the workspace brief and confirm it includes project context, shortlist, quote register, estimated value, and next buyer actions.
- Export the workspace JSON and confirm it includes the session snapshot plus workspace readiness summary.
- Search for a missing item, open `Can't find it? Create a product request`, save the request, copy the product request, copy the research brief, and confirm saved requests can be loaded or removed.
- Open the Quality dashboard and confirm verified coverage, datasheet coverage, high-confidence count, category strength rows, and review queue render.
- Open Sources, confirm supplier trust passport cards render, and copy one source checklist.
- In Supplier Intake, save one source lead with website, region, evidence URL, status, and notes.
- Confirm Supplier Intake summary counts update, the saved lead card appears, and Load, Copy packet, Remove, CSV export, and XLSX export work.
- Confirm the Workspace dashboard reflects saved source leads in Growth Leads and Source Intake.
- Open Review and confirm the Evidence Review Board shows source leads, missing-product requests, supplier reply actions, quote risk flags, and review-level catalog records.
- Copy the review report and confirm it includes review counts, recommended action plan, and review queue details.
- Export the review JSON and confirm it includes project context, counts, action plan, and review items.
- Open Decision Memo and confirm readiness, recommendation, quote signal, open risks, memo preview, Copy decision memo, and Download memo HTML work.
- Download the decision memo HTML, open it, and confirm the Save as PDF button appears with the project-ready memo content.
- Open Award Pack and confirm PO readiness, supplier lead, commercial readiness, blockers, checklist rows, Copy handover note, Copy supplier confirmation, and Download PO pack HTML work.
- Download the PO handover HTML, open it, and confirm it includes the handover note, supplier confirmation email, and Save as PDF button.
- Open Compliance and confirm compliance score, supplier, required checks, missing inputs, checklist rows, Copy compliance pack, Copy supplier due-diligence email, and Download compliance HTML work.
- Download the compliance HTML, open it, and confirm it includes the compliance pack, supplier due-diligence email, and Save as PDF button.
- Open Buyer File and confirm file score, file items, open gaps, timeline, checklist rows, Copy buyer file index, Download buyer file HTML, and Export buyer file JSON work.
- Download the buyer file HTML, open it, and confirm it includes the buyer file index, checklist, timeline, and Save as PDF button.
- Export the buyer file JSON and confirm it includes the buyerFile score, checklist, timeline, and generatedText fields.
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
- Confirm Quote Decision Scoring shows best current score, lowest price, fastest lead, decision badges, and review flags.
- Save a second quote with a different price or lead time and confirm the decision guidance changes.
- Export the quote tracker as CSV and XLSX.
- Open Cost, select a saved quote, confirm product, supplier, price, quantity, delivery terms, and country populate.
- Add freight, duty, tax/VAT, handling, bank charges, and FX buffer, then confirm landed total, landed unit, uplift, and buyer checks update.
- Copy the landed cost brief, download the Landed Cost HTML, export the Landed Cost JSON, and confirm each includes project context and cost assumptions.
- Open Negotiate, select a saved quote, confirm product, supplier, price, quantity, and lead-time context populate.
- Add a target unit price or requested discount, buyer leverage, target lead time, validity request, and notes.
- Confirm current total, target total, potential savings, reduction percent, and buyer checks update.
- Copy the supplier counter-offer email, copy the savings note, download the Negotiation HTML, and export the Negotiation JSON.
- Open Savings, click `Use negotiation plan`, and confirm product, supplier, baseline price, target price, quantity, and notes prefill.
- Save one accepted savings record and confirm the Savings Register KPI cards update accepted savings, largest saving, and record count.
- Save one target or supplier-pending savings record and confirm pipeline savings and open actions update.
- Copy the savings report, export Savings CSV, export Savings JSON, and confirm project context, supplier, evidence, status, totals, and notes are included.
- Export a session JSON, import it, and confirm saved savings records are restored.
- Open Inbox, save one supplier reply with status, next action, subject, supplier message, and buyer notes.
- Confirm Inbox summary counts update and the saved reply card appears with Load, Copy buyer reply, Convert to quote, and Remove actions.
- Copy one buyer reply and confirm it includes project context, product context, requested confirmations, supplier message, and buyer notes.
- Convert a supplier reply to a quote and confirm the Quote Tracker receives or updates the quote record.
- Export the supplier inbox as CSV and XLSX.
- Open Scorecard and confirm supplier path count, top path, follow-ups, review risks, ranked supplier cards, strengths, risks, and next actions render.
- Copy the supplier scorecard and confirm it includes project context, supplier ranking, strengths, risks, and buyer reminders.
- Download the supplier scorecard HTML and confirm it opens with a Save as PDF button.
- Export supplier scorecard JSON and confirm it includes supplierScorecard, topSupplier, suppliers, riskCount, followUps, and generatedText.
- Open Spec Match, enter an application, must-have specs, required certifications, source evidence rule, and project criticality.
- Save the requirement profile and confirm products are scored with strengths, gaps, source checks, and next buyer actions.
- Copy the spec matrix, download the Spec Match HTML, and export the Spec Match JSON.
- Export a session JSON, import it, and confirm the spec match requirement profile is restored.
- Open Alternates, choose a base product, select replacement criticality, add installed equipment/location, and add a known constraint.
- Confirm alternate candidates render with engineering fit score, positive signals, substitution checks, and conservative next actions.
- Copy the alternate review note, download the Alternate Review HTML, and export the Alternate Review JSON.
- Open Approval, select an original product and proposed substitute, choose decision status, add reviewer/equipment context, and tick approval checks.
- Confirm the approval score, risk label, open approval conditions, and checklist rows update.
- Copy the substitution approval note, download the Substitution Approval HTML, and export the Substitution Approval JSON.
- Export a session JSON, import it, and confirm the substitution approval setup is restored.
- Export a session JSON, import it, and confirm the landed cost scenario is restored.
- Export a session JSON, import it, and confirm the negotiation plan is restored.
- Export a session JSON, import it, and confirm the alternate review setup is restored.
- Export a CSV/XLSX after entering a note beginning with `=`, `+`, `-`, or `@`, then confirm the exported spreadsheet treats it as text.
- Try importing a non-InduScout JSON file and confirm the app rejects it without breaking Finder.
- Confirm `SECURITY.md` is present in the repository root after upload.
- Confirm the Trust section shows the static beta security baseline and local-browser storage note.
- Open Privacy and confirm the Privacy & Trust Center explains local storage, user-controlled exports, public beta limits, and future backend controls.
- Copy the privacy brief and confirm it includes what stays local, how exports leave the browser, current no-backend status, and public beta guidance.
- Confirm `PRIVACY.md` is present in the repository root after upload.
- Save a session with one shortlist item, one compare item, one source lead, filters, and notes; reload the page, load session, and confirm work is restored.
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
- Grow Supplier Intake into a governed review workflow before public supplier submissions.
- Plan backend search only after static catalog workflow is stable.
