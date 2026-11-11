# Vet Pharm Quest — master project audit and build backlog
**Audit pass:** 2026-11-10 • **Repository:** amppet22-prog/Vet-Pharm-Quest- • **Work branch:** `clinic-cute-station-overlays-20261110` • **Draft PR:** #2

## How to read this audit
This is a **code/repository inspection + project-requirements inventory**, not a complete live browser QA run or line-by-line review of every uploaded lecture. Terms:
- **Confirmed in code:** a particular implementation/file or defect pattern is visible in the repository.
- **Needs browser test:** a code path exists, but user interaction, appearance, mobile layout, rewards and persistence have not been validated in a real browser.
- **Content gap:** some material exists but full exam/lecture objectives have not been mapped to question IDs and image IDs.
- **Future scope:** intentionally not built; never represent a placeholder as a finished station.

## Release gates — do not merge until checked
- [ ] **P0** Browser smoke-test boot on GitHub Pages with no missing scripts, JS runtime errors or blocked cross-origin images.
- [ ] **P0** All room doors, hallway, blueprint, walk-to/click/keyboard hotspots work on desktop and touch, including returning back/forward without stale room state.
- [ ] **P0** Existing state survives upgrade: coins, XP, `rewardLedger`, purchased/placed items, selected lecture filters, pets, avatars, progress, and room identity. Test a saved legacy account/browser and an empty new account.
- [ ] **P0** Earn -> buy -> equip/place -> visible in scene -> reload -> owned/placed still visible -> unequip -> re-equip; evaluate every SKU, not just one.
- [ ] **P0** Medical-review gate on new diagnostic game keys, units, case numbers, animal species, reference intervals, artifacts, and answers; ensure same incorrect assertion is not echoed across games.
- [ ] **P0** Citation/image provenance, attribution, license and hidden-before-answer identity verification for external micrographs and lecture figures. Do not assume free-to-view means permission to republish.
- [ ] **P0** Reset/replay questions shuffle *choices* and avoid repeated exposure/always-correct-first patterns; no mastery-reward farming from repeats.
- [ ] **P1** Verify mobile scroll/zoom/text contrast and long modals; no hidden buttons or overlays intercepting touches.

## Findings / risks (current pass)
| ID | Priority | Area | Evidence/status | Required fix or acceptance test |
| --- | --- | --- | --- | --- |
| QA-01 | P0 | Deployment | PR #2 is draft on development branch; source implementation only | Manual browser test then separately authorize/perform merge/deploy; current main must not be described as updated |
| QA-02 | P0 | Purchases | `reception-customization.js` owns `bag.owned`, `bag.placed`, `bag.equippedWall`; `reception-hallway-and-habitats.js` also has a separate inventory/placement flow | Audit inventory boundaries and renderer visibility against each actual SKU; ensure visible receipt and consistent collection; test reload and visual occlusion |
| QA-03 | P0 | Saves | `index.html` persists a single localStorage state key; class roster/account cloud sync is not established here | Back up and test migration/legacy data; cross-browser sync is **not** implemented by browser localStorage alone |
| QA-04 | P0 | Clinical Pathology | `docs/clinpath-final-coverage-audit.md` shows broad partial coverage | Objective-by-objective index with source lecture/page, exact question ID, answer audit, visual or case stage; do not declare final complete |
| QA-05 | P0 | Photos | `blood-smear-photo-expansion.js` contains four externally linked, credited specimen entries | Confirm each source is reachable, correct species/target, allowed display in public game, and no filenames/alt/caption reveal answer prior to response |
| QA-06 | P0 | Quiz options | Many independently built banks use index-zero canonical answers and shuffle via UI order; not all minigames have been tested | Exercise every bank and ensure choices are actually randomized; inspect Professor Guide, Drug Match, Bug Battles, rounds, and repeated distractors |
| QA-07 | P1 | Navigation | Reception -> clinical hall and hallway wings changed; several layers override navigation/routing | Walk all paths and map pin destinations, verify cross-room back/forward, pointer interaction, light-up proximity cues |
| QA-08 | P1 | Room art | New overlays added to skills, surgery, necropsy; real-station positioning not visually validated | Desktop/mobile screenshots, clickable zones, animals/images, layered equipment, no plant/carrier/pet overlaps |
| QA-09 | P1 | Learn UX | Many modules independently create modal content and handlers | Test overlapping events, Escape/back behavior, scroll reset, focus, keyboard-only use and menu recoverability |
| QA-10 | P1 | Rewards | `masterQuestion(namespace,id,true)` rewards first mastery: 10 XP; 100 study XP triggers 10 coins | Check each new question uses stable unique ID and no repeat payout; ensure coins and HUD update with enough XP; keep purchase tests |
| QA-11 | P1 | Source wording | Both lecture-derived and synthetic cases exist; exact unit/range may differ by lab | Label copied case values, simplified paraphrases and original teaching vignettes differently; cross-check each from uploaded material |
| QA-12 | P1 | Reliability | External real photos may fail network/CORS or have hidden answer in URL | Provide neutral image unavailable fallback, optional source opened after answering, no broken-question trap |
| QA-13 | P1 | Course filters | Pharmacology 1–9 and One Health 1–4 filtering reported previously as unstable | Test selection persistence, questions, game entry points, professor guide and mixed mode, including newly added drugs |
| QA-14 | P2 | Accessibility | Decorative icons/emoji and illustrated stations coexist with text | Add obvious labels, enlarged hitboxes, focus styles, non-color-only indicators, text alternative for chart curves |
| QA-15 | P2 | Account/roster | Friends, leaderboard, cross-device progress discussed | Define privacy, permissions and backend before claiming these features; guest-save currently local |
 
