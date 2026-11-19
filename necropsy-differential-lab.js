/* Necropsy Differential Diagnosis Center: use gross lesions, signalment and histology to rank etiologies. */
window.VPQ_NECROPSY_DIFFERENTIAL_LAB=(function(){
'use strict';
const data=window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[];
function allCases(){return [...data,...(window.VPQ_NECROPSY_OWNER_PUBLISH?.getCustomCases?.()||[])]}
const KEY='vpq-necropsy-differential-local-images-v1';
let ui=null,filter='all',current=null,phase=0,leading=-1,grossLeading=-1,leadHint=false,shortlist=[],showWhy=false,caseReward=null,shuffledIds=[],optionOrder=[];
const rich=v=>window.VPQ_PATH_RICH_TEXT?.render?.(v)||safe(v);
const safe=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function photoStore(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function updatePhoto(id,image){const state=photoStore();if(image)state[id]=image;else delete state[id];try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){return false}}
function modal(title,body){ui?.showModal(title,body)}
function start(api,chosen='all'){
 ui=api;filter=chosen;menu();
 const owner=window.VPQ_NECROPSY_OWNER_PUBLISH;
 owner?.load?.().then(()=>{
  if(ui===api&&ui.body.querySelector('[data-pathdiff-filter]')&&!ui.body.querySelector('[data-necro-create-submit]'))menu();
 }).catch(()=>{});
}
function shuffleArray(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function caseSequence(){
 const filtered=allCases().filter(x=>filter==='all'||x.lecture===filter);
 // Start in a randomized order, rather than showing cases in source/best-first order.
 // Keep that order stable while reviewing an individual session.
 const ids=filtered.map(x=>x.id),existing=new Set(shuffledIds);
 if(!shuffledIds.length)shuffledIds=shuffleArray(ids);
 else if(ids.some(id=>!existing.has(id)))shuffledIds=[...shuffledIds,...shuffleArray(ids.filter(id=>!existing.has(id)))];
 const order=new Map(shuffledIds.map((id,i)=>[id,i]));
 return filtered.sort((a,b)=>(order.get(a.id)??Infinity)-(order.get(b.id)??Infinity));
}
function shuffleCases(){shuffledIds=shuffleArray(allCases().filter(x=>filter==='all'||x.lecture===filter).map(x=>x.id));current=null;phase=0;leading=-1;grossLeading=-1;shortlist=[];leadHint=false;caseReward=null;optionOrder=[];return menu();}
function prepareCase(id){current=id;phase=0;leading=-1;grossLeading=-1;leadHint=false;shortlist=[];caseReward=null;const found=allCases().find(x=>x.id===id);optionOrder=shuffleArray((found?.options||[]).map((_,i)=>i));return view();}
function menu(){
 const matched=caseSequence();
 const counts=[...Array.from({length:36},(_,i)=>String(i+31)),...Array.from({length:13},(_,i)=>String(i+67))];
 const selectedStudy=counts.includes(conditionLecture)?conditionLecture:'68';
 modal('🧩 Necropsy · Study & Differential Center',
 '<div style="padding:10px 12px;border:1px solid #c4d6e9;background:#f3f8ff;border-radius:11px;margin-bottom:11px"><b>How would you like to practice?</b><p style="font-size:12px;margin:5px 0 0">Learn the key findings with flashcards, identify lesions in the gross atlas, then solve realistic differential cases.</p></div>'+
 '<div style="background:#f2f8f3;border:1px solid #abd4b9;border-radius:12px;padding:12px;margin:9px 0">'+
 '<b style="display:block;margin-bottom:8px;font-size:15px">🧠 Quick flashcards · 15 questions</b>'+
 '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">'+
 '<label style="font-size:12px;font-weight:700;flex:1;min-width:115px">Choose lecture<select data-pathdiff-study-lecture="1" style="display:block;width:100%;font-size:14px;padding:9px;margin-top:4px;border:1px solid #a9c5b5;border-radius:8px;background:#fff">'+counts.map(n=>'<option value="'+n+'"'+(selectedStudy===n?' selected':'')+'>Lecture '+n+'</option>').join('')+'</select></label>'+
 '<button data-pathdiff-study-start="1" style="flex:2;min-width:170px;padding:13px 10px;background:#d5f0df;border:1px solid #7ebc96;border-radius:9px;font-size:14px;font-weight:850">▶ Start flashcards</button></div>'+
 '<small style="display:block;margin-top:7px;color:#486354">Flip → Got it / Need practice → Review difficult cards</small>'+
 (selectedStudy==='67'?'<button data-pathdiff-flash-foundations="1" style="display:block;margin-top:9px;font-size:12px">📚 Focus: brain barriers & neuropathology vocabulary</button>':'')+'</div>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin:10px 0">'+
 '<button data-pathdiff-return="1" style="padding:12px;min-height:56px;text-align:left;border-radius:10px"><b>🔬 Gross & histology atlas</b><small style="display:block">Recognize the lesion</small></button>'+
 '<button data-pathdiff-show-cases="1" style="padding:12px;min-height:56px;text-align:left;border-radius:10px"><b>🧩 Differential cases</b><small style="display:block">Compare possible causes</small></button></div>'+
 '<details style="margin:8px 0 12px;border:1px solid #d0ddec;border-radius:10px;padding:9px 11px"><summary style="cursor:pointer;font-size:13px;font-weight:750">📚 More tools · lecture notes, patterns, photos & editing</summary>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:7px;margin-top:10px">'+
 '<button data-pathdiff-condition-index="1" style="font-size:12px">📖 Full lecture notes & disease inventory</button>'+
 '<button data-pathdiff-umbrella="1" style="font-size:12px">Pattern / umbrella atlas</button>'+
 '<button data-pathdiff-library="1" style="font-size:12px">Published pathology photo library</button>'+
 '<button data-pathdiff-create="1" style="font-size:12px">➕ Create / publish differential card</button>'+
 '<button data-modalaction="necroPatientPractice" style="font-size:12px">Original patient-style questions</button></div></details>'+
 '<details id="vpq-necro-case-list" style="margin:12px 0"><summary style="font-size:14px;font-weight:800;cursor:pointer;padding:8px 0">🧩 Browse differential practice cases ('+matched.length+')</summary>'+
 '<label style="display:block;font-size:12px;margin-bottom:7px">Filter cases by lecture<select data-pathdiff-case-filter="1" style="display:block;width:100%;max-width:240px;font-size:13px;padding:8px;margin-top:4px;border:1px solid #bdcde1;border-radius:8px;background:white">'+
 ['all',...counts].map(n=>'<option value="'+n+'"'+(filter===n?' selected':'')+'>'+(n==='all'?'All lectures':'Lecture '+n)+'</option>').join('')+'</select></label>'+
 '<p class="tiny" style="margin:6px 0">'+matched.length+' cases · Select one to compare signalment, gross findings, histology and etiologies.</p>'+
 '<div class="buttonrow"><button data-pathdiff-shuffle="1" style="background:#e9f3ff;font-weight:800">🔀 Shuffle cases</button><small>Cases are randomized automatically; shuffle again for a new order. Answer choices also change on restart. Rewards remain saved.</small></div>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">'+matched.map((x,i)=>'<button data-pathdiff-open="'+safe(x.id)+'" style="text-align:left;padding:10px;border:1px solid #b7cce5;border-radius:10px;background:#fff"><b>🔬 Mystery case '+String(i+1).padStart(2,'0')+'</b><small style="display:block;margin-top:5px">Lecture '+safe(x.lecture)+' · Open to review history and gross findings</small></button>').join('')+'</div></details>');
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
const LECTURES=[...Array.from({length:36},(_,i)=>String(i+31)),...Array.from({length:13},(_,i)=>String(i+67))];
const CASE_MATCH={
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
 return allCases().filter(c=>c.lecture===lecture&&((CASE_MATCH[c.id]||[]).some(alias=>t.includes(norm(alias)))||((c.id.startsWith('custom-')||c.id.startsWith('n3'))&&((norm(c.title).includes(t)&&t.length>8)||(t.includes(norm(c.best))&&norm(c.best).length>8)||(norm(c.morph).includes(t)&&t.length>12)))));
}
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
 '<p class="tiny">Coverage audit: <b>'+total+' lecture topics</b> across available pathology lectures (including Exam 3 urinary L31–35 and hepatic L36–40). Topics include normal anatomy and general principles as well as individual diseases; they are not all distinct diagnoses. A lecture note does NOT imply a dedicated case or photograph.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(56px,1fr));gap:5px;margin:9px 0">'+summary.map(v=>'<button data-pathdiff-condition-lecture="'+v.lecture+'" aria-pressed="'+(conditionLecture===v.lecture?'true':'false')+'" style="padding:7px 5px;font-size:12px">L'+v.lecture+'<small style="display:block;font-size:10px">'+v.teaching+' topics</small></button>').join('')+'</div>'+
 '<div style="background:#f3f7fc;border:1px solid #cbdbea;border-radius:9px;padding:10px;margin:8px 0"><b>'+safe((window.VPQ_PATH_LECTURE_LEARN||{})[conditionLecture]?.title||'Lecture '+conditionLecture)+'</b><p style="font-size:12px;margin:5px 0">Lecture topics: '+row.teaching+' · Matched specimen cards: '+row.specimens+' · Matched differential cases: '+row.cases+' · Attached image references: '+row.embedded+'</p><small>Counts are conservatively matched by case mapping/title, not a certified complete disease audit. External links without an embedded image are not counted as attached images.</small></div>'+
 '<div class="buttonrow"><button data-pathdiff-condition-lecture="31" style="background:#eaf6ef;font-weight:800">🫘 Urinary Exam 3 · L31–35</button><button data-pathdiff-condition-lecture="36" style="background:#f9eedd;font-weight:800">🫀 Hepatic Exam 3 · L36–40</button><button data-pathdiff-condition-lecture="41" style="background:#efe9ff;font-weight:800">🧪 Pancreas · L41</button></div>'+
 '<div class="buttonrow"><button data-pathdiff-condition-lecture="50" style="background:#eef6ff;font-weight:800">❤️ Exam 5 · Cardiac L50–53</button><button data-pathdiff-condition-lecture="54" style="background:#e8f5f8;font-weight:800">🫁 Exam 5 · Respiratory L54–58</button></div>'+
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
 '<div role="button" tabindex="0" data-pathdiff-flash-flip="1" title="Flip flashcard" aria-label="Flip flashcard to '+(flashFace?'question':'answer')+'" style="cursor:pointer;position:relative;border:1px solid #bbcae1;border-radius:18px;background:linear-gradient(145deg,#ffffff 5%,#eef5ff 100%);box-shadow:0 7px 22px rgba(44,62,100,.09);padding:clamp(16px,4vw,30px);min-height:250px;display:flex;flex-direction:column;justify-content:center;gap:14px;margin:12px 0;text-align:center">'+
 '<div style="color:#5a7296;font-size:11px;text-transform:uppercase;letter-spacing:.11em;font-weight:850">'+(flashFace?'ANSWER':'QUESTION')+' · '+(c.curated?'Focused recall':'Lecture concept')+'</div>'+
 '<div style="font-size:12px;color:#576c87">L'+safe(conditionLecture)+' · '+safe(c.title)+'</div>'+
 (flashFace?
  '<p style="font-size:clamp(17px,2.5vw,21px);line-height:1.5;margin:4px 0;font-weight:750;color:#25385b">'+rich(c.answer)+'</p>'+
  (c.why?'<div style="text-align:left;border-top:1px solid #cedbec;padding-top:12px;font-size:13px"><b>WHY it matters</b><p>'+rich(c.why)+'</p></div>':''):
  '<p style="font-size:clamp(18px,2.5vw,23px);line-height:1.45;font-weight:800;color:#263a5d;margin:10px 0">'+safe(c.prompt)+'</p><small style="color:#7887a1">Recall your answer, then flip the card.</small>')+
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
 conditionLecture=String(base.lecture);conditionChosen=match.i;return conditionDetail();
}
function view(){
 const baseCase=allCases().find(v=>v.id===current);if(!baseCase)return menu();
 const source={...baseCase,...(window.VPQ_NECROPSY_OWNER_PUBLISH?.getText?.('case',current)||{})};
 if(optionOrder.length!==source.options?.length)optionOrder=shuffleArray((source.options||[]).map((_,i)=>i));
 const x={...source,options:optionOrder.map(i=>source.options[i])};
 const revealed=phase>=2;
  const sequence=caseSequence(),position=sequence.findIndex(c=>c.id===current);
 const opted=leading>=0?x.options[leading]:null;
 modal('🔬 Differential case · L'+safe(x.lecture)+' · '+(revealed?safe(x.title):'Mystery case '+String(position+1).padStart(2,'0')),
 '<div class="buttonrow"><button data-pathdiff-list="1">← All differential cases</button><button data-pathdiff-shuffle="1">🔀 Shuffle cases</button><button data-pathdiff-prevcase="1" '+(position<=0?'disabled':'')+'>← Previous case</button><span style="align-self:center;font-size:12px">Case '+(position+1)+' of '+sequence.length+'</span><button data-pathdiff-nextcase="1" '+(position>=sequence.length-1?'disabled':'')+'>Next case →</button><button data-pathdiff-reset="1">↺ Restart case</button></div>'+
 '<div style="background:#f1f7ff;border-left:4px solid #7798cb;padding:10px;border-radius:8px;margin:10px 0"><b>'+safe(x.species)+' — presenting history</b><p>'+rich(x.history)+'</p><b>Gross lesion / localization:</b> '+rich(x.gross)+'</div>'+
 '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,300px);gap:12px;align-items:start;max-width:100%;overflow-wrap:anywhere"><div>'+
 '<h4 style="margin:4px 0">1. Build your differential list</h4><p class="tiny">Select every reasonable possibility. More than one diagnosis may fit early findings.</p>'+
 x.options.map((o,i)=>'<button data-pathdiff-toggle="'+i+'" aria-pressed="'+shortlist.includes(i)+'" style="display:block;width:100%;text-align:left;margin:6px 0;padding:10px;border:2px solid '+(shortlist.includes(i)?'#4784b5':'#dbe4ef')+';background:'+(shortlist.includes(i)?'#ecf6ff':'#fff')+';border-radius:10px">'+(shortlist.includes(i)?'☑ ':'☐ ')+safe(o.name)+'</button>').join('')+
 '<h4 style="margin:14px 0 5px">2. Choose the most likely diagnosis</h4><p class="tiny">Pick your leading possibility based on the evidence currently visible.</p>'+
 '<select id="pathdiff-lead" data-pathdiff-leading-select="1" style="width:100%;padding:9px;border:1px solid #a9bed5;border-radius:9px"><option value="-1">Choose a leading diagnosis...</option>'+x.options.map((o,i)=>'<option value="'+i+'"'+(leading===i?' selected':'')+'>'+safe(o.name)+'</option>').join('')+'</select>'+
 (leadHint?'<p style="color:#944b20;font-size:12px;font-weight:750">Choose your leading diagnosis from the dropdown before comparing the answers.</p>':'')+
 '<div class="buttonrow" style="margin:9px 0"><button data-pathdiff-histo="1">'+(phase===0?'🔬 Reveal histology clue':'🔬 Histology revealed ✓')+'</button>'+(phase>=1?'<button data-pathdiff-compare="1">📋 Compare all etiologies</button>':'')+'</div>'+
 (phase>=1?'<div style="background:#f5eefc;border:1px solid #d8c9ed;padding:12px;border-radius:10px"><b>3. Histology revealed</b>'+(grossLeading>=0?'<p class="tiny"><b>Your initial gross-based leader:</b> '+safe(x.options[grossLeading]?.name||'—')+'</p>':'')+'<p>'+rich(x.histo)+'</p><small>Now reconsider whether the differentials remain equally plausible.</small></div>':'')+
 '</div><div>'+(window.VPQ_NECROPSY_OWNER_PUBLISH?.casePhotoHTML?.(x.id)||'')+sourcedPhotos(x)+photoHTML(x)+'</div></div>'+
 (revealed?'<div style="margin-top:14px;border-top:2px solid #cbd9e9;padding-top:10px"><h4>4. Evidence-weighted differential comparison</h4><p class="tiny"><b>Case title unlocked:</b> '+safe(x.title)+'</p><p>'+(opted?(opted.name===x.best?'✅ Your leading diagnosis matched the best-supported etiology.':'Your initial leader was <b>'+safe(opted.name)+'</b>. Compare the evidence below and revise your conclusion.'):'No leading diagnosis selected. Compare the possibilities below before returning to the case.')+'</p>'+
 '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Differential</th><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Supports</th><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Makes less likely / limitation</th><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Histology distinction</th></tr></thead><tbody>'+x.options.map(o=>'<tr><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6"><b>'+safe(o.name)+'</b>'+(o.role==='best'?' ★':'')+'</td><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6">'+rich(o.supports)+'</td><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6">'+rich(o.against)+'</td><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6">'+rich(o.hist)+'</td></tr>').join('')+'</tbody></table></div>'+
 (grossLeading>=0?'<p style="font-size:12px"><b>Reasoning progression:</b> Before histology you favored '+safe(x.options[grossLeading]?.name||'—')+'. After histology you selected '+safe(opted?.name||'—')+'. '+(grossLeading!==leading?'You revised your leading differential after seeing additional evidence.':'You kept your original leading differential.')+'</p>':'')+
 '<div style="background:#eef8f0;border:1px solid #b8d7bf;border-radius:12px;padding:11px;margin-top:12px"><b>Best-supported etiology:</b> '+safe(x.best)+'<p><b>Morphologic diagnosis:</b> '+rich(x.morph)+'</p><p><b>Why it happens:</b> '+rich(x.mechanism)+'</p><p><b>What confirms it / next tests:</b> '+rich(x.tests)+'</p><small>Grounded in '+safe(x.ref)+'. This is an educational differential, not a definitive diagnosis from a simulated history.</small></div></div>':'')+
 (revealed&&caseAtlasMatches(x).length?'<div style="margin:10px 0;padding:10px;border:1px solid #cbdbea;border-radius:10px"><b>📚 Review this case in the disease atlas</b><p class="tiny">Open the related lesson for species, gross lesions, histology, mechanism and flashcards.</p><div class="buttonrow">'+caseAtlasMatches(x).map(({item},i)=>'<button data-pathdiff-case-atlas="'+i+'">🔬 '+safe(item.title)+'</button>').join('')+'</div></div>':'')+
 (revealed?'<p style="font-size:12px;margin:8px 0"><b>🏅 Study rewards:</b> '+(caseReward?.xp?('+'+caseReward.xp+' XP'+(caseReward.coins?' · +'+caseReward.coins+' coins':'')+' earned!'):caseReward?.reason==='already-mastered'?'Previously mastered — rewards saved.':caseReward?.reason==='incorrect'?'Review and retry this diagnosis for XP.':'First correct diagnosis earns 10 XP; coins accrue through study milestones.')+'</p>':'')+
'<div class="buttonrow" style="margin-top:12px"><button data-pathdiff-prevcase="1" '+(position<=0?'disabled':'')+'>← Previous case</button><button data-pathdiff-list="1">All cases</button><button data-pathdiff-nextcase="1" '+(position>=sequence.length-1?'disabled':'')+'>Next case →</button><button data-pathdiff-reset="1">Try without clues again</button></div>');
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
 if(d.pathdiffConditionIndex!==undefined){return conditionIndex()}
 if(d.pathdiffConditionLecture!==undefined){conditionLecture=d.pathdiffConditionLecture;const hasDisease=((window.VPQ_PATH_LECTURE_LEARN||{})[conditionLecture]?.sections||[]).some(x=>x.diseaseAtlas===true);conditionTopicMode=Number(conditionLecture)>=50&&Number(conditionLecture)<=66&&hasDisease?'disease':'all';return conditionIndex()}
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
 if(d.pathdiffReset!==undefined){phase=0;leading=-1;grossLeading=-1;leadHint=false;shortlist=[];caseReward=null;const currentRecord=allCases().find(x=>x.id===current);optionOrder=shuffleArray((currentRecord?.options||[]).map((_,i)=>i));return view()}
 if(d.pathdiffToggle!==undefined){const i=Number(d.pathdiffToggle);shortlist=shortlist.includes(i)?shortlist.filter(v=>v!==i):[...shortlist,i];return view()}
 if(d.pathdiffHisto!==undefined){if(phase===0)grossLeading=leading;phase=Math.max(phase,1);return view()}
 if(d.pathdiffCompare!==undefined){if(phase<1)return;const el=api.body.querySelector('#pathdiff-lead');if(el)leading=Number(el.value);if(leading<0){leadHint=true;return view()}leadHint=false;const base=allCases().find(v=>v.id===current);const record={...base,...(window.VPQ_NECROPSY_OWNER_PUBLISH?.getText?.('case',current)||{})};const originalChoice=record.options?.[optionOrder[leading]];const correct=originalChoice?.role==='best'||String(originalChoice?.name||'').trim().toLowerCase()===String(record.best||'').trim().toLowerCase();if(phase<2&&typeof ui?.awardQuestion==='function')caseReward=ui.awardQuestion('necropsy-differential',String(current),correct);phase=2;return view()}
 if(d.pathdiffRemove!==undefined){updatePhoto(d.pathdiffRemove,'');return view()}
 },true);
 api.body.addEventListener('keydown',ev=>{if((ev.key==='Enter'||ev.key===' ')&&ev.target?.dataset?.pathdiffFlashFlip!==undefined){ev.preventDefault();flashFace=!flashFace;flashView()}},true);
 api.body.addEventListener('change',ev=>{
 const d=ev.target?.dataset;
 if(d?.pathdiffLeadingSelect!==undefined){leading=Number(ev.target.value);leadHint=false;return;}
 if(d?.pathdiffStudyLecture!==undefined){conditionLecture=String(ev.target.value||'68');return menu();}
 if(d?.pathdiffCaseFilter!==undefined){filter=String(ev.target.value||'all');shuffledIds=[];optionOrder=[];menu();const section=api.body.querySelector('#vpq-necro-case-list');if(section)section.open=true;return;}
 if(!d||d.pathdiffPhoto===undefined)return;
 const input=ev.target,file=input.files?.[0];if(!file||!file.type.startsWith('image/'))return;
 const reader=new FileReader();
 reader.onload=()=>{const img=new Image();img.onload=()=>{const k=Math.min(1,780/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*k));c.height=Math.max(1,Math.round(img.height*k));c.getContext('2d').drawImage(img,0,0,c.width,c.height);const ok=updatePhoto(d.pathdiffPhoto,c.toDataURL('image/jpeg',0.67));if(ok)view();else modal('Image too large','<p>Browser storage is full. Please resize the image and try again.</p><button data-pathdiff-list="1">Return to cases</button>')};img.src=String(reader.result)};reader.readAsDataURL(file);
 },true);
}
function openCase(id){if(allCases().some(x=>x.id===id)){current=id;return view()}return menu()}
function draftPhoto(id){return photoStore()[id]||''}
function draftText(id){return {}}
return {init,start,cases:data,openCase,draftPhoto,draftText,openConditionInventory:conditionIndex,showConditions:(lecture)=>{if(lecture)conditionLecture=String(lecture);conditionIndex()}};
})();
