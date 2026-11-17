# Heritage Editorial V3.0 — review before production

## Audit and implementation

The baseline tree matches production commit `63d939b087c88573f382f5f532b7ec8315a753d7` (tree `443002aa829722c0289271fb160a3b0b8a0842cc`). This is a static, buildless multi-page website. Shared CSS, JavaScript, route inventories and existing contact integration were retained. No framework, backend or paid service was introduced.

- Heritage Bordeaux design tokens, editorial system-serif headings, warm surfaces, responsive navigation, buttons and footer across all four existing languages.
- Four main navigation links: Home, Services, About, Contact. Approach and Insights URLs and useful content remain accessible.
- Original generated Finnish-inspired landscape, responsive WebP crops, live HTML typography, reversible scroll fade and a fixed-blur crossfade on desktop. Mobile omits the blur layer; reduced motion and save-data preserve static content. No scroll locking or continuous animation loop.
- Growth & Project Management leads both homepage and Services; original service IDs and proposal query values remain stable.
- Existing service detail accordions, process, hybrid delivery, founder story, Sisu and grandfather narrative preserved.
- No unsolicited preference popup. The footer opens the existing privacy controls on request. Optional language persistence remains controlled by that choice.
- Form validation, honeypots, endpoint, public key, receiver configuration and submission feedback preserved. No enquiry persistence, analytics or submission logging was added.
- All four localized Legal Notice routes have a readable layout and verified contact details. They remain incomplete pending the operator information below. No placeholder entity details were inserted.
- Privacy wording acknowledges provider storage and links to its current policy. Existing canonical/hreflang metadata and domain preserved; legal routes added to sitemap.
- Favicon and social cards use the new palette. No external font requests are needed: Georgia/system serif and Inter/system sans fallbacks.

## Production blockers — business facts, not implementation choices

1. [LEGAL REVIEW REQUIRED: REGISTERED OPERATOR] Confirm the legal controller/operator name and whether ONYX45 is a trading name. Supply applicable registration/tax information, service address and privacy contact. Add verified facts to the Legal Notice and Privacy Policy in all languages.
2. [LEGAL REVIEW REQUIRED: RETENTION POLICY] Confirm the actual Web3Forms plan/retention setting, mailbox retention, any onward CRM or other storage, and who handles deletion. A provider maximum is not ONYX45’s own retention policy.
3. Verify enabled provider spam processors/integrations, applicable DPA and transfer safeguards against the real account; the repository cannot establish dashboard settings.
4. Confirm actual receipt in the intended mailbox. Frontend mocks do not verify delivery. No additional real email was sent in this change.

Do not merge this branch into the GitHub Pages publishing branch until these items are resolved and reviewed. No DNS, email routing or Cloudflare account configuration was changed.

## Processing flow and deletion review

Visitor → direct HTTPS request to Web3Forms → provider processing/storage and notification → configured recipient mailbox → any owner-managed onward storage. The static frontend does not itself copy submissions to CRM. Verify any provider-side integration separately.

To fulfil deletion requests, locate the relevant submission in the provider account, remove the corresponding mailbox messages and trash, and delete any onward CRM/export copy where applicable. Verify account-specific provider deletion and backup behavior before promising a deadline. Confirm real retention settings and document the responsible person.

## Current sources reviewed on 17 November 2026

- https://web3forms.com/privacy — provider describes submission storage, spam services, international processing and retention. The old FAQ’s no-storage claim conflicts with this newer policy; do not rely on the older FAQ.
- https://web3forms.com/dpa — provider publishes its controller/processor terms, deletion framework, subprocessors and transfer terms. Actual account acceptance/configuration has not been verified.
- https://www.imy.se/en/frequently-asked-questions/how-long-can-we-keep-personal-data/ — retain data only as long as necessary for its purposes.

## Validation

- `python3 scripts/verify-static.py`: 40 localized pages, routes, assets, anchors, IDs, H1, canonical and CNAME checks pass.
- `NODE_PATH=<maintainer jsdom path> node scripts/test-contact.cjs`: 32 mocked localized provider-response cases, plus validation, honeypots and missing configuration pass. No live submissions.
- `NODE_PATH=<maintainer jsdom path> node scripts/test-landscape.cjs`: 16 localized desktop/mobile/reduced-motion/save-data scenarios, reverse scroll, navigation and primary service order pass.
- Browser QA uses the local preview. Mobile/tablet layouts are rendered inside fixed-width same-origin frames; this checks responsive CSS, not physical iOS/Android devices.
- Observed desktop homepage width 1348px and mobile content width 375px without horizontal overflow. Home, Services, About and Contact checked at the mobile width; tablet homepage checked at 805px content width. Mobile menu, service accordion, equivalent-page Swedish language switch, invalid-form feedback and reverse scrolling were exercised. The old dark mobile menu background was corrected after observation.

Not claimed: complete legal compliance, inbox delivery, measured production Core Web Vitals, Cloudflare header enforcement, or universal browser/device compatibility.
