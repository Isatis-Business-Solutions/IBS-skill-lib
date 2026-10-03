---
name: ibs-stockbeeld
description: Visual direction for photos and mood images of IBS – Isatis Business Solutions, wherever you would otherwise use a stock photo — website headers, LinkedIn posts, propositions, presentations, ads. Use when the user asks for a photo, stock image, sfeerbeeld, header image, "plaatje" or "foto" for IBS or "in IBS-stijl", or when an IBS document, page or post needs one. Describes what the image shows and how it feels; making the image is done by an image model (via the image-generator skill if available). Not for infographics, diagrams, charts or icons.
---

# IBS stock images

An IBS image shows **the world of the reader's sector**, in **golden-hour light**, as a realistic, contemporary
photograph with **nature around it** and **a faint echo of yesterday's future**. Calm, warm and recognisable.

## The image, defined

- **Sector** — the field in which the user's data or AI solution is applied, taken from the request. The image
  shows the physical world of that field: the places, infrastructure and objects that people working in it
  recognise as their own. Not the technology: no screens, servers, data visuals, robots or glowing networks.
  If the sector is unclear, ask once.
- **People** — none. The sector itself is the subject.
- **Realistic and contemporary** — a plausible place as it looks today, photographed with the quality of a
  good editorial stock photo. No illustration, no 3D-render look, no fantasy.
- **Golden hour** — low sun near the horizon, long soft shadows, warm yellow-to-orange light. This light sets
  the colour of the whole image.
- **Nature** — the subject sits in a living landscape: vegetation and open land around it, part of the scene,
  not decoration. Nature is shown by what is in the image, never by colour: no green tint or green grading;
  under golden-hour light greens turn warm.
- **Yesterday's future** — exactly one subtle detail in form, material or finish that recalls how the 1970s
  and 1980s imagined the future. Easy to miss, never the subject; the image still reads as today.
- **Calm** — one clear subject, room around it, an uncluttered background. No text, no logos, no
  watermarks in the image.

## How to work

1. Establish the sector from the request.
2. Choose one scene that people in that sector would recognise at a glance.
3. Write the image prompt with every element above, plus what to avoid. Write it in English.
4. Make the image with the `image-generator` skill if it is available. If it is not, give the prompt and leave
   a placeholder where the image goes.
5. Check the result against the list below; if one point clearly fails, regenerate with that point fixed.

## Check

- Would someone from this sector recognise their own world?
- Golden-hour light, warm colour, no green cast?
- Nature visible as part of the scene?
- One faint retro-future detail, no more?
- No people, text, logos, screens or data visuals?
- Calm, with one clear subject?

## Not for

Infographics, diagrams, charts, icons and other explanatory visuals. Build those in the medium itself,
following `ibs-huisstijl` if it is available.
