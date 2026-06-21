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

No term dominates; each *re-weights whose* life is realized vs wasted (invariant #1), never *which policy is
correct*. The player's lever is EDUCATION + attention; the rest is the world they're dropped into.

## The factors (LIVE = shipped · QUEUED = planned) — real-world basis · mechanic · key interactions
| Factor | State | Real-world basis | Current mechanic | Interacts with |
|---|---|---|---|---|
| **Talent magnitude** | LIVE | innate ceiling — how far one *could* go | `seed` 1–5 (SEED_MULT) | everything (it's the ceiling realization is measured against) |
| **Talent direction** | LIVE | a grain — maker / coder / hustler | `tell` sky/spark/hype | education-match, era, faculty-grain, the gift-specific prose |
| **Education policy** | LIVE | cram vs craft vs hustle pedagogy | `presets` luyện-đề / đồ-án / cân-bằng (MATCH × tell) | talent-direction (match/mismatch → realize/waste), mood |
| **Mentorship** | LIVE | scarce personal attention that rescues | `mentored` (MENTOR_SLOTS=3) | mismatch-rescue, **origin (the equalizer)**, mood |
| **Faculty grain** | LIVE | a teacher realizes the gift they fit | E8 teacher `grain` → teacherFactor | talent-direction (which gift flowers), mood |
| **Mood / wellbeing** | LIVE | burnout, flow, dropping out | `mood` (FLOW/penalty/dropout) | cram-drain, mismatch, origin, education |
| **ERA (the decade)** | LIVE | the world re-values gifts over time | `eraIndex(year)` → eraFav[tell] | **talent-direction (right kid / wrong era)**, the apex ceiling |
| **Family origin** | LIVE | class advantage/disadvantage at the start | `origin` nghèo/tb/khá-giả (ORIGIN_GROW) | **mentorship (counters it)**, talent-realization, era (triple-wrong) |
| **Technology / tools** | QUEUED | the tools of an age reshape *how you teach* AND *what a gift can build* | (idea) rides ERA: each decade unlocks tools (no-computer → PC → internet → smartphone → AI → ?) | **era (its native axis)**, education (new pedagogy/access), origin (tools can democratize OR widen the gap), the apex conditions |
| **Geography / archetype** | QUEUED | where the school is sets its whole world | (L2) starting-state table | origin-mix, endowment, prestige, local gift-bias, era |
| **Peers / contagion** | QUEUED | a cohort lifts or drags its members | (idea) | cohort composition, mood, realize/waste |
| **Luck** | QUEUED | the same gift, different break | (idea, bounded) | era, the apex (keep rare + earned) |
| **Progression / legacy** | QUEUED | one generation seeds the next | (L3) past-run alumni → next world | archetype, era-chain |
| **World economy** | LIVE | the school's body, not its soul | cash / endow / upgrades | enables scale; must NOT become a back-door to 🍎 |

## Interaction highlights (the "factors influence each other" the owner wants tracked)
- **TALENT × EDUCATION** — a gift in a matching policy flowers; in a mismatch it goes adrift (the original
  Mentor's-Ledger spine).
- **TALENT × ERA** — the same coder is a founder in the dot-com boom, a clerk in the 1990s ("right kid,
  wrong era"). The era governs the *ceiling*, not the floor.
- **ORIGIN × MENTORSHIP** — a poor kid under-realizes (68% vs 83%) UNLESS you spend scarce attention on them
  → the school as *equalizer*. The đề-Văn's truest question, made a mechanic.
- **ORIGIN × ERA × DIRECTION** — poor + wrong-gift + wrong-decade = the system's hardest, most-felt waste
  (the "triple-wrong"), always done TO them (invariant #4).
- **GEOGRAPHY → ORIGIN-MIX** (queued) — a rural school simply *contains* more poor kids; place pre-loads
  circumstance before the player makes a single choice.
- **TECHNOLOGY × ERA × EDUCATION × APEX** (queued, owner steer 2026-06-21) — each era's *tools* reshape the
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
