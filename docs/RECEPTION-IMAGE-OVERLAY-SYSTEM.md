# Reception — picture-overlap decoration system (first working slice)
**Branch:** `clinic-cute-station-overlays-20261110`, draft PR #2. **Status:** coded and syntax-tested; live browser screenshots not yet tested.

## Yes: this is the precise requested method
1. Keep the original playable room with doors, avatar, and station hotspots.
2. Put a room-sized transparent HTML placement layer over the scenery but **under** buttons/hotspots.
3. For every placed item in `state.receptionCollection.placed`, draw a transparent artwork image in a named rectangle.
4. Purchasing an item already updates saved collection state and calls `renderRoom()`; the image layer uses that same state, so bought/stored/reloaded states align.
5. Use `state.receptionView` to select an individual 2D or 2.5-D rectangle, without duplicating inventory or charging again.

## Implementation files
- `reception-image-layers.js`: artwork manifest; asset source and placement rectangles.
- `assets/reception/decor-planter.svg`: original illustrated leafy floor pot.
- `assets/reception/decor-pumpkin.svg`: original smiling pumpkin.
- `assets/reception/decor-cat-tree.svg`: original cat climbing tree.
- `reception-shadowbox-phase-a.js`: avoids separately painting those three items into the 2.5-D SVG, so no duplicate decoration.
- `reception-customization.js`: avoids repeating those three items as tiny emoji in Classic 2D.
- `index.html`: loads and initializes this image placement layer.

### Example manifest entry
```js
'decor-planter': {
  src: 'assets/reception/decor-planter.svg',
  slot: {
    classic: [84, 46, 13, 41],
    isometric: [91, 44, 11, 37]
  },
  label: 'Leafy terracotta floor planter'
}
```
Coordinates are [left%, top%, width%, height%] relative to the game stage. Changing the `src` to a transparent PNG/WebP/SVG file and adjusting the rectangle changes the displayed artwork **without touching case questions or room navigation**.

## Important design constraints
- UI and click targets stay interactive. The image layer uses `pointer-events:none`.
- Real, independently placeable items should have transparent backgrounds; otherwise a square photo background will visually cover parts of the room.
- Provide artwork with adequate size and transparent edges; avoid microscopic emoji previews.
- Item positions must avoid the central hallway arch, clinical station signs, avatar path, cat/dog silhouettes, and the bottom navigation labels.
- Images used in the public GitHub Pages game must be original, user-supplied with appropriate rights, or explicitly display-permitted.
- Customization artwork should be labeled accurately as the item purchased. Image previews need to display this *exact asset*, not a generic placeholder icon.

## Next development order
1. In-browser test all three sample items in both modes, before and after refresh, and when stored, on desktop and mobile.
2. Replace the existing generic shop preview with an image preview using the same `src` for these three items.
3. Apply the layer manifest to remaining item SKUs: plant pair, carriers, framed art, wall decoration, seating, cat-corner shelves and yard enrichment.
4. Rework reception background/window art as a **separate image-underlay**, with hotspot coordinates linked to artwork; retain the same door route and movement.
5. Add optional placement-layout editing only if it remains simple and doesn't enable obstruction or invisible purchased items.

## Explicitly not yet complete
- The other reception decoration items still use existing native SVG/emoji artwork.
- The cat annex and dog yard use their previous inventories and renderers; this first layer targets reception.
- No new photo-generated background or custom Photoshop/illustrator composition was produced. The bundled first-pass assets are original vector drawings.
- The code is on an unmerged feature branch; the live GitHub Pages game still needs deploy after QA.