## Product areas and prioritized remaining scope

### A. Clinic world, navigation and art
**Present in source:** reception 2.5D/isometric shadowbox, hallway/blueprint, walkable rooms, specialty rooms (imaging, clinical pathology, surgery, necropsy, skills), shop and collection, kennel/cat corners and FAS learning.
- [ ] P0 actual live walk-through and source-vs-live cache version checks for all rooms
- [ ] P0 verify every purchased decoration is represented by an owned/placed renderer and appears in exactly the intended room
- [ ] P1 reception clinical hallway remains visually present in the art and navigates through hallway, not straight to exams
- [ ] P1 upgrade cute patient/room props, kennel-window scene and station photo overlays; preserve beloved original artwork
- [ ] P1 unify shop SKU/collection UX across reception, cat corner and yard; distinguish scenery from purchasable items
- [ ] P1 remove stale “Coming Soon” copy where FAS/cat/yard features now exist
- [ ] P2 seasonal wallpaper, pride/holiday scenes, additional cosmetics, avatars/outfits, barn/stable area, and verified device synchronization
- [ ] P2 visually validate main mascot caption and correct animal species (dog not cat) in reception

### B. Clinical Pathology (highest educational priority)
**Existing:** smear lab + 4 linked real photo specimens; microscope detective; marrow foundations (8); smear-to-patient (8 cases/24); trend lab (15 cases/45); endocrine Connect the Clues (7); whole-patient rounds (6/24); Diagnostic Test Bench (14); advanced labs.
- [ ] P0 build a complete source-lecture objective/graph/photo inventory covering all exam sets; see `docs/clinpath-final-coverage-audit.md`
- [ ] P0 verify photos from CP4/CP6 early lectures; erythroid islands (original schematic now present), precursor maturation, RBC shapes and inclusions, reticulocytes, nRBCs, species-specific leukocytes and platelet clumps
- [ ] P0 broaden image-ID to real verified slides of schistocyte, acanthocyte, echinocyte, eccentrocyte, Heinz body, Howell–Jolly, rouleaux/agglutination, blood parasites, granulocyte stages and toxic-change categories
- [ ] P0 strengthen tests with full conditions: sample, tube, processing, assay purpose, interpretation, limitations, normal vs abnormal curves and next differential
- [ ] P1 calculation drills (corrected chloride, anion gap, osmolality/effective osmolality, Na:K, acid-base primary/compensatory/mixed) using course-specific equations
- [ ] P1 integrated numerical renal/liver/muscle/GI/pancreas/urine, coags, minerals and endocrine panels from course and clinical chemistry textbook cases
- [ ] P1 serial patient rounds: admit -> predict -> review CBC/chem/UA -> order testing -> recheck -> modify interpretation -> discharge and follow-up
- [ ] P1 distinguish specimen artifact vs in-vivo abnormality with sample handling/recollect simulations
- [ ] P1 final-exam cumulative lecture filter with mixed difficulty, non-duplicate images, randomized options and "why body responds" feedback
- [ ] P1 audit quantitative endocrine scenarios for original units, flags and references; do not assign diagnoses from screening alone

### C. Pharmacology, pharmacy and mechanism lab
- [ ] P0 audit all uploaded Exam 1–9 lecture questions against drug bank, game categories, drug-match options, and new material (NGF monoclonal antibodies / OA agents)
- [ ] P0 validate medical choices: indication vs contraindication, spectrum/generation, Gram/anaerobe target, PK/PD, mechanism, species restrictions, food-animal legality, interactions, and antimicrobial stewardship
- [ ] P1 connect each medication shelf to active quiz/cases and "why choose/not choose" patient decision
- [ ] P1 expand Drug Match beyond class to indications and mechanism with context; reduce repeat presentations
- [ ] P1 consolidate drug name aliases and flag changed/outdated guidance instead of silently replacing original lecture emphasis
- [ ] P2 medicine visual diagrams, nutrition, caution book, toxicology pathway relationships and future new lectures

