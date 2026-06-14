/* ============================================================================
   Học viện Steve — js/sim/person.js
   THE PERSON-SIM module (iter 114 STRUCTURE carve from engine.js): a person is
   BORN (genStudent/genName/rollTell) and GROWS (growStudents — talent × education
   → realize/waste/distort). This is where the soul lives; deepen it HERE (E11's
   activity→growth link, the craft-symmetry [EVOLUTION] fix, etc. land in this file).
   Layer law: pure functions over the global S/CONFIG/CONTENT + engine helpers
   (clamp/rnd/ktSat/teacherFactor/studentMajor/…), loaded in one scope (index.html
   <script> · gate.js/sweep.js concat-eval) — no DOM, no stored balance numbers.
   ========================================================================== */

function genStudent(grade, opts) {
  opts = opts || {};
  var seed = opts.seed != null ? opts.seed : rint(1, 5);
  var s = {
    id: nid(), ten: opts.ten || genName(), grade: grade, seed: seed,
    kt: 20, tn: 15, st: 18, cm: 15, vet: 5, mood: 70,
    tell: opts.tell || rollTell(), mentored: false, flags: { vt: [] }
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
    var mm = CONFIG.MATCH(s.tell, S.presets["n" + s.grade]); // grain↔preset craft multiplier (Mentor's Ledger Phase 1): the gift decides whose life the school realizes
    var ptn = p.tn, pst = p.st;
    if (s.mentored) { mm = Math.max(mm, CONFIG.MENTOR_MM); ptn = Math.max(ptn, CONFIG.PRESETS.duan.tn); pst = Math.max(pst, CONFIG.PRESETS.duan.st); } // Phase 2: scarce attention = personal project-tutoring that overrides the school's policy for THIS kid
    s.kt = ktSat(s.kt + p.kt * g * hbMult(s, "kt"));
    s.tn = clamp(s.tn + ptn * g * mm * scholarshipMult("tn") * hbMult(s, "tn"), 0, 100);
    s.st = clamp(s.st + pst * g * mm * scholarshipMult("st") * hbMult(s, "st"), 0, 100);
    // Phase 1.5: in an OPEN/unstructured preset (NOT cram), a severe grain-mismatch leaves a kid ADRIFT —
    // modest talent caps below the realization floor (tn/st/kt), the gifted partly shine, mentoring rescues
    // (it lifted mm above the floor). This is what lets CRAFT waste the structure-needer (§C-2). Cram is
    // excluded: its mismatch is rote/distortion (văn-mẫu / coin shark), already handled by the cascade —
    // capping it there just over-produced arrests.
    if (mm < CONFIG.MISMATCH_MM && S.presets["n" + s.grade] !== "luyende") {
      var ceil = CONFIG.MISMATCH_CEIL(s.seed);
      if (s.tn > ceil) s.tn = ceil; if (s.st > ceil) s.st = ceil; if (s.kt > ceil) s.kt = ceil;
    }
    var gCm = sm * crowdByGrade[s.grade] * tf.mult * moodF * roomF / dpm; // cá-mập (gaming-the-system hustle) isn't slowed by the cram/vet drag
    s.cm = clamp(s.cm + p.cm * gCm * CONFIG.MATCH_CM(s.tell, S.presets["n" + s.grade]), 0, 100);
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
