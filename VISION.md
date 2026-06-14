# VISION — Học viện Steve at its most incredible

*The 1-page picture of the dream. The loop mines this for epics; revise it when the owner's taste
sharpens. Not a spec — a north star. (See `DESIGN.md` for settled law, `ROADMAP.md` for the queue.)*

## The one-sentence dream
A **sunny, slightly chaotic little Vietnamese university** where you watch real little people **grow up
into who they become** — a gifted kid realized into a maker, an engineer, the rare 🍎; or that same kid
ground into a văn-mẫu clerk, twisted into a coin shark, his talent quietly wasted on your watch. It is
secretly a **playable essay** on the real đề Văn question — *làm thế nào để Việt Nam có những "Steve Jobs
Việt Nam"?* — and the answer is not told to you. You set the policy, build the school, and **feel
responsible** for each life that scatters into the world. You arrive at **your own** answer because you
lived through what your school did to its people.

## The north star — PEOPLE DEVELOPMENT
**The soul of this game is the deep simulation of an individual becoming themselves.** Every other system
exists to make that transformation legible, felt, and consequential. The đề-Văn question — *how does
Vietnam grow its Steve Jobs?* — is only answerable if the game can actually **simulate a person's talent
meeting an education system and being realized, wasted, or distorted.** That simulation is the #1 frontier
and the only thing the loop should be reaching to deepen.

The design model the owner wants is **nature × nurture**:

- **TALENT is innate** — every person is born with a **magnitude** (a ceiling: how far they *could* go;
  today's `seed` 1–5) and a **direction** (a grain: what they're *for* — maker / coder / hustler; today's
  `tell` sky / spark / hype). Talent is potential, not destiny.
- **EDUCATION is what you do to it** — your PRESETS (cram / craft / hustle), the khoa they land in,
  whether their major *matches* their grain, the teachers and mentorship they get, their mood and
  wellbeing. This is the nurture half, and it is the part the player controls.
- **The interaction produces a LIFE**, one of three shapes:
  - **REALIZED** — good match, room to grow → the talent reaches toward its ceiling. *Realization is NOT
    "became a founder."* A `vet`/`kt`-grained kid realized into a respected, employed kỹ sư or a steady
    specialist is a **fully realized life**, equal in dignity to the maker or the rare honest 🍎. The
    system *served* the person.
  - **WASTED** — mismatch or relentless cram → talent goes latent or curdles → the heartbreaking case: a
    high-ceiling kid drilled into a văn-mẫu clerk, a quiet maker no khoa ever fit. Same potential, smaller
    life. Waste is *potential unmet relative to that person's own grain*, never "didn't become Steve."
  - **DISTORTED** — high hustle + neglect, rote rewarded over craft → the talent turns → the coin shark,
    the hollow founder. The system *bent* the person.

The poignant core is **VISIBLE WASTED TALENT** — you should be able to watch a specific named kid become
less than they could have been, year by year, and know you did it. That is the emotional payload the đề
Văn deserves, and it is what "people development" means here.

## Laws the person-sim must not break (these protect the charter)
The new depth is powerful enough to break the open-question / reflect-not-verdict / biographies-not-scores
laws by accident. These four invariants keep it honest — they are *design law*, not preference:

1. **Whose-life, not which-strategy.** Talent may only change *whose* life each thesis realizes or wastes
   — **never which thesis wins.** Cram, craft, hustle stay three distinct, dignified arguments. The
   player sets ONE policy for ~48 mixed kids, so "match everyone to their grain" can never be globally
   optimal — the mixed cohort is the structural defense of the open question. *(Sweep-enforced: an
   adaptive grain-matching strategy must NOT dominate the pure theses.)*
2. **Symmetry of waste.** Every preset must REALIZE some talents and WASTE others. Cram realizes the
   structure-needing `kt`/`vet` kid and wastes the dreamer; craft realizes the maker and wastes the kid
   who needed a ladder and drilled fundamentals; hustle realizes the genuine operator and distorts the
   neglected. **No preset may be waste-only or realize-only.** Waste is never illustrated *exclusively* by
   cram. *(Sweep-enforced: every strategy reaches both a realized and a wasted life; none has ~0 waste.)*
