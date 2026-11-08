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
