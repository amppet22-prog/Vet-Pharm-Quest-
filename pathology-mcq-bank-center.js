/* Pathology MCQ Bank and source-level coverage dashboard.
 * A VIEW over already loaded lecture practiceQuestions: no bank replication, ID changes,
 * save migrations, or source-file modifications.
 */
window.VPQ_PATH_MCQ_CENTER=(function(){
'use strict';
let host=null,lecture='67',mode='browse',quiz=[],index=0,answers={},browsePage=0,scope='all',missedOnly=false;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&#39;'}[c]));
const key='vpq-path-mcq-missed-v1';
function getMissed(){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(e){return {}}}
function putMissed(id,wrong){const store=getMissed();if(wrong)store[id]=true;else delete store[id];try{localStorage.setItem(key,JSON.stringify(store))}catch(e){}}
function lessons(){return window.VPQ_PATH_LECTURE_LEARN||{}}
function collect(n){
 const seen=new Set(),items=[],l=lessons()[String(n)];
 for(const section of l?.sections||[])for(const q of section.practiceQuestions||[]){
  if(!q||!Array.isArray(q.options)||q.options.length<2||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>=q.options.length||!String(q.prompt||q.question||'').trim())continue;
  const id=String(q.id||n+'-'+section.title+'-'+q.prompt);
  if(seen.has(id))continue;
  seen.add(id);
  items.push({...q,sourceSection:section.title,lecture:String(n),stableID:id});
 }
 return items;
}
function totals(){
 const chapters=window.VPQ_NECROPSY_HANDBOOK?.chapters||[],titles=new Map(chapters.map(x=>[String(x[0]),x[1]]));
 const foundation=window.VPQ_PATH_FOUNDATIONS?.inventory?.()||[];
 const foundationByNumber={};
 for(const entry of foundation){
  const match=String(entry.title||'').match(/^(\d{1,2})\s*[·.\-]/);
  if(match)foundationByNumber[match[1]]=entry;
 }
 const cases=[...(window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[]),...(window.VPQ_NECROPSY_OWNER_PUBLISH?.getCustomCases?.()||[])];
 const specs=window.VPQ_PATH_EXAM7?.cards||[];
 return Array.from({length:79},(_,i)=>String(i+1)).map(n=>{
  const l=lessons()[n],sections=l?.sections||[],base=foundationByNumber[n],mcq=collect(n);
  const prelim=sections.filter(s=>/preliminary|source.index|objective.index|verification pending|foundation/i.test(String(s.sourceStatus||''))||/Exam 6 source.index/i.test(String(s.group||'')));
  const detailed=sections.filter(s=>s.diseaseAtlas||s.points?.some(p=>/gross|histo|pathogenesis|differential/i.test(String(p?.[0]||''))));
  const parts=sections.filter(s=>s.points?.length||s.flashcards?.length||s.practiceQuestions?.length).length;
  const entry={n,title:l?.title||titles.get(n)||base?.title?.replace(/^\d+\s*[·.\-]\s*/,'')||'Not indexed',
   sections:sections.length,foundations:base?.sections||0,flash:sections.reduce((a,x)=>a+(x.flashcards?.length||0),0),
   mcq:mcq.length,atlas:specs.filter(x=>String(x.lecture)===n&&!x.normal).length,
   cases:cases.filter(x=>String(x.lecture)===n&&x.sourceType!=='SBA').length,
   source:l?.source||base?.source||'',hasLesson:!!l,hasFoundation:!!base,
   preliminary:prelim.length,detailed:detailed.length,populated:parts};
  entry.flags=[];
  if(!entry.hasLesson&&!entry.hasFoundation)entry.flags.push('No indexed Learn First lesson');
  if(entry.preliminary)entry.flags.push(entry.preliminary+' source-index topics need deep verification');
  if(!entry.mcq)entry.flags.push('No MCQs in shared lecture bank');
  if(!entry.flash&&!entry.hasFoundation)entry.flags.push('No linked recall cards');
  if(!entry.atlas)entry.flags.push('No linked specimen cards');
  if(!entry.cases)entry.flags.push('No linked differential cases');
  if(!entry.source)entry.flags.push('Lecture source not indexed');
  return entry;
 });
}
function options(){return totals().map(t=>'<option value="'+esc(t.n)+'" '+(lecture===t.n?'selected':'')+'>L'+esc(t.n)+' · '+esc(t.title)+' ('+t.mcq+' MCQs)</option>').join('')}
function shell(title,body){
 if(!host?.showModal)return;
 host.showModal(title,
 '<style>.pmcq-intro{background:linear-gradient(112deg,#eef7ff,#fff1fa);border:1px solid #cbdcef;border-radius:14px;padding:13px;margin-bottom:12px}.pmcq-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px}.pmcq-entry{border:1px solid #d9dfed;border-radius:11px;padding:10px;background:#fff}.pmcq-entry b{color:#355276;font-size:13px}.pmcq-entry small{display:block;color:#65748c;margin-top:4px}.pmcq-choice{display:flex;gap:10px;text-align:left;align-items:flex-start;width:100%;padding:11px 12px;margin:7px 0;border:1px solid #bccfe2;border-radius:10px;background:#fff;color:#304966;white-space:normal}.pmcq-choice:disabled{opacity:1;cursor:default}.pmcq-choice.right{background:#e4f7eb!important;border:2px solid #3d9d6e!important;color:#205c43!important}.pmcq-choice.wrong{background:#fff0df!important;border:2px solid #dd9550!important;color:#885020!important}.pmcq-letter{background:#e9effb;padding:4px 7px;border-radius:7px;min-width:26px;text-align:center;font-weight:850}.pmcq-controls{display:flex;gap:7px;flex-wrap:wrap;margin:9px 0}.pmcq-controls button,.pmcq-controls select{font-size:12px;padding:8px}.pmcq-feedback{border-radius:11px;background:#f4f8fd;border:1px solid #d3e0f0;padding:12px;margin:11px 0;font-size:13px}.pmcq-note{font-size:12px;color:#64748b;line-height:1.5}.pmcq-current{font-size:12px;font-weight:800;color:#526d91}.pmcq-results{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:10px 0}.pmcq-results div{background:#edf5fc;padding:10px;border-radius:10px;text-align:center;font-weight:750}@media(max-width:590px){.pmcq-results{grid-template-columns:repeat(2,minmax(0,1fr))}}</style>'+
 '<div class="pmcq-controls"><button data-pathmcq-home="1">📚 MCQ Bank</button><button data-pathmcq-coverage="1">📋 Lecture Coverage</button><button data-pathmcq-handbook="1">← Pathology Handbook</button></div>'+body);
}
function menu(n){
 mode='browse';if(n!==undefined)lecture=String(n);
 const all=collect(lecture),wrong=getMissed(),visible=missedOnly?all.filter(q=>wrong[q.stableID]):all;
 const pageCount=Math.max(1,Math.ceil(visible.length/25));
 browsePage=Math.min(Math.max(0,browsePage),pageCount-1);
 const slice=visible.slice(browsePage*25,(browsePage+1)*25);
 shell('📋 Pathology · Original MCQ Bank',
 '<div class="pmcq-intro"><b>Every original question in one place</b><p class="pmcq-note">Questions are read directly from lecture sections. This is separate from flip flashcards; original options, answer keys, question IDs and sources are preserved. The list shows all available structured MCQs, not only 15 cards.</p></div>'+
 '<label><b>Choose lecture</b><select data-pathmcq-select="1" style="width:100%;margin-top:5px;padding:9px">'+options()+'</select></label>'+
 '<div class="pmcq-results"><div>'+all.length+'<small> MCQs</small></div><div>'+(lessons()[lecture]?.sections?.length||0)+'<small> lesson sections</small></div><div>'+all.filter(q=>q.needsFigure).length+'<small> figure-dependent</small></div><div>'+all.filter(q=>wrong[q.stableID]).length+'<small> missed</small></div></div>'+
 '<div class="pmcq-controls"><button data-pathmcq-start="10" '+(!all.length?'disabled':'')+'>▶ Practice 10</button><button data-pathmcq-start="20" '+(!all.length?'disabled':'')+'>▶ Practice 20</button><button data-pathmcq-start="all" '+(!all.length?'disabled':'')+'>▶ All '+all.length+'</button><button data-pathmcq-missed="1">'+(missedOnly?'✓ Missed only':'Review missed')+'</button></div>'+
 (visible.length?'<p class="pmcq-note">Browsing '+(browsePage*25+1)+'–'+Math.min(visible.length,(browsePage+1)*25)+' of '+visible.length+'. Select a question to practice it with immediate feedback.</p>':'<p class="pmcq-note">No '+(missedOnly?'missed ':'')+'MCQs are indexed for this lecture in the shared lesson data. This does not mean the entire lecture is missing; check the lecture coverage dashboard.</p>')+
 '<div class="pmcq-grid">'+slice.map((q,i)=>'<button class="pmcq-entry" data-pathmcq-openone="'+esc(q.stableID)+'"><b>Q'+(browsePage*25+i+1)+'. '+esc(q.prompt||q.question)+'</b><small>'+esc(q.sourceSection||'')+' · '+esc(q.source||'original lecture question')+(q.needsFigure?' · ⚠ Figure needed':'')+'</small></button>').join('')+'</div>'+
 '<div class="pmcq-controls"><button data-pathmcq-page="-1" '+(!browsePage?'disabled':'')+'>← Previous 25</button><span class="pmcq-note">Page '+(browsePage+1)+' of '+pageCount+'</span><button data-pathmcq-page="1" '+(browsePage+1>=pageCount?'disabled':'')+'>Next 25 →</button></div>');
}
function start(size='10',singleID){
 const all=collect(lecture),wrong=getMissed();
 let eligible=all;
 if(missedOnly)eligible=all.filter(q=>wrong[q.stableID]);
 if(singleID)eligible=all.filter(q=>q.stableID===singleID);
 quiz=eligible.slice();
 if(!singleID)quiz=quiz.map(q=>({q,k:Math.random()})).sort((a,b)=>a.k-b.k).map(x=>x.q);
 if(size!=='all'&&!singleID)quiz=quiz.slice(0,Math.max(1,Number(size)||10));
 index=0;answers={};mode='quiz';renderQuestion();
}
function renderQuestion(){
 if(index>=quiz.length){return endQuiz()}
 const q=quiz[index],selected=answers[q.stableID],done=selected!==undefined,correct=q.correctIndex;
 const answerDetail=String(q.explanation||q.why||q.rationale||'').trim();
 shell('🩺 Pathology · Clinical MCQ Practice',
 '<div class="pmcq-controls"><button data-pathmcq-return="1">← MCQ Bank</button><span class="pmcq-current">L'+esc(lecture)+' · '+(index+1)+' of '+quiz.length+'</span></div>'+
 '<div class="pmcq-intro"><small>'+esc(q.sourceSection||'Lecture question')+'</small><h3 style="font-size:17px;line-height:1.45;margin:8px 0">'+esc(q.prompt||q.question)+'</h3>'+
 (q.needsFigure?'<p class="pmcq-note">⚠ The original question references a figure; the supplied import did not include that figure. Check the slide reference before treating this question as image practice.</p>':'')+'</div>'+
 q.options.map((option,i)=>'<button class="pmcq-choice '+(done?(i===correct?'right':i===selected?'wrong':''):'')+'" data-pathmcq-answer="'+i+'" '+(done?'disabled':'')+'><span class="pmcq-letter">'+String.fromCharCode(65+i)+'</span><span>'+esc(option)+'</span></button>').join('')+
 (done?'<div class="pmcq-feedback"><b style="color:'+(selected===correct?'#25764c':'#ab5c20')+'">'+(selected===correct?'✅ Correct':'🟠 Review the answer')+'</b><p><b>Correct answer:</b> '+String.fromCharCode(65+correct)+'. '+esc(q.options[correct])+'</p>'+ (answerDetail?'<p>'+esc(answerDetail)+'</p>':'<p class="pmcq-note">This imported question includes the answer key but no separate rationale. A source-checked explanation is still needed.</p>')+'<small>'+esc(q.source||'Course question bank')+'</small></div>':'<p class="pmcq-note">Select an answer to reveal the key and explanation. Correct choices become green; an incorrect selected choice becomes orange.</p>')+
 '<div class="pmcq-controls">'+(done?'<button data-pathmcq-next="1">'+(index+1<quiz.length?'Next question →':'View results →')+'</button>':'')+'<button data-pathmcq-return="1">← All lecture MCQs</button></div>');
}
function endQuiz(){
 const total=quiz.length,correct=quiz.filter(q=>answers[q.stableID]===q.correctIndex).length,done=quiz.filter(q=>answers[q.stableID]!==undefined).length;
 shell('✅ Pathology Practice Summary','<div class="pmcq-intro"><b>Lecture '+esc(lecture)+' · Practice finished</b><p>Correct: '+correct+' / '+total+' · Answered: '+done+' · '+(total?Math.round(100*correct/total):0)+'%</p><p class="pmcq-note">Questions marked incorrect remain available under Review missed. Original question content was not changed.</p></div><div class="pmcq-controls"><button data-pathmcq-return="1">Return to lecture bank</button><button data-pathmcq-repeat="1">Practice another set</button></div>');
}
function coverage(){
 mode='coverage';
 // Official project grouping: Exam 2 continues through L30; Exam 3 starts at L31.
 const rows=totals(),byExam=[['Exam 1',1,16],['Exam 2',17,30],['Exam 3',31,41],['Exam 4',42,49],['Exam 5',50,58],['Exam 6',59,66],['Exam 7',67,79]];
 const count=(group,field)=>group.reduce((a,x)=>a+(x[field]||0),0);
 shell('📋 Pathology · Course Quality Worklist',
 '<div class="pmcq-intro"><b>All 79 lectures · Live quality inventory</b><p class="pmcq-note">A counted item means an entry was loaded—not that every professor objective was met. Missing question counts here refer ONLY to the shared structured MCQ bank; other course quizzes may exist elsewhere. Every lecture remains marked for original-source review until manually signed off.</p>'+
 '<p style="font-size:12px;margin:7px 0 0"><b>Work order:</b> 1. Missing Learn First → 2. Preliminary sections → 3. Empty MCQ/recall banks → 4. Atlas/case connections → 5. Source and image audit.</p></div>'+
 byExam.map(([title,a,b])=>{
  const group=rows.filter(r=>Number(r.n)>=a&&Number(r.n)<=b);
  const missing=group.filter(r=>!r.hasLesson&&!r.hasFoundation).length;
  const preliminary=count(group,'preliminary');
  const emptyMCQ=group.filter(r=>!r.mcq).length;
  const emptyAtlas=group.filter(r=>!r.atlas).length;
  return '<details '+(title==='Exam 6'?'open':'')+' class="pmcq-entry" style="margin:8px 0"><summary><b>'+title+' · L'+a+'–'+b+'</b><small>'+group.length+' lectures · '+missing+' without indexed lessons · '+preliminary+' preliminary topics · '+emptyMCQ+' with no shared MCQs · '+emptyAtlas+' without linked specimen cards</small></summary>'+
  '<div style="display:grid;gap:8px;margin-top:10px">'+group.map(r=>{
   const lessonCount=r.sections||r.foundations;
   return '<div class="pmcq-entry" style="padding:10px;border-left:3px solid '+(r.preliminary||!lessonCount?'#d59b62':'#89a9b2')+'">'+
    '<b>L'+esc(r.n)+' · '+esc(r.title)+'</b><small>'+lessonCount+' learning sections'+(r.hasFoundation&&!r.hasLesson?' (Foundations)':'')+' · '+r.mcq+' structured MCQs · '+r.flash+' recall cards · '+r.atlas+' specimen cards · '+r.cases+' patient cases</small>'+
    (r.flags.length?'<small style="margin-top:6px;color:#8b5a3f"><b>Review:</b> '+r.flags.map(esc).join(' · ')+'</small>':'<small style="margin-top:6px">Counts present. Still requires professor-objective verification.</small>')+
    '<div class="pmcq-controls" style="margin-bottom:0"><button data-pathmcq-learn="'+esc(r.n)+'">📚 Learn First</button><button data-pathmcq-focus="'+esc(r.n)+'">📝 MCQs ('+r.mcq+')</button><button data-pathmcq-atlas="'+esc(r.n)+'">🔬 Atlas</button><button data-pathmcq-cases="'+esc(r.n)+'">🐾 Cases</button></div></div>';
  }).join('')+'</div></details>';
 }).join('')+
 '<p class="pmcq-note">Automatic indicators are a worklist, not an accuracy certification. Questions, images, species distinctions, references, reportability, and lecture objectives still require source-by-source checking before approval.</p>');
}
function open(api,n){host=api||host;missedOnly=false;browsePage=0;menu(n||lecture)}
function init(api){
 host=api||host;
 if(!host?.body||host.body.__pathMCQBound)return;
 host.body.__pathMCQBound=true;
 host.body.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(!Object.keys(d).some(k=>k.startsWith('pathmcq')))return;
  e.preventDefault();e.stopImmediatePropagation();
  if(d.pathmcqHome!==undefined||d.pathmcqReturn!==undefined){return menu()}
  if(d.pathmcqCoverage!==undefined){return coverage()}
  if(d.pathmcqHandbook!==undefined){return window.VPQ_NECROPSY_HANDBOOK?.open?.()}
  if(d.pathmcqLearn!==undefined){
   const n=String(d.pathmcqLearn);
   const lesson=lessons()[n];
   if(lesson?.sections?.length)return window.VPQ_NECROPSY_HANDBOOK?.openLecture?.(n);
   if(Number(n)<=30)return window.VPQ_PATH_FOUNDATIONS?.open?.();
   return window.VPQ_NECROPSY_HANDBOOK?.lecture?.(n);
  }
  if(d.pathmcqAtlas!==undefined)return window.VPQ_PATH_EXAM7?.studyLecture?.(String(d.pathmcqAtlas));
  if(d.pathmcqCases!==undefined)return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.start?.(host,String(d.pathmcqCases));
  if(d.pathmcqFocus!==undefined){missedOnly=false;browsePage=0;return menu(d.pathmcqFocus)}
  if(d.pathmcqStart!==undefined){return start(d.pathmcqStart)}
  if(d.pathmcqOpenone!==undefined){return start('all',d.pathmcqOpenone)}
  if(d.pathmcqMissed!==undefined){missedOnly=!missedOnly;browsePage=0;return menu()}
  if(d.pathmcqPage!==undefined){browsePage+=Number(d.pathmcqPage);return menu()}
  if(d.pathmcqAnswer!==undefined&&mode==='quiz'){
   const q=quiz[index];if(q&&answers[q.stableID]===undefined){
    const picked=Number(d.pathmcqAnswer);if(picked<0||picked>=q.options.length)return;
    answers[q.stableID]=picked;putMissed(q.stableID,picked!==q.correctIndex);renderQuestion();
   }return;
  }
  if(d.pathmcqNext!==undefined&&mode==='quiz'){index++;return renderQuestion()}
  if(d.pathmcqRepeat!==undefined){return start('10')}
 },true);
 host.body.addEventListener('change',e=>{
  const select=e.target.closest('[data-pathmcq-select]');if(!select)return;
  e.stopImmediatePropagation();missedOnly=false;browsePage=0;menu(select.value);
 },true);
}
return Object.freeze({init,open,coverage:(api)=>{host=api||host;coverage()},collect,totals});
})();