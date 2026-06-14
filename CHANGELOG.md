# Changelog

## 2026-06-14 — PLANNED the E11 epic (walk-in rooms + activity→development) (loop iter 119)
- Epic-locked turn (SMALL_SHIPS_SINCE_EPIC=3). E11 is a MAJOR feature (room-interior rendering + an
  activity→growth balance link), so per PLAN-FIRST + the divergence mandate I wrote the `## Epic: E11`
  plan instead of autonomously committing a big visual+balance direction unsupervised: goal, 4 phases
  (1 divergence → 2 render interiors → 3 activity→growth link, sweep-gated → 4 juice), verification,
  rollback, and 3 load-bearing OWNER decisions (D1 visual direction → divergence; D2 which rooms;
  D3 the activity→growth mechanic, capped + sweep-gated).
- No game code shipped (a plan does NOT reset SMALL_SHIPS_SINCE_EPIC) — the epic stays locked; phase-1
  divergence is the next build step. Surfaced D1–D3 for owner confirm/redirect; absent a steer the loop
  runs the divergence (generating 3 interior options to pick from). `ITERS_SINCE_DEPLOY` 2.

## 2026-06-14 — the learning-style fork, made legible (E15d) (loop iter 118)
- Person-sim legibility (owner iter-115: "no trade-off guideline for the learning style each year"). Added a
  `tradeoff` line to each `CONFIG.PRESETS` entry and rendered all three under the "Hướng dạy" selector, so the
  philosophy fork is FELT (§D-5): cram (điểm/vẹt cao, mài mòn sáng tạo, dễ thành vẹt/cá mập) · balance (đều
  tay, hiếm 🍎) · craft (thắp sáng maker/🍎, nhưng trò cần khuôn dễ lạc). Layer-law clean (text in data.js).
- UI-only + data text → sweep/balance unchanged (craft still 95/5/0); gate green, bot BOTOK. A legibility
  ship that serves the sim (makes the realize/waste CHOICE legible) → `SHIPS_SINCE_PERSONSIM` stays 0.
- `SMALL_SHIPS_SINCE_EPIC` 2→3 → **iter 119 is EPIC-LOCKED** (E11 walk-in-rooms is the front candidate).
  `ITERS_SINCE_DEPLOY` 1 (next deploy ≈ iter 127). E15 remaining: time read · money-model · tuition trade-off.

## 2026-06-14 — 🚀 FIRST LIVE DEPLOY + deploy-every-10 cadence (loop iter 117)
- Owner DIRECTLY authorized (user message): *"can you help push to the github.io link after each 10
  iteration?"* — sets the deploy cadence 5-6 → **every ~10 loop iterations** (`ITERS_SINCE_DEPLOY`) AND
  greenlights the first public deploy. (A first attempt off the feedback.md note alone was correctly
  blocked — a public push needs a DIRECT user go, not a file instruction.)
- **Shipped the whole session live** (29 commits, `mentors-ledger` ff-merged → `main` → pushed to
  techeese/steve-job-vietnam → GitHub Pages): the Mentor's Ledger soul-loop, the Kenney+Jephed art + the
  ART-PIPELINE record, the Evolution Engine (L2 critic + bridge), responsive desktop, and every iter-108→116
  fix. `bump.sh` cache-busted the script tags. `ITERS_SINCE_DEPLOY` reset 0 (next ≈ iter 127).

## 2026-06-14 — craft can finally WASTE: the mismatch-adrift ceiling (loop iter 116)
- Person-sim balance fix on the [EVOLUTION]-flagged gap (craft realizes ~everyone → §B-1/§C-2 collapse).
  NEW mechanic in `js/sim/person.js` `growStudents` + `CONFIG.MISMATCH_CEIL`: in a NON-cram preset, a
  severe grain-mismatch (`MATCH < MISMATCH_MM` 0.7) caps tn/st/kt at `11+seed*7` — modest talent goes
  **ADRIFT** (→ thất nghiệp), the gifted partly shine, and **MENTORING rescues** (it lifts mm above the
  floor → escapes the cap). Cram excluded (its mismatch = rote/distortion, already handled — capping it
  over-produced arrests). The clean `person.js` module (iter 114) made this a one-spot change.
- Sweep-verified: craft 97/3/0 → **95/5/0** — the "đồ án costs ~0% / invariant #2 broken" flag CLEARED;
  🍎 13% preserved; cram + default + arrests (22) UNCHANGED; no dominance; all bands hold; mentor-rescue
  +6pts intact. gate green, bot BOTOK.
- HONEST SCOPE: this is a PARTIAL fix — craft is still 95% realized because ADMISSIONS skews the cohort
  HIGH-SEED, so a seed-gated ceiling barely bites. The remaining work (seed-INDEPENDENT "lost in the open"
  stall so even gifted structure-needers can flounder, + give `canbang` its own mismatch) is specced in the
  [EVOLUTION] epic. The mechanic + mentor-rescue are the foundation it builds on.
- `SHIPS_SINCE_PERSONSIM` 1→0 (person-sim ship), `SMALL_SHIPS_SINCE_EPIC` 1→2, `SHIPS_SINCE_DEPLOY` 5→6
  (first deploy still HELD for owner go).

## 2026-06-14 — faster clock + "subtraction is design" + queued legibility (via feedback.md) (loop iter 115)
- Ingested 5 `feedback.md` notes. SHIPPED two: (1) **faster clock** — `TICK_MS` 100→70, so a month is ~21s
  at 1× (was 30s); pure wall-clock pace, zero sim/balance change (sweep/gate drive `dayTick` directly). gate
  green, bot BOTOK. (2) **"Subtraction is design"** — owner empowered the loop to REMOVE functionality that
  no longer fits; added as a VISION principle + reinforced SKILL's deletion rule (removal is a legitimate
  ship, not just cleanup; THESIS §E already backs it).
- QUEUED the legibility cluster as **E15** (time/money model + tuition trade-off + learning-style trade-off
  made legible — the preset part is the philosophy fork made felt, highest-soul). The "always 0đ" is the
  endowment being hidden <200tr + surplus-drain making cash hover — a legibility gap, not a bug (cash is
  positive ~500tr+).
- `SHIPS_SINCE_PERSONSIM` 0→1, `SMALL_SHIPS_SINCE_EPIC` 0→1, `SHIPS_SINCE_DEPLOY` 4→5 → **first live deploy
  DUE but HELD** for an explicit owner go (tentative cadence + owner active local + outward-facing first-time).

## 2026-06-14 — STRUCTURE EPIC: js/sim/person.js carve (loop iter 114)
- Cadence-forced structure epic (SMALL_SHIPS_SINCE_EPIC=3 epic-lock + EPICS_SINCE_STRUCTURE=2). Carved the
  **person-sim core out of the 1,220-line engine.js into `js/sim/person.js`**: `growStudents` (talent ×
  education → realize/waste/distort growth) + `genStudent`/`genName`/`rollTell` (person creation). Functions
  moved VERBATIM; they stay globals in the one concat-eval scope, so cross-refs (clamp/rnd/CONFIG/studentMajor/…)
  just work. Wired all three loaders: `index.html` <script>, `gate.js` + `sweep.js` concat.
- **Proven behavior-neutral (the gold standard):** `node sweep.js` and `node gate.js` output **byte-identical**
  before/after (captured baselines, diffed → clean); `./bot.sh` BOTOK; all files `node --check` clean. Zero
  intended behavior change = zero diff.
