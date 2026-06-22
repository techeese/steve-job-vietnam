# Art assets — real pixel-art stack (zero-cost, commercial-OK)

Real sprites/tiles replacing the procedural code-art to reach the Pocket Academy "cute game" bar. The
render layer (`art.js`/`sprites.js` + a small loader) blits them; **engine/sim/soul stay untouched** and a
**procedural fallback** means a missing file never breaks the game. Chosen packs:
**characters →** `assets/characters/` — Jephed *"2D Top-Down Pixel Art Characters"* (40 chibis, idle +
4-dir walk, 20×32; free commercial, credit *"Jephed, Game Between The Lines, https://gamebetweenthelines.com/"*);
**world/tiles →** `assets/tiles/` — Kenney *Tiny Town* (CC0, 16×16, credit optional). Keep original
filenames — the atlas mapping in code matches them. Full pipeline + integration details:
[`docs/ART-PIPELINE.md`](../docs/ART-PIPELINE.md).
