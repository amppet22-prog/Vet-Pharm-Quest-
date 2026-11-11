# User feedback baseline — Vetquest.pdf (14 pages)
**Imported:** 2026-11-10. **Origin:** user-provided annotated screenshots and comments, pages 1–14. This is a faithful *issue inventory*, not a claim that fixes are complete. Keep user's preferences separate from implementation decisions. The screenshot evidence lives in the uploaded PDF in the ChatGPT project, not in this repository.

## Priority definitions
- **P0 Broken or misleading:** action does not work, money spent without visible result, unclear navigation that blocks a learning activity.
- **P1 Flow & foundational quality:** room roles, shared case/microscope routing, visual clarity, actual learning feedback, and consistent next/back navigation.
- **P2 Art & optional expansion:** larger/cuter scenes, companion options, art upgrades, future materials, without disrupting the core experience.
- **Deferred:** surgery procedural simulation and major imaging additions until course content/implementation is ready.

## Issues by area (original user feedback, paraphrased; see page)
| ID | Room / system | Page(s) | Feedback and acceptance criteria | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| U01 | Overall flow | 1 | Clarify why each room exists, what is learned/tested, accomplishments, links and arcade goals. Remove purposeless or duplicated menus | P1 | Design documented; in-game QA pending |
| U02 | Exam Room | 1,4 | Search/filter **all patient cases** by clinical specialty (cardio, orthopedic, GI, etc.), or choose surprise; explain difference between Patient Chart, Examine Patient and Protocols | P0/P1 | Case library coded on main; live browser QA and chart/protocol integration pending |
| U03 | Treatment ↔ Advanced microscope | 1,5–7 | Treatment microscope must lead to connected advanced microscope activities, but roles differ: in-house rapid patient screening vs morphology reference and specialized interpretation | P0/P1 | Two paths exist; navigation audit and single shared atlas needed |
| U04 | Morphology reference | 1,5–7 | Reference chart needs actual cell photos, all relevant cells, artifact vs disease, easy access to picture identification and learning vs testing labels | P1 | Partial photo atlas; content/rights/photo QA pending |
| U05 | Skin cytology / FNA | 1 | Add skin/ear cytology and fine needle aspirate to microscopy with parasite/fecal diagnostic content | P1 | Not complete; content sources and sample cases required |
| U06 | Reception design | 1–3 | Bigger/cuter reception, clinic hallway and visual door, actual kennel yard **window art** and cat-area **window art**, remove duplicate “Clinical Hall” vs “Clinic Hallway” labels; make clinical hall link unambiguous | P1/P2 | Partly coded; spatial/aesthetic screenshots need review |
| U07 | Reception decor purchase | 2–3 | Store previews currently use generic icons. After buying plants, pumpkin, carriers or pride objects, can't see meaningful visible result. Must render **recognizable object** at deliberate place, preview same artwork, and persist across modes | P0 | Purchase/slot code edited; **not visually tested**, generic Classic 2D emoji slots not satisfactory |
| U08 | Avatar & companions | 3–4 | Fix faded standing avatars; offer more miniature standing horses/cows, snakes, rabbits, turtles, bearded dragons and breed/color variations; prefer customizing companion animals and clinic cat/fish tank to complicated human avatar editing | P2 | User preference; art assets and avatar QA pending |
| U09 | Arcade | 1,4 | Improve actual battle gameplay, course/lecture scope and clear rewards rather than only more menus | P1/P2 | Scope planning |
| U10 | Pharmacy | 4 | Drug shelves good foundation; refine uses, overviews and clinical applicability | P1 | Content gap audit |
| U11 | Imaging | 4 | Larger expansion can wait | Deferred | Existing provisional stations only |
| U12 | Exam Room protocols / Clinical Skills | 4 | Clarify why Protocols differs from case selection and chart; use truly useful practical signs and skills such as mucous-membrane color rather than static redundant guide | P1 | Need role consolidation |
| U13 | Toxicology | 4–5 | Pathway atlas should return to toxicant overview; make toxicant reference easy to reach; audit all lecture toxicants; specific clinical signs and lab trends (increase/decrease), useful real image examples (fescue, gossypol, nuts) | P1 | Coverage/UX gaps |
| U14 | Treatment Ward | 5–6 | Differentiate from Exam and Advanced Lab; multiple complex cases with serial chemistry/urine outputs/trends and treatment adjustments; user reported in-house diagnostic buttons not working | P0/P1 | Cases partly built; click-through QA required |
| U15 | Smear & Advanced Lab | 6–7 | Improve the back/next path between Microscope Detective, Classic Clin Path, Blood Smear, and specialist tests. Some screens lack Back. Clarify “Learn” vs “Quiz” for each station | P0/P1 | Navigation work incomplete |
| U16 | One Health | 6 | Full lecture coverage; audit case inclusion against parasitology, virology and clinical pathology; Back and Next to main One Health page | P1 | Course audit partially done |
| U17 | Advanced Lab | 6–7 | Begin with “what am I seeing?” and normal physiology/pathway, then questions; add real example values, urine sediment explanation and reference images | P1 | UA visual bench added; broader coverage pending |
| U18 | Dog yard | 7–8 | Make it genuinely look like a dog play yard with more attractive fence/playground/background, not an empty interior room | P2 | Art pass pending |
| U19 | Cat corner | 8–11 | This is **not requested as a separate cat yard**. Make cozy customizable cat-cafe-like corner with visible larger cat trees, cute cats/steps/stairs/climbing shelves, ideally reuse selected companion cat art; purchased items must visibly change the scene | P0/P2 | Current SVG scene small; art + purchase QA pending |
| U20 | Mechanism Lab | 12 | Establish specific educational role rather than a redundant room | P1 | Role agreed; activities need audit |
| U21 | Blueprint & hallway | 12 | Cute blueprint artwork should link directly to rooms; hallway doors need to look like actual doors, not only signs | P1/P2 | Eight destinations coded; visual QA pending |
| U22 | Clinical Skills | 13 | Injection and blood-draw practice visuals/anatomy need improvement; specific epaxial site and safe handling pictures, meaningful sample collection demonstrations | P1 | Images and clinical verification pending |
| U23 | Sample handling | 13–14 | Current quick practice questions need visual specimens, tube workflows, and rationale; avoid duplicated buttons that don't teach a procedure | P1 | Specimen-workflow redesign needed |
| U24 | Fecal egg count reduction | 13–14 | Calculation lacks real case context; show **where pre/post EPG data come from**, collection and worked setup, then calculation/interpretation practice | P1 | Calculation exists; case context and teaching needed |
| U25 | Surgery | 6 | Hold major procedural simulation until user takes surgery next year; instrument/suture ID and careful conceptual teaching are appropriate interim ideas | Deferred | No requirement to fake hands-on clamp/ligation |

