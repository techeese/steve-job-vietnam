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
    xuong:    { c: "#7a4a2f", e: "🔧", g: "#9c5f3d" },
    vuontdn:  { c: "#2f6b46", e: "🌳", g: "#3a875a" },
    vuontqb:  { c: "#2f5d8a", e: "📖", g: "#3d77ad" },
    vuonhxh:  { c: "#8a2f5a", e: "🌸", g: "#ad3d77" }
  };
  var GRADE_C = { 1: "#3fb98e", 2: "#4a8fe0", 3: "#f0a838", 4: "#a86fe0" }; // year uniform colours (richer, pop on grass)

  /* === PIXEL-ART v2: pre-baked character atlas (bake once → blit, fast at 48 actors) === */
  var PX = { // bright daytime palette
    grass: "#7fb84a", grassD: "#72a83f", grassL: "#8cc457", grassT: "#6a9c3a",
    path: "#d8b779", pathD: "#bd9a5c", pathHi: "#e7cf9b",
    out: "#2c2738", skin: "#f4c79c", skinD: "#e2a878", eye: "#3a2f3a",
    pants: "#46506a", pantsD: "#343c52", shoe: "#2c2535", mouth: "#a85248",
    gold: "#f5cd6a", roof: "#caa24a"
  };
  // variety axes — students read as individuals, not clones
  var SKINS = [["#f4c79c", "#e2a878"], ["#ecb888", "#d49a66"], ["#cf9a64", "#b07c4c"]]; // [skin, shadow]
  var HAIRSET = [["#3a2a1c", "#5a3f28"], ["#21201f", "#3a3433"], ["#6e4a26", "#8a6336"], ["#a85a3a", "#c4724a"], ["#c9a14e", "#e0bb66"], ["#5b4a6e", "#74608c"]]; // [base, hi]
  var HAIRSTYLE = ["short", "long", "bun"];
  var ACC = ["none", "none", "glasses", "bow", "cap", "none"]; // weighted toward none
  // baked variant list (skin × hair-colour × hair-style × accessory), capped
  var VARIANTS = [];
  (function () { var s = [0, 0, 1, 0, 2, 1, 0, 2, 1, 0, 1, 2], h = [0, 1, 2, 3, 1, 4, 0, 2, 5, 3, 1, 4], y = [0, 1, 0, 2, 1, 0, 2, 1, 0, 1, 2, 0], a = [0, 2, 0, 3, 0, 1, 4, 0, 2, 0, 5, 1]; for (var i = 0; i < 12; i++) VARIANTS.push({ s: s[i], h: h[i], y: y[i], a: a[i] }); })();
  var ATLAS = null; // ATLAS[grade0..3][variant0..11][frame0..1] = offscreen canvas
  function bakeChar(shirt, shirtD, V, frame) {
    var sk = SKINS[V.s][0], skD = SKINS[V.s][1], skH = shade(sk, 0.16);
    var hair = HAIRSET[V.h][0], hairHi = HAIRSET[V.h][1], hairD = shade(hair, -0.32), style = HAIRSTYLE[V.y], acc = ACC[V.a];
    var shirtH = shade(shirt, 0.20), shirtDD = shade(shirtD, -0.20);
    var cv = document.createElement("canvas"); cv.width = 16; cv.height = 22;
    var X = cv.getContext("2d"); X.imageSmoothingEnabled = false;
    function R(x, y, w, h, c) { X.fillStyle = c; X.fillRect(x, y, w, h); }
    // HEAD with 1px outline — lit upper-left, shaded lower-right (rounded volume)
    R(3, 1, 10, 10, PX.out); R(4, 2, 8, 8, sk);
    R(4, 2, 7, 1, skH); R(4, 2, 1, 7, skH);  // lit top + left edge
    R(11, 3, 1, 7, skD); R(10, 8, 1, 2, skD); // shaded right + lower-right cheek
    X.clearRect(3, 1, 1, 1); X.clearRect(12, 1, 1, 1); X.clearRect(3, 10, 1, 1); X.clearRect(12, 10, 1, 1);
    // hair by style (right side darker for roundness)
    R(4, 2, 8, 2, hair); R(4, 2, 1, 4, hair); R(11, 2, 1, 4, hair); R(4, 2, 8, 1, hairHi); R(11, 2, 1, 4, hairD);
    if (style === "short") { R(5, 4, 1, 1, hair); R(10, 4, 1, 1, hairD); }
    else if (style === "long") { R(4, 2, 1, 8, hair); R(11, 2, 1, 8, hairD); R(3, 9, 1, 1, hair); R(12, 9, 1, 1, hairD); }
    else { R(7, 0, 2, 2, hair); R(6, 0, 4, 1, hairHi); R(5, 4, 1, 1, hair); R(10, 4, 1, 1, hairD); } // bun
    // face
    R(5, 6, 2, 2, PX.eye); R(9, 6, 2, 2, PX.eye); R(5, 6, 1, 1, "#ffffff"); R(9, 6, 1, 1, "#ffffff");
    R(4, 8, 1, 1, "#f2ad95"); R(11, 8, 1, 1, "#f2ad95"); R(7, 9, 2, 1, PX.mouth);
    // accessory
    if (acc === "glasses") { R(4, 6, 3, 2, PX.out); R(9, 6, 3, 2, PX.out); R(7, 7, 2, 1, PX.out); R(5, 6, 1, 1, "#bfe0ff"); R(10, 6, 1, 1, "#bfe0ff"); }
    else if (acc === "bow") { R(3, 2, 2, 2, "#f15a7a"); R(2, 2, 1, 2, "#d63f5e"); }
    else if (acc === "cap") { R(3, 1, 10, 2, "#4a8fe0"); R(4, 0, 8, 1, "#5b9ff0"); R(11, 2, 3, 1, "#3a78c8"); }
    // BODY (shirt) — rounded torso: lit left, 2-tone shadow on the right, lit top seam
    R(3, 10, 10, 8, PX.out); R(4, 11, 8, 6, shirt);
    R(4, 11, 7, 1, shirtH); R(4, 11, 1, 5, shirtH);   // lit top + left edge
    R(10, 11, 2, 6, shirtD); R(11, 11, 1, 6, shirtDD); // shaded right (2-tone)
    R(3, 12, 1, 4, shirt); R(12, 12, 1, 4, shirtD); R(3, 16, 1, 1, sk); R(12, 16, 1, 1, sk); // arms (right arm in shade)
    // LEGS (2-frame) + shoes
    if (frame === 0) { R(5, 17, 2, 4, PX.pants); R(9, 17, 2, 4, PX.pants); R(5, 20, 2, 1, PX.shoe); R(9, 20, 2, 1, PX.shoe); }
    else { R(5, 17, 2, 3, PX.pants); R(5, 19, 2, 1, PX.shoe); R(9, 17, 2, 4, PX.pants); R(9, 20, 2, 1, PX.shoe); }
    R(5, 17, 6, 1, PX.pantsD); R(9, 17, 2, 3, shade(PX.pants, -0.12)); // waistband + shaded right leg (pants only, shoe kept)
    return cv;
  }
  function buildAtlas() {
    ATLAS = [];
    for (var g = 0; g < 4; g++) { ATLAS[g] = []; var sh = shade(GRADE_C[g + 1], -0.28); for (var v = 0; v < VARIANTS.length; v++) { ATLAS[g][v] = []; for (var fr = 0; fr < 2; fr++) ATLAS[g][v][fr] = bakeChar(GRADE_C[g + 1], sh, VARIANTS[v], fr); } }
  }

  /* === ART: Sơn Mài Diorama (lacquer-night campus, gold-leaf pavilions) === */
  // per-room style: wall hue, roof silhouette, window temperature, gable sigil, short map label
  var ROOM_STYLE = { // bright pixel-art buildings
    phonghoc: { wall: "#f0dcab", wallD: "#d4bd86", roof: "gabled",   rc: "#e0584a", rcD: "#bf4439", win: "warm",  short: "Phòng học" },
    san:      { wall: "#5fae4a", roof: "none",      win: "none",                                     short: "Sân trường" },
    cangtin:  { wall: "#f3b676", wallD: "#d9985a", roof: "awning",   rc: "#e0584a", rcD: "#bf4439", win: "warm",  short: "Căng tin" },
    lab:      { wall: "#c2e8e3", wallD: "#9bccc7", roof: "glossy",   rc: "#4fb0c0", rcD: "#3a8d9c", win: "glass", short: "Lab" },
    phongmay: { wall: "#d8c6ef", wallD: "#b9a4d8", roof: "flatvent", rc: "#8a6cc0", rcD: "#6f53a4", win: "cold",  short: "Phòng máy" },
    xuong:    { wall: "#cca982", wallD: "#ad8a62", roof: "sawtooth", rc: "#9a7548", rcD: "#7d5d36", win: "warm",  short: "Xưởng" },
    vuontdn:  { garden: true, accent: "#6fcf97", short: "Trần Đại Nghĩa" },
    vuontqb:  { garden: true, accent: "#6aa9f0", short: "Tạ Quang Bửu" },
    vuonhxh:  { garden: true, accent: "#f15a7a", short: "Hồ Xuân Hương" }
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
  var selStudent = null, selRoom = null; // what the player has tapped (drives the on-map selection marker)
  var tapFx = null; // transient tap ripple (immediate touch feedback on mobile)
  var resetting = false; // set when wiping the save → blocks autosave so the reset actually sticks
  var actors = [], walk = null, ringsByKey = {}, curPeriod = -1, forcePeriod = -1, cats = [], ball = null, flyers = [];
  // campus-life day clock: 5 real-time periods × 16s = 80s day (animates even while paused, for chill ambiance)
  var PERIOD_MS = 16000, N_PERIODS = 5; // 0 class · 1 recess · 2 lunch · 3 afternoon · 4 tan học
  // gentle time-of-day warmth per period (low alpha, warm — never darkens the sunny look)
  var TINTS = ["rgba(255,246,214,.045)", "rgba(255,251,224,.03)", "rgba(255,240,196,.06)", "rgba(255,214,148,.085)", "rgba(255,186,116,.12)"];

  function boot() {
    if (!HVS.loadGame()) { /* fresh already set */ }
    var q = location.search.match(/seed=(\d+)/);
    if (q && (!localStorage.getItem(CONFIG.SAVE_KEY))) HVS.freshState(parseInt(q[1], 10));
    soundOn = !!S().META.sound;
    if (soundOn) $("soundBtn").classList.add("on");
    $("schoolSub").textContent = CONTENT.schoolSub;
    buildSpeeds(); buildTabs();
    buildAtlas(); // bake pixel-art sprite atlas once
    rebuildWalk(); syncActors(true); initCats(); initFlyers();
    drawStatic(); render(); requestAnimationFrame(liveLoop);
    $("mapHint").textContent = "Chạm vào sinh viên hoặc phòng để xem chi tiết.";
    // font gate: redraw the static layer once 'Be Vietnam Pro' is ready so room labels aren't a fallback face
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { S()._mapDirty = true; });
    setInterval(loopTick, CONFIG.TICK_MS);
    setInterval(function () { if (!resetting) HVS.saveGame(); }, 4000);
    $("soundBtn").onclick = toggleSound;
    $("mapStatic").addEventListener("click", onMapClick);
    document.addEventListener("visibilitychange", function () { if (document.hidden && !resetting) HVS.saveGame(); });
    // autoplay-unlock: browsers block audio until a gesture; start (or resume persisted) music on first tap
    var unlock = function () { if (soundOn) startSound(); document.removeEventListener("pointerdown", unlock); };
    document.addEventListener("pointerdown", unlock, { once: true });
    if (!S().META.tutorial) showIntro(); // first-time premise
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
    var st = S().students, byId = {}, stId = {};
    for (var i = 0; i < actors.length; i++) byId[actors[i].id] = actors[i];
    for (i = 0; i < st.length; i++) stId[st[i].id] = 1;
    var next = [], arriveN = 0;
    for (i = 0; i < st.length; i++) {
      var s = st[i], a = byId[s.id];
      if (!a) {
        if (initial) {
          // boot / reload: existing roster lands in place, no walk-in
          var t0 = randWalkTile();
          a = { id: s.id, px: t0[0] * T + T / 2, py: t0[1] * T + T / 2, tx: t0[0], ty: t0[1], wait: 0, ph: Math.random() * 6.28 };
        } else {
          // a brand-new matriculant: spawn just OUTSIDE the cổng and walk in up the path.
          // simultaneous arrivals queue in a short column so a cohort files in as a procession.
          var gx = GW >> 1;
          a = { id: s.id, px: gx * T + T / 2 + (((s.id * 29) % 5) - 2), py: GH * T + 14 + arriveN * 15, tx: gx, ty: GH - 1, wait: 0, ph: Math.random() * 6.28, _arriving: true, emote: "excl", emoteUntil: 1e15 };
          arriveN++;
        }
      } else if (a._arriving) {
        // clear the arrival mark once they've actually stepped onto the grounds
        if (a.py < GH * T - 6) { a._arriving = false; a.emote = null; a.emoteUntil = 0; }
      }
      a.grade = s.grade; a.bodyC = GRADE_C[s.grade] || "#9aa4b2"; a.special = (s.ten === "Mai Sương"); a.hb = !!(s.flags && s.flags.hb);
      a.tell = s.tell || ""; a.seed = s.seed;
      a.variantIdx = (typeof s.look === "number" && s.look >= 0 && s.look < VARIANTS.length) ? s.look : hashId(s.id) % VARIANTS.length;
      a.skin = SKINS[VARIANTS[a.variantIdx].s][0]; a.glasses = ACC[VARIANTS[a.variantIdx].a] === "glasses";
      a._ox = ((s.id * 37) % 7) - 3; a._oy = ((s.id * 53) % 7) - 3; // small fan-out so clustered students don't perfectly overlap
      next.push(a);
    }
    // graduated / departed students: keep their actor and walk it OUT through the cổng (mirror of the
    // arrival procession) until it exits the map, then drop it. No walk-out on a boot/reload rebuild.
    if (!initial) {
      for (i = 0; i < actors.length; i++) {
        var old = actors[i];
        if (stId[old.id] || old._gone) continue;           // still enrolled, or already off-map
        if (!old._leaving) { old._leaving = true; old._leaveT = 0; old.emote = "music"; old.emoteUntil = 1e15; old._atDest = false; old.act = null; }
        next.push(old);
      }
    }
    actors = next;
  }
  var lastSync = 0;
  function liveLoop(ts) {
    var ctx = $("mapLive").getContext("2d");
    ctx.imageSmoothingEnabled = false; // crisp pixel-art blits
    ctx.clearRect(0, 0, GW * T, GH * T);
    if (S()._mapDirty) { rebuildWalk(); drawStatic(); }
    if (ts - lastSync > 500) { syncActors(); lastSync = ts; }
    var alive = !anyModal(); // campus stays alive at speed 0 (chill); freezes only for modals
    var period = (forcePeriod >= 0) ? forcePeriod : (Math.floor(ts / PERIOD_MS) % N_PERIODS);
    var i;
    for (i = 0; i < actors.length; i++) updateActor(actors[i], alive, ts, period);
    actors.sort(function (a, b) { return a.py - b.py; });
    for (i = 0; i < actors.length; i++) { drawActor(ctx, actors[i], ts); if (actors[i]._atDest && actors[i].act) drawActivity(ctx, actors[i], ts); if (actors[i].emote) drawEmote(ctx, actors[i].emote, actors[i].px | 0, actors[i].py | 0); }
    drawSelection(ctx, ts); // on-map marker for the tapped student/room
    drawTapFx(ctx, ts);     // expanding ripple at the last tap (touch feedback)
    if (period === 1) { if (alive) updateBall(ts); drawBall(ctx); } // pickup football at recess
    for (i = 0; i < cats.length; i++) { if (alive) updateCat(cats[i], ts); drawCat(ctx, cats[i], ts); }
    if (alive) updateFlyers(ts); drawFlyers(ctx, ts);
    drawSmoke(ctx, ts);
    ctx.fillStyle = TINTS[period] || TINTS[2]; ctx.fillRect(0, 0, GW * T, GH * T); // time-of-day warmth (subtle, never dark)
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
    if (a._leaving) { // graduate heading out the cổng — ignore activity routing
      var ggx = (GW >> 1) * T + T / 2 + a._ox, ggy = GH * T + 20;
      var ldx = ggx - a.px, ldy = ggy - a.py, ld = Math.hypot(ldx, ldy);
      if (alive) { var ls = 0.55; a.px += (ldx / ld) * ls; a.py += (ldy / ld) * ls; a.dir = ldx < 0 ? -1 : 1; a._moving = true; a._leaveT++; }
      if (a.py > GH * T + 12 || a._leaveT > 1600) a._gone = true; // exited (or safety timeout) → dropped next sync
      a.bob = Math.sin(ts / 180 + a.ph) * 1.2;
      return;
    }
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
    // personality: occasional emote bubble (the campus reacts, lives)
    if (a.emoteUntil && ts > a.emoteUntil) a.emote = null;
    else if (!a.emote && alive && Math.random() < 0.0008) { a.emote = pickEmote(a); a.emoteUntil = ts + 2300; }
  }
  var EMOTES = ["music", "excl", "dots", "heart", "spark", "idea", "sweat", "q"];
  function pickEmote(a) {
    if (a.act === "perform") return "music";
    if (a.act === "eat") return Math.random() < 0.6 ? "heart" : "spark";
    if (a.act === "study") return Math.random() < 0.5 ? "idea" : "dots";
    if (a.act === "tinker") return Math.random() < 0.6 ? "idea" : "spark";
    if (a.act === "daydream") return Math.random() < 0.5 ? "dots" : "music";
    return EMOTES[(Math.random() * EMOTES.length) | 0];
  }
  function drawEmote(ctx, t, x, y) {
    var ty = y - 27;
    ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(x - 3, ty - 1, 7, 7); ctx.fillRect(x - 1, ty + 6, 2, 1); // speech bubble
    ctx.fillStyle = "rgba(0,0,0,.12)"; ctx.fillRect(x - 3, ty + 5, 7, 1);
    if (t === "music") { ctx.fillStyle = PX.out; ctx.fillRect(x + 1, ty, 1, 4); ctx.fillStyle = "#e0584a"; ctx.fillRect(x - 1, ty + 3, 2, 2); }
    else if (t === "excl") { ctx.fillStyle = "#e0584a"; ctx.fillRect(x, ty, 2, 3); ctx.fillRect(x, ty + 4, 2, 1); }
    else if (t === "dots") { ctx.fillStyle = "#6b7280"; ctx.fillRect(x - 2, ty + 2, 1, 1); ctx.fillRect(x, ty + 2, 1, 1); ctx.fillRect(x + 2, ty + 2, 1, 1); }
    else if (t === "heart") { ctx.fillStyle = "#f15a7a"; ctx.fillRect(x - 2, ty, 1, 1); ctx.fillRect(x + 1, ty, 1, 1); ctx.fillRect(x - 2, ty + 1, 4, 2); ctx.fillRect(x - 1, ty + 3, 2, 1); }
    else if (t === "spark") { ctx.fillStyle = "#f2c14e"; ctx.fillRect(x, ty - 1, 1, 5); ctx.fillRect(x - 2, ty + 1, 5, 1); }
    else if (t === "idea") { ctx.fillStyle = "#ffe06a"; ctx.fillRect(x - 1, ty, 3, 3); ctx.fillStyle = PX.out; ctx.fillRect(x, ty + 3, 1, 1); }
    else if (t === "sweat") { ctx.fillStyle = "#7fd0ff"; ctx.fillRect(x + 1, ty, 1, 2); ctx.fillRect(x, ty + 1, 2, 2); }
    else { ctx.fillStyle = "#6b7280"; ctx.fillRect(x - 1, ty, 3, 1); ctx.fillRect(x + 1, ty + 1, 1, 1); ctx.fillRect(x, ty + 2, 1, 1); ctx.fillRect(x, ty + 4, 1, 1); } // ?
  }
  /* cooking smoke from the Căng Tin chimney — the canteen is always making mì tôm */
  function drawSmoke(ctx, ts) {
    var cg = null, rooms = S().rooms; for (var i = 0; i < rooms.length; i++) if (rooms[i].key === "cangtin") { cg = rooms[i]; break; }
    if (!cg) return;
    var d = CONFIG.ROOMS.cangtin, cx = cg.x * T + d.w * T - 8, cy = cg.y * T - 3;
    for (var k = 0; k < 3; k++) {
      var t = ((ts / 750) + k / 3) % 1, px = (cx + Math.sin(ts / 300 + k * 2) * 2) | 0, py = (cy - t * 16) | 0, a = (1 - t) * 0.38, s = 1 + (t * 2.5 | 0);
      ctx.fillStyle = "rgba(222,222,222," + a.toFixed(2) + ")"; ctx.fillRect(px, py, s, s);
    }
  }
  /* butterflies drifting over the grounds — sunny ambient life */
  var FLYCOL = ["#fff4d6", "#f6c14e", "#f48fb1", "#9fd0ff"];
  function initFlyers() { flyers = []; for (var i = 0; i < 4; i++) flyers.push({ x: Math.random() * GW * T, y: 12 + Math.random() * GH * T * 0.7, vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.5, col: FLYCOL[i % FLYCOL.length], ph: Math.random() * 6.28 }); }
  function updateFlyers(ts) {
    for (var i = 0; i < flyers.length; i++) {
      var f = flyers[i]; f.x += f.vx; f.y += f.vy + Math.sin(ts / 180 + f.ph) * 0.18;
      if (f.x < 4 || f.x > GW * T - 4) f.vx *= -1;
      if (f.y < 10 || f.y > GH * T * 0.9) f.vy *= -1;
      if (Math.random() < 0.01) { f.vx = (Math.random() - 0.5) * 0.7; f.vy = (Math.random() - 0.5) * 0.5; } // flutter turn
    }
  }
  function drawFlyers(ctx, ts) {
    for (var i = 0; i < flyers.length; i++) {
      var f = flyers[i], x = f.x | 0, y = f.y | 0, flap = Math.sin(ts / 70 + f.ph) > 0;
      ctx.fillStyle = f.col;
      if (flap) { ctx.fillRect(x - 2, y - 1, 2, 2); ctx.fillRect(x + 1, y - 1, 2, 2); }
      else { ctx.fillRect(x - 1, y, 1, 2); ctx.fillRect(x + 1, y, 1, 2); }
      ctx.fillStyle = PX.out; ctx.fillRect(x, y, 1, 2);
    }
  }
  /* a wandering campus cat — pure "love watching" charm */
  function initCats() { var t = randWalkTile(); cats = [{ px: t[0] * T + 13, py: t[1] * T + 13, tx: t[0], ty: t[1], wait: 0 }]; }
  function updateCat(c, ts) {
    var tgx = c.tx * T + 13, tgy = c.ty * T + 13, dx = tgx - c.px, dy = tgy - c.py, d = Math.hypot(dx, dy);
    if (d < 1.5) { if (c.wait > 0) c.wait--; else { var n = randWalkTile(); c.tx = n[0]; c.ty = n[1]; c.wait = (Math.random() * 140) | 0; } c.moving = false; }
    else { c.px += (dx / d) * 0.6; c.py += (dy / d) * 0.6; c.dir = dx < 0 ? -1 : 1; c.moving = true; }
  }
  function drawCat(ctx, c, ts) {
    var x = c.px | 0, y = c.py | 0, col = "#e0944a", colD = "#c2762f", dir = c.dir || 1;
    ctx.fillStyle = "rgba(30,40,20,.22)"; ctx.fillRect(x - 4, y + 1, 9, 1);
    ctx.fillStyle = PX.out; ctx.fillRect(x - 4, y - 4, 9, 5);                 // body outline
    ctx.fillStyle = col; ctx.fillRect(x - 3, y - 3, 7, 3); ctx.fillStyle = colD; ctx.fillRect(x - 3, y - 1, 7, 1);
    ctx.fillStyle = PX.out; ctx.fillRect(x + 4 * dir - (dir < 0 ? 1 : 0), y - 6, 4, 4); // head (front)
    ctx.fillStyle = col; ctx.fillRect(x + 4 * dir + (dir < 0 ? 0 : 1) - (dir < 0 ? 1 : 0), y - 5, 2, 2);
    ctx.fillStyle = "#2a2330"; ctx.fillRect(x + 5 * dir, y - 5, 1, 1);          // eye
    ctx.fillStyle = PX.out; ctx.fillRect(x + 3 * dir, y - 7, 1, 1); ctx.fillRect(x + 6 * dir, y - 7, 1, 1); // ears
    ctx.fillStyle = col; ctx.fillRect(x - 5 * dir, y - 5, 1, 2); ctx.fillRect(x - 6 * dir, y - 6, 2, 1);   // tail
    ctx.fillStyle = PX.out; if (c.moving && Math.sin(ts / 140) > 0) { ctx.fillRect(x - 2, y + 1, 1, 1); ctx.fillRect(x + 2, y + 1, 1, 1); } else { ctx.fillRect(x - 1, y + 1, 1, 1); ctx.fillRect(x + 1, y + 1, 1, 1); }
  }
  // per-activity overlay — flat ops only, drawn for parked actors (≈ one room's worth at a time)
  function drawActivity(ctx, a, ts) {
    var x = a.px | 0, y = a.py | 0, ph = ts / 600 + a.ph, k; // overlays positioned for the 22px sprite (head ≈ y-14, hands ≈ y-9)
    if (a.act === "study") {
      ctx.fillStyle = "#f3ead0"; ctx.fillRect(x - 3, y - 10, 6, 4); ctx.fillStyle = PX.out; ctx.fillRect(x, y - 10, 1, 4);
      ctx.fillStyle = "#9c8657"; ctx.fillRect(x - 2, y - 9 + (Math.sin(ts / 300) > 0 ? 0 : 1), 4, 1);
    } else if (a.act === "daydream") {
      var d = (Math.sin(ph) * 0.5 + 0.5); ctx.globalAlpha = 0.5 + (1 - d) * 0.5; ctx.fillStyle = "#bfe0ff"; ctx.fillRect(x + 3, (y - 22 - d * 5) | 0, 2, 2); ctx.globalAlpha = 1;
    } else if (a.act === "eat") {
      ctx.fillStyle = "#e8dcc2"; ctx.fillRect(x - 3, y - 9, 6, 3); ctx.fillStyle = PX.out; ctx.fillRect(x - 3, y - 6, 6, 1);
      ctx.fillStyle = "rgba(255,255,255,.5)"; for (k = 0; k < 2; k++) { var sx = x - 1 + k * 2; ctx.fillRect((sx + Math.sin(ts / 200 + k) * 1.2) | 0, (y - 13 - (ts / 130 % 3)) | 0, 1, 2); }
    } else if (a.act === "tinker") {
      if ((Math.floor(ts / 150) + a.id) % 2 === 0) { var n = (a.tell === "spark") ? 3 : 2; ctx.fillStyle = "#ffd34a"; for (k = 0; k < n; k++) { var an = k * 2.2 + ts / 90; ctx.fillRect((x + Math.cos(an) * 5) | 0, (y - 9 + Math.sin(an) * 4) | 0, 1, 1); } }
    } else if (a.act === "perform") {
      ctx.fillStyle = PX.gold; ctx.fillRect(x + 3, (y - 24 + (Math.sin(ph) > 0 ? 0 : 1)) | 0, 2, 2); ctx.fillRect(x + 4, y - 27, 1, 3);
    } else if (a.act === "zzz") {
      var zy = (y - 24 - (Math.sin(ph) * 0.5 + 0.5) * 4) | 0;
      ctx.fillStyle = "#e2e9d4"; ctx.fillRect(x + 3, zy, 3, 1); ctx.fillRect(x + 5, zy + 1, 1, 1); ctx.fillRect(x + 3, zy + 2, 3, 1);
    }
  }
  // a little pickup football game on the Sân — the ball gets kicked around the pitch
  function updateBall(ts) {
    var san = null, rooms = S().rooms; for (var i = 0; i < rooms.length; i++) if (rooms[i].key === "san") { san = rooms[i]; break; }
    if (!san) { ball = null; return; }
    var d = CONFIG.ROOMS.san, x0 = san.x * T + 6, y0 = san.y * T + 6, x1 = (san.x + d.w) * T - 6, y1 = (san.y + d.h) * T - 6;
    if (!ball) ball = { px: (x0 + x1) / 2, py: (y0 + y1) / 2, tx: (x0 + x1) / 2, ty: (y0 + y1) / 2, wait: 0, hop: 0 };
    var dx = ball.tx - ball.px, dy = ball.ty - ball.py, dd = Math.hypot(dx, dy);
    if (dd < 2) { if (ball.wait > 0) ball.wait--; else { ball.tx = x0 + Math.random() * (x1 - x0); ball.ty = y0 + Math.random() * (y1 - y0); ball.wait = 8 + (Math.random() * 16 | 0); } } // "kicked" to a new spot
    else { ball.px += (dx / dd) * 1.8; ball.py += (dy / dd) * 1.8; }
    ball.hop = Math.abs(Math.sin(ts / 110)) * 5;
  }
  function drawBall(ctx) {
    if (!ball) return;
    var x = ball.px | 0, y = (ball.py - ball.hop) | 0;
    ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.fillRect(x - 2, (ball.py + 2) | 0, 5, 1);
    ctx.fillStyle = PX.out; ctx.fillRect(x - 2, y - 2, 6, 6);
    ctx.fillStyle = "#fff"; ctx.fillRect(x - 1, y - 2, 4, 6); ctx.fillRect(x - 2, y - 1, 6, 4);
    ctx.fillStyle = PX.out; ctx.fillRect(x, y, 1, 1); ctx.fillRect(x - 1, y + 1, 1, 1); ctx.fillRect(x + 2, y + 1, 1, 1); ctx.fillRect(x, y + 2, 1, 1); // pentagon spots
  }
  // chibi student — flat primitives only, no per-frame strings/gradients/save (60fps × 48)
  function drawActor(ctx, a, ts) {
    if (!ATLAS) return;
    var x = a.px | 0, y = a.py | 0;
    // soft pixel contact shadow
    ctx.fillStyle = "rgba(36,44,24,.22)"; ctx.fillRect(x - 5, y + 3, 10, 2); ctx.fillRect(x - 3, y + 5, 6, 1);
    var frame = a._moving ? (Math.sin(ts / 150 + a.ph) > 0 ? 0 : 1) : 0;
    var bob = (a.bob || 0) < -0.6 ? -1 : 0;
    var spr = ATLAS[a.grade - 1][a.variantIdx][frame];
    if (spr) ctx.drawImage(spr, x - 8, y - 20 + bob);
    // idle blink — eyes close briefly every few seconds when standing still
    if (!a._moving && !a.glasses && ((ts * 0.0009 + a.ph * 2) % 4.3) < 0.12) { ctx.fillStyle = a.skin; ctx.fillRect(x - 3, y - 14 + bob, 2, 2); ctx.fillRect(x + 1, y - 14 + bob, 2, 2); }
    if (a.special) { ctx.strokeStyle = PX.gold; ctx.lineWidth = 1; ctx.strokeRect(x - 6.5, y - 20.5, 13, 11); } // Mai Sương — gold frame
    if (a.hb) { ctx.fillStyle = PX.gold; ctx.fillRect(x - 1, y - 24, 2, 2); ctx.fillRect(x - 2, y - 23, 1, 1); ctx.fillRect(x + 1, y - 23, 1, 1); } // scholarship star
  }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  // make the current tap selection unmistakable on the map (mobile: small targets need a clear marker)
  function drawSelection(ctx, ts) {
    var pulse = 0.5 + 0.5 * Math.sin(ts / 220);
    if (selRoom) {
      var d = CONFIG.ROOMS[selRoom.key];
      if (d) {
        var rx = selRoom.x * T, ry = selRoom.y * T, rw = d.w * T, rh = d.h * T, c = 6;
        ctx.strokeStyle = "rgba(240,198,116," + (0.55 + 0.4 * pulse).toFixed(2) + ")"; ctx.lineWidth = 2;
        // corner brackets — read as "selected" without boxing in the art
        ctx.beginPath();
        ctx.moveTo(rx, ry + c); ctx.lineTo(rx, ry); ctx.lineTo(rx + c, ry);
        ctx.moveTo(rx + rw - c, ry); ctx.lineTo(rx + rw, ry); ctx.lineTo(rx + rw, ry + c);
        ctx.moveTo(rx + rw, ry + rh - c); ctx.lineTo(rx + rw, ry + rh); ctx.lineTo(rx + rw - c, ry + rh);
        ctx.moveTo(rx + c, ry + rh); ctx.lineTo(rx, ry + rh); ctx.lineTo(rx, ry + rh - c);
        ctx.stroke();
      }
    }
    if (selStudent != null) {
      var a = null; for (var si = 0; si < actors.length; si++) if (actors[si].id === selStudent) { a = actors[si]; break; }
      if (a) {
        var x = a.px | 0, y = a.py | 0;
        ctx.strokeStyle = "rgba(240,198,116," + (0.6 + 0.4 * pulse).toFixed(2) + ")"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(x, y + 4, 8, 3.5, 0, 0, 6.2832); ctx.stroke(); // feet ring
        var my = (y - 31 - 2 * pulse) | 0;                                         // bobbing overhead pointer
        ctx.fillStyle = PX.out; ctx.beginPath(); ctx.moveTo(x - 5, my - 1); ctx.lineTo(x + 5, my - 1); ctx.lineTo(x, my + 6); ctx.closePath(); ctx.fill();
        ctx.fillStyle = PX.gold; ctx.beginPath(); ctx.moveTo(x - 4, my); ctx.lineTo(x + 4, my); ctx.lineTo(x, my + 4); ctx.closePath(); ctx.fill();
      }
    }
  }

  // ---- static campus (lacquer-night diorama). Redrawn only on build; seeded → no flicker. ----
  function drawStatic() {
    var ctx = $("mapStatic").getContext("2d"), W = GW * T, H = GH * T;
    ctx.imageSmoothingEnabled = false;
    var rng = mb(1337), i, x, y;
    // PASS 1 — bright daytime grass (flat pixel base, no gloom)
    ctx.fillStyle = PX.grass; ctx.fillRect(0, 0, W, H);
    // PASS 2 — grass pixel texture: seeded tufts + dapple
    for (i = 0; i < 520; i++) {
      x = (rng() * W) | 0; y = (rng() * H) | 0; var r = rng();
      ctx.fillStyle = r < 0.5 ? PX.grassD : (r < 0.82 ? PX.grassL : PX.grassT);
      ctx.fillRect(x, y, r < 0.7 ? 1 : 2, 1);
    }
    for (i = 0; i < 70; i++) { x = (rng() * W) | 0; y = (rng() * H) | 0; ctx.fillStyle = PX.grassL; ctx.fillRect(x, y, 1, 2); ctx.fillRect(x - 1, y + 1, 1, 1); ctx.fillRect(x + 1, y + 1, 1, 1); } // little grass blades
    // PASS 3 — warm dirt path spine
    pathBand(ctx, 0, (GH >> 1) * T, W, T, true);
    pathBand(ctx, (GW >> 1) * T, 0, T, H, false);
    // rooms — y-sorted so lower buildings overlap upper
    var rooms = S().rooms.slice().sort(function (p, q) { return (p.y - q.y) || (p.x - q.x); });
    for (i = 0; i < rooms.length; i++) drawRoom(ctx, rooms[i]);
    // ambient props (seeded, capped, off walk lanes)
    drawProps(ctx, rng, rooms);
    // PASS 4 — gentle warm sun-vignette (light, not gloom): faintly brighten centre
    var vg = ctx.createRadialGradient(195, 130, 30, 195, 130, 260);
    vg.addColorStop(0, "rgba(255,250,220,.06)"); vg.addColorStop(1, "rgba(60,80,30,.10)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    // PASS 5 — seasonal décor (tracks the calendar via monthRollover's _mapDirty)
    drawSeason(ctx, W, H);
  }
  // seasonal dressing — Tết (Tháng 1–2) decks the campus in red & gold without touching buildings
  function drawSeason(ctx, W, H) {
    var m = S().month;
    if (m === 1 || m === 2) drawTet(ctx, W, H);
    else if (m === 6) drawJune(ctx, W, H); // Lễ Tốt Nghiệp — the campus dresses for graduation
  }
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
  function pathBand(ctx, x, y, w, h, horiz) {
    ctx.fillStyle = PX.pathD; roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 4); ctx.fill();
    ctx.fillStyle = PX.path; roundRect(ctx, x + 2, y + 2, w - 4, h - 5, 4); ctx.fill();
    ctx.fillStyle = PX.pathHi; ctx.fillRect(x + 3, y + 2, w - 6, 1);
    ctx.fillStyle = "rgba(120,90,50,.20)";
    if (horiz) { for (var px = x + 8; px < x + w - 4; px += 10) ctx.fillRect(px, y + 2, 1, h - 6); }
    else { for (var py = y + 8; py < y + h - 4; py += 10) ctx.fillRect(x + 2, py, w - 6, 1); }
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
  // ambient props — all static, seeded, capped, kept off the walk lanes so the little people stay visible
  function drawProps(ctx, rng, rooms) {
    var rowY = GH >> 1, colX = GW >> 1, i, x, y;
    for (i = 2; i < GW; i += 4) lamp(ctx, (i * T + T / 2) | 0, (rowY * T + T / 2 + 9) | 0);
    for (i = 3; i < GH; i += 4) lamp(ctx, (colX * T + T / 2) | 0, (i * T + T / 2 + 9) | 0);
    var ph = rooms.filter(function (r) { return r.key === "phonghoc"; })[0];
    if (ph) flagpole(ctx, ph.x * T - 1, (ph.y + CONFIG.ROOMS.phonghoc.h) * T);
    // gather free tiles (walkable, off the path spine), shuffle deterministically
    var free = [];
    for (x = 0; x < GW; x++) for (y = 0; y < GH; y++) { if (!(walk[x] && walk[x][y])) continue; if (y === rowY || x === colX) continue; free.push([x, y]); }
    for (i = free.length - 1; i > 0; i--) { var j = (rng() * (i + 1)) | 0, t = free[i]; free[i] = free[j]; free[j] = t; }
    var edge = function (t) { return t[0] < 2 || t[0] > GW - 3 || t[1] < 2 || t[1] > GH - 3; };
    var nT = 0; for (i = 0; i < free.length && nT < 5; i++) { var f = free[i]; if (!f.u && edge(f)) { tree(ctx, (f[0] * T + T / 2) | 0, (f[1] * T + T / 2 + 5) | 0); f.u = 1; nT++; } }   // trees hug the border
    var nB = 0; for (i = 0; i < free.length && nB < 5; i++) { f = free[i]; if (!f.u) { bush(ctx, (f[0] * T + T / 2) | 0, (f[1] * T + T / 2 + 4) | 0); f.u = 1; nB++; } }
    var nF = 0; for (i = 0; i < free.length && nF < 8; i++) { f = free[i]; if (!f.u) { flowers(ctx, (f[0] * T + T / 2) | 0, (f[1] * T + T / 2 + 6) | 0, rng); f.u = 1; nF++; } }
    var nBe = 0; for (i = 0; i < free.length && nBe < 3; i++) { f = free[i]; if (!f.u) { bench(ctx, (f[0] * T + T / 2) | 0, (f[1] * T + T / 2 + 3) | 0); f.u = 1; nBe++; } }
    // fountain centerpiece at the path plaza (skip if a room was built over it)
    if (walk[colX] && walk[colX][rowY]) fountain(ctx, (colX * T + T / 2) | 0, (rowY * T + T / 2) | 0);
    drawGate(ctx); // school entrance at the bottom of the path
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
  function drawTapFx(ctx, ts) {
    if (!tapFx) return;
    var age = ts - tapFx.t0;
    if (age < 0 || age > 380) { if (age > 380) tapFx = null; return; }
    var k = age / 380, rad = 4 + k * 13, al = (1 - k) * 0.8;
    ctx.strokeStyle = "rgba(240,198,116," + al.toFixed(2) + ")"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(tapFx.x, tapFx.y, rad, 0, 6.2832); ctx.stroke();
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
      if (res.ok) { var pk = placingKey, ded = CONFIG.ROOMS[pk] && CONFIG.ROOMS[pk].ded; placingKey = null; document.body.classList.remove("placing"); $("mapHint").textContent = ""; rebuildWalk(); drawStatic(); render(); if (ded) showDedication(ded); else toast("Đã xây xong."); }
      else toast(res.msg);
      return;
    }
    tapFx = { x: pt.px, y: pt.py, t0: (typeof performance !== "undefined" ? performance.now() : 0) }; // tap ripple feedback
    resolveTap(pt.px, pt.py, pt.gx, pt.gy);
  }
  function resolveTap(px, py, gx, gy) {
    // tap-the-world: inside a room the room wins unless you tap right on a student (9px);
    // on open grounds students grab a forgiving 14px (fingers are imprecise — the on-map
    // marker then confirms the hit, so a generous radius is safe).
    var r = roomAt(gx, gy);
    var a = nearestActor(px, py, r ? 9 : 14);
    if (a) { showInspectStudent(a.id); return; }
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
    selStudent = id; selRoom = null; // mark the selection on the map
    var ins = $("inspect");
    var hb = (st.flags && st.flags.hb) ? pantheonName(st.flags.hb) : null;
    var stars = "★".repeat(st.seed) + "☆".repeat(5 - st.seed);
    var lookIdx = (typeof st.look === "number" && st.look >= 0 && st.look < VARIANTS.length) ? st.look : hashId(st.id) % VARIANTS.length;
    ins.innerHTML =
      "<div class='ihead'><canvas id='iav' width='16' height='22' style='width:22px;height:30px;image-rendering:pixelated;background:" + (GRADE_C[st.grade] + "22") + ";border-radius:7px;flex-shrink:0'></canvas>" +
      "<div class='grow'><input id='renameIn' value='" + esc(st.ten).replace(/'/g, "&#39;") + "' maxlength='18' style='width:100%;box-sizing:border-box;background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--ink);border-radius:7px;padding:4px 7px;font-family:inherit;font-weight:700;font-size:12px'/>" +
      "<div class='imeta'>Năm " + st.grade + " · " + esc(TELL_TXT[st.tell] || TELL_TXT[""]) + (hb ? " · 🏵️ " + esc(hb) : "") + (st.ten === "Mai Sương" ? " · 🔧" : "") + "</div></div>" +
      "<button class='ix' id='lookBtn' title='Đổi kiểu'>🔄</button>" +
      "<button class='ix' id='ixBtn'>✕</button></div>" +
      "<div class='ibars'>" + ibar("Kiến thức", st.kt, "#bb6bd9") + ibar("Tay nghề", st.tn, "#6fcf97") + ibar("Sáng tạo", st.st, "#6aa9f0") + ibar("Cá mập", st.cm, "#f2994a") + ibar("Tâm trạng", st.mood, "#f2c14e") + "</div>" +
      "<div class='iflav'>Tiềm năng (hạt giống): " + stars + "</div>";
    if (ATLAS) { var cx = $("iav").getContext("2d"); cx.imageSmoothingEnabled = false; cx.drawImage(ATLAS[st.grade - 1][lookIdx][0], 0, 0); }
    $("ixBtn").onclick = hideInspect;
    $("renameIn").onchange = function () { var v = this.value.trim().slice(0, 18); if (v) { st.ten = v; syncActors(); renderPanel(); } };
    $("lookBtn").onclick = function () { st.look = (lookIdx + 1) % VARIANTS.length; syncActors(); showInspectStudent(id); };
    ins.classList.add("show"); $("mapHint").textContent = "";
  }
  function showDedication(dedKey) {
    var p = null; for (var i = 0; i < CONFIG.PANTHEON.length; i++) if (CONFIG.PANTHEON[i].key === dedKey) p = CONFIG.PANTHEON[i];
    if (!p) { toast("Đã khánh thành khu vườn."); return; }
    var w = el("div");
    w.appendChild(el("div", "kic", "🏵️ Khánh thành vườn tưởng niệm"));
    w.appendChild(el("h2", null, esc(p.name.replace("Học bổng ", ""))));
    w.appendChild(el("div", "lead", esc(p.line)));
    w.appendChild(el("div", "lead", "<span style='color:var(--gold)'>Trường của bạn vừa đặt câu hỏi của mình — <i>làm thế nào để có một 'Steve Jobs Việt Nam'?</i> — cạnh một người đã trả lời nó bằng cả đời mình.</span>"));
    var btn = el("button", "btn gold", "Khắc bia · +5 Uy Tín"); btn.style.width = "100%";
    btn.onclick = hideModal;
    w.appendChild(btn); openModal(w);
  }
  function showInspectRoom(r) {
    var d = CONFIG.ROOMS[r.key], sk = ROOM_SKIN[r.key] || { e: "▫" }, ins = $("inspect");
    selRoom = { x: r.x, y: r.y, key: r.key }; selStudent = null; // mark the selection on the map
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
  function hideInspect() { $("inspect").classList.remove("show"); selStudent = null; selRoom = null; }

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
    // phốt risk — qualitative (preserve mystery), surfaces the gamble as dodgy decisions pile up
    var phot = (s.photSeeds || []).reduce(function (a, p) { return a + (p.sev || 1); }, 0);
    if (phot > 0) {
      var lvl = phot >= 5 ? { e: "🔥", t: "Phốt sắp bung", c: "#eb6f6f" } : phot >= 3 ? { e: "⚠️", t: "Nhiều mầm phốt", c: "#f2994a" } : { e: "⚠️", t: "Có mầm phốt", c: "#f2c14e" };
      var pchip = el("div", "chip"); pchip.style.color = lvl.c; pchip.style.borderColor = lvl.c;
      pchip.innerHTML = lvl.e + " <span style='font-weight:700;font-size:10px'>" + lvl.t + "</span>";
      pchip.title = "Rủi ro phốt — những quyết định mờ ám đang tích lại"; stats.appendChild(pchip);
    }
    // meters
    var m = $("meters"); m.innerHTML = "";
    m.appendChild(meter("m-tt", "TIẾNG TĂM", s.tiengTam, 100));
    m.appendChild(meter("m-ut", "UY TÍN", s.uyTin, 100));
    m.appendChild(meter("m-tc", "THỰC CHẤT", s.thucChat, 100));
    // founding-milestone banner: the next un-earned goal (hidden once the build-up arc is done)
    var gb = $("goalBar"), ms = CONTENT.milestones || [], hit = (s.META.goalsHit || []), cur = null;
    for (var gi = 0; gi < ms.length; gi++) { if (hit.indexOf(ms[gi].key) < 0) { cur = ms[gi]; break; } }
    if (cur) { gb.innerHTML = "<span class='gt'>🎯 Cột mốc</span><span class='gl'>" + esc(cur.goal) + "</span>"; gb.classList.add("show"); }
    else gb.classList.remove("show");
    // celebrate a just-completed milestone (engine sets the flag; we toast + clear)
    if (s._milestoneJustHit) { toast("🎉 " + s._milestoneJustHit); s._milestoneJustHit = null; }
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

    // dedications — honour a real educator (late-game prestige + a question to put to the grounds)
    var dedKeys = ["vuontdn", "vuontqb", "vuonhxh"].filter(function (k) { return !s.rooms.some(function (r) { return r.key === k; }); });
    if (dedKeys.length) {
      var c3b = el("div", "card"); c3b.appendChild(el("h3", null, "Vinh danh nhà giáo dục"));
      c3b.appendChild(el("div", "tiny", "Dựng một khu vườn tưởng niệm — đặt câu hỏi của trường cạnh một người đã trả lời nó thật.")).style.marginBottom = "7px";
      var dgrid = el("div", "buildgrid");
      dedKeys.forEach(function (key) {
        var d = CONFIG.ROOMS[key], sk = ROOM_SKIN[key];
        var b = el("button", "build");
        b.innerHTML = "<div class='nm'>" + sk.e + " " + esc(d.name) + "</div><div class='ds'>" + esc(d.desc) + "</div><div class='pr'>−" + d.cost + "tr</div>";
        if (d.cost > s.cash) b.disabled = true;
        b.onclick = function () { placingKey = key; document.body.classList.add("placing"); $("mapHint").textContent = "Chạm vào khuôn viên để đặt " + d.name + " (" + d.w + "×" + d.h + ")."; toast("Chọn vị trí cho khu vườn."); };
        dgrid.appendChild(b);
      });
      c3b.appendChild(dgrid); wrap.appendChild(c3b);
    }

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
        b.onclick = function () { S().teachers.push({ id: t.id, ten: t.ten, day: t.day, dien: t.dien, luong: t.luong, trait: t.trait, bienChe: false, age: 0 }); toast("Đã tuyển " + t.ten + "."); HVS.checkMilestones(); render(); };
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
      var traj = (a.history && a.history.length > 1) ? "<div class='tiny' style='color:var(--faint);margin-top:2px;letter-spacing:1px'>" + a.history.map(function (h) { return (CONFIG.ALUM.CHIPS[h] || "").split(" ")[0]; }).join(" → ") + "</div>" : "";
      r.innerHTML = "<div class='av' style='background:rgba(255,255,255,.06)'>🎓</div><div class='grow'><div class='nm'>" + esc(a.ten) + " <span class='tiny'>· K" + a.gradYear + "</span></div><div class='meta'>" + esc(line) + "</div>" + traj + "</div><div class='" + chipCls + "'>" + CONFIG.ALUM.CHIPS[a.state] + "</div>";
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
    var reinvest = Math.max(0, Math.round((s.cash - CONFIG.CASH_KEEP) * CONFIG.CASH_DRAIN));
    if (reinvest > 0) c.appendChild(fundRow("🏫 Vận hành (tái đầu tư phần dư)", "−" + reinvest + "tr", "var(--red)"));
    var net = income + cpay - sal - maint - reinvest;
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
    // reset — wipe the save and reload the latest build (so changes show up from a clean start)
    var rc = el("div", "card"); rc.appendChild(el("h3", null, "Kiểm thử"));
    rc.appendChild(el("div", "tiny", "Xoá lưu và tải lại bản mới nhất để chơi lại từ con số 0.")).style.marginBottom = "8px";
    var rb = el("button", "btn", "🔄 Chơi lại từ đầu (xoá lưu)"); rb.style.width = "100%";
    rb.onclick = confirmReset;
    rc.appendChild(rb); wrap.appendChild(rc);

    var d = el("div", "card"); d.appendChild(el("div", "tiny", CONTENT.disclaimer));
    wrap.appendChild(d);
    return wrap;
  }
  function confirmReset() {
    var w = el("div");
    w.appendChild(el("div", "kic", "Kiểm thử"));
    w.appendChild(el("h2", null, "Chơi lại từ đầu?"));
    w.appendChild(el("div", "lead", "Xoá toàn bộ tiến trình hiện tại và tải lại bản mới nhất. Trường bắt đầu lại từ một khoảnh sân trống. Không thể hoàn tác."));
    var row = el("div"); row.style.display = "flex"; row.style.gap = "8px";
    var no = el("button", "btn ghost", "Huỷ"); no.style.flex = "1"; no.onclick = hideModal;
    var yes = el("button", "btn gold", "Xoá & chơi lại"); yes.style.flex = "1";
    yes.onclick = function () { resetting = true; try { localStorage.removeItem(CONFIG.SAVE_KEY); } catch (e) {} location.reload(); };
    row.appendChild(no); row.appendChild(yes); w.appendChild(row);
    openModal(w);
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
  // first-time intro — sets the satirical premise (shown once)
  function showIntro() {
    var w = el("div");
    w.appendChild(el("div", "kic", "Tháng 6, 2026 · đề Văn tốt nghiệp THPT"));
    w.appendChild(el("h2", null, "Học viện Steve"));
    CONTENT.boot.forEach(function (b) { w.appendChild(el("div", "lead", esc(b))); });
    w.appendChild(el("div", "lead", "<span style='color:var(--gold)'>Việc đầu tiên:</span> xây căn <b>Phòng học</b> đầu tiên (nút Xây), rồi đợi <b>tháng 7</b> — đợt chiêu sinh khóa đầu sẽ mở, Mai Sương sẽ là người ghi danh đầu tiên. Chạm vào sinh viên để xem (và đặt tên). Rồi ngồi xem trường lớn lên từ con số 0."));
    var foot = el("div", "tiny", CONTENT.disclaimer); foot.style.marginBottom = "10px"; w.appendChild(foot);
    var btn = el("button", "btn gold", "Đặt viên gạch đầu tiên →"); btn.style.width = "100%";
    btn.onclick = function () { try { S().META.tutorial = true; HVS.saveGame(); } catch (e) {} hideModal(); };
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
    tapTile: function (gx, gy) { resolveTap(gx * T + T / 2, gy * T + T / 2, gx, gy); return $("inspect").classList.contains("show") ? ($("inspect").querySelector(".iname") ? "room" : "student") : "none"; },
    _sel: function () { return { stu: selStudent, room: selRoom }; },
    _drawSel: function () { var ctx = $("mapLive").getContext("2d"); ctx.imageSmoothingEnabled = false; drawSelection(ctx, 800); },
    rooms: function () { return S().rooms.map(function (r) { return { key: r.key, x: r.x, y: r.y }; }); },
    // test hooks (headless rAF is throttled, so drive sync/walk manually): inspect actor
    // positions, force a roster sync, and step the walk N frames under a pinned period.
    _dbgActors: function () { return actors.map(function (a) { return { py: Math.round(a.py), arr: !!a._arriving, lv: !!a._leaving }; }); },
    _sync: function (init) { syncActors(init); },
    _bakeSheet: function () { var c = $("mapStatic"), X = c.getContext("2d"); X.imageSmoothingEnabled = false; X.fillStyle = "#79b34a"; X.fillRect(0, 0, c.width, c.height); var sc = 5, per = 5; for (var v = 0; v < ATLAS[0].length; v++) { var spr = ATLAS[0][v][0]; var col = v % per, row = (v / per) | 0; X.drawImage(spr, 8 + col * 76, 8 + row * 116, 16 * sc, 22 * sc); } },
    _steps: function (n, period) { var ts = 50000; for (var f = 0; f < (n || 60); f++) { ts += 16; for (var i = 0; i < actors.length; i++) updateActor(actors[i], true, ts, period || 0); } },
    // test hook: fast-forward the walk so a pinned period reaches its destinations (headless rAF is throttled)
    _settle: function (frames) { if (S()._mapDirty) { rebuildWalk(); drawStatic(); } var p = forcePeriod >= 0 ? forcePeriod : 0, ts = 20000; for (var i0 = 0; i0 < actors.length; i0++) actors[i0]._period = -99; for (var f = 0; f < (frames || 1500); f++) { ts += 16; for (var i = 0; i < actors.length; i++) updateActor(actors[i], true, ts, p); } }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
