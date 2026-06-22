# Roadmap — Học viện Steve improvement loop

Where the project IS and what's NEXT. The loop takes from the top. Add freely, prune ruthlessly.
Full history lives in **CHANGELOG.md** — this file is the current frontier only.
Loop flag: `touch /Users/Admin/Desktop/coding/.improve-steve-on` · kill: `rm` same file.

---

## Standing directives (the laws the loop must follow)

- **🎮 GAMEPLAY-FIRST PHASE ACTIVE (owner steer 2026-06-21).** Graphics are FROZEN — develop gameplay /
  person-sim / STORY/LEVELS to state-of-the-art, then do graphics as ONE pass at the end. Driven by the
  `improve-steve-gameplay` skill (`touch .improve-steve-gameplay-on`). **Verification is HEADLESS-ONLY**
  (`./gate.sh` · `node sweep.js` · `./bot.sh` · `./lives.sh` · `./lab.sh`) — NO screenshots / 390px / gallery.
  **DECOUPLING:** build the mechanic/era/beat even if today's sprites can't show it (ship text/placeholder; the
  graphics pass backfills visuals). Graphics/character-identity epics (E11 render, E12–E14) are DEFERRED to that
  pass. Handoff written: `GRAPHICS-HANDOFF.md` (15 player-facing surfaces + the laws the art pass must not break).

- **THESIS is FROZEN.** Any change that asserts *what makes/breaks a 🍎* (the apex) is thesis-adjacent: surface it
  as an `OWNER:` proposal, never apply unilaterally. Owner forks are routed as adopt-or-override, not edits.

- **DEPLOY POLICY: EVERY ITERATION** (owner 2026-06-15, "I develop on my phone"). Any iteration that changes
  browser-facing code (`js/*.js`, `index.html`, assets) MUST end with:
  `./bump.sh && git add -A && git commit && git checkout main && git merge --ff-only mentors-ledger && git push origin main && git checkout mentors-ledger`,
  then verify the live `?v=` string. Dev-tool-only changes (gate/sweep/bot/docs) needn't deploy — note it.
  `main` stays a strict fast-forward of `mentors-ledger`. Develop on `mentors-ledger`.

- **EXIT-GATE (iter-221): measurable criteria (a)(b)(c) MET; only (d) — explicit owner "ready to be dressed" —
  remains, and it is OWNER-GATED.** The loop may NOT self-release to graphics. Absent the owner's go, continue
  conservative deepening (genuine value over volume; no manufactured refinements).

### Engineering invariants (every change)
- **Determinism from id, NO migrator.** New per-kid state derives from id (e.g. `hashStr`); save additions are
  sanitize-defaulted, never reroll. PLAYER-INPUT state (e.g. activities) is the exception — it MUST be
  saved + sanitized/migrated (handle like the iter-202 save-loss fix).
- **No-dominant-strategy / open-question law.** No era/archetype/origin/adaptive strategy may top both apex+cash;
  every axis must both REALIZE and WASTE. Each new lever ships its **symmetry + non-dominance sweep sensor BEFORE
  the lever**, and the sweep STRATS + adaptive bot must be upgraded to *search the new knobs* or the guarantee goes blind.
