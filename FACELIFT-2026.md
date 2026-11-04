# ONYX45 facelift — November 2026

The five main pages have an editorial consultancy layout in English, Swedish,
Spanish and Catalan. The homepage presents three capabilities, the opportunity
workflow, standalone and coordinated engagements, the delivery timeline and a
pilot section. Service anchors, proposal prefills and accordions are retained.
The short founder story and Finnish forest are unchanged.

The homepage artwork is `assets/artwork/onyx-stone.webp` (about 61 kB).
Built-in image generation brief: photorealistic premium editorial studio
packshot of one isolated polished black onyx palm stone, irregular refined
shape and subtle mineral bands, silver studio reflections, very faint muted
lime grazing light, transparent background, no text or technology effects.
The shared script applies interpolated perspective transforms to the image
with requestAnimationFrame, limited to the visible story. There is no scroll
locking or external graphics library. Mobile uses a smaller rotation; reduced
motion, data saving, and no JavaScript leave the picture and text static.

Source files: `assets/agency-20261023.css` and
`assets/agency-20261023.js`. After editing them, run
`python3 scripts/version-assets.py`. The rendered HTML is the deployment
source; `content/facelift.json` records the localized facelift copy.

QA: `python3 scripts/verify-static.py` covers 36 localized pages.
`scripts/test-contact.cjs` covers 32 mocked Web3Forms cases. Compared SEO,
language links, footer, cookie controls, contact form and founder content to
the prior release. Verified reversible motion and reduced-motion behavior
in automated tests, and representative mobile/desktop layouts, keyboard
menu, accordions and language switching in Chrome.
