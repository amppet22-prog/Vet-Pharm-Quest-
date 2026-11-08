/* Veterinary Antibiotic Selection & PK/PD learning center.
 * Non-prescriptive educational teaching. Distinguish cephalosporin generations
 * from first/second/third-LINE clinical stewardship tiers. */
window.VPQ_ABX_LESSON={
 title:"Antibiotic Selection • Generations + PK/PD",
 generations:[
  {name:"1st-generation cephalosporins",examples:"Cephalexin, cefazolin, cefadroxil",spectrum:"Generally stronger emphasis on susceptible Gram-positive bacteria; narrower Gram-negative coverage.",use:"Consider susceptibility, site and indication: e.g., cefazolin for appropriate surgical prophylaxis, cephalexin for selected canine skin infections when systemic treatment is justified.",caution:"MRSP/MRSA, enterococci and Pseudomonas generally are not covered. Narrower is preferable only when it actually covers the pathogen."},
  {name:"2nd-generation cephalosporins",examples:"Cefuroxime, cefaclor; cefoxitin is a cephamycin commonly grouped here",spectrum:"Somewhat expanded Gram-negative coverage for certain agents; anaerobic coverage is drug-specific (not universal).",use:"Selected organisms or surgical contexts when an individual drug's spectrum and culture evidence support it; less routinely used in many small-animal settings.",caution:"Never assume all drugs in a generation share the same activity or that the next generation is automatically a better choice."},
  {name:"3rd-generation cephalosporins",examples:"Ceftiofur, cefovecin, cefpodoxime (drug/species/indication dependent)",spectrum:"Generally enhanced activity against susceptible Gram-negative organisms, with differences in Gram-positive activity and duration.",use:"Ceftiofur is used for specific labeled livestock indications; cefovecin and cefpodoxime have selected companion-animal indications. Verify species, diagnosis and label.",caution:"Broader coverage creates greater stewardship responsibility; don't use merely for convenience or as an automatic upgrade. Food-animal restrictions and withdrawal requirements apply."}
 ],
 fundamentals:[
  ["MIC — Minimum inhibitory concentration","Lowest tested antibiotic concentration preventing visible growth of the isolate in vitro. Lower MIC is not automatically a better clinical drug, especially across different antibiotics: interpretation needs drug/organism/species/site-specific breakpoints and achievable exposure."],
  ["S / I / R — breakpoint categories","Lab interpretation depends on the validated breakpoint, drug, pathogen, species and sometimes infection site. A number without an applicable breakpoint must not be treated as proof of clinical susceptibility."],
  ["PK vs PD","Pharmacokinetics = what the patient does to the drug (absorption, distribution, metabolism, excretion). Pharmacodynamics = what drug exposure does to bacteria/host; combine them to interpret response."],
  ["Cmax and Tmax","Cmax is peak measured concentration; Tmax is time to that peak. For concentration-dependent killing, adequate peak relative to MIC may matter; high levels also raise toxicity concerns."],
  ["AUC — Area under the concentration–time curve","Total systemic exposure over a defined interval. AUC/MIC relates exposure to bacterial susceptibility; the useful target depends on the exact drug/organism and free vs total concentration."],
  ["fT > MIC — Free time above MIC","Fraction of each dosing interval when unbound antibiotic concentration exceeds MIC. Important for beta-lactams (penicillins/cephalosporins). Shortening the interval or extending infusion can sometimes improve exposure, but not without species-specific clinical guidance."],
  ["Cmax/MIC vs AUC/MIC","Cmax/MIC emphasizes peak relative to MIC (often aminoglycosides); AUC/MIC emphasizes overall exposure relative to MIC (important for many drugs, including fluoroquinolones). These are different ways of matching exposure to bacterial inhibition."],
  ["Half-life, clearance, Vd","Half-life reflects decline in plasma concentration; clearance is elimination capacity; apparent volume of distribution describes how drug distributes relative to plasma. Organ dysfunction can change exposure and adverse-effect risk."],
  ["Bioavailability and first-pass effect","Bioavailability is fraction reaching systemic circulation. Oral absorption and first-pass metabolism differ by drug and species, affecting whether a route gives meaningful concentrations."],
  ["Loading versus maintenance","A loading dose aims to reach a target concentration sooner, strongly related to Vd. Maintenance replaces drug eliminated over time, strongly related to clearance. Never infer a patient dose from these concepts alone."],
  ["Therapeutic index and adverse effects","A narrow safety margin means little separation between useful and toxic exposure. For aminoglycosides, kidney function and therapeutic drug monitoring can be important."],
  ["Resistance mechanisms","Examples: beta-lactamases, altered penicillin-binding proteins, efflux pumps, reduced permeability, target alteration and biofilm tolerance. Inadequate exposure can contribute to selection but excessive broad-spectrum treatment also disrupts flora."],
  ["First-line vs first-generation","FIRST-LINE is a preferred treatment choice in an indication or local guideline. FIRST-GENERATION refers to a cephalosporin subgroup. They are different classification systems."],
  ["Stewardship checklist","Confirm a bacterial indication; collect culture where indicated; identify patient/species and infection site; inspect susceptible isolates and breakpoints; favor suitable narrower therapy; verify tissue penetration and safety; reassess and de-escalate when possible."]
 ],
 worked:[
  {q:"Illustrative: an isolate has an MIC of 2 mg/L and the antibiotic's Cmax is 16 mg/L. What is Cmax/MIC?",answer:"16 ÷ 2 = 8. This is a ratio, not proof of efficacy; the clinically appropriate target depends on drug, pathogen, species, dose and site."},
  {q:"Illustrative: 24-hour AUC is 120 mg·h/L and MIC is 2 mg/L. What is AUC24/MIC?",answer:"120 ÷ 2 = 60 hours (often reported as a numerical PK/PD index with a standardized 24-h interval). Interpretation requires drug-specific exposure targets and whether free or total drug was measured."},
  {q:"Illustrative: free drug levels stay above MIC for 6 hours of an 8-hour interval. What is fT > MIC?",answer:"6 ÷ 8 × 100 = 75%. For beta-lactams, time above MIC is usually more informative than the highest peak alone."},
  {q:"Two different antibiotics have MICs 0.5 and 2 mg/L. Is the 0.5 drug necessarily better?",answer:"No. MICs across unrelated drugs cannot be ranked alone: achievable free-drug exposure, validated S/I/R breakpoints, site, toxicity, species and indication govern selection."}
 ],
 sources:[
  ["Merck Veterinary Manual: Antimicrobial Drug Factors for Animals","https://www.merckvetmanual.com/pharmacology/antimicrobials/antimicrobial-drug-factors-for-animals"],
  ["Merck Veterinary Manual: Microbiology Testing for Animals","https://www.merckvetmanual.com/pharmacology/antimicrobials/microbiology-testing-for-animals"],
  ["Merck Veterinary Manual: Design of Dosing Regimens for Animals","https://www.merckvetmanual.com/pharmacology/antimicrobials/design-of-dosing-regimens-for-animals"]
 ]
};
window.VPQ_ABX_LESSON_OPEN=function(showModal,escapeHtml){
 const d=window.VPQ_ABX_LESSON,esc=escapeHtml;
 const card=(title,body)=>'<section class="vpqAbxCard"><h3>'+esc(title)+'</h3>'+body+'</section>';
 const generation=d.generations.map(g=>card(g.name,'<p><b>Examples:</b> '+esc(g.examples)+'</p><p><b>Spectrum:</b> '+esc(g.spectrum)+'</p><p><b>Clinical application:</b> '+esc(g.use)+'</p><p><b>Stewardship:</b> '+esc(g.caution)+'</p>')).join('');
 const fundamental=d.fundamentals.map(([k,v])=>card(k,'<p>'+esc(v)+'</p>')).join('');
 const worked=d.worked.map((x,i)=>'<details class="vpqAbxExample"><summary>Example '+(i+1)+': '+esc(x.q)+'</summary><p>'+esc(x.answer)+'</p></details>').join('');
 const sources=d.sources.map(([name,url])=>'<li><a href="'+url+'" target="_blank" rel="noopener noreferrer">'+esc(name)+'</a></li>').join('');
 showModal('🧫 '+d.title,'<p>Lecture 1–2 concepts meet clinical antimicrobial selection. <b>Cephalosporin generations are NOT first-, second- or third-line prescribing tiers.</b></p>'+
 '<div class="infobox"><b>Core question:</b> Does this patient actually need an antibiotic, and can the selected drug achieve safe, effective exposure at the infection site against the likely or cultured organism?</div>'+
 '<h3>Cephalosporin generations · Compare, don’t memorize rank</h3><div class="vpqAbxGrid">'+generation+'</div>'+
 '<h3>Lecture 1–2 · Why the pharmacology works</h3><div class="vpqAbxGrid">'+fundamental+'</div>'+
 '<h3>Practice the interpretation</h3><p class="tiny">Reveal the calculation and reasoning. These numerical examples are hypothetical and not dosing instructions.</p>'+worked+
 '<h3>Reference reading</h3><ul>'+sources+'</ul><p class="tiny">Educational overview; verify local course notes, clinical breakpoints, approved species indications and current veterinary regulations before real prescribing.</p>');
};
