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
function nid() { return _nextId++; }

/* derived alumni stats (never stored — DESIGN §5a) */
function aCraft(a) { return 0.6 * a.fs.tn + 0.4 * a.fs.st; }
function aHustle(a) { return a.fs.cm; }
function aHollow(a) { return a.fs.vet; }
function aLua(a) { return a.fs.seed; }

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
  if (S.students.length >= CONFIG.ROSTER_CAP) { news(m.icon + " Mở " + m.name + " — nhưng trường đã chật, chưa nhận thêm được."); return; }
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
function upgradeCost(d, lvl) { return Math.max(50, d.cost || 0); } // flat per upgrade (decision + a small money sink)
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
function genStudent(grade, opts) {
  opts = opts || {};
  var seed = opts.seed != null ? opts.seed : rint(1, 5);
  var s = {
    id: nid(), ten: opts.ten || genName(), grade: grade, seed: seed,
    kt: 20, tn: 15, st: 18, cm: 15, vet: 5, mood: 70,
    tell: opts.tell || rollTell(), flags: { vt: [] }
  };
  for (var k in opts) if (k !== "seed" && k !== "ten" && k !== "tell") s[k] = opts[k];
  return s;
}
function genName() {
  var n = CONTENT.nameParts;
  return rpick(n.ho) + " " + rpick(n.dem) + " " + rpick(n.ten);
}
function rollTell() {
  var r = rnd();
  if (r < 0.18) return "spark";   // tinkerer
  if (r < 0.34) return "hype";    // showy
  if (r < 0.46) return "sky";     // dreamer
  return "";
}

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
    // economy
    cash: CONFIG.BOOT_CASH, book: CONFIG.BOOK_VALUE, tuition: CONFIG.BOOT_TUITION,
    // meters
    tiengTam: CONFIG.BOOT_TT, uyTin: CONFIG.BOOT_UT, thucChat: CONFIG.BOOT_TC,
    utYearNet: 0, pierceDefense: false, pierceKeynote: false,
    presets: { n1: "canbang", n2: "luyende", n3: "luyende", n4: "luyende" },
    rooms: [],
    students: [],
    teachers: [],
    khoaHead: {}, // P4b: khoa key → teacher id (a trưởng-khoa boosts that khoa)
    alumni: [],
    admissions: { poolSeed: 0, lastCutoff: 15.0, lastQuota: 12, lastFill: 0, aoCount: 0, bonusOffered: false, declaredHistory: [] },
    endow: { bal: CONFIG.BOOT_ENDOW, log: [], pending: [], drawnYear: false, milestonesClaimed: 0 },
    scholarships: [
      { key: "tdn", holderId: null, suspended: false },
      { key: "tqb", holderId: null, suspended: false },
      { key: "hxh", holderId: null, suspended: false }
    ],
    contracts: [], corpBlacklist: {}, offersSeen: [],
    photSeeds: [], examHistory: [],
    news: [],
    META: { jobsEver: false, sound: false, tutorial: false, graduated: 0, arrested: 0, steves: 0, goalsHit: [], build: "", decadeShown: false, favId: null, campusTier: 0, majorsUnlocked: [] },
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
  if (S.pendingAdmit && S.totalDays >= S.pendingAdmit.deadline) declareAdmissions(Math.max(15, S.admissions.lastCutoff - 0.5), 12, true);

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
  if (S.month === 9 && S.day === 1) scholarshipDraw(); // day always 1 right after rollover
  if (S.month === 6 && S.lastJuneYear !== S.year) { S.lastJuneYear = S.year; openJune(); }
  if (S.month === 7 && !S.pendingAdmit && !hasResolvedAdmitThisYear()) openAdmissions();
  if (S.month === 11) flushGifts();
  // scripted Offer 1 — Tập đoàn Trứng Vàng (≈one month after boot)
  if (S.offersSeen.indexOf("trungvang") < 0 && S.year === 1 && S.month >= 10) { S.offersSeen.push("trungvang"); offerContract(CONTENT.contract.trungvang); }
  endowMilestones();
  // decade capstone: once the school reaches its run-cap year, arm the "Mười năm sau" reflection
  if (S.year >= CONFIG.RUN_CAP_YEARS && !S.META.decadeShown && !S._decadeHit) S._decadeHit = true;
}
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
  var mult = 1, mood = 0;
  for (var i = 0; i < S.teachers.length; i++) {
    var t = S.teachers[i];
    if (t.trait === "tch") mult += 0.06;
    else if (t.trait === "isi") mult -= 0.04;
    else if (t.trait === "hype") mood += (t.age < 2 ? 1 : -0.5);
  }
  return { mult: Math.max(0.4, mult), mood: mood };
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

