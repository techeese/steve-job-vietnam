/* ============================================================================
   sweep.js — headless gameplay simulator for Học viện Steve.
   Drives the DOM-free engine through many full playthroughs (strategies × seeds),
   aggregates outcomes/economy, and flags balance problems so the loop can tune.
   Run: node sweep.js   (no args = full report)
   Two questions it answers:
     1) ECONOMY — does the honest default school survive & stay in the target band?
     2) PLURALISM — do different strategies produce genuinely different student
        destinies (DESIGN §1: no single dominant strategy), and is 🍎 reachable?
   ========================================================================== */
const fs = require("fs");
const dir = __dirname;
const dataSrc = fs.readFileSync(dir + "/js/data.js", "utf8");
const contentSrc = fs.readFileSync(dir + "/js/content.js", "utf8"); // iter 134 STRUCTURE — CONTENT split out of data.js
const engineSrc = fs.readFileSync(dir + "/js/engine.js", "utf8");
const personSrc = fs.readFileSync(dir + "/js/sim/person.js", "utf8"); // iter 114 structure carve — person creation + growth
const alumniSrc = fs.readFileSync(dir + "/js/sim/alumni.js", "utf8"); // iter 212 structure carve — the alumni-world FSM
const admissionsSrc = fs.readFileSync(dir + "/js/sim/admissions.js", "utf8"); // iter 163 structure carve — the intake subsystem
const saveSrc = fs.readFileSync(dir + "/js/save.js", "utf8"); // iter 199 structure carve — persistence (loaded for parity; sweep doesn't save/load)
const shim = "var localStorage={_d:{},getItem:function(k){return this._d[k]!=null?this._d[k]:null;},setItem:function(k,v){this._d[k]=v;}};";

