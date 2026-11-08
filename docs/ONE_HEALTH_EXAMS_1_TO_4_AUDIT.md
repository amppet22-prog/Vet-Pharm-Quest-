# One Health III — Exams 1–4 content audit and game integration

**Revision:** 2026-11-08  
**Repository source of truth:** `one-health-data.js`  
**UI:** Main hospital → One Health & Public Health Office → Disease Encyclopedia or Study Desk  
**Status:** File coverage and structural question checks completed. **Not yet certified as a comprehensive medical fact-check or live-browser release test.**

## Scope and files

| Exam | Uploaded reference | How the game uses it | Disease/topic coverage | Dedicated question pool |
| --- | --- | --- | ---: | ---: |
| Exam 1 | `One health exam 1 practice questions.pdf` | Original course-aligned practice questions with rationales; topical cards for rabies, prions, influenza, alpha-gal, AMR, and outbreak surveillance | 7 reference topics | 52 |
| Exam 2 | `One health Exam 2.pdf` | All 19 corrected disease fact-sheet chapters, including species/zoonosis, location, clinical lesions, morbidity, diagnosis, transmission, prevention and human/animal reporting | 19 diseases | 19 new clinical vignettes |
| Exam 3 | `One Health Exam 3.pdf` | 14 disease fact sheets, host-role distinctions, and prior review questions; new application cases added | 14 diseases | 65 |
| Exam 4 | `One health Exam 4.pdf` | 19 integrated disease summaries and prior review items, with corrected serotypes, host exceptions and reporting | 19 diseases | 67 |
| Cross-exam | Combined verified material | Host roles (14) and human-veterinary reporting (50) are separate targeted practice sets | Cross-tagged | 64 |

**Total: 56 distinct encyclopedia entries and 267 study questions** (including the separate host/reporting practices) plus 18 previously available One Health clinical case files.

Some disease entries appear in multiple exam lists (e.g., Toxocara and Campylobacter), so exam rows **cannot** be summed to obtain unique disease count. Each disease carries `examTags` for every relevant course exam.

**Exam 1 PDF caveat:** The PDF cover states 48 questions, but the question sequence and answer key number **52**. All 52 were imported; none silently omitted. This is a *practice exam*, not an official professor exam.

## What was missing / added

The old game contained 38 disease/topic entries and 152 One Health questions, mostly from Exam 3, Exam 4 and reporting. The new audit identified 18 entirely absent Exam 2 entries and an existing Toxocariasis entry that needed its corrected Exam 2 fact sheet attached.

The **18 new disease entries** are African swine fever, classical swine fever, Brucellosis, Rocky Mountain spotted fever, Q fever, Baylisascariasis, Trichinellosis, Taenia solium (taeniasis/cysticercosis), feline panleukopenia, feline infectious peritonitis, dermatophytosis, psittacosis, rat-bite fever, Lyme disease, leptospirosis, histoplasmosis, listeriosis and swine influenza.

New Exam 2 cards include agent and type, species and zoonosis, geographic distribution, clinical and lesion clues, morbidity/mortality, diagnostic testing, transmission, treatment/prevention and human/animal reporting. Distinguishing course corrections are added as `highYield` facts. The encyclopedia displays the explicit role matrix (definitive, intermediate, paratenic, reservoir, vector, accidental/human host).

The Exam 2 study set contains **19 custom single-best-answer vignettes**, one per disease, rather than 54 mechanically generated fact-phrase matching questions that were rejected during quality review. Exam 3 gained 8 and Exam 4 gained 10 additional differential/application questions. Existing questions are preserved, including Exam 1's 52 and the earlier Exam 3/4 pools.

## High-priority accuracy corrections applied