function growStudents() {
  var n = S.students.length;
  var crowdByGrade = {};
  var counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  var i, s;
  for (i = 0; i < n; i++) counts[S.students[i].grade]++;
  for (var g = 1; g <= 4; g++) crowdByGrade[g] = CONFIG.CROWD(counts[g]);
  var tf = teacherFactor();
  var dpm = CONFIG.DAYS_PER_MONTH;
  var majorCount = {}; for (i = 0; i < n; i++) { var mm0 = studentMajor(S.students[i]); if (mm0) majorCount[mm0.key] = (majorCount[mm0.key] || 0) + 1; } // khoa headcounts for synergy
  var thriving = 0; for (var mk in majorCount) if (majorCount[mk] >= khoaThreshold(mk)) thriving++; // P4: ≥2 thriving khoas → cross-pollination (a head lowers the bar)
  for (i = 0; i < n; i++) {
    s = S.students[i];
    var p = CONFIG.PRESETS[S.presets["n" + s.grade]] || CONFIG.PRESETS.canbang;
    var sm = CONFIG.SEED_MULT(s.seed);
    var vm = CONFIG.VET_MULT(s.vet);
    var moodF = s.mood < CONFIG.MOOD_PENALTY_BELOW ? 0.7 : 1;
    var roomF = (S.presets["n" + s.grade] === "duan" && !hasRoom("phongmay")) ? 0.5 : 1;
    var g = sm * vm * crowdByGrade[s.grade] * tf.mult * moodF * roomF / dpm;
    s.kt = ktSat(s.kt + p.kt * g * hbMult(s, "kt"));
    s.tn = clamp(s.tn + p.tn * g * scholarshipMult("tn") * hbMult(s, "tn"), 0, 100);
    s.st = clamp(s.st + p.st * g * scholarshipMult("st") * hbMult(s, "st"), 0, 100);
    var gCm = sm * crowdByGrade[s.grade] * tf.mult * moodF * roomF / dpm; // cá-mập (gaming-the-system hustle) isn't slowed by the cram/vet drag
    s.cm = clamp(s.cm + p.cm * gCm, 0, 100);
    var vetGain = p.vet / dpm * hbMult(s, "vet");
    s.vet = clamp(s.vet + vetGain, 0, 100);
    s.mood = clamp(s.mood + (p.mood + tf.mood) / dpm, 0, 100);
    var smj = studentMajor(s); // khoa synergy: a full khoa lifts its members' signature stat
    if (smj && (majorCount[smj.key] || 0) >= khoaThreshold(smj.key)) {
      var headed = khoaHeaded(smj.key); // a trưởng-khoa makes the khoa thrive sooner AND grow faster
      s[smj.stat] = clamp(s[smj.stat] + CONFIG.SYN_GROW + (headed ? CONFIG.HEAD_BONUS : 0), 0, 100);
      if (thriving >= 2 && smj.cross) s[smj.cross] = clamp(s[smj.cross] + CONFIG.SYN_CROSS, 0, 100); // liên khoa: cross-pollinate a 2nd stat
    }
    if (s.mood < CONFIG.DROPOUT_MOOD && rnd() < CONFIG.DROPOUT_P / dpm) s._drop = true;
  }
  if (n) S.students = S.students.filter(function (x) { return !x._drop; });
}
function ktSat(v) {
  if (v > CONFIG.KT_SATURATE) v -= CONFIG.KT_RUST / CONFIG.DAYS_PER_MONTH;
  return clamp(v, 0, 100);
}

