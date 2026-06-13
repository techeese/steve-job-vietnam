# Changelog

## 2026-06-13 — Tooling: the living campus is now screenshot-verifiable (loop iter 53)
- Closes a real verification gap behind the game's #1 priority. The walking students + activity
  animations draw only in the rAF `liveLoop`, which headless Chrome throttles — so every screenshot
  showed an **empty map**, and "people doing things" (the soul of the game) shipped on hope. Split
  `liveLoop` into `stepLive` (advance) + `drawLive` (paint) — behavior-neutral — and added a
  `__ui._renderLiveOnce(period)` test hook that paints ONE live frame on demand. Now a headless
  harness can do `setPeriod → _sync → _settle → _renderLiveOnce → screenshot` and actually SEE the
  campus full of students. Verified: a 390px shot now renders 15 detailed pixel-art students around
  Phòng học / Xưởng / sân (recess football, benches) where before it was bare grass. No gameplay
  change; gates green. The improve-steve skill gained the recipe + a landmine so every future
  campus-liveliness iteration is proven, not hoped.

## 2026-06-13 — Khoa P4b: trưởng-khoa (a teacher head boosts a khoa, loop iter 52)
- More majors-depth (the owner's "add more depth to the mechanics"). You can now **assign a teacher
  as trưởng khoa** to any unlocked khoa, from the "Khoa / Chuyên ngành" card (a "Phân công" / "Đổi"
  button per khoa). A headed khoa **thrives at one fewer student** (synergy bar drops 4→3) **and grows
  faster** (+`HEAD_BONUS` 0.12/day on top of `SYN_GROW`). One teacher heads at most one khoa — so with a
  small faculty you must *choose* which khoa to back (decision density, not a free buff). Verified via a
  node probe (3-SV khoa: synergy OFF unheaded vs ON + 12.6 tn/30d headed); save-compat holds (`khoaHead`
  defaulted in freshState + pruned in sanitize); gates green, sweep thesis intact; 390px-verified.
  P4 remaining: khoa-vs-khoa rivalry/events, a dedicated Khoa screen if the card outgrows itself.

## 2026-06-13 — Khoa P4a: cross-khoa synergy (interdisciplinary → 🍎, loop iter 51)
- First slice of the majors-depth phase the owner asked for. When **two or more khoas are thriving**
  (each ≥4 students with synergy on), their members **cross-pollinate**: each gets a bonus to a second
  stat (coders pick up Sáng tạo, designers pick up Tay nghề, founders pick up Sáng tạo). So a *focused
  interdisciplinary* school — tinkerers in Lập trình **and** dreamers in Thiết kế, both rooms built —
  grows dual-skilled students (high Tay nghề **and** Sáng tạo), which is exactly the profile that
  reaches 🍎. A "⚡⚡ Liên khoa" line lights up in the Khoa card when it's active. Verified (+10.3 vs
  +1.5 secondary-stat gain with two khoas vs one); sweep confirms it rewards *focus* without
  over-producing Steves in unfocused play (thesis holds); gates green. More P4 depth (khoa head,
  rivalries) still queued.

## 2026-06-13 — Khoa/Majors P2 (the UI) + Trần Phi Lợi hidden until arrested (loop iter 50)
- **P2 — the Khoa system is now visible.** New "Khoa / Chuyên ngành" card in the **Sinh viên** tab:
  each khoa shows its icon/name, whether it's unlocked (or "🔒 Xây [building] để mở"), member count,
  synergy status (⚡ active vs "N/4 để cộng hưởng"), and the destiny it leans toward (👷 kỹ sư /
  🍎 sáng tạo / 🪙 cá mập coin), plus an "Đại cương" line for unaffiliated students. The student
  **inspect card** now shows a gold khoa chip. Verified at 390px: locked→unlocked transition, the
  prodigy appears, counts correct. (P3 balance was already confirmed clean in iter 49; P4 depth next.)
- **Fix (owner: "why Trần Phi Lợi appears too soon?"):** the founder's old cram-school star is seeded
  for his scripted Y2-M3 arrest, but he was showing in the Cựu SV book from Year 1 — before the school
  has any real graduate. He's not THIS school's alumnus; now he's **hidden from the Sổ (and the school
  record) until he's actually arrested** ("lên báo"), matching the intro's "sắp lên báo". Gates green.

