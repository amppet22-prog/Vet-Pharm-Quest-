# Universal answer-feedback standard (effective 2026-11-19)

This is a **project-wide requirement**, not a one-off Pharm/Pathology customization.

## Required graded-answer behavior

- **Correct option = green**, whether selected by the learner or revealed after an incorrect attempt.
- **Incorrect selected option = orange**; never red/pink in question-answer feedback.
- Before submission, neutral/default styling; unselected distractors remain neutral afterward.
- Correctness also needs textual and/or icon labels and a rationale: color must never be the only indicator.
- Apply to Pharmacology, Pathology, One Health, Toxicology, Clinical Pathology, flashcard multiple-choice, clinical case questions, and relevant arcade questions.
- Matching/drag-drop games may have extra interaction states; their final graded correctness feedback should use the same semantics.
- Never mark an answer incorrect merely because it is selected before submission.
- For select-all questions, all correct options become green after submission and selected incorrect ones become orange.
- Do not recolor unrelated buttons, badges, stats, health indicators, or decorative UI.

## Implementation for all future builds

`question-feedback.css` owns shared tokens and legacy-class compatibility. Link it on **every new page with questions**:

```html
<link rel="stylesheet" href="question-feedback.css">
```

For new components, use the explicit, future-proof attribute instead of inventing another color/class naming scheme:

```html
<button class="vpq-answer-option" data-vpq-answer-state="correct">✓ Correct answer</button>
<button class="vpq-answer-option" data-vpq-answer-state="incorrect">✕ Your answer</button>
```

Use the same attribute on an explanation container with `class="vpq-answer-feedback"`.
Don't attach the graded state before the user submits.

## Acceptance tests before publishing

1. Answer correctly: chosen option green; others neutral; explanation visible.
2. Answer incorrectly: chosen option orange; actual correct option green; others neutral; explanation visible.
3. Test each question surface: single-select, multi-select, flashcard MCQ, case, exam, and arcade question.
4. Check desktop and mobile, including disabled answer controls.
5. Confirm correct/incorrect text labels remain legible and that non-question UI was not recolored.
6. New question banks automatically inherit styling without editing their individual entries.

## Entry points configured

- `index.html` — main hospital / learning / pathology / clinical quiz surfaces
- `pharm-arcade.html` — classic Pharm Arcade

**Coverage note:** This stylesheet standardizes question renderers that use the common `right`, `wrong`, `correct`, `incorrect`, or explicit data-state classes. Custom questions that render different markup or inline styles should adopt `data-vpq-answer-state` during their next audit. Do not claim a full end-to-end audit based only on stylesheet adoption.
