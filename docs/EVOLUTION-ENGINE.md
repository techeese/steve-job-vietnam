# The Evolution Engine — an autonomous loop that *evolves*, not just *adapts*

*Design synthesized from a 17-agent workflow (5 independent architectures → adversarial judging →
synthesis → refutation). The refutation ran real checks (`claude -p`, settings inspection,
`engine.js` read, git history) and corrected the synthesis; this document is the corrected version.*

---

## 1. The problem (owner's words)

> "Each time we feed in major changes, the app does well for a while, then later iterations are just
> gradual. It is not EVOLVING, it is just slowly ADAPTING. I care about an autonomous workflow that
> leads to a TRUE SOLUTION, not gradual improvement."

**The mechanism.** Every iteration takes the *current artifact* as its reference frame and asks
*"what's the best next improvement **from here**?"* — hill-climbing. Near a local optimum the
gradient flattens, so moves shrink. That is the decay. The owner's "major changes" work precisely
because each is an **external reference-frame reset** — the owner re-contacts the thesis with fresh
eyes ("we focused too much on graphics → focus on the *soul*"). Then the loop climbs the new hill
and decays again.

**The goal.** *Internalize the reset.* Build an autonomous engine that periodically does for the
loop what the owner's injections do — generate true-solution **jumps** toward the thesis — without
the owner.

**The proof it's needed (the acceptance test).** The live "People-First Mandate" is an owner
injection the loop could **not** generate itself — it took the owner to see that beautiful,
individually-fine graphics ships had left the game's *argument* stagnant. Acceptance test for any
engine: *would it, running autonomously, have surfaced "the soul is the gap" the way the owner had to?*

---

## 2. The honest ceiling (read this before building)

The adversarial refutation would not let the autonomy/evolution claims stand as "proven." Be honest
about what this engine **can** and **cannot** do — overselling it re-creates the exact
looks-true failure the whole project guards against.

- ✅ **It CAN** detect the *success-shaped failure* the current loop is blind to: green + shipped +
  no veto + flat thesis-gap = **local optimum**, not success. The loop today reads that as "tacit
  accept." This engine reads it as the alarm. This is real and new.
- ✅ **It CAN** re-derive *within a known thesis vocabulary* and override the backlog with a fresh,
  anchored gap instead of dequeuing a crystallized past decision.
- ⚠️ **It CANNOT (yet) reliably** name a *genuinely new dimension* the thesis had no words for. The
  leap to "**people-development** is the missing soul" required the owner to *define* the
  realize/waste/distort vocabulary. The engine would have flagged "outcomes are flat / degenerate"
  (a real alarm) — but coining the new axis is still **partly owner-reserved**. Treat the engine as
  a high-value **decay detector + within-frame re-deriver + jump-executor**, not a guaranteed
  generator of owner-grade reframes.
- ⚠️ **Same-model-class ceiling.** No second-vendor API key exists here, so the independent critic
  shares the producer's priors (e.g. "graphics is what good games have" — the very blind spot). The
  A-confidence therefore rests on the **objective sensor** + **input-independence** (the critic
  reaches the artifacts itself), *not* on the critic's taste. A different model line — even another
  Claude family member — materially strengthens it.
- ⚠️ **Goodhart vs invariant #3.** Turning "soul" into a flat-spread *number* risks the loop climbing
  the number while biographies stay generic, violating THESIS §C-3 ("prose, not a meter"). The
  qualitative biography-read must gate *alongside* the number. Watch for "spread-up-but-generic."

---

## 3. The architecture — a TWO-SPEED engine

