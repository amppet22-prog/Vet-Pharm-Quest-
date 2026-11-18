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
function getCase(id){return published.cases[id]||null}
function getSpecimen(id){return published.specimens[id]||null}
function getLecturePhoto(id){return published.lectures?.[id]?.photo||null}
function publishedCaseImage(id){const x=getCase(id);return x?.photo?.url||''}
function publicImage(image,caption){if(!image)return '';return '<div style="border:1px solid #b6d3cf;border-radius:10px;padding:9px;background:#f3fcfa;margin:8px 0"><b style="font-size:12px">✓ Owner-published pathology photograph</b><img src="'+esc(image)+'" loading="lazy" alt="'+esc(caption||'Owner-published necropsy photo')+'" style="display:block;max-width:100%;max-height:290px;object-fit:contain;margin:8px auto;border-radius:6px">'+(caption?'<small>'+esc(caption)+'</small>':'')+'</div>'}
function casePhotoHTML(id){const c=getCase(id);return c?.photo?.url?publicImage(c.photo.url,c.photo.caption):''}
function specimenPhoto(id){return getSpecimen(id)?.photo?.url||''}
function show(title,body){api?.showModal(title,body)}
async function editor(type,id){
 const lectureParts=type==='lecture'?/^L(\d+)-S(\d+)-P([01])$/.exec(id):null;
 const lesson=lectureParts?window.VPQ_PATH_LECTURE_LEARN?.[lectureParts[1]]?.sections?.[Number(lectureParts[2])]:null;
 const c=type==='lecture'&&lesson?{id,title:'L'+lectureParts[1]+' · '+lesson.title+' · photo '+(Number(lectureParts[3])+1)}:type==='case'?(window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[]).find(x=>x.id===id):(window.VPQ_PATH_EXAM7_DATA||[]).find(x=>x.id===id);
 if(!c)return show('Publishing unavailable','<p>This case could not be found in the verified game bank.</p>');
 pending={type,id,title:c.title};
 const current=(type==='case'?getCase(id):type==='lecture'?published.lectures?.[id]:getSpecimen(id))||{};
 const draft=type==='case'?window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.draftPhoto?.(id):type==='lecture'?await window.VPQ_PATH_INLINE_PHOTOS?.draftPhoto?.(lectureParts[1],lectureParts[2],lectureParts[3]):window.VPQ_PATH_EXAM7?.draftPhoto?.(id);
 pending.localPhoto=String(draft||'').startsWith('data:image/jpeg;base64,')?draft:'';
 const saved=!!window.VPQ_OWNER_KEY_VAULT?.exists?.();
 show('📸 Owner photo editor · '+esc(c.title),
 '<p>Publish a <b>gross</b>, <b>histology</b>, or <b>clinical</b> reference. A published photograph is visible on every device after refreshing the game. Save Draft is optional; publishing is a separate authenticated action.</p>'+
 (current.photo?.url?publicImage(current.photo.url,current.photo.caption):'')+
 (pending.localPhoto?'<label style="display:block;margin:8px 0"><input id="npOwnerUseDraft" type="checkbox" checked> <b>Use my saved local draft photo</b></label><img src="'+esc(pending.localPhoto)+'" alt="Local draft ready for publishing" style="max-width:100%;max-height:150px;object-fit:contain">':'')+
 '<label><b>Upload an image</b><input id="npOwnerFile" type="file" accept="image/jpeg,image/png,image/webp" style="display:block;width:100%;margin:7px 0"></label>'+
 '<label><b>Or direct HTTPS image URL</b><input id="npOwnerImageUrl" type="url" value="'+esc(current.photo?.external?'':current.photo?.url&& !current.photo?.url.includes('raw.githubusercontent.com')?current.photo.url:'')+'" placeholder="https://example.org/figure.jpg" style="width:100%;padding:8px"></label>'+
 '<label><b>Image type</b><select id="npOwnerKind" style="width:100%;padding:8px"><option value="gross">Gross lesion</option><option value="histology">Histology / H&E</option><option value="clinical">Clinical</option></select></label>'+
 '<label><b>Caption / what the photo actually shows</b><textarea id="npOwnerCaption" rows="2" style="width:100%" placeholder="Species, lesion, stain, objective, relevant differential">'+esc(current.photo?.caption||'')+'</textarea></label>'+
 '<label><b>Source URL</b><input id="npOwnerSource" type="url" style="width:100%;padding:8px" value="'+esc(current.photo?.source||'')+'" placeholder="https://... (required for third-party images)"></label>'+
 '<label><b>Attribution / license or permission</b><input id="npOwnerCredit" style="width:100%;padding:8px" value="'+esc(current.photo?.credit||'')+'" placeholder="Photographer, book/slide source, license"></label>'+
 '<label style="display:block;margin:8px 0"><input type="checkbox" id="npOwnerRights"> I own this photo or have permission to publish it publicly in this game</label>'+
 '<div style="background:#f6f9ff;border:1px solid #cad9e9;border-radius:9px;padding:9px"><b>Owner authentication</b><p style="font-size:12px">Uses the same encrypted publishing key as the Clinical Pathology Atlas.'+(saved?' An encrypted key is already saved in this browser.':' First time: supply a GitHub fine-grained token for this repository with Contents: Read and write; optionally save it encrypted under your own password.')+'</p>'+
 '<label>Publishing password<input type="password" id="npOwnerPassword" autocomplete="off" style="width:100%;padding:8px" placeholder="'+(saved?'Unlock your saved publishing key':'Create a 12+ character encryption password (optional)')+'"></label>'+
 '<label>GitHub token (only if initial setup/replacement)<input type="password" id="npOwnerToken" autocomplete="off" style="width:100%;padding:8px" placeholder="github_pat_…"></label></div>'+
 '<div class="buttonrow" style="margin-top:10px"><button data-necro-owner-publish="1">🚀 Publish Now</button><button data-necro-owner-close="1">← Back to '+(type==='case'?'differential case':type==='lecture'?'lecture':'specimen')+'</button></div>'+
 '<p style="font-size:12px;color:#596d82">An existing published photo stays visible until a replacement is successfully published. Your password and token are never written to public game files.</p>'+
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
 const el=id=>api?.body?.querySelector('#'+id);
 const file=el('npOwnerFile')?.files?.[0],draftData=(!file&&el('npOwnerUseDraft')?.checked&&pending?.localPhoto)||'',external=String(el('npOwnerImageUrl')?.value||'').trim(),source=String(el('npOwnerSource')?.value||'').trim(),credit=String(el('npOwnerCredit')?.value||'').trim(),caption=String(el('npOwnerCaption')?.value||'').trim();
 const rights=!!el('npOwnerRights')?.checked;
 const kind=String(el('npOwnerKind')?.value||'gross');
 if(file&&(!file.type.startsWith('image/')||file.size>20000000))throw Error('Select a JPEG/PNG/WebP under 20 MB.');
 if(!file&&!draftData&&!goodUrl(external))throw Error('Choose an image file, use your saved local draft or enter a valid direct HTTPS image URL.');
 if(source&&!goodUrl(source))throw Error('Source must be an HTTPS URL.');
 if(!rights)throw Error('Please confirm that you own the photo or have permission to publish it.');
 if(!credit||!caption)throw Error('Include an image caption and attribution/license.');
 if(!source&&!file&&!draftData)throw Error('For an external URL, provide a source URL and permission information.');
 return {file,draftData,external:goodUrl(external),source:goodUrl(source),credit:credit.slice(0,500),caption:caption.slice(0,1000),kind};
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
async function publish(pending,fields,token,update){
 const who=await github('https://api.github.com/user',token);
 if(who?.login?.toLowerCase()!==OWNER.toLowerCase())throw Error('Only the repository owner can publish; this token belongs to '+(who?.login||'another account')+'.');
 const old=await file(MANIFEST,token);
 const loadedManifest=JSON.parse(decode(old.content));
 if(!loadedManifest?.cases||!loadedManifest?.specimens)throw Error('Published necropsy manifest is invalid.');
 loadedManifest.lectures=loadedManifest.lectures||{};
 const dir=pending.type==='case'?'cases':pending.type==='lecture'?'lectures':'specimens';
 let imgUrl=fields.external;
 if(fields.file||fields.draftData){
  const target='necropsy-photos/'+dir+'/'+pending.id+'.jpg';
  const previous=await file(target,token,true);
  update('Uploading compressed photograph to the public game…');
  await put(target,fields.file?await imageBase64(fields.file):fields.draftData.split(',')[1],previous?.sha,token,'Owner-publish necropsy photo: '+pending.id);
  imgUrl='https://raw.githubusercontent.com/'+OWNER+'/'+REPO+'/main/'+target+'?v='+Date.now();
 }
 const photo={url:imgUrl,source:fields.source,credit:fields.credit,caption:fields.caption,type:fields.kind,external:!fields.file&&!fields.draftData};
 loadedManifest[dir][pending.id]={title:pending.title,photo,updated:new Date().toISOString(),approvedBy:OWNER};
 update('Publishing updated necropsy manifest…');
 await put(MANIFEST,encode(JSON.stringify(loadedManifest,null,2)+'\n'),old.sha,token,'Owner-publish necropsy '+pending.type+': '+pending.title);
 published=loadedManifest;
 return true;
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
   show('✓ Necropsy photo published','<p>The photo is committed to the public repository. Refresh the game on another device to see it.</p><button data-necro-owner-close="1">← Return to case</button>');
  })().catch(e=>{show('Publication was not completed','<p>'+esc(e.message)+'</p><p>The existing published image was not replaced in the manifest. You can try again.</p><button data-necro-owner-close="1">Back</button>')}).finally(()=>{token='';password='';b.disabled=false});
 },true);
}
return Object.freeze({init,load,getCase,getSpecimen,getLecturePhoto,publishedCaseImage,casePhotoHTML,specimenPhoto,editor});
})();
