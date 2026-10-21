# Software, apps, websites, dashboards

**Default theme: dark.** Offer a light theme only if the product needs it (e.g. print views).

## Setup
- Copy `assets/tokens/tokens.css` and `assets/fonts/` into the project, or use `tokens.json` /
  `tailwind.preset.js`. Use the variables; do not hard-code hex values all over the code.
- Native apps (Android, iOS, desktop): map the same tokens to the platform theme. For example, Material:
  `primary = #F9C852`, `onPrimary = #171717`, `background = #171717`, `surface = #232323`,
  `onSurface = #FEF9ED`.
- Favicon / app icon: `assets/logo/favicon-32.png`, `icon-512-on-dark.png`, `ibs-mark.svg`.

## Layout
- 8px spacing grid. Generous padding: cards 20–24px, page margins ≥ 16px on mobile, 32–64px on desktop.
- Cards: `--ibs-surface`, radius 24px, no border, no shadow. Raised elements and inputs: `--ibs-surface-high`.
- Headings: Poppins Light/Regular, large (h1 40–56px, h2 28–32px). Body 16px. Eyebrow labels 12px,
  uppercase, 0.15em tracking, muted.
- Numbers (KPIs, prices, totals): SemiBold, tabular figures (`font-variant-numeric: tabular-nums`).

## Components
- **Primary button:** filled `--ibs-accent`, text `--ibs-on-accent`, radius 16px, min height 44–48px.
  One per view.
- **Secondary button:** transparent with 2px cream outline, cream text, optional `›`.
- **Links:** yellow text, no underline until hover.
- **Inputs:** `--ibs-surface-high`, radius 12px, cream text; focus ring 2px yellow.
- **Navigation:** dark surface; the active item gets yellow (filled pill or indicator).
- **Tables:** no vertical lines; rows separated by space or a very subtle line (`--ibs-line`); header row in
  eyebrow style.
- **Charts:** series order from `SKILL.md`; gridlines very subtle; first series yellow.
- **Status:** positive `#7FB77E`, negative `#D9725B`, info `#8FB3D9`. Never yellow for warnings (it is the
  brand accent).
- **AI states:** wherever an AI assistant or agent works, listens or answers, show the `thinking-orbs` orb
  (npm `thinking-orbs`, MIT; `<ThinkingOrb state="…" />`, or its framework-free `thinking-orbs/engine`) with
  the ink tinted IBS-yellow. Never a robot, a face or a glowing brain.

## Feel
- Hero sections may use `.ibs-glow` (amber glow top-right), optionally with `.ibs-pattern`.
- Motion: subtle and quick (150–250 ms ease-out). No bouncing.
- Accessibility: keep the AA pairs from `SKILL.md`, visible focus states, tap targets ≥ 44px.
