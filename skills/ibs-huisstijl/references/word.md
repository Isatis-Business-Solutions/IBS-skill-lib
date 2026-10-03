# Word documents (.docx)

Use a docx skill or library for the mechanics; this file gives the look. Documents are **paper**: use the
light variant.

## Page
- A4, margins 2.5 cm (top 2 cm when there is a header band).
- **Cover / first page:** a full-width dark band (`#171717`) at the top, about 4–6 cm high, with
  `ibs-logo-on-dark.png` (≈ 4 cm wide) and the title in cream Poppins Light. Or, more simply: the logo
  `ibs-logo-on-light.png` top-left and a thin yellow bar (`#F9C852`, 3–4 pt) under the title.
- **Header** (following pages): small `ibs-logo-on-light.png` (≈ 2.5 cm) left, document title in muted right.
- **Footer:** page number right in muted, optional company name left.

## Styles (define them as Word styles, don't format by hand)
| Style | Font | Size | Colour |
|---|---|---|---|
| Title | Poppins Light | 28–32 pt | `#171717` (cream on the dark band) |
| Heading 1 | Poppins Regular | 18–20 pt | `#171717`, with a short yellow bar or yellow square before or below it |
| Heading 2 | Poppins Medium | 13–14 pt | `#171717` |
| Eyebrow / label | Poppins SemiBold | 8–9 pt, caps, spacing +1.5 pt | `#6B665E` |
| Body | Poppins Regular | 10–11 pt, line spacing 1.3–1.4 | `#171717` |
| Quote / callout | Poppins Regular | 11 pt | on a `#FBF7EE` shaded box, left border 3 pt `#F9C852` |

- **Tables:** header row filled `#171717` with cream text, or `#F2EBDA` with dark text. Body rows white with
  light horizontal lines `#E4DCC8`; no vertical lines. Numbers right-aligned.
- **Accent:** yellow only as fills, bars and squares. Text that needs an accent colour: `#8A6A12`.
- **Fonts:** Poppins may not be installed for the reader. Embed fonts when the tool supports it; otherwise
  name Arial as the fallback, so the layout stays close.
