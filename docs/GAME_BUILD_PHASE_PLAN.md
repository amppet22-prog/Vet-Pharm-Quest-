# Vet Pharm Quest — Phased Build Plan
Updated: November 9, 2026

## Core design
**One coherent clinic, multiple connected disciplines:** recognize a finding → explain the physiology/pathophysiology → select diagnostic tests → interpret results → choose next clinical action → revisit misconceptions. The hospital remains a fun customizable learning space; core education never requires coin purchases.

### Current baseline (already in GitHub)
- Existing reception, examination room, treatment, pharmacy, isolation/One Health, study lounge, numerous educational modules, local save export/import and student rewards
- Clinical Pathology room with Blood Smear, Clinical Pathology Lab, patient consultations and diagnostic sample workflow
- Blood smear descriptions, species filters, credited source links and photo identification; new hematology foundation questions
- Radiology Reading Desk: technique/quality challenge, projection guide, structured report drafting
- **Diagnostic Imaging Suite** (new): walkable X-ray table, ultrasound machine, CT workstation and report desk. First activity set has 13 conceptual technique/imaging questions, original labeled schematic visuals and shared question rewards. No real patient scans in these stations yet.
- Reception-only item catalog/placing support; not yet a universal cross-room inventory-placement system
- Back-to-previous-room navigation
- **Treatment Ward diagnostic counter (implemented):** in-room CBC and chemistry analyzers, microscope link, 12 original mechanism-based questions, shared XP ledger and links to Clinical Pathology cases and infectious microscopy. The existing hospital patient, monitoring and treatment cart remain.
- **Cornell eClinPath hematology sources (linked):** Hematology Atlas and RBC Quick Guide are directly accessible from the Blood Smear Lab, with separate source/credit links; species and lesion quiz answers do not display identifying sources before answering.

## Build order / dependencies

| Phase | Priority / effort | Deliverables | Definition of done |
| --- | --- | --- | --- |
| 0 — Save and navigation QA | Highest / small | Test fresh and old save; room go/back, station actions, purchases, collections, imported saves and modal behavior; never change existing localStorage keys | Existing progress survives; stations reachable from navigator and within rooms |
| 1 — Clinic room foundations | High / small–medium / **started** | Activate imaging and clinpath rooms, label working vs planned activities; add room map grouping/floorplan and consistent return controls | Every working lesson has a physical clinic home and clear return route |
| 2 — Hematology & cytology foundation | High / medium | Audit each Clinical Pathology exam/lecture, then blood film morphology, species comparisons, interpretation, true cytology (inflammation/infection/neoplasia), diagnostic workflow and clinical cases | Morphology + mechanism + meaning + next test + species-specific reasoning represented and reviewed |
| 3 — Imaging skill suite | High / medium–large / **started** | Radiographic views and positioning, kVp/mAs technique logic, image quality, ultrasound probe/artifacts, CT windows/planes, **real labeled image practice** from verified authorized sources | Real images have provenance, species, correct view/modality metadata, adequate resolution, source credits and independently checked answers |
| 4 — Purchases, collections & room placement | High / medium–large | Audit Reception Studio purchases vs shared collection; enable equip/unequip, floor/wall item placement in eligible rooms, visual art and pet/clinic-safe decorations | Every paid item appears as owned and can be placed/retrieved without double charging |
| 5 — Cross-disciplinary patient cases | High / large | Deeper branching cases; connect drugs, hematology/chemistry, microbiology, one-health diseases, parasites, diagnostic imaging, and patient outcomes | Every cross-link adds clinical reasoning rather than distracting from the selected exam |
| 6 — One Health / pathogen cross-link graph | Planned / medium–large; **not building yet** | Disease cards link to pathogen appearance, host/reservoir, route of exposure, zoonotic relevance, vector, reportability, key lesions and diagnosis; patients link to One Health and isolation when relevant | Disease IDs are stable across modules, links follow lecture selection and reporting status is species/jurisdiction-aware |
| 7 — Advanced NAVLE / OSCE integration | Later / large | Multi-system NAVLE cases, clinical skill task cards, simulation rounds, progressive mastery tracking, missed-question targeting | Objective-aligned practice with rationales and progress summaries |
| 8 — Art, accessibility, and polish | Ongoing after stable mechanics | Improve 2.5D room art, keyboard and mobile navigation, image zoom, layouts, help/onboarding, collection visuals, export backups | Clear interactive prompts, readable images, accessible back controls; no regression |

### Detailed content architecture
- **One Health / pathogen crossover:** postponed to phase 6, but define connection IDs now: `diseaseId`, `pathogenId`, `hostSpecies`, `exposureRoute`, `relatedCaseIds`, `relatedImagingIds`, `sourceNotes`. Link only meaningful intersections (e.g., zoonoses with diagnostic isolates or pathogen morphology); preserve selected lectures/exams. Reportability must distinguish veterinarian, lab, owner and agency requirements by jurisdiction.
- **Clinical Pathology exam sequence:** begin with existing hematology/blood film question bank, next inflammation and cytology, then renal/UA/acid–base/electrolytes, liver/muscle/endocrine, then integrated cases. Each concept has `whatItLooksLike`, `whatItMeans`, `whyItHappens`, `speciesNotes`, `differentials`, `nextDiagnostic` and source/review state.
- **Imaging machine roles:** X-ray table = projections, positioning, kVp/mAs, radiation safety; ultrasound machine = probe marker, echogenicity, enhancement/shadowing, region-specific cases; CT workstation = cross-sectional anatomy, plane/window selection and basic differential reasoning. Schematic artwork must not be represented as actual radiographs or scans.
- **Study scoring:** shared first-correct mastery 10 XP/question; 100 total first-mastery XP converts to 10 coins. Cosmetics should not penalize the student for repeating questions or prevent learning.
- **Sources:** course lectures, uploaded textbooks and study guides can inform original explanations and questions. Reusing the actual images/text in a published game requires respecting the specific permission/license and audience, even if private and noncommercial. Preserve author/source attribution and keep answer-revealing source titles concealed until the quiz answer.
- **Validation:** before publishing changes, syntax-check scripts, inspect module load order and modal delegated event handlers, test navigation, fresh/migrated saves, purchases and stage art. Browser-based interaction QA is separately required.

## Next focused milestones
1. QA active Imaging Suite and the new Clinical Pathology room with existing saves.
2. Improve station navigation and add imaging projection-selection/positioning diagrams using original artwork.
3. Build actual blood and aspirate cytology identification lessons (cell shape, population pattern, artifacts, what to do next).
4. Reconcile purchased vs placed decor and create a universal clinic collection interface.
5. Begin appropriately licensed real-image imaging and cytology case cards with hidden diagnostic clues.
