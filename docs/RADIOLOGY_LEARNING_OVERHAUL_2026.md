# Radiology learning overhaul — implementation contract
Status: design/source-mapping draft; **not** integrated into live game or clinically validated.
Date: 2026-11-25.

## Preserve existing implementation
- Retain main Teaching Hospital, X-ray console, modality-specific Imaging Room, login/cloud saves, instructor filters, and owner review/publish flow.
- Before editing executable UI, inspect radiology registration, case IDs, storage schema, and navigation in `index.html` and linked scripts; do not create a duplicate independent interface.
- Preserve old saved case identifiers; migrate via stable IDs where necessary.
- Reuse image viewer/zoom and owner's review queue rather than writing another publishing system.

## Learning sequence (progressive, not four unrelated minigames)
1. **Normal:** projection and species, organ identification, expected variants, positioning and exposure.
2. **Describe:** all visible abnormalities; location/distribution, size/shape, margins, opacity, structure displacement, secondary signs. Multiple findings may coexist and should never be forced into a single-pattern label.
3. **Explain:** radiographic sign → mechanism → likely significance → pitfalls/normal mimics.
4. **Interpret a complete case:** unspoiled patient presentation and actual orthogonal images → learner's structured description → ranked differential diagnoses → imaging/clinical next steps → complete explanation with reference to findings.

Beginner: labeled normal, single evident sign; intermediate: several signs and differential discussion; advanced: multiple abnormalities, misleading history, equivocal and nondiagnostic cases, appropriate uncertainty.

## Required case record
```json
{
  "id":"rad-abd-example-001",
  "course":"diagnostic-imaging",
  "examTags":["exam-2"],
  "region":"abdomen",
  "species":"canine",
  "difficulty":"intermediate",
  "caseStatus":"needs-verified-images",
  "presentation":"Original, nonidentifying clinical presentation",
  "images":[{"assetId":null,"projection":"right-lateral","rightsStatus":"pending","sourceRef":null,"altText":null,"annotations":[]},{"assetId":null,"projection":"VD","rightsStatus":"pending","sourceRef":null,"altText":null,"annotations":[]}],
  "normalFindings":[],
  "abnormalFindings":[],
  "mechanisms":[],
  "interpretation":null,
  "differentials":[],
  "nextSteps":[],
  "teachingPitfalls":[],
  "objectiveIds":[],
  "sourceInventoryIds":[],
  "review":{"imageMatched":false,"medicalChecked":false,"rightsChecked":false,"ownerApproved":false}
}
```
Never expose the answer in the student prompt or filename. Require a real verified radiograph for an image-identification case; placeholders remain **unpublished**. A learner should be able to zoom original images and optionally reveal annotations *after* submitting findings.

## Initial abdominal modules
- **Ileus spectrum:** mechanical vs functional vs equivocal; focal/proximal obstruction, partial obstruction, generalized functional ileus, linear foreign body with plication. Compare distribution, bowel population, diameter, secondary findings, and clinical next steps. Do not claim two populations or segmental dilation is definitive; early/partial and proximal obstruction may be subtle, and linear foreign bodies can lack marked dilation.
- **Foreign material:** radiopaque vs radiolucent objects; recognizable object is not required to see secondary obstructive signs.
- **Other GI:** GDV, suspected volvulus and compromised bowel, pneumoperitoneum.
- **Abdominal anatomy/pathology:** normal stomach, small bowel vs colon, liver/spleen/kidneys/bladder; abdominal mass effect, serosal-detail loss/peritoneal effusion, organomegaly, urinary changes.
- For each, pair an objective, verified example views, a normal comparison where useful, objective findings, WHY/mechanism, differentials, and full case review.

### Original teaching-case outlines (not substituted for course cases)
| ID | Initial presentation | Primary learning objective | Ground-truth/review requirement |
|---|---|---|---|
| ABD-ILEUS-01 | Vomiting dog with small bowel gas | Describe bowel distribution, compare diameter and two populations, distinguish interpretation from confirmation | Image set confirming features and an independently reviewed final diagnosis |
| ABD-ILEUS-02 | Systemically ill postoperative dog with diffuse bowel distention | Explain impaired motility and distinguish generalized dilation from obstructive patterns | Reviewed clinical context; don't imply diagnosis from pattern alone |
| ABD-ILEUS-03 | Vomiting cat with suspected ingestion and mixed bowel findings | Recognize ambiguity; list functional ileus versus early/partial obstruction, plan ultrasound/serial evaluation when appropriate | Maintain **equivocal** label, no forced definitive answer |
| ABD-LFB-01 | Vomiting patient with suspected linear material | Identify plication, short crescent/tear-drop gas pockets and changes beyond simple dilation | Confirmed paired images and clinical diagnosis |
| ABD-MASS-01 | Patient with cranial abdominal mass effect | Describe displaced structures without guessing organ of origin | Reviewed images and additional imaging/clinical confirmation |

## Initial MSK modules
- **Lesion description:** bone, region, site (epiphyseal/metaphyseal/diaphyseal), bone opacity/lysis/proliferation, transition zone, periosteal reaction, cortex, medulla, adjacent tissues and joints; discuss aggressive versus nonaggressive patterns without calling them diagnoses.
- **Fracture language:** bone/segment, configuration, completeness, displacement, angulation, articular involvement, open-vs-closed only when supported clinically.
- **Joint conditions:** OA/DJD, luxation/subluxation, elbow/hip developmental disease and other course-specific conditions.
- **Bone disease comparisons:** osteomyelitis versus neoplasia versus healing/remodeling; recognize imaging overlap and histologic/other diagnostic requirements.
- **Equine MSK:** projection-specific normal landmarks, joint anatomy, common developmental/traumatic changes; map exact conditions to accessible equine lecture and lab material before publishing.
- Build normal/abnormal comparison pairs and a structured description-to-differential exercise for each.

## Thorax follow-on
Bronchial, interstitial, alveolar, vascular and pleural findings should allow **multiple simultaneous patterns**. Describe laterality, distribution, air bronchograms, volume loss, airway changes, cardiovascular changes, and next tests. No single visual pattern should automatically determine a disease diagnosis.

## Source inventory and approval gates
For every source, record `sourceId, filename/location, owner, accessStatus, format, lecture/exam mapping, image page or figure, image rights, radiographic view, duplicateGroup, annotation differences, objectiveIds, cases, validationStatus`.
Course files are for **private source mapping**, not automatic inclusion in a public GitHub repository. Never upload restricted textbook figures, exam pages, patient-identifying information or course slides to public assets without documented permission. Reference location and reviewer status without reproducing material when needed.

Image stages: `missing` → `found-unverified` → `matched-to-case` → `rights-approved` → `medical-reviewed` → `owner-approved` → `published`. An actual case cannot advance to published while any relevant required gate is missing.

## Acceptance criteria before live integration
- Verify no dead links, changed cloud saves, broken exam selectors, or altered X-ray vs other modality navigation.
- Check image rotation, fit/zoom, iPad touch scrolling, original vs annotated variants, accessible alt descriptions, and projection labels.
- Ensure each case has **all** objectively visible findings, not one pattern; capture incorrect/partial descriptions with helpful feedback.
- Verify status/rights and reviewer signoffs. No unverifiable images or image-less image questions in release.
- Perform browser-based QA in addition to static code review.
