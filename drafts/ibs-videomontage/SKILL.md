---
name: ibs-videomontage
description: Edit (montage) a complete short video clip in the IBS – Isatis Business Solutions video signature from footage the user already has — pick the right signature assets (transitions, FX flash, captions, object-detection callouts, glass cards, logo moments), shape the story around tension and release, write the edit as a timeline and render it to MP4. Use whenever the user asks to edit, cut, assemble or "monteren" a video, clip, reel, short or social video for IBS or "in IBS-stijl" — "video monteren", "montage", "maak een clip van deze beelden", "edit this video", "video editing", "reel", "short" — or asks which transition, effect, caption or callout fits an IBS video. Not for generating footage with AI video models and not for storyboarding a video from nothing (separate skills); if footage is missing, say what is needed.
---

# IBS videomontage

Turn the user's footage into a finished clip in the IBS video signature: a timeline (`timeline.json`) that
names shots, transitions and overlays, rendered to MP4 by the bundled engine. Every signature asset is code,
so the same timeline renders exactly the same every time.

**This skill edits; it does not generate or storyboard.** Footage comes from the user (filmed, stock or made
with another tool). When a storyboard or shot list exists (for example from a future IBS storyboard skill),
follow it; otherwise do the light story design in `references/story.md` yourself.

## Before you start

You need: the footage files, the one thing the viewer must remember, the platform and aspect (default 9:16),
a target length, and the spoken text if there are captions. Look first, ask second: decide what you can from
the footage and the request, and ask at most three questions about the rest.

**When the story itself is not clear yet** (what the product is, who watches, who uses it, what the viewer
does afterwards), plan it first with the `ibs-storyboard` skill, which grills the story and makes the shot
list; without it, grill the user yourself, one question at a time, until you can say the goal sentence, the
audience, the product in one line and the core message. A vague story cannot be fixed in the edit.

## Workflow

0. **Keep the production record.** Every project has a folder with `production.json` and `LOG.md`
   (`references/production.md`). Read them first when they exist; update them after every change, so another
   agent can redo one shot or one edit later.
1. **Intake, then look at the footage.** When takes arrive, run `scripts/intake.mjs production.json` and act
   on every note (crop, grade, or ask for a new take). Then make a contact sheet per file (`ffmpeg -i f -vf fps=1,scale=320:-1,tile=4x2`) and
   note per file: A-roll (carries the story, usually a speaker) or B-roll (shows it), usable moments (in point,
   length), and where the subject sits in the frame (for `focusX` / `focusY`).
2. **Shape the story** around tension and release: `references/story.md`.
3. **Choose assets per moment** with the rules in `references/assets.md`. Use only these assets. Beats that
   explain without footage of the product use a graphic shot (mail, puzzle, badges, knowledge map, flow).
4. **Write `timeline.json`**: `references/timeline.md`. Give every shot its `phase` (tension or release);
   footage from a golden-hour plan gets `grade: "golden"`.
5. **Check, review, then render.** `scripts/check.mjs timeline.json` must report no errors (`render.mjs`
   runs it first and stops on errors). Render `--review` (one large frame per shot and per caption) and write
   per frame, as the viewer: what they see and read. A frame you cannot describe in one sentence is a fault;
   fix it. Then `--stills` for timing, then the MP4: `references/rendering.md`. Shots not there yet render as
   placeholders (an animatic).
6. **Deliver** the MP4, the timeline and a short summary of the edit in the user's language: story beats,
   assets used and why, anything you could not do.

## Signature essentials (always)

- **Tension is the teaser, release is the message.** Tension may be loud (short B-roll shots, FX flash, riser,
  looks); the release brings the message calmly (longer shots, glass card, productive motion).
- **Fixed:** colours, font and logo come from the `ibs-huisstijl` skill (dark `#171717`, one accent IBS-yellow
  `#F9C852`, cream text, Poppins). If that skill is not installed, use exactly these values.
- **Every line wipe and every divider is the IBS divider:** a thin double line with the IBS mark in the middle,
  never a plain square.
- **No** hand-drawn arrows, underlines or boxes; **no** white flash on cuts.

Details: `references/signature.md`.

## References

| Read when… | File |
|---|---|
| Checking a style choice | `references/signature.md` |
| Picking an asset, its defaults and when to use it | `references/assets.md` |
| Shaping the story, captions and detection labels | `references/story.md` |
| Writing the timeline | `references/timeline.md` |
| Rendering, requirements, troubleshooting | `references/rendering.md` |
| Starting, resuming or changing a project | `references/production.md` |

`catalog/ibs-edit-library.html` shows every asset live (open it in a browser); use it to show the user what
an asset looks like before you use it.

## Text on screen

Captions and card text follow the `ibs-schrijfstijl` skill when it is installed; otherwise keep them short,
plain and active, in the user's language.
