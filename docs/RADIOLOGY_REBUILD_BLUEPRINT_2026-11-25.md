# Radiology rebuild · source-first teaching blueprint (2026-11-25)

## Non-destructive redesign
Do not delete the existing X-ray course, questions, case IDs, owner image queue, source mapping, game progress, ultrasound/MRI/CT stations, or patient/companion systems. Legacy content remains usable while replacing its educational presentation in phases. No bulk migration or renaming until verified.

## Student pathway: three stages only
1. **LEARN:** actual authorized radiograph, normal first when possible, objective "SEE" landmarks, mechanism-based "UNDERSTAND WHY", close mimics / pitfalls "DON'T CONFUSE", clearly marked student vs annotated reference. Avoid guessing diagnoses from unverified images.
2. **PRACTICE:** same image in unannotated mode, identifiable single objective, questions whose answer depends on visible findings; plausible parallel distractors; randomized answer position; explain every alternative.
3. **INTERPRET & REPORT:** one continuous clinical case modeled after existing differential diagnosis activities and the LMU student template: image date/available views/technique → objective Roentgen signs (number, location, size, shape, opacity, margination, distribution) → ranked differentials with justification → impression → comment/follow-up; source interpretation revealed after submission. Prefer orthogonal views grouped per patient.

## Source inventory and coverage boundaries
- Exam 1: Radiographic Interpretation and Radiation Safety & Physics; teaching concepts, source images still require auditing.
- Exam 2: abdominal anatomy, principles, GI/GU, X-ray PPT, case PDFs and quiz keys. De-duplicate PDF/PPT versions but preserve clean film crops and annotated references.
- Exam 3: MSK I/II, anatomy, practice cases, skull/spine, quiz keys and instructor transcript; BSAVA Chapter 7 illustrated supplement + Veterian Key MSK PDF as visual/mechanism references.
- Exam 4: newly supplied thorax lecture series L1–L8, technique/anatomy, pulmonary notes and vascular/cardiac readings. Some unannotated counterparts still missing; ultrasound materials not confirmed.
- Exams 5–7: course boundaries/sources not verified; do not fabricate coverage.

## Figure/photo workflow
Use source locator + case patient ID + view grouping + image SHA/dedup ID; preserve original and answer version separately. Prefer original embedded unannotated radiograph over cropped lecture slide; crop ONLY for pedagogic close-up with context preserved. Annotated originals belong in post-answer teaching, not hidden-arrow or erased-pathology edits.
For public game: verify third-party figure licensing; BSAVA and Veterian Key images are review references only until publication permission. Approved uploaded/source-attributed case imagery may populate public lessons. Owner queue must record rights, image quality, clinical answer, placement and approval.

## Minimal pilot implemented
`radiology-visual-learning.js`: source-linked visual-first beginner teaching on published canine GDV, canine urinary bladder calculi, feline thorax with source-described mineralized bronchi, and canine VD thoracic anatomy. Uses source findings after reveal. Entry point: X-ray → Learn → Start here: SEE / WHY / COMPARE. This is **not** complete course coverage or textbook-photo republication.

## Quality gates for expansion
- Student sees a diagnostic-quality radiograph, projection and source.
- Source supports claimed observation and interpretation. Differentiate source-reported from independently verified.
- Mechanism and common look-alikes explain WHY, not merely label disease.
- Questions cannot be answered reliably by answer position, length or absurd distractors.
- Clear progression, no duplicate patient counted as multiple independent cases.
- Lesson can be audited by owner before publishing.
- Basic browser navigation, images, mobile scrolling and retained saved progress tested.

## Planned work sequence
1. Test pilot with owner feedback; fix readability and correctness.
2. Complete source-to-image matrix and clean/annotated pairs for Exams 1–2.
3. Rewrite most problematic image practice question banks against verified film examples.
4. Expand MSK using authorized films, BSAVA/Veterian Key teaching explanations, and accurate orthopedic differentials.
5. Build thoracic modules from L1–L8, separating quality, anatomy, pulmonary patterns, cardiovascular, pleura, and airway/mediastinum topics.
6. Add ultrasound once source materials arrive and boundaries are verified.

Only first pilot was implemented as part of this step. No lecture-sourced or textbook images copied into public repository.
