# Pharmacology classification and clinical-question audit — 2026-11-14 (continued)

## Source of truth
GitHub Pages / `main`; existing Exam 2 inventory is in `pharm-next-lectures.js`. Preserve drug IDs, question IDs, XP, progress, lecture filters and saved data.

## Verified structural state after this pass
- 185 Exam 2 drug/formulation entries across Lectures 10–20; **0 blank drug class fields and 0 duplicate drug IDs**.
- Drug entries per lecture: L10 6; L11 13; L12 11; L13 15; L14 22; L15 16; L16 9; L17 37; L18 19; L19 12; L20 25.
- 97 original Exam 2 multiple-choice questions; 0 invalid indexed answers or missing WHY in this library.
- 20 explicitly tagged with veterinary relevance/context; the rest have not yet received individualized relevance certification.
- Five neuropharmacology questions upgraded with patient-centered scenarios and plausible pharmacologic distractors; existing question IDs retained.

## Fixes completed
1. Pharmacy taxonomy no longer assigns unrecognized agents to **Antibiotics > Additional drug classes > Unclassified** by default. Prefer explicit drug ID match, then pharmacologic-class matching, then class-preserving lecture grouping.
2. Corrected three historical name-driven category mistakes: selegiline (MAO-B inhibitor, not anti-adrenal family); pergolide (pituitary dopamine agonist); sulfasalazine (5-ASA-related GI treatment rather than antimicrobial sulfonamide shelf).
3. Added separate drug relevance and clinical-context fields for 20 representative human-comparison, limited-use, established veterinary, and special-production-agent drugs.
4. Pharmacy prescribing reference now shows these veterinary-use notes on relevant cards.
5. Refreshed linked Exam 2 curriculum / pharmacy scripts in Hospital and Arcade.

## Important open tasks
- **Not a complete source audit:** reconcile every named agent and unique formulation across all 142 pages of Exam 2 study guide, the answer/practice guide, and Exam 1 lecture source notes. The 185-entry count does not establish that every medication mentioned in class has been imported.
- **Not a visual or browser QA:** test actual shelf nesting, Arcade drug class match, selected-lecture filtering, choices, saved progress, mobile layout, browser cache refresh and case reader.
- The classic Exam 1 pharmacy shelf and every imported class require a distinct name-by-name taxonomy check.
- Continue upgrading 92 remaining original Exam 2 questions and 96 imported practice questions; audit answer correctness independently, rather than automatically preserving potentially incorrect source keys.
- Review specific bacterial indications, labeled vs extra-label indications, species restrictions, adverse effects, drug-drug interactions, monitoring and pharmacologic alternatives for every drug.
- Do not relabel a drug as unclassified merely because it is seldom prescribed in veterinary medicine. Classification and veterinary use are separate fields.
- Lecture source claims and regulatory/clinical evidence should remain separate. FDA feline SGLT2 warnings: https://www.fda.gov/animal-veterinary/animal-health-literacy/two-new-drugs-treat-diabetes-cats-one-right-your-cat . Merck anticonvulsant overview: https://www.merckvetmanual.com/pharmacology/systemic-pharmacotherapeutics-of-the-nervous-system/anticonvulsants-for-treatment-of-animals .

## Next auditing order
(1) All visible 'Unclassified' categories from Exam 1 and Exam 2; (2) L18–20 neuro + analgesia comparison drugs; (3) L10–13 diabetes/endocrine; (4) L14–17 cardiology/GI/autonomic; (5) match-question and case-question quality.
