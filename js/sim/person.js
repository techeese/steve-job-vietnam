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
  // iter-214 (ERAS ckpt2): the WORLD sends era-flavored cohorts — kids lean toward the gift their decade rewards (a
  // dot-com era draws more would-be coders, the 1990s more makers). ONE rnd() draw (stream-aligned); the THRESHOLDS
  // shift by the era's fav. Deterministic (era from S.year) → replay-safe. "" (undirected, the everyman) absorbs the slack.
  var f = (typeof curEra === "function" && S) ? curEra().fav : null, t = CONFIG.ERA_TELL_TILT;
  function p(base, tell) { return (f && f[tell] != null) ? clamp(base * (1 + t * (f[tell] - 1)), base * 0.5, base * 1.6) : base; }
  var ps = p(0.18, "spark"), ph = p(0.16, "hype"), psk = p(0.12, "sky");
  if (r < ps) return "spark";           // tinkerer / coder
  if (r < ps + ph) return "hype";       // showy / hustler
  if (r < ps + ph + psk) return "sky";  // maker / dreamer
  return "";
}
// iter-206 (L2 DEMOGRAPHIC) — a kid's family ORIGIN, derived deterministically from the stable student id (like
// annMonthFor) → no save field, no migrator, no reroll on reload. Weighted by CONFIG.ORIGIN_W. NOT from the live rng
// stream (uses hashStr, not rnd) → the cohort's gift roll is byte-identical to before (sweep/gate baselines hold).
function studentOrigin(s) {
  // iter-210 L2: the cohort's origin-mix is the ARCHETYPE's (a rural school contains more poor kids); falls back to
  // CONFIG.ORIGIN_W for old saves / no archetype → tinh_le's mix is exactly ORIGIN_W, so the default stays byte-identical.
  var A = S && CONFIG.ARCHETYPES[S.archetype];
  var w = (A && A.originW) || CONFIG.ORIGIN_W, r = hashStr("o" + s.id) % 100, c = 0;
  for (var i = 0; i < w.length; i++) { c += w[i]; if (r < c) return CONFIG.ORIGINS[i]; }
  return CONFIG.ORIGINS[CONFIG.ORIGINS.length - 1];
}

