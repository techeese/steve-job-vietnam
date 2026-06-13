# Roadmap — Học viện Steve improvement loop

Ordered; the loop takes from the top. Add freely, prune ruthlessly.
Loop flag: `touch /Users/Admin/Desktop/coding/.improve-steve-on` · kill: `rm` same file.
Owner follows https://techeese.github.io/steve-job-vietnam/ remotely — PUSH EVERY ITERATION.

## Cadence
<!-- Step 0 READS this; it DICTATES the track (see SKILL.md "THE COUNTED CADENCE"). Update every ship. -->
- `SMALL_SHIPS_SINCE_EPIC: 0`   → ≥3 ⇒ the next firing is **HARD-LOCKED to the EPIC track** (polish illegal). Reset to 0 only when an epic SHIPS.
- `EPICS_SINCE_STRUCTURE: 1`    → ≥2 ⇒ the next epic **MUST be a STRUCTURE-epic**. Reset on a structure-epic ship.
- `LAST_EPIC: iter 59 — FEATURE: character art step-change (24×32 premium chibis, owner-picked dir C)`

## Epic in progress
_(none — the art step-change shipped iter 59. Possible veto-driven follow-up: if the 24×32 characters
read too BIG vs the buildings, a map-scale pass (bigger TILE / zoom) is a queued FEATURE-epic — decide
on owner reaction.)_

## Epic backlog
<!-- Ranked; the epic turn DEQUEUES the top (respecting EPICS_SINCE_STRUCTURE). Keep full by mining VISION.md. -->
1. ~~[FEATURE] Character art step-change~~ SHIPPED iter 59 (owner-picked Direction C: premium 24×32 volumetric chibis with separated arms, expressive faces, contact shadows).
2. **[FEATURE] Weather + time-of-day lighting** — JUICE; the campus becomes a *place*, not a board.
3. **[FEATURE] Festivals / set-pieces** — Tết, graduation, a scandal-day the campus reacts to. JUICE.
4. **[FEATURE] Player-customizable students** — owner-hinted ("characters are customize"). FUN + individuality.
5. **[FEATURE] Generative campus-lofi BGM**, state-aware (term / Tết / June / scandal). Atmosphere (Area 12).
6. **[FEATURE] Shareable end-card** of the player's answer to the đề Văn — BITE + shareability.
7. **[FEATURE/tune] Map-scale harmony** — if the new 24×32 characters read too big vs buildings, bump TILE / zoom so the world feels proportionate. Decide on owner reaction.
8. **[STRUCTURE] (if needed) further ui.js modularization** — extract the atlas/sprite layer if ui.js grows again. Not urgent.

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
