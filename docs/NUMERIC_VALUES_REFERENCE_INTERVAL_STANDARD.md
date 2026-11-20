# Universal numeric-value and reference interval standard

Effective 2026-11-19. Applies to all current and future Vet Pharm Quest teaching hospital questions: Pharmacology (including Clinical Pharmacology), Pathology, Clinical Pathology, Toxicology, One Health, cases, exam center, flashcards, and Arcade.

## Mandatory authoring rule
Whenever a patient vignette includes a laboratory or other clinically interpreted numerical measurement, give the learner species- and specimen-appropriate reference interval(s), or make them accessible with a clearly labeled one-click "View patient reference intervals" control on that question. Never require a student to guess the lab's range to answer a drug-management question. Keep units with both measurement and interval. Prefer the actual performing laboratory's range; published textbook ranges must be identified as general guidance and may differ by analyzer/lab. If numeric measurements are age-, breed-, method- or species-dependent, identify those limitations. Do not invent ranges.

**Exception:** If the objective explicitly asks students to recall, choose, calculate, or otherwise identify the reference interval itself (e.g. "Which is the normal reference range?"), do not reveal the answer before the learner responds. After answering, show the appropriate reference in the rationale.

## Question schema
- `referenceIntervals`: string of species, analyte, units, reference interval, source/method caveat; optional for questions without measured values; required when clinically interpreted values are present unless `testsReferenceInterval` is true.
- `testsReferenceInterval`: boolean, default false; use true only if the question is **about identifying the reference interval**. It suppresses the pre-answer reveal.
- Existing inline ranges in `q` are acceptable and should not be duplicated unnecessarily.
- Render via an accessible `<details><summary>View patient reference intervals</summary>…</details>` near the stem, before answers. A dedicated patient lab table is also acceptable.
- For older banks, flag numeric clinical vignettes that lack an inline/referenceIntervals range for editorial review. **Do not auto-generate purported normal ranges based on regex or species guesswork.**

## Arcade format and flow
- Embedded Arcade has one scrollable question surface; avoid nested scrolling wrappers.
- Hide redundant headers/sidebars on compact question rounds; keep the teaching-hospital Learning Center / Guided Learn routes available.
- Answers remain fully tappable; correct answer = green; learner's wrong answer = orange (see UNIVERSAL_QUESTION_FEEDBACK_STANDARD.md).
- Feedback includes rationale and then easy access to a large Next patient/Next question action; next question begins at the top.
- Keep shared lecture filters, XP, missed-question tracking, and review links. New question types should use the shared question renderer rather than custom competing layouts.

## Review checklist
1. Numeric findings have lab/species-appropriate ranges or an accessible reference control, except explicit interval-testing questions.
2. Correct/incorrect colors do not appear before grading, are clear after grading, and are not the only success cue.
3. Question, options, rationale, Next button and close/back paths work by mouse, touch and keyboard, without nested-scroll traps.
4. Shared lecture selection, grading, missed-concepts history and XP continue working across routes.
