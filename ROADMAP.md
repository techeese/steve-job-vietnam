# Roadmap — Học viện Steve improvement loop

Ordered; the loop takes from the top. Add freely, prune ruthlessly.
Loop flag: `touch /Users/Admin/Desktop/coding/.improve-steve-on` · kill: `rm` same file.

> **🖥️ LOCAL-DEV + DEPLOY EVERY 10 ITERATIONS (owner directive 2026-06-14: "push to github.io after every
> 10 iteration").** Develop LOCAL on branch **`mentors-ledger`**; commit each iteration locally and **verify
> locally** (`node gate.js`/`./gate.sh`, `./bot.sh`, `node sweep.js`, `./shot.sh` for visuals). Do NOT push
> every iteration. **DEPLOY to the live Pages site every ~10 loop iterations** — tracked by `ITERS_SINCE_DEPLOY`
> in `## Cadence`: at **≥10**, that iteration ALSO goes live, then reset 0. Deploy recipe (`main` stays a strict
> fast-forward of `mentors-ledger`):
> `./bump.sh && git add -A && git commit -m "…" && git checkout main && git merge --ff-only mentors-ledger && git push && git checkout mentors-ledger`
> then verify the live URL (`curl` for a unique new string). FIRST deploy SHIPPED iter 117 (the whole backlog).

## Cadence
<!-- Step 0 READS this; it DICTATES the track (see SKILL.md "THE COUNTED CADENCE"). Update every ship. -->
- `SHIPS_SINCE_PERSONSIM: 1`    → **(PEOPLE-FIRST ARC) ≥1 ⇒ this firing HARD-LOCKS to a person-sim pick/epic (Compass 1/2); a non-person-sim pick is ILLEGAL.** Reset 0 only on a person-sim ship. The "graphics WINS" counter, repointed. (=1: iter-121 money/time legibility — general UX, owner-flagged, maturity-plateau safe value.)
- `SMALL_SHIPS_SINCE_EPIC: 3`   → **≥3 ⇒ EPIC owed — but DEFERRED (MATURITY-PLATEAU, iter 120-121).** The remaining person-sim epics are owner-gated/delicate: **E11** needs the owner's visual direction (D1–D3), the **craft-symmetry** fix is autonomously-intractable (upstream/admissions — wants owner playtesting, see [EVOLUTION] epic), **E4** is a delicate FSM/prose epic best done with owner feel-check. Per the iter-92 lesson, forcing one blind manufactures low-quality work — so shipping SAFE owner-flagged value (E15 legibility) + awaiting steer. The epic is OWED, not waived: take it the moment the owner re-engages.
- `EPICS_SINCE_STRUCTURE: 0`    → ≥2 ⇒ next epic must be STRUCTURE. (=0: iter-114 `sim/person.js` carve was the structure move — `growStudents` + creation extracted, behavior byte-identical. **Follow-up structure move available: the alumni FSM → `sim/person.js` too**, when next due.)
- `FIRINGS_SINCE_FRAME_RESET: 0` → **(EVOLUTION ENGINE) ≥12 ⇒ the next firing HARD-LOCKS to a frame-reset beat (run `./evolve.sh`, dequeue the `[EVOLUTION]` gap).** Reset 0 on a frame-reset. DORMANT behind the people-first arc — `SHIPS_SINCE_PERSONSIM` outranks it; the beat only fires once the arc has released OR a frame-reset is independently due AND no person-sim lock is active. (Engine wired 2026-06-14; see docs/EVOLUTION-ENGINE.md, `evolve.sh`, `critic-prompt.md`.)
- **★ PEOPLE-FIRST ARC ACTIVE (2026-06-14, owner course-correction).** The game's SOUL = the deep simulation of a person becoming themselves (talent × education → realized/wasted/distorted). Plateau rule SUSPENDED: the person-sim (E4–E6 below) IS the epic supply; "awaiting steer" is illegal as a reason to ship polish. Graphics/distribution/audio = production-broken-only. Arc releases only on a MEASURED gate + EXPLICIT owner confirm (see SKILL.md PEOPLE-FIRST MANDATE + VISION.md). **E2 match-model RESOLVED — the Mentor's Ledger soul-loop SHIPPED (E1+E2a+E2b+E3: grain↔preset `CONFIG.MATCH` coupling + scarce mentor attention + epilogue NAMES the waste; sweep L1 realize/waste/distort spread verified). The pause is LIFTED; next person-sim epic is E4.**
- `ITERS_SINCE_DEPLOY: 3`       → **(owner 2026-06-14: "push to github.io after every 10 iteration") ≥10 ⇒ DEPLOY (run the banner recipe), then reset 0.** +1 per loop iteration. (=3: +iter-121; first deploy was iter-117 → next deploy ≈ iter 127.) Note: the public push needs a DIRECT owner go OR a `Bash(git push origin main)` allow-rule (the classifier blocks a feedback.md-only authorization).
- `LAST_EPIC: iter 114 STRUCTURE — js/sim/person.js carve (growStudents + genStudent/genName/rollTell extracted from engine.js; behavior byte-identical: sweep+gate diff clean, bot BOTOK). De-risks E11. Prior: Art & Polish (Kenney+Jephed), Mentor's Ledger soul-loop.`
- `LAST_MAINTENANCE: iter 97 — CLEAN (sweep green, bot OK, perf clean, 390px audit clean).`

## Epic in progress
**E11 — Walk-in roofless rooms where activity earns development** (PLANNED iter 119; epic-locked turn). The
owner's vision: "bigger classrooms, not show the roof, people walk in and do stuff and earn development."
Phase 1 (NEXT) = a DIVERGENCE workflow for the room-interior look; building waits on the owner picking a
direction (SKILL: divergence + PLAN-FIRST for a major/visual feature). See `## Epic: E11` below.

> _(Recently shipped on `mentors-ledger`, now LIVE on github.io: Mentor's Ledger soul-loop (E1–E3), Art &
> Polish (Kenney+Jephed), the Evolution Engine beat, responsive desktop, and the iter-108→118 fixes.)_

## Epic: E11 — Walk-in roofless rooms where activity earns development
**Goal (one Bar-moving sentence):** turn key rooms into bigger TOP-DOWN INTERIORS (no roof) where students
walk in and do visible activities that CONTRIBUTE to their growth — so *watching the campus IS watching
development happen* (the living campus fused with the person-sim soul).

**Load-bearing decisions — OWNER, please confirm/redirect (I won't build the visual until you pick):**
- **D1 (visual direction):** how the roofless interior reads — pick via a DIVERGENCE workflow (3 options
  screenshotted at 390px) per the SKILL's #1-visual-dimension rule. *Default if silent: run the divergence
  and show you 3 to choose from.*
- **D2 (scope of rooms):** all rooms as interiors, or just the teaching/activity rooms (phòng học, xưởng,
  phòng máy, căng tin)? *Lean: the activity rooms first.*
- **D3 (activity→growth link):** the soul mechanic — a kid's per-period activity nudges its matching stat
  (study→kt, xưởng/đồ-án→tn/st, etc.), sweep-gated so it does NOT create a dominant strategy or break the
  realize/waste spread. *Lean: a SMALL per-activity nudge on top of the preset growth, capped, sweep-verified.*

**Phases (each ships a green checkpoint):**
1. **Divergence** — 3 room-interior visual prototypes → screenshot 390px + desktop → owner picks (or I judge).
2. **Render the interiors** — the chosen direction (no-roof, desks/benches, students visible inside) for the D2 rooms; mobile 390px + desktop verified; procedural fallback intact.
3. **Activity→growth link** (D3) — wire the per-period activity to a capped stat nudge in `js/sim/person.js` `growStudents`; **sweep-gate**: pluralism holds, no dominant strategy, realize/waste spread intact, 🍎 stays rare.
4. **Polish/juice** — the "doing stuff" reads delightfully (the owner's "love to watch").

**Verification:** screenshots READ at 390px + ~1280px (per `shot.sh`); `node sweep.js` bands hold (phase 3); `./gate.sh` + `./bot.sh` green. **Rollback:** branch `mentors-ledger`, one commit per phase, `git revert` per phase.
OWNER: this is the standout campus-life × soul epic from your feedback — confirm the direction (D1–D3) or steer; absent a steer, the loop runs phase-1 divergence next.

## Epic: Art & Polish + Responsive — ✅ SHIPPED (branch mentors-ledger, 2026-06-14)
**DONE:** Kenney Tiny Town tiles + buildings + props + Jephed characters (real pixel-art, procedural fallback
kept), responsive desktop side-by-side layout (`@media min-width:940px`), 390px gate held. Method frozen in
`docs/ART-PIPELINE.md` + `shot.sh`; verified mobile + desktop, gate green / bot BOTOK. (Plan detail below kept
for the record — migrate to CHANGELOG on the next hygiene pass.)
<!-- Owner-directed 2026-06-14 — OVERRIDES the arc's "graphics = production-broken-only" (the owner explicitly
     asked for the art/polish + works-on-PC pass). Built on branch `mentors-ledger`. Sourced from a Kairosoft
     art/polish DEEP-RESEARCH report (Derek Yu / SLYNYRD / MDN / "Juice It or Lose It" — transferable pixel-art
     FUNDAMENTALS, not Kairosoft-specific; one audio-juice claim refuted). Every technique is CODE-ONLY (no asset files). -->

**Goal (one Bar-moving sentence):** raise the game to "looks like a real cute game" (Pocket Academy bar) on
BOTH mobile (390px gate holds) AND PC, via code-only procedural craft — lifting BEAUTY + JUICE while the new
SOUL (Mentor's Ledger realize/waste) stays legible.

**Load-bearing decisions (owner answers 2026-06-14):**
- **D1 = SIDE-BY-SIDE map + panel on wide screens** (desktop-native; mobile stays stacked at the 390px gate). Two layouts via media query — keep them in sync.
- **D2 = KAIROSOFT-HYBRID** *(recommended; pending final owner nod)*. Pocket Academy does NOT use detailed faces — tiny chibis + personality via ANIMATION + EMOTE BUBBLES + per-role COLOR + names/data. So: keep the 24×32 crowd, add emote bubbles + livelier animation + per-role silhouette/palette, and a richer INSPECT-PANEL PORTRAIT for the few FOCUSED (mentored/followed) kids — deep bonding for the few (serves the thesis), Kairosoft charm for the crowd. NOT a full 32×40 redraw.
- **D3 = YES** — temporary visual regression allowed mid-overhaul; ship green rough checkpoints, endpoint clears the bar.

**Technique stack (research-backed, ranked by leverage):**
1. **Palette ramps** — HSB ramps: hue warm→highlight / cool→shadow, desaturate highlights (bright AND cohesive). `art.js` `ramp()` helper applied everywhere.
2. **Integer-crisp scaling** — native-res canvas + `imageSmoothingEnabled=false` + `image-rendering:pixelated` + integer scale (2× mobile / 3–4× desktop). The BRIDGE between polish and works-on-PC.
3. **Selout** — outline = 1 shade darker than neighbor, lighter top-lit, dropped at background; bakeable in the sprite generator.
4. **Expressive chibi** — big head/eyes, 2×2 pupil+highlight, eyes+mouth toggled for emotions (fixes the diagnosis's "faces 2px / never bond").
5. **Role silhouette + per-archetype palette** — coin-shark / maker / clerk read at a glance (reinforces the soul).
6. **Fake 2.5D + modular tiles** — 3/4 or iso geometry; tiles recombined via rotate/reflect/color-swap → distinct, lived-in rooms.
7. **Juice** — stacked squash/stretch + scale-on-impact + number-pops + damped wobble + particles on key interactions; **beware over-juice**.

**UI-rework call: YES** — responsive desktop layout (integer scale-up + D1). Mobile 390px stays the RELEASE GATE.

**Files (engine UNTOUCHED — pure visual/UI; sim, L1 sensor, gates unaffected):** `art.js` (ramp + selout + tile/building redraws), `sprites.js` (chibi proportions, expression variants, role silhouette/palette), `index.html` + `js/ui.js` (integer scaling, responsive CSS/media queries, desktop layout, juice in render loop), `data.js` (palette/juice CONFIG).

**Phases (each ships a green checkpoint on the branch):**
- **A — Foundation:** `ramp()` + integer-crisp scaling + selout. Biggest jump; lands desktop scaling. Verify 390px + desktop screenshots + gate/bot green.
- **B — Characters:** DIVERGE ≥3 directions → screenshot → judge → synthesize (SKILL law); expressive chibi + role silhouette/palette + `tools/gallery.html` re-render.
- **C — World depth:** fake 2.5D + modular tiles.
- **D — Juice pass:** interaction feedback (place room / mentor / graduate).
- **E — Responsive desktop layout** (D1) + confirm the 390px gate still passes.
  *(A and E are coupled via integer scaling — A lays it, E adds the desktop layout.)*

**Verification:** screenshots READ at 390px AND ~1280px; gallery re-render; `./gate.sh` green; `./bot.sh` BOTOK;
`node sweep.js` unaffected (engine untouched); score vs Bar rubric (BEAUTY+JUICE up, CLARITY holds, SOUL legible).

**Rollback:** branch `mentors-ledger`, one commit per phase, `git revert` per phase; nothing pushed.

**Risks:** over-juice → cap; bigger characters crowd 390px → mind density; palette overhaul clashes → apply
systematically + allow temp regression (D3); desktop layout breaks mobile → media-query-gate, keep 390px gate;
non-integer screen widths → use the largest integer scale that fits, letterbox the remainder.

## Epic backlog
<!-- Ranked; the epic turn DEQUEUES the top (respecting EPICS_SINCE_STRUCTURE). Keep full by mining VISION.md. -->
<!-- [EVOLUTION] entries are written here (at this marker) by ./evolve.sh — the input-blind critic's single biggest THESIS-anchored frame-reset gap. They carry an OWNER: veto line; the loop dequeues one on a frame-reset firing (FIRINGS_SINCE_FRAME_RESET ≥ threshold), respecting the people-first lock. Do not hand-author [EVOLUTION] entries — they must come from the blind critic. -->
<!-- EVOLUTION-INSERT -->
- **[EVOLUTION] The craft thesis fails nobody — đồ án is the implicit right answer** *(input-blind critic, 2026-06-14)* — THESIS §D mark §D-3 (no single right way) / §C-2 (symmetry of waste). **The jump:** Give the craft thesis its own failure mode — "lost in the open." Generalist students (tell="") who are mismatched with open-project learning (MATCH("","duan")=0.5) currently still land in LUONG_ON via the knowledge floor and ktOr gate, so craft never produces "tài năng bỏ phí." Make mismatched-tell students under craft visibly strand: lower the knowledge-accumulation safety net for craft-mismatch profiles, add a cascade pathway (or reweight LUONG_ON gate) so the structure-dependent student who enters a project school ends up thất nghiệp or quán quân văn mẫu at a non-trivial rate. The craft biography should sometimes show: "Nguyễn Văn X ★★★★★ — 🪪 Thất nghiệp — tài năng bỏ phí trên tay bạn" alongside the STEVE. Both theses then have grief AND triumph — the question stays open. **Wrong-hill:** no — the one-school microcosm is the right frame for §A's intimacy; the gap is mechanical, not dimensional **Evidence:** Sweep across 40 seeds: đồ án (craft) = 97% realized / 3% wasted / 0% distorted; sweep flags "invariant #2 broken." Biography (duan/seed=11): all four epilogue cast members realized or aspirational — no "tài năng bỏ phí trên tay bạn" line appears. Cross-preset read: luyende→coin/arrested/KY_SU/coin (grief fires); duan→STEVE/KY_SU/KY_SU/Founder-in-garage (only celebration fires). The cram thesis is the only one that produces "tài năng bỏ phí" grief; a player who discovers craft=97% realizes it is the correct educational philosophy, collapsing §B-1. Contrast: cram = 21% realized / 46% wasted / 33% distorted, 0% Steve. The asymmetry is not two equally defensible stances — it is one winner and one loser. (mark5=partially-measured — cross-preset divergence is real and dramatic, but the felt weight at fork-time requires uncertainty the player doesn't have once they discover craft dominates student outcomes, conf=high for the mechanical gap (sweep numbers are definitive and the sweep's own sensor flags §C-2 broken); medium for the §D-3 consequence (whether a real player discovers the dominance depends on playtime and information visibility, which a headless run cannot fully judge — same-model-class ceiling applies); full critique: /tmp/evolve-critic-2026-06-14.txt).
  OWNER: the input-blind critic proposes this as the next FRAME-RESET epic — veto if the current hill is right; silence = run it.
  - **➤ PROMOTED TO EPIC (iter 111 diagnosis — the MATCH knob CANNOT do it).** Tried `MATCH("","duan")` 0.5→0.25→0.15: craft waste only moved 3%→4%→6% (reverted). Root cause, confirmed by sweep: a generalist's `tn` SATURATES over a 4-year career regardless of the growth-RATE multiplier (`duan.tn=2 × g × days` overwhelms any ×MATCH), so they always clear `KY_SU(tn≥70)` or the `LUONG_ON(tn≥40 OR kt≥50)` net; and craft's stat profile (rising tn/st, low vet) DODGES the cá-mập/văn-mẫu waste gates, so the only waste path (THAT_NGHIEP: tn<40 AND kt<50) is unreachable by scaling growth. **The epic needs a STRUCTURAL mechanic, not a knob** — candidates (each sweep-verified, must NOT over-waste): (a) a seed-aware tn/kt CEILING for severe grain-mismatch (low-seed generalists cap below the realization floor → adrift; high-seed ones still make it — talent magnitude still matters); (b) a "structure-needer regresses in open projects" rule (kt drifts DOWN for `tell:""` under `duan`, so they fail the kt safety net); (c) a new cascade gate for the "adrift / no coherent direction" profile. SCOPE NOTE: `canbang` (balance) shares the same fails-nobody issue (97% realized) — the epic should give BOTH non-cram presets a real failure mode, or the dominance just moves from craft to balance. Build it in `growStudents`/CASCADE, sweep-gated: each non-cram preset reaches a real waste rate (~15-35%) without any strategy dominating 🍎+cash.
  - **➤ PARTIAL FIX SHIPPED (iter 116): the mismatch-adrift CEILING (candidate a).** `CONFIG.MISMATCH_CEIL` + a cap in `growStudents`/person.js: in a non-cram preset, a severe grain-mismatch (`MATCH < 0.7`) caps tn/st/kt at `11+seed*7` — modest talent goes ADRIFT (→ thất nghiệp), the gifted partly shine, and MENTORING rescues (it lifts mm above the floor → escapes the cap). Craft can now produce "tài năng bỏ phí"; the sweep's symmetry flag CLEARED (craft 3%→5% waste); 🍎 13% preserved, no dominance, cram/arrests unchanged, all bands hold. **STILL ONLY 5% though** — the deeper wall (confirmed iter 116): ADMISSIONS skews the cohort HIGH-SEED, so a seed-gated ceiling barely bites (few low-seed kids exist to waste). **Remaining work = a SEED-INDEPENDENT mismatch waste** so even a *gifted* structure-needer sometimes flounders in open projects (a probabilistic "lost in the open" stall, odds eased by seed but never zero), + give `canbang` its own mismatch (it has none — MATCH 1.0 for all). Then E15 can make the (now-real) preset trade-offs legible.
  - **➤ iter-120 attempt (seed-INDEPENDENT adrift roll) ALSO stalled at 5% → PARKED; the bottleneck is UPSTREAM, not the growth mechanic.** Tried a per-kid deterministic adrift roll (flatter ADRIFT_P 40-52%) — reverted. A probe revealed WHY all 4 attempts (knob · seed-ceiling · kt-cap · adrift-roll) hit the same ~5% craft waste: **the cohort that actually reaches craft is only ~27% generalist, NOT the 54% `rollTell` produces** (only ~6 of 48 live students are cap-eligible). So no in-`growStudents` mechanic that wastes the *mismatched generalist* can move the aggregate much — most craft alumni simply aren't generalists (they max `tn`→100→KY_SU). **The real fix is upstream: trace WHY the craft cohort skews non-generalist** (admissions pool tell-distribution? the prodigies? who realizes?) AND/OR rework the generous `LUONG_ON` net (`tn≥40 OR kt≥50` realizes almost anyone). This is a CASCADE/ADMISSIONS investigation, not a growth knob — **and it's delicate balance that wants OWNER PLAYTESTING of the resulting feel, not more headless knob-tuning.** The iter-116 ceiling stands (craft 5%, flag cleared) as the interim. STOP knob-tuning this; needs a deliberate epic with owner-in-the-loop.


### ★ PEOPLE-FIRST ARC — the person-simulation (talent × education → realize/waste/distort). These OUTRANK everything below until the owner releases the arc. Ship smallest-valuable-first; each sweep-verified before the next; each ships its own sweep extension.
- **E1 ✅ SHIPPED (Mentor's Ledger) — Realization sweep instrumentation + the vocabulary of waste** (tooling; ZERO-balance, ships FIRST). Add to `sweep.js`: a per-strategy **realization metric** (mean realized/potential over existing seed+tell+stats, no stored state), a **wasted-prodigy count** (high-seed→low-realized), a **waste-reachability** flag, and an **adaptive grain-matching STRAT** + a **dominance flag** (it must NOT beat the pure theses on 🍎+cash). + the `gate.js` pantheon-firewall lint. *Safe: pure tooling over current numbers, engine unchanged. Without it E2/E4 tune BLIND — this is the wedge that makes everything measurable.*
- **E2a ✅ SHIPPED (Decision #1 = grain↔preset) — Match-multiplier in growth — THE HEART** (mechanic; cascade + FSM FROZEN). Make `tell` a realize/waste multiplier in `growStudents`: with-grain grows toward the kid's `seed`-ceiling; against-grain grinds toward a lower personal ceiling (waste = *didn't grow*, latent — NOT "grew into clerk"). Do NOT touch `makeAlumnus.fs` or the cascade gates. *3 hard gates (E1-measured): no strategy nor the adaptive matcher dominates (whose-life-not-which-strategy); craft-🍎 stays >5% (seed gates 🍎 via aLua — an over-aggressive ceiling starves STEVE); văn-mẫu share rises ≤~10pts. Keep `seed` magnitude the dominant term. DIVERGE ≥3 designs.* **Blocked on OPEN DECISION #1: match = grain-vs-preset (lean) or grain-vs-major.**
- **E2b ✅ SHIPPED (epilogue names the waste) — The transformation read** (legibility; ships AFTER E2a's numbers are real). Surface each kid's *"đang thành chính mình" vs "đang nguội dần"* as CAUSED PROSE tied to a moment, generated FROM E2a's realized-vs-potential gap. NO number/bar, no 48-kid dashboard (invariants #3, #4). The SOUL-axis payload that makes the gap *felt*.
- **E3 ✅ SHIPPED (mentor slots + followed protégé) — The protégé / attachment loop.** Follow ONE named kid (reuse the prodigy slots Tú/Hà/Phát/Mai Sương) + a single **mentor** nudge (mood/match boost). CUT per-kid placement (stays systemic, or it's micromanage-48). UI-verified, not sweep-verified (say so). Makes E2's gap personal → the grief/cheer-BY-NAME bar.
- **E4 — Realization-aware destiny + carried gap.** `cascadeOutcome`/`makeAlumnus` reflect realized-vs-potential; the alumnus carries the unrealized gap into FSM lines + the epilogue (a NEW frozen `a.fs` field — do NOT overload `seed`, still the 🍎 gate). Re-verify: spread holds, high-realization is NOT a back-door 🍎 pipeline (🍎 stays rare + orthogonal). Epilogue counts realized kỹ sư/clerks as GOOD lives.
- **E5 — Discoverable talent** *(owner-gated, Decision #3)*. Talent revealed through teaching/events (extend `bacTamTiemNang`), not day-one-visible. No balance impact if it changes only info-timing.
- **E6 — Multi-axis aptitude vector** *(stretch, owner-gated, Decision #2)*. Replace single `tell` with a small per-axis profile. LAST + biggest tuning surface (likely forces a CASCADE re-tune, not just growth). Each axis re-swept for dominance.

#### ★ THE SCHOOL YOU SHAPE — texture the nurture levers (owner steer 2026-06-14; person-sim-serving, see VISION "The school you shape"). BINDING LAW: texture not gradient — horizontal expansion (more items, each a trade-off) only; NO upgrade chains; every item ships a wasted life in the epilogue; visibility ≠ accessibility; cohesion at OUTPUT not INPUT. Each ships its own sweep extension proving pluralism holds.
- **E7 — Content texture (HORIZONTAL).** Expand 3→~6-7 majors, 7→~15 named teachers, 3→a dozen prizes/awards — each a TRADE-OFF (realizes some grains, wastes others), NONE a strict upgrade. Candidate majors w/ their waste: Thương Mại (hype→hustler, wastes maker), Cơ Khí (vet→fitter, wastes dreamer), Điều Dưỡng (kt→reliable, wastes rebel), Giáo Dục (st→mentor, wastes solitary maker). Prizes stay PROSE tokens (a line in a life), never a sortable count. *Sweep: every new major reaches ≥1 realized AND ≥1 wasted life; cram dominates no major; no persistent prize-count state; pluralism holds on new-content-ONLY.*
- **E8 — Reputation-shaped teacher POOL (auto-attract, player still chooses).** Replace the hand-picked list with applicants who arrive by school standing — TT draws famous, UT trusted, TC substantive — each archetype a trade-off (prestige engineer realizes coders, neglects makers). High-tier = EXPENSIVE (affordability rises w/ reputation), NOT hard-unlocked; manual hire still legal; applicants as 1–2 quarterly cards, not a picker grid. *Sweep: per-strategy teacher-mix mirrors that strategy's waste profile; a weak-start school is not strictly doomed (no runaway spiral); a high-rep school still gets a MIXED pool.*
- **E9 — Cohesion at OUTPUT.** The school's standing/realized-outcomes change WHO applies (students + teachers) and what donors fund — output-only ripples (soft, ±1–2%); NEVER gate one system's unlock behind another's completion. Surfaces the depth-vs-breadth thesis (invest one khoa deep vs teach everyone). *Sweep: no dominant build-order; depth AND breadth both viable; ripples stay soft; person-sim still dominates outcomes (talent/preset/mentorship, not system-stacking).*
- **E10 — Early-game weight + visibility ≠ accessibility.** Cure "too much but too little": FEWER, DEEPER, more-consequential early decisions (one–two weighty philosophy forks, cut/merge shallow toggles), each consequential THIS year on real named kids. Reveal richer content as VISIBLE-PRICED-ASPIRATION (cost/prereq/endowment gates) + scope-gating (content appears with its room) — NOT mystery-hide; every thesis legible at boot. *QA: core fork present at founding; all theses visible at boot; gates structural not hidden; a year-1-only build is playable; no late-unlock strictly beats an early commitment.*

#### ★ OWNER-FLAGGED via feedback.md (iter 112) — campus-life + Jephed-integration consequences
- **E11 — Walk-in roofless rooms where activity EARNS development** (owner: "each classroom can be bigger, not show the roof, and people can walk in do stuff and earn development"). Render key rooms as bigger TOP-DOWN INTERIORS (no roof — see inside); students walk IN and do visible activities (study at desks, tinker at benches, eat) that CONTRIBUTE to their growth/realization. Ties the living campus (the soul's BODY) to the person-sim: watching = seeing development happen. Person-sim-serving (Compass 1/2 + campus-life). EPIC: needs a room-interior render mode + an activity→growth link in `growStudents`/the activity layer; sweep-gated (activity-growth must not create a dominant strategy; keep the realize/waste spread honest). DIVERGE the interior look (≥3) before converging.
- **E12 — Reconcile the inspect portrait + customization with the Jephed sprites** (owner: "the human icon and the character when clicking does not match"). The MAP now shows fixed Jephed sprites (`id%40`), but the inspect panel shows a CUSTOMIZABLE baked chibi (`iav` canvas + skin/hair/etc.) — so the portrait ≠ the on-map character, and customizing changes nothing on the map. **OWNER DESIGN Q (load-bearing, surface for confirm):** keep player customization (layer accessories ON the Jephed sprite, or let the player pick which Jephed sprite a kid uses) vs drop the chibi customizer for sprite-consistency? The "characters are customizable" north-star says keep it — so likely: portrait renders the kid's Jephed sprite + customization re-pointed to choosing/tinting the sprite. Until decided, at minimum render the Jephed sprite in `iav` so the portrait MATCHES the map.
- **E13 — Gender-matched names ↔ sprite** (owner: "names does not match how they look; gender should seem similar to what they represent"). Classify the 40 Jephed sheets by apparent gender; split the `nameParts.ten` pool into gendered sets; assign a name whose gender matches the kid's Jephed sprite (`id%40`). Content + a one-time sprite-gender classification; no balance impact (cosmetic identity).
- **E14 — Procedural character VARIETY from the 40 sheets** (owner: "clone the artwork to many people — change clothes colour, or head of one + body of another; but prioritize the original with higher probability"). Multiply apparent variety beyond 40: per-kid (a) clothes/hair PALETTE-SWAP (hue-shift a region of the Jephed frame on an offscreen canvas, cached per look), and (b) optional HEAD/BODY recombination across sheets (needs a clean head/body split-row in the 20×32 cell). **Weight strongly toward the unmodified original** (e.g. ~60% original, the rest light recolors, rare part-mixes) so the cast stays coherent, not a carnival. Cache each composed look (don't recompose per frame — perf). Natural home WITH E12 (the customization reconciliation) + E13 (gender) — together they're the "character identity" cluster: identity = {sprite, recolor, name, gender}, consistent between map and inspect. Owner-verified look; no balance impact.
- **E15 — Legible core trade-offs: time · money · tuition · learning-style** (owner iter-115: "not clear how time passes / how money accrues — financials positive but feels 0đ; no trade-off guideline for tuition; no trade-off guideline for the learning style each year"). Make the loops READABLE so choices have FELT weight (§D-5): (a) a clearer time read (a month is ~21s at 1× now — show the month progressing / what a "month" buys); (b) a money-model explainer (income = tuition×SV, minus Vận hành overhead + surplus-drain → why cash hovers instead of mooning; surface net/month plainly, and the endowment which is hidden <200tr); (c) tuition trade-off hint (higher tuition → fewer/weaker admits — show the tension, not just a number); (d) **learning-style (preset) trade-off hint — the PHILOSOPHY FORK made legible**: each style realizes some grains and wastes others (cram realizes the structure-needer, wastes the dreamer; craft the reverse) — this is person-sim-serving (a legible fork = the player FEELS the §B open-question choice). Pairs with E10 (early-game weight). Mostly UI/legibility; the preset-legibility part is the highest-soul. **(d) ✅ SHIPPED iter 118** — each preset now shows its trade-off line under the selector (`CONFIG.PRESETS[*].tradeoff`), the fork made legible. REMAINING: (a) time read · (b) money-model explainer · (c) tuition trade-off.
- **NEXT LIVE PERSON-SIM EPIC = E4** (E1/E2a/E2b/E3 shipped as the Mentor's Ledger), then E7–E11 (the "school you shape" + owner-flagged campus-life family; E11 is the standout — it fuses campus-life with development) + E5/E6/E12/E13. All person-sim-serving or owner-flagged; the EPIC turn dequeues the top, respecting EPICS_SINCE_STRUCTURE (next epic must be STRUCTURE = `sim/person.js`). The [EVOLUTION] craft-symmetry epic (above) is also live.
- **OPEN DECISIONS for the owner:** #1 ✅ RESOLVED — match = grain-vs-*preset* (`CONFIG.MATCH`, shipped); #2 talent single (seed+tell) or multi-axis (lean: single now, vector = E6); #3 hidden/discoverable/visible (lean: discoverable); #4 confirm prose-only, no potential bar (lean: yes); #5 protégé levers = mentor-nudge only, placement systemic.

### Pre-arc backlog (DEFERRED until the owner releases the people-first arc)
1. ~~[FEATURE] Character art step-change~~ SHIPPED iter 59 (owner-picked Direction C: premium 24×32 volumetric chibis with separated arms, expressive faces, contact shadows).
2. ~~[FEATURE] Weather + time-of-day lighting~~ — time-of-day SHIPPED iter 62 (day-arc + golden hour); **weather SHIPPED iter 77** (god-ray sunbeams + gentle drizzle, cosmetic overlay). Could deepen later: actor reactions (umbrellas / scurrying under awnings), a rare heavier storm. OWNER may veto/redirect the aesthetic.
3. ~~[FEATURE] Festivals (Tết petals + June confetti)~~ SHIPPED iter 63. ~~Scandal-day reaction~~ SHIPPED iter 67 (a TV news-van camps at the cổng when phốt pile up — phại choices made visible). Could deepen later (gathered onlooker crowd, a gloomy banner).
4. ~~[FEATURE] Player-customizable students~~ SHIPPED iter 66 — per-axis look customizer (skin/hair/style/accessory + 🎲) in the inspect card, on-demand cached bake, persisted via optional `s.lookC`.
5. **[FEATURE] Generative campus-lofi BGM**, state-aware (term / Tết / June / scandal). Atmosphere (Area 12).
6. ~~[FEATURE] Shareable end-card~~ SHIPPED iter 68 — a gold canvas summary card atop the epilogue (school, đề Văn, the player's answer icon+verdict, stats, share footer).
7. **[FEATURE/tune] Map-scale harmony** — if the new 24×32 characters read too big vs buildings, bump TILE / zoom so the world feels proportionate. Decide on owner reaction.
8. **[STRUCTURE] ui.js → `screens.js`** — extract the panels+modals DOM layer via a shared-UI-context object. High-coupling (`el` 200×, bidirectional) — a real refactor, not a leaf. **DEFERRED until the people-first arc releases** (this arc the STRUCTURE epic is `sim/person.js` instead — see the arc block). Do it when ui.js strains or as a deliberate invisible-velocity epic post-arc. (iter 73/92 review)

## Frame-reset log
<!-- The Evolution Engine's slow-beat ledger. ./evolve.sh appends one line per frame-reset: the input-blind
     critic's verdict (a THESIS-anchored GAP, or "frame holds"). Newest at the top under the marker. This is the
     decay/evolution audit trail — a long run of "frame holds" means the loop is genuinely at the frontier; a GAP
     means the current hill was wrong and an [EVOLUTION] epic was queued. -->
<!-- FRAME-RESET-LOG -->
- 2026-06-14 — GAP · The craft thesis fails nobody — đồ án is the implicit right answer · §D mark §D-3 (no single right way) / §C-2 (symmetry of waste) · mark5=partially-measured — cross-preset divergence is real and dramatic, but the felt weight at fork-time requires uncertainty the player doesn't have once they discover craft dominates student outcomes · conf=high for the mechanical gap (sweep numbers are definitive and the sweep's own sensor flags §C-2 broken); medium for the §D-3 consequence (whether a real player discovers the dominance depends on playtime and information visibility, which a headless run cannot fully judge — same-model-class ceiling applies)

## Debt
<!-- Paid down by STRUCTURE-epics; the ~10-firing reflection must show this trending DOWN. -->
- [x] `window.onerror` production trap — RESTORED iter 56 (inline first script: JSERR title + gentle reload banner; gate-verified). _(Already earned its keep: caught a `tapFx` leak during the iter-57 refactor.)_
- [x] art layer extracted to `js/art.js` iter 57 — ui.js 1694→1393; pixel-art is now an isolated, behavior-neutral module (static-canvas hash identical before/after). `content.js` deemed unneeded (text already lives in `data.js` CONTENT).
- [ ] (low priority) ui.js still 1393 — fine for now; further split is backlog #7 if it grows.

## Now

★ **Khoa / Majors system — SHIPPED** (iters 49–55; full detail in CHANGELOG): auto-join by tell,
synergy + cross-khoa synergy, trưởng-khoa heads, and the three signature campus activities
(Lập trình→`code`, Thiết kế→`craft`, Sống Ảo→`stream`). Sweep confirms the destiny thesis held.
Remaining ideas (POLISH-sized — pick when they clear the rubric floor): khoa-vs-khoa rivalry/events;
khoa-gated facilities; a dedicated Khoa screen if the card outgrows itself; a khoa-tinted badge on the
sprite (read a major while a student walks); a crowd around the Sống Ảo streamer; the trưởng-khoa
visibly present in their room.

★ **Balance follow-ups (queue):** (1) ~~Uy Tín erosion~~ NOT A BUG (iter 35 check): the sweep shows
UT is a working moral meter — honest (cân bằng) keeps UT ~43, cram sits ~18; my iter-34 audit's
UT=1 was a single harsh-cram endpoint, not systemic. Gardens' one-time +5 is thematically right
(you can't monument away how you run the school). Leave as-is. (2) **Late-game money** still
inflates (~2344–2655tr); gardens are a sink only if the player builds them — the sweep (fixed
strategy) still flags it. Proper fix = S4 spend channels / scaling costs.

★★★ **THREE OWNER DIRECTIVES (2026-06-13) — top priority:**
- ~~**(A) START FROM NOTHING, build up**~~ **SHIPPED (iter 24).** Boot = empty lot: 0 rooms,
  0 students, 1 founding teacher, 200tr pot with an origin story (viral đề-Văn answer → cắm sổ
  đỏ + 50tr vốn mồi). Tháng-6 boot → July founding intake → Mai Sương is enrollee #1; empty
  Junes roll the year silently (foundingJune); first real graduation ~Year 5. TPL re-homed as a
  shadow alumnus (scripted Y2-M3 arrest preserved). GATE_FRESH + sweep band updated, all green.
  *Follow-ups:* ~~milestone nudges~~ SHIPPED (iter 28: "Cột mốc" founding-goal banner walks the
  player build→intake→teacher→spec-room→grow→firstgrad). Still open: the early years could use
  more *mid-build texture*: ~~founding-specific events~~ SHIPPED (iter 32: 3-event founding deck —
  parent inspection / dạy-tủ temptation / sell-the-name). Still open: a visible "first đồ-án" beat,
  a cheaper-but-paid first room for a real spend decision; late-game money still inflates (~2635tr, sweep
  flag) — start-from-nothing made the surplus sink weaker, S4 spend channels needed.
  ~~văn-mẫu unreachable~~ FIXED (iter 30: rote exam-champions become 📋 Quán Quân Văn Mẫu instead
  of failing into thất-nghiệp; cram → ~60% văn-mẫu / ~10% cá-mập→bị-bắt; craft thesis intact).
- ~~**(B) Students walk IN from outside**~~ **SHIPPED (iter 25).** Each new matriculant spawns
  just outside the cổng (below the map at the gate's x) and walks up the central path to their
  spot; a whole intake files in as a staggered procession with a "!" welcome bubble. Boot/reload
  places the existing roster in place. *Follow-ups:* ~~walk-OUT on graduation~~ SHIPPED (iter 29:
  grads file out the cổng before being dropped). Still open: a gather-at-cổng cluster on
  khai-giảng day before they disperse; tune the column spacing if a 12-strong intake feels long.
- ~~**(C) "3D but still pixel"** for houses AND people~~ **SHIPPED (iters 26–27).** Buildings
  render as extruded 3D blocks (dark side+roof depth, directional shadow, lit top/left edges);
  characters re-baked with upper-left light + lower-right shade (rounded faces/torsos, 2-tone
  shirt shadow, shaded arm/leg/hair). All three owner directives (A/B/C) now done. *Optional
  polish, queue if owner wants more:* push building depth further (a true receding side-wall
  face vs the current solid extrusion), and a `tools/gallery.html` promoting the `__ui._bakeSheet`
  hook to a real phone-reviewable sprite/building gallery. ~~Seasonal Tết décor~~ SHIPPED (iter 31:
  bunting + lanterns + blossom pots in Tháng 1–2 via `drawSeason()`). Next season candidates:
  ~~June graduation flair~~ SHIPPED (iter 36: red carpet + tossed
  mortarboard caps + academic bunting in Tháng 6). Next season candidates: a falling-petal live
  layer during Tết, graduating actors wearing caps during June, a subtle seasonal sky/grass tint.

0. **★ GRAPHICS — standing #1 lever (owner: "this game is more important in graphic"):**
   SHIPPED v2 detailed pixel-art (owner-chosen direction): baked sprite atlas (faced chibis),
   bright daytime palette, detailed bright buildings, crisp discipline — a real step-change from
   the rejected dark Sơn Mài. KEEP ITERATING on owner reaction until they say it looks great.
   Next polish candidates: cuter/more-expressive faces (blink, idle), more building props
   (signboards, flowers, fences, banners), seasonal tint (Tết/June), shadow/light passes, a
   `tools/gallery.html` to review every sprite/building on the phone, and bigger-tile/zoom if
   detail still feels cramped at 26px. Use the `frontend-design` plugin for any HTML/CSS chrome.
1. **S1.5 — Workshop refactor, CHUNKED (architecture for iterability, owner priority):** the
   one-directional dep (ui→art→globals) makes this clean, but do it in SMALL safe moves, each
   a behavior-neutral iteration proven by before/after 390px screenshots + gates (a 350-line
   single-file split in one autonomous shot is the risky way — owner away to catch regressions):
   (1a) extract the campus-life layer (period clock, buildRings, assignActivity, drawActivity,
   drawSanBall) into `art.js`; (1b) extract the Sơn Mài renderer (drawStatic/drawRoom/drawActor
   + ROOM_STYLE + prop drawers + helpers) into `art.js`, expose `ART.*`, rewire ui.js refs;
   (1c) `tools/gallery.html` rendering every room/sprite/activity for phone review + GATE_ART.
   Optionally (1d) split CONTENT→`content.js`. Each sub-step ships green or reverts.
4. **Background music v1 (owner directive):** generative WebAudio campus-lofi — gentle
   pentatonic loop, state-aware layers (normal term / Tết flavor / June ceremony swell /
   scandal undertone), 🎵 toggle persisted in META, autoplay-unlock on first interaction.
5. **S2 — Admissions depth** (per CONVERSION-SPEC §10): histogram polish if trimmed, ảo +
   đợt bổ sung, tuyển thẳng strip, đặc-cách/«Hồ sơ 16,5 điểm» merged card, học-bạ-đẹp
   ticker, iSteve mid-run exposé.
6. **S3 — Alumni full:** remaining 7 states (TRUONG_PHONG/GIAM_DOC/XUAT_NGOAI/KOL/VE_QUE/
   GIANG_VIEN/QUAY_DAU), world years, Sổ filters + gratitude tiers, 20/11 envelope
   sprites, ~~the "Mười năm sau…" epilogue~~ SHIPPED (iter 38: auto-fires the reflective essay as a
   decade capstone at RUN_CAP_YEARS; follow-ups — a "where are they now" FSM fast-forward before it,
   a formal end-screen vs the current keep-playing sandbox), "Mời cựu SV về nói chuyện" verb.
7. **S4 — Funding full:** contract types 🦜🎣🤝, renewal escalation, decks T/E/C, Quỹ Ứng Cứu.
8. **S5/S6 — Pantheon pack + content:** ~~dedications~~ STARTED (iter 33: 3 buildable Vườn Tưởng
   Niệm memorial gardens — now FIVE: Trần Đại Nghĩa / Tạ Quang Bửu / Hồ Xuân Hương + iter 39's
   Nguyễn Trường Tộ / Chu Văn An — +Uy Tín, dedication modal, on-campus stele; a late-game cash
   sink + "honour the whole grove" goal). Next: Giải
   Giọng Riêng + Lễ Vinh Danh (trimmed), remaining 6 scholarships with pipeline effects,
   living-archetype event deck, uni teacher archetypes, khoa split.

## Recurring
- Maintenance sprint every ~5th iteration (sweep, bot, full 390px audit, perf).
- Mobile audit even when nothing changed.
- Code-structure review every ~10th iteration (owner directive) — verdict lands in
  `## Architecture` below; queue at most one behavior-neutral refactor.

## Architecture (structure-review log)
- *(2026-06-14, iter 92 review — rigorous review-that-DEFERS)* Sizes: data.js 548 · engine.js 1187 · **art.js
  411 · sprites.js 171 · audio.js 79** · ui.js **1675** · index.html 268. **Verdict: HEALTHY; DEFER the last
  split.** Layer law holds (engine's only `window.` is the guarded HVS export; the bake layer art.js+sprites.js
  is clean & one-directional). ui.js (1675) is the hotspot but **WORKABLE** (+~140 lines over 7 iters — not
  straining). The ONLY remaining extraction — panels/modals → `screens.js` — is **bidirectionally coupled**
  (`renderPanel` 12× · `checkModals` 10× · `syncActors` 11× · `openModal` 14× · `el` 205×, woven through every
  cluster): a shared-UI-context refactor, **not a clean leaf** (the iter-84 sprites split took the last clean
  one). **Deferred because:** (a) low marginal value (ui.js isn't straining); (b) high autonomous risk —
  bidirectional, and modal-flow regressions are hard to fully verify headlessly (bot.sh clears pendings); (c)
  owner away ~18 firings (landmine: prefer safe-additive over risky-refactor when away). **Anti-timidity guard
  SATISFIED:** real epics already shipped (sprites-structure 84 · Cúp Khoa 80 · social-life 88) + the clean
  extraction; what's left is genuinely the hard/low-value one, which iter-73 already classed "owner-OK'd,
  not urgent." Do it only when ui.js genuinely strains OR the owner OKs an invisible-velocity epic. This review
  DISCHARGES the structure duty. **Meta:** at this maturity + owner-absence, real epics (this split; the
  taste-blocked feature epics) need owner steer — the loop should keep shipping safe value/completeness/
  maintenance and await steer for the next true epic, not force a risky/make-work one.
- *(2026-06-14, iter 84 review + STRUCTURE epic)* Sizes: data.js 525 · engine.js 1187 · **art.js 411 ·
  sprites.js 171 · audio.js 79** · ui.js **1534** · index.html 268 (~3907). **Verdict: HEALTHY; visual
  layer now WHOLE.** The iter-73 review called ui.js's panels/modals "no clean leaf" — true, but it MISSED
  a clean leaf hiding in plain sight: the **character sprite bakery** (left behind by the iter-57 art.js
  split). Extracted it VERBATIM to `js/sprites.js` (window.SPRITES) this firing — a pure one-directional
  factory (ui → sprites), like art/audio. ui.js 1690→1534. **Proof: baked-sprite pixel hash byte-identical
  (2075002228) + gate green + bot.sh BOTOK + customizer verified.** Layer law still clean (engine 0 DOM;
  bake layer = art.js+sprites.js; text in data.js). **Remaining hotspot: ui.js (1534)** — the panels/modals
  → `screens.js` split is still *available* (backlog) but NOT urgent: it's coupling not size, and size just
  dropped. Do it only if ui.js strains again or the owner OKs an invisible-velocity epic. This review +
  epic DISCHARGE the EPICS_SINCE_STRUCTURE duty. **Flow reflection (74–84, all autonomous):** counted
  cadence + bot.sh + divergence-when-needed is working; the gap is fresh owner taste — all inference since BGM.
- *(2026-06-13, iter 73 review)* Sizes: data.js 499 · engine.js 1123 · **art.js 411 · audio.js 74** ·
  ui.js **1565** · index.html 267 (~3939). **Verdict: HEALTHY.** One-directional layering (data → engine
  → art/audio → ui) holds CLEAN: engine.js has 0 DOM refs; art.js/audio.js don't reach into game logic.
  The leaf modules (art, audio) split cleanly. **Hotspot: ui.js (1565).** Its one remaining big cluster —
  the panels/modals DOM layer (~550 lines) — is HIGH-COUPLING: ~25 distinct closure symbols (`el` 146×,
  `esc` 37×, `S` 29×, + render/openModal/checkModals/buyRoom/syncActors/… ) and it's BIDIRECTIONAL (ui
  calls into it too). So extracting it is a real refactor (a shared-UI-context object that ui populates +
  `screens.js` aliases, ~15 ui-side call-site rewrites), NOT a clean leaf. **Queued `## Epic backlog`:
  STRUCTURE — ui.js → `screens.js` (panels+modals) via a shared-UI context.** Do it when ui.js genuinely
  strains or as a deliberate owner-OK'd invisible-velocity epic; not urgent (1565 is workable). This
  review DISCHARGES the EPICS_SINCE_STRUCTURE duty (reset; see the refined cadence rule in SKILL.md).
- *(2026-06-13, iter 32 review)* Sizes: data.js 408 · engine.js 1007 · ui.js **1334** · index.html
  235 (~2984 total). The one-directional layering (ui→engine→data) is still CLEAN and has held
  through 12 feature iterations — no leaks, gates green throughout. Hotspot remains **ui.js (1334,
  +130 since iter 20)**: art renderer + campus-life + ambient + seasonal + customization + HUD +
  panels + modals + sound + test hooks. engine.js crossed 1000 but is cohesive (sim/june/admissions/
  alumni/funding/events/milestones). **Verdict: still very workable; no refactor forced this
  iteration.** Now SCHEDULED as `## Epic backlog` #1 (a STRUCTURE-epic — worktree + behavior-neutral
  diff, ships autonomously; no longer waits on an "owner OK for an invisible iteration" — that hedge is
  exactly why it never shipped): the **art.js extraction** — note the real coupling cost (PX palette, `shade`,
  `roundRect`, `mb`, `hashId` are shared by BOTH the static-art drawers AND bakeChar/drawActor, so a
  clean split must move shared helpers to art.js and expose them; the static layer is fully
  screenshot-verifiable, the rAF actor layer is NOT — extract static-art first, actors later).
- *(2026-06-13, iter 53)* **Actor layer is NOW screenshot-verifiable** — `liveLoop` split into
  `stepLive`/`drawLive` + `__ui._renderLiveOnce(period)` paints one live frame on demand (recipe in
  the skill Step 3.4). The "rAF actor layer is NOT verifiable" caveat above/below is superseded for
  TESTING (the architectural coupling note still stands). Every campus-liveliness iteration must now
  screenshot the walking campus, not ship blind.
- *(2026-06-13, S1 ship)* Layering clean at birth: `js/data.js` (CONFIG numbers + CONTENT
  text, zero logic/DOM) · `js/engine.js` (state/sim/June/admissions/alumni/funding, DOM-free,
  node-testable) · `js/ui.js` (all render/canvas/modals, reads via HVS/__test, owns no
  numbers) · `index.html` (shell). engine.js ~940 lines, ui.js ~925 (grew with the Sơn Mài
  art renderer + campus-life day-clock) — BOTH now over the ~900 split threshold. S1.5 art.js
  extraction is now the priority refactor: pull the art renderer (drawStatic/drawRoom/
  drawActor + ROOM_STYLE + prop drawers) AND the campus-life layer (period clock, buildRings,
  assignActivity, drawActivity) into `art.js`, leaving ui.js as HUD/panels/modals. Then plan
  engine.js module-split (sim/june/admissions/alumni/funding) for when alumni S3 + funding S4 land.

## Flow reflection (iter 60 — the loop-redesign checkpoint)
**The redesign WORKED — measurably.** iters 49–55 were 7 straight small additive ships (Khoa phases,
single activities, tooling) = the timidity the owner diagnosed. After the mid-session LOOP REDESIGN
(Mission + two tracks + counted `## Cadence` + EPIC machinery + Bar gate + divergence-by-workflow +
self-correction/prune/failure-detection), iters 56–59 delivered **2 epics + a debt-paydown + 1
owner-polish**: onerror restored (56), the art.js extraction deferred 35 iters finally shipped (57),
build badge (58), and the premium 24×32 character art step-change (59). Debt is trending DOWN (2 of 3
closed). The counted cadence hard-lock is what flipped it — soft "shoulds" had failed 7×; state +
counters made bold the path of least resistance.
**Validated flow:** divergence-workflow → owner-picks-from-concrete-options → integrate-with-proof
(used for the character art) is the owner's steer-by-reaction sweet spot — he engaged eagerly and chose
the BOLDEST option (Direction C, accepting its rescale cost). Keep using it for all #1-dimension work.
**Health:** cadence counters firing correctly; the restored onerror trap already caught a real
regression (the iter-57 tapFx leak); no drift; the loop is bold and self-correcting. **No flow change
needed** — hold course; next visible swings are weather/lighting + the rest of the Epic backlog.

## Flow reflection (iter 40, maintenance + checkpoint)
40 iterations shipped (~30 autonomously, still zero vetoes). Since iter 20 the game went from a
populated-school MVP to a **complete arc**: found-from-nothing → milestone-guided build-up →
visible walk-in/walk-out at the cổng → 3D-but-pixel houses+people → seasonal Tết & graduation
décor → the văn-mẫu destiny made reachable (the đề's thematic heart) → memorial gardens to five
real reformers → the "Mười năm sau" decade capstone. All three owner directives (A/B/C) done, plus
the owner's mobile-UX asks (selection marker, tap ripple, reset button) and the critical
cache/save-staleness fix (bumped SAVE_KEY v3 + build stamp). **Maintenance verdict (iter 40):**
sweep clean (only the late-game money-inflation flag, an S4 job), a 13-year all-systems playthrough
runs error-free with solid v3 save/load and ~33ms/run perf, and the ops/Trường panels pass the
390px audit. No regressions. **Standing flow risk unchanged:** `js/ui.js` (now 1693 lines) — the
`art.js` extraction is the top structural debt, now SCHEDULED as `## Epic backlog` #1 (ships
autonomously via the STRUCTURE-epic machinery; the actor layer is now screenshot-verifiable via
`_renderLiveOnce`, so the old "can't verify actors" blocker is gone). Remaining content depth =
S2 admissions / S3 alumni / S4 funding / S5 pantheon, none blocking.

## Flow reflection (iter 20, ~10-iteration checkpoint)
The dev flow is serving the owner: 20 iterations shipped, ~15 autonomously (decide→ship→veto,
no vetoes), the north-star ("sunny lively watchable school") resolves design forks cleanly,
and `sweep.js` turned balance from guesswork into 3 data-driven fixes (now all-clear). Look +
gameplay both strong. ONE flow risk: **`js/ui.js` is now 1203 lines** (art + campus-life +
ambient + customization + HUD + panels + modals + sound + epilogue) — velocity will degrade.
**The S1.5 `art.js` extraction is now the top structural priority** — scheduled as `## Epic backlog`
#1, a STRUCTURE-epic that ships autonomously (worktree + behavior-neutral before/after diff).

## Gameplay balance — findings from `node sweep.js` (2026-06-13)
The sweep (40 seeds × 5 strategies × 11y) flags real stagnation to fix (own iterations;
re-run sweep before+after each change). Good news: economy Y1 net +12tr (in band), 0%
bankrupt, and the THESIS HOLDS — đồ-án/craft yields a 🍎 in ~43% of runs + 69% kỹ sư, while
cram/default settle into lương-ổn. Problems:
- **Tiếng Tăm collapses to ~1** (decays −1/mo, nothing sustains it) → admissions pool shrinks,
  the hype meter is dead weight, half the moral tension is inert. Needs TT sources (stunts,
  contracts, viral defenses, events) that actually keep it alive across a run.
- **Money inflates to ~2788tr end-game** — no spend sink/pressure. Needs sinks (Quỹ Ứng Cứu,
  dedications, scaling salaries/maintenance, more to build) so cash stays a real constraint.
- ~~Tiếng Tăm collapse~~ FIXED (iter 16): TT_FLOOR = 10+0.25×UT, decays/recovers toward it.
- ~~CA_MAP_COIN ≈ 0%~~ FIXED (iter 17): decoupled cm growth from the vet drag + lowered the
  gate (cm≥52∧tn≤45∧vet≥50) → cá-mập now fires ~2% and the dark arc works (sharks → BI_BAT).
- ~~Money inflates~~ FIXED (iter 18): surplus above CASH_KEEP(300) reinvested 3%/mo → end
  cash ~1,012tr (was 2,800), Y1 net still +12.3 in band. Visible as a funding-panel line.
- **SWEEP NOW CLEAN** (iter 18): all flags clear. Confirmed contrast — HONEST cân-bằng school
  keeps TT 13 / UT 9 / TC 63 (healthy), cram-leaning default TT 8 / UT 3 (consequence). Thesis
  holds under simulation. Remaining polish (not flagged, lower priority): the cram DEFAULT
  config is rough for a brand-new player (could ship a gentler preset default); proper spend
  channels (scholarships drawing cash, Quỹ Ứng Cứu — S4) would beat the blunt cash-drain sink.

## Salvaged from the retired /mvp/ build (worth keeping)
- **Phốt risk meter:** a visible indicator of accumulated mầm-phốt danger (we track
  photSeeds silently) — surface it so the player feels the gamble building. (UI, small.)
- **Export/import save string:** copy-save-to-clipboard for sharing/backup a run. (Nice-to-have.)
- Otherwise /mvp/ was the older 3-grade spec (superseded by v2); nothing else to salvage.

## Parked
(empty — interaction-model question resolved: tabs + tap-the-world, shipping as Now item 0)

## Done (see CHANGELOG.md)
- **Background music v1 (loop iter 3)** — state-aware generative campus-lofi (pad/pluck/bass),
  moods: normal / Tết / June-swell / scandal-undertone; 🎵 toggle persisted; autoplay-unlock.
- **The Player's Answer epilogue (loop iter 2)** — "Bản nháp bài luận của hiệu trưởng": the
  open-question law (DESIGN §1) as a pull-only mirror modal. 8 branch voices + empty guard;
  reflects the player's own school, crosses out every verdict, ends on the đề hanging.
  Follow-up: a balance pass proving no single dominant strategy (so every essay branch is
  genuinely reachable), and a "Mười năm sau…" run-end FSM fast-forward (DESIGN §S3).
- **Campus life v1 (loop iter 1)** — 5-period real-time day clock routes students to room
  door-rings to study/eat/tinker/play-ball/zzz; đồ-án-mode Năm-4→Xưởng; shared Sân ball;
  tell-driven (sky daydreams, hype performs, spark sparks). Pure view layer. Follow-ups
  (campus-life v2): celebrate-after-June confetti, gather-at-cổng for tân SV in Tháng 9,
  more activity variety, tune walk speed if 16s feels tight for cross-map treks.
- **Campus art overhaul (Sơn Mài Diorama)** — lacquer-night ground, gold-framed fake-iso
  pavilions (6 distinct room types), lamplit windows, richer chibi, seeded props.
  Synthesized via explore→judge→synthesize art-direction workflow.
- **Tap-the-world inspect** + **/mvp/ retired** (root v2 canonical).
- **S1 MVP shipped** — multi-file build, full sim/June/admissions/alumni/funding, 5 gates
  green, 390px verified, live link flipped from placeholder to playable.
- Design v2 (university edition, 17 canonical rulings) + CONVERSION-SPEC.
- Repo + Pages live; loop infrastructure (skill + Stop hook).
