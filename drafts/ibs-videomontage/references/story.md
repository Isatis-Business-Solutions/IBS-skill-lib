# Story design on asset use

This is the light story step for editing. A full storyboard (a separate skill, later) replaces it; when the
user brings a storyboard or shot list, follow that and only fill gaps with these rules.

## Shape
A clip is a sequence of **beats**. Each beat is tension or release.

- **Hook (tension, first 2–4 s):** the question, the surprise or the problem, without context. B-roll bursts,
  shots of 0.5–0.8 s, alternating looks, FX flash on the cuts, a riser that peaks on the first release cut,
  the hook line as captions.
- **Release beat (per topic):** the answer or the point. Enters with a double wipe when it is a new topic and
  there is A-roll; shots of 3–5 s; captions for the spoken line; one glass card or detection callout per beat
  at most.
- **Short tension between topics:** a burst of 2–4 B-roll shots with FX flashes, when the clip is longer than
  ~30 s.
- **Close:** the takeaway, then a brand moment (logo spin into the last shot, or `assemble` as outro).

Pacing reference: tension ASL 0.5–0.8 s, release ASL 3–5 s. One message per clip; if the request has three,
make three beats and say which one is the core.

## Captions
Captions carry the line the viewer must remember. Split speech into units of a few words; one key word per
caption, the word that carries the meaning. If there is no transcript and no transcription tool, ask the user
for the spoken text.

## Detection labels
Labels are **playful and about the story**, chosen for this clip: they name what the object means in the
story, not what it is. One or two words, lowercase, a confidence of 0.90–1.00 (1.00 for the punchline).

## Only B-roll
Without A-roll the release is carried by captions and glass cards on longer B-roll shots; use `doublewipe`
between the topics anyway.

## Check before rendering
- Does the first second make the viewer stay? Is the message clear without sound (captions)?
- Do loud things only happen in the tension, and does every loud visual event land on a cut or a hit?
- Do no two shots in a row share a look? Does every callout end inside its shot?
- Is no caption or card on screen during a double wipe or logo spin (the flat yellow frame hides the yellow key
  word)? Start text after the transition.
- Is `role: "A"` only used for footage that carries the story (usually a speaker)? Without A-roll, all shots
  are B-roll.
