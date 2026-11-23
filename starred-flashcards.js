/* ⭐ Shared Starred Flashcards — optional recall collection across the teaching hospital.
   Independent localStorage; never changes question answers, coins, XP, pet sprites, or room logic. */
(function(){
'use strict';
const KEY='vpq-starred-recall-v1',MAX=600;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const el=id=>document.getElementById(id);
let cards=[];
try{const saved=JSON.parse(localStorage.getItem(KEY)||'[]');cards=Array.isArray(saved)?saved.filter(x=>x&&x.id&&x.front).slice(0,MAX):[]}catch(_){}
let current=null,filter='All',mode='list',index=0,flipped=false,missedOnly=false;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(cards))}catch(e){console.warn('Starred cards were not saved:',e)}}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return (h>>>0).toString(36)}
function normalize(c){
 const front=String(c?.front||'').trim().slice(0,1000),back=String(c?.back||'').trim().slice(0,1800);
 const subject=String(c?.subject||'General').trim().slice(0,100)||'General',origin=String(c?.origin||'').trim().slice(0,180);
 const id=String(c?.id||'star-'+hash(subject+'|'+front));
 return {id,front,back,subject,origin};
}
function save(c){
 const n=normalize(c);if(!n.front||!n.back)return false;
 const old=cards.find(x=>x.id===n.id);
 if(old){Object.assign(old,n)}else{
   if(cards.length>=MAX){alert('Starred deck is full. Remove an old card before saving another.');return false}
   cards.push({...n,misses:0,known:0,last:0,next:0,created:Date.now()});
 }
 persist();updateCounts();return true;
}
function setCurrent(c){current=normalize(c)}
function has(id){return cards.some(c=>c.id===String(id))}
function getPharm(id){
 const bank=window.VPQ_PHARM_EXAM2_FLASHCARDS?.bank||[];
 const c=bank.find(x=>String(x.id)===String(id));
 return c?{id:'pharm-'+c.id,front:c.prompt,back:c.answer+(c.why?'\nWhy: '+c.why:''),subject:'Pharmacology',origin:c.lecture||c.slide||'Quick Flashcards'}:null;
}
function updateCounts(){document.querySelectorAll('[data-vpq-star-count]').forEach(e=>e.textContent=String(cards.length))}
function modal(title,html){
 const bridge=window.VPQ_REFERRAL_MODAL;
 if(bridge?.show)bridge.show(title,html);
 else {alert('Open the hospital first to access your review deck.')}
}
function due(c){return !c.next||c.next<=Date.now()}
function matching(){return cards.filter(x=>(filter==='All'||x.subject===filter)&&(!missedOnly||(x.misses||0)>0)).sort((a,b)=>Number(due(b))-Number(due(a))||(a.next||0)-(b.next||0))}
const DEPARTMENTS=['Pharmacology','Pathology','Clinical Pathology','One Health','Toxicology','Radiology','Parasitology','Virology','Bacteriology / Mycology','Clinical Skills','Other'];
function subjects(){return ['All',...new Set([...DEPARTMENTS,...cards.map(x=>x.subject)])].sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b))}
function canonicalSubject(title){const t=String(title||'').toLowerCase();if(t.includes('clinical path')||t.includes('clinpath')||t.includes('hematology')||t.includes('erythrogram')||t.includes('leukogram')||t.includes('blood gas')||t.includes('referral patient')||t.includes('urinalysis')||t.includes('cbc')||t.includes('coagulation')||t.includes('microscop')||t.includes('diagnostic lab'))return 'Clinical Pathology';if(t.includes('one health')||t.includes('zoonos')||t.includes('reportable'))return 'One Health';if(t.includes('toxic'))return 'Toxicology';if(t.includes('radiolog')||t.includes('imaging')||t.includes('x-ray')||t.includes('ultrasound'))return 'Radiology';if(t.includes('parasito'))return 'Parasitology';if(t.includes('virolog'))return 'Virology';if(t.includes('bacterio')||t.includes('mycolog'))return 'Bacteriology / Mycology';if(t.includes('patholog')||t.includes('necropsy')||t.includes('histolog'))return 'Pathology';if(t.includes('pharm')||t.includes('drug'))return 'Pharmacology';if(t.includes('injection')||t.includes('clinical skill')||t.includes('osce'))return 'Clinical Skills';return 'Other'}
function currentSubject(){return canonicalSubject(el('modalTitle')?.textContent||'')}
function layout(){
 const list=matching(),dueCount=list.filter(due).length;
 const options=subjects().map(s=>'<option value="'+esc(s)+'"'+(s===filter?' selected':'')+'>'+esc(s)+'</option>').join('');
 const head='<div class="vpq-star-header"><div><b>'+cards.length+' saved</b> · '+dueCount+' ready to review<p class="tiny">Saved in this browser. Missed cards return sooner; known cards return later. No XP required.</p></div><label>Subject <select id="vpqStarFilter">'+options+'</select></label></div><div class="vpq-star-actions"><button type="button" data-vpq-star-action="allcards" '+(!missedOnly?'disabled':'')+'>⭐ All starred</button><button type="button" data-vpq-star-action="missed" '+(missedOnly?'disabled':'')+'>🔁 Frequently missed</button></div>';
 if(mode==='practice'){
   if(!list.length)return modal('⭐ Starred Flashcards',head+'<p>No cards for this subject.</p><button data-vpq-star-action="list">← Collection</button>');
   index=Math.min(Math.max(index,0),list.length-1);
   const c=list[index];
   return modal('⭐ Starred Flashcards · Practice',head+
    '<div class="vpq-star-progress">Card '+(index+1)+' / '+list.length+' · '+esc(c.subject)+' · '+esc(c.origin||'Review')+'</div>'+
    '<button class="vpq-star-flip" data-vpq-star-action="flip"><small>'+(flipped?'ANSWER':'QUESTION')+'</small><strong>'+esc(flipped?c.back:c.front).replace(/\n/g,'<br>')+'</strong><span>Tap to '+(flipped?'see question':'reveal answer')+'</span></button>'+
    (flipped?'<div class="vpq-star-actions"><button data-vpq-star-action="miss" style="background:#fff1e5">↺ Forgot it</button><button data-vpq-star-action="almost" style="background:#fff4ce">◐ Almost</button><button data-vpq-star-action="know" style="background:#e1f4e8">✓ Remembered</button></div>':'')+
    '<div class="vpq-star-actions"><button data-vpq-star-action="prev">← Previous</button><button data-vpq-star-action="next">Next →</button><button data-vpq-star-action="list">Collection</button></div>');
 }
 return modal('⭐ My Starred Flashcards',head+
 '<div class="vpq-star-actions"><button data-vpq-star-action="practice">▶ Practice '+(dueCount?'('+dueCount+' due)':'all')+'</button><button data-vpq-star-action="add">+ Write a card</button></div>'+
 (list.length?list.map(c=>'<article class="vpq-star-list-item"><div><b>'+esc(c.front)+'</b><small>'+esc(c.subject)+(c.origin?' · '+esc(c.origin):'')+(due(c)?' · Ready to practice':' · Reviewed')+'</small></div><div class="vpq-star-actions"><button data-vpq-star-edit="'+esc(c.id)+'">Edit</button><button data-vpq-star-remove="'+esc(c.id)+'" aria-label="Remove starred flashcard">Remove</button></div></article>').join(''):'<p>No starred cards here yet. Star a flashcard or save a question from any department.</p>'));
}
function open(subject){mode='list';missedOnly=false;filter=DEPARTMENTS.includes(subject)?subject:'All';layout()}
function practice(){mode='practice';index=0;flipped=false;layout()}
function toggleDialog(c){
 let dialog=el('vpqStarEditor');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='vpqStarEditor';document.body.appendChild(dialog)}
 const x=c||{front:'',back:'',subject:'General',origin:''};
 dialog.innerHTML='<form method="dialog" class="vpq-star-editor"><h3>⭐ Save for later practice</h3><label>Subject<input name="subject" maxlength="100" value="'+esc(x.subject||'General')+'"></label><label>Question / front<textarea name="front" required rows="3">'+esc(x.front||'')+'</textarea></label><label>Answer / back<textarea name="back" required rows="5">'+esc(x.back||'')+'</textarea></label><label>Lecture / source (optional)<input name="origin" maxlength="180" value="'+esc(x.origin||'')+'"></label><p class="tiny">You can edit anything before saving. This only adds a review copy, not a new course question.</p><div class="vpq-star-actions"><button value="cancel">Cancel</button><button value="save" style="background:#e1f4e8">⭐ Save card</button></div></form>';
 dialog.addEventListener('close',function onClose(){
   dialog.removeEventListener('close',onClose);
   if(dialog.returnValue!=='save')return;
   const form=dialog.querySelector('form');
   if(!form.reportValidity()){dialog.showModal();return}
   if(save({id:x.id,front:form.elements.front.value,back:form.elements.back.value,subject:form.elements.subject.value,origin:form.elements.origin.value})){
     if(el('modalTitle')?.textContent.includes('Starred Flashcards'))layout();
   }
 });
 dialog.showModal();
}
function captureFromPage(){
 const root=el('modalBody');const selected=String(window.getSelection?.()?.toString()||'').trim();
 const isStudyQuestion=!!root?.querySelector('[data-vpq-star-study]');
 let candidate=isStudyQuestion?current:null;
 const pharm=root?.querySelector('[data-vpqpharmfc-flip]')&&window.VPQ_PHARM_EXAM2_FLASHCARDS?.bank;
 if(pharm){
  const q=(root.querySelector('.vpqRecallQuestion')?.textContent||'').trim();
  const a=(root.querySelector('.vpqRecallAnswer')?.textContent||'').trim();
  const bank=window.VPQ_PHARM_EXAM2_FLASHCARDS.bank;
  const found=bank.find(x=>x.prompt===q||x.answer===a);
  if(found)candidate=getPharm(found.id);
 }
 const title=el('modalTitle')?.textContent||'General';
 if(!candidate){
  let box=root?.querySelector('[data-pathfound="fc-flip"],.vpqRecallCard,.vpq-flashcard,.flashcard,[class*="flashcard"]');
  candidate={front:selected||box?.querySelector('.vpqRecallQuestion,h3,.question,[class*="question"]')?.textContent?.trim()||root?.querySelector('h3')?.textContent?.trim()||'',
   back:box?.querySelector('.vpqRecallAnswer,.answer,[class*="answer"]')?.textContent?.trim()||root?.querySelector('.response')?.textContent?.trim()||'',
   subject:canonicalSubject(title),origin:title};
 }
 // Existing, complete Q/A cards are starred immediately. Only incomplete or manually created cards need the editor.
 if(candidate?.front&&candidate?.back){if(save(candidate)){const button=el('vpqStarModalCapture');if(button)button.textContent='★ Saved for review';}return;}
 toggleDialog(candidate);
}
/* Department-wide integration: one saved deck, department-specific entry points.
   Never infer a correct answer from unsubmitted choices. Open an editable copy instead. */
