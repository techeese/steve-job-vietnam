# Học viện Steve — Design Charter v2 (Ấn Bản Đại Học)

> The settled-law reference for the shipped game. If an improvement fights this document, the improvement
> loses. (See `VISION.md` for the dream, `MODEL.md` for the factor model.) Canonical merge of the four
> university revision designs (university / alumni / funding / pantheon); where any subsystem disagrees, THIS
> file wins. The v1 high-school skeleton converted to this charter as a DIFF — every v1 system not named below
> survives byte-identical.

## 1 · What this game is
A **satirical Vietnamese university-management sim** in the Kairosoft register: a hand-drawn campus of tiny
walking sinh viên, watched from above, managed in small decisions, evaluated every June with fanfare — and
haunted for YEARS afterward by everyone it graduates. **NOT a clicker:** taps are choices, never rate.
Offline, time is frozen. **The v2 thesis:** *graduation produces POTENTIAL; the world decides DESTINY* — the
diploma is a save file, not an ending.

**The open-question law (owner directive):** the đề Văn — *"Làm thế nào để Việt Nam có những 'Steve Jobs Việt
Nam'?"* — is a *philosophical* prompt; the game must NOT ship a pre-written answer. Three hard consequences:
**(1) No single dominant strategy** — hype, craft, real engineering, văn-mẫu mass-production, patient virtue
all stay viable, legible, distinct theses; balance protects pluralism, not just numbers. **(2) The game argues
nothing; it reflects** — bad outcomes fire only for sins committed (trigger hygiene), good outcomes are never
forced; the player's choices ARE the argument. **(3) Reflect the answer back, don't state it** — the endgame
is the player's own essay assembled from what they did (*"bản nháp bài luận của hiệu trưởng"*), never a
designer's verdict.

## 2 · Premise & founding myth
After the real June 2026 đề thi THPT môn Văn asked the Steve-Jobs question, your founder takes it literally and
buys a bankrupt private university — **Trường ĐH Dân Lập Văn Mẫu Số 9** — to convert into the institution that
MANUFACTURES one. Display name: **"Học viện Steve (tên đầy đủ đang chờ Bộ duyệt mã trường)"** — the mã
trường/mã ngành approval is the running joke. The exam is no longer yours: each June 2,1 triệu thí sinh sit it
OUT THERE and what that machine produces walks toward your gate in July; Bác Tâm reads the 2026 đề aloud at the
flagpole yearly (one ticker line, never commented). **Everything is parody** (footer disclaimer; historical
figures honored with respect, §10).

## 3 · Canonical spec sheet
- **Student stats (visible 0–100):** KIẾN THỨC · TAY NGHỀ · SÁNG TẠO · CHAI MẶT · MOOD. Hidden: HẠT GIỐNG 1–5
  (`seed`) · VẸT 0–100 (🦜; exam helper NOW, drags real growth, top-outcome disqualifier).
- **School meters:** CHỈ SỐ THỰC CHẤT · TIẾNG TĂM (−1/tháng) · UY TÍN (never decays, ±3/yr net, exactly TWO
  pierce events ever — the viral defense +5, the first 🍎 keynote +5).
- **Alumnus record** ≈80 bytes: `{id,ten,gradYear,outcome,state,yearsInState,annMonth,fs{…seed},grat,gifts,
  flags{…}}`; ≤~150/run. **Teachers:** DẠY/DIỄN 0–10, salary 8+2.5×(D+Đ); label **giảng viên**.
