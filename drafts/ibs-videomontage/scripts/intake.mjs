#!/usr/bin/env node
// Intake: check every delivered take in production.json against the plan, before editing.
//
//   node intake.mjs <production.json>
//
// Per shot whose `file` exists: aspect, length and warmth (average red minus blue, 0 = neutral). Writes the
// result to shot.intake and prints a table. A cool take in a golden-hour plan gets a note: grade it in the
// edit (timeline `grade`), or regenerate with the light stated more strongly.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const prodPath = process.argv[2];
if (!prodPath) { console.error("Usage: node intake.mjs <production.json>"); process.exit(1); }
const base = path.dirname(path.resolve(prodPath));
const prod = JSON.parse(fs.readFileSync(prodPath, "utf8"));
const want = prod.brief?.format || "9:16", [ww, wh] = want.split(":").map(Number);
const golden = /golden.hour/i.test(JSON.stringify(prod.styles || {}));

function probe(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", file]);
  const j = JSON.parse(r.stdout.toString()); return { w: j.streams[0].width, h: j.streams[0].height, sec: +(+j.format.duration).toFixed(1) };
}
function warmth(file) {
  // Average colour of 8 frames, scaled to 1 pixel each.
  const r = spawnSync("ffmpeg", ["-v", "error", "-i", file, "-vf", "fps=1,scale=1:1", "-frames:v", "8", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 20 });
  const b = r.stdout; let R = 0, B = 0, n = b.length / 3;
  for (let i = 0; i < b.length; i += 3) { R += b[i]; B += b[i + 2]; }
  return +((R - B) / n / 255).toFixed(2);
}

const rows = [];
for (const s of prod.shots || []) {
  if (!s.file) continue;
  const file = path.resolve(base, s.file);
  if (!fs.existsSync(file)) { rows.push([s.id, "–", "–", "–", "nog niet aangeleverd"]); continue; }
  const p = probe(file), wm = warmth(file), notes = [];
  if ((ww < wh) !== (p.w < p.h)) notes.push(`verhouding ${p.w}×${p.h}, plan is ${want}: bijsnijden (focusX) of opnieuw in ${want}`);
  if (s.gen_seconds && p.sec + 0.3 < s.gen_seconds) notes.push(`${p.sec} s, gevraagd ${s.gen_seconds} s`);
  if (golden && wm < 0.12) notes.push(`koel licht (warmte ${wm}): geen golden hour; grade in de montage of opnieuw genereren`);
  s.intake = { date: new Date().toISOString().slice(0, 10), width: p.w, height: p.h, seconds: p.sec, warmth: wm, notes };
  rows.push([s.id, `${p.w}×${p.h}`, `${p.sec} s`, String(wm), notes.join("; ") || "ok"]);
}
fs.writeFileSync(prodPath, JSON.stringify(prod, null, 2) + "\n");
const pad = (x, n) => String(x).padEnd(n);
console.log(pad("shot", 6) + pad("formaat", 11) + pad("lengte", 8) + pad("warmte", 8) + "oordeel");
rows.forEach((r) => console.log(pad(r[0], 6) + pad(r[1], 11) + pad(r[2], 8) + pad(r[3], 8) + r[4]));
