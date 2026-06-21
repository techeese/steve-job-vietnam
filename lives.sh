#!/usr/bin/env bash
# lives.sh — headless biography emitter for the Evolution Engine's L2 critic.
# Plays a school under one philosophy preset to graduation (~12 sim-years), then prints the REAL
# player-facing epilogue essay (named biographies + gift-stars + the "tài năng bỏ phí" waste lines).
# This is the critic's BIOGRAPHY-READ sensor (THESIS §D marks 1/2/4 — become someone · care by name ·
# own answer). Run it under SEVERAL presets to read whether different philosophies produce different
# felt lives (part of mark 5 — did the fork carry real, uncertain stakes?).
#
#   Usage: ./lives.sh [preset] [seed] [mentor] [arch]
#     preset : canbang | luyende | duan | ... (a CONFIG.PRESETS key; default luyende)
#     seed   : integer RNG seed (default 11)
#     mentor : 1 to pour scarce mentor attention each year (default 0)
#     arch   : geographic archetype (tinh_le | que_ngheo | lo_thanhpho | truong_nghe; default = baseline) — iter-221:
#              read whether a DIFFERENT starting school produces different felt lives (exit-gate (b): archetype × era soul)
set -euo pipefail
cd "$(dirname "$0")"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || { echo "lives.sh: Chrome not found at \"$CHROME\" — set CHROME=/path/to/chrome"; exit 2; }
PRESET="${1:-luyende}"; SEED="${2:-11}"; MENTOR="${3:-0}"; ARCH="${4:-}"
TMP="__lives_run.html"
trap 'rm -f "$TMP"' EXIT
# ⚠ iter-223 gotcha (verified): DO NOT loop lives.sh inside one shell. Chrome headless keeps a SINGLETON alive for the
# duration of a shell session, so successive in-loop invocations render against the FIRST run's state → STALE, IDENTICAL
# reads (NOT a game bug — confirmed the sim varies correctly per seed/arch when each run is a SEPARATE shell invocation).
# To compare schools, call lives.sh once per command (separate invocations). (--user-data-dir isolates but leaks orphan
# Chrome procs and a sleep between in-loop runs does NOT help — only a fresh shell does.)
cp index.html "$TMP"
cat >> "$TMP" <<HTML
<script>
(function(){
  var MK="===LIVES_";   // split so the sentinel only appears at RUNTIME in the <pre>, never in this source
  var iv=setInterval(function(){
    if(!(window.__test && window.__ui && window.HVS)) return;
    clearInterval(iv);
    try{
      try{ localStorage.clear(); }catch(e){}                // iter-223: headless Chrome can share localStorage across rapid runs — clear any leaked SAVE so this run is isolated (fresh() below overrides S anyway; this stops it persisting forward)
      try{ if("$ARCH") ARCH_OVERRIDE="$ARCH"; }catch(e){}   // iter-221: pin the geographic archetype (economy + cohort origin-mix)
      window.__test.fresh($SEED);
      try{ ARCH_OVERRIDE=null; }catch(e){}                  // restore so it can't leak
      var s=HVS.S(); s.META.tutorial=true;
      s.presets={n1:"$PRESET",n2:"$PRESET",n3:"$PRESET",n4:"$PRESET"};
      ["phonghoc","san","cangtin","lab","phongmay","xuong","kytucxa","vuon","hoitruong"].forEach(function(k){try{HVS.autoPlace(k);}catch(e){}});
      for(var y=0;y<12;y++){                       // ~12 sim-years so graduates + alumni exist (first 🍎 ~yr 6)
        var st=HVS.S();
        if($MENTOR){ try{                          // fill mentor slots: most-mismatched × highest-gift first
          var CFG=window.__test.config(), free=CFG.MENTOR_SLOTS-HVS.mentorCount();
          if(free>0){
            var cand=st.students.filter(function(x){return !x.mentored;}).sort(function(a,b){
              return (1-CFG.MATCH(b.tell,st.presets["n"+b.grade]))*b.seed-(1-CFG.MATCH(a.tell,st.presets["n"+a.grade]))*a.seed;});
            for(var m=0;m<free && m<cand.length;m++) HVS.mentorStudent(cand[m].id);
          }
        }catch(e){} }
        window.__test.days(360);                   // one sim-year (DAYS_PER_MONTH 30 × 12)
        st.pendingEvent=null; st.pendingContract=null;
      }
      var txt=window.__ui._essayText();
      var pre=document.createElement("pre"); pre.id="LIVESOUT";
      pre.textContent=MK+"BEGIN===\n"+txt+"\n"+MK+"END===";
      document.body.appendChild(pre); document.title="LIVESREADY";
    }catch(e){
      var p=document.createElement("pre"); p.id="LIVESOUT";
      p.textContent=MK+"BEGIN===\nLIVESFAIL "+e.message+"\n"+MK+"END==="; document.body.appendChild(p);
      document.title="LIVESFAIL";
    }
  },50);
})();
</script>
HTML
DOM="$("$CHROME" --headless --disable-gpu --virtual-time-budget=30000 --dump-dom "$TMP" 2>/dev/null)"
echo "# Học viện Steve — biographies under preset='$PRESET' seed=$SEED mentor=$MENTOR arch='${ARCH:-baseline}'"
printf '%s\n' "$DOM" \
  | awk '/===LIVES_END===/{f=0} f{print} /===LIVES_BEGIN===/{f=1}' \
  | sed -e 's/&amp;/\&/g' -e "s/&#39;/'/g" -e 's/&quot;/"/g' -e 's/&lt;/</g' -e 's/&gt;/>/g'
