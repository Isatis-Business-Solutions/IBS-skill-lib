# IBS skills: instructions for maintaining this library

A public library of skills used at IBS – Isatis Business Solutions. Installable via `npx skills`, as a Claude
Code plugin (`.claude-plugin/`), and as zips for the Claude app. Communication with the owner is in
**Dutch**; the skills themselves are written in **English** (they work best that way in every tool).

**Working in this repo?** Load the `ibs-library-maintainer` skill (`.claude/skills/`) and start from
`SPEC.md`: features, open questions, decisions and planned releases.

## Structure

```text
skills/<skill-name>/
  SKILL.md        frontmatter (name, description) + the core instructions, short
  references/     longer guidance, read only when needed (one file per topic)
  assets/         files the skill hands out (logos, fonts, tokens)
.claude-plugin/   marketplace.json + plugin.json (Claude Code plugin)
scripts/package.sh  builds dist/<skill>.zip for the Claude app
.github/workflows/package.yml  checks frontmatter, builds zips, releases on tags v*
preview/          visual check of the house style (open index.html)
brand-source/     original brand files the assets were made from
drafts/<skill>/   skills still being tested; not published (see drafts/README.md)
docs/             background for maintainers per skill (not shipped with the skill)
SPEC.md           features, open questions, decisions, releases
.claude/skills/   internal skills for working in this repo (not published)
```

## Conventions

- **Skill names:** lowercase with hyphens; the folder name is the same as `name:`. IBS-specific skills get the
  `ibs-` prefix; general skills that have nothing to do with IBS (e.g. `image-generator`) do not.
- **Description:** say *what* and *when*, including trigger words (Dutch and English), max ~1000 characters.
  That is how the assistant decides to load the skill.
- **SKILL.md** stays short: the essentials plus a table that points to `references/`. Details go in
  references.
- **General, not exhaustive:** the house style describes the feel and the key rules, so it fits every medium.
  No templates.
- **ibs-schrijfstijl is rules only:** defined feel words, rules and boundaries; never sample texts or word
  lists (they steer too much one way). Background in `docs/ibs-schrijfstijl.md`.
- **Skills may refer to each other** by name, e.g. `ibs-huisstijl` → `ibs-schrijfstijl` for tone. Always add a
  fallback for when the other skill is not installed.
- **Colours and fonts** live in one place: `skills/ibs-huisstijl/assets/tokens/`. If you change a value,
  change it there and in the table in `SKILL.md`, and check contrast (WCAG AA ≥ 4.5:1 for text).
- **New skills start in `drafts/`.** Only `skills/` is published (npx skills, plugin, release zips). Move a
  skill to `skills/` once the owner has tested and approved it.

## New version

1. Change the skill and the version in `.claude-plugin/plugin.json`.
2. Run `./scripts/package.sh` locally (optional), and open `preview/index.html` to check the look.
3. Commit to `main`, then tag `vX.Y.Z` and push the tag. The workflow attaches the zips to a release.

## Planned

See `SPEC.md`.
