# Changelog

## 2026-06-13 — Two new moral-choice events (loop iter 23)
- 📸 "Báo muốn bài thủ khoa đầu ra" (stage a coached student for +Tiếng Tăm +mầm phốt, vs let a
  real kỹ sư speak awkwardly for +Uy Tín) and 🎁 "Phụ huynh lập quỹ khuyến học" (take the 25tr
  "donation" with strings → +cash +Vẹt +mầm phốt, vs decline for +Uy Tín + a Bác Tâm nod).
- Both encode the hype-vs-substance tension; new fx + predicates (hasNam4/common); all four
  branches verified (TT/UT/cash/phốt deltas correct). Gates green.

## 2026-06-13 — First-time intro (loop iter 22): set the premise
- New players landed in the school with zero context. Added a one-time intro modal that shows
  the boot premise (the real 2026 đề Văn question → you bought a bankrupt university to MANUFACTURE
  a Steve Jobs, or at least not breed more coin sharks) + a one-line how-to-play + the satire
  disclaimer. Gated on META.tutorial (shown once, persisted). Uses the existing CONTENT.boot.

## 2026-06-13 — Alumni trajectories (loop iter 21): watch lives unfold
- Each cựu sinh viên now records a STATE HISTORY as the FSM moves them year by year, shown in
  the Sổ as a trajectory of chips (e.g. 🚀 → 🪙 → 🚔, or 💼 → 👷). The owner's core instinct —
  outcomes that evolve over years ("scammer 2 years after graduate") — made visible.
- Engine: setAlumState() helper tracks history at every transition; sanitize defaults it for
  old saves. GATE_ALUM caught a determinism bug (seeded vs sanitized history) — fixed; replay green.

## 2026-06-13 — Phốt risk indicator (loop iter 20)
- A qualitative HUD chip surfaces accumulating scandal danger — ⚠️ Có/Nhiều mầm phốt → 🔥 Phốt
  sắp bung — so the gamble is legible (pairs with the scandal-mood music + the now-firing
  cá-mập→arrest arc). Tiers, not an exact count, to preserve the mystery. Gates green.

## 2026-06-13 — Character customization (loop iter 19, owner-hinted)
- Tap a student → their inspect card now shows the ACTUAL pixel sprite (live canvas avatar) and
  lets you RENAME them (inline field) and CHANGE THEIR LOOK (🔄 cycles the 12 baked variants —
  skin/hair/accessory). Persisted on the student (s.look + ten); invalid look falls back to the
  id-hash, so saves stay safe. Makes the people personal — your students. Gates green.

## 2026-06-13 — Balance: money sink — sweep now fully clean (loop iter 18)
- Late-game cash inflated to ~2,800tr (no sink). Added a reserve-protecting sink: surplus
  ABOVE 300tr is reinvested into operations at 3%/mo (normal saving untouched, hoarding capped)
  → end cash ~1,012tr, Y1 net still +12.3 (in band). Shown as a funding-panel line.
- Sharpened the sweep flags (meter-health checks the HONEST cân-bằng school, not the
  intentionally cram-leaning default; 🍎 excluded from dead-state check since it is rare by design).
- **Sweep now reports ALL CLEAR**: economy in band, plural outcomes, 🍎 reachable, thesis holds.
  Confirmed contrast — honest school keeps TT 13/UT 9/TC 63; cram default TT 8/UT 3 (consequence).

## 2026-06-13 — Balance: the cá-mập-coin ending now fires (loop iter 17, sweep-driven)
- The game is *about* not mass-producing coin sharks, but the cá-mập-coin ending literally
  never fired (0%). Root cause: the vet/cram drag (VET_MULT) was halving the cá-mập stat too,
  so crammers could never build the hustle to qualify. Decoupled cm growth from the vet drag
  (gaming-the-system IS a cram skill) + nudged the cascade gate (cm≥52∧tn≤45∧vet≥50).
- Now cá-mập fires ~2% and the full dark arc works (sharks get arrested → BI_BAT appears).
  Sweep-verified; economy still in band; gates green. Remaining (ROADMAP): money sink + a
  deeper meter-recovery pass for the cram-leaning default.

