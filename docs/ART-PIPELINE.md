# Art pipeline — how the campus is drawn (the resume point)

**Status (2026-06):** the *method* is built and proven; the *final art pass* is **deferred** until the
mechanics settle. Art follows mechanics — polishing rooms/props/states now risks painting scenery for a
set that later gets cut, and adding art *later* is near-zero cost (§7). We froze the **how**, not the
**what**. When mechanics are ready, re-open this and use the §7 playbook.

**Taste bar:** Kairosoft *Pocket Academy*. Procedural code-drawn art kept failing it no matter how
palettes/ramps were tuned — that drove the move to real pixel-art packs. Assets won; don't re-litigate.

## 1. The asset stack (zero-cost, commercial-OK)

| Layer | Pack | File(s) | License |
|---|---|---|---|
| World / tiles | **Kenney — Tiny Town** | `assets/tiles/tinytown_tilemap.png` (192×176) | **CC0** — credit optional |
| Characters | **Jephed — 2D Top-Down Pixel Art Characters** | `assets/characters/000.png … 039.png` (40 × 64×128) | free commercial — **credit appreciated** |

License files live beside the art (`KENNEY-LICENSE.txt`, `JEPHED-LICENSE.txt`); `Reference.png` documents
the frame grid. Keep the §8 credits block accurate.

## 2. Grid & scale (the one place art meets layout)

```
CONFIG: TILE=26, GRID_W=15, GRID_H=12  →  canvas 390×312 (mobile gate)
Kenney tile TPX = 16  (drawn NATIVE, tiled across footprints)
Jephed frame    = 20×32 (CW×CH, near-native)
```

Art ripples into layout in exactly one spot: **tile/sprite size vs `CONFIG.TILE`.** Kenney tiles are 16px
but cells are 26px, so ground tiles by raw pixels (not 1 tile = 1 cell) and buildings are *composed* to
fill each room's footprint (§5). Two layouts must keep holding: **mobile 390px** and **desktop
side-by-side** (`@media min-width:940px` in `index.html`).

## 3. Kenney tile addressing

Sheet is 12 cols wide. `tile index = row*12 + col`.

```js
var TPX = 16;
function tileXY(idx){ return [(idx%12)*TPX, ((idx/12)|0)*TPX]; }   // src x,y of a tile
function kTile(ctx, idx, cx, baseY, w, h){ ... }                   // blit centered-x, base at baseY
```

In use (`js/ui.js`): grass `0`, tree `4`, bush `5`. Buildings use 3×3 blocks:

```js
var KBLD = { grey:[[48,49,50],[60,61,62],[72,73,74]],   // [top|mid|base] × [left|mid|right]
             red :[[52,53,54],[64,65,66],[76,77,78]] };
var KENNEY_BLD = { phonghoc:"red", cangtin:"red", lab:"grey", phongmay:"grey", xuong:"grey" };
```

**Finding a new tile index** (no imagemagick/PIL here): bake a labeled tilesheet in-browser — draw the
sheet upscaled with each cell's index painted on it — and read it off. Don't guess; they were wrong first try.

## 4. Loaders & redraw triggers

Two stacked canvases: `#mapStatic` (ground/buildings/props, redrawn **only on `_mapDirty`**) and
`#mapLive` (actors, redrawn **every rAF** by `liveLoop`). That split decides where each loader pokes:

```js
// tiles → static layer → must request a redraw on load (js/ui.js boot):
(function(){ var im=new Image(); im.onload=function(){ TILES=im; S()._mapDirty=true; }; im.src="assets/tiles/tinytown_tilemap.png?v=1"; })();
// characters → live layer → next rAF picks them up, NO _mapDirty needed:
loadChars();  // fills CHARS[0..39], CHARS_N counts loaded; src "assets/characters/000.png?v=1" … 039.png
```

`drawStatic()` paints in passes: ground → path spine → buildings (y-sorted) → `drawProps` →
sun-vignette → seasonal décor.

## 5. The two composers

**`drawRoomKenney(ctx, r)`** — tiles a room's footprint with its 3×3 palette at native 16px:
`cols/rows = max(2, round(pw/16 | ph/16))`, h-centered, base-aligned; edge cells pick top/base +
left/right, interior cells use mid/mid. Falls back to procedural `drawRoom` if the room key isn't in
`KENNEY_BLD` or tiles aren't loaded.

