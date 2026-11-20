# Vet Pharm Quest — Baseline Audit and Foundation Protection Plan
**Audit date:** 2026-11-20
**Status:** READ-ONLY ANALYSIS. This document is not an implementation approval.
**Authority:** The GitHub default branch remains the source of truth. Original course sources govern educational content. Never silently reinterpret uploaded lectures or questions.

## Change-control rules (proposed foundation freeze)
1. Do not add, remove, redesign, reclassify, or rewrite game features or content unless the owner explicitly authorizes that change.
2. A bug fix requires an explicit instruction to fix it. Audit-only requests produce findings and plans, not feature modifications.
3. Preserve original source files, item/question/case IDs, save keys, rewards, level thresholds, uploaded photos, published edits, and progress. Migrate IDs only with an audited compatibility plan.
4. All future content additions need: course > exam > lecture > source > topic > type (Learn / Atlas / Flashcard / MCQ / Clinical Case / Arcade), plus source/QA status.
5. Every patient value has an appropriate species reference interval (except a question explicitly testing the interval). Feedback: green correct, orange incorrect. Include physiological reasoning and clinical cautions where appropriate.
6. Require before/after evidence for navigation, no duplicate display, data counts, source fidelity, and game-room accessibility.
7. Record approved changes in a change log, including scope and validation. No automatic cross-course modifications.

## VERIFIED FINDINGS (repository code inspection only; not browser-tested)

### P0 — Question discovery and access
- The course contains separately loaded lecture question imports. Confirmed repository banks: L67 85, L68 90, L69 100, L70 90, L71 90, L72 90, L73 90, L75 90, course L79 Eyes 80: **805 user-imported MCQs**; plus 90 authored MCQs for L74 and 90 for L77 = **985 MCQs represented in these inspected files**.
- Import scripts attach each MCQ to lesson sections as `practiceQuestions` and also create flip-front/back flashcards. These banks are not surfaced as a straightforward comprehensive selectable MCQ question library in the Handbook.
- The differential lab lecture-flashcard view restricts each session to 15 cards and its primary source is section `flashcards`; this can make the 80–100-question banks appear missing.
- No dedicated standalone MCQ import file was found among current scripts for L76 or L78 Ears. This does NOT establish that those lectures have zero questions in all systems.

**Suggested fix (requires owner approval):** Add a single Pathology Question Bank entry, independent of flip flashcards, with Exam > Lecture > Source > Question Type filters, visible imported totals, practice All / 10 / 20 / missed and progress; preserve original MCQ IDs, order, answer choices, answer keys and source notes. Show where each upload landed.

### P0 — Lecture 78 / 79 differential cases still swapped
- Correct course mapping: **L78 Ears, L79 Eyes**.
- Course lessons, handbook, key MCQ imports, primary specimen records, normal atlas and source-slide map were corrected in preceding commits.
- `necropsy-differential-cases.js` still contains **8 Eye cases tagged L78** and **7 Ear cases tagged L79**. All 15 should be mapped to the correct course lectures after approval; preserve case IDs and content.
- Check additional appended case banks, saved lecture filters, cross-links and lesson-specific images for the same issue.

### P1 — Pathology lecture/atlas coverage and terminology
- The course uses multiple layered sources: handbook, lecture-learning modules, lecture-specific audit files, quality addenda, specimen cabinet, disease atlas, flashcards, differential center and exam-specific bridges.
- Exam 6 GI L59–66 has an objective source-index explicitly documenting itself as preliminary/not a complete atlas or validated case bank; later files add significant disease material, so the final combined user-visible coverage needs a per-lecture audit, not an assumption of either completeness or absence.
- GI source files include distinct coverage passes; e.g. one L59/60/61/62/64/65/66 pass omits 63 but a separate infectious-GI deep pass includes 62/63. Inspect merged presentation.
- Exam 4 L42–45 first module explicitly identifies itself as 'initial'; verify L42–49 final effective lesson content and case/atlas availability.
- Lecture Handbook currently contains only 13 standalone Exam 7 chapters in its static chapter declaration L67–79; other exam chapters are injected by separate modules, so indexing != a complete content audit.
- Ensure every expected lecture has actual entry, all learning objectives, lecture source link, disease descriptions, gross/histo/species features, photo slots, question coverage, cases and navigation.