function addDepartmentButtons(){
 const root=el('modalBody'),head=el('modalTitle');
 if(!root||!head||el('modalWrap')?.classList.contains('hidden'))return;
 const title=head.textContent||'';
 const subject=canonicalSubject(title);
 const nav=el('vpqStarDepartmentOpen');
 if(nav){nav.hidden=title.includes('Starred Flashcards');nav.dataset.vpqStarSubject=subject;nav.textContent='⭐ '+subject+' Review';}
 if(title.includes('Starred Flashcards'))return;
 const selectors='.vpq-case-question,.refpracticequestions,.refpracticequestion,.vpqRecallCard,[data-pathfound="fc-flip"],.vpq-flashcard,.flashcard,.path-flashcard';
 root.querySelectorAll(selectors).forEach(block=>{
   if(block.dataset.vpqStarIntegrated)return;
   block.dataset.vpqStarIntegrated='1';
   if(block.matches('.vpqRecallCard')||block.querySelector('[data-vpq-star-pharm]'))return;
   const btn=document.createElement('button');
   btn.type='button';btn.className='vpq-star-inline';btn.dataset.vpqStarCaptureBlock='1';btn.textContent='☆ Star this for practice';
   btn.title='Copy this item into your '+subject+' starred review; check or edit its answer before saving';
   block.insertAdjacentElement('afterend',btn);
 });
}
function captureBlock(button){
 const container=button.previousElementSibling;
 const title=el('modalTitle')?.textContent||'';
 const q=container?.querySelector('.vpq-case-question-label,.vpqRecallQuestion,.question,h3,[class*="question"]')?.textContent?.trim()
   ||container?.textContent?.trim()?.slice(0,800)||'';
 const a=container?.querySelector('.vpqRecallAnswer,.answer,.response,[class*="explanation"]')?.textContent?.trim()||'';
 const candidate={front:q,back:a,subject:canonicalSubject(title),origin:title};
 if(candidate.front&&candidate.back){if(save(candidate))button.textContent='★ Saved for review';return}
 toggleDialog(candidate);
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-vpq-star-action],[data-vpq-star-pharm],[data-vpq-star-study],[data-vpq-star-edit],[data-vpq-star-remove],[data-vpq-star-capture-block]');
 if(!b)return;
 if(b.dataset.vpqStarPharm){e.preventDefault();e.stopPropagation();const c=getPharm(b.dataset.vpqStarPharm);if(c)save(c);b.textContent='★ Saved for review';return}
 if(b.dataset.vpqStarStudy){e.preventDefault();e.stopPropagation();if(current&&save(current))b.textContent='★ Saved for review';return}
 if(b.dataset.vpqStarCaptureBlock){e.preventDefault();e.stopPropagation();captureBlock(b);return}
 if(b.dataset.vpqStarEdit){toggleDialog(cards.find(x=>x.id===b.dataset.vpqStarEdit));return}
 if(b.dataset.vpqStarRemove){const c=cards.find(x=>x.id===b.dataset.vpqStarRemove);if(c&&confirm('Remove this card from starred review?')){cards=cards.filter(x=>x.id!==c.id);persist();updateCounts();layout()}return}
 const action=b.dataset.vpqStarAction;
 if(!action)return;
 e.preventDefault();e.stopPropagation();
 if(action==='open')open(b.dataset.vpqStarSubject);
 else if(action==='capture')captureFromPage();
 else if(action==='missed'||action==='allcards'){missedOnly=action==='missed';mode='list';index=0;flipped=false;layout()}
 else if(action==='add')toggleDialog({front:'',back:'',subject:filter==='All'?'General':filter,origin:''});
 else if(action==='practice')practice();
 else if(action==='list'){mode='list';layout()}
 else if(action==='flip'){flipped=!flipped;layout()}
 else if(action==='prev'||action==='next'){index+=action==='prev'?-1:1;flipped=false;layout()}
 else if(['miss','almost','know'].includes(action)){
   const c=matching()[index];if(!c)return;
   const now=Date.now(),days=action==='know'?Math.min(14,Math.max(2,Math.pow(2,Math.min(4,c.known||0)))):action==='almost'?1:0;
   if(action==='know'){c.known=(c.known||0)+1;c.next=now+days*86400000}
   else {c.misses=(c.misses||0)+1;c.known=0;c.next=now+(action==='almost'?86400000:0)}
   c.last=now;persist();flipped=false;index=Math.min(index+1,matching().length-1);layout();
 }
},true);
function init(){
 const style=document.createElement('style');style.id='vpqStarredStyle';style.textContent=
 '.vpq-star-header{display:flex;align-items:start;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px;border:1px solid #e2cce6;background:#fcf6ff;border-radius:13px;margin-bottom:12px}.vpq-star-header label{font-size:13px}.vpq-star-header select{display:block;max-width:210px;padding:7px;border:1px solid #cdb6de;border-radius:9px}.vpq-star-actions{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:10px 0}.vpq-star-actions button{padding:9px 12px;border-radius:10px}.vpq-star-list-item{padding:11px 14px;border:1px solid #e7dae9;background:#fffafc;border-radius:12px;margin:9px 0;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.vpq-star-list-item small{display:block;color:#746079;margin-top:5px}.vpq-star-flip{width:100%;min-height:230px;border:2px solid #b7a1cf;border-radius:17px;background:#f9f2ff;color:#2a3755;display:flex;flex-direction:column;justify-content:center;gap:19px;align-items:center;padding:28px 20px;text-align:center;white-space:pre-wrap}.vpq-star-flip strong{font-size:clamp(19px,3vw,24px);line-height:1.45;max-width:650px}.vpq-star-flip small,.vpq-star-flip span,.vpq-star-progress{font-size:13px;color:#715683}.vpq-star-editor{padding:24px;min-width:min(85vw,440px);max-width:600px}.vpq-star-editor label{display:block;font-weight:700;margin:8px 0}.vpq-star-editor input,.vpq-star-editor textarea{width:100%;box-sizing:border-box;display:block;border:1px solid #d1b6db;border-radius:9px;padding:10px;font:inherit;margin-top:4px}#vpqStarEditor{border:2px solid #c2a4d5;border-radius:17px;max-width:92vw}#vpqStarEditor::backdrop{background:#1e243799}#vpqStarModalCapture{font-size:12px;padding:7px 10px;background:#fff2cb}#vpqStarDepartmentOpen{font-size:12px;padding:7px 10px;background:#f2e7ff}.vpq-star-inline{background:#fff2d1;border:1px solid #e3c893;border-radius:9px;margin:6px 0 12px;padding:8px 11px;font-size:13px}';
 document.head.appendChild(style);
 const side=document.querySelector('.vpq-shift-options');
 if(side){const button=document.createElement('button');button.className='full';button.type='button';button.dataset.vpqStarAction='open';button.innerHTML='⭐ Starred Flashcards · Practice (<span data-vpq-star-count>0</span>)';side.appendChild(button)}
 const head=document.querySelector('#modalWrap .modalhead');
 if(head){const btn=document.createElement('button');btn.id='vpqStarModalCapture';btn.type='button';btn.dataset.vpqStarAction='capture';btn.textContent='☆ Save for review';head.insertBefore(btn,head.querySelector('#closeModal'));const nav=document.createElement('button');nav.id='vpqStarDepartmentOpen';nav.type='button';nav.dataset.vpqStarAction='open';nav.dataset.vpqStarSubject='Other';nav.textContent='⭐ Department Review';head.insertBefore(nav,btn)}
 const root=el('modalBody');if(root){const observer=new MutationObserver(()=>addDepartmentButtons());observer.observe(root,{childList:true,subtree:true});const title=el('modalTitle');if(title)observer.observe(title,{childList:true,characterData:true,subtree:true});}
 el('modalBody')?.addEventListener('change',e=>{if(e.target.id==='vpqStarFilter'){filter=e.target.value;index=0;flipped=false;layout()}});
 updateCounts();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.VPQ_STARRED=Object.freeze({save,has,open,setCurrent,add:toggleDialog,count:()=>cards.length,exportForOwner:()=>cards.map(c=>({...c}))});
})();