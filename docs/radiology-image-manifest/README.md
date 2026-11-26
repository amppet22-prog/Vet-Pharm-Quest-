# Radiology course-image manifest (Claude) · 2026-11-25

Branch `claude/radiology-image-manifest-2026-11-25` · coordination: Issue #40.
The owner uploaded the photo pack as a zip to `main` (a608ddd). This branch **unpacks it into `radiology-course-photos/exam3/`** (87 student images in one folder per slot, plus `_answer-keys/` slide renders) and **removes the zip**. Live game files are unchanged: the images are not yet registered in `diagnostic-imaging-published.json` or shown in any lesson.

## Relation to existing work (not a duplicate)
- `docs/RADIOLOGY_MSK_IMAGE_SOURCE_INVENTORY_2026-11-25.md` (ChatGPT) already inventoried the same sources (284 extracted objects) and kept the extraction outside GitHub.
- This manifest is the **next step**: it maps a curated subset of 87 images to the **existing** Exam 3 slot IDs in `radiology-image-approval-queue.js`. It adds no new slots.
- Integration: reference `repoPath` / `pagesUrl` from the manifest directly. No one-by-one publisher upload is needed. Never show `_answer-keys/` or `studentRole: answer-key-only` images as question images.

## Coverage
| Slot | Images | Source |
|---|---|---|
| e3-practice-hip-gsd | 2 | MSKPracticecases slide 3 (composite split into lateral + VD) |
| e3-practice-mastiff-forelimb | 2 | slide 5 (composite split) |
| e3-practice-puppy-lameness | 2 | slide 7 |
| e3-bone-osteopenia | 4 | MSK1 pp.19–20 |
| e3-djd-stifle | 9 | MSK1 pp.24–25, 34–35 (incl. normals) |
| e3-ocd-shoulder | 2 | MSK1 pp.40–41 |
| e3-bsava-elbow | 10 | MSK1 pp.42, 78, 85–86, 89, 91 (course alternative to BSAVA p.276) |
| e3-msk2-lysis-pattern | 7 | MSK2 pp.4–10 |
| e3-msk2-periosteal | 6 | MSK2 pp.14–19 |
| e3-bsava-infection-neoplasm | 6 | MSK2 pp.24, 26, 30 |
| e3-bsava-healing | 2 | MSK2 p.65 (partial fit: shows chronicity, not a serial healing series) |
| e3-skull-spine | 35 | Spine&Skull pp.5–41 plus paraphrased Gallaher transcript interpretations |

## Key facts for integrators
- The extracted embedded images do **not** contain the slide's "Normal" labels or arrows. Those are separate slide layers, so the files are clean student views. There are 3 exceptions where the label is burned in: `studentRole: answer-key-only`.
- `annotatedKeyRepoPath` points to the rendered slide page (instructor labels and arrows) in `radiology-course-photos/exam3/_answer-keys/`.
- 8 images are `found-unverified`: on the hyperparathyroidism (p9) and nasal (pp.11–12) slides, which image is the normal one is ambiguous. Spine p12 img 015 looks like a duplicate of p11 img 011.
- Rights: `owner-attested-lmu-noncommercial` (owner statement, 2026-11-25: LMU permits course material and assigned textbooks for this non-commercial LMU game). This updates the "reference-only" stance in the existing inventory **by owner decision**. Third-party diagrams (e.g., MSK2 p21 "Modified from Thrall") were deliberately left out of the pack.
- No review state above `matched-to-case`. `medicalReviewed` and `ownerApproved` are false everywhere.

