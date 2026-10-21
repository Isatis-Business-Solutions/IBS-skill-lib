# The image plan: what the viewer sees per beat

Per beat ask: what must the viewer think here, and which image shows that fastest? Then choose a source, a
shot size and a camera move.

## Source (`source`)

| Source | Job | Use for |
|---|---|---|
| `real` | proves | result, proof, real people and places; filmed or delivered footage |
| `gen` | imagines | what cannot be filmed: the world before the problem, scale, a metaphor, a scenario |
| `code` | explains | the product, a process, numbers: a graphic shot from `ibs-videomontage` |
| `combo` | points | a generated or real shot with a code layer on top (detection callout, glass card) that leads into a graphic |

- A beat that must be believed never rests on a generated person. Without real footage, show the product
  working as a graphic; mark generated scenarios as such in the notes.
- Generated people are the riskiest part of generated footage. Show them through hands, backs, silhouettes
  and objects; at most one calm face, without speech.
- **An AI in the story** (gen-AI tool, assistant, agent) is shown as the thinking-orbs **orb** in
  IBS-yellow: as a character (`graphic.type: "orb"`), as an overlay on a shot, or thinking in the chat. Never
  a robot, a face or a glowing brain.
- **Graphic shots** available in `ibs-videomontage` (see its `references/assets.md`): orb, mail, minigames,
  city, knowledge map, flow, chat, puzzle → mark, dark. A beat that needs a new graphic gets
  `graphic.type: "new"` and a description in `notes`; it is built before the edit.

## The IBS look

- **Generated** = the world of `ibs-stockbeeld`: the viewer's sector, realistic and contemporary, golden-hour
  light, nature around it, one faint retro-future detail. In a story with a hero, people may appear (the
  stockbeeld rule "no people" is for mood images).
- **Motion graphics** = the house style in motion: dark canvas with amber glow, yellow as the only accent,
  Poppins, big numbers, thin line icons, glass cards.

## Shot size (`size`) and camera move (`move`)

| `size` | Shows | | `move` | Feels |
|---|---|---|---|---|
| `ews` extreme wide | scale, place, distance | | `locked` locked-off | calm, reliable: release |
| `ws` wide | the subject with its context | | `push` push-in | attention, tension or intimacy |
| `ms` medium | action, body language | | `pull` pull-out | reveals context; loneliness |
| `mcu` medium close-up | a person and their reaction | | `pan` / `tilt` | follows, reveals; grandeur |
| `cu` close-up | one detail, emotion | | `crane` crane / drone | scale, overview |
| `ecu` extreme close-up | tension, emphasis | | `track` tracking | travel through space |
| | | | `hand` handheld | urgency: tension only |

- An establishing shot is a job (where are we?), not a size; a drone shot is for scale or place, rarely a hook.
- Alternate shot sizes between cuts; the same size twice in a row reads as a jump.
- Graphic shots have no size or move.

## Length (`seconds`)

The time the shot is on screen in the edit, from the table in `skeleton.md`. A generated shot is generated
longer (`gen_seconds`, usually 8 s) so the edit can choose its moment.
