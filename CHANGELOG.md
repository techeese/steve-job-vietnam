# Changelog

## 2026-06-22 — Phase 2c CP3b: the wrong-major WILT beat (off-native waste, named) (loop iter 270)
**The soul of off-native intake: "right gift, wrong major" is now FELT, not just mechanical.** Added `wrongMajorBeat()`
(monthly, after fullLedgerBeat) — when an OPEN-DOOR off-native grain (seed≥4, grade≥2, in a khoa where MAJOR_FIT<1) is
nguội-ing (mood < FAV_MOOD_LOW), it names the kid + the wrong khoa: *"🧩 {tên} — đứa nói hay bán giỏi mà kẹt ở Khoa Lập
trình — sai sân chơi, nó nguội thấy rõ."* (`CONTENT.wrongMajor`, tell-keyed; `{khoa}` = the mismatched khoa name).
Deterministic, news-only, own throttle `WRONGMAJOR_BEAT_GAP=120`. Only fires when off-native grains exist (open-door)
→ headless default ("native") never triggers it → byte-identical: gate + BASELINE GREEN, sweep 0 flags, bot BOTOK
(essay 3380 / cash 7610), lives clean. Probe: fires 18×/8yr under open-door + only-code-khoa built. Apex untouched.
Deployed. CP3c (next, small): surface `intakePolicy` in the Gameplay Lab (a selector, per the dynamic-Lab mandate).

## 2026-06-22 — Phase 2c CP3a: the intake-rule DIAL (off-native intake now reachable by players) (loop iter 269)
**The open-door policy gets a control — the off-native mechanic (CP2c) is now PLAYABLE, not just code-settable.** Added a
"Tuyển sinh — xếp khoa" segmented toggle to panelOps (right under the teaching dial), mirroring the existing MODE/STRUCTURE
seg pattern (functional wiring of a shipped mechanic — within the graphics freeze): **Đúng khoa** (fit-priority — an
un-built-khoa grain waits idle, no wrong-fit cramming) ↔ **Mở cửa** (open-door — no one idle, but off-khoa grains learn a
trade that doesn't fit → MAJOR_FIT bites). Each option shows its open-question tradeoff line (`CONFIG.INTAKE_META`, mirroring
the preset/structure tradeoffs — neither rule dominant). Verified: parse clean, ALL GATES GREEN + BASELINE GREEN (UI-only →
no sim change → byte-identical), bot BOTOK (the ops panel renders the toggle, no JSERR; essay 3380 / cash 7610), lives clean,
probe confirms the toggle sets `S.intakePolicy`. Deployed. **CP3b (next): surface the policy in the Gameplay Lab (a selector,
per the dynamic-Lab mandate) + the wrong-major WILT narrative beat (name a grain nguội-ing off-native).**

## 2026-06-22 — Phase 2c CP2c: off-native intake goes LIVE — "right gift, wrong major" in play (loop iter 268)
**The keystone of the greenlit epic lands: a grain can now be wasted in the wrong major DURING A RUN, not just in the
sweep sensor.** Reworked `assignMajors` to the clean opt-in design (dropping the default-nerf flat-cap idea, iter-267):
under the **"native"** default a grain whose khoa isn't built sits IDLE (no major — exactly pre-Phase-2c → byte-identical);
under **"open"** (open-door) that grain is crammed into the best-fit BUILT specialty, else the Đại-cương generalist track
(`placeOffNative`) — ACTIVE but wrong-fit, so MAJOR_FIT bites. The lever is the player's BUILD + POLICY: afford every khoa
→ everyone native; run a lean campus + open the door → grains land off-native and waste (thematically the poor/frugal
school that can't offer every specialty). Probe (build only the code khoa + open-door): **11 hustlers crammed into the
code khoa** (MAJOR_FIT 0.7 bites), the rest to Đại-cương, zero idle — vs "native" leaving 25 idle. New sweep INTAKE sensor
(+`strat.intakePolicy` in `play()`): **✓ bounded LIVE tradeoff — specialist grains realize 89% active-off-native vs 81%
idle, Δ8.1, neither policy dominates.** Verified: ALL GATES GREEN + BASELINE GREEN (native default → byte-identical, replay
holds — resolver is deterministic, no rng), sweep **0 bad flags**, bot byte-identical, lives clean ×2. Apex untouched.
Deployed. **CP3 (next): the intake-rule UI toggle (fit-priority ↔ open-door) + the wrong-major wilt narrative beat.**

## 2026-06-22 — Phase 2c CP2b design resolved (investigative): opt-in volume-vs-fit, not a default nerf (loop iter 267)
**Probed the seat-scarcity dynamics and resolved the design before building — avoiding two traps.** Occupancy probe: the
specialist khoas accumulate to **25–27** at peak across a run (much bigger than the ~6–12 I'd estimated; they pool grains
across all 4 grades). Impact probe (flat cap under the DEFAULT "native" policy): cap 22 → realize 43%→41% + ~5% fewer
alumni; cap 18 → 38% + ~12% fewer; cap 14 → 32%. So a biting flat cap is **a default-policy nerf with no player agency**
(the off-native grains both waste AND burn out → fewer grads), and it would permanently make the shipped default game more
wasteful — over-reach for "bounded." TRAP 2: a *generous* cap (≥27) never bites → inert. **Resolved design (CP2c build
next): the OPT-IN tradeoff.** Keep "native" the byte-identical default (cap off → no recapture). Make **"open"** a genuine
*volume-vs-fit* choice — open-door raises the admission quota (a bigger cohort = more tuition + more gem-shots) while the
specialist khoas cap → the overflow lands off-native (MAJOR_FIT bites = the waste cost). Non-inert (volume upside),
non-dominant (waste cost), byte-identical default. Needs quota-mult tuning + a sweep STRAT/sensor (open trades realize for
scale, neither policy dominates) — done next firing with fresh attention, not rushed here. CP2a machinery stays shipped;
live game unchanged. Doc-only.

## 2026-06-22 — Phase 2c CP2a: the seat-scarcity intake resolver (byte-identical machinery) (loop iter 266)
**The deterministic off-native placement machinery, shipped byte-identical.** `assignMajors()` (monthly, idempotent) places
each grain into a khoa seat: native khoa first (up to `CONFIG.MAJOR_CAP` seats on the specialist khoas code/make/biz; Đại-cương
room-less + uncapped = the catch-all home); when the native khoa is FULL it overflows off-native — under **"native"**
(fit-priority) to the gentle Đại-cương generalist track, under **"open"** (open-door) into the best-fit BUILT specialty with a
free seat (real stat-growth, but MAJOR_FIT bites). Stores `s.major` (CP1). DETERMINISTIC — stable student order by id,
occupancy counted live, NO rng → replay byte-identical. At the shipped **MAJOR_CAP=99 nothing overflows → every grain native
→ byte-identical**: gate + BASELINE GREEN, bot byte-identical (essay 3380 / cash 7610 / arrested 15), lives clean. Probe (forced
cap=6, 3 khoa rooms): overflow fires correctly — native-policy pushes overflow sparks/hypes to Đại-cương, open-policy packs
specialties harder (28 vs 20 off-native). Apex untouched.
**CP2b (next) — the design + tuning:** lower MAJOR_CAP to a biting value so an era-flood of one tell overflows the khoa under
the DEFAULT "native" policy (the emergent era×scarcity→wrong-major dynamic — recapture + a new off-native-wastes / no-dominant
sweep sensor). The "open" policy needs an UPSIDE to be non-inert (it currently yields strictly more waste) — resolve in CP2b/CP3.

## 2026-06-22 — Phase 2c CP1: stored-`s.major` intake architecture (byte-identical foundation) (loop iter 265)
**First checkpoint of the greenlit off-native-intake epic — the byte-identical foundation that lets a grain sit in a
NON-native khoa.** Until now a student's major was DERIVED dynamically (`studentMajor` = the khoa matching their tell,
once its room exists). Added a STORED override: `studentMajor` now reads `s.major` (a khoa key, room-gated) before the
native derivation — so the open-door resolver (CP2) can place a coder into the Sống-Ảo khoa and have MAJOR_FIT bite live
("right gift, wrong major" wastes for real). Plus `S.intakePolicy` ("native" | "open", default `CONFIG.INTAKE_DEFAULT`
= "native") + freshState + two sanitize guards (policy whitelist; drop a corrupt/stale `s.major` → native fallback).
**Nothing sets `s.major` yet → byte-identical**: gate + BASELINE GREEN, bot byte-identical (essay 3380 / cash 7610 /
arrested 15), lives clean. Probe confirms the stored path works end-to-end (a forced `s.major="biz"` is read + room-gated;
MAJOR_FIT(spark,biz)=0.6 < 1 → the wrong-major penalty would bite). Apex mechanism untouched (apex = as-is). Deployed.
Next: CP2 — major capacity (seat scarcity) + the deterministic open-door resolver that sets `s.major` off-native.

