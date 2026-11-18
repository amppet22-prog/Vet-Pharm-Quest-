# Pathology Exam 7 — coverage audit: lectures 67–79
Date: 2026-11-18
Scope: Vet Pharm Quest, instructor-derived lecture study material and Necropsy Differential Case Center.

## Audit rules
1. **Teaching content present** means the topic exists in `VPQ_PATH_LECTURE_LEARN[lecture].sections` with its associated lecture slide reference and point-level notes.
2. **Specimen card present** means a matching title was detected in `VPQ_PATH_EXAM7_DATA`, after expansion. Because titles are not standardized, the matching pass is conservative and requires review.
3. **Differential question present** means a curated mapping connects the lecture topic with a simulated four-differential case.
4. **Image attached** means the mapped case has an explicit image entry; a link or a slide number alone is **not** an embedded photo. External images may fail to load and must be visually checked.
5. **Source slide verified** is a separate manual quality-control step. The original lecturer PDFs/PowerPoints and speaker notes, not our paraphrase files, are the authoritative curriculum.
6. Lecture 77 PowerPoint slides after slide 49 were marked **supplementary/non-exam** by the instructor. Do not promote those automatically into exam requirements.

## Existing lecture audit files
| Lecture | Lesson / audit file | Reviewed additional audited sections |
|---|---|---:|
| 67 | pathology-lecture-learning.js | Foundations/normal injury teaching; original lecture representation |
| 68 | pathology-lecture68-audited.js | 44 |
| 69 | pathology-lecture69-audited.js | 50 |
| 70 | pathology-lecture70-audited.js | 33 |
| 71 | pathology-lecture71-audited.js | 64 |
| 72 | pathology-lecture72-audited.js | 53 |
| 73 | pathology-lecture73-audited.js | 43 |
| 74 | pathology-lecture74-audited.js | 48 |
| 75 | pathology-lecture75-audited.js | 43 |
| 76 | pathology-lecture76-notes-audited.js | 53 |
| 77 | pathology-lecture77-speaker-notes.js | 43 |
| 78 | pathology-lecture78-eyes-audited.js | 50 |
| 79 | pathology-lecture79-ears-audited.js | 20 |

Counts above are the audited *sections*, not unique conditions or verified complete exam coverage. The interactive UI uses the loaded lessons at runtime and includes foundational notes plus supplements. It is the more precise source of current UI counts.

## Current cross-coverage
- Seventy-seven curated necropsy differential cases are deployed, each with four etiologic/diagnostic options and mechanism.
- Many lecture topics do **not** yet have dedicated interactive differential cases; this is explicitly visible using **Needs differential case**. The 77 cases include 42 cases for Lectures 71–74 (L71: 5, L72: 12, L73: 14, L74: 11).
- Many do **not** have embedded gross + histology photo pairs; this is visible using **Needs attached photo**.
- Some image records link to references instead of embedding an image. Links must be checked for appropriate species, gross vs histology, provenance, accessibility, and image license.
- Owner image publishing is now implemented through the existing encrypted-key/password GitHub workflow for differential cases, specimen cards, and lecture photo slots. Browser-local drafts remain local until **Publish Now** succeeds; live authenticated browser verification remains outstanding.
- No condition should be described as “complete” solely because it has an instructor note.

## Required next-pass checks
1. Lectures 67–70: compare all gross neurology lesion patterns, PNS disorders, pathogen/species associations, toxins and neoplasms against slides and textbook figures.
2. Lectures 71–74: full skin-condition index, distinguishing morphology and histopathology for bacterial, fungal, parasitic, viral, autoimmune, hormonal and neoplastic disorders. High photo priority.
3. Lectures 75–76: all testicular tumor types, male reproductive inflammation, penile masses, female ovarian neoplasms, uterine inflammatory disorders, mastitis and mammary tumors.
4. Lecture 77: each abortion agent, host, placenta compartment, fetal pathology, maternal history, zoonotic precautions and confirmatory assay, with non-exam supplemental flag.
5. Lectures 78–79: all eye and ear disorders, locations and species-specific visual comparisons.
6. For every disease: identify source slide and/or textbook figure, indicate if external and specify source/attribution, verify medically before attaching or publishing.

## UI
From the Necropsy Case Center, open **Audit all lecture conditions (L67–79)** and choose the lecture. Filter by **All / Needs differential case / Needs attached photo**. Topic cards show notes, specimen, case and attached-image indicators. These are coverage indicators, *not final scientific accuracy certification*.

## 2026-11-18 follow-up: L71–74 differential expansion
- Current case bank: **77 simulated cases**, each with four diagnostic possibilities and rationale.
- Newly added: feline acquired skin fragility, bovine digital dermatitis, lumpy skin disease, bovine papular stomatitis, Senecavirus A, equine canker, porcine dermatitis-nephropathy syndrome, Notoedres cati mange, avian scaly-leg mite, toxic epidermal necrolysis, canine atopy.
- Every new case has a source page and lecture-slide target, but **no claim of an embedded textbook photograph**. Owner can upload and Publish Now with appropriate permissions.
- Imported publisher: `necropsy-owner-publish.js`; keep `docs/OWNER_PUBLISHING_STANDARD.md` as the implementation requirement in every future atlas or photo editor.
- Most important unmet goals: confirm all external photo URLs, provide appropriately licensed gross/histo paired images, build dedicated case questions for every remaining important lecture condition, and end-to-end browser test owner publishing.
