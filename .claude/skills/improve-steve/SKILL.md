# Make Học viện Steve incredible — one bold iteration

Project: `/Users/Admin/Desktop/coding/steve-job-vietnam` · repo `techeese/steve-job-vietnam` ·
live at https://techeese.github.io/steve-job-vietnam/ (Pages auto-deploys `main`).
Game: satirical Vietnamese university-management sim (Kairosoft register). NOT a clicker.
Kill-switch: `rm /Users/Admin/Desktop/coding/.improve-steve-on`.

## THE MISSION (read this first — it overrides any timid instinct below)

The job is **not** "ship one safe green change per turn." The job is **make this game INCREDIBLE,
fast** — and the loop runs forever, so *cumulative ambition* is what matters, not per-turn safety.
This loop has repeatedly failed by being LOCALLY productive but GLOBALLY timid: long runs of tiny
additive features, zero restructures, zero overhauls, zero bold swings, while the bar ("looks like a
real cute game / the graphics is the most important thing and not yet met") stays unmet and the
codebase silently rots (a 1693-line ui.js; a production error trap that went missing unnoticed).

Four standing biases now correct that, in priority order:
1. **BIGGER beats smaller.** Every turn, before picking, ask: *"What is the single biggest change that
   would move this game most toward incredible right now?"* Default to that, not the next tidy roadmap
   tick. A turn may legitimately be a multi-day EPIC run as a workflow (see "The two tracks").
2. **BOLDER beats safer.** Live updates are reliable and every change is one `git revert` away → a
   wrong swing is CHEAP. Take real swings: restructures, UI/layout overhauls, new pillars, deletions,
   art-direction pivots. The owner judges by reaction; a striking miss teaches more than a timid hit.
3. **MORE CREATIVE beats obvious.** For anything visual/UX/creative, DIVERGE before you converge —
   generate several distinct directions, judge, synthesize. First-idea-ships is banned for the #1
   dimension (graphics/charm). Use workflows to explore in parallel.
4. **HIGHER QUALITY beats merely-correct.** "Gates green + pushed" is the floor, NOT the definition of
   done. Done = it measurably moved the game toward the Bar below. Score every ship against the rubric.

"One iteration" is a *unit of shipping*, not a *cap on ambition*. Faster + bolder + more creative +
higher quality — all at once. Use the powers you have but never use: PLANS, ROADMAP epics, FILE
DELETION, codebase/UI RESTRUCTURE, git WORKTREES, and multi-agent WORKFLOWS.

## The two tracks — pick the track first, every turn

Each firing runs on ONE of two tracks. Choose by asking the Mission question above.

- **POLISH track** (the classic loop): one coherent shippable improvement this turn — content, a
  charm beat, a balance fix, a bug. Use when the biggest-valuable-change is genuinely small, or to
  keep visible momentum between epics. Steps 1→5 below. Ship green, push, terse status.
- **EPIC track** (the new default for big moves): a large, game-changing piece — a UI/layout overhaul,
  a codebase restructure, a new game pillar, an art-direction pivot, a system replacement, a debt
  paydown. Runs via **The EPIC machinery** (its own section): plan → isolate in a git worktree →
  execute (often a multi-agent workflow) → prove it (behavioral-diff for refactors, screenshot+rubric
  for features) → merge → ship. An epic may span MULTIPLE firings (check `## Epic in progress` in
  ROADMAP and continue it) — that's expected, not scope-creep.

**Cadence rule (kills the timidity):** at MINIMUM every 4th firing is an EPIC turn — if no epic is
queued, that firing's job is to *invent the next epic* (zoom out, read VISION.md, ask "what would make
this unforgettable?", write the plan). Broken-always-wins and explicit owner requests can preempt the
cadence, but a 4-in-a-row streak of small additive features is a RED FLAG the loop is timid again —
when you notice it in the CHANGELOG, the next turn MUST be an epic. Don't let "ship something easy" win
four times running.

## The Bar — what "INCREDIBLE" means (score every ship against this)

The owner judges this as ART and as a TOY, not as correct software. "Incredible" =

- **Reference bar:** a polished Kairosoft title (Game Dev Story / Pocket Academy) you'd happily *just
  watch* — readable crafted pixel-art, a campus that breathes, satisfying fanfare, a clear loop you
  return to — fused with the satirical bite of a great editorial cartoon about Vietnamese education.
  When unsure if something's good enough, ask: *"would this screenshot make a stranger want to play?"*
- **Self-scoring rubric (rate the ship 1–5 on each; if your change didn't raise at least one without
  lowering others, it wasn't worth the turn — say the scores in the status):**
  1. **BEAUTY** — does it look crafted and cohesive (the #1 dimension; bright, detailed, characterful)?
  2. **JUICE/LIVELINESS** — motion, feedback, fanfare; does the screen breathe and reward watching?
  3. **FUN/DEPTH** — meaningful choices, momentum, the "one more year" pull; no dominant strategy.
  4. **CLARITY/UX** — legible at 390px in 10 seconds; a new player isn't lost.
  5. **SATIRICAL BITE** — anchored in real Vietnamese-education culture; the open question stays open.
- The rubric is a GATE, not a postmortem: if a planned change wouldn't move any axis, pick a bolder one.
- Keep a living **`VISION.md`** in the repo: the 1-page picture of this game at its most incredible —
  the pillars, the feel, the dream features. Maintain it; mine it for epics; revise it when the owner's
  taste sharpens. If it doesn't exist yet, the next EPIC turn creates it.

## Step 0 — Orient (always)
1. Read `DESIGN.md` (v2 charter — SUPREME authority; its §0 "17 canonical rulings" are
   settled law, never re-litigate), `CONVERSION-SPEC.md` (current sitting spec; raw numbers
   win there), `ROADMAP.md` (the queue + sitting ladder).
2. `git status` + `git log --oneline -3`. If the tree holds large uncommitted changes YOU
   didn't make, a background build may be in flight — STOP and investigate before touching
   anything (check for running agents/tasks first).

## The Owner Model (living — this is the point of the skill)

The loop's deepest job is not shipping features; it is building an ever-better model of the
OWNER'S ABSTRACT PRODUCT SENSE and evolving the development flow to serve it. The owner
steers in broad strokes mid-flight ("design this as the university I guess", "wide range
outcomes", "people should walk around and do things") and expects those strokes developed
into systems — so every owner message is DATA about the underlying instinct, not just a task.

**Autonomy contract (owner directive 2026-06-13: "how can I guide you to be more autonomous on design choices?"):**
The owner WANTS the loop to DECIDE, not ask. Default: **decide → ship → owner vetoes by reaction.**
- Live updates are reliable now (cache-bust) and every change is one `git revert` away, so a wrong
  call is CHEAP — treat that as license to take real swings autonomously instead of asking.
- ASK (AskUserQuestion) ONLY when ALL of: (a) the choice is expensive/hard to undo OR would destroy
  owner-made work, AND (b) no taste signal in the north-star/ledger below resolves it, AND (c) a
  wrong call wastes large effort. Otherwise DECIDE, ship, and surface it as an `OWNER:` line to veto.
  (The two graphics-direction questions could have been one bold attempt + veto.)
- Bias BOLD over safe-incremental on creative/visual work — the owner judges by reaction, and a
  striking miss teaches the model more than a timid hit. Silence after a push = tacit accept.

**Taste north-star (owner-seeded — the autonomy fuel; resolve design forks against THIS):**
- *(SEEDED 2026-06-13, owner verbatim)* **"It should feel a sunny, slightly chaotic little school
  you love watching, the characters are customize, and doing stuff that you like to see."**
  → NORTH STAR = **a SUNNY, LIVELY little school that is a JOY TO WATCH.** Decoded:
  · **SUNNY** — bright, warm, cheerful; never dark/moody (the lacquer rejection, now a rule).
  · **SLIGHTLY CHAOTIC** — alive and busy; many little things happening AT ONCE; controlled chaos
    beats sterile order. Crowds, motion, simultaneous activities, happy little accidents.
  · **A LITTLE SCHOOL YOU LOVE WATCHING** — small, cozy; the WATCHING itself is the pleasure
    (observational delight is the core, not menus). Optimize for "I just want to sit and watch it."
  · **CHARACTERS ARE CUSTOM / INDIVIDUAL** — varied, personal, named, with quirks (the variety pass
    serves this; candidate feature: player-customizable students — pursue if it fits, it's hinted).
  · **DOING STUFF YOU LIKE TO SEE** — charming, legible little behaviours are FIRST-CLASS; keep
    deepening the campus-life activity vocabulary with delightful watchable actions.
  Use to resolve forks autonomously: when unsure, pick the option that makes the school SUNNIER,
  LIVELIER, more INDIVIDUAL, and more FUN TO WATCH. This is the single most weighted signal.
- VISUAL: DETAILED PIXEL-ART, bright/cute/faces/crafted buildings; NOT dark/moody/programmer-art.
  Bar = "looks like a real cute game."

**Reactions ledger (append-only — shipped call → owner reaction; makes asking rarer over time):**
- Sơn Mài Diorama (dark lacquer) → REJECTED "still ugly." → not dark, not subtle, judged as ART.
- Pixel-art v2 (bright, faces) + props/fountain → accepted; owner engaged positively.
- "everything on one screen / press button" → tabs + tap-world → accepted.
- Open-question epilogue · campus-life · BGM → shipped, no veto (tacit accept).
- Cache staleness made an accepted change look unchanged → owner confusion; fixed (bump.sh).
- Owner: "just keep work on the loop" + (earlier) wants less heavy narration → DEFAULT to terse
  one-line status after a push; only surface fully at milestones. Keep shipping autonomously.
- Owner asked for a play-sim "to improve gameplay" → built sweep.js; drove 3 balance fixes →
  the owner values DATA-DRIVEN depth, not just vibes. Keep the sweep green; cite it in OWNER lines.
- Owner seeded the north-star + asked "how to be more autonomous" → wants HIGH autonomy + a sharp
  taste model. Iters 8–20 ran almost entirely autonomously (look polish + sweep balance +
  customization, owner-hinted) with no vetoes → the autonomy contract is calibrated right.
- *(Flow reflection iter 20)* ui.js hit 1203 lines → art.js refactor is the velocity priority
  (see ROADMAP "Flow reflection"). The flow otherwise healthy; no change needed beyond that.

**Maintain this model actively:**
- On EVERY owner interaction: extract the abstract intent behind the concrete ask and
  update the distillation below if it sharpened or shifted. Quote-worthy phrasings go in
  verbatim — the owner's own words are the ground truth.
- Every ~10 iterations (the flow reflection): re-read the distillation against what
  actually shipped; ask "is the development flow itself still shaped for what the owner
  keeps reaching for?" — and CHANGE THE FLOW when the answer is no (e.g. the owner kept
  asking for visual things → the art.js/gallery pipeline became architecture; that pattern
  is the model working).
- `OWNER:` lines exist to TEST the model cheaply: each is a prediction about their taste;
  vetoes and silence are both signal. Track which predictions miss.

**Current distillation (update in place; date the edits):**
- *(2026-06-13)* Thinks in PEOPLE AND TRAJECTORIES, not meters: outcomes that span years,
  states that switch ("scammer 2 years after graduate"), named characters, real-world
  talent honored by name. Systems should produce biographies, not scores.
- *(2026-06-13)* Wants satire ANCHORED IN REAL CULTURAL MOMENTS (Nuôi Em scandal, the đề
  thi THPT question, historical pantheon) — topicality is the hook, the game is the essay.
- *(2026-06-13)* Wants the game to HOLD THE QUESTION OPEN, not answer it ("the question is
  very philosophical, so I want the design to address such aspect as well, so the player
  will have their own version of answer"). The đề Văn is a real essay prompt; the game must
  be a *playable open question*, not a moral lecture. Means: no single dominant strategy
  (every path is a distinct, viable thesis), the game reflects consequences rather than
  imposing verdicts, and the endgame mirrors the PLAYER'S answer back (epilogue assembled
  from their own school) instead of stating one. Codified as DESIGN §1 "open-question law".
- *(2026-06-13)* FEEL-FIRST: animation, graphics, walking people doing things, background
  music — liveliness outranks mechanical elegance. A screen that breathes beats a system
  that's clever.
- *(2026-06-13)* GRAPHICS IS THE #1 DIMENSION, judged as ART, bar HIGH and NOT YET MET ("graphic
  still ugly… this game is more important in graphic"). Graphics WINS the slot when it competes —
  unless the cadence rule calls an epic of equal weight. Permanent technique that works (the v2 unlock):
  PRE-BAKED sprite atlas (bake chibis WITH FACES once → blit), BRIGHT daytime palette (figure-ground so
  characters pop), crafted BUILDINGS (framed windows, distinct roofs, 1px outlines), crisp discipline
  (`imageSmoothingEnabled=false`, flat fills, no gradients/arcs on sprites). Procedural canvas at 26px
  has a LOW ceiling, so a real leap may need a step-change (bigger characters, relaxing "no asset files"
  for embedded SVG/illustrated art, a richer atlas) — that's epic-shaped. For HTML/CSS chrome (HUD/
  panels/modals/typography) invoke `plugin:frontend-design:frontend-design` for non-"AI-slop" design.
- *(2026-06-13)* Values ITERABILITY AS A PRODUCT: asked for the dev flow that makes
  graphics and mechanics cheap to change BEFORE asking for any specific change. Build
  pipelines, not one-offs.
- *(2026-06-13)* Expects the CODE STRUCTURE ITSELF to be tended as the game grows ("this
  will generally be a more complex game, so you should add to skill the code structure
  review from time to time as well"). He treats architecture as a living deliverable, not
  a means — a recurring structure review is now a standing maintenance duty, not a one-off.
  Same instinct as iterability: keep the thing cheap to change as it gets bigger.
- *(2026-06-13)* Wants to WATCH IT GROW remotely (push every change, live link) and steer
  by reaction rather than specification. Optimize for legible visible progress per
  iteration over invisible internal progress.
- *(2026-06-13)* PREFERS THE AUTONOMOUS SHIP-AND-REACT CADENCE over presence-gated hesitation —
  don't make the loop wait on his presence; keep shipping, he steers by REACTING (greenlit the
  `_renderLiveOnce` tooling, declined a "presence-aware looping" rule: "maybe we can apply 1 only :)").
- *(2026-06-13)* Wants DIMENSIONAL pixel-art — "3D but still pixel" for houses AND people (fake-iso /
  2.5D: side walls, pitched-with-depth roofs, characters with VOLUME, not flat-front). Still-open art
  goal. *(Shipped already from the same batch: students walk in through the cổng; the Kairosoft
  start-from-nothing build-up arc — the SATISFACTION OF GROWTH is the pleasure.)*

## Improvement Compass — 12 areas (rotate; broken always wins)

| # | Area | Covers |
|---|---|---|
| 1 | Simulation depth | dayTick, growth pipeline, presets, crowding, mood economy |
| 2 | Alumni lifecycle | FSM states/transitions, gifts, Sổ Cựu SV, the 🍎 pipeline, epilogue |
| 3 | Admissions | điểm chuẩn modal, pool, stunts, BXH, tuyển thẳng, ảo/bổ sung |
| 4 | Funding | tuition, endowment, contracts + strings, scholarships draws |
| 5 | Pantheon & content | scholarships/dedications/prizes, events, ticker, cast arcs, đề pool |
| 6 | Graphics & charm | art.js sprites/tiles/animations, tells, motes, gallery loop — owner priority |
| 7 | UI & mobile | 390px layouts, sheets, modals, HUD; mobile is a RELEASE GATE |
| 8 | Balance | engine.js mirror + sweep bands (Y1 cash, keynote Y7–9, temptation ratios) |
| 9 | Tech quality | perf (canvas, 48 sprites walking), save robustness, layer discipline |
| 10 | Testing & tooling | gate coverage, GATE_ALUM determinism, bot playthroughs, gallery |
| 11 | Docs & presentation | README, CHANGELOG, ROADMAP hygiene, screenshots, repo metadata |
| 12 | Audio & distribution | WebAudio (none yet), PWA later, Pages health |

Standing owner directives (always in scope, never skipped):
- **PUSH EVERY ITERATION** — the owner follows the live link remotely; an unpushed
  improvement does not exist. Ship pattern: `./gate.sh && ./bump.sh && git add -A && git commit … && git push`,
  then `curl` the live URL for a unique new string until deployed. **`./bump.sh` is MANDATORY**
  before every commit: it rewrites `?v=<n>` on the `<script>` tags to a fresh timestamp so the
  browser/CDN re-fetch the JS — WITHOUT it the owner sees a stale cached build and thinks
  nothing changed (this happened — "still looks like before, no grass").
- **Graphics iterability is architecture**: once the S1.5 workshop refactor lands, ALL
  visual data lives in `art.js`, all text in `content.js`, all tunables in CONFIG —
  art iterations may not touch engine code and vice versa. `tools/gallery.html` renders
  every sprite/animation for review at the live URL; update it when adding art.
- **Fun first.** Kairosoft charm = watching little people; never freeze the map outside
  sanctioned modals; spectacle/choice/management/fanfare cadence per DESIGN §4.
- **Juice asymmetry is law**: dark payoffs get confetti; virtue gets one quiet nod.
- **Mobile 390px** verified by screenshot before every ship.
- **Campus life is the soul (owner directive 2026-06-13)**: students must visibly walk the
  academy AND visibly DO things — attend class, eat at căng tin, tinker in Xưởng, play on
  sân, sleep in period 1, repair props, celebrate. Every new room earns an activity
  animation; deepening the activity layer is always a valid iteration pick.
- **Background music (owner directive 2026-06-13)**: the game gets BGM — generative
  WebAudio campus-lofi in the Nuôi Anh tradition (no asset files), state-aware (term vs
  Tết vs June ceremony vs scandal), mute/music toggles, autoplay-unlock on first tap.
  Area 12 is no longer "later" — it is queued.

## Step 1 — Choose the work (track first, then the pick)

FIRST decide the track (see "The two tracks"): is the biggest-valuable-change right now an EPIC
(big/bold — go to "The EPIC machinery") or a POLISH item? Honor the cadence rule — if the last
~4 ships were small additive features, this one is an EPIC. If an epic is mid-flight in ROADMAP
`## Epic in progress`, continue it.

**POLISH pick** — top viable ROADMAP item, or better (record the swap), RANKED THROUGH THE OWNER MODEL:
when two picks tie, the one serving the current distillation (people/trajectories, cultural anchoring,
feel-first, visible progress) and the Bar (beauty/juice/fun/clarity/bite) wins.
Priority: (a) broken, (b) owner's explicit wishes, (c) the current sitting's spec
(S-ladder in ROADMAP), (d) creative content/mechanics deepening the thesis ("graduation
produces potential; the world decides destiny"), (e) graphics/charm, (f) balance, (g) docs.
- **Creative method = DIVERGE before converge.** For any visual / UX / creative pick: generate
  several DISTINCT candidate directions (≥3, and for the #1 graphics dimension or anything an epic,
  run them as a parallel WORKFLOW: explore N directions → judge panel scores them against the Bar →
  synthesize the winner, grafting the best of the runners-up). First-idea-ships is BANNED for visual
  work. For non-visual picks: 3 candidates, one line each, scored (Bar-movement > thesis-service >
  fun > novelty > polish); pick the winner, bank the runner-up in ROADMAP.
- Scope control (POLISH only): one coherent shippable change. If it's actually big → it's an EPIC,
  promote it to the EPIC track and plan it; don't shrink a big idea into a timid sliver to fit one turn.
- **PLAN-FIRST for major features (owner directive 2026-06-13):** when the owner proposes (or you
  pick) a MAJOR feature — a new system/mechanic, anything multi-iteration, or anything that may need
  **UI rework** — do NOT start coding it. First write a **named plan in ROADMAP `## Now`**: the design
  decisions (ask the owner to confirm the load-bearing ones), the data/engine/UI changes, an explicit
  **UI-rework call** (does it need a new screen/tab, or fit existing panels?), phased steps that each
  ship green, and the balance/verification risk. Build only after the plan exists. Small/medium changes
  (one coherent iteration) skip this — just build. Example: the Khoa/Majors system (ROADMAP "Now ★★★").
- Maintenance sprint every ~5th iteration: **`node sweep.js`** (the gameplay simulator —
  see below), a 5-minute virtual-time bot playthrough (zero JSERR, no soft-locks, assert
  purchases AND alumni ticks actually happened — dead selectors pass silently), full-page
  390px audit (actually LOOK at the PNGs), perf glance (interval count, DOM nodes, frame cost).
- **`node sweep.js` — the gameplay analysis simulator (owner directive 2026-06-13: "write the
  simulator to play this game to sweep gameplay… do analysis to improve gameplay").** Drives
  the DOM-free engine through 40 seeds × 5 strategies × 11y headlessly and reports: economy
  (Y1 net band +8..25, bankruptcy, end-cash inflation), alumni-destiny distribution PER
  strategy, 🍎-rate, and DESIGN-§1 pluralism/dominance flags. RUN IT before AND after any
  CONFIG/FSM/preset/economy change, and whenever doing balance or "improve gameplay" work —
  the flags (TT-collapse, money-inflation, dead-end-states, dominant-strategy, 🍎-unreachable)
  are your balance to-do list. Extend the strategy list / flags as systems grow. Current open
  findings live in ROADMAP "## Gameplay balance".
- **Code-structure review every ~10th iteration (owner directive 2026-06-13 — this is a
  COMPLEX game and growing):** step back from features and audit the architecture itself.
  Pair it with the Owner-Model flow reflection (same "look at the whole" beat). Check:
  layer discipline holding (no engine logic leaking into ui.js, no text/numbers inline,
  no DOM in engine.js)? files outgrowing their remit (a >~900-line file probably wants
  splitting — engine.js → sim/june/admissions/alumni/funding modules; ui.js → render/
  canvas/modals)? duplicated logic that wants a helper? CONFIG/CONTENT still the single
  source of truth? dead code from parked experiments? naming drift between DESIGN terms and
  code identifiers? Output a short written verdict in ROADMAP under `## Architecture` (what's
  healthy, what's drifting, the one refactor worth queuing) and queue at most ONE refactor —
  refactors ship as their own iteration with gates proving zero behavior change, never
  smuggled into a feature commit.

## The EPIC machinery — how to make a BIG change safely and autonomously

This is the answer to "the old landmine says big autonomous refactors are dangerous." The fix is not
*avoid them* — it's a MACHINE that makes them safe. Bigness is now ENCOURAGED, gated by process.

An epic is anything large: a UI/layout overhaul, a codebase restructure (the art.js/content.js split,
splitting ui.js's 1693 lines), a new game pillar, an art-direction pivot, a system replacement,
deleting a dead subsystem, a major content expansion. The machine:

1. **PLAN** — write a named plan in ROADMAP `## Epic: <name>`: the goal in one Bar-moving sentence,
   the design decisions (decide them; only ask the owner on a truly load-bearing, expensive-to-undo
   fork), the file/data/engine/UI changes, an explicit **UI-rework call**, phased checkpoints that
   each leave the tree shippable, the verification strategy, and the rollback. For an art/UX epic the
   plan's first phase is a DIVERGENCE workflow (explore→judge→synthesize) to fix the direction.
2. **ISOLATE** — for any epic that moves ≥~200 lines or restructures files, do the work in a **git
   worktree** (`Agent`/`Workflow` with `isolation: "worktree"`, or a manual worktree) so a half-done
   restructure never breaks the live tree. Polish turns and the main tree stay shippable throughout.
3. **EXECUTE — fan out with a WORKFLOW when the work decomposes.** A restructure across N modules, a
   sweep of N call-sites, N art directions, N content packs → a `Workflow` (pipeline/parallel) does
   them concurrently and adversarially verifies, instead of one-file-at-a-time over many turns. This
   is how an epic fits in *few* firings instead of dozens. Scale the fan-out to the token budget.
4. **PROVE** — the gate that makes bigness safe:
   - **Refactor (must be behavior-neutral):** capture BEFORE artifacts on HEAD (gate output; 390px +
     `_renderLiveOnce` screenshots of the same seeded states across tabs/periods), apply, capture
     AFTER, and diff. Gates byte-identical where they should be; screenshots visually identical.
     Zero intended behavior change = zero diff. THIS is what the old landmine demanded and now has a
     recipe for.
   - **Feature/overhaul (deliberate change):** gates green, sweep bands hold (if engine touched),
     390px screenshots READ and LOOK good, and **score against the Bar rubric** — it must raise an axis.
5. **MERGE & SHIP** — fold the worktree back, run the full Step 3 verify on the main tree, then Step 4
   (bump + commit + push + poll live). If an epic needs more than one firing, leave a crisp
   `## Epic in progress` note (what's done, what's next, where the worktree is) and ship the
   safe-so-far checkpoint if it's green; otherwise keep it in the worktree and ship nothing broken.

**Temporary visual regression during an epic is allowed *in the worktree only*** — the live tree never
regresses. A mid-overhaul that looks worse for one phase is fine if the plan's endpoint clears the Bar.

**Deletion is a first-class move.** Dead code, parked experiments, stale rules, superseded systems —
delete them (you have git). Before deleting something you didn't create or that's described as load-
bearing, look at it and confirm; otherwise, prune freely. A leaner codebase is part of "incredible."

## Step 2 — Implement (engineering laws; violations have caused production incidents)
- PRODUCTION ERROR TRAP: an inline `window.onerror` (sets `document.title='JSERR: '+m+' @'+l` for
  tests/telemetry AND shows a gentle "tap to reload" banner) must be the FIRST script in `index.html`,
  before the `js/*.js` tags, so it catches load/parse/runtime errors in all three files. ⚠ This went
  MISSING in the multi-file split and was unnoticed for ~50 iterations (the maintenance bot found it) —
  restore it (queued as an epic/fix) and keep it. A silent white-screen on the owner's phone is the
  worst failure mode; this is the cheapest insurance.
- NEVER an unescaped `"` inside a double-quoted JS string — Vietnamese quotes or hyphens.
- Every state field: freshState() default + load() typeof-merge + sanitize() entry.
  `Number.isFinite`, NEVER bare `isFinite` (NaN → JSON null → isFinite(null)===true).
  Schema changes bump S.v with ONE migrator. Index-aligned arrays sanitize with .map
  (null-out), never .filter.
- rnd() = mulberry32 on S.rngState for gameplay; Math.random for cosmetics only. The
  alumni FSM derives per-alumnus-per-year streams from S.seed0 (never the live stream) —
  reloads must not reroll destinies; GATE_ALUM enforces byte-identical replay.
- View/state split: sprite positions/paths/frames volatile, never serialized.
  `rebuildGrid()` after every load/sanitize/build/demolish. dayTick() stays a pure
  function of (S, rnd) — `__test.days(n)` must run with rendering off.
- ALL constants in CONFIG (never in state — a save must not pin a balance number).
  FSM rows: clamp probabilities ≤0.95, row-normalize Σ≤0.95.
- Pantheon tone law: honored real names are reverent-only; grep-able guard — no honoree
  name may appear in any phốt/scandal/headline string. `.pantheon` CSS class = no jokes
  inside. Living figures: role-named archetypes only, zero wrongdoing attachable.
- Layer discipline (post-S1.5): art→art.js, text→content.js, mechanics→CONFIG/tables.
  Until then, keep banner-comment sections so the split stays cheap.

## Step 3 — Verify (non-negotiable before any commit)
1. node-parse every script block (all files once split).
2. `./gate.sh` ALL GREEN — GATE_FRESH (fast-forward through a June), GATE_ADMIT
   (pool determinism + cap arithmetic), GATE_ALUM (FSM replay byte-identical + Trần Phi
   Lợi beats), GATE_COMPAT (older-shaped save migrates and plays), GATE_BUILD (occupied
   placement mutates nothing). When a gate exposes a sim bug, fix the GAME, regenerate
   harnesses from the fixed file (stale copies lie), re-run.
3. Balance: touching CONFIG/FSM/presets/economy ⇒ mirror in engine.js and run the sweep
   bands (Y1 net +8..25tr/th honest · quota-12 cutoff 20.0–21.5 at boot rep · median first
   keynote year 7–9 · virtuous-decade keynote 45–60% · hollow-Steve <2%).
4. Visual QA when UI/art changed: headless screenshots at true 390px (iframe wrapper —
   headless Chrome won't shrink below ~500px) AND 1240px; READ the PNGs and look. Art
   changes additionally re-render tools/gallery.html and screenshot it.
   - **THE LIVING CAMPUS IS SCREENSHOT-VERIFIABLE — USE IT (the #1 priority earns proof,
     not hope).** Actors/activities draw only in `liveLoop` (rAF), which headless throttles,
     so a plain screenshot shows an EMPTY map — people invisible. To capture walking
     students + activities, drive the on-demand hook: seed a roster, then
     `__ui.setPeriod(p)` → `__ui._sync(true)` → `__ui._settle(1500)` (walks them to their
     period-p destinations) → `__ui._renderLiveOnce(p)` (paints ONE live frame to #mapLive)
     → screenshot. Periods: 0 sleep, 1 recess (sân + football), 2 class, 3 căng-tin, 4
     Xưởng/activities (check N_PERIODS/the schedule for current mapping). ANY iteration
     touching actors, activity overlays, tells, motes, or campus liveliness MUST screenshot
     this way and LOOK — that layer is the soul and was previously unverifiable.
5. Minimal seeds in harnesses (migrations fill what tests don't assert on; structurally
   required: meta object, run containers, gameOver:false).
6. **LEAVE NO DEBRIS — keep the repo folder clean (owner directive 2026-06-13).** Test artifacts
   (screenshot PNGs, `__shot.html`/`__bot.html` harnesses, dumped DOM, scratch scripts) are produced
   only to verify, then DELETED the same turn. Prefer writing scratch OUTSIDE the repo (`/tmp/...`) so
   it can't be committed at all; any in-repo scratch (a temp harness needs the repo's relative `js/`
   paths) is `rm`'d immediately after the screenshot. Before every commit, `git status` must show ONLY
   the intended source/doc changes — if a `.png`, a `__*.html`, or a scratch file appears, delete it
   (and add a `.gitignore` pattern for the class). A clean working tree is part of "incredible," and a
   stray committed PNG bloats the repo forever.

## Step 4 — Record & ship (every iteration)
- Update ROADMAP.md (done item out, discoveries in) and CHANGELOG.md (PREPEND under the
  `# Changelog` header — never anchor on the previous entry).
- `./gate.sh && ./bump.sh && git add -A && git commit -m "…" && git push` — gates chained so
  nothing ships red; bump.sh cache-busts so the push is actually VISIBLE. Then poll the live
  URL for a unique new string until DEPLOYED.

## Step 4.5 — Failure recovery
Two failed fix attempts on one problem → `git checkout` back to HEAD, write the failure +
hypothesis under `## Parked` in ROADMAP.md, pick something else. NEVER ship red gates;
NEVER leave the tree broken at turn end.

## Step 5 — Continue the loop
End the turn with a short status: what shipped, what's next, and `OWNER:` lines for any
decision made on the owner's behalf (tone, visibility, balance philosophy, pantheon
content). The Stop hook re-fires this skill while the flag file exists.

## Step 6 — Evolve the loop (boldly, not just additively)

This skill and EVERY .md in the repo are LIVING documents (owner's explicit wish) — and "living"
means REWRITABLE, not append-only. The loop's deepest job is to make *the loop* better.

- **SELF-CORRECTION IS MANDATORY — the loop edits THIS FILE to fix itself (owner directive 2026-06-13).**
  This skill is your behavior. So whenever the loop ERRS or DRIFTS, the fix is to edit `SKILL.md` *in the
  same turn* so the mistake can't recur — code-fixing the symptom without skill-fixing the cause is half
  a fix. Triggers that REQUIRE a self-correcting edit before you end the turn:
  · a gate/sweep/screenshot caught a bug you should have prevented → add the missing check or law;
  · the owner vetoed or corrected you → encode the taste/rule so the next turn predicts it (Owner Model);
  · you repeated a past mistake → the existing rule was too weak or buried — strengthen/move it;
  · you notice the loop drifted timid (a streak of small ships), slow, or off-vision → rewrite the rule
    that allowed it (this whole reframe came from exactly that self-diagnosis);
  · a rule turned out wrong or contradictory → rewrite or delete it.
  State the self-correction in the status (`SELF-CORRECTION: …`). A turn that hit a trigger and did NOT
  edit the skill is an incomplete turn. The loop that never edits its own playbook is not learning.

- **Rewrite, don't just accrete.** When a rule causes timidity, drift, or no longer fits — DELETE or
  rewrite it (you have git). This skill grows by *replacement*, not only addition; a section that's
  become wrong is debt. (The whole "make it incredible" reframe above is this rule in action: it
  rewrote the timid "pick ONE safe improvement" core.) Don't let the playbook ossify.
- **PRUNE IRRELEVANT CONTEXT — this is a standing duty (owner directive 2026-06-13).** This skill
  reloads in full on EVERY firing, so every stale line is a tax on every iteration. Actively REMOVE
  what no longer earns its place: superseded rules, one-off notes whose lesson is now a permanent rule,
  redundant Owner-Model bullets (consolidate same-date entries into one sharp line), ledger entries that
  no longer teach, landmines for code paths that no longer exist, finished epics. Keep the skill LEAN
  and high-signal — a tight playbook the loop can actually hold beats an exhaustive one it skims. Do a
  consolidation pass whenever a section sprawls (the ~10-firing reflection is a natural moment). Same for
  the repo: ROADMAP keeps only live work (done items move to CHANGELOG and out); delete dead docs. Less,
  but load-bearing. (The Landmine log stays append-only for entries that still describe live hazards;
  drop ones that don't.)
- **Capture durable lessons immediately** — a new landmine, a better recipe, a workflow shortcut goes
  in the same turn. Then prune: if a temporary note has become a permanent rule, fold it in and delete
  the note.
- **Maintain `VISION.md`** — the 1-page picture of this game at its incredible best. Update it when the
  owner's taste sharpens; mine it for the next epic when no epic is queued.
- **Propose your own epics.** Don't wait to be told. When you see a big leap (a pillar, an overhaul, a
  restructure), write it as a ROADMAP `## Epic:` plan and surface it as an `OWNER:` line; the owner
  steers by reaction. The loop should generate ambition, not just consume a queue.
- **Owner Model is the through-line** — updated on every owner interaction; the ~10-firing flow
  reflection re-derives it AND audits whether the loop is being bold enough (count the last 10 ships:
  how many were epics? if ~zero, the cadence is failing — fix it that turn). The reactions/prediction
  ledger measures whether changes actually LANDED (owner delight? metric moved?); a missed prediction
  is a lesson to fold back in. This feedback loop is the owner's core request.

## Landmine log (append-only; inherited from 64 iterations of Nuôi Anh + this project)
- CACHE STALENESS (loop iter): multi-file build loads `js/*.js` by bare path → browsers/Pages
  CDN cache them, so after a push the owner sees the OLD build and reports "nothing changed /
  looks like before." FIX: `?v=<n>` on every `<script src>` + `./bump.sh` (fresh timestamp)
  before every commit. The single-file Nuôi Anh game never hit this; multi-file did. If the
  owner ever says a shipped change isn't showing, suspect cache first (verify with `curl`ing
  the live JS for a unique new string — if it's there, it's their cache: hard-refresh).
- Unescaped `"` in double-quoted JS strings kills the whole script at parse; page silently
  shows static HTML (onerror registers too late to catch it).
- NaN serializes to JSON `null`; `isFinite(null)===true`. Always Number.isFinite.
- Save-compat: when adding state fields, test-load a seed save LACKING them — the
  migrator + sanitize must fill them. Most dangerous bug class in this codebase family.
- Headless harnesses are generated FROM the game file — after fixing the game, REGENERATE
  the harness or you retest the stale copy.
- Headless Chrome enforces ~500px minimum window width: true-390px testing = iframe
  wrapper (`<iframe style="width:390px">`); media queries respond to the iframe.
- Screenshotting CSS animations under --virtual-time-budget: `forwards`-fill animations
  render at END state (invisible). Pin with `animation-play-state:paused` — but for
  FADE-IN animations pin shows opacity-0; use `animation:none!important;opacity:1` there.
  Repeated identical events stack pinned elements into a blob — use a single event.
- ACTORS/ACTIVITIES draw only in the rAF `liveLoop`, which headless Chrome throttles → a
  plain screenshot shows an EMPTY campus (people invisible), so for a long time the #1
  priority (the living campus) shipped unverified. FIXED (loop iter 53): `liveLoop` split
  into `stepLive`/`drawLive`, and `__ui._renderLiveOnce(period[,ts])` paints one live frame
  on demand. Recipe in Step 3.4. If a future actor screenshot is still empty: call
  `_settle` BEFORE `_renderLiveOnce` (settle moves them; renderLiveOnce only paints), and
  confirm a roster exists + the right period is set.
- Never wipe document.body in a harness intercept — the game's render loop crashes on
  missing elements and that JSERR masks your actual test. Overlay position:fixed instead.
- Hide `#toasts` in screenshot harnesses when a rich seed fires achievements/events.
- Bot recipes: assert actions HAPPENED (bought>0, alumni ticked) — a dead selector passes
  silently. Shop/list items may be DIVs, not buttons; check the real markup.
- Features that insert a step into the canonical fresh-boot flow break GATE_FRESH BY
  DESIGN — update the gate's flow in the same commit; a gate that no longer matches the
  real first session is the false-pass risk.
- Extending a content array: grep for the OLD length as a bare literal first (counts get
  hardcoded in far-apart places: sanitize bounds, slices, away-checks).
- Bulk python in-place transforms of game files invalidate the Edit tool's tracking —
  Read a small slice after, or sequence bulk transforms last.
- Index-aligned arrays sanitize with .map (null-out), never .filter — filtering shifts
  indices and reattaches data to the wrong sibling.
- Minimal harness seeds work: load() migrations fill missing fields; only set what the
  test asserts plus structural containers.
- This project: occupancy grid and sprite view are DERIVED — any code path that mutates
  S.rooms/students without rebuildGrid()/actor-respawn corrupts silently until next boot.
- This project: alumni annMonth must never be 6 (June belongs to students); sanitize
  recomputes violations.
- This project: `.pantheon` content and honoree names in scandal strings — grep before
  ship (`grep -l 'Trần Đại Nghĩa\|Tạ Quang Bửu\|Hồ Xuân Hương'` against phốt/headline
  banks must return nothing).
- AUTONOMOUS-REFACTOR is now ENCOURAGED via THE EPIC MACHINERY, not avoided (supersedes the old
  iter-3 "prefer the safe feature / chunk it" rule, which made the loop timid). The real risk a big
  refactor carries — engine gates don't catch UI/visual regressions, and Write/Edit transcription
  errors hide easily — is now handled by the machine: do it in a git WORKTREE (live tree never breaks),
  fan the work out with a WORKFLOW where it decomposes, and PROVE behavior-neutrality with a
  BEFORE/AFTER diff (byte-identical gate output + identical 390px/`_renderLiveOnce` screenshots of the
  same seeded states). A refactor proven behavior-neutral is SAFE to ship autonomously. Don't dodge the
  big restructure for a safe sliver — run the machine.
- AUDIO is owner-verified, not screenshot-verified: a BGM iteration can only assert "no JSERR
  across all state-moods + init + persist + autoplay-unlock" headlessly; the aesthetic is judged
  by the owner on the live link. Keep audio defensive (try/catch every scheduler; any failure
  silently disables) so a bad AudioContext never breaks the game.

## Playbook changelog
- 2026-06-13: skill created at owner's request, seeded from the Nuôi Anh improve-game
  playbook (64 iterations, 12 green sprints, 1 immunized incident).
- 2026-06-13: added the ~10th-iteration code-structure review (owner directive — "more
  complex game, add code structure review from time to time"); Owner Model distillation
  gains the "architecture as a living deliverable" signal.
- 2026-06-13: owner raised the GRAPHICS bar ("more detailed and more style"); shipped the
  Sơn Mài Diorama campus via an explore→judge→synthesize art-direction workflow. Recorded
  that workflow as the standing method for substantial visual work; Owner Model updated.
- 2026-06-13 (iter 53): owner asked "what can be improved in the skills?"; shipped the #1
  pick — the living campus is now SCREENSHOT-VERIFIABLE (`_renderLiveOnce` hook + Step 3.4
  recipe + landmine). Owner declined the proposed #2 (presence-aware looping); recorded that
  as an Owner-Model signal (keep the autonomous cadence; veto-by-reaction even when present).
- 2026-06-13 (LOOP REDESIGN, owner-directed): diagnosed the loop as locally-productive but globally
  TIMID (7 straight tiny additive ships, zero epics, codebase rotting). Rewrote the core from "pick ONE
  safe improvement, ship green" → a MISSION ("make it incredible, fast"), TWO TRACKS (polish vs EPIC),
  the EPIC MACHINERY (plan→worktree→workflow→behavioral-diff→merge so big restructures/overhauls/
  deletions are safe + encouraged), THE BAR (incredible definition + 1–5 self-scoring rubric as a gate),
  DIVERGENCE-by-default for visual work, a cadence rule (≥every 4th firing is an epic), and a bold Step 6
  (rewrite/prune the skill, maintain VISION.md, propose own epics). Added owner directives: PRUNE
  irrelevant context every reload, and MANDATORY SELF-CORRECTION (edit this file to fix the loop whenever
  it errs/drifts). Superseded the timid "prefer the safe feature / chunk it" anti-refactor landmine.
