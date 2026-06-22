# The Evolution Engine — an autonomous loop that *evolves*, not just *adapts*

The design doc for THIS repo's autonomous dev loop. The machinery is real and partly wired here:
`THESIS.md` (the frozen frame), `sweep.js` (the L1 sensor), `lives.sh` (the L2 biography sensor),
`evolve.sh` + `critic-prompt.md` (the L2 critic), and `.claude/hooks/improve-steve-loop.sh` (autonomy).
This file explains *why* that machinery exists and what's still unbuilt.

## 1. The problem

> "Each time we feed in major changes, the app does well for a while, then later iterations are just
> gradual. It is not EVOLVING, it is just slowly ADAPTING."

Every iteration takes the *current artifact* as its reference frame and asks *"what's the best next
improvement from here?"* — hill-climbing. Near a local optimum the gradient flattens, so moves shrink.
That's the decay. The owner's "major changes" work because each is an **external reference-frame reset**
(re-contacting the thesis with fresh eyes). The goal: **internalize the reset** — an engine that
periodically generates true-solution **jumps** toward the thesis without the owner.

**Acceptance test:** would the engine, running autonomously, have surfaced "the soul is the gap" the way
the owner had to (the live People-First Mandate the loop couldn't generate itself)?

## 2. The honest ceiling (read before building)

- ✅ **CAN** detect the *success-shaped failure* the loop is blind to: green + shipped + no veto + flat
  thesis-gap = **local optimum**, not success. New and real.
- ✅ **CAN** re-derive within the known thesis vocabulary and override the backlog with a fresh anchored gap.
- ⚠️ **CANNOT (yet)** reliably name a *genuinely new dimension* the thesis had no words for — coining a new
  axis is still **partly owner-reserved**. Treat the engine as a decay-detector + within-frame re-deriver +
  jump-executor, not a guaranteed generator of owner-grade reframes.
- ⚠️ **Same-model-class ceiling.** No second-vendor key here, so the critic shares the producer's priors.
  A-confidence rests on the **objective sensor** + **input-independence** (the critic reaches the artifacts
  itself), not the critic's taste. A different model line materially strengthens it.
- ⚠️ **Goodhart vs invariant #3.** Turning "soul" into a number risks climbing the number while biographies
  stay generic (THESIS §C-3, "prose not a meter"). The qualitative biography-read must gate *alongside* it.

## 3. The architecture — a TWO-SPEED engine

Keep the fast loop (good at making forms good); add a slow beat that resets the frame.

```
L0  FROZEN FRAME ......... THESIS.md (owner-owned, immutable to the loop) — the gap is measured vs THIS
L1  OBJECTIVE SENSOR ..... extended sweep.js → the gap as a NUMBER (flat-spread flag); no taste ceiling
L2  INPUT-BLIND CRITIC ... evolve.sh + critic-prompt.md via `claude -p` — separate context; PLAYS the
                           build + reads sweep + biographies ITSELF; handed THESIS + artifact LOCATIONS,
                           DENIED the success-narrative → returns the biggest ANCHORED gap + a "wrong hill" jump
L3  FAST ADAPTATION ...... improve-steve SKILL.md → executes via EPIC machinery
L4  BRIDGE + CADENCE ..... ROADMAP ## Cadence counter + the autonomous trigger (§4)
```

The slow loop chooses WHICH FORM should exist; the fast loop makes that form good. Because L1/L2 re-derive
from the *question*, not the *build*, the engine can conclude *"this whole hill is wrong"* — structurally
impossible inside the fast loop (where DESIGN is "never re-litigate").

**Four properties that make it evolution, not adaptation:** (1) a frozen reference frame the hill-climber
can't reach; (2) gap-not-delta, *measured*, so it survives self-flattery; (3) re-derive, not dequeue (the
critic overrides the backlog); (4) independence of the *input* (the producer authors neither the critic's
prompt nor the evidence it reads).

**How the gap is measured — three sensors** (strongest/most objective first):