/* ---------- monthly economy ---------- */
function economyTick() {
  var n = S.students.length, i;
  var income = r1(S.tuition * n);
  var salaries = 0; for (i = 0; i < S.teachers.length; i++) { salaries += S.teachers[i].luong; S.teachers[i].age += 1 / 12; }
  var roomCost = 0; for (i = 0; i < S.rooms.length; i++) roomCost += (CONFIG.ROOMS[S.rooms[i].key].cost || 0);
  var maint = r1(CONFIG.MAINT_RATE * (S.book + roomCost));
  var materials = 0;
  for (i = 0; i < S.students.length; i++) if (S.presets["n" + S.students[i].grade] === "duan") materials += CONFIG.DUAN_COST_PER_SV;
  var contractPay = 0;
  S.contracts = S.contracts.filter(function (c) { contractPay += c.pay; c.mLeft -= 1; return c.mLeft > 0; });
  S.cash = r1(S.cash + income + contractPay - salaries - maint - materials);
  if (S.cash > CONFIG.CASH_KEEP) S.cash = r1(S.cash - (S.cash - CONFIG.CASH_KEEP) * CONFIG.CASH_DRAIN); // reinvest surplus (money sink)

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
  if (hasRoom("cangtin")) moodAll(roomLevel("cangtin"));        // +1 Mood/cấp
  if (hasRoom("lab")) gainTT(0.5 * roomLevel("lab"));           // +0,5 Tiếng Tăm/cấp
  var phLv = roomLevel("phonghoc"); if (phLv > 1) moodAll(phLv - 1); // extra classrooms ease the crowding
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
function tetBeat() { moodAll(10); S.endow.bal = r1(S.endow.bal); S.cash = r1(S.cash + 10); news(CONTENT.modal.tet); }
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

/* ============================================================================
   JUNE — two-stage ceremony (policy → graduation cascade), then admissions.
   ========================================================================== */
function openJune() {
  var grads = S.students.filter(function (s) { return s.grade === 4; });
  if (!grads.length) { foundingJune(); return; } // young school: no graduating class yet
  S.pendingJune = {
    stage: "policy",
    de: rpick(CONTENT.dePool),
    foreshadow: tpl(CONTENT.ticker.poolForeshadow, { n: CONFIG.ADMIT.POOL(S.tiengTam) }),
    gradIds: grads.map(function (s) { return s.id; }),
    deadline: S.totalDays + 18, policy: null, results: null
  };
  S.speed = 0;
}
// young school with no Năm-4 cohort yet: roll the academic year & advance grades, no ceremony.
function foundingJune() {
  for (var i = 0; i < S.students.length; i++) S.students[i].grade = Math.min(4, S.students[i].grade + 1);
  S.year++;
  S.utYearNet = 0; S.pierceDefense = false;
  S.speed3Unlocked = true;
  buildAdmitPool();
  news(CONTENT.ticker.foundingJune);
}
// policy: "dam" (đồ án mẫu) | "thuc" (bảo vệ thật)
function finalizeJune(policy) {
  if (!S.pendingJune) return;
  var pj = S.pendingJune;
  var d = CONFIG.JUNE.DIEM, pd = CONFIG.JUNE.POLICY_DAM;
  var grads = S.students.filter(function (s) { return pj.gradIds.indexOf(s.id) >= 0; });
  var hasShop = hasRoom("xuong") || hasRoom("phongmay");
  var bonus = 0, viralX = 1;
  if (policy === "dam") { bonus = pd.bonus; for (var k = 0; k < grads.length; k++) grads[k].vet = clamp(grads[k].vet + pd.vetCohort, 0, 100); seedPhot(pd.seedSev, "dam"); gainTT(rnd() < 0.5 ? pd.ttWin : pd.ttLose); }
  else { viralX = 2; }

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
    var rec = { ten: s.ten, emoji: row.emoji, outcome: row.name, entryChip: CONFIG.ALUM.CHIPS[a.state], diem: diem, flavor: CONTENT.outcomeFlavor[row.key], tiem: tiem, viral: viral, near: nearMiss(s, row) };
    if (s.id === S.META.favId) { rec.fav = true; news("⭐ " + s.ten + " — em bạn dõi theo từ ngày đầu — tốt nghiệp: " + row.name + "."); S.META.favId = null; } // the protégé's payoff
    results.push(rec);
    if (s._tpl) a._tpl = true; // Trần Phi Lợi marker (forced arrest year 2)
  }
  // remove grads, advance cohorts
  var gradSet = {}; for (i = 0; i < pj.gradIds.length; i++) gradSet[pj.gradIds[i]] = 1;
  S.students = S.students.filter(function (s) { return !gradSet[s.id]; });
  for (i = 0; i < S.students.length; i++) S.students[i].grade++;
  S.META.graduated += results.length;

  // alumni of PRIOR years advance one world-year now (this cohort waits to next June)
  S.year++;
  S.utYearNet = 0; S.pierceDefense = false; // new academic year, reset Uy Tín budget

  pj.stage = "results"; pj.results = results; pj.policy = policy;
  S.speed3Unlocked = true;
  // chain straight into admissions setup
  buildAdmitPool();
}
function cascadeRow(key) { for (var i = 0; i < CONFIG.CASCADE.length; i++) if (CONFIG.CASCADE[i].key === key) return CONFIG.CASCADE[i]; return CONFIG.CASCADE[CONFIG.CASCADE.length - 1]; }
function cascadeOutcome(s) {
  for (var i = 0; i < CONFIG.CASCADE.length; i++) if (gatePass(CONFIG.CASCADE[i].gate, s)) return CONFIG.CASCADE[i];
  return CONFIG.CASCADE[CONFIG.CASCADE.length - 1];
}
function gatePass(gate, s) {
  var hasOr = ("ktOr" in gate) || ("tnOr" in gate);
  for (var k in gate) {
    var spec = gate[k];
    if (k === "tnMax") { if (!(s.tn <= spec[0])) return false; continue; }
    if (k === "ktOr" || k === "tnOr") continue;
    var val = s[k];
    if (val == null) return false;
    if (spec[1] > 0) { if (!(val >= spec[0])) return false; } else { if (!(val <= spec[0])) return false; }
  }
  if (hasOr) {
    var ok = false;
    if (gate.ktOr && s.kt >= gate.ktOr[0]) ok = true;
    if (gate.tnOr && s.tn >= gate.tnOr[0]) ok = true;
    if (!ok) return false;
  }
  return true;
}
// the pure rote profile: memorized everything (high knowledge), drilled to death (high cram),
// no spark of their own (near-zero creativity) — the văn-mẫu champion.
function isVanMau(s) { return s.kt >= 70 && s.vet >= 55 && s.st <= 25; }
function isTiemNang(s) {
  var t = CONFIG.TIEMNANG;
  return s.st >= t.st && s.tn >= t.tn && s.cm >= t.cm && s.vet <= t.vetMax && S.thucChat >= t.tcMin;
}
function nearMiss(s, row) {
  // closest missed cascade tier (for the wistful one-liner)
  for (var i = 0; i < CONFIG.CASCADE.length; i++) {
    var g = CONFIG.CASCADE[i].gate;
    for (var k in g) {
      if (k === "ktOr" || k === "tnOr" || k === "tnMax") continue;
      var spec = g[k]; if (spec[1] <= 0) continue;
      var miss = spec[0] - (s[k] || 0);
      if (miss > 0 && miss <= 6 && CONFIG.CASCADE[i].key !== row.key) return tpl(CONTENT.nearMiss, { n: Math.ceil(miss), stat: statLabel(k) });
    }
  }
  return null;
}
function statLabel(k) { return { kt: "Kiến Thức", tn: "Tay Nghề", st: "Sáng Tạo", cm: "Cá Mập", vet: "Vẹt" }[k] || k; }

