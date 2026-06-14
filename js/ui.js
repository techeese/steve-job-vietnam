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
  // --- Art epic: Kenney Tiny Town tilemap (real 16x16 pixel-art tiles), loaded async; procedural fallback if absent ---
  var TILES = null, TPX = 16; // the 12-wide tilesheet image once loaded + tile size
  function tileXY(idx) { return [(idx % 12) * TPX, ((idx / 12) | 0) * TPX]; } // src x,y of tile #idx
  function kTile(ctx, idx, cx, baseY, w, h) { if (!TILES) return; var s = tileXY(idx); ctx.drawImage(TILES, s[0], s[1], TPX, TPX, (cx - w / 2) | 0, (baseY - h) | 0, w, h); } // blit tile #idx centered-x, base at baseY
  // --- Art epic: Jephed top-down characters (40 sheets, 64×128 each = 3 walk-cols × 4 dir-rows of 20×32 cells; x-stride 22, y-stride 32). Rows: 0=down 1=left 2=right 3=up. Loaded async; chibi fallback if absent. ---
  var CHARS = [], CHARS_N = 0, CW = 20, CH = 32; // sprite frames once loaded + count + cell size
  function loadChars() { for (var i = 0; i < 40; i++) (function (idx) { var im = new Image(); im.onload = function () { CHARS[idx] = im; CHARS_N++; }; im.src = "assets/characters/" + ("00" + idx).slice(-3) + ".png?v=1"; })(i); }
  function charFrame(ctx, ci, row, col, x, topY) { var im = CHARS[ci]; if (!im) return false; ctx.drawImage(im, col * 22, row * 32, CW, CH, (x - CW / 2) | 0, topY | 0, CW, CH); return true; } // blit 20×32 frame, top-left at (x-10, topY)
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
  /* === ART: Sơn Mài Diorama (lacquer-night campus, gold-leaf pavilions) === */
  // per-room style: wall hue, roof silhouette, window temperature, gable sigil, short map label
  function mb(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

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
  var visitor = null, lastVisitTs = -1e9; // a cựu SV occasionally strolls back onto campus (transient, separate from actors)
  var celebrateUntil = 0, _steveSeen = -1; // 🍎 Steve-emergence celebration (the đề Văn's answer, made a moment)
  var _cupSeen = -1; // 🏆 Cúp Khoa — fire a non-blocking celebration when a new year's cup is awarded
  var UMB_COLS = ["#e0584a", "#4a8fe0", "#f2c14e", "#5fd0c5", "#b48ef0", "#ee7ab0"]; // rain umbrellas (cheerful, varied by id)
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
    _steveSeen = S().META.steves || 0; // baseline so a loaded save's existing Steves don't re-celebrate
    _cupSeen = (S().khoaCup && S().khoaCup.lastYear) || 0; // baseline so a loaded save's last cup doesn't re-fire
    AUDIO.init();
    $("schoolSub").textContent = CONTENT.schoolSub;
    buildSpeeds(); buildTabs();
    SPRITES.build(); // bake pixel-art sprite atlas once (js/sprites.js)
    (function () { var im = new Image(); im.onload = function () { TILES = im; if (S()) S()._mapDirty = true; }; im.src = "assets/tiles/tinytown_tilemap.png?v=1"; })(); // load real tiles; redraw when ready
    loadChars(); // load the 40 Jephed character sheets; the live layer picks them up next frame (no _mapDirty — actors are on mapLive)
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
      a.grade = s.grade; a.bodyC = SPRITES.GRADE_C[s.grade] || "#9aa4b2"; a.special = (s.ten === "Mai Sương"); a.hb = !!(s.flags && s.flags.hb); a.fav = (S().META.favId === s.id); a.mentored = !!s.mentored; a.ten = s.ten;
      a.tell = s.tell || ""; a.seed = s.seed; a.mood = s.mood; // iter-138: mood synced so the sân shows who's struggling
      a.variantIdx = (typeof s.look === "number" && s.look >= 0 && s.look < SPRITES.VARIANTS.length) ? s.look : SPRITES.hashId(s.id) % SPRITES.VARIANTS.length;
      a.lookC = s.lookC || null; // player-customized override (else the VARIANT)
      var el0 = a.lookC ? SPRITES.clampLook(a.lookC) : SPRITES.VARIANTS[a.variantIdx];
      a.skin = SPRITES.SKINS[el0.s][0]; a.glasses = SPRITES.ACC[el0.a] === "glasses";
      a._ox = ((s.id * 37) % 13) - 6; a._oy = ((s.id * 53) % 13) - 6; // wider fan-out so a cohort heading to one room scatters instead of marching in a tight column (owner: "too-similar directions")
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
    if (alive) { tickWeather(ts); updateWeather(ts); }
    if (alive) updateFest(ts);
    if (alive) { maybeVisitor(ts); updateVisitor(ts); }
  }
  function drawLive(ctx, ts, period) {
    var i;
    drawClouds(ctx);  // soft cloud-shadows drifting over the grounds, beneath the actors
    actors.sort(function (a, b) { return a.py - b.py; });
    for (i = 0; i < actors.length; i++) { drawActor(ctx, actors[i], ts); if (actors[i]._atDest && actors[i].act) drawActivity(ctx, actors[i], ts); if (actors[i].emote) drawEmote(ctx, actors[i].emote, actors[i].px | 0, actors[i].py | 0); }
    drawVisitor(ctx, ts);   // a returning cựu SV, if one is currently visiting
    drawSelection(ctx, ts); // on-map marker for the tapped student/room
    drawTapFx(ctx, ts);     // expanding ripple at the last tap (touch feedback)
    if (period === 1) drawBall(ctx); // pickup football at recess
    for (i = 0; i < cats.length; i++) drawCat(ctx, cats[i], ts);
    drawFlyers(ctx, ts);
    drawSmoke(ctx, ts);
    if (scandalMood()) drawNewsVan(ctx, ts); // the media camps out when the school's phốt pile up
    drawChampPennant(ctx, ts);              // the reigning Cúp Khoa champion flies its colours over its own building

    if (period >= 3) { // golden-hour: warm directional light from the low sun (upper-left), strongest at tan học
      var sunR = GW * T * 0.95, ga = (period === 4) ? 0.17 : 0.085;
      var gh = ctx.createRadialGradient(GW * T * 0.16, GH * T * 0.08, 0, GW * T * 0.16, GH * T * 0.08, sunR);
      gh.addColorStop(0, "rgba(255,198,112," + ga + ")"); gh.addColorStop(1, "rgba(255,150,70,0)");
      ctx.fillStyle = gh; ctx.fillRect(0, 0, GW * T, GH * T);
    }
    ctx.fillStyle = TINTS[period] || TINTS[2]; ctx.fillRect(0, 0, GW * T, GH * T); // time-of-day warmth (subtle, never dark)
    if (weather === "rays") drawRays(ctx);  // sunbeams ride on top of the warm light
    drawFest(ctx, ts); // festive petals (Tết) / confetti (June) fall in front of everything
    if (weather === "rain") drawRain(ctx);  // drizzle is the very front layer (between us and the campus)
    if (celebrateUntil && (typeof performance !== "undefined" ? performance.now() : ts) < celebrateUntil) drawCelebrate(ctx, ts); // 🍎 Steve burst
  }
  // a golden confetti burst + warm glow when a Steve emerges — over everything, for a few seconds
  function drawCelebrate(ctx, ts) {
    var W = GW * T, H = GH * T, n = 44, i, px, py, w;
    for (i = 0; i < n; i++) {
      px = ((i * 53.3) % W + Math.sin(ts / 480 + i) * 9) % W;
      py = ((ts * (0.05 + (i % 5) * 0.011) + i * 41) % (H + 24)) - 12;
      ctx.fillStyle = (i % 3 === 0) ? "#f0c674" : (i % 3 === 1 ? "#fff3c0" : "#ffd24a");
      w = 2 + (Math.abs(Math.cos(ts / 110 + i)) * 2 | 0);
      ctx.fillRect(px | 0, py | 0, w, 3);
    }
    ctx.fillStyle = "rgba(255,212,120," + (0.10 + 0.05 * Math.sin(ts / 190)).toFixed(2) + ")"; ctx.fillRect(0, 0, W, (H * 0.28) | 0); // warm top glow
  }
  // schedule: students are routed to the right room's door-ring each period, then do the activity
  function assignActivity(a, period) {
    var roomKey = null, act = null, duAn = (S().month >= 2 && S().month <= 5);
    if (period === 0) { roomKey = "phonghoc"; act = (a.tell === "sky") ? "daydream" : "study"; }
    else if (period === 1) { roomKey = "san"; act = (a.tell === "hype") ? "perform" : ((a.id % 5 < 2) ? "chat" : (a.id % 5 === 2 ? "read" : "recess")); } // recess is now social: chat clusters, readers, milling
    else if (period === 2) { roomKey = "cangtin"; act = "eat"; }
    else if (period === 3) {
      // afternoon KHOA PRACTICUM — each major works in its own room, its own way (read a khoa by watching)
      if (a.tell === "hype") { roomKey = "lab"; act = "stream"; }                     // Sống Ảo: livestreams instead of building (satire)
      else if (a.tell === "spark") { roomKey = "phongmay"; act = "code"; }            // Lập trình: heads-down at a monitor
      else if (a.tell === "sky") { roomKey = "xuong"; act = "craft"; }                // Thiết kế Chế tạo: sawing/shaping a workpiece
      else if (a.grade === 4) { roomKey = duAn ? "xuong" : "phongmay"; act = "tinker"; }
      else { roomKey = "lab"; act = "study"; }
    }
    else { roomKey = null; var m3 = (a.id + period) % 3; act = (m3 === 0) ? "zzz" : (m3 === 1 ? "phone" : "home"); } // tan học: nap, doom-scroll, or head home
    var ring = roomKey ? ringsByKey[roomKey] : null;
    if (ring && ring.length) { var t = ring[(a.id + period) % ring.length]; a.tx = t[0]; a.ty = t[1]; a.act = act; }
    else { var rt = randWalkTile(); a.tx = rt[0]; a.ty = rt[1]; a.act = (period === 4) ? act : null; } // graceful fallback when the room isn't built
    a._atDest = false;
  }
  function updateActor(a, alive, ts, period) {
    if (a._leaving) { // graduate heading out the cổng — ignore activity routing
      var ggx = (GW >> 1) * T + T / 2 + a._ox, ggy = GH * T + 20;
      var ldx = ggx - a.px, ldy = ggy - a.py, ld = Math.hypot(ldx, ldy);
      if (alive) { var ls = 0.42; a.px += (ldx / ld) * ls; a.py += (ldy / ld) * ls; a.dir = ldx < 0 ? -1 : 1; a._moving = true; a._leaveT++; }
      if (a.py > GH * T + 12 || a._leaveT > 1600) a._gone = true; // exited (or safety timeout) → dropped next sync
      a.bob = Math.sin(ts / 180 + a.ph) * 1.2;
      return;
    }
    // owner: "people start and stop at the same time, in too-similar directions" — STAGGER the bell so each
    // kid peels off at a slightly different beat (no synchronized stampede); they linger at their old spot until then.
    if (a._period !== period) { a._period = period; a._actDelay = (a.id * 41) % 70; a._pend = 1; }
    if (a._pend) { if (a._actDelay > 0) { a._actDelay--; } else { assignActivity(a, period); a._pend = 0; } }
    var tgx = a.tx * T + T / 2 + a._ox, tgy = a.ty * T + T / 2 + a._oy;
    var dx = tgx - a.px, dy = tgy - a.py, dist = Math.hypot(dx, dy);
    if (dist < 1.5 || !alive) { a._moving = false; a._atDest = a._atDest || dist < 1.5; }
    else {
      var sp = 0.30 + ((a.id * 17) % 7) * 0.012 + (a.grade === 1 ? 0.05 : 0); // gentle stroll + per-kid pace variation so a cohort doesn't move in lockstep
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
    // D2 — make the person-sim SOUL visible on the sân: who you're lifting, whom the school is wasting
    if (a.mood != null && a.mood < CONFIG.MOOD_PENALTY_BELOW && Math.random() < 0.6) return "sweat"; // iter-138: low mood (esp. burning out) → visible strain on the sân — the mood dimension, made watchable (owner: "watching")
    if (a.mentored && Math.random() < 0.6) return Math.random() < 0.5 ? "idea" : "spark";            // a kid you pour attention into lights up
    var _pre = S().presets["n" + a.grade], _mm = CONFIG.MATCH ? CONFIG.MATCH(a.tell, _pre) : 1;
    if (_mm <= 0.6 && Math.random() < 0.6) return "sweat";                                            // grain the school is wasting → visible strain
    if (_mm >= 1.3 && !a.act && Math.random() < 0.5) return Math.random() < 0.5 ? "idea" : "spark";   // grain the school fits → thriving
    if (a.act === "perform") return "music";
    if (a.act === "eat") return Math.random() < 0.6 ? "heart" : "spark";
    if (a.act === "study") return Math.random() < 0.5 ? "idea" : "dots";
    if (a.act === "tinker") return Math.random() < 0.6 ? "idea" : "spark";
    if (a.act === "code") return Math.random() < 0.55 ? "idea" : "dots";   // debugging the loop
    if (a.act === "craft") return Math.random() < 0.6 ? "spark" : "idea";  // sparks off the workpiece
    if (a.act === "stream") return Math.random() < 0.6 ? "heart" : "spark"; // likes + clout
    if (a.act === "chat") return Math.random() < 0.5 ? "heart" : "dots";   // gossip & laughter
    if (a.act === "read") return Math.random() < 0.6 ? "idea" : "dots";
    if (a.act === "phone") return Math.random() < 0.55 ? "heart" : "dots"; // the feed
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
  /* weather — a LIGHT, mostly-sunny layer: drifting god-ray sunbeams from the upper-left sun, and the
     occasional gentle drizzle. Cosmetic only (Math.random, never serialized → zero gate/sweep impact);
     suppressed during festivals so Tết petals / June confetti read clean. Stays sunny per VISION. */
  var weather = "clear", weatherT = 0, rain = [], rays = [], splash = [];
  function spawnRain() { rain = []; for (var i = 0; i < 120; i++) rain.push({ x: Math.random() * (GW * T + 60) - 30, y: Math.random() * GH * T, vy: 6.0 + Math.random() * 3.0, len: 8 + Math.random() * 7 }); splash = []; }
  function spawnRays() { rays = []; for (var i = 0; i < 6; i++) rays.push({ x: (0.02 + i * 0.17 + Math.random() * 0.04) * GW * T, w: 30 + Math.random() * 34, a: 0.10 + Math.random() * 0.06, v: 0.05 + Math.random() * 0.06 }); }
  function setWeather(w) { weather = w; if (w === "rain") spawnRain(); else if (w === "rays") spawnRays(); }
  function tickWeather(ts) {
    if (ts < weatherT) return;
    weatherT = ts + 22000 + Math.random() * 22000;                 // each spell lasts ~22–44s
    if (festMode()) { setWeather("clear"); return; }               // never rain/glare on a festival
    var r = Math.random();
    setWeather(r < 0.15 ? "rain" : (r < 0.5 ? "rays" : "clear"));  // mostly sunny; sunbeams common; drizzle rare
  }
  function updateWeather(ts) {
    var i;
    if (weather === "rain") {
      for (i = 0; i < rain.length; i++) { var d = rain[i]; d.y += d.vy; d.x += 1.3; if (d.y > GH * T) { if (Math.random() < 0.5) splash.push({ x: d.x - 2, y: GH * T - 1 + Math.random() * 2, t: 7 }); d.y = -8; d.x = Math.random() * (GW * T + 60) - 30; } }
      for (i = splash.length - 1; i >= 0; i--) { if (--splash[i].t <= 0) splash.splice(i, 1); }
    }
    else if (weather === "rays") { for (i = 0; i < rays.length; i++) { var r = rays[i]; r.x += r.v; if (r.x - 100 > GW * T) r.x = -r.w - 60; } }
  }
  function drawRays(ctx) {                                          // sunbeams slanting down-right from the low upper-left sun
    var H = GH * T, off = H * 0.5;
    for (var i = 0; i < rays.length; i++) {
      var r = rays[i];
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      var g = ctx.createLinearGradient(r.x, 0, r.x + off, H);
      g.addColorStop(0, "rgba(255,240,182," + r.a.toFixed(3) + ")"); g.addColorStop(0.65, "rgba(255,232,160," + (r.a * 0.5).toFixed(3) + ")"); g.addColorStop(1, "rgba(255,232,160,0)");
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(r.x, 0); ctx.lineTo(r.x + r.w, 0); ctx.lineTo(r.x + r.w + off, H); ctx.lineTo(r.x + off, H); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }
  function drawRain(ctx) {                                          // drizzle: diagonal streaks + ground splashes + a cool wash
    var W = GW * T, H = GH * T, i;
    ctx.fillStyle = "rgba(140,160,200,.11)"; ctx.fillRect(0, 0, W, H);   // cool overcast wash (still light — never dark)
    ctx.strokeStyle = "rgba(214,226,248,.62)"; ctx.lineWidth = 1; ctx.beginPath();
    for (i = 0; i < rain.length; i++) { var d = rain[i]; ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 3, d.y + d.len); }
    ctx.stroke();
    ctx.strokeStyle = "rgba(220,230,250,.5)";                          // tiny splash ticks where drops land
    for (i = 0; i < splash.length; i++) { var p = splash[i]; ctx.beginPath(); ctx.moveTo(p.x - 2, p.y); ctx.lineTo(p.x + 2, p.y); ctx.stroke(); }
  }
  /* Cúp Khoa champion pennant — the reigning khoa flies its colours on a little pole atop its OWN building,
     so you can SEE who's winning the pennant race from the campus itself. Pure cosmetic (Math.sin wave). */
  function drawChampPennant(ctx, ts) {
    var s = S(); if (!s.khoaCup || !s.khoaCup.champ) return;
    var mj = null, M = CONFIG.MAJORS; for (var i = 0; i < M.length; i++) if (M[i].key === s.khoaCup.champ) { mj = M[i]; break; }
    if (!mj) return;
    var room = null, R = s.rooms; for (var r = 0; r < R.length; r++) if (R[r].key === mj.room) { room = R[r]; break; }
    if (!room) return;
    var col = mj.color || "#f0c674", px = room.x * T + 4, roof = room.y * T, poleTop = roof - 15;
    ctx.fillStyle = "#33383e"; ctx.fillRect(px, poleTop, 2, roof - poleTop + 2);     // pole
    ctx.fillStyle = "#f0c674"; ctx.fillRect(px - 1, poleTop - 1, 2, 2);              // gold finial
    var baseY = poleTop + 1, L = 12;                                                 // waving triangular pennant
    for (var c = 0; c < L; c++) {
      var hh = Math.max(1, Math.round(7 * (1 - c / L)));
      var yo = Math.round(Math.sin(ts / 220 + c * 0.55) * (c / L) * 2.2);
      ctx.fillStyle = col; ctx.fillRect(px + 2 + c, baseY + yo, 1, hh);
      ctx.fillStyle = "rgba(255,255,255,.28)"; ctx.fillRect(px + 2 + c, baseY + yo, 1, 1); // top glint
    }
  }
  /* a cựu SV strolls back onto campus — biographies made VISIBLE in the watchable layer (the owner's soul:
     "people and trajectories, doing things you like to see"). One transient at a time, separate from the
     student actors (so syncActors never touches it). Walks up the central path → pauses with a line → leaves. */
  var VISIT_OK = { STEVE: 1, KY_SU: 1, FOUNDER: 1, CA_MAP_COIN: 1, QUAN_VAN_MAU: 1, LUONG_ON: 1, THAT_NGHIEP: 1 }; // BI_BAT stays away
  function spawnVisitor(stateOverride) {
    var s = S(), pool = s.alumni.filter(function (a) { return (!a._tpl || a._arrested) && VISIT_OK[a.state] && (!stateOverride || a.state === stateOverride); });
    if (!pool.length) return false;
    var steve = pool.filter(function (a) { return a.state === "STEVE"; });
    var pick = (steve.length && Math.random() < 0.6) ? steve[(Math.random() * steve.length) | 0] : pool[(Math.random() * pool.length) | 0];
    var gx = GW >> 1;
    var L = (CONTENT.visitLines && CONTENT.visitLines[pick.state]) || ["Em về thăm trường ạ."];
    var ln = Array.isArray(L) ? L[(Math.random() * L.length) | 0] : L;  // pick once at spawn (stable through the visit)
    visitor = { a: pick, line: ln, vIdx: SPRITES.hashId(pick.id) % SPRITES.VARIANTS.length, px: gx * T + T / 2, py: GH * T + 16, ty: (GH * T * 0.52) | 0, phase: "in", pause: 0, ph: Math.random() * 6.28 };
    return true;
  }
  function maybeVisitor(ts) {
    if (visitor || ts - lastVisitTs < 42000) return;            // one at a time; min ~42s between visits
    if (Math.random() < 0.004 && spawnVisitor()) sfx("chime");  // rare ambient stroll-back (~once/min); a soft ding marks a returning grad
  }
  function updateVisitor(ts) {
    if (!visitor) return;
    var v = visitor;
    if (v.phase === "in") { v.py -= 0.55; if (v.py <= v.ty) { v.py = v.ty; v.phase = "pause"; v.pause = ts; } }
    else if (v.phase === "pause") { if (ts - v.pause > 4200) v.phase = "out"; }
    else { v.py += 0.6; if (v.py > GH * T + 24) { visitor = null; lastVisitTs = ts; } }
  }
  function drawVisitor(ctx, ts) {
    if (!visitor || !SPRITES.ready()) return;
    var v = visitor, x = v.px | 0, y = v.py | 0, moving = v.phase !== "pause";
    var frame = moving ? (Math.sin(ts / 150 + v.ph) > 0 ? 0 : 1) : 0;
    var spr = SPRITES.sprite(4, v.vIdx, frame); // graduates wear the year-4 (departed) colour
    if (spr) ctx.drawImage(spr, x - 12, y - 30);
    // a small 🎓 marker so a returning alum reads as distinct from current students
    ctx.font = "9px system-ui,sans-serif"; ctx.textAlign = "center"; ctx.fillText("🎓", x + 8, y - 27);
    if (v.phase === "pause") {
      var chip = (CONFIG.ALUM.CHIPS[v.a.state] || "").split(" ")[0];          // the state emoji
      var line = chip + " " + (v.line || "Em về thăm trường ạ.");
      ctx.font = "700 8px 'Be Vietnam Pro',system-ui,sans-serif";
      var pw = (ctx.measureText(line).width + 10) | 0, by = y - 40;
      ctx.fillStyle = "rgba(18,22,30,.92)"; roundRect(ctx, (x - pw / 2) | 0, by - 11, pw, 15, 5); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.fillText(line, x, by - 0.5);
      // little tail
      ctx.fillStyle = "rgba(18,22,30,.92)"; ctx.fillRect(x - 1, by + 4, 3, 2);
    }
    ctx.textAlign = "left";
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
  /* scandal-day — when phốt pile up, the media camps at the cổng (your moral choices, made visible) */
  function scandalMood() { var s = S(); return !!(s.photSeeds && s.photSeeds.length >= 3) || (s.tiengTam < 14 && s.year > 2); }
  function drawNewsVan(ctx, ts) {
    var vx = (GW >> 1) * T + T / 2 - 40, vy = GH * T - 16; // parked just left of the cổng
    ctx.fillStyle = "rgba(20,28,14,.18)"; ctx.fillRect(vx - 1, vy + 9, 24, 2);          // shadow
    ctx.fillStyle = PX.out; ctx.fillRect(vx, vy - 9, 23, 18);                            // body outline
    ctx.fillStyle = "#e8edf2"; ctx.fillRect(vx + 1, vy - 8, 21, 16);                     // white van
    ctx.fillStyle = "#cdd6df"; ctx.fillRect(vx + 1, vy + 2, 21, 6);                      // lower panel shade
    ctx.fillStyle = "#9fd0ff"; ctx.fillRect(vx + 14, vy - 6, 7, 5);                      // windshield
    ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillRect(vx + 15, vy - 6, 3, 2);         // glint
    ctx.fillStyle = "#e0584a"; ctx.fillRect(vx + 3, vy - 5, 8, 5);                       // red logo block (a TV station)
    ctx.fillStyle = "#fff"; ctx.fillRect(vx + 4, vy - 4, 1, 3); ctx.fillRect(vx + 6, vy - 4, 1, 3); ctx.fillRect(vx + 8, vy - 4, 1, 3); // "III" channel marks
    ctx.fillStyle = PX.out; ctx.fillRect(vx + 4, vy + 9, 4, 3); ctx.fillRect(vx + 15, vy + 9, 4, 3); // wheels
    // satellite dish on a mast + a blinking red LIVE dot
    ctx.fillStyle = PX.out; ctx.fillRect(vx + 19, vy - 18, 1, 9);                        // mast
    ctx.fillStyle = "#cdd6df"; ctx.fillRect(vx + 17, vy - 21, 6, 3); ctx.fillStyle = PX.out; ctx.fillRect(vx + 17, vy - 18, 6, 1); // dish
    if (Math.floor(ts / 450) % 2) { ctx.fillStyle = "#ff3b30"; ctx.fillRect(vx + 20, vy - 22, 2, 2); } // LIVE blink
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
    } else if (a.act === "chat") {
      // recess social: a speech bubble with dots that fill in, so clustered students read as a conversation
      ctx.fillStyle = "rgba(255,255,255,.94)"; roundRect(ctx, x + 2, y - 26, 13, 8, 3); ctx.fill();
      var nd = 1 + (Math.floor(ts / 300 + a.id) % 3);
      ctx.fillStyle = "#566071"; for (k = 0; k < nd; k++) ctx.fillRect(x + 4 + k * 3, y - 23, 2, 2);
      ctx.fillStyle = "rgba(255,255,255,.94)"; ctx.fillRect(x + 3, y - 19, 3, 2); // bubble tail
    } else if (a.act === "read") {
      // an open book, pages lit, a line of text scanning down
      ctx.fillStyle = PX.out; ctx.fillRect(x - 5, y - 10, 11, 6);
      ctx.fillStyle = "#f3ead0"; ctx.fillRect(x - 4, y - 9, 4, 4); ctx.fillRect(x + 1, y - 9, 4, 4);
      ctx.fillStyle = "#fbf5e4"; ctx.fillRect(x - 4, y - 9, 4, 1); ctx.fillRect(x + 1, y - 9, 4, 1); // lit top edge
      var ro = Math.floor(ts / 650) % 3; ctx.fillStyle = "#9c8657"; ctx.fillRect(x - 3, y - 7 + ro, 2, 1); ctx.fillRect(x + 2, y - 7 + ((ro + 1) % 3), 2, 1);
    } else if (a.act === "phone") {
      // doom-scroll: a phone glow on the face, the feed sliding by (the sống-ảo undertow, everywhere)
      ctx.fillStyle = "rgba(180,210,255,.14)"; ctx.fillRect(x - 4, y - 14, 9, 8);
      ctx.fillStyle = PX.out; ctx.fillRect(x + 1, y - 11, 4, 7);
      ctx.fillStyle = (Math.floor(ts / 240) % 2) ? "#bfe9ff" : "#8fc8ef"; ctx.fillRect(x + 2, y - 10, 2, 5);
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
    if (!SPRITES.ready()) return;
    var x = a.px | 0, y = a.py | 0;
    // (contact shadow is baked into the 24×32 sprite now)
    var frame = a._moving ? (Math.sin(ts / 150 + a.ph) > 0 ? 0 : 1) : 0;
    var bob = (a.bob || 0) < -0.6 ? -1 : 0;
    var drew = false;
    if (CHARS_N > 0) { // Jephed sprite: face walk direction (left/right rows), front-facing when idle; stride alternates cols 0/2, neutral = col 1
      var ci = ((a.id % 40) + 40) % 40, row, col;
      if (a._moving) { row = a.dir < 0 ? 1 : 2; col = Math.sin(ts / 150 + a.ph) > 0 ? 0 : 2; } else { row = 0; col = 1; }
      ctx.fillStyle = "rgba(0,0,0,.16)"; ctx.fillRect(x - 5, y + 1, 10, 2); ctx.fillRect(x - 3, y, 6, 1); // cheap contact shadow (Jephed sheets have none)
      drew = charFrame(ctx, ci, row, col, x, y - 30 + bob); // 20×32 frame; feet at (x,y+2)
    }
    if (!drew) { // chibi fallback when the sheets haven't loaded / are absent
      var spr = a.lookC ? SPRITES.custom(a.grade, a.lookC, frame) : SPRITES.sprite(a.grade, a.variantIdx, frame);
      if (spr) ctx.drawImage(spr, x - 12, y - 30 + bob); // 24×32 sprite; feet at (x,y)
    }
    // rain: the little people out in it (walking, or at recess on the sân) pop a cheerful umbrella; ~75% carry
    // one, the rest scurry bare-headed. Pure draw, reads the weather layer (iter 77) — ties weather to people.
    if (weather === "rain" && (a.id % 4 !== 0) && (a._moving || a.act === "recess" || a.act === "perform")) {
      var uy = y - 34 + bob, uc = UMB_COLS[a.id % UMB_COLS.length];
      ctx.fillStyle = PX.out;                                   // outline + pole
      ctx.fillRect(x - 1, uy + 3, 2, 6); ctx.fillRect(x - 6, uy + 2, 13, 2); ctx.fillRect(x - 5, uy, 11, 2); ctx.fillRect(x - 3, uy - 2, 7, 2);
      ctx.fillStyle = uc;                                       // colored canopy dome
      ctx.fillRect(x - 5, uy + 2, 11, 1); ctx.fillRect(x - 4, uy + 1, 9, 1); ctx.fillRect(x - 3, uy, 7, 1); ctx.fillRect(x - 2, uy - 1, 5, 1);
      ctx.fillStyle = "rgba(255,255,255,.32)"; ctx.fillRect(x - 3, uy, 2, 1); // glint
    }
    // idle blink — eyes close briefly every few seconds when standing still (eyes at canvas y6-8 → screen y-24)
    if (!drew && !a._moving && !a.glasses && ((ts * 0.0009 + a.ph * 2) % 4.3) < 0.12) { ctx.fillStyle = a.skin; ctx.fillRect(x - 4, y - 24 + bob, 3, 3); ctx.fillRect(x + 1, y - 24 + bob, 3, 3); }
    if (a.special) { // Mai Sương — a small gold sparkle above the head (the old gold frame strokeRect read as a stray "yellow square" on the new sprite — iter 110 bugfix)
      var spy = (y - 35 + Math.sin(ts / 340 + a.ph)) | 0;
      ctx.fillStyle = PX.gold; ctx.fillRect(x, spy, 1, 5); ctx.fillRect(x - 2, spy + 2, 5, 1);
      ctx.fillStyle = "#fff3c0"; ctx.fillRect(x, spy + 2, 1, 1);
    }
    if (a.hb) { ctx.fillStyle = PX.gold; ctx.fillRect(x - 1, y - 34, 2, 2); ctx.fillRect(x - 2, y - 33, 1, 1); ctx.fillRect(x + 1, y - 33, 1, 1); } // scholarship star
    if (a.mentored) { // Mentor's Ledger D2 — a kid you're pouring scarce attention into: a small teal mortarboard, gold tassel (distinct from the gold fav star; the two can coexist)
      var my = (y - 30 + Math.sin(ts / 320 + a.ph) * 1) | 0;
      ctx.fillStyle = "#1c6f68"; ctx.fillRect(x - 3, my + 2, 7, 1); ctx.fillRect(x - 2, my, 5, 2); // cap brim + top
      ctx.fillStyle = "#63e6d6"; ctx.fillRect(x - 1, my, 3, 1);                                    // cap highlight
      ctx.fillStyle = "#1c6f68"; ctx.fillRect(x + 3, my + 2, 1, 3); ctx.fillStyle = PX.gold; ctx.fillRect(x + 3, my + 5, 1, 1); // tassel + gold bead
    }
    if (a.fav) { // followed student — a gold star + a name label overhead, so you bond with your protégé
      var fsy = (y - 39 + Math.sin(ts / 300 + a.ph) * 1.2) | 0;
      if (a.ten) { // floating name pill above the star
        ctx.font = "700 8px 'Be Vietnam Pro',system-ui,sans-serif"; ctx.textAlign = "center";
        var nm = a.ten, pw = (ctx.measureText(nm).width + 7) | 0, ly = fsy - 9;
        ctx.fillStyle = "rgba(18,14,6,.74)"; roundRect(ctx, (x - pw / 2) | 0, ly - 7, pw, 11, 4); ctx.fill();
        ctx.fillStyle = PX.gold; ctx.fillText(nm, x, ly - 0.5);
        ctx.textAlign = "left";
      }
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
  // --- Art epic phase 2: Kenney building composition from 3x3 house blocks (top/mid/base x left/mid/right), native 16px. ---
  var KBLD = {
    grey: [[48, 49, 50], [60, 61, 62], [72, 73, 74]],
    red:  [[52, 53, 54], [64, 65, 66], [76, 77, 78]]
  };
  var KENNEY_BLD = { phonghoc: "red", cangtin: "red", lab: "grey", phongmay: "grey", xuong: "grey" };
  function drawRoomKenney(ctx, r) {
    var d = CONFIG.ROOMS[r.key], B = KBLD[KENNEY_BLD[r.key]];
    var px = r.x * T, py = r.y * T, pw = d.w * T, ph = d.h * T;
    var cols = Math.max(2, Math.round(pw / 16)), rows = Math.max(2, Math.round(ph / 16));
    var ox = px + ((pw - cols * 16) >> 1), oy = py + (ph - rows * 16); // h-centered, base-aligned
    for (var cy = 0; cy < rows; cy++) for (var cx = 0; cx < cols; cx++) {
      var brow = cy === 0 ? 0 : (cy === rows - 1 ? 2 : 1);
      var lane = cx === 0 ? 0 : (cx === cols - 1 ? 2 : 1);
      var s = tileXY(B[brow][lane]);
      ctx.drawImage(TILES, s[0], s[1], 16, 16, ox + cx * 16, oy + cy * 16, 16, 16);
    }
    roomLabel(ctx, (ROOM_STYLE[r.key] && ROOM_STYLE[r.key].short) || d.name, px, py, pw, ph);
  }
  function drawStatic() {
    var ctx = $("mapStatic").getContext("2d"), W = GW * T, H = GH * T;
    ctx.imageSmoothingEnabled = false;
    var rng = mb(1337), i, x, y, tier = campusTier();
    // PASS 1 — ground. Real Kenney grass tiles when loaded; procedural grass as fallback (never breaks).
    if (TILES) {
      var g0 = tileXY(0); // base grass tile
      for (y = 0; y < H; y += TPX) for (x = 0; x < W; x += TPX) ctx.drawImage(TILES, g0[0], g0[1], TPX, TPX, x, y, TPX, TPX);
    } else {
      ctx.fillStyle = tier >= 1 ? PX.grassL : PX.grass; ctx.fillRect(0, 0, W, H); // a touch brighter once established
      for (i = 0; i < (tier >= 1 ? 360 : 520); i++) { // fewer weeds as the grounds get tended
        x = (rng() * W) | 0; y = (rng() * H) | 0; var r = rng();
        ctx.fillStyle = r < 0.5 ? PX.grassD : (r < 0.82 ? PX.grassL : PX.grassT);
        ctx.fillRect(x, y, r < 0.7 ? 1 : 2, 1);
      }
      for (i = 0; i < 70; i++) { x = (rng() * W) | 0; y = (rng() * H) | 0; ctx.fillStyle = PX.grassL; ctx.fillRect(x, y, 1, 2); ctx.fillRect(x - 1, y + 1, 1, 1); ctx.fillRect(x + 1, y + 1, 1, 1); } // little grass blades
    }
    if (tier >= 1) { ctx.fillStyle = "rgba(255,255,255,.05)"; for (y = 8; y < H; y += 16) ctx.fillRect(0, y, W, 3); } // manicured mow stripes
    // PASS 3 — path spine (dirt → stone-edged → fully paved as the school's value rises)
    pathBand(ctx, 0, (GH >> 1) * T, W, T, true, tier);
    pathBand(ctx, (GW >> 1) * T, 0, T, H, false, tier);
    // rooms — y-sorted so lower buildings overlap upper
    var rooms = S().rooms.slice().sort(function (p, q) { return (p.y - q.y) || (p.x - q.x); });
    for (i = 0; i < rooms.length; i++) { if (TILES && KENNEY_BLD[rooms[i].key]) drawRoomKenney(ctx, rooms[i]); else drawRoom(ctx, rooms[i]); }
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
    var nT = 0; for (i = 0; i < free.length && nT < 8; i++) { var f = free[i]; if (!f.u && edge(f)) { var tx = (f[0] * T + T / 2) | 0, ty = (f[1] * T + T / 2 + 8) | 0; if (TILES) kTile(ctx, 4, tx, ty, 26, 26); else tree(ctx, tx, ty - 3); f.u = 1; nT++; } }   // trees hug the border
    var nB = 0; for (i = 0; i < free.length && nB < 7; i++) { f = free[i]; if (!f.u) { var bx = (f[0] * T + T / 2) | 0, by = (f[1] * T + T / 2 + 6) | 0; if (TILES) kTile(ctx, 5, bx, by, 18, 18); else bush(ctx, bx, by - 2); f.u = 1; nB++; } }
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
    var tr = talentReveal(st); // E5: the gift, only as far as the school has discovered it
    // E2 made LEGIBLE (cohesion + mark 5): the kid's GRAIN × the learning style you set for their year → thriving
    // or adrift. Orthogonal to E5 (about direction, not magnitude) → safe to always show; it surfaces WASTE RISK
    // before you know how gifted they are, and points at the fix (change the style, or mentor).
    var _mm = CONFIG.MATCH(st.tell, S().presets["n" + st.grade]);
    var fit = st.mentored ? { t: "🎓 có thầy dìu — tạng nào cũng gỡ lại được phần nào", c: "var(--gold)" }
      : _mm >= 1.3 ? { t: "hợp lối học này — đang nở rộ", c: "var(--green)" }
      : _mm >= 0.9 ? { t: "lối học này tạm hợp", c: "var(--faint)" }
      : { t: "lệch lối học này — tài năng dễ nguội dần (đổi lối học, hoặc dìu dắt)", c: "#f2994a" };
    // iter-132 — TELEGRAPH the burnout (iter-131 made it possible): warn while the kid can still be SAVED, and
    // name the levers — so a dropout is a loss you could fight, not a silent surprise. Only shows when at risk.
    var moodRisk = st.mood < CONFIG.DROPOUT_MOOD + 12 ? { t: "⚠ kiệt sức — nguy cơ bỏ học (dìu dắt hoặc đổi lối học GẤP)", c: "#e57373" }
      : st.mood < CONFIG.MOOD_PENALTY_BELOW ? { t: "tinh thần đang kém — học hành chậm lại", c: "#f2994a" } : null;
    var lookIdx = (typeof st.look === "number" && st.look >= 0 && st.look < SPRITES.VARIANTS.length) ? st.look : SPRITES.hashId(st.id) % SPRITES.VARIANTS.length;
    ins.innerHTML =
      "<div class='ihead'><canvas id='iav' width='24' height='32' style='width:27px;height:36px;image-rendering:pixelated;background:" + (SPRITES.GRADE_C[st.grade] + "22") + ";border-radius:7px;flex-shrink:0'></canvas>" +
      "<div class='grow'><input id='renameIn' value='" + esc(st.ten).replace(/'/g, "&#39;") + "' maxlength='18' style='width:100%;box-sizing:border-box;background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--ink);border-radius:7px;padding:4px 7px;font-family:inherit;font-weight:700;font-size:12px'/>" +
      "<div class='imeta'>Năm " + st.grade + " · " + esc(TELL_TXT[st.tell] || TELL_TXT[""]) + (hb ? " · 🏵️ " + esc(hb) : "") + (st.ten === "Mai Sương" ? " · 🔧" : "") + (S().META.favId === st.id ? " · ⭐ đang theo dõi" : "") + (st.mentored ? " · 🎓 đang dìu dắt" : "") + "</div>" +
      (sjMajor ? "<div class='imeta' style='color:var(--gold)'>" + sjMajor.icon + " " + esc(sjMajor.name) + "</div>" : "") + "</div>" +
      "<button class='ix' id='favBtn' title='Theo dõi'>" + (S().META.favId === st.id ? "⭐" : "☆") + "</button>" +
      "<button class='ix' id='mentorBtn' title='Dìu dắt — dồn tâm sức (tối đa " + CONFIG.MENTOR_SLOTS + ")'>" + (st.mentored ? "🎓" : "➕") + "</button>" +
      "<button class='ix' id='lookBtn' title='Đổi kiểu'>🔄</button>" +
      "<button class='ix' id='ixBtn'>✕</button></div>" +
      "<div class='ibars'>" + ibar("Kiến thức", st.kt, "#bb6bd9") + ibar("Tay nghề", st.tn, "#6fcf97") + ibar("Sáng tạo", st.st, "#6aa9f0") + ibar("Cá mập", st.cm, "#f2994a") + ibar("Tâm trạng", st.mood, "#f2c14e") + "</div>" +
      "<div class='iflav'>Tiềm năng (hạt giống): " + tr.txt + (tr.lvl < 2 ? " <span class='tiny' style='color:var(--faint)'>(dìu dắt để biết rõ)</span>" : "") + " &nbsp;·&nbsp; Tâm sức dìu dắt: " + (HVS.mentorCount ? HVS.mentorCount() : 0) + "/" + CONFIG.MENTOR_SLOTS + "</div>" +
      "<div class='iflav' style='color:" + fit.c + "'>Tạng × lối học: " + fit.t + "</div>" +
      (moodRisk ? "<div class='iflav' style='color:" + moodRisk.c + "'>" + moodRisk.t + "</div>" : "") +
      ((S().META.favId === st.id && S().META.favLog && S().META.favLog.length) ? "<div class='iflav' style='color:var(--gold)'>⭐ Nhật ký dõi theo: " + esc(S().META.favLog.join(" · ")) + "</div>" : "") + // iter-135: the protégé's story-so-far, persistent on their card (only for the kid you follow)
      "<div class='custz'><span class='tiny' style='color:var(--faint)'>Tùy biến:</span>" +
        "<button class='czb' id='cz_s'>🎨 Da</button><button class='czb' id='cz_h'>💇 Tóc</button>" +
        "<button class='czb' id='cz_y'>✂️ Kiểu</button><button class='czb' id='cz_a'>👓 Đồ</button>" +
        "<button class='czb' id='cz_r'>🎲</button></div>";
    if (SPRITES.ready()) { var cx = $("iav").getContext("2d"); cx.imageSmoothingEnabled = false; cx.drawImage(st.lookC ? SPRITES.custom(st.grade, st.lookC, 0) : SPRITES.sprite(st.grade, lookIdx, 0), 0, 0); }
    $("ixBtn").onclick = hideInspect;
    $("favBtn").onclick = function () { var m = S().META; m.favId = (m.favId === id) ? null : id; syncActors(); if (m.favId === id) toast("⭐ Đang theo dõi " + st.ten + " — em ấy sẽ có sao trên sân."); showInspectStudent(id); };
    $("mentorBtn").onclick = function () {
      var r = HVS.mentorStudent(id);
      if (!r.ok) { if (r.why === "full") toast("Hết suất dìu dắt — bạn chỉ dồn tâm sức cho " + CONFIG.MENTOR_SLOTS + " em một lúc. Phải chọn."); return; }
      syncActors();
      toast(r.mentored ? ("🎓 Bắt đầu dìu dắt " + st.ten + " — tâm sức có hạn, không cứu được tất cả.") : ("Thôi dìu dắt " + st.ten + " — một suất tâm sức được giải phóng."));
      showInspectStudent(id);
    };
    $("renameIn").onchange = function () { var v = this.value.trim().slice(0, 18); if (v) { st.ten = v; syncActors(); renderPanel(); } };
    $("lookBtn").onclick = function () { delete st.lookC; st.look = (lookIdx + 1) % SPRITES.VARIANTS.length; syncActors(); showInspectStudent(id); }; // cycle presets (clears custom)
    var cyc = function (axis, n) { st.lookC = Object.assign({}, st.lookC || SPRITES.effLook(st)); st.lookC[axis] = (st.lookC[axis] + 1) % n; syncActors(); showInspectStudent(id); };
    $("cz_s").onclick = function () { cyc("s", SPRITES.SKINS.length); };
    $("cz_h").onclick = function () { cyc("h", SPRITES.HAIRSET.length); };
    $("cz_y").onclick = function () { cyc("y", SPRITES.HAIRSTYLE.length); };
    $("cz_a").onclick = function () { cyc("a", SPRITES.ACC.length); };
    $("cz_r").onclick = function () { st.lookC = { s: (Math.random() * SPRITES.SKINS.length) | 0, h: (Math.random() * SPRITES.HAIRSET.length) | 0, y: (Math.random() * SPRITES.HAIRSTYLE.length) | 0, a: (Math.random() * SPRITES.ACC.length) | 0 }; syncActors(); showInspectStudent(id); };
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
    for (var i = 0; i < actors.length; i++) { var gx = Math.floor(actors[i].px / T), gy = Math.floor(actors[i].py / T); if (gx >= r.x - 1 && gx <= r.x + d.w && gy >= r.y - 1 && gy <= r.y + d.h) cnt++; } // footprint + 1-cell door-ring: students gather ON the ring (assignActivity), not inside — counting only inside read ~0 always (iter 110 bugfix)
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
    // labels read as SPEED, not bare numbers (owner: "pause/1/2 not intuitive") — × multiplier + a hover/long-press tooltip
    [["⏸", 0, "Tạm dừng"], ["1×", 1, "Tốc độ thường"], ["2×", 2, "Nhanh gấp đôi"], ["3×", 3, "Nhanh gấp ba — mở khoá sau Lễ Tốt Nghiệp"]].forEach(function (p) {
      var b = el("button", "spd"); b.textContent = p[0]; b.dataset.v = p[1]; b.title = p[2]; b.setAttribute("aria-label", p[2]);
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
    m.appendChild(meter("m-tt", "TIẾNG TĂM", s.tiengTam, 100, "tt"));
    m.appendChild(meter("m-ut", "UY TÍN", s.uyTin, 100, "ut"));
    m.appendChild(meter("m-tc", "THỰC CHẤT", s.thucChat, 100, "tc"));
    // founding-milestone banner: the next un-earned goal (hidden once the build-up arc is done)
    var gb = $("goalBar"), ms = CONTENT.milestones || [], hit = (s.META.goalsHit || []), cur = null;
    for (var gi = 0; gi < ms.length; gi++) { if (hit.indexOf(ms[gi].key) < 0) { cur = ms[gi]; break; } }
    if (cur) { gb.innerHTML = "<span class='gt'>🎯 Cột mốc</span><span class='gl'>" + esc(cur.goal) + "</span>"; gb.classList.add("show"); }
    else gb.classList.remove("show");
    // celebrate a just-completed milestone (engine sets the flag; we toast + clear)
    if (s._milestoneJustHit) { toast("🎉 " + s._milestoneJustHit); sfx("milestone"); s._milestoneJustHit = null; }
    // 🍎 a Steve emerged — the game's climax (the đề Văn's answer): golden confetti burst + fanfare
    if (_steveSeen >= 0 && (s.META.steves || 0) > _steveSeen) { celebrateUntil = (typeof performance !== "undefined" ? performance.now() : 0) + 5200; toast("🍎 Một 'Steve' ra đời — trường đã có quả táo của riêng mình!"); sfx("grad"); }
    _steveSeen = s.META.steves || 0;
    // 🏆 Cúp Khoa — a khoa just won this year's cup: non-blocking confetti + fanfare (no modal; the watch-flow stays smooth)
    var cy = (s.khoaCup && s.khoaCup.lastYear) || 0;
    if (_cupSeen >= 0 && cy > _cupSeen && s.khoaCup.champ) {
      var cm = CONFIG.MAJORS.filter(function (m) { return m.key === s.khoaCup.champ; })[0];
      if (cm) { celebrateUntil = (typeof performance !== "undefined" ? performance.now() : 0) + 4200; toast("🏆 " + cm.icon + " " + cm.name + " vô địch Cúp Khoa năm " + cy + "!"); sfx("milestone"); }
    }
    _cupSeen = cy;
    // campus glow-up: when the grounds reach a new prestige tier, celebrate + repaint (once per tier)
    var ct = campusTier();
    if (ct > (s.META.campusTier || 0)) { s.META.campusTier = ct; s._mapDirty = true; sfx("milestone"); toast(ct >= 2 ? "🏛️ Trường khang trang hẳn — lối lát đá, đèn sáng cổng." : "🌿 Sân trường gọn gàng hơn — cỏ xén, lối đi sạch sẽ."); }
    // ticker — show the latest real news; during quiet stretches, rotate the dry-humour idle flavour lines
    // (they were defined but never surfaced) so the campus newsfeed always has something to read.
    if (s.news.length) {
      var n = s.news[0], idle = (CONTENT.ticker && CONTENT.ticker.idle) || [];
      var stale = (s.totalDays - (n.t || 0)) > 8 && idle.length;       // no real news for over a "week"
      var line = stale ? idle[Math.floor(s.totalDays / 5) % idle.length] : n.s; // rotate every ~5 days
      $("ticker").innerHTML = "▸ " + esc(line);
    }
  }
  function chip(cls, ic, v) { var c = el("div", "chip " + cls); c.innerHTML = ic + " <span class='v'>" + v + "</span>"; return c; }
  function meter(cls, lab, v, max, key) {
    var d = el("div", "meter " + cls);
    d.innerHTML = "<div class='lab'>" + lab + " <b>" + Math.round(v) + "</b></div><div class='bar'><i style='width:" + Math.max(0, Math.min(100, v / max * 100)) + "%'></i></div>";
    if (key) { d.style.cursor = "pointer"; d.title = "Chạm để xem chỉ số này là gì"; d.onclick = function () { showMeterHelp(key); }; }
    return d;
  }
  // tap a meter → a short thematic explainer (the three meters are the đề Văn's three theses: fame, credibility, substance)
  function showMeterHelp(key) {
    var h = (CONTENT.meterHelp || {})[key]; if (!h) return;
    var s = S(), val = key === "tt" ? s.tiengTam : key === "ut" ? s.uyTin : s.thucChat;
    var bar = key === "tt" ? "#f2c14e" : key === "ut" ? "#6fcf97" : "#b48ef0";
    var w = el("div");
    w.appendChild(el("div", "kic", "Chỉ số của trường"));
    w.appendChild(el("div", "row", "<div class='grow'><div style='font-size:16px;font-weight:800;color:" + bar + "'>" + esc(h.name) + "</div></div><div style='font-size:20px;font-weight:800;color:" + bar + "'>" + Math.round(val) + "</div>"));
    w.appendChild(el("div", "lead", esc(h.what)));
    w.appendChild(el("div", "tiny", "<span style='color:var(--green)'>▲ Tăng khi:</span> " + esc(h.up))).style.marginTop = "5px";
    w.appendChild(el("div", "tiny", "<span style='color:var(--red)'>▼ Giảm khi:</span> " + esc(h.down))).style.marginTop = "3px";
    w.appendChild(el("div", "lead", "“" + esc(h.soul) + "”")).style.cssText = "font-style:italic;color:var(--gold);margin-top:8px";
    var btn = el("button", "btn", "Rõ rồi"); btn.style.width = "100%"; btn.style.marginTop = "10px"; btn.onclick = hideModal;
    w.appendChild(btn);
    openModal(w);
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
    // the philosophy fork made LEGIBLE (owner: "no trade-off guideline for learning style") — each style realizes some, wastes others (DESIGN §1 open question)
    PRESET_KEYS.forEach(function (k) { var pr = CONFIG.PRESETS[k]; if (pr.tradeoff) c1.appendChild(el("div", "tiny", "<b>" + esc(pr.label) + "</b> — " + esc(pr.tradeoff))); });
    wrap.appendChild(c1);

    // tuition
    var c2 = el("div", "card"); c2.appendChild(el("h3", null, "Học phí (mỗi SV / tháng)"));
    var row = el("div", "row"); row.appendChild(el("div", "grow muted", "Thu mỗi tháng: <b style='color:var(--gold)'>" + Math.round(s.tuition * s.students.length) + "tr</b>"));
    var stp = el("div", "stepper");
    var minus = el("button", "step", "−"), val = el("b", null, s.tuition.toFixed(1) + "tr"), plus = el("button", "step", "+");
    minus.onclick = function () { S().tuition = Math.max(CONFIG.TUITION_MIN, +(S().tuition - CONFIG.TUITION_STEP).toFixed(1)); renderPanel(); };
    plus.onclick = function () { S().tuition = Math.min(CONFIG.TUITION_MAX, +(S().tuition + CONFIG.TUITION_STEP).toFixed(1)); renderPanel(); };
    stp.appendChild(minus); stp.appendChild(val); stp.appendChild(plus); row.appendChild(stp); c2.appendChild(row);
    // E15c — the tuition TRADE-OFF made legible (owner: "no guideline for tuition"): ↑ học phí = ↑ thu/SV nhưng
    // ↓ hồ sơ (a pricey school deters applicants). Show the projected applicant pool at the current price.
    c2.appendChild(el("div", "tiny", "↑ Học phí = nhiều thu hơn mỗi SV, nhưng <b>ít hồ sơ nộp về</b> hơn (trường đắt, kén người ghi danh). Mùa tới ước tính <b style='color:var(--gold)'>~" + CONFIG.ADMIT.POOL(s.tiengTam, s.tuition) + " em</b> nộp.")).style.marginTop = "6px";
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
    // E8 — teachers are DRAWN by standing: TT/UT/TC must reach a teacher's req before they'll consider you.
    // Locked ones show as visible aspiration ("cần Tiếng Tăm ≥ 40"), not hidden; available ones float to the top.
    var STAND = { tt: ["Tiếng Tăm", s.tiengTam], ut: ["Uy Tín", s.uyTin], tc: ["Thực Chất", s.thucChat] };
    var teaLocked = function (t) { return t.req && STAND[t.req.m] && STAND[t.req.m][1] < t.req.v; };
    var pool = CONTENT.teachers.pool.filter(function (t) { return !have[t.id]; })
      .sort(function (a, b) { return (teaLocked(a) ? 1 : 0) - (teaLocked(b) ? 1 : 0); });
    if (pool.length) {
      c4.appendChild(el("div", "tiny", "Tuyển thêm — giảng viên tìm về theo tiếng tăm của trường:")).style.margin = "8px 0 5px";
      pool.forEach(function (t) {
        var locked = teaLocked(t);
        var r = el("div", "srow"); if (locked) r.style.opacity = ".55";
        r.innerHTML = "<div class='av' style='background:rgba(240,198,116,.12)'>" + (locked ? "🔒" : "＋") + "</div><div class='grow'><div class='nm'>" + esc(t.ten) + "</div><div class='meta'>Dạy " + t.day + " · Diễn " + t.dien + " · " + esc(t.note) + "</div></div>";
        if (locked) {
          var lk = el("div", "tiny", "cần " + STAND[t.req.m][0] + " ≥ " + t.req.v); lk.style.cssText = "color:var(--faint);white-space:nowrap;align-self:center"; r.appendChild(lk);
        } else {
          var b = el("button", "btn", t.luong + "tr"); b.style.fontSize = "11px"; b.style.padding = "6px 9px";
          b.onclick = function () { S().teachers.push({ id: t.id, ten: t.ten, day: t.day, dien: t.dien, luong: t.luong, trait: t.trait, bienChe: false, age: 0 }); toast("Đã tuyển " + t.ten + "."); HVS.checkMilestones(); render(); };
          r.appendChild(b);
        }
        c4.appendChild(r);
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
      var dflt = "#9aa4b2";
      // inter-khoa STANDING: rank the unlocked khoas that actually have students → 🥇🥈🥉 (only when ≥2 compete),
      // and crown the campus's "khoa nổi bật" this year. Derived live from member counts — no engine/save state.
      var ranked = CONFIG.MAJORS.filter(function (m) { return s.rooms.some(function (r) { return r.key === m.room; }) && (counts[m.key] || 0) > 0; })
        .sort(function (a, b) { return (counts[b.key] || 0) - (counts[a.key] || 0); });
      var rankOf = {}; if (ranked.length >= 2) ranked.forEach(function (m, i) { rankOf[m.key] = ["🥇", "🥈", "🥉"][i] || ""; });
      var cup = s.khoaCup || { trophies: {}, champ: null };
      if (cup.champ) { var ch = CONFIG.MAJORS.filter(function (m) { return m.key === cup.champ; })[0]; if (ch) kc.appendChild(el("div", "tiny", "🏆 Đương kim vô địch Cúp Khoa: <span style='color:" + (ch.color || dflt) + ";font-weight:700'>" + ch.icon + " " + esc(ch.name) + "</span> · cúp ×" + (cup.trophies[ch.key] || 1))).style.marginBottom = "6px"; }
      else if (ranked.length >= 2) { var top = ranked[0]; kc.appendChild(el("div", "tiny", "Khoa nổi bật năm nay: <span style='color:" + (top.color || dflt) + ";font-weight:700'>" + top.icon + " " + esc(top.name) + "</span> <span style='opacity:.6'>· Cúp Khoa tháng 5</span>")).style.marginBottom = "6px"; }
      CONFIG.MAJORS.forEach(function (m) {
        var unlocked = s.rooms.some(function (r) { return r.key === m.room; });
        var cnt = counts[m.key] || 0, need = thr(m.key), syn = cnt >= need, col = m.color || dflt;
        var status = !unlocked ? ("🔒 Xây " + CONFIG.ROOMS[m.room].name + " để mở")
          : (syn ? "<span style='color:var(--green)'>⚡ Cộng hưởng — lớn nhanh hơn</span>" : (cnt + "/" + need + " SV để cộng hưởng"));
        var medal = rankOf[m.key] ? (" " + rankOf[m.key]) : "";
        var troph = (cup.trophies && cup.trophies[m.key]) || 0;
        var trophBadge = troph ? " <span style='color:var(--gold)'>🏆×" + troph + "</span>" : "";
        var row = el("div", "row"); row.style.marginBottom = unlocked ? "2px" : "6px"; if (!unlocked) row.style.opacity = ".5";
        row.style.borderLeft = "3px solid " + col; row.style.paddingLeft = "7px";
        row.innerHTML = "<div class='grow'><div style='font-size:11.5px;font-weight:700'>" + m.icon + " " + esc(m.name) + medal + trophBadge + "</div>" +
          "<div class='tiny' style='font-style:italic;opacity:.78'>" + esc(m.line) + "</div>" +
          "<div class='tiny'>" + status + " · → " + m.dest + "</div></div><div class='schip' style='color:" + col + "'>" + cnt + " SV</div>";
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
        var face = talentReveal(st).lvl >= 2 ? seedFace(st.seed) : "🌱"; // E5: undiscovered gift = a seedling (hạt giống chưa lộ)
        r.innerHTML = "<div class='av' style='background:" + (SPRITES.GRADE_C[g] + "22") + "'>" + face + "</div><div class='grow'><div class='nm'>" + esc(st.ten) + marks + "</div>" + mini + "</div><div class='tiny'>mood " + Math.round(st.mood) + "</div>";
        sl.appendChild(r);
      });
      c.appendChild(sl); wrap.appendChild(c);
    }
    if (!s.students.length) wrap.appendChild(el("div", "empty", "Chưa có sinh viên. Chờ kỳ tuyển sinh tháng 7."));
    return wrap;
  }
  function seedFace(seed) { return ["·", "🙂", "🙂", "😀", "😎", "🤩"][seed] || "🙂"; }
  // E5 — DISCOVERABLE TALENT: a kid's gift is not a number you read off on day one. It reveals as the school
  // SEES them — by years in (grade), or instantly when you MENTOR (pour attention → you learn who they are).
  // The đề Văn bite: an entrance score doesn't measure talent; you have to teach the kid to find out. Pure
  // display — the sim still runs on the true seed; only what the PLAYER knows changes (sweep-neutral).
  function talentReveal(s) {
    if (s.mentored || s.grade >= 3) return { lvl: 2, txt: "★".repeat(s.seed) + "☆".repeat(5 - s.seed) };
    if (s.grade >= 2) { var band = s.seed <= 2 ? "khiêm tốn" : (s.seed === 3 ? "khá" : "có gì đó khác thường"); return { lvl: 1, txt: "đang lộ dần — có vẻ " + band }; }
    return { lvl: 0, txt: "chưa rõ — phải dạy mới biết" };
  }

  // the founder's old cram-school star (Trần Phi Lợi) is seeded for his scripted arrest, but he isn't
  // THIS school's graduate — keep him out of the Sổ until he's actually "lên báo" (arrested).
  function visAlumni() { return S().alumni.filter(function (a) { return !(a._tpl && !a._arrested); }); }
  function panelAlumni() {
    var s = S(), wrap = el("div"), alumni = visAlumni();
    if (!alumni.length) { wrap.appendChild(el("div", "empty", "Chưa có cựu sinh viên.<br>Khoá đầu tốt nghiệp vào Lễ Tốt Nghiệp tháng 6.")); return wrap; }
    var order = { STEVE: 0, BI_BAT: 1 };
    var sorted = alumni.slice().sort(function (a, b) { return (order[a.state] != null ? order[a.state] : 5) - (order[b.state] != null ? order[b.state] : 5) || b.gradYear - a.gradYear; });
    var c = el("div", "card"); c.appendChild(el("h3", null, "Sổ cựu sinh viên · " + alumni.length));
    c.appendChild(el("div", "tiny", "Chạm vào một tên để đọc tiểu sử.")).style.marginBottom = "5px";
    var sl = el("div", "slist");
    sorted.slice(0, 40).forEach(function (a) {
      var r = el("div", "srow"); r.style.cursor = "pointer";
      var chipCls = a.state === "STEVE" ? "schip gold-chip" : a.state === "BI_BAT" ? "schip red-chip" : "schip";
      var line = a.line || (CONTENT.alumLines[a.state] ? CONTENT.alumLines[a.state][0].replace(/\{ten\}/g, a.ten) : "");
      var traj = (a.history && a.history.length > 1) ? "<div class='tiny' style='color:var(--faint);margin-top:2px;letter-spacing:1px'>" + a.history.map(function (h) { return (CONFIG.ALUM.CHIPS[h] || "").split(" ")[0]; }).join(" → ") + "</div>" : "";
      r.innerHTML = "<div class='av' style='background:rgba(255,255,255,.06)'>🎓</div><div class='grow'><div class='nm'>" + esc(a.ten) + " <span class='tiny'>· K" + a.gradYear + "</span></div><div class='meta'>" + esc(line) + "</div>" + traj + "</div><div class='" + chipCls + "'>" + CONFIG.ALUM.CHIPS[a.state] + "</div>";
      r.onclick = function () { showAlumnus(a.id); };
      sl.appendChild(r);
    });
    c.appendChild(sl);
    if (alumni.length > 40) c.appendChild(el("div", "tiny", "… và " + (alumni.length - 40) + " người nữa."));
    wrap.appendChild(c);
    return wrap;
  }
  function gratWord(g) { return g >= 70 ? "biết ơn sâu sắc" : g >= 45 ? "vẫn quý trường" : g >= 20 ? "thi thoảng nhớ" : "ít khi ngoảnh lại"; }
  // tap an alumnus → their full biography: the journey (named states), final stats, the school's quiet good
  // deeds toward them, gifts sent back. Surfaces the rich data the Sổ row only hints at (people, not scores).
  function showAlumnus(id) {
    var a = S().alumni.filter(function (x) { return x.id === id; })[0]; if (!a) return;
    var seed = Math.max(0, Math.min(5, (a.fs && a.fs.seed) || 1));
    var chipCls = a.state === "STEVE" ? "schip gold-chip" : a.state === "BI_BAT" ? "schip red-chip" : "schip";
    var w = el("div");
    w.appendChild(el("div", "kic", "Cựu sinh viên · K" + a.gradYear));
    w.appendChild(el("div", "row", "<div class='av' style='background:rgba(255,255,255,.06);font-size:18px'>🎓</div><div class='grow'><div style='font-size:15px;font-weight:800'>" + esc(a.ten) + "</div><div class='tiny'>Tiềm năng (hạt giống): " + "★".repeat(seed) + "☆".repeat(5 - seed) + "</div></div><div class='" + chipCls + "'>" + CONFIG.ALUM.CHIPS[a.state] + "</div>"));
    if (a.history && a.history.length > 1) w.appendChild(el("div", "lead", "<b>Hành trình:</b> " + a.history.map(function (h) { return CONFIG.ALUM.CHIPS[h] || h; }).join("  →  ")));
    // 🍎 the climax: a Steve's biography IS the đề Văn's answer, embodied — give it the keynote, gold-framed
    if (a.state === "STEVE") {
      var kn = el("div", "lead", "🍎 " + esc(tpl(CONTENT.keynoteLine, { ten: a.ten })));
      kn.style.cssText = "background:linear-gradient(90deg,rgba(240,198,116,.18),rgba(240,198,116,.04));border:1px solid rgba(240,198,116,.4);border-radius:9px;padding:8px 10px;color:var(--gold);font-weight:600";
      w.appendChild(kn);
      w.appendChild(el("div", "tiny", "Câu trả lời cho đề Văn năm ấy — không phải bằng lý lẽ, mà bằng một con người trường này nuôi lớn.")).style.marginTop = "4px";
    }
    var line = a.line || tpl((CONTENT.alumLines[a.state] || ["{ten}."])[0], { ten: a.ten });
    w.appendChild(el("div", "lead", "“" + esc(line) + "”")).style.fontStyle = "italic";
    if (a.fs) w.appendChild(el("div", "ibars", ibar("Kiến thức", a.fs.kt, "#bb6bd9") + ibar("Tay nghề", a.fs.tn, "#6fcf97") + ibar("Sáng tạo", a.fs.st, "#6aa9f0") + ibar("Cá mập", a.fs.cm, "#f2994a")));
    var rel = "Tình cảm với trường: " + gratWord(a.grat || 0) + ".";
    if (a.gifts > 0) rel += " Đã gửi về quỹ " + Math.round(a.gifts) + "tr.";
    w.appendChild(el("div", "tiny", rel)).style.marginTop = "6px";
    if (a.flags && a.flags.vt && a.flags.vt.length) {
      var deeds = a.flags.vt.map(function (k) { return CONTENT.giftVt[k]; }).filter(Boolean);
      if (deeds.length) w.appendChild(el("div", "tiny", "<span style='color:var(--green)'>" + esc(CONTENT.giftHead) + "</span> " + esc(deeds.join(" ")))).style.marginTop = "4px";
    }
    var btn = el("button", "btn", "Đóng sổ"); btn.style.width = "100%"; btn.style.marginTop = "10px"; btn.onclick = hideModal;
    w.appendChild(btn);
    openModal(w);
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
    var ops = Math.round((CONFIG.OPS.base + CONFIG.OPS.perSV * s.students.length) * CONFIG.OPS.rate * Math.max(0, s.year - 1)); // rising overhead w/ size & age
    if (ops > 0) c.appendChild(fundRow("🏛️ Vận hành (trường lớn, càng tốn)", "−" + ops + "tr", "var(--red)"));
    var reinvest = Math.max(0, Math.round((s.cash - CONFIG.CASH_KEEP) * CONFIG.CASH_DRAIN));
    if (reinvest > 0) c.appendChild(fundRow("🏫 Tái đầu tư phần dư", "−" + reinvest + "tr", "var(--red)"));
    var net = income + cpay - sal - maint - ops - reinvest;
    c.appendChild(el("div", "row")).innerHTML = "<div class='grow' style='font-weight:700;font-size:12px;border-top:1px solid var(--line);padding-top:7px'>Cân đối</div><div style='font-weight:700;border-top:1px solid var(--line);padding-top:7px;color:" + (net >= 0 ? "var(--green)" : "var(--red)") + "'>" + (net >= 0 ? "+" : "") + Math.round(net) + "tr</div>";
    // legibility (owner: "not clear how time passes / how money accrues — positive but feels 0đ"): how long a month is + why the bank doesn't balloon
    var monSec = Math.round(CONFIG.TICK_MS * CONFIG.TICKS_PER_DAY * CONFIG.DAYS_PER_MONTH / 1000);
    c.appendChild(el("div", "tiny", "Một <b>tháng</b> ≈ " + monSec + "s ở tốc độ 1× — thu/chi cộng dồn cuối mỗi tháng. Tiền dư trên " + CONFIG.CASH_KEEP + "tr tự tái đầu tư (~3%/th) nên ngân hàng không phình mãi: muốn giàu phải <b>tăng thu</b> (học phí · hợp đồng · uy tín), không chỉ chờ."));
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
    // góp quỹ — the player turns surplus bank cash into endowment (one-way; funds the scholarships
    // below). Late-game money finally has a meaningful decision: invest in the institution's future.
    var surplus = Math.max(0, Math.round(s.cash - CONFIG.CASH_KEEP));
    var gq = el("div", "row"); gq.style.gap = "6px"; gq.style.flexWrap = "wrap";
    gq.appendChild(el("div", "tiny grow", "Góp tiền trường vào quỹ — đổi tiền hôm nay lấy thế hệ mai sau (không rút lại được). Bank: " + Math.round(s.cash) + "tr."));
    function gopBtn(label, amtOf) {
      var b = el("button", "btn", label); b.style.fontSize = "11px"; b.style.padding = "6px 9px";
      b.onclick = function () {
        var amt = amtOf();
        if (amt <= 0) { toast("Không đủ tiền trong ngân hàng."); return; }
        var moved = HVS.contributeQuy(amt);
        if (moved <= 0) { toast("Không đủ tiền trong ngân hàng."); return; }
        toast("🌱 Đã góp " + Math.round(moved) + "tr vào quỹ hiến tặng."); sfx("chime");
        renderPanel();
      };
      return b;
    }
    gq.appendChild(gopBtn("+100tr", function () { return s.cash >= 100 ? 100 : 0; }));
    gq.appendChild(gopBtn("+500tr", function () { return s.cash >= 500 ? 500 : 0; }));
    if (surplus >= 100) gq.appendChild(gopBtn("Góp phần dư (" + surplus + "tr)", function () { return Math.max(0, Math.round(s.cash - CONFIG.CASH_KEEP)); }));
    ce.appendChild(gq);
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
    var eb = el("button", "btn", CONTENT.essay.openBtn); eb.id = "essayBtn"; eb.style.marginTop = "9px"; eb.style.width = "100%";
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
    function pick(arr) { return arr.slice().sort(function (a, b) { return ((b.flags && b.flags.prize ? 1 : 0) - (a.flags && a.flags.prize ? 1 : 0)) || (b.grat - a.grat) || ((b.gifts || 0) - (a.gifts || 0)); }); } // E7p: an honored standout is essay-worthy → floats up in each cast pick (so the epilogue shows the prizes)
    var cast = [], used = {}, total = s.alumni.length, i;
    pick(s.alumni.filter(function (a) { return a.state === "STEVE"; })).slice(0, C.STEVE_CAP).forEach(function (a) { cast.push(a); used[a.id] = 1; });
    // THESIS §D2 — the poignant core: the essay MUST name one gift the school failed to realize. Loud waste
    // first (thất nghiệp / lệch hướng); if the school produced none, the QUIET waste E4 surfaces — a prodigy
    // who merely SETTLED into 💼 lương ổn (craft's grief, previously invisible). Either way the question stays open.
    var byReal = function (a, b) { return (b.fs.seed - a.fs.seed) || (b.grat - a.grat); };
    var prodigy = s.alumni.filter(function (a) { return !used[a.id] && a.fs && realClass(a.state, a.fs.seed) === "loud"; }).sort(byReal)[0]
      || s.alumni.filter(function (a) { return !used[a.id] && a.fs && realClass(a.state, a.fs.seed) === "under"; }).sort(byReal)[0];
    if (prodigy && cast.length < C.CAST_CAP) { cast.push(prodigy); used[prodigy.id] = 1; }
    pick(s.alumni.filter(function (a) { return a.state === "BI_BAT"; })).slice(0, C.BIBAT_CAP).forEach(function (a) { if (cast.length < C.CAST_CAP) { cast.push(a); used[a.id] = 1; } });
    // E4.1 — the mentor's hand, named: a kid you spent scarce attention on who reached a realized life (💼 lương
    // ổn or better) WITHOUT a grief reading — your attention rescued them. Turns the inaction-cost (a sweep
    // number) into the felt attachment payoff: your invested kid, seen by name. Prefer the strongest realization.
    var mentee = s.alumni.filter(function (a) { return !used[a.id] && a.flags && a.flags.mentored && flourishOf(a.state) >= 2 && !realClass(a.state, a.fs.seed); })
      .sort(function (a, b) { return (flourishOf(b.state) - flourishOf(a.state)) || (b.grat - a.grat); })[0];
    if (mentee && cast.length < C.CAST_CAP) { cast.push(mentee); used[mentee.id] = 1; }
    if (majorityKey) {
      var maj = pick(s.alumni.filter(function (a) { return a.state === majorityKey && !used[a.id]; }));
      if (maj[0] && cast.length < C.CAST_CAP) { cast.push(maj[0]); used[maj[0].id] = 1; }
      if (maj[1] && cast.length < C.CAST_CAP && (byState[majorityKey] / Math.max(1, total)) >= C.SAME_STATE_RATIO) { cast.push(maj[1]); used[maj[1].id] = 1; }
    }
    var order = Object.keys(byState).filter(function (k) { return k !== "STEVE" && k !== "BI_BAT" && k !== majorityKey; }).sort(function (a, b) { return byState[b] - byState[a]; });
    for (i = 0; i < order.length && cast.length < C.CAST_CAP; i++) { var ex = pick(s.alumni.filter(function (a) { return a.state === order[i] && !used[a.id]; }))[0]; if (ex) { cast.push(ex); used[ex.id] = 1; } }
    return cast;
  }
  // a beautiful, screenshot-able summary card of the player's answer to the đề Văn (shareability + BITE)
  function shareCard(s, branch) {
    var V = { steve: ["🍎", "Có. Ít nhất một quả táo đã chín."], coin: ["🪙", "Có 'Steve' — nhưng là Steve chốt đơn hội nhóm."],
      vanmau: ["📋", "Trường dạy giỏi. Đời cần bản sao đẹp."], that: ["🌧️", "Tiềm năng thì nhiều, chỗ đứng thì ít."],
      kysu: ["👷", "Không phải Jobs. Nhưng nước cần kỹ sư thật."], hype: ["📣", "Nổi tiếng trước, thực chất tính sau."],
      thuc: ["🛠️", "Thực chất đầy mình — chỉ đợi thời lên tiếng."], kind: ["🌱", "Một ngôi trường tử tế. Câu hỏi vẫn mở."] }[branch] || ["🌱", "Câu hỏi vẫn mở."];
    var W = 600, H = 300, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    cv.style.cssText = "width:100%;border-radius:12px;display:block;margin-bottom:11px;border:1px solid var(--line)";
    var x = cv.getContext("2d"), F = function (w, sz, c) { x.fillStyle = c; x.font = (w ? w + " " : "") + sz + "px 'Be Vietnam Pro',system-ui,sans-serif"; };
    var bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#17212e"); bg.addColorStop(1, "#0b1018"); x.fillStyle = bg; x.fillRect(0, 0, W, H);
    x.strokeStyle = "#f0c674"; x.lineWidth = 3; x.strokeRect(7, 7, W - 14, H - 14);
    x.textAlign = "left";
    F("800", 31, "#f0c674"); x.fillText("Học viện Steve", 30, 54);
    F("600", 15, "#9aa4b2"); x.fillText("Bản tổng kết · Năm " + s.year, 30, 78);
    F("italic 500", 13, "#6b7484"); x.fillText("“Làm thế nào để VN có những 'Steve Jobs Việt Nam'?”", 30, 106);
    x.font = "62px system-ui,sans-serif"; x.fillText(V[0], 32, 184);
    F("700", 19, "#eef1f5"); // wrap the verdict to the right of the icon
    (function () { var words = V[1].split(" "), line = "", yy = 156; for (var i = 0; i < words.length; i++) { var t = line + words[i] + " "; if (x.measureText(t).width > W - 150 && line) { x.fillText(line.trim(), 116, yy); line = words[i] + " "; yy += 26; } else line = t; } x.fillText(line.trim(), 116, yy); })();
    F("600", 16, "#9aa4b2"); x.fillText("🎓 " + s.META.graduated + "    🍎 " + s.META.steves + "    🚔 " + s.META.arrested, 30, 244);
    F("500", 12, "#6b7484"); x.fillText("techeese.github.io/steve-job-vietnam", 30, 276);
    F("600", 12, "#f0c674"); x.textAlign = "right"; x.fillText("#HọcViệnSteve · đề Văn 2026", W - 30, 276);
    return cv;
  }
  // make the end-card actually shareable: native share sheet on mobile (with the PNG), download fallback on desktop
  function saveShareCard(cv) {
    try {
      if (cv.toBlob) {
        cv.toBlob(function (blob) {
          if (!blob) { toast("Không tạo được ảnh — chụp màn hình nhé."); return; }
          try {
            if (navigator.share && navigator.canShare) {
              var file = new File([blob], "hoc-vien-steve.png", { type: "image/png" });
              if (navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: "Học viện Steve", text: "Câu trả lời của tôi cho đề Văn 2026." }).catch(function () {}); return; }
            }
          } catch (e) {}
          var url = URL.createObjectURL(blob), a = document.createElement("a"); a.href = url; a.download = "hoc-vien-steve.png"; a.click();
          setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) {} }, 1500);
          toast("Đã lưu ảnh tổng kết.");
        }, "image/png");
      } else { var a2 = document.createElement("a"); a2.href = cv.toDataURL("image/png"); a2.download = "hoc-vien-steve.png"; a2.click(); toast("Đã lưu ảnh tổng kết."); }
    } catch (e) { toast("Không lưu được — chụp màn hình nhé."); }
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
    var card = shareCard(s, branchKey); w.appendChild(card); // a summary of the player's answer…
    var save = el("button", "btn", "💾 Lưu / chia sẻ ảnh tổng kết"); save.style.cssText = "width:100%;margin-bottom:11px;font-size:12px"; // …now actually saveable/shareable
    save.onclick = function () { saveShareCard(card); };
    w.appendChild(save);
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
        var seed = (a.fs && a.fs.seed) || 0, stars = "★".repeat(seed) + "☆".repeat(5 - seed);
        var gap = CONTENT.realGap[realClass(a.state, seed)] || ""; // E4 §C-2: name the gift-vs-fate — loud waste, or the prodigy who SETTLED (one quiet line; the on-target realized get their nod via stars + chip)
        if (!gap && a.flags && a.flags.diamond && flourishOf(a.state) >= 4) gap = CONTENT.diamondCredit; // E-UNDERDOG: overlooked at entry, realized anyway — the exam was wrong (takes precedence over the mentor credit)
        else if (!gap && a.flags && a.flags.mentored && flourishOf(a.state) >= 2) gap = CONTENT.mentorCredit; // E4.1: a realized life under your hand — credit the scarce attention (never stacked on a waste suffix)
        var prize = (a.flags && a.flags.prize && CONTENT.prizes[a.flags.prize]) ? " <span class='tiny' style='color:var(--gold)'>🏅 " + esc(CONTENT.prizes[a.flags.prize]) + "</span>" : ""; // E7p: a standout's earned honor, on their life
        P("lead", esc(a.ten) + " <span class='tiny' style='color:var(--gold);letter-spacing:1px'>" + stars + "</span> — " + CONFIG.ALUM.CHIPS[a.state] + esc(tail) + gap + prize + "<br>“" + esc(line) + "”");
      });
      // iter-142 — the WHOLE cohort beyond the 4 named, felt as a headmaster's qualitative reflection (VISION
      // "prose not a meter" — NO per-fate counts). Makes the "wide range of outcomes" land for the other ~92.
      if (s.alumni.length > 6) {
        var fOf = function (ks) { var n = 0; ks.forEach(function (k) { n += byState[k] || 0; }); return n; }, tot = s.alumni.length;
        var rz = fOf(["KY_SU", "FOUNDER", "LUONG_ON", "STEVE"]), wz = fOf(["THAT_NGHIEP", "QUAN_VAN_MAU"]), dz = fOf(["CA_MAP_COIN", "BI_BAT"]), ps = [];
        if (rz > tot * 0.4) ps.push("phần lớn nên người tử tế, đi làm đều"); else if (rz > tot * 0.12) ps.push("một số thành người tử tế");
        if (wz > tot * 0.25) ps.push("nhiều đứa tài năng cứ thế nguội dần"); else if (wz > 0) ps.push("vài đứa tài năng nguội dần");
        if (dz > tot * 0.18) ps.push("không ít đứa lạc sang đường tắt"); else if (dz > 0) ps.push("một hai đứa lạc sang đường tắt");
        if (ps.length) P("lead", "Còn lại trong sổ: " + ps.join("; ") + ".", true);
      }
      if (s.META.dropped > 0) P("lead", "Và " + s.META.dropped + " em đã rời sân trường giữa chừng — kiệt sức, không trụ nổi. Những cái tên tôi không kịp ghi vào sổ.", true); // iter-131: the burnout losses, mourned (the uncounted waste)
      // iter-133 — the FOLLOW-LOOP's capstone payoff: the kid you watched across the years, named in the final
      // essay with a personal coda woven from their fate (the grad-results nod is transient; THIS is the keepsake).
      var proteges = s.alumni.filter(function (a) { return a.flags && a.flags.protege; }).sort(function (a, b) { return (b.gradYear || 0) - (a.gradYear || 0); });
      if (proteges[0]) {
        var pg = proteges[0], pseed = (pg.fs && pg.fs.seed) || 0, pcls = realClass(pg.state, pseed);
        var coda = pcls === "loud" ? "tài năng ấy, mình đã không giữ được" : pcls === "under" ? "đáng lẽ em đã có thể hơn — mình vẫn nghĩ thế" : flourishOf(pg.state) >= 4 ? "em nên người — mình có góp một tay" : "một cuộc đời tử tế, mình mừng cho em";
        P("lead", "Và " + esc(pg.ten) + " — đứa em dõi theo từ ngày đầu — giờ là " + CONFIG.ALUM.CHIPS[pg.state] + ". " + coda + ".", true);
      }
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
    var nm = t ? t.ten : "Một sinh viên";
    w.appendChild(el("div", "kic", "Tình huống"));
    w.appendChild(el("h2", null, esc((ev.title || "").replace(/\{ten\}/g, nm))));   // titles support {ten} too (fixes kietSuc)
    w.appendChild(el("div", "lead", esc((ev.desc || "").replace(/\{ten\}/g, nm))));
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
    _assetsReady: function () { return { tiles: !!TILES, chars: CHARS_N }; }, // test hook: has the art (Kenney tiles / Jephed sheets) finished loading?
    _essayText: function () { return essayDraft(true).textContent; }, // evolution-engine sensor: the player-facing epilogue essay (named biographies + the waste lines) as plain text, for the L2 critic's biography-read (THESIS §D marks 1/2/4)
    setWeather: function (w) { setWeather(w); weatherT = 1e15; }, // test hook: pin weather (rays/rain/clear) + freeze auto-cycle
    checkModals: function () { checkModals(); }, // test hook: render whatever modal the current pending* state implies
    spawnVisitor: function (state) { var ok = spawnVisitor(state); if (ok && visitor) { visitor.py = visitor.ty; visitor.phase = "pause"; visitor.pause = 0; } return ok; }, // test hook: pose a returning alum at the bubble
    tapTile: function (gx, gy) { resolveTap(gx * T + T / 2, gy * T + T / 2, gx, gy); return $("inspect").classList.contains("show") ? ($("inspect").querySelector(".iname") ? "room" : "student") : "none"; },
    _sel: function () { return { stu: selStudent, room: selRoom }; },
    _drawSel: function () { var ctx = $("mapLive").getContext("2d"); ctx.imageSmoothingEnabled = false; drawSelection(ctx, 800); },
    rooms: function () { return S().rooms.map(function (r) { return { key: r.key, x: r.x, y: r.y }; }); },
    // test hooks (headless rAF is throttled, so drive sync/walk manually): inspect actor
    // positions, force a roster sync, and step the walk N frames under a pinned period.
    _dbgActors: function () { return actors.map(function (a) { return { py: Math.round(a.py), arr: !!a._arriving, lv: !!a._leaving }; }); },
    _sync: function (init) { syncActors(init); },
    _bakeSheet: function () { var c = $("mapStatic"), X = c.getContext("2d"); X.imageSmoothingEnabled = false; X.fillStyle = "#79b34a"; X.fillRect(0, 0, c.width, c.height); var sc = 4, per = 4, A = SPRITES.atlas(); for (var v = 0; v < A[0].length; v++) { var spr = A[0][v][0]; var col = v % per, row = (v / per) | 0; X.drawImage(spr, 8 + col * 104, 8 + row * 140, 24 * sc, 32 * sc); } },
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
