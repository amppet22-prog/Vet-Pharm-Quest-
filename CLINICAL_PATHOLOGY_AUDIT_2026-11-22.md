# Clinical Pathology learner-flow audit — 2026-11-22

## Goal
Would a learner who knows nothing about CBC, clinical chemistry, PCV/TS, blood gas, coagulation, microscopy, urinalysis or endocrine send-outs be able to begin at the Clinical Pathology room and learn progressively? One canonical teaching page per test; related activities link to that page instead of duplicating it.

## Structure after sweep
1. Physical Clinical Pathology room: six equipment hotspots — coagulation, blood gas, urine, CBC/chemistry, referral cases and microscopy. Their defined x/y/w/h rectangles are within the room and mutually nonoverlapping. The corresponding physical bench click opens Learn First / equipment guide; CBC/chem opens the hub directly.
2. CBC/Chem hub: **1. Learn how to read a report → 2. Choose CBC, chemistry, PCV/TS, in-house testing or send-out testing → 3. Practice full patient workup**. Species comparisons and optional extra activities are collapsible, not competing top-level menus.
3. Beginner report guide: defines CBC, chemistry, PCV/TS, supplemental diagnostics, how to read printed species/method-specific reference intervals and sample tubes. Compact topic selector replaces horizontal scrolling tabs.
4. PCV/TS: one shared illustrated lesson; read-report and in-house routes point there. No copied PCV mini-lesson on the analyzer hub.
5. In-house and send-out: one catalog per category; selecting any test opens its detailed page with specimen collection, what is measured, directional trends, explanatory original diagram, course/model numerical examples, sample pitfalls, species differences and an interpretation question.
6. Specific diagnostic teaching: full ACTH stim and LDDST response curves; other tests use original mechanism-specific diagrams instead of the same generic four-box workflow. Pattern-based interpretation tables distinguish supporting evidence from proof and recommend follow-up testing.
7. Cases: multistage patient workups disable submission until an answer is selected; answer feedback is green/orange and includes physiology; no redundant inert "review conclusion" button.
8. Bench Learn First targets: coagulation → PT/aPTT guide; gas → pH-first acid-base; urine → USG/UA guide; referral cases → basic reading; microscopy → blood cell morphology. Practice buttons remain available.

## Automated audit evidence
- 55 module-level routes passed JavaScript compilation/initialization and returned nonempty pages after changes: core hub, five categories, 11 report guide routes (including legacy additional-test redirect), all 11 canonical diagnostic test pages, 18 CBC/chemistry species pages (9 groups), four multistage patient entries and five bench guides.
- Representative click identifier tests also passed (five main categories, ACTH/LDDST/other tests, test return buttons, report-guide topics, species selections and a patient choice → submit → next-stage sequence) during code-simulated event delegation.
- Report-topic dropdown's change event successfully opened renal and electrolyte teaching.
- Six physical hotspot rectangles: in-range and 0 rectangle intersections.
- Updated script cache versions in index.html to force new code after page refresh.

## Remaining limitations / next QA (do not claim completed)
- No interactive deployed-browser visual QA was performed. Modal scrolling, actual sprites/benches, click overlays, responsive breakpoints and real mobile input need verification in a browser.
- Automated route checks are simulated and not a browser end-to-end test. They do not establish performance, accessibility with screen readers, game persistence or absence of platform-specific listener collisions.
- Not every clinical pathology lecture, disease, numeric cut-off or species-specific interval has been exhaustively compared with the course lecture slides and textbook. Educational sample values and illustrative reference intervals must not be mistaken for universal clinical thresholds; assay-specific ACTH/LDDST distinctions and slide discrepancies remain explicitly labeled.
- Full referral-case libraries, smear/urine photomicrograph quality, acid-base calculators and the rest of the lab beyond CBC/Chem need dedicated detailed content verification.
- If any bench still opens the old guide on GitHub Pages, hard-refresh and recheck. If it persists, inspect the deployed DOM and runtime console before declaring the issue fixed.

## Clinical learning standard for next changes
**Name the specimen and test → explain what is measured → compare patient value with the relevant RI and unit → describe increase/decrease/within RI → explain physiological mechanism → distinguish clinical differentials and artifacts → choose follow-up → reassess trends.** Use one canonical reference page per test, linked contextually from cases and atlas.
