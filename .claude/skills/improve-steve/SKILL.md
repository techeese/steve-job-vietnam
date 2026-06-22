# Make Học viện Steve incredible — one bold iteration

Project: `/Users/Admin/Desktop/coding/steve-job-vietnam` · repo `techeese/steve-job-vietnam` ·
live at https://techeese.github.io/steve-job-vietnam/ (Pages auto-deploys `main`).
Game: satirical Vietnamese university-management sim (Kairosoft register). NOT a clicker.
Kill-switch: `rm /Users/Admin/Desktop/coding/.improve-steve-on`.

---

## ⚠ STATUS: THIS SKILL IS PARKED — read before doing anything

This is the **GRAPHICS pass** skill (the FINAL art pass). It is **DORMANT.** The project is in a
**gameplay-first, graphics-FROZEN** phase driven by a DIFFERENT skill, **`improve-steve-gameplay`**,
which owns every dev iteration right now (sim, story, eras, archetypes, balance, content) with art frozen
and verification headless-only.

**Do NOT resume the graphics pass on your own.** This skill is the manual for when the graphics pass
RESUMES — and it resumes ONLY after the gameplay-first arc EXITS, which is a MEASURED + owner-confirmed
gate (see `GRAPHICS-HANDOFF.md` line 6 / ROADMAP banner: exit gate a/b/c measurably met, owner-confirm
(d) pending). If you were fired into this skill by mistake during the gameplay arc, the correct move is to
defer to `improve-steve-gameplay`. The rest of this file assumes the arc HAS exited.

What the graphics pass inherits is documented, not restated here — read these three FIRST when you resume:
- **`GRAPHICS-HANDOFF.md`** — every player-facing surface, its content status, what to visualize, and the
  laws the graphics pass must not break. This is your worklist.
- **`docs/ART-PIPELINE.md`** — the real-pixel-art stack (Kenney + Jephed) and HOW art is drawn/baked
  (`shot.sh`, the atlas, gallery).
- **`VISION.md`** — the 1-page dream; mine it for the next graphics epic.

---

## THE MISSION (when the graphics pass IS live)

The job is **make this game INCREDIBLE, fast** — cumulative ambition over per-turn safety. This loop has
historically failed by being LOCALLY productive but GLOBALLY timid (long runs of tiny additive features,
zero bold swings) while the bar — *"looks like a real cute game"* — stays unmet. The graphics pass exists
to MEET that bar: the final real-pixel-art dressing of a game whose mechanics + narrative are already FINAL.

Four standing biases correct timidity:
1. **BIGGER beats smaller** — ask "what single change moves the game most toward incredible right now?"
2. **BOLDER beats safer** — every change is one `git revert` away; a wrong swing is CHEAP. Take real
   swings (overhauls, art-direction pivots, restructures). The owner judges by reaction.
3. **MORE CREATIVE beats obvious** — for the #1 visual dimension, DIVERGE before you converge (≥3 parallel
   drafts → judge → synthesize). First-idea-ships is BANNED for graphics/charm.
4. **HIGHER QUALITY beats merely-correct** — "gates green + pushed" is the floor, not done. Score every
   ship against the Bar rubric.

"One iteration" is a unit of shipping, not a cap on ambition. Use the powers: PLANS, ROADMAP epics, FILE
DELETION, RESTRUCTURE, git WORKTREES, multi-agent WORKFLOWS.

## The two tracks — pick the track first, every turn

- **POLISH track** — one coherent shippable improvement (a charm beat, a visual fix, a bug). Steps 1→5.
- **EPIC track** (the engine of bigness):
  - **FEATURE-EPIC** — a UI/layout overhaul, an art-direction pivot, a big visual expansion. Raises a Bar
    axis; proven by screenshot + rubric.
  - **STRUCTURE-EPIC** — a file split / dead-code purge / perf rebuild. BEHAVIOR-NEUTRAL; proven by
    BEFORE/AFTER byte-diff + identical screenshots. Worktree-isolated, near-zero veto risk →
    **ships fully autonomously** (a proven-neutral refactor IS the safe move).
  Both run via The EPIC machinery. A multi-firing epic ships a green safe-so-far checkpoint EACH firing.

