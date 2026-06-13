# Roadmap — Học viện Steve improvement loop

Ordered; the loop takes from the top. Add freely, prune ruthlessly.
Loop flag: `touch /Users/Admin/Desktop/coding/.improve-steve-on` · kill: `rm` same file.
Owner follows https://techeese.github.io/steve-job-vietnam/ remotely — PUSH EVERY ITERATION.

## Now

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
