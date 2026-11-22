/* Vet Pharm Quest — Phase C2 reference lab bench guides.
 * Short, practical teaching before practice questions.
 * Reuses the game modal and existing activity navigation.
 */
window.VPQ_CLINPATH_BENCH_GUIDES=(function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const benches={
 coag:{
  name:'Coagulation Bench',icon:'🩸',sample:'Citrated plasma in a correctly filled light-blue-top tube',
  method:'PT screens the extrinsic/common pathways; aPTT screens the intrinsic/common pathways. Verify collection technique and species-/method-specific reference intervals.',
  why:'The coagulation cascade generates fibrin to stabilize the initial platelet plug. A prolonged result may reflect deficient factors, consumption, inhibition, anticoagulants, or a sample artifact.',
  trap:'An underfilled citrate tube has excess citrate relative to blood and may falsely prolong clotting times. PT/aPTT alone do not exclude platelet dysfunction or von Willebrand disease.',
  practice:'advancedCoag',learn:'vpqClinpathGuided',teach:'coag',learnLabel:'Learn PT / aPTT and clotting FIRST'
 },
 gas:{
  name:'Blood Gas Station',icon:'🫧',sample:'Appropriately handled heparinized whole blood; arterial versus venous sampling matters',
  method:'Read pH FIRST: determine acidemia, alkalemia or pH within range. THEN compare pCO₂ and HCO₃⁻ to explain the net pH, check compensation and evaluate anion gap, chloride and patient context. A normal pH can mask mixed disorders.',
  why:'The respiratory system adjusts CO₂ quickly; the kidneys change bicarbonate and acid excretion more slowly. Compensation may move pH toward normal but does not erase the original disorder.',
  trap:'Air exposure: pCO₂ tends to fall and pH rise; pO₂ moves toward room-air tension and may rise OR fall. Delay: cells continue metabolism so pO₂ tends to fall, pCO₂ rise and pH fall. Excess liquid heparin may dilute analytes. Venous pO₂ does not test arterial oxygenation.',
  practice:'advancedGas',learn:'vpqClinpathGuided',teach:'acid',learnLabel:'Learn pH → CO₂ → HCO₃⁻ FIRST'
 },
 urine:{
  name:'Urinalysis Bench',icon:'🧪',sample:'Fresh, labeled urine; note collection method and timing',
  method:'Start with physical examination, specific gravity (refractometer), dipstick chemistry, and centrifuged urine sediment. Examine cells, casts, crystals and microorganisms alongside the history.',
  why:'Urine concentration reflects renal water handling, tubular function and antidiuretic hormone responses. Sediment can indicate urinary inflammation, bleeding or tubular injury.',
  trap:'Dipsticks have species-specific limitations; for example, leukocyte esterase and nitrite pads are unreliable infection screens in dogs and cats. Refractometry measures USG; a UA analyzer does not replace sediment microscopy.',
  practice:'advancedUrine',learn:'vpqClinpathAtlas',teach:'urine',learnLabel:'Learn USG / UA interpretation FIRST'
 },
 cases:{
  name:'Referral Cases',icon:'📋',sample:'Patient history, physical examination, CBC/chemistry/UA and other indicated diagnostics',
  method:'Start with basic in-house PCV (packed cell volume = RBC fraction) and TS (refractometer total solids, mostly protein) alongside CBC and chemistry when indicated. PCV ↑ + TS ↑ supports hemoconcentration; both ↓ raises concern for blood/protein loss or dilution. Then integrate trends, smear findings and species-specific differences.',
  why:'Multiple laboratory changes often connect through the same physiological compensation or disease mechanism. Prioritize what changes patient care rather than isolated abnormal numbers.',
  trap:'PCV ↓ with normal TS is nonspecific. Acute hemorrhage may initially have near-normal PCV/TS. Refractometer TS is not interchangeable with analyzer total protein; check plasma appearance, assay artifacts, sample quality and hydration.',
  practice:'advancedCases',learn:'vpqClinpathGuided',teach:'start',learnLabel:'Learn full report interpretation FIRST'
 },
 microscopy:{
  name:'Microscopy Lab',icon:'🔬',sample:'Well-prepared and appropriately stained blood smear or fresh urine sediment',
  method:'Check the low-power scan first for distribution and artifacts, then assess RBC/WBC morphology, platelets and selected cell or sediment structures at appropriate magnification.',
  why:'Cell shapes and inclusions reflect membranes, production, maturation, inflammation or handling. The smear area and sample age influence what is visible.',
  trap:'Echinocytes are often storage or smear artifacts, unlike irregular acanthocytes. Confirm apparent thrombocytopenia by checking for platelet clumps.',
  practice:'vpqClassicSmear',learn:'vpqClinpathCellReference',teach:'microscopy',learnLabel:'Learn blood cell morphology FIRST'
 }
};
function openTeaching(key){
 if(key==='coag')return window.VPQ_DIAGNOSTIC_MASTER?.open?.('coag');
 if(key==='acid')return window.VPQ_CLINPATH_REPORT_ACADEMY?.open?.('acid');
 if(key==='urine')return window.VPQ_DIAGNOSTIC_MASTER?.open?.('urine');
 if(key==='start')return window.VPQ_CLINPATH_REPORT_ACADEMY?.open?.('start');
 if(key==='microscopy')return window.VPQ_CLINPATH_REPORT_ACADEMY?.open?.('leuko');
 return false;
}
function html(key){
 const item=benches[key];if(!item)return '';
 return '<div class="infobox" style="margin:4px 0"><h3>'+item.icon+' '+esc(item.name)+'</h3>'+
 '<p><b>Specimen / preparation:</b> '+esc(item.sample)+'</p>'+
 '<p><b>What you do here:</b> '+esc(item.method)+'</p>'+
 '<p><b>WHY it matters:</b> '+esc(item.why)+'</p>'+
 '<p><b>Don’t confuse / sample caution:</b> '+esc(item.trap)+'</p></div>'+
 '<div class="buttonrow"><button type="button" data-vpqbench-go="'+esc(item.practice)+'">🎯 Start practice questions</button>'+
 '<button type="button" data-vpqbench-teach="'+esc(item.teach)+'">📚 '+esc(item.learnLabel)+'</button>'+
 '<button type="button" data-vpqbench-guide-back="1">← Back to lab</button></div>';
}
function open(key,api){const item=benches[key];if(!item||typeof api?.showModal!=='function')return false;
 api.showModal(item.icon+' '+item.name+' · How this station works',html(key));return true}
function init(api){
 if(!api?.body||typeof api.showModal!=='function'||typeof api.doAction!=='function')return;
 api.body.addEventListener('click',event=>{
  const b=event.target.closest('[data-vpqbench-go],[data-vpqbench-guide-back],[data-vpqbench-teach]');if(!b)return;
  if(b.hasAttribute('data-vpqbench-guide-back')){api.closeModal?.();return}
  if(b.hasAttribute('data-vpqbench-teach'))return openTeaching(b.dataset.vpqbenchTeach);
  const action=b.dataset.vpqbenchGo;
  if(!Object.values(benches).some(item=>item.practice===action||item.learn===action))return;
  api.doAction(action);
 });
}
return Object.freeze({benches,html,open,init});
})();
