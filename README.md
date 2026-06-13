# Học viện Steve

*A sunny, slightly chaotic little Vietnamese university you build from an empty lot — and secretly, a
**playable essay** on the real 2026 THPT đề Văn:*

> ### “Làm thế nào để Việt Nam có những *Steve Jobs Việt Nam*?”

You don't get told the answer. You found a school, set its philosophy, and **watch the little people grow up
and scatter into the world** — as engineers, founders, văn-mẫu clerks, coin sharks, the occasional graduate
who never comes back… and the rare 🍎. You arrive at **your own** answer.

### ▶ Play: **https://techeese.github.io/steve-job-vietnam/** &nbsp;·&nbsp; best on a phone

<p align="center"><img src="docs/cover.png" width="300" alt="Học viện Steve — the campus at recess"></p>

---

## What it is

A satirical **university-management sim** in the Kairosoft register (build rooms, set policy, watch it tick) —
**not a clicker**. It's Vietnamese-first, dry rather than cruel, and entirely fictional. The whole game is a
quiet argument that you can't *manufacture* a Steve Jobs by drilling for exams — but you also can't be sure
what does work, so it hands you the question instead of a verdict.

## What you'll see

- **A campus that breathes.** Hand-baked 24×32 pixel-art students arrive through the cổng, file into class,
  play football at recess, **chat in clusters**, livestream in the Sống Ảo khoa, doom-scroll after class,
  build real things in the Xưởng. Day-arc lighting, drifting cloud-shadows, **sun-rays and gentle rain**
  (with umbrellas), Tết petals and graduation confetti.
- **Biographies, not scores.** Every graduate gets a life that spans years and *switches states* — the
  ★★★★★ talent who becomes a coin shark and then gets arrested; the quiet one who becomes a kỹ sư and sends
  money home. Tap any name in the **Sổ Cựu SV** to read their journey. They even **stroll back to visit**.
- **The destiny cascade.** Graduation produces *potential*; the world decides destiny via an alumni state
  machine. The 🍎 (a real creator) is rare and earned. The văn-mẫu clerk and the coin shark are the traps.
- **Khoa life with stakes.** Majors with synergies and trưởng-khoa, and an annual **Cúp Khoa** — a
  multi-year trophy pennant race; the reigning khoa even flies its colours over its own building.
- **Choices with moral tension.** Topical, fictional events — văn mẫu, học thêm, AI làm hộ, the Nuôi Em
  scandal, brain drain, the pull of a “safe” career — each a real fork. Dark payoffs get confetti; virtue
  gets one quiet nod.
- **An honoured pantheon** of real Vietnamese educators (Trần Đại Nghĩa, Tạ Quang Bửu, Hồ Xuân Hương),
  reverent-only — funded by an endowment you can grow.
- **A closing essay** assembled from *your* graduates — the đề Văn answered by the faces that crossed your
  sân, never by a lecture.

## How it's built

A dependency-light **static web game** — no framework, no build step, just `index.html` + a few JS modules,
deployed on GitHub Pages. The architecture is strictly one-directional and tended as a living thing:

```
data.js     numbers (CONFIG) + text (CONTENT) — no logic
engine.js   state + simulation — DOM-free, node-testable (the destiny FSM lives here)
art.js      pure pixel-art drawers (rooms, props, tiles)
sprites.js  the character bakery (24×32 chibi atlas + customizer)
audio.js    generative campus-lofi + musical SFX (no asset files)
ui.js       canvas render + HUD + panels + modals (orchestration)
```

`ui → {art, sprites, audio} → engine → data`. The engine is pure enough to play headlessly.

### Verification

```bash
./gate.sh        # engine gates: fresh boot, admissions, alumni-replay determinism, save migration, builds
node sweep.js     # 40 seeds × 5 strategies × 11y — checks the destiny thesis (no dominant strategy)
./bot.sh          # full-game in-browser smoke test: plays 11 years, renders every tab, asserts no JSERR
```

## Tone

Satire anchored in real cultural moments, dry and affectionate, all characters fictional. Honoured real
names are reverent-only. The game holds the question open — it reflects consequences, it never lectures.

---

*Built iteratively, in the open. See [`CHANGELOG.md`](CHANGELOG.md) for the story of how it grew, and
[`VISION.md`](VISION.md) / [`DESIGN.md`](DESIGN.md) for the north star and the settled law.*
