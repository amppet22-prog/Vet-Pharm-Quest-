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
const INTRO_STYLE=String.raw`
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
.vpqintro .factor-scroll{max-height:390px;overflow:auto;border:1px solid #bfcee0;border-radius:11px;margin:9px 0}
.vpqintro .factor-scroll .quicktable{margin:0;min-width:700px}
.vpqintro .factor-scroll th{position:sticky;top:0;z-index:1}
.vpqintro .coagkrow{background:#fff6d8}
.vpqintro .coagkmark{display:inline-block;background:#9b6504;color:#fff;font-weight:900;padding:1px 5px;font-size:11px;border-radius:4px}
.vpqintro .coaglivinggrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.vpqintro .coaglivinggrid>div{padding:11px;border-radius:11px;border:1px solid #afc7df;background:#eaf4fc}
.vpqintro .coaglivinggrid>div:nth-child(2){background:#fff1db;border-color:#e6be7b}
.vpqintro .coaglivinggrid>div:nth-child(3){background:#edebff;border-color:#bfb1e8}
.vpqintro .coaglivinggrid>div:nth-child(4){background:#e8f7ed;border-color:#a5cdb1}
.vpqintro .coaglivinggrid p{margin:5px 0 0}
.vpqintro .factoratlas,.vpqintro .coagliving{margin:14px 0}
@media(max-width:610px){.vpqintro .coaglivinggrid{grid-template-columns:1fr}}
.vpqintro .coagtestlist{display:flex;flex-direction:column;gap:0;margin-top:9px;border:1px solid #d6e2ee;border-radius:10px;overflow:hidden;background:white}
.vpqintro .coagtestrow{display:block;padding:10px 12px;line-height:1.48}
.vpqintro .coagtestrow+.coagtestrow{border-top:1px solid #d6e2ee}
.vpqintro .coagtestrow:nth-child(even){background:#f3f8ff}
.vpqintro .coagimagecard{border-radius:14px;background:#f5f8ff;border:2px solid #a8c5ed;padding:13px;margin:13px 0}
.vpqintro .coagimagecard h3{margin:0 0 5px}.vpqintro .coagimagecard p{margin:4px 0 10px}
.vpqintro .coagimagebutton{display:block;width:100%;padding:7px;border:1px solid #abc4e5;border-radius:10px;background:white;cursor:zoom-in;text-align:center;color:#234b81;font-weight:800}
.vpqintro .coagimagebutton img{display:block;width:100%;max-height:310px;object-fit:contain}
.vpqintro .coagimagebutton span{display:block;padding-top:6px}
.vpqintro .coagimageactions{display:flex;flex-wrap:wrap;gap:9px;margin-top:10px}
.vpqintro .coagimageactions button,.vpqintro .coagimageactions a{display:inline-flex;align-items:center;border:1px solid #abc2e0;border-radius:9px;background:white;padding:10px 13px;text-decoration:none;color:#244c83;font-size:14px;font-weight:800;cursor:pointer}
.vpqintro .coagimageactions .coagdownload{background:#e1f7e8;border-color:#8bbd9b;color:#18583c}
.vpqintro .coagfull{max-width:100%;overflow:auto}
.vpqintro .coagfullimage{display:block;width:100%;min-width:550px;height:auto;margin:8px 0;border:1px solid #b8cde6;border-radius:10px;background:#fff}

.vpqintro .coagprettydetails{background:#fff;border:1px solid #cfdaeb;padding:13px;margin:12px 0;border-radius:14px}
.vpqintro .coagprettydetails>summary{font-size:15px;color:#294777;padding:3px 1px 9px}
.vpqintro .coaglessonlead{display:flex;gap:12px;align-items:center;padding:13px;background:linear-gradient(115deg,#eef9e9,#f7fbf2);border:1px solid #bed8ae;border-radius:12px;margin:7px 0 12px}
.vpqintro .coaglessonlead.coagpurple{background:linear-gradient(115deg,#f2efff,#f9f5ff);border-color:#c8b8e6}
.vpqintro .coaglessonicon{display:grid;place-items:center;flex:0 0 49px;width:49px;height:49px;border-radius:13px;background:#d8eabb;color:#385923;font-weight:900;font-size:23px}
.vpqintro .coagpurple .coaglessonicon{background:#d9ceff;color:#483784;font-size:18px}
.vpqintro .coaglessonlead strong{display:block;font-size:16px;margin-bottom:4px}
.vpqintro .coaglessonlead p,.vpqintro .hemocard p{margin:3px 0;line-height:1.5}
.vpqintro .coagformula{display:flex;gap:5px;align-items:center;justify-content:center;flex-wrap:wrap;margin:10px 0;padding:10px;border:1px dashed #bdd0e2;border-radius:10px;background:#f9fcff}
.vpqintro .coagformula span{padding:7px 9px;background:#edf4ff;border-radius:8px;font-size:12px;font-weight:750}
.vpqintro .coagformula b{color:#6387a5}
.vpqintro .coagminigrid,.vpqintro .hemogrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.vpqintro .coagminiamber,.vpqintro .coagminired{padding:12px;border-radius:11px;border:1px solid #e3c783;background:#fff7e4}
.vpqintro .coagminired{border-color:#ebb9b0;background:#fff2ef}
.vpqintro .coagminigrid p{margin:5px 0 0}
.vpqintro .coagfootnote{font-size:12px;color:#50657a;margin:12px 0 2px}
.vpqintro .coagmechanismhead{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:14px 0 7px;padding-bottom:6px;border-bottom:2px solid #c8d9e9}
.vpqintro .coagmechanismhead span{font-size:12px;color:#62778f}
.vpqintro .coagmini{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.vpqintro .coagminicard{background:#edf5ff;border:1px solid #c1d6ed;padding:10px;border-radius:10px}
.vpqintro .coagminicard strong{display:block;margin-bottom:4px;color:#254f78}
.vpqintro .coagminicard span{display:block;font-size:13px;line-height:1.45}
.vpqintro .coagbrakes .coagminicard{background:#f3effd;border-color:#d1c6ec}
.vpqintro .coagbrakes .coagminicard strong{color:#60468a}
.vpqintro .coagclean{display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:#eaf8ee;border:1px solid #b7dabc;border-radius:10px;padding:12px}
.vpqintro .coagclean span{color:#42694d}
.vpqintro .hemocard{padding:12px;border:1px solid #c5b5e9;border-top:4px solid #7560cb;border-radius:12px;background:#f8f6ff}
.vpqintro .hemocard.hemob{background:#eff7ff;border-color:#a8cce7;border-top-color:#3280b8}
.vpqintro .hemocard.hemoc{background:#f0fbf3;border-color:#b9dcc4;border-top-color:#48a366;grid-column:1/-1}
.vpqintro .hemotop{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-bottom:8px}
.vpqintro .hemotop b{font-size:16px}
.vpqintro .hemotop span{background:#fff;border:1px solid #bcc9e6;border-radius:20px;padding:5px 9px;font-weight:800;font-size:12px;white-space:nowrap}
.vpqintro .hemolab{border-top:1px solid #cbd6e6;padding-top:8px;margin-top:10px;font-size:13px;font-weight:650}
.vpqintro .coagclinical,.vpqintro .coagdontconfuse{padding:12px 13px;border-radius:11px;background:#fff7e7;border-left:4px solid #e3ab48;margin-top:11px}
.vpqintro .coagdontconfuse{background:#eef5ff;border-left-color:#7199db}
.vpqintro .coagclinical p,.vpqintro .coagdontconfuse p{margin:6px 0 0}
.vpqintro .coagfootersteps{display:flex;flex-wrap:wrap;gap:7px;padding:12px;border:1px solid #d2e0eb;border-radius:10px;margin-top:11px}
.vpqintro .coagfootersteps b{width:100%}
.vpqintro .coagfootersteps span{font-size:12px;padding:6px 9px;border-radius:20px;background:#e8f0fa}
@media(max-width:580px){.vpqintro .hemogrid,.vpqintro .coagminigrid,.vpqintro .coagmini{grid-template-columns:1fr}.vpqintro .hemocard.hemoc{grid-column:auto}.vpqintro .coaglessonlead{align-items:flex-start}}
/* Color-coded coagulation story: vibrant chapter accents, contrast-safe light surfaces */
.vpqintro.coag-theme .introhero{background:linear-gradient(115deg,#d8eaff 0%,#e7ddff 47%,#ffe6e9 100%);border:2px solid #83b0e4;box-shadow:0 3px 12px rgba(70,91,144,.12)}
.vpqintro.coag-theme .introhero>b{color:#233b8a;letter-spacing:.035em}
.vpqintro.coag-theme .pathgrid>.pathcard:first-child{background:linear-gradient(160deg,#ffe3ee,#fff5f8);border:2px solid #e88cab}
.vpqintro.coag-theme .pathgrid>.pathcard:nth-child(2){background:linear-gradient(160deg,#d9edff,#f1f8ff);border:2px solid #7fb7e6}
.vpqintro.coag-theme .pathgrid>.pathcard:first-child h4{color:#993755}
.vpqintro.coag-theme .pathgrid>.pathcard:nth-child(2) h4{color:#175b98}
.vpqintro.coag-theme .pathgrid+.pathcard{background:linear-gradient(115deg,#e1f7e5,#f4fff4);border:2px solid #86c79c}
.vpqintro.coag-theme .pathgrid+.pathcard h4{color:#206e45}
.vpqintro.coag-theme .pathgrid .node{border-width:2px}
.vpqintro.coag-theme .pathgrid>.pathcard:first-child .node:not(.coagCommon){background:#fff1f6;border-color:#e8a3ba}
.vpqintro.coag-theme .pathgrid>.pathcard:nth-child(2) .node:not(.coagCommon){background:#eef8ff;border-color:#99c1e5}
.vpqintro.coag-theme .coaglivinggrid>div{border-width:2px;box-shadow:0 2px 7px rgba(41,74,112,.07)}
.vpqintro.coag-theme .coaglivinggrid>div:nth-child(1){background:#dcecff;border-color:#75a9e0}
.vpqintro.coag-theme .coaglivinggrid>div:nth-child(2){background:#fff0c9;border-color:#e8b951}
.vpqintro.coag-theme .coaglivinggrid>div:nth-child(3){background:#e7dfff;border-color:#aa8ce3}
.vpqintro.coag-theme .coaglivinggrid>div:nth-child(4){background:#d9f5e5;border-color:#74c195}
.vpqintro.coag-theme .coaglivinggrid>div b{color:#243d76}
.vpqintro.coag-theme .factoratlas{padding:13px;border:2px solid #b4b1ed;border-radius:14px;background:linear-gradient(140deg,#f0ecff,#fff 60%)}
.vpqintro.coag-theme .factoratlas>h3{color:#503c92}
.vpqintro.coag-theme .factor-scroll{border:2px solid #afa9d6;background:white}
.vpqintro.coag-theme .factor-scroll th{background:#453e87!important;color:white}
.vpqintro.coag-theme .factor-scroll tr.factor-extrinsic{background:#dff0ff}
.vpqintro.coag-theme .factor-scroll tr.factor-intrinsic{background:#fbe5f1}
.vpqintro.coag-theme .factor-scroll tr.factor-common{background:#e0f5e5}
.vpqintro.coag-theme .factor-scroll tr.factor-cofactor{background:#f2edff}
.vpqintro.coag-theme .factor-scroll tr.coagkrow td:first-child{background:#fff0ad;box-shadow:inset 4px 0 #d39b13}
.vpqintro.coag-theme .factor-scroll td{border-bottom:1px solid #bfcce0}
.vpqintro.coag-theme .coagprettydetails{border:2px solid #acc2e2;box-shadow:0 2px 9px rgba(43,69,101,.06)}
.vpqintro.coag-theme .coagprettydetails:has(.coagformula){border-color:#7cb88b;background:linear-gradient(180deg,#e9f9e8,#fff 95px)}
.vpqintro.coag-theme .coagprettydetails:has(.coagmechanismhead){border-color:#87b4eb;background:linear-gradient(180deg,#e6f1ff,#fff 95px)}
.vpqintro.coag-theme .coagprettydetails:has(.hemogrid){border-color:#b2a0eb;background:linear-gradient(180deg,#eee6ff,#fff 95px)}
.vpqintro.coag-theme .coagformula{background:#effbe9;border:1px solid #9fcd99}
.vpqintro.coag-theme .coagformula span:nth-of-type(1){background:#d6efc5;color:#305a28}
.vpqintro.coag-theme .coagformula span:nth-of-type(2){background:#ffe4a8;color:#754b12}
.vpqintro.coag-theme .coagformula span:nth-of-type(3){background:#d7ebff;color:#204f80}
.vpqintro.coag-theme .coagformula span:nth-of-type(4){background:#e8dfff;color:#503b88}
.vpqintro.coag-theme .coagminicard{background:#dcedff;border:2px solid #9bc5eb}
.vpqintro.coag-theme .coagbrakes .coagminicard{background:#ede3ff;border-color:#c1a4e7}
.vpqintro.coag-theme .coagclean{background:#d9f4e4;border:2px solid #83c4a1}
.vpqintro.coag-theme .hemocard{border-width:2px;border-top-width:6px;background:#ede7ff}
.vpqintro.coag-theme .hemocard.hemob{background:#e0f1ff}
.vpqintro.coag-theme .hemocard.hemoc{background:#e1f7e7}
.vpqintro.coag-theme .hemotop span{background:#fff5d9;border-color:#e4c36e}
.vpqintro.coag-theme .hemolab{border-top:2px solid #c3cfdf;color:#233c6c}
.vpqintro.coag-theme .coagclinical{background:#fff0c9;border-left:5px solid #d69925}
.vpqintro.coag-theme .coagdontconfuse{background:#e3edff;border-left:5px solid #617ecf}
.vpqintro.coag-theme .coagtestrow:nth-child(odd){background:#eff6ff}
.vpqintro.coag-theme .coagtestrow:nth-child(even){background:#f2edff}
.vpqintro.coag-theme .coagtestrow b{color:#354e90}

/* Blood gas follows the vibrant coagulation learning language */
.vpqintro.gas-theme .introhero{background:linear-gradient(110deg,#d7edff,#e4deff 58%,#d6f9e9);border:2px solid #83b6e2}
.vpqintro.gas-theme .introhero b{color:#26538a}
.vpqintro.gas-theme .steps .step{border-width:2px;min-height:94px;font-size:13px}
.vpqintro.gas-theme .steps .step:nth-child(1){background:#dfedff;border-color:#88b7e7}
.vpqintro.gas-theme .steps .step:nth-child(2){background:#def8ec;border-color:#87c9a8}
.vpqintro.gas-theme .steps .step:nth-child(3){background:#eee3ff;border-color:#baa0e8}
.vpqintro.gas-theme .steps .step:nth-child(4){background:#fff0d2;border-color:#e4ba78}
.vpqintro.gas-theme .pathgrid>.pathcard:first-child{background:#e5efff;border:2px solid #86b1e8}
.vpqintro.gas-theme .pathgrid>.pathcard:nth-child(2){background:#e4f8eb;border:2px solid #84c8a1}
.vpqintro.gas-theme .pathcard h4{color:#325a95}
.vpqintro.gas-theme .pathgrid>.pathcard:nth-child(2) h4{color:#27784b}
.vpqintro.gas-theme .pathgrid .node{border-width:2px;background:#fff}
.vpqintro.gas-theme .exgrid .ex{border-width:2px;border-radius:12px;padding:13px}
.vpqintro.gas-theme .exgrid .ex:nth-child(1){background:#e5f1ff;border-color:#9bc3e9}
.vpqintro.gas-theme .exgrid .ex:nth-child(2){background:#f1e7ff;border-color:#bba6de}
.vpqintro.gas-theme .exgrid .ex:nth-child(3){background:#fff0d9;border-color:#e3bb81}
.vpqintro.gas-theme .exgrid .ex:nth-child(4){background:#e4f8eb;border-color:#9ccfab}
.vpqintro.gas-theme .exgrid .ex strong{margin-bottom:5px;color:#314576}
.vpqintro.gas-theme .quicktable{border:2px solid #b5cceb;border-radius:12px;overflow:hidden}
.vpqintro.gas-theme .quicktable th{background:#324f88;color:white}
.vpqintro.gas-theme .quicktable tbody tr:nth-child(1){background:#e7f7ed}
.vpqintro.gas-theme .quicktable tbody tr:nth-child(2){background:#fff1da}
.vpqintro.gas-theme .quicktable tbody tr:nth-child(3){background:#e4f0ff}
.vpqintro.gas-theme .quicktable tbody tr:nth-child(4){background:#f1e7ff}
.vpqintro.gas-theme .gasimagecard{background:linear-gradient(145deg,#e8f2ff,#e9fffa);border-color:#89b6df}
.vpqintro.gas-theme .gasconcept{border:2px solid #adc4e5;background:#f8fbff;padding:12px}
.vpqintro .gasconceptgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}
.vpqintro .gasconceptitem{display:flex;flex-direction:column;gap:4px;border:1px solid #9cbce0;border-left:5px solid #5c93d1;padding:10px 12px;background:#eaf4ff;border-radius:10px}
.vpqintro .gasconceptitem strong{font-size:12px;color:#325b8f}
.vpqintro .gasconceptitem span{font-size:13px}
.vpqintro .gasn1{background:#e3f7eb;border-color:#a1d2b5;border-left-color:#429d71}
.vpqintro .gasn2{background:#f0e9ff;border-color:#c6b1e8;border-left-color:#9163d0}
.vpqintro .gasn3{background:#fff1dd;border-color:#ead0a2;border-left-color:#c88a32}
.vpqintro .gasminigrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:9px}
.vpqintro .gasminigrid>div{padding:10px;background:#eaf3ff;border:1px solid #b5cde9;border-radius:10px}
.vpqintro .gasminigrid>div:nth-child(even){background:#f3ecff;border-color:#d0bce8}
@media(max-width:580px){.vpqintro .gasconceptgrid,.vpqintro .gasminigrid{grid-template-columns:1fr}}

.vpqintro.hybrid-theme .introhero{background:linear-gradient(105deg,#e0f1ff,#f0e6ff,#e4f8e9);border:2px solid #95b9e5}
.vpqintro .hybridtwo{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;margin:12px 0}
.vpqintro .hybridtwo section{padding:10px;border-radius:12px;background:#eff6ff;border:1px solid #aec8e8}
.vpqintro .hybridtwo section:nth-child(2){background:#f5edff;border-color:#c1afe7}
.vpqintro .hybridtwo h3{margin:4px 0 11px;font-size:17px;color:#345e9b}
.vpqintro .hybridtestcard{display:flex;flex-direction:column;width:100%;gap:6px;padding:12px;text-align:left;border-radius:11px;border:2px solid #9fc0e5;background:white;color:#233d5c;margin:8px 0;cursor:pointer}
.vpqintro .hybridtestcard:hover,.vpqintro .hybridtestcard:focus-visible{border-color:#4d84bf;background:#e5f2ff}
.vpqintro .hybridtestcard.sendout{border-color:#c8b4e9;background:#fcfaff}
.vpqintro .hybridtestcard small{color:#6a5790;font-weight:bold}
.vpqintro .hybridtestcard b{font-size:15px}.vpqintro .hybridtestcard span{font-size:13px;line-height:1.4}
.vpqintro .hybridpanel{background:#e6f4ff;border:1px solid #b0cfea;border-radius:12px;padding:11px}
.vpqintro .hybridpanel:nth-child(2){background:#e6f8e9;border-color:#a9d8ba}
.vpqintro .hybridpatient{border:2px solid #b8a5e6;border-radius:13px;padding:14px;background:#f9f6ff}
.vpqintro .hybridresult{padding:12px;border-radius:11px;background:#e1f5e7;border:2px solid #91c5a6;margin:12px 0}
.vpqintro .hybridanswers{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.vpqintro .hybridanswers button{border:1px solid #a8bcdb;background:white;padding:10px;border-radius:9px;text-align:left;cursor:pointer;color:#263956}
.vpqintro .hybridanswers button.hybridcorrect{background:#e0f6e6;border:2px solid #348c58;color:#175c35}
.vpqintro .hybridanswers button.hybridwrong{background:#fff0d2;border:2px solid #d79a2e;color:#764908}
.vpqintro .hybridfeedback{border-radius:10px;padding:12px;margin:10px 0}
.vpqintro .hybridfeedback.good{background:#e5f6ea;border:1px solid #8fbfa0}
.vpqintro .hybridfeedback.bad{background:#fff1d9;border:1px solid #ddba72}
@media(max-width:620px){.vpqintro .hybridtwo,.vpqintro .hybridanswers{grid-template-columns:1fr}}
.vpqintro .gasexplainlines{display:flex;flex-direction:column;gap:0;overflow:hidden;border:1px solid #bcd0e8;border-radius:11px;margin-top:10px;background:white}
.vpqintro .gasexplainline{display:flex;align-items:flex-start;gap:12px;padding:11px 12px}
.vpqintro .gasexplainline+.gasexplainline{border-top:1px solid #cbd9e9}
.vpqintro .gasexplainline:nth-child(even){background:#eff5ff}
.vpqintro .gasexplainline:nth-child(3n){background:#f0ebff}
.vpqintro .gasexplainline b{display:block;color:#284d80;font-size:14px}
.vpqintro .gasexplainline p{margin:3px 0 0;line-height:1.5}
.vpqintro .gasexplainnumber{display:grid;place-items:center;flex:0 0 27px;width:27px;height:27px;border-radius:50%;background:#547fc2;color:#fff;font-weight:800}
.vpqintro .gasexplainline:nth-child(3n) .gasexplainnumber{background:#8561bc}
.vpqintro .gasphysiology{border:2px solid #9cb9e0;background:#f7fbff}
.vpqintro .gasphintro{background:linear-gradient(110deg,#dff0ff,#e5f9eb);border:1px solid #a9c5da;border-radius:11px;padding:12px;margin:10px 0}
.vpqintro .gasphintro p{margin:5px 0 0}
.vpqintro .gasphyscards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.vpqintro .gasphyscard{border:2px solid #a7c5e8;background:#e7f2ff;border-radius:11px;padding:12px}
.vpqintro .gasphyscard:nth-child(3n + 2){background:#e6f7ec;border-color:#9bcab0}
.vpqintro .gasphyscard:nth-child(3n){background:#f0e8ff;border-color:#bfabe8}
.vpqintro .gasphyscard>b{font-size:15px;color:#315386}
.vpqintro .gasphyscard p{margin:6px 0 0}
.vpqintro .gaspatientexamples{background:white;border:1px solid #adc6e1;border-radius:11px;padding:12px;margin-top:12px}
.vpqintro .gaspatientexamples>b{display:block;color:#305986;margin-bottom:6px}
.vpqintro .gaspatientexamples>div{padding:8px 2px}
.vpqintro .gaspatientexamples>div+div{border-top:1px solid #d8e3ee}
.vpqintro .gaspatientexamples p{margin:4px 0}
@media(max-width:580px){.vpqintro .gasphyscards{grid-template-columns:1fr}}

/* Readable learning screens, not patient-question or diagnostic station panels */
.vpqintro.coag-theme,.vpqintro.gas-theme{font-size:14px;line-height:1.47}
.vpqintro.coag-theme h3,.vpqintro.gas-theme h3{font-size:17px;line-height:1.35}
.vpqintro.coag-theme .introhero,.vpqintro.gas-theme .introhero{font-size:15px}
.vpqintro.coag-theme .pathcard h4,.vpqintro.gas-theme .pathcard h4{font-size:16px}
.vpqintro.coag-theme .node em,.vpqintro.gas-theme .node em{font-size:14px}
.vpqintro.coag-theme .quicktable,.vpqintro.gas-theme .quicktable{font-size:14px;line-height:1.45}
.vpqintro.coag-theme .coagprettydetails>summary,.vpqintro.gas-theme details>summary{font-size:16px;line-height:1.45}
.vpqintro.coag-theme .coagminicard span,.vpqintro.gas-theme .gasconceptitem span,.vpqintro.gas-theme .gasexplainline p{font-size:15px;line-height:1.55}
.vpqintro.gas-theme .step,.vpqintro.gas-theme .steps .step{font-size:15px;line-height:1.45}
.vpqintro.gas-theme .step b{font-size:16px}
.vpqintro.coag-theme .coagfootnote,.vpqintro.gas-theme .tiny{font-size:13px}
.vpqintro .gasformulalesson{margin:10px 0;padding:10px;border-radius:12px;background:linear-gradient(135deg,#e9f3ff,#f1ecff);border:2px solid #91acd9}
.vpqintro .gasformulalesson>h3{margin:0 0 8px;color:#314f88}
.vpqintro .gasformulalesson>p{margin:0 0 12px}
.vpqintro .gasformulagrid{display:grid;grid-template-columns:1fr;gap:7px}
.vpqintro .gasformulacard{padding:0;border:2px solid #a1bde6;border-radius:13px;background:#eff6ff}
.vpqintro .gasformulacard.formula1{background:#edfaee;border-color:#9ccbaf}
.vpqintro .gasformulacard.formula2{background:#fff4e3;border-color:#deb882}
.vpqintro .gasformulacard>summary{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;cursor:pointer;padding:10px 12px;font-size:16px;font-weight:800;color:#2d548c;list-style:revert}
.vpqintro .gasformulacard>summary small{font-size:12px;color:#516d91;font-weight:600}
.vpqintro .gasformulabody{padding:0 11px 12px;border-top:1px solid #c4d7e9}
.vpqintro .gasformulacard[open]>summary{margin-bottom:10px}
.vpqintro .gasformulacard.formula1>summary{color:#286e48}
.vpqintro .gasformulacard.formula2>summary{color:#845114}
.vpqintro .gasformulaeq{font-size:16px;font-weight:850;line-height:1.5;text-align:center;background:white;border:2px solid #c1d2e8;border-radius:10px;padding:8px 6px;overflow-wrap:anywhere;margin-bottom:7px}
.vpqintro .gasformulaexample{display:flex;align-items:baseline;flex-wrap:wrap;gap:8px;border-radius:9px;background:#ffffffb8;padding:9px 10px;margin-bottom:10px}
.vpqintro .gasformulaexample b{color:#2d598c}
.vpqintro .gasformulaexample span{font-size:15px;font-weight:750}
.vpqintro .gasformulacard p{margin:8px 0;line-height:1.55}
.vpqintro .gasformulanote{font-size:14px;line-height:1.5;padding:7px 9px;border-left:4px solid #ddad57;border-radius:7px;background:#fff9e9}
.vpqintro .gasformulaworkflow{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin-top:12px}
.vpqintro .gasformulaworkflow b{width:100%;color:#314e85}
.vpqintro .gasformulaworkflow span{padding:7px 10px;background:white;border:1px solid #b3c3e2;border-radius:18px;font-size:14px;font-weight:700}
@media(max-width:580px){.vpqintro .gasformulalesson{padding:10px}.vpqintro .gasformulacard{padding:11px}.vpqintro .gasformulaeq{font-size:16px}}

/* Keep panels compact: enlarge the small text itself, not the entire layout */
.vpqintro.coag-theme .coagminicard span,.vpqintro.gas-theme .gasconceptitem span,.vpqintro.gas-theme .gasexplainline p,.vpqintro.gas-theme .gasphyscard p,.vpqintro.coag-theme .hemocard p{font-size:15px;line-height:1.45}
.vpqintro.coag-theme .coagmini,.vpqintro.gas-theme .gasconceptgrid,.vpqintro.gas-theme .gasphyscards{gap:7px}
.vpqintro.coag-theme .coagminicard,.vpqintro.gas-theme .gasconceptitem,.vpqintro.gas-theme .gasphyscard{padding:9px 10px}
.vpqintro.coag-theme .introhero,.vpqintro.gas-theme .introhero{padding:10px 12px}
.vpqintro.coag-theme .pathgrid,.vpqintro.gas-theme .pathgrid{gap:8px}
.vpqintro.coag-theme .coagprettydetails,.vpqintro.gas-theme .gasconcept{padding:9px 10px}
.vpqintro .gasagtrends{margin:11px 0 5px;padding:10px;border:1px solid #bed0e4;border-radius:12px;background:#fff}
.vpqintro .gasagtrends h4{font-size:16px;margin:0 0 7px;color:#345482}
.vpqintro .gasagtrend{display:flex;align-items:start;gap:10px;padding:9px;border-radius:9px;margin-top:6px;line-height:1.48}
.vpqintro .gasagtrend strong{display:block;flex:0 0 156px;font-size:14px}
.vpqintro .gasagtrend span{font-size:14px}
.vpqintro .gasagtrend.high{background:#fff0d9;border:1px solid #dfb677;color:#74420d}
.vpqintro .gasagtrend.normal{background:#e7f5e8;border:1px solid #9ac4a2;color:#235d3c}
.vpqintro .gasagtrend.low{background:#eee8ff;border:1px solid #c1b1e7;color:#584186}
.vpqintro .gasaglegend{font-size:13px;margin:10px 2px 0}
@media(max-width:580px){.vpqintro .gasagtrend{flex-direction:column;gap:4px}.vpqintro .gasagtrend strong{flex-basis:auto}}
</style>`;
const COAG_FACTORS=[
['I','Fibrinogen','Common','Thrombin cleaves fibrinogen to soluble fibrin monomers; XIIIa cross-links fibrin','No','Low/abnormal functional fibrinogen may prolong TT, then PT/aPTT when severe'],
['II','Prothrombin','Common','Activated to IIa (thrombin) by Xa–Va prothrombinase','Yes','Common-pathway deficiency may prolong PT and aPTT'],
['III','Tissue factor / thromboplastin','Extrinsic trigger','Membrane cofactor exposed after tissue injury; binds VII/VIIa to initiate coagulation','No','Tissue factor is supplied by the PT reagent, not measured as a patient factor deficiency'],
['IV','Calcium (Ca²⁺)','Shared cofactor','Links vitamin K–carboxylated factors to phospholipid surfaces','No','Citrate binds calcium in collection tubes; assays restore calcium to test clotting'],
['V','Proaccelerin / labile factor','Common','Activated Va supports Xa in prothrombinase; thrombin amplifies it','No','Significant deficiency may prolong both PT and aPTT'],
['VII','Proconvertin / stable factor','Extrinsic','VIIa complexes with tissue factor to activate X (and IX)','Yes','Deficiency or early vitamin K antagonism often prolongs PT first'],
['VIII','Antihemophilic factor A','Intrinsic cofactor','VIIIa partners with IXa in intrinsic tenase; carried by vWF in circulation','No','Hemophilia A: aPTT often prolonged; PT usually normal'],
['IX','Christmas factor / antihemophilic B','Intrinsic','IXa teams with VIIIa + Ca²⁺ + phospholipid to activate X','Yes','Hemophilia B: aPTT often prolonged; PT usually normal'],
['X','Stuart–Prower factor','Common','Xa + Va forms prothrombinase that generates thrombin','Yes','Deficiency may prolong both PT and aPTT'],
['XI','Plasma thromboplastin antecedent','Intrinsic / amplification','XIa activates IX; thrombin can activate XI during amplification','No','Factor XI deficiency (hemophilia C): aPTT often prolonged; variable bleeding'],
['XII','Hageman / contact factor','Contact-pathway test','XIIa starts contact activation in the test tube, upstream of XI','No','Can cause prolonged aPTT without typical spontaneous clinical bleeding'],
['XIII','Fibrin-stabilizing factor','Clot stabilization','XIIIa cross-links fibrin strands into a durable clot','No','May cause delayed bleeding despite normal PT and aPTT']
];
function factorAtlas(){
 const rows=COAG_FACTORS.map(f=>'<tr class="'+(f[4]==='Yes'?'coagkrow ':'')+(/Extrinsic/.test(f[2])?'factor-extrinsic':/Intrinsic|Contact/.test(f[2])?'factor-intrinsic':/Common|Clot/.test(f[2])?'factor-common':'factor-cofactor')+'"><td><b>'+esc(f[0])+'</b>'+(f[4]==='Yes'?' <span class="coagkmark">K</span>':'')+'</td><td><b>'+esc(f[1])+'</b></td><td>'+esc(f[2])+'</td><td>'+esc(f[3])+'</td><td>'+esc(f[5])+'</td></tr>').join('');
 return '<section class="factoratlas"><h3>🧬 Complete factor atlas · names + function + expected assay</h3><p>Gold <b>K</b> tags mark vitamin K–dependent clotting factors. This table includes the classic factors <b>I–XIII, except VI</b> (obsolete; factor VI was activated V).</p>'+
 '<div class="factor-scroll"><table class="quicktable"><thead><tr><th>Factor</th><th>Full name</th><th>Where it works</th><th>Job in clot formation</th><th>Deficiency / test clue</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
 '<div class="pathnote"><b>Mnemonic: 10 – 9 – 7 – 2</b> → X, IX, VII, II are the <b>four vitamin K–dependent procoagulant factors</b>. Also vitamin K dependent: <b>proteins C, S and Z</b> (anticoagulant/regulatory proteins). Factor V, factor VIII, fibrinogen and factor XIII are <b>not</b> vitamin K dependent.</div>'+
 '<details open class="coagprettydetails"><summary>🍃 What does vitamin K actually DO?</summary>'+
 '<div class="coaglessonlead"><span class="coaglessonicon">K</span><div><strong>Vitamin K activates the clotting machinery</strong><p>Hepatocytes make the proteins. Vitamin K supports <b>γ-carboxylation</b> of factors II, VII, IX and X so they bind Ca²⁺ and assemble on negatively charged platelet phospholipid surfaces.</p></div></div>'+
 '<div class="coagformula"><span>Vitamin K recycling</span><b>→</b><span>Functional factors II · VII · IX · X</span><b>→</b><span>Ca²⁺ + platelet surface</span><b>→</b><span>Fibrin generation</span></div>'+
 '<div class="coagminigrid"><div class="coagminiamber"><b>🧠 Why PT changes first</b><p>Factor VII has a short half-life. With reduced vitamin K activity, <strong>PT often rises first</strong>; aPTT may lengthen later as other factor activities fall.</p></div><div class="coagminired"><b>🐀 Anticoagulant rodenticide alert</b><p>Warfarin, brodifacoum and bromadiolone block vitamin K recycling (VKOR). <strong>Bromethalin is neurotoxic—not a vitamin K antagonist.</strong></p></div></div>'+
 '<p class="coagfootnote">Remember: vitamin K does not directly create the clot; it enables functional clotting proteins. Proteins C, S and Z also depend on vitamin K.</p></details>'+
 '<details class="coagprettydetails"><summary>🧱 Cofactors, natural brakes, and fibrin cleanup</summary>'+
 '<div class="coagmechanismhead"><b>⚙️ BUILD THE CLOT</b><span>Platforms and accelerators</span></div>'+
 '<div class="coagmini"><div class="coagminicard"><strong>PF3 · Platelet surface</strong><span>Negatively charged phospholipid platform for tenase and prothrombinase.</span></div><div class="coagminicard"><strong>Calcium · Factor IV</strong><span>Links vitamin K–dependent factors to platelet phospholipids.</span></div><div class="coagminicard"><strong>VIIIa · Tenase cofactor</strong><span>Works with IXa to activate X.</span></div><div class="coagminicard"><strong>Va · Prothrombinase cofactor</strong><span>Works with Xa to generate thrombin.</span></div><div class="coagminicard"><strong>vWF · Platelet adhesion</strong><span>Helps platelets stick and carries factor VIII in circulation.</span></div></div>'+
 '<div class="coagmechanismhead"><b>🛑 APPLY THE BRAKES</b><span>Prevent excess clotting</span></div>'+
 '<div class="coagmini coagbrakes"><div class="coagminicard"><strong>Antithrombin</strong><span>Inhibits thrombin (IIa), Xa and other serine proteases.</span></div><div class="coagminicard"><strong>Activated protein C + S</strong><span>Inactivates cofactors Va and VIIIa.</span></div><div class="coagminicard"><strong>TFPI</strong><span>Limits tissue-factor/VIIa–Xa initiation complexes.</span></div></div>'+
 '<div class="coagmechanismhead"><b>🧹 CLEANUP CREW</b><span>Fibrinolysis after clot formation</span></div>'+
 '<div class="coagclean"><b>Plasmin</b><span>breaks down fibrin</span><b>→</b><b>D-dimers</b><span>reflect degradation of cross-linked fibrin</span></div></details>'+
 '</section>';
}
function coagLivingSequence(){
 return '<section class="coagliving"><h3>⚡ In a patient: START → AMPLIFY → STABILIZE</h3><div class="coaglivinggrid">'+
 '<div><b>① START · Tissue injury</b><p>Exposed tissue factor (III) + VIIa activates a little X → Xa. Xa–Va forms a little IIa (thrombin).</p></div>'+
 '<div><b>② AMPLIFY · Thrombin signal</b><p>Thrombin activates platelets and factors V, VIII and XI, building reactive phospholipid surfaces.</p></div>'+
 '<div><b>③ PROPAGATE · Thrombin burst</b><p>IXa + VIIIa + calcium + phospholipid = <b>intrinsic tenase</b> → much more Xa. Xa + Va = <b>prothrombinase</b> → much more thrombin.</p></div>'+
 '<div><b>④ STABILIZE · Fibrin mesh</b><p>Thrombin converts I → fibrin and activates XIII → XIIIa to cross-link fibrin, reinforcing the platelet plug.</p></div>'+
 '</div><p class="tiny"><b>Key distinction:</b> The contact activation chain XII → XI → IX is a useful <b>aPTT lab model</b>, but tissue-factor initiation dominates physiological hemostasis; factor XII is not essential for normal bleeding control.</p></section>';
}

