/* Clinical Pathology · Predict the Trend
 * Original, case-based Up/Down/No consistent change activity.
 * Intended patterns are explicitly conditional on the described patient, stage and sample.
 * No diagnostic cutoffs, dosages or real-patient recommendations.
 */
window.VPQ_TREND_LAB=(function(){
'use strict';
let api,run;
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cases=[
 {id:'early-bleed',group:'Hematology',patient:'Milo · dog',scene:'Milo lost blood from a traumatic laceration earlier today. After fluid redistribution, he is anemic and hypoproteinemic, but the marrow has not yet had time to release many reticulocytes.',tests:[
 ['Hematocrit / PCV','down','Loss of circulating RBCs eventually lowers PCV once fluids equilibrate. Immediately after acute blood loss, PCV may initially appear normal.'],
 ['Total plasma protein','down','Whole blood loss removes plasma proteins as well as erythrocytes.'],
 ['Absolute reticulocyte count','same','A regenerative response takes time; very early after acute blood loss, reticulocytes may still be within reference limits.']]},
 {id:'hemolysis',group:'Hematology',patient:'Luna · dog',scene:'Four days into a hemolytic episode, Luna is visibly icteric and has a documented regenerative response.',tests:[
 ['Hematocrit / PCV','down','RBC destruction outpaces production, causing anemia.'],
 ['Unconjugated bilirubin','up','Heme breakdown creates bilirubin; increased hemolytic load may exceed normal clearance.'],
 ['Absolute reticulocyte count','up','After a few days, renal EPO stimulates erythropoiesis and marrow release of immature RBCs.']]},
 {id:'cortisol-stress',group:'Hematology',patient:'Peanut · dog',scene:'Peanut has an uncomplicated endogenous glucocorticoid stress leukogram; there is no independent inflammatory process.',tests:[
 ['Mature neutrophils','up','Cortisol promotes mature neutrophilia through altered distribution and movement from blood.'],
 ['Lymphocytes','down','Cortisol alters lymphocyte trafficking and survival, often creating lymphopenia.'],
 ['Eosinophils','down','A classic canine stress leukogram can have eosinopenia; not every patient shows every component.']]},
 {id:'cow-sepsis',group:'Hematology',patient:'Hazel · cow',scene:'Hazel has severe acute bacterial inflammation. The marrow is releasing bands rapidly, but tissue demand is outpacing circulating mature neutrophil supply.',tests:[
 ['Circulating segmented neutrophils','down','Severe tissue recruitment may exceed available mature neutrophil reserves, especially in cattle.'],
 ['Circulating band neutrophils','up','Increased marrow release produces a left shift.'],
 ['Neutrophil toxic-change severity','up','Accelerated granulopoiesis during inflammation can alter cytoplasmic maturation and morphology.']]},
 {id:'dehydration',group:'Chemistry & UA',patient:'Biscuit · dog',scene:'Biscuit has marked water loss, intact kidney concentrating ability, and no concurrent hemorrhage or protein-losing disorder.',tests:[
 ['PCV / hematocrit','up','Reduced plasma water causes relative hemoconcentration.'],
 ['Total plasma protein','up','Plasma proteins become more concentrated when plasma water falls.'],
 ['Urine specific gravity','up','Normal ADH and renal concentrating responses conserve water in a dehydrated patient.']]},
 {id:'renal-azotemia',group:'Chemistry & UA',patient:'Waffles · cat',scene:'Waffles has substantial intrinsic renal dysfunction, reduced GFR, and poor urinary concentrating ability. No unusual low muscle mass or confounding sample artifact.',tests:[
 ['Serum creatinine','up','Reduced glomerular filtration retains creatinine, provided production is not markedly altered.'],
 ['Blood urea nitrogen','up','Reduced renal clearance commonly increases urea nitrogen, although many nonrenal influences exist.'],
 ['Urine concentrating ability','down','Tubular and medullary dysfunction can prevent appropriate concentration despite dehydration.']]},
 {id:'addison',group:'Endocrine',patient:'Poppy · dog',scene:'Poppy has primary hypoadrenocorticism with significant mineralocorticoid deficiency, not the atypical glucocorticoid-only presentation.',tests:[
 ['Serum sodium','down','Aldosterone deficiency reduces renal sodium conservation; volume depletion and ADH also contribute.'],
 ['Serum potassium','up','Deficient aldosterone reduces distal nephron potassium excretion.'],
 ['Na:K ratio','down','Lower Na and higher K drive down the ratio, but this finding is not diagnostic on its own.']]},
 {id:'dka',group:'Endocrine',patient:'Scout · cat',scene:'Scout has untreated diabetic ketoacidosis with insulin deficiency and a high anion-gap metabolic acidosis.',tests:[
 ['Blood glucose','up','Insulin deficiency and counterregulatory hormones promote hyperglycemia.'],
 ['Blood ketones','up','Enhanced lipolysis and hepatic ketogenesis generate ketone bodies.'],
 ['Serum bicarbonate','down','Accumulating ketoacids consume bicarbonate as it buffers hydrogen ions.']]},
 {id:'gastric-loss',group:'Acid–base',patient:'Otto · dog',scene:'Otto has protracted loss of gastric HCl from vomiting, with chloride-responsive metabolic alkalosis and hypokalemia.',tests:[
 ['Serum chloride','down','Gastric chloride loss and volume contraction sustain hypochloremia.'],
 ['Serum bicarbonate','up','Net hydrogen ion loss and renal responses support metabolic alkalosis.'],
 ['Serum potassium','down','Volume depletion, aldosterone and renal potassium losses commonly cause hypokalemia in this described case.']]},
 {id:'diarrhea',group:'Acid–base',patient:'Maple · foal',scene:'Maple has severe bicarbonate-rich intestinal fluid loss with a confirmed normal-anion-gap metabolic acidosis; chloride rises relative to bicarbonate.',tests:[
 ['Serum bicarbonate','down','GI bicarbonate loss lowers buffering capacity and produces metabolic acidosis.'],
 ['Chloride relative to sodium','up','A normal-anion-gap acidosis is often relatively hyperchloremic to maintain electroneutrality.'],
 ['Blood pH','down','When respiratory compensation is insufficient to normalize pH, metabolic acidemia results.']]},
 {id:'anticoagulant',group:'Coagulation',patient:'Toby · dog',scene:'Toby has clinically important vitamin K antagonist exposure, with depleted vitamin K-dependent clotting factors. Platelets are otherwise normal.',tests:[
 ['Prothrombin time (PT)','up','Factor VII has a short half-life, so PT can prolong early in deficiency.'],
 ['Activated partial thromboplastin time (aPTT)','up','With sufficiently depleted intrinsic/common-pathway factors, aPTT also prolongs.'],
 ['Platelet count','same','Vitamin K antagonism primarily impairs secondary hemostasis, not platelet number.']]},
 {id:'citrate-error',group:'Artifacts',patient:'Saffron · dog',scene:'Saffron is clinically well. Her citrate coagulation tube was substantially underfilled, resulting in excess citrate relative to plasma. A correctly collected sample is normal.',tests:[
 ['Reported PT','up','Excess citrate can bind added assay calcium and falsely prolong clotting time.'],
 ['Reported aPTT','up','The same incorrect citrate-to-blood ratio can artifactually prolong aPTT.'],
 ['True in-vivo clotting-factor activity','same','This is a preanalytic sampling error, not proof of a real coagulation-factor deficiency.']]},
 {id:'edta-error',group:'Artifacts',patient:'Clover · horse',scene:'A chemistry sample was contaminated with potassium-EDTA from the wrong collection tube. The horse does not have an underlying electrolyte disease.',tests:[
 ['Measured potassium','up','Potassium from the anticoagulant contaminates the specimen.'],
 ['Measured total calcium','down','EDTA binds calcium and can yield spuriously low measured total calcium.'],
 ['True in-vivo potassium','same','A contaminated specimen changes the measured sample, not the patient electrolyte balance.']]},
 {id:'protein-loss',group:'Chemistry & UA',patient:'Tess · dog',scene:'Tess has severe glomerular protein loss (protein-losing nephropathy), clinically important hypoalbuminemia and secondary hypercholesterolemia.',tests:[
 ['Serum albumin','down','Glomerular barrier damage allows excessive albumin escape into urine.'],
 ['Urine protein:creatinine ratio','up','The ratio quantifies excess urine protein relative to creatinine and supports persistent renal protein loss.'],
 ['Serum cholesterol','up','Severe glomerular protein loss can be accompanied by increased hepatic lipoprotein production and hypercholesterolemia.']]},
 {id:'pyuria',group:'Urinalysis',patient:'Nova · cat',scene:'Nova has culture-supported bacterial cystitis with active urine sediment; the freshly collected sample is examined promptly and is not contaminated.',tests:[
 ['Urinary white cells','up','Inflammatory cells enter urine with lower urinary tract inflammation.'],
 ['Urinary bacteria','up','Bacteriuria is expected in this culture-confirmed infection.'],
 ['Urine sediment inflammatory activity','up','Pyuria and bacteriuria create an active inflammatory sediment; crystals or casts are not required.']]}
];
const groupNames=['All','Hematology','Chemistry & UA','Endocrine','Acid–base','Coagulation','Artifacts','Urinalysis'];
const labels={up:'↑ Increase',down:'↓ Decrease',same:'↔ No consistent change'};
function menu(){
 run=null;
 api.showModal('📈 Predict the Lab Trends',
 '<p>Choose a patient presentation, predict what rises, falls or remains unchanged, then reveal the <b>physiology behind the change</b>. Cases specify timing and clinical context because trends can be different otherwise.</p>'+
 '<div class="buttonrow">'+groupNames.map(g=>'<button data-trend-group="'+e(g)+'">'+e(g)+' ('+(g==='All'?cases.length:cases.filter(c=>c.group===g).length)+')</button>').join('')+'</div>'+
 '<p><b>'+cases.length+' patient scenarios · '+cases.length*3+' interactive predictions.</b> Answer one analyte at a time. The results never replace reference intervals or specimen validation.</p>'+
 '<p class="tiny">Original learning content compiled from existing in-repository veterinary Clinical Pathology material; not yet reconciled against every uploaded lecture page.</p>');
}
function start(group){
 const pool=cases.filter(c=>group==='All'||c.group===group);
 if(!pool.length)return menu();
 // Fisher–Yates: no duplicate cases within a run.
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
 run={group,pool,ci:0,ti:0,choice:null,correct:0,answered:0,history:[]};draw();
}
function draw(){
 if(!run)return;
 const c=run.pool[run.ci];
 if(!c){return api.showModal('✅ Trend rounds completed','<h3>'+run.correct+' / '+run.answered+' predictions correct</h3><p>Next step: for each incorrect trend, ask whether it reflects loss, increased production, decreased clearance, redistribution or a sample artifact.</p><div class="buttonrow"><button data-trend-action="menu">Return to topics</button><button data-trend-group="'+e(run.group)+'">Practice again</button></div>')}
 const t=c.tests[run.ti],last=run.choice!==null;
 const history=run.history.filter(h=>h.caseId===c.id).map(h=>'<div style="padding:4px 0;border-bottom:1px solid #e0e8f1"><b>'+e(h.analyte)+'</b> · '+e(labels[h.direction])+' '+(h.correct?'✓':'✗')+'</div>').join('');
 let response='';
 if(last)response='<div class="infobox"><b>'+(run.choice===t[1]?'✓ Correct':'↳ Expected: '+labels[t[1]])+'</b><p>'+e(t[2])+'</p></div><button data-trend-action="next">'+(run.ti===2?'Next patient →':'Next analyte →')+'</button>';
 api.showModal('📈 '+e(c.group)+' · Patient '+(run.ci+1)+'/'+run.pool.length,
 '<div class="infobox"><b>🐾 '+e(c.patient)+'</b><p>'+e(c.scene)+'</p></div>'+
 '<p class="small">Lab marker '+(run.ti+1)+' of '+c.tests.length+'</p><h3>Predict: '+e(t[0])+'</h3>'+
 '<div class="buttonrow">'+['up','down','same'].map(v=>'<button data-trend-choice="'+v+'" '+(last?'disabled':'')+' style="min-width:125px">'+labels[v]+'</button>').join('')+'</div>'+
 response+(history?'<div style="margin-top:12px"><b>Earlier results from this patient</b>'+history+'</div>':'')+
 '<p class="tiny">Relative to the expected species/assay reference interval or normal function under the stated conditions. “No consistent change” means no change is predicted from this mechanism alone.</p>'+
 '<div class="buttonrow"><button data-trend-action="menu">↩ Choose another topic</button></div>');
}
function init(context){
 api=context;
 context.body.addEventListener('click',ev=>{
  const a=ev.target.closest('[data-trend-action],[data-trend-group],[data-trend-choice]');if(!a)return;
  if(a.hasAttribute('data-trend-group'))return start(a.dataset.trendGroup);
  if(a.hasAttribute('data-trend-choice')){
   if(!run||run.choice!==null)return;
   run.choice=a.dataset.trendChoice;const c=run.pool[run.ci],t=c.tests[run.ti],correct=run.choice===t[1];
   run.answered++;if(correct){run.correct++;api.awardQuestion?.('clinpath-trends',c.id+'-'+run.ti,true)}
   run.history.push({caseId:c.id,analyte:t[0],direction:t[1],correct});
   return draw();
  }
  if(a.dataset.trendAction==='menu')return menu();
  if(a.dataset.trendAction==='next'&&run&&run.choice!==null){run.choice=null;if(++run.ti>=run.pool[run.ci].tests.length){run.ti=0;run.ci++}return draw()}
 });
}
return Object.freeze({init,menu,start,cases});
})();
