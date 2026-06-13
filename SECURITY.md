# InduScout Security Policy

InduScout is currently a static GitHub Pages public beta. It does not use a backend database, server-side accounts, payment processing, or embedded API keys.

## Supported Version

The current public beta is the supported version. Older uploaded builds should be replaced by the latest package when security hardening changes are released.

## Data Handling

- Buyer notes, project context, spec match requirements, alternate review setup, substitution approval setup, landed cost scenarios, negotiation plans, savings records, learning records, playbook rules, reinforcement signals, governance policy, learning approvals, tenant admin previews, shortlists, quote records, supplier replies, and sessions are stored in the user's browser local storage.
- Exported CSV, XLSX, RFQ packs, decision memos, PO handover packs, supplier compliance packs, buyer file exports, supplier scorecard exports, spec match matrix exports, alternate review exports, substitution approval exports, landed cost exports, negotiation exports, savings register exports, learning loop exports, AI playbook exports, reinforcement signal exports, governance exports, learning queue exports, AI loop exports, tenant admin exports, and session JSON files are created locally in the browser.
- The public beta is not intended for confidential tender data, passwords, access tokens, payment details, regulated personal data, or private commercial documents.

## Current Security Baseline

- Static GitHub Pages architecture with no backend attack surface.
- No secrets or API keys in the client application.
- User-controlled text is escaped before rendering into the page.
- Session JSON import is size-limited and sanitized before use.
- Governance policy import values are allow-listed before they can affect local learning or export summaries.
- Learning approval import values are allow-listed before they can affect the review queue.
- AI Loop recommendation influence is computed locally from approved or tenant-only learning candidates; blocked and unreviewed candidates do not intentionally affect the closed-loop guidance layer.
- Tenant Admin and audit trail previews are derived locally from browser state. They are not persistent server audit logs until a real backend, account model, and tenant controls are implemented.
- API, integration blueprint, SaaS readiness gate, pilot launch pack, and demo proof previews are local planning artifacts only. InduScout v5.7 does not expose live API endpoints, webhook receivers, partner connectors, account identity, shared tenant storage, billing, or server-side data transfer.
- CSV and XLSX exports protect against common spreadsheet formula-injection patterns.
- External source links are restricted to safe web and email protocols.
- Downloaded filenames are sanitized before being assigned in the browser.

## Responsible Disclosure

If you find a security issue, please do not publish exploit details publicly before maintainers have time to review it.

Use a private contact path if available, or open a GitHub issue with a high-level description that avoids sensitive exploit details. Include:

- Affected URL or feature.
- Steps to reproduce.
- Browser and operating system.
- Impact and suggested fix, if known.

## Future Backend Security Requirements

Before InduScout adds accounts, supplier submissions, shared projects, APIs, or server-side quote storage, the project should add:

- Authentication and role-based access control.
- Server-side validation and output encoding.
- Rate limiting and abuse monitoring.
- Audit logs for buyer and supplier actions.
- Encrypted storage for sensitive records.
- Dependency scanning and automated security checks.
- Backup, retention, and deletion policies.
- Explicit opt-in, anonymization or aggregation, tenant isolation, and auditability before any cross-organization learning.
- Clear privacy policy and terms for buyer/supplier data.
