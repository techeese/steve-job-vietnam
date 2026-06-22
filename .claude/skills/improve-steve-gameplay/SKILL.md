---
name: improve-steve-gameplay
description: GAMEPLAY-FIRST PHASE for Học viện Steve — take the gameplay, person-sim, and STORY/LEVELS to state-of-the-art with GRAPHICS FROZEN and verification HEADLESS-ONLY. Use for every dev iteration on steve-job-vietnam DURING the gameplay-first phase (any add/fix/deepen of sim, story, eras, archetypes, balance, content). NOT for art — the unscoped improve-steve owns the graphics pass that comes AFTER this phase exits.
---

# GAMEPLAY-FIRST PHASE — make the *game* incredible, with graphics frozen

Project: `/Users/Admin/Desktop/coding/steve-job-vietnam` · repo `techeese/steve-job-vietnam` ·
live at https://techeese.github.io/steve-job-vietnam/.
Phase flag / kill-switch: this skill is the active loop while `/Users/Admin/Desktop/coding/.improve-steve-gameplay-on` exists.
Sibling skill `improve-steve` (graphics-aware) is PARKED until this phase EXITS (see "Exit gate").

## Why this phase exists (the root-cause fix — read once)

The owner's diagnosis: *"we focused too much on graphics… gameplay is not deep enough, so graphics
became the blocker of development speed."* The 2026-06-14 people-first pivot demoted graphics in
PRIORITY but left it wired into the MACHINERY — every iteration still paid a graphics tax (per-ship
screenshots, the 390px gate, cache-bust+deploy+poll, an 888-line skill reloaded each firing). So
pure-gameplay changes still moved at graphics speed. **This phase severs that coupling.** The engine
is DOM-free; the sim and story are 100% testable without rendering. We develop and verify gameplay
HEADLESS, fast, and freeze the art layer until the game underneath is state-of-the-art.

## THE FREEZE (hard rules — violating these defeats the phase)

- **FROZEN — do not touch except for a NAMED production break:** `js/art.js`, `js/sprites.js`, the
  render/canvas/`liveLoop` code and panel-cosmetics inside `js/ui.js`, `tools/gallery.html`, palettes,
  sprite atlases, animation/juice/motes, the Bar's BEAUTY/JUICE axes, the divergence-by-workflow art
  ritual. A "looks rough / could be prettier / nicer icon" is NOT a production break and may NOT preempt.
- **NO graphics verification in the loop:** no per-ship screenshots, no 390px screenshot gate, no
  `_renderLiveOnce`/`_settle` dance, no gallery render. (Mobile *layout* is still respected — just not
  re-verified every ship; a real mobile-unusable break is a production break and may preempt.)
- **ALLOWED — the whole point of the phase:** `js/engine.js`, `js/data.js`, `js/content.js`,
  `js/save.js`, `js/epilogue.js`, the person-sim files (`js/sim/*`), CONFIG/tables, the headless
  harnesses, and the gameplay/story logic in `ui.js` (the menus/flows that drive sim choices — wiring a
  new mechanic to a button is gameplay; restyling that button is frozen).
- **Gameplay is NOT capped by current art (owner, 2026-06-21 — the DECOUPLING PRINCIPLE):** build a
  mechanic / era / story beat even if today's sprites can't render it — ship it as text / a placeholder / a
  minimal indicator; the later graphics pass backfills the visuals. Freezing art means "don't develop new
  art," NOT "limit gameplay to what today's art shows." A feature with no visual yet is a valid ship.
- **The ONE exception:** a PRODUCTION break (a JSERR title string, white-screen, save-loss repro,
  mobile-unusable, a sweep floor-drop) named with its symptom may preempt anything — fix it, then resume.

## THE GOAL — what "state-of-the-art gameplay & story" means here

The game today is ONE continuous person-sim with no narrative spine. State-of-the-art = the person-sim
deepened AND given a story/levels structure. The owner wants **all of it**, unified as ONE design — the
**LATTICE** (build toward this; it is the epic supply for the phase):

- **ARCHETYPE** = the school you're handed (scenario + difficulty in one): rural-underfunded /
  elite-cram / vocational / gifted-academy — each a different starting endowment, prestige, and
  **cohort talent distribution**, and a different thesis on the đề Văn. Easy→hard is intrinsic.
