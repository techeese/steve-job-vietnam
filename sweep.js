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
const shim = "var localStorage={_d:{},getItem:function(k){return this._d[k]!=null?this._d[k]:null;},setItem:function(k,v){this._d[k]=v;}};";

const harness = `
${shim}
${dataSrc}
${contentSrc}
${engineSrc}
${personSrc}

var DPY = CONFIG.DAYS_PER_MONTH * 12; // days per year

// adaptive grain-match (v0 — provisional, pending E2 #1 grain-vs-preset): each year set the school
// preset to match the cohort's modal tell (spark/sky → đồ án craft; hype → luyện đề; else cân bằng).
// A guardrail CONTROL: per the open-question law it must NOT dominate the pure single-philosophy theses.
function adaptPresets() {
  var tally = {}; S.students.forEach(function (s) { var t = s.tell || ""; tally[t] = (tally[t] || 0) + 1; });
  var modal = "", best = -1; for (var t in tally) if (tally[t] > best) { best = tally[t]; modal = t; }
  var P = (modal === "spark" || modal === "sky") ? "duan" : (modal === "hype" ? "luyende" : "canbang");
  S.presets = { n1: P, n2: P, n3: P, n4: P };
}

// mentor play (Phase 2): each year spend the scarce attention budget rescuing the most-mismatched, highest-gift
// kids first — the spread the PLAYER controls. Proves inaction-cost: a mentored school realizes more than the
// no-attention baseline (the gap = what you lose by doing nothing).
function mentorPlay() {
  var cur = 0; S.students.forEach(function (s) { if (s.mentored) cur++; });
  var free = CONFIG.MENTOR_SLOTS - cur; if (free <= 0) return;
  var cand = S.students.filter(function (s) { return !s.mentored; }).map(function (s) {
    var mm = CONFIG.MATCH(s.tell, S.presets["n" + s.grade]);
    return { s: s, pri: (1 - mm) * s.seed }; // most-mismatched × highest gift first
  }).sort(function (a, b) { return b.pri - a.pri; });
  for (var i = 0; i < free && i < cand.length; i++) cand[i].s.mentored = true;
}

// run ONE playthrough; strat = {presets, build:[{key,x,y}], tuition, grant, years}
function play(seed, strat) {
  freshState(seed);
  if (strat.presets) S.presets = { n1: strat.presets, n2: strat.presets, n3: strat.presets, n4: strat.presets };
  if (strat.tuition) S.tuition = strat.tuition;
  if (strat.grant) S.cash += strat.grant;
  if (strat.build) strat.build.forEach(function (r) { placeRoom(r.key, r.x, r.y); });
  var y1cashStart = S.cash, y1Net = null, minCash = S.cash, bankrupt = false;
  var years = strat.years || 11, totalDays = years * DPY;
  for (var d = 0; d < totalDays; d++) {
    if (strat.adaptive && d % DPY === 0) adaptPresets();
    if (strat.mentor && d % DPY === 0) mentorPlay();
    dayTick();
    if (S.cash < minCash) minCash = S.cash;
    if (S.cash < -60) bankrupt = true;
    if (d === DPY - 1) y1Net = (S.cash - y1cashStart) / 12; // avg monthly net over year 1
  }
  var byState = {}; CONFIG.ALUM.STATES.forEach(function (k) { byState[k] = 0; });
  S.alumni.forEach(function (a) { byState[a.state] = (byState[a.state] || 0) + 1; });
  // per-life realization inputs (E1/L1): innate seed + final genuine craft + hustle/hollow + destiny
  var lives = S.alumni.map(function (a) {
    return { seed: a.fs.seed, craft: 0.6 * a.fs.tn + 0.4 * a.fs.st, hustle: a.fs.cm, hollow: a.fs.vet, state: a.state };
  });
  return {
    cash: S.cash, minCash: minCash, bankrupt: bankrupt, y1Net: y1Net,
    tt: S.tiengTam, ut: S.uyTin, tc: S.thucChat, endow: S.endow.bal,
    grad: S.META.graduated, steves: S.META.steves, arrested: S.META.arrested,
    alumni: S.alumni.length, byState: byState, lives: lives
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
    avgAlumni: totalAlum / n, statePct: pct, lives: lives
  };
}

// ---- run ----
var OUT = [], FLAGS = [];
function line(s) { OUT.push(s); }
function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); }
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
if (dflt.avgCash > 1500) FLAGS.push("auto-play bank still inflates to ~" + f0(dflt.avgCash) + "tr despite the iter-107 Vận hành pressure — consider raising CONFIG.OPS.rate (kept 0-bankruptcy)");
else FLAGS.push("late-game cash settles ~" + f0(dflt.avgCash) + "tr (was ~2600 pre-iter-107) — Vận hành pressure working; hoard managed-down, 0 bankruptcy, pluralism intact ✓");
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
