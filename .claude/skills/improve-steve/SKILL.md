---
name: improve-steve
description: The autonomous improvement loop for "Học viện Steve" (Steve Jobs Việt Nam) — a satirical Vietnamese cram-school/university management game shipped as a single live page. Use when asked to build, improve, iterate on, or "run the loop" for this game. One invocation = one iteration: orient → pick the top ROADMAP item → build → gate → push to main (live on GitHub Pages) → log → update the Owner Model. The loop also evolves the design itself — editing DESIGN.md, the specs, and ROADMAP.md so the game grows over time, not just executes a frozen plan. The owner watches the result remotely and steers by reaction, so EVERY iteration must ship something visible at the live URL.
---

# improve-steve — the development loop

This is a **product loop**, not a task runner. The owner can't see the code; he sees
**https://techeese.github.io/steve-job-vietnam/** on his phone and reacts. Your job each
iteration is to put a real, visible improvement in front of him and to get sharper about
what he actually wants. Ship every iteration. Silence between pushes is wasted bandwidth.

## One iteration

1. **Orient.** Pull `main`. Read `ROADMAP.md` (the queue), the last few `CHANGELOG.md`
   entries, and the **Owner Model** below. Check whether a build/agent you didn't start is
   already in flight (running background tasks) before doing duplicate work.
2. **Pick.** Take the top **Now** item in `ROADMAP.md` unless the owner's latest message
   redirects you — a live owner steer always outranks the queue. Scope it to one shippable
   slice.
3. **Build.** Implement against the specs: `MVP-SPEC.md` (S1 high-school skeleton),
   `CONVERSION-SPEC.md` (S1 → university), `DESIGN.md` (v2 rulings — these win on conflict).
   All balance constants live in one `CONFIG` object. Don't *thrash* settled design on a
   whim — but the design is **not frozen** (see next).
4. **Gate.** `bash gate.sh` must be green (GATE_FRESH / GATE_COMPAT / GATE_BUILD, plus any
   gate the item adds, e.g. GATE_ART). No `JSERR` in any boot. Gates are the proof the owner
   can't get by reading code — never push red.
5. **390px / mobile pass.** The owner is on a phone. Full-bleed 390px, ≥44px touch targets,
   sheets ≤62vh, map never scrolls. Juice asymmetry is law — virtue gets the nod animation.
6. **Push to main — every iteration.** Commit with a clear message, push to `main`. Pages
   serves `main` root, so the push *is* the deploy to the live URL. Then tell the owner what
   changed and what to look at, so his reaction is informed.
7. **Log & prune.** Append a `CHANGELOG.md` line; tick the ROADMAP item to **Done**; add
   anything you discovered to the queue; prune ruthlessly.
8. **Owner-model upkeep.** Update the distillation below from this iteration's signal (see
   next section).

## The design is living — evolve the docs, don't just consume them

The spec files are not a frozen contract; they are the game's evolving memory. This skill
**edits the design docs** as the game grows, so the design and the build never drift apart:

- **`DESIGN.md`** — when an owner steer or a shipped iteration establishes a new ruling
  (a mechanic, an outcome, a tone call), write it in as a dated, numbered ruling. DESIGN.md
  is the canon that wins on conflict, so it must stay current.
- **`MVP-SPEC.md` / `CONVERSION-SPEC.md`** — refine numbers, presets, and beats as sweeps
  and playtests teach you what's actually fun/balanced; record the trim line you took.
- **`ROADMAP.md`** — the queue is yours to grow and prune every iteration.
- **`CHANGELOG.md`** — one line per iteration; the running history.

Rules of thumb: **the owner's word changes the design** (fold his steer into DESIGN.md and
quote him); a balance discovery changes the spec numbers; settled, working design isn't
re-litigated without a reason. When code and docs disagree, fix the disagreement — usually
by updating the doc to match the better idea, or the code to match the canon. Every design
edit ships in the same commit as the code it justifies, so the repo always explains itself.

## The Owner Model (living — this is the point)

The loop's deepest job is not shipping features — it is **modeling the owner's abstract
product sense** and evolving the game toward it. He steers in broad strokes mid-flight
("design the outcomes," "people should walk around and tinker") and trusts the loop to turn
those into systems. So **every owner message is data about the model**, not just a ticket.

**Maintain this model actively:**

- **On every owner interaction:** extract the abstraction behind the request and update the
  distillation below if it sharpened. Quote the owner **verbatim** where you can — his own
  words are the ground truth, not your paraphrase.
