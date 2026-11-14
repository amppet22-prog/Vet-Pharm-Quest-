# Pharmacy: clinical relevance over blanket statements — update 2026-11-14

## User's teaching acceptance criterion
A pharmacology statement is worth displaying when it changes a real veterinary decision: **which patient, why mechanism matters, what alternative is inferior and why, what finding changes treatment, and what monitoring actually means.**

## Completed
- 23 high-yield Exam 2 drug records now contain `clinicalMicrocase` with **presentation, decision, physiological reason, and action/follow-up**.
- Kept 27 `teachingDepth` drug records from the previous instructor review; patient decisions lead before the detailed explanation.
- Fixed an existing `drug-clinical-reference.js` renderer bug: undefined `key` in a label changed to `p.type`.
- Revised rendering to suppress the generic five-line template and repetitive global disclaimer on **expanded** clinical cards, while retaining short source references on unexpanded drugs.
- Added AAHA 2026 feline diabetes, Merck endocrine, and Cornell radioiodine references to relevant drug data.
- Refreshed version query strings on the main hospital and arcade so both fetch new data.

## Example clinical decision scope
- Bexacat/Senvelgo: **prior OR concurrent insulin use prohibits use**, and a cat with normal-ish glucose and vomiting can still have euglycemic DKA.
- I-131: stable enough for isolation; renal consequences of correcting hyperthyroidism; **course** withdrawal 10–14 days vs variable Cornell facility guidance (methimazole 7–10 days, y/d 14 days).
- Regular insulin: DKA plus hypokalemia demands electrolyte/perfusion assessment; insulin moves K into cells.
- Vetsulin: 40 U/mL and syringe mismatch; glargine: pH-dependent depot and risks of mixing/dilution.
- Digoxin/loop diuretic: electrolyte-linked cardiac toxicity; furosemide: breathing better yet azotemic/hypovolemic dog.
- Phenobarbital: interacting prescription and drug level; bromide: dietary chloride change.
- Dexmedetomidine and hydromorphone: different receptor reversal needs, ongoing pain assessment.
- Metoclopramide: suspected mechanical obstruction changes choice; maropitant cannot erase a surgical abdomen.

## Tests performed
- `new Function` syntax validation passes for both `pharm-next-lectures.js` and `drug-clinical-reference.js`.
- Executed the reference renderer against five sampled drug records: I-131, Bexacat, phenobarbital, digoxin, granisetron. All returned nonempty HTML with expected high-yield vs comparison-card distinctions.
- Not run: actual browser/mobile navigation, coin/mastery behavior or complete line-by-line clinical validation for every one of the 192 records.

## Still needed
- Scale **specific, evidence-checked** clinical decisions to remaining high-yield medicines before adding more long generic text. Do not append a templated patient case to every human comparator merely to achieve 100%.
- Screen drug cards where route/why/contraindication are still generic; replace those only after verifying drug-specific detail. Some drug availability/approval statements remain historical.
- Validate every dose/withdrawal/monitoring interval independently and against lecture guide.
- Audit and rewrite clinical distractors across 109 core MCQs plus imported sets; preserve IDs and progress.
- Test full game in deployed browser.

## References
- User-uploaded Pharmacology Exam 2 Study Guide, pp. 27–140.
- https://www.aaha.org/resources/2026-aaha-diabetes-management-guidelines-for-cats/section-6-sglt2-inhibitor-treatment-and-monitoring/
- https://www.merckvetmanual.com/endocrine-system/the-pancreas/diabetes-mellitus-in-dogs-and-cats
- https://www.merckvetmanual.com/endocrine-system/the-thyroid-gland/hyperthyroidism-in-animals
- https://www.vet.cornell.edu/hospitals/services/internal-medicine-0/feline-hyperthyroidism
