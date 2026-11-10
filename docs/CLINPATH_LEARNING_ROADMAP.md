# Clinical Pathology Learning Roadmap — November 2026

## Goal
Make clinical pathology a walkable, case-based part of Vet Pharm Quest: **recognize morphology → explain mechanisms → interpret CBC/chemistry/urinalysis → decide next diagnostic step → apply it to a patient**. Do not paste copyrighted lectures, book pages or identifiable patient records into the repository.

## Currently implemented
- Dedicated Clinical Pathology Laboratory in the room navigator with Blood Smear Bench, Clinical Path Lab, Patient Consults and Sample Workflow.
- Previous-room button in the main navigator, retaining the original room and save keys.
- Blood Smear Lab supports species filters and photo-based identification with source hidden until after answering.
- 16 additional original hematology questions: canine regeneration, feline aggregate versus punctate reticulocytes, nucleated RBCs, Heinz and Howell–Jolly bodies, equine rouleaux, true agglutination, acanthocytes versus echinocytes, bovine toxic neutrophils and degenerative left shifts, steroid and epinephrine leukograms, avian thrombocytes, feline platelet clumping, monocyte differentiation and iron deficiency.
- Existing study reward ledger: first correct answer earns 10 XP; every 100 study XP earns 10 coins. Repeats do not duplicate rewards. Existing save state remains in localStorage.
- Existing Reception Studio includes furniture and decor collections; broad cross-room object placement is **not yet built**.

## Build clinical pathology by lecture/exam
Material from uploaded course notes/textbooks is a **reference to paraphrase and cross-check**, not content to distribute verbatim. Each lesson should track its course and exam, clinical relevance, species distinctions, image provenance and review status.

| Phase | Teaching content | In-game mechanism | Audit points |
| --- | --- | --- | --- |
| 1. Hematology and smear morphology | RBC morphology, erythropoiesis/regeneration, WBCs, left shifts, toxic change, leukograms, platelets, artifacts, species comparisons | Microscope practice -> explain the change -> choose differential/next test | Absolute counts over percentages, feline reticulocyte types, bovine inflammation, equine rouleaux, image provenance |
| 2. Erythrogram & hemostasis | Regenerative vs nonregenerative anemia, hemolysis, blood loss, iron deficiency, coagulation and thrombocytopenia | Patient CBC trend room and smear-to-case branching | Reticulocyte timing, DIC differential, artifact checks |
| 3. Chemistry & renal/urinary | Azotemia, urine specific gravity, casts, UPC, renal vs prerenal vs postrenal, electrolytes and acid-base | Diagnostic workup with step ordering and plausible distractors | Acid-base calculations, ADH/RAAS compensation and species-specific interpretation |
| 4. Hepatobiliary/muscle/endocrine | Hepatocellular vs cholestatic patterns, functional mass, CK/AST, DM/DKA, HAC, thyroid/Addison's testing | Choose tests and justify signalment/physiology | Avoid diagnosing from single enzymes |
| 5. Cytology | Sample quality; inflammatory populations; septic vs sterile; round, epithelial and mesenchymal cell patterns | Annotated cytology bench, low/high-power views and lesion description | Infection vs reactive vs neoplastic, no overclaiming specific tumor type |
| 6. NAVLE integrated casework | Multisystem cases mixing hematology, chemistry, UA and diagnostic interpretation | Branching case rounds with next-best-step and clinical reasoning | Species ranges, why the body compensates, wrong-answer explanation |

## Navigation and room expansion next steps
1. Replace flat room-nav overflow with grouped floorplan: Lobby, Clinical Wing, Lab Wing, Study Wing.
2. Add explicit previous/next **question** controls within mastered activities; retain history when closing labs.
3. Extend Reception Studio-owned items to room-specific decorative slots with a preview, purchase confirmation, place/move/remove, and collection view.
4. Use the shared collection ledger for purchase/equip actions; do not subtract twice, do not silently lose previously owned items, and do not gate core educational material behind coins.
5. Add art assets only with clear licenses/permissions; track original links separately from answer-revealing photo titles.
6. QA after each change: test fresh state, existing saved state, save/export/import, room navigation and modal events.

## Source and privacy policy
A **private GitHub repository reduces public exposure but does not itself grant copyright permission**. Personal educational use, non-commercial intent and attribution do not automatically license redistribution. Use original questions, properly licensed assets, links, and any instructor-approved materials within the scope of their permission. Do not publish uploaded textbook scans/lecture slides in a public site or repository without appropriate authorization. External photomicrographs should have working source/credit links and a deliberate license check for use in this browser game.

## Medical review
Questions are educational and require verification against current eClinPath, clinical pathology references and course handouts before being tagged exam-reviewed. Interpretation depends on species, lab intervals and patient context. New lessons should have a source note, review status and corrective-feedback path.
