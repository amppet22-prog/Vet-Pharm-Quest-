/* Foundations of Veterinary Pathology: lecture-grounded, original interactive notes.
   Sources: instructor's "1. Intro to Pathology_SV" pp. 5-26 and
   "2. Cell Basics - Normal Cell and Causes of Cell Injury_SV" pp. 2-25.
   Extended with instructor Lectures 3 (cell injury) and 4 (postmortem changes).
   Images in the original slides are NOT copied into this public repository. */
window.VPQ_PATH_FOUNDATIONS=(function(){
'use strict';
let host=null,lesson='intro',qindex=0,revealed=false,choice=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pages={
 intro:{
 title:'1 · Introduction to Anatomic Pathology',
 source:'Instructor Lecture 1 · slides 5–26',
 summary:'Begin with normal anatomy. Describe the observed lesion without guessing its cause; then interpret the lesion, ask why it developed, and choose diagnostic tests.',
 sections:[
 ['What pathologists do','Veterinary pathology studies animal disease, etiology (cause) and pathogenesis (how and why disease develops). Anatomic pathology examines tissue and organ changes; clinical pathology uses laboratory specimens.'],
 ['The diagnostic sequence','Normal vs abnormal → objective gross description / histologic description → morphologic diagnosis → etiologic interpretation → pathogenesis. Ancillary tests can help confirm a cause. A disease label must not replace a lesion description.'],
 ['Describe first','Record the actual organ and location, distribution, color, size, shape, surface, texture, contents and relationships. The slide example describes thickened intestinal loops, red foci, fibrillar yellow material and abnormal abdominal fluid rather than simply naming a disease.'],
 ['Interpret second','Morphologic DX: organ, process and justified modifiers/distribution; time course and severity only if findings support them. Etiologic DX: suspected underlying cause. Pathogenesis: sequence of tissue injury explaining the gross and histologic appearance.'],
 ['Sampling for histopathology','Fix appropriately sized representative pieces in formalin; instructor slide recommends a tissue dimension ≤1 cm for penetration and tissue:formalin ratio 1:10. Avoid overhandling and mark orientation when relevant.'],
 ['Sampling for culture and other testing','Collect fresh tissue separately and cleanly, avoiding contamination; sample clean sites before opening gut. Formalin-fixed tissue is for histology, not routine culture. Select tests based on likely mechanisms and differentials.'],
 ['Where to sample','Bronchopneumonia: sample the interface between affected and apparently normal lung and representative diseased tissue. Interstitial disease: sample multiple regions/lobes. Focal or multifocal lesions: include abnormal tissue, normal tissue and their junction. Diffuse lesions: sample representative sites.'],
 ['Submissions and H&E','Include history and differentials; label patient/client, tissue and site. Do not ship cytology and biopsy together in a way that risks formalin exposure. Hematoxylin stains basophilic structures purple-blue, while eosin stains many proteins pink-red.']
 ]},
 cells:{
 title:'2 · Normal Cell and Causes of Cell Injury',
 source:'Instructor Lecture 2 · slides 2–25',
 summary:'Learn normal organelle functions, the mechanisms of injury, hypoxia versus ischemia, reperfusion injury and reversible cell swelling.',
 sections:[
 ['Cell architecture','Euchromatin is loosely packed and transcriptionally active; heterochromatin is condensed and relatively inactive. Nucleolus supports rRNA production/ribosome assembly. RER makes proteins; SER participates in lipid/drug metabolism; Golgi modifies, sorts and packages proteins.'],
 ['Other organelles','Mitochondria produce ATP by oxidative phosphorylation and participate in apoptosis. Lysosomes contain hydrolytic enzymes for intracellular digestion. Microfilaments support cell movement; intermediate filaments provide strength; microtubules move vesicles and form the mitotic spindle.'],
 ['Four primary injury mechanisms','ATP depletion, membrane permeabilization/damage, DNA damage, and disrupted biochemical pathways including protein synthesis. Important: functional impairment can precede gross or microscopic changes.'],
 ['Major cause: hypoxia','The lecturer emphasizes inadequate oxygen supply/utilization as a major cause of injury. Examples: impaired oxygenation due to cardiopulmonary failure, loss of perfusion, anemia/CO poisoning, severe hemorrhage and inhibition of respiratory enzymes (e.g. cyanide).'],
 ['Hypoxia ≠ ischemia','Hypoxia is oxygen deficiency; anaerobic glycolysis can temporarily continue if substrates arrive. Ischemia is loss of blood flow: oxygen and nutrients fall, waste removal fails and ATP is depleted more quickly. A strangulating mesenteric lipoma in a horse illustrates compromised perfusion.'],
 ['ATP loss → cell swelling','Low oxidative ATP impairs ion gradients. Intracellular sodium and water accumulate, causing acute cell swelling. Organ swelling/pallor can occur; histology shows pale or vacuolated cytoplasm. This may be reversible until injury exceeds the point of no return.'],
 ['Three location-specific terms','Hydropic degeneration: acute swelling in many parenchymal cells. Ballooning degeneration: striking swelling of keratinocytes. Cytotoxic edema: intracellular swelling of neural cells such as astrocytes. These describe appearance/context, not three unrelated causes.'],
 ['Ischemia–reperfusion injury','Reintroducing flow can paradoxically worsen injury through reactive oxygen species, inflammatory cell recruitment, complement activation and intracellular Ca²⁺ overload with mitochondrial damage. Lecture examples: GDV, stroke, myocardial infarction.'],
 ['Free radical defense','Oxidants can injure membranes, proteins and DNA. The instructor lists superoxide dismutase, glutathione peroxidase, ceruloplasmin, ferritin, and vitamins A/C/E as defenses/scavengers.'],
 ['Reversible versus irreversible','A cell may recover or adapt if injury stops before irreversible mitochondrial and membrane dysfunction; otherwise it progresses toward cell death. Histologic labels alone must be interpreted with the lesion and timing.']
 ]}
};

pages.injury={
 title:'3 · Cellular Injury: Responses to Injury',
 source:'Instructor Lecture 3 · slides 2–31 (annotated)',
 summary:'Progress from cell stress and adaptation to reversible swelling, irreversible mitochondrial and membrane injury, nuclear changes, and the ATP/Ca²⁺/ROS pathways.',
 sections:[
 ['Adaptation versus injury','Nonlethal stress can produce adaptation and a new steady state. If injury exceeds the cell’s ability to maintain homeostasis, cell function becomes impaired. The response depends on the cell type, severity/duration of insult, and metabolic condition at onset.'],
 ['Why the timing matters','Cells can lose function before any visible lesion is present. The lecture notes that light microscopic changes after an ischemic event may become apparent only hours later (approximately 4–12 hours); this is not a universal diagnostic clock.'],
 ['Reversible cellular swelling','Failure of ATP-dependent Na⁺/K⁺ transport and other membrane injury promote Na⁺/water accumulation. Grossly affected organs may be enlarged, pale, heavy and wet. Microscopically, cells are rounded with pale or vacuolated cytoplasm (hydropic degeneration).'],
 ['When injury becomes irreversible','Severe/persistent insult causes failure to restore mitochondrial function and maintain plasma membranes. Important changes include mitochondrial swelling/densities, increased membrane permeability, myelin figures and nuclear deterioration. Neurons, cardiomyocytes and renal tubular epithelium are particularly hypoxia-sensitive compared with fibroblasts, adipocytes and osteocytes.'],
 ['Nuclear changes in cell death','Pyknosis = nuclear shrinkage and chromatin condensation. Karyorrhexis = fragmentation of the nucleus. Karyolysis = fading/dissolution of nuclear chromatin. Their presence supports irreversible injury, considered with other tissue changes.'],
 ['Necrosis and leakage','Damaged membranes allow enzyme release (e.g., ALT, GGT or CK/CPK depending on tissue). Cytoplasmic myelin figures are derived from damaged cellular membranes. Enzyme leakage signals cell injury but cannot by itself identify the precise etiology.'],
 ['Four broad insult types','The annotated lecture emphasizes hypoxia; reactive free-radical injury; chemical/traumatic damage; and infectious agents. Many different insults converge on common cellular mechanisms.'],
 ['ATP production and depletion','Aerobic oxidative phosphorylation in mitochondria is the main mammalian ATP source; anaerobic glycolysis is a limited alternative and generates lactate. The brain is especially vulnerable to anoxia; muscle has greater glycolytic capacity. Loss of ATP disables ion pumps and promotes swelling and loss of homeostasis.'],
 ['Mitochondrial injury','ROS, hypoxia and excess cytosolic Ca²⁺ can damage mitochondria. Opening mitochondrial permeability transition pores reduces membrane potential and ATP synthesis, favoring necrosis. Release of cytochrome c can initiate apoptotic signaling.'],
 ['Calcium homeostasis','Cytosolic calcium is normally very low. During ischemia or toxicosis it rises from organelle stores and then extracellular influx. Elevated Ca²⁺ activates phospholipases, proteases, endonucleases and ATPases, worsening membrane, cytoskeletal and DNA injury; it can also trigger apoptosis.'],
 ['Oxidative stress and defenses','Reactive oxygen species can cause lipid peroxidation, protein alteration and DNA fragmentation. Defenses listed in the lecture include superoxide dismutase, catalase, glutathione peroxidase, antioxidants such as vitamins A/C/E and glutathione, plus iron-binding proteins that limit ROS formation.'],
 ['Three major membrane sites','Mitochondrial damage impairs ATP generation and can release apoptotic factors; plasma membrane damage disrupts ion/solute balance and leaks cellular contents; lysosomal membrane damage allows acid hydrolases into cytoplasm and promotes autolytic digestion.'],
 ['Protein folding and DNA damage','Cells can repair some DNA injury. When DNA damage or misfolded-protein stress is excessive, programmed cell death (apoptosis) can be triggered. Distinguish the insult, biochemical mechanism and final morphologic response.']
 ]};
pages.postmortem={
 title:'4 · Postmortem Changes and Non-lesions',
 source:'Instructor Lecture 4 · slides 2–27 (annotated)',
 summary:'Distinguish postmortem artifacts from true antemortem disease: autolysis versus necrosis, rigor/livor/algor mortis, imbibition, clots, putrefaction, and misleading gross patterns.',
 sections:[
 ['First question: lesion or artifact?','Postmortem changes are not disease processes and should not automatically receive an antemortem morphologic diagnosis. Autolysis and putrefaction can obscure genuine lesions. Description must distinguish observed change from a suspected cause of death.'],
 ['What determines decomposition?','The lecture lists tissue type, animal, cause of death, ambient and body temperatures, and microbial flora. Rates vary, so a single postmortem change is not an exact clock.'],
 ['Autolysis versus putrefaction','Autolysis is enzymatic self-digestion after cell death. Putrefaction involves microbial breakdown of tissues, producing gases, liquids and smaller molecules. These can overlap.'],
 ['Autolysis versus necrosis','Autolysis follows death and classically lacks an active vital inflammatory response; necrosis is cellular death occurring in living tissue and may elicit inflammation. Exception: severe peracute injury can have little inflammation, so timing and context matter. Autolysis may be diffuse and obscure pre-existing focal lesions.'],
 ['Histologic artifacts','Loss of normal cell boundaries and architecture, indistinct nuclear detail and numerous saprophytic bacteria can suggest autolysis. Do not diagnose a bacterial lesion solely because bacteria are present in decomposing tissue.'],
 ['Stages of decomposition','The instructor sequences fresh → putrefaction/bloat → active decomposition → advanced decay → skeletonization. Time to each stage is highly environment-dependent.'],
 ['Rigor mortis','Postmortem muscle stiffening: declining ATP prevents disengagement of actin and myosin after Ca²⁺ release from degenerating sarcoplasmic reticulum. The annotated lecture gives a broad 2–36-hour window; do not use it as a precise time of death.'],
 ['Livor mortis','Gravitational blood pooling produces dependent purple-red discoloration after death. The lecture describes onset around 30 minutes to 2 hours and later fixation through hemoglobin leakage. Contrast with true hemorrhage and congestion using distribution and tissue changes.'],
 ['Algor mortis','Body cooling toward ambient temperature. Fur, initial temperature, size and environment change cooling and autolysis rates; exterior tissue cools sooner than the center.'],
 ['Hemoglobin versus bile imbibition','Hemoglobin imbibition causes red-pink staining by hemoglobin released after death. Bile imbibition causes yellow-green staining near biliary structures. Neither alone demonstrates antemortem hemorrhage, inflammation or jaundice.'],
 ['Pseudomelanosis versus physiologic melanosis','Postmortem bacterial hydrogen sulfide can react with hemoglobin iron to form dark iron sulfide, producing pseudomelanosis. Physiologic melanosis is genuine melanin pigment and may be normal in dark-pigmented animals.'],
 ['Postmortem cruor versus antemortem thrombus','Postmortem clots are typically smooth/shiny and easy to remove, sometimes layered into red and yellow (“chicken fat”) components. Antemortem thrombi are typically rough/irregular, often more firmly attached and associated with vessel pathology. The gross appearance alone may be equivocal.'],
 ['Other artifacts and forensic interpretation','The lecture also lists marbling, mummification, adipocere, ocular changes, insect activity, scavenging and pink teeth. Context can inform interpretation, but these are not reliable standalone estimates of postmortem interval or proof of cause of death.'],
 ['Use the professor’s practice sequence','Slides 18–27 challenge the learner to decide whether discoloration, clots and tissue changes are antemortem disease or postmortem artifacts. First describe what you see; then identify what supports antemortem change, and what might instead be due to decomposition.']
 ]};

const questions=[
 ['intro','A necropsy specimen shows thickened, dark-red small intestine with fibrillar yellow strands on the serosa. Which is the best FIRST note?',['Diffuse thickening and multifocal red foci with yellow fibrillar serosal material','Fibrinous enteritis due to one specific bacterium','Septicemia from bacterial toxin'],0,'A gross description reports observable characteristics before morphologic interpretation or etiologic assignment.','Lecture 1 · pp. 13–15'],
 ['intro','What is etiology?',['How blood cells reach lesions','The cause of disease','The gross appearance alone'],1,'Etiology identifies cause; pathogenesis explains the sequence of events that produces the lesion.','Lecture 1 · p. 8'],
 ['intro','Which chain best follows the lecturer’s diagnostic logic?',['Name pathogen → describe lesion → ignore testing','Describe → morphologic diagnosis → etiologic assessment and testing','Grade severity → select antibiotic → photograph'],1,'Start with observed findings; use morphology to characterize the process, then evaluate suspected causes using ancillary data.','Lecture 1 · pp. 13–15, 25–26'],
 ['intro','A focal abscess is submitted for histopathology. Which sample is most representative?',['Only visually unaffected tissue','Abnormal center and transition to adjacent tissue','A random distant lobe'],1,'Sample diseased tissue plus the interface with normal tissue, where lesion architecture and progression can be recognized.','Lecture 1 · pp. 18–20'],
 ['intro','Which sample is most suitable for bacterial culture?',['Fresh aseptically collected tissue separate from formalin','Tissue fixed in formalin','An unlabeled, exposed tissue sample'],0,'The lecturer separates fresh tissue for culture/ancillary testing from formalin-fixed tissue for histopathology.','Lecture 1 · p. 16'],
 ['intro','Which statement is correct about the professor’s fixed-tissue guidance?',['10 parts tissue to 1 part formalin','A representative piece ≤1 cm in one dimension and 1 part tissue to 10 parts formalin','Large uncut organs guarantee rapid formalin penetration'],1,'The lecture gives the 1:10 tissue:formalin recommendation and emphasizes thin tissue for penetration.','Lecture 1 · p. 16'],
 ['intro','A diffuse interstitial pulmonary process is suspected. Best biopsy distribution?',['One small focus in a single lung lobe only','Representative sections from several lung lobes and regions','Only bronchioles that look most red'],1,'Diffuse/interstitial lung disease requires representative sampling across regions, unlike a single focal process.','Lecture 1 · pp. 17–20'],
 ['cells','What are the four broad injury mechanisms highlighted by the lecture?',['ATP loss, membrane damage, DNA injury, biochemical/protein-synthesis disruption','Fever, vomiting, anemia, diarrhea','Fibrosis, granulomas, metastasis, edema'],0,'This grouping explains many later morphologic changes, even if functional injury precedes visible lesions.','Lecture 2 · p. 12'],
 ['cells','Why is ischemia often more damaging than hypoxia alone?',['It increases nutrient availability','It blocks oxygen and substrate delivery and limits waste removal','It always produces adequate ATP'],1,'Both aerobic and anaerobic energy generation become compromised under lost perfusion.','Lecture 2 · pp. 14–17'],
 ['cells','A strangulating mesenteric lipoma in a horse most directly produces what cellular insult?',['Reduced perfusion / ischemia','Isolated increased oxygen transport','Primary inherited hypoplasia'],0,'The strangulation disrupts vascular perfusion; this is the lecture’s equine example.','Lecture 2 · p. 17'],
 ['cells','ATP is lost and Na⁺ gradients fail. What is the earliest relevant morphologic response?',['Acute cellular swelling due to intracellular water accumulation','Immediate collagen scar formation','Primary metastatic neoplasia'],0,'Ion-pump failure causes sodium and water retention, producing acute swelling that can be reversible.','Lecture 2 · pp. 20–24'],
 ['cells','Severe swelling of epidermal keratinocytes is called:',['Ballooning degeneration','Hydrocephalus','Chronic fibrosis'],0,'The lecture reserves ballooning degeneration for keratinocytes; hydropic degeneration commonly describes parenchymal swelling.','Lecture 2 · p. 23'],
 ['cells','Swelling of astrocytes from intracellular water accumulation is:',['Cytotoxic edema','Only extracellular vasogenic edema','Fibrinous inflammation'],0,'Cytotoxic edema is a cell-swelling process in neural tissue, relevant when revisiting CNS lectures.','Lecture 2 · p. 23'],
 ['cells','Following successful reperfusion, additional injury may result from:',['Reactive oxygen species, inflammation, complement and Ca²⁺ overload','Only enhanced anaerobic glycolysis','No changes once blood returns'],0,'Restoration of perfusion can generate oxidative and inflammatory injury.','Lecture 2 · p. 18'],
 ['cells','Which enzyme is listed as a free radical scavenger?',['Superoxide dismutase','Telomerase','DNA polymerase'],0,'Superoxide dismutase is on the instructor’s free-radical defense list.','Lecture 2 · p. 19'],
 ['cells','Which cell component is associated with ATP production and apoptosis?',['Mitochondria','Golgi only','Keratin intermediate filament'],0,'Mitochondria produce ATP and participate in apoptotic signaling.','Lecture 2 · p. 8']
];

questions.push(
 ['injury','A dog has renal tubular epithelial cells with pale, vacuolated, swollen cytoplasm after transient hypoperfusion. Which mechanism best explains this reversible pattern?',['ATP loss impairs Na⁺/K⁺ pumps, accumulating intracellular Na⁺ and water','Immediate collagen production from fibroblasts','Increased ATP causing rapid sodium extrusion'],0,'Hydropic swelling follows disturbed ion transport and water balance, often before irreversible cell death.','Lecture 3 · pp. 8–10'],
 ['injury','A cell has stopped functioning after severe ischemia, but a section initially appears nearly normal. What principle does this illustrate?',['Functional impairment can precede visible histologic changes','Gross change necessarily appears before loss of function','No microscopic changes can ever develop'],0,'The lecturer stresses a time lag between functional injury and demonstrable light microscopic lesions.','Lecture 3 · p. 7'],
 ['injury','Which nucleus is shrunken with condensed chromatin?',['Karyolysis','Pyknosis','Karyorrhexis'],1,'Pyknosis = condensation/shrinkage; karyorrhexis = fragmentation; karyolysis = dissolution/fading.','Lecture 3 · pp. 14–15'],
 ['injury','Which cell type is among the most vulnerable to oxygen deprivation?',['Neuron','Adipocyte','Fibroblast'],0,'Neurons are among the relatively hypoxia-sensitive tissues noted by the lecturer, along with cardiomyocytes and renal tubules.','Lecture 3 · p. 11'],
 ['injury','During ischemia, cytosolic Ca²⁺ increases. Which combination of processes can worsen damage?',['Activation of phospholipases and proteases, with mitochondrial injury','Complete inactivation of all destructive enzymes','Permanent stabilization of plasma membranes'],0,'Ca²⁺ overload stimulates multiple enzymes and can open mitochondrial permeability transition pores.','Lecture 3 · pp. 23–24'],
 ['injury','Mitochondrial injury can cause both necrosis and apoptosis. Which paired mechanisms best explain this?',['ATP loss and cytochrome c release','Only glycogen deposition and pigment formation','Enhanced normal respiration and ATP excess'],0,'Loss of mitochondrial membrane potential limits ATP synthesis; released apoptotic factors favor programmed cell death.','Lecture 3 · p. 22'],
 ['injury','What are the three major molecular targets of excess reactive oxygen species?',['Lipids, proteins and DNA','Calcium alone, glucose alone and water alone','Only the cell wall'],0,'The annotated lecture lists membrane lipid peroxidation, protein alteration and DNA fragmentation.','Lecture 3 · pp. 25–27'],
 ['injury','Which is an enzymatic defense against oxidative damage?',['Superoxide dismutase','Sodium channel','Myosin'],0,'Superoxide dismutase converts superoxide to hydrogen peroxide, which catalase/glutathione peroxidase can break down.','Lecture 3 · p. 27'],
 ['injury','When lysosomal membranes rupture, what is a likely consequence?',['Hydrolytic enzymes escape and digest cellular components','ATP synthesis becomes guaranteed','Histologic architecture always remains intact'],0,'Lysosomal acid hydrolases can promote intracellular digestion once compartment integrity is lost.','Lecture 3 · p. 30'],
 ['injury','Why should elevated serum ALT or CK after injury not be treated as an etiologic diagnosis?',['They support tissue damage/enzyme leakage but not the initiating cause','They prove a particular infectious agent','They uniquely date the lesion to the hour'],0,'Enzyme leakage can follow membrane damage, but additional context/testing is needed to identify a cause.','Lecture 3 · p. 13'],
 ['postmortem','An autolyzed tissue section contains many bacteria but no organized vital inflammatory response. What is the safest interpretation?',['Postmortem bacterial overgrowth may be present; disease is not established by bacteria alone','Always septicemia before death','Necrosis with a confirmed bacterial agent'],0,'Saprophytic organisms and disrupted tissue architecture can occur postmortem; examine distribution and other evidence.','Lecture 4 · pp. 5–8'],
 ['postmortem','Why can rigor mortis develop following death?',['ATP depletion prevents actin–myosin detachment after Ca²⁺ release','ATP rises and actively locks the sarcomeres','Liver pigments turn skeletal muscle black'],0,'Loss of ATP prevents normal muscle relaxation while calcium permits cross-bridge formation.','Lecture 4 · p. 11'],
 ['postmortem','Purple discoloration is concentrated on the dependent side of a carcass. Which postmortem artifact is most plausible?',['Livor mortis','Bile imbibition','Pseudomelanosis'],0,'Livor mortis is gravitational pooling of blood and can be confused with true vascular lesions.','Lecture 4 · p. 12'],
 ['postmortem','Yellow-green discoloration is confined near the gallbladder and adjacent tissue. What should be considered first?',['Bile imbibition','Metastatic melanoma','Diffuse acute hemorrhage'],0,'Bile can stain adjacent tissues after death, without indicating antemortem inflammation.','Lecture 4 · p. 14'],
 ['postmortem','A dark green-black area forms where bacterial breakdown products react with hemoglobin iron. This is:',['Pseudomelanosis','Physiologic melanosis','A definitive diagnosis of melanoma'],0,'Postmortem bacterial hydrogen sulfide can generate iron sulfide, producing pseudomelanosis.','Lecture 4 · p. 15'],
 ['postmortem','A red-yellow clot is smooth and slippery, separates easily from the vessel, and has a layered component. Best classification?',['Consistent with postmortem cruor / chicken-fat clot','Definitely antemortem thrombus','Always a neoplastic embolus'],0,'Smooth shiny separable clots commonly form after death; interpret with the vessel and gross context.','Lecture 4 · pp. 16–17'],
 ['postmortem','Which feature most supports an antemortem thrombus over a postmortem clot?',['Rough, irregular surface and substantial vessel adherence','Smooth and glossy surface with easy separation','Distinct red-yellow layering alone'],0,'Antemortem thrombosis is often more adherent and irregular, though not every clot can be assigned from gross appearance alone.','Lecture 4 · p. 17'],
 ['postmortem','Why is it inappropriate to label every necropsy discoloration a disease lesion?',['Postmortem imbibition, lividity and putrefaction can create changes without an antemortem disease process','All discoloration is caused by infection','All changes after death prove prior inflammation'],0,'Descriptions must separate postmortem artifacts from lesions and avoid unsupported etiology.','Lecture 4 · pp. 3, 7, 14–15'],
 ['postmortem','A carcass has extensive decomposition. Can a single sign reliably determine the exact time of death?',['No; many environmental and tissue factors influence the rate','Yes, lividity always establishes an exact hour','Yes, the first appearance of marbling fixes the interval'],0,'Body condition, temperature, microbial flora and tissue type change decomposition rates; avoid false precision.','Lecture 4 · pp. 3, 9–13'],
 ['postmortem','What is the most useful distinction between autolysis and necrosis?',['Autolysis occurs after organismal death, whereas necrosis occurs in living tissue','Both require a specific bacterium','Autolysis always has strong vital inflammation'],0,'Autolysis is postmortem self-digestion; necrosis is cell death in living tissue and may trigger inflammation, though peracute lesions may lack it.','Lecture 4 · pp. 4–5']
);

function shell(body,title){
 host?.showModal('📘 Pathology Foundations · '+(title||pages[lesson].title),
 '<div style="font-size:13px;line-height:1.5;max-width:900px">'+
 '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px"><button data-pathfound="home">🏠 Foundations</button><button data-pathfound="intro">Lecture 1</button><button data-pathfound="cells">Lecture 2</button><button data-pathfound="injury">Lecture 3</button><button data-pathfound="postmortem">Lecture 4</button><button data-pathfound="death">Lecture 5</button><button data-pathfound="growth">Lecture 6</button><button data-pathfound="metaplasia">Lecture 7</button><button data-pathfound="accumulations">Accumulations</button><button data-pathfound="quiz">🧠 Practice</button></div>'+body+'</div>');
}
function home(){
 shell('<div style="padding:13px;background:#f1f7ff;border:1px solid #c5d9f3;border-radius:12px"><h3 style="margin:0 0 8px">🔬 Start with the normal cell, then explain the lesion</h3><p>These are <b>General pathology foundations (Lectures 1–7 and Accumulations)</b>, separate from the Exam 7 atlas. Your professor emphasizes core concepts, clinical implications, and recognizing both gross and microscopic lesions.</p></div>'+
 Object.entries(pages).map(([k,p])=>'<button data-pathfound="'+k+'" style="display:block;text-align:left;width:100%;padding:13px;margin-top:9px"><b>'+esc(p.title)+'</b><small style="display:block">'+esc(p.summary)+'</small><small>'+esc(p.source)+'</small></button>').join('')+
 '<button data-pathfound-visual="9" style="display:block;width:100%;text-align:left;margin-top:9px;padding:12px;background:#fff9e9;border:1px solid #e1cfa2"><b>🧠 Morphologic vs Etiologic Diagnosis · Visual recognition practice (uploaded file 9)</b><small style="display:block">Describe → name lesion process → supported cause; lecture 9 methodology cards</small></button>'+ 
 '<p style="font-size:12px;color:#587087">Original teaching paraphrases from your annotated lecture PDFs. No instructor photographs copied to the public game. The Lecture 9 Morphologic vs Etiologic Diagnosis format remains the reference for formal naming.</p>','Overview');
}
function showLesson(k){
 lesson=k;const p=pages[k];
 shell('<h3>'+esc(p.title)+'</h3><p>'+esc(p.summary)+'</p>'+
 p.sections.map((item,i)=>'<details style="margin:7px 0;border:1px solid #d2e2ef;padding:10px 12px;border-radius:10px" '+(i===0?'open':'')+'><summary><b>'+esc(item[0])+'</b></summary><p>'+esc(item[1])+'</p></details>').join('')+
 '<p style="font-size:12px;color:#5b7488">Source: '+esc(p.source)+'. Text is paraphrased for studying; slides may include annotated examples and images not reproduced here.</p>'+
 ( ({death:'5',growth:'6',metaplasia:'7',accumulations:'8'})[k]?'<button data-pathfound-visual="'+({death:'5',growth:'6',metaplasia:'7',accumulations:'8'})[k]+'" style="margin:7px 5px 7px 0;background:#eaf2ff;border:1px solid #9cb9db;font-weight:700">🔬 Open this lecture’s visual reference cards</button>':'')+'<button data-pathfound="quiz">🧠 Check understanding</button>',p.title);
}
function practice(){
 const pool=questions.filter(q=>q[0]===lesson);
 if(qindex>=pool.length){shell('<h3>✅ Finished this lecture’s practice</h3><p>Review the explanation for each answer, then choose another lecture.</p><button data-pathfound="reset">Retry</button>','Practice complete');return}
 const q=pool[qindex];
 shell('<small>'+esc(pages[lesson].title)+' · Question '+(qindex+1)+' of '+pool.length+'</small><h3>'+esc(q[1])+'</h3>'+
 q[2].map((opt,i)=>'<button data-pathfoundchoice="'+i+'" '+(revealed?'disabled':'')+' style="display:block;text-align:left;width:100%;margin:7px 0;padding:11px;border-color:'+(choice===i?'#7d98c9':'#d7e2f0')+';background:'+(choice===i?'#e5f0ff':'white')+'">'+esc(opt)+'</button>').join('')+
 (revealed?'<div style="background:#eef8f1;border:1px solid #bcdac8;border-radius:10px;padding:12px"><b>'+(choice===q[3]?'✓ Correct':'Review the reasoning')+'</b><p>'+esc(q[4])+'</p><small>'+esc(q[5])+'</small></div><button data-pathfound="next">Next →</button>':'<p style="color:#61768b">Select an answer to see the reasoning.</p>')+
 '<button data-pathfound="home" style="margin-left:6px">Exit practice</button>','Practice');
}
function init(api){
 if(host)return;host=api;
 api.body.addEventListener('click',e=>{
  if(e.target.closest('[data-pathfound-visual]')){e.preventDefault();e.stopImmediatePropagation();window.VPQ_PATH_EXAM7?.studyLecture?.(e.target.closest('[data-pathfound-visual]').dataset.pathfoundVisual);return}
  const b=e.target.closest('[data-pathfound],[data-pathfoundchoice]');
  if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(b.dataset.pathfoundchoice!==undefined&&!revealed){choice=Number(b.dataset.pathfoundchoice);revealed=true;practice();return}
  const act=b.dataset.pathfound;
  if(act==='home')return home();
  if(pages[act]){qindex=0;revealed=false;choice=null;return showLesson(act)}
  if(act==='quiz'||act==='reset'){qindex=0;revealed=false;choice=null;return practice()}
  if(act==='next'){qindex++;revealed=false;choice=null;return practice()}
 },true);
}
return {init,open:home,extend:(extra)=>{if(extra?.pages)Object.assign(pages,extra.pages);if(Array.isArray(extra?.questions))questions.push(...extra.questions)}};
})();
