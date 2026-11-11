# Vet Pharm Quest — coherent game loop and acceptance criteria
**Status:** Design contract, not a claim of functionality.

## Core principle
Every station has a distinct job: **teach**, **test**, **apply to a patient**, or **customize the hospital**. A topic should have one canonical activity with linked pathways, not duplicated menus or idle buttons.

## Player progression
1. **Reception (optional isometric 2.5-D):** see mascot/pets, walk character, check in patients, customize room, access visible hallway door. A simple 2D mode stays available and retains equal functionality.
2. **Hallway:** actual department navigation and blueprint, not a redundant learning module; back to reception is obvious.
3. **Study Lounge:** select course/lecture, open games/study desk. Selection filters consistently apply downstream.
4. **Teaching Lab:** mechanism-first explanations, species comparison, normal-to-abnormal graphics.
5. **Microscopy and Clinical Pathology:** identify real labeled-source specimens (hide identity until answer) or explicitly labeled teaching schematics. Existing Microscope Detective covers blood smears, UA Visual Bench covers crystals, cells and casts.
6. **Exam Room/Treatment Ward:** one patient, history → predict → CBC/chem/UA → order test → interpret → reassess. Link back to the education station instead of copying a minigame.
7. **Pharmacy, One Health, Toxicology, Imaging, OSCE:** connect their learning and test questions to the same patient/course concept and species.
8. **Cosmetic rewards:** first-time mastery XP/coins unlock art, plant and pet-friendly upgrades. Buy -> owned -> placed -> visible -> persisted -> removable, all verified.

## Reception isometric mode acceptance criteria
- Preserve original artwork, a clearly selectable **2D / 2.5D view**, and existing save values.
- The clinical hallway is physically illustrated as a prominent arch/door *inside the reception image*; tapping/walking enters the actual hallway.
- Character movement works by walking, keyboard and touch; decoration cannot cover a door or interaction.
- Scene uses perspective ground plane and consistent layering of mascot, cat tree, plant pots, wall art, carriers, seating, kennel window and play-yard view.
- Each SKU corresponds to an actual renderer slot in each view. Any item without a renderer must be labeled not yet placeable rather than charging coins invisibly.
- Main Reception Studio, Cat Corner and Yard may use distinct placement inventories, but the Shop/Collection UI must distinguish which room the purchased item belongs to.
- Purchases show immediate confirmation, new balance and item placement; test after reload and switching views.
- Do not start a new independent 3D engine until the existing optional 2.5D implementation has passed browser tests.

## Topic graphics
- Hemostasis (primary and secondary) is a *covered course topic*, not necessarily a new room: vessel response -> platelet adhesion/activation -> aggregation -> coagulation thrombin burst -> fibrin stabilization. Tie these stages to the distinct PT, aPTT, platelet count and vWF laboratory questions.
- Endocrine: consistent graph axes, correct units and timed curves, clear patient context, assay prerequisites and limitations.
- Urinalysis: crystal/cell/cast visual identification -> clinical meaning -> sample collection/handling -> urine chemistry/USG and patient context -> imaging when stone confirmation is needed.
- Blood smear: source-reviewed real images, morphology, CBC pattern, clinical implications.
- One Health/pharmacology: patient management and lecture-selected study questions, not unrelated duplicative modules.

## Acceptance tests before a claim of completion
1. In 2.5D Reception, click/walk to hallway and enter Treatment; return and switch to 2D, and repeat.
2. Earn first-mastered XP/coins, buy a plant, see it in collection and scene, reload, toggle views, store and re-place it without lost ownership.
3. Open UA identification from the Advanced Lab, answer and reveal real atlas reference, continue and return.
4. Navigate a connected smear -> CBC -> patient case without duplicate rewards for one answer.
5. Open hemostasis topic, inspect primary/secondary pathway, interpret test selection, then return to the prior lecture/course choice.
6. Keyboard, mobile and mouse interactions all work; no invisible hotspot covers unrelated objects.
7. All image attributions visible at the right time and image failures have usable fallback text.

## Verified code versus open testing
Source code includes a reception isometric drawing and hallway, separate cosmetic inventories, linked learning activities and the new UA visual module. **Not yet tested in a real browser:** camera switching, depth/occlusion, item rendering for every SKU, mobile navigation, event duplication, rewards, remote photos and saved state across sessions. Cross-device save/account backend is not implemented merely by using localStorage.