## 2026-06-13 — Balance: Tiếng Tăm floor (loop iter 16, sweep-driven)
- The sweep found TT bled to ~1 over a run → admissions pool shrank → the campus slowly
  emptied (a liveliness bug, not just balance). Gave TT a FLOOR = 10 + 0.25×Uy-Tín: it still
  decays −1/mo, but only down to a baseline a working/reputable school keeps. Now stabilizes
  ~12; admissions stay healthy, the school stays full & lively. Hype-vs-uy-tín tension intact
  (TT still erodes; honest reputation lifts the floor). Sweep confirms: collapse flag gone,
  Y1 net still +12.3 (in band), pluralism/thesis unchanged. Gates green.

## 2026-06-13 — Gameplay simulator: sweep.js (owner directive)
- `node sweep.js` drives the DOM-free engine through 40 seeds × 5 strategies × 11 years and
  reports economy band, alumni-destiny distribution per strategy, 🍎-rate, and DESIGN-§1
  pluralism/dominance flags — so balance work is data-driven, not guessed.
- First findings (→ ROADMAP "Gameplay balance"): thesis HOLDS (craft → 🍎 in 43% of runs),
  economy in band; but Tiếng Tăm collapses to ~1, cash inflates to ~2788tr (no sink), and
  cá-mập-coin ≈ 0% (dark mirror barely fires). Added to skill as the standing balance tool.

## 2026-06-13 — Liveliness pass (loop iter 8): emotes + a campus cat
Chasing the north-star ("sunny, slightly chaotic little school you love watching").
- **Emote bubbles:** students occasionally pop a little pixel reaction above their head
  (♪ ❗ ♥ 💡 … 💧 ✨ ?), context-aware (music when performing, hearts at lunch, ideas while
  tinkering) — personality everywhere, the campus reacts.
- **Campus cat:** a wandering pixel cat roams the grounds — pure watch-it charm.
- Both cheap (live-layer flat ops); gates green.

## 2026-06-13 — Character variety (loop iter 7): students as individuals
- Expanded the sprite atlas from 3 hair colours to 12 baked VARIANTS per year — 3 skin tones,
  6 hair colours × 3 styles (short/long/bun), and accessories (glasses/bow/cap, weighted to
  none). Each student picks a stable variant by id-hash, so the 42-strong crowd reads as
  individuals instead of clones. Still pre-baked → blitted (60fps). Gates green.

## 2026-06-13 — Pixel-art props pass (loop iter 5): fill the campus
- Redrew ambient props as pixel-art to match the new style: chunky pixel TREES (replacing the
  old smooth circles that clashed), pixel LAMP posts with lit lanterns, a pixel flagpole.
- Added cute detail to fill the world: scattered FLOWER clusters (multi-colour) + low BUSHES,
  seeded so they never flicker. Removed the now-invisible eggshell marginalia. Gates green.

## 2026-06-13 — GRAPHICS OVERHAUL v2: detailed pixel-art (owner: "graphic still ugly")
Full visual pivot after the owner rejected the dark Sơn Mài Diorama. Owner chose detailed
pixel-art and flagged all four issues (tiny/plain characters, flat buildings, too dark,
unpolished). (The art-direction workflow died on socket errors; hand-built from the mandate.)
- **Characters:** a pre-baked sprite ATLAS — bigger ~16×22 chibis with real FACES (eyes,
  cheeks, mouth), hair variants, year-coloured uniforms, 2-frame walk, 1px outline. Baked once
  at boot (4 years × 3 hair × 2 frames) → blitted with drawImage, so 48 actors stay 60fps.
- **Buildings:** bright pixel-art — cream schoolhouses with red gabled roofs + shingles, the
  Căng Tin's striped awning, Lab's glossy roof, Phòng Máy's vented roof + cold windows, Xưởng's
  sawtooth, all with framed pixel windows, wooden doors, 1px outlines. Six instantly distinct.
- **Palette:** killed the near-black lacquer — bright sunny daytime grass with pixel texture,
  warm dirt paths, a light (not dark) vignette. Characters now POP instead of vanishing.
- **Crisp:** imageSmoothingEnabled=false + integer pixel discipline (flat fills, no gradients/
  arcs on sprites). Activity overlays (eat/study/zzz/sparks) repositioned for the bigger sprite.
- Gates green; verified home + all 6 building types + a settled lunch period at 390px.
- Skill updated: graphics is the standing #1 lever; use the `frontend-design` plugin for UI work.

