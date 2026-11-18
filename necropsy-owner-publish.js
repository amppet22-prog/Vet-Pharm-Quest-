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

function getCustomCases(){return Object.values(published.customCases||{}).filter(c=>c&&c.id&&Array.isArray(c.options)&&c.options.length===4)}
function getCase(id){return published.cases?.[id]||null}
function getSpecimen(id){return published.specimens?.[id]||null}
function getLecturePhoto(id){return photosOf(published.lectures?.[id])[0]||null}
function getLecturePhotos(id){return photosOf(published.lectures?.[id])}
function publishedCaseImage(id){return photosOf(getCase(id))[0]?.url||''}
function specimenPhoto(id){return photosOf(getSpecimen(id))[0]?.url||''}
function photosOf(record){return Array.isArray(record?.photos)?record.photos:(record?.photo?.url?[record.photo]:[])}
function photoGrid(list){
 if(!list.length)return '';
 return '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin:10px 0">'+
 list.map((p,i)=>'<figure style="padding:8px;border:1px solid #b6d3cf;border-radius:10px;background:#f3fcfa;margin:0"><img src="'+esc(p.url)+'" alt="'+esc(p.caption||'Published pathology photo')+'" loading="lazy" style="width:100%;height:165px;object-fit:contain"><figcaption style="font-size:11px"><b>'+esc(p.type||'Photo')+' '+(i+1)+'</b><p>'+esc(p.caption||'')+'</p><small>'+esc(p.credit||'')+'</small></figcaption></figure>').join('')+'</div>';
}
function casePhotoHTML(id){return photoGrid(photosOf(getCase(id)))}
function specimenPhotoHTML(id){return photoGrid(photosOf(getSpecimen(id)))}
function getText(type,id){const r=type==='case'?getCase(id):type==='specimen'?getSpecimen(id):published.lectures?.[id];return r?.text||{}}
function show(title,body){api?.showModal(title,body);window.VPQ_PATH_RICH_TEXT?.install?.(api?.body)}
let draftState=null;
async function editor(type,id){
 const lp=type==='lecture'?/^L(\d+)-S(\d+)-P([01])$/.exec(id):null;
 const lesson=lp?window.VPQ_PATH_LECTURE_LEARN?.[lp[1]]?.sections?.[Number(lp[2])]:null;
 const base=type==='lecture'&&lesson?{id,title:'L'+lp[1]+' · '+lesson.title+' · image slot '+(Number(lp[3])+1)}:
 type==='case'?[...(window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[]),...getCustomCases()].find(x=>x.id===id):(window.VPQ_PATH_EXAM7_DATA||[]).find(x=>x.id===id);
 if(!base){show('Entry unavailable','<p>The selected entry could not be found.</p>');return}
 pending={type,id,title:base.title};
 const cur=type==='case'?getCase(id):type==='specimen'?getSpecimen(id):published.lectures?.[id]||{};
 const existing=photosOf(cur);
 const draft=type==='case'?window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.draftPhoto?.(id):type==='lecture'?await window.VPQ_PATH_INLINE_PHOTOS?.draftPhoto?.(lp[1],lp[2],lp[3]):window.VPQ_PATH_EXAM7?.draftPhoto?.(id);
 pending.localPhoto=String(draft||'').startsWith('data:image/jpeg;base64,')?draft:'';
 const localText=type==='specimen'?window.VPQ_PATH_EXAM7?.draftText?.(id):type==='case'?window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.draftText?.(id):null;
 const edits={...base,...(cur?.text||{}),...(localText||{})};
 const fields=type==='case'?['history','gross','histo','morph','mechanism','tests']:type==='specimen'?['gross','dx','histo','why','notes']:[];
 const saved=!!window.VPQ_OWNER_KEY_VAULT?.exists?.();
 draftState={};
 show('✏️ Edit & publish · '+esc(base.title),
 '<p><b>Text-only updates are allowed.</b> Leave image inputs blank to preserve all published photos. Select multiple new images to append them. Existing photos are kept unless you check Remove or explicitly select Replace all.</p>'+
 (fields.length?'<h4>📝 Teaching content (editable independently of photos)</h4>'+fields.map(k=>'<label style="display:block;margin:7px 0"><b>'+esc(k.replace(/^\w/,c=>c.toUpperCase()))+'</b><textarea data-np-text="'+k+'" rows="3" style="display:block;width:100%">'+esc(edits[k]||'')+'</textarea></label>').join(''):'')+
 '<h4>📷 Currently published ('+existing.length+')</h4>'+
 (existing.length?existing.map((p,i)=>'<div style="display:flex;gap:9px;align-items:start;padding:8px;border:1px solid #cdd9e6;border-radius:9px;margin:6px 0"><img src="'+esc(p.url)+'" style="width:90px;height:85px;object-fit:contain" alt="'+esc(p.caption||'')+'"><div style="flex:1;font-size:12px"><b>'+esc(p.type||'image')+'</b><p>'+esc(p.caption||'')+'</p><small>'+esc(p.credit||'')+'</small><label style="display:block"><input type="checkbox" data-np-remove="'+i+'"> Remove this published photo</label></div></div>').join(''):'<p>No published photos yet.</p>')+
 (existing.length?'<label style="display:block;margin:8px 0"><input type="checkbox" id="npOwnerReplaceAll"> Replace all published photos with new uploads (intentional)</label>':'')+
 '<h4>Add photos (optional)</h4><p style="font-size:12px">For local image files, just select photos, confirm publishing permission, and enter your publishing password. Captions, photo credit and source are optional. External image links still need the source page.</p>'+
 (pending.localPhoto?'<label style="display:block"><input type="checkbox" id="npOwnerUseDraft"> Include my saved local draft photo</label><img src="'+esc(pending.localPhoto)+'" alt="Local photo draft" style="max-width:100%;max-height:110px;object-fit:contain">':'')+
 '<label style="display:block">Select one or several images<input id="npOwnerFiles" type="file" multiple accept="image/jpeg,image/png,image/webp" style="display:block;width:100%;margin:6px 0"></label>'+
 '<div id="npOwnerFileDetails" style="margin:8px 0"></div>'+
 '<label style="display:block">Or add a direct HTTPS image URL<input id="npOwnerImageUrl" type="url" placeholder="https://example.org/image.jpg" style="width:100%;padding:8px"></label>'+
 '<label style="display:block">Type of new photos<select id="npOwnerKind" style="display:block;width:100%;padding:8px"><option value="gross">Gross</option><option value="histology">Histology / H&E</option><option value="clinical">Clinical</option><option value="illustration">Illustration</option></select></label>'+
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
 const lectures=Array.from({length:13},(_,i)=>String(i+67));
 show('➕ Create differential diagnosis card',
 '<p>Create a permanent teaching case with <b>four genuinely competing diagnoses</b>. The first is the best-supported choice. Photos are optional and can be added later through the normal multi-photo editor.</p>'+
 '<label>Card title<input id="ncTitle" style="width:100%" value="'+esc(seed.title||'')+'" placeholder="e.g. Meningitis: purulent versus nonsuppurative"></label>'+
 '<label>Lecture<select id="ncLecture">'+lectures.map(n=>'<option value="'+n+'"'+(n===(seed.lecture||'68')?' selected':'')+'>Lecture '+n+'</option>').join('')+'</select></label>'+
 '<label>System<input id="ncSystem" style="width:100%" value="CNS / Meninges"></label>'+
 '<label>Species and signalment<textarea id="ncSpecies" rows="2" style="width:100%"></textarea></label>'+
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
 const fields=['Title','Lecture','System','Species','History','Gross','Histo','Morph','Mechanism','Tests','Ref'];
 const values=Object.fromEntries(fields.map(x=>[x.toLowerCase(),val('nc'+x)]));
 const opts=Array.from({length:4},(_,i)=>Object.fromEntries(['name','supports','against','hist'].map(k=>[k,String(root.querySelector('[data-nc-'+k+'="'+i+'"]')?.value||'').trim()])));
 if(!values.title||!values.species||!values.history||!values.gross||!values.histo||!values.morph||!values.mechanism||!values.tests||!values.ref)throw Error('Complete all teaching fields, including the reference.');
 if(opts.some(x=>Object.values(x).some(y=>!y)))throw Error('Complete all four diagnosis names, supporting evidence, limitations and histology.');
 if(new Set(opts.map(x=>x.name.toLowerCase())).size!==4)throw Error('The four differential diagnoses must be distinct.');
 if(!/^(67|68|69|70|71|72|73|74|75|76|77|78|79)$/.test(values.lecture))throw Error('Choose a valid lecture.');
 return {lecture:values.lecture,system:values.system||'Pathology',title:values.title.slice(0,180),species:values.species.slice(0,400),history:values.history.slice(0,3500),gross:values.gross.slice(0,3500),histo:values.histo.slice(0,3500),morph:values.morph.slice(0,3500),mechanism:values.mechanism.slice(0,3500),tests:values.tests.slice(0,3500),ref:values.ref.slice(0,350),best:opts[0].name.slice(0,220),options:opts.map((x,i)=>({...x,role:i===0?'best':'less'}))};
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
  kind,replaceAll,remove,edits,newCount};
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
 let photos=fields.replaceAll?[]:oldPhotos.filter((p,i)=>!fields.remove.includes(i));
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
   caption:(item.caption||fields.caption)+(incoming.length>1?' · '+item.name:''),type:item.kind||fields.kind,external:!!item.url});
 }
 const textEdits=fields.edits||{};
 const entry={...prev,title:job.title,photos,photo:photos[0]||null,text:{...(prev.text||{}),...textEdits},updated:new Date().toISOString(),approvedBy:OWNER};
 manifest[dir][job.id]=entry;
 update('Publishing '+(incoming.length?incoming.length+' new image(s) and ':'')+'your edits…');
 await put(MANIFEST,encode(JSON.stringify(manifest,null,2)+'\n'),old.sha,token,'Owner publish '+job.type+' '+job.id+' (photos/text)');
 published=manifest;
 return {added:incoming.length,retained:photos.length-incoming.length,textFields:Object.keys(textEdits).length};
}

function init(context){
 api=context;
 if(context.body.__vpqNecroOwnerInit)return;
 context.body.__vpqNecroOwnerInit=true;
 load();
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
   await publish(job,fields,token,update);
   if(job.type==='specimen')window.VPQ_PATH_EXAM7?.afterPublished?.(job.id);
   if(vault&&!vault.exists()&&password&&fields&&token){await vault.store(token,password);}
   show('✓ Changes published','<p>Changes saved to GitHub. Existing photos were preserved unless you explicitly removed or replaced them. Reload on another device to view updates.</p><button data-necro-owner-close="1">← Return</button>');
  })().catch(e=>{inlineError('Could not publish: '+e.message+' Your selections remain in the editor; correct the issue and try again.');}).finally(()=>{token='';password='';if(b.isConnected)b.disabled=false});
 },true);
}
return Object.freeze({init,load,getCustomCases,newCaseEditor,getCase,getSpecimen,getLecturePhoto,getLecturePhotos,getText,publishedCaseImage,casePhotoHTML,specimenPhoto,specimenPhotoHTML,editor});
})();