function growStudents() {
  var n = S.students.length;
  var crowdByGrade = {};
  var counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  var i, s;
  for (i = 0; i < n; i++) counts[S.students[i].grade]++;
  var crowdBase = CONFIG.COHORT_NOMINAL * campusScale(); // iter-166: crowd baseline scales with the campus, so proportionally-bigger cohorts don't incur extra crowding (the realize/waste spread is preserved)
  for (var g = 1; g <= 4; g++) crowdByGrade[g] = CONFIG.CROWD(counts[g], crowdBase);
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
    var flowF = s.mood >= CONFIG.FLOW_MOOD ? CONFIG.FLOW_MULT : 1; // iter-155: a kid in FLOW (high mood) learns a little faster — genuine growth only (NOT cá-mập gCm below)
    var roomF = (S.presets["n" + s.grade] === "duan" && !hasRoom("phongmay")) ? 0.5 : 1;
    // iter-206 (L2 DEMOGRAPHIC): a poor kid's LEGIT growth drags without backing; mentoring (the school's hand) erases
    // the headwind → the school is the equalizer. well-off = a slight head-start. Hits g (legit) only, never gCm (hustle).
    var org = studentOrigin(s);
    var orgGrow = s.mentored ? 1 : (CONFIG.ORIGIN_GROW[org] != null ? CONFIG.ORIGIN_GROW[org] : 1);
    var orgMood = (s.mentored && org === "ngheo") ? 0 : (CONFIG.ORIGIN_MOOD[org] || 0); // mentoring lifts the poor kid's circumstance-mood; well-off keeps its small security bonus
    var g = sm * vm * crowdByGrade[s.grade] * tf.mult * moodF * flowF * roomF * orgGrow / dpm;
    var mm = fitOf(s.tell, "n" + s.grade); // iter-244: MODE × STRUCTURE (the teaching dial). At the 'mid' default STRUCT_FIT=1.0 → == the old CONFIG.MATCH (byte-identical); a non-mid structure re-weights whose gift the school fits
    var ptn = p.tn, pst = p.st;
    if (s.mentored) { mm = Math.max(mm, CONFIG.MENTOR_MM); ptn = Math.max(ptn, CONFIG.PRESETS.duan.tn); pst = Math.max(pst, CONFIG.PRESETS.duan.st); } // Phase 2: scarce attention = personal project-tutoring that overrides the school's policy for THIS kid
    // iter-195 (E8 ckpt2) — faculty grain-lean directs SIGNATURE-stat growth: a kid whose gift the faculty favors
    // flowers; a neglected grain languishes. ZERO-SUM across grains (subtract the mean lean) → aggregate-neutral
    // (economy/spread held) but DIRECTED. No grain teachers → grainF=1 → byte-identical headless baseline.
    var grainF = 1;
    if (tf.ng > 0 && s.tell && tf.aff[s.tell] != null) grainF = 1 + clamp(CONFIG.TEACH_AFF_W * (tf.aff[s.tell] - tf.ng / 3), -CONFIG.TEACH_AFF_CAP, CONFIG.TEACH_AFF_CAP);
    s.kt = ktSat(s.kt + p.kt * g * hbMult(s, "kt"));
    s.tn = clamp(s.tn + ptn * g * mm * scholarshipMult("tn") * hbMult(s, "tn") * (s.tell === "spark" ? grainF : 1), 0, 100);
    s.st = clamp(s.st + pst * g * mm * scholarshipMult("st") * hbMult(s, "st") * (s.tell === "sky" ? grainF : 1), 0, 100);
    // Phase 1.5: in an OPEN/unstructured preset (NOT cram), a severe grain-mismatch leaves a kid ADRIFT —
    // modest talent caps below the realization floor (tn/st/kt), the gifted partly shine, mentoring rescues
    // (it lifted mm above the floor). This is what lets CRAFT waste the structure-needer (§C-2). Cram is
    // excluded: its mismatch is rote/distortion (văn-mẫu / coin shark), already handled by the cascade —
    // capping it there just over-produced arrests.
    if (mm < CONFIG.MISMATCH_MM && S.presets["n" + s.grade] !== "luyende") {
      var ceil = CONFIG.MISMATCH_CEIL(s.seed);
      if (s.tn > ceil) s.tn = ceil; if (s.st > ceil) s.st = ceil; if (s.kt > ceil) s.kt = ceil;
    }
    // iter-200 (E8 ckpt2b — PLAYTEST FLAG, OFF by default): specializing your faculty has a COST. A DISCOVERED real gift
    // (seed≥4, grade≥2) whose grain you hired NO teacher for (faculty is specialized — ng>0 — but aff[tell]=0), and whom
    // you didn't mentor, goes adrift — its signature stats cap below the realize floor → real waste. Eased by seed,
    // erased by mentoring. The strong realize/waste teeth the saturation wall blocked at the RATE layer, done STRUCTURALLY.
    if (CKPT2B_ON && tf.ng > 0 && s.seed >= 4 && s.grade >= 2 && !s.mentored && s.tell && (tf.aff[s.tell] || 0) === 0) {
      var c2 = CONFIG.CKPT2B_CEIL(s.seed);
      if (s.tn > c2) s.tn = c2; if (s.st > c2) s.st = c2; if (s.kt > c2) s.kt = c2;
    }
    var gCm = sm * crowdByGrade[s.grade] * tf.mult * moodF * roomF / dpm; // cá-mập (gaming-the-system hustle) isn't slowed by the cram/vet drag
    s.cm = clamp(s.cm + p.cm * gCm * CONFIG.MATCH_CM(s.tell, S.presets["n" + s.grade]) * (s.tell === "hype" ? grainF : 1), 0, 100);
    var vetGain = p.vet / dpm * hbMult(s, "vet");
    s.vet = clamp(s.vet + vetGain, 0, 100);
    var moodDrain = (mm < CONFIG.MISMATCH_MM) ? CONFIG.MISMATCH_MOOD_DRAIN : 0; // lệch tạng wears them down; mentoring (mm≥MENTOR_MM) already spares them
    var facMood = (tf.ng > 0 && s.tell && tf.aff[s.tell] != null) ? CONFIG.TEACH_AFF_MOOD * (tf.aff[s.tell] - tf.ng / 3) : 0; // iter-195: faculty champions/neglects a grain → felt as mood (a neglected gift wilts more visibly in-play). Zero-sum, no grain teachers → 0 → byte-identical.
    var structMood = (CONFIG.STRUCT_FIT(s.tell, structOf("n" + s.grade)) - 1) * CONFIG.STRUCT_MOOD_W; // iter-244 (Phase 1a): a structure-MISMATCH wears the kid down, a structure-FIT lifts — the non-saturating tooth of the STRUCTURE axis (FLOW/dropout/peer-contagion). Zero at 'mid' (STRUCT_FIT=1.0) → byte-identical.
    var _sjm = studentMajor(s); var majorMood = _sjm ? (CONFIG.MAJOR_FIT(s.tell, _sjm.key) - 1) * CONFIG.MAJOR_MOOD_W : 0; // iter-247 (Phase 2a): a WRONG-MAJOR wears the kid down (a coder at the lathe) — 2nd fit axis, same mood channel. Zero at a native placement (MAJOR_FIT=1.0) / no major → byte-identical until Phase 2b's systemic intake can mismatch.
    s.mood = clamp(s.mood + (p.mood + tf.mood + facMood + structMood + majorMood + orgMood - moodDrain) / dpm, 0, 100); // iter-206: + circumstance-mood (poor headwind / well-off security), erased for the poor by mentoring
    var smj = studentMajor(s); // khoa synergy: a full khoa lifts its members' signature stat
    if (smj && (majorCount[smj.key] || 0) >= khoaThreshold(smj.key)) {
      var headed = khoaHeaded(smj.key); // a trưởng-khoa makes the khoa thrive sooner AND grow faster
      s[smj.stat] = clamp(s[smj.stat] + CONFIG.SYN_GROW + (headed ? CONFIG.HEAD_BONUS : 0), 0, 100);
      if (thriving >= 2 && smj.cross) s[smj.cross] = clamp(s[smj.cross] + CONFIG.SYN_CROSS, 0, 100); // liên khoa: cross-pollinate a 2nd stat
    }
    if (s.mood < CONFIG.DROPOUT_MOOD && rnd() < CONFIG.DROPOUT_P / dpm) {
      s._drop = true; S.META.dropped = (S.META.dropped || 0) + 1; // iter-131: the burnout loss — a kid worn down and lost, now COUNTED and NAMED (not silently filtered)
      if (S.META.favId === s.id) { news("💔 " + s.ten + " — em bạn dõi theo từ đầu — đã bỏ học. Kiệt sức, trường không giữ được."); S.META.favId = null; }
      else news("😔 " + rpick(CONTENT.dropoutLines).replace("{ten}", s.ten));
    }
  }
  if (n) S.students = S.students.filter(function (x) { return !x._drop; });
  // iter-241 — PEERS / CONTAGION ckpt1: the cohort's atmosphere pulls each kid's mood toward the school mean — a
  // thriving class buffers its strugglers, a demoralized one drags its stars down ("chọn bạn mà chơi"; the môi
  // trường that decides whether a gift realizes). Deterministic (NO rnd → replay-safe; runs AFTER the dropout draws
  // so it never perturbs the rng stream), variance-reducing → ~aggregate-mood-neutral (the SOUL is the redistribution,
  // not a free lift). Daily-scaled (÷ dpm) since growStudents runs each dayTick. Skips the young founding cohort.
  if (!PEER_OFF) {
    var pc = S.students, pn = pc.length;
    if (pn >= CONFIG.PEER.MIN_COHORT) {
      var msum = 0; for (var pi = 0; pi < pn; pi++) msum += pc[pi].mood;
      var pmean = msum / pn, pull = CONFIG.PEER.PULL / dpm;
      for (var pj = 0; pj < pn; pj++) { var ps = pc[pj]; ps.mood = clamp(ps.mood + (pmean - ps.mood) * pull, 0, 100); }
    }
  }
}

