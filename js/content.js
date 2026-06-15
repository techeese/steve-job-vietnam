/* ============================================================================
   Học viện Steve — js/content.js
   ALL player-facing TEXT (CONTENT). No logic, no numbers, no DOM. Split from
   data.js (iter 134 STRUCTURE): balance knobs (CONFIG) vs copy (CONTENT) — two
   independent globals (neither references the other). Loaded after data.js;
   gate.js / sweep.js concat it in the same scope.
   ========================================================================== */

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

  // founding milestones — guide & celebrate the build-up arc (start-from-nothing). Completed
  // in order; each gives a small Tiếng Tăm bump. After the last, the open-ended phase begins.
  milestones: [
    { key: "room1",    goal: "Xây phòng học đầu tiên",                      done: "Cột mốc: phòng học đầu tiên đã dựng — đã có chỗ để điểm danh." },
    { key: "cohort1",  goal: "Chiêu sinh khóa đầu (mở tuyển vào tháng 7)",  done: "Cột mốc: khóa đầu tiên đã nhập học — Mai Sương đứng đầu danh sách." },
    { key: "teacher2", goal: "Tuyển thêm một giảng viên",                   done: "Cột mốc: đã có thêm người đứng lớp — thầy Thể Dục đỡ phải kiêm hết." },
    { key: "specroom", goal: "Xây một phòng chuyên môn (Lab / Xưởng / Phòng máy)", done: "Cột mốc: trường đã có phòng chuyên môn — không chỉ học chay nữa." },
    { key: "grow20",   goal: "Nuôi trường lên 20 sinh viên",               done: "Cột mốc: 20 sinh viên — sân trường bắt đầu đông." },
    { key: "firstgrad", goal: "Đưa khóa đầu tiên tốt nghiệp",              done: "Cột mốc: khóa đầu tiên ra trường. Câu hỏi lớn bắt đầu: họ sẽ thành gì?" }
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
  // E4 — the epilogue's gift-vs-fate suffix, by realization (a quiet line on a named life; never a meter):
  realGap: {
    loud: " — tài năng bỏ phí trên tay bạn",      // seed≥4 → thất nghiệp/lệch hướng: the loud waste
    under: " — đáng lẽ đã có thể hơn thế"           // seed≥4 → 💼 lương ổn: the prodigy who settled (craft's quiet grief)
  },
  // iter-150 — the followed protégé's coda, keyed by protegeCodaKey() (person.js). ONE source of truth, used at
  // BOTH the graduation BEAT (engine.js — the arc's culmination, felt the moment it happens, VISION §114) and the
  // epilogue CAPSTONE (ui.js — the keepsake 10 years on). The mid-game beat used to announce only the destiny.
  protegeCoda: {
    loud: "tài năng ấy, mình đã không giữ được",            // a prodigy who failed/turned — your grief
    under: "đáng lẽ em đã có thể hơn — mình vẫn nghĩ thế",   // a prodigy who settled — the quiet ache
    realized: "em nên người — mình có góp một tay",          // a realized life — the attention paid off
    kind: "một cuộc đời tử tế, mình mừng cho em"             // a decent life — simple gladness
  },
  // iter-152 — the Tết cohort glimpse (tetCohortBeat, engine.js): once a year, the headmaster reflects on how the
  // CURRENT cohort is becoming under the player's policy — blossoming, cooling, or mixed. The "felt transformation
  // arc" (VISION §77-79) given a YEARLY chapter rhythm, mid-game, not just at the epilogue. Prose, NO counts
  // (invariant #3 — the cohort is glimpsed, not metered); the texture is qualitative.
  tetCohort: {
    blossom: "🌸 Tết — nhìn lại một năm, phần đông các em đang hợp lối, lớn lên đúng hướng. Mừng các em thêm tuổi.",
    cool: "🌸 Tết — nhìn lại một năm, không ít em đang lệch lối, nguội dần. Năm mới, mình phải nghĩ lại cách dạy.",
    mixed: "🌸 Tết — nhìn lại một năm: đứa bừng lên, đứa chững lại. Trường nào rồi cũng thế. Năm mới lại bắt đầu."
  },
  mentorCredit: " · nhờ thầy không buông tay em",   // E4.1: a kid you MENTORED who reached a realized life — the attention, felt by name
  diamondCredit: " · ngọc thô — vào bằng cửa hẹp",  // E-UNDERDOG: an overlooked low-score admit who realized — the exam was wrong, you weren't
  prizes: { sangtao: "Giải Sáng Tạo Trẻ", taynghe: "Giải Tay Nghề Vàng", thukhoa: "Thủ Khoa khoá" }, // E7p: a standout's honor — a line in their life (owner: "more prizes/awards")
  prizeWastedFlavor: "Tấm bằng khen năm ấy vẫn sáng. Đường đời {ten} thì đã rẽ lối khác.", // iter-144: the honored student the system still failed — the sharpest đề Văn bite, made pointed
  // iter-125 — the followed protégé's IN-SCHOOL arc, as caused moments (THESIS mark 5: felt WHILE playing).
  // Surfaced ~once a season when a real transition happens — watch the kid you chose actually become someone.
  favMoments: {
    craftUp: ["lần đầu làm ra một thứ chạy được — tay nghề đang thành hình.", "hàn xong cái mạch mà không cần ai chỉ.", "bắt đầu sửa được thứ ba người trước bỏ cuộc.", "tay đã quen đồ nghề. Nhìn là biết em đang lớn."],
    stUp: ["nói một ý làm cả lớp ồ lên — bắt đầu có giọng riêng.", "vẽ kín một quyển sổ ý tưởng, có cái điên có cái hay.", "dám làm khác đề bài — và nó đẹp.", "đặt một câu hỏi mà thầy cũng phải nghĩ."],
    ktUp: ["đọc hết giáo trình trước cả lớp một học kỳ.", "giảng lại bài cho bạn rõ hơn cả thầy."],
    moodDown: ["dạo này ít nói hẳn. Có gì đó đang nặng.", "ngồi cuối lớp, mắt để đâu đâu.", "bỏ một buổi học — lần đầu tiên.", "hỏi thăm thì chỉ cười nhạt."],
    moodUp: ["cười nhiều hơn hẳn, như tìm lại được mình.", "kéo cả nhóm ở lại làm tới khuya, vui ra mặt.", "lại là đứa tới sớm nhất sân trường."],
    adrift: ["loay hoay mãi không vào nhịp — kiểu học này như chưa hợp với em.", "giỏi mà cứ lửng lơ, hình như chưa tìm đúng đường.", "ngồi giữa lớp mà như người ngoài cuộc."],
    cmUp: ["bắt đầu rao 'kèo thơm' cho khoá dưới. Lo lo là.", "khoe một cú 'x3 tài khoản' — không ai hỏi tiền đâu ra.", "lập một nhóm kín 'làm giàu', khoá dưới đã gọi bằng anh."],
    vetUp: ["thuộc làu mọi dạng bài — mà bài nào cũng giống bài nào.", "điểm đều răm rắp, nhưng hỏi 'vì sao' thì lặng.", "chép mẫu nhanh hơn cả nghĩ. Thầy khen, em cười gượng."],
    mentored: ["bắt đầu có thầy kèm riêng — như được tiếp sức.", "có người để mắt tới. Khác hẳn."]
  },
  // iter-131 — MOOD made live: a kid worn down by the wrong learning style burns out and leaves. The most human
  // waste (the one you LOST), now named in the feed instead of silently vanishing.
  dropoutLines: [
    "{ten} bỏ học giữa chừng — lối học này bào mòn em mỗi ngày.",
    "{ten} nghỉ học, không một lời tạm biệt. Bàn trống từ sáng thứ Hai.",
    "{ten} xin 'bảo lưu một thời gian' — ai cũng hiểu là sẽ không quay lại.",
    "{ten} kiệt sức, rời trường. Trường đã không đỡ được em."
  ],
  bacTamTiemNang: "Bác Tâm: “Đứa này… để xem.”",
  entryLine: "Trạng thái đầu đời: {chip}",

  alumLines: {
    THAT_NGHIEP: ["{ten} vẫn đang 'cân nhắc các lựa chọn'.", "{ten} từ chối một offer vì 'không đúng đam mê'.",
      "{ten} vừa hoàn thành khoá học online thứ bảy. Chưa khoá nào ra việc.", "Hồ sơ của {ten} 'đang được xem xét' ở nơi thứ mười hai."],
    LUONG_ON: ["{ten} được tăng lương 8%. Đăng ảnh cà phê.", "{ten} đi làm đúng giờ năm thứ ba liên tiếp.",
      "{ten} mua trả góp một chiếc xe vừa đủ. Ai cũng bảo chín chắn.", "{ten} được giao thêm việc, không thêm lương. Vẫn cảm ơn sếp."],
    KY_SU: ["{ten} được cấp bằng sáng chế phụ. Không đăng gì.", "{ten} sửa xong cái máy mà ba người trước bó tay.",
      "{ten} viết tài liệu kỹ thuật không ai đọc — nhưng cái máy thì chạy.", "Đồng nghiệp gọi {ten} mỗi khi 'không hiểu sao nó lại chạy'."],
    FOUNDER: ["Startup của {ten} gọi vốn vòng hạt giống. Hạt rất nhỏ.", "{ten} đổi tagline công ty lần thứ tư trong năm.",
      "{ten} pitch lần thứ chín. Slide đẹp hơn, sản phẩm vẫn thế.", "{ten} lên một podcast khởi nghiệp. Người nghe: ba."],
    CA_MAP_COIN: ["{ten} mở khoá học 'tư duy triệu đô', học phí bốn số.", "Sàn của {ten} 'bảo trì hệ thống' lần thứ ba tháng này.",
      "{ten} ra mắt đồng coin mới, ảnh đại diện là chính mình đeo kính.", "Nhóm kín của {ten} đổi tên lần thứ tư cho 'tránh tai tiếng'."],
    QUAN_VAN_MAU: ["{ten} đạt chiến sĩ thi đua. Lần thứ năm.", "{ten} được khen vì biên bản họp đẹp nhất phòng.",
      "{ten} nộp báo cáo đúng mẫu, đúng hạn, đúng người ký. Không ai nhớ nội dung.", "{ten} được cử đi tập huấn 'đổi mới', về làm y như cũ."],
    BI_BAT: ["Phiên toà của {ten} hoãn lần hai.", "{ten} viết thư từ trại: chữ đẹp hơn hồi đi học.",
      "{ten} kháng cáo. Đơn viết tay, lập luận chặt như hồi làm văn.", "Báo gỡ bài cũ về {ten}, để lại đúng cái tiêu đề."],
    STEVE: ["Bài keynote của {ten} được chiếu lại trong giờ Văn.", "{ten} từ chối lên bìa tạp chí. Tạp chí tự in.",
      "{ten} mở mã nguồn thứ từng làm nên tên tuổi. Cả ngành lặng đi một nhịp.", "Một đứa trẻ ở tỉnh xa bảo: 'lớn lên con làm như {ten}'."]
  },
  garageLine: "Công ty của {ten} sa thải 90% nhân sự. {ten} đang ngủ trong ga-ra.",
  keynoteLine: "MỘT THỨ NỮA… — {ten} bước ra sân khấu. Cả nước nhận ra câu trả lời của đề Văn năm ấy.",
  arrestTPL: "Cựu sinh viên Trần Phi Lợi bị bắt — sàn coin XÔIĐỖ sập.",
  arrestNote: "khóa này tốt nghiệp thời chủ cũ",
  giftHead: "Cảm ơn thầy đã không bắt em học thuộc.",
  giftVt: {
    tuaVit: "…vẫn nhớ chuyện cái tua vít.", phongmay: "…vẫn nhớ buổi tối được mượn phòng máy.",
    pccc: "…vẫn nhớ lần trường tự báo cáo vụ cháy.", aiTay: "…vẫn nhớ thầy cầm tay chỉ từng đường nghề.",
    damMe: "…vẫn nhớ lần thầy bảo cứ theo đam mê.", hocBong: "…vẫn nhớ suất học bổng giữ em ở lại trường.",
    lamLai: "…vẫn nhớ lần bị bắt làm lại từ đầu — hoá ra là may.", nghiNgoi: "…vẫn nhớ tuần được cho nghỉ lấy lại sức."
  },
  // short lines for a cựu SV who strolls back onto campus (the watchable layer; kept tiny to fit a bubble).
  // One is picked at spawn → repeat visits of the same fate now vary.
  visitLines: {
    STEVE: ["Em về kể chuyện cho khoá dưới.", "Em mang quà cho thư viện ạ.", "Trường vẫn thơm mùi cũ ghê."],
    KY_SU: ["Em về thăm thầy ạ!", "Cái máy thầy dạy, em vẫn xài.", "Để em sửa giúp trường cái quạt."],
    FOUNDER: ["Vòng gọi vốn sắp chốt thầy ơi!", "Trường cho em tuyển khoá dưới nhé?", "Lần này 'to thật' thầy ạ."],
    CA_MAP_COIN: ["Trường mình 'hợp tác' không thầy?", "Em tài trợ giải, treo băng-rôn thôi.", "Suất khoá học của em, tặng thầy."],
    QUAN_VAN_MAU: ["Em được cử về báo cáo điển hình.", "Em xin ít số liệu làm thành tích ạ.", "Trường mình lên báo nhờ em đấy."],
    LUONG_ON: ["Em về thăm trường ạ.", "Em vẫn đi làm đều thầy ạ.", "Ghé tí rồi em lại đi làm."],
    THAT_NGHIEP: ["Em… ghé qua xem trường tí ạ.", "Em đang 'gap year' thầy ạ.", "Trường tuyển trợ giảng không thầy?"]
  },
  // tap a HUD meter → a short, thematic explainer. The three meters ARE the three theses of the đề Văn —
  // fame, credibility, substance — and these lines teach the strategy while keeping the question open.
  meterHelp: {
    tt: { name: "Tiếng Tăm", what: "Trường nổi đến đâu — quyết định bao nhiêu hồ sơ tìm về cổng mỗi mùa tuyển sinh.",
      up: "Hợp đồng PR, khoa Sống Ảo, sự kiện đánh bóng, các 'phốt' đẹp.", down: "Bê bối, cựu SV bị bắt, và tự rơi dần về mức nền theo thời gian.",
      soul: "Tiếng tăm kéo người tới cổng — nhưng không mua được lòng tin." },
    ut: { name: "Uy Tín", what: "Mức độ trường được tin cậy — xây chậm bằng sự tử tế, nâng cả mức nền của Tiếng Tăm.",
      up: "Những lần từ chối tử tế, vườn tưởng niệm danh nhân, việc đàng hoàng (Bác Tâm gật đầu).", down: "Bán mình cho hợp đồng có điều khoản, gian lận, mua giải.",
      soul: "Uy tín xây bằng những lần nói không — chậm, nhưng bền." },
    tc: { name: "Thực Chất", what: "Năng lực thật trường gây dựng trong sinh viên — thứ thực sự đẩy các em về phía kỹ sư và quả táo 🍎.",
      up: "Dạy đồ án, làm thật trong Xưởng, kèm cặp, để các em tự vẽ lấy.", down: "Luyện đề/văn mẫu, đạo văn, để AI làm hộ — qua môn nhưng rỗng.",
      soul: "Thực chất là thứ duy nhất biến hạt giống thành quả táo." }
  },

  teachers: {
    inherited: [
      { id: "td", ten: "Thầy Thể Dục Kiêm Mọi Thứ", day: 2, dien: 2, luong: 18, trait: "", note: "tự động dạy thay lớp trống" },
      { id: "gtm", ten: "Cô Giáo Trình Mẫu", day: 2, dien: 9, luong: 22, trait: "", note: "biên chế cũ: không tăng lương, không nghỉ việc", bienChe: true },
      { id: "isi", ten: "GS Đếm Bài Báo ISI", day: 3, dien: 5, luong: 28, trait: "isi", note: "biên chế — +0,5 Tiếng Tăm/tháng; lớp ông dạy -10%", bienChe: true }
    ],
    // E8 (iter 136) — teachers are DRAWN by the school's standing (owner: "automatic based on ranking"): TT draws
    // the famous, UT the trusted, TC the substantive. `req:{m,v}` = a meter (tt/ut/tc) must reach v before they'll
    // consider you (shown as visible aspiration, NOT hidden). The self-taught coder has no req → a weak-start
    // school is never doomed. Soft gate (availability only); manual hire still legal; sweep-neutral (no UI hiring).
    pool: [
      { id: "coder", ten: "Thầy Coder Tự Học", day: 9, dien: 1, luong: 15, trait: "tch", note: "không bằng cấp, rẻ vì thị trường định giá tờ giấy" },
      { id: "diengia", ten: "Thầy Diễn Giả Truyền Cảm Hứng", day: 1, dien: 10, luong: 25, trait: "hype", req: { m: "tt", v: 40 }, note: "+5 Mood khi vào, -3 sau hai tháng — chỉ ghé trường có tiếng" },
      { id: "viral", ten: "Cô Giáo Viral Triệu View", day: 2, dien: 9, luong: 30, trait: "hype", req: { m: "tt", v: 60 }, note: "trường nổi mới mời nổi — vào lớp như lên sóng" },
      { id: "ielts", ten: "Cô IELTS Pitch Deck", day: 5, dien: 8, luong: 35, trait: "", req: { m: "ut", v: 45 }, note: "dạy thật lẫn diễn thật — chọn trường đàng hoàng" },
      { id: "gshuu", ten: "GS Đầu Ngành Về Hưu", day: 8, dien: 6, luong: 40, trait: "tch", req: { m: "ut", v: 65 }, note: "danh ông gắn với tên trường — chỉ về nơi có uy tín" },
      { id: "kysu", ten: "Thầy Cựu Kỹ Sư Phương Đông", day: 9, dien: 3, luong: 38, trait: "tch", req: { m: "tc", v: 55 }, note: "đắt. đáng. chỉ ở lại trường có thực chất." }
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
    { id: "aiHo", title: "🤖 AI làm hộ đồ án",
      desc: "Đồ án của {ten} bỗng xịn bất thường — hỏi ra mới biết AI 'làm' qua đêm. Em ấy bảo: 'em chỉ prompt thôi, mà nó chạy thật mà thầy'.",
      pred: "nam4Duan",
      choices: [
        { label: "Cứ nộp — nhìn xịn là được", hint: "+8 Vẹt, +0,5 điểm, +2 Tiếng Tăm, +1 mầm phốt", fx: "aiNop" },
        { label: "Cho dùng, nhưng phải hiểu & bảo vệ được", hint: "+3 Tay nghề, +2 Sáng tạo, +1 Thực Chất", fx: "aiHieu" },
        { label: "Cấm tiệt — làm tay, hiểu từng dòng", hint: "+5 Tay nghề, +3 Sáng tạo, −6 mood, một việc tử tế", fx: "aiTay" }
      ] },
    { id: "chodoan", title: "🛒 Chợ đồ án mẫu",
      desc: "Trước bảo vệ, một 'dịch vụ' chào bán đồ án mẫu kèm slide đẹp: 15tr trọn gói, bảo hành qua hội đồng.",
      pred: "thang5",
      choices: [
        { label: "Mua cho khoá yếu", hint: "-15tr, +0,5 điểm, +10 Vẹt, +1 mầm phốt nặng", fx: "chodoanMua" },
        { label: "Không mua", hint: "bảo vệ bằng thực lực", fx: null }
      ] },
    { id: "lopthem", title: "📚 Mở lớp học thêm buổi tối",
      desc: "Cô Giáo Trình Mẫu đề nghị mở lớp học thêm buổi tối: 'phụ huynh nào cũng muốn, trường lại có thêm khoản thu'. Mấy đứa thì đã đỏ mắt.",
      pred: "anyLuyende",
      choices: [
        { label: "Mở — ai cũng học thêm", hint: "+12tr, +KT/Vẹt cả trường, -8 mood, +1 Tiếng Tăm", fx: "themMo" },
        { label: "Mở, nhưng miễn phí cho SV nghèo", hint: "+4tr, +KT nhẹ, một việc tử tế (+Uy Tín)", fx: "themMienPhi" },
        { label: "Không — các em cần được nghỉ", hint: "+8 mood cả trường, +1 Thực Chất", fx: "themKhong" }
      ] },
    { id: "thanhtich", title: "🏆 Suất vào bảng xếp hạng trường",
      desc: "Một bảng xếp hạng 'uy tín' mời trường mình vào: 'chỉ cần làm đẹp vài con số tỉ lệ ra trường — có hạng là có thí sinh, có thí sinh là có tất cả'.",
      pred: "firstgrad",
      choices: [
        { label: "Làm đẹp số liệu — lên hạng", hint: "+5 Tiếng Tăm, +Vẹt cả trường, +1 mầm phốt", fx: "ttLam" },
        { label: "Báo đúng số thật — hạng nào cũng được", hint: "+2 Uy Tín, +1 Thực Chất", fx: "ttThat" }
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
      ] },
    // ---- founding-era deck (the from-nothing years, năm ≤ 3): identity choices for a young school ----
    { id: "phuhuynh1", title: "👀 Phụ huynh đến xem 'cơ ngơi'",
      desc: "Một phụ huynh đến tận nơi xem trường mới: sân còn trống, lớp đếm trên đầu ngón tay. 'Trường mình… quy mô thế nào hả thầy?'",
      pred: "founding",
      choices: [
        { label: "Khoe 'sắp đạt chuẩn quốc tế'", hint: "+5 Tiếng Tăm, +1 mầm phốt (nói quá)", fx: "khoeMe" },
        { label: "Thành thật: trường mới, đang xây", hint: "+2 Uy Tín, Bác Tâm gật đầu", fx: "thatTha" }
      ] },
    { id: "daytu", title: "📖 Giảng viên gợi ý 'dạy tủ'",
      desc: "Thầy giáo độc nhất, ôm hết các lớp, mệt mỏi đề xuất: 'hay là mình dạy tủ cho nhanh qua môn? Các em đỡ khổ, mình đỡ đuối'.",
      pred: "founding",
      choices: [
        { label: "Đồng ý dạy tủ", hint: "cả trường +2 KT +3 Vẹt −2 ST, +1 mầm phốt", fx: "dayTu" },
        { label: "Dạy thật, dù chậm", hint: "cả trường +2 TN +4 Mood, +1 Uy Tín", fx: "dayThat" }
      ] },
    { id: "datten", title: "💸 Nhà đầu tư đòi đặt tên trường",
      desc: "Một nhà đầu tư 'thiên thần' chuyển khoản trước 30tr, kèm điều kiện: đổi tên trường thành 'Học viện <Tên Tập Đoàn Của Họ>'. Logo đã thiết kế sẵn.",
      pred: "founding",
      choices: [
        { label: "Nhận tiền, đổi tên", hint: "+30tr +2 Tiếng Tăm, −2 Uy Tín (bán danh)", fx: "datTenCo" },
        { label: "Giữ tên trường", hint: "+2 Uy Tín, Bác Tâm gật đầu", fx: "datTenGiu" }
      ] },
    // ---- recurring moral deck (variety across a full run) ----
    { id: "tutHang", title: "📉 Trường tụt hạng trên BXH",
      desc: "Một trang xếp hạng vừa đẩy trường bạn xuống nhóm cuối. Một 'chuyên gia truyền thông' chào gói kéo hạng: bài PR, vài KOL review, 15tr là 'lên top ngành'.",
      pred: "common",
      choices: [
        { label: "Mua gói kéo hạng", hint: "−15tr, +6 Tiếng Tăm, +1 mầm phốt", fx: "muaHang" },
        { label: "Để điểm chuẩn nói thay", hint: "+1 Uy Tín, Bác Tâm gật đầu", fx: "khongMuaHang" }
      ] },
    { id: "kietSuc", title: "😵 {ten} kiệt sức vì áp lực",
      desc: "{ten} ngủ gục trên bàn ba buổi liền — em ấy bảo 'chỉ cần qua kỳ này thôi thầy'. Cô y tế trường đề nghị cho em nghỉ ít hôm.",
      pred: "common",
      choices: [
        { label: "Bảo em cố nốt", hint: "em ấy +5 Vẹt +2 KT −10 Mood", fx: "epHoc" },
        { label: "Cho em nghỉ một tuần", hint: "em ấy +15 Mood, một việc tử tế", fx: "choNghi" }
      ] },
    { id: "daoVan", title: "📑 Đồ án giống hệt một dự án trên mạng",
      desc: "Đồ án của {ten} giống đến từng dòng một dự án mã nguồn mở. Em ấy bảo 'em có đổi tên biến mà thầy'. Hội đồng đang chờ ý kiến.",
      pred: "hasNam4",
      choices: [
        { label: "Lờ đi cho qua", hint: "em ấy +5 Vẹt, +1 mầm phốt nặng", fx: "loDaoVan" },
        { label: "Bắt làm lại từ đầu", hint: "em ấy +5 TN +3 ST −5 Mood, +1 Uy Tín", fx: "batLamLai" }
      ] },
    { id: "duhoc", title: "✈️ {ten} được học bổng du học",
      desc: "{ten} — đứa giỏi nhất khoá — vừa giành học bổng toàn phần đi nước ngoài. Em ngập ngừng: 'Em… chắc không về thầy ạ.' (đề Văn vẫn để ngỏ: Steve Việt Nam ở lại, hay bay đi?)",
      pred: "hasNam4",
      choices: [
        { label: "Chúc em đi, và đi cho tới", hint: "em rời trường — nhưng tử tế, +1 Thực Chất", fx: "duhocChuc" },
        { label: "Thuyết phục em ở lại cống hiến", hint: "giữ được em, nhưng em −Mood +Vẹt; +1 Tiếng Tăm", fx: "duhocGiu" }
      ] },
    { id: "antoan", title: "👔 Bố mẹ {ten} muốn em chọn 'đường an toàn'",
      desc: "Bố mẹ {ten} gọi điện: 'cho cháu thi công chức cho ổn định, chứ chế với chả tạo bấp bênh lắm thầy ạ'.",
      pred: "hasNam4",
      choices: [
        { label: "Khuyên em theo hướng an toàn", hint: "em +Vẹt −Sáng tạo; phụ huynh yên tâm", fx: "antoanNghe" },
        { label: "Ủng hộ em theo đam mê", hint: "em +Sáng tạo, một việc tử tế", fx: "antoanDam" }
      ] }
  ],

  ticker: {
    idle: [
      "Khuôn viên đạt chuẩn quốc tế (1/100 quy mô).",
      "Bác Tâm quét sân. Sân sạch. Không có gì để đưa tin.",
      "Phòng Đào Tạo thông báo: mã ngành vẫn đang chờ duyệt.",
      "Wifi trường: 'kết nối được, theo nghĩa triết học'.",
      "Một sinh viên hỏi thư viện ở đâu. Câu hỏi được ghi nhận.",
      "Hội thảo 'Đổi mới sáng tạo' hoãn vì trùng lịch hội thảo 'Tư duy đột phá'.",
      "Máy photo tầng 2 đã biết tự kẹt giấy mà không cần ai bấm.",
      "Căng tin đổi tên món 'cơm' thành 'trải nghiệm ẩm thực bản địa'. Giá giữ nguyên… một thời gian.",
      "Khoa Sống Ảo đạt 10k follow. Chưa ai nhớ trường dạy ngành gì.",
      "Một phụ huynh gọi hỏi điểm. Tổng đài chuyển máy đúng bốn vòng rồi về chỗ cũ.",
      "Tấm băng-rôn 'Quyết tâm' đã treo sang năm thứ ba. Quyết tâm gì thì không ai chắc.",
      "Sinh viên năm tư bắt đầu nói 'thật ra em cũng không biết em muốn gì'. Đúng tiến độ.",
      "Bảng tin trường: một thông báo cũ, một thông báo cũ hơn, và một con gián.",
      "Đồng hồ ở hội trường lại chạy nhanh 7 phút — đúng bằng thời lượng phần 'phát biểu ngắn gọn'.",
      "Bác Tâm đọc lại đề Văn 2026 ở cột cờ. Không ai bình luận.",
      "Học viện iSteve Toàn Cầu quảng cáo: 'Cam kết đầu ra: Kỳ lân hoặc hoàn 30% học phí.'"
    ],
    thptJune: "2,1 triệu thí sinh vừa được hỏi câu hỏi của trường bạn.",
    poolForeshadow: "{n} hồ sơ đang hướng về cổng trường.",
    foundingJune: "Hết một năm học. Trường chưa có khóa tốt nghiệp nào — cả khóa lên lớp, sân vẫn rộng chỗ.",
    quyLai: "Quỹ hiến tặng: {bal}tr (+{lai}tr lãi). Không ai vỗ tay.",
    khoaCup: "🏆 Cúp Khoa năm {year}: {khoa} vô địch — chiếc cúp thứ {n}. Cả khoa hò reo, khoa bạn lặng lẽ về xưởng.",
    cutHi295: "Thủ khoa 29,9 điểm vẫn trượt vì tiêu chí phụ.",
    cutHi300: "ĐIỂM CHUẨN 30,5/30 — ba điểm 10 vẫn trượt nguyện vọng 1.",
    cutHi27: "Điểm chuẩn cao kỷ lục. Phụ huynh chụp màn hình.",
    cutLo: "Báo gọi đợt tuyển sinh này là 'vét sàn'. iSteve đăng meme.",
    // E9 (iter 153) — the school's character, made FELT at intake: who your reputation draws. Fires only once the
    // character has formed (year ≥ 3) and is clearly one way or the other (Thực Chất high/low).
    cohesionMakers: "Tiếng lành đồn xa: trường thực chất — năm nay có {ten}, một em mê làm thật, tự chọn trường bạn vì tiếng trường.", // E9: a NAMED maker your reputation drew (a face on the cohesion, attachment at intake — VISION #5)
    cohesionMakersPlain: "Tiếng lành đồn xa: trường thực chất, năm nay nhiều em mê làm thật tự tìm đến.", // fallback if no maker in the intake
    cohesionClout: "Trường ồn ào hơn là thực — năm nay phần đông hồ sơ là các em thích sân khấu hơn bảng đen."
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
    empty: "Tôi mở sổ. Sổ còn trắng — tôi mới chép cái đề lên trang đầu, chưa có cái tên nào để xếp xuống dưới. Ba quyển sổ kia cũng mỏng: trong ngân hàng {cash}, quỹ hiến tặng {endow}. Tiền thì đã có, người thì chưa.",
    nameWithSteve: "Đề hỏi Steve Jobs ở đâu. Có lẽ là mấy đứa này — tôi chỉ dám chỉ tay, không dám kết luận:",
    nameNoSteve: "Đề hỏi Steve Jobs ở đâu. Tôi không có. Tôi chỉ có thể chỉ vào mấy đứa này:",
    castRowArrestTail: " — khoá này tốt nghiệp thời chủ cũ, nhưng tên vẫn nằm trong sổ tôi.",
    // iter-148 — an empty 🍎 column has two OPPOSITE causes; naming which makes the đề Văn's peak-vs-median
    // trade-off felt at the payoff, and keeps the question open (§D-3). Picked in essayDraft from the cohort shape.
    steveColEmpty: {
      even: "Cột “🍎” vẫn để trống. Mà lạ — sổ tôi gần như không có dòng nào hỏng. Cả khoá nên người, đều tay, vững vàng. Có lẽ chính vì tôi không để đứa nào chông chênh, nên cũng chẳng đứa nào bứt lên. Tôi dạy an toàn quá chăng?",
      grind: "Cột “🍎” vẫn để trống. Tôi đẩy các em qua hết đề này đến đề khác — qua môn thì nhiều, nhưng đứa nào có chút khác người cũng nguội mất. Có lẽ tôi mài, mà quên rằng có thứ càng mài càng mòn.",
      mixed: "Cột “🍎” vẫn để trống — chỗ đó tôi chừa, chưa gạch."
    },
    steveColFull: "Cột “🍎” có {steves} dòng. Tôi vẫn không chắc là tôi viết ra nó, hay tôi chỉ tình cờ không xoá nó đi.",
    ledgerHead: "Rồi tôi đặt ba quyển sổ cạnh nhau.",
    ledgerBank: "Sổ ngân hàng: {cash}.",
    ledgerEndow: "Quỹ hiến tặng: {endow} — tiền của lòng biết ơn,{endowTail} không tiêu được vào quảng cáo.",
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
