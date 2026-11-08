# NGF Analgesics and Pharmacy ↔ Toxicology Reference

Status: GitHub-integrated initial clinical reference, Nov 8 2026. Independent full-course toxicity audit still pending.

## Anti-NGF concept
- NGF acts through TrkA/p75NTR to enhance nociceptive sensitization and neurogenic inflammation in osteoarthritic joints. Anti-NGF monoclonal antibodies reduce NGF-dependent pain signaling; they do NOT repair cartilage and are NOT COX inhibitors.
- `bedinvetmab` / Librela: canine-specific US-labeled OA pain control.
- `frunevetmab` / Solensia: feline-specific US-labeled OA pain control.
- Drug shelf cards include species, approved uses, route, mechanism, important adverse effects and monitoring/risk reduction.
- US labeling: concurrent NSAID safety not established; avoid blanket safety claims. Both contraindicated in pregnant, breeding and lactating patients and in known hypersensitivity. Review applicable client information sheet every injection.
- FDA safety updates: Librela February 2025 and Solensia October 2026 expanded postapproval event information, including potentially serious neurologic and other concerns. Reports do not alone establish frequency or causal association.
- Four pharmacology learning questions added to Lectures 6–7.

## Toxicology dual placement
- **Study Lounge:** existing `toxicology-preview-data.js` with 11 source-indexed lecture groups; explicitly Coming Soon, no full question bank.
- **Pharmacy:** `ngf-toxicology-bridge.js` adds a distinct 10-card searchable toxicant reference with exposure, target species, mechanism, clinical signature and clinical-response principle. This is NOT the therapeutics drug shelf and not a poison-treatment protocol.
- Cross-links between the Study Lounge Toxicology preview and Pharmacy toxicant reference.
- Additional toxicant profiles will use stable IDs and explicit provenance; no unverified dosing/decontamination procedures silently inserted.
- Users should seek timely veterinary/animal poison help for real exposures.

## Priority medical references (verified Nov 2026)
- FDA animal drug safety-related labeling changes: https://www.fda.gov/animal-veterinary/drug-labels/animal-drug-safety-related-labeling-changes
- Librela US label: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=61c7b4e0-aab6-4cf5-8471-f94be438c758
- Solensia US label: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a73b79c4-3623-4b52-81ea-6180528a031e
- FDA Librela adverse-event safety letter: https://www.fda.gov/animal-veterinary/product-safety-information/dear-veterinarian-letter-notifying-veterinarians-about-adverse-events-reported-dogs-treated-librela
- Merck Veterinary Manual OA in dogs and cats: https://www.merckvetmanual.com/musculoskeletal-system/osteoarthritis-in-dogs-and-cats/osteoarthritis-in-dogs-and-cats

## Quality control
- 2 new unique drug IDs, 4 new study-question IDs, 10 unique toxicant IDs.
- Tested JS syntax of imported modules and index; simulated pharmacy navigation and drug-card augmentation.
- Full deployed-browser QA remains pending; clinical reference entries must be updated with safety-label changes.