- **ASF vs CSF:** ASFV is an asfarvirus with a DNA genome; CSFV is an RNA pestivirus. Both are important reportable swine diseases; CSF vaccines exist, while the current U.S. ASF prevention approach relies on biosecurity.
- **Trichinellosis:** Naturally infected animals usually have no signs; diagnosis in slaughtered animals is *postmortem skeletal-muscle larval detection*, not a distinctive gross lesion or human clinical presentation.
- **Taenia solium:** Pork cysticerci → intestinal taeniasis; human-fecal eggs → tissue cysticercosis, possibly neurocysticercosis.
- **RMSF:** Canine *thrombocytopenia* is characteristic; a single seropositive result does not establish active disease. Promptly manage strongly suspected cases.
- **Toxocariasis:** `Toxascaris leonina` is distinct from `Toxocara canis/cati`. Human beings are accidental larval hosts, not egg-shedding definitive hosts.
- **Q fever:** Abortion products have high microbial burdens; inhaled aerosols expose people even if infected livestock are otherwise asymptomatic.
- **FIP:** Feline coronavirus and systemic FIP are different clinical concepts; compounded GS-441524 may be used under FDA enforcement discretion, but is not an FDA-approved animal drug.
- **Rat-bite fever:** CDC states this infection is neither nationally notifiable nor reportable in any U.S. state/territory (2024 guidance).
- **Leptospirosis:** Genus is `Leptospira`; early blood and later urinary PCR sampling windows differ. Clinical illness is zoonotic; animal reporting varies.
- **Swine influenza:** High morbidity and relatively low mortality in uncomplicated herds; novel variant human infection is distinct from routine pig disease reporting.
- **Exam 3 host roles:** Nipah fruit bats are reservoirs, pigs are amplifiers; EIA's flies are *mechanical* vectors; Toxocara and Giardia have fundamentally different lifecycle patterns; mpox's natural reservoir remains incompletely established.
- **Exam 4 traps:** Vesicular stomatitis affects horses (unlike typical FMD), cats are *not* standard VS clinical hosts; WNV horse/human dead-end hosts and equine vaccines; Shiga toxin-producing E. coli must not be treated like all E. coli; Salmonella Typhi differs from Typhimurium; don't open a suspected anthrax carcass.

These corrections match the uploaded verified guides and spot-checks of official guidance; the broader set has not had exhaustive independent primary-source verification.

## Teaching game architecture — intentionally unchanged

The user confirmed **Drug Match and Bug Battles already respond appropriately to the selected Pharmacology lectures**. This audit did not redesign either game's controls or scoring.

The One Health library remains the single source for the hospital encyclopedia, cases and derivative Bug Battles bacteriology registry. Adding a disease to the One Health data can be independent of Pharmacy/Pharmacology lecture selection. One Health practice has **Exam 1, Exam 2, Exam 3, Exam 4, Host roles, Reporting** as distinct choices in Study Desk.

## Important limits and next audit pass

1. **Medical/primary source review:** Laws, national reportability, therapeutics, geographic distributions and vaccine status change. Before labeling the entire game clinical-grade, reconcile each disease entry against current CDC, USDA APHIS, WOAH, CAPC or Merck Veterinary Manual material. Record source URLs and review dates. Three specific official source checks were attached to ASF, rat-bite fever and FIP.
2. **Question editor review:** Existing 57-question Exam 3 and 57-question Exam 4 pools and the 38 old Reporting questions predate this pass. Some have generic or ambiguous distractors. Their presence and valid answer indices were verified, **not** complete validity of each question. New 19+8+10 case questions also need an independent item review before being certified as exam-ready.
3. **Advanced select-all:** The Study Desk currently runs **one-best-answer** prompts. Host-role cases are structured around the distinctions your instructor tests, but a dedicated select-all UI with multiple correct responses has not yet been implemented.
4. **Clinical cases:** The 18 previous One Health patient scenarios remain; they have not yet been expanded into longitudinal Treatment Ward cases or clinically validated beyond their old source.
5. **Exam 3 case-only exclusion:** Valley Fever, FMD and Ehrlichiosis were supplied in the Exam 3 material as *case summaries only* in the original source workflow. Do not treat them as Exam 3 standardized fact-sheet requirements solely because they appear in other guides; Valley Fever is separately covered under Exam 4.
6. **Interface QA:** JavaScript syntax and dataset/question integrity checks pass, but full visual/browser testing and accessibility checks remain open.

## Primary regulatory/clinical references (spot checks)

- [USDA APHIS ASF alert](https://www.aphis.usda.gov/livestock-poultry-disease/swine/african-swine-fever)
- [USDA APHIS national reportable disease list (updated 2026-10-26)](https://www.aphis.usda.gov/livestock-poultry-disease/surveillance/reportable-diseases)
- [CDC rat-bite fever clinical overview](https://www.cdc.gov/rat-bite-fever/hcp/clinical-overview/index.html)
- [FDA GS-441524/FIP compounded medication statement](https://www.fda.gov/animal-veterinary/cvm-updates/fda-announces-position-use-compounded-gs-441524-treat-fip)

**Student-use note:** Educational prompts are not diagnostic/regulatory advice for actual patients. Clinical decisions always require patient-specific care, up-to-date source verification and legal jurisdictional interpretation.