**`drawActor(ctx, a, ts)`** — Jephed blit. Sheet = `a.id % 40`. 3 walk-cols × 4 dir-rows of 20×32 cells,
x-stride 22, y-stride 32, rows = 0 down · 1 left · 2 right · 3 up:

```
idle    → row 0 (front), col 1 (neutral)
walking → row = a.dir<0 ? 1 : 2;  col = sin(ts/150+a.ph)>0 ? 0 : 2   (stride extremes)
blit    → (x-CW/2, y-30+bob), feet ≈ y+2;  cheap fillRect contact shadow (sheets ship none)
```

Markers (selection ring, scholarship star, mentored mortarboard, followed-protégé star+name) draw *on
top* and are art-independent. The sheets only have walk frames in 4 directions — for new gameplay states,
overlay a marker/emote (the mentored-cap pattern), don't expect new poses.

## 6. Golden rules (don't break these)

1. **Procedural fallback always stays.** Every art path is `if (TILES)…else <procedural>` /
   `if (CHARS_N>0)…else <chibi>`. A missing/failed asset must never break the game. `gate.js` and `bot.sh`
   run headless **without** images — green there *proves* the fallback path.
2. **Layer law.** `ui.js → {art, sprites, audio} → engine.js → data.js`, one-directional. Art reads state,
   never writes game numbers — an art change must not touch `engine.js`/`data.js`.
3. **`imageSmoothingEnabled=false`** on every ctx + `image-rendering:pixelated` in CSS — crisp pixels.
4. **Cache-bust** asset URLs with `?v=N`, bump on replacement.

## 7. When you come back — playbook

Match art to final mechanics; each move keeps the fallback intact:

- **New room/building:** add `key:"red"|"grey"` to `KENNEY_BLD`, or a new palette to `KBLD` with its 3×3
  indices. `drawRoomKenney` auto-tiles any footprint.
- **New prop:** find the index (§3 labeled-sheet trick), `kTile(...)` inside `drawProps`, with a fallback.
- **New character look/role:** map by `a.id`/grade/role into a curated subset of the 40 sheets, or overlay
  a marker. (If the final game needs *distinct* per-role art beyond 40 chibis, that's the moment to
  consider a paid/commissioned pack — re-evaluate the taste bar then.)
- **Always re-verify** with `shot.sh` (§8) on **both** mobile and desktop before committing.

## 8. Verify — `shot.sh`

Headless screenshot of the live campus. Waits for `__ui._assetsReady()` (tiles + ≥10 char sheets), seeds a
populated school, settles actors into a period, paints one live frame, captures. Hides the đề-Văn modal.

```bash
./shot.sh /tmp/campus_mobile.png  420 900 2       # mobile full page
./shot.sh /tmp/campus_desktop.png 1280 820 1      # desktop side-by-side
ZOOM=1 ./shot.sh /tmp/campus_zoom.png 1170 936 1  # 3× campus-only blit (inspect sprites)
```

Render recipe (the only headless way — rAF is throttled): `setPeriod(p)` → `_sync(true)` → `_settle(N)` →
`_renderLiveOnce(p)`. Seeding runs **inside** the asset-ready poll, i.e. *after* `boot()` (which fires on
DOMContentLoaded and would reset a pre-boot seed). Companions: `node gate.js`, `./bot.sh`.

**Credits block** (keep in the game's credits/footer):
- Tiles — **Kenney**, *Tiny Town* (CC0) · kenney.nl  *(credit optional)*
- Characters — **Jephed, Game Between The Lines, https://gamebetweenthelines.com/**  *(credit appreciated)*

## 9. Deferred / still procedural

Reads fine against the Kenney tiles, so left as code-art — Kenney-ize only if matching the final game wants
it: **path spine, benches, fountain, lamp posts, cổng (gate) sign, seasonal décor (Tết / June graduation)**.

Art epic commits: phase 1 loader+grass `c774e13` · phase 2 buildings `2199007` · phase 3 props `41ea1b2` ·
phase 4 characters `2b81e46`. Branch `mentors-ledger` (local).