## Gameplay design decisions proposed in response to these comments (NOT user quotes)
1. **Exam Room** owns the central case library. Patient Chart = current patient's history/labs/progress; Examine Patient = choose/start a case; Protocols = relevant examination/skill tips for this case. Keep fast access to the all-case library.
2. **Treatment Ward** owns in-house workflows and evolving patient panels. Its microscope opens quick screening and can refer to a **single shared advanced image atlas**.
3. **Advanced Clinical Pathology** owns deep morphology, cytology, urinalysis, coagulation/hematology and test selection. Mark each activity explicitly **Learn**, **Practice**, or **Interpret a Patient**. Back must work.
4. **Isolation/One Health** owns infectious disease investigation/reportability; share patients with Exam Room, do not duplicate the patient record.
5. **Companion/decoration rewards** belong to Reception and visible annex spaces, not to disconnected shop lists. Do not charge coins for art assets that have no usable visible placement.
6. **Mechanism Lab** teaches the “why”; Exam/Treatment demands a clinical decision based on the same concept.
7. **Surgery/Imaging** can remain limited without pretending to be complete simulations.

## Immediate verification checklist
- [ ] Live Exam Room filters visible and usable on mobile/desktop and launch correct patients
- [ ] Patient Chart / Protocols / Examine Patient have distinct functions
- [ ] Treatment in-house diagnostic buttons all respond and show interpretation
- [ ] Microscope buttons in Treatment and Advanced Lab return to a consistent home
- [ ] Purchasing floor plant, pumpkin, pride, cat tree and carriers shows conspicuous accurate objects **in actual scene**; no false-positive purchase confirmation
- [ ] No duplicate hallway labels; door and blueprint destinations match actual rooms
- [ ] Cat corner and dog yard clearly distinguish physical spaces and decoration stores
- [ ] Entering any submenu has a working Back to the parent activity
- [ ] Fecal reduction calculator begins with patient case and explicitly provided before/after EPG counts

**Evidence limits:** screenshots show user-observed behavior and appearances at the time they were captured. The screenshot PDF is not itself proof those bugs remain in the latest GitHub code. Mark fixed only after in-browser retest.
