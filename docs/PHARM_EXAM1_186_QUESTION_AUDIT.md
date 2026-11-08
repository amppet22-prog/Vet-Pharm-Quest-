# Exam 1 pharmacology instructor-question audit — 186-item source ledger

**Status (2026-11-08): all 186 source prompts and worked answers are now imported into `pharm-carlson-186.js` and accessible in the lecture-filtered Professor Guide in Pharm Arcade.** Answer presence and structural counts have been checked. Independent medical/pedagogical verification and new multiple-choice/clinical-case coverage are **still pending**. The comparison ledger below describes the earlier 45-question MCQ bank and therefore does not reflect the newly integrated reveal-answer bank; a lexical match is not a verification.

## Integrated full-answer coverage

| Lecture | Original guide prompts now included with worked answers |
| --- | ---: |
| Lecture 1 | 23 |
| Lecture 2 | 12 |
| Lecture 3 | 27 |
| Lecture 4 | 42 |
| Lecture 5 | 25 |
| Lectures 6–7 | 32 |
| Lecture 8 | 8 |
| Lecture 9 | 17 |
| **Total** | **186** |

The full-answer bank supports selecting lecture groups, 12-prompt unseen-priority rounds, a full sequential review of selected prompts, previous/next navigation, answer reveal, and self-rated understood/needs-review history. The legacy 45-question Professor Guide multiple-choice drill remains available separately. Do not treat a self-rating or a booklet answer as an independently verified medical answer.

## Historical source counts and word-overlap screen

| Lecture | Original prompts | Related wording | Possible connection | Weak/no word match |
|---|---:|---:|---:|---:|
| Lecture 1 | 23 | 2 | 8 | 13 |
| Lecture 2 | 12 | 1 | 2 | 9 |
| Lecture 3 | 27 | 0 | 2 | 25 |
| Lecture 4 | 42 | 1 | 5 | 36 |
| Lecture 5 | 25 | 0 | 1 | 24 |
| Lectures 6–7 | 32 | 1 | 11 | 20 |
| Lecture 8 | 8 | 1 | 3 | 4 |
| Lecture 9 | 17 | 0 | 3 | 14 |

The matcher compares an instructor prompt with same-lecture question stems and explanations, teaching cards, and drug entries. It returns one best lexical candidate; it can miss paraphrases or create false positives. A related drug card is **not** a tested question.

## Every instructor prompt (intentional repeats retained)

