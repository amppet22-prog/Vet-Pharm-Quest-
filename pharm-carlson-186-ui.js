/* Professor Guide v2: editable personal cards, recall-first questions, readable answers. */
(function(){
'use strict';
const source=Array.isArray(window.VPQ_CARLSON_186)?window.VPQ_CARLSON_186:[];
const SK='vpq-carlson-186-progress-v1', CK='vpq-carlson-186-personal-cards-v2';
const groups=['Lecture 1','Lecture 2','Lecture 3','Lecture 4','Lecture 5','Lectures 6–7','Lecture 8','Lecture 9'];
const base=new Set(source.map(x=>x.id));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
const screen=document.getElementById('screen');
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return {}}};
let progress=read(SK);progress.seen=Array.isArray(progress.seen)?progress.seen:[];progress.ratings=progress.ratings||{};
let personal=read(CK);personal.overrides=personal.overrides||{};personal.added=Array.isArray(personal.added)?personal.added:[];
const save=()=>{try{localStorage.setItem(CK,JSON.stringify(personal))}catch(e){alert('Could not save locally. Use Export Cards to preserve content.')}};
const saveProgress=()=>{try{localStorage.setItem(SK,JSON.stringify(progress))}catch(e){}};
let chosen=new Set(groups),queue=[],position=0,revealed=false,editId=null;
const every=()=>source.map(x=>({...x,...(personal.overrides[x.id]||{})})).concat(personal.added.filter(x=>x&&x.id&&!base.has(x.id)));
const card=id=>every().find(x=>x.id===id);
const pool=()=>every().filter(x=>chosen.has(x.lecture));
const shuffle=items=>{const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const inline=x=>esc(x).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
function answerHTML(value){
 const s=String(value||'').trim();if(!s)return '<p>Answer not entered.</p>';
 let parts=s.replace(/\s+(?=\*\*(?:\d+\.|Additional clinical|Clinical cautions|Species differences|Monitoring))/gi,'\n').split(/\n+/);
 if(parts.length===1&&s.length>110)parts=s.split(/;\s+(?=[A-Z][\w/-]{2,25}(?:\s+[\w/-]{2,25}){0,4}:)/);
 if(parts.length===1&&s.length>300)parts=s.split(/(?<=[.!?])\s+(?=[A-Z])/);
 return parts.filter(Boolean).map(p=>{
  let content=inline(p.trim());
  content=content.replace(/^([^<>]{2,55}):\s/,'<strong>$1:</strong> ');
  return '<p class="c186-answer-line">'+content+'</p>';
 }).join('');
}
function home(message=''){
 const items=every(),viewed=progress.seen.filter(x=>base.has(x)).length,known=items.filter(x=>progress.ratings[x.id]==='know').length,weak=items.filter(x=>progress.ratings[x.id]==='miss').length;
 screen.innerHTML='<h2>📚 Professor Guide · 186 prompts + your cards</h2>'+
 '<p>Recall the answer before revealing it. You can correct questions, add your own cards, and export/import your personal collection. The original instructor guide remains intact in GitHub.</p>'+
 (message?'<div class="note">'+esc(message)+'</div>':'')+
 '<div class="note"><b>'+viewed+' / 186 original prompts viewed</b> · '+personal.added.length+' added cards · '+known+' understood · '+weak+' to review</div>'+
 '<h3>Select lecture groups</h3><div class="c186-grid">'+groups.map(g=>'<label><input type="checkbox" data-c186group="'+esc(g)+'" '+(chosen.has(g)?'checked':'')+'><span><b>'+esc(g)+'</b><small>'+items.filter(x=>x.lecture===g).length+' cards</small></span></label>').join('')+'</div>'+
 '<p>'+pool().length+' cards in selected groups. Short rounds prioritize unseen and missed cards.</p>'+
 '<div class="c186-actions"><button class="btn primary" data-c186start="short">🎲 12-card recall round</button><button class="btn green" data-c186start="full">📖 Review all selected</button><button class="btn pink" data-c186start="weak">↻ Review weak cards</button><button class="btn" data-c186old="1">📝 Original MCQ drill</button></div>'+
 '<section class="c186-editor-menu"><h3>✏️ Edit and Add Cards</h3><p>Changes are saved <b>only in this browser</b> and included in exports. They do not change the shared GitHub game automatically.</p>'+
 '<div class="c186-actions"><button class="btn primary" data-c186new="1">＋ Add Card</button><button class="btn" data-c186browse="1">✏️ Edit Cards</button><button class="btn" data-c186export="1">⬇ Export Cards</button><button class="btn" data-c186import="1">⬆ Import Cards</button></div><input type="file" id="c186File" accept="application/json,.json" style="display:none"></section>';
}
function begin(mode){
 const current=pool();let selected;
 if(mode==='full')selected=current;
 else if(mode==='weak')selected=shuffle(current.filter(x=>progress.ratings[x.id]==='miss'));
 else selected=[...new Map([...shuffle(current.filter(x=>!progress.seen.includes(x.id))),...shuffle(current.filter(x=>progress.ratings[x.id]==='miss')),...shuffle(current)].map(x=>[x.id,x])).values()].slice(0,12);
 queue=selected.map(x=>x.id);position=0;revealed=false;
 if(!queue.length)return home('No cards match this selection.');showQuestion();
}
function showQuestion(){
 const x=card(queue[position]);if(!x)return home('This card is no longer available.');
 const custom=!base.has(x.id);
 screen.innerHTML='<div class="section-title"><h2>'+esc(x.lecture)+' · Professor Guide</h2><span class="chip">'+(position+1)+' / '+queue.length+'</span></div>'+
 '<p class="muted">'+esc(x.section||'My Cards')+' · '+(custom?'personal card':'prompt '+x.number)+'</p>'+
 '<div class="c186-question"><small>Try to answer before revealing:</small><h2>'+esc(x.prompt)+'</h2></div>'+
 (revealed?'<div class="c186-answer"><h3>Model answer · mechanism and clinical WHY</h3>'+answerHTML(x.answer)+
 (x.originalPrompt?'<details><summary>Original source prompt</summary><p>'+esc(x.originalPrompt)+'</p></details>':'')+
 (x.originalAnswer?'<details><summary>Previous source answer</summary><p>'+esc(x.originalAnswer)+'</p></details>':'')+'</div><div class="c186-actions"><button class="btn green" data-c186rating="know">✓ Understood</button><button class="btn pink" data-c186rating="miss">↻ Needs review</button></div>':'<button class="btn primary" data-c186reveal="1">Reveal answer</button>')+
 '<div class="c186-actions"><button class="btn" data-c186prev="1" '+(position===0?'disabled':'')+'>← Previous</button><button class="btn" data-c186next="1">'+(position===queue.length-1?'Finish':'Next →')+'</button><button class="btn" data-c186edit="'+esc(x.id)+'">✏️ Edit Card</button><button class="btn" data-c186new="1">＋ Add Card</button><button class="btn" data-c186home="1">All cards / lectures</button></div>';
}
function edit(id){
 editId=id||null;
 const c=editId?card(editId):null;
 if(editId&&!c)return home('Card not found.');
 const current=c||{lecture:[...chosen][0]||groups[0],prompt:'',answer:'',section:'My own cards'};
 screen.innerHTML='<h2>'+(c?'✏️ Edit Card':'＋ Add New Card')+'</h2><p>Make the prompt an actual question. Put different answer subjects on separate lines; wrap words in <code>**double asterisks**</code> to make them bold.</p>'+
 '<form id="c186Form" class="c186-form"><label>Lecture group<select name="lecture">'+groups.map(g=>'<option value="'+esc(g)+'" '+(current.lecture===g?'selected':'')+'>'+esc(g)+'</option>').join('')+'</select></label>'+
 '<label>Card topic / section<input name="section" maxlength="120" value="'+esc(current.section||'')+'"></label>'+
 '<label>Recall question<textarea name="prompt" rows="4" maxlength="1800" required>'+esc(current.prompt)+'</textarea></label>'+
 '<label>Model answer — add line breaks and **bold** labels<textarea name="answer" rows="10" maxlength="12000" required>'+esc(current.answer)+'</textarea></label>'+
 '<div class="c186-actions"><button type="submit" class="btn primary">💾 Save Card</button><button type="button" class="btn" data-c186cancel="1">Cancel</button>'+
 (c&&!base.has(c.id)?'<button type="button" class="btn pink" data-c186delete="'+esc(c.id)+'">Delete personal card</button>':'')+
 (c&&base.has(c.id)&&personal.overrides[c.id]?'<button type="button" class="btn" data-c186reset="'+esc(c.id)+'">Restore original</button>':'')+'</div></form>';
}
function browse(){
 screen.innerHTML='<h2>✏️ Choose a card to edit</h2><p>Original 186 questions plus your personal additions. Changes to original cards are local overrides.</p>'+
 '<label>Filter questions<input id="c186Search" placeholder="Search by drug, lecture or question"></label>'+
 '<div id="c186Browse">'+every().map(x=>'<button class="c186-list" data-c186edit="'+esc(x.id)+'"><b>'+esc(x.lecture)+'</b> · '+esc(x.prompt)+'</button>').join('')+'</div><button class="btn" data-c186home="1">← All cards</button>';
}
function useForm(form){
 const data=new FormData(form),lecture=String(data.get('lecture')||''),section=String(data.get('section')||'').trim(),prompt=String(data.get('prompt')||'').trim(),answer=String(data.get('answer')||'').trim();
 if(!groups.includes(lecture)||!prompt||!answer)return alert('Select a valid lecture and enter both a question and answer.');
 if(editId&&base.has(editId))personal.overrides[editId]={lecture,section,prompt,answer};
 else if(editId){const i=personal.added.findIndex(x=>x.id===editId);if(i>=0)personal.added[i]={...personal.added[i],lecture,section,prompt,answer};}
 else{const id='my-carlson-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);personal.added.push({id,lecture,section,number:personal.added.length+1,prompt,answer,source:'My editable study cards'});}
 save();home('Card saved in this browser. Export Cards for backup or sharing.');
}
function exportCards(){
 const data={format:'vpq-professor-cards',version:2,exportedAt:new Date().toISOString(),overrides:personal.overrides,added:personal.added};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='vet-pharm-quest-personal-professor-cards.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function importCards(file){
 if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const x=JSON.parse(String(reader.result));
   if(x.format!=='vpq-professor-cards'||x.version!==2||!Array.isArray(x.added)||!x.overrides||typeof x.overrides!=='object')throw Error('Not a Professor Cards export.');
   const valid=d=>d&&typeof d.id==='string'&&groups.includes(d.lecture)&&typeof d.prompt==='string'&&typeof d.answer==='string'&&d.prompt.length<=1800&&d.answer.length<=12000;
   const overrides={...personal.overrides};
   for(const [id,d] of Object.entries(x.overrides)){if(base.has(id)&&d&&groups.includes(d.lecture)&&typeof d.prompt==='string'&&typeof d.answer==='string')overrides[id]={lecture:d.lecture,section:String(d.section||'').slice(0,120),prompt:d.prompt.slice(0,1800),answer:d.answer.slice(0,12000)}}
   const added=[...new Map([...personal.added,...x.added.filter(valid).filter(d=>!base.has(d.id))].map(d=>[d.id,d])).values()].slice(0,1000);
   personal.overrides=overrides;personal.added=added;save();home('Cards imported and merged into your local collection.');
  }catch(e){alert('Could not import cards: '+e.message)}
 };
 reader.readAsText(file);
}
const previous=vpqGuideStart37;
vpqGuideStart37=function(){home()};
screen.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.c186Old!==undefined)return previous();
 if(d.c186Home!==undefined||d.c186Cancel!==undefined)return home();
 if(d.c186Start!==undefined)return begin(d.c186Start);
 if(d.c186Reveal!==undefined){revealed=true;const id=queue[position];if(!progress.seen.includes(id))progress.seen.push(id);saveProgress();return showQuestion()}
 if(d.c186Rating!==undefined){progress.ratings[queue[position]]=d.c186Rating;saveProgress();return showQuestion()}
 if(d.c186Prev!==undefined){if(position>0)position--;revealed=false;return showQuestion()}
 if(d.c186Next!==undefined){if(position+1>=queue.length)return home();position++;revealed=false;return showQuestion()}
 if(d.c186Edit!==undefined)return edit(d.c186Edit);
 if(d.c186New!==undefined)return edit(null);
 if(d.c186Browse!==undefined)return browse();
 if(d.c186Reset!==undefined){delete personal.overrides[d.c186Reset];save();return home('Original source card restored.')}
 if(d.c186Delete!==undefined){personal.added=personal.added.filter(x=>x.id!==d.c186Delete);save();return home('Personal card deleted.')}
 if(d.c186Export!==undefined)return exportCards();
 if(d.c186Import!==undefined)return document.getElementById('c186File')?.click();
});
screen.addEventListener('change',e=>{
 if(e.target.dataset.c186group!==undefined){const g=e.target.dataset.c186group;e.target.checked?chosen.add(g):chosen.delete(g);return home()}
 if(e.target.id==='c186File')return importCards(e.target.files?.[0]);
});
screen.addEventListener('submit',e=>{if(e.target.id==='c186Form'){e.preventDefault();useForm(e.target)}});
screen.addEventListener('input',e=>{if(e.target.id!=='c186Search')return;const q=e.target.value.toLowerCase();screen.querySelectorAll('.c186-list').forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(q))});
try{if(typeof tab!=='undefined'&&tab==='guide')home()}catch(e){}
const style=document.createElement('style');
style.textContent='.c186-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:8px;margin:12px 0}.c186-grid label{display:flex;gap:9px;align-items:center;padding:11px;background:#fff;border:1px solid #cbd9ea;border-radius:11px;cursor:pointer}.c186-grid small,.c186-grid b{display:block}.c186-grid small{font-size:11px}.c186-actions{display:flex;flex-wrap:wrap;gap:9px;margin:13px 0}.c186-question,.c186-answer{margin:15px 0;padding:18px;border-radius:14px}.c186-question{background:#fff;border:2px solid #bea5ed}.c186-answer{background:#eef9f1;border:2px solid #a7d8b8;line-height:1.55}.c186-answer-line{margin:0 0 10px;padding:0 0 9px;border-bottom:1px solid #c5dfcc}.c186-answer-line:last-child{border:0}.c186-editor-menu{background:#f7f3fc;padding:15px;border-radius:13px;border:1px solid #d6c5e8}.c186-form{display:grid;gap:15px}.c186-form label{display:grid;gap:5px;font-weight:700}.c186-form select,.c186-form textarea,.c186-form input,#c186Search{padding:10px;width:100%;border:1px solid #b4c6d9;border-radius:8px;background:white;color:#233c57}.c186-list{display:block;width:100%;text-align:left;padding:10px;margin:6px 0;background:white;border:1px solid #ccd8e6;border-radius:9px}.c186-list[hidden]{display:none}';
document.head.appendChild(style);
})();