## Reception implementation pass — 2026-11-10
- Updated hallway illustration and hit targets to **eight** working destinations: Exam, Treatment, Surgery, Isolation, Clinical Pathology, Imaging, Study Lounge, Pharmacy.
- Reception Studio purchases of wallpapers now immediately set the equipped wall; purchase ledger and coin logic are preserved.
- Classic 2D reception uses **stable, named visual slots** for all 12 decor items instead of rendering only the first five placed items. Isometric drawing continues to read the same reception collection state and its own placement graphics.
- Replaced stale "yard coming soon" shop copy with an explanation of the existing dog and cat annex learning/upgrades. Habitat inventory remains separate and labeled.
- Static JavaScript parse checks passed for modified reception and hallway modules.
- **Still unverified in a browser:** decor clipping, overlay collisions, click-to-walk proximity and actual render on all device sizes; please test buying, placing and reloading a plant/wallpaper in both views before declaring fixed.

## Hospital room-purpose map for review
| Location | Main job | Learning / play action | Boundaries to avoid duplication |
| --- | --- | --- | --- |
| Reception + clinic hall | Start shift, show avatar/pets, navigate, collect patient leads, cosmetic upgrades | Select perspective, door or blueprint, manage clinic coin collection | Do not duplicate clinical exam games at reception |
| Study Lounge / Arcade | Select lecture/exam and choose study vs game | Exam center, short challenges and review | Does not own new clinical patient data |
| Teaching Lagoon / Learning Lab | Explain mechanisms, physiology and normal-to-abnormal pathways | Interactive diagrams and knowledge checks | Link to patient cases rather than repeating them |
| Exam Room | Patient encounter/history and diagnostic planning | Patient signalment, differential ranking, order testing | Source patient record should be reused downstream |
| Treatment Ward | In-house CBC/chemistry, monitoring and care adjustments | Predict analytes, interpret panels, reassess | Specialist detailed microscopy remains in Clin Path Lab |
| Clinical Pathology Lab | Blood smear, marrow, advanced hemostasis, blood gases and urine microscopy | Visual ID, diagnostic test bench, graph interpretation | One canonical microscopy/question pool shared with cases |
| Diagnostic Imaging | Radiography, ultrasound/CT preview, projection/exposure practice | kVp/mAs, positioning, identify findings | Imaging is an ordered diagnostic procedure from a case |
| Pharmacy & Mechanism Lab | Drug shelves, PK/PD, mechanisms, toxicology | Indications/contraindications/choice with explanation | No independent patient queues competing with Exam Room |
| One Health / Isolation | Infection-control, species/host/transmission and reportability | Zoonoses and pathogen-ID challenges | Access from an infected patient's care plan |
| Clinical Skills / OSCE | Collection, injection, restraint and procedure training | Specific species/landmark checks, sample artifacts | Skills feed diagnostic sample quality in patient rounds |
| Surgery Suite | Procedure workflow and anesthesia/sterile practice | Surgery cases and learning checkpoints | Do not imply unsupported full surgical simulation |
| Necropsy | Gross lesion and tissue interpretation | Necropsy / path correlation | Placeholder activities remain labeled until complete |
| Reception Cat Corner + Dog Yard | Species-specific FAS and optional habitat upgrades | FAS scoring and enrichment choices | No extra duplicate clinic shops or patient exam flows |

## Exam Room patient library — 2026-11-10
- New source module: `exam-case-library.js`. Exam Room patient hotspot, reception queue and return-to-all-patients action now open **one case library** instead of the Pharmacology-only list.
- Cases are read from the established `dataCases()` registry. IDs are deduplicated; only genuine staged case records with decisions are shown. A case remains owned by its original course/module, preserves the original question flow, answers, completion tracking and reward behavior.
- Filters: clinical specialty (parasitology; infectious disease and isolation; endocrine; GI; oncology; toxicology; cardiology; orthopedics; clinical pathology; surgery/anesthesia; pharmacology), source course, species, progress, advanced referral, and keyword search. Cases may appear in more than one clinical specialty because the tags derive from case text; tags should receive editorial review.
- Selected Pharmacology lectures remain active by default, with an explicit all-lectures override. This does **not** change the established lecture-selection state.
- Surprise Patient draws only from the currently filtered set; paginated cards provide access to the full matched list without truncation.
- No fabricated patients have been added to fill specialties that may currently be sparse. Empty topics visibly say no matching patient records are currently available.
- Next phase: source-reviewed, explicit clinical specialty tags per patient; specialty-targeted new cases (oncology, orthopedics, toxicology, GI) only where existing source or reviewed original educational writing supports them; one active patient context that can follow between imaging, clinical pathology, pharmacology, isolation, skills and treatment departments. The library alone does not yet transfer patient state between rooms.
- Check completed: JS syntax and simulated browserless smoke test using four dummy cases verified index, specialty tags, duplicate/invalid filtering, one-time completion display, lecture filtering, and pagination control. Real browser interactions and actual production case counts still need validation.