function makeAlumnus(s, row, diem, tiem) {
  var entry = CONFIG.ALUM.ENTRY_MAP[row.key] || "THAT_NGHIEP";
  var flags = { tiemNang: tiem, coinPath: row.key === "CA_MAP_COIN", garage: false, vt: (s.flags.vt || []).slice() };
  var ef = CONFIG.ALUM.ENTRY_FLAGS[row.key]; if (ef) flags[ef] = true;
  if (s.flags.hb) flags.hb = s.flags.hb;
  var id = nid();
  var grat = clamp(0.35 * s.mood + 0.35 * (100 - s.vet) + 8 * flags.vt.length + (s.flags.hb ? 10 : 0), 0, 100);
  var a = {
    id: id, ten: s.ten, gradYear: S.year, outcome: row.key, state: entry, history: [entry],
    yearsInState: 0, annMonth: annMonthFor(id),
    fs: { kt: Math.round(s.kt), tn: Math.round(s.tn), st: Math.round(s.st), cm: Math.round(s.cm), vet: Math.round(s.vet), seed: s.seed },
    grat: r1(grat), gifts: 0, flags: flags, line: ""
  };
  S.alumni.push(a);
  return a;
}
function annMonthFor(id) { var months = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12]; return months[hashStr("a" + id) % 11]; }