## 2026-06-13 — Background music v1 (loop iter 3): state-aware campus-lofi
Owner directive ("background music… sound… a bit chill/relax"). Replaced the bare pentatonic
stub with a calm generative 3-layer bed — all procedural WebAudio, no asset files, defensive.
- **Layers:** a slow pad (triangle chord, long attack), a gentle pentatonic pluck melody, and
  a soft sub-bass pulse — connected through a master gain.
- **State-aware mood** (read live each note): `normal` warm major pentatonic · `tet` brighter +
  busier (Tháng 2) · `june` slower swell during a Lễ Tốt Nghiệp · `scandal` minor undertone
  when phốt seeds pile up / Tiếng Tăm collapses. Mood adapts within a cycle, no hard transition.
- **🎵 toggle** persisted in META.sound; **autoplay-unlock** on first tap (browsers block audio
  until a gesture). Verified: cycling all four moods headlessly throws no error; gates green.
- (Refactor swap recorded: the planned S1.5 art.js extraction was deferred — a ~350-line
  single-file split is mechanically risky to do *autonomously* with the owner away to catch a
  subtle visual regression; it'll be done in smaller chunked moves. BGM was the safer,
  explicitly-requested, owner-audible pick.)

## 2026-06-13 — The Player's Answer epilogue (loop iter 2): "Bản nháp bài luận của hiệu trưởng"
The open-question law (DESIGN §1) made playable. A 📜 button in the Trường tab opens a
draft-essay modal that holds up a MIRROR and never a verdict. Designed via a 3-lens
(ledger / draft-letter / question-echo) → synthesis workflow.
- Re-asks the real 2026 đề verbatim, then the founder CROSSES OUT every sentence that smells
  like a conclusion (struck `<s>` false-start; cross-out cut mid-word at "Tôi—").
- Points at the player's OWN graduates by name + chip + their own line; the 🍎 column is
  shown empty-or-full in the same neutral register (no path is ranked above another).
- Lays the three ledgers (bank / quỹ hiến tặng / the name-list itself) bare and refuses to
  weigh them — "Quyển nào to hơn thì… để Bộ duyệt."
- Bác Tâm gets one quiet physical line (never a moral); the đề returns identical as the LAST
  readable thing; close button is "Gấp bản nháp lại," never "done."
- 8 branch voices (steve/coin/vanmau/kysu/thuc/hype/that/kind) + empty-book guard, chosen
  from META/alumni-majority/meters. Pure view layer, derived on open, stores nothing.
  Templates in CONTENT.essay, thresholds in CONFIG.ESSAY, assembler in ui.js essayDraft().
- Verified at 390px across post-June (no-Steve), seeded-Steve, and empty-book states; gates green.

## 2026-06-13 — Campus life v1 (loop iteration 1): students keep a schedule
Designed via a 4-lens → synthesis workflow. Pure view layer (no sim/state change).
- **Day clock:** 5 real-time periods × 16s — class · recess · lunch · afternoon · tan học —
  animating even at speed 0 (chill ambiance), freezing only for modals.
- **Routing:** students walk to the right room's door-ring each period and DO the activity:
  sit-and-study at Phòng học (sky-kid daydreams a rising dot), eat a steaming bowl at Căng
  Tin, tinker with gold sparks at Xưởng (Năm-4 đồ-án-mode Tháng 2–5; spark-kids spark double),
  gather on the Sân with one shared bouncing ball (hype-kids perform, arms up), zzz when idle.
  Door-rings precomputed on map-dirty (cap 8/room, aggregated across instances); graceful
  wander-fallback when a room isn't built yet — so unbuilt rooms just mean fewer activities.
- **Perf:** base sprite unchanged; one duty-gated flat-op overlay per parked actor; the ball
  drawn once/frame after the actor loop. No per-frame strings/gradients/save-restore.
- Verified each period at 390px (class/recess/lunch all cluster + animate correctly).
  `window.__ui.setPeriod/_settle` test hooks added for deterministic period screenshots.

## 2026-06-13 — Campus art overhaul: Sơn Mài Diorama
Owner directive: "the graphic needs to be more detailed and more style." Replaced the flat
rectangles with a full art direction (synthesized via a 6-direction explore → 3-judge →
fuse workflow).
- **Ground:** near-black lacquer gradient dusted with ~320 deterministic vỏ-trứng eggshell
  flecks + a raised warm boardwalk path spine + a center vignette that melts edges into the
  dark-gold chrome. Figure-ground flipped so full-chroma students finally POP.
