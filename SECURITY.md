# InduScout Security Policy

InduScout is currently a static GitHub Pages public beta. It does not use a backend database, server-side accounts, payment processing, or embedded API keys.

## Supported Version

The current public beta is the supported version. Older uploaded builds should be replaced by the latest package when security hardening changes are released.

## Data Handling

- Buyer notes, project context, spec match requirements, alternate review setup, shortlists, quote records, supplier replies, and sessions are stored in the user's browser local storage.
- Exported CSV, XLSX, RFQ packs, decision memos, PO handover packs, supplier compliance packs, buyer file exports, supplier scorecard exports, spec match matrix exports, alternate review exports, and session JSON files are created locally in the browser.
- The public beta is not intended for confidential tender data, passwords, access tokens, payment details, regulated personal data, or private commercial documents.

## Current Security Baseline

- Static GitHub Pages architecture with no backend attack surface.
- No secrets or API keys in the client application.
- User-controlled text is escaped before rendering into the page.
- Session JSON import is size-limited and sanitized before use.
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
- Clear privacy policy and terms for buyer/supplier data.
