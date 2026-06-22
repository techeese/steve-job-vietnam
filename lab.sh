#!/usr/bin/env bash
# lab.sh — THE GAMEPLAY LAB: a local, graphics-free window into the SIM (gameplay-first phase).
#
# Graphics are frozen and the loop develops sight-unseen via headless gates — this is how the OWNER
# still gets to WATCH the gameplay (in words) and react. It regenerates __lab.html from the CURRENT
# index.html (so it's always in sync with the live engine) and injects an overlay that lets you run a
# school and READ what the sim produces: biographies, the realize/waste/distort distribution, a
# per-year arc, the economy — and compare presets side by side. Open it, tweak, re-run, discuss.
#
#   ./lab.sh            regenerate + open in your default browser
#
# __lab.html is gitignored (.gitignore: __*.html), so it persists for the browser without being
# committed. Re-run ./lab.sh after engine changes to pick them up.
set -euo pipefail
cd "$(dirname "$0")"
OUT="__lab.html"
cp index.html "$OUT"
cat >> "$OUT" <<'HTML'
<style>
#LABUI{position:fixed;inset:0;z-index:99998;background:#14110d;color:#efe6d6;
  font:14px/1.5 'Be Vietnam Pro',system-ui,sans-serif;overflow:auto;padding:18px 20px}
#LABUI h1{font-size:18px;margin:0 0 4px;color:#f4c66a}
#LABUI .sub{color:#b9ad97;font-size:12px;margin-bottom:14px}
#LABUI .row{display:flex;flex-wrap:wrap;gap:10px;align-items:end;margin-bottom:14px}
#LABUI label{display:flex;flex-direction:column;font-size:11px;color:#b9ad97;gap:3px}
#LABUI select,#LABUI input{background:#221d16;color:#efe6d6;border:1px solid #3a3328;
  border-radius:6px;padding:6px 8px;font:13px inherit}
#LABUI button{background:#c9893a;color:#14110d;border:0;border-radius:6px;padding:8px 14px;
  font:600 13px inherit;cursor:pointer}
