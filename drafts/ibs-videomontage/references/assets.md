# Asset catalog

Only these assets exist. Each has a name you use in `timeline.json`, a moment it is for, and defaults that
were decided with the owner; change a parameter only for a reason you can name.

## When to use what

| Moment | Use |
|---|---|
| Hook / tension | short shots, clean footage, `fxflash` on the cuts, a `riser` under the burst, captions with the hook line; 0.5–0.8 s only for texture shots without story content, 1.5–3 s for shots that carry the beat |
| Release: a new topic starts (A-roll) | `doublewipe` into the shot |
| A number or key message in the release | `glass` card |
| Showing *what* matters in a shot | `detect` callout, labels playful and about the story |
| Brand moment out of a scene | `logospin` transition (logo → divider → split wipe) |
| Opening or closing on the brand | `brand.intro` / `brand.outro`: `assemble` |
| Any spoken line that carries the story | `captions` |
| A calm shot that needs life | `zoom` (slow push-in), e.g. `[1, 1.08]` |

## Transitions (field `transition` on the shot it leads into)

**`cut`** (default). Between two B-roll shots the renderer adds a soft whoosh.

**`fxflash`** · tension cuts in the B-roll. The first `frames` of the new shot show a look of that shot, with
a hit. Defaults: `look` = `edges`, `frames` = 6 (the longest; the owner's default). Alternate `edges`,
`halftone`, `dither`.

**`doublewipe`** · release, per new topic, into an A-roll shot. Version v1.1, 44 frames (1.83 s): the IBS
divider sweeps up revealing edge detection (10 f, ease-out), a feathered wipe (35%) reveals halftone whose
kernel grows until the frame is flat IBS-yellow with the IBS mark (6 f, with a hit), then the new shot
resolves (14 f). The new shot must last at least 2.5 s; the previous shot keeps playing underneath, so it
needs 1.8 s of footage after its out point (else its last frame holds).

**`logospin`** · brand moment between scenes. The whole logo rotates in from 3× size (−110°, overshoot in the
rotation, ease-out in scale, 26 f), holds, rotates smaller (ease-in) into the mark of the IBS divider, the
divider draws out and opens as a split wipe onto the new shot. About 3.4 s; the new shot must be longer.

## Overlays (list `overlays`, timed in seconds from the start)

**`captions`** · kinetic captions, word by word, stagger 3 f, overshoot, one `key` word in yellow, bottom of
the frame. Max ~6 words per caption; long text auto-shrinks, so split it instead.

**`detect`** · object-detection callout: yellow-gradient corner brackets, a console label (`▸ label 0.97`)
that types in, a look inside the box on entry and exit. Anchor in the centre, scales in with overshoot from
15%. Each item lives 36 f (1.5 s); stagger items by ~0.4–0.5 s. `box` = `[x, y, w, h]` as fractions of the
frame around the subject; `track: true` follows the subject (template matching: works on clear subjects with
contrast, loses fast or blurry motion). The callout must end before the shot does.

**`glass`** · glass card (glassmorphism): blurred background, cream tint, light border, yellow accent; an
eyebrow label, a big `title` (number or short claim) and a `sub` line. Release only. Minimum 1.6 s.

**`riser`** · rising sound that ends at `at + dur` (max 1.8 s of sound); put it under a tension burst so it
peaks on the release cut.

## Per shot

**`look`** · a look on the whole shot. **Default `none`: the footage must stay readable.** Use a whole-shot
look only on short texture shots that carry no story content, never on a shot whose action or subject is the
point of the beat. Options: `edges`, `halftone`, `dither`, `duotone`, `posterize`, `threshold`,
`grain`, `scanlines`, `vignette`, `rgbsplit`, `glitch`, `pixelsort`, or `none`. Loud looks (`glitch`,
`rgbsplit`, `threshold`, `pixelsort`) belong to tension only; in the release use `none` or at most `grain` or
`vignette`.

**`zoom`** · `[from, to]` scale over the shot, eased (push-in `[1, 1.08]`, pull-out `[1.06, 1]`).

## Graphic shots (field `graphic` on a shot, no footage)

Full-frame motion graphics in the house style, drawn by `engine/ibs-graphics.js`, for beats that explain when
there is no footage of the product. They are calm (release): ease-out and, for UI elements, the caption
stagger with overshoot; no looks on them. All take `onTwos: true` to animate on twos (12 drawings per second).
Leave the lower fifth free for captions.

| `type` | For | Options |
|---|---|---|
| `mail` | a message comes in and the reply types itself | `sender`, `subject`, `question`, `reply`, `from: [x, y, w, h]` (the card grows out of that box, e.g. the detection box of the shot before: box → screen) |
| `puzzle` | four pieces fly in and become the IBS mark | `stagger`, `frames` (ease-out, like the assemble) |
| `badges` | gamification: badge tiles, level bar, score | `tiles` (icon names), `active`, `level`, `from`, `to`, `score` |
| `knowmap` | known knowledge as nodes; the gap lights up; a question comes out | `question`, `label` |
| `flow` | an input becomes several outputs (cards with icons) | `source`, `cards: [[icon, label], …]` |
| `minigames` | three short games that fill missing knowledge: order the steps, spot what goes wrong, fill the gap | `game` (frames per game), `order`, `spot`, `fill`, `points` |
| `city` | progress as a city you build; knowledge areas are buildings, an answer upgrades one | `blocks: [[label, floors], …]`, `upgrade` (index), `streak`, `score` |
| `chat` | the knowledge base answers a colleague's question | `title`, `q`, `a`, `source` |
| `dark` | just the canvas with the amber glow, for captions or a glass card on their own | – |

Icons: `mail`, `reply`, `doc`, `flow`, `base`, `trophy`, `star`, `puzzle`, `timer`.

## Brand
**`assemble`** · the four planes of the IBS mark fly in (stagger 3 f, ease-out), with a hit. 1.6 s.
