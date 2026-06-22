# MODEL.md — the factor model behind "how to grow a Steve Jobs Vietnam"

*Owner steer 2026-06-21: the game is an attempt to ANSWER the real đề-Văn question THROUGH development.
That means modeling the real-world FACTORS that decide whether a gift is realized or wasted, and HOW THEY
INFLUENCE EACH OTHER — realistic enough to mean something, game-y enough to stay legible and FUN to
experiment with. This is the living map the loop builds against. Update it whenever a mechanic is added,
changed, or removed. It does NOT replace THESIS.md (the frozen charter) or VISION.md (the dream) — it is the
**engineering model** between them: the bridge from real-world plausibility to a fun, sweep-gated mechanic.*

## The three forces every factor must satisfy at once
1. **REALISM** — it reflects something true about how talent meets a system in the real world.
2. **GAME-SENSE** — it surfaces as legible, caused prose/choice (never a spreadsheet), one more knob the
   player can feel and reason about.
3. **FUN / PLURALISM** — trying different things produces genuinely different stories; no single setting
   strictly wins (the open-question law). If a factor breaks any of the three, retune or cut it.

## The core equation (what produces a LIFE)
> **a LIFE = TALENT (magnitude × direction) × EDUCATION (your policy) × WORLD (era × place) × CIRCUMSTANCE
> (origin) × LUCK — read as realized / wasted / distorted, RELATIVE to that person's own gift.**

EDUCATION — the player's lever — **EXPANDED from one slider into a small composed sub-product** (the
2026-06-22 model refinement; phased build status in ROADMAP `## Epic: EDUCATION MODEL REFINEMENT`):
> **EDUCATION = MATCH(tell, mode) × STRUCT_FIT(tell, structure) × MAJOR_FIT(tell, major) ×
> ACTIVITY(matched-realize / mismatched-waste, GATED by attention-hours) × MENTORSHIP × FACULTY_GRAIN.**

