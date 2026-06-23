/* ============================================================================
   Học viện Steve — js/sim/alumni.js
   THE ALUMNI-WORLD FSM (iter 212 STRUCTURE carve from engine.js): once a student
   graduates, person.js has decided WHO they became (makeAlumnus); THIS module sims
   their life OUT in the world, year by year — the deterministic per-(alumnus,year)
   state machine (transition/gateFn), the 🍎 STEVE breakthrough (stevePShort/becomeSteve/
   keynoteFor), arrests, and the gratitude gifts back to the school (queueGift/flushGifts).
   It is coupled to the SCHOOL economy (gainTT/gainUT/S.endow/S.tiengTam/S.META) on purpose
   — an alumnus living their life feeds back into the school that made them.
   Layer law: pure-ish functions over the global S/CONFIG/CONTENT + engine helpers
   (clamp/r1/rrange/rpick/tpl/hashStr/mulberry32/news/gainTT/gainUT/bacTamNod, the alum
   stat derivers aLua/aCraft/aHustle/aHollow, eraFav/eraFavAt, pickLineIdx). Loaded in one
   scope (index.html <script> after person.js · gate.js/sweep.js concat-eval) — no DOM.
   Deterministic from S.seed0 (per-alumnus-year throwaway generators) → GATE_ALUM replays
   it byte-identical. The alumni-FSM functions are globals; engine.js dayTick + ui.js call them.
   ========================================================================== */
/* ============================================================================
   ALUMNI FSM — deterministic per (alumnus, year). seed0 stream only.
   ========================================================================== */