### D. One Health, infectious disease, parasitology and microscopy
- [ ] P0 ensure One Health Exams 1–4 imported, searchable/filterable, and true source labels are accurate (core vs supplemental)
- [ ] P0 verify reportability by jurisdiction and human vs animal reporting, DH/IH/paratenic hosts, vectors, zoonotic transmission, species, and diagnosis
- [ ] P1 expand Bug Battles with distinct organisms and mechanisms; avoid repetitive distractors and unearned answer hints
- [ ] P1 image-ID microscope for fecals, blood and parasites with multiple ovine/caprine/swine/avian examples and provenance
- [ ] P1 validate species restrictions and disease-specific exceptions (e.g. feline vs vesicular stomatitis)
- [ ] P2 pathogen encounters integrated into clinic case workflow, isolation and One Health choices

### E. Toxicology
- [ ] P1 toxicant-mechanism matching, overlaps by mechanism, absorption and metabolic pathways, competing causes
- [ ] P1 clinical signs, sample choice, antidote principles, monitoring and timing, species-specific toxicity; review all medical keys
- [ ] P1 show original teaching visual mechanisms (including pain pathway), without licensing violations
- [ ] P2 toxicant treatment decisions integrated into treatment ward cases and drug choices

### F. Diagnostic imaging
- [ ] P1 kVp/mAs and exposure/contrast game, collimation feedback, species/region parameter cases
- [ ] P1 normal vs abnormal images and projection/positioning (DP/PD, obliques, pelvis frog-leg), with photo rights and true correct labels
- [ ] P1 ensure X-ray/ultrasound/CT interfaces do not imply nonexistent modalities are clinically functional
- [ ] P2 multi-step imaging choice tied to a diagnostic question and patient case

### G. OSCE/clinical skills
- [ ] P0 ensure blood draw and injection practice images unmistakably match species/body site and overlay target (no fake anatomical claims)
- [ ] P1 station workflow: choose species, route/site, restrain safely, sample tube/order, site check, infection control, artifact and adverse event
- [ ] P1 connect task cards and skills objectives, small vs large animal, horse/bovine/bird variants, castration protocols where provided
- [ ] P1 clinical evaluation/husbandry and FAS scoring patient choices, add only after course notes are available
- [ ] P2 adaptive feedback and practice checklists

### H. Cases, exams and learning architecture
- [ ] P0 shared case registry: one patient/case canonical record, used by multiple stations; source, species, clinical state, correct keys and explanation
- [ ] P0 source audit and answer-key QA for lecture-bank questions, Professor Guide, image-ID and new games
- [ ] P1 progressive scaffolding: Learn -> Identify -> Predict -> Interpret -> Decide -> Reassess, with optional quick practice
- [ ] P1 lecture filter applied consistently to arcade/room/question bank and cumulative final; preserve active selection
- [ ] P1 adaptive review/recent misses and nonrepeating visual questions; keep replay available
- [ ] P1 clear score feedback, history and first-mastery rewards; do not spam coin popups
- [ ] P2 clinical handoff notes, differential ranking and short structured charting tasks

## Next implementation sequence (not additional release promises)
1. Stabilize scripts, save/shop paths, UI routing and first-mastery rewards in browser.
2. Audit the early hematology photo manifest and expand image-ID with permissions and no visible labels.
3. Continue Diagnostic Test Bench: specimen-choice layer, artifact layer, curves with assay constraints, numerical calculations.
4. Extend clinic patient follow-ups and consolidate duplicate cases across rooms.
5. Audit all exam questions and source slides; build cumulative final module with coverage statistics.
6. Perform mobile/desktop QA then consider merge.

## What was checked
- Read project GitHub modules: `index.html`, `reception-customization.js`, `reception-hallway-and-habitats.js`, `clinic-approach-interactions.js`, `advanced-clinpath-stations.js`, `clinical-pathology-lab.js` and portions of clinical image modules from prior passes.
- Checked draft PR #2's changed-file list.
- Reviewed excerpts of uploaded course materials and exam guides for Clinical Pathology hemostasis, thyroid/adrenal, acid-base and early marrow development.
- Added `clinpath-diagnostic-test-bench.js` and linked it in the lab interfaces; runtime gameplay not yet validated.

**Explicitly not checked:** every uploaded lecture/photo by page, every question bank by line, user-device cloud sync, every remote photo URL/rights, cross-device saves, browser-rendered gameplay. These remain open QA work.