/* ============================================================================
   THE PERSON BECOMES SOMEONE (iter 127 STRUCTURE carve from engine.js): the
   destiny resolution (cascade → makeAlumnus), the realization reading (E4:
   talent realized/wasted/distorted, RELATIVE to the gift), and the followed
   protégé's in-school arc (favBeat). Pure over the global S/CONFIG/CONTENT +
   engine helpers (clamp/r1/tpl/nid/hashStr/news/…); loaded in one scope
   (index.html <script> after engine.js · gate.js/sweep.js concat-eval). The
   alumni-WORLD FSM (transition/alumYear/gifts) stays in engine.js — it sims the
   alumni inside the SCHOOL's economy; this file decides WHO the person becomes.
   ========================================================================== */

// E4 — realization RELATIVE to the gift's magnitude (see CONFIG.ALUM.FLOURISH). Pure over CONFIG → engine, ui
// AND sweep share one definition. realClass tells the epilogue WHICH grief/cheer line a life earned. Never a
// 🍎 gate (aLua = seed only); this only colours how fully the gift got to flower under the school you ran.
function flourishOf(state) { var F = CONFIG.ALUM.FLOURISH; return F[state] != null ? F[state] : 0; }
function realFrac(state, seed) { return clamp(flourishOf(state) / CONFIG.ALUM.EXPECT(seed), 0, 2); }
function realClass(state, seed) { // "loud" | "bent" | "under" | "" — the gift-vs-fate readings (idle waste / distorted / settled / nothing)
  var IDLE = { THAT_NGHIEP: 1, QUAN_VAN_MAU: 1 }; // gift never grew or ground to rote — the loud WASTE (idle on your hands)
  var BENT = { CA_MAP_COIN: 1, BI_BAT: 1 };       // iter-197: gift grew the WRONG way — the school TURNED them (the owner's DISTORT pole, distinct from waste; invariant #4 done-TO-them)
  if (seed >= 4 && IDLE[state]) return "loud";                  // a prodigy left idle / ground to a clerk
  if (seed >= 4 && BENT[state]) return "bent";                  // a prodigy bent into a coin-shark / fraud — distorted, not merely wasted
  if (seed >= 4 && realFrac(state, seed) < CONFIG.ALUM.UNDER_REAL) return "under"; // a prodigy who merely settled (💼)
  return ""; // NB: no "exceed-the-gift" pole — realization is APPROPRIATE to magnitude (VISION), and the cohort
             // has ~no modest kids to lift anyway (admissions excludes seed≤2 — see ROADMAP underdog epic).
}
// iter-150 — the followed protégé's coda KEY (the realization reading of a life): loud waste / quiet settle /
// realized / a kind-enough life. Shared by the graduation BEAT (engine.js) and the epilogue CAPSTONE (ui.js) so
// the arc's culmination reads the SAME both at the moment and in the keepsake. Strings live in CONTENT.protegeCoda.
function protegeCodaKey(state, seed) { var c = realClass(state, seed); return c === "loud" ? "loud" : c === "bent" ? "bent" : c === "under" ? "under" : flourishOf(state) >= 4 ? "realized" : "kind"; }
// iter-154 — the realization SUFFIX of a life (the gift-vs-fate reading): loud waste / quiet settle, else the
// E-UNDERDOG diamond credit, else the mentor's-hand credit, else "" (an on-target life needs no suffix). ONE
// source of truth shared by the epilogue CAST (ui.js essayDraft) and the GRADUATION RESULTS screen (engine rec →
// ui showJuneResults), so the soul reading — VISIBLE WASTED TALENT — appears at the MOMENT of graduation
// (VISION §114), not only in the final essay. Returns "" for non-prodigies → glimpsed, not metered (invariant #3).
function realCreditSuffix(state, seed, flags, tell, gradYear, origin) {
  var rc = realClass(state, seed);
  var tk = tell || "gen"; // iter-246: the everyman ("") gets its OWN gift-vs-fate read (the able-but-undirected majority — >50% of kids), not the generic line. spark/sky/hype unchanged → byte-identical.
  var gap = (rc && CONTENT.realGapTell[rc] && CONTENT.realGapTell[rc][tk]) || CONTENT.realGap[rc] || ""; // iter-203: name WHICH gift (tell) was wasted, not just the fate; iter-246: + the everyman via tk="gen"; falls back to the generic line for any unmapped tell
  if (gap && flags && flags.diamond) gap = (CONTENT.diamondWaste && CONTENT.diamondWaste[rc]) || gap; // iter-194: the gem admitted past the score, then let slip — name the gamble you LOST (symmetry of diamondCredit; invariant #2/#4)
  else if (!gap && flags && flags.diamond && flourishOf(state) >= 4) gap = CONTENT.diamondCredit;     // overlooked at entry, realized anyway — the gamble you WON
  else if (!gap && flags && flags.mentored && flourishOf(state) >= 2) gap = CONTENT.mentorCredit;     // a realized life under your hand
  // iter-205 (ERAS ckpt2): name the DECADE's hand. A wasted gift born into a HOSTILE era earns a "sinh nhầm thời" clause
  // (appended to the grief); a gift that flourished in its GOLDEN era earns the symmetric "gặp đúng thời" cheer. The era
  // already moved the destiny (FSM, iter-204); this makes "right kid, wrong era" READABLE at the payoff. Reading-only.
  if (tell && gradYear != null) {
    var fav = eraFavAt(tell, gradYear);
    if (gap && fav <= CONFIG.ERA_WRONG) gap += (CONTENT.realGapEra.wrong[tell] || CONTENT.realGapEra.wrong._); // wrong-era WASTE — appended to the existing grief
    else if (!gap && fav >= CONFIG.ERA_RIGHT && flourishOf(state) >= 4) gap = CONTENT.realGapEra.right;          // right-era FLOURISH — the symmetric cheer (only when no other credit claimed the line)
  }
  // iter-206 (L2 DEMOGRAPHIC): name the CIRCUMSTANCE for the poor — a structural waste ("chẳng ai chống lưng", done TO
  // them, #4) or the hope of having made it despite ("nhà nghèo mà vẫn nên người"). Layered onto the gift+era reading.
  var og = CONTENT.realGapOrigin && CONTENT.realGapOrigin[origin];
  if (og) { if (rc) gap += og.waste; else if (!gap && flourishOf(state) >= 4) gap = og.real; } // rc set = a WASTE (append the structural cause); else an unclaimed realized line = the "made it despite" hope
  return gap;
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
  var flags = { tiemNang: tiem, coinPath: row.key === "CA_MAP_COIN", garage: false, mentored: !!s.mentored, diamond: !!s.diamond, protege: (S.META.favId != null && s.id === S.META.favId), prize: s._prize || null, vt: (s.flags.vt || []).slice() }; // E4.1 mentor's hand · E-UNDERDOG ngọc thô · iter-133 protégé · E7p prize honor
  var ef = CONFIG.ALUM.ENTRY_FLAGS[row.key]; if (ef) flags[ef] = true;
  if (s.flags.hb) flags.hb = s.flags.hb;
  var id = nid();
  var grat = clamp(0.35 * s.mood + 0.35 * (100 - s.vet) + 8 * flags.vt.length + (s.flags.hb ? 10 : 0), 0, 100);
  var a = {
    id: id, ten: s.ten, gradYear: S.year, outcome: row.key, state: entry, history: [entry],
    yearsInState: 0, annMonth: annMonthFor(id),
    fs: { kt: Math.round(s.kt), tn: Math.round(s.tn), st: Math.round(s.st), cm: Math.round(s.cm), vet: Math.round(s.vet), seed: s.seed, tell: s.tell || "", origin: studentOrigin(s), real: Math.round(realFrac(entry, s.seed) * 100) }, // E4: carry the graduation realization gap + tell (the SCHOOL’s shaping of direction); iter-206: + origin (family circumstance) for the demographic payoff line
    grat: r1(grat), gifts: 0, flags: flags, line: ""
  };
  S.alumni.push(a);
  return a;
}
function annMonthFor(id) { var months = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12]; return months[hashStr("a" + id) % 11]; }

