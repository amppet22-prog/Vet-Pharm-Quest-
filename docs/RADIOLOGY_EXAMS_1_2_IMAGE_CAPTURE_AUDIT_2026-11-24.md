# Diagnostic Imaging Exams 1–2 — image source and teaching-slot audit
Updated 2026-11-24

## Implementation reality
- Radiology Reading Desk includes eight *text-only* terminology practice exercises (clearly labeled, no radiograph implied).
- Radiology Reading Desk now links **10 already-published, source-attributed radiograph cases** to a three-part workflow: image-based MCQ recognition → student-authored Findings → source-linked Findings/Impression/limitations reveal + self-rating.
- The published image manifest contains multiple additional images, but not every image has appropriate clinical quality or metadata. In particular, do not automatically represent attribution as specialist interpretation.
- These are **existing public source-linked images**, not screenshots extracted from the owner's uploaded lecture PDFs.
- The owner's project files `Radiographic+Interpretation+Fa+26.pdf`, `Radiology Exam 2 .pdf`, and `Abdominal_Radiology_Condensed_Study_Guide.pdf` were indexed and their written content consulted. Raw PDF bytes could not be authorized/materialized in this session, therefore **no lecture page images were cropped**.
- The owner's approval to use lecture images for learning does not automatically establish online-public redistribution rights. Obtain the owner/source's appropriate permission before public GitHub publishing.

## Current real-image bridge
| Exam | Public manifest case ID | Suitable task | Important caveat |
|---|---|---|---|
| 1 | verified-canine-thorax-lateral-vhs | Lateral view; recognize thoracic projection | Marked VHS derivative is a supplementary teaching view, not a patient diagnosis |
| 1 | verified-canine-thorax-vd | VD projection and orientation | Not patient matched to lateral example |
| 1 | verified-feline-thorax-lateral | Bronchial wall mineralization versus active airway disease | Source interpretation, no independently confirmed active inflammation |
| 2 | verified-feline-abdomen-right-lateral | Abdominal projection, incidental spine finding | Source describes T13–L1 spondylosis; GI normality cannot be generalized |
| 2 | verified-canine-gdv-lateral | Gastric distension and compartmentalization | Do not assume simple dilation alone establishes volvulus |
| 2 | verified-canine-cystolith-overview | Mineral opacity/urinary calculi | May be a photographed radiograph, not diagnostic source export |
| 2 | verified-feline-struvite-cystolith | Mineral opacity and compositional uncertainty | X-ray does not independently establish struvite |
| 2 | verified-canine-gdv-second-source | Pyloric displacement and double-bubble appearance | Based on source interpretation |
| 2 | verified-feline-pregnancy-fetal-skeletons | Fetal mineralized skeleton recognition | Does not establish viability |
| 2 | verified-feline-abdomen-foreign-body-shrapnel | Metal opacity, source/position | Single view cannot prove location or compartment |

## Lecture figure capture queue (prioritized)
Every entry requires **source page/slide, figure crop, license/permission status, species, views, image-resolution check, unannotated quiz version and answer/annotated version**. A placeholder is not counted as a completed visual question.

### Exam 1 — fundamentals
1. All **five fundamental opacity groups**, preferably on clear radiographs: gas, fat, soft tissue/fluid, mineral, metal. Existing cases provide partial gas/mineral/metal examples; fat and soft tissue/fluid need clinically clear image regions. Do **not** confuse the term 'radiopaque' with a histologic tissue diagnosis.
2. All **six Roentgen signs**: size, shape, number, location, margination and opacity. Pair the same lesion image with separately tested objective signs.
3. Image display orientation: right versus left lateral, VD versus DV, anatomical markers and common positioning traps.
4. Image quality: collimation/coverage, rotation, motion blur, exposure/quantum noise, respiratory phase. Use real matched films, not generic text where image interpretation is claimed.
5. Artifacts: border effacement/silhouette, superimposition/summation, magnification, shape distortion; paired views or before/after comparison preferred.
6. Modality-specific items (US/CT/MRI) remain routed outside the radiography/X-ray practice collection.

### Exam 2 — abdominal radiology
1. Normal canine and feline lateral and VD abdominal radiographs with anatomy reference, ideally same-patient multi-view sets.
2. Serosal detail: normal versus generalized/focal reduction, with meaningful technique/age/body condition caveats.
3. Stomach: normal position/pyloric orientation, gastric dilation versus source-confirmed GDV; paired views if available.
4. Small intestine: normal diameter/distribution, uniform versus mixed dilation, functional versus mechanical ileus (do not claim a definitive diagnosis from a pattern alone).
5. Plication and linear foreign body (verified example and localization, multiple views).
6. Colon/large intestine: fecal patterns, colonic distension and normal distribution.
7. Free gas versus intraluminal gas, with positional and clinical context.
8. Urinary bladder: normal versus radiopaque calculi; composition caveat, orthogonal localization.
9. Retroperitoneum and kidneys; normal margins, size, and possible mass-effect/displacement.
10. Hepatic/splenic silhouettes and abdominal organ displacement; distinguish mass effect from a diagnosed mass.
11. Reproductive and additional abdominal cases covered in the owner's course material.
12. Reports: same image should support guided recognition → objective short description → complete findings/impression/recommendation.

## Review and publication checks
- Verify existing images load, can enlarge, and do not leak diagnosis in pre-reveal image captions/title.
- Confirm MCQ correct/incorrect feedback, transition to typed response, reference reveal, self-rating and navigation on desktop and iPad.
- Audit spelling and acceptable synonymous terms in text practice (e.g., 'well-defined'/'sharply marginated', 'radiolucent' versus gas-opaque as context).
- Self-ratings are *currently session-only*. Do not claim they sync across devices or to starred cards.
- Publish images only when public usage rights, correct clinical description, attribution and a clear diagnostic-quality review are established.
- Never split multiple views from different patients into a fictional 'same patient' study.

## Backlog acceptance criteria
An image-backed question is ready only when it (1) shows the necessary film without answer leakage, (2) uses source-supported findings, (3) asks a nontrivial but fair question at its designated tier, (4) has a defensible key/rationale and (5) shows attribution/limitations.
