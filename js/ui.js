/* ============================================================================
   Học viện Steve — js/ui.js
   Rendering only: Kairosoft campus (two canvases), HUD, panels, modals, sound.
   Reads state via HVS / __test; never owns game numbers (layer law).
   ========================================================================== */
(function () {
  "use strict";
  var T = CONFIG.TILE, GW = CONFIG.GRID_W, GH = CONFIG.GRID_H;
  // --- pixel-art layer (js/art.js, STRUCTURE-epic iter 57) bound into this closure ---
  var PX = ART.PX, ROOM_STYLE = ART.ROOM_STYLE, shade = ART.shade, glow = ART.glow, roundRect = ART.roundRect,
    drawJune = ART.drawJune, mortarboard = ART.mortarboard, drawTet = ART.drawTet, lampPost = ART.lampPost,
    lantern = ART.lantern, blossomPot = ART.blossomPot, pathBand = ART.pathBand, drawRoom = ART.drawRoom,
    roomLabel = ART.roomLabel, drawWindows = ART.drawWindows, drawRoof = ART.drawRoof, roofDepth = ART.roofDepth,
    drawGarden = ART.drawGarden, drawSan = ART.drawSan, drawGate = ART.drawGate, fountain = ART.fountain,
    bench = ART.bench, lamp = ART.lamp, flagpole = ART.flagpole, tree = ART.tree, bush = ART.bush, flowers = ART.flowers;
  var sfx = AUDIO.sfx; // audio layer lives in js/audio.js (STRUCTURE-epic iter 65)
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
    vuonhxh:  { c: "#8a2f5a", e: "🌸", g: "#ad3d77" },
    vuonntt:  { c: "#2f6b46", e: "🧭", g: "#3a875a" },
    vuoncva:  { c: "#7a5a2f", e: "🪶", g: "#9c7a3d" }
  };
  var GRADE_C = { 1: "#3fb98e", 2: "#4a8fe0", 3: "#f0a838", 4: "#a86fe0" }; // year uniform colours (richer, pop on grass)

  /* === PIXEL-ART v2: pre-baked character atlas (bake once → blit, fast at 48 actors) === */
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
    // Premium volumetric chibi (24×32). ONE light source upper-left. Every mass uses a 4-step ramp:
    // 1px lit rim (upper-left) -> core midtone -> one-step lower-right shade -> deep terminator.
    // 1px dark outline throughout. Feet sit on the bottom row so the foot point = canvas bottom.
    var sk = SKINS[V.s][0], skD = SKINS[V.s][1], skH = shade(sk, 0.16), skHH = shade(sk, 0.32), skT = shade(sk, -0.22);
    var hair = HAIRSET[V.h][0], hairHi = HAIRSET[V.h][1], hairD = shade(hair, -0.34), style = HAIRSTYLE[V.y], acc = ACC[V.a];
    var shirtH = shade(shirt, 0.30);   // lit rim (upper-left)
    var shirtSh = shade(shirt, -0.18); // one-step lower-right shade
    var shirtT = shade(shirt, -0.34);  // deep terminator at plane changes
    var collar = shade(shirt, -0.20);
    var pant = PX.pants, pantH = shade(PX.pants, 0.26), pantSh = shade(PX.pants, -0.20), pantT = shade(PX.pants, -0.44);
    var shoe = PX.shoe, shoeH = shade(PX.shoe, 0.30);
    var cv = document.createElement("canvas"); cv.width = 24; cv.height = 32;
    var X = cv.getContext("2d"); X.imageSmoothingEnabled = false;
    function R(x, y, w, h, c) { X.fillStyle = c; X.fillRect(x, y, w, h); }
    function P(x, y, c) { X.fillStyle = c; X.fillRect(x, y, 1, 1); }

    // CONTACT SHADOW — soft directional ellipse, grounds the figure on grass
    X.fillStyle = "rgba(20,30,14,.16)"; X.beginPath(); X.ellipse(13, 30.5, 9, 2.6, 0, 0, 6.2832); X.fill();
    X.fillStyle = "rgba(20,30,14,.22)"; X.beginPath(); X.ellipse(12, 30.5, 6.5, 1.8, 0, 0, 6.2832); X.fill();

    // HEAD — x6..17 (12 wide), y1..13
    R(6, 1, 12, 13, PX.out);
    R(7, 2, 10, 11, sk);
    X.clearRect(6, 1, 1, 1); X.clearRect(17, 1, 1, 1); X.clearRect(6, 13, 1, 1); X.clearRect(17, 13, 1, 1);
    P(7, 2, PX.out); P(16, 2, PX.out); P(6, 12, PX.out); P(17, 12, PX.out);
    R(7, 3, 1, 9, skH);             // lit left rim
    R(8, 2, 7, 1, skH);             // lit top rim
    P(8, 3, skHH); P(8, 2, skHH);   // brightest sparkle corner
    R(16, 3, 1, 9, skD);            // shaded right column
    R(14, 11, 3, 1, skD);           // shaded lower-right jaw
    R(8, 12, 8, 1, skT);            // chin terminator (deep)
    P(15, 3, shade(sk, -0.08));

    // HAIR (style-dependent; lit top-left, dark right)
    R(6, 1, 12, 3, hair);
    R(6, 4, 1, 2, hair); R(17, 4, 1, 2, hairD);
    R(7, 1, 9, 1, hairHi);
    P(7, 2, hairHi); P(8, 2, hairHi);
    R(16, 1, 1, 5, hairD);
    if (style === "short") {
      R(6, 4, 2, 1, hair); R(16, 4, 2, 1, hairD);
      P(8, 4, hairHi); P(9, 4, hair); P(14, 4, hairD); P(15, 4, hairD);
      P(11, 4, shade(hair, 0.12));
      P(7, 5, hair); P(16, 5, hairD);
    } else if (style === "long") {
      R(6, 4, 1, 9, hair); R(17, 4, 1, 9, hairD);
      R(7, 4, 1, 2, hair); R(16, 4, 1, 2, hairD);
      P(6, 13, hair); P(17, 13, hairD); P(7, 12, hair); P(16, 12, hairD);
    } else { // bun
      R(10, -1, 4, 2, hair); R(10, -1, 3, 1, hairHi); P(13, 0, hairD);
      R(6, 4, 2, 1, hair); R(16, 4, 2, 1, hairD); P(8, 4, hair); P(15, 4, hairD);
    }

    // FACE
    P(8, 5, hairD); P(9, 5, hairD); P(13, 5, hairD); P(14, 5, hairD);
    R(8, 6, 3, 3, PX.out); R(13, 6, 3, 3, PX.out);
    R(9, 7, 2, 2, "#6a86c8"); R(14, 7, 2, 2, "#6a86c8");
    R(9, 8, 2, 1, "#3a558f"); R(14, 8, 2, 1, "#3a558f");
    P(9, 7, "#ffffff"); P(14, 7, "#ffffff");
    P(10, 8, "#1c2742"); P(15, 8, "#1c2742");
    P(7, 9, "#ef968a"); P(8, 9, "#f4a89a"); P(15, 9, "#ef968a"); P(16, 9, "#f4a89a");
    P(12, 9, shade(sk, -0.16));
    R(10, 11, 4, 1, PX.mouth); P(10, 11, shade(PX.mouth, -0.24)); P(13, 11, shade(PX.mouth, -0.24));
    P(11, 12, "#d27668"); P(12, 12, "#d27668");

    // ACCESSORY
    if (acc === "glasses") {
      R(7, 6, 4, 3, PX.out); R(13, 6, 4, 3, PX.out); R(11, 7, 2, 1, PX.out);
      R(8, 7, 2, 1, "#bfe0ff"); R(14, 7, 2, 1, "#bfe0ff");
      P(8, 7, "#eaf6ff"); P(14, 7, "#eaf6ff");
      P(7, 8, shade("#bfe0ff", -0.2)); P(16, 8, shade("#bfe0ff", -0.2));
    } else if (acc === "bow") {
      R(5, 2, 3, 3, "#f15a7a"); R(5, 2, 1, 3, "#d63f5e"); P(7, 3, "#ff8aa0"); P(6, 3, "#ffb3c2"); P(7, 2, "#ffc4d0");
    } else if (acc === "cap") {
      R(6, 0, 12, 2, "#4a8fe0"); R(7, -1, 9, 1, "#5b9ff0"); R(16, 1, 1, 2, "#3a78c8");
      R(17, 2, 4, 1, "#4a8fe0"); R(17, 3, 4, 1, "#3a78c8");
      P(7, 0, "#7ab4f5"); P(8, 0, "#7ab4f5");
    }

    // NECK
    R(10, 13, 4, 2, PX.out); R(11, 13, 2, 1, sk); R(11, 14, 2, 1, skT);

    // TORSO + SHORT SLEEVES
    R(4, 15, 16, 4, PX.out);
    R(6, 18, 12, 8, PX.out);
    R(7, 16, 10, 9, shirt);
    R(5, 16, 2, 2, shirt);
    R(17, 16, 2, 2, shirt);
    X.clearRect(4, 15, 1, 1); X.clearRect(19, 15, 1, 1);
    P(5, 15, PX.out); P(18, 15, PX.out);
    R(5, 18, 2, 1, shirtT); R(16, 18, 2, 1, shade(shirtT, -0.04));
    R(9, 15, 6, 1, collar); R(10, 16, 4, 1, shade(collar, -0.24));
    P(11, 15, sk); P(12, 15, sk); P(9, 16, collar); P(14, 16, collar);
    R(5, 16, 1, 2, shirtH); R(7, 16, 1, 9, shirtH);
    R(5, 16, 3, 1, shirtH); R(7, 16, 7, 1, shirtH);
    P(5, 16, shade(shirt, 0.42)); P(7, 16, shade(shirt, 0.42));
    R(15, 17, 1, 8, shirtSh);
    R(16, 17, 1, 8, shirtT);
    R(18, 16, 1, 2, shirtSh);
    R(8, 24, 8, 1, shirtT);
    R(13, 21, 2, 3, shirtSh);

    // HANDS
    R(4, 21, 2, 3, PX.out); R(5, 22, 1, 1, sk); P(5, 22, skH);
    R(18, 21, 2, 3, PX.out); R(18, 22, 1, 1, skD);

    // LEGS + SHOES (2 walk frames)
    function leg(lx, top) {
      R(lx, top, 4, 31 - top, PX.out);
      R(lx + 1, top, 2, 30 - top, pant);
      P(lx + 1, top, pantH);
      R(lx + 1, top, 1, 30 - top, shade(pant, 0.10));
      R(lx + 2, top + 1, 1, 29 - top, pantSh);
      R(lx + 1, top, 2, 1, pantT);
    }
    if (frame === 0) {
      leg(7, 26); leg(13, 26);
      R(7, 30, 4, 1, shoe); R(13, 30, 4, 1, shoe);
      P(7, 30, shoeH); P(13, 30, shoeH);
    } else {
      leg(7, 26); leg(13, 25);
      R(7, 29, 4, 1, shoe); R(13, 30, 4, 1, shoe);
      P(7, 29, shoeH); P(13, 30, shoeH);
    }

    return cv;
  }
  function buildAtlas() {
    ATLAS = [];
    for (var g = 0; g < 4; g++) { ATLAS[g] = []; var sh = shade(GRADE_C[g + 1], -0.28); for (var v = 0; v < VARIANTS.length; v++) { ATLAS[g][v] = []; for (var fr = 0; fr < 2; fr++) ATLAS[g][v][fr] = bakeChar(GRADE_C[g + 1], sh, VARIANTS[v], fr); } }
  }
  // player-customized looks (arbitrary skin/hair/style/accessory combos) — baked on demand + cached
  var customCache = {};
  function clampLook(lc) { return { s: ((lc.s % SKINS.length) + SKINS.length) % SKINS.length, h: ((lc.h % HAIRSET.length) + HAIRSET.length) % HAIRSET.length, y: ((lc.y % HAIRSTYLE.length) + HAIRSTYLE.length) % HAIRSTYLE.length, a: ((lc.a % ACC.length) + ACC.length) % ACC.length }; }
  function customSprite(grade, lc, frame) {
    var c = clampLook(lc), key = grade + ":" + c.s + "." + c.h + "." + c.y + "." + c.a + ":" + frame;
    if (!customCache[key]) customCache[key] = bakeChar(GRADE_C[grade], shade(GRADE_C[grade], -0.28), c, frame);
    return customCache[key];
  }
  // the effective look object {s,h,y,a} for a student: their custom override, else their VARIANT
  function effLook(st) { return st.lookC || VARIANTS[(typeof st.look === "number" && st.look >= 0 && st.look < VARIANTS.length) ? st.look : hashId(st.id) % VARIANTS.length]; }

  /* === ART: Sơn Mài Diorama (lacquer-night campus, gold-leaf pavilions) === */
  // per-room style: wall hue, roof silhouette, window temperature, gable sigil, short map label
  function mb(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hashId(id) { return (Math.imul(id, 2654435761) >>> 0); }

  /* ---------------- boot ---------------- */
  var tab = "ops", placingKey = null, lastSig = "";
  var selStudent = null, selRoom = null; // what the player has tapped (drives the on-map selection marker)
  var tapFx = null; // transient tap ripple (immediate touch feedback on mobile)
  // "buy → it just appears": no manual placement — the building drops into the next tidy spot,
  // briefly flashing so you can see where it landed.
  function buyRoom(key) {
    var res = HVS.autoPlace(key);
    if (!res.ok) { toast(res.msg); return; }
    var d = CONFIG.ROOMS[key], ded = d && d.ded;
    var spot = null; for (var i = 0; i < S().rooms.length; i++) if (S().rooms[i].key === key) spot = S().rooms[i]; // the one on the map (built or upgraded)
    rebuildWalk(); drawStatic(); render();
    if (spot) { selRoom = { x: spot.x, y: spot.y, key: spot.key }; selStudent = null; } // flash where it is
    if (ded) { showDedication(ded); sfx("chime"); }
    else if (res.upgrade) { toast("⬆️ Nâng cấp " + d.name + " lên Lv" + res.level + "."); sfx("chime"); }
    else { toast("Đã xây " + d.name + "."); sfx("build"); }
  }
  var resetting = false; // set when wiping the save → blocks autosave so the reset actually sticks
  var actors = [], walk = null, ringsByKey = {}, curPeriod = -1, forcePeriod = -1, cats = [], ball = null, flyers = [], clouds = [], fest = [];
  // campus-life day clock: 5 real-time periods × 16s = 80s day (animates even while paused, for chill ambiance)
  var PERIOD_MS = 16000, N_PERIODS = 5; // 0 class · 1 recess · 2 lunch · 3 afternoon · 4 tan học
  // gentle time-of-day warmth per period (low alpha, warm — never darkens the sunny look)
  // time-of-day arc (kept light — sunny, never dark): fresh cool morning → bright noon → golden afternoon/evening
  var TINTS = ["rgba(208,224,255,.05)", "rgba(255,252,236,.03)", "rgba(255,248,222,.04)", "rgba(255,206,138,.11)", "rgba(255,170,98,.16)"];

  // the build the browser actually loaded (from ui.js's own ?v= cache-bust) — ground truth of what's running
  var BUILD = (function () { try { var s = document.querySelector('script[src*="ui.js"]'); var m = s && s.src.match(/[?&]v=(\d+)/); return m ? m[1] : "dev"; } catch (e) { return "dev"; } })();
  var saveIsOld = false;
  function buildLabel() {
    if (BUILD === "dev") return "dev";
    try { var d = new Date(+BUILD); var p = function (n) { return (n < 10 ? "0" : "") + n; }; return p(d.getHours()) + ":" + p(d.getMinutes()) + " " + p(d.getDate()) + "/" + p(d.getMonth() + 1); } catch (e) { return BUILD; }
  }
  // AUTO-UPDATE: GitHub Pages caches index.html (max-age 600), so a plain refresh can keep serving an
  // old build's ?v= script tags. On load we fetch a fresh index.html (cache-busted), read the live
  // build, and if it's newer than what's running, hop to it via a cache-busting URL — so every refresh
  // lands on the latest deploy without any manual cache-clearing. Converges (no reload loop).
  function checkForUpdate() {
    if (location.protocol === "file:" || BUILD === "dev" || typeof fetch !== "function") return;
    var run = parseInt(BUILD, 10); if (!run) return;
    fetch(location.pathname + "?_fresh=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (html) {
        var m = html.match(/ui\.js\?v=(\d+)/);
        if (!m) return;
        var latest = parseInt(m[1], 10);
        if (latest > run) {
          var key = "hvs_upd_" + latest; // guard: hop to a given build at most once per session (no loop)
          try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch (e) {}
          location.replace(location.pathname + "?b=" + latest); // jump to the fresh build
        }
      }).catch(function () {});
  }
  function boot() {
    checkForUpdate(); // if a newer build is live, hop to it so a refresh always shows the latest
    if (!HVS.loadGame()) { /* fresh already set */ }
    var q = location.search.match(/seed=(\d+)/);
    if (q && (!localStorage.getItem(CONFIG.SAVE_KEY))) HVS.freshState(parseInt(q[1], 10));
    var sb = S().META.build; saveIsOld = !!(sb && sb !== BUILD); // running newer code than the save was written under
    S().META.build = BUILD;
    AUDIO.init();
    $("schoolSub").textContent = CONTENT.schoolSub;
    buildSpeeds(); buildTabs();
    buildAtlas(); // bake pixel-art sprite atlas once
    rebuildWalk(); syncActors(true); initCats(); initFlyers(); initClouds();
    drawStatic(); render(); requestAnimationFrame(liveLoop);
    $("mapHint").textContent = "Chạm vào sinh viên hoặc phòng để xem chi tiết.";
    // font gate: redraw the static layer once 'Be Vietnam Pro' is ready so room labels aren't a fallback face
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { S()._mapDirty = true; });
    setInterval(loopTick, CONFIG.TICK_MS);
    setInterval(function () { if (!resetting) HVS.saveGame(); }, 4000);
    $("soundBtn").onclick = AUDIO.toggle;
    $("mapStatic").addEventListener("click", onMapClick);
    document.addEventListener("visibilitychange", function () { if (document.hidden && !resetting) HVS.saveGame(); });
    // autoplay-unlock: browsers block audio until a gesture; start (or resume persisted) music on first tap
    var unlock = function () { if (AUDIO.isOn()) AUDIO.start(); document.removeEventListener("pointerdown", unlock); };
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
      a.grade = s.grade; a.bodyC = GRADE_C[s.grade] || "#9aa4b2"; a.special = (s.ten === "Mai Sương"); a.hb = !!(s.flags && s.flags.hb); a.fav = (S().META.favId === s.id);
      a.tell = s.tell || ""; a.seed = s.seed;
      a.variantIdx = (typeof s.look === "number" && s.look >= 0 && s.look < VARIANTS.length) ? s.look : hashId(s.id) % VARIANTS.length;
      a.lookC = s.lookC || null; // player-customized override (else the VARIANT)
      var el0 = a.lookC ? clampLook(a.lookC) : VARIANTS[a.variantIdx];
      a.skin = SKINS[el0.s][0]; a.glasses = ACC[el0.a] === "glasses";
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
    stepLive(ts, period, alive); // advance positions/ball/cats/flyers
    drawLive(ctx, ts, period);   // paint the campus (shared with the headless _renderLiveOnce hook)
    requestAnimationFrame(liveLoop);
  }
  // step + draw split so a single live frame can be rendered ON DEMAND (headless rAF is throttled,
  // so actors never paint in screenshots otherwise — _renderLiveOnce drives drawLive once).
  function stepLive(ts, period, alive) {
    var i;
    for (i = 0; i < actors.length; i++) updateActor(actors[i], alive, ts, period);
    if (period === 1 && alive) updateBall(ts);
    for (i = 0; i < cats.length; i++) if (alive) updateCat(cats[i], ts);
    if (alive) updateFlyers(ts);
    if (alive) updateClouds(ts);
    if (alive) updateFest(ts);
  }
  function drawLive(ctx, ts, period) {
    var i;
    drawClouds(ctx);  // soft cloud-shadows drifting over the grounds, beneath the actors
    actors.sort(function (a, b) { return a.py - b.py; });
    for (i = 0; i < actors.length; i++) { drawActor(ctx, actors[i], ts); if (actors[i]._atDest && actors[i].act) drawActivity(ctx, actors[i], ts); if (actors[i].emote) drawEmote(ctx, actors[i].emote, actors[i].px | 0, actors[i].py | 0); }
    drawSelection(ctx, ts); // on-map marker for the tapped student/room
    drawTapFx(ctx, ts);     // expanding ripple at the last tap (touch feedback)
    if (period === 1) drawBall(ctx); // pickup football at recess
    for (i = 0; i < cats.length; i++) drawCat(ctx, cats[i], ts);
    drawFlyers(ctx, ts);
    drawSmoke(ctx, ts);
    if (period >= 3) { // golden-hour: warm directional light from the low sun (upper-left), strongest at tan học
      var sunR = GW * T * 0.95, ga = (period === 4) ? 0.17 : 0.085;
      var gh = ctx.createRadialGradient(GW * T * 0.16, GH * T * 0.08, 0, GW * T * 0.16, GH * T * 0.08, sunR);
      gh.addColorStop(0, "rgba(255,198,112," + ga + ")"); gh.addColorStop(1, "rgba(255,150,70,0)");
      ctx.fillStyle = gh; ctx.fillRect(0, 0, GW * T, GH * T);
    }
    ctx.fillStyle = TINTS[period] || TINTS[2]; ctx.fillRect(0, 0, GW * T, GH * T); // time-of-day warmth (subtle, never dark)
    drawFest(ctx, ts); // festive petals (Tết) / confetti (June) fall in front of everything
  }
  // schedule: students are routed to the right room's door-ring each period, then do the activity
  function assignActivity(a, period) {
    var roomKey = null, act = null, duAn = (S().month >= 2 && S().month <= 5);
    if (period === 0) { roomKey = "phonghoc"; act = (a.tell === "sky") ? "daydream" : "study"; }
    else if (period === 1) { roomKey = "san"; act = (a.tell === "hype") ? "perform" : "recess"; }
    else if (period === 2) { roomKey = "cangtin"; act = "eat"; }
    else if (period === 3) {
      // afternoon KHOA PRACTICUM — each major works in its own room, its own way (read a khoa by watching)
      if (a.tell === "hype") { roomKey = "lab"; act = "stream"; }                     // Sống Ảo: livestreams instead of building (satire)
      else if (a.tell === "spark") { roomKey = "phongmay"; act = "code"; }            // Lập trình: heads-down at a monitor
      else if (a.tell === "sky") { roomKey = "xuong"; act = "craft"; }                // Thiết kế Chế tạo: sawing/shaping a workpiece
      else if (a.grade === 4) { roomKey = duAn ? "xuong" : "phongmay"; act = "tinker"; }
      else { roomKey = "lab"; act = "study"; }
    }
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
    if (a.act === "code") return Math.random() < 0.55 ? "idea" : "dots";   // debugging the loop
    if (a.act === "craft") return Math.random() < 0.6 ? "spark" : "idea";  // sparks off the workpiece
    if (a.act === "stream") return Math.random() < 0.6 ? "heart" : "spark"; // likes + clout
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
  /* soft cloud-shadows drifting across the grounds — sunny-day "alive" ambience (never darkens, just passes) */
  function initClouds() {
    clouds = [];
    for (var i = 0; i < 4; i++) clouds.push({ x: (Math.random() * (GW + 4) - 2) * T, y: (0.1 + Math.random() * 0.7) * GH * T, r: 54 + Math.random() * 50, v: 0.07 + Math.random() * 0.06 });
  }
  function updateClouds(ts) {
    for (var i = 0; i < clouds.length; i++) { var c = clouds[i]; c.x += c.v; if (c.x - c.r > GW * T) { c.x = -c.r; c.y = (0.1 + Math.random() * 0.7) * GH * T; c.r = 52 + Math.random() * 48; } }
  }
  function drawClouds(ctx) {
    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i], g = ctx.createRadialGradient(c.x, c.y, c.r * 0.18, c.x, c.y, c.r);
      g.addColorStop(0, "rgba(26,36,16,.13)"); g.addColorStop(1, "rgba(26,36,16,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(c.x, c.y, c.r, c.r * 0.6, 0, 0, 6.2832); ctx.fill();
    }
  }
  /* festive falling particles — Tết blossom petals (đào/mai) and June graduation confetti; keyed to the calendar */
  var FEST_PETAL = ["#ffc0d0", "#ff9ec0", "#ffd24a", "#ffe07a"]; // đào pink + mai yellow
  var FEST_CONF = ["#e0584a", "#f2c14e", "#5fd0c5", "#4a8fe0", "#b48ef0", "#ffffff"]; // graduation confetti
  function festMode() { var m = S().month; return (m === 1 || m === 2) ? "tet" : (m === 6 ? "june" : null); }
  function newFestP(conf) {
    var pal = conf ? FEST_CONF : FEST_PETAL;
    return { x: Math.random() * GW * T, y: Math.random() * (GH * T + 12) - 6, vy: (conf ? 0.4 : 0.22) + Math.random() * 0.35,
      sway: 0.4 + Math.random() * 0.7, ph: Math.random() * 6.28, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.22,
      c: pal[(Math.random() * pal.length) | 0], s: conf ? 2 + (Math.random() * 2 | 0) : 2, conf: conf };
  }
  function updateFest(ts) {
    var mode = festMode();
    if (!mode) { if (fest.length) fest = []; return; }
    var conf = mode === "june", target = conf ? 30 : 22;
    while (fest.length < target) fest.push(newFestP(conf));
    for (var i = 0; i < fest.length; i++) {
      var p = fest[i]; p.y += p.vy; p.x += Math.sin(ts / 600 + p.ph) * p.sway * 0.5; p.rot += p.vr;
      if (p.y > GH * T + 6) { var np = newFestP(p.conf); np.y = -6; fest[i] = np; } // recycle from the top
    }
  }
  function drawFest(ctx, ts) {
    if (!fest.length && festMode()) updateFest(ts); // populate on first paint (real play populates via stepLive)
    for (var i = 0; i < fest.length; i++) {
      var p = fest[i], x = p.x | 0, y = p.y | 0;
      ctx.fillStyle = p.c;
      if (p.conf) { var w = 1 + (Math.abs(Math.cos(p.rot)) * p.s | 0); ctx.fillRect(x, y, w, p.s); } // tumbling confetti (width flutters)
      else { ctx.fillRect(x, y, 2, 2); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(x + (Math.sin(p.rot) > 0 ? 2 : -1), y, 1, 1); } // soft petal + glint
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
    } else if (a.act === "code") {
      // Lập trình: heads-down at a glowing monitor, code scrolling line by line
      ctx.fillStyle = PX.out; ctx.fillRect(x - 4, y - 13, 9, 8);                      // monitor bezel
      ctx.fillStyle = "#0e2019"; ctx.fillRect(x - 3, y - 12, 7, 5);                   // dark screen
      ctx.fillStyle = "#5fe08a"; for (k = 0; k < 3; k++) { var lw = 2 + ((Math.floor(ts / 200) + k + a.id) % 5); ctx.fillRect(x - 3, y - 11 + k * 2, lw > 6 ? 6 : lw, 1); } // green code lines
      ctx.fillStyle = (Math.floor(ts / 350) % 2) ? "#9fe8c0" : "#0e2019"; ctx.fillRect(x + 3, y - 7, 1, 1); // blinking cursor
      ctx.fillStyle = "#2a2a33"; ctx.fillRect(x - 4, y - 5, 9, 1);                    // keyboard ledge
    } else if (a.act === "craft") {
      // Thiết kế Chế tạo: shaping a workpiece — a plank and a sliding saw, sawdust spraying off
      ctx.fillStyle = "#9a6238"; ctx.fillRect(x - 5, y - 9, 10, 2); ctx.fillStyle = "#caa46a"; ctx.fillRect(x - 5, y - 9, 10, 1); // plank (lit top)
      var sx2 = (x - 2 + Math.sin(ts / 110) * 3) | 0; ctx.fillStyle = "#cdd2d8"; ctx.fillRect(sx2, y - 11, 4, 1); ctx.fillStyle = PX.out; ctx.fillRect(sx2 + 4, y - 11, 1, 2); // saw blade + handle
      if ((Math.floor(ts / 110) + a.id) % 2 === 0) { ctx.fillStyle = "#e8d2a0"; for (k = 0; k < 3; k++) { var an = k * 2.1 + ts / 95; ctx.fillRect((x + Math.cos(an) * 5) | 0, (y - 7 + Math.sin(an) * 3) | 0, 1, 1); } } // sawdust motes
    } else if (a.act === "stream") {
      // Sống Ảo: filming a livestream — ring-light glow, a phone held up with a blinking REC dot, rising likes
      ctx.fillStyle = "rgba(255,240,180,.16)"; ctx.fillRect(x - 6, y - 16, 13, 11);  // ring-light wash
      ctx.fillStyle = PX.out; ctx.fillRect(x + 3, y - 13, 5, 8);                       // phone body, held up to the face
      ctx.fillStyle = (Math.floor(ts / 320) % 2) ? "#bfe9ff" : "#8fc8ef"; ctx.fillRect(x + 4, y - 12, 3, 6); // glowing screen
      ctx.fillStyle = "#e0392f"; if (Math.floor(ts / 400) % 2) ctx.fillRect(x + 4, y - 12, 1, 1);            // blinking REC dot
      var hy = (y - 15 - (ts / 130 % 9)) | 0;                                          // like-hearts floating up
      ctx.fillStyle = "#f15a7a"; ctx.fillRect((x - 5 + Math.sin(ts / 200) * 1.5) | 0, hy, 2, 2);
      ctx.fillStyle = "#f2c14e"; ctx.fillRect((x - 7 + Math.sin(ts / 165 + 1) * 1.5) | 0, (hy + 4) | 0, 1, 1);
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
    // (contact shadow is baked into the 24×32 sprite now)
    var frame = a._moving ? (Math.sin(ts / 150 + a.ph) > 0 ? 0 : 1) : 0;
    var bob = (a.bob || 0) < -0.6 ? -1 : 0;
    var spr = a.lookC ? customSprite(a.grade, a.lookC, frame) : ATLAS[a.grade - 1][a.variantIdx][frame];
    if (spr) ctx.drawImage(spr, x - 12, y - 30 + bob); // 24×32 sprite; feet at (x,y)
    // idle blink — eyes close briefly every few seconds when standing still (eyes at canvas y6-8 → screen y-24)
    if (!a._moving && !a.glasses && ((ts * 0.0009 + a.ph * 2) % 4.3) < 0.12) { ctx.fillStyle = a.skin; ctx.fillRect(x - 4, y - 24 + bob, 3, 3); ctx.fillRect(x + 1, y - 24 + bob, 3, 3); }
    if (a.special) { ctx.strokeStyle = PX.gold; ctx.lineWidth = 1; ctx.strokeRect(x - 7.5, y - 30.5, 15, 14); } // Mai Sương — gold frame
    if (a.hb) { ctx.fillStyle = PX.gold; ctx.fillRect(x - 1, y - 34, 2, 2); ctx.fillRect(x - 2, y - 33, 1, 1); ctx.fillRect(x + 1, y - 33, 1, 1); } // scholarship star
    if (a.fav) { // followed student — a persistent gold star bobbing overhead so you can find your protégé
      var fsy = (y - 39 + Math.sin(ts / 300 + a.ph) * 1.2) | 0;
      ctx.fillStyle = PX.out; ctx.fillRect(x - 1, fsy - 2, 3, 6); ctx.fillRect(x - 3, fsy, 7, 2);
      ctx.fillStyle = PX.gold; ctx.fillRect(x, fsy - 2, 1, 5); ctx.fillRect(x - 2, fsy, 5, 1); ctx.fillRect(x - 1, fsy - 1, 3, 2);
      ctx.fillStyle = "#fff3c0"; ctx.fillRect(x, fsy - 1, 1, 1);
    }
  }
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
        var my = (y - 41 - 2 * pulse) | 0;                                         // bobbing overhead pointer (above the 24×32 head)
        ctx.fillStyle = PX.out; ctx.beginPath(); ctx.moveTo(x - 5, my - 1); ctx.lineTo(x + 5, my - 1); ctx.lineTo(x, my + 6); ctx.closePath(); ctx.fill();
        ctx.fillStyle = PX.gold; ctx.beginPath(); ctx.moveTo(x - 4, my); ctx.lineTo(x + 4, my); ctx.lineTo(x, my + 4); ctx.closePath(); ctx.fill();
      }
    }
  }

  // ---- static campus (lacquer-night diorama). Redrawn only on build; seeded → no flicker. ----
  // campus prestige tier (0 raw → 2 prestigious) — monotonic so the upgraded look never flickers back
  function campusTier() {
    var s = S(), gardens = 0, other = 0, i;
    for (i = 0; i < s.rooms.length; i++) { var d = CONFIG.ROOMS[s.rooms[i].key]; if (d && d.ded) gardens++; else other++; }
    if (gardens >= 1 || (s.META.steves || 0) >= 1 || (s.META.graduated || 0) >= 20) return 2; // prestigious
    if (other >= 3) return 1; // established (built out the basics)
    return 0;
  }
  function drawStatic() {
    var ctx = $("mapStatic").getContext("2d"), W = GW * T, H = GH * T;
    ctx.imageSmoothingEnabled = false;
    var rng = mb(1337), i, x, y, tier = campusTier();
    // PASS 1 — bright daytime grass (flat pixel base, no gloom)
    ctx.fillStyle = tier >= 1 ? PX.grassL : PX.grass; ctx.fillRect(0, 0, W, H); // a touch brighter once established
    // PASS 2 — grass pixel texture: seeded tufts + dapple
    for (i = 0; i < (tier >= 1 ? 360 : 520); i++) { // fewer weeds as the grounds get tended
      x = (rng() * W) | 0; y = (rng() * H) | 0; var r = rng();
      ctx.fillStyle = r < 0.5 ? PX.grassD : (r < 0.82 ? PX.grassL : PX.grassT);
      ctx.fillRect(x, y, r < 0.7 ? 1 : 2, 1);
    }
    for (i = 0; i < 70; i++) { x = (rng() * W) | 0; y = (rng() * H) | 0; ctx.fillStyle = PX.grassL; ctx.fillRect(x, y, 1, 2); ctx.fillRect(x - 1, y + 1, 1, 1); ctx.fillRect(x + 1, y + 1, 1, 1); } // little grass blades
    if (tier >= 1) { ctx.fillStyle = "rgba(255,255,255,.05)"; for (y = 8; y < H; y += 16) ctx.fillRect(0, y, W, 3); } // manicured mow stripes
    // PASS 3 — path spine (dirt → stone-edged → fully paved as the school's value rises)
    pathBand(ctx, 0, (GH >> 1) * T, W, T, true, tier);
    pathBand(ctx, (GW >> 1) * T, 0, T, H, false, tier);
    // rooms — y-sorted so lower buildings overlap upper
    var rooms = S().rooms.slice().sort(function (p, q) { return (p.y - q.y) || (p.x - q.x); });
    for (i = 0; i < rooms.length; i++) drawRoom(ctx, rooms[i]);
    // ambient props (seeded, capped, off walk lanes)
    drawProps(ctx, rng, rooms);
    if (tier >= 2) { var gpx = ((GW >> 1) * T + T / 2) | 0; lampPost(ctx, gpx - 44, H - 3); lampPost(ctx, gpx + 44, H - 3); } // prestige: lamps flank the cổng
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
  function drawTapFx(ctx, ts) {
    if (!tapFx) return;
    var age = ts - tapFx.t0;
    if (age < 0 || age > 380) { if (age > 380) tapFx = null; return; }
    var k = age / 380, rad = 4 + k * 13, al = (1 - k) * 0.8;
    ctx.strokeStyle = "rgba(240,198,116," + al.toFixed(2) + ")"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(tapFx.x, tapFx.y, rad, 0, 6.2832); ctx.stroke();
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
    var sjMajor = HVS.studentMajor ? HVS.studentMajor(st) : null; // the khoa this student belongs to (if any)
    var stars = "★".repeat(st.seed) + "☆".repeat(5 - st.seed);
    var lookIdx = (typeof st.look === "number" && st.look >= 0 && st.look < VARIANTS.length) ? st.look : hashId(st.id) % VARIANTS.length;
    ins.innerHTML =
      "<div class='ihead'><canvas id='iav' width='24' height='32' style='width:27px;height:36px;image-rendering:pixelated;background:" + (GRADE_C[st.grade] + "22") + ";border-radius:7px;flex-shrink:0'></canvas>" +
      "<div class='grow'><input id='renameIn' value='" + esc(st.ten).replace(/'/g, "&#39;") + "' maxlength='18' style='width:100%;box-sizing:border-box;background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--ink);border-radius:7px;padding:4px 7px;font-family:inherit;font-weight:700;font-size:12px'/>" +
      "<div class='imeta'>Năm " + st.grade + " · " + esc(TELL_TXT[st.tell] || TELL_TXT[""]) + (hb ? " · 🏵️ " + esc(hb) : "") + (st.ten === "Mai Sương" ? " · 🔧" : "") + (S().META.favId === st.id ? " · ⭐ đang theo dõi" : "") + "</div>" +
      (sjMajor ? "<div class='imeta' style='color:var(--gold)'>" + sjMajor.icon + " " + esc(sjMajor.name) + "</div>" : "") + "</div>" +
      "<button class='ix' id='favBtn' title='Theo dõi'>" + (S().META.favId === st.id ? "⭐" : "☆") + "</button>" +
      "<button class='ix' id='lookBtn' title='Đổi kiểu'>🔄</button>" +
      "<button class='ix' id='ixBtn'>✕</button></div>" +
      "<div class='ibars'>" + ibar("Kiến thức", st.kt, "#bb6bd9") + ibar("Tay nghề", st.tn, "#6fcf97") + ibar("Sáng tạo", st.st, "#6aa9f0") + ibar("Cá mập", st.cm, "#f2994a") + ibar("Tâm trạng", st.mood, "#f2c14e") + "</div>" +
      "<div class='iflav'>Tiềm năng (hạt giống): " + stars + "</div>" +
      "<div class='custz'><span class='tiny' style='color:var(--faint)'>Tùy biến:</span>" +
        "<button class='czb' id='cz_s'>🎨 Da</button><button class='czb' id='cz_h'>💇 Tóc</button>" +
        "<button class='czb' id='cz_y'>✂️ Kiểu</button><button class='czb' id='cz_a'>👓 Đồ</button>" +
        "<button class='czb' id='cz_r'>🎲</button></div>";
    if (ATLAS) { var cx = $("iav").getContext("2d"); cx.imageSmoothingEnabled = false; cx.drawImage(st.lookC ? customSprite(st.grade, st.lookC, 0) : ATLAS[st.grade - 1][lookIdx][0], 0, 0); }
    $("ixBtn").onclick = hideInspect;
    $("favBtn").onclick = function () { var m = S().META; m.favId = (m.favId === id) ? null : id; syncActors(); if (m.favId === id) toast("⭐ Đang theo dõi " + st.ten + " — em ấy sẽ có sao trên sân."); showInspectStudent(id); };
    $("renameIn").onchange = function () { var v = this.value.trim().slice(0, 18); if (v) { st.ten = v; syncActors(); renderPanel(); } };
    $("lookBtn").onclick = function () { delete st.lookC; st.look = (lookIdx + 1) % VARIANTS.length; syncActors(); showInspectStudent(id); }; // cycle presets (clears custom)
    var cyc = function (axis, n) { st.lookC = Object.assign({}, st.lookC || effLook(st)); st.lookC[axis] = (st.lookC[axis] + 1) % n; syncActors(); showInspectStudent(id); };
    $("cz_s").onclick = function () { cyc("s", SKINS.length); };
    $("cz_h").onclick = function () { cyc("h", HAIRSET.length); };
    $("cz_y").onclick = function () { cyc("y", HAIRSTYLE.length); };
    $("cz_a").onclick = function () { cyc("a", ACC.length); };
    $("cz_r").onclick = function () { st.lookC = { s: (Math.random() * SKINS.length) | 0, h: (Math.random() * HAIRSET.length) | 0, y: (Math.random() * HAIRSTYLE.length) | 0, a: (Math.random() * ACC.length) | 0 }; syncActors(); showInspectStudent(id); };
    ins.classList.add("show"); $("mapHint").textContent = "";
  }
  function showDedication(dedKey) {
    var p = null; for (var i = 0; i < CONFIG.PANTHEON.length; i++) if (CONFIG.PANTHEON[i].key === dedKey) p = CONFIG.PANTHEON[i];
    if (!p && CONFIG.GARDEN_FIGURES) p = CONFIG.GARDEN_FIGURES[dedKey];
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
    var bb = $("buildBadge"); if (bb && !bb.textContent) bb.textContent = "v " + buildLabel(); // deploy stamp (changes each push)
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
    if (s._milestoneJustHit) { toast("🎉 " + s._milestoneJustHit); sfx("milestone"); s._milestoneJustHit = null; }
    // campus glow-up: when the grounds reach a new prestige tier, celebrate + repaint (once per tier)
    var ct = campusTier();
    if (ct > (s.META.campusTier || 0)) { s.META.campusTier = ct; s._mapDirty = true; sfx("milestone"); toast(ct >= 2 ? "🏛️ Trường khang trang hẳn — lối lát đá, đèn sáng cổng." : "🌿 Sân trường gọn gàng hơn — cỏ xén, lối đi sạch sẽ."); }
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

    // build & upgrade — one building per type on the map; buying more upgrades it in place
    var c3 = el("div", "card"); c3.appendChild(el("h3", null, "Xây dựng & Nâng cấp"));
    c3.appendChild(el("div", "tiny", "Chạm để xây — phòng tự hiện ra. Mua thêm = nâng cấp (vẫn một phòng trên sân).")).style.marginBottom = "7px";
    var grid = el("div", "buildgrid"), maxLv = CONFIG.ROOM_MAX_LEVEL || 3;
    ["phonghoc", "cangtin", "lab", "phongmay", "xuong"].forEach(function (key) {
      var d = CONFIG.ROOMS[key], sk = ROOM_SKIN[key], r0 = s.rooms.filter(function (r) { return r.key === key; })[0];
      var lvl = r0 ? (r0.level || 1) : 0, maxed = lvl >= maxLv;
      var cost = lvl === 0 ? (d.cost || 0) : Math.max(50, d.cost || 0);
      var pr = maxed ? "Tối đa" : (lvl === 0 ? (cost ? "Xây −" + cost + "tr" : "Xây · miễn phí") : "Nâng Lv" + (lvl + 1) + " −" + cost + "tr");
      var b = el("button", "build");
      b.innerHTML = "<div class='nm'>" + sk.e + " " + d.name + (lvl ? " <span class='tiny' style='color:var(--gold)'>Lv" + lvl + "</span>" : "") + "</div><div class='ds'>" + d.desc + "</div><div class='pr'>" + pr + "</div>";
      if (maxed || (cost > s.cash && lvl > 0) || (lvl === 0 && d.cost > s.cash)) b.disabled = true;
      b.onclick = function () { buyRoom(key); };
      grid.appendChild(b);
    });
    c3.appendChild(grid);
    wrap.appendChild(c3);

    // dedications — honour a real educator (late-game prestige + a question to put to the grounds)
    var dedKeys = ["vuontdn", "vuontqb", "vuonhxh", "vuonntt", "vuoncva"].filter(function (k) { return !s.rooms.some(function (r) { return r.key === k; }); });
    if (dedKeys.length) {
      var c3b = el("div", "card"); c3b.appendChild(el("h3", null, "Vinh danh nhà giáo dục"));
      c3b.appendChild(el("div", "tiny", "Dựng một khu vườn tưởng niệm — đặt câu hỏi của trường cạnh một người đã trả lời nó thật.")).style.marginBottom = "7px";
      var dgrid = el("div", "buildgrid");
      dedKeys.forEach(function (key) {
        var d = CONFIG.ROOMS[key], sk = ROOM_SKIN[key];
        var b = el("button", "build");
        b.innerHTML = "<div class='nm'>" + sk.e + " " + esc(d.name) + "</div><div class='ds'>" + esc(d.desc) + "</div><div class='pr'>−" + d.cost + "tr</div>";
        if (d.cost > s.cash) b.disabled = true;
        b.onclick = function () { buyRoom(key); };
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
  // P4b — cycle the trưởng-khoa: vacate → each free teacher → vacate. setKhoaHead enforces one khoa/teacher.
  function cycleKhoaHead(key) {
    var s = S();
    var curr = (s.khoaHead && s.khoaHead[key]) || null;
    var busy = {}; for (var k in (s.khoaHead || {})) if (k !== key && s.khoaHead[k]) busy[s.khoaHead[k]] = true;
    var opts = [null]; s.teachers.forEach(function (t) { if (!busy[t.id]) opts.push(t.id); });
    var idx = opts.indexOf(curr); if (idx < 0) idx = 0;
    var next = opts[(idx + 1) % opts.length];
    HVS.setKhoaHead(key, next);
    if (next) sfx("chime");
    renderPanel();
  }
  function panelStudents() {
    var s = S(), wrap = el("div");
    // KHOA / majors — auto-join specializations; synergy when a khoa is full; unlocked by buildings
    if (CONFIG.MAJORS && CONFIG.MAJORS.length) {
      var counts = {}, general = 0;
      s.students.forEach(function (st) { var m = HVS.studentMajor(st); if (m) counts[m.key] = (counts[m.key] || 0) + 1; else general++; });
      var kc = el("div", "card"); kc.appendChild(el("h3", null, "Khoa / Chuyên ngành"));
      var thr = function (k) { return HVS.khoaThreshold ? HVS.khoaThreshold(k) : (CONFIG.SYN_MIN || 4); };
      CONFIG.MAJORS.forEach(function (m) {
        var unlocked = s.rooms.some(function (r) { return r.key === m.room; });
        var cnt = counts[m.key] || 0, need = thr(m.key), syn = cnt >= need;
        var status = !unlocked ? ("🔒 Xây " + CONFIG.ROOMS[m.room].name + " để mở")
          : (syn ? "<span style='color:var(--green)'>⚡ Cộng hưởng — lớn nhanh hơn</span>" : (cnt + "/" + need + " SV để cộng hưởng"));
        var row = el("div", "row"); row.style.marginBottom = unlocked ? "2px" : "6px"; if (!unlocked) row.style.opacity = ".5";
        row.innerHTML = "<div class='grow'><div style='font-size:11.5px;font-weight:700'>" + m.icon + " " + esc(m.name) + "</div><div class='tiny'>" + status + " · → " + m.dest + "</div></div><div class='schip'>" + cnt + " SV</div>";
        kc.appendChild(row);
        if (unlocked) { // P4b: assign a trưởng-khoa (a teacher) — khoa thrives at one fewer SV + grows faster
          var hid = s.khoaHead && s.khoaHead[m.key];
          var head = hid && HVS.teacherById ? HVS.teacherById(hid) : null;
          var hr = el("div", "row"); hr.style.marginBottom = "6px";
          hr.appendChild(el("div", "tiny grow", "Trưởng khoa: " + (head ? "<span style='color:var(--gold)'>🎓 " + esc(head.ten) + "</span>" : "<span style='opacity:.65'>chưa có</span>")));
          var btn = el("button", "btn", head ? "Đổi" : "Phân công"); btn.style.fontSize = "10.5px"; btn.style.padding = "4px 9px";
          if (!s.teachers.length) { btn.disabled = true; btn.title = "Cần có giáo viên"; }
          btn.onclick = function () { cycleKhoaHead(m.key); };
          hr.appendChild(btn); kc.appendChild(hr);
        }
      });
      var thriving = CONFIG.MAJORS.filter(function (m) { return (counts[m.key] || 0) >= thr(m.key); }).length;
      if (thriving >= 2) kc.appendChild(el("div", "tiny", "<span style='color:var(--gold)'>⚡⚡ Liên khoa — các khoa mạnh học hỏi nhau (cộng hưởng chéo, đẩy về 🍎).</span>")).style.marginTop = "4px";
      if (general) kc.appendChild(el("div", "tiny", "Đại cương: " + general + " SV chưa thuộc khoa nào (xây phòng để mở khoa).")).style.marginTop = "3px";
      wrap.appendChild(kc);
    }
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

  // the founder's old cram-school star (Trần Phi Lợi) is seeded for his scripted arrest, but he isn't
  // THIS school's graduate — keep him out of the Sổ until he's actually "lên báo" (arrested).
  function visAlumni() { return S().alumni.filter(function (a) { return !(a._tpl && !a._arrested); }); }
  function panelAlumni() {
    var s = S(), wrap = el("div"), alumni = visAlumni();
    if (!alumni.length) { wrap.appendChild(el("div", "empty", "Chưa có cựu sinh viên.<br>Khoá đầu tốt nghiệp vào Lễ Tốt Nghiệp tháng 6.")); return wrap; }
    var order = { STEVE: 0, BI_BAT: 1 };
    var sorted = alumni.slice().sort(function (a, b) { return (order[a.state] != null ? order[a.state] : 5) - (order[b.state] != null ? order[b.state] : 5) || b.gradYear - a.gradYear; });
    var c = el("div", "card"); c.appendChild(el("h3", null, "Sổ cựu sinh viên · " + alumni.length));
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
    if (alumni.length > 40) c.appendChild(el("div", "tiny", "… và " + (alumni.length - 40) + " người nữa."));
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
    // alumni states (hide the not-yet-arrested shadow alumnus)
    var alumni = visAlumni();
    if (alumni.length) {
      var byState = {}; alumni.forEach(function (a) { byState[a.state] = (byState[a.state] || 0) + 1; });
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
    rc.appendChild(el("div", "tiny", "Bản dựng đang chạy: <b style='color:var(--gold)'>" + esc(buildLabel()) + "</b> · <span style='color:var(--faint)'>" + esc(BUILD) + "</span>"));
    if (saveIsOld) rc.appendChild(el("div", "tiny", "<span style='color:var(--amber)'>Bản lưu của bạn từ bản dựng trước — bấm Chơi lại từ đầu để xem các thay đổi mới (bắt đầu từ con số 0).</span>")).style.margin = "5px 0";
    else rc.appendChild(el("div", "tiny", "Xoá lưu và chơi lại từ một khoảnh sân trống.")).style.margin = "5px 0 8px";
    var rb = el("button", "btn" + (saveIsOld ? " gold" : ""), "🔄 Chơi lại từ đầu (xoá lưu)"); rb.style.width = "100%";
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
  function essayDraft(capstone) {
    var s = S(), C = CONFIG.ESSAY, E = CONTENT.essay, w = el("div");
    if (capstone) {
      w.appendChild(el("div", "kic", "Mười năm sau · Lễ Bế Giảng"));
      var ch = el("h2", null, "Mười năm sau ngày khai giảng đầu tiên"); w.appendChild(ch);
      var intro = el("div", "lead", "Trường đã đi hết một chặng. Bạn ngồi xuống, lấy ra bản nháp bài luận năm xưa — câu hỏi vẫn còn đó. Lần này bạn viết bằng những gương mặt đã đi qua sân trường này."); intro.style.fontStyle = "italic"; w.appendChild(intro);
    }
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
    var s = S();
    // one-shot decade capstone — fire the "Mười năm sau" reflection only when no gameplay modal is up
    var pending = s.pendingJune || s.pendingAdmit || s.pendingContract || s.pendingEvent || s._giftFlush;
    if (s._decadeHit && !pending && !$("modalRoot").classList.contains("show")) {
      s._decadeHit = false; s.META.decadeShown = true; try { HVS.saveGame(); } catch (e) {}
      hideInspect(); openModal(essayDraft(true)); return;
    }
    var sig = "";
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
  function afterFinalize() { syncActors(); rebuildWalk(); drawStatic(); checkModals(); render(); }
  function showJuneResults() {
    var s = S(), pj = s.pendingJune, w = el("div");
    sfx("grad");
    w.appendChild(el("div", "kic", "Kết quả · Năm " + (s.year - 1)));
    w.appendChild(el("h2", null, "Khoá vừa ra trường"));
    // followed student first, gently spotlit — the protégé you watched for years
    var ordered = (pj.results || []).slice().sort(function (a, b) { return (b.fav ? 1 : 0) - (a.fav ? 1 : 0); });
    ordered.forEach(function (rc) {
      var r = el("div", "gres");
      if (rc.fav) { r.style.borderColor = "var(--gold)"; r.style.background = "linear-gradient(180deg,rgba(240,198,116,.12),rgba(240,198,116,.04))"; }
      var extra = "";
      if (rc.fav) extra += "<div class='nod' style='color:var(--gold)'>⭐ Em bạn dõi theo từ ngày đầu.</div>";
      if (rc.tiem) extra += "<div class='nod'>" + CONTENT.bacTamTiemNang + "</div>";
      if (rc.viral) extra += "<div class='nod'>Phần bảo vệ lan truyền khắp mạng.</div>";
      if (rc.near) extra += "<div class='tiny' style='color:var(--faint)'>" + esc(rc.near) + "</div>";
      r.innerHTML = "<div class='em'>" + rc.emoji + "</div><div class='grow'><div class='oc'>" + (rc.fav ? "⭐ " : "") + esc(rc.ten) + " — " + esc(rc.outcome) + "</div><div class='fl'>" + esc(rc.flavor || "") + "</div><div class='tiny' style='margin-top:2px'>Trạng thái đầu đời: " + rc.entryChip + "</div>" + extra + "</div><div class='dm'>" + rc.diem.toFixed(1) + "</div>";
      w.appendChild(r);
    });
    var btn = el("button", "btn gold", "Tiếp tục →"); btn.style.width = "100%"; btn.style.marginTop = "8px";
    btn.onclick = function () { S().pendingJune = null; checkModals(); render(); };
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
  function afterAdmit() { syncActors(); checkModals(); render(); toast("Tân sinh viên đang vào trường."); }
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
      b.onclick = function () { HVS.resolveEvent(i); checkModals(); renderPanel(); };
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
    a.onclick = function () { HVS.resolveContract(true); checkModals(); renderPanel(); };
    var b = el("button", "choice virtue"); b.innerHTML = "<div class='ttl'>Từ chối khéo</div><div class='hint'>+2 Thực Chất, +1 Uy Tín. Bác Tâm gật đầu.</div>";
    b.onclick = function () { HVS.resolveContract(false); checkModals(); renderPanel(); };
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
    btn.onclick = function () { S()._giftFlush = null; checkModals(); render(); };
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
    var foot = el("div", "tiny", CONTENT.disclaimer + " · bản dựng " + esc(buildLabel())); foot.style.marginBottom = "10px"; w.appendChild(foot);
    var btn = el("button", "btn gold", "Đặt viên gạch đầu tiên →"); btn.style.width = "100%";
    btn.onclick = function () { try { S().META.tutorial = true; if (S().speed === 0) { S().speed = 1; } HVS.saveGame(); } catch (e) {} hideModal(); renderHUD(); };
    w.appendChild(btn);
    openModal(w);
  }


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
    _bakeSheet: function () { var c = $("mapStatic"), X = c.getContext("2d"); X.imageSmoothingEnabled = false; X.fillStyle = "#79b34a"; X.fillRect(0, 0, c.width, c.height); var sc = 4, per = 4; for (var v = 0; v < ATLAS[0].length; v++) { var spr = ATLAS[0][v][0]; var col = v % per, row = (v / per) | 0; X.drawImage(spr, 8 + col * 104, 8 + row * 140, 24 * sc, 32 * sc); } },
    _steps: function (n, period) { var ts = 50000; for (var f = 0; f < (n || 60); f++) { ts += 16; for (var i = 0; i < actors.length; i++) updateActor(actors[i], true, ts, period || 0); } },
    // test hook: fast-forward the walk so a pinned period reaches its destinations (headless rAF is throttled)
    _settle: function (frames) { if (S()._mapDirty) { rebuildWalk(); drawStatic(); } var p = forcePeriod >= 0 ? forcePeriod : 0, ts = 20000; for (var i0 = 0; i0 < actors.length; i0++) actors[i0]._period = -99; for (var f = 0; f < (frames || 1500); f++) { ts += 16; for (var i = 0; i < actors.length; i++) updateActor(actors[i], true, ts, p); } },
    // paint ONE live frame on demand so headless screenshots capture the walking campus (rAF is
    // throttled in headless, so actors/activities never render otherwise). Recipe: setPeriod(p) →
    // _sync(true) → _settle(N) to move them into place → _renderLiveOnce(p) → screenshot.
    _renderLiveOnce: function (period, ts) { var ctx = $("mapLive").getContext("2d"); ctx.imageSmoothingEnabled = false; ctx.clearRect(0, 0, GW * T, GH * T); if (S()._mapDirty) { rebuildWalk(); drawStatic(); } var p = (period != null) ? period : (forcePeriod >= 0 ? forcePeriod : 0); drawLive(ctx, ts || 50000, p); }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