// iter-125 — surface the FOLLOWED protégé's becoming, as a CAUSED moment at most ~once a season. The sim already
// produces the stat/mood arc; this just lets the player FEEL it WHILE playing (THESIS mark 5) for the kid they
// chose — attachment + watch-them-become. Pure observation (no balance change); deterministic line pick (no rnd
// draw → replay-safe; gate's alumni replay follows no kid so its determinism is untouched).
function favSnapOf(id, s) { return { id: id, tn: s.tn, st: s.st, kt: s.kt, cm: s.cm, vet: s.vet, mood: s.mood, mentored: !!s.mentored }; }
function favBeat() {
  var id = S.META.favId; if (id == null) return;
  var s = null, st = S.students, i; for (i = 0; i < st.length; i++) if (st[i].id === id) { s = st[i]; break; }
  if (!s) return;
  var snap = S.META.favSnap;
  if (!snap || snap.id !== id) { S.META.favSnap = favSnapOf(id, s); S.META.favSeen = {}; S.META.favLog = []; return; } // baseline on first sighting / new protégé — no moment yet (clear the journal too)
  if (S.totalDays - (S.META.favMomentDay != null ? S.META.favMomentDay : -9999) < CONFIG.FAV_MOMENT_GAP) return; // throttle
  var mile = CONFIG.FAV_MILE, crossed = function (a, b) { for (var k = 0; k < mile.length; k++) if (a < mile[k] && b >= mile[k]) return true; return false; };
  var mm = fitOf(s.tell, "n" + s.grade); // iter-244: MODE × STRUCTURE (byte-identical at the mid default)
  var seen = S.META.favSeen || (S.META.favSeen = {}); // per-type fire COUNT → consecutive same-type lines cycle (a deepening arc, never a repeat)
  var type = null;
  if (s.mentored && !snap.mentored) type = "mentored";                                           // the turning point you caused
  else if (crossed(snap.tn, s.tn)) type = "craftUp";                                             // a craft breakthrough
  else if (crossed(snap.st, s.st)) type = "stUp";                                                // a creative breakthrough
  else if (crossed(snap.cm, s.cm)) type = "cmUp";                                                // hustle rising — the coin-shark forming (a distortion warning)
  else if (s.mood < CONFIG.FAV_MOOD_LOW && snap.mood >= CONFIG.FAV_MOOD_LOW) type = "moodDown";  // a slump — a warning you can act on
  else if (s.mood >= CONFIG.FAV_MOOD_HI && snap.mood < CONFIG.FAV_MOOD_HI) type = "moodUp";      // blooming
  else if (!seen.adrift && mm < CONFIG.MISMATCH_MM && s.grade >= 2 && s.tn < 40 && s.st < 40) type = "adrift"; // E4-link: the gift not finding its form (one-shot)
  else if (crossed(snap.vet, s.vet)) type = "vetUp";                                             // the rote grind — văn-mẫu in the making
  else if (crossed(snap.kt, s.kt)) type = "ktUp";                                                // knowledge milestone (lowest priority)
  if (!type) return;
  var arr = CONTENT.favMoments[type], c = seen[type] || 0, mline = arr[c % arr.length]; news("⭐ " + s.ten + " — " + mline);
  (S.META.favLog = S.META.favLog || []).unshift("Năm " + s.grade + ": " + mline); if (S.META.favLog.length > 3) S.META.favLog.pop(); // iter-135: a persistent follow-journal (the moments outlive the fleeting ticker — the protégé's story, on their card)
  seen[type] = c + 1; S.META.favSnap = favSnapOf(id, s); S.META.favMomentDay = S.totalDays;
}

