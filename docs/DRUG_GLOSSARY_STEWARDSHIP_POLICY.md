# Drug encyclopedia — stewardship, human/veterinary distinction, and clinical use QA

Updated: 2026-11-08. This policy accompanies `drug-stewardship.js` and the searchable clinical-use glossary inside the Pharmacy.

## Design rule

**A medication is never simply classified as “good,” “last resort,” or “banned.”** Keep independent fields for:

1. **Molecular mechanism** — binding target and downstream physiological effect.
2. **Veterinary clinical role** — species, indication, formulation, tissue exposure, and when an alternative would be preferred.
3. **Human-medicine role** — actual use in people versus shared class and resistance importance.
4. **Regulatory status** — country/jurisdiction, species, production class, route, product label, VFD/Rx status, extra-label permission/prohibition, withdrawal/residues.
5. **Stewardship restriction** — human-priority agent, resistance selection, special consultation, culture-directed preference.
6. **Safety restriction** — patient contraindications, species-specific toxicity, human-handler hazards.
7. **Historical/lecture status** — “out of favor,” formerly used, removed from market, instructor-specific emphasis; date each claim and distinguish it from current official sources.
8. **Clinical challenge** — ask why this drug should or should not be selected in a specific patient, then link the rationale, alternative consideration, and monitoring plan.
9. **Source provenance** — exact instructor lecture/source, dated official references, last-verified date and reviewer status.

## Status vocabulary

Statuses describe the **reason**, not an across-all-species label:

- **Regulated feed/VFD:** FDA-labeled feed use with veterinary direction; extra-label medicated feed use prohibited.
- **Prohibited extra-label:** specify drug/class, species and jurisdiction; **do not** confuse with all veterinary use being banned.
- **Human-use reserve:** prioritize preservation of important human therapy; this does not automatically create a companion-animal legal ban.
- **Veterinary clinical reserve:** only if safer/narrower active alternatives are unsuitable; distinguish susceptibility, efficacy and hazard.
- **Out of favor / resistance:** older empirical preference changed because of evidence, susceptibility or alternative therapies; not an automatic legal prohibition.
- **Formulation-specific:** a product or route has fallen out of favor; other formulations may remain legitimate.
- **Toxicity / handler hazard:** high toxicity risk may make an agent undesirable independent of human-medicine stewardship.
- **Audit pending:** entry present without a completed individual human/vet/regulatory review; **never** imply routine suitability.

## Important Exam 1 contrasts

| Drug | Lecture emphasis | Current distinction that matters | Audit |
|---|---|---|---|
| Chlortetracycline | Older tetracycline, VFD and food-animal indications | Specific labeled feed uses remain; VFD and no extra-label feed | Reviewed |
| Tigecycline | Newer glycylcycline with some resistance advantages | Primarily human-labeled, FDA human boxed warning and reserve language | Reviewed |
| Vancomycin | Last-line human glycopeptide | U.S. glycopeptide extra-label prohibition in food animals; exceptional companion use not an automatic class-wide prohibition | Reviewed |
| Chloramphenicol | Phenicol hazards | Human aplastic-anemia concern and U.S. food-animal prohibition | Reviewed |
| Florfenicol | Veterinary phenicol | Separate veterinary approvals, label/residue constraints | Reviewed |
| Oxytetracycline | Older tetracycline resistance in BRD | “Often poor” does not mean FDA-approved formulations ceased to exist or every isolate is resistant | Reviewed |
| Ceftiofur / Naxcel | Some formulations less preferred in lecture | Do not mistake formulation preference for product discontinuation or a complete cattle ban | Reviewed |
| Tylosin | Veterinary macrolide feed use | VFD and site-specific labeled cattle liver-abscess indication, resistance ecology | Reviewed |
| Virginiamycin | EU feed restrictions | U.S. VFD status differs from historical EU growth-promotion action | Reviewed |
| Tilmicosin | Long-acting veterinary macrolide | Serious human accidental-injection and veterinary route risks | Reviewed |
| Aminoglycosides | Peak-dependent killing, renal/ear toxicity | Patient/site/route restraints and specific food-animal residue concerns | Reviewed |

## Source-linked implementation

- Pharmacy entries are in `index.html`.
- Individual-use status annotations and official-source links live in `drug-stewardship.js` by stable drug ID.
- The game renders a full **Clinical Use & Stewardship** panel on the individual drug card.
- The Pharmacy's glossary shows **Reviewed** and **Needs audit** filters. A pending entry is not a recommended drug.
- Human-use reserve and regulation are shown separately from organism resistance and physiological toxicity.
- The shared learning curriculum remains in `curriculum.js`; a future content migration should refer to stable drug IDs rather than copying clinical warnings into each game mode.

## Safe update workflow

1. Import lecture-specific source facts and mark them **course emphasis**.
2. Check the exact FDA animal product label or current regulatory guidance for every legal/route claim.
3. Check a human label when contrasting human use or reserved-drug status.
4. Flag statements with time or country scope (e.g., “EU withdrawal 1999,” “US VFD 2026”).
5. Require a human reviewer for uncertain, disputed or extrapolated conclusions.
6. Mark pending entries explicitly until reviewed.
7. Add question bank links: **Why not this drug?**, **What would change your choice?**, **Human vs veterinary classification?**, **Monitoring / toxicity?**.
8. Test all pharmacy filters and modal links in a browser before marking the interface release-tested.

## Regulatory source register

- FDA VFD list: https://www.fda.gov/animal-veterinary/development-approval-process/drugs-veterinary-feed-directive-vfd-marketing-status
- 21 CFR chlortetracycline: https://www.law.cornell.edu/cfr/text/21/558.128
- FDA extra-label prescribing: https://www.fda.gov/animal-veterinary/resources-you/ins-and-outs-extra-label-drug-use-animals-resource-veterinarians
- FDA extra-label antimicrobials: https://www.fda.gov/animal-veterinary/antimicrobial-resistance/extralabel-use-and-antimicrobials
- FDA cephalosporin order: https://www.fda.gov/animal-veterinary/antimicrobial-resistance/cephalosporin-order-prohibition-questions-and-answers
- FDA human Tigecycline label (via DailyMed): https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2ccdb48e-c14a-4eeb-348c-4920ccfd7465

This is education and exam-preparation material, not a patient-specific treatment, legal or prescribing decision tool.
