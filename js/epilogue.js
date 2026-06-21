/* ============================================================================
   Học viện Steve — js/epilogue.js
   The PURE epilogue/end-card helpers, split from ui.js (iter 149 STRUCTURE).
   These three functions are STATELESS — they take the live state (or a derived
   shape) as parameters and read only globals (CONFIG, realClass/flourishOf from
   person.js, the DOM constructors). NO closure state, no S()/tpl()/toast(). They
   are the clean, byte-identical-verifiable slice of the epilogue cluster (the
   essay ASSEMBLY — essayDraft, which needs the ui.js IIFE's S/tpl/numWord/
   hideModal — stays in ui.js; saveShareCard stays too, it needs toast()).
   Globals, loaded AFTER person.js (for realClass/flourishOf) and BEFORE ui.js
   (whose essayDraft calls buildCast/shareCard by bare name). Headless harnesses
   (gate/sweep/bot) don't load this — they touch no DOM and never build the cast.
   ========================================================================== */

// THESIS §D2 — pick the ~handful of named lives the closing essay points at: the 🍎(s) first, then the
// poignant core (one gift the school FAILED — loud waste, else the quiet E4 "settled" prodigy), then an
// arrest, then the mentor's-hand payoff, then the majority fate + a spread of the rest. Honored standouts
// (flags.prize) float up within each pick so the epilogue surfaces the awards.
function buildCast(s, byState, majorityKey, C, dominantPreset) {
  function pick(arr) { return arr.slice().sort(function (a, b) { return ((b.flags && b.flags.prize ? 1 : 0) - (a.flags && a.flags.prize ? 1 : 0)) || (b.grat - a.grat) || ((b.gifts || 0) - (a.gifts || 0)); }); } // E7p: an honored standout is essay-worthy → floats up in each cast pick (so the epilogue shows the prizes)
  var cast = [], used = {}, total = s.alumni.length, i;
  pick(s.alumni.filter(function (a) { return a.state === "STEVE"; })).slice(0, C.STEVE_CAP).forEach(function (a) { cast.push(a); used[a.id] = 1; });
  // THESIS §D2 — the poignant core: the essay MUST name one gift the school failed to realize. Loud waste
  // first (thất nghiệp / lệch hướng); if the school produced none, the QUIET waste E4 surfaces — a prodigy
  // who merely SETTLED into 💼 lương ổn (craft's grief, previously invisible). Either way the question stays open.
  var byReal = function (a, b) { return (b.fs.seed - a.fs.seed) || (b.grat - a.grat); };
  var prodigy = s.alumni.filter(function (a) { return !used[a.id] && a.fs && (function (rc) { return rc === "loud" || rc === "bent"; })(realClass(a.state, a.fs.seed)); }).sort(byReal)[0] // iter-197: a wasted OR distorted prodigy carries the grief cast
    || s.alumni.filter(function (a) { return !used[a.id] && a.fs && realClass(a.state, a.fs.seed) === "under"; }).sort(byReal)[0];
  if (prodigy && cast.length < C.CAST_CAP) { cast.push(prodigy); used[prodigy.id] = 1; }
  pick(s.alumni.filter(function (a) { return a.state === "BI_BAT"; })).slice(0, C.BIBAT_CAP).forEach(function (a) { if (cast.length < C.CAST_CAP) { cast.push(a); used[a.id] = 1; } });
  // E4.1 — the mentor's hand, named: a kid you spent scarce attention on who reached a realized life (💼 lương
  // ổn or better) WITHOUT a grief reading — your attention rescued them. Turns the inaction-cost (a sweep
  // number) into the felt attachment payoff: your invested kid, seen by name. Prefer the strongest realization.
  var mentee = s.alumni.filter(function (a) { return !used[a.id] && a.flags && a.flags.mentored && flourishOf(a.state) >= 2 && !realClass(a.state, a.fs.seed); })
    .sort(function (a, b) { return (flourishOf(b.state) - flourishOf(a.state)) || (b.grat - a.grat); })[0];
  if (mentee && cast.length < C.CAST_CAP) { cast.push(mentee); used[mentee.id] = 1; }
  // iter-174 — under a BALANCED-dominant school the grief is QUIET: there's almost no loud waste, so the poignant
  // core is a maker (sky-tell, real gift) CHANNELED into a safe engineer — realized by magnitude, but the school
  // steered their DIRECTION (§C-4, done TO them). Surface ONE so the "even/an toàn quá chăng" close has a NAMED
  // face, not just a generic line. essayDraft labels it with CONTENT.channeledMaker; was dead code until now.
  if (dominantPreset === "canbang" && cast.length < C.CAST_CAP) {
    var chan = pick(s.alumni.filter(function (a) { return !used[a.id] && a.state === "KY_SU" && a.fs && a.fs.tell === "sky" && a.fs.seed >= 4 && !realClass(a.state, a.fs.seed); }))[0];
    if (chan) { cast.push(chan); used[chan.id] = 1; }
  }
  if (majorityKey) {
    var maj = pick(s.alumni.filter(function (a) { return a.state === majorityKey && !used[a.id]; }));
    if (maj[0] && cast.length < C.CAST_CAP) { cast.push(maj[0]); used[maj[0].id] = 1; }
    if (maj[1] && cast.length < C.CAST_CAP && (byState[majorityKey] / Math.max(1, total)) >= C.SAME_STATE_RATIO) { cast.push(maj[1]); used[maj[1].id] = 1; }
  }
  var order = Object.keys(byState).filter(function (k) { return k !== "STEVE" && k !== "BI_BAT" && k !== majorityKey; }).sort(function (a, b) { return byState[b] - byState[a]; });
  for (i = 0; i < order.length && cast.length < C.CAST_CAP; i++) { var ex = pick(s.alumni.filter(function (a) { return a.state === order[i] && !used[a.id]; }))[0]; if (ex) { cast.push(ex); used[ex.id] = 1; } }
  return cast;
}
// a beautiful, screenshot-able summary card of the player's answer to the đề Văn (shareability + BITE)
// iter-143 — the most salient FACE to put on the shareable card (the game is a playable essay → the đề Văn
// answer should carry a person, not just stats): a 🍎 if any, else the poignant wasted prodigy, else the top gift.
function cardLife(s) {
  var al = (s.alumni || []).filter(function (a) { return a && a.fs; });
  var steve = al.filter(function (a) { return a.state === "STEVE"; })[0]; if (steve) return steve;
  var W = { THAT_NGHIEP: 1, QUAN_VAN_MAU: 1, CA_MAP_COIN: 1, BI_BAT: 1 };
  var prod = al.filter(function (a) { return a.fs.seed >= 4 && W[a.state]; }).sort(function (a, b) { return b.fs.seed - a.fs.seed; })[0]; if (prod) return prod;
  return al.slice().sort(function (a, b) { return (b.fs.seed || 0) - (a.fs.seed || 0); })[0];
}
function shareCard(s, branch) {
  var V = { steve: ["🍎", "Có. Ít nhất một quả táo đã chín."], coin: ["🪙", "Có 'Steve' — nhưng là Steve chốt đơn hội nhóm."],
    vanmau: ["📋", "Trường dạy giỏi. Đời cần bản sao đẹp."], that: ["🌧️", "Tiềm năng thì nhiều, chỗ đứng thì ít."],
    kysu: ["👷", "Không phải Jobs. Nhưng nước cần kỹ sư thật."], hype: ["📣", "Nổi tiếng trước, thực chất tính sau."],
    thuc: ["🛠️", "Thực chất đầy mình — chỉ đợi thời lên tiếng."], kind: ["🌱", "Một ngôi trường tử tế. Câu hỏi vẫn mở."] }[branch] || ["🌱", "Câu hỏi vẫn mở."];
  var W = 600, H = 300, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  cv.style.cssText = "width:100%;border-radius:12px;display:block;margin-bottom:11px;border:1px solid var(--line)";
  var x = cv.getContext("2d"), F = function (w, sz, c) { x.fillStyle = c; x.font = (w ? w + " " : "") + sz + "px 'Be Vietnam Pro',system-ui,sans-serif"; };
  var bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#17212e"); bg.addColorStop(1, "#0b1018"); x.fillStyle = bg; x.fillRect(0, 0, W, H);
  x.strokeStyle = "#f0c674"; x.lineWidth = 3; x.strokeRect(7, 7, W - 14, H - 14);
  x.textAlign = "left";
  F("800", 31, "#f0c674"); x.fillText(s.schoolName || "Học viện Steve", 30, 54); // iter-186: the (possibly renamed) academy on the share card
  F("600", 15, "#9aa4b2"); x.fillText("Bản tổng kết · Năm " + s.year, 30, 78);
  F("italic 500", 13, "#6b7484"); x.fillText("“Làm thế nào để VN có những 'Steve Jobs Việt Nam'?”", 30, 106);
  x.font = "62px system-ui,sans-serif"; x.fillText(V[0], 32, 184);
  F("700", 19, "#eef1f5"); // wrap the verdict to the right of the icon
  (function () { var words = V[1].split(" "), line = "", yy = 156; for (var i = 0; i < words.length; i++) { var t = line + words[i] + " "; if (x.measureText(t).width > W - 150 && line) { x.fillText(line.trim(), 116, yy); line = words[i] + " "; yy += 26; } else line = t; } x.fillText(line.trim(), 116, yy); })();
  var life = cardLife(s); // iter-143: a named face on the answer (the soul, not just stats)
  if (life) { F("600", 13.5, "#cfd6df"); x.textAlign = "left"; x.fillText("Một gương mặt trong sổ: " + life.ten + " — " + CONFIG.ALUM.CHIPS[life.state], 30, 214); }
  F("600", 16, "#9aa4b2"); x.fillText("🎓 " + s.META.graduated + "    🍎 " + s.META.steves + "    🚔 " + s.META.arrested, 30, 244);
  F("500", 12, "#6b7484"); x.fillText("techeese.github.io/steve-job-vietnam", 30, 276);
  F("600", 12, "#f0c674"); x.textAlign = "right"; x.fillText("#HọcViệnSteve · đề Văn 2026", W - 30, 276);
  return cv;
}