Keep the fast loop (it's good at making forms good). Add a slow beat that resets the frame.

```
L0  THE FROZEN FRAME ........ THESIS.md (owner-owned, immutable to the loop)
        │  the gap is measured against THIS, not the build
        ▼
L1  THE OBJECTIVE SENSOR .... extended sweep.js  → the gap as a NUMBER (flat-spread flag)
        │  highest verification tier; no taste ceiling
        ▼
L2  THE INPUT-BLIND CRITIC .. evolve.sh + critic-prompt.md, spawned via `claude -p`
        │  separate context; PLAYS the live build + reads sweep + biographies ITSELF;
        │  handed THESIS.md + artifact LOCATIONS, DENIED the success-narrative
        │  → returns the single biggest ANCHORED gap + a steelman "wrong hill" jump
        ▼
L3  THE FAST ADAPTATION LOOP  improve-steve SKILL.md (near-unchanged) → executes via EPIC machinery
        ▲
L4  THE BRIDGE + CADENCE .... ROADMAP ## Cadence counter + the autonomous trigger (§5.1)
```

- **The slow loop chooses WHICH FORM should exist; the fast loop makes that form good.** Because L1
  and L2 re-derive from the *question*, not the *build*, the engine can conclude *"this whole hill is
  wrong"* — the jump — which is structurally impossible inside the fast loop (where DESIGN is "never
  re-litigate").
- **Why this beats the four rival designs:** the pure thesis-gap engine and the foundry both
  under-scored on "produces evolution" because their reset stayed in-frame; the direction-tournament
  and independent-adversary scored well and their best parts are *grafted in* (the critic's steelman
  "wrong hill" posture is the tournament's divergence-over-directions, compressed to one agent).

### The four properties that make it *evolution*, not adaptation
1. **A different, frozen reference frame the hill-climber can't reach** (L0 + the critic's denial of
   ROADMAP/CHANGELOG).
2. **Gap-not-delta, *measured*** so it survives self-flattery (L1 flat-spread flag + a
   `COMPLETENESS-VS-DREAM` Bar axis that goes red when craft is 5 but the argument is flat).
3. **Re-derive, not dequeue** (the critic overrides the backlog with a new gap).
4. **Independence of the *input*** (FM-AX-I1 repointed: the producer authors neither the critic's
   prompt nor the evidence it reads).

### How the gap is measured — three sensors (this is what reads THESIS §D)

The frozen frame lists **five marks**, and they are *not* readable the same way. The engine needs
three sensors, strongest (most objective) first:

| THESIS §D mark | Sensor | Tier |
|---|---|---|
| **3** — no single right way | **L1 sweep** — flat-spread / dominance / 🍎-reachability flags | A — external/objective |
| **1, 2, 4** — become someone · care · own answer | **biography-read** — the critic reads ~5 rendered lives itself | B — critic judgment |
| **5** — felt the weight *while playing* | **play-observation** — the critic **drives the live build through its choices** and judges whether each philosophy fork carried real, *uncertain* stakes | B — critic judgment, hardest |

**Mark 5 is the consequence of letting the thesis own the playing.** It **cannot** be read from
epilogues or sweep output — the critic must actually PLAY (drive choices via a headless harness, or
watch a scripted playthrough). This is the least-built sensor and the biggest lift in L2 (see Phase 3
+ residual risk 7). The anti-Goodhart guard (THESIS §C-3) still holds across all three: the
qualitative reads (biography + play) gate *alongside* the L1 number, so the loop can't climb a
flat-spread metric while the lives and the playing stay hollow.

---

## 4. Triggers & the don't-overrotate guard

**Two triggers:**
- **A — counted hard-lock:** `FIRINGS_SINCE_FRAME_RESET` (start ~12, tuned to the owner's real
  injection rhythm). At threshold, the next firing hard-locks to a frame-reset — teeth in the
  ledger, not prose.
- **B — the WRONG-HILL detector** (reuses the existing read-last-~8-ships failure machinery): N
  consecutive ships all green + Bar-4+ + the gap axis flat + owner silent = local-optimum signature
  → fire a reset *early*.

**Guards against thrash (adaptation is legitimate and protected):**
1. **The two-speed split itself** — the slow beat is rare; polish/balance keep happening.
2. **Anchor-or-reject** — no externally-anchored gap → *no forced jump*; "the frame holds, the build
   serves axis X" is a valid result that resets the counter without manufacturing an epic. (This is
   the antidote to the iter-73 valve-became-make-work pathology — and unlike iter-92 it does *not*
   then license shipping polish on a flat gradient.)
