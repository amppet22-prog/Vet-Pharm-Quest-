/* VPQ C3.6 — sequential clinical pathology diagnostic rounds.
 * All patient values are educational simulations, separate from lecture case source values.
 * Reuses shared modal, reward callback, and existing state/persist hooks.
 */
window.VPQ_CLINPATH_DIAGNOSTIC_ROUNDS=(function(){
'use strict';
const patients=[{"id":"sim-lab-anemia","title":"Mera · unexplained canine anemia","exam":1,"patient":"Simulated adult dog: lethargy, pale mucosa, PCV 23%, total protein 6.5 g/dL. CBC shows anemia; the regenerative response has not yet been established.","steps":[{"phase":"Collect specimen","q":"Which collection best establishes the erythron response?","choices":["Fresh EDTA whole blood plus promptly prepared blood smear","Citrate plasma only","Urine dipstick alone"],"a":0,"why":"EDTA whole blood supports CBC and absolute reticulocyte testing; prompt smear preparation preserves morphology. PCV/total protein can support the evaluation, but do not establish RBC regenerative response.","hint":"Choose a sample that preserves cells for counting and microscopic morphology."},{"phase":"Choose instrument","q":"Which laboratory workflow best answers whether marrow is responding?","choices":["Total T4 alone","CBC with absolute reticulocytes plus smear review","PT/aPTT alone"],"a":1,"why":"Absolute reticulocyte counts and polychromasia indicate a marrow response to reduced oxygen delivery. Kidney EPO signaling takes time to produce measurable new circulating cells.","hint":"How can you count young circulating RBCs, not just mature RBCs?"},{"phase":"Check artifact","q":"The analyzer flags RBC agglutination and the calculated MCHC is unexpectedly high. What should you do?","choices":["Assume the high MCHC confirms iron deficiency","Ignore the sample flag","Review the smear, plasma and analyzer interference before interpreting indices"],"a":2,"why":"Agglutination can disrupt RBC counting and calculated indices. Hemolysis and lipemia can also affect hemoglobin-based measurements. Validate the sample before making a clinical diagnosis.","hint":"Could this value be mathematical or analytical rather than a true cellular change?"},{"phase":"Interpret findings","q":"Repeat testing shows 175,000 reticulocytes/µL and polychromasia. What does this support?","choices":["A regenerative response, interpreted with species and timing","A definitive diagnosis of immune-mediated hemolysis","Complete exclusion of ongoing hemorrhage"],"a":0,"why":"The erythron is responding to reduced oxygen-carrying capacity, likely via renal EPO signaling. Reticulocytosis does not distinguish hemorrhage from hemolysis by itself.","hint":"The kidney responds to oxygen delivery, not to a diagnosis."},{"phase":"Patient next step","q":"Which additional evidence best separates hemorrhage from hemolysis?","choices":["MCV in isolation","Bleeding history, bilirubin/plasma appearance, proteins, smear and targeted testing","Only repeated platelet percentage"],"a":1,"why":"Both can cause regenerative anemia. Integrate evidence of blood loss, jaundice, hemoglobinemia, spherocytes/agglutination and serial clinical trends before selecting a treatment strategy.","hint":"Compare RBC loss from the body with RBC destruction inside the body."}]},{"id":"sim-lab-urine","title":"Jinx · red urine after muscle injury","exam":3,"patient":"Simulated adult dog after prolonged exertion: red-brown urine, increased CK and possible dehydration. Initial urine dipstick is strongly positive for heme.","steps":[{"phase":"Collect specimen","q":"Which sample approach makes the urine finding most interpretable?","choices":["Unlabeled urine stored at room temperature overnight","Fresh urine with recorded collection method and prompt sediment examination","Only a dry swab of the urine container"],"a":1,"why":"Urine cells can lyse or change during storage, especially with dilute or alkaline urine. Time, collection method, dipstick and fresh sediment must be considered together.","hint":"Think about how quickly cells and crystals can change after collection."},{"phase":"Choose instrument","q":"What is the best first laboratory pairing for a heme-positive sample?","choices":["Dipstick with centrifuged sediment microscopy","Serum total T4 alone","PT alone"],"a":0,"why":"A heme pad reacts to RBCs, hemoglobin and myoglobin. Fresh sediment helps identify intact urinary RBCs; if few are seen, pigment or lysis needs investigation.","hint":"The pad cannot tell you which molecule caused the reaction."},{"phase":"Check artifact","q":"There are few RBCs in the sediment, but the urine stood in a dilute alkaline state. Which caution matters?","choices":["Absent intact cells always rules out bleeding","The dipstick is pigment-specific","Urinary RBC lysis may cause heme positivity with few remaining intact cells"],"a":2,"why":"RBCs can lyse in dilute or alkaline urine; a heme-positive pad with few cells cannot by itself distinguish hemoglobinuria, myoglobinuria and lysed hematuria.","hint":"Think about where the original RBCs went before you saw the sample."},{"phase":"Interpret findings","q":"Fresh repeat urine is heme positive with few RBCs, CK is markedly increased and plasma is not visibly hemolyzed. Which mechanism deserves consideration?","choices":["Myoglobin release from injured skeletal muscle","Urinary bacteria automatically explain the heme signal","Definite urinary tract bleeding from microscopy alone"],"a":0,"why":"Myoglobinuria is consistent with muscle injury and high CK. Assess for intravascular hemolysis and specimen artifacts as competing explanations. Do not use CK or the heme pad alone as proof.","hint":"Which tissue releases the heme protein that accompanies a large CK rise?"},{"phase":"Patient next step","q":"What is the most relevant follow-up for a patient at risk of pigment-associated renal injury?","choices":["Only recheck eosinophil percentage","Monitor hydration, urine output, renal markers, electrolytes and CK trends","No further monitoring if urine looks lighter"],"a":1,"why":"Myoglobin, dehydration and hypoperfusion may contribute to acute kidney injury. Monitor renal function and urine output while addressing the primary cause.","hint":"Think about perfusion and the organ that clears circulating pigment."}]},{"id":"sim-lab-coag","title":"Oliver · bruising and abnormal coagulation","exam":2,"patient":"Simulated adult dog with ecchymoses and prolonged PT on an initial sample. The light-blue-top citrate tube was only half filled.","steps":[{"phase":"Collect specimen","q":"Which collection is appropriate for PT/aPTT evaluation?","choices":["EDTA whole blood as a substitute for coagulation citrate","Urine in an unclean cup","Properly filled sodium-citrate tube using the laboratory's required blood-to-anticoagulant ratio"],"a":2,"why":"Coagulation testing depends on the correct citrate-to-blood ratio, commonly 1 part anticoagulant to 9 parts whole blood. Underfilling leaves relative excess citrate.","hint":"The anticoagulant concentration affects the assay."},{"phase":"Choose instrument","q":"Which tests best screen the relevant secondary hemostasis pathways?","choices":["PT and aPTT, interpreted alongside platelets and clinical phenotype","Urine specific gravity only","Serum glucose alone"],"a":0,"why":"PT screens extrinsic/common pathway factors; aPTT screens intrinsic/common. Mucocutaneous bleeding often suggests platelet defects, whereas deeper hematomas may suggest coagulation factor deficiencies.","hint":"Separate the platelet plug from fibrin stabilization."},{"phase":"Check artifact","q":"How should the underfilled citrate tube change interpretation of prolonged clotting times?","choices":["The result proves factor deficiency","Relative citrate excess can falsely prolong times; recollect correctly","Underfilling always shortens the PT"],"a":1,"why":"Excess citrate binds added assay calcium and may prolong clotting times. A correctly filled fresh specimen is needed before concluding a true factor abnormality.","hint":"How does the test restore coagulation in citrated plasma?"},{"phase":"Interpret findings","q":"The repeat properly filled sample shows prolonged PT with normal aPTT. What pathway is most implicated?","choices":["Primary platelet adhesion alone","Intrinsic pathway only","Extrinsic or common pathway factors, including factor VII"],"a":2,"why":"Isolated PT prolongation suggests extrinsic (notably factor VII) or early vitamin K-dependent factor changes; factor and method-specific testing and clinical context determine cause.","hint":"Which screening test detects factor VII-related defects?"},{"phase":"Patient next step","q":"Which follow-up is most appropriate before naming a cause?","choices":["Review exposure/drug history, hepatic function and targeted factor or anticoagulant testing as indicated","Diagnose anticoagulant rodenticide exposure from PT alone","Ignore bleeding pattern and repeat no tests"],"a":0,"why":"Vitamin K antagonism, hepatic dysfunction, inherited factor defects and other causes may affect PT. Consider patient stability, treatment urgency and diagnostic confirmation.","hint":"Several diseases can change the same pathway; gather discriminating evidence."}]}];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let api=null,active=null;
function saved(){
 const root=api?.state;
 if(!root)return {byPatient:{}};
 if(!root.clinpathDiagnosticRounds||typeof root.clinpathDiagnosticRounds!=='object')root.clinpathDiagnosticRounds={byPatient:{}};
 root.clinpathDiagnosticRounds.byPatient ||= {};
 return root.clinpathDiagnosticRounds;
}
function record(id){
 const store=saved().byPatient;
 if(!store[id])store[id]={answers:{},complete:false,cursor:0};
 store[id].answers ||= {};
 if(!Number.isInteger(store[id].cursor))store[id].cursor=Math.min(4,Object.keys(store[id].answers).length);
 return store[id];
}
function persist(){api?.persist?.()}
function home(){
 if(!api)return;
 active=null;
 const items=patients.map(c=>{
 const r=saved().byPatient[c.id],count=r?Object.keys(r.answers||{}).length:0;
 return '<div style="border:1px solid #d5e3f0;padding:12px;border-radius:12px;margin:9px 0"><b>🐾 '+esc(c.title)+'</b><p class="vpq-case-meta">Exam '+c.exam+' · '+count+'/5 checkpoints · '+(r?.complete?'✓ Completed':'Practice in progress')+'</p><button data-cdr-open="'+esc(c.id)+'">'+(r?.complete?'Review':'Begin')+' diagnostic round →</button></div>';
 }).join('');
 api.showModal('🏥 Clinical Pathology · Full Diagnostic Rounds','<p class="vpq-case-presentation">Work a patient through specimen collection → test selection → sample quality → interpretation → next clinical action. These patients are <strong>simulations</strong>; figures are not taken from your instructor case slides.</p>'+items+'<div class="buttonrow"><button data-cdr-advanced="1">🧪 Advanced Lab</button><button data-cdr-ward="1">🩺 Treatment Ward</button><button data-cdr-reference="1">📚 Reference Map</button></div>');
}
function open(id){if(!patients.some(p=>p.id===id))return home();active=id;render()}
function render(){
 const p=patients.find(x=>x.id===active);if(!p)return home();
 const r=record(p.id),stepIndex=Math.max(0,Math.min(4,r.cursor)),step=p.steps[stepIndex],chosen=r.answers[stepIndex],answered=chosen!==undefined,finished=Boolean(r.complete);
 const progress='<p class="vpq-case-meta">Diagnostic round · '+(stepIndex+1)+' / 5'+(finished?' · Completed':'')+'</p><div style="height:7px;border-radius:8px;background:#dfe8f2;margin-bottom:12px"><div style="height:7px;border-radius:8px;background:#75aeb2;width:'+Math.round(Object.keys(r.answers).length/5*100)+'%"></div></div>';
 const buttons=step.choices.map((x,i)=>'<button class="choice '+(answered?(i===step.a?'right':i===chosen?'wrong':''):'')+'" data-cdr-answer="'+i+'" '+(answered?'disabled':'')+'>'+String.fromCharCode(65+i)+'. '+esc(x)+'</button>').join('');
 const body='<section class="vpq-patient-case">'+progress+'<div class="vpq-case-presentation"><b>Patient findings:</b> '+esc(p.patient)+'</div>'
 +'<div class="vpq-case-question"><span class="vpq-case-question-label">'+esc(step.phase.toUpperCase())+' · QUESTION '+(stepIndex+1)+'</span><h3>'+esc(step.q)+'</h3></div>'
 +'<details style="padding:9px 12px;margin:8px 0 12px;background:#f4faff;border:1px solid #b9d7df;border-radius:9px"><summary style="font-weight:800">❔ How should I think through this?</summary><p>'+esc(step.hint)+'</p></details>'
 +'<div class="vpq-case-choices">'+buttons+'</div>'
 +(answered?'<div class="response '+(chosen===step.a?'':'bad')+'"><b>'+(chosen===step.a?'✅ Appropriate decision':'💡 Review the reasoning')+'</b><p>'+esc(step.why)+'</p></div>':'<p class="vpq-case-reassurance">Choose the best step. Your answer and rationale will be saved.</p>')
 +(finished?'<p><b>✅ Diagnostic round complete.</b> You can revisit your steps or begin another patient.</p>':'')
 +'<div class="buttonrow">'+(answered&&!finished&&stepIndex<4?'<button data-cdr-next="1">Next checkpoint →</button>':'')+'<button data-cdr-list="1">All diagnostic rounds</button>'+(finished?'<button data-cdr-replay="1">↻ Replay for review</button>':'')+'</div>'
 +'<details class="vpq-source-note"><summary>📚 Sources &amp; review</summary><div class="vpq-source-body">Original teaching simulation. Clinical interpretation depends on species, test method, specimen handling and patient status.</div></details>'
 +'</section>';
 api.showModal('🏥 '+esc(p.title),body);
}
function answer(n){
 const p=patients.find(x=>x.id===active);if(!p)return;
 const r=record(p.id),idx=r.cursor;
 if(idx<0||idx>=p.steps.length||r.answers[idx]!==undefined||!Number.isInteger(n)||n<0||n>=p.steps[idx].choices.length)return;
 r.answers[idx]=n;
 if(n===p.steps[idx].a)api.awardQuestion?.('clinpath-diagnostic-rounds',p.id+':'+idx,true);
 if(idx===p.steps.length-1)r.complete=true;
 persist();render();
}
function next(){
 const p=patients.find(x=>x.id===active);if(!p)return;
 const r=record(p.id);if(r.answers[r.cursor]===undefined)return;
 if(r.cursor<p.steps.length-1)r.cursor++;
 persist();render();
}
function replay(){const p=patients.find(x=>x.id===active);if(!p)return;record(p.id).answers={};record(p.id).complete=false;record(p.id).cursor=0;persist();render()}
function init(context){
 if(api)return;api=context;
 context.body.addEventListener('click',event=>{
 const b=event.target.closest('[data-cdr-open],[data-cdr-answer],[data-cdr-next],[data-cdr-list],[data-cdr-replay],[data-cdr-advanced],[data-cdr-ward],[data-cdr-reference]');
 if(!b)return;const d=b.dataset;
 if(d.cdrOpen!==undefined)return open(d.cdrOpen);
 if(d.cdrAnswer!==undefined)return answer(Number(d.cdrAnswer));
 if(d.cdrNext!==undefined)return next();
 if(d.cdrList!==undefined)return home();
 if(d.cdrReplay!==undefined)return replay();
 if(d.cdrAdvanced!==undefined)return window.VPQ_ADVANCED_LAB?.home?.();
 if(d.cdrWard!==undefined)return window.VPQ_CLINPATH_WARD_ROUNDS?.home?.()||window.VPQ_TREATMENT_DIAGNOSTICS?.home?.();
 if(d.cdrReference!==undefined)return window.VPQ_CLINPATH_REFERENCE_HUB?.open?.();
 });
}
return Object.freeze({init,home,open,patients});
})();