const COAG_IMAGE='coagulation-cascade-study-chart.svg';
function coagImageCard(){
 return '<section class="coagimagecard" aria-label="Coagulation pathway downloadable diagram">'+
 '<h3>🖼️ Take the cascade with you!</h3>'+
 '<p>Tap the picture to expand it. Download the high-resolution SVG to zoom in, print, or study offline.</p>'+
 '<button type="button" class="coagimagebutton" data-vpqadvanced="coag-enlarge" aria-label="Expand coagulation cascade diagram"><img src="'+COAG_IMAGE+'" alt="Color-coded coagulation pathway: PT, aPTT, factors, vitamin K and fibrin stabilization" loading="lazy"><span>🔍 Click diagram to expand</span></button>'+
 '<div class="coagimageactions"><button type="button" data-vpqadvanced="coag-enlarge">🔍 Expand diagram</button><a href="'+COAG_IMAGE+'" download="Vet-Pharm-Quest-Coagulation-Cascade.svg" class="coagdownload">⬇ Download pathway image (SVG)</a></div>'+
 '</section>';
}
function coagExpanded(){
 run=null;return modal('Coagulation Pathway · Expanded Diagram','<div class="vpqintro">'+INTRO_STYLE+
 '<div class="coagfull"><p>Zoom your browser for finer detail. This vector image stays sharp at any size.</p><a href="'+COAG_IMAGE+'" target="_blank" rel="noopener">🔍 Open image in full tab</a><img src="'+COAG_IMAGE+'" alt="Full coagulation cascade and test guide" class="coagfullimage"><div class="coagimageactions"><a href="'+COAG_IMAGE+'" download="Vet-Pharm-Quest-Coagulation-Cascade.svg" class="coagdownload">⬇ Download pathway image</a><button type="button" data-vpqadvanced="coag-back">← Back to learn first</button></div></div></div>');
}

