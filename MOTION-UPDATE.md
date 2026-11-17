# Language menu and fluid motion — 17 November 2026

- Removed the old hardcoded green selected-language background; active, hover and keyboard-focus states now use the Heritage palette with readable text.
- Native same-origin cross-document view transitions fade between pages and keep the header stable. Unsupported browsers retain normal navigation. No links are intercepted or delayed.
- The landscape scroll visual eases towards scroll progress and stops requesting frames when settled or offscreen. Reverse scrolling and static reduced-motion/save-data behavior are preserved.
- Sections animate once when they enter the viewport. Content is visible by default, remains available without the observer, and immediately stops animating when focused or reduced motion is enabled. Mobile uses shorter motion.
- The language dropdown and link arrows have restrained interaction animation.

Validation: 40 localized route/static checks, 16 landscape scenarios, 16 reveal/fallback scenarios and 32 mocked contact-response cases pass. Preview browser checks confirmed selected-language colors, English-to-Swedish navigation, a rendered cross-document transition, ArrowDown/Escape controls and a 375px mobile layout without overflow. No form messages were sent.
