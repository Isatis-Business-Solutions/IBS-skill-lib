// IBS product graphics: full-frame motion graphics in the house style (dark canvas, amber glow, yellow as the
// only accent, Poppins, thin line icons, rounded squares). Used as `graphic` shots in a timeline, for beats
// that explain (kern, how, details) when there is no footage of the product. Needs ibs-kit.js and motion.js.
//
// Each graphic: IBSGraphics.<name>.create(opts) → { total: frames, render(ctx, f) }
// Common option: onTwos (true = hold every drawing for two frames, 12 drawings per second).
// Sizes use units: 1 u = width / 180 (a 9:16 frame is 180 × 320 u).
(function () {
  var K = window.IBSKit, GOLD = K.GOLD, DARK = K.DARK, CREAM = K.CREAM, MUTED = "#9A958C", LINE = "#3A3A3A";
  var FONT = "Poppins, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
  function E(name, x) { var M = window.Motion; return M.bezier(M.EASES[name].curve)(Math.max(0, Math.min(1, x))); }
  function seg(f, a, b) { return Math.max(0, Math.min(1, (f - a) / (b - a))); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function twos(o, f) { return o.onTwos ? Math.floor(f / 2) * 2 : f; }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function font(ctx, w, px) { ctx.font = w + " " + px + "px " + FONT; }
  // Wrap text into lines that fit maxW; returns the lines.
  function wrap(ctx, text, maxW) {
    var words = text.split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur);
    return lines;
  }
  // Typewriter: the first n characters of a text, drawn as wrapped lines.
  function typed(ctx, text, n, x, y, maxW, lh) {
    var lines = wrap(ctx, text, maxW), left = Math.max(0, Math.floor(n));
    lines.forEach(function (l, i) { if (left <= 0) return; ctx.fillText(l.slice(0, left), x, y + i * lh); left -= l.length + 1; });
    return lines.length;
  }
  function eyebrow(ctx, text, x, y, u) { ctx.fillStyle = MUTED; font(ctx, 600, 6 * u); ctx.fillText(text.toUpperCase().split("").join(String.fromCharCode(8202)), x, y); }

  // Thin line icons (≈2 px at 1080 wide), drawn in a 24 × 24 box at (x, y) with size s.
  var ICONS = {
    mail: function (c) { rr(c, 2, 5, 20, 14, 2); c.stroke(); c.beginPath(); c.moveTo(3, 6); c.lineTo(12, 13); c.lineTo(21, 6); c.stroke(); },
    reply: function (c) { c.beginPath(); c.moveTo(10, 6); c.lineTo(4, 12); c.lineTo(10, 18); c.moveTo(4, 12); c.lineTo(15, 12); c.quadraticCurveTo(21, 12, 21, 19); c.stroke(); },
    doc: function (c) { c.beginPath(); c.moveTo(6, 2); c.lineTo(15, 2); c.lineTo(19, 6); c.lineTo(19, 22); c.lineTo(6, 22); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(9, 10); c.lineTo(16, 10); c.moveTo(9, 14); c.lineTo(16, 14); c.moveTo(9, 18); c.lineTo(13, 18); c.stroke(); },
    flow: function (c) { rr(c, 2, 3, 7, 6, 1.5); c.stroke(); rr(c, 15, 3, 7, 6, 1.5); c.stroke(); rr(c, 8.5, 15, 7, 6, 1.5); c.stroke(); c.beginPath(); c.moveTo(9, 6); c.lineTo(15, 6); c.moveTo(18.5, 9); c.lineTo(18.5, 12); c.lineTo(12, 12); c.lineTo(12, 15); c.stroke(); },
    base: function (c) { c.beginPath(); c.ellipse(12, 5, 8, 3, 0, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.moveTo(4, 5); c.lineTo(4, 19); c.ellipse(12, 19, 8, 3, 0, Math.PI, 0, true); c.lineTo(20, 5); c.stroke(); c.beginPath(); c.ellipse(12, 12, 8, 3, 0, 0, Math.PI); c.stroke(); },
    trophy: function (c) { c.beginPath(); c.moveTo(7, 3); c.lineTo(17, 3); c.lineTo(17, 9); c.arc(12, 9, 5, 0, Math.PI); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(12, 14); c.lineTo(12, 18); c.moveTo(8, 21); c.lineTo(16, 21); c.moveTo(7, 5); c.lineTo(3, 5); c.quadraticCurveTo(3, 10, 7, 10); c.moveTo(17, 5); c.lineTo(21, 5); c.quadraticCurveTo(21, 10, 17, 10); c.stroke(); },
    star: function (c) { c.beginPath(); for (var i = 0; i < 10; i++) { var r = i % 2 ? 4.2 : 9.5, a = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(12 + Math.cos(a) * r, 12.5 + Math.sin(a) * r); } c.closePath(); c.stroke(); },
    puzzle: function (c) { c.beginPath(); c.moveTo(4, 8); c.lineTo(9, 8); c.arc(11.5, 6.5, 2.5, Math.PI * 0.9, Math.PI * 0.1); c.lineTo(19, 8); c.lineTo(19, 13); c.arc(20.5, 15.5, 2.5, -Math.PI * 0.6, Math.PI * 0.6); c.lineTo(19, 21); c.lineTo(4, 21); c.closePath(); c.stroke(); },
    timer: function (c) { c.beginPath(); c.arc(12, 13.5, 8, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.moveTo(12, 13.5); c.lineTo(12, 9); c.moveTo(9.5, 2.5); c.lineTo(14.5, 2.5); c.stroke(); }
  };
  function icon(ctx, name, x, y, s, color, alpha) {
    ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.translate(x, y); ctx.scale(s / 24, s / 24);
    ctx.strokeStyle = color || CREAM; ctx.lineWidth = 1.6; ctx.lineCap = "round"; ctx.lineJoin = "round"; ICONS[name](ctx); ctx.restore();
  }
  // An icon tile: rounded-square outline with the icon inside; scales in from its centre.
  function tile(ctx, name, cx, cy, size, scale, active, u) {
    if (scale <= 0) return;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(scale, scale);
    rr(ctx, -size / 2, -size / 2, size, size, size * 0.24); ctx.fillStyle = active ? "rgba(249,200,82,.12)" : "rgba(254,249,237,.04)"; ctx.fill();
    ctx.strokeStyle = active ? GOLD : "rgba(254,249,237,.35)"; ctx.lineWidth = 0.9 * u; ctx.stroke();
    icon(ctx, name, -size * 0.3, -size * 0.3, size * 0.6, active ? GOLD : CREAM); ctx.restore();
  }

  // ---------- Mail: a message comes in, the reply types itself ----------
  // from: [x, y, w, h] as fractions of the frame (e.g. a detection box): the card grows out of it (box → screen).
  var mail = { create: function (o) {
    o = Object.assign({ from: null, sender: "Kenniscollega", subject: "Vraag van vandaag", question: "Hoe hoor je dat de lagers van lijn 3 slijten?",
      reply: "Aan het geluid: dan gaat het brommen, net onder de fluittoon.", hold: 30 }, o);
    var tIn = 14, tHead = tIn + 10, tQ = tHead + 4, qLen = Math.ceil(o.question.length / 1.6), tR = tQ + qLen + 12, rLen = Math.ceil(o.reply.length / 1.3);
    var total = tR + rLen + o.hold;
    return { total: total, opts: o, render: function (ctx, f0) {
      var f = twos(o, f0), W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180; K.bgDark(ctx, W, H);
      var card = { x: 14 * u, y: 46 * u, w: 152 * u, h: 132 * u }, a = E("easeOut", seg(f, 0, tIn));
      var b = o.from ? { x: o.from[0] * W, y: o.from[1] * H, w: o.from[2] * W, h: o.from[3] * H } : { x: W / 2 - 20 * u, y: card.y + 40 * u, w: 40 * u, h: 30 * u };
      var x = lerp(b.x, card.x, a), y = lerp(b.y, card.y, a), w = lerp(b.w, card.w, a), h = lerp(b.h, card.h, a);
      rr(ctx, x, y, w, h, lerp(2 * u, 10 * u, a)); ctx.fillStyle = "rgba(254,249,237," + (0.06 * a).toFixed(3) + ")"; ctx.fill();
      ctx.strokeStyle = a < 1 ? GOLD : "rgba(254,249,237,.3)"; ctx.lineWidth = 0.9 * u; ctx.stroke();
      if (f < tIn) return { phase: "box → kader (ease-out)" };
      var hv = E("easeOut", seg(f, tIn, tHead)), px = card.x + 12 * u;
      ctx.save(); ctx.globalAlpha = hv;
      ctx.beginPath(); ctx.arc(px + 7 * u, card.y + 16 * u, 7 * u, 0, Math.PI * 2); ctx.fillStyle = "rgba(249,200,82,.15)"; ctx.fill();
      K.mark(ctx, px + 7 * u, card.y + 16 * u, 8 * u, 0, GOLD);
      ctx.fillStyle = CREAM; font(ctx, 600, 7 * u); ctx.fillText(o.sender, px + 18 * u, card.y + 14 * u);
      ctx.fillStyle = MUTED; font(ctx, 400, 5.5 * u); ctx.fillText("vandaag · 08:12", px + 18 * u, card.y + 21 * u);
      ctx.fillStyle = GOLD; font(ctx, 600, 9 * u); ctx.fillText(o.subject, px, card.y + 40 * u);
      ctx.fillStyle = LINE; ctx.fillRect(px, card.y + 46 * u, card.w - 24 * u, 0.6 * u);
      ctx.restore();
      ctx.fillStyle = CREAM; font(ctx, 400, 8 * u);
      typed(ctx, o.question, (f - tQ) * 1.6, px, card.y + 58 * u, card.w - 24 * u, 11 * u);
      if (f >= tR) {
        var ra = E("easeOut", seg(f, tR, tR + 8)), ry = card.y + card.h + 10 * u;
        ctx.save(); ctx.globalAlpha = ra; ctx.translate(0, (1 - ra) * 8 * u);
        rr(ctx, card.x + 18 * u, ry, card.w - 18 * u, 54 * u, 10 * u); ctx.fillStyle = "rgba(249,200,82,.10)"; ctx.fill(); ctx.strokeStyle = "rgba(249,200,82,.6)"; ctx.lineWidth = 0.9 * u; ctx.stroke();
        icon(ctx, "reply", card.x + 26 * u, ry + 8 * u, 9 * u, GOLD);
        ctx.fillStyle = MUTED; font(ctx, 600, 5.5 * u); ctx.fillText("ANTWOORD", card.x + 38 * u, ry + 15 * u);
        ctx.fillStyle = CREAM; font(ctx, 400, 8 * u);
        var n = (f - tR - 4) * 1.3; typed(ctx, o.reply, n, card.x + 26 * u, ry + 30 * u, card.w - 34 * u, 11 * u);
        if (n < o.reply.length && Math.floor(f / 6) % 2 === 0) { ctx.fillStyle = GOLD; ctx.fillRect(card.x + 26 * u, ry + 33 * u, 4 * u, 0.8 * u); }
        ctx.restore();
      }
      return { phase: f < tR ? "vraag komt binnen" : "antwoord typt" };
    } };
  } };

  // ---------- Puzzle → mark: four pieces fly in and become the IBS mark ----------
  // The pieces are the four planes of the mark; ease-out like the logo assemble (no overshoot in the logo).
  var puzzle = { create: function (o) {
    o = Object.assign({ stagger: 4, frames: 16, hold: 40, label: "" }, o);
    var OFF = [[-260, -320, -70], [-240, 330, 55], [250, -300, 60], [270, 300, -65]], land = 3 * o.stagger + o.frames;
    return { total: land + o.hold, opts: o, render: function (ctx, f0) {
      var f = twos(o, f0), W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180; K.bgDark(ctx, W, H);
      var planes = OFF.map(function (v, i) { var t = E("easeOut", seg(f, i * o.stagger, i * o.stagger + o.frames)); return { x: v[0] * (1 - t), y: v[1] * (1 - t), r: v[2] * (1 - t), a: Math.min(1, t * 2) }; });
      var glow = seg(f, land - 2, land + 10) * (1 - seg(f, land + 10, land + 30));
      if (glow > 0) { var g = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, 70 * u); g.addColorStop(0, "rgba(249,200,82," + (0.25 * glow).toFixed(3) + ")"); g.addColorStop(1, "rgba(249,200,82,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
      K.mark(ctx, W / 2, H * 0.42, 92 * u, 0, GOLD, planes);
      if (o.label) { var la = E("easeOut", seg(f, land + 4, land + 14)); ctx.save(); ctx.globalAlpha = la; eyebrow(ctx, o.label, W / 2 - ctx.measureText(o.label).width, H * 0.62, u); ctx.restore(); }
      return { phase: f < land ? "stukken vallen samen" : "merkteken", hit: [0, 1, 2, 3].some(function (i) { return f === i * o.stagger + o.frames; }) };
    } };
  } };

  // ---------- Gamification: badge tiles, level bar, score ----------
  var badges = { create: function (o) {
    o = Object.assign({ tiles: ["star", "puzzle", "trophy"], active: 2, level: "LEVEL 4", from: 62, to: 88, score: "+120", hold: 30 }, o);
    var tT = 0, tBar = 3 * 3 + 12, tScore = tBar + 18;
    return { total: tScore + 16 + o.hold, opts: o, render: function (ctx, f0) {
      var f = twos(o, f0), W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180; K.bgDark(ctx, W, H);
      var size = 40 * u, gap = 12 * u, x0 = W / 2 - (3 * size + 2 * gap) / 2 + size / 2, cy = H * 0.34;
      o.tiles.forEach(function (n, i) { var t = seg(f, tT + i * 3, tT + i * 3 + 12); tile(ctx, n, x0 + i * (size + gap), cy, size, t ? E("overshoot", t) : 0, i === o.active && f > tScore, u); });
      var ba = E("easeOut", seg(f, tBar, tBar + 6)), bx = 24 * u, by = H * 0.5, bw = W - 48 * u;
      ctx.save(); ctx.globalAlpha = ba;
      eyebrow(ctx, o.level, bx, by - 8 * u, u);
      rr(ctx, bx, by, bw, 6 * u, 3 * u); ctx.fillStyle = "#2a2925"; ctx.fill();
      var p = lerp(o.from, o.to, E("easeOut", seg(f, tBar + 4, tBar + 22))) / 100;
      rr(ctx, bx, by, Math.max(6 * u, bw * p), 6 * u, 3 * u); ctx.fillStyle = GOLD; ctx.fill();
      ctx.fillStyle = MUTED; font(ctx, 400, 5.5 * u); ctx.textAlign = "right"; ctx.fillText(Math.round(p * 100) + "%", bx + bw, by - 8 * u); ctx.textAlign = "left";
      ctx.restore();
      var sa = seg(f, tScore, tScore + 10);
      if (sa > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, sa * 2); ctx.fillStyle = GOLD; font(ctx, 600, 36 * u); ctx.textAlign = "center"; ctx.fillText(o.score, W / 2, H * 0.68 + (1 - E("overshoot", sa)) * 10 * u); ctx.fillStyle = MUTED; font(ctx, 400, 7 * u); ctx.fillText("punten voor vandaag", W / 2, H * 0.68 + 14 * u); ctx.restore(); }
      return { phase: "tegels · level · score" };
    } };
  } };

  // ---------- Knowledge map: known nodes, one gap lights up, a question comes out ----------
  var knowmap = { create: function (o) {
    o = Object.assign({ question: "Wat doe je als lijn 3 gaat trillen?", label: "NOG NIET BEKEND", hold: 30 }, o);
    var N = [[50, 64], [96, 44], [138, 74], [70, 114], [120, 124], [40, 164], [150, 164], [90, 179]], GAP = [104, 86];
    var L = [[0, 1], [1, 2], [0, 3], [3, 4], [2, 4], [3, 5], [4, 6], [5, 7], [6, 7], [4, 7]];
    var tGap = 8 * 2 + 10, tQ = tGap + 18, qLen = Math.ceil(o.question.length / 1.6);
    return { total: tQ + qLen + o.hold, opts: o, render: function (ctx, f0) {
      var f = twos(o, f0), W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180; K.bgDark(ctx, W, H);
      var P = function (p) { return [p[0] * u, p[1] * u]; };
      ctx.lineWidth = 0.7 * u; ctx.strokeStyle = "rgba(254,249,237,.28)";
      L.forEach(function (l, i) { var t = E("easeOut", seg(f, 4 + i * 1.5, 14 + i * 1.5)); if (!t) return; var a = P(N[l[0]]), b = P(N[l[1]]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], t), lerp(a[1], b[1], t)); ctx.stroke(); });
      N.forEach(function (n, i) { var t = seg(f, i * 2, i * 2 + 10); if (!t) return; var p = P(n); ctx.beginPath(); ctx.arc(p[0], p[1], 4.5 * u * E("overshoot", t), 0, Math.PI * 2); ctx.fillStyle = CREAM; ctx.fill(); });
      var g = seg(f, tGap, tGap + 10);
      if (g > 0) {
        var p = P(GAP), pulse = 1 + 0.15 * Math.sin((f - tGap) / 24 * Math.PI * 2 * 1.2);
        ctx.setLineDash([2 * u, 2 * u]); ctx.strokeStyle = "rgba(249,200,82,.7)"; [[1], [2], [4]].forEach(function (k) { var q = P(N[k[0]]); ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); }); ctx.setLineDash([]);
        var rg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 22 * u * pulse); rg.addColorStop(0, "rgba(249,200,82," + (0.35 * g).toFixed(3) + ")"); rg.addColorStop(1, "rgba(249,200,82,0)"); ctx.fillStyle = rg; ctx.fillRect(p[0] - 30 * u, p[1] - 30 * u, 60 * u, 60 * u);
        ctx.beginPath(); ctx.arc(p[0], p[1], 6 * u * E("overshoot", g), 0, Math.PI * 2); ctx.strokeStyle = GOLD; ctx.lineWidth = 1.2 * u; ctx.stroke();
        ctx.save(); ctx.globalAlpha = g; eyebrow(ctx, o.label, p[0] + 10 * u, p[1] + 2 * u, u); ctx.restore();
      }
      if (f >= tQ) {
        var qa = E("easeOut", seg(f, tQ, tQ + 8)), bx = 18 * u, by = 198 * u, bw = W - 36 * u;
        ctx.save(); ctx.globalAlpha = qa;
        rr(ctx, bx, by, bw, 44 * u, 10 * u); ctx.fillStyle = "rgba(254,249,237,.06)"; ctx.fill(); ctx.strokeStyle = "rgba(249,200,82,.6)"; ctx.lineWidth = 0.9 * u; ctx.stroke();
        ctx.fillStyle = MUTED; font(ctx, 600, 5.5 * u); ctx.fillText("VRAAG VAN MORGEN", bx + 10 * u, by + 12 * u);
        ctx.fillStyle = CREAM; font(ctx, 400, 8 * u); typed(ctx, o.question, (f - tQ - 4) * 1.6, bx + 10 * u, by + 26 * u, bw - 20 * u, 11 * u);
        ctx.restore();
      }
      return { phase: f < tGap ? "bekende kennis" : f < tQ ? "het gat licht op" : "nieuwe vraag" };
    } };
  } };

  // ---------- Flow: the answer becomes documentation ----------
  var flow = { create: function (o) {
    o = Object.assign({ source: "Antwoord", cards: [["doc", "Documentatie"], ["flow", "Procesanalyse"], ["base", "Kennisbank"]], hold: 30 }, o);
    var tLine = 12, tCards = tLine + 10;
    return { total: tCards + 3 * 3 + 12 + o.hold, opts: o, render: function (ctx, f0) {
      var f = twos(o, f0), W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180; K.bgDark(ctx, W, H);
      var cx = W / 2, top = 52 * u, ca = E("overshoot", seg(f, 0, 10));
      if (ca > 0) { ctx.save(); ctx.translate(cx, top); ctx.scale(ca, ca); rr(ctx, -40 * u, -14 * u, 80 * u, 28 * u, 14 * u); ctx.fillStyle = "rgba(249,200,82,.14)"; ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 0.9 * u; ctx.stroke();
        icon(ctx, "reply", -32 * u, -6 * u, 12 * u, GOLD); ctx.fillStyle = CREAM; font(ctx, 600, 8 * u); ctx.fillText(o.source, -16 * u, 3 * u); ctx.restore(); }
      var ys = o.cards.map(function (_, i) { return 108 * u + i * 46 * u; }), lt = E("easeOut", seg(f, tLine, tLine + 14));
      ctx.strokeStyle = "rgba(254,249,237,.35)"; ctx.lineWidth = 0.8 * u;
      if (lt > 0) { ctx.beginPath(); ctx.moveTo(cx, top + 14 * u); ctx.lineTo(cx, lerp(top + 14 * u, ys[ys.length - 1], lt)); ctx.stroke(); }
      o.cards.forEach(function (c, i) {
        var t = seg(f, tCards + i * 3, tCards + i * 3 + 12); if (!t) return; var e = E("overshoot", t), y = ys[i];
        ctx.save(); ctx.globalAlpha = Math.min(1, t * 2); ctx.translate(cx, y); ctx.scale(lerp(0.85, 1, e), lerp(0.85, 1, e));
        rr(ctx, -66 * u, -18 * u, 132 * u, 36 * u, 9 * u); ctx.fillStyle = "#1f1e1b"; ctx.fill(); ctx.strokeStyle = "rgba(254,249,237,.3)"; ctx.stroke();
        ctx.fillStyle = GOLD; ctx.fillRect(-66 * u, -12 * u, 2 * u, 24 * u);
        icon(ctx, c[0], -56 * u, -9 * u, 18 * u, CREAM); ctx.fillStyle = CREAM; font(ctx, 600, 8.5 * u); ctx.fillText(c[1], -30 * u, 3 * u);
        ctx.restore();
      });
      return { phase: "antwoord → kaarten (stagger 3 f, overshoot)" };
    } };
  } };


  // ---------- Minigames: three short games that fill exactly the knowledge that is missing ----------
  // 1 order the steps, 2 spot what goes wrong, 3 fill the gap. Each game: title, play, check, +points.
  var minigames = { create: function (o) {
    o = Object.assign({ game: 60, hold: 24,
      order: { title: "Zet de stappen op volgorde", steps: ["Marge checken", "Akkoord finance", "Offerte versturen"], from: [2, 0, 1] },
      spot: { title: "Wat gaat hier mis?", nodes: ["Aanvraag", "Prijs", "Akkoord", "Klant"], wrong: 2 },
      fill: { title: "Vul het gat", before: "Boven de 50k eerst", word: "akkoord finance", after: "." },
      points: "+40" }, o);
    var G = o.game;
    function header(ctx, i, title, u, W, a) {
      ctx.save(); ctx.globalAlpha = a;
      eyebrow(ctx, "MINIGAME " + (i + 1) + "/3", 18 * u, 46 * u, u);
      for (var k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(W - 38 * u + k * 9 * u, 44 * u, 2.5 * u, 0, Math.PI * 2); ctx.fillStyle = k <= i ? GOLD : "#3A3A3A"; ctx.fill(); }
      ctx.fillStyle = CREAM; font(ctx, 600, 11 * u); wrap(ctx, title, W - 36 * u).forEach(function (l, j) { ctx.fillText(l, 18 * u, 64 * u + j * 14 * u); });
      ctx.restore();
    }
    function check(ctx, f, at, u, W) {
      var t = seg(f, at, at + 10); if (!t) return;
      var e = E("overshoot", t), cx = W / 2, cy = 210 * u;
      ctx.save(); ctx.globalAlpha = Math.min(1, t * 2); ctx.translate(cx, cy); ctx.scale(e, e);
      rr(ctx, -34 * u, -12 * u, 68 * u, 24 * u, 12 * u); ctx.fillStyle = "rgba(249,200,82,.16)"; ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 0.9 * u; ctx.stroke();
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1.6 * u; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-22 * u, 0); ctx.lineTo(-17 * u, 5 * u); ctx.lineTo(-9 * u, -5 * u); ctx.stroke();
      ctx.fillStyle = GOLD; font(ctx, 600, 9 * u); ctx.fillText(o.points, -2 * u, 3.5 * u); ctx.restore();
    }
    return { total: 3 * G + o.hold, opts: o, render: function (ctx, f0) {
      var f = twos(o, f0), W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180; K.bgDark(ctx, W, H);
      var i = Math.min(2, Math.floor(f / G)), lf = f - i * G, a = E("easeOut", seg(lf, 0, 8)) * (i < 2 ? 1 - seg(lf, G - 6, G) : 1);
      ctx.save(); ctx.globalAlpha = a;
      if (i === 0) {
        var g = o.order; header(ctx, 0, g.title, u, W, 1);
        var sw = W - 36 * u, sh = 24 * u, t = E("easeInOut", seg(lf, 16, 34));
        g.steps.forEach(function (st, k) {
          var y0 = 96 * u + g.from[k] * 30 * u, y1 = 96 * u + k * 30 * u, y = lerp(y0, y1, t), done = t >= 1;
          rr(ctx, 18 * u, y, sw, sh, 6 * u); ctx.fillStyle = "#1f1e1b"; ctx.fill(); ctx.strokeStyle = done ? "rgba(249,200,82,.7)" : "rgba(254,249,237,.3)"; ctx.lineWidth = 0.8 * u; ctx.stroke();
          ctx.fillStyle = done ? GOLD : MUTED; font(ctx, 600, 8 * u); ctx.fillText(String(done ? k + 1 : "⋮"), 26 * u, y + 15.5 * u);
          ctx.fillStyle = CREAM; font(ctx, 400, 8 * u); ctx.fillText(st, 40 * u, y + 15.5 * u);
        });
        check(ctx, lf, 36, u, W);
      } else if (i === 1) {
        var g2 = o.spot; header(ctx, 1, g2.title, u, W, 1);
        var n = g2.nodes.length, y = 130 * u, x0 = 26 * u, step = (W - 52 * u) / (n - 1), pick = seg(lf, 22, 30);
        ctx.strokeStyle = "rgba(254,249,237,.3)"; ctx.lineWidth = 0.8 * u; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + step * (n - 1), y); ctx.stroke();
        g2.nodes.forEach(function (nm, k) {
          var x = x0 + k * step, hit = k === g2.wrong && pick > 0, r = (hit ? lerp(6, 9, E("overshoot", pick)) : 6) * u;
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = hit ? GOLD : "#1f1e1b"; ctx.fill(); ctx.strokeStyle = hit ? GOLD : CREAM; ctx.lineWidth = 0.9 * u; ctx.stroke();
          ctx.fillStyle = hit ? GOLD : CREAM; font(ctx, 400, 6.5 * u); ctx.textAlign = "center"; ctx.fillText(nm, x, y + (k % 2 ? -14 : 20) * u); ctx.textAlign = "left";
        });
        if (pick > 0) { ctx.save(); ctx.globalAlpha = pick; ctx.fillStyle = MUTED; font(ctx, 400, 7 * u); ctx.textAlign = "center"; ctx.fillText("akkoord ontbreekt bij spoed", x0 + g2.wrong * step, y + 34 * u); ctx.restore(); }
        check(ctx, lf, 34, u, W);
      } else {
        var g3 = o.fill; header(ctx, 2, g3.title, u, W, 1);
        var bx = 18 * u, by = 104 * u, bw = W - 36 * u, fly = E("easeOut", seg(lf, 16, 30));
        rr(ctx, bx, by, bw, 50 * u, 10 * u); ctx.fillStyle = "rgba(254,249,237,.05)"; ctx.fill(); ctx.strokeStyle = "rgba(254,249,237,.3)"; ctx.lineWidth = 0.8 * u; ctx.stroke();
        ctx.fillStyle = CREAM; font(ctx, 400, 8.5 * u); ctx.fillText(g3.before, bx + 10 * u, by + 20 * u);
        var gx = bx + 10 * u, gy = by + 34 * u; font(ctx, 600, 8.5 * u); var ww = ctx.measureText(g3.word).width + 12 * u;
        ctx.setLineDash([2 * u, 2 * u]); ctx.strokeStyle = "rgba(249,200,82,.6)"; rr(ctx, gx, gy - 9 * u, ww, 13 * u, 4 * u); ctx.stroke(); ctx.setLineDash([]);
        var cx = lerp(W / 2 - ww / 2, gx, fly), cy = lerp(176 * u, gy - 9 * u, fly);
        rr(ctx, cx, cy, ww, 13 * u, 4 * u); ctx.fillStyle = fly >= 1 ? GOLD : "rgba(249,200,82,.18)"; ctx.fill(); ctx.strokeStyle = GOLD; ctx.stroke();
        ctx.fillStyle = fly >= 1 ? DARK : GOLD; ctx.fillText(g3.word, cx + 6 * u, cy + 9.3 * u);
        ctx.fillStyle = CREAM; font(ctx, 400, 8.5 * u); ctx.fillText(g3.after, gx + ww + 2 * u, gy);
        check(ctx, lf, 32, u, W);
      }
      ctx.restore();
      return { phase: "minigame " + (i + 1) };
    } };
  } };

  // ---------- City: knowledge as buildings in your own city; answers upgrade them ----------
  var city = { create: function (o) {
    o = Object.assign({ streak: "12 dagen", score: "2.480", upgrade: 2, hold: 36,
      blocks: [["Offertes", 2], ["Planning", 3], ["Klanten", 2], ["Inkoop", 1], ["Contracten", 2]] }, o);
    var tUp = o.blocks.length * 4 + 14;
    return { total: tUp + 24 + o.hold, opts: o, render: function (ctx, f0) {
      var f = twos(o, f0), W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180; K.bgDark(ctx, W, H);
      var cx = W / 2, cy = 160 * u, tw = 44 * u, th = 22 * u;
      function iso(gx, gy) { return [cx + (gx - gy) * tw / 2, cy + (gx + gy) * th / 2]; }
      for (var gx = -1; gx <= 1; gx++) for (var gy = -1; gy <= 1; gy++) {
        var p = iso(gx, gy); ctx.beginPath(); ctx.moveTo(p[0], p[1] - th / 2); ctx.lineTo(p[0] + tw / 2, p[1]); ctx.lineTo(p[0], p[1] + th / 2); ctx.lineTo(p[0] - tw / 2, p[1]); ctx.closePath();
        ctx.strokeStyle = "rgba(254,249,237,.08)"; ctx.lineWidth = 0.6 * u; ctx.stroke();
      }
      var spots = [[-1.5, 0], [0, -1.5], [0, 0], [1.5, 0], [0, 1.5]], labels = [];
      // Draw back to front (depth = gx + gy), labels last so they never hide behind a building.
      o.blocks.map(function (b, i) { return [b, i]; }).sort(function (x, y) { var a = spots[x[1] % spots.length], c = spots[y[1] % spots.length]; return (a[0] + a[1]) - (c[0] + c[1]); }).forEach(function (bi) {
        var b = bi[0], i = bi[1];
        var sp = spots[i % spots.length], p = iso(sp[0], sp[1]), t = E("overshoot", seg(f, i * 4, i * 4 + 12));
        var up = i === o.upgrade ? E("overshoot", seg(f, tUp, tUp + 14)) : 0, floors = b[1] + up, hgt = floors * 13 * u * t;
        if (t <= 0) return;
        var hw = tw * 0.36, hh = th * 0.36, top = p[1] - hgt, gold = i === o.upgrade && up > 0;
        ctx.beginPath(); ctx.moveTo(p[0] - hw, p[1]); ctx.lineTo(p[0], p[1] + hh); ctx.lineTo(p[0], top + hh); ctx.lineTo(p[0] - hw, top); ctx.closePath(); ctx.fillStyle = gold ? "#C9A24A" : "#3a3833"; ctx.fill();
        ctx.beginPath(); ctx.moveTo(p[0] + hw, p[1]); ctx.lineTo(p[0], p[1] + hh); ctx.lineTo(p[0], top + hh); ctx.lineTo(p[0] + hw, top); ctx.closePath(); ctx.fillStyle = gold ? "#a8853a" : "#2c2a26"; ctx.fill();
        ctx.beginPath(); ctx.moveTo(p[0], top - hh); ctx.lineTo(p[0] + hw, top); ctx.lineTo(p[0], top + hh); ctx.lineTo(p[0] - hw, top); ctx.closePath(); ctx.fillStyle = gold ? GOLD : "#e9e2d2"; ctx.fill();
        labels.push([b[0] + (gold ? " · level " + (b[1] + 1) : ""), p[0], top - hh - (gold ? 14 : 5) * u, gold]);
      });
      ctx.textAlign = "center"; ctx.shadowColor = "rgba(0,0,0,.8)"; ctx.shadowBlur = 4 * u;
      labels.forEach(function (l) { ctx.fillStyle = l[3] ? GOLD : MUTED; font(ctx, l[3] ? 600 : 400, 6.5 * u); ctx.fillText(l[0], l[1], l[2]); });
      ctx.shadowBlur = 0; ctx.textAlign = "left";
      var ha = E("easeOut", seg(f, 4, 14));
      ctx.save(); ctx.globalAlpha = ha;
      rr(ctx, 18 * u, 40 * u, 66 * u, 22 * u, 11 * u); ctx.fillStyle = "rgba(254,249,237,.06)"; ctx.fill(); ctx.strokeStyle = "rgba(254,249,237,.3)"; ctx.lineWidth = 0.8 * u; ctx.stroke();
      ctx.fillStyle = MUTED; font(ctx, 600, 5 * u); ctx.fillText("STREAK", 26 * u, 49 * u); ctx.fillStyle = GOLD; font(ctx, 600, 8 * u); ctx.fillText(o.streak, 26 * u, 58 * u);
      ctx.textAlign = "right"; ctx.fillStyle = MUTED; font(ctx, 600, 5.5 * u); ctx.fillText("SCORE", W - 18 * u, 46 * u); ctx.fillStyle = CREAM; font(ctx, 600, 11 * u); ctx.fillText(o.score, W - 18 * u, 58 * u); ctx.textAlign = "left";
      ctx.restore();
      return { phase: f < tUp ? "stad groeit" : "upgrade" };
    } };
  } };

  // ---------- Chat: the knowledge base answers a colleague's question ----------
  var chat = { create: function (o) {
    o = Object.assign({ title: "Kennisbank", q: "Hoe keur ik een afwijkende offerte?", a: "Eerst de marge checken, boven de 50k akkoord van finance. Bij spoed: bel de accountmanager.", source: "bron: kennisbank", hold: 36 }, o);
    var tQ = 8, tA = tQ + 22, aLen = Math.ceil(o.a.length / 1.8);
    return { total: tA + aLen + 12 + o.hold, opts: o, render: function (ctx, f0) {
      var f = twos(o, f0), W = ctx.canvas.width, H = ctx.canvas.height, u = W / 180; K.bgDark(ctx, W, H);
      var ha = E("easeOut", seg(f, 0, 8));
      ctx.save(); ctx.globalAlpha = ha; icon(ctx, "base", 18 * u, 38 * u, 14 * u, GOLD); ctx.fillStyle = CREAM; font(ctx, 600, 10 * u); ctx.fillText(o.title, 38 * u, 49 * u); ctx.fillStyle = LINE; ctx.fillRect(18 * u, 60 * u, W - 36 * u, 0.6 * u); ctx.restore();
      var qa = E("easeOut", seg(f, tQ, tQ + 8));
      if (qa > 0) { ctx.save(); ctx.globalAlpha = qa; ctx.translate(0, (1 - qa) * 8 * u); font(ctx, 400, 8 * u); var ql = wrap(ctx, o.q, 110 * u), qh = 12 * u + ql.length * 11 * u;
        rr(ctx, W - 18 * u - 124 * u, 74 * u, 124 * u, qh, 9 * u); ctx.fillStyle = "rgba(254,249,237,.10)"; ctx.fill(); ctx.fillStyle = CREAM; ql.forEach(function (l, i) { ctx.fillText(l, W - 18 * u - 117 * u, 86 * u + i * 11 * u); }); ctx.restore(); }
      if (f >= tA) { var aa = E("easeOut", seg(f, tA, tA + 8)); ctx.save(); ctx.globalAlpha = aa; font(ctx, 400, 8 * u); var al = wrap(ctx, o.a, 124 * u), ah = 26 * u + al.length * 11 * u;
        rr(ctx, 18 * u, 112 * u, 138 * u, ah, 9 * u); ctx.fillStyle = "rgba(249,200,82,.10)"; ctx.fill(); ctx.strokeStyle = "rgba(249,200,82,.55)"; ctx.lineWidth = 0.8 * u; ctx.stroke();
        K.mark(ctx, 27 * u, 122 * u, 7 * u, 0, GOLD); ctx.fillStyle = CREAM; typed(ctx, o.a, (f - tA - 4) * 1.8, 25 * u, 140 * u, 124 * u, 11 * u);
        var sa = seg(f, tA + aLen + 4, tA + aLen + 12); ctx.globalAlpha = aa * sa; ctx.fillStyle = MUTED; font(ctx, 400, 5.5 * u); ctx.fillText("▸ " + o.source, 25 * u, 112 * u + ah - 7 * u); ctx.restore(); }
      return { phase: f < tA ? "vraag" : "antwoord uit de kennisbank" };
    } };
  } };

  // ---------- Dark: just the canvas with the amber glow (for a glass card or captions on their own) ----------
  var dark = { create: function (o) { return { total: 24, opts: o || {}, render: function (ctx) { K.bgDark(ctx, ctx.canvas.width, ctx.canvas.height); return { phase: "canvas" }; } }; } };

  window.IBSGraphics = { mail: mail, puzzle: puzzle, badges: badges, knowmap: knowmap, flow: flow, minigames: minigames, city: city, chat: chat, dark: dark, icon: icon, ICONS: ICONS };
})();
