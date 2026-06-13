/* ============================================================================
   Học viện Steve — js/ui.js
   Rendering only: Kairosoft campus (two canvases), HUD, panels, modals, sound.
   Reads state via HVS / __test; never owns game numbers (layer law).
   ========================================================================== */
(function () {
  "use strict";
  var T = CONFIG.TILE, GW = CONFIG.GRID_W, GH = CONFIG.GRID_H;
  var $ = function (id) { return document.getElementById(id); };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  function S() { return HVS.S(); }

  var ROOM_SKIN = {
    phonghoc: { c: "#2f5d8a", e: "📓", g: "#3d77ad" },
    san:      { c: "#2f6b46", e: "⚽", g: "#3a875a" },
    cangtin:  { c: "#8a5a2f", e: "🍜", g: "#ad7a3d" },
    lab:      { c: "#2f7e87", e: "💡", g: "#3aa0ab" },
    phongmay: { c: "#5a3f8a", e: "🖥️", g: "#7351ad" },
    xuong:    { c: "#7a4a2f", e: "🔧", g: "#9c5f3d" }
  };
  var GRADE_C = { 1: "#6fcf97", 2: "#6aa9f0", 3: "#f2c14e", 4: "#b48ef0" };

  /* === ART: Sơn Mài Diorama (lacquer-night campus, gold-leaf pavilions) === */
  // per-room style: wall hue, roof silhouette, window temperature, gable sigil, short map label
  var ROOM_STYLE = {
    phonghoc: { wall: "#2f5d8a", roof: "gabled",   win: "warm",   sigil: "board",   short: "Phòng học" },
    san:      { wall: "#2f6b46", roof: "none",      win: "none",   sigil: null,      short: "Sân trường" },
    cangtin:  { wall: "#8a5a2f", roof: "awning",    win: "warm",   sigil: "bowl",    short: "Căng tin" },
    lab:      { wall: "#2f7e87", roof: "glossy",    win: "mirror", sigil: "halo",    short: "Lab" },
    phongmay: { wall: "#5a3f8a", roof: "flatvent",  win: "cold",   sigil: "monitor", short: "Phòng máy" },
    xuong:    { wall: "#7a4a2f", roof: "sawtooth",  win: "warm",   sigil: "wrench",  short: "Xưởng" }
  };
  function mb(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hashId(id) { return (Math.imul(id, 2654435761) >>> 0); }
  function shade(hex, pct) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (pct > 0) { r += (255 - r) * pct; g += (255 - g) * pct; b += (255 - b) * pct; }
    else { r *= (1 + pct); g *= (1 + pct); b *= (1 + pct); }
    return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
  }
  function glow(ctx, cx, cy, col) { var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8); g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(cx - 8, cy - 8, 16, 16); }

  /* ---------------- boot ---------------- */
  var tab = "ops", placingKey = null, lastSig = "", soundOn = false;
  var actors = [], walk = null, ringsByKey = {}, curPeriod = -1, forcePeriod = -1;
  // campus-life day clock: 5 real-time periods × 16s = 80s day (animates even while paused, for chill ambiance)
  var PERIOD_MS = 16000, N_PERIODS = 5; // 0 class · 1 recess · 2 lunch · 3 afternoon · 4 tan học

  function boot() {
    if (!HVS.loadGame()) { /* fresh already set */ }
    var q = location.search.match(/seed=(\d+)/);
    if (q && (!localStorage.getItem(CONFIG.SAVE_KEY))) HVS.freshState(parseInt(q[1], 10));
    soundOn = !!S().META.sound;
    if (soundOn) $("soundBtn").classList.add("on");
    $("schoolSub").textContent = CONTENT.schoolSub;
    buildSpeeds(); buildTabs();
    rebuildWalk(); syncActors(true);
    drawStatic(); render(); requestAnimationFrame(liveLoop);
    $("mapHint").textContent = "Chạm vào sinh viên hoặc phòng để xem chi tiết.";
    // font gate: redraw the static layer once 'Be Vietnam Pro' is ready so room labels aren't a fallback face
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { S()._mapDirty = true; });
    setInterval(loopTick, CONFIG.TICK_MS);
    setInterval(function () { HVS.saveGame(); }, 4000);
    $("soundBtn").onclick = toggleSound;
    $("mapStatic").addEventListener("click", onMapClick);
    document.addEventListener("visibilitychange", function () { if (document.hidden) HVS.saveGame(); });
    // autoplay-unlock: browsers block audio until a gesture; start (or resume persisted) music on first tap
    var unlock = function () { if (soundOn) startSound(); document.removeEventListener("pointerdown", unlock); };
    document.addEventListener("pointerdown", unlock, { once: true });
  }

  /* ---------------- main loop ---------------- */
  function loopTick() {
    var s = S();
    if (s.speed > 0 && !HVS.dayTick && false) {} // noop guard
    var running = s.speed > 0 && !anyModal();
    if (running) HVS.clockTick();
    checkModals();
    renderHUD();
    // light panel refresh
    if (++loopTick._n % 8 === 0 && !anyModal()) renderPanel();
  }
  loopTick._n = 0;
  function anyModal() { var s = S(); return !!(s.pendingJune || s.pendingAdmit || s.pendingEvent || s.pendingContract || s._giftFlush); }

  /* ============================================================================
     CANVAS — static campus + live walking actors
     ========================================================================== */
  function rebuildWalk() {
    walk = [];
    for (var x = 0; x < GW; x++) { walk[x] = []; for (var y = 0; y < GH; y++) walk[x][y] = true; }
    var rooms = S().rooms;
    for (var i = 0; i < rooms.length; i++) {
      var d = CONFIG.ROOMS[rooms[i].key];
      for (var rx = 0; rx < d.w; rx++) for (var ry = 0; ry < d.h; ry++) {
        var gx = rooms[i].x + rx, gy = rooms[i].y + ry;
        if (gx >= 0 && gx < GW && gy >= 0 && gy < GH) walk[gx][gy] = false;
      }
    }
    buildRings(rooms);
    S()._mapDirty = false;
  }
  // door/edge ring tiles per room KEY (aggregated across instances), where students gather for activities
  function buildRings(rooms) {
    ringsByKey = {};
    function add(ring, x, y) { if (x >= 0 && x < GW && y >= 0 && y < GH && walk[x] && walk[x][y]) ring.push([x, y]); }
    for (var i = 0; i < rooms.length; i++) {
      var r = rooms[i], d = CONFIG.ROOMS[r.key], ring = [], xx, yy;
      for (xx = r.x; xx < r.x + d.w; xx++) add(ring, xx, r.y + d.h);   // door / bottom row
      for (yy = r.y; yy < r.y + d.h; yy++) { add(ring, r.x - 1, yy); add(ring, r.x + d.w, yy); } // flanks
      for (xx = r.x; xx < r.x + d.w; xx++) add(ring, xx, r.y - 1);     // top row
      if (!ringsByKey[r.key]) ringsByKey[r.key] = [];
      ringsByKey[r.key] = ringsByKey[r.key].concat(ring.slice(0, 8));
    }
  }
  function randWalkTile() {
    for (var k = 0; k < 30; k++) { var x = (Math.random() * GW) | 0, y = (Math.random() * GH) | 0; if (walk[x] && walk[x][y]) return [x, y]; }
    return [GW >> 1, GH - 1];
  }
  function syncActors(initial) {
    var st = S().students, byId = {};
    for (var i = 0; i < actors.length; i++) byId[actors[i].id] = actors[i];
    var next = [];
    for (i = 0; i < st.length; i++) {
      var s = st[i], a = byId[s.id];
      if (!a) {
        var t0 = randWalkTile();
        a = { id: s.id, px: t0[0] * T + T / 2, py: t0[1] * T + T / 2, tx: t0[0], ty: t0[1], wait: 0, ph: Math.random() * 6.28 };
      }
      a.grade = s.grade; a.bodyC = GRADE_C[s.grade] || "#9aa4b2"; a.special = (s.ten === "Mai Sương"); a.hb = !!(s.flags && s.flags.hb);
      a.legC = shade(a.bodyC, -0.30);
      a.tell = s.tell || ""; a.seed = s.seed;
      var hh = hashId(s.id); a.hairC = (hh & 1) ? "#241a14" : "#4a3528"; a.hairFlick = (hh % 5 === 0);
      a._ox = ((s.id * 37) % 7) - 3; a._oy = ((s.id * 53) % 7) - 3; // small fan-out so clustered students don't perfectly overlap
      next.push(a);
    }
    actors = next;
  }
  var lastSync = 0;
  function liveLoop(ts) {
    var ctx = $("mapLive").getContext("2d");
    ctx.clearRect(0, 0, GW * T, GH * T);
    if (S()._mapDirty) { rebuildWalk(); drawStatic(); }
    if (ts - lastSync > 500) { syncActors(); lastSync = ts; }
    var alive = !anyModal(); // campus stays alive at speed 0 (chill); freezes only for modals
    var period = (forcePeriod >= 0) ? forcePeriod : (Math.floor(ts / PERIOD_MS) % N_PERIODS);
    var i;
    for (i = 0; i < actors.length; i++) updateActor(actors[i], alive, ts, period);
    actors.sort(function (a, b) { return a.py - b.py; });
    for (i = 0; i < actors.length; i++) { drawActor(ctx, actors[i], ts); if (actors[i]._atDest && actors[i].act) drawActivity(ctx, actors[i], ts); }
    if (period === 1 || period === 3) drawSanBall(ctx, ts); // ball out at recess / afternoon
    requestAnimationFrame(liveLoop);
  }
  // schedule: students are routed to the right room's door-ring each period, then do the activity
  function assignActivity(a, period) {
    var roomKey = null, act = null, duAn = (S().month >= 2 && S().month <= 5);
    if (period === 0) { roomKey = "phonghoc"; act = (a.tell === "sky") ? "daydream" : "study"; }
    else if (period === 1) { roomKey = "san"; act = (a.tell === "hype") ? "perform" : "recess"; }
    else if (period === 2) { roomKey = "cangtin"; act = "eat"; }
    else if (period === 3) { if (a.grade === 4) { roomKey = duAn ? "xuong" : "phongmay"; act = "tinker"; } else { roomKey = "lab"; act = "study"; } }
    else { roomKey = null; act = (((a.id + period) % 3) === 0) ? "zzz" : "home"; }
    var ring = roomKey ? ringsByKey[roomKey] : null;
    if (ring && ring.length) { var t = ring[(a.id + period) % ring.length]; a.tx = t[0]; a.ty = t[1]; a.act = act; }
    else { var rt = randWalkTile(); a.tx = rt[0]; a.ty = rt[1]; a.act = (period === 4) ? act : null; } // graceful fallback when the room isn't built
    a._atDest = false;
  }
  function updateActor(a, alive, ts, period) {
    if (a._period !== period) { a._period = period; assignActivity(a, period); }
    var tgx = a.tx * T + T / 2 + a._ox, tgy = a.ty * T + T / 2 + a._oy;
    var dx = tgx - a.px, dy = tgy - a.py, dist = Math.hypot(dx, dy);
    if (dist < 1.5 || !alive) { a._moving = false; a._atDest = a._atDest || dist < 1.5; }
    else {
      var sp = 0.5 + (a.grade === 1 ? 0.1 : 0);
      a.px += (dx / dist) * sp; a.py += (dy / dist) * sp; a.dir = dx < 0 ? -1 : 1; a._moving = true;
    }
    var amp = (a.act === "perform" && a._atDest) ? 2.6 : (a._moving ? 1.4 : 0.4);
    a.bob = Math.sin(ts / 180 + a.ph) * amp;
  }
  // per-activity overlay — flat ops only, drawn for parked actors (≈ one room's worth at a time)
  function drawActivity(ctx, a, ts) {
    var x = a.px | 0, y = a.py + (a.bob || 0), ph = ts / 600 + a.ph, k;
    if (a.act === "study") {
      var bx = x + (a.dir < 0 ? -9 : 5);
      ctx.fillStyle = "#e9e2cf"; ctx.fillRect(bx, y - 3, 4, 3);
      ctx.fillStyle = "#9c8657"; ctx.fillRect(bx, y - 3 + (Math.sin(ts / 300) > 0 ? 0 : 1), 4, 1);
    } else if (a.act === "daydream") {
      var d = (Math.sin(ph) * 0.5 + 0.5); ctx.globalAlpha = 1 - d; ctx.fillStyle = "#bfe0ff"; ctx.fillRect(x + 2, (y - 9 - d * 5) | 0, 2, 2); ctx.globalAlpha = 1;
    } else if (a.act === "eat") {
      ctx.fillStyle = "#d8cdb5"; ctx.beginPath(); ctx.arc(x, y + 4, 3, 0, Math.PI); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1;
      for (k = 0; k < 2; k++) { var sx = x - 1 + k * 2; ctx.beginPath(); ctx.moveTo(sx, y + 1); ctx.lineTo(sx + Math.sin(ts / 200 + k) * 1.5, y - 2); ctx.stroke(); }
    } else if (a.act === "tinker") {
      if ((Math.floor(ts / 160) + a.id) % 3 === 0) { var n = (a.tell === "spark") ? 3 : 2; ctx.fillStyle = "#ffe9a8"; for (k = 0; k < n; k++) { var an = k * 2.2 + ts / 100; ctx.fillRect((x + Math.cos(an) * 4) | 0, (y - 2 + Math.sin(an) * 4) | 0, 1, 1); } }
    } else if (a.act === "perform") {
      ctx.strokeStyle = a.bodyC; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 3, y + 1); ctx.lineTo(x - 5, y - 3); ctx.moveTo(x + 3, y + 1); ctx.lineTo(x + 5, y - 3); ctx.stroke();
    } else if (a.act === "zzz") {
      var zy = (y - 8 - (Math.sin(ph) * 0.5 + 0.5) * 4) | 0;
      ctx.strokeStyle = "rgba(220,226,200,.7)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 2, zy); ctx.lineTo(x + 5, zy); ctx.lineTo(x + 2, zy + 3); ctx.lineTo(x + 5, zy + 3); ctx.stroke();
    }
  }
  function drawSanBall(ctx, ts) {
    var san = null, rooms = S().rooms; for (var i = 0; i < rooms.length; i++) if (rooms[i].key === "san") { san = rooms[i]; break; }
    if (!san) return;
    var d = CONFIG.ROOMS.san, cx = (san.x + d.w / 2) * T, cy = (san.y + d.h / 2) * T;
    var bx = cx + Math.sin(ts / 700) * (d.w * T * 0.3), by = cy + 4 - Math.abs(Math.sin(ts / 350)) * 8;
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(bx, cy + 8, 2.5, 1, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(bx, by, 2.2, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#333"; ctx.fillRect((bx - 1) | 0, (by - 1) | 0, 1, 1);
  }
  // chibi student — flat primitives only, no per-frame strings/gradients/save (60fps × 48)
  function drawActor(ctx, a, ts) {
    var x = a.px | 0, y = a.py + (a.bob || 0), by = a.py | 0;
    // breathing contact shadow (stays grounded as the body bobs)
    var rx = 5 - Math.max(0, a.bob || 0) * 0.7;
    ctx.fillStyle = "rgba(0,0,0,.30)"; ctx.beginPath(); ctx.ellipse(x, by + 6, rx, 2.2, 0, 0, 6.28); ctx.fill();
    // legs — 2-frame scissor when walking
    var lf = a._moving ? (Math.sin(ts / 120 + a.ph) > 0 ? 1 : -1) : 0;
    ctx.fillStyle = a.legC;
    ctx.fillRect(x - 2.5, by + 3 + (lf > 0 ? 1 : 0), 2, 3);
    ctx.fillRect(x + 0.5, by + 3 + (lf < 0 ? 1 : 0), 2, 3);
    // body (full chroma — the primary identifier)
    ctx.fillStyle = a.bodyC; roundRect(ctx, x - 4, y - 1, 8, 7, 2.4); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(x - 3, y - 1, 6, 1);
    drawMarker(ctx, a.grade, x, y);
    // head + hair
    ctx.fillStyle = "#f4d9b8"; ctx.beginPath(); ctx.arc(x, y - 4, 3.3, 0, 6.28); ctx.fill();
    ctx.fillStyle = a.hairC; ctx.beginPath(); ctx.arc(x, y - 5, 3.3, Math.PI, 0); ctx.fill();
    if (a.hairFlick) ctx.fillRect(x + (a.dir < 0 ? -4 : 3), y - 5, 1, 2);
    // quiet gold collar tick (UI-gold echo)
    ctx.fillStyle = "rgba(240,198,116,.7)"; ctx.fillRect(x - 1, y - 1, 2, 1);
    if (a.special) { ctx.strokeStyle = "#f0c674"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y - 4, 5.4, 0, 6.28); ctx.stroke(); }
    if (a.hb) { ctx.fillStyle = "#f0c674"; ctx.beginPath(); ctx.moveTo(x + 3, y - 8); ctx.lineTo(x + 5, y - 6); ctx.lineTo(x + 3, y - 4); ctx.lineTo(x + 1, y - 6); ctx.closePath(); ctx.fill(); }
  }
  function drawMarker(ctx, g, x, y) {
    if (g === 1) { ctx.fillStyle = "#fff"; ctx.fillRect(x - 1, y - 1, 2, 1); }
    else if (g === 2) { ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 3, y + 4); ctx.lineTo(x + 2, y - 1); ctx.stroke(); }
    else if (g === 3) { ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.fillRect(x - 3, y + 3, 7, 1); }
    else if (g === 4) { ctx.fillStyle = "#f0c674"; ctx.beginPath(); ctx.moveTo(x - 2, y - 1); ctx.lineTo(x, y + 3); ctx.lineTo(x + 2, y - 1); ctx.closePath(); ctx.fill(); }
  }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  // ---- static campus (lacquer-night diorama). Redrawn only on build; seeded → no flicker. ----
  function drawStatic() {
    var ctx = $("mapStatic").getContext("2d"), W = GW * T, H = GH * T;
    var rng = mb(1337), cx = 195, cy = 140, i, x, y;
    // PASS 1 — lacquer base
    var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#161b1f"); g.addColorStop(1, "#101316");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // PASS 2 — vỏ trứng eggshell flecks (hand-laid lacquer panel)
    for (i = 0; i < 320; i++) {
      x = (rng() * W) | 0; y = (rng() * H) | 0;
      if (Math.hypot(x - cx, y - cy) > 150 && rng() < 0.45) continue;
      var a = (0.08 + rng() * 0.10).toFixed(2);
      ctx.fillStyle = (rng() < 0.5 ? "rgba(233,226,207," : "rgba(205,191,156,") + a + ")";
      ctx.fillRect(x, y, rng() < 0.2 ? 2 : 1, 1);
    }
    for (i = 0; i < 30; i++) { ctx.fillStyle = "rgba(233,226,207,.24)"; ctx.fillRect((rng() * W) | 0, (rng() * H) | 0, 2, 2); }
    // PASS 3 — raised boardwalk path spine
    pathBand(ctx, 0, (GH >> 1) * T, W, T, true);
    pathBand(ctx, (GW >> 1) * T, 0, T, H, false);
    // rooms — y-sorted so lower buildings overlap upper
    var rooms = S().rooms.slice().sort(function (p, q) { return (p.y - q.y) || (p.x - q.x); });
    for (i = 0; i < rooms.length; i++) drawRoom(ctx, rooms[i]);
    // ambient props (seeded, capped, off walk lanes)
    drawProps(ctx, rng, rooms);
    // PASS 4 — vignette: lit center, edges dissolve into the dark-gold chrome
    var vg = ctx.createRadialGradient(cx, cy, 40, cx, cy, 250);
    vg.addColorStop(0, "rgba(10,13,15,0)"); vg.addColorStop(1, "rgba(10,13,15,.45)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }
  function pathBand(ctx, x, y, w, h, horiz) {
    ctx.fillStyle = "#9c8657"; roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 4); ctx.fill();
    ctx.fillStyle = "#c9b079"; roundRect(ctx, x + 2, y + 2, w - 4, h - 5, 4); ctx.fill();
    ctx.fillStyle = "rgba(255,243,214,.14)"; ctx.fillRect(x + 3, y + 2, w - 6, 1);
    ctx.fillStyle = "rgba(0,0,0,.18)";
    if (horiz) { for (var px = x + 8; px < x + w - 4; px += 10) ctx.fillRect(px, y + 2, 1, h - 6); }
    else { for (var py = y + 8; py < y + h - 4; py += 10) ctx.fillRect(x + 2, py, w - 6, 1); }
  }
  function drawRoom(ctx, r) {
    var d = CONFIG.ROOMS[r.key], sty = ROOM_STYLE[r.key] || { wall: "#555", roof: "gabled", win: "warm", short: d.name };
    var x = r.x * T + 1.5, y = r.y * T + 1.5, w = d.w * T - 3, h = d.h * T - 3, wall = sty.wall;
    // (A) double-copy soft drop shadow
    ctx.fillStyle = "rgba(10,13,15,.30)"; roundRect(ctx, x + 4, y + 5, w, h, 5); ctx.fill();
    ctx.fillStyle = "rgba(10,13,15,.14)"; roundRect(ctx, x + 8, y + 10, w, h, 6); ctx.fill();
    if (sty.roof === "none") { drawSan(ctx, x, y, w, h); roomLabel(ctx, sty.short, x, y, w, h); return; }
    var roofH = Math.min(18, h * 0.38);
    // (B) front-wall extrusion lip
    ctx.fillStyle = shade(wall, -0.22); roundRect(ctx, x, y + h - 6, w, 6, 4); ctx.fill();
    // (C) body
    ctx.fillStyle = wall; roundRect(ctx, x, y + roofH - 4, w, h - roofH + 4, 5); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.10)"; ctx.fillRect(x + 2, y + roofH - 2, w - 4, 1);
    // (F) lamplit windows (under the gold frame so the bloom sits behind)
    drawWindows(ctx, sty.win, x, y + roofH, w, h - roofH);
    // (D) roof silhouette
    drawRoof(ctx, sty.roof, wall, x, y, w, roofH);
    // ambient-occlusion cheat at roof/wall seam
    ctx.fillStyle = "rgba(0,0,0,.20)"; ctx.fillRect(x, y + roofH - 1, w, 1);
    // (G) arched door facing the path
    var dw = 6, dh = 8, dx = x + w / 2 - dw / 2, dy = y + h - dh - 1;
    ctx.fillStyle = "#241a14"; ctx.beginPath(); ctx.moveTo(dx, dy + dh); ctx.lineTo(dx, dy + 2); ctx.arc(dx + dw / 2, dy + 2, dw / 2, Math.PI, 0); ctx.lineTo(dx + dw, dy + dh); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(240,198,116,.5)"; ctx.fillRect(dx, dy + dh - 1, dw, 1);
    // (E) gold-leaf frame — the biggest 26px separation win
    ctx.strokeStyle = "#f0c674"; ctx.lineWidth = 1.2; roundRect(ctx, x, y + roofH - 4, w, h - roofH + 4, 5); ctx.stroke();
    ctx.strokeStyle = "rgba(202,162,74,.7)"; ctx.lineWidth = 0.5; roundRect(ctx, x + 1.5, y + roofH - 2.5, w - 3, h - roofH + 1, 4); ctx.stroke();
    // gable sigil (third redundant cue beyond roof-shape + hue)
    if (sty.sigil) drawSigil(ctx, sty.sigil, x + w / 2, y + roofH + 5);
    roomLabel(ctx, sty.short, x, y, w, h);
  }
  function roomLabel(ctx, name, x, y, w, h) {
    ctx.font = "700 8px 'Be Vietnam Pro',sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    var tw = ctx.measureText(name).width, pw = tw + 8, px = x + w / 2 - pw / 2, py = y + h - 8;
    ctx.fillStyle = "rgba(0,0,0,.5)"; roundRect(ctx, px, py - 5.5, pw, 11, 5); ctx.fill();
    ctx.fillStyle = "rgba(255,243,214,.92)"; ctx.fillText(name, x + w / 2, py + 0.5);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  function drawWindows(ctx, type, x, y, w, h) {
    if (type === "none") return;
    var n = Math.max(1, Math.floor((w - 10) / 9)), gap = (w - 2 - n * 5) / (n + 1), wy = y + h - 12, i, wx;
    for (i = 0; i < n; i++) {
      wx = x + 2 + gap * (i + 1) + 5 * i;
      if (type === "warm") { glow(ctx, wx + 2.5, wy + 3, "rgba(240,198,116,.16)"); ctx.fillStyle = "#ffe9a8"; ctx.fillRect(wx, wy, 5, 6); ctx.fillStyle = "#fff3d6"; ctx.fillRect(wx, wy, 5, 3); }
      else if (type === "cold") { glow(ctx, wx + 2.5, wy + 3, "rgba(127,208,255,.18)"); ctx.fillStyle = "#7fd0ff"; ctx.fillRect(wx, wy, 5, 6); ctx.fillStyle = "#cfeefb"; ctx.fillRect(wx, wy, 5, 2); }
      else { ctx.fillStyle = "#cfeaf2"; ctx.fillRect(wx, wy, 5, 6); ctx.strokeStyle = "rgba(240,198,116,.7)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(wx, wy + 5); ctx.lineTo(wx + 5, wy); ctx.stroke(); }
    }
  }
  function drawRoof(ctx, type, wall, x, y, w, roofH) {
    var rc = shade(wall, 0.14), s;
    if (type === "gabled") {
      ctx.fillStyle = rc; ctx.beginPath(); ctx.moveTo(x - 1, y + roofH); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w + 1, y + roofH); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,243,214,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + w / 2, y + 1); ctx.lineTo(x + w / 2, y + roofH); ctx.stroke();
      ctx.fillStyle = "#caa24a"; ctx.fillRect(x + w / 2 - 1, y - 1, 2, 2); // finial
    } else if (type === "awning") {
      ctx.fillStyle = rc; roundRect(ctx, x - 1, y, w + 2, roofH, 3); ctx.fill();
      for (s = 0; s < Math.ceil(w / 4); s++) { ctx.fillStyle = (s % 2) ? "#c8412e" : "#efe6cf"; ctx.fillRect(x + s * 4, y + roofH - 3, 4, 3); }
    } else if (type === "glossy") {
      ctx.fillStyle = rc; roundRect(ctx, x - 1, y, w + 2, roofH, 6); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.18)"; roundRect(ctx, x + 1, y + 1, w - 2, roofH / 2, 5); ctx.fill();
    } else if (type === "flatvent") {
      ctx.fillStyle = rc; ctx.fillRect(x - 1, y, w + 2, roofH);
      for (s = 0; s < 3; s++) { ctx.fillStyle = shade(wall, -0.12); ctx.fillRect(x + 4 + s * ((w - 8) / 3), y + 2, 5, roofH - 5); ctx.fillStyle = "#8b929b"; ctx.fillRect(x + 5 + s * ((w - 8) / 3), y + 3, 3, 2); }
    } else if (type === "sawtooth") {
      for (s = 0; s < 3; s++) { var sx = x + s * (w / 3); ctx.fillStyle = rc; ctx.beginPath(); ctx.moveTo(sx, y + roofH); ctx.lineTo(sx, y + 3); ctx.lineTo(sx + w / 3, y + roofH); ctx.closePath(); ctx.fill(); ctx.fillStyle = "rgba(200,230,240,.5)"; ctx.fillRect(sx + 1, y + 4, 2, roofH - 6); }
    }
  }
  function drawSan(ctx, x, y, w, h) {
    ctx.fillStyle = "#2f6b46"; roundRect(ctx, x, y, w, h, 5); ctx.fill();
    for (var i = 0; i < Math.ceil(h / 8); i++) if (i % 2) { ctx.fillStyle = "#34734d"; ctx.fillRect(x + 2, y + 2 + i * 8, w - 4, 4); }
    ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(x + w / 2, y + h / 2, w * 0.17, h * 0.17, 0, 0, 6.28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w / 2, y + 3); ctx.lineTo(x + w / 2, y + h - 3); ctx.stroke();
    ctx.strokeStyle = "rgba(240,198,116,.5)"; ctx.lineWidth = 1.2; roundRect(ctx, x, y, w, h, 5); ctx.stroke();
  }
  function drawSigil(ctx, kind, cx, cy) {
    ctx.strokeStyle = "#f0c674"; ctx.fillStyle = "#f0c674"; ctx.lineWidth = 1;
    if (kind === "board") { ctx.fillStyle = "rgba(18,24,18,.92)"; ctx.fillRect(cx - 4, cy - 3, 8, 6); ctx.strokeRect(cx - 4, cy - 3, 8, 6); ctx.fillStyle = "rgba(240,198,116,.8)"; ctx.fillRect(cx - 2.5, cy - 1, 5, 1); }
    else if (kind === "bowl") { ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI); ctx.stroke(); ctx.fillRect(cx - 3.5, cy - 0.5, 7, 1); }
    else if (kind === "halo") { ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 6.28); ctx.stroke(); }
    else if (kind === "monitor") { ctx.strokeRect(cx - 4, cy - 3, 8, 5); ctx.fillStyle = "rgba(127,208,255,.85)"; ctx.fillRect(cx - 3, cy - 2, 6, 3); ctx.fillStyle = "#f0c674"; ctx.fillRect(cx - 1, cy + 2, 2, 1); }
    else if (kind === "wrench") { ctx.beginPath(); ctx.arc(cx - 2, cy - 2, 2, 0, 6.28); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - 1, cy - 1); ctx.lineTo(cx + 3, cy + 3); ctx.stroke(); }
  }
  // ambient props — all static, seeded, capped, kept off the walk lanes so the little people stay visible
  function drawProps(ctx, rng, rooms) {
    var rowY = GH >> 1, colX = GW >> 1, i, x, y;
    // lamp posts along the path spine (the cozy warm points)
    for (i = 2; i < GW; i += 4) lamp(ctx, i * T + T / 2, rowY * T + T / 2);
    for (i = 3; i < GH; i += 4) lamp(ctx, colX * T + T / 2, i * T + T / 2);
    // flagpole at a Phòng học corner — the quiet satirical đề/pantheon nod
    var ph = rooms.filter(function (r) { return r.key === "phonghoc"; })[0];
    if (ph) flagpole(ctx, ph.x * T - 1, (ph.y + CONFIG.ROOMS.phonghoc.h) * T);
    // free edge tiles for trees/marginalia (walkable, off path, near the border)
    var free = [];
    for (x = 0; x < GW; x++) for (y = 0; y < GH; y++) {
      if (!(walk[x] && walk[x][y])) continue;
      if (y === rowY || x === colX) continue;
      if (x < 2 || x > GW - 3 || y < 2 || y > GH - 3) free.push([x, y]);
    }
    for (i = free.length - 1; i > 0; i--) { var j = (rng() * (i + 1)) | 0, t = free[i]; free[i] = free[j]; free[j] = t; }
    var nT = 0;
    for (i = 0; i < free.length && nT < 6; i++) { tree(ctx, free[i][0] * T + T / 2, free[i][1] * T + T / 2); nT++; }
    var gly = ["bulb", "apple", "sigma"], nG = 0;
    for (i = nT; i < free.length && nG < 3; i++) { marginalia(ctx, free[i][0] * T + T / 2, free[i][1] * T + T / 2, gly[nG]); nG++; }
  }
  function lamp(ctx, cx, cy) {
    glow(ctx, cx, cy - 6, "rgba(240,198,116,.18)");
    ctx.fillStyle = "#2a2f36"; ctx.fillRect(cx - 0.5, cy - 8, 1, 9);
    ctx.fillStyle = "#f0c674"; ctx.beginPath(); ctx.arc(cx, cy - 8, 1.8, 0, 6.28); ctx.fill();
  }
  function flagpole(ctx, x, y) {
    ctx.fillStyle = "rgba(10,13,15,.3)"; ctx.beginPath(); ctx.ellipse(x, y - 1, 3, 1.4, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#9aa0a6"; ctx.fillRect(x, y - 16, 1, 16);
    ctx.fillStyle = "#7d1f12"; ctx.beginPath(); ctx.moveTo(x + 1, y - 16); ctx.lineTo(x + 8, y - 14.5); ctx.lineTo(x + 1, y - 12); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#f0c674"; ctx.lineWidth = 0.6; ctx.stroke();
    ctx.fillStyle = "#f0c674"; ctx.beginPath(); ctx.arc(x + 0.5, y - 16, 1, 0, 6.28); ctx.fill();
  }
  function tree(ctx, cx, cy) {
    ctx.fillStyle = "rgba(10,13,15,.3)"; ctx.beginPath(); ctx.ellipse(cx, cy + 5, 5, 2, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#5a3a22"; ctx.fillRect(cx - 1, cy, 2, 6);
    ctx.fillStyle = "#223a2b"; ctx.beginPath(); ctx.arc(cx - 2, cy - 2, 4, 0, 6.28); ctx.arc(cx + 2, cy - 2, 4, 0, 6.28); ctx.arc(cx, cy - 5, 5, 0, 6.28); ctx.fill();
    ctx.fillStyle = "rgba(110,207,151,.25)"; ctx.beginPath(); ctx.arc(cx - 1, cy - 6, 2, 0, 6.28); ctx.fill();
  }
  function marginalia(ctx, cx, cy, kind) {
    ctx.globalAlpha = 0.4; ctx.strokeStyle = "#cdbf9c"; ctx.fillStyle = "#cdbf9c"; ctx.lineWidth = 1;
    if (kind === "bulb") { ctx.beginPath(); ctx.arc(cx, cy - 1, 2.5, 0, 6.28); ctx.stroke(); ctx.fillRect(cx - 1, cy + 1.5, 2, 2); }
    else if (kind === "apple") { ctx.beginPath(); ctx.arc(cx, cy, 2.4, 0, 6.28); ctx.fill(); ctx.strokeStyle = "#5a3a22"; ctx.beginPath(); ctx.moveTo(cx, cy - 2); ctx.lineTo(cx + 1.2, cy - 4); ctx.stroke(); }
    else { ctx.font = "700 8px 'Be Vietnam Pro',sans-serif"; ctx.textAlign = "center"; ctx.fillText("∑", cx, cy + 3); ctx.textAlign = "left"; }
    ctx.globalAlpha = 1;
  }

  function mapPoint(ev) {
    var cv = $("mapStatic"), rect = cv.getBoundingClientRect();
    var sx = cv.width / rect.width, sy = cv.height / rect.height;
    var cx = ev.clientX != null ? ev.clientX : (ev.touches && ev.touches[0] ? ev.touches[0].clientX : 0);
    var cy = ev.clientY != null ? ev.clientY : (ev.touches && ev.touches[0] ? ev.touches[0].clientY : 0);
    var px = (cx - rect.left) * sx, py = (cy - rect.top) * sy;
    return { px: px, py: py, gx: Math.floor(px / T), gy: Math.floor(py / T) };
  }
  function onMapClick(ev) {
    var pt = mapPoint(ev);
    if (placingKey) {
      var d = CONFIG.ROOMS[placingKey];
      var gx = Math.max(0, Math.min(GW - d.w, pt.gx)), gy = Math.max(0, Math.min(GH - d.h, pt.gy));
      var res = HVS.placeRoom(placingKey, gx, gy);
      if (res.ok) { placingKey = null; document.body.classList.remove("placing"); $("mapHint").textContent = ""; rebuildWalk(); drawStatic(); render(); toast("Đã xây xong."); }
      else toast(res.msg);
      return;
    }
    // tap-the-world: nearest student, else room, else dismiss
    var a = nearestActor(pt.px, pt.py, 11);
    if (a) { showInspectStudent(a.id); return; }
    var r = roomAt(pt.gx, pt.gy);
    if (r) { showInspectRoom(r); return; }
    hideInspect();
  }
  function nearestActor(px, py, rad) {
    var best = null, bd = rad;
    for (var i = 0; i < actors.length; i++) { var d = Math.hypot(actors[i].px - px, actors[i].py - py); if (d < bd) { bd = d; best = actors[i]; } }
    return best;
  }
  function roomAt(gx, gy) {
    var rooms = S().rooms;
    for (var i = 0; i < rooms.length; i++) { var d = CONFIG.ROOMS[rooms[i].key]; if (gx >= rooms[i].x && gx < rooms[i].x + d.w && gy >= rooms[i].y && gy < rooms[i].y + d.h) return rooms[i]; }
    return null;
  }
  function pantheonName(key) { for (var i = 0; i < CONFIG.PANTHEON.length; i++) if (CONFIG.PANTHEON[i].key === key) return CONFIG.PANTHEON[i].name; return null; }
  var TELL_TXT = { spark: "hay tháo đồ ra xem nó chạy thế nào", hype: "thích sân khấu hơn bảng đen", sky: "hay nhìn lên trời giữa giờ", "": "chưa lộ điều gì đặc biệt" };
  function ibar(l, v, c) { return "<div class='ib'>" + esc(l) + " " + Math.round(v) + "<div class='bar2'><b style='width:" + Math.max(0, Math.min(100, v)) + "%;background:" + c + "'></b></div></div>"; }
  function showInspectStudent(id) {
    var st = null, list = S().students; for (var i = 0; i < list.length; i++) if (list[i].id === id) { st = list[i]; break; }
    if (!st) { hideInspect(); return; }
    var ins = $("inspect");
    var hb = (st.flags && st.flags.hb) ? pantheonName(st.flags.hb) : null;
    var stars = "★".repeat(st.seed) + "☆".repeat(5 - st.seed);
    ins.innerHTML =
      "<div class='ihead'><div class='av' style='background:" + (GRADE_C[st.grade] + "22") + "'>" + seedFace(st.seed) + "</div>" +
      "<div><div class='iname'>" + esc(st.ten) + (st.ten === "Mai Sương" ? " 🔧" : "") + "</div><div class='imeta'>Năm " + st.grade + " · " + esc(TELL_TXT[st.tell] || TELL_TXT[""]) + (hb ? " · 🏵️ " + esc(hb) : "") + "</div></div>" +
      "<button class='ix' id='ixBtn'>✕</button></div>" +
      "<div class='ibars'>" + ibar("Kiến thức", st.kt, "#bb6bd9") + ibar("Tay nghề", st.tn, "#6fcf97") + ibar("Sáng tạo", st.st, "#6aa9f0") + ibar("Cá mập", st.cm, "#f2994a") + ibar("Tâm trạng", st.mood, "#f2c14e") + "</div>" +
      "<div class='iflav'>Tiềm năng (hạt giống): " + stars + "</div>";
    $("ixBtn").onclick = hideInspect;
    ins.classList.add("show"); $("mapHint").textContent = "";
  }
  function showInspectRoom(r) {
    var d = CONFIG.ROOMS[r.key], sk = ROOM_SKIN[r.key] || { e: "▫" }, ins = $("inspect");
    var cnt = 0;
    for (var i = 0; i < actors.length; i++) { var gx = Math.floor(actors[i].px / T), gy = Math.floor(actors[i].py / T); if (gx >= r.x && gx < r.x + d.w && gy >= r.y && gy < r.y + d.h) cnt++; }
    ins.innerHTML =
      "<div class='ihead'><div class='av' style='background:rgba(255,255,255,.06)'>" + sk.e + "</div>" +
      "<div><div class='iname'>" + esc(d.name) + "</div><div class='imeta'>" + d.w + "×" + d.h + (d.cost ? " · xây " + d.cost + "tr" : " · miễn phí") + "</div></div>" +
      "<button class='ix' id='ixBtn'>✕</button></div>" +
      "<div class='inote'>" + esc(d.desc) + "</div>" +
      "<div class='iflav'>" + cnt + " sinh viên đang ở gần.</div>";
    $("ixBtn").onclick = hideInspect;
    ins.classList.add("show"); $("mapHint").textContent = "";
  }
  function hideInspect() { $("inspect").classList.remove("show"); }

  /* ============================================================================
     HUD
     ========================================================================== */
  var MONTHS = ["", "Một", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Mười Một", "Mười Hai"];
  function buildSpeeds() {
    var wrap = $("speeds"); wrap.innerHTML = "";
    [["⏸", 0], ["1", 1], ["2", 2], ["3", 3]].forEach(function (p) {
      var b = el("button", "spd"); b.textContent = p[0]; b.dataset.v = p[1];
      b.onclick = function () { var s = S(); if (p[1] === 3 && !s.speed3Unlocked) { toast("Mở khoá 3× sau Lễ Tốt Nghiệp đầu tiên."); return; } s.speed = p[1]; renderHUD(); };
      wrap.appendChild(b);
    });
  }
  function renderHUD() {
    var s = S();
    $("clockMain").textContent = "Năm " + s.year;
    $("clockSub").textContent = "Tháng " + MONTHS[s.month];
    // speeds
    var sb = $("speeds").children;
    for (var i = 0; i < sb.length; i++) {
      var v = +sb[i].dataset.v;
      sb[i].classList.toggle("active", s.speed === v);
      sb[i].classList.toggle("locked", v === 3 && !s.speed3Unlocked);
    }
    // stats chips
    var stats = $("stats"); stats.innerHTML = "";
    stats.appendChild(chip("cash", "💰", Math.round(s.cash) + "tr"));
    stats.appendChild(chip("", "🎓", s.students.length + " SV"));
    stats.appendChild(chip("", "🧑‍🏫", s.teachers.length));
    if (s.endow.bal >= 200) stats.appendChild(chip("", "🌱", Math.round(s.endow.bal) + "tr"));
    // meters
    var m = $("meters"); m.innerHTML = "";
    m.appendChild(meter("m-tt", "TIẾNG TĂM", s.tiengTam, 100));
    m.appendChild(meter("m-ut", "UY TÍN", s.uyTin, 100));
    m.appendChild(meter("m-tc", "THỰC CHẤT", s.thucChat, 100));
    // ticker
    if (s.news.length) {
      var n = s.news[0];
      $("ticker").innerHTML = "▸ " + esc(n.s);
    }
  }
  function chip(cls, ic, v) { var c = el("div", "chip " + cls); c.innerHTML = ic + " <span class='v'>" + v + "</span>"; return c; }
  function meter(cls, lab, v, max) {
    var d = el("div", "meter " + cls);
    d.innerHTML = "<div class='lab'>" + lab + " <b>" + Math.round(v) + "</b></div><div class='bar'><i style='width:" + Math.max(0, Math.min(100, v / max * 100)) + "%'></i></div>";
    return d;
  }

  /* ============================================================================
     TABS + PANELS
     ========================================================================== */
  var TABS = [["ops", "🏫", "Điều hành"], ["stu", "🎓", "Sinh viên"], ["alum", "📒", "Cựu SV"], ["fund", "💰", "Tài chính"], ["info", "📊", "Trường"]];
  function buildTabs() {
    var nav = $("tabs"); nav.innerHTML = "";
    TABS.forEach(function (t) {
      var b = el("button"); b.innerHTML = "<span class='ic'>" + t[1] + "</span>" + t[2];
      b.onclick = function () { tab = t[0]; placingKey = null; document.body.classList.remove("placing"); $("mapHint").textContent = ""; hideInspect(); render(); };
      nav.appendChild(b);
    });
  }
  function render() { renderHUD(); renderPanel(); var nav = $("tabs").children; for (var i = 0; i < nav.length; i++) nav[i].classList.toggle("active", TABS[i][0] === tab); }

  function renderPanel() {
    var p = $("panel");
    if (tab === "ops") p.innerHTML = "", p.appendChild(panelOps());
    else if (tab === "stu") p.innerHTML = "", p.appendChild(panelStudents());
    else if (tab === "alum") p.innerHTML = "", p.appendChild(panelAlumni());
    else if (tab === "fund") p.innerHTML = "", p.appendChild(panelFund());
    else p.innerHTML = "", p.appendChild(panelInfo());
  }

  var PRESET_KEYS = ["luyende", "canbang", "duan"];
  function panelOps() {
    var s = S(), wrap = el("div");
    // teaching presets per cohort
    var c1 = el("div", "card"); c1.appendChild(el("h3", null, "Hướng dạy từng khoá"));
    [1, 2, 3, 4].forEach(function (g) {
      var row = el("div", "row"); row.style.marginBottom = "6px";
      row.appendChild(el("div", null, "<div style='font-size:11px;font-weight:700;width:46px'>Năm " + g + "</div>"));
      var seg = el("div", "seg"); seg.style.flex = "1";
      PRESET_KEYS.forEach(function (k) {
        var b = el("button", S().presets["n" + g] === k ? "on" : ""); b.textContent = CONFIG.PRESETS[k].label;
        b.onclick = function () { S().presets["n" + g] = k; renderPanel(); };
        seg.appendChild(b);
      });
      row.appendChild(seg); c1.appendChild(row);
    });
    c1.appendChild(el("div", "tiny", "Luyện đề: điểm cao, Vẹt cao. Đồ Án &amp; Lab: tay nghề thật, cần Phòng Máy."));
    wrap.appendChild(c1);

    // tuition
    var c2 = el("div", "card"); c2.appendChild(el("h3", null, "Học phí (mỗi SV / tháng)"));
    var row = el("div", "row"); row.appendChild(el("div", "grow muted", "Thu mỗi tháng: <b style='color:var(--gold)'>" + Math.round(s.tuition * s.students.length) + "tr</b>"));
    var stp = el("div", "stepper");
    var minus = el("button", "step", "−"), val = el("b", null, s.tuition.toFixed(1) + "tr"), plus = el("button", "step", "+");
    minus.onclick = function () { S().tuition = Math.max(CONFIG.TUITION_MIN, +(S().tuition - CONFIG.TUITION_STEP).toFixed(1)); renderPanel(); };
    plus.onclick = function () { S().tuition = Math.min(CONFIG.TUITION_MAX, +(S().tuition + CONFIG.TUITION_STEP).toFixed(1)); renderPanel(); };
    stp.appendChild(minus); stp.appendChild(val); stp.appendChild(plus); row.appendChild(stp); c2.appendChild(row);
    wrap.appendChild(c2);

    // build
    var c3 = el("div", "card"); c3.appendChild(el("h3", null, "Xây dựng"));
    var grid = el("div", "buildgrid");
    ["cangtin", "lab", "phongmay", "xuong", "phonghoc"].forEach(function (key) {
      var d = CONFIG.ROOMS[key], sk = ROOM_SKIN[key];
      var b = el("button", "build");
      var owned = s.rooms.filter(function (r) { return r.key === key; }).length;
      b.innerHTML = "<div class='nm'>" + sk.e + " " + d.name + (owned ? " <span class='tiny'>×" + owned + "</span>" : "") + "</div><div class='ds'>" + d.desc + "</div><div class='pr'>" + (d.cost ? "−" + d.cost + "tr" : "Miễn phí") + "</div>";
      if (d.cost > s.cash) b.disabled = true;
      b.onclick = function () { placingKey = key; document.body.classList.add("placing"); $("mapHint").textContent = "Chạm vào khuôn viên để đặt " + d.name + " (" + d.w + "×" + d.h + ")."; toast("Chọn vị trí trên bản đồ."); };
      grid.appendChild(b);
    });
    c3.appendChild(grid);
    wrap.appendChild(c3);

    // hire
    var c4 = el("div", "card"); c4.appendChild(el("h3", null, "Giảng viên"));
    var have = {}; s.teachers.forEach(function (t) { have[t.id] = 1; });
    s.teachers.forEach(function (t) {
      var r = el("div", "srow");
      r.innerHTML = "<div class='av' style='background:rgba(106,169,240,.15)'>🧑‍🏫</div><div class='grow'><div class='nm'>" + esc(t.ten) + "</div><div class='meta'>Dạy " + t.day + " · Diễn " + t.dien + " · " + t.luong + "tr/th" + (t.bienChe ? " · biên chế" : "") + "</div></div>";
      c4.appendChild(r);
    });
    var pool = CONTENT.teachers.pool.filter(function (t) { return !have[t.id]; });
    if (pool.length) {
      c4.appendChild(el("div", "tiny", "Tuyển thêm:")).style.margin = "8px 0 5px";
      pool.forEach(function (t) {
        var r = el("div", "srow");
        r.innerHTML = "<div class='av' style='background:rgba(240,198,116,.12)'>＋</div><div class='grow'><div class='nm'>" + esc(t.ten) + "</div><div class='meta'>Dạy " + t.day + " · Diễn " + t.dien + " · " + esc(t.note) + "</div></div>";
        var b = el("button", "btn", t.luong + "tr"); b.style.fontSize = "11px"; b.style.padding = "6px 9px";
        b.onclick = function () { S().teachers.push({ id: t.id, ten: t.ten, day: t.day, dien: t.dien, luong: t.luong, trait: t.trait, bienChe: false, age: 0 }); toast("Đã tuyển " + t.ten + "."); renderPanel(); };
        r.appendChild(b); c4.appendChild(r);
      });
    }
    wrap.appendChild(c4);
    return wrap;
  }

  function statBar(label, v, color) {
    return "<i title='" + label + "'><b style='width:" + Math.max(0, Math.min(100, v)) + "%;background:" + color + "'></b></i>";
  }
  function panelStudents() {
    var s = S(), wrap = el("div");
    for (var g = 1; g <= 4; g++) {
      var list = s.students.filter(function (x) { return x.grade === g; });
      if (!list.length) continue;
      var c = el("div", "card"); c.appendChild(el("h3", null, "Năm " + g + " · " + list.length + " sinh viên"));
      var sl = el("div", "slist");
      list.slice(0, 40).forEach(function (st) {
        var r = el("div", "srow");
        var mini = "<div class='mini'>" + statBar("Tay nghề", st.tn, "#6fcf97") + statBar("Sáng tạo", st.st, "#6aa9f0") + statBar("Cá mập", st.cm, "#f2994a") + "</div>";
        var marks = (st.flags && st.flags.hb ? " ✦" : "") + (st.ten === "Mai Sương" ? " 🔧" : "");
        r.innerHTML = "<div class='av' style='background:" + (GRADE_C[g] + "22") + "'>" + seedFace(st.seed) + "</div><div class='grow'><div class='nm'>" + esc(st.ten) + marks + "</div>" + mini + "</div><div class='tiny'>mood " + Math.round(st.mood) + "</div>";
        sl.appendChild(r);
      });
      c.appendChild(sl); wrap.appendChild(c);
    }
    if (!s.students.length) wrap.appendChild(el("div", "empty", "Chưa có sinh viên. Chờ kỳ tuyển sinh tháng 7."));
    return wrap;
  }
  function seedFace(seed) { return ["·", "🙂", "🙂", "😀", "😎", "🤩"][seed] || "🙂"; }

  function panelAlumni() {
    var s = S(), wrap = el("div");
    if (!s.alumni.length) { wrap.appendChild(el("div", "empty", "Chưa có cựu sinh viên.<br>Khoá đầu tốt nghiệp vào Lễ Tốt Nghiệp tháng 6.")); return wrap; }
    var order = { STEVE: 0, BI_BAT: 1 };
    var sorted = s.alumni.slice().sort(function (a, b) { return (order[a.state] != null ? order[a.state] : 5) - (order[b.state] != null ? order[b.state] : 5) || b.gradYear - a.gradYear; });
    var c = el("div", "card"); c.appendChild(el("h3", null, "Sổ cựu sinh viên · " + s.alumni.length));
    var sl = el("div", "slist");
    sorted.slice(0, 40).forEach(function (a) {
      var r = el("div", "srow");
      var chipCls = a.state === "STEVE" ? "schip gold-chip" : a.state === "BI_BAT" ? "schip red-chip" : "schip";
      var line = a.line || (CONTENT.alumLines[a.state] ? CONTENT.alumLines[a.state][0].replace(/\{ten\}/g, a.ten) : "");
      r.innerHTML = "<div class='av' style='background:rgba(255,255,255,.06)'>🎓</div><div class='grow'><div class='nm'>" + esc(a.ten) + " <span class='tiny'>· K" + a.gradYear + "</span></div><div class='meta'>" + esc(line) + "</div></div><div class='" + chipCls + "'>" + CONFIG.ALUM.CHIPS[a.state] + "</div>";
      sl.appendChild(r);
    });
    c.appendChild(sl);
    if (s.alumni.length > 40) c.appendChild(el("div", "tiny", "… và " + (s.alumni.length - 40) + " người nữa."));
    wrap.appendChild(c);
    return wrap;
  }

  function panelFund() {
    var s = S(), wrap = el("div");
    var c = el("div", "card"); c.appendChild(el("h3", null, "Thu — Chi mỗi tháng"));
    var income = Math.round(s.tuition * s.students.length);
    var sal = 0; s.teachers.forEach(function (t) { sal += t.luong; });
    var roomCost = 0; s.rooms.forEach(function (r) { roomCost += (CONFIG.ROOMS[r.key].cost || 0); });
    var maint = Math.round(CONFIG.MAINT_RATE * (s.book + roomCost) * 10) / 10;
    var cpay = 0; s.contracts.forEach(function (ct) { cpay += ct.pay; });
    c.appendChild(fundRow("🎓 Học phí " + s.students.length + " SV × " + s.tuition.toFixed(1) + "tr", "+" + income + "tr", "var(--green)"));
    if (cpay) c.appendChild(fundRow("🤝 Hợp đồng (" + s.contracts.length + ")", "+" + cpay + "tr", "var(--green)"));
    c.appendChild(fundRow("🧑‍🏫 Lương giảng viên", "−" + sal + "tr", "var(--red)"));
    c.appendChild(fundRow("🛠️ Bảo trì", "−" + maint + "tr", "var(--red)"));
    var net = income + cpay - sal - maint;
    c.appendChild(el("div", "row")).innerHTML = "<div class='grow' style='font-weight:700;font-size:12px;border-top:1px solid var(--line);padding-top:7px'>Cân đối</div><div style='font-weight:700;border-top:1px solid var(--line);padding-top:7px;color:" + (net >= 0 ? "var(--green)" : "var(--red)") + "'>" + (net >= 0 ? "+" : "") + Math.round(net) + "tr</div>";
    wrap.appendChild(c);

    // contracts
    if (s.contracts.length) {
      var cc = el("div", "card"); cc.appendChild(el("h3", null, "Hợp đồng đang chạy"));
      s.contracts.forEach(function (ct) {
        var r = el("div", "srow");
        r.innerHTML = "<div class='av' style='background:rgba(242,153,74,.15)'>🤝</div><div class='grow'><div class='nm'>" + esc(ct.co) + "</div><div class='meta'>+" + ct.pay + "tr/th · còn " + ct.mLeft + " tháng · điều khoản hình ảnh</div></div>";
        cc.appendChild(r);
      });
      wrap.appendChild(cc);
    }

    // endowment
    var ce = el("div", "card"); ce.appendChild(el("h3", null, "Quỹ hiến tặng"));
    ce.appendChild(el("div", "row", "<div class='grow'><div style='font-size:20px;font-weight:800;color:var(--gold)'>" + Math.round(s.endow.bal) + "tr</div><div class='tiny'>×1,004 mỗi tháng · không bao giờ mất giá · không mua được Uy Tín</div></div>"));
    // pantheon plaques (endowed)
    CONFIG.PANTHEON.forEach(function (p, i) {
      var sc = s.scholarships[i];
      var pl = el("div", "pantheon");
      var status = sc._endowed ? (sc.suspended ? "· tạm dừng năm nay" : "· đang trao") : ("· mở khoá ở " + CONFIG.FUND.SCHOL_GATES[i] + "tr");
      pl.innerHTML = "<div class='nm'>🏵️ " + esc(p.name) + " <span class='tiny' style='color:#b89b6a'>" + status + "</span></div><div class='ln'>" + esc(p.line) + "</div>";
      ce.appendChild(pl);
    });
    wrap.appendChild(ce);
    return wrap;
  }
  function fundRow(l, v, col) { var r = el("div", "row"); r.innerHTML = "<div class='grow muted'>" + l + "</div><div style='font-weight:700;color:" + col + "'>" + v + "</div>"; return r; }

  function panelInfo() {
    var s = S(), wrap = el("div");
    var c = el("div", "card"); c.appendChild(el("h3", null, "Sổ trường"));
    var counts = { 1: 0, 2: 0, 3: 0, 4: 0 }; s.students.forEach(function (x) { counts[x.grade]++; });
    c.appendChild(el("div", "row muted", "Sinh viên: Năm1 " + counts[1] + " · Năm2 " + counts[2] + " · Năm3 " + counts[3] + " · Năm4 " + counts[4]));
    c.appendChild(el("div", "row muted", "Đã tốt nghiệp: <b style='color:var(--ink)'>" + s.META.graduated + "</b> · Steve: <b style='color:var(--gold)'>" + s.META.steves + "</b> · Bị bắt: <b style='color:var(--red)'>" + s.META.arrested + "</b>"));
    // alumni states
    if (s.alumni.length) {
      var byState = {}; s.alumni.forEach(function (a) { byState[a.state] = (byState[a.state] || 0) + 1; });
      var line = Object.keys(byState).map(function (k) { return CONFIG.ALUM.CHIPS[k] + " " + byState[k]; }).join(" · ");
      c.appendChild(el("div", "row muted", line));
    }
    // open-question epilogue — a mirror the player PULLS (DESIGN §1), always available
    var eb = el("button", "btn", CONTENT.essay.openBtn); eb.style.marginTop = "9px"; eb.style.width = "100%";
    eb.onclick = function () { openModal(essayDraft()); };
    c.appendChild(eb);
    wrap.appendChild(c);
    // BXH
    if (s.examHistory.length) {
      var h = el("div", "card"); h.appendChild(el("h3", null, "Bảng xếp hạng điểm chuẩn"));
      s.examHistory.slice(-5).reverse().forEach(function (e) {
        h.appendChild(el("div", "row muted", "Năm " + e.year + ": điểm chuẩn <b style='color:var(--gold)'>" + e.cutoff.toFixed(2) + "</b> · hạng " + e.rank + "/4 · " + e.fill + " nhập học"));
      });
      wrap.appendChild(h);
    }
    var d = el("div", "card"); d.appendChild(el("div", "tiny", CONTENT.disclaimer));
    wrap.appendChild(d);
    return wrap;
  }

  /* === The Player's Answer — "Bản nháp bài luận của hiệu trưởng" (DESIGN §1: reflect, never verdict) === */
  function numWord(n) { var o = CONTENT.essay.ones; return (n >= 1 && n <= 9) ? o[n] : String(n); }
  function isOldCohort(a) { if (a._tpl) return true; var sc = CONFIG.ALUM.SCRIPTED || []; for (var i = 0; i < sc.length; i++) if (sc[i].ten === a.ten) return true; return false; }
  function buildCast(s, byState, majorityKey, C) {
    function pick(arr) { return arr.slice().sort(function (a, b) { return (b.grat - a.grat) || ((b.gifts || 0) - (a.gifts || 0)); }); }
    var cast = [], used = {}, total = s.alumni.length, i;
    pick(s.alumni.filter(function (a) { return a.state === "STEVE"; })).slice(0, C.STEVE_CAP).forEach(function (a) { cast.push(a); used[a.id] = 1; });
    pick(s.alumni.filter(function (a) { return a.state === "BI_BAT"; })).slice(0, C.BIBAT_CAP).forEach(function (a) { if (cast.length < C.CAST_CAP) { cast.push(a); used[a.id] = 1; } });
    if (majorityKey) {
      var maj = pick(s.alumni.filter(function (a) { return a.state === majorityKey && !used[a.id]; }));
      if (maj[0] && cast.length < C.CAST_CAP) { cast.push(maj[0]); used[maj[0].id] = 1; }
      if (maj[1] && cast.length < C.CAST_CAP && (byState[majorityKey] / Math.max(1, total)) >= C.SAME_STATE_RATIO) { cast.push(maj[1]); used[maj[1].id] = 1; }
    }
    var order = Object.keys(byState).filter(function (k) { return k !== "STEVE" && k !== "BI_BAT" && k !== majorityKey; }).sort(function (a, b) { return byState[b] - byState[a]; });
    for (i = 0; i < order.length && cast.length < C.CAST_CAP; i++) { var ex = pick(s.alumni.filter(function (a) { return a.state === order[i] && !used[a.id]; }))[0]; if (ex) { cast.push(ex); used[ex.id] = 1; } }
    return cast;
  }
  function essayDraft() {
    var s = S(), C = CONFIG.ESSAY, E = CONTENT.essay, w = el("div");
    var de = CONTENT.dePool[0], yw = numWord(s.year), cash = Math.round(s.cash), endow = Math.round(s.endow.bal);
    var byState = {}; s.alumni.forEach(function (a) { byState[a.state] = (byState[a.state] || 0) + 1; });
    var nonSteve = Object.keys(byState).filter(function (k) { return k !== "STEVE" && k !== "BI_BAT"; });
    var majorityKey = nonSteve.sort(function (a, b) { return byState[b] - byState[a]; })[0] || null;
    var total = s.alumni.length;
    var steveAlum = s.alumni.filter(function (a) { return a.state === "STEVE"; });
    var tenSteve = steveAlum[0] ? steveAlum[0].ten : null;
    var branchKey = (function () {
      if (s.META.steves > 0) return "steve";
      if (!majorityKey) return "kind";
      var ratio = byState[majorityKey] / Math.max(1, total);
      if (majorityKey === "CA_MAP_COIN" || (s.META.arrested > 0 && ((byState.CA_MAP_COIN || 0) + (byState.BI_BAT || 0)) / Math.max(1, total) >= C.MAJOR_RATIO)) return "coin";
      if (majorityKey === "QUAN_VAN_MAU" && ratio >= C.MAJOR_RATIO) return "vanmau";
      if (majorityKey === "THAT_NGHIEP" && ratio >= C.MAJOR_RATIO) return "that";
      if (majorityKey === "KY_SU" && s.thucChat >= 55) return "kysu";
      if (s.tiengTam - s.thucChat >= C.HYPE_GAP) return "hype";
      if (s.thucChat >= 65 && s.tiengTam < 60) return "thuc";
      return "kind";
    })();
    function P(cls, html, it) { var e = el("div", cls, html); if (it) e.style.fontStyle = "italic"; w.appendChild(e); }
    P("kic", esc(E.kic.replace("{year}", s.year)));
    var h = el("h2", null, esc(E.title)); w.appendChild(h);
    P("lead", tpl(E.falseStart, { yearWord: yw }));
    P("lead", tpl(E.deHeader, { de: de }), true);
    if (s.META.graduated === 0) {
      P("lead", tpl(E.empty, { cash: cash, endow: endow }));
    } else {
      P("lead", tpl(E.ledger, { yearWord: yw, graduated: s.META.graduated }));
      P("lead", s.META.steves > 0 ? E.nameWithSteve : E.nameNoSteve);
      buildCast(s, byState, majorityKey, C).forEach(function (a) {
        var line = a.line || tpl((CONTENT.alumLines[a.state] || ["{ten}."])[0], { ten: a.ten });
        var tail = (a.state === "BI_BAT" && isOldCohort(a)) ? E.castRowArrestTail : "";
        P("lead", esc(a.ten) + " — " + CONFIG.ALUM.CHIPS[a.state] + esc(tail) + "<br>“" + esc(line) + "”");
      });
      P("lead", s.META.steves > 0 ? tpl(E.steveColFull, { steves: s.META.steves }) : E.steveColEmpty);
      P("lead", E.ledgerHead);
      P("lead", tpl(E.ledgerBank, { cash: cash }));
      var endowTail = (majorityKey === "KY_SU" || (byState.KY_SU || 0) > 0) ? " phần lớn mấy đứa kỹ sư gửi về," : (tenSteve ? (" phần lớn là của " + esc(tenSteve) + ",") : "");
      P("lead", tpl(E.ledgerEndow, { endow: endow, endowTail: endowTail }));
      P("lead", E.ledgerThird);
      P("lead", E.ledgerStare);
    }
    P("lead", tpl(E.crossOut[branchKey], {}));
    P("nod", tpl(E.bacTam[s.META.graduated === 0 ? "empty" : branchKey], { nKySu: (byState.KY_SU || 0) }));
    P("lead", tpl(E.echo, { de: de }), true);
    P("tiny", esc(E.foot));
    var btn = el("button", "btn gold", esc(E.foldBtn)); btn.style.width = "100%"; btn.style.marginTop = "10px"; btn.onclick = hideModal; w.appendChild(btn);
    return w;
  }

  /* ============================================================================
     MODALS
     ========================================================================== */
  function checkModals() {
    var s = S(), sig = "";
    if (s.pendingJune) sig = "june:" + s.pendingJune.stage;
    else if (s.pendingAdmit) sig = "admit:" + s.pendingAdmit.year;
    else if (s.pendingContract) sig = "ct:" + s.pendingContract.born;
    else if (s.pendingEvent) sig = "ev:" + s.pendingEvent.id + s.pendingEvent.born;
    else if (s._giftFlush) sig = "gift";
    if (sig === lastSig) return;
    lastSig = sig;
    if (!sig) { hideModal(); return; }
    hideInspect();
    if (s.pendingJune) s.pendingJune.stage === "policy" ? showJunePolicy() : showJuneResults();
    else if (s.pendingAdmit) showAdmit();
    else if (s.pendingContract) showContract();
    else if (s.pendingEvent) showEvent();
    else if (s._giftFlush) showGift();
  }
  function openModal(node) { var sh = $("sheet"); sh.innerHTML = ""; sh.appendChild(node); $("modalRoot").classList.add("show"); sh.scrollTop = 0; }
  function hideModal() { $("modalRoot").classList.remove("show"); }

  function showJunePolicy() {
    var s = S(), pj = s.pendingJune, w = el("div");
    w.appendChild(el("div", "kic", "Kỳ thi tốt nghiệp · Năm " + s.year));
    w.appendChild(el("h2", null, "Lễ Tốt Nghiệp"));
    w.appendChild(el("div", "lead", esc(pj.de) + "<br><span style='color:var(--faint)'>" + esc(pj.foreshadow) + "</span>"));
    w.appendChild(el("div", "lead", "Khoá Năm 4 bước vào kỳ bảo vệ. Chọn hướng đi cho cả khoá:"));
    var ch = el("div", "choices");
    var a = el("button", "choice"); a.innerHTML = "<div class='ttl'>📋 Đồ Án Mẫu</div><div class='hint'>+1,0 điểm cả khoá, +5 Vẹt, gieo một mầm phốt. Báo có thể khen hoặc mỉa.</div>";
    a.onclick = function () { HVS.finalizeJune("dam"); afterFinalize(); };
    var b = el("button", "choice virtue"); b.innerHTML = "<div class='ttl'>🛠️ Bảo Vệ Thật</div><div class='hint'>Điểm thô, không cộng. Nhưng nếu có em bảo vệ xuất sắc, khả năng viral gấp đôi.</div>";
    b.onclick = function () { HVS.finalizeJune("thuc"); afterFinalize(); };
    ch.appendChild(a); ch.appendChild(b); w.appendChild(ch);
    openModal(w);
  }
  function afterFinalize() { syncActors(); rebuildWalk(); drawStatic(); lastSig = ""; checkModals(); render(); }
  function showJuneResults() {
    var s = S(), pj = s.pendingJune, w = el("div");
    w.appendChild(el("div", "kic", "Kết quả · Năm " + (s.year - 1)));
    w.appendChild(el("h2", null, "Khoá vừa ra trường"));
    (pj.results || []).forEach(function (rc) {
      var r = el("div", "gres");
      var extra = "";
      if (rc.tiem) extra += "<div class='nod'>" + CONTENT.bacTamTiemNang + "</div>";
      if (rc.viral) extra += "<div class='nod'>Phần bảo vệ lan truyền khắp mạng.</div>";
      if (rc.near) extra += "<div class='tiny' style='color:var(--faint)'>" + esc(rc.near) + "</div>";
      r.innerHTML = "<div class='em'>" + rc.emoji + "</div><div class='grow'><div class='oc'>" + esc(rc.ten) + " — " + esc(rc.outcome) + "</div><div class='fl'>" + esc(rc.flavor || "") + "</div><div class='tiny' style='margin-top:2px'>Trạng thái đầu đời: " + rc.entryChip + "</div>" + extra + "</div><div class='dm'>" + rc.diem.toFixed(1) + "</div>";
      w.appendChild(r);
    });
    var btn = el("button", "btn gold", "Tiếp tục →"); btn.style.width = "100%"; btn.style.marginTop = "8px";
    btn.onclick = function () { S().pendingJune = null; lastSig = ""; checkModals(); render(); };
    w.appendChild(btn);
    openModal(w);
  }

  function showAdmit() {
    var s = S(), pa = s.pendingAdmit;
    function rerender() {
      var w = el("div");
      w.appendChild(el("div", "kic", "Tuyển sinh · Năm " + pa.year));
      w.appendChild(el("h2", null, "Công bố điểm chuẩn"));
      w.appendChild(el("div", "lead", CONTENT.khoa + "<br><span class='tiny'>Năm ngoái: " + pa.lastCutoff.toFixed(2) + " — " + pa.lastFill + "/" + pa.lastQuota + " nhập học · " + pa.n + " hồ sơ năm nay</span>"));
      // histogram (bins 12..30)
      var bins = new Array(19).fill(0);
      pa.pool.forEach(function (ap) { var b = Math.min(18, Math.max(0, Math.floor(ap.score - 12))); bins[b]++; });
      var mx = Math.max(1, Math.max.apply(null, bins));
      var hwrap = el("div", "histo");
      bins.forEach(function (cnt, i) { var b = el("div", "b" + ((12 + i) >= pa.cut ? " hot" : "")); b.style.height = (cnt / mx * 70 + 2) + "px"; hwrap.appendChild(b); });
      var cl = el("div", "cutline"); cl.style.left = ((pa.cut - 12) / 19 * 100) + "%"; hwrap.appendChild(cl);
      w.appendChild(hwrap);
      w.appendChild(el("div", "tiny", "12 ← điểm chuẩn → 30+"));
      // dials
      w.appendChild(dial("ĐIỂM CHUẨN", pa.cut.toFixed(2), function () { pa.cut = Math.max(CONFIG.ADMIT.CUT_MIN, +(pa.cut - 0.25).toFixed(2)); rerender(); }, function () { pa.cut = Math.min(CONFIG.ADMIT.CUT_MAX, +(pa.cut + 0.25).toFixed(2)); rerender(); }));
      w.appendChild(dial("CHỈ TIÊU", pa.quota, function () { pa.quota = Math.max(CONFIG.ADMIT.QUOTA_MIN, pa.quota - 1); rerender(); }, function () { pa.quota = Math.min(CONFIG.ADMIT.QUOTA_MAX, pa.quota + 1); rerender(); }));
      // forecast
      var M = pa.pool.filter(function (ap) { return ap.score >= pa.cut; }).length;
      var fill = Math.min(M, pa.quota);
      var fc = el("div", "fcast");
      fc.innerHTML = "Đủ điểm: <b>" + M + "</b> → Trúng tuyển <b>" + fill + "</b>/" + pa.quota +
        "<br>Học phí thêm: <b style='color:var(--gold)'>+" + Math.round(fill * s.tuition) + "tr/tháng</b>";
      if (M < pa.quota) fc.innerHTML += "<br><span class='warn'>Thiếu " + (pa.quota - M) + " — ghế trống.</span>";
      if (pa.cut >= 29.5) fc.innerHTML += "<br><span class='warn'>⚠ Nguy cơ phốt: thủ khoa vẫn trượt.</span>";
      if (pa.cut <= 15.5) fc.innerHTML += "<br><span class='warn'>⚠ Báo sẽ gọi đây là 'vét sàn'.</span>";
      w.appendChild(fc);
      var cta = el("button", "btn gold", "📣 CÔNG BỐ ĐIỂM CHUẨN"); cta.style.width = "100%";
      cta.onclick = function () { HVS.declareAdmissions(pa.cut, pa.quota, false); afterAdmit(); };
      w.appendChild(cta);
      w.appendChild(el("div", "tiny", CONTENT.modal.admitFooter)).style.textAlign = "center";
      openModal(w);
    }
    rerender();
  }
  function afterAdmit() { syncActors(); lastSig = ""; checkModals(); render(); toast("Tân sinh viên đang vào trường."); }
  function dial(lab, val, dec, inc) {
    var r = el("div", "row"); r.style.marginBottom = "4px";
    r.innerHTML = "<div class='grow' style='font-size:11px;font-weight:700;color:var(--dim);letter-spacing:.4px'>" + lab + "</div>";
    var stp = el("div", "stepper");
    var m = el("button", "step", "−"), v = el("b", null, val), p = el("button", "step", "+");
    m.onclick = dec; p.onclick = inc; stp.appendChild(m); stp.appendChild(v); stp.appendChild(p); r.appendChild(stp);
    return r;
  }

  function showEvent() {
    var s = S(), pe = s.pendingEvent;
    var ev = CONTENT.events.filter(function (e) { return e.id === pe.id; })[0];
    var t = pe.targetId ? s.students.filter(function (x) { return x.id === pe.targetId; })[0] : null;
    var w = el("div");
    w.appendChild(el("div", "kic", "Tình huống"));
    w.appendChild(el("h2", null, esc(ev.title)));
    w.appendChild(el("div", "lead", esc((ev.desc || "").replace(/\{ten\}/g, t ? t.ten : "Một sinh viên"))));
    var ch = el("div", "choices");
    ev.choices.forEach(function (c, i) {
      var virtuous = /tử tế|mượn|báo cáo|giữ em/.test(c.hint || "");
      var b = el("button", "choice" + (virtuous ? " virtue" : ""));
      b.innerHTML = "<div class='ttl'>" + esc(c.label) + "</div><div class='hint'>" + esc(c.hint || "") + "</div>";
      b.onclick = function () { HVS.resolveEvent(i); lastSig = ""; checkModals(); renderPanel(); };
      ch.appendChild(b);
    });
    w.appendChild(ch);
    openModal(w);
  }

  function showContract() {
    var s = S(), c = s.pendingContract.def, w = el("div");
    w.appendChild(el("div", "kic", "Hợp tác doanh nghiệp"));
    w.appendChild(el("h2", null, esc(c.co)));
    w.appendChild(el("div", "lead", esc(c.offer)));
    var ch = el("div", "choices");
    var a = el("button", "choice"); a.innerHTML = "<div class='ttl'>Ký hợp đồng</div><div class='hint'>+" + c.sign + "tr ngay, +" + c.pay + "tr/tháng × " + c.months + ". −2 Thực Chất, +2 Tiếng Tăm.</div>";
    a.onclick = function () { HVS.resolveContract(true); lastSig = ""; checkModals(); renderPanel(); };
    var b = el("button", "choice virtue"); b.innerHTML = "<div class='ttl'>Từ chối khéo</div><div class='hint'>+2 Thực Chất, +1 Uy Tín. Bác Tâm gật đầu.</div>";
    b.onclick = function () { HVS.resolveContract(false); lastSig = ""; checkModals(); renderPanel(); };
    ch.appendChild(a); ch.appendChild(b); w.appendChild(ch);
    openModal(w);
  }

  function showGift() {
    var s = S(), gf = s._giftFlush, w = el("div");
    w.appendChild(el("div", "kic", "20/11 · Ngày Nhà Giáo"));
    w.appendChild(el("h2", null, "🎓 " + gf.n + " phong bì"));
    if (gf.biggest) w.appendChild(el("div", "lead", "Từ " + esc(gf.biggest.ten) + ":<br><i>“" + esc(gf.quote) + "”</i>"));
    w.appendChild(el("div", "nod", "Bác Tâm để chồng thư lên bàn, không nói gì."));
    var btn = el("button", "btn gold", "Cất vào ngăn kéo"); btn.style.width = "100%"; btn.style.marginTop = "10px";
    btn.onclick = function () { S()._giftFlush = null; lastSig = ""; checkModals(); render(); };
    w.appendChild(btn);
    openModal(w);
  }

  /* ============================================================================
     SOUND — minimal generative campus-lofi (pentatonic pad). ROADMAP v1 deepens.
     ========================================================================== */
  // Generative campus-lofi: a calm 3-layer bed (pad / pluck / bass), state-aware by "mood".
  // All procedural (no asset files); defensive (any failure silently disables). ROADMAP item 4.
  var actx = null, master = null, sndTimers = [];
  var MOODS = {
    normal:  { base: 220, scale: [0, 2, 4, 7, 9],     pad: [0, 7, 16],     gain: 0.050, rate: [1500, 3200] }, // warm major pentatonic
    tet:     { base: 247, scale: [0, 2, 4, 7, 9, 12], pad: [0, 7, 12, 16], gain: 0.055, rate: [1100, 2400] }, // brighter, busier (Tết)
    june:    { base: 196, scale: [0, 3, 5, 7, 10],    pad: [0, 7, 12, 15], gain: 0.060, rate: [1700, 3400] }, // slower swell (Lễ Tốt Nghiệp)
    scandal: { base: 196, scale: [0, 3, 5, 8, 10],    pad: [0, 3, 10],     gain: 0.044, rate: [1900, 3800] }  // minor undertone (phốt)
  };
  function currentMood() {
    try { var s = S(); if (s.pendingJune) return "june"; if (s.month === 2) return "tet"; if ((s.photSeeds && s.photSeeds.length >= 3) || s.tiengTam < 16) return "scandal"; return "normal"; }
    catch (e) { return "normal"; }
  }
  function freqOf(base, semi) { return base * Math.pow(2, semi / 12); }
  function tone(freq, dur, gain, type, attack) {
    if (!actx || !master) return;
    var o = actx.createOscillator(), g = actx.createGain();
    o.type = type || "sine"; o.frequency.value = freq; o.connect(g); g.connect(master);
    var t = actx.currentTime, a = attack || 0.4;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function schedMelody() {
    if (!soundOn || !actx) return;
    var m = MOODS[currentMood()];
    var semi = m.scale[(Math.random() * m.scale.length) | 0] + (Math.random() < 0.35 ? 12 : 0);
    tone(freqOf(m.base, semi), 2.4, m.gain, "sine", 0.5);
    sndTimers.push(setTimeout(schedMelody, m.rate[0] + Math.random() * (m.rate[1] - m.rate[0])));
  }
  function schedPad() {
    if (!soundOn || !actx) return;
    var m = MOODS[currentMood()];
    m.pad.forEach(function (semi) { tone(freqOf(m.base, semi - 12), 9, m.gain * 0.45, "triangle", 2.6); });
    sndTimers.push(setTimeout(schedPad, 8000 + Math.random() * 4000));
  }
  function schedBass() {
    if (!soundOn || !actx) return;
    var m = MOODS[currentMood()];
    tone(freqOf(m.base, -24), 3.4, m.gain * 0.7, "sine", 0.8);
    sndTimers.push(setTimeout(schedBass, 4200 + Math.random() * 2200));
  }
  function clearSnd() { for (var i = 0; i < sndTimers.length; i++) clearTimeout(sndTimers[i]); sndTimers = []; }
  function startSound() {
    try {
      if (!actx) { actx = new (window.AudioContext || window.webkitAudioContext)(); master = actx.createGain(); master.gain.value = 0.85; master.connect(actx.destination); }
      if (actx.state === "suspended") actx.resume();
      soundOn = true; S().META.sound = true; $("soundBtn").classList.add("on");
      clearSnd(); schedMelody(); sndTimers.push(setTimeout(schedPad, 400)); sndTimers.push(setTimeout(schedBass, 1800));
    } catch (e) { soundOn = false; }
  }
  function stopSound() { soundOn = false; try { S().META.sound = false; } catch (e) {} $("soundBtn").classList.remove("on"); clearSnd(); }
  function toggleSound() { if (soundOn) stopSound(); else startSound(); }

  /* ---------------- utils ---------------- */
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var toastTimer = null;
  function toast(msg) { var t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1900); }

  // tiny test hook (screenshots / future gates) — view-only, no game mutation
  window.__ui = {
    inspectStudent: showInspectStudent, inspectRoom: showInspectRoom, hideInspect: hideInspect,
    firstStudentId: function () { return S().students[0] && S().students[0].id; },
    setTab: function (t) { tab = t; render(); },
    setPeriod: function (p) { forcePeriod = p; }, // test hook: pin a day-period for screenshots
    // test hook: fast-forward the walk so a pinned period reaches its destinations (headless rAF is throttled)
    _settle: function (frames) { if (S()._mapDirty) { rebuildWalk(); drawStatic(); } var p = forcePeriod >= 0 ? forcePeriod : 0, ts = 20000; for (var i0 = 0; i0 < actors.length; i0++) actors[i0]._period = -99; for (var f = 0; f < (frames || 1500); f++) { ts += 16; for (var i = 0; i < actors.length; i++) updateActor(actors[i], true, ts, p); } }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
