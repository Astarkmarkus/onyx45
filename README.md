# ONYX45 — Growth. Managed.

Premium static B2B agency website, with complete English and Swedish HTML pages. No framework, package install or production build is required. Hosting remains GitHub Pages at https://onyx45.com/.

## Contact enquiries

The owner-supplied contact details are **markus@onyx45.com** and **+34 673 081 311**. They appear on the contact page; the email is also in every footer.

With no external backend configured, the form validates the enquiry and prepares an email draft. The visitor opens the draft in their email app and sends it themselves. They can also copy the full enquiry or use the direct email/telephone links. Preparing a draft is never presented as a sent enquiry. No inbox delivery has been tested or claimed.

An optional Formspree backend remains supported. To activate direct submissions, create and verify a form in Formspree, place the public HTTPS endpoint in `assets/site-config.js`, configure provider spam settings and confirm real delivery to the intended inbox with an owner test. Provider errors keep entered information; success appears only after an affirmative provider response. Development tests use mocked provider responses only. Update the bilingual privacy notice to reflect actual processing before enabling a backend.

## Before production launch

Read `LAUNCH-CHECKLIST.md`. Supply the real legal operator/controller name, applicable registration details, service address, verified privacy contact, actual retention schedule, vendor/transfer arrangements and any required legal disclosures. Update both language versions. The legal pages are templates, not a completed compliance review. Empty operator fields in the configuration are internal reminders and are never inserted as public placeholder text.

The owner supplied the contact email and phone. No founder name, team size, credentials, office, client results or testimonial is invented. The About page reserves a future founder profile through documented placement, without a public empty component.

## Upload without coding

1. Download and extract the website ZIP.
2. Open the extracted folder. Its contents should include `index.html`, `assets`, `services`, `sv` and `CNAME`.
3. Open the main file list in https://github.com/Astarkmarkus/onyx45.
4. Click **Add file → Upload files**.
5. Drag the **contents** of the extracted folder into GitHub. Do not drag the enclosing folder or the ZIP itself. The homepage must be `index.html`, not `some-folder/index.html`.
6. Commit to the existing `main` publishing branch. If a pull request is required, merge it normally.
7. Let the existing `pages-build-deployment` run finish. Visit https://onyx45.com/ and https://onyx45.com/sv/.

Keep the existing Pages source, domain and DNS settings. The `CNAME` file is unchanged, and there is no replacement Actions workflow. `.nojekyll` makes the already-rendered static files suitable for branch-based Pages publishing.

Web upload replaces matching files but does not remove old files. The supplied new files include clean redirects for former public routes. For the full cleanup, apply the supplied Git patch in a checkout or ask the maintainer to do so. Never force-push or delete repository history.

GitHub's official guide: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## Navigation and language URLs

English: `/`, `/services/`, `/approach/`, `/about/`, `/insights/`, `/contact/`.
Swedish: `/sv/`, `/sv/tjanster/`, `/sv/arbetssatt/`, `/sv/om-oss/`, `/sv/insikter/`, `/sv/kontakt/`.

Privacy, cookies and website terms have matching language versions. The selector opens the matching localized page, and all navigation stays in the selected language. When the visitor chooses necessary preferences, that language is remembered; a later direct visit to the default homepage can follow the saved Swedish preference. Choosing not to save language keeps the explicit language URLs working without storing a language preference.

## Maintain content

Edit the rendered HTML directly or ask the maintainer for changes. `content/ui-copy.json` and `content/routes.json` provide a copy inventory and route reference; editing them alone does not rebuild HTML. There is intentionally no hidden production build process.

The three services are Paid Advertising, Lead Generation & Appointment Setting, and flagship End-to-End Growth Management. Advertising spend is separate from management fees; scopes and commitments belong in the client agreement.

Insights is hidden from primary navigation until genuine articles are available. Its existing URLs remain valid. No articles are published yet. `templates/article-input.example.json` and `scripts/new-article.py` provide a reusable bilingual article flow. Supply real approved content, titles, author only when verified, and the actual publication date. Run the helper only when ready to publish; it adds localized article files, insights cards and sitemap entries. Do not publish the example as an article.

## Brand assets

`assets/brand/` contains vector wordmarks (outlined lettering), symbols, transparent PNGs, favicon SVG/PNG/ICO, Apple Touch Icon and English/Swedish sharing images. “Dark” is for dark backgrounds; “light” is for light backgrounds. Details and concept-generation prompt are in `assets/brand/brand-notes.md`.

## Privacy and security

No analytics, pixels, remote font requests or other third-party browser resources are loaded by this implementation. The current email-draft flow sends no enquiry contents from the website. If an owner-configured Formspree endpoint is enabled, submissions go there only after submission. No API secret is present. Form contents are not saved in browser storage. Necessary preference storage can be changed from the footer.

The CSP limits resources to the site and submissions to Formspree. GitHub Pages HTTP security headers, TLS, DNS, registrar and Cloudflare account settings are outside this static repository. If Cloudflare automatically injects analytics or other code, inspect and configure that separately; this build does not silently change those account settings.

## Recovery

Original source commit: `13d1df35f7e2e1ff93fae68ea8ac70ef4b7cb56d`.
Local recovery branch: `backup/pre-agency-2026-10-23`.
A separate Git bundle of the original history is delivered. A normal revert can also restore the old site without rewriting history.

## Service accordions

Each inclusion row on both Services pages is an accessible button with `aria-expanded` and `aria-controls`. Native button behavior supports Enter/Space. Panels animate their height, support multiple open items and respect reduced motion. Campaign platforms are secondary content within Paid Advertising, rather than separate services. New platform cards can be added to `.platform-grid` without changing navigation.

Validation: run `python3 scripts/verify-static.py`. This project has no framework build, type-check or lint commands.
