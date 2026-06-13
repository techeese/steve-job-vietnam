/* Headless gate harness for Học viện Steve engine (node, no DOM).
   Loads js/data.js + js/engine.js in one scope and runs GATE_* assertions. */
const fs = require("fs");
const dir = __dirname;
const dataSrc = fs.readFileSync(dir + "/js/data.js", "utf8");
const engineSrc = fs.readFileSync(dir + "/js/engine.js", "utf8");

const shim = "var localStorage={_d:{},getItem:function(k){return this._d[k]!=null?this._d[k]:null;},setItem:function(k,v){this._d[k]=v;}};";

const harness = `
var FAILS = [];
function ok(cond, label){ if(!cond) FAILS.push('FAIL: '+label); else OUT.push('  ok '+label); }
var OUT = [];

/* GATE_FRESH — start-from-nothing: empty grounds at boot, first intake at the July rollover */
try {
  __test.fresh(123);
  ok(S.students.length === 0, 'boot 0 students (got '+S.students.length+')');
  ok(S.rooms.length === 0, 'boot 0 rooms (got '+S.rooms.length+')');
  ok(S.teachers.length === 1, 'boot 1 teacher (got '+S.teachers.length+')');
  ok(S.alumni.length === 1 && S.alumni[0]._tpl, 'boot 1 shadow alumnus (TPL)');
  ok(S.month === 6 && S.year === 1, 'boot Tháng 6 Năm 1');
  __test.place('phonghoc', 1, 1);
  __test.days(400);
  var s = S;
  OUT.push('GATE_FRESH MONEY='+r1(s.cash)+' YEAR='+s.year+' STU='+s.students.length+' ALUM='+s.alumni.length+' ENDOW='+r1(s.endow.bal));
  ok(Number.isFinite(s.cash), 'fresh money finite');
  ok(s.year === 2, 'fresh year==2 after first founding-June (got '+s.year+')');
  ok(s.students.length >= 8 && s.students.length <= 14, 'fresh stu 8..14 — one intake grew in (got '+s.students.length+')');
  ok(s.students.some(function(x){ return x.ten === 'Mai Sương'; }), 'Mai Sương enrolled in the founding intake');
  ok(s.alumni.length === 1, 'no graduates yet — only the shadow alumnus (got '+s.alumni.length+')');
  ok(Number.isFinite(s.endow.bal), 'fresh endow finite');
} catch(e){ FAILS.push('GATE_FRESH threw: '+e.message+'\\n'+e.stack); }

/* GATE_ADMIT */
try {
  __test.fresh(7);
  var before = S.photSeeds.length;
  var res = __test.admit(29.75, 6);
  var after = S.photSeeds.length;
  var p1 = JSON.stringify(__test.pool());
  var p2 = JSON.stringify(__test.pool());
  OUT.push('GATE_ADMIT PHOT+'+(after-before)+' FILL='+res.fill+' POOLDET='+(p1===p2)+' ROSTER='+S.students.length);
  ok(after-before === 1, 'admit295 seeds 1 phot');
  ok(res.fill <= 6, 'admit fill <= quota');
  ok(p1 === p2, 'pool deterministic');
  ok(S.students.length <= 48, 'roster <= 48');
  // max-quota cap arithmetic (no deletion)
  __test.fresh(8); var r2res = __test.admit(15, 14); ok(S.students.length <= 48, 'roster cap holds at max quota');
} catch(e){ FAILS.push('GATE_ADMIT threw: '+e.message+'\\n'+e.stack); }

/* GATE_ALUM — determinism + TPL */
try {
  __test.fresh(99);
  S.year = 3;
  var states = ['THAT_NGHIEP','LUONG_ON','KY_SU','FOUNDER','CA_MAP_COIN','QUAN_VAN_MAU','BI_BAT','FOUNDER','KY_SU','LUONG_ON'];
  S.alumni = states.map(function(st, i){
    return { id: 100+i, ten:'Cựu '+i, gradYear:1, outcome:'x', state:st, history:[st], yearsInState:(i%3),
      annMonth: [1,2,3,4,5,7,8,9,10,11][i], fs:{kt:50+i,tn:40+i,st:45,cm:50+i,vet:35,seed:1+(i%5)}, grat:50, gifts:0,
      flags:{tiemNang:(i===3), coinPath:(st==='CA_MAP_COIN'), garage:false, vt:[]} };
  });
  localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(serialize()));
  __test.almYears(5);
  var snapA = JSON.stringify(S.alumni);
  loadGame();           // restore from localStorage
  __test.almYears(5);
  var snapB = JSON.stringify(S.alumni);
  OUT.push('GATE_ALUM determinism='+(snapA===snapB));
  ok(snapA === snapB, 'alumni replay byte-identical');

  __test.fresh(123); __test.days(1080);
  var tplA = S.alumni.filter(function(a){ return a._tpl; })[0];
  var giftLines = S.endow.log.filter(function(l){ return l.gift; }).length;
  OUT.push('GATE_ALUM TPL='+(tplA?tplA.state:'NONE')+' arrested='+(tplA?!!tplA._arrested:false)+' endowBal='+r1(S.endow.bal)+' giftLines='+giftLines);
  // arrest must have FIRED (scripted beat); post-arrest he may legally wander BI_BAT→THAT_NGHIEP/CA_MAP_COIN
  ok(tplA && tplA._arrested === true && tplA.state !== 'STEVE', 'TPL scripted arrest fired');
  ok(S.endow.bal > 10, 'endow grew past boot');
} catch(e){ FAILS.push('GATE_ALUM threw: '+e.message+'\\n'+e.stack); }

/* GATE_COMPAT — v1 save migrates */
try {
  __test.fresh(1);
  var v1stud = [];
  for (var i=0;i<30;i++) v1stud.push({ id:i+1, grade:(i<10?'g10':i<20?'g11':'g12'), kt:50, tn:40, st:30, cm:30, vet:40, mood:60, seed:3, flags:{} });
  var v1 = { v:1, cash:100, book:150, tuition:2, students:v1stud, sponsor:{accepted:true},
    presets:{g10:'canbang', g11:'luyende', g12:'luyende'},
    alumni:[{id:1,ten:'Cựu A',outcome:'kysu',year:1},{id:2,ten:'Cựu B',outcome:'camap',year:1}] };
  localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(v1));
  loadGame();
  var grades = S.students.map(function(s){ return s.grade; });
  var gradesOk = grades.every(function(g){ return g>=2 && g<=4; });
  OUT.push('GATE_COMPAT grades∈{2,3,4}='+gradesOk+' contract='+(S.contracts[0]&&S.contracts[0].co)+' alumState='+S.alumni[0].state);
  ok(gradesOk, 'v1 grades migrated to 2..4');
  ok(['n1','n2','n3','n4'].every(function(k){ return CONFIG.PRESETS[S.presets[k]]; }), 'presets n1..n4 valid');
  ok(S.contracts[0] && S.contracts[0].co==='trungvang', 'v1 sponsor → trungvang contract');
  ok(S.alumni[0].state && S.alumni[0].fs && Number.isFinite(S.alumni[0].grat), 'v1 alumni have state/grat/fs');
  __test.days(30);
  ok(Number.isFinite(S.cash), 'post-migrate sim clean');
} catch(e){ FAILS.push('GATE_COMPAT threw: '+e.message+'\\n'+e.stack); }

/* GATE_BUILD */
try {
  __test.fresh(5);
  var c0 = S.cash, n0 = S.rooms.length;
  var rb = __test.place('lab', 12, 1);
  OUT.push('GATE_BUILD ok='+rb.ok+' cashΔ='+r1(c0-S.cash)+' rooms+'+(S.rooms.length-n0));
  ok(rb.ok, 'build lab placed');
  ok(r1(c0 - S.cash) === 70, 'lab cost 70 deducted');
  ok(S.rooms.length - n0 === 1, 'rooms +1');
  var rbad = __test.place('lab', 12, 1);
  ok(!rbad.ok, 'overlap rejected');
} catch(e){ FAILS.push('GATE_BUILD threw: '+e.message+'\\n'+e.stack); }

/* GATE_SAVE — dynamic-key MAP fields must survive a save→load round-trip (regression guard for the iter-103
   bug: mergeInto only copies fresh-base keys, so maps with a fresh {} base, and null→value fields, were dropped) */
try {
  __test.fresh(7);
  if (S.teachers.length) setKhoaHead('code', S.teachers[0].id);
  S.khoaCup.trophies = { biz: 3, code: 1 }; S.khoaCup.champ = 'biz'; S.khoaCup.lastYear = 4;
  __test.place('phonghoc', 1, 1); __test.days(400); var favId = S.students[0] && S.students[0].id; S.META.favId = favId; // a followed protégé
  S._milestoneJustHit = 'TRANSIENT_SHOULD_NOT_PERSIST';
  localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(serialize()));
  loadGame();
  OUT.push('GATE_SAVE khoaHead='+JSON.stringify(S.khoaHead)+' trophies='+JSON.stringify(S.khoaCup.trophies)+' champ='+S.khoaCup.champ+' favId='+S.META.favId);
  ok(S.khoaHead.code === S.teachers[0].id, 'khoaHead (trưởng-khoa) survives reload');
  ok(S.khoaCup.trophies.biz === 3 && S.khoaCup.trophies.code === 1, 'khoaCup trophies survive reload');
  ok(S.khoaCup.champ === 'biz', 'khoaCup champ survives reload');
  ok(S.META.favId === favId, 'followed protégé (META.favId) survives reload');
  ok(!S._milestoneJustHit, 'transient _milestoneJustHit NOT persisted');
} catch(e){ FAILS.push('GATE_SAVE threw: '+e.message+'\\n'+e.stack); }

OUT.push('');
if (FAILS.length){ OUT.push('=== '+FAILS.length+' FAILURES ==='); OUT = OUT.concat(FAILS); }
else OUT.push('=== ALL GATES GREEN ===');
return OUT.join('\\n');
`;

try {
  const fn = new Function(shim + "\n" + dataSrc + "\n" + engineSrc + "\n" + harness);
  console.log(fn());
} catch (e) {
  console.log("HARNESS PARSE/RUN ERROR: " + e.message);
  console.log(e.stack);
  process.exit(1);
}