// iter-179 — THE WHOLE COHORT BECOMES SOMEONE WHILE YOU WATCH (the owner's deepest steer: "watch a student
// transform… while playing" — mark 5 + mark 2, extended past the single protégé). A throttled GLIMPSE names one
// non-protégé kid mid-transformation: a real gift (seed≥4, discoverable at grade≥2) BLOOMING under a fitting school,
// or WILTING in a mismatch — alternating poles by elapsed beats so neither dominates (§C-2 symmetry). Read-only +
// rnd-FREE (never draws from the seeded stream) + narration-only (news() touches no tracked metric) → the headless
// bot/sweep stay byte-IDENTICAL. Watching the school IS watching them become themselves (NOT micromanage — glimpse).
function cohortBeat() {
  if (S.totalDays - (S._lastCohortBeat || 0) < CONFIG.COHORT_BEAT_GAP) return; // ~once a season, rarer than the protégé
  var st = S.students, n = st.length; if (n < 6) return;
  var era = Math.floor(S.totalDays / CONFIG.COHORT_BEAT_GAP);
  var pole = era % 3; // iter-198: rotate the THREE poles of the trichotomy — 0 BLOOM (realize) · 1 WILT (waste) · 2 BENT (distort), all surfaced WHILE you watch
  var best = null, bestScore = -1, i, s, mm, score;
  for (i = 0; i < n; i++) {
    s = st[i];
    if (s.id === S.META.favId || s.grade < 2 || s.seed < 4) continue; // the protégé has favBeat; the gift must be real + discoverable
    mm = fitOf(s.tell, "n" + s.grade); // iter-244: MODE × STRUCTURE
    if (pole === 1) { // WILT — a real gift cooling in a mismatch — low mood, the "đang nguội dần" made visible mid-school
      if (mm < CONFIG.MISMATCH_MM && s.mood < CONFIG.FAV_MOOD_LOW) { score = (CONFIG.MISMATCH_MM - mm) * 100 + (CONFIG.FAV_MOOD_LOW - s.mood) + s.seed * 4; if (score > bestScore) { bestScore = score; best = s; } }
    } else if (pole === 2) { // BENT — a builder/maker gift (spark/sky) whose cá-mập hustle is overtaking the craft = the shark forming, while you can still act
      if ((s.tell === "spark" || s.tell === "sky") && s.cm >= CONFIG.COHORT_BENT_CM && s.cm > Math.max(s.tn, s.st)) { score = s.cm * 2 + s.seed * 4 - Math.max(s.tn, s.st); if (score > bestScore) { bestScore = score; best = s; } }
    } else { // BLOOM — a gift blooming under a fitting school — strong match, in flow, signature stat rising
      if (mm >= 1.3 && s.mood >= CONFIG.FLOW_MOOD && (s.tn >= 60 || s.st >= 60)) { score = Math.max(s.tn, s.st) + s.mood + s.seed * 5; if (score > bestScore) { bestScore = score; best = s; } }
    }
  }
  if (!best) return;
  var byTell = pole === 1 ? CONTENT.cohortWilt : pole === 2 ? CONTENT.cohortBent : CONTENT.cohortBloom;
  var variants = byTell[best.tell] || byTell._;        // iter-193: the line names THIS kid's specific gift (tell), not a generic talent
  var line = variants[era % variants.length];          // deterministic line pick (no rnd) — cycles over time
  // iter-219: if the glimpsed kid is POOR + unbacked, name the class as a compounding force — felt IN-PLAY, while a mentor
  // slot can still change it (the school-as-equalizer). Deterministic (origin from id, no rnd) → bot/sweep byte-identical.
  if (!best.mentored && studentOrigin(best) === "ngheo" && CONTENT.cohortPoor) line += (CONTENT.cohortPoor[pole === 1 ? "wilt" : pole === 2 ? "bent" : "bloom"] || "");
  // iter-242 PEERS/CONTAGION ckpt2 — name the MÔI TRƯỜNG when the cohort atmosphere is the salient force on THIS kid:
  // a bloomer in a WARM class is reinforced, a cooling kid in a COLD class is dragged. Live read of the cohort mean
  // (deterministic, no rnd → byte-identical). Only when peers actually CUT WITH the beat (warm↔bloom / cold↔wilt).
  if (CONTENT.cohortPeer) {
    var pmSum = 0; for (var pk = 0; pk < n; pk++) pmSum += st[pk].mood; var pMean = pmSum / n;
    if (pole === 0 && pMean >= CONFIG.PEER.WARM) line += CONTENT.cohortPeer.bloomWarm;
    else if (pole === 1 && pMean <= CONFIG.PEER.COLD) line += CONTENT.cohortPeer.wiltCold;
  }
  news((pole === 1 ? "🍂 " : pole === 2 ? "🪙 " : "🌱 ") + best.ten + " — " + line);
  S._lastCohortBeat = S.totalDays;
}

