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
 const accepted=await put(MANIFEST,encode(JSON.stringify(manifest,null,2)+'\\n'),old.sha,token,'Owner publish '+job.type+' '+job.id+' (photos/text)');
 const committedSHA=accepted?.commit?.sha||'',blobSHA=accepted?.content?.sha||'';
 if(!committedSHA||!blobSHA)throw Error('GitHub did not return a confirmed commit. Check the repository before retrying.');
 // Successful PUT confirms the new blob was committed. Branch GET can lag behind.
 published=manifest;
 update('GitHub accepted commit '+committedSHA.slice(0,9)+'. Checking readback…');
 let verified=false,verificationNote='';
 try{
  const check=await file(MANIFEST,token,false,true);
  const latest=JSON.parse(decode(check.content)),saved=latest?.[dir]?.[job.id];
  if(saved&&saved.title===newTitle&&Array.isArray(saved.photos)&&saved.photos.length===photos.length&&photos.every((p,i)=>saved.photos[i]?.url===p.url)){
   verified=true;published=latest;
  }else{
   verificationNote='The branch readback is still showing an older version. Do not publish again; reload the card after GitHub updates.';
  }
 }catch(error){
  verificationNote='Immediate readback is unavailable, but the GitHub commit succeeded. Do not publish again; reload the card shortly.';
 }
 return {added:incoming.length,retained:photos.length-incoming.length,textFields:Object.keys(textEdits).length,verified,commit:committedSHA,verificationNote};
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
   const details=result.added?'<p><b>'+result.added+' new photo(s)</b> included in the accepted GitHub commit.</p>':'<p><b>No new photos selected.</b> Text or existing photo edits were committed.</p>';
   const confirmation=result.verified?'<p>✅ GitHub readback confirmed the saved title and photo list.</p>':'<p style="color:#755126"><b>GitHub saved your changes.</b> '+esc(result.verificationNote)+'</p>';
   show('✓ Published to GitHub',details+confirmation+'<p><small>Commit: '+esc(result.commit.slice(0,12))+'</small></p><p>Existing photos were preserved unless explicitly removed or replaced.</p><button data-necro-owner-close="1">← Return to card</button>');
  })().catch(e=>{inlineError('Could not publish: '+e.message+' Your selections remain in the editor; correct the issue and try again.');}).finally(()=>{token='';password='';if(b.isConnected)b.disabled=false});
 },true);
}
return Object.freeze({init,load,renameCaseEditor,getCustomCases,getCustomConditions,renamedConditionTitle,renameConditionEditor,getCustomSpecimens,getHiddenSpecimens,newSpecimenEditor,hideSpecimenEditor,hiddenSpecimenMenu,newConditionEditor,newCaseEditor,getCase,getSpecimen,getLecturePhoto,getLecturePhotos,getText,getPhotoLibrary,photoLibrary,publishedCaseImage,casePhotoHTML,specimenPhoto,specimenPhotoHTML,editor});
})();
