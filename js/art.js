/* js/art.js — PURE pixel-art layer: palette + stateless drawing primitives, extracted from
   ui.js (STRUCTURE-epic, loop iter 57). Exposes window.ART; ui.js binds these names into its
   closure. No game/view state here (orchestrators that read S()/actors/tapFx stay in ui.js). */
(function () {
  "use strict";
  var T = CONFIG.TILE, GW = CONFIG.GRID_W, GH = CONFIG.GRID_H;
  var PX = { // bright daytime palette
    grass: "#7fb84a", grassD: "#72a83f", grassL: "#8cc457", grassT: "#6a9c3a",
    path: "#d8b779", pathD: "#bd9a5c", pathHi: "#e7cf9b",
    out: "#2c2738", skin: "#f4c79c", skinD: "#e2a878", eye: "#3a2f3a",
    pants: "#46506a", pantsD: "#343c52", shoe: "#2c2535", mouth: "#a85248",
    gold: "#f5cd6a", roof: "#caa24a"
  };
  var ROOM_STYLE = { // bright pixel-art buildings
    phonghoc: { wall: "#f0dcab", wallD: "#d4bd86", roof: "gabled",   rc: "#e0584a", rcD: "#bf4439", win: "warm",  short: "Phòng học" },
    san:      { wall: "#5fae4a", roof: "none",      win: "none",                                     short: "Sân trường" },
    cangtin:  { wall: "#f3b676", wallD: "#d9985a", roof: "awning",   rc: "#e0584a", rcD: "#bf4439", win: "warm",  short: "Căng tin" },
    lab:      { wall: "#c2e8e3", wallD: "#9bccc7", roof: "glossy",   rc: "#4fb0c0", rcD: "#3a8d9c", win: "glass", short: "Lab" },
    phongmay: { wall: "#d8c6ef", wallD: "#b9a4d8", roof: "flatvent", rc: "#8a6cc0", rcD: "#6f53a4", win: "cold",  short: "Phòng máy" },
    xuong:    { wall: "#cca982", wallD: "#ad8a62", roof: "sawtooth", rc: "#9a7548", rcD: "#7d5d36", win: "warm",  short: "Xưởng" },
    vuontdn:  { garden: true, accent: "#6fcf97", short: "Trần Đại Nghĩa" },
    vuontqb:  { garden: true, accent: "#6aa9f0", short: "Tạ Quang Bửu" },
    vuonhxh:  { garden: true, accent: "#f15a7a", short: "Hồ Xuân Hương" },
    vuonntt:  { garden: true, accent: "#f2c14e", short: "Nguyễn Trường Tộ" },
    vuoncva:  { garden: true, accent: "#b48ef0", short: "Chu Văn An" }
  };
  function shade(hex, pct) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (pct > 0) { r += (255 - r) * pct; g += (255 - g) * pct; b += (255 - b) * pct; }
    else { r *= (1 + pct); g *= (1 + pct); b *= (1 + pct); }
    return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
  }
  function glow(ctx, cx, cy, col) { var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8); g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(cx - 8, cy - 8, 16, 16); }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  // make the current tap selection unmistakable on the map (mobile: small targets need a clear marker)
  function drawJune(ctx, W, H) {
    // red carpet down the central path (the graduation procession route to the cổng)
    var cx = (GW >> 1) * T;
    ctx.fillStyle = "#9a2b2b"; ctx.fillRect(cx + 4, 0, T - 8, H);
    ctx.fillStyle = "#bd3a3a"; ctx.fillRect(cx + 5, 0, T - 10, H);
    ctx.fillStyle = PX.gold; ctx.fillRect(cx + 5, 0, 1, H); ctx.fillRect(cx + T - 6, 0, 1, H); // gold trim
    ctx.fillStyle = "rgba(255,255,255,.10)"; for (var cy = 4; cy < H; cy += 12) ctx.fillRect(cx + 6, cy, T - 12, 1); // weave
    // tossed mortarboard caps near the top — the signature graduation image
    mortarboard(ctx, 44, 16); mortarboard(ctx, 126, 9); mortarboard(ctx, 250, 14); mortarboard(ctx, 330, 20);
    // academic bunting (blue/gold) strung across the very top
    var cols = ["#4a8fe0", "#f2c14e"], k = 0;
    for (var bx = 6; bx < W - 8; bx += 16) {
      ctx.fillStyle = cols[(k++) % 2];
      for (var t = 0; t < 6; t++) ctx.fillRect(bx + 1 + t, 3, 7 - 2 * t > 0 ? 7 - 2 * t : 1, 1);
    }
  }
  function mortarboard(ctx, x, y) {
    ctx.fillStyle = PX.out; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x + 7, y); ctx.lineTo(x, y + 4); ctx.lineTo(x - 7, y); ctx.closePath(); ctx.fill(); // board rim
    ctx.fillStyle = "#262626"; ctx.beginPath(); ctx.moveTo(x, y - 2.5); ctx.lineTo(x + 5, y); ctx.lineTo(x, y + 2.5); ctx.lineTo(x - 5, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#3a3a3a"; ctx.fillRect(x - 2, y, 4, 3); // cap base under the board
    ctx.fillStyle = PX.gold; ctx.fillRect(x, y - 1, 1, 1); // button
    ctx.fillStyle = "#f2c14e"; ctx.fillRect(x + 4, y, 1, 4); ctx.fillRect(x + 4, y + 4, 2, 1); // tassel
  }
  function drawTet(ctx, W, H) {
    // bunting garland across the top (above the building band) — alternating red/gold/teal flags
    var cols = ["#e0584a", "#f2c14e", "#5fd0c5"], k = 0;
    ctx.fillStyle = "#6e4f26"; ctx.fillRect(0, 3, W, 1);
    for (var bx = 4; bx < W - 8; bx += 13) {
      var sag = (Math.sin(bx / W * 3.14159) * 3) | 0, by = 4 + sag;
      ctx.fillStyle = "#6e4f26"; ctx.fillRect(bx, 3, 1, by - 3); // hanger
      ctx.fillStyle = cols[(k++) % 3];
      for (var t = 0; t < 7; t++) ctx.fillRect(bx + 1 + t, by, 9 - 2 * t > 0 ? 9 - 2 * t : 1, 1); // little triangle flag
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(bx + 1, by, 3, 1);
    }
    // red lanterns + blossom pots flanking the cổng (bottom-centre, always clear of buildings)
    var px = ((GW >> 1) * T + T / 2) | 0, gateTop = GH * T - 24;
    lantern(ctx, px - 22, gateTop - 12); lantern(ctx, px + 22, gateTop - 12);
    blossomPot(ctx, px - 34, GH * T - 7, "#ffd24a", "#ffe9a6"); // mai (yellow)
    blossomPot(ctx, px + 33, GH * T - 7, "#ff7eb0", "#ffd0e4"); // đào (pink)
  }
  function lampPost(ctx, x, baseY) {
    ctx.fillStyle = "rgba(20,34,14,.20)"; ctx.fillRect(x - 2, baseY, 6, 2);   // ground shadow
    ctx.fillStyle = PX.out; ctx.fillRect(x, baseY - 17, 2, 17);               // pole
    ctx.fillStyle = "#6a645c"; ctx.fillRect(x, baseY - 16, 1, 15);
    ctx.fillStyle = PX.out; ctx.fillRect(x - 2, baseY - 21, 6, 5);            // lamp head
    ctx.fillStyle = "#fff3c0"; ctx.fillRect(x - 1, baseY - 20, 4, 3);         // warm glow
    ctx.fillStyle = PX.gold; ctx.fillRect(x - 1, baseY - 20, 4, 1); ctx.fillRect(x - 2, baseY - 22, 6, 1);
  }
  function lantern(ctx, cx, cy) {
    ctx.fillStyle = "#6e4f26"; ctx.fillRect(cx, cy - 4, 1, 4);                       // cord
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 3, cy, 6, 9);                          // body outline
    ctx.fillStyle = "#e0392f"; ctx.fillRect(cx - 2, cy + 1, 5, 7);                   // red body
    ctx.fillStyle = "#ff6a5a"; ctx.fillRect(cx - 2, cy + 1, 1, 7);                   // sheen
    ctx.fillStyle = PX.gold; ctx.fillRect(cx - 2, cy, 5, 1); ctx.fillRect(cx - 2, cy + 8, 5, 1); // gold caps
    ctx.fillStyle = "#f2c14e"; ctx.fillRect(cx, cy + 9, 1, 3);                       // tassel
  }
  function blossomPot(ctx, cx, cy, blo, bloHi) {
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 3, cy, 7, 5);                          // pot outline
    ctx.fillStyle = "#b5532f"; ctx.fillRect(cx - 2, cy + 1, 5, 3); ctx.fillStyle = "#cf6a40"; ctx.fillRect(cx - 2, cy + 1, 5, 1);
    ctx.fillStyle = "#5a3b22"; ctx.fillRect(cx, cy - 6, 1, 7);                       // little trunk
    ctx.fillStyle = blo; ctx.fillRect(cx - 3, cy - 10, 7, 5); ctx.fillRect(cx - 2, cy - 11, 5, 1); // blossom puff
    ctx.fillStyle = bloHi; ctx.fillRect(cx - 2, cy - 10, 2, 2); ctx.fillRect(cx + 1, cy - 8, 1, 1);
    ctx.fillStyle = PX.gold; ctx.fillRect(cx - 1, cy - 8, 1, 1); ctx.fillRect(cx + 1, cy - 10, 1, 1); // golden centres
  }
  function pathBand(ctx, x, y, w, h, horiz, tier) {
    tier = tier || 0; var px, py;
    if (tier >= 2) { // prestigious: light stone-paved plaza
      ctx.fillStyle = "#8b857a"; roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 4); ctx.fill();
      ctx.fillStyle = "#aaa395"; roundRect(ctx, x + 2, y + 2, w - 4, h - 5, 4); ctx.fill();
      ctx.fillStyle = "#c5bfb0"; ctx.fillRect(x + 3, y + 2, w - 6, 1);
      ctx.fillStyle = "rgba(74,68,58,.32)"; // tile seams
      if (horiz) { for (px = x + 11; px < x + w - 4; px += 13) ctx.fillRect(px, y + 2, 1, h - 6); }
      else { for (py = y + 11; py < y + h - 4; py += 13) ctx.fillRect(x + 2, py, w - 6, 1); }
      return;
    }
    ctx.fillStyle = PX.pathD; roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 4); ctx.fill();
    ctx.fillStyle = PX.path; roundRect(ctx, x + 2, y + 2, w - 4, h - 5, 4); ctx.fill();
    ctx.fillStyle = PX.pathHi; ctx.fillRect(x + 3, y + 2, w - 6, 1);
    if (tier >= 1) { ctx.fillStyle = "#d2c5a2"; if (horiz) { ctx.fillRect(x + 1, y + 1, w - 2, 1); ctx.fillRect(x + 1, y + h - 2, w - 2, 1); } else { ctx.fillRect(x + 1, y + 1, 1, h - 2); ctx.fillRect(x + w - 2, y + 1, 1, h - 2); } } // tidy stone edging
    ctx.fillStyle = "rgba(120,90,50,.20)";
    if (horiz) { for (px = x + 8; px < x + w - 4; px += 10) ctx.fillRect(px, y + 2, 1, h - 6); }
    else { for (py = y + 8; py < y + h - 4; py += 10) ctx.fillRect(x + 2, py, w - 6, 1); }
  }
  function drawRoom(ctx, r) {
    var d = CONFIG.ROOMS[r.key], sty = ROOM_STYLE[r.key] || { wall: "#555", roof: "gabled", win: "warm", short: d.name };
    var x = (r.x * T + 1) | 0, y = (r.y * T + 1) | 0, w = (d.w * T - 2) | 0, h = (d.h * T - 2) | 0;
    if (sty.garden) { drawGarden(ctx, x, y, w, h, sty); roomLabel(ctx, sty.short, x, y, w, h); return; }
    if (sty.roof === "none") {
      ctx.fillStyle = "rgba(28,44,18,.16)"; ctx.fillRect(x + 3, y + h, w, 3); // soft ground shadow
      drawSan(ctx, x, y, w, h); roomLabel(ctx, sty.short, x, y, w, h); return;
    }
    var roofH = Math.min(16, (h * 0.42) | 0), wallTop = y + roofH;
    var dp = 5; // 3D extrusion depth — the block has thickness toward the lower-right
    // CONTACT SHADOW — one directional pool down-right (light from upper-left)
    ctx.fillStyle = "rgba(16,28,12,.22)";
    ctx.beginPath(); ctx.moveTo(x + 2, y + h + 1); ctx.lineTo(x + w + dp + 1, y + h + 1);
    ctx.lineTo(x + w + dp + 6, y + h + 6); ctx.lineTo(x + 7, y + h + 6); ctx.closePath(); ctx.fill();
    // EXTRUSION — solid dark silhouette offset down-right gives the box its 3D thickness
    var sideW = shade(sty.wall, -0.40), sideR = shade(sty.rc || "#c8553f", -0.40);
    ctx.fillStyle = PX.out; ctx.fillRect(x + dp, wallTop + dp - 1, w, h - roofH + 1);   // wall side base
    ctx.fillStyle = sideW; ctx.fillRect(x + dp + 1, wallTop + dp, w - 1, h - roofH - 1); // wall side face
    roofDepth(ctx, sty.roof, x, y, w, roofH, dp, sideR);                                 // roof side face
    // ---- FRONT FACES ----
    // WALL: dark outline base → bright wall → right shade → lit top+left edges → plank lines
    ctx.fillStyle = PX.out; ctx.fillRect(x, wallTop - 1, w, h - roofH + 1);
    ctx.fillStyle = sty.wall; ctx.fillRect(x + 1, wallTop, w - 2, h - roofH - 1);
    ctx.fillStyle = sty.wallD; ctx.fillRect(x + w - 3, wallTop, 2, h - roofH - 1);
    ctx.fillStyle = "rgba(255,255,255,.22)"; ctx.fillRect(x + 1, wallTop, w - 2, 1);     // lit top edge
    ctx.fillStyle = "rgba(255,255,255,.15)"; ctx.fillRect(x + 1, wallTop, 1, h - roofH - 1); // lit left edge
    ctx.fillStyle = sty.wallD; for (var ly = wallTop + 5; ly < y + h - 4; ly += 6) ctx.fillRect(x + 1, ly, w - 2, 1);
    // WINDOWS
    drawWindows(ctx, sty.win, x, wallTop, w, h - roofH);
    // ROOF
    drawRoof(ctx, sty.roof, sty, x, y, w, roofH);
    if (r.key === "cangtin") { ctx.fillStyle = PX.out; ctx.fillRect(x + w - 9, y - 3, 4, roofH + 3); ctx.fillStyle = "#9a6238"; ctx.fillRect(x + w - 8, y - 2, 2, roofH + 2); ctx.fillStyle = "#6e4626"; ctx.fillRect(x + w - 9, y - 3, 4, 1); } // chimney
    // DOOR (framed wood, facing path)
    var dw = 8, dh = 9, dx = (x + w / 2 - dw / 2) | 0, dy = y + h - dh - 1;
    ctx.fillStyle = PX.out; ctx.fillRect(dx - 1, dy - 1, dw + 2, dh + 1);
    ctx.fillStyle = "#9a6238"; ctx.fillRect(dx, dy, dw, dh);
    ctx.fillStyle = "#754827"; ctx.fillRect(dx + (dw >> 1), dy, 1, dh);
    ctx.fillStyle = PX.gold; ctx.fillRect(dx + 2, dy + (dh >> 1), 1, 1);
    roomLabel(ctx, sty.short, x, y, w, h);
    if ((r.level || 1) >= 2) { // upgrade pip badge, top-right of the building
      var bx = x + w - 3, by = wallTop + 1, lv = Math.min(3, r.level);
      ctx.fillStyle = PX.out; ctx.fillRect(bx - lv * 3 - 1, by - 1, lv * 3 + 2, 5);
      ctx.fillStyle = PX.gold; for (var lp = 0; lp < lv; lp++) ctx.fillRect(bx - lp * 3 - 2, by, 2, 3);
    }
  }
  function roomLabel(ctx, name, x, y, w, h) {
    ctx.font = "700 8px 'Be Vietnam Pro',sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    var tw = ctx.measureText(name).width, pw = tw + 8, px = (x + w / 2 - pw / 2) | 0, py = y + h - 7;
    ctx.fillStyle = "rgba(20,28,14,.62)"; roundRect(ctx, px, py - 5.5, pw, 11, 4); ctx.fill();
    ctx.fillStyle = "#fff8e6"; ctx.fillText(name, x + w / 2, py + 0.5);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  function drawWindows(ctx, type, x, y, w, h) {
    if (type === "none") return;
    var n = Math.max(1, Math.floor((w - 8) / 10)), gap = (w - 4 - n * 6) / (n + 1), wy = y + 4, i, wx;
    var pane = type === "cold" ? "#9fd8ff" : (type === "glass" ? "#cfeef2" : "#ffe3a0");
    for (i = 0; i < n; i++) {
      wx = (x + 2 + gap * (i + 1) + 6 * i) | 0;
      ctx.fillStyle = PX.out; ctx.fillRect(wx, wy, 6, 7);                 // frame
      ctx.fillStyle = pane; ctx.fillRect(wx + 1, wy + 1, 4, 5);           // pane
      ctx.fillStyle = "rgba(255,255,255,.65)"; ctx.fillRect(wx + 1, wy + 1, 2, 2); // glint
      ctx.fillStyle = PX.out; ctx.fillRect(wx + 3, wy + 1, 1, 5); ctx.fillRect(wx + 1, wy + 3, 4, 1); // mullions
    }
  }
  function drawRoof(ctx, type, sty, x, y, w, roofH) {
    var rc = sty.rc || "#c8553f", rcD = sty.rcD || "#a8412f", s;
    if (type === "gabled") {
      ctx.fillStyle = PX.out; ctx.beginPath(); ctx.moveTo(x - 2, y + roofH + 1); ctx.lineTo(x + w / 2, y - 1); ctx.lineTo(x + w + 2, y + roofH + 1); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rc; ctx.beginPath(); ctx.moveTo(x, y + roofH); ctx.lineTo(x + w / 2, y + 1); ctx.lineTo(x + w, y + roofH); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rcD; for (s = 3; s < roofH; s += 3) { var hw = (w / 2) * (1 - s / roofH); ctx.fillRect(x + w / 2 - hw, y + s, hw * 2, 1); }
      ctx.fillStyle = "#fff"; ctx.fillRect((x + w / 2 - 1) | 0, y - 1, 2, 3);
    } else if (type === "awning") {
      ctx.fillStyle = PX.out; ctx.fillRect(x - 2, y, w + 4, roofH);
      for (s = 0; s < Math.ceil((w + 4) / 5); s++) { ctx.fillStyle = (s % 2) ? rc : "#f5e8ca"; ctx.fillRect((x - 2 + s * 5) | 0, y + 1, 5, roofH - 1); }
    } else if (type === "glossy") {
      ctx.fillStyle = PX.out; ctx.fillRect(x - 1, y, w + 2, roofH);
      ctx.fillStyle = rc; ctx.fillRect(x, y + 1, w, roofH - 2);
      ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.fillRect(x + 2, y + 1, w - 4, 2);
    } else if (type === "flatvent") {
      ctx.fillStyle = PX.out; ctx.fillRect(x - 1, y + 2, w + 2, roofH - 1);
      ctx.fillStyle = rc; ctx.fillRect(x, y + 3, w, roofH - 3);
      for (s = 0; s < 3; s++) { var vx = (x + 4 + s * ((w - 8) / 3)) | 0; ctx.fillStyle = PX.out; ctx.fillRect(vx, y, 6, 4); ctx.fillStyle = "#aeb6bf"; ctx.fillRect(vx + 1, y + 1, 4, 2); }
    } else if (type === "sawtooth") {
      ctx.fillStyle = PX.out; ctx.fillRect(x - 1, y, w + 2, roofH);
      for (s = 0; s < 3; s++) { var sx = x + s * (w / 3); ctx.fillStyle = rc; ctx.beginPath(); ctx.moveTo(sx + 1, y + roofH - 1); ctx.lineTo(sx + 1, y + 3); ctx.lineTo(sx + w / 3 - 1, y + roofH - 1); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#cdeef4"; ctx.fillRect((sx + 2) | 0, y + 4, 2, roofH - 6); }
    }
  }
  // the roof's right-side thickness (dark), drawn offset down-right behind the front roof
  function roofDepth(ctx, type, x, y, w, roofH, dp, col) {
    ctx.fillStyle = col;
    if (type === "gabled") {
      ctx.beginPath(); ctx.moveTo(x - 2 + dp, y + roofH + 1 + dp); ctx.lineTo(x + w / 2 + dp, y - 1 + dp); ctx.lineTo(x + w + 2 + dp, y + roofH + 1 + dp); ctx.closePath(); ctx.fill();
    } else {
      ctx.fillRect(x - 2 + dp, y + dp, w + 4, roofH); // eaves slab for flat/awning/glossy/vent/sawtooth
    }
  }
  // a memorial garden: a tended lawn with a hedge border and a central stone stele + accent plaque
  function drawGarden(ctx, x, y, w, h, sty) {
    ctx.fillStyle = "rgba(20,34,14,.18)"; ctx.fillRect(x + 3, y + h, w, 3); // shadow
    ctx.fillStyle = "#5aa64a"; ctx.fillRect(x, y, w, h);                    // lawn
    ctx.fillStyle = "#67b557"; for (var i = 0; i < h; i += 6) ctx.fillRect(x, y + i, w, 2); // mow stripes
    ctx.fillStyle = "#3f7a34"; ctx.fillRect(x + 1, y + 1, w - 2, 1); ctx.fillRect(x + 1, y + h - 2, w - 2, 1); ctx.fillRect(x + 1, y + 1, 1, h - 2); ctx.fillRect(x + w - 2, y + 1, 1, h - 2); // hedge
    var cx = (x + w / 2) | 0, by = (y + h - 5) | 0, top = (y + 6) | 0;
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 5, top, 10, by - top + 2);    // stele outline
    ctx.fillStyle = "#b9b3a6"; ctx.fillRect(cx - 4, top + 1, 8, by - top);  // stone
    ctx.fillStyle = "#d6d0c4"; ctx.fillRect(cx - 4, top + 1, 3, by - top);  // lit left
    ctx.fillStyle = "#9a9488"; ctx.fillRect(cx + 2, top + 1, 2, by - top);  // shade right
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 3, top - 3, 6, 3); ctx.fillStyle = "#c9c3b6"; ctx.fillRect(cx - 2, top - 2, 4, 2); // peaked cap
    ctx.fillStyle = sty.accent; ctx.fillRect(cx - 3, top + 4, 6, 5);        // plaque (figure's accent)
    ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(cx - 3, top + 4, 6, 1);
    ctx.fillStyle = PX.gold; ctx.fillRect(cx - 1, top + 6, 2, 2);           // rosette
    ctx.fillStyle = sty.accent;                                            // flowers in the accent
    ctx.fillRect(x + 3, y + h - 5, 2, 2); ctx.fillRect(x + w - 5, y + h - 6, 2, 2); ctx.fillRect(x + 4, y + 4, 1, 1);
    ctx.fillStyle = "#fff3c0"; ctx.fillRect(x + 3, y + h - 4, 1, 1); ctx.fillRect(x + w - 4, y + h - 5, 1, 1);
  }
  function drawSan(ctx, x, y, w, h) {
    ctx.fillStyle = "#5fae4a"; ctx.fillRect(x, y, w, h);
    for (var i = 0; i < Math.ceil(h / 7); i++) if (i % 2) { ctx.fillStyle = "#69b853"; ctx.fillRect(x, y + i * 7, w, 4); } // mow stripes
    ctx.strokeStyle = "#eef6ec"; ctx.lineWidth = 1; ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
    ctx.beginPath(); ctx.arc((x + w / 2) | 0, (y + h / 2) | 0, Math.min(w, h) * 0.16, 0, 6.28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo((x + w / 2) | 0, y + 2); ctx.lineTo((x + w / 2) | 0, y + h - 2); ctx.stroke();
  }
  function drawGate(ctx) {
    var px = ((GW >> 1) * T + T / 2) | 0, bottom = GH * T, top = bottom - 24, lx = px - 13, rx = px + 11;
    ctx.fillStyle = PX.out; ctx.fillRect(lx - 2, top, 5, 24); ctx.fillRect(rx - 1, top, 5, 24);          // posts
    ctx.fillStyle = "#c2a06e"; ctx.fillRect(lx - 1, top + 1, 3, 23); ctx.fillRect(rx, top + 1, 3, 23);
    ctx.fillStyle = "#a8865a"; ctx.fillRect(lx + 1, top + 1, 1, 23); ctx.fillRect(rx + 2, top + 1, 1, 23);
    ctx.fillStyle = PX.out; ctx.fillRect(lx - 3, top - 2, 7, 2); ctx.fillRect(rx - 2, top - 2, 7, 2);     // caps
    ctx.fillStyle = PX.gold; ctx.fillRect(lx - 2, top - 2, 5, 1); ctx.fillRect(rx - 1, top - 2, 5, 1);
    ctx.fillStyle = PX.out; ctx.fillRect(lx - 1, top - 9, rx - lx + 6, 7);                                // banner
    ctx.fillStyle = "#e0584a"; ctx.fillRect(lx, top - 8, rx - lx + 4, 5);
    ctx.fillStyle = "#c2412f"; ctx.fillRect(lx, top - 4, rx - lx + 4, 1);
    ctx.font = "700 6px 'Be Vietnam Pro',sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff8e6"; ctx.fillText("HỌC VIỆN", px, top - 5); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  function fountain(ctx, cx, cy) {
    ctx.fillStyle = "rgba(28,48,18,.18)"; ctx.fillRect(cx - 9, cy + 6, 18, 3);
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 9, cy - 2, 18, 8); ctx.fillRect(cx - 7, cy - 4, 14, 2); ctx.fillRect(cx - 7, cy + 6, 14, 2); // basin outline
    ctx.fillStyle = "#b8b2a6"; ctx.fillRect(cx - 8, cy - 1, 16, 6); ctx.fillRect(cx - 6, cy - 3, 12, 2); ctx.fillRect(cx - 6, cy + 5, 12, 2);
    ctx.fillStyle = "#d2ccc0"; ctx.fillRect(cx - 8, cy - 1, 16, 1);                 // rim highlight
    ctx.fillStyle = "#5fc7e0"; ctx.fillRect(cx - 6, cy, 12, 4);                     // water
    ctx.fillStyle = "#9fe2f2"; ctx.fillRect(cx - 6, cy, 12, 1); ctx.fillRect(cx - 4, cy + 1, 3, 1);
    ctx.fillStyle = "#a8a297"; ctx.fillRect(cx - 2, cy - 6, 4, 6);                  // pillar
    ctx.fillStyle = "#bfeefa"; ctx.fillRect(cx - 1, cy - 9, 2, 4);                  // jet
    ctx.fillStyle = "#8fdcef"; ctx.fillRect(cx - 3, cy - 5, 1, 2); ctx.fillRect(cx + 2, cy - 5, 1, 2);
  }
  function bench(ctx, cx, cy) {
    ctx.fillStyle = "rgba(28,48,18,.15)"; ctx.fillRect(cx - 5, cy + 3, 11, 1);
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 5, cy - 3, 11, 2); ctx.fillRect(cx - 5, cy, 2, 4); ctx.fillRect(cx + 4, cy, 2, 4);
    ctx.fillStyle = "#9a6a3c"; ctx.fillRect(cx - 4, cy - 2, 9, 1);
    ctx.fillStyle = "#b27d48"; ctx.fillRect(cx - 5, cy, 11, 2);
  }
  function lamp(ctx, cx, cy) {
    ctx.fillStyle = "rgba(30,40,20,.16)"; ctx.fillRect(cx - 2, cy, 4, 1);
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 1, cy - 10, 2, 10);
    ctx.fillStyle = "#7b828c"; ctx.fillRect(cx, cy - 10, 1, 10);
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 2, cy - 13, 4, 3);
    ctx.fillStyle = "#ffe9a8"; ctx.fillRect(cx - 1, cy - 12, 2, 2);
    ctx.fillStyle = PX.gold; ctx.fillRect(cx - 1, cy - 14, 2, 1);
  }
  function flagpole(ctx, x, y) {
    ctx.fillStyle = "rgba(30,40,20,.18)"; ctx.fillRect(x - 2, y - 1, 6, 1);
    ctx.fillStyle = PX.out; ctx.fillRect(x - 1, y - 18, 2, 18);
    ctx.fillStyle = "#c2c8ce"; ctx.fillRect(x, y - 18, 1, 18);
    ctx.fillStyle = PX.gold; ctx.fillRect(x - 1, y - 19, 2, 2);
    ctx.fillStyle = PX.out; ctx.fillRect(x + 1, y - 18, 8, 5);
    ctx.fillStyle = "#e0584a"; ctx.fillRect(x + 1, y - 17, 6, 3);
    ctx.fillStyle = "#f3b3aa"; ctx.fillRect(x + 1, y - 17, 1, 3);
  }
  function tree(ctx, cx, cy) {
    ctx.fillStyle = "rgba(28,48,18,.18)"; ctx.fillRect(cx - 5, cy + 4, 11, 2);
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 2, cy - 2, 4, 8);          // trunk outline
    ctx.fillStyle = "#7a4f2c"; ctx.fillRect(cx - 1, cy - 1, 2, 6);
    // chunky pixel canopy (outline → mid → light → shade)
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 5, cy - 14, 10, 2); ctx.fillRect(cx - 7, cy - 12, 14, 6); ctx.fillRect(cx - 5, cy - 6, 10, 2);
    ctx.fillStyle = "#3f8c4a"; ctx.fillRect(cx - 4, cy - 13, 8, 2); ctx.fillRect(cx - 6, cy - 11, 12, 4); ctx.fillRect(cx - 4, cy - 7, 8, 1);
    ctx.fillStyle = "#55ab5d"; ctx.fillRect(cx - 5, cy - 13, 7, 2); ctx.fillRect(cx - 6, cy - 11, 5, 2);
    ctx.fillStyle = "#2f6e3a"; ctx.fillRect(cx + 2, cy - 8, 4, 3);
  }
  function bush(ctx, cx, cy) {
    ctx.fillStyle = "rgba(28,48,18,.15)"; ctx.fillRect(cx - 4, cy + 2, 9, 1);
    ctx.fillStyle = PX.out; ctx.fillRect(cx - 4, cy - 4, 10, 2); ctx.fillRect(cx - 5, cy - 2, 12, 4);
    ctx.fillStyle = "#46974f"; ctx.fillRect(cx - 3, cy - 3, 8, 2); ctx.fillRect(cx - 4, cy - 1, 10, 2);
    ctx.fillStyle = "#5cb863"; ctx.fillRect(cx - 4, cy - 1, 6, 1); ctx.fillRect(cx - 3, cy - 3, 4, 1);
  }
  function flowers(ctx, cx, cy, rng) {
    var cols = ["#f15a7a", "#f2c14e", "#ffffff", "#e07ad6", "#6aa9f0"];
    for (var k = 0; k < 3; k++) {
      var fx = cx + (k - 1) * 4, fy = cy + ((k % 2) ? 1 : -1);
      ctx.fillStyle = "#3f8c4a"; ctx.fillRect(fx, fy, 1, 3);
      ctx.fillStyle = cols[(rng() * cols.length) | 0];
      ctx.fillRect(fx - 1, fy - 2, 3, 2); ctx.fillRect(fx, fy - 3, 1, 1);
      ctx.fillStyle = "#f2c14e"; ctx.fillRect(fx, fy - 1, 1, 1);
    }
  }

  window.ART = { PX: PX, ROOM_STYLE: ROOM_STYLE, shade: shade, glow: glow, roundRect: roundRect, drawJune: drawJune, mortarboard: mortarboard, drawTet: drawTet, lampPost: lampPost, lantern: lantern, blossomPot: blossomPot, pathBand: pathBand, drawRoom: drawRoom, roomLabel: roomLabel, drawWindows: drawWindows, drawRoof: drawRoof, roofDepth: roofDepth, drawGarden: drawGarden, drawSan: drawSan, drawGate: drawGate, fountain: fountain, bench: bench, lamp: lamp, flagpole: flagpole, tree: tree, bush: bush, flowers: flowers };
})();
