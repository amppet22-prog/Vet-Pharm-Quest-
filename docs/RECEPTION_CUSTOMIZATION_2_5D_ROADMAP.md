# Reception customization — 2.5D hub roadmap

Status: **Phase 1 partly playable** as of 2026-11-08. GitHub is the source of truth. Implemented: Reception Studio, four free wall colors, four themed paid wallpapers, five purchasable decorations, live reception wall/decor placement, preview-before-purchase, same existing coin balance, persistent owned collection and recent reception purchase history. Dog yard/kennel is visibly Coming Soon, not playable. More sophisticated avatars, furniture placement, a full earnings ledger and 3D mode are **not implemented**.

## Core vision
Build a welcoming, stylized isometric/2.5D clinic reception that becomes the primary avatar, companion-pet, décor, and clinic-upgrade hub. Preserve the existing readable 2D learning rooms; no need to replace the game with a full 3D engine.

## Spaces
1. **Main desk / avatar station:** edit appearance, scrubs, accessories, companion pet, name, and clinic colors.
2. **Cat-friendly waiting nook:** visual separation from dogs, enclosed retreats, high shelves, scratchers, washable furniture, calm ambience, no toxic plants; decorative features do not imply housing animals unsupervised.
3. **Children's play corner:** age-appropriate toys, books, soft seating, cleanable surfaces and visibility to caregivers; not childcare or unsupervised play.
4. **General waiting area:** reception desk, chairs, notice board, community information and room navigation.
5. **Seasonal customization menu:** wall paint from the beginning; earn wallpaper, furniture, posters, decorations and lighting effects by studying.

## Theme catalog
- Everyday: clinic pastel, modern, cottage, nature, minimalist.
- Seasons: spring florals, summer, autumn, winter lights.
- Events: Halloween, Pride/community, and inclusive opt-in festive collections (e.g. Christmas, Hanukkah, Diwali, Lunar New Year) without forcing any theme.
- Players can disable holiday content or mix individual items independently of events.

## Avatar customization — preserve original character charm
The current illustrated veterinarian portraits and companion pets are existing working assets and should remain supported. The current character selection is not a true mix-and-match avatar builder. Start with current portraits as base presets, then build a modular appearance system (hair, skin tones, eyes, clothing/scrub colors, accessories, pet appearance) with a **preview-before-save** interface. Keep customization reversible and preserve old saved portraits. Do not replace the present art until a compatible modular system is proven.

## Coin bank, earned rewards, store and permanent collection
Current state already stores `coins` and `upgrades` in local browser state `vpq-v2-clinic-state`; study/case rewards already award coins, and the upgrade shop deducts them. **A proper inventory, purchase preview, equipped-item tracking and acquisition archive do not yet exist.**

- Add a visible wallet/coin bank: balance, earned/spent lifetime counters, recent transactions, no real money.
- Distinguish **locked**, **available**, **owned**, and **equipped/placed** items.
- Every store card shows an item preview (on character, pet or room) before confirming a coin purchase; include a clear purchase confirmation.
- Create a permanent **My Collection** archive of items bought, won, unlocked through learning, or granted at start. Track acquisition method and date; owned cosmetics remain reusable without repeat purchase.
- Collection categories: avatar wardrobe, companion-pet accessories, reception wallpaper/furniture, seasonal items, cat corner, children's corner, dog kennel/yard, clinic accomplishments.
- Equip/place, unequip/store, mix-and-match, search/filter and preview without spending.
- Preserve old player coins, XP, upgrades and character settings using safe migration. Never silently reset or duplicate purchases.
- Keep reward progression educational and non-compulsive: no loot boxes, paid currencies, artificial scarcity or gambling mechanics.
- Optional cosmetic achievements tie rewards to pharmacology, One Health, pathology, clinical skills and eventually OSCE.

