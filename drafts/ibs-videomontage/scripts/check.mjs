#!/usr/bin/env node
// Check a timeline against the rules of the IBS signature before rendering. render.mjs runs this first and
// stops on errors (override with --force). Run it alone while editing:
//
//   node check.mjs <timeline.json>
//
// Errors are rules the owner decided; warnings are judgement calls to look at.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function check(tl, base) {
  const fps = tl.format?.fps || 24, errors = [], warnings = [];
  const E = (m) => errors.push(m), W = (m) => warnings.push(m);
  const DW = 44, SPIN = 82, ASSEMBLE = 39; // frames: double wipe v1.1, logo spin, assemble (see assets.md)
  const LOUD = new Set(["glitch", "rgbsplit", "threshold", "pixelsort"]);

  // Shot timeline in seconds, with the frames a transition covers.
  let t = tl.brand?.intro === "assemble" ? ASSEMBLE / fps : 0;
  const shots = (tl.shots || []).map((s, i) => {
    const r = { s, i, from: t, to: t + s.dur, phase: s.phase || (s.graphic ? "release" : null) };
    const tr = s.transition?.type;
    r.trTo = t + (tr === "doublewipe" ? DW : tr === "logospin" ? SPIN : tr === "fxflash" ? (s.transition.frames || 6) : 0) / fps;
    t += s.dur; return r;
  });
  const name = (r) => `shot ${r.i + 1} (${r.s.src || r.s.graphic?.type})`;

  // Sources: present (or a fallback), and portrait for a 9:16 edit.
  for (const [id, def] of Object.entries(tl.sources || {})) {
    const rel = typeof def === "string" ? def : def.file, file = path.resolve(base, rel);
    const fb = typeof def === "object" && def.fallback ? path.resolve(base, def.fallback) : null;
    const use = fs.existsSync(file) ? file : fb && fs.existsSync(fb) ? fb : null;
    if (!use) { E(`source ${id}: ${rel} not found and no fallback`); continue; }
    if (use === fb) W(`source ${id}: placeholder in use (${def.fallback})`);
    const p = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", use]);
    const [w, h] = (p.stdout?.toString().trim() || "0,0").split(",").map(Number);
    const portrait = (tl.format?.aspect || "9:16") === "9:16";
    if (use !== fb && portrait && w > h) W(`source ${id}: landscape (${w}×${h}) in a 9:16 edit; only the middle third is kept. Set focusX, or regenerate in 9:16`);
  }

  for (const r of shots) {
    const s = r.s;
    if (!s.dur || s.dur <= 0) E(`${name(r)}: no duration`);
    if (s.src && !(s.src in (tl.sources || {}))) E(`${name(r)}: unknown source ${s.src}`);
    if (!r.phase) W(`${name(r)}: no phase (tension | release); the rules for its beat cannot be checked`);
    const look = s.look && s.look !== "none" ? s.look : null;
    // Footage stays readable: a whole-shot look only on short texture shots in the tension.
    if (look && r.phase === "release") E(`${name(r)}: look "${look}" on a release shot; release footage plays clean`);
    if (look && s.dur >= 1.5) E(`${name(r)}: look "${look}" on a ${s.dur} s shot; a shot long enough to carry a beat plays clean (look: "none")`);
    if (look && LOUD.has(look) && r.phase !== "tension") E(`${name(r)}: loud look "${look}" outside the tension`);
    if (r.phase === "release") {
      if (s.transition?.type === "fxflash") E(`${name(r)}: FX flash into a release shot; FX flash is for tension cuts`);
      if (s.dur < 3) W(`${name(r)}: release shot of ${s.dur} s; release shots get 3–6 s so the viewer can read them`);
    }
    if (s.transition?.type === "doublewipe" && s.dur < 2.5) E(`${name(r)}: a double wipe needs a shot of at least 2.5 s`);
    if (s.transition?.type === "logospin" && s.dur < SPIN / fps + 0.5) E(`${name(r)}: a logo spin needs a shot longer than ${(SPIN / fps + 0.5).toFixed(1)} s`);
  }

  // Overlays: reading time, overlap, no text over a double wipe or logo spin, callouts inside their shot.
  const caps = (tl.overlays || []).filter((o) => o.type === "captions").sort((a, b) => a.at - b.at);
  for (const c of caps) {
    const words = (c.text || "").split(/\s+/).filter(Boolean).length, need = 1 + 0.3 * words;
    if (words > 6) W(`caption "${c.text}": ${words} words; split it (max ~6)`);
    if (c.dur < need - 0.01) E(`caption "${c.text}": ${c.dur} s, needs ≥ ${need.toFixed(1)} s to read (1 s + 0.3 s per word)`);
    for (const r of shots) {
      if (r.trTo > r.from && c.at < r.trTo && c.at + c.dur > r.from && ["doublewipe", "logospin"].includes(r.s.transition?.type))
        E(`caption "${c.text}" (${c.at}–${(c.at + c.dur).toFixed(1)} s) runs over the ${r.s.transition.type} into ${name(r)} (${r.from.toFixed(1)}–${r.trTo.toFixed(1)} s)`);
    }
  }
  for (let i = 1; i < caps.length; i++) {
    const a = caps[i - 1], b = caps[i];
    if (a.at + a.dur > b.at - 0.2) E(`captions overlap: "${a.text}" ends ${(a.at + a.dur).toFixed(1)} s, "${b.text}" starts ${b.at} s`);
  }
  for (const o of tl.overlays || []) {
    if (o.type === "riser") {
      const end = o.at + o.dur;
      for (const r of shots) if (r.phase === "release" && end > r.from + 0.1 && o.at < r.to) E(`riser (${o.at}–${end.toFixed(1)} s) sounds over release ${name(r)}; let it end on the release cut`);
    }
    if (o.type === "detect") {
      const r = shots.find((x) => o.at >= x.from && o.at < x.to);
      const end = o.at + Math.max(o.dur || 0, ((o.items || []).length - 1) * 0.5 + 1.5);
      if (r && end > r.to + 0.05) E(`detect at ${o.at} s ends at ${end.toFixed(1)} s, after its ${name(r)} ends (${r.to.toFixed(1)} s)`);
    }
  }
  return { errors, warnings, length: t + (tl.brand?.outro === "assemble" ? ASSEMBLE / fps : 0) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const p = process.argv[2];
  if (!p) { console.error("Usage: node check.mjs <timeline.json>"); process.exit(1); }
  const r = check(JSON.parse(fs.readFileSync(p, "utf8")), path.dirname(path.resolve(p)));
  r.errors.forEach((m) => console.log("✗ " + m)); r.warnings.forEach((m) => console.log("! " + m));
  console.log(`${r.errors.length} error(s), ${r.warnings.length} warning(s) · ${r.length.toFixed(1)} s`);
  process.exit(r.errors.length ? 1 : 0);
}
