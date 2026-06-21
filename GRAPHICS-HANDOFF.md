# GRAPHICS-HANDOFF.md — what the graphics pass inherits

> **Purpose.** The gameplay-first phase develops the *game* with art FROZEN, so that when it exits the graphics pass
> knows *exactly* what it's dressing. This is that map: every player-facing surface, its content status (the writing is
> done and verified this session), and what the graphics pass must visualize. Living doc — extend as surfaces change.
> **Status: the exit gate is measurably met (a/b/c) — only owner-confirm (d) is pending.** See ROADMAP banner.

## The law the graphics pass must not break
- **The narrative content is FINAL — do not rewrite it.** Every player-facing string was swept and verified this
  session (capstone × 3 branches, graduation, ticker, events, modals, contracts). The graphics pass styles the *frame*,
  never the words. Tone law: no sarcasm at the education Ministry (Bộ); satire stays on the system/cram-culture. Details
  stay real to a VN school (quạt trần / trống trường, never a "chuông").
- **The open-question law holds in pixels too** — the capstone must still CUT OFF ("Tôi—"), never resolve; no surface
  may render a verdict/score on the đề-Văn.
- **Decoupling, in reverse:** where gameplay shipped as text/placeholder (below), the graphics pass BACKFILLS the visual
  — it does not cut the feature to fit today's art.

## Player-facing surfaces (15) — content status + what the graphics pass visualizes
| surface (`js/ui.js`) | what it is | content status | graphics-pass note |
|---|---|---|---|
| `renderHUD` | top bar: cash/TT/UT/TC, year, **era** | done | the era needs a real visual treatment (a decade indicator / period skin) — today it's a text label |
| `renderPanel` | campus + roster view | done (frozen art) | the existing render; the LATTICE adds nothing it can't already draw |
| `showIntro` | opening / đề-Văn | done | the đề-Văn moment wants weight (the nation's question) |
| `showAdmit` | admissions: cutoff/quota/pool | done | the pool + cutoff dial is the core decision UI |
| `showJunePolicy` → `showJuneResults` | graduation policy then the cohort's fates | **upgraded iter-227** — each grad now a distinct gift-specific line | the results screen is a key emotional beat (the cohort scatters) — deserves real layout |
| `showEvent` | the dilemma modals | **verified clean iter-229**, now **era-gated** (`minEra`) | era-flavored framing would help each decade feel distinct |
| `showContract` | corporate sponsorship deals | verified clean | — |
| `showGift` | an alumnus gives back | done | the legacy loop's warm beat |
| `showAlumnus` | one graduate's life detail | done | the gift-specific lives live here |
| `showInspectStudent` / `showInspectRoom` | inspect popovers | done (frozen art) | — |
| `buildEssay` / `essayDraft` (`js/epilogue.js`; decade-capstone trigger in `ui.js`) | the capstone "Mười năm sau" essay | **swept + polished iter-222/224/225/226** — moving on all 3 branches | THE marquee artifact — the essay deserves the most care in the graphics pass (typography, pacing, the crossed-out lines, the three ledgers) |
| `showDedication` | dedicate the school to a Pantheon educator | done | reverent framing (Pantheon tone law) |
| `showMeterHelp` | meter explainer | done | — |
| ticker (`news`) | the in-play feed | **de-spammed iter-228**; era-shift 🕰️ beats | the 🕰️ decade-turn beat could be a real transition moment |

## Deferred to the graphics pass (gameplay designed, presentation pending — the decoupling backfill)
- **Archetype-select start screen.** The four archetypes (tinh_le / que_ngheo / lo_thanhpho / truong_nghe) are fully
  playable via `?arch=` and the Lab; they need a real PICK screen (each archetype's blurb/đề are authored in
  `CONFIG.ARCHETYPES`). Presentation-heavy → graphics pass.
- **Progression / unlock rungs.** Legacy (cross-run seeding) is built and live; the "unlock harder archetypes / longer
  era-chains" ladder is a UI shell over already-working systems. Graphics pass.
- **Era period-skins.** Each decade re-weights the sim + fires a shift beat; a visual decade identity (palette/props per
  era) is a pure graphics-pass enrichment over data that already exists (`CONFIG.ERAS`).

## What is DONE underneath (so the graphics pass can trust it)
The full LATTICE — ERAS (L1) × DEMOGRAPHIC+GEOGRAPHIC archetypes (L2) × the deepened person-sim × LEGACY (L3) — plus the
narrative spine (gift-specific lives → annual letters → a capstone that re-reads them, moving on every branch). Verified
HEADLESS: sweep 0 bad flags across archetypes×eras×origins, gate byte-identical replay, bot no-crash, lives.sh reads true.
