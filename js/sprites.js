/* js/sprites.js — character sprite bakery (STRUCTURE-epic iter 84, relocated VERBATIM from ui.js to
   complete the art-layer separation begun in art.js iter 57). Pre-bakes a 24×32 volumetric-chibi atlas
   (bake once → blit, fast at 48 actors) + on-demand custom looks. Pure: offscreen canvases only, no game
   state. Depends on window.ART (shade/PX). One-directional: ui.js → SPRITES. window.SPRITES. */
(function () {
  "use strict";
  var shade = ART.shade, PX = ART.PX;
  var GRADE_C = { 1: "#3fb98e", 2: "#4a8fe0", 3: "#f0a838", 4: "#a86fe0" }; // year uniform colours (richer, pop on grass)

  /* === PIXEL-ART v2: pre-baked character atlas (bake once → blit, fast at 48 actors) === */
  // variety axes — students read as individuals, not clones
  var SKINS = [["#f4c79c", "#e2a878"], ["#ecb888", "#d49a66"], ["#cf9a64", "#b07c4c"]]; // [skin, shadow]
  var HAIRSET = [["#3a2a1c", "#5a3f28"], ["#21201f", "#3a3433"], ["#6e4a26", "#8a6336"], ["#a85a3a", "#c4724a"], ["#c9a14e", "#e0bb66"], ["#5b4a6e", "#74608c"]]; // [base, hi]
  var HAIRSTYLE = ["short", "long", "bun"];
  var ACC = ["none", "none", "glasses", "bow", "cap", "none"]; // weighted toward none
  // baked variant list (skin × hair-colour × hair-style × accessory), capped
  var VARIANTS = [];
  (function () { var s = [0, 0, 1, 0, 2, 1, 0, 2, 1, 0, 1, 2], h = [0, 1, 2, 3, 1, 4, 0, 2, 5, 3, 1, 4], y = [0, 1, 0, 2, 1, 0, 2, 1, 0, 1, 2, 0], a = [0, 2, 0, 3, 0, 1, 4, 0, 2, 0, 5, 1]; for (var i = 0; i < 12; i++) VARIANTS.push({ s: s[i], h: h[i], y: y[i], a: a[i] }); })();
  var ATLAS = null; // ATLAS[grade0..3][variant0..11][frame0..1] = offscreen canvas
  function bakeChar(shirt, shirtD, V, frame) {
    // Premium volumetric chibi (24×32). ONE light source upper-left. Every mass uses a 4-step ramp:
    // 1px lit rim (upper-left) -> core midtone -> one-step lower-right shade -> deep terminator.
    // 1px dark outline throughout. Feet sit on the bottom row so the foot point = canvas bottom.
    var sk = SKINS[V.s][0], skD = SKINS[V.s][1], skH = shade(sk, 0.16), skHH = shade(sk, 0.32), skT = shade(sk, -0.22);
    var hair = HAIRSET[V.h][0], hairHi = HAIRSET[V.h][1], hairD = shade(hair, -0.34), style = HAIRSTYLE[V.y], acc = ACC[V.a];
    var shirtH = shade(shirt, 0.30);   // lit rim (upper-left)
    var shirtSh = shade(shirt, -0.18); // one-step lower-right shade
    var shirtT = shade(shirt, -0.34);  // deep terminator at plane changes
    var collar = shade(shirt, -0.20);
    var pant = PX.pants, pantH = shade(PX.pants, 0.26), pantSh = shade(PX.pants, -0.20), pantT = shade(PX.pants, -0.44);
    var shoe = PX.shoe, shoeH = shade(PX.shoe, 0.30);
    var cv = document.createElement("canvas"); cv.width = 24; cv.height = 32;
    var X = cv.getContext("2d"); X.imageSmoothingEnabled = false;
    function R(x, y, w, h, c) { X.fillStyle = c; X.fillRect(x, y, w, h); }
    function P(x, y, c) { X.fillStyle = c; X.fillRect(x, y, 1, 1); }

    // CONTACT SHADOW — soft directional ellipse, grounds the figure on grass
    X.fillStyle = "rgba(20,30,14,.16)"; X.beginPath(); X.ellipse(13, 30.5, 9, 2.6, 0, 0, 6.2832); X.fill();
    X.fillStyle = "rgba(20,30,14,.22)"; X.beginPath(); X.ellipse(12, 30.5, 6.5, 1.8, 0, 0, 6.2832); X.fill();

    // HEAD — x6..17 (12 wide), y1..13
    R(6, 1, 12, 13, PX.out);
    R(7, 2, 10, 11, sk);
    X.clearRect(6, 1, 1, 1); X.clearRect(17, 1, 1, 1); X.clearRect(6, 13, 1, 1); X.clearRect(17, 13, 1, 1);
    P(7, 2, PX.out); P(16, 2, PX.out); P(6, 12, PX.out); P(17, 12, PX.out);
    R(7, 3, 1, 9, skH);             // lit left rim
    R(8, 2, 7, 1, skH);             // lit top rim
    P(8, 3, skHH); P(8, 2, skHH);   // brightest sparkle corner
    R(16, 3, 1, 9, skD);            // shaded right column
    R(14, 11, 3, 1, skD);           // shaded lower-right jaw
    R(8, 12, 8, 1, skT);            // chin terminator (deep)
    P(15, 3, shade(sk, -0.08));

    // HAIR (style-dependent; lit top-left, dark right)
    R(6, 1, 12, 3, hair);
    R(6, 4, 1, 2, hair); R(17, 4, 1, 2, hairD);
    R(7, 1, 9, 1, hairHi);
    P(7, 2, hairHi); P(8, 2, hairHi);
    R(16, 1, 1, 5, hairD);
    if (style === "short") {
      R(6, 4, 2, 1, hair); R(16, 4, 2, 1, hairD);
      P(8, 4, hairHi); P(9, 4, hair); P(14, 4, hairD); P(15, 4, hairD);
      P(11, 4, shade(hair, 0.12));
      P(7, 5, hair); P(16, 5, hairD);
    } else if (style === "long") {
      R(6, 4, 1, 9, hair); R(17, 4, 1, 9, hairD);
      R(7, 4, 1, 2, hair); R(16, 4, 1, 2, hairD);
      P(6, 13, hair); P(17, 13, hairD); P(7, 12, hair); P(16, 12, hairD);
    } else { // bun
      R(10, -1, 4, 2, hair); R(10, -1, 3, 1, hairHi); P(13, 0, hairD);
      R(6, 4, 2, 1, hair); R(16, 4, 2, 1, hairD); P(8, 4, hair); P(15, 4, hairD);
    }

    // FACE
    P(8, 5, hairD); P(9, 5, hairD); P(13, 5, hairD); P(14, 5, hairD);
    R(8, 6, 3, 3, PX.out); R(13, 6, 3, 3, PX.out);
    R(9, 7, 2, 2, "#6a86c8"); R(14, 7, 2, 2, "#6a86c8");
    R(9, 8, 2, 1, "#3a558f"); R(14, 8, 2, 1, "#3a558f");
    P(9, 7, "#ffffff"); P(14, 7, "#ffffff");
    P(10, 8, "#1c2742"); P(15, 8, "#1c2742");
    P(7, 9, "#ef968a"); P(8, 9, "#f4a89a"); P(15, 9, "#ef968a"); P(16, 9, "#f4a89a");
    P(12, 9, shade(sk, -0.16));
    R(10, 11, 4, 1, PX.mouth); P(10, 11, shade(PX.mouth, -0.24)); P(13, 11, shade(PX.mouth, -0.24));
    P(11, 12, "#d27668"); P(12, 12, "#d27668");

    // ACCESSORY
    if (acc === "glasses") {
      R(7, 6, 4, 3, PX.out); R(13, 6, 4, 3, PX.out); R(11, 7, 2, 1, PX.out);
      R(8, 7, 2, 1, "#bfe0ff"); R(14, 7, 2, 1, "#bfe0ff");
      P(8, 7, "#eaf6ff"); P(14, 7, "#eaf6ff");
      P(7, 8, shade("#bfe0ff", -0.2)); P(16, 8, shade("#bfe0ff", -0.2));
    } else if (acc === "bow") {
      R(5, 2, 3, 3, "#f15a7a"); R(5, 2, 1, 3, "#d63f5e"); P(7, 3, "#ff8aa0"); P(6, 3, "#ffb3c2"); P(7, 2, "#ffc4d0");
    } else if (acc === "cap") {
      R(6, 0, 12, 2, "#4a8fe0"); R(7, -1, 9, 1, "#5b9ff0"); R(16, 1, 1, 2, "#3a78c8");
      R(17, 2, 4, 1, "#4a8fe0"); R(17, 3, 4, 1, "#3a78c8");
      P(7, 0, "#7ab4f5"); P(8, 0, "#7ab4f5");
    }

    // NECK
    R(10, 13, 4, 2, PX.out); R(11, 13, 2, 1, sk); R(11, 14, 2, 1, skT);

    // TORSO + SHORT SLEEVES
    R(4, 15, 16, 4, PX.out);
    R(6, 18, 12, 8, PX.out);
    R(7, 16, 10, 9, shirt);
    R(5, 16, 2, 2, shirt);
    R(17, 16, 2, 2, shirt);
    X.clearRect(4, 15, 1, 1); X.clearRect(19, 15, 1, 1);
    P(5, 15, PX.out); P(18, 15, PX.out);
    R(5, 18, 2, 1, shirtT); R(16, 18, 2, 1, shade(shirtT, -0.04));
    R(9, 15, 6, 1, collar); R(10, 16, 4, 1, shade(collar, -0.24));
    P(11, 15, sk); P(12, 15, sk); P(9, 16, collar); P(14, 16, collar);
    R(5, 16, 1, 2, shirtH); R(7, 16, 1, 9, shirtH);
    R(5, 16, 3, 1, shirtH); R(7, 16, 7, 1, shirtH);
    P(5, 16, shade(shirt, 0.42)); P(7, 16, shade(shirt, 0.42));
    R(15, 17, 1, 8, shirtSh);
    R(16, 17, 1, 8, shirtT);
    R(18, 16, 1, 2, shirtSh);
    R(8, 24, 8, 1, shirtT);
    R(13, 21, 2, 3, shirtSh);

    // HANDS
    R(4, 21, 2, 3, PX.out); R(5, 22, 1, 1, sk); P(5, 22, skH);
    R(18, 21, 2, 3, PX.out); R(18, 22, 1, 1, skD);

    // LEGS + SHOES (2 walk frames)
    function leg(lx, top) {
      R(lx, top, 4, 31 - top, PX.out);
      R(lx + 1, top, 2, 30 - top, pant);
      P(lx + 1, top, pantH);
      R(lx + 1, top, 1, 30 - top, shade(pant, 0.10));
      R(lx + 2, top + 1, 1, 29 - top, pantSh);
      R(lx + 1, top, 2, 1, pantT);
    }
    if (frame === 0) {
      leg(7, 26); leg(13, 26);
      R(7, 30, 4, 1, shoe); R(13, 30, 4, 1, shoe);
      P(7, 30, shoeH); P(13, 30, shoeH);
    } else {
      leg(7, 26); leg(13, 25);
      R(7, 29, 4, 1, shoe); R(13, 30, 4, 1, shoe);
      P(7, 29, shoeH); P(13, 30, shoeH);
    }

    return cv;
  }
  function buildAtlas() {
    ATLAS = [];
    for (var g = 0; g < 4; g++) { ATLAS[g] = []; var sh = shade(GRADE_C[g + 1], -0.28); for (var v = 0; v < VARIANTS.length; v++) { ATLAS[g][v] = []; for (var fr = 0; fr < 2; fr++) ATLAS[g][v][fr] = bakeChar(GRADE_C[g + 1], sh, VARIANTS[v], fr); } }
  }
  // player-customized looks (arbitrary skin/hair/style/accessory combos) — baked on demand + cached
  var customCache = {};
  function clampLook(lc) { return { s: ((lc.s % SKINS.length) + SKINS.length) % SKINS.length, h: ((lc.h % HAIRSET.length) + HAIRSET.length) % HAIRSET.length, y: ((lc.y % HAIRSTYLE.length) + HAIRSTYLE.length) % HAIRSTYLE.length, a: ((lc.a % ACC.length) + ACC.length) % ACC.length }; }
  function customSprite(grade, lc, frame) {
    var c = clampLook(lc), key = grade + ":" + c.s + "." + c.h + "." + c.y + "." + c.a + ":" + frame;
    if (!customCache[key]) customCache[key] = bakeChar(GRADE_C[grade], shade(GRADE_C[grade], -0.28), c, frame);
    return customCache[key];
  }
  // the effective look object {s,h,y,a} for a student: their custom override, else their VARIANT
  function effLook(st) { return st.lookC || VARIANTS[(typeof st.look === "number" && st.look >= 0 && st.look < VARIANTS.length) ? st.look : hashId(st.id) % VARIANTS.length]; }
  function hashId(id) { return (Math.imul(id, 2654435761) >>> 0); }

  window.SPRITES = {
    GRADE_C: GRADE_C, SKINS: SKINS, HAIRSET: HAIRSET, HAIRSTYLE: HAIRSTYLE, ACC: ACC, VARIANTS: VARIANTS,
    build: buildAtlas, ready: function () { return !!ATLAS; },
    sprite: function (grade, variantIdx, frame) { return ATLAS[grade - 1][variantIdx][frame]; }, // grade is 1-based
    atlas: function () { return ATLAS; },
    custom: customSprite, clampLook: clampLook, effLook: effLook, hashId: hashId
  };
})();
