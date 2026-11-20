# Pathology course quality plan — working baseline
Updated: 2026-11-20. Status: **ACTIVE / NOT YET SOURCE-SIGNED-OFF**.

## Scope and rules
Applies to pathology lectures **1–79** in the teaching hospital (distinct from Clinical Pathology). Covers Learn First, handbook, specimen atlas, morphologic diagnosis, differential patient cases, flashcards, MCQs, and source images.
- Preserve case IDs, published photo IDs/credits, owner edits, save data, question answers, and existing interactions. Make additive changes first; re-fetch GitHub SHA for each change.
- Professor slides/notes and uploaded primary course files are the authority for course-specific content. **Do not infer missing professor objectives or photo contents from titles.**
- Additional Merck/eClinPath/CAPC references can be used for external verification, explicitly labeled as supplemental.
- A file existing or a quantity in a dashboard is **not** evidence of verified completeness. Mark source-specific claims as needing review until the actual lecture is reopened and checked.
- Correct answers green, incorrect selected answers orange. Numeric patient/lab values include species-specific reference intervals unless the question asks for the interval.

## Fixed exam boundaries / course inventory
| Exam | Lectures | Curriculum | Audit state |
|---|---|---|---|
| 1 | 1–16 | General pathology foundations | Needs source/objective audit |
| 2 | 17–30 | Inflammation, healing, immunopathology, neoplasia | Needs source/objective audit |
| 3 | 31–41 | Urinary, hepatobiliary, pancreas | Needs linked-asset audit |
| 4 | 42–49 | Endocrine, hemolymphatic, muscle, skeletal | Needs linked-asset audit |
| 5 | 50–58 | Cardiovascular and respiratory | Needs linked-asset audit |
| 6 | 59–66 | GI/oral/esophageal/gastric/intestinal | High-priority preliminary-index vs detailed-atlas reconciliation |
| 7 | 67–79 | CNS, skin, reproductive, ears, eyes | Needs verified coverage/link audit |

Course numbering source of truth for special senses: **L78 Ears; L79 Eyes** (source file numbers override slide-internal numbers).

## Workstreams (in order)
### Phase A — Inventory + navigation, first execution started
1. Keep a live, read-only **79-lecture quality inventory** in the Pathology MCQ Center / Handbook coverage panel, with section counts, MCQs, recall, specimens, cases, and source-index warnings.
2. Confirm one learning path: exam → lecture → Learn First → gross/histo reference → differential patient cases → recall → MCQs. Preserve the room's existing stations.
3. Route the empty/missing destinations to a truthful explanation, not a blank screen or fabricated content.
4. Identify major duplicates and 'index-only' sections; maintain original IDs/section order where images and editor uploads use indices.
**Done on this pass:** Extended live inventory to L1–79, exposed read-only Foundations page inventory, corrected Exam 2 17–30 and Exam 3 31–41 coverage grouping, added direct lecture links to Learn First / MCQ / atlas / cases.

### Phase B — Exam 6 GI first deep reconciliation
1. Audit **each of L59–66** against its uploaded lecture PDF and objectives. Confirm current exact content, slide/source references, and detailed vs index-only status.
2. Integrate authored disease atlas detail without replacing indexed content or moving keys used by published images.
3. For each featured disease document: species, etiology, lesion distribution, gross, histology, mechanism (adaptive vs maladaptive), diagnostics, differentials and "do not confuse", plus any zoonotic/reportable caveat clearly sourced.
4. Link equivalent entities between Handbook ↔ Specimen Cabinet ↔ Differential Cases ↔ flashcards ↔ MCQ practice. Explicitly mark photos not available.
5. Run a live browser smoke test for each link and a question bank validation (answer key, rationale, duplicates, no giveaways).

### Phase C — Exams 1–2, foundation and neoplasia
1. Objective-by-objective reconciliation for L1–30: clear definitions, cellular mechanism/pathogenesis, morphology, specimen identification and differential comparisons.
2. Distinguish the Foundations page-based lessons from the lecture-section-based source: no false empty-content messages.
3. Evaluate Exam 2 neoplasia atlas/visual photo index consistency and correct question-to-lecture mappings.

### Phase D — Exams 3–5
1. L31–41 renal/urinary, hepatic, pancreatic: source consistency and specimen/diagnostics/case linkage.
2. L42–49 endocrine, hemolymphatic, muscle, skeletal: fuller lecture coverage and differential cases.
3. L50–58 cardiovascular/respiratory: correct species/lesion differences, mechanisms and visual recognition, validate answer explanations.

### Phase E — Exam 7 + all-source quality pass
1. L67–79 lecture numbering and coverage (particularly L76–79), source-matched flashcard/MCQ imports, duplicates and rationale quality.
2. Make sure long case titles are edited only through the ID-preserving title mechanism, not by changing IDs.
3. Align lesion gross/histo/etiology patterns and case-publishing image links.

