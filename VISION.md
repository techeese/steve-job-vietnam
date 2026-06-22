# VISION — Học viện Steve at its most incredible

*The 1-page picture of the dream. The loop mines this for epics; revise it when the owner's taste
sharpens. Not a spec — a north star. (See `DESIGN.md` for settled law, `MODEL.md` for the factor
model, `ROADMAP.md` for the queue.)*

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
exists to make that transformation legible, felt, and consequential. The model the owner wants is
**nature × nurture**:

- **TALENT is innate** — every person is born with a **magnitude** (a ceiling: how far they *could* go;
  `seed` 1–5) and a **direction** (a grain: what they're *for* — maker / coder / hustler; `tell` sky /
  spark / hype). Talent is potential, not destiny.
- **EDUCATION is what you do to it** — presets/teaching-dial, the khoa/major they land in, whether it
  *matches* their grain, the teachers and mentorship, mood and wellbeing. This is the nurture half, the
  part the player controls.
- **The interaction produces a LIFE**, one of three shapes — always read *relative to that person's own
  grain*, never "did they become Steve":
  - **REALIZED** — good match, room to grow → talent reaches toward its ceiling. A `vet`/`kt`-grained kid
    realized into a respected kỹ sư is a **fully realized life**, equal in dignity to the maker or the
    rare honest 🍎. The system *served* the person.
  - **WASTED** — mismatch or relentless cram → talent goes latent or curdles: a high-ceiling kid drilled
    into a văn-mẫu clerk, a quiet maker no khoa fit. Same potential, smaller life.
  - **DISTORTED** — high hustle + neglect, rote rewarded over craft → the talent turns: the coin shark,
    the hollow founder. The system *bent* the person.

The poignant core is **VISIBLE WASTED TALENT** — you watch a specific named kid become less than they
could have been, year by year, and know you did it. That is the emotional payload the đề Văn deserves.

## The four laws the person-sim must not break (design law, not preference)
The depth is powerful enough to break the open-question / reflect-not-verdict / biographies-not-scores
charter by accident. These four invariants keep it honest:

1. **Whose-life, not which-strategy.** Talent may only change *whose* life each thesis realizes or wastes
   — **never which thesis wins.** Cram, craft, hustle stay three distinct, dignified arguments. The
   player sets ONE policy for ~48 mixed kids, so "match everyone to their grain" can never be globally
   optimal — the mixed cohort is the structural defense of the open question. *(Sweep-enforced: no
   adaptive grain-matching strategy may dominate the pure theses.)*
2. **Symmetry of waste.** Every preset must REALIZE some talents and WASTE others. **No preset may be
   waste-only or realize-only**; waste is never illustrated *exclusively* by cram. *(Sweep-enforced:
   every strategy reaches both a realized and a wasted life; none has ~0 waste.)*
