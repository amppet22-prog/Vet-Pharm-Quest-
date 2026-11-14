# Pharmacology Exam 2 — lecture-to-shelf clinical parameters audit (2026-11-14)

## Completed detailed source cross-reference in this pass
Read **Pharmacology Exam 2 Study Guide.pdf pp. 27–47** (lectures 10–12 and beginning L13). Identified and updated 18 existing drug/formulation shelf entries in `pharm-next-lectures.js`, preserving stable IDs. Added a specific `lectureProtocol` array, `studyGuidePages` and selected external `clinicalRefs`, surfaced within `drug-clinical-reference.js`. Added four clinical questions (now 101 original Exam 2 questions). Refreshed GitHub Pages script tags.

### Radioiodine I-131 — key fidelity and safety distinction
**Lecture pp. 44–45:** stabilize cat with methimazole when appropriate; check renal, cardiovascular, metabolic functions; discontinue methimazole and y/d **10–14 days** before I-131; **no-touch for 3 days** after treatment; gloves **next two weeks**; avoid close exposure to children/pregnant people; special waste handling; avoid a patient requiring hands-on care during isolation. Lecture describes SQ or IV sodium iodide I-131 and risk of later T4 replacement. 
**Clinical verification:** University of Tennessee College of Veterinary Medicine advises approximately 6–10 days isolation for many of its patients, with release governed by declining radiation levels; their guidance says stop Tapazole ~2 weeks before if medically stable **but do NOT withdraw if required to maintain stability**. Different facilities and radiation rules have their own restrictions. No universal fixed three-day discharge or no-touch rule.
Source: https://vetmed.tennessee.edu/vmc/radiology/iodine-131-therapy/

### Feline SGLT2 inhibitors — boxed warnings
**Lecture p. 37** and FDA: bexagliflozin (Bexacat) and velagliflozin (Senvelgo) **cannot be combined with insulin**, given to cats previously treated with insulin, or used in insulin-dependent diabetic cats. They are not simply replacement therapies after stopping insulin. Anorexia, dehydration, lethargy, hepatic/renal/pancreatic problems and ketones require specific screening. Potentially fatal **euglycemic DKA** occurs despite a nonmarked glucose level because glucosuria does not substitute for the action of insulin on ketogenesis. If ketoacidosis occurs, **discontinue SGLT2 drug** and obtain immediate emergency management, which may require insulin.
Sources:
- https://www.fda.gov/animal-veterinary/product-safety-information/dear-veterinarian-letter-advising-veterinarians-important-safety-conditions-associated-use-bexacat
- https://www.fda.gov/animal-veterinary/product-safety-information/dear-veterinarian-letter-regarding-important-safety-conditions-associated-use-senvelgo-velagliflozin

### Other updated entries
Methimazole (TPO inhibition; CBC/platelets/hepatic/renal/T4 monitoring), carbimazole, PTU, iodine-restricted diet, levothyroxine (consistency of administration and products), regular insulin (DKA + K depletion), Vetsulin/lente (resuspension and U-40 devices), glargine (precipitation; mixing), detemir (albumin binding; dog sensitivity), NPH, PZI, glyburide/glipizide (KATP and residual beta cells), metformin, liraglutide (comparison/investigational).

## Source cautions
- The lecture describes `3 days no touching`, `2 weeks with gloves`, and `10–14 days off methimazole/y/d` as classroom notes. These are not universally mandated treatment or discharge protocols.
- Some lecture claims elsewhere may be outdated or clinically oversimplified (renal disease extending insulin duration as a 'benefit', routine thyroid supplementation for equine metabolic syndrome, fixed insulin-switching doses, certainty of Somogyi). These have NOT been promoted to universal prescribing advice.
- Medical screening with azotemia/cardiovascular disease requires individualized assessment; disease presence alone does not invariably rule out I-131.
- Library counts represent entries, not fully audited independent drug substances. Avoid declaring lecture-complete.

## Next pending source sections
- L13–17 autonomic, cardiac, respiratory and GI medication-by-medication clinical parameters.
- L18–20 behavior, anticonvulsants, alpha-2/phenothiazines and opioids.
- All remaining Exam 2 guide pages for missed named agents, and existing Exam 1 shelf content.
- Runtime browser/mobile checks, class matching and question presentation after deployment.
