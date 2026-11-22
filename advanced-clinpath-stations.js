/* Vet Pharm Quest — advanced laboratory diagnostics.
 * Deliberately specialized: hemostasis, blood gases, urine sediment, referral cases.
 * Educational examples; units/reference intervals and analyzer validation are method-dependent.
 */
window.VPQ_ADVANCED_LAB=(function(){
'use strict';
let api=null,run=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const Q=(id,q,a,why)=>({id,q,choices:a,answer:0,why});
const banks={
coag:[
 Q('pt-path','A prolonged PT with a normal aPTT most directly suggests evaluation of which pathway?',['Extrinsic/common pathway (especially factor VII)','Intrinsic pathway only','Platelet number alone','Urine concentrating ability'],'PT assesses the extrinsic and common pathways; factor VII has a relatively short half-life. Vitamin K antagonism or liver disease can alter multiple factors, so test patterns require context.'),
 Q('aptt-path','Which factor group is primarily assessed by aPTT?',['Intrinsic and common pathway','Only extrinsic factor VII','Only platelet adhesion','Only erythropoiesis'],'aPTT probes the intrinsic/common coagulation cascade; abnormalities can include factor deficiency, inhibitors and anticoagulant exposure.'),
 Q('primary','A dog has petechiae, mucosal bleeding, and a very low verified platelet count. Which defect best fits?',['Primary hemostasis','An isolated increase in RBC mass','A pure respiratory alkalosis','An imaging positioning error'],'Platelets form the primary plug. Platelet number/function problems often cause mucosal bleeding and petechiae, while secondary coagulation defects more often cause deep bleeding.'),
 Q('citrate','A citrate sample is substantially underfilled. How may this affect PT/aPTT?',['Excess citrate relative to blood can artifactually prolong clotting times','It definitively shortens both times','It is harmless for all coagulation assays','It measures thrombin in the patient directly'],'Incorrect blood-to-citrate ratio changes recalcification and may yield spurious prolongation. High hematocrit may require citrate adjustment under laboratory protocols.'),
 Q('dic','A septic dog has thrombocytopenia, prolonged PT/aPTT, increased D-dimers and organ dysfunction. Which syndrome is a major concern?',['Disseminated intravascular coagulation (DIC)','Simple physiological rouleaux','Isolated iron deficiency','A normal coagulation profile'],'Systemic activation of coagulation can consume platelets/factors, generate fibrin breakdown products, and cause microvascular dysfunction. Interpret trends and assay reference limits.'),
 Q('vwd','A bleeding dog has a normal platelet count and normal screening coagulation times. Which important differential is not excluded?',['von Willebrand disease or platelet dysfunction','All disorders of primary hemostasis','Acute anemia of any cause','High serum glucose'],'A normal PT and aPTT do not assess platelet adhesion or every platelet-function defect; vWF testing and other methods may be indicated.')
],
gas:[
 Q('acid','A venous blood gas has pH 7.24, bicarbonate 13 mmol/L and low pCO2. What is the primary disturbance?',['Metabolic acidosis with respiratory compensation','Primary respiratory acidosis with metabolic compensation','Primary metabolic alkalosis','Normal acid–base status'],'Low pH plus low bicarbonate indicates metabolic acidosis; the lower pCO2 reflects compensatory ventilation. Assess whether compensation is appropriate and whether mixed disorders exist.'),
 Q('resp','A hypoventilating dog has pH 7.23 and pCO2 68 mmHg. Which primary disorder fits?',['Respiratory acidosis','Metabolic alkalosis','Respiratory alkalosis','Pure iron deficiency'],'CO2 is an acid load through carbonic acid chemistry. Reduced alveolar ventilation elevates pCO2 and lowers pH; renal buffering is slower.'),
 Q('alk','A dog with repeated upper GI fluid loss has elevated bicarbonate and pH. What process should be considered?',['Metabolic alkalosis from loss of gastric acid','Respiratory acidosis from increased CO2 alone','An exclusively high-anion-gap acidosis','A platelet count error'],'Loss of hydrogen and chloride can raise bicarbonate and contribute to chloride-responsive alkalosis. Volume and potassium losses may maintain the disturbance.'),
 Q('anion','Which ions are included in the common simplified anion-gap calculation?',['Sodium − (chloride + bicarbonate), using matching units','Potassium × creatinine','Calcium − albumin','Glucose + ketones only'],'Anion gap estimates unmeasured anions. Some labs include potassium; reference intervals and calculation methods vary, and low albumin can conceal increases.'),
 Q('lactate','An elevated lactate following initial fluid therapy must be interpreted how?',['In context of perfusion, clearance, timing and trends','As proof of infection in every patient','As a reliable direct measurement of oxygen saturation','As always harmless after one bolus'],'Hyperlactatemia can reflect impaired perfusion, altered metabolism, adrenergic drive or decreased clearance. Serial trends and the clinical exam matter.'),
 Q('arterial','Which information is most appropriate when investigating impaired pulmonary oxygenation?',['Arterial blood gas oxygen measures with pulse oximetry and respiratory context','Venous pO2 as a substitute for arterial oxygenation','Platelet count alone','Urine specific gravity alone'],'Arterial PaO2 and saturation assessments evaluate oxygenation; venous pO2 is not interchangeable with arterial oxygenation measures.')
],
urine:[
 Q('usg','An azotemic dehydrated dog has a urine specific gravity near 1.010. What deserves priority investigation?',['Inappropriate urine concentration for the patient, including renal dysfunction','Proof of isolated prerenal azotemia','Proof that renal injury is impossible','A definitive diagnosis of diabetes mellitus'],'Dehydration normally stimulates water conservation. Isosthenuric urine in an azotemic dehydrated patient raises concern, but fluids, endocrine and other factors require review.'),
 Q('casts','Many granular casts are found in a freshly collected urine sample. What is the most useful interpretation?',['Possible tubular injury or degeneration in clinical context','Proof of bacterial cystitis alone','A measure of platelet function','Normal RBC shape artifact'],'Casts form in renal tubules. Granular casts may reflect degenerating cells/protein, but quantity, preservation and patient findings are important.'),
 Q('struvite','A urine sample has struvite crystals, but the patient has no urinary signs. What is safest?',['Interpret crystals alongside pH, storage, infection status and clinical findings','Diagnose obstructing uroliths solely from crystals','Assume all crystals formed in vivo','Treat every crystalluric patient with antimicrobials'],'Crystalluria is not equivalent to a stone or infection; storage and pH can change crystal formation.'),
 Q('protein','Which test best quantifies persistent renal protein loss after ruling out inflammation/hemorrhage?',['Urine protein-to-creatinine ratio (UPC)','Platelet distribution width','Serum bilirubin alone','Plain radiography alone'],'A UPC helps quantify proteinuria, but active sediment and lower urinary tract inflammation can confound interpretation.'),
 Q('gluc','A dog has marked hyperglycemia and glucosuria. Why does glucose appear in urine?',['Filtered glucose exceeds tubular reabsorptive capacity','Glucose is never filtered by the kidney','The bladder secretes all glucose','It specifically indicates hepatic failure'],'Glucose is filtered and normally reclaimed in proximal tubules; exceeding the renal threshold or tubular dysfunction can cause glucosuria.'),
 Q('blood','A urine dipstick is positive for heme, but no RBCs are seen microscopically. Which consideration is appropriate?',['Hemoglobinuria, myoglobinuria, or lysed erythrocytes','The dipstick is necessarily wrong','Confirmed bacterial infection','Coagulation factor deficiency only'],'Dipstick heme detection reacts to free heme pigments as well as intact RBCs. Integrate collection method, sediment and systemic findings.')
]
};
const cases=[
{id:'clp-advanced-dic',track:'Clinical Pathology',lecture:'Advanced · Hemostasis',advanced:true,emoji:'🐕',species:'Dog',name:'Nova — sepsis and coagulopathy',location:'clinpath',intro:'A hospitalized dog with suspected severe infection develops bruising and venipuncture-site oozing. Platelets have declined; PT and aPTT are prolonged. Values must be interpreted against local method ranges.',steps:[
{q:'Which process best explains simultaneous platelet consumption, prolonged clotting times and bleeding?',options:['Systemic activation/consumption of coagulation, concerning for DIC','Isolated stress leukogram','Pure nutritional iron deficiency','Normal platelet adhesion'],answer:0,why:'DIC can simultaneously cause microvascular thrombosis and consumption of platelets/coagulation factors.',tag:'Hemostasis · DIC'},
{q:'Which test set provides the most useful further context?',options:['Repeat platelet count/smear, PT/aPTT, fibrinogen and fibrin breakdown marker with trends','Single ALP reading only','A urine dipstick alone','Only one manual hematocrit'],answer:0,why:'No single assay establishes DIC across all species; trend hematologic/hemostatic parameters with organ dysfunction and clinical status.',tag:'Hemostasis · trend'},
{q:'What is the core clinical priority?',options:['Treat the underlying cause and reassess perfusion, organ status and bleeding risk','Base therapy only on one prolonged aPTT','Ignore organ dysfunction','Assume that anticoagulation always solves every case'],answer:0,why:'Managing the cause and tailoring supportive care to a dynamic, sometimes thrombotic and hemorrhagic syndrome are essential.',tag:'Clinical action'}]},
{id:'clp-advanced-gas',track:'Clinical Pathology',lecture:'Advanced · Blood Gas',advanced:true,emoji:'🐈',species:'Cat',name:'Cleo — diabetic ketoacidosis workup',location:'clinpath',intro:'A lethargic cat has hyperglycemia, ketonemia, pH 7.18, decreased bicarbonate and a decreased pCO2. These illustrative gas values require laboratory-specific interpretation.',steps:[
{q:'Which primary acid–base process is most likely?',options:['Metabolic acidosis with respiratory compensation','Primary metabolic alkalosis','Isolated respiratory acidosis','No acid–base disorder'],answer:0,why:'Ketoacids consume buffer, decreasing bicarbonate and pH; ventilation lowers pCO2 to compensate.',tag:'Blood gas · primary disorder'},
{q:'Why evaluate anion gap and electrolytes?',options:['To assess unmeasured anions and guide interpretation of total-body electrolyte deficits','Because serum potassium reliably equals total-body stores','Because chloride cannot change with therapy','To measure platelet adhesion'],answer:0,why:'Ketones increase unmeasured anions; osmotic diuresis causes fluid and electrolyte losses despite apparently normal/high serum potassium.',tag:'Blood gas · WHY'},
{q:'Which follow-up is most meaningful?',options:['Serial clinical assessment, blood glucose/ketones, gas and electrolyte trends','Only one radiograph','Only a leukogram','No monitoring after initial evaluation'],answer:0,why:'Treatment changes glucose, potassium, acid–base state and hydration over time; trends matter.',tag:'Clinical monitoring'}]},
{id:'clp-advanced-urine',track:'Clinical Pathology',lecture:'Advanced · Urinalysis',advanced:true,emoji:'🐕',species:'Dog',name:'Basil — azotemia with urinary casts',location:'clinpath',intro:'An ill dehydrated dog has azotemia, urine specific gravity 1.011 and numerous granular casts. The sample was processed promptly. Reference intervals vary.',steps:[
{q:'Which combination is most concerning?',options:['Inadequate urine concentration for hydration and granular casts suggesting renal tubular involvement','High platelets and normal urine','An isolated stress leukogram','A normal prerenal response'],answer:0,why:'An inappropriate USG and casts together increase concern for intrinsic renal tubular injury.',tag:'Urinalysis · interpretation'},
{q:'What is the best next diagnostic integration?',options:['Renal values over time, urine culture if indicated, urine protein/sediment, perfusion and appropriate imaging','Only reticulocyte percentage','Only serum albumin once','Only a coagulation PT'],answer:0,why:'No one analyte distinguishes renal injury mechanism; hydration, obstruction, renal structure and urinary inflammation can coexist.',tag:'Renal workup'},
{q:'Why might urine concentrating capacity be reduced?',options:['Tubular and medullary countercurrent dysfunction impair solute gradient and water reclamation','The spleen filters all urine','The kidney normally stops responding to ADH in all dehydration','A platelet clot always blocks the tubule'],answer:0,why:'Tubular function and an intact medullary gradient allow ADH-mediated water conservation; injury can impair that process.',tag:'Physiology · WHY'}]}
];

/* Concept-first introductions for existing hemostasis / blood-gas banks.
 * These are reference views only; the original question objects are not changed.
 */
const INTRO_STYLE=String.raw\`
<style>
.vpqintro{font-size:14px;line-height:1.45;color:#263650;max-width:100%}
.vpqintro *{box-sizing:border-box}
.vpqintro .introhero{border-radius:15px;padding:13px 16px;margin-bottom:11px;background:linear-gradient(105deg,#ecf4ff,#f4eaff);border:1px solid #cbd9f5}
.vpqintro .introhero p{margin:5px 0}
.vpqintro .pathgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:10px 0}
.vpqintro .pathcard{border:1px solid #ccd9ea;background:#f9fbff;border-radius:12px;padding:10px}
.vpqintro .pathcard h4{margin:0 0 7px;font-size:15px}
.vpqintro .arrow{font-weight:900;color:#5272a6;text-align:center;margin:4px}
.vpqintro .node{background:#fff;border:1px solid #bacce4;border-radius:9px;padding:8px;margin:4px 0;text-align:center}
.vpqintro .node b{display:block}
.vpqintro .node em{font-size:12px;font-style:normal;color:#54657f}
.vpqintro .coagCommon{background:#e7f6eb;border-color:#82bba0}
.vpqintro .pathnote{background:#fff7e6;border-left:4px solid #e3aa49;padding:9px 11px;border-radius:7px;margin-top:9px}
.vpqintro .quicktable{width:100%;border-collapse:collapse;font-size:13px;margin:7px 0}
.vpqintro .quicktable td,.vpqintro .quicktable th{padding:8px;border-bottom:1px solid #dbe3ee;text-align:left;vertical-align:top}
.vpqintro .quicktable th{background:#edf3fb}
.vpqintro details{border:1px solid #d1ddec;background:#f9fbff;border-radius:10px;margin:9px 0;padding:9px 11px}
.vpqintro summary{cursor:pointer;font-weight:750}
.vpqintro details p{margin:7px 0}
.vpqintro .steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:12px 0}
.vpqintro .step{background:#eaf3ff;border:1px solid #abcbe6;border-radius:10px;padding:10px;font-size:12px}
.vpqintro .step b{font-size:14px;display:block}
.vpqintro .exgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.vpqintro .ex{border:1px solid #c9dced;border-radius:10px;padding:10px;background:white}
.vpqintro .ex strong{display:block;font-size:14px;margin:0 0 4px}
.vpqintro .switch{margin:8px 0 11px;display:flex;flex-wrap:wrap;gap:6px}
.vpqintro .switch button{font-size:13px;padding:7px 10px;border-radius:20px;border:1px solid #8daed1;background:#fff;color:#25436b}
.vpqintro .switch button[aria-pressed=true]{background:#284e89;color:white}
.vpqintro .introactions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #cfdeea}
.vpqintro .introactions button{border-radius:9px;padding:10px 13px;font-weight:750}
.vpqintro .introactions .start{background:#2b6b59;color:white;border:1px solid #1e5042}
.vpqintro .introactions .return{background:#e8edf6;color:#294365;border:1px solid #bccde2}
@media(max-width:610px){.vpqintro .pathgrid,.vpqintro .exgrid{grid-template-columns:1fr}.vpqintro .steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>\`;
function coagIntro(){
 return '<div class="vpqintro">'+INTRO_STYLE+
 '<div class="introhero"><b>🩸 COAG CASCADE LAB · LEARN FIRST</b><p><strong>Platelets build the temporary plug. Coagulation factors reinforce it with fibrin.</strong> PT and aPTT are timed tests of different paths toward the same fibrin finish line.</p></div>'+
 '<div class="pathgrid">'+
 '<div class="pathcard"><h4>🟠 Extrinsic pathway · PT</h4><div class="node"><b>Vessel injury → tissue factor (III)</b><em>exposed at injured tissue</em></div><div class="arrow">↓</div><div class="node"><b>VII → VIIa</b><em>Factor VII is sensitive to early vitamin K depletion</em></div><div class="arrow">↓</div><div class="node coagCommon"><b>X → Xa</b><em>Join common pathway</em></div></div>'+
 '<div class="pathcard"><h4>🔵 Intrinsic pathway · aPTT</h4><div class="node"><b>XII → XI → IX</b><em>Contact-activation test pathway</em></div><div class="arrow">↓</div><div class="node"><b>IXa + VIIIa</b><em>Intrinsic tenase activates X</em></div><div class="arrow">↓</div><div class="node coagCommon"><b>X → Xa</b><em>Join common pathway</em></div></div>'+
 '</div>'+
 '<div class="pathcard"><h4>🟢 Shared finish line · common pathway (PT and aPTT)</h4><div class="node coagCommon"><b>Xa + Va + calcium + phospholipid</b><em>Prothrombinase complex</em></div><div class="arrow">↓</div><div class="node coagCommon"><b>II (prothrombin) → IIa (thrombin)</b></div><div class="arrow">↓</div><div class="node coagCommon"><b>I (fibrinogen) → fibrin → XIIIa cross-links</b><em>Stable clot!</em></div></div>'+
 '<div class="pathnote"><b>Remember:</b> The classic intrinsic/extrinsic diagram explains laboratory tests, not every step of coagulation inside the body. Tissue-factor initiation and thrombin amplification are central in vivo. Factor XII deficiency can markedly prolong aPTT without causing typical bleeding.</div>'+
 '<h3>🔎 Read the coag panel like a detective</h3>'+
 '<table class="quicktable"><thead><tr><th>Result</th><th>What it screens</th><th>Think about…</th></tr></thead><tbody>'+
 '<tr><td><b>PT ↑</b><br>aPTT normal</td><td>Extrinsic + common</td><td>Factor VII, early vitamin K antagonist effect, assay/sample issues</td></tr>'+
 '<tr><td><b>aPTT ↑</b><br>PT normal</td><td>Intrinsic + common</td><td>VIII, IX, XI, XII deficiencies; inhibitors/heparin; XII is not usually a bleeding cause</td></tr>'+
 '<tr><td><b>PT ↑ and aPTT ↑</b></td><td>Shared factors or multiple affected factors</td><td>II, V, X, fibrinogen; severe liver disease, DIC, vitamin K antagonist exposure</td></tr>'+
 '<tr><td><b>Both normal, bleeding present</b></td><td>Routine factor screens may be normal</td><td>Platelet number/function, vWF, factor XIII and vascular causes</td></tr>'+
 '</tbody></table>'+
 '<details open><summary>🧪 The other tests: what do they mean?</summary>'+
 '<p><b>Platelet count + smear:</b> plug-building cells; confirm clumping before calling thrombocytopenia. <b>vWF antigen/function:</b> platelet adhesion, especially mucosal bleeding. <b>Fibrinogen:</b> clot substrate; low with consumption/severe synthetic problems, sometimes high during inflammation. <b>Thrombin time (TT):</b> fibrinogen → fibrin after adding thrombin; affected by low/abnormal fibrinogen and certain anticoagulants. <b>D-dimer:</b> breakdown of cross-linked fibrin; evidence of clot formation and lysis, not specific for DIC. <b>FDPs:</b> fibrin(ogen) degradation products; less specific than D-dimer for cross-linked fibrin. <b>Antithrombin:</b> natural anticoagulant; may fall with consumption, protein loss or reduced synthesis.</p></details>'+
 '<details><summary>🩹 Bleeding clue game: where is the problem?</summary><p><b>Petechiae, epistaxis, gingival oozing:</b> start with primary hemostasis, platelets and vWF. <b>Hemarthrosis, deep hematomas or delayed rebleeding:</b> consider secondary hemostatic factor deficiencies. <b>Both patterns + systemic illness:</b> mixed processes such as DIC can occur.</p><p><b>Preanalytics:</b> correctly filled light-blue-top citrate tube; underfilling, clots, heparin contamination, high HCT or improper processing can invalidate interpretation.</p></details>'+
 '<div class="introactions"><button type="button" class="start" data-vpqadvanced="begin-coag">🎯 Start my existing coag questions</button><button type="button" class="return" data-vpqadvanced="home">← Back to lab</button></div>'+
 '</div>';
}
function gasIntro(){
 return '<div class="vpqintro">'+INTRO_STYLE+
 '<div class="introhero"><b>🫧 BLOOD GAS DETECTIVE · LEARN FIRST</b><p><strong>pH = where you ended up, CO₂ = the lung control, HCO₃⁻ = the metabolic/kidney side.</strong> Find the primary disturbance, then ask whether the body is compensating appropriately.</p></div>'+
 '<div class="steps"><div class="step"><b>① pH</b>Acidemia ↓ or alkalemia ↑?</div><div class="step"><b>② Primary</b>Which of CO₂ or HCO₃⁻ explains pH?</div><div class="step"><b>③ Compensate</b>Does the other system respond as expected?</div><div class="step"><b>④ Cause</b>AG, chloride, lactate, ketones + patient</div></div>'+
 '<h3>🧭 Which direction do the numbers push pH?</h3><div class="pathgrid">'+
 '<div class="pathcard"><h4>🫁 Lungs · pCO₂</h4><div class="node"><b>Hypoventilate → CO₂ ↑ → pH ↓</b><em>Respiratory acidosis</em></div><div class="node"><b>Hyperventilate → CO₂ ↓ → pH ↑</b><em>Respiratory alkalosis</em></div><p>Breathing can change CO₂ rapidly.</p></div>'+
 '<div class="pathcard"><h4>🫘 Kidneys / metabolism · HCO₃⁻</h4><div class="node"><b>HCO₃⁻ ↓ → pH ↓</b><em>Metabolic acidosis</em></div><div class="node"><b>HCO₃⁻ ↑ → pH ↑</b><em>Metabolic alkalosis</em></div><p>Renal adjustments take longer; acids, GI losses and perfusion matter.</p></div>'+
 '</div>'+
 '<table class="quicktable"><thead><tr><th>Primary condition</th><th>pH tendency</th><th>Driving change</th><th>Typical compensation</th></tr></thead><tbody>'+
 '<tr><td>Metabolic acidosis</td><td>↓</td><td>HCO₃⁻ ↓</td><td>Ventilation ↑ → pCO₂ ↓</td></tr>'+
 '<tr><td>Metabolic alkalosis</td><td>↑</td><td>HCO₃⁻ ↑</td><td>Ventilation ↓ → pCO₂ ↑ (limited)</td></tr>'+
 '<tr><td>Respiratory acidosis</td><td>↓</td><td>pCO₂ ↑</td><td>Kidneys retain HCO₃⁻ over time</td></tr>'+
 '<tr><td>Respiratory alkalosis</td><td>↑</td><td>pCO₂ ↓</td><td>Kidneys excrete HCO₃⁻ over time</td></tr>'+
 '</tbody></table>'+
 '<h3>🩺 Four mini patient patterns</h3><div class="exgrid">'+
 '<div class="ex"><strong>🐕 Diarrhea</strong>Loss of intestinal HCO₃⁻ → metabolic acidosis; often a normal anion gap with relatively increased chloride.</div>'+
 '<div class="ex"><strong>🐈 Ketoacidosis</strong>Ketones add unmeasured acids → HCO₃⁻ drops, anion gap often rises; pCO₂ should fall with compensatory ventilation.</div>'+
 '<div class="ex"><strong>🐕 Vomiting / gastric loss</strong>Loss of H⁺ and Cl⁻ → metabolic alkalosis; hypokalemia/volume depletion may maintain it.</div>'+
 '<div class="ex"><strong>🐾 Hypoventilation</strong>CO₂ retention → respiratory acidosis. Check airway, breathing and neurologic status.</div>'+
 '</div>'+
 '<details open><summary>🔍 Additional blood gas and chemistry numbers</summary><p><b>Base excess:</b> summarizes the metabolic acid–base component (negative suggests base deficit). <b>Total CO₂:</b> chemistry-panel estimate mainly reflecting bicarbonate. <b>Anion gap:</b> Na − (Cl + HCO₃⁻) is a common formula; some laboratories add K. Elevated AG prompts investigation of lactate, ketones, uremic acids and toxicants. Low albumin can hide an increase. <b>Corrected chloride:</b> asks whether Cl changed beyond what the sodium/water change predicts. <b>Lactate:</b> interpret with perfusion, metabolism and trends, not as a diagnosis by itself. <b>PaO₂ / oxygen saturation:</b> oxygenation assessment requires arterial context; venous pO₂ is not interchangeable.</p></details>'+
 '<details><summary>🧮 Compensation: is there a second disorder?</summary><p>A low HCO₃⁻ with an unexpectedly normal or high pCO₂ may indicate a concurrent respiratory acidosis rather than appropriate compensation. Compensation should move pH toward normal, not overshoot to the opposite disorder. Use <b>species-, sample- and laboratory-appropriate expected compensation</b> before diagnosing a mixed disorder. A nearly normal pH can hide two simultaneous processes.</p><p><b>Sampling traps:</b> arterial versus venous, air bubbles, delayed analysis, temperature and excess liquid heparin can all matter.</p></details>'+
 '<div class="introactions"><button type="button" class="start" data-vpqadvanced="begin-gas">🎯 Start my existing blood gas questions</button><button type="button" class="return" data-vpqadvanced="home">← Back to lab</button></div>'+
 '</div>';
}
function intro(mode){
 run=null;
 if(mode==='coag')return modal('Coagulation · Cascade & Clotting Tests',coagIntro());
 if(mode==='gas')return modal('Blood Gas · Acid–Base Map',gasIntro());
}

const buttons=(mode)=>'<button type="button" data-vpqadvanced="'+mode+'">'+({coag:'🩸 Coagulation Analyzer',gas:'🫧 Blood Gas Analyzer',urine:'🧫 Urinalysis Bench',cases:'🐾 Referral Cases · Prototype 001',home:'← Advanced Lab',hub:'← Reference Map'}[mode]||mode)+'</button>';
function modal(title,body){api.showModal('🔬 '+title,body+'<div class="buttonrow">'+buttons(run?'home':'hub')+'</div>')}
function home(){run=null;modal('Advanced Clinical Pathology · Referral Diagnostics','<p><b>Why this is advanced:</b> routine in-house CBC and chemistry stay in the Treatment Ward. Here you investigate abnormal coagulation, acid–base disorders, urine microscopy and difficult multi-system patient cases.</p><div class="buttonrow">'+buttons('coag')+buttons('gas')+buttons('urine')+buttons('cases')+'<button data-vpqadvanced="fullrounds">🏥 Full Diagnostic Rounds · 5-stage patients</button>'+'<button data-vpqadvanced="classic">🩸 CBC & Chemistry Practice</button>'+'</div><p class="tiny">Educational simulation; verify species- and method-specific intervals. Referral Cases opens the single guided Referral Patient 001 prototype. No additional cases have been added.</p>')}
function begin(mode){run={mode,pool:banks[mode].slice().sort(()=>Math.random()-.5),i:0,chosen:null,order:null,correct:0};show()}
function start(mode){if(mode==='coag'||mode==='gas')return intro(mode);return begin(mode)}
function show(){const s=run;if(!s)return;const q=s.pool[s.i];if(!q){modal('Advanced station complete','<h3>'+s.correct+' / '+s.pool.length+' correct</h3><p>Review how each laboratory finding changes the clinical decision. First correct mastery earns existing XP; replay is always available.</p>'+buttons(s.mode));return}if(!s.order)s.order=[0,1,2,3].sort(()=>Math.random()-.5);const done=s.chosen!==null;
modal(({coag:'Coagulation Analyzer',gas:'Blood Gas Analyzer',urine:'Urinalysis Bench'})[s.mode]+' · '+(s.i+1)+'/'+s.pool.length,'<h3>'+esc(q.q)+'</h3>'+s.order.map(i=>'<button class="choice '+(done?(i===q.answer?'right':i===s.chosen?'wrong':''):'')+'" data-vpqadvanced-answer="'+i+'" '+(done?'disabled':'')+'>'+esc(q.choices[i])+'</button>').join('')+(done?'<div class="response '+(s.chosen===q.answer?'':'bad')+'"><b>'+(s.chosen===q.answer?'Correct':'Review the physiology')+'</b><p>'+esc(q.why)+'</p></div><button data-vpqadvanced="next">Next →</button>':'<p class="tiny">Interpret the physiology, patient context and assay limitations before choosing.</p>'))}
function init(context){api=context;context.body.addEventListener('click',event=>{const b=event.target.closest('[data-vpqadvanced],[data-vpqadvanced-answer]');if(!b)return;if(b.hasAttribute('data-vpqadvanced-answer')){if(!run||run.chosen!==null)return;run.chosen=Number(b.dataset.vpqadvancedAnswer);const q=run.pool[run.i];if(run.chosen===q.answer){run.correct++;api.awardQuestion?.('advanced-clinpath-'+run.mode,q.id,true)}return show()}const key=b.dataset.vpqadvanced;if(key==='home')return home();if(key==='hub')return window.VPQ_CLINPATH_REFERENCE_HUB?.open?.();if(key==='cases'){const pilot=window.VPQ_CLINPATH_REFERRAL_PILOT;if(pilot&&typeof pilot.home==='function')return pilot.home();if(typeof window.VPQ_OPEN_REFERRAL_PATIENTS==='function')return window.VPQ_OPEN_REFERRAL_PATIENTS();return api.showModal('🔬 Referral Patients','Referral Patient 001 is unavailable. Reload the game and open Advanced Lab again.');}if(key==='fullrounds')return window.VPQ_CLINPATH_DIAGNOSTIC_ROUNDS?.home?.();if(key==='classic')return window.VPQ_TREATMENT_DIAGNOSTICS?.legacyLabHome?.();if(key==='begin-coag')return begin('coag');if(key==='begin-gas')return begin('gas');if(key==='next'&&run){run.i++;run.chosen=null;run.order=null;return show()}if(banks[key])return start(key)})}
return Object.freeze({init,home,start,intro,banks,cases});
})();