3. **Mid-epic deferral** — a trigger mid-epic waits for the next green checkpoint.
4. **One jump at a time** — exactly one biggest-gap epic per beat; climb it to excellence before the
   next reset (burst-then-adapt, mirroring the owner's own healthy rhythm).
5. **High threshold + `OWNER:` veto** on every jump.

---

## 5. The setup plan (corrected order — the real first step first)

> **Do SKILL.md / ROADMAP edits only when the improve-steve loop is idle** (flag absent, no running
> agent) so you don't race its self-edits. THESIS.md and this doc are additive and safe.

### Phase 1 — WIRE AUTONOMY (the actual prerequisite; it does not exist today)
There is currently **no Stop hook, no flag file, no cron** — the loop only runs when fired manually.
Pick one:
- **(Recommended) Stop hook + flag** — matches what SKILL.md already assumes. Add a `Stop` hook that
  re-injects the `/improve-steve` prompt while `/Users/Admin/Desktop/coding/.improve-steve-on`
  exists; `touch` the flag to start, `rm` to stop. In-session looping; lowest friction. *(Use the
  `update-config` skill to write the hook safely.)*
- **Cron / scheduled cloud agent** (the `schedule` skill) — fires a fresh session on a cadence.
  Stronger session-freshness (better for independence), needs the repo reachable.

Then **smoke-test it**: confirm the loop re-fires on its own for ≥2 cycles before trusting anything
downstream. *Until this passes, "autonomous" is unproven.*

### Phase 2 — BUILD L1, THE SENSOR (= the arc's own E1; resolves the live PAUSE)
Extend `sweep.js` with a per-life realize/waste/distort classifier **over existing `fs.seed/tell/
stats` (no stored state — honors E1/E2a)**: per-strategy realization spread, wasted-prodigy count,
waste-reachability, an adaptive grain-match STRAT + dominance flag, and the keystone **FLAT-SPREAD
flag** ("the soul is missing," as a number). *Skip the seed0-persist step — confirmed redundant:
`seed` is read-only during growth.* This is zero-balance tooling and is the arc's first, never-blocked
epic — building it unblocks the E2 match-model decision the loop paused on.

### Phase 3 — BUILD L2, THE CRITIC (input-blind reference-frame reset)
Create `critic-prompt.md` (handed THESIS.md + artifact *locations*; denied ROADMAP/CHANGELOG/
Owner-Model; asks "from the đề Văn alone, what would exist, what's the single biggest GAP?"; steelman
"wrong hill"; anti-fabrication escape: <N real gaps → say so, do not invent) and `evolve.sh` that
spawns it via `claude -p` and writes the biggest anchored gap to the backlog top as `[EVOLUTION]` +
an `OWNER:` line. The critic must do all THREE sensor jobs ITSELF (never trust a producer summary):
**run the sweep** (mark 3), **read ~5 biographies** (marks 1/2/4), and **play a few years through the
live build's choices** (mark 5), judging whether each philosophy fork carried real, uncertain stakes.
Mark 5 needs a *drive-the-choices* harness — extend `bot.sh` (it already plays headlessly) so the
critic can actually make and feel the forks; **if that harness isn't ready, the critic must DECLARE
mark 5 unmeasured, never guess it.** **Smoke-test `claude -p` under the loop's actual (tiny) permission
set** — it may hit a prompt; widen the allowlist if so.

### Phase 4 — WIRE THE BRIDGE (do against an idle loop)
Add `FIRINGS_SINCE_FRAME_RESET` to ROADMAP `## Cadence` and the `[EVOLUTION]` backlog convention +
a `## Frame-reset log`. Add the WRONG-HILL detector + the `COMPLETENESS-VS-DREAM` 7th Bar axis (scored
vs the THESIS §D marks) to SKILL.md, and the Step-0 read of `FIRINGS_SINCE_FRAME_RESET`. Keep the
arc's `SHIPS_SINCE_PERSONSIM` **dominant**; the new beat sits dormant behind it until the arc releases.

### Phase 5 — HARDEN (close the refutation's leaks)
- Make THESIS.md immutability *real*, not prose: a hook that blocks edits to `THESIS.md`, or
  git-diff detection that reverts loop edits to it. (Today SKILL.md is loop-editable and the loop
  already auto-edits VISION.md, so "immutable" is only a convention.)
- If any second model line/vendor becomes available, route the critic to it — that's the single
  biggest quality lever (breaks the same-class ceiling).
- Add a biography-read gate beside the flat-spread number (anti-Goodhart, invariant #3).

### The single first concrete step
**Wire and smoke-test the autonomous trigger (Phase 1).** Everything else is inert without it — and
it's the literal thing "autonomous workflow" means. Build the sensor (Phase 2) second.

---

## 6. Residual risks the owner must accept (from the refutation)
1. **Autonomy infra is unbuilt** — no hook/flag/cron today; Phase 1 is a real, unskippable build.
2. **Cross-frame leap is partly owner-reserved** — the engine detects flat/degenerate distributions
   reliably; coining a brand-new thesis dimension is not guaranteed (§2).
3. **Same-model-class ceiling** — the critic shares producer priors; A-confidence rests on L1 + input
   independence, not the critic's taste.
4. **Goodhart vs invariant #3** — a soul-number can be gamed; gate it with the qualitative read.
5. **Frame immutability is prose-deep** until Phase 5 hardens it.
6. **`claude -p` nested-spawn under loop permissions** is unverified end-to-end — smoke-test it.
7. **Mark 5 (play-observation) is the least-built sensor.** Letting the thesis own the playing means
   the critic must actually PLAY, not just read. `bot.sh` plays headlessly but as a *smoke test*, not a
   make-and-feel-the-choices harness; until that exists, mark 5 is critic-judged at best or honestly
   declared unmeasured. This is the biggest new build the locked thesis created.
