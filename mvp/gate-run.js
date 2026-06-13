/* Headless gate harness for Học viện Steve.
 * No Chrome in the cloud env → load index.html under jsdom, drive window.__test,
 * assert on document.title + DOM mirrors. Mirrors MVP-SPEC.md §10. */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const HTML = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
let failures = 0;
const ok  = m => console.log('  \x1b[32m✓\x1b[0m ' + m);
const die = m => { console.log('  \x1b[31m✗ ' + m + '\x1b[0m'); failures++; };

/* ---- 0. syntax-check every inline <script> block ---- */
function parseCheck() {
  const blocks = [...HTML.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  let n = 0;
  for (const code of blocks) {
    if (!code.trim()) continue;
    n++;
    try { new Function(code); }
    catch (e) { die(`script block #${n} syntax error: ${e.message}`); }
  }
  if (!failures) ok(`parsed ${n} script block(s), no syntax errors`);
}

/* ---- jsdom factory (no pretendToBeVisual → no rAF → game runs HEADLESS) ---- */
function makeDom(url) {
  const vc = new VirtualConsole();
  const errors = [];
  vc.on('jsdomError', e => {
    // canvas "not implemented" is expected & harmless; everything else is a real error
    if (/getContext|HTMLCanvasElement|Not implemented: window\.scroll/.test(e.message)) return;
    errors.push(e.message);
  });
  const dom = new JSDOM(HTML, { runScripts: 'dangerously', url, virtualConsole: vc, pretendToBeVisual: false });
  return { dom, win: dom.window, errors };
}
const titleClean = win => !/^JSERR/.test(win.document.title || '');
const mirror = (win, id) => win.document.getElementById(id) ? win.document.getElementById(id).textContent : null;

/* ---- GATE_FRESH ---- */
function gateFresh() {
  console.log('\nGATE_FRESH');
  const { win, errors } = makeDom('https://example.org/?seed=123');
  const t = win.__test;
  if (!t) return die('window.__test missing');
  t.place('cangtin', 6, 5);
  t.days(400);
  const S = t.S();
  const money = S.money, year = S.year, stu = S.students.length;
  const line = `GATE_FRESH MONEY=${money.toFixed ? money.toFixed(1) : money} YEAR=${year} STU=${stu}`;
  console.log('  → ' + line);
  if (!titleClean(win)) die('JSERR raised: ' + win.document.title);
  if (errors.length) die('runtime errors: ' + errors.join(' | '));
  if (!Number.isFinite(money)) die('money not finite'); else ok('money finite');
  if (year !== 2) die(`expected YEAR=2, got ${year}`); else ok('reached year 2');
  if (stu < 26 || stu > 36) die(`STU out of 26..36: ${stu}`); else ok(`roster ${stu} in 26..36`);
  if (mirror(win, 'studentCount') != String(stu)) die('#studentCount mirror stale'); else ok('#studentCount mirror synced');
  if (mirror(win, 'yearVal') == null) die('#yearVal missing'); else ok('HUD mirrors present');
}

/* ---- GATE_COMPAT: save → reload → tick clean (save round-trip + sanitize) ---- */
function gateCompat() {
  console.log('\nGATE_COMPAT');
  const { win, errors } = makeDom('https://example.org/');
  const t = win.__test;
  if (!t) return die('window.__test missing');
  t.days(120);              // build up a mid-arc state
  const before = t.S().students.length;
  t.save();                 // write to localStorage
  t.load();                 // re-read + sanitize + migrate
  const after = t.S().students.length;
  t.days(30);               // must tick clean after reload
  if (!titleClean(win)) die('JSERR after reload: ' + win.document.title);
  if (errors.length) die('runtime errors: ' + errors.join(' | '));
  if (!Number.isFinite(t.S().money)) die('money not finite after reload'); else ok('reload + 30 days clean');
  if (Math.abs(after - before) > 2) die(`roster jumped on reload: ${before}→${after}`); else ok(`roster stable on reload (${before}→${after})`);
}

/* ---- GATE_BUILD: place on occupied → false, S unchanged ---- */
function gateBuild() {
  console.log('\nGATE_BUILD');
  const { win } = makeDom('https://example.org/');
  const t = win.__test;
  if (!t) return die('window.__test missing');
  const snap = JSON.stringify(t.S());
  const r = t.place('lab', 2, 2);   // (2,2) is the pre-placed Phòng học
  if (r !== false) die('place on occupied returned ' + r + ' (expected false)'); else ok('occupied placement rejected');
  if (JSON.stringify(t.S()) !== snap) die('state mutated by rejected placement'); else ok('state unchanged');
}

parseCheck();
gateFresh();
gateCompat();
gateBuild();

console.log('');
if (failures) { console.log(`\x1b[31mGATES RED — ${failures} failure(s)\x1b[0m`); process.exit(1); }
console.log('\x1b[32mGATES GREEN\x1b[0m'); process.exit(0);
