// Image-processing looks on a canvas: the kind of effect you can define once in code and get back
// exactly the same every time. FX.apply(name, srcCanvas, dstCanvas, colors?)
// name: "none" | "edges" (Sobel) | "dither" (ordered Bayer 4x4) | "halftone" | "pixelsort" | "duotone" |
// "posterize" | "threshold" | "grain" | "scanlines" | "vignette" | "invert" | "rgbsplit" | "glitch".
// colors: { dark: "#171717", light: "#F9C852", amt: 0–1 strength, t: seconds (for moving looks) }.
(function () {
  function hex(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function lum(d, i) { return 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; }

  function edges(src, out, dark, light) {
    var w = src.width, h = src.height, d = src.data, o = out.data, g = new Float32Array(w * h), x, y;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) g[y * w + x] = lum(d, (y * w + x) * 4);
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      var i = (y * w + x) * 4, m = 0;
      if (x > 0 && y > 0 && x < w - 1 && y < h - 1) {
        var p = function (dx, dy) { return g[(y + dy) * w + x + dx]; };
        var gx = -p(-1, -1) - 2 * p(-1, 0) - p(-1, 1) + p(1, -1) + 2 * p(1, 0) + p(1, 1);
        var gy = -p(-1, -1) - 2 * p(0, -1) - p(1, -1) + p(-1, 1) + 2 * p(0, 1) + p(1, 1);
        m = Math.min(1, Math.sqrt(gx * gx + gy * gy) / 360);
      }
      for (var k = 0; k < 3; k++) o[i + k] = dark[k] + (light[k] - dark[k]) * m;
      o[i + 3] = 255;
    }
  }

  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function dither(src, out, dark, light) {
    var w = src.width, h = src.height, d = src.data, o = out.data, cell = 2;
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var i = (y * w + x) * 4, t = (BAYER[((y / cell | 0) % 4) * 4 + ((x / cell | 0) % 4)] + 0.5) / 16;
      var c = lum(d, i) / 255 > t ? light : dark;
      o[i] = c[0]; o[i + 1] = c[1]; o[i + 2] = c[2]; o[i + 3] = 255;
    }
  }

  function pixelsort(src, out) {
    var w = src.width, h = src.height, d = src.data, o = out.data;
    o.set(d);
    for (var x = 0; x < w; x++) {
      var y = 0;
      while (y < h) {
        while (y < h && lum(d, (y * w + x) * 4) < 70) y++;
        var start = y, px = [];
        while (y < h && lum(d, (y * w + x) * 4) >= 70) { var i = (y * w + x) * 4; px.push([d[i], d[i + 1], d[i + 2], lum(d, i)]); y++; }
        px.sort(function (a, b) { return a[3] - b[3]; });
        px.forEach(function (p, k) { var j = ((start + k) * w + x) * 4; o[j] = p[0]; o[j + 1] = p[1]; o[j + 2] = p[2]; o[j + 3] = 255; });
      }
    }
  }

  // Per-pixel looks. amt (0–1) is the strength; t is time in seconds, for looks that move.
  function pixel(name, src, out, dark, light, amt, t) {
    var w = src.width, h = src.height, d = src.data, o = out.data, x, y, i, k, n = w * h * 4;
    if (name === "rgbsplit") {
      var sh = Math.round(2 + amt * 10);
      for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
        i = (y * w + x) * 4;
        var xr = Math.min(w - 1, x + sh), xb = Math.max(0, x - sh);
        o[i] = d[(y * w + xr) * 4]; o[i + 1] = d[i + 1]; o[i + 2] = d[(y * w + xb) * 4 + 2]; o[i + 3] = 255;
      }
      return;
    }
    if (name === "glitch") {
      o.set(d);
      var seed = Math.floor(t * 12), rnd = function (q) { var v = Math.sin(seed * 91.7 + q * 12.9898) * 43758.5453; return v - Math.floor(v); };
      var bands = Math.round(3 + amt * 8);
      for (k = 0; k < bands; k++) {
        var y0 = Math.floor(rnd(k) * h), bh = Math.floor(2 + rnd(k + 50) * h * 0.08), off = Math.round((rnd(k + 99) - 0.5) * w * 0.35 * amt);
        for (y = y0; y < Math.min(h, y0 + bh); y++) for (x = 0; x < w; x++) {
          var sx = Math.min(w - 1, Math.max(0, x - off)), a = (y * w + x) * 4, b = (y * w + sx) * 4;
          o[a] = d[b]; o[a + 1] = d[b + 1]; o[a + 2] = d[b + 2];
          if (k % 3 === 0) o[a + 1] = Math.min(255, d[b + 1] * 0.4);
        }
      }
      return;
    }
    for (i = 0; i < n; i += 4) {
      var L = lum(d, i), r = d[i], g = d[i + 1], bl = d[i + 2];
      if (name === "duotone") {
        var q2 = L / 255; r = dark[0] + (light[0] - dark[0]) * q2; g = dark[1] + (light[1] - dark[1]) * q2; bl = dark[2] + (light[2] - dark[2]) * q2;
        r = d[i] * (1 - amt) + r * amt; g = d[i + 1] * (1 - amt) + g * amt; bl = d[i + 2] * (1 - amt) + bl * amt;
      } else if (name === "posterize") {
        var lv = Math.max(2, Math.round(8 - amt * 6)), st = 255 / (lv - 1);
        r = Math.round(r / st) * st; g = Math.round(g / st) * st; bl = Math.round(bl / st) * st;
      } else if (name === "threshold") {
        var c = L > 255 * (0.3 + amt * 0.4) ? light : dark; r = c[0]; g = c[1]; bl = c[2];
      } else if (name === "grain") {
        var nz = (Math.random() - 0.5) * 120 * amt; r += nz; g += nz; bl += nz;
      } else if (name === "scanlines") {
        var row = (i / 4 / w) | 0, f = row % 3 === 0 ? 1 - 0.6 * amt : 1; r *= f; g *= f; bl *= f;
      } else if (name === "vignette") {
        var px = (i / 4) % w, py = (i / 4 / w) | 0, dx = px / w - 0.5, dy = py / h - 0.5, v = 1 - Math.min(1, (dx * dx * 2.2 + dy * dy * 1.6) * 1.6 * amt);
        r *= v; g *= v; bl *= v;
      } else if (name === "invert") { r = 255 - r; g = 255 - g; bl = 255 - bl; }
      o[i] = r; o[i + 1] = g; o[i + 2] = bl; o[i + 3] = 255;
    }
  }
  var PIXEL = ["duotone", "posterize", "threshold", "grain", "scanlines", "vignette", "invert", "rgbsplit", "glitch"];

  function apply(name, srcCanvas, dstCanvas, colors) {
    colors = colors || {};
    var dark = hex(colors.dark || "#171717"), light = hex(colors.light || "#F9C852");
    var w = srcCanvas.width, h = srcCanvas.height;
    dstCanvas.width = w; dstCanvas.height = h;
    var sctx = srcCanvas.getContext("2d"), dctx = dstCanvas.getContext("2d");
    if (name === "none") { dctx.drawImage(srcCanvas, 0, 0); return; }
    var src = sctx.getImageData(0, 0, w, h);
    if (name === "halftone") {
      var step = Math.max(5, Math.round(w / 45));
      dctx.fillStyle = colors.dark || "#171717"; dctx.fillRect(0, 0, w, h);
      dctx.fillStyle = colors.light || "#F9C852";
      for (var y = 0; y < h; y += step) for (var x = 0; x < w; x += step) {
        var i = ((y + (step >> 1)) * w + Math.min(w - 1, x + (step >> 1))) * 4;
        var r = Math.sqrt(lum(src.data, Math.min(i, src.data.length - 4)) / 255) * step * 0.62;
        if (r > 0.4) { dctx.beginPath(); dctx.arc(x + step / 2, y + step / 2, r, 0, Math.PI * 2); dctx.fill(); }
      }
      return;
    }
    var out = dctx.createImageData(w, h);
    if (PIXEL.indexOf(name) >= 0) pixel(name, src, out, dark, light, colors.amt == null ? 0.6 : colors.amt, colors.t || 0);
    else if (name === "edges") edges(src, out, dark, light);
    else if (name === "dither") dither(src, out, dark, light);
    else if (name === "pixelsort") pixelsort(src, out);
    dctx.putImageData(out, 0, 0);
  }

  // A procedural scene to run the looks on: a person in front of a window at golden hour.
  function scene(canvas, t) {
    var c = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
    t = t || 0;
    var sky = c.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#2a1a3d"); sky.addColorStop(0.55, "#c9683a"); sky.addColorStop(1, "#f5c46a");
    c.fillStyle = sky; c.fillRect(0, 0, w, h);
    c.fillStyle = "#ffe3a1"; c.beginPath(); c.arc(w * 0.72, h * (0.42 + Math.sin(t) * 0.01), w * 0.12, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#1b1424";
    [[0, .62, .16], [.15, .5, .12], [.27, .66, .14], [.6, .55, .13], [.74, .63, .1], [.85, .48, .16]].forEach(function (b) { c.fillRect(b[0] * w, b[1] * h, b[2] * w, h); });
    c.fillStyle = "#3a2a20"; c.fillRect(0, 0, w * 0.05, h); c.fillRect(w * 0.95, 0, w * 0.05, h); c.fillRect(0, h * 0.3, w, h * 0.02);
    var px = w * (0.36 + Math.sin(t * 0.8) * 0.01);
    var body = c.createRadialGradient(px, h * 0.72, w * 0.05, px, h * 0.8, w * 0.4);
    body.addColorStop(0, "#5a4a42"); body.addColorStop(1, "#151012");
    c.fillStyle = body; c.beginPath(); c.ellipse(px, h * 1.02, w * 0.3, h * 0.3, 0, 0, Math.PI * 2); c.fill();
    var face = c.createRadialGradient(px + w * 0.05, h * 0.5, w * 0.02, px, h * 0.52, w * 0.13);
    face.addColorStop(0, "#f2c9a0"); face.addColorStop(1, "#6b4a36");
    c.fillStyle = face; c.beginPath(); c.ellipse(px, h * 0.52, w * 0.1, h * 0.085, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#2a1c14"; c.beginPath(); c.ellipse(px - w * 0.01, h * 0.455, w * 0.105, h * 0.045, -0.1, Math.PI, 0); c.fill();
  }

  window.FX = { apply: apply, scene: scene };
})();
