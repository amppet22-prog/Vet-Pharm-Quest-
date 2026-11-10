# Study Rewards & Clinical Reference Plan — November 2026

## Main clinic study economy (implemented)
- Existing clinic save key remains `vpq-v2-clinic-state`; all prior XP, coins, upgrades and patient-completion flags are retained. We add optional fields `rewardLedger` (object indexed by namespace/question identity) and `studyRewardXP` (cumulative **new** mastery XP from the reward rollout onward). No save reset.
- **First correct answer for a distinct question:** +10 XP.
- **Every 100 newly earned study XP:** +10 coins at the milestone. The first 10 mastered questions therefore award 100 XP total and 10 coins, not 10 coins per question.
- Wrong answer: 0 XP, 0 coins, no penalty; practice remains available. Later first correct mastery can still earn credit.
- A previously rewarded question yields 0 new XP/coins on subsequent repeats, even if encountered in a different question rotation in that module.
- A separately tagged namespace distinguishes the Study Desk, clinical pathology, blood smear, parasite microscope, parasitology practical, diagnostic skills by mode, and radiology desk.
- Existing patient-case rewards of +45 XP/+20 coins on **first case completion** are left untouched (legacy policy, not counted in the 100 *study* XP exchange). The arcade uses a separate legacy save/reward implementation and is **not yet converted**. Avoid claiming all game activities have unified rewards until the arcade and other legacy systems have been audited.
- Study Desk shows the new rules, total newly mastered questions and partial progress to the next milestone. It shows earned XP and coin feedback after a correct response.
- The question-history reset in the Study Desk should not clear the reward ledger; repeating seen questions must never regenerate payouts.
- Export/import of the whole clinic save carries the new fields as part of the persisted state. Verify old saves can load without those fields.
- Reconcile any future merge between old arcade saves and the main clinic with a deliberate idempotent migration. **Never** automatically add prior XP from separate stores to the main wallet or regenerate historical payouts.

## Clinic reward roadmap
1. Validate award idempotence, milestone boundary, duplicate event prevention and old-save upgrade in browser, then inspect save restore. Manual QA still pending.
2. Show small reward-progress feedback consistently after answers in every lab activity.
3. Audit and migrate `pharm-arcade.html` and the other legacy rooms to the same central wallet using collision-resistant question identities and a one-time history migration. Do not silently discard or double-count existing rewards.
4. Consider difficulty badges and multi-stage case bonuses later, but never pay extra for exploiting replay or refreshing a page.

## Study/clinical sources in priority order
1. User-uploaded **course lectures, lab manuals, course charts, annotation, and image material**: course emphasis and original teaching contexts.
2. User-uploaded textbooks, including *Fundamentals of Veterinary Clinical Pathology* (Stockham & Scott), *Manual of Veterinary Clinical Chemistry: A Case Study Approach*, *Pathologic Basis of Veterinary Disease* (Zachary), and relevant veterinary radiology texts: reference/verification. Textbook copyright still applies.
3. **Cornell eClinPath**: https://eclinpath.com/ — clinical pathology interpretation and microscopy galleries; CC BY-NC-SA 4.0 and attribution/share-alike requirements: https://eclinpath.com/terms-of-service/.
4. **Today's Veterinary Practice**: https://todaysveterinarypractice.com/ — clinical case, diagnosis, management and preventive medicine updates. NAVC peer-reviewed veterinary content.
5. **Today's Veterinary Nurse**: https://todaysveterinarynurse.com/ — sample collection, triage, nursing, diagnostic handling and practice skills, with clear nursing-role distinction.
6. NC State veterinary parasitology: https://parasitology.cvm.ncsu.edu/ and Companion Animal Parasite Council https://capcvet.org/ — organism references and differential diagnoses, respecting limits of their companion-animal coverage.
7. ICVA NAVLE preparation blueprint: https://www.icva.net/navle/prepare-for-the-navle/ — use competency/difficulty patterns to design **new, original** case questions; do not reproduce copyrighted exam items.

### Content licensing distinction
Nonprofit or private-classroom intent is relevant, **but does not make a copyright-protected textbook, lecture image, or third-party article public domain**. Classroom permission may be limited to enrolled students and not extend to worldwide public redistribution. Today's Veterinary Practice explicitly reserves rights to copying, embedding, and reproducing resources absent specific permission (https://todaysveterinarypractice.com/terms-and-conditions/). In public GitHub, use original paraphrased questions, source links and separately permitted/licensed images with exact attribution. If specific lecture photos are cleared only for your class, keep them outside the public distribution or in access-controlled storage.
