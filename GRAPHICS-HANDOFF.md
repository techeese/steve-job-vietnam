# GRAPHICS-HANDOFF.md — what the graphics pass inherits

The gameplay-first phase develops the *game* with art FROZEN, so when it exits the graphics pass knows
*exactly* what it's dressing. This is that map: every player-facing surface, its content status, and what
the graphics pass must visualize. Living doc — extend as surfaces change.
**Status: the exit gate is measurably met (a/b/c); only owner-confirm (d) is pending.** See ROADMAP banner.

## The law the graphics pass must not break
- **The narrative content is FINAL — do not rewrite it.** Every player-facing string was swept + verified
  (capstone × 3 branches, graduation, ticker, events, modals, contracts). The graphics pass styles the
  *frame*, never the words. Tone law: no sarcasm at the Ministry (Bộ); satire stays on the system/cram
  culture; details stay real to a VN school (quạt trần / trống trường, never a "chuông").
- **The open-question law holds in pixels too** — the capstone must still CUT OFF ("Tôi—"), never resolve;
  no surface may render a verdict/score on the đề-Văn.
- **Backfill, don't cut.** Where gameplay shipped as text/placeholder, the graphics pass BACKFILLS the
  visual — it does not cut the feature to fit today's art.

## Player-facing surfaces (`js/ui.js`) — content status + what to visualize
| surface | what it is | content | graphics-pass note |
|---|---|---|---|
| `renderHUD` | top bar: cash/TT/UT/TC, year, **era** | done | era wants a real visual treatment (decade indicator / period skin); today a text label |
| `renderPanel` | campus + roster view | done (frozen art) | the existing render |
| `showIntro` | opening / đề-Văn | done | the đề-Văn moment wants weight (the nation's question) |
| `showAdmit` | admissions: cutoff/quota/pool | done | the pool + cutoff dial is the core decision UI |
| `showJunePolicy`→`showJuneResults` | grad policy then the cohort's fates | gift-specific lines (iter-227) | a key emotional beat (the cohort scatters) — deserves real layout |
| `showEvent` | dilemma modals | clean, era-gated (`minEra`) | era-flavored framing per decade |
| `showContract` | corporate sponsorship deals | clean | — |
| `showGift` / `showAlumnus` | an alumnus gives back / one life detail | done | the legacy loop's warm beat; gift-specific lives |
| `showInspectStudent` / `showInspectRoom` | inspect popovers | done (frozen art) | — |
| `buildEssay` / `essayDraft` (`js/epilogue.js`) | the "Mười năm sau" capstone essay | swept + polished, moving on all 3 branches | THE marquee artifact — most care here (typography, pacing, crossed-out lines, three ledgers) |
| `showDedication` | dedicate school to a Pantheon educator | done | reverent framing (Pantheon tone law) |
| `showMeterHelp` | meter explainer | done | — |
| ticker (`news`) | in-play feed | de-spammed, era-shift 🕰️ beats | the 🕰️ decade-turn could be a real transition moment |

## Deferred to the graphics pass (gameplay designed, presentation pending)
- **Archetype-select start screen.** The four archetypes (tinh_le / que_ngheo / lo_thanhpho / truong_nghe)
  are fully playable via `?arch=` and the Lab; they need a real PICK screen (blurbs/đề authored in
  `CONFIG.ARCHETYPES`).
- **Progression / unlock rungs.** Legacy (cross-run seeding) is live; the "unlock harder archetypes / longer
  era-chains" ladder is a UI shell over working systems.
- **Era period-skins.** Each decade re-weights the sim + fires a shift beat; a visual decade identity
  (palette/props per era) is pure enrichment over data that exists (`CONFIG.ERAS`).

## What is DONE underneath (so the graphics pass can trust it)
The full LATTICE — ERAS × demographic/geographic archetypes × the deepened person-sim × LEGACY — plus the
narrative spine (gift-specific lives → annual letters → a capstone that re-reads them, moving on every
branch). Verified HEADLESS: sweep 0 bad flags across archetypes×eras×origins, gate byte-identical replay,
bot no-crash, lives.sh reads true.
