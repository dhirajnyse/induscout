# InduScout Privacy Note

InduScout is currently a static GitHub Pages public beta for industrial product discovery and RFQ preparation.

## Current Data Handling

The beta does not use a login system, backend database, payment workflow, or embedded API keys.

The following information is stored locally in the user's browser when the user chooses to use those features:

- Buyer notes.
- Project RFQ workspace fields.
- Spec match requirement profile.
- Alternate and obsolescence review setup.
- Substitution approval setup.
- Landed cost scenario inputs.
- Negotiation plan inputs.
- Savings register records.
- Closed-loop learning records.
- AI playbook settings and promoted playbook rules.
- Shortlist and compare selections.
- Quote tracker records.
- Supplier inbox replies.
- Supplier/source intake leads.
- Saved session JSON state.
- Missing-product request drafts.

## Exports And Sharing

Data leaves the browser only when the user chooses to export, download, copy, email, or otherwise share it.

InduScout can generate:

- RFQ pack HTML files.
- CSV exports.
- XLSX exports.
- Source intake registers.
- Workspace snapshots.
- Evidence review board JSON exports.
- Decision memo HTML exports.
- PO handover HTML exports.
- Supplier compliance HTML exports.
- Buyer file HTML and JSON exports.
- Supplier scorecard HTML and JSON exports.
- Spec match matrix HTML and JSON exports.
- Alternate review HTML and JSON exports.
- Substitution approval HTML and JSON exports.
- Landed cost HTML and JSON exports.
- Negotiation HTML and JSON exports.
- Savings register CSV and JSON exports.
- Learning loop CSV and JSON exports.
- AI Playbook Lab JSON exports.
- Session JSON files.
- Copyable RFQ, supplier email, supplier counter-offer email, supplier confirmation email, supplier due-diligence email, buyer reply, procurement brief, project brief, source review packet, evidence review report, decision memo, award handover note, compliance pack, buyer file index, supplier scorecard, spec match matrix, alternate review note, substitution approval note, landed cost brief, negotiation savings note, savings register report, learning report, playbook brief, and product update text.

Users are responsible for deciding where exported files and copied text are stored or shared.

## Public Beta Guidance

Do not enter confidential tender data, passwords, API keys, payment details, regulated personal data, private contracts, or sensitive commercial documents into the public beta.

Use generic project descriptions or non-sensitive procurement notes until InduScout has a governed backend, access controls, privacy policy, deletion workflow, and terms of use.

## Current Safeguards

- Imported session JSON is size-limited and sanitized before use.
- CSV and XLSX exports guard against common spreadsheet formula-injection patterns.
- External source links are restricted to safe web and email protocols.
- Downloaded filenames are sanitized.
- User-facing text is escaped before rendering in the static app.

## Future Requirements

Before InduScout launches accounts, supplier submissions, shared projects, APIs, or server-side quote storage, the project should add:

- Access control and role permissions.
- Audit logs.
- Encrypted storage for sensitive records.
- Rate limiting and abuse monitoring.
- Data deletion and export workflows.
- Backup and retention policies.
- Privacy policy and terms of use.
- Security review for any backend, third-party APIs, or supplier portals.
