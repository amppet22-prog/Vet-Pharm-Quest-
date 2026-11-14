# Exam 2: starred lecture medications — clinical depth pass (2026-11-14)

## Scope and source selection
Primary source: user's **Pharmacology Exam 2 Study Guide.pdf**. Selection was based on the **main lecture sections and their drug/class tables**, not the opening master summary tables or condensed recap pages.

**Important visibility limitation:** Library text extraction exposes literal star symbols (★), but does not reliably expose PDF bold typography; raw PDF bytes could not be retrieved for an automated font-weight audit. Thus the app differentiates explicit star-next-to-drug evidence from **key starred topic / lecture-chart** context. It does NOT claim all visually bolded drugs have been exhaustively captured.

## Changes committed
- 47 pharmacology entries now have `coursePriority` including extracted lecture-page location and whether a star directly marked the name or emphasis was inferred from a starred lecture section/table.
- 21 new clinical patient-decision cases were added to previously unexpanded priority entries (insulin PZI, detemir, lidocaine, mexiletine, propranolol, amiodarone, hydrocodone, fuzapladib, buspirone, clomipramine, cyproheptadine, flumazenil, alfaxalone, primidone, xylazine, butorphanol, naloxone, calcium borogluconate, phenylpropanolamine, tropicamide, succinylcholine).
- 4 final gaps filled (levothyroxine, amlodipine, diazepam, atipamezole); the other starred-course entries already had patient cases.
- 48 total Exam 2 catalog entries have patient-decision scenarios (47 priority entries plus 1 other).
- Pharmacy reference cards now print source-priority and exact study-guide pages above the clinical scenario.
- No existing drug IDs or questions changed.

## Teaching-quality acceptance standard
Each `clinicalMicrocase` must include:
1. A specific species/patient presentation with a clinical finding.
2. The decision that finding changes.
3. Mechanism or physiology causing that decision.
4. A practical monitoring, avoidance or follow-up action.

Avoid generalities: e.g. 'monitor adverse effects', 'use clinical judgment', or 'check product labeling' without details. For rare human comparators, a short accurately classified reference may be more educational than an invented veterinary case.

## Static testing
- 192 total Exam 2 drug/formulation entries.
- 47 priority drug records, all with a patient decision case.
- 48 total case-equipped records.
- 109 original Exam 2 MCQs unchanged.
- `pharm-next-lectures.js` and `drug-clinical-reference.js` pass JS syntax checks.
- Rendered sample cards: insulin lente, lidocaine, selegiline, primidone, naloxone, I-131, granisetron; lecture priorities and case boxes visible in returned HTML, generic rows suppressed on expanded cards.
- Main hospital and Arcade script versions updated to fetch new content.

## Still open
- Visually verify bold drug formatting against original PDF pages or a raw PDF copy; user explicitly requested **bold as well as starred**, and visual bold selection remains incomplete.
- Full clinical source/label review for each case (dose, route, withdrawal, FDA status) and instructor examination emphasis.
- Browser testing of full course flow, mobile scrolling and question/distractor quality.
- Expand additional actual bolded drugs after source verification without indiscriminately increasing every drug card.