function coagIntro(){
 return '<div class="vpqintro coag-theme">'+INTRO_STYLE+
 '<div class="introhero"><b>🩸 COAG CASCADE LAB · LEARN FIRST</b><p><strong>Platelets build the temporary plug. Coagulation factors reinforce it with fibrin.</strong> PT and aPTT are timed tests of different paths toward the same fibrin finish line. <b>PTT</b> usually refers to the partial thromboplastin time; <b>aPTT</b> is its activated version used routinely in modern screening.</p></div>'+
 coagImageCard()+
 '<div class="pathgrid">'+
 '<div class="pathcard"><h4>🟠 Extrinsic pathway · PT</h4><div class="node"><b>Vessel injury → tissue factor (III)</b><em>exposed at injured tissue</em></div><div class="arrow">↓</div><div class="node"><b>VII → VIIa</b><em>Factor VII is sensitive to early vitamin K depletion</em></div><div class="arrow">↓</div><div class="node coagCommon"><b>X → Xa</b><em>Join common pathway</em></div></div>'+
 '<div class="pathcard"><h4>🔵 Intrinsic pathway · aPTT</h4><div class="node"><b>XII → XI → IX</b><em>Contact-activation test pathway</em></div><div class="arrow">↓</div><div class="node"><b>IXa + VIIIa</b><em>Intrinsic tenase activates X</em></div><div class="arrow">↓</div><div class="node coagCommon"><b>X → Xa</b><em>Join common pathway</em></div></div>'+
 '</div>'+
 '<div class="pathcard"><h4>🟢 Shared finish line · common pathway (PT and aPTT)</h4><div class="node coagCommon"><b>Xa + Va + calcium + phospholipid</b><em>Prothrombinase complex</em></div><div class="arrow">↓</div><div class="node coagCommon"><b>II (prothrombin) → IIa (thrombin)</b></div><div class="arrow">↓</div><div class="node coagCommon"><b>I (fibrinogen) → fibrin → XIIIa cross-links</b><em>Stable clot!</em></div></div>'+
 '<div class="pathnote"><b>Remember:</b> The classic intrinsic/extrinsic diagram explains laboratory tests, not every step of coagulation inside the body. Tissue-factor initiation and thrombin amplification are central in vivo. Factor XII deficiency can markedly prolong aPTT without causing typical bleeding.</div>'+
 coagLivingSequence()+factorAtlas()+
 '<h3>🔎 Read the coag panel like a detective</h3>'+
 '<table class="quicktable"><thead><tr><th>Result</th><th>What it screens</th><th>Think about…</th></tr></thead><tbody>'+
 '<tr><td><b>PT ↑</b><br>aPTT normal</td><td>Extrinsic + common</td><td>Factor VII, early vitamin K antagonist effect, assay/sample issues</td></tr>'+
 '<tr><td><b>aPTT ↑</b><br>PT normal</td><td>Intrinsic + common</td><td>VIII, IX, XI, XII deficiencies; inhibitors/heparin; XII is not usually a bleeding cause</td></tr>'+
 '<tr><td><b>PT ↑ and aPTT ↑</b></td><td>Shared factors or multiple affected factors</td><td>II, V, X, fibrinogen; severe liver disease, DIC, vitamin K antagonist exposure</td></tr>'+
 '<tr><td><b>Both normal, bleeding present</b></td><td>Routine factor screens may be normal</td><td>Platelet number/function, vWF, factor XIII and vascular causes</td></tr>'+
 '</tbody></table>'+
 '<details open><summary>🧪 The other tests: what do they mean?</summary>'+
 '<div class="coagtestlist"><div class="coagtestrow"><b>Platelet count + smear:</b> plug-building cells; confirm clumping before calling thrombocytopenia.</div><div class="coagtestrow"><b>vWF antigen/function:</b> platelet adhesion, especially mucosal bleeding.</div><div class="coagtestrow"><b>Fibrinogen:</b> clot substrate; low with consumption/severe synthetic problems, sometimes high during inflammation.</div><div class="coagtestrow"><b>Thrombin time (TT):</b> fibrinogen → fibrin after adding thrombin; affected by low/abnormal fibrinogen and certain anticoagulants.</div><div class="coagtestrow"><b>D-dimer:</b> breakdown of cross-linked fibrin; evidence of clot formation and lysis, not specific for DIC.</div><div class="coagtestrow"><b>FDPs:</b> fibrin(ogen) degradation products; less specific than D-dimer for cross-linked fibrin.</div><div class="coagtestrow"><b>Antithrombin:</b> natural anticoagulant; may fall with consumption, protein loss or reduced synthesis.</div></div></details>'+
 '<details open class="coagprettydetails"><summary>🧬 Hemophilia in veterinary patients · A, B and C</summary>'+
 '<div class="coaglessonlead coagpurple"><span class="coaglessonicon">VIII</span><div><strong>Why these patients bleed</strong><p>Inherited factor deficiencies weaken secondary hemostasis: the platelet plug forms, but <b>fibrin reinforcement is inadequate</b>. Severe patients may have deep hematomas, hemarthrosis, internal hemorrhage or prolonged bleeding after trauma/surgery.</p></div></div>'+
 '<div class="hemogrid">'+
 '<article class="hemocard hemoa"><div class="hemotop"><b>Hemophilia A</b><span>Factor VIII</span></div><strong>Classic hemophilia</strong><p>Intrinsic tenase cofactor. Usually <b>X-linked recessive</b>; affected males, carrier females. Described in dogs, cats and other species.</p><div class="hemolab"><b>aPTT ↑</b> · PT usually normal · platelets usually normal</div></article>'+
 '<article class="hemocard hemob"><div class="hemotop"><b>Hemophilia B</b><span>Factor IX</span></div><strong>Christmas disease</strong><p>Intrinsic tenase enzyme. Usually <b>X-linked recessive</b>; affected males more common. Reported in dogs and cats.</p><div class="hemolab"><b>aPTT ↑</b> · PT usually normal · platelets usually normal</div></article>'+
 '<article class="hemocard hemoc"><div class="hemotop"><b>Hemophilia C</b><span>Factor XI</span></div><strong>Factor XI deficiency</strong><p><b>Autosomal inheritance</b>; either sex may be affected. Recognized in some cattle breeds and other species; bleeding can be variable or milder.</p><div class="hemolab"><b>aPTT often ↑</b> · PT usually normal</div></article>'+
 '</div>'+
 '<div class="coagclinical"><b>🐕 Patient clue → next diagnostic step</b><p>Young male dog + recurring deep bleeding + normal platelets/PT + prolonged aPTT → consider <b>VIII (A), IX (B), or XI (C)</b>. Confirm with <b>factor-specific activity assays</b> after verifying properly handled citrated plasma.</p></div>'+
 '<div class="coagdontconfuse"><b>⚖️ Do not confuse</b><p><b>von Willebrand disease:</b> platelet adhesion and mucosal bleeding; PT/aPTT may be normal, though aPTT can rise with secondary factor VIII reduction.</p><p><b>Factor XII deficiency:</b> often greatly prolongs aPTT <i>without</i> typical clinical bleeding. Mild hemophilia may also escape a screening aPTT, depending on the assay.</p></div>'+
 '<div class="coagfootersteps"><b>Clinical workflow</b><span>1 · History + bleeding pattern</span><span>2 · Proper citrate sample + PT/aPTT</span><span>3 · VIII / IX / XI activity assays</span><span>4 · Assess inherited vs acquired causes</span></div><p class="coagfootnote">Treat active bleeding as a veterinary emergency; test selection and interpretation depend on species, method and severity.</p></details>'+
 '<details><summary>🩹 Bleeding clue game: where is the problem?</summary><p><b>Petechiae, epistaxis, gingival oozing:</b> start with primary hemostasis, platelets and vWF. <b>Hemarthrosis, deep hematomas or delayed rebleeding:</b> consider secondary hemostatic factor deficiencies. <b>Both patterns + systemic illness:</b> mixed processes such as DIC can occur.</p><p><b>Preanalytics:</b> correctly filled light-blue-top citrate tube; underfilling, clots, heparin contamination, high HCT or improper processing can invalidate interpretation.</p></details>'+
 '<div class="introactions"><button type="button" class="start" data-vpqadvanced="begin-coag">🎯 Start my existing coag questions</button><button type="button" class="return" data-vpqadvanced="home">← Back to lab</button></div>'+
 '</div>';
}