- **Texture, not gradient.** Fit caps are DISCRETE texture tables, never a smooth distance→severity gradient.
- **Teeth at the CEILING/cap + MOOD layers** — the saturation wall washes out rate nudges for the gifted.
- **Outputs stay PROSE, never a fit-% / fungible budget / potential bar** (§C-3). No 48-kid dashboard.
- **Waste is done TO the kid by the structure (invariant #4), never blamed on the kid; symmetry of waste
  (invariant #2) — every lever ships a wasted life in the epilogue.** Visibility ≠ accessibility; cohesion at OUTPUT not INPUT.
- **Byte-identical verification:** `baseline.js` + `baseline.snapshot.json` (Phase-0, iter-243) run a fixed
  3-preset × 4-seed matrix to graduation and assert the alumni histogram matches EXACTLY (wired into `gate.sh` as
  BASELINE GREEN). A deliberate change recaptures via `--capture`. Determinism-breaking changes re-baseline GATE_ALUM.
- **Verification per phase:** parse → `./gate.sh` GREEN (+ BASELINE) → `node sweep.js` 0 bad flags incl. the new
  sensor → `./bot.sh` BOTOK → `./lives.sh` across ≥2 presets/archetypes → surface the lever in the Gameplay Lab.

- **Evolution engine (DORMANT behind the gameplay-first phase).** The frame-reset critic must be SENSORS-ONLY —
  never grant write/exec/network (iter-172 incident: an exec-capable critic pushed a crash to prod). If run, launch
  ASYNC/background (`CRITIC_TIMEOUT=1800 ./evolve.sh &`), never foreground-block. See `docs/EVOLUTION-ENGINE.md`.

---

## ▶ ACTIVE EPIC — EDUCATION MODEL REFINEMENT (owner steer 2026-06-22)

**Why:** the owner judged the 3 triết lý an OVERSIMPLIFICATION and asked to refine the model deeply "before a total
remake." A 26-agent model-review (verdict + forks now folded into MODEL.md) decided: **refine the EDUCATION term IN PLACE, do not
rebuild** (~90% of the engine is the law-bearing spine). EDUCATION expands from one slider to a composed sub-product:
`MATCH(tell,mode) × STRUCT_FIT(tell,structure) × MAJOR_FIT(tell,major) × ACTIVITY(…attention-hours) × MENTORSHIP ×
FACULTY_GRAIN`. The capstone, alumni FSM, era/origin/archetype lattice, mentorship equalizer, and
determinism-from-id discipline are KEPT verbatim.

**Owner forks (adopted recs, overridable; rationale folded into MODEL.md):**
#1 everyman gets a real Đại-cương major, era-neutral + BOUNDED structure peak (needs a numeric bound + a sensor that
all-"" can't win 🍎+cash) · #2 capstone weaves the new levers IMPLICITLY (faces, not policy; still "Tôi—") ·
#3 era-on-tracks via existing `eraFav` · #4 capstone stays authored-first.

### 🍎 APEX FORK RESOLVED (iter-264, owner): **"KEEP 🍎 AS-IS" → plateau lifted.**
The apex stays grain×era×luck (THESIS frozen, **NO apex teeth**). Remaining systems built **BOUNDED NON-APEX.**
Greenlit keystone = **Phase 2c off-native intake** (MAJOR_FIT bites live). Phase-3 activities stay SHELVED
(non-apex versions proven inert, iters 251-252).

### Phase status
- **Phase 0 ✅ (iter-243)** — gate BASELINE-CHECK (`baseline.js` + snapshot, wired into `gate.sh`).
- **Phase 1 — STRUCTURE axis (spark≠sky fix) ✅ DEPLOYED.** 1a (iter-244, the `STRUCT_FIT` mechanic, teeth at MOOD,
  byte-identical) + 1b (iter-245, the 2-axis dial: 3 MODE buttons × a per-grade Mở/Vừa/Khuôn STRUCTURE control,
  default Vừa/mid → byte-identical; it bites: coders 12/28→24/28 Mở→Khuôn).
  - **Phase 1c (deferred, optional texture):** tell-keyed DISTORTION map — generalize `MATCH_CM` into a (tell,mode)
    map (spark→credential-grinder, sky→văn-mẫu, hype→coin-shark). Moves the distortion spread → recapture baseline.
    Lower priority than the majors mechanic.
- **Phase 2 — MAJORS decoupled (2a+2b ✅; 2c = off-native intake, the active frontier).**
  - 2-groundwork ✅ (iter-246): the EVERYMAN (~54% `tell=""`) gets their own gift-vs-fate read (`realGapTell.*.gen`).
  - 2a ✅ (iter-247): the `MAJOR_FIT(tell,key)` mechanic (2nd fit axis = the TRACK, routed through MOOD); diagonal=1.0
    → byte-identical; `MAJOR_OVERRIDE` + sweep sensor prove the teeth.
  - 2b ✅ DEPLOYED (iter-248): the EVERYMAN's HOME (Khoa Đại cương, `stat: tn` → steady 🔧 kỹ-thuật-viên).
    Owner-fork #1 firewall HOLDS (EVERYMAN sensor: `""` realized 37% but apex 7.7% < best grain 17.5% — a home, not a 🍎 path).
  - **▶ Phase 2c — off-native major intake (the keystone; architecture-heavy, determinism-sensitive).** Lets a grain
    be placed in a NON-native track so "right gift, wrong major" happens in play and MAJOR_FIT bites live (a coder
    shoved into biz wilts). Checkpoints:
    - CP1 ✅ (iter-265): `studentMajor` reads a STORED `s.major` (room-gated) before native derivation; `S.intakePolicy`
      state ("native" default) + freshState + sanitize guards. Byte-identical (nothing sets `s.major` yet).
    - CP2a ✅ (iter-266): `assignMajors()` deterministic resolver (monthly, stable id-order, no rng) + `CONFIG.MAJOR_CAP`
      (specialist seats; Đại-cương uncapped). Native-first; overflow → Đại-cương / best-fit specialty. cap=99 → byte-identical.
    - CP2b ✅ DESIGN RESOLVED (iter-267, investigative): a biting flat cap under the DEFAULT policy degrades the
      baseline with NO agency → rejected as a default nerf. (Off-native is opt-in, not a forced cap.)
    - CP2c ✅ (iter-268, off-native intake LIVE): opt-in design, no quota mech. "native" default → idle if khoa unbuilt
      (byte-identical); "open" → `placeOffNative` crams the grain into a built specialty / Đại-cương (MAJOR_FIT bites).
      Lever = build + policy. Sweep INTAKE sensor ✓ bounded (Δ8.1, neither dominates).
    - CP3a ✅ (iter-269): the intake-rule DIAL in panelOps ("Tuyển sinh — xếp khoa": Đúng khoa ↔ Mở cửa, `CONFIG.INTAKE_META`
      tradeoffs) — reachable by players. UI-only → byte-identical.
    - **CP3b (NEXT):** surface `intakePolicy` in the Gameplay Lab (a selector, dynamic-Lab mandate) + the wrong-major
      WILT narrative beat (name a named grain nguội-ing off-native, in-play and/or at the payoff).
    - **CP4 (optional):** tie khoa capacity to room UPGRADE level (seat-scarcity as a build-investment lever) — only
      if it adds agency without a default nerf.
    - **Determinism note for later CPs:** removing the scripted seed-5 prodigy → admissions-share tilt is
      determinism-breaking — re-baseline GATE_ALUM + rewrite the WASTED-PRODIGY sensor IN THE SAME COMMIT; rewrite
      sweep STRATS + adaptive bot off the hardcoded preset keys. Keep the apex mechanism UNTOUCHED (apex = as-is).

- **Phase 3 — ACTIVITIES + ATTENTION-HOURS (SHELVED; droppable).** The only genuinely new subsystem
  (`S.term` + `S.activities` + a shared attention-hours pool — the tragic allocation the game lacks). Non-apex
  versions proven inert (iters 251-252). Activities are PLAYER INPUT → must be saved/sanitized/migrated. If the
  pool proves dominance-prone, Phases 1–2 already answer most of the critique. Stays shelved per the apex resolution.

**Non-gated surface MINED OUT — confirmed plateau (3 adversarial scouts: iter-254 / 259 / 262).** Scout-found
reading-only beats all delivered (equalizer/era-journey/mentor-full grief, lattice-wired cram dilemma, era-flood /
era-shock / archetype-framed capstone beats — iters 254-261). The third scout returned 0 survivors / 18 rejected.
Re-scout ONLY on a real change (owner steer / new system / long gap).

---

## Lattice & narrative — COMPLETE (the spine the gameplay-first phase built)

These are DONE and load-bearing; deepen only if a checkpoint above needs them. Detail in CHANGELOG.

- **L1 ERAS** ✅ — the authored decade spine (1990s→AI boom); each era re-weights which gift the WORLD realizes/wastes
  via the alumni FSM (a gift's CEILING swings by decade, apex 5%→17%), + era MOBILITY, era-flavored cohorts, and the
  "right kid, wrong era" grief NAMED at the payoff. Deterministic (`eraIndex(S.year)`, no save change).
- **L2 DEMOGRAPHIC + GEOGRAPHIC** ✅ — per-kid family ORIGIN (poor/mid/khá, id-derived) drags the poor's growth →
  under-realize, ERASED by mentoring (the school as EQUALIZER); 4 ARCHETYPES (`CONFIG.ARCHETYPES`: tinh_le / que_ngheo /
  lo_thanhpho / truong_nghe) each pre-load economy + culture + cohort origin-mix. Sweep sensors prove no axis dominates.
- **L3 LEGACY** ✅ — a run's standout graduate writes to a separate `LEGACY_KEY` at the decade; a NEW run is seeded by
  it (a bright legacy returns as a named founding teacher + funds the quỹ; a dark one echoes −TT). Progression-UI rungs
  (unlocks / scored ending ladder) DEFERRED to the graphics pass.
- **L4 TECHNOLOGY** — ckpt1 ✅ (iter-239): each tech wave COMPOUNDS the teacher's REACH (`mentorSlots()` scales by era,
  3→4 smartphone→5 AI; deterministic). **The apex fork (does tech lower/raise/leave the apex) stays OWNER-GATED.**
- **PEERS / CONTAGION** ✅ — the cohort's atmosphere pulls each kid's mood toward the school mean (`CONFIG.PEER`), named
  in-play (`cohortBeat` warm-lift / cold-drag) — the player's teaching culture drives it. ckpt3 (peer-shaped epilogue,
  needs a serialized `peerAcc`) deferred.
- **NARRATIVE / WRITING** ✅ — keynote variation, individuated cast lines, the ANNUAL LETTER beat conditioned on
  policy×cohort×era, and the CAPSTONE essay that re-reads the persisted letters (arc: start → turning-point → end,
  never answering the open question). N3-ckpt3 (weave a named kid into a letter's year) and N4 (unlockable
  paths/events) are future, authored-first. Narrative surfaces swept clean (iters 222-229); the writing is FINAL.
- **MENTOR'S LEDGER / person-sim (E1–E9)** ✅ — the soul loop: grain↔mode MATCH multiplier, epilogue names the
  realize/waste/distort, follow-ONE protégé + mentor nudge, realization-aware destiny + carried gap, discoverable
  talent (fogged till grade-3/mentored), the overlooked-gem "đặc cách" admit + its cost, reputation-shaped faculty
  with grain-flavored teaching, cohesion-at-output. (E6 multi-axis aptitude · E10 early-game weight remain owner-gated.)

---

## Backlog (genuine remaining work)

- **OWNER-GATED epics** (loop may not build unilaterally): E6 multi-axis aptitude (a CASCADE re-tune, the biggest
  balance risk) · E7 more MAJORS via E6 or a major-assignment redesign · E10 early-game weight (restructure, taste) ·
  the L4 apex fork (i lower / ii raise-for-some / iii leave) · the N3 capstone AUTHORED-ASSEMBLY-vs-RUNTIME-LLM fork ·
  "what is a Steve" (THESIS-adjacent — surface as a proposal, never pin).
- **STRUCTURE debt** (`EPICS_SINCE_STRUCTURE` ≥2 ⇒ next epic must be structure; in practice pay when a file strains):
  - `content.js` (~658) is the next carve candidate (split the alumni/epilogue prose) when it next becomes painful.
  - `ui.js` (~1791) — the high-coupling shared-UI-context refactor (panels/render, ~229 closure-helper uses); not yet
    painful, the features it'd enable are owner-gated. Verifiable-first leaf = the epilogue/essay cluster via `lives.sh`.
  - *Paid down so far:* person.js (127) · admissions.js (163) · epilogue.js (149/183) · save.js (199) · alumni.js (212).
- **Dev tooling:** `tune.js` (iter-207) — balance grid-search (`node tune.js <knob> <grid> <metric>`); add a metric per
  new mechanic, use for every balance pass. `baseline.js` guards rate regressions.
- **Deferred to the GRAPHICS pass:** E11 walk-in roofless rooms (activity→growth render) · E12 inspect-portrait ↔
  Jephed sprite reconciliation · E13 gender-matched names · E14 procedural character variety · HUD era indicator /
  era-transition modal · progression-UI rungs. Load-bearing decisions for these live in `GRAPHICS-HANDOFF.md` + VISION.md.

---

## Cadence counters (Step 0 reads these; update every ship)
- `SHIPS_SINCE_PERSONSIM: 0` — ≥1 ⇒ HARD-LOCK to a person-sim pick (PEOPLE-FIRST ARC). Reset 0 on a person-sim ship.
- `SMALL_SHIPS_SINCE_EPIC: 0` — ≥3 ⇒ EPIC owed; the next firing HARD-LOCKS to the EPIC track.
- `EPICS_SINCE_STRUCTURE: 0` — ≥2 ⇒ next epic must be STRUCTURE.
- `FIRINGS_SINCE_FRAME_RESET: 0` — ≥12 ⇒ frame-reset beat (DORMANT behind the gameplay-first phase).
- `LAST_EPIC:` iter-269 Phase 2c CP3a (intake-rule dial). `LAST_STRUCTURE:` iter-212 alumni.js carve.

> _History migrated to CHANGELOG.md. The art/polish pass, the living-economy & economy-scaling owner epics, the
> Mentor's Ledger soul-loop, the LATTICE build-out, and all iter-by-iter SHIPPED detail live there._