## Dog play kennel / outdoor yard — 2.5D to optional 3D
- A new indoor kennel and fenced outdoor yard, visually connected to the hospital and customizable with flooring, fencing, play equipment, shade, benches, toys and enrichment.
- Start with a performant isometric/2.5D area; deeper camera movement or 3D geometry only if performance/accessibility justify it.
- Build clinical learning stations into the environment: canine behavior and body-language assessment, intake triage, vaccination/parasite prevention, kennel cough/infection-control, enrichment plans, and isolation protocols.
- Cases should teach **why** a clinical decision is made and include an answer/reveal reasoning step. Unlock cosmetic tools through completed learning, not clinical success gates that punish mistakes.
- Pet welfare design: separate reactive or infectious animals; avoid unsafe unsupervised group housing, exposed hazards, loose cords and physically unrealistic kennel capacity.
- A dog's play yard is not the same as isolation housing: clean zoning and traffic flow must reflect veterinary infection prevention.

## Recommended software architecture
- Existing saved coins are the authoritative opening balance, not a second unrelated currency.
- Introduce a versioned catalog of persistent item IDs and a versioned inventory/transaction ledger separate from transient UI previews.
- Centralize `canPurchase`, `purchase`, `owns`, `equip`, and `place` operations so purchases are atomic and cannot charge twice.
- Migrate current `state.upgrades` to existing ownership records exactly once; do not overwrite original saves.
- Each item includes type, compatible room/character, rarity only if meaningful, unlock criteria, preview image/source, price, theme and accessibility metadata.
- Add tests for migration, balance underflow, repeated purchase, duplicate equip, persistence and responsive previews.

## Phasing
- **Phase 1 (partly implemented):** four starter wall colors, persistent theme selection and previewable reception décor shop with clear ownership states. Further accessibility and device testing pending.
- **Phase 2 (partly implemented):** wallet UI, recent purchases, catalog previews, permanent owned-items collection, four themed wallpapers and cat/kids corner icons. Full earnings ledger, real furniture arrangement, more holiday variety and richer visual previews pending.
- **Phase 3:** modular avatar wardrobe while retaining current portraits, dog yard/kennel first playable learning station, and custom room layouts/seasonal bundles.
- **Phase 4:** optional rotating/zoomable pseudo-3D visuals, advanced character customization, dog-yard interactions and expanded case-building integration.

## Non-negotiables
- Readable type and high-contrast UI, reduced motion option, keyboard accessibility.
- Retain user-earned coins and progress; cosmetic upgrades do not block clinical learning.
- Avoid pet-dangerous real-world design suggestions (toxic plants, loose cords, exposed cleaning products).
- Inclusive, optional themes year round; no assumption of religion or identity.
- Preserve responsive performance on common Windows browsers and smaller screens.

## First playable 2.5D reception hall (2026-11-08)

**Now implemented:** `reception-hall-25d.js` is loaded by `index.html` after the original reception customization module. The reception scene can switch between a perspective/isometric-inspired **2.5D hall** and **Classic 2D** using a button directly beneath the stage controls.

- The hall draws a perspective ceiling, left/right/back walls, converging floor grout lines, layered front desk, seating, window and a cat nook / kids' corner. Purchased cat and kids' decorations and theme wallpapers appear when owned and placed.
- Uses the same receptionCollection save and wallpapers. A new `state.receptionView` string persists the selected view; existing inventory, coins, XP, room navigation, avatar portraits and interaction controls are unchanged.
- **Not true 3D:** this is a dimensional vector scene in the existing browser renderer. The avatar still moves left/right along the original gameplay axis; free movement, 3D avatar models, object dragging, collision and the dog yard are not built yet.
- The Classic toggle preserves the existing 2D art and is the fallback if the new style isn't preferred.
- Static JavaScript syntax and simulated toggle/scene/save/ownership tests passed. Live device/browser visual QA still remains.