const GAS_IMAGE='blood-gas-acid-base-study-chart.svg';
function gasImageCard(){
 return '<section class="coagimagecard gasimagecard"><h3>🫧 Your downloadable blood gas pathway</h3><p>See the interpretation sequence at a glance. Expand to study or download the sharp vector version.</p>'+
 '<button type="button" class="coagimagebutton" data-vpqadvanced="gas-enlarge"><img loading="lazy" alt="Colorful blood gas interpretation pathway with respiratory, metabolic and compensation patterns" src="'+GAS_IMAGE+'"><span>🔍 Expand blood gas chart</span></button>'+
 '<div class="coagimageactions"><button type="button" data-vpqadvanced="gas-enlarge">🔍 Expand chart</button><a class="coagdownload" href="'+GAS_IMAGE+'" download="Vet-Pharm-Quest-Blood-Gas-Pathway.svg">⬇ Download pathway image</a></div></section>';
}
function gasExpanded(){run=null;modal('Blood Gas · Expanded Study Diagram','<div class="vpqintro gas-theme">'+INTRO_STYLE+'<div class="coagfull"><p>Vector image: enlarge without losing sharpness.</p><a href="'+GAS_IMAGE+'" target="_blank" rel="noopener">Open full-resolution chart</a><img class="coagfullimage" src="'+GAS_IMAGE+'" alt="Blood gas and acid-base interpretation chart"><div class="coagimageactions"><a class="coagdownload" href="'+GAS_IMAGE+'" download="Vet-Pharm-Quest-Blood-Gas-Pathway.svg">⬇ Download image</a><button data-vpqadvanced="gas-back">← Back to blood gas lesson</button></div></div></div>')}
function gasExtraConcepts(){
 const tests=[
 ['pH · READ FIRST','Net acid–base status','FIRST identify acidemia, alkalemia or a pH within the interval. THEN use pCO₂ and HCO₃⁻ to explain the direction; a normal pH may hide a mixed disorder.'],
 ['pCO₂','Respiratory component','Ventilation controls retained CO₂. Arterial and venous pCO₂ differ.'],
 ['HCO₃⁻ / TCO₂','Metabolic buffering','Calculated gas bicarbonate vs chemistry total CO₂ are related, not automatically interchangeable.'],
 ['Base excess','Metabolic contribution','Negative suggests base deficit; consider species, method and other disturbances.'],
 ['Anion gap','Unmeasured anions','Course formula: (Na⁺ + K⁺) − (Cl⁻ + HCO₃⁻). INCREASED: more unmeasured acids, such as lactate or ketones. DECREASED: less albumin, more unmeasured cations or analytical interference. Use the matching laboratory RI.'],
 ['Corrected chloride','Relative chloride change','Separate chloride shifts associated with sodium/water from selective acid–base shifts.'],
 ['Lactate','Production versus clearance','May rise from hypoperfusion, adrenergic stress or impaired clearance; trends matter.'],
 ['PaO₂ / saturation','Oxygenation','Arterial sampling matters; venous pO₂ cannot replace arterial oxygenation assessment.'],
 ['Ionized calcium','Biologically active calcium','pH affects albumin binding; alkalemia can decrease ionized calcium even when total calcium is unchanged.']
 ];
 return '<details open class="gasconcept"><summary>🧪 Blood gas cheat sheet · what does each number measure?</summary><div class="gasconceptgrid">'+tests.map((t,i)=>'<div class="gasconceptitem gasn'+i%4+'"><b>'+t[0]+'</b><strong>'+t[1]+'</strong><span>'+t[2]+'</span></div>').join('')+'</div></details>'+
 '<details class="gasconcept"><summary>⚠️ Sample pitfalls and compensation traps</summary><div class="gasminigrid"><div><b>🫁 Arterial vs venous</b><p>Do not interpret venous pO₂ as an oxygenation test. Interpret pCO₂ with sampling site in mind.</p></div><div><b>🧪 Sample handling · directional trends</b><p><strong>Air bubble / room air:</strong> pCO₂ usually ↓ and pH tends ↑; pO₂ moves toward room-air oxygen tension, so it can ↑ OR ↓ depending on starting pO₂. <strong>Delay with viable cells:</strong> pO₂ usually ↓, pCO₂ ↑ and pH ↓ from ongoing metabolism. <strong>Excess liquid heparin:</strong> dilution can lower pCO₂/HCO₃⁻ and alter electrolytes. Collect anaerobically, remove bubbles and analyze promptly.</p></div><div><b>🔁 Mixed disorder</b><p>Unexpected pCO₂ or bicarbonate compensation warrants evaluation for a second simultaneous process.</p></div><div><b>📈 Follow trends</b><p>Compare with clinical perfusion, ventilation, glucose, electrolytes, ketones and lactate.</p></div></div></details>';
}


