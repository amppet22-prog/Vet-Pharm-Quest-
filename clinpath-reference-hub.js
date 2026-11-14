/* One clear route through the Clinical Pathology learning references.
   A single delegated handler connects existing modules without copying content or state. */
window.VPQ_CLINPATH_REFERENCE_HUB=(function(){
'use strict';
let api=null;
const route={
  hub:()=>open(),
  atlas:()=>window.VPQ_CLINPATH_VISUAL_ATLAS?.menu?.(),
  smear:()=>window.VPQ_BLOOD_SMEAR_LAB?.menu?.(),
  cells:()=>window.VPQ_BLOOD_SMEAR_LAB?.reference?.(),
  advanced:()=>window.VPQ_ADVANCED_LAB?.home?.(),
  rounds:()=>window.VPQ_CLINPATH_DIAGNOSTIC_ROUNDS?.home?.(),
  learn:()=>window.VPQ_CLINPATH_GUIDED?.home?.(),
  cases:()=>api?.openCases?.('Clinical Pathology'),
  editor:()=>window.VPQ_ATLAS_EDITOR?.editor?.('plateletclump','visual'),
  newcell:()=>window.VPQ_CONTENT_STUDIO?.addNew?.()
};
function open(){
 if(!api)return;
 const tile=(key,icon,title,description)=>'<button type="button" data-cph-nav="'+key+'" style="display:block;min-height:105px;text-align:left;border:1px solid #b9cce8;border-radius:14px;background:#f8faff;padding:13px;white-space:normal"><span style="display:block;font-weight:800;font-size:15px">'+icon+' '+title+'</span><span style="display:block;margin-top:6px;font-size:12px;line-height:1.5">'+description+'</span></button>';
 api.showModal('🧭 Clinical Pathology · Reference Map','<p><b>Where should I go?</b> These are different views of the same subject. You do not need to memorize where each resource lives.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">'+
 tile('learn','📚','Learn This First','Lecture-based instruction, objectives, physiology and explanations for Exams 1–4')+
 tile('atlas','🔬','Microscope Atlas','58 visual findings: RBCs, WBCs, platelets, urine, casts and crystals; identification and lookalikes')+
 tile('cells','🩸','Cell Recognition Reference','Full written descriptions, blood-cell significance and photographed examples where available')+
 tile('smear','📸','Blood Smear Lab','Image-identification quizzes, artifacts and smear-based patient decisions')+
 tile('advanced','🧪','Advanced Diagnostics','Coagulation, blood gas, urine sediment and complex diagnostic questions')+
 tile('rounds','🏥','Full Diagnostic Rounds','Five stages per patient: specimen, instrument, artifact, interpretation and next action')+
 tile('cases','🐾','Patient Cases','Apply multiple tests to patients and explain why values change')+
 '</div><p style="font-size:12px;margin-top:12px"><b>Content editing:</b> <button type="button" data-cph-nav="editor">✏️ Edit Microscope Atlas</button> <button type="button" data-cph-nav="cells">🩸 Edit Cell Recognition</button> <button type="button" data-cph-nav="newcell">➕ Add New Cell</button>. Drafts save privately; owner publishing needs approved GitHub repository write access.</p>');
}
function init(context){if(api)return;api=context;context.body.addEventListener('click',event=>{
 const control=event.target.closest('[data-cph-nav]');
 if(!control)return;
 const go=route[control.dataset.cphNav];if(go){event.preventDefault();go()}
});}
return Object.freeze({init,open});
})();