## Implementation verification (2026-11-08)
- `reception-customization.js` is the isolated scene/collection module.
- Saves use the existing `vpq-v2-clinic-state` object; preexisting `coins`, `upgrades`, portraits and XP are not reset.
- Mock interaction test verified: preview, single 50-coin purchase, no double charge, wallpaper equip, décor placement and scene rendering.
- JavaScript static syntax tests passed; live browser visual and keyboard testing remain to be done.


## Phase A.1–A.2 — Reception shadow-box and shallow hallway (2026-11-08)

- **Committed:** \`reception-shadowbox-phase-a.js\` builds a perspective reception with a dimensional check-in desk, recessed short hallway, clinical/examination doorway, pharmacy doorway, and study-lounge door at the end of the hall. Existing cat and children's décor ownership remains readable.
- In 2.5D reception mode only, previous floating station cards are hidden; accessible HTML hit targets on scenery open the existing rooms or front-desk/patient tools. Keyboard A/D/arrows + E use five spatial nearest-station targets. Existing quick access to Reception Studio remains available outside the room.
- **Classic 2D remains a fallback**; existing study/case/drug/game modules are not moved. The Study Lounge already exists as a working study destination. No new study content or Mechanism Lab interior is claimed here.
- No full 3D, WASD depth movement, collision system, dog yard, or clinical corridor subrooms yet. Hallway doors are direct transitions, not a separate walkable hallway level.
- **Verification:** GitHub files and script reference confirmed. Live browser visual/interaction QA remains required; test scenery, mobile labels, door clicks, keyboard E, Classic toggle, saves, and Reception Studio.


## Phase A.3 — Student Study Lounge (2026-11-08)

- **Implemented** `study-lounge-phase-a3.js`, loaded by `index.html`. The existing Study Lounge room now has dimensional perspective scenery: bookshelves, whiteboard study goals, an actual study table with screen and notes, coffee maker/snack counter, window, comfortable seating, shadowed furniture and floor depth.
- Clickable/keyboard-focusable in-room hotspots open the existing **Study Desk** (lecture and exam focus selector), **Mastery Tracker**, and **Learning Games**. A clearly labeled Return to Reception button is present. Original walking controls and E-near-station actions remain routed through the same functions.
- **Unchanged:** existing questions, exams, learning progress, student avatar, existing saves, coins and progression. Other rooms are untouched. The mechanism lab redesign belongs to Phase A.4.
- **Verification:** JavaScript syntax of new module and inline main game script passed. Live browser checks still needed for visual collisions, mouse/touch hotspot targeting, door navigation, E interactions, Study Desk, Mastery Tracker, Games and smaller screens.


## Phase A.4 — Mechanism Lab (2026-11-08)

- Implemented `mechanism-lab-phase-a4.js` as a dedicated room accessed via the Pharmacy's Mechanism Lab doorway (not the generic Study Hub). Separate room navigation is exposed through the existing clinic directory and room tabs.
- Visuals: dimensional science lab, receptor/signaling display, antibiotic target diagrams, lab bench, pathway monitor, and clickable/keyboard-accessible stations.
- Four starter explanation lessons cover agonists/antagonists, beta-lactam cell-wall action, aminoglycoside 30S activity, and NSAID/COX physiology, each separating mechanism, biological WHY, and clinical cautions. Game Arcade and Pharmacy remain cross-links, not duplicated content.
- Existing movement, avatar assets, saves, rewards, quizzes and drug library are untouched. JavaScript syntax checks passed; live browser inspection and end-to-end navigation testing are still required.

## Next planned visual repair — Avatar full-body character art

- Keep existing cute portraits/headshots in menus, but replace rectangular image-backed walking characters with appropriately framed transparent-background, **full-body standing/walking** images or layered silhouettes. No image should appear as a framed square when walking.
- Add a larger-built male body preset and more diverse feminine skin tones and appearances. Support consistent body sizes/skin tones across walking sprite and character preview, and retain current presets and saves.
- Do not stretch a headshot into a walking body; test at each stage size, facing direction, pet overlap, and responsive widths. Maintain original scene movement and save migration. Existing images are not to be replaced until matching standing assets are ready.


## Clinic zoning decision — Study Lounge owns the Arcade

- **Student Study Lounge:** one physical home for the playable Learning Games/Arcade (Drug Match, Bug Battles, Exam Boss, Professor Guide, other learning games). Study Desk and Mastery tools stay here too.
- **Pharmacy:** medication shelves, drug details, antimicrobial selection and PK/PD reference. Replaced the Pharmacy games station with **Toxicology Reference** (currently preview/index; do not imply full toxicology guide complete). Removed the Pharmacy's game callout/button.
- **Mechanism & Physiology Lab:** teaching displays and structured mechanism explanations only. Its game buttons are replaced with **Visit Study Lounge** navigation, rather than launching the Arcade in the lab.
- **Treatment Ward / Exam:** clinical cases, patient diagnostics and monitoring. Planned future clinical pathology diagnostic stations and appropriate diagnostic imaging/x-ray workflow belong in clinical spaces, not the arcade.
- **Future specialist references:** Nutrition learning/reference and the expanded Toxicology master guide should be distinct thematic resources or rooms, integrated with clinical cases when applicable. Neither is marked fully playable by this change.
- Existing Arcade question banks, games, lecture selections, rewards and old saves remain intact. Direct legacy arcade URLs remain technically accessible, but in-world entry is through the Study Lounge.

### Testing before calling zoning fully verified
Check that Pharmacy now shows Drug Shelves, Mechanism Lab Door and Toxicology Reference; the latter must explicitly be a preview. Confirm Mechanism Lab's lesson button goes to Student Study Lounge rather than directly opening a game. Confirm the Study Lounge arcade cabinet still opens all games, and treatment/clinical rooms remain accessible. Static JavaScript checks passed, but live browser checks are pending.


## Examination Room — Traditional veterinary clinic shell (2026-11-08)

- Added `exam-room-traditional.js` and loaded it from `index.html`. Exam room imagery now depicts cabinetry, sink, clinical wall equipment, medical chart area, and stainless examination table, with a stylized small dog by default. The in-room patient switch changes the drawing to a cat and back; this is cosmetic and does not alter the actual patient case selected.
- Clickable/keyboard-accessible hotspots retain **Patient Charts**, **Examine Patient** (existing clinical case menu), and **Protocols**. A Reception exit remains available. A/D/arrow and E station controls retain their original actions.
- This is a responsive 2.5D scene, not a physically modeled 3D treatment room. No clinical workflow, course data, progress, savings, or case content changed. Source script and inline game syntax checks passed; live browser checks still needed for layout/overlap, patient switch, responsive labels, and clinical station activation.


## Exam Room v2 — Wall-mounted exam table revision (2026-11-08)

- Reworked `exam-room-traditional.js` to use a left-wall cabinet/sink worktop and a **right-wall mounted, folding-style stainless exam table**. The floor center is more open and the table no longer reads like a freestanding treatment/procedure table.
- Kept the goofy cartoon dog/cat on the table, pet toggle, and the existing case/chart/protocol logic. Added small examination-room furnishings (wall shelf, cute art, client chair, clinical stool, SOAP clipboard, exam protocol board).
- Relocated interaction targets to **clipboard** for Patient Charts, **table and patient** for Examine Patient, and **protocol wall chart** for Clinical Protocols. E-key nearest-station positions were updated along the x-axis.
- The new room is intentionally stylized, not photorealistic. JavaScript module and main game script syntax passed; visual QA in the browser remains pending, especially animal/table alignment and mobile labels.


## Pharmacy & Pet Nutrition — dimensional room build (2026-11-08)

- Implemented `pharmacy-nutrition-room.js` and loaded it through `index.html`. New 2.5D Pharmacy interior includes **clickable medicine shelves**, a **pet-food display** with stylized dog and cat food bags, a prominent **toxicology caution book**, a **Mechanism Lab door**, and a cute **turtle assistant** in a terrarium. Four distinct scene hotspots, paired with A/D/E nearest-station interactions.
- Medicine cabinets route into the existing lecture-aligned drug library; caution book routes into the existing explicitly preview-stage toxicology reference; lab door enters the existing Mechanism Lab. No old reference content or games are deleted.
- Nutrition bags open a new **Pet Nutrition Corner** with five introductory, mechanism-first reference cards: body condition vs muscle condition, reading pet-food adequacy/calorie labels, individualized energy needs, species nutrition differences, and therapeutic-diet assessment. These are educational starting points rather than a completed nutrition curriculum or diet prescriptions.
- Artwork is decorative only; no named brand endorsements, purchase system, pet feeding mechanics, or turtle interaction added. Existing saves, games, drug banks and clinical cases remain unchanged.
- **QA:** static JS syntax and expected route/source checks passed. Browser visual and interaction testing remains pending, especially hotspot labels at mobile sizes and the clinic avatar overlay.


## Reception Studio — furnishing and waiting-area purchase upgrades (2026-11-08)

- **Linked to the actual room:** `reception-customization.js` controls the saved `state.receptionCollection` catalog/owned/equipped/placed arrays; `reception-shadowbox-phase-a.js` reads that same state when rendering. Existing paint and legacy decoration purchases remain supported.
- **Sofa upgrades:** Free lavender sofa is added to existing saves; sage and blue couch styles are purchasable. A couch is drawn as a three-dimensional upholstered sofa with back, cushions, arms, and legs, rather than a single geometric chair block. Sofas use an exclusive style slot; purchasing or equipping a style replaces the prior sofa instead of stacking models.
- **New decor:** one large planter, paired plants, cat climbing tree with cubby, cat carrier, dog travel crate, framed animal artwork and paw-print mural. Purchases auto-place, and owned decor can be toggled from My Collection without additional payment. Existing coins, wall themes, pets, quests and avatar saves are unaffected.
- **Access:** header's Reception Studio remains; 2.5D waiting-room scene now has a visible `🎨 Decorate` hotspot, without removing desk/patient/room doors. The Classic 2D fallback remains, with owned wall/decor settings; detailed dimensional furniture is a 2.5D scene feature.
- **QA performed:** JS syntax passed for both updated files and the game, matching store/scene references checked. Live browser visual QA pending for sofa proportions, crowded waiting area, overlapping plants/cat tree/carriers, touch interactions, purchasing and reloading saves.


## Avatar art separation — framed portrait + standing game sprite (2026-11-08)

- New avatar-standing-companions.js supplies transparent, full-body SVG standing counterparts for all 31 roster IDs (0–30) and Classic customizable avatars. Roster portraits stay as framed selections; the game walker no longer reuses the 8x4 portrait-sheet crop as a body.
- Creator and avatar viewer show the framed portrait beside the separately rendered full-body walking character, while preserving the companion pet preview. Original portrait resources stay in the repository.
- New standing companions have varied skin/hair/outfit/body silhouette and are stylized counterpart illustrations, **not exact pixel-identical portrait replicas**. A future art pass can refine likeness per character. Classic standing art follows actual saved skin, hair, scrubs and shape fields.
- New optional preset buttons: larger-built masculine, deeper-tone feminine, warm-tone feminine, plus editable Classic; pronouns and all attributes remain independently customizable.
- Save format, portrait IDs, companions, game movement, XP and coins remain unchanged; simple walking bob added. JS source and main-game syntax passed. Browser testing needed for size, facing/mirror, preview layout, restored old saves.
- Future Clinical Pathology scope: compact clinical diagnostics, without duplicating comprehensive external resources; planned microscope slide deck for blood-smear cell identification, morphology and species differences.


## Full-body illustrated avatar roster installed (2026-11-08)

- Imported `assets/vpq-standing-art-22.webp` containing 22 miniature standing-illustration sprites from the approved full-body character lineups; includes additional hairstyles, body builds, a blonde male, red-haired male, and fuller-built veterinarian.
- The avatar creator now has an **Illustrated Standing Characters** collection with 22 additional unnamed selectable options, labeled Illustration 01–22 only. These choices have `portraitId=standing-0..standing-21` and use the same save field, independent custom name and pronoun fields, and existing companion-pet workflow.
- `avatar-illustrated-choices.js` renders cropped cells from one efficient 6×4 sprite sheet in the chooser, the paired selection preview, the avatar viewer, and clinic walker. Its interface is installed in `index.html` without replacing any existing rooms, game content, player coins, or lecture selections.
- **Only named presets remain Alexandria (`roster-28`) and Gary (`roster-29`).** Alexandria's exact original clipboard-holding art is preserved in `assets/alexandria-standing-v3.webp` and remains her walker image. The Classic Creator and all 31 previous portrait IDs remain selectable.
- Asset transfer and retrieval validated by the GitHub blob SHA; JS syntax checks passed for the game and art module. Remaining work: browser visual review (especially small sprite transparency, scale, and framing), save/reload after choosing `standing-*`, matching additional original portraits to dedicated art, and higher-fidelity individual standing cutouts for each character. The 22 game sprites are downscaled crops of group art, not individually commissioned new large transparent originals.


## Toxicology reference expansion — Pharmacy, Mechanism Lab and Study Lounge (2026-11-08)

- Added `toxicology-expanded-cards.js`: **21 new veterinary toxicant teaching cards** supplement the existing 10 CVM 732-linked cards (**31 in the Pharmacy catalog**). Each extension includes primary mechanism, species at risk, exposure, characteristic signs, recommended diagnostic orientation, clinical response principle, and an explicit **Do NOT confuse** statement; mechanism overlap is noted when applicable. Examples: organophosphates/carbamates, methylxanthines, metaldehyde, tremorgenic mycotoxins, botulinum/tetanus toxins, macrocyclic lactones, cyanogenic and nitrate plants, carbon monoxide, Allium, zinc, vitamin D3 rodenticide, soluble oxalates, equine red maple, aflatoxin, amatoxins, fescue, photosensitization, envenomation and macadamia.
- **Pharmacy Caution Book** now opens the expanded searchable **Veterinary Toxicant Reference** with mechanism-group selection, distinguishing signs/tests, and non-prescriptive patient safety notes. Former 10 cards remain with the same IDs and richer grouping, so historic content is preserved.
- **Mechanism & Physiology Lab:** toxin-target board now includes **16 teaching cards** (6 previous plus 10 representative mechanisms from the new extension). It remains explanation/reference focused, not an arcade.
- **Study Lounge:** added a separate 10-round **Toxicant → Mechanism Match** with immediate explanation, species clues and confusions. Ungraded prototype: not yet lecture-filtered, and intentionally does NOT change existing XP, shared game grades or mastery saves. The core pharmacology/One Health rounds remain unchanged.
- **Course map:** 11 existing toxicology lecture-outline groups remain accessible and their status is now correctly described as an **expanded reference**, while the complete lecture-filtered Toxicology exam bank awaits further course/source audits. No claims that the entire course is exam-ready.
- **QA:** JavaScript syntax checks for all updated scripts passed; data load order verified; a stubbed initialization test rendered all 31 catalog entries, mechanism filters and a 10-round match question successfully. Live browser visual/accessibility review and clinical content verification against lecture materials remain pending.
- **Medical safety:** this is a teaching reference, not individualized toxicology treatment guidance. Real exposures require prompt veterinary evaluation. Key mechanism distinctions were cross-checked against the Merck Veterinary Manual (including methylxanthine/chocolate, cholecalciferol rodenticide and macadamia).