| Source page | # | Source prompt (whitespace normalized) | Closest existing content | Screen only | Verified? |
|---|---:|---|---|---|---|
| Lecture 1, p.2 | 1 | Why do most drug get dumped into the glomerular filtrate? They are smaller than 68kd | Arcade MCQ: `carlson-guide-01` | Weak/no word match (0.09) | NO |
| Lecture 1, p.2 | 2 | Which species is most likely to receive a drug transdermally? Cats | Arcade MCQ: `carlson-guide-01` | Weak/no word match (0.11) | NO |
| Lecture 1, p.2 | 3 | What is the volume of distribution and why is it important? | Arcade MCQ: `carlson-guide-05` | Possible connection (0.32) | NO |
| Lecture 1, p.2 | 4 | What are the two most important drug targets? Receptors and enzymes | Arcade MCQ: `carlson-guide-01` | Related wording (0.50) | NO |
| Lecture 1, p.2 | 5 | Contrast pharmacodynamics and pharmacokinetics | Arcade MCQ: `carlson-guide-02` | Related wording (0.43) | NO |
| Lecture 1, p.2 | 6 | What is an agonist? | Main MCQ: `extra4` | Possible connection (0.30) | NO |
| Lecture 1, p.2 | 7 | What is an allosteric modulator? | Arcade MCQ: `carlson-guide-03` | Possible connection (0.35) | NO |
| Lecture 1, p.2 | 8 | What is an antagonist and what are the three main types? | Main MCQ: `vpq34-001` | Weak/no word match (0.18) | NO |
| Lecture 1, p.2 | 9 | What are EC50 and ED50 values? | Main MCQ: `extra2` | Weak/no word match (0.16) | NO |
| Lecture 1, p.3 | 10 | What is efficacy and what is efficacious? | Arcade MCQ: `carlson-guide-04` | Weak/no word match (0.20) | NO |
| Lecture 1, p.3 | 11 | Define competitive, non-competitive, reversible, and irreversible antagonists/inhibitors | Learning card: `concept:Competitive antagonism` | Weak/no word match (0.21) | NO |
| Lecture 1, p.3 | 12 | What are affinity and KD? | Main MCQ: `extra1` | Weak/no word match (0.00) | NO |
| Lecture 1, p.3 | 13 | What are selectivity and specificity? | Main MCQ: `extra1` | Weak/no word match (0.00) | NO |
| Lecture 1, p.3 | 14 | What are the therapeutic index and standard safety margin indicative of? Drug safety | Arcade MCQ: `carlson-guide-07` | Weak/no word match (0.10) | NO |
| Lecture 1, p.3 | 15 | How do most drugs cross the GI barrier? Passive (simple) diffusion | Arcade MCQ: `f04` | Possible connection (0.28) | NO |
| Lecture 1, p.3 | 16 | What is the pK value and why does it matter for drug absorption and distribution? | Main MCQ: `extra1` | Possible connection (0.33) | NO |
| Lecture 1, p.3 | 17 | What are AUC, Cmax, and Tmax? | Main MCQ: `extra1` | Weak/no word match (0.00) | NO |
| Lecture 1, p.3 | 18 | What is bioavailability? | Arcade MCQ: `carlson-guide-08` | Possible connection (0.23) | NO |
| Lecture 1, p.3 | 19 | What is the 1st-pass effect? | Main MCQ: `vpq34-002` | Weak/no word match (0.15) | NO |
| Lecture 1, p.4 | 20 | What are the two factors influencing drug distribution? | Learning card: `concept:Free drug and protein binding` | Weak/no word match (0.20) | NO |
| Lecture 1, p.4 | 21 | What is the biologic “purpose” of drug metabolism? To polarize a drug for renal elimination | Arcade MCQ: `carlson-guide-06` | Weak/no word match (0.22) | NO |
| Lecture 1, p.4 | 22 | Why is clearance important? | Learning card: `concept:Free drug and protein binding` | Possible connection (0.25) | NO |
| Lecture 1, p.4 | 23 | Why is elimination half-life important? | Arcade MCQ: `carlson-guide-07` | Possible connection (0.24) | NO |
| Lecture 2, p.5 | 1 | What is the first question you should ask yourself when selecting an antibiotic? | Arcade MCQ: `carlson-guide-09` | Weak/no word match (0.11) | NO |
| Lecture 2, p.5 | 2 | What are the two main parameters that dictate the spectrum (i.e., the range of bacteria harmed by a given antibiotic) of an antibiotic? | Arcade MCQ: `carlson-guide-10` | Weak/no word match (0.13) | NO |
| Lecture 2, p.5 | 3 | Please keep in mind that Spectrum and Pharmacodynamics have some overlap. | Arcade MCQ: `carlson-guide-10` | Weak/no word match (0.11) | NO |
| Lecture 2, p.5 | 4 | Please keep in mind that bactericidal antibiotic would seem to be superior in all cases, bacteriostatic antibiotics are very important as you will see throughout this section. | Learning card: `concept:Concentration-dependent killing` | Weak/no word match (0.15) | NO |
| Lecture 2, p.5 | 5 | Please note that while fluoroquinolones are implicated in serious adverse events in two separate physiologic systems, they are one of the most important classes of antibiotics. | Learning card: `concept:AUC/MIC` | Weak/no word match (0.09) | NO |
| Lecture 2, p.5 | 6 | What are the two facets of Compliance? | Arcade MCQ: `carlson-guide-11` | Weak/no word match (0.21) | NO |
| Lecture 2, p.5 | 7 | What are the privileged sites that are important for Environment? | Arcade MCQ: `carlson-guide-11` | Weak/no word match (0.15) | NO |
| Lecture 2, p.5 | 8 | What is the difference between an MIC and a breakpoint? | Arcade MCQ: `carlson-guide-12` | Possible connection (0.30) | NO |
| Lecture 2, p.6 | 1 | What is laboratory determined resistance and be prepared to identify it if given an example? | Arcade MCQ: `carlson-guide-14` | Weak/no word match (0.14) | NO |
| Lecture 2, p.6 | 2 | What are the active and passive mechanisms of resistance? | Arcade MCQ: `carlson-guide-14` | Related wording (0.47) | NO |
| Lecture 2, p.6 | 3 | Provide three guidelines for the prevention of antibiotic resistance. | Arcade MCQ: `carlson-guide-14` | Weak/no word match (0.18) | NO |
| Lecture 2, p.6 | 4 | What is persistence? | Arcade MCQ: `carlson-guide-13` | Possible connection (0.23) | NO |
| Lecture 3, p.7 | 1 | What is the mechanism of action for penicillins? | Main MCQ: `extra10` | Weak/no word match (0.17) | NO |
| Lecture 3, p.7 | 2 | Why are these drugs bactericidal? | Main MCQ: `vpq34-015` | Weak/no word match (0.20) | NO |
| Lecture 3, p.7 | 3 | What is the major resistance mechanism? | Main MCQ: `extra11` | Weak/no word match (0.20) | NO |
| Lecture 3, p.7 | 4 | What is the major side effect for penicillins? | Main MCQ: `extra10` | Weak/no word match (0.17) | NO |
| Lecture 3, p.7 | 5 | Describe the pharmacokinetics of penicillins in relationship to the MIC of the targeted bacteria and the kinetics of the bactericidal activity. | Main MCQ: `vpq34-015` | Weak/no word match (0.20) | NO |
| Lecture 3, p.7 | 6 | Describe the paradox regarding the volume of distribution for penicillins. | Main MCQ: `extra10` | Weak/no word match (0.14) | NO |
| Lecture 3, p.7 | 7 | Describe how sustained-release penicillins address the pharmacokinetic requirements of penicillins in regards to the MIC. | Arcade MCQ: `carlson-guide-17` | Weak/no word match (0.17) | NO |
| Lecture 3, p.7 | 8 | Describe the issues associated with sustained-release penicillins. | Main MCQ: `extra10` | Weak/no word match (0.13) | NO |
| Lecture 3, p.7 | 9 | Name the penicillin potentiators and describe how they work. | Arcade MCQ: `w01` | Weak/no word match (0.21) | NO |
| Lecture 3, p.7 | 10 | Name the five most veterinary-relevant penicillins and penicillin derivatives, and the most important potentiator for some of these drugs. | Main MCQ: `vpq34-015` | Weak/no word match (0.20) | NO |
| Lecture 3, p.8 | 11 | Also provide the unique characteristic(s) of each of the six drugs from the prior question. | Drug encyclopedia: `drug:penicillin-g` | Weak/no word match (0.09) | NO |
| Lecture 3, p.8 | 12 | Provide a clinical application for a penicillin derivative in both companion and food animals. | Arcade MCQ: `w05` | Possible connection (0.33) | NO |
| Lecture 3, p.8 | 13 | Describe why, in general, most penicillins are more effective versus Gm(+) than Gm(-) bacteria. | Drug encyclopedia: `drug:cephalexin` | Weak/no word match (0.14) | NO |
| Lecture 3, p.8 | 14 | Describe the post-antibiotic effect and how this phenomenon is not relevant to penicillins. Also, why is it irrelevant to treating most Gm(-) infections. You will not be able to answer this question until the aminoglycoside lecture. | Arcade MCQ: `w03` | Weak/no word match (0.12) | NO |
| Lecture 3, p.8 | 15 | Which drugs would you choose versus the following Pseudomonas infection? Why? Refer to the susceptibility/MIC/time-over-MIC table on the reproduced original lecture slide in the appendix. | Arcade MCQ: `carlson-guide-17` | Weak/no word match (0.19) | NO |
| Lecture 3, p.9 | 1 | What is the mechanism of action for each? | Main MCQ: `extra10` | Weak/no word match (0.00) | NO |
| Lecture 3, p.9 | 2 | Bacteriostatic or bactericidal? | Main MCQ: `extra10` | Weak/no word match (0.00) | NO |
| Lecture 3, p.9 | 3 | What is the major resistance mechanism? | Main MCQ: `extra11` | Weak/no word match (0.20) | NO |
| Lecture 3, p.9 | 4 | Any potentiators? | Main MCQ: `extra10` | Weak/no word match (0.00) | NO |
| Lecture 3, p.9 | 5 | Describe the pharmacokinetics. | Main MCQ: `extra10` | Weak/no word match (0.00) | NO |
| Lecture 3, p.9 | 6 | Any sustained release formulations? Describe flip-flop kinetics of cefovecin. | Drug encyclopedia: `drug:ceftiofur` | Weak/no word match (0.14) | NO |
| Lecture 3, p.9 | 7 | Know the spectra of all five generations of cephalosporins. | Main MCQ: `extra12` | Possible connection (0.24) | NO |
| Lecture 3, p.9 | 8 | Which cephalosporin appears to be the most useful clinically in the absence of resistance? | Drug encyclopedia: `drug:cefazolin` | Weak/no word match (0.16) | NO |
| Lecture 3, p.9 | 9 | Give two reasons why cefpodoxime might be preferred over cephalexin. Hints: dose frequency and bacterial resistance. | Main MCQ: `extra11` | Weak/no word match (0.09) | NO |
| Lecture 3, p.10 | 10 | Describe the three formulations of ceftiofur and advantages of each. Hints: some producers like the single-dosing, some producers don’t like to give the injections behind the ear, most producers don’t like to reconstitute drugs, sometimes it may be necessary to give ceftiofur IV. Also, I think all dairy farmers don’t like to throw milk away. | Arcade MCQ: `w05` | Weak/no word match (0.11) | NO |
| Lecture 3, p.10 | 11 | Should you give cefovecin to a goat that is not ill?. | Drug encyclopedia: `drug:cefovecin` | Weak/no word match (0.15) | NO |
| Lecture 3, p.10 | 12 | What are the spectra for carbapenems, monobactams, and bacitracin? [See the spectrum quadrant on the original slide in the appendix.] | Main MCQ: `vpq34-019` | Weak/no word match (0.09) | NO |
| Lecture 4, p.11 | 1 | For tetracyclines, be able to recognize the five relevant ones and the new related drug. | Main MCQ: `vpq34-022` | Weak/no word match (0.14) | NO |
| Lecture 4, p.11 | 2 | What is the MOA and spectrum of tetracyclines? | Main MCQ: `vpq34-022` | Weak/no word match (0.19) | NO |
| Lecture 4, p.11 | 3 | What is the main mechanism for tetracycline resistance, but which drug is least affected? | Main MCQ: `vpq34-023` | Weak/no word match (0.10) | NO |
| Lecture 4, p.11 | 4 | Describe the relationship between tetracyclines and “mutant” bacteria. | Main MCQ: `vpq34-022` | Weak/no word match (0.19) | NO |
| Lecture 4, p.11 | 5 | Describe two therapeutic effects of tetracyclines that are not related to antimicrobial activity. | Main MCQ: `vpq34-022` | Weak/no word match (0.14) | NO |
| Lecture 4, p.11 | 6 | What is the relationship between divalent cations and tetracyclines. | Arcade MCQ: `carlson-guide-22` | Possible connection (0.24) | NO |
| Lecture 4, p.11 | 7 | Be able to recognize side effects of tetracyclines. | Main MCQ: `vpq34-022` | Weak/no word match (0.15) | NO |
| Lecture 4, p.11 | 8 | Why would doxycycline be a poor choice versus a urinary tract infection? | Arcade MCQ: `r01` | Weak/no word match (0.18) | NO |
| Lecture 4, p.12 | 1 | What is the mechanism of action for aminoglycosides? | Learning card: `concept:30S versus 50S` | Weak/no word match (0.19) | NO |
| Lecture 4, p.12 | 2 | After next lecture, you should be able to describe why aminoglycosides kill bacteria but tetracyclines do not. | Learning card: `concept:30S versus 50S` | Weak/no word match (0.21) | NO |
| Lecture 4, p.12 | 3 | Clinical applications summary: gentamicin topical, amikacin injectable. | Main MCQ: `vpq34-024` | Weak/no word match (0.11) | NO |
| Lecture 4, p.12 | 4 | Describe the major toxicities for aminoglycosides? How can two of these be avoided by pharmacokinetic (dosing) manipulations? Aminoglycosides versus aminocyclitols in terms of toxicity? Which drugs are worst and which ones are least likely to cause toxicity? | Main MCQ: `s1` | Weak/no word match (0.12) | NO |
| Lecture 4, p.12 | 5 | Generally describe the primary mechanism for aminoglycoside resistance. | Arcade MCQ: `r02` | Weak/no word match (0.20) | NO |
| Lecture 4, p.12 | 6 | What type of bacteria are universally insensitive to aminoglycosides. | Main MCQ: `extra16` | Weak/no word match (0.14) | NO |
| Lecture 4, p.12 | 7 | Explain the conundrum with concurrent use of aminoglycosides and beta-lactams. | Main MCQ: `extra16` | Weak/no word match (0.12) | NO |
| Lecture 4, p.12 | 8 | Since these drugs are polar, how do you achieve therapeutic levels in the blood? | Learning card: `concept:Aminoglycoside nephrotoxicity` | Weak/no word match (0.06) | NO |
| Lecture 4, p.12 | 9 | What is the regulatory issue regarding food animals and aminoglycosides? | Arcade MCQ: `r06` | Possible connection (0.25) | NO |
| Lecture 4, p.13 | 10 | What is the issue with aminoglycosides and ruptured tympanic membranes? | Arcade MCQ: `r02` | Weak/no word match (0.20) | NO |
| Lecture 4, p.13 | 11 | Why are aminoglycosides poor choices for long-term at-home therapy if the owners are unable to administer injections? | Main MCQ: `extra16` | Weak/no word match (0.17) | NO |
| Lecture 4, p.13 | 12 | Why can you use these drugs versus cystitis but not versus nephritis? | Learning card: `concept:Aminoglycoside uptake` | Weak/no word match (0.07) | NO |
| Lecture 4, p.14 | 1 | Name the human macrolides (n=3) that can be used in veterinary medicine. | Arcade MCQ: `carlson-guide-25` | Weak/no word match (0.19) | NO |
| Lecture 4, p.14 | 2 | For macrolides, be able to recognize the five veterinary-specific ones. | Arcade MCQ: `carlson-guide-25` | Weak/no word match (0.15) | NO |
| Lecture 4, p.14 | 3 | What is the MOA and spectrum of macrolides? Static or cidal? | Arcade MCQ: `carlson-guide-25` | Weak/no word match (0.15) | NO |
| Lecture 4, p.14 | 4 | Which bacteria are typically resistant to macrolides? What about Mycoplasma? | Arcade MCQ: `carlson-guide-25` | Weak/no word match (0.15) | NO |
| Lecture 4, p.14 | 5 | Describe the primary mechanism for macrolide resistance and how this relates to other antibiotics. | Drug encyclopedia: `drug:clindamycin` | Weak/no word match (0.19) | NO |
| Lecture 4, p.14 | 6 | Describe four side effects of erythromycin. | Drug encyclopedia: `drug:erythromycin` | Possible connection (0.29) | NO |
| Lecture 4, p.14 | 7 | What are the side effect issues with tilmicosin? | Arcade MCQ: `carlson-guide-27` | Weak/no word match (0.13) | NO |
| Lecture 4, p.14 | 8 | Describe the favorable pharmacokinetics of tulathromycin and the two new drugs? | Arcade MCQ: `r05` | Weak/no word match (0.14) | NO |
| Lecture 4, p.15 | 1 | Name three specific reasons why florfenicol is superior to chloramphenicol (hint: toxicity and resistance)? | Drug encyclopedia: `drug:florfenicol` | Weak/no word match (0.18) | NO |
| Lecture 4, p.15 | 2 | Describe the relationship between phenicols, neurologic disease, and B-lactams. | Arcade MCQ: `r05` | Weak/no word match (0.13) | NO |
| Lecture 4, p.15 | 3 | Why is chloramphenicol banned in food animals? | Arcade MCQ: `r06` | Related wording (0.42) | NO |
| Lecture 4, p.15 | 4 | What are Herxheimer’s reactions? | Main MCQ: `s1` | Weak/no word match (0.00) | NO |
| Lecture 4, p.15 | 5 | What are the two major clinical indications for florfenicol? | Arcade MCQ: `r05` | Weak/no word match (0.20) | NO |
| Lecture 4, p.16 | 1 | Clindamycin has a special “affinity” for which type of Gm+ bacteria? | Main MCQ: `vpq34-027` | Weak/no word match (0.13) | NO |
| Lecture 4, p.16 | 2 | What is the major side effect of clindamycin and how is it treated? | Main MCQ: `vpq34-027` | Weak/no word match (0.13) | NO |
| Lecture 4, p.16 | 3 | Why is pirlimycin to be used only in uncomplicated mastitis? | Learning card: `concept:Macrolide tissue penetration` | Weak/no word match (0.10) | NO |
| Lecture 4, p.16 | 4 | Know the clinical indications for clindamycin. | Arcade MCQ: `r05` | Weak/no word match (0.17) | NO |
| Lecture 4, p.17 | 1 | Explain why bacteria can’t live without protein synthesis yet most of the 50S inhibitors are only bacteriostatic. Which 50S inhibitors are cidal? | Main MCQ: `vpq34-026` | Possible connection (0.29) | NO |
| Lecture 4, p.17 | 2 | What is a common resistance theme in the 50S inhibitors. | Drug encyclopedia: `drug:tylosin` | Weak/no word match (0.22) | NO |
| Lecture 4, p.17 | 3 | Why is virginiamycin banned for food animal use in Europe? | Arcade MCQ: `r06` | Possible connection (0.25) | NO |
| Lecture 4, p.17 | 4 | Describe the pharmacokinetic properties of streptogramins that (a) create a potential food safety hazard and (b) help to eliminate a “hiding place” for a superpathogen. | Arcade MCQ: `r07` | Weak/no word match (0.12) | NO |
| Lecture 4, p.17 | 5 | Tiamulin seems to be primarily relegated to which species? | Main MCQ: `vpq34-022` | Weak/no word match (0.15) | NO |
| Lecture 5, p.18 | 1 | What is the MOA for FQs and how do they affect overall bacterial cell morphology? | Learning card: `concept:Fluoroquinolone DNA targets` | Weak/no word match (0.08) | NO |
| Lecture 5, p.18 | 2 | Name the MOAs for the other 3 classes of antibiotics in this subsection and be able to classify each based on bacterial killing versus stasis. | Arcade MCQ: `m01` | Weak/no word match (0.10) | NO |
| Lecture 5, p.18 | 3 | What “subgroup” of bacteria are unaffected by any of the 5 veterinary FQs? | Main MCQ: `extra18` | Weak/no word match (0.00) | NO |
| Lecture 5, p.18 | 4 | Why could FQs be considered “designer drugs”. | Learning card: `concept:Metronidazole activation` | Weak/no word match (0.11) | NO |
| Lecture 5, p.18 | 5 | Describe 3 side effects of FQs in dogs, 1 in cats, and 1 in horses? | Learning card: `concept:FQ retinal and cartilage risks` | Weak/no word match (0.20) | NO |
| Lecture 5, p.18 | 6 | Describe the MIC-MPC relationship for FQs. | Main MCQ: `extra18` | Weak/no word match (0.00) | NO |
| Lecture 5, p.18 | 7 | What are the precautions/legal limitations of FQs in food animals? | Drug encyclopedia: `drug:orbifloxacin` | Weak/no word match (0.10) | NO |
| Lecture 5, p.18 | 8 | Name 2 drug interactions of FQs. | Main MCQ: `vpq34-035` | Weak/no word match (0.18) | NO |
| Lecture 5, p.18 | 9 | Describe the post-antibiotic effect. | Drug encyclopedia: `drug:pradofloxacin` | Weak/no word match (0.17) | NO |
| Lecture 5, p.19 | 10 | Describe the major basis for FQ resistance. | Main MCQ: `vpq34-031` | Weak/no word match (0.19) | NO |
| Lecture 5, p.19 | 11 | Describe bacterial resistance and MPCs in regards to FQ therapy. | Drug encyclopedia: `drug:rifampin` | Weak/no word match (0.21) | NO |
| Lecture 5, p.19 | 14 | Name an indication for FQs, and one for rifampin. | Main MCQ: `vpq34-031` | Weak/no word match (0.13) | NO |
| Lecture 5, p.20 | 1 | Explain the difference between synergism and potentiation in regards to antibiotic combinations especially sulfonamides and benzylpyrimidines. | Main MCQ: `extra19` | Weak/no word match (0.10) | NO |
| Lecture 5, p.20 | 2 | What are the mechanisms of action for sulfonamides and benzylpyrimidines? | Arcade MCQ: `m03` | Possible connection (0.26) | NO |
| Lecture 5, p.20 | 3 | Explain why sulfonamides and benzylpyrimidines do not have a significant effect on the analogous pathway in most eukaryotes. | Main MCQ: `extra19` | Weak/no word match (0.18) | NO |
| Lecture 5, p.20 | 4 | Explain resistance versus susceptibility for sulfonamide + benzylpyrimidine combinations, including the spectrum chart. | Arcade MCQ: `carlson-guide-29` | Weak/no word match (0.18) | NO |
| Lecture 5, p.20 | 5 | Describe the exploitable pharmacogenetic situation involving dogs and benzylpyrimidine pharmacokinetics (see original slide for related spectrum chart). | Drug encyclopedia: `drug:orbifloxacin` | Weak/no word match (0.07) | NO |
| Lecture 5, p.20 | 6 | Name four side effects of sulfonamides. Gm(-) Sulfas+BP Sulfas+BP | Main MCQ: `extra19` | Weak/no word match (0.14) | NO |
| Lecture 5, p.20 | 7 | What pathogen “group” should NOT be treated with sulfonamides and why? | Main MCQ: `extra19` | Weak/no word match (0.12) | NO |
| Lecture 5, p.20 | 8 | What is the basis for resistance to sulfonamides and benzylpyrimidines? | Main MCQ: `extra19` | Weak/no word match (0.14) | NO |
| Lecture 5, p.21 | 9 | Why are sulfonamides and benzylpyrimidines ineffective in abscesses or pus? | Main MCQ: `extra19` | Weak/no word match (0.12) | NO |
| Lecture 5, p.21 | 10 | Name the two sulfonamides used versus enteric infections and why these drugs are used as such. | Main MCQ: `extra19` | Weak/no word match (0.12) | NO |
| Lecture 5, p.21 | 11 | Which bacterial (morphologic) “group” is resistant to these sulfonamides. | Main MCQ: `extra19` | Weak/no word match (0.12) | NO |
| Lecture 5, p.21 | 12 | How do ionophores work and what species is very sensitive to these drugs? | Arcade MCQ: `m05` | Weak/no word match (0.09) | NO |
| Lecture 5, p.21 | 13 | Name two non-infectious uses for ionophores. | Arcade MCQ: `m06` | Weak/no word match (0.21) | NO |
| Lectures 6–7, p.22 | 1 | Name some general clinical indications for the use of NSAIDs, e.g. analgesia, pyrexia, etc. | Learning card: `concept:NSAID drug species contrasts` | Weak/no word match (0.21) | NO |
| Lectures 6–7, p.22 | 2 | What types of pain are mitigated by NSAIDs and which types are not completely influenced by NSAIDs? | Learning card: `concept:NSAID drug species contrasts` | Weak/no word match (0.21) | NO |
| Lectures 6–7, p.22 | 3 | How do NSAIDs alter nocioception? | Main MCQ: `vpq34-037` | Weak/no word match (0.17) | NO |
| Lectures 6–7, p.22 | 4 | Name three functions of COX1 in homeostasis. | Drug encyclopedia: `drug:firocoxib` | Weak/no word match (0.14) | NO |
| Lectures 6–7, p.22 | 5 | How do COX1 and COX2 differ, in general terms, regarding basal activity? | Main MCQ: `vpq34-039` | Weak/no word match (0.10) | NO |
| Lectures 6–7, p.22 | 6 | Which is a potentially better NSAID target- COX1 and COX2- and why? | Learning card: `concept:Grapiprant EP4 pathway` | Weak/no word match (0.14) | NO |
| Lectures 6–7, p.22 | 7 | How do NSAIDs reduce fever and what COX may be involved? | Arcade MCQ: `carlson-guide-32` | Possible connection (0.32) | NO |
| Lectures 6–7, p.22 | 8 | How do NSAIDs alter two important parts of inflammation? | Arcade MCQ: `carlson-guide-32` | Possible connection (0.23) | NO |
| Lectures 6–7, p.22 | 9 | Why does co-inhibition of LOX help to minimize an NSAID side effect? | Drug encyclopedia: `drug:robenacoxib` | Possible connection (0.25) | NO |
| Lectures 6–7, p.22 | 10 | Name four adverse effects of NSAIDs and the basis for each. | Arcade MCQ: `carlson-guide-35` | Possible connection (0.38) | NO |
| Lectures 6–7, p.23 | 11 | Name four drug types that should NOT be combined with NSAIDs. | Drug encyclopedia: `drug:firocoxib` | Possible connection (0.24) | NO |
| Lectures 6–7, p.23 | 12 | Why are NSAIDs ineffective versus RA? | Main MCQ: `vpq34-037` | Weak/no word match (0.20) | NO |
| Lectures 6–7, p.24 | 1 | Name the three NSAIDs that are safe(st) in cats. | Drug encyclopedia: `drug:robenacoxib` | Possible connection (0.25) | NO |
| Lectures 6–7, p.24 | 2 | Name the COX2-selective NSAIDs and why do these drugs spare the GI tract? | Drug encyclopedia: `drug:firocoxib` | Weak/no word match (0.20) | NO |
| Lectures 6–7, p.24 | 3 | Name the NSAID that can treat visceral pain. | Arcade MCQ: `n04` | Related wording (0.39) | NO |
| Lectures 6–7, p.24 | 4 | Name two NSAIDs that are used or can be used vs. endotoxemia. | Drug encyclopedia: `drug:flunixin` | Possible connection (0.26) | NO |
| Lectures 6–7, p.24 | 5 | Why would you prescribe carprofen in dogs and what is the major risk? | Learning card: `concept:NSAIDs in hypovolemia` | Possible connection (0.24) | NO |
| Lectures 6–7, p.24 | 6 | Name two NSAIDs that are banned in food animals? | Main MCQ: `vpq34-037` | Weak/no word match (0.14) | NO |
| Lectures 6–7, p.24 | 7 | Why did some of the coxibs get removed from the marketplace and why is this not a problem in dogs? Name two coxibs used in veterinary medicine. | Main MCQ: `vpq34-040` | Weak/no word match (0.14) | NO |
| Lectures 6–7, p.24 | 8 | Name the NSAID approved in swine. | Main MCQ: `vpq34-037` | Weak/no word match (0.17) | NO |
| Lectures 6–7, p.24 | 9 | Name two NSAIDs that are preferred in horses. | Main MCQ: `vpq34-037` | Possible connection (0.33) | NO |
| Lectures 6–7, p.25 | 10 | Why is acetaminophen a weak NSAID or maybe not even an NSAID? | Drug encyclopedia: `drug:firocoxib` | Weak/no word match (0.20) | NO |
| Lectures 6–7, p.25 | 11 | Why is the route of administration an advantage for meloxicam & robenacoxib? | Main MCQ: `extra26` | Weak/no word match (0.21) | NO |
| Lectures 6–7, p.25 | 12 | What is unique about tepoxaline? Why is it gastroprotective? | Main MCQ: `s2` | Weak/no word match (0.00) | NO |
| Lectures 6–7, p.25 | 13 | What is the unique clinical application of piroxicam? Other drug used with it? | Drug encyclopedia: `drug:flunixin` | Weak/no word match (0.09) | NO |
| Lectures 6–7, p.25 | 14 | What appears to be the only safe NSAID for long-term use in cats? | Drug encyclopedia: `drug:robenacoxib` | Possible connection (0.25) | NO |
| Lectures 6–7, p.25 | 15 | What is the obstacle to long-term treatment with phenylbutazone in horses? | Main MCQ: `vpq34-037` | Possible connection (0.26) | NO |
| Lectures 6–7, p.25 | 16 | Describe how ketamine could be an adjunct to treat endotoxicosis. | Main MCQ: `s2` | Weak/no word match (0.00) | NO |
| Lectures 6–7, p.25 | 17 | Why does aspirin cause such profound bleeding disorders? | Arcade MCQ: `carlson-guide-34` | Weak/no word match (0.10) | NO |
| Lectures 6–7, p.25 | 18 | Why are some NSAIDs contraindicated in pregnant animals? | Main MCQ: `vpq34-037` | Weak/no word match (0.13) | NO |
| Lectures 6–7, p.25 | 19 | For DMSO, describe the precaution, its use with another drug group, and a clinical application. | Arcade MCQ: `n02` | Weak/no word match (0.08) | NO |
| Lectures 6–7, p.26 | 20 | Best NSAID group for long-term use in dogs? | Drug encyclopedia: `drug:robenacoxib` | Weak/no word match (0.18) | NO |
| Lecture 8, p.27 | 1 | What are the functions of histamine in physiological and pathophysiological conditions? • • | Drug encyclopedia: `drug:famotidine` | Weak/no word match (0.20) | NO |
| Lecture 8, p.27 | 2 | Describe histamine storage and release. • | Learning card: `concept:Gastrin-ECL-parietal pathway` | Weak/no word match (0.22) | NO |
| Lecture 8, p.27 | 3 | What are the different types of histamine receptors? Understand the role of H1 receptor and H2 receptor-mediated effects of histamine. • | Learning card: `concept:Histamine synthesis` | Possible connection (0.31) | NO |
| Lecture 8, p.27 | 4 | List the names of common physiological antagonists used to block the adverse effects of histamine. • | Drug encyclopedia: `drug:famotidine` | Possible connection (0.24) | NO |
| Lecture 8, p.27 | 5 | What are the major side effects of first-generation H1 anti-histamines? • • | Learning card: `concept:First generation H1 blockade` | Possible connection (0.29) | NO |
| Lecture 8, p.27 | 6 | List the names of second-generation H1 anti-histamines and therapeutic uses. • | Drug encyclopedia: `drug:loratadine` | Weak/no word match (0.16) | NO |
| Lecture 8, p.27 | 7 | Describe the role of histamine in gastric acid secretion. • | Main MCQ: `extra27` | Related wording (0.52) | NO |
| Lecture 8, p.27 | 8 | List the names of H2 receptor blockers and their therapeutic uses. | Learning card: `concept:Histamine synthesis` | Weak/no word match (0.14) | NO |
| Lecture 9, p.28 | 1 | How do corticosteroids inhibit PLA2? | Main MCQ: `vpq34-053` | Weak/no word match (0.16) | NO |
| Lecture 9, p.28 | 2 | What is the general vascular MOA for the anti-inflammatory effects of corticosteroids? | Drug encyclopedia: `drug:hydrocortisone` | Possible connection (0.26) | NO |
| Lecture 9, p.28 | 3 | Be able to recognize a disease that will benefit from corticosteroid therapy. | Main MCQ: `vpq34-054` | Weak/no word match (0.10) | NO |
| Lecture 9, p.28 | 4 | Be able to recognize a side effect associated with corticosteroid therapy. | Learning card: `concept:Glucocorticoid metabolic signs` | Weak/no word match (0.13) | NO |
| Lecture 9, p.28 | 5 | What are the two main corticosteroids indicated for use in cats? | Main MCQ: `extra33` | Possible connection (0.30) | NO |
| Lecture 9, p.28 | 6 | What is the corticosteroid indicated for use against bovine ketosis? | Main MCQ: `extra33` | Weak/no word match (0.12) | NO |
| Lecture 9, p.28 | 7 | Name the drug used to replace mineralocorticoid activity. | Drug encyclopedia: `drug:hydrocortisone` | Possible connection (0.26) | NO |
| Lecture 9, p.28 | 8 | How are horses and cats similar in regards to corticosteroid therapy? | Main MCQ: `vpq34-052` | Weak/no word match (0.12) | NO |
| Lecture 9, p.28 | 9 | Why is depo-methylprednisolone a second choice in atopic dogs but a viable first choice in cats? | Learning card: `concept:Glucocorticoid metabolic signs` | Weak/no word match (0.11) | NO |
| Lecture 9, p.29 | 10 | Which is more likely to require corticosteroid replacement therapy after receiving corticosteroid therapy- an atopic dog or a dog with pemphigus? | Learning card: `concept:HPA feedback and tapering` | Weak/no word match (0.15) | NO |
| Lecture 9, p.30 | 1 | Name three advantages for triamcinolone. | Main MCQ: `s4` | Weak/no word match (0.00) | NO |
| Lecture 9, p.30 | 2 | Which topical corticosteroid would be a good choice if you were especially concerned about side effects in a patient? | Learning card: `concept:Glucocorticoid metabolic signs` | Weak/no word match (0.17) | NO |
| Lecture 9, p.30 | 3 | Name two drugs that should not be used in conjunction with corticosteroids. | Arcade MCQ: `s02` | Weak/no word match (0.13) | NO |
| Lecture 9, p.30 | 4 | Name the adrenolytic drug and describes how it works. | Main MCQ: `s4` | Weak/no word match (0.00) | NO |
| Lecture 9, p.30 | 5 | Name the six drugs that reduce corticosteroid secretion and the MOA for each. | Main MCQ: `extra31` | Weak/no word match (0.12) | NO |
| Lecture 9, p.30 | 6 | What long-term therapy will be need after adrenolytic therapy? | Arcade MCQ: `carlson-guide-42` | Weak/no word match (0.21) | NO |
| Lecture 9, p.30 | 7 | What side effect is common to trilostane and ketoconazole but not relevant for the other secretion inhibitors? | Drug encyclopedia: `drug:trilostane` | Weak/no word match (0.21) | NO |

## Objective-level quality gate

- Confirm instructor intent, complete lists, species, formulation, routes, mechanisms, and regulatory exceptions.
- Require a direct recall answer, mechanistic WHY, an independent differentiation/application question, and a patient case when relevant.
- Medical review drug/species/food-animal cautions with authoritative, date-stamped references.
- Identify source-verified, medically reviewed, playable, and browser-tested separately.
- Link drug references, mechanism cards and questions using stable objective IDs; stop duplicating educational content.

## Repository inventory
- Main pharmacology questions: 95.
- Arcade questions: 145.
- Mechanism teaching cards: 70.
- Drug entries: 66.
- These inventories overlap and are not independent learning-objective counts.