No term dominates; each *re-weights whose* life is realized vs wasted (invariant #1), never *which policy is
correct*. The player's lever is EDUCATION + attention; the rest is the world they're dropped into. The
refinement keeps that law — it gives the lever more *texture* and more *felt decisions*, never a dominant
setting (every new table ships its symmetry + non-dominance sweep sensor BEFORE the lever).

*Refinement provenance (from the delivered model-review, now folded in — the doc itself is retired): the
verdict was **REFINE in place, never rebuild** — ~90% of the engine is the law-bearing spine (multiplier-product
growth core, cascade + prose engine, alumni FSM, era/origin/archetype lattice, mentorship equalizer,
id-determinism, capstone frame); the oversimplification lives in **one term, EDUCATION**, a single per-grade
slider. The fix is three composing additions, each a real player verb, each sweep-gated, built in phases: (1)
the **TEACHING DIAL** — keep the 3 triết lý as named one-tap corners but add an orthogonal STRUCTURE axis, so
fit = MATCH(tell,mode)×STRUCT_FIT(tell,structure) as two small discrete tables (this is what finally splits
spark≠sky; teeth land at the ceiling/cap, not just rates, via a DISCRETE cap-multiplier — a smooth distance→cap
function would be the forbidden "gradient"); (2) **decouple MAJOR from tell** — ~6 authored major-environments
at one horizontal tier each with a fitVector, MAJOR_FIT as a 2nd ceiling term (the "right gift, wrong major"
fate, impossible when major=tell), assignment SYSTEMIC (build rooms + intake rule + capacity, id-derived sort,
the protégé re-track the one per-kid override), the everyman ("") finally gets a real home (Đại-cương); (3)
**ACTIVITIES become mechanical** (CLB / đội-tuyển / thực-tập, each carries its own waste) sharing one finite
**ATTENTION-HOURS** pool with the mentor slots — the tragic allocation (deep programs for all vs rescuing one
named kid), DISCRETE picks never a fungible slider (§C-3). Owner forks resolved: everyman gets a real major but
**era-neutral with a BOUNDED structure peak** (the structural firewall against "match everyone to their grain");
capstone weaves the answer in IMPLICITLY through the lives shaped (faces, not policy); ERA re-weights a major's
apex via the existing `eraFav`-on-tell (no new FSM weights); capstone stays **authored-first**, LLM revisited
only after the model freezes. The apex-fork (what tech does to the 🍎 ceiling) was resolved by the owner: keep
🍎 as-is. Phase-0 guard: the gate must snapshot a realization/destiny histogram, not just determinism, or a
mis-tuned table silently regresses every kid and stays green.*

## The factors (LIVE = shipped · QUEUED = planned) — real-world basis · mechanic · key interactions
| Factor | State | Real-world basis | Current mechanic | Interacts with |
|---|---|---|---|---|
| **Talent magnitude** | LIVE | innate ceiling — how far one *could* go | `seed` 1–5 (SEED_MULT) | everything (it's the ceiling realization is measured against) |
| **Talent direction** | LIVE | a grain — maker / coder / hustler | `tell` sky/spark/hype | education-match, era, faculty-grain, the gift-specific prose |
| **Education — MODE** | LIVE (refining) | cram vs craft vs hustle pedagogy | `presets` luyện-đề / đồ-án / cân-bằng (MATCH × tell). **Refinement: becomes Axis A of a 2-axis TEACHING DIAL** (the 3 triết lý kept as named corners). | talent-direction (match/mismatch → realize/waste), mood, **structure (composes)** |
| **Education — STRUCTURE** | DECIDED → building (Phase 1) | how the day is governed (drill ↔ autonomy) — the orthogonal pedagogy axis real education varies but the 3 presets flatten | Axis B of the dial: `STRUCT_FIT(tell, structure)` low/mid/high, composed into mm AND a **discrete** MISMATCH_CEIL cap-multiplier (teeth at the ceiling, past the saturation wall). **Splits spark≠sky** (today identical): spark peaks mid, sky low, "" high. | talent-direction (the spark≠sky splitter), mode (composes), the cap layer |
| **Education — MAJOR** | DECIDED → building (Phase 2) | a gift can flower down several *chosen* tracks; "wrong major for this kid" is a real fate | **Decouple from tell**: ~6 authored major-environments with a `fitVector`; `MAJOR_FIT(tell,major)` = a 2nd ceiling term; systemic best-fit intake (fit-vs-open + quota), protégé re-track. Gives the >50% everyman ("") a real home (Đại-cương). | talent-direction (same-gift-different-life), faculty-grain (per-major teeth), era (right-track-wrong-era), origin×mentorship (afford the track) |
| **Education — ACTIVITIES** | DECIDED → building (Phase 3) | clubs / olympiad teams / internships — real school life beyond class | mechanical roster (CLB / đội-tuyển / thực-tập), each realizes a matched grain + carries its own waste; gated by ATTENTION-HOURS | major, era (era-wrong internship wastes), mood/peers (đội-tuyển pressure), the scarce hand below |
| **Attention-hours** | DECIDED → building (Phase 3) | good teaching doesn't scale — the headmaster's finite hand | a scarce DISCRETE pool that đồ-án/Lò-Rèn teaching + đội-tuyển + internships + the 3 mentor slots ALL draw from → the tragic allocation (deep programs vs rescuing named kids) | mentorship (extends the jewel), activities, pedagogy. **Driver TBD: extend era-scaled `TECH_REACH` vs faculty headcount — owner-flagged** |
| **Mentorship** | LIVE | scarce personal attention that rescues | `mentored` (MENTOR_SLOTS=3) | mismatch-rescue, **origin (the equalizer)**, mood |
| **Faculty grain** | LIVE | a teacher realizes the gift they fit | E8 teacher `grain` → teacherFactor | talent-direction (which gift flowers), mood |
| **Mood / wellbeing** | LIVE | burnout, flow, dropping out | `mood` (FLOW/penalty/dropout) | cram-drain, mismatch, origin, education |
| **ERA (the decade)** | LIVE | the world re-values gifts over time | `eraIndex(year)` → eraFav[tell] | **talent-direction (right kid / wrong era)**, the apex ceiling |
| **Family origin** | LIVE | class advantage/disadvantage at the start | `origin` nghèo/tb/khá-giả (ORIGIN_GROW) | **mentorship (counters it)**, talent-realization, era (triple-wrong) |
| **Technology / tools** | ckpt1 LIVE | the tools of an age reshape *how you teach* AND *what a gift can build* | **ckpt1 (iter-239→240):** each tech wave COMPOUNDS teaching REACH → `mentorSlots()` = `MENTOR_SLOTS` + `(eraIdx−TECH_REACH.minEra+1)·perEra` (3→4 smartphone→5 AI; deterministic, replay-safe; era-true beats). The apex slice (what tech does to the 🍎 ceiling) is the owner-gated thesis-fork → ckpt2. | **era (its native axis)**, **mentorship/origin equalizer (ckpt1 scales it)**, education, the apex conditions (ckpt2) |
| **Geography / archetype** | LIVE | where the school is sets its whole world | (L2) `CONFIG.ARCHETYPES` — 4 schools: boot economy/prestige + default culture + cohort origin-mix (tinh_le/que_ngheo/lo_thanhpho/truong_nghe) | **origin-mix** (rural contains more poor), endowment, prestige, teaching-culture, era |
| **Peers / contagion** | ckpt1 LIVE | a cohort lifts or drags its members | **ckpt1 (iter-241):** the cohort's atmosphere pulls each kid's mood toward the school mean (`CONFIG.PEER.PULL`, a deterministic variance-reducing pass in `growStudents`) — a thriving class buffers strugglers, a demoralized one drags stars out of FLOW. Aggregate-neutral (sweep PEER sensor: realize Δ0.3pts, apex held); named once a year (`tetCohortBeat` warm/cold). | **mood (its native axis)**, cohort composition, FLOW/mismatch-burnout, realize/waste |
| **Luck** | QUEUED | the same gift, different break | (idea, bounded) | era, the apex (keep rare + earned) |
| **Progression / legacy** | QUEUED | one generation seeds the next | (L3) past-run alumni → next world | archetype, era-chain |
| **World economy** | LIVE | the school's body, not its soul | cash / endow / upgrades | enables scale; must NOT become a back-door to 🍎 |

## Interaction highlights (the load-bearing "factors influence each other")
- **TALENT × EDUCATION** — a gift in a matching policy flowers; in a mismatch it goes adrift (the original
  Mentor's-Ledger spine). The refinement gives this two more orthogonal mismatch axes: **× STRUCTURE** (spark
  needs a mid-structure ladder, sky dies under drill — the spark≠sky splitter, teeth at the ceiling cap) and
  **× MAJOR** (the same gift lives a different life per track — a coder at the lathe under-realizes; "right
  gift, wrong major," impossible when major=tell; and the everyman gets Đại-cương).
- **PEDAGOGY × ACTIVITIES × MENTORSHIP — the SCARCE HAND** — deep teaching, competition teams, internships,
  and the mentor slots all draw from one finite ATTENTION pool. Running great programs for the whole cohort
  *visibly starves* your ability to rescue the one named kid in front of you — the tragic allocation the game's
  agency has lacked. Discrete picks (never a fungible budget), so it stays prose-shaped.
- **TALENT × ERA** — the same coder is a founder in the dot-com boom, a clerk in the 1990s ("right kid, wrong
  era"). The era governs the *ceiling*, not the floor.
- **ORIGIN × MENTORSHIP — the equalizer, with a ceiling** (verified iter-235) — a poor kid under-realizes
  (≈68% vs 83%) UNLESS you spend scarce attention on them → the school as equalizer. Mentoring DEFEATS origin
  (resets the class growth-drag) but does NOT defeat era (the apex tilt stands). A teacher lifts a kid past
  where they came FROM, never past the decade they graduate INTO — the đề-Văn's humility, made a mechanic.
- **ORIGIN × ERA × DIRECTION** — poor + wrong-gift + wrong-decade = the system's hardest, most-felt waste (the
  "triple-wrong"), always done TO them (invariant #4). Geography pre-loads it: a rural school simply *contains*
  more poor kids before the player makes a single choice.
- **PEERS × MOOD × FLOW** (ckpt1 LIVE) — the cohort's atmosphere pulls each kid's mood toward the school mean,
  so the môi trường decides whether a gift catches FLOW or gets dragged out of it. A star in a demoralized
  class is wasted by the *room* (invariant #4); a struggler in a thriving one is buffered. A *partial*,
  aggregate-neutral environment (not a homogenizer), shaped only indirectly via admissions + cohort policy.
- **TECHNOLOGY × ERA × MENTORSHIP** (ckpt1 LIVE) — each tech wave extends the headmaster's reach (+1 mentor
  slot by smartphone/AI era), so the verified equalizer scales: in later decades you can lift one more poor kid
  past their circumstance. This is the SAFE half — teaching CAPACITY. The apex half (what tech does to the 🍎
  ceiling) was the owner-gated thesis-fork, **resolved: keep 🍎 as-is.** Tech must never become a flat
  "+realization" upgrade — it should change WHICH gifts and WHICH kids the world lifts, not lift everyone.

## Laws this model serves (never broken)
- THESIS §B (open-question law) + §C (the 4 person-sim invariants). A factor that creates a dominant
  strategy, or makes a group waste-only, or surfaces as a meter, is wrong — retune or cut.
- Every factor change is **sweep-gated** (`sweep.js` sensors) and **grid-tunable** (`tune.js` metrics).

## Development principles this model implies (owner steer 2026-06-21)
- **MODEL-FIRST.** A new mechanic is placed in THIS table first — what real factor, how it interacts, how it
  stays plural/fun — before it's built. No ad-hoc systems.
- **GAMEPLAY/NARRATIVE BEFORE GRAPHICS, deeply.** The freeze holds until the model + its story are *right*;
  the exit gate is not to be rushed (refine hard first — graphics are the last, cheap pass once the game is
  finished and knows exactly what it's drawing).
- **PLASTIC ARCHITECTURE.** Expect to *change mechanics, or even remake*, as the model reveals needs. Favor
  clean, modular, headless-testable code (the engine is DOM-free; the structure-carve discipline keeps it so)
  and cheap, reversible changes. Don't over-polish a mechanic that the model might overturn.
