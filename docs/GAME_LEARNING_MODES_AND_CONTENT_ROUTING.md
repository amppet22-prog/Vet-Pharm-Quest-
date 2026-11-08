# Vet Pharm Quest — Learning Modes, Content Routing & Quality Gates
Updated 2026-11-08.

## One teaching hospital, separate skills

| Where | Learning purpose | Course focus | Source of truth |
| --- | --- | --- | --- |
| Study Lounge → Guided Learning | Explain physiology, drug target, clinical WHY; learn and apply | Saved Pharm lecture groups | `curriculum.js` teaching concepts + pharmacy cards |
| Study Lounge → Mastery | Independent questions, move Previous/Next, flag missed, retest | Saved Pharm lecture groups | Main game lecture questions; shared progress ledger |
| Arcade → Drug Match | Rapid recognition of names, target/mechanism, then clinical cautions | **Saved Pharm lecture groups** | Dedicated curated match catalog in Arcade, to be migrated into common structured question pool |
| Arcade → Bug Battles | Challenge organism, host/transmission, antimicrobial mechanism, resistance | Saved Pharm antibiotic lectures; **opt-in One Health bacteria** | Pharm question bank + `bug-library.js` derived from `one-health-data.js` |
| Arcade → Professor Guide | Instructor-study-guide-aligned recall questions with rationale | Saved Pharm lecture groups and optional Exam Center topic filters | 45 *paraphrased* questions from uploaded course review materials; see 186-item audit |
| Arcade → Exam Boss | Mixed examination questions; score and remediation | Saved Pharm lecture groups and topics | Pharm Arcade exam bank |
| Arcade → Missed Concepts | Revisit incorrect questions within active source focus | Saved Pharm lectures; opt-in One Health bacteria | Arcade question responses, saved independently + activity ledger |
| Main clinic → Examination Room | Multi-step **patient cases** | Case track, species and patient diagnosis; not an Arcade minigame | `window.VPQ_DATA.cases`, `window.VPQ_OH.cases` |
| Main clinic → Treatment Ward | Follow Up → Adjust Care → Watch Trends → Handoff | Individual inpatient and its course-integrated reasoning | Ward patient state and case definitions in `index.html` |
| Main clinic → Pharmacy | Drug details, human/vet relevance, contraindications, source status | Drug name/class | Main pharmacy data + `drug-stewardship.js` |
| One Health & Isolation | Diseases, hosts, reportability, public health | One Health | `one-health-data.js` |

## Saved selection contract

- Pharmacology lecture selections belong to `curriculum.js` and are set in the main Learning Lab.
- Drug Match, Professor Guide, mixed Exam Boss and Pharm Bug Battles must respect active lectures; no silent fallback to unrelated material.
- Bug Battles adds **One Health bacteria** only with an explicit separate option. It does **not** silently reinterpret a Pharm 4 selection as a One Health selection.
- Non-bacterial One Health organisms are not “bacterial enemies”; other infectious game branches may be created later (viral diagnostics, parasite life cycles, fungal identification).
- Show *no matching items* clearly when a selected lecture has no eligible material, rather than fabricating questions.

## Adding new content without creating another game

### A new Pharm medication
Update the Pharmacy base catalog in `index.html`, assign a stable drug ID and lecture; add the human/vet use status and citations in `drug-stewardship.js`. Add recognition/matching prompts separately, based on the same drug ID. Review medical accuracy and species/formulation-specific cautions first.

### A new One Health bacterium
Add the disease **once** to `one-health-data.js` with a stable `id`, `name`, `agent`, source and `gameTags:["bug-battle","bacteria"]`. Create source-linked questions in the same file's `study` array with `diseaseId`, `id`, `q`, `options`, `answer`, `why`, `source`. `bug-library.js` constructs the game registry automatically; no duplicate copy required. **Curate questions for organisms specifically; do not classify merely by appearance of a microbial name.**

### A new Pharmacology professor study question
Assign an original objective ID and a lecture, preserve the uploaded instructor intent without publishing restricted slide content. Author a medically checked explanation, plausible distractors, and at least one differentiation/clinical application. Mark which of the **186 original prompts** it fulfills. The existing 45 paraphrased Arcade-guide questions are NOT the complete 186.

### A new Clinical Pathology, General Pathology, or Toxicology case
Assign a course, lecture/objective IDs, species, clinical findings, interpretation, decision steps, rationale, monitoring, and evolution over time. Cases belong in Examination Room or Treatment Ward depending on whether they are first-visit or follow-up care. Their individual facts can ALSO generate topic questions and cross-course links but should not create a redundant Patient Rounds mode in the Arcade.

## Game improvement backlog

1. **Critical:** Confirm click flow and keyboard navigation in a real browser for every game and ward station. Static JavaScript parse tests and simulated function tests are insufficient as final acceptance.
2. **Critical:** Manually validate each of the 186 original Pharm study prompts against answer content and game questions, not merely lexical similarity; see `docs/PHARM_EXAM1_186_QUESTION_AUDIT.md`.
3. Consolidate edited/custom questions in a versioned, ID-based content registry instead of parallel literal arrays across components; retain learner saves through a migration.
4. For Drug Match, require a unique correct clue per board and rotate unseen drugs; test pool exhaustion and duplicate-avoidance after repeated rounds.
5. For Bug Battles, add staged clinical variations: organism identification → susceptibility/resistance → host/source implications → stewardship/reassessment, not simply repeated recall.
6. Give Mastery previous/next navigation clear completion state and durable resume/restore for unfinished sessions.
7. Validate food-animal drug law, current human-use reserve classifications, species contraindications, and lecture-vs-current-regulation discrepancies.
8. Bring Clinical Pathology serial laboratory changes and Toxicology exposure management into the Treatment Ward once materials are source-mapped and reviewed.

## Quality gate for releases

`source added → objective mapped → medically reviewed → game content linked → filters exercised → wrong answers/remediation tested → browser QA → published`.

Do not label the 186-prompt professor bank **fully exam-ready** until the objective QA is complete. Patient simulations are educational and do not provide individual prescribing advice.

## Copyright and privacy

Do not commit third-party textbook chapters, private lecture decks, restricted exams, patient-identifying details, or unpublished teaching notes to the public repository without appropriate rights. Use original teaching content and attribution/reference metadata where permissible.
