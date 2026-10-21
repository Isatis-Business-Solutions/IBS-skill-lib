# production.json: the production record

One file per video project holds the whole production, so any agent (storyboard, video generation, montage)
or person can pick it up, redo one shot and continue. It is the **single source of truth**: the storyboard
page, the shot list and the timeline are built from it, never edited by hand.

```text
<project>/
  production.json   brief, skeleton, every shot with its prompts, takes, approval and status
  LOG.md            what changed, when and why (append only, newest at the bottom)
  storyboard.html   built from production.json (scripts/storyboard.mjs)
  frames/           storyboard stills per shot: <id>.png (keyframe) or <id>.jpg (take or graphic)
  gen/              delivered takes, named by shot id: S03.mp4, S03-b.mp4; reference images R1.png
  timeline.json     the edit (ibs-videomontage)
```

## Rules

- Read `production.json` and the end of `LOG.md` first; change only what the request is about.
- After every change: update the record and add one line to `LOG.md`.
- **Shot ids are stable.** A new shot gets the next free id; a removed one gets `status: "dropped"`.
- **Takes are never deleted** from the record; a rejected take keeps its verdict and what went wrong.
- A chosen take is copied to the shot's `file`, so the timeline never changes for a new take.

## Schema

```json
{
  "project": "name", "schema": 2, "updated": "YYYY-MM-DD",
  "brief": { "product": "", "buyer": "", "user": "", "goal": "", "core": "", "cta": "",
             "channel": [], "format": "9:16", "length_s": 60, "footage": "", "proof": [] },
  "skeleton": { "shape": "…", "beats": [ { "n": 1, "name": "Cold open", "phase": "tension", "thinks": "…" } ] },
  "styles": { "STYLE_V1": "style, light, format, audio and avoid block" },
  "refs": [ { "id": "R1", "kind": "image", "title": "", "prompt": "", "file": "gen/R1.png", "status": "todo" } ],
  "shots": [ {
    "id": "S03", "beat": 2, "title": "", "phase": "tension", "source": "gen | combo | code | real",
    "thinks": "what the viewer thinks", "seconds": 3, "caption": { "text": "", "key": "" },
    "size": "ms", "move": "hand", "gen_seconds": 8, "aspect": "9:16",
    "prompt": "", "keyframe_prompt": "", "style": "STYLE_V1", "frames": { "first": "R1", "last": "" },
    "graphic": { "type": "mail" },
    "file": "gen/S03.mp4", "takes": [ { "file": "", "tool": "", "date": "", "verdict": "ok | redo", "note": "" } ],
    "chosen": null, "intake": null,
    "approval": { "status": "pending | approved | changes", "note": "" },
    "status": "planned | approved | generated | chosen | redo | built | dropped", "notes": []
  } ],
  "open": [], "renders": [ { "file": "", "date": "", "kind": "storyboard | animatic | draft | final", "note": "" } ]
}
```

- `phase` comes from the beat; a shot may differ from its beat only with a reason in `notes`.
- `seconds` is the length on screen in the edit; `gen_seconds` the length to generate.
- `source: "code"` shots have `graphic` instead of prompts; `real` shots have `file` and no prompts.
- `intake` is written by `ibs-videomontage/scripts/intake.mjs` when a take arrives (aspect, length, warmth).
