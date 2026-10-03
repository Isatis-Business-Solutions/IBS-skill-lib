# PDF

A PDF is usually one of two kinds:

1. **Document-like** (report, proposal, invoice, manual): follow `word.md`. Light paper, dark header band,
   Poppins, yellow only as fills and bars, gold `#8A6A12` for accent text.
2. **Presentation-like** (deck export, one-pager, flyer): follow `html-pages-and-presentations.md` or
   `powerpoint.md`. Dark pages are fine on screen; when the user is likely to print, offer the light variant.

Tips:
- Generating from HTML (e.g. a headless browser): use the tokens and the light class; set `@page` margins
  and `print-color-adjust: exact` so the dark band prints.
- **Embed Poppins** (TTFs in `assets/fonts/` are OFL, embedding allowed). Use SVG logos for sharpness.
- Add document metadata: title, author "IBS – Isatis Business Solutions".
