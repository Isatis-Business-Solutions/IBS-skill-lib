#!/usr/bin/env node
// Render an ibs-videomontage timeline to an MP4.
//
//   node render.mjs <timeline.json> [--out clip.mp4] [--draft] [--stills] [--chromium <path>]
//
// --draft   half resolution, faster (for checking the edit)
// --stills  no video: writes a contact sheet (one frame every 0.5 s) next to the output, for review
// Needs: ffmpeg/ffprobe on PATH, and the npm package `playwright` or `playwright-core` (with a Chromium).
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skill = path.resolve(here, "..");
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const flag = (name) => args.includes(name);
const tlPath = args.find((a) => a.endsWith(".json"));
if (!tlPath) { console.error("Usage: node render.mjs <timeline.json> [--out clip.mp4] [--draft] [--stills]"); process.exit(1); }

const tl = JSON.parse(fs.readFileSync(tlPath, "utf8"));
const base = path.dirname(path.resolve(tlPath));
const fps = tl.format?.fps || 24;
const aspect = tl.format?.aspect || "9:16";
const [aw, ah] = aspect.split(":").map(Number);
let width = tl.format?.width || (aw < ah ? 1080 : 1920), height = tl.format?.height || Math.round(width * ah / aw);
if (flag("--draft")) { width = Math.round(width / 2 / 2) * 2; height = Math.round(height / 2 / 2) * 2; }
const out = path.resolve(opt("--out") || path.join(base, path.basename(tlPath, ".json") + ".mp4"));
const work = fs.mkdtempSync(path.join(path.dirname(out), ".ibs-render-"));

function run(cmd, a, quiet = true) {
  const r = spawnSync(cmd, a, { stdio: quiet ? ["ignore", "pipe", "pipe"] : "inherit", maxBuffer: 1 << 28 });
  if (r.status !== 0) { console.error(cmd, a.join(" "), "\n", r.stderr?.toString().slice(-2000)); process.exit(1); }
  return r.stdout?.toString() || "";
}
function hasAudio(file) {
  return run("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", file]).trim().length > 0;
}

// 1 · Extract every source as cover-cropped JPEG frames at the target size and fps.
const counts = {}, srcFiles = {};
for (const [id, def] of Object.entries(tl.sources || {})) {
  // A source is a path, or { file, focusX, focusY } to choose where the crop sits (0 = left/top, 1 = right/bottom).
  const rel = typeof def === "string" ? def : def.file, fx = def.focusX ?? 0.5, fy = def.focusY ?? 0.5;
  const file = path.resolve(base, rel); srcFiles[id] = file;
  const dir = path.join(work, "frames", id); fs.mkdirSync(dir, { recursive: true });
  console.log(`· frames: ${id} (${rel})`);
  run("ffmpeg", ["-v", "error", "-i", file, "-vf", `fps=${fps},scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}:(in_w-out_w)*${fx}:(in_h-out_h)*${fy}`, "-q:v", "3", path.join(dir, "%06d.jpg")]);
  counts[id] = fs.readdirSync(dir).length;
}

