# Expanded Kennel Dog Yard — 2026-11-26

## Implemented
Rebuilt the **existing** Dog Yard (`yardview`) as a larger-feeling, zoned 2.5D vector play yard with grass, perimeter fencing, shade, low enrichment equipment, and open floor space. It is part of the real `window.VPQ_RECEPTION_WINGS` room renderer, not a standalone illustration or static image upload.

Four visually distinct areas:
1. **Sniff & Sensory** (left, 0–25%): sniff plants, digging/enrichment box.
2. **Low-Impact Agility** (25–50%): low ramp, balance beam and stepping platforms.
3. **Open Play Field** (50–75%): deliberately clear grass for future dog avatars and safe movement.
4. **Tunnel & Quiet** (75–100%): hide/tunnel mound and rest area. A rear shade bench/water station is also included.

The existing dog lessons `vpqDogSniff`, `vpqDogMove`, and `vpqDogRest` still work, and a fourth `vpqDogOpen` lesson covers supervised introductions and appropriate play groups. The Reception return route remains. Already-owned `yard-toys` and `yard-agility` cosmetics continue to show small additional decorations without duplicating the built-in agility apparatus.

## Future: bring in owner's actual dogs (NOT implemented yet)
**No fixed decorative dogs are baked into the scenery.** The original Poppy/Maple/Ranger/Mocha/Sunny placeholder images have been removed from the yard-scene renderer (not deleted from the repository).

Eight named empty dog anchor slots are exposed in `window.VPQ_DOG_YARD_LAYOUT.placements` (percent coordinates measured from the top-left of the 1000×500 stage):
- sniff-a: (12%,74%), sniff-b: (21%,69%)
- agility-a: (33%,75%), agility-b: (43%,74%)
- open-a: (57%,72%), open-b: (66%,77%)
- quiet-a: (80%,78%), quiet-b: (91%,76%)

When adding real dogs later:
- Prefer the owner's approved game companion images, one actual dog per slot, no collages.
- Never overwrite or relocate the main walkable pet/companion `#petSprite`.
- Keep kennel dogs stationary unless the owner explicitly requests movement and be mindful of existing companion inter-dog behavior/safety.
- Preserve layout and accessible interactive station targets.
- Allow dog choice by slot, without changing the player's selected companion, or losing previous room save state.
- Check transparent margins to ensure consistent visual size, while preserving original artwork.
- Work with the existing state/cloud save architecture rather than create a second account system.

## QA
- SVG tag matching verified (313 markup tags, balanced).
- Reception wings JavaScript passes syntax parsing.
- Verified all 4 teaching actions plus Reception navigation remain mapped; removed hardcoded dog-character references from yard scene.
- Desktop and mobile visual/click QA still needs to be performed on deployed game.

### Room Staff invariant
See `docs/ROOM_STAFF_VISUAL_RULES.md`: stationary equal-sized room staff are owner-approved and must remain independent from player movement.
