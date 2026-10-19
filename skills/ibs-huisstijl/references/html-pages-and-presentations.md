# HTML pages, one-pagers and HTML presentations

Self-contained files: inline the CSS from `assets/tokens/tokens.css`. Load Poppins from Google Fonts
(`family=Poppins:wght@300;400;500;600;700`) or embed the TTFs as base64 when the file must work offline.
Logo: inline the SVG from `assets/logo/ibs-logo-on-dark.svg` (no external file references).

## Page / one-pager
- Dark background with `.ibs-glow` (optionally with `.ibs-pattern`) behind the hero; content max-width ≈ 1100px.
- Structure:
  1. Logo top-left.
  2. Eyebrow label.
  3. Big light heading.
  4. One short intro line in muted text.
  5. Content in cards (radius 24px) on a simple grid.
- One primary call to action (yellow button). The rest is secondary.
- Works at phone width: one column, 16px side margins, no horizontal scroll.

## Presentation (HTML slides)
- 16:9 slides, dark. Each slide has one message: eyebrow + heading + at most ~5 short points, or one big
  number, or one visual.
- **Title slide:** logo (larger), eyebrow with date or occasion, big light title, amber glow.
- **Section slide:** large heading with the divider (thin double line, small IBS mark in the middle; inline
  `ibs-mark.svg`).
- **Content slide:** heading top-left, logo mark small bottom-right, slide number bottom-left in muted.
- **Number slide:** one huge figure in yellow (SemiBold), label underneath in muted.
- **Closing slide:** short thank-you or next step, contact details, full logo.
- Navigation: arrow keys / click; also a print stylesheet (one slide per page) so it exports to PDF.
- Keep text ≥ 24px on slides; headings 44–64px Light.
