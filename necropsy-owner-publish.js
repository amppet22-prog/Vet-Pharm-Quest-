/* Owner-only publishing for pathology/necropsy photos. Shares the existing encrypted owner key vault.
 * Never stores an unencrypted GitHub credential or puts a GitHub password into public files.
 */
window.VPQ_NECROPSY_OWNER_PUBLISH=(function(){
'use strict';
const OWNER='amppet22-prog',REPO='Vet-Pharm-Quest-',MANIFEST='necropsy-owner-published.json';
const ROOT='https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const encode=s=>{const arr=new TextEncoder().encode(s);let raw='';for(let i=0;i<arr.length;i+=8192)raw+=String.fromCharCode(...arr.subarray(i,i+8192));return btoa(raw)};
const decode=s=>new TextDecoder().decode(Uint8Array.from(atob(String(s).replace(/\s/g,'')),c=>c.charCodeAt(0)));
const goodUrl=s=>{try{let u=new URL(s);return u.protocol==='https:'?u.href:''}catch{return ''}};
let published={version:1,cases:{},specimens:{},lectures:{},customCases:{}},api=null,pending=null,loaded=false;
async function load(){
 try{
  const r=await fetch('./'+MANIFEST+'?v='+Date.now(),{cache:'no-store'});
  if(r.ok){const j=await r.json();if(j&&typeof j.cases==='object'&&typeof j.specimens==='object')published=j;}
 }catch(e){/* Offline game still shows default teaching material. */}
 loaded=true;return published;
}


function renamedConditionTitle(lecture,section){
 const raw=String(section?.sourceTitle||section?.title||'');
 const key=String(lecture)+'|'+raw;
 return String(published.conditionTitleOverrides?.[key]||raw);
}
function renameConditionEditor(lecture,index){
 const core=window.VPQ_PATH_LECTURE_LEARN?.[lecture]?.sections||[];
 const records=[...core,...getCustomConditions(lecture)];
 const entry=records[Number(index)];
 if(!entry){show('Condition not available','<p>This condition could not be located.</p>');return;}
 const oldTitle=String(entry.sourceTitle||entry.title||'');
 const current=renamedConditionTitle(lecture,entry);
 const ownerId=entry.ownerId||'';
 const ref=ownerId?'custom:'+ownerId:String(lecture)+'|'+oldTitle;
 show('✏️ Rename pathology condition',
 '<p>Change only the displayed name. The original condition identity, teaching notes, specimens, photos and case references are preserved.</p>'+
 '<label style="display:block"><b>Condition name</b><input id="npRenameTitle" maxlength="180" style="width:100%;display:block;margin-top:6px" value="'+esc(current)+'"></label>'+
 '<p class="tiny">Original lecture name: '+esc(oldTitle)+' · L'+esc(lecture)+'</p>'+
 '<input id="npRenameRef" type="hidden" value="'+esc(ref)+'">'+
 '<label>Password for owner publishing<input id="npRenamePassword" type="password" autocomplete="off" style="width:100%"></label>'+
 '<label>Token (only on first setup)<input id="npRenameToken" type="password" autocomplete="off" style="width:100%"></label>'+
 '<div class="buttonrow"><button data-np-rename-save="1">💾 Publish new name</button><button data-np-rename-cancel="1">← Cancel</button></div>'+
 '<p role="status" id="npRenameStatus"></p>');
}
async function publishConditionName(ref,title,token){
 const who=await github('https://api.github.com/user',token);
 if(who?.login?.toLowerCase()!==OWNER.toLowerCase())throw Error('Only the repository owner can publish.');
 const old=await file(MANIFEST,token),manifest=JSON.parse(decode(old.content));
 const requested=String(title||'').trim().replace(/\s+/g,' ');
 if(!requested||requested.length>180)throw Error('Use a name between 1 and 180 characters.');
 if(ref.startsWith('custom:')){
  const id=ref.slice(7),c=manifest.customConditions?.[id];
  if(!c)throw Error('Owner-created condition not found.');
  const same=(window.VPQ_PATH_LECTURE_LEARN?.[c.lecture]?.sections||[]).some(x=>x.title.toLowerCase()===requested.toLowerCase());
  if(same)throw Error('Another instructor condition already uses that name.');
  c.title=requested;
 }else{
  const pos=ref.indexOf('|'),lecture=ref.slice(0,pos),original=ref.slice(pos+1);
  const section=(window.VPQ_PATH_LECTURE_LEARN?.[lecture]?.sections||[]).find(x=>x.title===original);
  if(!section)throw Error('Original source condition has moved; reload and retry.');
  manifest.conditionTitleOverrides=manifest.conditionTitleOverrides||{};
  const duplicate=(window.VPQ_PATH_LECTURE_LEARN?.[lecture]?.sections||[]).some(x=>x.title!==original&&String(manifest.conditionTitleOverrides[lecture+'|'+x.title]||x.title).toLowerCase()===requested.toLowerCase());
  if(duplicate)throw Error('Another condition in this lecture already has that name.');
  if(requested===original)delete manifest.conditionTitleOverrides[ref];else manifest.conditionTitleOverrides[ref]=requested;
 }
 await put(MANIFEST,encode(JSON.stringify(manifest,null,2)+'\n'),old.sha,token,'Owner rename pathology condition '+ref);
 published=manifest;
}
function getCustomConditions(lecture){
 return Object.values(published.customConditions||{}).filter(c=>c&&c.title&&c.lecture===String(lecture)).map(c=>({
  title:c.title,slides:c.slides||'Owner-added teaching entry',
  points:[['Gross lesions',c.gross||'Not yet specified'],['Histopathology',c.histo||'Not yet specified'],['Mechanism / etiology',c.mechanism||'Not yet specified'],['Differential diagnosis and testing',c.differentials||'Not yet specified']],
  ownerCreated:true,ownerId:c.id
 }));
}
function newConditionEditor(lecture='68'){
 const options=[...Array.from({length:28},(_,i)=>String(i+31)),...Array.from({length:13},(_,i)=>String(i+67))];
 show('➕ Add pathology condition to lecture',
 '<p>Create a <b>lecture condition</b> (not a four-choice differential case). It will appear in the lecture inventory and coverage audit after owner publishing. Photographs can be added separately to the specimen atlas.</p>'+
 '<label>Lecture<select id="npCondLecture">'+options.map(n=>'<option value="'+n+'"'+(n===String(lecture)?' selected':'')+'>Lecture '+n+'</option>').join('')+'</select></label>'+
 '<label>Condition name<input id="npCondTitle" style="width:100%" placeholder="e.g. West Nile virus (WNV)"></label>'+
 '<label>Source slide / citation<input id="npCondSlides" style="width:100%" placeholder="Lecture 68 slide 20"></label>'+
 [['Gross description','npCondGross'],['Histopathology','npCondHisto'],['Why / mechanism','npCondMechanism'],['Differentials and confirmatory tests','npCondDifferentials']].map(([label,id])=>'<label style="display:block;margin:9px 0"><b>'+label+'</b><textarea id="'+id+'" rows="3" style="width:100%"></textarea></label>').join('')+
 '<div style="border:1px solid #cbd9e8;padding:10px;border-radius:10px"><b>Owner publishing</b><p style="font-size:12px">Enter your publishing password for the encrypted GitHub key; a token is needed only for first-time setup.</p><label>Password<input id="npCondPassword" type="password" autocomplete="off" style="width:100%"></label><label>Token (first setup only)<input id="npCondToken" type="password" autocomplete="off" style="width:100%"></label></div>'+
 '<div class="buttonrow"><button data-necro-condition-save="1">🚀 Publish condition</button><button data-necro-condition-cancel="1">← Back</button></div><p id="npCondStatus" role="status" aria-live="polite"></p>');
}
async function publishCondition(c,token){
 const who=await github('https://api.github.com/user',token);
 if(who?.login?.toLowerCase()!==OWNER.toLowerCase())throw Error('Only the repository owner can publish.');
 const old=await file(MANIFEST,token),manifest=JSON.parse(decode(old.content));
 manifest.customConditions=manifest.customConditions||{};
 const key=c.lecture+'|'+c.title.toLowerCase().replace(/\\s+/g,' ').trim();
 const existing=Object.values(manifest.customConditions).find(x=>x.lecture===c.lecture&&x.title.toLowerCase()===c.title.toLowerCase());
 if(existing)throw Error('This condition already exists as an owner-created entry. Avoid duplicates.');
 const canonical=(window.VPQ_PATH_LECTURE_LEARN?.[c.lecture]?.sections||[]).some(x=>String(x.title).toLowerCase()===c.title.toLowerCase());
 if(canonical)throw Error('This condition is already in the instructor lecture list. Open the existing condition instead.');
 const id='condition-'+c.lecture+'-'+c.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,55);
 c.id=id;manifest.customConditions[id]=c;
 await put(MANIFEST,encode(JSON.stringify(manifest,null,2)+'\n'),old.sha,token,'Owner add lecture condition '+id);
 published=manifest;return c;
}


/* Custom pathology specimen cards and reversible hiding share the authenticated owner manifest.
 * Neither operation alters instructor-authored disease source files or erases photographs. */
function getCustomSpecimens(){return Object.values(published.customSpecimens||{}).filter(c=>c&&c.id&&c.title);}
function getHiddenSpecimens(){return Array.isArray(published.hiddenSpecimens)?published.hiddenSpecimens:[];}
function newSpecimenEditor(kind='normal',lecture='67'){
 const normal=kind==='normal',lectures=[...Array.from({length:28},(_,i)=>String(i+31)),...Array.from({length:13},(_,i)=>String(i+67))];
 show('➕ Add '+(normal?'normal reference':'pathology specimen')+' card',
 '<p>Publish a permanent '+(normal?'healthy anatomy/histology reference':'gross and histology study specimen')+' to the <b>Specimen Cabinet</b>. A photo is optional: add gross and H&E images later using Edit / Publish Photos. Existing cards are never overwritten.</p>'+
 '<label>Card name<input id="npSpecTitle" style="display:block;width:100%" placeholder="e.g. Normal feline liver"></label>'+
 '<label>Lecture<select id="npSpecLecture" style="width:100%">'+lectures.map(n=>'<option value="'+n+'"'+(n===String(lecture)?' selected':'')+'>Lecture '+n+'</option>').join('')+'</select></label>'+
 '<label>Body system<input id="npSpecSystem" style="display:block;width:100%" placeholder="e.g. Nervous System"></label>'+
 '<label>Species / signalment<input id="npSpecSpecies" style="display:block;width:100%" placeholder="e.g. Dog / cat / horse"></label>'+
 [['Gross appearance','npSpecGross'],[normal?'Normal identification':'Morphologic diagnosis','npSpecDx'],['Histology','npSpecHisto'],[normal?'Normal vs abnormal comparison':'Why / pathogenesis','npSpecWhy']].map(([label,id])=>'<label style="display:block;margin:8px 0"><b>'+label+'</b><textarea id="'+id+'" style="width:100%" rows="3"></textarea></label>').join('')+
 '<label>Source / lecture slide<input id="npSpecSource" style="display:block;width:100%" placeholder="Lecture 67 slide 10 / approved reference"></label>'+
 '<div style="padding:10px;border:1px solid #cbd9e8;border-radius:9px"><b>Owner publishing</b><p class="tiny">Unlock your saved GitHub publishing key with its password; a token is required only on first setup.</p><label>Password<input id="npSpecPassword" type="password" autocomplete="off" style="width:100%"></label><label>GitHub token (first setup only)<input id="npSpecToken" type="password" autocomplete="off" style="width:100%"></label></div>'+
 '<div class="buttonrow"><button data-np-spec-create="'+(normal?'normal':'lesion')+'" style="background:#e5f6eb">🚀 Publish new card</button><button data-np-spec-cancel="1">← Back to cabinet</button></div><p id="npSpecStatus" role="status"></p>');
}
function hideSpecimenEditor(id,restore=false){
 const built=(window.VPQ_PATH_EXAM7_DATA||[]).find(x=>x.id===id),custom=getCustomSpecimens().find(x=>x.id===id);
 const card=built||custom;if(!card)return;
 show((restore?'↩ Restore':'🗂 Hide')+' specimen card',
 '<p><b>'+esc(card.title)+'</b></p>'+
 '<p>'+(restore?'Restoring this card will put it back in the Specimen Cabinet.':'This hides the card from the Specimen Cabinet and study unknowns. Original lecture notes and published photographs are preserved. You can restore it later from Manage hidden cards.')+'</p>'+
 '<input type="hidden" id="npSpecTarget" value="'+esc(id)+'">'+
 '<div style="padding:10px;border:1px solid #cbd9e8;border-radius:9px"><label>Publishing password<input id="npSpecPassword" type="password" autocomplete="off" style="width:100%"></label><label>GitHub token (first setup only)<input id="npSpecToken" type="password" autocomplete="off" style="width:100%"></label></div>'+
 '<div class="buttonrow"><button data-np-spec-visibility="'+(restore?'restore':'hide')+'" style="background:'+(restore?'#e5f6eb':'#fff0ed')+'">'+(restore?'↩ Restore card':'Hide this card')+'</button><button data-np-spec-cancel="1">Cancel</button></div><p id="npSpecStatus" role="status"></p>');
}
function hiddenSpecimenMenu(){
 const hidden=getHiddenSpecimens();
 const all=[...(window.VPQ_PATH_EXAM7_DATA||[]),...getCustomSpecimens()];
 show('🗂 Hidden specimen cards',
 '<p>These cards are hidden from both the normal reference and disease specimen lists, but remain recoverable, including previously published photos.</p>'+
 (hidden.length?hidden.map(id=>{const c=all.find(x=>x.id===id);return '<div style="display:flex;gap:8px;align-items:center;justify-content:space-between;border-bottom:1px solid #d8e2ec;padding:9px"><span>'+esc(c?.title||id)+'</span><button data-np-spec-restore="'+esc(id)+'">↩ Restore</button></div>'}).join(''):'<p>No hidden cards.</p>')+
 '<button data-np-spec-cancel="1">← Back to cabinet</button>');
}
async function publishSpecimen(c,token){
 const who=await github('https://api.github.com/user',token);
 if(who?.login?.toLowerCase()!==OWNER.toLowerCase())throw Error('Only the repository owner can publish cards.');
 const old=await file(MANIFEST,token),m=JSON.parse(decode(old.content));m.customSpecimens=m.customSpecimens||{};
 const original=[...(window.VPQ_PATH_EXAM7_DATA||[]),...Object.values(m.customSpecimens)];
 if(original.some(x=>x.title?.trim().toLowerCase()===c.title.toLowerCase()&&String(x.lecture)===c.lecture&&!!x.normal===c.normal))throw Error('A card with this name already exists in that lecture and tab. Edit the existing card instead.');
 const id=(c.normal?'normal-custom-':'specimen-custom-')+c.lecture+'-'+c.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,48);
 if(original.some(x=>x.id===id))throw Error('A card with this identifier already exists.');
 c.id=id;m.customSpecimens[id]=c;
 await put(MANIFEST,encode(JSON.stringify(m,null,2)+'\n'),old.sha,token,'Owner create specimen cabinet card '+id);
 published=m;return c;
}
async function setSpecimenVisibility(id,hidden,token){
 const who=await github('https://api.github.com/user',token);
 if(who?.login?.toLowerCase()!==OWNER.toLowerCase())throw Error('Only the repository owner can change published card visibility.');
 const old=await file(MANIFEST,token),m=JSON.parse(decode(old.content));
 const known=[...(window.VPQ_PATH_EXAM7_DATA||[]),...Object.values(m.customSpecimens||{})].some(c=>c.id===id);
 if(!known)throw Error('Specimen card not found; nothing was changed.');
 const hiddenIds=new Set(Array.isArray(m.hiddenSpecimens)?m.hiddenSpecimens:[]);
 if(hidden)hiddenIds.add(id);else hiddenIds.delete(id);
 m.hiddenSpecimens=[...hiddenIds];
 await put(MANIFEST,encode(JSON.stringify(m,null,2)+'\n'),old.sha,token,(hidden?'Owner hide ':'Owner restore ')+'specimen card '+id);
 published=m;return true;
}

