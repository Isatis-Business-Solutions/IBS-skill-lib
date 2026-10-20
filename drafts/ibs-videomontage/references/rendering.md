# Rendering

`scripts/render.mjs` turns a `timeline.json` into an MP4: it extracts the source frames with ffmpeg, draws
every frame with the engine (`engine/`) in headless Chromium, encodes with ffmpeg and mixes the audio (kept
source sound, the SFX in `assets/sfx/`, optional music).

## Requirements
- **ffmpeg** and **ffprobe** on the PATH.
- **Node.js 18+** and the npm package `playwright-core` (or `playwright`) in the folder you run from:
  `npm i playwright-core`. It needs a Chromium: either installed by Playwright (`npx playwright install
  chromium`) or an existing one via `--chromium <path>` or the `CHROMIUM_PATH` environment variable.
- **Poppins** is taken from the `ibs-huisstijl` skill when it is installed next to this one; otherwise a
  fallback font is used and the script warns.
- Installing anything is the user's call: ask before installing packages or a browser.

## Commands
```bash
node <skill>/scripts/render.mjs timeline.json --stills          # contact sheet, one frame per 0.5 s (fast)
node <skill>/scripts/render.mjs timeline.json --draft           # half resolution MP4, to check timing
node <skill>/scripts/render.mjs timeline.json --out clip.mp4    # final, 1080×1920
```
`render.mjs` runs `check.mjs` first and stops on errors (`--force` overrides; only for a reason you
write in `LOG.md`). `--review` makes one large frame per shot and per caption, with a `.txt` of their times.
Always look at the review sheet and the stills before the final render. Before the footage exists:
`node <skill>/scripts/placeholders.mjs production.json` makes placeholder clips, so the whole edit renders as
an animatic. A final render takes roughly 3–5× the clip length.

## Without a computer
In the Claude app (chat) there is no Node or ffmpeg. Write the timeline anyway, show the asset catalog
(`catalog/ibs-edit-library.html`) for the look, and tell the user the render needs Claude Code or a machine
with the requirements above.

## Troubleshooting
- *Missing npm package:* install `playwright-core` in the working folder.
- *Browser not found:* pass `--chromium` with the path of an installed Chrome/Chromium.
- *A transition shows a frozen frame:* the previous shot has too little footage after its out point; move its
  `in` earlier or shorten it.
- *A detection box drifts:* use a larger box around a subject with contrast, or set `track: false`.
- *File too large to share:* re-encode with a higher CRF
  (`ffmpeg -i clip.mp4 -c:v libx264 -crf 24 -c:a copy clip-share.mp4`).
