# Improve Học viện Steve — one iteration

Project: `/Users/Admin/Desktop/coding/steve-job-vietnam` · repo `techeese/steve-job-vietnam` ·
live at https://techeese.github.io/steve-job-vietnam/ (Pages auto-deploys `main`).
Game: satirical Vietnamese university-management sim (Kairosoft register). NOT a clicker.
Kill-switch: `rm /Users/Admin/Desktop/coding/.improve-steve-on`.

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
- *(2026-06-13)* Comfortable handing over autonomy (re-armed the loop pattern from Nuôi
  Anh unprompted) but expects the loop to keep learning him — this section IS his request.

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
  improvement does not exist. Ship pattern: `./gate.sh && git add -A && git commit … && git push`,
  then `curl` the live URL for a unique new string until deployed.
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

## Step 1 — Pick ONE improvement
Top viable ROADMAP item, or better (record the swap) — RANKED THROUGH THE OWNER MODEL:
when two picks tie on the priority ladder, the one that serves the current distillation
(people/trajectories, cultural anchoring, feel-first, visible progress) wins.
Priority: (a) broken, (b) owner's explicit wishes, (c) the current sitting's spec
(S-ladder in ROADMAP), (d) creative content/mechanics deepening the thesis ("graduation
produces potential; the world decides destiny"), (e) graphics/charm, (f) balance, (g) docs.
- Creative method: 3 candidates, one sentence each, scored (thesis-service > fun > novelty
  > polish); pick the winner, bank the runner-up.
- Scope control: one iteration = one shippable coherent change. Too big → split, name the
  parts in ROADMAP.
- Maintenance sprint every ~5th iteration: `node sweep.js` (when engine.js exists), a
  5-minute virtual-time bot playthrough (zero JSERR, no soft-locks, assert purchases AND
  alumni ticks actually happened — dead selectors pass silently), full-page 390px audit
  (actually LOOK at the PNGs), perf glance (interval count, DOM nodes, canvas frame cost).
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

## Step 2 — Implement (engineering laws; violations have caused production incidents)
- `window.onerror = function(m,s,l){document.title='JSERR: '+m+' @'+l}` stays the FIRST
  statement of the first script block.
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
5. Minimal seeds in harnesses (migrations fill what tests don't assert on; structurally
   required: meta object, run containers, gameOver:false). Clean up temp files.

## Step 4 — Record & ship (every iteration)
- Update ROADMAP.md (done item out, discoveries in) and CHANGELOG.md (PREPEND under the
  `# Changelog` header — never anchor on the previous entry).
- `./gate.sh && git add -A && git commit -m "…" && git push` — gates chained so nothing
  ships red. Then poll the live URL for a unique new string until DEPLOYED.

## Step 4.5 — Failure recovery
Two failed fix attempts on one problem → `git checkout` back to HEAD, write the failure +
hypothesis under `## Parked` in ROADMAP.md, pick something else. NEVER ship red gates;
NEVER leave the tree broken at turn end.

## Step 5 — Continue the loop
End the turn with a short status: what shipped, what's next, and `OWNER:` lines for any
decision made on the owner's behalf (tone, visibility, balance philosophy, pantheon
content). The Stop hook re-fires this skill while the flag file exists.

## Step 6 — Living documentation (mandatory)
This skill and EVERY .md in the repo are living documents (owner's explicit wish). A
durable lesson — new landmine, better recipe, workflow shortcut — gets edited in
IMMEDIATELY. Landmine log is append-only. The Owner Model section is updated on every
owner interaction; the ~10-iteration flow reflection re-derives it and evolves the
development flow itself to match — that feedback loop is the owner's core request.

## Landmine log (append-only; inherited from 64 iterations of Nuôi Anh + this project)
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

## Playbook changelog
- 2026-06-13: skill created at owner's request, seeded from the Nuôi Anh improve-game
  playbook (64 iterations, 12 green sprints, 1 immunized incident).
- 2026-06-13: added the ~10th-iteration code-structure review (owner directive — "more
  complex game, add code structure review from time to time"); Owner Model distillation
  gains the "architecture as a living deliverable" signal.