function gasFormulaPanel(){
 const items=[
 {title:'🧪 Anion gap (AG)',formula:'AG = (Na⁺ + K⁺) − (Cl⁻ + HCO₃⁻)',example:'Lecture KBr patient: (150 + 5.1) − (153 + 24) = −21.9 mmol/L',why:'The gap estimates unmeasured anions minus unmeasured cations. Compare with the reference interval before deciding whether the pattern indicates added acids, reduced albumin, or analytical interference.',note:'Course practice dog AG interval: 15–25 mmol/L (NOT a universal interval). Use the patient’s printed lab RI and the same Na + K formula. The −21.9 lecture example is strongly negative; very high measured Cl without low bicarbonate suggests potassium bromide–associated pseudo-hyperchloremia.'},
 {title:'🧂 Corrected chloride (Cl⁻)',formula:'Corrected Cl⁻ = measured Cl⁻ × (normal Na⁺ ÷ measured Na⁺)',example:'Lecture: 112 × (148.5 ÷ 142) ≈ 117 mmol/L; Cl RI 107–115 → INCREASED',why:'Adjusts chloride for sodium/water changes. Increased corrected Cl⁻ suggests relative chloride excess (often associated with metabolic acidosis); decreased corrected Cl⁻ suggests selective chloride depletion (often metabolic alkalosis).',note:'Course lecture uses Na reference 145–152 mmol/L → midpoint 148.5. A corrected chloride of 117 mmol/L exceeds that case’s Cl RI of 107–115 and indicates relative hyperchloremia.'},
 {title:'⚖️ pH · Henderson–Hasselbalch',formula:'pH = 6.1 + log₁₀ [HCO₃⁻ ÷ (0.03 × pCO₂)]',example:'6.1 + log₁₀ [24 ÷ (0.03 × 40)] ≈ 7.40',why:'pH reflects bicarbonate relative to dissolved CO₂. When bicarbonate falls compared with CO₂, pH falls. When CO₂ rises compared with bicarbonate, pH also falls.',note:'HCO₃⁻ in mmol/L and pCO₂ in mmHg, at approximately 37 °C. CO₂ solubility and pK vary slightly with temperature/analyzer. Blood gas HCO₃⁻ is usually calculated from pH and pCO₂.'}
 ];
 return '<section class="gasformulalesson" aria-label="Blood gas formulas and worked examples"><h3>🧮 Essential calculations · See the math AND the physiology</h3>'+
 '<p>Use the same patient sample and units for each calculation. Formulas help reveal patterns, but the patient and method-specific reference intervals determine their meaning.</p>'+
 '<div class="gasformulagrid">'+items.map((x,i)=>'<details class="gasformulacard formula'+i+'"><summary><span>'+x.title+'</span><small>View formula &amp; worked example</small></summary><div class="gasformulabody"><div class="gasformulaeq">'+x.formula+'</div><div class="gasformulaexample"><b>Worked example</b><span>'+x.example+'</span></div><p><b>What is happening in the body?</b> '+x.why+'</p><div class="gasformulanote"><b>Watch out:</b> '+x.note+'</div></div></details>').join('')+'</div>'+
 '<div class="gasagtrends"><h4>📈 AG trends · compare with the printed lab range</h4><div class="gasagtrend high"><strong>↑ INCREASED AG</strong><span>Above the lab RI: increased unmeasured anions (or reduced unmeasured cations). With ↓ bicarbonate, think <b>gap/titrational metabolic acidosis</b>: ketones, lactate, uremic acids, ethylene glycol.</span></div><div class="gasagtrend normal"><strong>↔ WITHIN RI</strong><span>Does not exclude an acid–base disorder. If ↓ HCO₃⁻ and relative ↑ corrected Cl⁻, think <b>hyperchloremic/non-gap metabolic acidosis</b>, such as bicarbonate loss.</span></div><div class="gasagtrend low"><strong>↓ DECREASED / NEGATIVE AG</strong><span>Below the lab RI: first check <b>albumin ↓</b>, then pseudo-hyperchloremia (including potassium bromide), or increased unmeasured cations. A negative gap alone does not prove acidosis.</span></div><p class="gasaglegend"><b>Course practice dog AG RI: 15–25 mmol/L.</b> The lecture KBr case is <b>−21.9</b> and markedly below that illustrative interval. Always prioritize the patient-specific lab range.</p></div>'+
 '<div class="gasformulaworkflow"><b>🔍 Patient interpretation sequence</b><span>① Check pH</span><span>② Identify pCO₂ / HCO₃⁻ driver</span><span>③ Evaluate compensation</span><span>④ Calculate AG and corrected Cl⁻</span><span>⑤ Explain the physiology and patient cause</span></div></section>';
}

