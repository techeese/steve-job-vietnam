# MVP.md — First Playable `index.html` (one sitting)

Implementation spec for the first shippable slice of **Steve Jobs Việt Nam (Học viện Steve)**. Everything here is decided; do not re-decide design. Where a number conflicts with anything else you've read, THIS file wins for the MVP. All balance constants live in one `CONFIG` object near the top of the file.

## 0 · The slice in one paragraph

You buy a bankrupt cram school with **three grades already enrolled**. 3-year arc ≈ 18 min at 1×: June year 1 — the inherited văn-mẫu lớp 12 sits the exam (cram scores well NOW) and graduates grey; year 2 — their worst alumnus detonates a scandal (the LATER bill) while a quality applicant arrives citing your virtue (the SECRET payoff); June year 3 — YOUR cohort graduates, with a real shot (~10–20% at deliberate thực-chất play) at 🍎 Steve Jobs Việt Nam. After year 3: end-of-arc summary + one scripted alumni letter, then sandbox continues.

## 1 · Tech skeleton (proven Nuôi Anh patterns, verbatim in spirit)

- Single `index.html`. First script statement: `window.onerror = (m,s,l)=>{document.title='JSERR: '+m+' @'+l}`.
- **Clock:** `setInterval(100ms)`; each interval advances `S.speed` logic ticks (pause=0/1×=1/2×=2; 2× unlocked at end of HK1). **10 ticks = 1 day.** `dayTick()` is a PURE function of (S, rnd) — all sim logic lives there. Month = 30 days; months run Tháng 9→12, 1→8; year = 360 days = 6 min at 1×.
- **rnd():** mulberry32 with `S.rngState` persisted, always on; boot accepts `?seed=123`. ALL gameplay rolls use rnd(); ALL cosmetics (wander, particles) use Math.random.
- **Canvases:** `#mapStatic` (repaint on build only) + `#mapLive` (rAF, skip when hidden/covered). dpr-scaled, `imageSmoothingEnabled=false`, integer coords. Sprite atlas painted once at boot (10 palettes × 4 frames, ~18×22px chibi, fake-3/4: front-face strip + head overlapping tile above).
- **View/state split:** sprite positions/paths in a volatile `view` map keyed by id — never in S, never saved. BFS pathfinding on the grid; rooms block except a door tile at bottom-center. Day schedule (4 periods: sáng1, sáng2, trưa→căng tin/sân, chiều→preset room) drives both walking targets and NOTHING else — gains come from `dayTick()` only.
- Autosave every 5s + `visibilitychange`/`pagehide`. Offline frozen; "Trường vẫn đứng yên chờ hiệu trưởng" toast on return.

## 2 · Map & rooms

**Grid 15×12, TILE = 26px** (15×26 = 390 full-bleed; map block 312px tall + drawn tree border). No camera/pan/zoom.

Pre-placed: **Phòng học** 3×2 at (2,2) · **Sân** 4×3 at (9,8) · cổng + Bác Tâm sweeping sprite (pure cosmetic, 1 diary line per season in term reports).

Build menu (4 entries):

| Room | Size | Cost | Effect |
|---|---|---|---|
| Căng tin cũ | 2×2 | FREE, scripted at 0:15 (bank threw it in) | +1 Mood/tháng all students |
| Phòng Lab Sống Ảo | 2×2 | 70tr | +0.5 Tiếng Tăm/tháng aura; PR/TVC events host here; ZERO learning. Prettiest sprite in the game. The trap. |
| Phòng Máy | 3×2 | 120tr | unlocks full Dự Án TN/ST gains (else −50%) |
| Xưởng Chế | 3×3 | 200tr | +1 TN on Dự Án; +5 Thực Chất once; +20% showcase-thật win odds. Visually messy, no Tiếng Tăm aura. |

Placement: tap card → ghost offset 40px above finger, green/red → floating ✓/✗ buttons (never confirm on lift). Occupancy grid derived via `rebuildGrid()` from S.rooms; never serialized. Tap built room → info card (effect, "Dỡ bỏ" 50% refund).

