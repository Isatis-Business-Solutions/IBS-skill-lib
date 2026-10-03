# Route: Codex CLI

Codex has built-in image generation (its `$imagegen` skill) that runs on the user's ChatGPT login.

Run, from the folder the image belongs in:

```bash
codex exec --skip-git-repo-check --sandbox workspace-write -C "<work folder>" \
  'Use $imagegen to generate one image. Prompt: <prompt>. Size or aspect: <if relevant>.
   Save the final image as <file-name>.png in the current folder. Reply with only the saved path.'
```

- Use single quotes around the instruction so the shell does not expand `$imagegen`.
- Generation can take a minute or more; use a generous timeout.
- Codex keeps its own copy in `~/.codex/generated_images/`. If the file is not in the work folder afterwards,
  copy the newest image from there.
- Not logged in or an authentication error → `setup.md`. Usage limit → tell the user (see `SKILL.md`).
