# Steve Jobs Việt Nam (Học viện Steve) — Design Charter

> The north star for every change. If an improvement fights this document, the improvement loses.
> This is the CANONICAL merge of five subsystem designs. Where they disagreed, this document is the tiebreak — no other spec sheet exists.

## What this game is

A **satirical Vietnamese school-management sim** in the Kairosoft register (Pocket Academy / Game Dev Story): a hand-drawn campus full of tiny walking students, watched from above, managed in small decisions, evaluated once a year with fanfare. **NOT a clicker** (owner rule): taps are choices or curiosity, never rate. Offline, time is frozen — the school sleeps when you do.

**Premise.** After the real June 2026 đề thi tốt nghiệp THPT môn Văn asked *"Làm thế nào để Việt Nam có những 'Steve Jobs Việt Nam'?"* and the nation debated it, your founder takes the question literally — and buys a bankrupt cram school, **Trường THPT Dân lập Văn Mẫu Số 9**, to convert it into an academy that MANUFACTURES one. The school's display name is the game's own running joke: **"Học viện Steve (tên đầy đủ đang chờ Sở duyệt)"** — because "Steve Jobs Việt Nam" can't be a school name, the same way it can't be a KPI.

**The exam hook.** Every in-game June, the đề Văn asks the question again, in mutating phrasings (canonical yearly pool, used in order):
1. *"Làm thế nào để Việt Nam có những 'Steve Jobs Việt Nam'?"* (đề gốc, cả nước rung chuyển)
2. *"'Steve Jobs Việt Nam' — khát vọng hay khẩu hiệu? Trình bày suy nghĩ của anh/chị."*
3. *"Hai năm sau ngày cả nước đi tìm Steve Jobs Việt Nam, có ý kiến cho rằng chúng ta đang tìm nhầm chỗ. Anh/chị có đồng ý không?"*
4. *"Có nên 'sản xuất' thiên tài? Bàn luận."*
5. Đề trích nguyên văn một bài làm năm 1 — if your school is thực chất, the most honest essay in the country has become… văn mẫu. The loop closes.

Your lớp 12 sits it every year; the ceremony is your pedagogy's annual report card.

**Everything is parody.** All characters, companies and schools are fictional; the footer disclaimer stays forever: *"Mọi nhân vật, công ty, học viện trong game đều là hư cấu. Mọi sự trùng hợp là do vũ trụ thích đùa."*

## The canonical spec sheet (one language, no dialects)