## 3 · Roster at boot (32 students, cap 36; 2 teachers + hire pool 4)

Students `{id, ten, grade, kt, tn, st, cm, mood, vet, seed, tell, tier, flags}`:
- **Lớp 10 (12, yours):** KT 15–30, TN 5–20, ST 15–35, CM 5–20, Mood 65–80, Vẹt 0–10, seed rolled (30/30/20/13/7% for 1–5). **One fixed kid: Mai Sương** — seed 5, ST 35, tell `'sky'` (the guaranteed Spark-ish student of every first run).
- **Lớp 11 (10, inherited):** KT 40–60, TN 5–15, ST 10–25, CM 10–25, Mood 40–55, Vẹt 30–50.
- **Lớp 12 (10, inherited zombies):** KT 65–85, TN 5–15, ST 5–20, CM 10–30, Mood 35–50, Vẹt 60–85. **One fixed kid: Trần Phi Lợi** — KT 55, TN 25, CM 65, Vẹt 80 (deterministically graduates Cá Mập Coin; his scandal is scripted for year 2).

**Sprite tells (ship all 4, they are the watchability budget):** seed-5 → 1s sky-stare 💡 (never explained); TN≥60 → toolbox + free prop repair animation; teacher trait `tch` → lightbulb chain (8%/day: random student of his grade +2 ST, visible); cosmetic flag `cudem` (rolled 15%) → zzz bubble in period 1. Event bubbles spawn over the involved student's head.

Teachers `{id, ten, day, dien, luong, trait, grade}` (Dạy/Diễn 0–10; salary formula 8+2.5×(D+Đ) with overrides):
- Inherited: **Thầy Thể Dục Kiêm Bảo Trì Kiêm MC** (2/2, 18tr; auto-covers any grade with no assigned teacher) · **Cô Văn Mẫu** (2/9, 22tr override — "hợp đồng biên chế cũ: không tăng lương, không nghỉ việc").
- Hire pool (sheet shows 4; budget realistically allows 1 now): **Thầy Coder Tự Học** (9/1, 15tr override, trait `tch`) · **Thầy Diễn Giả Truyền Cảm Hứng** (1/10, 25tr; +5 Mood all on hire month, −3 two months later) · **Cô IELTS Pitch Deck** (5/8, 35tr) · **Thầy Cựu Kỹ Sư Phương Đông** (9/3, 38tr, trait `tch` — the aspirational hire).
- Assignment: per-teacher grade dropdown in Nhân sự sheet (default auto: best Dạy → lớp 10). Teacher mult = 0.5 + Dạy/10 of the assigned (or fill-in) teacher.

## 4 · Stats, presets, growth (the dial)

Student card shows **4 bars (KT · TN · ST · CM) + Mood emoji + Vẹt as 🦜 pips** (1 pip per 20). Hạt Giống hidden (sky-stare is the only leak).

Per-day gains = monthly rate ÷ 30, through the canonical pipeline:
`TN/ST: base × (0.5+Dạy/10) × (0.7+0.15×seed) × (1−vet/150) × (1+stat/150)` · `KT: base × (0.5+Dạy/10) × (kt>70 ? 0.5 : 1)` · all ×0.5 if mood<50 · clamp 0–100. KT rust: −0.5/tháng when KT>60 and preset ≠ Lò Luyện Đề. Mood<30 → monthly 10% dropout roll (−5 TT, ticker line).

Presets per grade (set in 📊 Trường sheet; term modals re-prompt):

| | KT | TN | ST | CM | Mood | Vẹt/th | Cost |
|---|---|---|---|---|---|---|---|
| Lò Luyện Đề (inherited default) | +4 | 0 | −1 | +0.5 | −2 | +2 | — |
| Cân Bằng | +2.5 | +1 | +0.5 | +0.5 | 0 | +0.5 | — |
| Dự Án Thực Hành | +1 | +2 | +1.5 | +1.5 | +1 | −1 | 1tr/hs/th |

