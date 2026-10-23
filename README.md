# ONYX45 — Growth. Managed.

Premium static B2B agency website, with complete English and Swedish HTML pages. No framework, package install or production build is required. Hosting remains GitHub Pages at https://onyx45.com/.

## Before collecting leads

1. Create a Formspree account and verify the recipient email address. Create a form and copy its public endpoint from the Integration section.
2. Set `formEndpoint` in `assets/site-config.js` to that exact HTTPS endpoint. This is a public form ID, not a secret. If you prefer, send the endpoint to the website maintainer to configure it for you.
3. Verify the form is active and configure Formspree's spam protection, allowed domain and account settings. Keep the built-in `_gotcha` honeypot.
4. Submit one real test yourself and confirm it appears in the Formspree dashboard and reaches the intended inbox. Check both languages and a failed submission.
5. The form remains disabled with an honest availability message until a valid endpoint is configured. It never shows a false success state. The supplied tests simulate provider responses; they do not prove inbox delivery.

Official setup: https://help.formspree.io/articles/building-your-form/building-an-html-form/

## Before production launch

Read `LAUNCH-CHECKLIST.md`. Supply the real legal operator/controller name, applicable registration details, service address, verified privacy contact, actual retention schedule, vendor/transfer arrangements and any required legal disclosures. Update both language versions. The legal pages are templates, not a completed compliance review. Empty operator fields in the configuration are internal reminders and are never inserted as public placeholder text.

No unverified email address, founder name, team size, credentials, office, client results or testimonial is published. The About page reserves a future founder profile through documented placement, without a public empty component.

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

No articles are published yet. `templates/article-input.example.json` and `scripts/new-article.py` provide a reusable bilingual article flow. Supply real approved content, titles, author only when verified, and the actual publication date. Run the helper only when ready to publish; it adds localized article files, insights cards and sitemap entries. Do not publish the example as an article.

## Brand assets

`assets/brand/` contains vector wordmarks (outlined lettering), symbols, transparent PNGs, favicon SVG/PNG/ICO, Apple Touch Icon and English/Swedish sharing images. “Dark” is for dark backgrounds; “light” is for light backgrounds. Details and concept-generation prompt are in `assets/brand/brand-notes.md`.

## Privacy and security

No analytics, pixels, remote font requests or other third-party browser resources are loaded by this implementation. Form submissions go to Formspree only after submission. No API secret is present. Form contents are not saved in browser storage. Necessary preference storage can be changed from the footer.

The CSP limits resources to the site and submissions to Formspree. GitHub Pages HTTP security headers, TLS, DNS, registrar and Cloudflare account settings are outside this static repository. If Cloudflare automatically injects analytics or other code, inspect and configure that separately; this build does not silently change those account settings.

## Recovery

Original source commit: `13d1df35f7e2e1ff93fae68ea8ac70ef4b7cb56d`.
Local recovery branch: `backup/pre-agency-2026-10-23`.
A separate Git bundle of the original history is delivered. A normal revert can also restore the old site without rewriting history.
