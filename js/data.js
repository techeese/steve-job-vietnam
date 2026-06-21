/* ============================================================================
   Học viện Steve — js/data.js
   ALL tunables (CONFIG). No logic, no DOM, no text. (Player-facing TEXT lives in
   js/content.js as CONTENT — split iter 134 STRUCTURE; the two are independent globals.)
   Layer law: mechanics numbers live HERE, never in state; never inline in engine/ui.
   ========================================================================== */

var CONFIG = {
  V: 2,
  SAVE_KEY: "hoc-vien-steve-v3", // v3: start-from-nothing reframe — old v2 saves (42-SV school) are retired so the new boot shows
  // clock: 10 ticks = 1 day; 1 day = 1.0s at 1x
  TICK_MS: 70, TICKS_PER_DAY: 10, DAYS_PER_MONTH: 30, // TICK_MS 100→70 (iter 115, owner "1 month too long in real clock"): a month is now ~21s at 1× (was 30s) — pure WALL-CLOCK pace, no sim/balance change (sweep/gate drive dayTick directly)
  GRID_W: 15, GRID_H: 12, TILE: 26,
  ROSTER_CAP: 48, COHORT_NOMINAL: 12,
  // iter-166 (economy ckpt — owner: "upgrades raise students"): CLASSROOMS (phòng học) scale the school's SIZE.
  // campusScale() = 1 + CAMPUS_SCALE_K·(phonghoc_lvl−1), capped at CAMPUS_SCALE_MAX — so roster, intake AND the
  // crowd baseline grow TOGETHER (proportional → per-student dynamics + the realize/waste spread are preserved).
  // Capped conservatively (~1.85× ≈ 89 students) to keep the phone smooth. Level-1 schools (sweep/bot) = 1.0×.
  CAMPUS_SCALE_K: 0.09, CAMPUS_SCALE_MAX: 1.85,
  RUN_CAP_YEARS: 12,
  // ★ THE LATTICE — L1 ERAS (iter-204): a run plays through an authored SEQUENCE of decades. Each era RE-WEIGHTS
  // which gift (tell) the WORLD realizes vs wastes — so the SAME graduate is a founder in one era and unemployed in
  // another ("right kid, wrong time"). `fav[tell]` >1 pulls that gift toward realize (kỹ sư / founder / 🍎), <1 pulls
  // it toward waste (thất nghiệp) — applied in transition()/stevePShort. Era = eraIndex(S.year) (deterministic, no
  // rng → replay-safe; reload restores S.year → same era). Invariants: each era REALIZES some tells AND WASTES some
  // (#2 symmetry — every fav column has a >1 and a <1, every row too); no era globally dominates (#1 — means ≈1,
  // sweep era-sensor enforces). Undirected kids (tell="") are era-NEUTRAL (the everyman, fav=1). Authored spine,
  // chronological from the school's 1990s founding. The graphics pass later draws the decade; the soul ships now as text.
  ERA_LEN: 3,                   // game-years per era band → years 1-3 era0 … 13+ era4 (the decade epilogue lands in the smartphone era)
  ERAS: [
    { key: "scarcity", name: "Thời bao cấp (199x)", fav: { spark: 0.45, sky: 1.7, hype: 0.75 },
      shift: "Thời thiếu thốn. Đôi bàn tay biết chế ra cái gì đó từ con số không là quý nhất — còn đầu óc lập trình thì chưa có máy, chưa có chỗ dụng." },
    { key: "doimoi", name: "Đổi Mới (mở cửa)", fav: { spark: 0.65, sky: 0.8, hype: 1.6 },
      shift: "Chợ mở, tiền chạy. Kẻ nhanh mồm nhanh tay, biết buôn biết bán lên ngôi — thợ giỏi thành hàng rẻ, còn dân kỹ thuật vẫn đợi thời." },
    { key: "dotcom", name: "Thời dot-com", fav: { spark: 1.7, sky: 0.7, hype: 0.8 },
      shift: "Thế giới lên mạng. Đầu óc lập trình bỗng thành vàng ròng — bàn tay thợ thủ công dần bị máy móc và hàng ngoại lấn." },
    { key: "smartphone", name: "Thời smartphone", fav: { spark: 1.0, sky: 0.55, hype: 1.65 },
      shift: "Ai cũng cầm một cái điện thoại. App và người nổi tiếng hái ra tiền; nghề thủ công lặng lẽ ra rìa." },
    { key: "ai", name: "Thời AI bùng nổ", fav: { spark: 1.75, sky: 0.8, hype: 0.6 },
      shift: "Máy biết tự viết, tự vẽ. Kỹ sư thật sự càng được săn đón — còn trò làm màu suông thì máy làm thay trong một nốt nhạc." }
  ],
  ERA_REALIZE: { KY_SU: 1, FOUNDER: 1, STEVE: 1 }, // FSM targets the era PULLS UP for a favored gift (fav>1) / down for a wrong-era one (fav<1)
  ERA_WASTE: { THAT_NGHIEP: 1 },                    // FSM target the era PUSHES toward for a wrong-era gift (× 1/fav). Distortions (coin/arrest/văn-mẫu) stay era-neutral — those are the SCHOOL's doing, not the decade's (invariant #4)
  ERA_REGRESS: 0.65,           // L1 era MOBILITY: per-year downward pull (×(1−fav)) on a realized life in a HOSTILE decade — the gift the world has stopped valuing slides back (kỹ sư→lương ổn→thất nghiệp)
  ERA_RISE: 0.55,              // L1 era MOBILITY: per-year upward pull (×(fav−1)) on a settled life in its GOLDEN decade — the world finally has a place for the gift (thất nghiệp→lương ổn→kỹ sư)
  ERA_WRONG: 0.8,              // iter-205 ckpt2 (LEGIBILITY): fav ≤ this at graduation = the gift was born into a HOSTILE decade → a wasted gift earns a "sinh nhầm thời" grief clause (right kid, wrong era, NAMED at the payoff)
  ERA_RIGHT: 1.3,             //  fav ≥ this = the gift met its GOLDEN decade → a realized gift earns a "gặp đúng thời" cheer (symmetry — the era reads on BOTH the wasted and realized sides)
  // ★ L2 DEMOGRAPHIC axis (owner steer 2026-06-21 "add demographic realism = interesting challenges"; iter-206 ckpt1).
  // A per-kid FAMILY ORIGIN, derived deterministically from the student id (NO save field → NO migrator; stable across
  // reloads, like annMonthFor). The school as EQUALIZER: a poor-origin kid carries a realization HEADWIND (the grind of
  // disadvantage — felt as a chronic mood lean + a modest legit-growth drag) that MENTORING removes (you choose to back
  // them); a well-off kid has a slight head-start. Bounded + sweep-gated: the cost is REAL but COUNTERABLE (no origin is
  // waste-only, invariant #2; mentoring lifts the poor toward parity = the school's whole point), and scarce mentoring
  // means you can't back everyone → a tragic allocation (no dominant strategy, invariant #1). The drag hits the LEGIT
  // path only (g), never the hustle (gCm) — disadvantage funnels some toward shortcuts, it doesn't dull the street-smarts.
  // MULTIPLIES the soul: poor × wrong gift × wrong era = the system's hardest waste, done TO them by structure (#4).
  ORIGINS: ["ngheo", "tb", "kha"],            // nghèo (poor/rural) · trung bình (middle) · khá giả (well-off)
  ORIGIN_W: [30, 45, 25],                     // distribution weights (Σ100) — most middle, a meaningful poor minority
  ORIGIN_MOOD: { ngheo: 0, tb: 0, kha: 1 },  // poor mood lean = 0 ON PURPOSE: a mood penalty COMPOUNDS the cram-burnout drain → the poor would drop out en masse under a cram school (waste-only). The cost lives in ORIGIN_GROW (under-realize), NOT in dropout — the poor GRADUATE-but-settle, they don't vanish. kha +1 = a harmless security touch (the well-off don't drop)
  ORIGIN_GROW: { ngheo: 0.88, tb: 1, kha: 1.04 }, // the main realize lever: the poor's legit growth drags (→ they more often SETTLE rather than flourish), erased by mentoring; well-off slight head-start. Tuned so poor under-realize by a felt ~20pt, mentoring ≈ parity, dropout barely moves
  // ★ L2 GEOGRAPHIC ARCHETYPES (owner steer "demographic + geographic realism"; iter-210 ckpt1). WHERE the school sits
  // pre-loads its whole world BEFORE the player chooses anything: starting economy + prestige, the default teaching
  // CULTURE (presets), and — the soul tie to the demographic axis — the cohort's ORIGIN-MIX (a rural school simply
  // CONTAINS more poor kids). `tinh_le` = the baseline, EXACTLY the legacy boot constants → freshState byte-identical
  // for the default (no migrator; old saves lacking S.archetype sanitize to tinh_le). Each is a different đề-Văn thesis
  // and intrinsic difficulty; sweep-gated so NO archetype dominates 🍎+cash and each reaches BOTH a realized + a wasted
  // life (invariants #1/#2). The rich cram-city is NOT strictly easiest: its luyện-đề CULTURE + well-off cohort breed
  // văn-mẫu/distortion (the cram trap pays for the cash). Chosen at boot (freshState archKey / ?arch= / ARCH_OVERRIDE).
  ARCH_DEFAULT: "tinh_le",
  ARCHETYPES: {
    tinh_le:     { name: "Trường tỉnh lẻ",       cash: 200, endow: 10, tt: 25, ut: 10, tc: 30, presets: { n1: "canbang", n2: "luyende", n3: "luyende", n4: "luyende" }, originW: [30, 45, 25], blurb: "Một trường tỉnh mua lại từ đống nợ. Không giàu, không nổi, nhưng đủ chỗ để thử.", de: "Tỉnh lẻ cũng có quyền mơ một Steve Jobs chứ?" },
    que_ngheo:   { name: "Trường quê nghèo",     cash: 135, endow: 5,  tt: 15, ut: 13, tc: 26, presets: { n1: "canbang", n2: "canbang", n3: "luyende", n4: "luyende" }, originW: [65, 30, 5],  blurb: "Trường làng cuối một con đường đất. Trò nghèo, thầy ít, nhưng nhiều đứa sáng dạ lạ thường.", de: "Đứa giỏi nhất làng — đời nó rẽ ở chỗ có ai chống lưng hay không." },
    lo_thanhpho: { name: "Lò luyện thành phố",   cash: 320, endow: 20, tt: 45, ut: 8,  tc: 18, presets: { n1: "luyende", n2: "luyende", n3: "luyende", n4: "luyende" }, originW: [5, 35, 60],  blurb: "Lò luyện thi có tiếng giữa phố lớn. Phụ huynh xếp hàng, học phí cao, áp lực cao hơn nữa.", de: "Cả phố đổ tiền vào luyện thi — mà sao Steve Jobs vẫn chưa thấy đâu?" },
    truong_nghe: { name: "Trường nghề khu công nghiệp", cash: 180, endow: 8, tt: 20, ut: 14, tc: 40, presets: { n1: "canbang", n2: "duan", n3: "duan", n4: "duan" }, originW: [45, 48, 7], blurb: "Trường nghề cạnh khu công nghiệp. Người ta học để có cái nghề trong tay — chứ không để lên sân khấu.", de: "Một người thợ giỏi có kém gì một Steve Jobs?" }
  },
  MILESTONE_TT: 4,              // small Tiếng Tăm reward per founding milestone (the school gets noticed)
  PRIZE_BAR: 78,               // E7p: a graduating standout must clear this stat bar to earn an honor (a weak cohort wins nothing) — a line in a life, never a count
  ROOM_MAX_LEVEL: 10,           // iter-160 (owner economy epic ckpt2): a LONG upgrade track (was 3) — the player pours
                                //   escalating money into the campus for years; gameplay EFFECTS cap at lvl 3 (see economyTick),
                                //   so high levels are a pure PRESTIGE/income play, not a meter-breaker.
  UPGRADE: { BASE: 50, COST_GROWTH: 1.5 }, // ckpt2: upgrade cost ESCALATES per level (max(BASE,d.cost)·GROWTH^(lvl-1)) — "more expensive upgrades", but gentle enough that the income payoff beats the cost (good ROI)
  PRESTIGE_K: 0.45,             // ckpt2: each building UPGRADE LEVEL (above 1) adds +45% to tuition income — a prestige premium → income COMPOUNDS HARD as you invest (a fully-upgraded campus earns ~20× a bare one → the "ridiculous" endgame). Tuned for GOOD ROI: a tỷ-scale upgrade pays back in ~1-2 sim-years. Bounded (≤ ~45 levels). Person-sim untouched (income ≠ talent). iter-181: phòng học is NO LONGER counted here (moved to CLASSROOM_TUITION_K) → prestige = the OTHER buildings (reputation).
  CLASSROOM_TUITION_K: 0.20,    // iter-181 (owner steer ckpt2): "classroom = a multiplier of the tuition." Each phòng học level (above 1) adds +20% to per-student tuition (better classrooms → charge more). Compounds WITH prestige (the multiplier he asked for). Carved OUT of PRESTIGE_K (not double-counted). Level-1 = 1.0× → bot/sweep unaffected.
  CASH_MILES: [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000], // ckpt3 (iter-161): bank milestones in tr (1/5/10/25/50/100/250/500 tỷ) — a one-time grand fanfare as the university grows into an empire ("watch it grow" payoff)
  EFFECT_LVL_CAP: 3,            // ckpt2: the per-level gameplay effects (cangtin Mood / lab TT / phonghoc crowd-ease) cap here, so a tall campus doesn't inflate the meters / person-sim
  CANTEEN_PER_SV: 0.35,        // iter-180 (owner steer): buildings EARN — the căng tin sells a meal to each student each month; revenue = PER_SV × students × cấp (UNCAPPED, like prestige → "increase as upgrade"). Made to LOOK real with live lunch coins. ~17tr/mo at lvl1×48SV.
  LAB_PER_HYPE: 0.6,           // iter-184 (owner "canteen OR similar building"): the Phòng Lab Sống Ảo monetizes CLOUT — the hype-tạng kids livestream for ad money; revenue = PER_HYPE × (số em Sống Ảo) × cấp. Satire: clout pays CASH, never a 🍎. Ties the economy to the person-sim (hype grain). Live ❤️ floats over streamers.
  SYN_MIN: 4,                   // a khoa needs this many students for its synergy bonus to kick in
  SYN_GROW: 0.3,               // extra growth/day on the khoa's stat when synergy is active (tuned in P3)
  SYN_CROSS: 0.15,            // P4: when ≥2 khoas thrive, members cross-pollinate — bonus to a 2nd stat
  HEAD_BONUS: 0.12,           // P4: a khoa with a trưởng-khoa teacher synergizes at one fewer member + grows faster
  // Cúp Khoa (iter 80): an annual inter-khoa contest in month 5. Reward is deliberately STORY-not-power —
  // a trophy record (a pennant race) + a morale lift (mood above the penalty floor gives no growth bonus,
  // so the destiny cascade is untouched) + a tiny reputation nod. No cash/stat/growth reward → no dominant strategy.
  KHOA_CUP: { month: 5, moodWin: 12, ttWin: 2 },
  // KHOA / MAJORS (P1) — students auto-join by tell; a khoa unlocks when its building exists; each
  // khoa grows one stat and leans toward one destiny (the satirical hook). Prodigy joins on unlock.
  MAJORS: [
    { key: "code", name: "Khoa Lập trình", icon: "💻", room: "phongmay", tell: "spark", stat: "tn", cross: "st", dest: "👷 kỹ sư", color: "#6aa9f0",
      line: "Học để cái máy chạy thật, không phải để qua môn.",
      prodigy: { ten: "Tú 'Compiler'", seed: 5, kt: 30, tn: 45, st: 32, cm: 18, vet: 8, mood: 76, tell: "spark" } },
    { key: "make", name: "Khoa Thiết kế Chế tạo", icon: "🎨", room: "xuong", tell: "sky", stat: "st", cross: "tn", dest: "🍎 sáng tạo", color: "#f0c674",
      line: "Cái đẹp không có văn mẫu — phải tự vẽ lấy.",
      prodigy: { ten: "Hà 'Maker'", seed: 5, kt: 26, tn: 35, st: 48, cm: 16, vet: 6, mood: 76, tell: "sky" } },
    { key: "biz", name: "Khoa Khởi nghiệp (Sống Ảo)", icon: "🚀", room: "lab", tell: "hype", stat: "cm", cross: "st", dest: "🪙 cá mập coin", color: "#b48ef0",
      line: "Chưa có sản phẩm nhưng đã có hoodie và pitch deck.",
      prodigy: { ten: "Phát 'Founder'", seed: 4, kt: 25, tn: 18, st: 30, cm: 45, vet: 15, mood: 76, tell: "hype" } }
  ],

  // economy
  BOOT_CASH: 200, BOOK_VALUE: 40, BOOT_ENDOW: 10, BOOT_TUITION: 2, // start-from-nothing: a small pot, near-empty grounds
  MAINT_RATE: 0.007,            // %/month of book+builds
  CASH_KEEP: 800, CASH_DRAIN: 0.005, // iter-159 (owner: "ridiculous endgame money, not 900tr"): the iter-107 hoard-cap is RELAXED — keep more working capital + a much gentler surplus reinvestment, so wealth ACCUMULATES over a long game instead of being pinned ~813tr. (Was 300 / 0.03.)
  // iter-159 — the iter-107 "vận hành" late-game over-drain is RELAXED (owner reversed the hoard-management
  // direction): still rises with size & age (some pressure / realism) but no longer eats the hoard, so the
  // university can grow into a money machine. (rate was 0.22 → 0.09.) The compounding income engine + escalating
  // upgrade sink land in checkpoint 2.
  OPS: { base: 4, perSV: 0.6, rate: 0.09 }, // monthly: (base + perSV·students) · rate · (year−1) — ZERO in the founding year, ramps with age
  DUAN_COST_PER_SV: 1,          // tr/sv/th for Đồ Án & Lab preset
  TUITION_MIN: 1, TUITION_MAX: 6, TUITION_STEP: 0.5,

  // meters
  BOOT_TT: 25, BOOT_UT: 10, BOOT_TC: 30,
  TT_DECAY: 1,                  // per month, flat — but only down to a floor (a working school keeps some hype)
  TT_FLOOR: function (ut) { return 10 + 0.25 * ut; }, // baseline reputation, lifted by Uy Tín — keeps admissions/campus alive
  UT_YEAR_CAP: 3,               // net per year, two pierce events only

  // growth pipeline
  SEED_MULT: function (s) { return 0.7 + 0.15 * s; },
  VET_MULT: function (v) { return 1 - v / 150; },
  KT_SATURATE: 70, KT_RUST: 0.5,
  MOOD_PENALTY_BELOW: 50, DROPOUT_MOOD: 30, DROPOUT_P: 0.10,
  // iter-155 — MOOD as wellbeing-with-consequences BOTH ways (VISION #3 "burnout vs flow"; owner: "including
  // mood"). Until now low mood penalized growth (×0.7) but high mood did nothing. FLOW: a genuinely thriving kid
  // (mood ≥ FLOW_MOOD) is absorbed and learns a little faster (×FLOW_MULT) — applied to GENUINE growth only, NOT
  // cá-mập hustle (flow ≠ gaming). Small + high-bar so it doesn't balloon 🍎 or let the matcher dominate
  // (invariant #1) — sweep-gated. The penalty (×0.7, −30%) still dwarfs the bonus (+6%), so mismatch hurts more
  // than flow helps (the open question holds).
  FLOW_MOOD: 80, FLOW_MULT: 1.06,
  FAV_MOMENT_GAP: 90, FAV_MILE: [40, 60, 80], FAV_MOOD_LOW: 45, FAV_MOOD_HI: 70, // E5-watch: the followed protégé's in-school arc — a caused moment at most ~once a season (THESIS mark 5)
  COHORT_BEAT_GAP: 80, // iter-179: the BROADER cohort becomes someone WHILE you watch — a glimpse (one kid blooming/wilting) at most ~once a season, alternating poles (§C-2 symmetry). Rarer than the protégé arc.
  COHORT_BENT_CM: 40, // iter-198: the 3rd in-play pole — a real builder/maker gift (spark/sky) whose cá-mập hustle (cm ≥ this AND > their signature gift) is overtaking it = the shark forming mid-school, surfaced WHILE you can still act (the epilogue's DISTORT pole, made live; the cohort counterpart of the protégé's cmUp warning).
  CROWD: function (n, base) { return Math.max(0.6, 1 - 0.02 * (n - (base || 12))); }, // iter-166: base scales with campusScale so proportionally-bigger cohorts don't incur extra crowding (spread preserved)

  PRESETS: {
    luyende: { label: "Học Để Qua Môn", kt: 4, tn: 0.4, st: -1, cm: 1.0, mood: -2, vet: 2, cost: 0, tradeoff: "Điểm & Vẹt cao, mài mòn sáng tạo — hợp trò cần khuôn; người mơ mộng dễ thành vẹt văn mẫu hoặc cá mập." }, // cram → gaming-the-system hustle (breeds some cá mập). tn floor 0.4 (was 0): cram suppresses craft but no longer ZEROES it, so the gift still leaves a gift-shaped gap (Mentor's Ledger talent-coupling)
    canbang: { label: "Cân Bằng", kt: 2.5, tn: 1, st: 0.5, cm: 0.5, mood: 0, vet: 0.5, cost: 0, tradeoff: "Đều tay, an toàn — nhiều kỹ sư vững; nhưng hiếm ai bứt phá thành 🍎." },
    duan:    { label: "Đồ Án & Lab", kt: 1, tn: 2, st: 1.5, cm: 1.5, mood: 1, vet: -1, cost: 1, tradeoff: "Thắp sáng người sáng tạo (🍎/maker), cần Phòng Máy — nhưng trò cần khuôn dễ lạc lối, bỏ phí." }
  },
  // MENTOR'S LEDGER Phase 1 — grain↔preset coupling: each teaching style REALIZES the grains it fits and
  // WASTES the rest (VISION invariant #2). Multiplies CRAFT growth (tn/st) so the GIFT, not the policy,
  // decides whose life each thesis realizes. No stored state (computed each tick from tell + preset).
  MATCH: function (tell, preset) {
    var T = {
      spark: { duan: 1.4, canbang: 1.0, luyende: 0.5 }, // tinkerer: thrives in the lab, ground down by cram
      sky:   { duan: 1.4, canbang: 1.0, luyende: 0.5 }, // dreamer: same
      hype:  { duan: 1.0, canbang: 1.4, luyende: 0.6 }, // showy: shines in a balanced room, curdles under cram
      "":    { duan: 0.5, canbang: 1.0, luyende: 1.3 }  // generalist: needs the ladder cram gives, lost in open projects
    };
    var row = T[tell || ""] || T[""];
    return row[preset] != null ? row[preset] : 1.0;
  },
  // a showy kid crammed doesn't realize — they curdle toward gaming-the-system (cá mập): boost hustle growth
  MATCH_CM: function (tell, preset) { return (tell === "hype" && preset === "luyende") ? 1.6 : 1.0; },
  // MENTOR'S LEDGER Phase 2 — the headmaster's scarce ATTENTION. You can actively mentor only a FEW kids;
  // a mentored kid's craft multiplier is lifted (focused attention overcomes a grain mismatch — you RESCUE
  // the wasted). The rest drift on the grain↔preset coupling, so inaction visibly wastes them.
  MENTOR_SLOTS: 3,
  MENTOR_MM: 1.3,
  // E8 ckpt2 (iter 195) — GRAIN-FLAVORED FACULTY: a hired teacher realizes the gift they fit and neglects the rest
  // (a coder-teacher grows coders, a craft-master grows makers, a speaker grows hustlers). teacherFactor() tallies
  // each grain-flavored teacher into aff{spark,sky,hype}; growStudents directs a kid's SIGNATURE-stat growth by
  // (aff[tell] − mean) so it's ZERO-SUM across grains → aggregate-neutral (economy/spread held) but DIRECTED (WHO
  // you hire shapes WHICH talents flower). No grain teachers (the headless baseline never hires the pool) → factor
  // 1 → byte-identical. The trade-off (every lever wastes a life): hire all-coder faculty and your makers languish.
  TEACH_AFF_W: 0.07, TEACH_AFF_CAP: 0.28, // per-lean growth weight + a bound on the swing (≈4 same-grain teachers)
  // The growth-rate lean above barely moves END-STATE realization (the documented saturation wall — a saturating
  // signature stat absorbs a ±rate nudge), so the trade-off is made FELT IN-PLAY instead: a kid whose grain the
  // faculty NEGLECTS loses a little mood (no champion for their gift), so they WILT more visibly (cohortBeat 🍂)
  // — you feel WHO you hired in the cohort, while the realize/waste FLOOR stays stable (sweep-gated). Zero-sum.
  // (The stronger realize/waste-shifting "neglected grain goes adrift" version = ckpt2b, OWNER-GATED — the delicate
  // over-waste balance the ROADMAP flags wants owner playtest, not a headless knob.)
  TEACH_AFF_MOOD: 0.22, // mood/month per lean-unit a championed grain gains / a neglected grain loses (bounded, gentle)
  CKPT2B_CEIL: function (seed) { return 30 + seed * 8; }, // iter-200 (E8 ckpt2b, flagged): a discovered gift with NO faculty champion + no mentor caps its signature stats here → mostly UNDER-realizes (KY_SU/🍎 → lương ổn), some waste. Tuned MODERATE (neglected grain ~65% realized vs ~90% championed — a clear ~25pt cost, not a wipeout: a real breadth-vs-depth faculty trade-off, not a trap). Eased by seed; erased by mentoring. OFF unless CKPT2B_ON (playtest); owner tunes the feel.
  // MENTOR'S LEDGER Phase 1.5 (iter 116, the [EVOLUTION] craft-symmetry fix) — a SEVERE grain-mismatch
  // (MATCH < MISMATCH_MM) caps how far MODEST talent grows: the gifted (high seed) still partly shine, the
  // modest go ADRIFT (capped below the realization floor → thất nghiệp). Makes craft waste the structure-
  // needer it's mismatched with (§C-2 symmetry, was fails-nobody). Talent magnitude still decides (ceiling
  // scales with seed); MENTORING rescues (it lifts mm above MISMATCH_MM, so a mentored kid escapes the cap).
  MISMATCH_MM: 0.7,
  MISMATCH_MOOD_DRAIN: 0.5, // iter-131 — MOOD made live (owner: "including mood"): a severe grain-mismatch (lệch) wears a kid down each month — the "đang nguội dần" read made literally true. Tuned to a BOUNDED tail: the cram GRIND burns out its worst-suited (~3-4/run); a project school doesn't (thematically sharp). Mentoring lifts mm above MISMATCH_MM → spares them. (2.5 mass-culled cram 79/run — reverted to 0.5.)
  MISMATCH_CEIL: function (seed) { return 11 + seed * 7; }, // seed1→18 seed2→25 seed3→32 (all < LUONG_ON tn-floor 40 → adrift) · seed4→39 (borderline) · seed5→46 (the gifted still scrape a realized life)

  ROOMS: {
    phonghoc: { name: "Phòng học", w: 3, h: 2, cost: 0, desc: "Nơi mọi giấc mơ bắt đầu bằng điểm danh. Nâng cấp: +Mood." },
    san:      { name: "Sân trường", w: 4, h: 3, cost: 0, once: true, desc: "Mặt sân đa năng: thể dục, khai giảng, tránh nắng." },
    cangtin:  { name: "Căng Tin Mì Tôm", w: 2, h: 2, cost: 0, free: true, desc: "Bán mì tôm: mỗi bữa một ít tiền tươi (tăng theo cấp). +1 Mood/tháng/cấp. Ngân hàng tặng kèm khi bán nợ." },
    lab:      { name: "Phòng Lab Sống Ảo", w: 2, h: 2, cost: 70, desc: "Các em Sống Ảo livestream kiếm tiền quảng cáo (tăng theo cấp). +0,5 Tiếng Tăm/tháng/cấp. Đẹp nhất trường. Không dạy được gì." },
    phongmay: { name: "Phòng Máy", w: 3, h: 2, cost: 120, desc: "Mở khoá toàn bộ hiệu quả Đồ Án & Lab (thiếu nó: -50%)." },
    xuong:    { name: "Xưởng Chế", w: 3, h: 3, cost: 200, desc: "+1 Tay Nghề khi học Đồ Án. +5 Thực Chất một lần. Bừa bộn, không lên hình." },
    // memorial gardens — late-game prestige: honour a real Vietnamese educator. One-time +Uy Tín,
    // a place to put a question to. Costs escalate; each can be built once. (a cash sink with a soul)
    vuontdn:  { name: "Vườn Trần Đại Nghĩa", w: 2, h: 2, cost: 150, ded: "tdn", utBoost: 5, once: true, desc: "Tưởng niệm người tạo ra phương tiện từ sự thiếu thốn. +5 Uy Tín lâu dài." },
    vuontqb:  { name: "Vườn Tạ Quang Bửu", w: 2, h: 2, cost: 250, ded: "tqb", utBoost: 5, once: true, desc: "Tưởng niệm vị bộ trưởng tự học, mở cửa cho cả một thế hệ. +5 Uy Tín lâu dài." },
    vuonhxh:  { name: "Vườn Hồ Xuân Hương", w: 2, h: 2, cost: 350, ded: "hxh", utBoost: 5, once: true, desc: "Tưởng niệm người viết bằng tiếng của chính mình giữa thời văn mẫu. +5 Uy Tín lâu dài." },
    vuonntt:  { name: "Vườn Nguyễn Trường Tộ", w: 2, h: 2, cost: 450, ded: "ntt", utBoost: 6, once: true, desc: "Tưởng niệm người đòi dạy thực học giữa thời chỉ học để thi. +6 Uy Tín lâu dài." },
    vuoncva:  { name: "Vườn Chu Văn An", w: 2, h: 2, cost: 550, ded: "cva", utBoost: 6, once: true, desc: "Tưởng niệm người thầy treo ấn về quê hơn là làm ngơ. +6 Uy Tín lâu dài." }
  },

  TEACH_SALARY: function (d, dd) { return 8 + 2.5 * (d + dd); },

  ADMIT: {
    CUT_MIN: 12, CUT_MAX: 30.5, CUT_STEP: 0.25,
    QUOTA_MIN: 4, QUOTA_MAX: 14,
    // E15c (iter 137) — the TUITION trade-off the owner flagged: a pricey school draws FEWER hồ sơ (access cost),
    // so "always max it" stops being free. NEUTRAL at the boot default (2) → the sweep (fixed tuition 2) is
    // unaffected; the trade-off only bites when the PLAYER moves tuition (income/SV ↑ vs applicant volume ↓).
    POOL: function (tt, tuition) {
      var base = Math.max(24, Math.min(180, Math.round(24 + 1.6 * tt)));
      var acc = Math.max(0.5, Math.min(1.15, 1 - 0.12 * ((tuition == null ? 2 : tuition) - 2)));
      return Math.round(base * acc);
    },
    // E15c — tuition also lowers applicant QUALITY: a pricey school prices out the gifted-but-poor (who have
    // scholarship options elsewhere), leaving richer-but-weaker applicants. This is the lever that BITES (pool
    // SIZE doesn't — it stays above quota); together they = "fewer AND weaker", the owner's words. NEUTRAL at 2.
    MU: function (ut, tt, year, tuition) { return 17 + 0.05 * ut + 0.015 * tt + 0.25 * (year - 1) - 0.6 * ((tuition == null ? 2 : tuition) - 2); },
    SIGMA: 3.2,
    // E-UNDERDOG: a fraction of LOW-score applicants are "ngọc thô" — a real gift the entrance exam underrates.
    // Below the typical cutoff, so they're caught only when you OPEN THE DOOR (lower điểm chuẩn) — the đề Văn
    // bite (a score doesn't measure talent) made playable. Dormant for high-cutoff play; you discover the gift
    // the usual way (teach/mentor — E5), and a realized one is named in the epilogue ("ngọc thô — vào cửa hẹp").
    DIAMOND_P: 0.20, DIAMOND_SCOREMAX: 16,
    // E-UNDERDOG admit path: a SUBSTANTIVE school (cao Thực Chất) runs a holistic intake — it extends a few
    // "đặc cách" offers BELOW the score bar (looking past the entrance number), where the ngọc thô hide. A score-
    // obsessed (hype) school takes only top scorers and misses them. This ties the underdog to the substance
    // thesis (connecting systems, owner's steer). A GAMBLE — most đặc cách are ordinary, ~1 in 5 a real gift.
    DAX: function (tc) { return tc >= 80 ? 2 : (tc >= 55 ? 1 : 0); },
    // E9 (iter 153) — COHESION AT OUTPUT: the school's character shapes WHO applies (owner: "systems feel
    // separate" / "automatic based on ranking"). A SUBSTANTIVE school (high Thực Chất) draws marginally more
    // makers (spark↑) and fewer clout-chasers; a hype/cram school (low TC) draws more of the showy (spark↓ →
    // hype↑). BOUNDED & NON-RUNAWAY: centered at TC 50 (the adequate middle), hard-capped at ±5% on the spark
    // share (generalist "" stays a fixed 50%, so spark+hype just trade within their half). Soft by design — the
    // felt loop is the admissions NOTE; the tilt makes it true. Sweep-gated (must not break the spread/dominance).
    REP_TILT: function (tc) { var t = (tc - 50) / 100 * 0.15; return t < -0.05 ? -0.05 : (t > 0.05 ? 0.05 : t); },
    HONBA_P: 0.25,
    SEED_BASE: [0.30, 0.30, 0.20, 0.13, 0.07],
    CLC_P: 0.08, CLC_P_HI: 0.12, CLC_TT: 50,
    RIVALS: function (year) {
      return [
        { name: "Học viện iSteve Toàn Cầu", cut: 26.5 + 0.5 * (year - 1), noise: 0.75 },
        { name: "ĐH Dân Lập Bình Thường", cut: 19, noise: 1 },
        { name: "ĐH Cộng Đồng Bến Sung", cut: 15.0, noise: 0 }
      ];
    },
    RANK_TT: [8, 4, 1, -3],
    AUTO_DROP: 0.5, AUTO_QUOTA: 12
  },

  FUND: {
    ENDOW_RATE: 0.004, GIFT_TO_QUY_MIN: 30,
    SCHOL_GATES: [200, 350, 500], SCHOL_DRAW: 12,
    CONTRACT_CAP: function (tt) { return Math.min(3, 1 + Math.floor(tt / 35)); },
    MORALITY: function (sev) { return 0.5 + 0.25 * sev; },
    BREAK_TT: -8, BREAK_BLACKLIST: 2
  },

  PHOT: {
    P: function (sev, tt) { return (0.08 + 0.04 * sev) * (1 + tt / 50); },
    DMG: function (sev, tt) { return (15 + 5 * sev) * (1 + tt / 50); }
  },

  JUNE: {
    DIEM: { base: 2, tn: 0.045, st: 0.035, vet: 0.02, noRoom: -1.0, qvmCap: 0.5, qvmPer: 0.1, noise: 0.5 },
    PASS: 5.0,
    POLICY_DAM: { bonus: 1.0, vetCohort: 5, seedSev: 1, ttWin: 4, ttLose: -6 },
    DEFQ: { st: 0.5, tn: 0.3, ut: 0.2, viralAt: 70, pViral: 0.30, pViralThat: 0.60, viralTT: 10, viralUT: 5 }
  },

  // graduation cascade — priority order, first match wins (8 rows, no 🍎)
  CASCADE: [
    { key: "CA_MAP_COIN", emoji: "🪙", name: "Cá Mập Coin", gate: { cm: [52, 1], tn: [45, -1], vet: [50, 1] } },
    { key: "QUAN_VAN_MAU", emoji: "📋", name: "Quán Quân Văn Mẫu", gate: { kt: [60, 1], vet: [50, 1], st: [35, -1] } },
    { key: "FOUNDER", emoji: "🚀", name: "Founder Gọi Vốn", gate: { cm: [80, 1], st: [60, 1], tn: [51, -1] } },
    { key: "KY_SU", emoji: "👷", name: "Kỹ Sư Chân Chính", gate: { tn: [70, 1] } },
    { key: "XUAT_NGOAI", emoji: "✈️", name: "Kỹ Sư Xuất Ngoại", gate: { tn: [60, 1], cm: [50, 1], st: [50, -1] } },
    { key: "KOL", emoji: "📱", name: "Reviewer Triệu Sub", gate: { cm: [70, 1], tn: [40, 1], tnMax: [70, -1] } },
    { key: "LUONG_ON", emoji: "💼", name: "Nhân Viên Lương Ổn", gate: { ktOr: [50, 1], tnOr: [40, 1] } },
    { key: "THAT_NGHIEP", emoji: "🪪", name: "Thất Nghiệp Có Bằng", gate: {} }
  ],
  TIEMNANG: { st: 80, tn: 70, cm: 60, vetMax: 50, tcMin: 55 },

  ALUM: {
    // v0 entry-state mapping for not-yet-shipped states
    ENTRY_MAP: { CA_MAP_COIN: "CA_MAP_COIN", QUAN_VAN_MAU: "QUAN_VAN_MAU", FOUNDER: "FOUNDER", KY_SU: "KY_SU", XUAT_NGOAI: "KY_SU", KOL: "LUONG_ON", LUONG_ON: "LUONG_ON", THAT_NGHIEP: "THAT_NGHIEP" },
    ENTRY_FLAGS: { XUAT_NGOAI: "xn", KOL: "kol" },
    STATES: ["THAT_NGHIEP", "LUONG_ON", "KY_SU", "FOUNDER", "CA_MAP_COIN", "QUAN_VAN_MAU", "BI_BAT", "STEVE"],
    CHIPS: { THAT_NGHIEP: "🪪 Thất nghiệp", LUONG_ON: "💼 Lương ổn", KY_SU: "👷 Kỹ sư", FOUNDER: "🚀 Founder", CA_MAP_COIN: "🪙 Cá mập coin", QUAN_VAN_MAU: "📋 Quán quân", BI_BAT: "🚔 Bị bắt", STEVE: "🍎 STEVE" },
    // FSM v0 rows: [target, base, gateFn(craft,hustle,hollow,lua,a)]
    FSM: {
      THAT_NGHIEP: [["LUONG_ON", 0.30, null], ["KY_SU", 0.10, "craft50"], ["FOUNDER", 0.04, "lua3"]],
      LUONG_ON: [["THAT_NGHIEP", 0.04, null], ["KY_SU", 0.08, "craft55"], ["FOUNDER", 0.03, "lua3hustle50"]],
      KY_SU: [["FOUNDER", 0.06, "lua3"], ["LUONG_ON", 0.03, null]],
      FOUNDER: [["THAT_NGHIEP", 0.12, null], ["KY_SU", 0.08, null], ["CA_MAP_COIN", 0.08, "coinpull"]],
      CA_MAP_COIN: [["BI_BAT", 0, "arrestClock"]],
      QUAN_VAN_MAU: [["LUONG_ON", 0.03, null]],
      BI_BAT: [],
      STEVE: []
    },
    ROW_CAP: 0.95,
    STEVE_BASE: 0.05,
    STEVE_LUA: { 5: 1.5, 4: 1.2, 3: 0.7 }, STEVE_LUA_ELSE: 0.25,
    STEVE_CRAFT: 75, STEVE_HOLLOW: 40, STEVE_NOFLAG: 0.15,
    KEYNOTE_TT: 15, KEYNOTE_UT: 5, MEGA_GIFT: 500,
    GIFT_BASE: { KY_SU: 0.20, LUONG_ON: 0.02, QUAN_VAN_MAU: 0.05, STEVE: 1.0 },
    GIFT_AMT: { KY_SU: [10, 30], LUONG_ON: [2, 5], QUAN_VAN_MAU: [5, 10], STEVE: [500, 500] },
    ITEM_P: { STEVE: 0.85, FOUNDER: 0.30, KY_SU: 0.14 },  // iter-182 (owner steer ckpt3): successful alumni occasionally give a NON-monetary ITEM (grat-scaled). A foundation for "extension functions later".
    ITEM_CAP: 24,
    ARREST: function (sev, tt, yearsOut) { return 15 * (1 + tt / 50) * Math.max(0.5, 1 - 0.05 * yearsOut); },
    SCRIPTED: [{ ten: "Trần Phi Lợi", entry: "CA_MAP_COIN", forceYear: 2, forceMonth: 3, force: "BI_BAT" }],
    // E4 — REALIZATION-AWARE DESTINY: a gift's flowering is RELATIVE to its magnitude (seed). FLOURISH = how
    // high a destiny stands as a *flourishing* life (a steady kỹ sư IS realized; 💼 lương ổn is decent-but-modest;
    // distortions/unemployment are floors). EXPECT(seed) = the flourishing a gift of that size deserved.
    // realFrac = flourish/expect → carried frozen on a.fs.real. This makes craft's hidden waste VISIBLE: a
    // prodigy (seed≥4) who merely SETTLES into lương ổn is UNDER-realized (the quiet tragedy craft funnels into,
    // previously unnameable — see [EVOLUTION] §C-2); a modest kid (seed≤2) who reaches kỹ sư+ is OVER-realized
    // (the school LIFTED them). Orthogonal to the 🍎 gate — aLua stays = seed only, never fed by realization.
    FLOURISH: { STEVE: 5, FOUNDER: 5, KY_SU: 4, LUONG_ON: 2, QUAN_VAN_MAU: 1, CA_MAP_COIN: 1, THAT_NGHIEP: 0, BI_BAT: 0 },
    EXPECT: function (seed) { return seed < 1 ? 1 : seed > 5 ? 5 : seed; },
    UNDER_REAL: 0.6    // realFrac < this AND seed≥4 (and NOT already a loud-waste state) → under-realized prodigy
  },

  PANTHEON: [
    { key: "tdn", name: "Học bổng Trần Đại Nghĩa", eff: "tn", val: 1.15,
      line: "Bỏ lương kỹ sư ở Paris để về nước năm 1946; cha đẻ ngành quân giới — ông tạo ra phương tiện từ sự thiếu thốn." },
    { key: "tqb", name: "Học bổng Tạ Quang Bửu", eff: "st", val: 1.15,
      line: "Vị bộ trưởng đại học tự học mọi thứ, và ký giấy cho cả một thế hệ ra thế giới học về." },
    { key: "hxh", name: "Học bổng Hồ Xuân Hương", eff: "vet", val: 0.5,
      line: "Bà chúa thơ Nôm — viết bằng tiếng của chính mình giữa một thời đại viết bằng điển cố đi mượn." }
  ],

  // memorial-garden-only figures (not scholarships) — their idea, put to the school's question
  GARDEN_FIGURES: {
    ntt: { name: "Nguyễn Trường Tộ", line: "Người dâng điều trần đòi dạy thực học — toán, máy móc, ngoại ngữ — giữa một thời chỉ học để thi. Triều đình xếp xó. Một trăm năm sau, ta vẫn đang cãi nhau về đúng điều ông viết." },
    cva: { name: "Chu Văn An", line: "Thầy của các vua. Dâng sớ xin chém bảy nịnh thần; vua không nghe, ông treo ấn về quê dạy học. Có những thứ không đánh đổi được bằng một cái chức." }
  },

  ESSAY: { CAST_CAP: 4, STEVE_CAP: 2, BIBAT_CAP: 1, SAME_STATE_RATIO: 0.40, MAJOR_RATIO: 0.35, ENDOW_THIN: 20, HYPE_GAP: 30 }
};