3. **Prose, not a meter.** The realize/waste read surfaces as **caused prose tied to a moment** ("Tú
   stopped tinkering this year — the drills left no time for the compiler he was building"), NEVER as a
   persistent potential-minus-realized number, bar, or sortable 48-kid efficiency table. A number invites
   a spreadsheet; a sentence invites grief. The other ~40 kids are *glimpsed, not metered*.
4. **Waste is done TO the person, never their deficiency.** Wasted/distorted prose blames the SYSTEM and
   the player's policy ("the drills left no room for it"), never the kid ("Tú wasn't good enough").
   Pantheon (honored real educators) names never appear in any waste/distort/scandal line — enforced in
   code.

## What a "🍎 Steve" IS — an articulation, NOT the answer
The thesis keeps the *how* open (the game never tells you how to grow a Steve). But the writing can say
**what a 🍎 represents**: the rare person who made something authentically THEIR OWN that the world came to
need — *earned, not manufactured; orthogonal to wealth, credentials, or fame* (the văn-mẫu clerk and the
coin shark are the bright traps that look like success and aren't). The quiet **counter-thesis** stands
beside it: maybe the truest answer isn't *minting a Steve* at all, but **a school that lets each kid become
themselves** — the realized kỹ sư and the honest maker are lives of equal dignity. The capstone essay holds
both in tension ("did I make this one — or did I just happen not to erase them?"), never resolves it.

## The narrative payoff — the game is experienced AS the headmaster's writing
The simulation generates the lives; the **writing is how the player FEELS them** — a first-class pillar.
- **An ANNUAL-LETTER rhythm.** The headmaster writes — each year / era turn — a short letter reflecting the
  player's recent choices and the cohort's becoming, so the story accumulates.
- **The CAPSTONE: the "how to have a Steve Jobs Vietnam" essay.** When the first 🍎 appears (and at decade
  close) the letters build to the real essay — **long, reasoned (it thinks aloud, weighs, doubts),
  personalized to THEIR run, and genuinely MOVING.** Assembled from *their* graduates and policies; it
  **wrestles, never lectures** (it raises the question with the faces that crossed the sân, never declares
  the answer). *Open build fork: authored-assembly (deterministic, offline, free) vs runtime-LLM
  (adaptive, needs an API on a static site). Default lean: authored-first, LLM an optional later layer.*
- **A few UNLOCKABLE PATHS / EVENTS** give different runs different stories (ties to eras / archetypes).

## Story & Levels — THE LATTICE
The game is ONE continuous person-sim; "state-of-the-art story/levels" = deepen the person-sim AND give it
structure — unified as ONE design, the **LATTICE**, so it never becomes four disconnected systems:

- **ARCHETYPE** — the school you're handed (scenario *and* difficulty in one): rural-underfunded /
  elite-cram / vocational / gifted-academy, each a different starting endowment, prestige, and **cohort
  talent distribution**, and a distinct thesis on the đề Văn. Easy→hard is intrinsic.
- **ERA** — the decade you play through (the authored campaign spine): 1990s scarcity → Đổi Mới → dot-com →
  smartphone → AI boom. **Each era re-weights which talents the world REALIZES vs WASTES** — the same kid
  is a wasted misfit in one era and a god in another. This is where the *story* lives.
- **THE PERSON-SIM** — the moment-to-moment texture inside each era cell (talent × education →
  realize/waste/distort), modulated by era + archetype. The soul; still the first place to invest.
- **PROGRESSION + LEGACY** — a RUN threads an ARCHETYPE through a SEQUENCE of ERAS; finishing SCORES the
  player's đề-Văn answer and unlocks harder archetypes / longer era-chains / a **legacy layer** (your
  alumni seed the next run's world). The "one more run, harder" pull.

One sentence: **a RUN = a chosen ARCHETYPE played through a SEQUENCE of ERAS, person-sim as the texture, a
PROGRESSION ladder threading the lattice** — "right kid, wrong era, wrong school" is a richer playable essay
than a single timeless sim. It MUST honor the four invariants (no era/archetype/strategy may dominate; every
era/archetype both realizes and wastes; prose not meters; waste done TO the person).

## The pillars (the systems that deliver the feel)
- **The person-simulation** — talent (ceiling × grain) × education (presets, khoa-fit, teachers,
  mentorship, mood) → realization vs waste vs distortion, told as an arc. **The deepest pillar; always the
  first place to invest.** The frontier: talent as a real ceiling+grain (a 5 left in cram plateaus painfully
  short; a 5 well-matched soars); a felt transformation arc watchable BEAT BY BEAT, not a graduation
  reveal; inner state beyond the 6 stats (a spark that can be lit or extinguished); per-person narrative
  generated FROM the realized-vs-potential gap; **attachment to specific named kids** you grieve and cheer.
- **The living campus** — the watchable medium; deepens to *show* the inner change, not decorate.
- **The destiny cascade** — graduation is the *culmination* of the visible arc, then the world's reply via
  the alumni FSM. The 🍎 is rare, EARNED, and **orthogonal to "high realization"** (high realization must
  never become a back-door 🍎 pipeline); the văn-mẫu clerk and the coin shark are the traps.
- **The school you shape** — buildings, khoas/majors with synergies, teachers, admissions, funding with
  strings, the honored-educator pantheon. Policy inputs that shape *who everyone becomes.*
- **The essay frame** — intro, recurring characters, the epilogue assembled from *your* graduates.

Respect the SCOPE: a **watch-and-set-policy** sim with ~48 students at once. Favor **systemic / policy
inputs that shape everyone** plus **one protégé the player chooses to follow** — never a design that demands
micromanaging all 48. Keep it sweep-tunable and DOM-free.

## The school you shape — THE BINDING LAW: texture, never gradient
The nurture half — the levers through which talent is realized or wasted — is the place to add depth, bound
by one law so it never becomes a self-solving school-optimizer: **every new major, teacher, prize, or unlock
must MULTIPLY THE FORMS OF WASTE (more ways a grain fits or doesn't), never create a strictly-better path.**
The cure for the owner's "too few upgrades / separate, thin systems" is *texture within each system*, not
power ladders:
- **Horizontal, not vertical (on the talent-shaping levers).** Add MORE ITEMS at the same tier (more majors,
  teachers, prizes), each a distinct trade-off. On the levers that decide WHO is realized/wasted (pedagogy,
  teacher grain-fit, major-fit): **no power ladders / strict-better tiers** — a "best rung" breeds the
  dominant strategy §1 forbids; an upgrade that lets the player *avoid waste* breaks §2. *(SCALE / capacity /
  cosmetic / content-unlock progression IS fine — it doesn't make one philosophy win. The test: "does this
  rung make a thesis dominate or let me dodge waste?" If yes, forbidden.)*
- **Every item ships with its waste.** A new major/teacher/prize is legal only if the epilogue can show BOTH
  a realized AND a wasted life from it. Produces only winners → pure upgrade → forbidden.
- **Visibility ≠ accessibility.** Keep every THESIS legible at fork-time; gate by STRUCTURAL cost (cash /
  quỹ / prereq room / endowment) and normal scope-gating — **never mystery-hide a path.** The cure for "too
  much, too early" is **fewer, deeper, more-consequential early decisions**, NOT hiding the choices. (Danger
  — VISIBILITY COLLAPSE: "overwhelming yet shallow" must not become "overwhelming yet locked.")
- **Cohesion at OUTPUT, not INPUT.** Systems ripple through *results* (the school's standing changes WHO
  applies) — but one system's unlock is **never gated behind another's completion** (that breeds a solved
  build-order). The player sets policy; the engine derives who shows up. Teachers are a reputation-shaped
  POOL the player still chooses from (high-tier = expensive, not hard-unlocked).

**Subtraction is design.** The game gets better by PRUNING what doesn't serve the soul, not only by adding.
A mechanic that's confusing, inert, unused, or that dilutes the open question is DEBT — cut it (you have
git). A leaner, legible game beats a feature-stuffed one.

## Phase & priority — GAMEPLAY-FIRST, graphics FROZEN
The graphics bar is **MET ENOUGH** — premium characters, crafted buildings, day-arc + golden hour,
weather, Tết petals, the gold answer-card + Steve-climax. The campus is genuinely lovely to watch. So
graphics now **SERVE** the people-sim; a visual pick is justified ONLY when it makes a *transformation more
legible or felt*, never polish for polish's sake. The loop should **stop reaching for new graphics pillars**
and reach for the deep person-model.

**GAMEPLAY-FIRST PHASE (owner steer 2026-06-21):** developing graphics and gameplay at once made graphics
the *speed blocker* while the gameplay/story is not yet state-of-the-art. So the order is inverted — **take
the gameplay, person-sim, and STORY/LEVELS to state-of-the-art with the art layer FROZEN**, then do graphics
as ONE concentrated pass at the end. Driven by the `improve-steve-gameplay` skill; verification is
HEADLESS-ONLY (gate · sweep · bot · lives).

**THE DECOUPLING PRINCIPLE:** gameplay/story development is NOT capped by what the current graphics can
render. A mechanic, era, or story beat the art can't depict yet is **still valid to build now** — ship it as
text / a placeholder / a minimal indicator; the later graphics pass backfills the visuals. Freezing art
means *don't develop new art* — it does **not** mean *limit gameplay to what today's art shows.*

## The bar, in one test
The old test — *"would a screenshot make a stranger want to play?"* — is **met**. The new, harder bar the
loop must aim every ship at:

> **Would you GRIEVE a wasted talent, or CHEER a realized one — by name?**
> (And note: cheering a realized *kỹ sư* counts, not only an 🍎.)

Until that is an easy yes, the deep simulation of a person becoming themselves keeps winning the slot. The
screenshot test still guards regressions; **the grief-and-cheer test now sets the direction.**
