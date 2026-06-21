# MODEL-REMAKE-PROPOSAL.md — refine the EDUCATION model (owner-requested fan-out, 2026-06-22)

> Produced by a 26-agent review workflow (4 readers → 5 independent model proposals → 15 adversarial
> judges → synthesis → completeness critic; ~2.47M tokens). This is the **decided model + corrections**,
> for the owner to react to **before any build**. Thesis-adjacent calls are NOT decided here — they're
> the **Owner Forks** at the bottom.

## Headline verdict: REFINE in place, do NOT rebuild

The owner asked to "refine the model deeply before a total remake." The review's strong, unanimous
verdict: **a total remake is the wrong move.** ~90% of the engine is the well-tuned, law-bearing spine
(the multiplier-product growth core, the cascade + prose engine, the alumni FSM, the era/origin/archetype
lattice, the mentorship equalizer, the determinism-from-id discipline, the capstone frame). The
oversimplification the owner feels lives in **one term of the equation — EDUCATION** — which is currently a
single per-grade slider. The fix is to expand that one term into a small composed sub-product, in phases,
each independently sweep-gated. Demolition would throw away the soul to fix the surface.

## What's actually too simple today (the audit, grounded in the code)

- **Pedagogy = one 3-stop slider per grade** (luyện-đề / cân-bằng / đồ-án), modeled as a flat 6-stat
  rate-vector + a single `MATCH(tell, preset)` 4×3 multiplier. `cân bằng` is the literal arithmetic middle
  — so there are really ~2 philosophies (cram↔project) plus a null, not 3.
- **`spark` and `sky` share an identical MATCH row** — a coder and a hands-maker respond to teaching
  *exactly the same*. The "different gifts need different teaching" idea is unmodeled.
- **Major = tell, 1:1** (`studentMajor = majorByTell`). Major-fit is perfect by construction; "wrong major
  for this kid" is structurally impossible; the **>50% of kids with no `tell` ("everyman") have no major and
  no realize-path of their own.**
- **Activities are 100% cosmetic** (`.act` has zero sim effect).
- **The saturation wall**: for the gifted, growth-rate nudges wash out — so any new lever must bite at the
  **CEILING/cap layer**, not just rates, or it's legible-but-inert for exactly the kids the đề-Văn is about.

## The decided model — 3 composing additions, each a real player VERB

