---
name: ibs-library-maintainer
description: How to work in the IBS skill library repository (IBS-skill-lib). Load whenever you add, change, test or release a skill in this repo, update SPEC.md, plan a release, or answer questions about how the library is built — e.g. "nieuwe skill", "skill aanpassen", "release", "spec bijwerken", "add a skill", "new version".
metadata:
  internal: true
---

# Working in the IBS skill library

Read `CLAUDE.md` for the conventions (structure, naming, language, tokens). This skill adds **how we work**.
Talk to the owner in **Dutch**; write skills in **English**.

## 1. Spec first

`SPEC.md` is the single place for features, open questions, decisions and releases.

- Every new skill or significant change gets a feature entry (`F<n>`) with a status:
  idee → brainstorm → besloten → in bouw → testen → klaar → uitgebracht.
- Record what is already known before asking anything.
- Put every open question in the **Open vragen** table; when answered, fill in the answer and add a line to
  the **Besluitenlog** with the date.
- Assign each user-facing feature to a planned release in the **Releases** table. A release is about what
  users of the skills notice (a new skill or a visible improvement). Fixes and changes to how we work in this
  repo ride along with the next release and go under **Ontwikkeling**; they never get a release of their own.
- Keep the spec current in the same commit as the work it describes.

## 2. Ask, at most 5 questions at a time

- Ask only what changes what you build; decide the rest yourself and note it as a proposal in the spec.
- Give options where possible, with your recommendation first.
- Wait for answers before building what depends on them.

Write instructions at the right level of abstraction: specific enough to act on, open enough that the skill
fills in the details from the user's input. Define the key words well; do not add lists of examples (e.g. no
list of sectors or subjects): they make a skill too concrete and steer it one way.

## 3. Build in `drafts/`

- New skills go in `drafts/<skill-name>/`; only `skills/` is published (plugin, release zips).
- `npx skills` also finds skills in `.claude/skills/`; those are internal tooling and carry `metadata:` /
  `internal: true` in their frontmatter so they are not offered to users. `drafts/` is not scanned.
- Changes to an existing published skill are made in place on a branch and go through a PR.
- Follow the skill's own background in `docs/<skill-name>.md` if it exists (e.g. `ibs-schrijfstijl` is rules
  only, never sample texts).

## 4. Test without uploading

- Put the skill in a clean temporary folder under `.claude/skills/` and run Claude Code headless:
  `claude -p "<task>" --output-format stream-json --verbose`.
- Check which files the skill loads and what it produces. Run each task at least 3 times; judge stability,
  not one lucky run.
- Show the owner the results and your honest assessment, including what does not work yet.
- Turn the owner's feedback into rules or sharper definitions in the skill; record it in the spec.

## 5. Publish (only after the owner approves)

1. Move `drafts/<skill>` to `skills/<skill>`.
2. Update the skill table in `README.md`, the descriptions in `.claude-plugin/`, and the version in
   `.claude-plugin/plugin.json` (new skill or feature = minor, fix = patch, breaking = major).
3. Move maintainer notes to `docs/<skill>.md` (not shipped with the skill).
4. Validate: `claude plugin validate .`, `./scripts/package.sh`, and
   `npx skills@latest add <repo path> --list` must list the skill.
5. Update `SPEC.md` (status, release) and open a PR to `main`. Merge only with the owner's go; CI must be green.
6. Tag `vX.Y.Z` only when the owner asks; the workflow then creates the release with the zips.
