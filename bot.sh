#!/usr/bin/env bash
# bot.sh — full-game IN-BROWSER smoke test (UI + engine together), the layer gate.js/sweep.js can't reach.
# Boots the real game headless, plays ~11 years via __test.days in chunks, and on EVERY chunk re-renders all
# five tabs + a live frame + cycles weather — so a render crash on evolved late-game state surfaces as JSERR.
# Asserts core progression actually happened (rooms built · students enrolled · graduates · alumni · year 11).
# Catches what engine-only harnesses miss: dead selectors, panel render bugs, draw-layer crashes.
#
# Usage: ./bot.sh         (exit 0 = BOTOK, 1 = fail)   ·   CHROME=/path/to/chrome ./bot.sh
set -euo pipefail
cd "$(dirname "$0")"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || { echo "bot.sh: Chrome not found at \"$CHROME\" — set CHROME=/path/to/chrome"; exit 2; }

TMP="__bot_run.html"
trap 'rm -f "$TMP"' EXIT
cp index.html "$TMP"
cat >> "$TMP" <<'HTML'
<script>
setTimeout(function(){
 try {
  window.__test.fresh(11);
  var s = HVS.S(); s.META.tutorial = true;
  ["phonghoc","san","cangtin","lab","phongmay","xuong","kytucxa","vuon","hoitruong"].forEach(function(k){ try{ HVS.autoPlace(k); }catch(e){} });
  var roomsBuilt = HVS.S().rooms.length, sawStudents = 0;
  var tabs = ["ops","stu","alum","fund","info"], weathers = ["clear","rays","rain"];
  for (var c=0; c<66; c++){                                  // 66 * 60 dayTicks = 11 years (DPM 30 * 12)
    window.__test.days(60);
    var st = HVS.S();
    if (st.students.length > sawStudents) sawStudents = st.students.length;
    st.pendingEvent = null; st.pendingContract = null;       // let the auto-resolvers + these clear any prompt
    tabs.forEach(function(t){ try{ window.__ui.setTab(t); }catch(e){ throw new Error("tab "+t+": "+e.message); } });
    window.__ui._sync(true);
    window.__ui.setWeather(weathers[c % 3]);
    window.__ui._renderLiveOnce(c % 5, 50000 + c*1000);
    if (/JSERR/.test(document.title)) throw new Error("midplay "+document.title);
  }
  var fin = HVS.S();
  var log = "rooms="+roomsBuilt+" maxStu="+sawStudents+" grad="+fin.META.graduated+" alumni="+fin.alumni.length+
            " yr="+fin.year+" cash="+Math.round(fin.cash)+" steves="+(fin.META.steves||0)+" arrested="+(fin.META.arrested||0);
  var pass = roomsBuilt>0 && sawStudents>0 && fin.META.graduated>0 && fin.alumni.length>1 && fin.year>=10 && !/JSERR/.test(document.title);
  document.title = (pass ? "BOTOK " : "BOTFAIL ") + log;
 } catch(e){ document.title = "BOTFAIL: " + e.message; }
}, 700);
</script>
HTML

TITLE="$("$CHROME" --headless --disable-gpu --virtual-time-budget=40000 --dump-dom "$TMP" 2>/dev/null | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g')"
echo "$TITLE"
case "$TITLE" in
  BOTOK*) exit 0 ;;
  *) echo "bot.sh: FAILED"; exit 1 ;;
esac
