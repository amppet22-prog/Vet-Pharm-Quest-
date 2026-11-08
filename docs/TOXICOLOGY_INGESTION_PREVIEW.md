# Toxicology course ingestion pilot — CVM 732

Status: **Coming Soon preview available**, not a playable exam/course, as of 2026-11-08.

## Sources indexed
- User's `CVM 732 - final exam info and hints.pdf`: 20-lecture comprehensive priorities, grouped into a manageable course outline.
- User's `CVM732_Toxicology_L11-19_Compact_Exam_Review.pdf`: toxin-mechanism comparisons, species patterns and recognizable signatures.

## Current implementation
- `toxicology-preview-data.js` holds 11 stable-ID thematic groups covering Lectures 1–20, each with a short mechanism/clinical concept and key terms.
- Accessible through Learning Lab and Study Desk as `Toxicology · Coming Soon` without appearing among selectable active pharmacology or One Health exam banks.
- Each group has a drill-down reference preview. The summaries are explicitly not dosing, antidote or decontamination protocols.

## Import schema being piloted
For each topic:
```json
{"id":"tox-01","lectures":"Lectures 1–2","title":"Foundations & exposure","summary":"...","review":"...","status":"course outline indexed; question bank pending"}
```

## Still to do before course release
1. Inventory **all original lectures, annotations and chats** against lecture numbers, not just these two indexed overviews.
2. Extract and verify full toxin entries by source, mechanism, route, target organ, species, signs, dose caveats, diagnostic approach and management.
3. Add explicit flags for unknown/contradictory/hazardous or date-sensitive treatment guidance.
4. Medical review and provenance for treatment and antidote references.
5. Build lecture-selectable comprehension, clinical cases, and a complete question bank. Only then activate course selection.
6. Browser/keyboard/accessibility test, saved-course progression and migration checks.

**Do not count these 11 index cards as 11 validated lectures or as fully imported toxicology course material.**