function gasIntro(){
 return '<div class="vpqintro gas-theme">'+INTRO_STYLE+
 gasImageCard()+
 '<div class="introhero"><b>🫧 BLOOD GAS DETECTIVE · LEARN FIRST</b><p><strong>READ pH FIRST:</strong> identify acidemia (↓), alkalemia (↑), or within interval. pH is the <em>net result</em> of the situation, not the diagnosis. <strong>THEN</strong> compare pCO₂ (respiratory/lung contribution) and HCO₃⁻ (metabolic/kidney contribution) to determine what is driving the pH and whether the other system is compensating. A normal pH can conceal a mixed disorder.</p></div>'+
 '<div class="steps"><div class="step"><b>① pH</b>Acidemia ↓ or alkalemia ↑?</div><div class="step"><b>② Primary</b>Which of CO₂ or HCO₃⁻ explains pH?</div><div class="step"><b>③ Compensate</b>Does the other system respond as expected?</div><div class="step"><b>④ Cause</b>AG, chloride, lactate, ketones + patient</div></div>'+
 '<details open class="gasconcept gasphysiology"><summary>🧠 What the body is doing · pH, chloride and compensation</summary>'+ '<div class="gasphintro"><b>pH follows the ratio of HCO₃⁻ to dissolved CO₂.</b><p>More bicarbonate relative to CO₂ → higher pH. More CO₂ relative to bicarbonate → lower pH. Read all three measurements together.</p></div>'+ '<div class="gasphyscards">'+ [['🫁 CO₂ · Lungs','CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. Hypoventilation holds CO₂ in and lowers pH; hyperventilation removes CO₂ and raises pH. Lungs respond quickly.'],['🫘 Bicarbonate · Kidneys','HCO₃⁻ buffers H⁺. Kidneys reclaim filtered bicarbonate and generate new bicarbonate while excreting acid. Diarrhea can lose bicarbonate; renal compensation takes hours to days.'],['🧂 Chloride · Electroneutrality','Cl⁻ often shifts relative to HCO₃⁻ to preserve electrical balance. Bicarbonate loss commonly produces relative hyperchloremia and a normal-anion-gap acidosis; loss or sequestration of Cl⁻ can maintain metabolic alkalosis.'],['💧 Sodium · Water balance','Na⁺ varies with water as well as sodium balance. Na⁺ and Cl⁻ can move together during water shifts. Corrected chloride helps distinguish selective chloride changes from parallel sodium/water changes.'],['⚡ Potassium · Shifts and losses','K⁺ depends on insulin, pH, aldosterone, kidney handling and body stores. Acidosis does not always cause hyperkalemia. Serum K⁺ can look normal or high even with a major total-body deficit in DKA.'],['🧪 Anion gap · Unmeasured ions','Course AG = (Na⁺ + K⁺) − (Cl⁻ + HCO₃⁻). INCREASED AG + decreased HCO₃⁻ suggests added unmeasured acids (ketones, lactate, uremic acids, ethylene glycol). DECREASED/negative AG suggests hypoalbuminemia, increased unmeasured cations or pseudo-hyperchloremia (KBr). NORMAL AG can coexist with hyperchloremic metabolic acidosis; compare bicarbonate and chloride.']] .map(x=>'<article class="gasphyscard"><b>'+x[0]+'</b><p>'+x[1]+'</p></article>').join('')+'</div>'+ '<div class="gaspatientexamples"><b>🏥 The same physiology in patients</b>'+ [['Diarrhea / renal tubular acidosis','Lose or cannot retain HCO₃⁻ → pH falls → compensatory faster breathing lowers pCO₂. Relative chloride is often higher.'],['Vomiting / abomasal sequestration','Loss or sequestration of H⁺ and Cl⁻ → metabolic alkalosis. Volume and chloride depletion promote renal sodium retention and K⁺/H⁺ loss; urine can become paradoxically acidic.'],['DKA / lactic acidosis','Unmeasured acids consume HCO₃⁻ and lower pH; the anion gap often rises. Compensatory hyperventilation lowers pCO₂. K⁺ concentration can mask a total-body deficit.'],['Hypoventilation','CO₂ retention lowers pH (respiratory acidosis). Over time kidneys retain/generate bicarbonate, pushing pH back toward normal.']] .map(x=>'<div><strong>'+x[0]+'</strong><p>'+x[1]+'</p></div>').join('')+'</div>'+ '<p class="tiny">These are patterns, not absolute rules. Check compensation, sample type, species-specific intervals, and mixed processes.</p></details>'+
 gasFormulaPanel()+
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
 '<details open class="gasconcept gasexplaingroup"><summary>🔍 Additional blood gas and chemistry numbers</summary><div class="gasexplainlines"><div class="gasexplainline"><span class="gasexplainnumber">1</span><div><b>Base excess</b><p>Summarizes the metabolic acid–base component; a negative value suggests a base deficit.</p></div></div><div class="gasexplainline"><span class="gasexplainnumber">2</span><div><b>Total CO₂</b><p>Chemistry-panel estimate made up mainly of bicarbonate; compare with the gas-derived HCO₃⁻ in context.</p></div></div><div class="gasexplainline"><span class="gasexplainnumber">3</span><div><b>Anion gap</b><p>Na − (Cl + HCO₃⁻) is a common formula; some laboratories include K. High values prompt evaluation for lactate, ketones, uremic acids and toxicants. Hypoalbuminemia may mask an increased gap.</p></div></div><div class="gasexplainline"><span class="gasexplainnumber">4</span><div><b>Corrected chloride</b><p>Shows whether chloride changed beyond the amount expected from sodium/water changes.</p></div></div><div class="gasexplainline"><span class="gasexplainnumber">5</span><div><b>Lactate</b><p>Interpret with perfusion, cellular metabolism, clearance and serial trends; it is not a stand-alone diagnosis.</p></div></div><div class="gasexplainline"><span class="gasexplainnumber">6</span><div><b>PaO₂ / oxygen saturation</b><p>Arterial measurements help assess oxygenation. Venous pO₂ cannot substitute for arterial oxygenation.</p></div></div></div></details>'+
 '<details class="gasconcept gasexplaingroup"><summary>🧮 Compensation: is there a second disorder?</summary><div class="gasexplainlines"><div class="gasexplainline"><span class="gasexplainnumber">1</span><div><b>Recognize the primary process</b><p>Low HCO₃⁻ plus acidemia suggests metabolic acidosis; a lower pCO₂ may indicate compensatory ventilation.</p></div></div><div class="gasexplainline"><span class="gasexplainnumber">2</span><div><b>Test for a mixed disorder</b><p>If pCO₂ is unexpectedly normal or elevated during metabolic acidosis, suspect concurrent respiratory acidosis rather than adequate compensation.</p></div></div><div class="gasexplainline"><span class="gasexplainnumber">3</span><div><b>Know what compensation can do</b><p>The response moves pH toward normal but does not overshoot into the opposite primary disturbance.</p></div></div><div class="gasexplainline"><span class="gasexplainnumber">4</span><div><b>Compare against the correct expectations</b><p>Use species-, sampling-site- and laboratory-appropriate compensation relationships before diagnosing a second disorder.</p></div></div><div class="gasexplainline"><span class="gasexplainnumber">5</span><div><b>A normal pH does not always mean normal</b><p>Two opposite processes can coexist and leave the pH close to its reference interval.</p></div></div><div class="gasexplainline"><span class="gasexplainnumber">6</span><div><b>Check your sample</b><p>Arterial versus venous blood, air bubbles, delayed analysis, temperature and excess liquid heparin can affect interpretation.</p></div></div></div></details>'+
 gasExtraConcepts()+
 '<div class="introactions"><button type="button" class="start" data-vpqadvanced="begin-gas">🎯 Start my existing blood gas questions</button><button type="button" class="return" data-vpqadvanced="home">← Back to lab</button></div>'+
 '</div>';
}
function intro(mode){
 run=null;
 if(mode==='coag')return modal('Coagulation · Cascade & Clotting Tests',coagIntro());
 if(mode==='gas')return modal('Blood Gas · Acid–Base Map',gasIntro());
}