function getCustomCases(){return Object.values(published.customCases||{}).filter(c=>c&&c.id&&Array.isArray(c.options)&&c.options.length===4)}
function getCase(id){return published.cases?.[id]||null}
function getSpecimen(id){return published.specimens?.[id]||null}
function getLecturePhoto(id){return photosOf(published.lectures?.[id])[0]||null}
function getLecturePhotos(id){return photosOf(published.lectures?.[id])}
function publishedCaseImage(id){return photosOf(getCase(id))[0]?.url||''}
function specimenPhoto(id){return photosOf(getSpecimen(id))[0]?.url||''}
function photosOf(record){return Array.isArray(record?.photos)?record.photos:(record?.photo?.url?[record.photo]:[])}
function photoTagsHTML(prefix,existingLectures=[],existingSystems=[]){
 const lectures=[...Array.from({length:28},(_,i)=>String(i+31)),...Array.from({length:13},(_,i)=>String(i+67))];
 const systems=['Urinary / Renal','Liver / Hepatobiliary','Pancreas / Endocrine','Endocrine / Adrenal / Thyroid / Pituitary','Hemolymphatic / Lymphoid','Muscle / Myopathy','Skeletal / Joints','Cardiovascular / Heart','Respiratory / Lungs / Airways','CNS / Neurology','Peripheral nerves','Skin / Integument','Male reproduction','Female reproduction / Mammary','Placenta / Fetus','Eye','Ear','Musculoskeletal','Other'];
 return '<fieldset style="border:1px solid #cbd9e8;border-radius:10px;margin:9px 0;padding:9px"><legend><b>Lecture & system tags</b></legend>'+
 '<p style="font-size:12px">Select all lectures where this image is relevant. Tags make an image findable without changing its original condition or source.</p>'+
 '<div style="display:flex;gap:9px;flex-wrap:wrap">'+lectures.map(n=>'<label style="font-size:12px"><input type="checkbox" data-np-tag-lecture="'+esc(prefix)+'" value="'+n+'"'+(existingLectures.includes(n)?' checked':'')+'> L'+n+'</label>').join('')+'</div>'+
 '<p style="font-size:12px;margin:9px 0 3px">Body systems (select more than one if needed)</p>'+
 '<div style="display:flex;gap:9px;flex-wrap:wrap">'+systems.map(n=>'<label style="font-size:12px"><input type="checkbox" data-np-tag-system="'+esc(prefix)+'" value="'+esc(n)+'"'+(existingSystems.includes(n)?' checked':'')+'> '+esc(n)+'</label>').join('')+'</div></fieldset>';
}
function tagsFrom(root,prefix){
 return {lectures:Array.from(root.querySelectorAll('[data-np-tag-lecture="'+prefix+'"]:checked')).map(x=>x.value),systems:Array.from(root.querySelectorAll('[data-np-tag-system="'+prefix+'"]:checked')).map(x=>x.value)};
}

