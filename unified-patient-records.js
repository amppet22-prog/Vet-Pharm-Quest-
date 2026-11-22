/* Vet Pharm Quest · unified patient chart bridge.
 * A chart is a single navigation point for the same source case across rooms.
 * Never fabricates patient data or merges distinct simulated patients.
 */
window.VPQ_UNIFIED_PATIENT_RECORDS=(function(){
'use strict';
let api;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const kinds={pharm:'Pharmacology · Patient file',journey:'Advanced patient journey',hospital:'Level 5 · Hospitalization'};
function store(){if(!api.state.vpqUnifiedPatients||typeof api.state.vpqUnifiedPatients!=='object')api.state.vpqUnifiedPatients={active:null,records:{}};const s=api.state.vpqUnifiedPatients;s.records||={};return s}
function catalog(){
 const pharm=(api.getCases?.()||[]).filter(x=>x.track==='Pharmacology').map(x=>({kind:'pharm',id:String(x.id),name:x.name||x.id,species:x.species||'Not specified',history:x.intro||'',exam:x.findings||x.vitals||x.physicalExam||'',signalment:x.signalment||'',source:x,emoji:x.emoji||'🐾'}));
 const advanced=(window.VPQ_ADVANCED_PATIENT_JOURNEY?.cases||[]).map(x=>({kind:'journey',id:x.id,name:x.title,species:x.species,history:x.chief,exam:x.exam?.findings||'',source:x,emoji:'🩺'}));
 const hospital=(window.VPQ_ADVANCED_HOSPITALIZATION?.cases||[]).map(x=>({kind:'hospital',id:x.id,name:x.title,species:x.species,history:x.summary,exam:'Not documented at intake in this simulation',source:x,emoji:'🏥'}));
 return [...pharm,...advanced,...hospital];
}
const key=(kind,id)=>kind+':'+id;
function get(kind,id){return catalog().find(x=>x.kind===kind&&x.id===String(id))}
function record(kind,id){return store().records[key(kind,id)]||{}}
function sync(kind,id,stage,completed){
 if(!get(kind,id))return false;
 const s=store(),k=key(kind,id),old=s.records[k]||{};
 s.active={kind,id:String(id)};
 s.records[k]={...old,stage:stage||old.stage||'Chart opened',completed:!!(completed||old.completed)};
 api.persist?.();return true;
}
function status(patient){
 const r=record(patient.kind,patient.id);
 const done=patient.kind==='pharm'?(api.state.completed||[]).includes(patient.id):patient.kind==='journey'?!!api.state.advancedPatientJourney?.finished?.[patient.id]:!!api.state.advancedHospitalization?.completed?.[patient.id];
 return {done:!!done,stage:r.stage||(done?'Case complete':'Awaiting assessment')};
}
function button(kind,id,label,action){return '<button type="button" data-vpq-unified="'+esc(action)+'" data-vpq-kind="'+esc(kind)+'" data-vpq-id="'+esc(id)+'">'+label+'</button>'}
function panel(title,value){return '<section class="vpq-unified-panel"><b>'+esc(title)+'</b><p>'+esc(value||'Not documented in this learning case')+'</p></section>'}
function modal(title,html){api.showModal(title,'<div class="vpq-unified">'+html+'</div>')}
function home(room='reception'){
 const items=catalog(),active=store().active,chosen=active&&get(active.kind,active.id),sections=[['pharm','📋 Original pharmacology patient files'],['journey','🐾 Advanced Patient Journeys'],['hospital','⭐ Level 5 Hospitalization']];
 modal('🐾 Hospital Patient Records','<div class="vpq-unified-hero"><b>One patient record · three connected rooms</b><p>Open the same chart from Reception, Examination or Treatment. Case-specific progress is tracked here; clinical teaching data stays with its original case.</p></div>'+
 (chosen?'<div class="vpq-unified-active"><b>📌 Active patient: '+esc(chosen.name)+'</b><p>'+esc(kinds[chosen.kind])+' · '+esc(status(chosen).stage)+'</p>'+button(chosen.kind,chosen.id,'Open active chart','chart')+'</div>':'')+
 sections.map(([kind,label])=>{const group=items.filter(x=>x.kind===kind);return '<details class="vpq-unified-group" '+(kind!=='pharm'?'open':'')+'><summary>'+label+' <small>('+group.length+')</small></summary><div class="vpq-unified-grid">'+group.map(x=>{const st=status(x);return '<button class="vpq-unified-case" data-vpq-unified="chart" data-vpq-kind="'+esc(kind)+'" data-vpq-id="'+esc(x.id)+'"><b>'+esc(x.emoji)+' '+esc(x.name)+'</b><small>'+esc(x.species)+' · '+(st.done?'✓ Completed':esc(st.stage))+'</small></button>'}).join('')+'</div></details>'}).join('')+
 '<p class="vpq-unified-note">Advanced and original pharmacology cases remain separate teaching patients. No clinical values are copied between them.</p>')
}
function chart(kind,id){
 const c=get(kind,id);if(!c)return home();
 sync(kind,id,'Chart reviewed');
 const st=status(c),row=record(kind,id);
 modal((c.emoji||'🐾')+' Medical Chart · '+c.name,
 '<div class="vpq-unified-hero"><b>'+esc(c.name)+'</b><p>'+esc(c.species)+' · '+esc(kinds[kind])+'</p><div class="vpq-unified-status">'+(st.done?'✓ Completed':'● In progress')+' · '+esc(row.stage||'Chart reviewed')+'</div></div>'+
 '<div class="vpq-unified-two">'+panel('Presenting concern / history',c.history)+panel('Signalment',c.signalment)+'</div>'+panel('Examination & supplied findings',c.exam)+
 (kind==='pharm'?'<p class="vpq-unified-note">This is an original pharmacology case. The course case provides only the information shown; the Treatment Ward’s general lab games are not this patient’s actual results.</p>':'')+
 (kind==='hospital'?'<p class="vpq-unified-note">Laboratory timepoints and branching outcomes are available inside this specific simulated hospitalization case.</p>':'')+
 '<div class="vpq-unified-actions">'+button(kind,id,kind==='pharm'?'🩺 Begin / replay patient decisions':kind==='journey'?'🐾 Begin / replay complete patient journey':'⭐ Begin / replay hospitalization','start')+
 button(kind,id,'🏥 View chart in Treatment Ward','treatment')+
 button(kind,id,'🩺 View chart in Exam Room','exam')+
 '<button data-vpq-unified="back">← All patient records</button></div>'+
 '<p class="vpq-unified-note">Replaying a completed case does not erase the completion record. Shared hospital navigation does not add undocumented test results.</p>')
}
function begin(kind,id){
 if(!get(kind,id))return home();
 sync(kind,id,kind==='pharm'?'Exam decisions':'Clinical journey begun');
 if(kind==='pharm'){api.changeRoom?.('exam');return api.startCase?.(id)}
 if(kind==='journey')return window.VPQ_ADVANCED_PATIENT_JOURNEY?.start?.(id);
 if(kind==='hospital')return window.VPQ_ADVANCED_HOSPITALIZATION?.start?.(id);
}
function go(kind,id,room){if(!get(kind,id))return home();sync(kind,id,'Chart reviewed');api.changeRoom?.(room);chart(kind,id)}
function init(context){
 api=context;
 if(!api.body||api.body.dataset?.vpqUnifiedBound)return;
 if(api.body.dataset)api.body.dataset.vpqUnifiedBound='1';
 api.body.addEventListener('click',e=>{const t=e.target?.closest?.('[data-vpq-unified]');if(!t||!api.body.contains(t))return;e.preventDefault();const op=t.dataset.vpqUnified,kind=t.dataset.vpqKind,id=t.dataset.vpqId;
 if(op==='back')return home();if(op==='chart')return chart(kind,id);if(op==='start')return begin(kind,id);if(op==='treatment'||op==='exam')return go(kind,id,op);
 },true);
}
return {init,home,chart,sync,begin,get,catalog,status,active:()=>store().active};
})();