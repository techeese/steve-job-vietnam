/* PHASE 0 of the EDUCATION MODEL REFINEMENT epic (owner steer 2026-06-22) — the REALIZATION-BASELINE snapshot.
 *
 * WHY: gate.sh proves DETERMINISM (same inputs → byte-identical replay) but it stores NO growth/realization
 * baseline — so a mis-tuned change (e.g. a Phase-1 STRUCT_FIT that doesn't return exactly 1.0 at the baseline
 * structure) would silently shift EVERY kid's destiny and gate.sh would stay GREEN. This harness closes that hole:
 * it runs a FIXED set of (preset × seed) schools to graduation, tallies the alumni-state histogram, and asserts it
 * matches the committed snapshot EXACTLY (the sim is deterministic → epsilon 0; any drift is a regression).
 *
 * USAGE:
 *   node baseline.js              → compare against baseline.snapshot.json; exit 1 on drift (used by gate.sh)
 *   node baseline.js --capture    → (re)write the snapshot. Do this ONLY when a change is DESIGNED to move
 *                                   outcomes — and say so in the commit. An UNEXPECTED drift is a bug, not a recapture.
 *
 * Concats the same real engine files as gate.js/sweep.js (no DOM). Machine-independent (pure mulberry32 math). */
const fs = require("fs");
const dir = __dirname;
const SNAP = dir + "/baseline.snapshot.json";
const files = ["js/data.js", "js/content.js", "js/engine.js", "js/sim/person.js", "js/sim/alumni.js", "js/sim/admissions.js", "js/save.js"];
const src = files.map(function (f) { return fs.readFileSync(dir + "/" + f, "utf8"); }).join("\n");
const shim = "var localStorage={_d:{},getItem:function(k){return this._d[k]!=null?this._d[k]:null;},setItem:function(k,v){this._d[k]=v;}};";

// A small FIXED matrix — the 3 triết lý × 4 seeds, each a full run to graduation. Enough to register any
// realize/waste/apex shift across the spectrum; small enough to keep the gate fast.
const SEEDS = [101, 202, 303, 404];
const PRESETS = ["luyende", "canbang", "duan"];

const harness = `
var DPY = CONFIG.DAYS_PER_MONTH * 12;
function runHist(preset, seed){
  freshState(seed);
  S.presets = { n1:preset, n2:preset, n3:preset, n4:preset };
  for (var d = 0; d < 11 * DPY; d++) dayTick();
  var h = {};
  for (var i = 0; i < S.alumni.length; i++){ var a = S.alumni[i]; if (a._tpl) continue; h[a.state] = (h[a.state]||0) + 1; }
  return h;
}
var hist = {};
${JSON.stringify(PRESETS)}.forEach(function(p){
  var agg = {};
  ${JSON.stringify(SEEDS)}.forEach(function(sd){ var h = runHist(p, sd); for (var k in h) agg[k] = (agg[k]||0) + h[k]; });
  // sort keys for stable serialization
  var sorted = {}; Object.keys(agg).sort().forEach(function(k){ sorted[k] = agg[k]; });
  hist[p] = sorted;
});
return JSON.stringify(hist);
`;

var got;
try {
  got = JSON.parse(new Function(shim + "\n" + src + "\n" + harness)());
} catch (e) {
  console.log("BASELINE HARNESS ERROR: " + e.message + "\n" + e.stack);
  process.exit(1);
}

const capture = process.argv.indexOf("--capture") >= 0;
if (capture || !fs.existsSync(SNAP)) {
  fs.writeFileSync(SNAP, JSON.stringify(got, null, 2) + "\n");
  console.log("BASELINE CAPTURED → baseline.snapshot.json");
  console.log(JSON.stringify(got));
  process.exit(0);
}

const want = JSON.parse(fs.readFileSync(SNAP, "utf8"));
const drift = [];
const presets = Object.keys(want).concat(Object.keys(got)).filter(function (v, i, a) { return a.indexOf(v) === i; });
presets.forEach(function (p) {
  const w = want[p] || {}, g = got[p] || {};
  const states = Object.keys(w).concat(Object.keys(g)).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
  states.forEach(function (st) {
    if ((w[st] || 0) !== (g[st] || 0)) drift.push(p + "." + st + ": baseline " + (w[st] || 0) + " → now " + (g[st] || 0));
  });
});

if (drift.length) {
  console.log("=== BASELINE DRIFT (" + drift.length + ") — realization changed vs the committed snapshot ===");
  drift.forEach(function (d) { console.log("  " + d); });
  console.log("If this change was DESIGNED to move outcomes, recapture: node baseline.js --capture (and note why in the commit).");
  console.log("Otherwise it is a SILENT RATE REGRESSION — fix the game.");
  process.exit(1);
}
console.log("=== BASELINE GREEN === (alumni-state histogram matches the snapshot across " + PRESETS.length + " presets × " + SEEDS.length + " seeds)");
