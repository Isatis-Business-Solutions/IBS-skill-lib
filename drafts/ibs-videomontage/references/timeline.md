# timeline.json

One JSON file describes the whole edit. Paths are relative to the file. Times are seconds; the renderer works
in frames (24 fps).

```json
{
  "format": { "aspect": "9:16", "fps": 24 },
  "sources": {
    "talk": "footage/interview.mp4",
    "game": { "file": "footage/game.mp4", "focusX": 0.35 }
  },
  "brand": { "intro": null, "outro": "assemble" },
  "audio": { "sfx": true, "music": null, "musicGain": 0.18 },
  "shots": [
    { "src": "game", "in": 0.3, "dur": 0.6, "role": "B", "look": "edges" },
    { "src": "game", "in": 2.0, "dur": 0.7, "role": "B", "look": "halftone", "transition": { "type": "fxflash", "look": "edges" } },
    { "src": "talk", "in": 4.0, "dur": 5.0, "role": "A", "zoom": [1, 1.06], "transition": { "type": "doublewipe" } }
  ],
  "overlays": [
    { "type": "riser", "at": 0, "dur": 1.3 },
    { "type": "captions", "at": 0.1, "dur": 1.2, "text": "Hook line here", "key": "Hook" },
    { "type": "glass", "at": 5.5, "dur": 2.4, "eyebrow": "Label", "title": "Number", "sub": "short line" },
    { "type": "detect", "at": 7.0, "dur": 1.5, "items": [ { "label": "label", "conf": 0.98, "box": [0.3, 0.3, 0.25, 0.2], "track": true } ] }
  ]
}
```

## Fields
- **format** · `aspect` `"9:16"` (default, the layouts are tuned for it), `"16:9"` or `"1:1"`; optional
  `width`/`height` (default 1080 wide for vertical, 1920 for horizontal); `fps` 24.
- **sources** · id → file, or `{ file, focusX, focusY, fallback }`: where the crop sits when the footage is
  reframed (0 = left/top, 0.5 = centre, 1 = right/bottom); `fallback` is used while `file` does not exist yet
  (a placeholder, see `production.md`).
- **brand** · `intro` / `outro`: `"assemble"` or `null`.
- **grade** · colour grade on all footage (not on graphic shots): `"golden"` or `{ "type": "golden", "amt": 0.6 }`;
  a shot can opt out with `grade: false` or set its own.
- **audio** · `sfx` (hits, whooshes, risers; default on), `music` (a file; it is faded out at the end) and
  `musicGain`.
- **shots** · played in order. `src`, `in` (start in the source, s), `dur` (s), `role` `"A"` or `"B"`.
  `phase` `"tension"` or `"release"` (the beat it belongs to; `check.mjs` applies the rules per phase;
  graphic shots default to release).
  A graphic shot has `graphic: { type, …options }` instead of `src`/`in` (see `assets.md`).
  Optional: `look`, `lookAmt` (0–1), `zoom` `[from, to]`, `audio` (keep the source sound; default true for
  A-roll, false for B-roll), `gain`, `transition` (`{ type, look, frames, params }`, into this shot).
- **overlays** · `type` `captions` | `detect` | `glass` | `orb` | `riser`, `at` and `dur` in seconds from the start
  of the clip; fields per type in `assets.md`.

Transitions take their frames from the start of the shot they lead into; the double wipe also keeps playing
the previous shot beyond its out point. Overlays are drawn on top of whatever is on screen, so time them
inside the right shot.
