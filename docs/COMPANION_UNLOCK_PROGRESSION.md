# Companion Unlock Progression — 2026-11-26

## Goal
Make progression more fun by spreading collectible character unlocks over many player levels instead of assigning every uploaded pet in the same species a fixed level (e.g. every uploaded cat at 5, dog at 8, legendary at 18).

## Implemented unlock ranges
- Dogs: levels **2–34**
- Cats: **2–32**
- Horses: **3–37**
- Pocket pets: **2–33**
- Exotics: **3–36**
- Avians: **3–38**
- Ruminants: **4–37**
- Swine: **5–36**
- Legendary: **17–45**
- Wildlife rehabilitation: **27–50**

Each category's **paid, image-backed** companions are assigned incremental levels across its range. Source catalog order is deterministic. Groups with few images cannot populate every level individually, but other categories interleave with them. Starter companions remain at level 1 and free.

## Player protections
- Existing companion IDs and prices are unchanged.
- Previously purchased companions remain equipable after the change, even if their new milestone is higher than the player's current level. An already-equipped companion also isn't blocked.
- The shop displays the next milestone for the selected species/category.
- No changes to XP rate, level calculation (130 XP per level), coin rewards, art validation, saved state fields, Supabase, player avatar, companions' room movement, or Room Staff behavior.
- If a new set of assets is uploaded, recheck its progression placement and species balance rather than adding one identical level to every new item.

## QA
JavaScript syntax parsing of the 303 inline script blocks passed. Visual browser QA still needed (level 1 starters, past purchase at a below-new-threshold level, high-level listings, category tabs, and after cloud restore).

## Existing staff rule
See `docs/ROOM_STAFF_VISUAL_RULES.md`: stationary staff and consistent art scale are owner-approved and must not be changed during companion progression updates.
