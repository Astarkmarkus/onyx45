# ONYX45 Orbit V2

The existing static GitHub Pages architecture and onyx WebP are reused.
No new framework, dependency, image download or backend is introduced.

## Source and design
- Shared palette: assets/agency-20261023.css; steel #AAB8C5, powder blue
  #CFE3F1, borders #35404A, original dark surfaces and Signal Lime retained.
- Four localized homepages: new headline and supporting copy, service links,
  primary-service emphasis, CSS/SVG orbit and a pause control.
- Services: Growth & Project Management identified as the primary service;
  individual services remain available; Google Ads/Meta/TikTok context.
- content/orbit.json records all new EN/SV/ES/CA copy.
- Shared script integrates orbit fading with the existing scroll interpolation.
  Invisible desktop orbit links become inert and leave the keyboard path.
- CSS motion is opt-in; pauses offscreen, on hidden documents and via the
  explicit button; focus/hover pauses the ambient visual. No scroll locking.
- Mobile uses static orbital paths and smaller scroll motion. Reduced motion
  and data saving keep content static. No JavaScript leaves all content,
  service links, CTAs and a static visual available.
- Chrome offset-path support animates the small markers; unsupported engines
  retain static markers and functional links.

## Validation
python3 scripts/verify-static.py — 36 localized routes.
scripts/test-contact.cjs with jsdom — 32 mocked provider cases, no live emails.
scripts/test-orbit.cjs with jsdom — 16 localized cases for pause, fade,
reverse scroll, inert links, mobile, reduced motion and data saving.
Browser QA includes representative widths 320/375/1024 and desktop, pause,
keyboard activation, service-anchor navigation and language switching.
Canonical URLs, hreflang, form markup and configuration, privacy controls,
Finnish forest asset and approved founder copy are retained.

No new live enquiry was sent for this visual change. Provider dashboard and
Proton inbox delivery cannot be verified from repository source. The prior
release had an accepted live provider test; that is not an inbox guarantee.
Core Web Vitals have not been field-measured for this release.

Run python3 scripts/version-assets.py after shared CSS or JS changes, and
commit the generated files with the HTML. Old fingerprinted files are retained
for cached pages. No Pages configuration, CNAME, DNS, robots or sitemap change.
