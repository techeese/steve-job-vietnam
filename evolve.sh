#!/usr/bin/env bash
# evolve.sh — the Evolution Engine's SLOW BEAT (L2). Spawns an INPUT-BLIND critic in a fresh context
# (a different model line than the producer, to ease the same-class ceiling), hands it only THESIS.md +
# the live artifacts, HARD-DENIES it the success narrative (ROADMAP/CHANGELOG/VISION/DESIGN/SKILL/memory),
# and has it run all three sensors itself (sweep + lives.sh biographies + cross-preset play read). It
# returns the single biggest THESIS-anchored gap — or honestly "frame holds". On a real gap, evolve.sh
# writes it to the TOP of ROADMAP ## Epic backlog as an [EVOLUTION] entry + an OWNER: veto line, logs it
# to ## Frame-reset log, and resets FIRINGS_SINCE_FRAME_RESET. Anchor-or-reject: no gap ⇒ no forced epic.
#
#   Usage (ASYNC — the ONLY supported model): run in the BACKGROUND, never block on it.
#     CRITIC_TIMEOUT=1800 ./evolve.sh &        # fire-and-forget; harvest the gap from ROADMAP next firing
#   The critic genuinely takes 15–35 min (reads THESIS + source + runs sweep + 3× lives.sh + reasons). It is
#   the SLOW beat — DO NOT foreground-block on it (proven 2026-06-15: a blocking run wedges the loop and a
#   short cap kills it before any verdict). Launch it, do other work, and on a LATER firing read the new
#   [EVOLUTION] entry it wrote to ## Epic backlog (or the ## Frame-reset log "frame holds" line). Since the
#   iter-173 hardening (critic is SENSORS-ONLY: no write/exec/git/network), backgrounding it is safe — it
#   cannot commit, push, or touch the tree; only evolve.sh's own node helper writes the gap when the critic returns.
#   (CRITIC_MODEL=opus to raise the critic tier.)
# Fail-safe: any failure prints a warning and leaves the tree untouched — it can never wedge the loop.
set -uo pipefail
cd "$(dirname "$0")"
ROADMAP="ROADMAP.md"
CRITIC_MODEL="${CRITIC_MODEL:-sonnet}"     # a different family member than the opus producer = weak input-independence gain (residual risk #3)
CRITIC_TIMEOUT="${CRITIC_TIMEOUT:-720}"    # iter-173: HARD cap (s) — a runaway critic once ran 35+ min and wedged the loop; bound it always
STAMP="$(date +%Y-%m-%d 2>/dev/null || echo 0000-00-00)"
CRITIC_OUT="/tmp/evolve-critic-$STAMP.txt"
GAP_FILE="/tmp/evolve-gap-$STAMP.txt"

command -v claude >/dev/null 2>&1 || { echo "evolve.sh: 'claude' CLI not found — cannot run the critic."; exit 0; }
[ -f critic-prompt.md ] && [ -f THESIS.md ] || { echo "evolve.sh: missing critic-prompt.md or THESIS.md."; exit 0; }

echo "evolve.sh: spawning the input-blind critic ($CRITIC_MODEL) — it will run sweep + lives.sh itself (≤ ${CRITIC_TIMEOUT}s)…"
# The critic gets Read (THESIS + game source) + Bash to run the SENSORS ONLY; it is hard-denied the success narrative.
# iter-173 SECURITY FIX: the allowlist used to include "Bash(node:*)", which let a critic run `node -e` — i.e. arbitrary
# code (fs writes + child_process git) — and one critic USED it to commit+push a (buggy) feature to main, breaking the
# live epilogue. The critic must only READ + run the two named sensors. node is pinned to `node sweep.js` (exact), NOT
# node:* ; everything not allowlisted is denied by default, so write/git/exec are impossible. NEVER re-add node:*.
claude -p --model "$CRITIC_MODEL" \
  --allowedTools "Read" "Bash(node sweep.js)" "Bash(./lives.sh:*)" "Bash(ls:*)" \
  --disallowedTools \
    "Read(./ROADMAP.md)" "Read(ROADMAP.md)" "Read(**/ROADMAP.md)" \
    "Read(./CHANGELOG.md)" "Read(CHANGELOG.md)" \
    "Read(./VISION.md)" "Read(VISION.md)" \
    "Read(./DESIGN.md)" "Read(DESIGN.md)" "Read(./CONVERSION-SPEC.md)" \
    "Read(**/SKILL.md)" "Read(**/memory/**)" "Read(**/.claude/**)" \
    "Bash(node:*)" "Bash(git:*)" "Write" "Edit" "Bash(rm:*)" "Bash(curl:*)" \
  < critic-prompt.md > "$CRITIC_OUT" 2>/dev/null &
