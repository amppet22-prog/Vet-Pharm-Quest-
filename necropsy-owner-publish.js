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
let published={version:1,cases:{},specimens:{},lectures:{}},api=null,pending=null,loaded=false;
async function load(){
 try{
  const r=await fetch('./'+MANIFEST+'?v='+Date.now(),{cache:'no-store'});
  if(r.ok){const j=await r.json();if(j&&typeof j.cases==='object'&&typeof j.specimens==='object')published=j;}
 }catch(e){/* Offline game still shows default teaching material. */}
 loaded=true;return published;
}

function getCase(id){return published.cases?.[id]||null}
function getSpecimen(id){return published.specimens?.[id]||null}
function getLecturePhoto(id){return photosOf(published.lectures?.[id])[0]||null}
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
function show(title,body){api?.showModal(title,body)}
let draftState=null;
async function editor(type,id){
 const lp=type==='lecture'?/^L(\d+)-S(\d+)-P([01])$/.exec(id):null;
 const lesson=lp?window.VPQ_PATH_LECTURE_LEARN?.[lp[1]]?.sections?.[Number(lp[2])]:null;
 const base=type==='lecture'&&lesson?{id,title:'L'+lp[1]+' · '+lesson.title+' · image slot '+(Number(lp[3])+1)}:
 type==='case'?(window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[]).find(x=>x.id===id):(window.VPQ_PATH_EXAM7_DATA||[]).find(x=>x.id===id);
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
 '<h4>Add photos (optional)</h4>'+
 (pending.localPhoto?'<label style="display:block"><input type="checkbox" id="npOwnerUseDraft"> Include my saved local draft photo</label><img src="'+esc(pending.localPhoto)+'" alt="Local photo draft" style="max-width:100%;max-height:110px;object-fit:contain">':'')+
 '<label style="display:block">Select one or several images<input id="npOwnerFiles" type="file" multiple accept="image/jpeg,image/png,image/webp" style="display:block;width:100%;margin:6px 0"></label>'+
 '<label style="display:block">Or add a direct HTTPS image URL<input id="npOwnerImageUrl" type="url" placeholder="https://example.org/image.jpg" style="width:100%;padding:8px"></label>'+
 '<label style="display:block">Type of new photos<select id="npOwnerKind" style="display:block;width:100%;padding:8px"><option value="gross">Gross</option><option value="histology">Histology / H&E</option><option value="clinical">Clinical</option><option value="illustration">Illustration</option></select></label>'+
 '<label style="display:block">Caption for new photo(s) (individual filenames are included)<textarea id="npOwnerCaption" rows="2" style="width:100%" placeholder="Species, tissue, lesion and stain"></textarea></label>'+
 '<label style="display:block">Original source URL for new photo(s)<input id="npOwnerSource" type="url" style="width:100%;padding:8px" placeholder="https://..."></label>'+
 '<label style="display:block">Photo credit, permission or license<input id="npOwnerCredit" style="width:100%;padding:8px" placeholder="Photographer / license"></label>'+
 '<label style="display:block;margin:9px 0"><input type="checkbox" id="npOwnerRights"> I have the rights or permission to publish these new images publicly</label>'+
 '<div style="padding:9px;border-radius:9px;background:#f1f6ff"><b>Owner publishing authentication</b><p style="font-size:12px">Uses the same encrypted GitHub key as your other atlases. '+(saved?'Enter your existing publishing password.':'If no key is saved, enter a fine-grained GitHub token for first-time setup (Contents: Read/write).')+'</p>'+
 '<label>Publishing password<input id="npOwnerPassword" type="password" autocomplete="off" style="width:100%;padding:8px"></label>'+
 '<label>GitHub token (only first setup / replacement)<input id="npOwnerToken" type="password" autocomplete="off" style="width:100%;padding:8px"></label></div>'+
 '<div class="buttonrow" style="margin:12px 0"><button data-necro-owner-publish="1">🚀 Publish Now</button><button data-necro-owner-close="1">← Back</button></div>'+
 '<p id="npOwnerResult" role="status" aria-live="polite" style="font-size:12px"></p>');
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
 const draftData=el('npOwnerUseDraft')?.checked&&pending.localPhoto?pending.localPhoto:'';
 const external=String(el('npOwnerImageUrl')?.value||'').trim(),source=String(el('npOwnerSource')?.value||'').trim();
 const credit=String(el('npOwnerCredit')?.value||'').trim(),caption=String(el('npOwnerCaption')?.value||'').trim();
 const kind=el('npOwnerKind')?.value||'gross',replaceAll=!!el('npOwnerReplaceAll')?.checked;
 const remove=Array.from(root.querySelectorAll('[data-np-remove]:checked')).map(x=>Number(x.dataset.npRemove));
 const edits={};root.querySelectorAll('[data-np-text]').forEach(x=>{edits[x.dataset.npText]=String(x.value||'').slice(0,9000)});
 const newCount=files.length+(draftData?1:0)+(external?1:0);
 if(files.length>12)throw Error('Add up to 12 files per publishing action.');
 for(const file of files)if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>20000000)throw Error('Only JPEG, PNG or WebP files under 20 MB are supported.');
 if(external&&!goodUrl(external))throw Error('Photo URL must use HTTPS.');
 if(source&&!goodUrl(source))throw Error('Source URL must use HTTPS.');
 if(newCount&&(!el('npOwnerRights')?.checked||!caption||!credit))throw Error('New photos need rights confirmation, a caption and a credit/license.');
 if(external&&!source)throw Error('External photos also need a source URL.');
 if(!newCount&&!Object.keys(edits).length&&!replaceAll&&!remove.length)throw Error('No changes selected. Add images, edit text, or choose photos to remove.');
 if(replaceAll&&!newCount)throw Error('To replace all photos, add the new photographs first. To remove individual photos, use their checkboxes.');
 return {files,draftData,external:goodUrl(external),source:goodUrl(source),credit:credit.slice(0,500),caption:caption.slice(0,1000),kind,replaceAll,remove,edits,newCount};
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
 const incoming=[...fields.files.map(f=>({file:f,name:f.name})),...(fields.draftData?[{data:fields.draftData,name:'saved-local-draft.jpg'}]:[]),...(fields.external?[{url:fields.external,name:'linked-photo'}]:[])];
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
   caption:fields.caption+(incoming.length>1?' · '+item.name:''),type:fields.kind,external:!!item.url});
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
 load();
 context.body.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-necro-owner-publish],[data-necro-owner-close]');if(!b)return;
  ev.preventDefault();ev.stopImmediatePropagation();
  if(b.hasAttribute('data-necro-owner-close')){const q=pending;if(q?.type==='case')return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.openCase?.(q.id);if(q?.type==='specimen')return window.VPQ_PATH_EXAM7?.openCard?.(q.id);if(q?.type==='lecture')return window.VPQ_NECROPSY_HANDBOOK?.openLecture?.(q.id.match(/^L(\d+)/)?.[1]);return;}
  if(!pending)return;
  let fields;try{fields=readFields()}catch(e){show('Photo cannot be published','<p>'+esc(e.message)+'</p><button data-necro-owner-close="1">← Back</button>');return;}
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
   if(vault&&!vault.exists()&&password&&fields&&token){await vault.store(token,password);}
   show('✓ Changes published','<p>Changes saved to GitHub. Existing photos were preserved unless you explicitly removed or replaced them. Reload on another device to view updates.</p><button data-necro-owner-close="1">← Return</button>');
  })().catch(e=>{show('Publication was not completed','<p>'+esc(e.message)+'</p><p>The existing published image was not replaced in the manifest. You can try again.</p><button data-necro-owner-close="1">Back</button>')}).finally(()=>{token='';password='';b.disabled=false});
 },true);
}
return Object.freeze({init,load,getCase,getSpecimen,getLecturePhoto,getText,publishedCaseImage,casePhotoHTML,specimenPhoto,specimenPhotoHTML,editor});
})();
