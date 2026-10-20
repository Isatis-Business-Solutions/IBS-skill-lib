#!/usr/bin/env node
// Build the storyboard page from production.json: one self-contained HTML file (images and fonts inline) in
// the IBS house style, for the user to read and approve shot by shot.
//
//   node storyboard.mjs <production.json> [--out storyboard.html]
//
// Frames come from frames/<id>.(png|jpg|webp); a shot without one gets a sketch of its framing and move.
// Approvals are kept in the viewer's browser and copied as text for the chat; the agent writes them into
// production.json.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), prodPath = args.find((a) => a.endsWith(".json"));
if (!prodPath) { console.error("Usage: node storyboard.mjs <production.json> [--out storyboard.html]"); process.exit(1); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const base = path.dirname(path.resolve(prodPath)), p = JSON.parse(fs.readFileSync(prodPath, "utf8"));
const out = path.resolve(opt("--out") || path.join(base, "storyboard.html"));

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const uri = (file) => `data:${{ ".png": "image/png", ".webp": "image/webp" }[path.extname(file)] || "image/jpeg"};base64,${fs.readFileSync(file).toString("base64")}`;
const frameOf = (id) => ["png", "jpg", "webp"].map((x) => path.join(base, "frames", `${id}.${x}`)).find((f) => fs.existsSync(f));

const fontDir = [path.join(here, "..", "..", "ibs-huisstijl", "assets", "fonts"), path.join(here, "..", "..", "..", "skills", "ibs-huisstijl", "assets", "fonts")].find((d) => fs.existsSync(d));
const fonts = fontDir ? [[300, "Light"], [400, "Regular"], [600, "SemiBold"]].map(([w, n]) => {
  const f = path.join(fontDir, `Poppins-${n}.ttf`); return fs.existsSync(f) ? `@font-face{font-family:Poppins;font-weight:${w};src:url(data:font/ttf;base64,${fs.readFileSync(f).toString("base64")}) format("truetype")}` : "";
}).join("") : "";

const SIZE = { ews: ["Extreme wide", 0.16], ws: ["Wide", 0.32], ms: ["Medium", 0.55], mcu: ["Medium close-up", 0.75], cu: ["Close-up", 1.0], ecu: ["Extreme close-up", 1.6] };
const MOVE = { locked: "Locked-off", push: "Push-in", pull: "Pull-out", pan: "Pan", tilt: "Tilt", crane: "Crane / drone", track: "Tracking", hand: "Handheld" };
const SRC = { gen: "Gegenereerd", combo: "Gegenereerd + laag", code: "Motion graphic", real: "Echt beeld" };

// Sketch of a shot without a frame: a figure at the shot size's scale, the camera move as an arrow.
function sketch(s) {
  const k = (SIZE[s.size] || ["", 0.5])[1], cx = 90, cy = 175, h = 230 * k, arrow = {
    push: `<path d="M60 300 L90 270 L120 300" />`, pull: `<path d="M60 270 L90 300 L120 270" />`, pan: `<path d="M50 290 H130 M118 280 L130 290 L118 300" />`,
    tilt: `<path d="M90 310 V260 M80 272 L90 260 L100 272" />`, crane: `<path d="M50 305 Q90 250 130 270 M120 262 L130 270 L119 278" />`,
    track: `<path d="M45 295 H135 M45 285 V305 M135 285 V305" />`, hand: `<path d="M50 290 q10 -12 20 0 t20 0 t20 0 t20 0" />`, locked: `<path d="M75 290 H105 M90 280 V300" />` }[s.move] || "";
  const fig = s.source === "code" ? `<rect x="35" y="110" width="110" height="120" rx="12" fill="none" stroke="#F9C852" stroke-opacity=".6"/><path d="M50 140 H130 M50 160 H110 M50 180 H120" stroke="#FEF9ED" stroke-opacity=".4"/>`
    : `<g transform="translate(${cx},${cy}) scale(${k})" fill="none" stroke="#FEF9ED" stroke-opacity=".55" stroke-width="${2 / k}"><circle cx="0" cy="-70" r="22"/><path d="M-45 60 Q-40 -30 0 -38 Q40 -30 45 60"/></g>`;
  return `<svg viewBox="0 0 180 320" class="sk"><rect width="180" height="320" fill="#1f1e1b"/><path d="M0 220 H180" stroke="#3A3A3A"/>${fig}<g fill="none" stroke="#F9C852" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${arrow}</g><text x="10" y="20" fill="#9A958C" font-size="10" font-family="Poppins,sans-serif">schets</text></svg>`;
}

function curve(beats, shots) {
  const W = 1000, H = 120, pad = 20, len = (n) => shots.filter((s) => s.beat === n).reduce((a, s) => a + (s.seconds || 0), 0) || 1;
  const total = beats.reduce((a, b) => a + len(b.n), 0); let t = 0;
  const pts = beats.map((b) => { const w = len(b.n), x = pad + (t + w / 2) / total * (W - 2 * pad); t += w; return [x, b.phase === "tension" ? 30 : 88, b]; });
  let d = `M${pad},${pts[0][1]}`; pts.forEach(([x, y], i) => { const px = i ? pts[i - 1][0] : pad, py = i ? pts[i - 1][1] : pts[0][1]; d += ` C${(px + x) / 2},${py} ${(px + x) / 2},${y} ${x},${y}`; }); d += ` L${W - pad},${pts[pts.length - 1][1]}`;
  t = 0; const seps = beats.map((b) => { const x = pad + t / total * (W - 2 * pad); t += len(b.n); return `<line x1="${x}" x2="${x}" y1="8" y2="${H - 6}" stroke="#3A3A3A"/>`; }).join("");
  return `<svg viewBox="0 0 ${W} ${H + 42}" class="curve">${seps}<path d="${d} L${W - pad},${H} L${pad},${H}Z" fill="rgba(249,200,82,.12)"/><path d="${d}" fill="none" stroke="#F9C852" stroke-width="3"/>` +
    pts.map(([x, y, b]) => `<circle cx="${x}" cy="${y}" r="6" fill="${b.phase === "tension" ? "#F9C852" : "#9A958C"}"/><text x="${x}" y="${H + (b.n % 2 ? 17 : 34)}" text-anchor="middle" font-size="15" fill="#9A958C">${b.n} · ${esc(b.name)}</text>`).join("") +
    `<text x="${pad}" y="20" font-size="13" fill="#9A958C">TENSION</text><text x="${pad}" y="${H - 4}" font-size="13" fill="#9A958C">RELEASE</text></svg>`;
}

const shots = (p.shots || []).filter((s) => s.status !== "dropped"), beats = p.skeleton?.beats || [], b = p.brief || {};
const total = shots.reduce((a, s) => a + (s.seconds || 0), 0);
const cap = (c) => c?.text ? esc(c.text).replace(new RegExp(`(${esc(c.key || "\u0000").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i"), "<em>$1</em>") : "";
const card = (s) => {
  const fr = frameOf(s.id), size = SIZE[s.size]?.[0], move = MOVE[s.move];
  const specs = [SRC[s.source], size && `${size} (${s.size.toUpperCase()})`, move, s.graphic && `graphic: ${s.graphic.type}`, s.seconds && `${s.seconds} s in beeld`, s.gen_seconds && `genereer ${s.gen_seconds} s · ${s.aspect || b.format || "9:16"}`].filter(Boolean);
  const prompt = s.prompt ? `${s.prompt}\n\n${(p.styles || {})[s.style] || ""}`.trim() : "";
  const frames = s.frames ? Object.entries(s.frames).map(([k, v]) => `<li><b>${k === "first" ? "First frame" : k === "last" ? "Last frame" : k}:</b> ${esc(v)}</li>`).join("") : "";
  return `<article class="shot ${esc(s.phase)}" data-id="${esc(s.id)}">
  <div class="frame">${fr ? `<img src="${uri(fr)}" alt="${esc(s.id)}">` : sketch(s)}${s.caption?.text ? `<div class="cap">${cap(s.caption)}</div>` : ""}</div>
  <div class="body">
    <div class="head"><span class="id">${esc(s.id)}</span><h3>${esc(s.title)}</h3><span class="phase">${s.phase === "tension" ? "tension" : "release"}</span></div>
    <p class="thinks">“${esc(s.thinks || "")}”</p>
    <ul class="chips">${specs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    ${s.notes?.length ? `<p class="notes">${s.notes.map(esc).join("<br>")}</p>` : ""}
    ${prompt ? `<details><summary>Videoprompt</summary><pre>${esc(prompt)}</pre><button class="btn copy" data-copy="${esc(prompt)}">Kopieer prompt</button></details>` : ""}
    ${s.keyframe_prompt ? `<details><summary>Keyframe-prompt</summary><pre>${esc(s.keyframe_prompt)}</pre><button class="btn copy" data-copy="${esc(s.keyframe_prompt)}">Kopieer</button></details>` : ""}
    ${frames ? `<ul class="frames">${frames}</ul>` : ""}
    <div class="approve"><button class="btn ok">Akkoord</button><button class="btn change">Aanpassen</button><textarea placeholder="Wat moet er anders?" rows="2"></textarea></div>
  </div></article>`;
};

const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Storyboard · ${esc(p.project)}</title>
<style>${fonts}
:root{--bg:#171717;--card:#1f1e1b;--line:#3A3A3A;--text:#FEF9ED;--muted:#9A958C;--accent:#F9C852;--ok:#7FB77E;--bad:#D9725B}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 100% 0,rgba(97,63,15,.75),rgba(97,63,15,0) 45%) fixed no-repeat,var(--bg);color:var(--text);font:16px/1.55 Poppins,"Segoe UI",Arial,sans-serif}
main{max-width:1100px;margin:0 auto;padding:40px 16px 80px}
.eyebrow{font-size:.72rem;letter-spacing:.22em;color:var(--muted);text-transform:uppercase;font-weight:600}
h1{font-weight:300;font-size:2.2rem;margin:.3rem 0 1.2rem;line-height:1.15}h1 b{font-weight:600;color:var(--accent)}
h2{font-weight:600;font-size:1.25rem;margin:2.6rem 0 .8rem}
.brief{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
.brief div{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 14px}.brief b{display:block;font-size:.7rem;letter-spacing:.18em;color:var(--muted);text-transform:uppercase;margin-bottom:2px}
.brief .goal{grid-column:1/-1;border-color:rgba(249,200,82,.5)}
.curve{width:100%;height:auto;display:block;margin:.4rem 0;font-family:Poppins,sans-serif}
.progress{display:flex;gap:10px;align-items:center;flex-wrap:wrap;color:var(--muted);font-size:.9rem}.bar{flex:1;min-width:160px;height:8px;border-radius:4px;background:var(--line);overflow:hidden}.bar i{display:block;height:100%;width:0;background:var(--accent);transition:width .3s}
.beat{margin-top:2rem;padding-top:1rem;border-top:1px solid var(--line)}.beat h2{margin:0 0 .2rem}.beat p{margin:0 0 1rem;color:var(--muted)}
.beat .tag{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;padding:2px 8px;border-radius:999px;margin-left:8px;vertical-align:middle}
.tag.tension{background:var(--accent);color:#171717}.tag.release{border:1px solid var(--muted);color:var(--muted)}
.shot{display:grid;grid-template-columns:220px 1fr;gap:18px;background:var(--card);border:1px solid var(--line);border-left:4px solid var(--muted);border-radius:16px;padding:14px;margin-bottom:14px}
.shot.tension{border-left-color:var(--accent)}.shot.approved{border-color:rgba(127,183,126,.6)}.shot.changes{border-color:rgba(217,114,91,.7)}
@media(max-width:640px){.shot{grid-template-columns:1fr}.frame{max-width:260px;margin:0 auto}}
.frame{position:relative;aspect-ratio:9/16;border-radius:12px;overflow:hidden;background:#111}.frame img,.frame .sk{width:100%;height:100%;object-fit:cover;display:block}
.cap{position:absolute;left:6%;right:6%;bottom:9%;text-align:center;font-weight:600;font-size:.95rem;line-height:1.2;text-shadow:0 2px 8px rgba(0,0,0,.8)}.cap em{font-style:normal;color:var(--accent)}
.head{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}.head h3{margin:0;font-size:1.1rem;font-weight:600}.id{font-weight:600;color:var(--accent)}
.phase{margin-left:auto;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.thinks{font-style:italic;color:var(--text);margin:.4rem 0}.notes{color:var(--muted);font-size:.85rem}
.chips{list-style:none;padding:0;margin:.5rem 0;display:flex;flex-wrap:wrap;gap:6px}.chips li{font-size:.78rem;border:1px solid var(--line);border-radius:999px;padding:2px 10px;color:var(--muted)}
details{margin:.4rem 0;border:1px solid var(--line);border-radius:10px;padding:6px 10px}summary{cursor:pointer;font-weight:600;font-size:.88rem}
pre{white-space:pre-wrap;font:.78rem/1.5 ui-monospace,Menlo,monospace;color:#e8e0cf;margin:.5rem 0}
.frames{font-size:.82rem;color:var(--muted);padding-left:1.1rem;margin:.4rem 0}
.btn{font:600 .85rem Poppins,sans-serif;border-radius:10px;padding:.5rem .9rem;cursor:pointer;border:2px solid var(--text);background:transparent;color:var(--text)}
.btn.ok{background:var(--accent);border-color:var(--accent);color:#171717}.btn.copy{border-width:1px;font-size:.78rem;padding:.3rem .7rem}
.approve{display:flex;gap:8px;flex-wrap:wrap;margin-top:.8rem;align-items:flex-start}.approve textarea{flex:1 1 100%;display:none;background:#171717;color:var(--text);border:1px solid var(--line);border-radius:10px;padding:8px;font:inherit;font-size:.88rem}
.shot.changes textarea{display:block}
.open li{margin-bottom:.3rem}.feedback{position:fixed;left:0;right:0;bottom:0;display:flex;justify-content:center;padding:10px 16px;background:rgba(23,23,23,.92);border-top:1px solid var(--line)}
.feedback .btn{background:var(--accent);border-color:var(--accent);color:#171717}
@media print{.approve,.feedback,details button{display:none}body{background:#fff;color:#000}.shot{break-inside:avoid}}
</style></head><body><main>
<div class="eyebrow">Storyboard · shotlijst</div>
<h1>${esc(p.project)} <b>· ${shots.length} shots, ${Math.round(total)} s</b></h1>
<section class="brief">
<div class="goal"><b>Doel</b>${esc(b.goal)}</div>
<div><b>Product</b>${esc(b.product)}</div><div><b>Koper</b>${esc(b.buyer)}</div><div><b>Gebruiker</b>${esc(b.user)}</div>
<div><b>Kern</b>${esc(b.core)}</div><div><b>CTA</b>${esc(b.cta || "–")}</div><div><b>Formaat</b>${esc([b.format, b.length_s && b.length_s + " s", (b.channel || []).join(", ")].filter(Boolean).join(" · "))}</div>
</section>
<h2>Skelet · ${esc(p.skeleton?.shape || "")}</h2>
${beats.length ? curve(beats, shots) : ""}
<div class="progress"><span id="count">0 van ${shots.length} goedgekeurd</span><div class="bar"><i id="bar"></i></div></div>
${beats.map((x) => `<section class="beat"><h2>${x.n} · ${esc(x.name)}<span class="tag ${esc(x.phase)}">${esc(x.phase)}</span></h2><p>Kijker denkt: “${esc(x.thinks || "")}”</p>${shots.filter((s) => s.beat === x.n).map(card).join("")}</section>`).join("")}
${(p.open || []).length ? `<h2>Open vragen</h2><ul class="open">${p.open.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>` : ""}
<div class="feedback"><button class="btn" id="copyfb">Kopieer feedback voor de chat</button></div>
</main>
<script>
(function(){
  var KEY="storyboard:"+${JSON.stringify(String(p.project || ""))}, st={};
  try{st=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
  var cards=[].slice.call(document.querySelectorAll(".shot"));
  function paint(){var n=0;cards.forEach(function(c){var s=st[c.dataset.id]||{};c.classList.toggle("approved",s.status==="approved");c.classList.toggle("changes",s.status==="changes");c.querySelector("textarea").value=s.note||"";if(s.status==="approved")n++});
    document.getElementById("count").textContent=n+" van "+cards.length+" goedgekeurd";document.getElementById("bar").style.width=(n/cards.length*100)+"%"}
  cards.forEach(function(c){var id=c.dataset.id;
    c.querySelector(".ok").onclick=function(){st[id]={status:"approved"};save();paint()};
    c.querySelector(".change").onclick=function(){st[id]={status:"changes",note:(st[id]||{}).note||""};save();paint();c.querySelector("textarea").focus()};
    c.querySelector("textarea").oninput=function(e){st[id]={status:"changes",note:e.target.value};save()};});
  function copy(t,b,label){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){b.textContent="✓ Gekopieerd"},function(){prompt("Kopieer:",t)});setTimeout(function(){b.textContent=label},1600)}
  [].forEach.call(document.querySelectorAll(".copy"),function(b){b.onclick=function(){copy(b.dataset.copy,b,b.textContent)}});
  document.getElementById("copyfb").onclick=function(){var lines=cards.map(function(c){var s=st[c.dataset.id]||{};return c.dataset.id+": "+(s.status==="approved"?"akkoord":s.status==="changes"?"aanpassen: "+(s.note||"(geen toelichting)"):"nog niet bekeken")});
    copy("Feedback storyboard "+${JSON.stringify(String(p.project || ""))}+"\\n"+lines.join("\\n"),this,"Kopieer feedback voor de chat")};
  paint();
})();
</script></body></html>`;
fs.writeFileSync(out, html);
console.log(`✓ ${path.relative(process.cwd(), out) || out} · ${shots.length} shots · ${(html.length / 1e6).toFixed(1)} MB`);
