/* 186-item instructor guide learning mode; independent progress and no invented distractors. */
(function(){
'use strict';
const all=Array.isArray(window.VPQ_CARLSON_186)?window.VPQ_CARLSON_186:[];
const storage='vpq-carlson-186-progress-v1';
let progress={seen:[],ratings:{}};
try{const o=JSON.parse(localStorage.getItem(storage)||'{}');if(o&&typeof o==='object'){progress.seen=Array.isArray(o.seen)?o.seen:[];progress.ratings=o.ratings||{}}}catch(e){}
const lectures=['Lecture 1','Lecture 2','Lecture 3','Lecture 4','Lecture 5','Lectures 6–7','Lecture 8','Lecture 9'];
let chosen=new Set(lectures),queue=[],step=0,shown=false;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function store(){try{localStorage.setItem(storage,JSON.stringify(progress))}catch(e){}}
function shuffle(input){const a=input.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pool(){return all.filter(x=>chosen.has(x.lecture))}
function menu(){
const understood=all.filter(x=>progress.ratings[x.id]==='know').length;
const missed=all.filter(x=>progress.ratings[x.id]==='miss').length;
document.getElementById('screen').innerHTML='<h2>📚 Professor Guide · 186 answered prompts</h2>'+
'<p class="muted">Answer each objective aloud before revealing the worked explanation. Use the lecture filters to focus your studying. Your progress is stored separately from the multiple-choice game.</p>'+
'<div class="note"><b>'+progress.seen.length+' of 186 viewed</b> · '+understood+' understood · '+missed+' need review</div>'+
'<h3>Select lecture groups</h3><div class="vpq186-grid">'+lectures.map(l=>'<label><input type="checkbox" data-c186lecture="'+esc(l)+'" '+(chosen.has(l)?'checked':'')+'><span><b>'+esc(l)+'</b><small>'+all.filter(x=>x.lecture===l).length+' objectives</small></span></label>').join('')+'</div>'+
'<p class="muted">'+pool().length+' prompts selected. Short rounds prioritize unseen prompts and then weak concepts.</p>'+
'<div class="vpq186-actions"><button class="btn primary" data-c186start="short">🎲 12-question recall round</button><button class="btn green" data-c186start="full">📖 Browse all selected answers</button><button class="btn pink" data-c186start="weak">🔁 Review weak concepts</button><button class="btn" data-c186old="1">📝 Play existing 45-question MCQ drill</button></div>'+
'<p class="micro muted">Based on your completed 186-answer booklet. Medical and regulatory details still require independent validation; these are educational references, not prescribing protocols.</p>';
}
function begin(mode){
const candidates=pool();
if(mode==='weak')queue=shuffle(candidates.filter(x=>progress.ratings[x.id]==='miss'));
else if(mode==='full')queue=candidates.slice();
else {const unseen=shuffle(candidates.filter(x=>!progress.seen.includes(x.id))),weak=shuffle(candidates.filter(x=>progress.ratings[x.id]==='miss')),others=shuffle(candidates);queue=[...new Map([...unseen,...weak,...others].map(x=>[x.id,x])).values()].slice(0,12);}
if(!queue.length){document.getElementById('screen').innerHTML='<h2>No prompts match this review yet.</h2><button class="btn" data-c186home="1">← Change lecture selection</button>';return}
step=0;shown=false;question();
}
function question(){
const x=queue[step],rating=progress.ratings[x.id];
document.getElementById('screen').innerHTML='<div class="section-title"><h2>'+esc(x.lecture)+' · Professor Guide</h2><span class="chip">'+(step+1)+' / '+queue.length+'</span></div>'+
'<p class="muted">'+esc(x.section)+' · section prompt '+x.number+'</p><div class="vpq186-question"><small>Recall before revealing:</small><h2>'+esc(x.prompt)+'</h2></div>'+
(shown?'<div class="vpq186-answer"><h3>Model answer · mechanism / clinical WHY</h3><p>'+esc(x.answer)+'</p></div><div class="vpq186-actions"><button class="btn green" data-c186rating="know">✓ Understood</button><button class="btn pink" data-c186rating="miss">↻ Needs review</button></div>':'<button class="btn primary" data-c186reveal="1">Reveal answer + explanation</button>')+
'<div class="vpq186-actions"><button class="btn" data-c186prev="1" '+(step===0?'disabled':'')+'>← Previous</button><button class="btn" data-c186next="1">'+(step===queue.length-1?'Finish round':'Next →')+'</button><button class="btn" data-c186home="1">All 186 / change lecture</button></div>'+
(rating?'<p class="muted">Last self-rating: '+(rating==='know'?'Understood':'Needs review')+'</p>':'');
}
const previousGuide=vpqGuideStart37;
vpqGuideStart37=function(){menu()};
const screen=document.getElementById('screen');
screen.addEventListener('click',event=>{
const b=event.target.closest('button');if(!b)return;const d=b.dataset;
if(d.c186old!==undefined)return previousGuide();
if(d.c186home!==undefined)return menu();
if(d.c186start!==undefined)return begin(d.c186start);
if(d.c186reveal!==undefined){shown=true;if(!progress.seen.includes(queue[step].id))progress.seen.push(queue[step].id);store();return question()}
if(d.c186rating!==undefined){progress.ratings[queue[step].id]=d.c186rating;store();return question()}
if(d.c186prev!==undefined){if(step>0)step--;shown=false;return question()}
if(d.c186next!==undefined){if(step<queue.length-1){step++;shown=false;return question()}return menu()}
});
screen.addEventListener('change',event=>{const e=event.target;if(e.dataset.c186lecture===undefined)return;e.checked?chosen.add(e.dataset.c186lecture):chosen.delete(e.dataset.c186lecture);menu()});
const style=document.createElement('style');style.textContent='.vpq186-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}.vpq186-grid label{display:flex;gap:10px;padding:11px;border:1px solid #ccdaed;border-radius:11px;background:#fff;cursor:pointer}.vpq186-grid b,.vpq186-grid small{display:block}.vpq186-grid small{font-size:12px;color:#63758c}.vpq186-actions{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.vpq186-question{background:#fff;padding:18px;border:2px solid #bca7e1;border-radius:16px;margin:15px 0}.vpq186-question h2{font-size:clamp(19px,2.4vw,25px);line-height:1.45}.vpq186-answer{background:#effaf2;border:2px solid #a3d4b6;padding:17px;border-radius:15px;line-height:1.6}';document.head.appendChild(style);
})();