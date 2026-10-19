#!/usr/bin/env node
// Make placeholder clips for every shot in production.json whose file does not exist yet, so the edit can be
// rendered as an animatic before the footage is generated.
//
//   node placeholders.mjs <production.json>
//
// Writes .placeholders/<shot id>.mp4 next to production.json: dark frame with the shot id, title, size and move,
// and a thin line that moves so the timing is visible. Point the timeline at them with `fallback`.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const prodPath = process.argv[2];
if (!prodPath) { console.error("Usage: node placeholders.mjs <production.json>"); process.exit(1); }
const base = path.dirname(path.resolve(prodPath));
const prod = JSON.parse(fs.readFileSync(prodPath, "utf8"));
const outDir = path.join(base, ".placeholders"); fs.mkdirSync(outDir, { recursive: true });
const fonts = [path.join(here, "..", "..", "ibs-huisstijl", "assets", "fonts"), path.join(here, "..", "..", "..", "skills", "ibs-huisstijl", "assets", "fonts")].find((d) => fs.existsSync(d));
const font = (w) => fonts ? `:fontfile='${path.join(fonts, `Poppins-${w}.ttf`)}'` : "";

let made = 0;
for (const s of prod.shots || []) {
  if (!s.file || fs.existsSync(path.resolve(base, s.file))) continue;
  const out = path.join(outDir, s.id + ".mp4"), secs = s.gen_seconds || 8;
  const lines = [[s.id, 64, "0xF9C852", "SemiBold", 640], [s.title || "", 34, "0xFEF9ED", "Regular", 740], [[s.size, s.move].filter(Boolean).join(" · ").toUpperCase(), 28, "0x9A958C", "SemiBold", 800], ["nog genereren", 28, "0x9A958C", "Regular", 1180]];
  const draw = lines.map(([t, size, color, w, y], i) => {
    const tf = path.join(outDir, `${s.id}.${i}.txt`); fs.writeFileSync(tf, t);
    return `drawtext=textfile='${tf}'${font(w)}:fontsize=${size}:fontcolor=${color}:x=(w-text_w)/2:y=${y}`;
  });
  const vf = [`drawbox=x=0:y=0:w=iw:h=ih:color=0x1f1e1b:t=fill`, `drawbox=x='(t/${secs})*iw-4':y=1000:w=8:h=2:color=0xF9C852:t=fill`, ...draw].join(",");
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", `color=c=0x171717:s=1080x1920:r=24:d=${secs}`, "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "30", out], { stdio: ["ignore", "pipe", "pipe"] });
  if (r.status !== 0) { console.error(s.id, r.stderr.toString().slice(-800)); process.exit(1); }
  lines.forEach((_, i) => fs.rmSync(path.join(outDir, `${s.id}.${i}.txt`)));
  made++; console.log("· " + path.relative(base, out));
}
console.log(`✓ ${made} placeholder(s) in ${path.relative(process.cwd(), outDir) || "."}`);
