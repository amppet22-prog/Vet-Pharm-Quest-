# Blood Smear Laboratory — sources and permissions

## New features
- `blood-smear-lab.js` is connected through the Examination Room, Clinical Pathology Lab and microscope/pathogen station.
- 16 cell/morphology study cards, 25 original recognition/interpretation questions, 3 multistep clinical cases (9 decisions).
- Species choices: all, dog, cat, horse, cattle and bird. They filter **reviewed** questions, not every card to every species.
- Modes: cell identity, RBC morphologies, sample artifacts, CBC/leukogram interpretation.
- Reference atlas links lead to actual eClinPath images. **No images or textbook plates are copied into this public repo at this stage.**
- No writes to existing game save, XP, coins or scores.

## Medical content source basis
1. User-uploaded `Clinical_Pathology_Cumulative_Reasoning_Guide.pdf` (erythrocyte forms, leukograms, interferences); original annotated course notes have priority for exam emphasis.
2. Stockham & Scott, *Fundamentals of Veterinary Clinical Pathology*: erythrogram/leukogram, blood film cell morphology and differential patterns.
3. Cornell University eClinPath:
   - Blood smear examination: https://eclinpath.com/hematology/hemogram-basics/blood-smear-examination/
   - RBC morphology quick guide: https://eclinpath.com/hematology/morphologic-features/red-blood-cells/quick-guide/
   - WBC morphology: https://eclinpath.com/hematology/morphologic-features/white-blood-cells/
   - Toxic change: https://eclinpath.com/hematology/morphologic-features/white-blood-cells/toxic-change/
   - Leukogram patterns: https://eclinpath.com/hematology/leukogram-changes/leukogram-patterns/
   - Collection/storage artifact: https://eclinpath.com/hematology/sample-collection-heme/

## Rights and image roadmap
eClinPath material is © Cornell University under Creative Commons **BY-NC-SA 4.0**; see https://eclinpath.com/terms-of-service/ . Educational reuse requires attribution, noncommercial compliance and share-alike conditions for derivative materials. The GitHub project should assess license compatibility and future monetization before embedding those photographs. Hyperlinks are provided meanwhile.

The next phase needs clearly labeled full-resolution photomicrographs; correct species; morphology-confirmed cell labels; appropriate magnification/scale, and references for each image. Prefer written permission or independently obtained permissively licensed images when available. Do not substitute generated diagrams for actual diagnostic photomicrographs or claim the current quiz already has clickable real cells.

## Accuracy caution
Morphologic findings are interpreted with quantitative CBC results, smear quality, clinical history and species-specific reference intervals. Toxic change is associated with accelerated neutrophil maturation, not proof of circulating bacterial toxins. Cattle can develop neutropenia with left shift early in severe inflammation, while feline Döhle bodies may occur without systemic disease. Question bank is preliminary and not a substitute for formal clinical review.

## Authentic in-game blood smear photos — November 10, 2026
`blood-smear-photo-expansion.js` adds four real, specimen-labeled educational photomicrographs shown directly in the **Real Smear Photo Gallery** and **Identify from a Photo** challenges. Photos are fetched remotely from the source websites and are not committed as binary files to this repo.

1. **Canine spherocytes / IMHA**, original educator arrows: https://vetclinpathimages.com/2018/03/26/spherocytes/ — file `https://vetclinpathimages.com/wp-content/uploads/2018/03/spherocytes-3-canine-2-imha-arrows.png?h=615&w=1024`.
2. **Canine band neutrophil**, original arrow: https://vetclinpathimages.com/2018/01/08/bands-left-shift/ — file `https://vetclinpathimages.files.wordpress.com/2018/01/bands-3-canine-3-arrows.png?w=1024`.
3. **Bovine band neutrophil with toxic change**, original arrows: https://vetclinpathimages.com/2018/01/08/toxic-change/ — file `https://vetclinpathimages.files.wordpress.com/2018/01/bands-10-bovine-6-arrows.png`.
4. **Feline platelet clumping**, Cornell eClinPath: https://eclinpath.com/atlas/hematology/feline-blood/ — file `https://eclinpath.com/wp-content/gallery/feline-blood/plt-comp-clump-cat.jpg`.

**Licensing and credit:** The first three images originate from *Cells and Smears: Veterinary Clinical Pathology Digital Database*, University of Calgary open educational resource, licensed **CC BY-NC-SA 4.0**, https://vetclinpathimages.com/about/ . The feline image originates from **eClinPath / Cornell University**, **CC BY-NC-SA 4.0**, https://eclinpath.com/terms-of-service/ . Attribution, source links, noncommercial use and share-alike conditions apply to the image-based learning materials and derivatives; do not relicense these images as proprietary assets or include in a commercial build without authorization. External photography may require recheck of site access or image availability.

The real-photo questions are original descriptions that identify observable morphology in the image, with species and clinical context checked against the source captions. The remaining text-based morphology items stay available and are still valuable when a photo is not available. The photo quizzes shuffle **display positions** but preserve the indexed correct response.

**Future tasks:** Expand to additional verified equine, canine, feline, bovine, avian and exotic hematology photos, at diagnostic resolution; add annotated multi-cell clickable hotspots only after original photo ownership/coordinate-level labels are validated.
