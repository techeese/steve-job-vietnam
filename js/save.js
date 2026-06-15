/* ============================================================================
   save.js — SAVE / LOAD / SANITIZE  (the persistence subsystem)
   iter-199 STRUCTURE carve: pulled out of engine.js (1129→~990) as a cohesive,
   gate-verifiable unit (the gate already round-trips a save). Globals, loaded
   AFTER engine.js (for S/_nextId/freshState/clamp/r1/majorByKey/teacherById/
   annMonthFor) and person.js (for realFrac) — every function here runs only at
   RUNTIME (after all scripts load), so the in-scope globals are always defined.
   The S.v migrator + Number.isFinite discipline keep old/corrupted saves from breaking.
   ========================================================================== */
function saveGame() {
  try { localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(serialize())); } catch (e) {}
}
function serialize() {
  var o = {}; for (var k in S) { if (k === "_mapDirty" || k === "_lastNod" || k === "_giftFlush" || k === "_milestoneJustHit") continue; o[k] = S[k]; } // transient UI flags aren't persisted
  return o;
}
function loadGame() {
  var raw = null; try { raw = localStorage.getItem(CONFIG.SAVE_KEY); } catch (e) {}
  if (!raw) { freshState(); return false; }
  var data; try { data = JSON.parse(raw); } catch (e) { freshState(); return false; }
  freshState();
  if (data && data.v === 1) data = migrateV1(data);
  mergeInto(S, data);
  // mergeInto only copies keys present in the FRESH base, so dynamic-key MAPS (fresh value {}) and null→value
  // fields are dropped — restore them explicitly here, then sanitize() validates. (Bug found iter 103: khoaCup
  // trophies/champ + khoaHead trưởng-khoa assignments were silently lost on every reload.)
  if (data && typeof data === "object") {
    if (data.khoaHead && typeof data.khoaHead === "object") S.khoaHead = data.khoaHead;
    if (data.corpBlacklist && typeof data.corpBlacklist === "object") S.corpBlacklist = data.corpBlacklist;
    if (data.khoaCup && typeof data.khoaCup === "object") {
      if (data.khoaCup.trophies && typeof data.khoaCup.trophies === "object") S.khoaCup.trophies = data.khoaCup.trophies;
      if (data.khoaCup.champ != null) S.khoaCup.champ = data.khoaCup.champ;
    }
    if (data.META && data.META.favId != null) S.META.favId = data.META.favId; // null→number: the followed protégé (⭐) — same drop-class as champ
  }
  // restore id counter above anything loaded
  var maxId = 0;
  S.students.concat(S.alumni).forEach(function (x) { if (x && x.id > maxId) maxId = x.id; });
  _nextId = maxId + 1;
  sanitize();
  return true;
}
function mergeInto(base, data) {
  if (!data || typeof data !== "object") return;
  for (var k in base) {
    if (!(k in data)) continue;
    var bv = base[k], dv = data[k];
    if (Array.isArray(bv)) { if (Array.isArray(dv)) base[k] = dv; }
    else if (bv && typeof bv === "object") { if (dv && typeof dv === "object") mergeInto(bv, dv); }
    else if (typeof bv === "number") { if (Number.isFinite(dv)) base[k] = dv; }
    else if (typeof bv === typeof dv) base[k] = dv;
  }
}
function migrateV1(d) {
  // best-effort: v1 (clicker-school) → v2 university. No real v1 players exist,
  // but GATE_COMPAT exercises this path.
  var gmap = { g10: 2, g11: 3, g12: 4 };
  var out = { v: 2 };
  out.presets = { n1: "canbang", n2: (d.presets && d.presets.g10) || "luyende", n3: (d.presets && d.presets.g11) || "luyende", n4: (d.presets && d.presets.g12) || "luyende" };
  if (Array.isArray(d.students)) out.students = d.students.map(function (s) { var g = gmap[s.grade] || (typeof s.grade === "number" ? clamp(s.grade, 1, 4) : 1); s.grade = g; s.flags = s.flags || { vt: [] }; if (!s.flags.vt) s.flags.vt = []; return s; });
  if (d.sponsor && d.sponsor.accepted) out.contracts = [{ id: 1, co: "trungvang", type: "pr", pay: 12, mLeft: 10, strings: ["pr"] }];
  var emap = { jobs: "STEVE", camap: "CA_MAP_COIN", vanmau: "QUAN_VAN_MAU", kysu: "KY_SU", reviewer: "LUONG_ON", luongon: "LUONG_ON" };
  if (Array.isArray(d.alumni)) out.alumni = d.alumni.map(function (a, i) {
    var id = a.id || (1000 + i);
    return { id: id, ten: a.ten || ("Cựu SV " + i), gradYear: a.year || 1, outcome: a.outcome || "luongon", state: emap[a.outcome] || "LUONG_ON", yearsInState: 0, annMonth: annMonthFor(id), fs: { kt: 55, tn: 50, st: 45, cm: 50, vet: 30, seed: 3 }, grat: 50, gifts: 0, flags: { vt: [] } };
  });
  // keep economy/meters if present
  ["cash", "book", "tuition"].forEach(function (k) { if (Number.isFinite(d[k])) out[k] = d[k]; });
  return out;
}
function sanitize() {
  var bad = function (v) { return !Number.isFinite(v); };
  ["cash", "book", "tuition", "tiengTam", "uyTin", "thucChat", "utYearNet"].forEach(function (k) { if (bad(S[k])) S[k] = 0; });
  S.day = clamp(Math.round(S.day) || 1, 1, 30); S.month = clamp(Math.round(S.month) || 1, 1, 12);
  S.year = Math.max(1, Math.round(S.year) || 1); S.speed = clamp(Math.round(S.speed) || 0, 0, 3);
  if (typeof S.schoolName !== "string" || !S.schoolName.trim()) S.schoolName = CONTENT.schoolName; // iter-186: never a blank academy name on a corrupted/old save
  if (!CONFIG.PRESETS[S.presets.n1]) S.presets.n1 = "canbang";
  ["n1", "n2", "n3", "n4"].forEach(function (k) { if (!CONFIG.PRESETS[S.presets[k]]) S.presets[k] = "canbang"; });
  S.students = (S.students || []).map(function (s) {
    if (!s) return null;
    if (bad(s.kt) || bad(s.tn) || bad(s.st) || bad(s.cm) || bad(s.vet)) return null;
    s.grade = clamp(Math.round(s.grade) || 1, 1, 4);
    s.seed = clamp(Math.round(s.seed) || 1, 1, 5);
    ["kt", "tn", "st", "cm", "vet", "mood"].forEach(function (k) { s[k] = clamp(s[k], 0, 100); });
    s.mentored = !!s.mentored; // Phase 2 attention flag (defaults false on older saves)
    if (!s.flags) s.flags = {}; if (!s.flags.vt) s.flags.vt = [];
    if (s.lookC && (typeof s.lookC !== "object" || !Number.isFinite(s.lookC.s) || !Number.isFinite(s.lookC.h) || !Number.isFinite(s.lookC.y) || !Number.isFinite(s.lookC.a))) delete s.lookC; // custom look (UI clamps ranges on use)
    return s;
  }).filter(Boolean).slice(0, CONFIG.ROSTER_CAP * 3); // iter-166: generous corruption guard (well above the scaled rosterCap ~89) so a big-campus save never drops enrolled students on reload
  var _mc = 0; S.students.forEach(function (s) { if (s.mentored) { _mc++; if (_mc > CONFIG.MENTOR_SLOTS) s.mentored = false; } }); // Phase 2: never exceed the attention budget (heals a corrupted save)
  if (bad(S.endow.bal) || S.endow.bal < 0) S.endow.bal = 0;
  S.endow.milestonesClaimed = clamp(Math.round(S.endow.milestonesClaimed) || 0, 0, 3);
  // meters: the recovery layer for a corrupted/out-of-range save (mergeInto rejects NaN but copies finite
  // out-of-range numbers; gain* only clamps on change). TT∈[0,200], UT/TC∈[0,100] — match gainTT/gainUT/gainTC.
  if (bad(S.tiengTam)) S.tiengTam = CONFIG.BOOT_TT; S.tiengTam = clamp(r1(S.tiengTam), 0, 200);
  if (bad(S.uyTin)) S.uyTin = CONFIG.BOOT_UT; S.uyTin = clamp(r1(S.uyTin), 0, 100);
  if (bad(S.thucChat)) S.thucChat = CONFIG.BOOT_TC; S.thucChat = clamp(r1(S.thucChat), 0, 100);
  S.admissions.lastCutoff = clamp(S.admissions.lastCutoff || 15, 12, 30.5);
  S.admissions.lastQuota = clamp(Math.round(S.admissions.lastQuota) || 12, 4, 14);
  S.admissions.poolSeed = (S.admissions.poolSeed || 0) >>> 0;
  // scholarships: rebuild against 3-key registry
  var reg = CONFIG.PANTHEON.map(function (p) { return p.key; });
  var byKey = {}; (S.scholarships || []).forEach(function (sc) { if (sc && reg.indexOf(sc.key) >= 0) byKey[sc.key] = sc; });
  S.scholarships = reg.map(function (k) { return byKey[k] || { key: k, holderId: null, suspended: false }; });
  // contracts
  S.contracts = (S.contracts || []).filter(function (c) { return c && Number.isFinite(c.pay); }).map(function (c) { c.mLeft = clamp(Math.round(c.mLeft) || 0, 0, 48); return c; }).slice(0, 3);
  // alumni
  var STATE = CONFIG.ALUM.STATES;
  S.alumni = (S.alumni || []).filter(function (a) { return a && a.fs; }).map(function (a) {
    if (STATE.indexOf(a.state) < 0) a.state = "LUONG_ON";
    if (!Array.isArray(a.history) || !a.history.length) a.history = [a.state]; else a.history = a.history.filter(function (h) { return STATE.indexOf(h) >= 0; });
    a.yearsInState = Math.max(0, Math.round(a.yearsInState) || 0);
    if (!(a.annMonth >= 1 && a.annMonth <= 12) || a.annMonth === 6) a.annMonth = annMonthFor(a.id);
    ["kt", "tn", "st", "cm", "vet"].forEach(function (k) { a.fs[k] = clamp(a.fs[k] || 0, 0, 100); });
    a.fs.seed = clamp(Math.round(a.fs.seed) || 1, 1, 5);
    if (a.fs.real == null) a.fs.real = Math.round(realFrac(a.state, a.fs.seed) * 100); else a.fs.real = clamp(Math.round(a.fs.real), 0, 200); // E4: backfill carried realization on pre-E4 saves
    a.grat = clamp(a.grat || 0, 0, 100); a.gifts = Math.max(0, a.gifts || 0);
    if (!a.flags) a.flags = { vt: [] };
    return a;
  });
  S.seed0 = (S.seed0 || 0) >>> 0;
  if (!S.META) S.META = {};
  if (!Array.isArray(S.META.goalsHit)) S.META.goalsHit = [];
  if (!Array.isArray(S.META.majorsUnlocked)) S.META.majorsUnlocked = [];
  S.META.dropped = Math.max(0, Math.round(S.META.dropped) || 0); // iter-131 burnout-loss counter
  if (!Array.isArray(S.META.favLog)) S.META.favLog = []; // iter-135 protégé follow-journal
  if (S.META.favId != null && !S.students.some(function (s) { return s.id === S.META.favId; })) S.META.favId = null; // protégé gone (graduated/left) → clear
  // iter-202 BUGFIX: VALIDATE S.teachers — the iter-199 carve left this dynamic array (now carrying the iter-195
  // grain field, read EVERY tick) unsanitized. mergeInto copies arrays wholesale, so a null entry or a NaN→null
  // luong from a JSON round-trip survived loadGame and then crashed sanitize() ITSELF (the khoaHead prune below calls
  // teacherById → S.teachers[i].id on null) AND every dayTick (teacherFactor reads t.trait/t.grain; the salary loop
  // sums t.luong → NaN cash) — a permanently-unplayable save. Heal here, mirroring the students/alumni patterns.
  var seenTid = {};
  S.teachers = (S.teachers || []).filter(function (t) { return t && typeof t === "object" && t.id != null && !seenTid[t.id] && (seenTid[t.id] = 1); }).map(function (t) {
    t.luong = Math.max(0, Math.round(t.luong) || 0);
    t.day = clamp(Math.round(t.day) || 0, 0, 10); t.dien = clamp(Math.round(t.dien) || 0, 0, 10);
    t.age = Math.max(0, Number(t.age) || 0);
    t.trait = (typeof t.trait === "string") ? t.trait : "";
    t.grain = (t.grain === "spark" || t.grain === "sky" || t.grain === "hype") ? t.grain : ""; // iter-195 faculty grain
    t.bienChe = !!t.bienChe;
    if (typeof t.ten !== "string" || !t.ten) t.ten = "Giảng viên";
    return t;
  }).slice(0, 24);
  // iter-202 BUGFIX: heal S.giftItems (iter-182, also left unsanitized) — a corrupted/non-object entry crashed the
  // Fund-tab render (esc(g.item) on null). Filter to well-formed entries so render can't throw.
  S.giftItems = (S.giftItems || []).filter(function (g) { return g && typeof g === "object" && g.item; }).slice(0, (CONFIG.ALUM && CONFIG.ALUM.ITEM_CAP) || 24);
  // khoaHead: prune heads whose khoa or teacher no longer exists (and any teacher heading 2+ khoas)
  if (!S.khoaHead || typeof S.khoaHead !== "object") S.khoaHead = {};
  var seenT = {};
  for (var hk in S.khoaHead) {
    var tid = S.khoaHead[hk];
    if (!majorByKey(hk) || !teacherById(tid) || seenT[tid]) { delete S.khoaHead[hk]; continue; }
    seenT[tid] = true;
  }
  // khoaCup (iter 80): validate the trophy record + reigning champion
  if (!S.khoaCup || typeof S.khoaCup !== "object") S.khoaCup = { trophies: {}, champ: null, lastYear: 0 };
  if (!S.khoaCup.trophies || typeof S.khoaCup.trophies !== "object") S.khoaCup.trophies = {};
  for (var ck in S.khoaCup.trophies) {
    if (!majorByKey(ck) || !Number.isFinite(S.khoaCup.trophies[ck])) { delete S.khoaCup.trophies[ck]; continue; }
    S.khoaCup.trophies[ck] = Math.max(0, Math.round(S.khoaCup.trophies[ck]));
  }
  S.khoaCup.lastYear = clamp(Math.round(S.khoaCup.lastYear) || 0, 0, 999);
  if (S.khoaCup.champ != null && !majorByKey(S.khoaCup.champ)) S.khoaCup.champ = null;
}

// iter-199: engine.js built window.HVS BEFORE this file loaded, so it could not list loadGame/saveGame (defined
// HERE). Augment now (browser-only; node harnesses call the functions directly in the concatenated scope). Same
// pattern as js/sim/admissions.js. __test.save/load/serialize were dead exports (no consumer) and were dropped.
if (typeof window !== "undefined" && window.HVS) { window.HVS.loadGame = loadGame; window.HVS.saveGame = saveGame; }
