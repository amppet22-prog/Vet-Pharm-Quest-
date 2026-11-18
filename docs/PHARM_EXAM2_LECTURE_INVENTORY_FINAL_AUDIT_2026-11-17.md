# Exam 2 Pharmacology lecture-by-lecture inventory and question audit — November 17, 2026

## Current GitHub data counts
This is the current state after targeted course-PDF cross-reference, not a claim that all medications have been independently prescribing-level verified.
- Source: user's **Pharmacology Exam 2 Study Guide.pdf** (142 pages), particularly main lecture tables and starred annotations. Tag legend: ★ instructor study-guide focus, ➕ student enrichment. The summary master tables are not used as sole proof of starred priority.
- **210** medication/formulation/lecture-comparator records, up from **192**.
- **53** identified ★/lecture-priority entries: all 53 have full four-field teaching depth (when to choose, physiological why, distinguish from alternatives, monitor/avoid) and a patient decision scenario.
- **145** core MCQs, up from 131. **25** older core MCQs now have revised clinical wording with original versions preserved.
- **96** separate imported practice MCQs (14 revised with original wording and answer stored); **132** instructor source-objective recall cards (24 high-risk objective answers have clinical caution panels).
- The prior generic route and contraindication placeholder patterns were replaced throughout the **210** records (0 matches remaining). Product routes/doses/food-animal withdrawal periods still require individually current product labels.
- 21 previously blanket WHY fields were rewritten from existing mechanism/indication/adverse-effect facts; not all entries have been externally medically audited.

## Lecture-specific current inventory

| Lecture | Drug/formulation/comparator records | Core questions |
| --- | ---: | ---: |
| 10 — Diabetes I | 6 | 12 |
| 11 — Diabetes II | 15 | 14 |
| 12 — Thyroid/parathyroid and metabolic | 12 | 14 |
| 13 — Autonomic and eye | 15 | 13 |
| 14 — Cardiovascular | 22 | 13 |
| 15 — Respiratory / BRD antimicrobials | 29 | 17 |
| 16 — Renal | 10 | 10 |
| 17 — GI/liver/pancreas | 39 | 13 |
| 18 — Behavior, anxiolysis, GABA | 22 | 12 |
| 19 — Anticonvulsants | 13 | 11 |
| 20 — Alpha-2, phenothiazines, opioids | 27 | 16 |

## Concrete missing agents added from course material

### Lecture 15, starred respiratory antibiotic table (guide p.63)
Added 12 individually classified records:
- Metaphylaxis: tulathromycin, gamithromycin, tildipirosin, tilmicosin (macrolide 50S drugs, NOT automatically interchangeable species/production class).
- BRD treatment: florfenicol (amphenicol, bacterial 50S), ceftiofur (third-generation cephalosporin/PBP cell-wall target), enrofloxacin, danofloxacin, pradofloxacin (fluoroquinolones; important U.S. legal species distinction).
- Adjunct host inflammation: flunixin meglumine and ketoprofen (NSAIDs, NOT antibiotics). Course combinations are not separate new antibiotics.
- Small-animal course comparison: amoxicillin-clavulanate (aminopenicillin + beta-lactamase inhibitor, not universal treatment for every cough).
Each record identifies its clinical purpose, microbial or host target, formulation/route context, contraindications and species/regulatory caveats.

**Critical clinical correction:** The original lecture lists pradofloxacin among BRD antibiotics; U.S. labeled Veraflox is a feline product, not a general U.S. cattle BRD approval. Extra-label fluoroquinolone use in food-producing animals is prohibited. Tilmicosin injectable handling includes potentially fatal human cardiotoxicity on accidental injection. Extra-label cephalosporin restrictions in cattle/swine/poultry have specified exceptions/conditions; do not reduce them to a blanket 'all use prohibited'.

### Additional lecture entries
- L11: octreotide and pegvisomant as **nonstarred specialist/comparator** agents mentioned in the acromegaly section, not routine feline diabetes options.
- L12: calcium lactate oral replacement from the source comparison table, distinct from IV calcium borogluconate.
- L18: sertraline (SSRI class comparison).
- L20: medetomidine, and the starred medetomidine–vatinoxan combination.

### Priority star corrections
Added explicit lecture ★ priority markings and full drug-specific teaching depth for **procainamide (p.54), alprazolam (p.106), acepromazine (p.135), buprenorphine (p.139), romifidine (p.133) and medetomidine–vatinoxan (p.133)**. Buprenorphine's previously absent patient scenario was added.

## Question quality work in this continuation
Added 14 advanced clinical scenarios emphasizing BRD metaphylaxis vs treatment, host NSAID vs antimicrobial targeting, tilmicosin occupational hazard, ceftiofur/fluoroquinolone legal distinctions, procainamide renal/ECG concerns, alpha-2 drugs, behavior and opioid receptor pharmacology.

Rewrote 10 additional old core MCQs to remove obvious distractors and test actual physiology (DKA potassium, glargine depot, I-131 selection, diabetes remission, cough clearance, cobalamin/enteropathy, wind-up, hypothyroidism, diuretic-related prerenal azotemia, lidocaine vs mexiletine). Original prompts/options/keys retained in sourceOriginal for comparison.

## QA completed
- Static data integrity: **0 duplicate drug IDs**, **0 duplicate question IDs**, **0 invalid core MCQ answer indices**.
- **53/53** priority entries with teachingDepth and clinicalMicrocase.
- Main Hospital HTML: **96 inline JavaScript blocks** parse without syntax errors; Arcade: **7** parse. Both refer to the latest shared catalog cache version.
- No existing question/mastery IDs were changed; new entries have new IDs. Browser interaction/saving/mobile tests have NOT been performed.

## Important remaining limits
1. Raw uploaded PDF bytes were not accessible for font-color/bold/highlight inspection. Literal ★ is retrievable in PDF text, but **visually bold/yellow-highlighted drugs are not completely certified**. Several priority records are associated with starred lecture sections rather than a star directly on the drug name. A page-image examination of the actual professor-highlighted pages is required for exhaustive bold selection.
2. The chapter-based inventory covers the major lecture tables and named gaps identified in this pass; a complete word-by-word audit of every drug mentioned only in individual free-text paragraphs has NOT been certified.
3. Entire existing **145 core**, **96 practice**, **132 source objective** collections have not received independent medical review item by item. Improved questions remain educational, not professor-authored or a substitute for current care guidelines.
4. Product label indications, drug doses, FDA statuses, restrictions and food-animal withdrawals can change. Where this pass confirmed particular critical legal risks, the relevant FDA sources are:
   - FDA extra-label antimicrobials https://www.fda.gov/animal-veterinary/antimicrobial-resistance/extralabel-use-and-antimicrobials
   - FDA cephalosporin restriction Q&A https://www.fda.gov/animal-veterinary/antimicrobial-resistance/cephalosporin-order-prohibition-questions-and-answers
   - FDA Micotil safety https://www.fda.gov/animal-veterinary/cvm-updates/fda-animal-drug-safety-communication-micotil-300-labeling-change
5. A live-browser test of Hospital shelf visibility, study filters, Drug Match, question feedback, saved progress and mobile display remains open.

## Student exam reminder
Retain lecture-specific I-131 preparation notes (10–14-day methimazole/y/d withdrawal, lecture 3-day no-touch and subsequent gloves) as exam-recall material, separate from facility-specific radioisotope release rules. Feline SGLT2 diabetes agents cannot be used concurrently with insulin or in previously insulin-treated cats for their labeled treatment; euglycemic DKA remains an emergency despite modest glucose.
