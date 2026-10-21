// Timeline compiler and frame renderer for ibs-videomontage. Runs in the browser page (render.html).
// IBSTimeline.compile(timeline, frameCounts, size) → plan; IBSTimeline.frame(plan, f, getFrame) draws frame f.
// getFrame(srcId, frameIndex) must return a loaded image (or canvas) of that source frame, cover-cropped.
(function () {
  var K = window.IBSKit;

  // Defaults per asset, as decided in the IBS signature (see references/assets.md).
  var DW_V11 = { w1Start: 0, w1Len: 10, ease1: "easeOut", w2Start: 6, w2Len: 18, ease2: "easeOut", feather: 0.35, kGrow: 0,
    easeK: "expoIn", solid: 6, bLen: 14, flat: "gold", markOnFlat: true, line: "divider" };

  function compile(tl, counts, size) {
    var fps = (tl.format && tl.format.fps) || 24, W = size.width, H = size.height;
    var plan = { fps: fps, W: W, H: H, segs: [], overlays: [], events: [], audio: [], counts: counts, total: 0, grade: tl.grade || null };
    var f = 0, brand = tl.brand || {}, sfx = !tl.audio || tl.audio.sfx !== false;

    function assembleSeg() {
      var a = K.logoAssemble.create({});
      plan.segs.push({ kind: "assemble", start: f, len: a.total, asset: a });
      plan.events.push({ type: "hit", frame: f + 3 * 3 + Math.round(12 * 0.75) });
      f += a.total;
    }
    if (brand.intro === "assemble") assembleSeg();

    var shots = tl.shots || [];
    shots.forEach(function (s, i) {
      var len = Math.max(1, Math.round(s.dur * fps)), tr = s.transition || { type: "cut" }, seg = { kind: "shot", shot: s, i: i, start: f, len: len, tr: tr, trLen: 0 };
      // A graphic shot has no footage: it is drawn by IBSGraphics (ibs-graphics.js).
      if (s.graphic) { var G = window.IBSGraphics[s.graphic.type]; if (!G) throw new Error("Unknown graphic: " + s.graphic.type); s._gfx = G.create(Object.assign({}, s.graphic)); }
      if (i > 0 && tr.type === "doublewipe") {
        var cv = document.createElement("canvas"); cv.width = W; cv.height = H;
        var p = Object.assign({}, DW_V11, { k0: Math.max(4, Math.round(6 * W / 180)) }, tr.params || {});
        seg.dw = window.DoubleWipe.create(cv, p); seg.dwCanvas = cv; seg.trLen = Math.min(len, seg.dw.total());
        seg.dwA = document.createElement("canvas"); seg.dwA.width = W; seg.dwA.height = H;
        seg.dwB = document.createElement("canvas"); seg.dwB.width = W; seg.dwB.height = H;
        seg.dw.live(function () { return seg.dwA; }, function () { return seg.dwB; });
        var dp = seg.dw.params; plan.events.push({ type: "hit", frame: f + dp.hold + dp.w2Start + dp.w2Len });
      } else if (i > 0 && tr.type === "logospin") {
        seg.spin = K.logoSpin.create(tr.params || {}); seg.trLen = Math.min(len, seg.spin.total);
        plan.events.push({ type: "hit", frame: f + seg.spin.phases[1] });
      } else if (i > 0 && tr.type === "fxflash") {
        seg.trLen = Math.min(len, tr.frames || 6);
        plan.events.push({ type: "hit", frame: f });
      } else if (i > 0 && sfx && s.role === "B" && shots[i - 1].role === "B") {
        plan.events.push({ type: "whoosh", frame: f });
      }
      var keep = !s.graphic && (s.audio != null ? s.audio : s.role === "A");
      if (keep) plan.audio.push({ src: s.src, in: s.in || 0, frame: f, len: len, gain: s.gain == null ? 1 : s.gain });
      plan.segs.push(seg); f += len;
    });
    if (brand.outro === "assemble") assembleSeg();
    plan.total = f;

    (tl.overlays || []).forEach(function (o) {
      var start = Math.round((o.at || 0) * fps), len = Math.max(1, Math.round((o.dur || 2) * fps)), ov = { o: o, start: start, len: len };
      if (o.type === "captions") ov.asset = K.captions.create({ text: o.text, key: o.key || "", hold: len });
      else if (o.type === "glass") ov.asset = K.glass.create({ eyebrow: (o.eyebrow || "").toUpperCase(), title: o.title || "", sub: o.sub || "", hold: Math.max(1, len - 26) });
      else if (o.type === "detect") {
        ov.items = (o.items || []).map(function (it, k) { return { it: it, at: Math.round((it.at != null ? it.at : k * 0.5) * fps) }; });
        ov.len = Math.max(len, ov.items.reduce(function (m, x) { return Math.max(m, x.at + 36); }, 0));
        ov.asset = K.detect.create({ look: o.look || "edges", dets: ov.items.map(function (x) {
          var b = x.it.box; // [x, y, w, h] as fractions of the frame
          return { label: x.it.label, conf: x.it.conf == null ? 0.97 : x.it.conf, at: x.at, track: function () {
            var w = b[2] * W, h = b[3] * H, c = x.tracker ? x.tracker.pos() : { x: (b[0] + b[2] / 2) * W, y: (b[1] + b[3] / 2) * H };
            return { x: c.x - w / 2, y: c.y - h / 2, w: w, h: h };
          } };
        }) });
      } else if (o.type === "orb") {
        // A small AI orb over the footage or a graphic: x, y (centre, fractions of the frame), size (fraction of width).
        var ob = { st: o.state || "working", x: (o.x == null ? 0.5 : o.x), y: (o.y == null ? 0.5 : o.y), s: o.size || 0.25 };
        ov.asset = { total: len, render: function (c, lf, src) {
          var Wc = c.canvas.width, Hc = c.canvas.height, a = Math.min(1, lf / 6, (len - lf) / 6);
          c.drawImage(src.A, 0, 0);
          // Glass disc behind the orb, so it reads on any footage: blurred backdrop, dark tint, light rim.
          var cx = ob.x * Wc, cy = ob.y * Hc, rad = ob.s * Wc * 0.62;
          c.save(); c.globalAlpha = a; c.beginPath(); c.arc(cx, cy, rad, 0, Math.PI * 2); c.clip();
          c.filter = "blur(" + Math.round(Wc / 90) + "px)"; c.drawImage(src.A, 0, 0); c.filter = "none";
          c.fillStyle = "rgba(23,23,23,.62)"; c.fillRect(cx - rad, cy - rad, rad * 2, rad * 2); c.restore();
          c.save(); c.globalAlpha = a * 0.5; c.beginPath(); c.arc(cx, cy, rad, 0, Math.PI * 2); c.strokeStyle = "#FEF9ED"; c.lineWidth = Wc / 360; c.stroke(); c.restore();
          window.IBSGraphics.drawOrb(c, ob.st, cx, cy, ob.s * Wc, (start + lf) / fps, a);
        } };
      } else if (o.type === "riser") {
        plan.events.push({ type: "riser", frame: start, len: len });
        return;
      } else return;
      plan.overlays.push(ov);
    });
    // For review sheets: the middle frame of every shot and of every caption.
    plan.shotMids = plan.segs.filter(function (s) { return s.kind === "shot"; }).map(function (s) { return s.start + Math.min(s.len - 1, Math.max(s.trLen, Math.floor(s.len / 2))); });
    plan.captionMids = plan.overlays.filter(function (o) { return o.o.type === "captions"; }).map(function (o) { return o.start + Math.floor(o.len * 0.75); });
    plan.base = mk(W, H); plan.tmp = mk(W, H); plan.ovc = mk(W, H);
    return plan;
  }

  // Colour grade on footage (the colourist's job): pulls every shot towards one light. "golden" = golden hour:
  // warm soft-light wash, amber glow from the top right, lifted shadows. amt 0–1 (default 0.6).
  function grade(ctx, W, H, g) {
    var type = g.type || g, amt = g.amt == null ? 0.6 : g.amt;
    if (type !== "golden" || amt <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = "soft-light"; ctx.globalAlpha = 0.55 * amt; ctx.fillStyle = "#F2A541"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "screen"; ctx.globalAlpha = 0.5 * amt;
    var rg = ctx.createRadialGradient(W, 0, 0, W, 0, Math.max(W, H) * 0.9); rg.addColorStop(0, "rgba(249,200,82,.55)"); rg.addColorStop(1, "rgba(249,200,82,0)");
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.18 * amt; ctx.fillStyle = "#E8C9A0"; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function mk(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }

  // Draw one shot frame (local frame k) into ctx, with zoom and look.
  function drawShot(plan, s, k, ctx, getFrame) {
    if (s._gfx) { s._gfx.render(ctx, Math.min(k, s._gfx.total - 1)); return; }
    var fps = plan.fps, idx = Math.round((s.in || 0) * fps + k), n = plan.counts[s.src] || 1;
    var img = getFrame(s.src, Math.max(0, Math.min(n - 1, idx)));
    var W = plan.W, H = plan.H, z = 1;
    if (s.zoom) { var len = Math.max(1, Math.round(s.dur * fps)), t = Math.min(1, k / len); z = s.zoom[0] + (s.zoom[1] - s.zoom[0]) * window.Motion.bezier(window.Motion.EASES.easeInOut.curve)(t); }
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.drawImage(img, 0, 0, W, H); ctx.restore();
    var gr = s.grade === false ? null : (s.grade || plan.grade);
    if (gr) grade(ctx, W, H, gr);
    if (s.look && s.look !== "none") {
      window.FX.apply(s.look, ctx.canvas, plan.tmp, { dark: K.DARK, light: K.GOLD, amt: s.lookAmt == null ? 0.6 : s.lookAmt, t: k / fps });
      ctx.drawImage(plan.tmp, 0, 0);
    }
  }

  function frame(plan, f, getFrame) {
    var ctx = plan.base.getContext("2d"), W = plan.W, H = plan.H, seg = null;
    for (var i = 0; i < plan.segs.length; i++) { var s = plan.segs[i]; if (f >= s.start && f < s.start + s.len) { seg = s; break; } }
    ctx.fillStyle = K.DARK; ctx.fillRect(0, 0, W, H);
    if (seg && seg.kind === "assemble") seg.asset.render(ctx, f - seg.start);
    else if (seg) {
      var k = f - seg.start, sh = seg.shot;
      if (k < seg.trLen && seg.dw) {
        var prev = plan.segs[plan.segs.indexOf(seg) - 1];
        drawShot(plan, prev.shot, prev.len + k, seg.dwA.getContext("2d"), getFrame);
        drawShot(plan, sh, k, seg.dwB.getContext("2d"), getFrame);
        seg.dw.render(k); ctx.drawImage(seg.dwCanvas, 0, 0);
      } else if (k < seg.trLen && seg.spin) {
        var bc = plan.ovc; drawShot(plan, sh, k, bc.getContext("2d"), getFrame);
        seg.spin.render(ctx, k, { B: bc });
      } else if (k < seg.trLen && seg.tr.type === "fxflash") {
        drawShot(plan, sh, k, ctx, getFrame);
        window.FX.apply(seg.tr.look || "edges", plan.base, plan.tmp, { dark: K.DARK, light: K.GOLD, t: k / plan.fps });
        ctx.drawImage(plan.tmp, 0, 0);
      } else drawShot(plan, sh, k, ctx, getFrame);
    }
    plan.overlays.forEach(function (ov) {
      var lf = f - ov.start; if (lf < 0 || lf >= ov.len) return;
      if (ov.items) ov.items.forEach(function (x) {
        if (!x.it.track) return;
        if (lf === 0 || !x.tracker) { var b = x.it.box; x.tracker = K.tracker(plan.base, (b[0] + b[2] / 2) * W, (b[1] + b[3] / 2) * H, Math.round(Math.min(b[2] * W, b[3] * H) * 0.5)); }
        x.tracker.step();
      });
      var oc = plan.ovc.getContext("2d"); ov.asset.render(oc, lf, { A: plan.base }); ctx.drawImage(plan.ovc, 0, 0);
    });
    return plan.base;
  }

  window.IBSTimeline = { compile: compile, frame: frame, DW_V11: DW_V11 };
})();