3. **Prose, not a meter.** The realize/waste read surfaces as **caused prose tied to a moment** ("Tú
   stopped tinkering this year — the drills left no time for the compiler he was building"), NEVER as a
   persistent potential-minus-realized number, bar, or sortable 48-kid efficiency table. A number invites
   a spreadsheet; a sentence invites grief. The other ~40 kids are *glimpsed, not metered* —
   illegibility-at-scale is a feature that keeps biographies from becoming scores.
4. **Waste is done TO the person, never their deficiency.** Wasted/distorted prose blames the SYSTEM and
   the player's policy ("the drills left no room for it"), never the kid ("Tú wasn't good enough"). The
   poignancy IS the player's responsibility. Pantheon (honored real educators) names never appear in any
   waste/distort/scandal line — enforced in code, not by hand.

## What "deep people-development" concretely means (the frontier)
Today a student is **6 numbers** (kt/tn/st/cm/vet + mood) that drift by a flat per-year PRESET, plus a
`seed` and a `tell`, with the destiny rolled only at graduation. That is a *shallow* model wearing
beautiful clothes. Deepening it means, roughly in order of soul-per-effort:

1. **Talent as a real ceiling + grain** — `seed` should *cap and accelerate* growth (a 5 left in cram
   plateaus painfully short; a 5 well-matched soars); `tell` should make matched education compound and
   mismatched education grind. Realization and waste must be mechanically real, not cosmetic.
2. **A felt transformation arc** — the change should be watchable BEAT BY BEAT during the years, not a
   reveal at graduation. Turning points, plateaus, a kid who "clicks" in the Xưởng, a kid who goes quiet
   under cram. The destiny FSM stops being a dice-roll and becomes the *culmination* of a visible arc.
3. **Inner state beyond the 6 stats** — a person is more than meters: a spark/curiosity that can be lit
   or extinguished, a sense of fit, burnout vs flow. Mood should be wellbeing-with-consequences.
4. **Emergent per-person narrative** — the sim tells each life in its own words, GENERATED FROM the kid's
   realized-vs-potential gap (not generic strings): small moments, biographies that read as *caused*.
5. **Attachment design** — you care about *specific named kids*. A protégé you follow; the prodigies
   already in the data (Tú, Hà, Phát, Mai Sương) are the seed. You should grieve one and cheer another
   **by name.**

Respect the SCOPE: this is a **watch-and-set-policy** sim with ~48 students at once. Favor **systemic /
policy inputs that shape everyone** plus **one protégé the player chooses to follow** — never a design
that demands micromanaging all 48 (placement/admissions stays a systemic policy lever, NOT a per-kid UI).
Build it inside the existing engine (`growStudents`, the alumni FSM, `genStudent`) and keep it
**sweep-tunable** and DOM-free.

## The feel (in order of priority)
1. **A person becoming themselves — realized or wasted.** The watchable, felt arc of talent meeting
   schooling. **This is the soul and the #1 unmet frontier.** Bar = *you feel responsible for a life.*
2. **A campus that breathes** — the living, watchable layer the person-sim plays out ON. **This is the
   BODY of the soul** — the medium through which transformation is seen. Its job now is to RENDER the soul
   (a kid visibly thriving vs withdrawing), not to decorate.
3. **Biographies, not scores.** Outcomes span years and switch states (the star who becomes a coin
   scammer two years out). Named students; real educators honored by name.
4. **The open question stays open.** No dominant strategy — cram, craft, hustle are each a viable,
   distinct *thesis*. The endgame mirrors the player's own school back as an epilogue, not a verdict —
   including realized clerks and realized engineers as GOOD outcomes, not a count of 🍎s minted.
5. **Satire anchored in the real moment.** Nuôi Em, the THPT essay prompt, văn mẫu, sống ảo, coin
   culture — topical, dry, never cruel, all fictional.

## The pillars (the systems that deliver the feel)
- **The person-simulation** — talent (ceiling × grain) × education (presets, khoa-fit, teachers,
  mentorship, mood/wellbeing) → realization vs waste vs distortion, told as an arc. **The deepest pillar;
  always the first place to invest.**
- **The living campus** — the watchable medium for the above. Deepens to *show* the inner change, not
  just decorate.
- **The destiny cascade** — graduation is the *culmination* of the visible arc, then the world's reply
  via the alumni FSM. The 🍎 is rare and EARNED and **orthogonal to "high realization"** (high realization
  must never become a back-door 🍎 pipeline); the văn-mẫu clerk and the coin shark are the traps.
- **The school you shape** — buildings, khoas/majors with synergies, teachers, admissions, funding with
  strings, the honored-educator pantheon. Policy inputs that shape *who everyone becomes.*
- **The essay frame** — intro, recurring characters, the epilogue assembled from *your* graduates.

## The graphics bar — MET ENOUGH; it now SERVES, it no longer LEADS
For ~50 iterations graphics was the #1 dimension and won every contested slot. **That bar is now met
enough.** Shipped and good: premium 24×32 volumetric characters, crafted material buildings, a felt sunny
day-arc + golden hour, drifting cloud-shadows + god-rays + drizzle, Tết petals + graduation confetti, the
scandal news-van, the per-axis look customizer, state-aware campus-lofi BGM, the gold answer-card +
Steve-climax moment, khoa identity + the Cúp Khoa race. **The campus is genuinely lovely to watch.**

So the priority hierarchy is **re-centered**: graphics and charm are **good enough — they SERVE the
people-sim now.** A visual pick is justified ONLY when it makes a *transformation more legible or felt* (a
kid visibly thriving vs wilting, an arc you can *see*), never as polish for polish's sake. The loop should
**stop reaching for new graphics pillars** and start reaching for the deep person-model. Charm is
maintained, not led-with. (Still genuinely open if the person-sim ever needs them: khoa-life facilities, a
dedicated khoa screen — but these are SECONDARY to the soul.)

## The bar, in one test — the NEW bar
The old test was *"would a screenshot make a stranger want to play?"* — and the answer is now yes. **That
bar is met.** The new, harder bar — the one the loop must aim every ship at — is:

> **Would you GRIEVE a wasted talent, or CHEER a realized one — by name?**
> (And note: cheering a realized *kỹ sư* counts, not only an 🍎.)

Until that is an easy yes, the deep simulation of a person becoming themselves keeps winning the slot.
The screenshot test still guards regressions; **the grief-and-cheer test now sets the direction.**
