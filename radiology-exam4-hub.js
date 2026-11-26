/* Exam 4 radiology hub: small-animal thorax and cardiac (Dr. Lynn Griffin, L1–L8).
 * Lists the published Exam 4 lecture cases ("exam4-*") by topic and plays them in the shared case
 * player (photos → multiple choice → professor findings → answer keys, Back / Previous / Next).
 * Also links the thorax condition cards.
 */
(function(){'use strict';
const SECTIONS=[
 {icon:'🧩',title:'Start here · L8 putting it all together',desc:'Fred, Toto, Skittle, Shadow, Maeby and the pre-TPLO Lab: Dr. Griffin\'s capstone cases with her answers and in-class notes.',sections:['final']},
 {icon:'🫁',title:'Lung patterns',desc:'Bronchial, unstructured and structured interstitial, alveolar (air bronchogram, lobar sign), mixed.',sections:['patterns']},
 {icon:'📐',title:'Technique & look-alikes',desc:'Obliquity, obesity, underexposure, skin folds, expiration, atelectasis, and nodule mimics (osteomas, end-on vessels, nipples).',sections:['mimics']},
 {icon:'🩺',title:'Lung cases · signalment & history matter',desc:'L1–L3 patients: aspiration, histiocytic sarcoma, cat asthma vs metastasis, lymphoma, puffballs, blastomycosis, metastases.',sections:['lung']},
 {icon:'❤️',title:'Heart & vessels',desc:'Chamber enlargement, left vs right failure, edema in dogs vs cats, DCM, heartworm, pericardial effusion, congenital disease, vessel patterns.',sections:['heart']},
 {icon:'🫀',title:'Pleura, mediastinum, esophagus, trachea, diaphragm & ribs',desc:'Effusion, pneumothorax, mediastinal shift and masses, lymph nodes, megaesophagus, PRAA, foreign bodies, tracheal collapse, hernias, rib lesions.',sections:['cavity']},
 {icon:'📋',title:'Numbered lecture cases (L6–L7)',desc:'Cases 3–9 with the professor\'s case notes as the key.',sections:['cases']}
];
let api=null;
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slideNum=c=>{const m=String(c.title).match(/slide (\d+)/);return m?+m[1]:0};
const label=c=>String(c.title).replace(/^Exam 4 · /,'');
function cases(){return (window.VPQ_IMAGING_PUBLISH?.getCases?.()||[]).filter(c=>/^exam4-/.test(String(c.id))&&c.images?.some(i=>i.url))}
function grouped(){
 const all=cases();
 return SECTIONS.map(s=>({s,list:all.filter(c=>(s.slots||[]).includes(c.imageReviewSlot)||(s.sections||[]).includes(c.exam4Section)).sort((a,b)=>(a.exam4Order||0)-(b.exam4Order||0))})).filter(g=>g.list.length);
}
function flat(){return grouped().flatMap(g=>g.list)}
function play(id){
 const list=flat(),i=Math.max(0,list.findIndex(c=>c.id===id));
 window.VPQ_RADIOLOGY_CASE_PLAYER?.open?.(list,i,{title:'Exam 4 · Thorax',icon:'🫁',backLabel:'Exam 4 list',onBack:render});
}
function render(){
 const groups=grouped(),total=groups.reduce((n,g)=>n+g.list.length,0),prog=window.VPQ_RADIOLOGY_CASE_PLAYER?.progress?.()||{};
 const seen=id=>prog[id]?.opened,ok=id=>prog[id]?.correct;
 if(!total){api.showModal('🫁 Exam 4 · Thorax & cardiac','<p>Exam 4 cases are still loading or not yet published. Try again in a moment.</p><button type="button" data-vpqexam4="back">← X-ray hub</button>');return}
 const all=groups.flatMap(g=>g.list),opened=all.filter(c=>seen(c.id)).length,mastered=all.filter(c=>ok(c.id)).length;
 const sec=groups.map(({s,list})=>'<section style="background:#f7f4fc;border:1px solid #e2dcef;border-radius:14px;padding:12px;margin:0 0 12px"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b style="font-size:15px;color:#3b4b71">'+s.icon+' '+E(s.title)+'</b><small style="color:#5d6d84">'+list.filter(c=>seen(c.id)).length+' / '+list.length+' opened</small></div><p style="margin:5px 0 10px;font-size:12px;color:#53647c">'+E(s.desc)+'</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:8px">'+
  list.map(c=>{const views=c.images.filter(i=>!/\bannotat(?:ed|ion)\b/i.test((i.view||'')+' '+(i.caption||''))).length;
   return '<button type="button" data-vpqexam4-play="'+E(c.id)+'" style="text-align:left;padding:10px 11px;background:#fff;border:1px solid '+(ok(c.id)?'#2e9a57':seen(c.id)?'#9fd3b5':'#d8dfea')+';border-radius:10px;min-height:58px"><strong style="display:block;font-size:12.5px;color:#344f78">'+(ok(c.id)?'⭐ ':seen(c.id)?'✓ ':'')+E(label(c))+'</strong><small style="color:#68788a">'+E(c.species||'')+(c.region?' · '+E(c.region):'')+' · '+views+' view'+(views===1?'':'s')+(c.answer?' · multiple choice':'')+'</small></button>'}).join('')+'</div></section>').join('');
 api.showModal('🫁 Exam 4 · Thorax & cardiac',
  '<div style="font-size:13px;color:#354967;line-height:1.55"><div class="buttonrow" style="margin-bottom:10px">'+
  '<button type="button" data-vpqexam4="back">← X-ray hub</button><button type="button" data-vpqexam4="start">▶ Start from the first case</button><button type="button" data-vpqexam4="conditions">🃏 Condition cards · Thorax</button></div>'+
  '<div style="background:linear-gradient(120deg,#f4eaff,#eaf9f5);padding:12px 14px;border:1px solid #e0d6ed;border-radius:13px;margin-bottom:12px"><b>Each case:</b> look at every view → pick the diagnosis (or write your findings) → read the professor\'s findings → open the answer keys (annotated lecture slides, comparison films and, where helpful, a marked textbook radiograph 📘). Use <b>Previous / Next</b> to move through a topic. <span style="color:#5d6d84">'+opened+' of '+total+' opened · '+mastered+' answered correctly.</span></div>'+
  sec+'<p style="font-size:11px;color:#6b7a90">LMU CVM 743 course radiographs (Dr. Lynn Griffin) and textbook figures from your Labeled_rads notes, used with LMU permission for non-commercial study. Images are lecture-slide copies, so don\'t measure from them.</p></div>');
}
function open(){return (window.VPQ_IMAGING_PUBLISH?.load?.()||Promise.resolve()).then(render).catch(render)}
function init(ctx){
 api=ctx;if(api.body.__vpqExam4Init)return;api.body.__vpqExam4Init=true;
 api.body.addEventListener('click',e=>{
  const p=e.target.closest('[data-vpqexam4-play]');if(p){e.preventDefault();return play(p.dataset.vpqexam4Play)}
  const b=e.target.closest('[data-vpqexam4]');if(!b)return;e.preventDefault();
  const k=b.dataset.vpqexam4;
  if(k==='back')return window.VPQ_IMAGING_SUITE?.xrayHome?.();
  if(k==='start'){const l=flat();return l.length&&play(l[0].id)}
    if(k==='conditions')return window.VPQ_RADIOLOGY_CONDITIONS?.open?.('Thorax',{backLabel:'Exam 4',onBack:open});
 });
}
window.VPQ_RADIOLOGY_EXAM4=Object.freeze({init,open});
})();
