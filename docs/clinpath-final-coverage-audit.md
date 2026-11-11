# Clinical Pathology final — learning coverage and gap audit (working document)

Updated 2026-11-10. **This is a partial audited inventory**, not a claim that every supplied upload has been examined slide by slide. Keep the original files and the instructor's exact wording as the authority; independently verify medical statements, assay cutoffs, and image licenses. This file tracks what needs more work even when a related question already exists.

## Coverage definitions
- **Partial:** At least one live question/lesson exists but the lecture objectives, specimen/photo bank, test conditions, or case variants are not fully covered.
- **Started:** A small introductory lesson/game exists, with known major gaps.
- **Not audited:** No lecture-by-lecture cross-check has been completed; do not infer absence of a topic merely from this document.
- **Verified:** Reserved for each exact lecture objective mapped to tested game questions and appropriately sourced visuals. **Nothing is currently marked fully verified.**

| Exam / block | Source themes observed | Game support now | Status and missing work |
| --- | --- | --- | --- |
| Early hematology: marrow and erythropoiesis | CP4 Hematopoiesis & Marrow Evaluation: erythroid islands, marrow microenvironment, HSC/progenitors, erythropoiesis, granulopoiesis, thrombopoiesis, marrow aspirate vs core, M:E ratio | `clinpath-marrow-foundations.js` (8 items + original island schematic), Blood Smear Lab | **Partial.** Need original lecture photos and morphology checkpoints for maturation stages, progenitor/growth-factor distinctions, marrow cytology, myeloid and platelet development, age/species differences, and quantitative M:E cases. |
| Exam 1: erythron and smear morphology | CP6 Erythrocyte Shapes/Inclusions, CP7 Laboratory Evaluation of Erythrocytes, annotated notes, practice exams | Blood Smear Lab; 4 verified external microscope specimen entries; 8 Smear-to-Patient cases and questions | **Partial.** Visual gap: schistocytes, acanthocytes, echinocytes, eccentrocytes, keratocytes, target cells, stomatocytes, Howell–Jolly bodies, Heinz bodies, basophilic stippling, polychromasia, NRBC, rouleaux/agglutination, species comparisons. Add correct image provenance, hide identifiers until answer, include artifacts vs disease. |
| Exam 1: regenerative anemia and iron regulation | Reticulocytes, EPO, iron/transferrin/hepcidin, hemorrhage, hemolysis, ineffective erythropoiesis | Marrow Foundations, Trend Lab, Smear-to-Patient | **Partial.** Need clinical iron panels, chronic blood loss, inflammatory iron restriction, nonregenerative mechanisms, reticulocyte counting by species, case timing, and graphing marrow responses. |
| Exam 2: leukon and leukogram | Leukocyte cases, stress/inflammation/excitement patterns, left shifts and toxic change | Blood Smear Lab, Smear-to-Patient, Advanced Labs | **Partial.** Need broader species-specific slide photo bank (maturation, toxic change, reactive/atypical cells), absolute versus relative counts, correct patterns with/without left shift, serial neutrophil supply vs tissue demand. |
| Exam 2: thrombogram / hemostasis / marrow disorders | Primary/secondary hemostasis, coag factors, platelet disorders, inherited and acquired bleeding, marrow | Advanced Clinical Path Lab; platelet clumping photo and cases | **Partial.** Need timed PT/aPTT interpretation, mixing tests, fibrinogen, D-dimer, vWF assays, platelet function, citrate fill errors, factor XII deficiency (prolonged aPTT without bleeding), DIC vs vitamin K antagonism, species/breed cases and marrow neoplasia. |
| Exam 3: liver / muscle | Injury vs cholestasis vs hepatic function; leakage enzymes, species differences; CK/AST timing | Whole-Patient Reginald, some other clinical cases | **Started.** Need original multi-system chemistry textbook cases, enzyme-kinetics and isoenzyme comparisons, liver function/portal flow tests, CK/AST serial graphs and histology images. |
| Exam 3: kidney and urinalysis | Azotemia, USG, urine protein/sediment/crystals, renal function | Whole-Patient Marklar, Tinker and proteinuria; Urinalysis Lab; Predict Trends | **Partial.** Need broad urine sediment photo ID, cast/crystal specificity, preanalytic interpretation, renal protein loss and UPC prerequisites, fractional excretion where covered, species comparisons, serial renal cases. |
| Exam 3: pancreas and GI | Pancreatic injury/functional assays, GI loss vs malabsorption | Existing course banks (not individually mapped here) | **Not audited.** Explicitly map cPL/fPL/other pancreatic testing, TLI, vitamin B12/folate, protein-losing enteropathy, inflammation and species/assay limitations. |
| Exam 4: electrolyte chemistry and acid-base | Electrolytes I/II, corrected chloride, anion gap, blood gas and sampling | Trend Lab, Whole-Patient mixed case and Advanced Lab blood gas | **Partial.** Need interactive calculated numeric questions for corrected Cl, AG, Na:K, measured/effective osmolality, stepwise pH→primary→compensation→mixed pattern, and artifact with air/delay/heparin. |
| Exam 4: endocrine tests and graphs | Thyroid, adrenal, glucose, calcium/phosphorus/magnesium; endocrine clinical cases | Connect the Clues (7 staged cases), Whole-Patient Tinker/Bandit, Trend Lab | **Partial.** LDDST A/B/C represented using original SVG redraw; ACTH stimulation, endocrine ACTH differentiation and gray-zone thyroid covered in intro form. Missing calcium/PTH/PTHrP graphs, glucose/insulin/fructosamine, dynamic test selection, collection and interpretation conditions, PPID seasonal ACTH, vitamin D and mineral regulation. |
| Cumulative final exam | All course objectives and annotated case work | Multiple topic games, mixed challenges | **Not audited.** Build a single source registry mapping each objective → source slide/page → learning content → 2+ distinct assessment types → species/assay caveats → test outcome. |

