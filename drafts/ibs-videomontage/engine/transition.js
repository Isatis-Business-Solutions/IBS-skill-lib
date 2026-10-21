// The "double wipe" transition (Fabian's design, les 4): scene A → edge detection behind a hard
// line wipe → halftone behind a feathered wipe whose kernel grows until the frame is one flat colour
// → scene B resolves out of a shrinking halftone. Rendered frame by frame on a canvas, so it can be
// scrubbed. Needs assets/fx.js and assets/motion.js.
//
//   var tr = DoubleWipe.create(canvas, params); tr.render(frame); tr.total(); tr.layers(frame, thumbs)
//   tr.live(getA, getB): use live sources (functions returning a canvas, e.g. Footage.update) per frame.
(function () {
  var DARK = "#171717", GOLD = "#F9C852";
  var DEFAULTS = {
    fps: 24, hold: 6,
    w1Start: 0, w1Len: 12, ease1: "easeOut",
    w2Start: 6, w2Len: 18, ease2: "easeInOut", feather: 0.25,
    kGrow: 0.45, easeK: "expoIn", k0: 6,
    solid: 3, bLen: 12, after: 8,
    flat: "dominant", markOnFlat: false, // flat: "dominant" | "gold" | "dark"
    line: "gold" // wipe-1 edge: "gold" (2 px line) | "divider" (IBS divider: double thin line + IBS mark)
  };

  function sceneB(cv) {
    var c = cv.getContext("2d"), w = cv.width, h = cv.height;
    var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1d2733"); g.addColorStop(1, "#3b2a18");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(254,249,237,.25)"; c.lineWidth = 1;
    for (var x = 0; x < w; x += w / 8) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (var y = 0; y < h; y += w / 8) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    [0.35, 0.55, 0.42, 0.78, 0.62].forEach(function (v, i) {
      c.fillStyle = i === 3 ? GOLD : "#FEF9ED"; c.fillRect(w * (0.12 + i * 0.16), h * (0.85 - v * 0.6), w * 0.1, h * v * 0.6);
    });
    c.fillStyle = GOLD; c.font = "600 " + (w / 7) + "px Poppins, Segoe UI, Arial, sans-serif"; c.textAlign = "center";
    c.fillText("+38%", w / 2, h * 0.2);
  }

  // The colour the whole kernel lands on when it covers the full frame.
  function dominant(d, w, h) {
    var sum = 0, n = 0;
    for (var y = 0; y < h; y += 4) for (var x = 0; x < w; x += 4) { sum += lumAt(d, w, x, y); n++; }
    return sum / n > 0.5 ? GOLD : DARK;
  }
  function lumAt(d, w, x, y) { var i = (y * w + x) * 4; return (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255; }
  function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

  // Halftone with kernel size k. As k grows the dots switch from "size by brightness" to "on/off by
  // dominant brightness", so at full-frame size the whole plane becomes yellow or black.
  var MARK = ["M37 42 L123 31 L103 100 L121 211 L55 190 Z", "M57 197 L121 217 L234 202 L214 266 L67 285 Z", "M130 31 L277 12 L290 99 L224 79 L110 96 Z", "M225 85 L291 106 L310 254 L222 264 L242 200 Z"];
  function drawMark(ctx, w, h, color) {
    var size = w * 0.28; ctx.save(); ctx.translate(w / 2 - size / 2, h / 2 - size / 2); ctx.scale(size / 287, size / 287); ctx.translate(-30, -5);
    ctx.fillStyle = color; MARK.forEach(function (d) { ctx.fill(new Path2D(d)); }); ctx.restore();
  }
  function markAt(ctx, cx, cy, size, color) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(size / 287, size / 287); ctx.translate(-173.5, -148.5);
    ctx.fillStyle = color; MARK.forEach(function (d) { ctx.fill(new Path2D(d)); }); ctx.restore();
  }
  function halftone(srcData, w, h, k, ctx, flat) {
    if (k >= Math.max(w, h)) { ctx.fillStyle = flat === "gold" ? GOLD : flat === "dark" ? DARK : dominant(srcData, w, h); ctx.fillRect(0, 0, w, h); return; }
    ctx.fillStyle = DARK; ctx.fillRect(0, 0, w, h); ctx.fillStyle = GOLD;
    var nx = Math.ceil(w / k), ny = Math.ceil(h / k), x0 = (w - nx * k) / 2, y0 = (h - ny * k) / 2;
    var s = smooth(Math.min(w, h) / 6, Math.max(w, h) * 0.9, k), step = Math.max(1, Math.floor(k / 8));
    for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) {
      var sum = 0, n = 0, cx = x0 + i * k, cy = y0 + j * k;
      for (var yy = Math.max(0, cy | 0); yy < Math.min(h, cy + k); yy += step) for (var xx = Math.max(0, cx | 0); xx < Math.min(w, cx + k); xx += step) { sum += lumAt(srcData, w, xx, yy); n++; }
      if (!n) continue;
      var avg = sum / n, g = Math.sqrt(avg) * (1 - s) + (avg > 0.5 ? 1 : 0) * s;
      var r = k * (0.6 + 0.15 * s) * g;
      if (r > 0.3) { ctx.beginPath(); ctx.arc(cx + k / 2, cy + k / 2, r, 0, 7); ctx.fill(); }
    }
  }

  function create(out, params) {
    var P = Object.assign({}, DEFAULTS, params || {});
    var W = out.width, H = out.height, E = window.Motion.EASES, bz = window.Motion.bezier;
    function mk() { var c = document.createElement("canvas"); c.width = W; c.height = H; return c; }
    var A = mk(), Ae = mk(), B = mk(), tmp = mk(), m1 = mk(), m2 = mk();
    window.FX.scene(A, 0.3); window.FX.apply("edges", A, Ae, { dark: DARK, light: GOLD }); sceneB(B);
    var Ad = A.getContext("2d").getImageData(0, 0, W, H).data, Bd = B.getContext("2d").getImageData(0, 0, W, H).data;
    var live = null;
    function refresh() {
      if (!live) return;
      A.getContext("2d").drawImage(live.A(), 0, 0, W, H); B.getContext("2d").drawImage(live.B(), 0, 0, W, H);
      window.FX.apply("edges", A, Ae, { dark: DARK, light: GOLD });
      Ad = A.getContext("2d").getImageData(0, 0, W, H).data; Bd = B.getContext("2d").getImageData(0, 0, W, H).data;
    }
    var kmax = H * 1.05;
    function ease(name, x) { return bz(E[name].curve)(Math.max(0, Math.min(1, x))); }
    function w2End() { return P.w2Start + P.w2Len; }
    function total() { return P.hold + Math.max(P.w1Start + P.w1Len, w2End()) + P.solid + P.bLen + P.after; }

    function state(f) {
      f -= P.hold;
      var p1 = ease(P.ease1, (f - P.w1Start) / P.w1Len), p2raw = Math.max(0, Math.min(1, (f - P.w2Start) / P.w2Len));
      var p2 = ease(P.ease2, p2raw), F = P.feather * H;
      var kp = Math.max(0, Math.min(1, (p2raw - P.kGrow) / (1 - P.kGrow)));
      var k = P.k0 * Math.pow(kmax / P.k0, ease(P.easeK, kp));
      var bStart = w2End() + P.solid, q = Math.max(0, Math.min(1, (f - bStart) / P.bLen));
      return { f: f, p1: p1, line1: H * (1 - p1), p2raw: p2raw, y2: (H + F) * (1 - p2), F: F, k: f >= w2End() ? kmax : k,
        solid: f >= w2End() && f < bStart, inB: f >= bStart, q: q,
        kB: kmax * Math.pow(P.k0 / kmax, ease("easeOut", q)) };
    }

    function render(frame, ctx) {
      ctx = ctx || out.getContext("2d");
      refresh();
      var s = state(frame), t = tmp.getContext("2d");
      if (s.solid) {
        halftone(Ad, W, H, kmax, ctx, P.flat);
        if (P.markOnFlat) { var fc = ctx.getImageData(W / 2, 2, 1, 1).data; drawMark(ctx, W, H, fc[0] > 128 ? DARK : GOLD); }
        return s;
      }
      if (s.inB) {
        halftone(Bd, W, H, s.kB, ctx);
        var a = smooth(0.7, 1, s.q);
        if (a > 0) { ctx.globalAlpha = a; ctx.drawImage(B, 0, 0); ctx.globalAlpha = 1; }
        return s;
      }
      ctx.drawImage(A, 0, 0);
      if (s.p1 > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, s.line1, W, H - s.line1); ctx.clip(); ctx.drawImage(Ae, 0, 0); ctx.restore();
        if (s.p1 < 1) {
          if (P.line === "divider") {
            var u = Math.max(1, W / 180), gap = 8.5 * u, ms = 11 * u;
            ctx.fillStyle = "#9A958C"; ctx.fillRect(0, s.line1 - 3 * u, W / 2 - gap, u); ctx.fillRect(W / 2 + gap, s.line1 - 3 * u, W / 2 - gap, u);
            ctx.fillRect(0, s.line1 + 2 * u, W / 2 - gap, u); ctx.fillRect(W / 2 + gap, s.line1 + 2 * u, W / 2 - gap, u);
            markAt(ctx, W / 2, s.line1, ms, GOLD);
          } else { ctx.fillStyle = GOLD; ctx.fillRect(0, s.line1 - 1, W, 2); }
        }
      }
      if (s.p2raw > 0) {
        halftone(Ad, W, H, s.k, t, P.flat);
        t.globalCompositeOperation = "destination-in";
        var g = t.createLinearGradient(0, s.y2 - s.F, 0, s.y2);
        g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,1)");
        t.fillStyle = g; t.fillRect(0, 0, W, H);
        t.fillStyle = "#000"; t.fillRect(0, s.y2, W, H);
        t.globalCompositeOperation = "source-over";
        ctx.drawImage(tmp, 0, 0);
      }
      return s;
    }

    // Separate layers and masks for the "exploded view".
    function layers(frame, thumbs) {
      var s = state(frame);
      function put(cv, fn) { var c = cv.getContext("2d"); c.clearRect(0, 0, cv.width, cv.height); c.save(); c.scale(cv.width / W, cv.height / H); fn(c); c.restore(); }
      put(thumbs.a, function (c) { c.drawImage(s.inB ? B : A, 0, 0); });
      put(thumbs.m1, function (c) { c.fillStyle = "#000"; c.fillRect(0, 0, W, H); c.fillStyle = "#fff"; c.fillRect(0, s.line1, W, H - s.line1); });
      put(thumbs.e, function (c) { c.save(); c.beginPath(); c.rect(0, s.line1, W, H - s.line1); c.clip(); c.drawImage(Ae, 0, 0); c.restore(); });
      put(thumbs.m2, function (c) {
        c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
        var g = c.createLinearGradient(0, s.y2 - s.F, 0, s.y2); g.addColorStop(0, "#000"); g.addColorStop(1, "#fff");
        c.fillStyle = g; c.fillRect(0, s.y2 - s.F, W, s.F); c.fillStyle = "#fff"; c.fillRect(0, s.y2, W, H);
      });
      put(thumbs.h, function (c) { halftone(s.inB ? Bd : Ad, W, H, s.inB ? s.kB : s.k, c); });
      return s;
    }

    return { live: function (a, b) { live = a ? { A: a, B: b } : null; }, render: render, layers: layers, total: total, params: P, set: function (k, v) { P[k] = v; }, state: state, scenes: { A: A, B: B, Ae: Ae } };
  }

  window.DoubleWipe = { create: create, DEFAULTS: DEFAULTS, halftone: halftone };
})();