School meters: **Tiếng Tăm** start 25, −1/tháng flat, clamp 0–100. **Uy Tín** start 10, net ±3/year cap (viral essay +5 pierces it), never decays; HUD shows rumor text until first graduation (June Y1), then the number; `#uyTinVal` ALWAYS contains the integer (gate surface) — CSS swaps the visual. **Thực Chất** start 30; monthly +0.5 per grade on Dự Án / −0.5 per grade on Lò; one-time: Xưởng +5, Lab Sống Ảo −3, sponsor accept −3 / refuse +2, showcase thật +2 / gà −3; exam policy ±3/year.

## 5 · Screens & panels (exact list — nothing else exists)

1. **Boot card:** 3-line premise + footer disclaimer + nút "Nhận trường". School name fixed: "Học viện Steve (tên đầy đủ đang chờ Sở duyệt)".
2. **HUD** 56px: 💰`#moneyVal` (tr, 1 decimal) · gold bar `#tiengTamVal` · `#uyTinVal` (rumor/number) · `#yearVal` "Năm 1 · Tháng 9" · ⏸/▶/▶▶.
3. **Map** (2 canvases) + **ticker** 24px.
4. **Tabs** 56px+safe-area: 🏗️ Xây (room cards) · 👩‍🏫 Nhân sự (staff rows + hire pool + grade dropdowns) · 🎓 Học sinh (rows: name, lớp, mini bars, mood emoji → detail card: 4–5× scaled atlas sprite as portrait, bars, 🦜 pips, current preset) · 📊 Trường (preset per grade, tuition stepper, ranking ladder, **"Nguy cơ phốt: X%/năm"** `#photRiskVal`, Thực Chất bar, export/import save).
5. **Bottom sheets** max 62vh, depth-2 nav (list→detail), backdrop-tap closes.
6. **Modals (auto-pause):** term report (end Tháng 12 & Tháng 5: thu/chi, Bác Tâm diary line, preset/hire prompts) · sponsor offer · June ceremony · graduation flips · recruiting (Tháng 7) · Tết card (Tháng 1: +10 Mood, +10tr lì xì) · end-of-arc summary (June Y3).
7. **Event bubbles (NON-pausing):** hover 10s over the student's head, auto-resolve to [Lờ đi]; tap → small choice sheet (pauses while open, ≤3 options).

**Scripted minutes 0–3 (tutorialStep-gated):** 0:15 place the free Căng tin (placement-mode tutorial) → 0:45 bubble: *"Mai Sương tháo chuông trường ra xem — 'nó kêu lệch nửa nốt'"* [Kỷ luật: +2 KT lớp, Sương −5 ST / Lờ đi / Đưa em tua vít: Sương +3 TN, virtue flag] → 1:15 hire prompt (pool of 4, the cô-Văn-Mẫu-đã-có vs thầy-Coder fork) → 1:45 preset prompt highlighting lớp 10 → 2:30 **sponsor modal**: Tập đoàn Trứng Vàng, 80tr NOW + logo + 1 PR event/tháng — while the player stares at ~120tr cash and a 120tr Phòng Máy. Accept → +80tr, +3 TT, 1 Phốt seed (sev 1), Thực Chất −3, and **the cost is RENDERED**: 3 days/tháng your top-3 (ST+TN) students rehearse at the Lab/Sân (gains zeroed those days, motes visibly stopped), +2 TT per PR month. Refuse → +2 Thực Chất, +1 Uy Tín, virtue flag, bác Tâm gật đầu (one nod animation — juice asymmetry is law).

## 6 · Money (year-1 must feel tight; sweep-verify net +8..+25tr/tháng honest)

Start 120tr. Tuition default 2tr/hs/th (stepper 1–6 by 0.5; **ceiling = 1 + TT/10 tr** +0.5 if rank≤2; above ceiling → next pool halved + mood −1/th). Income m1 ≈ 64tr vs salaries 40tr (+hire) + bảo trì 0.7%/th of (150tr book + builds) + Dự Án materials. Term-report kế toán line nudges: "Học phí 2tr là giá thời chủ cũ. Trần hiện tại: 3.5tr."

