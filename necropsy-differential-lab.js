/* Necropsy Differential Diagnosis Center: use gross lesions, signalment and histology to rank etiologies. */
window.VPQ_NECROPSY_DIFFERENTIAL_LAB=(function(){
'use strict';
const data=window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[];
function allCases(){return [...data,...(window.VPQ_NECROPSY_OWNER_PUBLISH?.getCustomCases?.()||[])].filter(x=>x.sourceType!=='SBA')}
const KEY='vpq-necropsy-differential-local-images-v1';
let morphDraft='',extraAnswer=-1,extraOpen=false,ui=null,filter='all',roundsOnly=false,current=null,phase=0,leading=-1,grossLeading=-1,leadHint=false,shortlist=[],showWhy=false,caseReward=null,shuffledIds=[],optionOrder=[];
const rich=v=>window.VPQ_PATH_RICH_TEXT?.render?.(v)||safe(v);
const safe=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function photoStore(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function updatePhoto(id,image){const state=photoStore();if(image)state[id]=image;else delete state[id];try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){return false}}
function modal(title,body){ui?.showModal(title,body)}
function start(api,chosen='all'){
 ui=api;filter=chosen==='all'?conditionLecture:String(chosen);if(chosen!=='all')conditionLecture=String(chosen);caseExam=groupForLecture(conditionLecture)?.id||'7';roundsOnly=false;practiceMode='all';menu();
 const owner=window.VPQ_NECROPSY_OWNER_PUBLISH;
 owner?.load?.().then(()=>{
  if(ui===api&&ui.body.querySelector('[data-pathdiff-filter]')&&!ui.body.querySelector('[data-necro-create-submit]'))menu();
 }).catch(()=>{});
}
function shuffleArray(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function caseSequence(){
 const filtered=allCases().filter(x=>(!roundsOnly||!!x.sourceCaseId)&&caseInExam(x)&&(practiceMode==='all'||practiceMode==='DDx'&&x.sourceType!=='SBA'||practiceMode==='clinical'&&!x.sourceType)&&(filter==='all'||x.lecture===filter));
 // Start in a randomized order, rather than showing cases in source/best-first order.
 // Keep that order stable while reviewing an individual session.
 const ids=filtered.map(x=>x.id),existing=new Set(shuffledIds);
 if(!shuffledIds.length)shuffledIds=shuffleArray(ids);
 else if(ids.some(id=>!existing.has(id)))shuffledIds=[...shuffledIds,...shuffleArray(ids.filter(id=>!existing.has(id)))];
 const order=new Map(shuffledIds.map((id,i)=>[id,i]));
 return filtered.sort((a,b)=>(order.get(a.id)??Infinity)-(order.get(b.id)??Infinity));
}
function shuffleCases(){shuffledIds=shuffleArray(allCases().filter(x=>(!roundsOnly||!!x.sourceCaseId)&&caseInExam(x)&&(filter==='all'||x.lecture===filter)).map(x=>x.id));current=null;phase=0;leading=-1;grossLeading=-1;shortlist=[];leadHint=false;caseReward=null;optionOrder=[];return menu();}
function prepareCase(id){current=id;morphDraft='';extraAnswer=-1;extraOpen=false;extraAnswer=-1;extraOpen=false;phase=0;leading=-1;grossLeading=-1;leadHint=false;shortlist=[];caseReward=null;const found=allCases().find(x=>x.id===id);optionOrder=shuffleArray((found?.options||[]).map((_,i)=>i));return view();}
function signalment(x){
 const pieces=[x.age,x.breed,x.speciesName,x.sex,x.reproductiveStatus].filter(v=>String(v||'').trim()).map(v=>String(v).trim());
 return pieces.length?pieces.join(' · '):String(x.species||'Signalment not supplied').replace(/\s+/g,' ').trim();
}
function menu(){
 const group=EXAM_GROUPS.find(g=>g.id===(groupForLecture(conditionLecture)?.id||'7'))||EXAM_GROUPS[6];
 const lectures=Array.from({length:group.end-group.start+1},(_,i)=>String(group.start+i));
 const count=n=>allCases().filter(x=>String(x.lecture)===String(n)).length;
 const matched=caseSequence();
 modal('🧩 Pathology · Study & Cases',
 '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 10px">'+
 '<label style="font-size:12px;font-weight:800">Exam<select data-pathdiff-menu-exam="1" style="display:block;width:100%;padding:9px;margin-top:4px;border-radius:8px;background:white">'+EXAM_GROUPS.map(g=>'<option value="'+g.id+'"'+(group.id===g.id?' selected':'')+'>'+safe(g.label)+'</option>').join('')+'</select></label>'+
 '<label style="font-size:12px;font-weight:800">Lecture<select data-pathdiff-menu-lecture="1" style="display:block;width:100%;padding:9px;margin-top:4px;border-radius:8px;background:white">'+lectures.map(n=>'<option value="'+n+'"'+(conditionLecture===n?' selected':'')+'>L'+n+' · '+count(n)+' cases</option>').join('')+'</select></label></div>'+
 '<div style="padding:10px;border:1px solid #c8d8e8;border-radius:10px;background:#f5f9ff"><b>Lecture '+safe(conditionLecture)+'</b><small style="display:block;margin:4px 0">'+count(conditionLecture)+' patient cases available</small>'+
 '<div class="buttonrow" style="margin-top:8px"><button data-pathdiff-study-start="1">🧠 Flashcards</button><button data-pathdiff-navle-quiz="'+safe(conditionLecture)+'">📝 Multiple choice</button><button data-pathdiff-condition-index="1">📚 Lecture notes</button><button data-pathdiff-return="1">🔬 Specimen atlas</button></div></div>'+
 '<div style="display:flex;align-items:center;justify-content:space-between;gap:7px;margin:13px 0 7px"><b>🩺 Patient cases</b><button data-pathdiff-create="1" style="font-size:12px">＋ Add case</button></div>'+
 '<p class="tiny" style="margin:4px 0 9px">Choose a patient for clinical reasoning. Optional extra questions appear in a collapsed dropdown inside related cases.</p>'+
 '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 9px"><button data-pathdiff-list-lecture="1">L'+safe(conditionLecture)+' only</button><button data-pathdiff-list-exam="1">Entire exam</button><button data-pathdiff-all-rounds="1">All exams</button><button data-pathdiff-shuffle="1">🔀 Shuffle</button></div>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:8px">'+matched.map((x,i)=>'<button data-pathdiff-open="'+safe(x.id)+'" style="display:block;text-align:left;padding:11px;border:1px solid #bacde2;border-radius:10px;background:#fff"><b>'+safe(signalment(x))+'</b><small style="display:block;margin-top:5px">L'+safe(x.lecture)+' · Patient '+(i+1)+'</small></button>').join('')+'</div>'+
 (!matched.length?'<p style="padding:10px;border:1px dashed #c8d6e4;border-radius:9px">No cases in this selection yet. Choose another lecture or add one.</p>':'')+
 '<details style="margin-top:13px"><summary style="cursor:pointer;font-size:12px">More resources and editing</summary><div class="buttonrow" style="margin-top:8px"><button data-pathdiff-umbrella="1">Pathology patterns</button><button data-pathdiff-library="1">Photo library</button><button data-pathdiff-condition-index="1">Full lecture inventory</button><a href="https://slides.davisthompsonfoundation.org/arkive?image=4" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:8px;border:1px solid #c2d3e7;border-radius:8px;background:white;color:#314f77">🖼️ Davis–Thompson Arkive</a></div></details>');
}

/* Umbrella terms describe morphology, anatomic patterns or syndromes; never count them as etiologic diagnoses. */
let umbrellaCurrent='';
function umbrellaMenu(){
 const cards=window.VPQ_NECROPSY_PATTERNS||[];
 modal('🧠 Pathology pattern & umbrella atlas',
 '<div class="buttonrow"><button data-pathdiff-list="1">← Differential Center</button><button data-pathdiff-condition-index="1">Lecture disease audit</button></div>'+
 '<p class="tiny">First identify the tissue and lesion pattern. Next compare possible causes. These concepts are not separate etiologic diagnoses and are not counted as additional cases.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:9px">'+cards.map(c=>
 '<button data-pathdiff-umbrella-open="'+safe(c.id)+'" style="text-align:left;background:#f5f8ff;border:1px solid #bdcede;padding:12px;border-radius:11px"><b>'+safe(c.title)+'</b><small style="display:block;color:#59738a;margin:5px 0">'+safe(c.kind)+' · L'+safe(c.lectures.join(', L'))+'</small><small>'+safe(c.definition)+'</small></button>').join('')+'</div>');
}
function umbrellaDetail(){
 const c=(window.VPQ_NECROPSY_PATTERNS||[]).find(x=>x.id===umbrellaCurrent);if(!c)return umbrellaMenu();
 const candidates=allCases().filter(x=>c.lectures.includes(x.lecture)&&
 (c.caseIds.includes(x.id)||c.keywords.some(w=>(x.best+' '+x.title+' '+x.morph).toLowerCase().includes(w))));
 modal('🔎 '+safe(c.title),
 '<div class="buttonrow"><button data-pathdiff-umbrella="1">← Pattern atlas</button><button data-pathdiff-list="1">All cases</button></div>'+
 '<p class="tiny"><b>'+safe(c.kind)+'</b> · Lecture '+safe(c.lectures.join(', '))+' · Not a single etiologic diagnosis</p>'+
 [['Learn first: definition',c.definition],['Why the body responds this way',c.why],['Gross lesion recognition',c.gross],['Histology: what to identify',c.histo],['Do not confuse with',c.mimics]].map(([k,v])=>
 '<div style="background:#f6f9fd;border:1px solid #d5e0eb;border-radius:10px;padding:11px;margin:7px 0"><b>'+safe(k)+'</b><p style="margin:5px 0">'+safe(v)+'</p></div>').join('')+
 '<h3>Diagnostic branches — what makes them different</h3>'+
 c.branches.map(b=>'<div style="padding:9px;border-bottom:1px solid #e2eaf2"><b>'+safe(b[0])+'</b><p style="margin:3px 0;font-size:13px">'+safe(b[1])+'</p></div>').join('')+
 '<h3>Connected differential cases ('+candidates.length+')</h3><p class="tiny">Linked by curated IDs or relevant lesion terms. Each case still requires independent evidence; multiple pattern cards may link to the same case.</p>'+
 '<div class="buttonrow">'+candidates.map(x=>'<button data-pathdiff-open="'+safe(x.id)+'" style="text-align:left;font-size:12px">'+safe(x.title)+' · L'+safe(x.lecture)+'</button>').join('')+'</div>'+
 '<p class="tiny"><b>Suggested image slots:</b> '+safe(c.photo)+' Photos are not implied to be attached or licensed.</p>');
}

/* Lecture coverage uses live lecture data, not a shortened list. */
let conditionLecture='75',conditionChosen=-1,conditionGap='all',conditionTopicMode='all';
const EXAM_GROUPS=[
 {id:'1',label:'Exam 1 · Foundations',start:1,end:16,short:'Foundations & injury'},
 {id:'2',label:'Exam 2 · Immunity & neoplasia',start:17,end:30,short:'Immune disease & tumors'},
 {id:'3',label:'Exam 3 · Urinary, liver & pancreas',start:31,end:41,short:'Urinary · Hepatic · Pancreas'},
 {id:'4',label:'Exam 4 · Endocrine, blood, muscle & bone',start:42,end:49,short:'Endocrine · Hemolymphatic · MSK'},
 {id:'5',label:'Exam 5 · Heart & respiratory',start:50,end:58,short:'Cardiac · Nasal · Thoracic · Lung'},
 {id:'6',label:'Exam 6 · Gastrointestinal',start:59,end:66,short:'Oral · GI · Stomach · Intestines'},
 {id:'7',label:'Exam 7 · Neuro, skin, reproduction & sensory',start:67,end:79,short:'Neuro · Skin · Repro · Ears · Eyes'}
];
const LECTURES=Array.from({length:79},(_,i)=>String(i+1));
let selectedExam='7',caseExam='all',practiceMode='all';
const groupForLecture=lecture=>EXAM_GROUPS.find(g=>Number(lecture)>=g.start&&Number(lecture)<=g.end);
const caseInExam=x=>caseExam==='all'||groupForLecture(x.lecture)?.id===caseExam;

const CASE_MATCH={
'gi6-l59-cat-ventral-tongue-mass':['Feline oral squamous cell carcinoma'],
'gi6-l60-bovine-firm-tongue':['Actinobacillus lignieresii pyogranulomatous glossitis (wooden tongue)'],
'gi6-l61-canine-twisted-stomach':['Canine gastric dilatation-volvulus'],
'gi6-l65-equine-arterial-colic':['Strongylus vulgaris verminous arteritis'],
'gi6-l66-pyloric-rugal-loss':['Gastric adenocarcinoma of dogs'],
'gi6-l66-small-bowel-stenosis':['Intestinal adenocarcinoma of dogs'],
'gi6-l62-postweaning-edema':['Porcine edema disease (postweaning E. coli)'],
'gi6-l62-pig-corrugated-ileum':['Lawsonia intracellularis proliferative enteropathy in pigs'],
'gi6-l63-neonatal-pig-villus-loss':['Porcine transmissible gastroenteritis (TGE)'],
'gi6-66-intussusception-vitality':['Antemortem intestinal intussusception','Postmortem intestinal intussusception'],
'gi6-64-canine-foamy-macrophage-colitis':['Histiocytic ulcerative colitis (Boxer colitis)'],
'n69-bovine-congenital-cns-figure1':['Congenital bovine CNS malformations: viral versus genetic'],
'gi6-practice-stomach-ulcers':['Acute gastric ulceration','Chronic gastric ulceration','Gastritis, erosions and gastric ulcers','Acute versus chronic gastric ulcers'],
'gi6-practice-haemonchus':['Haemonchus contortus abomasal parasitism','Hookworms and whipworms'],
'gi6-practice-bovine-abomasal-lymphoma':['Gastrointestinal neoplasms'],
'practice5-hcm':["Hypertrophic cardiomyopathy","Concentric versus eccentric hypertrophy"],
'practice5-cardiac-fibrin':["Fibrinous/fibrinosuppurative pericarditis"],
'practice5-bull-valve':["Vegetative valvular endocarditis","Fibrinous/fibrinosuppurative pericarditis"],
'practice5-cavalier-valve':["Myxomatous valvular endocardiosis"],
'practice5-pfo':["Patent foramen ovale in small ruminants"],
'practice5-pda':["Patent ductus arteriosus"],
'practice5-cattle-hardware':["Traumatic reticulopericarditis"],
'practice5-bovine-heart-lymphoma':["Large-animal cardiac tumors"],

'practice5-calf-hsomni':["Histophilus somni bovine pneumonia","Suppurative bronchopneumonia","Histophilus somni"],
'practice5-bovine-sweetpotato':["Interstitial pneumonia","Pulmonary edema versus diffuse alveolar damage"],
'practice5-fungalnodules':["Granulomatous pneumonia"],
'practice5-horse-septicemboli':["Embolic pneumonia","Septic pulmonary emboli","Septic pulmonary embolism versus bland thromboembolism"],
'practice5-dog-aspiration':["Aspiration bronchopneumonia"],
'practice5-canine-atelectasis':["Congenital versus acquired atelectasis"],
'practice5-caninemiliary':["Granulomatous pneumonia"],
'practice5-smoke-trachea':["Pulmonary hemorrhage","Viral tracheitis"],
'practice5-pulmonary-hemosiderosis':["Pulmonary congestion and heart failure cells"],

'n49-fod':['Fibrous osteodystrophy'],
'n49-disco':['Discospondylitis'],
'n49-joint-tumor':['Synovial myxoma'],
'n49-pig':['Infectious arthritis'],
'n49-synovitis':['Degenerative joint disease'],
'n49-ivdd':['Intervertebral disc disease'],
'n49-hod':['Hypertrophic osteodystrophy (metaphyseal osteopathy)'],
'n49-osteosarcoma':['Osteosarcoma'],

'exam4-42-case1':["Pheochromocytoma"],
'exam4-43-case1':["Thyroid follicular carcinoma"],
'exam4-44-case1':["Canine diffuse large B-cell lymphoma"],
'exam4-45-case1':["Caseous lymphadenitis"],
'exam4-46-case1':["Myofiber necrosis and regeneration"],
'exam4-47-case1':["Blackleg from Clostridium chauvoei"],
'exam4-48-case1':["Osteochondrosis dissecans"],
'exam4-49-case1':["Actinomyces bovis lumpy jaw"],
'n41-acute':['Acute pancreatitis and necrosis','Peripancreatic fat saponification'],
'n41-chronic':['Chronic pancreatitis'],
'n41-juvenile':['Juvenile pancreatic acinar atrophy'],
'n41-nodules':['Pancreatic nodular hyperplasia'],
'n41-carcinoma':['Exocrine pancreatic carcinoma'],
'n41-insulinoma':['Insulinoma (beta-cell neoplasm)'],
'n38-fasciola-compare':['Fasciola hepatica/gigantica infection'],
'n39-iron-pigment':['Hemosiderosis'],
'n40-vascular-nodule':['Hepatic hemangiosarcoma','Metastatic hepatic neoplasia'],
'n40-biliary-tumor':['Cholangiocellular carcinoma'],
'n38-cat-cholangitis':['Neutrophilic cholangitis'],
'n39-oxidative-toxin':['Microcystin cyanobacterial hepatotoxicosis'],

'n37-nutmeg':['Chronic passive hepatic congestion'],
'n37-shunt':['Congenital extrahepatic portosystemic shunt'],
'n38-tyzzer':['Tyzzer disease (Clostridium piliforme)'],
'n38-cav1':['Infectious canine hepatitis (CAV-1)'],
'n38-feedlot':['Feedlot hepatic abscessation'],
'n39-pyrrolizidine':['Pyrrolizidine alkaloid toxicosis'],
'n39-fattycat':['Feline hepatic lipidosis'],
'n40-nodules':['Hepatocellular nodular hyperplasia'],
'n40-mucocele':['Gallbladder mucocele'],

'n31-renal-infarct':['Renal infarction — acute','Renal infarction'],
'n32-amyloid':['Glomerular amyloidosis'],
'n32-hemoglobin':['Chronic copper toxicosis in sheep','Hemoglobinuric nephrosis'],
'n32-ethylene-glycol':['Ethylene glycol nephrotoxicity'],
'n33-pyelonephritis':['Acute pyelonephritis','Pyelonephritis'],
'n33-cat-fip':['FIP-associated pyogranulomatous nephritis'],
'n34-urethral-obstruction':['Urinary obstruction and hydroureter','Urolithiasis'],
'n34-bracken':['Bracken fern enzootic hematuria'],
'n35-uremia':['Chronic renal failure and fibrosis','Uremic glossitis and stomatitis','Intercostal uremic mineralization'],
'n35-neonatal-calf':['Septic embolic glomerulonephritis'],

"s71-feline-acne":["feline acne"],
"s71-seasonal-flank":["seasonal recurrent flank alopecia"],
"s71-hypothyroid":["canine hypothyroidism"],
"s71-sharpei-mucin":["shar-pei cutaneous mucinosis"],
"s72-pseudocowpox":["pseudocowpox / milker's nodules"],
"s72-ehv3":["equine herpesvirus 3 / coital exanthema"],
"s72-collarettes":["canine exfoliative superficial pyoderma"],
"s72-thrush":["equine necrotizing pododermatitis / thrush"],
"s73-stephanofilaria":["stephanofilaria dermatitis of ruminants"],
"s73-zinc-type2":["zinc-responsive dermatosis: type ii"],
"s73-pastern":["equine pastern dermatitis / grease heel / scratches"],
"s74-eosinophilic-face":["canine eosinophilic facial furunculosis"],
"s74-herda":["herda"],
"s74-epidermolysis-bullosa":["epidermolysis bullosa"],
'n69-ependymoma':['ependymoma'],
'n69-metastatic-hsa':['metastatic hemangiosarcoma to cns'],
'n69-lead':['lead toxicosis'],
'n69-tetanus':['tetanus / tetanospasmin'],
'n69-phalaris':['phalaris grass neurotoxicosis'],
'n69-copper-deficiency':['copper deficiency — small ruminants'],
'n69-medulloblastoma':['embryonal cns tumors'],
'n69-border-disease':['viral hypomyelinogenesis — border disease virus'],
'n69-postanesthetic':['postanesthetic hemorrhagic myelopathy'],
'n70-vitamin-a':['vitamin a deficiency optic nerve injury'],
'n70-vincristine':['vincristine neuropathy'],
'n70-neurotmesis':['neurotmesis'],
'n69-hydranencephaly':['hydranencephaly'],
'n69-hydromyelia':['hydromyelia'],
'n69-astrocytoma':['astrocytoma'],
'n69-choroid-plexus':['choroid plexus papilloma and carcinoma'],
'n69-selenium-pig':['selenium toxicosis in pigs'],
'n69-centaurea':['centaurea spp.'],
'n69-srma':['steroid-responsive meningitis-arteritis'],
'n69-edm':['equine degenerative myeloencephalopathy'],
'n69-emnd':['equine motor neuron disease'],
'n69-degenerative-myelo':['degenerative myelopathy'],
'n69-cholesterol-granuloma':['equine choroid plexus cholesteatoma'],
'n70-congenital-hypomyelin':['congenital peripheral hypomyelinating'],
'n70-coyotillo':['coyotillo toxicosis'],
'n70-riboflavin':['riboflavin b2 deficiency'],
'n70-salinomycin':['salinomycin-contaminated feed'],
'n70-axonotmesis':['axonotmesis'],
'n70-sensory-pointer':['canine sensory neuropathy'],
'n69-syringomyelia':["syringomyelia"],
'n69-meningioma':["meningioma"],
'n69-hepatic-enceph':["hepatic encephalopathy"],
'n69-wobbler':["cervical vertebral stenotic myelopathy"],
'n70-grass-sickness':["equine grass sickness"],
'n70-schwannoma':["schwannoma"],
'n68-meningitis':['leptomeningitis versus pachymeningitis','neonatal septicemia with cns infection'],
'n68-wnv':['west nile virus'],
'n68-ehv-neuro':['equine herpesvirus 1 (ehv 1) myeloencephalopathy'],
'n68-cae':['caprine arthritis encephalitis'],
'n68-crypto':['cryptococcosis'],
'n68-epm':['equine protozoal myeloencephalitis'],
'n68-fce':['fibrocartilaginous embolic ischemic myelopathy'],
'n68-ivdd':['intervertebral disk disease'],
'n68-nme':['necrotizing meningoencephalitis'],
'n68-brainstem':['listerio'],'n68-feedlot':['thrombotic meningoencephalitis','histophilus'],
'n69-white-matter':['leukoencephalomalacia','fumonisin'],'n69-pem':['polioencephalomalacia'],'n68-bse':['bovine spongiform encephalopathy','prion'],
'n70-flaccid':['botulism'],
's71-hepatocutaneous':['superficial necrolytic dermatitis','hepatocutaneous syndrome'],
's71-photosense':['type iii photosensitization','photosensitization overview','photosensitization: overview'],
's72-greasy-pig':['exudative epidermitis'],
's72-dermatophilus':['dermatophilosis'],
's73-habronema':['cutaneous habronemiasis'],
's73-pythium':['pythiosis'],
's74-pemphigus-vulgaris':['pemphigus vulgaris'],
's74-eosinophilic-plaque':['eosinophilic plaque'],
's71-cushing':['canine hyperadrenocorticism'],
's72-sheep-pox':['capripoxvirus sheeppox'],
's72-fowlpox':['fowlpox dry cutaneous form','fowlpox wet diphtheritic form'],
's72-erysipelas':['porcine erysipelas'],
's72-sarcoid':['equine sarcoids'],
's73-sarcoptes':['sarcoptic mange'],
's73-ringworm':['dermatophytosis microsporum canis'],
's73-malassezia':['malassezia pachydermatis dermatitis'],
's74-dle':['discoid lupus erythematosus'],
's73-demodex-cati':['feline demodex cati'],
's73-chorioptes':['chorioptic mange'],
's73-psoroptes':['psoroptic mange'],
's73-cheyletiella':['cheyletiellosis'],
's73-sporothrix':['sporotrichosis'],
's73-zinc':['zinc-responsive dermatosis type i'],
's74-pemphigoid':['bullous pemphigoid'],
's74-flea':['flea allergy dermatitis'],
's74-culicoides':['equine culicoides hypersensitivity'],
's74-em':['erythema multiforme'],
's74-mosquito':['feline mosquito-bite hypersensitivity'],

's71-catfrag':['feline hyperadrenocorticism'],
's71-digital':['bovine papillomatous digital dermatitis'],
's72-lumpy':['capripoxvirus lumpy skin disease'],
's72-bps':['bovine papular stomatitis'],
's72-seneca':['senecavirus a vesicular disease'],
's72-canker':['equine proliferative pododermatitis','canker'],
's72-pdns':['porcine dermatitis and nephropathy syndrome'],
's73-notoedres':['notoedric mange'],
's73-scalyleg':['scaly-leg mite'],
's74-ten':['toxic epidermal necrolysis'],
's74-atopy':['canine atopic dermatitis'],
's71-pillowfoot':['feline plasma-cell pododermatitis'],
's71-xanthoma':['xanthomas'],
's72-fhvskin':['feline herpesvirus 1 ulcerative dermatitis'],
's72-grooming':['post-grooming furunculosis'],
's73-onchocerca':['equine onchocerca cervicalis dermatitis'],
's73-cpl':['chronic progressive lymphedema of draft horses'],
's74-vkh':['uveodermatologic syndrome'],
's74-nodular-renal':['nodular dermatofibrosis'],
'r75-seminoma':['seminoma'],
'r76-feline-hyperplasia':['feline fibroadenomatous mammary hyperplasia'],
'r77-brucella-bovine':['bovine brucellosis','brucellosis: placental and fetal gross lesions'],
'e78-glaucoma':['glaucoma: syndrome and consequences','glaucoma gross/histologic sequelae'],
'e78-ibk':['infectious bovine keratoconjunctivitis'],
'ear79-ceruminous':['ceruminous gland adenocarcinoma'],
'r75-leydig':['leydig (interstitial) cell tumor'],
'r75-bph':['benign prostatic hyperplasia'],
'r75-bcanis':['canine brucella canis reproductive inflammation'],
'r76-follicular-cyst':['follicular cyst'],
'r76-metritis':['metritis'],
'r76-feline-mammary-ca':['feline mammary carcinoma'],
'r76-mycoplasma-mastitis':['mycoplasma mastitis'],
'r77-hydrallantois':['hydroallantois'],
'r77-lepto':['leptospirosis: horses','leptospirosis: transmission and abortion'],
'r77-fescue':['endophyte-infected fescue'],
'e78-kcs':['keratoconjunctivitis sicca'],
'e78-feline-iris':['feline diffuse iris melanoma'],
'e78-phacoclastic':['phacoclastic lens-induced uveitis'],
'ear79-chondritis':['auricular chondritis'],
'ear79-dentigerous':['equine dentigerous cyst'],
'ear79-bovis-otitis':['ruminant otitis media bacteria'],
'n68-distemper':['canine distemper virus','canine distemper — classic puppy'],
'n68-fip':['feline infectious peritonitis'],
'n68-rabies':['rabies — lyssavirus'],
'n69-bromethalin':['bromethalin toxicosis'],
'n69-cerebellar-hypo':['cerebellar hypoplasia'],
'n70-polyneuritis':['equine polyneuritis equi'],
'n70-acute-polyrad':['canine acute idiopathic polyradiculoneuritis'],
'n69-oligo':['oligodendroglioma'],
'n69-hydro':['hydrocephalus'],
'n69-salt':['sodium toxicosis','water deprivation'],
'n70-dysautonomia':['dysautonomias and feline key gaskell syndrome'],
'n70-larynx':['equine recurrent laryngeal paralysis'],
'e78-melting':['keratomalacia','melting ulcer'],
'e78-eru':['equine recurrent uveitis'],
'ear79-hematoma':['auricular hematoma'],
'ear79-polyp':['aural inflammatory','nasopharyngeal polyp'],'s72-crust':['contagious ecthyma','orf'],'s73-pruritus':['demodex gatoi'],'s74-blister':['pemphigus foliaceus'],
'r75-testis':['sertoli-cell tumor','sertoli cell tumor'],'r75-ram-epididymis':['ram epididymitis','brucella ovis'],'r75-prostate':['prostatic carcinoma'],
'r76-granulosa':['granulosa-theca cell tumor'],'r76-pyometra':['canine pyometra','pyometra — general'],'r76-mastitis':['coliform / e. coli mastitis'],
'r77-abortion':['chlamydia abortus','chlamydiosis'],'r77-campy':['campylobacter jejuni / fetus','campylobacter species'],
'r77-ehv':['equine herpesvirus 1 abortion'],'r77-mummy':['fetal mummification'],'r77-toxo':['ovine/caprine toxoplasmosis'],
'r77-mycotic':['bovine mycotic abortion'],'r77-neospora':['bovine neosporosis'],
'r76-teratoma':['ovarian teratoma'],'r76-ovarian-epithelial':['ovarian papillary cystadenocarcinoma'],
'r75-equine-scc':['equine penile/preputial squamous cell carcinoma'],'r75-tvt':['canine transmissible venereal tumor'],
'r77-coxiella':['q fever','coxiella burnetii'],'r77-trich':['bovine tritrichomoniasis','bovine trichomoniasis'],
'e78-corneal':['corneal sequestrum'],'ear79-bulla':['cholesteatoma']
};
function lectureConditions(){const owner=window.VPQ_NECROPSY_OWNER_PUBLISH;return [...((window.VPQ_PATH_LECTURE_LEARN||{})[conditionLecture]?.sections||[]),...(owner?.getCustomConditions?.(conditionLecture)||[])].map(x=>({...x,sourceTitle:x.title,title:owner?.renamedConditionTitle?.(conditionLecture,x)||x.title}));}
function norm(t){return String(t||'').toLowerCase().replace(/[–—-]/g,' ').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function relatedCases(lecture,title){
 const t=norm(title);
 return [...new Map([...allCases().filter(c=>c.lecture===lecture&&((CASE_MATCH[c.id]||[]).some(alias=>t.includes(norm(alias)))||((c.id.startsWith('custom-')||c.id.startsWith('n3'))&&((norm(c.title).includes(t)&&t.length>8)||(t.includes(norm(c.best))&&norm(c.best).length>8)||(norm(c.morph).includes(t)&&t.length>12))))),...exam7Matches(lecture,title)].map(c=>[c.id,c])).values()];
}
/* Exam 7 patient-rounds links reuse the lecture and specimen objects already in the game. */
function exam7Matches(lecture,title){
 const t=norm(title);if(t.length<5)return [];
 return allCases().filter(c=>c.sourceCaseId&&String(c.lecture)===String(lecture)&&(
   norm(c.best)===t||norm(c.best).includes(t)&&t.length>8||t.includes(norm(c.best))&&norm(c.best).length>8||
   (c.sourceCaseId==='N1'&&t.includes('listerio'))||
   (c.sourceCaseId==='N2'&&t.includes('thrombotic meningoencephalitis'))||
   (c.sourceCaseId==='S3'&&t.includes('contagious ecthyma'))||
   (c.sourceCaseId==='S8'&&t.includes('pemphigus foliaceus'))||
   (c.sourceCaseId==='F1'&&t.includes('pyometra'))
 ));
}
const EXAM7_SPECIMEN_ALIASES={
 N1:'Listeriosis',N2:'Thrombotic meningoencephalitis',N9:'Cerebellar hypoplasia',N11:'Equine recurrent laryngeal neuropathy',
 S1:'Endocrine alopecia',S3:'Contagious ecthyma (orf)',S7:'Demodicosis',S8:'Pemphigus foliaceus',
 M1:'Sertoli cell tumor',F1:'Canine CEH–pyometra',F6:'Granulosa-theca cell tumor',F2:'Fetal mummification',
 E2:'Glaucoma',E7:'Corneal sequestrum',A2:'Otitis externa',A3:'Auricular hematoma',
 I3:'Cerebellar hypoplasia'
};
function exam7Specimen(x){
 const title=norm(EXAM7_SPECIMEN_ALIASES[x.sourceCaseId]||x.best),cards=window.VPQ_PATH_EXAM7?.cards||[];
 return cards.find(c=>String(c.lecture)===String(x.lecture)&&!c.normal&&
 (norm(c.title)===title|| (norm(c.title).length>8&&title.includes(norm(c.title)))||
 (x.sourceCaseId==='N1'&&norm(c.title)==='listeriosis')||
 (x.sourceCaseId==='S8'&&norm(c.title)==='pemphigus foliaceus')||
 (x.sourceCaseId==='F1'&&norm(c.title).includes('pyometra'))))||null;
}
function openExam7Lecture(idOrLecture){
 const c=allCases().find(x=>x.id===idOrLecture),lecture=c?.lecture||idOrLecture;
 conditionLecture=String(lecture);selectedExam=groupForLecture(lecture)?.id||selectedExam;conditionGap='all';conditionTopicMode='all';
 if(c){const possible=lectureConditions();const index=possible.findIndex(p=>exam7Matches(lecture,p.sourceTitle||p.title).some(hit=>hit.id===c.id));if(index>=0){conditionChosen=index;return conditionDetail()}}
 return conditionIndex();
}
function openExam7Rounds(lecture){filter=lecture?String(lecture):'all';caseExam='7';practiceMode='all';roundsOnly=true;shuffledIds=[];menu();const section=ui?.body?.querySelector('#vpq-necro-case-list');if(section)section.open=true;}
function evidence(lecture,section){
 const linked=relatedCases(lecture,section.sourceTitle||section.title);
 const bank=window.VPQ_PATH_EXAM7_DATA||[];
 const t=norm(section.sourceTitle||section.title);
 const specimen=bank.some(x=>x.lecture===lecture&&(norm(x.title)===t||(t.length>8&&norm(x.title).includes(t))||(norm(x.title).length>8&&t.includes(norm(x.title)))));
 const imgs=window.VPQ_NECROPSY_DIFFERENTIAL_IMAGES||{};
 const owner=window.VPQ_NECROPSY_OWNER_PUBLISH;
 const embedded=linked.some(x=>(imgs[x.id]?.images||[]).length>0||!!owner?.getCase?.(x.id)?.photo?.url);
 const linkedPhotos=linked.some(x=>(imgs[x.id]?.links||[]).length>0);
 return {linked,specimen,embedded,linkedPhotos};
}
function coverageAll(){
 const lessons=window.VPQ_PATH_LECTURE_LEARN||{};
 return LECTURES.map(n=>{
  const rows=[...(lessons[n]?.sections||[]),...(window.VPQ_NECROPSY_OWNER_PUBLISH?.getCustomConditions?.(n)||[])],e=rows.map(x=>evidence(n,x));
  return {lecture:n,rows,teaching:rows.length,specimens:e.filter(x=>x.specimen).length,cases:e.filter(x=>x.linked.length>0).length,embedded:e.filter(x=>x.embedded).length,external:e.filter(x=>x.linkedPhotos).length};
 });
}
function conditionIndex(){
 const sections=lectureConditions(),facts=sections.map(x=>evidence(conditionLecture,x));
 const summary=coverageAll(),total=summary.reduce((a,x)=>a+x.teaching,0);
 const displayed=sections.map((x,i)=>({x,i,ev:facts[i]}))
 .filter(({x,ev})=>(conditionTopicMode==='all'||x.diseaseAtlas===true)&& (conditionGap==='all'||conditionGap==='case'&&!ev.linked.length||conditionGap==='photo'&&!ev.embedded))
 .sort((a,b)=>String(a.x.title||'').localeCompare(String(b.x.title||''),undefined,{sensitivity:'base',numeric:true})||a.i-b.i);
 const alphaOf=title=>{const c=String(title||'').trim().charAt(0).toUpperCase();return /^[A-Z]$/.test(c)?c:'#'};
 const presentLetters=[...new Set(displayed.map(({x})=>alphaOf(x.title)))];
 const row=summary.find(x=>x.lecture===conditionLecture);
 modal('📚 Complete pathology lecture inventory · L'+safe(conditionLecture),
 '<div class="buttonrow"><button data-pathdiff-list="1">← Differential cases</button><button data-pathdiff-add-condition="1" style="background:#e8f8ea">➕ Add condition to L'+safe(conditionLecture)+'</button></div>'+
 '<p class="tiny">Browse by exam and lecture. Topic count means a recorded note, not proof that a lecture is complete. Case and image counts reflect linked content, not verified curriculum coverage.</p>'+
 '<div style="border:1px solid #c9d9eb;border-radius:11px;padding:10px;background:#f7faff;margin:9px 0"><b>1 · Choose an exam</b><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:7px;margin-top:8px">'+EXAM_GROUPS.map(g=>'<button data-pathdiff-select-exam="'+g.id+'" aria-pressed="'+(selectedExam===g.id)+'" style="padding:9px;text-align:left;border-radius:8px;border:2px solid '+(selectedExam===g.id?'#6895c8':'#cad8e8')+';background:'+(selectedExam===g.id?'#e7f1ff':'#fff')+'"><b>'+safe(g.label)+'</b><small style="display:block">'+safe(g.short)+' · L'+g.start+'–'+g.end+'</small></button>').join('')+'</div></div>'+
 '<div style="padding:10px;border:1px solid #d2e0ed;border-radius:10px;margin:9px 0"><b>2 · Choose a lecture</b><p class="tiny" style="margin:5px 0">Only lectures for your selected exam appear here. Missing lecture notes stay visible as gaps, rather than disappearing.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(75px,1fr));gap:6px;margin-top:8px">'+summary.filter(v=>groupForLecture(v.lecture)?.id===selectedExam).map(v=>'<button data-pathdiff-condition-lecture="'+v.lecture+'" aria-pressed="'+(conditionLecture===v.lecture)+'" style="padding:8px 4px;border:2px solid '+(conditionLecture===v.lecture?'#7ca1cd':'#c5d6e8')+';background:'+(conditionLecture===v.lecture?'#e9f3ff':'#fff')+'"><b>L'+v.lecture+'</b><small style="display:block">'+v.teaching+' topics</small></button>').join('')+'</div></div>'+
 '<div style="background:#f3f7fc;border:1px solid #cbdbea;border-radius:9px;padding:10px;margin:8px 0"><b>'+safe((window.VPQ_PATH_LECTURE_LEARN||{})[conditionLecture]?.title||'Lecture '+conditionLecture+' · source inventory incomplete')+'</b><p style="font-size:12px;margin:5px 0">Recorded topics: '+row.teaching+' · Matched specimens: '+row.specimens+' · Topics with case matches: '+row.cases+' · Attached case image references: '+row.embedded+'</p><small>Some early exam content lives in separate learning tools and is not yet indexed here. Counts do not certify completeness.</small></div>'+
 '<div style="padding:10px;border:1px solid #cbdbea;border-radius:10px;margin:8px 0"><b>3 · Study or practice</b><div class="buttonrow" style="margin:8px 0"><button data-pathdiff-flash-lecture="1">🧠 Flashcards</button><button data-pathdiff-lecture-specimens="1">🔬 Specimen atlas</button><button data-pathdiff-lecture-cases="1">🩺 Patient cases</button><button data-pathdiff-lecture-ddx="1">🧩 Differential practice</button></div><small>Case modes use the same case bank, so uploaded questions remain connected to the lecture rather than duplicated.</small></div>'+
 (row.teaching===0?'<p style="padding:10px;background:#fff7e6;border:1px solid #e4d2a3;border-radius:9px"><b>Lecture inventory gap:</b> This lecture has no entries in the unified lecture inventory. Existing learning material elsewhere in the game may still be available. This is not marked complete.</p>':'')+
 '<div class="buttonrow"><button data-pathdiff-flash-lecture="1" style="background:#e8f2ff">🧠 Study this lecture · flashcards</button></div>'+
 '<div class="buttonrow" style="margin:8px 0"><button data-pathdiff-topic-mode="disease" aria-pressed="'+(conditionTopicMode==='disease')+'" style="background:#f5edff">🩺 Diseases only</button><button data-pathdiff-topic-mode="all" aria-pressed="'+(conditionTopicMode==='all')+'">All topics / foundations</button></div>'+ 
 '<div class="buttonrow" style="margin:8px 0"><button data-pathdiff-gap="all" aria-pressed="'+(conditionGap==='all')+'">All '+sections.length+'</button><button data-pathdiff-gap="case" aria-pressed="'+(conditionGap==='case')+'">Needs differential case</button><button data-pathdiff-gap="photo" aria-pressed="'+(conditionGap==='photo')+'">Needs attached photo</button></div>'+
 '<p class="tiny">'+displayed.length+' topics displayed. Select any topic to see full instructor-derived notes and the source slide reference.</p>'+
 '<nav aria-label="Jump to condition letter" style="display:flex;flex-wrap:wrap;gap:5px;margin:10px 0">'+presentLetters.map(letter=>'<button data-pathdiff-alpha="'+safe(letter)+'" style="padding:6px 9px;min-width:31px;font-size:12px;font-weight:800" aria-label="Jump to '+safe(letter)+'">'+safe(letter)+'</button>').join('')+'</nav>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px">'+displayed.map(({x,i,ev},n)=>
 (n===0||alphaOf(displayed[n-1].x.title)!==alphaOf(x.title)?'<div data-pathdiff-alpha-section="'+safe(alphaOf(x.title))+'" role="heading" aria-level="3" style="grid-column:1/-1;margin:14px 0 3px;padding:8px 12px;background:#eaf1f9;border-left:4px solid #718fb1;border-radius:7px;font-size:15px;font-weight:850;letter-spacing:.06em">'+safe(alphaOf(x.title))+'</div>':'')+
 '<button data-pathdiff-condition-open="'+i+'" style="text-align:left;padding:10px;background:'+(x.kind==='disease'?'#f3faf4':'white')+';border:1px solid '+(x.kind==='disease'?'#9fc9ad':'#c6d7e9')+';border-radius:10px"><b>'+safe(x.title)+'</b>'+(x.kind==='disease'?'<small style="display:block;color:#417453;margin-top:3px">Individual disease card</small>':'')+'<small style="display:block;color:#597087;margin-top:5px">Slides '+safe(x.slides||'see lecture')+'</small><small style="display:block;color:#536575;margin-top:4px">Notes ✓ · Specimen '+(ev.specimen?'✓':'—')+' · Case '+(ev.linked.length?'✓':'—')+' · Image '+(ev.embedded?'✓':'—')+'</small></button>').join('')+'</div>');
}

/* Lightweight source-derived flashcards reuse the existing lecture recall space.
 * A progress mark is a study preference, never a claim of diagnostic mastery.
 */
const FLASH_KEY='vpq-necropsy-flashcards-v1';
let flashCards=[],flashIndex=0,flashFace=false,flashScope='topic',flashReview=false,flashComplete=false;
function flashProgress(){try{return JSON.parse(localStorage.getItem(FLASH_KEY)||'{}')}catch(_){return {}}}
function saveFlashProgress(id,needsPractice){
 const data=flashProgress();if(needsPractice)data[id]=true;else delete data[id];
 try{localStorage.setItem(FLASH_KEY,JSON.stringify(data))}catch(_){}
}
function flashDeck(scope){
 const sections=lectureConditions(),source=scope==='topic'?[sections[conditionChosen]].filter(Boolean):scope==='foundation'?sections.filter(x=>['Defense and barrier systems','Terminology and interpretation'].includes(x.title)):sections;
 const deck=[];
 for(const [i,section] of source.entries()){
  if(!section)continue;
  const globalIndex=scope==='topic'?conditionChosen:sections.indexOf(section);
  // Curated question-and-answer cards replace generic note prompts for these sections.
  if(Array.isArray(section.flashcards)&&section.flashcards.length){
   section.flashcards.forEach(([prompt,answer],j)=>{if(String(prompt||'').trim()&&String(answer||'').trim())deck.push({id:conditionLecture+'|'+section.title.toLowerCase()+'|focus-'+j,title:section.title,prompt:String(prompt),answer:String(answer),slide:section.slides||'see source',topicIndex:globalIndex,curated:true});});
   continue;
  }
  for(const [j,p] of (section.points||[]).entries()){
   if(!Array.isArray(p)||!String(p[1]||'').trim())continue;
   const label=String(p[0]||'').trim(),answer=String(p[1]).trim();
   // Reject generic heading, meta-text and objectives as flashcards.
   if(!label||/^(key (finding|feature|point|information)|lecture feature|instructor slide|professor.s core finding|objectives?|source|references?|background|clinical overview|summary|note)\s*\d*$/i.test(label))continue;
   if(/^(lecture (objectives|scope)|instructor expectations|professor.s assessment note|faculty note)/i.test(label))continue;
   // Each question asks for a specific named feature. "Why" only if the slide gives a mechanism.
   const isWhy=/^(mechanism|pathogenesis|etiology|why|cause|pathway)/i.test(label);
   const isGross=/gross|lesion|distribution|site|location|appearance|clinical sign|presentation|signalment/i.test(label);
   const isHisto=/histo|microscop|cytolog|cellular|inclusion/i.test(label);
   const isTreatment=/test|diagnos|confirm|distinguish|differential/i.test(label);
   const prompt=isWhy?'What mechanism explains '+section.title+'?':
    isGross?'What '+label.toLowerCase()+' characterizes '+section.title+'?':
    isHisto?'What '+label.toLowerCase()+' supports '+section.title+'?':
    isTreatment?'How do you evaluate '+section.title+'? ('+label+')':
    'For '+section.title+', what does "'+label+'" describe?';
   if(answer.length>600||prompt.length>220)continue;
   const id=conditionLecture+'|'+section.title.toLowerCase()+'|'+j;
   deck.push({id,title:section.title,prompt,answer,slide:section.slides||'see source',topicIndex:globalIndex,curated:false});
  }
 }
 // Single-answer questions become normal question/answer study cards, not diagnostic differential cases.
 if(scope==='lecture'){
  for(const c of (window.VPQ_PATH_EXAM7_SBA||[]).filter(c=>String(c.lecture)===String(conditionLecture))){
   const prompt=[c.history,c.gross?'Gross: '+c.gross:'',c.originalQuestion].filter(Boolean).join(' ');
   const answer=c.best+'. '+c.mechanism;
   deck.push({id:'exam7-sba-'+c.sourceCaseId,title:c.title,prompt,answer,slide:c.ref,topicIndex:-1,curated:true});
  }
 }
 return window.VPQ_FLASHCARD_OWNER?.apply?.('pathology',conditionLecture,deck)||deck;
}
function startFlash(scope='topic',review=false){
 flashScope=scope;flashReview=review;flashFace=false;flashComplete=false;
 const all=flashDeck(scope),progress=flashProgress();
 // Lecture-wide sessions prioritize authored cards; generic note prompts remain available when opening individual topics.
 const clean=scope==='lecture'&&all.some(c=>c.curated)?all.filter(c=>c.curated):all;
 flashCards=(review?clean.filter(c=>progress[c.id]):clean);
 // Limit a lecture session to a manageable size. Cards missed in earlier rounds
 // are presented first, then shuffle the remaining eligible questions.
 const shuffled=flashCards.map(c=>({c,k:Math.random()})).sort((a,b)=>
  (Number(!!progress[b.c.id])-Number(!!progress[a.c.id]))||
  (Number(!!b.c.curated)-Number(!!a.c.curated))||a.k-b.k).map(x=>x.c);
 flashCards=shuffled.slice(0,scope==='lecture'?15:20);flashIndex=0;
 flashView();
}
/* Format imported four-option Quizlet MCQs as scannable choices, not one long heading. */
function flashPromptMarkup(prompt,answer,reveal=false){
 const raw=String(prompt||'').trim();
 const lines=raw.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 let question='',choices=[];
 if(lines.length>=5){
  const opts=lines.slice(-4);
  if(opts.every((v,i)=>new RegExp('^'+String.fromCharCode(65+i)+'\\.\\s+').test(v))){
   question=lines.slice(0,-4).join(' ');
   choices=opts.map(x=>x.replace(/^[A-D]\.\s*/, '').trim());
  }
 }
 if(!choices.length){
  const hits=[...raw.matchAll(/(?:^|\s)([A-D])\.\s+(?=\S)/g)];
  if(hits.length===4&&hits.every((m,i)=>m[1]===String.fromCharCode(65+i))){
   question=raw.slice(0,hits[0].index).trim();
   choices=hits.map((m,i)=>raw.slice(m.index+m[0].length,i<3?hits[i+1].index:raw.length).trim());
  }
 }
 if(choices.length===4&&question){
  // Never guess the key: only highlight if the stored answer has a valid letter
  // or matches one of the options exactly.
  let correct=-1;
  const value=String(answer||'').trim();
  const keyed=value.match(/^([A-D])\s*[.):\-]\s*(.*)$/i);
  const normalize=v=>String(v||'').toLowerCase().replace(/\s+/g,' ').replace(/[.\s]+$/,'').trim();
  if(keyed){
   const i=keyed[1].toUpperCase().charCodeAt(0)-65;
   if(!keyed[2]||normalize(keyed[2])===normalize(choices[i]))correct=i;
  }
  if(correct<0){
   const matches=choices.map((choice,i)=>normalize(choice)===normalize(value)?i:-1).filter(i=>i>=0);
   if(matches.length===1)correct=matches[0];
  }
  const showKey=reveal&&correct>=0;
  return '<div style="width:100%;text-align:left;max-width:710px;margin:0 auto">'+
   '<div style="font-size:clamp(16px,2vw,20px);line-height:1.4;font-weight:800;color:#25385b;margin:4px 0 16px">'+safe(question)+'</div>'+
   '<div style="display:grid;grid-template-columns:1fr;gap:9px">'+choices.map((choice,i)=>{
    const right=showKey&&i===correct,wrong=showKey&&i!==correct;
    const border=right?'#72b78a':wrong?'#eab176':'#d5dfed';
    const bg=right?'#e3f5e8':wrong?'#fff0df':'#ffffff';
    const badgeBg=right?'#318657':wrong?'#b96524':'#e9effa';
    const badgeColor=showKey?'#ffffff':'#2d5188';
    return '<div style="display:flex;align-items:flex-start;gap:12px;border:1.5px solid '+border+';background:'+bg+';border-radius:11px;padding:11px 13px;text-align:left">'+
     '<span style="flex:0 0 28px;height:28px;border-radius:8px;background:'+badgeBg+';color:'+badgeColor+';display:flex;align-items:center;justify-content:center;font-weight:850;font-size:13px">'+String.fromCharCode(65+i)+'</span>'+
     '<span style="flex:1;font-size:clamp(14px,1.7vw,16px);font-weight:'+(right?'750':'550')+';line-height:1.42;color:#2e405e;padding-top:3px">'+safe(choice)+(showKey?'<small style="display:block;margin-top:5px;font-weight:750;color:'+(right?'#227341':'#a65a21')+'">'+(right?'✓ Correct answer':'Not correct')+'</small>':'')+'</span></div>';
   }).join('')+'</div>'+
   (reveal&&!showKey?'<p style="font-size:12px;margin:10px 0 0;color:#69778d">The saved answer could not be matched confidently to an option; the choices are left uncolored.</p>':'')+
   '</div>';
 }
 return reveal?'<p style="font-size:clamp(17px,2.5vw,21px);line-height:1.5;font-weight:750;color:#25385b">'+rich(answer||'')+'</p>':
  '<p style="font-size:clamp(16px,2vw,21px);line-height:1.45;font-weight:750;color:#263a5d;margin:8px 0;white-space:pre-line">'+safe(raw)+'</p>';
}

function flashView(){
 const progress=flashProgress(),c=flashCards[flashIndex],pending=flashCards.filter(x=>progress[x.id]).length;
 if(flashComplete)return modal('🧠 Flashcard session complete',
 '<p>You reached the end of <b>'+flashCards.length+' card(s)</b>. '+pending+' are currently marked <b>Need practice</b> in this set.</p>'+
 '<div style="border-top:1px solid #cfdded;padding-top:11px;margin-top:12px"><b>Apply what you learned</b><p class="tiny" style="margin:5px 0">Flashcards teach recognition terms. The atlas checks gross and histologic patterns; cases challenge you to distinguish the causes.</p><div class="buttonrow"><button data-pathdiff-flash-specimens="1">🔬 Identify L'+safe(conditionLecture)+' specimens</button><button data-pathdiff-flash-cases="1">🧩 Solve L'+safe(conditionLecture)+' differential cases</button></div></div>'+
 '<div class="buttonrow"><button data-pathdiff-flash-review="1">↺ Practice missed cards</button><button data-pathdiff-flash-all="1">New shuffled set</button><button data-pathdiff-flash-back="1">← Back to notes</button></div>'+ 
 '<p class="tiny">Self-ratings are saved only in this browser. Skipped questions before reveal enter your practice list. These cards use instructor-derived notes; review real gross/histology photos separately.</p>');
 if(!c)return modal('🧠 Pathology flashcards',
 '<div class="buttonrow"><button data-pathdiff-flash-back="1">← Lecture topics</button></div>'+
 '<p>'+(flashReview?'No saved practice cards in this lecture yet. Mark any card “Need practice” to build a review deck.':'No flashcards were found for this selected topic.')+'</p>'+
 '<button data-pathdiff-flash-all="1">Study all '+(flashScope==='lecture'?'lecture':'topic')+' cards</button>');
 modal('🧠 L'+safe(conditionLecture)+' · '+(flashScope==='lecture'?'Lecture flashcards':flashScope==='foundation'?'CNS foundations':'Topic flashcards'),
 '<div class="buttonrow"><button data-pathdiff-flash-back="1">← '+(flashScope==='topic'?'Topic notes':'Lecture topics')+'</button><button data-pathdiff-flash-all="1">↻ New shuffled set</button></div>'+
 '<p class="tiny"><b>Card '+(flashIndex+1)+' of '+flashCards.length+'</b> · '+(flashReview?'Missed-card review':c.curated?'Focused question from lecture':'Lecture note recall')+' · '+pending+' marked for practice in this set. Your marks stay in this browser.</p>'+
 '<div style="height:5px;max-width:100%;border-radius:6px;background:#e4eaf4;overflow:hidden;margin:10px 0"><div style="width:'+Math.round((flashIndex+1)/flashCards.length*100)+'%;background:#7391cc;height:100%;border-radius:6px"></div></div>'+
 '<div role="button" tabindex="0" data-pathdiff-flash-flip="1" title="Flip flashcard" aria-label="Flip flashcard to '+(flashFace?'question':'answer')+'" style="cursor:pointer;position:relative;border:1px solid #bbcae1;border-radius:18px;background:linear-gradient(145deg,#ffffff 5%,#eef5ff 100%);box-shadow:0 7px 22px rgba(44,62,100,.09);padding:clamp(16px,3vw,24px);min-height:230px;display:flex;flex-direction:column;justify-content:center;gap:12px;margin:12px 0;text-align:center">'+
 '<div style="color:#5a7296;font-size:11px;text-transform:uppercase;letter-spacing:.11em;font-weight:850">'+(flashFace?'ANSWER':'QUESTION')+' · '+(c.curated?'Focused recall':'Lecture concept')+'</div>'+
 '<div style="font-size:12px;color:#576c87">L'+safe(conditionLecture)+' · '+safe(c.title)+'</div>'+
 (flashFace?
  flashPromptMarkup(c.prompt,c.answer,true)+
  (c.why?'<div style="text-align:left;border-top:1px solid #cedbec;padding-top:12px;font-size:13px"><b>WHY it matters</b><p>'+rich(c.why)+'</p></div>':''):
  flashPromptMarkup(c.prompt,c.answer,false)+'<small style="color:#7887a1">Choose an answer mentally, then flip to check.</small>')+
 '<small style="color:#65768c">Source · '+safe(c.slide)+'</small></div>'+
 '<div class="buttonrow">'+(flashFace?
 '<button data-pathdiff-flash-rate="again" style="background:#fff2e6">↺ Need practice</button><button data-pathdiff-flash-rate="know" style="background:#e7f5eb">✓ Got it</button>':
 '<button data-pathdiff-flash-flip="1" style="background:#e7f0ff;font-weight:800">Flip / show answer</button>')+'</div>'+
 '<div class="buttonrow"><button data-pathdiff-flash-prev="1" '+(flashIndex===0?'disabled':'')+'>← Previous</button><button data-pathdiff-flash-next="1">'+(flashFace?'Skip rating · next →':'Skip · save for review →')+'</button></div>'+
 '<div class="buttonrow"><button data-pathdiff-flash-edit="1">✏️ Edit / publish card</button><button data-pathdiff-flash-new="1">➕ Add card</button><button data-pathdiff-flash-review="1">Practice missed cards</button>'+(flashScope==='topic'?'<button data-pathdiff-flash-lecture="1">Study entire L'+safe(conditionLecture)+'</button>':'')+'</div>'+
 (flashFace?'<div class="buttonrow"><button data-pathdiff-flash-specimens="1" style="font-size:12px">🔬 Practice image recognition</button><button data-pathdiff-flash-cases="1" style="font-size:12px">🧩 Apply in differential cases</button></div>':'')+
 (flashScope==='topic'?'<button data-pathdiff-recall-all="1" style="font-size:12px">Show all lecture-derived recall prompts</button>':'')+
 '<p class="tiny">“Got it” removes the card from your practice list; “Need practice” saves it. These are paraphrased lecture notes, not validated exam questions or photo-based specimen IDs.</p>');
}

/* Every lecture topic, including topics without bespoke differential questions, has a source-grounded active-recall exercise. */
let recallShow=false;
function recallView(){
 const x=lectureConditions()[conditionChosen];if(!x)return conditionIndex();
 const ev=evidence(conditionLecture,x);
 const points=x.points||[];
 modal('🧠 Lecture '+safe(conditionLecture)+' · Source-grounded active recall',
 '<div class="buttonrow"><button data-pathdiff-recall-back="1">← Lecture topic</button><button data-pathdiff-recall-reset="1">↺ Hide answers</button></div>'+
 '<div style="background:#eff6ff;border-radius:10px;padding:11px;margin:10px 0"><b>'+safe(x.title)+'</b><p style="font-size:12px">Original slide: '+safe(x.slides||'see lecture')+'</p><p>Without looking at notes, explain each of the prompts below. Include species, distribution, gross lesions, histology, causation, and what makes it different where applicable.</p></div>'+
 points.map((q,i)=>'<div style="border:1px solid #cfdfed;border-radius:9px;padding:10px;margin:7px 0"><b>'+safe(i+1)+'. '+safe(q[0])+'</b>'+(recallShow?'<p style="white-space:pre-wrap;margin:6px 0">'+safe(q[1])+'</p>':'<p style="color:#63758a;margin:7px 0;font-size:12px">Try to recall the explanation before revealing the source-derived answer.</p>')+'</div>').join('')+
 '<div class="buttonrow"><button data-pathdiff-recall-reveal="1">'+(recallShow?'Answers visible ✓':'Reveal lecture-derived answers')+'</button></div>'+
 '<p style="font-size:12px;margin-top:10px">This is a source-note recall drill, not a full independent differential case. '+(ev.linked.length?'There is also a dedicated differential case for this topic.':'This topic still needs a dedicated differential case.')+'</p>');
}

function conditionDetail(){
 const item=lectureConditions()[conditionChosen];if(!item)return conditionIndex();
 const ev=evidence(conditionLecture,item),images=window.VPQ_NECROPSY_DIFFERENTIAL_IMAGES||{};
 const visual=(window.VPQ_PATH_URINARY_VISUALS?.card?.(item,conditionLecture)||window.VPQ_PATH_HEPATIC_VISUALS?.card?.(item,conditionLecture)||window.VPQ_PATH_PANCREAS_VISUALS?.card?.(item,conditionLecture)||'');
 const imageRefs=[...(window.VPQ_PATH_EXAM3_HEPATIC_IMAGE_AUDIT?.byLecture?.[conditionLecture]||[]),...(window.VPQ_PATH_EXAM3_PANCREAS_IMAGE_AUDIT?.byLecture?.[conditionLecture]||[]),...(window.VPQ_PATH_EXAM5_IMAGE_AUDIT?.byLecture?.[conditionLecture]||[])].filter(x=>x.title===item.title);
 const imageChecklist=imageRefs.length?'<div style="background:#f6f9fc;border:1px solid #d1dfef;border-radius:10px;padding:10px;margin:9px 0"><b>📷 Lecture-image recognition checklist · not an attached photograph</b>'+imageRefs.map(x=>'<p style="font-size:12px;line-height:1.45;margin:8px 0"><b>Lecture '+safe(conditionLecture)+' slides '+safe(x.slides)+'</b> · '+safe(x.modality)+'<br><b>Identify:</b> '+safe(x.look)+'<br><b>Ask yourself:</b> '+safe(x.question)+'</p>').join('')+'<small>Use the editable lecture photo slots to attach and publish credited images. The original PDF remains the visual reference until an image is attached.</small></div>':'';
 const refBlock=ev.linked.map(x=>{
  const p=images[x.id]||{};
  return '<div style="padding:9px;border:1px solid #d4dfec;border-radius:9px;margin:8px 0"><button data-pathdiff-open="'+safe(x.id)+'">🧩 Practice case: '+safe(x.title)+'</button>'+
   (p.images||[]).map(i=>'<small style="display:block;margin-top:6px">📷 '+safe(i.type||'reference')+': '+safe(i.caption||i.file||'photo')+'</small>').join('')+
   (p.links||[]).map(l=>'<a href="'+safe(l.url)+'" target="_blank" rel="noopener noreferrer" style="display:block;margin-top:5px;font-size:12px">📖 '+safe(l.label)+'</a>').join('')+'</div>';
 }).join('');
 modal('📖 L'+safe(conditionLecture)+' · '+safe(item.title),
 '<div class="buttonrow"><button data-pathdiff-condition-back="1">← Full lecture inventory</button><button data-pathdiff-list="1">Cases</button></div>'+
 '<div class="buttonrow"><button data-pathdiff-condition-rename="1" style="background:#fff1dc">✏️ Rename this condition</button></div>'+
 '<div class="buttonrow"><button data-pathdiff-recall-start="1">🧠 Test me on this topic</button></div>'+
 (/^(3[1-9]|4[0-9]|5[0-9]|6[0-6])$/.test(conditionLecture)?'<div class="buttonrow"><button data-pathdiff-photo-lecture="1" style="background:#e3f4f7">📷 Open lecture photo slots / publish images</button></div>':'')+
 '<div class="buttonrow"><button data-pathdiff-create-topic="1" style="background:#e6f6ec">➕ Create differential card for this disease</button></div>'+
 '<div style="background:#f0f6fb;padding:10px;border:1px solid #c8dbeb;border-radius:10px;margin:9px 0"><b>Instructor-based lesson</b><p style="font-size:13px;margin:5px 0">Lecture '+safe(conditionLecture)+' · slides '+safe(item.slides||'not specified')+'</p><small>Specimen card: '+(ev.specimen?'Matched':'Not matched')+' · Dedicated case: '+(ev.linked.length?'Matched':'Not yet')+' · Attached reference: '+(ev.embedded?'Yes':'Not yet')+'</small></div>'+
 visual+imageChecklist+
 (item.points||[]).map(p=>'<section style="border-bottom:1px solid #e0e7ef;padding:9px 0"><b>'+safe(p[0])+'</b><p style="margin:5px 0;white-space:pre-wrap;line-height:1.5">'+safe(p[1])+'</p></section>').join('')+
 '<div style="padding:9px;background:#f8f6ed;border-radius:10px;margin:10px 0;font-size:12px"><b>Photo evidence:</b> Original professor slide '+safe(item.slides||'(see source deck)')+' is the primary teaching reference. We have not copied lecture slides into this index. Published pathology images must be identified by species and gross/histology type.</div>'+
 (refBlock||'<p style="font-size:12px">No dedicated differential case is linked to this exact lecture topic yet. This remains visible in the coverage audit rather than being marked complete.</p>'));
}

function zoomCaseImage(raw){
 const url=String(raw||'');if(!/^https:\/\//i.test(url)&&!/^data:image\//i.test(url))return;
 const shade=document.createElement('div');shade.setAttribute('role','dialog');shade.setAttribute('aria-label','Enlarged pathology image, no diagnostic caption');
 shade.style.cssText='position:fixed;inset:0;z-index:999999;background:rgba(8,15,30,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;gap:8px';
 const close=document.createElement('button');close.type='button';close.textContent='✕ Close image';close.style.cssText='padding:9px 18px;background:white;color:#111;border-radius:8px;cursor:pointer';
 const image=document.createElement('img');image.src=url;image.alt='Enlarged unlabeled case image';image.style.cssText='max-width:96vw;max-height:86vh;object-fit:contain';
 shade.append(close,image);document.body.appendChild(shade);
 const dismiss=()=>{shade.remove();document.removeEventListener('keydown',escape);};
 const escape=e=>{if(e.key==='Escape')dismiss();};
 close.addEventListener('click',dismiss);shade.addEventListener('click',e=>{if(e.target===shade)dismiss()});document.addEventListener('keydown',escape);close.focus();
}
function sourcedPhotos(x){
 const d=window.VPQ_NECROPSY_DIFFERENTIAL_IMAGES?.[x.id];
 if(!d)return '';
 const pics=(d.images||[]).map(p=>{
  const filename=String(p.file||'');
  const url=p.url||'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(filename);
  const source=p.sourceUrl||'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(filename).replace(/%20/g,'_');
  if(p.type==='histology'&&phase===0)return '<div style="padding:10px;background:#f3f1fa;border:1px dashed #c1bcd3;border-radius:9px;font-size:12px;margin:7px 0">🔬 Histology reference becomes visible after the histology clue.</div>';
  return '<div style="padding:8px;border:1px solid #d2deed;border-radius:10px;background:white;margin:7px 0"><button type="button" data-pathdiff-zoom="'+safe(url)+'" aria-label="Enlarge case image without showing caption" style="display:block;width:100%;padding:0;border:0;background:transparent;cursor:zoom-in"><img src="'+safe(url)+'" alt="Unlabeled pathology teaching image" loading="lazy" style="display:block;width:100%;max-height:210px;object-fit:contain;border-radius:6px"></button><div style="font-size:12px;margin-top:5px"><b>'+safe(p.type==='histology'?'Microscopic reference':'Gross reference')+'</b> · '+(phase>=2?safe(p.caption):'Tap image to enlarge; explanatory caption is hidden until comparison.')+'</div>'+(phase>=2?'<div style="font-size:11px;color:#5b718b">Credit: '+safe(p.credit)+' · <a target="_blank" rel="noopener noreferrer" href="'+safe(source)+'">Source / license</a></div>':'')+'</div>';
 }).join('');
 const links=phase>=2?(d.links||[]).map(p=>'<a target="_blank" rel="noopener noreferrer" href="'+safe(p.url)+'" style="display:block;margin:6px 0;font-size:12px;text-decoration:underline;color:#315b9b">🔎 '+safe(p.label)+'</a>').join(''):'';
 return '<div style="background:#eff8f5;border:1px solid #c5dace;border-radius:10px;padding:9px;margin:7px 0"><b style="font-size:13px">📸 Original veterinary references (not this simulated patient)</b>'+pics+(links?'<details '+(phase>=2?'open':'')+' style="margin:6px 0"><summary style="font-size:12px;font-weight:700">Additional pathology references (may reveal diagnosis)</summary>'+links+'</details>':'')+(phase>=2&&d.note?'<p style="font-size:12px;color:#536375">'+safe(d.note)+'</p>':'')+'</div>';
}
function photoHTML(x){const photo=photoStore()[x.id];return '<div style="max-width:330px;padding:10px;background:#f8faff;border:1px dashed #bdcce0;border-radius:10px">'+(photo?'<button type="button" data-pathdiff-zoom-local="'+safe(x.id)+'" aria-label="Enlarge your uploaded specimen without captions" style="display:block;padding:0;border:0;background:transparent;cursor:zoom-in"><img src="'+safe(photo)+'" alt="Unlabeled case specimen" style="max-width:100%;max-height:205px;object-fit:contain;display:block;margin:auto"></button>':'<div style="min-height:92px;display:grid;place-items:center;color:#566a89;font-size:13px">📷 No source photograph yet — add one from your lectures</div>')+'<label style="display:block;margin-top:7px;font-size:12px"><b>Add / replace this case image (local only)</b><input type="file" accept="image/*" data-pathdiff-photo="'+safe(x.id)+'" style="max-width:100%;font-size:12px"></label>'+(photo?'<button style="margin-top:5px;font-size:11px" data-pathdiff-remove="'+safe(x.id)+'">Remove local photo</button>':'')+'<small style="display:block;color:#66758b">Local draft photo; publish to make it available across devices. Only use photos you have rights to share.</small><button data-pathdiff-publish="'+safe(x.id)+'" style="display:block;margin-top:7px;background:#e4f6eb;border:1px solid #75b996">🚀 Edit / Publish photo now</button></div>'}
function moveCase(direction){
 const cases=caseSequence(),index=cases.findIndex(x=>x.id===current);
 if(index<0)return menu();
 const target=cases[index+direction];if(!target)return view();
 return prepareCase(target.id);
}
function caseAtlasMatches(x){
 const lecture=String(x.lecture||''),lesson=window.VPQ_PATH_LECTURE_LEARN?.[lecture];
 if(!lesson)return [];
 const named=(CASE_MATCH[x.id]||[]).map(norm);
 return (lesson.sections||[]).map((item,i)=>({item,i})).filter(({item})=>
  item.diseaseAtlas===true&&named.some(label=>norm(item.title)===label||norm(item.title).includes(label)||label.includes(norm(item.title)))
 );
}
function openCaseAtlas(index){
 const base=allCases().find(v=>v.id===current);if(!base||phase<2)return view();
 const match=caseAtlasMatches(base)[index];if(!match)return view();
 conditionLecture=String(base.lecture);conditionChosen=match.i;
 if(/^(59|60|61|62|63|64|65|66)$/.test(conditionLecture)&&window.VPQ_NECROPSY_HANDBOOK?.openExam6Disease){return window.VPQ_NECROPSY_HANDBOOK.openExam6Disease(conditionLecture,match.i)}
 return conditionDetail();
}
const EXTRA_QUESTION_LINKS={'n68-feedlot':'N2','n68-rabies':'N5','n69-cerebellar-hypo':'N9','n70-larynx':'N11','ear79-hematoma':'A3','r76-granulosa':'F6','r77-mummy':'F2','e78-glaucoma':'E2'};
function extraQuestionFor(x){
 const id=EXTRA_QUESTION_LINKS[x.id]||x.extraQuestionId;
 return id?(window.VPQ_PATH_EXAM7_SBA||[]).find(q=>q.sourceCaseId===id)||null:null;
}
function extraQuestionHTML(x){
 const q=extraQuestionFor(x);if(!q)return '';
 const right=q.options.findIndex(o=>o.role==='best');
 return '<details id="pathdiff-extra-question" '+(extraOpen?'open':'')+' style="margin:13px 0;border:1px solid #b8d4e9;border-radius:10px;padding:11px;background:#f8fbff"><summary style="cursor:pointer;font-weight:800">📝 Extra practice question <small style="font-weight:400">· Optional multiple choice</small></summary>'+
 '<div style="margin-top:10px"><p><b>'+safe(q.originalQuestion||'Choose the best response.')+'</b></p><p class="tiny">Based on the patient and lesion findings above.</p>'+
 q.options.map((o,i)=>'<button data-pathdiff-extra-answer="'+i+'" '+(extraAnswer>=0?'disabled':'')+' style="display:block;text-align:left;width:100%;margin:6px 0;padding:10px;border:2px solid '+(extraAnswer<0?'#cedbe9':i===right?'#65ae7b':i===extraAnswer?'#d58b3e':'#d3e0ec')+';border-radius:9px;background:'+(extraAnswer>=0&&i===right?'#e5f7e9':i===extraAnswer?'#fff0df':'white')+'">'+safe(String.fromCharCode(65+i)+'. '+o.name)+'</button>').join('')+
 (extraAnswer>=0?'<div style="border:1px solid #bdd6c8;border-radius:8px;padding:10px"><b>'+(extraAnswer===right?'Correct ✓':'Not quite — review the correct answer')+'</b><p>'+safe(q.mechanism||'')+'</p></div><button data-pathdiff-extra-reset="1">↺ Try again</button>':'')+
 '</div></details>';
}
function view(){
 const original=allCases().find(v=>v.id===current);if(!original)return menu();
 const source={...original,...(window.VPQ_NECROPSY_OWNER_PUBLISH?.getText?.('case',current)||{})};
 if(optionOrder.length!==source.options?.length)optionOrder=shuffleArray((source.options||[]).map((_,i)=>i));
 const x={...source,options:optionOrder.map(i=>source.options[i])};
 const sequence=caseSequence(),position=sequence.findIndex(c=>c.id===current);
 const revealed=phase>=2,selected=leading>=0?x.options[leading]:null;
 const correct=x.options.findIndex(o=>o.role==='best'||String(o.name).trim().toLowerCase()===String(x.best).trim().toLowerCase());
 const leadCorrect=leading>=0&&leading===correct;
 const history=String(x.history||'').startsWith(String(x.species||''))?String(x.history||'').slice(String(x.species||'').length).replace(/^[., ]+/,''):x.history;
 const realMorph=x.morph&&!/^Path Exam [0-9]+ ·/.test(String(x.morph))&&!/differential reasoning|single-best-answer/i.test(x.morph);
 const photoSlots=Array.isArray(x.photoSlots)?x.photoSlots:[];
 const initialSlots=photoSlots.filter(p=>!p.reveal||p.reveal==='initial');
 const followupSlots=photoSlots.filter(p=>p.reveal==='followup');
 const histoSlots=photoSlots.filter(p=>p.reveal==='histo');
 const publishedImages=window.VPQ_NECROPSY_OWNER_PUBLISH?.casePhotoHTML?.(x.id,{includeHistology:false})||'';
 const localPhoto=photoStore()[x.id];
 const localPreview=localPhoto?'<button type="button" data-pathdiff-zoom-local="'+safe(x.id)+'" aria-label="Enlarge this specimen" style="display:block;width:100%;padding:4px;background:white;border:1px solid #d4e2ee;border-radius:9px"><img src="'+safe(localPhoto)+'" alt="Locally uploaded specimen preview" style="display:block;width:100%;height:auto;max-height:250px;object-fit:contain"></button>':'';
 const initialGallery=publishedImages+sourcedPhotos(x)+localPreview;
 const imagePanel='<aside class="vpq-ddx-images" style="min-width:0;align-self:start;background:#f7faff;border:1px solid #d7e4f1;border-radius:13px;padding:12px">'+
 '<div style="display:flex;align-items:center;justify-content:space-between;gap:7px"><b style="font-size:13px">📷 Patient imaging</b><span style="font-size:11px;color:#627d96">Clinical · Gross</span></div>'+
 (initialGallery?'<div style="margin-top:9px">'+initialGallery+'</div>':'<div style="display:grid;place-items:center;min-height:145px;border:1px dashed #c3d4e5;background:#fff;border-radius:10px;margin-top:10px;text-align:center;padding:12px;box-sizing:border-box"><div><span style="font-size:24px">🖼️</span><p style="font-size:12px;margin:6px 0;color:#526b84">Images not added yet</p><small>Clinical photographs and diagnostic images will appear here.</small></div></div>')+
 (initialSlots.length?'<details style="border-top:1px solid #dae5ee;margin-top:11px;padding-top:9px"><summary style="font-size:12px;cursor:pointer;font-weight:700">View planned images ('+initialSlots.length+')</summary><div style="display:grid;gap:5px;margin-top:8px">'+initialSlots.map(p=>'<div style="font-size:11px;padding:7px;border:1px solid #dce7f0;border-radius:7px;background:#fff">'+safe(p.label)+'</div>').join('')+'</div></details>':'')+
 '<button data-pathdiff-edit-case="'+safe(x.id)+'" style="display:block;width:100%;margin-top:10px;padding:9px;background:white;border:1px solid #bfd1e2;border-radius:9px;font-size:12px;font-weight:800">＋ Manage case photos</button></aside>';
 const patientParts=String(history||'').split(/\b(Clinical signs|Bloodwork|Ancillary diagnostics|Laboratory findings|Diagnostic findings|Diagnostics):\s*/i);
 const narrative=patientParts[0]||'';
 let signs='',diagnostics='';
 for(let i=1;i<patientParts.length-1;i+=2){
  const key=String(patientParts[i]||'').toLowerCase(),v=String(patientParts[i+1]||'').trim();
  if(!v)continue;
  if(key==='clinical signs')signs+='<p style="margin:0;line-height:1.55">'+rich(v)+'</p>';
  else diagnostics+='<p style="margin:0 0 6px;line-height:1.5">'+rich(v)+'</p>';
 }
 const infoCard=(label,icon,content,style)=>content?'<div style="padding:11px 12px;border-radius:10px;background:#fff;border:1px solid '+(style||'#d4e0ec')+';margin-top:9px"><b style="display:block;font-size:12px;color:#315478;margin-bottom:6px">'+icon+' '+label+'</b><div style="font-size:13px;line-height:1.55">'+content+'</div></div>':'';
 const gross='<section class="vpq-ddx-patient" style="border:1px solid #d0dfec;background:#f3f8fd;border-radius:13px;padding:13px;margin-bottom:11px">'+
 '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#617d9a">Patient profile</div>'+
 '<div style="font-size:15px;font-weight:800;line-height:1.35;margin-top:4px;color:#233f66">'+safe(signalment(x))+'</div>'+
 infoCard('Presenting history','📋',narrative.trim()?rich(narrative):'')+
 infoCard('Clinical signs','🩺',signs)+
 (diagnostics?'<details class="vpq-ddx-ancillary" style="margin-top:9px;border-radius:10px;background:white;border:1px solid #d4e0ec;padding:11px 12px"><summary style="cursor:pointer;font-size:12px;font-weight:800;color:#315478">🧪 Ancillary diagnostics <span style="font-weight:400">· click to expand</span></summary><div style="font-size:13px;line-height:1.5;margin-top:9px">'+diagnostics+'</div></details>':'')+
 infoCard('GROSS FINDINGS — OBSERVE FIRST','🔍',rich(x.gross),'#a9c5e5')+'</section>';
 const morphology='<details style="margin:9px 0;border:1px solid #b9d4e6;border-radius:10px;padding:10px;background:#f6fbfd"><summary style="font-weight:800;cursor:pointer">✍️ Pattern recognition · Build a morphologic diagnosis (optional)</summary>'+
 '<p class="tiny" style="margin:8px 0">Lecture 9: Describe the lesion objectively, then form a morphologic diagnosis. This is different from naming the organism or disease.</p>'+
 '<div style="border-left:3px solid #6b9ab3;padding-left:9px;margin:8px 0;font-size:12px"><b>Description checklist:</b> tissue/location · number · distribution · size · color · shape · pattern · consistency · special features<br><b>Morphologic formula:</b> Organ → process ± modifier → distribution → chronicity → severity.</div>'+
 '<label style="font-size:13px;font-weight:750">Your morphologic diagnosis<textarea data-pathdiff-morph="1" rows="2" placeholder="Organ: pathologic process, modifier, distribution, chronicity, severity (only when supported by evidence)" style="display:block;width:100%;box-sizing:border-box;padding:9px;margin-top:5px;border:1px solid #9fb9d3;border-radius:8px">'+safe(morphDraft)+'</textarea></label>'+
 (revealed?'<p style="margin:8px 0;font-size:13px"><b>Reference:</b> '+(realMorph?rich(x.morph):'A specific, source-verified morphologic diagnosis has not yet been recorded for this case. Do not substitute the etiologic diagnosis automatically.')+'</p>':'<p class="tiny">Your response stays private to this practice attempt until the comparison is revealed.</p>')+'</details>';
 const opts=x.options.map((o,i)=>{
  const chosen=shortlist.includes(i),best=i===correct,isLead=i===leading;
  const border=revealed?(best?'#4a9f66':isLead?'#d88a36':'#cad9e8'):isLead?'#668bc4':chosen?'#779fd3':'#cad9e8';
  const bg=revealed?(best?'#e5f6e9':isLead?'#fff1e1':'white'):isLead?'#e9f2ff':chosen?'#f0f6ff':'white';
  return '<div style="display:flex;align-items:center;gap:6px;margin:6px 0"><button data-pathdiff-toggle="'+i+'" aria-pressed="'+chosen+'" style="flex:1;text-align:left;border:2px solid '+border+';background:'+bg+';border-radius:9px;padding:10px;font-weight:700">'+(chosen?'☑ ':'☐ ')+safe(o.name)+(revealed?(best?' · ✓ Supported diagnosis':isLead?' · Review alternative':''):'')+'</button><button data-pathdiff-set-lead="'+i+'" '+(revealed?'disabled':'')+' aria-label="Choose '+safe(o.name)+' as leading diagnosis" title="Set as leading diagnosis" style="white-space:nowrap;border:1px solid '+(isLead?'#6287ba':'#bfcfe1')+';border-radius:8px;padding:10px;background:'+(isLead?'#ddeafb':'white')+'">'+(isLead?'★ Lead':'☆ Lead')+'</button></div>';
 }).join('');
 const main='<section style="min-width:0">'+morphology+
 '<h4 style="margin:13px 0 5px">1 · Compare possible causes</h4><p class="tiny" style="margin:5px 0">Check plausible alternatives, then select your leading diagnosis using ☆ Lead. Options stay neutral until you submit your answer.</p>'+opts+
 '<div style="border:1px solid '+(revealed?(leadCorrect?'#92c7a0':'#e6bb8b'):'#c0d2e7')+';background:'+(revealed?(leadCorrect?'#eaf8ee':'#fff2e4'):'#f1f6fd')+';padding:11px;border-radius:9px;margin:10px 0"><b>2 · Your leading diagnosis</b>'+
 '<p style="margin:6px 0;font-weight:700">'+(selected?safe(selected.name):'Not selected yet — choose ☆ Lead beside a diagnosis.')+'</p>'+
 (revealed?'<p style="margin:5px 0;color:'+(leadCorrect?'#286c3b':'#9b5515')+'"><b>'+(leadCorrect?'✓ Best-supported diagnosis':'Review the evidence and compare with the supported diagnosis')+'</b></p>':'<small>Your selected lead appears immediately. Correctness is revealed after histology and submission.</small>')+'</div>'+
 (phase===0?'<button data-pathdiff-histo="1" style="width:100%;padding:11px;border:1px solid #9eb9d4;border-radius:9px;font-weight:800;background:#e9f1fc">🔬 Reveal histology and reconsider</button>':'<div style="padding:11px;border-left:4px solid #9a79be;background:#f5effb;border-radius:9px"><b>3 · Histology</b><p style="margin:7px 0">'+rich(x.histo)+'</p>'+(grossLeading>=0?'<small>Before histology you favored '+safe(x.options[grossLeading]?.name||'—')+'.</small>':'')+'</div>')+
 (phase>=1?'<div style="margin:10px 0">'+(window.VPQ_NECROPSY_OWNER_PUBLISH?.casePhotoHTML?.(x.id,{onlyHistology:true})||'')+(histoSlots.length?'<details><summary style="cursor:pointer;font-size:12px;font-weight:750">🔬 Histology photo slots ('+histoSlots.length+')</summary><div style="font-size:12px;padding:5px 0">'+histoSlots.map(p=>'<p style="margin:5px 0">🔬 '+safe(p.label)+'</p>').join('')+'</div></details>':'')+'</div>':'')+
 (phase===1?'<button data-pathdiff-compare="1" style="width:100%;margin-top:10px;padding:12px;background:#dff1e5;border:1px solid #8abda0;border-radius:9px;font-weight:800">✓ Submit diagnosis · View comparisons</button>':'')+
 (leadHint?'<p role="alert" style="color:#99551c">Choose a leading diagnosis using the ☆ Lead button before submitting.</p>':'')+
 '</section>';
 const comparison=revealed?'<section style="border-top:2px solid #d4e2ee;margin-top:14px;padding-top:12px"><h4 style="margin:0 0 6px">4 · Compare your differentials</h4>'+
 '<p class="tiny">★ Green = strongest fit · Yellow = plausible, but key differences · Red = major contradictions. An orange outline marks an incorrect leading selection.</p>'+
 '<div style="max-width:100%;overflow-x:auto;border:1px solid #cfdaea;border-radius:9px"><table style="width:100%;min-width:680px;border-collapse:collapse;font-size:12px;line-height:1.4"><thead><tr style="background:#eaf1fa">'+['Differential','Supports','Against / what separates it','Histology discriminator'].map(t=>'<th style="text-align:left;padding:9px 8px;border-bottom:2px solid #c9d7e8">'+t+'</th>').join('')+'</tr></thead><tbody>'+
 x.options.map(o=>{const best=o.role==='best'||o.name===x.best,chosen=selected?.name===o.name,tier=best?'best':o.tier==='unlikely'?'unlikely':'possible';const bg=tier==='best'?'#e5f6e9':tier==='unlikely'?'#fff0ef':'#fff8da';const border=tier==='best'?'#64a778':tier==='unlikely'?'#d58a88':'#d6b75b';const repeated=String(o.supports||'').trim()===String(o.against||'').trim();const support=repeated?'Consider initially, then check distinguishing findings.':o.supports;const against=o.against&& !/^Compare competing causes using/i.test(o.against)?o.against:'Distinguish using lesion distribution, signalment and histology.';const hist=o.hist&&!/^Compare the distinguishing lesions described in the source rationale/i.test(o.hist)?o.hist:'Histologic distinction not specified in this case.';return '<tr style="background:'+bg+';border-left:4px solid '+border+';'+(chosen&&!best?'outline:2px solid #d58a36;outline-offset:-2px;':'')+'"><td style="vertical-align:top;padding:9px 8px;border-bottom:1px solid #d8e2ed;min-width:115px"><b>'+(best?'★ ':tier==='unlikely'?'✕ ':'◇ ')+safe(o.name)+'</b>'+(chosen?'<small style="display:block;margin-top:4px">Your lead</small>':'')+'</td><td style="vertical-align:top;padding:9px 8px;border-bottom:1px solid #d8e2ed">'+rich(support)+'</td><td style="vertical-align:top;padding:9px 8px;border-bottom:1px solid #d8e2ed">'+rich(against)+'</td><td style="vertical-align:top;padding:9px 8px;border-bottom:1px solid #d8e2ed">'+rich(hist)+'</td></tr>';}).join('')+'</tbody></table></div>'+
 '<div style="padding:12px;background:#f1f6fd;border-radius:10px;margin-top:10px"><b>Best-supported diagnosis:</b> '+safe(x.best)+
 (realMorph?'<p><b>Morphologic diagnosis:</b> '+rich(x.morph)+'</p>':'')+
 (x.mechanism?'<p><b>Pathogenesis / why this occurs:</b> '+rich(x.mechanism)+'</p>':'')+
 (x.tests&&!/does not supply|not yet supplied|refer to the linked lecture|not separately provided/i.test(x.tests)?'<p><b>Ancillary diagnostics / confirmation:</b> '+rich(x.tests)+'</p>':'')+
 '<small>'+safe(x.ref||'Pathology learning source')+'</small></div>'+
 (caseAtlasMatches(x).length?'<div class="buttonrow" style="margin-top:10px">'+caseAtlasMatches(x).map(({item},i)=>'<button data-pathdiff-case-atlas="'+i+'">📚 Review '+safe(item.title)+'</button>').join('')+'</div>':'')+
 (caseReward?.xp?'<p class="tiny">+'+caseReward.xp+' XP earned'+(caseReward.coins?' · +'+caseReward.coins+' coins':'')+'</p>':'')+
 (x.followup||followupSlots.length?'<details style="padding:10px;border:1px solid #b5cde1;border-radius:9px;margin-top:10px"><summary style="font-weight:800;cursor:pointer">📅 Follow-up and outcome (optional)</summary>'+(x.followup?'<p>'+rich(x.followup)+'</p>':'')+(window.VPQ_NECROPSY_OWNER_PUBLISH?.casePhotoHTML?.(x.id,{onlyFollowup:true})||'')+followupSlots.map(p=>'<p style="font-size:12px">📷 '+safe(p.label)+'</p>').join('')+'</details>':'')+'</section>':'';
 const resource='<details style="margin:13px 0;border:1px solid #ccdaeb;border-radius:9px;padding:10px"><summary style="font-weight:750;cursor:pointer">📚 Sources, lecture links & image management</summary>'+
 '<div class="buttonrow" style="margin-top:8px"><button data-pathdiff-exam7-lecture="'+safe(x.id)+'">Lecture '+safe(x.lecture)+'</button><button data-pathdiff-exam7-atlas="'+safe(x.id)+'">Specimen atlas</button><button data-pathdiff-edit-case="'+safe(x.id)+'">✏️ Edit & publish</button></div>'+
 (x.photoToAdd?'<p class="tiny">Suggested photograph: '+safe(x.photoToAdd)+'</p>':'')+(x.sourceArticleUrl?'<p><a href="'+safe(x.sourceArticleUrl)+'" target="_blank" rel="noopener noreferrer">Read original case article</a></p>':'')+'<p><a href="https://slides.davisthompsonfoundation.org/arkive?image=4" target="_blank" rel="noopener noreferrer">Explore Davis–Thompson Noah’s Arkive</a></p><small>Check image attribution and reuse rights before publishing.</small><p><small>'+safe(x.ref||'Source reference not specified')+'</small></p></details>';
 modal('🩺 Patient case · Lecture '+safe(x.lecture),
 '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:9px"><div class="buttonrow"><button data-pathdiff-list="1">← Back to cases</button><button data-pathdiff-prevcase="1" '+(position<=0?'disabled':'')+'>◀ Previous</button><button data-pathdiff-nextcase="1" '+(position>=sequence.length-1?'disabled':'')+'>Next ▶</button></div><div class="buttonrow"><button data-pathdiff-edit-case="'+safe(x.id)+'" style="font-weight:800;background:#e6f5e9;border:1px solid #7bb694">✏️ Edit & publish</button><button data-pathdiff-reset="1">↺ Restart</button></div></div>'+
 gross+'<div style="display:grid;grid-template-columns:minmax(0,1.55fr) minmax(240px,0.95fr);gap:14px;align-items:start" class="vpq-case-dual"><div style="min-width:0">'+main+'</div>'+imagePanel+'</div>'+
 comparison+extraQuestionHTML(x)+resource+
 '<div class="buttonrow" style="margin-top:12px"><button data-pathdiff-list="1">← Back to cases</button><button data-pathdiff-nextcase="1" '+(position>=sequence.length-1?'disabled':'')+'>Next patient →</button></div>');
}
function init(api){
 ui=api;
 window.VPQ_FLASHCARD_OWNER?.init?.(api.body,api.showModal);
 window.VPQ_FLASHCARD_OWNER?.load?.().catch(()=>{});
 if(api.body.__vpqNecroDifferentialInit)return;
 api.body.__vpqNecroDifferentialInit=true;
 api.body.addEventListener('click',ev=>{
 const button=ev.target.closest('[data-pathdiff-flash-flip],button');if(!button||!Object.keys(button.dataset).some(k=>k.startsWith('pathdiff')))return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const d=button.dataset;
 if(d.pathdiffListLecture!==undefined){filter=conditionLecture;caseExam=groupForLecture(conditionLecture)?.id||'all';roundsOnly=false;practiceMode='all';shuffledIds=[];return menu();}
 if(d.pathdiffListExam!==undefined){filter='all';caseExam=groupForLecture(conditionLecture)?.id||'all';roundsOnly=false;practiceMode='all';shuffledIds=[];return menu();}
 if(d.pathdiffEditCase!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.editor?.('case',d.pathdiffEditCase);
 if(d.pathdiffExtraAnswer!==undefined){if(extraAnswer<0){extraAnswer=Number(d.pathdiffExtraAnswer);extraOpen=true;return view()}return;}
 if(d.pathdiffExtraReset!==undefined){extraAnswer=-1;extraOpen=true;return view();}
 if(d.pathdiffNavleQuiz!==undefined)return window.VPQ_NECROPSY_QUIZ?.start?.(d.pathdiffNavleQuiz==='1'?null:d.pathdiffNavleQuiz);
 if(d.pathdiffExam7Rounds!==undefined)return openExam7Rounds(d.pathdiffExam7Rounds==='all'?null:d.pathdiffExam7Rounds);
 if(d.pathdiffAllRounds!==undefined){roundsOnly=false;caseExam='all';practiceMode='all';filter='all';shuffledIds=[];return menu();}
 if(d.pathdiffExam7Lecture!==undefined)return openExam7Lecture(d.pathdiffExam7Lecture);
 if(d.pathdiffExam7Atlas!==undefined){const x=allCases().find(c=>c.id===d.pathdiffExam7Atlas);if(!x)return view();const specimen=exam7Specimen(x);return specimen?window.VPQ_PATH_EXAM7?.openCard?.(specimen.id):window.VPQ_PATH_EXAM7?.studyLecture?.(x.lecture);}
 if(d.pathdiffStudyStart!==undefined)return startFlash('lecture');
 if(d.pathdiffShowCases!==undefined){const section=api.body.querySelector('#vpq-necro-case-list');if(section)section.open=true;section?.scrollIntoView?.({block:'start',behavior:'smooth'});return;}
 if(d.pathdiffLibrary!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.photoLibrary?.();
 if(d.pathdiffUmbrella!==undefined)return umbrellaMenu();
 if(d.pathdiffUmbrellaOpen!==undefined){umbrellaCurrent=d.pathdiffUmbrellaOpen;return umbrellaDetail();}
 if(d.pathdiffCreate!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.newCaseEditor?.();
 if(d.pathdiffCreateTopic!==undefined){const lesson=lectureConditions()[conditionChosen];return window.VPQ_NECROPSY_OWNER_PUBLISH?.newCaseEditor?.({title:lesson?.title||'',lecture:conditionLecture});}
 if(d.pathdiffAddCondition!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.newConditionEditor?.(conditionLecture);
 if(d.pathdiffPhotoLecture!==undefined)return window.VPQ_NECROPSY_HANDBOOK?.openLecture?.(conditionLecture);
 if(d.pathdiffAlpha!==undefined){
  const target=Array.from(api.body.querySelectorAll('[data-pathdiff-alpha-section]')).find(x=>x.dataset.pathdiffAlphaSection===d.pathdiffAlpha);
  if(target){target.scrollIntoView({behavior:'smooth',block:'start'});}
  return;
 }
 if(d.pathdiffConditionIndex!==undefined){selectedExam=groupForLecture(conditionLecture)?.id||'7';return conditionIndex()}
 if(d.pathdiffSelectExam!==undefined){selectedExam=d.pathdiffSelectExam;const group=EXAM_GROUPS.find(x=>x.id===selectedExam);if(group)conditionLecture=String(group.start);conditionGap='all';conditionTopicMode='all';return conditionIndex();}
 if(d.pathdiffLectureSpecimens!==undefined)return window.VPQ_PATH_EXAM7?.studyLecture?.(conditionLecture);
 if(d.pathdiffLectureCases!==undefined){roundsOnly=false;caseExam=groupForLecture(conditionLecture)?.id||'all';practiceMode='all';filter=conditionLecture;shuffledIds=[];menu();const section=api.body.querySelector('#vpq-necro-case-list');if(section)section.open=true;return;}
 if(d.pathdiffLectureDdx!==undefined){roundsOnly=false;caseExam=groupForLecture(conditionLecture)?.id||'all';practiceMode='DDx';filter=conditionLecture;shuffledIds=[];menu();const section=api.body.querySelector('#vpq-necro-case-list');if(section)section.open=true;return;}
 if(d.pathdiffConditionLecture!==undefined){conditionLecture=d.pathdiffConditionLecture;selectedExam=groupForLecture(conditionLecture)?.id||selectedExam;const hasDisease=((window.VPQ_PATH_LECTURE_LEARN||{})[conditionLecture]?.sections||[]).some(x=>x.diseaseAtlas===true);conditionTopicMode=Number(conditionLecture)>=50&&Number(conditionLecture)<=66&&hasDisease?'disease':'all';return conditionIndex()}
 if(d.pathdiffTopicMode!==undefined){conditionTopicMode=d.pathdiffTopicMode;return conditionIndex()}
 if(d.pathdiffGap!==undefined){conditionGap=d.pathdiffGap;return conditionIndex()}
 if(d.pathdiffConditionOpen!==undefined){conditionChosen=Number(d.pathdiffConditionOpen);return conditionDetail()}
 if(d.pathdiffConditionBack!==undefined)return conditionIndex();
 if(d.pathdiffConditionRename!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.renameConditionEditor?.(conditionLecture,conditionChosen);
 if(d.pathdiffRecallStart!==undefined)return startFlash('topic');
 if(d.pathdiffFlashLecture!==undefined)return startFlash('lecture');
 if(d.pathdiffFlashFoundations!==undefined){conditionLecture='67';return startFlash('foundation')}
 if(d.pathdiffFlashEdit!==undefined)return window.VPQ_FLASHCARD_OWNER?.editor?.('pathology',conditionLecture,flashCards[flashIndex],()=>flashView());
 if(d.pathdiffFlashNew!==undefined)return window.VPQ_FLASHCARD_OWNER?.editor?.('pathology',conditionLecture,null,()=>flashView());
 if(d.pathdiffFlashSpecimens!==undefined)return window.VPQ_PATH_EXAM7?.studyLecture?.(conditionLecture);
 if(d.pathdiffFlashCases!==undefined){filter=conditionLecture;menu();const section=api.body.querySelector('#vpq-necro-case-list');if(section)section.open=true;return;}
 if(d.pathdiffFlashFlip!==undefined){flashFace=!flashFace;return flashView()}
 if(d.pathdiffFlashPrev!==undefined){flashIndex=Math.max(0,flashIndex-1);flashFace=false;return flashView()}
 if(d.pathdiffFlashNext!==undefined){const c=flashCards[flashIndex];if(c&&!flashFace)saveFlashProgress(c.id,true);flashIndex+=1;flashComplete=flashIndex>=flashCards.length;flashFace=false;return flashView()}
 if(d.pathdiffFlashRate!==undefined){if(flashCards[flashIndex])saveFlashProgress(flashCards[flashIndex].id,d.pathdiffFlashRate==='again');flashIndex+=1;flashComplete=flashIndex>=flashCards.length;flashFace=false;return flashView()}
 if(d.pathdiffFlashReview!==undefined)return startFlash(flashScope,true);
 if(d.pathdiffFlashAll!==undefined)return startFlash(flashScope,false);
 if(d.pathdiffFlashBack!==undefined)return flashScope==='topic'?conditionDetail():conditionIndex();
 if(d.pathdiffRecallAll!==undefined){recallShow=false;return recallView()}
 if(d.pathdiffRecallReveal!==undefined){recallShow=true;return recallView()}
 if(d.pathdiffRecallReset!==undefined){recallShow=false;return recallView()}
 if(d.pathdiffRecallBack!==undefined)return conditionDetail();
 if(d.pathdiffPublish!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.editor('case',d.pathdiffPublish);
 if(d.pathdiffZoom!==undefined)return zoomCaseImage(d.pathdiffZoom);
  if(d.pathdiffZoomLocal!==undefined)return zoomCaseImage(photoStore()[d.pathdiffZoomLocal]);
  if(d.pathdiffCaseAtlas!==undefined)return openCaseAtlas(Number(d.pathdiffCaseAtlas));
  if(d.pathdiffPrevcase!==undefined)return moveCase(-1);
  if(d.pathdiffNextcase!==undefined)return moveCase(1);
  if(d.pathdiffShuffle!==undefined)return shuffleCases();
  if(d.pathdiffList!==undefined)return menu();
 if(d.pathdiffFilter!==undefined){filter=d.pathdiffFilter;return menu()}
 if(d.pathdiffOpen!==undefined)return prepareCase(d.pathdiffOpen)
 if(d.pathdiffReturn!==undefined)return window.VPQ_PATH_EXAM7?.start('histo');
 if(d.pathdiffReset!==undefined){morphDraft='';extraAnswer=-1;extraOpen=false;phase=0;leading=-1;grossLeading=-1;leadHint=false;shortlist=[];caseReward=null;const currentRecord=allCases().find(x=>x.id===current);optionOrder=shuffleArray((currentRecord?.options||[]).map((_,i)=>i));return view()}
 if(d.pathdiffSetLead!==undefined){const i=Number(d.pathdiffSetLead);if(phase<2&&i>=0&&i<optionOrder.length){leading=i;leadHint=false;return view()}return;}
 if(d.pathdiffToggle!==undefined){const i=Number(d.pathdiffToggle);shortlist=shortlist.includes(i)?shortlist.filter(v=>v!==i):[...shortlist,i];return view()}
 if(d.pathdiffHisto!==undefined){if(phase===0)grossLeading=leading;phase=Math.max(phase,1);return view()}
 if(d.pathdiffCompare!==undefined){if(phase<1)return;if(leading<0){leadHint=true;return view()}leadHint=false;const base=allCases().find(v=>v.id===current);const record={...base,...(window.VPQ_NECROPSY_OWNER_PUBLISH?.getText?.('case',current)||{})};const originalChoice=record.options?.[optionOrder[leading]];const correct=originalChoice?.role==='best'||String(originalChoice?.name||'').trim().toLowerCase()===String(record.best||'').trim().toLowerCase();if(phase<2&&typeof ui?.awardQuestion==='function')caseReward=ui.awardQuestion('necropsy-differential',String(current),correct);phase=2;return view()}
 if(d.pathdiffRemove!==undefined){updatePhoto(d.pathdiffRemove,'');return view()}
 },true);
 api.body.addEventListener('keydown',ev=>{if((ev.key==='Enter'||ev.key===' ')&&ev.target?.dataset?.pathdiffFlashFlip!==undefined){ev.preventDefault();flashFace=!flashFace;flashView()}},true);
 api.body.addEventListener('change',ev=>{
 const d=ev.target?.dataset;
 if(d?.pathdiffMenuExam!==undefined){const group=EXAM_GROUPS.find(g=>g.id===ev.target.value);if(group){selectedExam=group.id;conditionLecture=String(group.start);filter=conditionLecture;caseExam=group.id;roundsOnly=false;practiceMode='all';shuffledIds=[];menu();}return;}
 if(d?.pathdiffMenuLecture!==undefined){conditionLecture=String(ev.target.value);selectedExam=groupForLecture(conditionLecture)?.id||'7';filter=conditionLecture;caseExam=selectedExam;roundsOnly=false;practiceMode='all';shuffledIds=[];return menu();}

 if(d?.pathdiffLeadingSelect!==undefined){leading=Number(ev.target.value);leadHint=false;return view();}
 if(d?.pathdiffMorph!==undefined){morphDraft=String(ev.target.value||'').slice(0,1200);return;}
 if(d?.pathdiffStudyLecture!==undefined){conditionLecture=String(ev.target.value||'68');return menu();}
 if(d?.pathdiffCaseExam!==undefined){caseExam=String(ev.target.value);roundsOnly=false;filter='all';shuffledIds=[];menu();api.body.querySelector('#vpq-necro-case-list')?.setAttribute('open','');return;}
 if(d?.pathdiffPracticeMode!==undefined){practiceMode=String(ev.target.value);shuffledIds=[];menu();api.body.querySelector('#vpq-necro-case-list')?.setAttribute('open','');return;}
 if(d?.pathdiffCaseFilter!==undefined){filter=String(ev.target.value||'all');shuffledIds=[];optionOrder=[];menu();const section=api.body.querySelector('#vpq-necro-case-list');if(section)section.open=true;return;}
 if(!d||d.pathdiffPhoto===undefined)return;
 const input=ev.target,file=input.files?.[0];if(!file||!file.type.startsWith('image/'))return;
 const reader=new FileReader();
 reader.onload=()=>{const img=new Image();img.onload=()=>{const k=Math.min(1,780/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*k));c.height=Math.max(1,Math.round(img.height*k));c.getContext('2d').drawImage(img,0,0,c.width,c.height);const ok=updatePhoto(d.pathdiffPhoto,c.toDataURL('image/jpeg',0.67));if(ok)view();else modal('Image too large','<p>Browser storage is full. Please resize the image and try again.</p><button data-pathdiff-list="1">Return to cases</button>')};img.src=String(reader.result)};reader.readAsDataURL(file);
 },true);
}
function openCase(id){const found=allCases().find(x=>x.id===id);if(found){conditionLecture=String(found.lecture);selectedExam=groupForLecture(found.lecture)?.id||'7';caseExam=selectedExam;filter=conditionLecture;practiceMode='all';roundsOnly=false;shuffledIds=[];return prepareCase(id)}return menu()}
function draftPhoto(id){return photoStore()[id]||''}
function draftText(id){return {}}
return {init,start,cases:data,openCase,openExam7Rounds:(lecture)=>openExam7Rounds(lecture),exam7Matches,draftPhoto,draftText,openConditionInventory:conditionIndex,openLectureFlashcards:(api,lecture)=>{ui=api;conditionLecture=String(lecture);startFlash('lecture')},showConditions:(lecture)=>{if(lecture)conditionLecture=String(lecture);conditionIndex()}};
})();
