/* Necropsy Differential Diagnosis Center: use gross lesions, signalment and histology to rank etiologies. */
window.VPQ_NECROPSY_DIFFERENTIAL_LAB=(function(){
'use strict';
const data=window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[];
function allCases(){return [...data,...(window.VPQ_NECROPSY_OWNER_PUBLISH?.getCustomCases?.()||[])]}
const KEY='vpq-necropsy-differential-local-images-v1';
let ui=null,filter='all',current=null,phase=0,leading=-1,shortlist=[],showWhy=false;
const safe=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function photoStore(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function updatePhoto(id,image){const state=photoStore();if(image)state[id]=image;else delete state[id];try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){return false}}
function modal(title,body){ui?.showModal(title,body)}
function start(api,chosen='all'){ui=api;filter=chosen;menu()}
function menu(){
 const matched=allCases().filter(x=>filter==='all'||x.lecture===filter);
 const counts=[...new Set(allCases().map(x=>x.lecture))];
 modal('🧩 Necropsy Differential Diagnosis Center',
 '<div style="padding:11px;border:1px solid #b7d1eb;background:#f2f8ff;border-radius:12px"><b>Think like a pathologist:</b> signalment and history → anatomic location/gross pattern → shortlist differentials → histology → leading etiology and next test. These are <b>simulated teaching cases</b>, not photographs of real patients.</div>'+
 '<div class="buttonrow" style="margin:10px 0">'+['all',...counts].map(n=>'<button data-pathdiff-filter="'+safe(n)+'" aria-pressed="'+(filter===n?'true':'false')+'">'+(n==='all'?'All systems':'L'+safe(n))+'</button>').join('')+'</div>'+
 '<div class="buttonrow" style="margin:8px 0"><button data-pathdiff-condition-index="1">📚 Audit all lecture conditions (L67–79)</button></div>'+
 '<div class="buttonrow"><button data-pathdiff-create="1" style="background:#e5f6eb;border:1px solid #88c6a3;font-weight:800">➕ Create New Differential Card · Publish to Game</button></div>'+
 '<div class="buttonrow"><button data-modalaction="necroPatientPractice" style="font-size:12px">🐾 Optional: original patient-style practice questions</button></div>'+ 
 '<p class="tiny">'+matched.length+' instructor-slide-linked differential cases in this first module. Each includes four etiologic possibilities and why they become more or less likely.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:9px">'+matched.map(x=>'<button data-pathdiff-open="'+safe(x.id)+'" style="text-align:left;padding:12px;border:1px solid #b7cce5;border-radius:12px;background:#fff"><b>'+safe(x.title)+'</b><small style="display:block;margin-top:5px">L'+safe(x.lecture)+' · '+safe(x.species)+' · '+safe(x.system)+'</small></button>').join('')+'</div>'+
 '<div class="buttonrow"><button data-pathdiff-return="1">← Gross / histology specimen bank</button></div>');
}

/* Lecture coverage uses live lecture data, not a shortened list. */
let conditionLecture='75',conditionChosen=-1,conditionGap='all';
const LECTURES=Array.from({length:13},(_,i)=>String(i+67));
const CASE_MATCH={
'n68-meningitis':['leptomeningitis versus pachymeningitis','neonatal septicemia with cns infection'],
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
function lectureConditions(){return (window.VPQ_PATH_LECTURE_LEARN||{})[conditionLecture]?.sections||[]}
function norm(t){return String(t||'').toLowerCase().replace(/[–—-]/g,' ').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function relatedCases(lecture,title){
 const t=norm(title);
 return allCases().filter(c=>c.lecture===lecture&&((CASE_MATCH[c.id]||[]).some(alias=>t.includes(norm(alias)))||(c.id.startsWith('custom-')&&((norm(c.title).includes(t)&&t.length>8)||(t.includes(norm(c.best))&&norm(c.best).length>8)))));
}
function evidence(lecture,section){
 const linked=relatedCases(lecture,section.title);
 const bank=window.VPQ_PATH_EXAM7_DATA||[];
 const t=norm(section.title);
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
  const rows=lessons[n]?.sections||[],e=rows.map(x=>evidence(n,x));
  return {lecture:n,rows,teaching:rows.length,specimens:e.filter(x=>x.specimen).length,cases:e.filter(x=>x.linked.length>0).length,embedded:e.filter(x=>x.embedded).length,external:e.filter(x=>x.linkedPhotos).length};
 });
}
function conditionIndex(){
 const sections=lectureConditions(),facts=sections.map(x=>evidence(conditionLecture,x));
 const summary=coverageAll(),total=summary.reduce((a,x)=>a+x.teaching,0);
 const displayed=sections.map((x,i)=>({x,i,ev:facts[i]})).filter(({ev})=>conditionGap==='all'||conditionGap==='case'&&!ev.linked.length||conditionGap==='photo'&&!ev.embedded);
 const row=summary.find(x=>x.lecture===conditionLecture);
 modal('📚 Complete pathology lecture inventory · L'+safe(conditionLecture),
 '<div class="buttonrow"><button data-pathdiff-list="1">← Differential cases</button></div>'+
 '<p class="tiny">Coverage audit: <b>'+total+' lecture topics</b> across L67–79. Topics include normal anatomy and general principles as well as individual diseases; they are not all distinct diagnoses. A lecture note does NOT imply a dedicated case or photograph.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(56px,1fr));gap:5px;margin:9px 0">'+summary.map(v=>'<button data-pathdiff-condition-lecture="'+v.lecture+'" aria-pressed="'+(conditionLecture===v.lecture?'true':'false')+'" style="padding:7px 5px;font-size:12px">L'+v.lecture+'<small style="display:block;font-size:10px">'+v.teaching+' topics</small></button>').join('')+'</div>'+
 '<div style="background:#f3f7fc;border:1px solid #cbdbea;border-radius:9px;padding:10px;margin:8px 0"><b>'+safe((window.VPQ_PATH_LECTURE_LEARN||{})[conditionLecture]?.title||'Lecture '+conditionLecture)+'</b><p style="font-size:12px;margin:5px 0">Lecture topics: '+row.teaching+' · Matched specimen cards: '+row.specimens+' · Matched differential cases: '+row.cases+' · Attached image references: '+row.embedded+'</p><small>Counts are conservatively matched by case mapping/title, not a certified complete disease audit. External links without an embedded image are not counted as attached images.</small></div>'+
 '<div class="buttonrow" style="margin:8px 0"><button data-pathdiff-gap="all" aria-pressed="'+(conditionGap==='all')+'">All '+sections.length+'</button><button data-pathdiff-gap="case" aria-pressed="'+(conditionGap==='case')+'">Needs differential case</button><button data-pathdiff-gap="photo" aria-pressed="'+(conditionGap==='photo')+'">Needs attached photo</button></div>'+
 '<p class="tiny">'+displayed.length+' topics displayed. Select any topic to see full instructor-derived notes and the source slide reference.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px">'+displayed.map(({x,i,ev})=>'<button data-pathdiff-condition-open="'+i+'" style="text-align:left;padding:10px;background:white;border:1px solid #c6d7e9;border-radius:10px"><b>'+safe(x.title)+'</b><small style="display:block;color:#597087;margin-top:5px">Slides '+safe(x.slides||'see lecture')+'</small><small style="display:block;color:#536575;margin-top:4px">Notes ✓ · Specimen '+(ev.specimen?'✓':'—')+' · Case '+(ev.linked.length?'✓':'—')+' · Image '+(ev.embedded?'✓':'—')+'</small></button>').join('')+'</div>');
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
 const refBlock=ev.linked.map(x=>{
  const p=images[x.id]||{};
  return '<div style="padding:9px;border:1px solid #d4dfec;border-radius:9px;margin:8px 0"><button data-pathdiff-open="'+safe(x.id)+'">🧩 Practice case: '+safe(x.title)+'</button>'+
   (p.images||[]).map(i=>'<small style="display:block;margin-top:6px">📷 '+safe(i.type||'reference')+': '+safe(i.caption||i.file||'photo')+'</small>').join('')+
   (p.links||[]).map(l=>'<a href="'+safe(l.url)+'" target="_blank" rel="noopener noreferrer" style="display:block;margin-top:5px;font-size:12px">📖 '+safe(l.label)+'</a>').join('')+'</div>';
 }).join('');
 modal('📖 L'+safe(conditionLecture)+' · '+safe(item.title),
 '<div class="buttonrow"><button data-pathdiff-condition-back="1">← Full lecture inventory</button><button data-pathdiff-list="1">Cases</button></div>'+
 '<div class="buttonrow"><button data-pathdiff-recall-start="1">🧠 Test me on this topic</button></div>'+
 '<div class="buttonrow"><button data-pathdiff-create-topic="1" style="background:#e6f6ec">➕ Create differential card for this disease</button></div>'+
 '<div style="background:#f0f6fb;padding:10px;border:1px solid #c8dbeb;border-radius:10px;margin:9px 0"><b>Instructor-based lesson</b><p style="font-size:13px;margin:5px 0">Lecture '+safe(conditionLecture)+' · slides '+safe(item.slides||'not specified')+'</p><small>Specimen card: '+(ev.specimen?'Matched':'Not matched')+' · Dedicated case: '+(ev.linked.length?'Matched':'Not yet')+' · Attached reference: '+(ev.embedded?'Yes':'Not yet')+'</small></div>'+
 (item.points||[]).map(p=>'<section style="border-bottom:1px solid #e0e7ef;padding:9px 0"><b>'+safe(p[0])+'</b><p style="margin:5px 0;white-space:pre-wrap;line-height:1.5">'+safe(p[1])+'</p></section>').join('')+
 '<div style="padding:9px;background:#f8f6ed;border-radius:10px;margin:10px 0;font-size:12px"><b>Photo evidence:</b> Original professor slide '+safe(item.slides||'(see source deck)')+' is the primary teaching reference. We have not copied lecture slides into this index. Published pathology images must be identified by species and gross/histology type.</div>'+
 (refBlock||'<p style="font-size:12px">No dedicated differential case is linked to this exact lecture topic yet. This remains visible in the coverage audit rather than being marked complete.</p>'));
}

function sourcedPhotos(x){
 const d=window.VPQ_NECROPSY_DIFFERENTIAL_IMAGES?.[x.id];
 if(!d)return '';
 const pics=(d.images||[]).map(p=>{
  const filename=String(p.file||'');
  const url=p.url||'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(filename);
  const source=p.sourceUrl||'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(filename).replace(/%20/g,'_');
  if(p.type==='histology'&&phase===0)return '<div style="padding:10px;background:#f3f1fa;border:1px dashed #c1bcd3;border-radius:9px;font-size:12px;margin:7px 0">🔬 Histology reference becomes visible after the histology clue.</div>';
  return '<div style="padding:8px;border:1px solid #d2deed;border-radius:10px;background:white;margin:7px 0"><img src="'+safe(url)+'" alt="'+safe(p.caption)+'" loading="lazy" style="display:block;width:100%;max-height:210px;object-fit:contain;border-radius:6px"><div style="font-size:12px;margin-top:5px"><b>'+safe(p.type==='histology'?'Microscopic reference':'Visual reference')+'</b> · '+(phase>=2?safe(p.caption):'Observe the lesion first; the diagnosis and full caption are revealed after the comparison.')+'</div><div style="font-size:11px;color:#5b718b">Credit: '+safe(p.credit)+' · <a target="_blank" rel="noopener noreferrer" href="'+safe(source)+'">Source / license</a></div></div>';
 }).join('');
 const links=(d.links||[]).map(p=>'<a target="_blank" rel="noopener noreferrer" href="'+safe(p.url)+'" style="display:block;margin:6px 0;font-size:12px;text-decoration:underline;color:#315b9b">🔎 '+safe(p.label)+'</a>').join('');
 return '<div style="background:#eff8f5;border:1px solid #c5dace;border-radius:10px;padding:9px;margin:7px 0"><b style="font-size:13px">📸 Original veterinary references (not this simulated patient)</b>'+pics+(links?'<details '+(phase>=2?'open':'')+' style="margin:6px 0"><summary style="font-size:12px;font-weight:700">Additional pathology references (may reveal diagnosis)</summary>'+links+'</details>':'')+(d.note?'<p style="font-size:12px;color:#536375">'+safe(d.note)+'</p>':'')+'</div>';
}
function photoHTML(x){const photo=photoStore()[x.id];return '<div style="max-width:330px;padding:10px;background:#f8faff;border:1px dashed #bdcce0;border-radius:10px">'+(photo?'<img src="'+safe(photo)+'" alt="User added necropsy specimen" style="max-width:100%;max-height:205px;object-fit:contain;display:block;margin:auto">':'<div style="min-height:92px;display:grid;place-items:center;color:#566a89;font-size:13px">📷 No source photograph yet — add one from your lectures</div>')+'<label style="display:block;margin-top:7px;font-size:12px"><b>Add / replace this case image (local only)</b><input type="file" accept="image/*" data-pathdiff-photo="'+safe(x.id)+'" style="max-width:100%;font-size:12px"></label>'+(photo?'<button style="margin-top:5px;font-size:11px" data-pathdiff-remove="'+safe(x.id)+'">Remove local photo</button>':'')+'<small style="display:block;color:#66758b">Local draft photo; publish to make it available across devices. Only use photos you have rights to share.</small><button data-pathdiff-publish="'+safe(x.id)+'" style="display:block;margin-top:7px;background:#e4f6eb;border:1px solid #75b996">🚀 Edit / Publish photo now</button></div>'}
function view(){
 const baseCase=allCases().find(v=>v.id===current);if(!baseCase)return menu();
 const x={...baseCase,...(window.VPQ_NECROPSY_OWNER_PUBLISH?.getText?.('case',current)||{})};
 const revealed=phase>=2;
 const opted=leading>=0?x.options[leading]:null;
 modal('🔬 Differential case · L'+safe(x.lecture)+' · '+safe(x.title),
 '<div class="buttonrow"><button data-pathdiff-list="1">← All differential cases</button><button data-pathdiff-reset="1">↺ Restart case</button></div>'+
 '<div style="background:#f1f7ff;border-left:4px solid #7798cb;padding:10px;border-radius:8px;margin:10px 0"><b>'+safe(x.species)+' — presenting history</b><p>'+safe(x.history)+'</p><b>Gross lesion / localization:</b> '+safe(x.gross)+'</div>'+
 '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,300px);gap:12px;align-items:start;max-width:100%;overflow-wrap:anywhere"><div>'+
 '<h4 style="margin:4px 0">1. Build your differential list</h4><p class="tiny">Select every reasonable possibility. More than one diagnosis may fit early findings.</p>'+
 x.options.map((o,i)=>'<button data-pathdiff-toggle="'+i+'" aria-pressed="'+shortlist.includes(i)+'" style="display:block;width:100%;text-align:left;margin:6px 0;padding:10px;border:2px solid '+(shortlist.includes(i)?'#4784b5':'#dbe4ef')+';background:'+(shortlist.includes(i)?'#ecf6ff':'#fff')+';border-radius:10px">'+(shortlist.includes(i)?'☑ ':'☐ ')+safe(o.name)+'</button>').join('')+
 '<h4 style="margin:14px 0 5px">2. Choose the most likely diagnosis</h4><p class="tiny">Pick your leading possibility based on the evidence currently visible.</p>'+
 '<select id="pathdiff-lead" style="width:100%;padding:9px;border:1px solid #a9bed5;border-radius:9px"><option value="-1">Choose a leading diagnosis...</option>'+x.options.map((o,i)=>'<option value="'+i+'"'+(leading===i?' selected':'')+'>'+safe(o.name)+'</option>').join('')+'</select>'+
 '<div class="buttonrow" style="margin:9px 0"><button data-pathdiff-histo="1">'+(phase===0?'🔬 Reveal histology clue':'🔬 Histology revealed ✓')+'</button>'+(phase>=1?'<button data-pathdiff-compare="1">📋 Compare all etiologies</button>':'')+'</div>'+
 (phase>=1?'<div style="background:#f5eefc;border:1px solid #d8c9ed;padding:12px;border-radius:10px"><b>3. Histology revealed</b><p>'+safe(x.histo)+'</p><small>Now reconsider whether the differentials remain equally plausible.</small></div>':'')+
 '</div><div>'+(window.VPQ_NECROPSY_OWNER_PUBLISH?.casePhotoHTML?.(x.id)||'')+sourcedPhotos(x)+photoHTML(x)+'</div></div>'+
 (revealed?'<div style="margin-top:14px;border-top:2px solid #cbd9e9;padding-top:10px"><h4>4. Evidence-weighted differential comparison</h4><p>'+(opted?(opted.name===x.best?'✅ Your leading diagnosis matched the best-supported etiology.':'Your initial leader was <b>'+safe(opted.name)+'</b>. Compare the evidence below and revise your conclusion.'):'No leading diagnosis selected. Compare the possibilities below before returning to the case.')+'</p>'+
 '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Differential</th><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Supports</th><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Makes less likely / limitation</th><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Histology distinction</th></tr></thead><tbody>'+x.options.map(o=>'<tr><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6"><b>'+safe(o.name)+'</b>'+(o.role==='best'?' ★':'')+'</td><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6">'+safe(o.supports)+'</td><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6">'+safe(o.against)+'</td><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6">'+safe(o.hist)+'</td></tr>').join('')+'</tbody></table></div>'+
 '<div style="background:#eef8f0;border:1px solid #b8d7bf;border-radius:12px;padding:11px;margin-top:12px"><b>Best-supported etiology:</b> '+safe(x.best)+'<p><b>Morphologic diagnosis:</b> '+safe(x.morph)+'</p><p><b>Why it happens:</b> '+safe(x.mechanism)+'</p><p><b>What confirms it / next tests:</b> '+safe(x.tests)+'</p><small>Grounded in '+safe(x.ref)+'. This is an educational differential, not a definitive diagnosis from a simulated history.</small></div></div>':'')+
 '<div class="buttonrow" style="margin-top:12px"><button data-pathdiff-list="1">All cases</button><button data-pathdiff-reset="1">Try without clues again</button></div>');
}
function init(api){
 ui=api;
 api.body.addEventListener('click',ev=>{
 const button=ev.target.closest('button');if(!button||!Object.keys(button.dataset).some(k=>k.startsWith('pathdiff')))return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const d=button.dataset;
 if(d.pathdiffCreate!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.newCaseEditor?.();
 if(d.pathdiffCreateTopic!==undefined){const lesson=lectureConditions()[conditionChosen];return window.VPQ_NECROPSY_OWNER_PUBLISH?.newCaseEditor?.({title:lesson?.title||'',lecture:conditionLecture});}
 if(d.pathdiffConditionIndex!==undefined){return conditionIndex()}
 if(d.pathdiffConditionLecture!==undefined){conditionLecture=d.pathdiffConditionLecture;return conditionIndex()}
 if(d.pathdiffGap!==undefined){conditionGap=d.pathdiffGap;return conditionIndex()}
 if(d.pathdiffConditionOpen!==undefined){conditionChosen=Number(d.pathdiffConditionOpen);return conditionDetail()}
 if(d.pathdiffConditionBack!==undefined)return conditionIndex();
 if(d.pathdiffRecallStart!==undefined){recallShow=false;return recallView()}
 if(d.pathdiffRecallReveal!==undefined){recallShow=true;return recallView()}
 if(d.pathdiffRecallReset!==undefined){recallShow=false;return recallView()}
 if(d.pathdiffRecallBack!==undefined)return conditionDetail();
 if(d.pathdiffPublish!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.editor('case',d.pathdiffPublish);
 if(d.pathdiffList!==undefined)return menu();
 if(d.pathdiffFilter!==undefined){filter=d.pathdiffFilter;return menu()}
 if(d.pathdiffOpen!==undefined){current=d.pathdiffOpen;phase=0;leading=-1;shortlist=[];return view()}
 if(d.pathdiffReturn!==undefined)return window.VPQ_PATH_EXAM7?.start('histo');
 if(d.pathdiffReset!==undefined){phase=0;leading=-1;shortlist=[];return view()}
 if(d.pathdiffToggle!==undefined){const i=Number(d.pathdiffToggle);shortlist=shortlist.includes(i)?shortlist.filter(v=>v!==i):[...shortlist,i];return view()}
 if(d.pathdiffHisto!==undefined){phase=Math.max(phase,1);return view()}
 if(d.pathdiffCompare!==undefined){if(phase<1)return;const el=api.body.querySelector('#pathdiff-lead');leading=el?Number(el.value):-1;phase=2;return view()}
 if(d.pathdiffRemove!==undefined){updatePhoto(d.pathdiffRemove,'');return view()}
 },true);
 api.body.addEventListener('change',ev=>{
 const d=ev.target?.dataset;if(!d||d.pathdiffPhoto===undefined)return;
 const input=ev.target,file=input.files?.[0];if(!file||!file.type.startsWith('image/'))return;
 const reader=new FileReader();
 reader.onload=()=>{const img=new Image();img.onload=()=>{const k=Math.min(1,780/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*k));c.height=Math.max(1,Math.round(img.height*k));c.getContext('2d').drawImage(img,0,0,c.width,c.height);const ok=updatePhoto(d.pathdiffPhoto,c.toDataURL('image/jpeg',0.67));if(ok)view();else modal('Image too large','<p>Browser storage is full. Please resize the image and try again.</p><button data-pathdiff-list="1">Return to cases</button>')};img.src=String(reader.result)};reader.readAsDataURL(file);
 },true);
}
function openCase(id){if(allCases().some(x=>x.id===id)){current=id;return view()}return menu()}
function draftPhoto(id){return photoStore()[id]||''}
function draftText(id){return {}}
return {init,start,cases:data,openCase,draftPhoto,draftText};
})();