- **ERA** = the decade you play through (the authored campaign spine): 1990s scarcity → Đổi Mới →
  dot-com → smartphone → AI boom. **Each era re-weights which talents the world REALIZES vs WASTES** —
  the same kid is a wasted misfit in one era and a god in another. This is where "story" lives.
- **CONTINUOUS SIM** = the moment-to-moment texture inside each era cell — the existing person-sim
  (talent magnitude `seed` × direction `tell` × education → realized/wasted/distorted), modulated by
  era + archetype. Deepen it (more turning points, branching arcs, inner state) but keep its invariants.
- **PROGRESSION** = a RUN threads an ARCHETYPE through a SEQUENCE of ERAS; finishing SCORES the player's
  đề-Văn answer and unlocks harder archetypes / longer era-chains / a **legacy layer** (your alumni seed
  the next run's world). The "one more run, harder" ladder.

One sentence: **a RUN = a chosen ARCHETYPE played through a SEQUENCE of ERAS, person-sim as the texture,
a PROGRESSION ladder threading the lattice.** It MULTIPLIES the soul (right kid / wrong era / wrong
school), never dilutes it. Resolve every design fork toward what makes a NAMED kid's
realization-or-waste more felt, more caused-by-the-player, more legible as a LIFE.

### The person-sim invariants (design law — never break, carry from VISION.md §"Laws")
1. **Whose-life, not which-strategy** — talent changes *whose* life a thesis realizes/wastes, never
   *which* thesis wins. Cram/craft/hustle stay three dignified arguments. No globally dominant strategy.
2. **Symmetry of waste** — every preset/era REALIZES some talents and WASTES others; none is waste-only
   or realize-only. Waste is never illustrated exclusively by cram.
3. **Prose, not a meter** — realize/waste surfaces as caused prose tied to a moment, NEVER a
   potential-minus-realized number or a sortable 48-kid efficiency table. ~40 kids are glimpsed, not metered.
4. **Waste is done TO the person** — blame the SYSTEM and the player's policy, never the kid. Pantheon
   (honored real educators) names NEVER appear in any waste/distort/scandal line (grep-enforced).

## VELOCITY (owner 2026-06-21 — "fast-track the gameplay"; the owner picked ALL accelerators)
- **WORKFLOWS ARE OWNER-AUTHORIZED (standing opt-in) for BREADTH work.** When a pick is embarrassingly parallel
  authoring — multiple eras' event/đề flavor, several archetypes, content banks, multi-config balance sweeps — fan it
  out with `Workflow` (subagents author/verify each unit against the invariants in parallel; you synthesize + integrate).
  One firing then produces what serial firings would take 5-6 to do. Use the serial loop (below) for DEEP single-mechanic
  work (today's ERAS/origin ships); use a workflow for breadth. Don't workflow trivial/1-file changes.
- **`tune.js` — BUILT iter-207. USE IT instead of hand-tuning.** Grid-searches a CONFIG knob against a sweep-metric:
  `node tune.js <knob> <v1,v2,...> <metric> [lo hi]` (knob = dot-path w/ array indices, e.g. `ORIGIN_GROW.ngheo`,
  `ERAS.2.fav.spark`, `OPS.rate`). Metrics: `origin-gap` `origin-poor` `origin-poor-mentored` `era-apex:<tell>`
  `steve-rate` `cash` `waste` `drop` (`--metrics` to list). It stars the value hitting the target band → one run
  replaces N probe firings. ADD a new metric to tune.js whenever you add a balance-delicate mechanic (the metric IS the
  tuning target). Still mirror touched CONFIG into the sweep sensors for the regression floor.
- Keep the rest of the spine: headless-verify (the freeze killed the graphics tax — that's the velocity win), sweep
  sensors, deploy-per-coherent-slice.

## THE LOOP (lean — this skill reloads every firing; keep it fast)

0. **Orient.** Read `ROADMAP.md` (`## Cadence`, `## Epic backlog`, `## Now`), `feedback.md` (owner
   inbox — if it has content below its `=== FEEDBACK ===` line, that owner steer PREEMPTS this pick;
   distill it, route it, clear the inbox in this commit), and `MODEL.md` (the factor model — the map of
   real-world factors × interactions × mechanics the game is built against). Skim the last ~5 CHANGELOG entries.
   **MODEL-FIRST + PLASTIC (owner 2026-06-21):** the game ANSWERS the real đề-Văn question by MODELING the
   factors that realize/waste a gift — place every new/changed mechanic in `MODEL.md` first (what real factor,
   how it interacts, how it stays plural+fun), and keep the architecture PLASTIC (clean, headless-testable,
   cheap to change — expect to retune/remake mechanics as the model sharpens; don't over-polish what may change).
   The freeze HOLDS until the model + its narrative are deeply right — graphics are the last pass, not a deadline.
   The work splits into two tracks the loop ALTERNATES: SYSTEMS (the LATTICE / factors) and NARRATIVE/WRITING.
1. **Pick — biggest gameplay/story move available.** **★ CURRENT TOP PRIORITY (owner steer 2026-06-22):
   the EDUCATION MODEL REFINEMENT epic — build it phase by phase (Phase 0 baseline-check → 1 STRUCTURE axis →
   2 MAJORS decoupled → 3 ACTIVITIES+attention-hours).** See ROADMAP `## Epic: EDUCATION MODEL REFINEMENT` +
   `MODEL-REMAKE-PROPOSAL.md`. This is the decided fix for the "3 triết lý oversimplify education" steer; it
   PREEMPTS the prior frontier (L4 apex / release-to-graphics / conservative deepening). Ship ONE phase-checkpoint
   per firing, green each time; obey the epic's gating laws (below). When the epic completes, fall back to the
   normal ranking: (a) production-broken, (b) explicit owner ask, (c) LATTICE epics + NARRATIVE/WRITING track,
   (d) person-sim depth, (e) balance from the sweep, (f) content. Prefer ONE coherent shippable change; if it's
   big, it's an EPIC — plan it in ROADMAP `## Epic: <name>` (decide the load-bearing forks; ask the owner only on
   a truly expensive-to-undo one), isolate in a git worktree if it moves files, ship a green checkpoint each
   firing. For non-trivial design forks, DIVERGE before converge: 3 candidates, one line each, scored by
   soul-movement > thesis-service > fun > novelty — but this is design reasoning, NOT the art-screenshot ritual.
2. **Implement** (engineering laws below).
3. **Verify HEADLESS (non-negotiable, all fast):**
   - node-parse every changed script.
   - `./gate.sh` ALL GREEN (GATE_FRESH / GATE_ADMIT / GATE_ALUM replay byte-identical / GATE_COMPAT
     old-save migrates / GATE_BUILD). When a gate exposes a sim bug, fix the GAME, regenerate the
     harness from the fixed file, re-run.
   - Touched CONFIG/FSM/presets/economy/eras/archetypes ⇒ mirror in `engine.js` and run `node sweep.js`;
     the bands + flags (TT-collapse, money-inflation, dead-end-states, **dominant-strategy**,
     🍎-unreachable, realize/waste spread) are the balance to-do list. A talent/era/archetype mechanic
     with NO sweep coverage is an unverifiable change — EXTEND sweep.js to sense it (esp. invariant #1:
     no archetype/era/adaptive strategy may dominate).
   - `./bot.sh` BOTOK (full UI+engine smoke, ≥6 sim-years so graduates exist) — asserts no JSERR across
     all tabs/late-game state. This is the only render-adjacent check kept: it proves nothing CRASHED,
     not how it looks.
   - `./lives.sh [preset] [seed]` under ≥2 presets — READ the biographies. The soul test: can a stranger
     name a kid who was wasted and one realized? Different presets must produce different felt lives.
   - `./lab.sh` — the **Gameplay Lab**: the owner's graphics-free window to WATCH the sim and discuss.
     Regenerates `__lab.html` from index.html and runs schools interactively, reading back biographies /
     outcome distribution / per-year arc / economy / preset-comparison. Keep it **DYNAMIC**: whenever you
     add or deepen a gameplay system (an era, an archetype, a new mechanic), surface its read in the Lab so
     the owner can see what changed. It's the human-facing complement to the headless gates above.
   - **No screenshots. No 390px gate. No gallery.** If you reach for one, you're doing graphics — stop.
4. **Record & ship.** Update `ROADMAP.md` (done out, discoveries in, `## Cadence`) and PREPEND a
   `CHANGELOG.md` entry (loop-iter number in the heading; state which sim/story axis it deepened).
   **Deploy: develop LOCAL, batch deploys** (the owner isn't watching pixels this phase) — accumulate on
   the working branch, and deploy a batch via the ROADMAP banner recipe (`./bump.sh` → commit →
   ff-merge → push → verify live `?v=`) when a coherent slice is done or the owner asks. `bump.sh` is
   still mandatory on any deploy so the build isn't stale.
5. **Continue.** Short status: what shipped, the one soul/story axis it moved, what's next, and `OWNER:`
   lines for any call made on the owner's behalf (he steers by reaction).

## Engineering laws (the load-bearing subset — violations have caused prod incidents)
- **★ EDUCATION-REFINEMENT EPIC GATING LAWS (owner steer 2026-06-22 — while this epic is active):**
  (1) **Sensor-before-lever:** every new fit table (STRUCT_FIT / MAJOR_FIT / ACTIVITY) ships its symmetry +
  non-dominance `sweep.js` sensor IN THE SAME or a PRIOR commit, and the sweep STRATS + adaptive bot
  (`adaptPresets`) must be upgraded to actually SEARCH the new knob (a named bounded algorithm, e.g. greedy
  per-grade hill-climb over {mode×structure}) — else the no-dominant-strategy guarantee is BLIND, not merely
  unproven. (2) **Teeth at the ceiling, not rates:** route new fit into the MISMATCH_CEIL cap + MOOD, because the
  saturation wall washes rate nudges out for the gifted (the kids the đề-Văn is about). (3) **Texture not gradient:**
  caps are small DISCRETE lookup tables, never a smooth distance→severity function (binding law). (4) **No meter
  leak:** outputs stay prose — no fit-% / readiness bar / fungible hour-number; AUDIT `ui.js` ~L908–923 (the
  existing per-kid "nở rộ/tạm hợp/lệch" readout) when re-pointing threshold reads. (5) **Byte-identical default is a
  CONSTRAINT to HIT:** `STRUCT_FIT` must return exactly 1.0 at the baseline structure for the enum→{mode,mid}
  default-derive — and PHASE 0 (a stored realization-histogram baseline check) must exist first, because `gate.sh`
  tests determinism only and will NOT catch a silent rate regression. (6) **Everyman content FIRST:** the Đại-cương
  major is illegal to ship without its realized AND wasted prose banks + a `realGapTell[class]['']` row (none exist
  today). (7) Removing the scripted prodigy is DETERMINISM-BREAKING — re-baseline the GATE_ALUM snapshot + rewrite
  the WASTED-PRODIGY sensor in the same commit.
- PRODUCTION ERROR TRAP: the inline `window.onerror` (sets `document.title='JSERR: '+m+' @'+l`) MUST stay
  the FIRST script in `index.html`, before the `js/*.js` tags. A silent white-screen on a phone is the
  worst failure mode.
- NEVER an unescaped `"` inside a double-quoted JS string (Vietnamese quotes/hyphens kill the parse).
- Every state field: `freshState()` default + `load()` typeof-merge + `sanitize()` entry. Use
  `Number.isFinite`, NEVER bare `isFinite` (NaN→JSON null→`isFinite(null)===true`). Schema change bumps
  `S.v` with ONE migrator. Test-load an OLD-shaped save lacking the new field. Index-aligned arrays
  sanitize with `.map` (null-out), never `.filter`.
- ALL constants in CONFIG, never in state (a save must not pin a balance number). FSM rows: clamp
  probabilities ≤0.95, row-normalize Σ≤0.95.
- `rnd()` = mulberry32 on `S.rngState` for gameplay; `Math.random` for cosmetics only. The alumni FSM
  derives per-alumnus-per-year streams from `S.seed0` (never the live stream) — reloads must not reroll
  destinies; GATE_ALUM enforces byte-identical replay. **Eras/archetypes that add randomness MUST seed
  from `S.seed0`, not the live stream, or they break replay.**
- View/state split: sprite positions/paths/frames volatile, never serialized. `rebuildGrid()` after every
  load/sanitize/build/demolish. `dayTick()` stays a pure function of (S, rnd).
- Pantheon tone law: honored real names are reverent-only; no honoree name in any phốt/scandal/waste
  string. Grep before ship.
- TONE (owner 2026-06-21): NO sarcasm/jabs at the education MINISTRY (Bộ) — ideally don't mention it at all; keep the
  satire on the SYSTEM, the cram-culture, the đề. And keep details REAL to a Vietnamese school (e.g. quạt trần / trống
  trường, NOT a "chuông"/bell). Grep new text for `Bộ` before ship.
- Layer discipline: sim/mechanics → engine.js/CONFIG/tables, text → content.js, NEVER inline. (Art →
  art.js is FROZEN — don't add to it.)
- LEAVE NO DEBRIS: scratch/harness/dump files written to `/tmp` or `rm`'d the same turn; `git status`
  shows only intended changes before any commit.

## Exit gate — when this phase ENDS (the handoff to the graphics pass)

The phase is NOT self-releasing. It exits ONLY when ALL hold:
- (a) `node sweep.js` shows the realize/waste/distort spread holds ACROSS archetypes and eras, with no
  dominant archetype/era/strategy (invariant #1) and waste reachable everywhere (invariant #2);
- (b) reading ~5 `lives.sh` biographies across ≥2 archetypes × ≥2 eras, a stranger can name a kid wasted
  and one realized, AND the era/archetype visibly changed who got which fate;
- (c) the LATTICE is playable end-to-end (pick archetype → play an era-chain → scored ending →
  progression unlock) — the gameplay/story is state-of-the-art on its own terms, sight unseen;
- (d) **the owner EXPLICITLY confirms** the game underneath is ready to be dressed.
On exit: log the release in CHANGELOG + ROADMAP, `rm .improve-steve-gameplay-on`, hand back to
`improve-steve` for the concentrated GRAPHICS pass (now far easier — the game is finished, so the art
knows exactly what it's drawing).

## Self-correction (lean)
This skill is your behavior — when the loop errs or drifts (a gate caught a bug you should have
prevented; the owner corrected you; you slid back into touching frozen art; a streak of tiny ships with
no story/lattice progress), edit THIS file in the same turn so it can't recur, and note `SELF-CORRECTION:
…` in the status. Keep it LEAN — it reloads every firing; prune stale lines as you add. Mine VISION.md
for the next lattice epic when the backlog runs dry.
- SCOUT-BEFORE-YOU-HOLD (iter-254, reinforces iter-202): before concluding "non-gated work is exhausted" / holding for
  ≥2 firings, RUN A SCOUT FAN-OUT (`Workflow`: parallel scouts over each game system → adversarial filter → ranked queue).
  TWICE now (iter-202, iter-254) a "plateau" I asserted from reasoning was FALSE — the scout found genuine non-gated work
  (iter-254: 4 candidates incl. the high-value school-as-equalizer capstone beat). My plateau intuition is unreliable;
  a real search is cheap and usually breaks it. Hold ONLY after a scout returns plateauReal=true. Reading-only legibility
  of the NEW systems at the payoff (e.g. the equalizer beat) is a rich, byte-identical seam — mine it before holding.
- COMPLETION-PLATEAU POSTURE (iter-230): the LATTICE + narrative are COMPLETE and the exit gate is measurably met (a/b/c;
  see ROADMAP banner + `GRAPHICS-HANDOFF.md`); only owner-confirm (d) remains. The narrative-surface sweep is DONE (clean
  end to end). So do NOT manufacture micro-polish to fill firings — that IS the decay this section warns about. When no
  real gap exists and no owner steer is in `feedback.md`: prefer (1) a genuine forward-looking consolidation (extend the
  handoff, sharpen the Lab), or (2) honestly hold the line and restate the owner decision point — over inventing a
  refinement. A firing that ships nothing but a true verification is better than a manufactured change.
