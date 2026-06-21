/* ============================================================================
   tune.js — a balance GRID-SEARCH harness for Học viện Steve (iter 207).
   Built per the owner's 2026-06-21 "fast-track" steer: manual probe-cycle tuning
   (set a CONFIG knob → run sweep → eyeball → repeat) is the slowest serial cost
   in the loop. tune.js sweeps ONE CONFIG knob over a value grid and reports a
   chosen sweep-metric for each — so "which value hits the target band?" is one
   run, not N firings. Headless, fast, graphics-frozen-safe.

   Usage:
     node tune.js <knob> <v1,v2,...> <metric> [targetLo targetHi]
     node tune.js --metrics                 # list available metrics
     node tune.js --help

   Examples:
     node tune.js ORIGIN_GROW.ngheo 0.82,0.85,0.88,0.9 origin-gap 12 22
     node tune.js ERA_REGRESS 0.4,0.55,0.7 era-apex:spark 10 99
     node tune.js ERAS.2.fav.spark 1.4,1.55,1.7 era-apex:spark
     node tune.js OPS.rate 0.07,0.09,0.11 cash

   `knob` is a dot-path into CONFIG (array indices allowed: ERAS.2.fav.spark).
   The metric is measured across a fixed seed set per candidate value; if a
   target band is given, the closest-fitting value(s) are starred.
   ========================================================================== */
const fs = require("fs");
const dir = __dirname;
const srcFiles = ["js/data.js", "js/content.js", "js/engine.js", "js/sim/person.js", "js/sim/admissions.js", "js/save.js"];
const src = srcFiles.map(function (f) { return fs.readFileSync(dir + "/" + f, "utf8"); }).join("\n");
const shim = "var localStorage={_d:{},getItem:function(k){return this._d[k]!=null?this._d[k]:null;},setItem:function(k,v){this._d[k]=v;}};";

// ---- the in-VM harness: exposes a measure(metric) → number over the live engine ----
const harness = `
${shim}
${src}
var DPY = CONFIG.DAYS_PER_MONTH * 12;
var SEEDS = []; for (var _i = 0; _i < 40; _i++) SEEDS.push(101 + _i * 7);
var APEX = { FOUNDER: 1, STEVE: 1 };

// run one playthrough, return the alumni as lives [{state,tell,origin,seed,real,apex}]
function lives(seed, presets, years, mentorPoor, eraPin) {
  if (eraPin != null) ERA_OVERRIDE = eraPin; else ERA_OVERRIDE = null;
  freshState(seed);
  S.presets = { n1: presets, n2: presets, n3: presets, n4: presets };
  S.speed = 0;
  var days = (years || 11) * DPY;
  for (var d = 0; d < days; d++) {
    if (mentorPoor && d % DPY === 0) S.students.forEach(function (s) { if (studentOrigin(s) === "ngheo") s.mentored = true; });
    dayTick();
  }
  ERA_OVERRIDE = null;
  return S.alumni.map(function (a) { return { state: a.state, tell: a.fs.tell || "", origin: a.fs.origin || "", seed: a.fs.seed, real: flourishOf(a.state) >= 4, apex: !!APEX[a.state] }; });
}
function allLives(presets, opts) { opts = opts || {}; var out = []; SEEDS.forEach(function (sd) { out = out.concat(lives(sd, presets, opts.years, opts.mentorPoor, opts.eraPin)); }); return out; }
function realPct(L, filt) { var g = 0, r = 0; L.forEach(function (x) { if (!filt || filt(x)) { g++; if (x.real) r++; } }); return g ? 100 * r / g : 0; }
function apexPct(L, filt) { var g = 0, a = 0; L.forEach(function (x) { if (!filt || filt(x)) { g++; if (x.apex) a++; } }); return g ? 100 * a / g : 0; }

// ---- METRICS registry: name → fn() → number. Each re-runs the engine under the CURRENT CONFIG. ----
var METRICS = {
  "origin-gap": function () { var L = allLives("canbang"); return realPct(L, function (x) { return x.origin === "tb"; }) - realPct(L, function (x) { return x.origin === "ngheo"; }); }, // middle − poor realize gap (the structural cost)
  "origin-poor": function () { return realPct(allLives("canbang"), function (x) { return x.origin === "ngheo"; }); }, // poor realize% (must stay > waste-only floor)
  "origin-poor-mentored": function () { return realPct(allLives("canbang", { mentorPoor: true }), function (x) { return x.origin === "ngheo"; }); }, // back-all-poor → parity check
  "steve-rate": function () { var n = 0, hit = 0; SEEDS.forEach(function (sd) { n++; var L = lives(sd, "duan", 11); if (L.some(function (x) { return x.state === "STEVE"; })) hit++; }); return 100 * hit / n; }, // % of craft runs that reach 🍎
  "cash": function () { var t = 0; SEEDS.forEach(function (sd) { freshState(sd); S.speed = 0; for (var d = 0; d < 11 * DPY; d++) dayTick(); t += S.cash; }); return t / SEEDS.length; }, // avg end cash (default presets), in tr
  "waste": function () { var L = allLives("canbang"); return 100 - realPct(L); }, // default waste% (non-flourish)
  "drop": function () { var t = 0; SEEDS.forEach(function (sd) { freshState(sd); S.presets = { n1: "luyende", n2: "luyende", n3: "luyende", n4: "luyende" }; S.speed = 0; for (var d = 0; d < 11 * DPY; d++) dayTick(); t += (S.META.dropped || 0); }); return t / SEEDS.length; } // avg dropouts/run under cram (watch for spirals)
};
// era-apex:<tell> — the apex% swing for a gift across the 5 pinned eras (the "right kid, wrong era" grip)
function eraApexSwing(tell) {
  var ps = CONFIG.ERAS.map(function (e, i) { return apexPct(allLives("canbang", { eraPin: i }), function (x) { return x.tell === tell; }); });
  return Math.max.apply(null, ps) - Math.min.apply(null, ps);
}

function measure(metric) {
  if (METRICS[metric]) return METRICS[metric]();
  var m = /^era-apex:(spark|sky|hype)$/.exec(metric);
  if (m) return eraApexSwing(m[1]);
  throw new Error("unknown metric '" + metric + "' (try --metrics)");
}

// ---- deep-set a CONFIG knob by dot-path (array indices ok): ORIGIN_GROW.ngheo / ERAS.2.fav.spark ----
function setKnob(path, val) {
  var parts = path.split("."), o = CONFIG;
  for (var i = 0; i < parts.length - 1; i++) { o = o[parts[i]]; if (o == null) throw new Error("bad knob path at '" + parts[i] + "'"); }
  var leaf = parts[parts.length - 1];
  if (o[leaf] === undefined) throw new Error("knob '" + path + "' does not exist in CONFIG");
  o[leaf] = val;
}
function getKnob(path) { var parts = path.split("."), o = CONFIG; for (var i = 0; i < parts.length; i++) { o = o[parts[i]]; } return o; }

// ---- driver (invoked with JSON args from outside) ----
function run(knob, grid, metric, lo, hi) {
  var base = getKnob(knob), out = [];
  var rows = grid.map(function (v) { setKnob(knob, v); var y = measure(metric); return { v: v, y: y }; });
  setKnob(knob, base); // restore
  var hasT = (lo != null && hi != null), mid = hasT ? (lo + hi) / 2 : 0, bestI = -1, bestD = Infinity;
  if (hasT) rows.forEach(function (r, i) { if (r.y >= lo && r.y <= hi) { var d = Math.abs(r.y - mid); if (d < bestD) { bestD = d; bestI = i; } } });
  out.push("tune.js — knob " + knob + " (current " + base + ")  ·  metric " + metric + (hasT ? "  ·  target [" + lo + ", " + hi + "]" : ""));
  out.push("  " + "value".padEnd(12) + metric + (hasT ? "   in-band?" : ""));
  rows.forEach(function (r, i) {
    var f = (Math.round(r.y * 10) / 10).toFixed(1);
    var mark = hasT ? (r.y >= lo && r.y <= hi ? (i === bestI ? "  ★ best-fit" : "  ✓") : "  ✗") : "";
    out.push("  " + String(r.v).padEnd(12) + f.padStart(7) + mark);
  });
  if (hasT) out.push(bestI >= 0 ? "→ pick " + knob + " = " + rows[bestI].v + " (metric " + (Math.round(rows[bestI].y * 10) / 10).toFixed(1) + ", closest to target midpoint)" : "→ NO grid value hits [" + lo + ", " + hi + "] — widen the grid or rethink the knob");
  return out.join("\\n");
}
return run(__KNOB__, __GRID__, __METRIC__, __LO__, __HI__);
`;

