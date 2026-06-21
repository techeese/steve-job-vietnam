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
function eraShift(prevYear) { var pe = eraIndex(prevYear), ce = eraIndex(S.year); if (ce !== pe) { var e = CONFIG.ERAS[ce]; news("🕰️ " + e.name + " — " + e.shift); } }

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
function studentMajor(s) { var m = majorByTell(s.tell); return (m && hasRoom(m.room)) ? m : null; } // null = Đại cương (general)
// P4b — a trưởng-khoa (teacher head). A headed khoa thrives at one fewer member and grows faster.
function khoaHeaded(key) { return !!(S.khoaHead && S.khoaHead[key] && teacherById(S.khoaHead[key])); }
function khoaThreshold(key) { return khoaHeaded(key) ? Math.max(2, CONFIG.SYN_MIN - 1) : CONFIG.SYN_MIN; }
function teacherById(id) { for (var i = 0; i < S.teachers.length; i++) if (S.teachers[i].id === id) return S.teachers[i]; return null; }
// MENTOR'S LEDGER Phase 2 — the headmaster's scarce attention (player verb + helpers; UI wiring lands next)
function mentorCount() { var c = 0, st = S.students; for (var i = 0; i < st.length; i++) if (st[i].mentored) c++; return c; }
function mentorStudent(id) {
  var st = S.students, s = null; for (var i = 0; i < st.length; i++) if (st[i].id === id) { s = st[i]; break; }
  if (!s) return { ok: false, why: "gone" };
  if (s.mentored) { s.mentored = false; return { ok: true, mentored: false }; } // toggle off → free a slot
  if (mentorCount() >= CONFIG.MENTOR_SLOTS) return { ok: false, why: "full" };
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
function freshState(seed) {
  _nextId = 1;
  var sd = (seed != null ? seed : 0x53544556) >>> 0; // "STEV"
  var s = {
    v: CONFIG.V,
    rngState: sd | 0,
    seed0: sd >>> 0,
    // calendar: boot Tháng 6 Năm 1 (sáng lập) — first July rollover opens the FIRST
    // intake; no founding ceremony (no graduates yet). year++ at each June.
    day: 1, month: 6, year: 1, totalDays: 0, sub: 0,
    speed: 0, speed3Unlocked: false,
    schoolName: CONTENT.schoolName, // iter-186 (owner): the academy's name — MUTABLE (the 'datten' investor event renames it for real); shown in the HUD/epilogue/share card

    // economy
    cash: CONFIG.BOOT_CASH, book: CONFIG.BOOK_VALUE, tuition: CONFIG.BOOT_TUITION,
    // meters
    tiengTam: CONFIG.BOOT_TT, uyTin: CONFIG.BOOT_UT, thucChat: CONFIG.BOOT_TC,
    utYearNet: 0, pierceDefense: false, pierceKeynote: false,
    presets: { n1: "canbang", n2: "luyende", n3: "luyende", n4: "luyende" }, // the un-attended baseline WASTES (Mentor's Ledger: inaction loses); the realize/waste spread comes from per-child attention, not the global preset
    rooms: [],
    students: [],
    teachers: [],
    khoaHead: {}, // P4b: khoa key → teacher id (a trưởng-khoa boosts that khoa)
    khoaCup: { trophies: {}, champ: null, lastYear: 0 }, // iter 80: annual inter-khoa Cúp Khoa — a trophy pennant race

    alumni: [],
    admissions: { poolSeed: 0, lastCutoff: 15.0, lastQuota: 12, lastFill: 0, aoCount: 0, bonusOffered: false, declaredHistory: [] },
    endow: { bal: CONFIG.BOOT_ENDOW, log: [], pending: [], drawnYear: false, milestonesClaimed: 0 },
    giftItems: [], // iter-182 (owner steer ckpt3): non-monetary gifts from successful alumni — the "kho lưu niệm", a hook for extension functions later
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
  // scripted Offer 1 — Tập đoàn Trứng Vàng (≈one month after boot)
  if (S.offersSeen.indexOf("trungvang") < 0 && S.year === 1 && S.month >= 10) { S.offersSeen.push("trungvang"); offerContract(CONTENT.contract.trungvang); }
  endowMilestones();
  // decade capstone: once the school reaches its run-cap year, arm the "Mười năm sau" reflection
  if (S.year >= CONFIG.RUN_CAP_YEARS && !S.META.decadeShown && !S._decadeHit) S._decadeHit = true;
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
  news(tpl(CONTENT.ticker.quyLai, { bal: Math.round(S.endow.bal), lai: lai }));

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
    var s = st[i], mm = CONFIG.MATCH(s.tell, S.presets["n" + s.grade]);
    if (s.mentored || mm >= 1.3) blossom++;
    else if (mm < CONFIG.MISMATCH_MM || s.mood < CONFIG.MOOD_PENALTY_BELOW) cool++;
  }
  var n = st.length, key = (blossom >= n * 0.4) ? "blossom" : (cool >= n * 0.3) ? "cool" : "mixed";
  news(CONTENT.tetCohort[key]);
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
  var results = [];
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
    var rec = { ten: s.ten, emoji: row.emoji, outcome: row.name, entryChip: CONFIG.ALUM.CHIPS[a.state], diem: diem, flavor: CONTENT.outcomeFlavor[row.key], tiem: tiem, viral: viral, near: nearMiss(s, row), realLine: realCreditSuffix(a.state, a.fs.seed, a.flags, a.fs.tell, a.gradYear, a.fs.origin) }; // iter-154: the gift-vs-fate reading on the graduation results screen — the wasted/realized talent named the MOMENT it happens (VISION §114), same source as the epilogue. iter-203: + tell. iter-205: + gradYear (the DECADE). iter-206: + origin (family circumstance)
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

/* ============================================================================
   ALUMNI FSM — deterministic per (alumnus, year). seed0 stream only.
   ========================================================================== */
function setAlumState(a, st) { if (a.state !== st) { if (!a.history) a.history = [a.state]; a.state = st; a.history.push(st); } a.yearsInState = 0; } // track the trajectory
function alumniMonth(month) {
  for (var i = 0; i < S.alumni.length; i++) {
    var a = S.alumni[i];
    if (a.annMonth !== month) continue;
    if (a.state === "STEVE") continue;
    if (a._tpl && !a._arrested) continue; // scripted shadow — frozen in CA_MAP_COIN until the Y2-M3 arrest
    alumniTickOne(a);
  }
}
function alumniTickOne(a) {
  var r = mulberry32((S.seed0 ^ Math.imul(a.id, 2654435761) ^ Math.imul(S.year, 40503)) >>> 0);
  a.yearsInState += 1;
  var ysg = Math.max(0, S.year - a.gradYear);
  // DRAW 1 — Steve/garage (always drawn; meaningful only for FOUNDER)
  var d1 = r();
  if (a.state === "FOUNDER") {
    if (!a.flags.garage) {
      var pS = stevePShort(a);
      if (d1 < pS) { a.flags.garage = true; gainTT(-2); a.line = tpl(CONTENT.garageLine, { ten: a.ten }); a.yearsInState = a.yearsInState; return; }
    } else {
      if (d1 < stevePShort(a) * 3) { becomeSteve(a); return; }
      else { setAlumState(a, "KY_SU"); a.line = pickLine("KY_SU", a); return; }
    }
  }
  // DRAW 2 — transition
  var d2 = r();
  transition(a, d2, ysg);
  // DRAW 3 — flavor line
  var d3 = r();
  if (!a.line) a.line = pickLineIdx(a.state, a, Math.floor(d3 * 999));
  // DRAW 4 — gift (resolved at 20/11 flush; here we just queue eligibility)
  var d4 = r();
  queueGift(a, d4);
  // DRAW 5 — NON-monetary item gift (iter-182 owner steer ckpt3). After d4 → does NOT shift any existing draw (r is
  // fresh per alum each tick); items touch no tracked metric → bot/sweep cash byte-identical.
  var d5 = r();
  maybeItemGift(a, d5);
}
// iter-182 (owner: "successful alumni might donate… non-monetary items… for extension functions later"). A grat-scaled
// small chance for a successful alum to gift the school a tangible thing — collected in S.giftItems (the kho lưu niệm),
// named in the feed. Pure hook for now (no mechanical effect; the "extension functions" are a later, owner-gated step).
function maybeItemGift(a, draw) {
  var P = CONFIG.ALUM.ITEM_P[a.state]; if (!P) return;            // only successful states (STEVE/FOUNDER/KY_SU) give items
  if (draw >= clamp(P * (a.grat || 0) / 50, 0, 0.9)) return;      // grat-scaled — a grateful grad gives back
  var pool = CONTENT.giftItems, item = pool[Math.floor(draw * 997) % pool.length]; // deterministic pick from the same draw
  if (!S.giftItems) S.giftItems = [];
  S.giftItems.unshift({ item: item, ten: a.ten, year: S.year, state: a.state });
  if (S.giftItems.length > (CONFIG.ALUM.ITEM_CAP || 24)) S.giftItems.pop();
  news("🎁 " + a.ten + " gửi tặng trường: " + item + ".");
}
function stevePShort(a) {
  var lua = aLua(a);
  var luaM = CONFIG.ALUM.STEVE_LUA[lua] != null ? CONFIG.ALUM.STEVE_LUA[lua] : CONFIG.ALUM.STEVE_LUA_ELSE;
  var p = CONFIG.ALUM.STEVE_BASE * (aCraft(a) >= CONFIG.ALUM.STEVE_CRAFT ? 1 : 0) * luaM * (aHollow(a) <= CONFIG.ALUM.STEVE_HOLLOW ? 1 : 0) * (1 + 0.1 * Math.min(5, a.yearsInState)) * (a.flags.tiemNang ? 1 : CONFIG.ALUM.STEVE_NOFLAG);
  return p * eraFav(a.fs && a.fs.tell); // iter-204 L1: the apex too is era-gated — a coder's 🍎 is a near-certainty in the AI boom, a near-impossibility in the 1990s

}
// iter-208 (NARRATIVE/WRITING): the Steve keynote, picked per-alum by id → two Steves never read identically.
// Deterministic (hashStr, not the live rng) → replay-safe; one source for becomeSteve + the live ui keynote moment.
function keynoteFor(a) { var p = CONTENT.keynotePool; return tpl(p[hashStr("kn" + a.id) % p.length], { ten: a.ten }); }
function becomeSteve(a) {
  setAlumState(a, "STEVE");
  gainTT(CONFIG.ALUM.KEYNOTE_TT);
  if (!S.pierceKeynote) { gainUT(CONFIG.ALUM.KEYNOTE_UT, true); S.pierceKeynote = true; }
  S.META.jobsEver = true; S.META.steves++;
  S.endow.bal = r1(S.endow.bal + CONFIG.ALUM.MEGA_GIFT); // mega-gift to quỹ
  a.line = keynoteFor(a);
  news("🍎 " + a.line); bacTamNod();
}
function transition(a, draw, ysg) {
  var rows = [];
  var fsm = CONFIG.ALUM.FSM[a.state] || [];
  var fav = eraFav(a.fs && a.fs.tell); // iter-204 L1: the CURRENT decade's pull on THIS gift (right kid / wrong era)
  for (var i = 0; i < fsm.length; i++) {
    var row = fsm[i], target = row[0], base = row[1], gate = row[2], w = base;
    if (gate === "arrestClock") { w = Math.min(0.95, 0.18 + 0.06 * a.yearsInState); }
    else if (gate) { w = base * (gateFn(gate, a, ysg) ? 1 : 0); if (gate === "coinpull") w *= (a.flags.coinPath && ysg <= 2 ? 4 : 1); }
    // ERA pull: a favored gift (fav>1) is drawn UP toward realize states (kỹ sư/founder); a wrong-era gift (fav<1)
    // is pushed toward waste (thất nghiệp). Distortions stay era-neutral — those are the school's doing (#4).
    if (fav !== 1) { if (CONFIG.ERA_REALIZE[target]) w *= fav; else if (CONFIG.ERA_WASTE[target]) w *= 1 / fav; }
    if (w > 0) rows.push({ t: target, w: w });
  }
  // ERA MOBILITY (iter-204 L1): the decade can move a settled life. The FSM has no downward exit from kỹ sư/founder,
  // so without this a gift realized once can never be un-realized — but "right kid, WRONG era" needs exactly that: a
  // brilliant coder who graduates into a decade with no place for them slides back to a clerk's desk (KY_SU/FOUNDER→
  // LUONG_ON→THAT_NGHIEP), while a favored gift in its golden decade is pulled UP (THAT_NGHIEP→LUONG_ON→KY_SU). Weight
  // scales with how hostile/golden the era is (|fav−1|). Only directed gifts in non-neutral eras (fav≠1) feel it.
  if (fav < 1) { var dn = (a.state === "LUONG_ON") ? "THAT_NGHIEP" : ((a.state === "KY_SU" || a.state === "FOUNDER") ? "LUONG_ON" : null); if (dn) rows.push({ t: dn, w: CONFIG.ALUM.ERA_REGRESS * (1 - fav) }); }
  else if (fav > 1) { var up = (a.state === "THAT_NGHIEP") ? "LUONG_ON" : (a.state === "LUONG_ON" ? "KY_SU" : null); if (up) rows.push({ t: up, w: CONFIG.ALUM.ERA_RISE * (fav - 1) }); }
  // BI_BAT special (FSM empty in data): yearsInState>=2 → escape
  if (a.state === "BI_BAT" && a.yearsInState >= 2) { rows = [{ t: "THAT_NGHIEP", w: 0.9 }, { t: "CA_MAP_COIN", w: 0.1 }]; }
  var sum = 0; for (i = 0; i < rows.length; i++) sum += rows[i].w;
  if (sum > CONFIG.ALUM.ROW_CAP) { var sc = CONFIG.ALUM.ROW_CAP / sum; for (i = 0; i < rows.length; i++) rows[i].w *= sc; sum = CONFIG.ALUM.ROW_CAP; }
  var cum = 0;
  for (i = 0; i < rows.length; i++) {
    cum += rows[i].w;
    if (draw < cum) {
      var to = rows[i].t;
      if (to === "BI_BAT") arrestAlumnus(a);
      else {
        setAlumState(a, to); a.line = "";
        // iter-170: surface the SCATTER — a former student's life out in the world, glimpsed in the feed (the
        // owner's "watch them tản đi khắp nơi" / THESIS marks 1+3: lives become someone, the wide range). THROTTLED
        // to ≤1 per 60 days and DETERMINISTIC (no rnd) so the headless sweep/bot stay byte-identical; glimpsed,
        // not metered (the steady kỹ sư shown as worthy as the founder; only out-in-the-world alumni, ysg≥1).
        if (ysg >= 1 && CONFIG.ALUM.CHIPS[to]) {
          if (a.flags && a.flags.protege && S.totalDays - (S._lastProtegeBeat || 0) >= 30) {
            // iter-171: the kid you FOLLOWED, out in the world — the deepest attachment payoff (mark 2, care by
            // name). Own gentler cooldown + ⭐ (gold in the ticker) so you reliably watch YOUR protégé's life unfold.
            news("⭐ " + a.ten + " — đứa em bạn từng dõi theo — giờ là " + CONFIG.ALUM.CHIPS[to] + ".");
            S._lastProtegeBeat = S.totalDays;
          } else if (S.totalDays - (S._lastAlumLifeBeat || 0) >= 60) {
            news("📰 " + a.ten + " — giờ là " + CONFIG.ALUM.CHIPS[to] + ".");
            S._lastAlumLifeBeat = S.totalDays;
          }
        }
      }
      return;
    }
  }
  // else: stay (residual)
}
function gateFn(key, a, ysg) {
  var craft = aCraft(a), hustle = aHustle(a), hollow = aHollow(a), lua = aLua(a);
  switch (key) {
    case "craft50": return craft >= 50;
    case "craft55": return craft >= 55;
    case "lua3": return lua >= 3;
    case "lua3hustle50": return lua >= 3 && hustle >= 50;
    case "coinpull": return hollow >= 50 && hustle >= 60;
    default: return true;
  }
}
function arrestAlumnus(a) {
  setAlumState(a, "BI_BAT");
  var dmg = r1(CONFIG.ALUM.ARREST(aHollow(a) >= 50 ? 2 : 1, S.tiengTam, Math.max(0, S.year - a.gradYear)));
  S.tiengTam = clamp(r1(S.tiengTam - dmg), 0, 200);
  gainUT(-2, false);
  S.META.arrested++;
  a.line = rpick(CONTENT.alumLines.BI_BAT).replace("{ten}", a.ten);
  news("🚔 Cựu sinh viên " + a.ten + " bị bắt. Tiếng Tăm −" + Math.round(dmg) + ".");
}
function scriptedArrest() {
  for (var i = 0; i < S.alumni.length; i++) {
    var a = S.alumni[i];
    if (a._tpl && a.state !== "BI_BAT") {
      setAlumState(a, "BI_BAT"); a._arrested = true;
      var dmg = r1(CONFIG.ALUM.ARREST(2, S.tiengTam, Math.max(0, S.year - a.gradYear)));
      S.tiengTam = clamp(r1(S.tiengTam - dmg), 0, 200);
      gainUT(-2, false); S.META.arrested++;
      news(CONTENT.arrestTPL + " (" + CONTENT.arrestNote + ")");
      // morality clause cascade
      S.contracts = S.contracts.filter(function (c) { news(tpl(CONTENT.contract.morality, { co: c.co })); return false; });
      return;
    }
  }
}

/* ---------- gifts ---------- */
function queueGift(a, draw) {
  var base = CONFIG.ALUM.GIFT_BASE[a.state]; if (!base) return;
  var p = clamp(base * a.grat / 50, 0, 0.95);
  if (draw < p) {
    var rng = CONFIG.ALUM.GIFT_AMT[a.state] || [0, 0];
    var amt = a.state === "STEVE" ? CONFIG.ALUM.MEGA_GIFT : Math.round(rrange(rng[0], rng[1]) * (1 + S.uyTin / 100));
    S.endow.pending.push({ amt: amt, alumId: a.id, ten: a.ten, vt: a.flags.vt && a.flags.vt.length ? a.flags.vt[0] : null });
    a.gifts += amt;
  }
}
function flushGifts() {
  if (!S.endow.pending.length) {
    // scripted guarantee: by 20/11 of Y2, if zero gifts and ≥1 KY_SU alumnus → force one
    if (S.year >= 2) { for (var i = 0; i < S.alumni.length; i++) if (S.alumni[i].state === "KY_SU") { S.endow.pending.push({ amt: 30, alumId: S.alumni[i].id, ten: S.alumni[i].ten, vt: null }); break; } }
    if (!S.endow.pending.length) return;
  }
  var n = S.endow.pending.length, biggest = null, cashSum = 0, quySum = 0;
  for (var j = 0; j < S.endow.pending.length; j++) {
    var g = S.endow.pending[j];
    if (g.amt >= CONFIG.FUND.GIFT_TO_QUY_MIN) { S.endow.bal = r1(S.endow.bal + g.amt); quySum += g.amt; }
    else { S.cash = r1(S.cash + g.amt); cashSum += g.amt; }
    if (!biggest || g.amt > biggest.amt) biggest = g;
    S.endow.log.push({ t: S.totalDays, gift: g.amt, ten: g.ten });
  }
  S._giftFlush = { n: n, biggest: biggest, quote: (biggest && biggest.vt && CONTENT.giftVt[biggest.vt]) || CONTENT.giftHead }; // never "undefined": fall back to giftHead for any uncovered virtue
  news("🎓 " + n + " phong bì từ cựu sinh viên (" + Math.round(cashSum + quySum) + "tr).");
  bacTamNod();
  S.endow.pending = [];
}

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
  var elig = CONTENT.events.filter(eventPred);
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

if (typeof window !== "undefined") { window.__test = __test; window.HVS = { S: function () { return S; }, freshState: freshState, clockTick: clockTick, dayTick: dayTick, placeRoom: placeRoom, autoPlace: autoPlace, canPlace: canPlace, finalizeJune: finalizeJune, resolveEvent: resolveEvent, resolveContract: resolveContract, checkMilestones: checkMilestones, studentMajor: studentMajor, khoaHeaded: khoaHeaded, khoaThreshold: khoaThreshold, setKhoaHead: setKhoaHead, teacherById: teacherById, contributeQuy: contributeQuy, mentorStudent: mentorStudent, mentorCount: mentorCount }; } // loadGame/saveGame added by js/save.js · declareAdmissions/derivedPool by js/sim/admissions.js (both defined after this runs)
if (typeof module !== "undefined" && module.exports) { module.exports = { freshState: freshState, dayTick: dayTick, get S() { return S; }, __test: __test, setConfig: function (c, t) { CONFIG = c; CONTENT = t; } }; }
