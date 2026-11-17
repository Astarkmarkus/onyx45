# ONYX45 V3.1 — implementation and evidence

Updated 17 November 2026. The owner’s latest direction is to use supplied estimates rather than live CRM operational data.

## Public content

- Four-language homepage: exact English hero message, concise service descriptions, distinct service CTAs and business value, three internal projects, six-stage workflow and clearer introductory-call CTA.
- Services retain every existing capability accordion. Audience and measurement summaries sit beside each offer. The pilot detail moved from the homepage into a native disclosure on Services.
- Three project families, each in English, Swedish, Spanish and Catalan: `/work/crm/`, `/work/prospecting/`, `/work/brand-transformation/`. Localized equivalents use `/sv/work/`, `/es/work/`, `/ca/work/`.
- `content/work.json` contains the translated copy; `scripts/update-work.cjs` renders it into the existing static templates. `content/routes.json` and `sitemap.xml` include the twelve project pages.
- Existing logo, landscape, four navigation items, forms, provider configuration, legal content and privacy choices remain in use.

## Estimate and reporting scope

The only public quantity is **approximately 2,600 identified companies**, explicitly attributed to the founder’s supplied estimate. It is not independently verified and is not a client result. The machine-readable equivalent is `assets/data/prospecting-estimate.json`.

No live CRM figures, contact percentage, follow-up count or meeting count are published. No browser connection to the CRM database was added. The earlier read-only schema audit did not modify CRM data. The owner subsequently chose the estimate-only presentation.

To update the estimate, obtain an owner-approved replacement, retain `approximate` and the correct source/verification status, update JSON and all four translations, regenerate pages, fingerprint assets and run the checks. Do not populate unavailable operational metrics with zero. A future contact percentage needs unique contacted company IDs divided by the same fully reconciled company baseline; call attempts are not unique companies. Follow-up totals must distinguish active schedules from historical actions, and confirmed meetings from completed meetings.

## Visual provenance

- CRM images: genuine frontend source from `Astarkmarkus/O45crm` at `9ab8162d5421886285da9d53a56e30189b3a5a4f`, rendered locally without a database connection. Records and totals withheld. Overview is a cropped interface excerpt; follow-up view is the real empty interface with records withheld. Captions state this limitation. These are not live operational screenshots or results.
- Before website: genuine retained ONYX45 pre-Heritage source in the local `onyx45-facelift` checkout, rendered locally. No reconstructed earlier design.
- After website: actual V3.1 homepage rendered locally. No conversion uplift is claimed.
- WebP assets have 640-pixel alternatives, explicit dimensions, lazy loading and local hosting. No new tracking or third-party frontend dependencies.

## Rollback and validation

Prior published rollback commit: `18934b58f17b39c351a38ee7566426e58dd989ae`. Preserve repository history and use a normal revert if rollback is needed.

Checks: `python3 scripts/verify-static.py`; `NODE_PATH=../tmp/qa/node_modules node scripts/test-work.cjs`; existing `test-contact.cjs`, `test-landscape.cjs`, `test-motion.cjs`. Contact tests mock the provider: no live test enquiry or email-delivery guarantee. Browser QA covers desktop and 390px/320px responsive frames, language switching and project navigation. Deployment is verified separately against GitHub Pages and the public website.

## Homepage simplification — 17 November 2026

Removed the Inside Our Work portfolio section from all four homepages at the owner’s request. The existing project URLs remain valid; their back links now point to the relevant homepage. The renderer no longer recreates the removed section.
