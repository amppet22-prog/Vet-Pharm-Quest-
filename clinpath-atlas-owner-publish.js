/* Vet Pharm Quest — direct owner publishing for Clinical Pathology atlas.
 * Uses a short-lived, fine-grained GitHub token only for a button-triggered API
 * request. The token is NEVER persisted. GitHub verifies the owner account.
 * The static site contains no embedded secret.
 */
window.VPQ_ATLAS_PUBLISHER=(function(){
'use strict';
const OWNER='amppet22-prog',REPO='Vet-Pharm-Quest-';
const API='https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/';
const MANIFEST='clinpath-atlas-published.json';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const url=s=>{try{const u=new URL(String(s||''));return u.protocol==='https:'?u.href:''}catch{return ''}};
const utf8encode=s=>{const bytes=new TextEncoder().encode(s);let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(binary)};
const utf8decode=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),x=>x.charCodeAt(0)));
let published={version:1,findings:{}};
let ready=false,pending=null;
async function load(){
 try{
  const response=await fetch('./'+MANIFEST+'?v='+Date.now(),{cache:'no-store'});
  if(response.ok){const data=await response.json();if(data&&data.findings&&typeof data.findings==='object')published=data}
 }catch(e){/* Previous built-in references still render offline. */}
 ready=true;return published;
}
function get(id){return published.findings?.[id]||null}
async function api(path,token,method,payload,allowMissing){
 const response=await fetch('https://api.github.com/'+path,{method:method||'GET',
  headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28',...(payload?{'Content-Type':'application/json'}:{})},
  ...(payload?{body:JSON.stringify(payload)}:{})});
 if(allowMissing&&response.status===404)return null;
 if(!response.ok){
  let details='';
  try{const body=await response.json();if(typeof body?.message==='string')details=body.message.slice(0,220)}
  catch{/* GitHub may respond with an empty body. */}
  const stage=path==='user'?'checking the token owner':(method==='PUT'?'writing a file to the main branch':'reading repository contents');
  const detail=details?' GitHub says: '+details+'.':'';
  if(response.status===401)throw Error('GitHub rejected the credential while '+stage+' (401). Check expiration and use the complete token.'+detail);
  if(response.status===403)throw Error('GitHub blocked '+stage+' (403). Check the token resource owner, selected repository, Contents: Read and write, token approval status, and any branch restrictions.'+detail);
  if(response.status===409)throw Error('Repository changed while '+stage+' (409). Refresh the game and retry.'+detail);
  if(response.status===404)throw Error('GitHub could not access '+stage+' (404). Check that the token includes '+OWNER+'/'+REPO+'.'+detail);
  if(response.status===422)throw Error('GitHub rejected the requested file update (422). Verify branch rules and token permissions.'+detail);
  if(response.status===429)throw Error('GitHub rate limit exceeded (429). Retry later.'+detail);
  throw Error('GitHub API returned HTTP '+response.status+' while '+stage+'.'+detail);
 }
 return response.json();
}
async function file(path,token,allowMissing=false){return api('repos/'+OWNER+'/'+REPO+'/contents/'+path+'?ref=main',token,'GET',null,allowMissing)}
async function put(path,content,sha,token,message){
 return api('repos/'+OWNER+'/'+REPO+'/contents/'+path,token,'PUT',{message,content,branch:'main',...(sha?{sha}:{})});
}
function validated(draft){
 if(!draft||!draft.id||!/^[a-z0-9_-]{2,80}$/i.test(draft.id))throw Error('Please select a valid atlas finding.');
 const catalog=window.VPQ_ATLAS_EDITOR?.catalog?.()||[];
 const base=catalog.find(x=>x.id===draft.id);
 if(!base)throw Error('This finding is not in the Clinical Pathology atlas.');
 const photos=[...(Array.isArray(draft.photos)?draft.photos:[])].slice(0,2).map((p,i)=>{
  if(p.dataUrl&&!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p.dataUrl))throw Error('Photo '+(i+1)+' must be a JPEG preview or a valid image URL.');
  if(p.dataUrl&&p.dataUrl.length>500000)throw Error('Photo '+(i+1)+' is too large. Compress it further before publishing.');
  const imageUrl=p.url?url(p.url):'';
  if(p.url&&!imageUrl)throw Error('Photo '+(i+1)+' must use a valid HTTPS URL.');
  const originalPhoto=p.originalPhoto===true;
  const source=p.source?url(p.source):'';
  if(p.source&&!source)throw Error('Photo '+(i+1)+' source must be a valid HTTPS URL.');
  if((p.dataUrl||imageUrl)&&!source&&!originalPhoto)throw Error('Photo '+(i+1)+': provide a source URL or check the box confirming you own the photo and authorize reuse.');
  const suppliedCredit=String(p.credit||'').trim();
  const credit=suppliedCredit||(originalPhoto?'Original photograph contributed by Vet Pharm Quest owner — reuse authorized':'');
  if((p.dataUrl||imageUrl)&&(!credit||credit==='Reference source to be provided'))throw Error('Photo '+(i+1)+' needs a credit and permission/license description.');
  return {url:imageUrl,source,credit,originalPhoto,dataUrl:p.dataUrl||'',fileName:p.fileName||''}
 });
 const speciesAll=window.VPQ_ATLAS_EDITOR?.SPECIES||[];
 const speciesTags=Array.isArray(draft.speciesTags)?[...new Set(draft.speciesTags)].filter(s=>speciesAll.includes(s)):window.VPQ_ATLAS_EDITOR?.fromLegacySpecies?.(draft.species||base.species)||[];
 if(!speciesTags.length)throw Error('Choose at least one species to publish.');
 const existing=window.VPQ_ATLAS_PUBLISHER?.get?.(draft.id);
 const known=new Set(Array.isArray(existing?.speciesTags)?existing.speciesTags:window.VPQ_ATLAS_EDITOR?.fromLegacySpecies?.(base.species)||[]);
 const speciesEvidence={};
 for(const sp of speciesTags){
  const evidence=draft.speciesEvidence?.[sp]||{};
  const why=String(evidence.why||'').trim(),source=String(evidence.source||'').trim();
  if(source&&!url(source))throw Error('Enter a valid HTTPS reference for '+sp+'.');
  if(!known.has(sp)&&(!why||!url(source)))throw Error('You added '+sp+'. Explain why the finding applies to this species and provide a reference URL before publishing.');
  speciesEvidence[sp]={why:why.slice(0,1500),source:url(source)};
 }
 // Text-only corrections are valid: do not force a replacement photo when fixing species or explanations.
 return {id:draft.id,name:base.name,species:speciesTags.length===speciesAll.length?'All species':speciesTags.join(', '),speciesTags,speciesEvidence,
  note:String(draft.note||base.note||'').slice(0,5000),photos};
}
function form(draft){
 const base=window.VPQ_ATLAS_EDITOR?.catalog?.().find(x=>x.id===draft.id);
 const photoCount=(draft.photos||[]).filter(x=>x?.dataUrl||x?.url).length;
 const vault=window.VPQ_OWNER_KEY_VAULT;
 const saved=!!vault?.exists?.();
 return '<p><b>'+esc(base?.name||draft.id)+'</b> · '+photoCount+' new photo(s). Text-only changes are supported.</p>'+
 '<p><b>Owner publishing</b> uses your GitHub permission to write to <b>'+OWNER+'/'+REPO+'</b>. You may enter a fine-grained token or unlock your locally encrypted token with a password you chose. Your password is not a GitHub password, and no secret is added to the public game.</p>'+
 (saved?'<p><b>🔒 Saved encrypted publishing key found on this browser.</b> Enter your password to unlock it, or enter a replacement token below.</p>':'<p><b>First setup:</b> Create a <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">fine-grained GitHub token</a> for this one repository with <b>Contents: Read and write</b>. Optionally choose a password (12+ characters) to encrypt and remember it on this browser.</p>')+
 '<label for="vpqPublishPassword">Your publishing password (optional when entering a fresh token)</label><input id="vpqPublishPassword" type="password" autocomplete="off" spellcheck="false" placeholder="'+(saved?'Unlock saved publishing key':'Create a password (12+ characters)')+'" style="width:100%;padding:10px;margin:5px 0 10px">'+
 '<label for="vpqPublishToken">GitHub fine-grained token '+(saved?'(only for replacing your saved key)':'(required for first setup)')+'</label><input id="vpqPublishToken" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…" style="width:100%;padding:10px;margin:5px 0 10px">'+
 '<div class="buttonrow"><button data-atlas-publish-confirm="1">🚀 Publish Now</button>'+(saved?'<button data-atlas-vault-clear="1">Forget saved publishing key</button>':'')+'<button data-atlas-edit="'+esc(draft.id)+'">← Back to draft</button></div>'+
 '<p class="tiny">The token is encrypted before storage and decrypted only for a publish action. Anyone who knows your password and has access to this browser may publish as you. Use a strong password; GitHub tokens expire and can be revoked.</p>'+
 '<p class="tiny" id="vpqPublishResult" role="status" aria-live="polite"></p>';
}
function dialog(){
 const draft=window.VPQ_ATLAS_EDITOR?.collect?.();
 if(!draft)return;
 try{pending=draft;window.VPQ_ATLAS_EDITOR?.show?.('🚀 Publish Atlas Changes',form(draft))}
 catch(error){window.VPQ_ATLAS_EDITOR?.show?.('Publish requires review','<p>'+esc(error.message)+'</p><button data-atlas-edit="'+esc(draft.id)+'">← Back to editor</button>')}
}
async function publish(token,draft,progress){
 const item=validated(draft);
 const profile=await api('user',token);
 if(profile?.login?.toLowerCase()!==OWNER.toLowerCase())throw Error('This GitHub token belongs to '+(profile?.login||'a different user')+'. Only the repository owner can publish.');
 progress('GitHub owner confirmed. Preparing images…');
 const current=await file(MANIFEST,token);
 let manifest={version:1,findings:{}};
 if(current?.content){const parsed=JSON.parse(utf8decode(current.content));if(parsed&&typeof parsed.findings==='object')manifest=parsed;}
 const photos=[];
 for(let i=0;i<item.photos.length;i++){
  const p=item.photos[i];if(!p.dataUrl&&!p.url)continue;
  let photoUrl=p.url;
  if(p.dataUrl){
   const path='atlas-photos/'+item.id+'-photo-'+(i+1)+'.jpg';
   const old=await file(path,token,true);
   progress('Uploading photo '+(i+1)+'…');
   await put(path,p.dataUrl.split(',')[1],old?.sha,token,'Publish '+item.name+' photo '+(i+1)+' from atlas editor');
   photoUrl='https://raw.githubusercontent.com/'+OWNER+'/'+REPO+'/main/'+path;
  }
  photos.push({url:photoUrl,source:p.source||'',credit:p.credit,originalPhoto:!!p.originalPhoto});
 }
 manifest.findings[item.id]={name:item.name,species:item.species,speciesTags:item.speciesTags,speciesEvidence:item.speciesEvidence,note:item.note,photos:photos.length?photos:(manifest.findings[item.id]?.photos||[]),updated:new Date().toISOString(),approvedBy:OWNER};
 progress('Publishing reviewed atlas entry…');
 await put(MANIFEST,utf8encode(JSON.stringify(manifest,null,2)+'\n'),current?.sha,token,'Publish atlas entry: '+item.name+' (owner approved)');
 published=manifest;ready=true;
 return item;
}
function init(context){
 context.body.addEventListener('click',event=>{
  const button=event.target.closest('[data-atlas-publish-open],[data-atlas-publish-confirm],[data-atlas-vault-clear]');if(!button)return;
  if(button.hasAttribute('data-atlas-publish-open'))return dialog();
  if(button.hasAttribute('data-atlas-vault-clear')){
   window.VPQ_OWNER_KEY_VAULT?.clear?.();
   return window.VPQ_ATLAS_EDITOR?.show?.('Publishing key forgotten','<p>The encrypted key was cleared from this browser. Your GitHub token itself was not revoked. Enter it again when you next publish.</p><button data-atlas-edit="'+esc(pending?.id||'plateletclump')+'">Return to editor</button>');
  }
  if(button.hasAttribute('data-atlas-publish-confirm')){
   const tokenField=context.body.querySelector('#vpqPublishToken');
   const passwordField=context.body.querySelector('#vpqPublishPassword');
   let enteredToken=tokenField?.value.trim()||'';
   let passphrase=passwordField?.value||'';
   if(tokenField)tokenField.value='';
   if(passwordField)passwordField.value='';
   const vault=window.VPQ_OWNER_KEY_VAULT;
   const draft=pending;
   button.disabled=true;
   const progress=message=>{const el=context.body.querySelector('#vpqPublishResult');if(el)el.textContent=message};
   (async()=>{
    let token=enteredToken;
    if(!token){
     if(!vault?.exists?.())throw Error('Enter a GitHub token for first setup, or save a publishing key first.');
     if(!passphrase)throw Error('Enter your publishing password to unlock the saved key.');
     progress('Unlocking encrypted publishing key…');
     token=await vault.unlock(passphrase);
    }
    const result=await publish(token,draft,progress);
    if(enteredToken&&passphrase&&vault?.available?.()){
     try{await vault.store(enteredToken,passphrase)}
     catch(err){progress('Published successfully; could not save encrypted key: '+err.message)}
    }
    return result;
   })().then(item=>{
    pending=null;const all=window.VPQ_ATLAS_EDITOR?.read?.()||{};delete all[item.id];
    window.VPQ_ATLAS_EDITOR?.replaceDrafts?.(all);
    context.showModal('✅ Published to GitHub','<p><b>'+esc(item.name)+'</b> was committed to the official GitHub repository. Your browser draft has been cleared for this finding.</p><p>GitHub Pages may need a deployment cycle. <a href="https://github.com/'+OWNER+'/'+REPO+'/commits/main" target="_blank" rel="noopener noreferrer">View changes on GitHub</a>.</p><button data-cph-nav="atlas">🔬 Open Microscope Atlas</button>');
   }).catch(error=>{progress('Publish failed: '+error.message);button.disabled=false});
  }
 });
}
async function publishCell(token,cell,progress=()=>{}){
 if(!cell?.id||!/^[a-z0-9-]{2,65}$/.test(cell.id))throw Error('Invalid Cell Recognition ID.');
 if(!cell.name?.trim()||!cell.look?.trim())throw Error('Add a finding name and a morphology description before publishing.');
 if(!Array.isArray(cell.speciesTags)||!cell.speciesTags.length)throw Error('Select at least one species.');
 const profile=await api('user',token);
 if(profile?.login?.toLowerCase()!==OWNER.toLowerCase())throw Error('Only the repository owner may publish Cell Recognition content.');
 progress('GitHub owner verified. Reading approved entries…');
 const fileData=await file(MANIFEST,token);
 const manifest=fileData?.content?JSON.parse(utf8decode(fileData.content)):{version:1,findings:{}};
 if(!manifest.findings||typeof manifest.findings!=='object')throw Error('Published atlas data is malformed.');
 const photos=[];
 for(let i=0;i<Math.min(2,cell.photos?.length||0);i++){
  const p=cell.photos[i];if(!p?.dataUrl&&!p?.url)continue;
  const originalPhoto=p.originalPhoto===true;
  if(p.url&&!url(p.url))throw Error('Photo '+(i+1)+' needs an HTTPS image URL.');
  if(p.source&&!url(p.source))throw Error('Photo '+(i+1)+' source URL must use HTTPS.');
  if(!originalPhoto&&!p.source)throw Error('Photo '+(i+1)+' needs an original source URL or confirmation that you own the image rights.');
  if(!originalPhoto&&!p.credit?.trim())throw Error('Photo '+(i+1)+' requires source attribution.');
  let photoUrl=url(p.url);
  if(p.dataUrl){
   if(!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p.dataUrl)||p.dataUrl.length>450000)throw Error('Photo '+(i+1)+' needs a compressed JPEG under 330 KB.');
   const path='atlas-photos/cell-'+cell.id+'-'+(i+1)+'.jpg';
   const existing=await file(path,token,true);
   progress('Publishing photo '+(i+1)+'…');
   await put(path,p.dataUrl.split(',')[1],existing?.sha,token,'Publish Cell Recognition photo: '+cell.name);
   photoUrl='https://raw.githubusercontent.com/'+OWNER+'/'+REPO+'/main/'+path;
  }
  photos.push({url:photoUrl,source:url(p.source),credit:p.credit?.trim()||(originalPhoto?'Original photograph contributed by Vet Pharm Quest owner — reuse authorized':''),originalPhoto});
 }
 const key='cell-'+cell.id,old=manifest.findings[key]||{};
 const evidence={};for(const s of cell.speciesTags){const entry=cell.speciesEvidence?.[s]||{};if(entry.source&&!url(entry.source))throw Error('Invalid '+s+' source URL.');evidence[s]={why:String(entry.why||'').slice(0,2000),source:url(entry.source)}}
 manifest.findings[key]={id:cell.id,name:String(cell.name).slice(0,150),group:String(cell.group||'Other').slice(0,100),look:String(cell.look).slice(0,5000),meaning:String(cell.meaning||'').slice(0,5000),why:String(cell.why||'').slice(0,5000),note:String(cell.note||'').slice(0,5000),speciesTags:[...cell.speciesTags],species:cell.speciesTags.join(', '),speciesEvidence:evidence,photos:photos.length?photos:(old.photos||[]),updated:new Date().toISOString(),approvedBy:OWNER};
 progress('Committing Cell Recognition reference to GitHub…');
 await put(MANIFEST,utf8encode(JSON.stringify(manifest,null,2)+'\n'),fileData?.sha,token,'Publish Cell Recognition reference: '+cell.name);
 published=manifest;ready=true;return manifest.findings[key];
}
function all(){return published.findings||{}}
return Object.freeze({init,load,get,all,isLoaded:()=>ready,publish,publishCell});
})();