/* ============================================================================
   ADMISSIONS — deterministic pool off poolSeed, modal cutoff/quota, resolve.
   ========================================================================== */
function buildAdmitPool() {
  S.admissions.poolSeed = (Math.floor(rnd() * 4294967296)) >>> 0;
}
function derivedPool() {
  var n = CONFIG.ADMIT.POOL(S.tiengTam);
  var mu = CONFIG.ADMIT.MU(S.uyTin, S.tiengTam, S.year), sigma = CONFIG.ADMIT.SIGMA;
  var pool = [];
  for (var i = 0; i < n; i++) {
    var pr = mulberry32((S.admissions.poolSeed ^ Math.imul(i + 1, 0x9E3779B9)) >>> 0);
    var score = clamp(r2(gauss(pr) * sigma + mu), 3, 30);
    var seedW = 1 + Math.round((score - 12) / 4.5); seedW = clamp(seedW, 1, 5);
    pool.push({ score: score, seed: seedW, tell: pr() < 0.3 ? "spark" : (pr() < 0.5 ? "hype" : "") });
  }
  pool.sort(function (a, b) { return b.score - a.score; });
  return pool;
}
function openAdmissions() {
  if (!S.admissions.poolSeed) buildAdmitPool();
  var pool = derivedPool();
  var a = S.admissions;
  S.pendingAdmit = {
    year: S.year, pool: pool, n: pool.length,
    cut: clamp(r025(CONFIG.ADMIT.MU(S.uyTin, S.tiengTam, S.year) - 1), CONFIG.ADMIT.CUT_MIN, CONFIG.ADMIT.CUT_MAX),
    quota: Math.min(CONFIG.ADMIT.QUOTA_MAX, Math.max(CONFIG.ADMIT.QUOTA_MIN, Math.min(CONFIG.COHORT_NOMINAL, CONFIG.ROSTER_CAP - S.students.length))),
    lastCutoff: a.lastCutoff, lastFill: a.lastFill, lastQuota: a.lastQuota,
    rivals: CONFIG.ADMIT.RIVALS(S.year), deadline: S.totalDays + 18
  };
  S.speed = 0;
}
function declareAdmissions(cutoff, quota, auto) {
  cutoff = clamp(r025(cutoff), CONFIG.ADMIT.CUT_MIN, CONFIG.ADMIT.CUT_MAX);
  quota = clamp(Math.round(quota), CONFIG.ADMIT.QUOTA_MIN, CONFIG.ADMIT.QUOTA_MAX);
  var pool = S.pendingAdmit ? S.pendingAdmit.pool : derivedPool();
  var rivals = S.pendingAdmit ? S.pendingAdmit.rivals : CONFIG.ADMIT.RIVALS(S.year);
  // stunt reactions
  if (cutoff >= 30.0) { gainTT(12); gainUT(-3, false); seedPhot(2, "admit300"); news(CONTENT.ticker.cutHi300); }
  else if (cutoff >= 29.5) { gainTT(8); gainUT(-2, false); seedPhot(1, "admit295"); news(CONTENT.ticker.cutHi295); }
  else if (cutoff >= 27) { gainTT(4); news(CONTENT.ticker.cutHi27); }
  else if (cutoff <= 15.5) { gainTT(-3); news(CONTENT.ticker.cutLo); }
  // resolve
  var qualified = []; for (var i = 0; i < pool.length; i++) if (pool[i].score >= cutoff) qualified.push(pool[i]);
  var take = qualified.slice(0, Math.min(quota, CONFIG.ROSTER_CAP - S.students.length));
  for (i = 0; i < take.length; i++) {
    var ap = take[i];
    var s = genStudent(1, { seed: ap.seed, tell: ap.tell, kt: rint(15, 30), tn: rint(5, 20), st: rint(15, 35), cm: rint(5, 20), mood: rint(65, 80), vet: rint(0, 10) });
    // Mai Sương — the founder's first believer joins the very first non-empty intake.
    if (S._maiPending) { s.ten = "Mai Sương"; s.seed = 5; s.kt = 22; s.tn = 16; s.st = 35; s.cm = 12; s.mood = 72; s.vet = 4; s.tell = "sky"; S._maiPending = false; }
    S.students.push(s);
  }
  // scholarship auto-award to top holder-with-tell
  awardScholarships(take);
  // BXH rank
  var rank = admitRank(cutoff, rivals);
  var pay = CONFIG.ADMIT.RANK_TT[clamp(rank - 1, 0, 3)];
  gainTT(pay); if (rank <= 2) gainTT(2);
  // history
  S.admissions.lastCutoff = cutoff; S.admissions.lastQuota = quota; S.admissions.lastFill = take.length;
  S.admissions.declaredHistory.push({ year: S.year, cutoff: cutoff, fill: take.length, rank: rank });
  if (S.admissions.declaredHistory.length > 20) S.admissions.declaredHistory.shift();
  S.examHistory.push({ year: S.year, cutoff: cutoff, rank: rank, fill: take.length });
  news("Công bố điểm chuẩn " + cutoff.toFixed(2) + " — " + take.length + "/" + quota + " nhập học. Hạng " + rank + "/4.");
  S.pendingAdmit = null;
  checkMilestones(); // a fresh intake can complete cohort1 / grow20
  return { fill: take.length, rank: rank };
}
function admitRank(cut, rivals) {
  var all = [cut]; for (var i = 0; i < rivals.length; i++) all.push(rivals[i].cut + (rivals[i].noise ? rrange(-rivals[i].noise, rivals[i].noise) : 0));
  all.sort(function (a, b) { return b - a; });
  return all.indexOf(cut) + 1;
}
function awardScholarships(cohort) {
  for (var i = 0; i < S.scholarships.length; i++) {
    var sc = S.scholarships[i]; if (!sc._endowed || sc.suspended) continue;
    // find a not-yet-holder student in the new cohort with a tell, highest seed
    var best = null;
    for (var j = 0; j < cohort.length; j++) { /* cohort entries are pool refs, holders set on actual students */ }
    var pool = S.students.filter(function (s) { return s.grade === 1 && !s.flags.hb && s.tell; });
    pool.sort(function (a, b) { return b.seed - a.seed; });
    if (pool.length) {
      var s = pool[0]; s.flags.hb = sc.key; s.seed = clamp(s.seed + 1, 1, 5); sc.holderId = s.id;
      bacTamNod();
    }
  }
}

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
}
function stevePShort(a) {
  var lua = aLua(a);
  var luaM = CONFIG.ALUM.STEVE_LUA[lua] != null ? CONFIG.ALUM.STEVE_LUA[lua] : CONFIG.ALUM.STEVE_LUA_ELSE;
  var p = CONFIG.ALUM.STEVE_BASE * (aCraft(a) >= CONFIG.ALUM.STEVE_CRAFT ? 1 : 0) * luaM * (aHollow(a) <= CONFIG.ALUM.STEVE_HOLLOW ? 1 : 0) * (1 + 0.1 * Math.min(5, a.yearsInState)) * (a.flags.tiemNang ? 1 : CONFIG.ALUM.STEVE_NOFLAG);
  return p;
}
function becomeSteve(a) {
  setAlumState(a, "STEVE");
  gainTT(CONFIG.ALUM.KEYNOTE_TT);
  if (!S.pierceKeynote) { gainUT(CONFIG.ALUM.KEYNOTE_UT, true); S.pierceKeynote = true; }
  S.META.jobsEver = true; S.META.steves++;
  S.endow.bal = r1(S.endow.bal + CONFIG.ALUM.MEGA_GIFT); // mega-gift to quỹ
  a.line = tpl(CONTENT.keynoteLine, { ten: a.ten });
  news(a.line); bacTamNod();
}
function transition(a, draw, ysg) {
  var rows = [];
  var fsm = CONFIG.ALUM.FSM[a.state] || [];
  for (var i = 0; i < fsm.length; i++) {
    var row = fsm[i], target = row[0], base = row[1], gate = row[2], w = base;
    if (gate === "arrestClock") { w = Math.min(0.95, 0.18 + 0.06 * a.yearsInState); }
    else if (gate) { w = base * (gateFn(gate, a, ysg) ? 1 : 0); if (gate === "coinpull") w *= (a.flags.coinPath && ysg <= 2 ? 4 : 1); }
    if (w > 0) rows.push({ t: target, w: w });
  }
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
      else { setAlumState(a, to); a.line = ""; }
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
  news("Cựu sinh viên " + a.ten + " bị bắt. Tiếng Tăm −" + Math.round(dmg) + ".");
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
  S._giftFlush = { n: n, biggest: biggest, quote: biggest && biggest.vt ? CONTENT.giftVt[biggest.vt] : CONTENT.giftHead };
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
    case "datTenCo": S.cash = r1(S.cash + 30); gainTT(2); gainUT(-2, false); seedPhot(1, "datten"); break;
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
    case "batLamLai": if (t) { t.tn = clamp(t.tn + 5, 0, 100); t.st = clamp(t.st + 3, 0, 100); t.mood = clamp(t.mood - 5, 0, 100); virtue(t, "lamLai"); } break;
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
function pickLine(state, a) { var b = CONTENT.alumLines[state] || ["—"]; return b[0].replace(/\{ten\}/g, a.ten); }
function pickLineIdx(state, a, idx) { var b = CONTENT.alumLines[state] || ["—"]; return b[idx % b.length].replace(/\{ten\}/g, a.ten); }
function tpl(str, o) { return String(str).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }

/* ============================================================================
   SAVE / LOAD / SANITIZE  (S.v migrator + Number.isFinite discipline)
   ========================================================================== */
function saveGame() {
  try { localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(serialize())); } catch (e) {}
}
function serialize() {
  var o = {}; for (var k in S) { if (k === "_mapDirty" || k === "_lastNod" || k === "_giftFlush") continue; o[k] = S[k]; }
  return o;
}
function loadGame() {
  var raw = null; try { raw = localStorage.getItem(CONFIG.SAVE_KEY); } catch (e) {}
  if (!raw) { freshState(); return false; }
  var data; try { data = JSON.parse(raw); } catch (e) { freshState(); return false; }
  freshState();
  if (data && data.v === 1) data = migrateV1(data);
  mergeInto(S, data);
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
  if (!CONFIG.PRESETS[S.presets.n1]) S.presets.n1 = "canbang";
  ["n1", "n2", "n3", "n4"].forEach(function (k) { if (!CONFIG.PRESETS[S.presets[k]]) S.presets[k] = "canbang"; });
  S.students = (S.students || []).map(function (s) {
    if (!s) return null;
    if (bad(s.kt) || bad(s.tn) || bad(s.st) || bad(s.cm) || bad(s.vet)) return null;
    s.grade = clamp(Math.round(s.grade) || 1, 1, 4);
    s.seed = clamp(Math.round(s.seed) || 1, 1, 5);
    ["kt", "tn", "st", "cm", "vet", "mood"].forEach(function (k) { s[k] = clamp(s[k], 0, 100); });
    if (!s.flags) s.flags = {}; if (!s.flags.vt) s.flags.vt = [];
    return s;
  }).filter(Boolean).slice(0, CONFIG.ROSTER_CAP);
  if (bad(S.endow.bal) || S.endow.bal < 0) S.endow.bal = 0;
  S.endow.milestonesClaimed = clamp(Math.round(S.endow.milestonesClaimed) || 0, 0, 3);
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
    a.grat = clamp(a.grat || 0, 0, 100); a.gifts = Math.max(0, a.gifts || 0);
    if (!a.flags) a.flags = { vt: [] };
    return a;
  });
  S.seed0 = (S.seed0 || 0) >>> 0;
  if (!S.META) S.META = {};
  if (!Array.isArray(S.META.goalsHit)) S.META.goalsHit = [];
  if (!Array.isArray(S.META.majorsUnlocked)) S.META.majorsUnlocked = [];
  // khoaHead: prune heads whose khoa or teacher no longer exists (and any teacher heading 2+ khoas)
  if (!S.khoaHead || typeof S.khoaHead !== "object") S.khoaHead = {};
  var seenT = {};
  for (var hk in S.khoaHead) {
    var tid = S.khoaHead[hk];
    if (!majorByKey(hk) || !teacherById(tid) || seenT[tid]) { delete S.khoaHead[hk]; continue; }
    seenT[tid] = true;
  }
}

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
  save: saveGame, load: loadGame, serialize: serialize,
  config: function () { return CONFIG; }
};

if (typeof window !== "undefined") { window.__test = __test; window.HVS = { S: function () { return S; }, freshState: freshState, loadGame: loadGame, saveGame: saveGame, clockTick: clockTick, dayTick: dayTick, placeRoom: placeRoom, autoPlace: autoPlace, canPlace: canPlace, declareAdmissions: declareAdmissions, finalizeJune: finalizeJune, resolveEvent: resolveEvent, resolveContract: resolveContract, derivedPool: derivedPool, checkMilestones: checkMilestones, studentMajor: studentMajor, khoaHeaded: khoaHeaded, khoaThreshold: khoaThreshold, setKhoaHead: setKhoaHead, teacherById: teacherById }; }
if (typeof module !== "undefined" && module.exports) { module.exports = { freshState: freshState, dayTick: dayTick, get S() { return S; }, __test: __test, setConfig: function (c, t) { CONFIG = c; CONTENT = t; } }; }
