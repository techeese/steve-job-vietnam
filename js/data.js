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
  RUN_CAP_YEARS: 12,
  MILESTONE_TT: 4,              // small Tiếng Tăm reward per founding milestone (the school gets noticed)
  ROOM_MAX_LEVEL: 3,            // buildings upgrade in place (one on the map) up to this level
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
  CASH_KEEP: 300, CASH_DRAIN: 0.03, // surplus above CASH_KEEP reinvested into operations/mo (money sink; protects normal saving)
  // late-game economic pressure (iter 107, owner-steered): "vận hành" overhead rising with size AND age —
  // erodes the hoard so income must be tended late-game. Tuned so functioning schools never go bankrupt.
  OPS: { base: 4, perSV: 0.6, rate: 0.22 }, // monthly: (base + perSV·students) · rate · (year−1) — ZERO in the founding year, ramps with age
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
  FAV_MOMENT_GAP: 90, FAV_MILE: [40, 60, 80], FAV_MOOD_LOW: 45, FAV_MOOD_HI: 70, // E5-watch: the followed protégé's in-school arc — a caused moment at most ~once a season (THESIS mark 5)
  CROWD: function (n) { return Math.max(0.6, 1 - 0.02 * (n - 12)); },

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
    cangtin:  { name: "Căng Tin Mì Tôm", w: 2, h: 2, cost: 0, free: true, desc: "+1 Mood/tháng/cấp toàn trường. Ngân hàng tặng kèm khi bán nợ." },
    lab:      { name: "Phòng Lab Sống Ảo", w: 2, h: 2, cost: 70, desc: "+0,5 Tiếng Tăm/tháng/cấp. Đẹp nhất trường. Không dạy được gì." },
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
    POOL: function (tt) { return Math.max(24, Math.min(180, Math.round(24 + 1.6 * tt))); },
    MU: function (ut, tt, year) { return 17 + 0.05 * ut + 0.015 * tt + 0.25 * (year - 1); },
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
