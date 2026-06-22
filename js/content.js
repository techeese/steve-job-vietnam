/* ============================================================================
   Học viện Steve — js/content.js
   ALL player-facing TEXT (CONTENT). No logic, no numbers, no DOM. Split from
   data.js (iter 134 STRUCTURE): balance knobs (CONFIG) vs copy (CONTENT) — two
   independent globals (neither references the other). Loaded after data.js;
   gate.js / sweep.js concat it in the same scope.
   ========================================================================== */

var CONTENT = {
  schoolName: "Học viện Steve",
  // iter-186 (owner: "the name-change event should change the name for REAL"): the angel investor's corporate names
  // the school gets rebranded to when you take their money (event 'datten' → fx datTenCo). Satirical VN-startup flavor.
  corpNames: ["Học viện FinX Capital", "Học viện EduChain 4.0", "Học viện Bất Động Sản Phát Lộc", "Học viện Coin Toàn Cầu", "Học viện Sàn Việt Mall", "Học viện AI Thần Tốc", "Học viện Tài Chính Số ABC", "Học viện Khởi Nghiệp Unicorn"],
  schoolSub: "(trường vừa mở — tên đầy đủ còn đang hoàn thiện)",
  // iter-164 — the LIVE school tier shown under the name (grows with cash; a constant progression readout for
  // the owner's "watch it become an empire" vision). schoolTier() picks the highest reached + appends 🍎×N.
  schoolTiers: [
    { min: 0, label: "(trường vừa mở — tên đầy đủ còn đang hoàn thiện)" }, // fresh — placeholder while the school finds its feet
    { min: 1000, label: "Học hiệu đang lên" },        // 1 tỷ — rising
    { min: 10000, label: "Học hiệu có tiếng" },       // 10 tỷ — a name
    { min: 50000, label: "Thế lực giáo dục" },        // 50 tỷ — a force
    { min: 250000, label: "Đế chế giáo dục" }         // 250 tỷ — an empire
  ],
  khoa: "Khoa Công Nghệ & Sáng Tạo (ngành mới mở, hồ sơ đang hoàn thiện)",
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
    loud: " — tài năng bỏ phí trên tay bạn",      // seed≥4 → thất nghiệp / quán quân văn mẫu: the loud WASTE (gift left idle / ground to rote)
    bent: " — tài năng bị bẻ cong trong tay bạn",  // iter-197 → cá mập coin / bị bắt: the DISTORT pole — the gift grew the WRONG way, the school turned them (distinct from waste; invariant #4)
    under: " — đáng lẽ đã có thể hơn thế"           // seed≥4 → 💼 lương ổn: the prodigy who settled (craft's quiet grief)
  },
  // iter-203 — the EPILOGUE grief now names WHICH gift was wasted (the tell), not just the fate — the epilogue
  // counterpart of iter-193's in-play cohort lines (the owner's mandate: "name THIS kid's specific gift, not a
  // generic talent"). realCreditSuffix picks realGapTell[class][tell], falling back to the generic realGap[class]
  // (tell="" / unmapped). Reading-only → balance-neutral (§D-1 it's clear what became of WHOM; §C-4 waste done TO a specific gift).
  realGapTell: {
    loud: { // gift left idle / ground to rote
      spark: " — tư duy lập trình sắc thế, mà bỏ phí trên tay bạn",
      sky:   " — đôi bàn tay khéo, đầy ý lạ, mà chẳng nơi nào cho em làm",
      hype:  " — máu khởi nghiệp ấy, rốt cuộc nguội trên tay bạn",
      gen:   " — sáng dạ, việc gì cũng kham được, mà chẳng ai chỉ cho một hướng; rốt cuộc ra trường vẫn trắng tay nghề" // iter-246: the everyman ("") — no betrayed gift, the grief is the DIRECTION the school never gave the able-but-undirected majority
    },
    under: { // settled into a steady-but-lesser life
      spark: " — đáng lẽ thành một kỹ sư thực thụ, giờ chỉ một chân yên ổn",
      sky:   " — đôi tay ấy đáng lẽ làm ra thứ của riêng mình",
      hype:  " — đáng lẽ dựng được gì đó của riêng em, giờ làm công ăn lương",
      gen:   " — giỏi đều mọi thứ, thiếu một thứ để gọi là của riêng; thành người làm được việc, không thành một cái tên"
    },
    bent: { // the gift turned the wrong way
      spark: " — đầu óc lập trình sắc thế, bị bẻ thành trò lùa gà",
      sky:   " — bàn tay khéo ấy, giờ chỉ khéo vẽ chiêu",
      hype:  " — khiếu thuyết phục ấy, bị bẻ cong thành thói ăn xổi",
      gen:   " — nhanh nhẹn, dễ bảo, nên cũng dễ bị người ta dùng vào trò khôn lỏi"
    }
  },
  // iter-205 (ERAS L1 ckpt2 — LEGIBILITY) — name the DECADE's hand on a life, appended to the gift-vs-fate reading.
  // `wrong` clauses are appended to an EXISTING grief when the gift was wasted in a HOSTILE era (fav ≤ ERA_WRONG at
  // graduation) — "right kid, wrong time" made readable; `right` is the symmetric cheer when a gift met its GOLDEN
  // decade and flourished (fav ≥ ERA_RIGHT). Reading-only → balance-neutral (the era already shaped the destiny in
  // the FSM; this just NAMES why). The clause names the decade that WOULD have suited the gift (the ache of timing).
  realGapEra: {
    wrong: {
      spark: " · phải chi em sinh vào thời máy tính lên ngôi",
      sky:   " · phải chi sinh vào thời người ta còn quý đôi tay làm ra của cải",
      hype:  " · phải chi gặp thời mạng xã hội, thời ai cũng nghe người nói giỏi",
      _:     " · sinh nhầm thời, chưa kịp gặp thời của mình"
    },
    right: " · gặp đúng thời của mình — tài năng nở đúng lúc"
  },
  // iter-206 (L2 DEMOGRAPHIC ckpt1) — name the kid's CIRCUMSTANCE at the payoff (the demographic axis). Fires for the
  // poor only (the soul of the disadvantage): a poor kid WASTED reads the structural cause ("nhà nghèo, chẳng ai chống
  // lưng" — no one to back them; blame the structure, never the kid — invariant #4); a poor kid who REALIZED reads the
  // hope ("nhà nghèo mà vẫn nên người" — made it despite, your hand mattered). Layered onto the gift+era reading.
  realGapOrigin: {
    ngheo: {
      waste: " · nhà nghèo, chẳng ai chống lưng",
      real:  " · nhà nghèo mà vẫn nên người"
    }
  },
  // iter-194 — the SYMMETRY of diamondCredit (E-UNDERDOG ckpt2 / invariant #2): a "ngọc thô" you admitted PAST the
  // exam score (đặc cách / the narrow door) and then FAILED to realize. The win was named ("vào bằng cửa hẹp"); the
  // gamble you LOST must be named too, or the đặc cách door looks like free upside. Done TO them (invariant #4): you
  // saw the gift the exam missed — then let it slip under the school you ran. Replaces the generic realGap line for diamonds.
  diamondWaste: {
    loud: " — ngọc thô lọt cửa hẹp, rồi cũng bỏ phí trên tay bạn",
    under: " — cửa hẹp đã mở đúng người, mà rồi vẫn để tuột"
  },
  // iter-150 — the followed protégé's coda, keyed by protegeCodaKey() (person.js). ONE source of truth, used at
  // BOTH the graduation BEAT (engine.js — the arc's culmination, felt the moment it happens, VISION §114) and the
  // epilogue CAPSTONE (ui.js — the keepsake 10 years on). The mid-game beat used to announce only the destiny.
  protegeCoda: {
    loud: "tài năng ấy, mình đã không giữ được",            // a prodigy left idle / ground down — your grief
    bent: "tài năng ấy, mình đã uốn cong mất rồi",          // iter-197: a prodigy DISTORTED — turned into a shark/fraud under your school (done TO them)
    under: "đáng lẽ em đã có thể hơn — mình vẫn nghĩ thế",   // a prodigy who settled — the quiet ache
    realized: "em nên người — mình có góp một tay",          // a realized life — the attention paid off
    kind: "một cuộc đời tử tế, mình mừng cho em"             // a decent life — simple gladness
  },
  // iter-152 — the Tết cohort glimpse (tetCohortBeat, engine.js): once a year, the headmaster reflects on how the
  // CURRENT cohort is becoming under the player's policy — blossoming, cooling, or mixed. The "felt transformation
  // arc" (VISION §77-79) given a YEARLY chapter rhythm, mid-game, not just at the epilogue. Prose, NO counts
  // (invariant #3 — the cohort is glimpsed, not metered); the texture is qualitative.
  // iter-161 (economy ckpt3) — the bank-milestone fanfare (one-time each), escalating in grandeur as the
  // university grows into an institution. Index-matched to CONFIG.CASH_MILES. 🏛️ → gold in the ticker.
  cashMiles: [
    "🏛️ Ngân hàng cán mốc 1 tỷ — trường không còn là trường làng nữa.",
    "🏛️ 5 tỷ trong két — bắt đầu có tiếng, có miếng.",
    "🏛️ 10 tỷ — một học hiệu thực thụ. Báo bắt đầu gọi là 'hiện tượng'.",
    "🏛️ 25 tỷ — các trường khác cử người sang 'tham quan học hỏi'.",
    "🏛️ 50 tỷ — một đế chế giáo dục đang thành hình.",
    "🏛️ 100 tỷ — một thế lực. Ai trong ngành cũng phải biết tên trường.",
    "🏛️ 250 tỷ — huyền thoại. Người ta viết case study về bạn.",
    "🏛️ 500 tỷ — không còn gì để chứng minh nữa. Chỉ còn câu hỏi: để làm gì?"
  ],
  // iter-211 (NARRATIVE N2) — THE ANNUAL LETTER: once a year (Tết) the headmaster writes a short letter to his students,
  // conditioned on the player's POLICY this year (cram/craft/balance) × the cohort's becoming (blossom/cool/mixed) × the
  // ERA — so it MIRRORS the player's choices back (THESIS §B-3). A recurring narrative rhythm that accumulates toward the
  // capstone "how to have a Steve Jobs Vietnam" essay (N3 will wire the persistent log + capstone assembly). Deterministic
  // (cohort-state + presets + year, no rnd) → replay-safe. Opener names the decade; body keyed by [state][culture].
  annualLetter: {
    open: "📜 Thư gửi các em — {era}, cuối Năm {year}: ",
    // iter-231 (N3 ckpt): each cell is a 3-variant arc [early · mid · late] — the SAME worry, the headmaster's voice
    // aging across the run (tentative → plain → weary). Picked by run-phase in tetCohortBeat so the letters EVOLVE
    // year over year instead of repeating one line 12×; the worry-KEY (state×culture) stays constant, so the capstone
    // still reads a stable run as "the same nỗi, never dared change course" (the rut) — only now the words wore wearier.
    body: {
      blossom: {
        craft: [
          "trường mới mở, thầy còn chưa chắc mình dạy đúng. Nhưng nhìn mấy em hí hoáy làm ra cái của riêng mình — vụng mà thật — thầy thấy nhen lên chút gì đó.",
          "thầy nhìn quanh sân, thấy nhiều em đang làm ra thứ của riêng mình — vụng về, nhưng là của các em. Thầy nghĩ, có lẽ đó mới là điều đề Văn hỏi.",
          "bao năm rồi thầy vẫn giữ cái lối này: cứ để các em làm ra thứ của mình. Thầy không chắc nó ra được một Steve Jobs — nhưng đêm về, thầy yên lòng."
        ],
        cram: [
          "khoá đầu đỗ đẹp, thầy mừng. Mà đêm về đã gợn: đều tay quá, có khi nào thầy đang ép tất cả các em vào chung một khuôn?",
          "các em qua kỳ thi đều tăm tắp, thầy nở mày nở mặt với trên. Nhưng đêm về thầy tự hỏi — đều tay như nhau, thì lấy đâu ra một đứa khác người?",
          "năm nào bảng điểm cũng đẹp, năm nào thầy cũng tự hỏi đúng câu ấy — mà vẫn chưa dám buông cái khuôn. Đều thì đều thật; khác người thì vẫn chưa thấy."
        ],
        balance: [
          "khoá này phần đông ngoan, vững. Thầy chưa dám mong gì lớn — chỉ mong các em được là chính mình đã.",
          "phần đông các em đang lớn lên vững vàng, đúng hướng. Thầy chưa biết trong các em có một Steve Jobs không, nhưng thầy mừng vì các em đang là chính mình.",
          "bao khoá rồi, các em lớn lên vững vàng, tử tế. Một Steve Jobs thì thầy vẫn chưa thấy — nhưng ngần ấy đứa nên người, thầy nghĩ cũng đáng."
        ]
      },
      cool: {
        craft: [
          "thầy để cửa mở cho các em tự đi. Mới năm đầu mà đã có đứa lạc giữa sân — thầy chưa biết nên siết lại hay cứ buông.",
          "thầy để cửa mở cho các em tự tìm đường, mà vài em lạc mất giữa sân trường, chưa ai kịp kéo về. Tự do cũng có cái giá của nó.",
          "vẫn cái cửa mở ấy; năm nào cũng có đứa đi lạc thầy không kéo về kịp. Thầy biết cái giá rồi — mà vẫn chưa biết đóng bớt lại bao nhiêu là vừa."
        ],
        cram: [
          "thầy đẩy các em qua hết đề này đến đề khác. Có đứa sáng dạ tự dưng nguội đi — thầy chưa hiểu vì sao, hay tại chính tay thầy?",
          "thầy đẩy các em qua hết đề này đến đề khác; vài đứa sáng dạ nhất lại nguội đi trên tay thầy. Thầy sợ mình đang mài, mà quên rằng có thứ càng mài càng mòn.",
          "lại một khoá thầy mài qua đề, lại những đứa sáng nhất nguội đi trên tay thầy. Thầy biết tỏng cái sai ấy rồi — mà năm sau vẫn sẽ mài, vì thầy chỉ biết dạy thế."
        ],
        balance: [
          "năm nay vài em nguội dần, chưa tìm ra lối. Thầy còn mới, thầy nghĩ mình sẽ kịp chỉnh lại cách dạy.",
          "năm nay thầy thấy vài em đang nguội dần, chưa tìm thấy lối của mình. Thầy còn phải nghĩ lại cách dạy các em.",
          "vẫn vài em nguội dần mỗi năm, thầy vẫn bảo mình sẽ nghĩ lại cách dạy — mà bao năm rồi, nghĩ thì nhiều, đổi thì chẳng được mấy."
        ]
      },
      mixed: {
        craft: [
          "đứa đã làm ra thứ của mình, đứa còn loay hoay. Thầy mới mở trường, chưa biết để mặc các em tự lớn là đúng hay sai.",
          "đứa làm ra được thứ của mình, đứa vẫn loay hoay tìm lối. Thầy chưa biết để mặc các em tự lớn là đúng hay sai.",
          "năm nào cũng vậy: đứa nên hình, đứa còn loay hoay. Bao năm thầy vẫn chưa trả lời được cho mình — để mặc các em tự lớn, là thương hay là lười?"
        ],
        cram: [
          "đứa qua đề ngon, đứa thì gãy. Thầy luyện các em theo một cái thước — mà chưa chắc đời ngoài kia chấm theo thước ấy.",
          "đứa qua đề ngon lành, đứa thì gãy. Thầy luyện cho các em cái thước chung, mà đời ngoài kia đâu chấm theo thước ấy.",
          "vẫn cái thước chung ấy: đứa vừa thước thì qua, đứa lệch thước thì gãy. Bao năm thầy biết đời chấm khác — mà bỏ thước đi thì thầy vẫn chưa dám."
        ],
        balance: [
          "đứa bừng lên, đứa chững lại. Trường mới, thầy chỉ mong sang năm bớt đi một cái tên mình không giữ được.",
          "đứa bừng lên, đứa chững lại — trường nào rồi cũng thế. Thầy chỉ mong năm sau bớt đi một cái tên thầy không giữ được.",
          "đứa bừng, đứa chững — bao khoá rồi vẫn thế. Thầy thôi mong giữ được hết; chỉ mong mỗi năm bớt đi một cái tên mình không giữ nổi."
        ]
      }
    }
  },
  mentorCredit: " · nhờ thầy không buông tay em",   // E4.1: a kid you MENTORED who reached a realized life — the attention, felt by name
  diamondCredit: " · ngọc thô — vào bằng cửa hẹp",  // E-UNDERDOG: an overlooked low-score admit who realized — the exam was wrong, you weren't
  channeledMaker: " — đúng đường mà trường vạch, chỉ vậy thôi",
  // iter-179 — the WHOLE cohort becomes someone WHILE you watch (not just the followed protégé). Glimpsed prose,
  // named, never a meter (§C-3): a real gift BLOOMING under a fitting school, or WILTING in a mismatch (§C-2).
  // iter-193 (owner mandate "emergent per-life narrative, NOT generic strings"): keyed by the kid's TELL so the
  // line names THEIR specific gift being realized or wasted — spark (a builder/logic mind → kỹ sư), sky (a maker's
  // hands & odd ideas → 🍎), hype (a founder's drive → cá mập), `_` = no clear direction (the old generic lines).
  cohortBloom: {
    spark: [ "tư duy mạch lạc hẳn ra — đang thành một kỹ sư thực thụ.", "gỡ được cái lỗi cả lớp bó tay, mắt sáng rỡ." ],
    sky:   [ "bắt đầu làm ra thứ của riêng mình — cái khiếu đã tìm được lối.", "mấy ý lạ trong đầu em giờ thành hình được rồi." ],
    hype:  [ "biết bán ý tưởng của mình rồi — mà vẫn là ý thật.", "đứng trước lớp thuyết trình, cả phòng tin theo." ],
    _:     [ "đang thành chính mình — lối học này hợp với em.", "mắt sáng hẳn từ ngày được học đúng tạng." ]
  },
  cohortWilt: {
    spark: [ "đầu óc mạch lạc thế, mà cứ bắt học thuộc — tư duy đang cùn dần.", "giải thuật trong đầu em sắc lắm, nhưng lớp này chỉ dạy chép." ],
    sky:   [ "bàn tay khéo, đầy ý lạ — mà trường chưa cho em chỗ nào để làm.", "óc sáng tạo đang co lại vì chẳng có gì để chế tạo." ],
    hype:  [ "máu khởi nghiệp đang chuyển dần thành thói ăn xổi.", "khiếu thuyết phục đấy, mà đang học cách lùa hơn cách làm." ],
    _:     [ "tài năng đang nguội dần — lối học chưa hợp với em.", "ngồi đúng chỗ, mà mắt cứ nhìn ra cửa sổ." ]
  },
  // iter-198 — the 3rd in-play pole (cohortBeat): a real gift being BENT into hustle mid-school (cá-mập overtaking the
  // craft) — distortion made visible WHILE you can still act, the live counterpart of the epilogue's "bị bẻ cong".
  cohortBent: {
    spark: [ "đầu óc lập trình sắc thế, mà đang mài vào trò lùa gà.", "giỏi máy móc thật, nhưng đang học cách bán khoá học làm giàu." ],
    sky:   [ "bàn tay khéo đang bỏ xưởng đi buôn nước bọt.", "óc sáng tạo đang quay sang nghĩ chiêu hơn nghĩ sản phẩm." ],
    _:     [ "cái khiếu đang bị bẻ dần sang trò khôn lỏi.", "tài năng thật đang nhường chỗ cho thói ăn xổi." ]
  },
  // iter-219 (NARRATIVE) — the DEMOGRAPHIC axis surfaced IN-PLAY: when a glimpsed gifted kid is POOR + unbacked, name the
  // class as a compounding force WHILE you can still act (a mentor slot is the school-as-equalizer, made felt mid-game).
  // Appended to the cohort glimpse only for an unmentored nghèo kid → the disadvantage is no longer only a payoff line.
  cohortPoor: {
    wilt:  " Mà em nhà nghèo, lại càng chẳng ai đỡ — một suất dìu dắt có khi đổi được cả đời.",
    bloom: " Nhà nghèo mà sáng đến thế — của hiếm; đừng để tuột mất.",
    bent:  " Nhà nghèo, đường tắt lại càng dễ kéo em đi."
  },
  // iter-242 PEERS/CONTAGION ckpt2 — name the MÔI TRƯỜNG on a named kid IN-PLAY (Mark 5: while a slot/policy can still
  // change it). Appended to a bloom/wilt beat when the cohort atmosphere is the salient force: a warm class lifts the
  // bloomer further; a cold one drags the cooling one down ("chọn bạn mà chơi" made personal). Mirrors cohortPoor.
  cohortPeer: {
    bloomWarm: " Cả lớp năm nay cũng hừng hực — em đứng giữa đám bạn cùng gắng, lại càng gắng.",
    wiltCold:  " Mà cả lớp cũng đang rã đám, uể oải — không khí ấy cuốn em theo, chẳng ai níu lại."
  },
  // iter-182 (owner steer ckpt3): NON-monetary gifts from successful alumni — the school's "kho lưu niệm", a hook for
  // extension functions later (a printer→Xưởng, servers→Lab, an internship→a kid…). For now: collected, named, kept.
  giftItems: [
    "một máy in 3D đời mới cho Xưởng",
    "dàn máy chủ cũ của công ty em",
    "tủ sách kỹ thuật, đóng thùng gửi về",
    "một suất thực tập cho đàn em mỗi năm",
    "bức ảnh khóa đầu tiên, lồng khung kính",
    "chiếc cúp khởi nghiệp mạ vàng",
    "bộ đồ nghề sửa chữa xịn nhất phố",
    "tấm biển tên trường mới, khắc đồng",
    "lời mời về nói chuyện truyền cảm hứng",
    "một góc thư viện mang tên khóa cũ",
    "chiếc bo mạch đầu tay, vẫn còn chạy",
    "thùng mì tôm tài trợ căng tin cả năm"
  ],
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
  // iter-241 PEERS/CONTAGION ckpt1 — the cohort's pull named once a year (tetCohortBeat) when the school's atmosphere
  // leans strongly warm or cold. The mechanical contagion lives in growStudents; this makes the môi trường legible.
  peer: {
    warm: "🤝 Năm nay cả trường dễ thở. Đứa vững kéo đứa chông chênh đi lên — cái không khí ấy tự nó dạy, thầy đỡ phần nào.",
    cold: "🥀 Năm nay trường nặng nề. Cả lớp cắm cúi, uể oải — đứa sáng nhất cũng bị cuốn theo cái mỏi mệt chung của bạn bè."
  },
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
  // iter-209 (NARRATIVE/WRITING N1) — GIFT-SPECIFIC alumni vignettes: the same outcome reads differently for a coder
  // (spark), a maker (sky), a persuader (hype), so each kid is a PERSON, not "a THẤT_NGHIỆP". pickLine/pickLineIdx
  // prefer alumLinesByTell[state][tell], falling back to the generic alumLines[state] (tell="" / uncovered state).
  // Drafted by a 3-writer multi-agent fan-out (concrete / ironic / tender lenses), synthesized best-per-cell. The
  // simulation's depth (tell × outcome) finally shows in the prose — the foundation the long capstone essay assembles from.
  alumLinesByTell: {
    THAT_NGHIEP: {
      spark: ["Laptop của {ten} mở sẵn một dự án dang dở, ba năm chưa ai trả tiền để nó chạy.", "Repo của {ten} có hai nghìn sao trên mạng. Trên giấy tờ vẫn là 'chưa có việc làm'."],
      sky: ["Trên bàn {ten} là cái máy tự chế từng đoạt giải, giờ làm chỗ gác chìa khoá.", "{ten} sửa đồ miễn phí cho cả xóm. Không nghề nào trên đời chịu trả lương cho đôi tay ấy."],
      hype: ["{ten} có bốn mươi nghìn người theo dõi 'hành trình tìm việc'. Sang năm thứ hai.", "{ten} có tài kéo người ta nghe, mà chẳng có gì để bán. Cả nhóm bạn dần thưa."]
    },
    LUONG_ON: {
      spark: ["{ten} tự động hoá hết việc của mình bằng một đoạn script. Vẫn ngồi đủ tám tiếng cho phải phép.", "Code của {ten} chạy âm thầm sau mỗi báo cáo. Không ai biết, em cũng quen rồi."],
      sky: ["{ten} sửa cái máy in cả công ty chịu thua. Hết giờ lại về, đúng giờ.", "{ten} kê lại cái bàn lung lay của cả phòng bằng một miếng nêm tự tiện. Không ai để ý."],
      hype: ["{ten} chốt đơn đều tay, KPI tháng nào cũng xanh. Hoa hồng vừa đủ một ly trà chiều.", "{ten} bán ý tưởng giỏi đến nỗi sếp nhận làm của mình. {ten} được tăng 8%."]
    },
    KY_SU: {
      spark: ["{ten} viết lại phần lõi, hệ thống nhanh gấp đôi. Bản ghi commit chỉ đề một dòng: 'sửa tí'.", "Hệ thống nửa đêm sập, điện thoại {ten} sáng đầu tiên. Năm phút sau, nó lại chạy."],
      sky: ["{ten} tiện một con ốc không hãng nào còn bán, máy già hai chục năm chạy lại.", "Cái đồ gá {ten} chế nằm trong xưởng, không tên không bằng, nhưng thiếu nó là tắc cả dây chuyền."],
      hype: ["{ten} đứng giữa khách và kỹ thuật, dịch hai bên hiểu nhau. Dự án nào có em là trôi.", "{ten} bỏ nghề bán hàng, quay ra làm thật. Giờ em pitch được vì sản phẩm có thật."]
    },
    FOUNDER: {
      spark: ["{ten} tự code cả sản phẩm đầu, ngủ cạnh server. Vòng hạt giống đã chốt — hạt rất nhỏ.", "Bản demo {ten} tự code chạy ngon trên một máy. Nhà đầu tư hỏi: thế còn một triệu máy?"],
      sky: ["Slide của {ten} xấu, nhưng em đặt sản phẩm thật lên bàn. Cả phòng im lặng cầm thử.", "Xưởng nhỏ của {ten} thơm mùi nhựa in 3D. Em pitch lần thứ chín, vẫn tin vào thứ mình làm."],
      hype: ["{ten} pitch lần thứ chín, slide mượt như nước. Nhà đầu tư gật gù rồi xin 'để em xem thêm'.", "{ten} gọi vốn bằng một câu chuyện hay đến rơi nước mắt. Demo thì 'để lần sau'."]
    },
    CA_MAP_COIN: {
      spark: ["Hợp đồng thông minh của {ten} không có lỗi nào — trừ cái cửa hậu cố tình để lại.", "{ten} viết con bot 'auto x3 tài khoản'. Code thì chuẩn, đằng sau là một cái hố."],
      sky: ["Đôi tay từng chế ra đồ thật, giờ {ten} dùng để dựng gian hàng giả long lanh trên livestream.", "{ten} làm bao bì đẹp đến mức ai cũng tin. Bên trong hộp, chẳng có gì."],
      hype: ["Tài hùng biện của {ten} giờ rót vào khoá 'tư duy triệu đô', học phí bốn số.", "Cái duyên kéo người của {ten} giờ kéo họ vào nhóm kín, đổi tên lần thứ tư cho 'tránh tai tiếng'."]
    },
    QUAN_VAN_MAU: {
      spark: ["{ten} từng tự nghĩ ra thuật toán riêng. Giờ điền đúng mẫu, đúng ô, đúng người ký.", "Cái đầu logic của {ten} giờ dùng để rà cho biên bản khớp quy trình. Sạch, và lặng."],
      sky: ["Đôi tay từng chế ra cái mới, nay {ten} xếp hồ sơ thẳng hàng đẹp nhất phòng.", "{ten} nộp bản vẽ đúng khung mẫu, từng nét chuẩn quy chuẩn. Cái khung ấy không chừa chỗ cho ý của riêng em."],
      hype: ["Giọng nói từng làm cả lớp ồ lên, nay {ten} đọc báo cáo điển hình, đúng từng câu mẫu.", "{ten} thuyết trình thành tích trơn tru, ai cũng khen. Về chỗ, em cười gượng một mình."]
    }
  },
  garageLine: "Công ty của {ten} sa thải 90% nhân sự. {ten} đang ngủ trong ga-ra.",
  // iter-208 (NARRATIVE/WRITING track ckpt1) — a POOL so two Steves never read identically (the owner caught the dup).
  // keynoteFor(a) picks per-alum by id (deterministic, replay-safe). Varied angles, same voice: the reveal, the awe,
  // the roots, the teacher who didn't let go (the đề-Văn's own answer), the classroom it began in.
  keynotePool: [
    "MỘT THỨ NỮA… — {ten} bước ra sân khấu. Cả nước nhận ra câu trả lời của đề Văn năm ấy.",
    "{ten} giơ lên một thứ vừa lòng bàn tay. Cả khán phòng nín thở, rồi vỡ oà — thứ đó, chưa ai từng thấy.",
    "Người ta xếp hàng từ bốn giờ sáng để chạm vào thứ {ten} làm ra. Ở quê, mẹ em vẫn ra vườn, bảo 'hồi bé nó nghịch lắm'.",
    "Báo nước ngoài gọi {ten} là hiện tượng. Em nói gọn: 'Tôi học trường tỉnh. Có một người thầy không bỏ tôi giữa chừng.'",
    "Lên sân khấu, {ten} không chiếu sản phẩm trước. Em chiếu một tấm ảnh lớp học cũ, rồi mới nói: 'Bắt đầu từ đây.'"
  ],
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
    // iter-195 (E8 ckpt2): each pool teacher has a `grain` they realize (spark=lập trình, sky=chế tạo, hype=khởi
    // nghiệp; ""=đa năng/no lean). Hiring is a TRADE-OFF — a coder-teacher grows coders & neglects makers, etc.
    pool: [
      { id: "coder", ten: "Thầy Coder Tự Học", day: 9, dien: 1, luong: 15, trait: "tch", grain: "spark", note: "không bằng cấp, rẻ vì thị trường định giá tờ giấy" },
      { id: "diengia", ten: "Thầy Diễn Giả Truyền Cảm Hứng", day: 1, dien: 10, luong: 25, trait: "hype", grain: "hype", req: { m: "tt", v: 40 }, note: "+5 Mood khi vào, -3 sau hai tháng — chỉ ghé trường có tiếng" },
      { id: "viral", ten: "Cô Giáo Viral Triệu View", day: 2, dien: 9, luong: 30, trait: "hype", grain: "hype", req: { m: "tt", v: 60 }, note: "trường nổi mới mời nổi — vào lớp như lên sóng" },
      { id: "ielts", ten: "Cô IELTS Pitch Deck", day: 5, dien: 8, luong: 35, trait: "", grain: "", req: { m: "ut", v: 45 }, note: "dạy thật lẫn diễn thật — chọn trường đàng hoàng" },
      { id: "gshuu", ten: "GS Đầu Ngành Về Hưu", day: 8, dien: 6, luong: 40, trait: "tch", grain: "spark", req: { m: "ut", v: 65 }, note: "danh ông gắn với tên trường — chỉ về nơi có uy tín" },
      { id: "kysu", ten: "Thầy Cựu Kỹ Sư Phương Đông", day: 9, dien: 3, luong: 38, trait: "tch", grain: "sky", req: { m: "tc", v: 55 }, note: "đắt. đáng. chỉ ở lại trường có thực chất." }
    ]
  },

  nameParts: {
    ho: ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương"],
    dem: ["Văn", "Thị", "Minh", "Ngọc", "Hữu", "Đức", "Thanh", "Quốc", "Gia", "Khánh", "Phương", "Hải"],
    ten: ["An", "Bình", "Châu", "Dũng", "Giang", "Hà", "Khoa", "Linh", "My", "Nam", "Oanh", "Phúc", "Quân", "Sơn", "Thảo", "Uyên", "Vy", "Xuân", "Yến", "Đạt", "Hiếu", "Trang", "Tùng", "Nhi"]
  },

  events: [
    // iter-169 — money-vs-mission, at the wealthy-school scale (the đề Văn bite tied to the new economy): a felt
    // fork between cash/fame and integrity. Fires once the school is famous (TT≥60) — a corp courts a name.
    { id: "taiTro", title: "💰 Một tập đoàn muốn 'đồng hành cùng nhà trường'",
      desc: "Một tập đoàn lớn đề nghị tài trợ khủng — đổi lại: logo của họ phủ khắp trường, và 'vài suất' tuyển sinh đặc cách cho con em đối tác. Phòng tài vụ sáng mắt; Bác Tâm im lặng.",
      pred: "famous",
      choices: [
        { label: "Nhận tài trợ — tiền là tiền", hint: "+200tr, +6 Tiếng Tăm, −5 Uy Tín, một mầm phốt", fx: "taiTroNhan" },
        { label: "Cảm ơn, trường không bán cửa", hint: "+3 Uy Tín, Bác Tâm gật đầu", fx: "taiTroTuChoi" }
      ] },
    { id: "chuong", title: "🌀 Mai Sương tháo quạt trần lớp",
      desc: "Mai Sương tháo cái quạt trần trên lớp ra xem — 'nó quay lệch, nghe lạch cạch'. Bảo vệ đang chờ ý kiến hiệu trưởng.",
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
    { id: "tvc", minEra: 2, title: "📺 Trứng Vàng muốn quay TVC", // iter-229: a "Lab Sống Ảo" TVC shoot belongs to the dot-com era onward, not the 1990s
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
    { id: "aiHo", minEra: 3, title: "🤖 AI làm hộ đồ án", // iter-229: AI-generated homework only makes sense from the smartphone/AI decades on
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

  // iter-240 L4 ckpt1-fix: the tech-reach beat fires when a new tech era extends the teacher's reach — keyed by era index so it's ERA-TRUE (era3 = smartphone/ed-tech, era4 = AI), not the iter-239 mislabel. {n} = the era's bonus to the mentor cap.
  techReach: {
    3: "📱 Internet và học liệu trực tuyến về trường — thầy kèm sát thêm được một em mỗi lúc (suất dìu dắt +{n}). Bài giảng số gánh phần lặp đi lặp lại; thầy dồn sức cho đứa thật cần.",
    4: "🤖 Trợ giảng AI về trường — thầy lại kèm sát thêm một em nữa (suất dìu dắt +{n}). Máy tự viết, tự chấm; thầy chỉ còn lo phần không máy nào thay được — hiểu cho thấu một đứa trẻ."
  },
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
    // iter-213 (N3) — the capstone re-reads the headmaster's own annual letters (the player's policy, year by year),
    // so the essay shows his THINKING evolve before he writes the final answer (THESIS §B-3: assembled from the run).
    lettersIntro: "Trước khi gấp lại, tôi giở tập thư mình viết cho các em mỗi cuối năm. Đọc một lượt mới thấy: tôi loay hoay với cái đề này y như nó bắt các em loay hoay.",
    lettersFirst: "Năm {y}, tôi viết: “…{text}”",
    lettersPivot: "Rồi năm {y}, tôi viết khác hẳn: “…{text}” — chắc đó là năm tôi bắt đầu nghĩ lại.",
    lettersLast: "Và lá cuối, năm {y}: “…{text}”",
    lettersReflect: "{n} lá thư, {graduated} cái tên. Câu hỏi vẫn nằm nguyên trên bàn — nhưng người ngồi viết nó thì đã khác đi nhiều rồi. Có lẽ tôi không cần trả lời nó. Tôi chỉ cần đừng thôi hỏi.",
    lettersSameIntro: "Trước khi gấp lại, tôi giở tập thư mình viết cho các em mỗi cuối năm. Lạ — năm nào tôi cũng viết lại gần đúng một nỗi ấy:",
    lettersSame: "“…{text}”",
    lettersSameReflect: "{n} năm, {n} lá thư, cùng một nỗi lo — mà chưa năm nào tôi dám đổi cách dạy. Có lẽ cái sai lớn nhất của tôi không nằm ở một đứa nào, mà ở chỗ tôi cứ làm đúng một việc và mong một kết quả khác.",
    // iter-148 — an empty 🍎 column has two OPPOSITE causes; naming which makes the đề Văn's peak-vs-median
    // trade-off felt at the payoff, and keeps the question open (§D-3). Picked in essayDraft from the cohort shape.
    steveColEmpty: {
      even: "Cột “🍎” vẫn để trống. Mà lạ — sổ tôi gần như không có dòng nào hỏng. Cả khoá nên người, đều tay, vững vàng. Có lẽ chính vì tôi không để đứa nào chông chênh, nên cũng chẳng đứa nào bứt lên. Tôi dạy an toàn quá chăng?",
      craft: "Cột “🍎” vẫn để trống — lần này. Sổ có vài dòng gãy. Có em lạc trong Xưởng, tôi chưa kịp kéo về — không phải vì thiếu tài, mà vì tôi để quá nhiều cửa mở. Mà cũng có thứ chỉ mọc lên khi không ai can thiệp. Không biết thế là đúng hay sai.",
      grind: "Cột “🍎” vẫn để trống. Khoá nào cũng qua môn đẹp, điểm cao đều tăm tắp — nhưng đều quá, phẳng quá. Tôi luyện cho các em một cái khuôn chung; mà cái khác người, cái có thể thành 🍎, lại là thứ chẳng vừa khuôn nào.",
      mixed: "Cột “🍎” vẫn để trống — chỗ đó tôi chừa, chưa gạch."
    },
    steveColFull: "Cột “🍎” có {steves} dòng. Tôi vẫn không chắc là tôi viết ra nó, hay tôi chỉ tình cờ không xoá nó đi.",
    ledgerHead: "Rồi tôi đặt ba quyển sổ cạnh nhau.",
    ledgerBank: "Sổ ngân hàng: {cash}.",
    ledgerEndow: "Quỹ hiến tặng: {endow} — tiền của lòng biết ơn,{endowTail} không tiêu được vào quảng cáo.",
    ledgerThird: "Sổ thứ ba không in được thành tiền: là cái danh sách ở trên.",
    ledgerStare: "Ba quyển nằm cạnh nhau trên bàn. Quyển nào to hơn thì… ai mà cân cho được.",
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
      steve: "Bác Tâm để ấm trà xuống: “Đứa đó hồi xưa hay tháo quạt trần lớp ra sửa. Sổ này có nó là đủ dày.”",
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