function photoGrid(list,options={}){
 if(!list.length)return '';
 const forCase=options.caseViewer===true;
 return '<div class="'+(forCase?'vpq-case-photo-gallery':'vpq-photo-gallery')+'" style="display:grid;grid-template-columns:repeat(auto-fit,minmax('+(forCase?'220px':'160px')+',1fr));gap:10px;margin:10px 0">'+
 list.map((p,i)=>{
  const photoUrl=String(p.url||''),kind=String(p.type||'Photo');
  const label=kind.charAt(0).toUpperCase()+kind.slice(1)+(list.length>1?' '+(i+1):'');
  const button=forCase?'<button type="button" data-pathdiff-zoom="'+esc(photoUrl)+'" aria-label="Enlarge '+esc(label)+'" title="Click to enlarge" style="display:block;width:100%;padding:0;background:#fff;border:0;cursor:zoom-in;border-radius:8px;overflow:hidden"><img src="'+esc(photoUrl)+'" alt="'+esc(p.caption||label)+'" loading="lazy" style="display:block;width:100%;height:auto;min-height:215px;max-height:370px;object-fit:contain;background:#f9fcff"></button>':'<img src="'+esc(photoUrl)+'" alt="'+esc(p.caption||label)+'" loading="lazy" style="width:100%;height:165px;object-fit:contain">';
  const caption=String(p.caption||'').trim(),credit=String(p.credit||'').trim();
  const isUrl=v=>/^https?:\/\//i.test(v);
  const attribution=forCase?(credit?'<details style="margin-top:5px"><summary style="cursor:pointer;font-size:11px;color:#526d85">Source / credit</summary>'+(isUrl(credit)?'<a href="'+esc(credit)+'" target="_blank" rel="noopener noreferrer" style="display:block;font-size:11px;overflow-wrap:anywhere">Open source</a>':'<small style="display:block;overflow-wrap:anywhere">'+esc(credit)+'</small>')+'</details>':''):'<small>'+esc(credit)+'</small>';
  return '<figure class="'+(forCase?'vpq-case-photo-card':'')+'" style="padding:'+(forCase?'8px':'8px')+';border:1px solid #d4e2ed;border-radius:11px;background:#fff;margin:0;min-width:0">'+button+
  '<figcaption style="font-size:12px;padding:8px 4px 3px"><b>'+esc(label)+'</b>'+(forCase?'<span style="float:right;font-size:11px;color:#577392">⌕ Enlarge</span>':'')+
  (caption&&!isUrl(caption)?'<p style="font-size:11px;color:#516982;margin:5px 0;overflow-wrap:anywhere">'+esc(caption)+'</p>':'')+
  attribution+'</figcaption></figure>';
 }).join('')+'</div>';
}
function casePhotoHTML(id,options={}){const items=photosOf(getCase(id));return photoGrid(items.filter(p=>{const t=String(p.type||'').toLowerCase();return options.onlyHistology?t==='histology':options.onlyFollowup?t==='followup':options.includeHistology===false?t!=='histology'&&t!=='followup':t!=='followup'}),{caseViewer:true})}
function specimenPhotoHTML(id){return photoGrid(photosOf(getSpecimen(id)))}
/* Published-photo index: reuse references without duplicating images or changing their source diagnoses. */
let photoLecture='all',photoSystem='all',photoSearch='';
function getPhotoLibrary(){
 const baseCases=[...(window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[]),...getCustomCases()];
 const specimens=window.VPQ_PATH_EXAM7_DATA||[];
 const results=[];
 for(const group of ['cases','specimens','lectures']){
  for(const [id,record] of Object.entries(published[group]||{})){
   const parent=group==='cases'?baseCases.find(x=>x.id===id):group==='specimens'?specimens.find(x=>x.id===id):null;
   const homeLecture=String(parent?.lecture||(/L(\d+)/.exec(id)||[])[1]||'');
   const homeSystem=String(parent?.system||'');
   for(const [index,photo] of photosOf(record).entries()){
    if(!photo?.url)continue;
    const lectures=[...new Set([...(photo.lectures||[]).map(String),...(homeLecture?[homeLecture]:[])])];
    const systems=[...new Set([...(photo.systems||[]),...(homeSystem?[homeSystem]:[])])];
    results.push({id,group,index,title:record.title||parent?.title||id,photo,lectures,systems});
   }
  }
 }
 return results;
}
function photoLibrary(){
 const all=getPhotoLibrary();
 const selected=all.filter(x=>(photoLecture==='all'||x.lectures.includes(photoLecture))&&(photoSystem==='all'||x.systems.includes(photoSystem))&&(!photoSearch||[x.title,x.photo.caption,x.photo.credit,x.id].join(' ').toLowerCase().includes(photoSearch)));
 const allSystems=[...new Set(all.flatMap(x=>x.systems).filter(Boolean))].sort();
 show('📷 Published pathology photo library',
 '<p class="tiny">Filter published images by lecture or body system. The same photo can be tagged for multiple lectures; its original condition and credit stay attached. This includes only genuinely published photos, not empty image references.</p>'+
 '<div class="buttonrow"><button data-np-library-back="1">← Gross atlas</button><button data-np-library-differentials="1">Differential cases</button></div>'+
 '<label style="display:block">Lecture <select data-np-library-lecture="1" style="width:100%;padding:7px"><option value="all">All lectures</option>'+[...Array.from({length:28},(_,i)=>String(i+31)),...Array.from({length:13},(_,i)=>String(i+67))].map(n=>'<option value="'+n+'"'+(photoLecture===n?' selected':'')+'>L'+n+'</option>').join('')+'</select></label>'+
 '<label style="display:block">Body system <select data-np-library-system="1" style="width:100%;padding:7px"><option value="all">All systems</option>'+allSystems.map(n=>'<option value="'+esc(n)+'"'+(photoSystem===n?' selected':'')+'>'+esc(n)+'</option>').join('')+'</select></label>'+
 '<label style="display:block">Condition / photo search <input data-np-library-search="1" value="'+esc(photoSearch)+'" style="width:100%;padding:8px" placeholder="e.g. WNV, spinal cord, dermatitis"></label>'+
 '<p class="tiny">'+selected.length+' matching published image'+(selected.length===1?'':'s')+' ('+all.length+' total).</p>'+
 (selected.length?'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px">'+selected.map(x=>
 '<div style="border:1px solid #c5d6e5;border-radius:10px;padding:8px"><img src="'+esc(x.photo.url)+'" loading="lazy" alt="'+esc(x.photo.caption||x.title)+'" style="display:block;width:100%;height:175px;object-fit:contain"><b style="font-size:12px">'+esc(x.title)+'</b>'+
 '<small style="display:block">'+esc(x.photo.type||'Image')+' · '+esc(x.photo.caption||'No caption')+'</small>'+
 '<small style="display:block">L'+x.lectures.map(esc).join(', L')+(x.systems.length?' · '+x.systems.map(esc).join(' / '):'')+'</small>'+
 '<small style="display:block">Credit: '+esc(x.photo.credit||'not specified')+'</small>'+
 '<button data-np-library-open="'+esc(x.group+':'+x.id)+'" style="font-size:12px;margin-top:5px">Open source condition</button></div>').join('')+'</div>':'<p>No published images match these filters. Try All lectures / All systems, or publish a correctly attributed image from its source card.</p>'));
}

function getText(type,id){const r=type==='case'?getCase(id):type==='specimen'?getSpecimen(id):published.lectures?.[id];return r?.text||{}}
function show(title,body){api?.showModal(title,body);window.VPQ_PATH_RICH_TEXT?.install?.(api?.body)}
let draftState=null;

