# Production record

Every project keeps its production in one folder with `production.json` (the record: brief, skeleton, every
shot with its prompts, takes and status) and `LOG.md` (what changed, when and why). The full format is
defined in the `ibs-storyboard` skill (`references/production.md`), which usually creates the record.

## What this skill does with it

- **Read it first** when it exists, and the end of `LOG.md`; change only what the request is about.
- **Intake** when takes arrive: `node scripts/intake.mjs production.json` checks every delivered take
  (aspect, length, warmth against the golden-hour plan) and writes `shot.intake`. Act on each note: crop
  (`focusX`), grade (`grade` in the timeline) or ask for a new take.
- **The timeline follows the record:** one or more timeline shots per record shot, with the same `phase`;
  captions from `shot.caption`; sources point at `shot.file`.
- **After every change:** update the shot (`status`, `chosen`, `takes` with verdict and note) and add one
  line to `LOG.md`; a render gets an entry in `renders`.
- **Animatic:** `node scripts/placeholders.mjs production.json` makes placeholder clips for shots whose
  `file` is missing; the timeline points at them with `fallback`.

Without the storyboard skill installed, keep at least: `brief.goal`, `skeleton.beats`, and per shot `id`,
`beat`, `phase`, `source`, `file`, `takes`, `chosen`, `status`, `notes`.
