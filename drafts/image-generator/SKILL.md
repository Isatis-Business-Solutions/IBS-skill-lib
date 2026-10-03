---
name: image-generator
description: Generate images (photos, illustrations, visuals) with an AI image model the user already has access to, via the OpenAI Codex CLI, with the OpenAI API as alternative. Use whenever the user asks to make, generate or create an image, picture, photo, visual or illustration — "maak een plaatje", "genereer een afbeelding", "beeld maken", "foto genereren", "image generation" — or when a document, page, deck or post needs a generated image. Handles the one-time setup, and falls back to a ready-to-use prompt plus placeholder when no image model is available.
---

# Image generator

This skill handles **how** an image gets made. **What** the image shows comes from the user's request and from
any other skills loaded for the same task (for example a house style).

## 1. Find a ready route (always; quick)

Check in this order and stop at the first that works:

1. `codex login status` reports logged in → read `routes/codex-cli.md`.
2. The environment variable `OPENAI_API_KEY` exists (check that it is set; never print it) →
   read `routes/openai-api.md`.
3. Neither → read `setup.md` and go through it with the user. Once set up, this step finds the route by
   itself next time and `setup.md` is not needed again.

## 2. Write the image prompt

- Describe subject, setting, light, composition, style and mood, plus what to avoid.
- Take over every constraint from the request and from other loaded skills.
- Add nothing the request does not imply: no extra people, objects, brands, logos or text.
- Write the prompt in English; image models follow English best.

## 3. Generate, check, deliver

- Generate one image per call; variants are separate calls.
- Save the image in the folder the user is working in, unless they name another place. Never overwrite an
  existing file; add a version suffix instead.
- Look at the result and compare it with the request. If it is clearly off, retry once with one targeted
  change.
- Report the saved path, the final prompt and the route used.

## When it fails

- **Not logged in, invalid key:** go to `setup.md`.
- **Usage limit reached:** say so plainly. Offer the other route (mention its cost, see `setup.md`) or the
  fallback.
- **Network blocked** (sandboxed or cloud environments): name the domains that must be allowed —
  `chatgpt.com` and `auth.openai.com` for the Codex CLI, `api.openai.com` for the API.
- **No route possible:** read `fallback.md`.