function caseEditorFields(edits){
 const groups=[
 {title:'1 · Patient signalment',description:'Short fields used in the patient header.',keys:[['age','Age'],['speciesName','Species'],['breed','Breed'],['sex','Sex'],['reproductiveStatus','Reproductive status']]},
 {title:'2 · Clinical presentation and pathology',description:'Edit the relevant clinical information without touching photos.',keys:[['history','History, signs and initial diagnostic findings'],['gross','Gross lesion description'],['histo','Microscopic / histology findings'],['morph','Morphologic diagnosis'],['mechanism','Pathogenesis and explanation'],['tests','Additional tests and confirmation']]}
 ];
 const parts=groups.map((g,section)=>'<section class="vpq-case-edit-group"><h4>'+g.title+'</h4><small>'+g.description+'</small><div class="'+(section===0?'vpq-case-edit-signalment':'')+'">'+g.keys.map(([k,label])=>'<label><b>'+label+'</b>'+(section===0?'<input data-np-text="'+k+'" value="'+esc(edits[k]||'')+'" placeholder="'+label+'">':'<textarea data-np-text="'+k+'" rows="'+(k==='history'?5:3)+'">'+esc(edits[k]||'')+'</textarea>')+'</label>').join('')+'</div></section>').join('');
 return parts+'<details class="vpq-case-edit-legacy"><summary>Original signalment summary (legacy field)</summary><textarea data-np-text="species" rows="2">'+esc(edits.species||'')+'</textarea></details>';
}
async function renameCaseEditor(id){
 const base=[...(window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[]),...getCustomCases()].find(x=>x.id===id);
 if(!base){show('Case unavailable','<p>Case not found.</p>');return}
 pending={type:'case',id,title:base.title};
 const present=String(getText('case',id)?.title||base.title||'');
 const saved=!!window.VPQ_OWNER_KEY_VAULT?.exists?.();
 show('✏️ Rename differential diagnosis case',
 '<p style="font-size:13px">Give this case a <b>short, readable display title</b>. This will not modify its patient information, options, specimen photos or ID.</p>'+
 '<label style="display:block;font-size:13px;font-weight:800">Case title<input data-np-text="title" maxlength="180" value="'+esc(present)+'" style="display:block;width:100%;padding:10px;margin-top:6px" placeholder="e.g. Canine Sertoli cell tumor"></label>'+
 '<p class="tiny">Original uploaded title: '+esc(base.title||'')+'</p>'+
 '<label style="display:block;font-size:12px;margin-top:8px">Publishing password<input id="npOwnerPassword" type="password" autocomplete="off" style="display:block;width:100%;padding:9px"></label>'+
 (saved?'':'<label style="display:block;font-size:12px;margin-top:8px">First-time owner GitHub token<input id="npOwnerToken" type="password" autocomplete="off" style="display:block;width:100%;padding:9px"></label>')+
 '<div class="buttonrow"><button data-necro-owner-publish="1">💾 Publish title</button><button data-np-case-rename-cancel="1">← Cancel</button></div>'+
 '<p id="npOwnerResult" role="status" style="font-size:12px"></p>');
}
async function editor(type,id){
 const lp=type==='lecture'?/^L(\d+)-S(\d+)-P([01])$/.exec(id):null;
 const lesson=lp?window.VPQ_PATH_LECTURE_LEARN?.[lp[1]]?.sections?.[Number(lp[2])]:null;
 const base=type==='lecture'&&lesson?{id,title:'L'+lp[1]+' · '+lesson.title+' · image slot '+(Number(lp[3])+1)}:
 type==='case'?[...(window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[]),...getCustomCases()].find(x=>x.id===id):[...(window.VPQ_PATH_EXAM7_DATA||[]),...getCustomSpecimens()].find(x=>x.id===id);
 if(!base){show('Entry unavailable','<p>The selected entry could not be found.</p>');return}
 pending={type,id,title:base.title};
 const cur=type==='case'?getCase(id):type==='specimen'?getSpecimen(id):published.lectures?.[id]||{};
 const existing=photosOf(cur);
 const draft=type==='case'?window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.draftPhoto?.(id):type==='lecture'?await window.VPQ_PATH_INLINE_PHOTOS?.draftPhoto?.(lp[1],lp[2],lp[3]):window.VPQ_PATH_EXAM7?.draftPhoto?.(id);
 pending.localPhoto=String(draft||'').startsWith('data:image/jpeg;base64,')?draft:'';
 const localText=type==='specimen'?window.VPQ_PATH_EXAM7?.draftText?.(id):type==='case'?window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.draftText?.(id):null;
 const edits={...base,...(cur?.text||{}),...(localText||{})};
 if(type==='specimen'){const tags=window.VPQ_PATH_ETIOLOGY?.forCard?.(edits);if(tags){if(edits.etiologyCategories===undefined)edits.etiologyCategories=tags.categories.join(', ');if(edits.etiologyAgents===undefined)edits.etiologyAgents=tags.agents;if(edits.etiologyCertainty===undefined)edits.etiologyCertainty=tags.certainty;}}
 const fields=type==='case'?['species','age','speciesName','breed','sex','reproductiveStatus','history','gross','histo','morph','mechanism','tests']:type==='specimen'?['gross','dx','histo','why','visualClue','compare','notes']:[];
 const saved=!!window.VPQ_OWNER_KEY_VAULT?.exists?.();
 draftState={};
 show(type==='case'?'✏️ Case editor · Lecture '+esc(base.lecture||''):'✏️ Edit & publish · '+esc(base.title),
 '<p style="padding:9px;background:#f3f8fd;border:1px solid #ccdeeb;border-radius:9px;font-size:12px"><b>Case editor:</b> Update only what you want. Existing photos stay unless you remove or replace them. Multiple image uploads are available in the photo section below.</p>'+
 (type!=='lecture'?'<label style="display:block;margin:9px 0"><b>Case title / editor label</b><input data-np-text="title" maxlength="180" style="width:100%;display:block;margin-top:4px" value="'+esc(edits.title||base.title)+'" placeholder="Condition or specimen name"></label><p class="tiny">Renaming keeps the existing card ID, photos, captions, species tags and case links. Publish your name change using the same password.</p>':'')+
 (type==='case'?caseEditorFields(edits):fields.length?'<h4>📝 Teaching content (editable independently of photos)</h4>'+fields.map(k=>'<label style="display:block;margin:7px 0"><b>'+esc(k.replace(/^\w/,c=>c.toUpperCase()))+'</b><textarea data-np-text="'+k+'" rows="3" style="display:block;width:100%">'+esc(edits[k]||'')+'</textarea></label>').join(''):'')+
 (type==='case'?'<h4>3 · Differential diagnoses & reasoning</h4><p class="tiny">Edit each answer and its supporting evidence. Mark exactly one as the best-supported diagnosis. Changes will publish with the case.</p>'+((edits.options||[]).map((o,i)=>'<div style="border:1px solid #cad9e7;border-radius:9px;padding:9px;margin:8px 0"><label style="font-weight:800"><input type="radio" name="np-best-option" value="'+i+'" '+(o.role==='best'||o.name===edits.best?'checked':'')+'> Best diagnosis '+(i+1)+'</label><label style="display:block;margin:5px 0">Diagnosis<input data-np-option-name="'+i+'" value="'+esc(o.name||'')+'" style="display:block;width:100%;padding:7px"></label>'+[['supports','Why it fits'],['against','Why less likely'],['hist','Histology distinction']].map(([k,label])=>'<label style="display:block;margin:5px 0">'+label+'<textarea data-np-option-'+k+'="'+i+'" rows="2" style="display:block;width:100%">'+esc(o[k]||'')+'</textarea></label>').join('')+'</div>').join('')):'')+
 (type==='specimen'?'<h4>✅ Structured classifications — select from the options</h4>'+(window.VPQ_PATH_ETIOLOGY?.editorHTML?.(edits)||'')+(window.VPQ_PATH_ATLAS_META?.editorHTML?.(edits)||''):'')+
 
 '<h4>4 · Photos · Currently published ('+existing.length+')</h4>'+
 (existing.length?'<p class="tiny"><b>Edit any existing photo below.</b> Change its caption, credit, source, or type without adding a new image. All other photos and your teaching text stay in place unless you explicitly remove or replace them.</p>':'')+
 (existing.length?existing.map((p,i)=>'<div style="display:flex;gap:9px;align-items:start;padding:8px;border:1px solid #cdd9e6;border-radius:9px;margin:6px 0"><img src="'+esc(p.url)+'" style="width:90px;height:85px;object-fit:contain" alt="'+esc(p.caption||'Published pathology photo')+'"><div style="flex:1;min-width:0;font-size:12px"><b>Published photo '+(i+1)+'</b>'+
 '<label style="display:block;margin:5px 0">Caption for this photo<textarea rows="2" data-np-photo-caption="'+i+'" style="display:block;width:100%">'+esc(p.caption||'')+'</textarea></label>'+
 '<label style="display:block;margin:5px 0">Photo credit / license<input data-np-photo-credit="'+i+'" style="display:block;width:100%;padding:6px" value="'+esc(p.credit||'')+'"></label>'+
 '<label style="display:block;margin:5px 0">Original source URL<input data-np-photo-source="'+i+'" data-np-original-source="'+esc(p.source||'')+'" style="display:block;width:100%;padding:6px" placeholder="https://… (if applicable)" value="'+esc(p.source||'')+'"></label>'+
 '<label style="display:block;margin:5px 0">Photo type<select data-np-photo-type="'+i+'" style="display:block;width:100%;padding:6px">'+['gross','histology','clinical','illustration','followup'].map(t=>'<option value="'+t+'"'+(t===(p.type||'gross')?' selected':'')+'>'+({gross:'Gross',histology:'Histology / H&E',clinical:'Clinical',illustration:'Illustration',followup:'Follow-up / outcome'}[t])+'</option>').join('')+'</select></label>'+
 photoTagsHTML('existing-'+i,p.lectures||[],p.systems||[])+
 '<label style="display:block;margin-top:7px"><input type="checkbox" data-np-remove="'+i+'"> Remove this published photo</label></div></div>').join(''):'<p>No published photos yet.</p>')+
 (existing.length?'<label style="display:block;margin:8px 0"><input type="checkbox" id="npOwnerReplaceAll"> Replace all published photos with new uploads (intentional)</label>':'')+
 '<h4>Add photos (optional)</h4>'+photoTagsHTML('new',[String(base.lecture||lp?.[1]||'68')],base.system?[String(base.system)]:[])+ '<p style="font-size:12px">For local image files, just select photos, confirm publishing permission, and enter your publishing password. Captions, photo credit and source are optional. External image links still need the source page.</p>'+
 (pending.localPhoto?'<label style="display:block"><input type="checkbox" id="npOwnerUseDraft"> Include my saved local draft photo</label><img src="'+esc(pending.localPhoto)+'" alt="Local photo draft" style="max-width:100%;max-height:110px;object-fit:contain">':'')+
 '<label style="display:block">Select one or several images<input id="npOwnerFiles" type="file" multiple accept="image/jpeg,image/png,image/webp" style="display:block;width:100%;margin:6px 0"></label>'+
 '<div id="npOwnerFileDetails" style="margin:8px 0"></div>'+
 '<label style="display:block">Or add a direct HTTPS image URL<input id="npOwnerImageUrl" type="url" placeholder="https://example.org/image.jpg" style="width:100%;padding:8px"></label>'+
 '<label style="display:block">Type of new photos<select id="npOwnerKind" style="display:block;width:100%;padding:8px"><option value="gross">Gross</option><option value="histology">Histology / H&E</option><option value="clinical">Clinical</option><option value="illustration">Illustration</option><option value="followup">Follow-up / outcome (hidden until comparison)</option></select></label>'+
 '<label style="display:block">Caption (optional)<textarea id="npOwnerCaption" rows="2" style="width:100%" placeholder="Species, tissue, lesion and stain"></textarea></label>'+
 '<label style="display:block">Source URL (required only for an external image link)<input id="npOwnerSource" type="url" style="width:100%;padding:8px" placeholder="https://..."></label>'+
 '<label style="display:block">Photo credit or license (optional for uploaded files)<input id="npOwnerCredit" style="width:100%;padding:8px" placeholder="Photographer / license"></label>'+
 '<label style="display:block;margin:9px 0"><input type="checkbox" id="npOwnerRights"> I have the rights or permission to publish these new images publicly</label>'+
 '<div style="padding:9px;border-radius:9px;background:#f1f6ff"><b>Owner publishing authentication</b><p style="font-size:12px">Uses the same encrypted GitHub key as your other atlases. '+(saved?'Enter your existing publishing password.':'If no key is saved, enter a fine-grained GitHub token for first-time setup (Contents: Read/write).')+'</p>'+
 '<label>Publishing password<input id="npOwnerPassword" type="password" autocomplete="off" style="width:100%;padding:8px"></label>'+
 '<label>GitHub token (only first setup / replacement)<input id="npOwnerToken" type="password" autocomplete="off" style="width:100%;padding:8px"></label></div>'+
 '<div class="buttonrow" style="margin:12px 0"><button data-necro-owner-publish="1">🚀 Publish Now</button><button data-necro-owner-close="1">← Back</button></div>'+
 '<p id="npOwnerResult" role="status" aria-live="polite" style="font-size:12px"></p>');
}


