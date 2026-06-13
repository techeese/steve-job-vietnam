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

  /* ---------------- boot ---------------- */
  var tab = "ops", placingKey = null, lastSig = "", soundOn = false;
  var actors = [], walk = null;

  function boot() {
    if (!HVS.loadGame()) { /* fresh already set */ }
    var q = location.search.match(/seed=(\d+)/);
    if (q && (!localStorage.getItem(CONFIG.SAVE_KEY))) HVS.freshState(parseInt(q[1], 10));
    soundOn = !!S().META.sound;
    $("schoolSub").textContent = CONTENT.schoolSub;
    buildSpeeds(); buildTabs();
    rebuildWalk(); syncActors(true);
    drawStatic(); render(); requestAnimationFrame(liveLoop);
    $("mapHint").textContent = "Chạm vào sinh viên hoặc phòng để xem chi tiết.";
    setInterval(loopTick, CONFIG.TICK_MS);
    setInterval(function () { HVS.saveGame(); }, 4000);
    $("soundBtn").onclick = toggleSound;
    $("mapStatic").addEventListener("click", onMapClick);
    document.addEventListener("visibilitychange", function () { if (document.hidden) HVS.saveGame(); });
    if (soundOn) startSound();
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
    S()._mapDirty = false;
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
      a.grade = s.grade; a.color = GRADE_C[s.grade] || "#9aa4b2"; a.special = (s.ten === "Mai Sương"); a.hb = !!(s.flags && s.flags.hb);
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
    var moving = S().speed > 0 && !anyModal();
    for (var i = 0; i < actors.length; i++) updateActor(actors[i], moving, ts);
    actors.sort(function (a, b) { return a.py - b.py; });
    for (i = 0; i < actors.length; i++) drawActor(ctx, actors[i], ts);
    requestAnimationFrame(liveLoop);
  }
  function updateActor(a, moving, ts) {
    var tgx = a.tx * T + T / 2, tgy = a.ty * T + T / 2;
    var dx = tgx - a.px, dy = tgy - a.py, dist = Math.hypot(dx, dy);
    if (dist < 1.5) {
      if (a.wait > 0) { a.wait -= 1; }
      else { var nt = randWalkTile(); a.tx = nt[0]; a.ty = nt[1]; a.wait = (Math.random() * 50) | 0; }
    } else {
      var sp = 0.45 + (a.grade === 1 ? 0.1 : 0); // gentle, slightly faster freshers
      a.px += (dx / dist) * sp; a.py += (dy / dist) * sp;
      a.dir = dx < 0 ? -1 : 1;
    }
    a.bob = Math.sin(ts / 180 + a.ph) * (dist > 1.5 ? 1.4 : 0.4);
  }
  function drawActor(ctx, a, ts) {
    var x = a.px, y = a.py + (a.bob || 0);
    // shadow
    ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.beginPath(); ctx.ellipse(x, a.py + 6, 5, 2.2, 0, 0, 6.28); ctx.fill();
    // body
    ctx.fillStyle = a.color;
    roundRect(ctx, x - 4, y - 1, 8, 8, 2.4); ctx.fill();
    // head
    ctx.fillStyle = "#f4d9b8"; ctx.beginPath(); ctx.arc(x, y - 4, 3.4, 0, 6.28); ctx.fill();
    // hair
    ctx.fillStyle = "#2a2018"; ctx.beginPath(); ctx.arc(x, y - 5, 3.4, Math.PI, 0); ctx.fill();
    if (a.special) { ctx.strokeStyle = "#f0c674"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y - 4, 5.4, 0, 6.28); ctx.stroke(); }
    if (a.hb) { ctx.fillStyle = "#f0c674"; ctx.fillText && (ctx.font = "6px sans-serif", ctx.fillText("✦", x + 3, y - 6)); }
  }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function drawStatic() {
    var ctx = $("mapStatic").getContext("2d");
    // ground
    var g = ctx.createLinearGradient(0, 0, 0, GH * T);
    g.addColorStop(0, "#17211b"); g.addColorStop(1, "#121a16");
    ctx.fillStyle = g; ctx.fillRect(0, 0, GW * T, GH * T);
    // subtle tile texture
    for (var x = 0; x < GW; x++) for (var y = 0; y < GH; y++) {
      if ((x + y) % 2 === 0) { ctx.fillStyle = "rgba(255,255,255,.012)"; ctx.fillRect(x * T, y * T, T, T); }
    }
    // central path cross (cosmetic)
    ctx.fillStyle = "rgba(190,170,120,.10)";
    ctx.fillRect(0, (GH >> 1) * T - 3, GW * T, T + 6);
    ctx.fillRect((GW >> 1) * T - 3, 0, T + 6, GH * T);
    // rooms
    var rooms = S().rooms;
    for (var i = 0; i < rooms.length; i++) drawRoom(ctx, rooms[i]);
    // placement ghost handled in live layer overlay text
  }
  function drawRoom(ctx, r) {
    var d = CONFIG.ROOMS[r.key], sk = ROOM_SKIN[r.key] || { c: "#444", e: "▫", g: "#666" };
    var x = r.x * T, y = r.y * T, w = d.w * T, h = d.h * T;
    ctx.fillStyle = sk.c; roundRect(ctx, x + 1.5, y + 1.5, w - 3, h - 3, 5); ctx.fill();
    // roof highlight
    ctx.fillStyle = "rgba(255,255,255,.08)"; roundRect(ctx, x + 1.5, y + 1.5, w - 3, Math.min(10, h / 3), 5); ctx.fill();
    ctx.strokeStyle = sk.g; ctx.lineWidth = 1.4; roundRect(ctx, x + 1.5, y + 1.5, w - 3, h - 3, 5); ctx.stroke();
    // icon
    ctx.font = "14px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(sk.e, x + w / 2, y + h / 2 - 4);
    // name
    ctx.font = "700 8px 'Be Vietnam Pro',sans-serif"; ctx.fillStyle = "rgba(255,255,255,.82)";
    ctx.fillText(d.name, x + w / 2, y + h - 8);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
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
  var actx = null, soundTimer = null;
  function toggleSound() {
    soundOn = !soundOn; S().META.sound = soundOn;
    $("soundBtn").classList.toggle("on", soundOn);
    if (soundOn) startSound(); else stopSound();
  }
  function startSound() {
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      $("soundBtn").classList.add("on");
      var scale = [0, 2, 4, 7, 9]; var base = 220;
      function note() {
        if (!soundOn || !actx) return;
        var n = scale[(Math.random() * scale.length) | 0] + (Math.random() < 0.4 ? 12 : 0);
        var f = base * Math.pow(2, n / 12);
        var o = actx.createOscillator(), gn = actx.createGain();
        o.type = "sine"; o.frequency.value = f;
        o.connect(gn); gn.connect(actx.destination);
        var t = actx.currentTime;
        gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(0.05, t + 0.6);
        gn.gain.exponentialRampToValueAtTime(0.0008, t + 2.6);
        o.start(t); o.stop(t + 2.7);
        soundTimer = setTimeout(note, 1400 + Math.random() * 1600);
      }
      note();
    } catch (e) { soundOn = false; }
  }
  function stopSound() { soundOn = false; $("soundBtn").classList.remove("on"); if (soundTimer) clearTimeout(soundTimer); }

  /* ---------------- utils ---------------- */
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var toastTimer = null;
  function toast(msg) { var t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1900); }

  // tiny test hook (screenshots / future gates) — view-only, no game mutation
  window.__ui = {
    inspectStudent: showInspectStudent, inspectRoom: showInspectRoom, hideInspect: hideInspect,
    firstStudentId: function () { return S().students[0] && S().students[0].id; },
    setTab: function (t) { tab = t; render(); }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
