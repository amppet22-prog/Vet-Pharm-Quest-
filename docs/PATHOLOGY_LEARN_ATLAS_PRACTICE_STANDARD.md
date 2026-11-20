# Pathology Learn → Atlas → Practice development standard

Effective 2026-11-19. First applied to Exam 6 gastrointestinal pathology (Lectures 59–66).

## One source of truth

The canonical disease record is a section of `window.VPQ_PATH_LECTURE_LEARN[lecture].sections` with `diseaseAtlas: true` and its original position in the array. All lecture, Atlas, flashcard, and case views point to that record. Never make duplicate authoritative disease descriptions in competing UI stores.

- **Quick Learn:** short high-yield species, gross-identification, mechanism and differential reminders. For Exam 6 it must have no repeated photo grids; include a direct link to the detailed disease Atlas entry.
- **Disease Atlas:** detailed lecture-sourced species/signalment, cause, gross and histologic findings, pathogenesis, comparisons, cited source slide(s), and credited photographs. The existing `VPQ_PATH_INLINE_PHOTOS.card(lecture, originalIndex)` and hydrate logic render local and owner-published photos without rekeying or copying them.
- **Practice:** existing authored lecture flashcards and differential cases. Link back to the relevant Atlas record only when the answer/case identity has been revealed; preserve test integrity, XP and existing progress.
- **Additional topics:** lecture objective coverage entries without `diseaseAtlas: true` must stay labeled indexed/awaiting detailed verification, not automatically promoted to a verified disease.

## Non-destructive edits

Never reorder the original `sections` array to implement sorting or filtering: photo keys use the original section index. Display sorted copies and carry through original indices. Do not replace owner-edited text, captions, photo uploads, or custom cases. Do not fabricate slide photos or assume a photograph exists merely because a lesson cites one.

## Exam 6 current coverage

Validated development-level structural audit: 101 detailed disease records and 63 additional index-only topics across L59–66 (not an independent slide-by-slide medical verification). Lecture 64 has fewer detailed Atlas records than other GI lectures and needs a future source-content audit.

## QA checklist for future exams

1. Verify the source lecture and species-specific content before calling an entry complete.
2. Test Learn → Atlas → previous/next → Learn, and case revealed → Atlas.
3. Test direct lecture flashcards and differential cases; no answers leaked before case comparison.
4. Test published and draft photo visibility against original lecture-section IDs.
5. Keep Learn scannable, Atlas comprehensive, and Practice applied; do not duplicate full photo galleries or long explanations.
