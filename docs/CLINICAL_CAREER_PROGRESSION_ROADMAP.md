# Clinical Career Progression — Levels & Learning Paths

Status: DESIGN ROADMAP (2026-11-08). **Not yet implemented as level-based locks.** GitHub is the source of truth.

## Purpose
Vet Pharm Quest is primarily a veterinary-school learning game. Levels should communicate growth from foundational knowledge to integrated clinical reasoning, while unlocking interesting *ways of practicing and customizing* — not access to essential course information.

## Guiding rules
1. **Never lock assigned lectures, faculty study guide prompts, reference entries, exam-review banks, or accessibility features behind XP.** A student with an exam tomorrow must be able to study immediately.
2. Earn progression from meaningful learning (answering questions, completing cases, revisiting weak concepts, creating or reviewing cards), not time spent clicking, daily streaks, or endless repetitive farming.
3. New levels unlock challenge modes, specialty paths, optional clinic stations, décor and avatar features. Clinical level must not be mistaken for professional medical competence or license.
4. Allow **Practice Now** / preview of future paths at any level; advanced modes may provide a graduated recommended starting point rather than an unbypassable gate.
5. Preserve existing XP, levels, cases and coins. The current game calculates level as `floor(state.xp / LEVEL_THRESH) + 1`; progression must migrate this without resetting players.
6. Learning-path requirements can assess actual concepts independently of global XP (e.g., finish a topic's fundamentals and show rationale-based mastery to earn a specialty badge).
7. Support both curated and user-authored cases/cards. Custom paths can select lecture objectives, patient species, difficulty, answer style and relevant source cards, but imported user content does not silently become authoritative game content.

## Possible progression design (illustrative, subject to balancing)
| Level | Theme | New elective experience | ALWAYS available from level 1 |
| --- | --- | --- | --- |
| 1 | New clinic student | Basic clinic, Lecture Study Desk, drug shelves, One Health and Professor Guide, editing cards | All assigned material and questions |
| 2–3 | Clinical apprentice | Clinical reasoning tutorial, case explanations, first advanced match games, starter décor | All reference materials and exams |
| 4–5 | Junior clinician | Multi-step patient rounds, mixed-topic cases, treatment monitoring station upgrades | All reference materials and exams |
| 6–8 | Clinical problem solver | Optional high-difficulty diagnostic chains and species comparison challenges | All reference materials and exams |
| 9–12 | Service lead | Optional emergency triage path, infectious-disease isolation planning, deeper pharm case building | All reference materials and exams |
| 13+ | Teaching clinician | Player-created learning paths, mentorship-style case editing, advanced multimodal cases, additional room cosmetics | All reference materials and exams |

## Learning-path examples
- **Pharmacology Foundations → Clinical Drug Decisions:** MOA, targets, kinetics → species contraindications → interaction, selection and monitoring cases.
- **Antimicrobial Stewardship:** spectrum, breakpoint/MIC, resistance, stewardship → culture-directed case challenge.
- **Pain & Inflammation:** COX/NSAIDs → anti-NGF therapies → multimodal pain protocols with adverse-effect mitigation.
- **One Health Investigator:** agent/host types → zoonoses → reporting and cross-species differential cases.
- **Veterinary Toxicology (Coming Soon):** exposure/ADME → organ-specific toxicants → stabilization/decontamination cases. Do not activate until content review and question validation.
- **Emergency Triage (future):** physical exam, perfusion, shock, blood gases, electrolytes, drug choices and reassessment.
- **Clinical Skills / OSCE (future):** species handling, procedure steps, calculations, technique and case feedback.

## Reward economy / clinic world
- Completion of a *meaningful* competency step earns XP and optional cosmetic coins; difficulty and novelty can influence rewards, with safeguards against farming.
- Milestone rewards include scrubs, companion accessories, themed wallpaper, room furnishings, reception cat corner, children's play area, and eventually a 2.5D dog kennel/play yard.
- **My Collection** records earned/bought items separately from completed learning paths; previously purchased items are never taken away when a player changes focus.
- Use a clear progression map showing current level, *why* it was earned, upcoming OPTIONAL experiences and what remains accessible.

## User-generated course and case workflow (future)
1. Add/edit a source card or case locally, with learning objective, course, lecture and species tags.
2. Build a new personal practice path from selected cards and desired game modes.
3. Preview question/answer, explanations, distractors, difficulty and scoring before playing.
4. Export/import the learning path as a portable versioned JSON pack.
5. Eventually implement **opt-in shared submissions and review/publishing** through GitHub or a managed backend; never claim browser edits automatically update the game for everyone.

## Development stages
**Next:** visible but nonblocking Career Progress map using the current level, XP, existing badges and clear Coming Soon markers.
**Then:** structured completion tracking for curriculum objective IDs, prerequisites/recommendations and earned rewards.
**Later:** user-authored pathways, advanced case building and true clinic-room unlocks when those rooms actually exist.

## Testing requirements
- Preserve and migrate existing XP and save data; level thresholds are monotonic.
- Core exam and lecture routes always reachable regardless of level.
- Completed challenges never duplicate a one-time reward on refresh.
- Ownership and progress exports round-trip.
- Accessible on keyboard, touch and reduced motion, and readable with the current font.