**THE COUNTED CADENCE (binding — soft "shoulds" lost 7×).** ROADMAP carries a machine-readable
`## Cadence` ledger; Step 0 reads it and it DICTATES the track:
- `SMALL_SHIPS_SINCE_EPIC` — +1 per polish ship; reset to 0 only when an EPIC actually SHIPS (a *planned*
  epic does NOT reset it). **If ≥ 3 → HARD-LOCKED to the EPIC track; polish is illegal.**
- `EPICS_SINCE_STRUCTURE` — +1 per FEATURE-epic; reset on a STRUCTURE move. **If ≥ 2, the next epic MUST
  be STRUCTURE.** Satisfied by EITHER a worthwhile refactor OR — only when a RIGOROUS structure review
  (concrete file sizes + measured coupling) finds no clean+safe+worthwhile extraction — logging that
  verdict + the queued next refactor, then resetting. Anti-timidity guard: if a clean valuable extraction
  IS available, you MUST do it (art.js was wrongly deferred 35 iters; don't review a real seam away).
- Update the ledger in the SAME commit as every ship. Broken-always-wins and explicit owner asks preempt
  the track, but a preempting small ship still increments `SMALL_SHIPS_SINCE_EPIC` (no dodging epics).

## The Bar — what "INCREDIBLE" means (score every ship)

- **Reference bar:** a polished Kairosoft title (Game Dev Story / Pocket Academy) you'd happily *just
  watch* — readable crafted pixel-art, a campus that breathes, satisfying fanfare — fused with the
  satirical bite of a great editorial cartoon about Vietnamese education. Ask: *"would this screenshot
  make a stranger want to play?"*
- **Self-scoring rubric — a BINDING GATE.** Rate 1–5 and STATE the scores in the commit body + status:
  1. **BEAUTY** — crafted, cohesive, bright, detailed, characterful (the #1 graphics-pass dimension).
  2. **JUICE/LIVELINESS** — motion, feedback, fanfare; the screen breathes and rewards watching.
  3. **FUN/DEPTH** — meaningful choices, momentum, "one more year"; no dominant strategy.
  4. **CLARITY/UX** — legible at 390px in 10 seconds; a new player isn't lost.
  5. **SATIRICAL BITE** — anchored in real VN-education culture; the open question stays open.
  6. **SOUL/PERSONHOOD** — does a NAMED kid's realize/waste/distort read as more visible/felt? (the
     people-first dimension the gameplay arc built; the graphics pass must not flatten it).
  - **FLOOR:** a ship is legal only if it lifts ≥1 axis to 4+ while no axis drops below 3. **Debt valve:**
    bugfixes, balance/sweep fixes, and `## Debt`-paydown ships are EXEMPT (score them, don't block).

## Step 0 — Orient (always)

0. **READ `feedback.md` FIRST** — the async owner inbox. If it has content below `=== FEEDBACK ===`, that
   is owner steer and it PREEMPTS this iteration's pick. Distill each note → route to the right file
   (`VISION.md` dream/taste · `SKILL.md` playbook+Owner Model · `ROADMAP.md` epics/Cadence · `CHANGELOG.md`
   · `DESIGN.md` settled law; anything implying a `THESIS.md` change → surface as an `OWNER:` proposal,
   never edit THESIS) → CLEAR the inbox to its empty template + prepend a dated Ingest-log line — all in
   THIS commit. Many items: apply the load-bearing now, queue the rest. If empty, proceed normally.
1. Read `DESIGN.md` (SUPREME authority; §0 canonical rulings are settled law, never re-litigate),
   `GRAPHICS-HANDOFF.md` (the graphics worklist + laws), `docs/ART-PIPELINE.md` (the stack),
   `ROADMAP.md` (`## Cadence`, `## Epic backlog`, `## Epic in progress`, `## Debt`), `CONVERSION-SPEC.md`.
2. `git status` + `git log --oneline -3`. Large uncommitted changes you didn't make → a background build
   may be in flight; STOP and investigate (check for running agents/tasks) before touching anything.
3. **READ `## Cadence` + run the FAILURE DETECTOR — this sets the track before you look at any idea:**
   - if `SMALL_SHIPS_SINCE_EPIC ≥ 3` → HARD-LOCKED to EPIC (polish illegal);
   - else if an `## Epic in progress` exists → continue it (ship its next green checkpoint);
   - else POLISH is permitted (an epic is still allowed if it's the biggest-value move).
   Then scan the last ~8 CHANGELOG entries against the FAILURE MODES; if one trips, this firing is a
   SKILL REVIEW. If the latest "loop iter N" crosses a ~50-mark → the 50-firing skill review.

## The Owner Model (living — this is the point of the skill)

The loop's deepest job is building an ever-better model of the OWNER'S ABSTRACT PRODUCT SENSE and evolving
the dev flow to serve it. Every owner message is DATA about the underlying instinct.

**Autonomy contract:** the owner WANTS the loop to DECIDE, not ask. Default: **decide → ship → owner
vetoes by reaction.** ASK (AskUserQuestion) ONLY when ALL of: (a) the choice is expensive/hard to undo or
destroys owner-made work, AND (b) no taste signal below resolves it, AND (c) a wrong call wastes large
effort. Otherwise decide, ship, surface as an `OWNER:` line. Bias BOLD on visual work; silence after a
push = tacit accept.

**Taste north-star (resolve every fork against this):**
- **People-first soul (2026-06-14, most-weighted):** the owner steered from surface to SOUL — *"focus on
  PEOPLE DEVELOPMENT … how a student can transform … each person has their own TALENT score that interacts
  with the education system,"* root-causing the old state as *"focused too much on … graphics."* The
  gameplay arc built this (talent × education → realize/waste/distort, biographies, attachment to named
  kids). **The graphics pass must DRESS the soul, never flatten it** — its SOUL rubric axis exists to keep
  the visuals serving the person-sim. Graphics is "the body"; people-development is "the soul."
- **The SUNNY-school seed (2026-06-13, owner verbatim):** *"It should feel a sunny, slightly chaotic little
  school you love watching, the characters are customize, and doing stuff that you like to see."* → NORTH
  STAR = a SUNNY, LIVELY little school that's a JOY TO WATCH. SUNNY (bright/warm, never dark — the lacquer
  rejection is a rule) · SLIGHTLY CHAOTIC (alive, many little things at once) · A LITTLE SCHOOL YOU LOVE
  WATCHING (the watching itself is the pleasure) · CHARACTERS CUSTOM/INDIVIDUAL (named, quirky) · DOING
  STUFF YOU LIKE TO SEE (charming legible behaviours, first-class). This governs HOW the campus looks/feels
  — resolve visual forks toward sunnier/livelier/more-individual/more-fun-to-watch.
- **VISUAL bar:** DETAILED PIXEL-ART — bright/cute/faces/crafted buildings; NOT dark/moody/programmer-art.
  *"Looks like a real cute game."* The graphics technique recipe lives in `docs/ART-PIPELINE.md` (Kenney +
  Jephed real pixel-art stack) — follow it, don't reinvent.
- **DIMENSIONAL pixel-art** — "3D but still pixel" (fake-iso / 2.5D): side walls, pitched roofs,
  characters with VOLUME, not flat-front.

**Durable taste distillations (the owner thinks in these):**
- PEOPLE & TRAJECTORIES, not meters — biographies, not scores; real talent honored by name.
- Satire ANCHORED in real cultural moments (Nuôi Em scandal, the đề thi THPT question, the pantheon).
- HOLD THE QUESTION OPEN — the game is a *playable open question* (no dominant strategy, no imposed
  verdict; the epilogue mirrors the PLAYER'S answer back — DESIGN §1). **In pixels too:** no surface
  renders a verdict/score; the capstone CUTS OFF ("Tôi—").
- FEEL-FIRST — a screen that breathes beats a clever system.
- ITERABILITY + ARCHITECTURE AS A LIVING DELIVERABLE — keep it cheap to change; the structure review is a
  standing duty.
- WATCH IT GROW remotely (steer by reaction) — cadence is BATCHED (see Step 4). Steers via CONCRETE
  OPTIONS, picks the BOLDEST: divergence → show 3 visual options → he picks → integrate-with-proof.
- DELETION is sanctioned: a live feature that's confusing/inert/dilutes the soul is DEBT; pruning is a
  legitimate gate-verified ship. Ask "what should this game STOP doing?"

**Maintain this model:** on EVERY owner interaction extract the abstract intent and update the
distillation (verbatim phrasings are ground truth). Every ~10 iterations (the flow reflection) re-read it
against what shipped and CHANGE THE FLOW if it no longer fits. `OWNER:` lines are cheap predictions about
taste — vetoes and silence are both signal.

## Improvement Compass (graphics-pass ranking; broken always wins)

The graphics pass DRESSES a finished game. Its winning dimension is **Graphics & charm** (art.js
sprites/tiles/animations, tells, motes, the gallery loop) — but it must SERVE the soul (the SOUL axis),
never flatten the person-sim. Areas in rough priority: (a) broken, (b) owner's explicit wishes,
(c) **graphics/charm — the #1 graphics-pass dimension**, (d) campus-life liveliness & watchable
behaviours, (e) UI/mobile legibility (390px is a RELEASE GATE), (f) balance (debt valve), (g) docs.

Standing owner directives (always in scope):
- **Graphics iterability is architecture:** all visual data in `art.js`, text in `content.js`, tunables in
  CONFIG — art iterations may not touch engine code and vice versa. `tools/gallery.html` renders every
  sprite/animation for review at the live URL; update it when adding art.
- **Fun first:** never freeze the map outside sanctioned modals; spectacle/choice/management/fanfare
  cadence per DESIGN §4.
- **Juice asymmetry is law:** dark payoffs get confetti; virtue gets one quiet nod.
- **Mobile 390px** verified by screenshot before every ship.
- **Campus life is the soul:** students must visibly walk the academy AND DO things (class, căng tin,
  Xưởng, sân, sleep, repair, celebrate). Every new room earns an activity animation.

## Step 1 — Choose the work (track first, then the pick)

Track is already set by Step 0's Cadence read. EPIC turn → The EPIC machinery (dequeue `## Epic backlog`).
POLISH turn → pick the top viable item RANKED THROUGH THE OWNER MODEL; it must clear the rubric FLOOR
(lift an axis to 4+; debt/bugfix exempt). If it can't, it's too small → bundle toward an epic or pick bolder.

- **Creative method = DIVERGE before converge.** For ANY pick touching the #1 visual dimension (sprites,
  buildings, palette, layout, activity look), divergence is MANDATORY: spawn ≥3 parallel subagent drafts
  (worktree-isolated) → screenshot all at 390px via `_renderLiveOnce` → judge against the Bar → ship the
  synthesized winner → DELETE the rest. First-idea-ships is BANNED here. Workflow infra-failure → fall back
  to SEQUENTIAL 3-up, NEVER a single draft. Non-visual picks: 3 candidates, scored.
- **PLAN-FIRST for major features:** a new system, anything multi-iteration, or anything needing UI rework
  → write a named plan in ROADMAP `## Now` first (design decisions, data/engine/UI changes, an explicit
  UI-rework call, phased green steps, verification risk). Small/medium changes skip this — just build.
- Maintenance checks (390px audit, perf glance, a render-crash bot pass) are HYGIENE folded into the
  ~10-firing reflection and STRUCTURE-epics — NOT a standalone "ship." A firing whose only output is
  "audited, no regressions" does NOT count as a ship or advance the ledger.
- **Code-structure review every ~10th iteration** (paired with the Owner-Model reflection): layer
  discipline holding? files outgrowing their remit (>~900 lines wants splitting)? duplicated logic?
  CONFIG/CONTENT still the single source? dead code? naming drift? Output a verdict in ROADMAP
  `## Architecture` and queue at most ONE refactor (ships as its own gated iteration, never smuggled in).

## The EPIC machinery — make a BIG change safely and autonomously

An epic is anything large (UI overhaul, restructure, art-direction pivot, big visual expansion, deleting a
dead subsystem). The machine:
1. **PLAN** — a named ROADMAP `## Epic: <name>`: the goal in one Bar-moving sentence, decided design
   decisions (only ask the owner on a truly load-bearing expensive fork), file/data/engine/UI changes, an
   explicit UI-rework call, phased checkpoints each leaving the tree shippable, verification, rollback. An
   art/UX epic's first phase is a DIVERGENCE workflow.
2. **ISOLATE** — any epic moving ≥~200 lines or restructuring files works in a **git worktree** so a
   half-done restructure never breaks the live tree.
3. **EXECUTE — fan out with a WORKFLOW** when the work decomposes (N modules, N call-sites, N art
   directions). Scale fan-out to the token budget.
4. **PROVE:**
   - Refactor (behavior-neutral): capture BEFORE artifacts on HEAD (gate output; 390px + `_renderLiveOnce`
     screenshots of seeded states), apply, capture AFTER, diff. Byte-identical gates; visually identical
     screenshots. Zero intended change = zero diff.
   - Feature/overhaul (deliberate change): gates green, sweep bands hold if engine touched, 390px
     screenshots READ and LOOK good, score against the rubric — must raise an axis.
5. **MERGE & SHIP** — fold the worktree back, full Step 3 verify on main, then Step 4. Multi-firing epic →
   crisp `## Epic in progress` note (done / next / worktree path) + ship the green safe-so-far checkpoint.

**Temporary visual regression is ALLOWED** on a multi-firing FEATURE-epic checkpoint, as long as the
planned endpoint clears the Bar (the "worse, then much better" art leap). Never leave the live link rough
at an epic's END.

**Where the epic comes from:** dequeue the top `## Epic backlog` entry (if `EPICS_SINCE_STRUCTURE ≥ 2`,
take the top STRUCTURE entry), expand into a `## Epic: <name>` plan, start phase 1. Keep the backlog full
by mining VISION.md + the deferred items in `GRAPHICS-HANDOFF.md` ("Deferred to the graphics pass":
archetype-select start screen, progression/unlock rungs, era period-skins).

## Step 2 — Implement (engineering laws; violations caused production incidents)

- **PRODUCTION ERROR TRAP:** an inline `window.onerror` (sets `document.title='JSERR: '+m+' @'+l` AND shows
  a "tap to reload" banner) must be the FIRST script in `index.html`, before the `js/*.js` tags. A silent
  white-screen on the owner's phone is the worst failure mode; this is the cheapest insurance.
- NEVER an unescaped `"` inside a double-quoted JS string (Vietnamese quotes/hyphens) — kills the script
  at parse; the page shows static HTML and onerror registers too late to catch it.
- Every state field: freshState() default + load() typeof-merge + sanitize() entry. `Number.isFinite`,
  NEVER bare `isFinite`. Schema changes bump S.v with ONE migrator. Index-aligned arrays sanitize with .map
  (null-out), NEVER .filter (filtering shifts indices, reattaching data to the wrong sibling).
- rnd() = mulberry32 on S.rngState for gameplay; Math.random for cosmetics only. The alumni FSM derives
  per-alumnus-per-year streams from S.seed0 (never the live stream) — reloads must not reroll destinies;
  GATE_ALUM enforces byte-identical replay.
- View/state split: sprite positions/paths/frames volatile, never serialized. `rebuildGrid()` after every
  load/sanitize/build/demolish. dayTick() stays pure of (S, rnd) — `__test.days(n)` runs with rendering off.
- ALL constants in CONFIG (a save must not pin a balance number). FSM rows: clamp ≤0.95, row-normalize Σ≤0.95.
- **Pantheon tone law:** honored real names are reverent-only — no honoree name in any phốt/scandal/headline
  string (grep-guard before ship). `.pantheon` CSS class = no jokes inside. Living figures: role-named
  archetypes only, zero wrongdoing attachable.
- **Narrative content is FINAL** (GRAPHICS-HANDOFF law) — the graphics pass styles the *frame*, never the
  words. The open-question law holds in pixels (capstone cuts off; no rendered verdict). Backfill visuals
  where gameplay shipped as placeholder; do NOT cut a feature to fit today's art.
- Layer discipline: art→art.js, text→content.js, mechanics→CONFIG/tables.

## Step 3 — Verify (non-negotiable before any commit)

1. node-parse every script block.
2. `./gate.sh` ALL GREEN — GATE_FRESH (fast-forward through a June), GATE_ADMIT (pool determinism + cap
   arithmetic), GATE_ALUM (FSM replay byte-identical + Trần Phi Lợi beats), GATE_COMPAT (older save migrates
   + plays), GATE_BUILD (occupied placement mutates nothing). When a gate exposes a sim bug, fix the GAME,
   regenerate harnesses from the fixed file (stale copies lie), re-run.
3. Balance: touching CONFIG/FSM/presets/economy ⇒ mirror in engine.js + run the sweep bands (Y1 net
   +8..25tr/th · quota-12 cutoff 20.0–21.5 at boot rep · median first keynote year 7–9 · virtuous-decade
   keynote 45–60% · hollow-Steve <2%).
4. **Visual QA when UI/art changed:** headless screenshots at true 390px (iframe wrapper — headless Chrome
   won't shrink below ~500px) AND 1240px; READ the PNGs and look. Art changes also re-render
   `tools/gallery.html` and screenshot it.
   - **THE LIVING CAMPUS IS SCREENSHOT-VERIFIABLE — USE IT.** Actors/activities draw only in `liveLoop`
     (rAF), which headless throttles, so a plain screenshot shows an EMPTY map. To capture walking students:
     seed a roster, then `__ui.setPeriod(p)` → `__ui._sync(true)` → `__ui._settle(1500)` →
     `__ui._renderLiveOnce(p)` (paints ONE live frame to #mapLive) → screenshot. Periods: 0 sleep, 1 recess
     (sân+football), 2 class, 3 căng-tin, 4 Xưởng/activities (confirm against N_PERIODS/the schedule). ANY
     iteration touching actors/activities/tells/motes/liveliness MUST screenshot this way and LOOK.
5. **LEAVE NO DEBRIS.** Test artifacts (PNGs, `__shot.html`/`__bot.html`, dumped DOM, scratch) are produced
   to verify, then DELETED the same turn. Prefer scratch OUTSIDE the repo (`/tmp/...`). Before every commit
   `git status` must show ONLY intended source/doc changes; if a `.png`/`__*.html`/scratch appears, delete
   it (+ a `.gitignore` pattern for the class).

## Step 4 — Record & ship (BATCHED DEPLOY)

- Update ROADMAP.md (done item out, discoveries in; update `## Cadence`; tick `## Debt`) and CHANGELOG.md
  (PREPEND under the `# Changelog` header — never anchor on the previous entry; put the loop-iter number in
  the heading). The commit body STATES the rubric scores (`Bar: BEAUTY n / JUICE n / FUN n / CLARITY n /
  BITE n / SOUL n`).
- **SHIP CADENCE is BATCHED, not every iteration** (owner "ship after 5-6 iteration"). Develop local on the
  working branch: each iteration `./gate.sh` + commit LOCALLY + verify locally. Every 5–6 ships
  (`SHIPS_SINCE_DEPLOY ≥ 5`) the ship ALSO deploys live via the ROADMAP banner recipe (bump → commit →
  ff-merge working→`main` → push), then reset the counter + poll the live URL for a unique new string.
- **`./bump.sh` is MANDATORY before every deploy commit** — it rewrites `?v=<n>` on the `<script>` tags so
  browser/CDN re-fetch the JS. WITHOUT it the owner sees a stale cached build and thinks nothing changed.

## Step 4.5 — Failure recovery

Two failed fix attempts on one problem → `git checkout` back to HEAD, write the failure + hypothesis under
`## Parked` in ROADMAP.md, pick something else. NEVER ship red gates; NEVER leave the tree broken at turn end.

## Step 5 — Continue the loop

End with a short status: what shipped (rubric scores + which axis lifted to 4+), the `## Cadence` state +
`## Debt` count, what's next, and `OWNER:` lines for any call made on the owner's behalf (these are
veto-bait). The Stop hook re-fires this skill while the flag file exists.

## Step 6 — Evolve the loop (boldly, not just additively)

This skill and EVERY .md are LIVING documents — "living" means REWRITABLE, not append-only.

- **SELF-CORRECTION IS MANDATORY.** This skill IS your behavior; whenever the loop ERRS or DRIFTS, edit
  `SKILL.md` *in the same turn* so the mistake can't recur. Triggers: a gate/screenshot caught a bug you
  should have prevented (add the check/law) · the owner vetoed you (encode the taste in the Owner Model) ·
  you repeated a past mistake (the rule was too weak — strengthen it) · the loop drifted timid/off-vision
  (rewrite the rule that allowed it) · a rule turned out wrong (rewrite or delete). State it as
  `SELF-CORRECTION: …`. A turn that hit a trigger and did NOT edit the skill is incomplete.
- **Rewrite, don't just accrete** — a section that's become wrong is debt; DELETE or rewrite it.
- **PRUNE IRRELEVANT CONTEXT** — this skill reloads in full every firing, so every stale line is a tax.
  Remove superseded rules, one-off notes whose lesson is now a permanent rule, dead landmines, finished
  epics. Keep it LEAN and high-signal. ROADMAP keeps only live work (done items move to CHANGELOG and out).
- **Capture durable lessons immediately** (a new landmine, a better recipe), then fold temporary notes in.
- **Maintain `VISION.md`** and **propose your own epics** (write them as ROADMAP `## Epic:` plans + an
  `OWNER:` line). The loop should generate ambition, not just consume a queue.
- **Owner Model is the through-line** — the ~10-firing reflection re-derives it AND audits boldness (count
  the last 10 ships: if ~zero epics, the cadence is failing — fix it that turn).

## Failure-mode detection → SKILL review

At Step 0, read the last ~8 CHANGELOG entries + recent git log; if one trips, this firing is a SKILL REVIEW
(diagnose the cause, edit SKILL.md to prevent recurrence):
- **TIMIDITY** — ≥4 of the last ships are small additive, zero epics → force an epic, strengthen the rule.
- **THRASH** — same area fixed/reverted repeatedly, or a bug recurred → a missing gate/law; add it.
- **STUCK EPIC** — an `## Epic in progress` carried many firings with no shipped checkpoint → re-plan/split/cut.
- **TASTE MISS** — owner vetoes cluster → the Owner Model failed to predict; sharpen it.
- **QUALITY STALL** — recent rubric scores flat/declining, or green-but-boring → re-point the picks at the Bar.
- **VERDICT DRIFT** — a pantheon name appears near a scandal/waste string, OR a waste-line blames the KID
  not the system → the satire is turning cruel/irreverent; re-balance (pantheon firewall; waste-done-TO-them).
- **DEBT CREEP** — a file blew past its split threshold, a queued refactor rotted N turns, the onerror
  slipped → queue the paydown epic NOW.
- **STALENESS** — the skill itself grew bloated/contradictory/wrong → prune and reconcile.

**The 50-firing SKILL REVIEW** (every ~50 firings, an epic-weight beat): audit the SKILL itself — still
serving the Mission or drifted timid (count epics in the last 50)? re-read VISION.md against what shipped.
PRUNE hard (kill stale rules, resolve contradictions, drop dead landmines). Are the cadences (~5, ~10, ~50)
firing? Rewrite whatever the last 50 firings proved wrong. Log it in the Playbook changelog.

## Landmine log (live hazards only; drop entries for code paths that no longer exist)

- **CACHE STALENESS:** multi-file build loads `js/*.js` by bare path → browsers/Pages CDN cache them, so
  after a push the owner sees the OLD build. FIX: `?v=<n>` on every `<script src>` + `./bump.sh` before
  every deploy. If the owner says a shipped change isn't showing, suspect cache first (`curl` the live JS
  for a unique new string — if it's there, it's their cache: hard-refresh).
- Unescaped `"` in double-quoted JS strings kills the whole script at parse; onerror registers too late.
- NaN serializes to JSON `null`; `isFinite(null)===true`. Always `Number.isFinite`.
- Save-compat: when adding state fields, test-load a seed save LACKING them — the migrator + sanitize must
  fill them. The most dangerous bug class in this codebase family.
- Headless harnesses are generated FROM the game file — after fixing the game, REGENERATE the harness or
  you retest the stale copy.
- Headless Chrome enforces ~500px minimum window width: true-390px = iframe wrapper (`width:390px`).
- Screenshotting CSS animations under `--virtual-time-budget`: `forwards`-fill renders at END state
  (invisible) — pin `animation-play-state:paused`; for FADE-IN use `animation:none!important;opacity:1`.
  Repeated identical events stack pinned elements into a blob — use a single event.
- ACTORS/ACTIVITIES draw only in the rAF `liveLoop` (headless throttles it) → plain screenshot shows an
  EMPTY campus. Use `_renderLiveOnce` (Step 3.4 recipe). If still empty: call `_settle` BEFORE
  `_renderLiveOnce`, confirm a roster exists + the right period is set.
- Never wipe document.body in a harness intercept — the render loop crashes on missing elements and that
  JSERR masks your test. Overlay `position:fixed` instead. Hide `#toasts` when a rich seed fires events.
- Bot recipes: assert actions HAPPENED (bought>0, alumni ticked) — a dead selector passes silently. Shop
  items may be DIVs, not buttons. First graduates appear ~year 6, so a smoke test must run ≥6 sim-years
  (≥~2160 dayTicks; `DAYS_PER_MONTH 30 → 360 days/year`) before asserting `META.graduated>0`.
- Features that insert a step into the canonical fresh-boot flow break GATE_FRESH BY DESIGN — update the
  gate's flow in the same commit.
- Extending a content array: grep for the OLD length as a bare literal first (counts get hardcoded in
  far-apart places: sanitize bounds, slices, away-checks).
- Bulk python in-place transforms invalidate the Edit tool's tracking — Read a small slice after, or
  sequence bulk transforms last.
- This project: occupancy grid + sprite view are DERIVED — any path mutating S.rooms/students without
  `rebuildGrid()`/actor-respawn corrupts silently until next boot.
- This project: alumni annMonth must never be 6 (June belongs to students); sanitize recomputes violations.
- This project: grep honoree names against phốt/headline banks before ship
  (`grep -l 'Trần Đại Nghĩa\|Tạ Quang Bửu\|Hồ Xuân Hương'` must return nothing).
- AUTONOMOUS-REFACTOR is ENCOURAGED via THE EPIC MACHINERY (worktree + workflow + BEFORE/AFTER
  byte-identical diff), not avoided. Don't dodge the big restructure for a safe sliver.
- AUDIO is owner-verified, not screenshot-verified: assert "no JSERR across all state-moods + init +
  persist + autoplay-unlock"; the aesthetic is judged on the live link. Keep audio defensive (try/catch
  every scheduler; any failure silently disables).
- **DIVERGENCE-WORKFLOW:** don't put large CODE in a structured-output `schema` field (it hangs the
  StructuredOutput return). Divergence agents return the screenshot PATH + a short description via schema
  (small fields only), WRITE source to a file; PNGs land on disk before the result, so you can judge even
  if the result stalls. After picking, spawn ONE reproduce-agent to regenerate the winner's drop-in code as
  PLAIN TEXT in its final message.
- **STRUCTURE-EPIC, finding the seam:** when a review says a big file has "no clean leaf," CHECK FOR A LEAF
  LEFT BEHIND BY A PRIOR PARTIAL EXTRACTION before forcing a coupled split (the sprite bakery left in ui.js
  → `js/sprites.js` was a clean one-directional factory). The cadence forces A structure move, not a
  specific one — pick the cleanest real seam and record the swap.
- **STRUCTURE-EPIC, proving byte-identity:** for a refactor moving DETERMINISTIC drawing/baking code
  verbatim, the gold standard is a PIXEL HASH matching before & after (render to canvas →
  `getImageData(...).data` → FNV-1a hash → record → refactor → assert identical). Combine with `./gate.sh` +
  `./bot.sh` + a 390px screenshot + exercising any player-only path the bot skips (e.g. the look customizer).

## Playbook changelog (condensed; full history in git)

- 2026-06-13: skill created from the Nuôi Anh improve-game playbook. Added the ~10th-iter code-structure
  review + "architecture as a living deliverable." Raised the GRAPHICS bar; established
  explore→judge→synthesize as the standing method for visual work.
- 2026-06-13 (LOOP REDESIGN + ENFORCEMENT LAYER): diagnosed the loop as locally-productive but globally
  TIMID; rewrote the core to a MISSION + TWO TRACKS + the EPIC MACHINERY + the Bar rubric (binding floor) +
  DIVERGENCE-by-default. Converted intentions to HARD MECHANISMS: a counted `## Cadence` ledger
  (HARD-LOCKS the track), FEATURE/STRUCTURE epic split, a VISION-mined `## Epic backlog`, the failure-mode
  detector + 50-firing review. The living campus became screenshot-verifiable (`_renderLiveOnce`).
- 2026-06-13/14 (the long autonomous run, iters 60–92): the redesign WORKED (epics shipping, debt down,
  counters firing, onerror caught a real regression). Shipped BGM, weather, the Cúp Khoa epic, khoa
  identity, the sprites.js STRUCTURE epic, alumni biographies, campus-social-life; added `bot.sh`.
  MATURITY-PLATEAU lesson: at maturity + owner-absence the remaining epics turn taste-blocked or
  low-value/high-risk — resolve the epic slot via the review-that-defers, keep shipping safe value, await
  owner steer (don't manufacture make-work).
- 2026-06-14 (PEOPLE-FIRST REORIENTATION): owner judged the mature game's SPIRIT "not quite good" and
  steered from surface to SOUL → a separate **`improve-steve-gameplay`** skill now owns the active arc with
  art FROZEN. This graphics-pass skill was PARKED. It resumes only after that arc EXITS (a measured +
  owner-confirmed gate). On resume, the SOUL rubric axis keeps the visuals serving the person-sim; the
  inherited worklist is `GRAPHICS-HANDOFF.md` + `docs/ART-PIPELINE.md`.