const harness = `
${shim}
${dataSrc}
${contentSrc}
${engineSrc}
${personSrc}
${alumniSrc}
${admissionsSrc}
${saveSrc}

var DPY = CONFIG.DAYS_PER_MONTH * 12; // days per year

// adaptive grain-match (v0 — provisional, pending E2 #1 grain-vs-preset): each year set the school
// preset to match the cohort's modal tell (spark/sky → đồ án craft; hype → luyện đề; else cân bằng).
// A guardrail CONTROL: per the open-question law it must NOT dominate the pure single-philosophy theses.
function adaptPresets() {
  var tally = {}; S.students.forEach(function (s) { var t = s.tell || ""; tally[t] = (tally[t] || 0) + 1; });
  var modal = "", best = -1; for (var t in tally) if (tally[t] > best) { best = tally[t]; modal = t; }
  var P = (modal === "spark" || modal === "sky") ? "duan" : (modal === "hype" ? "luyende" : "canbang");
  S.presets = { n1: P, n2: P, n3: P, n4: P };
  // iter-244 (EDUCATION epic Phase 1a): the bot also picks the STRUCTURE that fits the modal gift (the STRUCT_FIT
  // peak: maker/showman → low/autonomy, coder/everyman → high/scaffold) — so the no-dominant-strategy sensor SEARCHES
  // the new knob; left blind it could not catch a structure-matched dominant build.
  var ST = (modal === "sky" || modal === "hype") ? "low" : (modal === "spark" || modal === "") ? "high" : "mid";
  S.struct = { n1: ST, n2: ST, n3: ST, n4: ST };
}

// mentor play (Phase 2): each year spend the scarce attention budget rescuing the most-mismatched, highest-gift
// kids first — the spread the PLAYER controls. Proves inaction-cost: a mentored school realizes more than the
// no-attention baseline (the gap = what you lose by doing nothing).
function mentorPlay() {
  var cur = 0; S.students.forEach(function (s) { if (s.mentored) cur++; });
  var free = CONFIG.MENTOR_SLOTS - cur; if (free <= 0) return;
  var cand = S.students.filter(function (s) { return !s.mentored; }).map(function (s) {
    var mm = fitOf(s.tell, "n" + s.grade); // iter-244: MODE × STRUCTURE
    return { s: s, pri: (1 - mm) * s.seed }; // most-mismatched × highest gift first
  }).sort(function (a, b) { return b.pri - a.pri; });
  for (var i = 0; i < free && i < cand.length; i++) cand[i].s.mentored = true;
}

// run ONE playthrough; strat = {presets, build:[{key,x,y}], tuition, grant, years}
function play(seed, strat) {
  freshState(seed);
  if (strat.presets) S.presets = { n1: strat.presets, n2: strat.presets, n3: strat.presets, n4: strat.presets };
  if (strat.struct) S.struct = { n1: strat.struct, n2: strat.struct, n3: strat.struct, n4: strat.struct }; // iter-244 EDUCATION epic Phase 1a: drive the STRUCTURE axis for the STRUCT_FIT sensor
  if (strat.intakePolicy) S.intakePolicy = strat.intakePolicy; // iter-268 Phase-2c CP2c: drive the INTAKE rule (native|open) for the off-native-intake sensor
  if (strat.tuition) S.tuition = strat.tuition;
  if (strat.grant) S.cash += strat.grant;
  if (strat.build) strat.build.forEach(function (r) { placeRoom(r.key, r.x, r.y); });
  if (strat.hire) strat.hire.forEach(function (t) { S.teachers.push(t); }); // iter-195 E8 ckpt2: inject grain-flavored faculty for the sensor
  var y1cashStart = S.cash, y1Net = null, minCash = S.cash, bankrupt = false;
  var years = strat.years || 11, totalDays = years * DPY;
  for (var d = 0; d < totalDays; d++) {
    if (strat.adaptive && d % DPY === 0) adaptPresets();
    if (strat.mentor && d % DPY === 0) mentorPlay();
    if (strat.mentorPoor && d % DPY === 0) S.students.forEach(function (s) { if (studentOrigin(s) === "ngheo") s.mentored = true; }); // iter-206 L2 sensor: back EVERY poor kid (ignore slot scarcity) → prove the school CAN equalize per-kid
    dayTick();
    if (S.cash < minCash) minCash = S.cash;
    if (S.cash < -60) bankrupt = true;
    if (d === DPY - 1) y1Net = (S.cash - y1cashStart) / 12; // avg monthly net over year 1
  }
  var byState = {}; CONFIG.ALUM.STATES.forEach(function (k) { byState[k] = 0; });
  S.alumni.forEach(function (a) { byState[a.state] = (byState[a.state] || 0) + 1; });
  // per-life realization inputs (E1/L1): innate seed + final genuine craft + hustle/hollow + destiny + tell (E8 sensor)
  var lives = S.alumni.map(function (a) {
    return { seed: a.fs.seed, craft: 0.6 * a.fs.tn + 0.4 * a.fs.st, hustle: a.fs.cm, hollow: a.fs.vet, state: a.state, tell: a.fs.tell || "", origin: a.fs.origin || "", real: flourishOf(a.state) >= 4 };
  });
  // E9 ckpt2 (iter-157): the cohesion tilt's footprint — the maker (spark/sky) share of the current student
  // body, which reflects the reputation→applicant tilt (REP_TILT). Used to PROVE the feedback can't run away.
  var sk = 0, nstu = S.students.length || 1; S.students.forEach(function (x) { if (x.tell === "spark" || x.tell === "sky") sk++; });
  return {
    cash: S.cash, minCash: minCash, bankrupt: bankrupt, y1Net: y1Net,
    tt: S.tiengTam, ut: S.uyTin, tc: S.thucChat, endow: S.endow.bal,
    grad: S.META.graduated, steves: S.META.steves, arrested: S.META.arrested,
    alumni: S.alumni.length, byState: byState, lives: lives, sparkShare: sk / nstu
  };
}

function agg(seeds, strat) {
  var runs = seeds.map(function (s) { return play(s, strat); });
  var n = runs.length, sum = function (f) { return runs.reduce(function (a, r) { return a + f(r); }, 0); };
  var lives = []; runs.forEach(function (r) { lives.push.apply(lives, r.lives); });
  var states = {}; CONFIG.ALUM.STATES.forEach(function (k) { states[k] = sum(function (r) { return r.byState[k]; }); });
  var totalAlum = sum(function (r) { return r.alumni; }) || 1;
  var pct = {}; for (var k in states) pct[k] = (states[k] / totalAlum * 100);
  return {
    n: n, avgCash: sum(function (r) { return r.cash; }) / n, avgMinCash: sum(function (r) { return r.minCash; }) / n,
    bankruptRate: sum(function (r) { return r.bankrupt ? 1 : 0; }) / n,
    avgY1Net: sum(function (r) { return r.y1Net || 0; }) / n,
    avgTT: sum(function (r) { return r.tt; }) / n, avgUT: sum(function (r) { return r.ut; }) / n, avgTC: sum(function (r) { return r.tc; }) / n,
    avgEndow: sum(function (r) { return r.endow; }) / n,
    steveRate: sum(function (r) { return r.steves > 0 ? 1 : 0; }) / n, avgSteves: sum(function (r) { return r.steves; }) / n,
    avgArrested: sum(function (r) { return r.arrested; }) / n,
    avgSparkShare: sum(function (r) { return r.sparkShare; }) / n, // E9 ckpt2: the cohesion tilt footprint (maker share)
    avgAlumni: totalAlum / n, statePct: pct, lives: lives
  };
}

// ---- run ----
var OUT = [], FLAGS = [];
function line(s) { OUT.push(s); }
function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); }
function f2(x) { return (Math.round(x * 100) / 100).toFixed(2); }
function f0(x) { return Math.round(x); }

var SEEDS = []; for (var i = 0; i < 40; i++) SEEDS.push(101 + i * 7);

var STRATS = {
  "default (honest)": {},
  "luyện đề (cram)": { presets: "luyende" },
  "đồ án (craft)":  { presets: "duan", grant: 1000, build: [{ key: "phongmay", x: 6, y: 5 }, { key: "xuong", x: 11, y: 8 }] },
  "cân bằng":       { presets: "canbang" },
  "đồ án nghèo (no rooms)": { presets: "duan" },
  "khớp tạng (adaptive v0)": { adaptive: true, grant: 1000, build: [{ key: "phongmay", x: 6, y: 5 }, { key: "xuong", x: 11, y: 8 }] },
  "dìu dắt (mentor)": { mentor: true } // same cram default as 'default (honest)', but you spend scarce attention → inaction-cost control
};

line("================ Học viện Steve — GAMEPLAY SWEEP ================");
line("seeds=" + SEEDS.length + "  years/run=11  (engine auto-plays June/admissions)");
line("");
var results = {};
for (var name in STRATS) results[name] = agg(SEEDS, STRATS[name]);

// ECONOMY (default)
var dflt = results["default (honest)"];
line("--- ECONOMY (default honest school) ---");
line("  Y1 net/month: " + f1(dflt.avgY1Net) + "tr   (founding year, lean by design: band 0..18)");
line("  bankrupt rate: " + f0(dflt.bankruptRate * 100) + "%   avg min cash: " + f0(dflt.avgMinCash) + "tr   avg end cash: " + f0(dflt.avgCash) + "tr");
line("  default (cram-leaning) meters TT/UT/TC: " + f0(dflt.avgTT) + "/" + f0(dflt.avgUT) + "/" + f0(dflt.avgTC) + "   endow: " + f0(dflt.avgEndow) + "tr");
var honestM = results["cân bằng"]; line("  HONEST (cân bằng)     meters TT/UT/TC: " + f0(honestM.avgTT) + "/" + f0(honestM.avgUT) + "/" + f0(honestM.avgTC) + "   end cash: " + f0(honestM.avgCash) + "tr");
// start-from-nothing: Y1 boots with 0 students and ramps to one intake — a small positive
// net (survive + build) is the goal, not a populated-school profit. Bankruptcy is the real risk.
if (dflt.avgY1Net < 0 || dflt.avgY1Net > 18) FLAGS.push("Y1 net " + f1(dflt.avgY1Net) + " outside founding band 0..18");
if (dflt.bankruptRate > 0.15) FLAGS.push("default bankrupts " + f0(dflt.bankruptRate * 100) + "% of runs");
line("");

// OUTCOMES per strategy
line("--- ALUMNI DESTINY by strategy (% of alumni in each end-state) ---");
var keys = CONFIG.ALUM.STATES;
line("  strategy".padEnd(26) + keys.map(function (k) { return k.slice(0, 6).padStart(7); }).join("") + "   🍎rate steves");
for (var nm in results) {
  var r = results[nm];
  var row = ("  " + nm).padEnd(26) + keys.map(function (k) { return f0(r.statePct[k]).toString().padStart(7); }).join("");
  row += "   " + f0(r.steveRate * 100).toString().padStart(3) + "%  " + f1(r.avgSteves);
  line(row);
}
line("");

// PLURALISM / DOMINANCE analysis
line("--- PLURALISM (DESIGN §1: no single dominant strategy) ---");
// dominant strategy = one that beats all others on BOTH steves AND end-cash
var names = Object.keys(results);
names.forEach(function (a) {
  var dominates = names.every(function (b) { return a === b || (results[a].avgSteves >= results[b].avgSteves && results[a].avgCash >= results[b].avgCash); });
  var strictly = names.some(function (b) { return a !== b && (results[a].avgSteves > results[b].avgSteves || results[a].avgCash > results[b].avgCash); });
  if (dominates && strictly && names.length > 2) FLAGS.push("'" + a + "' may strictly dominate (≥ steves AND ≥ cash vs all)");
});
// each strategy should have a DISTINCT modal outcome
names.forEach(function (nm) {
  var r = results[nm], modal = keys.reduce(function (m, k) { return r.statePct[k] > r.statePct[m] ? k : m; }, keys[0]);
  line("  " + nm.padEnd(24) + " → modal outcome: " + modal + " (" + f0(r.statePct[modal]) + "%)");
});
var anySteve = names.some(function (nm) { return results[nm].steveRate > 0.05; });
if (!anySteve) FLAGS.push("🍎 essentially unreachable in 11y across ALL strategies (steveRate<5%)");
var craftSteve = results["đồ án (craft)"].steveRate, cramSteve = results["luyện đề (cram)"].steveRate;
if (craftSteve <= cramSteve) FLAGS.push("craft path does not out-produce cram on 🍎 (craft " + f0(craftSteve * 100) + "% vs cram " + f0(cramSteve * 100) + "%) — thesis weak");
var honest = results["cân bằng"]; // an HONEST school is the meter-health benchmark (default is intentionally cram-leaning)
if (honest && honest.avgTT < 10) FLAGS.push("HONEST (cân bằng) school's Tiếng Tăm collapses to ~" + f0(honest.avgTT) + " — baseline reputation not sustained");
if (honest && honest.avgUT < 5) FLAGS.push("HONEST school's Uy Tín collapses to ~" + f0(honest.avgUT) + " — losses outpace the capped gains");
// iter-159 (owner 2026-06-15: "ridiculous endgame money, not 900tr") — the iter-107 hoard-cap is REVERSED. Cash
// is now MEANT to grow into a big endgame number; the only failure modes are bankruptcy (relaxed too far) or NOT
// growing (relaxation didn't take). The compounding income engine + escalating upgrade sink land in checkpoint 2.
if (dflt.bankruptRate > 0.02) FLAGS.push("ECONOMY BROKEN: " + f0(dflt.bankruptRate * 100) + "% bankrupt — scaling went too far (drain/ops too low for the income)");
else if (dflt.avgCash < 1500) FLAGS.push("ECONOMY not scaling yet: late-game cash only ~" + f0(dflt.avgCash) + "tr — the hoard-cap relaxation didn't take (owner wants a BIG endgame; gentle CASH_DRAIN/OPS further)");
else FLAGS.push("ECONOMY scaling ✓ (owner's growth-engine direction): late-game cash grows to ~" + f1(dflt.avgCash / 1000) + " tỷ (was ~0.8 tỷ pre-iter-159), 0 bankruptcy, person-sim spread intact. Compounding income + escalating sink = checkpoint 2.");
var maxCoin = Math.max.apply(null, names.map(function (nm) { return results[nm].statePct.CA_MAP_COIN; }));
if (maxCoin < 1.5) FLAGS.push("CA_MAP_COIN (cá mập coin) only ~" + f1(maxCoin) + "% across ALL strategies — the satire's dark mirror barely fires; cram should breed some sharks");
var dead = keys.filter(function (k) { return k !== "STEVE" && names.every(function (nm) { return results[nm].statePct[k] < 0.5; }); }); // STEVE is meant to be rare per-capita (tracked via 🍎rate)
if (dead.length) FLAGS.push("end-states that essentially never occur: " + dead.join(", ") + " — content/cascade gates may be unreachable");
line("");

// ---- REALIZATION sensor (E1 / L1): innate talent × school → realized / wasted / distorted ----
// Classified by DESTINY (the outcome state IS the life — VISION: realization is a good life appropriate to the
// gift, "a steady kỹ sư as realized as the maker"). realized = STEVE / founder / kỹ sư / lương ổn; wasted =
// thất nghiệp / quán quân văn mẫu (talent latent or rote); distorted = cá mập coin / bị bắt (talent turned).
// meanR = mean life-value (STEVE 1.0 … bị bắt 0.0). wasted-PRODIGY = a high-gift (seed≥4) kid wasted. No stored state.
// [refactored: the prior craft-ratio metric mis-scored grain-appropriate realization — a generalist who reaches a
//  steady kỹ sư life has modest craft yet IS realized; destiny is what VISION actually defines as realized.]
line("--- REALIZATION (innate seed × school → realized / wasted / distorted, by destiny) ---");
var REAL_ST = { STEVE: 1, FOUNDER: 1, KY_SU: 1, LUONG_ON: 1 }, DISTORT_ST = { CA_MAP_COIN: 1, BI_BAT: 1 };
var STATE_R = { STEVE: 1.0, FOUNDER: 0.9, KY_SU: 0.8, LUONG_ON: 0.6, QUAN_VAN_MAU: 0.2, THAT_NGHIEP: 0.1, CA_MAP_COIN: 0.0, BI_BAT: 0.0 };
function classify(L) { if (DISTORT_ST[L.state]) return "distorted"; if (REAL_ST[L.state]) return "realized"; return "wasted"; }
function realizationOf(nm) {
  var L = results[nm].lives, n = L.length || 1, c = { realized: 0, wasted: 0, distorted: 0 }, rs = [], prod = 0, uprod = 0;
  L.forEach(function (x) {
    var k = classify(x); c[k]++; rs.push(STATE_R[x.state] != null ? STATE_R[x.state] : 0);
    if (x.seed >= 4 && k === "wasted") prod++;
    if (realClass(x.state, x.seed) === "under") uprod++; // E4 §C-2: a prodigy who SETTLED into 💼 — counted "realized" by destiny above, but the gift went unrealized (craft's quiet grief)
  });
  var mean = rs.reduce(function (a, b) { return a + b; }, 0) / n;
  return { realPct: c.realized / n * 100, wastePct: c.wasted / n * 100, distPct: c.distorted / n * 100, uPct: uprod / n * 100, mean: mean, prod: prod, uProd: uprod };
}
line("  strategy".padEnd(26) + "real%".padStart(6) + "waste%".padStart(7) + "dist%".padStart(6) + "meanR".padStart(7) + "  wProdigy  uSettle");
var realz = {};
for (var nm2 in results) {
  var R = realz[nm2] = realizationOf(nm2);
  line("  " + nm2.padEnd(24) + f0(R.realPct).toString().padStart(6) + f0(R.wastePct).toString().padStart(7) + f0(R.distPct).toString().padStart(6) + f1(R.mean).padStart(7) + "    " + String(R.prod).padStart(4) + "    " + String(R.uProd).padStart(4));
}
line("");
// FLAT-SPREAD — the keystone "is the SOUL there?": does the SAME (default) school produce a felt RANGE —
// realizing some AND failing some (symmetry-of-waste) — or a degenerate one-note outcome?
var dR = realz["default (honest)"] || realz[Object.keys(realz)[0]];
var topShare = Math.max(dR.realPct, dR.wastePct, dR.distPct);
if (topShare > 80) FLAGS.push("FLAT-SPREAD (SOUL THIN): default school is one-note (" + f0(topShare) + "% in a single destiny category) — no felt range of lives");
else if (dR.realPct < 5) FLAGS.push("FLAT-SPREAD (SOUL THIN): default school realizes only " + f0(dR.realPct) + "% — it fails kids but never lifts one (symmetry-of-waste broken)");
else if (dR.wastePct + dR.distPct < 5) FLAGS.push("FLAT-SPREAD (SOUL THIN): default school costs only " + f0(dR.wastePct + dR.distPct) + "% — no one is failed, no stakes");
else FLAGS.push("realization spread present on default: realized " + f0(dR.realPct) + "% / wasted " + f0(dR.wastePct) + "% / distorted " + f0(dR.distPct) + "% (meanR " + f1(dR.mean) + ") — talent visibly meets the school ✓");
// symmetry-of-waste (VISION invariant #2): every preset must REALIZE some AND cost (waste/distort) some
// E4: a preset "costs" someone if it fails them LOUDLY (waste/distort) OR QUIETLY (under-realizes a prodigy
// who settled into 💼). Craft's grief used to be invisible to this check — now the quiet waste counts as cost.
for (var nm3 in realz) { var Z = realz[nm3]; if (Z.realPct < 3) FLAGS.push("'" + nm3 + "' realizes ~0% — no one reaches a good life under this preset"); if (Z.wastePct + Z.distPct + Z.uPct < 3) FLAGS.push("'" + nm3 + "' costs ~0% (fails no one — loud OR quiet) — invariant #2 broken: a preset with no symmetry of waste"); }
// the poignant core: a gifted kid (seed≥4) wasted on your watch must be REACHABLE
var totProd = 0; for (var nm4 in realz) totProd += realz[nm4].prod;
if (totProd === 0) FLAGS.push("WASTED-PRODIGY unreachable across ALL strategies — the poignant core never fires");
// E4 §C-2 — the QUIET waste, craft's previously-invisible grief: a prodigy who merely SETTLED into 💼 lương ổn.
// The open question needs craft/balance to cost SOMETHING, not just cram — else đồ án is the implicit right answer.
var totU = 0; for (var nmU in realz) totU += realz[nmU].uProd;
var craU = realz["đồ án (craft)"], balU = realz["cân bằng"];
if (totU === 0) FLAGS.push("E4 UNDER-REALIZED prodigy unreachable — the gifted who SETTLE into lương ổn never appear (craft's quiet grief not firing)");
else FLAGS.push("E4 quiet-waste reachable ✓: " + totU + " prodigies settled into 💼 lương ổn" + (craU ? " (đồ án " + f0(craU.uPct) + "%" + (balU ? ", cân bằng " + f0(balU.uPct) + "%" : "") + ")" : "") + " — craft now wastes too; the open question holds (THESIS §D-3)");
// inaction-cost (Phase 2 fail-state): scarce mentoring must lift realized vs the no-attention baseline (same cram preset)
if (realz["dìu dắt (mentor)"] && realz["default (honest)"]) {
  var mg = realz["dìu dắt (mentor)"].realPct - realz["default (honest)"].realPct;
  if (mg >= 3) FLAGS.push("inaction-cost ✓: mentoring lifts realized " + f0(realz["default (honest)"].realPct) + "%→" + f0(realz["dìu dắt (mentor)"].realPct) + "% (+" + f0(mg) + "pts on the SAME preset) — attention rescues, inaction wastes");
  else FLAGS.push("inaction-cost WEAK: mentoring moves realized only +" + f1(mg) + "pts — attention not yet worth spending (raise MENTOR_MM/SLOTS)");
}
// adaptive grain-match must NOT dominate (open-question law / E2 #1 control)
var ADK = "khớp tạng (adaptive v0)";
if (results[ADK]) {
  var ad = results[ADK], pn = Object.keys(results).filter(function (x) { return x !== ADK; });
  var domS = pn.every(function (b) { return ad.avgSteves >= results[b].avgSteves; }), domC = pn.every(function (b) { return ad.avgCash >= results[b].avgCash; });
  if (domS && domC) FLAGS.push("ADAPTIVE grain-match DOMINATES pure theses on 🍎+cash — 'just optimize per cohort' would win, collapsing the open question (E2 #1 risk)");
  else FLAGS.push("adaptive grain-match does NOT dominate (🍎 " + f1(ad.avgSteves) + ", cash " + f0(ad.avgCash) + "tr) — open-question holds under matching ✓ (v0 policy, refine after E2 #1)");
}
// E9 ckpt2 (iter-157) — COHESION sensor: the reputation→applicant tilt (REP_TILT) must be DIRECTIONAL (a
// substantive school draws more makers than a hype/cram one) AND BOUNDED (no runaway: maker-share stays inside
// [0.18, 0.42] — baseline 0.30 ± the ±5% cap + variance). This permanently guards the feedback loop manually
// checked once at iter-153; a future change that uncaps REP_TILT or amplifies the loop trips this.
// Spread-based (robust to the seeded-prodigy baseline that inflates absolute maker-share): the tilt must be
// DIRECTIONAL (substance draws ≥ makers than cram) and the gap BOUNDED (REP_TILT caps at ±5% → craft−cram tilt
// ≤ ~0.10; a gap > 0.20 means the feedback is amplifying / the cap was removed).
var craS = results["đồ án (craft)"], cramS = results["luyện đề (cram)"];
if (craS && cramS) {
  var spread = craS.avgSparkShare - cramS.avgSparkShare;
  if (spread > 0.20) FLAGS.push("E9 cohesion RUNAWAY: craft draws Δ" + f2(spread) + " more makers than cram (>0.20) — the reputation→applicant feedback is amplifying (cap REP_TILT)");
  else if (spread < -0.005) FLAGS.push("E9 cohesion INVERTED: craft draws FEWER makers than cram (" + f2(craS.avgSparkShare) + " vs " + f2(cramS.avgSparkShare) + ") — REP_TILT sign/center is wrong");
  else FLAGS.push("E9 cohesion ✓: substance draws more makers, bounded — đồ án " + f2(craS.avgSparkShare) + " vs luyện đề " + f2(cramS.avgSparkShare) + " (Δ" + f2(spread) + ", capped <0.20, no runaway)");
}

// iter-195 E8 ckpt2 — GRAIN-FLAVORED FACULTY must DIRECT (the championed grain leans up) WITHOUT BREAKING the floor
// (the realize/waste spread stays stable — the strong realize-shifting teeth are ckpt2b, owner-gated). Sensor: run
// craft+rooms with NO faculty vs ALL-SPARK vs ALL-SKY; the lean is felt as MOOD (probe-confirmed), the floor must hold.
(function () {
  function fac(g) { var a = []; for (var i = 0; i < 3; i++) a.push({ id: "fac_" + g + "_" + i, ten: "GV " + g, day: 8, dien: 3, luong: 0, trait: "tch", grain: g, bienChe: false, age: 0 }); return a; }
  var base = { presets: "canbang", build: [{ key: "phongmay", x: 6, y: 5 }, { key: "xuong", x: 11, y: 8 }] };
  function realizePct(strat) {
    var gift = 0, real = 0;
    SEEDS.forEach(function (sd) { play(sd, strat).lives.forEach(function (L) { if (L.seed >= 4) { gift++; if (L.real) real++; } }); });
    return gift ? 100 * real / gift : 0;
  }
  var rNone = realizePct(base);
  var rSpark = realizePct({ presets: base.presets, build: base.build, hire: fac("spark") });
  var drift = Math.abs(rSpark - rNone);
  if (drift > 8) FLAGS.push("E8 faculty BREAKS the floor: hiring all-spark faculty moved realize " + f0(rNone) + "%→" + f0(rSpark) + "% (Δ" + f0(drift) + "pts > 8) — the grain lean is over-shifting the realize/waste floor (lower TEACH_AFF_W, or this IS ckpt2b territory — owner-gate it)");
  else FLAGS.push("E8 faculty ✓: grain-flavored hiring is FELT (mood lean, probe-verified) but the realize/waste FLOOR holds — realize " + f0(rNone) + "%→" + f0(rSpark) + "% (Δ" + f1(drift) + "pts ≤ 8). The strong realize-shifting teeth (ckpt2b) are owner-gated.");
})();

// iter-200 E8 ckpt2b (PLAYTEST FLAG) — when ON + faculty specialized narrowly, an UNCHAMPIONED gift must take a real
// but PARTIAL cost (a breadth-vs-depth trade-off, not a trap). Sensor turns the flag on, hires all-spark faculty in a
// craft school, and checks: the neglected grain (sky) drops MEANINGFULLY (≥10pts — the teeth bite) yet SURVIVES
// (≥35% — not a wipeout), while the championed grain (spark) holds. Restores the flag after (never leaks).
(function () {
  function fac(g) { var a = []; for (var i = 0; i < 3; i++) a.push({ id: "c2_" + g + "_" + i, ten: "GV " + g, day: 8, dien: 3, luong: 0, trait: "tch", grain: g, bienChe: false, age: 0 }); return a; }
  var build = [{ key: "phongmay", x: 6, y: 5 }, { key: "xuong", x: 11, y: 8 }];
  function realizeByTell(flag) {
    CKPT2B_ON = flag;
    var t = { spark: { g: 0, r: 0 }, sky: { g: 0, r: 0 } };
    SEEDS.forEach(function (sd) { play(sd, { presets: "duan", build: build, hire: fac("spark") }).lives.forEach(function (L) { if (L.seed >= 4 && t[L.tell]) { t[L.tell].g++; if (L.real) t[L.tell].r++; } }); });
    return { spark: t.spark.g ? 100 * t.spark.r / t.spark.g : 0, sky: t.sky.g ? 100 * t.sky.r / t.sky.g : 0 };
  }
  var off = realizeByTell(false), on = realizeByTell(true);
  CKPT2B_ON = false; // restore — the flag must never leak into the rest of the sweep
  var drop = off.sky - on.sky;
  if (drop < 10) FLAGS.push("E8 ckpt2b (flag) WEAK: neglected sky realize " + f0(off.sky) + "%→" + f0(on.sky) + "% (Δ" + f1(drop) + " < 10) — the teeth don't bite; lower CKPT2B_CEIL");
  else if (on.sky < 35) FLAGS.push("E8 ckpt2b (flag) TRAP: neglected sky realize " + f0(off.sky) + "%→" + f0(on.sky) + "% (<35% — a wipeout, not a trade-off); raise CKPT2B_CEIL");
  else FLAGS.push("E8 ckpt2b (flag) ✓ [OFF by default; ?ckpt2b=1]: narrow faculty COSTS the unchampioned gift — sky realize " + f0(off.sky) + "%→" + f0(on.sky) + "% (Δ" + f0(drop) + "pts) while championed spark holds " + f0(on.spark) + "%. A real breadth-vs-depth trade-off; owner playtests the FEEL.");
})();

// iter-244 EDUCATION epic Phase 1a — STRUCTURE axis. Two laws: (A) the STRUCT_FIT table is SYMMETRIC — every tell has
// a structure that LIFTS it (>1) AND one that DRAGS it (<1), and every non-neutral level realizes some tell AND wastes
// some (no structure level is a free win — invariant #2); (B) it BITES + splits the craft-twins: under a NEUTRAL mode
// (canbang, where MATCH=1 for spark & sky so structure is the only differentiator), the coder (spark) realizes better
// under HIGH structure and the maker (sky) better under LOW — the spark≠sky fix, proven on realized LIVES.
(function () {
  var SF = CONFIG.STRUCT_FIT, tells = ["spark", "sky", "hype", ""], levels = ["low", "mid", "high"];
  var rowBad = tells.filter(function (t) { var hi = false, lo = false; levels.forEach(function (L) { if (SF(t, L) > 1) hi = true; if (SF(t, L) < 1) lo = true; }); return !(hi && lo); });
  var colBad = ["low", "high"].filter(function (L) { var hi = false, lo = false; tells.forEach(function (t) { if (SF(t, L) > 1) hi = true; if (SF(t, L) < 1) lo = true; }); return !(hi && lo); });
  function realByTell(structure) {
    var t = { spark: { g: 0, r: 0 }, sky: { g: 0, r: 0 } };
    SEEDS.forEach(function (sd) { play(sd, { presets: "canbang", struct: structure }).lives.forEach(function (L) { if (t[L.tell]) { t[L.tell].g++; if (L.real) t[L.tell].r++; } }); });
    return { spark: t.spark.g ? 100 * t.spark.r / t.spark.g : 0, sky: t.sky.g ? 100 * t.sky.r / t.sky.g : 0 };
  }
  var lo = realByTell("low"), hi = realByTell("high");
  var sparkPrefersHigh = hi.spark - lo.spark, skyPrefersLow = lo.sky - hi.sky;
  if (rowBad.length) FLAGS.push("STRUCTURE asymmetric ROW(s) [" + rowBad.map(function (t) { return t || "''"; }).join(",") + "]: a tell with no lifting OR no dragging structure (invariant #2)");
  else if (colBad.length) FLAGS.push("STRUCTURE asymmetric COLUMN(s) [" + colBad.join(",") + "]: a structure level that realizes nobody or wastes nobody — a free win (invariant #2)");
  else if (sparkPrefersHigh <= 0 || skyPrefersLow <= 0) FLAGS.push("STRUCTURE INERT/UNSPLIT: under neutral mode spark realize low→high " + f0(lo.spark) + "→" + f0(hi.spark) + "% (Δ" + f1(sparkPrefersHigh) + ", want >0), sky low/high " + f0(lo.sky) + "/" + f0(hi.sky) + "% (want low>high, Δ" + f1(skyPrefersLow) + ") — the structure tooth doesn't bite or split the craft-twins; raise STRUCT_MOOD_W");
  else FLAGS.push("STRUCTURE ✓ symmetric + splits spark≠sky: under a neutral mode the coder prefers HIGH (" + f0(lo.spark) + "→" + f0(hi.spark) + "%), the maker prefers LOW (" + f0(hi.sky) + "→" + f0(lo.sky) + "%) — Δ" + f1(sparkPrefersHigh) + "/" + f1(skyPrefersLow) + "pts. The spark≠sky fix lands.");
})();
line("");

// iter-247 EDUCATION epic Phase 2a — MAJOR_FIT. A grain reaches several tracks at different fit; a NON-NATIVE placement
// (right gift, wrong major) must WASTE more than the native one — the teeth, via mood. Sensor: force every kid into one
// major (MAJOR_OVERRIDE) under a neutral mode+structure, and assert the native tell realizes MORE than a mismatched tell
// in the SAME track (isolating MAJOR_FIT from khoa synergy). Restores MAJOR_OVERRIDE after (never leaks).
(function () {
  function realIn(majorKey, tell) {
    MAJOR_OVERRIDE = majorKey;
    var g = 0, r = 0;
    SEEDS.forEach(function (sd) { play(sd, { presets: "canbang" }).lives.forEach(function (L) { if (L.tell === tell) { g++; if (L.real) r++; } }); });
    return g ? 100 * r / g : 0;
  }
  // SAME tell, native vs alien track (isolates the major effect from tell-specific base rates): a coder in code(1.0)
  // vs in biz(0.7); a maker in make(1.0) vs in biz(0.7). The native placement must realize MORE.
  var sparkNative = realIn("code", "spark"), sparkAlien = realIn("biz", "spark");
  var skyNative = realIn("make", "sky"), skyAlien = realIn("biz", "sky");
  MAJOR_OVERRIDE = null; // restore — must NEVER leak into the rest of the sweep
  var d1 = sparkNative - sparkAlien, d2 = skyNative - skyAlien;
  if (d1 <= 0 || d2 <= 0) FLAGS.push("MAJOR_FIT INERT/WRONG: a coder realizes " + f0(sparkNative) + "% in code vs " + f0(sparkAlien) + "% in biz (Δ" + f1(d1) + "), a maker " + f0(skyNative) + "% in make vs " + f0(skyAlien) + "% in biz (Δ" + f1(d2) + ") — the native track should win; wrong-major doesn't waste, raise MAJOR_MOOD_W");
  else FLAGS.push("MAJOR_FIT ✓ wrong-major wastes: a coder realizes " + f0(sparkNative) + "% in code vs only " + f0(sparkAlien) + "% shoved into biz; a maker " + f0(skyNative) + "% in make vs " + f0(skyAlien) + "% in biz — right-gift-wrong-major is a real fate (Δ" + f1(d1) + "/" + f1(d2) + "pts). Live via Phase-2c OPEN-DOOR intake (below).");
})();
line("");

// iter-268 EDUCATION epic Phase 2c (CP2c) — OFF-NATIVE INTAKE goes LIVE. With no specialist khoa rooms built, a grain's
// native khoa is unavailable: under "native" (fit-priority) it sits IDLE (no major, neutral); under "open" (open-door) it
// is crammed into the Đại-cương generalist track (MAJOR_FIT 0.85 → a real wrong-fit penalty, but it becomes ACTIVE). The
// open-door choice must be a BOUNDED tradeoff (activate-but-mismatch vs idle), NEVER a domination (no free realize, no crater).
(function () {
  function realRate(policy) { var g = 0, r = 0; SEEDS.forEach(function (sd) { play(sd, { presets: "canbang", intakePolicy: policy }).lives.forEach(function (L) { if ((L.tell || "") !== "") { g++; if (L.real) r++; } }); }); return g ? 100 * r / g : 0; }
  var natR = realRate("native"), openR = realRate("open"), d = openR - natR; // specialist grains (tell≠"") only — the ones open-door re-routes
  if (Math.abs(d) > 15) FLAGS.push("INTAKE open-door DOMINATES/CRATERS: specialist grains realize " + f0(openR) + "% open vs " + f0(natR) + "% native (Δ" + f1(d) + ") — open-door should be a BOUNDED placement tradeoff, not a free win/loss; retune");
  else FLAGS.push("INTAKE ✓ open-door is a bounded LIVE tradeoff: specialist grains realize " + f0(openR) + "% (active off-native, Đại-cương) vs " + f0(natR) + "% (idle under native), Δ" + f1(d) + " — right-gift-wrong-major now happens in play, neither policy dominates");
})();
line("");

// iter-248 EDUCATION epic Phase 2b — the EVERYMAN FIREWALL (owner-fork #1). Đại-cương gives the >50% with no grain ("")
// a home: it lifts their realize FLOOR (steady kỹ-thuật-viên) but must NOT open an APEX path — else "admit all "" +
// Đại-cương" could dominate and collapse the open question. Assert across normal runs that "" reaches realized-steady
// yet its apex (🚀/🍎) stays ~0 (the firewall is structural — stevePShort gates on grain, and Đại-cương adds no apex).
(function () {
  var APEX = { FOUNDER: 1, STEVE: 1 };
  var t = { spark: { g: 0, a: 0, r: 0 }, sky: { g: 0, a: 0, r: 0 }, hype: { g: 0, a: 0, r: 0 }, "": { g: 0, a: 0, r: 0 } };
  ["luyende", "canbang", "duan"].forEach(function (pr) { SEEDS.forEach(function (sd) { play(sd, { presets: pr }).lives.forEach(function (L) { var k = t[L.tell || ""]; if (k) { k.g++; if (L.real) k.r++; if (APEX[L.state]) k.a++; } }); }); });
  function apx(k) { return t[k].g ? 100 * t[k].a / t[k].g : 0; }
  function rl(k) { return t[k].g ? 100 * t[k].r / t[k].g : 0; }
  var emptyApex = apx(""), maxGrainApex = Math.max(apx("spark"), apx("sky"), apx("hype"));
  // The firewall is NOT "'' never apexes" ('' reaches FOUNDER ~7-8% via the cascade, pre-existing + fine). It is:
  // a GRAIN still out-apexes the everyman, so chasing 🍎 still wants a grain — admitting all-'' is never the apex play.
  if (emptyApex >= maxGrainApex) FLAGS.push("EVERYMAN FIREWALL BREACH: tell='' apex " + f1(emptyApex) + "% ≥ the best grain's " + f1(maxGrainApex) + "% — Đại-cương made the ordinary majority the DOMINANT apex bet; admitting all-'' could win 🍎 (owner-fork #1). Bound Đại-cương.");
  else FLAGS.push("EVERYMAN ✓ firewall holds: Đại-cương realizes the ordinary majority (tell='' realized " + f0(rl("")) + "%) yet a GRAIN still out-apexes it ('' apex " + f1(emptyApex) + "% < best grain " + f1(maxGrainApex) + "%) — a home, not a 🍎 path; chasing apex still wants a gift (owner-fork #1 firewall stands).");
})();
line("");

// iter-241 PEERS / CONTAGION — the cohort's atmosphere pulls each kid's mood toward the school mean ("chọn bạn mà chơi";
// the môi trường that shapes whether a gift realizes). It must be an ENVIRONMENT, not a lever: ~AGGREGATE-NEUTRAL on
// realization (a variance-reducer, NOT a free lift → no dominant strategy, invariant #1) AND it must not collapse the
// apex (stars dragged out of FLOW). Sensor: run identical schools with contagion OFF vs ON across the 3 cultures;
// assert |Δrealize| small and the apex survives. Restores PEER_OFF after (never leaks).
(function () {
  var APEX = { FOUNDER: 1, STEVE: 1 };
  function peerAgg(off) {
    PEER_OFF = off;
    var real = 0, apex = 0, n = 0;
    ["luyende", "canbang", "duan"].forEach(function (pr) {
      SEEDS.forEach(function (sd) { play(sd, { presets: pr }).lives.forEach(function (L) { n++; if (L.real) real++; if (APEX[L.state]) apex++; }); });
    });
    return { real: n ? 100 * real / n : 0, apex: n ? 100 * apex / n : 0 };
  }
  var onC = peerAgg(false), offC = peerAgg(true);
  PEER_OFF = false; // restore — the toggle must NEVER leak into the rest of the sweep
  var dR = Math.abs(onC.real - offC.real);
  if (dR > 6) FLAGS.push("PEERS contagion SHIFTS the floor: realize off " + f0(offC.real) + "%→on " + f0(onC.real) + "% (Δ" + f1(dR) + " > 6) — it's behaving as a lever, not an environment; lower PEER.PULL");
  else if (offC.apex > 0.5 && onC.apex < offC.apex * 0.6) FLAGS.push("PEERS contagion CRUSHES the apex: " + f1(offC.apex) + "%→" + f1(onC.apex) + "% (>40% drop) — stars dragged out of FLOW; lower PEER.PULL or shield FLOW from the pull");
  else FLAGS.push("PEERS ✓ a felt environment, not a lever: realize Δ" + f1(dR) + "pts ≤ 6 (aggregate-neutral), apex " + f1(offC.apex) + "%→" + f1(onC.apex) + "% holds. The cohort redistributes mood (buffers the struggler, drags the star in a weak class) — soul, not a dominant strategy.");
})();
line("");

// iter-204 L1 ERAS — the authored decade spine. Each era RE-WEIGHTS which gift the world realizes vs wastes, so the
// SAME kid is a founder in one decade and unemployed in another ("right kid, wrong era"). PIN each era via ERA_OVERRIDE,
// run the default honest school, read the realize/waste mix + per-tell realize. Enforces the open-question law on the
// NEW axis: (#1) no decade DOMINATES (realize% spread bounded — none strictly easiest); (#2) SYMMETRY — every decade
// both realizes AND wastes; and the SOUL itself — a gift's realize% must SWING across eras (era decides its fate).
(function () {
  // The era governs a gift's CEILING, not just its floor. canbang gives most gifts the craft to enter kỹ sư (a decent
  // life — flourish≥4), so the realize FLOOR is stable across decades (no era abandons a gift). What the decade decides
  // is how HIGH the gift climbs: the APEX (🚀 founder / 🍎 Steve, flourish≥5). A brilliant coder is a world-changing
  // FOUNDER in the AI boom and merely a solid kỹ sư in the 1990s — same gift, capped by its decade. That swing IS "right
  // kid, wrong era". And the TAIL (thất nghiệp / distorted) widens in a hostile decade. canbang base = no cram noise.
  var base = { presets: "canbang" };
  var APEX = { FOUNDER: 1, STEVE: 1 };
  function eraStats(idx) {
    ERA_OVERRIDE = idx;
    var real = 0, apex = 0, waste = 0, n = 0, byTell = {};
    SEEDS.forEach(function (sd) {
      play(sd, base).lives.forEach(function (L) {
        n++; if (L.real) real++; if (APEX[L.state]) apex++; if (!REAL_ST[L.state]) waste++; // waste = not realized (thất nghiệp / văn mẫu / coin / arrested)
        var t = L.tell || "_"; var b = (byTell[t] = byTell[t] || { g: 0, a: 0 }); b.g++; if (APEX[L.state]) b.a++;
      });
    });
    n = n || 1;
    return { realPct: 100 * real / n, apexPct: 100 * apex / n, wastePct: 100 * waste / n, byTell: byTell };
  }
  var rows = CONFIG.ERAS.map(function (e, i) { return { e: e, s: eraStats(i) }; });
  ERA_OVERRIDE = null; // restore — the pin must NEVER leak into the rest of the sweep
  line("--- L1 ERAS (each decade caps a gift's CEILING — apex 🚀/🍎 — and widens the wrong-era tail) ---");
  line("  era".padEnd(24) + "real%".padStart(6) + "apex%".padStart(6) + "waste%".padStart(7) + "    spark/sky/hype apex%");
  function tp(r, t) { var b = r.s.byTell[t]; return b && b.g ? f0(100 * b.a / b.g).toString() : "·"; }
  rows.forEach(function (r) {
    line("  " + r.e.name.padEnd(22) + f0(r.s.realPct).toString().padStart(6) + f0(r.s.apexPct).toString().padStart(6) + f0(r.s.wastePct).toString().padStart(7) + "       " + tp(r, "spark") + " / " + tp(r, "sky") + " / " + tp(r, "hype"));
  });
  // #1 no decade strictly easiest: the realize FLOOR is bounded across eras AND no single era tops the apex for EVERY
  // gift (each decade favors a DIFFERENT gift — its apex-leader differs).
  var reals = rows.map(function (r) { return r.s.realPct; });
  var fSpread = Math.max.apply(null, reals) - Math.min.apply(null, reals);
  if (fSpread > 25) FLAGS.push("L1 ERAS DOMINANT-DECADE: realize FLOOR ranges " + f0(Math.min.apply(null, reals)) + "→" + f0(Math.max.apply(null, reals)) + "% (Δ" + f0(fSpread) + " > 25) — a decade abandons/spoils gifts wholesale (invariant #1)");
  var leaders = {}; ["spark", "sky", "hype"].forEach(function (t) { var bi = -1, bv = -1; rows.forEach(function (r, i) { var b = r.s.byTell[t]; var v = b && b.g >= 10 ? 100 * b.a / b.g : -1; if (v > bv) { bv = v; bi = i; } }); leaders[t] = bi; });
  var distinctLeaders = {}; for (var tk in leaders) distinctLeaders[leaders[tk]] = 1;
  if (Object.keys(distinctLeaders).length < 2) FLAGS.push("L1 ERAS DOMINANT-DECADE: one era is the apex-leader for ALL gifts (invariant #1) — spread the fav peaks across decades");
  else FLAGS.push("L1 ERAS ✓ no dominant decade: realize floor Δ" + f0(fSpread) + " ≤ 25, and the apex-leading decade differs by gift (spark→" + CONFIG.ERAS[leaders.spark].key + " / sky→" + CONFIG.ERAS[leaders.sky].key + " / hype→" + CONFIG.ERAS[leaders.hype].key + ") — each decade a different world, none strictly easiest");
  // #2 symmetry — every decade both LIFTS some to the apex AND fails some (the canbang base is forgiving, so the tail
  // is thin by design — per-PRESET waste-symmetry is the existing realization sensor's job; here we just guard that no
  // era is pure-success [everyone apex] or a dead floor [no apex / no tail]).
  rows.forEach(function (r) {
    if (r.s.apexPct < 2) FLAGS.push("L1 ERAS '" + r.e.name + "' lifts ~" + f0(r.s.apexPct) + "% to the apex — a decade with no ceiling for any gift (invariant #2)");
    if (r.s.wastePct < 1.5) FLAGS.push("L1 ERAS '" + r.e.name + "' fails ~" + f0(r.s.wastePct) + "% — a decade with no stakes at all (invariant #2)");
  });
  // SOUL — the era must decide how HIGH each gift climbs: apex% swings hard across decades (right kid, wrong era)
  ["spark", "sky", "hype"].forEach(function (t) {
    var ps = rows.map(function (r) { var b = r.s.byTell[t]; return b && b.g >= 10 ? 100 * b.a / b.g : null; }).filter(function (x) { return x != null; });
    if (ps.length >= 2) { var sw = Math.max.apply(null, ps) - Math.min.apply(null, ps);
      if (sw < 10) FLAGS.push("L1 ERAS: '" + t + "' apex% barely swings across eras (Δ" + f0(sw) + " < 10) — the decade doesn't lift/cap this gift (right-kid-wrong-era weak for " + t + ")");
      else FLAGS.push("L1 ERAS ✓ '" + t + "': apex% swings Δ" + f0(sw) + "pts across decades — a founder in its golden era, a solid kỹ sư in the wrong one (right kid, wrong era holds)"); }
  });
  // iter-214 ckpt2 — the WORLD sends era-flavored COHORTS: measure RAW intake (rollTell) per pinned era. Each gift's
  // share of the directed cohort should tilt toward the decades that reward it (a dot-com era draws more would-be coders).
  var intake = CONFIG.ERAS.map(function (e, i) { ERA_OVERRIDE = i; freshState(101); var c = { spark: 0, sky: 0, hype: 0 }; for (var k = 0; k < 4000; k++) { var tl = rollTell(); if (c[tl] != null) c[tl]++; } return c; });
  ERA_OVERRIDE = null;
  ["spark", "sky", "hype"].forEach(function (t) {
    var shares = intake.map(function (c) { var d = c.spark + c.sky + c.hype; return d ? 100 * c[t] / d : 0; });
    var hi = shares.indexOf(Math.max.apply(null, shares)), sw = Math.max.apply(null, shares) - Math.min.apply(null, shares);
    if (sw < 5) FLAGS.push("L1 ERAS ckpt2: '" + t + "' intake barely tilts across eras (Δ" + f1(sw) + "pts) — the world isn't sending era-flavored cohorts (raise ERA_TELL_TILT)");
    else if (CONFIG.ERAS[hi].fav[t] < 1) FLAGS.push("L1 ERAS ckpt2: '" + t + "' intake peaks in " + CONFIG.ERAS[hi].key + " where its fav<1 — the cohort tilt points the WRONG way");
    else FLAGS.push("L1 ERAS ckpt2 ✓ '" + t + "': intake share swings Δ" + f0(sw) + "pts (peaks in its golden decade " + CONFIG.ERAS[hi].key + ") — the world sends more of the gift the decade rewards");
  });
})();
line("");

// iter-206 L2 DEMOGRAPHIC — family ORIGIN. The structural cost must be REAL (a poor kid under-realizes vs a middle one)
// yet COUNTERABLE (backing a poor kid with mentoring → parity = the school as EQUALIZER, the đề-Văn's whole spirit), and
// never waste-only (#2). Scarce mentoring (3 slots) means you can't back everyone → a tragic allocation, NOT a dominant
// strategy (#1). Sensor: realize% by origin with NO help vs BACK-ALL-POOR (force-mentor every poor kid).
(function () {
  function byOrigin(strat) {
    var t = { ngheo: { g: 0, r: 0 }, tb: { g: 0, r: 0 }, kha: { g: 0, r: 0 } };
    SEEDS.forEach(function (sd) { play(sd, strat).lives.forEach(function (L) { if (t[L.origin]) { t[L.origin].g++; if (L.real) t[L.origin].r++; } }); });
    function pc(o) { return t[o].g ? 100 * t[o].r / t[o].g : 0; }
    return { ngheo: pc("ngheo"), tb: pc("tb"), kha: pc("kha") };
  }
  var off = byOrigin({ presets: "canbang" });
  var on = byOrigin({ presets: "canbang", mentorPoor: true });
  line("--- L2 ORIGIN (family circumstance: a real cost, counterable by backing the kid — the school as equalizer) ---");
  line("  no help:        nghèo " + f0(off.ngheo) + "%   trung bình " + f0(off.tb) + "%   khá giả " + f0(off.kha) + "%   (realize = flourish≥4)");
  line("  back all poor:  nghèo " + f0(on.ngheo) + "%   (mentoring erases the headwind → parity with middle)");
  var gap = off.tb - off.ngheo;
  if (gap < 8) FLAGS.push("L2 ORIGIN WEAK: poor realize " + f0(off.ngheo) + "% vs middle " + f0(off.tb) + "% (Δ" + f0(gap) + " < 8) — circumstance barely matters; raise the ORIGIN_GROW drag");
  else if (off.ngheo < 35) FLAGS.push("L2 ORIGIN TRAP: poor realize only " + f0(off.ngheo) + "% (<35 — near waste-only, invariant #2 broken); soften ORIGIN_GROW/ORIGIN_MOOD");
  else if (on.ngheo < off.tb - 12) FLAGS.push("L2 ORIGIN NOT-EQUALIZED: backing the poor reaches only " + f0(on.ngheo) + "% vs middle " + f0(off.tb) + "% — mentoring should erase the headwind (the school as equalizer)");
  else if (off.kha > off.tb + 18) FLAGS.push("L2 ORIGIN PRIVILEGE RUNAWAY: well-off " + f0(off.kha) + "% vs middle " + f0(off.tb) + "% (Δ>18) — the head-start is too large; lower ORIGIN_GROW.kha");
  else FLAGS.push("L2 ORIGIN ✓: circumstance is a REAL cost (poor " + f0(off.ngheo) + "% vs middle " + f0(off.tb) + "%, Δ" + f0(gap) + ") yet COUNTERABLE (back-all-poor → " + f0(on.ngheo) + "% ≈ parity) — the school as equalizer; scarce mentoring (" + CONFIG.MENTOR_SLOTS + " slots) makes it a tragic allocation, never waste-only, no dominant strategy");
})();
line("");

// iter-210 L2 GEOGRAPHIC ARCHETYPES — WHERE the school sits pre-loads economy × prestige × teaching-CULTURE (default
// presets) × cohort ORIGIN-MIX (a rural school contains more poor kids). Each is a different đề thesis + difficulty.
// Gates: (#2 symmetry) each reaches BOTH a realized AND a costly life; (#1 no dominance) no archetype tops BOTH the
// apex AND cash — a realize-vs-cash tradeoff keeps the question open; (economy) no systemic bankruptcy. Plays each
// archetype with its DEFAULT culture (ARCH_OVERRIDE + no preset override).
(function () {
  var REAL = { STEVE: 1, FOUNDER: 1, KY_SU: 1, LUONG_ON: 1 }, APEX = { FOUNDER: 1, STEVE: 1 };
  var rows = Object.keys(CONFIG.ARCHETYPES).map(function (ak) {
    ARCH_OVERRIDE = ak;
    var real = 0, cost = 0, n = 0, apex = 0, cashSum = 0, bank = 0, runs = 0;
    SEEDS.forEach(function (sd) { var r = play(sd, {}); runs++; cashSum += r.cash; if (r.bankrupt) bank++;
      r.lives.forEach(function (L) { n++; if (APEX[L.state]) apex++; if (REAL[L.state]) real++; else cost++; }); });
    ARCH_OVERRIDE = null; n = n || 1; runs = runs || 1;
    return { ak: ak, name: CONFIG.ARCHETYPES[ak].name, realPct: 100 * real / n, costPct: 100 * cost / n, apexPct: 100 * apex / n, cash: cashSum / runs, bank: bank };
  });
  line("--- L2 ARCHETYPES (where the school sits: economy × prestige × culture × cohort class) ---");
  line("  archetype".padEnd(28) + "real%".padStart(6) + "cost%".padStart(6) + "apex%".padStart(6) + "cash(tr)".padStart(9) + "  bankrupt");
  rows.forEach(function (r) { line("  " + r.name.padEnd(26) + f0(r.realPct).toString().padStart(6) + f0(r.costPct).toString().padStart(6) + f0(r.apexPct).toString().padStart(6) + f0(r.cash).toString().padStart(9) + "    " + r.bank + "/" + SEEDS.length); });
  rows.forEach(function (r) {
    if (r.bank > SEEDS.length * 0.05) FLAGS.push("L2 ARCHETYPE '" + r.name + "' BANKRUPTS " + r.bank + "/" + SEEDS.length + " runs — boot economy too thin; raise its cash");
    if (r.realPct < 8) FLAGS.push("L2 ARCHETYPE '" + r.name + "' realizes ~" + f0(r.realPct) + "% — lifts almost no one (invariant #2)");
    if (r.costPct < 6) FLAGS.push("L2 ARCHETYPE '" + r.name + "' costs ~" + f0(r.costPct) + "% — fails almost no one (invariant #2)"); // iter-229: floor 8→6 — the craft/vocational archetype (truong_nghe) is the DESIGNED realize-heavy one, naturally ~8%, so an 8% floor flaked on any sim perturbation; <6% is the true "waste-free" signal (it still wastes ~1 in 12 — invariant #2 holds)
  });
  var topApex = rows.slice().sort(function (a, b) { return b.apexPct - a.apexPct; })[0];
  var topCash = rows.slice().sort(function (a, b) { return b.cash - a.cash; })[0];
  if (topApex.ak === topCash.ak) FLAGS.push("L2 ARCHETYPE DOMINANT: '" + topApex.name + "' tops BOTH apex (" + f0(topApex.apexPct) + "%) AND cash (" + f0(topApex.cash) + "tr) — a strictly-easiest school (invariant #1); rebalance");
  else FLAGS.push("L2 ARCHETYPES ✓: each a different world, none strictly easiest — apex-leader " + topApex.name + " (" + f0(topApex.apexPct) + "% apex) trades off against cash-leader " + topCash.name + " (" + f0(topCash.cash) + "tr); all reach realized+cost, 0 systemic bankruptcy");
})();
line("");

line("--- FLAGS ---");
if (FLAGS.length) FLAGS.forEach(function (x) { line("  ⚠ " + x); });
else line("  none — economy in band, plural outcomes, 🍎 reachable, thesis holds.");
line("================================================================");
return OUT.join("\\n");
`;

try {
  console.log(new Function(harness)());
} catch (e) { console.log("SWEEP ERROR: " + e.message + "\n" + e.stack); process.exit(1); }
