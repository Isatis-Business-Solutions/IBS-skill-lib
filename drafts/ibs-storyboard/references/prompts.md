# Prompts for generated shots

Every `gen` or `combo` shot gets two prompts, in English:

- **`prompt`**: the video prompt. Video models such as Veo follow this order: subject, context, action,
  style, camera motion, composition, ambiance (Google's Veo prompt guide). Write it as:
  `[shot size], [camera move]. [subject] [action]. [context]. [light and mood].` One action per shot.
- **`keyframe_prompt`**: a still image of the shot's first moment, for the storyboard and as a first frame
  for the video model. Same subject, framing and light as `prompt`, without the movement.

## Style block (`styles` in production.json)

One shared block per project, appended to every video prompt (or put in the model's negative-prompt field),
so all shots share one look. Name it (`STYLE_V1`) and refer to it from each shot (`style`). Contents:

- **Look:** realistic contemporary documentary cinematography, lens, depth of field, film grain.
- **Light:** the `ibs-stockbeeld` light, stated strongly: golden hour, low warm sun, long soft shadows,
  warm yellow-orange tones, also indoors (sun through windows). Models drift to neutral daylight; say it twice.
- **Format:** vertical 9:16, the shot length.
- **Audio:** ambient only, no music, no speech (sound design happens in the edit).
- **Avoid:** text, subtitles, logos, watermarks, readable screens, distorted hands, morphing faces, plastic
  skin, render look, green colour cast, cool blue daylight.

## Consistency

- Make **reference images** first (`refs`: the main person, the main place) and use them as the first
  frame or reference of every shot they appear in.
- `frames.first` / `frames.last`: a first and a last frame let the model only fill in the motion between
  them: the most control you get. Use them for shots that must end somewhere exact.
- Ask for the format in the tool settings as well as the prompt: tools ignore the prompt's aspect.