- **Student stats (visible, 0–100):** KIẾN THỨC (KT, exam knowledge) · TAY NGHỀ (TN, real craft) · SÁNG TẠO (ST) · CHAI MẶT (CM, route-neutral hustle/grit — absorbs Chém Gió + Chịu Nhiệt) · MOOD (friction stat).
- **Hidden per student:** HẠT GIỐNG 1–5 (potential seed; absorbs caps/Tố Chất; multiplies gains ×(0.7+0.15×seed)) · **VẸT 0–100** — the SINGLE dark-residue counter (absorbs Rỗng). Vẹt helps exam scores NOW, multiplies all TN/ST gains ×(1−Vẹt/150), and disqualifies the best outcomes. Displayed as 🦜 pips on the student card (legibility is the satisfaction; in-fiction, outsiders can't see it).
- **School:** CHỈ SỐ THỰC CHẤT 0–100 (the emergent dial — no literal slider) · TIẾNG TĂM 0–100 · UY TÍN 0–100.
- **Teacher stats:** DẠY (0–10, real teaching) + DIỄN (0–10, theater value). Salary = 8 + 2.5×(Dạy+Diễn) tr/tháng, with per-archetype overrides justified in flavor (Thầy Coder Tự Học is cheap because *bằng cấp* is what the market prices). "Truyền cảm hứng" is a teacher TRAIT (visible +2 Sáng Tạo lightbulb-chain proc), not a stat.
- **Clock:** 1 in-game day = 1.0s at 1× (fixed-step: setInterval(100ms), 10 ticks = 1 day; speed multiplies ticks-per-interval, never tick size). Speeds pause/1×/2×; 2× unlocks after the first term. Month = 30 days = 30s. Year = 6 min. Run cap = 12 niên khóa ≈ 60–90 min active play.
- **Map:** 15×12 tile grid, TILE = 26 CSS px (15×26 = 390, full-bleed), no camera in MVP; growth expands DOWNWARD with one-axis pan.
- **Outcomes:** deterministic threshold CASCADE (priority order, first match wins). No probabilistic outcome rolls. Residual randomness is seeded from studentID + final stats — reloading cannot reroll a destiny.
- **Roster cap:** 3 grades × 12 = 36 students.

## Core loop & time model

**Calendar (the Vietnamese school year IS the structure):** Tháng 9–12 Học kỳ 1 → Tháng 1–2 Tết window (lì xì, mood, one event) → Tháng 2–5 Học kỳ 2 → **Tháng 6 KỲ THI TỐT NGHIỆP** (the spine beat) → Tháng 7–8 hè: tuyển sinh + xây dựng.

**You never start from zero.** At boot the failing school comes with three grades: your fresh lớp 10 (12 kids, recruited by the founder), an inherited lớp 11, and an inherited lớp 12 of văn-mẫu zombies (high KT, Vẹt 60–85, low everything else, mood in the gutter). Consequences of this one decision: June year 1 has real examinees at minute ~5; the first graduation at minute ~6 teaches the outcome system with kids you didn't shape; the previous owner's worst graduate detonates the first scandal in year 2 (the LATER bill lands inside the first session); and tuyển sinh fires every summer.

**The cadence contract (enforced, not aspirational):**
- **SPECTACLE every 10–20s:** stat motes (⭐ thành tích / 💡 thực chất) flying into the HUD, walking schedules, sprite tells, free repairs, lightbulb chains. The screen is never static; the player watches learning be manufactured.
- **CHOICE every 30–60s:** a speech bubble over a specific named student/teacher. Bubbles do NOT pause the game — they hover ~10s and resolve to [Lờ đi] if ignored (ignoring is a choice). Tapping opens a 2–3 option card; ~70% micro-stakes flavor, ~30% move real numbers. No-repeat within a year.
- **MANAGEMENT every 2–3 min:** term boundary (auto-pause modal): giáo án preset per grade, hire/fire, build one room, sponsor offers.
- **FANFARE every ~6 min:** June — exam ceremony flowing into graduation card flips (rarest last), then summer recruiting. The double-beat players screenshot.
- **Auto-pause ONLY for:** term/year modals, placement mode, decision sheets the player opened. Auto-save continuously; closing mid-anything is safe. Offline = frozen, with a one-line "Trường vẫn đứng yên chờ hiệu trưởng" toast on return.

## The moral tension system (the actual point)

One mechanical sentence the player FEELS rather than reads: **Tiếng Tăm decays and must be fed; Uy Tín never decays but moves slowly and only from real outcomes.** Thành tích is a treadmill; thực chất is a ratchet.

- **TIẾNG TĂM (hype)** — big gold meter in the HUD. Decays **−1/tháng flat**. Fed by ranking, showcase medals, viral moments, the sống-ảo lab, sponsor PR. Drives: applicant QUANTITY, tuition ceiling, sponsor offer size/frequency. Volatile: every scandal's damage = base × (1 + TiếngTăm/50) — *càng nổi càng dễ bị bóc*.
- **UY TÍN (quiet credibility)** — never decays, hard cap ±3/year (single exception below). Fed ONLY by real outcomes: June essay quality, alumni doing real things, refusing dirty deals. Drives: applicant QUALITY (Hạt Giống distribution), master-teacher applications, alumni-gift multiplier, true-ending access. **Displayed as rumor text only until the first graduation**, then as a small unexplained number — hype reads on a billboard, substance only in retrospect. That asymmetry IS the satire.
- **The once-a-year beacon:** a graduate essay of quality ≥70 can go viral → +10 Tiếng Tăm AND +5 Uy Tín (pierces the annual cap) — the one event where both currencies agree.

**Dark pays NOW, loudly.** Sponsor lump sums (60–300tr; first offer 80tr ≈ months of profit, landing while you covet a 120tr Phòng máy), gà'd showcase medals, cram-driven ranking jumps, Văn Mẫu Đậm Đà exam policy. **JUICE ASYMMETRY is a named, enforced rule:** dark payoffs get confetti, coin sounds, the gold meter swelling, parents queueing as sprites; virtue payoffs in the same moment get a teacher's nod and one nhật-ký line. The game seduces with presentation exactly like thành-tích culture does — the player must occasionally catch themselves enjoying it. **Dark costs are RENDERED, not tooltipped:** accepting a sponsor means your best students physically rehearse showcases (motes stopped) while the Xưởng sits empty.

**Dark bills LATER, legibly.** Every dark act appends a **Phốt seed** {act, year, severity} to a hidden list. Each school-year start, each seed rolls (0.08+0.04×sev) × (1+TiếngTăm/50) to detonate: news event, Tiếng Tăm −15..−25 (×fame multiplier), −2 Uy Tín permanent, applicant dip. Seeds never expire — the photo exists forever. **The per-year risk is shown live ("Nguy cơ phốt: X%/năm")** — dark play is an informed gamble, never a gotcha (the house signature, inherited from Nuôi Anh). Alumni are the long fuse: every graduate persists as a ledger entry; hollow ones roll annually to make headlines with your school's name in them, honest ones roll to send gifts, return as teachers, vouch for you. Every cohort you hollowed is debt; every cohort you educated is equity.

**Virtue pays SECRETLY.** Surprise alumni gifts (30–500tr, 2–4 years delayed, never telegraphed: *"Cảm ơn thầy đã không bắt em học thuộc."*); master teachers who apply unsolicited at Uy Tín 40/60/80 (money cannot recruit them); intake-quality drift; and the Jobs gate itself, in which Tiếng Tăm appears NOWHERE.

**Anti-degenerate guards:** pure-saint runs face years-1–3 austerity (Tiếng Tăm <20 shrinks the pool — *trường tốt mà không ai biết*); pure-devil runs accumulate seeds + alumni bombs + (growth) teacher exodus and mathematically cannot produce the Jobs ending — they win money and lose the game; sin-then-repent doesn't launder (seeds persist), but **Chuộc Lỗi** (growth layer) lets you confess a buried act for reduced damage + 1 Uy Tín — reform is possible, paid for, never free. The sacrificial-gà-class min-max is allowed (it's honest satire of lớp chọn) but priced by its alumni bombs.

