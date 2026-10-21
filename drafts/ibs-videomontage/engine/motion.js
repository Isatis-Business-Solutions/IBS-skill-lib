// Motion helpers: cubic-bezier easing (same math as CSS and After Effects-style curves) and a small
// graph editor that draws a value graph with draggable handles.
//
//   var e = Motion.bezier([0, 0, 0.2, 1]); e(0.5) // → eased value
//   Motion.EASES.easeOut.curve                    // [x1, y1, x2, y2]
//   var g = Motion.graph(canvas, [0.4, 0, 0.2, 1], onChange); g.set(curve); g.dot(progress);
(function () {
  function bezier(c) {
    var x1 = c[0], y1 = c[1], x2 = c[2], y2 = c[3];
    function ax(t) { return 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t; }
    function ay(t) { return 3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t; }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 30; i++) { var v = ax(t); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
      return ay(t);
    };
  }

  var EASES = {
    linear:    { label: "Linear",       curve: [0, 0, 1, 1],          say: "Constante snelheid. Voelt mechanisch." },
    easeOut:   { label: "Ease-out",     curve: [0, 0, 0.2, 1],        say: "Snel erin, rustig landen. Voor dingen die binnenkomen." },
    easeIn:    { label: "Ease-in",      curve: [0.4, 0, 1, 1],        say: "Rustig vertrekken, snel weg. Voor dingen die verdwijnen." },
    easeInOut: { label: "Ease-in-out",  curve: [0.4, 0, 0.2, 1],      say: "Rustig weg, snel midden, rustig aan. Voor iets dat van A naar B gaat." },
    expoIn:    { label: "Expo-in",      curve: [0.7, 0, 0.84, 0],     say: "Lang niets, dan steeds harder. Bouwt spanning op." },
    overshoot: { label: "Overshoot",    curve: [0.34, 1.56, 0.64, 1], say: "Schiet voorbij het doel en veert terug. Speels; de IBS-huisstijl vermijdt dit." }
  };

  function graph(cv, curve, onChange) {
    var c = cv.getContext("2d"), W = cv.width, H = cv.height, pad = 0.18, cur = curve.slice(), prog = -1, drag = -1;
    var ymin = -0.4, ymax = 1.7; // room for overshoot handles
    function px(x) { return W * pad + x * W * (1 - 2 * pad); }
    function py(y) { return H - (H * 0.08 + (y - ymin) / (ymax - ymin) * H * 0.84); }
    function ix(X) { return (X - W * pad) / (W * (1 - 2 * pad)); }
    function iy(Y) { return ymin + (H - Y - H * 0.08) / (H * 0.84) * (ymax - ymin); }
    var css = getComputedStyle(document.documentElement);
    function col(v, f) { return (css.getPropertyValue(v) || f).trim() || f; }
    function draw() {
      var text = col("--text", "#222"), rule = col("--rule", "#ddd"), acc = col("--accent", "#b4532a"), muted = col("--muted", "#888");
      c.clearRect(0, 0, W, H);
      c.strokeStyle = rule; c.lineWidth = 1;
      c.strokeRect(px(0), py(1), px(1) - px(0), py(0) - py(1));
      c.fillStyle = muted; c.font = (W / 26) + "px system-ui, sans-serif";
      c.fillText("tijd →", px(1) - W * 0.12, py(0) + H * 0.06); c.save(); c.translate(px(0) - W * 0.04, py(0.2)); c.rotate(-Math.PI / 2); c.fillText("waarde →", 0, 0); c.restore();
      c.strokeStyle = muted; c.setLineDash([3, 3]);
      c.beginPath(); c.moveTo(px(0), py(0)); c.lineTo(px(cur[0]), py(cur[1])); c.moveTo(px(1), py(1)); c.lineTo(px(cur[2]), py(cur[3])); c.stroke();
      c.setLineDash([]);
      var e = bezier(cur);
      c.strokeStyle = text; c.lineWidth = 2.5; c.beginPath();
      for (var i = 0; i <= 60; i++) { var x = i / 60; if (i) c.lineTo(px(x), py(e(x))); else c.moveTo(px(x), py(e(x))); }
      c.stroke();
      [[cur[0], cur[1]], [cur[2], cur[3]]].forEach(function (h) { c.fillStyle = acc; c.beginPath(); c.arc(px(h[0]), py(h[1]), W / 28, 0, 7); c.fill(); });
      [[0, 0], [1, 1]].forEach(function (k) { c.fillStyle = text; c.fillRect(px(k[0]) - 4, py(k[1]) - 4, 8, 8); });
      if (prog >= 0) { c.fillStyle = acc; c.beginPath(); c.arc(px(prog), py(e(prog)), W / 40, 0, 7); c.fill(); }
    }
    function pos(ev) { var r = cv.getBoundingClientRect(); return [(ev.clientX - r.left) * W / r.width, (ev.clientY - r.top) * H / r.height]; }
    cv.style.touchAction = "none";
    cv.addEventListener("pointerdown", function (ev) {
      var p = pos(ev), best = -1, bd = 1e9;
      [0, 2].forEach(function (k) { var d = Math.hypot(px(cur[k]) - p[0], py(cur[k + 1]) - p[1]); if (d < bd) { bd = d; best = k; } });
      if (bd < W / 8) { drag = best; cv.setPointerCapture(ev.pointerId); }
    });
    cv.addEventListener("pointermove", function (ev) {
      if (drag < 0) return;
      var p = pos(ev);
      cur[drag] = Math.max(0, Math.min(1, ix(p[0]))); cur[drag + 1] = Math.max(-0.4, Math.min(1.6, iy(p[1])));
      cur = cur.map(function (v) { return Math.round(v * 100) / 100; });
      draw(); if (onChange) onChange(cur.slice());
    });
    cv.addEventListener("pointerup", function () { drag = -1; });
    draw();
    return {
      set: function (c2) { cur = c2.slice(); draw(); },
      dot: function (p) { prog = p; draw(); },
      get: function () { return cur.slice(); }
    };
  }

  function css(curve) { return "cubic-bezier(" + curve.join(", ") + ")"; }

  window.Motion = { bezier: bezier, EASES: EASES, graph: graph, css: css };
})();
