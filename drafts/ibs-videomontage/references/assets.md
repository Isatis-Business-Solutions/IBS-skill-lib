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

**`orb`** · the AI orb over the frame, in a glass disc: `state`, `x`, `y` (centre, fractions of the frame),
`size` (fraction of the width, ~0.2–0.3). For the moment an AI acts inside a shot (it reads, searches,
answers).

**`riser`** · rising sound that ends at `at + dur` (max 1.8 s of sound); put it under a tension burst so it
peaks on the release cut.

## Per shot

**`look`** · a look on the whole shot. **Default `none`: the footage stays readable.** A whole-shot look
belongs only on a short tension shot (< 1.5 s) without story content; `check.mjs` enforces this. Options: `edges`, `halftone`, `dither`, `duotone`, `posterize`, `threshold`,
`grain`, `scanlines`, `vignette`, `rgbsplit`, `glitch`, `pixelsort`, or `none`. Loud looks (`glitch`,
`rgbsplit`, `threshold`, `pixelsort`) belong to tension only; in the release use `none` or at most `grain` or
`vignette`.

**`grade`** (timeline-level, per shot to override) · the colourist: pulls every shot towards one light.
`golden` = golden hour (warm wash, amber glow from the top right, softer shadows). Use it on generated
footage that came back cooler than the plan (intake reports the warmth), and to make shots from different
tools match.

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
| `chat` | the knowledge base answers a colleague's question | `title`, `q`, `a`, `source`, `thinking` (orb "denkt na…" before the answer; default on) |
| `orb` | **the face of an AI** (see below): name and role, the orb, what it is doing; states follow each other | `name`, `role`, `states: [[state, label], …]`, `per` (frames per state) |
| `dark` | just the canvas with the amber glow, for captions or a glass card on their own | – |

### The AI orb (thinking-orbs)

Whenever an AI appears in the story (a gen-AI tool, an assistant, an agent, an agentic solution), show it as
an **orb** from thinking-orbs (github.com/Jakubantalik/thinking-orbs, MIT, bundled in `engine/vendor/`):
a sphere of dots in IBS-yellow whose movement says what the AI is doing. Never a robot, a face or a glowing
brain. Three uses: the `orb` graphic (the AI as a character, full frame), the `orb` overlay (on footage or a
graphic, in a glass disc), and `thinking` in the `chat` graphic.

| State | Shows | | State | Shows |
|---|---|---|---|---|
| `listening` | a wave rolls through the rings | | `working` | particles on tilted orbits |
| `searching` | a scan sweeps a dotted globe | | `solving` | bands scramble, then click solved |
| `connecting` | a constellation wires itself | | `weaving` | three strands plait the sphere |
| `composing` | an undulating band (writing) | | `breathing` | a ring slowly morphing (idle) |
| `shaping` | outline circle → triangle → square | | | |

Icons: `mail`, `reply`, `doc`, `flow`, `base`, `trophy`, `star`, `puzzle`, `timer`.

## Brand
**`assemble`** · the four planes of the IBS mark fly in (stagger 3 f, ease-out), with a hit. 1.6 s.