**Balance band (sweep-verified before shipping numbers):** theater cash = **1.3–1.5×** virtue cash in years 1–4; virtue net worth overtakes in **years 6–8**; scandal EV ≈ 60–80% of the sponsor money that bred it; all inside the charter's 0.6–1.6× temptation rule.

## Student model

**Growth pipeline (per day, monthly rates ÷30):**
`gain = base(preset) × (0.5 + Dạy/10) × (0.7 + 0.15×HạtGiống) × (1 − Vẹt/150) × (1 + stat/150)` for TN/ST (real stats compound — the thesis made mechanical); KT gains halve above 70 (cramming saturates) and KT rusts −0.5/tháng above 60 unless on Lò luyện đề; Mood<50 halves all gains; Mood<30 → 10%/tháng dropout risk (−5 Tiếng Tăm + lost tuition).

**Giáo án presets (per grade, the dial in physical form):**

| Preset | KT | TN | ST | CM | Mood | Vẹt | Cost |
|---|---|---|---|---|---|---|---|
| Lò Luyện Đề | +4 | 0 | −1 | +0.5 | −2 | +2/th | free |
| Cân Bằng | +2.5 | +1 | +0.5 | +0.5 | 0 | +0.5/th | free |
| Dự Án Thực Hành | +1* | +2 | +1.5 | +1.5 | +1 | −1/th | 1tr/hs/th; TN/ST −50% without Phòng máy; +1 TN with Xưởng |