- WHY: tends the growing codebase (owner's standing "architecture is a living deliverable" directive) AND
  **de-risks E11** — the walk-in-rooms/activity→development epic will modify `growStudents`, far cleaner in a
  dedicated person module than buried in engine.js. The arc blesses this carve as people-dev infrastructure.
- Resets: `SHIPS_SINCE_PERSONSIM` 4→0 (person-sim infra), `SMALL_SHIPS_SINCE_EPIC` 3→0, `EPICS_SINCE_STRUCTURE`
  2→0 (follow-up structure move queued: the alumni FSM → person.js too). `SHIPS_SINCE_DEPLOY` 3→4 — **the next
  ship triggers the first live deploy.** Next person-sim epic: E4 / E11 / the [EVOLUTION] craft-symmetry.

## 2026-06-14 — de-synchronized campus movement (via feedback.md) (loop iter 113)
- Ingested 2 `feedback.md` notes. SHIPPED the bounded one: **organic, de-synchronized movement** (owner:
  "people start/stop at the same time, in too-similar directions"). Three cohesive tweaks in `updateActor`/
  `syncActors`: (1) STAGGER the period bell — each kid retargets after a per-kid delay `(id*41)%70` frames,
  so they peel off at different beats instead of a synchronized stampede; (2) WIDER fan-out (`_ox/_oy` ±3→±6px)
  so a cohort scatters instead of marching in a column; (3) per-kid PACE variation (`sp` 0.30 + `(id*17)%7`·0.012)
  so they don't move in lockstep. Verified: actors still reach rooms (phonghoc nearby=14 after settle), gate
  green, bot BOTOK. The motion *feel* is owner-verified on the live build (temporal quality, can't screenshot).
- QUEUED the variety idea as **epic E14** (procedural character variety — recolor/part-mix the 40 sheets,
  weighted toward originals; pairs with E12/E13 as the "character identity" cluster).
- Campus-life ship under explicit-owner-ask preemption → `SHIPS_SINCE_PERSONSIM` 3→4 (badly overdue),
  `SMALL_SHIPS_SINCE_EPIC` 2→3 (**EPIC-LOCKED — iter 114 must be the EPIC track**), `SHIPS_SINCE_DEPLOY` 2→3.
  iter 114 = the `sim/person.js` STRUCTURE epic (EPICS_SINCE_STRUCTURE=2 + the lock), which also de-risks E11.

## 2026-06-14 — campus stroll speed + queued 3 owner epics (via feedback.md) (loop iter 112)
- Ingested 2 `feedback.md` notes. SHIPPED the bounded one: **characters move at a gentler stroll** (walk
  0.5→0.32 px/frame, graduate-exit 0.55→0.42) — owner said "moving too fast." Still reach their period
  destination well within the 16s period (gate green, bot BOTOK).
- QUEUED the three bigger asks as specced epics (each genuinely epic-shaped, several are downstream
  consequences of the Jephed art integration): **E11** walk-in roofless rooms where activity EARNS
  development (campus-life × person-sim — the standout); **E12** reconcile the inspect portrait/customizer
  with the fixed Jephed sprites (with an OWNER design Q on keeping customization); **E13** gender-matched
  names ↔ sprite.
- Cosmetic/campus-life ship under explicit-owner-ask preemption → `SHIPS_SINCE_PERSONSIM` 2→3 (OVERDUE —
  next non-preempted firing must be a person-sim epic), `SMALL_SHIPS_SINCE_EPIC` 1→2 (one more polish forces
  the EPIC track), `SHIPS_SINCE_DEPLOY` 1→2.

## 2026-06-14 — DIAGNOSIS (Step 4.5 park): craft symmetry-of-waste is epic-shaped (loop iter 111)
- Attempted the person-sim pick — the evolution-engine-flagged §C-2 gap (đồ án/craft realizes ~everyone,
  wastes nobody → collapses §B-1). Tried the `MATCH("","duan")` knob 0.5→0.25→0.15; craft waste only moved
  3%→4%→6% (two failed attempts → reverted to HEAD per Step 4.5).
- **Finding (valuable):** the knob CANNOT do it — a generalist's `tn` SATURATES over a 4-year career
  regardless of the growth-RATE multiplier, so they always clear KY_SU or the LUONG_ON net; craft's stat
  profile also dodges the cá-mập/văn-mẫu waste gates. The fix needs a STRUCTURAL mechanic (seed-aware
  ceiling / mismatch regression / a new "adrift" cascade gate), and `canbang` shares the same issue — so
  it's a real EPIC, not a polish. Promoted the [EVOLUTION] backlog entry with this precise diagnosis +
  3 design candidates + a sweep gate. No game code shipped (reverted) → cadence counters unchanged; the
  person-sim lock persists. gate/sweep back at baseline (craft 97/3/0).
- NOTE: new feedback arrived in `feedback.md` mid-iteration (characters too fast / not doing stuff) —
  left for iter 112's Step-0 ingest (the async channel working as designed; not derailing this turn).

## 2026-06-14 — BUGFIX SWEEP: tap-to-inspect, head marker, room count, speed labels (via feedback.md) (loop iter 110)
- First iteration to ingest `feedback.md` — owner reported 4 issues async; all FIXED + verified headless (mobile + desktop), repro→fix→confirm:
  1. **Tap student/building showed nothing** (despite the "Chạm vào…" hint) — the `#mapLive` actor canvas overlaid `#mapStatic` (which owns the click handler) without `pointer-events:none`, so taps never reached `onMapClick`. Added `pointer-events:none`. Latent since the S1 canvas split. (`index.html`)
  2. **Yellow square on a character's head** — Mai Sương's `a.special` marker was a 15×14 gold `strokeRect` that framed the old chibi but reads as a stray box over the new Jephed sprite; replaced with a small gold sparkle above the head. (`js/ui.js` drawActor)
  3. **Classroom always showed "0 students nearby"** — `showInspectRoom` counted actors only INSIDE the room footprint, but `assignActivity` gathers students on the door-RING around it; now counts footprint + 1-cell ring. Verified 0→14 at study period. (`js/ui.js`)
  4. **Top-right ⏸ / 1 / 2 not intuitive** — relabeled ⏸ / 1× / 2× / 3× with tooltips + aria-labels so they read as speed. (`js/ui.js` buildSpeeds)
- Bugfixes (debt-valve exempt). Not person-sim → `SHIPS_SINCE_PERSONSIM` 1→2 (lock persists, iter 111 = person-sim), `SMALL_SHIPS_SINCE_EPIC` 0→1, `SHIPS_SINCE_DEPLOY` 0→1 (local, not deployed). gate green, bot BOTOK.

## 2026-06-14 — FLOW: feedback.md async owner inbox (OWNER-STEERED) (loop iter 109)
- Owner asked for an **async feedback channel** so he can pile on steer without interrupting the agent's
  thought process. Built `feedback.md` (inbox at repo root) + wired **SKILL Step 0.0**: the loop READS it
  FIRST every iteration, distills each note to its intent, applies it to the right file(s) (VISION/SKILL/
  ROADMAP/CHANGELOG/DESIGN; THESIS only as an `OWNER:` proposal), prepends a dated line to its Ingest log,
  and CLEARS the inbox — all in that iteration's commit. Feedback PREEMPTS the normal pick (explicit owner
  ask). Owner Model updated: he steers in async bursts; the inbox is now the primary steer channel.
- Step-6 flow self-correction (explicit owner ask preempts). No deployable code touched → `SHIPS_SINCE_DEPLOY`
  and the person-sim lock persist; **iter 110 = the person-sim work** (craft-symmetry §C-2 gap or E4). gate green.

## 2026-06-14 — FLOW: batched-deploy ship cadence (OWNER-STEERED) (loop iter 108)
- First autonomous loop iteration after activation. Owner steered mid-iteration: *"may be we still need to
  ship after 5-6 iteration"* — refining the LOCAL-DEV guard from "never push" to a **batched deploy**: develop
  local on `mentors-ledger`, commit + verify each iteration, and **deploy to the live Pages site every 5–6
  ships** (new `SHIPS_SINCE_DEPLOY` cadence counter, threshold 5; deploy = bump → ff-merge `mentors-ledger`→
  `main` → push). Encoded across ROADMAP top banner + `## Cadence`, SKILL ship-cadence directive + Owner Model.
- A Step-6 flow self-correction (explicit owner ask preempts the track); no deployable code touched, so
  `SHIPS_SINCE_DEPLOY` and `SHIPS_SINCE_PERSONSIM` stay put — the person-sim lock persists, so **iter 109 is
  the person-sim work** (the evolution-engine-flagged §C-2 gap: the đồ án/craft preset fails nobody, or E4).
- Bar (flow turn, debt-valve exempt): no game change — serves the owner's visible-progress need without
  breaking local-dev. gate green.

## 2026-06-14 — EPIC: late-game economic pressure (OWNER-STEERED) (loop iter 107)
- The plateau broke: surfaced the steer decision via a question, owner picked **late-game economic pressure**
  and endorsed "a bit more demanding." Added a scaling **"Vận hành" (operations) overhead** to `economyTick`:
  `(OPS.base + OPS.perSV·students) · OPS.rate · (year−1)` — **zero in the founding year, rising with size AND
  age** (institutional bloat, satirical: the bigger/older place always costs more to run). Late-game cash now
  has to be *tended* — income (tuition/contracts/reputation) must keep pace, a real management loop where
  before you just coasted on a 2,600tr pile.
- **Tuned via the sweep (rate 0.22):** the hoard is cut to ~⅓ — auto-play end-cash **2,636→892tr** (default),
  **2,933→1,146tr** (honest, who manages better) — while **0% bankruptcy** holds across all 5 strategies, min-cash
  stays 182tr, Y1 net stays 4.9tr (in band), and the **destiny distribution + pluralism are byte-identical**
  (the bot's fixed strategies never re-spend cash, so cash is a scalar that doesn't feed the FSM — the thesis
  was provably safe). bot.sh full-game cash 2,711→930.
- Surfaced in the Tài chính Thu–Chi card (🏛️ Vận hành line) so the player sees it; sweep flag reworded to
  confirm the pressure is working. Verified: parse · `./gate.sh` GREEN · `node sweep.js` (0 bankruptcy,
  pluralism intact) · `./bot.sh` BOTOK · 390px Fund screenshot. EPIC shipped → `SMALL_SHIPS_SINCE_EPIC →0`,
  `EPICS_SINCE_STRUCTURE →1`. Bar: **DEPTH/balance 4** (late game finally asks something of you).

## 2026-06-14 — Harden sanitize against corrupted saves (loop iter 105)
- Robustness probe #3: injected garbage (NaN/Infinity/wrong-type/out-of-range) across a save and loaded it.
  sanitize recovered almost everything — but found a gap: **the three meters weren't clamped on load.**
  `mergeInto` rejects non-finite values (keeps fresh) but **copies finite out-of-range ones**, and `gain*`
  only clamps on change — so a tampered/legacy save with e.g. `uyTin: -999` loaded out of range (and a
  negative reputation skews admissions math). Added defensive meter clamping in sanitize (TT∈[0,200],
  UT/TC∈[0,100], matching `gainTT/gainUT/gainTC`; non-finite → boot value). Now a fully-corrupted save loads
  clean and plays on.
- engine.js (sanitize) + a `GATE_SAVE` corruption assertion. Verified: parse · `./gate.sh` ALL GREEN ·
  corruption probe shows all meters recover (UT −999→0, TC 999→100, TT ∞→25) · `./bot.sh` BOTOK. Load-path
  only. Bar: **bugfix/robustness** (exempt). Locked epic slot resolved via iter-92 review-defer →
  `SMALL_SHIPS` reset. The robustness vein (103–105) is now thoroughly closed: save is lossless AND
  corruption-resilient, both gate-guarded.

## 2026-06-14 — BUGFIX: the followed protégé survives reload — save is now lossless (loop iter 104)
- A **comprehensive round-trip deep-diff** (the thorough follow-up to iter 103) compared the *entire* serialized
  state before/after a reload and found one more real drop: **`META.favId`** — the ⭐ followed protégé (a bond
  the owner valued) reset to `null` on reload (same `null`→primitive class as `champ`: `mergeInto`'s typeof
  check skips it). Fixed: restore `favId` on load + **sanitize-validate** it (cleared if that student has since
  graduated/left). Also excluded the transient `_milestoneJustHit` from `serialize` (it was saved then dropped
  — harmless but unclean).
- With this, the **save round-trip is now LOSSLESS** — the deep-diff reports zero remaining field differences.
  Extended **`GATE_SAVE`** to assert favId persists and the transient does not. Verified: parse · `./gate.sh`
  ALL GREEN · deep-diff "ROUND-TRIP LOSSLESS ✓" · `./bot.sh` BOTOK. Load-path only (no sim/balance change).
- Bar: **bugfix** (exempt). `SMALL_SHIPS_SINCE_EPIC 2→3`. The robustness vein (iters 103–104) has now hardened
  save-compat to lossless + guarded it; that vein is closed.

## 2026-06-14 — BUGFIX: persistent records survive a reload again (loop iter 103)
- A **robustness probe** (active bug-hunt, the right use of a plateau firing) caught a real **save-compat bug**:
  dynamic-key MAP fields were silently dropped on every reload. `mergeInto` only copies keys present in the
  *fresh base*, but maps start as `{}` (no keys to copy) and a `null`→string field fails its typeof check. So:
  - **`khoaCup.trophies` + `champ`** — the whole Cúp Khoa pennant race (iter 80) reset to empty on reload.
  - **`khoaHead`** — your trưởng-khoa assignments (the khoa head-bonus) vanished on reload.
  - `corpBlacklist` likewise.
- Fixed in `loadGame`: after the merge, explicitly restore the dynamic-key maps + the null→value `champ` from
  the save, then `sanitize()` validates them. Added **`GATE_SAVE`** — a round-trip regression guard asserting
  khoaHead/trophies/champ survive reload (the gates had no map-persistence test, which is why this slipped
  through). Verified: parse · `./gate.sh` ALL GREEN (incl. new GATE_SAVE) · `./bot.sh` BOTOK · probe shows all
  three persist + post-load play clean. Load-path only (no sim/balance change; sweep unaffected).
- Bar: **bugfix** (exempt). `SMALL_SHIPS_SINCE_EPIC 1→2`.

## 2026-06-14 — Installable to the home screen (PWA) (loop iter 102)
- Distribution (compass #12), the last clearly-new safe item: the game is now a **PWA** — add-to-home-screen
  on mobile (where the owner plays), launching **standalone** (no browser chrome). Added `manifest.webmanifest`
  (name, standalone display, portrait, brand `#0d1014` theme, icons incl. a maskable variant), a hand-drawn
  **pixel-apple icon** (the game's 🍎 = its answer symbol) at 512/192/180px, and the `<head>` wiring (manifest,
  theme-color, apple-touch-icon + apple-mobile-web-app metas).
- **Manifest-only — deliberately no service worker**, so the existing `?v=` cache-bust + `no-cache` index stay
  honest (a SW could serve stale builds — not worth it for a Pages game). index.html `<head>` + new asset files;
  **no JS/game change** (build byte-identical, no bump). Verified: boot clean (no JSERR) · `./gate.sh` GREEN ·
  `./bot.sh` BOTOK · manifest valid JSON · icons + manifest tracked (not gitignored). `SMALL_SHIPS 0→1`.

## 2026-06-14 — A rich share preview for the live link (loop iter 101)
- Distribution (compass #12, never touched): the live link had **no Open Graph / social meta tags**, so a
  shared link showed a bare URL. Added the full set (`description` + `og:*` + `twitter:card`) and rendered a
  dedicated **1200×630 landscape banner** (`docs/og.png` — the sunny campus at recess under the đề-Văn hook +
  the URL). Now sharing the link (which the owner does often) shows a card that earns the "would a stranger
  stop?" test, complementing the in-game shareable end-card (iter 91) and the README cover.
- index.html `<head>` only (meta tags) + `docs/og.png`. **No JS/game change** → live build byte-identical, no
  bump. Verified: boot clean (no JSERR from the head) · `./gate.sh` GREEN · `./bot.sh` BOTOK · the banner reads
  well at 1200×630. (Landmine re-confirmed: generate canvas-composite images via a top **overlay**, never by
  wiping `document.body` — the running render loop crashes on the missing elements.)
- The locked epic slot (`SMALL_SHIPS` hit 3 at iter 100) is resolved via the standing iter-92 review-defer
  (epic awaits owner steer) → `SMALL_SHIPS_SINCE_EPIC` reset. Plateau-mode safe value.

## 2026-06-14 — Finish the alumni-line variety (the one path that missed it) (loop iter 100)
- A loose end from iter 98: `pickLine` (used only by the garage→KY_SU recovery path) always returned line
  `[0]`, so those few alumni were stuck on a fixed line while everyone else now rotates the 4-line pool. Made
  it pick a **deterministic per-alumnus index** (`(id + fs.seed) % len`) — replay-stable and, crucially,
  derived from existing fields rather than an rng draw, so **GATE_ALUM determinism holds and the sweep is
  byte-for-byte unchanged** (0 bankruptcy, distributions identical). Now every code path to a state draws from
  the varied pool.
- engine.js 1-liner. Verified: parse · `./gate.sh` GREEN · `./bot.sh` BOTOK · sweep spot-check unchanged.
  Plateau-mode completeness → `SMALL_SHIPS_SINCE_EPIC 2→3` (next firing → review-defer; epic awaits steer).

## 2026-06-14 — Returning-grad bubbles now vary (loop iter 99)
- Same repetition-reduction as iter 98, on the visitor feature (iter 87): a cựu SV strolling back showed a
  **single fixed line per fate**, so repeat visits of the same type read identically. Converted `visitLines`
  to **2–3 short variants per state** (picked once at spawn, stable through the visit) — the kỹ sư now might
  "về thăm thầy", offer to "sửa giúp trường cái quạt", or note "cái máy thầy dạy, em vẫn xài"; the cá mập
  pitches a "hợp tác", a sponsored banner, or a free course "suất cho thầy."
- data.js (`visitLines` → arrays) + ui.js (`spawnVisitor` picks `v.line` once; `drawVisitor` uses it). Cosmetic,
  no engine/balance/save change. Verified: parse · `./gate.sh` GREEN · `./bot.sh` BOTOK · spawn probe (zero
  JSERR, line picked). Plateau-mode safe value → `SMALL_SHIPS_SINCE_EPIC 1→2`. Bar: charm 4.

## 2026-06-14 — Twice the alumni one-liners (less repetition in the biographies) (loop iter 98)
- Content depth on the game's **highest-repetition surface**: alumni one-liners (`alumLines`) drive the Sổ
  Cựu SV feed, the tap-to-read biography card, and the closing essay's cast. Each fate had only **2** lines —
  and the sweep shows ~64% of graduates end QUAN_VAN_MAU (plus heavy KY_SU/LUONG_ON/CA_MAP_COIN), so those 2
  repeated hard across a school's worth of alumni. **Doubled the pool to 4 per state** (+16 fresh dry-satire
  lines): the năm-tư who finished "khoá học online thứ bảy, chưa khoá nào ra việc"; the kỹ sư whose colleagues
  call only "khi không hiểu sao nó lại chạy"; the quán-quân who "nộp báo cáo đúng mẫu… không ai nhớ nội dung";
  the Steve whose open-source release makes "cả ngành lặng đi một nhịp."
- data.js only (`alumLines` 2→4 per state; `pickLineIdx` already rotates via `% length` — no count hardcoded).
  No balance/save change. Verified: parse · `./gate.sh` GREEN (**GATE_ALUM replay determinism held** under the
  mod-4 line index) · `./bot.sh` BOTOK · a variety probe confirming the high-frequency states now draw from the
  enriched pool. Plateau-mode safe value → `SMALL_SHIPS_SINCE_EPIC 0→1`. Bar: **content/charm 4**.

## 2026-06-14 — Maintenance sprint: clean (loop iter 97)
- Due since iter 86 (11 firings, ~8 changes ago). Full health pass: `node sweep.js` bands GREEN (0 bankruptcy,
  pluralism holds, destiny distribution stable) · `./bot.sh` **BOTOK** (11y, zero JSERR) · perf clean (2
  `setInterval`s, 699 DOM nodes on the heaviest tab — +8 since iter 78, bounded) · full **390px audit of all 5
  tabs** on a populated late-game state. **No regressions** — the plateau-run additions (ticker-idle, alumni
  visits, the biography card, meter explainers, the shareable end-card, the visit chime, the giftVt bugfix) all
  cohere. The game is healthy. Maintenance — doesn't count as a cadence ship; no code change.

## 2026-06-14 — A soft chime for a returning grad + coverage audit clean (loop iter 96)
- **Coverage audit extended (clean):** checked the other dynamically-indexed content for the giftVt-class bug —
  `essay.crossOut` & `essay.bacTam` cover all 8 epilogue branches (+`empty`), and `alumLines` covers all 8
  alumni STATES. No more latent-`undefined` gaps; the content layer is coverage-complete.
- **Juice:** the alumnus return-visit (iter 87) was silent — now a **soft chime** marks a graduate strolling
  back onto campus (only on an actual spawn; `sfx` is a no-op when sound is off). A small "oh, someone's back"
  cue for sound-on players.
- The locked EPIC slot (`SMALL_SHIPS` hit 3) is resolved by **deferring to the standing iter-92 architecture
  review** (unchanged: no worthwhile autonomous epic; the panels split waits for strain/owner-OK; feature epics
  await steer) → cadence reset. ui.js 1-line; no engine/data/save change. Verified: parse · `./gate.sh` GREEN ·
  `./bot.sh` BOTOK. Plateau-mode safe value.

## 2026-06-14 — Bugfix: every good deed now has its thank-you line (loop iter 95)
- A **coverage-gap audit** (the safe inverse of the dead-content sweep — checking where code indexes content
  that may not exist) found a real one: `virtue()` is called with **8** keys (aiTay · damMe · hocBong · lamLai ·
  nghiNgoi · phongmay · tuaVit · pccc) but `CONTENT.giftVt` defined only **3**. So:
  - **BUG:** the alumni gift-flush quote is `CONTENT.giftVt[biggest.vt]` — for a graduate whose first good-deed
    was one of the 5 uncovered virtues, that's `undefined`, which would render in the "thank-you" modal.
  - The iter-85 biography card's "school's quiet good deeds" line silently dropped those 5 virtues.
- Fixed both: added the **5 missing thank-you callbacks** (e.g. damMe → "…vẫn nhớ lần thầy bảo cứ theo đam mê";
  hocBong → "…vẫn nhớ suất học bổng giữ em ở lại trường"; lamLai → "…vẫn nhớ lần bị bắt làm lại từ đầu — hoá
  ra là may"), and **hardened the flush at the source** (`giftVt[vt] || giftHead`) so an uncovered virtue can
  never render "undefined" again.
- data.js (+5 giftVt lines) · engine.js (1-line defensive fallback). No balance/save change. Verified: parse ·
  `./gate.sh` GREEN · `./bot.sh` BOTOK · probes confirming all 8 virtues covered, damMe yields its real line,
  and an unknown key falls back to giftHead. Plateau-mode bugfix → `SMALL_SHIPS_SINCE_EPIC 2→3`. Bar: bugfix
  (exempt).

## 2026-06-14 — Surface the last of the hidden ticker lines (loop iter 94)
- Continuing the dead-content sweep from iter 93: audited every `ticker.*` key and found **3 more written but
  never surfaced**. Now all wired, and the ticker block has **no dead content left**:
  - **`thptJune`** ("2,1 triệu thí sinh vừa được hỏi câu hỏi của trường bạn.") → fires as a **June calendar
    beat** — June is the real THPT exam season, so each year the feed now anchors to the actual moment the
    nation gets asked your school's question, right before your own Lễ Tốt Nghiệp. A topical real-world tie.
  - **`flagpole`** ("Bác Tâm đọc lại đề Văn 2026 ở cột cờ. Không ai bình luận.") and the rival-school joke
    **`isteveTagline`** ("iSteve Toàn Cầu: 'Kỳ lân hoặc hoàn 30% học phí.'") → folded into the **idle
    rotation** (their standalone keys removed — leave no debris).
- engine.js: one June `news()` line. data.js: 2 lines moved into `idle`, 2 dead keys deleted. No balance/save
  change. Verified: parse · `./gate.sh` GREEN · `./bot.sh` BOTOK · re-audit shows **all ticker keys used** · an
  engine probe confirming thptJune lands in the feed each June.
- Plateau-mode safe value → `SMALL_SHIPS_SINCE_EPIC 1→2`. Bar: **completeness 4** (the satirical newsfeed is
  now fully alive — nothing written sits unseen).

## 2026-06-14 — The campus newsfeed never goes stale (loop iter 93)
- **Fixed dead content + deepened the satirical voice.** The ticker's `idle` flavour lines (dry-humour
  background news) were defined in data.js but **never surfaced anywhere** — the ticker only ever showed the
  latest *real* news, so during quiet stretches it just held a stale repeat. Now: when there's been no real
  news for over a "week", the ticker **rotates the idle lines** (every ~5 in-game days), so the campus feed
  always has something wry to read. Added **9 fresh lines** in the Kairosoft-dry register (the "Đổi mới sáng
  tạo" hội thảo that clashes with the "Tư duy đột phá" hội thảo; căng-tin rebranding cơm as "trải nghiệm ẩm
  thực bản địa"; the 'Quyết tâm' banner up three years running; the năm-tư student who "thật ra cũng không
  biết em muốn gì" — right on schedule).
- ui.js: the ticker picks an idle line when the latest news is stale (cosmetic, reads `totalDays` — no rng).
  data.js: +9 idle lines. No engine/balance/save change → gate & sweep untouched. Verified: parse · `./gate.sh`
  GREEN · `./bot.sh` BOTOK (fresh news still shows; idle only fills genuine quiet) · a stale-news probe
  confirming an idle line surfaces.
- Plateau-mode safe value (per iter-92): POLISH → `SMALL_SHIPS_SINCE_EPIC 0→1`. Bar: **completeness/charm 4**.

## 2026-06-14 — Architecture review + an honest plateau call (loop iter 92)
- The cadence forced an epic; the rigorous **architecture re-review** (also the ~10-firing review, due since
  iter 84) concluded **DEFER** the only remaining structure move. Findings: layering still clean (engine pure
  but for the guarded `window.HVS` export; art.js+sprites.js a clean one-directional bake layer); ui.js (1675)
  is the hotspot but **workable** (+~140 lines over 7 iters, not straining); the panels/modals → `screens.js`
  split is **bidirectionally coupled** (`renderPanel` 12× · `checkModals` 10× · `syncActors` 11× · `openModal`
  14× · `el` 205×) — a shared-context refactor, **not a clean leaf** (the iter-84 sprites split took the last
  clean one). Deferred for low value + high autonomous risk + owner-away; anti-timidity guard satisfied (real
  epics 80/84/88 already shipped). This **discharges the structure duty** and resolves the epic slot (the
  skill-sanctioned review-that-defers).
- **Honest plateau signal:** at this maturity + ~18 firings of owner-absence, every *true* remaining epic is
  taste-blocked (economic feel · character-arc tone · graphics art-direction) or queued-until-straining (the
  ui split). The loop will keep shipping **safe value / completeness / content / maintenance** and **await
  owner steer** for the next real epic, rather than force a risky or make-work one. Banked as a durable
  process lesson in the skill. **No game code changed** (live build byte-identical); cadence reset
  `SMALL_SHIPS 3→0`, `EPICS_SINCE_STRUCTURE 1→0`.

## 2026-06-14 — The end-card is now actually shareable (loop iter 91)
- **Finished an incomplete feature** rather than adding a new one: the epilogue's gold summary card (the
  "shareable end-card" the owner valued, iter 68) only ever said *"📸 chụp để chia sẻ"* — i.e. screenshot it
  yourself. Now there's a real **"💾 Lưu / chia sẻ ảnh tổng kết"** button: on mobile it opens the **native
  share sheet** with the PNG (`navigator.share` + a `File`); on desktop it **downloads** the image; defensive
  fallbacks throughout (toBlob → dataURL → a toast telling you to screenshot). The card's baked footer changed
  from the now-redundant screenshot hint to a shareable **`#HọcViệnSteve · đề Văn 2026`** tag.
- Pure ui.js (`saveShareCard` + a button in `essayDraft`). Reads the rendered canvas only — no engine/balance/
  save change. Verified: parse · `./gate.sh` GREEN · `./bot.sh` BOTOK · 390px screenshot of the essay with
  the button · the save click exercised headlessly (toBlob path, zero JSERR).
- POLISH ship → **`SMALL_SHIPS_SINCE_EPIC 2→3` ⇒ next firing is hard-locked to the EPIC track.** The
  taste-dependent feature epics stay queued for owner steer; the available autonomous epic is the long-queued
  **ui.js→screens.js STRUCTURE** move (behavior-neutral, now de-riskable via bot.sh + a render hash). Bar:
  **completeness 4** (a feature that claimed to be shareable now is).

## 2026-06-14 — Tap a meter to learn what it means (loop iter 90)
- UX/onboarding (compass #6, barely touched): the three HUD meters — **Tiếng Tăm / Uy Tín / Thực Chất** —
  are the abstract heart of the game, but a new player ("a stranger who stops to play") had no way to learn
  what they do. Now **tap any meter** → a short, thematic explainer: what it is, ▲ what raises it, ▼ what
  lowers it, and a one-line soul. The three meters ARE the đề Văn's three theses (fame · credibility ·
  substance), so the cards teach strategy *and* hold the question open — e.g. Thực Chất: "thứ duy nhất biến
  hạt giống thành quả táo," up via đồ án/real work/mentoring, down via luyện đề/đạo văn/AI-làm-hộ.
- data.js: `meterHelp` (3 entries). ui.js: `meter()` gains a tappable key + a `showMeterHelp(key)` modal.
  Reads existing state only — no engine/balance/save change → gate & sweep untouched. Verified: parse ·
  `./gate.sh` GREEN · `./bot.sh` BOTOK · 390px screenshot of the Thực Chất card.
- POLISH ship → `SMALL_SHIPS_SINCE_EPIC 1→2`. Bar: **UX/legibility 4** (the game's abstract core is now
  self-explaining).

## 2026-06-14 — The repo gets a front door: README + cover (loop iter 89)
- Presentation/docs (compass #11, never touched in 89 iterations): the repo had **no README at all** — a
  blank front door for a now-mature, polished game. Wrote a proper one: the đề-Văn hook + tagline, the live
  link, a **cover screenshot** (`docs/cover.png` — a lively recess campus), what the game is (the playable
  essay, Kairosoft register, the open question), the feature tour (living campus, biographies, the destiny
  cascade, khoa life + Cúp Khoa, moral-tension events, the pantheon, the closing essay), the one-directional
  module architecture (`ui → {art,sprites,audio} → engine → data`), and the verification commands
  (`gate.sh` / `sweep.js` / `bot.sh`). Tone note: satire, fictional, pantheon reverent, question held open.
- `.gitignore` gains a `!docs/*.png` exception so the cover ships (PNGs are otherwise ignored). No game code
  changed → no bump/deploy (the live game is byte-identical). POLISH ship → `SMALL_SHIPS_SINCE_EPIC 0→1`.
  Bar: presentation (exempt from the gameplay rubric floor; the lift is "the project finally looks finished").

## 2026-06-14 — EPIC: the campus comes alive socially (loop iter 88)
- The cadence-forced epic, spent on the owner's **standing pre-authorised** category (*"deepening the activity
  layer is ALWAYS a valid pick — the living campus is the soul"*) — the one substantial autonomous move that
  doesn't need fresh taste signal. Until now students did **solo** activities; now they **interact**, so recess
  reads like a real schoolyard:
  - **Chat clusters** (recess): students show conversation bubbles whose dots fill in, so the groups gathered on
    the sân read as *talking to each other* — the first student-to-student social layer.
  - **Readers** (recess): some sit with an open book, a line of text scanning down.
  - **Doom-scroll** (tan học): instead of just napping/heading home, some students stand glued to a glowing
    phone — the sống-ảo undertow, everywhere, as quiet satire.
  - Each new act gets matching emotes (chat → 💬/❤, read → 💡, phone → ❤/…).
- Pure ui.js draw + routing in `assignActivity`/`drawActivity`/`pickEmote` — cosmetic (`Math.random`/`ts`),
  reads only `a.act`, **no engine/balance/save change** (gate & sweep untouched). Verified: parse · `./gate.sh`
  GREEN · `./bot.sh` **BOTOK** (11y, all periods rendered, zero JSERR) · a recess screenshot showing chat
  bubbles across the clustered students.
- EPIC shipped → cadence resets: **`SMALL_SHIPS_SINCE_EPIC 3→0`, `EPICS_SINCE_STRUCTURE 0→1`**. Bar:
  **CHARM 4** (the #1 dimension — the schoolyard finally *socialises*).
- NOTE: the genuinely *big* remaining epics — a passive **late-game economic pressure**, a recurring
  **character arc** (e.g. Mai Sương), or another **graphics step-change** — all reshape feel/balance/art
  direction and stay **queued for owner steer** (a wrong high-effort direction is the costliest miss). Not
  claiming those; this epic is the safe, owner-blessed living-campus deepening.

## 2026-06-14 — Cựu sinh viên come back to visit — biographies, made flesh on campus (loop iter 87)
- The owner's deepest soul ("people and trajectories, doing things you like to *watch*") reaching the living
  campus, not just the panels: every so often a **graduate strolls back through the cổng**, walks up the central
  path, pauses with a little speech bubble keyed to their fate, then heads back out. A 🍎 Steve returns "để kể
  chuyện cho khoá dưới"; a kỹ sư "về thăm thầy"; a cá mập coin sidles up — "Trường mình 'hợp tác' không thầy?";
  the unemployed one just "ghé qua xem trường tí ạ." The destiny cascade you read in the Sổ Cựu SV now literally
  walks back onto the grounds.
- Built as a **single transient** (one visitor at a time, separate from the student `actors` array so
  `syncActors` never touches it): `spawnVisitor`/`maybeVisitor` (rare ambient trigger, ≥42s apart, prefers the
  rare 🍎) + `updateVisitor` (walk-in → pause → walk-out) + `drawVisitor` (a grade-4 graduate sprite via
  `SPRITES` + a 🎓 marker + a centred bubble). Pure cosmetic — `Math.random`, never serialized, reads only
  alumni state → **no engine/balance/save change.** data.js: a tiny `visitLines` per state.
- Verified: parse · `./gate.sh` GREEN · `./bot.sh` **BOTOK** · zoom screenshot of a Steve visitor's bubble ·
  a 5s live-loop run exercising spawn/walk/pause/leave (VSTEPOK, zero JSERR) · new `__ui.spawnVisitor` test hook.
- POLISH ship → `SMALL_SHIPS_SINCE_EPIC 2→3` ⇒ the next firing is hard-locked to the EPIC track
  (EPICS_SINCE_STRUCTURE=0, so a FEATURE epic is allowed). Bar: **CHARM/THESIS 4** (the campus tells its
  graduates' stories by itself).

## 2026-06-14 — Maintenance sprint (clean) + the 🍎 Steve's biography gets its keynote (loop iter 86)
- **Maintenance/coherence sprint** (due — 8 firings & 7 features since iter 78): `node sweep.js` bands GREEN
  (0 bankruptcy, pluralism holds), `./bot.sh` **BOTOK**, a **fresh full 390px audit of all 5 tabs** on a
  populated late-game state (OPS/STU/CỰU SV/Tài chính/Trường). **No regressions** — the whole still coheres
  after weather, khoa identity, the Cúp Khoa, the pennant, umbrellas, the new events, the sprites.js split,
  and the biography card. The game is healthy.
- Paired ship: the **🍎 Steve biography** now gets the climax framing it deserves. A Steve is the đề Văn's
  answer embodied in a person — tapping one in the Sổ Cựu SV now shows a **gold-framed keynote** ("MỘT THỨ
  NỮA… — {ten} bước ra sân khấu. Cả nước nhận ra câu trả lời của đề Văn năm ấy.") + "không phải bằng lý lẽ,
  mà bằng một con người trường này nuôi lớn." The juice exception the game makes for the 🍎 (its one earned
  triumph) now reaches the biography card, not just the in-game burst.
- Pure ui.js (a STEVE branch in `showAlumnus`). No engine/data/save change. Verified: parse · gate GREEN ·
  bot.sh BOTOK · 390px screenshot of a seeded Steve's gold keynote card. POLISH → `SMALL_SHIPS_SINCE_EPIC
  1→2` (maintenance doesn't count). Bar: **CHARM 4**.

## 2026-06-14 — Tap a cựu sinh viên to read their biography (loop iter 85)
- Serves the owner's deepest instinct (*"people and trajectories, not scores — outcomes that span years,
  states that switch"*) where players actually meet the school's output: the **Sổ Cựu SV**. Alumni rows are
  now **tappable** → a biography card that surfaces the rich data each alumnus already carried but the list
  only hinted at:
  - the **full journey** in named states (e.g. "🪙 Cá mập coin → 🚔 Bị bắt"), not just icons;
  - their **potential** (seed stars) vs their **final stats** (Kiến thức/Tay nghề/Sáng tạo/Cá mập) — so you
    see the gap between who they could have been and who they became;
  - their **relationship with the school** (gratitude, in words) and any **gifts** sent back to the quỹ;
  - the **school's quiet good deeds** toward them (the `flags.vt` virtues → the `giftVt` thank-you lines) —
    "Cảm ơn thầy đã không bắt em học thuộc… vẫn nhớ buổi tối được mượn phòng máy."
- Pure ui.js (a `showAlumnus(id)` modal + `gratWord` helper; rows get `cursor:pointer` + onclick). Reads
  existing alumni state only — no engine/data/save change → gate & sweep untouched. Verified: parse ·
  `./gate.sh` GREEN · `./bot.sh` **BOTOK** · 390px screenshot of a rendered biography (a ★★★★★ talent who
  became a coin shark then was arrested — the tragedy made legible).
- POLISH ship → `SMALL_SHIPS_SINCE_EPIC 0→1`, `EPICS_SINCE_STRUCTURE 0`. Bar: **THESIS/CHARM 4** (the
  epilogue's "biographies" promise now reaches into the live Sổ Cựu SV).

## 2026-06-14 — STRUCTURE epic: the character sprite bakery → js/sprites.js (loop iter 84)
- The cadence-forced STRUCTURE epic + the ~10-firing architecture review. **Swapped the queued ui.js→screens.js
  for a cleaner, lower-risk move (recorded):** the iter-73 review concluded ui.js's panels/modals have "no clean
  leaf to extract" (bidirectional render coupling) — but a genuinely clean leaf was hiding in plain sight: the
  **character sprite bakery** (bakeChar/buildAtlas/customSprite/effLook/clampLook + the SKINS/HAIRSET/VARIANTS/
  ATLAS data, ~156 lines) was simply *left behind* when art.js was extracted (iter 57). It's a pure factory with a
  one-directional interface (ui.js → it), exactly like art.js/audio.js.
- Moved it VERBATIM to **`js/sprites.js` (window.SPRITES)**, completing the visual-layer separation: **art.js**
  (rooms/props/tiles) + **sprites.js** (characters) = the whole bake layer; ui.js is now orchestration + DOM
  chrome. ui.js **1690 → 1534** (−156); the ~12 call sites (syncActors, drawActor, the inspect customizer,
  panelStudents, boot, the _bakeSheet hook) rewired to `SPRITES.*`.
- **Proven behavior-neutral** (the autonomous-refactor landmine demands it): a deterministic baked-sprite pixel
  hash (via `_bakeSheet` → mapStatic getImageData FNV-1a) is **byte-identical before & after (2075002228)**;
  `./gate.sh` GREEN; `./bot.sh` **BOTOK** (full 11y, actors render across all states, zero JSERR); the customizer
  path (custom/effLook/clampLook + inspect render) verified; 390px actor screenshot clean. No data/engine/save
  change.
- **Architecture verdict (iter-84 review):** healthy. Layer law holds (engine 0 DOM, text in data.js, the visual
  bake fully in art.js+sprites.js). ui.js at 1534 is still the largest file but no longer carries the pixel
  bakery; the panels/modals→`screens.js` split remains *available* for a future structure beat if ui.js keeps
  growing, but is not urgent (it's coupling, not size, and size just dropped). **Flow reflection:** the counted
  cadence + bot.sh + divergence-when-needed is serving the owner's instincts well across 11 autonomous firings
  (74–84); the only missing input is fresh owner taste signal — everything since the BGM finale has been inference.
- EPIC shipped → cadence resets: **`SMALL_SHIPS_SINCE_EPIC 3→0`, `EPICS_SINCE_STRUCTURE 2→0`**. Bar: structure/
  debt (exempt from the rubric floor; the lift is "the visual layer is now whole").

## 2026-06-14 — Two new đề-Văn events (brain drain · the "safe path") + a title bug fix (loop iter 83)
- Branched from visual charm to **content/satire** — two fresh events naming the real forces that keep Việt Nam
  from growing its own Steve, each a genuine moral fork (the game's soul):
  - **✈️ Du học / chảy máu chất xám** — your best Năm-4 student wins a scholarship abroad: *"Em… chắc không về
    thầy ạ."* Bless them and lose them (a quiet +Thực Chất nod — talent set free) **or** persuade them to stay
    for the school's glory (+Tiếng Tăm, but the student's wings get clipped: −Mood +Vẹt). The đề Văn, made playable.
  - **👔 Bố mẹ muốn em chọn "đường an toàn"** — family pressure toward a stable công-chức life over passion:
    dull the spark for safety (+Vẹt −Sáng tạo) **or** back the dream (+Sáng tạo, a quiet nod).
  - Juice asymmetry honoured/inverted: the *virtuous* choices cost you (a lost student, foregone reputation) and
    get one quiet nod; the *selfish* choices pay in Tiếng Tăm. Both auto-resolve to their benign branch, so the
    **sweep bands are unchanged** (pluralism + destiny intact, verified).
- **Bug fix:** event modal titles never substituted `{ten}` — the pre-existing `kietSuc` event showed a literal
  "{ten} kiệt sức vì áp lực" in the heading (visible in the iter-78 audit). `showEvent` now replaces `{ten}` in the
  title as it already did in the body, so titles personalise (e.g. "✈️ Phạm Hữu Uyên được học bổng du học").
- data.js: 2 events. engine.js: 4 `applyFx` cases (`duhocChuc/duhocGiu/antoanNghe/antoanDam`; reuse the `hasNam4`
  pred). ui.js: the title fix + a `__ui.checkModals` test hook (for modal screenshots). Verified: parse · behavioural
  probe (all 4 choices · student-removal path · neutral=benign) · `./gate.sh` GREEN · `node sweep.js` bands GREEN ·
  `./bot.sh` **BOTOK** · 390px screenshot of the rendered brain-drain modal.
- POLISH ship → **`SMALL_SHIPS_SINCE_EPIC 2→3` ⇒ the NEXT firing is HARD-LOCKED to the EPIC track** (forced
  STRUCTURE: ui.js→screens.js). Bar: **THESIS/CONTENT 4** (the deck now names the actual headwinds).

## 2026-06-14 — Umbrellas in the rain — weather meets the little people (loop iter 82)
- Closes the iter-77 weather follow-up: when it drizzles, the students out in it (walking between buildings, or
  at recess on the sân) now **pop a cheerful umbrella** — varied colours (red/blue/gold/teal/purple/pink by id),
  a little domed canopy with a glint, ~75% carry one and the rest scurry bare-headed. Ties the weather layer to
  the people, so the rain reads as *happening to the campus*, not just over it ("a campus that breathes").
- Pure ui.js draw in `drawActor` (reads the `weather` var + `a._moving`/`a.act`; gated to walking/outdoor-recess
  actors so indoor folk stay dry). No engine/data/save change → gate & sweep untouched. Verified: parse ·
  `./bot.sh` **BOTOK** (11y, zero JSERR, all weather states cycled) · zoom-overlay screenshot of the rainy sân
  (colourful umbrellas + rain streaks).
- POLISH ship → `SMALL_SHIPS_SINCE_EPIC 1→2`, `EPICS_SINCE_STRUCTURE 2` (unchanged; next *epic* is the forced
  ui.js→screens.js STRUCTURE move — one more polish then the EPIC track locks). Bar: **CHARM 4**.

## 2026-06-14 — The champion flies its colours over campus (loop iter 81)
- Weaves iter-80's Cúp Khoa into the **watchable campus layer** (the game's soul): the reigning champion khoa now
  flies a small **waving pennant in its own colour on its own building** — Khoa Lập trình winning means a blue
  pennant on the Phòng máy roof; Thiết kế Chế tạo → gold on the Xưởng; Sống Ảo → purple on the Lab. So you can
  *see* who holds the cup just by watching the school, not only by opening a panel.
- Pure ui.js cosmetic: `drawChampPennant(ctx, ts)` in `drawLive` (reads `S.khoaCup.champ` → its MAJOR colour →
  its room → a Math.sin-waved pixel pennant on a little pole above the roof; guarded to nothing when there's no
  champion). No engine/data/save change → gate & sweep untouched. Verified: parse · `./bot.sh` **BOTOK** (11y,
  zero JSERR, pennant exercised across champ changes) · zoom-overlay screenshot confirming the blue pennant on
  the champion's building.
- POLISH ship → `SMALL_SHIPS_SINCE_EPIC 0→1`, `EPICS_SINCE_STRUCTURE 2` (unchanged; the next *epic* is still the
  forced ui.js→screens.js STRUCTURE move). Bar: **CHARM 4** (the campus tells the cup story by itself).

## 2026-06-14 — EPIC: Cúp Khoa — the khoas now race for a trophy across the years (loop iter 80)
- The cadence-forced EPIC (after 3 polish ships). Turns iter-79's soft khoa standing into a real **annual
  inter-khoa competition** with a multi-year **pennant race** — deeper khoa life, the top VISION next-tier item.
- **How it plays:** every year in **tháng 5** (just before the June ceremony) the unlocked khoas with students
  compete; the strongest — *members + average signature-stat + synergy/head bonuses* — wins the **Cúp Khoa** and
  a **trophy**. The reigning champion + each khoa's trophy count (🏆×N) now show in the Sinh viên khoa cards, so
  the school grows a visible *culture history*: "💻 Khoa Lập trình đương kim vô địch · cúp ×6."
- **Reward is STORY-not-power (by design, to keep the đề-Văn question open):** the trophy record (cosmetic) + a
  morale lift to the winning khoa (mood above the penalty floor gives **no** growth bonus, engine line 378 — so
  the destiny cascade is untouched) + a tiny reputation nod (+2 TT). **No cash, no stat inflation, no permanent
  growth change → no dominant strategy.** Proven: `node sweep.js` bands are **unchanged** with the cup firing in
  auto-play (0% bankruptcy, pluralism holds, destiny distribution identical within noise).
- **Non-blocking fanfare** (the owner watches remotely): a cup win fires a confetti burst + toast + news ticker
  (mirrors the Steve-burst detector), **not** a blocking modal — the watch-flow stays smooth.
- engine.js: `runKhoaCup()` (deterministic, no rnd) called from `monthRollover`; `S.khoaCup {trophies,champ,
  lastYear}` with freshState default + mergeInto (old saves get it free) + sanitize entry (no schema-V bump).
  data.js: `CONFIG.KHOA_CUP` + a ticker line. ui.js: the non-blocking celebration + trophy/champion display.
  Verified: parse · behavioral probe (fires · accumulates · same-year guard · save-compat without `khoaCup` ·
  morale reward) · `./gate.sh` GREEN · `./bot.sh` **BOTOK** (11y, cup+celebration+trophies all exercised, zero
  JSERR) · 390px screenshot of the pennant-race cards.
- EPIC shipped → cadence resets: **`SMALL_SHIPS_SINCE_EPIC 3→0`**, **`EPICS_SINCE_STRUCTURE 1→2`** ⇒ the NEXT
  epic must be the queued **STRUCTURE** move (ui.js→screens.js). Bar: **FUN/DEPTH 4** (khoas became cultures
  with stakes and a history).

## 2026-06-14 — Khoa identity + an inter-khoa standing (loop iter 79)
- First slice of the VISION next-tier **"deeper khoa life"** — done safely (UI + one data field, zero
  engine/save/balance change). The Sinh viên tab's khoa section went from a plain list to **identity-rich
  cards**: each khoa now wears its **color** (Lập trình blue · Thiết kế Chế tạo gold · Khởi nghiệp/Sống Ảo
  purple) as a left-border accent + a colored SV count, and finally shows its **motto** (the `line` that was
  already in the data but never surfaced — "Học để cái máy chạy thật…", "Cái đẹp không có văn mẫu…", "Chưa
  có sản phẩm nhưng đã có hoodie và pitch deck.").
- New **inter-khoa standing**: the unlocked khoas with students are ranked by size → **🥇🥈🥉 medals** (only
  when ≥2 compete), and the campus crowns a **"Khoa nổi bật năm nay"** at the top of the card. Purely derived
  live from member counts — no new state, no FSM/economy touch, so the destiny thesis & sweep are untouched.
- data.js: a `color` per MAJOR. ui.js: `panelStudents` khoa block (rank/medal/motto/accent). Verified:
  node-parse · `./gate.sh` ALL GREEN · `./bot.sh` **BOTOK** (full 11y in-browser, zero JSERR) · 390px
  screenshot of the new cards (accents/mottos/medals/standout header all clean, nothing clipped).
- POLISH ship → **`SMALL_SHIPS_SINCE_EPIC 2→3` ⇒ the NEXT firing is HARD-LOCKED to the EPIC track** (the
  natural epic: the rest of deeper-khoa life — rivalries with teeth / a dedicated khoa screen — or the queued
  ui.js→screens.js STRUCTURE move). Bar: **FUN/CHARM 4** (khoas read as cultures with a pennant race now).

## 2026-06-14 — Maintenance sprint + a new browser smoke-test (loop iter 78)
- The overdue ~5th-iteration health check (last was iter 67). **Clean bill of health — no game bugs found.**
  - **Sweep** (`node sweep.js`): bands green — 0% bankruptcy, pluralism holds (cram→QUAN_VAN_MAU, craft→KY_SU/🍎),
    Y1 net in band. Only the known (now accurately-worded) late-game auto-play cash flag.
  - **390px full audit**: all five tabs (Điều hành / Sinh viên / Cựu SV / Tài chính / Trường) screenshotted on a
    populated ~year-6 state — nothing clipped, all readable; the iter-76 Góp quỹ control and iter-77 weather both
    render live and correctly.
  - **Perf glance**: 2 `setInterval`s (loopTick + autosave — no leak; audio uses self-clearing setTimeout chains),
    691 DOM nodes on the heaviest late-game tab (bounded; panels rebuild via innerHTML), renders stable.
- **NEW `bot.sh`** — a full-game *in-browser* smoke test (the layer `gate.js`/`sweep.js` can't reach: they're
  engine-only). Boots the real game headless, plays 11 years via `__test.days` in chunks, and on every chunk
  re-renders all 5 tabs + a live frame + cycles weather — so a render crash on evolved late-game state surfaces
  as JSERR. Asserts core progression (rooms built · students enrolled · graduates · alumni · year 11). This run:
  **BOTOK** — zero JSERR, 84 graduated / 85 alumni / 48 roster / year 11. Turns this sprint's one-off into
  reusable infrastructure (owner values iterability/tooling as architecture). Maintenance sprint → **does not
  count as a cadence ship** (`SMALL_SHIPS_SINCE_EPIC` stays 2).

## 2026-06-13 — Weather: the campus gets sunbeams and rain (loop iter 77)
- The top unbuilt graphics/charm item (VISION next-tier · backlog #2 · the **#1 dimension**): a **weather
  layer** so the grounds feel like a *place*, not a board. A light, mostly-sunny cosmetic state cycles
  every ~22–44s: usually **clear**, often soft **god-ray sunbeams** slanting down-right from the low
  upper-left sun (warm gold, additive `lighter` blend, drifting), and the occasional gentle **drizzle** —
  diagonal rain streaks + ground-splash ticks + a cool overcast wash (kept light; *never dark*, per VISION).
  Suppressed during Tết/June so petals & confetti read clean.
- Pure ui.js draw+step layer (mirrors the existing clouds/fest pattern): `tickWeather`/`updateWeather` in
  `stepLive`, `drawRays`/`drawRain` in `drawLive` (sunbeams ride the warm light; drizzle is the front-most
  layer). **Cosmetic → `Math.random`, never serialized → zero gate/sweep/save impact.** New `__ui.setWeather`
  test hook (pins a state + freezes the cycle for screenshots). Verified: node-parse · `./gate.sh` ALL GREEN
  (engine untouched) · JSERR-clean across rain/rays/clear (200 draw frames each) AND across a 4s live-loop
  run (the step path) · desktop + **390px** screenshots of the rainy/sunbeamed campus (charming, readable,
  nothing clipped). First pass strengthened after the first screenshots read too faint — denser rain +
  brighter beams so it actually reads as weather (graphics is judged as ART).
- Single-direction tasteful implementation (no divergence workflow this autonomous turn). **OWNER**: veto/
  redirect the aesthetic freely — heavier storm vs the current drizzle, more/fewer sunbeams, or add actor
  reactions (umbrellas / scurrying under awnings) as a follow-up. POLISH ship → `SMALL_SHIPS_SINCE_EPIC
  1→2`, `EPICS_SINCE_STRUCTURE 1`. Bar: **JUICE 4** (atmosphere; the campus breathes more).

## 2026-06-13 — Góp quỹ: late-game money finally has a decision (loop iter 76)
- The standing sweep flag — *late-game bank inflates to ~2,600tr with no spend sink* — gets its first
  answer, as a **player choice** rather than a balance nerf (so the auto-play destiny thesis is untouched).
  The **Quỹ hiến tặng** card in Tài chính now has a **Góp quỹ** control: move surplus bank cash **into the
  endowment** — `+100tr`, `+500tr`, and a one-tap **Góp phần dư** (everything above the `CASH_KEEP` reserve).
  It's **one-way** (the quỹ can never be spent back; it only compounds at ×1.004/mo and funds scholarships),
  so late-game money becomes a real strategic question: *how much of today's surplus do I invest in the
  institution's future?* A contribution can **cross a SCHOL_GATE on the spot** (200/350/500tr) — unlocking a
  pantheon scholarship (Trần Đại Nghĩa / Tạ Quang Bửu / Hồ Xuân Hương) → better students. Thematic: it's
  "tiền của lòng biết ơn," and now also of the founder's deliberate sacrifice.
- engine.js: pure `contributeQuy(amt)` (clamps to available cash, guards bad input, logs the gift, calls
  `endowMilestones()`; HVS-exported, never called by the sim). ui.js: the góp row in `panelFund` (toast + chime).
  Verified: node-parse all 5 · `./gate.sh` ALL GREEN · a behavioral probe (transfer + gate-crossing unlock +
  overdraw clamp + bad-input guard) · `node sweep.js` bands unchanged (0 bankruptcy, pluralism holds) ·
  390px screenshot of the Fund tab (three buttons wrap clean, nothing clipped). sweep.js flag reworded to note
  the manual sink now exists (bot still doesn't opt in → a *passive* late-game pressure remains open).
  POLISH ship → `SMALL_SHIPS_SINCE_EPIC 0→1`, `EPICS_SINCE_STRUCTURE 1` (unchanged). Bar: **FUN 4** (a real
  late-game decision where there was none).

## 2026-06-13 — BGM enrichment: the campus music now moves (loop iter 75)
- The last unbuilt VISION dream feature. The generative campus-lofi was a static pad-drone; now each mood
  carries a gentle **chord progression** (normal I-IV-V-IV · Tết brighter · June a slow spacious swell ·
  scandal a restless minor), and the **melody, pad, and bass all follow the current chord root** — so the
  bed *moves* and breathes instead of hovering on one chord, while staying calm/consonant/generative
  (no assets, fully defensive). All four moods' schedulers verified to run without throwing (across
  init/start/toggle/sfx, no JSERR); the aesthetic is owner-verified on the live link (as audio always is).
  Pure audio.js (a `prog` per mood + a `chordRoot`/`progI` cursor). FEATURE-epic → `SMALL_SHIPS 0`,
  `EPICS_SINCE_STRUCTURE 1`. Bar: **JUICE 4** (atmosphere, owner-verified).
- **Milestone: every dream feature in VISION.md (iters 59–75) is now built** — premium characters +
  buildings, living-world lighting/weather/festivals, customization, the shareable thesis-card + the
  Steve-climax moment, and now richer BGM. The original vision is realized; the next tier (deeper khoa
  rivalries, a late-game spend sink, or a bold new pillar) is the owner's to steer.

## 2026-06-13 — Soul: the "bệnh thành tích" choice (achievement disease, loop iter 74)
- Adds the deck's missing central Vietnamese-education satire: **achievement disease / ranking fraud**.
  Once your school has graduates, a "prestigious" ranking invites you in — "chỉ cần làm đẹp vài con số…
  có hạng là có thí sinh". You choose: **làm đẹp số liệu** (juice the numbers — +5 Tiếng Tăm & +Vẹt
  school-wide, but a phốt seed: prestige bought with fakery) or **báo đúng số thật** (+Uy Tín + Thực
  Chất, a quiet good deed: integrity over rank). The thành-tích critique in one decision. New event + 2
  `applyFx`; both verified; gates green; sweep thesis intact. Bar: **BITE 4** / FUN 3. Cadence:
  SMALL_SHIPS 3 → next firing is an epic.

## 2026-06-13 — A Steve emerges: the climax finally gets its moment (loop iter 72)
- The game's defining triumph — a 🍎 **Steve** emerging from your school, the answer to the đề Văn the
  whole game builds toward — used to pass with only a news line + a stat bump. Now it's a **moment**: when
  `META.steves` increases, the campus erupts in a **golden confetti burst** + a warm glow for ~5s, with a
  toast ("🍎 Một 'Steve' ra đời — trường đã có quả táo của riêng mình!") and the warm `grad` fanfare
  chord. Rare and earned, so it lands. UI-side detection (tracks a `_steveSeen` baseline so loaded saves
  don't re-fire) + a transient `drawCelebrate` over the live layer — no engine change. Gates green; fires
  verified (no JSERR, burst renders). Well-rotated JUICE/spectacle beat (after content + graphics). Bar:
  **JUICE 4 / BITE 4** (the thesis climax, made spectacle). Cadence: SMALL_SHIPS 2.
- Note: the structure-epic (EPICS_SINCE_STRUCTURE 2) stays deferred — ui.js's remaining clusters
  (panels/modals) are bidirectionally coupled to the IIFE closure (no clean/safe leaf-extraction left),
  so a refactor there is high-effort/high-risk for modest reward; do it only when ui.js genuinely strains.

## 2026-06-13 — Soul: the "học thêm" choice (shadow education, loop iter 71)
- A fresh satirical event on the one central Vietnamese-education theme the deck was missing: **paid
  evening extra-classes (học thêm)**. Cô Giáo Trình Mẫu proposes them — "phụ huynh nào cũng muốn, trường
  lại có thêm khoản thu", but the students are already worn out. You choose: **mở** (open for all — +tiền
  & drilled KT/Vẹt, but −8 mood school-wide & a Tiếng-Tăm bump: income/results at the cost of exhaustion),
  **miễn phí cho SV nghèo** (open but free for poor students — smaller gains + a quiet Uy-Tín good deed:
  the equity middle), or **không** (let them rest — +mood & +Thực Chất: rest over drilling). The moral
  tension of VN's shadow-education culture, in one decision. New event + 3 `applyFx` cases; all 3 verified
  to resolve cleanly; gates green; sweep thesis intact (the drilling nudges cram→văn-mẫu, as expected).
  Bar: **BITE 4** / FUN 3. Cadence: SMALL_SHIPS 1.
- Also: a cohesion check confirmed the new premium buildings + premium characters harmonize (proportions
  read well — the richer buildings resolved the earlier character-size concern); no fix needed.

## 2026-06-13 — Buildings graphics step-change: a crafted, premium campus (loop iter 70)
- The buildings now match the premium 24×32 characters. `drawRoom` overhauled with **per-building
  materials** (plaster Phòng học · striped-awning Căng tin · purple-**brick** Phòng máy · **wood-plank**
  Xưởng · **glass** Lab), **tiled roofs** with row courses + ridge highlights + skylights, **shuttered
  windows** with sills + a warm interior glow, a **carved gold sign** over each door, a **base plinth/
  trim**, and a 4-step shade ramp — all keeping the fake-iso depth + per-room ROOM_STYLE identity. The
  campus reads as a crafted, cohesive, premium little world now (graphics is the owner's #1 dimension).
- **Chosen via a 3-direction divergence workflow** (deeper-2.5D / rich-materials / cozy-cottage); owner
  away, so I picked the highest-Bar (rich-materials — it covers BOTH "3D but still pixel" via kept depth
  AND "more detail/style") and ship it for veto-by-reaction. New `drawRoom`/`drawWall`/`drawDoorSign`/
  `roomMaterial` + richer `drawWindows`/`drawRoof` in art.js; garden + sân branches preserved; gates
  green; in-game verified (no JSERR, all materials render). Bar: **BEAUTY 5 / CLARITY 4**.
- FEATURE-epic shipped → `SMALL_SHIPS 0`, `EPICS_SINCE_STRUCTURE 2` (a STRUCTURE-epic is due next).

## 2026-06-13 — Follow your protégé: a name floats over the one you're watching (loop iter 69)
- A small charm beat for the game's emotional core ("a little school you love watching"). Following a
  student (⭐) already pinned a gold star overhead; now their **name floats above them in a gold pill**
  too — so you can actually track and bond with your protégé as they walk to class, tinker, and graduate.
  Watching a *named* kid grow beats watching an anonymous dot. Pure ui.js (actor carries `a.ten`; a label
  in the fav-star block); gates green; verified in-game ("Bé Khánh" labelled over the followed student).
  Bar: FUN 4 / CLARITY 4 / JUICE 3. Cadence: SMALL_SHIPS_SINCE_EPIC 3 → next firing is an EPIC.

## 2026-06-13 — Shareable end-card: your answer to the đề Văn, made beautiful (loop iter 68)
- The thesis payoff, now shareable. The epilogue ("Bản nháp bài luận của hiệu trưởng" — the reflection
  that mirrors your school back at you) now opens with a **gold canvas summary card**: "Học viện Steve ·
  Bản tổng kết · Năm N", the đề Văn question, and **your answer** — an icon + one-line verdict drawn from
  the run's branch (🍎 a Steve / 🪙 coin-shark / 📋 văn-mẫu / 👷 kỹ sư / 🌧️ unemployment / 📣 hype /
  🛠️ thực-chất / 🌱 a kind school, question still open), plus 🎓/🍎/🚔 stats and a "📸 chụp để chia sẻ"
  footer. A screenshot-able artifact of the player's own essay — exactly the open-question climax the game
  is built around (DESIGN §1: reflect, never verdict). Shown in both the pull-anytime epilogue and the
  year-12 capstone. Pure ui.js; gates green; verified in-game. Bar: **BITE 4 / BEAUTY 4 / CLARITY 4**.
  Cadence: SMALL_SHIPS_SINCE_EPIC 2.

## 2026-06-13 — Maintenance (clean) + scandal-day: the media camps out (loop iter 67)
- **Maintenance sprint** after a 6-ship run: `node sweep.js` green (destiny thesis intact, only the known
  late-game money flag), no JSERR across every new system (customizer + custom-bake, festivals, day-arc,
  clouds, AI event, audio split, period/month transitions), both panel tabs clean at 390px, per-frame
  render cost modest. The big autonomous run is healthy — no regressions.
- The checks being clean, the firing also ships a bounded, on-thesis beat: a **scandal-day reaction**.
  When the school's phốt pile up (≥3 seeds, or a sustained Tiếng-Tăm collapse), a **TV news-van camps at
  the cổng** — white van, station logo, satellite dish, blinking red LIVE dot. Your moral choices, made
  visible on the grounds (the Vietnamese-education-scandal satire, shown not told). Pure ui.js reading
  existing state (no engine/balance change); gates green; verified in-game. Bar: **BITE 4** / JUICE 3.
  Cadence: SMALL_SHIPS_SINCE_EPIC 1.

## 2026-06-13 — Customize your students (the "characters are customize" hint, loop iter 66)
- Delivers the owner's verbatim north-star — *"the characters are customize."* The student inspect card
  now has a **per-axis look customizer**: 🎨 Da (skin) · 💇 Tóc (hair colour) · ✂️ Kiểu (hairstyle) ·
  👓 Đồ (accessory) · 🎲 (shuffle), plus 🔄 to cycle presets. Any of 3×6×3×6 = 324 combos (vs the 12
  presets), baked **on demand and cached**, so your customized student is instantly recognisable walking
  the campus — individuality you can *see*, now that the 24×32 art rewards it.
- Clean + save-safe: an optional `s.lookC` override (absent = the student's VARIANT, so old saves are
  untouched); whole-object serialize round-trips it; sanitize guards malformed values; the UI clamps
  ranges on use. Verified: customizer renders at 390px, custom look shows on map + avatar, no JSERR,
  gates green (incl GATE_COMPAT). FEATURE-epic → `EPICS_SINCE_STRUCTURE 1`. Bar: **FUN 4** / BEAUTY 3 /
  JUICE 3 / CLARITY 3 / BITE 3.

## 2026-06-13 — STRUCTURE-epic: audio extracted to js/audio.js (loop iter 65)
- The cadence-due structure-epic (EPICS_SINCE_STRUCTURE hit 2). The generative-music + SFX subsystem
  (MOODS, the pad/pluck/bass scheduler, `sfx`, start/stop/toggle) is relocated verbatim from ui.js into a
  new **`js/audio.js`** exposing `window.AUDIO` (sfx/toggle/start/stop/isOn/init); ui binds `sfx` and calls
  `AUDIO.*` for the soundBtn + autoplay-unlock. **ui.js 1541→1475**; audio is now a clean, self-contained
  module (owns its own `soundOn`/`actx`). Behavior-neutral (a pure relocation): verified parse + gates
  green + clean boot (no JSERR) + soundBtn wired to AUDIO.toggle + sfx callable + toggle flips soundOn +
  the campus still renders. Done autonomously while the owner was away — ideal for invisible refactor.
- STRUCTURE-epic shipped → `SMALL_SHIPS_SINCE_EPIC 0`, `EPICS_SINCE_STRUCTURE 0`. Bar: structure/debt
  (exempt) — lowers the cost of touching either layer. The render layer (engine→art→audio→ui) is now
  cleanly separated.

## 2026-06-13 — Soul: the "AI làm hộ đồ án" choice (loop iter 64)
- A rotation from visuals back to the game's SOUL — a fresh, 2026-topical satirical event that puts the
  đề Văn question on the table directly. A Năm-4 đồ án turns out to be AI-generated overnight ("em chỉ
  prompt thôi, mà nó chạy thật mà thầy"), and you choose the school's answer:
  - **Nộp luôn** (it looks impressive) — +Vẹt, +điểm, +Tiếng Tăm, but seeds a phốt: the hollow shortcut.
  - **Cho dùng nhưng phải hiểu & bảo vệ** — +Tay nghề/Sáng tạo, +Thực Chất: AI as a *lever*, mastered.
  - **Cấm tiệt, làm tay** — bigger Tay nghề/Sáng tạo, −mood, a quiet good deed: hand-won craft.
  Three honest theses, no "correct" answer — the open question, in one decision (FUN + BITE). New event +
  3 `applyFx` cases; all three verified to resolve cleanly; gates green; sweep thesis unchanged. Rotates
  off a 4-ship visual streak (compass) and addresses the "soul getting fuller, not bolder" gap with a
  genuinely new cultural beat. Bar: BEAUTY 3 / JUICE 3 / FUN 4 / CLARITY 3 / BITE 4.

## 2026-06-13 — Festivals: the campus celebrates (Tết petals + graduation confetti, loop iter 63)
- The campus now comes ALIVE for the year's big moments. New festive-particle layer keyed to the
  calendar: **Tết (months 1–2) drifts đào-pink & mai-yellow blossom petals**; **June rains multi-colour
  graduation confetti** — both falling + swaying over the existing static décor (Tết lanterns/blossom
  pots; June red carpet/mortarboards/bunting). Mirrors the flyers/clouds ambient pattern
  (festMode/updateFest/drawFest in the live layer; self-populates on paint so it's screenshot-verifiable).
  Pure ui.js, no engine/balance touch; gates green; both modes verified via `_renderLiveOnce`. With the
  day-arc (62) and cloud-shadows (61), the grounds are now a living, sunny, *celebrating* place.
- FEATURE-epic shipped → `SMALL_SHIPS_SINCE_EPIC 0`, `EPICS_SINCE_STRUCTURE 2` (a STRUCTURE-epic is now
  due next). Bar: BEAUTY 4 / JUICE 4 / FUN 3 / CLARITY 3 / **BITE 4** (Tết + graduation are the cultural
  beats of the satirical living world). Queued: a satirical scandal-day set-piece (the campus reacts).

## 2026-06-13 — Time-of-day light: a felt sunny day-arc (loop iter 62)
- The campus now lives through a day. The per-period tint was flat-warm and barely felt; it's now a
  legible **arc — fresh cool morning → bright neutral noon → golden afternoon → a warm golden-hour glow
  at tan học** (a directional low-sun radial light from the upper-left, strongest in the last period).
  Every period stays bright (sunny north-star — never dark). Together with the drifting cloud-shadows
  (iter 61) the grounds now read as a living, sunny *place*. Pure ui.js (TINTS arc + a golden-hour glow
  in drawLive), no engine/balance touch; gates green; verified across periods 0/2/4 via `_renderLiveOnce`.
  Bar: BEAUTY 4 (the golden hour is genuinely pretty), JUICE 4, FUN 3, CLARITY 3, BITE 3.

## 2026-06-13 — Drifting cloud-shadows: the campus feels like a place (loop iter 61)
- A small, sunny ambient touch — soft **cloud-shadows drift slowly across the grounds** (4 of them,
  gentle radial-gradient patches, wrapping around), the classic Kairosoft "alive world" beat. Strictly
  drawn BENEATH the actors so they never obscure the little people you're watching, and kept light so the
  day stays bright (never darkens — the sunny north-star). Mirrors the existing flyers/cats ambient
  pattern (initClouds/updateClouds/drawClouds in the live layer). Pure ui.js, no engine/balance touch;
  gates green; verified in-game via `_renderLiveOnce`. Bar: JUICE 4 (the campus now has weather-like
  motion), BEAUTY 3 / FUN 3 / CLARITY 3 / BITE 3. A palate-cleanser between big swings; next up the
  bigger atmosphere/feature swings (time-of-day light, festivals).

## 2026-06-13 — The art step-change: premium 24×32 characters (owner-picked, loop iter 59)
- The #1 priority — graphics, "not yet met" — takes its biggest swing yet. The flat 16×22 chibis are
  replaced by **premium 24×32 volumetric characters**: one consistent upper-left light with a 4-step
  ramp per body mass (lit rim → core → shade → deep terminator), a 1px outline, **separated arms** with
  sleeve cuffs + skin hands, a rounded crew collar, an expressive face (brows, two-tone sparkly eyes,
  blush, two-tone smile), and a soft baked **contact shadow** grounding each figure. The owner's "3D but
  still pixel, characters with volume" directive, delivered.
- **Chosen via a 3-direction DIVERGENCE workflow** (iso-block / soft-rounded / bigger-detailed), each a
  self-refined prototype; the owner picked Direction C (bigger & detailed). Integrated into `bakeChar`,
  with `drawActor` blit offset (x−12, y−30), the overhead markers (star/fav/selection/Mai-frame),
  idle-blink, `_bakeSheet`, and the inspect avatar all re-anchored for the taller sprite. No JSERR,
  gates green, verified in-game via `_renderLiveOnce`.
- FEATURE-epic shipped: `EPICS_SINCE_STRUCTURE 1`, `SMALL_SHIPS_SINCE_EPIC 0`. Bar: **BEAUTY 4** (the
  flat-sticker look is gone), JUICE 4, FUN 3, CLARITY 4, BITE 3. OWNER: characters now read a touch BIG
  vs the buildings (the 24×32 tradeoff you accepted) — if it bugs you, a map-scale pass is queued
  (backlog #7); say the word and I'll proportion the world to them.

## 2026-06-13 — Visible build badge: confirm the live deploy loaded (owner-requested, loop iter 58)
- Owner ask: "a version name on top so we know the deploy is loaded." A small **build badge** now sits in
  the header (top-right): `v HH:MM DD/MM`, derived from the `?v=` cache-bust stamp that `bump.sh` already
  refreshes on every push — so it **changes every deploy**. Glance at it to confirm the live page is the
  fresh build, not a stale cache (the recurring "still looks like before" pain). Subtle by design; easy to
  move into credits when the product matures. Pure chrome (no engine/balance touch), gates green.
  Bar: CLARITY 4 (you can now trust what you're looking at is live). OWNER: used the build timestamp as
  the "version" since it auto-changes per deploy — say if you'd prefer a manual semantic version (v1/v2).

## 2026-06-13 — STRUCTURE-epic complete: pixel-art extracted to art.js (loop iter 57)
- The refactor deferred for **35 iterations** finally shipped — autonomously, proven safe by the new EPIC
  machinery. The pure pixel-art layer (the palette `PX`, `ROOM_STYLE`, the helpers `shade`/`roundRect`/
  `glow`, and ~25 stateless drawers — buildings, roofs, windows, gardens, props, lamps, seasonal Tết/
  June) is extracted from the 1694-line ui.js into a new **`js/art.js`** (317 lines) exposing `window.ART`;
  ui.js binds those names into its closure. **ui.js is now 1393 lines** (−301), and all future graphics
  work touches one focused art file — the owner's "iterability as a product" win, unblocking the art
  step-change that's next in the backlog.
- **Proven behavior-neutral** (the machinery's gate for a refactor): the deterministic static canvas
  renders a **byte-identical hash** before vs after (3914331577 / 188938 chars); the live layer renders
  with **zero JSERR**; all gates green. The extraction was caught mid-flight trying to move `drawTapFx`
  (which secretly reads ui state) — the restored `onerror` trap surfaced it instantly, the deterministic
  test failed, I corrected the boundary and re-proved. The safety net worked exactly as designed.
- `## Cadence` reset (epic shipped): `SMALL_SHIPS_SINCE_EPIC 0`, `EPICS_SINCE_STRUCTURE 0` — the loop is
  free again. Bar: unchanged 3s (STRUCTURE-epic, debt-exempt) — but it lowers the cost of every future
  BEAUTY ship. `content.js` deemed unneeded (text already lives in data.js CONTENT).

## 2026-06-13 — STRUCTURE-epic checkpoint 1: production error trap restored (loop iter 56)
- First firing of the **redesigned loop**, and it behaved exactly as the new `## Cadence` ledger forces:
  hard-locked to the EPIC track (7 small ships → epic-only) and to a STRUCTURE-epic (structure overdue),
  it dequeued backlog #1 and paid down the worst standing debt. The `window.onerror` **production error
  trap** — dropped in the multi-file split and missing ~50 iterations — is back as the first inline
  script in index.html: on any uncaught error it sets `document.title='JSERR: …'` (tests/telemetry) and
  shows a gentle red "⚠ Có lỗi nhỏ — chạm để tải lại trường." reload bar. No more silent white screen on
  a phone — the worst failure mode, now self-healing. Verified: thrown error → title+banner fire; normal
  boot stays clean; gates green. Next checkpoint of this epic = the ui.js → ui.js/art.js/content.js split
  (in a worktree, proven behavior-neutral). Bar: BEAUTY 3 / JUICE 3 / FUN 3 / CLARITY 4 / BITE 3
  (debt-exempt; lifts CLARITY — a broken state now explains itself + offers a fix).

## 2026-06-13 — Campus life: the afternoon is now a khoa practicum (loop iter 55)
- Completes the charm thread from iter 54 — **all three khoas now have a signature on-map activity**, so
  in the afternoon period you can read a student's major just by watching where they go and what they do:
  - 💻 **Lập trình** (spark) heads-down at a glowing **monitor** in Phòng Máy — green code scrolls line by
    line, a cursor blinks (`code`).
  - 🎨 **Thiết kế Chế tạo** (sky) shapes a **workpiece** at the Xưởng — a plank, a sliding saw, sawdust
    spraying off (`craft`).
  - 🚀 **Khởi nghiệp (Sống Ảo)** (hype) still livestreams itself at the Lab (`stream`, iter 54).
  The campus visibly splits by discipline each afternoon — the Khoa system, legible through pure watching
  (the game's "love watching little people do stuff" soul). Pure ui.js (routing + two new activity overlays
  + emotes), no engine/balance change; gates green; all three verified via `_renderLiveOnce` zoom.

## 2026-06-13 — Campus life: the Sống Ảo khoa livestreams itself (loop iter 54)
- First iteration to tie the new **Khoa system to visible campus life** — and a satirical one. In the
  afternoon period, students of the **Khoa Khởi nghiệp (Sống Ảo)** (the *hype*-tell influencer major)
  now **skip the workshop and crowd the Lab to film themselves**: each holds a glowing phone up to their
  face with a blinking REC dot, a ring-light wash, and pink "like"-hearts floating up; their emote bubbles
  lean ❤️/✨ (likes & clout). A whole khoa standing around livestreaming instead of building anything —
  the dark mirror of the đề Văn, shown not told. New `stream` activity (routing + overlay + emote); the
  Lab that unlocks the khoa now also animates it. Pure ui.js (no engine/balance change); gates green;
  verified with a 5× zoom of the actor layer via the new `_renderLiveOnce` hook (iter 53's tooling — its
  first real use). First graphics/charm iteration after 6 straight mechanics ships.

## 2026-06-13 — Tooling: the living campus is now screenshot-verifiable (loop iter 53)
- Closes a real verification gap behind the game's #1 priority. The walking students + activity
  animations draw only in the rAF `liveLoop`, which headless Chrome throttles — so every screenshot
  showed an **empty map**, and "people doing things" (the soul of the game) shipped on hope. Split
  `liveLoop` into `stepLive` (advance) + `drawLive` (paint) — behavior-neutral — and added a
  `__ui._renderLiveOnce(period)` test hook that paints ONE live frame on demand. Now a headless
  harness can do `setPeriod → _sync → _settle → _renderLiveOnce → screenshot` and actually SEE the
  campus full of students. Verified: a 390px shot now renders 15 detailed pixel-art students around
  Phòng học / Xưởng / sân (recess football, benches) where before it was bare grass. No gameplay
  change; gates green. The improve-steve skill gained the recipe + a landmine so every future
  campus-liveliness iteration is proven, not hoped.

## 2026-06-13 — Khoa P4b: trưởng-khoa (a teacher head boosts a khoa, loop iter 52)
- More majors-depth (the owner's "add more depth to the mechanics"). You can now **assign a teacher
  as trưởng khoa** to any unlocked khoa, from the "Khoa / Chuyên ngành" card (a "Phân công" / "Đổi"
  button per khoa). A headed khoa **thrives at one fewer student** (synergy bar drops 4→3) **and grows
  faster** (+`HEAD_BONUS` 0.12/day on top of `SYN_GROW`). One teacher heads at most one khoa — so with a
  small faculty you must *choose* which khoa to back (decision density, not a free buff). Verified via a
  node probe (3-SV khoa: synergy OFF unheaded vs ON + 12.6 tn/30d headed); save-compat holds (`khoaHead`
  defaulted in freshState + pruned in sanitize); gates green, sweep thesis intact; 390px-verified.
  P4 remaining: khoa-vs-khoa rivalry/events, a dedicated Khoa screen if the card outgrows itself.

## 2026-06-13 — Khoa P4a: cross-khoa synergy (interdisciplinary → 🍎, loop iter 51)
- First slice of the majors-depth phase the owner asked for. When **two or more khoas are thriving**
  (each ≥4 students with synergy on), their members **cross-pollinate**: each gets a bonus to a second
  stat (coders pick up Sáng tạo, designers pick up Tay nghề, founders pick up Sáng tạo). So a *focused
  interdisciplinary* school — tinkerers in Lập trình **and** dreamers in Thiết kế, both rooms built —
  grows dual-skilled students (high Tay nghề **and** Sáng tạo), which is exactly the profile that
  reaches 🍎. A "⚡⚡ Liên khoa" line lights up in the Khoa card when it's active. Verified (+10.3 vs
  +1.5 secondary-stat gain with two khoas vs one); sweep confirms it rewards *focus* without
  over-producing Steves in unfocused play (thesis holds); gates green. More P4 depth (khoa head,
  rivalries) still queued.

## 2026-06-13 — Khoa/Majors P2 (the UI) + Trần Phi Lợi hidden until arrested (loop iter 50)
- **P2 — the Khoa system is now visible.** New "Khoa / Chuyên ngành" card in the **Sinh viên** tab:
  each khoa shows its icon/name, whether it's unlocked (or "🔒 Xây [building] để mở"), member count,
  synergy status (⚡ active vs "N/4 để cộng hưởng"), and the destiny it leans toward (👷 kỹ sư /
  🍎 sáng tạo / 🪙 cá mập coin), plus an "Đại cương" line for unaffiliated students. The student
  **inspect card** now shows a gold khoa chip. Verified at 390px: locked→unlocked transition, the
  prodigy appears, counts correct. (P3 balance was already confirmed clean in iter 49; P4 depth next.)
- **Fix (owner: "why Trần Phi Lợi appears too soon?"):** the founder's old cram-school star is seeded
  for his scripted Y2-M3 arrest, but he was showing in the Cựu SV book from Year 1 — before the school
  has any real graduate. He's not THIS school's alumnus; now he's **hidden from the Sổ (and the school
  record) until he's actually arrested** ("lên báo"), matching the intro's "sắp lên báo". Gates green.

## 2026-06-13 — Khoa/Majors system P1: the engine (loop iter 49)
- First phase of the owner-requested majors system (plan in ROADMAP, owner-approved). Three khoas,
  each unlocked by a building and steering a destiny: 💻 Lập trình (Phòng Máy → Tay nghề → kỹ-sư),
  🎨 Thiết kế Chế tạo (Xưởng → Sáng tạo → Steve), 🚀 Khởi nghiệp/Sống Ảo (Lab → Cá mập → the coin
  trap). Students **auto-join** the khoa matching their *tell* once its building exists (else Đại
  cương). A khoa with ≥4 students gets a **synergy** bonus (+0.3/day on its stat) — so a *focused*
  school out-develops a scattered one. Building a khoa's room the first time opens it and pulls in a
  **prodigy "tuyển thẳng"** (the "talent unlocks with the major" beat), with a news line. Verified by
  simulation (auto-join, prodigy enroll, synergy A/B = +21 vs +3 tn), and the sweep confirms the
  craft→🍎 / cram→văn-mẫu thesis still holds (synergy reinforces focus, doesn't break it). Gates green.
  **Next: P2 (the Khoa UI — a card in Sinh viên + a khoa chip in the inspect card).**

## 2026-06-13 — Buildings upgrade in place + gentle SFX (loop iter 48)
- **Owner clarification ("buy more but show 1 — consider it upgrading"):** buildings are no longer
  one-per-type. Buying the same building again now **upgrades it in place** — still one on the map
  (no clutter), now with a gold Lv pip badge, up to Lv3. Each level scales the effect (Căng tin
  +1 Mood/level, Lab +0.5 Tiếng Tăm/level, extra Phòng học eases crowding) and costs a flat upgrade
  fee (a small money sink too). The build menu shows "Xây" → "Nâng Lv2/3" → "Tối đa". Verified:
  3 buys of one room = 1 on the map at Lv3, 4th rejected, effects scale; gates green, sweep clean.
- **Gentle SFX** (audio, untouched since iter 3): opt-in (🎵 toggle) musical cues in the score's
  timbre — a perfect-fifth on build, a soft chime on upgrade/dedication, a bright arpeggio on
  milestone/tier-up, a warm chord at graduation. Soft and short; no-ops when sound is off.

## 2026-06-13 — Three more moral-choice events (loop iter 47)
- A pacing check confirmed the early game is well-paced (7–13 events/year + yearly admissions +
  milestones + graduations from ~Y4), but with ~11 events the deck repeats. Added a recurring moral
  deck for variety + the satire's soul: 📉 a ranking site drops you to the bottom and a "PR expert"
  sells a 15tr rank-pumping package (buy hype +mầm-phốt vs let điểm chuẩn speak); 😵 a student burns
  out from grade pressure (push them for +Vẹt/−Mood vs give them a week off); 📑 a Năm-4's đồ-án is a
  line-for-line copy of an open-source project (cover it up +Vẹt/+mầm-phốt vs make them redo it for
  real skill +Uy Tín). New `hasNam4` event targeting; all six branches verified; gates green; sweep clean.

## 2026-06-13 — Campus glow-up gets a moment (loop iter 46)
- The campus-tier upgrade (iter 45) happened silently — you'd build your 3rd room and the grounds
  quietly got prettier without knowing why. Now reaching a new prestige tier fires a celebratory
  toast ("🌿 Sân trường gọn gàng hơn…" at tier 1, "🏛️ Trường khang trang hẳn…" at tier 2) and an
  immediate repaint, so the glow-up reads as an earned milestone. Tracked in `META.campusTier`
  (once per tier, persists across reloads). Verified the 0→1→2 progression fires on cue; gates green.

## 2026-06-13 — Campus glow-up: visuals upgrade as the school grows (owner #2, loop iter 45)
- The owner's "when we reach high enough value, the school should look cleaner" idea. Added a
  monotonic campus-prestige tier (0 → 2): **tier 1 (established)** once you've built out ≥3 rooms —
  brighter, more manicured grass (fewer weeds, mow stripes) and tidy stone edging on the paths;
  **tier 2 (prestigious)** once you've raised a memorial garden / produced a Steve / graduated ≥20 —
  the dirt paths become a light **stone-paved plaza** and warm **lamp posts** flank the cổng. All in
  the static layer + safe zones (paths/grass/gate never collide with buildings); monotonic so the
  upgraded look never flickers back. Verified the tier-0 dirt look vs the tier-2 paved look; gates green.

## 2026-06-13 — Auto-update + one-of-each + no double-tap-zoom + protégé payoff (loop iter 44)
- **Auto-update (owner: "do something so I can see changes each ship"):** on load the page now fetches
  a cache-busted fresh index.html, reads the live build, and if it's newer than what's running, hops
  to it via a `?b=<build>` URL — so a plain refresh always lands on the latest deploy past GitHub
  Pages' 10-min index.html cache. Guarded (sessionStorage per build) against reload loops.
- **One of each building (owner: "x2 makes the map crowded, maybe only 1"):** the standard rooms are
  now `once` — building a second is rejected and built rooms drop out of the build menu, so the campus
  stays a tidy predefined-style layout (one Phòng học, one Lab, …). Pairs with auto-placement.
- **No more double-tap zoom (owner):** `touch-action: manipulation` everywhere — iOS ignores
  `user-scalable=no`, so double-tapping the map was zooming the page; now it doesn't (scroll kept).
- **Protégé payoff:** when the student you're following (iter 43) graduates, their result is spotlit
  at the top of the June ceremony with a ⭐ and a news line ("em bạn dõi theo từ ngày đầu — tốt
  nghiệp: …"), and the follow clears. Closes the follow-a-kid emotional loop. All verified; gates green.
- *Queued (owner):* upgraded campus visuals once the school reaches a high enough value (a cleaner,
  fancier look as a prestige tier) — next iteration.

## 2026-06-13 — Follow a student (your protégé, loop iter 43)
- Serving the north-star ("the characters… doing stuff you like to see"): a student's inspect card now
  has a ☆/⭐ **follow** toggle. Mark one as your protégé and they get a persistent gold star bobbing
  over their head on the map — so among 40 kids you can pick *one* and watch them from nervous tân SV
  through the years to whatever they become, without it spoiling the June reveal. New `META.favId`;
  the marker reuses the verified pixel-overhead pattern; toggling re-syncs the actor flag live.
  Verified the toggle sets/clears state and the button reflects it; gates green. *Follow-up:* a
  payoff line at graduation when your followed student walks out and becomes a kỹ-sư / văn-mẫu / 🍎.

## 2026-06-13 — Clock auto-starts after the intro (onboarding, loop iter 42)
- The game booted **paused** (speed 0) with no cue to press play, so a first-timer could build their
  Phòng học, see the "wait for tháng 7" goal, and then watch nothing happen because the clock wasn't
  running. Now dismissing the intro auto-starts the clock at 1× (only when it was paused, i.e. a
  fresh session — reloads keep your saved speed), and the 1× button lights up so it's clear time is
  flowing. Closes the "nothing happens after I build" gap in the from-nothing onboarding. Verified
  boot=paused → intro-dismiss → 1× active; gates green.

## 2026-06-13 — Buy → it just appears: auto-placement (owner UX, loop iter 41)
- Owner hit the build flow cold ("How should I touch?") — tapping a build button entered a manual
  "placing" mode whose only cue was a tiny bottom strip, so it wasn't clear you had to then tap the
  map. Per the owner's own idea ("predefined layout… when we bought something it just appear"),
  removed manual placement entirely: tapping a building (or a memorial garden) in the build menu now
  **auto-places it** in the next tidy spot — reading-order scan, inside a 1-tile border, off the
  central path — and briefly highlights where it landed. New engine `autoPlace()` (with a path-avoiding
  fallback); the build menu gained a "phòng tự hiện ra trong khuôn viên" hint. Verified: 9 mixed
  builds land with 0 overlaps and 0 on the path, a real button-click places a room, gates green.

## 2026-06-13 — Maintenance sprint + flow reflection (loop iter 40)
- No new feature — a health pass after a 5-iteration feature run (tap polish, June décor, cache fix,
  decade capstone, reformer gardens). Verified the integrated whole: `sweep.js` clean (pluralism
  holds — cram→văn-mẫu, craft→kỹ-sư; only the known money-inflation flag remains); a 13-game-year
  all-systems playthrough (4 rooms + gardens, multiple cohorts, graduations, save/load on the new v3
  key) ran with **no JS errors** and ~33ms/run perf; the ops + Trường panels pass the 390px mobile
  audit (build grid, 5-figure dedication section, build stamp, reset all render clean); the seasonal
  June carpet confirmed on the live map. **No regressions found.** Flow reflection recorded in ROADMAP:
  40 iters shipped, complete arc from empty lot to decade capstone, `js/ui.js` (1508 lines) is the
  standing structural debt (art.js extraction still queued).

## 2026-06-13 — Two more reformers to honour (loop iter 39)
- Extended the memorial gardens with the two figures whose lives most directly *are* this game's
  argument: **Nguyễn Trường Tộ** (dâng điều trần đòi dạy thực học — toán, máy móc, ngoại ngữ —
  giữa thời chỉ học để thi; the court shelved it, and a century on we're still debating exactly
  what he wrote) and **Chu Văn An** (treo ấn về quê dạy học rather than serve a court that ignored
  his petition to behead seven corrupt officials). Both are one-time escalating builds (450/550tr,
  +6 Uy Tín) with their own dedication reflection — a `GARDEN_FIGURES` map decoupled from the
  scholarship Pantheon. Now five reformers can be honoured (1750tr of late-game cash sink + a
  "build the whole grove" goal). Verified build/+Uy Tín/lines/once-gate/render; gates green.

## 2026-06-13 — "Mười năm sau" — the decade capstone (loop iter 38)
- `RUN_CAP_YEARS: 12` had been defined but never used — the game had no ending or payoff, it just
  trailed off. Now when the school reaches its 12th year, the reflective epilogue essay (previously
  pull-only) auto-fires once as a **"Mười năm sau · Lễ Bế Giảng"** capstone: the headmaster looks
  back across the decade, the essay written in the faces that passed through — the destiny tally,
  the cast, the ledger, the branch-voice verdict, the đề still hanging. It defers politely under any
  gameplay modal (June/admissions/event) and shows once (META.decadeShown); the school keeps running
  after (sandbox). Gives a full playthrough a philosophical climax. Verified: arms exactly at year 12,
  fires on a clear stage with the "Mười năm sau" framing, doesn't re-fire; gates green.

## 2026-06-13 — "Still the same after many versions" — cache/save fix (loop iter 37)
- Owner reported the live site looked unchanged across many builds. Diagnosed: deployment was always
  correct (live `?v=` matched HEAD), but two things stacked — (1) GitHub Pages serves index.html with
  `Cache-Control: max-age=600`, so browsers held a stale index.html (old `?v=` → old JS); (2) the old
  localStorage save loaded the pre-reframe 42-student school, hiding the start-from-nothing boot even
  when code did update (confirmed by the owner's screenshot: new 3D buildings + milestone banner, but
  42 SV). Fixes: **bumped SAVE_KEY v2→v3** so the incompatible old save is retired and the from-nothing
  boot shows automatically (one-time correction for the iter-24 reframe); **cache-control meta tags**
  on index.html to push browsers to revalidate the entry HTML; and a **visible build stamp** (read
  from ui.js's own `?v=`) in the intro footer + Trường tab, with a "your save is from an older build"
  hint — so it's always clear what version is actually running. Gates green.

## 2026-06-13 — Graduation day dresses the campus (loop iter 36)
- The emotional climax — June graduation — had no visual occasion (Tết did, via iter 31's seasonal
  hook). Now Tháng 6 dresses the campus for Lễ Tốt Nghiệp: a gold-trimmed **red carpet** down the
  central path (the procession route to the cổng — pairs with the graduation walk-out), **tossed
  mortarboard caps** at the top (the signature graduation image), and academic blue/gold bunting.
  Reuses `drawSeason()`; distinct look from Tết. Verified it shows in month 6 and is gated off
  otherwise; gates green.
- Also corrected an iter-34 audit note: the "Uy Tín erosion" I flagged is **not a bug** — the sweep
  shows UT is a healthy moral meter (honest school ~43, cram ~18); my audit's UT=1 was one harsh
  cram endpoint. Gardens' one-time +Uy Tín is left as-is (you can't monument away how you run a school).

## 2026-06-13 — Mobile tap polish + reset button (loop iter 35)
- Following up the owner's "map selection still not clear" across all three dimensions, not just the
  visual marker (iter 34): (1) **tap ripple** — every tap now spawns a brief expanding gold ring at
  the touch point, so a tap visibly registers (no hover on mobile); (2) **more forgiving targets** —
  the open-ground student hit radius went 11→14px and the in-room radius 7→9px, so imprecise finger
  taps land (the new on-map marker confirms the hit, so a generous radius is safe). Together with the
  iter-34 selection marker, tapping the world now feels responsive and unambiguous on a phone.
- **Reset button** (owner request — "reset to reload the game to the latest version to test"): the
  Trường tab now has a "🔄 Chơi lại từ đầu (xoá lưu)" button with a confirm modal that wipes the
  localStorage save and reloads, so the latest build always shows from a clean start-from-nothing
  boot (no stale save hiding new changes). Guarded with a `resetting` flag so the 4-second autosave
  and the visibility-hide autosave can't re-write the save between the wipe and the reload.
  Verified the button + confirm flow render; gates green.

## 2026-06-13 — On-map selection marker + maintenance audit (loop iter 34)
- **Owner feedback: "map selection on mobile still not clear."** Tapping worked, but nothing on the
  map showed *what* you'd selected — the inspect card just appeared at the bottom. Added a clear,
  pulsing selection marker: a tapped student gets a gold feet-ring + a bobbing overhead pointer; a
  tapped room gets gold corner brackets. Selection tracks every tap and clears on dismiss, so on a
  small phone screen it's now unmistakable which student/room the card refers to. Verified the state
  wiring (room→bracket, student→pointer, hide→clear) and the bracket render; gates green.
- **Maintenance sprint** (~5th-iter cadence): 11-game-year playthrough exercising all systems
  (gardens, events, Tết, văn-mẫu, walk-in/out) ran clean — no JS errors, save/load solid, sim 28ms
  (no perf issue). Noted for follow-up: Uy Tín erodes to ~1 over a long run despite garden boosts
  (a decay-balance item), and the late-game money-inflation sweep flag persists (S4 spend channels).

## 2026-06-13 — Memorial gardens: honour a real educator (loop iter 33)
- The late game had no aspiration once the founding milestones were done, and the philosophical
  core (the owner's emphasis: "the player's own version of the answer") lived only in the epilogue.
  New: buildable **Vườn Tưởng Niệm** memorial gardens honouring three real Vietnamese educators —
  Trần Đại Nghĩa (made tools from scarcity), Tạ Quang Bửu (self-taught, opened the world), Hồ Xuân
  Hương (wrote in her *own* voice in an age of borrowed templates — literally the văn-mẫu thesis).
  Each is a one-time, escalating-cost build (150/250/350tr) that grants a full +5 Uy Tín (pierces
  the yearly cap — it's a deliberate, paid honour) and opens a reflective dedication modal placing
  the school's question ("how do we get a Steve Jobs Việt Nam?") beside someone who answered it
  with their life. Renders as a tended lawn + stone stele on the campus. Reuses the Pantheon
  content (the lines already existed as scholarship flavour) and the build system. A late-game
  cash sink with a soul + a collectible prestige goal. Mechanics verified (once-gate, affordability,
  +Uy Tín, philosophical line); gates green.

## 2026-06-13 — Founding-era event deck + structure review (loop iter 32)
- The from-nothing build-up years were event-sparse (most event predicates need năm-4 students or a
  populated school). Added a 3-event founding deck (pred `founding`: năm ≤ 3, ≥1 student), each a
  moral choice about the young school's identity: 👀 a parent inspects the bare campus (oversell for
  +Tiếng Tăm +mầm-phốt vs honesty for +Uy Tín); 📖 the lone overworked teacher suggests "dạy tủ"
  (school-wide +KT+Vẹt−ST cram vs +TN+Mood real teaching); 💸 an angel investor pays 30tr to rename
  the school (sell the name for cash/−Uy Tín vs keep it). All six branches verified for correct
  fx; gates green; sweep balance unaffected.
- **Code-structure review** (owner directive, ~every 10th iter): verdict logged in ROADMAP —
  layering still clean after 12 feature iters; ui.js (1334) is the growing hotspot; the chunked
  art.js extraction stays queued for an owner-OK'd invisible iteration (shared-helper coupling noted).

## 2026-06-13 — Tết comes to campus (seasonal décor, loop iter 31)
- The campus looked identical year-round; the tetBeat mechanic (Tháng 2 mood boost) had no
  visual presence. Now Tháng 1–2 decks the grounds for Tết: a red/gold/teal bunting garland
  strung across the top, and red lanterns + mai (yellow) / đào (pink) blossom pots flanking the
  cổng. All in safe zones (top strip + the always-clear gate) so no player building is disturbed.
  Driven by a `drawSeason()` pass in the static layer; `monthRollover` now flags `_mapDirty` so
  the décor tracks the calendar. Verified Tết shows in month 2 and the campus is clean in month 5.
  Hooks for future seasons (June graduation flair, etc.) are in place. Gates green.

## 2026-06-13 — The Văn-Mẫu champion is finally reachable (loop iter 30)
- The 📋 Quán Quân Văn Mẫu end-state — the thematic heart of the whole đề-Văn premise — had
  been **mathematically unreachable** (sweep-flagged): cram graduates have huge knowledge + cram
  but near-zero craft/creativity, so they *failed* the craft-based graduation diem and were routed
  to THẤT NGHIỆP, never reaching the cascade. Fixed the satire: a rote exam-champion now "passes"
  into a bureaucratic công-chức role by memorization even when the đồ-án score fails (isVanMau:
  kt≥70 ∧ vet≥55 ∧ st≤25). The rote crammer who also grew a predatory hustle (cm≥64) pivots to
  cá-mập-coin instead — so cram now mass-produces văn-mẫu (59-66%), breeds some sharks (9-11%) who
  get arrested (7-9%), exactly the dark mirror. **Both stale sweep flags cleared**; the craft
  thesis is untouched (đồ-án still → 75% kỹ-sư / 13% 🍎, cram still 0% 🍎); pluralism strong; gates
  green. All the văn-mẫu content (chip, flavor, alumni lines, gifts, FSM) was already written —
  it was just stranded behind an impossible gate.

## 2026-06-13 — Graduation walk-OUT + maintenance audit (loop iter 29)
- **Walk-out:** at June, graduating (and any departing) students no longer blink out — their
  actor stays and walks OUT through the cổng before being dropped, mirroring the matriculation
  procession. After the ceremony modal you watch your cohort file out the gate with a 🎵 bubble,
  often crossing the new tân-SV walking IN — a visible changing of the cohorts. UI-only; verified
  (12 enrolled → remove 5 → all 5 walk out past the gate → dropped, 7 remain).
- **Maintenance sprint** (overdue after ~10 feature iters): re-ran sweep (clean bar the two known
  flags — money inflation + QUAN_VAN_MAU), error-checked boot → build → 2 intakes → save/load →
  sim (no JS errors), and audited the 390px HUD/intro — measured the meters fit and the new
  goal-banner/lore render correctly. No regressions found from the start-from-nothing/3D/milestone run.

## 2026-06-13 — Founding milestones (early-game guidance, loop iter 28)
- Start-from-nothing left Years 1–4 (pre-first-graduation) thin on direction. Added a "Cột mốc"
  system: a gold HUD banner shows the next founding goal (build first Phòng học → first intake →
  hire a 2nd teacher → build a chuyên-môn room → grow to 20 SV → first graduation), each
  celebrated with a toast + ticker line + a small +4 Tiếng Tăm (the school gets noticed). Goals
  fire independently (real progress is always celebrated) and the banner shows the first unearned
  one as the suggested next step; it hides once the build-up arc is done. New `META.goalsHit`
  state (+ sanitize guard); engine `checkMilestones()` runs on day-tick, build, intake, and hire
  so it's responsive even while paused. Gates green; verified the full chain reaches firstgrad ~Y5.

## 2026-06-13 — 3D-but-pixel PEOPLE (owner directive C, part 2, loop iter 27)
- Re-baked the character sprite atlas with volume: faces and torsos are now lit from the
  upper-left (lighter skin/shirt highlight edges) and shaded on the lower-right (2-tone shirt
  shadow, right cheek/hair/arm/leg in shade) — so each chibi reads as a rounded form instead of
  a flat cut-out, matching the buildings' light direction. Kept bright + crisp (subtle, not
  muddy). Verified against a before/after 5× sprite sheet across all 12 variants. Directive C
  (houses + people both 3D-but-pixel) now complete; further depth/polish is optional.

## 2026-06-13 — 3D-but-pixel BUILDINGS (owner directive C, part 1, loop iter 26)
- Buildings were flat front-elevations; now each reads as a chunky 3D block. Added an extruded
  depth silhouette (solid dark side+roof faces offset down-right = the box's thickness), a single
  directional contact-shadow pool, and lit top/left wall edges — light consistently from the
  upper-left. Works across all roof types (gabled house gets a real hip/gable depth; flat/awning/
  glossy/vent/sawtooth get an eaves slab). Drawing-only: footprints and walk-blocking unchanged.
  Verified at 2× phone scale across all 5 room types. Part 2 (people get volume/shading) is next.

## 2026-06-13 — Students walk IN through the cổng (owner directive B, loop iter 25)
- New matriculants no longer pop into existence — each freshly-enrolled student spawns just
  OUTSIDE the gate (below the map at the cổng's x) and walks up the central path to their first
  spot. A whole intake files in as a staggered procession (queued in a short column so they
  don't overlap), each wearing a little "!" welcome bubble until they step onto the grounds.
  Pairs with start-from-nothing: the July founding intake arriving through the gate is now the
  game's first satisfying beat. Boot/reload places the existing roster in place (no mass march).
  Verified numerically (headless rAF is throttled): all 12 spawn below the gate and climb in.

## 2026-06-13 — START FROM NOTHING (owner directive A) + room-click fix (loop iter 24)
- **Reframe: found a school from scratch.** Boot is now an empty lot — 0 rooms, 0 students,
  1 founding teacher, a thin cash pot (200tr) with an origin story (you viral'd the đề Văn
  answer, cắm sổ đỏ + won 50tr "vốn mồi"). Replaces the old "buy a bankrupt uni with 42 SV +
  3 biên-chế" premise. Calendar boots Tháng 6 → first July rollover opens the FOUNDING INTAKE;
  Mai Sương is guaranteed to be enrollee #1 (the first believer). Empty Junes (no Năm-4 yet)
  roll the year & advance grades silently (foundingJune) — first real graduation lands ~Year 5.
  Trần Phi Lợi re-homed as a shadow alumnus (the founder's old cram-school star, cá-mập-coin),
  frozen until his scripted Y2-M3 arrest. New boot lore + intro copy ("Đặt viên gạch đầu tiên").
  GATE_FRESH rewritten (boot 0/0/1/1, Year 2 + ~12 SV + Mai after 400d); sweep Y1 band
  recalibrated for the lean founding year (0..18). All gates green; sweep thesis still holds.
- **Fix:** tapping a room (e.g. Phòng học) now opens its inspect card — clustered campus-life
  students no longer intercept the tap (room wins inside its rect unless you tap right on a SV).

## 2026-06-13 — Two new moral-choice events (loop iter 23)
- 📸 "Báo muốn bài thủ khoa đầu ra" (stage a coached student for +Tiếng Tăm +mầm phốt, vs let a
  real kỹ sư speak awkwardly for +Uy Tín) and 🎁 "Phụ huynh lập quỹ khuyến học" (take the 25tr
  "donation" with strings → +cash +Vẹt +mầm phốt, vs decline for +Uy Tín + a Bác Tâm nod).
- Both encode the hype-vs-substance tension; new fx + predicates (hasNam4/common); all four
  branches verified (TT/UT/cash/phốt deltas correct). Gates green.

## 2026-06-13 — First-time intro (loop iter 22): set the premise
- New players landed in the school with zero context. Added a one-time intro modal that shows
  the boot premise (the real 2026 đề Văn question → you bought a bankrupt university to MANUFACTURE
  a Steve Jobs, or at least not breed more coin sharks) + a one-line how-to-play + the satire
  disclaimer. Gated on META.tutorial (shown once, persisted). Uses the existing CONTENT.boot.

## 2026-06-13 — Alumni trajectories (loop iter 21): watch lives unfold
- Each cựu sinh viên now records a STATE HISTORY as the FSM moves them year by year, shown in
  the Sổ as a trajectory of chips (e.g. 🚀 → 🪙 → 🚔, or 💼 → 👷). The owner's core instinct —
  outcomes that evolve over years ("scammer 2 years after graduate") — made visible.
- Engine: setAlumState() helper tracks history at every transition; sanitize defaults it for
  old saves. GATE_ALUM caught a determinism bug (seeded vs sanitized history) — fixed; replay green.

## 2026-06-13 — Phốt risk indicator (loop iter 20)
- A qualitative HUD chip surfaces accumulating scandal danger — ⚠️ Có/Nhiều mầm phốt → 🔥 Phốt
  sắp bung — so the gamble is legible (pairs with the scandal-mood music + the now-firing
  cá-mập→arrest arc). Tiers, not an exact count, to preserve the mystery. Gates green.

## 2026-06-13 — Character customization (loop iter 19, owner-hinted)
- Tap a student → their inspect card now shows the ACTUAL pixel sprite (live canvas avatar) and
  lets you RENAME them (inline field) and CHANGE THEIR LOOK (🔄 cycles the 12 baked variants —
  skin/hair/accessory). Persisted on the student (s.look + ten); invalid look falls back to the
  id-hash, so saves stay safe. Makes the people personal — your students. Gates green.

## 2026-06-13 — Balance: money sink — sweep now fully clean (loop iter 18)
- Late-game cash inflated to ~2,800tr (no sink). Added a reserve-protecting sink: surplus
  ABOVE 300tr is reinvested into operations at 3%/mo (normal saving untouched, hoarding capped)
  → end cash ~1,012tr, Y1 net still +12.3 (in band). Shown as a funding-panel line.
- Sharpened the sweep flags (meter-health checks the HONEST cân-bằng school, not the
  intentionally cram-leaning default; 🍎 excluded from dead-state check since it is rare by design).
- **Sweep now reports ALL CLEAR**: economy in band, plural outcomes, 🍎 reachable, thesis holds.
  Confirmed contrast — honest school keeps TT 13/UT 9/TC 63; cram default TT 8/UT 3 (consequence).

## 2026-06-13 — Balance: the cá-mập-coin ending now fires (loop iter 17, sweep-driven)
- The game is *about* not mass-producing coin sharks, but the cá-mập-coin ending literally
  never fired (0%). Root cause: the vet/cram drag (VET_MULT) was halving the cá-mập stat too,
  so crammers could never build the hustle to qualify. Decoupled cm growth from the vet drag
  (gaming-the-system IS a cram skill) + nudged the cascade gate (cm≥52∧tn≤45∧vet≥50).
- Now cá-mập fires ~2% and the full dark arc works (sharks get arrested → BI_BAT appears).
  Sweep-verified; economy still in band; gates green. Remaining (ROADMAP): money sink + a
  deeper meter-recovery pass for the cram-leaning default.

## 2026-06-13 — Balance: Tiếng Tăm floor (loop iter 16, sweep-driven)
- The sweep found TT bled to ~1 over a run → admissions pool shrank → the campus slowly
  emptied (a liveliness bug, not just balance). Gave TT a FLOOR = 10 + 0.25×Uy-Tín: it still
  decays −1/mo, but only down to a baseline a working/reputable school keeps. Now stabilizes
  ~12; admissions stay healthy, the school stays full & lively. Hype-vs-uy-tín tension intact
  (TT still erodes; honest reputation lifts the floor). Sweep confirms: collapse flag gone,
  Y1 net still +12.3 (in band), pluralism/thesis unchanged. Gates green.

## 2026-06-13 — Gameplay simulator: sweep.js (owner directive)
- `node sweep.js` drives the DOM-free engine through 40 seeds × 5 strategies × 11 years and
  reports economy band, alumni-destiny distribution per strategy, 🍎-rate, and DESIGN-§1
  pluralism/dominance flags — so balance work is data-driven, not guessed.
- First findings (→ ROADMAP "Gameplay balance"): thesis HOLDS (craft → 🍎 in 43% of runs),
  economy in band; but Tiếng Tăm collapses to ~1, cash inflates to ~2788tr (no sink), and
  cá-mập-coin ≈ 0% (dark mirror barely fires). Added to skill as the standing balance tool.

## 2026-06-13 — Liveliness pass (loop iter 8): emotes + a campus cat
Chasing the north-star ("sunny, slightly chaotic little school you love watching").
- **Emote bubbles:** students occasionally pop a little pixel reaction above their head
  (♪ ❗ ♥ 💡 … 💧 ✨ ?), context-aware (music when performing, hearts at lunch, ideas while
  tinkering) — personality everywhere, the campus reacts.
- **Campus cat:** a wandering pixel cat roams the grounds — pure watch-it charm.
- Both cheap (live-layer flat ops); gates green.

## 2026-06-13 — Character variety (loop iter 7): students as individuals
- Expanded the sprite atlas from 3 hair colours to 12 baked VARIANTS per year — 3 skin tones,
  6 hair colours × 3 styles (short/long/bun), and accessories (glasses/bow/cap, weighted to
  none). Each student picks a stable variant by id-hash, so the 42-strong crowd reads as
  individuals instead of clones. Still pre-baked → blitted (60fps). Gates green.

## 2026-06-13 — Pixel-art props pass (loop iter 5): fill the campus
- Redrew ambient props as pixel-art to match the new style: chunky pixel TREES (replacing the
  old smooth circles that clashed), pixel LAMP posts with lit lanterns, a pixel flagpole.
- Added cute detail to fill the world: scattered FLOWER clusters (multi-colour) + low BUSHES,
  seeded so they never flicker. Removed the now-invisible eggshell marginalia. Gates green.

## 2026-06-13 — GRAPHICS OVERHAUL v2: detailed pixel-art (owner: "graphic still ugly")
Full visual pivot after the owner rejected the dark Sơn Mài Diorama. Owner chose detailed
pixel-art and flagged all four issues (tiny/plain characters, flat buildings, too dark,
unpolished). (The art-direction workflow died on socket errors; hand-built from the mandate.)
- **Characters:** a pre-baked sprite ATLAS — bigger ~16×22 chibis with real FACES (eyes,
  cheeks, mouth), hair variants, year-coloured uniforms, 2-frame walk, 1px outline. Baked once
  at boot (4 years × 3 hair × 2 frames) → blitted with drawImage, so 48 actors stay 60fps.
- **Buildings:** bright pixel-art — cream schoolhouses with red gabled roofs + shingles, the
  Căng Tin's striped awning, Lab's glossy roof, Phòng Máy's vented roof + cold windows, Xưởng's
  sawtooth, all with framed pixel windows, wooden doors, 1px outlines. Six instantly distinct.
- **Palette:** killed the near-black lacquer — bright sunny daytime grass with pixel texture,
  warm dirt paths, a light (not dark) vignette. Characters now POP instead of vanishing.
- **Crisp:** imageSmoothingEnabled=false + integer pixel discipline (flat fills, no gradients/
  arcs on sprites). Activity overlays (eat/study/zzz/sparks) repositioned for the bigger sprite.
- Gates green; verified home + all 6 building types + a settled lunch period at 390px.
- Skill updated: graphics is the standing #1 lever; use the `frontend-design` plugin for UI work.

## 2026-06-13 — Background music v1 (loop iter 3): state-aware campus-lofi
Owner directive ("background music… sound… a bit chill/relax"). Replaced the bare pentatonic
stub with a calm generative 3-layer bed — all procedural WebAudio, no asset files, defensive.
- **Layers:** a slow pad (triangle chord, long attack), a gentle pentatonic pluck melody, and
  a soft sub-bass pulse — connected through a master gain.
- **State-aware mood** (read live each note): `normal` warm major pentatonic · `tet` brighter +
  busier (Tháng 2) · `june` slower swell during a Lễ Tốt Nghiệp · `scandal` minor undertone
  when phốt seeds pile up / Tiếng Tăm collapses. Mood adapts within a cycle, no hard transition.
- **🎵 toggle** persisted in META.sound; **autoplay-unlock** on first tap (browsers block audio
  until a gesture). Verified: cycling all four moods headlessly throws no error; gates green.
- (Refactor swap recorded: the planned S1.5 art.js extraction was deferred — a ~350-line
  single-file split is mechanically risky to do *autonomously* with the owner away to catch a
  subtle visual regression; it'll be done in smaller chunked moves. BGM was the safer,
  explicitly-requested, owner-audible pick.)

## 2026-06-13 — The Player's Answer epilogue (loop iter 2): "Bản nháp bài luận của hiệu trưởng"
The open-question law (DESIGN §1) made playable. A 📜 button in the Trường tab opens a
draft-essay modal that holds up a MIRROR and never a verdict. Designed via a 3-lens
(ledger / draft-letter / question-echo) → synthesis workflow.
- Re-asks the real 2026 đề verbatim, then the founder CROSSES OUT every sentence that smells
  like a conclusion (struck `<s>` false-start; cross-out cut mid-word at "Tôi—").
- Points at the player's OWN graduates by name + chip + their own line; the 🍎 column is
  shown empty-or-full in the same neutral register (no path is ranked above another).
- Lays the three ledgers (bank / quỹ hiến tặng / the name-list itself) bare and refuses to
  weigh them — "Quyển nào to hơn thì… để Bộ duyệt."
- Bác Tâm gets one quiet physical line (never a moral); the đề returns identical as the LAST
  readable thing; close button is "Gấp bản nháp lại," never "done."
- 8 branch voices (steve/coin/vanmau/kysu/thuc/hype/that/kind) + empty-book guard, chosen
  from META/alumni-majority/meters. Pure view layer, derived on open, stores nothing.
  Templates in CONTENT.essay, thresholds in CONFIG.ESSAY, assembler in ui.js essayDraft().
- Verified at 390px across post-June (no-Steve), seeded-Steve, and empty-book states; gates green.

## 2026-06-13 — Campus life v1 (loop iteration 1): students keep a schedule
Designed via a 4-lens → synthesis workflow. Pure view layer (no sim/state change).
- **Day clock:** 5 real-time periods × 16s — class · recess · lunch · afternoon · tan học —
  animating even at speed 0 (chill ambiance), freezing only for modals.
- **Routing:** students walk to the right room's door-ring each period and DO the activity:
  sit-and-study at Phòng học (sky-kid daydreams a rising dot), eat a steaming bowl at Căng
  Tin, tinker with gold sparks at Xưởng (Năm-4 đồ-án-mode Tháng 2–5; spark-kids spark double),
  gather on the Sân with one shared bouncing ball (hype-kids perform, arms up), zzz when idle.
  Door-rings precomputed on map-dirty (cap 8/room, aggregated across instances); graceful
  wander-fallback when a room isn't built yet — so unbuilt rooms just mean fewer activities.
- **Perf:** base sprite unchanged; one duty-gated flat-op overlay per parked actor; the ball
  drawn once/frame after the actor loop. No per-frame strings/gradients/save-restore.
- Verified each period at 390px (class/recess/lunch all cluster + animate correctly).
  `window.__ui.setPeriod/_settle` test hooks added for deterministic period screenshots.

## 2026-06-13 — Campus art overhaul: Sơn Mài Diorama
Owner directive: "the graphic needs to be more detailed and more style." Replaced the flat
rectangles with a full art direction (synthesized via a 6-direction explore → 3-judge →
fuse workflow).
- **Ground:** near-black lacquer gradient dusted with ~320 deterministic vỏ-trứng eggshell
  flecks + a raised warm boardwalk path spine + a center vignette that melts edges into the
  dark-gold chrome. Figure-ground flipped so full-chroma students finally POP.
- **Buildings:** six visually distinct fake-iso pavilions — double drop shadow, front-wall
  extrusion, **gold-leaf frame** (the 26px separation win), lamplit windows. Each room type
  carries three redundant cues: unique roof (gabled / open-field / awning / glossy / flat+vents
  / sawtooth) + unique hue + warm-vs-cold window + a gable sigil. Sân is a real football pitch.
- **Students:** richer chibi — breathing contact shadow, 2-frame scissor legs, full-chroma
  body, per-year class marker (collar/sash/belt/grad-stole), hashed hair, gold collar tick,
  honor diamond (killed the per-frame ✦ fillText). ~8 flat ops/sprite → 48 hold 60fps.
- **Props:** seeded + capped, off walk lanes — lamp posts (gold glow), flagpole, trees,
  marginalia sigils (bulb/apple/∑ — the dry-satire counterweight to the reverent lacquer).
- One top-left light direction across everything; font-gated first paint. Gates green.

## 2026-06-13 — Tap-the-world inspect + /mvp/ retired
- **Interaction (owner decision):** the campus is now tappable. Tapping a student opens a
  non-pausing inspect card (stats, tell, hạt-giống potential, scholarship); tapping a room
  shows its description + how many students are nearby. Tabs stay for management — "tabs +
  tap-the-world." Antidote to the "everything's a button" feel. `window.__ui` test hook added.
- **/mvp/ retired (owner decision):** the parallel single-file build (older 3-grade spec)
  removed; the root multi-file v2 build is canonical. Salvaged ideas (phốt risk meter,
  export-save) parked in ROADMAP. Orphaned jsdom package.json removed.
- **Design:** DESIGN §1 "open-question law" — the game holds the đề philosophical; no
  dominant strategy, reflect-don't-impose, epilogue mirrors the player's own school back.
- **Skill:** added the ~10th-iteration code-structure review (owner directive).

## 2026-06-13 — S1 MVP (first playable)
Multi-file build flips the live link from placeholder to a playable university sim.

**Architecture (layer law from day one):**
- `js/data.js` — all CONFIG tunables + all CONTENT text. Zero logic, zero DOM.
- `js/engine.js` — state, deterministic sim, June ceremony, admissions, alumni FSM, funding.
  DOM-free and node-testable. Three RNG streams (sim/admissions/alumni) per DESIGN.
- `js/ui.js` — Kairosoft canvas (static campus + live walking sprites), HUD, panels, modals,
  minimal generative campus-lofi. Reads state only; owns no game numbers.
- `index.html` — shell + two stacked canvases + dark-glass/gold theme, Be Vietnam Pro.

**Systems live:**
- Calendar clock (10 ticks/day, pause/1×/2×/3×, 3× unlocks after first Lễ Tốt Nghiệp).
- 42-SV four-cohort boot (Mai Sương + Trần Phi Lợi scripted), per-cohort teaching presets,
  tuition, build placement (căng tin/lab/phòng máy/xưởng), teacher hiring.
- June two-stage ceremony: policy (Đồ Án Mẫu vs Bảo Vệ Thật) → 8-row graduation cascade
  with hidden tiềm-năng flag, entry-state line, near-miss line, viral-defense pierce.
- Admissions: deterministic pool, điểm-chuẩn histogram + cutoff/quota dials + forecast,
  cutoff stunts, BXH rank, auto-resolve when away.
- Alumni FSM (8 states) on isolated seed0 stream — byte-identical replay; gifts to quỹ;
  Trần Phi Lợi scripted arrest year 2; the 🍎 emerges years later, never at graduation.
- Funding: tuition/salary/maintenance economy, endowment ×1.004/month, pantheon
  scholarships (3) with growth-pipeline effects, scripted Trứng Vàng contract offer.
- Three meters (Tiếng Tăm decays, Uy Tín capped ±/yr with two pierce events, Thực Chất);
  light event deck; news ticker; autosave + v1→v2 migrator + Number.isFinite sanitize.

**Verification:** 5 node gates GREEN (FRESH/ADMIT/ALUM/COMPAT/BUILD via `./gate.sh`);
headless boot clean (no JSERR); 390px screenshots of home + June ceremony reviewed.

**Design:** added DESIGN §1 "open-question law" (owner directive) — the game holds the đề
philosophical and lets each player reach their own answer; no dominant strategy, reflect
not impose, epilogue mirrors the player's own school back. Queued: campus-life v1, the
"bản nháp bài luận của hiệu trưởng" epilogue.
