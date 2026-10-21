#!/usr/bin/env node
// Storyboard frames: one still per shot in production.json, written to frames/<shot id>.jpg.
//
//   node frames.mjs <production.json> [--chromium <path>]
//
// A shot with a delivered take: its middle frame, cropped to the plan's aspect. A graphic shot: its end state,
// drawn by the engine. Shots without either are left out (the storyboard draws a sketch for them).
// Existing frames are kept, so a generated keyframe (frames/<id>.png) is never overwritten.
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url)), engine = path.join(here, "..", "engine");
const args = process.argv.slice(2), prodPath = args.find((a) => a.endsWith(".json"));
if (!prodPath) { console.error("Usage: node frames.mjs <production.json>"); process.exit(1); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const base = path.dirname(path.resolve(prodPath)), prod = JSON.parse(fs.readFileSync(prodPath, "utf8"));
const outDir = path.join(base, "frames"); fs.mkdirSync(outDir, { recursive: true });
const [aw, ah] = (prod.brief?.format || "9:16").split(":").map(Number), W = 540, H = Math.round(W * ah / aw);
const has = (id) => ["jpg", "png", "webp"].some((x) => fs.existsSync(path.join(outDir, `${id}.${x}`)));

const graphics = [];
for (const s of prod.shots || []) {
  if (s.status === "dropped" || has(s.id)) continue;
  const take = s.chosen || s.file;
  if (take && fs.existsSync(path.resolve(base, take))) {
    const f = path.resolve(base, take), d = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).stdout.toString();
    spawnSync("ffmpeg", ["-v", "error", "-y", "-ss", String((+d || 2) / 2), "-i", f, "-frames:v", "1", "-vf", `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`, path.join(outDir, `${s.id}.jpg`)]);
    console.log(`· ${s.id}: frame uit ${take}`);
  } else if (s.graphic) graphics.push(s);
}

if (graphics.length) {
  const req = createRequire(path.join(process.cwd(), "noop.js"));
  let pw; try { pw = req("playwright"); } catch { try { pw = req("playwright-core"); } catch { console.error("Missing npm package playwright-core; graphic frames skipped."); process.exit(0); } }
  const launch = { headless: true }, chromium = opt("--chromium") || process.env.CHROMIUM_PATH; if (chromium) launch.executablePath = chromium;
  const browser = await pw.chromium.launch(launch), page = await browser.newPage();
  const fontDir = [path.join(here, "..", "..", "ibs-huisstijl", "assets", "fonts"), path.join(here, "..", "..", "..", "skills", "ibs-huisstijl", "assets", "fonts")].find((d) => fs.existsSync(d));
  const face = (w, f) => fontDir ? `@font-face{font-family:Poppins;font-weight:${w};src:url(data:font/ttf;base64,${fs.readFileSync(path.join(fontDir, f)).toString("base64")})}` : "";
  await page.setContent(`<style>${face(400, "Poppins-Regular.ttf")}${face(600, "Poppins-SemiBold.ttf")}</style><canvas id=c width=${W} height=${H}></canvas>`);
  for (const f of ["motion.js", "fx.js", "ibs-kit.js", "vendor/thinking-orbs.js", "ibs-graphics.js"]) await page.addScriptTag({ path: path.join(engine, f) });
  await page.evaluate(async () => { try { await Promise.all([400, 600].map((w) => document.fonts.load(w + " 20px Poppins"))); } catch (e) {} });
  for (const s of graphics) {
    const data = await page.evaluate((g) => {
      const G = window.IBSGraphics[g.type]; if (!G) return null;
      const a = G.create(Object.assign({}, g)), c = document.getElementById("c");
      a.render(c.getContext("2d"), Math.max(0, a.total - 2)); return c.toDataURL("image/jpeg", 0.9);
    }, s.graphic);
    if (!data) { console.log(`! ${s.id}: onbekende graphic ${s.graphic.type}`); continue; }
    fs.writeFileSync(path.join(outDir, `${s.id}.jpg`), Buffer.from(data.split(",")[1], "base64"));
    console.log(`· ${s.id}: still van graphic ${s.graphic.type}`);
  }
  await browser.close();
}
