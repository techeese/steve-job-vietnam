# Roadmap — Học viện Steve improvement loop

Ordered; the loop takes from the top. Add freely, prune ruthlessly.
Loop flag: `touch /Users/Admin/Desktop/coding/.improve-steve-on` · kill: `rm` same file.
Owner follows https://techeese.github.io/steve-job-vietnam/ remotely — PUSH EVERY ITERATION.

## Now

★★★ **THREE OWNER DIRECTIVES (2026-06-13) — top priority:**
- ~~**(A) START FROM NOTHING, build up**~~ **SHIPPED (iter 24).** Boot = empty lot: 0 rooms,
  0 students, 1 founding teacher, 200tr pot with an origin story (viral đề-Văn answer → cắm sổ
  đỏ + 50tr vốn mồi). Tháng-6 boot → July founding intake → Mai Sương is enrollee #1; empty
  Junes roll the year silently (foundingJune); first real graduation ~Year 5. TPL re-homed as a
  shadow alumnus (scripted Y2-M3 arrest preserved). GATE_FRESH + sweep band updated, all green.
  *Follow-ups:* ~~milestone nudges~~ SHIPPED (iter 28: "Cột mốc" founding-goal banner walks the
  player build→intake→teacher→spec-room→grow→firstgrad). Still open: the early years could use
  more *mid-build texture* (founding-specific events, a visible "first đồ-án" beat, a cheaper-but-
  paid first room for a real spend decision); late-game money still inflates (~2635tr, sweep
  flag) — start-from-nothing made the surplus sink weaker, S4 spend channels needed.
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
  face vs the current solid extrusion), seasonal roof tints (Tết/June), and a `tools/gallery.html`
  promoting the `__ui._bakeSheet` hook to a real phone-reviewable sprite/building gallery.

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
   sprites, the "Mười năm sau…" epilogue, "Mời cựu SV về nói chuyện" verb.
7. **S4 — Funding full:** contract types 🦜🎣🤝, renewal escalation, decks T/E/C, Quỹ Ứng Cứu.
8. **S5/S6 — Pantheon pack + content:** dedications (Vườn Nguyễn Trường Tộ first), Giải
   Giọng Riêng + Lễ Vinh Danh (trimmed), remaining 6 scholarships with pipeline effects,
   living-archetype event deck, uni teacher archetypes, khoa split.

## Recurring
- Maintenance sprint every ~5th iteration (sweep, bot, full 390px audit, perf).
- Mobile audit even when nothing changed.
- Code-structure review every ~10th iteration (owner directive) — verdict lands in
  `## Architecture` below; queue at most one behavior-neutral refactor.

## Architecture (structure-review log)
- *(2026-06-13, S1 ship)* Layering clean at birth: `js/data.js` (CONFIG numbers + CONTENT
  text, zero logic/DOM) · `js/engine.js` (state/sim/June/admissions/alumni/funding, DOM-free,
  node-testable) · `js/ui.js` (all render/canvas/modals, reads via HVS/__test, owns no
  numbers) · `index.html` (shell). engine.js ~940 lines, ui.js ~925 (grew with the Sơn Mài
  art renderer + campus-life day-clock) — BOTH now over the ~900 split threshold. S1.5 art.js
  extraction is now the priority refactor: pull the art renderer (drawStatic/drawRoom/
  drawActor + ROOM_STYLE + prop drawers) AND the campus-life layer (period clock, buildRings,
  assignActivity, drawActivity) into `art.js`, leaving ui.js as HUD/panels/modals. Then plan
  engine.js module-split (sim/june/admissions/alumni/funding) for when alumni S3 + funding S4 land.

## Flow reflection (iter 20, ~10-iteration checkpoint)
The dev flow is serving the owner: 20 iterations shipped, ~15 autonomously (decide→ship→veto,
no vetoes), the north-star ("sunny lively watchable school") resolves design forks cleanly,
and `sweep.js` turned balance from guesswork into 3 data-driven fixes (now all-clear). Look +
gameplay both strong. ONE flow risk: **`js/ui.js` is now 1203 lines** (art + campus-life +
ambient + customization + HUD + panels + modals + sound + epilogue) — velocity will degrade.
**The S1.5 `art.js` extraction is now the top structural priority** (chunked + before/after
screenshot-verified, per the autonomous-refactor landmine). Best done when the owner is OK
with one invisible-but-velocity iteration, or pulled forward if a new visual feature gets hard.

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