function setAlumState(a, st) { if (a.state !== st) { if (!a.history) a.history = [a.state]; a.state = st; a.history.push(st); } a.yearsInState = 0; } // track the trajectory
function alumniMonth(month) {
  for (var i = 0; i < S.alumni.length; i++) {
    var a = S.alumni[i];
    if (a.annMonth !== month) continue;
    if (a.state === "STEVE") continue;
    if (a._tpl && !a._arrested) continue; // scripted shadow — frozen in CA_MAP_COIN until the Y2-M3 arrest
    alumniTickOne(a);
  }
}
function alumniTickOne(a) {
  var r = mulberry32((S.seed0 ^ Math.imul(a.id, 2654435761) ^ Math.imul(S.year, 40503)) >>> 0);
  a.yearsInState += 1;
  var ysg = Math.max(0, S.year - a.gradYear);
  // DRAW 1 — Steve/garage (always drawn; meaningful only for FOUNDER)
  var d1 = r();
  if (a.state === "FOUNDER") {
    if (!a.flags.garage) {
      var pS = stevePShort(a);
      if (d1 < pS) { a.flags.garage = true; gainTT(-2); a.line = tpl(CONTENT.garageLine, { ten: a.ten }); a.yearsInState = a.yearsInState; return; }
    } else {
      if (d1 < stevePShort(a) * 3) { becomeSteve(a); return; }
      else { setAlumState(a, "KY_SU"); a.line = pickLine("KY_SU", a); return; }
    }
  }
  // DRAW 2 — transition
  var d2 = r();
  transition(a, d2, ysg);
  // DRAW 3 — flavor line
  var d3 = r();
  if (!a.line) a.line = pickLineIdx(a.state, a, Math.floor(d3 * 999));
  // DRAW 4 — gift (resolved at 20/11 flush; here we just queue eligibility)
  var d4 = r();
  queueGift(a, d4);
  // DRAW 5 — NON-monetary item gift (iter-182 owner steer ckpt3). After d4 → does NOT shift any existing draw (r is
  // fresh per alum each tick); items touch no tracked metric → bot/sweep cash byte-identical.
  var d5 = r();
  maybeItemGift(a, d5);
  // DRAW 6 — iter-271 (Phase-3 "Giá trị ở lại" CP2): the NATIONAL-LAYER value standing (RETAINED/EXTRACTED/DRAINED), set
  // ONCE for a realized life (flourish≥4). resolveStanding uses a SEPARATE seed0-salted generator — NOT r — so it does not
  // advance the FSM stream → DRAWs 1-5 + the apex draw byte-identical → GATE_ALUM untouched. STANDING.ON=false → skipped → byte-identical.
  if (CONFIG.ALUM.STANDING.ON && a.standing == null && S.year > a.gradYear && flourishOf(a.state) >= 4) a.standing = resolveStanding(a);
}
// iter-271 (Phase-3 CP2) — WHERE a realized life's value lands for the dân. Deterministic from seed0 ^ id ^ gradYear (NO
// S.year → independent of which year the guard fires → replay-safe). STRUCTURAL pulls (era/archetype/origin/the existing
// brain-drain flag) are heavy; PLAYER levers (mentored, renDial) are light + HARD-CLAMPED below the max era swing (non-dominant);
// a post-normalization FLOOR keeps all 3 poles reachable (symmetry). NON-APEX: reads a settled state, touches no gift/cash/TT/UT.
function resolveStanding(a) {
  var C = CONFIG.ALUM.STANDING;
  var idN = (a.id | 0) || hashStr("a" + a.id); // defensive: a migrated/non-numeric id never collapses the salt to 0
  var rr = mulberry32((S.seed0 ^ Math.imul(idN, 0x9E3779B1) ^ Math.imul(a.gradYear | 0, 40507)) >>> 0);
  var d = rr();
  var base = C.POOL[a.state] || C.POOL.KY_SU, pR = base[0], pE = base[1], pD = base[2];
  if (a.flags && a.flags.xn) { pD += C.XN_DRAIN; pR -= C.XN_DRAIN * 0.6; pE -= C.XN_DRAIN * 0.4; } // compose with the existing brain-drain seed, don't contradict it
  pE += C.BASE_OFFSHORE; pR -= C.BASE_OFFSHORE; // macro offshore pressure (era-independent → bites the >50% everyman too)
  var fav = eraFav(a.fs && a.fs.tell);
  if (fav > 1) { pE += C.ERA_PULL * (fav - 1); pD += C.DRAIN_PULL * (fav - 1); pR -= (C.ERA_PULL + C.DRAIN_PULL) * (fav - 1); }
  else if (fav < 1) { pR += C.RETAIN_SCARCE * (1 - fav); pE -= C.RETAIN_SCARCE * (1 - fav); }
  var arch = C.ARCH[S.archetype] || C.ARCH._; pR += arch.retain; pE += arch.extract; pD += arch.drain;
  var org = a.fs && a.fs.origin, oR = org === "ngheo" ? C.ORIGIN_NGHEO : org === "kha" ? -C.ORIGIN_KHA : 0;
  var pl = 0; if (a.flags && a.flags.mentored) pl += C.MENTOR_RETAIN;
  var ren = S.renDial || "can_bang"; if (ren === "phung_su") pl += C.REN_PHUNGSU; else if (ren === "vi_loi") pl -= C.REN_VILOI;
  var retainDelta = clamp(oR + pl, -C.PLAYER_CAP, C.PLAYER_CAP); // the firewall: player+origin retain delta stays below the era swing
  pR += retainDelta; if (retainDelta > 0) pE -= retainDelta; else pD -= retainDelta;
  pR = Math.max(0, pR); pE = Math.max(0, pE); pD = Math.max(0, pD);
  var sm = pR + pE + pD || 1; pR /= sm; pE /= sm; pD /= sm;
  var f = C.FLOOR_SHARE, k = 1 - 3 * f; pR = k * pR + f; pE = k * pE + f; pD = k * pD + f; // every pole ≥ f (symmetry)
  return d < pR ? "RETAINED" : d < pR + pE ? "EXTRACTED" : "DRAINED";
}
// iter-182 (owner: "successful alumni might donate… non-monetary items… for extension functions later"). A grat-scaled
// small chance for a successful alum to gift the school a tangible thing — collected in S.giftItems (the kho lưu niệm),
// named in the feed. Pure hook for now (no mechanical effect; the "extension functions" are a later, owner-gated step).
function maybeItemGift(a, draw) {
  var P = CONFIG.ALUM.ITEM_P[a.state]; if (!P) return;            // only successful states (STEVE/FOUNDER/KY_SU) give items
  if (draw >= clamp(P * (a.grat || 0) / 50, 0, 0.9)) return;      // grat-scaled — a grateful grad gives back
  var pool = CONTENT.giftItems, item = pool[Math.floor(draw * 997) % pool.length]; // deterministic pick from the same draw
  if (!S.giftItems) S.giftItems = [];
  S.giftItems.unshift({ item: item, ten: a.ten, year: S.year, state: a.state });
  if (S.giftItems.length > (CONFIG.ALUM.ITEM_CAP || 24)) S.giftItems.pop();
  news("🎁 " + a.ten + " gửi tặng trường: " + item + ".");
}
function stevePShort(a) {
  var lua = aLua(a);
  var luaM = CONFIG.ALUM.STEVE_LUA[lua] != null ? CONFIG.ALUM.STEVE_LUA[lua] : CONFIG.ALUM.STEVE_LUA_ELSE;
  var p = CONFIG.ALUM.STEVE_BASE * (aCraft(a) >= CONFIG.ALUM.STEVE_CRAFT ? 1 : 0) * luaM * (aHollow(a) <= CONFIG.ALUM.STEVE_HOLLOW ? 1 : 0) * (1 + 0.1 * Math.min(5, a.yearsInState)) * (a.flags.tiemNang ? 1 : CONFIG.ALUM.STEVE_NOFLAG);
  return p * eraFav(a.fs && a.fs.tell); // iter-204 L1: the apex too is era-gated — a coder's 🍎 is a near-certainty in the AI boom, a near-impossibility in the 1990s

}
// iter-208 (NARRATIVE/WRITING): the Steve keynote, picked per-alum by id → two Steves never read identically.
// Deterministic (hashStr, not the live rng) → replay-safe; one source for becomeSteve + the live ui keynote moment.
function keynoteFor(a) { var p = CONTENT.keynotePool; return tpl(p[hashStr("kn" + a.id) % p.length], { ten: a.ten }); }
function becomeSteve(a) {
  setAlumState(a, "STEVE");
  gainTT(CONFIG.ALUM.KEYNOTE_TT);
  if (!S.pierceKeynote) { gainUT(CONFIG.ALUM.KEYNOTE_UT, true); S.pierceKeynote = true; }
  S.META.jobsEver = true; S.META.steves++;
  S.endow.bal = r1(S.endow.bal + CONFIG.ALUM.MEGA_GIFT); // mega-gift to quỹ
  a.line = keynoteFor(a);
  news("🍎 " + a.line); bacTamNod();
}
function transition(a, draw, ysg) {
  var rows = [];
  var fsm = CONFIG.ALUM.FSM[a.state] || [];
  var fav = eraFav(a.fs && a.fs.tell); // iter-204 L1: the CURRENT decade's pull on THIS gift (right kid / wrong era)
  for (var i = 0; i < fsm.length; i++) {
    var row = fsm[i], target = row[0], base = row[1], gate = row[2], w = base;
    if (gate === "arrestClock") { w = Math.min(0.95, 0.18 + 0.06 * a.yearsInState); }
    else if (gate) { w = base * (gateFn(gate, a, ysg) ? 1 : 0); if (gate === "coinpull") w *= (a.flags.coinPath && ysg <= 2 ? 4 : 1); }
    // ERA pull: a favored gift (fav>1) is drawn UP toward realize states (kỹ sư/founder); a wrong-era gift (fav<1)
    // is pushed toward waste (thất nghiệp). Distortions stay era-neutral — those are the school's doing (#4).
    if (fav !== 1) { if (CONFIG.ERA_REALIZE[target]) w *= fav; else if (CONFIG.ERA_WASTE[target]) w *= 1 / fav; }
    if (w > 0) rows.push({ t: target, w: w });
  }
  // ERA MOBILITY (iter-204 L1): the decade can move a settled life. The FSM has no downward exit from kỹ sư/founder,
  // so without this a gift realized once can never be un-realized — but "right kid, WRONG era" needs exactly that: a
  // brilliant coder who graduates into a decade with no place for them slides back to a clerk's desk (KY_SU/FOUNDER→
  // LUONG_ON→THAT_NGHIEP), while a favored gift in its golden decade is pulled UP (THAT_NGHIEP→LUONG_ON→KY_SU). Weight
  // scales with how hostile/golden the era is (|fav−1|). Only directed gifts in non-neutral eras (fav≠1) feel it.
  if (fav < 1) { var dn = (a.state === "LUONG_ON") ? "THAT_NGHIEP" : ((a.state === "KY_SU" || a.state === "FOUNDER") ? "LUONG_ON" : null); if (dn) rows.push({ t: dn, w: CONFIG.ALUM.ERA_REGRESS * (1 - fav) }); }
  else if (fav > 1) { var up = (a.state === "THAT_NGHIEP") ? "LUONG_ON" : (a.state === "LUONG_ON" ? "KY_SU" : null); if (up) rows.push({ t: up, w: CONFIG.ALUM.ERA_RISE * (fav - 1) }); }
  // BI_BAT special (FSM empty in data): yearsInState>=2 → escape
  if (a.state === "BI_BAT" && a.yearsInState >= 2) { rows = [{ t: "THAT_NGHIEP", w: 0.9 }, { t: "CA_MAP_COIN", w: 0.1 }]; }
  var sum = 0; for (i = 0; i < rows.length; i++) sum += rows[i].w;
  if (sum > CONFIG.ALUM.ROW_CAP) { var sc = CONFIG.ALUM.ROW_CAP / sum; for (i = 0; i < rows.length; i++) rows[i].w *= sc; sum = CONFIG.ALUM.ROW_CAP; }
  var cum = 0;
  for (i = 0; i < rows.length; i++) {
    cum += rows[i].w;
    if (draw < cum) {
      var to = rows[i].t;
      if (to === "BI_BAT") arrestAlumnus(a);
      else {
        setAlumState(a, to); a.line = "";
        // iter-170: surface the SCATTER — a former student's life out in the world, glimpsed in the feed (the
        // owner's "watch them tản đi khắp nơi" / THESIS marks 1+3: lives become someone, the wide range). THROTTLED
        // to ≤1 per 60 days and DETERMINISTIC (no rnd) so the headless sweep/bot stay byte-identical; glimpsed,
        // not metered (the steady kỹ sư shown as worthy as the founder; only out-in-the-world alumni, ysg≥1).
        if (ysg >= 1 && CONFIG.ALUM.CHIPS[to]) {
          if (a.flags && a.flags.protege && S.totalDays - (S._lastProtegeBeat || 0) >= 30) {
            // iter-171: the kid you FOLLOWED, out in the world — the deepest attachment payoff (mark 2, care by
            // name). Own gentler cooldown + ⭐ (gold in the ticker) so you reliably watch YOUR protégé's life unfold.
            news("⭐ " + a.ten + " — đứa em bạn từng dõi theo — giờ là " + CONFIG.ALUM.CHIPS[to] + ".");
            S._lastProtegeBeat = S.totalDays;
          } else if (S.totalDays - (S._lastAlumLifeBeat || 0) >= 60) {
            news("📰 " + a.ten + " — giờ là " + CONFIG.ALUM.CHIPS[to] + ".");
            S._lastAlumLifeBeat = S.totalDays;
          }
        }
      }
      return;
    }
  }
  // else: stay (residual)
}
function gateFn(key, a, ysg) {
  var craft = aCraft(a), hustle = aHustle(a), hollow = aHollow(a), lua = aLua(a);
  switch (key) {
    case "craft50": return craft >= 50;
    case "craft55": return craft >= 55;
    case "lua3": return lua >= 3;
    case "lua3hustle50": return lua >= 3 && hustle >= 50;
    case "coinpull": return hollow >= 50 && hustle >= 60;
    default: return true;
  }
}
function arrestAlumnus(a) {
  setAlumState(a, "BI_BAT");
  var dmg = r1(CONFIG.ALUM.ARREST(aHollow(a) >= 50 ? 2 : 1, S.tiengTam, Math.max(0, S.year - a.gradYear)));
  S.tiengTam = clamp(r1(S.tiengTam - dmg), 0, 200);
  gainUT(-2, false);
  S.META.arrested++;
  a.line = rpick(CONTENT.alumLines.BI_BAT).replace("{ten}", a.ten);
  news("🚔 Cựu sinh viên " + a.ten + " bị bắt. Tiếng Tăm −" + Math.round(dmg) + ".");
}
function scriptedArrest() {
  for (var i = 0; i < S.alumni.length; i++) {
    var a = S.alumni[i];
    if (a._tpl && a.state !== "BI_BAT") {
      setAlumState(a, "BI_BAT"); a._arrested = true;
      var dmg = r1(CONFIG.ALUM.ARREST(2, S.tiengTam, Math.max(0, S.year - a.gradYear)));
      S.tiengTam = clamp(r1(S.tiengTam - dmg), 0, 200);
      gainUT(-2, false); S.META.arrested++;
      news(CONTENT.arrestTPL + " (" + CONTENT.arrestNote + ")");
      // morality clause cascade
      S.contracts = S.contracts.filter(function (c) { news(tpl(CONTENT.contract.morality, { co: c.co })); return false; });
      return;
    }
  }
}

