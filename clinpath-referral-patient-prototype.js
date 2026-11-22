/* Clinical Pathology Referral Patient — approval prototype, source Cases Part 1 Case 1.1 */
(function(){
'use strict';
const KEY='vpq-clinpath-referral-001';
const fresh=()=>({view:'',opened:[],anemia:'',ddx:['','',''],next:['','',''],notes:'',submitted:false});
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
document.head.appendChild(style);
}
const report=id=>{const data=reports[id];return '<details class="refbox refsection" open><summary>'+data.title+' <span class="refhint">expand / collapse</span></summary><div class="refsectionbody"><table><thead><tr><th>Test</th><th>Patient</th><th>Reference interval</th></tr></thead><tbody>'+data.rows.map(r=>'<tr><td>'+h(r[0])+'</td><td><b>'+h(r[1])+'</b> <b style="color:#af6a32">'+h(r[3])+'</b></td><td>'+h(r[2])+'</td></tr>').join('')+'</tbody></table>'+(data.extra?'<p>'+h(data.extra)+'</p>':'')+'</div></details>'};
const work=()=>'<section class="refbox"><h3>Clinical interpretation worksheet</h3><p>After reviewing all laboratory reports, classify the anemia, then rank three differentials and specify the next test for each. Your answers stay editable until submission.</p>'+
'<label>Anemia classification<textarea data-ref-text="anemia" rows="2" placeholder="Morphology and regeneration status">'+h(state.anemia)+'</textarea></label>'+
'<div class="refgrid">'+state.ddx.map((d,i)=>'<label>'+(i+1)+'. Ranked differential<input data-ref-ddx="'+i+'" value="'+h(d)+'" placeholder="Your working differential"></label><label>Next diagnostic test / reason<input data-ref-next="'+i+'" value="'+h(state.next[i])+'" placeholder="How will you investigate?"></label>').join('')+'</div>'+
'<label>Additional thoughts / limitations<textarea data-ref-text="notes" rows="3">'+h(state.notes)+'</textarea></label><div class="refbuttons"><button data-ref-submit="1">Submit assessment & unlock review</button></div><p class="refsmall">No correct diagnosis or rationale is displayed before you submit a complete assessment.</p></section>';
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
const content='<div class="refcase">'+
'<div class="refbox refheader"><label for="vpqReferralCasePick"><b>🩺 Referral patient</b></label><select id="vpqReferralCasePick" class="refselect" aria-label="Choose referral patient"><option value="001">Case 001 · Dog · PU/PD and weight loss</option></select><p class="refsmall">Clinical Pathology · Lecture 1 · DDx · Prototype 1 of 1. All source cases remain outside this preview until approved.</p></div>'+
'<details class="refbox refsection" open><summary>🐾 Patient history & physical examination</summary><div class="refsectionbody"><p><b>Signalment:</b> 9-year-old spayed female mixed-breed dog.</p><p><b>History:</b> Two months of increased drinking and urination, weight loss, and poor appetite. No medications.</p><p><b>Physical examination:</b> Thin body condition; pale mucous membranes; mild oral ulcers; approximately 5% dehydration; temperature 38.4 °C.</p></div></details>'+
'<h3 class="refgroup">🔬 Ancillary testing · Minimum database</h3><p class="refsmall">All available laboratory results are shown here together. Expand or collapse individual panels as needed. Patient values and reference intervals are preserved from the source case.</p>'+
Object.keys(reports).map(report).join('')+
'<details class="refbox refsection" open><summary>📝 Differential diagnosis & diagnostic plan</summary><div class="refsectionbody">'+
(state.submitted?'<p class="refsmall">Submitted assessment · review is now unlocked.</p><p><b>Your anemia classification:</b> '+h(state.anemia)+'</p><ol>'+state.ddx.map((x,i)=>'<li>'+h(x)+' — <b>Next test:</b> '+h(state.next[i])+'</li>').join('')+'</ol><p>'+h(state.notes)+'</p>':work())+
'</div></details>'+
(state.submitted?'<details class="refbox refsection" open><summary>🔓 Interpretation & clinical reasoning</summary><div class="refsectionbody">'+review()+'</div></details>':'<div class="refprotected">🔒 Interpretation, prioritization and explanations unlock only after you submit your differential assessment.</div>')+
'<div class="refbuttons"><button type="button" data-ref-legacy="1">Existing Clinical Pathology cases</button><button type="button" data-ref-reset="1">Restart prototype</button></div></div>';
window.VPQ_REFERRAL_MODAL.show('🔬 Referral Patients · Clinical Pathology',content);
}
function home(){render()}
document.addEventListener('input',e=>{const n=e.target;if(!n.closest?.('.refcase'))return;if(n.hasAttribute('data-ref-text'))state[n.dataset.refText]=n.value;if(n.hasAttribute('data-ref-ddx'))state.ddx[+n.dataset.refDdx]=n.value;if(n.hasAttribute('data-ref-next'))state.next[+n.dataset.refNext]=n.value;save()});
document.addEventListener('click',e=>{const n=e.target.closest?.('[data-ref-panel],[data-ref-open],[data-ref-back],[data-ref-reset],[data-ref-submit],[data-ref-legacy]');if(!n)return;e.preventDefault();if(n.hasAttribute('data-ref-open'))return render();if(n.hasAttribute('data-ref-back'))return home();if(n.hasAttribute('data-ref-legacy'))return window.VPQ_REFERRAL_MODAL.legacy();if(n.hasAttribute('data-ref-panel')){state.view=n.dataset.refPanel;if(!state.opened.includes(state.view))state.opened.push(state.view);save();return render()}if(n.hasAttribute('data-ref-reset')){if(!confirm('Restart and clear your local prototype answers?'))return;state=fresh();save();return render()}if(n.hasAttribute('data-ref-submit')){if(!state.anemia.trim()||state.ddx.some(x=>!x.trim())||state.next.some(x=>!x.trim()))return alert('Complete the anemia classification and all three differential/next-test pairs first.');state.submitted=true;save();return render()}});
window.VPQ_CLINPATH_REFERRAL_PILOT={home,open:render};
})();