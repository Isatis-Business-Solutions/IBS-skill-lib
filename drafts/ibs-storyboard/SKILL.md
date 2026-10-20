---
name: ibs-storyboard
description: Storyboard and shot list for a video of IBS – Isatis Business Solutions, from an idea or a message to an approved plan — grill the story until it is clear, choose the story skeleton from the goal, plan per beat what the viewer sees (real footage, generated shot, motion graphic), write the video-generation prompts, and show it all as one visual storyboard page for the user to approve. Use whenever the user wants to plan, script or storyboard a video, clip, reel, short, ad or explainer for IBS or "in IBS-stijl" — "storyboard", "shotlist", "shot list", "draaiboek", "video bedenken", "verhaal voor een video", "welke shots", "prompts voor Veo/Higgsfield" — before footage exists. Not for editing existing footage (`ibs-videomontage`).
---

# IBS storyboard

Turn an idea into an approved video plan: a story skeleton, a shot per beat with its image and prompt, and a
storyboard page the user signs off. Everything lives in the project's `production.json`, the shared record
that video generation and `ibs-videomontage` continue from.

**Pipeline:** storyboard (this skill) → approval → video generation → intake → montage (`ibs-videomontage`).
The video-generation skill does not exist yet: after approval, the user generates the shots with the prompts
from the storyboard and delivers them as `gen/<shot id>.mp4`.

## Workflow

1. **Grill the story.** Ask one question at a time until every brief field in `references/brief.md` is
   filled and the user agrees with it: the product in one sentence, the buyer, the user, the goal sentence,
   the core message. Use the `grilling` skill if it is installed. Done when `scripts/check.mjs` reports no
   brief errors.
2. **Choose the skeleton** from the goal: `references/skeleton.md`. Write the beats into `production.json`,
   each with its phase (tension or release) and what the viewer thinks.
3. **Plan the image per beat**: source, shot size, camera move, length: `references/image-plan.md`.
4. **Write the shots** into `production.json` (`references/production.md`): per generated shot the video
   prompt, keyframe prompt and frames (`references/prompts.md`); per graphic shot the `graphic` and its
   options; per shot the caption.
5. **Check:** `node scripts/check.mjs production.json`. Fix every error; decide every warning.
6. **Make the frames.** For every generated shot without a take, make its keyframe image from
   `keyframe_prompt` with the `image-generator` skill (save as `frames/<id>.png`). Then, if `ibs-videomontage`
   is installed, run its `scripts/frames.mjs production.json` for stills of the graphic shots and of
   delivered takes. Shots without a frame get a sketch in the storyboard.
7. **Build the storyboard:** `node scripts/storyboard.mjs production.json` → `storyboard.html`. Open it,
   look at every card as the viewer would, then give it to the user.
8. **Get approval.** The user approves or comments per shot (the page can copy their feedback for the
   chat). Process the feedback into `production.json` and `LOG.md`, rebuild, until every shot is approved.
   Then hand over: list per generated shot what to generate (prompt + style block, frames, aspect, seconds).

Keep `LOG.md` next to `production.json`: one line per change (date, what, why).

## Rules (always)

- **The story leads.** A beat that does not move the viewer towards the goal sentence goes.
- **Tension and release feel different:** tension short, loud, moving; release longer (3–6 s), calm, still.
- **Real footage proves, generated footage imagines, motion graphics explain.** A beat that must be believed
  (result, proof, a real person) asks for real footage; without it, show the product as a motion graphic, not
  a generated "customer".
- **Reading time:** every caption at least 1 s + 0.3 s per word, max ~6 words.
- Look and language follow `ibs-huisstijl`, `ibs-stockbeeld` and `ibs-schrijfstijl` when installed.

## References

| Read when… | File |
|---|---|
| Grilling the story, the brief fields | `references/brief.md` |
| Choosing the skeleton, beats, tension and release | `references/skeleton.md` |
| Choosing source, shot size, camera move per beat | `references/image-plan.md` |
| Writing video and keyframe prompts | `references/prompts.md` |
| Writing or reading `production.json` | `references/production.md` |