/* ---------- gifts ---------- */
function queueGift(a, draw) {
  var base = CONFIG.ALUM.GIFT_BASE[a.state]; if (!base) return;
  var p = clamp(base * a.grat / 50, 0, 0.95);
  if (draw < p) {
    var rng = CONFIG.ALUM.GIFT_AMT[a.state] || [0, 0];
    var amt = a.state === "STEVE" ? CONFIG.ALUM.MEGA_GIFT : Math.round(rrange(rng[0], rng[1]) * (1 + S.uyTin / 100));
    S.endow.pending.push({ amt: amt, alumId: a.id, ten: a.ten, vt: a.flags.vt && a.flags.vt.length ? a.flags.vt[0] : null });
    a.gifts += amt;
  }
}
function flushGifts() {
  if (!S.endow.pending.length) {
    // scripted guarantee: by 20/11 of Y2, if zero gifts and ≥1 KY_SU alumnus → force one
    if (S.year >= 2) { for (var i = 0; i < S.alumni.length; i++) if (S.alumni[i].state === "KY_SU") { S.endow.pending.push({ amt: 30, alumId: S.alumni[i].id, ten: S.alumni[i].ten, vt: null }); break; } }
    if (!S.endow.pending.length) return;
  }
  var n = S.endow.pending.length, biggest = null, cashSum = 0, quySum = 0;
  for (var j = 0; j < S.endow.pending.length; j++) {
    var g = S.endow.pending[j];
    if (g.amt >= CONFIG.FUND.GIFT_TO_QUY_MIN) { S.endow.bal = r1(S.endow.bal + g.amt); quySum += g.amt; }
    else { S.cash = r1(S.cash + g.amt); cashSum += g.amt; }
    if (!biggest || g.amt > biggest.amt) biggest = g;
    S.endow.log.push({ t: S.totalDays, gift: g.amt, ten: g.ten });
  }
  S._giftFlush = { n: n, biggest: biggest, quote: (biggest && biggest.vt && CONTENT.giftVt[biggest.vt]) || CONTENT.giftHead }; // never "undefined": fall back to giftHead for any uncovered virtue
  news("🎓 " + n + " phong bì từ cựu sinh viên (" + Math.round(cashSum + quySum) + "tr).");
  bacTamNod();
  S.endow.pending = [];
}

