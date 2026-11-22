# Companion layout and identity lock — owner-approved contract

**Do not change these defaults during companion uploads, catalog work, shop filtering, or cosmetic updates.** A new dog batch must never move, resize, replace, or re-equip the selected animal in the reception room.

## Protected behaviors
1. The player's companion remains the exact purchased/equipped companion ID. Importing art does not call `vpqCompanionApply`, write `state.vpqCompanionId`, or silently reset `petBreed`.
2. Reception walking character and companion share the floor baseline. Pet follows beside the veterinarian, without covering her. No white/colored backing rectangle, card, portrait frame, or scene-sized image. Art must actually have transparent pixels; trimming or showing opaque artwork as a transparent cutout is not acceptable.
3. The walkable scene owns `#petSprite`, `avatarX`, and `petX`. Shop/gallery/cosmetic code must not resize or move them. Keep preview size, shop card size, and walkable companion size completely separate.
4. Do not change pet sizing or position simply to add companions. Any change to walkable rendering or selected identity needs an explicit request and visual before/after test.
5. No substitutions: Mera is the user's black/tan shepherd/husky with blue eyes, wearing a **blue shark costume** in their supplied transparent image `Mera in a Shark Costume-5(1).png`. This is the canonical Mera art when the asset is available in the GitHub repository. Do not use generic Shepherd drawings as substitutes for that image.
6. If an upload is not genuinely transparent, mark it for cleanup instead of displaying a background rectangle. Do not silently swap selections.

## Regression tests before publishing
- Load reception with an already-equipped dog, then open/close the companion catalog; ID, position, size, and artwork must not change.
- Switch rooms and return; companion remains next to avatar and grounded at feet.
- Walk left/right across reception including edges; no pet overlaps the vet or grows to cover room props.
- Load the owner-provided Mera PNG: check actual alpha and image cropping; no matte/background.
- Import another batch of 20+ dogs; no change to the current equipped companion.
- Check mobile and desktop viewport for containment without white squares.
- Verify companions other than Mera retain their IDs and purchases.

## Implemented anchor fix (Nov 22, 2026)
- Main reception `updatePosition()` places pet at the exact veterinarian left-edge coordinate (`calc(${avatarX}% - 28px)`) and the protected pet CSS shifts its container left by its full width + 9px (`translateX(calc(-100% - 9px))`). This is a fixed edge-to-edge gap, independent of screen width or pet art width.
- The previous independent petX interpolation in both `move()` and the animation loop is deliberately disabled; do not restore it. This separate lag caused the pet to drift far from the veterinarian.
- Keep pet artwork and selection separate from this geometry; do not edit or override the anchor as part of companion imports.
- Verified with headless Chromium in an isolated CSS/DOM fixture at x=18%,44%,72%,90%: pet right edge sits exactly 9px left of vet left edge, container background remains transparent. **This is not a live hosted-game end-to-end verification.**