// iter-183 STRUCTURE — the decade EPILOGUE ESSAY assembly, carved from ui.js (essayDraft). The iter-172 crash showed
// this fragile prose-builder was buried + under-covered in the 1825-line ui.js IIFE; here it sits with its sibling
// epilogue helpers (buildCast/shareCard), byte-verified via lives.sh `_essayText`. It is pure over the loaded state
// `s` + globals (CONFIG/CONTENT, el/esc/money/tpl from uikit+engine, realCreditSuffix/protegeCodaKey from person.js,
// buildCast/shareCard above) + two CALLBACKS `cb` for the only ui.js-private bits: cb.save (saveShareCard → toast)
// and cb.fold (hideModal). ui.js's essayDraft is now a one-line wrapper passing those in.
function numWord(n) { var o = CONTENT.essay.ones; return (n >= 1 && n <= 9) ? o[n] : String(n); }
function isOldCohort(a) { if (a._tpl) return true; var sc = CONFIG.ALUM.SCRIPTED || []; for (var i = 0; i < sc.length; i++) if (sc[i].ten === a.ten) return true; return false; }
function buildEssay(s, cb, capstone) {
  var C = CONFIG.ESSAY, E = CONTENT.essay, w = el("div");
  if (capstone) {
    w.appendChild(el("div", "kic", "Mười năm sau · Lễ Bế Giảng"));
    var ch = el("h2", null, "Mười năm sau ngày khai giảng đầu tiên"); w.appendChild(ch);
    var intro = el("div", "lead", "Trường đã đi hết một chặng. Bạn ngồi xuống, lấy ra bản nháp bài luận năm xưa — câu hỏi vẫn còn đó. Lần này bạn viết bằng những gương mặt đã đi qua sân trường này."); intro.style.fontStyle = "italic"; w.appendChild(intro);
  }
  var de = CONTENT.dePool[0], yw = numWord(s.year), cash = money(s.cash), endow = money(s.endow.bal); // iter-159: tỷ-aware money formatting for the (now scaling) endgame numbers
  var byState = {}; s.alumni.forEach(function (a) { byState[a.state] = (byState[a.state] || 0) + 1; });
  var nonSteve = Object.keys(byState).filter(function (k) { return k !== "STEVE" && k !== "BI_BAT"; });
  var majorityKey = nonSteve.sort(function (a, b) { return byState[b] - byState[a]; })[0] || null;
  var total = s.alumni.length;
  var presetVote = {}; ["n1","n2","n3","n4"].forEach(function(k){ var p = s.presets[k]; presetVote[p] = (presetVote[p]||0)+1; });
  var dominantPreset = Object.keys(presetVote).sort(function(a,b){return presetVote[b]-presetVote[a];})[0]||""; // iter-173: define presetVote BEFORE use (was a var-hoist use-before-init → Object.keys(undefined) crashed the whole epilogue)
  var steveAlum = s.alumni.filter(function (a) { return a.state === "STEVE"; });
  var tenSteve = steveAlum[0] ? steveAlum[0].ten : null;
  var branchKey = (function () {
    if (s.META.steves > 0) return "steve";
    if (!majorityKey) return "kind";
    var ratio = byState[majorityKey] / Math.max(1, total);
    if (majorityKey === "CA_MAP_COIN" || (s.META.arrested > 0 && ((byState.CA_MAP_COIN || 0) + (byState.BI_BAT || 0)) / Math.max(1, total) >= C.MAJOR_RATIO)) return "coin";
    if (majorityKey === "QUAN_VAN_MAU" && ratio >= C.MAJOR_RATIO) return "vanmau";
    if (majorityKey === "THAT_NGHIEP" && ratio >= C.MAJOR_RATIO) return "that";
    if (majorityKey === "KY_SU" && s.thucChat >= 55) return "kysu";
    if (s.tiengTam - s.thucChat >= C.HYPE_GAP) return "hype";
    if (s.thucChat >= 65 && s.tiengTam < 60) return "thuc";
    return "kind";
  })();
  var card = shareCard(s, branchKey); w.appendChild(card); // a summary of the player's answer…
  var save = el("button", "btn", "💾 Lưu / chia sẻ ảnh tổng kết"); save.style.cssText = "width:100%;margin-bottom:11px;font-size:12px"; // …now actually saveable/shareable
  save.onclick = function () { cb.save(card); };
  w.appendChild(save);
  function P(cls, html, it) { var e = el("div", cls, html); if (it) e.style.fontStyle = "italic"; w.appendChild(e); }
  P("kic", esc(E.kic.replace("{year}", s.year)));
  var h = el("h2", null, esc(E.title)); w.appendChild(h);
  P("lead", tpl(E.falseStart, { yearWord: yw }));
  P("lead", tpl(E.deHeader, { de: de }), true);
  if (s.META.graduated === 0) {
    P("lead", tpl(E.empty, { cash: cash, endow: endow }));
  } else {
    P("lead", tpl(E.ledger, { yearWord: yw, graduated: s.META.graduated }));
    P("lead", s.META.steves > 0 ? E.nameWithSteve : E.nameNoSteve);
    var prizeFlavorUsed = false; // iter-176: the "honored yet failed" line is a SINGULAR gut-punch — fire it once
    var usedLines = {}; // iter-222: no two cast members read the IDENTICAL quote (the Steve-keynote dup, at the cast level)
    buildCast(s, byState, majorityKey, C, dominantPreset).forEach(function (a) {
      var line = a.line || tpl((CONTENT.alumLines[a.state] || ["{ten}."])[0], { ten: a.ten });
      // dedup on the TEMPLATE (the kid's name normalised out) — two kids reading the same line modulo their name IS the dup
      var norm = a.ten ? line.split(a.ten).join("◊") : line;
      if (usedLines[norm]) { // a collision (two kids, same state×tell) — pick an unused variant from their own gift-pool
        var pool = (a.fs && a.fs.tell && CONTENT.alumLinesByTell[a.state] && CONTENT.alumLinesByTell[a.state][a.fs.tell]) || CONTENT.alumLines[a.state] || [];
        for (var pi = 0; pi < pool.length; pi++) { var altNorm = pool[pi].split("{ten}").join("◊"); if (!usedLines[altNorm]) { line = tpl(pool[pi], { ten: a.ten }); norm = altNorm; break; } }
      }
      usedLines[norm] = true;
      if (!prizeFlavorUsed && a.flags && a.flags.prize && { THAT_NGHIEP: 1, QUAN_VAN_MAU: 1, CA_MAP_COIN: 1, BI_BAT: 1 }[a.state]) { line = CONTENT.prizeWastedFlavor.replace(/\{ten\}/g, a.ten); prizeFlavorUsed = true; } // iter-144/176
      var tail = (a.state === "BI_BAT" && isOldCohort(a)) ? E.castRowArrestTail : "";
      var seed = (a.fs && a.fs.seed) || 0, stars = "★".repeat(seed) + "☆".repeat(5 - seed);
      var gap = realCreditSuffix(a.state, seed, a.flags, a.fs && a.fs.tell, a.gradYear, a.fs && a.fs.origin); // iter-154: the gift-vs-fate reading · iter-203: + tell · iter-205: + gradYear (the DECADE) · iter-206: + origin (family circumstance)
      if (!gap && dominantPreset === "canbang" && a.state === "KY_SU" && a.fs && a.fs.tell === "sky" && seed >= 4) gap = CONTENT.channeledMaker;
      var prize = (a.flags && a.flags.prize && CONTENT.prizes[a.flags.prize]) ? " <span class='tiny' style='color:var(--gold)'>🏅 " + esc(CONTENT.prizes[a.flags.prize]) + "</span>" : ""; // E7p
      P("lead", esc(a.ten) + " <span class='tiny' style='color:var(--gold);letter-spacing:1px'>" + stars + "</span> — " + CONFIG.ALUM.CHIPS[a.state] + esc(tail) + gap + prize + "<br>“" + esc(line) + "”");
    });
    // iter-142 — the WHOLE cohort beyond the 4 named, felt as a headmaster's qualitative reflection (no per-fate counts)
    if (s.alumni.length > 6) {
      var fOf = function (ks) { var n = 0; ks.forEach(function (k) { n += byState[k] || 0; }); return n; }, tot = s.alumni.length;
      var rz = fOf(["KY_SU", "FOUNDER", "LUONG_ON", "STEVE"]), wz = fOf(["THAT_NGHIEP", "QUAN_VAN_MAU"]), dz = fOf(["CA_MAP_COIN", "BI_BAT"]), ps = [];
      if (rz > tot * 0.4) ps.push("phần lớn nên người tử tế, đi làm đều"); else if (rz > tot * 0.12) ps.push("một số thành người tử tế");
      if (wz > tot * 0.25) ps.push("nhiều đứa tài năng cứ thế nguội dần"); else if (wz > 0) ps.push("vài đứa tài năng nguội dần");
      if (dz > tot * 0.18) ps.push("không ít đứa lạc sang đường tắt"); else if (dz > 0) ps.push("một hai đứa lạc sang đường tắt");
      if (ps.length) P("lead", "Còn lại trong sổ: " + ps.join("; ") + ".", true);
    }
    if (s.META.dropped > 0) P("lead", "Và " + s.META.dropped + " em đã rời sân trường giữa chừng — kiệt sức, không trụ nổi. Những cái tên tôi không kịp ghi vào sổ.", true); // iter-131: the burnout losses, mourned
    // iter-133 — the FOLLOW-LOOP's capstone payoff: the kid you watched, named with a personal coda
    var proteges = s.alumni.filter(function (a) { return a.flags && a.flags.protege; }).sort(function (a, b) { return (b.gradYear || 0) - (a.gradYear || 0); });
    if (proteges[0]) {
      var pg = proteges[0], pseed = (pg.fs && pg.fs.seed) || 0;
      var coda = CONTENT.protegeCoda[protegeCodaKey(pg.state, pseed)]; // iter-150: ONE source of truth w/ the graduation beat
      P("lead", "Và " + esc(pg.ten) + " — đứa em dõi theo từ ngày đầu — giờ là " + CONFIG.ALUM.CHIPS[pg.state] + ". " + coda + ".", true);
    }
    // iter-213 (N3) — re-read the annual letters: the headmaster's own thinking, year by year, before the final answer.
    if (s.letters && s.letters.length >= 2) {
      var lf = s.letters[0], ll = s.letters[s.letters.length - 1];
      var wk = function (l) { return l.worry || l.text; }; // iter-231: compare the underlying WORRY (state×culture), not the now year-varying words; old saves lack .worry → fall back to text
      if (wk(lf) === wk(ll)) { // a STABLE run — the same worry, year after year (the rut, honestly named — the words may have wearied, the course never changed)
        P("lead", E.lettersSameIntro, true);
        P("lead", tpl(E.lettersSame, { text: esc(ll.text) }), true);
        P("lead", tpl(E.lettersSameReflect, { n: s.letters.length }), true);
      } else { // the thinking EVOLVED — the underlying worry itself changed; show the arc: first → the TURNING POINT → last
        P("lead", E.lettersIntro, true);
        P("lead", tpl(E.lettersFirst, { y: lf.year, text: esc(lf.text) }), true);
        // iter-214 (N3 ckpt2): the pivot — the first year the headmaster's WORRY changed (his thinking turned), not merely the wording.
        var pivot = null;
        for (var li = 1; li < s.letters.length; li++) { if (wk(s.letters[li]) !== wk(s.letters[li - 1])) { pivot = s.letters[li]; break; } }
        if (pivot && wk(pivot) !== wk(lf) && wk(pivot) !== wk(ll)) P("lead", tpl(E.lettersPivot, { y: pivot.year, text: esc(pivot.text) }), true);
        P("lead", tpl(E.lettersLast, { y: ll.year, text: esc(ll.text) }), true);
        P("lead", tpl(E.lettersReflect, { n: s.letters.length, graduated: s.META.graduated }), true);
      }
    }
    if (s.META.steves > 0) { P("lead", tpl(E.steveColFull, { steves: s.META.steves })); }
    else { // iter-148/172 — WHY is the 🍎 column empty? (craft/even/grind/mixed — keeps §D-3 open). Prose-only.
      var tot148 = Math.max(1, total);
      var realz148 = (byState.KY_SU || 0) + (byState.FOUNDER || 0) + (byState.LUONG_ON || 0);
      var harm148 = (byState.THAT_NGHIEP || 0) + (byState.QUAN_VAN_MAU || 0) + (byState.CA_MAP_COIN || 0) + (byState.BI_BAT || 0);
      var emptyKey = (realz148 / tot148 >= 0.6 && harm148 / tot148 <= 0.2) ? (dominantPreset === "duan" ? "craft" : "even") : (harm148 / tot148 >= 0.4) ? "grind" : "mixed";
      P("lead", E.steveColEmpty[emptyKey] || E.steveColEmpty.mixed);
    }
    P("lead", E.ledgerHead);
    P("lead", tpl(E.ledgerBank, { cash: cash }));
    var endowTail = (majorityKey === "KY_SU" || (byState.KY_SU || 0) > 0) ? " phần lớn mấy đứa kỹ sư gửi về," : (tenSteve ? (" phần lớn là của " + esc(tenSteve) + ",") : "");
    P("lead", tpl(E.ledgerEndow, { endow: endow, endowTail: endowTail }));
    P("lead", E.ledgerThird);
    P("lead", E.ledgerStare);
  }
  P("lead", tpl(E.crossOut[branchKey], {}));
  P("nod", tpl(E.bacTam[s.META.graduated === 0 ? "empty" : branchKey], { nKySu: (byState.KY_SU || 0) }));
  P("lead", tpl(E.echo, { de: de }), true);
  P("tiny", esc(E.foot));
  var btn = el("button", "btn gold", esc(E.foldBtn)); btn.style.width = "100%"; btn.style.marginTop = "10px"; btn.onclick = cb.fold; w.appendChild(btn);
  return w;
}