## 7 · Events (12 bases + name-variants ≈ 20 felt; no-repeat within a year; predicate-gated)

1 Mai Sương chuông (scripted) · 2 Lê Minh Bão lén code game trong giờ luyện đề [Kỷ luật/Lờ đi/Cho mượn phòng máy sau giờ: −2tr, +4 TN, virtue flag] · 3 (sponsor accepted) TVC quay tại Lab [+3 TT +1 seed / Từ chối, 2 lần → sponsor hủy] · 4 (💎 tier exists ∧ rank≥3) phụ huynh Kim Cương đòi thứ hạng [Hứa: +2 Vẹt cohort / Nói thật: 20% em đó rời trường] · 5 (Xưởng ∧ Dự Án) cháy nhỏ ở Xưởng [Giấu: +1 seed sev2 / Báo cáo + mời PCCC: −2 TT, virtue flag] · 6 (mood<40 any) em đòi bỏ học làm KOL [Học bổng −10tr giữ lại, virtue / Để đi] · 7 (lớp 12 on Dự Án) Cô Văn Mẫu xin tăng giờ luyện [Đồng ý: +2 KT +3 Vẹt lớp 12 / Từ chối: +1 Thực Chất] · 8 (Tháng 5) tin đồn lộ đề [Mua 15tr: 70% +0.5 điểm, 30% seed sev3 / Không mua] · 9 (Tháng 3, yearly) **Hội thi Sáng tạo Trẻ** [Luyện thật: 40% (+20% với Xưởng) → +8 TT +25tr, +5 CM participants / **Gà bài**: 90% win, +15 Vẹt em đó, +1 seed sev2 / Bỏ qua] · 10 mất trộm máy chiếu [Sửa 5tr / Kệ: mood −2] · 11 (TT≥30) trend "Vũ Điệu Đổi Mới Sáng Tạo" [Quay: +4 TT, gains −25% 1 tuần / Cấm: học sinh quay lén, 50% +6 TT, mood −2] · 12 Bác Tâm sửa máy chủ (no choice; saves 2tr; introduces him). Variants: 2/4/6/10 re-skin with different student names.

**Phốt v0 (real, minimal):** seeds from sponsor accept, gà bài, mua đề, Văn Mẫu Đậm Đà (1/year). Roll each Tháng 9 day 1: p = (0.08+0.04×sev)×(1+TT/50) per seed; trigger → news modal, TT −(15+5×sev)×(1+TT/50), UT −2, next pool −2, seed consumed. Live `#photRiskVal` = 1−Π(1−p). **Plus ONE scripted detonation** (fires regardless, Tháng 3 năm 2): *"Cựu học sinh Trần Phi Lợi bị bắt — sàn coin XÔIĐỖ sập"* → TT −15×(1+TT/50), UT −2, note: "khóa này tốt nghiệp thời chủ cũ" (teaches the alumni-bomb mechanic without cheating the player). **Virtue payoff (scripted, Tháng 7 năm 2, predicate ≥2 virtue flags):** an extra applicant card appears, seed 5, Học Bổng tier, event text citing the player's actual flagged choice ("nghe đồn trường này dạy thật — chuyện cái tua vít"). Uy Tín rumor line upgrades.

## 8 · June beat + ONE graduation system (fires every June; 6 outcomes)