### Phase F — Release quality and protected foundation
1. Verify every lecture on actual game pages: navigation, responsive display, atlas zoom, editor/publish flow, reload persistence, no missing MCQ bank, active flashcards and cases.
2. Produce lecture-by-lecture signoff record: objectives checked against source, anatomy/species and major lesions, histology, diagnostics/differentials, practice items, image citations, and link QA.
3. Freeze only source-signed-off sections; subsequent changes by explicit request, with regression checks. No blanket "complete" badge before this signoff.

## Review rubric for each lecture
- [ ] Opened exact professor lecture and checked stated learning objectives, slide numbers and notes
- [ ] At least one substantive Learn First path; general/foundation lessons accepted when intentionally page-based
- [ ] Key disorders, pathogenesis, gross + histology, species and differences documented (where covered by the source)
- [ ] Named differential discriminators / confirmatory testing explained without unsupported certainty
- [ ] Appropriate atlas/photo sources; no fake source images or omitted source credits
- [ ] Recall and MCQ bank quality checked: medically accurate, nonobvious, correct orange/green feedback, numeric references when appropriate
- [ ] Differential cases connect back to correct lecture and specimen where available
- [ ] In-game menu, back/next, reload and owner-edit/publication paths smoke-tested
- [ ] Sources, gaps and approval recorded; never auto-signoff from counts

## Live quality audit entry point
Necropsy & Diagnostic Pathology → Handbook → **Lecture Coverage** (existing MCQ Center integration). The inventory is generated from live loaded lessons, foundations, specimen catalog, case records and MCQ bank, so it is a diagnostic tool, not an exact measure of academic sufficiency.

## Known gaps/limitations (confirmed in code at plan creation)
- Original Exam 6 GI source-index describes some sections as **preliminary objective-index entries**. Later detailed GI expansions exist, but need objective-by-objective reconciliation and browser-level linkage checks.
- The shared structured MCQ bank indexes `practiceQuestions` under `VPQ_PATH_LECTURE_LEARN`. Other import formats may have questions elsewhere; zero in that bank **does not** certify no questions in the game.
- Foundation lectures L1–30 can use page-based `VPQ_PATH_FOUNDATIONS`; a zero in section-based data does not automatically indicate missing learning material.
- Source photographs were intentionally not copied from professor slides; "photo missing" is not a permit to reuse a copyrighted slide image.
- No live browser or professor-PDF comparison completed as part of the initial code-level inventory.

## Progress log
- **2026-11-20:** First phase implementation: full 1–79 dynamic coverage, foundations inventory bridge, corrected exam boundaries, linked destination buttons. Continued academic review is required; phases B–F remain open.
- **2026-11-20:** Phase B first content pass: authored 24 source-linked, mechanism-focused structured MCQs for GI L59–66 (three each), without replacing original banks or publisher content. Question choices now shuffle per attempt in the shared pathology MCQ engine; authored keys and IDs are preserved.
- **2026-11-20:** Exam 6 integration pass: created an explicit topic-to-disease bridge covering 53 broad overview headings and 87 exact detailed-atlas links; live GI Quick Learn now exposes those links, while topics without a precise match remain labeled pending. Verification against current code: **24/24 questions attached, zero unmatched; 53/53 curated overview topics have valid detailed links**, among 63 total broad overview topics.
- **2026-11-20:** Remaining GI index-only topics: L59 1, L60 1, L61 0, L62 1, L63 0, L64 4, L65 0, L66 3 = **10** topics needing a separate source-specific detailed addition or justified overview-only treatment. All 79 lessons remain professor-objective signoff pending, and the present checks do not constitute live browser QA.

- **2026-11-20 (continuation):** Added **10 externally sourced, explicitly labeled Merck Veterinary Manual supplemental disease/pattern cards** to cover the last ten GI overview topics (L59 1, L60 1, L62 1, L64 4, L66 3). These are reference-based teaching additions and are **not signed off** as professor-slide-complete. Added one source-referenced clinical MCQ per supplement, plus an original recall item and source URL. All ten new cards append after existing sections to preserve lecture photo/owner edit indices.
- **2026-11-20 (continuation):** Verified by executing the GI modules in teaching-order: **63/63 overview topics linked (97 detailed-reference edges), 10/10 supplemental cards loaded, 10/10 supplemental MCQs loaded, 24/24 original GI-audit MCQs loaded**, and no supplement carried a false 'Pathology Lecture' source attribution. Total newly written GI structured MCQs: **34**. The visible course-quality inventory now flags the ten externally referenced cards as needing professor-source verification.
- **Still required before signoff:** original professor PDF/notes objective-by-objective comparison, correctness and reference-interval checks, image provenance/copyright review, patient-case relationships, and a real browser roundtrip test. No claim of full course completion from automated counts.
