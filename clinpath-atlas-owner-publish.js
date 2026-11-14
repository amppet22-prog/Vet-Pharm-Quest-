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
  if(response.status===401)throw Error('GitHub sign-in failed: token invalid or expired.');
  if(response.status===403)throw Error('GitHub denied access. Grant Contents: Read and write for this repository.');
  if(response.status===409)throw Error('The GitHub file changed while publishing. Please try again.');
  if(response.status===404)throw Error('Repository or file not accessible with this token.');
  throw Error('GitHub returned HTTP '+response.status+'. Please review permissions and retry.');
 }
 return response.json();
}
async function file(path,token){return api('repos/'+OWNER+'/'+REPO+'/contents/'+path+'?ref=main',token,'GET',null,true)}
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
  const source=url(p.source||'');
  if((p.dataUrl||imageUrl)&&!source)throw Error('Photo '+(i+1)+' needs its original source page URL. Add this in the editor first.');
  const credit=String(p.credit||'').trim();
  if((p.dataUrl||imageUrl)&&(!credit||credit==='Reference source to be provided'))throw Error('Photo '+(i+1)+' needs a credit and permission/license description. Add it in the editor first.');
  return {url:imageUrl,source,credit,dataUrl:p.dataUrl||'',fileName:p.fileName||''}
 });
 if(!photos.some(p=>p.url||p.dataUrl))throw Error('Add at least one photo URL or uploaded image.');
 return {id:draft.id,name:base.name,species:String(draft.species||base.species||'').slice(0,300),
  note:String(draft.note||base.note||'').slice(0,5000),photos};
}
function form(draft){
 const base=window.VPQ_ATLAS_EDITOR?.catalog?.().find(x=>x.id===draft.id);
 const filled=validated(draft);
 return '<p><b>'+esc(base?.name||draft.id)+'</b> · '+filled.photos.filter(x=>x.dataUrl||x.url).length+' photo(s) ready.</p>'+
 '<p><b>Owner publishing:</b> Use a short-lived <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">fine-grained GitHub token</a> for only <b>'+OWNER+'/'+REPO+'</b> with <b>Contents: Read and write</b>. Enter it below; the game never saves it.</p>'+
 '<p class="tiny">GitHub will verify the signed-in token belongs to <b>'+OWNER+'</b>. This updates the public repository; GitHub Pages deployment may take time. Do not paste tokens into chat, issues, source code or shared computers.</p>'+
 '<label for="vpqPublishToken">GitHub fine-grained access token</label><input id="vpqPublishToken" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…" style="width:100%;padding:10px;margin:6px 0 12px">'+
 '<div class="buttonrow"><button data-atlas-publish-confirm="1">🚀 Publish Now</button><button data-atlas-edit="'+esc(draft.id)+'">← Back to draft</button></div>'+
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
   const old=await file(path,token);
   progress('Uploading photo '+(i+1)+'…');
   await put(path,p.dataUrl.split(',')[1],old?.sha,token,'Publish '+item.name+' photo '+(i+1)+' from atlas editor');
   photoUrl='https://raw.githubusercontent.com/'+OWNER+'/'+REPO+'/main/'+path;
  }
  photos.push({url:photoUrl,source:p.source,credit:p.credit});
 }
 manifest.findings[item.id]={name:item.name,species:item.species,note:item.note,photos,updated:new Date().toISOString(),approvedBy:OWNER};
 progress('Publishing reviewed atlas entry…');
 await put(MANIFEST,utf8encode(JSON.stringify(manifest,null,2)+'\n'),current?.sha,token,'Publish atlas entry: '+item.name+' (owner approved)');
 published=manifest;ready=true;
 return item;
}
function init(context){
 context.body.addEventListener('click',event=>{
  const button=event.target.closest('[data-atlas-publish-open],[data-atlas-publish-confirm]');if(!button)return;
  if(button.hasAttribute('data-atlas-publish-open'))return dialog();
  if(button.hasAttribute('data-atlas-publish-confirm')){
   const tokenField=context.body.querySelector('#vpqPublishToken');
   const token=tokenField?.value.trim()||'';
   if(!token){context.body.querySelector('#vpqPublishResult').textContent='Enter a GitHub fine-grained token first.';return}
   const draft=pending;
   // Never keep the token in the DOM once publishing begins.
   tokenField.value='';button.disabled=true;
   const progress=message=>{const el=context.body.querySelector('#vpqPublishResult');if(el)el.textContent=message};
   publish(token,draft,progress).then(item=>{
    pending=null;const all=window.VPQ_ATLAS_EDITOR?.read?.()||{};delete all[item.id];
    window.VPQ_ATLAS_EDITOR?.replaceDrafts?.(all);
    context.showModal('✅ Published to GitHub','<p><b>'+esc(item.name)+'</b> was committed to the official GitHub repository. Your browser draft has been cleared for this finding.</p><p>GitHub Pages may need a deployment cycle. <a href="https://github.com/'+OWNER+'/'+REPO+'/commits/main" target="_blank" rel="noopener noreferrer">View changes on GitHub</a>.</p><button data-cph-nav="atlas">🔬 Open Microscope Atlas</button>');
   }).catch(error=>{progress('Publish failed: '+error.message);button.disabled=false});
  }
 });
}
return Object.freeze({init,load,get,isLoaded:()=>ready,publish});
})();