(*KT −0.5 net when KT>60 — seniors forget exam tricks while building robots. That's the cost of virtue, rendered.)

**Sprite tells (non-negotiable — they make watching the map ≠ wallpaper; cut a room before cutting these):** Hạt Giống-5 kids stop mid-walk and stare at the sky with a 1s 💡, never explained anywhere (the community-discovery jewel); TN≥60 kids carry toolboxes and fix broken props free; Truyền-cảm-hứng teachers proc visible lightbulb chains (+2 ST to a nearby student); cú-đêm kids sleep through period 1 with a zzz bubble. Event bubbles always spawn over the involved student's head.

**Names:** common family names × poetic given names in the house register (Mây, Sương, An Nhiên, Thóc, Cốm, Sơn Ca…) + rare điềm-báo easter eggs (≤5%: Vũ Như Cẩn, Nguyễn Văn Mẫu, Phan Thành Tích, Hoàng Thị Yên Tâm — each with a small honest modifier). Personalities (12, MVP cosmetic-only chips) and hidden traits (Ngọn Lửa 🔥✨ 7%, Con Ông Cháu Cha, Mê Coin, Tay Vàng, Hiếu Thảo…) follow the students content pack, layered in per the roadmap.

## Graduation outcome table (cascade, priority order, first match wins)

| # | Outcome | Gate (canonical stats) | Alumni hook | Ships |
|---|---|---|---|---|
| 1 | 🍎 **Steve Jobs Việt Nam** | ST≥90 ∧ TN≥80 ∧ CM≥70 ∧ Vẹt≤60 ∧ ThựcChất(trường)≥60 — full game adds: Ngọn Lửa trait ∧ survived Khủng Hoảng Ga-ra ∧ Xưởng lv2 | founds "Táo Gai"; title-screen change, endowment, Spark rate 7→9%, Mắt Nhìn Người | MVP (reduced gate) |
| 2 | 🕯️ Chủ Tịch Quỹ Từ Thiện (Đang Bị Điều Tra) | CM≥70 ∧ Vẹt≥60 ∧ ĐĐ≤30 | the Nuôi Anh wink; huge gift year 1, 30%/yr detonation years 2–4 | L4 |
| 3 | 🪙 **Cá Mập Coin** | CM≥60 ∧ TN<40 ∧ Vẹt≥50 | sàn "LuaChain"; yearly tainted sponsorship offer; scandal bomb sized by Hạt Giống — your brightest hollowed kid headlines hardest | MVP |
| 4 | 📋 **Quán Quân Văn Mẫu** | KT≥80 ∧ Vẹt≥60 ∧ ST<40 | chuyên viên tại Sở Nói Chung; +2%/yr exam ranking (he knows the ba-rem) | MVP |
| 5 | 🏛️ Công Chức Nguồn | COCC trait ∧ KT≥60 | permits, land discounts | L3 |
| 6 | 👷 **Kỹ Sư Chân Chính** | TN≥70 | small donation forever, free repairs, +1% efficiency (cap +15%) — the quiet compounding majority | MVP |
| 7 | 📱 **Reviewer Công Nghệ Triệu Sub** | CM≥70 ∧ TN 40–69 | kênh "Trên Tay Mọi Thứ"; coin-flip videos about the old school | MVP |
| 8 | ✈️ Kỹ Sư Xuất Ngoại | TN≥60 ∧ CM≥50 ∧ ST<50 | remittances; returns year 5 as engineer+10 | L3 |
| 9 | 🎓 Du Học Không Hẹn Ngày Về | ST≥70 ∧ KT≥60 ∧ trait | 10%/yr equipment-or-teacher lottery | L3 |
| 10 | 🚀 Founder Gọi Vốn Vĩnh Cửu | CM≥80 ∧ ST≥60 ∧ TN≤50 | startup "Ưu Bơ — app gọi xe cho xe ôm chở gà"; fame spikes, never money | L3 |
| 11 | 🔧 Phù Thủy Sửa Đồ | Tay Vàng trait ∧ TN≥65 | tiệm "Gì Cũng Sửa, Trừ Trái Tim" — *"Hãng táo khuyết từ chối bảo hành. Em ấy thì không."*; maintenance −10% | L3 |
| 12 | 👨‍🏫 Người Trở Về | TN≥60 ∧ CM≥60 ∧ school resolved their crisis | returns as a hireable loyal teacher — the loop closing emotionally | L4 |
| 13 | 💼 **Nhân Viên Lương Ổn** (default) | — | "Lương đủ sống. Ước mơ để chế độ máy bay." Tiny Tết letter; gently melancholy, not a fail state | MVP |

Event route 📉 *Bỏ Học "Như Jobs"* (cargo-culting the biography is the trap) — L5. The graduation card shows the 2–3 deciding checks ✓/✗ plus ONE near-miss line if ≤10 points from a higher outcome (*"Thiếu 6 điểm Sáng Tạo nữa thì… thôi, không nói nữa."*) — the gut-punch that teaches the system, in v1.

**Rarity, one sentence everywhere:** possible from cohort 1 but hard (a deliberate thực-chất MVP run hits the reduced Jobs gate ~10–20%); the full gate (L4: trait + crisis + Xưởng lv2) pushes expected first Jobs to **year 6–9**, ~1 per 25–40 graduates at good play; a cram school can run 12 years and never see one — and the đề Văn keeps asking it why. The first Jobs triggers the biggest celebration in the game (keynote parody: black-turtleneck sprite, *"Một thứ nữa…"*).

## Economy (single source of numbers — tune via engine sweep, never by hand)

START: 120tr cash · inherited campus (Phòng học, Sân, book value 150tr for maintenance) · 2 inherited teachers · 32 students (12+10+10).
INCOME: học phí default 2tr/hs/tháng (range 1–6, step 0.5; **ceiling = 1 + TiếngTăm/10 tr**, +0.5 at rank ≤2; pricing above ceiling halves next summer's pool) · sponsor deals 60–300tr (first scripted offer: 80tr from **Tập đoàn Trứng Vàng** for logo placement + 1 PR event/tháng that visibly consumes your top students' time) · showcase wins 20–40tr · gói "Make in Đại Việt" grant 150tr/năm with KPI strings (L5) · alumni gifts 30–500tr ×Uy-Tín multiplier (L2) · Kim Cương tier tuition ×3.
EXPENSES: lương = 8 + 2.5×(Dạy+Diễn) tr/tháng (rookie ~10, star ~45, archetype overrides allowed) · rooms 50–200tr one-time · bảo trì 0.7%/tháng of book value · Dự án materials 1tr/hs/tháng · marketing hè 5–30tr.
SHAPE: tight years 1–3 (honest net +8..+25tr/tháng — the 80tr sponsor must be genuinely tempting), comfortable 4–7, money a non-issue by 9 (late-game scarcity shifts to student/teacher quality and Uy Tín).

## The annual June exam beat (6 nhịp, ~90s, the heartbeat)

1. **Đề công bố** — the yearly variant (pool above) + simulated parent-forum meme statuses.
2. **Policy choice (the moral dial in one button):** **Văn Mẫu Đậm Đà** (+1.0 điểm all sitters, +5 Vẹt cohort-wide, +1 Phốt seed, coin-flip viral: praised or *"43 bài giống nhau từng dấu phẩy"*) vs **Tự Luận Thật** (raw scores, variance, doubled viral-essay chance).
3. **Kết quả & ranking:** điểm Văn = 2 + 0.06×KT + 0.02×Vẹt + policy + noise — **the grader loves Vẹt**; school average ranks against 3 fictional rivals (**Học viện iSteve Toàn Cầu** — billboard cram academy, *"Cam kết đầu ra: Tỉ phú hoặc hoàn 30% học phí"*; THPT Bán Công Bình Thường; Trường Làng Bến Sung). Rank pays NOW: tuition ceiling, applicant volume, Tiếng Tăm (rank1 +8 / rank2 +4 / rank3 +1 / rank4 −3).
4. **The mirror:** 1–2 sampled essays read aloud, generated from line banks keyed to the school's profile. A theater school shows three IDENTICAL văn-mẫu openings side by side (*"Trong dòng chảy bất tận của thời đại 4.0…"*) — the visual gag does the moralizing, no narrator. A thực-chất school shows one odd, human sentence (*"…con ốc M2 em vặn bị toét ren vì em vội. Thầy bảo: vội là đắt nhất. Em nghĩ nước mình đang vội."* → 4.0 điểm, lạc đề; một giám khảo xin chụp lại bài). Essay quality = 0.5×ST + 0.3×TN + 0.2×UyTín; ≥70 → viral chance (the beacon).
5. **Graduation reveal** — one card flip per graduate, rarest last, near-miss lines. The gacha you spent years loading.
6. **Headline of the year** keyed to score × substance — including the four-corner satire (*"Hiện tượng giáo dục hay hiện tượng truyền thông? Cả hai, và đó mới là vấn đề"*; the both-low case appears only in Bác Tâm's diary).

## Content pack (summary — full text lives in the content bible)

- **Rooms (16):** thực-chất group (ugly, expensive, compounding, un-photogenic): Xưởng Chế/Hàn Mạch, Phòng Máy (Cũ), Phòng Y Tế & Tâm Lý (*"Phòng duy nhất trong trường không có banner."*), Vườn Táo Sau Trường (no UI effect for 2 years — they meant Newton, kept it anyway). Thành-tích group (pretty, pays NOW, rots): **Phòng Lab Sống Ảo** (the trap purchase — prettiest sprite in the game, near-zero learning), Studio TikTok, Phòng Truyền Thống Ảo (VR cúp "dự kiến"), Bảng Xếp Hạng LED, Hội Trường Keynote, Phòng Luyện Văn Mẫu. Dual-use: Garage Khởi Nghiệp, Lab AI "Trợ Lý Đông Cô". Neutral: Căng Tin Mì Tôm (*"Menu 1 món. Topping: niềm tin."*), Sân.
- **Teachers (10 archetypes, statted as Dạy/Diễn):** Thầy Cựu Kỹ Sư Tập đoàn Phần Mềm Phương Đông (9/3), Cô Văn Mẫu (2/9 — *"Cảm xúc là tốt. Nhưng cảm xúc không có ba-rem."*), Thầy Diễn Giả Truyền Cảm Hứng (1/10, motivation-blood-sugar mechanic), Thầy Coder Tự Học chưa tốt nghiệp cấp 3 (9/1, cheap because hồ sơ trống — the satire prices itself), Cô Chủ Nhiệm Sổ Đầu Bài (4/3), Thầy Thể Dục Kiêm Mọi Thứ (2/2, fills any slot), Cô IELTS Pitch Deck (5/8), Cô Tiến Sĩ ĐH Quốc tế Đông Lào (4/8), Thầy Du Học Sinh Thung Lũng (8/7, 15%/yr Singapore risk), Ông Thợ Sửa Đồ Đầu Ngõ (9/0, thỉnh giảng, leaves when cameras arrive).
- **Events (target 60+, predicate-gated — bad events only fire for sins actually committed):** the 20-event content deck (sponsor visits, Shark Lươn's escalating offers that always match your current cash crisis, thanh tra vs the VR room, nhà báo Băng Trang's undercover week, the 300-identical-AI-essays bust, the power-cut show-don't-tell event, the đục-tên minigame…). Trigger repair: Event 12 fires at >15 thực-chất students (not 40).
- **Recurring cast:** **Bác Tâm** the security guard (the game's hidden soul — ex-chief-engineer of hãng điện thoại Vạn Xuân, which shipped a touchscreen phone five months before the fruit company and died because nobody believed; his quiet aura IS a mechanic, and his resignation event is how a thành-tích school discovers it); **Mai Sương** (hạt-giống-số-0, the dial made human — her 5-year arc from bell-disassembler to either the nation's quoted essay or a StudyCoin ambassador press release); **Chị Băng Trang** (Tạp chí Giáo Dục Thật, 3-person newsroom — year 4 you can fund the paper investigating you); **Shark Lươn / quỹ Mập Ventures** (the mirror, not the boss; refuse him for 5 years and he gets the one line with no money in it).
- **Legal hygiene (non-negotiable fixes already applied):** no Vin- prefixes (sponsor is "Tập đoàn Trứng Vàng" / "Táo Vàng Vườn Tâm"); the chip-CEO event is a fictional composite with no real-person tells (the 4-second-silence question stays — it needs no real person to land); "hãng táo khuyết", "laptop có logo trái cây", "app gọi xe" replace any verbatim real brand. Geographic names allowed; poetic student names fine.

## UI architecture (390px portrait is the design surface)

- **Two stacked canvases**, full-bleed 390px, dpr-scaled, imageSmoothing off: `#mapStatic` (terrain/rooms, repainted only on build/season) + `#mapLive` (sprites/bubbles/ghosts, rAF, skipped when hidden). Top-down grid with FAKE 3/4 depth (front-face strip, head-overlap) — not isometric.
- **Sprites:** ~18×22px chibi (head = half the height), 4 frames, pre-rendered palette×frame atlas at boot; walk = deterministic position-keyed frame flip; BFS pathfinding over 180 cells. **Walking is 100% cosmetic:** actor positions live in a volatile `view` object (Math.random allowed), never in S; stat gains come from the deterministic schedule, never from "sprite arrived". The sim must run headless with rendering off.
- **Layout:** top HUD ~56px (💰 `#moneyVal` · Tiếng Tăm gold bar `#tiengTamVal` · Uy Tín rumor-text `#uyTinVal` · "Năm 2 · Tháng 6" `#yearVal` · speed) → map (~55–60vh, never scrolls, never fully covered except by the June modal) → one-line ticker → bottom tab bar ~56px + safe-area: 🏗️ Xây · 👩‍🏫 Nhân sự · 🎓 Học sinh · 📊 Trường. Tabs open bottom sheets (max 62vh, backdrop-tap closes, nav depth exactly 2). Touch targets ≥44px.
- **Placement:** tap-select card → ghost snapped to grid, offset 40px ABOVE the finger, green/red validity → floating ✓ Xây / ✗ Huỷ buttons. NEVER confirm on finger-lift. Auto-pause during placement. Occupancy grid is DERIVED from S.rooms (rebuildGrid()), never serialized.
- **Modal policy:** full-screen + auto-pause only for June ceremony, graduation, term reports, sponsor offers. Flavor lives in the ticker and non-pausing bubbles.

## Hard rules

1. **Single self-contained `index.html`** — no build step, no asset files; SVG/canvas hand-drawn charm.
2. **Vietnamese-first**; satire dry, never cruel; mock systems and adults, never the kids; dark options always sound REASONABLE (*"Trường nào chẳng làm vậy."*).
3. **Obviously-fictional names only** — punny companies with disclaimer-as-joke, role-named adults, poetic students; NEVER plausibly-real people/companies; no real-person depictions even under fictional names. Footer disclaimer forever.
4. **Never break saves:** every field gets freshState() default + load() typeof-merge + sanitize() entry (`Number.isFinite`, never bare `isFinite`); derived structures (grid, view) never serialized.
5. **Balance through the toolchain:** all constants in one CONFIG; mirror dayTick() in an engine.js replica; sweep before shipping numbers; keep the moral band (1.3–1.5× / overtake 6–8 / scandal EV 60–80%) green.
6. **Test before push:** headless-Chrome gates (fresh + seeded-save + builder no-mutate), window.onerror → `<title>`, `window.__test` fast-forward API, `?seed=` boots.
7. **Mobile gate:** every UI change screenshot-verified at 390px before ship.
8. **Fun first (owner directive):** moment-to-moment juice, temptation with teeth, humor that lands, pacing that respects the player. When elegance and fun compete, fun wins.
9. **Juice asymmetry is law:** dark gets the confetti; virtue gets a nod and a diary line. Anti-clicker law: no tap-rate mechanics, no offline accrual, no energy/timers.

## Growth roadmap (post-MVP, each layer independently shippable)

- **L1 — Deck & charm:** event deck 12→40+ with predicates; personalities 6→12 with modifiers; more sprite tells; full Tết; school-name picker (the 6 names + generator + the Apple-typing popup).
- **L2 — The moral mirror, full:** alumni ledger (gifts AND scandal time-bombs ship together — the pair rule) + Bảng Vàng as a physical wall object; full Phốt system + Chuộc Lỗi; the Charity-Chairman wink.
- **L3 — People depth:** hidden traits (Ngọn Lửa mechanics, COCC, Mê Coin, Tay Vàng, Hiếu Thảo…), scouting suite (scout points: Xem Học Bạ / Phỏng Vấn with Spark-read flavor lines / Thử Thách Nhỏ), Hạt Giống reveal, outcomes 5/8/9/10/11; teacher loyalty + silent witnessing.
- **L4 — The full Jobs gate:** Nội Lực + Đạo Đức stats, Khủng Hoảng Ga-ra crisis event, Xưởng lv2, outcomes 2/12, Sổ Định Hướng trajectory forecaster.
- **L5 — Institutions:** gói "Make in Đại Việt" + KPIs + audits; thanh tra; showcase/competition economy; dropout-"như Jobs" route; rival-school events.
- **L6 — Curriculum depth:** block timetable replacing presets (the 12 subjects as blocks; Đạo Đức Kinh Doanh's secret outcome-lock the game never explains — the wiki will find it).
- **L7 — The cast:** Bác Tâm's full 5-year arc, Mai Sương's arc, Băng Trang, Shark Lươn's ending; đề-trích-bài-năm-1 callback essays from event history.
- **L8 — Meta:** prestige "Mở Phân Hiệu Mới" + Di Sản points + persistent cross-run alumni network (your old honest engineer teaches at the new campus — the thesis as a feature); Bảng Vàng completion; essay hall-of-fame; map expansion + vertical pan; audio.

## Voice & aesthetic

Deadpan narration, no exclamation marks — the comedy is describing absurd things in biên-bản-họp-phụ-huynh prose. Kairosoft warmth: big-headed sprites, motes, seasonal palettes, the Bảng Vàng filling with tiny portraits. Vietnamese internet register in tickers and memes. The two ledgers — bank balance and Di Sản — stare at each other on every year-end report.
