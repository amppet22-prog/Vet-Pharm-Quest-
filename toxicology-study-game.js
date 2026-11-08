/* Vet Pharm Quest: lecture-selected, ungraded veterinary Toxicology practice. */
window.VPQ_TOX_STUDY_GAME=(function(){
'use strict';
const data=()=>window.VPQ_TOX_PRACTICE_BANK||[];
const topics=()=>window.VPQ_ToxicologyPreview?.topics||[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let session=null;
let chosen=new Set(topics().map(x=>x.id)),mode='all';
let api=null;
function shuffled(items){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function setup(){
 if(!api)return;
 if(!chosen.size)chosen=new Set(topics().map(x=>x.id));
 const n=data().filter(q=>chosen.has(q.lecture)&&(mode==='all'||q.mode===mode)).length;
 api.showModal('☣️ Toxicology · Lecture Practice',
 '<div class="vpqToxPracticeHead"><b>Choose your lecture focus</b><p>Practice toxicant mechanisms and patient recognition, then see the clinical WHY after every answer. This starter bank is separate from the graded Pharmacy and One Health games.</p></div>'+
 '<div class="vpqToxPracticeUnits">'+topics().map(x=>'<label><input type="checkbox" data-vpqtoxselect="'+esc(x.id)+'" '+(chosen.has(x.id)?'checked':'')+'> <span>'+esc(x.lectures)+' · '+esc(x.title)+'</span></label>').join('')+'</div>'+
 '<div class="buttonrow"><button type="button" data-vpqtoxall="1">Select all lectures</button><button type="button" data-vpqtoxnone="1">Clear selection</button></div>'+
 '<label class="field">Question style<select id="vpqToxPracticeMode" class="input"><option value="all" '+(mode==='all'?'selected':'')+'>Mixed: mechanism + clinical cases</option><option value="clinical" '+(mode==='clinical'?'selected':'')+'>Patient cases</option><option value="mechanism" '+(mode==='mechanism'?'selected':'')+'>Drug / toxin targets</option></select></label>'+
 '<p class="small" id="vpqToxPracticeCount">'+n+' available questions for your selections</p>'+
 '<div class="buttonrow"><button type="button" data-vpqtoxbegin="1" '+(n?'':'disabled')+'>▶ Start practice</button><button type="button" data-vpqtoxcourse="1">📚 Lecture Atlas</button></div>'+
 '<p class="tiny">The current bank covers selected high-yield topics, not every toxicant in all lectures. No XP is awarded and scores are not written to the existing grade or mastery save.</p>');
}
function updateCounter(){
 const root=api?.modalBody;if(!root)return;
 const count=data().filter(q=>chosen.has(q.lecture)&&(mode==='all'||q.mode===mode)).length;
 const c=root.querySelector('#vpqToxPracticeCount');if(c)c.textContent=count+' available questions for your selections';
 const start=root.querySelector('[data-vpqtoxbegin]');if(start)start.disabled=!count;
}
function begin(){
 const pool=shuffled(data().filter(q=>chosen.has(q.lecture)&&(mode==='all'||q.mode===mode)));
 if(!pool.length)return setup();
 session={pool,idx:0,score:0,answered:false,missed:[],selected:[...chosen],mode};
 show();
}
function show(){
 if(!session)return setup();
 const s=session;
 if(s.idx>=s.pool.length)return results();
 s.answered=false;
 const q=s.pool[s.idx],topic=topics().find(t=>t.id===q.lecture);
 const opts=shuffled(q.options.map((name,i)=>({name,i})));
 api.showModal('☣️ Toxicology Practice · '+(s.idx+1)+' / '+s.pool.length,
 '<p class="small">📚 '+esc(topic?.lectures||q.lecture)+' · '+esc(q.mode==='clinical'?'Clinical recognition':'Toxicant mechanism')+'</p>'+
 '<div class="vpqToxQuestion"><b>'+esc(q.question)+'</b></div>'+
 '<div class="vpqToxAnswers">'+opts.map((v,i)=>'<button type="button" data-vpqtoxanswer="'+v.i+'"><b>'+String.fromCharCode(65+i)+'.</b> '+esc(v.name)+'</button>').join('')+'</div>'+
 '<div class="buttonrow"><button data-vpqtoxsetup="1">← Change lectures</button></div>'+
 '<p class="tiny">Study practice only. Do not use questions as a poisoning-treatment protocol.</p>');
}
function answer(v){
 const s=session;if(!s||s.answered)return;
 const q=s.pool[s.idx],correct=Number(v)===q.answer;
 s.answered=true;if(correct)s.score++;else s.missed.push(q.id);
 const card=(window.VPQ_TOX_EXPANSION?.cards||[]).concat(window.VPQ_TOX_LECTURE_SUPPLEMENTS||[]).find(x=>x.id===q.toxicant);
 api.showModal('☣️ '+(correct?'Correct!':'Mechanism review'),
 '<div class="vpqToxFeedback '+(correct?'correct':'incorrect')+'"><b>'+(correct?'✓ Correct':'✗ Review the target')+'</b><p>'+esc(q.question)+'</p><p><strong>Best answer:</strong> '+esc(q.options[q.answer])+'</p></div>'+
 '<details class="vpqToxWhy"><summary>🧠 Reveal WHY this is correct</summary><p>'+esc(q.why)+'</p></details>'+
 (card?'<details class="vpqToxWhy"><summary>🩺 Clinical-use notes: species, signs and comparisons</summary><p><b>Species:</b> '+esc(card.species)+'</p><p><b>Signs:</b> '+esc(card.signs)+'</p><p><b>Do not confuse:</b> '+esc(card.distinction)+'</p></details>':'')+
 '<p class="small">Current score: '+s.score+' / '+(s.idx+1)+'</p>'+
 '<div class="buttonrow"><button data-vpqtoxnext="1">'+(s.idx===s.pool.length-1?'See results':'Next question →')+'</button><button data-vpqtoxbacklecture="'+esc(q.lecture)+'">📚 Review this lecture</button></div>');
}
function results(){
 const s=session;
 api.showModal('☣️ Toxicology Practice · Results',
 '<div class="vpqToxPracticeHead"><b>'+s.score+' / '+s.pool.length+' correct</b><p>Ungraded personal practice. Your original Pharm and One Health scores were not changed.</p></div>'+
 (s.missed.length?'<p class="small">'+s.missed.length+' question(s) to revisit. Retry the same lecture focus or return to the linked toxicant cards.</p>':'<p class="small">Nice work! Try a different lecture focus or switch between cases and mechanisms.</p>')+
 '<div class="buttonrow"><button data-vpqtoxretry="1">↻ New questions, same focus</button><button data-vpqtoxsetup="1">Choose lectures</button><button data-vpqtoxcourse="1">📚 Lecture atlas</button></div>');
}
function init(options){
 api=options;
 api.modalBody.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  const d=b.dataset;
  if(d.vpqtoxall!==undefined){chosen=new Set(topics().map(x=>x.id));api.modalBody.querySelectorAll('[data-vpqtoxselect]').forEach(el=>el.checked=true);updateCounter()}
  if(d.vpqtoxnone!==undefined){chosen.clear();api.modalBody.querySelectorAll('[data-vpqtoxselect]').forEach(el=>el.checked=false);updateCounter()}
  if(d.vpqtoxbegin!==undefined)return begin();
  if(d.vpqtoxanswer!==undefined)return answer(d.vpqtoxanswer);
  if(d.vpqtoxnext!==undefined){if(session){session.idx++;show()}return}
  if(d.vpqtoxretry!==undefined)return begin();
  if(d.vpqtoxsetup!==undefined)return setup();
  if(d.vpqtoxbacklecture!==undefined)return api.openLecture(d.vpqtoxbacklecture);
 });
 api.modalBody.addEventListener('change',event=>{
  const el=event.target;
  if(el.dataset.vpqtoxselect!==undefined){if(el.checked)chosen.add(el.dataset.vpqtoxselect);else chosen.delete(el.dataset.vpqtoxselect);updateCounter()}
  if(el.id==='vpqToxPracticeMode'){mode=el.value;updateCounter()}
 });
 return {open:setup,begin};
}
const style=document.createElement('style');
style.textContent='.vpqToxPracticeHead{background:linear-gradient(120deg,#e8f6f3,#f0e7fc);border:2px solid #abcfc6;border-radius:14px;padding:15px;margin:8px 0}.vpqToxPracticeHead b{font-size:18px;color:#385c68}.vpqToxPracticeHead p{font-size:13px;line-height:1.55}.vpqToxPracticeUnits{display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:9px;margin:13px 0}.vpqToxPracticeUnits label{padding:11px;background:#f5f5fc;border:1px solid #d0cbdf;border-radius:10px;display:flex;align-items:flex-start;gap:8px;font-size:12px;cursor:pointer}.vpqToxPracticeUnits label:has(input:checked){background:#e6f5f0;border-color:#7dafa1}.vpqToxQuestion{font-size:16px;line-height:1.65;background:#eef6ff;border-left:5px solid #759bc7;padding:14px;border-radius:10px;margin:14px 0}.vpqToxAnswers{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:10px;margin-bottom:14px}.vpqToxAnswers button{text-align:left;background:#fff;border:2px solid #bdcddd;border-radius:11px;padding:12px;line-height:1.5}.vpqToxAnswers button:hover,.vpqToxAnswers button:focus-visible{outline:2px solid #9168b6}.vpqToxFeedback{border-left:5px solid #7ca9b8;background:#eef7f8;border-radius:10px;padding:12px}.vpqToxFeedback.correct{background:#e7f7e9;border-color:#69a777}.vpqToxFeedback.incorrect{background:#fff0ed;border-color:#ca897d}.vpqToxFeedback p{font-size:13px;line-height:1.5}.vpqToxWhy{background:#f8f3ff;border:1px solid #d4c7e9;padding:13px;border-radius:12px;margin:10px 0}.vpqToxWhy h3{font-size:14px;margin:0 0 8px}.vpqToxWhy p{font-size:13px;line-height:1.6;margin:6px 0}@media(max-width:600px){.vpqToxPracticeUnits,.vpqToxAnswers{grid-template-columns:1fr}}';
style.textContent+='.vpqToxWhy summary{cursor:pointer;font-size:14px;font-weight:900;color:#5d4883;padding:5px 0}.vpqToxWhy[open]{background:#f0e9fc;border-color:#b39bd6}.vpqToxWhy summary:focus-visible{outline:3px solid #9981bd;outline-offset:2px}';
document.head.appendChild(style);
return {init};
})();