# Pharmacology Exam 2 — Instructor-quality teaching audit (2026-11-14)

## Verdict
**Not yet course-ready at veterinary-instructor depth.** Pharmacologic taxonomy and note coverage are substantially improved, but a single sentence attached to a drug is not proof that it has been taught comprehensively. The main remaining deficits are specificity of route/formulation, contraindication justification, species comparisons, clinical alternatives and the quality of distractors.

## Static measurements
- 192 drug/formulation records; no missing class labels and no duplicate IDs in the prior sweep.
- 109 original MCQs; four options apiece; 39 have short prompts (<80 characters), and 39 contain at least one absolute-language choice (e.g. always/never/only), an indicator for **manual distractor review**, not a proof of an invalid item.
- 174/192 drugs still have at least one generic/verify-label expression in route, WHY or contraindications. This is intentionally **not** erased without evidence; it's a specific clinical-content remediation backlog.
- In this pass 27 high-impact drugs gained full four-field teachingDepth modules: **when to choose, mechanism and physiologic why, contrast against a plausible alternative, and monitoring/avoidance**.
- 16 shelf records gained **professorVsClinicReview** explanations for potentially misleading claims or lecture simplifications.
- Rendering code now displays both instructor-depth and lecture-versus-clinic distinctions in Pharmacy cards. Browser QA remains undone.

## Examples of meaningful corrections / flags
- Lecture p. 43 T3 feedback: both T3 and T4 participate in endocrine negative feedback; don't teach absence of T3 feedback as clinical physiology.
- I-131 lecture p. 44–45: stability, 10–14 day methimazole/y/d withdrawal, 3-day no-touch and two-week gloves preserved as EXAM instruction, but real nuclear medicine facility safety policy takes precedence.
- Feline SGLT2 medications, Lecture p. 37: Bexacat and Senvelgo cannot be given with insulin or used in previously insulin-treated cats; euglycemic DKA is an emergency, not excluded by near-normal BG.
- Bromide, Lecture pp. 123–125: high chloride can lower serum bromide, cats can have serious airway adverse effects, and abrupt-stopping advice should not be universal.
- Lecture p. 53 pimobendan is an inodilator, but not the only cardiovascular drug with vasodilating actions.
- Lecture p. 65 food-animal furosemide withdrawal figures cannot be generalized across jurisdictions, species and products.
- Acepromazine tranquilization is not analgesia or relief from fear; hemodynamic risks matter.
- Exam-source metformin/thyroid hormone and source suggesting insulin adjustments under concurrent CKD should not become automatic clinical recommendations.

## Remaining work, prioritized
1. Complete line-by-line medication and formulation inventory across all 142 guide pages and objective answer file, including explicit syllabus gaps.
2. Provide drug-specific routes, administration cautions and monitoring intervals with verified sources, instead of generic strings (174 flagged records).
3. Add decision/why/compare/monitor depth to 165 further drug records, prioritizing those that are instructor-starred in the guide; do not imply all 192 are equally important or should have identical depth.
4. Clinical accuracy review of the **109 core** MCQs and separately the **96 PDF-practice** and **132 objective** imports; improve implausible distractors and preserve the distinction between professor answer vs independently verified evidence.
5. Test GitHub Pages shelf drilldowns, mobile scrolling, lecture filters, Drug Match, XP, saves and cache invalidation in a browser.
6. Review classic Exam 1 pharmacy separately.

## Sources
Primary: user-supplied Pharmacology Exam 2 Study Guide.pdf, especially lecture pp. 27–47, 48–84, 119–140.
Independent spot checks:
- Merck Vet Manual epilepsy: https://www.merckvetmanual.com/nervous-system/epilepsy-in-small-animals/epilepsy-in-small-animals
- Merck Vet Manual cardiovascular medication table: https://www.merckvetmanual.com/multimedia/table/cardiac-medications-of-dogs-and-cats
- FDA Senvelgo warning: https://www.fda.gov/animal-veterinary/product-safety-information/dear-veterinarian-letter-regarding-important-safety-conditions-associated-use-senvelgo-velagliflozin

This file describes a static, partly source-verified audit and expressly does not certify all drugs clinically.
