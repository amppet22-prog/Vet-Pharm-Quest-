# Vet Pharm Quest — Student Preview

A free educational 2D veterinary clinic study game.

## Start playing
Open the published website, or open `index.html` locally in a browser.

## Saving
The game attempts to save progress in local browser storage. Download a complete save backup from the in-game Save / Reset menu before moving between browsers, files, or devices. Browser preview windows and private browsing may not persist saved data.

## For contributors
Please do not upload copyrighted lecture slides, textbook chapters, private student information, or patient-identifying records to this public repository.

To suggest a correction, open a GitHub issue describing the precise question or card, the problem, a proposed correction, and your reference. Submitting GitHub issues requires an account; a no-login feedback form can be added later.

## Clinical safety
This is an educational prototype. Not for diagnosis, treatment, or real-world reporting decisions. Drug labels, species warnings, and reporting obligations require independent verification. The case bank has not undergone full faculty or medical review.

## Learning structure and ongoing development
The main Teaching Hospital is `index.html`; the Arcade is embedded from `pharm-arcade.html` and is reachable from the Study Lounge. They share pharmacology lecture selections through `curriculum.js`.

`one-health-data.js` is the authoritative One Health disease/question/case library. `bug-library.js` derives tagged bacterial challenges from it. `drug-stewardship.js` holds human-versus-veterinary clinical-use distinctions and source links. Five distinct original Arcade patient cases have been moved into the main Examination Room; the other two were already represented there.

See [Learning Modes & Content Routing](docs/GAME_LEARNING_MODES_AND_CONTENT_ROUTING.md) before adding new material, and [Exam 1 186-Prompt Audit](docs/PHARM_EXAM1_186_QUESTION_AUDIT.md) for outstanding coverage verification. Existing professor-guide questions are paraphrases and have **not** yet been certified as covering all 186 original study prompts.

The game saves progress locally in the user's browser. The simulator is still undergoing medical content and browser interaction review.
