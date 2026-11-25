# Vet Pharm Quest — MSK source-image inventory · 2026-11-25

## Source-first review
- Musculoskeletal Anatomy Fa26 (1).pdf
- MSK1FALL26 (1).pdf
- MSK2FALL2026 (1).pdf
- MSKPracticecases (1).pptx
- Spineandskull2026(2).pdf
- MSK Anatomy Quiz Key.pdf
- MSK Pathology Quiz Key.pdf
- video8092018947-English-cc.txt — instructor narration for skull/spine
- BSAVA_Chapter7_Exam3_Illustrated_Supplement.pdf — visual reference, not copied for public distribution (see RADIOLOGY_BSAVA_VISUAL_SOURCE_MAP.md)
- Musculoskeleton _ Veterian Key.pdf — supplemental comparison/reference: normal views, patterns, soft tissues, fracture/bone/joint differential framework; do not rehost textbook imagery without license.

## Extraction result (staging files outside GitHub)
The user-supplied source files were processed to extract embedded raster artwork, NOT to publish it. **284 image objects; 274 unique byte hashes**, including potential diagrams and repeated views. Counts by source:
- MSK I: 95
- MSK II: 92
- Musculoskeletal anatomy: 47
- Skull/spine: 37
- Anatomy key: 5
- Practice cases: 4
- Pathology key: 4

Generated local archival bundle: `msk_source_extraction.zip` with `msk_image_manifest.csv`, mapping every extracted image to its source page/slide and SHA-256. Staging artifact is accessible from the ChatGPT conversation, **not** a deployed game resource.

## Exam 3 game integration
13 additional image-review slots added to `radiology-image-approval-queue.js`, supplementing existing BSAVA slots. The owner queue now displays **Exam 3**, as well as Exams 1–2. Each slot records expected student workflow, source locator, clinical caution and image approval steps. No source-owned images added to public repository; no clinical content passed as approved.

### Three original practice cases (do not break view grouping)
- Case 1 slides 2–3: 6-year-old MN German Shepherd, difficulty rising; hips
- Case 2 slides 4–5: 8-year-old FS English Mastiff, right forelimb lameness; distal forelimb
- Case 3 slides 6–7: 8-month-old MN mixed-breed, shifting lameness, fever, lethargy; femur

### Priority image lesson flows
1. Normal projections and open physes -> anatomy quiz + anatomy lecture
2. Normal versus joint effusion/osteoarthritis and OCD -> MSK I
3. Bone lesion aggressiveness, lysis, periosteal reactions -> MSK II
4. Spine/skull normal comparison and pathology -> lecture + transcript
5. Full radiographic reports using existing LMU template

## Publishing gates
Before a case is made student-visible: confirm rights for public rehosting, remove patient identifiers, review correct views/metadata and interpretation, verify legibility, distinguish unannotated student view from annotated answer key, then approve in existing owner workflow. **Permission to use a lecture for study does not alone prove the rights to publish its embedded third-party figures.** Book figures (BSAVA and Veterian Key) remain reference-only unless separately licensed.

## Next technical milestone
Attach genuinely authorized original radiographs to the existing owner publisher, link case ID to each slot, complete checkboxes, and then surface the approved cases in the image-backed Reading Desk. Avoid duplicate modules or replacing currently functioning cases.
