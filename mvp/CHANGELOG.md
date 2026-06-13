# mvp/ changelog — Học viện Steve (claude/usage-d28v69 build)

Isolated build living at **https://techeese.github.io/steve-job-vietnam/mvp/** so it runs
alongside the main session's `index.html` without collision. Only `mvp/` is touched here.

## 2026-06-13 — S1 MVP, first playable
- Single-file game (`mvp/index.html`) per MVP-SPEC.md: 3-grade boot (32 students incl. fixed
  Mai Sương + Trần Phi Lợi), pure `dayTick(S, rnd)` sim with the growth pipeline, mulberry32
  RNG (`?seed=`), 15×12 map (canvas, degrades headless), HUD + 4 tabs + bottom sheets.
- Build/placement (cangtin/lab/phongmay/xuong), presets per grade, hire pool, tuition.
- Sponsor temptation (Trứng Vàng) with rendered cost; June ceremony + 6-outcome graduation
  cascade + near-miss line; ranking ladder; Tết; 5-event deck; Phốt seeds + risk meter;
  scripted Trần Phi Lợi coin scandal (Y2).
- Save/sanitize/migrate + export; `window.__test` hooks + stable DOM mirrors.
- Gates (jsdom, no Chrome): GATE_FRESH / GATE_COMPAT / GATE_BUILD all green via `mvp/gate.sh`.
- Known: year-1 economy too loose (money ~408tr by Y2 vs spec +8..25tr/th) — next iteration.
