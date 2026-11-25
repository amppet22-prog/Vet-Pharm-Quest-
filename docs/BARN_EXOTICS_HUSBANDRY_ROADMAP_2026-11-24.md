# Vet Pharm Quest — Barn, Exotics and Husbandry Roadmap
Date: 2026-11-24
Status: Owner-approved direction; prototype only. No gameplay or account migration.

## Immutable learning rule
**All educational modules, clinical cases, lectures, flashcards, exams, references and husbandry teaching are accessible at level 1.** Levels and coins gate **customization only**: visual rooms, animal staging, decorative equipment and optional environmental upgrades. No clinical learning access tied to purchases. Existing purchased items and unlocked themes remain grandfathered.

## Cosmetic unlock plan (provisional exact levels)
- Level 10: Barn entrance facade and decorative access.
- Level 15: First customizable stall.
- Level 20: Field / pasture placement for owned large-animal companions.
- Level 25: Additional stalls, species-appropriate spaces and privacy fences.
- Level 30: Paddock, shade, enrichment and ranch cosmetics.
Levels may be adjusted by owner later; existing purchases must not be revoked.

## Room placement — future architecture
- Assign existing owned companions to named room slots: cat room/catio, dog kennel/yard, barn/stalls/pasture, exotics habitats and avian/pocket pet areas.
- An equipped walking companion and resident display assignments are separate. Never change `vpqCompanionId` or `petBreed` from room placement.
- Pet nicknames are personal per account/owned companion; never alter public/global catalog asset names or require nicknames.
- Preserve companion canonical ID, art file, purchase, level, and current room; do not duplicate purchase objects.
- Separate preview sizes, walkable companion scale, and room-resident rendered dimensions. Use bounded normalized room coordinates and per-species maximum simultaneous residents; test mobile and iPad before release.
- No automatic writes to saved progress for a preview.

## Future Exotics Husbandry Wing (planning only)
1. Reptile & Exotics Habitat: snakes, bearded dragons, crested/leopard geckos, turtles; temperature gradients and monitored thermal zones, UVB species-specific need/placement, humidity and shedding, secure enclosures, hides, substrate, sanitation, enrichment, diet and safe feeding.
2. Pocket Pets Corner: rabbits, guinea pigs, rodents, ferrets; social needs and species separation, housing dimensions, ventilation, appropriate diets and fiber, dental health, enrichment, stress and handling.
3. Avian Care: parrots/companion birds and other common aviary species; appropriate space/flight, perches, foraging, ventilation, household respiratory toxins, nutrition, sleep, stress and behavior.
4. Learning game ladder: species recognition → identify enclosure problems → build a safe habitat with no timer pressure → follow-up clinical signs and DDx with species-specific explanations → advanced husbandry triage. All learning tiers are unlocked educationally, not by player level; only room cosmetics unlock with leveling.
5. Exact numeric husbandry guidance must come from course materials and species-relevant verified sources, not invented generic values. Consult source inventory before external research.

## Large animal clinical track (future)
Exam Room stays small animal + appropriate exotics. A Barn Clinical Cases section offers horse, cattle, sheep/goat and pig patient cases even to level 1 players through Exam Center/education menu. Its decorated scene is cosmetic.

## Prototype in repository
`barn-preview.html`: separate self-contained barn/pasture preview with example level selector, species selection and temporary nicknames. Uses local visual placeholders and an existing horse art asset; does not read/write browser storage, Supabase, game wallets, companion selection or level. Does not represent live ownership integration. User testing needed before any main-room integration.

## Integration quality gates
Existing companion scaling and depth movement are unstable and MUST be visual-tested; never modify the walking companion renderer just to add display pets. Verify cross-room selection persists, each account's nicknames remain private, save migration is non-destructive, no duplicate display/purchases, low-memory mobile rendering, and no overlapping pets or click targets. Change request approval and live browser tests before enabling the fully connected barn.
