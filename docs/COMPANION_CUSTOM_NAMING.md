# Companion custom naming — 2026-11-26

## Player behavior
- Every **owned** companion, including free starters, can be given a custom name in the Companion Collection via **✏️ Custom name**.
- Names can be different for each companion, up to 28 characters, and are shown on companion cards. The original catalog name remains accessible as the animal's type/identity, without modifying images, IDs or unlock data.
- On equip, `state.petName` and the avatar editor's Companion name input are updated to that particular companion's saved name. Thus switching companions doesn't accidentally transfer a previous pet's name.
- Editing Companion name in the avatar editor also updates the currently equipped companion's name.
- Names are stored in `state.vpqCompanionNames` keyed by stable companion ID, through the existing `persist()`/cloud save workflow. The legacy single `state.petName` field is retained for compatibility with HUD, other rooms and older saves.
- Previously named current companions are migrated into the name map when possible. Original base names and artworks remain unchanged.
- No rename action for a locked/unpurchased pet. Owned pets remain usable even if new level requirements change.

## Invariants
Do not mutate companion source names, saved IDs, pricing, unlock levels, selected artwork, stationary staff, movement, other players or unrelated saved state when renaming a companion.

## QA
All 305 inline scripts in index.html pass JavaScript syntax checks. Browser QA pending: rename two owned animals separately, switch back and forth, edit in avatar creator, refresh/login/cloud restore, check HUD and card names.
