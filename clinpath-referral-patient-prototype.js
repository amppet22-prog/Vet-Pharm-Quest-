/* Clinical Pathology Referral Patient — approval prototype, source Cases Part 1 Case 1.1 */
(function(){
'use strict';
const KEY='vpq-clinpath-referral-001-guided-v2';
const fresh=()=>({view:'',opened:[],anemia:'',ddx:['','',''],next:['','',''],notes:'',submitted:false,selected:[],lead:'',level:'guided',advancedSubmitted:false});
let validationMessage='';
let state=fresh();try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&Array.isArray(v.ddx))state=Object.assign(fresh(),v)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reports={
cbc:{title:'🩸 CBC & smear',rows:[['HCT','26 %','37–55 %','↓'],['RBC','3.75 ×10⁶/µL','5.5–8.5','↓'],['Hemoglobin','8.8 g/dL','12–18','↓'],['MCV','69 fL','60–77',''],['MCHC','33.8 g/dL','32–36',''],['Absolute reticulocytes','22 ×10³/µL','<60',''],['WBC','9.8 ×10³/µL','6–17',''],['Platelets','310 ×10³/µL','200–500','']],extra:'Blood smear: Normocytic normochromic RBCs, no polychromasia, spherocytes or agglutination. 📷 Reference photo slot: normal canine smear, not yet supplied.'},
chem:{title:'🧪 Serum chemistry',rows:[['BUN','78 mg/dL','7–27','↑'],['Creatinine','4.1 mg/dL','0.5–1.5','↑'],['Phosphorus','9.2 mg/dL','2.5–6.8','↑'],['Calcium','9.8 mg/dL','9.4–11.3','']]},
urine:{title:'🧫 Urinalysis',rows:[['Urine specific gravity','1.012','>1.030','↓']],extra:'Only USG is provided in the source case. Urine sediment, UPC and dipstick findings are not supplied; do not assume they are negative.'}
};
if(!document.getElementById('vpqReferralStyle')){
const style=document.createElement('style');style.id='vpqReferralStyle';style.textContent=
'#modalBody .refcase{max-width:900px;margin:auto;font-size:13px;line-height:1.55;color:#263d58}'+
'#modalBody .refcase .refbox{border:1px solid #cddbea;border-radius:11px;padding:12px;margin:9px 0;background:#fafdff}'+
'#modalBody .refcase h3{font-size:15px;margin:0 0 7px;color:#24547b}'+
'#modalBody .refcase p{margin:6px 0 9px}'+
'#modalBody .refcase table{border-collapse:collapse;width:100%;font-size:12px}'+
'#modalBody .refcase th,#modalBody .refcase td{padding:6px;border-bottom:1px solid #dce8f0;text-align:left}'+
'#modalBody .refcase th{background:#eaf2fa}'+
'#modalBody .refcase .refbuttons{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}'+
'#modalBody .refcase button{padding:8px 11px;border:1px solid #99b9d4;background:#ecf5ff;border-radius:8px;color:#294c6d;font-weight:800;cursor:pointer}'+
'#modalBody .refcase button[aria-pressed=true]{background:#d3e9fc}'+
'#modalBody .refcase label{display:block;margin-top:8px;font-weight:800}'+
'#modalBody .refcase input,#modalBody .refcase textarea{display:block;box-sizing:border-box;width:100%;padding:8px;border:1px solid #a8bdd1;border-radius:7px;background:white;color:#243d56;font:inherit;font-weight:400}'+
'#modalBody .refcase .refgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}'+
'#modalBody .refcase .refsmall{font-size:11px;color:#637a91}'+
'#modalBody .refcase .refreview{background:#eef8f2;border:1px solid #89b79d}'+
'@media(max-width:640px){#modalBody .refcase .refgrid{grid-template-columns:1fr}}';

style.textContent+=
'#modalBody .refcase .refheader{background:#edf5fc;padding:10px 12px}'+
'#modalBody .refcase .refselect{display:block;width:100%;padding:9px;margin-top:5px;border:1px solid #8caecc;border-radius:8px;background:#fff;color:#294a69;font-size:13px;font-weight:750}'+
'#modalBody .refcase .refsection{padding:0;overflow:hidden;margin:7px 0;background:#fff}'+
'#modalBody .refcase .refsection summary{padding:10px 12px;cursor:pointer;font-size:13px;font-weight:900;color:#315b80;background:#f2f7fc;list-style-position:inside}'+
'#modalBody .refcase .refsection[open]>summary{border-bottom:1px solid #d4e1ed}'+
'#modalBody .refcase .refsectionbody{padding:10px 12px}'+
'#modalBody .refcase .refhint{float:right;font-size:10px;color:#71849b;font-weight:500}'+
'#modalBody .refcase .refgroup{margin:13px 0 2px;font-size:15px}'+
'#modalBody .refcase .refprotected{padding:10px 12px;border:1px dashed #b4c9db;border-radius:9px;background:#f7fafc;color:#60758b;font-size:12px}'+
'#modalBody .refcase .refsection .refbox{margin:0;border:0;background:transparent;padding:0}';
style.textContent+=
'#modalBody .refcase{font-size:15px;line-height:1.58;color:#263b55}'+
'#modalBody .refcase h3{font-size:17px;line-height:1.3}'+
'#modalBody .refcase .refsmall{font-size:12px}'+
'#modalBody .refcase .refsection summary{font-size:15px}'+
'#modalBody .refcase .refgroup{font-size:18px;color:#2a607a}'+
'#modalBody .refcase table{font-size:14px}'+
'#modalBody .refcase button{font-size:14px}'+
'#modalBody .refcase .refhintbox{background:#eaf3ff;border-left:4px solid #76a8db;padding:10px 12px;border-radius:8px;margin:8px 0 12px}'+
'#modalBody .refcase .reflevel{background:linear-gradient(100deg,#daf5ed,#e7e5fa);border:1px solid #acd9cb;border-radius:10px;font-weight:800;color:#315c66;padding:10px;margin:14px 0 7px}'+
'#modalBody .refcase .refguided{background:#fafcff;border:2px solid #9fb9d8}'+
'#modalBody .refcase .refoptions{display:grid;gap:7px}'+
'#modalBody .refcase .refoption{display:flex;gap:7px;align-items:stretch;border:2px solid #cad9e8;border-radius:10px;background:#fff;padding:6px}'+
'#modalBody .refcase .refoption.is-selected{border-color:#6c96cf;background:#e9f2ff}'+
'#modalBody .refcase .refoption.is-lead{box-shadow:inset 4px 0 #769ee3}'+
'#modalBody .refcase .refoption.is-correct{border-color:#7fb695;background:#eaf7ee}'+
'#modalBody .refcase .refoption.is-possible{border-color:#d9c470;background:#fff9dc}'+
'#modalBody .refcase .refoption.is-low{border-color:#e5ad8c;background:#fff3e9}'+
'#modalBody .refcase .refoption .refoptionselect{flex:1;text-align:left;background:transparent;border:0;padding:8px;min-width:0}'+
'#modalBody .refcase .refoption .refcheck{font-size:20px;color:#467eb0}'+
'#modalBody .refcase .refoption .reflead{min-width:85px;white-space:nowrap;background:#f6faff}'+
'#modalBody .refcase .refshortlist{border-color:#bbceea;background:#f4f7ff}'+
'#modalBody .refcase .refrank{margin:8px 0;padding-left:27px}'+
'#modalBody .refcase .refrank li{padding:6px;border-bottom:1px solid #dbe5f1;display:list-item}'+
'#modalBody .refcase .refrank li>div{display:inline-block;vertical-align:middle}'+
'#modalBody .refcase .refrankbuttons{float:right;display:flex;gap:4px}'+
'#modalBody .refcase .refrankbuttons button{padding:2px 9px}'+
'#modalBody .refcase .refleader{color:#3e6593;font-size:12px}'+
'#modalBody .refcase .refsubmit{background:#dcefe3;border:2px solid #78b693;color:#245c40;font-weight:900;padding:11px}'+
'#modalBody .refcase .refphotos{border:2px solid #c9b8e8}'+
'#modalBody .refcase .refphotos summary{background:#f1eafa}'+
'#modalBody .refcase .refphotogrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}'+
'#modalBody .refcase .refphotoplace{min-height:98px;background:#faf7ff;border:2px dashed #cbbada;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10px;gap:4px}'+
'#modalBody .refcase .refphotoplace span{font-size:25px}'+
'#modalBody .refcase .refphotoplace small{font-size:11px;color:#66768d}'+
'#modalBody .refcase .refresult{border:2px solid #a4ccb5;background:#fafffb}'+
'#modalBody .refcase .refresultlead{padding:10px 12px;border:2px solid #deb681;background:#fff3df;border-radius:9px}'+
'#modalBody .refcase .refresultlead.refgood{background:#e7f7eb;border-color:#77b38a}'+
'#modalBody .refcase .reftablescroll{overflow-x:auto;margin-top:9px;border:1px solid #cedde6;border-radius:9px}'+
'#modalBody .refcase .refcompare{min-width:730px;font-size:13px}'+
'#modalBody .refcase .refcompare th{background:#e6eef6;font-size:13px}'+
'#modalBody .refcase .refcompare td{vertical-align:top;padding:10px}'+
'#modalBody .refcase .refcompare-best{background:#e7f7ec;border-left:4px solid #6bae7b}'+
'#modalBody .refcase .refcompare-possible{background:#fff9de;border-left:4px solid #c8a952}'+
'#modalBody .refcase .refcompare-unlikely{background:#fff0e6;border-left:4px solid #d89a76}'+
'#modalBody .refcase .refanswer{background:#f1f9f4;border-color:#a4ceaf}'+
'#modalBody .refcase .refadvanced{border:2px solid #d7c0e7}'+
'#modalBody .refcase .refadvanced summary{background:#f4edfc}'+
'@media(max-width:620px){#modalBody .refcase .refphotogrid{grid-template-columns:1fr}#modalBody .refcase .refoption .reflead{min-width:70px}}';

// Shared guided referral presentation: larger touch targets, clearer step colors, and a responsive chart.
style.textContent+=
'#modalBody .refcase .refvalidation{padding:12px 14px;background:#fff0e5;border:2px solid #e4a373;border-radius:10px;color:#874a23;font-size:16px;font-weight:800}'+
'#modalBody .refcase .refphotoplace{border-style:dashed}'+
'#modalBody .refcase{font-size:17px;line-height:1.62;max-width:1000px}'+
'#modalBody .refcase h3{font-size:20px}'+
'#modalBody .refcase .refsection summary{font-size:18px;padding:13px 15px}'+
'#modalBody .refcase .refsectionbody{padding:13px 15px}'+
'#modalBody .refcase .refsmall{font-size:14px}'+
'#modalBody .refcase .refhintbox{font-size:16px}'+
'#modalBody .refcase .refgroup{font-size:21px}'+
'#modalBody .refcase table,#modalBody .refcase .refcompare{font-size:16px}'+
'#modalBody .refcase .refcompare th{font-size:15px}'+
'#modalBody .refcase th,#modalBody .refcase td{padding:10px}'+
'#modalBody .refcase button{font-size:16px;min-height:42px}'+
'#modalBody .refcase .refoption{border-radius:13px;padding:8px}'+
'#modalBody .refcase .refoption .refoptionselect{text-align:left;font-size:17px;line-height:1.4}'+
'#modalBody .refcase .refselect{font-size:17px;padding:12px}'+
'#modalBody .refcase .refguided{background:#f6faff;border-color:#7195df}'+
'#modalBody .refcase .refheader{background:linear-gradient(110deg,#d9ecff,#ede1ff);border-color:#aab7ec}'+
'#modalBody .refcase .refsection:has(table) summary{background:#e6f4fa;color:#235f79}'+
'#modalBody .refcase .refshortlist{background:#eaefff;border:2px solid #a6b4ed}'+
'#modalBody .refcase .refshortlist h3{color:#404a98}'+
'#modalBody .refcase .refphotos{border-color:#ad87d9;background:#fdfaff}'+
'#modalBody .refcase .refphotoplace{min-height:170px;font-size:16px}'+
'#modalBody .refcase .refphotoplace small{font-size:14px}'+
'#modalBody .refcase .refadvanced{border-color:#b38cc9}'+
'#modalBody .refcase .refresult{border-color:#71b998}'+
'#modalBody .refcase .refanswer h3{color:#217452}'+
'#modalBody .refcase .refsubmit{background:#d6f4e1;border-color:#4b9d70}'+
'@media(max-width:640px){#modalBody .refcase{font-size:16px}#modalBody .refcase .refoption .refoptionselect{font-size:16px}#modalBody .refcase .refhint{float:none;display:block}#modalBody .refcase table{font-size:14px}}';

// Compact, wide referral reading layout; only affects this prototype modal.
style.textContent+=
'.modal:has(#modalBody .refcase){width:min(1120px,calc(100vw - 28px));max-height:96dvh}'+
'.modal:has(#modalBody .refcase) .modalhead{padding:9px 16px;gap:8px}'+
'.modal:has(#modalBody .refcase) #modalBody{padding:10px 14px}'+
'#modalBody .refcase{max-width:none;font-size:16px;line-height:1.42}'+
'#modalBody .refcase .refbox{padding:10px 12px;margin:6px 0;border-radius:10px}'+
'#modalBody .refcase .refheader{padding:9px 12px}'+
'#modalBody .refcase .refheader label{margin-top:0}'+
'#modalBody .refcase .refheader .refselect{padding:7px 10px;font-size:16px;margin-top:3px}'+
'#modalBody .refcase .refheader .refsmall{margin:3px 0 0}'+
'#modalBody .refcase .refsection{padding:0;margin:6px 0}'+
'#modalBody .refcase .refsection summary{padding:8px 12px;font-size:17px}'+
'#modalBody .refcase .refsectionbody{padding:8px 12px}'+
'#modalBody .refcase h3{font-size:18px;margin:2px 0 5px}'+
'#modalBody .refcase .refgroup{font-size:19px;margin:9px 0 2px}'+
'#modalBody .refcase p{margin:4px 0 6px}'+
'#modalBody .refcase table{font-size:15px;line-height:1.28}'+
'#modalBody .refcase th,#modalBody .refcase td{padding:5px 9px}'+
'#modalBody .refcase table thead th{padding:7px 9px}'+
'#modalBody .refcase .refhint{font-size:11px}'+
'#modalBody .refcase .refphotoplace{min-height:100px;padding:8px}'+
'#modalBody .refcase .reflevel{margin:10px 0 5px;padding:8px 10px}'+
'#modalBody .refcase .refhintbox{padding:8px 10px;font-size:15px}'+
'#modalBody .refcase .refoption{padding:4px 6px}'+
'#modalBody .refcase .refoption .refoptionselect{font-size:16px;padding:6px}'+
'#modalBody .refcase .refcompare td{padding:7px 9px}'+
'@media(max-width:640px){.modal:has(#modalBody .refcase){width:calc(100vw - 8px);max-height:98dvh}.modal:has(#modalBody .refcase) #modalBody{padding:7px 9px}#modalBody .refcase{font-size:15px}#modalBody .refcase th,#modalBody .refcase td{padding:6px 5px}#modalBody .refcase .refsection summary{font-size:16px}}';
document.head.appendChild(style);
}
const report=id=>{const data=reports[id];return '<details class="refbox refsection" open><summary>'+data.title+' <span class="refhint">expand / collapse</span></summary><div class="refsectionbody"><table><thead><tr><th>Test</th><th>Patient</th><th>Reference interval</th></tr></thead><tbody>'+data.rows.map(r=>'<tr><td>'+h(r[0])+'</td><td><b>'+h(r[1])+'</b> <b style="color:#af6a32">'+h(r[3])+'</b></td><td>'+h(r[2])+'</td></tr>').join('')+'</tbody></table>'+(data.extra?'<p>'+h(data.extra)+'</p>':'')+'</div></details>'};
const candidates=[
{id:'renal',name:'Anemia associated with chronic renal disease',tier:'best',supports:'Chronic PU/PD, weight loss, renal azotemia, increased phosphorus, and urine that is inadequately concentrated.',against:'A single minimum database cannot prove chronicity or identify the underlying kidney lesion.',test:'Serial renal measurements and USG; renal assessment, blood pressure and UPC.',why:'Renal erythropoietin production may decline with chronic functional renal tissue loss.'},
{id:'inflammation',name:'Anemia of chronic inflammation',tier:'possible',supports:'Can produce normocytic, normochromic, non-regenerative anemia.',against:'No source of inflammation is identified, and the renal findings demand a more direct explanation.',test:'Review inflammatory history, leukogram and protein findings; investigate a suspected inflammatory source.',why:'Inflammatory mediators restrict iron availability and suppress erythropoiesis.'},
{id:'marrow',name:'Primary bone marrow hypoplasia or infiltration',tier:'possible',supports:'A marrow disorder can suppress red cell production.',against:'Platelets and WBC are within their supplied intervals; isolated marrow disease is not the strongest explanation for the renal profile.',test:'Review serial CBC and blood film; consider bone marrow examination only if indicated by persistent unexplained findings.',why:'Reduced marrow precursor production can cause insufficient erythrocyte replacement.'},
{id:'bloodloss',name:'Blood-loss anemia',tier:'unlikely',supports:'May produce low HCT, RBC and hemoglobin.',against:'No described bleeding; the reticulocyte count and smear do not support a regenerative response to substantial ongoing loss.',test:'Review bleeding history and examination; targeted fecal/urinary blood evaluation if clinically indicated.',why:'Blood loss ultimately drives compensatory reticulocytosis when marrow function and timing permit.'},
{id:'hemolysis',name:'Hemolytic anemia',tier:'unlikely',supports:'Can reduce red cell mass and cause pallor.',against:'No spherocytes or agglutination, and no reticulocytosis or polychromasia in this case.',test:'Recheck smear and markers of hemolysis if suspicion persists.',why:'Accelerated RBC destruction generally provokes marrow regeneration after an appropriate response interval.'}
];
const chosen=()=>state.selected.map(id=>candidates.find(x=>x.id===id)).filter(Boolean);
const guided=()=>{
const done=!!state.submitted;
const selected=chosen();
return '<section class="refbox refguided"><h3>🩺 Differential diagnosis · Select and rank</h3>'+
'<p>Like the Pathology Differential Center: choose your plausible causes, rank them, and mark one as the <b>★ leading diagnosis</b>. Nothing is graded or revealed until you submit.</p>'+
'<div class="refhintbox"><b>Step 1:</b> Select exactly three plausible causes. <b>Step 2:</b> Use ↑ / ↓ to rank them from most to least likely. <b>Step 3:</b> Mark your leading diagnosis with ☆ Lead. <b>Step 4:</b> Submit to compare the evidence.</div>'+
(validationMessage?'<p class="refvalidation" role="alert">'+h(validationMessage)+'</p>':'')+
'<div class="refoptions">'+candidates.map(c=>{
const active=state.selected.includes(c.id),lead=state.lead===c.id;
return '<div class="refoption '+(active?'is-selected ':'')+(lead?'is-lead ':'')+(done?(c.tier==='best'?'is-correct':c.tier==='unlikely'?'is-low':'is-possible'):'')+'">'+
'<button type="button" data-ref-toggle="'+c.id+'" aria-pressed="'+active+'" '+(done?'disabled':'')+' class="refoptionselect"><span class="refcheck">'+(active?'☑':'☐')+'</span> '+h(c.name)+'</button>'+
'<button type="button" data-ref-lead="'+c.id+'" aria-pressed="'+lead+'" '+(done?'disabled':'')+' class="reflead">'+(lead?'★ Lead':'☆ Lead')+'</button></div>';
}).join('')+'</div>'+
'<div class="refbox refshortlist"><h3>📋 Your ranked shortlist</h3>'+
(selected.length?'<ol class="refrank">'+selected.map((c,i)=>'<li><div><b>'+h(c.name)+'</b>'+(state.lead===c.id?' <span class="refleader">★ Lead</span>':'')+'</div><div class="refrankbuttons"><button type="button" data-ref-up="'+c.id+'" '+(done||i===0?'disabled':'')+' title="Move higher">↑</button><button type="button" data-ref-down="'+c.id+'" '+(done||i===selected.length-1?'disabled':'')+' title="Move lower">↓</button></div></li>').join('')+'</ol>':'<p>Choose options above to build your shortlist.</p>')+
'<p class="refsmall">'+selected.length+'/3 shortlisted · '+(state.lead?'Leading diagnosis selected':'Set your leading diagnosis using ☆ Lead')+'</p>'+
'<p class="refsmall">Ranking order matters: your first entry is your highest-priority differential. Your ★ Lead should match your top-ranked choice.</p></div>'+
(!done?'<div class="refbuttons"><button class="refsubmit" type="button" data-ref-guided-submit="1">✓ Submit differential ranking · View comparisons</button></div><p class="refsmall">All options remain neutral before submission. You can attempt Advanced Mode separately afterward.</p>':'<p class="refsmall">Your differential ranking has been submitted. The case comparison appears below.</p>')+
'</section>';
};
const comparison=()=>{
const lead=candidates.find(c=>c.id===state.lead),good=state.lead==='renal';
return '<section class="refbox refresult"><h3>📊 Compare your differentials</h3>'+
'<p class="refsmall">Green = strongest support · Yellow = possible but less supported · Pale orange = evidence weighs against. Your selected lead is marked below.</p>'+
'<div class="refresultlead '+(good?'refgood':'refreviewlead')+'"><b>Your leading diagnosis:</b> '+h(lead?.name||'Not selected')+'<p>'+(good?'✓ Strongest fit based on the supplied data.':'Review the evidence: another diagnosis better integrates the CBC, chemistry and USG.')+'</p></div>'+
'<div class="reftablescroll"><table class="refcompare"><thead><tr><th>Differential / priority</th><th>Evidence supporting</th><th>Against / discriminators</th><th>Next test</th></tr></thead><tbody>'+
candidates.map(c=>'<tr class="refcompare-'+c.tier+'"><td><b>'+(c.tier==='best'?'★ ':c.tier==='possible'?'◇ ':'△ ')+h(c.name)+'</b>'+(state.lead===c.id?'<div class="refsmall">Your lead</div>':'')+'</td><td>'+h(c.supports)+'</td><td>'+h(c.against)+'</td><td>'+h(c.test)+'</td></tr>').join('')+
'</tbody></table></div><div class="refbox refanswer"><h3>✓ Best-supported diagnosis</h3><p><b>Anemia associated with chronic renal disease</b> is the leading interpretation in the uploaded case. This is a working diagnosis rather than proof of CKD from one time point.</p><h3>🧬 Why the body does this</h3><p>'+h(candidates[0].why)+' The erythrogram identifies the non-regenerative pattern; the renal chemistry and USG supply the physiologic context.</p><h3>🔬 Differential testing</h3><p>Recheck CBC, chemistry and USG, evaluate blood pressure, UPC, history and evidence of chronicity. Do not infer unprovided urine sediment or protein data.</p><p class="refsmall">Source: uploaded Cases Part 1, Case 1.1 · CP1 slide 17 / Minimum Database template. EPO physiology, BP and UPC follow-up were marked as Added beyond the lecture slides.</p></div></section>';
};
const advanced=()=>'<details class="refbox refsection refadvanced"><summary>🎓 Advanced Mode · Written differentials and testing plan <span class="refhint">optional challenge</span></summary><div class="refsectionbody"><p>This is the harder version of the case. Write your own anemia classification, ranked differential diagnoses and next diagnostic tests without relying on the multiple-choice options.</p>'+
'<label>Anemia classification<textarea data-ref-text="anemia" rows="2" placeholder="Describe RBC indices and regenerative response">'+h(state.anemia)+'</textarea></label>'+
'<div class="refgrid">'+state.ddx.map((d,i)=>'<label>'+(i+1)+'. Ranked differential<input data-ref-ddx="'+i+'" value="'+h(d)+'" placeholder="Your working differential"></label><label>Next diagnostic test / reason<input data-ref-next="'+i+'" value="'+h(state.next[i])+'" placeholder="How will you investigate?"></label>').join('')+'</div>'+
'<label>Mechanism and uncertainty<textarea data-ref-text="notes" rows="3">'+h(state.notes)+'</textarea></label>'+
'<p class="refsmall">Written responses are saved locally; this mode does not gate the beginner-level comparison.</p></div></details>';
const review=()=>'<section class="refbox refreview"><h3>🔓 Teaching review — available after submission</h3>'+
'<p><b>Source interpretation:</b> Normocytic, normochromic, non-regenerative anemia with azotemia, high phosphorus and inappropriately dilute urine; chronic renal disease is the leading concern.</p>'+
'<p><b>1. Chronic renal disease-associated anemia:</b> PU/PD, renal biochemical abnormalities, USG 1.012 and non-regenerative anemia favor this interpretation.</p>'+
'<p><b>2. Chronic inflammation:</b> The erythrogram can look similar; the case provides no clear inflammatory source. Reassess history, leukogram and globulin pattern.</p>'+
'<p><b>3. Bone marrow disease:</b> Lower priority with normal WBC and platelet counts; consider if other cytopenias appear or further work-up does not explain the anemia.</p>'+
'<p><b>Deprioritize blood loss/hemolysis:</b> No substantial reticulocytosis or polychromasia in the supplied findings.</p>'+
'<p><b>Why:</b> Reduced renal erythropoietin production can impair erythropoiesis. Laboratory patterns suggest mechanisms; they do not, alone, prove disease chronicity.</p>'+
'<p><b>Next investigations:</b> Reassess renal values and urine concentration, measure blood pressure and UPC, evaluate the underlying kidney process. EPO physiology and UPC/BP work-up are marked as <em>Added</em> outside the lecture slides in the source.</p>'+
'<p class="refsmall">Based on uploaded Cases Part 1, Case 1.1; CP1 slide 17 / Minimum Database template. Patient values are invented educational examples. A single encounter alone does not establish CKD chronicity or stage.</p></section>';
function render(){
const old=document.querySelector('#modalBody .refcase');
const priorDetails=old?[...old.querySelectorAll('details')].map((el,i)=>({i,open:el.open})):[];
const oldScroll=document.getElementById('modalBody')?.scrollTop||0;
const content='<div class="refcase">'+
'<div class="refbox refheader"><label for="vpqReferralCasePick"><b>🩺 Referral patient</b></label><select id="vpqReferralCasePick" class="refselect" aria-label="Choose referral patient"><option value="001">Case 001 · Dog · PU/PD and weight loss</option></select><p class="refsmall">Clinical Pathology · Lecture 1 · DDx · Approval prototype 1 of 1.</p></div>'+
'<details class="refbox refsection" open><summary>🐾 Patient history & physical examination</summary><div class="refsectionbody"><p><b>Signalment:</b> 9-year-old spayed female mixed-breed dog.</p><p><b>History:</b> Two months of increased drinking and urination, weight loss, and poor appetite. No medications.</p><p><b>Physical examination:</b> Thin body condition; pale mucous membranes; mild oral ulcers; approximately 5% dehydration; temperature 38.4 °C.</p></div></details>'+
'<h3 class="refgroup">🧪 Ancillary testing · Minimum database</h3><p class="refsmall">Each laboratory section opens independently. Normal ranges are supplied next to patient values.</p>'+
Object.keys(reports).map(report).join('')+
'<details class="refbox refsection refphotos" open><summary>📷 Patient images & diagnostic photographs</summary><div class="refsectionbody"><div class="refphotogrid"><div class="refphotoplace"><span>🩸</span><b>Canine blood-smear photo</b><small>Image to add · normal-appearing RBCs, minimal polychromasia</small></div><div class="refphotoplace"><span>🔬</span><b>Microscopy / laboratory image</b><small>Reserved for supporting photos in future cases</small></div></div><p class="refsmall">No photograph was supplied with this invented patient. These are labeled placeholders, not fabricated findings.</p></div></details>'+
'<div class="reflevel">🌱 <b>Guided Differential Practice</b> · Multiple choice + ranking</div>'+guided()+
(state.submitted?comparison():'<div class="refprotected">🔒 The evidence comparison, leading diagnosis, rationale and follow-up tests remain hidden until you submit your ranked choices.</div>')+
advanced()+
'<div class="refbuttons"><button type="button" data-ref-legacy="1">Existing Clinical Pathology cases</button><button type="button" data-ref-reset="1">Restart prototype</button></div></div>';
window.VPQ_REFERRAL_MODAL.show('🔬 Referral Patients · Clinical Pathology',content);
if(old){
const root=document.querySelector('#modalBody .refcase');
if(root)priorDetails.forEach(x=>{const d=root.querySelectorAll('details')[x.i];if(d)d.open=x.open});
const body=document.getElementById('modalBody');if(body)body.scrollTop=oldScroll;
}
}
function home(){render()}
document.addEventListener('input',e=>{const n=e.target;if(!n.closest?.('.refcase'))return;if(n.hasAttribute('data-ref-text'))state[n.dataset.refText]=n.value;if(n.hasAttribute('data-ref-ddx'))state.ddx[+n.dataset.refDdx]=n.value;if(n.hasAttribute('data-ref-next'))state.next[+n.dataset.refNext]=n.value;save()});
document.addEventListener('click',e=>{
const n=e.target.closest?.('[data-ref-toggle],[data-ref-lead],[data-ref-up],[data-ref-down],[data-ref-guided-submit],[data-ref-back],[data-ref-reset],[data-ref-legacy]');
if(!n||!n.closest('.refcase'))return;e.preventDefault();
const attr=x=>n.getAttribute(x);
if(n.hasAttribute('data-ref-toggle')&&!state.submitted){validationMessage='';const id=attr('data-ref-toggle');const pos=state.selected.indexOf(id);if(pos>=0){state.selected.splice(pos,1);if(state.lead===id)state.lead=''}else if(state.selected.length<3){state.selected.push(id)}else {validationMessage='You already have three choices. Deselect one before choosing another.';return render()}save();return render()}
if(n.hasAttribute('data-ref-lead')&&!state.submitted){validationMessage='';const id=attr('data-ref-lead');if(!state.selected.includes(id)){if(state.selected.length>=3){validationMessage='Select this diagnosis as one of your three before marking it as the lead.';return render()}state.selected.push(id)}state.lead=id;save();return render()}
if((n.hasAttribute('data-ref-up')||n.hasAttribute('data-ref-down'))&&!state.submitted){const id=attr(n.hasAttribute('data-ref-up')?'data-ref-up':'data-ref-down'),a=state.selected.indexOf(id),b=a+(n.hasAttribute('data-ref-up')?-1:1);if(a>=0&&b>=0&&b<state.selected.length){[state.selected[a],state.selected[b]]=[state.selected[b],state.selected[a]];save();render()}return}
if(n.hasAttribute('data-ref-guided-submit')){if(state.selected.length!==3||!state.lead||!state.selected.includes(state.lead)){validationMessage='Select exactly three differentials and mark one as ★ Lead before submitting.';return render()}if(state.selected[0]!==state.lead){validationMessage='Move your ★ leading diagnosis to rank #1 with the ↑ button before submitting.';return render()}validationMessage='';state.submitted=true;save();return render()}
if(n.hasAttribute('data-ref-back'))return home();
if(n.hasAttribute('data-ref-legacy'))return window.VPQ_REFERRAL_MODAL.legacy();
if(n.hasAttribute('data-ref-reset')){if(!confirm('Restart and clear the guided shortlist and advanced notes?'))return;state=fresh();validationMessage='';save();return render()}
});
window.VPQ_CLINPATH_REFERRAL_PILOT={home,open:render};
})();