/* Hybrid lab — in-house point-of-care measurements + simulated reference-lab orders.
 * Independent from the existing coagulation, gas and uploaded case question banks.
 */
let hybrid=null;
const PCV_TS_LEARN='<details open class="gasconcept"><summary>🩸 Learn first · PCV and TS together</summary><p><b>PCV (packed cell volume)</b> = fraction of whole blood occupied by RBCs after spinning a microhematocrit tube. Interpret with RBC count, hemoglobin, smear, hydration and species reference interval. <b>TS (total solids)</b> = refractometer estimate of plasma solutes, mostly proteins; it is not identical to chemistry total protein and can be affected by lipemia, hemolysis and other dissolved solids.</p><div class="gasminigrid"><div><b>PCV ↑ + TS ↑</b><p>Hemoconcentration / dehydration is a common pattern.</p></div><div><b>PCV ↓ + TS ↓</b><p>Consider whole-blood loss, protein loss or dilution; acute hemorrhage can initially have near-normal readings before redistribution.</p></div><div><b>PCV ↓ + TS normal/↑</b><p>Consider hemolysis or reduced RBC production; concurrent dehydration/inflammation can obscure patterns.</p></div><div><b>PCV ↑ + TS normal</b><p>Consider splenic contraction or true erythrocytosis as well as other patient factors.</p></div></div><p><b>Technique:</b> Fill and seal capillary tubes correctly, centrifuge, read RBC fraction excluding buffy coat, then break the tube above the buffy coat and place clear plasma on the refractometer. Check plasma color for hemolysis, icterus or lipemia. Use species-/method-specific ranges.</p><p><b>Why:</b> RBC mass influences oxygen delivery; plasma solids help assess vascular volume and protein balance. Pairing PCV and TS distinguishes patterns a single number may miss.</p></details>';
const HYBRID_TESTS=[
 {id:'pcvts',kind:'inhouse',icon:'🩸',name:'PCV + TS · Microhematocrit and Refractometer',sample:'Fresh well-mixed EDTA blood for microhematocrit PCV; fill and seal capillary tube, centrifuge properly, exclude buffy coat from reading. Read plasma TS with calibrated refractometer and note hemolysis, lipemia or icterus.',learn:'PCV is the fraction of blood occupied by RBCs; TS estimates plasma total solids (mostly proteins). Read them together with the CBC, chemistry, hydration and species reference ranges.',why:'RBCs carry oxygen, while plasma solids reflect protein and fluid balance. Hemoconcentration tends to raise both PCV and TS; hemorrhage or dilution can lower both, but timing and other diseases complicate trends.',pitfall:'Anemia with normal TS is not automatically hemolysis. Acute hemorrhage may initially show normal PCV/TS. Refractometer TS is not the same measurement as analyzer total protein; lipemia and other solutes interfere.',patient:'🐕 Dog arrives after several days of vomiting and poor water intake with tacky mucous membranes. You perform PCV/TS alongside CBC and chemistry.',result:'PCV 57% (illustrative canine interval 37–55%); TS 8.3 g/dL (illustrative canine interval 6.0–8.0 g/dL). Check lab-specific intervals.',q:'Which combined interpretation is best?',options:['Both PCV and TS are increased, compatible with hemoconcentration; correlate with exam and assess after fluid therapy','The patient has proven absolute polycythemia','The TS result alone proves primary liver disease','High PCV establishes hemolysis'],answer:0,explain:'Both increased suggests dehydration-related hemoconcentration, not a definitive diagnosis. Examine plasma appearance, CBC/chemistry, perfusion and repeat results in context.'},

 {id:'lactate',kind:'inhouse',icon:'💓',name:'Lactate analyzer',sample:'Fresh venous or arterial whole blood; minimize struggling and process promptly',learn:'Lactate reflects the balance of production and clearance; hypoperfusion is one possible cause, not the only one.',why:'Anaerobic glycolysis contributes lactate during low oxygen delivery. Adrenergic stimulation, altered metabolism and reduced clearance can also raise it.',pitfall:'Prolonged tourniquet/restraint, delayed analysis, sample handling, and inability to clear lactate can affect results.',patient:'🐕 Dog with acute weakness after severe hemorrhage. After stabilization, you check a serial lactate.',result:'Lactate 6.1 mmol/L (illustrative canine analyzer interval ~0.5–2.5 mmol/L). Recheck after resuscitation: 2.9 mmol/L.',q:'Which interpretation is best?',options:['Initial hyperlactatemia with improving trend; integrate with perfusion and recovery','Lactate proves sepsis in every case','The first result establishes irrecoverable tissue injury','One repeat lactate replaces the clinical examination'],answer:0,explain:'The fall supports improving net lactate balance, but lactate alone cannot diagnose shock type or prove adequate tissue oxygenation.'},
 {id:'ica',kind:'inhouse',icon:'🦴',name:'Ionized calcium analyzer',sample:'Anaerobically collected heparinized blood or appropriate validated sample; prompt analysis',learn:'Ionized Ca²⁺ is the biologically active calcium fraction and is sensitive to pH and handling.',why:'Alkalemia increases calcium binding to albumin, lowering ionized calcium even when total calcium is unchanged. Acidemia tends to do the opposite.',pitfall:'Air exposure (CO₂ loss), prolonged storage, incorrect heparin quantity, or EDTA contamination can distort iCa.',patient:'🐈 Cat receiving emergency care develops muscle tremors while hyperventilating. Total calcium is normal.',result:'Ionized calcium 0.92 mmol/L (illustrative feline interval ~1.12–1.40 mmol/L); pH 7.52 (illustrative arterial ~7.35–7.45).',q:'Why might ionized calcium be low even if total calcium appears normal?',options:['Alkalemia increases albumin binding of calcium, decreasing free Ca²⁺','Low albumin always increases ionized calcium above normal','Ionized calcium and total calcium are interchangeable','The PT directly determines serum calcium concentration'],answer:0,explain:'Only the ionized fraction is directly bioactive. Interpret iCa with pH, sample handling and the clinical patient; verify with local analyzer intervals.'},
 {id:'fructosamine',kind:'sendout',icon:'🍬',name:'Fructosamine send-out',sample:'Serum sent to a validated reference laboratory; check tube, separation and assay guidance',learn:'Fructosamine represents glycated circulating serum proteins and reflects average glycemia over approximately 1–3 weeks.',why:'Persistent hyperglycemia glycates serum proteins; a short stress-related glucose spike may not raise fructosamine substantially.',pitfall:'Hypoproteinemia, hyperthyroidism, protein turnover and lab method can shift interpretation; not a stand-alone diagnosis.',patient:'🐈 Cat with PU/PD, weight loss and an in-clinic glucose spike during a stressful visit.',result:'Glucose 318 mg/dL (illustrative feline interval ~70–150); fructosamine 240 µmol/L (illustrative lab interval ~190–365).',q:'Which statement best integrates the results?',options:['Fructosamine does not support sustained severe hyperglycemia; correlate with history, glucose trends and urinalysis','A normal fructosamine always excludes diabetes in every cat','A single stressed glucose proves chronic diabetes','Fructosamine measures only the last 15 minutes of glucose'],answer:0,explain:'A normal fructosamine can support stress hyperglycemia, but early diabetes, concurrent illness or altered protein turnover can confound interpretation.'},
 {id:'thyroidcat',kind:'sendout',icon:'🐈',name:'Feline thyroid panel',sample:'Serum total T4 ± free T4 by equilibrium dialysis (fT4-ED) and TSH as appropriate; use validated reference assay',learn:'Total T4 is a common first-line screen for feline hyperthyroidism. Borderline cases may need repeat T4, fT4-ED, TSH or imaging in context.',why:'Excess thyroid hormone increases metabolism and can elevate glomerular filtration while reducing muscle mass, potentially masking renal disease.',pitfall:'Nonthyroidal illness may suppress T4; fT4 can be increased in some euthyroid sick cats, so no single result confirms all cases.',patient:'🐈 14-year-old cat with weight loss despite polyphagia, tachycardia and a palpable thyroid nodule.',result:'Total T4 7.1 µg/dL (illustrative feline interval ~0.8–4.0); creatinine 1.7 mg/dL (illustrative interval ~0.8–2.1).',q:'What is the most defensible interpretation?',options:['Hyperthyroidism is likely; assess blood pressure and renal function before and after treatment','Normal creatinine rules out concurrent chronic kidney disease','A high T4 is explained by euthyroid sick syndrome alone','Feline thyroid disease is reliably diagnosed from TSH alone'],answer:0,explain:'Elevated T4 with characteristic signs supports hyperthyroidism; thyroid correction may reveal previously masked renal dysfunction.'},
 {id:'thyroiddog',kind:'sendout',icon:'🐕',name:'Canine thyroid panel',sample:'Serum for total T4, free T4 (preferably equilibrium dialysis) and canine TSH, with indicated TgAA; check reference laboratory directions',learn:'Canine hypothyroidism requires integration of clinical signs, total T4, fT4 and TSH, with attention to nonthyroidal illness and drug suppression.',why:'Primary thyroid failure generally reduces T4. Pituitary TSH often increases, but a normal TSH does not exclude all hypothyroid dogs.',pitfall:'Glucocorticoids, phenobarbital and systemic illness can lower T4. Do not diagnose solely from low total T4.',patient:'🐕 Middle-aged dog with weight gain, lethargy, recurrent skin disease and hypercholesterolemia; no suppressive drugs.',result:'Total T4 0.4 µg/dL (illustrative canine interval ~1.0–4.0), fT4-ED 0.3 ng/dL (illustrative ~0.8–2.5), TSH 0.95 ng/mL (lab upper reference ~0.5).',q:'Which diagnosis is most supported?',options:['Primary hypothyroidism is supported by compatible signs, low T4/fT4 and elevated TSH','This profile establishes canine hyperthyroidism','An elevated TSH alone means iatrogenic Cushing disease','Low T4 never requires drug or nonthyroidal illness review'],answer:0,explain:'The combined pattern is supportive, but confirm signalment, assay intervals, medications and concurrent illness before prescribing treatment.'}
];
const hybridById=id=>HYBRID_TESTS.find(t=>t.id===id);
function hybridBtn(id,label){return '<button type="button" data-vpqadvanced="'+id+'">'+label+'</button>'}
function hybridHome(){
 hybrid=null;run=null;
 return modal('Hybrid Diagnostics · In-House & Send-Out','<div class="vpqintro hybrid-theme">'+INTRO_STYLE+
 '<div class="introhero"><b>🧬 HYBRID DIAGNOSTIC STATION</b><p>Choose the right test, handle the sample, then interpret a patient result. In-house devices return immediate simulated results; the send-out counter represents a reference-laboratory report. <b>PCV/TS belongs with routine CBC and chemistry testing; no extra full-sized bench is required.</b></p></div>'+PCV_TS_LEARN+
 '<div class="hybridtwo"><section><h3>⚡ In-house rapid testing</h3>'+HYBRID_TESTS.filter(t=>t.kind==='inhouse').map(hybridCard).join('')+'</section><section><h3>📦 Send-Out Laboratory counter</h3>'+HYBRID_TESTS.filter(t=>t.kind==='sendout').map(hybridCard).join('')+'</section></div>'+
 '<p class="tiny">Illustrative simulated patient data. Reference intervals vary by species, testing platform and laboratory. This station does not replace the existing lecture-based thyroid or diabetes questions.</p>'+
 '<div class="introactions">'+hybridBtn('home','← Advanced lab')+'</div></div>');
}
function hybridCard(t){return '<button class="hybridtestcard '+t.kind+'" type="button" data-vpqadvanced="hybrid-'+t.id+'"><b>'+t.icon+' '+esc(t.name)+'</b><span>'+esc(t.learn)+'</span><small>'+ (t.kind==='inhouse'?'⚡ Point-of-care':'📦 Reference-lab order')+'</small></button>'}
function hybridChoiceOrder(id,count){
 const arr=Array.from({length:count},(_,i)=>i);let seed=0;
 for(let i=0;i<id.length;i++)seed=(Math.imul(seed,31)+id.charCodeAt(i))>>>0;
 for(let i=count-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[arr[i],arr[j]]=[arr[j],arr[i]];}
 return arr;
}
function hybridTest(id){
 const t=hybridById(id);if(!t)return hybridHome();
 if(!hybrid||hybrid.id!==id)hybrid={id,stage:0,selected:null};
 const h=hybrid;
 const panel='<div class="vpqintro hybrid-theme">'+INTRO_STYLE+
 '<div class="introhero"><b>'+t.icon+' '+esc(t.name)+'</b><p>'+esc(t.learn)+'</p></div>'+(id==='pcvts'?PCV_TS_LEARN:'')+
 '<div class="hybridtwo"><div class="hybridpanel"><b>🧪 Sample and handling</b><p>'+esc(t.sample)+'</p></div><div class="hybridpanel"><b>🔬 Why the body does this</b><p>'+esc(t.why)+'</p></div></div>'+
 '<details class="gasconcept"><summary>⚠️ Interpretation trap</summary><p>'+esc(t.pitfall)+'</p></details>'+
 '<div class="hybridpatient"><h3>🏥 Patient vignette</h3><p>'+esc(t.patient)+'</p>'+
 (h.stage===0?hybridBtn('hybrid-run',t.kind==='sendout'?'📦 Send sample · View lab return':'⚡ Run point-of-care analyzer'):'<div class="hybridresult"><b>'+(t.kind==='sendout'?'📨 Reference lab report':'📈 Analyzer reading')+'</b><p>'+esc(t.result)+'</p></div>')+
 (h.stage>0?'<h3>'+esc(t.q)+'</h3><div class="hybridanswers">'+hybridChoiceOrder(t.id,t.options.length).map(i=>'<button type="button" data-vpqadvanced="hybrid-answer-'+i+'" '+(h.stage===2?'disabled':'')+' class="'+(h.stage===2?(i===t.answer?'hybridcorrect':i===h.selected?'hybridwrong':''):'')+'">'+esc(t.options[i])+'</button>').join('')+'</div>':'')+
 (h.stage===2?'<div class="hybridfeedback '+(h.selected===t.answer?'good':'bad')+'"><b>'+(h.selected===t.answer?'✓ Correct interpretation':'Review the physiology')+'</b><p>'+esc(t.explain)+'</p></div>':'')+'</div>'+
 '<div class="introactions">'+hybridBtn('hybrid-home','← Test menu')+(h.stage===2?hybridBtn('hybrid-next','Next diagnostic test →'):'')+'</div></div>';
 return modal(t.name+' · Patient Interpretation',panel);
}