function newCaseEditor(seed={}){
 const lectures=[...Array.from({length:28},(_,i)=>String(i+31)),...Array.from({length:13},(_,i)=>String(i+67))];
 show('➕ Create differential diagnosis card',
 '<p>Create a permanent teaching case with <b>four genuinely competing diagnoses</b>. The first is the best-supported choice. Photos are optional and can be added later through the normal multi-photo editor.</p>'+
 '<label>Card title<input id="ncTitle" style="width:100%" value="'+esc(seed.title||'')+'" placeholder="e.g. Meningitis: purulent versus nonsuppurative"></label>'+
 '<label>Lecture<select id="ncLecture">'+lectures.map(n=>'<option value="'+n+'"'+(n===(seed.lecture||'68')?' selected':'')+'>Lecture '+n+'</option>').join('')+'</select></label>'+
 '<label>System<input id="ncSystem" style="width:100%" value="CNS / Meninges"></label>'+
 '<label>Signalment summary (required)<textarea id="ncSpecies" rows="2" style="width:100%" placeholder="3-year-old spayed female Labrador Retriever"></textarea></label>'+
 '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px"><label>Age<input id="ncAge" style="width:100%" placeholder="3 years"></label><label>Species<input id="ncSpeciesName" style="width:100%" placeholder="Dog"></label><label>Breed<input id="ncBreed" style="width:100%" placeholder="Labrador Retriever"></label><label>Sex<input id="ncSex" style="width:100%" placeholder="Female"></label><label>Reproductive status<input id="ncReproductiveStatus" style="width:100%" placeholder="Spayed, neutered, intact, gelding"></label></div>'+

 '<label>History<textarea id="ncHistory" rows="3" style="width:100%"></textarea></label>'+
 '<label>Gross lesions / localization<textarea id="ncGross" rows="3" style="width:100%"></textarea></label>'+
 '<label>Histology (revealed after differential selection)<textarea id="ncHisto" rows="3" style="width:100%"></textarea></label>'+
 '<label>Morphologic diagnosis<textarea id="ncMorph" rows="2" style="width:100%"></textarea></label>'+
 '<label>Why / pathogenesis<textarea id="ncMechanism" rows="3" style="width:100%"></textarea></label>'+
 '<label>Confirmation and next tests<textarea id="ncTests" rows="2" style="width:100%"></textarea></label>'+
 '<label>Lecture slide or reference<input id="ncRef" style="width:100%" placeholder="Lecture 68 slide 7"></label>'+
 Array.from({length:4},(_,i)=>'<div style="border:1px solid #cad7e5;border-radius:10px;padding:9px;margin:8px 0"><b>'+(i===0?'★ Best-supported diagnosis':'Alternative differential '+i)+'</b>'+
 '<label>Diagnosis name<input data-nc-name="'+i+'" style="width:100%"></label>'+
 '<label>Why it fits<textarea data-nc-supports="'+i+'" rows="2" style="width:100%"></textarea></label>'+
 '<label>Why less likely / limitations<textarea data-nc-against="'+i+'" rows="2" style="width:100%"></textarea></label>'+
 '<label>Histology discriminator<textarea data-nc-hist="'+i+'" rows="2" style="width:100%"></textarea></label></div>').join('')+
 '<div style="background:#f1f6ff;padding:9px;border-radius:9px"><p><b>Owner publishing</b>: unlock your existing saved GitHub publishing key. No photograph is required.</p>'+
 '<label>Publishing password<input id="ncPassword" type="password" autocomplete="off" style="width:100%"></label>'+
 '<label>GitHub token (only if not saved)<input id="ncToken" type="password" autocomplete="off" style="width:100%"></label></div>'+
 '<div class="buttonrow"><button data-necro-create-submit="1">🚀 Publish New Card</button><button data-necro-create-cancel="1">← Cancel</button></div>'+
 '<p id="ncStatus" role="status" aria-live="polite" style="color:#6e3e17"></p>');
}
function caseForm(){
 const root=api.body,el=id=>root.querySelector('#'+id),val=id=>String(el(id)?.value||'').trim();
 const fields=['Title','Lecture','System','Species','Age','SpeciesName','Breed','Sex','ReproductiveStatus','History','Gross','Histo','Morph','Mechanism','Tests','Ref'];
 const values=Object.fromEntries(fields.map(x=>[x.charAt(0).toLowerCase()+x.slice(1),val('nc'+x)]));
 const opts=Array.from({length:4},(_,i)=>Object.fromEntries(['name','supports','against','hist'].map(k=>[k,String(root.querySelector('[data-nc-'+k+'="'+i+'"]')?.value||'').trim()])));
 if(!values.title||!values.species||!values.history||!values.gross||!values.histo||!values.morph||!values.mechanism||!values.tests||!values.ref)throw Error('Complete all teaching fields, including the reference.');
 if(opts.some(x=>Object.values(x).some(y=>!y)))throw Error('Complete all four diagnosis names, supporting evidence, limitations and histology.');
 if(new Set(opts.map(x=>x.name.toLowerCase())).size!==4)throw Error('The four differential diagnoses must be distinct.');
 if(!/^(67|68|69|70|71|72|73|74|75|76|77|78|79)$/.test(values.lecture))throw Error('Choose a valid lecture.');
 return {lecture:values.lecture,system:values.system||'Pathology',title:values.title.slice(0,180),species:values.species.slice(0,400),age:values.age.slice(0,80),speciesName:values.speciesName.slice(0,80),breed:values.breed.slice(0,100),sex:values.sex.slice(0,60),reproductiveStatus:values.reproductiveStatus.slice(0,80),history:values.history.slice(0,3500),gross:values.gross.slice(0,3500),histo:values.histo.slice(0,3500),morph:values.morph.slice(0,3500),mechanism:values.mechanism.slice(0,3500),tests:values.tests.slice(0,3500),ref:values.ref.slice(0,350),best:opts[0].name.slice(0,220),options:opts.map((x,i)=>({...x,role:i===0?'best':'less'}))};
}
async function publishNewCase(c,token){
 const who=await github('https://api.github.com/user',token);
 if(who?.login?.toLowerCase()!==OWNER.toLowerCase())throw Error('The publishing token must belong to the repository owner.');
 const old=await file(MANIFEST,token),m=JSON.parse(decode(old.content));
 m.customCases=m.customCases||{};
 const slug=c.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48)||'new-case';
 const id='custom-'+c.lecture+'-'+slug;
 const existing=[...(window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[]),...Object.values(m.customCases)];
 if(existing.some(x=>x.id===id))throw Error('A card with this title already exists. Please choose a distinct title or edit the existing card.');
 c.id=id;m.customCases[id]=c;
 await put(MANIFEST,encode(JSON.stringify(m,null,2)+'\n'),old.sha,token,'Owner created necropsy differential card '+id);
 published=m;return c;
}

