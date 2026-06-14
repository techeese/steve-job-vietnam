# Art assets — Mentor's Ledger art epic (zero-cost stack)

The game is moving from procedural code-drawn art → real pixel-art sprites/tiles, to reach the
"cute game" / Pocket Academy bar. Drop downloaded asset files in here; the render layer
(`art.js`/`sprites.js` + a small loader) blits them. **Engine/sim/soul untouched**, and a
**procedural fallback stays** so a missing file never breaks the game.

## Chosen packs (zero-cost, commercial-OK)
- **Characters →** `assets/characters/` — **Jephed "2D Top-Down Pixel Art Characters"**
  (free for commercial use; credit appreciated: *"Jephed, Game Between The Lines"*).
  40 chibi characters, idle + 4-direction walk, 20×32 sprites.  https://gamebetweenthelines.itch.io/top-down-pixel-art-characters
- **World / tiles →** `assets/tiles/` — **<owner's pick>** (browse + choose by look):
  Kenney "Tiny Town" (CC0, 16×16) · Cainos "Pixel Art Top Down" (free, 32×32) · or a free modern town/school pack.

## Where to drop the files
- `assets/characters/` → the character sprite-sheet PNG(s).
- `assets/tiles/` → the tileset / building / prop PNG(s) (+ any atlas/.tsx if the pack ships one).
Keep original filenames — I'll write the atlas mapping in code to match.

## Credits (keep this list accurate — some licenses appreciate/require attribution)
- Characters: **Jephed, Game Between The Lines, https://gamebetweenthelines.com/** — free commercial, credit appreciated (this is the exact string the license asks for).
- Tiles: _<pack · author · license — fill in once chosen>_

## Integration plan (what I do once the files are here)
1. **Loader** — preload the PNGs at boot, expose to the render layer.
2. **Render** — blit tiles for ground/buildings/props; blit character frames for the walking actors.
3. **Scale** — pack tiles are 16–32px; adapt `CONFIG.TILE` / sprite size (the ONE place art ripples
   into layout). Keep the 390px mobile gate AND the desktop side-by-side layout.
4. **Fallback** — if an asset is missing, fall back to the current procedural drawers. Never break.
