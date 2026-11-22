/* Vet Pharm Quest — clinical pathology visual report-reading academy.
   Original diagrammatic teaching, based on course review framework and cited references.
   Do not use illustrative sample values as universal clinical reference intervals.
*/
window.VPQ_CLINPATH_REPORT_ACADEMY=(function(){
'use strict';
let api=null, current='start', reveal={};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S=[
 {id:'start',name:'Start Here · Read a Report',icon:'🧭',accent:'#dceafc'},
 {id:'pcv',name:'PCV / TS & Sample Quality',icon:'🩸',accent:'#fbe5ec'},
 {id:'cbc',name:'Erythrogram & Anemia',icon:'🔴',accent:'#fee9e4'},
 {id:'leuko',name:'Leukogram Patterns',icon:'🦠',accent:'#eee5fa'},
 {id:'platelets',name:'Platelets & Hemostasis',icon:'🟣',accent:'#efe5f7'},
 {id:'chem',name:'Chemistry by Organ System',icon:'🧪',accent:'#e3f0fc'},
 {id:'renal',name:'Renal & Electrolyte Physiology',icon:'🫘',accent:'#e7f3e4'},
 {id:'acid',name:'Blood Gases & Acid–Base',icon:'🫧',accent:'#e3f2f8'},
 {id:'calcium',name:'Calcium / PTH / PTHrP',icon:'🦴',accent:'#f8eaf7'},
 {id:'practice',name:'Guided Report Workups',icon:'🏥',accent:'#eaf4e6'}
];
const sources='<p class="vra-small"><b>Teaching references:</b> user-supplied Clinical Pathology Review Guide, PCV/TP and interpretation infographics; <a href="https://vetgirlontherun.com/veterinary-continuing-education-pcv-tp-big4-vetgirl-blog/" target="_blank" rel="noopener">VETgirl PCV/TP Big 4</a> (external reference); <a href="https://eclinpath.com/hematology/" target="_blank" rel="noopener">Cornell eClinPath Hematology</a>; <a href="https://eclinpath.com/hematology/leukogram-changes/leukogram-patterns/" target="_blank" rel="noopener">Leukogram patterns</a>; <a href="https://eclinpath.com/chemistry/" target="_blank" rel="noopener">Chemistry</a>. Reference ranges depend on species, age, method and lab. The images submitted by the student are learning references, not reproduced here.</p>';
const css='<style>.vra{font-size:15px;font-weight:650;line-height:1.48;max-width:100%}.vra *{box-sizing:border-box}.vra-topicbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:5px 0 11px}.vra-topicbar label{font-size:13px;font-weight:850;color:#375a80}.vra-topicbar select{flex:1 1 260px;min-width:180px;max-width:100%;border:1.5px solid #a9c5e5;border-radius:10px;padding:8px;background:#f7fbff;color:#214975;font-size:14px;font-weight:750}.vra-topicbar button{font-size:13px;padding:7px 9px}.vra-tabs button{flex:0 0 auto;font-size:13px;font-weight:750;padding:7px 9px;border-radius:9px}.vra-tabs button[aria-current=true]{background:#dceafd;border-color:#6385bd}.vra-card{border:1px solid #c6d8ec;border-radius:12px;padding:11px;margin:8px 0;background:#fcfdff}.vra-card p{margin:5px 0}.vra-card h3{font-size:16px;margin:0 0 6px}.vra-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px}.vra-grid .vra-card{margin:0}.vra ol,.vra ul{padding-left:22px;margin:8px 0}.vra li{margin:5px 0}.vra details{border:1px solid #d3e0ee;border-radius:11px;margin:8px 0;padding:6px 10px;background:#fff}.vra summary{cursor:pointer;font-size:15px;font-weight:800;padding:5px}.vra table{border-collapse:collapse;width:100%;font-size:14px;font-weight:600}.vra th{background:#dfeafa}.vra td,.vra th{padding:7px;border-bottom:1px solid #dbe5f0;text-align:left;vertical-align:top}.vra-scroll{overflow-x:auto}.vra-arrow{font-weight:900;color:#3163a8}.vra-small{font-size:12px;color:#54647c}.vra-kicker{background:#e9f4ff;padding:9px;border-radius:9px}.vra-menu{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}.vra-menu button{text-align:left;min-height:65px;font-size:13px}.vra-table-red th{background:#fbe5ea}.vra-table-green th{background:#e2f3e4}.vra-good{border-left:4px solid #3d9967;background:#eaf7ed}.vra-caution{border-left:4px solid #d59c38;background:#fff7e6}.vra-step{display:flex;gap:9px;align-items:flex-start;margin:6px 0}.vra-num{background:#305fa0;color:white;border-radius:50%;width:24px;height:24px;text-align:center;flex:0 0 24px;font-weight:900}.vra-btns{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.vra-btns button{font-size:13px;padding:7px 10px}.vra-choice{display:block;width:100%;margin:5px 0;text-align:left}.vra-result{padding:9px;border-radius:9px;background:#e7f5eb}.vra-wrong{background:#fff0d8}</style>';
const row=(a,b)=>'<div class="vra-step"><span class="vra-num">'+a+'</span><div>'+b+'</div></div>';
const card=(title,body,cls='')=>'<section class="vra-card '+cls+'"><h3>'+title+'</h3>'+body+'</section>';
const detail=(name,body,open=false)=>'<details '+(open?'open':'')+'><summary>'+name+'</summary>'+body+'</details>';
const table=(head,rows,cls='')=>'<div class="vra-scroll"><table class="'+cls+'"><thead><tr>'+head.map(v=>'<th>'+v+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(v=>'<td>'+v+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
const link=(id,text)=>'<button type="button" data-vpq-report="'+id+'">'+text+'</button>';
const refNote='<p class="vra-small"><b>Intervals shown in examples are course/example-specific only.</b> Never assume they apply to all species or analyzers. Compare every reported number to the patient report’s printed reference interval before classifying ↑ / ↓ / normal.</p>';
function pcvDiagram(){
 let s='<svg viewBox="0 0 680 186" style="width:100%;max-height:190px" role="img" aria-label="Original schematic of microhematocrit tubes with plasma appearance: clear, pink hemolysis, yellow icterus and milky lipemia">';
 const configs=[['Clear','#f3fafb','Normal appearance'],['Pink','#fac0cc','Hemolysis'],['Yellow','#fbe887','Icterus'],['Milky','#ececf0','Lipemia']];
 configs.forEach((d,i)=>{const x=55+i*168;s+='<g><rect x="'+x+'" y="25" width="40" height="126" rx="4" fill="#fff" stroke="#7695ad" stroke-width="3"/><rect x="'+(x+4)+'" y="28" width="32" height="54" fill="'+d[1]+'"/><rect x="'+(x+4)+'" y="82" width="32" height="7" fill="#e9e6cc"/><rect x="'+(x+4)+'" y="89" width="32" height="58" fill="#db3947"/><text x="'+(x+20)+'" y="17" text-anchor="middle" fill="#35577d" font-size="13" font-weight="700">'+d[0]+'</text><text x="'+(x+20)+'" y="168" text-anchor="middle" fill="#35577d" font-size="12">'+d[2]+'</text></g>';});
 return s+'</svg>';
}
function start(){
 return card('👩‍⚕️ Start from ZERO · What is clinical pathology?',
 '<p><b>Clinical pathology</b> means using samples—blood, urine and other fluids—to answer what is happening inside a patient. You are not memorizing a disease from a single number. You are learning to identify abnormal patterns, explain the mechanism and choose a next test.</p>'+
 '<div class="vra-grid">'+
 card('🩸 CBC = WHO is in the blood?','<p><b>RBC / HCT / hemoglobin:</b> oxygen delivery and anemia. <b>WBC + differential:</b> inflammation, immune or stress response. <b>Platelets:</b> primary clot formation. A smear checks cell shape and machine errors.</p>')+
 card('🧪 Chemistry = WHAT are organs doing?','<p>Kidney waste markers, liver leakage/cholestasis, proteins, glucose and electrolytes. <b>ALT ↑ means injury signal, not proof the liver has stopped working.</b> Combine values, organ physiology and urine results.</p>')+
 card('🩸 PCV/TS = FAST check','<p><b>PCV</b> = fraction of blood made up of red cells after spinning. <b>TS</b> = total dissolved solids (mostly protein) measured in separated plasma. Their combined trends help distinguish concentration, loss and dilution.</p>')+
 card('🔬 Follow-up tests = WHAT question remains?','<p>Blood gas: acid–base status; lactate: production/clearance; ACTH stimulation: adrenal cortisol reserve; thyroid testing: endocrine feedback; UA: urine concentration, sediment and protein loss. Choose based on your differential.</p>')+
 '</div>'+
 '<div class="vra-btns">'+link('cbc','Read your first CBC')+link('chem','Read chemistry')+'<button type="button" data-vpq-report-action="inhouse">Choose in-house tests</button><button type="button" data-vpq-report-action="sendout">Choose send-out tests</button></div>','vra-good')+
 detail('🧴 Sample tubes and WHY handling changes your interpretation',
 table(['Specimen','Common use','What can go wrong'],[
 ['EDTA whole blood (purple)','CBC, blood smear, spun PCV','Clots remove cells; delay distorts morphology; EDTA contamination can falsely ↑ K and ↓ calcium in chemistry.'],
 ['Serum (red/gold as validated)','Many chemistry and hormone send-outs','Allow appropriate clotting, then separate; delay can lower glucose; lipemia/hemolysis can interfere.'],
 ['Heparinized blood / plasma','Point-of-care gases/chemistry as validated','Air exposure changes CO₂ and pH; too much liquid heparin dilutes some analytes.'],
 ['Citrate (blue; correct fill)','PT/aPTT and coagulation testing','Underfilling adds excess citrate relative to blood, falsely prolonging clot times.'],
 ['Fresh urine','USG, dipstick, sediment, UPC if appropriate','Delay creates artifacts; collection method and active sediment change protein/bacteria interpretation.']
 ]),true)+
 detail('📏 How to read ANY numerical result: a beginner example',
 '<p><b>Step 1:</b> identify patient species and the printed reference interval (RI). <b>Step 2:</b> compare with the SAME units. <b>Step 3:</b> call it increased (↑), decreased (↓) or within range. <b>Step 4:</b> explain the organ/cell mechanism and decide what would confirm it.</p>'+
 '<p><b>Illustrative dog:</b> PCV <b>25%</b>, lab RI <b>37–55%</b> → <b>DECREASED</b> → anemia. Is the marrow responding? Look at <b>absolute reticulocytes</b>. Does TS decrease too? Consider blood/protein loss and hydration. One low PCV does not reveal the cause.</p>'+
 '<p><b>Important:</b> even if the result is within the RI, a large change from the patient’s baseline can be meaningful. Different species, breeds and analyzer methods have different ranges.</p>',true)+
 card('🔁 The workflow you will repeat on every patient',
 '<p><b>Patient + sample quality → find ↑/↓ → classify CBC/chemistry patterns → WHY the body produced them → rank competing diagnoses → pick ancillary test → reassess.</b></p>'+
 '<p>Example: low PCV + high absolute reticulocytes = regenerative anemia; the next question is bleeding or destruction, not “which random drug?”</p>')+
 card('🧭 The routine EVERY time','<p>Before guessing a disease, read the data in the same order used in your course: <b>quality → erythrogram → platelets → leukogram → protein → chemistry/urine → mechanisms → prioritized differential and plan.</b></p>','vra-good')+
 '<div class="vra-grid">'+[
 ['1','Check sample first','Species, age, collection tube, timing, hemolysis, lipemia, icterus, platelet clumps and lab reference ranges.'],
 ['2','Erythrogram','Anemia vs erythrocytosis; MCV and MCHC; absolute reticulocytes; RBC morphology.'],
 ['3','Platelets','Thrombocytopenia or thrombocytosis; verify clumps, especially in cats.'],
 ['4','Leukogram','Total WBC, <b>absolute</b> differential, segmented neutrophils, bands, toxic change and other cell lines.'],
 ['5','PCV + plasma protein','Pair PCV and TS/TP with hydration, hemorrhage, protein production and loss.'],
 ['6','Chemistry + urinalysis','Group by organ physiology: injury ≠ function; water, ions, liver, kidney, endocrine, glucose.'],
 ['7','Interpret and plan','State DATA → ASSESSMENT (classified pattern) → prioritized DIFFERENTIALS → next confirmatory test.']
 ].map(x=>card(x[0]+' · '+x[1],'<p>'+x[2]+'</p>')).join('')+'</div>'+
 card('🩺 Example: translate a report into language','<p><b>Data:</b> HCT low, MCV normal, MCHC normal, absolute reticulocytes not increased. <b>Assessment:</b> normocytic, normochromic, currently nonregenerative anemia. <b>Top categories:</b> inflammation, renal/EPO deficiency, marrow causes or early pre-regenerative anemia. <b>Plan:</b> determine duration, kidney profile, smear, history and clinical context.</p>')+
 '<div class="vra-btns">'+link('cbc','Start with CBC →')+link('leuko','Leukogram walkthrough →')+link('practice','Try a report →')+'</div>';
}
function pcv(){
 return card('🩸 Microhematocrit: how the tube reads','<p><b>Spun tube, bottom → top:</b> packed erythrocytes (PCV%), thin buffy coat (WBCs + platelets), plasma (color and refractometer sample). Do not count the buffy coat as RBC volume.</p>'+pcvDiagram())+
 detail('🔬 PCV / TS / TP: technique, units and interpretation','<ol><li>Mix anticoagulated blood, fill and seal microhematocrit tube.</li><li>Centrifuge as prescribed; measure RBC column ÷ total blood column × 100 = <b>PCV %</b>.</li><li>Observe plasma for yellow icterus, pink/red free hemoglobin or cloudiness/lipemia.</li><li>Use plasma on a calibrated refractometer to estimate <b>TS/TP in g/dL</b>; the reading is influenced by non-protein solids, especially when abnormal.</li><li>Compare with CBC analyzer HCT and chemistry protein. Automated HCT is derived from RBC count and MCV; spun PCV is directly measured.</li></ol><p><b>Why:</b> RBC fraction reflects cells relative to plasma water; TS reflects dissolved material dominated by protein. Paired readings tell a different story from either alone.</p>',true)+
 detail('📈 Read PCV + TS together',table(['PCV','TS','Physiologic interpretation'],[['↑','↑','Hemoconcentration/dehydration (less plasma water).'],['↑','Normal','Splenic contraction or absolute erythrocytosis; hydration may mask changes.'],['↓','↓','Hemorrhage, fluid dilution or combined RBC/protein loss; acute bleeding may initially be normal.'],['↓','Normal','RBC destruction or low production, also chronic blood loss and mixed processes.'],['↓','↑','Anemia with inflammatory globulins or neoplasia; dehydration can mask severity.'],['Normal','↓','Protein loss, reduced synthesis or dilution; investigate urine/GI/liver.']],'vra-table-red'))+
 card('⚠️ Sample color is not a diagnosis','<p><b>Pink/red plasma:</b> free hemoglobin from intravascular hemolysis OR in-vitro collection damage. <b>Yellow:</b> bilirubin/icterus. <b>Milky:</b> lipids, commonly triglycerides/chylomicrons. These can affect refractometer and chemistry accuracy.</p>','vra-caution')+
 card('🏥 Course patient','<p>Dog with vomiting and dehydration: HCT <b>62% (RI 40–56)</b> and TPP <b>8.0 g/dL (RI 6.0–7.8)</b>. Both <b>INCREASED</b> → hemoconcentration, relative erythrocytosis; dehydration is supported by history/exam. Recheck after fluids.</p>')+refNote;
}
function cbc(){
 return card('🔴 Erythrogram: ask three questions','<p><b>1.</b> Is RBC mass low or high? (HCT/PCV, RBC, hemoglobin.) <b>2.</b> Are cells small/large and hypochromic? (MCV, MCHC, RDW, smear.) <b>3.</b> Is marrow responding? (absolute reticulocytes and polychromasia.)</p>')+
 detail('📏 CBC indices / equations',table(['Result','What it tells you','Course calculation / why'],[
 ['HCT / PCV','Fraction of blood occupied by RBCs','Electronic HCT (%) = RBC (10⁶/µL) × MCV (fL) ÷ 10; spun PCV measured directly.'],
 ['MCV','Average RBC volume','MCV (fL) = HCT (%) × 10 ÷ RBC (10⁶/µL). ↑ macrocytic; ↓ microcytic.'],
 ['MCH','Hemoglobin amount per RBC','MCH (pg) = Hb (g/dL) × 10 ÷ RBC (10⁶/µL); usually less useful.'],
 ['MCHC','Hemoglobin concentration inside packed RBCs','MCHC (g/dL) = Hb × 100 ÷ HCT. ↑ is usually artifact; ↓ suggests hypochromia.'],
 ['RDW','Variation in RBC size','↑ anisocytosis, e.g., regeneration or iron deficiency.'],
 ['Absolute reticulocytes','Current marrow regenerative response','RBC count × reticulocyte fraction; use absolute, not only %; species-specific interpretation.']
 ]),true)+
 detail('📈 Compare RBC patterns',table(['Pattern','Likely mechanism','What separates alternatives'],[
 ['MCV ↑ / MCHC ↓ / retics ↑','Regenerative anemia after hemolysis or hemorrhage','TS, bilirubin, smear, bleeding signs; timing matters.'],
 ['MCV ↓ / MCHC ↓','Chronic iron restriction, commonly chronic blood loss','Iron panel, ferritin, history, gastrointestinal/parasite losses.'],
 ['MCV normal / MCHC normal / retics not ↑','Currently nonregenerative anemia','Inflammation, renal EPO deficiency, marrow disease, or too early for response.'],
 ['MCHC ↑','Commonly analytic artifact, not true hyperchromia','Check lipemia, hemolysis, Heinz bodies or agglutination.'],
 ['HCT ↑ / TP ↑','Relative erythrocytosis from dehydration','Recheck volume status and values after treatment.']
 ]))+
 card('🐈 Species differences you cannot skip','<p><b>Cats:</b> aggregate reticulocytes track recent response, punctate persist longer. <b>Horses:</b> no appreciable circulating reticulocyte response despite anemia; use marrow/clinical trends. <b>Ruminants:</b> reticulocyte response can be limited or slow. Use species/breed lab ranges (sighthounds and Asian dog breeds differ).</p>')+
 card('🧮 Course reticulocyte example','<p>Anemic dog: RBC <b>2.3 × 10⁶/µL</b>, reticulocytes <b>3%</b> → <b>69,000/µL</b>. Healthy dog: RBC <b>6.9 × 10⁶/µL</b>, reticulocytes <b>1%</b> → also <b>69,000/µL</b>. <b>Why:</b> a high percentage is not proof of an adequate marrow response to severe anemia.</p>')+refNote;
}
function leuko(){
 return card('🦠 Leukogram · read this in order',[
 'Total WBC ↑/↓?', 'Correct WBC if significant nRBC interference', 'Use ABSOLUTE counts, never percentages alone','Neutrophils: ↑/↓ and bands?', 'Toxic cytoplasm?','Lymphocytes → monocytes → eosinophils → basophils','Integrate species, age, drugs, stress and patient findings'
 ].map((x,i)=>row(i+1,x)).join(''))+
 detail('📊 Pattern comparison: what rises and what falls',table(['Pattern','Expected direction','WHY / differentiator'],[
 ['Epinephrine / physiologic','Neutrophils ↑; lymphocytes ↑ or normal','Demargination/redistribution; especially excited cats and horses; no left shift or toxic change.'],
 ['Corticosteroid / stress','Mature neutrophils ↑; lymphocytes ↓; eosinophils ↓; monocytes often ↑ in dogs','Cortisol changes trafficking; typically no major left shift or toxicity.'],
 ['Acute inflammation','Neutrophils ↑ or ↓; bands ↑; toxic change possible','Demand and marrow release; a low count does not rule out severe inflammation.'],
 ['Overwhelming inflammation','Neutrophils ↓, immature > mature; marked toxicity possible','Demand exceeds reserves; degenerative left shift is especially concerning.'],
 ['Chronic inflammation','Neutrophils ↑, sometimes monocytes ↑; left shift may be minimal','Sustained production/tissue inflammatory demand.'],
 ['Marrow production failure','Neutrophils ↓ with little/no left shift','Reduced production from drugs, infection, infiltrative disease or aplasia.']
 ]),true)+
 card('🔬 LEFT vs RIGHT · not the same','<div class="vra-grid">'+card('⬅️ Left shift','<p><b>Young / immature neutrophils</b> (bands, metamyelocytes). Regenerative: mature outnumber immature. Degenerative: immature outnumber mature; serious inflammatory demand.</p>')+card('➡️ Right shift','<p><b>Old / hypersegmented neutrophils</b>. Consider glucocorticoids, prolonged circulating time or old sample; distinguish from toxic inflammation.</p>')+'</div>')+
 detail('Cell-by-cell interpretation',table(['Cell type','↑ Increased','↓ Decreased'],[
 ['Neutrophils','Inflammation, stress, epinephrine, neoplasia','Overwhelming consumption, margination/shock, marrow production failure'],
 ['Lymphocytes','Epinephrine, antigenic stimulation, lymphoid neoplasia','Cortisol/stress, viral illness, immunosuppression'],
 ['Monocytes','Chronic inflammation; glucocorticoids in dogs','Often limited clinical significance'],
 ['Eosinophils','Parasites, hypersensitivity, certain neoplasms','Cortisol / stress'],
 ['Basophils','Parasites, hypersensitivity, sometimes with eosinophilia','Often not clinically meaningful']
 ]))+
 detail('🧮 Use absolute leukocyte counts', '<p><b>Absolute count (cells/µL) = WBC (cells/µL) × percentage ÷ 100.</b> Example: WBC 10,000/µL and 60% segmented neutrophils → 6,000 segmented neutrophils/µL. If an instrument counts nRBC as WBC, course formula: <b>Corrected WBC = measured WBC × 100 ÷ (100 + nRBC per 100 WBC)</b>.</p>')+
 card('⚠️ Don’t confuse','<p>Pelger–Huët hyposegmentation can resemble a left shift, but chromatin/cytoplasm and clinical context differ. Left shift is <b>immature neutrophils</b>; toxic change is a <b>cytoplasmic maturation/activation pattern</b>; they often coexist but neither is synonymous with the other.</p>','vra-caution');
}
function platelets(){
 return card('🟣 Platelets first: is the count real?','<p>Check sample clotting, platelet clumps (especially cats), smear estimate and analyzer flags. A falsely low machine platelet count can lead to the wrong diagnosis.</p>')+
 table(['Finding','Interpretation','What to check'],[
 ['Platelets ↓','Production failure, destruction, consumption, sequestration, dilution or clumping','Smear clumps; bleeding pattern; CBC other lines, PT/aPTT when indicated'],
 ['Platelets ↑','Reactive inflammation, iron deficiency, splenic effects, myeloproliferative causes','Clinical pattern and trend'],
 ['MPV ↑','Large platelets may suggest marrow response; storage/clumps also raise MPV','Species-specific analyzer and slide'],
 ['Petechiae/mucosal bleeding','Often primary hemostatic/platelet disorders','Platelet count, platelet function, vWF depending on context'],
 ['Deep hematomas/cavitary bleeding','Often coagulation factor disorders','PT, aPTT, fibrinogen and other directed tests']
 ])+
 card('📘 PT vs aPTT','<p>PT evaluates extrinsic/common pathway; aPTT intrinsic/common pathway. Citrate sample must have correct fill volume; underfill can falsely prolong results. Neither evaluates all platelet disorders.</p>')+
 '<div class="vra-btns">'+link('extra','Additional tests →')+'</div>';
}
function chem(){
 return card('🧪 Chemistry: read by BODY SYSTEM','<p>Organ enzymes are often indicators of <b>cell injury, leakage or enzyme induction</b>. They are not interchangeable with <b>functional capacity</b>. Combine chemistry with urinalysis, CBC, PCV/TS, physical exam and medications.</p>')+
 detail('📊 Main chemistry categories',table(['Panel','Read first','What ↑ or ↓ means / WHY'],[
 ['Kidney','BUN, creatinine, SDMA, USG, phosphorus','Azotemia: prerenal, renal or postrenal. Urine concentration + hydration help separate.'],
 ['Hepatocellular injury','ALT, AST, SDH (species dependent)','↑ suggests leakage/injury; AST can be muscular, so evaluate CK.'],
 ['Cholestasis','ALP, GGT, bilirubin','↑ suggests altered bile handling or induction; compare species (dogs have steroid ALP).'],
 ['Liver function','Albumin, glucose, BUN, cholesterol, bile acids, ammonia, coagulation','↓ synthesis or altered clearance may suggest impaired function; integrate multiple values.'],
 ['Muscle','CK and AST','CK rises and falls rapidly; AST may remain high longer and also reflects liver.'],
 ['Protein balance','TP, albumin, globulins, A:G','Albumin ↓ affects oncotic pressure; globulins ↑ reflect immune proteins / inflammation / neoplasia or concentration.'],
 ['Endocrine / metabolism','Glucose, cholesterol, ketones','Hyperglycemia may be stress or diabetes; glucosuria/ketones/fructosamine add context.'],
 ['Electrolytes / minerals','Na, K, Cl, TCO₂, Ca, phosphorus, Mg','Water, membranes, acid-base, albumin and GFR link results.']
 ]),true)+
 card('🏥 What to write in a liver report','<p><b>Hepatocellular injury?</b> ALT/AST (species limits). <b>Cholestasis?</b> ALP/GGT/bilirubin. <b>Function?</b> glucose, albumin, BUN, cholesterol, bile acids and coagulation. <b>WHY:</b> injured cells leak enzymes even if most of the organ still functions.</p>')+
 detail('📉 Common sample artifacts',table(['Artifact','Potential misleading result','Response'],[['Hemolysis','Potassium, enzymes and colorimetric assays may be affected; magnitude species/method dependent','Review sample and recollect if necessary'],['Lipemia','Optical interference; pseudovalue risks','Assess sample and analyzer guidance'],['EDTA contamination','Can cause artifactual hyperkalemia and hypocalcemia in affected assays','Correct draw order and tube technique'],['Delayed separation','Glucose may decrease due to cellular consumption','Process promptly']]))+
 '<div class="vra-btns">'+link('renal','Go to renal physiology →')+link('calcium','Calcium physiology →')+'</div>';
}
function renal(){
 return card('🫘 Kidney physiology: what is the patient failing to do?','<p><b>Prerenal</b> = poor perfusion with preserved intrinsic kidney concentration if able. <b>Renal</b> = kidney damage/dysfunction. <b>Postrenal</b> = obstruction/rupture. The same creatinine can arise from different processes.</p>')+
 detail('Polyuric vs oliguric/anuric patterns',table(['Feature','Polyuric kidney dysfunction','Oliguric / anuric dysfunction'],[
 ['Urine production','↑ volume; loss of concentrating ability','↓ or no output'],
 ['USG','May be inappropriately low for volume status','Variable; cannot diagnose simply by USG'],
 ['K⁺','May ↓ due to urinary losses, low intake','May ↑ due to impaired excretion; clinically urgent'],
 ['BUN / creatinine','↑ if GFR reduced','↑ if GFR reduced; trend and timing matter'],
 ['Acid–base','Metabolic acidosis possible','Metabolic acidosis possible, especially with retained acids']
 ]),true)+
 card('💧 Why potassium patterns change','<p><b>Polyuria:</b> urine losses plus poor intake can reduce total-body potassium. <b>Oliguria/anuria:</b> reduced renal K excretion can raise blood K, with arrhythmia risk. These are tendencies, not absolute rules.</p>')+
 card('🧪 Chloride follows WATER until it does not','<p>Na concentration follows water balance; compare chloride relative to sodium. <b>Corrected Cl = measured Cl × (normal Na ÷ patient Na)</b>. Selective chloride loss supports alkalosis in appropriate context; relative chloride excess often accompanies normal-AG metabolic acidosis.</p>')+
 '<div class="vra-btns">'+link('acid','Acid–base sequence →')+'</div>';
}
function acid(){
 return card('🫧 FIRST pH · THEN everything else','<p><b>pH is the NET RESULT of the situation and MUST be read first.</b> Identify acidemia, alkalemia or a pH within the interval. Then ask whether pCO₂ (lungs) or HCO₃⁻ (metabolic/kidney) explains the direction. Only then judge compensation and causes. A normal pH does not rule out a mixed disorder.</p>','vra-good')+
 table(['Primary process','Change','Direction of pH','Body response'],[
 ['Metabolic acidosis','HCO₃⁻ ↓','pH ↓','Ventilation ↑ → pCO₂ ↓'],
 ['Metabolic alkalosis','HCO₃⁻ ↑','pH ↑','Ventilation may ↓ → pCO₂ ↑, limited by oxygen needs'],
 ['Respiratory acidosis','pCO₂ ↑','pH ↓','Kidney HCO₃⁻ retention / acid excretion over time'],
 ['Respiratory alkalosis','pCO₂ ↓','pH ↑','Kidney excretes more HCO₃⁻ over time']
 ])+
 detail('🧮 Calculations · your course Na + K equation','<p><b>Anion gap = (Na⁺ + K⁺) − (Cl⁻ + HCO₃⁻)</b>. Increased AG in metabolic acidosis suggests unmeasured anions (lactate, ketones, uremic acids, selected toxins). A normal AG can accompany bicarbonate loss with relative hyperchloremia. Negative or very low AG suggests albumin effects, unmeasured cations or analyzer interference (e.g. bromide falsely measured as Cl).</p><p><b>Corrected Cl = measured Cl × (normal Na ÷ measured Na)</b>. The course example is Cl 112 × (Na midpoint 148.5 ÷ measured Na 142) ≈ 117 mmol/L, above its stated Cl interval 107–115.</p><p><b>Henderson–Hasselbalch:</b> pH = 6.1 + log₁₀ [HCO₃⁻ ÷ (0.03 × pCO₂)] (pCO₂ in mmHg); conceptual relationship: ↑ CO₂ lowers pH, ↑ bicarbonate raises pH.</p>',true)+
 detail('⚠️ Handling direction of change',table(['Sample issue','Trend','Why'],[['Air exposure','pCO₂ tends ↓, pH ↑; pO₂ moves toward room air and may ↑ or ↓','Gas equilibrates with ambient air'],['Delayed analysis','pO₂ tends ↓, pCO₂ ↑, pH ↓','Cells continue metabolic oxygen use and CO₂ generation'],['Excess liquid heparin','Some gases/electrolytes diluted','Anticoagulant:sample ratio'],['Venous vs arterial','Venous oxygen tension differs','Do not use venous pO₂ to determine arterial oxygenation']] ))+
 '<div class="vra-btns">'+link('practice','Try acid–base workup →')+'</div>';
}
function calcium(){
 return card('🦴 NORMAL: low iCa activates PTH','<p><b>Ionized calcium ↓ → parathyroid chief cells release PTH.</b> PTH increases Ca mobilization from bone, promotes renal Ca reabsorption and reduces renal phosphate reabsorption (phosphaturia). By increasing renal calcitriol synthesis it can increase intestinal Ca absorption. When iCa normalizes, negative feedback reduces PTH.</p>','vra-good')+
 card('🚨 ABNORMAL: malignancy-related PTHrP','<p><b>Tumor secretes PTH-related peptide → PTH receptor stimulation</b>, increasing bone resorption, renal Ca retention and phosphaturia even though calcium is already high. <b>Endogenous PTH should be suppressed</b> by hypercalcemia. Effects on calcitriol can differ from PTH; serum phosphorus may be low/normal.</p>','vra-caution')+
 detail('Compare normal regulation vs PTHrP',table(['Feature','Physiologic PTH','PTHrP malignancy'],[
 ['Trigger','Low ionized Ca','Tumor peptide secretion'],
 ['Feedback','Negative feedback controlled','Tumor escapes normal PTH feedback'],
 ['Endogenous PTH','↑ appropriately when calcium is low','Typically suppressed when calcium is high'],
 ['Calcium','Returns toward normal','Inappropriately high'],
 ['Phosphorus','Often lower due to phosphaturia','Can be low/normal; renal status modifies'],
 ['Interpretation','Homeostasis','Humoral hypercalcemia of malignancy is a differential']
 ]),true)+
 card('🧪 Send-out workup','<p>Confirm calcium abnormality using ionized calcium when appropriate, assess albumin and renal function, then interpret <b>PTH together with iCa</b>; PTHrP can support humoral hypercalcemia of malignancy in context. High Ca with inappropriately normal/high PTH supports primary hyperparathyroidism. Neither test alone replaces clinical workup.</p>')+
 '<div class="vra-btns">'+link('extra','Send-out tests →')+'</div>';
}
function extra(){
 return card('⚡ Additional diagnostics · One location for every test','<p>The <b>CBC/Chemistry workstation</b> contains the single full reference for ACTH stimulation, dexamethasone suppression, thyroid testing, lactate, ionized calcium, urinalysis, coagulation and send-outs. Open the relevant category there rather than studying another abbreviated version here.</p>')+
 '<div class="vra-btns"><button data-vpq-report-action="inhouse">⚡ Go to In-house Tests</button><button data-vpq-report-action="sendout">📦 Go to Send-Out Tests</button><button data-vpq-report-action="classic">← CBC/Chemistry Workstation</button></div>';
}
const challenges=[
 {id:'a',title:'Case A · anemia or sample artifact?',species:'Dog',data:[['HCT','24%','37–55%'],['Reticulocytes','220 × 10³/µL','Use lab-specific interval'],['TS','6.8 g/dL','6.0–8.0 g/dL'],['Bilirubin','2.4 mg/dL','0.1–0.5 mg/dL']],q:'Which interpretation should lead your problem list?',opts:['Regenerative anemia; investigate RBC destruction vs blood loss','Healthy CBC; no problem','Primary thrombocytopenia proven','Pure renal failure established'],answer:0,why:'Low HCT = anemia, increased absolute reticulocytes supports marrow response, normal TS and elevated bilirubin raise suspicion for hemolysis. Verify smear, sample hemolysis, bleeding and causes; bilirubin is not specific.'},
 {id:'b',title:'Case B · acid–base first step',species:'Cat',data:[['pH','7.24','7.35–7.45 (illustrative)'],['pCO₂','25 mmHg','35–45 mmHg (illustrative)'],['HCO₃⁻','11 mmol/L','18–24 mmol/L (illustrative)'],['Lactate','5.1 mmol/L','0.5–2.5 mmol/L (illustrative)']],q:'Where do you start and what does the pattern support?',opts:['Read low pH first: acidemia, low bicarbonate explains primary metabolic acidosis, low CO₂ suggests respiratory response','Low CO₂ means primary alkalosis regardless of pH','Normal pH means compensation is complete','Lactate alone diagnoses sepsis'],answer:0,why:'pH establishes net acidemia. Decreased HCO₃⁻ supports metabolic acidosis. Decreased pCO₂ fits respiratory compensation; calculate expected compensation and anion gap with electrolytes, then interpret lactate.'},
 {id:'c',title:'Case C · leukogram pattern',species:'Dog',data:[['Total WBC','21 × 10³/µL','6–17 × 10³/µL (illustrative)'],['Segmented neutrophils','17 × 10³/µL','3–11.5 × 10³/µL (illustrative)'],['Lymphocytes','0.5 × 10³/µL','1–4.8 × 10³/µL (illustrative)'],['Bands','0','0–0.3 × 10³/µL (illustrative)']],q:'Which pattern is most consistent with these absolute counts?',opts:['Glucocorticoid/stress leukogram is possible; interpret patient and eosinophils','Degenerative left shift established','Epinephrine response proven because lymphocytes decrease','Myeloid leukemia is certain'],answer:0,why:'Mature neutrophilia and lymphopenia without bands are compatible with a stress/cortisol leukogram. Compare eosinophils, monocytes, meds, clinical signs and trends. No single pattern establishes a diagnosis.'}
,
 {id:'d',title:'Case D · PCV/TP fluid shift',species:'Dog',data:[['PCV','61%','37–55% (illustrative)'],['TS','8.8 g/dL','6.0–8.0 g/dL (illustrative)'],['Albumin','4.2 g/dL','2.6–4.0 g/dL (illustrative)']],q:'What mechanism best explains the direction of all three measurements?',opts:['Plasma volume contraction can concentrate RBCs and proteins together','Absolute erythrocytosis proven with no change in plasma water','Primary destruction of erythrocytes','Increased reticulocytes alone account for high TS'],answer:0,why:'PCV, TS and albumin are all increased. The parallel trend supports hemoconcentration from reduced plasma water. Recheck hydration and compare after fluid correction; other processes could coexist.'},
 {id:'e',title:'Case E · deceptive leukogram percentages',species:'Cat',data:[['Total WBC','1.9 × 10³/µL','5.5–19.5 × 10³/µL (illustrative)'],['Neutrophils','40%','Absolute differential needed'],['Lymphocytes','33%','Absolute differential needed'],['Eosinophils','27%','Absolute differential needed']],q:'What must be interpreted before describing neutrophils as normal?',opts:['Calculate absolute neutrophils: 0.40 × 1,900 = 760/µL, a marked neutropenia','A 40% proportion proves neutrophilia','Ignore low total WBC because differential percentages sum to 100','Calculate PCV from leukocyte percentages'],answer:0,why:'A plausible percentage can conceal a profoundly abnormal absolute count when WBC is low. The absolute neutrophil count is 760/µL. Examine for inflammatory consumption, production failure and sample integrity.'},
 {id:'f',title:'Case F · hyperkalemia with decreased urine output',species:'Dog',data:[['Creatinine','4.6 mg/dL','0.5–1.8 mg/dL (illustrative)'],['K⁺','7.0 mmol/L','3.5–5.1 mmol/L (illustrative)'],['Urine output','0.3 mL/kg/h','Clinical output category; assess timing and fluid state'],['pH','7.28','7.35–7.45 (illustrative)']],q:'What is the physiologic concern?',opts:['Severely decreased kidney excretion may contribute to marked hyperkalemia with urgent cardiac risk; assess obstruction and AKI','Polyuric potassium wasting must explain elevated K','High potassium confirms primary hyperaldosteronism','Normal renal function because urine is still present'],answer:0,why:'Azotemia plus oliguria raises concern for impaired excretion, including renal or postrenal mechanisms. K at 7.0 mmol/L can be emergent; verify sample, ECG and patient status. Acid-base changes may also influence distribution.'},
 {id:'g',title:'Case G · potassium bromide artifact',species:'Dog receiving potassium bromide',data:[['Na⁺','150 mmol/L','145–152 mmol/L (course example)'],['K⁺','5.1 mmol/L','3.5–5.1 mmol/L (illustrative)'],['Cl⁻','153 mmol/L','107–115 mmol/L (course example)'],['HCO₃⁻','24 mmol/L','18–24 mmol/L (illustrative)']],q:'Calculate the course anion gap (Na+K)−(Cl+HCO₃). What is the best explanation?',opts:['−21.9 mmol/L; suspect chloride analytical interference from bromide before diagnosing a true negative gap','21.9 mmol/L; classic elevated gap ketoacidosis','−21.9 mmol/L; bicarbonate loss is necessarily present','Normal AG, so this is always a normal sample'],answer:0,why:'150 + 5.1 − (153 + 24) = −21.9 mmol/L. This is strikingly negative, not a physiologic acid buildup. With bromide administration, some chloride methods report spuriously high Cl, driving calculated gap down.'},
 {id:'h',title:'Case H · liver injury vs function',species:'Dog',data:[['ALT','420 U/L','10–125 U/L (illustrative)'],['ALP','380 U/L','23–212 U/L (illustrative)'],['Albumin','3.1 g/dL','2.6–4.0 g/dL (illustrative)'],['Glucose','94 mg/dL','70–120 mg/dL (illustrative)']],q:'What can be concluded from these values alone?',opts:['There is enzyme evidence of injury/induction or cholestatic influence, but preserved albumin and glucose do not establish liver failure','ALT above range proves loss of most hepatic functional mass','High ALP proves extrahepatic obstruction','Normal albumin excludes liver disease'],answer:0,why:'ALT is a hepatocellular leakage marker in dogs and ALP may rise with cholestasis or induction. Neither measures liver functional capacity directly. Albumin and glucose currently in range do not rule out important liver disease.'},
 {id:'i',title:'Case I · calcium regulation and tumor peptide',species:'Dog',data:[['Ionized calcium','1.65 mmol/L','1.15–1.33 mmol/L (illustrative)'],['PTH','Suppressed','Appropriate if iCa high'],['PTHrP','Detected','Lab-specific test']],q:'Which mechanism best fits this combined pattern?',opts:['PTH-independent hypercalcemia with tumor-derived PTHrP possible; continue patient cancer workup','Physiologic PTH release due to hypocalcemia','Primary hyperparathyroidism proven by suppressed PTH','Low albumin alone explains increased ionized calcium'],answer:0,why:'High iCa should suppress endogenous PTH. PTHrP can activate some PTH receptor actions and increase Ca despite feedback. This combination supports humoral hypercalcemia of malignancy in context, not a stand-alone diagnosis.'},
 {id:'j',title:'Case J · early hemorrhage timing',species:'Dog after acute trauma',data:[['PCV immediately','45%','37–55% (illustrative)'],['TS immediately','6.8 g/dL','6.0–8.0 g/dL (illustrative)'],['PCV next day','31%','37–55% (illustrative)'],['TS next day','5.4 g/dL','6.0–8.0 g/dL (illustrative)']],q:'Why could immediate PCV and TS be within range after severe hemorrhage?',opts:['Whole blood loss initially removes RBCs and plasma together; fluid redistribution or treatment can then lower concentrations','Normal immediate PCV definitively excludes hemorrhage','Reticulocytes appear immediately within minutes','The centrifuge adds RBCs after trauma'],answer:0,why:'Immediately after bleeding, the RBC:plasma concentration may be little changed; later interstitial fluid shifts and treatment dilute both. Reticulocyte regeneration takes days. Trends, perfusion and exam are essential.'}
];
function practice(){
 const done=challenges.filter((c,i)=>reveal[i]!==undefined).length;
 return card('🏥 Guided report interpretation','<p><b>'+done+' / '+challenges.length+' cases attempted.</b> Expand one patient at a time. Read species, reference intervals and sample quality; classify findings before selecting the strongest physiologic interpretation.</p>')+
 challenges.map((c,i)=>'<details class="vra-case" '+(reveal[i]!==undefined?'open':'')+'><summary>🏥 '+c.title+' · '+c.species+(reveal[i]===undefined?' · Not attempted':reveal[i]===c.answer?' · ✓ Correct':' · Review')+'</summary>'+
 table(['Value','Patient','Reference interval'],c.data)+
 '<p><b>'+c.q+'</b></p>'+
 c.opts.map((option,j)=>(j+i*3+1)%c.opts.length).map((j,k)=>'<button class="vra-choice '+(reveal[i]!==undefined?(j===c.answer?'vra-good':j===reveal[i]?'vra-wrong':''):'')+'" type="button" data-vpq-report-answer="'+i+':'+j+'">'+String.fromCharCode(65+k)+'. '+c.opts[j]+'</button>').join('')+
 (reveal[i]!==undefined?'<div class="vra-result '+(reveal[i]===c.answer?'':'vra-wrong')+'"><b>'+(reveal[i]===c.answer?'✓ Correct interpretation':'Review the physiology')+'</b><p>'+c.why+'</p></div>':'')+
 '<p class="vra-small">Educational example intervals only; compare with the printed patient-specific range.</p></details>').join('')+
 '<div class="vra-btns"><button type="button" data-vpq-report-action="multistage">🏥 Open workups</button>'+link('start','← Report-reading map')+'</div>';
}
const deepData={
 start:[
 ['Reading the minimum database','Review CBC + chemistry + UA (+ ancillary tests). A reliable assessment starts with sample quality, a concise problem list, and prioritized differentials; not a diagnosis from one highlighted value.'],
 ['How to write a case answer','DATA: list ↑/↓ results using supplied RI. ASSESSMENT: name the disturbance and mechanism. PLAN: rank differential categories, choose discriminating tests and specify what would change the ranking.']],
 pcv:[
 ['PCV ≠ electronic HCT','Spun microhematocrit PCV is a physical packed cell measurement; electronic HCT derives from RBC count × MCV. Old blood can swell (MCV ↑, analyzer HCT ↑, MCHC ↓). Agglutination may make analyzer values inconsistent. Compare when values disagree.'],
 ['Important temporal trap','Immediately after acute whole-blood loss, both RBCs and plasma are lost, so PCV and TS can initially appear near normal. Redistribution/fluids dilute the circulation later; reticulocyte response takes days.'],
 ['Plasma vs serum','Plasma contains fibrinogen; serum does not. A plasma refractometer gives an estimate of total protein/solids, not the exact biochemical albumin + globulin assays. Compare both when interpreting hypo/hyperproteinemia.']],
 cbc:[
 ['RBCs, indices and regenerative status','Read HCT/RBC/Hb first; classify size (MCV), hemoglobin concentration (MCHC) and anisocytosis (RDW). Then absolute reticulocytes and polychromasia. Regenerative anemia implies bleeding or hemolysis AFTER enough time; nonregeneration can reflect an early sample or impaired production.'],
 ['Species differences in a blood film','Cats have aggregate and punctate reticulocytes, with aggregate supporting recent response. Horses do not release useful circulating reticulocyte numbers, so trends/marrow help. Ruminant regeneration is often muted; breed and age shift RBC reference intervals.'],
 ['Hemolysis vs hemorrhage','Both can cause regeneration. External blood loss can reduce TS after equilibration, while hemolysis often preserves plasma protein. Pink plasma may reflect in vivo hemoglobinemia OR in vitro artifact: verify using clinical signs and newly collected specimen.'],
 ['RBC microscope clues','Spherocytes in anemic dogs support immune-mediated processes in context, not alone. Heinz bodies/eccentrocytes point toward oxidative damage. Schistocytes suggest fragmentation (e.g., DIC/vascular lesions). Echinocytes may be artifacts.']],
 leuko:[
 ['Why absolute differential counts matter','A total WBC of 1,900/µL with 40% neutrophils gives only 760 neutrophils/µL: neutropenia despite a seemingly normal percentage. Convert before interpreting.'],
 ['How a left shift happens','Large inflammatory tissue demand draws on marrow reserve and speeds neutrophil release. Toxic change reflects altered maturation, not the same thing as nuclear immaturity. Degenerative left shift is concerning when immature neutrophils outnumber mature ones.'],
 ['Confusing lookalikes','Epinephrine-associated lymphocytosis is common in excited cats. Cortisol-associated lymphopenia points in the opposite direction. Pelger–Huët hyposegmentation may mimic bands but has dense mature chromatin and no inflammatory toxicity.']],
 platelets:[
 ['Plateletcrits and indices','PCT on a CBC instrument can mean plateletcrit (volume fraction occupied by platelets), NOT procalcitonin in this context. Read it alongside PLT, MPV, smear and instrument-specific RI, never as an isolated diagnosis.'],
 ['Clumps and large platelets','Platelet clumping commonly causes falsely low automated counts in cats. Larger platelets can overlap RBC size on some impedance counters. Scan the feathered edge and blood film before accepting severe thrombocytopenia.'],
 ['Primary vs secondary hemostasis','Petechiae and mucosal bleeding often suggest primary hemostasis (platelet/vWF), while deep hematomas or cavitary hemorrhage suggest factor defects. They are tendencies, not absolute diagnostic distinctions.']],
 chem:[
 ['Hepatic injury ≠ liver failure','ALT/AST/SDH are leakage/injury patterns with species limitations; ALP/GGT/bilirubin suggest cholestasis/induction. Liver synthetic/functional capacity is assessed with albumin, glucose, BUN, cholesterol, bile acids, ammonia and clotting in context.'],
 ['Total protein, albumin, globulins','Globulin = total protein − albumin (chemistry). Albumin ↓ may mean loss, decreased synthesis, inflammation or dilution; the oncotic effect explains edema. Globulins ↑ can indicate immune stimulation, neoplasia or hemoconcentration.'],
 ['Muscle vs liver AST','CK rises with muscle membrane injury and tends to fall sooner than AST. Pair AST/CK with exam and species to avoid misassigning all AST to liver.'],
 ['Electrolyte interference','EDTA contamination can cause artificial K ↑ and Ca ↓. Hemolysis affects analytes variably by species and breed; compare clinical signs, instrument flags and repeat properly collected samples.']],
 renal:[
 ['Renal azotemia interpretation','Classify prerenal (reduced effective renal perfusion), intrinsic renal dysfunction, or postrenal obstruction/leak. Read BUN/creatinine with patient hydration and pretreatment urine specific gravity; drugs and fluids may interfere.'],
 ['Proteinuria','Interpret dipstick with urine concentration, sediment and urine protein:creatinine ratio when appropriate. Active sediment/hematuria can confound a renal protein-loss inference.'],
 ['K and urine flow','Polyuric disease may result in urinary potassium loss; oliguric disease may limit excretion and cause hyperkalemia, but neither is guaranteed. Evaluate intake, acid–base status and medications.']],
 acid:[
 ['Chloride is interpreted in context','Chloride can track sodium/water movement. Corrected chloride compares it with sodium change: selective chloride ↓ often supports alkalosis, while relative chloride ↑ can accompany bicarbonate-loss acidosis.'],
 ['Course anion gap calculation','Use (Na + K) − (Cl + HCO₃), not the version omitting K. Albumin contributes unmeasured negative charges; hypoalbuminemia can conceal an AG rise. Potassium bromide can generate spurious hyperchloremia and a very low or negative calculated gap on certain assays.'],
 ['The pH-first pitfall','Even when pH is normal, CO₂ and bicarbonate can both be abnormal due to compensation or a mixed process. First say what the net pH is, then identify the primary mechanism(s) and assess whether compensation is appropriate; do not infer mixed disease from normal pH alone.']],
 calcium:[
 ['What to measure','Ionized calcium is the physiologically active fraction; total calcium is influenced by protein binding, particularly albumin. A low total Ca during hypoalbuminemia need not indicate low iCa.'],
 ['Normal endocrine feedback','Low iCa stimulates PTH, promoting renal Ca conservation, phosphaturia and bone resorption; PTH-mediated calcitriol production enhances gut calcium uptake. Ca restoration suppresses endogenous PTH.'],
 ['Tumor-related calcium','PTHrP may mimic PTH at receptors but is produced by tumors without normal feedback. With elevated iCa, endogenous PTH is appropriately suppressed; PTHrP is supportive, not a solitary cancer diagnosis.']],
 extra:[
 ['Order smarter send-outs','Confirm species, sampling time/tube and patient medication before choosing thyroid, adrenal, fructosamine, PTH/PTHrP or liver testing. Ask what the result would do to your differential.'],
 ['Ionized calcium and pH','When pH ↑, albumin binds Ca more avidly so measured ionized calcium tends ↓. Air contamination can make a sample more alkaline and lower measured iCa.'],
 ['Send-out is not synonymous with confirmation','Fructosamine reflects average glucose over roughly 1–3 weeks but changes with serum protein turnover; steroids, illness and timing confound endocrine testing.'],
 ['Glucose processing','Cells continue consuming glucose if serum/plasma is not separated promptly. Interpret unexpectedly low glucose with sample delay and relevant clinical symptoms.']],
 practice:[
 ['How to solve each case','Read species and RI → classify each analyte → join abnormalities by a common physiologic mechanism → identify competing diagnoses → choose a specific next test. Answers reveal WHY, not just correct/incorrect.']]
};
function detailedExtras(key){const rows=deepData[key]||[];return rows.length?
 '<details class="vra-deep"><summary>📖 Detailed workup · physiology, artifacts, and species differences ('+rows.length+')</summary>'+
 rows.map(x=>card(x[0],'<p>'+x[1]+'</p>')).join('')+'</details>':''}
const views={start,pcv,cbc,leuko,platelets,chem,renal,acid,calcium,extra,practice};
function ensureAcademyApi(){if(!api)api={body:document.getElementById('modalBody'),showModal:(title,html)=>window.VPQ_REFERRAL_MODAL?.show?.(title,html)};return api}
function open(id='start'){
 ensureAcademyApi();if(!api?.showModal)return false;
 if(id==='pcv')return window.VPQ_DIAGNOSTIC_MASTER?.open?.('pcv');
 current=views[id]?id:'start';
 const s=S.find(x=>x.id===current);
 api.showModal('🔬 Advanced Clinical Pathology · '+s.name,
 css+'<div class="vra">'+
 '<div class="vra-topicbar"><label for="vpq-clinpath-topic">📚 Topic</label><select id="vpq-clinpath-topic" data-vpq-report-select="1">'+S.map(x=>'<option value="'+x.id+'" '+(current===x.id?'selected':'')+'>'+x.icon+' '+x.name+'</option>').join('')+'</select><button type="button" data-vpq-report-action="classic">← Main lab</button></div>'+
 '<div class="vra-kicker"><b>📚 Learn First → Interpret Trends → Why the Body Responds → Patient Workups.</b> Course-guided notes with compact expandable detail.</div>'+
 views[current]()+detailedExtras(current)+sources+
 '<div class="vra-btns"><button type="button" data-vpq-report-action="classic">← CBC & Chemistry workstation</button></div></div>');
 return true;
}
function handleAcademyClick(event){
 const target=event.target?.closest?.('[data-vpq-report],[data-vpq-report-answer],[data-vpq-report-action]');
 if(!target||!target.closest('.vra'))return false;
 event.preventDefault();event.stopImmediatePropagation();
 if(target.dataset.vpqReport)return open(target.dataset.vpqReport);
 if(target.dataset.vpqReportAnswer){const parts=target.dataset.vpqReportAnswer.split(':').map(Number);reveal[parts[0]]=parts[1];return open('practice')}
 if(target.dataset.vpqReportAction==='species-cbc')return window.VPQ_CLINPATH_SPECIES_GUIDE?.open('cbc');
 if(target.dataset.vpqReportAction==='species-chem')return window.VPQ_CLINPATH_SPECIES_GUIDE?.open('chem');
 if(target.dataset.vpqReportAction==='multistage')return window.VPQ_CLINPATH_MULTISTAGE?.home?.();
 if(target.dataset.vpqReportAction==='inhouse')return window.VPQ_TREATMENT_DIAGNOSTICS?.openSection?.('inhouse');
 if(target.dataset.vpqReportAction==='sendout')return window.VPQ_TREATMENT_DIAGNOSTICS?.openSection?.('sendout');
 if(target.dataset.vpqReportAction==='classic')return window.VPQ_TREATMENT_DIAGNOSTICS?.legacyLabHome?.();
 if(target.dataset.vpqReportAction==='hybrid')return window.VPQ_ADVANCED_LAB?.hybridHome?.();
 if(target.dataset.vpqReportAction==='cases')return window.VPQ_OPEN_REFERRAL_PATIENTS?.()||window.VPQ_CLINPATH_REFERRAL_PILOT?.home?.()||window.VPQ_ADVANCED_LAB?.home?.();
 return false;
}
// Independent delegated navigation protects the teaching tabs if bulk game init is interrupted.
window.addEventListener('click',handleAcademyClick,true);
function changeTopic(event){
 const target=event.target?.closest?.('[data-vpq-report-select]');
 if(!target||!target.closest('.vra'))return;
 event.preventDefault();event.stopImmediatePropagation();
 if(views[target.value]&&target.value!=='extra')open(target.value);
}
window.addEventListener('change',changeTopic,true);
function init(context){
 api=context;
 api.body.addEventListener('click',event=>{
 const target=event.target.closest('[data-vpq-report],[data-vpq-report-answer],[data-vpq-report-action]');
 if(!target)return;
 event.preventDefault();
 if(target.dataset.vpqReport)return open(target.dataset.vpqReport);
 if(target.dataset.vpqReportAnswer){const parts=target.dataset.vpqReportAnswer.split(':').map(Number);reveal[parts[0]]=parts[1];return open('practice')}
 if(target.dataset.vpqReportAction==='species-cbc')return window.VPQ_CLINPATH_SPECIES_GUIDE?.open('cbc');
 if(target.dataset.vpqReportAction==='species-chem')return window.VPQ_CLINPATH_SPECIES_GUIDE?.open('chem');
 if(target.dataset.vpqReportAction==='multistage')return window.VPQ_CLINPATH_MULTISTAGE?.home?.();
 if(target.dataset.vpqReportAction==='inhouse')return window.VPQ_TREATMENT_DIAGNOSTICS?.openSection?.('inhouse');
 if(target.dataset.vpqReportAction==='sendout')return window.VPQ_TREATMENT_DIAGNOSTICS?.openSection?.('sendout');
 if(target.dataset.vpqReportAction==='classic')return window.VPQ_TREATMENT_DIAGNOSTICS?.legacyLabHome?.();
 if(target.dataset.vpqReportAction==='hybrid')return window.VPQ_ADVANCED_LAB?.hybridHome?.();
 if(target.dataset.vpqReportAction==='cases')return window.VPQ_CLINPATH_REFERRAL_PILOT?.home?.()||window.VPQ_ADVANCED_LAB?.home?.();
 });
}
return Object.freeze({init,open,pcvMarkup:()=>css+'<div class="vra">'+pcv()+'</div>'});
})();
