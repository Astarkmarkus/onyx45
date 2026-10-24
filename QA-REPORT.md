# ONYX45 release verification — 23 October 2026

## Passed

- 18 localized pages: six main pages and three policy pages in both English and Swedish.
- One H1, unique IDs, canonical URL, title, description and three language alternates on each localized page.
- Six primary navigation links in consistent order, active page states, matching localized language links, legal links, assets and fragment targets.
- Service request links select the right contact option. The available choices are Paid Advertising, Lead Generation & Appointment Setting, End-to-End Growth Management, and Help Me Choose.
- Flagship service emphasis, a standalone-versus-managed comparison, and complete scope details in both languages.
- Accessible field labels, required-field and email validation, message-length validation, failure retention of entered text, busy state and double-submit lock.
- Form handling with four simulated provider outcomes: confirmed success, provider failure, network failure and a malformed response. Success requires an HTTP success plus a positive provider acknowledgement. No live request was submitted.
- No form submission is attempted while the endpoint is blank. The user sees an honest availability state instead of a false confirmation.
- Both privacy choices, returning-visit behaviour and reopening preferences. No ad, analytics or font requests are included.
- Desktop browser review and mobile menu interaction. Browser widths checked using 320, 390, 768 and 1440 pixel frames; measured document widths did not exceed their available viewport widths after correcting the hero artwork.
- Mobile menu label changes appropriately, and selecting a link closes the menu. Language selection is keyboard-accessible and Escape closes menus.
- Reduced-motion CSS disables transitions and decorative animation.
- Main contrast pairs: primary text/background 17.06:1; secondary text/panel 9.59:1; button text/lime 15.15:1.
- Brand SVGs, transparent PNGs, favicons, Apple Touch Icon and localized social images are included. SVG wordmarks contain outlined letters.
- Editorial helper tested in an isolated temporary copy. No test articles, invented publication dates or fake results are in the release.
- CNAME byte-for-byte preserved as `onyx45.com`. Existing repository history is intact. No custom GitHub Actions workflow existed to replace.
- Former public routes have short noindex redirects to the new site. Sitemap lists the new localized canonical pages; robots points to the correct sitemap.

## Explicit limits and launch tasks

- GitHub push authorization was unavailable: the non-interactive dry run could not obtain a username. The rebuild is locally committed and provided as downloadable files and a Git patch. It has NOT been deployed by this task.
- The backup branch exists locally, with a separately delivered Git bundle. Neither is claimed to have been pushed remotely.
- Formspree must be activated with an owner-verified recipient and public endpoint. Real email/inbox delivery is unverified.
- Legal operator/controller identity, applicable registration/address, privacy contact, retention schedule and jurisdiction-specific policy details still require real owner input. Policy templates do not certify compliance.
- Browser tests used an internal preview and responsive frames, not a physical-device or assistive-technology lab. No independent full WCAG audit, production Lighthouse score or real-user Core Web Vitals measurement is claimed.
- Hosting-level TLS/headers, DNS, email authentication and any Cloudflare automatic injection were not changed or independently certified.


## Refinement — 24 October 2026

- 18 localized pages passed route/asset/fragment, unique ID, heading, canonical and CNAME checks.
- English and Swedish Services now have 20 expandable feature rows each. Programmatic tests covered open/close, animation/reduced-motion paths and rapid toggles. Real browser tests confirmed mouse, Enter and Space activation and mobile interaction.
- Services rendered without document overflow at 320, 375, 430, 768, 1024 and 1440 CSS-pixel frame widths (usable widths exclude the browser scrollbar). All 18 localized pages passed a 320-pixel frame overflow check.
- Real-browser contact validation and email-draft generation passed. The generated mailto recipient is markus@onyx45.com and the draft includes the selected service and entered fields. No message was sent, and inbox delivery is not claimed.
- Optional provider behavior remains tested using mocked success, server failure, network failure and malformed response; failures preserve values and do not show success. Double-submit protection and both privacy choices passed.
- Removed Insights from primary navigation while retaining existing routes. All CTA destinations remain valid. Fixed the English mobile menu's initial accessible label.
- CNAME, robots.txt, sitemap.xml, GitHub Pages infrastructure and existing canonical/hreflang URLs are unchanged. No dependencies or third-party browser scripts were added.
- No framework build, TypeScript or lint configuration exists. JavaScript syntax and the repository's static verifier passed.
- Outstanding owner work: verify the mailbox receives a real test email; provide real operator/controller details and retention/processing facts for the legal templates. Direct in-page delivery requires an activated form backend and corresponding privacy copy update.


## Web3Forms repair — 24 October 2026

This supersedes the earlier email-draft and optional Formspree contact descriptions. See WEB3FORMS-FIX.md for baseline findings, direct submission behavior, response tests and unverified owner dashboard/inbox checks. The existing public Web3Forms key is reused. No real enquiry was sent during implementation.
