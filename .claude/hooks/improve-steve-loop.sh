#!/usr/bin/env bash
# improve-steve autonomous loop trigger (Stop hook).
#
# While the flag file exists, BLOCK the stop and re-inject the next-iteration
# instruction, so the improve-steve loop keeps running without the owner.
# When the flag is absent, do nothing → the session stops normally.
#
#   START the loop:           touch /Users/Admin/Desktop/coding/.improve-steve-on
#   STOP the loop (kill sw):  rm    /Users/Admin/Desktop/coding/.improve-steve-on
#
# Fail-safe: any error exits 0 and emits no decision, so a broken hook can
# never wedge a session — it just lets Claude stop.
FLAG="/Users/Admin/Desktop/coding/.improve-steve-on"
if [ -f "$FLAG" ]; then
  printf '%s' '{"decision":"block","reason":"The improve-steve autonomous loop is ON (flag '"$FLAG"' is present). Start the NEXT iteration now: invoke the improve-steve skill and run one full loop iteration per its SKILL.md (Step 0 orient → choose → implement → verify → ship → evolve). When the EVOLUTION engine is wired, honor FIRINGS_SINCE_FRAME_RESET in ROADMAP ## Cadence. Owner kill switch: rm '"$FLAG"'"}'
fi
exit 0