Ceremony modal, 4 beats: **(1)** Đề (yearly variant text, in canon order, + 1 meme status) → **(2)** policy button: **Văn Mẫu Đậm Đà** (+1.0 điểm all, +5 Vẹt cohort, +1 seed sev1, 50% coin-flip: +4 TT or "43 bài giống nhau" −6 TT) vs **Tự Luận Thật** (raw, viral chance ×2) → **(3)** results: per student điểm = clamp(2 + 0.06×KT + 0.02×Vẹt + policy + rnd(±0.5), 0, 10); đỗ ≥5.0; school avg vs rivals **Học viện iSteve Toàn Cầu** (7.6/7.9/8.1 by year), **THPT Bán Công Bình Thường** (6.3+noise), **Trường Làng Bến Sung** (5.4+noise); rank → TT (+8/+4/+1/−3), ceiling bonus, pool size → **(4)** mirror: essayQ = 0.5×ST+0.3×TN+0.2×UyTín per grad; top quote from STATIC line banks (bank A văn mẫu ×3 shown IDENTICAL side-by-side if cohort avg Vẹt≥60 — the visual gag; bank B thực chất incl. "con ốc M2 toét ren"; bank C hệ-sinh-thái); essayQ≥70 → viral 30% (60% under Tự Luận Thật): +10 TT, +5 UT.

Then **graduation flips** (rarest last), cascade in priority order, first match wins:

| Pri | Outcome | Gate |
|---|---|---|
| 1 | 🍎 Steve Jobs Việt Nam | ST≥90 ∧ TN≥80 ∧ CM≥70 ∧ Vẹt≤60 ∧ ThựcChất≥60 |
| 2 | 🪙 Cá Mập Coin | CM≥60 ∧ TN<40 ∧ Vẹt≥50 |
| 3 | 📋 Quán Quân Văn Mẫu | KT≥80 ∧ Vẹt≥60 ∧ ST<40 |
| 4 | 👷 Kỹ Sư Chân Chính | TN≥70 |
| 5 | 📱 Reviewer Công Nghệ Triệu Sub | CM≥70 ∧ TN 40–69 |
| 6 | 💼 Nhân Viên Lương Ổn | default |

Card shows sprite, outcome + one-liner (use canon flavor text), 2–3 deciding checks ✓/✗, and the **near-miss line** if any single failed check of a higher outcome missed by ≤10: "Thiếu {n} điểm {stat} nữa thì… thôi, không nói nữa." Jobs triggers the keynote parody screen (black turtleneck sprite, "Một thứ nữa…") — the biggest celebration in the game.

**Recruiting (Tháng 7 modal):** pool = 6 + (4−rank)×2 cards {name, 1 revealed stat, others '?', tier badge}; tiers: 💎 Kim Cương ×3 tuition (8%), 🎓 Học Bổng pays 0, seed +1 bias (15%), Thường. Pick up to (36 − roster). No scout actions (L3). Graduates leave the map; lớp 11→12, 10→11.

**End-of-arc (June Y3):** summary screen (money, TT, UT, Thực Chất, alumni table, Jobs-or-near-miss callout, Bác Tâm's diary line of the year) → post-credits **one scripted alumni letter** 30 days later: if ≥1 Kỹ Sư Chân Chính: "+50tr — 'Cảm ơn thầy đã không bắt em học thuộc.'"; else a politely sad Lương Ổn postcard. Sandbox continues (loop keeps running; deck thins; that's fine).

## 9 · Save model

`SAVE_KEY = 'steve-jobs-vn-v1'`. Two trees. `freshState()` returns the COMPLETE shape (every field, sane default) for typeof-merge in load():

```js
S = { v:1, rngState:0, money:120, day:1, month:9, year:1, speed:1, speed2Unlocked:false,
  tiengTam:25, uyTin:10, uyTinRevealed:false, thucChat:30, tuition:2,
  rooms:[{t:'phonghoc',x:2,y:2},{t:'san',x:9,y:8}],           // {t,x,y} only; grid DERIVED
  students:[/*{id,ten,grade,kt,tn,st,cm,mood,vet,seed,tell,tier,flags:{}}*/],
  teachers:[/*{id,ten,day,dien,luong,trait,grade}*/], hirePool:[ids],
  presets:{g10:'canbang',g11:'luyende',g12:'luyende'},
  sponsor:{offered:false,accepted:false,refusals:0},
  photSeeds:[/*{src,year,sev}*/], virtueFlags:{tuaVit:false,refusedSponsor:false,pccc:false,scholarship:false,honestExamYears:0},
  usedEventsYear:[], eventLog:[], rank:4, examHistory:[], alumni:[/*{id,ten,outcome,year}*/],
  scriptedFired:{coinScandal:false,virtueApplicant:false,almLetter:false}, tutorialStep:0, lastSeen:0 }
META = { v:1, bangVang:[], essayLines:[], jobsEver:false, settings:{}, records:{} }
```

