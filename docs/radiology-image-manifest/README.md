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