CPID=$!
# Portable watchdog (macOS ships no GNU `timeout`): kill the critic if it blows the cap, so it can NEVER wedge the loop.
( sleep "$CRITIC_TIMEOUT"; kill -0 "$CPID" 2>/dev/null && { echo "evolve.sh: critic exceeded ${CRITIC_TIMEOUT}s — killing"; kill -TERM "$CPID" 2>/dev/null; sleep 3; kill -9 "$CPID" 2>/dev/null; } ) &
WPID=$!
wait "$CPID" 2>/dev/null; RC=$?
kill "$WPID" 2>/dev/null  # cancel the watchdog if the critic finished on time
wait "$WPID" 2>/dev/null || true
if [ $RC -ne 0 ] || [ ! -s "$CRITIC_OUT" ]; then
  echo "evolve.sh: critic run failed (rc=$RC) or empty output — counter NOT reset, will retry next beat. See $CRITIC_OUT"
  exit 0
fi

# Extract the machine-readable gap block (the critic ends its reply with it).
awk '/===GAP_END===/{f=0} f{print} /===GAP_BEGIN===/{f=1}' "$CRITIC_OUT" > "$GAP_FILE"
if [ ! -s "$GAP_FILE" ]; then
  echo "evolve.sh: critic produced no parseable ===GAP=== block — counter NOT reset, will retry. Full reply: $CRITIC_OUT"
  exit 0
fi

# Hand the block + roadmap to a node helper (robust to unicode / quotes in the gap text).
ROADMAP_PATH="$ROADMAP" EV_STAMP="$STAMP" GAP_FILE="$GAP_FILE" CRITIC_OUT="$CRITIC_OUT" node -e '
  var fs = require("fs");
  var rm = process.env.ROADMAP_PATH, stamp = process.env.EV_STAMP;
  var block = fs.readFileSync(process.env.GAP_FILE, "utf8");
  function field(k){ var m = block.match(new RegExp("^"+k+":[ \\t]*(.*)$", "m")); return m ? m[1].trim() : ""; }
  var exists = /^yes/i.test(field("GAP_EXISTS"));
  var title = field("TITLE") || "(untitled)";
  var mark = field("MARK"), jump = field("THE_JUMP"), wrong = field("WRONG_HILL");
  var evid = field("EVIDENCE"), mark5 = field("MARK5_STATUS"), conf = field("CONFIDENCE");
  var src = fs.readFileSync(rm, "utf8");

  // 1) reset the firing counter (the beat has fired)
  src = src.replace(/(`FIRINGS_SINCE_FRAME_RESET:\s*)\d+(`)/, "$1" + "0" + "$2");

  // 2) frame-reset log entry
  var logLine = "- " + stamp + " — " + (exists ? "GAP" : "frame holds") + " · " + title
    + " · §D mark " + (mark||"—") + " · mark5=" + (mark5||"?") + " · conf=" + (conf||"?")
    + (exists ? "" : " · no epic written (anchor-or-reject)") + "\n";
  if (src.indexOf("<!-- FRAME-RESET-LOG -->") >= 0)
    src = src.replace("<!-- FRAME-RESET-LOG -->", "<!-- FRAME-RESET-LOG -->\n" + logLine);
  else src += "\n## Frame-reset log\n<!-- FRAME-RESET-LOG -->\n" + logLine;

  // 3) on a real gap, insert the [EVOLUTION] epic at the backlog top + an OWNER veto line
  if (exists) {
    var entry = "- **[EVOLUTION] " + title + "** *(input-blind critic, " + stamp + ")* — THESIS §D mark "
      + (mark||"—") + ". **The jump:** " + (jump||"(see evidence)") + " **Wrong-hill:** " + (wrong||"—")
      + " **Evidence:** " + (evid||"—") + " (mark5=" + (mark5||"?") + ", conf=" + (conf||"?")
      + "; full critique: " + process.env.CRITIC_OUT + ").\n  OWNER: the input-blind critic proposes this as the next FRAME-RESET epic — veto if the current hill is right; silence = run it.\n";
    if (src.indexOf("<!-- EVOLUTION-INSERT -->") >= 0)
      src = src.replace("<!-- EVOLUTION-INSERT -->", "<!-- EVOLUTION-INSERT -->\n" + entry);
    else console.error("evolve.sh: no <!-- EVOLUTION-INSERT --> marker in ROADMAP — epic NOT inserted (logged only).");
  }

  fs.writeFileSync(rm, src);
  console.log("evolve.sh: " + (exists ? "GAP written to backlog top + counter reset" : "frame holds — no epic; counter reset") + ".");
  console.log("  title: " + title);
  console.log("  §D mark: " + (mark||"—") + " · mark5: " + (mark5||"?") + " · confidence: " + (conf||"?"));
  if (exists) console.log("  the jump: " + (jump||"—"));
  console.log("  full critique saved: " + process.env.CRITIC_OUT);
'
echo "evolve.sh: done. Review the ROADMAP backlog + the OWNER: line; the loop dequeues the [EVOLUTION] epic on its next frame-reset firing."
