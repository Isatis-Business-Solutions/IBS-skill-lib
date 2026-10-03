# HTML e-mail

E-mail clients are limited, so keep it simple and robust:
- **Table-based layout**, max width 600px, all CSS **inline**. No external CSS, no web fonts guaranteed.
  Font stack: `Poppins, 'Segoe UI', Helvetica, Arial, sans-serif`.
- **Logo as PNG** (`assets/logo/ibs-logo-on-dark-600.png`, shown at ≈ 140–180px wide), with `alt="IBS"`,
  hosted at a public URL or attached inline (CID). SVG does not work in many clients.
- Structure:
  1. **Dark header band** (`#171717`) with the logo.
  2. **Body on a light background** (`#FFFFFF` or `#FBF7EE`), text `#171717`, for readability in all clients
     and in dark mode.
  3. **Optional key block:** a card in `#FBF7EE` with a big number or the main message.
  4. **Button:** "bulletproof" (a table cell with background `#F9C852`, text `#171717`, radius 16px,
     padding 14px 24px).
  5. **Footer band** `#171717` with cream/muted small text: company name, contact details, unsubscribe if
     relevant.
- Headings Light/Regular 24–28px, body 15–16px, line height 1.5.
- Test mentally for dark mode: dark bands stay dark, the light body may invert. Avoid text inside images.