## Critical content-safety and medical-quality checks
1. Verify original source, species, lab units and interval for every quantitative case. Illustrative values must remain visibly labeled.
2. Do not equate low Na:K with a diagnosis of Addison disease, or normal/abnormal one-time thyroid results with final proof.
3. Blood gas pH, pCO2 and compensation must not be inferred from chemistry alone.
4. Never equate a single schistocyte/spherocyte with a specific disease; morphology is evidence interpreted with the rest of the patient.
5. Do not present generated drawings as real cytology photos, and avoid using images with answer labels before a quiz response.
6. When comparing source images, record speaker/author, lecture/page, permission/license, species, target cell, and whether markings reveal the diagnosis.
7. Once the photo manifest is audited, add multiple *distinct* examples for the same morphology and alternate species, rather than repeating the same image.
8. Keep the first-correct-answer reward key unique and do not change legacy save or purchase keys.

## Next recommended implementation queue
- P0: **Image source audit and labeled morphology image bank** for early lecture material, with each image hidden-title before answer, zoom, specimen metadata, and link to matching eClinPath comparison.
- P0: **Diagnostic Test Bench** with test purpose, proper sample/specimen conditions, interference, expected curves, and what is not proven.
- P1: **Numerical acid-base graph/calculation rounds** using the exact course formulas/assay limits and verified laboratory reference intervals.
- P1: **Endocrine/mineral/glucose test coverage**, including calcium/PTH/PTHrP and adrenal/thyroid tests.
- P1: **Serial whole-patient trajectories** from admission to reassessment, linking body compensation and lab trend changes.
- P2: **Complete per-lecture objective reconciliation** and cumulative final-exam adaptive question selection.

## Source coverage checked in this round
- `CP4+Hematopoiesis+and+Marrow+Evaluation+LMU+2026.pdf` — learning objectives, island macrophages, reticulocyte maturation.
- `CP6+Erythrocyte+Shapes+Inclusions+LMU+2026.pdf` and `CP7+Laboratory+Evaluation+of+Erythrocytes+-+LMU+2026.pdf` — erythrocyte patterns, membrane changes, iron regulation.
- `ClinPath Exam 2 .pdf` — platelet and hemostasis themes.
- `Clinpath exam 3.pdf` — hepatic/renal/muscle/pancreatic/GI objectives.
- `ClinPath_Exam4_Updated_Master_Study_Guide.pdf` and lecture extracts — endocrine and acid-base themes.
- Existing GitHub JavaScript banks, including `blood-smear-photo-expansion.js`, `blood-smear-lab.js`, `microscope-detective.js`, `advanced-clinpath-stations.js`, `clinpath-whole-patient-rounds.js`, and `clinpath-connect-the-clues.js`.

**Audit caveat:** This does not yet certify full completeness, clinical equivalence or functionality. Track every original lecture objective before declaring final-exam-ready.
