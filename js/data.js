/* ============================================================================
   Học viện Steve — js/data.js
   ALL tunables (CONFIG) and ALL text/content (CONTENT). No logic, no DOM.
   Layer law: mechanics numbers live HERE, never in state; text lives HERE,
   never inline in engine/ui code.
   ========================================================================== */

var CONFIG = {
  V: 2,
  SAVE_KEY: "hoc-vien-steve-v2",
  // clock: 10 ticks = 1 day; 1 day = 1.0s at 1x
  TICK_MS: 100, TICKS_PER_DAY: 10, DAYS_PER_MONTH: 30,
  GRID_W: 15, GRID_H: 12, TILE: 26,
  ROSTER_CAP: 48, COHORT_NOMINAL: 12,
  RUN_CAP_YEARS: 12,

  // economy
  BOOT_CASH: 200, BOOK_VALUE: 40, BOOT_ENDOW: 10, BOOT_TUITION: 2, // start-from-nothing: a small pot, near-empty grounds
  MAINT_RATE: 0.007,            // %/month of book+builds
  CASH_KEEP: 300, CASH_DRAIN: 0.03, // surplus above CASH_KEEP reinvested into operations/mo (money sink; protects normal saving)
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
  CROWD: function (n) { return Math.max(0.6, 1 - 0.02 * (n - 12)); },

  PRESETS: {
    luyende: { label: "Học Để Qua Môn", kt: 4, tn: 0, st: -1, cm: 1.0, mood: -2, vet: 2, cost: 0 }, // cram → gaming-the-system hustle (breeds some cá mập)
    canbang: { label: "Cân Bằng", kt: 2.5, tn: 1, st: 0.5, cm: 0.5, mood: 0, vet: 0.5, cost: 0 },
    duan:    { label: "Đồ Án & Lab", kt: 1, tn: 2, st: 1.5, cm: 1.5, mood: 1, vet: -1, cost: 1 }
  },

  ROOMS: {
    phonghoc: { name: "Phòng học", w: 3, h: 2, cost: 0, desc: "Nơi mọi giấc mơ bắt đầu bằng điểm danh." },
    san:      { name: "Sân trường", w: 4, h: 3, cost: 0, desc: "Mặt sân đa năng: thể dục, khai giảng, tránh nắng." },
    cangtin:  { name: "Căng Tin Mì Tôm", w: 2, h: 2, cost: 0, free: true, desc: "+1 Mood/tháng toàn trường. Ngân hàng tặng kèm khi bán nợ." },
    lab:      { name: "Phòng Lab Sống Ảo", w: 2, h: 2, cost: 70, desc: "+0,5 Tiếng Tăm/tháng. Đẹp nhất trường. Không dạy được gì." },
    phongmay: { name: "Phòng Máy", w: 3, h: 2, cost: 120, desc: "Mở khoá toàn bộ hiệu quả Đồ Án & Lab (thiếu nó: -50%)." },
    xuong:    { name: "Xưởng Chế", w: 3, h: 3, cost: 200, desc: "+1 Tay Nghề khi học Đồ Án. +5 Thực Chất một lần. Bừa bộn, không lên hình." }
  },

  TEACH_SALARY: function (d, dd) { return 8 + 2.5 * (d + dd); },

  ADMIT: {
    CUT_MIN: 12, CUT_MAX: 30.5, CUT_STEP: 0.25,
    QUOTA_MIN: 4, QUOTA_MAX: 14,
    POOL: function (tt) { return Math.max(24, Math.min(180, Math.round(24 + 1.6 * tt))); },
    MU: function (ut, tt, year) { return 17 + 0.05 * ut + 0.015 * tt + 0.25 * (year - 1); },
    SIGMA: 3.2,
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
    { key: "QUAN_VAN_MAU", emoji: "📋", name: "Quán Quân Văn Mẫu", gate: { kt: [80, 1], vet: [60, 1], st: [40, -1] } },
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
    SCRIPTED: [{ ten: "Trần Phi Lợi", entry: "CA_MAP_COIN", forceYear: 2, forceMonth: 3, force: "BI_BAT" }]
  },

  PANTHEON: [
    { key: "tdn", name: "Học bổng Trần Đại Nghĩa", eff: "tn", val: 1.15,
      line: "Bỏ lương kỹ sư ở Paris để về nước năm 1946; cha đẻ ngành quân giới — ông tạo ra phương tiện từ sự thiếu thốn." },
    { key: "tqb", name: "Học bổng Tạ Quang Bửu", eff: "st", val: 1.15,
      line: "Vị bộ trưởng đại học tự học mọi thứ, và ký giấy cho cả một thế hệ ra thế giới học về." },
    { key: "hxh", name: "Học bổng Hồ Xuân Hương", eff: "vet", val: 0.5,
      line: "Bà chúa thơ Nôm — viết bằng tiếng của chính mình giữa một thời đại viết bằng điển cố đi mượn." }
  ],

  ESSAY: { CAST_CAP: 4, STEVE_CAP: 2, BIBAT_CAP: 1, SAME_STATE_RATIO: 0.40, MAJOR_RATIO: 0.35, ENDOW_THIN: 20, HYPE_GAP: 30 }
};

