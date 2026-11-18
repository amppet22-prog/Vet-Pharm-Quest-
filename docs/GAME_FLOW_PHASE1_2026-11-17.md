# Vet Pharm Quest — Game-wide usability phase 1 (2026-11-17)

## User's requested scope
Add '?' on other stations; more Treatment Ward cases; visually active reception desk queue; reduce oversized station labels/clicks; bottom order Previous Room → Reception → Exam Room → Treatment Ward; Arcade visibility; floor plan in top bar/illustrated overlay; avatar standing/portrait separation, sharpness and crop; custom patient art; more companion coat/color choices and shaped (alpha) sprites; accurate image-based injection and venipuncture regions; clarify Mechanism Lab; refresh How to Play and Your Shift; upgrade catalog/XP; keep cute scenes; remove redundant corrections sidebar.

## Implemented in this phase
- Bottom navigation order: previous, reception, examination room, treatment ward. Remaining rooms remain accessible via expandable Other rooms.
- Floor Plan top-bar button next to Reception Studio; opens existing illustrated floor plan, not a second redundant map.
- Arcade top-bar shortcut and a highlighted dashboard card.
- Front Desk is the working patient check-in action and the reception scene shows a small cute dog/cat/rabbit queue; second scene hotspot opens Reception Studio. Reduced giant in-room banners and signs and made ? indicators for ordinary room station hotspots. Existing scenery remains preserved.
- Your Shift now describes Reception → Exam → Treatment and has a direct inpatient ward button.
- Upgrade Your Clinic renamed to a cute decoration-oriented panel, links to existing Reception Studio, explains 10 XP for first mastering a question; 100 study XP → 10 clinic coins; other case rewards may apply. The classic upgrade list is still there in an optional details area; no cosmetics were removed.
- In-game corrections sidebar removed. Underlying editor ID retained hidden so scripts relying on it do not crash; other editing workflows are unchanged.
- Added 5 three-step patient journeys to existing Treatment Ward continuing-care module: DKA dog, obstructed cat, equine colic, pancreatitis dog, post-I-131 cat. These supplement existing three scenarios; do not claim to replace other patient library rounds.
- Mechanism Lab Pharmacy station now opens the real dedicated mechanism lab. Menu describes five-step learning journey target → cellular response → compensatory physiology → benefit/harm → clinical choice; visible ? on its room board.
- How to Play quick start now reflects new navigation, direct arcade, XP/coin rules, advanced clin path separation, and mechanistic learning.

## Source & QA
Changes committed on repo default branch (main), primarily `index.html` and `mechanism-lab-phase-a4.js`.
All inline JavaScript syntax checked after each `index.html` change using JS Function parser; mechanism module syntax checked.
Not browser-tested on desktop/mobile. Modal actions and CSS should be smoke-tested after GitHub Pages deploy. No existing saved avatar, shop, reward or case progress migrated.

## Not yet implemented, intentionally separated for quality
1. **Standing avatar artwork**: `avatar-standing-companions.js`, `avatar-illustrated-choices.js`. 22 current standing art options are crops of a 6×4 atlas in `assets/vpq-standing-art-22.webp`; some appear fuzzy/cut off by design at walk sprite scale. Next: inspect source PNG/WebP art, offer independently selected framed portrait vs walking sprite, normalize contained view/crop and transparent silhouette use. Avoid stretching low-res atlas beyond source; new full-resolution assets may be needed. Custom patient must have distinct clinical patient UI, not a repurposed student-avatar control.
2. **Clinical skills**: `diagnostic-skills-workflow.js` and `skills-animal-illustrations.js` currently explicitly acknowledge stylized landmarks, not validated anatomical maps. The next phase must use verified anatomical references per species/route/vein, body diagram image overlay, accessible positional feedback and uncertainty notes. Do NOT pretend current circles accurately show injection or phlebotomy sites; do not move circles without anatomical verification.
3. Companion palettes: extend available species-coat choices for horses, cattle, rabbits and snakes, while keeping existing saved companion IDs stable. Prefer transparent silhouette / SVG clipping for non-boxy movement.
4. More advanced ward cases by service line; maintain assess/treat/monitor/discharge progression, patient-specific references and clear question hierarchy.
5. Floor plan as cute in-room overlay not just existing illustrated map: inspect available art and consider opening visual board in modal without overwhelming reception UI.

## Recommended next task
**Clinical Skills and avatar artwork audit** first because those are concrete visual correctness problems; in parallel, check that the new reception/top-bar/ward routes work on desktop/mobile.