const buttons=(mode)=>'<button type="button" data-vpqadvanced="'+mode+'">'+({coag:'🩸 Coagulation Analyzer',gas:'🫧 Blood Gas Analyzer',urine:'🧫 Urinalysis Bench',cases:'🐾 Referral Cases',hybrid:'🧬 Hybrid Diagnostics',home:'← Advanced Lab',hub:'← Reference Map'}[mode]||mode)+'</button>';
function modal(title,body){api.showModal('🔬 '+title,body+'<div class="buttonrow">'+buttons(run?'home':'hub')+'</div>')}
function home(){run=null;modal('Advanced Clinical Pathology · Referral Diagnostics','<p><b>Why this is advanced:</b> routine in-house CBC and chemistry stay in the Treatment Ward. Here you investigate abnormal coagulation, acid–base disorders, urine microscopy and difficult multi-system patient cases.</p><div class="buttonrow">'+buttons('coag')+buttons('gas')+buttons('urine')+buttons('cases')+'<button data-vpqadvanced="fullrounds">🏥 Full Diagnostic Rounds · 5-stage patients</button>'+'<button data-vpqadvanced="classic">🩸 CBC & Chemistry Practice</button>'+'<button data-vpqadvanced="hybrid-pcvts">🩸 Learn PCV + TS · CBC/Chem</button>'+'</div><p class="tiny">Educational simulation; verify species- and method-specific intervals. Referral Cases opens the single guided Referral Patient 001 prototype. No additional cases have been added.</p>')}
function begin(mode){run={mode,pool:banks[mode].slice().sort(()=>Math.random()-.5),i:0,chosen:null,order:null,correct:0};show()}
function start(mode){if(mode==='coag'||mode==='gas')return intro(mode);return begin(mode)}
function show(){const s=run;if(!s)return;const q=s.pool[s.i];if(!q){modal('Advanced station complete','<h3>'+s.correct+' / '+s.pool.length+' correct</h3><p>Review how each laboratory finding changes the clinical decision. First correct mastery earns existing XP; replay is always available.</p>'+buttons(s.mode));return}if(!s.order)s.order=[0,1,2,3].sort(()=>Math.random()-.5);const done=s.chosen!==null;
modal(({coag:'Coagulation Analyzer',gas:'Blood Gas Analyzer',urine:'Urinalysis Bench'})[s.mode]+' · '+(s.i+1)+'/'+s.pool.length,'<h3>'+esc(q.q)+'</h3>'+s.order.map(i=>'<button class="choice '+(done?(i===q.answer?'right':i===s.chosen?'wrong':''):'')+'" data-vpqadvanced-answer="'+i+'" '+(done?'disabled':'')+'>'+esc(q.choices[i])+'</button>').join('')+(done?'<div class="response '+(s.chosen===q.answer?'':'bad')+'"><b>'+(s.chosen===q.answer?'Correct':'Review the physiology')+'</b><p>'+esc(q.why)+'</p></div><button data-vpqadvanced="next">Next →</button>':'<p class="tiny">Interpret the physiology, patient context and assay limitations before choosing.</p>'))}
function init(context){api=context;context.body.addEventListener('click',event=>{const b=event.target.closest('[data-vpqadvanced],[data-vpqadvanced-answer]');if(!b)return;if(b.hasAttribute('data-vpqadvanced-answer')){if(!run||run.chosen!==null)return;run.chosen=Number(b.dataset.vpqadvancedAnswer);const q=run.pool[run.i];if(run.chosen===q.answer){run.correct++;api.awardQuestion?.('advanced-clinpath-'+run.mode,q.id,true)}return show()}const key=b.dataset.vpqadvanced;if(key==='home')return home();if(key==='hub')return window.VPQ_CLINPATH_REFERENCE_HUB?.open?.();if(key==='cases'){const pilot=window.VPQ_CLINPATH_REFERRAL_PILOT;if(pilot&&typeof pilot.home==='function')return pilot.home();if(typeof window.VPQ_OPEN_REFERRAL_PATIENTS==='function')return window.VPQ_OPEN_REFERRAL_PATIENTS();return api.showModal('🔬 Referral Patients','Referral Patient 001 is unavailable. Reload the game and open Advanced Lab again.');}if(key==='fullrounds')return window.VPQ_CLINPATH_DIAGNOSTIC_ROUNDS?.home?.();if(key==='classic')return window.VPQ_TREATMENT_DIAGNOSTICS?.legacyLabHome?.();if(key==='hybrid')return hybridHome();if(key==='hybrid-home')return hybridHome();if(key==='hybrid-run'&&hybrid){hybrid.stage=1;return hybridTest(hybrid.id)}if(key.startsWith('hybrid-answer-')&&hybrid&&hybrid.stage===1){const index=Number(key.split('-').pop());if(!Number.isInteger(index)||index<0||index>3)return;hybrid.selected=index;hybrid.stage=2;return hybridTest(hybrid.id)}if(key==='hybrid-next'&&hybrid){const i=HYBRID_TESTS.findIndex(t=>t.id===hybrid.id),next=HYBRID_TESTS[(i+1)%HYBRID_TESTS.length];hybrid=null;return hybridTest(next.id)}if(key.startsWith('hybrid-')&&hybridById(key.slice(7)))return hybridTest(key.slice(7));if(key==='coag-enlarge')return coagExpanded();if(key==='gas-enlarge')return gasExpanded();if(key==='gas-back')return intro('gas');if(key==='coag-back')return intro('coag');if(key==='begin-coag')return begin('coag');if(key==='begin-gas')return begin('gas');if(key==='next'&&run){run.i++;run.chosen=null;run.order=null;return show()}if(banks[key])return start(key)})}
return Object.freeze({init,home,start,intro,hybridHome,banks,cases});
})();
