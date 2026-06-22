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

EDUCATION — the player's lever — is **EXPANDING from one slider into a small composed sub-product** (the
2026-06-22 decided refinement; see `MODEL-REMAKE-PROPOSAL.md` + ROADMAP `## Epic: EDUCATION MODEL REFINEMENT`):
> **EDUCATION = MATCH(tell, mode) × STRUCT_FIT(tell, structure) × MAJOR_FIT(tell, major) ×
> ACTIVITY(matched-realize / mismatched-waste, GATED by attention-hours) × MENTORSHIP × FACULTY_GRAIN.**

No term dominates; each *re-weights whose* life is realized vs wasted (invariant #1), never *which policy is
correct*. The player's lever is EDUCATION + attention; the rest is the world they're dropped into. The
refinement keeps that law — it gives the lever more *texture* and more *felt decisions*, never a dominant
setting (every new table ships its symmetry + non-dominance sweep sensor BEFORE the lever).

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

## Interaction highlights (the "factors influence each other" the owner wants tracked)
- **TALENT × EDUCATION** — a gift in a matching policy flowers; in a mismatch it goes adrift (the original
  Mentor's-Ledger spine).
- **TALENT × MODE × STRUCTURE** (DECIDED, Phase 1) — pedagogy is two axes, not one: *what* the time produces
  (cram↔project) AND *how the day is governed* (drill↔autonomy). A coder (spark) needs a scaffolded ladder
  then the machine (mid structure); a hands-maker (sky) dies under drill (low structure). This is what finally
  makes spark≠sky — today they share an identical fit row. Teeth land at the ceiling cap, not just rates.
- **TALENT × MAJOR** (DECIDED, Phase 2) — the *same gift* lives a different life in a different track: a spark
  in Chế-tạo (a coder at the lathe) under-realizes; in Lập-trình it flowers. "Right gift, wrong major" — a
  fate that's structurally impossible today (major=tell). And the >50% everyman finally gets a real home
  (Đại-cương) where they realize as a kỹ-thuật-viên or are quietly wasted.
- **PEDAGOGY × ACTIVITIES × MENTORSHIP — the SCARCE HAND** (DECIDED, Phase 3) — deep teaching, competition
  teams, internships, and the 3 mentor slots all draw from one finite ATTENTION pool. Running great programs
  for the whole cohort *visibly starves* your ability to rescue the one named kid in front of you — the tragic
  allocation the game's agency has lacked. Discrete picks (never a fungible budget), so it stays prose-shaped.
- **TALENT × ERA** — the same coder is a founder in the dot-com boom, a clerk in the 1990s ("right kid,
  wrong era"). The era governs the *ceiling*, not the floor.
- **ORIGIN × MENTORSHIP** — a poor kid under-realizes (68% vs 83%) UNLESS you spend scarce attention on them
  → the school as *equalizer*. The đề-Văn's truest question, made a mechanic.
- **MENTORSHIP's CEILING** (verified iter-235) — the player's scarce-attention lever DEFEATS origin (mentoring
  resets `orgGrow→1`, erasing the class growth-drag) but does NOT defeat era (the apex tilt still stands). A
  teacher can lift a kid past where they came FROM, never past the decade they graduate INTO. The player's agency
  has a limit, and that limit is the world's timing — the đề-Văn's humility, made a mechanic (not a flat rescue).
- **ORIGIN × ERA × DIRECTION** — poor + wrong-gift + wrong-decade = the system's hardest, most-felt waste
  (the "triple-wrong"), always done TO them (invariant #4).
- **GEOGRAPHY → ORIGIN-MIX** (queued) — a rural school simply *contains* more poor kids; place pre-loads
  circumstance before the player makes a single choice.
- **PEERS × MOOD × FLOW** (ckpt1 LIVE, iter-241) — the cohort's atmosphere pulls each kid's mood toward the school
  mean, so the môi trường (the class you're in) decides whether your gift catches FLOW or gets dragged out of it. A
  star in a demoralized class is wasted by the *room*, not by themselves (invariant #4); a struggler in a thriving
  one is buffered. Tuned as a *partial* environment (not a homogenizer) and aggregate-neutral, so it adds a social
  layer to the realize/waste reading without becoming a dominant strategy. The player shapes it only indirectly —
  through admissions + the policy that sets the whole cohort's mood.
- **TECHNOLOGY × ERA × MENTORSHIP** (ckpt1 LIVE, iter-239) — the AI era's trợ-giảng extends the headmaster's
  reach (+1 mentor slot), so the verified mentorship×origin equalizer scales: in the AI decades you can lift one
  more poor kid past their circumstance. This is the SAFE half of the factor (teaching CAPACITY), built on the
  owner's "continue" without touching the thesis. The apex half (below) stays owner-gated.
- **TECHNOLOGY × ERA × EDUCATION × APEX** (ckpt2, owner-gated thesis-fork, owner steer 2026-06-21) — each era's *tools* reshape the
  game twice over: (a) **education** — the AI era could offer an AI-tutor that changes the economics of
  scarce mentorship (does it democratize attention to the poor, or only the rich school affords it? → ties to
  ORIGIN), online learning that widens access; (b) **the apex conditions** — tech lowers the barrier to
  "making something the world needs" (a coder + modern tools builds what once took a team), so *what counts
  as a Steve* and *how reachable it is* shifts by era. Speculative FUTURE eras (beyond the AI boom) can extend
  the authored spine — each a new technology that re-poses the đề-Văn for its time. The risk to guard: tech
  must not become a flat "+realization" upgrade (that breaks pluralism) — it should *change WHICH gifts and
  WHICH kids* the world lifts, not lift everyone.

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