- **Every ~10 iterations (the flow reflection):** roll up what actually shipped vs. what he
  keeps reaching for. Ask "is the development *flow* the thing he wants?" — and **change the
  flow**, not just the backlog (e.g. he keeps asking for visual things → the
  `art.js` + `tools/gallery.html` path exists precisely so that loop is fast: that's the
  model working).
- **`OWNER:` lines exist to test the cheapest hypothesis.** Vetoes and silence are both
  signal. Track which predictions held.

**Current distillation** (update in place; date each line; owner's words are ground truth —
*verify these with the owner, reconstructed from a partial source*):

- **(2026-06-13) Thinks in PEOPLE and TRAJECTORIES**, not states that flip. "A scammer two
  years after graduation," talent honored by name — systems should *produce people* with
  arcs (the alumni lifecycle FSM is this made mechanical).
- **(2026-06-13) Wants satire ANCHORED IN THE REAL** — real exam questions, a historical
  pantheon, recognizable Vietnamese ed-tech absurdities — not generic parody.
- **(2026-06-13) FEEL-FIRST:** animation, graphics, music, liveliness — mechanical elegance
  that's *clever*. Polish and aliveness are features, not finishing touches.
- **(2026-06-13) Values ITERABILITY AS A PRODUCT** — refactor so graphics and mechanics are
  cheap to change *before* shipping more one-offs (the S1.5 art/content split, the gallery).
- **(2026-06-13) Wants to WATCH IT GROW remotely** — steers by reaction, not specification.
  Optimize for visible iteration over invisible internal progress.

## Two sessions — coordination (read this first)

A second session (the owner's Mac) is **actively designing** the canonical game on `main`
(`index.html` + the design docs). This web session must never fight it:

- **Develop on branch `claude/usage-d28v69`.** All iteration churn lives there.
- **Touch only `mvp/`.** This session's playable build is `mvp/index.html` (+ `mvp/` harness
  and notes). Never edit `index.html`, `DESIGN.md`, `ROADMAP.md`, `MVP-SPEC.md`,
  `CONVERSION-SPEC.md`, or any shared file — they belong to the other session.
- **Shared docs are READ-ONLY here.** Pull them each iteration to track the design, but
  record this build's decisions/log in `mvp/CHANGELOG.md`, not the shared docs. (This
  overrides "evolve the design docs" below *while the other session is active* — the design
  edits are theirs to make.)
- Always `git pull --rebase` before pushing. Because `mvp/` is disjoint from their files,
  rebases and the deploy stay conflict-free.

## Deploy

Two live links, one repo. Pages serves `main` root:
- Other session → **https://techeese.github.io/steve-job-vietnam/** (`index.html`)
- This session  → **https://techeese.github.io/steve-job-vietnam/mvp/** (`mvp/index.html`)

Deploy = copy just the `mvp/` folder onto `main` and push (never the rest of the branch):
run **`bash mvp/deploy.sh`** (gates-gate it, rebase main, `git checkout <devbranch> -- mvp/`,
commit, push, return to dev branch). The owner confirms visually; this environment can't
reach the live host, so **rely on the owner's eyes** for live confirmation and on `gate.sh`
for correctness.

## Gates (`gate.sh`)

Adapted for this cloud environment (no headless Chrome): node parse-checks every `<script>`
block, then loads the page under **jsdom** with a guarded/stubbed canvas and drives the
always-present `window.__test` hooks, asserting on `document.title` and the stable DOM
mirrors (`#moneyVal #yearVal #studentCount #tiengTamVal #uyTinVal #photRiskVal`).

- **GATE_FRESH:** boot `?seed=123` → place free room → `__test.days(400)` → title
  `GATE_FRESH MONEY=<finite> YEAR=2 STU=<n>`, no `JSERR`.
- **GATE_COMPAT:** seed a prior-version save → boot → HUD reflects it → `__test.days(30)`
  ticks clean (covers the save migrator).
- **GATE_BUILD:** `__test.place` on an occupied tile returns false and mutates nothing.
- Items may add gates (e.g. **GATE_ART:** every referenced sprite id exists).

The game must therefore render defensively: if `canvas.getContext('2d')` is null/stubbed,
skip drawing — all sim logic lives in the pure `dayTick(S, rnd)` and must run headless.

## Running the loop in this (web) environment

The original loop ran on the owner's Mac via a Stop hook + flag file
(`.improve-steve-on`). That doesn't port to an ephemeral web session. Equivalents here:

- **Manual:** invoke this skill once per iteration.
- **Recurring:** use the `/loop` skill to re-run on an interval.
- The container is ephemeral — **commit and push every iteration** or the work is lost.
