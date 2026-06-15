/* ============================================================================
   Học viện Steve — js/sim/admissions.js
   The INTAKE subsystem, carved from engine.js (iter 163 STRUCTURE). Deterministic applicant
   pool off poolSeed (incl. the E9 reputation→applicant tilt + the E-UNDERDOG diamonds/đặc cách),
   modal cutoff/quota, the resolve, BXH rank + scholarships. Globals; loaded AFTER engine.js &
   person.js (it calls genStudent + engine helpers at runtime). Headless harnesses load it after
   person.js (gate/sweep concat; bot via index.html script tag).
   ========================================================================== */
function buildAdmitPool() {
  S.admissions.poolSeed = (Math.floor(rnd() * 4294967296)) >>> 0;
}
function derivedPool() {
  var n = CONFIG.ADMIT.POOL(S.tiengTam, S.tuition);
  var mu = CONFIG.ADMIT.MU(S.uyTin, S.tiengTam, S.year, S.tuition), sigma = CONFIG.ADMIT.SIGMA;
  var pool = [];
  for (var i = 0; i < n; i++) {
    var pr = mulberry32((S.admissions.poolSeed ^ Math.imul(i + 1, 0x9E3779B9)) >>> 0);
    var score = clamp(r2(gauss(pr) * sigma + mu), 3, 30);
    var seedW = 1 + Math.round((score - 12) / 4.5); seedW = clamp(seedW, 1, 5);
    var sparkP = 0.3 + CONFIG.ADMIT.REP_TILT(S.thucChat); // E9: a substantive school draws more makers, a hype one more clout (bounded ±5%; "" stays 50%)
    var tell = pr() < sparkP ? "spark" : (pr() < 0.5 ? "hype" : "");
    // E-UNDERDOG: a "ngọc thô" — a low scorer the exam underrates but who carries a real gift. The seed override
    // draws AFTER score/tell and ONLY for sub-threshold scorers (a high scorer short-circuits → no extra draw),
    // and each applicant has its own pr stream → high-cutoff admissions stay byte-identical; only an opened door
    // catches them. The gift is still HIDDEN (E5) — you find it by teaching, not from the entrance number.
    var diamond = false;
    if (score < CONFIG.ADMIT.DIAMOND_SCOREMAX && pr() < CONFIG.ADMIT.DIAMOND_P) { seedW = pr() < 0.5 ? 4 : 5; diamond = true; }
    pool.push({ score: score, seed: seedW, tell: tell, diamond: diamond });
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
    cut: clamp(r025(CONFIG.ADMIT.MU(S.uyTin, S.tiengTam, S.year, S.tuition) - 1), CONFIG.ADMIT.CUT_MIN, CONFIG.ADMIT.CUT_MAX),
    quota: Math.min(Math.round(CONFIG.ADMIT.QUOTA_MAX * campusScale()), Math.max(CONFIG.ADMIT.QUOTA_MIN, Math.min(Math.round(CONFIG.COHORT_NOMINAL * campusScale()), rosterCap() - S.students.length))), // iter-166: classrooms scale the intake (bigger cohorts), gated by the scaled rosterCap
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
  var take = qualified.slice(0, Math.min(quota, rosterCap() - S.students.length));
  var makerNames = []; // E9: makers (spark/sky) drawn this intake — to put a NAMED face on the cohesion note (no gift shown — E5)
  for (i = 0; i < take.length; i++) {
    var ap = take[i];
    var s = genStudent(1, { seed: ap.seed, tell: ap.tell, diamond: !!ap.diamond, kt: rint(15, 30), tn: rint(5, 20), st: rint(15, 35), cm: rint(5, 20), mood: rint(65, 80), vet: rint(0, 10) });
    // Mai Sương — the founder's first believer joins the very first non-empty intake.
    if (S._maiPending) { s.ten = "Mai Sương"; s.seed = 5; s.kt = 22; s.tn = 16; s.st = 35; s.cm = 12; s.mood = 72; s.vet = 4; s.tell = "sky"; S._maiPending = false; }
    if (s.tell === "spark" || s.tell === "sky") makerNames.push(s.ten);
    S.students.push(s);
  }
  // E-UNDERDOG: a substantive school looks PAST the score — a few "đặc cách" offers below the bar, where the
  // ngọc thô hide. A gamble (the gift is hidden, E5): most are ordinary low-scorers, ~1 in 5 a real talent the
  // exam underrated. A hype school (low Thực Chất) extends none and never meets them.
  var dax = CONFIG.ADMIT.DAX(S.thucChat), daxFill = 0;
  if (dax > 0) {
    var below = []; for (i = 0; i < pool.length; i++) if (pool[i].score < cutoff) below.push(pool[i]);
    for (var dq = 0; dq < dax && below.length && S.students.length < rosterCap(); dq++) {
      var dp = below.splice(Math.floor(rnd() * below.length), 1)[0];
      S.students.push(genStudent(1, { seed: dp.seed, tell: dp.tell, diamond: !!dp.diamond, kt: rint(15, 30), tn: rint(5, 20), st: rint(15, 35), cm: rint(5, 20), mood: rint(65, 80), vet: rint(0, 10) }));
      daxFill++;
    }
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
  news("Công bố điểm chuẩn " + cutoff.toFixed(2) + " — " + take.length + "/" + quota + " nhập học" + (daxFill ? " (+" + daxFill + " đặc cách)" : "") + ". Hạng " + rank + "/4.");
  // E9 (iter 153) — COHESION AT OUTPUT made FELT: once the school's character has formed (year ≥ 3), name who its
  // reputation drew this year. Substance (cao Thực Chất) pulls makers; clout (thấp TC) pulls the showy. The tilt
  // (derivedPool, REP_TILT) makes this TRUE; this line makes it SEEN — the school you built shaping who comes.
  if (take.length && S.year >= 3) {
    if (S.thucChat >= 60) news(makerNames.length ? tpl(CONTENT.ticker.cohesionMakers, { ten: makerNames[0] }) : CONTENT.ticker.cohesionMakersPlain);
    else if (S.tiengTam - S.thucChat >= CONFIG.ESSAY.HYPE_GAP) news(CONTENT.ticker.cohesionClout); // E9 ckpt2 (iter-157): the clout note now fires on the HYPE-GAP (famous beyond substance) — same definition as the epilogue's "hype" branch — so it catches the famous-but-hollow school, not only the neglected one (completes "attracts its kind" both ways)
  }
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
// iter-163: expose the intake entries on HVS — engine.js built window.HVS BEFORE this file loaded (so it could
// not reference these functions, which are defined HERE), so we add them now. Node harnesses (gate/sweep) have no
// window and call the functions directly in the concatenated scope → this block is browser-only.
if (typeof window !== "undefined" && window.HVS) { window.HVS.declareAdmissions = declareAdmissions; window.HVS.derivedPool = derivedPool; }
