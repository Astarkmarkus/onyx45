# Web3Forms contact repair — 24 October 2026

## Observed cause and baseline

Started from remote main `d5f6f1c0999ff17f05bbc87d754ad1151ab7fe5f`, including the owner's three newer Web3Forms commits; none were overwritten. The existing access key and API endpoint were present and reused unchanged. On a fresh live visit, the latest page already initialized a direct Web3Forms route, with the old “Request a Free Consultation” label. The reported “Prepare enquiry email” state was not reproduced on that fresh load.

The code still contained the complete email-draft fallback and hidden draft controls. Runtime translations, privacy and cookie notices still described manual email sending. Contact scripts used a different query version from other pages; configuration was unversioned elsewhere. Earlier code accepted only Formspree URLs. This explains the original fallback before the new Web3Forms configuration; it does not prove which cache caused any later visitor-specific stale display.

## Changes

- Removed the draft branch, draft/copy controls and obsolete runtime copy. Retained direct email as an optional contact link.
- Direct JSON POST with an explicit payload allowlist and existing public key. Web3Forms response handling follows its documented `success` boolean, alongside HTTP success.
- Exact EN/SV submit, loading, success and error labels; required/native validity checks; minimum message length; focus and field descriptions.
- No automatic reset on failure. Twenty-second abort timeout, duplicate-request lock, no request-body logging or third-party tracking.
- Retained local honeypot and added Web3Forms botcheck. No paid dependency.
- Updated CSP and bilingual processing/privacy preference copy. The service receives form contents on submission, not merely on page load.
- Added content-hashed script filenames, a small repeatable versioning helper and a script manifest. Every rendered page references the same current assets.
- Preserved design, CNAME, canonical URLs, sitemap, robots, routing and deployment infrastructure.

## Verification

Run `python3 scripts/verify-static.py` for repository routes, assets, fragments, IDs, headings, canonicals and CNAME. The project has no production framework build or lint/type-check command.

Automated DOM tests use mocked provider responses in both languages: success, success:false with HTTP 200, server failure, rate limit, network rejection, malformed payload, invalid JSON and timeout. They also cover loading state, duplicate lock, required fields, invalid email, short message, service labels/language, both honeypots and missing configuration. No real submission was sent.

## Owner-only checks still required

The Web3Forms dashboard and Proton inbox are not accessible through the GitHub connector. Confirm the recipient is markus@onyx45.com, Advanced Spam Filter is enabled and Spam Protection Level is Basic. Send one clearly labeled owner test, then confirm its appearance in Web3Forms Submissions and delivery to Proton Mail. A mocked success is not inbox-delivery proof.

Legal operator/controller facts still require the owner's real information, as documented in LAUNCH-CHECKLIST.md.

Automated test source: `scripts/test-contact.cjs` (requires jsdom in the maintainer's Node environment; no browser/runtime dependency is added). Run `node scripts/test-contact.cjs` with jsdom available.

Browser checks: both contact pages loaded the configured state with the correct submit label. Required-field validation passed in the real browser. Both languages fit frames at 320, 375, 430, 768, 1024 and 1440 pixels without document overflow.

Pages publishing settings could not be read through the GitHub connector's allowed public fetch endpoints. Existing main/root infrastructure is preserved; deployment is verified through the Pages Actions run and fresh live contact pages, rather than claiming unavailable private settings were read.

## Modified files

- `404.html`
- `LAUNCH-CHECKLIST.md`
- `QA-REPORT.md`
- `README.md`
- `WEB3FORMS-FIX.md`
- `about/index.html`
- `approach/index.html`
- `assets/agency-20261023.css`
- `assets/agency-20261023.js`
- `assets/agency.bce59e542c2e.js`
- `assets/script-versions.json`
- `assets/site-config.ee994bc49ac2.js`
- `assets/site-config.js`
- `contact/index.html`
- `content/ui-copy.json`
- `cookies/index.html`
- `index.html`
- `insights/index.html`
- `privacy/index.html`
- `scripts/test-contact.cjs`
- `scripts/version-assets.py`
- `services/index.html`
- `sv/arbetssatt/index.html`
- `sv/cookies/index.html`
- `sv/index.html`
- `sv/insikter/index.html`
- `sv/integritet/index.html`
- `sv/kontakt/index.html`
- `sv/om-oss/index.html`
- `sv/tjanster/index.html`
- `sv/villkor/index.html`
- `terms/index.html`
