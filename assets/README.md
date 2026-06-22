# Art assets — DETACHED (procedural fallback is the current look)

The borrowed real-pixel-art layer (Kenney *Tiny Town* tiles + 40 Jephed chibi characters) drifted from the
evolved game and was **detached** — moved to **`assets/_parked/`** — so the game renders on its **procedural
base** (`art.js` rooms/campus + `sprites.js` chibi bakery), the look it shipped on for ~270 iterations. This
is the clean placeholder until the one-pass graphics phase picks **curated** art.

**Re-adding art later is drop-in** — the loader/draw hooks were KEPT as the swap slot:
- **characters:** drop 40 sheets `000–039.png` (idle + 4-dir walk, 20×32) back into `assets/characters/` →
  `loadChars()` (ui.js) picks them up, `drawActor`'s `if(CHARS_N>0)` branch takes over.
- **tiles:** drop a 16×16 tilemap back to `assets/tiles/tinytown_tilemap.png` → `TILES` loads, the
  `drawRoomKenney`/tile branches take over (gardens stay procedural).

What's parked (re-addable, with licenses): `assets/_parked/characters/` (Jephed + JEPHED-LICENSE) and
`assets/_parked/tiles/` (Kenney tilemap + KENNEY-LICENSE). Full pipeline: [`docs/ART-PIPELINE.md`](../docs/ART-PIPELINE.md).
Surfaces the art pass must cover: [`GRAPHICS-HANDOFF.md`](../GRAPHICS-HANDOFF.md).
