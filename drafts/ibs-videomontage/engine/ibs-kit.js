// IBS edit kit: the montage assets that fit the IBS signature, rendered frame by frame on a canvas
// (24 fps), so every asset can be previewed, scrubbed and rebuilt exactly. Needs fx.js and motion.js.
//
// Each asset: IBSKit.<name>.create(opts) → { total: frames, render(ctx, f, src) }
//   src = { A: canvas, B: canvas } (scene A / scene B, same size as ctx.canvas)
(function () {
  var GOLD = "#F9C852", DARK = "#171717", CREAM = "#FEF9ED", MUTED = "#9A958C", AMBER = "#C9A24A";
  var FONT = "Poppins, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
  var MARK = ["M37 42 L123 31 L103 100 L121 211 L55 190 Z", "M57 197 L121 217 L234 202 L214 266 L67 285 Z",
    "M130 31 L277 12 L290 99 L224 79 L110 96 Z", "M225 85 L291 106 L310 254 L222 264 L242 200 Z"];
  var MARK2D = null;
  function E(name, x) { var M = window.Motion; return M.bezier(M.EASES[name].curve)(Math.max(0, Math.min(1, x))); }
  function seg(f, a, b) { return Math.max(0, Math.min(1, (f - a) / (b - a))); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // The mark centred on (cx, cy), `size` px wide, rotated by `rot` degrees.
  function mark(ctx, cx, cy, size, rot, color, planes) {
    if (!MARK2D) MARK2D = MARK.map(function (d) { return new Path2D(d); });
    ctx.save(); ctx.translate(cx, cy); ctx.rotate((rot || 0) * Math.PI / 180); ctx.scale(size / 287, size / 287); ctx.translate(-173.5, -148.5);
    ctx.fillStyle = color || GOLD;
    MARK2D.forEach(function (p, i) {
      if (planes) { var o = planes[i]; ctx.save(); ctx.globalAlpha = o.a; ctx.translate(173.5 + o.x, 148.5 + o.y); ctx.rotate(o.r * Math.PI / 180); ctx.translate(-173.5, -148.5); ctx.fill(p); ctx.restore(); }
      else ctx.fill(p);
    });
    ctx.restore();
  }
  function bgDark(ctx, W, H) {
    ctx.fillStyle = DARK; ctx.fillRect(0, 0, W, H);
    var g = ctx.createRadialGradient(W, 0, 0, W, 0, W * 1.1); g.addColorStop(0, "rgba(97,63,15,.75)"); g.addColorStop(1, "rgba(97,63,15,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  // The IBS divider: thin double line with the small IBS mark in the middle (never a plain square).
  var DIV_MARK = 11; // mark width in canvas units (1 unit = width / 180)
  function divider(ctx, cx, cy, half, u, alpha, withMark) {
    var gap = DIV_MARK * 0.75 * u; ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = MUTED;
    [-3, 2].forEach(function (dy) { ctx.fillRect(cx - gap - half, cy + dy * u, half, u); ctx.fillRect(cx + gap, cy + dy * u, half, u); });
    if (withMark !== false) mark(ctx, cx, cy, DIV_MARK * u, 0, GOLD);
    ctx.restore();
  }

  // ---------- 1 · Logo assemble (outro) ----------
  var logoAssemble = { create: function (o) {
    o = Object.assign({ stagger: 3, frames: 12, ease: "easeOut", hold: 18 }, o);
    var OFF = [[-140, -60, -40], [-60, 160, 30], [120, -150, 35], [160, 80, -30]];
    var total = 3 * o.stagger + o.frames + o.hold;
    return { total: total, opts: o, render: function (ctx, f) {
      var W = ctx.canvas.width, H = ctx.canvas.height; bgDark(ctx, W, H);
      var planes = OFF.map(function (v, i) { var t = E(o.ease, seg(f, i * o.stagger, i * o.stagger + o.frames)); return { x: v[0] * (1 - t), y: v[1] * (1 - t), r: v[2] * (1 - t), a: Math.min(1, t * 1.5) }; });
      mark(ctx, W / 2, H / 2, W * 0.42, 0, GOLD, planes);
      return { hit: f === 3 * o.stagger + Math.round(o.frames * 0.75) };
    } };
  } };

  // ---------- 2 · Logo spin → divider → split wipe ----------
  // In: whole logo rotates in from large to normal size (rotation with overshoot, scale ease-out).
  // Hold. Out: rotates and shrinks (ease-in) into the yellow square of the IBS divider; the lines draw out;
  // then the two lines open up and reveal scene B between them.
  var logoSpin = { create: function (o) {
    o = Object.assign({ inF: 26, hold: 14, outF: 12, lineF: 8, openF: 12, startScale: 3, startRot: -110, after: 10 }, o);
    var t1 = o.inF, t2 = t1 + o.hold, t3 = t2 + o.outF, t4 = t3 + o.lineF, t5 = t4 + o.openF, total = t5 + o.after;
    return { total: total, opts: o, phases: [0, t1, t2, t3, t4, t5], render: function (ctx, f, src) {
      var W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180, base = W * 0.36, dm = DIV_MARK * u, cy = H / 2;
      if (f >= t4 && src && src.B) {
        // split wipe: the two divider lines move apart, scene B appears between them
        var p = E("easeInOut", seg(f, t4, t5)), gap = lerp(2.5 * u, H / 2 + 4 * u, p);
        ctx.drawImage(src.B, 0, 0, W, H);
        bgDark(ctx, W, H); // dark outside the opening
        ctx.save(); ctx.beginPath(); ctx.rect(0, cy - gap, W, gap * 2); ctx.clip(); ctx.drawImage(src.B, 0, 0, W, H); ctx.restore();
        ctx.fillStyle = MUTED; ctx.fillRect(0, cy - gap - u, W, u); ctx.fillRect(0, cy + gap, W, u);
        ctx.save(); ctx.globalAlpha = 1 - p; mark(ctx, W / 2, cy, dm, 0, GOLD); ctx.restore();
        return { phase: "split wipe naar scène B" };
      }
      bgDark(ctx, W, H);
      if (f < t1) {
        var a = seg(f, 0, t1);
        mark(ctx, W / 2, cy, base * lerp(o.startScale, 1, E("easeOut", a)), o.startRot * (1 - E("overshoot", a)), GOLD);
        return { phase: "in: draaien met overshoot, schalen met ease-out" };
      }
      if (f < t2) { mark(ctx, W / 2, cy, base, 0, GOLD); return { phase: "hold", hit: f === t1 }; }
      if (f < t3) {
        var b = E("easeIn", seg(f, t2, t3)), size = lerp(base, dm, b);
        mark(ctx, W / 2, cy, size, 360 * b, GOLD);
        return { phase: "uit: kleiner draaien met ease-in, tot het merkteken van de divider" };
      }
      divider(ctx, W / 2, cy, (W / 2 - dm) * E("easeOut", seg(f, t3, t4)), u);
      return { phase: "divider tekent naar buiten" };
    } };
  } };

  // ---------- 3 · Object detection callout, with tracking ----------
  // det = { label, conf, at (start frame), track(f) → {x, y, w, h} in canvas px }
  function bracketBox(ctx, x, y, w, h, u, alpha) {
    var g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, GOLD); g.addColorStop(1, AMBER);
    ctx.save(); ctx.globalAlpha = alpha;
    var fill = ctx.createLinearGradient(x, y, x, y + h); fill.addColorStop(0, "rgba(249,200,82,.16)"); fill.addColorStop(1, "rgba(249,200,82,0)");
    ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(249,200,82,.45)"; ctx.lineWidth = u * 0.8; ctx.strokeRect(x, y, w, h);
    var c = Math.min(w, h) * 0.22; ctx.strokeStyle = g; ctx.lineWidth = 2.2 * u; ctx.lineCap = "round";
    [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(function (k) {
      ctx.beginPath(); ctx.moveTo(k[0] + k[2] * c, k[1]); ctx.lineTo(k[0], k[1]); ctx.lineTo(k[0], k[1] + k[3] * c); ctx.stroke();
    });
    ctx.restore();
  }
  function consoleLabel(ctx, x, y, text, chars, u, alpha) {
    var shown = text.slice(0, chars), fs = 7.5 * u;
    ctx.save(); ctx.globalAlpha = alpha; ctx.font = "600 " + fs + "px " + MONO;
    var w = ctx.measureText(text).width + 10 * u, h = fs + 7 * u, ly = Math.max(2 * u, y - h - 3 * u);
    x = Math.max(2 * u, Math.min(x, ctx.canvas.width - w - 2 * u));
    ctx.fillStyle = "rgba(23,23,23,.82)"; roundRect(ctx, x, ly, w, h, 3 * u); ctx.fill();
    ctx.fillStyle = GOLD; ctx.fillRect(x, ly, 2 * u, h);
    ctx.fillStyle = CREAM; ctx.fillText(shown + (chars < text.length && Math.floor(chars) % 2 === 0 ? "▌" : ""), x + 6 * u, ly + h - 4.5 * u);
    ctx.restore();
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }
  var detect = { create: function (o) {
    o = Object.assign({ dets: [], life: 36, inF: 7, look: "edges", flashIn: [3, 6], flashOut: 3, outF: 6 }, o);
    var total = o.dets.reduce(function (m, d) { return Math.max(m, d.at + o.life); }, 0) + 8;
    var roi = document.createElement("canvas"), roiFx = document.createElement("canvas");
    return { total: total, opts: o, render: function (ctx, f, src) {
      var W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180;
      ctx.drawImage(src.A, 0, 0, W, H);
      var info = [];
      o.dets.forEach(function (d) {
        var l = f - d.at; if (l < 0 || l >= o.life) return;
        var b = d.track(f), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
        var sIn = E("overshoot", seg(l, 0, o.inF)), sOut = E("easeIn", seg(l, o.life - o.outF, o.life)), s = Math.max(0.0001, lerp(0.15, 1, sIn) * (1 - sOut));
        var w = b.w * s, h = b.h * s, x = cx - w / 2, y = cy - h / 2;
        var fxOn = (l >= o.flashIn[0] && l < o.flashIn[1]) || (l >= o.life - o.outF - o.flashOut && l < o.life - o.outF);
        if (fxOn && w > 4 && h > 4) {
          roi.width = Math.ceil(w); roi.height = Math.ceil(h);
          roi.getContext("2d").drawImage(src.A, x, y, w, h, 0, 0, roi.width, roi.height);
          window.FX.apply(o.look, roi, roiFx, { dark: DARK, light: GOLD, t: f / 24 });
          ctx.drawImage(roiFx, x, y, w, h);
        }
        bracketBox(ctx, x, y, w, h, u, Math.min(1, s * 1.4));
        var txt = "▸ " + d.label + "  " + d.conf.toFixed(2);
        consoleLabel(ctx, x, y, txt, Math.max(0, (l - 2) * 2.2), u, 1 - sOut);
        info.push(d.label + (fxOn ? " (FX)" : ""));
      });
      return { phase: info.length ? "detecties: " + info.join(", ") : "geen detectie" };
    } };
  } };

  // Template-matching tracker: follow a patch from a tapped point through the source canvas.
  function tracker(srcCanvas, x, y, patch) {
    patch = patch || Math.round(srcCanvas.width / 9);
    var W = srcCanvas.width, H = srcCanvas.height, ctx = srcCanvas.getContext("2d", { willReadFrequently: true }), tpl = null, pos = { x: x, y: y }, R = Math.round(patch * 0.6);
    function gray() { var d = ctx.getImageData(0, 0, W, H).data, g = new Float32Array(W * H); for (var i = 0; i < W * H; i++) g[i] = d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11; return g; }
    function grab(g, cx, cy) { var t = new Float32Array(patch * patch), h = patch >> 1; for (var j = 0; j < patch; j++) for (var i = 0; i < patch; i++) t[j * patch + i] = g[Math.min(H - 1, Math.max(0, cy - h + j)) * W + Math.min(W - 1, Math.max(0, cx - h + i))]; return t; }
    return { step: function () {
      var g = gray(), h = patch >> 1;
      if (!tpl) { tpl = grab(g, Math.round(pos.x), Math.round(pos.y)); return pos; }
      var best = 1e18, bx = pos.x, by = pos.y;
      for (var dy = -R; dy <= R; dy += 2) for (var dx = -R; dx <= R; dx += 2) {
        var cx = Math.round(pos.x + dx), cy = Math.round(pos.y + dy), sad = 0;
        if (cx - h < 0 || cy - h < 0 || cx + h >= W || cy + h >= H) continue;
        for (var j = 0; j < patch; j += 2) { var row = (cy - h + j) * W + cx - h; for (var i = 0; i < patch; i += 2) sad += Math.abs(g[row + i] - tpl[j * patch + i]); }
        if (sad < best) { best = sad; bx = cx; by = cy; }
      }
      pos = { x: bx, y: by };
      var fresh = grab(g, bx, by); for (var k = 0; k < tpl.length; k++) tpl[k] = tpl[k] * 0.9 + fresh[k] * 0.1;
      return pos;
    }, pos: function () { return pos; } };
  }

  // ---------- 4 · Glass card (glassmorphism) ----------
  var glass = { create: function (o) {
    o = Object.assign({ eyebrow: "RESULTAAT", title: "+38%", sub: "minder zoektijd", inF: 8, hold: 30, outF: 6, blur: 10 }, o);
    var total = 6 + o.inF + o.hold + o.outF + 6;
    return { total: total, opts: o, render: function (ctx, f, src) {
      var W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180;
      ctx.drawImage(src.A, 0, 0, W, H);
      var a = E("easeOut", seg(f, 6, 6 + o.inF)), z = E("easeIn", seg(f, 6 + o.inF + o.hold, 6 + o.inF + o.hold + o.outF)), v = a * (1 - z);
      if (v <= 0) return { phase: "achtergrond" };
      var cw = W * 0.78, ch = H * 0.24, cx = (W - cw) / 2, cy = H * 0.56, sc = lerp(0.96, 1, a), r = 14 * u;
      ctx.save(); ctx.globalAlpha = v; ctx.translate(W / 2, cy + ch / 2); ctx.scale(sc, sc); ctx.translate(-W / 2, -(cy + ch / 2));
      roundRect(ctx, cx, cy, cw, ch, r); ctx.save(); ctx.clip();
      ctx.filter = "blur(" + (o.blur * u * a).toFixed(1) + "px) saturate(1.2)"; ctx.drawImage(src.A, 0, 0, W, H); ctx.filter = "none";
      ctx.fillStyle = "rgba(254,249,237,.10)"; ctx.fillRect(cx, cy, cw, ch);
      var hl = ctx.createLinearGradient(cx, cy, cx, cy + ch); hl.addColorStop(0, "rgba(254,249,237,.22)"); hl.addColorStop(0.4, "rgba(254,249,237,0)"); ctx.fillStyle = hl; ctx.fillRect(cx, cy, cw, ch);
      var acc = ctx.createLinearGradient(cx, cy, cx, cy + ch); acc.addColorStop(0, GOLD); acc.addColorStop(1, "rgba(249,200,82,0)"); ctx.fillStyle = acc; ctx.fillRect(cx, cy, 2.5 * u, ch);
      ctx.restore();
      roundRect(ctx, cx, cy, cw, ch, r); ctx.strokeStyle = "rgba(254,249,237,.35)"; ctx.lineWidth = u; ctx.stroke();
      ctx.fillStyle = MUTED; ctx.font = "600 " + (6.5 * u) + "px " + FONT; ctx.fillText(o.eyebrow.split("").join(String.fromCharCode(8202)), cx + 12 * u, cy + 16 * u);
      ctx.fillStyle = GOLD; ctx.font = "600 " + (26 * u) + "px " + FONT; ctx.fillText(o.title, cx + 12 * u, cy + 45 * u);
      ctx.fillStyle = CREAM; ctx.font = "400 " + (9 * u) + "px " + FONT; ctx.fillText(o.sub, cx + 12 * u, cy + 60 * u);
      ctx.restore();
      return { phase: a < 1 ? "in: ease-out, blur en schaal" : z > 0 ? "uit: ease-in" : "hold" };
    } };
  } };

  // ---------- 5 · Kinetic captions (stagger 3 f, overshoot) ----------
  var captions = { create: function (o) {
    o = Object.assign({ text: "Eerst het werk.", key: "werk", stagger: 3, frames: 10, ease: "overshoot", hold: 24 }, o);
    var words = o.text.split(/\s+/), total = (words.length - 1) * o.stagger + o.frames + o.hold;
    return { total: total, opts: o, render: function (ctx, f, src) {
      var W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180, fs = 18 * u;
      ctx.drawImage(src.A, 0, 0, W, H);
      ctx.font = "600 " + fs + "px " + FONT;
      var full = ctx.measureText(o.text).width;
      if (full > W * 0.86) { fs = fs * W * 0.86 / full; ctx.font = "600 " + fs + "px " + FONT; }
      var sp = fs * 0.3, ws = words.map(function (w) { return ctx.measureText(w).width; }), x = (W - ws.reduce(function (a, b) { return a + b; }, 0) - sp * (words.length - 1)) / 2, y = H * 0.82;
      words.forEach(function (w, i) {
        var t = seg(f, i * o.stagger, i * o.stagger + o.frames), e = E(o.ease, t);
        ctx.save(); ctx.globalAlpha = Math.min(1, t * 2); ctx.fillStyle = w.replace(/[.,!?]/g, "") === o.key ? GOLD : CREAM;
        ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = 6 * u; ctx.fillText(w, x, y + (1 - e) * 14 * u); ctx.restore();
        x += ws[i] + sp;
      });
      return { phase: "stagger " + o.stagger + " f · " + o.ease };
    } };
  } };

  // ---------- 6 · FX flash on the cut ----------
  var flashCut = { create: function (o) {
    o = Object.assign({ look: "edges", n: 6, before: 18, after: 24 }, o);
    var buf = document.createElement("canvas");
    return { total: o.before + o.n + o.after, opts: o, render: function (ctx, f, src) {
      var W = ctx.canvas.width, H = ctx.canvas.height;
      if (f < o.before) { ctx.drawImage(src.A, 0, 0, W, H); return { phase: "scène A" }; }
      if (f < o.before + o.n) {
        buf.width = W; buf.height = H; window.FX.apply(o.look, src.B, buf, { dark: DARK, light: GOLD, t: f / 24 }); ctx.drawImage(buf, 0, 0);
        return { phase: "FX-flash (" + o.look + ")", hit: f === o.before };
      }
      ctx.drawImage(src.B, 0, 0, W, H); return { phase: "scène B" };
    } };
  } };

  // ---------- 7 · Signature look: edges + halftone through a gradient mask ----------
  var layeredLook = { create: function (o) {
    o = Object.assign({ split: 0.55, feather: 0.3, frames: 48 }, o);
    var e = document.createElement("canvas"), h = document.createElement("canvas");
    return { total: o.frames, opts: o, render: function (ctx, f, src) {
      var W = ctx.canvas.width, H = ctx.canvas.height;
      window.FX.apply("edges", src.A, e, { dark: DARK, light: GOLD }); window.FX.apply("halftone", src.A, h, { dark: DARK, light: GOLD });
      ctx.drawImage(e, 0, 0, W, H);
      var hc = h.getContext("2d"); hc.globalCompositeOperation = "destination-in";
      var y = H * (o.split + Math.sin(f / o.frames * Math.PI * 2) * 0.08), F = H * o.feather, g = hc.createLinearGradient(0, y - F / 2, 0, y + F / 2);
      g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,1)"); hc.fillStyle = g; hc.fillRect(0, 0, W, H); hc.globalCompositeOperation = "source-over";
      ctx.drawImage(h, 0, 0, W, H);
      return { phase: "edges boven, halftone onder, gefeatherd masker" };
    } };
  } };

  window.IBSKit = { GOLD: GOLD, DARK: DARK, CREAM: CREAM, mark: mark, bgDark: bgDark, divider: divider, tracker: tracker,
    logoAssemble: logoAssemble, logoSpin: logoSpin, detect: detect, glass: glass, captions: captions, flashCut: flashCut, layeredLook: layeredLook };
})();