## 2026-06-13 — Khoa/Majors system P1: the engine (loop iter 49)
- First phase of the owner-requested majors system (plan in ROADMAP, owner-approved). Three khoas,
  each unlocked by a building and steering a destiny: 💻 Lập trình (Phòng Máy → Tay nghề → kỹ-sư),
  🎨 Thiết kế Chế tạo (Xưởng → Sáng tạo → Steve), 🚀 Khởi nghiệp/Sống Ảo (Lab → Cá mập → the coin
  trap). Students **auto-join** the khoa matching their *tell* once its building exists (else Đại
  cương). A khoa with ≥4 students gets a **synergy** bonus (+0.3/day on its stat) — so a *focused*
  school out-develops a scattered one. Building a khoa's room the first time opens it and pulls in a
  **prodigy "tuyển thẳng"** (the "talent unlocks with the major" beat), with a news line. Verified by
  simulation (auto-join, prodigy enroll, synergy A/B = +21 vs +3 tn), and the sweep confirms the
  craft→🍎 / cram→văn-mẫu thesis still holds (synergy reinforces focus, doesn't break it). Gates green.
  **Next: P2 (the Khoa UI — a card in Sinh viên + a khoa chip in the inspect card).**

## 2026-06-13 — Buildings upgrade in place + gentle SFX (loop iter 48)
- **Owner clarification ("buy more but show 1 — consider it upgrading"):** buildings are no longer
  one-per-type. Buying the same building again now **upgrades it in place** — still one on the map
  (no clutter), now with a gold Lv pip badge, up to Lv3. Each level scales the effect (Căng tin
  +1 Mood/level, Lab +0.5 Tiếng Tăm/level, extra Phòng học eases crowding) and costs a flat upgrade
  fee (a small money sink too). The build menu shows "Xây" → "Nâng Lv2/3" → "Tối đa". Verified:
  3 buys of one room = 1 on the map at Lv3, 4th rejected, effects scale; gates green, sweep clean.
- **Gentle SFX** (audio, untouched since iter 3): opt-in (🎵 toggle) musical cues in the score's
  timbre — a perfect-fifth on build, a soft chime on upgrade/dedication, a bright arpeggio on
  milestone/tier-up, a warm chord at graduation. Soft and short; no-ops when sound is off.

## 2026-06-13 — Three more moral-choice events (loop iter 47)
- A pacing check confirmed the early game is well-paced (7–13 events/year + yearly admissions +
  milestones + graduations from ~Y4), but with ~11 events the deck repeats. Added a recurring moral
  deck for variety + the satire's soul: 📉 a ranking site drops you to the bottom and a "PR expert"
  sells a 15tr rank-pumping package (buy hype +mầm-phốt vs let điểm chuẩn speak); 😵 a student burns
  out from grade pressure (push them for +Vẹt/−Mood vs give them a week off); 📑 a Năm-4's đồ-án is a
  line-for-line copy of an open-source project (cover it up +Vẹt/+mầm-phốt vs make them redo it for
  real skill +Uy Tín). New `hasNam4` event targeting; all six branches verified; gates green; sweep clean.

## 2026-06-13 — Campus glow-up gets a moment (loop iter 46)
- The campus-tier upgrade (iter 45) happened silently — you'd build your 3rd room and the grounds
  quietly got prettier without knowing why. Now reaching a new prestige tier fires a celebratory
  toast ("🌿 Sân trường gọn gàng hơn…" at tier 1, "🏛️ Trường khang trang hẳn…" at tier 2) and an
  immediate repaint, so the glow-up reads as an earned milestone. Tracked in `META.campusTier`
  (once per tier, persists across reloads). Verified the 0→1→2 progression fires on cue; gates green.

## 2026-06-13 — Campus glow-up: visuals upgrade as the school grows (owner #2, loop iter 45)
- The owner's "when we reach high enough value, the school should look cleaner" idea. Added a
  monotonic campus-prestige tier (0 → 2): **tier 1 (established)** once you've built out ≥3 rooms —
  brighter, more manicured grass (fewer weeds, mow stripes) and tidy stone edging on the paths;
  **tier 2 (prestigious)** once you've raised a memorial garden / produced a Steve / graduated ≥20 —
  the dirt paths become a light **stone-paved plaza** and warm **lamp posts** flank the cổng. All in
  the static layer + safe zones (paths/grass/gate never collide with buildings); monotonic so the
  upgraded look never flickers back. Verified the tier-0 dirt look vs the tier-2 paved look; gates green.

## 2026-06-13 — Auto-update + one-of-each + no double-tap-zoom + protégé payoff (loop iter 44)
- **Auto-update (owner: "do something so I can see changes each ship"):** on load the page now fetches
  a cache-busted fresh index.html, reads the live build, and if it's newer than what's running, hops
  to it via a `?b=<build>` URL — so a plain refresh always lands on the latest deploy past GitHub
  Pages' 10-min index.html cache. Guarded (sessionStorage per build) against reload loops.
- **One of each building (owner: "x2 makes the map crowded, maybe only 1"):** the standard rooms are
  now `once` — building a second is rejected and built rooms drop out of the build menu, so the campus
  stays a tidy predefined-style layout (one Phòng học, one Lab, …). Pairs with auto-placement.
- **No more double-tap zoom (owner):** `touch-action: manipulation` everywhere — iOS ignores
  `user-scalable=no`, so double-tapping the map was zooming the page; now it doesn't (scroll kept).
- **Protégé payoff:** when the student you're following (iter 43) graduates, their result is spotlit
  at the top of the June ceremony with a ⭐ and a news line ("em bạn dõi theo từ ngày đầu — tốt
  nghiệp: …"), and the follow clears. Closes the follow-a-kid emotional loop. All verified; gates green.
- *Queued (owner):* upgraded campus visuals once the school reaches a high enough value (a cleaner,
  fancier look as a prestige tier) — next iteration.

## 2026-06-13 — Follow a student (your protégé, loop iter 43)
- Serving the north-star ("the characters… doing stuff you like to see"): a student's inspect card now
  has a ☆/⭐ **follow** toggle. Mark one as your protégé and they get a persistent gold star bobbing
  over their head on the map — so among 40 kids you can pick *one* and watch them from nervous tân SV
  through the years to whatever they become, without it spoiling the June reveal. New `META.favId`;
  the marker reuses the verified pixel-overhead pattern; toggling re-syncs the actor flag live.
  Verified the toggle sets/clears state and the button reflects it; gates green. *Follow-up:* a
  payoff line at graduation when your followed student walks out and becomes a kỹ-sư / văn-mẫu / 🍎.

## 2026-06-13 — Clock auto-starts after the intro (onboarding, loop iter 42)
- The game booted **paused** (speed 0) with no cue to press play, so a first-timer could build their
  Phòng học, see the "wait for tháng 7" goal, and then watch nothing happen because the clock wasn't
  running. Now dismissing the intro auto-starts the clock at 1× (only when it was paused, i.e. a
  fresh session — reloads keep your saved speed), and the 1× button lights up so it's clear time is
  flowing. Closes the "nothing happens after I build" gap in the from-nothing onboarding. Verified
  boot=paused → intro-dismiss → 1× active; gates green.

## 2026-06-13 — Buy → it just appears: auto-placement (owner UX, loop iter 41)
- Owner hit the build flow cold ("How should I touch?") — tapping a build button entered a manual
  "placing" mode whose only cue was a tiny bottom strip, so it wasn't clear you had to then tap the
  map. Per the owner's own idea ("predefined layout… when we bought something it just appear"),
  removed manual placement entirely: tapping a building (or a memorial garden) in the build menu now
  **auto-places it** in the next tidy spot — reading-order scan, inside a 1-tile border, off the
  central path — and briefly highlights where it landed. New engine `autoPlace()` (with a path-avoiding
  fallback); the build menu gained a "phòng tự hiện ra trong khuôn viên" hint. Verified: 9 mixed
  builds land with 0 overlaps and 0 on the path, a real button-click places a room, gates green.

## 2026-06-13 — Maintenance sprint + flow reflection (loop iter 40)
- No new feature — a health pass after a 5-iteration feature run (tap polish, June décor, cache fix,
  decade capstone, reformer gardens). Verified the integrated whole: `sweep.js` clean (pluralism
  holds — cram→văn-mẫu, craft→kỹ-sư; only the known money-inflation flag remains); a 13-game-year
  all-systems playthrough (4 rooms + gardens, multiple cohorts, graduations, save/load on the new v3
  key) ran with **no JS errors** and ~33ms/run perf; the ops + Trường panels pass the 390px mobile
  audit (build grid, 5-figure dedication section, build stamp, reset all render clean); the seasonal
  June carpet confirmed on the live map. **No regressions found.** Flow reflection recorded in ROADMAP:
  40 iters shipped, complete arc from empty lot to decade capstone, `js/ui.js` (1508 lines) is the
  standing structural debt (art.js extraction still queued).

## 2026-06-13 — Two more reformers to honour (loop iter 39)
- Extended the memorial gardens with the two figures whose lives most directly *are* this game's
  argument: **Nguyễn Trường Tộ** (dâng điều trần đòi dạy thực học — toán, máy móc, ngoại ngữ —
  giữa thời chỉ học để thi; the court shelved it, and a century on we're still debating exactly
  what he wrote) and **Chu Văn An** (treo ấn về quê dạy học rather than serve a court that ignored
  his petition to behead seven corrupt officials). Both are one-time escalating builds (450/550tr,
  +6 Uy Tín) with their own dedication reflection — a `GARDEN_FIGURES` map decoupled from the
  scholarship Pantheon. Now five reformers can be honoured (1750tr of late-game cash sink + a
  "build the whole grove" goal). Verified build/+Uy Tín/lines/once-gate/render; gates green.

## 2026-06-13 — "Mười năm sau" — the decade capstone (loop iter 38)
- `RUN_CAP_YEARS: 12` had been defined but never used — the game had no ending or payoff, it just
  trailed off. Now when the school reaches its 12th year, the reflective epilogue essay (previously
  pull-only) auto-fires once as a **"Mười năm sau · Lễ Bế Giảng"** capstone: the headmaster looks
  back across the decade, the essay written in the faces that passed through — the destiny tally,
  the cast, the ledger, the branch-voice verdict, the đề still hanging. It defers politely under any
  gameplay modal (June/admissions/event) and shows once (META.decadeShown); the school keeps running
  after (sandbox). Gives a full playthrough a philosophical climax. Verified: arms exactly at year 12,
  fires on a clear stage with the "Mười năm sau" framing, doesn't re-fire; gates green.

## 2026-06-13 — "Still the same after many versions" — cache/save fix (loop iter 37)
- Owner reported the live site looked unchanged across many builds. Diagnosed: deployment was always
  correct (live `?v=` matched HEAD), but two things stacked — (1) GitHub Pages serves index.html with
  `Cache-Control: max-age=600`, so browsers held a stale index.html (old `?v=` → old JS); (2) the old
  localStorage save loaded the pre-reframe 42-student school, hiding the start-from-nothing boot even
  when code did update (confirmed by the owner's screenshot: new 3D buildings + milestone banner, but
  42 SV). Fixes: **bumped SAVE_KEY v2→v3** so the incompatible old save is retired and the from-nothing
  boot shows automatically (one-time correction for the iter-24 reframe); **cache-control meta tags**
  on index.html to push browsers to revalidate the entry HTML; and a **visible build stamp** (read
  from ui.js's own `?v=`) in the intro footer + Trường tab, with a "your save is from an older build"
  hint — so it's always clear what version is actually running. Gates green.

## 2026-06-13 — Graduation day dresses the campus (loop iter 36)
- The emotional climax — June graduation — had no visual occasion (Tết did, via iter 31's seasonal
  hook). Now Tháng 6 dresses the campus for Lễ Tốt Nghiệp: a gold-trimmed **red carpet** down the
  central path (the procession route to the cổng — pairs with the graduation walk-out), **tossed
  mortarboard caps** at the top (the signature graduation image), and academic blue/gold bunting.
  Reuses `drawSeason()`; distinct look from Tết. Verified it shows in month 6 and is gated off
  otherwise; gates green.
- Also corrected an iter-34 audit note: the "Uy Tín erosion" I flagged is **not a bug** — the sweep
  shows UT is a healthy moral meter (honest school ~43, cram ~18); my audit's UT=1 was one harsh
  cram endpoint. Gardens' one-time +Uy Tín is left as-is (you can't monument away how you run a school).

## 2026-06-13 — Mobile tap polish + reset button (loop iter 35)
- Following up the owner's "map selection still not clear" across all three dimensions, not just the
  visual marker (iter 34): (1) **tap ripple** — every tap now spawns a brief expanding gold ring at
  the touch point, so a tap visibly registers (no hover on mobile); (2) **more forgiving targets** —
  the open-ground student hit radius went 11→14px and the in-room radius 7→9px, so imprecise finger
  taps land (the new on-map marker confirms the hit, so a generous radius is safe). Together with the
  iter-34 selection marker, tapping the world now feels responsive and unambiguous on a phone.
- **Reset button** (owner request — "reset to reload the game to the latest version to test"): the
  Trường tab now has a "🔄 Chơi lại từ đầu (xoá lưu)" button with a confirm modal that wipes the
  localStorage save and reloads, so the latest build always shows from a clean start-from-nothing
  boot (no stale save hiding new changes). Guarded with a `resetting` flag so the 4-second autosave
  and the visibility-hide autosave can't re-write the save between the wipe and the reload.
  Verified the button + confirm flow render; gates green.

## 2026-06-13 — On-map selection marker + maintenance audit (loop iter 34)
- **Owner feedback: "map selection on mobile still not clear."** Tapping worked, but nothing on the
  map showed *what* you'd selected — the inspect card just appeared at the bottom. Added a clear,
  pulsing selection marker: a tapped student gets a gold feet-ring + a bobbing overhead pointer; a
  tapped room gets gold corner brackets. Selection tracks every tap and clears on dismiss, so on a
  small phone screen it's now unmistakable which student/room the card refers to. Verified the state
  wiring (room→bracket, student→pointer, hide→clear) and the bracket render; gates green.
- **Maintenance sprint** (~5th-iter cadence): 11-game-year playthrough exercising all systems
  (gardens, events, Tết, văn-mẫu, walk-in/out) ran clean — no JS errors, save/load solid, sim 28ms
  (no perf issue). Noted for follow-up: Uy Tín erodes to ~1 over a long run despite garden boosts
  (a decay-balance item), and the late-game money-inflation sweep flag persists (S4 spend channels).

## 2026-06-13 — Memorial gardens: honour a real educator (loop iter 33)
- The late game had no aspiration once the founding milestones were done, and the philosophical
  core (the owner's emphasis: "the player's own version of the answer") lived only in the epilogue.
  New: buildable **Vườn Tưởng Niệm** memorial gardens honouring three real Vietnamese educators —
  Trần Đại Nghĩa (made tools from scarcity), Tạ Quang Bửu (self-taught, opened the world), Hồ Xuân
  Hương (wrote in her *own* voice in an age of borrowed templates — literally the văn-mẫu thesis).
  Each is a one-time, escalating-cost build (150/250/350tr) that grants a full +5 Uy Tín (pierces
  the yearly cap — it's a deliberate, paid honour) and opens a reflective dedication modal placing
  the school's question ("how do we get a Steve Jobs Việt Nam?") beside someone who answered it
  with their life. Renders as a tended lawn + stone stele on the campus. Reuses the Pantheon
  content (the lines already existed as scholarship flavour) and the build system. A late-game
  cash sink with a soul + a collectible prestige goal. Mechanics verified (once-gate, affordability,
  +Uy Tín, philosophical line); gates green.

## 2026-06-13 — Founding-era event deck + structure review (loop iter 32)
- The from-nothing build-up years were event-sparse (most event predicates need năm-4 students or a
  populated school). Added a 3-event founding deck (pred `founding`: năm ≤ 3, ≥1 student), each a
  moral choice about the young school's identity: 👀 a parent inspects the bare campus (oversell for
  +Tiếng Tăm +mầm-phốt vs honesty for +Uy Tín); 📖 the lone overworked teacher suggests "dạy tủ"
  (school-wide +KT+Vẹt−ST cram vs +TN+Mood real teaching); 💸 an angel investor pays 30tr to rename
  the school (sell the name for cash/−Uy Tín vs keep it). All six branches verified for correct
  fx; gates green; sweep balance unaffected.
- **Code-structure review** (owner directive, ~every 10th iter): verdict logged in ROADMAP —
  layering still clean after 12 feature iters; ui.js (1334) is the growing hotspot; the chunked
  art.js extraction stays queued for an owner-OK'd invisible iteration (shared-helper coupling noted).

## 2026-06-13 — Tết comes to campus (seasonal décor, loop iter 31)
- The campus looked identical year-round; the tetBeat mechanic (Tháng 2 mood boost) had no
  visual presence. Now Tháng 1–2 decks the grounds for Tết: a red/gold/teal bunting garland
  strung across the top, and red lanterns + mai (yellow) / đào (pink) blossom pots flanking the
  cổng. All in safe zones (top strip + the always-clear gate) so no player building is disturbed.
  Driven by a `drawSeason()` pass in the static layer; `monthRollover` now flags `_mapDirty` so
  the décor tracks the calendar. Verified Tết shows in month 2 and the campus is clean in month 5.
  Hooks for future seasons (June graduation flair, etc.) are in place. Gates green.

## 2026-06-13 — The Văn-Mẫu champion is finally reachable (loop iter 30)
- The 📋 Quán Quân Văn Mẫu end-state — the thematic heart of the whole đề-Văn premise — had
  been **mathematically unreachable** (sweep-flagged): cram graduates have huge knowledge + cram
  but near-zero craft/creativity, so they *failed* the craft-based graduation diem and were routed
  to THẤT NGHIỆP, never reaching the cascade. Fixed the satire: a rote exam-champion now "passes"
  into a bureaucratic công-chức role by memorization even when the đồ-án score fails (isVanMau:
  kt≥70 ∧ vet≥55 ∧ st≤25). The rote crammer who also grew a predatory hustle (cm≥64) pivots to
  cá-mập-coin instead — so cram now mass-produces văn-mẫu (59-66%), breeds some sharks (9-11%) who
  get arrested (7-9%), exactly the dark mirror. **Both stale sweep flags cleared**; the craft
  thesis is untouched (đồ-án still → 75% kỹ-sư / 13% 🍎, cram still 0% 🍎); pluralism strong; gates
  green. All the văn-mẫu content (chip, flavor, alumni lines, gifts, FSM) was already written —
  it was just stranded behind an impossible gate.

## 2026-06-13 — Graduation walk-OUT + maintenance audit (loop iter 29)
- **Walk-out:** at June, graduating (and any departing) students no longer blink out — their
  actor stays and walks OUT through the cổng before being dropped, mirroring the matriculation
  procession. After the ceremony modal you watch your cohort file out the gate with a 🎵 bubble,
  often crossing the new tân-SV walking IN — a visible changing of the cohorts. UI-only; verified
  (12 enrolled → remove 5 → all 5 walk out past the gate → dropped, 7 remain).
- **Maintenance sprint** (overdue after ~10 feature iters): re-ran sweep (clean bar the two known
  flags — money inflation + QUAN_VAN_MAU), error-checked boot → build → 2 intakes → save/load →
  sim (no JS errors), and audited the 390px HUD/intro — measured the meters fit and the new
  goal-banner/lore render correctly. No regressions found from the start-from-nothing/3D/milestone run.

## 2026-06-13 — Founding milestones (early-game guidance, loop iter 28)
- Start-from-nothing left Years 1–4 (pre-first-graduation) thin on direction. Added a "Cột mốc"
  system: a gold HUD banner shows the next founding goal (build first Phòng học → first intake →
  hire a 2nd teacher → build a chuyên-môn room → grow to 20 SV → first graduation), each
  celebrated with a toast + ticker line + a small +4 Tiếng Tăm (the school gets noticed). Goals
  fire independently (real progress is always celebrated) and the banner shows the first unearned
  one as the suggested next step; it hides once the build-up arc is done. New `META.goalsHit`
  state (+ sanitize guard); engine `checkMilestones()` runs on day-tick, build, intake, and hire
  so it's responsive even while paused. Gates green; verified the full chain reaches firstgrad ~Y5.

## 2026-06-13 — 3D-but-pixel PEOPLE (owner directive C, part 2, loop iter 27)
- Re-baked the character sprite atlas with volume: faces and torsos are now lit from the
  upper-left (lighter skin/shirt highlight edges) and shaded on the lower-right (2-tone shirt
  shadow, right cheek/hair/arm/leg in shade) — so each chibi reads as a rounded form instead of
  a flat cut-out, matching the buildings' light direction. Kept bright + crisp (subtle, not
  muddy). Verified against a before/after 5× sprite sheet across all 12 variants. Directive C
  (houses + people both 3D-but-pixel) now complete; further depth/polish is optional.

## 2026-06-13 — 3D-but-pixel BUILDINGS (owner directive C, part 1, loop iter 26)
- Buildings were flat front-elevations; now each reads as a chunky 3D block. Added an extruded
  depth silhouette (solid dark side+roof faces offset down-right = the box's thickness), a single
  directional contact-shadow pool, and lit top/left wall edges — light consistently from the
  upper-left. Works across all roof types (gabled house gets a real hip/gable depth; flat/awning/
  glossy/vent/sawtooth get an eaves slab). Drawing-only: footprints and walk-blocking unchanged.
  Verified at 2× phone scale across all 5 room types. Part 2 (people get volume/shading) is next.

## 2026-06-13 — Students walk IN through the cổng (owner directive B, loop iter 25)
- New matriculants no longer pop into existence — each freshly-enrolled student spawns just
  OUTSIDE the gate (below the map at the cổng's x) and walks up the central path to their first
  spot. A whole intake files in as a staggered procession (queued in a short column so they
  don't overlap), each wearing a little "!" welcome bubble until they step onto the grounds.
  Pairs with start-from-nothing: the July founding intake arriving through the gate is now the
  game's first satisfying beat. Boot/reload places the existing roster in place (no mass march).
  Verified numerically (headless rAF is throttled): all 12 spawn below the gate and climb in.

## 2026-06-13 — START FROM NOTHING (owner directive A) + room-click fix (loop iter 24)
- **Reframe: found a school from scratch.** Boot is now an empty lot — 0 rooms, 0 students,
  1 founding teacher, a thin cash pot (200tr) with an origin story (you viral'd the đề Văn
  answer, cắm sổ đỏ + won 50tr "vốn mồi"). Replaces the old "buy a bankrupt uni with 42 SV +
  3 biên-chế" premise. Calendar boots Tháng 6 → first July rollover opens the FOUNDING INTAKE;
  Mai Sương is guaranteed to be enrollee #1 (the first believer). Empty Junes (no Năm-4 yet)
  roll the year & advance grades silently (foundingJune) — first real graduation lands ~Year 5.
  Trần Phi Lợi re-homed as a shadow alumnus (the founder's old cram-school star, cá-mập-coin),
  frozen until his scripted Y2-M3 arrest. New boot lore + intro copy ("Đặt viên gạch đầu tiên").
  GATE_FRESH rewritten (boot 0/0/1/1, Year 2 + ~12 SV + Mai after 400d); sweep Y1 band
  recalibrated for the lean founding year (0..18). All gates green; sweep thesis still holds.
- **Fix:** tapping a room (e.g. Phòng học) now opens its inspect card — clustered campus-life
  students no longer intercept the tap (room wins inside its rect unless you tap right on a SV).

## 2026-06-13 — Two new moral-choice events (loop iter 23)
- 📸 "Báo muốn bài thủ khoa đầu ra" (stage a coached student for +Tiếng Tăm +mầm phốt, vs let a
  real kỹ sư speak awkwardly for +Uy Tín) and 🎁 "Phụ huynh lập quỹ khuyến học" (take the 25tr
  "donation" with strings → +cash +Vẹt +mầm phốt, vs decline for +Uy Tín + a Bác Tâm nod).
- Both encode the hype-vs-substance tension; new fx + predicates (hasNam4/common); all four
  branches verified (TT/UT/cash/phốt deltas correct). Gates green.

## 2026-06-13 — First-time intro (loop iter 22): set the premise
- New players landed in the school with zero context. Added a one-time intro modal that shows
  the boot premise (the real 2026 đề Văn question → you bought a bankrupt university to MANUFACTURE
  a Steve Jobs, or at least not breed more coin sharks) + a one-line how-to-play + the satire
  disclaimer. Gated on META.tutorial (shown once, persisted). Uses the existing CONTENT.boot.

## 2026-06-13 — Alumni trajectories (loop iter 21): watch lives unfold
- Each cựu sinh viên now records a STATE HISTORY as the FSM moves them year by year, shown in
  the Sổ as a trajectory of chips (e.g. 🚀 → 🪙 → 🚔, or 💼 → 👷). The owner's core instinct —
  outcomes that evolve over years ("scammer 2 years after graduate") — made visible.
- Engine: setAlumState() helper tracks history at every transition; sanitize defaults it for
  old saves. GATE_ALUM caught a determinism bug (seeded vs sanitized history) — fixed; replay green.

## 2026-06-13 — Phốt risk indicator (loop iter 20)
- A qualitative HUD chip surfaces accumulating scandal danger — ⚠️ Có/Nhiều mầm phốt → 🔥 Phốt
  sắp bung — so the gamble is legible (pairs with the scandal-mood music + the now-firing
  cá-mập→arrest arc). Tiers, not an exact count, to preserve the mystery. Gates green.

## 2026-06-13 — Character customization (loop iter 19, owner-hinted)
- Tap a student → their inspect card now shows the ACTUAL pixel sprite (live canvas avatar) and
  lets you RENAME them (inline field) and CHANGE THEIR LOOK (🔄 cycles the 12 baked variants —
  skin/hair/accessory). Persisted on the student (s.look + ten); invalid look falls back to the
  id-hash, so saves stay safe. Makes the people personal — your students. Gates green.

## 2026-06-13 — Balance: money sink — sweep now fully clean (loop iter 18)
- Late-game cash inflated to ~2,800tr (no sink). Added a reserve-protecting sink: surplus
  ABOVE 300tr is reinvested into operations at 3%/mo (normal saving untouched, hoarding capped)
  → end cash ~1,012tr, Y1 net still +12.3 (in band). Shown as a funding-panel line.
- Sharpened the sweep flags (meter-health checks the HONEST cân-bằng school, not the
  intentionally cram-leaning default; 🍎 excluded from dead-state check since it is rare by design).
- **Sweep now reports ALL CLEAR**: economy in band, plural outcomes, 🍎 reachable, thesis holds.
  Confirmed contrast — honest school keeps TT 13/UT 9/TC 63; cram default TT 8/UT 3 (consequence).

## 2026-06-13 — Balance: the cá-mập-coin ending now fires (loop iter 17, sweep-driven)
- The game is *about* not mass-producing coin sharks, but the cá-mập-coin ending literally
  never fired (0%). Root cause: the vet/cram drag (VET_MULT) was halving the cá-mập stat too,
  so crammers could never build the hustle to qualify. Decoupled cm growth from the vet drag
  (gaming-the-system IS a cram skill) + nudged the cascade gate (cm≥52∧tn≤45∧vet≥50).
- Now cá-mập fires ~2% and the full dark arc works (sharks get arrested → BI_BAT appears).
  Sweep-verified; economy still in band; gates green. Remaining (ROADMAP): money sink + a
  deeper meter-recovery pass for the cram-leaning default.

## 2026-06-13 — Balance: Tiếng Tăm floor (loop iter 16, sweep-driven)
- The sweep found TT bled to ~1 over a run → admissions pool shrank → the campus slowly
  emptied (a liveliness bug, not just balance). Gave TT a FLOOR = 10 + 0.25×Uy-Tín: it still
  decays −1/mo, but only down to a baseline a working/reputable school keeps. Now stabilizes
  ~12; admissions stay healthy, the school stays full & lively. Hype-vs-uy-tín tension intact
  (TT still erodes; honest reputation lifts the floor). Sweep confirms: collapse flag gone,
  Y1 net still +12.3 (in band), pluralism/thesis unchanged. Gates green.

## 2026-06-13 — Gameplay simulator: sweep.js (owner directive)
- `node sweep.js` drives the DOM-free engine through 40 seeds × 5 strategies × 11 years and
  reports economy band, alumni-destiny distribution per strategy, 🍎-rate, and DESIGN-§1
  pluralism/dominance flags — so balance work is data-driven, not guessed.
- First findings (→ ROADMAP "Gameplay balance"): thesis HOLDS (craft → 🍎 in 43% of runs),
  economy in band; but Tiếng Tăm collapses to ~1, cash inflates to ~2788tr (no sink), and
  cá-mập-coin ≈ 0% (dark mirror barely fires). Added to skill as the standing balance tool.

## 2026-06-13 — Liveliness pass (loop iter 8): emotes + a campus cat
Chasing the north-star ("sunny, slightly chaotic little school you love watching").
- **Emote bubbles:** students occasionally pop a little pixel reaction above their head
  (♪ ❗ ♥ 💡 … 💧 ✨ ?), context-aware (music when performing, hearts at lunch, ideas while
  tinkering) — personality everywhere, the campus reacts.
- **Campus cat:** a wandering pixel cat roams the grounds — pure watch-it charm.
- Both cheap (live-layer flat ops); gates green.

## 2026-06-13 — Character variety (loop iter 7): students as individuals
- Expanded the sprite atlas from 3 hair colours to 12 baked VARIANTS per year — 3 skin tones,
  6 hair colours × 3 styles (short/long/bun), and accessories (glasses/bow/cap, weighted to
  none). Each student picks a stable variant by id-hash, so the 42-strong crowd reads as
  individuals instead of clones. Still pre-baked → blitted (60fps). Gates green.

## 2026-06-13 — Pixel-art props pass (loop iter 5): fill the campus
- Redrew ambient props as pixel-art to match the new style: chunky pixel TREES (replacing the
  old smooth circles that clashed), pixel LAMP posts with lit lanterns, a pixel flagpole.
- Added cute detail to fill the world: scattered FLOWER clusters (multi-colour) + low BUSHES,
  seeded so they never flicker. Removed the now-invisible eggshell marginalia. Gates green.

## 2026-06-13 — GRAPHICS OVERHAUL v2: detailed pixel-art (owner: "graphic still ugly")
Full visual pivot after the owner rejected the dark Sơn Mài Diorama. Owner chose detailed
pixel-art and flagged all four issues (tiny/plain characters, flat buildings, too dark,
unpolished). (The art-direction workflow died on socket errors; hand-built from the mandate.)
- **Characters:** a pre-baked sprite ATLAS — bigger ~16×22 chibis with real FACES (eyes,
  cheeks, mouth), hair variants, year-coloured uniforms, 2-frame walk, 1px outline. Baked once
  at boot (4 years × 3 hair × 2 frames) → blitted with drawImage, so 48 actors stay 60fps.
- **Buildings:** bright pixel-art — cream schoolhouses with red gabled roofs + shingles, the
  Căng Tin's striped awning, Lab's glossy roof, Phòng Máy's vented roof + cold windows, Xưởng's
  sawtooth, all with framed pixel windows, wooden doors, 1px outlines. Six instantly distinct.
- **Palette:** killed the near-black lacquer — bright sunny daytime grass with pixel texture,
  warm dirt paths, a light (not dark) vignette. Characters now POP instead of vanishing.
- **Crisp:** imageSmoothingEnabled=false + integer pixel discipline (flat fills, no gradients/
  arcs on sprites). Activity overlays (eat/study/zzz/sparks) repositioned for the bigger sprite.
- Gates green; verified home + all 6 building types + a settled lunch period at 390px.
- Skill updated: graphics is the standing #1 lever; use the `frontend-design` plugin for UI work.

## 2026-06-13 — Background music v1 (loop iter 3): state-aware campus-lofi
Owner directive ("background music… sound… a bit chill/relax"). Replaced the bare pentatonic
stub with a calm generative 3-layer bed — all procedural WebAudio, no asset files, defensive.
- **Layers:** a slow pad (triangle chord, long attack), a gentle pentatonic pluck melody, and
  a soft sub-bass pulse — connected through a master gain.
- **State-aware mood** (read live each note): `normal` warm major pentatonic · `tet` brighter +
  busier (Tháng 2) · `june` slower swell during a Lễ Tốt Nghiệp · `scandal` minor undertone
  when phốt seeds pile up / Tiếng Tăm collapses. Mood adapts within a cycle, no hard transition.
- **🎵 toggle** persisted in META.sound; **autoplay-unlock** on first tap (browsers block audio
  until a gesture). Verified: cycling all four moods headlessly throws no error; gates green.
- (Refactor swap recorded: the planned S1.5 art.js extraction was deferred — a ~350-line
  single-file split is mechanically risky to do *autonomously* with the owner away to catch a
  subtle visual regression; it'll be done in smaller chunked moves. BGM was the safer,
  explicitly-requested, owner-audible pick.)

## 2026-06-13 — The Player's Answer epilogue (loop iter 2): "Bản nháp bài luận của hiệu trưởng"
The open-question law (DESIGN §1) made playable. A 📜 button in the Trường tab opens a
draft-essay modal that holds up a MIRROR and never a verdict. Designed via a 3-lens
(ledger / draft-letter / question-echo) → synthesis workflow.
- Re-asks the real 2026 đề verbatim, then the founder CROSSES OUT every sentence that smells
  like a conclusion (struck `<s>` false-start; cross-out cut mid-word at "Tôi—").
- Points at the player's OWN graduates by name + chip + their own line; the 🍎 column is
  shown empty-or-full in the same neutral register (no path is ranked above another).
- Lays the three ledgers (bank / quỹ hiến tặng / the name-list itself) bare and refuses to
  weigh them — "Quyển nào to hơn thì… để Bộ duyệt."
- Bác Tâm gets one quiet physical line (never a moral); the đề returns identical as the LAST
  readable thing; close button is "Gấp bản nháp lại," never "done."
- 8 branch voices (steve/coin/vanmau/kysu/thuc/hype/that/kind) + empty-book guard, chosen
  from META/alumni-majority/meters. Pure view layer, derived on open, stores nothing.
  Templates in CONTENT.essay, thresholds in CONFIG.ESSAY, assembler in ui.js essayDraft().
- Verified at 390px across post-June (no-Steve), seeded-Steve, and empty-book states; gates green.

## 2026-06-13 — Campus life v1 (loop iteration 1): students keep a schedule
Designed via a 4-lens → synthesis workflow. Pure view layer (no sim/state change).
- **Day clock:** 5 real-time periods × 16s — class · recess · lunch · afternoon · tan học —
  animating even at speed 0 (chill ambiance), freezing only for modals.
- **Routing:** students walk to the right room's door-ring each period and DO the activity:
  sit-and-study at Phòng học (sky-kid daydreams a rising dot), eat a steaming bowl at Căng
  Tin, tinker with gold sparks at Xưởng (Năm-4 đồ-án-mode Tháng 2–5; spark-kids spark double),
  gather on the Sân with one shared bouncing ball (hype-kids perform, arms up), zzz when idle.
  Door-rings precomputed on map-dirty (cap 8/room, aggregated across instances); graceful
  wander-fallback when a room isn't built yet — so unbuilt rooms just mean fewer activities.
- **Perf:** base sprite unchanged; one duty-gated flat-op overlay per parked actor; the ball
  drawn once/frame after the actor loop. No per-frame strings/gradients/save-restore.
- Verified each period at 390px (class/recess/lunch all cluster + animate correctly).
  `window.__ui.setPeriod/_settle` test hooks added for deterministic period screenshots.

## 2026-06-13 — Campus art overhaul: Sơn Mài Diorama
Owner directive: "the graphic needs to be more detailed and more style." Replaced the flat
rectangles with a full art direction (synthesized via a 6-direction explore → 3-judge →
fuse workflow).
- **Ground:** near-black lacquer gradient dusted with ~320 deterministic vỏ-trứng eggshell
  flecks + a raised warm boardwalk path spine + a center vignette that melts edges into the
  dark-gold chrome. Figure-ground flipped so full-chroma students finally POP.
- **Buildings:** six visually distinct fake-iso pavilions — double drop shadow, front-wall
  extrusion, **gold-leaf frame** (the 26px separation win), lamplit windows. Each room type
  carries three redundant cues: unique roof (gabled / open-field / awning / glossy / flat+vents
  / sawtooth) + unique hue + warm-vs-cold window + a gable sigil. Sân is a real football pitch.
- **Students:** richer chibi — breathing contact shadow, 2-frame scissor legs, full-chroma
  body, per-year class marker (collar/sash/belt/grad-stole), hashed hair, gold collar tick,
  honor diamond (killed the per-frame ✦ fillText). ~8 flat ops/sprite → 48 hold 60fps.
- **Props:** seeded + capped, off walk lanes — lamp posts (gold glow), flagpole, trees,
  marginalia sigils (bulb/apple/∑ — the dry-satire counterweight to the reverent lacquer).
- One top-left light direction across everything; font-gated first paint. Gates green.

## 2026-06-13 — Tap-the-world inspect + /mvp/ retired
- **Interaction (owner decision):** the campus is now tappable. Tapping a student opens a
  non-pausing inspect card (stats, tell, hạt-giống potential, scholarship); tapping a room
  shows its description + how many students are nearby. Tabs stay for management — "tabs +
  tap-the-world." Antidote to the "everything's a button" feel. `window.__ui` test hook added.
- **/mvp/ retired (owner decision):** the parallel single-file build (older 3-grade spec)
  removed; the root multi-file v2 build is canonical. Salvaged ideas (phốt risk meter,
  export-save) parked in ROADMAP. Orphaned jsdom package.json removed.
- **Design:** DESIGN §1 "open-question law" — the game holds the đề philosophical; no
  dominant strategy, reflect-don't-impose, epilogue mirrors the player's own school back.
- **Skill:** added the ~10th-iteration code-structure review (owner directive).

## 2026-06-13 — S1 MVP (first playable)
Multi-file build flips the live link from placeholder to a playable university sim.

**Architecture (layer law from day one):**
- `js/data.js` — all CONFIG tunables + all CONTENT text. Zero logic, zero DOM.
- `js/engine.js` — state, deterministic sim, June ceremony, admissions, alumni FSM, funding.
  DOM-free and node-testable. Three RNG streams (sim/admissions/alumni) per DESIGN.
- `js/ui.js` — Kairosoft canvas (static campus + live walking sprites), HUD, panels, modals,
  minimal generative campus-lofi. Reads state only; owns no game numbers.
- `index.html` — shell + two stacked canvases + dark-glass/gold theme, Be Vietnam Pro.

**Systems live:**
- Calendar clock (10 ticks/day, pause/1×/2×/3×, 3× unlocks after first Lễ Tốt Nghiệp).
- 42-SV four-cohort boot (Mai Sương + Trần Phi Lợi scripted), per-cohort teaching presets,
  tuition, build placement (căng tin/lab/phòng máy/xưởng), teacher hiring.
- June two-stage ceremony: policy (Đồ Án Mẫu vs Bảo Vệ Thật) → 8-row graduation cascade
  with hidden tiềm-năng flag, entry-state line, near-miss line, viral-defense pierce.
- Admissions: deterministic pool, điểm-chuẩn histogram + cutoff/quota dials + forecast,
  cutoff stunts, BXH rank, auto-resolve when away.
- Alumni FSM (8 states) on isolated seed0 stream — byte-identical replay; gifts to quỹ;
  Trần Phi Lợi scripted arrest year 2; the 🍎 emerges years later, never at graduation.
- Funding: tuition/salary/maintenance economy, endowment ×1.004/month, pantheon
  scholarships (3) with growth-pipeline effects, scripted Trứng Vàng contract offer.
- Three meters (Tiếng Tăm decays, Uy Tín capped ±/yr with two pierce events, Thực Chất);
  light event deck; news ticker; autosave + v1→v2 migrator + Number.isFinite sanitize.

**Verification:** 5 node gates GREEN (FRESH/ADMIT/ALUM/COMPAT/BUILD via `./gate.sh`);
headless boot clean (no JSERR); 390px screenshots of home + June ceremony reviewed.

**Design:** added DESIGN §1 "open-question law" (owner directive) — the game holds the đề
philosophical and lets each player reach their own answer; no dominant strategy, reflect
not impose, epilogue mirrors the player's own school back. Queued: campus-life v1, the
"bản nháp bài luận của hiệu trưởng" epilogue.