### 1. The TEACHING DIAL (replaces the 3 triết lý with a 2-axis dial)
Keep the 3 triết lý as **named one-tap corners** (legibility + byte-identical default), but add an
orthogonal axis:
- **Axis A — MODE** (what the time produces): luyện-đề ↔ cân-bằng ↔ đồ-án (today's spectrum, kept).
- **Axis B — STRUCTURE** (how the day is governed): low ↔ mid ↔ high scaffold (**new**).
- Four real philosophies emerge instead of a 1-D line: high-structure+đồ-án = **Lò Rèn / apprenticeship**
  (the coder's ladder), low-structure+đồ-án = the maker's open xưởng, high-structure+luyện-đề = today's
  cram, low-structure+cân-bằng = a Socratic seminar.
- **The load-bearing change:** fit becomes `MATCH(tell,mode) × STRUCT_FIT(tell,structure)` — **two small
  composing tables**, not a continuous plane (the panel proved a free plane re-elects a soft center).
  `STRUCT_FIT` finally **splits spark≠sky**: spark peaks at MID structure (a ladder, then the machine),
  sky peaks at LOW (a maker dies under drill), everyman ("") peaks at HIGH (needs the ladder).
- **Teeth at the ceiling:** the composed fit feeds `MISMATCH_CEIL` (the cap), where the saturation wall
  can't wash it out — **but as a small DISCRETE cap-multiplier table, NOT a distance formula** (the
  critic's catch: a smooth distance→cap function is the "gradient" the binding law forbids; keep it texture).
- The single hard-coded `MATCH_CM` (hype+cram→shark) generalizes into a tell-keyed **distortion map**
  (spark→credential-grinder, sky→văn-mẫu, hype→coin-shark).

### 2. DECOUPLE major from tell (~6 chosen majors)
*(Every judge named this the highest-leverage, lowest-risk move — it adds no new gift, touches no
invariant.)*
- A **MAJOR** becomes an authored **environment** `{key, fitVector over the 4 tells, idealStructure,
  room-prereq, era-tilt, realized+wasted prose banks}`. A grain reaches several majors at different fit.
- Ship ~6 at **one horizontal tier** (never a power ladder): Lập-trình · Khoa-học-máy-tính · Chế-tạo/Cơ-khí ·
  Thiết-kế-Mỹ-thuật (a *second* home for sky → a real choice) · Truyền-thông/Khởi-nghiệp · **Đại-cương-ứng-dụng
  (the everyman's real track)**.
- **MAJOR_FIT is a second ceiling term** distinct from pedagogy mismatch → two orthogonal ways to be wasted:
  a spark in Chế-tạo (a coder at the lathe) under-realizes; same gift + right major = a different life. **The
  đề-Văn's "wrong major" tragedy, impossible today.**
- **Assignment stays SYSTEMIC** (never per-kid micromanagement): you build rooms to open majors + set a
  per-major **intake rule** (fit-priority vs open-door) + capacity. Kids sort deterministically (id-derived,
  no rng, no save field). The **one** per-kid override is the protégé (re-track the kid you mentor).
- The scripted seed-5 prodigy is **removed** (it's a pure-buff law-violator) → opening a room tilts that
  grain's *applicant share* next cycle instead (texture, not a power injection).

### 3. ACTIVITIES become mechanical + a shared ATTENTION-HOURS pool
*(Highest agency-per-line in the review — the first real opportunity-cost verb beyond the 3 mentor slots.)*
- A small per-term **activity roster**: CLB (clubs) · đội-tuyển (olympiad/competition) · thực-tập
  (internships) — each realizes a matched grain and **carries its own waste** (đội-tuyển drains the
  un-selected's mood; the media CLB risks the sống-ảo distortion; an era-wrong internship wastes applied skill).
- **The unifying scarcity — ATTENTION-HOURS:** đồ-án/Lò-Rèn teaching, đội-tuyển, internships, AND the
  mentor slots all **draw from one finite pool**. *Deep programs for everyone visibly starve your ability to
  rescue specific kids.* Allocated as **DISCRETE picks** (a program/a mentee = a fixed hour-block), never a
  fungible slider (§C-3 protection).

## The factor-interaction model (the expanded equation)

```
a LIFE = TALENT(seed × tell)
       × EDUCATION[ MATCH(tell,mode) × STRUCT_FIT(tell,structure) × MAJOR_FIT(tell,major)
                    × ACTIVITY(matched realize / mismatched waste, GATED by attention-hours)
                    × MENTORSHIP × FACULTY_GRAIN ]
       × WORLD(era × archetype) × CIRCUMSTANCE(origin) × LUCK
```
- **STRUCTURE** re-weights *which tell each mode realizes* (composed into mm + the cap). The spark≠sky splitter.
- **MAJOR_FIT** re-weights *within a tell* (same-gift-different-life) as a second, smaller ceiling term.
- **ATTENTION-HOURS** is the new tragic allocation. *(Owner-fork-adjacent driver question — see strengthen
  item; today's mentor reach is **era**-scaled via `TECH_REACH`, so the new pool must either extend that or
  justify a second driver.)*
- **ERA** deepens "right kid, wrong era" → "right **track**, wrong era" — **via the existing `eraFav`-on-tell
  only** (no new FSM weights; reading-only prose). *(Owner Fork #3.)*
- **ORIGIN × ACTIVITY × MENTORSHIP**: a poor kid can't afford the costly đội-tuyển/unpaid internship unless
  mentored/scholarshipped — the equalizer extends to the new lever (and still beats origin, never era).
- **FACULTY GRAIN** finally gets teeth: a code CLB without a spark-grain teacher under-realizes; folds the
  dormant CKPT2B idea into a *chosen* trade-off.

## The agency loop (closing "sim deeper than game")
A new decision heartbeat layered on the existing June/admissions/event modals: **CHỌN-DIAL** (per grade,
re-confirmable yearly as the cohort's tell-mix shifts) · **CHỌN-MAJOR INTAKE** (fit-vs-open + capacity) ·
**ACTIVITY ROSTER** (discrete picks vs attention-hours) · **ATTENTION TRIAGE** (mentor this prodigy OR run
the hackathon OR send the cohort to internships — never all) · **MENTOR RE-TRACK**.
**Felt-live, honestly bounded:** the deep realize/waste read still resolves at graduation (FSM untouched),
but major/dial mismatch now **drains mood live**, so `cohortBeat`/`favBeat` name the wrong-track kid wilting
*this season* — and the warning is now **actionable** (re-track / realign / drop the program) instead of
read-only. Beats stay rnd-free, news-only, one-kid-at-a-time (the throttles stay, so it can't become an
allocate→wilt→undo meter). **Replay value:** archetype × era-chain × which majors you open × your dial-path
is now a real discovered strategy space.

## Phased build scope (each phase ships alone, sweep-gated, gate-green)

- **Phase 0 (NEW prerequisite — critic's catch):** the gate tests *determinism only*, not a growth baseline,
  so a mis-tuned `STRUCT_FIT`-at-baseline would **silently regress every kid's realization and stay GREEN**.
  Build a stored **realization/destiny histogram snapshot** check first, or the whole refinement ships on faith.
- **Phase 1 — STRUCTURE axis.** `STRUCT_FIT` table; `S.presets.n*` → `{mode,structure}` (default-derive old
  enum → `{enum, mid}`, must return exactly 1.0 at baseline); compose into mm + the **discrete** cap table;
  re-point the threshold reads — **including the `ui.js` L908–923 per-kid fit readout the synthesis missed**
  (the surface closest to a forbidden fit-meter); replace `MATCH_CM` with the distortion map; UI dial. Sweep:
  STRUCT_FIT symmetry + a spark≠sky assertion. *Fixes the verified spark==sky degeneracy alone.*
- **Phase 2 — MAJORS decoupled.** **Write the everyman content FIRST** (`realGapTell[class]['']` + the
  Đại-cương realized+wasted banks — they do **not exist today**; per the project's own "every item ships with
  its waste" law, the major is illegal to ship without both fates). Then the ~6 major environments;
  systemic best-fit resolver; intake UI; protégé re-track; remove the scripted prodigy **(re-baseline the gate
  alumni snapshot + rewrite the WASTED-PRODIGY sensor in the same commit** — it's determinism-breaking, not
  cosmetic); rewrite the sweep STRATS + adaptive bot off the hardcoded preset keys. Fold/delete CKPT2B.
- **Phase 3 — ACTIVITIES + ATTENTION-HOURS + a real term cadence.** The only genuinely new subsystem
  (`S.term` + `S.activities` + the pool). **Note: activities are player input → they MUST be saved +
  sanitized/migrated** (this breaks the "derive-from-id, no migrator" pattern — handle like the iter-202
  save-loss fix). Sweep: activity symmetry + an attention-allocation non-dominance sensor. **Droppable:** if
  the pool proves dominance-prone, Phases 1–2 already answer most of the owner's critique.

## Open risks (the gating ones, corrected by the critic)
1. **Sweep debt is THE gating risk** — every new table needs its symmetry + non-dominance sensor authored
   *before* the lever, and the **adaptive bot must be upgraded to co-optimize the new knobs** (today it only
   maps modal-tell→one preset) or the no-dominant-strategy guarantee goes **blind**. Needs a named bounded
   algorithm per phase (e.g. greedy per-grade hill-climb over {mode×structure}).
2. **Everyman content doesn't exist** — the flagship "dignify the >50%" deliverable has zero `''` prose today.
   Gating prerequisite for Phase 2, and it sits on the most thesis-adjacent fork (#1).
3. **Attention-hours driver contradiction** — mentor reach is *already* era-scaled (`TECH_REACH`); decide
   whether the new pool extends that or adds a faculty driver (two drivers of one scarcity = untested dominance).
4. **Saturation-wall re-bite** — verify the ceiling teeth via the REALIZATION sensor **for the gifted
   specifically**, not assumed.
5. **Visibility collapse** — 2-axis dial × 6 majors × activity roster risks a management panel; introduce one
   axis per phase, default to named corners, keep picks few and weighty.
6. **§C-3 meter-leak at the INPUT** — a dial grid + an hour budget are spreadsheet-*shaped*; the discipline
   (discrete picks, prose-only outputs, no fit-% shown) must hold every increment.

## OWNER FORKS — your call (thesis-adjacent; not decided by the loop)

1. **The everyman's home.** Give `tell=""` (>50% of kids) a real realize-path via the Đại-cương major + a
   STRUCT_FIT high peak? `""` being era-neutral + inverting MATCH is the *structural firewall* that stops
   "match everyone to their grain" from globally dominating. → **Rec: give "" a real major but keep it
   strictly era-neutral with a BOUNDED structure peak** (needs a numeric bound + a sensor that an all-""
   strategy can't win 🍎+cash). Options: full strong home (richest, riskiest) · bounded middle (rec) · leave
   homeless (safest, abandons half the kids).
2. **Capstone voice.** Should the year-10 essay name your dial-path/major-emphasis as your "answer"? → **Rec:
   weave it in IMPLICITLY through the lives you shaped (a wrong-major wilt, a Lò-Rèn coder who bloomed) —
   faces not policy, still cutting off at "Tôi—".** *(Note: a shipped capstone line already says "vì tôi để
   quá nhiều cửa mở" — the open-door tragedy is partly pre-committed; reconcile it with the Phase-2 mechanic.)*
3. **Era × tracks.** Should ERA re-weight a major's apex ("right track, wrong era")? → **Rec: use the existing
   `eraFav`-on-tell so a major inherits its dominant grain's era tilt — no new FSM weights, reading-only prose.**
4. **Capstone generation** (VISION's standing fork). Authored-assembly vs runtime-LLM as the model richens? →
   **Rec: authored-first, deeply conditioned on the new run-state; revisit LLM only after the model is frozen.**
