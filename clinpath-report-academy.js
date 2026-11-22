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
 {id:'extra',name:'Additional In-House / Send-Out',icon:'📦',accent:'#fff0dc'},
 {id:'practice',name:'Guided Report Workups',icon:'🏥',accent:'#eaf4e6'}
];
const sources='<p class="vra-small"><b>Teaching references:</b> user-supplied Clinical Pathology Review Guide, PCV/TP and interpretation infographics; <a href="https://vetgirlontherun.com/veterinary-continuing-education-pcv-tp-big4-vetgirl-blog/" target="_blank" rel="noopener">VETgirl PCV/TP Big 4</a> (external reference); <a href="https://eclinpath.com/hematology/" target="_blank" rel="noopener">Cornell eClinPath Hematology</a>; <a href="https://eclinpath.com/hematology/leukogram-changes/leukogram-patterns/" target="_blank" rel="noopener">Leukogram patterns</a>; <a href="https://eclinpath.com/chemistry/" target="_blank" rel="noopener">Chemistry</a>. Reference ranges depend on species, age, method and lab. The images submitted by the student are learning references, not reproduced here.</p>';
const css='<style>.vra{font-size:14px;line-height:1.5;max-width:100%}.vra *{box-sizing:border-box}.vra-tabs{display:flex;gap:6px;overflow-x:auto;padding:5px 0 9px}.vra-tabs button{flex:0 0 auto;font-size:12px;padding:7px 9px;border-radius:9px}.vra-tabs button[aria-current=true]{background:#dceafd;border-color:#6385bd}.vra-card{border:1px solid #c6d8ec;border-radius:12px;padding:11px;margin:8px 0;background:#fcfdff}.vra-card p{margin:5px 0}.vra-card h3{font-size:16px;margin:0 0 6px}.vra-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px}.vra-grid .vra-card{margin:0}.vra ol,.vra ul{padding-left:22px;margin:8px 0}.vra li{margin:5px 0}.vra details{border:1px solid #d3e0ee;border-radius:11px;margin:8px 0;padding:6px 10px;background:#fff}.vra summary{cursor:pointer;font-size:14px;font-weight:800;padding:5px}.vra table{border-collapse:collapse;width:100%;font-size:13px}.vra th{background:#dfeafa}.vra td,.vra th{padding:7px;border-bottom:1px solid #dbe5f0;text-align:left;vertical-align:top}.vra-scroll{overflow-x:auto}.vra-arrow{font-weight:900;color:#3163a8}.vra-small{font-size:12px;color:#54647c}.vra-kicker{background:#e9f4ff;padding:9px;border-radius:9px}.vra-menu{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}.vra-menu button{text-align:left;min-height:65px;font-size:13px}.vra-table-red th{background:#fbe5ea}.vra-table-green th{background:#e2f3e4}.vra-good{border-left:4px solid #3d9967;background:#eaf7ed}.vra-caution{border-left:4px solid #d59c38;background:#fff7e6}.vra-step{display:flex;gap:9px;align-items:flex-start;margin:6px 0}.vra-num{background:#305fa0;color:white;border-radius:50%;width:24px;height:24px;text-align:center;flex:0 0 24px;font-weight:900}.vra-btns{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.vra-btns button{font-size:13px;padding:7px 10px}.vra-choice{display:block;width:100%;margin:5px 0;text-align:left}.vra-result{padding:9px;border-radius:9px;background:#e7f5eb}.vra-wrong{background:#fff0d8}</style>';
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
 return card('🧭 The routine EVERY time','<p>Before guessing a disease, read the data in the same order used in your course: <b>quality → erythrogram → platelets → leukogram → protein → chemistry/urine → mechanisms → prioritized differential and plan.</b></p>','vra-good')+
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
 return card('⚡ In-house and 📦 send-out both belong to this workstation','<p>Choose what question the test answers, how to collect it, how to read high/low results, and which confirmation you need. A rapid test is not automatically definitive and a send-out result is only as good as its sample and indication.</p>')+
 table(['Test','Sample / clinical question','Interpretation and WHY'],[
 ['PCV/TS','EDTA whole blood + plasma refractometry','RBC fraction vs plasma solutes; pair with hydration and CBC.'],
 ['Lactate','Fresh processed whole blood','↑ reflects net production vs clearance; serial trend and perfusion matter.'],
 ['iCa','Anaerobic prompt analysis, validated tube','Biologically active calcium; ↑ pH increases albumin binding and lowers measured iCa.'],
 ['Blood gas','Appropriate heparinized arterial or venous blood','pH FIRST; distinguish oxygenation from acid–base; avoid air/delay.'],
 ['Ketones / β-hydroxybutyrate','Validated fresh sample','↑ with pathologic ketosis; interpret with glucose and pH in DKA.'],
 ['Fructosamine','Reference-lab serum / plasma as specified','Reflects glycemia over preceding weeks; protein turnover affects interpretation.'],
 ['Total T4, fT4, TSH','Specified reference-lab serum','Illness and drugs change values; species-dependent endocrine diagnosis.'],
 ['PTH / PTHrP','Lab-specific preanalytical instructions','PTH regulation vs tumor-derived PTHrP; interpret with iCa and phosphorus.'],
 ['ACTH / dex suppression','Protocol-specific timed samples','Dynamic endocrine feedback, confounded by drugs/timing.'],
 ['Bile acids, ammonia','Specialized liver function samples','Assess uptake/clearance and hepatic functional/portal circulation; handling matters.'],
 ['Coagulation tests','Correctly filled citrate tubes','PT/aPTT evaluate factor pathways, not platelet number/function.']
 ])+
 card('📋 Sample decision checklist','<p>Patient species → intended question → correct tube → collection conditions / timing → storage and shipping instruction → assay/species-specific RI → how the finding changes your differential or next step.</p>')+
 '<div class="vra-btns">'+link('practice','Use a patient workup →')+'</div>';
}
const challenges=[
 {id:'a',title:'Case A · anemia or sample artifact?',species:'Dog',data:[['HCT','24%','37–55%'],['Reticulocytes','220 × 10³/µL','Use lab-specific interval'],['TS','6.8 g/dL','6.0–8.0 g/dL'],['Bilirubin','2.4 mg/dL','0.1–0.5 mg/dL']],q:'Which interpretation should lead your problem list?',opts:['Regenerative anemia; investigate RBC destruction vs blood loss','Healthy CBC; no problem','Primary thrombocytopenia proven','Pure renal failure established'],answer:0,why:'Low HCT = anemia, increased absolute reticulocytes supports marrow response, normal TS and elevated bilirubin raise suspicion for hemolysis. Verify smear, sample hemolysis, bleeding and causes; bilirubin is not specific.'},
 {id:'b',title:'Case B · acid–base first step',species:'Cat',data:[['pH','7.24','7.35–7.45 (illustrative)'],['pCO₂','25 mmHg','35–45 mmHg (illustrative)'],['HCO₃⁻','11 mmol/L','18–24 mmol/L (illustrative)'],['Lactate','5.1 mmol/L','0.5–2.5 mmol/L (illustrative)']],q:'Where do you start and what does the pattern support?',opts:['Read low pH first: acidemia, low bicarbonate explains primary metabolic acidosis, low CO₂ suggests respiratory response','Low CO₂ means primary alkalosis regardless of pH','Normal pH means compensation is complete','Lactate alone diagnoses sepsis'],answer:0,why:'pH establishes net acidemia. Decreased HCO₃⁻ supports metabolic acidosis. Decreased pCO₂ fits respiratory compensation; calculate expected compensation and anion gap with electrolytes, then interpret lactate.'},
 {id:'c',title:'Case C · leukogram pattern',species:'Dog',data:[['Total WBC','21 × 10³/µL','6–17 × 10³/µL (illustrative)'],['Segmented neutrophils','17 × 10³/µL','3–11.5 × 10³/µL (illustrative)'],['Lymphocytes','0.5 × 10³/µL','1–4.8 × 10³/µL (illustrative)'],['Bands','0','0–0.3 × 10³/µL (illustrative)']],q:'Which pattern is most consistent with these absolute counts?',opts:['Glucocorticoid/stress leukogram is possible; interpret patient and eosinophils','Degenerative left shift established','Epinephrine response proven because lymphocytes decrease','Myeloid leukemia is certain'],answer:0,why:'Mature neutrophilia and lymphopenia without bands are compatible with a stress/cortisol leukogram. Compare eosinophils, monocytes, meds, clinical signs and trends. No single pattern establishes a diagnosis.'}
];
function practice(){
 return card('🏥 Guided report interpretation','<p>For each patient, read species and <b>reference intervals</b> first, classify ↑/↓, then choose the strongest physiologic interpretation. Correct choices appear green; incorrect selections appear orange with the explanation.</p>')+
 challenges.map((c,i)=>card(c.title+' · '+c.species,table(['Value','Patient','Reference interval'],c.data)+
 '<div class="vra-btns"><b>'+c.q+'</b></div>'+
 c.opts.map((option,j)=>'<button class="vra-choice" type="button" data-vpq-report-answer="'+i+':'+j+'">'+String.fromCharCode(65+j)+'. '+option+'</button>').join('')+
 (reveal[i]!==undefined?'<div class="vra-result '+(reveal[i]===c.answer?'':'vra-wrong')+'"><b>'+(reveal[i]===c.answer?'✓ Correct interpretation':'Review the physiology')+'</b><p>'+c.why+'</p></div>':'')+
 '<p class="vra-small">Educational sample intervals only. Compare with the report’s own validated range.</p>'
 )).join('')+
 '<div class="vra-btns">'+link('start','← Report-reading map')+'</div>';
}
const views={start,pcv,cbc,leuko,platelets,chem,renal,acid,calcium,extra,practice};
function open(id='start'){
 if(!api)return false;
 current=views[id]?id:'start';
 const s=S.find(x=>x.id===current);
 api.showModal('🔬 Advanced Clinical Pathology · '+s.name,
 css+'<div class="vra">'+
 '<div class="vra-tabs">'+S.map(x=>'<button type="button" data-vpq-report="'+x.id+'" aria-current="'+(current===x.id)+'">'+x.icon+' '+x.name+'</button>').join('')+'</div>'+
 '<div class="vra-kicker"><b>📚 Learn First → Interpret Trends → Why the Body Responds → Patient Workups.</b> Course-guided notes with compact expandable detail.</div>'+
 views[current]()+sources+
 '<div class="vra-btns">'+link('start','🧭 Overview')+'<button type="button" data-vpq-report-action="classic">🩸 CBC & Chemistry tests</button><button type="button" data-vpq-report-action="hybrid">⚡ In-house / Send-out analyzer</button><button type="button" data-vpq-report-action="cases">🐾 Referral patients</button></div></div>');
 return true;
}
function init(context){
 api=context;
 api.body.addEventListener('click',event=>{
 const target=event.target.closest('[data-vpq-report],[data-vpq-report-answer],[data-vpq-report-action]');
 if(!target)return;
 event.preventDefault();
 if(target.dataset.vpqReport)return open(target.dataset.vpqReport);
 if(target.dataset.vpqReportAnswer){const parts=target.dataset.vpqReportAnswer.split(':').map(Number);reveal[parts[0]]=parts[1];return open('practice')}
 if(target.dataset.vpqReportAction==='classic')return window.VPQ_TREATMENT_DIAGNOSTICS?.legacyLabHome?.();
 if(target.dataset.vpqReportAction==='hybrid')return window.VPQ_ADVANCED_LAB?.hybridHome?.();
 if(target.dataset.vpqReportAction==='cases')return window.VPQ_CLINPATH_REFERRAL_PILOT?.home?.()||window.VPQ_ADVANCED_LAB?.home?.();
 });
}
return Object.freeze({init,open});
})();
