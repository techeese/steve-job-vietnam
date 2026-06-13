# Changelog

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
