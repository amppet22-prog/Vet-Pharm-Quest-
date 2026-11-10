# Microscope & Pathogen Identification — content and photo credits

Implemented November 2026 in `pathogen-microscope-atlas.js` and wired into One Health, Examination Room and the Treatment Ward microscope bench.

## Learning material
- Uploaded LMU-CVM **CVM 713 Parasitology** lecture decks: Lecture 2 (hookworms); Lecture 3 (small-animal ascarids); Lecture 5 (*Strongyloides*); Lecture 6 (gastric/esophageal nematodes); Lecture 8 (equine strongyles/cyathostomins); Lecture 9 (equine ascarids/pinworms); Lecture 10 (selective equine deworming and refugia). Lecture 1 establishes intended diagnostic-stage and life-cycle learning objectives.
- User-provided Veterinary Parasites and veterinary_parasite_master_sheet spreadsheets were inventoried and informed the organism fields and study design. This module is a **curated starter bank**, not a complete audited import of every spreadsheet row.
- Veterinary Clinical Pathology and One Health bridges are original questions informed by that course material. These are educational simulations, not clinical guidance.

## External clinical images (linked, not hosted as files in GitHub)
- **CDC DPDx, Hookworm egg** (group-level representative of *human intestinal hookworms*, not a species-confirmed veterinary *A. caninum* photo). https://www.cdc.gov/dpdx/hookworm/ — image: `https://www.cdc.gov/dpdx/hookworm/images/1/Hookworm_egg_wtmt.jpg`
- **CDC DPDx, *Toxocara* egg**, courtesy New Jersey State Public Health Laboratory. https://www.cdc.gov/dpdx/toxocariasis/ — image: `https://www.cdc.gov/dpdx/toxocariasis/images/1/Toxocara_egg_wtmt.jpg`. CDC identifies egg as most consistent with *T. cati* by size; not enough to label it *T. canis*.
- **CDC DPDx, *Baylisascaris procyonis* egg**, courtesy Dr. Cheryl Davis, Western Kentucky University. https://www.cdc.gov/dpdx/baylisascariasis/index.html — image: `https://www.cdc.gov/dpdx/baylisascariasis/images/1/BaylisEgg_WKU1.jpg`
- **CDC DPDx, *Strongyloides stercoralis* rhabditiform L1**, from human diagnostic reference. https://www.cdc.gov/dpdx/strongyloidiasis/index.html — image: `https://www.cdc.gov/dpdx/strongyloidiasis/images/1/S_stercoralis_rhabditoid_BAM8.jpg`
- CDC DPDx image and rights information: https://www.cdc.gov/dpdx/ . Verify the rights/attribution associated with each individual file before rehosting. Site-wide statements do not supersede third-party exceptions.

## External image resources for future expansion (linked as references only)
- National Center for Veterinary Parasitology (NCVP) parasite image database: https://www.ncvetp.org/parasite-image-database.html . **NCVP says images are available for educational teaching and discussion but must not be published or used commercially without written permission.** They are not copied into this public GitHub repository.
- NC State veterinary parasitology diagnostic image keys: https://parasitology.cvm.ncsu.edu/ . Verify licensing or obtain permission before republishing photos.
- eClinPath: https://eclinpath.com/ for laboratory correlations (separate usage terms apply).
- Merck Veterinary Manual: https://www.merckvetmanual.com/ for independently checking clinical descriptions (separate image use rights apply).

## Quality principles
1. A photo of a generic strongyle/hookworm egg **does not identify a species by itself**; ask at the taxonomic level the specimen truly supports.
2. Some organism species and taxonomy labels in older lecture decks differ from current nomenclature. Preserve the original lecture reference in metadata but explain updates separately after verification.
3. Diagnostic test decisions depend on prepatent period, stage, correct sample type, and clinical probability. A negative float does not rule out all larval infections.
4. Clinical pathology and histopathology links should teach the causal mechanism, not merely mark a buzzword.
5. Review clinical content and external photo links before treating this as a complete course question bank.
6. New microscope quiz history uses a separate key `vpq-pathogen-lab-v1`, without resetting `vpq-v2-clinic-state`.

## Suggested next passes
- Expand photographic egg/larva set with individually license-verified images and pair each with morphology labels, scale and correct ID specificity.
- Import and validate more organism entries from the bacteriology/mycology, virology and parasitology spreadsheets. Maintain per-organism provenance.
- Connect species and lecture filters across the course selection UI; add advanced case simulations including MIC interpretation and imaging.