- **Buildings:** six visually distinct fake-iso pavilions — double drop shadow, front-wall
  extrusion, **gold-leaf frame** (the 26px separation win), lamplit windows. Each room type
  carries three redundant cues: unique roof (gabled / open-field / awning / glossy / flat+vents
  / sawtooth) + unique hue + warm-vs-cold window + a gable sigil. Sân is a real football pitch.
- **Students:** richer chibi — breathing contact shadow, 2-frame scissor legs, full-chroma
  body, per-year class marker (collar/sash/belt/grad-stole), hashed hair, gold collar tick,
  honor diamond (killed the per-frame ✦ fillText). ~8 flat ops/sprite → 48 hold 60fps.
- **Props:** seeded + capped, off walk lanes — lamp posts (gold glow), flagpole, trees,
  marginalia sigils (bulb/apple/∑ — the dry-satire counterweight to the reverent lacquer).
- One top-left light direction across everything; font-gated first paint. Gates green.

## 2026-06-13 — Tap-the-world inspect + /mvp/ retired
- **Interaction (owner decision):** the campus is now tappable. Tapping a student opens a
  non-pausing inspect card (stats, tell, hạt-giống potential, scholarship); tapping a room
  shows its description + how many students are nearby. Tabs stay for management — "tabs +
  tap-the-world." Antidote to the "everything's a button" feel. `window.__ui` test hook added.
- **/mvp/ retired (owner decision):** the parallel single-file build (older 3-grade spec)
  removed; the root multi-file v2 build is canonical. Salvaged ideas (phốt risk meter,
  export-save) parked in ROADMAP. Orphaned jsdom package.json removed.
- **Design:** DESIGN §1 "open-question law" — the game holds the đề philosophical; no
  dominant strategy, reflect-don't-impose, epilogue mirrors the player's own school back.
- **Skill:** added the ~10th-iteration code-structure review (owner directive).

## 2026-06-13 — S1 MVP (first playable)
Multi-file build flips the live link from placeholder to a playable university sim.

**Architecture (layer law from day one):**
- `js/data.js` — all CONFIG tunables + all CONTENT text. Zero logic, zero DOM.
- `js/engine.js` — state, deterministic sim, June ceremony, admissions, alumni FSM, funding.
  DOM-free and node-testable. Three RNG streams (sim/admissions/alumni) per DESIGN.
- `js/ui.js` — Kairosoft canvas (static campus + live walking sprites), HUD, panels, modals,
  minimal generative campus-lofi. Reads state only; owns no game numbers.
- `index.html` — shell + two stacked canvases + dark-glass/gold theme, Be Vietnam Pro.

**Systems live:**
- Calendar clock (10 ticks/day, pause/1×/2×/3×, 3× unlocks after first Lễ Tốt Nghiệp).
- 42-SV four-cohort boot (Mai Sương + Trần Phi Lợi scripted), per-cohort teaching presets,
  tuition, build placement (căng tin/lab/phòng máy/xưởng), teacher hiring.
- June two-stage ceremony: policy (Đồ Án Mẫu vs Bảo Vệ Thật) → 8-row graduation cascade
  with hidden tiềm-năng flag, entry-state line, near-miss line, viral-defense pierce.
- Admissions: deterministic pool, điểm-chuẩn histogram + cutoff/quota dials + forecast,
  cutoff stunts, BXH rank, auto-resolve when away.
- Alumni FSM (8 states) on isolated seed0 stream — byte-identical replay; gifts to quỹ;
  Trần Phi Lợi scripted arrest year 2; the 🍎 emerges years later, never at graduation.
- Funding: tuition/salary/maintenance economy, endowment ×1.004/month, pantheon
  scholarships (3) with growth-pipeline effects, scripted Trứng Vàng contract offer.
- Three meters (Tiếng Tăm decays, Uy Tín capped ±/yr with two pierce events, Thực Chất);
  light event deck; news ticker; autosave + v1→v2 migrator + Number.isFinite sanitize.

**Verification:** 5 node gates GREEN (FRESH/ADMIT/ALUM/COMPAT/BUILD via `./gate.sh`);
headless boot clean (no JSERR); 390px screenshots of home + June ceremony reviewed.

**Design:** added DESIGN §1 "open-question law" (owner directive) — the game holds the đề
philosophical and lets each player reach their own answer; no dominant strategy, reflect
not impose, epilogue mirrors the player's own school back. Queued: campus-life v1, the
"bản nháp bài luận của hiệu trưởng" epilogue.