## 2026-06-22 — APEX FORK RESOLVED (owner: "keep 🍎 as-is") → plateau lifted, Phase 2c greenlit (loop iter 264)
**The owner answered the keystone decision** (via a formal AskUserQuestion after the 3-scout plateau): **"Keep 🍎 as-is."**
The apex stays grain × era × luck (THESIS still frozen — NO apex teeth), and the remaining systems are built **bounded
NON-apex**. This discharges the iter-262 scout-confirmed plateau (which was conditional on this fork being unanswered).
**Re-oriented the loop** (SKILL + ROADMAP): the buildable keystone is now **Phase 2c — off-native major INTAKE**, the
architecture-heavy mechanic where the MAJOR_FIT lever (built iter-247, robustified iter-258) finally BITES in live play —
"right gift, wrong major" wastes a kid for real, not just in the sweep sensor. Phase-3 activities (đội-tuyển / internship)
stay SHELVED — their non-apex versions were proven inert/dominant (iters 251-252). Planned the epic as determinism-safe
checkpoints in ROADMAP: CP1 (byte-identical: stored `s.major` + `S.intakePolicy` state) → CP2 (major capacity + the
open-door off-native resolver, deterministic from seed0) → CP3 (intake UI + a new off-native-wastes/no-dominant sweep
sensor + the wrong-major wilt narrative). The scripted-prodigy / apex mechanism stays UNTOUCHED (apex = as-is). Doc-only
this firing (decision capture + re-orientation); CP1 builds next, with full byte-identical + replay verification.