| THESIS §D mark | Sensor | Tier |
|---|---|---|
| **3** — no single right way | **L1 sweep** — flat-spread / dominance / 🍎-reachability flags | A — objective |
| **1, 2, 4** — become someone · care · own answer | **biography-read** — critic reads ~5 rendered lives (`lives.sh`) | B — judgment |
| **5** — felt the weight *while playing* | **play-observation** — critic drives the live build through its choices | B — hardest |

Mark 5 cannot be read from epilogues/sweep — the critic must actually PLAY (drive choices via a headless
harness). It's the least-built sensor. The qualitative reads gate *alongside* the L1 number (anti-Goodhart).

## 4. Triggers & the don't-overrotate guard

**Two triggers:**
- **A — counted hard-lock:** `FIRINGS_SINCE_FRAME_RESET` (start ~12, tuned to the owner's injection rhythm).
  At threshold the next firing hard-locks to a frame-reset.
- **B — WRONG-HILL detector:** N consecutive ships all green + Bar-4+ + gap axis flat + owner silent =
  local-optimum signature → fire a reset early.

**Guards against thrash** (adaptation is legitimate and protected): the two-speed split (slow beat is rare);
**anchor-or-reject** (no externally-anchored gap → no forced jump); mid-epic deferral (waits for next green
checkpoint); one jump at a time; high threshold + `OWNER:` veto on every jump.

## 5. The setup plan (real first step first)

> Do SKILL.md / ROADMAP edits only when the improve-steve loop is **idle** (flag absent, no running agent).
> THESIS.md and this doc are additive and safe.

1. **WIRE AUTONOMY** — a `Stop` hook + flag file that re-injects `/improve-steve` while
   `.improve-steve-on` exists (`touch` to start, `rm` to stop), or a cron/scheduled cloud agent. Smoke-test
   ≥2 self-fired cycles before trusting anything downstream. *(Partly built — see the loop hook.)*
2. **BUILD L1, THE SENSOR** — extend `sweep.js` with a per-life realize/waste/distort classifier over
   existing `fs.seed/tell/stats` (no stored state): realization spread, wasted-prodigy count,
   waste-reachability, dominance flag, and the keystone **FLAT-SPREAD flag** ("the soul is missing," as a
   number). Zero-balance tooling; the arc's first never-blocked epic.
3. **BUILD L2, THE CRITIC** — `critic-prompt.md` (handed THESIS + artifact *locations*; denied
   ROADMAP/CHANGELOG; "from the đề Văn alone, what's the biggest GAP?"; steelman "wrong hill"; anti-fabrication
   escape) + `evolve.sh` spawning it via `claude -p`, writing the gap to the backlog top as `[EVOLUTION]`.
   The critic must do all THREE sensor jobs itself (run sweep, read ~5 biographies, play a few years); if the
   play harness isn't ready it must DECLARE mark 5 unmeasured, never guess. Smoke-test `claude -p` under the
   loop's permission set.
4. **WIRE THE BRIDGE** — `FIRINGS_SINCE_FRAME_RESET` + `[EVOLUTION]` convention + `## Frame-reset log` in
   ROADMAP; the WRONG-HILL detector + the `COMPLETENESS-VS-DREAM` Bar axis + Step-0 counter-read in SKILL.md.
5. **HARDEN** — make THESIS.md immutability real (a hook that blocks/reverts loop edits to it); route the
   critic to a second model line if one becomes available; add the biography-read gate beside the number.

## 6. Residual risks the owner must accept

1. Autonomy infra is only partly built — verify the hook/flag end-to-end.
2. Cross-frame leap is partly owner-reserved (§2) — flat/degenerate detection is reliable; coining a new
   dimension is not guaranteed.
3. Same-model-class ceiling — critic shares producer priors.
4. Goodhart vs invariant #3 — gate the soul-number with the qualitative read.
5. Frame immutability is prose-deep until step 5 hardens it.
6. `claude -p` nested-spawn under loop permissions is unverified end-to-end.
7. **Mark 5 (play-observation) is the least-built sensor** — needs a make-and-feel-the-choices harness, not
   just `bot.sh`'s smoke test; until it exists, mark 5 is critic-judged or honestly declared unmeasured.