// iter-256 (scout #3) — the FULL-LEDGER beat: the tragic allocation made PROACTIVE. When every mentor slot is spent AND a
// strong gift is wilting unrescued, name the kid your maxed attention is costing you. Only fires once the player has FILLED
// the ledger → headless harnesses (which don't mentor) never trigger it → byte-identical. Deterministic (no rnd), news-only.
function fullLedgerBeat() {
  if (S.totalDays - (S._lastFullBeat || 0) < CONFIG.FULL_BEAT_GAP) return;
  if (typeof mentorCount !== "function" || mentorCount() < mentorSlots()) return; // only when the ledger is FULL — no free hand
  var st = S.students, best = null, bestScore = -1;
  for (var i = 0; i < st.length; i++) {
    var s = st[i];
    if (s.mentored || s.id === S.META.favId || s.grade < 2 || s.seed < 4) continue; // a real, discoverable gift you did NOT take on
    var mm = fitOf(s.tell, "n" + s.grade);
    if (mm < CONFIG.MISMATCH_MM && s.mood < CONFIG.FAV_MOOD_LOW) { var score = (CONFIG.MISMATCH_MM - mm) * 100 + (CONFIG.FAV_MOOD_LOW - s.mood) + s.seed * 4; if (score > bestScore) { bestScore = score; best = s; } }
  }
  if (!best) return;
  var pool = (CONTENT.fullLedger && CONTENT.fullLedger[best.tell]) || (CONTENT.fullLedger && CONTENT.fullLedger._) || [];
  if (!pool.length) return;
  var idx = Math.floor(S.totalDays / CONFIG.FULL_BEAT_GAP) % pool.length; // deterministic line pick (no rnd)
  news("🖐️ " + best.ten + " — " + pool[idx]);
  S._lastFullBeat = S.totalDays;
}