## 2026-06-22 — Gameplay Lab made DYNAMIC again: surfaces this session's in-play beats (loop iter 263)
**Closed a real Lab gap the scouts didn't cover (they audited game mechanics, not the owner's tooling).** The SKILL
mandates keeping the Gameplay Lab dynamic — surfacing each new system so the owner can SEE what changed — but the 6
systems shipped this session left the in-play layer invisible there: the Lab read the final capstone essay (so the
capstone beats showed) but never the IN-PLAY news stream, where the marquee **era-boundary layer** (🌊 eraFlood / 〽️
eraShock / 🕰️ era-shift) and the **full-ledger grief** (🖐️) actually fire. Added a `news()` hook in the Lab's
`simulate()` that captures those marquee beats per year, and a new card — "Diễn biến trong trận — các nhịp kể
(era-boundary · đời)" — that renders them. Now the owner can READ, in the Lab, the prose the new systems emit across a
run (e.g. *"🌊 Dạo này đứa nào tới ghi danh cũng hỏi trước tiên là trường có máy không…"*, *"🕰️ Thời dot-com — Thế giới
lên mạng…"*), not just the endgame essay. Verified: lab.sh syntax ok, headless LAB_OK, the card populates with real
era-boundary beats across an 11-yr canbang run; gate + BASELINE GREEN (lab.sh is a dev/owner tool, not in the live
build → no deploy). Tooling/visibility, non-gated, zero game-state change.

## 2026-06-22 — third scout returns a CONFIRMED PLATEAU (0/18) — non-gated surface mined out (loop iter 262)
**The evidence-backed plateau, reached honestly after THREE scout fan-outs — not asserted from intuition (iter-202's
mistake).** Ran a third, sharpened scout (high bar, aimed at the deepest under-mined veins: deeper event dilemmas,
person-sim turning-points/agency, mechanical lattice gaps, replay/economy decisions, balance/correctness), explicitly
empowered to return a plateau. Result: **0 survivors / 18 candidates rejected** by the adversarial filter — every idea was
redundant with a shipped system (cohortBeat/fullLedger/protégé/mentor-scarcity/equalizer/era-layer), apex-gated (the
prestige-vs-cash squeeze, progression unlocks), prose-not-meter (visible pivot/threshold signals = a meter), or
false-premise (mismatch-early-warning can't fire until the gated Phase-2c intake exists). The three scouts together: iter-254
→ 4 shipped (equalizer/era-journey/full-ledger/cram-event), iter-259 → 4 incl. the mentor-save bugfix + the era-boundary
layer + capstone đề-frame, iter-262 → nothing genuine remains.
**Verdict: the non-gated / non-redundant / non-apex surface is MINED OUT.** Per the updated SKILL (SCOUT-CONFIRMED PLATEAU),
the loop now HOLDS — this is the legitimate iter-230 completion-plateau, proven by adversarial search. The sole unblock is the
owner's **APEX fork** (should activities / seat-scarcity shape the 🍎 — i/ii/iii). Re-scout only when something real changes
(owner steer, a new system, the apex-fork answered, or a long idle gap) — not every firing. Doc-only; no code change; live build unchanged.

## 2026-06-22 — the localized đề-Văn at the capstone open (scout v2 #4 — queue fully delivered) (loop iter 261)
**The capstone climax now answers the question the RUN actually began with.** The essay opened with a generic intro, but
each archetype carries its OWN đề-Văn (`CONFIG.ARCHETYPES[].de`) — the situated question shown at the run's start — and it
never returned at the climax. Added `CONTENT.essay.archFrame{tinh_le,que_ngheo,lo_thanhpho,truong_nghe}`: one reverent,
still-open situated question per archetype, appended right after the capstone intro (keyed by `s.archetype`). The poor-village
school closes on *"đứa sáng dạ nhất làng — đời nó rẽ ở chỗ có một bàn tay chịu chống lưng, hay không có ai?"*; the cram-lò on
*"cả thành phố đổ tiền vào luyện thi đến thế, mà sao một Steve Jobs vẫn chưa lớn lên nổi giữa lòng phố?"* Each mirrors its
`de` (harmonized, not duplicated) and stays a question, never a verdict (open-question law). Authored solo, then an adversarial
prose critic passed all 4 + flagged 2 register tweaks (tinh_le → purely interrogative; lo_thanhpho → less flippant/more
aching), both applied. Reading-only → gate + BASELINE GREEN (byte-identical), bot BOTOK (essay 3247→3380), lives clean, probe:
archFrame renders for all 4 archetypes. Deployed.
**Scout v2 queue (iter-259 fan-out) FULLY DELIVERED: #1+#2 era-boundary layer ✓ (260), #3 mentor-save bugfix ✓ (259),
#4 capstone đề-frame ✓ (261).** Per SCOUT-BEFORE-YOU-HOLD, the next non-gated step is a fresh scout; big remaining work stays apex-gated.

## 2026-06-22 — the ERA-BOUNDARY narrative layer: the lattice felt in prose at every decade turn (loop iter 260)
**Scout v2 #1+#2, shipped together as one coherent layer — authored via a 6-agent draft→critic workflow.** The ERA×ARCHETYPE
lattice (the spine of the game) re-weights which gifts the world realizes, but the decade TURNS read thinly — `eraShift()`
fired only a generic name+shift line. Now each boundary lands two new beats, in the headmaster's voice:
- **🌊 eraFlood (5 lines, one per era)** — who now walks in the gate: the gift the new decade floods the *intake* with
  (era-true to `ERAS[].fav` — scarcity→maker hands, đổi-mới→hustler tongue, dotcom→screen/coder, smartphone→clout/be-seen,
  AI→builders who won't let the machine do it for them). The world changing the cohort, felt.
- **〽️ eraShock (15 sparse cells across 4 archetypes)** — the archetype's THESIS colliding with the era's reweighting, the
  ache: the vocational school whose hand-craft the dotcom/smartphone decades stop wanting (then, in the AI era, *the one
  thing the machine can't fake* — vindication after decades at the back); the city cram-lò hearing its flawless-rote model
  reproduced by a machine for free ("tôi ngồi nghe cái lò của mình nguội dần"); the poor-village maker whose one favored
  decade (scarcity) still slips by for lack of a backer.
Built by a Workflow: 5 parallel drafters (one per archetype + an era-flood drafter) → an adversarial law/voice critic that
de-templated, enforced prose-not-meter / no-Ministry-sarcasm / no-Pantheon / no-shift-line-duplication / era+archetype-truth,
and kept the table SPARSE (cut cram-lò×smartphone as smug vindication, etc.). News-only, deterministic from `S.year` +
`S.archetype` → replay-safe. Verified: parse clean, gate + BASELINE GREEN (byte-identical), bot BOTOK, lives clean, probe:
floods fire 3×/run + shocks fire exactly as the sparse table designs across all 4 archetypes. Deployed. **Scout v2 queue:
#1+#2 ✓ (this), #3 ✓ (iter-259); remaining: #4 archetype-framed capstone intro.**

## 2026-06-22 — BUGFIX: late-game saves silently un-mentored kids (a fresh-scout find) (loop iter 259)
**A v2 scout fan-out surfaced a real save/reload correctness bug I'd never have found by holding — the exact payoff of
SCOUT-BEFORE-YOU-HOLD.** `sanitize()` (js/save.js:98) capped the mentored-student count at the BASE `CONFIG.MENTOR_SLOTS`
(3), ignoring the era-scaled `mentorSlots()` (= base + `techReach(S.year)`, which reaches 4–5 in the later decades). So
reloading a LATE-GAME save where the player had mentored 4+ kids (legal under the era cap) silently dropped the extras to
3 — quietly un-doing the player's scarce-attention choices, the game's central lever. One-line fix: cap by `mentorSlots()`
(S.year is already restored+clamped earlier in sanitize) instead of the base constant. Added a permanent GATE_SAVE
regression assertion (force year-11 era cap 4, mentor to it, reload → all 4 survive; the old code kept only 3). Verified:
parse clean, gate ALL GREEN incl. the new assertion (kept 4/4), BASELINE GREEN + bot BOTOK + lives clean (byte-identical —
the headless harnesses never mentor, so they never tripped the bug). Deployed.
**Scout v2 (this firing) — 4 survivors, 14 rejected.** Shipped the bug (#3, highest-priority/correctness). Queued the 3
narrative survivors in ROADMAP: cohort-intake era-flood line, archetype×era era-shock beats, archetype-framed capstone
intro. (The synth stage hit a StructuredOutput retry-loop; I stopped it and read the survivors straight from the verify
agents — the workflow's value was the finding, not the synth prose.)

## 2026-06-22 — scout #4 SHIPPED: the cram-pressure dilemma, unblocked by a MAJOR_FIT robustify (loop iter 258)
**Completed the deferred scout #4 by fixing its blocker first.** Two coupled changes:
1. **MAJOR_FIT robustify (the unblock, byte-identical).** The "wrong-major wastes" sensor's MAKER case was latently
   marginal (makers are nearly major-insensitive) — any new live event's deck-noise tipped it negative (iter-257). Root
   fix: the biz khoa is **Khoa Khởi nghiệp (Sống Ảo)** — the clout/hustle track — so a craft-kid shoved there *should*
   clearly waste. Lowered its off-native fit (spark 0.7→0.6, sky 0.7→0.55). This deepens "right-gift-wrong-major is a real
   fate" AND makes the sensor robust. Off-diagonal fits are read ONLY via `MAJOR_OVERRIDE` (the sensor) — never live until
   Phase-2c off-native intake — so **zero live impact / byte-identical** (gate + BASELINE GREEN unchanged by this edit).
2. **The cram-pressure DILEMMA (the ship).** The 31-event deck never touched the new TEACHING DIAL; now the đề-Văn's
   cram-culture pressure is a player choice: parents demand you drill like the lò luyện ngoài kia — **cave** (tighten the
   upper grades to Khuôn: `S.struct.n3/n4="high"`, +5 Tiếng Tăm, −2 Uy Tín, −2 mood — the world bending your pedagogy,
   reversible via the dial) or **hold** (+3 Uy Tín, −3 Tiếng Tăm, Bác Tâm nods). Non-apex (structure → mood; meters).
Verified: parse clean, **sweep 0 bad flags** (MAJOR_FIT now ✓ WITH the event live: maker make 75% vs biz 72% Δ3.3, coder
Δ15.2), baseline RECAPTURED (new event perturbs the deck — intentional), gate + BASELINE GREEN, bot BOTOK (cash 7610 /
arrested 15 — shifted from 7479/13, confirming the event fires), lives 0 LIVESFAIL ×2 presets, probe: fires 4×/11yrs,
cave→n4 high. Deployed. **Scout queue (iter-254) now fully delivered: #1–#4 all shipped.**

## 2026-06-22 — scout #4 (lattice event dilemma) ATTEMPTED → deferred; scout queue closed (loop iter 257)
**Negative result, honestly recorded.** Built scout candidate #4 — a cram-culture pressure DILEMMA (the đề-Văn's satire
target) wired to the STRUCTURE dial (cave → tighten the upper grades + reputation/integrity tradeoff). The mechanics
worked (cave→struct high ✓, hold neutral ✓), and it's non-apex. But: (1) caught + fixed a dead-pred bug (`grow20` isn't
an `eventPred` case → used `hasNam4`); (2) once live, the new event perturbs the `maybeEvent` deck enough to tip the
PRE-EXISTING marginal MAJOR_FIT **maker** sensor (was Δ3.4 at iter-247 — makers are nearly major-insensitive; the event's
noise flipped it to Δ-2.3). Shipping it cleanly would require re-tuning a live system (strengthen sky's off-native
biz-fit, ~sensor-only) + a double baseline recapture — not worth it for the lowest-value scout item. **Reverted clean**
(gate + BASELINE GREEN, sweep 0 flags, repo at iter-256); no code shipped this firing. **Scout queue (iter-254) now
closed: #1 equalizer beat ✓, #2 era-journey ✓, #3 full-ledger ✓ shipped; #4 deferred** (known fix path: make
MAJOR_FIT-maker robust first, then any new event can ship). Next non-gated work needs a FRESH scout (the iter-254 queue
is processed); the big remaining work stays apex-gated (owner's call).

## 2026-06-22 — the FULL-LEDGER grief beat: the tragic allocation, proactively (scout queue #3) (loop iter 256)
**Third scout-queue candidate shipped.** The scarce-attention tragedy (you can mentor only a few; the rest you must let
go) was felt only REACTIVELY — a toast when you click a full mentor button. Now it's PROACTIVE: once your ledger is full
AND a strong gift (seed≥4, grade≥2) is wilting unrescued (mm < MISMATCH_MM, mood < FAV_MOOD_LOW), a once-a-season-ish
ticker beat names the kid your maxed hands are costing you — *"🖐️ {tên} — máu khởi nghiệp ấy đang trượt sang ăn xổi —
tôi muốn uốn, mà tay đã kín cả."* (tell-keyed + `_` fallback; deterministic line pick). `fullLedgerBeat()` in
`monthRollover` after `cohortBeat` (own throttle `FULL_BEAT_GAP=130`, rarer than the cohort glimpse so it stays weighty).
**Only fires once the player has FILLED the ledger** → headless harnesses (which don't mentor) never trigger it →
byte-identical. Verified: parse clean, gate + BASELINE GREEN, bot BOTOK (essay 3369 unchanged — no beat without
mentoring), lives 0 LIVESFAIL, probe confirms it fires 5×/8yrs under a kept-full ledger naming the wilting gift. Deployed.
Scout queue remaining: #4 lattice-wired event dilemmas (the design-care one).

## 2026-06-22 — the SCHOOL's era-journey named at the capstone close (scout queue #2) (loop iter 255)
**Second scout-queue candidate shipped — the loop producing genuine non-gated value, as intended.** A run spans ~4
decades (12yr / 3yr-bands: bao-cấp 1990s → Đổi-Mới → dot-com → smartphone), and the era already shapes every gift's
ceiling + the per-kid "wrong-era" grief — but the CAPSTONE close was era-agnostic (`s.letters[].era` stored yet dead in
the essay). Added one reading-only beat before the "Tôi—" close naming the founding→closing decade: *"Ngày tôi mở cổng
trường, ngoài kia hãy còn là Thời bao cấp (199x); hôm nay tiễn lứa này ra đời, đã là Thời smartphone. Cùng một mái
trường, mà thế giới ngoài kia thay da đổi thịt mấy bận — đứa khoá đầu với đứa khoá cuối, gần như sinh ra ở hai thời khác
nhau."* Fires only when the founding decade ≠ the closing one (a sub-3-year run gets nothing); no era counts (§C-3
prose). Verified: parse clean, gate + BASELINE GREEN (reading-only → sim byte-identical), bot BOTOK (essay 3108→3369),
lives 0 LIVESFAIL, probe confirms from→to. Deployed. Scout queue remaining: #3 mentor-slots-full grief beat, #4
lattice-wired event dilemmas (ROADMAP).

## 2026-06-22 — the SCHOOL-AS-EQUALIZER beat at the capstone close (scout broke a false plateau) (loop iter 254)
**A 28-agent scout fan-out DISPROVED my "plateau" — found 4 genuine non-gated candidates I'd wrongly concluded didn't
exist (the iter-202 lesson, again: when I think nothing's left, a real search proves me wrong).** Built the top pick:
the đề-Văn's *truest question* — the school as class-EQUALIZER (mentoring lifts the poor toward parity, MODEL.md
§ORIGIN×MENTORSHIP) — plays for 12 years but read INVISIBLY at the climax. Added one aggregate prose beat before the
"Tôi—" close (`epilogue.js`, after the "Còn lại trong sổ" reflection) keyed on the **class GAP** (poor vs rest realize),
with an absolute floor so equal-failure ≠ "equalized": **success** (the poor kept pace — *"mấy suất tôi dồn sức kèm đã
kéo được các em qua khỏi chỗ mình sinh ra… đã làm được cái bậc thang"*), **shortfall** (the poor lagged/sank — *"không
đủ tay để kéo hết… chưa thành được cái bậc thang"*), **mixed** (*"mới bắc được một nửa"*). Prose-not-meter (no counts),
both poles, fires only on a meaningful poor minority + enough non-poor to compare (gated off for well-off cohorts).
Probe-verified true to the model: back-the-poor → success (canbang poor 86% vs rest 88% = the parity finding); leave them
→ shortfall (62% vs 86% = the class gap); cram-all-sank → shortfall (floor guard). Reading-only → gate + BASELINE GREEN
(byte-identical), sweep 0 flags, bot BOTOK (essay 2893→3108), lives 0 LIVESFAIL. Deployed.
**SELF-CORRECTION:** I held ~7 firings on an assumed plateau before scouting — too conservative (iter-202's exact
mistake). Recorded in SKILL: before concluding a plateau / holding repeatedly, RUN A SCOUT FAN-OUT first. The scout's
other 3 survivors (era-journey close beat, mentor-slots-full grief beat, lattice-wired event dilemmas) are queued in ROADMAP.

## 2026-06-22 — the STRUCTURE dial echoes in the writing (narrative legibility) (loop iter 253)
**A non-gated pivot that closes a real gap: the player's headline new agency — the 2-axis teaching DIAL — had no echo
in the marquee writing.** The annual letters already mirror the player's MODE choice (cram/craft/balance, iter-211);
now they also mirror the **STRUCTURE** choice. On a strong lean the headmaster reflects on how tightly he governs the
day — Khuôn: *"tôi kèm các em sát quá chăng — đứa cần khuôn thì nên người, còn đứa cần một khoảng trời riêng, có khi
tôi bóp nghẹt mất"*; Mở: *"tôi để các em khá tự do — đứa tự bay thì bay cao, còn đứa cần một bàn tay cầm lái lại loay
hoay mãi"*. Appended to the stored letter, so the **capstone re-read** reflects it too (owner-fork #2: weave the new
levers into the writing implicitly). Deterministic, news-only, **byte-identical at the neutral `Vừa` default** (clause
fires only on a Khuôn/Mở lean: probe 0 at default, 11 each under high/low). Non-apex — pure narrative legibility of an
already-shipped mechanic. Verified: parse clean, gate GREEN + BASELINE GREEN, bot BOTOK 7479/87/13, probe confirms the
clause fires on a lean only. Deployed. (Pivoted here after proving Phase 3 activities are apex-gated, iters 251–252 —
this is genuine non-gated value, not filler: the central new system now felt in the soul/writing.)

## 2026-06-22 — Phase 3 internship ATTEMPTED → reverted (2nd apex-gate confirmation); loop holds (loop iter 252)
**Second negative result, recorded so neither activity is re-attempted.** After đội-tuyển (iter-251) I tried the OTHER
review activity — **THỰC TẬP (internships)**: +applied tn / −creative st for upper grades, opt-in default-off. Sweep
proved it ISN'T the clean non-apex tradeoff I hoped: +tn converts even makers into employable **technicians** (maker
realize 70→85%, a buff), while the real *cost* is the dulled creativity/**apex** (st) — and the everyman was already at
ceiling (81%→81%). So internship's true tradeoff is **applied-realize vs the 🍎**, i.e. thesis-adjacent again; the
non-apex version is a near-free realize buff (non-plural). Reverted clean (gate + BASELINE GREEN, repo at iter-251).
**Both Phase-3 activities now empirically confirm the same gate: the interesting tradeoff IS the genius/🍎 cost** — which
is frozen + owner-gated. I'm stopping Phase-3 attempts (further variants only re-prove it) and **holding** at this
frontier until the owner answers the APEX fork (should activities/seats shape the 🍎 ceiling — i/ii/iii). The live
build remains the complete EDUCATION delivery (Phases 0/1/2a/2b + everyman voice/home). No code change shipped.

## 2026-06-22 — Phase 3 đội-tuyển ATTEMPTED → reverted; the frontier is EMPIRICALLY thesis-gated (loop iter 251)
**A negative result, recorded so it isn't re-attempted.** Built Phase 3 ckpt1 (Đội tuyển — an opt-in competition team:
groom the top gifted → +mood/FLOW, at the cost of a mentor slot + mild strain on the sidelined), default-OFF so
byte-identical. The sweep sensor + a direct probe **proved it doesn't work as a non-thesis lever** and I reverted it
clean (gate + BASELINE GREEN, repo at iter-250):
- the gifted already realize ~88–92% (a **ceiling**) → grooming them for more *realization* has no headroom (sensor: team
  realize 88→84%, INERT/worse);
- **peer-contagion** (iter-241) drags the strained cohort mean back onto the team, *cancelling* the member boost;
- their only real headroom is the **apex (🍎)** — which is grain/era-gated by `stevePShort` (probe: apex 9→9%, mood-immune).
**This empirically confirms the plateau finding:** both remaining big EDUCATION pieces — Phase 3 activities (đội-tuyển's
real lever = apex) and Phase 2c off-native intake (who overflows / how scarce = a feel call) — have a **thesis-adjacent
core (the 🍎 / what makes a Steve)** that is FROZEN + owner-gated. I tried, the sweep proved it, I didn't ship filler.
**The decision is the owner's: the L4-style APEX fork** — should activities/seats/tech be allowed to shape the 🍎
ceiling (and how)? Until then the EDUCATION epic's high-value *solo* work is complete (Phases 0/1/2a/2b + the everyman
voice + home, all live + Lab-surfaced).

## 2026-06-22 — everyman in-play voice (small) + SOLO-PLATEAU reached on the EDUCATION epic (loop iter 250)
**A small completion + an honest finding.** Gave the everyman (`tell=""`) dedicated `cohortBloom`/`cohortWilt` in-play
glimpse lines (sharper than the generic `_`: "vững dần đều — kiểu người ta tin giao việc" / "chẳng có nghề nào ngấm vào
tay — cứ trôi"). While doing it I found the `cohortBeat` BENT pole only selects spark/sky, so a `cohortBent[""]` would
be **dead content** — removed it rather than ship clutter (and the bloom/wilt `""` lines fire only rarely, since the beat
glimpses the most-dramatic kid, usually a grain — kept as a correct sharper fallback, not overstated). Byte-identical
(gate BASELINE GREEN, bot 7479/87/13). **PLATEAU FINDING:** the EDUCATION epic's high-value *solo-buildable* work is
DONE (Phase 0 baseline harness · Phase 1 the 2-axis dial · everyman voice + home · Phase 2a MAJOR_FIT). The remaining
pieces are genuine **design-FEEL forks that want the owner's steer**, verified this firing: **(2c)** systemic off-native
intake — done well it needs an architecture-heavy capacity/intake resolver AND a feel call (how scarce should specialist
seats be?); done cheap it's a niche lever. **(Phase 3)** activities + attention-hours — the review's #1 agency fix, but a
new save-stateful subsystem + a "how scarce is attention?" feel call. **(1c)** cram-distortion map — largely redundant
(cram→văn-mẫu/shark already happens + prose already tell-specific). Not manufacturing filler; surfacing the fork.

## 2026-06-22 — GAMEPLAY LAB updated: surface the EDUCATION-epic systems (loop iter 249)
**Paying down the dynamic-Lab debt** — I shipped 5 EDUCATION-epic systems (iters 243–248: the STRUCTURE dial, the
everyman voice, MAJOR_FIT, Khoa Đại cương) without surfacing any in the Gameplay Lab (the owner's graphics-free window,
which the SKILL mandates I keep current). Now the Lab reads them: a **Lối học (structure)** selector (Mở/Vừa/Khuôn) so
the owner can WATCH the dial re-weight spark vs sky in a live run; the run-summary gains **Lối học**, **Khoa (cohort
cuối)** (the major mix incl. Đại cương), and **Đại cương (everyman)** (how the grain-less majority fared — % nên người).
The structure selector also flows into the distribution + compare reads (all reads now respect the dial). Dev-tool only
(`lab.sh` → regenerates `__lab.html`); the live game is untouched → undeployed. Verified: `lab.sh` regenerates clean,
headless auto-run returns **LAB_OK** (no JS error); game code unchanged since iter-248 so gate/sweep/bot/baseline hold.
**The EDUCATION epic's CORE is now delivered + visible** (pedagogy 2-axis dial · richer majors + the everyman's home ·
deeper composed factor model — the owner's three asks). **Remaining (owner-steerable):** Phase 2c (systemic off-native
intake → "right gift, wrong major" live + remove the scripted prodigy) and Phase 3 (mechanical activities + attention-
hours) — both large; Phase 1c (cram-distortion map) is small deferred texture.

## 2026-06-22 — EDUCATION epic ▶ PHASE 2b: the EVERYMAN gets a HOME — Khoa Đại cương (loop iter 248)
**The >50% with no grain (`tell=""`) were homeless — null major, no khoa, no realize-path of their own. Now they have
one.** Added **Khoa Đại cương (ứng dụng)** 🧭 — a room-less, always-available general track native to `""`, with a modest
practical synergy (`stat: tn` → realized as a steady **🔧 kỹ thuật viên**). `studentMajor` now returns it for the
everyman (`!m.room` → no building needed). The result (baseline intentionally **recaptured**): under cân-bằng the
everyman realizes MORE as kỹ-sư (KY_SU 227→238, fewer settled-lesser); under cram they become rote-competent rather than
dropping out (BI_BAT 20→8, THAT_NGHIEP 31→23, văn-mẫu 28→47 — pedagogy STILL wastes them, just differently); **apex barely
moved** (FOUNDER 76→78 total). **Owner-fork #1 firewall — built bounded + sweep-gated + HOLDS:** a new EVERYMAN sensor
proves Đại-cương lifts the ordinary majority's realize floor (`""` realized 37%) but a GRAIN still out-apexes it (`""`
apex **7.7% < best grain 17.5%**) — a home, not a 🍎 path, so chasing apex still wants a gift and "admit all-`""`" is
never the dominant play. The open-question firewall stands. Carries **Phase 2a (iter-247, MAJOR_FIT mechanic)** live too.
Fixed a boot-crash the new room-less major exposed (`ui.js` khoa panel did `CONFIG.ROOMS[null].name` → now a room-less
major is always "unlocked"). Verified: parse clean, gate GREEN + BASELINE GREEN (recaptured), sweep 0 bad flags (MAJOR_FIT
✓ + EVERYMAN firewall ✓ + STRUCT ✓), bot BOTOK 7479/87/13 (no JSERR), lives 0 LIVESFAIL. Deployed. **NEXT (Phase 2c): the
SYSTEMIC off-native intake** — let a grain be placed in a non-native track (fit-priority vs open-door + quota), making
"right gift, wrong major" actually happen in play (MAJOR_FIT finally bites live); + remove the scripted prodigy.

## 2026-06-22 — EDUCATION epic ▶ PHASE 2a: the MAJOR_FIT mechanic (right gift, wrong major) (loop iter 247)
**The structural-majors groundwork, headless + byte-identical (the proven 1a pattern).** Each major gains a `fit`
vector over tells (`code.fit{spark:1, sky:.85, hype:.7, "":.8}` etc.) and a new `CONFIG.MAJOR_FIT(tell, majorKey)`
reads it. A **2nd fit axis** — the TRACK, distinct from pedagogy — routed through the same proven non-saturating MOOD
channel: `majorMood = (MAJOR_FIT − 1) × MAJOR_MOOD_W` (tuned 3→5 so it bites consistently across tells). The DIAGONAL
(native tell) = 1.0, so today's 1:1 `studentMajor = majorByTell` assignment is **byte-identical** (gate BASELINE GREEN);
the off-diagonal only bites once **Phase 2b's systemic intake** can place a grain off-track ("a coder at the lathe").
A `MAJOR_OVERRIDE` (sweep-only, like ERA/PEER) force-places everyone so the new **MAJOR_FIT sensor** can prove the
teeth: a coder realizes **89% in code vs 75% shoved into biz**, a maker **77% in make vs 73% in biz** — wrong-major
is a real waste (Δ14.2/3.4). Verified: parse clean, gate GREEN + BASELINE GREEN, **sweep 0 bad flags** (STRUCT ✓ +
new MAJOR_FIT ✓), bot BOTOK 7337/87/14, lives 0 LIVESFAIL. Committed LOCAL — undeployed (inert until 2b's assignment,
the coherent player-usable slice). **NEXT: Phase 2b** — decouple `studentMajor` into a systemic best-fit-given-rooms-
and-quota resolver + add the ~3 new majors (incl. the everyman's **Đại-cương** with its prose banks) + intake UI +
remove the scripted prodigy (re-baseline GATE_ALUM) — the behavioral change + a deliberate `baseline.snapshot.json`
recapture.

## 2026-06-22 — EDUCATION epic ▶ Phase 2 groundwork: the EVERYMAN gets a voice (loop iter 246)
**The plan's "write the everyman content FIRST" prerequisite — and a real narrative gap closed for the majority of
kids.** ~54% of students have no gift-direction (`tell=""`), and at the payoff they ALL shared one generic line
(*"tài năng bỏ phí trên tay bạn"*) — which doesn't even fit them (they have no *standout* gift to betray). Added the
everyman's own gift-vs-fate read to `realGapTell` via a `gen` key for each class, and re-pointed `realCreditSuffix`
(`tk = tell || "gen"`) so `""` resolves to it (spark/sky/hype unchanged → **byte-identical**). Their grief is distinct
and true to the đề-Văn's most universal note — not a betrayed gift but the **direction the school never gave the
able-but-undirected**: *loud* → *"sáng dạ, việc gì cũng kham được, mà chẳng ai chỉ cho một hướng; rốt cuộc ra trường
vẫn trắng tay nghề"*; *under* → *"giỏi đều mọi thứ, thiếu một thứ để gọi là của riêng; thành người làm được việc,
không thành một cái tên"*; *bent* → *"nhanh nhẹn, dễ bảo, nên cũng dễ bị người ta dùng vào trò khôn lỏi."* Reading-only
→ sim byte-identical (gate BASELINE GREEN; the capstone essay grew 2761→2907 as the everyman cast reads richer).
Verified: parse clean, gate GREEN + BASELINE GREEN, sweep 0 bad flags, bot BOTOK, probe confirms all 3 everyman lines
fire + spark unchanged. Deployed. **NEXT: the Phase 2 mechanic** — decouple major from tell (~6 majors incl. the
Đại-cương everyman track, with its realized+wasted banks) + `MAJOR_FIT` as a 2nd ceiling term.


## 2026-06-22 — EDUCATION epic ▶ PHASE 1b: the 2-axis TEACHING DIAL goes live (loop iter 245)
**Structure becomes a player verb.** The curriculum panel's 3 triết-lý buttons (MODE) now sit above a second
segmented control per grade — the STRUCTURE axis (**Mở / Vừa / Khuôn** = autonomy / neutral / scaffold), wired to
`S.struct.n*` (default `Vừa`/mid). Each level ships its open-question tradeoff string (like the presets), so the fork
is legible: *Mở* lifts makers & showmen, *Khuôn* lifts coders & the everyman, *Vừa* is neutral. The per-kid fit
readout + the walking-sprite reaction now read the **composed** fit (`MATCH × STRUCT_FIT`) — so a structure-mismatched
gift reads *"lệch lối học này"* and a fit reads *"đang nở rộ"* — kept as **3-band PROSE, never a fit-%** (§C-3 audit of
the L908 readout held). **Phase 1a+1b are the coherent slice — DEPLOYED together.** At the `mid`/`Vừa` default
everything is byte-identical (gate BASELINE GREEN); moving the dial bites — a soul probe shows the SAME cohort's
coders realize **12/28 → 24/28** when structure goes Mở→Khuôn (scaffold lifts the coder), makers the reverse. The
spark≠sky degeneracy — a coder and a maker responding identically to teaching — is now gone: they want OPPOSITE
structures. Verified: parse clean, gate GREEN + BASELINE GREEN, bot BOTOK 7337/87/14 (the dial renders, no JSERR),
sweep 0 bad flags incl. the STRUCT_FIT ✓, lives clean. **NEXT (Phase 1c): the tell-keyed DISTORTION map** (generalize
the single `MATCH_CM` hype+cram→shark into spark→credential-grinder / sky→văn-mẫu / hype→coin-shark — a balance-shift,
so it recaptures the baseline intentionally). Then Phase 2 (majors decoupled).

---

# DIGEST — iters 244 → S1 MVP (condensed)

*The entries below (older than the ~25 kept verbatim above) are collapsed into a structured history grouped by epic. The arc, every reversal, and every load-bearing lesson are preserved; the per-iteration verification boilerplate and exact cache-bust numbers are dropped. Newest epics first.*

## EDUCATION MODEL REFINEMENT (the greenlit epic — refine in place, don't rebuild) — iters 243–248
- **The plan adopted (owner greenlight, doc-only):** the core equation becomes a composed sub-product (`MATCH × STRUCT_FIT × MAJOR_FIT × ACTIVITY[attention-gated] × MENTORSHIP × FACULTY_GRAIN`). Verdict from a 26-agent review: refine in place, ~90% of the engine is the law-bearing spine. THESIS stays FROZEN; the 4 thesis-adjacent forks are owner-overridable recommendations. Phased: Phase 0 gate baseline-check → 1 STRUCTURE axis → 2 MAJORS decoupled → 3 ACTIVITIES + attention-hours.
- **iter 243 Phase 0 — the realization-baseline snapshot:** `gate.sh` proved *determinism* but stored no growth/realization baseline, so a mis-tuned change could silently shift every kid's destiny while the gate stayed GREEN. New `baseline.js` runs a fixed matrix (3 triết-lý × 4 seeds) and asserts the alumni-state histogram matches `baseline.snapshot.json` EXACTLY (epsilon 0; `--capture` for intended changes). This Phase-0 gate is the prerequisite every later phase verifies against.
- **iter 244 Phase 1a — the STRUCTURE axis (the spark≠sky fix):** pedagogy gains its missing orthogonal axis — alongside MODE (the 3 triết-lý) there is now STRUCTURE (drill ↔ autonomy). `STRUCT_FIT` composes with MATCH via `fitOf`; the TEETH live at MOOD (the non-saturating channel — rate alone washes out per the saturation wall). Splits the craft-twins that had IDENTICAL MATCH rows: low/autonomy lifts maker+showman, high/scaffold lifts coder+everyman. Byte-identical at the `mid` default (STRUCT_FIT=1.0).
- **iter 245 Phase 1b — the 2-axis TEACHING DIAL goes live:** the curriculum panel gains a per-grade Mở/Vừa/Khuôn segmented control wired to `S.struct`; the per-kid readout reads the COMPOSED fit (kept as 3-band PROSE, never a fit-% — the §C-3 audit of the L908 readout). The spark≠sky degeneracy is gone — a coder and a maker now want OPPOSITE structures.
- **iter 246 Phase 2 groundwork — the EVERYMAN gets a voice:** ~54% of kids have no gift-direction (`tell=""`) and all shared one generic grief line; gave them their own gift-vs-fate read (a `gen` key) true to the đề-Văn's most universal note (able-but-undirected). Reading-only → byte-identical.
- **iter 247 Phase 2a — the MAJOR_FIT mechanic (right gift, wrong major):** each major gains a `fit` vector over tells; a 2nd fit axis (the TRACK, distinct from pedagogy) routes through the same MOOD channel. The DIAGONAL = 1.0 so today's 1:1 assignment is byte-identical; the off-diagonal only bites once systemic intake (Phase 2c) can place a grain off-track. A `MAJOR_OVERRIDE` sweep sensor proves the teeth (a coder realizes 89% in code vs 75% shoved into biz).
- **iter 248 Phase 2b — the EVERYMAN gets a HOME (Khoa Đại cương):** the grain-less majority get a room-less, always-available general track (realized as a 🔧 kỹ-thuật-viên). Baseline intentionally RECAPTURED (the everyman realizes more, cram makes them rote-competent rather than dropping out). **Owner-fork #1 firewall holds:** a new EVERYMAN sweep sensor proves Đại-cương lifts the ordinary floor but a GRAIN still out-apexes it (7.7% < best grain 17.5%) — a home, not a 🍎 path, so "admit all-everyman" is never dominant.

## PEERS / CONTAGION — a new MODEL.md lattice factor — iters 241, 242
- **iter 241 ckpt1:** the cohort's atmosphere pulls each kid's mood toward the school mean each month — a thriving class buffers its strugglers, a demoralized one drags its stars out of FLOW. Designed as an ENVIRONMENT, not a lever — a *partial* pull (tuned via probe; PULL=0.35 over-converged and was REJECTED, so per-kid texture + the mismatch-burnout tail survive). Runs after the dropout rng draws → replay-safe. Sweep-proven aggregate-neutral (not a free realize lift) + the apex survives.
- **iter 242 ckpt2:** the môi trường named on a SPECIFIC kid in-play — a bloomer in a warm class is reinforced, a cooling kid in a cold class dragged. **Emergent interaction discovered:** the clauses each fire in their natural habitat *because of the player's TEACHING CULTURE* (cram drives the mean cold → the drag fires; craft/balance hold it warm → the lift fires) — policy → atmosphere → peer effect on a named kid, with no new state.

## L4 TECHNOLOGY — the era extends the teacher's reach (the safe, non-thesis slice) — iters 239, 240
- The genuine fork in L4 (what tech does to the APEX) is thesis-level and stays owner-gated. The safe slice: in the smartphone/AI decades an AI trợ-giảng extends the headmaster's reach (+mentor slots) — "tech changes teaching CAPACITY," not "tech caps genius."
- **iter 240 CORRECTION (a theme/reachability bug from 239):** with `ERA_LEN=3`, the +reach was gated/labeled one era early (the "AI" beat fired in the smartphone era; the real AI era barely exists in a 12-year run). Corrected to a COMPOUNDING axis — `mentorSlots()` climbs 3→4 (smartphone)→5 (AI), each wave firing its own era-true beat. Deterministic from `S.year`, no save state.

## NARRATIVE & PLAYER-FACING POLISH SWEEP — iters 222–235
- **iter 231 the annual letters now EVOLVE:** the biggest real gap found by reading actual output — the headmaster wrote the IDENTICAL sentence years 2–13 (a static beat the owner wanted *"evolving, aligned with the player's choices"*). Each letter body became a 3-variant arc (hopeful → plain → weary) picked by run-phase; a stored worry-KEY lets the capstone still detect the "rut" by theme, not the now-varying words.
- **iters 232–233 alumni-detail richness:** fixed the capstone cast listing the same grad twice (`buildCast` BI_BAT slot missed the `!used[a.id]` guard); the per-graduate detail view now reads the gift-vs-fate (era × origin) like the epilogue, with a leading-separator render-glitch fix.
- **iter 234 the returning-alum teacher made visible** in the persistent staff list (a gold 🎓 "trò cũ trở về" badge that also explains the free salary) — the L3 payoff was invisible after the news beat scrolled away.
- **iter 235 audit (true-verification, no manufactured change):** the opening reads clean; the mentoring × LATTICE interaction is genuinely deep — a mentored kid's `orgGrow` resets to 1 (ERASING the origin/class penalty) but mentoring does NOT override the ERA tilt on the apex ceiling (a teacher can lift a kid past where they came FROM, not past the decade they graduate INTO).
- **iters 222–229 the marquee-narrative polish sweep (reading WHOLE branches end-to-end):** cast-quote dedup (no two grads read the same line) · decoupled the cram-essay's self-echo (whetstone vs mould imagery) · owner TONE fixes (a ceiling fan not a school "bell"; removed all 5 Ministry/Bộ jabs — the satire sits on the system + cram-culture, never the Ministry — logged as a rule) · per-grad graduation flavor (1→10 distinct in a 10-kỹ-sư cohort) · stopped the endowment beat from spamming the ticker (~half the feed) · events made era-aware (`minEra` — no AI-homework in 1995; the symmetry floor lowered 8→6 as a confirmed boundary artifact) · verified the 🍎-success capstone is moving + flaw-free. A QA scare (iter 223) traced to a `lives.sh` headless-Chrome singleton quirk, NOT a game bug. **iter 230:** wrote GRAPHICS-HANDOFF.md (a living inventory of all 15 player-facing surfaces + what the deferred graphics pass must dress + the narrative-is-FINAL laws).

## ERAS / the LATTICE (L1) — iters 204, 205, 214
- **iter 204 ⭐ the LATTICE begins:** a run now plays through a SEQUENCE of decades (Thời bao cấp 199x → Đổi Mới → dot-com → smartphone → AI bùng nổ); each decade re-weights which gift the WORLD realizes vs wastes (`ERAS[].fav` feeds the alumni FSM + `ERA_REGRESS`/`ERA_RISE` mobility rows so a realized gift can slide back in a hostile era). The decade decides the CEILING not the floor; no dominant decade (spark→ai / sky→scarcity / hype→smartphone). Distortions stay era-NEUTRAL (the school's doing). Replay-safe via `eraIndex(S.year)`, no save change. News beats surface it (graphics frozen → ship soul as words).
- **iter 205 legibility:** "right kid, wrong era" named at the payoff — `realCreditSuffix` appends a "sinh nhầm thời" clause for a gift wasted in a hostile era AND a "gặp đúng thời" clause for one that met its golden decade (symmetry).
- **iter 214 era INTAKE (ckpt2):** `rollTell` tilts each new cohort's gift-mix toward what its decade rewards (bounded). The ERA axis is complete: the decade decides who walks IN, who realizes, and names the wrong-era waste.

## L2 DEMOGRAPHIC × GEOGRAPHIC (owner steer: "add demographic + geographic realism") — iters 206, 207, 210
- **iter 206 demographic / the school as equalizer:** every kid carries a family ORIGIN (nghèo/trung-bình/khá-giả); a poor kid's *legit* growth drags (the drag hits the legit path only, never the hustle). MENTORING a poor kid ERASES the headwind (`orgGrow→1`) — but slots are scarce → a tragic allocation, never dominant. Origin DERIVED from the stable id (byte-identical roll). **REVERSAL:** an early mood-penalty version spiraled the poor into mass DROPOUT under cram (broke invariant #2 — waste-only); fixed by carrying the whole cost in growth (poor GRADUATE-but-settle).
- **iter 210 geographic / 4 archetypes (MODEL-first):** the school's *place* pre-loads its world: Trường tỉnh lẻ (baseline = the exact legacy boot constants → byte-identical, zero migrator) · Trường quê nghèo (poor underdog) · Lò luyện thành phố (gilded trap — highest prestige, 45% distortion) · Trường nghề khu công nghiệp (craft thesis — realizes makers, earns least). A tradeoff not a hierarchy (no archetype tops both apex AND cash). Chosen via `?arch=` / `ARCH_OVERRIDE`.
- **iter 207 tune.js (velocity dev-tool):** grid-searches one CONFIG knob over a value list and stars the best-fit — collapses ~4 fire-in-the-dark probe cycles (the iter-206 cost) into one run. A metric per mechanic.

## NARRATIVE — the headmaster's evolving essay (N2/N3) — iters 211, 213, 215
- **iter 211 annual letters (N2):** the yearly Tết beat becomes a real letter conditioned on TEACHING POLICY × cohort-becoming × ERA — mirroring the player's choices back. The spine the moving capstone grows from.
- **iter 213 capstone re-reads the letters (N3 ckpt1):** letters now PERSIST (`S.letters`); the decade-capstone picks the ARC (policy changed → quotes first + last letter) or the RUT ("n năm, n lá thư, cùng một nỗi lo — mà chưa năm nào tôi dám đổi cách dạy" — the headmaster stuck in his own loop). Save-safe, no migrator.
- **iter 215 the turning point (N3 ckpt2):** when the letters genuinely changed, the essay quotes the first year his letter diverged — the arc reads as start / where his mind turned / end. Open-question law holds (still cuts off at "Tôi—").

## EARLIER person-sim soul (pre-refinement) — iters 193–203
- **iter 193 gift-specific cohort glimpse:** `cohortBeat` lines keyed to the kid's `tell` — honoring the owner's "emergent per-life narrative FROM the gap, not generic strings."
- **iter 197/198 distortion as its own grief (the trichotomy's 3rd pole):** realize / waste / **distort** split — a gift bent the WRONG way reads "tài năng bị bẻ cong trong tay bạn", distinct from idle waste; the live cohort glimpse now rotates all three poles so a curdling gift is visible while you can still act.
- **iter 194 the đặc-cách gamble's visible cost:** a gambled-on ngọc-thô gem that DIDN'T pan out earns a diamond-specific grief line (the door is a real bet, not free upside — invariant #2 symmetry).
- **iter 203 tell-aware epilogue grief:** `realCreditSuffix` made tell-aware so the epilogue names WHICH gift was wasted (shared with the graduation screen — one source of truth).

## FACULTY / E8 grain-flavored teachers — iters 195, 200
- **iter 195 E8 ckpt2a:** each hired teacher realizes a specific grain and neglects the rest (zero-sum across grains → aggregate-neutral but DIRECTED). Legible via a per-teacher lean + a faculty-gap warning.
- **THE SATURATION-WALL FINDING (documented ~4×):** shifting end-state *realization* by faculty hits the saturation wall at the growth-RATE layer — a saturating signature stat absorbs a ±rate nudge. So ckpt2a keeps the trade-off felt at MOOD with the floor stable.
- **iter 200 ckpt2b (behind `?ckpt2b=1`, OFF by default):** the STRUCTURAL teeth — a discovered gift whose grain you staffed no teacher for goes adrift, erased by mentoring. Shipped behind a flag because the over-waste balance is the kind the ROADMAP repeatedly gates on **owner playtest, not a headless knob.** Byte-identical with the flag off.

## ECONOMY epic — iters 159–166, 169, 180–182, 186, 187
- **Buildings that EARN:** căng-tin sells meals, the classroom is a tuition multiplier, the Lab Sống Ảo monetizes clout via livestream income.
- **Compounding growth engine (iter 160):** escalating upgrade costs + prestige premium per level, with `EFFECT_LVL_CAP` insulating the person-sim; endgame reaches tens→hundreds of tỷ with 0 bankruptcy.
- **REVERSAL (iter 157→159):** the iter-107 "manage the hoard DOWN" direction was REVERSED on owner steer ("ridiculous endgame money, a university scales over decades") — caps lifted, upgrades cost more instead.
- Milestone fanfare + a ticker-tint bugfix; a living school TIER in the HUD; idiomatic "tỷ" money formatter; legible upgrade ROI.
- **iter 169 money-vs-mission fork felt DURING play** (corporate sponsorship: cash+fame−integrity+phốt-seed vs refuse), not just at the epilogue. Alumni give back by NAME (non-monetary gifts, iter 182).
- **iter 187 (owner):** tuition decided at "công bố điểm chuẩn" (re-derives the applicant pool live); **iter 186 (owner):** the rename event renames the school FOR REAL (`S.schoolName` mutable state).

## NARRATIVE / epilogue & alumni biographies — iters 133, 140–154, 170–176
- The epilogue ("Bản nháp bài luận của hiệu trưởng") deepened: three theses → three distinct closings (iter 172); the protégé named in the capstone with a personal coda; a whole-cohort prose summary (no per-fate counts — §C-3); the share card carries a single telling life (iter 143); the honored-student-the-system-still-failed beat; the wasted gift named AT graduation, not 10 years later (iter 154).
- Alumni scatter into the feed (iter 170); the protégé's post-grad life surfaces (iter 171); soul-moment ticker tints (⭐🍎 gold / 🚔💔 red), with a surrogate-pair tint-match bugfix.
- **REVERSAL (iters 172/174):** the `channeledMaker` "safe school's quiet cost" beat was DEAD CODE — never fired in balanced runs (0/5) because the cast avoided on-target kids; fixed via `dominantPreset` routing → fires 5/5.
- **De-dup lesson:** two wasted prodigies got the same climax line → de-duplicated (iter 176) — the same flaw class the owner caught at the Steve keynote, recurring one level down.

## PERSON-SIM core: mood, talent, protégé, underdog — iters 116, 123–132, 135–138, 150–156, 179
- **MOOD made live (iter 131):** mismatch drains kids; burnout reachable under cram; FLOW bonus — a thriving kid (mood≥80) learns faster (iter 155). Telegraphed, not a surprise (iter 132: inspect-card warning + two named saves).
- **Discoverable talent (E5, iter 126):** you can't read a gift off a number — seed hidden until grade 2+, mentor = instant reveal. The match model made legible (grain × learning style, per kid).
- **E-UNDERDOG (iter 128):** the gem the entrance exam overlooked — rough diamonds (ngọc thô) in the low-score pool, admitted via the đặc-cách narrow door.
- **Realization-aware destiny (E4, iter 123):** craft's QUIET waste named; `realClass` → loud/under/bent, orthogonal to the 🍎 gate.
- **Protégé arc:** follow one kid (iter 43+) through an in-school arc (iter 125) with a follow-journal (iter 135) and a graduation culmination (iter 150).
- **Cohort glimpses (iter 179) + Tết yearly chapters (iter 152):** watch the WHOLE cohort become themselves while you play; pure prose, no counts.
- **iter 116 craft can finally WASTE:** the mismatch-adrift ceiling (severe grain-mismatch caps stats) — craft's realize drops off its ceiling, mentoring rescues.

## THE CRAFT-SYMMETRY PLATEAU (a parked diagnosis) — iters 111, 120, 122, 124
- Four separate knob-tunes to make craft waste symmetrically all stalled at ~5% waste.
- **ROOT CAUSE PINNED (iter 120):** the bottleneck is UPSTREAM — the admissions tell-distribution skews the cohort high-generalist (27% vs rollTell's 54%). The fix is an admissions reform, not a destiny knob. **Lesson: STOP knob-tuning a symptom; the diagnosis is epic-shaped.** Parked for owner steer.
- Related dead-pole find (iter 124): the E-UNDERDOG "lift" pole was structurally unreachable (admissions excludes modest-seed kids); cut the dead lift, named the mentor's hand instead.

## SAVE / CRASH HARDENING (the save-is-lossless promise) — iters 102–105, 173, 202
- **iters 103–105:** dynamic-key maps (khoaCup/champ/khoaHead) silently dropped on reload → restored post-merge; protégé `favId` reset → fixed; out-of-range meters loaded corrupted → defensive clamping. Save round-trip now LOSSLESS + corruption-resilient, with GATE_SAVE assertions.
- **iter 173 epilogue crash INCIDENT:** a use-before-init bug crashed the live epilogue. Root: the evolution-critic agent had a `Bash(node:*)` allowlist that permitted fs/git writes. **Hardening:** critic made SENSORS-ONLY (removed node, explicit deny on writes/git/curl), added a `CRITIC_TIMEOUT` watchdog; `bot.sh` now renders the essay every run.
- **iter 202 (a too-long hold's payoff):** a fan-out audit on resuming found `S.teachers`/`S.giftItems` unvalidated by `sanitize()` → a corrupt element bricked the save PERMANENTLY (crash inside loadGame → reload → same crash). Fixed with validation blocks + 4 regression assertions. **LESSON (recorded in SKILL): before concluding a plateau or holding repeatedly, RUN A SCOUT FAN-OUT first** — the recurring iter-202 lesson, re-learned at iter-254.

## STRUCTURE CARVES (keep the codebase PLASTIC) — iters 114, 127, 134, 145, 149, 163, 176, 183, 199, 212
- Modules split out of the monolith, each behavior-neutral and gate-verified byte-identical: `js/sim/person.js` (lifecycle) · `js/content.js` (copy split from CONFIG) · `js/uikit.js` (UI primitives) · `js/epilogue.js` (pure epilogue helpers) · `js/sim/admissions.js` (intake) · `js/save.js` (persistence) · `js/sim/alumni.js` (the alumni-world FSM, iter 212, engine.js 1033→844).
- **THE iter-163 LESSON:** a structure carve must verify the real BROWSER boot, not just the node concat — admissions.js node-passed but browser-FAILED (engine.js's `window.HVS` referenced functions before admissions.js loaded; fixed by augmenting HVS post-load). All later carves honor this.
- Counter discipline: `EPICS_SINCE_STRUCTURE` / `SMALL_SHIPS_SINCE_EPIC` lock the loop into safe/epic/structure rotations.

## L3 LEGACY — the cross-run "one more run" ladder — iters 217–220
- **iter 217 ckpt1:** a run's most NOTABLE graduate is written to a SEPARATE localStorage key surviving past the save; a NEW run re-reads it — a BRIGHT legacy (🍎/founder/kỹ-sư) gifts the new quỹ +40tr, a DARK legacy (coin-shark/arrested) echoes as a reputation penalty. **Load-bearing fork: `freshState` stays PURE** (the legacy is applied at ui-boot for a NEW game only → gate/sweep never see it → byte-identical).
- **iter 218 ckpt2:** the bright legacy RETURNS as a named founding teacher — a successful grad teaches the next generation for free, grain-matched via E8.
- **iter 220 ckpt3:** the dark legacy's scandal name haunts the new school's first admissions (symmetric). Deferred to graphics/owner: the progression UNLOCK rungs + a real pick-archetype selection screen.

## KHOA / MAJORS system — iters 49–52, 79–81
- P1 engine (three khoas unlock by building, steer destiny, auto-join by tell, synergy bonus) → P2 UI (khoa cards, synergy meter, "Khoa nổi bật" medal) → P3 depth (cross-khoa synergy → dual-skilled students; trưởng-khoa head bonus) → P4 the annual **Cúp Khoa** trophy race (pennant on the champion's roof, trophy history, morale-lift only — no stat inflation).

## SOUL / moral-choice event deck — iters 23, 32, 47, 64, 67, 71, 74, 83, 169, 229
- The đề-Văn's moral tensions as choices: AI làm hộ đồ án · học thêm (shadow education) · bệnh thành tích · du học (brain drain) · the "safe path" parents want · corporate rename/sponsorship. Virtuous choices cost (lost students, foregone fame); selfish ones pay in Tiếng Tăm.
- Phốt (scandal) risk indicator (qualitative tiers) + a scandal-day set-piece (TV news-van at the cổng).

## CAMPUS-LIFE & GRAPHICS (now FROZEN) — iters 1–8, 25–27, 53–84, 110
- **The art arc / a key reversal:** Sơn Mài Diorama (dark lacquer) was owner-VETOED as "ugly" → pivoted to bright pixel-art v2 → premium 24×32 characters (owner-picked) → "3D-but-pixel" buildings+people (owner directive C: volume shading, extruded depth, contact shadows). Graphics are the #1 dimension; once locked, all later work is the gameplay-first phase.
- Living campus: students walk IN through the cổng / OUT at graduation; a 5-period day-clock with activity overlays + mood emotes; drifting cloud-shadows, time-of-day light, weather + umbrellas, the campus cat; Tết décor + graduation confetti; alumni return visits with context-keyed speech bubbles.
- Generative campus-lofi BGM (state-aware, no assets; extracted to `js/audio.js`); gentle SFX.

## FOUNDATION — S1 MVP & the loop's laws
- **S1 MVP:** a multi-file build (layer law from day one: `data.js` tunables+copy / `engine.js` DOM-free deterministic sim / `ui.js` canvas / `index.html`); three RNG streams; a June two-stage ceremony → 8-row graduation cascade; an alumni FSM on an isolated seed (byte-identical replay) with a scripted Trần Phi Lợi arrest + the 🍎 emerging years later (never at graduation).
- **"Bản nháp bài luận của hiệu trưởng" (loop iter 2):** the reflective epilogue as the player's ANSWER to the đề Văn — mirrors their school back, holds the question open, never imposes a verdict.
- **DESIGN §1 the open-question law (owner directive):** no dominant strategy; reflect, don't impose; the epilogue mirrors the player's own school back.
- **sweep.js (iter 16, owner directive):** the headless balance simulator (40 seeds × strategies × years → economy band + alumni distribution + 🍎-rate + pluralism flags). Early balance fixes it drove: a Tiếng-Tăm floor (admissions were collapsing) · the cá-mập-coin dark ending finally firing · a late-game money sink · the Văn-Mẫu champion made reachable.
- **OWNER DIRECTIVES that reshaped the game:** START FROM NOTHING (iter 24 — boot from an empty lot, not an inherited 42-SV university) · 3D-but-pixel (iter 26–27) · deploy-every-change on each push with a visible build badge + auto-update (iter 37/117/157) · PWA/installable.
- **"Still the same after many versions" (iter 37):** a save/cache cascade (stale localStorage + a 600s Pages cache) masked deploys → fixed with SAVE_KEY bump + cache-control meta + a visible build stamp. (Sibling: iter-158, `.gitignore *.png` swallowed the real art on the web → fixed with a `!assets/**/*.png` exception.)
- **iter 92 the honest plateau call + architecture review:** after a long owner-absence streak, recognized that every remaining true epic was taste-blocked or owner-gated; the loop ships safe value/completeness/structure and awaits owner steer rather than forcing risky make-work. ("Subtraction is design"; carve only clean leaves.) This posture — and its over-conservative failure mode — is the through-line re-learned at iters 202 and 254.