// ---- CLI ----
const argv = process.argv.slice(2);
function help() {
  console.log(fs.readFileSync(__filename, "utf8").split("============================================================================")[1].trim());
}
if (!argv.length || argv[0] === "--help" || argv[0] === "-h") { help(); process.exit(0); }
if (argv[0] === "--metrics") {
  console.log("Available metrics:\n  origin-gap            middle − poor realize gap (canbang) — the structural cost\n  origin-poor           poor realize% (canbang) — keep above the waste-only floor\n  origin-poor-mentored  poor realize% when ALL poor are mentored — the equalizer/parity check\n  era-apex:<tell>       apex% swing across the 5 eras for spark|sky|hype — the wrong-era grip\n  steve-rate            % of craft (đồ án) runs that reach 🍎\n  cash                  avg end cash (default presets), tr\n  waste                 default waste% (canbang)\n  drop                  avg dropouts/run under all-cram (watch for spirals)");
  process.exit(0);
}
if (argv.length < 3) { console.error("usage: node tune.js <knob> <v1,v2,...> <metric> [targetLo targetHi]   (--help / --metrics)"); process.exit(1); }
const knob = argv[0];
const grid = argv[1].split(",").map(function (x) { return parseFloat(x); });
const metric = argv[2];
const lo = argv[3] != null ? parseFloat(argv[3]) : null;
const hi = argv[4] != null ? parseFloat(argv[4]) : null;
const body = harness
  .replace("__KNOB__", JSON.stringify(knob))
  .replace("__GRID__", JSON.stringify(grid))
  .replace("__METRIC__", JSON.stringify(metric))
  .replace("__LO__", lo == null ? "null" : JSON.stringify(lo))
  .replace("__HI__", hi == null ? "null" : JSON.stringify(hi));
try { console.log(new Function(body)()); }
catch (e) { console.log("TUNE ERROR: " + e.message + "\n" + e.stack); process.exit(1); }
