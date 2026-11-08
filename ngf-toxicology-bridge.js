/* Vet Pharm Quest: anti-NGF pharmacy curriculum + cross-linked Toxicology reference preview.
   Reference-only veterinary education. Product label and FDA safety changes checked November 2026. */
window.VPQ_NGFToxBridge=function(api){
'use strict';
const {D,escapeHtml,showModal,getDrugCard,setDrugCard,getPharmacy,setPharmacy,modalBody}=api;
const esc=x=>escapeHtml(String(x??''));
const ngf={
 mechanism:'Nerve growth factor (NGF) is a neurotrophin. In osteoarthritis, injured/inflamed tissues release NGF; NGF activates TrkA and p75NTR signaling, contributing to peripheral nociceptor sensitization and neurogenic inflammation. Anti-NGF monoclonal antibodies bind extracellular NGF, limiting its receptor signaling. Analgesia is not cartilage repair or an NSAID-like COX inhibition. NGF also has normal sensory/autonomic and developmental functions.',
 why:'Pain sensitization makes joints hurt even when mechanical damage alone does not explain the severity. Neutralizing NGF reduces that amplification, but reduced pain does not mean underlying osteoarthritis is cured. Gradual return to activity, mobility tracking, and ongoing weight/rehab strategies remain important.',
 difference:'NSAIDs reduce prostaglandin synthesis through COX inhibition and can compromise GI mucosal and renal perfusion physiology. Anti-NGF antibodies bind a pain-related neurotrophin and are not directly COX inhibitors. Neither is a disease-modifying cartilage regrowth therapy; their safety issues are different. Concurrent anti-NGF plus NSAID safety has not been established in the US product labeling.'
};
const cards=[
{id:'bedinvetmab',name:'Bedinvetmab (Librela)',brand:'Librela (Zoetis)',class:'Caninized anti-NGF monoclonal antibody • biologic analgesic',route:'Subcutaneous veterinary injection approximately monthly, per dog-specific current US label and weight band. Not a cat product.',uses:'US-approved control of pain associated with osteoarthritis in DOGS. Confirm OA as an important cause of signs and assess neurologic/orthopedic issues before treatment. Part of multimodal management, not a curative or cartilage-regenerating treatment.',moa:ngf.mechanism,effects:'Postapproval reports listed in 2025 US labeling include ataxia, seizures, paresis/paralysis, proprioceptive deficits, weakness, recumbency, urinary incontinence, polyuria/polydipsia, vomiting/diarrhea, and other changes; some reports involved death/euthanasia. Reported events do not independently prove causality. Hypersensitivity is possible.',why:ngf.why,lecture:'Lectures 6–7',species:'DOGS ONLY. Contraindicated with known hypersensitivity and in breeding, pregnant or lactating dogs. Safety in dogs younger than 12 months not evaluated. Discuss current FDA Client Information Sheet before every injection. Concurrent NSAID safety has not been established.',source:'FDA 2025 safety labeling; US Librela label; Merck Veterinary Manual OA',reviewStatus:'FDA-label reviewed Nov 2026'},
{id:'frunevetmab',name:'Frunevetmab (Solensia)',brand:'Solensia (Zoetis)',class:'Felinized anti-NGF monoclonal antibody • biologic analgesic',route:'Subcutaneous veterinary injection approximately monthly, using current feline weight-based US label. Not a dog product.',uses:'US-approved control of pain associated with osteoarthritis in CATS. Assess altered jumping, grooming, play and mobility; confirm OA and consider other diseases. Multimodal pain treatment, not cartilage repair.',moa:ngf.mechanism,effects:'The October 2026 US FDA postapproval label includes reports of severe pruritus, scabs/alopecia/skin lesions, appetite/weight loss, lethargy, vomiting/diarrhea, ataxia, seizures, weakness/paresis, altered gait/jumping, urinary/renal changes, anaphylaxis and death/euthanasia in some cases. These are reports; causal relation and incidence cannot always be determined.',why:ngf.why,lecture:'Lectures 6–7',species:'CATS ONLY. Contraindicated with known hypersensitivity and in breeding, pregnant or lactating cats. Not evaluated in cats under 7 months or below 5.5 lb. Discuss current FDA Client Information Sheet before EVERY injection. Concurrent NSAID safety has not been established.',source:'FDA Solensia safety update Oct 5 2026; updated US Solensia label',reviewStatus:'FDA-label reviewed Nov 2026'}
];
for(const x of cards)if(!D.drugs.some(d=>d.id===x.id))D.drugs.push(x);
const questions=[
{id:'ngf-learning-01',lecture:'Lectures 6–7',topic:'NGF monoclonal antibodies',q:'A dog with osteoarthritis receives bedinvetmab. What is the main analgesic mechanism?',options:['Neutralize NGF and reduce nociceptor sensitization','Inhibit COX-1 and COX-2','Repair degenerating cartilage directly','Stimulate glucocorticoid receptors'],answer:0,why:'Bedinvetmab is an anti-NGF monoclonal antibody. It reduces NGF-mediated pain signaling but is not an NSAID and does not regenerate cartilage.',source:'Librela US product label; Merck Veterinary Manual'},
{id:'ngf-learning-02',lecture:'Lectures 6–7',topic:'Species-specific drugs',q:'Which paired drug and species is correct for US-labeled osteoarthritis pain control?',options:['Frunevetmab—dogs; bedinvetmab—cats','Both drugs are approved for either species','Bedinvetmab—dogs; frunevetmab—cats','Both drugs are antibiotics'],answer:2,why:'Librela/bedinvetmab is canine-specific; Solensia/frunevetmab is feline-specific. These monoclonal antibodies are not interchangeable between species.',source:'FDA Librela and Solensia labels'},
{id:'ngf-learning-03',lecture:'Lectures 6–7',topic:'Adverse effects / monitoring',q:'After receiving an anti-NGF injection, a dog develops new ataxia and urinary incontinence. What is the appropriate interpretation?',options:['Expected proof that the drug worked','Ignore because mAbs cannot cause adverse events','Automatically diagnose rapidly progressive OA','Promptly assess the dog and report a suspected adverse event while investigating other causes'],answer:3,why:'The FDA lists neurologic and urinary signs in Librela postapproval reports. A temporal association is clinically important, but a spontaneous report alone does not establish causality.',source:'FDA Librela safety letter and label update 2025'},
{id:'ngf-learning-04',lecture:'Lectures 6–7',topic:'NGF vs NSAIDs',q:'A patient receiving an anti-NGF monoclonal antibody also needs an NSAID. Which statement is best supported by current US product labeling?',options:['Concurrent use is proven universally safe','Concurrent NSAID safety has not been established; assess risks and current labeling','The antibody is itself an NSAID','Combining them repairs cartilage'],answer:1,why:'US product labels state that anti-NGF mAb + NSAID safety has not been established in cats or dogs. Do not confuse a different mechanism with proven combination safety.',source:'FDA Librela and Solensia labels'}
];
for(const x of questions)if(!D.study.some(q=>q.id===x.id))D.study.push(x);
const toxCards=[
{id:'tox-acetaminophen',name:'Acetaminophen',species:'Cats particularly sensitive; dogs can be affected',source:'Human analgesic accidental or intentional administration',mechanism:'Reactive NAPQI consumes glutathione. Oxidative erythrocyte damage produces methemoglobinemia; hepatocellular injury may occur.',signature:'Cat: brownish blood, cyanosis, facial/paw edema, Heinz bodies; dog: hepatic injury can dominate.',clinical:'Urgent veterinary triage; stabilize oxygenation, assess methemoglobin and hepatic injury. Specific therapy such as N-acetylcysteine requires veterinary case management.',distinction:'Not an NSAID; avoid conflating its toxicity with COX inhibitor overdose.'},
{id:'tox-lily',name:'True lily / daylily',species:'Cats',source:'Lilium and Hemerocallis plants; leaves, pollen and vase water',mechanism:'Unknown nephrotoxic principle can cause severe acute tubular injury.',signature:'Any exposure in a cat is an urgent potential acute kidney injury, even if initially asymptomatic.',clinical:'Contact veterinarian/poison service immediately; early intervention and renal monitoring matter.',distinction:'Peace lily / insoluble oxalate plants often cause oral irritation and are not the same as true lily nephrotoxicity.'},
{id:'tox-grape',name:'Grapes / raisins',species:'Dogs; individual sensitivity varies',source:'Fresh or dried grape fruit and food products',mechanism:'Tartaric acid has been implicated in canine acute kidney injury; susceptibility is unpredictable.',signature:'GI signs may precede acute azotemia and tubular injury.',clinical:'Prompt professional exposure assessment and renal monitoring; no reliably safe dose established.',distinction:'Do not assume risk from only number of grapes eaten or from the absence of early signs.'},
{id:'tox-bromethalin',name:'Bromethalin rodenticide',species:'Dogs and cats',source:'Rodenticide bait; color/shape do not identify active ingredient',mechanism:'Mitochondrial oxidative phosphorylation uncoupling causes energy depletion and edema in nervous tissue.',signature:'Neurologic dysfunction, tremors, weakness, paralysis or seizures; delayed onset possible.',clinical:'Urgent veterinary assessment; no specific reversal with vitamin K1.',distinction:'Vitamin K1 treats anticoagulant rodenticide poisoning, not bromethalin.'},
{id:'tox-anticoag',name:'Anticoagulant rodenticides',species:'Dogs, cats and wildlife',source:'Baits containing anticoagulant ingredients',mechanism:'Vitamin K epoxide reductase inhibition prevents activation of factors II, VII, IX and X.',signature:'Delayed coagulopathy, hemorrhage, dyspnea, weakness.',clinical:'Veterinary coagulation testing and appropriate vitamin K1 management depending on agent/exposure.',distinction:'Unlike bromethalin, anticoagulant rodenticides disrupt vitamin K-dependent clotting factors.'},
{id:'tox-permethrin',name:'Concentrated pyrethroids / permethrin',species:'Cats at high risk especially dog spot-on exposure',source:'Inappropriate dog flea products or environmental products',mechanism:'Voltage-gated sodium channel interference causes prolonged neuronal excitation.',signature:'Feline tremors, fasciculations, hypersalivation, hyperthermia or seizures.',clinical:'Emergency veterinary management of dermal exposure and neurologic signs; avoid treating cats with dog-only permethrin products.',distinction:'Cats have limited ability to metabolize some pyrethroids and are highly susceptible to concentrated exposure.'},
{id:'tox-ionophore',name:'Ionophores (monensin)',species:'Horses highly sensitive; livestock feed exposure',source:'Cross-contaminated or misfed medicated feed',mechanism:'Disrupted cation gradients cause cardiac and skeletal muscle energy/ion homeostasis failure.',signature:'Weakness, myonecrosis, arrhythmia, sudden death.',clinical:'Stop exposure and obtain urgent veterinary assessment, cardiac/muscle monitoring and feed investigation.',distinction:'An ionophore in a feed formulation can be approved for one species yet hazardous to another.'},
{id:'tox-ethylene-glycol',name:'Ethylene glycol',species:'Dogs and cats',source:'Certain automotive antifreeze and industrial products',mechanism:'Alcohol dehydrogenase generates toxic acidic metabolites including oxalate; metabolic acidosis and renal injury follow.',signature:'Early intoxication-like signs can progress to severe acidosis and calcium oxalate-associated AKI.',clinical:'Immediate emergency veterinary assessment; antidotal treatment is strongly time-sensitive and species-dependent.',distinction:'Fomepizole inhibits alcohol dehydrogenase; use is a veterinary emergency decision, not a home treatment.'},
{id:'tox-sago',name:'Sago palm / cycads',species:'Dogs particularly common exposure',source:'Ornamental Cycas plants, especially seeds',mechanism:'Cycasin metabolites cause severe hepatocellular injury; other neurotoxic constituents can contribute.',signature:'Acute GI signs followed by bleeding, hepatic dysfunction and possibly neurologic signs.',clinical:'Immediate veterinary exposure assessment, stabilization and hepatic function monitoring.',distinction:'Not every ornamental palm has the same toxicity as Cycas.'},
{id:'tox-xylitol',name:'Xylitol',species:'Dogs especially; species response differs',source:'Sugar-free products and selected food/supplement formulations',mechanism:'Dogs can develop marked insulin release with hypoglycemia; some exposures cause hepatic injury.',signature:'Early hypoglycemia, weakness or seizures; possible later hepatic injury.',clinical:'Urgent veterinarian evaluation, serial glucose and liver monitoring; product concentration must be checked.',distinction:'A benign human sweetener can produce species-specific endocrine toxicity.'}
];
/* Clinical recognition and test selection added as separately auditable toxicant fields. */
const toxClinicalRecognition={"tox-acetaminophen":{"signs":"Cats: depression, dyspnea/tachypnea, cyanotic or muddy mucous membranes, facial or paw swelling, vomiting; dogs may develop vomiting, abdominal pain, icterus, hepatic dysfunction.","clues":"Known human analgesic access; chocolate-brown blood or cyanosis inadequately responsive to oxygen suggests methemoglobinemia. Heinz bodies may be present.","tests":"Co-oximetry/methemoglobin when available; blood smear for Heinz bodies, CBC/PCV, ALT/AST, bilirubin, glucose, coagulation tests if hepatotoxicity suspected."},"tox-lily":{"signs":"Cats may initially vomit, drool, become lethargic or anorexic; later polyuria, oliguria/anuria and clinical signs of acute kidney injury can develop.","clues":"Any credible Lilium/Hemerocallis exposure, including pollen or vase water, is important even if the cat looks normal and initial creatinine is normal.","tests":"Serial creatinine/BUN, phosphorus, electrolytes, urinalysis and urine output; early tests do not exclude impending renal injury."},"tox-grape":{"signs":"Dogs may vomit, develop diarrhea, anorexia, lethargy or abdominal discomfort; acute kidney injury can progress to oliguria/anuria.","clues":"Grape/raisin-containing food exposure plus subsequent GI signs or rising renal values; an initially normal renal panel cannot rule out later injury.","tests":"Serial creatinine/BUN, phosphorus, potassium, urinalysis, urine output and hydration assessment."},"tox-bromethalin":{"signs":"Tremors, hyperexcitability, seizures, weakness, ataxia, paresis or paralysis; onset can be delayed and presentation depends on dose.","clues":"Rodenticide exposure with progressive neurologic signs; bait color cannot distinguish bromethalin from anticoagulants or cholecalciferol.","tests":"Thorough product/ingredient identification and neurologic exam; assess glucose/electrolytes and other causes of seizures. Specialized bromethalin testing is not usually immediately available."},"tox-anticoag":{"signs":"Delayed weakness, pallor, bruising, epistaxis, melena, hematoma, dyspnea, cough or hemorrhage into body cavities; early animals may appear normal.","clues":"Possible bait exposure with delayed bleeding; prolonged PT may precede prolonged aPTT because factor VII has a short half-life.","tests":"PT and aPTT at appropriate intervals, CBC/PCV, platelets, imaging if internal bleeding suspected; identify the bait ingredient when possible."},"tox-permethrin":{"signs":"Cats: muscle fasciculations, tremors, hyperesthesia, agitation, hypersalivation, ataxia, hyperthermia or seizures.","clues":"Recent application of a dog-only flea spot-on product to a cat or close contact with a treated dog; pronounced tremors after topical exposure.","tests":"Exposure history and physical/neurologic exam; temperature, glucose, electrolytes, CK and renal function when severe muscle activity or hyperthermia occurs."},"tox-ionophore":{"signs":"Horses may develop weakness, sweating, tachycardia, muscle pain or stiffness, recumbency, arrhythmias or sudden death; other livestock may show weakness and cardiac disease.","clues":"Recent medicated or contaminated feed, especially equine access to cattle feed; unexplained myocardial or skeletal muscle injury.","tests":"CK/AST, cardiac troponin, ECG and echocardiography where indicated; feed analysis and exposure investigation."},"tox-ethylene-glycol":{"signs":"Early depression, ataxia, vomiting and polyuria/polydipsia; later tachypnea from metabolic acidosis and signs of oliguric/anuric kidney injury.","clues":"Antifreeze exposure; increased anion gap metabolic acidosis and/or osmolar gap (time-dependent); calcium oxalate crystalluria supports but does not prove exposure.","tests":"Blood gas/electrolytes and anion gap, measured osmolality/osmolar gap when available, ethylene glycol assay if timely, urinalysis, serial renal values and calcium."},"tox-sago":{"signs":"Vomiting, diarrhea, depression and anorexia may precede icterus, bruising/bleeding, hepatic encephalopathy, hypoglycemia or severe hepatic failure.","clues":"Access to Cycas ornamental plants, especially seeds; GI illness followed by rising hepatocellular enzymes or coagulopathy.","tests":"Serial ALT/AST, bilirubin, glucose, albumin, coagulation tests (PT/aPTT), ammonia when indicated and hepatic function monitoring."},"tox-xylitol":{"signs":"Dogs can develop vomiting, weakness, ataxia, collapse or seizures from hypoglycemia; some develop delayed hepatocellular injury and coagulopathy.","clues":"Sugar-free product, gum, peanut butter or supplement exposure; rapid hypoglycemia may occur before other laboratory abnormalities.","tests":"Immediate and serial blood glucose, ALT/AST, bilirubin, electrolytes and coagulation parameters; quantify product concentration if known."}};
for(const item of toxCards){const extras=toxClinicalRecognition[item.id];if(extras)Object.assign(item,extras)}
// Expand the shared toxicant reference; original user-course cards retain their IDs.
const toxExtension=window.VPQ_TOX_EXPANSION;
const originalGroupNames={
 'tox-acetaminophen':'Oxidative RBC / coagulation','tox-lily':'Mineral / renal homeostasis',
 'tox-grape':'Mineral / renal homeostasis','tox-bromethalin':'CNS / cardiac signaling',
 'tox-anticoag':'Oxidative RBC / coagulation','tox-permethrin':'CNS / cardiac signaling',
 'tox-ionophore':'CNS / cardiac signaling','tox-ethylene-glycol':'Mineral / renal homeostasis',
 'tox-sago':'Hepatic bioactivation / metabolic','tox-xylitol':'Hepatic bioactivation / metabolic'
};
for(const item of toxCards){item.group=originalGroupNames[item.id]||'Other toxicants'}
const knownToxIds=new Set(toxCards.map(x=>x.id));
for(const x of toxExtension?.cards||[])if(!knownToxIds.has(x.id)){toxCards.push(x);knownToxIds.add(x.id)}
for(const x of window.VPQ_TOX_LECTURE_SUPPLEMENTS||[])if(!knownToxIds.has(x.id)){toxCards.push(x);knownToxIds.add(x.id)}
const toxCategories=[...new Set(toxCards.map(c=>c.group))].sort();
let chosenToxCategory='all';

function ngfGuide(){
showModal('🧠 Nerve Growth Factor · Anti-NGF Therapy','<div class="infobox"><h3>What does NGF normally do?</h3><p>'+esc(ngf.mechanism)+'</p><h3>Why blocking it reduces OA pain</h3><p>'+esc(ngf.why)+'</p></div><div class="infobox"><h3>Anti-NGF vs NSAIDs</h3><p>'+esc(ngf.difference)+'</p><p><b>Safety reminder:</b> Librela and Solensia each have postapproval adverse-event information. Review the current client information sheet before each injection; investigate new neurologic, urinary, skin or mobility changes.</p></div><div class="buttonrow"><button data-vpqngf-drug="bedinvetmab">🐕 Librela card</button><button data-vpqngf-drug="frunevetmab">🐈 Solensia card</button><button data-vpqngf-pharm="1">← Pharmacy</button></div><p class="tiny">Official references: <a href="https://www.fda.gov/animal-veterinary/drug-labels/animal-drug-safety-related-labeling-changes" target="_blank" rel="noopener noreferrer">FDA animal drug safety labeling</a> · <a href="https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=61c7b4e0-aab6-4cf5-8471-f94be438c758" target="_blank" rel="noopener noreferrer">Librela label</a> · <a href="https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a73b79c4-3623-4b52-81ea-6180528a031e" target="_blank" rel="noopener noreferrer">Solensia label</a>. Verified Nov 2026; check updates.</p>');
}
function toxIndex(query='',cat=chosenToxCategory){
 chosenToxCategory=toxCategories.includes(cat)?cat:'all';
 const match=toxCards.filter(x=>chosenToxCategory==='all'||x.group===chosenToxCategory);
 const visible=match.filter(x=>(x.name+' '+x.species+' '+x.group+' '+x.mechanism+' '+x.signature+' '+(x.overlaps||'')).toLowerCase().includes(query.toLowerCase())).length;
 const options='<option value="all">All mechanisms ('+toxCards.length+')</option>'+toxCategories.map(g=>'<option value="'+esc(g)+'" '+(chosenToxCategory===g?'selected':'')+'>'+esc(g)+'</option>').join('');
 showModal('☣️ Veterinary Toxicant Reference',
 '<div class="vpqToxIntro"><strong>Target → WHY → species → signs → useful tests</strong><p>Grouped by primary mechanism, but some toxicants injure multiple systems. The overlap note identifies important cross-links. This is a study guide, not a poisoning treatment algorithm or a complete verified exam bank.</p></div>'+
 '<div class="vpqToxControls"><label>Search toxicants<input class="input" id="vpqToxSearch" value="'+esc(query)+'" placeholder="Toxin, species or mechanism"></label><label>Mechanism group<select class="input" id="vpqToxCategory">'+options+'</select></label></div>'+
 '<p id="vpqToxCount" class="small">'+visible+' of '+toxCards.length+' toxicants</p>'+
 '<div class="vpqToxReferenceGrid">'+match.map(x=>'<button '+((x.name+' '+x.species+' '+x.group+' '+x.mechanism+' '+x.signature+' '+(x.overlaps||'')).toLowerCase().includes(query.toLowerCase())?'':'style="display:none" ')+'data-vpqtoxref="'+esc(x.id)+'" data-toxgroup="'+esc(x.group)+'" data-toxterms="'+esc((x.name+' '+x.species+' '+x.group+' '+x.mechanism+' '+x.signature+' '+(x.overlaps||'')).toLowerCase())+'"><b>'+esc(x.name)+'</b><small>'+esc(x.group)+'</small><small>'+esc(x.species)+'</small></button>').join('')+'</div>'+
 '<div class="buttonrow"><button data-vpqtoxcourse="1">📚 Course lecture outline</button><button data-vpqngf-pharm="1">💊 Drug shelves</button></div>'+
 '<p class="tiny">This is an expanding lecture-linked teaching reference. Coverage does not mean every lecture has been audited against its original slides; clinical patient, product and species facts must be source-checked.</p>');
}
function toxDetail(id){
 const x=toxCards.find(v=>v.id===id);if(!x)return toxIndex();
 const fields=[['Exposure source',x.source],['Species at risk',x.species],['Primary target / mechanism',x.mechanism],['WHY the signs occur',x.signature],['Clinical signs',x.signs||x.signature],['Exposure / differential clues',x.clues||x.source],['Tests and monitoring',x.tests||'Specific test selection depends on case context'],['Clinical response principle',x.clinical],['Do NOT confuse',x.distinction]];
 if(x.overlaps)fields.push(['Overlapping / secondary pathways',x.overlaps]);
 showModal('☣️ '+esc(x.name),
 '<div class="vpqToxDetailHeading"><b>Mechanism group:</b> '+esc(x.group)+'</div>'+
 '<div class="vpqToxReferenceGrid">'+fields.map(([label,txt])=>'<section><h3>'+esc(label)+'</h3><p>'+esc(txt)+'</p></section>').join('')+'</div>'+
 '<p class="tiny">Educational toxicology reference only. For an actual suspected poisoning, contact a veterinarian or animal poison control service immediately. Do not administer a home antidote or induce emesis based on a study card.</p>'+
 '<div class="buttonrow"><button data-vpqtoxindex="1">← Toxicant catalog</button>'+ 
 (function(){const units=window.VPQ_TOX_LECTURE_LINKS||{};return Object.entries(units).filter(([k,v])=>v.ids.includes(id)).map(([k])=>'<button data-vpqtoxlecture="'+esc(k)+'">📚 '+esc((window.VPQ_ToxicologyPreview?.topics||[]).find(x=>x.id===k)?.lectures||k)+'</button>').join('')})()+
 '</div>');
}
const previousCard=getDrugCard();
setDrugCard(function(d){
const html=previousCard(d);
if(!['bedinvetmab','frunevetmab'].includes(d.id))return html;
const specific=d.id==='bedinvetmab'?
{adverse:'New ataxia, weakness, seizures, proprioceptive changes, loss of bladder control, marked drinking/urination or GI signs warrant prompt assessment. FDA postapproval reports include serious outcomes, but causation is not established by reports alone.',
prevention:'Before treatment: confirm OA, take baseline mobility/neurologic and urine history, review concomitant drugs and current client information sheet. Discuss risk/uncertainty with owner. After analgesia, gradually reintroduce activity to limit injury. Reassess new signs before another injection.',
monitor:'Mobility/pain scores, neurologic gait and stance, urinary control, thirst/urination, GI signs, allergic reaction and exercise tolerance.'}:
{adverse:'2026 FDA postapproval data include severe pruritus/scabs/dermatitis, anorexia or weight loss, weakness, impaired jumping/gait, ataxia, seizures, urinary/renal changes and hypersensitivity reports. Causal relationship and frequency cannot reliably be assigned from these reports alone.',
prevention:'Before injection review health/skin exam, jumping/mobility history, current client information sheet and relevant comorbidities. Reassess new itching, lesions, urinary or neurologic changes promptly; avoid casually assuming they are normal aging or OA.',
monitor:'Pruritus/skin lesions, appetite/weight, jumping, gait, activity, urination/thirst and neurologic function.'};
return html+'<div class="vpqNGFClinical"><h3>🩺 Anti-NGF: clinical selection & safety</h3>'+[['Target and therapeutic difference',ngf.difference],['Postapproval concerns',specific.adverse],['Reducing risk / what to do',specific.prevention],['Monitor',specific.monitor]].map(([k,v])=>'<p><b>'+esc(k)+':</b> '+esc(v)+'</p>').join('')+'<button data-vpqngf-guide="1">Learn NGF physiology and comparison</button><p class="tiny">Reviewed against FDA updates through October 2026. Incidence and causal attribution for reported events may be uncertain.</p></div>';
});

/* Student Study Lounge starter practice, not lecture-filtered or graded.
   Mechanism matching draws only from the expanded veterinary toxicology reference. */
const mechanismMatches=[
 ['tox-acetaminophen','Reactive metabolite depletes glutathione, causing oxidative injury'],
 ['tox-lily','Feline acute tubular injury from true lily/daylily exposure'],
 ['tox-bromethalin','Mitochondrial energy failure and cerebral edema'],
 ['tox-anticoag','Vitamin K epoxide reductase inhibition'],
 ['tox-permethrin','Voltage-gated sodium-channel dysfunction'],
 ['tox-ethylene-glycol','Alcohol dehydrogenase produces toxic acidic metabolites'],
 ['tox-xylitol','Excess insulin release in dogs with hypoglycemia'],
 ['tox-op','Acetylcholinesterase inhibition and cholinergic excess'],
 ['tox-chocolate','Adenosine receptor antagonism and cardiac/CNS stimulation'],
 ['tox-botulinum','Presynaptic acetylcholine release blockade'],
 ['tox-tetanus','Loss of inhibitory GABA/glycine neurotransmission'],
 ['tox-cyanide','Mitochondrial cytochrome c oxidase inhibition'],
 ['tox-nitrate','Hemoglobin oxidation to methemoglobin'],
 ['tox-allium','Oxidative erythrocyte injury and hemolysis'],
 ['tox-cholecalciferol','Hypercalcemia and hyperphosphatemia with soft-tissue mineralization'],
 ['tox-co','Carboxyhemoglobin limits oxygen delivery'],
 ['tox-aflatoxin','Hepatic bioactivation to reactive metabolites'],
 ['tox-fescue','Ergot alkaloids suppress prolactin in pregnant mares']
];
let toxMatchRound=null;
function toxShuffle(xs){return xs.slice().sort(()=>Math.random()-.5)}
function toxMatchStart(){
 const items=toxShuffle(mechanismMatches).slice(0,10);
 toxMatchRound={items,idx:0,correct:0,answered:false};
 toxMatchShow();
}
function toxMatchShow(){
 const t=toxMatchRound;if(!t)return toxMatchStart();
 if(t.idx>=t.items.length){
  return showModal('☣️ Toxicant–Mechanism Match · Complete',
   '<p><b>'+t.correct+' / '+t.items.length+' correct.</b> This is ungraded study practice and does not change your existing game progress.</p>'+
   '<div class="buttonrow"><button data-vpqtoxmatchopen="1">↻ Try another set</button><button data-vpqtoxindex="1">☣️ Review Toxicant Reference</button></div>');
 }
 t.answered=false;
 const [id,correct]=t.items[t.idx],item=toxCards.find(x=>x.id===id);
 if(!item){t.idx++;return toxMatchShow()}
 const wrong=toxShuffle(mechanismMatches.filter(x=>x[0]!==id&&x[1]!==correct)).slice(0,3);
 const options=toxShuffle([[id,correct],...wrong]);
 showModal('☣️ Toxicant → Mechanism · '+(t.idx+1)+' / '+t.items.length,
  '<p class="small">Study Lounge starter · no grades or XP · independent of lecture selection</p>'+
  '<h3>Which mechanism best explains '+esc(item.name)+'?</h3>'+
  '<div class="vpqToxMatchAnswers">'+options.map((x,i)=>'<button data-vpqtoxmatchanswer="'+esc(x[0])+'">'+esc(x[1])+'</button>').join('')+'</div>'+
  '<p class="tiny">After you answer, review the mechanism, species and clinical clues. Do not use this practice round to guide poisoning treatment.</p>');
}
function toxMatchAnswer(chosen){
 const t=toxMatchRound;if(!t||t.answered||t.idx>=t.items.length)return;
 t.answered=true;
 const [id,correct]=t.items[t.idx],item=toxCards.find(x=>x.id===id);
 const yes=chosen===id;if(yes)t.correct++;
 showModal('☣️ '+(yes?'Correct mechanism!':'Review this mechanism'),
  '<p><b>'+esc(item?.name)+'</b> · '+(yes?'✓ Correct':'✗ Different target')+'</p>'+
  '<div class="infobox"><b>Mechanism:</b><p>'+esc(correct)+'</p><p><b>WHY:</b> '+esc(item?.mechanism||'')+'</p></div>'+
  '<div class="infobox"><b>Clinical clue:</b><p>'+esc(item?.signature||'')+'</p><p><b>Do not confuse:</b> '+esc(item?.distinction||'')+'</p></div>'+
  '<p class="small">Score: '+t.correct+' correct after '+(t.idx+1)+' questions.</p>'+
  '<div class="buttonrow"><button data-vpqtoxmatchnext="1">'+(t.idx===t.items.length-1?'See results':'Next toxicant →')+'</button><button data-vpqtoxindex="1">Reference</button></div>');
}
const prevPharmacy=getPharmacy();
setPharmacy(function(...args){
prevPharmacy(...args);
if(!modalBody.querySelector('[data-vpqngf-guide]')||!modalBody.querySelector('[data-vpqtoxindex]')){
 modalBody.insertAdjacentHTML('afterbegin','<div class="vpqPharmCrosslinks"><b>💊 Pharmacy learning paths</b><div class="buttonrow"><button data-vpqngf-guide="1">🧠 NGF analgesia: Librela vs Solensia</button><button data-vpqtoxindex="1">☣️ Toxicant Reference ('+toxCards.length+' cards)</button></div><p class="tiny">Drugs = therapeutics. Toxicants = exposures, mechanism, species and recognition; toxicology practice bank remains Coming Soon.</p></div>');
}
});
modalBody.addEventListener('click',ev=>{
const btn=ev.target.closest('button');if(!btn)return;const d=btn.dataset;
if(d.vpqngfGuide!==undefined)return ngfGuide();
if(d.vpqngfPharm!==undefined)return api.openPharmacy();
if(d.vpqngfDrug!==undefined)return api.openPharmacy(d.vpqngfDrug);
if(d.vpqtoxindex!==undefined)return toxIndex();
if(d.vpqtoxref!==undefined)return toxDetail(d.vpqtoxref);
if(d.vpqtoxcourse!==undefined)return api.toxCourse();
if(d.vpqtoxlecture!==undefined)return api.toxCourse(d.vpqtoxlecture);
if(d.vpqtoxmatchopen!==undefined)return toxMatchStart();
if(d.vpqtoxmatchanswer!==undefined)return toxMatchAnswer(d.vpqtoxmatchanswer);
if(d.vpqtoxmatchnext!==undefined){if(toxMatchRound)toxMatchRound.idx++;return toxMatchShow();}
});
modalBody.addEventListener('input',ev=>{
 if(ev.target.id!=='vpqToxSearch')return;
 const term=ev.target.value.toLowerCase(),cat=modalBody.querySelector('#vpqToxCategory')?.value||'all';
 let count=0;
 modalBody.querySelectorAll('[data-vpqtoxref]').forEach(b=>{const match=(cat==='all'||b.dataset.toxgroup===cat)&&(b.dataset.toxterms||'').includes(term);b.style.display=match?'':'none';if(match)count++});
 const label=modalBody.querySelector('#vpqToxCount');if(label)label.textContent=count+' of '+toxCards.length+' toxicants';
});
modalBody.addEventListener('change',ev=>{if(ev.target.id==='vpqToxCategory')return toxIndex(modalBody.querySelector('#vpqToxSearch')?.value||'',ev.target.value)});
const style=document.createElement('style');style.textContent='.vpqToxMatchAnswers{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:9px;margin:14px 0}.vpqToxMatchAnswers button{text-align:left;line-height:1.5;background:#f6fbff;border:2px solid #b9d4e1;border-radius:10px;padding:14px}.vpqToxIntro{background:#fdf2ea;border:1px solid #ecc7b3;border-radius:12px;padding:12px}.vpqToxIntro p{font-size:12px;margin:5px 0}.vpqToxControls{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px;margin:12px 0}.vpqToxControls label{font-size:12px;font-weight:800}.vpqToxDetailHeading{padding:9px;background:#fff4e8;border-radius:9px}.vpqPharmCrosslinks{background:#f0f8ff;border:1px solid #adcce7;border-radius:12px;padding:12px;margin-bottom:12px}.vpqPharmCrosslinks p{font-size:12px;margin:4px}.vpqNGFClinical{margin:14px 0;padding:15px;background:#f7f1ff;border:2px solid #d5bfea;border-radius:14px;font-size:13px;line-height:1.6}.vpqNGFClinical h3{margin:0 0 8px}.vpqToxReferenceGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:9px;margin:12px 0}.vpqToxReferenceGrid button,.vpqToxReferenceGrid section{padding:12px;border:1px solid #c6d6e8;border-radius:10px;background:#fff;text-align:left}.vpqToxReferenceGrid b,.vpqToxReferenceGrid small{display:block}.vpqToxReferenceGrid small{font-size:12px;margin-top:5px}.vpqToxReferenceGrid h3{margin:0 0 6px;font-size:14px}.vpqToxReferenceGrid p{font-size:13px;margin:0}';document.head.appendChild(style);
return {cards,questions,toxCards,ngfGuide,toxIndex,toxDetail,toxMatchStart};
};