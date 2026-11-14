# Exam 2 Pharmacology — Phase P6 content QA baseline
Updated 2026-11-14. This is a **structural inventory**, not a slide-by-slide clinical or instructor accuracy certification.

## Current teaching coverage (Lectures 10–20)

| Lecture | Deep learning sections | Drug/formulation entries | Original MCQ | PDF practice MCQ | Source objective recall cards | Objective cards needing review |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Lecture 10 | 6 | 6 | 10 | 3 | 10 | 0 |
| Lecture 11 | 6 | 13 | 10 | 8 | 16 | 0 |
| Lecture 12 | 6 | 11 | 10 | 7 | 6 | 0 |
| Lecture 13 | 6 | 13 | 10 | 7 | 9 | 0 |
| Lecture 14 | 7 | 21 | 9 | 9 | 16 | 0 |
| Lecture 15 | 8 | 14 | 8 | 7 | 8 | 0 |
| Lecture 16 | 7 | 9 | 7 | 7 | 7 | 0 |
| Lecture 17 | 8 | 36 | 10 | 12 | 14 | 0 |
| Lecture 18 | 6 | 19 | 7 | 10 | 16 | 16 |
| Lecture 19 | 6 | 11 | 7 | 10 | 11 | 11 |
| Lecture 20 | 7 | 22 | 9 | 16 | 19 | 19 |
| **Total** | **73** | **175** | **97** | **96** | **132** | **46** |

## Automated structural QA performed

- 193 multiple-choice questions have nonempty prompts, answer options, valid answer indices and WHY explanations.
- No duplicate question IDs across the original Exam 2 and PDF practice MCQ imports.
- Correct-answer index counts (zero-based): 0=45; 1=56; 2=47; 3=45.
- 11 lectures represented in the teaching data; 175 drug/formulation records are **not** necessarily 175 distinct active ingredients.
- Individual review notes are now displayed under flagged source objective cards rather than only surfacing the first caution in a lecture.

## Five imported practice items requiring targeted review

- **exam2-pdf-practice-007 (Lecture 11):** The source's insulin-switching instruction is an exam note, not a patient-specific dosing recommendation.
- **exam2-pdf-practice-014 (Lecture 12):** The T3-vs-T4 feedback explanation may be oversimplified; verify with endocrine physiology resources.
- **exam2-pdf-practice-062 (Lecture 18):** Behavior and aggression are multifactorial; verify categorical monoamine claims.
- **exam2-pdf-practice-084 (Lecture 20):** The blanket 'no alpha-2 works in swine' claim is uncertain; verify with veterinary anesthesia references.
- **exam2-pdf-practice-095 (Lecture 20):** Direct opioid-receptor agonism attributed to catnip is uncertain and should not be treated as established.

## Quality gates still open

1. Reconcile all 11 lecture sections and 132 source prompts against the uploaded study guides, learning objectives, and appropriate veterinary sources; **do not** treat structural presence as proven completeness or clinical correctness.
2. Review statements about insulin switching, T3/T4 physiology, behavior/serotonin, swine alpha-2 drugs and catnip-opioid mechanisms before using them as clinical advice.
3. Test question selection, correctness display, points, saved progress and navigation in an actual browser on GitHub Pages, including refresh/cache behavior.
4. Expose flagged practice-question cautions at their point of use in the general question renderer, where appropriate.
5. Keep original source-authored objective answers separate from vetted medical explanations. Annotate uncertainties rather than silently rewriting instructor study-guide material.
6. Add end-to-end Treatment Ward patient transitions without reintroducing duplicate analyzer stations.

### Preservation requirements
Do not reset existing user save keys, mastery IDs, shop purchases, question IDs or lecture-selection keys. Keep the core-versus-➕ enrichment separation and question-first UX.
