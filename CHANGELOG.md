# Changelog

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
