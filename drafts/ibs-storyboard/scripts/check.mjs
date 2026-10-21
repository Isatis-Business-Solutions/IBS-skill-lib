#!/usr/bin/env node
// Check production.json before the storyboard goes to the user: the brief is complete, every shot is fully
// planned, and the rules for tension, release and reading time hold.
//
//   node check.mjs <production.json>
//
// Errors block the storyboard; warnings are judgement calls to decide.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SIZES = ["ews", "ws", "ms", "mcu", "cu", "ecu"], MOVES = ["locked", "push", "pull", "pan", "tilt", "crane", "track", "hand"];
const SOURCES = ["gen", "combo", "code", "real"], PHASES = ["tension", "release"];

export function check(p) {
  const errors = [], warnings = [], E = (m) => errors.push(m), W = (m) => warnings.push(m);
  const b = p.brief || {};
  for (const k of ["product", "buyer", "user", "goal", "core"]) {
    if (!b[k] || String(b[k]).trim().length < 6) E(`brief.${k} is empty: grill the user until it is clear (references/brief.md)`);
  }
  if (b.goal && !/moet|must/i.test(b.goal)) W(`brief.goal does not read as "After this clip [who] must …"`);
  if (!b.cta) W("brief.cta is empty: what does the viewer do next?");

  const beats = p.skeleton?.beats || [];
  if (!beats.length) E("skeleton.beats is empty");
  beats.forEach((x) => { if (!PHASES.includes(x.phase)) E(`beat ${x.n} (${x.name}): phase must be tension or release`); if (!x.thinks) W(`beat ${x.n}: no "thinks"`); });

  const shots = (p.shots || []).filter((s) => s.status !== "dropped"), ids = new Set();
  let total = 0, prev = null;
  for (const s of shots) {
    const n = `${s.id}`;
    if (ids.has(s.id)) E(`${n}: duplicate id`); ids.add(s.id);
    const beat = beats.find((x) => x.n === s.beat);
    if (!beat) E(`${n}: beat ${s.beat} is not in the skeleton`);
    if (!PHASES.includes(s.phase)) E(`${n}: phase must be tension or release`);
    else if (beat && s.phase !== beat.phase && !(s.notes || []).length) W(`${n}: phase ${s.phase} differs from beat ${beat.n} (${beat.phase}); give the reason in notes`);
    if (!SOURCES.includes(s.source)) E(`${n}: source must be one of ${SOURCES.join(", ")}`);
    if (!(s.seconds > 0)) E(`${n}: seconds (length on screen) missing`); else total += s.seconds;
    if (!s.thinks) W(`${n}: no "thinks" (what the viewer thinks)`);
    if (["gen", "combo"].includes(s.source)) {
      for (const k of ["prompt", "keyframe_prompt"]) if (!s[k]) E(`${n}: ${k} missing`);
      if (!SIZES.includes(s.size)) E(`${n}: size must be one of ${SIZES.join(", ")}`);
      if (!MOVES.includes(s.move)) E(`${n}: move must be one of ${MOVES.join(", ")}`);
      if (!s.style || !(p.styles || {})[s.style]) E(`${n}: style ${s.style || "(none)"} not in styles`);
    }
    if (s.source === "code" && !s.graphic?.type) E(`${n}: a code shot needs graphic.type`);
    if (s.phase === "release") {
      if (s.seconds && s.seconds < 3) W(`${n}: release shot of ${s.seconds} s; release gets 3–6 s`);
      if (s.move === "hand") E(`${n}: handheld in a release shot; handheld is for tension`);
    }
    if (s.phase === "tension" && s.seconds > 4) W(`${n}: tension shot of ${s.seconds} s; tension is short (1.5–3 s)`);
    const c = s.caption?.text;
    if (c) {
      const words = c.split(/\s+/).filter(Boolean).length, need = 1 + 0.3 * words;
      if (words > 6) W(`${n}: caption "${c}" has ${words} words (max ~6)`);
      if (s.seconds && s.seconds < need) E(`${n}: caption "${c}" needs ${need.toFixed(1)} s to read; the shot is ${s.seconds} s`);
      if (s.caption.key && !c.toLowerCase().includes(s.caption.key.toLowerCase())) W(`${n}: caption key "${s.caption.key}" is not in the caption`);
    }
    if (prev && s.size && s.size === prev.size && s.source !== "code" && prev.source !== "code") W(`${prev.id} and ${s.id}: same shot size (${s.size}) in a row`);
    prev = s;
  }
  const style = JSON.stringify(p.styles || {});
  if (shots.some((s) => s.source === "gen") && !/golden.hour/i.test(style)) W("style block does not ask for golden-hour light (references/prompts.md)");
  if (b.length_s && total > b.length_s * 1.2) W(`shots add up to ${total.toFixed(0)} s, the brief says ${b.length_s} s: cut a beat rather than reading time`);
  return { errors, warnings, total };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const f = process.argv[2];
  if (!f) { console.error("Usage: node check.mjs <production.json>"); process.exit(1); }
  const r = check(JSON.parse(fs.readFileSync(f, "utf8")));
  r.errors.forEach((m) => console.log("✗ " + m)); r.warnings.forEach((m) => console.log("! " + m));
  console.log(`${r.errors.length} error(s), ${r.warnings.length} warning(s) · ${r.total.toFixed(1)} s`);
  process.exit(r.errors.length ? 1 : 0);
}