async function github(path,token,method='GET',payload=null,missing=false){
 const r=await fetch(path,{method,headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28',...(payload?{'Content-Type':'application/json'}:{})},...(payload?{body:JSON.stringify(payload)}:{})});
 if(missing&&r.status===404)return null;
 if(!r.ok){let detail='';try{detail=(await r.json())?.message||''}catch{}throw Error('GitHub rejected '+method+' ('+r.status+'). '+String(detail).slice(0,220)+' Check owner access, token expiry and Contents: Read/write.');}
 return r.json();
}
async function file(path,token,missing=false){return github(ROOT+path+'?ref=main',token,'GET',null,missing)}
async function put(path,contents,sha,token,msg){return github(ROOT+path,token,'PUT',{message:msg,content:contents,branch:'main',...(sha?{sha}:{})})}

function readFields(){
 const root=api.body,el=id=>root.querySelector('#'+id);
 const files=Array.from(el('npOwnerFiles')?.files||[]);
 const filesMeta=files.map((file,i)=>({name:file.name,caption:String(root.querySelector('[data-np-file-caption="'+i+'"]')?.value||'').trim(),kind:root.querySelector('[data-np-file-kind="'+i+'"]')?.value||'gross'}));
 const draftData=el('npOwnerUseDraft')?.checked&&pending?.localPhoto?pending.localPhoto:'';
 const external=String(el('npOwnerImageUrl')?.value||'').trim();
 const source=String(el('npOwnerSource')?.value||'').trim();
 const credit=String(el('npOwnerCredit')?.value||'').trim();
 const caption=String(el('npOwnerCaption')?.value||'').trim();
 const kind=el('npOwnerKind')?.value||'gross',replaceAll=!!el('npOwnerReplaceAll')?.checked;
 const remove=Array.from(root.querySelectorAll('[data-np-remove]:checked')).map(x=>Number(x.dataset.npRemove));
 const edits={};root.querySelectorAll('[data-np-text]').forEach(x=>{edits[x.dataset.npText]=String(x.value||'').slice(0,9000)});
 if(pending?.type==='case'){
  const optFields=Array.from(root.querySelectorAll('[data-np-option-name]'));
  if(optFields.length){
   const bestIndex=Number(root.querySelector('input[name="np-best-option"]:checked')?.value??-1);
   if(bestIndex<0||bestIndex>=optFields.length)throw Error('Select the best-supported diagnosis.');
   edits.options=optFields.map((field,i)=>{
    const pick=name=>String(root.querySelector('[data-np-option-'+name+'="'+i+'"]')?.value||'').trim().slice(0,9000);
    return {name:String(field.value||'').trim().slice(0,500),supports:pick('supports'),against:pick('against'),hist:pick('hist'),role:i===bestIndex?'best':'less'};
   });
   if(edits.options.some(o=>!o.name))throw Error('Every answer choice needs a diagnosis name.');
   edits.best=edits.options[bestIndex].name;
  }
 }
 if(pending?.type==='specimen'){
  Object.assign(edits,window.VPQ_PATH_ETIOLOGY?.readEditor?.(root)||{},window.VPQ_PATH_ATLAS_META?.readEditor?.(root)||{});
 }
 if(pending?.type!=='lecture'){
  const requested=String(edits.title||'').trim().replace(/\s+/g,' ');
  if(!requested||requested.length>180)throw Error('Enter a card name between 1 and 180 characters.');
  edits.title=requested;
 }
 const tags=tagsFrom(root,'new');
 const existingTags=Array.from(root.querySelectorAll('[data-np-remove]')).map(x=>tagsFrom(root,'existing-'+x.dataset.npRemove));
 const existingPhotoEdits=Array.from(root.querySelectorAll('[data-np-photo-caption]')).map((x,i)=>({
  caption:String(x.value||'').trim().slice(0,1000),
  credit:String(root.querySelector('[data-np-photo-credit="'+i+'"]')?.value||'').trim().slice(0,500),
  source:String(root.querySelector('[data-np-photo-source="'+i+'"]')?.value||'').trim().slice(0,1200),
  type:String(root.querySelector('[data-np-photo-type="'+i+'"]')?.value||'gross')
 }));
 for(const p of existingPhotoEdits){
  const original=root.querySelector('[data-np-photo-source="'+existingPhotoEdits.indexOf(p)+'"]')?.dataset.npOriginalSource||'';
  if(p.source!==original&&p.source&&!goodUrl(p.source))throw Error('A changed photo source must use HTTPS, or be left blank.');
  if(!['gross','histology','clinical','illustration','followup'].includes(p.type))throw Error('Select a valid photo type.');
 }

 const newCount=files.length+(draftData?1:0)+(external?1:0);
 if(files.length>12)throw Error('Please select at most 12 files per upload.');
 for(const file of files)if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>20000000)throw Error('Use JPEG, PNG or WebP photos under 20 MB each.');
 if(external&&!goodUrl(external))throw Error('Direct photo links must begin with https://');
 if(source&&!goodUrl(source))throw Error('The source URL must begin with https://, or leave it empty for photos you have permission to upload directly.');
 if(newCount&&!el('npOwnerRights')?.checked)throw Error('Please check the permission-to-publish box for the new photo(s).');
 if(external&&!source)throw Error('For an external image link, enter the original source page URL.');
 if(!newCount&&!Object.keys(edits).length&&!replaceAll&&!remove.length)throw Error('Choose a photo or edit text before publishing.');
 if(replaceAll&&!newCount)throw Error('To replace all photos, select replacement images first. To remove one, use its Remove checkbox.');
 // Uploaded images can be published without filling the shared caption/credit again.
 // Retain the owner confirmation, but do not falsely assert authorship of the images.
 return {files,filesMeta,draftData,external:goodUrl(external),source:goodUrl(source),
  credit:(credit||'Owner-supplied image; publication rights confirmed').slice(0,500),
  caption:(caption||'Pathology study reference').slice(0,1000),
  kind,replaceAll,remove,edits,newCount,tags,existingTags,existingPhotoEdits};
}

async function imageBase64(f){
 const img=await new Promise((resolve,reject)=>{let obj=new Image(),u=URL.createObjectURL(f);obj.onload=()=>{URL.revokeObjectURL(u);resolve(obj)};obj.onerror=()=>{URL.revokeObjectURL(u);reject(Error('Image could not be opened.'))};obj.src=u});
 const cv=document.createElement('canvas'),scale=Math.min(1,1800/Math.max(img.naturalWidth,img.naturalHeight));
 cv.width=Math.max(1,Math.round(img.naturalWidth*scale));cv.height=Math.max(1,Math.round(img.naturalHeight*scale));
 cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
 let output=cv.toDataURL('image/jpeg',0.8);
 if(output.length>2000000)output=cv.toDataURL('image/jpeg',0.62);
 if(output.length>4500000)throw Error('Photo is still too large after compression. Please crop or resize it.');
 return output.split(',')[1];
}

async function publish(job,fields,token,update){
 const who=await github('https://api.github.com/user',token);
 if(who?.login?.toLowerCase()!==OWNER.toLowerCase())throw Error('Only the repository owner may publish.');
 const old=await file(MANIFEST,token);
 const manifest=JSON.parse(decode(old.content));
 if(!manifest?.cases||!manifest?.specimens)throw Error('Published necropsy manifest is invalid.');
 manifest.lectures=manifest.lectures||{};
 const dir=job.type==='case'?'cases':job.type==='lecture'?'lectures':'specimens';
 const prev=manifest[dir][job.id]||{},oldPhotos=photosOf(prev);
 let photos=fields.replaceAll?[]:oldPhotos.map((p,i)=>({...p,...(fields.existingTags?.[i]||{}),...(fields.existingPhotoEdits?.[i]||{})})).filter((p,i)=>!fields.remove.includes(i));
 const incoming=[...fields.files.map((f,i)=>({file:f,name:f.name,caption:fields.filesMeta[i]?.caption||'',kind:fields.filesMeta[i]?.kind||fields.kind})),...(fields.draftData?[{data:fields.draftData,name:'saved-local-draft.jpg'}]:[]),...(fields.external?[{url:fields.external,name:'linked-photo'}]:[])];
 if(photos.length+incoming.length>30)throw Error('This condition can hold up to 30 published photos; remove some first.');
 for(let i=0;i<incoming.length;i++){
  const item=incoming[i];let url=item.url;
  if(!url){
   const target='necropsy-photos/'+dir+'/'+job.id+'-'+Date.now()+'-'+i+'.jpg';
   update('Uploading new photograph '+(i+1)+' of '+incoming.length+'…');
   const contents=item.file?await imageBase64(item.file):item.data.split(',')[1];
   await put(target,contents,null,token,'Owner-publish necropsy image '+job.id);
   url='https://raw.githubusercontent.com/'+OWNER+'/'+REPO+'/main/'+target;
  }
  photos.push({url,source:fields.source,credit:fields.credit,
   caption:(item.caption||fields.caption)+(incoming.length>1?' · '+item.name:''),type:item.kind||fields.kind,external:!!item.url,lectures:fields.tags.lectures,systems:fields.tags.systems,conditionId:job.id});
 }
 const textEdits=fields.edits||{};
 const newTitle=job.type==='lecture'?job.title:String(textEdits.title||prev?.text?.title||prev.title||job.title).trim();
 if(job.type!=='lecture'){
  if(!newTitle||newTitle.length>180)throw Error('Name cannot be empty or exceed 180 characters.');
  const lecture=String((job.type==='specimen'?[...(window.VPQ_PATH_EXAM7_DATA||[]),...getCustomSpecimens()]:[...(window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[]),...getCustomCases()]).find(x=>x.id===job.id)?.lecture||'');
  const catalog=job.type==='specimen'?[...(window.VPQ_PATH_EXAM7_DATA||[]),...getCustomSpecimens()]:[...(window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[]),...getCustomCases()];
  const duplicate=catalog.find(x=>x.id!==job.id&&String(x.lecture)===lecture&&String((manifest[dir][x.id]?.text?.title||manifest[dir][x.id]?.title||x.title)||'').trim().toLowerCase()===newTitle.toLowerCase());
  if(duplicate)throw Error('Another card in this lecture already has that name.');
  if(job.type==='specimen'&&manifest.customSpecimens?.[job.id])manifest.customSpecimens[job.id].title=newTitle;
  if(job.type==='case'&&manifest.customCases?.[job.id])manifest.customCases[job.id].title=newTitle;
 }
 const entry={...prev,title:newTitle,photos,photo:photos[0]||null,text:{...(prev.text||{}),...textEdits},updated:new Date().toISOString(),approvedBy:OWNER};
 manifest[dir][job.id]=entry;
 update('Publishing '+(incoming.length?incoming.length+' new image(s) and ':'')+'your edits…');
 await put(MANIFEST,encode(JSON.stringify(manifest,null,2)+'\n'),old.sha,token,'Owner publish '+job.type+' '+job.id+' (photos/text)');
 update('Verifying published photo record on GitHub…');
 const verifiedFile=await file(MANIFEST,token),verified=JSON.parse(decode(verifiedFile.content));
 const saved=verified?.[dir]?.[job.id];
 if(!saved||!Array.isArray(saved.photos)||saved.photos.length!==photos.length||photos.some((p,i)=>saved.photos[i]?.url!==p.url)){
  throw Error('Published record could not be verified. Reopen the card before retrying; some changes may already be saved.');
 }
 published=verified;
 return {added:incoming.length,retained:photos.length-incoming.length,textFields:Object.keys(textEdits).length};
}

function init(context){
 api=context;
 if(context.body.__vpqNecroOwnerInit)return;
 context.body.__vpqNecroOwnerInit=true;
 load();
 context.body.addEventListener('click',ev=>{
 const caseCancel=ev.target.closest('[data-np-case-rename-cancel]');
 if(caseCancel){ev.preventDefault();ev.stopImmediatePropagation();return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.openCase?.(pending?.id)}
 const b=ev.target.closest('[data-np-rename-save],[data-np-rename-cancel]');if(!b)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 if(b.dataset.npRenameCancel!==undefined)return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.openConditionInventory?.();
 if(b.disabled)return;
 const root=context.body,ref=String(root.querySelector('#npRenameRef')?.value||''),title=String(root.querySelector('#npRenameTitle')?.value||'').trim();
 let password=String(root.querySelector('#npRenamePassword')?.value||''),token=String(root.querySelector('#npRenameToken')?.value||'');
 root.querySelector('#npRenamePassword').value='';root.querySelector('#npRenameToken').value='';
 const stat=root.querySelector('#npRenameStatus');b.disabled=true;if(stat)stat.textContent='Publishing name…';
 (async()=>{
  const vault=window.VPQ_OWNER_KEY_VAULT;
  if(!token){if(!vault?.exists?.())throw Error('No saved publishing key. Enter your token for first setup.');token=await vault.unlock(password);}
  await publishConditionName(ref,title,token);
  if(vault&&!vault.exists()&&password)await vault.store(token,password);
  window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.openConditionInventory?.();
 })().catch(e=>{if(stat)stat.textContent='Rename failed: '+e.message+' Your original name is unchanged.'}).finally(()=>{password='';token='';if(b.isConnected)b.disabled=false});
 },true);
 context.body.addEventListener('click',ev=>{
  const button=ev.target.closest('[data-np-spec-create],[data-np-spec-visibility],[data-np-spec-cancel],[data-np-spec-restore]');
  if(!button)return;
  ev.preventDefault();ev.stopImmediatePropagation();
  if(button.dataset.npSpecCancel!==undefined)return window.VPQ_PATH_EXAM7?.showTab?.(window.VPQ_PATH_EXAM7?.activeTab?.()||'lesions');
  if(button.dataset.npSpecRestore!==undefined)return hideSpecimenEditor(button.dataset.npSpecRestore,true);
  if(button.disabled)return;
  const root=context.body,v=id=>String(root.querySelector('#'+id)?.value||'').trim();
  const create=button.dataset.npSpecCreate!==undefined,hidden=button.dataset.npSpecVisibility==='hide';
  const kind=button.dataset.npSpecCreate;
  const card=create?{title:v('npSpecTitle'),lecture:v('npSpecLecture'),system:v('npSpecSystem'),species:v('npSpecSpecies'),gross:v('npSpecGross'),dx:v('npSpecDx'),histo:v('npSpecHisto'),why:v('npSpecWhy'),source:v('npSpecSource'),normal:kind==='normal'}:null;
  const id=v('npSpecTarget'),status=root.querySelector('#npSpecStatus');
  if(create&&(!card.title||!card.system||!card.species||!card.gross||!card.dx||!card.histo||!card.why||!card.source)){if(status)status.textContent='Please fill in every teaching field. You can add photographs later.';return;}
  let token=v('npSpecToken'),password=v('npSpecPassword');
  if(root.querySelector('#npSpecToken'))root.querySelector('#npSpecToken').value='';
  if(root.querySelector('#npSpecPassword'))root.querySelector('#npSpecPassword').value='';
  button.disabled=true;if(status)status.textContent='Checking ownership and publishing…';
  (async()=>{
   const vault=window.VPQ_OWNER_KEY_VAULT;
   if(!token){if(!vault?.exists?.())throw Error('No saved publishing key. Enter the GitHub token for first-time setup.');if(!password)throw Error('Enter publishing password.');token=await vault.unlock(password);}
   if(create){const c=await publishSpecimen(card,token);if(vault&&!vault.exists()&&password)await vault.store(token,password);window.VPQ_PATH_EXAM7?.refreshCustom?.();return window.VPQ_PATH_EXAM7?.openCard?.(c.id);}
   await setSpecimenVisibility(id,hidden,token);
   if(vault&&!vault.exists()&&password)await vault.store(token,password);
   window.VPQ_PATH_EXAM7?.refreshCustom?.();
   return window.VPQ_PATH_EXAM7?.showTab?.((window.VPQ_PATH_EXAM7?.cards||[]).find(x=>x.id===id)?.normal?'normals':'lesions');
  })().catch(err=>{if(status)status.textContent='Publishing failed: '+err.message+' Your card has not been altered.'}).finally(()=>{token='';password='';if(button.isConnected)button.disabled=false;});
 },true);
 context.body.addEventListener('change',ev=>{
  if(ev.target?.dataset?.npLibraryLecture!==undefined){photoLecture=ev.target.value;return photoLibrary();}
  if(ev.target?.dataset?.npLibrarySystem!==undefined){photoSystem=ev.target.value;return photoLibrary();}
  if(ev.target?.dataset?.npLibrarySearch!==undefined){photoSearch=String(ev.target.value||'').trim().toLowerCase();return photoLibrary();}
 },true);
 context.body.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-np-library-open],[data-np-library-back],[data-np-library-differentials]');if(!b)return;
  ev.preventDefault();ev.stopImmediatePropagation();
  if(b.dataset.npLibraryBack!==undefined)return window.VPQ_PATH_EXAM7?.start?.('gross');
  if(b.dataset.npLibraryDifferentials!==undefined)return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.start?.(api);
  const raw=b.dataset.npLibraryOpen||'',colon=raw.indexOf(':'),group=raw.slice(0,colon),id=raw.slice(colon+1);
  if(group==='cases')return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.openCase?.(id);
  if(group==='specimens')return window.VPQ_PATH_EXAM7?.openCard?.(id);
  if(group==='lectures')return window.VPQ_NECROPSY_HANDBOOK?.openLecture?.((/L(\d+)/.exec(id)||[])[1]||'68');
 },true);
