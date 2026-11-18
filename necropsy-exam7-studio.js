/* Monday pathology exam: Necropsy gross recognition, morphologic diagnosis and histology. */
window.VPQ_PATH_EXAM7=(function(){
'use strict';
const base=window.VPQ_PATH_EXAM7_DATA||[];
// Reuse the existing specimen editing/publishing system for non-disease normal references.
for(const x of window.VPQ_PATH_NORMALS||[]){if(!base.some(v=>v.id===x.id))base.push(x)}
function refreshCustom(){
 const owner=window.VPQ_NECROPSY_OWNER_PUBLISH;
 for(const x of owner?.getCustomSpecimens?.()||[]){if(!base.some(c=>c.id===x.id))base.push(x);}
 return base;
}
const KEY='vpq-path-exam7-user-edits-v1';
let ui=null,mode='gross',tab='lesions',normalSystem='all',filter='all',etiologyFilter='all',search='',current=-1,quiz=[],step=0,revealed=false,unknownDraft={};
const rich=s=>window.VPQ_PATH_RICH_TEXT?.render?.(s)||h(s);
const h=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function edits(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function record(i){const src=base[i],official=window.VPQ_NECROPSY_OWNER_PUBLISH?.getSpecimen?.(src.id)||{},draft=edits()[src.id]||{};const entry=Object.assign({},src,official.text||{},draft);const photos=official.photos?.length?official.photos:(official.photo?.url?[official.photo]:[]);if(photos.length)entry.image=photos[0].url;return entry}
function photoStatus(x){
 const official=window.VPQ_NECROPSY_OWNER_PUBLISH?.getSpecimen?.(x.id)||{};
 const pictures=official.photos?.length?official.photos:(official.photo?.url?[official.photo]:[]);
 const local=!!edits()[x.id]?.image;
 if(pictures.some(p=>p.verified===true&&p.source&&p.credit))return '✓ Photo verified';
 if(pictures.length||local||x.image)return '📷 Photo added';
 return '◻ Photo needed';
}
function save(i,part){let d=edits();d[base[i].id]=Object.assign({},d[base[i].id]||{},part);try{localStorage.setItem(KEY,JSON.stringify(d));return true}catch(e){return false}}
function modal(title,body){if(ui)ui.showModal(title,body)}
const nameSorter=new Intl.Collator(undefined,{sensitivity:'base',numeric:true,ignorePunctuation:true});
function visible(){
 refreshCustom();
 const hidden=new Set(window.VPQ_NECROPSY_OWNER_PUBLISH?.getHiddenSpecimens?.()||[]);
 const items=base.map((v,i)=>Object.assign({index:i},record(i))).filter(x=>!hidden.has(x.id)&&((tab==='normals')===!!x.normal)&&(tab==='normals'?(normalSystem==='all'||x.system===normalSystem):(filter==='all'||x.lecture===filter))&&(etiologyFilter==='all'||window.VPQ_PATH_ETIOLOGY?.forCard?.(x)?.categories?.includes(etiologyFilter))&&(!search||[x.title,x.lecture,x.system,x.species,x.gross,x.histo,x.why].join(' ').toLowerCase().includes(search)));
 // Sort the displayed cards only. Their immutable IDs and original indices
 // remain unchanged so drafts, published images, and edit buttons still match.
 return items.sort((a,b)=>((tab==='normals'?nameSorter.compare(a.system||'',b.system||''):filter==='all'?nameSorter.compare(String(a.lecture||''),String(b.lecture||'')):0)||nameSorter.compare(a.title||'',b.title||'')||a.index-b.index));
}
function start(k){mode=k||'gross';tab='lesions';filter='all';normalSystem='all';menu()}
function studyLecture(lecture){tab='lesions';mode='gross';filter=String(lecture||'all');normalSystem='all';search='';refreshCustom();menu()}
function showTab(kind){tab=kind==='normals'?'normals':'lesions';mode='gross';filter='all';normalSystem='all';search='';refreshCustom();menu()}
function menu(){
 const selected=visible();
 const lectures=['all',...new Set(base.filter(x=>!x.normal).map(x=>x.lecture))];
 const tabs='<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 12px"><button data-path7-tab="lesions" aria-pressed="'+(tab==='lesions')+'" style="flex:1;min-width:130px;padding:11px;border:2px solid '+(tab==='lesions'?'#6b9cc8':'#cad7e5')+';border-radius:10px;font-weight:800;background:'+(tab==='lesions'?'#edf5ff':'white')+'">🔬 Disease specimens</button><button data-path7-tab="normals" aria-pressed="'+(tab==='normals')+'" style="flex:1;min-width:130px;padding:11px;border:2px solid '+(tab==='normals'?'#69a68a':'#cad7e5')+';border-radius:10px;font-weight:800;background:'+(tab==='normals'?'#edf9f1':'white')+'">🌱 Normals · reference atlas</button></div>';
 if(tab==='normals'){
  const systems=['all',...new Set(base.filter(x=>x.normal).map(x=>x.system))];
  const selected=visible();
  return modal('🔬 Specimen Cabinet · Normal Atlas',
   tabs+
   '<div class="buttonrow" style="margin:8px 0"><button data-path7-add="normal" style="background:#e5f6eb;font-weight:800">➕ Add normal card</button><button data-path7-manage-hidden="1">🗂 Hidden cards / restore</button></div>'+
   '<p style="font-size:13px;margin:6px 0 11px">Recognize <b>healthy gross anatomy and histology</b> before evaluating diseased tissue. Normal variation depends on species, organ site, age, and physiologic state. Photographs are added and published through the existing specimen editor.</p>'+
   '<label style="display:block;font-size:12px;font-weight:700">System<select data-path7-normal-system="1" style="display:block;width:100%;max-width:380px;padding:9px;margin:5px 0 9px;border-radius:8px;background:white"><option value="all">All systems</option>'+systems.filter(x=>x!=='all').map(x=>'<option value="'+h(x)+'"'+(normalSystem===x?' selected':'')+'>'+h(x)+'</option>').join('')+'</select></label>'+
   '<label style="display:block;font-size:12px">Search normal structures<input id="path7Search" data-path7-search="1" style="display:block;width:100%;max-width:380px;padding:9px;margin:5px 0 9px" value="'+h(search)+'" placeholder="e.g. cerebellum, placenta, cornea"></label>'+
   '<p class="tiny"><b>'+selected.length+' normal references</b> shown. Image placeholders are not published photographs.</p>'+
   '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:9px">'+selected.map(x=>'<button data-path7-card="'+x.index+'" style="text-align:left;padding:12px;border:1px solid #bbd9c5;border-radius:11px;background:#fafffb"><b>'+h(x.title)+'</b><small style="display:block;margin:5px 0">'+h(x.system)+'</small><small style="display:block;color:#60758a">'+h(x.species)+'</small></button>').join('')+'</div>'+
   '<div class="buttonrow"><button data-path7-library="1">📷 Published photo library</button><button data-path7-differentials="1">Differential cases</button></div>');
 }
 modal('🔬 Necropsy · Specimen Cabinet',
 tabs+
 '<div class="buttonrow" style="margin:8px 0"><button data-path7-add="lesion" style="background:#e5f6eb;font-weight:800">➕ Add specimen card</button><button data-path7-manage-hidden="1">🗂 Hidden cards / restore</button></div>'+
 '<p><b>Gross photograph → lesion description → morphologic diagnosis → histology → pathogenesis.</b> This is an exam study bank built from the uploaded lectures, with original summaries and spaces for your editable images and annotations.</p>'+
 '<div class="buttonrow"><button data-path7-differentials="1" style="background:#e0f3ed;border:2px solid #8ebea8;font-weight:850">🧩 Differential Case Center · Signalment → Histo → Etiology</button></div>'+ 
 '<div class="buttonrow"><button data-path7-library="1">📷 Browse published photos by lecture / system</button></div>'+ 
 '<div class="buttonrow"><button data-path7-mode="gross">🔎 Gross + morphologic DX</button><button data-path7-mode="histo">🔬 Histo + WHY</button><button data-path7-mode="edit">✏️ Edit atlas images</button><button data-path7-test="coached" style="background:#e6f3ff;border-color:#aac9eb">🎓 Guided morphologic DX · 12 cases</button><button data-path7-test="all">🧪 All atlas unknowns</button></div>'+
 '<label style="display:block;font-size:12px;margin:9px 0"><b>🧬 Browse by etiology</b><select data-path7-etiology-filter="1" style="display:block;padding:8px;max-width:390px;width:100%;margin-top:4px"><option value="all">All etiologies</option>'+Object.entries(window.VPQ_PATH_ETIOLOGY?.categories||{}).map(([k,v])=>'<option value="'+h(k)+'"'+(etiologyFilter===k?' selected':'')+'>'+h(v.label)+'</option>').join('')+'</select><small>Multiple tags may apply. Untagged cards appear under All etiologies.</small></label>'+
 '<div class="buttonrow">'+lectures.map(l=>'<button data-path7-filter="'+h(l)+'" style="padding:6px 9px;font-size:11px" aria-pressed="'+(filter===l?'true':'false')+'">'+(l==='all'?'All lectures':'L'+h(l))+'</button>').join('')+'</div>'+
 '<p class="tiny"><b>'+selected.length+' of '+base.length+' slide-linked lesion / recognition cards.</b> Slide images are not copied into the public game; add your own locally.</p>'+ 
 '<label style="display:block;margin:8px 0">Find disease or lesion <input id="path7Search" data-path7-search="1" placeholder="e.g. pyometra, optic nerve, granuloma" value="'+h(search)+'" style="width:min(100%,430px);padding:9px;border:1px solid #bccbe0;border-radius:9px"></label>'+ 
 '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:8px">'+selected.map(x=>'<button style="text-align:left;padding:12px" data-path7-card="'+x.index+'"><strong>'+h(x.title)+'</strong><small style="display:block">Lecture '+h(x.lecture)+'</small><small style="display:block;color:#60758a">'+(mode==='edit'?'Add image and personal notes':mode==='histo'?'Histology & explanation':'Gross ID & morphologic diagnosis')+'</small></button>').join('')+'</div>');
}
function card(i){
 current=i;const x=record(i),shelf=visible(),at=shelf.findIndex(v=>v.index===i);
 const previous=at>0?shelf[at-1]:null,next=at>=0&&at<shelf.length-1?shelf[at+1]:null;
 const nav='<div class="buttonrow" style="margin:0 0 10px"><button data-path7-back="1">← Back to '+(tab==='normals'?'Normals Atlas':'Disease Atlas')+'</button><button data-path7-view="'+(previous?.index??'')+'" '+(!previous?'disabled':'')+'>◀ Previous</button><button data-path7-view="'+(next?.index??'')+'" '+(!next?'disabled':'')+'>Next specimen ▶</button></div>'+
 '<p class="tiny">'+(at>=0?('Specimen '+(at+1)+' of '+shelf.length+' · '):'')+'Browse within your current tab, search and filter.</p>';
 const gallery=window.VPQ_NECROPSY_OWNER_PUBLISH?.specimenPhotoHTML?.(x.id)||'';
 const media=gallery|| (x.image?'<img alt="Local pathology image" src="'+h(x.image)+'" style="max-width:100%;max-height:330px;object-fit:contain;border:1px solid #d8ddea;border-radius:12px">':'<div style="min-height:160px;display:grid;place-items:center;padding:16px;border:2px dashed #bbc4da;border-radius:12px;background:#fbf8ff;text-align:center">📷 Editable gross / H&E image slot</div>');
 modal((x.normal?'🌱 Normal reference · ':'Lecture '+h(x.lecture)+' · ')+h(x.title),
 nav+
 '<p class="tiny">'+photoStatus(x)+' · Photos optional; uploading is not the same as verifying.</p>'+ 
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px"><div>'+media+'</div><div>'+(x.normal?'<p><b>System:</b> '+h(x.system)+' · <b>Species:</b> '+h(x.species)+'</p>':'')+'<p><b>'+(x.normal?'Normal gross appearance':'Gross description')+':</b> '+rich(x.gross)+' <button type="button" data-path7-why="gross" aria-label="Explain gross findings" title="Why does the lesion look this way?">?</button></p>'+
 '<details '+(x.normal||mode==='histo'?'open':'')+'><summary><b>'+(x.normal?'Normal identification':'Reveal morphologic diagnosis')+'</b> ❔</summary><p>'+rich(x.dx)+'</p></details>'+
 '<details '+(x.normal||mode==='histo'?'open':'')+'><summary><b>'+(x.normal?'Normal histology':'Histology')+'</b> ❔</summary><p>'+rich(x.histo)+'</p></details>'+
 '<details '+(x.normal||mode==='histo'?'open':'')+'><summary><b>'+(x.normal?'Normal vs abnormal · what to compare':'Why it happens / distinctive clues')+'</b> ❔</summary><p>'+rich(x.why)+'</p></details>'+
 (x.notes?'<p><b>Your annotation:</b> '+rich(x.notes)+'</p>':'')+
 (x.normal?'':(window.VPQ_PATH_ETIOLOGY?.cardHTML?.(x)||''))+
 '<p class="tiny"><b>Study source:</b> '+h(x.source)+'</p></div></div>'+
 (x.normal?'':'<div class="buttonrow"><button data-path7-why="histo">❔ Histology & WHY</button><button data-path7-why="compare">❔ What distinguishes it?</button></div>')+ 
 '<div class="buttonrow"><button data-path7-edit="'+i+'">✏️ Edit text / images</button><button data-path7-owner-publish="'+i+'">🚀 Publish photos now</button><button data-path7-hide="'+i+'" style="font-size:12px">🗂 Hide card</button></div>');
}
function edit(i){
 current=i;const x=record(i);
 modal('✏️ Necropsy image and notes · '+h(x.title),
 '<p>Save Draft keeps your photo and annotations in this browser. To make a photo visible on every device, select <b>🚀 Publish photo now</b> after saving the draft. The public publishing step is owner-authorized.</p>'+
 '<label>Image URL<input id="path7Url" style="width:100%" value="'+h(x.image||'')+'" placeholder="https://…"></label>'+
 '<label>Or choose a photo from your device<input id="path7File" type="file" accept="image/*"></label>'+
 '<label>'+(x.normal?'Normal gross anatomy':'Gross lesion')+'<textarea id="path7Gross" rows="3" style="width:100%">'+h(x.gross)+'</textarea></label>'+
 '<label>'+(x.normal?'Normal identification':'Morphologic DX')+'<textarea id="path7Dx" rows="2" style="width:100%">'+h(x.dx)+'</textarea></label>'+
 '<label>'+(x.normal?'Normal histology':'Histology')+'<textarea id="path7Histo" rows="2" style="width:100%">'+h(x.histo)+'</textarea></label>'+
 '<label>Instructor annotations / personal clues<textarea id="path7Notes" rows="3" style="width:100%">'+h(x.notes||'')+'</textarea></label>'+
 (x.normal?'':(window.VPQ_PATH_ETIOLOGY?.editorHTML?.(x)||'')) +
 '<div class="buttonrow"><button data-path7-save="'+i+'">💾 Save Draft</button><button data-path7-owner-publish="'+i+'">🚀 Publish photo now</button><button data-path7-view="'+i+'">Cancel</button></div>');
}
function saveForm(i){
 const val=n=>ui.body.querySelector('#'+n)?.value||'';
 const part={image:val('path7Url').trim(),gross:val('path7Gross'),dx:val('path7Dx'),histo:val('path7Histo'),notes:val('path7Notes'),...(window.VPQ_PATH_ETIOLOGY?.readEditor?.(ui.body)||{})};
 const finish=()=>{if(save(i,part))card(i);else modal('Local storage full','<p>This image is too large for your browser storage. Try a smaller image or a URL.</p><button data-path7-edit="'+i+'">Back to editor</button>')};
 const file=ui.body.querySelector('#path7File')?.files?.[0];
 if(!file)return finish();
 if(!file.type.startsWith('image/'))return;
 const reader=new FileReader();
 reader.onload=()=>{const img=new Image();img.onload=()=>{const factor=Math.min(1,700/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*factor));canvas.height=Math.max(1,Math.round(img.height*factor));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);part.image=canvas.toDataURL('image/jpeg',0.67);finish()};img.src=String(reader.result)};
 reader.readAsDataURL(file);
}
// Morphologic diagnosis teaching format follows the uploaded instructor lecture:
// lesion description -> organ/process/modifiers/distribution -> supported time and
// severity -> etiologic interpretation. A disease name alone is NOT a morphologic DX.
// Instructor-format coaching examples: model formulations are teaching interpretations,
// not verbatim answers from the instructor's slides. Original atlas fields remain editable.
const MORPH_MODELS={
 'exam7-3':{m:'Leptomeninges: diffuse suppurative meningitis.',e:'Septic bacterial infection is a likely cause in a neonate; organism requires diagnostic confirmation.',why:'Yellow-white exudate follows meningeal surfaces; neutrophils in the subarachnoid space support suppurative inflammation.',omit:'No defensible lesion age or severity from the brief description alone.'},
 'exam7-5':{m:'Brain: multifocal hemorrhagic and necrotizing vasculitis with thrombosis (thrombotic meningoencephalitis).',e:'Histophilus somni is an important suspected cause in feedlot cattle, pending supporting tests.',why:'Vascular fibrin thrombi and necrotizing vasculitis link multifocal hemorrhage to ischemic injury.',omit:'Do not add chronicity from distribution or red discoloration.'},
 'exam7-6':{m:'Brain: focal suppurative encephalitis (abscess).',e:'Bacterial infection is suspected; a specific bacterial species cannot be determined from gross appearance.',why:'A single localized soft, pale lesion with histologic neutrophils supports an abscess.',omit:'Encapsulation or chronicity requires additional evidence.'},
 'exam7-9':{m:'Cerebellum: diffuse hypoplasia.',e:'Congenital cerebellar hypoplasia; an infectious, genetic or other developmental cause requires further investigation.',why:'A small but formed cerebellum indicates underdevelopment rather than destruction of previously mature tissue.',omit:'Developmental defects are not automatically acute or chronic inflammatory lesions.'},
 'exam7-17':{m:'Skin of muzzle/oral region: multifocal proliferative, crusting dermatitis.',e:'Contagious ecthyma (orf; parapoxvirus) is a differential in young small ruminants.',why:'The pattern is proliferative and crusting; species, age and distribution prioritize orf, but gross appearance alone is not definitive.',omit:'Crusting alone does not establish lesion age or severity.'},
 'exam7-23':{m:'Skin: superficial pustular dermatitis with subcorneal acantholysis.',e:'Pemphigus foliaceus is a likely immune-mediated diagnosis; confirm using the pattern and relevant workup.',why:'The level of the pustule and acantholytic keratinocytes carry more diagnostic weight than crusts alone.',omit:'Do not assign severity without extent and clinical context.'},
 'exam7-25':{m:'Skin: multifocal ischemic necrosis with necrotizing vasculitis (when histologically confirmed).',e:'Possible immune-mediated, infectious, drug-associated or other vascular injury; cause remains undetermined.',why:'Purpura and sharply demarcated necrosis raise vascular injury; biopsy is needed to establish vasculitis.',omit:'Black tissue alone is insufficient to label chronicity or etiology.'},
 'exam7-29':{m:'Uterus: cystic endometrial hyperplasia with suppurative endometritis.',e:'CEH–pyometra complex; bacterial infection can complicate progesterone-associated endometrial changes.',why:'Cystic thickened endometrium plus purulent uterine contents supports two related lesions, not merely a disease label.',omit:'Do not infer acute versus chronic from the name alone; assess histologic duration.'},
 'exam7-36':{m:'Pinna: focal ischemic coagulative necrosis.',e:'Consider vascular compromise (including vasculitis or thrombosis); etiology not established by gross appearance.',why:'A sharply demarcated dry dark lesion is compatible with infarction/ischemic necrosis, distinct from fluctuant hematoma.',omit:'Necrosis does not by itself specify chronicity.'},
 'exam7-37':{m:'Pinna: focal hemorrhage forming an auricular hematoma.',e:'Traumatic hemorrhage, often associated with vigorous head shaking from otitis; primary trigger requires investigation.',why:'Blood-filled fluctuant swelling is a hematoma. Organization and fibrosis establish an older/organizing component only when seen in the specimen.',omit:'Do not call this chronic based on swelling; organization/fibrosis are histologic evidence of repair.'},
 'exam7-39':{m:'Cornea: focal stromal necrosis (corneal sequestrum).',e:'Feline corneal sequestrum; predisposing ocular irritation or disease may be involved.',why:'A dark focal corneal lesion needs microscopic confirmation of necrotic stromal collagen; pigmentation is an alternative.',omit:'Dark discoloration alone does not establish chronicity.'},
 'exam7-40':{m:'Lens: bilateral degeneration with cataract formation.',e:'Diabetes-associated cataracts are a strong consideration in a diabetic dog; other causes remain possible.',why:'Bilateral lens opacity is the visible finding; swollen degenerating lens fibers define the tissue change.',omit:'Osmotic injury is pathogenesis, not the lesion distribution.'}
};
const MORPH_TEACHING=[
 ['Description','Record observable findings: tissue/location, number, distribution, dimensions, color, shape, consistency and special features. Avoid naming a disease in the description.'],
 ['Morphologic DX','Organ: primary process ± appropriate modifier, distribution, chronicity and severity when justified. Interpret what the lesion IS.'],
 ['Etiologic DX','Name the suspected cause/disease separately and justify it with signalment, histology, distribution and/or testing.']
];
function morphologyGuide(){
 return '<details style="border:1px solid #c5d4e7;border-radius:10px;padding:11px;margin:9px 0 12px;background:#f8faff"><summary><b>📖 Professor’s morphologic diagnosis framework</b></summary>'+
 MORPH_TEACHING.map(p=>'<p><b>'+p[0]+':</b> '+p[1]+'</p>').join('')+
 '<p><b>Form:</b> Organ: process ± modifier, distribution, chronicity, severity. <b>Do not guess</b> the last two categories.</p>'+
 '<p><b>Example supplied in your practice slides — canine brain:</b> multifocal to coalescing dark red-black lesions with blood-filled vascular spaces on histology. <b>Possible morphologic description:</b> Brain: multifocal to coalescing hemorrhagic neoplasia. <b>Etiologic diagnosis:</b> metastatic hemangiosarcoma. These model wording choices are teaching formulations, not a verbatim professor morphologic answer.</p>'+
 '<p class="tiny">Reference: uploaded “Morphologic Diagnosis vs Etiologic Diagnosis,” especially pp. 3–4 and 7–10. The other slide cases demonstrate the exercise structure but do not supply confirmed etiologic answers for every lesion.</p></details>';
}
function unknownValues(){
 const data={};
 for(const field of ['description','morphology','etiology']){
  const el=ui?.body?.querySelector?.('[data-unknown-field="'+field+'"]');
  if(el)data[field]=el.value;
 }
 unknownDraft[step]={...(unknownDraft[step]||{}),...data};
}
function unknownTextarea(field,label,help){
 const value=unknownDraft[step]?.[field]||'';
 return '<label style="display:block;margin:10px 0"><b>'+label+'</b><small style="display:block;color:#526981;margin:3px 0 5px">'+help+'</small><textarea data-unknown-field="'+field+'" rows="3" style="width:100%;padding:9px" placeholder="Write your answer before revealing">'+h(value)+'</textarea></label>';
}
function test(kind='coached'){
 tab='lesions';
 const eligible=visible().filter(x=>!x.normal);
 const chosen=kind==='all'?eligible:eligible.filter(x=>MORPH_MODELS[x.id]);
 quiz=chosen.sort(()=>Math.random()-.5).slice(0,12);
 step=0;revealed=false;unknownDraft={};question();
}
function question(){
 if(step>=quiz.length){modal('Practice completed','<p>Reviewed '+quiz.length+' lesion unknowns. Try again for additional cases.</p><button data-path7-back="1">Back to atlas</button>');return}
 const x=quiz[step];
 const model=MORPH_MODELS[x.id];
 const explanation=revealed?'<div class="response">'+
  (model?'<p><b>Example morphologic diagnosis:</b> '+h(model.m)+'</p><p><b>Etiologic diagnosis / differential:</b> '+h(model.e)+'</p><p><b>Why these terms fit:</b> '+h(model.why)+'</p><p><b>What not to assume:</b> '+h(model.omit)+'</p>':'<p><b>Atlas entry (not independently checked as formal morphology):</b> '+rich(x.dx)+'</p>')+
  '<p><b>Microscopic description:</b> '+rich(x.histo)+'</p>'+
  '<p><b>Etiology, mechanism, or reasoning from this card:</b> '+rich(x.why)+'</p>'+
  '<p><b>Check your morphology:</b> Did you name the organ, primary lesion process and observed distribution? Add modifiers only when supported by the gross or histologic findings. Chronicity requires evidence of lesion age (e.g., organization/fibrosis) and severity needs enough information to judge extent or damage; neither should be guessed.</p>'+
  '<p class="tiny"><b>Important:</b> Some older atlas DX fields are disease/etiologic labels rather than complete morphologic diagnoses. Treat this as a source reference, not a guaranteed model morphologic answer. We will review these individually.</p></div>':'';
 modal('🎓 Necropsy unknown '+(step+1)+' / '+quiz.length,
 '<p><b>Gross finding:</b> '+rich(x.gross)+'</p>'+(x.image?'<img alt="Gross pathology specimen" src="'+h(x.image)+'" style="max-width:100%;max-height:280px;object-fit:contain">':'')+
 morphologyGuide()+
 unknownTextarea('description','1. Gross lesion description','Location, number, distribution, size/color, shape, consistency and other OBSERVABLE features. No disease name yet.')+
 unknownTextarea('morphology','2. Morphologic diagnosis','Organ: process ± modifier, distribution; chronicity and severity ONLY when justified by observed changes.')+
 unknownTextarea('etiology','3. Etiologic diagnosis / differentials','What caused it? Include differential diagnoses and the evidence that helps separate them.')+
 explanation+
 '<div class="buttonrow">'+(revealed?'<button data-path7-nextq="1">Next unknown →</button>':'<button data-path7-reveal="1">Reveal instructor-style comparison →</button>')+'<button data-path7-back="1">Stop</button></div>');
}
function init(api){
 ui=api;
 window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.init(api);
 window.VPQ_NECROPSY_OWNER_PUBLISH?.init(api);
 window.VPQ_NECROPSY_OWNER_PUBLISH?.load?.().then(()=>{refreshCustom();if(ui===api&&api.body?.querySelector?.('[data-path7-tab]'))menu()}).catch(()=>{});
 api.body.addEventListener('change',ev=>{if(ev.target?.dataset?.path7EtiologyFilter!==undefined){etiologyFilter=ev.target.value||'all';return menu()}if(ev.target?.dataset?.path7NormalSystem!==undefined){normalSystem=String(ev.target.value||'all');return menu()}if(ev.target?.dataset?.path7Search!==undefined){search=String(ev.target.value||'').toLowerCase().trim();menu()}},true);
 api.body.addEventListener('click',ev=>{
  const b=ev.target.closest('button');if(!b)return;const d=b.dataset;
  if(!Object.keys(d).some(k=>k.startsWith('path7')))return;
  ev.preventDefault();ev.stopImmediatePropagation();
  if(d.path7Why!==undefined){
  if(current<0||current>=base.length)return;
  const x=record(current),topic=d.path7Why;
  const sections=topic==='gross'
   ?'<p><b>Gross appearance:</b> '+rich(x.gross)+'</p><p><b>Why it appears:</b> '+rich(x.why)+'</p>'
   :topic==='histo'
   ?'<p><b>Microscopic lesion:</b> '+rich(x.histo)+'</p><p><b>Mechanism / why:</b> '+rich(x.why)+'</p><p><b>Morphologic diagnosis:</b> '+rich(x.dx)+'</p>'
   :'<p><b>Key distinction:</b> '+rich(x.why)+'</p><p><b>Use these findings:</b> '+rich(x.gross)+'</p><p><b>Histology:</b> '+rich(x.histo)+'</p>';
  modal('❔ '+h(x.title)+' · '+(topic==='gross'?'Why gross looks this way':topic==='histo'?'Microscopy and mechanism':'Distinguishing clues'),sections+'<p class="tiny">Drawn from this existing study card. Confirm specific interpretations with the lecture slides.</p><button data-path7-view="'+current+'">← Return to specimen</button>');return;
 }
 if(d.path7Add!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.newSpecimenEditor?.(d.path7Add==='normal'?'normal':'lesion',tab==='normals'?'67':(filter==='all'?'68':filter));
 if(d.path7ManageHidden!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.hiddenSpecimenMenu?.();
 if(d.path7Hide!==undefined){const item=base[Number(d.path7Hide)];return item&&window.VPQ_NECROPSY_OWNER_PUBLISH?.hideSpecimenEditor?.(item.id,false)}
 if(d.path7Tab!==undefined){tab=d.path7Tab==='normals'?'normals':'lesions';search='';return menu()}
 if(d.path7Library!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.photoLibrary?.();
 if(d.path7Differentials!==undefined)return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.start(ui,filter);
 if(d.path7Mode!==undefined){tab='lesions';mode=d.path7Mode;return menu()}
  if(d.path7Filter!==undefined){filter=d.path7Filter;return menu()}
  if(d.path7Card!==undefined){const i=Number(d.path7Card);return mode==='edit'?edit(i):card(i)}
  if(d.path7Edit!==undefined)return edit(Number(d.path7Edit));
  if(d.path7View!==undefined){const n=Number(d.path7View);return Number.isInteger(n)&&n>=0&&n<base.length?card(n):menu()}
  if(d.path7Save!==undefined)return saveForm(Number(d.path7Save));
  if(d.path7OwnerPublish!==undefined){const i=Number(d.path7OwnerPublish);
   const field=api.body.querySelector('#path7Gross');
   if(field){const val=n=>api.body.querySelector('#'+n)?.value||'';
    save(i,{gross:val('path7Gross'),dx:val('path7Dx'),histo:val('path7Histo'),notes:val('path7Notes'),...(window.VPQ_PATH_ETIOLOGY?.readEditor?.(ui.body)||{})});}
   return window.VPQ_NECROPSY_OWNER_PUBLISH?.editor('specimen',base[i]?.id)
  }
  if(d.path7Back!==undefined)return menu();
  if(d.path7Test!==undefined)return test(d.path7Test==='all'?'all':'coached');
  if(d.path7Reveal!==undefined){unknownValues();revealed=true;return question()}
  if(d.path7Nextq!==undefined){unknownValues();step++;revealed=false;return question()}
 },true);
}
function openCard(id){refreshCustom();const i=base.findIndex(x=>x.id===id);if(i>=0){tab=base[i].normal?'normals':'lesions';return card(i)}return menu()}
function draftPhoto(id){const d=edits()[id];return String(d?.image||'').startsWith('data:image/jpeg;base64,')?d.image:''}
function draftText(id){const d=edits()[id]||{};return Object.fromEntries(['gross','dx','histo','why','notes','etiologyCategories','etiologyAgents','etiologyCertainty'].filter(k=>Object.prototype.hasOwnProperty.call(d,k)).map(k=>[k,d[k]]))}
function afterPublished(id){const all=edits();if(!all[id])return;for(const k of ['gross','dx','histo','why','notes'])delete all[id][k];try{localStorage.setItem(KEY,JSON.stringify(all))}catch(e){}}
return {init,start,studyLecture,showTab,activeTab:()=>tab,cards:base,openCard,refreshCustom,draftPhoto,draftText,afterPublished};
})();
