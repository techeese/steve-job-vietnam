/* ============================================================================
   Học viện Steve — js/engine.js
   State, deterministic sim, June ceremony, admissions, alumni FSM, funding.
   NO DOM here (layer law) — ui.js owns rendering; this file is headless-testable.
   Three RNG streams (DESIGN §determinism):
     · main sim   → S.rngState (mulberry32, mutated by rnd())
     · admissions → S.admissions.poolSeed (pool derived, never serialized)
     · alumni     → S.seed0 (per-alumnus-year throwaway generators)
   ========================================================================== */

/* ---------- math / rng helpers ---------- */
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
function r1(v) { return Math.round(v * 10) / 10; }
function r2(v) { return Math.round(v * 100) / 100; }
function r025(v) { return Math.round(v * 4) / 4; }
function imul(a, b) { return Math.imul(a, b); }
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// main stream — mutates S.rngState
function rnd() {
  S.rngState = (S.rngState + 0x6D2B79F5) | 0;
  var t = S.rngState;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function rrange(lo, hi) { return lo + rnd() * (hi - lo); }
function rint(lo, hi) { return Math.floor(lo + rnd() * (hi - lo + 1)); }
function rpick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
function gauss(prng) { var u = 1 - prng(), v = prng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* ---------- module globals ---------- */
var S = null;
var _nextId = 1;
var CKPT2B_ON = false; // iter-200 E8 ckpt2b PLAYTEST FLAG (OFF by default → live byte-identical). Set true by ?ckpt2b=1 (ui.js boot) or the sweep sensor. When ON, a DISCOVERED gift whose grain you hired NO faculty for (and didn't mentor) goes adrift → real waste: specializing your faculty has a COST. The owner's gated "strong faculty trade-off" — shipped behind a flag so the owner can PLAYTEST the FEEL (the gate's own requirement) without it touching the default live experience.
var ERA_OVERRIDE = null; // iter-204 L1: testing-only era pin (sweep era-sensor sets it to measure one era in isolation). null in production → era follows S.year. NOT serialized; never read by a save.
var ARCH_OVERRIDE = null; // iter-210 L2: testing-only archetype pin (sweep archetype-sensor / ?arch= can also set it). null → freshState uses archKey arg or ARCH_DEFAULT. NOT serialized.
var PEER_OFF = false; // iter-241 PEERS/CONTAGION: testing-only kill of peer mood-contagion (sweep on/off sensor sets it true for a baseline). false in production → contagion live. NOT serialized.
var MAJOR_OVERRIDE = null; // iter-247 (EDUCATION epic Phase 2a): testing-only — force EVERY student into one major key (the sweep MAJOR_FIT sensor sets it to measure a non-native placement's bite). null in production → studentMajor follows tell+rooms. NOT serialized.
function nid() { return _nextId++; }

/* ---------- L1 ERAS (iter-204) — the authored decade spine ---------- */
// era = a pure function of the academic year (deterministic → replay-safe; reload restores S.year → same era).
function eraIndex(year) { var i = Math.floor((year - 1) / CONFIG.ERA_LEN); return i < 0 ? 0 : (i >= CONFIG.ERAS.length ? CONFIG.ERAS.length - 1 : i); }
function eraIdxNow() { return ERA_OVERRIDE != null ? ERA_OVERRIDE : eraIndex(S ? S.year : 1); }
function curEra() { return CONFIG.ERAS[eraIdxNow()]; }
// eraFav(tell) — how the CURRENT decade treats this gift: >1 the world realizes it, <1 it wastes it. Undirected ("")
// kids are era-neutral. Bounded by the authored table (~0.6..1.6). The heart of "right kid, wrong era".
function eraFav(tell) { if (!tell) return 1; var f = curEra().fav; return (f && f[tell] != null) ? f[tell] : 1; }
// eraFavAt(tell, year) — the decade a graduate ENTERED the world (eraIndex(gradYear)) and how it treated their gift.
// iter-205 ckpt2: lets the epilogue/graduation name the DECADE's hand on a life (wrong-era waste / right-era flourish).
function eraFavAt(tell, year) { if (!tell || year == null) return 1; var f = CONFIG.ERAS[eraIndex(year)].fav; return (f && f[tell] != null) ? f[tell] : 1; }
// the era-shift story beat — fires once at a year rollover that crosses an era boundary (pure derive, no state).
function eraShift(prevYear) { var pe = eraIndex(prevYear), ce = eraIndex(S.year); if (ce !== pe) { var e = CONFIG.ERAS[ce]; news("🕰️ " + e.name + " — " + e.shift);
    if (CONTENT.eraFlood && CONTENT.eraFlood[e.key]) news("🌊 " + CONTENT.eraFlood[e.key]); // iter-260 (scout v2 #1): the gift the new decade floods the intake with — the world changing WHO walks in the gate
    var _ash = CONTENT.eraShock && CONTENT.eraShock[S.archetype] && CONTENT.eraShock[S.archetype][e.key]; if (_ash) news("〽️ " + _ash); // iter-260 (scout v2 #2): this archetype's thesis meeting the era's reweighting — the ache (sparse). News-only, deterministic (e.key from S.year, S.archetype from state) → replay-safe.
    var add = techReach(S.year) - techReach(prevYear); if (add > 0 && CONTENT.techReach[ce]) news(tpl(CONTENT.techReach[ce], { n: add })); } } // iter-240 L4 ckpt1: each tech wave (era-true) compounds the teacher's reach

/* derived alumni stats (never stored — DESIGN §5a) */
function aCraft(a) { return 0.6 * a.fs.tn + 0.4 * a.fs.st; }
function aHustle(a) { return a.fs.cm; }
function aHollow(a) { return a.fs.vet; }
function aLua(a) { return a.fs.seed; }
// flourishOf / realFrac / realClass → js/sim/person.js (iter 127 STRUCTURE carve — the E4 realization reading)

/* ---------- room / grid helpers ---------- */
function roomRect(r) { var d = CONFIG.ROOMS[r.key]; return { x: r.x, y: r.y, w: d.w, h: d.h }; }
function hasRoom(key) { for (var i = 0; i < S.rooms.length; i++) if (S.rooms[i].key === key) return true; return false; }
function rectsOverlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function canPlace(key, x, y) {
  var d = CONFIG.ROOMS[key]; if (!d) return false;
  if (x < 0 || y < 0 || x + d.w > CONFIG.GRID_W || y + d.h > CONFIG.GRID_H) return false;
  var nr = { x: x, y: y, w: d.w, h: d.h };
  for (var i = 0; i < S.rooms.length; i++) if (rectsOverlap(nr, roomRect(S.rooms[i]))) return false;
  return true;
}
function pantheonByKey(key) { for (var i = 0; i < CONFIG.PANTHEON.length; i++) if (CONFIG.PANTHEON[i].key === key) return CONFIG.PANTHEON[i]; return null; }
function dedFigure(key) { return pantheonByKey(key) || (CONFIG.GARDEN_FIGURES && CONFIG.GARDEN_FIGURES[key]) || null; } // scholarship pantheon OR garden-only figures
// KHOA / MAJORS — students auto-join the khoa matching their tell once its building exists
function majorByTell(tell) { var M = CONFIG.MAJORS || []; for (var i = 0; i < M.length; i++) if (M[i].tell === tell) return M[i]; return null; }
function majorByRoom(room) { var M = CONFIG.MAJORS || []; for (var i = 0; i < M.length; i++) if (M[i].room === room) return M[i]; return null; }
function studentMajor(s) { if (MAJOR_OVERRIDE) { for (var i = 0; i < CONFIG.MAJORS.length; i++) if (CONFIG.MAJORS[i].key === MAJOR_OVERRIDE) return CONFIG.MAJORS[i]; }
  if (s.major) { var sm = majorByKey(s.major); if (sm) return (!sm.room || hasRoom(sm.room)) ? sm : null; } // iter-265 (Phase-2c CP1): a STORED khoa assignment (room-gated), set by the open-door intake resolver (CP2). Lets a grain sit in a NON-native major so MAJOR_FIT bites live. Default: no s.major → native derivation below → byte-identical.
  var m = majorByTell(s.tell); return (m && (!m.room || hasRoom(m.room))) ? m : null; } // iter-248: a room-less major (Đại-cương) needs no building → the everyman ("") always has a home. iter-247: MAJOR_OVERRIDE (sweep-only) force-places everyone for the MAJOR_FIT sensor.
// iter-266 (Phase-2c CP2a) — the SEAT-SCARCITY intake resolver. SPECIALIST khoas (a room + a tell: code/make/biz) hold
// CONFIG.MAJOR_CAP seats; Đại-cương (room-less) is the uncapped catch-all home. A grain fills its NATIVE khoa first; when
// that khoa is FULL it OVERFLOWS off-native — under "native" (fit-priority) to the gentle Đại-cương generalist track, under
// "open" (open-door) packed into the best-fit BUILT specialty with a free seat (real stat-growth, but MAJOR_FIT bites).
// DETERMINISTIC: stable student order (by id), occupancy counted live, NO rng → replay byte-identical. Stores s.major.
// At MAJOR_CAP=99 (CP2a) nothing overflows → every grain native → byte-identical; CP2b lowers the cap so it bites.
function specialistMajors() { return (CONFIG.MAJORS || []).filter(function (m) { return m.room && m.tell; }); }
function majorOccupancy() { var o = {}; for (var i = 0; i < S.students.length; i++) { var m = studentMajor(S.students[i]); if (m) o[m.key] = (o[m.key] || 0) + 1; } return o; }
// iter-268 (Phase-2c CP2c) — OPEN-DOOR off-native placement: cram a grain whose native khoa is unavailable (not built, or
// full) into the best-fit BUILT specialist with room, else the Đại-cương generalist track. The grain becomes ACTIVE
// (wrong-fit, MAJOR_FIT bites) instead of sitting idle. Deterministic; mutates occ. Returns true if placed.
function placeOffNative(s, occ, natKey) {
  var best = null, bf = -1, cap = CONFIG.MAJOR_CAP;
  specialistMajors().forEach(function (m) { if (m.key === natKey || !hasRoom(m.room) || (occ[m.key] || 0) >= cap) return; var f = CONFIG.MAJOR_FIT(s.tell, m.key); if (f > bf) { bf = f; best = m; } });
  if (best) { s.major = best.key; occ[best.key] = (occ[best.key] || 0) + 1; return true; }
  var dc = majorByTell(""); if (dc) { s.major = dc.key; return true; } // Đại-cương is room-less → always available
  return false;
}
function assignMajors() {
  var occ = majorOccupancy(), open = (S.intakePolicy === "open"), cap = CONFIG.MAJOR_CAP;
  var pending = S.students.filter(function (s) { return !s.major; }).sort(function (a, b) { return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; }); // stable order → replay-safe
  for (var i = 0; i < pending.length; i++) {
    var s = pending[i], nat = majorByTell(s.tell);
    if (!nat) continue;
    if (!nat.room) { s.major = nat.key; continue; }       // room-less native (the everyman's Đại-cương) → always home
    if (hasRoom(nat.room) && (occ[nat.key] || 0) < cap) { s.major = nat.key; occ[nat.key] = (occ[nat.key] || 0) + 1; continue; } // a native seat is open
    // can't get a native seat (khoa not built, or — under a biting cap — full)
    if (open) placeOffNative(s, occ, nat.key); // OPEN-DOOR: become active off-native rather than idle (MAJOR_FIT bites = the cost of opening the door)
    // "native" (fit-priority, default): leave idle (s.major unset) → studentMajor null until you build their khoa → byte-identical to pre-Phase-2c
  }
}
// P4b — a trưởng-khoa (teacher head). A headed khoa thrives at one fewer member and grows faster.
function khoaHeaded(key) { return !!(S.khoaHead && S.khoaHead[key] && teacherById(S.khoaHead[key])); }
function khoaThreshold(key) { return khoaHeaded(key) ? Math.max(2, CONFIG.SYN_MIN - 1) : CONFIG.SYN_MIN; }
function teacherById(id) { for (var i = 0; i < S.teachers.length; i++) if (S.teachers[i].id === id) return S.teachers[i]; return null; }
// MENTOR'S LEDGER Phase 2 — the headmaster's scarce attention (player verb + helpers; UI wiring lands next)
// iter-244 (EDUCATION epic Phase 1a) — the TEACHING DIAL fit: MODE (preset) × STRUCTURE. fitOf is the single
// source for "how well the school's teaching fits this gift", replacing the bare CONFIG.MATCH(tell, preset) at
// every site (growth, cohort/fav/tet beats, the UI readouts, the sweep bot). structOf defaults to 'mid' (→
// STRUCT_FIT 1.0) so a pre-Phase-1 save / the boot default is byte-identical.
function structOf(gk) { return (S.struct && S.struct[gk]) || CONFIG.STRUCT_DEFAULT; }
function fitOf(tell, gk) { return CONFIG.MATCH(tell, S.presets[gk]) * CONFIG.STRUCT_FIT(tell, structOf(gk)); }
function mentorCount() { var c = 0, st = S.students; for (var i = 0; i < st.length; i++) if (st[i].mentored) c++; return c; }
// iter-240 (L4 ckpt1): the effective attention cap — each tech wave (era ≥ TECH_REACH.minEra) compounds the teacher's reach. Deterministic from S.year → replay-safe; no new state.
function techReach(year) { var e = eraIndex(year), m = CONFIG.TECH_REACH.minEra; return e >= m ? (e - m + 1) * CONFIG.TECH_REACH.perEra : 0; }
function mentorSlots() { return CONFIG.MENTOR_SLOTS + techReach(S.year); }
function mentorStudent(id) {
  var st = S.students, s = null; for (var i = 0; i < st.length; i++) if (st[i].id === id) { s = st[i]; break; }
  if (!s) return { ok: false, why: "gone" };
  if (s.mentored) { s.mentored = false; return { ok: true, mentored: false }; } // toggle off → free a slot
  if (mentorCount() >= mentorSlots()) return { ok: false, why: "full" };
  s.mentored = true; return { ok: true, mentored: true };
}
// assign teacher `tid` as head of khoa `key` (null = vacate). One teacher heads at most one khoa.
function setKhoaHead(key, tid) {
  if (!S.khoaHead) S.khoaHead = {};
  if (!majorByKey(key)) return { ok: false };
  if (tid == null) { delete S.khoaHead[key]; return { ok: true }; }
  if (!teacherById(tid)) return { ok: false };
  for (var k in S.khoaHead) if (S.khoaHead[k] === tid) delete S.khoaHead[k]; // a teacher can head only one khoa
  S.khoaHead[key] = tid;
  var m = majorByKey(key), t = teacherById(tid);
  if (m && t) news("🎓 " + t.ten + " làm trưởng " + m.name + " — khoa cộng hưởng dễ hơn.");
  return { ok: true };
}
function majorByKey(key) { var M = CONFIG.MAJORS || []; for (var i = 0; i < M.length; i++) if (M[i].key === key) return M[i]; return null; }
function enrollProdigy(m) {
  if (S.students.length >= rosterCap()) { news(m.icon + " Mở " + m.name + " — nhưng trường đã chật, chưa nhận thêm được."); return; }
  var s = genStudent(1, m.prodigy); s._prodigy = true; S.students.push(s);
  news(m.icon + " Mở " + m.name + " — " + m.prodigy.ten + " tuyển thẳng về học.");
}
function placeRoom(key, x, y) {
  var d = CONFIG.ROOMS[key]; if (!d) return { ok: false, msg: "Phòng không hợp lệ." };
  if (d.once && hasRoom(key)) return { ok: false, msg: "Đã có rồi." };
  if (!canPlace(key, x, y)) return { ok: false, msg: "Không đặt được ở đây." };
  var cost = d.cost || 0;
  if (cost > S.cash) return { ok: false, msg: "Không đủ tiền." };
  S.cash = r1(S.cash - cost);
  S.book = r1(S.book + cost);
  S.rooms.push({ key: key, x: x, y: y, level: 1 });
  S._mapDirty = true;
  if (d.ded) { // a memorial garden — lasting prestige + a real educator's idea on the grounds
    gainUT(d.utBoost || 5, true); bacTamNod(); // pierce the yearly cap: a deliberate, paid-for honour
    var p = dedFigure(d.ded);
    if (p) news("🏵️ Khánh thành " + d.name + ": " + p.line);
  } else if (cost > 0) news("Xây xong " + d.name + ". −" + cost + "tr.");
  var mj = majorByRoom(key); // a building can open a khoa — once — and attract a prodigy "tuyển thẳng"
  if (mj && S.META.majorsUnlocked.indexOf(mj.key) < 0) { S.META.majorsUnlocked.push(mj.key); enrollProdigy(mj); }
  checkMilestones(); // building can complete a founding milestone (responsive while paused)
  return { ok: true };
}
// "buy → it just appears": find the first tidy spot (reading order, inside a border, off the central
// path) and build there — no manual placement. Falls back to allowing the path if the grounds fill up.
function roomLevel(key) { for (var i = 0; i < S.rooms.length; i++) if (S.rooms[i].key === key) return S.rooms[i].level || 1; return 0; }
// iter-160 (economy ckpt2): upgrade cost ESCALATES with level — base × GROWTH^(lvl-1). Late tiers cost tỷ, so the
// campus is a growing money sink the owner asked for ("buy more expensive upgrade"). lvl = current level (upgrading to lvl+1).
function upgradeCost(d, lvl) { var U = CONFIG.UPGRADE; return Math.round(Math.max(U.BASE, d.cost || 0) * Math.pow(U.COST_GROWTH, Math.max(0, lvl - 1))); }
// iter-160 (economy ckpt2): the PRESTIGE PREMIUM on tuition income — every building upgrade level above 1 adds
// PRESTIGE_K. A taller, more-invested campus earns more per student → income COMPOUNDS with reinvestment (the
// growth engine). Level-1 schools (the sweep/bot, which never upgrade) get 1.0 → economy sweep unchanged.
// iter-181 (owner steer ckpt2): the phòng học is carved OUT of the generic prestige — it is now the EXPLICIT
// TUITION multiplier (classroomMult below), the owner's mental model ("classroom = a multiplier of the tuition").
// Prestige = every OTHER building's upgrade levels (reputation). No double-count: phonghoc drives ONLY classroomMult.
function prestigeLevels() { var t = 0; for (var i = 0; i < S.rooms.length; i++) if (S.rooms[i].key !== "phonghoc") t += Math.max(0, (S.rooms[i].level || 1) - 1); return t; }
function prestigeMult() { return 1 + CONFIG.PRESTIGE_K * prestigeLevels(); }
// iter-181: better/bigger classrooms let you charge more per student — an explicit, legible tuition multiplier driven
// by phòng học level (compounds WITH prestige → the owner's compounding growth engine). Level-1 = 1.0× (bot/sweep
// never upgrade → unaffected; only real upgraded play sees it). Surfaced as a Thu–Chi line + an upgrade benefit.
function classroomMult() { return 1 + CONFIG.CLASSROOM_TUITION_K * Math.max(0, roomLevel("phonghoc") - 1); }
// iter-166 (economy — "upgrades raise students"): CLASSROOMS scale the school's SIZE. campusScale drives roster,
// intake AND the crowd baseline TOGETHER (proportional → the realize/waste spread is preserved). Level-1 = 1.0×
// (sweep/bot unaffected). Capped for phone perf. rosterCap = the scaled student ceiling.
function campusScale() { var sc = 1 + CONFIG.CAMPUS_SCALE_K * Math.max(0, roomLevel("phonghoc") - 1); return sc > CONFIG.CAMPUS_SCALE_MAX ? CONFIG.CAMPUS_SCALE_MAX : sc; }
function rosterCap() { return Math.round(CONFIG.ROSTER_CAP * campusScale()); }
function autoPlace(key) {
  var d = CONFIG.ROOMS[key]; if (!d) return { ok: false, msg: "Phòng không hợp lệ." };
  if (d.once && hasRoom(key)) return { ok: false, msg: "Đã có rồi." };
  // standard building already on the grounds → upgrade it IN PLACE (one on the map, leveled up)
  if (!d.once) {
    var ex = null; for (var j = 0; j < S.rooms.length; j++) if (S.rooms[j].key === key) { ex = S.rooms[j]; break; }
    if (ex) {
      var lvl = ex.level || 1;
      if (lvl >= (CONFIG.ROOM_MAX_LEVEL || 3)) return { ok: false, msg: "Đã tối đa cấp." };
      var uc = upgradeCost(d, lvl);
      if (uc > S.cash) return { ok: false, msg: "Không đủ tiền nâng cấp." };
      S.cash = r1(S.cash - uc); S.book = r1(S.book + uc); ex.level = lvl + 1; S._mapDirty = true;
      news("Nâng cấp " + d.name + " → cấp " + (lvl + 1) + ". −" + uc + "tr.");
      return { ok: true, upgrade: true, level: lvl + 1 };
    }
  }
  if ((d.cost || 0) > S.cash) return { ok: false, msg: "Không đủ tiền." };
  var px = CONFIG.GRID_W >> 1, py = CONFIG.GRID_H >> 1, best = null, pass, x, y;
  for (pass = 0; pass < 2 && !best; pass++) {
    for (y = 1; y <= CONFIG.GRID_H - d.h && !best; y++) {
      for (x = 1; x <= CONFIG.GRID_W - d.w && !best; x++) {
        var onPath = (x <= px && px < x + d.w) || (y <= py && py < y + d.h);
        if (canPlace(key, x, y) && (pass === 1 || !onPath)) best = { x: x, y: y };
      }
    }
  }
  if (!best) return { ok: false, msg: "Hết chỗ trong khuôn viên." };
  return placeRoom(key, best.x, best.y);
}

/* ---------- news / meters ---------- */
function news(line) { S.news.unshift({ t: S.totalDays, s: line }); if (S.news.length > 60) S.news.pop(); }
function moodAll(d) { for (var i = 0; i < S.students.length; i++) S.students[i].mood = clamp(S.students[i].mood + d, 0, 100); }
function gainTT(d) { S.tiengTam = clamp(r1(S.tiengTam + d), 0, 200); }
// Uy Tín: net ±UT_YEAR_CAP/yr unless pierce (DESIGN: exactly two pierce events)
function gainUT(d, pierce) {
  if (!pierce && d > 0) { var room = CONFIG.UT_YEAR_CAP - S.utYearNet; d = Math.min(d, Math.max(0, room)); }
  if (d === 0) return;
  S.uyTin = clamp(r1(S.uyTin + d), 0, 100);
  S.utYearNet = r1(S.utYearNet + d);
}
function gainTC(d) { S.thucChat = clamp(r1(S.thucChat + d), 0, 100); }
function bacTamNod() { S._lastNod = S.totalDays; } // the one quiet virtue beat (ui reads)

/* ---------- student generation ---------- */
// genStudent / genName / rollTell → carved to js/sim/person.js (iter 114 STRUCTURE). Globals, same eval scope.

/* ============================================================================
   freshState — complete shape (CONVERSION-SPEC §7). Every field also covered
   by mergeInto()/sanitize() so saves never break.
   ========================================================================== */
function freshState(seed, archKey) {
  _nextId = 1;
  var sd = (seed != null ? seed : 0x53544556) >>> 0; // "STEV"
  var _ak = archKey || ARCH_OVERRIDE || CONFIG.ARCH_DEFAULT; // iter-210 L2: the school's archetype (geography) — pre-loads economy + meters + teaching culture + cohort origin-mix
  var _A = CONFIG.ARCHETYPES[_ak] || CONFIG.ARCHETYPES[CONFIG.ARCH_DEFAULT];
  var s = {
    v: CONFIG.V,
    rngState: sd | 0,
    seed0: sd >>> 0,
    // calendar: boot Tháng 6 Năm 1 (sáng lập) — first July rollover opens the FIRST
    // intake; no founding ceremony (no graduates yet). year++ at each June.
    day: 1, month: 6, year: 1, totalDays: 0, sub: 0,
    speed: 0, speed3Unlocked: false,
    schoolName: CONTENT.schoolName, // iter-186 (owner): the academy's name — MUTABLE (the 'datten' investor event renames it for real); shown in the HUD/epilogue/share card

    archetype: _ak, // iter-210 L2: WHERE the school is (geography) — drives boot economy/meters/culture/origin-mix below
    // economy (boot values from the archetype; tinh_le = the legacy constants → byte-identical default)
    cash: _A.cash, book: CONFIG.BOOK_VALUE, tuition: CONFIG.BOOT_TUITION,
    // meters
    tiengTam: _A.tt, uyTin: _A.ut, thucChat: _A.tc,
    utYearNet: 0, pierceDefense: false, pierceKeynote: false,
    presets: { n1: _A.presets.n1, n2: _A.presets.n2, n3: _A.presets.n3, n4: _A.presets.n4 }, // the archetype's default TEACHING CULTURE (player can change it); tinh_le = canbang/luyện-đề baseline (inaction WASTES — the realize/waste spread comes from per-child attention)
    struct: { n1: CONFIG.STRUCT_DEFAULT, n2: CONFIG.STRUCT_DEFAULT, n3: CONFIG.STRUCT_DEFAULT, n4: CONFIG.STRUCT_DEFAULT }, // iter-244 (EDUCATION epic Phase 1a) — Axis B of the teaching dial, per grade. All 'mid' (neutral, STRUCT_FIT=1.0) at boot → byte-identical to pre-Phase-1; the player moves it via the dial (Phase 1b). Archetype-specific defaults are a deliberate later recapture, not now.
    intakePolicy: CONFIG.INTAKE_DEFAULT, // iter-265 (Phase-2c CP1) — major INTAKE rule: "native" (fit-priority: a grain always to its own khoa = current behavior) | "open" (open-door: a full native khoa overflows a grain into another khoa → off-native, MAJOR_FIT bites). Default "native" → byte-identical; the off-native resolver activates in CP2.
    rooms: [],
    students: [],
    teachers: [],
    khoaHead: {}, // P4b: khoa key → teacher id (a trưởng-khoa boosts that khoa)
    khoaCup: { trophies: {}, champ: null, lastYear: 0 }, // iter 80: annual inter-khoa Cúp Khoa — a trophy pennant race

    alumni: [],
    admissions: { poolSeed: 0, lastCutoff: 15.0, lastQuota: 12, lastFill: 0, aoCount: 0, bonusOffered: false, declaredHistory: [] },
    endow: { bal: _A.endow, log: [], pending: [], drawnYear: false, milestonesClaimed: 0 }, // iter-210: archetype boot endowment (tinh_le = legacy BOOT_ENDOW)
    giftItems: [], // iter-182 (owner steer ckpt3): non-monetary gifts from successful alumni — the "kho lưu niệm", a hook for extension functions later
    letters: [], // iter-213 (N3): the headmaster's annual letters accumulate here → the capstone essay re-reads them (his thinking, year by year). Persisted; old saves default [] → no letters section (graceful, no migrator).
    legacy: null, // iter-217 (L3): the inherited legacy from the player's LAST completed run (set by seedLegacy() at ui-boot for a NEW game). Persisted once applied; null on a clean install / no prior run.
    scholarships: [
      { key: "tdn", holderId: null, suspended: false },
      { key: "tqb", holderId: null, suspended: false },
      { key: "hxh", holderId: null, suspended: false }
    ],
    contracts: [], corpBlacklist: {}, offersSeen: [],
    photSeeds: [], examHistory: [],
    news: [],
    META: { jobsEver: false, sound: false, tutorial: false, graduated: 0, arrested: 0, steves: 0, goalsHit: [], build: "", decadeShown: false, favId: null, campusTier: 0, majorsUnlocked: [], attachSeen: false, cashMileIdx: -1 },
    // transient modal state (persisted so a mid-modal reload resumes)
    pendingJune: null, pendingAdmit: null, pendingEvent: null, pendingContract: null,
    lastEventDay: -999, lastJuneYear: 0,
    _mapDirty: true, _lastNod: -999, _chuongDone: false,
    _maiPending: true // Mai Sương joins as the FIRST believer in the founding intake
  };
  S = s;
  bootRooms(s);
  bootTeachers(s);
  bootRoster(s);
  bootAlumni(s);
  news("🕰️ " + CONFIG.ERAS[0].name + " — " + CONFIG.ERAS[0].shift); // iter-204 L1: the world the school is founded into (the opening decade). Invisible to gates (they read cash/destinies, not news); overwritten on load by the saved feed.
  return s;
}

function bootRooms(s) {
  // start from nothing: an empty lot. The player builds the first Phòng học.
  s.rooms = [];
}
function bootTeachers(s) {
  // one founding teacher — the gym-teacher-who-covers-everything, underpaid, loyal.
  var t = CONTENT.teachers.inherited[0];
  s.teachers = [{ id: t.id, ten: t.ten, day: t.day, dien: t.dien, luong: t.luong, trait: t.trait, bienChe: false, age: 0 }];
}
function bootRoster(s) {
  // start from nothing: no students. The first cohort arrives at the July intake.
  s.students = [];
}
function bootAlumni(s) {
  // Trần Phi Lợi — the founder's old cram-school star, now a cá-mập-coin everyone admires.
  // Seeded as a shadow alumnus at founding; the scripted Y2-M3 arrest falls on him (DESIGN beat).
  var id = nid();
  s.alumni.push({
    id: id, ten: "Trần Phi Lợi", gradYear: 0, outcome: "CA_MAP_COIN",
    state: "CA_MAP_COIN", history: ["CA_MAP_COIN"], yearsInState: 1,
    annMonth: 3, _tpl: true,
    fs: { kt: 55, tn: 25, st: 18, cm: 65, vet: 80, seed: 2 },
    grat: 6, gifts: 0,
    flags: { tiemNang: false, coinPath: true, garage: false, vt: [] }, line: ""
  });
}

/* ============================================================================
   CLOCK / dayTick — pure sim. Always advances + auto-resolves overdue modals
   (so headless __test.days() never stalls at a modal). The UI interval is what
   *pauses* for the player; __test.days() bypasses that by calling dayTick直接.
   ========================================================================== */
function anyModal() { return !!(S.pendingJune || S.pendingAdmit || S.pendingEvent || S.pendingContract); }

function dayTick() {
  // auto-resolve modals left open past their deadline (headless / hiệu trưởng đi vắng)
  if (S.pendingEvent && S.totalDays - S.pendingEvent.born >= 12) resolveEvent(neutralChoice(S.pendingEvent.id));
  if (S.pendingContract && S.totalDays - S.pendingContract.born >= 20) resolveContract(false);
  if (S.pendingJune) {
    if (S.pendingJune.stage === "policy" && S.totalDays >= S.pendingJune.deadline) finalizeJune("thuc");
    else if (S.pendingJune.stage === "results" && S.totalDays >= S.pendingJune.deadline) S.pendingJune = null;
  }
  if (S.pendingAdmit && S.totalDays >= S.pendingAdmit.deadline) declareAdmissions(Math.max(15, S.admissions.lastCutoff - 0.5), S.pendingAdmit.quota, true); // iter-166: use the (campus-scaled) pending quota, not a hardcoded 12 — so a bigger campus auto-admits bigger cohorts

  S.day++; S.totalDays++;
  growStudents();
  maybeEvent();
  checkMilestones();

  if (S.day > CONFIG.DAYS_PER_MONTH) { S.day = 1; monthRollover(); }
}

function monthRollover() {
  S.month++;
  if (S.month > 12) S.month = 1;
  S._mapDirty = true; // refresh the static layer so seasonal décor (Tết, …) tracks the calendar
  economyTick();
  assignMajors(); // iter-266 (Phase-2c CP2a): place newly-enrolled grains into a khoa seat (native first; overflow off-native per intakePolicy when full). Idempotent (only unplaced students); deterministic → replay-safe. At MAJOR_CAP=99 → no overflow → byte-identical.
  alumniMonth(S.month);
  if (S.year === 2 && S.month === 3) scriptedArrest();
  if (S.month === 2) tetBeat();
  if (S.month === CONFIG.KHOA_CUP.month) runKhoaCup(); // annual Cúp Khoa (before the June ceremony)
  if (S.month === 9 && S.day === 1) scholarshipDraw(); // day always 1 right after rollover
  if (S.month === 6 && S.lastJuneYear !== S.year) { S.lastJuneYear = S.year; news(CONTENT.ticker.thptJune); openJune(); } // June = the real THPT exam season; anchor it before the school's own ceremony
  if (S.month === 7 && !S.pendingAdmit && !hasResolvedAdmitThisYear()) openAdmissions();
  if (S.month === 11) flushGifts();
  favBeat(); // iter-125: the followed protégé's in-school arc — a caused moment ~once a season (THESIS mark 5)
  cohortBeat(); // iter-179: the BROADER cohort becomes someone WHILE you watch — a glimpse of one kid blooming/wilting (mark 5+2, past the single protégé); rnd-free + narration-only → bot/sweep byte-identical
  fullLedgerBeat(); // iter-256 (scout #3): when the mentor ledger is FULL + a strong gift wilts unrescued, name the cost (the tragic allocation, proactively). Only fires once the player has filled the ledger → headless byte-identical.
  // scripted Offer 1 — Tập đoàn Trứng Vàng (≈one month after boot)
  if (S.offersSeen.indexOf("trungvang") < 0 && S.year === 1 && S.month >= 10) { S.offersSeen.push("trungvang"); offerContract(CONTENT.contract.trungvang); }
  endowMilestones();
  // decade capstone: once the school reaches its run-cap year, arm the "Mười năm sau" reflection
  if (S.year >= CONFIG.RUN_CAP_YEARS && !S.META.decadeShown && !S._decadeHit) { S._decadeHit = true; try { writeLegacy(pickLegacy()); } catch (e) {} } // iter-217 L3: the run's standout is written cross-run → seeds the NEXT school
}
// favSnapOf / favBeat (the followed protégé's in-school arc) → js/sim/person.js (iter 127 STRUCTURE carve)
function hasResolvedAdmitThisYear() {
  var h = S.admissions.declaredHistory;
  return h.length && h[h.length - 1].year === S.year;
}

/* ---------- founding milestones (guide + celebrate the build-up) ---------- */
function milestoneMet(key) {
  switch (key) {
    case "room1": return hasRoom("phonghoc");
    case "cohort1": return S.students.length >= 1;
    case "teacher2": return S.teachers.length >= 2;
    case "specroom": return hasRoom("lab") || hasRoom("xuong") || hasRoom("phongmay");
    case "grow20": return S.students.length >= 20;
    case "firstgrad": return S.META.graduated >= 1;
    default: return false;
  }
}
function checkMilestones() {
  if (!S.META.goalsHit) S.META.goalsHit = [];
  var list = CONTENT.milestones || [];
  for (var i = 0; i < list.length; i++) {
    var m = list[i];
    if (S.META.goalsHit.indexOf(m.key) >= 0) continue; // already earned
    if (!milestoneMet(m.key)) continue;                // independent: celebrate each as it's achieved
    S.META.goalsHit.push(m.key);
    gainTT(CONFIG.MILESTONE_TT);
    news(m.done);
    S._milestoneJustHit = m.done;
  }
}

/* ---------- daily student growth ---------- */
function teacherFactor() {
  var mult = 1, mood = 0, aff = { spark: 0, sky: 0, hype: 0 }, ng = 0; // iter-195 E8 ckpt2: per-grain faculty lean
  for (var i = 0; i < S.teachers.length; i++) {
    var t = S.teachers[i];
    if (t.trait === "tch") mult += 0.06;
    else if (t.trait === "isi") mult -= 0.04;
    else if (t.trait === "hype") mood += (t.age < 2 ? 1 : -0.5);
    if (t.grain && aff[t.grain] != null) { aff[t.grain] += 1; ng++; } // a grain-flavored teacher votes for the gift they realize
  }
  return { mult: Math.max(0.4, mult), mood: mood, aff: aff, ng: ng };
}
function scholarshipMult(stat) {
  var m = 1;
  for (var i = 0; i < S.scholarships.length; i++) {
    var sc = S.scholarships[i]; if (sc.suspended) continue;
    var p = pantheonOf(sc.key); if (!p) continue;
    if (p.eff === "tn" && stat === "tn") m *= p.val;
    if (p.eff === "st" && stat === "st") m *= p.val;
  }
  return m;
}
function hbMult(s, stat) {
  if (!s.flags.hb) return 1;
  var p = pantheonOf(s.flags.hb); if (!p) return 1;
  if (p.eff === stat) return p.val;
  return 1;
}
function pantheonOf(key) { for (var i = 0; i < CONFIG.PANTHEON.length; i++) if (CONFIG.PANTHEON[i].key === key) return CONFIG.PANTHEON[i]; return null; }

// growStudents → carved to js/sim/person.js (iter 114 STRUCTURE — the talent×education growth core lives there now).
function ktSat(v) {
  if (v > CONFIG.KT_SATURATE) v -= CONFIG.KT_RUST / CONFIG.DAYS_PER_MONTH;
  return clamp(v, 0, 100);
}

/* ---------- monthly economy ---------- */
function economyTick() {
  var n = S.students.length, i;
  var income = r1(S.tuition * n * prestigeMult() * classroomMult()); // iter-160 prestige premium × iter-181 classroom tuition multiplier (the owner's "classroom = tuition multiplier"); both compound the per-student income
  // iter-180 (owner steer "buildings earn money, looks real, increases with upgrade"): the căng tin sells a meal
  // to each student — live tiền tươi, scaling with its cấp (UNCAPPED). Deterministic (counts × rate) → reproducible;
  // surfaced as a legible income line + LIVE lunch coins (ui) so it FEELS real-time, not an end-of-month lump.
  var canteenRev = (n && hasRoom("cangtin")) ? r1(CONFIG.CANTEEN_PER_SV * n * roomLevel("cangtin")) : 0;
  S.META.canteenRev = canteenRev; // for the funding panel's income breakdown + the live coin feedback
  // iter-184 (owner "canteen OR similar building"): the Phòng Lab Sống Ảo monetizes CLOUT — the hype-tạng kids
  // livestream for ad money (scales with cấp). Satire: clout pays cash, never a 🍎. Ties income to the person-sim.
  var hypeN = 0; for (i = 0; i < n; i++) if (S.students[i].tell === "hype") hypeN++;
  var labRev = (hypeN && hasRoom("lab")) ? r1(CONFIG.LAB_PER_HYPE * hypeN * roomLevel("lab")) : 0;
  S.META.labRev = labRev; // funding-panel income line + the live ❤️ floats over streamers
  var salaries = 0; for (i = 0; i < S.teachers.length; i++) { salaries += S.teachers[i].luong; S.teachers[i].age += 1 / 12; }
  var roomCost = 0; for (i = 0; i < S.rooms.length; i++) roomCost += (CONFIG.ROOMS[S.rooms[i].key].cost || 0);
  var maint = r1(CONFIG.MAINT_RATE * (S.book + roomCost));
  var materials = 0;
  for (i = 0; i < S.students.length; i++) if (S.presets["n" + S.students[i].grade] === "duan") materials += CONFIG.DUAN_COST_PER_SV;
  var contractPay = 0;
  S.contracts = S.contracts.filter(function (c) { contractPay += c.pay; c.mLeft -= 1; return c.mLeft > 0; });
  var ops = r1((CONFIG.OPS.base + CONFIG.OPS.perSV * n) * CONFIG.OPS.rate * Math.max(0, S.year - 1)); // vận hành: ~0 at founding, rises with size & age
  S.cash = r1(S.cash + income + canteenRev + labRev + contractPay - salaries - maint - materials - ops);
  if (S.cash > CONFIG.CASH_KEEP) S.cash = r1(S.cash - (S.cash - CONFIG.CASH_KEEP) * CONFIG.CASH_DRAIN); // reinvest surplus (money sink)
  // iter-161 (economy ckpt3): bank-milestone fanfare — a one-time grand beat as the university grows into an
  // empire ("watch it grow" payoff for the owner's scaling vision). Monotonic by index; pure news (no balance).
  if (S.META.cashMileIdx == null) S.META.cashMileIdx = -1;
  while (S.META.cashMileIdx < CONFIG.CASH_MILES.length - 1 && S.cash >= CONFIG.CASH_MILES[S.META.cashMileIdx + 1]) {
    S.META.cashMileIdx++; news(CONTENT.cashMiles[S.META.cashMileIdx]); bacTamNod();
  }

  // endowment compounds (DESIGN ruling 3) — keep full precision; r1 would round the 0.4% away
  var prev = S.endow.bal;
  S.endow.bal = S.endow.bal * (1 + CONFIG.FUND.ENDOW_RATE);
  var lai = r2(S.endow.bal - prev);
  S.endow.log.push({ t: S.totalDays, bal: S.endow.bal }); if (S.endow.log.length > 100) S.endow.log.shift();
  if (S.month === 12 && S.endow.bal >= CONFIG.FUND.QUYLAI_BAL) news(tpl(CONTENT.ticker.quyLai, { bal: Math.round(S.endow.bal), lai: lai })); // iter-228: yearly + meaningful-only (was monthly → ticker spam)

  // meters
  var ttFloor = CONFIG.TT_FLOOR(S.uyTin);
  if (S.tiengTam > ttFloor) S.tiengTam = clamp(r1(Math.max(ttFloor, S.tiengTam - CONFIG.TT_DECAY)), 0, 200);
  else S.tiengTam = clamp(r1(Math.min(ttFloor, S.tiengTam + 0.5)), 0, 200); // recover toward baseline after a scandal/arrest dip
  for (i = 0; i < S.teachers.length; i++) if (S.teachers[i].trait === "isi") gainTT(0.5);
  // room effects scale with upgrade level (one building on the map, leveled up)
  // iter-160 (economy ckpt2): the per-level gameplay effects CAP at EFFECT_LVL_CAP so a tall (economic) campus
  // doesn't inflate Mood/Tiếng Tăm or the person-sim — high levels past the cap are PURE prestige/income (above).
  var ecap = CONFIG.EFFECT_LVL_CAP || 3, capLv = function (k) { return Math.min(roomLevel(k), ecap); };
  if (hasRoom("cangtin")) moodAll(capLv("cangtin"));            // +1 Mood/cấp (capped)
  if (hasRoom("lab")) gainTT(0.5 * capLv("lab"));               // +0,5 Tiếng Tăm/cấp (capped)
  var phLv = capLv("phonghoc"); if (phLv > 1) moodAll(phLv - 1); // extra classrooms ease the crowding (capped)
  // thực chất drifts toward (craft − cram) of student body
  if (n) {
    var tnSum = 0, vetSum = 0;
    for (i = 0; i < S.students.length; i++) { tnSum += S.students[i].tn; vetSum += S.students[i].vet; }
    var target = clamp((tnSum / n) - (vetSum / n) * 0.5 + 30, 0, 100);
    S.thucChat = clamp(r1(S.thucChat + (target - S.thucChat) * 0.06), 0, 100);
  }
  resolvePhots();
}
function resolvePhots() {
  S.photSeeds = S.photSeeds.filter(function (p) {
    var pr = CONFIG.PHOT.P(p.sev, S.tiengTam);
    if (rnd() < pr) {
      var dmg = r1(CONFIG.PHOT.DMG(p.sev, S.tiengTam));
      S.tiengTam = clamp(r1(S.tiengTam - dmg), 0, 200);
      gainUT(-1, false);
      // morality clause: live contracts may self-cancel on detonation
      S.contracts = S.contracts.filter(function (c) {
        if (rnd() < CONFIG.FUND.MORALITY(p.sev)) { news(tpl(CONTENT.contract.morality, { co: c.co })); return false; }
        return true;
      });
      news("Một mầm phốt cũ bung ra. Tiếng Tăm −" + Math.round(dmg) + ".");
      return false;
    }
    return true;
  });
}
function seedPhot(sev, src) { S.photSeeds.push({ src: src || "", sev: sev, born: S.totalDays }); }

/* ---------- Tết / scholarships / endowment milestones ---------- */
function tetBeat() { moodAll(10); S.endow.bal = r1(S.endow.bal); S.cash = r1(S.cash + 10); news(CONTENT.modal.tet); tetCohortBeat(); }
// iter-152 — the felt transformation arc, given a YEARLY chapter (VISION §77-79: watchable beat by beat, not a
// reveal at graduation). Once a year (Tết, the cultural turn-of-year) the headmaster reflects on how the CURRENT
// cohort is becoming UNDER THE PLAYER'S POLICY: blossoming (well-matched / mentored), cooling (lệch tạng or
// low mood), or mixed. PURE NEWS — no sim-state change (gate/bot/sweep/epilogue unaffected); prose, NO counts
// (invariant #3: the cohort is glimpsed, not metered). Skips the young founding school (<6 students).
function tetCohortBeat() {
  var st = S.students; if (!st || st.length < 6) return;
  var blossom = 0, cool = 0;
  for (var i = 0; i < st.length; i++) {
    var s = st[i], mm = fitOf(s.tell, "n" + s.grade); // iter-244: MODE × STRUCTURE (byte-identical at the mid default)
    if (s.mentored || mm >= 1.3) blossom++;
    else if (mm < CONFIG.MISMATCH_MM || s.mood < CONFIG.MOOD_PENALTY_BELOW) cool++;
  }
  var n = st.length, state = (blossom >= n * 0.4) ? "blossom" : (cool >= n * 0.3) ? "cool" : "mixed";
  // iter-211 (N2 ANNUAL LETTER): mirror the player's dominant TEACHING CULTURE this year back to them, in the decade's voice.
  var v = {}; ["n1", "n2", "n3", "n4"].forEach(function (k) { v[S.presets[k]] = (v[S.presets[k]] || 0) + 1; });
  var best = "canbang", bc = -1; for (var p in v) if (v[p] > bc) { bc = v[p]; best = p; }
  var culture = best === "luyende" ? "cram" : best === "duan" ? "craft" : "balance";
  var L = CONTENT.annualLetter, pool = L.body[state][culture];
  var phase = clamp(Math.floor((S.year - 1) * 3 / CONFIG.RUN_CAP_YEARS), 0, 2); // iter-231: the letter's voice ages early→mid→late across the run (same worry, wearier words)
  var body = Array.isArray(pool) ? pool[phase] : pool; // guard tolerates a pre-pool save/harness
  // iter-253 (NARRATIVE legibility of the Phase-1 DIAL): the STRUCTURE axis echoes in the letter too — the headmaster
  // reflects on how tightly he governs the day. Appended only on a strong lean (Khuôn/high or Mở/low); the neutral 'Vừa'
  // default → no clause → byte-identical. Deterministic (modal struct, no rnd) → replay-safe; news-only.
  var sv = {}; ["n1", "n2", "n3", "n4"].forEach(function (k) { var sk = (S.struct && S.struct[k]) || CONFIG.STRUCT_DEFAULT; sv[sk] = (sv[sk] || 0) + 1; });
  var sbest = "mid", sbc = -1; for (var sp in sv) if (sv[sp] > sbc) { sbc = sv[sp]; sbest = sp; }
  if (sbest !== "mid" && CONTENT.structLetter && CONTENT.structLetter[sbest]) body = body + CONTENT.structLetter[sbest];
  news(tpl(L.open, { era: curEra().name, year: S.year }) + body); // deterministic (cohort + presets + year, no rnd) → replay-safe; news-only → balance-neutral
  // iter-213 (N3): keep the letter so the capstone essay can re-read the headmaster's thinking, year by year.
  // iter-231: also store the worry KEY (state×culture, the thematic constant) so the capstone reads rut-vs-evolved by
  // the underlying worry, not the now-varying words — a stable run still reads "same nỗi, never dared change course".
  if (!S.letters) S.letters = [];
  S.letters.push({ year: S.year, era: curEra().name, culture: culture, worry: state + "/" + culture, text: body });
  if (S.letters.length > 16) S.letters.shift();
  // iter-241 PEERS/CONTAGION ckpt1 — name the cohort's pull when the school's atmosphere leans strongly one way (the
  // môi trường the contagion in growStudents enacts, made legible once a year). Deterministic (mood mean) → replay-safe; news-only.
  var pmAll = 0; for (var pmi = 0; pmi < n; pmi++) pmAll += st[pmi].mood; var pmMean = pmAll / n;
  if (pmMean >= CONFIG.PEER.WARM) news(CONTENT.peer.warm);
  else if (pmMean <= CONFIG.PEER.COLD) news(CONTENT.peer.cold);
}
function scholarshipDraw() {
  S.endow.drawnYear = false;
  for (var i = 0; i < S.scholarships.length; i++) {
    var sc = S.scholarships[i];
    if (!sc._endowed) continue;
    if (S.endow.bal >= CONFIG.FUND.SCHOL_DRAW) { S.endow.bal = r1(S.endow.bal - CONFIG.FUND.SCHOL_DRAW); sc.suspended = false; }
    else { sc.suspended = true; gainUT(-1, false); news("Học bổng " + pantheonOf(sc.key).name + " tạm dừng một năm. Không có thông cáo báo chí."); }
  }
}
function endowMilestones() {
  var gates = CONFIG.FUND.SCHOL_GATES;
  while (S.endow.milestonesClaimed < gates.length && S.endow.bal >= gates[S.endow.milestonesClaimed]) {
    var key = S.scholarships[S.endow.milestonesClaimed].key;
    S.scholarships[S.endow.milestonesClaimed]._endowed = true;
    S.endow.milestonesClaimed++;
    news("Quỹ đủ lớn để lập " + pantheonOf(key).name + ". " + pantheonOf(key).line);
    bacTamNod();
  }
}
// Cúp Khoa (iter 80): once a year (month 5, before June) the unlocked khoas with students compete. Winner
// = best of (members + avg signature-stat + synergy/head bonuses). Reward is STORY-not-power: a trophy (a
// multi-year pennant race), a morale lift to the winning khoa (mood above the penalty floor → no growth
// bonus, so the destiny cascade is untouched), and a tiny reputation nod. Deterministic from S; no rnd.
function runKhoaCup() {
  if (!S.khoaCup) S.khoaCup = { trophies: {}, champ: null, lastYear: 0 };
  if (S.khoaCup.lastYear === S.year) return;                 // at most once per year
  var rooms = {}; for (var ri = 0; ri < S.rooms.length; ri++) rooms[S.rooms[ri].key] = true;
  var tally = {};
  CONFIG.MAJORS.forEach(function (m) { if (rooms[m.room]) tally[m.key] = { m: m, n: 0, statSum: 0 }; });
  for (var si = 0; si < S.students.length; si++) {
    var st = S.students[si], mj = studentMajor(st);
    if (mj && tally[mj.key]) { tally[mj.key].n++; tally[mj.key].statSum += (st[mj.stat] || 0); }
  }
  var contenders = []; for (var k in tally) if (tally[k].n > 0) contenders.push(tally[k]);
  if (contenders.length < 2) return;                         // need a real contest
  S.khoaCup.lastYear = S.year;
  contenders.forEach(function (t) {
    t.score = t.n + (t.statSum / t.n) / 10 + (khoaHeaded(t.m.key) ? 1 : 0) + (t.n >= khoaThreshold(t.m.key) ? 2 : 0);
  });
  contenders.sort(function (a, b) { return b.score - a.score; });
  var win = contenders[0].m;
  S.khoaCup.trophies[win.key] = (S.khoaCup.trophies[win.key] || 0) + 1;
  S.khoaCup.champ = win.key;
  // reward — kept sweep-safe (see CONFIG.KHOA_CUP note): morale lift to the winner's khoa + a small TT nod
  for (var wi = 0; wi < S.students.length; wi++) { var ws = S.students[wi], wm = studentMajor(ws); if (wm && wm.key === win.key) ws.mood = clamp(ws.mood + CONFIG.KHOA_CUP.moodWin, 0, 100); }
  if (CONFIG.KHOA_CUP.ttWin) gainTT(CONFIG.KHOA_CUP.ttWin);
  news(tpl(CONTENT.ticker.khoaCup, { year: S.year, khoa: win.name, n: S.khoaCup.trophies[win.key] }));
}
// Player decision (late-game money sink): move cash from the bank INTO the endowment. One-way —
// the quỹ can never be spent back; it only compounds and funds scholarships. So this is the
// strategic "invest today's surplus in the institution's future" choice, and it can cross a
// SCHOL_GATE to unlock a pantheon scholarship on the spot. Returns the amount actually moved.
function contributeQuy(amt) {
  if (!Number.isFinite(amt) || amt <= 0) return 0;
  amt = Math.min(r1(amt), r1(S.cash));            // never give more than the bank holds
  if (amt <= 0) return 0;
  S.cash = r1(S.cash - amt);
  S.endow.bal = r1(S.endow.bal + amt);
  S.endow.log.push({ t: S.totalDays, gift: amt, ten: "Nhà trường góp" });
  if (S.endow.log.length > 100) S.endow.log.shift();
  endowMilestones();                              // a contribution may cross a gate → unlock now
  return amt;
}

/* ============================================================================
   JUNE — two-stage ceremony (policy → graduation cascade), then admissions.
   ========================================================================== */
function openJune() {
  var grads = S.students.filter(function (s) { return s.grade === 4; });
  if (!grads.length) { foundingJune(); return; } // young school: no graduating class yet
  S.pendingJune = {
    stage: "policy",
    de: rpick(CONTENT.dePool),
    foreshadow: tpl(CONTENT.ticker.poolForeshadow, { n: CONFIG.ADMIT.POOL(S.tiengTam, S.tuition) }),
    gradIds: grads.map(function (s) { return s.id; }),
    deadline: S.totalDays + 18, policy: null, results: null
  };
  S.speed = 0;
}
// young school with no Năm-4 cohort yet: roll the academic year & advance grades, no ceremony.
function foundingJune() {
  for (var i = 0; i < S.students.length; i++) S.students[i].grade = Math.min(4, S.students[i].grade + 1);
  S.year++; eraShift(S.year - 1); // iter-204 L1: the world's decade may turn at the year rollover
  S.utYearNet = 0; S.pierceDefense = false;
  S.speed3Unlocked = true;
  buildAdmitPool();
  news(CONTENT.ticker.foundingJune);
}
// policy: "dam" (đồ án mẫu) | "thuc" (bảo vệ thật)
// E7p (iter 140) — PRIZES: a graduating standout earns an honor (owner: "too few prizes/awards"). A line in a
// life, NEVER a sortable count (VISION invariant #3). Bar-gated → a weak cohort wins nothing; one prize per kid
// (the most fitting). Pure flavor (no growth/destiny effect) → deterministic, sweep-neutral. Surfaced in the epilogue.
function awardPrizes(grads) {
  var bar = CONFIG.PRIZE_BAR, claimed = {};
  function topBy(stat) { var best = null; for (var i = 0; i < grads.length; i++) { var g = grads[i]; if (g[stat] >= bar && !claimed[g.id] && (!best || g[stat] > best[stat])) best = g; } return best; }
  [["st", "sangtao"], ["tn", "taynghe"], ["kt", "thukhoa"]].forEach(function (d) { var g = topBy(d[0]); if (g) { g._prize = d[1]; claimed[g.id] = 1; } });
}
function finalizeJune(policy) {
  if (!S.pendingJune) return;
  var pj = S.pendingJune;
  var d = CONFIG.JUNE.DIEM, pd = CONFIG.JUNE.POLICY_DAM;
  var grads = S.students.filter(function (s) { return pj.gradIds.indexOf(s.id) >= 0; });
  var hasShop = hasRoom("xuong") || hasRoom("phongmay");
  var bonus = 0, viralX = 1;
  if (policy === "dam") { bonus = pd.bonus; for (var k = 0; k < grads.length; k++) grads[k].vet = clamp(grads[k].vet + pd.vetCohort, 0, 100); seedPhot(pd.seedSev, "dam"); gainTT(rnd() < 0.5 ? pd.ttWin : pd.ttLose); }
  else { viralX = 2; }

  awardPrizes(grads); // E7p: honor the cohort's genuine standouts (a line in their life — see awardPrizes)
  var results = [], gradLines = {}; // iter-227: dedup grad flavor across the cohort (was outcomeFlavor — identical for every same-outcome grad)
  for (var i = 0; i < grads.length; i++) {
    var s = grads[i];
    var qvm = Math.min(d.qvmCap, d.qvmPer * Math.floor(s.vet / 20));
    var noRoom = hasShop ? 0 : d.noRoom;
    var diem = clamp(d.base + d.tn * s.tn + d.st * s.st + d.vet * s.vet + qvm + noRoom + bonus + rrange(-d.noise, d.noise), 0, 10);
    diem = r1(diem);
    // A rote exam-champion (huge knowledge + cram, no creativity) doesn't end up unemployed when the
    // craft-based đồ-án score fails — by memorization they "pass" into a bureaucratic công-chức role
    // (văn-mẫu satire). But the rote crammer who also grew a predatory hustle (high cá-mập) pivots to
    // crypto instead → cá mập coin (the dark mirror). Genuine low-everything failures → unemployed.
    var row;
    if (diem < CONFIG.JUNE.PASS) {
      if (isVanMau(s)) row = (s.cm >= 64) ? cascadeRow("CA_MAP_COIN") : cascadeRow("QUAN_VAN_MAU");
      else row = cascadeRow("THAT_NGHIEP");
    } else row = cascadeOutcome(s);
    var tiem = isTiemNang(s);
    // viral defense (rare pierce) — high craft + creativity defends well
    var defScore = CONFIG.JUNE.DEFQ.st * s.st + CONFIG.JUNE.DEFQ.tn * s.tn + CONFIG.JUNE.DEFQ.ut * S.uyTin;
    var viral = false;
    if (defScore >= CONFIG.JUNE.DEFQ.viralAt) {
      var pV = (policy === "thuc" ? CONFIG.JUNE.DEFQ.pViralThat : CONFIG.JUNE.DEFQ.pViral) * viralX;
      if (rnd() < Math.min(0.95, pV)) { viral = true; gainTT(CONFIG.JUNE.DEFQ.viralTT); if (!S.pierceDefense) { gainUT(CONFIG.JUNE.DEFQ.viralUT, true); S.pierceDefense = true; } }
    }
    var a = makeAlumnus(s, row, diem, tiem);
    // iter-227: GIFT-SPECIFIC grad flavor (a coder's kỹ sư reads unlike a maker's), DEDUPED across the cohort — was
    // CONTENT.outcomeFlavor[row.key], one line per outcome shown for EVERY same-outcome grad (a wall of identical lines).
    // Reuses the epilogue's gift-pool (alumPool); falls back to the generic outcome flavor if the gift-pool is exhausted.
    var gpool = (a.fs.tell && CONTENT.alumLinesByTell[a.state] && CONTENT.alumLinesByTell[a.state][a.fs.tell]) || [];
    var cands = gpool.concat(CONTENT.alumLines[a.state] || []), gflav = ""; // gift-specific first, then the generic state pool
    for (var fi = 0; fi < cands.length; fi++) { var fnorm = cands[fi].split("{ten}").join("◊"); if (!gradLines[fnorm]) { gflav = tpl(cands[fi], { ten: s.ten }); gradLines[fnorm] = 1; break; } }
    if (!gflav) gflav = CONTENT.outcomeFlavor[row.key] || ""; // only if a cohort has MORE same-state grads than the whole pool
    var rec = { ten: s.ten, emoji: row.emoji, outcome: row.name, entryChip: CONFIG.ALUM.CHIPS[a.state], diem: diem, flavor: gflav, tiem: tiem, viral: viral, near: nearMiss(s, row), realLine: realCreditSuffix(a.state, a.fs.seed, a.flags, a.fs.tell, a.gradYear, a.fs.origin) }; // iter-154: the gift-vs-fate reading on the graduation results screen — the wasted/realized talent named the MOMENT it happens (VISION §114), same source as the epilogue. iter-203: + tell. iter-205: + gradYear (the DECADE). iter-206: + origin (family circumstance)
    if (s.id === S.META.favId) { rec.fav = true; news("⭐ " + s.ten + " — em bạn dõi theo từ ngày đầu — tốt nghiệp: " + row.name + ". " + CONTENT.protegeCoda[protegeCodaKey(a.state, a.fs.seed)] + "."); S.META.favId = null; } // iter-150: the protégé's payoff now carries the realization reading — the arc's culmination FELT the moment it happens (VISION §114), same coda as the epilogue capstone
    results.push(rec);
    if (s._tpl) a._tpl = true; // Trần Phi Lợi marker (forced arrest year 2)
  }
  // remove grads, advance cohorts
  var gradSet = {}; for (i = 0; i < pj.gradIds.length; i++) gradSet[pj.gradIds[i]] = 1;
  S.students = S.students.filter(function (s) { return !gradSet[s.id]; });
  for (i = 0; i < S.students.length; i++) S.students[i].grade++;
  S.META.graduated += results.length;

  // alumni of PRIOR years advance one world-year now (this cohort waits to next June)
  S.year++; eraShift(S.year - 1); // iter-204 L1: the world's decade may turn at the year rollover
  S.utYearNet = 0; S.pierceDefense = false; // new academic year, reset Uy Tín budget

  pj.stage = "results"; pj.results = results; pj.policy = policy;
  S.speed3Unlocked = true;
  // chain straight into admissions setup
  buildAdmitPool();
}
// cascadeRow/cascadeOutcome/gatePass/isVanMau/isTiemNang/nearMiss/statLabel + makeAlumnus/annMonthFor
// → js/sim/person.js (iter 127 STRUCTURE carve — the destiny resolution: WHO the person becomes at graduation)

// ADMISSIONS — buildAdmitPool / derivedPool / openAdmissions / declareAdmissions / admitRank / awardScholarships
// → js/sim/admissions.js (iter 163 STRUCTURE carve — the intake subsystem). Globals, loaded after engine.js & person.js.

// ALUMNI-WORLD FSM — setAlumState / alumniMonth / alumniTickOne / transition / stevePShort / becomeSteve /
// keynoteFor / arrestAlumnus / scriptedArrest / queueGift / flushGifts → js/sim/alumni.js (iter 212 STRUCTURE carve).
// Globals, loaded after person.js. The person.js note holds: person.js decides WHO becomes; alumni.js sims their WORLD.

/* ============================================================================
   EVENTS — light deck (CONTENT.events), pauses for a choice.
   ========================================================================== */
function eventPred(e) {
  switch (e.pred) {
    case "anyLuyende": return S.presets.n1 === "luyende" || S.presets.n2 === "luyende" || S.presets.n3 === "luyende" || S.presets.n4 === "luyende";
    case "contractPr": return S.tiengTam >= 30 && !S.contracts.some(function (c) { return c.type === "pr"; });
    case "anyClc": return false;
    case "xuongDuan": return hasRoom("xuong") && anyDuan();
    case "moodLow": return S.students.some(function (s) { return s.mood < 45; });
    case "nam4Duan": return S.presets.n4 === "duan" && S.students.some(function (s) { return s.grade === 4; });
    case "thang5": return S.month === 5;
    case "hasNam4": return S.students.some(function (s) { return s.grade === 4; });
    case "famous": return S.tiengTam >= 60; // iter-169: a notable school attracts corporate suitors (the taiTro money-vs-mission fork)
    case "founding": return S.year <= 3 && S.students.length >= 1; // the from-nothing build-up years
    case "common": return S.students.length >= 10;
    default: return e.scripted === true;
  }
}
function anyDuan() { return S.presets.n1 === "duan" || S.presets.n2 === "duan" || S.presets.n3 === "duan" || S.presets.n4 === "duan"; }
function maybeEvent() {
  if (anyModal()) return;
  if (S.month === 6) return;
  if (S.totalDays - S.lastEventDay < 14) return;
  if (rnd() > 0.06) return;
  var curE = eraIndex(S.year); // iter-229: an era-sensitive event (e.minEra) can't fire before its decade — no AI-homework in the 1990s
  var elig = CONTENT.events.filter(function (e) { return eventPred(e) && (e.minEra == null || curE >= e.minEra); });
  var ev = null;
  if (!S._chuongDone) { for (var i = 0; i < elig.length; i++) if (elig[i].id === "chuong") ev = elig[i]; }
  if (!ev && elig.length) ev = elig[Math.floor(rnd() * elig.length)];
  if (!ev) return;
  var targetId = null;
  if (/\{ten\}/.test(ev.desc)) {
    var t = ev.id === "chuong" ? S.students.filter(function (s) { return s.ten === "Mai Sương"; })[0] : pickEventStudent(ev);
    if (!t) return; targetId = t.id;
  } else if (ev.id === "chuong") {
    var ms = S.students.filter(function (s) { return s.ten === "Mai Sương"; })[0]; if (ms) targetId = ms.id;
  }
  S.pendingEvent = { id: ev.id, targetId: targetId, born: S.totalDays };
  S.lastEventDay = S.totalDays; S.speed = 0;
}
function pickEventStudent(ev) {
  var pool = S.students;
  if (ev.pred === "anyLuyende") pool = S.students.filter(function (s) { return S.presets["n" + s.grade] === "luyende"; });
  if (ev.pred === "moodLow") pool = S.students.filter(function (s) { return s.mood < 45; });
  if (ev.pred === "nam4Duan" || ev.pred === "hasNam4") pool = S.students.filter(function (s) { return s.grade === 4; });
  if (!pool.length) pool = S.students;
  return pool.length ? pool[Math.floor(rnd() * pool.length)] : null;
}
function neutralChoice(id) {
  var ev = CONTENT.events.filter(function (e) { return e.id === id; })[0];
  if (!ev) return 0;
  for (var i = 0; i < ev.choices.length; i++) if (ev.choices[i].fx == null) return i;
  return ev.choices.length > 1 ? 1 : 0;
}
function resolveEvent(idx) {
  var pe = S.pendingEvent; if (!pe) return;
  var ev = CONTENT.events.filter(function (e) { return e.id === pe.id; })[0];
  var ch = ev.choices[idx];
  var t = pe.targetId ? S.students.filter(function (s) { return s.id === pe.targetId; })[0] : null;
  applyFx(ch.fx, t);
  if (ev.id === "chuong") S._chuongDone = true;
  S.pendingEvent = null;
}
function classmates(grade, fn) { for (var i = 0; i < S.students.length; i++) if (S.students[i].grade === grade) fn(S.students[i]); }
function virtue(t, key) { if (t) { t.flags.vt = t.flags.vt || []; t.flags.vt.push(key); } gainUT(1, false); bacTamNod(); }
function applyFx(fx, t) {
  switch (fx) {
    case "cramCave": if (S.struct) { S.struct.n3 = "high"; S.struct.n4 = "high"; } gainTT(5); gainUT(-2, false); moodAll(-2); break; // iter-258: cave to cram-pressure → tighten the upper grades (the world bends your dial), reputation up, integrity + a little mood down
    case "cramHold": gainUT(3, false); gainTT(-3); bacTamNod(); break; // iter-258: hold your approach → integrity up, a reputation cost
    case "chuongKyLuat": moodAll(0); if (t) { classmates(t.grade, function (s) { s.kt = clamp(s.kt + 2, 0, 100); }); t.st = clamp(t.st - 5, 0, 100); } break;
    case "chuongTuaVit": if (t) { t.tn = clamp(t.tn + 3, 0, 100); virtue(t, "tuaVit"); } break;
    case "duanKyLuat": if (t) { classmates(t.grade, function (s) { s.kt = clamp(s.kt + 2, 0, 100); }); t.st = clamp(t.st - 4, 0, 100); } break;
    case "duanChoMuon": S.cash = r1(S.cash - 2); if (t) { t.tn = clamp(t.tn + 4, 0, 100); virtue(t, "phongmay"); } break;
    case "tvcOk": gainTT(3); seedPhot(1, "tvc"); break;
    case "tvcNo": gainTC(1); break;
    case "clcHua": break;
    case "clcThang": gainTC(1); break;
    case "chayGiau": seedPhot(2, "chay"); break;
    case "chayBao": gainTT(-2); virtue(null, "pccc"); break;
    case "baoluuGiu": S.cash = r1(S.cash - 10); if (t) { t.mood = clamp(t.mood + 15, 0, 100); virtue(t, "hocBong"); } break;
    case "baoluuKy": if (t) t._drop = true; S.students = S.students.filter(function (s) { return !s._drop; }); break;
    case "tangGioOk": classmates(4, function (s) { s.kt = clamp(s.kt + 2, 0, 100); s.vet = clamp(s.vet + 3, 0, 100); }); break;
    case "tangGioNo": gainTC(1); break;
    case "chodoanMua": S.cash = r1(S.cash - 15); classmates(4, function (s) { s.vet = clamp(s.vet + 10, 0, 100); s._diemBoost = 0.5; }); seedPhot(2, "chodoan"); break;
    case "baoGa": gainTT(3); seedPhot(1, "bao"); break;
    case "baoThat": gainUT(1, false); bacTamNod(); break;
    case "quaNhan": S.cash = r1(S.cash + 25); classmates(4, function (s) { s.vet = clamp(s.vet + 2, 0, 100); }); seedPhot(2, "qua"); break;
    case "quaTuChoi": gainUT(2, false); bacTamNod(); break;
    // founding-era deck
    case "khoeMe": gainTT(5); seedPhot(1, "khoe"); break;
    case "thatTha": gainUT(2, false); bacTamNod(); break;
    case "dayTu": for (var di = 0; di < S.students.length; di++) { var ds = S.students[di]; ds.kt = clamp(ds.kt + 2, 0, 100); ds.vet = clamp(ds.vet + 3, 0, 100); ds.st = clamp(ds.st - 2, 0, 100); } seedPhot(1, "daytu"); break;
    case "dayThat": for (var ti = 0; ti < S.students.length; ti++) { var ts2 = S.students[ti]; ts2.tn = clamp(ts2.tn + 2, 0, 100); ts2.mood = clamp(ts2.mood + 4, 0, 100); } gainUT(1, false); break;
    case "datTenCo": S.cash = r1(S.cash + 30); gainTT(2); gainUT(-2, false); seedPhot(1, "datten");
      // iter-186 (owner): the rename happens FOR REAL — the school is rebranded to the investor's corp name, shown everywhere
      S.schoolName = CONTENT.corpNames[S.totalDays % CONTENT.corpNames.length]; news("🏷️ Trường nay đổi tên thành “" + S.schoolName + "”. Logo mới treo ngay cổng."); break;
    case "datTenGiu": gainUT(2, false); bacTamNod(); break;
    // recurring moral deck
    case "muaHang": S.cash = r1(S.cash - 15); gainTT(6); seedPhot(1, "muahang"); break;
    case "khongMuaHang": gainUT(1, false); bacTamNod(); break;
    case "epHoc": if (t) { t.vet = clamp(t.vet + 5, 0, 100); t.kt = clamp(t.kt + 2, 0, 100); t.mood = clamp(t.mood - 10, 0, 100); } break;
    case "choNghi": if (t) { t.mood = clamp(t.mood + 15, 0, 100); virtue(t, "nghiNgoi"); } break;
    case "loDaoVan": if (t) t.vet = clamp(t.vet + 5, 0, 100); seedPhot(2, "daovan"); break;
    // AI làm hộ — the 2026 open-question: hollow shortcut vs tool-mastery vs hand-won craft
    case "aiNop": if (t) { t.vet = clamp(t.vet + 8, 0, 100); t._diemBoost = 0.5; } gainTT(2); seedPhot(1, "ai"); break;
    case "aiHieu": if (t) { t.tn = clamp(t.tn + 3, 0, 100); t.st = clamp(t.st + 2, 0, 100); } gainTC(1); break;
    case "aiTay": if (t) { t.tn = clamp(t.tn + 5, 0, 100); t.st = clamp(t.st + 3, 0, 100); t.mood = clamp(t.mood - 6, 0, 100); virtue(t, "aiTay"); } gainTC(1); break;
    // the đề-Văn's two real headwinds against a "Steve Việt Nam": brain drain, and the pull toward a "safe" path
    case "duhocChuc": if (t) { t._drop = true; S.students = S.students.filter(function (s) { return !s._drop; }); } gainTC(1); bacTamNod(); break; // let talent fly — you lose your best, quietly honoured
    case "duhocGiu": if (t) { t.mood = clamp(t.mood - 12, 0, 100); t.vet = clamp(t.vet + 4, 0, 100); } gainTT(1); break;                       // keep them for the school's glory — clipped wings
    case "antoanNghe": if (t) { t.vet = clamp(t.vet + 6, 0, 100); t.st = clamp(t.st - 5, 0, 100); } break;                                     // the safe path dulls the spark
    case "antoanDam": if (t) { t.st = clamp(t.st + 5, 0, 100); virtue(t, "damMe"); } break;                                                    // back the passion — one quiet nod
    // học thêm (shadow education) — income & drilled results vs exhaustion & equity
    case "themMo": S.cash = r1(S.cash + 12); for (var hi = 0; hi < S.students.length; hi++) { var hs = S.students[hi]; hs.kt = clamp(hs.kt + 3, 0, 100); hs.vet = clamp(hs.vet + 4, 0, 100); hs.mood = clamp(hs.mood - 8, 0, 100); } gainTT(1); break;
    case "themMienPhi": S.cash = r1(S.cash + 4); for (var hj = 0; hj < S.students.length; hj++) { var hs2 = S.students[hj]; hs2.kt = clamp(hs2.kt + 2, 0, 100); hs2.mood = clamp(hs2.mood - 3, 0, 100); } gainUT(1, false); bacTamNod(); break;
    case "themKhong": moodAll(8); gainTC(1); break;
    // bệnh thành tích (achievement disease) — juice the rankings vs report the truth
    case "ttLam": gainTT(5); for (var ki = 0; ki < S.students.length; ki++) S.students[ki].vet = clamp(S.students[ki].vet + 5, 0, 100); seedPhot(1, "thanhtich"); break;
    case "ttThat": gainUT(2, false); gainTC(1); bacTamNod(); break;
    case "batLamLai": if (t) { t.tn = clamp(t.tn + 5, 0, 100); t.st = clamp(t.st + 3, 0, 100); t.mood = clamp(t.mood - 5, 0, 100); virtue(t, "lamLai"); } break;
    // iter-169 — money-vs-mission (the đề Văn bite at the wealthy-school scale): take the cash + fame at the cost of integrity, or keep the school's gate unbought
    case "taiTroNhan": S.cash = r1(S.cash + 200); gainTT(6); gainUT(-5, false); seedPhot(1, "taitro"); break;
    case "taiTroTuChoi": gainUT(3, false); bacTamNod(); break;
    default: break;
  }
}

/* ---------- contracts ---------- */
function offerContract(def) { S.pendingContract = { def: def, born: S.totalDays }; S.speed = 0; }
function resolveContract(accept) {
  var pc = S.pendingContract; if (!pc) return;
  var c = pc.def;
  if (accept) {
    S.cash = r1(S.cash + (c.sign || 0));
    S.contracts.push({ id: nid(), co: c.co, type: c.type, pay: c.pay, mLeft: c.months, strings: [c.type] });
    gainTC(-2); gainTT(2);
    news(c.accept || ("Đã ký hợp đồng với " + c.co + "."));
  } else { gainTC(2); gainUT(1, false); bacTamNod(); news(c.refuse || ("Từ chối " + c.co + ".")); }
  S.pendingContract = null;
}

/* ---------- flavor line helpers ---------- */
// iter-209 (N1): the gift-specific vignette pool — a coder's KY_SU reads unlike a maker's. Prefer alumLinesByTell[state][tell]
// (the kid's gift), fall back to the generic alumLines[state] for tell="" / uncovered states. Pure lookup → replay-stable.
function alumPool(state, a) { var t = a.fs && a.fs.tell; var bt = t && CONTENT.alumLinesByTell[state] && CONTENT.alumLinesByTell[state][t]; return bt || CONTENT.alumLines[state] || ["—"]; }
function pickLine(state, a) { var b = alumPool(state, a); var i = ((a.id | 0) + ((a.fs && a.fs.seed) | 0)) % b.length; return b[i].replace(/\{ten\}/g, a.ten); } // deterministic per-alumnus index (replay-stable, no rng draw) so even the garage→KY_SU path gets the iter-98 variety
function pickLineIdx(state, a, idx) { var b = alumPool(state, a); return b[idx % b.length].replace(/\{ten\}/g, a.ten); }
function tpl(str, o) { return String(str).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }

// SAVE / LOAD / SANITIZE  → js/save.js (iter-199 STRUCTURE carve — the persistence subsystem; loaded after engine.js, augments window.HVS with loadGame/saveGame there).
/* ============================================================================
   __test API (headless gates) + main-loop clock helper
   ========================================================================== */
function clockTick() {
  // called by ui interval; advances by S.speed sub-ticks (10 = one day)
  S.sub += S.speed;
  while (S.sub >= CONFIG.TICKS_PER_DAY) { S.sub -= CONFIG.TICKS_PER_DAY; dayTick(); }
}

var __test = {
  fresh: function (seed) { freshState(seed); return S; },
  state: function () { return S; },
  days: function (n) { for (var i = 0; i < n; i++) dayTick(); return S; },
  place: function (key, x, y) { return placeRoom(key, x, y); },
  admit: function (cut, quota) { if (!S.pendingAdmit) openAdmissions(); return declareAdmissions(cut, quota, false); },
  pool: function () { if (!S.admissions.poolSeed) buildAdmitPool(); return derivedPool(); },
  alum: function () { return S.alumni; },
  almYears: function (n) { for (var y = 0; y < n; y++) { for (var m = 1; m <= 12; m++) if (m !== 6) alumniMonth(m); S.year++; } return S.alumni; },
  endow: function (n) { S.endow.bal = n; },
  june: function (policy) { openJune(); finalizeJune(policy || "thuc"); return S; },
  config: function () { return CONFIG; }
};

if (typeof window !== "undefined") { window.__test = __test; window.HVS = { S: function () { return S; }, freshState: freshState, clockTick: clockTick, dayTick: dayTick, placeRoom: placeRoom, autoPlace: autoPlace, canPlace: canPlace, finalizeJune: finalizeJune, resolveEvent: resolveEvent, resolveContract: resolveContract, checkMilestones: checkMilestones, studentMajor: studentMajor, khoaHeaded: khoaHeaded, khoaThreshold: khoaThreshold, setKhoaHead: setKhoaHead, teacherById: teacherById, contributeQuy: contributeQuy, mentorStudent: mentorStudent, mentorCount: mentorCount, mentorSlots: mentorSlots }; } // loadGame/saveGame added by js/save.js · declareAdmissions/derivedPool by js/sim/admissions.js (both defined after this runs)
if (typeof module !== "undefined" && module.exports) { module.exports = { freshState: freshState, dayTick: dayTick, get S() { return S; }, __test: __test, setConfig: function (c, t) { CONFIG = c; CONTENT = t; } }; }