### P1 — Unified navigation
- 241 external scripts are loaded by the main index (observed on 2026-11-20); many separate education and room systems coexist.
- Desired entry path: Course > Exam > Lecture with consistent links to Learn, Atlas, Flashcards, MCQ Bank, Clinical/Differential Cases and applicable Arcade games.
- Multiple destinations can continue to exist, but use shared identifiers and an explicit breadcrumb/back path rather than competing copies of the same material.

### P1 — Case provenance and clinical QA
- Existing simulated pathology differential bank contains 124 cases across lectures 68–79 (including 15 misnumbered eye/ear cases).
- User describes an additional Claude differential diagnosis file; it has NOT been supplied in this audit turn and is NOT inventoried here. Inspect the actual file before import or content claims.
- Imported Pharm Exam 2 patient scenarios likewise need source/review flags, stable IDs and consistent clinical case navigation.
- Separate authored, user-uploaded and AI-generated material, with clinical-review status and source provenance shown.

### P2 — Standards, usability and regression testing
- Audit answer feedback, lecture dropdown selection, filters, 'shuffle remaining', progress, 'back', edit/publish owner permissions, mobile layout and visible patient reference intervals.
- Audit room furniture inventory/equipment paths and level-locked collections independently from educational content; do not redesign as part of curriculum cleanup.
- Include a small automated smoke test for data integrity, script parse, unique IDs, missing links and lecture coverage, plus an actual-browser visual/functional test before any area is called Done.

## Recommended implementation phases (NONE approved yet)
1. **Inventory / evidence:** auto-generate live matrix for every course/exam/lecture: source files, sections, diseases, questions, images, cases, filters and UI route; enumerate missing or hidden items.
2. **Pathology correctness:** fix misnumbered differential cases and source/link inconsistencies; verify user uploads and professor materials against exact originals.
3. **Findability:** integrate the full original MCQs as discoverable dedicated quiz practice, separate from flip cards; show counts and imports.
4. **Atlas coverage:** lecture-by-lecture objectives and disease audit, prioritizing actual gaps and missing image placeholders; do not duplicate existing entries.
5. **Cases:** inspect user's Claude differential file, reconcile duplicate cases, then link approved records to relevant existing case/diagnostic systems.
6. **Cross-course UX:** consistent Learn / Atlas / Flashcards / MCQ / Cases / Arcade navigation; preserve rooms and minigames.
7. **QA / release:** run parser/data/link tests and browser checklists, log results, request owner acceptance, mark foundation version, then require explicit requests for later changes.

## Definition of Done per lecture
- [ ] Course/exam/lecture metadata and professor source correct
- [ ] All objectives mapped, missing material documented rather than guessed
- [ ] Learn notes accurate, including 'why' and species differences
- [ ] Atlas disease entries linked; gross/histo and source evidence documented
- [ ] Uploaded flashcards and MCQs preserved, easy to locate, count visible
- [ ] Answer keys/rationales checked; green/orange feedback; reference intervals where relevant
- [ ] Case and relevant arcade links work without duplication
- [ ] Original image references/photo slots, user edits and publication settings survive
- [ ] Both keyboard/mouse and mobile UI tested; back navigation and progress checked
- [ ] Owner approves the section before frozen release

## Audit limitations
GitHub source-level inspection is not the same as running the live app in a browser. Counts above refer to inspected modules, not guaranteed unique visible question totals after source deduplication. Do not claim source-to-slide fidelity without opening the source PDFs. No Claude differential file was reviewed during this audit.
