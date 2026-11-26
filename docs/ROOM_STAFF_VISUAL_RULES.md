# Room Staff — owner-approved visual rules

**Approved 2026-11-25/26. Preserve these in future room and avatar changes.**

- All three extra staff avatars appear at a **consistent, slightly smaller scale** than the player's on-stage avatar. Current staff presentation is fixed at **116 × 190 px** with a **12% floor baseline** across slots.
- **Stationary means stationary:** staff do not follow the player horizontally, vertically, or in depth, and do not grow/shrink with W/S or arrow-key depth movement. Never connect staff size or foot position to the player avatar's ResizeObserver, depth dimensions, or movement.
- Normalize transparent padding in uploaded art when possible so silhouettes appear consistent; preserve the original image assets.
- Keep three independently selectable staff slots per room, room-specific saved assignments, live thumbnails and full-body selected-avatar preview.
- Do not modify the player avatar, companions, cloud saves, room interactions, or movement just to size room staff.
- For any new room visuals, render decorations behind the staff/player sprites and preserve their position and floor placement.
- Regression test: three staff in Imaging, player walks and changes depth, staff remain fixed; room changes preserve separate assignments.

Owner explicitly confirmed the behavior from **PR #53** works and asked for this to be a permanent game rule.