// 2 · Serve engine, frames and (if found) Poppins from the ibs-huisstijl skill.
const fontDirs = [path.join(skill, "..", "ibs-huisstijl", "assets", "fonts"), path.join(skill, "..", "..", "skills", "ibs-huisstijl", "assets", "fonts")];
const fontDir = fontDirs.find((d) => fs.existsSync(d));
const types = { ".html": "text/html", ".js": "text/javascript", ".jpg": "image/jpeg", ".ttf": "font/ttf" };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]);
  let file = null;
  if (u.startsWith("/frames/")) file = path.join(work, u);
  else if (u.startsWith("/fonts/") && fontDir) file = path.join(fontDir, path.basename(u));
  else file = path.join(skill, "engine", path.basename(u) || "render.html");
  if (!file || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;

// 3 · Render frames in headless Chromium.
const req = createRequire(path.join(process.cwd(), "noop.js"));
let pw; try { pw = req("playwright"); } catch { try { pw = req("playwright-core"); } catch {
  console.error("Missing npm package: run `npm i playwright-core` (or `npm i playwright`) in this folder."); process.exit(1); } }
const launch = { headless: true, args: ["--disable-background-networking", "--disable-component-update"] };
const chromium = opt("--chromium") || process.env.CHROMIUM_PATH;
if (chromium) launch.executablePath = chromium;
const browser = await pw.chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto(`http://127.0.0.1:${port}/render.html`);
const plan = await page.evaluate(([t, c, s]) => window.IBSRender.init(t, c, s), [tl, counts, { width, height }]);
if (!plan.fonts) console.warn("! Poppins not found (install ibs-huisstijl next to this skill); using a fallback font.");
const frames = path.join(work, "out"); fs.mkdirSync(frames);
const stills = flag("--stills");
const step = stills ? Math.round(fps / 2) : 1;
const t0 = Date.now();
for (let f = 0; f < plan.total; f += step) {
  const data = await page.evaluate(([i]) => window.IBSRender.frame(i, 0.9), [f]);
  fs.writeFileSync(path.join(frames, String(f / step + 1).padStart(6, "0") + ".jpg"), Buffer.from(data.split(",")[1], "base64"));
  if (f % (fps * 2) === 0) process.stdout.write(`\r· render ${f}/${plan.total}`);
}
console.log(`\r· render ${plan.total}/${plan.total} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
await browser.close(); server.close();

if (stills) {
  const sheet = out.replace(/\.mp4$/, "") + "-stills.jpg";
  const n = Math.ceil(plan.total / step), cols = 6, rows = Math.ceil(n / cols);
  run("ffmpeg", ["-v", "error", "-y", "-i", path.join(frames, "%06d.jpg"), "-vf", `scale=${aw < ah ? 180 : 320}:-1,tile=${cols}x${rows}`, "-frames:v", "1", sheet]);
  fs.rmSync(work, { recursive: true, force: true });
  console.log("✓ " + sheet);
  process.exit(0);
}

// 4 · Audio: kept source audio per shot, SFX at the plan's events, optional music bed.
const inputs = [], filters = [], labels = [];
const add = (file) => { inputs.push("-i", file); return inputs.length / 2; }; // input 0 is the rendered video
const sec = (frame) => frame / fps;
for (const a of plan.audio) {
  const file = srcFiles[a.src]; if (!file || !hasAudio(file)) continue;
  const i = add(file), l = `a${labels.length}`;
  filters.push(`[${i}:a]atrim=start=${a.in}:duration=${sec(a.len)},asetpts=PTS-STARTPTS,volume=${a.gain},adelay=${Math.round(sec(a.frame) * 1000)}:all=1[${l}]`); labels.push(l);
}
const sfxDir = path.join(skill, "assets", "sfx");
for (const e of plan.events) {
  const file = path.join(sfxDir, e.type + ".wav"); if (!fs.existsSync(file)) continue;
  const i = add(file), l = `a${labels.length}`;
  if (e.type === "riser") {
    const d = Math.min(1.8, sec(e.len)), startMs = Math.round((sec(e.frame + e.len) - d) * 1000);
    filters.push(`[${i}:a]atrim=start=${1.8 - d},asetpts=PTS-STARTPTS,volume=0.7,adelay=${Math.max(0, startMs)}:all=1[${l}]`);
  } else filters.push(`[${i}:a]volume=${e.type === "hit" ? 0.9 : 0.5},adelay=${Math.round(sec(e.frame) * 1000)}:all=1[${l}]`);
  labels.push(l);
}
if (tl.audio?.music) {
  const i = add(path.resolve(base, tl.audio.music)), l = `a${labels.length}`, total = sec(plan.total);
  filters.push(`[${i}:a]atrim=duration=${total},asetpts=PTS-STARTPTS,volume=${tl.audio.musicGain ?? 0.18},afade=t=out:st=${Math.max(0, total - 1)}:d=1[${l}]`); labels.push(l);
}
const video = path.join(work, "video.mp4");
run("ffmpeg", ["-v", "error", "-y", "-framerate", String(fps), "-i", path.join(frames, "%06d.jpg"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", flag("--draft") ? "26" : "21", "-maxrate", "10M", "-bufsize", "20M", "-preset", "medium", "-movflags", "+faststart", video]);
if (labels.length) {
  const mix = `${filters.join(";")};${labels.map((l) => `[${l}]`).join("")}amix=inputs=${labels.length}:normalize=0,alimiter=limit=0.95,apad[mix]`;
  run("ffmpeg", ["-v", "error", "-y", "-i", video, ...inputs, "-filter_complex", mix, "-map", "0:v", "-map", "[mix]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", out]);
} else fs.copyFileSync(video, out);
fs.rmSync(work, { recursive: true, force: true });
console.log(`✓ ${out} · ${(plan.total / fps).toFixed(1)} s · ${width}×${height} · ${fps} fps`);
