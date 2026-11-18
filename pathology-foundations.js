/* Foundations of Veterinary Pathology: lecture-grounded, original interactive notes.
   Sources: instructor's "1. Intro to Pathology_SV" pp. 5-26 and
   "2. Cell Basics - Normal Cell and Causes of Cell Injury_SV" pp. 2-25.
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
function shell(body,title){
 host?.showModal('📘 Pathology Foundations · '+(title||pages[lesson].title),
 '<div style="font-size:13px;line-height:1.5;max-width:900px">'+
 '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px"><button data-pathfound="home">🏠 Foundations</button><button data-pathfound="intro">Lecture 1</button><button data-pathfound="cells">Lecture 2</button><button data-pathfound="quiz">🧠 Practice</button></div>'+body+'</div>');
}
function home(){
 shell('<div style="padding:13px;background:#f1f7ff;border:1px solid #c5d9f3;border-radius:12px"><h3 style="margin:0 0 8px">🔬 Start with the normal cell, then explain the lesion</h3><p>These are <b>Exam 1 foundations</b>, separate from the Exam 7 atlas. Your professor emphasizes core concepts, clinical implications, and recognizing both gross and microscopic lesions.</p></div>'+
 Object.entries(pages).map(([k,p])=>'<button data-pathfound="'+k+'" style="display:block;text-align:left;width:100%;padding:13px;margin-top:9px"><b>'+esc(p.title)+'</b><small style="display:block">'+esc(p.summary)+'</small><small>'+esc(p.source)+'</small></button>').join('')+
 '<p style="font-size:12px;color:#587087">Original teaching paraphrases from your annotated lecture PDFs. No instructor photographs copied to the public game. The Lecture 9 Morphologic vs Etiologic Diagnosis format remains the reference for formal naming.</p>','Overview');
}
function showLesson(k){
 lesson=k;const p=pages[k];
 shell('<h3>'+esc(p.title)+'</h3><p>'+esc(p.summary)+'</p>'+
 p.sections.map((item,i)=>'<details style="margin:7px 0;border:1px solid #d2e2ef;padding:10px 12px;border-radius:10px" '+(i===0?'open':'')+'><summary><b>'+esc(item[0])+'</b></summary><p>'+esc(item[1])+'</p></details>').join('')+
 '<p style="font-size:12px;color:#5b7488">Source: '+esc(p.source)+'. Text is paraphrased for studying; slides may include annotated examples and images not reproduced here.</p>'+
 '<button data-pathfound="quiz">🧠 Check understanding</button>',p.title);
}
function practice(){
 const pool=questions.filter(q=>q[0]===lesson);
 if(qindex>=pool.length){shell('<h3>✅ Finished this lecture’s practice</h3><p>Review the explanation for each answer, then return to the other lecture.</p><button data-pathfound="reset">Retry</button>','Practice complete');return}
 const q=pool[qindex];
 shell('<small>'+esc(pages[lesson].title)+' · Question '+(qindex+1)+' of '+pool.length+'</small><h3>'+esc(q[1])+'</h3>'+
 q[2].map((opt,i)=>'<button data-pathfoundchoice="'+i+'" '+(revealed?'disabled':'')+' style="display:block;text-align:left;width:100%;margin:7px 0;padding:11px;border-color:'+(choice===i?'#7d98c9':'#d7e2f0')+';background:'+(choice===i?'#e5f0ff':'white')+'">'+esc(opt)+'</button>').join('')+
 (revealed?'<div style="background:#eef8f1;border:1px solid #bcdac8;border-radius:10px;padding:12px"><b>'+(choice===q[3]?'✓ Correct':'Review the reasoning')+'</b><p>'+esc(q[4])+'</p><small>'+esc(q[5])+'</small></div><button data-pathfound="next">Next →</button>':'<p style="color:#61768b">Select an answer to see the reasoning.</p>')+
 '<button data-pathfound="home" style="margin-left:6px">Exit practice</button>','Practice');
}
function init(api){
 if(host)return;host=api;
 api.body.addEventListener('click',e=>{
  const b=e.target.closest('[data-pathfound],[data-pathfoundchoice]');
  if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(b.dataset.pathfoundchoice!==undefined&&!revealed){choice=Number(b.dataset.pathfoundchoice);revealed=true;practice();return}
  const act=b.dataset.pathfound;
  if(act==='home')return home();
  if(act==='intro'||act==='cells')return showLesson(act);
  if(act==='quiz'||act==='reset'){qindex=0;revealed=false;choice=null;return practice()}
  if(act==='next'){qindex++;revealed=false;choice=null;return practice()}
 },true);
}
return {init,open:home};
})();
