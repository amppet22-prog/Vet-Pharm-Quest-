# Virology species-based patient journeys — November 2026

## Implementation
- `virology-species-journeys.js`: nine original, species-specific cases, appended at runtime to `virology-patient-journeys.js`. All three existing patient scenarios remain.
- `index.html` loads the added source before the patient-journey module.
- The mode runs in the existing Examination Room / Treatment Ward navigation, with staged examination → specimen selection → assay choice → simulated result interpretation → clinical management.
- The patient progression is a modal-based learning journey, **not** a persistent moving character or actual laboratory engine.
- No XP, shop, coin or saved-grade state writes.

## Source material supplied by student
- `8 Viral Diseases Dogs I.pdf`, `9 Viral Diseases Dogs II.pdf`, `10 Viral Diseases of Cats I.pdf`, `11 Viral Diseases of Cats II.pdf`.
- `Bovine Virology 1.pdf`, `Bovine Virology 2.pdf`, `Rumminant Virology 3.pdf`.
- `CVM 723B VIROLOGY PORCINE THACKER SPRING 2026.pdf`, `CVM 723 Viral Diseases of Poultry 2026 - Handout.pdf`.
- `Equine_viral_diseases_LMU_2026.pdf`, `LMU-Eq_Virology_lectures_2025.pdf`.
- `19 Viral Diseases of Wildlife and Pocket Pets.pdf`, `20 Viral Diseases of Aquatic Mammals and Fish.pdf`.
- `Virology Exam 3 (15-22).pdf`, `Virology Exam 3.pdf`, `VirusFamilyTable.pdf`, `virus-families-chart-by-size.pdf`.
- `Ultimate_Vet_Virology_Master.pdf`, `Master_Veterinary_Virology_Chart.pdf`, `Vet_Virology_Exam_Survival_Sheet.pdf`; previously provided Exam 1–2 summaries.
- Attribution is to uploaded teaching sources; **course slides and images are not republished in the repository**.

## Case-to-course mapping
| Case | Lecture basis | Core diagnostic distinction |
| --- | --- | --- |
| Luna / feline panleukopenia | Cat lectures 10–11 | Fecal antigen + CBC leukopenia; test limitations |
| Pepper / FIV & FeLV | Cat lecture 11 | FIV antibody vs FeLV antigen |
| Clover / BVD | Bovine RNA virus lectures | Direct detection vs confirmed persistent infection |
| Hazel / PRRS | Swine Thacker lecture | RT-PCR interpreted in reproductive-respiratory outbreak |
| Briar / Newcastle | Poultry handout | Molecular testing, characterization and official reporting |
| Cedar / orf | Small Ruminant Viruses slides 2–5 | Lesion PCR and zoonotic precautions |
| Aspen / EHD | Wildlife lecture 19 slides 6–7 | Culicoides vector; EHD/BTV differential |
| Echo / WNV | Equine virology notes | IgM; birds and mosquitoes; dead-end hosts |
| Ripple / koi herpesvirus | Aquatic lecture 20 | Gill sampling/PCR and aquatic biosecurity |

## Editorial and accuracy notes
- Maintain **source-derived content distinct from later online updates**, especially taxonomy, outbreak status, diagnostic assays, vaccination policies and reporting requirements.
- The CFSPH charts supplied by the student are © 2023; they are useful for family/genome/host comparisons but current taxonomy and public-health/regulatory status should be verified before making an item on those changing facts.
- Some student handouts simplify complex agents (e.g. BVD PI diagnosis, feline coronavirus/FIP pathogenesis). Patient scenarios use cautious interpretation and should undergo item-level expert review.
- Prion diseases are separate from viruses and should be coded in their own pathogen category, despite appearing in virology courses.
- Current coverage is curated rather than a complete import of every lecture organism, especially non-mammalian viruses and ancillary virus-family tables.
- No external or classroom lecture photographs were copied to the public repository. Future rehosting requires image-level permission assessment.