## Candidates not yet mapped (no matching slot exists; integration owner decides)
MSK1: hip dysplasia progression pp.58–65, Legg-Calvé-Perthes pp.68–71, physeal dysplasia (cat) pp.74–75, RCC p.45, HOD pp.48–52, panosteitis pp.55–56, asynchronous growth pp.94–96, IOHC pp.100–102.
MSK2: septic/erosive arthritis pp.33–37, fracture classification pp.40–67, Salter-Harris pp.74–80, avulsion pp.83–84, polyostotic lesions pp.27–32.
The anatomy lecture is not mapped yet. It contains third-party figures on pp.8–9 (Veterian Key), pp.25 and 44 (Today's Veterinary Practice), p.31 (Frontiers, CC BY) and p.34 (atlas).

## Regenerate
`build_pack.py` lists every image → slot decision and rebuilds the pack from the original uploads.

## Published as game cases (PR: Exam 3 photo cases)
`build_exam3_cases.py` registers the photos as **48 cases** in `diagnostic-imaging-published.json` (ids start with `exam3-`, 120 views). This is the same format the owner publisher writes, and it is visible in the Published Imaging Library, Reading Desk and the approval queue (`imageReviewSlot` links each case to its slot).
- Spoiler rules: titles name only the slot topic and slide number. View labels are neutral ("Lateral · view A"). Captions, findings and the diagnosis appear only after **Reveal**. Image filenames are neutral (`<slot>__NN.jpg`).
- The lecture slide is attached as "Annotated teaching key · lecture slide", which the viewer hides until the student chooses to show it.
- `findings` contain only the instructor's slide bullets or the paraphrased Gallaher narration. Practice cases have no answer key in the source, and the case says so.
- Excluded from question views: the 8 `verify` images and the 3 `answer-key-only` images.
- Each case has at most 3 views, so the owner editor can still edit it.
- Re-running the script replaces only `exam3-` cases.

## Case player, multiple choice and extra Exam 3 cases (2026-11-26)
- `radiology-case-player.js`: shared player for lecture cases. Flow: photos (tap to enlarge) → pick-the-answer multiple choice from each case's `answer` → professor findings → annotated slide, with Back / Previous / Next buttons. Grading is green for correct and orange for incorrect. The first correct answer per case earns study XP via `awardQuestion` (namespace `radiology-lecture-case-mc`).
- `answer` labels were added to 43 Exam 3 cases (`build_exam3_cases.py` → `ANSWERS`). Practice cases and view/technique slides have no MC.
- `build_exam3_extra.py` adds 24 `exam3x-*` cases: RCC, HOD stages, panosteitis, hip dysplasia progression, Legg-Calvé-Perthes, physeal dysplasia, erosive joint disease. The answer keys are the **professor-annotated MSK I** slides (the noted copy is +1 page from slide 22).
- Condition cards (`radiology-lecture-condition-casebook.js`) show lecture radiographs via `lecturePairs` (group|title → case ids), and can open them as multiple-choice cases. Also added Previous, Back to the Exam hub, and `open(section, {backLabel, onBack})`. Abdomen pairs point at `exam2-*` ids, which appear once Exam 2 is published.

## Exam 2 · abdomen, GI and GU (2026-11-26)
- `build_exam2.py` builds **54 `exam2-*` cases** (94 student images and 54 annotated keys in `radiology-course-photos/exam2/`) from the owner's annotated copies of Abdomen Cases, GI Principles I & II, Abdomen Principles I & II, Normal Abdomen (Dr. Morris) and Genitourinary.
- Findings and answers come from the **professor's handwritten slide notes**. The owner confirmed the notes are the professor's statements. Nothing was added by Claude.
- Ileus slots: `e2-ileus-mechanical` = 2 yo Lab (GI p18), `e2-ileus-functional` = 4 mo GSD (GI p21–22), `e2-ileus-equivocal` = 2 yo DMH hair-tie cat (Abdomen Cases p12–13, kept equivocal), `e2-ileus-linear-fb-comparison` = 1 yo DSH (GI p25–26).
- Excluded images: projector-screen phone photos (GI p21, Abdomen p35), a stock kitten photo (Normal p16), a burned-in "Normal" label (Abdomen p53) and a cropped detail (GI p11).
- View labels are neutral ("View A/B") because the slide order doesn't reliably tell you the projection.
- `radiology-exam2-hub.js`: the Exam 2 hub (5 sections) using the shared case player, with links to the existing Abdomen Lab and the abdomen condition cards. The X-ray hub's Exam 2 tile now opens this hub.
- Note: ChatGPT's Abdomen Lab only shows ileus images after owner approval in the Photo Approval Queue (`reviewSlots[slot].approved`). These cases are linked to those slots and are ready to approve.

## Professor's notes from Skull & Spine + MSK Anatomy (2026-11-26)
- Skull & Spine answer keys were re-rendered from the **annotated copy** (`6c1a80ee`, same page numbers). `build_exam3_cases.py` → `SPINE_PROF` adds "Professor's notes (class slide)" to 15 spine cases. Two student-authored remarks on those slides ("this is my assumption, she did not comment", "I can't see it") were deliberately **excluded**. Note that they are still visible on the annotated key images.
- The 3 cases previously held back as `verify` (hyperparathyroidism p9, nasal p11 and p12) are now `exam3x-spine-p09/p11/p12`. The annotated slides show which view is Normal.
- 21 **normal MSK anatomy** cases (`exam3x-anat2-*`, Dr. Morris) with MC "name the region and view", linked to `e3-anatomy-projection-quiz`. Third-party figures in that lecture (Veterian Key pp.8–9, Today's Veterinary Practice pp.25/44, Frontiers p.31, anatomy atlas p.34) and the text graphics were excluded.
- Bug fixed: comparison captions said "annotated key", so the player (which hides any view whose label contains "annotated") hid the real photos on 9 Exam 3 and 3 Exam 2 cases. Captions now say "teaching key". Check: 0 cases without visible student images.

## Exam 4 · small-animal thorax & cardiac (2026-11-26)
- `build_exam4.py` builds **119 `exam4-*` cases** (177 student images in `radiology-course-photos/exam4/`) from the owner's annotated copies of Dr. Lynn Griffin's L1, L2, L3 Cases, L4–5 Have a Heart, L6, L7 and L8 Putting it all together.
- Sections (`exam4Section`, ordered by `exam4Order`): `final` (L8: Fred, Toto, Skittle, Shadow, Maeby, pre-TPLO Lab), `patterns`, `mimics` (technique and look-alikes), `lung`, `heart`, `cavity` (pleura, mediastinum, esophagus, trachea, diaphragm, ribs), `cases` (L6–L7 Cases 3–9).
- Text labels: "Professor's notes:" = handwritten slide notes (owner-confirmed as the professor's statements); "Slide:" / "Case notes:" = typed slide text; "Added:" = Claude's own addition (only 2 places: Shadow's aspiration-pneumonia reminder and the GSD gastroesophageal-intussusception case, whose diagnosis is inferred from the slide order).
- One case has no multiple choice on purpose: the pool puppy (L4–5 slides 27–31). The poll slide has no marked answer, so the player asks for written findings and shows both lecture statements.
- Answer keys: annotated lecture slides (`_answer-keys/<lecture>-pNNN.jpg`), comparison films from the same slide (normal dog, post-Lasix, post-tap, highlighted versions; `__cmpN.jpg`) and 6 marked **textbook figures** from the owner's Labeled_rads notes (`_textbook/`: Figs 1.36–1.39, 7.15, 7.17, thymoma/megaoesophagus). All of these are labelled "Annotated …", so they stay hidden until the student answers; textbook legends name the diagnosis.
- Masked or cropped: owner/patient names burned into L8 Shadow/Maeby films, L3 puppy header and L2 p48 miliary films; slide titles cropped off L7 p10 (esophageal FB) and p18 (tracheal hypoplasia). The p18 backpack clip art isn't used.
- Shared player change: shows **every** hidden key (lecture slides, comparisons, textbook) after answering, not only the first; supports `exam4Section` for distractors.
- `radiology-exam4-hub.js` + X-ray hub tile "Exam 4 · Thorax & cardiac"; the 11 thorax condition cards now have `lecturePairs` (pulmonary contusion still has no lecture film).
- Labeled_rads pages 1–7 are MSK/spine, so they're not used for Exam 4.

## Exam 4 · lung pattern guide (2026-11-26)
- `radiology-lung-pattern-guide.js` (`VPQ_LUNG_PATTERN_GUIDE.open(tab)`): a lesson opened from the Exam 4 hub ("📖 Lung patterns: how to see & check them"). Tabs: How to check (5-question flow), Bronchial, Unstructured interstitial, Structured interstitial, Alveolar, Mixed, Look-alikes.
- Each pattern tab has: the tell, "What it looks like" (slide text), "How to check for it" (study aid, labelled as such), lecture films with an unmarked ↔ "Show me where" toggle (marked = rendered annotated slide), the slide's common-causes table, sampling, and a Practice button that plays that pattern's Exam 4 cases.
- Extra teaching slides are rendered into `radiology-course-photos/exam4/_guide/` by `build_exam4.py` (`GUIDE` list).
- Fix: the "highlighted version" rasters on L2 slides 27, 86 and 87 are identical to the plain film (the arrows are vector overlays on the slide), so those comparison views were removed; the rendered slide keys show the arrows.

## Exam 4 · Lungs unit — agreed layout (2026-11-26)
Owner's choices on the layout draft: lessons in a suggested order, all unlocked · 5-question quick checks · practice by skill with "pick how many" · a collapsible list with no titles · same 4 pattern choices every time (look-alikes in Mixed) · same layout for the rest of the game later · owner drawings for patterns, lobes and views when ready.
- `radiology-exam4-lungs.js` (`VPQ_EXAM4_LUNGS.open()`), opened from the "🫁 Lungs — start here" banner in the Exam 4 hub:
  1. **7 lessons** (views · lobes · normal airways/vessels · the 4 patterns · interstitial → alveolar (added at the owner's request) · where = what it means · look-alikes), each with 5 quick-check questions (35 total; every answer cites its slide).
  2. **Practice by skill:** Name the view (9 films from Basics / Radiographic Anatomy, `_skills/`), Which lobe (6), Name the pattern (27 class films, same 4 choices), Spot the look-alike (10), Where = what it means (8), Mixed. Options: 5/10 shuffled or all; "Pick a film" dropdown with Film numbers only; "👉 Show me where" after answering.
  3. **27 class cases, step by step** (72 graded steps) built only from the professor's in-class questions, circled answers, slide answers and case notes; findings and answer keys at the end.
- Exam 4 hub: topic sections are collapsible, film tiles are "Film N" (no titles), and the case player hides the title and lecture until you answer (`hideTitle`).
- Progress: localStorage `vpq-exam4-lungs-v1`; XP namespace `exam4-lungs`.
