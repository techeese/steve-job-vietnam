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
const engineSrc = fs.readFileSync(dir + "/js/engine.js", "utf8");
const shim = "var localStorage={_d:{},getItem:function(k){return this._d[k]!=null?this._d[k]:null;},setItem:function(k,v){this._d[k]=v;}};";

const harness = `
${shim}
${dataSrc}
${engineSrc}

var DPY = CONFIG.DAYS_PER_MONTH * 12; // days per year

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
    dayTick();
    if (S.cash < minCash) minCash = S.cash;
    if (S.cash < -60) bankrupt = true;
    if (d === DPY - 1) y1Net = (S.cash - y1cashStart) / 12; // avg monthly net over year 1
  }
  var byState = {}; CONFIG.ALUM.STATES.forEach(function (k) { byState[k] = 0; });
  S.alumni.forEach(function (a) { byState[a.state] = (byState[a.state] || 0) + 1; });
  return {
    cash: S.cash, minCash: minCash, bankrupt: bankrupt, y1Net: y1Net,
    tt: S.tiengTam, ut: S.uyTin, tc: S.thucChat, endow: S.endow.bal,
    grad: S.META.graduated, steves: S.META.steves, arrested: S.META.arrested,
    alumni: S.alumni.length, byState: byState
  };
}

function agg(seeds, strat) {
  var runs = seeds.map(function (s) { return play(s, strat); });
  var n = runs.length, sum = function (f) { return runs.reduce(function (a, r) { return a + f(r); }, 0); };
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
    avgAlumni: totalAlum / n, statePct: pct
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
  "đồ án nghèo (no rooms)": { presets: "duan" }
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
if (dflt.avgCash > 1200) FLAGS.push("late-game money inflates to ~" + f0(dflt.avgCash) + "tr — no spend sink / no economic pressure mid-late run");
var maxCoin = Math.max.apply(null, names.map(function (nm) { return results[nm].statePct.CA_MAP_COIN; }));
if (maxCoin < 1.5) FLAGS.push("CA_MAP_COIN (cá mập coin) only ~" + f1(maxCoin) + "% across ALL strategies — the satire's dark mirror barely fires; cram should breed some sharks");
var dead = keys.filter(function (k) { return k !== "STEVE" && names.every(function (nm) { return results[nm].statePct[k] < 0.5; }); }); // STEVE is meant to be rare per-capita (tracked via 🍎rate)
if (dead.length) FLAGS.push("end-states that essentially never occur: " + dead.join(", ") + " — content/cascade gates may be unreachable");
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
