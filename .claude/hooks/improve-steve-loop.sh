#!/usr/bin/env bash
# improve-steve autonomous loop trigger (Stop hook) — GAMEPLAY-FIRST aware.
#
# While a flag file exists, BLOCK the stop and re-inject the next-iteration instruction so the loop
# keeps running unattended. Absent flag → do nothing (session stops normally).
#
# RUN IT from inside this folder (steve-job-vietnam is its own git root, so it loads THIS hook and is
# isolated from the coding-level hook / the atlas loop).
#
#   GAMEPLAY-FIRST phase (graphics frozen, headless-only):
#       START: touch /Users/Admin/Desktop/coding/.improve-steve-gameplay-on   -> runs /improve-steve-gameplay
#       STOP : rm    /Users/Admin/Desktop/coding/.improve-steve-gameplay-on
#   LEGACY graphics-aware phase:
#       START: touch /Users/Admin/Desktop/coding/.improve-steve-on            -> runs /improve-steve
#       STOP : rm    /Users/Admin/Desktop/coding/.improve-steve-on
#
# The gameplay flag is intentionally a DIFFERENT name than .improve-steve-on so the coding-level hook
# (which checks .improve-steve-on ahead of .improve-atlas-on) never reacts to it -> the atlas loop is
# never hijacked.
#
# Per-session opt-out (exempt one session from the loop): set CLAUDE_NO_LOOP=1, or
#   touch /Users/Admin/Desktop/coding/.claude/loop-optout/<session_id>
#
# Fail-safe: any error exits 0 with no decision, so a broken hook can never wedge a session.
set +e
D="/Users/Admin/Desktop/coding"
sid="${CLAUDE_CODE_SESSION_ID:-}"
if [ -n "$CLAUDE_NO_LOOP" ] || { [ -n "$sid" ] && [ -f "$D/.claude/loop-optout/$sid" ]; }; then exit 0; fi
GFLAG="$D/.improve-steve-gameplay-on"
LFLAG="$D/.improve-steve-on"
if [ -f "$GFLAG" ]; then
  printf '%s' '{"decision":"block","reason":"The improve-steve GAMEPLAY-FIRST loop is ON (flag '"$GFLAG"' present). Start the NEXT iteration now: invoke the improve-steve-gameplay skill and run ONE full iteration per its SKILL.md — orient (ROADMAP + feedback.md) -> pick the biggest gameplay/story/LATTICE move -> implement -> VERIFY HEADLESS ONLY (gate.sh + sweep.js + bot.sh + lives.sh; NO screenshots / NO 390px / NO gallery — graphics are FROZEN) -> record (CHANGELOG + ROADMAP) -> continue. Kill switch: rm '"$GFLAG"'"}'
elif [ -f "$LFLAG" ]; then
  printf '%s' '{"decision":"block","reason":"The improve-steve (graphics-aware) loop is ON (flag '"$LFLAG"' present). Start the NEXT iteration now: invoke the improve-steve skill and run one full loop iteration per its SKILL.md (Step 0 orient -> choose -> implement -> verify -> ship -> evolve). Kill switch: rm '"$LFLAG"'"}'
fi
exit 0
