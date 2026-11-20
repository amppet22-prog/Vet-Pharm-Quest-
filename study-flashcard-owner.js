/* Shared flashcard owner publishing: no source lecture files overwritten.
   Owner-authenticated GitHub Contents API; encrypted owner key vault supported. */
window.VPQ_FLASHCARD_OWNER=(function(){
'use strict';
const OWNER='amppet22-prog',REPO='Vet-Pharm-Quest-',PATH='study-flashcard-owner-data.json';
let data={version:1,overrides:{},custom:[],hidden:[]},ui=null,show=null,loaded=false,context={};
const html=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const encode=s=>btoa(Array.from(new TextEncoder().encode(s),b=>String.fromCharCode(b)).join(''));
const decode=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),x=>x.charCodeAt(0)));
let pendingLoad=null;
async function load(){
 if(pendingLoad)return pendingLoad;
 pendingLoad=(async()=>{
  let found=null;
  try{
   const response=await fetch('https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+PATH+'?ref=main&t='+Date.now(),{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});
   if(response.ok){const file=await response.json();found=JSON.parse(decode(file.content));}
  }catch(_){}
  if(!found){try{const response=await fetch('./'+PATH+'?v='+Date.now(),{cache:'no-store'});if(response.ok)found=await response.json();}catch(_){}}
  if(found&&found.overrides&&Array.isArray(found.custom))data=found;
  loaded=true;return data;
 })();
 try{return await pendingLoad}finally{pendingLoad=null}
}
function refresh(domain,lecture,current){
 const lookup=new Map(apply(domain,lecture,[]).map(c=>[c.id,c]));
 return current.map(c=>{
  const found=lookup.get(c.id);
  return found||({...c,...(data.overrides?.[c.id]||{})});
 });
}
function apply(domain,lecture,cards){
 const prefix=domain+'|'+lecture+'|',hidden=new Set(data.hidden||[]);
 const modified=cards.filter(c=>!hidden.has(c.id)).map(c=>({...c,...(data.overrides?.[c.id]||{})}));
 return [...modified,...(data.custom||[]).filter(c=>c.domain===domain&&c.lecture===lecture&&!hidden.has(c.id)).map(c=>({...c,custom:true,curated:true}))];
}
function editor(domain,lecture,card,back){
 context={domain,lecture,card:card||null,back};
 const c=card||{},isNew=!card;
 if(!show)return;
 show('✏️ '+(isNew?'Add':'Edit')+' study flashcard',
 '<p>Write one clear question. Keep the answer short, and place clinical context in <b>Why it matters</b>. Text-only editing never requires a photo. Changes publish to GitHub after owner authentication.</p>'+
 '<label style="display:block;font-weight:700;margin:8px 0">Question<textarea id="vpqFCFront" rows="2" style="display:block;width:100%">'+html(c.prompt||c.front||'')+'</textarea></label>'+
 '<label style="display:block;font-weight:700;margin:8px 0">Answer<textarea id="vpqFCBack" rows="3" style="display:block;width:100%">'+html(c.answer||c.back||'')+'</textarea></label>'+
 '<label style="display:block;font-weight:700;margin:8px 0">Why it matters / disease mechanism (optional)<textarea id="vpqFCWhy" rows="3" style="display:block;width:100%">'+html(c.why||'')+'</textarea></label>'+
 '<label style="display:block;margin:8px 0">Lecture source / reference<input id="vpqFCSource" style="width:100%" value="'+html(c.slide||c.source||'')+'"></label>'+
 '<details style="padding:8px;border:1px solid #d2deed;border-radius:8px"><summary>Owner publishing credentials</summary><p class="tiny">Use the password for your saved encrypted key. Enter a fine-grained token only for initial setup; it must have Contents read/write permission.</p><label>Password<input type="password" id="vpqFCPassword" autocomplete="off" style="width:100%"></label><label>GitHub token (first setup only)<input type="password" id="vpqFCToken" autocomplete="off" style="width:100%"></label></details>'+
 '<div class="buttonrow"><button data-vpqfc-save="1" style="background:#dff4e6;font-weight:800">🚀 Publish '+(isNew?'new card':'changes')+'</button>'+(card?'<button data-vpqfc-hide="1">🗂 Hide this card</button>':'')+'<button data-vpqfc-cancel="1">Cancel</button></div><p id="vpqFCStatus" role="status" class="tiny"></p>');
}
async function commit(action){
 const root=ui,sel=id=>root.querySelector('#'+id),val=id=>String(sel(id)?.value||'').trim();
 let token=val('vpqFCToken'),password=val('vpqFCPassword');
 if(sel('vpqFCToken'))sel('vpqFCToken').value='';
 if(sel('vpqFCPassword'))sel('vpqFCPassword').value='';
 const v=window.VPQ_OWNER_KEY_VAULT;
 try{
  if(!token){if(!v?.exists?.())throw Error('Enter a token to initialize owner publishing.');if(!password)throw Error('Enter your publishing password.');token=await v.unlock(password);}
  const headers={Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28'};
  const me=await fetch('https://api.github.com/user',{headers});if(!me.ok)throw Error('Could not verify GitHub owner.');const user=await me.json();if(String(user.login).toLowerCase()!==OWNER.toLowerCase())throw Error('Only the repository owner can publish.');
  const url='https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+PATH;
  const response=await fetch(url+'?ref=main',{headers});if(!response.ok)throw Error('Cannot load current published card file.');const file=await response.json(),next=JSON.parse(decode(file.content));
  next.overrides=next.overrides||{};next.hidden=next.hidden||[];next.custom=next.custom||[];
  if(action==='hide'){
   if(context.card?.id&&!next.hidden.includes(context.card.id))next.hidden.push(context.card.id);
  }else{
   const question=val('vpqFCFront'),answer=val('vpqFCBack');
   if(question.length<8||answer.length<2)throw Error('Add a clear question and answer before publishing.');
   if(question.length>350||answer.length>1200)throw Error('Use a shorter flashcard; put extra material in the lecture notes.');
   const entry={prompt:question,answer,why:val('vpqFCWhy'),slide:val('vpqFCSource')||'Owner-authored reference'};
   if(context.card?.id){
    if(context.card.custom){const found=next.custom.find(x=>x.id===context.card.id);if(!found)throw Error('Custom card not found in latest manifest.');Object.assign(found,entry)}
    else next.overrides[context.card.id]=entry;
   }else{
    const id='owner-'+context.domain+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
    next.custom.push({...entry,id,domain:context.domain,lecture:context.lecture,curated:true});
   }
  }
  const bytes=encode(JSON.stringify(next,null,2)+'\n');
  const result=await fetch(url,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({message:'Owner '+action+' flashcard '+context.domain+' '+context.lecture,content:bytes,branch:'main',sha:file.sha})});
  if(!result.ok){let msg='';try{msg=(await result.json()).message}catch(_){ }throw Error('GitHub publish failed: '+msg);}
  data=next;
  if(v&&!v.exists()&&password)await v.store(token,password);
  show('✓ Flashcard published','<p>The changes are saved in GitHub. Reload the page after deployment to use the updated card in future sessions.</p><button data-vpqfc-cancel="1">← Return to flashcards</button>');
 }catch(e){const el=sel('vpqFCStatus');if(el)el.textContent='Could not publish: '+e.message}
 finally{token='';password=''}
}
function init(body,modal){if(!body||body.__vpqFlashOwnerBound)return;ui=body;show=modal;body.__vpqFlashOwnerBound=true;
 body.addEventListener('click',event=>{const b=event.target.closest('[data-vpqfc-save],[data-vpqfc-hide],[data-vpqfc-cancel]');if(!b)return;event.preventDefault();event.stopImmediatePropagation();
 if(b.dataset.vpqfcCancel!==undefined)return context.back?.();
 if(b.disabled)return;b.disabled=true;const el=ui.querySelector('#vpqFCStatus');if(el)el.textContent='Checking owner credentials and publishing…';
 commit(b.dataset.vpqfcHide!==undefined?'hide':'save').finally(()=>{if(b.isConnected)b.disabled=false});
 },true);
}
return Object.freeze({load,apply,refresh,editor,init,loaded:()=>loaded});
})();
