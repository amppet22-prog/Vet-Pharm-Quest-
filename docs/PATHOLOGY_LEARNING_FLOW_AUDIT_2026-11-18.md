# Pathology learning flow: large-pass audit — 2026-11-18

## Learning sequence
1. Instructor-derived lecture notes and the full lecture disease/topic inventory.
2. Flashcards: focused gross/histology/etiologic recall; 15 questions per standard lecture session; a separate Lecture 67 CNS barrier/vocabulary focus session.
3. Normals Atlas: healthy gross anatomy and histology references inside the Specimen Cabinet. An empty image slot is **not** a verified normal photo.
4. Disease Specimen Cabinet: gross/histology lesion identification, with the user's published images and editable descriptions.
5. Differential Diagnosis Center: signalment + gross lesion → select a leading etiology → reveal histology → choose again → compare mechanisms and tests.

## New targeted question bank
- `pathology-curated-flashcards.js` supplies **149 targeted questions across 73 matching lecture sections**.
- L67: 25 new curated questions in eight mechanism sections, plus the 17 previously written barrier and vocabulary focus questions retained in `pathology-lecture-learning.js`.
- L68–L74: 12 curated questions each, emphasizing viral vs bacterial neuropathology, malacia compartment, nerve pathology, dermatologic lesion patterns, infectious/parasite identification, and autoimmune diseases.
- L75–L79: 8 curated questions each. L76 ovarian-tumor questions and L77 abortion/placentation questions use the instructor-audited/speaker-notes sections, not unsourced assumptions.
- Curated cards take priority over generic instructor-note prompts. Cards retain lecture slide references.
- `Need practice` and `Got it` are locally stored study preferences, not validated competence metrics. Skipping a question before revealing the answer saves it for review. A new shuffled session can be started afterward.
- Following a session, learners can enter the same lecture's specimen atlas or differential case list without having to navigate back through multiple menus.

## Clinical case reasoning improvements
- A selected leading diagnosis is retained while progressing from gross findings to the histology clue.
- When a case is compared after histology, the UI records the **initial gross-based choice** and **post-histology choice**, displaying whether the learner revised their differential.
- Case reset clears the initial leader and current selection.

## Specimen publishing fix
- `necropsy-owner-publish.js` now resolves `getCustomSpecimens()` when opening a newly published owner-created normal or disease specimen card.
- This allows its normal multi-image, credit/tag, and text-only editing interface to be used after card creation.

## Verified by simulated runtime tests
- All 149 new targeted questions accounted for by lecture: 67=25, 68–74=12 each, 75–79=8 each.
- JS syntax validated for key updated files.
- L67 barrier/vocabulary focus deck yields 17 cards; marking a card for practice and reviewing it succeeded.
- A L68 differential case preserved the gross-first selection, displayed the change after histology, and reset correctly.

## Outstanding work
- No live end-to-end browser/owner GitHub publish test yet. GitHub commits are not a substitute for testing the production page in the actual browser.
- Many source lecture topics still have note-based rather than manually curated flashcards. A flashcard does not imply that a disease has a dedicated case.
- Many gross/histology images remain absent or require verification of source, species, organ, licensing and pathology diagnosis. No original professor slide images were copied.
- Some owner-added custom cards, per-device progress behavior and multi-photo flows need a user-facing browser check.
- Comprehensive lecture disease inventory and coverage audits remain separate from flashcard counts. Keep reaction patterns, normal structures and etiologic diseases conceptually distinct.