- **Clock:** month 30s, year 6 min; speeds pause/1×/2×/**3× (unlocks at first Lễ Tốt Nghiệp)**. Run cap 12 năm
  = 9 admissions cycles, 8 self-shaped graduating classes. **Roster cap 48** (4 cohort-years × 12; tuyển
  thẳng/đặc-cách count against it; sanitize never deletes an enrolled student).
- **Determinism — three isolated streams:** main sim on `S.rngState`; admissions pool from `poolSeed` (never
  serialized); alumni-years from `S.seed0` per-alumnus-year throwaway generators. Reloading reroll-proofs all
  three.

## 4 · Calendar (Tháng 9 → Tháng 8)
- **T9** khai giảng + nhập học (3 spotlight cards give the histogram faces); phốt seeds roll. **T12–1** thi HK1.
  **T1–2** Tết + world-year ticker. **T2–5** HK2; Năm 4 enters ĐỒ ÁN MODE (no Xưởng/Phòng Máy → June −1.0).
- **T6 (two-stage):** (1) THPT QUỐC GIA in the world (đề variant, pool foreshadow); (2) **BẢO VỆ ĐỒ ÁN + LỄ TỐT
  NGHIỆP** for Năm 4 (§6–7). Cohorts roll. 3× unlocks here.
- **T7** **TUYỂN SINH modal** (§5). **T8** kết quả + **BXH ĐIỂM CHUẨN**. **T11** 20/11 — the gift-envelope beat.
- **June–August corridor (HARD):** June ceremony ≤90s typical / ≤120s absolute; July player-paced; August a
  toast unless bổ sung fires. June is structurally **alumni-free** (anniversary hashing avoids it).

## 5 · ĐIỂM CHUẨN — admissions (the star mechanic)
Each T7 the player sets TWO dials against a visible score histogram: **ĐIỂM CHUẨN** (12.00–30.50, step 0.25) and
**CHỈ TIÊU** (4 to min(14, 48−roster)). You meet a histogram, not a person — that anonymity is the satire;
September gives it faces.
- **Pool** N=round(24+1.6×TT); score = gauss(μ,3.2)+điểmƯuTiên, μ rises with UT/TT and a **national inflation
  drift +0.25/yr** (the treadmill — điểm chuẩn is hype's currency, only Uy Tín ratchets). **Học bạ đẹp:** 25%
  carry phantom display inflation, exposed by a T10 ticker.
- **Hidden derivations** (lazy at enrollment): HẠT GIỐNG quality follows the quiet UT/score meters; **the detox
  truth** — a high-điểm admit arrives pre-crammed (high Vẹt), so năm nhất is the year of cai văn mẫu.
- **Resolution:** enroll top scorers ≥ cutoff up to quota. n>12 → **crowding** (growth ×, Mood −1, packed
  sprites, shown pre-commit). **Ảo** no-show ≈8% (worse if a rival cutoff beats yours). Shortfall → **ĐỢT BỔ
  SUNG** T8 (lower vs leave empty, lost tuition rendered).
- **Tuyển thẳng strip** (1–2/yr outside the math) + the merged **đặc-cách "Hồ sơ 16,5 điểm"** (Bác Tâm vouches
  for a below-cutoff seed-4/5 kid). **Stunt events** (risks shown pre-commit): ≥30.00 the legend "ĐIỂM CHUẨN
  30,5/30"; ≤15.50 "vét sàn"; TT/UT trade-offs each way. **Tiers:** 💎 CLC ×3 tuition · 🏵️ scholarships (§10) ·
  Thường.
- **BXH ĐIỂM CHUẨN (T8):** ranks your DECLARED cutoff vs scripted rivals — iSteve 26.5+0.5×year (sandbagged,
  scripted year-5 side-door exposé), B.Thường 19±1, Bến Sung flat 15.0 → TT payouts. **Auto-resolve (headless):**
  cutoff = max(15, last −0.5), quota 12.
- **Presets** keep internal keys (save-compat), relabel **Học Để Qua Môn / Cân Bằng / Đồ Án & Lab**. **Rivals:**
  Học viện iSteve Toàn Cầu · ĐH Dân Lập Bình Thường · ĐH Cộng Đồng Bến Sung (flat 15.0, with dignity).

## 6 · Student model & the June defense
Growth pipeline, presets, sprite tells, mood/dropout, KT rust/saturation, names, Mai Sương — unchanged from v1
(model refinements layer on top, `MODEL.md`). **June stage 2:** **ĐỒ ÁN MẪU** (+1.0 defenses, +5 Vẹt, TT
coin-flip) vs **BẢO VỆ THẬT** (raw, viral ×2). Defense điểm weights TN/ST/Vẹt + policy + room/quan-vụ terms; đỗ
≥5.0 — the hội đồng still loves Vẹt but real stats now carry the weight. **defenseQ** = 0.5×ST+0.3×TN+0.2×UyTín;
≥70 → viral beacon +10 TT +5 UT (pierce #1).

## 7 · Graduation — the cascade keeps its job, loses its crown
Shell unchanged (priority order, first match wins, rarest last). Card header **"TIỀM NĂNG:"**; full final stat
block into `alumni[]`. The 🍎 row is REMOVED from graduation. Canonical 8 rows:

| Pri | Card | Gate | Entry state |
|---|---|---|---|
| 1 | 🪙 Cá Mập Coin | CM≥60 ∧ TN<40 ∧ Vẹt≥50 | CA_MAP_COIN |
| 2 | 📋 Quán Quân Văn Mẫu | KT≥80 ∧ Vẹt≥60 ∧ ST<40 | QUAN_VAN_MAU |
| 3 | 🚀 Founder Gọi Vốn | CM≥80 ∧ ST≥60 ∧ TN≤50 | FOUNDER (coinPath if Vẹt≥50) |
| 4 | 👷 Kỹ Sư Chân Chính | TN≥70 | KY_SU |
| 5 | ✈️ Kỹ Sư Xuất Ngoại | TN≥60 ∧ CM≥50 ∧ ST<50 | XUAT_NGOAI |
| 6 | 📱 Reviewer Triệu Sub | CM≥70 ∧ TN 40–69 | KOL |
| 7 | 💼 Nhân Viên Lương Ổn | KT≥50 ∨ TN≥40 | LUONG_ON |
| 8 | 🪪 Thất Nghiệp Có Bằng | default | THAT_NGHIEP |

**🌱 Hạt Táo (hidden flag, replaces the minted 🍎):** ST≥80 ∧ TN≥70 ∧ CM≥60 ∧ Vẹt≤50 ∧ ThựcChất≥55 → one quiet
card line (*"Đứa này… để xem."*), worth ×6.7 on the later Steve roll; never explained. Non-flagged alumni ascend
×0.15 (the world occasionally surprises a school that deserves no credit). grat frozen at graduation; virtueTouches
store EVENT KEYS so gift letters quote the actual moment.

## 8 · The alumni lifecycle (the diploma is a save file)
Yearly per-alumnus FSM; the 🍎 emerges (or doesn't) years later, from a garage. All feedback routes through
EXISTING plumbing (gifts → cash/endow; scandals → phốt seeds; lecturers → hirePool; keynote → June-modal).
**15 states (v0 ships 8):** THAT_NGHIEP · LUONG_ON · KY_SU · TRUONG_PHONG · GIAM_DOC · XUAT_NGOAI (về nước ×2 at
UyTín≥60) · **FOUNDER (the high-variance hub, the ONLY road to 🍎)** · CA_MAP_COIN · KOL · QUAN_VAN_MAU (biên
chế outlives the run cap, the punchline) · BI_BAT · QUAY_DAU · VE_QUE · GIANG_VIEN (real teacher card → hirePool;
hired → excluded from ticks) · STEVE (absorbing; +15 TT once, +5 UT pierce #2, keynote, title screen).

**Determinism (hard rule):** alumni NEVER touch S.rngState; per alumnus-year derives from `S.seed0 ^ id ^ year`,
fixed draw order **(1) Steve/garage roll (drawn-and-discarded if ineligible) → (2) transition → (3) flavor → (4)
gift** (CI-proven byte-identical replay). Walker rows scale to Σ≤0.95 (stay always ≥5%).

**The 🍎 pipeline (two-stage, garage mandatory):** in FOUNDER, pSteve = base × craftGate(≥75) × lửaMult(seed) ×
hollowGate(≤40) × yearsInFounder × (tiemNang?1:0.15) × world. First success → garage=true (school eats −2 TT,
state LOCKED that year); next year ×3 → KEYNOTE (the ONE loud virtue payoff) or QUAY_DAU/KY_SU. The −2 TT sting
lands ~12 months before the +15 TT keynote — the game's best-engineered whiplash. **World year** (off S.seed0):
Bình Thường 50% · Gọi Vốn 15% · Sốt Coin 12% · Sốt AI 13% · Thanh Lọc 10%. **Trần Phi Lợi:** scripted
CA_MAP_COIN → BI_BAT year 2 (everyone else pure FSM).

**Sổ Cựu Sinh Viên:** 🎓 tab → [Sinh viên | Cựu SV]; rows with state chip + last line; gratitude as FLAVOR TIERS,
never a number. **Epilogue (NEVER cut once shipped):** at run end "Mười năm sau…" fast-forwards the FSM 10 years
headlessly, one line per notable alumnus — the ledger becomes the ending narration for free.

## 9 · The funding trio — three meters made monetary
- **HỌC PHÍ = Tiếng Tăm money** (loud-ish, monthly): stepper 1–6tr, ceiling = 1+TT/10; above → pool halved +
  Mood penalty. Quantity capped by điểm chuẩn (lowering the cutoff floods halls with cash and cram products).
- **HỢP ĐỒNG DOANH NGHIỆP = Thực Chất money** — pays NOW with confetti, bills LATER via seeds, locks, a morality
  clause. Five string types (RENDERED never tooltipped): 📣 PR · 🦜 Giáo trình thương hiệu · 🎣 Tuyển dụng sớm
  (poaches năm-cuối PRE-graduation → "potential never resolves" made literal) · 🔒 Lab độc quyền (switches off
  your thực-chất engine) · 🤝 Thực tập có lương (the honest end). Refusing seed-bearing offers: +TC +UT, virtue
  flag. On any phốt detonation each contract may cancel instantly.
- **QUỸ HIẾN TẶNG = Uy Tín money** — `S.endow`, ×1.004/month, never decays, survives every scandal. Spend
  channels (only three): scholarships, dedications, Quỹ Ứng Cứu. **Causality one-directional: UT feeds the quỹ;
  the quỹ's size never buys UT** (no spend may ever ADD Uy Tín).

**The scandal stress test (fires naturally):** detonation → contracts cancel INSTANTLY, applicant pool dips NEXT
YEAR, the endowment doesn't notice — one bad September teaches all three textures, zero narration. Money UI:
#moneyVal → **Tài chính bottom sheet** (cash / THU: 🎓 học phí gold · 🤝 hợp đồng · 🌱 quỹ small-grey — typography
IS the satire / CHI).

## 10 · The pantheon layer & LUẬT TÔN KÍNH (hard rule)
HISTORICAL figures — deceased, nationally celebrated, closed roster — may be honored **BY REAL NAME** on
scholarships, buildings, and prizes in the reverent register real Vietnamese schools use. LIVING figures appear
ONLY as unnamed composites (≥3 inspirations, role-titles only) — with an owner-sanctioned exception list (the
Fields-medalist lecture, the chip-CEO visit) as honored guests named by role only. Five enforced rules:
1. **The figure is the straight man; the school is the clown** — satire targets the distance between name and
   institutional behavior, never the name.
2. **`.pantheon` CSS frame** (gold-on-lacquer-red, serif, 🏵️): jokes NEVER ship inside it; honoree names NEVER
   in scandal/phốt HEADLINE strings. **3.** Deceased + nationally celebrated only; roster closed. **4.** Living
   = unnamed composites (with the exception list, role only). **5. Worthiness gates** — the game refuses an
   unworthy school a worthy name; the refusal line is the satire landing on you.

**Scholarships** (ride the 🎓 tier; one holder each, tuition 0, seed +1 bias, `hb` flag → +10% honest
transitions). MVP three: **Trần Đại Nghĩa** (TN ×1.15) · **Tạ Quang Bửu** (ST ×1.15) · **Hồ Xuân Hương** (Vẹt
accrual ×0.5 — the thesis in one multiplier). Dark mirror: awarding to a Kim Cương kid for PR = +TT + photo but
the bias does NOT apply. Deferred roster + **dedications** (đặt tên công trình, milestone-gated, burns the
corporate-naming slot) + **Lễ Vinh Danh** (Giải Giọng Riêng with its *"Không trao"* beat · Lương Định Của · Chu
Văn An) are L-packs.

## 11 · Moral tension & balance
Tiếng Tăm decays and must be fed; Uy Tín never decays, moves only on real outcomes, two pierce events. **Juice
asymmetry is law:** contract signings get confetti, the endowment never does, the keynote is the one loud virtue
payoff, dedications get one nhật-ký line while corporate renamings get drone shots. Dark bills LATER through the
SAME Phốt engine. Virtue pays SECRETLY — the endowment IS the charter's virtue-overtake curve, one number
multiplying itself. **Balance bands (one combined `engine.js` sweep before any numbers ship):** Y1 honest net
+8..+25tr/th at 42 SV · theater 1.3–1.5× virtue years 1–4 · virtue net worth overtakes years 6–8 · scandal EV
60–80% of the dark money that bred it · virtuous decade: 3–5 tiemNang grads, P(🍎)/flag 0.15–0.20, **45–60% see
exactly one keynote, median year 7–9** · hollow decade P(🍎)<2% (a theorem) · Jobs NEVER measured at graduation.

## 12 · Content, cast & UI
- **Rooms:** v1 catalog (Xưởng, Phòng Máy, Lab Sống Ảo the trap…); new rooms defer with map expansion.
  **Teachers:** v1's ten re-skinned + six university archetypes (L-pack). **Events:** v1 12-deck swapped by
  predicate-and-text (tin đồn lộ đề → CHỢ ĐỒ ÁN MẪU; bỏ học làm KOL → xin bảo lưu để startup "như Jobs"…) + decks
  T/E/C + 4 cutoff stunts; **bad events only fire for sins committed.**
- **Cast:** Bác Tâm (connective tissue — alumni news arrives at his gate; no successor, non-negotiable) · Mai
  Sương (Năm 1) · Trần Phi Lợi (scripted) · Chị Băng Trang · Shark Lươn.
- **UI — 390px portrait is the design surface.** Two stacked canvases, headless-pure sim. Tabs 🏗️ Xây · 👩‍🏫
  Nhân sự · 🎓 Sinh viên · 📊 Trường. **#admitModal** (auto-pause, T7): histogram → cutoff/quota dials → DỰ BÁO
  forecast (fill/crowding · tiers · tuition value · UT rumor TEXT never a number · risk · projected rank) →
  tuyển thẳng strip → công bố. Sheets ≤62vh, nav depth ≤2, touch ≥44px, **the map never scrolls.**

## 13 · Hard rules
Single file; Vietnamese-first, never cruel to kids; obviously-fictional names EXCEPT the honoring pantheon
(§10); never break saves (freshState / typeof-merge / sanitize / Number.isFinite); CONFIG + `engine.js` sweep;
headless gates + `?seed` + `__test`; 390px screenshot gate; fun first; juice asymmetry + anti-clicker. Plus:
**LUẬT TÔN KÍNH** is law · exactly two UT cap-piercers · June–August corridor ≤90s/≤120s · three isolated RNG
streams (derive, never serialize) · one registry per concern (CONFIG.ADMIT / CONFIG.ALUM / CONFIG.FUND / the
pantheon registry, one live surface per figure).

## 14 · Voice & aesthetic
Deadpan biên-bản prose, no exclamation marks. Kairosoft warmth. The three ledgers — bank balance, quỹ hiến
tặng, Di Sản — stare at each other on every year-end report. The đề Văn keeps asking; the Sổ Cựu Sinh Viên is
the only honest answer the game ever gives.
