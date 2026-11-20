# Vet Pharm Quest — Universal EXP, Coins, Levels, and Rewards Rule

**Standing project requirement (requested by game owner, 2026-11-20).**

Every eligible learning or practice activity **must participate in one shared game progression system**. No separate per-mode XP wallets, disconnected coin counters, or silent rewards.

## Required for every new activity
- Use the main game's persistent shared EXP/XP balance, coin balance, and level calculation, rather than independently tracking a separate wallet.
- Eligible sources include clinical multiple-choice practice, general quizzes, lecture flashcard recall, Mastery, professor-style questions, clinical patient cases, Pharmacy/Mechanism Lab activities, and educational Arcade minigames.
- Define meaningful and transparent reward conditions. Correct answers and earned learning milestones should advance EXP; coins should accrue under the shared rules.
- **Avoid farming:** award first-mastery points only once per uniquely identified question or milestone, using persistent, collision-free ledger keys. Replays remain available for study without repeat first-mastery payouts.
- After any award: persist user state, update all relevant HUD displays, and show an in-activity confirmation (+EXP, +coins when earned, and any level-up).
- **Preserve all existing wallet, unlock, progress, avatar, and decoration data.** Never overwrite existing values, recalculate historic awards, or reset users as part of migration.
- All activity owners should call the shared reward service, not merely change a local progress indicator.
- In quizzes with wrong attempts, wrong answers earn no first-correct reward; answer explanations remain available.
- Test reward earning, persistence after refresh, repeat-answer no-farming, HUD changes, and threshold-based coin/level transitions before calling any integration live-verified.
- Clinical MCQ and Mastery question bank rewards are wired to main game's `masterQuestion('study', id, correct)` in `index.html` as of 2026-11-20. Regular Study Desk already used the same first-correct ledger. **Other activities still require integration audit**—this policy is not a claim they are all connected yet.

## Existing reward policy (as of 2026-11-20)
- First correct mastery of a uniquely identified study question: **10 EXP**.
- Each cumulative **100 study EXP** earned under this program yields **10 coins**.
- The game currently calculates a level from total EXP. The practical meaning of levels is **not designed/finalized yet**.

## Level progression: clinic-only decoration unlocks (owner decision, 2026-11-20)
- **No avatar-cosmetic rewards.** The game no longer uses customizable avatars as a progression reward.
- Levels unlock **optional, cosmetic clinic-room accessories** for Reception, Treatment Ward, Reception Cat Corner and Dog Kennel / yard rooms.
- Unlocks are a two-stage mechanism: reach the required level, then spend earned coins to purchase the item. Once purchased, it stays owned across refresh and save exports.
- No clinical study material, questions, rooms, learning modes, or reference materials may be locked behind level or cosmetic purchases.
- The first seven level-exclusive items are defined in `index.html`, at levels 3, 5, 7, 10, 12, 15 and 20. They use room-scoped decor so an item appears only in its intended location.
- **Phase 1 presentation** uses lightweight decoration icons. Upgrading them to custom illustrated furniture and coordinated placement in the scene's actual art layer remains future visual polish.
- Preserve historic XP, coins, levels, and existing purchases. Expand the room-specific catalogue later with user-approved designs. Avoid making avatars a reward category in future level plans.
