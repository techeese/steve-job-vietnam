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
function buildCast(s, byState, majorityKey, C) {
  function pick(arr) { return arr.slice().sort(function (a, b) { return ((b.flags && b.flags.prize ? 1 : 0) - (a.flags && a.flags.prize ? 1 : 0)) || (b.grat - a.grat) || ((b.gifts || 0) - (a.gifts || 0)); }); } // E7p: an honored standout is essay-worthy → floats up in each cast pick (so the epilogue shows the prizes)
  var cast = [], used = {}, total = s.alumni.length, i;
  pick(s.alumni.filter(function (a) { return a.state === "STEVE"; })).slice(0, C.STEVE_CAP).forEach(function (a) { cast.push(a); used[a.id] = 1; });
  // THESIS §D2 — the poignant core: the essay MUST name one gift the school failed to realize. Loud waste
  // first (thất nghiệp / lệch hướng); if the school produced none, the QUIET waste E4 surfaces — a prodigy
  // who merely SETTLED into 💼 lương ổn (craft's grief, previously invisible). Either way the question stays open.
  var byReal = function (a, b) { return (b.fs.seed - a.fs.seed) || (b.grat - a.grat); };
  var prodigy = s.alumni.filter(function (a) { return !used[a.id] && a.fs && realClass(a.state, a.fs.seed) === "loud"; }).sort(byReal)[0]
    || s.alumni.filter(function (a) { return !used[a.id] && a.fs && realClass(a.state, a.fs.seed) === "under"; }).sort(byReal)[0];
  if (prodigy && cast.length < C.CAST_CAP) { cast.push(prodigy); used[prodigy.id] = 1; }
  pick(s.alumni.filter(function (a) { return a.state === "BI_BAT"; })).slice(0, C.BIBAT_CAP).forEach(function (a) { if (cast.length < C.CAST_CAP) { cast.push(a); used[a.id] = 1; } });
  // E4.1 — the mentor's hand, named: a kid you spent scarce attention on who reached a realized life (💼 lương
  // ổn or better) WITHOUT a grief reading — your attention rescued them. Turns the inaction-cost (a sweep
  // number) into the felt attachment payoff: your invested kid, seen by name. Prefer the strongest realization.
  var mentee = s.alumni.filter(function (a) { return !used[a.id] && a.flags && a.flags.mentored && flourishOf(a.state) >= 2 && !realClass(a.state, a.fs.seed); })
    .sort(function (a, b) { return (flourishOf(b.state) - flourishOf(a.state)) || (b.grat - a.grat); })[0];
  if (mentee && cast.length < C.CAST_CAP) { cast.push(mentee); used[mentee.id] = 1; }
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
  F("800", 31, "#f0c674"); x.fillText("Học viện Steve", 30, 54);
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
