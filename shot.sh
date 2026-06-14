#!/usr/bin/env bash
# __shot.sh — headless screenshot of the live campus (Kenney tiles + buildings + Jephed characters).
# Waits for art assets to finish loading, seeds a populated school, settles the actors into a class
# period, paints one live frame, then captures. Usage: ./__shot.sh <out.png> <W> <H> [period]
set -euo pipefail
cd "$(dirname "$0")"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT="${1:-/tmp/campus.png}"; W="${2:-420}"; H="${3:-900}"; PERIOD="${4:-2}"; ZOOM="${ZOOM:-0}"
TMP="__shot_run.html"
trap 'rm -f "$TMP"' EXIT
cp index.html "$TMP"
cat >> "$TMP" <<HTML
<style>#modalRoot{display:none!important}</style>
<script>
(function(){
  var P=$PERIOD;
  var iv=setInterval(function(){
    var a; try{ a=window.__ui._assetsReady(); }catch(e){ return; }
    if(!(a && a.tiles && a.chars>=10)) return;   // wait for Kenney tiles + Jephed sheets
    clearInterval(iv);
    try{ // seed AFTER boot has run (boot fires on DOMContentLoaded, after this inline script) so it isn't reset
      window.__test.fresh(11); var s=HVS.S(); s.META.tutorial=true;
      ["phonghoc","san","cangtin","lab","phongmay","xuong","kytucxa","vuon","hoitruong"].forEach(function(k){try{HVS.autoPlace(k);}catch(e){}});
      for(var c=0;c<14;c++){ window.__test.days(60); var st=HVS.S(); st.pendingEvent=null; st.pendingContract=null; }
      window.__ui.setPeriod(P); window.__ui._sync(true); window.__ui._settle(1600); window.__ui._renderLiveOnce(P, 52000);
      if("$ZOOM"==="1"){ var z=3, b=document.createElement("canvas"); b.width=390*z; b.height=312*z; b.style.cssText="position:fixed;left:0;top:0;z-index:9999;image-rendering:pixelated";
        var bx=b.getContext("2d"); bx.imageSmoothingEnabled=false; bx.drawImage(document.getElementById("mapStatic"),0,0,390*z,312*z); bx.drawImage(document.getElementById("mapLive"),0,0,390*z,312*z);
        document.body.appendChild(b); }
      document.title="SHOTREADY chars="+a.chars+" rooms="+HVS.S().rooms.length+" stu="+HVS.S().students.length;
    }catch(e){ document.title="SHOTFAIL: "+e.message; }
  },50);
})();
</script>
HTML
"$CHROME" --headless --disable-gpu --force-device-scale-factor=2 --hide-scrollbars \
  --virtual-time-budget=15000 --window-size="$W,$H" --screenshot="$OUT" "$TMP" 2>/dev/null
echo "wrote $OUT ($(sips -g pixelWidth -g pixelHeight "$OUT" 2>/dev/null | tail -2 | tr '\n' ' '))"