/* ========================== CONTENT (all text) ========================== */

var CONTENT = {
  schoolName: "Học viện Steve",
  schoolSub: "(tên đầy đủ đang chờ Bộ duyệt mã trường)",
  khoa: "Khoa Công Nghệ & Sáng Tạo (mã ngành đang chờ Bộ duyệt)",
  bought: "Trường ĐH Dân Lập Văn Mẫu Số 9",
  disclaimer: "Mọi nhân vật, công ty, học viện trong game đều là hư cấu. Mọi sự trùng hợp là do vũ trụ thích đùa. Các danh nhân lịch sử được vinh danh với lòng kính trọng, đúng như mọi mái trường Việt Nam vẫn làm.",
  boot: [
    "Tháng 6/2026, đề Văn tốt nghiệp hỏi cả nước: làm thế nào để Việt Nam có những 'Steve Jobs Việt Nam'?",
    "Bài luận trả lời của bạn viral. Bạn cắm sổ đỏ căn nhà, gom thêm 50 triệu 'vốn mồi' thắng từ một cuộc thi khởi nghiệp ăn theo trào lưu — đủ để thuê một khoảnh sân trống.",
    "Không trường, không phòng học, không sinh viên. Chỉ có một khoản vốn mỏng, một thầy giáo chịu theo, và một lời hứa: xây từ con số 0.",
    "Nhiệm vụ: dựng lớp đầu tiên, chiêu sinh khóa đầu, rồi từ từ nuôi một 'Steve Jobs' thật — đừng nặn thêm cá mập coin như Trần Phi Lợi (học trò cũ của bạn, sắp lên báo)."
  ],

  dePool: [
    "Làm thế nào để Việt Nam có những 'Steve Jobs Việt Nam'? (đề gốc, cả nước rung chuyển)",
    "'Steve Jobs Việt Nam' — khát vọng hay khẩu hiệu? Trình bày suy nghĩ của anh/chị.",
    "Hai năm sau ngày cả nước đi tìm Steve Jobs Việt Nam, có ý kiến cho rằng chúng ta đang tìm nhầm chỗ. Anh/chị có đồng ý không?",
    "Có nên 'sản xuất' thiên tài? Bàn luận.",
    "Đề trích nguyên văn một bài làm năm trước. Bài văn thật nhất nước đã trở thành… văn mẫu."
  ],

  defenseBanks: {
    vetOpen: "Trong dòng chảy bất tận của cách mạng công nghiệp 4.0…",
    that: ["Hội đồng hỏi vì sao con ốc M2 toét ren. Em trả lời: vì em vặn nó 200 lần trước khi hiểu nó.",
      "Em không có slide chuyển cảnh. Em có cái máy chạy được.",
      "Phần khó nhất không phải code. Là thừa nhận bản đầu tiên sai."],
    heSinhThai: ["Đồ án của em là một hệ sinh thái. Hội đồng hỏi nó làm gì. Em nói: nó kết nối.",
      "Slide 12 có chữ 'blockchain'. Không ai hỏi gì thêm."]
  },

  outcomeFlavor: {
    CA_MAP_COIN: "Đã đăng bài 'cơ hội X100 cho người dám nghĩ lớn' ngay trong lễ tốt nghiệp.",
    QUAN_VAN_MAU: "Thuộc 200 mẫu mở bài. Sẽ thi công chức với số báo danh đẹp.",
    FOUNDER: "Đã có pitch deck trước khi có sản phẩm. Thứ tự này nói lên nhiều điều.",
    KY_SU: "Không phát biểu gì trong lễ tốt nghiệp. Đang sửa cái loa bị rè.",
    XUAT_NGOAI: "Vé một chiều, hợp đồng hai năm, lời hứa 'em sẽ về' để ngỏ.",
    KOL: "Camera tốt hơn điểm số. Triệu sub đầu tiên trong tầm với.",
    LUONG_ON: "Một cuộc đời tử tế, lương đúng hạn, không lên báo. Có khi thế là thắng.",
    THAT_NGHIEP: "Tấm bằng đóng khung rất đẹp. Cái khung là đồ án Xưởng Chế."
  },
  nearMiss: "Thiếu {n} điểm {stat} nữa thì… thôi, không nói nữa.",
  bacTamTiemNang: "Bác Tâm: “Đứa này… để xem.”",
  entryLine: "Trạng thái đầu đời: {chip}",

  alumLines: {
    THAT_NGHIEP: ["{ten} vẫn đang 'cân nhắc các lựa chọn'.", "{ten} từ chối một offer vì 'không đúng đam mê'."],
    LUONG_ON: ["{ten} được tăng lương 8%. Đăng ảnh cà phê.", "{ten} đi làm đúng giờ năm thứ ba liên tiếp."],
    KY_SU: ["{ten} được cấp bằng sáng chế phụ. Không đăng gì.", "{ten} sửa xong cái máy mà ba người trước bó tay."],
    FOUNDER: ["Startup của {ten} gọi vốn vòng hạt giống. Hạt rất nhỏ.", "{ten} đổi tagline công ty lần thứ tư trong năm."],
    CA_MAP_COIN: ["{ten} mở khoá học 'tư duy triệu đô', học phí bốn số.", "Sàn của {ten} 'bảo trì hệ thống' lần thứ ba tháng này."],
    QUAN_VAN_MAU: ["{ten} đạt chiến sĩ thi đua. Lần thứ năm.", "{ten} được khen vì biên bản họp đẹp nhất phòng."],
    BI_BAT: ["Phiên toà của {ten} hoãn lần hai.", "{ten} viết thư từ trại: chữ đẹp hơn hồi đi học."],
    STEVE: ["Bài keynote của {ten} được chiếu lại trong giờ Văn.", "{ten} từ chối lên bìa tạp chí. Tạp chí tự in."]
  },
  garageLine: "Công ty của {ten} sa thải 90% nhân sự. {ten} đang ngủ trong ga-ra.",
  keynoteLine: "MỘT THỨ NỮA… — {ten} bước ra sân khấu. Cả nước nhận ra câu trả lời của đề Văn năm ấy.",
  arrestTPL: "Cựu sinh viên Trần Phi Lợi bị bắt — sàn coin XÔIĐỖ sập.",
  arrestNote: "khóa này tốt nghiệp thời chủ cũ",
  giftHead: "Cảm ơn thầy đã không bắt em học thuộc.",
  giftVt: { tuaVit: "…vẫn nhớ chuyện cái tua vít.", phongmay: "…vẫn nhớ buổi tối được mượn phòng máy.", pccc: "…vẫn nhớ lần trường tự báo cáo vụ cháy." },

  teachers: {
    inherited: [
      { id: "td", ten: "Thầy Thể Dục Kiêm Mọi Thứ", day: 2, dien: 2, luong: 18, trait: "", note: "tự động dạy thay lớp trống" },
      { id: "gtm", ten: "Cô Giáo Trình Mẫu", day: 2, dien: 9, luong: 22, trait: "", note: "biên chế cũ: không tăng lương, không nghỉ việc", bienChe: true },
      { id: "isi", ten: "GS Đếm Bài Báo ISI", day: 3, dien: 5, luong: 28, trait: "isi", note: "biên chế — +0,5 Tiếng Tăm/tháng; lớp ông dạy -10%", bienChe: true }
    ],
    pool: [
      { id: "coder", ten: "Thầy Coder Tự Học", day: 9, dien: 1, luong: 15, trait: "tch", note: "không bằng cấp, rẻ vì thị trường định giá tờ giấy" },
      { id: "diengia", ten: "Thầy Diễn Giả Truyền Cảm Hứng", day: 1, dien: 10, luong: 25, trait: "hype", note: "+5 Mood khi vào, -3 sau hai tháng" },
      { id: "ielts", ten: "Cô IELTS Pitch Deck", day: 5, dien: 8, luong: 35, trait: "", note: "dạy thật lẫn diễn thật" },
      { id: "kysu", ten: "Thầy Cựu Kỹ Sư Phương Đông", day: 9, dien: 3, luong: 38, trait: "tch", note: "đắt. đáng." }
    ]
  },

  nameParts: {
    ho: ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương"],
    dem: ["Văn", "Thị", "Minh", "Ngọc", "Hữu", "Đức", "Thanh", "Quốc", "Gia", "Khánh", "Phương", "Hải"],
    ten: ["An", "Bình", "Châu", "Dũng", "Giang", "Hà", "Khoa", "Linh", "My", "Nam", "Oanh", "Phúc", "Quân", "Sơn", "Thảo", "Uyên", "Vy", "Xuân", "Yến", "Đạt", "Hiếu", "Trang", "Tùng", "Nhi"]
  },

  events: [
    { id: "chuong", title: "🔔 Mai Sương tháo chuông trường",
      desc: "Mai Sương tháo chuông trường ra xem — 'nó kêu lệch nửa nốt'. Bảo vệ đang chờ ý kiến hiệu trưởng.",
      scripted: true,
      choices: [
        { label: "Kỷ luật trước toàn trường", hint: "+2 KT cả lớp, Sương -5 ST", fx: "chuongKyLuat" },
        { label: "Lờ đi", hint: "không có gì xảy ra", fx: null },
        { label: "Đưa em cái tua vít", hint: "Sương +3 TN, một việc tử tế", fx: "chuongTuaVit" }
      ] },
    { id: "duanrieng", title: "💻 Lén làm dự án riêng",
      desc: "{ten} bị bắt gặp làm dự án riêng trong giờ Học Để Qua Môn. Em ấy bảo 'cái này chạy được thật mà thầy'.",
      pred: "anyLuyende",
      choices: [
        { label: "Kỷ luật", hint: "+2 KT lớp, em ấy -4 ST", fx: "duanKyLuat" },
        { label: "Lờ đi", hint: "không có gì xảy ra", fx: null },
        { label: "Cho mượn phòng máy sau giờ", hint: "-2tr, em ấy +4 TN, một việc tử tế", fx: "duanChoMuon" }
      ] },
    { id: "tvc", title: "📺 Trứng Vàng muốn quay TVC",
      desc: "Đối tác đề nghị quay TVC tại Lab Sống Ảo: 'các em chỉ cần ngồi gõ phím, không cần máy chạy thật'.",
      pred: "contractPr",
      choices: [
        { label: "Đồng ý", hint: "+3 Tiếng Tăm, +1 mầm phốt", fx: "tvcOk" },
        { label: "Từ chối khéo", hint: "đối tác ghi nhớ", fx: "tvcNo" }
      ] },
    { id: "clcdoi", title: "💎 Phụ huynh CLC đòi điểm",
      desc: "Một phụ huynh hệ Chất Lượng Cao gọi điện: 'học phí gấp ba thì điểm đồ án cũng nên… tương xứng'.",
      pred: "anyClc",
      choices: [
        { label: "Hứa 'sẽ lưu ý'", hint: "+2 Vẹt khoá đó", fx: "clcHua" },
        { label: "Nói thẳng là không", hint: "20% em đó rời trường, +1 Thực Chất", fx: "clcThang" }
      ] },
    { id: "chay", title: "🔥 Cháy nhỏ ở Xưởng",
      desc: "Một mạch sạc tự chế bốc khói trong Xưởng Chế. Dập kịp. Không ai biết… trừ những người biết.",
      pred: "xuongDuan",
      choices: [
        { label: "Giấu", hint: "+1 mầm phốt nặng", fx: "chayGiau" },
        { label: "Báo cáo + mời PCCC", hint: "-2 Tiếng Tăm, một việc tử tế", fx: "chayBao" }
      ] },
    { id: "baoluu", title: "🚪 Xin bảo lưu để startup 'như Jobs'",
      desc: "{ten} xin bảo lưu: 'Jobs cũng bỏ học mà thầy'. Em ấy chưa có sản phẩm, nhưng có hoodie.",
      pred: "moodLow",
      choices: [
        { label: "Cấp học bổng giữ em lại", hint: "-10tr, một việc tử tế", fx: "baoluuGiu" },
        { label: "Ký đơn", hint: "em ấy rời trường", fx: "baoluuKy" }
      ] },
    { id: "tanggio", title: "📚 Cô Giáo Trình Mẫu xin tăng giờ",
      desc: "Cô Giáo Trình Mẫu đề nghị tăng giờ 'ôn theo đề cương chuẩn' cho Năm 4: 'đồ án mẫu của tôi chưa rớt em nào'.",
      pred: "nam4Duan",
      choices: [
        { label: "Đồng ý", hint: "+2 KT, +3 Vẹt Năm 4", fx: "tangGioOk" },
        { label: "Từ chối", hint: "+1 Thực Chất", fx: "tangGioNo" }
      ] },
    { id: "chodoan", title: "🛒 Chợ đồ án mẫu",
      desc: "Trước bảo vệ, một 'dịch vụ' chào bán đồ án mẫu kèm slide đẹp: 15tr trọn gói, bảo hành qua hội đồng.",
      pred: "thang5",
      choices: [
        { label: "Mua cho khoá yếu", hint: "-15tr, +0,5 điểm, +10 Vẹt, +1 mầm phốt nặng", fx: "chodoanMua" },
        { label: "Không mua", hint: "bảo vệ bằng thực lực", fx: null }
      ] },
    { id: "baodauRa", title: "📸 Báo muốn bài 'thủ khoa đầu ra'",
      desc: "Một tờ báo muốn viết 'sinh viên trường mình ra trường lương nghìn đô'. Họ cần một gương mặt biết cười.",
      pred: "hasNam4",
      choices: [
        { label: "Dàn dựng với em được gà kỹ", hint: "+3 Tiếng Tăm, +1 mầm phốt", fx: "baoGa" },
        { label: "Để một kỹ sư thật nói vụng về", hint: "+1 Uy Tín, một việc thật", fx: "baoThat" }
      ] },
    { id: "quykhuyenhoc", title: "🎁 Phụ huynh lập 'quỹ khuyến học'",
      desc: "Một phụ huynh khá giả đề nghị tặng 25tr 'quỹ khuyến học', kèm lời nhắn mong khoa 'lưu ý' con mình.",
      pred: "common",
      choices: [
        { label: "Nhận quỹ, sẽ 'lưu ý'", hint: "+25tr, +2 Vẹt khoá cuối, +1 mầm phốt nặng", fx: "quaNhan" },
        { label: "Cảm ơn, xin không nhận", hint: "+2 Uy Tín, Bác Tâm gật đầu", fx: "quaTuChoi" }
      ] }
  ],

  ticker: {
    idle: [
      "Khuôn viên đạt chuẩn quốc tế (1/100 quy mô).",
      "Bác Tâm quét sân. Sân sạch. Không có gì để đưa tin.",
      "Phòng Đào Tạo thông báo: mã ngành vẫn đang chờ duyệt.",
      "Wifi trường: 'kết nối được, theo nghĩa triết học'.",
      "Một sinh viên hỏi thư viện ở đâu. Câu hỏi được ghi nhận."
    ],
    flagpole: "Bác Tâm đọc lại đề Văn 2026 ở cột cờ. Không ai bình luận.",
    thptJune: "2,1 triệu thí sinh vừa được hỏi câu hỏi của trường bạn.",
    poolForeshadow: "{n} hồ sơ đang hướng về cổng trường.",
    foundingJune: "Hết một năm học. Trường chưa có khóa tốt nghiệp nào — cả khóa lên lớp, sân vẫn rộng chỗ.",
    quyLai: "Quỹ hiến tặng: {bal}tr (+{lai}tr lãi). Không ai vỗ tay.",
    cutHi295: "Thủ khoa 29,9 điểm vẫn trượt vì tiêu chí phụ.",
    cutHi300: "ĐIỂM CHUẨN 30,5/30 — ba điểm 10 vẫn trượt nguyện vọng 1.",
    cutHi27: "Điểm chuẩn cao kỷ lục. Phụ huynh chụp màn hình.",
    cutLo: "Báo gọi đợt tuyển sinh này là 'vét sàn'. iSteve đăng meme.",
    isteveTagline: "Học viện iSteve Toàn Cầu: 'Cam kết đầu ra: Kỳ lân hoặc hoàn 30% học phí.'"
  },

  modal: {
    termTitle: "Sơ kết học kỳ",
    keToan: "Trần học phí hiện tại: {x}tr. Điểm chuẩn hàng xóm: {y}.",
    admitFooter: "Quyết định này lên báo. Theo cả hai nghĩa.",
    admitAnchor: "Năm ngoái: {cut} — {fill}/{quota} nhập học",
    autoResolve: "Phòng Đào Tạo tự quyết vì hiệu trưởng đi vắng.",
    offTuitionCeil: "Học phí vượt trần danh tiếng: hồ sơ năm sau giảm một nửa.",
    tet: "Tết. Lì xì toàn trường +10 Mood. Quỹ lớp nhận 10tr tiền mừng. Bác Tâm về quê ba ngày, sân vẫn sạch.",
    welcomeBack: "Trường vẫn đứng yên chờ hiệu trưởng."
  },

  contract: {
    trungvang: {
      co: "Tập đoàn Trứng Vàng", type: "pr", pay: 12, sign: 30, months: 10,
      offer: "Tập đoàn Trứng Vàng đề nghị tài trợ: 30tr ký ngay + 12tr/tháng trong 10 tháng. Đổi lại: logo phủ trường, và mỗi tháng 3 ngày, ba sinh viên giỏi nhất đi tập dượt sự kiện thay vì học.",
      accept: "Hợp đồng đã ký. Ba ghế trong Xưởng sẽ trống ba ngày mỗi tháng.",
      refuse: "Bạn từ chối. Bác Tâm gật đầu, không nói gì."
    },
    morality: "Điều khoản hình ảnh kích hoạt: {co} chấm dứt hợp đồng, không bồi thường."
  },

  virtueApplicant: "Một hồ sơ điểm cao xin về trường: 'nghe đồn trường này dạy thật — {ly_do}'. Hạt giống tốt tự tìm đất.",
  vtReasons: { tuaVit: "chuyện cái tua vít", phongmay: "chuyện phòng máy mở cửa tối", pccc: "chuyện trường tự báo vụ cháy" },

  // "Bản nháp bài luận của hiệu trưởng" — the open-question epilogue (DESIGN §1). Reflect, never verdict.
  essay: {
    ones: ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"],
    openBtn: "📜 Bản nháp bài luận",
    kic: "Bản nháp · chưa nộp · Năm {year}",
    title: "Bài luận của hiệu trưởng",
    falseStart: "<s>Sau {yearWord} năm, tôi đã có câu trả lời.</s>",
    deHeader: "“{de}” — tôi chép lại nguyên văn, như Bác Tâm vẫn đọc ở cột cờ, không thêm chữ nào.",
    ledger: "Tôi mua một trường đang nợ. {yearWord} năm, sổ ghi {graduated} cái tên. Đề bài thì vẫn nằm nguyên trên bàn tôi.",
    empty: "Tôi mở sổ. Sổ còn trắng — tôi mới chép cái đề lên trang đầu, chưa có cái tên nào để xếp xuống dưới. Ba quyển sổ kia cũng mỏng: trong ngân hàng {cash}tr, quỹ hiến tặng {endow}tr. Tiền thì đã có, người thì chưa.",
    nameWithSteve: "Đề hỏi Steve Jobs ở đâu. Có lẽ là mấy đứa này — tôi chỉ dám chỉ tay, không dám kết luận:",
    nameNoSteve: "Đề hỏi Steve Jobs ở đâu. Tôi không có. Tôi chỉ có thể chỉ vào mấy đứa này:",
    castRowArrestTail: " — khoá này tốt nghiệp thời chủ cũ, nhưng tên vẫn nằm trong sổ tôi.",
    steveColEmpty: "Cột “🍎” vẫn để trống — chỗ đó tôi chừa, chưa gạch.",
    steveColFull: "Cột “🍎” có {steves} dòng. Tôi vẫn không chắc là tôi viết ra nó, hay tôi chỉ tình cờ không xoá nó đi.",
    ledgerHead: "Rồi tôi đặt ba quyển sổ cạnh nhau.",
    ledgerBank: "Sổ ngân hàng: {cash}tr.",
    ledgerEndow: "Quỹ hiến tặng: {endow}tr — tiền của lòng biết ơn,{endowTail} không tiêu được vào quảng cáo.",
    ledgerThird: "Sổ thứ ba không in được thành tiền: là cái danh sách ở trên.",
    ledgerStare: "Ba quyển nằm cạnh nhau trên bàn. Quyển nào to hơn thì… để Bộ duyệt.",
    crossOut: {
      steve: "Vậy làm thế nào để có một Steve Jobs Việt Nam. Tôi định viết “thành công rồi”, nhìn lại thấy chữ đó không phải của mình, xoá. Tôi—",
      coin: "Vậy làm thế nào để có một Steve Jobs Việt Nam. Tôi viết “trường tôi dạy làm giàu”, rồi đọc lại cái dòng 🚔, để dấu ba chấm. Tôi—",
      vanmau: "Vậy làm thế nào để có một Steve Jobs Việt Nam. Tôi chép sẵn một câu mở bài mẫu cho nhanh, đọc lại thấy buồn cười, xoá. Tôi—",
      kysu: "Vậy làm thế nào để có một Steve Jobs Việt Nam. Tôi gạch xoá ba lần. Tôi viết “có lẽ là đừng sản xuất”, rồi xoá nốt. Tôi—",
      thuc: "Vậy làm thế nào để có một Steve Jobs Việt Nam. Tôi định viết “chậm mà chắc”, nghe như khẩu hiệu, xoá. Tôi—",
      hype: "Vậy làm thế nào để có một Steve Jobs Việt Nam. Tôi viết “cả nước biết tên trường”, rồi nhìn quỹ hiến tặng, xoá. Tôi—",
      that: "Vậy làm thế nào để có một Steve Jobs Việt Nam. Tôi viết “có lẽ tôi dạy chưa tới”, để đó, chưa xoá. Tôi—",
      kind: "Vậy làm thế nào để có một Steve Jobs Việt Nam. Tôi viết “một ngôi trường tử tế”, nghe hơi tự khen, để xem mai có xoá không. Tôi—"
    },
    bacTam: {
      steve: "Bác Tâm để ấm trà xuống: “Đứa đó hồi xưa hay tháo chuông trường. Sổ này có nó là đủ dày.”",
      coin: "Bác Tâm để ấm trà xuống: “Có đứa gửi quà Tết to lắm. Tôi để nguyên hộp, chưa mở.”",
      vanmau: "Bác Tâm để ấm trà xuống: “Đồ án mẫu của cô Trình treo ở phòng truyền thống. Đẹp thật.”",
      kysu: "Bác Tâm để ấm trà xuống: “{nKySu} đứa sửa máy. Sổ này đọc cũng được.”",
      thuc: "Bác Tâm để ấm trà xuống: “Mấy đứa này về vẫn hỏi thăm. Thư chất đầy ngăn kéo.”",
      hype: "Bác Tâm để ấm trà xuống: “Sân lúc nào cũng đông phóng viên. Trà nguội nhanh.”",
      that: "Bác Tâm để ấm trà xuống: “Mấy đứa thỉnh thoảng ghé sân ngồi. Vẫn gọi tôi là bác.”",
      kind: "Bác Tâm để ấm trà xuống: “Không đứa nào lên tivi. Cũng không đứa nào vào tù. Sân vẫn sạch.”",
      empty: "Bác Tâm để ấm trà xuống: “Cột cờ mới dựng. Đề thì đọc rồi.”"
    },
    echo: "“{de}”",
    foot: "Đề vẫn ở cột cờ. Sáng mai Bác Tâm lại đọc.",
    foldBtn: "Gấp bản nháp lại"
  },

  rebirth: null // university has no restart in S1 (run cap = sandbox); reserved
};
