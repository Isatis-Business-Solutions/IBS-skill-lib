---
name: ibs-huisstijl
description: House style (huisstijl) of IBS – Isatis Business Solutions. Use whenever you create or restyle anything for IBS or that should look like IBS — software UIs, websites, HTML pages, HTML presentations, HTML e-mails, Word documents, PowerPoint decks, PDFs, Excel workbooks, charts — or when the user mentions IBS, Isatis, "huisstijl", "in IBS-stijl", the IBS logo or IBS colours. Gives the brand feel, colours, typography, logo rules and per-medium guidance, plus ready assets (logo SVG/PNG, Poppins fonts, CSS/JSON/Tailwind tokens).
---

# IBS house style

IBS (Isatis Business Solutions) looks **dark, warm and calm**: a near-black canvas, one warm yellow accent,
cream text, big light headings and lots of space. Think premium and quiet, not loud tech. Apply this feel to
whatever you make; the rules below are deliberately general so they fit every medium.

**This skill covers the look.** For wording and tone, use the `ibs-schrijfstijl` skill if it is available.
If it is not, write clear, friendly, professional text in the user's language.

## The essentials (always)

1. **One accent: IBS yellow `#F9C852`.** Use it sparingly: the primary action, a key number, a highlight
   line, the logo. Never as a large background behind long text, and never as text colour on white.
2. **Dark by default:** background `#171717`, cards `#232323`, raised elements `#3A3A3A`, text cream
   `#FEF9ED` (not pure white), secondary text `#9A958C`.
3. **Light ("paper") variant** for things that get printed or read on white: Word, PDF, Excel and long
   reports. White page, near-black text `#171717`, warm neutral surfaces `#FBF7EE`, and yellow only as fills,
   bars and accents. When yellow-ish text is needed on white, use the darker gold `#8A6A12`. Give paper
   documents a **dark header band** (`#171717`) with the logo for the IBS feel.
4. **Typography: Poppins.**
   - Headings large and **Light (300) or Regular (400)**, never heavy.
   - Body Regular (400).
   - **Numbers and key figures SemiBold (600).**
   - Small labels in **UPPERCASE, SemiBold, letter-spacing 0.15em**, muted colour. The "eyebrow" above a
     heading.
   - Fallback when Poppins is not available: Segoe UI, Helvetica Neue, Arial.
5. **Shapes:** generous rounded corners (cards 24px, buttons 16px, inputs 12px), no heavy borders, no drop
   shadows. Separate with space and surface colour, not with lines.
6. **Logo:** the mark (four yellow tilted planes forming a square) plus "IBS" in cream. See *Logo* below.

## Colour tokens

| Role | Dark (default) | Light / paper |
|---|---|---|
| Background | `#171717` | `#FFFFFF` |
| Surface (cards) | `#232323` | `#FBF7EE` |
| Surface high | `#3A3A3A` | `#F2EBDA` |
| Text | `#FEF9ED` | `#171717` |
| Text muted | `#9A958C` | `#6B665E` |
| Lines (rarely) | `#3A3A3A` | `#E4DCC8` |
| Accent | `#F9C852` | `#F9C852` (fills) · `#8A6A12` (text) |
| On accent | `#171717` | `#171717` |
| Positive / negative / info | `#7FB77E` / `#D9725B` / `#8FB3D9` | same |
| Glow (dark only) | `#613F0F` | – |

**Chart series, in this order:** `#F9C852`, `#FEF9ED` (on dark) or `#171717` (on light), `#C9A24A`,
`#7FB77E`, `#8FB3D9`, `#D9725B`, `#9A958C`. The first series is the one that matters; keep the others calm.

All listed text/background pairs meet WCAG AA. Yellow on white does **not** (1.6:1), so never use it for text
on light backgrounds.

## Signature touches (pick one or two, not all)

- **Amber glow:** a soft radial gradient of `#613F0F` from the top-right corner on the dark background
  (`.ibs-glow` in `tokens.css`).
- **Eyebrow label** above headings: `SMALL CAPS LABEL` in muted, tracked capitals.
- **Divider:** a thin double line with a small yellow square in the middle (the logo idea, minimal).
- **Buttons:** primary = filled yellow with dark text; secondary = outlined in cream (2px), dark fill, with a
  `›` chevron; tertiary = yellow text link.
- **Icons:** thin line icons (≈2px stroke) in cream, optionally inside a rounded-square outline.
- **Big numbers:** key figures large, SemiBold, in yellow or cream, with a small muted label underneath.

## Logo

Files are in `assets/logo/`:

| File | Use |
|---|---|
| `ibs-logo-on-dark.svg` / `.png` | **Default.** Full logo for dark backgrounds (yellow mark, cream "IBS") |
| `ibs-logo-on-light.svg` / `.png` | Full logo for white/light backgrounds (yellow mark, dark "IBS") |
| `ibs-logo-white.*`, `ibs-logo-black.*` | One-colour versions (on photos, faxes, embossing, single-colour print) |
| `ibs-mark.svg`, `ibs-mark-1024.png`, `ibs-mark-256.png` | Mark only: avatars, app icons, small spaces, watermarks |
| `ibs-mark-white.svg`, `ibs-mark-black.svg` | One-colour mark |
| `favicon-32.png`, `icon-512-on-dark.png` | Favicon, app/launcher icon |
| `*-600.png` | Lightweight PNGs for e-mail and documents |

Rules:
- Keep clear space around the logo of at least **the height of the "I"**.
- Minimum size: full logo **24 px / 8 mm** high; below that use the mark only.
- Never stretch, recolour (except the one-colour versions), rotate further, outline or add effects.
- Prefer **SVG** in software and HTML; use **PNG** in Word, PowerPoint, Excel and e-mail.
- Placement: top-left in documents and pages; bottom-left or bottom-right on slides; centred only on title
  and cover pages.

## Assets

- `assets/logo/`: see above.
- `assets/fonts/`: Poppins Light, Regular, Medium, SemiBold, Bold (`.ttf`) + `OFL.txt` (free to use and
  embed).
- `assets/tokens/tokens.css`: CSS variables, `@font-face` rules, the light variant (`.ibs-light`) and
  `.ibs-glow`.
- `assets/tokens/tokens.json`: the same values for any code or tool.
- `assets/tokens/tailwind.preset.js`: Tailwind preset.

Copy the assets you need **into the output or project**. Do not link to this skill folder from a deliverable.

## Per medium

Read the matching reference **before** building:

| Making… | Read |
|---|---|
| Software, apps, websites, dashboards | `references/software-web.md` |
| An HTML page, one-pager or HTML presentation | `references/html-pages-and-presentations.md` |
| An HTML e-mail | `references/html-email.md` |
| A Word document | `references/word.md` |
| A PowerPoint deck | `references/powerpoint.md` |
| A PDF | `references/pdf.md` |
| An Excel workbook | `references/excel.md` |

If another skill handles the file format (e.g. a docx, pptx, xlsx or pdf skill), use that skill for the
mechanics and this skill for the look.

## Quick check before you deliver

- [ ] One accent colour, used sparingly; no yellow text on white.
- [ ] Poppins (or the fallback), light headings, SemiBold numbers, tracked uppercase labels.
- [ ] Dark for screens, paper variant for print-like documents (with a dark header band).
- [ ] Logo present, right variant for the background, clear space respected.
- [ ] Rounded corners, space instead of lines, no shadows or gradients except the amber glow.
- [ ] Calm: if it looks busy, remove something.