context.body.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-necro-condition-save],[data-necro-condition-cancel]');if(!b)return;
  ev.preventDefault();ev.stopImmediatePropagation();
  if(b.hasAttribute('data-necro-condition-cancel'))return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.showConditions?.();
  if(b.disabled)return;
  const root=context.body, val=id=>String(root.querySelector('#'+id)?.value||'').trim();
  const c={lecture:val('npCondLecture'),title:val('npCondTitle'),slides:val('npCondSlides'),gross:val('npCondGross'),histo:val('npCondHisto'),mechanism:val('npCondMechanism'),differentials:val('npCondDifferentials')};
  const status=root.querySelector('#npCondStatus');
  if(!c.title||!c.gross||!c.histo||!c.mechanism||!c.differentials||!c.slides){if(status)status.textContent='Complete the condition name, source, gross, histology, mechanism and diagnostic details.';return;}
  let password=val('npCondPassword'),token=val('npCondToken');if(root.querySelector('#npCondToken'))root.querySelector('#npCondToken').value='';if(root.querySelector('#npCondPassword'))root.querySelector('#npCondPassword').value='';
  b.disabled=true;if(status)status.textContent='Publishing owner condition…';
  (async()=>{const vault=window.VPQ_OWNER_KEY_VAULT;
   if(!token){if(!vault?.exists?.())throw Error('No saved publishing key. Enter the token once.');if(!password)throw Error('Enter publishing password.');token=await vault.unlock(password);}
   await publishCondition(c,token);
   if(vault&&!vault.exists()&&password&&token)await vault.store(token,password);
   window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.showConditions?.(c.lecture);
  })().catch(e=>{if(status)status.textContent='Publish failed: '+e.message}).finally(()=>{token='';password='';if(b.isConnected)b.disabled=false});
 },true);
 context.body.addEventListener('click',ev=>{
  if(window.VPQ_PATH_RICH_TEXT?.handle?.(ev,context.body))return;

 const b=ev.target.closest('[data-necro-create-submit],[data-necro-create-cancel]');if(!b)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 if(b.hasAttribute('data-necro-create-cancel'))return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.start(api);
 if(b.disabled)return;
 const status=()=>context.body.querySelector('#ncStatus');
 let c;try{c=caseForm()}catch(e){if(status())status().textContent=e.message;return}
 let password=String(context.body.querySelector('#ncPassword')?.value||''),token=String(context.body.querySelector('#ncToken')?.value||'').trim();
 b.disabled=true;if(status())status().textContent='Verifying owner and publishing card…';
 (async()=>{const vault=window.VPQ_OWNER_KEY_VAULT;
  if(!token){if(!vault?.exists?.())throw Error('No saved publishing key. Enter the owner GitHub token once.');if(!password)throw Error('Enter your publishing password.');token=await vault.unlock(password);}
  const card=await publishNewCase(c,token);
  if(vault&&!vault.exists()&&password&&token)await vault.store(token,password);
  window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.openCase?.(card.id);
 })().catch(e=>{if(status())status().textContent='Publish failed: '+e.message+' Your text remains in the editor.'}).finally(()=>{token='';password='';if(b.isConnected)b.disabled=false});
 },true);
 context.body.addEventListener('change',ev=>{
  if(ev.target?.id!=='npOwnerFiles')return;
  const files=Array.from(ev.target.files||[]);
  const target=context.body.querySelector('#npOwnerFileDetails');
  if(!target)return;
  target.innerHTML=files.map((file,i)=>'<div style="padding:8px;border:1px solid #bed2e4;border-radius:9px;margin:7px 0"><b>Photo '+(i+1)+': '+esc(file.name)+'</b>'+
    '<label style="display:block">Image type<select data-np-file-kind="'+i+'" style="width:100%;padding:7px"><option value="gross">Gross</option><option value="histology">Histology / H&E</option><option value="clinical">Clinical</option><option value="illustration">Illustration</option></select></label>'+
    '<label style="display:block">Individual caption (optional; defaults to shared caption)<input data-np-file-caption="'+i+'" style="width:100%;padding:7px" placeholder="Species, tissue and lesion"></label></div>').join('');
 },true);
 context.body.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-necro-owner-publish],[data-necro-owner-close]');if(!b)return;
  ev.preventDefault();ev.stopImmediatePropagation();
  if(b.hasAttribute('data-necro-owner-close')){const q=pending;if(q?.type==='case')return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.openCase?.(q.id);if(q?.type==='specimen')return window.VPQ_PATH_EXAM7?.openCard?.(q.id);if(q?.type==='lecture')return window.VPQ_NECROPSY_HANDBOOK?.openLecture?.(q.id.match(/^L(\d+)/)?.[1]);return;}
  if(!pending||b.disabled)return;
  const inlineError=message=>{const status=context.body.querySelector('#npOwnerResult');if(status){status.textContent=message;status.style.color='#a52525';status.scrollIntoView({block:'nearest',behavior:'smooth'});}else show('Publishing error','<p>'+esc(message)+'</p>');};
  let fields;try{fields=readFields()}catch(e){inlineError(e.message);return;}
  let token=String(context.body.querySelector('#npOwnerToken')?.value||'').trim();
  let password=String(context.body.querySelector('#npOwnerPassword')?.value||'');
  if(context.body.querySelector('#npOwnerToken'))context.body.querySelector('#npOwnerToken').value='';
  if(context.body.querySelector('#npOwnerPassword'))context.body.querySelector('#npOwnerPassword').value='';
  const job={...pending};b.disabled=true;
  const update=msg=>{let e=context.body.querySelector('#npOwnerResult');if(e)e.textContent=msg};
  (async()=>{
   const vault=window.VPQ_OWNER_KEY_VAULT;
   if(!token){if(!vault?.exists?.())throw Error('No encrypted publishing key found. Enter your fine-grained GitHub token once.');if(!password)throw Error('Enter the password used to encrypt your publishing key.');token=await vault.unlock(password);}
   const result=await publish(job,fields,token,update);
   if(job.type==='specimen')window.VPQ_PATH_EXAM7?.afterPublished?.(job.id);
   if(vault&&!vault.exists()&&password&&fields&&token){await vault.store(token,password);}
   const details=result.added?'<p><b>'+result.added+' new photo(s)</b> saved in the verified GitHub record.</p>':'<p><b>No new photos were selected in this action.</b> Text or existing photo details were saved.</p>';
   show('✓ GitHub publish verified',details+'<p>Existing photos were preserved unless explicitly removed or replaced. Refresh the game to see published images.</p><button data-necro-owner-close="1">← Return to card</button>');
  })().catch(e=>{inlineError('Could not publish: '+e.message+' Your selections remain in the editor; correct the issue and try again.');}).finally(()=>{token='';password='';if(b.isConnected)b.disabled=false});
 },true);
}
return Object.freeze({init,load,renameCaseEditor,getCustomCases,getCustomConditions,renamedConditionTitle,renameConditionEditor,getCustomSpecimens,getHiddenSpecimens,newSpecimenEditor,hideSpecimenEditor,hiddenSpecimenMenu,newConditionEditor,newCaseEditor,getCase,getSpecimen,getLecturePhoto,getLecturePhotos,getText,getPhotoLibrary,photoLibrary,publishedCaseImage,casePhotoHTML,specimenPhoto,specimenPhotoHTML,editor});
})();