`sanitize()`: `bad = v => !Number.isFinite(v)` (NEVER bare isFinite); sweep every numeric, clamp all 0–100 meters/stats, vet 0–100, seed 1–5; `S.rooms = rooms.filter(r => r && ROOMS[r.t] && Number.isInteger(r.x) && fitsGrid && !overlapsEarlierRoom)`; students filtered (name string, stats finite) and `.slice(0,36)`; teachers likewise. `rebuildGrid()` after every load/sanitize/build/demolish. View state respawns actors at assigned doors. Export/import = base64. `wiping` flag guard on save().

## 10 · Headless-test hooks & gates

`window.__test = { S:()=>S, days:n=>{while(n--)dayTick()}, place:(t,x,y)=>tryBuild(t,x,y), draw:()=>repaintStatic(), event:id=>fireEvent(id) }` — always present. DOM mirrors (assertion surface, stable ids): `#moneyVal #yearVal #studentCount #tiengTamVal #uyTinVal #photRiskVal`.

`gate.sh` (Nuôi Anh structure): node-parse every script block, then headless Chrome `--virtual-time-budget --dump-dom`, grep `<title>`:
- **GATE_FRESH:** boot `?seed=123` → `__test.place('cangtin',6,5)` → `__test.days(400)` → assert title `GATE_FRESH MONEY=<finite> YEAR=2 STU=<26..36>`, no JSERR (covers June Y1 exam + graduation + recruiting headlessly).
- **GATE_COMPAT:** python-seed a year-2 localStorage save (3 rooms, 3 teachers, 30 students, rngState, 2 photSeeds) → boot → HUD reflects seeded wealth/roster → `__test.days(30)` ticks clean.
- **GATE_BUILD:** `__test.place` on an occupied tile returns false and mutates nothing (JSON.stringify(S) unchanged).

Mirror dayTick constants in `engine.js` (copy CONFIG) when tuning; sweep targets: honest net +8..+25tr/th year 1; theater cash 1.3–1.5× virtue years 1–3; deliberate thực-chất run reaches reduced Jobs gate 10–20%; pure-cram lớp 10 ends Vẹt>60 (Jobs-locked) and mood-bleeds by year 2.

## 11 · Real vs stubbed (and the trim line)

**REAL:** everything in §1–10. **STUBBED:** Uy Tín downstream effects (display + essay formula only); Hạt Giống reveal UI (silent multiplier + sky-stare); personalities (cosmetic chips); alumni system (2 scripted events + alumni[] array); traits beyond the seeded tells; grant/thanh tra; scouting; Chuộc Lỗi; prestige/Di Sản (META collects bangVang only); school-name picker (fixed name); rival events (score rows only); audio (none); Tết beyond one card.

**If the sitting overruns, cut IN THIS ORDER:** recruiting UI → auto-fill cohort (keep the tier flavor in the toast); Tết card; events 10–12 + variants (floor: 8 bases); showcase event 9; Phốt v0 rolls (keep the scripted Trần Phi Lợi scandal + the seed counter display). **NEVER cut:** 3-grade boot, June ceremony + graduation cascade + near-miss line, sponsor temptation with rendered cost, the 4 sprite tells, ranking ladder, juice asymmetry, save/sanitize/gates, 390px pass. Plan sittings: (1) this file to gates-green; (2) deck expansion + L1 polish; (3) alumni/Phốt full pair — per the roadmap in DESIGN.md.
