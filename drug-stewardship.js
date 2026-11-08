/* VPQ Drug Clinical Use & Stewardship Registry — audited examples, US-focused, 2026-11-08.
   Course notes and current rules are deliberately separate. Unlisted entries are NOT cleared/first-line. */
(function(){
'use strict';
const reviewedAt='2026-11-08';
const refs={
  fdaVFD:{name:'FDA — drugs requiring Veterinary Feed Directive',url:'https://www.fda.gov/animal-veterinary/development-approval-process/drugs-veterinary-feed-directive-vfd-marketing-status'},
  fdaVFDExplain:{name:'FDA — veterinary feed directive',url:'https://www.fda.gov/animal-veterinary/development-approval-process/veterinary-feed-directive-vfd'},
  ctcLaw:{name:'21 CFR 558.128 — chlortetracycline feed uses',url:'https://www.law.cornell.edu/cfr/text/21/558.128'},
  fdaCTC:{name:'FDA — chlortetracycline feed for anaplasmosis control',url:'https://www.fda.gov/animal-veterinary/development-approval-process/questions-and-answers-fda-approved-free-choice-feeding-options-anaplasmosis-control-cattle'},
  fdaEL:{name:'FDA — extra-label antimicrobial use',url:'https://www.fda.gov/animal-veterinary/antimicrobial-resistance/extralabel-use-and-antimicrobials'},
  fdaELGuide:{name:'FDA — extralabel prescribing and food animal prohibitions',url:'https://www.fda.gov/animal-veterinary/resources-you/ins-and-outs-extra-label-drug-use-animals-resource-veterinarians'},
  fdaCeph:{name:'FDA — cephalosporin extra-label order',url:'https://www.fda.gov/animal-veterinary/antimicrobial-resistance/cephalosporin-order-prohibition-questions-and-answers'},
  fdaAMR:{name:'FDA — 2026 GFI #152 antimicrobial importance to people',url:'https://www.fda.gov/animal-veterinary/cvm-updates/fda-finalizes-guidance-evaluating-safety-antimicrobial-animal-drugs-based-their-importance-human'},
  tigecycline:{name:'TYGACIL — U.S. human prescribing information (2025)',url:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2ccdb48e-c14a-4eeb-348c-4920ccfd7465'},
  emaTige:{name:'EMA — colistin and tigecycline in animals (historical policy, 2013)',url:'https://www.ema.europa.eu/en/news/antimicrobial-resistance-european-medicines-agency-provides-advice-use-colistin-tigecycline-animals'},
  fdaPolicy:{name:'FDA — animal antimicrobial stewardship policy',url:'https://www.fda.gov/animal-veterinary/antimicrobial-resistance/fda-policies-antimicrobial-drugs-animals'},
  merckPhen:{name:'Merck Veterinary Manual — phenicols in animals',url:'https://www.merckvetmanual.com/pharmacology/antibacterial-agents/phenicols-use-in-animals'},
  fdaTyl:{name:'FDA — tylosin phosphate feed indications',url:'https://www.fda.gov/animal-veterinary/product-safety-information/fda-clarifies-use-tylosin-phosphate-beef-cattle-veterinarians'}
};
const profiles={
 'chlortetracycline':{
  category:'Veterinary feed use · VFD',status:'Regulated, not banned',theme:'rule',lecture:'Lecture 4 — tetracyclines; VFD discussion',
  vet:'Established veterinary tetracycline with labeled food-animal products, including specific medicated-feed uses. Label/site/species restrictions matter. Some cattle uses include reduction of liver condemnation from abscesses and anaplasmosis control in affected herds.',
  human:'Not a prominent modern systemic human-treatment choice; the tetracycline CLASS is medically important to people, so livestock exposure and resistance selection matter.',
  why:'Not “cannot be used.” It requires a lawful veterinarian-issued VFD for feed indications; veterinarians cannot prescribe medicated feed extra-label. Older tetracyclines may also be poor empirical choices when bacterial resistance is prevalent.',
  regulatory:'U.S.: chlortetracycline is on FDA VFD list; individual feed indication and formulation follow approved labeling. Feed VFD is NOT interchangeable with an ordinary prescription, and extra-label medicated feed use is prohibited.',
  lectureNote:'Instructor notes: chlortetracycline remains in feed under veterinary oversight, while some older feed indications/products were removed or changed. Verify precisely which drug/product the lecture meant.',
  exam:'Differentiate chlortetracycline (legitimate VFD feed uses) from tigecycline (human-use reserve considerations), chloramphenicol (food-animal prohibition), and tylosin (also used for cattle liver-abscess reduction).',
  question:'Is it true chlortetracycline is banned because it matters to human medicine? No: certain FDA-approved veterinary uses remain, but with VFD/label restrictions.',
  refs:['fdaVFD','ctcLaw','fdaCTC','fdaELGuide','fdaAMR']
 },
 'tigecycline':{
  category:'Human-use priority · reserve drug',status:'Not routine veterinary therapy',theme:'reserve',lecture:'Lecture 4 — newer glycylcycline',
  vet:'A human-labeled glycylcycline, not an established routine veterinary antibacterial. Veterinary extra-label considerations must be individually assessed; lack of a veterinary label is not automatically a blanket ban in companion animals.',
  human:'TYGACIL is used for selected complicated bacterial infections in people. Its U.S. label has a boxed warning for increased all-cause mortality and states that it should be reserved when alternatives are unsuitable.',
  why:'Reserve status stems from human safety considerations, antimicrobial stewardship and preserving treatment options; do not equate this with resistance making an older veterinary drug ineffective.',
  regulatory:'No U.S. veterinary approval was identified in this targeted review. A historical EMA assessment discouraged animal authorization due to importance for human medicine. Confirm current jurisdiction and legal eligibility before considering any extra-label use.',
  lectureNote:'Course identifies tigecycline as the newer related glycylcycline, with activity against some tetracycline-resistant organisms. “Resists some resistance mechanisms” does NOT mean universal susceptibility.',
  exam:'Contrast tigecycline (human reserve; 30S glycylcycline) versus doxycycline (commonly useful veterinary tetracycline) and chlortetracycline (regulated veterinary feed use).',
  question:'Why is tigecycline not an ordinary veterinary first choice even though it may evade some tetracycline resistance? Human reserve role, specific risks and stewardship.',
  refs:['tigecycline','emaTige','fdaELGuide','fdaAMR']
 },
 'vancomycin':{
  category:'Critical human-medicine stewardship',status:'Exceptional specialist consideration',theme:'reserve',lecture:'Lecture 3 — glycopeptides',
  vet:'May be considered exceptionally in non-food animals for life-threatening susceptible infection when alternatives are unsuitable, under specialist oversight and susceptibility-directed decision-making; not routine first-line therapy.',
  human:'Important human drug for serious Gram-positive infections, including selected resistant infections. Resistance transfer and the ecology of vancomycin resistance are major One Health concerns.',
  why:'Preserving human clinical options is a stewardship concern; it is not the same as claiming no legal possibility of any companion-animal extra-label use.',
  regulatory:'U.S. glycopeptide EXTRA-LABEL use is prohibited in food-producing animals under 21 CFR 530.41. The FDA does not list a blanket extra-label prohibition for companion animals.',
  lectureNote:'Instructor emphasizes vancomycin as a last-line human agent, only exceptional dog use, and transmissible resistance. Do not turn that course warning into “banned in all veterinary species.”',
  exam:'What does vancomycin-resistance selection in animals mean for public health? Organism and resistance-determinant ecology connect animal exposures to human therapy.',
  question:'A dog has a susceptible serious infection but safer effective alternatives exist. Is vancomycin a rational first choice? No—use a justified alternative.',
  refs:['fdaELGuide','fdaAMR']
 },
 'chloramphenicol':{
  category:'Legally prohibited in food animals',status:'Species-dependent prohibition',theme:'restricted',lecture:'Lecture 4 — phenicols',
  vet:'Selected companion-animal uses may be considered with appropriate precautions; avoid owner/handler exposure. Do not use in food-producing animals.',
  human:'Potentially serious, unpredictable aplastic anemia in exposed people is central to its safety history; systemic human use is limited by major toxicity concerns.',
  why:'A food-animal legal prohibition is distinct from “out of favor because microbes are resistant.” Potential human exposure to residues and handler exposure drive this prohibition.',
  regulatory:'U.S.: chloramphenicol is prohibited for extra-label use in food-producing animals; the FDA explains the risk of potentially fatal human aplastic anemia. Check currently approved animal formulations separately.',
  lectureNote:'Instructor explicitly contrasts chloramphenicol with florfenicol, emphasizing life-threatening human adverse reactions and food animal prohibition.',
  exam:'Chloramphenicol vs florfenicol: both are phenicols acting at 50S; the latter has veterinary food-animal labels for particular indications and differs in some toxicities and resistance mechanisms.',
  question:'Can chloramphenicol be used in cattle because it has broad spectrum? No—human safety and food-animal restrictions supersede antibacterial activity.',
  refs:['fdaELGuide','merckPhen']
 },
 'florfenicol':{
  category:'Veterinary-specific licensed indications',status:'Use per species/label',theme:'veterinary',lecture:'Lecture 4 — phenicols',
  vet:'Primarily a veterinary phenicol with approved animal indications that vary by species, route, product and country; important for certain food-animal respiratory infections.',
  human:'Not a standard human systemic antimicrobial. It was developed with differences from chloramphenicol to avoid some toxicity and resistance pathways.',
  why:'Not interchangeable with chloramphenicol. Approved veterinary indications do not authorize arbitrary extra-label medicated-feed administration.',
  regulatory:'U.S. food animal labels and withdrawal requirements must be verified. FDA lists florfenicol among VFD-status drugs for approved feed preparations.',
  lectureNote:'Instructor contrasts the chloramphenicol acetylation site, human marrow safety issue, and veterinary use of florfenicol.',
  exam:'Explain why changing a molecular substituent affects chloramphenicol acetyltransferase resistance and the spectrum of hazards.',
  question:'Why can florfenicol have food-animal uses while chloramphenicol is prohibited? Different evidence, approvals and human-safety concerns.',
  refs:['fdaVFD','merckPhen','fdaELGuide']
 },
 'oxytetracycline':{
  category:'Older tetracycline · resistance review',status:'Context-dependent utility',theme:'outofavor',lecture:'Lecture 4 — tetracyclines',
  vet:'Veterinary oxytetracycline formulations still have labeled uses in food and other animals; choose based on organism, site, species and susceptibility.',
  human:'An older tetracycline, much less prominent in modern systemic human therapy than some newer tetracyclines.',
  why:'The lecture notes describe poor BRD utility from resistance. That is a lecturer-specific warning about empirical effectiveness, not proof every oxytetracycline use is illegal or ineffective.',
  regulatory:'Feed, water, and injectable products carry different label and oversight requirements. A drug with an approved indication may still be a poor choice because of local resistance.',
  lectureNote:'Instructor characterizes oxytetracycline as FDA-approved for bovine respiratory disease but often ineffective with resistance; this is a broad pedagogic statement, not a universal susceptibility result.',
  exam:'Separate approved indication, in-vitro resistance, drug penetration, and the patient’s clinical response.',
  question:'Does FDA approval mean an isolate is susceptible? No. Legal indication and antimicrobial effectiveness are separate questions.',
  refs:['fdaVFD','fdaAMR','fdaPolicy']
 },
 'doxycycline':{
  category:'Common veterinary therapy',status:'Indication-dependent',theme:'veterinary',lecture:'Lecture 4 — tetracyclines',
  vet:'Widely used for appropriate rickettsial, chlamydial and other susceptible infections in small animals; avoid assuming useful urinary levels for common lower UTIs.',
  human:'Also a common human antimicrobial; human and veterinary indications overlap but formulations, resistance and safety differ.',
  why:'Favorable tissue penetration and relatively low renal clearance can be useful in renal compromise. But reduced unchanged urinary excretion, cat esophageal injury, cation chelation, and microbiome effects constrain selection.',
  regulatory:'Many veterinary uses are extra-label or formulation-specific. Food animal restrictions and residues require a separate legal assessment.',
  lectureNote:'Instructor emphasizes doxycycline for atypical/intracellular infections, renal considerations, and feline dry-pill esophagitis. “Doxycycline avoids renal elimination” is an overgeneralization; elimination is multifactorial.',
  exam:'Why can doxycycline be useful for some intracellular infections but be a poor empiric cystitis choice? Distribution and unchanged urinary drug concentration are different metrics.',
  question:'What counseling is important for oral doxycycline in cats? Ensure safe administration and avoid prolonged esophageal tablet contact.',
  refs:['fdaELGuide','fdaAMR']
 },
 'enrofloxacin':{
  category:'Stewardship priority · legal extra-label limits',status:'Avoid unnecessary empirical use',theme:'restricted',lecture:'Lecture 5 — fluoroquinolones',
  vet:'An important veterinary fluoroquinolone for appropriately indicated susceptible infections. Consider resistance, culture, species safety and alternatives.',
  human:'Not a common human-use drug itself; fluoroquinolones as a CLASS are highly important for human medicine and resistance is a One Health issue.',
  why:'Concentration-dependent antimicrobial efficacy is not a reason for routine broad-spectrum use. Retinal injury risk in cats and developmental cartilage concerns matter.',
  regulatory:'U.S. fluoroquinolones are prohibited from extra-label use in food-producing animals. Label-specific approved uses are a separate question.',
  lectureNote:'Do not mistake a class restriction in food animals for a ban on appropriate labeled use or for a ban in companion animals.',
  exam:'Identify the difference between a resistant isolate, a species-specific toxicity and an extra-label legal prohibition.',
  question:'Can a veterinarian simply use an unapproved enrofloxacin regimen in food-producing animals? No—the class is subject to an extra-label prohibition.',
  refs:['fdaEL','fdaELGuide','fdaAMR']
 },
 'ceftiofur':{
  category:'Third-generation cephalosporin',status:'Food-animal extra-label limits',theme:'restricted',lecture:'Lecture 3 — cephalosporins',
  vet:'Veterinary cephalosporin with species-, formulation- and route-specific labeled food-animal uses. Naxcel, Excenel and Excede differ; they are not interchangeable preparations.',
  human:'Ceftiofur is principally veterinary; third-generation cephalosporins as a CLASS are highly important in human medicine.',
  why:'Resistance selection and important human therapies motivate limits on certain extra-label cephalosporin uses in major food animals.',
  regulatory:'U.S.: most extra-label cephalosporin use in cattle/swine/chickens/turkeys is restricted by indication/species/dose/route; labeled uses remain allowed and exceptions exist.',
  lectureNote:'Instructor states Naxcel has fallen out of favor compared with other ceftiofur formulations in dairy-cattle discussion. This is a historical/product-preference claim, NOT evidence Naxcel is illegal or no longer marketed.',
  exam:'Distinguish ceftiofur FORMULATIONS, withdrawal statements, approved production class, disease prevention versus treatment/control, and cephalosporin extra-label restrictions.',
  question:'Is ceftiofur forbidden in all cattle? No. Appropriate labeled uses remain available despite strict limits on many extra-label uses.',
  refs:['fdaCeph','fdaELGuide']
 },
 'tylosin':{
  category:'Veterinary feed antimicrobial',status:'Regulated feed indications',theme:'rule',lecture:'Lecture 4 — macrolides',
  vet:'Veterinary macrolide with some approved livestock uses, including tylosin-phosphate medicated feed for reducing liver abscesses in beef cattle under specified labeling.',
  human:'Not a standard human clinical macrolide; class-related cross-resistance is relevant to human health.',
  why:'Feed use has a specific label and VFD framework; it should not be generalized to all cattle, all conditions or a pharmacist-dispensed prescription.',
  regulatory:'U.S. tylosin is on FDA VFD list, and FDA has issued product-specific guidance on cattle liver-abscess control.',
  lectureNote:'Course emphasizes livestock feed uses and potential macrolide/glycopeptide resistance linkage; cross-resistance mechanisms require precise organism/genetic context rather than a blanket “tylosin always selects vancomycin resistance.”',
  exam:'Differentiate tylosin versus chlortetracycline as VFD-regulated feed drugs, and explain why an approved liver-abscess use is not a growth-promotion authorization.',
  question:'Why would a livestock macrolide feed use matter to human medicine? Microbial ecology can select transferable resistance determinants.',
  refs:['fdaVFD','fdaTyl','fdaAMR']
 },
 'tilmicosin':{
  category:'Veterinary-only class member · hazardous exposure',status:'High handling/route risk',theme:'hazard',lecture:'Lecture 4 — macrolides',
  vet:'Veterinary respiratory macrolide with strict species-, product- and route-specific labels.',
  human:'Not a therapeutic human macrolide; accidental injection exposure can be life-threatening due to serious cardiotoxicity.',
  why:'The main reason to avoid unapproved routes or careless handling is acute toxicity, not simply preserving a reserve human drug.',
  regulatory:'Follow product instructions precisely; special warnings and access restrictions are product dependent. Do not generalize dose or route between macrolides.',
  lectureNote:'Instructor explicitly emphasizes fatal human self-injection hazard and never giving injectable tilmicosin IV.',
  exam:'Contrast human-use macrolides (erythromycin/clarithromycin/azithromycin) with cattle-predominant macrolides; distinguish stewardship restrictions from intrinsic toxicity.',
  question:'Why is tilmicosin hazardous to handlers? Its cardiotoxic effects after accidental injection can be fatal.',
  refs:['fdaVFD','fdaAMR']
 },
 'gentamicin':{
  category:'Clinical restriction by toxicity/site',status:'Monitor and justify',theme:'hazard',lecture:'Lecture 4 — aminoglycosides',
  vet:'Useful for selected susceptible aerobic Gram-negative infections, particularly when injection and clinical monitoring are feasible.',
  human:'Also used in humans for selected severe bacterial infections; aminoglycoside class stewardship and resistance matter.',
  why:'No aerobic uptake in strict anaerobes, poor systemic oral absorption, renal tubular accumulation, vestibular/cochlear toxicity and neuromuscular-blocking potential constrain treatment.',
  regulatory:'Food-animal systemic extra-label use can raise significant residue/withdrawal concerns; check product and species law. Not a blanket U.S. prohibition on every aminoglycoside.',
  lectureNote:'Course distinguishes peak-dependent efficacy and trough-associated toxicity and warns about otic use with ruptured tympanic membranes.',
  exam:'A patient is dehydrated with suspected renal infection. Explain why urinary concentration, renal tissue safety and organism susceptibility are distinct.',
  question:'Would gentamicin be a good choice for a pure anaerobic infection? No; oxygen-dependent bacterial uptake is required.',
  refs:['fdaELGuide','fdaAMR']
 },
 'amikacin':{
  category:'Selected resistant-infection therapy',status:'Reserve based on patient/isolate',theme:'reserve',lecture:'Lecture 4 — aminoglycosides',
  vet:'Used for certain serious susceptible infections, including some resistant Gram-negative pathogens; equine intra-articular or regional limb applications require expert judgment.',
  human:'Aminoglycoside used for selected serious human infections, including some resistant organisms.',
  why:'Nephrotoxicity/ototoxicity, injectable dosing, tissue penetration and susceptibility results limit routine use; not a categorical prohibition.',
  regulatory:'Food animal residue/extra-label concerns depend on species and product; do not assume customary equine practice applies to food animals.',
  lectureNote:'Course highlights injectable amikacin and resistant infections. “Last resort” is contextual and not a universal legal designation.',
  exam:'What would you assess before selecting amikacin over a narrower susceptible agent? Susceptibility, site, renal function, monitoring and availability of safer alternatives.',
  question:'Why is amikacin not suitable as an ordinary oral systemic take-home medication? Very poor systemic absorption by the oral route.',
  refs:['fdaELGuide','fdaAMR']
 },
 'rifampin':{
  category:'Combination drug · avoid casual monotherapy',status:'Resistance-prone selection',theme:'reserve',lecture:'Lecture 5 — RNA synthesis inhibitors',
  vet:'Used in selected equine Rhodococcus equi pneumonia regimens, commonly with a macrolide where indicated; the clinical need for treatment must be established.',
  human:'Critical component of human tuberculosis regimens and selected other difficult infections. Preserving effectiveness matters.',
  why:'Resistance can be selected quickly during monotherapy; hepatic enzyme induction and drug interactions complicate combinations.',
  regulatory:'Not blanket prohibited in all veterinary species. Extra-label conditions, organism susceptibility and food-animal considerations require individual assessment.',
  lectureNote:'Instructor emphasizes rifampin combination therapy against certain foal infections and resistance risk from monotherapy.',
  exam:'Why avoid reflexively giving rifampin alone for every foal with R. equi detected in the environment? Organism detection alone is not an indication and resistance emerges rapidly.',
  question:'Which stewardship principle drives rifampin combination use in selected infections? Preventing rapid selection of resistant mutants.',
  refs:['fdaAMR','fdaELGuide']
 },
 'virginiamycin':{
  category:'Feed antimicrobial · One Health resistance concern',status:'Jurisdiction-dependent',theme:'rule',lecture:'Lecture 4 — streptogramins',
  vet:'A streptogramin used in some U.S. approved animal-feed products under VFD status; do not infer unrestricted use.',
  human:'Human streptogramin combinations are relevant to serious resistant Gram-positive infections; resistance mechanisms can overlap across agents.',
  why:'The instructor discusses European restrictions tied to antimicrobial resistance. A restriction in Europe does not imply an identical U.S. prohibition.',
  regulatory:'U.S. FDA lists virginiamycin as a VFD drug. Check approved indications, product and jurisdiction.',
  lectureNote:'Lecture highlights EU removal from growth-promotion use due to resistance concerns, especially enterococci. Label as EU historic context, not U.S. blanket ban.',
  exam:'Can an antibiotic be disfavored in one country but still have regulated approved feed indications in another? Yes—jurisdictions differ.',
  question:'Why is the human-versus-veterinary distinction relevant for virginiamycin? Shared resistance determinants, not identical human and animal prescribing indications.',
  refs:['fdaVFD','fdaAMR']
 }
};
function lookup(d){const id=typeof d==='string'?d:d?.id;return profiles[id]||null}
function status(d){return lookup(d)?.status||'Individual clinical-use audit pending'}
window.VPQDrugStewardship=Object.freeze({profiles,refs,reviewedAt,lookup,status});
})();