/* ---------- L3 LEGACY (iter 217) — your past school's standout seeds your next run ---------- */
// pickLegacy() — at the decade, the run's most NOTABLE graduate: a real success (flourish≥4) if any, else a dark
// notable (coin-shark / arrested) as a cautionary echo, else the best modest life. Written cross-run by the decade trap.
function legacyRec(a, kind) { return { ten: a.ten, state: a.state, tell: (a.fs && a.fs.tell) || "", schoolName: S.schoolName, year: S.year, kind: kind, flourish: flourishOf(a.state) }; }
function pickLegacy() {
  var al = (S.alumni || []).filter(function (a) { return a && !a._tpl && a.fs; });
  if (!al.length) return null;
  var bright = null; al.forEach(function (a) { if (!bright || flourishOf(a.state) > flourishOf(bright.state) || (flourishOf(a.state) === flourishOf(bright.state) && a.fs.seed > bright.fs.seed)) bright = a; });
  if (bright && flourishOf(bright.state) >= 4) return legacyRec(bright, "bright"); // a Steve / founder / kỹ sư returns to give back
  var dark = null; al.forEach(function (a) { if ((a.state === "BI_BAT" || a.state === "CA_MAP_COIN") && (!dark || a.fs.seed > dark.fs.seed)) dark = a; });
  if (dark) return legacyRec(dark, "dark");              // the run's loudest mark was a scandal → it echoes
  return bright ? legacyRec(bright, "bright") : null;    // a modest success (💼/👷) — still a warm return
}
// seedLegacy() — applied at ui-boot for a NEW game only (freshState stays pure → gate/sweep byte-identical). A bright
// legacy gifts the new quỹ + a warm beat; a dark one starts reputation a touch lower + a wary beat. Sets S.legacy.
function seedLegacy() {
  if (!S || typeof readLegacy !== "function") return;
  var lg = readLegacy(); if (!lg) return;
  S.legacy = lg;
  if (lg.kind === "bright") {
    S.endow.bal = r1(S.endow.bal + CONFIG.LEGACY.BOON_ENDOW);
    // iter-218 (L3 ckpt2): the named figure RETURNS — a successful grad of your last school comes back to TEACH at the
    // new one, free, tenured, grain-matched to their own gift (a returning coder grows coders). The legacy made present.
    if (!S.teachers) S.teachers = [];
    S.teachers.push({ id: nid(), ten: lg.ten, day: 10, dien: 3, luong: 0, trait: "tch", grain: lg.tell || "", bienChe: true, age: 0, legacy: true });
    news("🎓 " + lg.ten + " — cựu sinh viên trường " + lg.schoolName + " của thầy, nay đã thành đạt — quay về DẠY ở trường mới (không lấy lương) và gửi " + CONFIG.LEGACY.BOON_ENDOW + "tr dựng quỹ.");
  } else {
    S.tiengTam = clamp(r1(S.tiengTam - CONFIG.LEGACY.ECHO_TT), 0, 200);
    news("📰 Người ta còn nhớ " + lg.ten + " của trường " + lg.schoolName + " cũ. Tiếng cũ theo thầy sang trường mới — Tiếng Tăm khởi điểm thấp hơn một chút.");
  }
}
if (typeof window !== "undefined" && window.HVS) window.HVS.seedLegacy = seedLegacy; // ui-boot applies the cross-run legacy (engine.js built HVS before alumni.js loaded — augment it, the save.js/admissions.js pattern)
