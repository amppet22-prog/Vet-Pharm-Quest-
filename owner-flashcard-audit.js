/* Vet Pharm Quest — owner-authenticated flashcard inventory and duplicate audit.
   Read only: no removal, publishing, lecture mutation or game-state changes. */
(function(){
'use strict';
const OWNER='amppet22-prog',DECK='study-flashcard-owner-data.json',API='https://api.github.com/repos/'+OWNER+'/Vet-Pharm-Quest-';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();
const el=id=>document.getElementById(id);
let authorized=false,token='',items=[],query='',subject='All',mode='all',offset=0,focus='',ownerManifest=null;
const show=(title,html)=>window.VPQ_REFERRAL_MODAL?.show?.(title,html);
function card(id,topic,section,front,back,origin,type='Flashcard'){
 if(!front||!back)return;
 items.push({id:String(id),subject:topic,lecture:String(section||'Unassigned'),front:String(front),back:String(back),source:String(origin||''),type});
}
function scan(){
 items=[];
 const pharm=window.VPQ_PHARM_EXAM2_FLASHCARDS?.bank||[];
 for(const c of pharm)card(c.id,'Pharmacology',c.lecture,c.prompt,c.answer+(c.why?'\nWhy: '+c.why:''),c.slide);
 const path=window.VPQ_PATH_FOUNDATION_FLASHCARDS||[];
 for(const c of path)card(c.id,'Pathology',c.lecture,c.prompt,c.answer+(c.why?'\nWhy: '+c.why:''),c.slide);
 const lectures=window.VPQ_PATH_LECTURE_LEARN||{};
 for(const [lecture,lesson] of Object.entries(lectures)){
  for(let i=0;i<(lesson.sections||[]).length;i++){
   const sec=lesson.sections[i];
   for(let n=0;n<(sec.flashcards||[]).length;n++){
    const c=sec.flashcards[n];
    if(Array.isArray(c))card('path-lecture-'+lecture+'-'+i+'-'+n,'Pathology','Lecture '+lecture,c[0],c[1],sec.title);
    else if(c&&typeof c==='object')card(c.id||'path-lecture-'+lecture+'-'+i+'-'+n,'Pathology','Lecture '+lecture,c.prompt||c.front||c.q,c.answer||c.back||c.a,sec.title);
   }
  }
  for(let n=0;n<(lesson.checks||[]).length;n++){
   const c=lesson.checks[n];
   if(Array.isArray(c))card('path-check-'+lecture+'-'+n,'Pathology','Lecture '+lecture,c[0],c[1],lesson.title,'Practice question');
  }
 }
 const guided=window.VPQ_CLINPATH_GUIDED?.course||[];
 for(const exam of guided){
  let j=0;
  for(const section of exam.topics||[]){
   if(Array.isArray(section)&&typeof section[4]==='string'&&Array.isArray(section[5])){
    card('clinpath-guided-'+exam.exam+'-'+j,'Clinical Pathology','Exam '+exam.exam,section[4],section[5][section[6]]||'',exam.title,'Practice question');
   }
   j++;
  }
 }
 const cpRounds=window.VPQ_CLINPATH_DIAGNOSTIC_ROUNDS?.patients||[];
 for(const p of cpRounds)for(let k=0;k<(p.steps||[]).length;k++){
  const q=p.steps[k];if(Array.isArray(q.choices))card('clinpath-round-'+p.id+'-'+k,'Clinical Pathology','Exam '+p.exam,q.q,q.choices[q.a]+'\nWhy: '+(q.why||''),p.title,'Practice question');
 }
 const owned=ownerManifest||{};
 const hidden=new Set(owned.hidden||[]);
 items=items.filter(x=>!hidden.has(x.id)).map(x=>{
  const patch=owned.overrides?.[x.id];return patch?{...x,front:patch.prompt||x.front,back:(patch.answer||x.back)+(patch.why?'\nWhy: '+patch.why:''),source:patch.slide||x.source}:x;
 });
 for(const c of owned.custom||[]){
  if(hidden.has(c.id))continue;
  card(c.id,c.domain==='pharmacology'?'Pharmacology':c.domain==='pathology'?'Pathology':c.domain||'Other',c.lecture,c.prompt,c.answer+(c.why?'\nWhy: '+c.why:''),c.slide);
 }
 const stars=window.VPQ_STARRED?.exportForOwner?.()||[];
 for(const c of stars)card('star-copy-'+c.id,c.subject,'Starred review',c.front,c.back,c.origin,'Personal starred copy');
 // De-duplicate identical source identifiers, not matching content: matching content remains for audit.
 const seen=new Set();items=items.filter(x=>{const k=x.subject+'|'+x.id;if(seen.has(k))return false;seen.add(k);return true});
}
function groupMatches(){
 const map=new Map();
 for(const x of items){
  if(x.type==='Personal starred copy')continue;
  const key=x.subject+'|'+norm(x.front);
  if(!norm(x.front)||norm(x.front).length<12)continue;
  if(!map.has(key))map.set(key,[]);map.get(key).push(x);
 }
 return [...map.values()].filter(g=>g.length>1).sort((a,b)=>b.length-a.length||a[0].front.localeCompare(b[0].front));
}
function filtered(){
 const duplicateIDs=new Set(groupMatches().flat().map(x=>x.id));
 return items.filter(x=>(subject==='All'||x.subject===subject)&&
   (mode!=='duplicates'||duplicateIDs.has(x.id))&&
   (!query||[x.front,x.back,x.lecture,x.source,x.type].some(s=>norm(s).includes(norm(query)))));
}
function view(){
 if(!authorized)return login();
 const groups=groupMatches(),f=filtered(),subjs=['All',...new Set(items.map(x=>x.subject))].sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b));
 const list=f.slice(offset,offset+40),opt=subjs.map(s=>'<option value="'+esc(s)+'"'+(subject===s?' selected':'')+'>'+esc(s)+'</option>').join('');
 show('🔐 Owner · All Flashcards',`<div class="vpq-owner-audit"><p><b>${items.length} cards and practice questions indexed</b> · ${groups.length} repeated-question groups · ${f.length} visible</p>
 <p class="tiny">Only your verified GitHub owner session can open this audit. It is read-only; cards are never merged or deleted automatically. Different answers to the same question are shown separately for review.</p>
 <div class="vpq-owner-controls"><label>Subject<select id="vpqOwnerAuditSubject">${opt}</select></label><label>Find wording / answer<input id="vpqOwnerAuditSearch" type="search" value="${esc(query)}" placeholder="Find cards or source"></label><label>View<select id="vpqOwnerAuditMode"><option value="all" ${mode==='all'?'selected':''}>All cards</option><option value="duplicates" ${mode==='duplicates'?'selected':''}>Repeated questions</option></select></label></div>
 ${groups.length?'<p class="tiny">Duplicates are grouped by normalized question wording, within each subject. Similar questions with different wording may need manual review.</p>':''}
 ${list.length?list.map(x=>`<details class="vpq-owner-audit-card"><summary><b>${esc(x.front)}</b><small>${esc(x.subject)} · ${esc(x.lecture)} · ${esc(x.type)}</small></summary><p><b>Answer:</b> ${esc(x.back).replace(/\\n/g,'<br>')}</p><p class="tiny">Source: ${esc(x.source)} · ID: ${esc(x.id)}</p></details>`).join(''):'<p>No matching cards.</p>'}
 <div class="vpq-owner-controls"><button data-vpq-owner-audit-page="prev" ${offset===0?'disabled':''}>← Previous</button><span>${f.length?offset+1:0}–${Math.min(offset+40,f.length)} of ${f.length}</span><button data-vpq-owner-audit-page="next" ${offset+40>=f.length?'disabled':''}>Next →</button><button data-vpq-owner-audit-close="1">Close audit</button></div>
 </div>`);
}
function login(message=''){
 show('🔐 Owner · Flashcard Audit',`<div class="vpq-owner-audit"><p>This inventory is available only after GitHub confirms the repository owner's identity. Students cannot open the audit using a password alone.</p>
 ${message?'<p role="alert">'+esc(message)+'</p>':''}
 <label>Encrypted key password<input id="vpqOwnerAuditPassword" type="password" autocomplete="off" placeholder="Owner key vault password"></label>
 <label>GitHub token (only if no saved key)<input id="vpqOwnerAuditToken" type="password" autocomplete="off" placeholder="Fine-grained GitHub token"></label>
 <p class="tiny">Use your existing owner key vault. Your password and token are not saved by this audit feature.</p>
 <button data-vpq-owner-audit-verify="1">🔐 Verify owner & open library</button><p id="vpqOwnerAuditStatus" role="status"></p></div>`);
}
async function verify(){
 const pass=el('vpqOwnerAuditPassword')?.value||'',raw=el('vpqOwnerAuditToken')?.value?.trim()||'';
 if(el('vpqOwnerAuditPassword'))el('vpqOwnerAuditPassword').value='';
 if(el('vpqOwnerAuditToken'))el('vpqOwnerAuditToken').value='';
 const status=el('vpqOwnerAuditStatus');if(status)status.textContent='Verifying with GitHub…';
 let credential='';
 try{
  credential=raw||(await window.VPQ_OWNER_KEY_VAULT?.unlock?.(pass));
  if(!credential)throw Error('Enter your saved owner password or a GitHub token.');
  const headers={Accept:'application/vnd.github+json',Authorization:'Bearer '+credential,'X-GitHub-Api-Version':'2022-11-28'};
  const me=await fetch('https://api.github.com/user',{headers,cache:'no-store'});
  if(!me.ok)throw Error('GitHub did not verify this credential.');
  const account=await me.json();
  if(String(account.login).toLowerCase()!==OWNER)throw Error('This GitHub account is not the repository owner.');
  const record=await fetch(API+'/contents/'+DECK+'?ref=main',{headers,cache:'no-store'});
  if(!record.ok)throw Error('Owner verified, but the published card manifest could not be loaded.');
  const payload=await record.json();
  const bytes=Uint8Array.from(atob(payload.content.replace(/\s/g,'')),c=>c.charCodeAt(0));
  ownerManifest=JSON.parse(new TextDecoder().decode(bytes));
  authorized=true;
  credential='';
  scan();view();
 }catch(e){credential='';authorized=false;login(e.message||'Owner verification failed.')}
}
function init(){
 const btn=document.createElement('button');btn.type='button';btn.id='vpqOwnerAuditLaunch';btn.className='full';btn.textContent='🔐 Owner tools · All Flashcards & Duplicate Audit';
 btn.dataset.vpqOwnerAuditLaunch='1';
 const aside=document.querySelector('.vpq-shift-options');if(aside)aside.appendChild(btn);
 const css=document.createElement('style');css.textContent='.vpq-owner-audit{line-height:1.45}.vpq-owner-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:end;margin:12px 0}.vpq-owner-controls label{flex:1 1 135px;font-weight:700}.vpq-owner-controls input,.vpq-owner-controls select,.vpq-owner-audit input{width:100%;box-sizing:border-box;padding:9px;border:1px solid #c9b1df;border-radius:9px;margin-top:5px}.vpq-owner-audit-card{margin:9px 0;padding:12px;background:#faf5ff;border:1px solid #e1d4ed;border-radius:11px}.vpq-owner-audit-card small{display:block;color:#67577c;margin-top:4px}.vpq-owner-audit-card p{overflow-wrap:anywhere}';document.head.appendChild(css);
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-vpq-owner-audit-launch],[data-vpq-owner-audit-verify],[data-vpq-owner-audit-close],[data-vpq-owner-audit-page]');
  if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.vpqOwnerAuditLaunch!==undefined){if(authorized){scan();view()}else login();return}
  if(b.dataset.vpqOwnerAuditVerify!==undefined){verify();return}
  if(b.dataset.vpqOwnerAuditClose!==undefined){authorized=false;token='';ownerManifest=null;show('Owner audit closed','<p>This read-only session is closed.</p>');return}
  if(b.dataset.vpqOwnerAuditPage){const size=filtered().length;offset=Math.max(0,Math.min(Math.max(0,size-1),offset+(b.dataset.vpqOwnerAuditPage==='next'?40:-40)));offset=Math.floor(offset/40)*40;view()}
 },true);
 document.addEventListener('change',e=>{
  if(!authorized)return;
  if(e.target.id==='vpqOwnerAuditSubject'){subject=e.target.value;offset=0;view()}
  if(e.target.id==='vpqOwnerAuditMode'){mode=e.target.value;offset=0;view()}
  if(e.target.id==='vpqOwnerAuditSearch'){query=e.target.value;offset=0;view()}
 });
 document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target?.id==='vpqOwnerAuditSearch'){e.preventDefault();query=e.target.value;offset=0;view()}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.VPQ_OWNER_FLASHCARD_AUDIT=Object.freeze({open:()=>{if(authorized){scan();view()}else login()}});
})();