#LABUI button.sec{background:#2c2620;color:#efe6d6;border:1px solid #3a3328}
#LABUI button:hover{filter:brightness(1.08)}
#LABUI .cols{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media(max-width:780px){#LABUI .cols{grid-template-columns:1fr}}
#LABUI .card{background:#1b1711;border:1px solid #2e281f;border-radius:10px;padding:12px 14px;margin-bottom:14px}
#LABUI .card h2{font-size:13px;margin:0 0 8px;color:#f4c66a;text-transform:uppercase;letter-spacing:.04em}
#LABUI table{width:100%;border-collapse:collapse;font-size:12px}
#LABUI th,#LABUI td{text-align:right;padding:3px 7px;border-bottom:1px solid #262019}
#LABUI th:first-child,#LABUI td:first-child{text-align:left}
#LABUI .bio{white-space:pre-wrap;font:12.5px/1.55 ui-monospace,Menlo,monospace;color:#e7dcc7;max-height:60vh;overflow:auto}
#LABUI .bar{display:flex;height:16px;border-radius:4px;overflow:hidden;margin:4px 0 2px}
#LABUI .bar i{display:block}
#LABUI .lg{font-size:11px;color:#b9ad97;display:flex;gap:12px;flex-wrap:wrap}
#LABUI .r{color:#7fc081}#LABUI .w{color:#d8a657}#LABUI .d{color:#e06c6c}
#LABUI .min{position:fixed;top:8px;right:10px;z-index:99999}
</style>
<script>
(function(){
  var R="#7fc081",W="#d8a657",D="#e06c6c"; // realized / wasted / distorted
  var ROOMS=["phonghoc","san","cangtin","lab","phongmay","xuong","kytucxa","vuon","hoitruong"];
  function el(id){return document.getElementById(id);}
  var iv=setInterval(function(){
    if(!(window.__test&&window.__ui&&window.HVS&&window.__test.config)) return;
    clearInterval(iv); try{ build(); }catch(e){ document.title="LAB_FAIL "+e.message; }
  },60);

  function presetLabel(CFG,k){ var p=CFG.PRESETS[k]; return (p&&(p.name||p.label))?(p.name||p.label)+" ("+k+")":k; }

  function build(){
    var CFG=__test.config(), presets=Object.keys(CFG.PRESETS);
    var box=document.createElement("div"); box.id="LABUI";
    box.innerHTML=
      '<button class="sec min" id="lab_min">Ẩn ▾</button>'+
      '<h1>🎮 Gameplay Lab — Học viện Steve</h1>'+
      '<div class="sub">A graphics-free read of the sim. Run a school, read who it realized and who it wasted. (Generated from the live engine by ./lab.sh)</div>'+
      '<div class="row">'+
        '<label>Trường (archetype)<select id="lab_arch">'+Object.keys(CFG.ARCHETYPES||{}).map(function(k){return '<option value="'+k+'">'+(CFG.ARCHETYPES[k].name)+'</option>';}).join('')+'</select></label>'+
        '<label>Triết lý (preset)<select id="lab_preset">'+presets.map(function(k){return '<option value="'+k+'">'+presetLabel(CFG,k)+'</option>';}).join('')+'</select></label>'+
        '<label>Lối học (structure)<select id="lab_struct">'+Object.keys(CFG.STRUCT_META||{mid:1}).map(function(k){return '<option value="'+k+'"'+(k==="mid"?" selected":"")+'>'+((CFG.STRUCT_META&&CFG.STRUCT_META[k]&&CFG.STRUCT_META[k].label)||k)+'</option>';}).join('')+'</select></label>'+
        '<label>Seed<input id="lab_seed" type="number" value="11" style="width:80px"></label>'+
        '<label>Số năm<input id="lab_years" type="number" value="12" style="width:70px"></label>'+
        '<label>Số seed (phân bố)<input id="lab_seeds" type="number" value="8" style="width:80px"></label>'+
        '<label style="flex-direction:row;align-items:center;gap:6px;color:#efe6d6"><input id="lab_mentor" type="checkbox"> Mentor</label>'+
        '<button id="lab_run">▶ Chạy 1 trường</button>'+
        '<button class="sec" id="lab_dist">📊 Phân bố (K seed)</button>'+
        '<button class="sec" id="lab_cmp">⚖ So sánh presets</button>'+
      '</div>'+
      '<div id="lab_out"><div class="sub">Chọn một triết lý và bấm <b>Chạy</b>.</div></div>';
    document.body.appendChild(box);
    el("lab_run").onclick=runOne; el("lab_dist").onclick=runDist; el("lab_cmp").onclick=runCmp;
    var hidden=false; el("lab_min").onclick=function(){ hidden=!hidden;
      box.style.background=hidden?"transparent":"#14110d"; box.style.pointerEvents=hidden?"none":"auto";
      [].forEach.call(box.children,function(c){ if(c.id!=="lab_min") c.style.display=hidden?"none":""; });
      el("lab_min").style.pointerEvents="auto"; el("lab_min").textContent=hidden?"Hiện ▴":"Ẩn ▾"; };
    // verification / deep-link auto-run: ?labauto=preset,seed,years
    var m=/labauto=([^&]+)/.exec(location.search);
    if(m){ var a=decodeURIComponent(m[1]).split(","); if(a[0])el("lab_preset").value=a[0];
      if(a[1])el("lab_seed").value=a[1]; if(a[2])el("lab_years").value=a[2];
      try{ runOne(); document.title="LAB_OK"; }catch(e){ document.title="LAB_FAIL "+e.message; } }
  }

  function cfg(){return __test.config();}
  function simulate(preset,seed,years,mentor,arch,struct){
    try{ ARCH_OVERRIDE = arch||null; }catch(e){} // L2: start in the chosen geographic archetype (economy + prestige + cohort origin-mix); freshState reads ARCH_OVERRIDE
    __test.fresh(seed); try{ ARCH_OVERRIDE = null; }catch(e){} // restore so it doesn't leak to other runs
    var S=HVS.S(); S.META=S.META||{}; S.META.tutorial=true;
    S.presets={n1:preset,n2:preset,n3:preset,n4:preset}; S.speed=0; // freeze the live clock; we advance explicitly (preset = the teaching policy you're testing, on top of the archetype's economy/class)
    if(struct){ S.struct={n1:struct,n2:struct,n3:struct,n4:struct}; } // iter-249: the STRUCTURE axis (Axis B of the dial) — watch how drill↔autonomy re-weights spark vs sky
    ROOMS.forEach(function(k){try{HVS.autoPlace(k);}catch(e){}});
    var CFG=cfg(), per=[];
    // iter-263 — keep the Lab DYNAMIC: capture the new IN-PLAY narrative beats as they fire (era-boundary eraFlood 🌊 /
    // eraShock 〽️ / era shift 🕰️, and the full-ledger grief 🖐️) so the owner can READ the prose the new systems emit
    // during a run, not just the final essay. Hooks the global news() for the duration, then restores it.
    var beats=[], _news=null; try{ _news=news; news=function(s){ try{ if(/^🌊|^〽️|^🕰️|^🖐️/.test(s)) beats.push({year:S.year,s:s}); }catch(e){} return _news(s); }; }catch(e){}
    for(var y=0;y<years;y++){
      if(mentor){ try{ var free=CFG.MENTOR_SLOTS-HVS.mentorCount();
        if(free>0){ var cand=S.students.filter(function(x){return !x.mentored;}).sort(function(a,b){
          return (1-CFG.MATCH(b.tell,S.presets["n"+b.grade]))*b.seed-(1-CFG.MATCH(a.tell,S.presets["n"+a.grade]))*a.seed;});
          for(var i=0;i<free&&i<cand.length;i++) HVS.mentorStudent(cand[i].id); } }catch(e){} }
      __test.days(360); S.pendingEvent=null; S.pendingContract=null; per.push(snap(S));
    }
    try{ if(_news) news=_news; }catch(e){} // restore the real news()
    return {S:S,per:per,beats:beats};
  }
  function eraName(S){ try{ return cfg().ERAS[eraIndex(S.year)].name; }catch(e){ return ""; } } // L1: which decade this year sits in
  function snap(S){ return { year:S.year, era:eraName(S), cash:Math.round(S.cash||0), stu:(S.students||[]).length,
    grad:(S.META&&S.META.graduated)||0, alu:(S.alumni||[]).length,
    TT:Math.round(S.tiengTam||0), UT:Math.round(S.uyTin||0), TC:Math.round(S.thucChat||0) }; }
  function classify(S){
    var CFG=cfg(), o={realized:0,wasted:0,distorted:0}, byState={};
    (S.alumni||[]).forEach(function(a){ var st=a.state; byState[st]=(byState[st]||0)+1; var c="";
      try{ c=realClass(st,a.fs.seed); }catch(e){}
      if(c==="bent"||st==="CA_MAP_COIN"||st==="BI_BAT") o.distorted++;
      else if(c==="loud"||st==="THAT_NGHIEP"||st==="VAN_MAU") o.wasted++;
      else o.realized++; });
    return {o:o,byState:byState,n:(S.alumni||[]).length};
  }
  function money(n){ if(Math.abs(n)>=1000) return (n/1000).toFixed(2)+" tỷ"; return n+" tr"; }
  function bar(o){ var t=o.realized+o.wasted+o.distorted||1;
    function seg(v,c){return v?'<i style="width:'+(v/t*100)+'%;background:'+c+'"></i>':'';}
    return '<div class="bar">'+seg(o.realized,R)+seg(o.wasted,W)+seg(o.distorted,D)+'</div>'+
      '<div class="lg"><span class="r">● realized '+o.realized+'</span><span class="w">● wasted '+o.wasted+'</span><span class="d">● distorted '+o.distorted+'</span></div>'; }
  function chip(st){ try{ return cfg().ALUM.CHIPS[st]||st; }catch(e){ return st; } }
  function archName(k){ try{ return (cfg().ARCHETYPES[k]||{}).name||k; }catch(e){ return k; } }
  // L2 DEMOGRAPHIC read — the cohort's class mix + how each origin fared (realize = flourish≥4). Shows the school-as-equalizer.
  function originDist(S){ var t={ngheo:{g:0,r:0},tb:{g:0,r:0},kha:{g:0,r:0}};
    (S.alumni||[]).forEach(function(a){ var o=a.fs&&a.fs.origin; if(t[o]){ t[o].g++; try{ if(flourishOf(a.state)>=4) t[o].r++; }catch(e){} } });
    function pc(o){ return t[o].g?Math.round(100*t[o].r/t[o].g):0; }
    return 'nghèo '+t.ngheo.g+' ('+pc('ngheo')+'% nên người) · tb '+t.tb.g+' ('+pc('tb')+'%) · khá '+t.kha.g+' ('+pc('kha')+'%)'; }

  // iter-249 — surface the EDUCATION-epic systems: the cohort's KHOA mix (incl. the everyman's Đại cương) + how the
  // grain-less majority (tell="") fared (realize = flourish≥4 → steady kỹ-thuật-viên). The dynamic-Lab window into Phase 2.
  function majorDist(S){ var t={}; (S.students||[]).forEach(function(s){ var m=HVS.studentMajor?HVS.studentMajor(s):null; var k=m?m.key:"(chưa khoa)"; t[k]=(t[k]||0)+1; });
    return Object.keys(t).map(function(k){ var nm=(cfg().MAJORS.filter(function(m){return m.key===k;})[0]||{}).name||k; return nm+' '+t[k]; }).join(' · ')||'—'; }
  function everymanRead(S){ var g=0,r=0; (S.alumni||[]).forEach(function(a){ if(((a.fs&&a.fs.tell)||"")===""){ g++; try{ if(flourishOf(a.state)>=4) r++; }catch(e){} } });
    return g?(g+' em chưa rõ năng khiếu → '+Math.round(100*r/g)+'% nên người (Đại cương)'):'—'; }
  function runOne(){
    var arch=el("lab_arch")?el("lab_arch").value:null;
    var preset=el("lab_preset").value, seed=+el("lab_seed").value, years=+el("lab_years").value, mentor=el("lab_mentor").checked;
    var struct=el("lab_struct")?el("lab_struct").value:"mid";
    var r=simulate(preset,seed,years,mentor,arch,struct), S=r.S, last=r.per[r.per.length-1]||snap(S), cl=classify(S);
    var states=Object.keys(cl.byState).sort(function(a,b){return cl.byState[b]-cl.byState[a];});
    var bio=""; try{ bio=__ui._essayText(); }catch(e){ bio="(epilogue chưa sẵn — "+e.message+")"; }
    el("lab_out").innerHTML=
      '<div class="cols">'+
        '<div class="card"><h2>Run summary</h2><table>'+
          row("Trường (archetype)",archName(arch||(S&&S.archetype)))+
          row("Triết lý",presetLabel(cfg(),preset))+row("Seed/Năm/Mentor",seed+" / "+years+" / "+(mentor?"có":"không"))+
          row("Lối học (structure)",(cfg().STRUCT_META&&cfg().STRUCT_META[struct]&&cfg().STRUCT_META[struct].label)||struct)+
          row("Khoa (cohort cuối)",majorDist(S))+
          row("Đại cương (everyman)",everymanRead(S))+
          row("Thời đại (đầu→cuối)",(function(){var seen=[];r.per.forEach(function(p){if(p.era&&seen[seen.length-1]!==p.era)seen.push(p.era);});return seen.join(" → ")||eraName(S);})())+
          row("Xuất thân (nghèo/tb/khá → nên người)",originDist(S))+
          row("Tiền cuối",money(last.cash))+row("Sinh viên",last.stu)+row("Tốt nghiệp",last.grad)+row("Cựu SV",last.alu)+
          row("Tiếng Tăm / Uy Tín / Thực Chất",last.TT+" / "+last.UT+" / "+last.TC)+
        '</table></div>'+
        '<div class="card"><h2>Outcome distribution (this run)</h2>'+bar(cl.o)+
          '<table style="margin-top:8px">'+states.map(function(st){return row(chip(st),cl.byState[st]);}).join('')+'</table></div>'+
      '</div>'+
      '<div class="card"><h2>Per-year arc</h2><table>'+
        '<tr><th>Năm</th><th>Thời đại</th><th>Tiền</th><th>SV</th><th>TN</th><th>Cựu</th><th>TT</th><th>UT</th><th>TC</th></tr>'+
        r.per.map(function(p){return '<tr><td>'+p.year+'</td><td style="font-size:11px;color:#888">'+esc(p.era||"")+'</td><td>'+money(p.cash)+'</td><td>'+p.stu+'</td><td>'+p.grad+'</td><td>'+p.alu+'</td><td>'+p.TT+'</td><td>'+p.UT+'</td><td>'+p.TC+'</td></tr>';}).join('')+
      '</table></div>'+
      '<div class="card"><h2>Diễn biến trong trận — các nhịp kể (era-boundary · đời)</h2><div class="bio">'+
        ((r.beats&&r.beats.length)? r.beats.map(function(b){return '<div style="margin:4px 0"><b style="color:#8a7;font-size:11px">Năm '+b.year+'</b> &nbsp;'+esc(b.s)+'</div>';}).join('')
          : '<span style="color:#888">(không có nhịp era/đời nào nổi lên trong khoảng này — thử chạy đủ ≥4 năm để bắc qua một mốc thời đại, bật Mentor để thấy nhịp “hết tay”)</span>')+
      '</div></div>'+
      '<div class="card"><h2>Biographies — who became who</h2><div class="bio">'+esc(bio)+'</div></div>';
  }
  function runDist(){
    var arch=el("lab_arch")?el("lab_arch").value:null;
    var preset=el("lab_preset").value, years=+el("lab_years").value, mentor=el("lab_mentor").checked, K=+el("lab_seeds").value;
    var struct=el("lab_struct")?el("lab_struct").value:"mid";
    var agg={realized:0,wasted:0,distorted:0}, rows=[];
    for(var s=0;s<K;s++){ var r=simulate(preset,1+s*7,years,mentor,arch,struct), c=classify(r.S);
      agg.realized+=c.o.realized; agg.wasted+=c.o.wasted; agg.distorted+=c.o.distorted;
      rows.push({seed:1+s*7,o:c.o,n:c.n}); }
    el("lab_out").innerHTML='<div class="card"><h2>Distribution — '+presetLabel(cfg(),preset)+' × '+K+' seeds</h2>'+bar(agg)+
      '<table style="margin-top:8px"><tr><th>Seed</th><th>realized</th><th>wasted</th><th>distorted</th><th>cựu SV</th></tr>'+
      rows.map(function(r){return '<tr><td>'+r.seed+'</td><td class="r">'+r.o.realized+'</td><td class="w">'+r.o.wasted+'</td><td class="d">'+r.o.distorted+'</td><td>'+r.n+'</td></tr>';}).join('')+'</table>'+
      '<div class="sub" style="margin-top:8px">Open-question check: every preset should reach BOTH realized and wasted lives; no preset should be waste-free or realize-free.</div></div>';
  }
  function runCmp(){
    var arch=el("lab_arch")?el("lab_arch").value:null;
    var years=+el("lab_years").value, mentor=el("lab_mentor").checked, K=Math.max(3,Math.min(6,+el("lab_seeds").value)), CFG=cfg(), presets=Object.keys(CFG.PRESETS);
    var struct=el("lab_struct")?el("lab_struct").value:"mid";
    var out=presets.map(function(p){ var agg={realized:0,wasted:0,distorted:0};
      for(var s=0;s<K;s++){ var c=classify(simulate(p,1+s*7,years,mentor,arch,struct).S);
        agg.realized+=c.o.realized; agg.wasted+=c.o.wasted; agg.distorted+=c.o.distorted; }
      return {p:p,o:agg}; });
    el("lab_out").innerHTML='<div class="card"><h2>Compare presets × '+K+' seeds each</h2>'+
      out.map(function(x){return '<div style="margin-bottom:12px"><b>'+presetLabel(CFG,x.p)+'</b>'+bar(x.o)+'</div>';}).join('')+
      '<div class="sub">If one preset is all-green (no waste) or another all-red, the open question is broken — that\'s the thing to fix.</div></div>';
  }

  function row(k,v){return '<tr><td>'+esc(""+k)+'</td><td>'+esc(""+v)+'</td></tr>';}
  function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
})();
</script>
HTML
echo "Gameplay Lab regenerated → $PWD/$OUT"
if command -v open >/dev/null 2>&1; then open "$OUT"; else echo "Open $PWD/$OUT in a browser."; fi
