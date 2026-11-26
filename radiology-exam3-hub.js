/* Exam 3 radiology hub: MSK, skull and spine.
 * Lists the published Exam 3 course cases (ids "exam3-*") grouped by lecture topic.
 * Cases open in the existing published-case viewer (data-vpqipub="open:<id>"), so reveal,
 * annotated keys, rights notes and owner editing all keep working unchanged.
 * Progress ("opened") is a per-browser convenience only and is never required.
 */
(function(){'use strict';
const SECTIONS=[
 {icon:'🩺',title:'Start here · practice cases',desc:'Three whole patients from the MSK practice-case slides. Describe both views before you reveal.',slots:['e3-practice-hip-gsd','e3-practice-mastiff-forelimb','e3-practice-puppy-lameness']},
 {icon:'🦴',title:'MSK I · bone density, joints and development',desc:'Osteopenia, stifle effusion and degenerative joint disease, shoulder OCD and elbow dysplasia.',slots:['e3-bone-osteopenia','e3-djd-stifle','e3-ocd-shoulder','e3-bsava-elbow']},
 {icon:'🔥',title:'MSK II · aggressive vs non-aggressive bone',desc:'Lysis patterns, periosteal reactions, infection versus neoplasia, and fracture chronicity.',slots:['e3-msk2-lysis-pattern','e3-msk2-periosteal','e3-bsava-infection-neoplasm','e3-bsava-healing']},
 {icon:'🧠',title:'Skull & spine',desc:'Skull and nasal disease, congenital vertebral anomalies, discospondylitis, disc disease, neoplasia and trauma.',slots:['e3-skull-spine']}
];
const KEY='vpq-exam3-opened-v1';
let api=null;
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function opened(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}}
function markOpened(id){try{const o=opened();o[id]=1;localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
function cases(){return (window.VPQ_IMAGING_PUBLISH?.getCases?.()||[]).filter(c=>String(c.id).startsWith('exam3-')&&c.images?.some(i=>i.url))}
function slideNum(c){const m=String(c.title).match(/slide (\d+)/);return m?+m[1]:0}
function label(c){return String(c.title).replace(/^Exam 3 · /,'')}
function render(){
 const all=cases(),seen=opened();
 const done=all.filter(c=>seen[c.id]).length;
 if(!all.length){api.showModal('🦴 Exam 3 · MSK, skull & spine','<p>Exam 3 cases are still loading or not yet published. Try again in a moment.</p><button type="button" data-vpqexam3="back">← X-ray hub</button>');return}
 const sec=SECTIONS.map(s=>{
  const list=all.filter(c=>s.slots.includes(c.imageReviewSlot)).sort((a,b)=>s.slots.indexOf(a.imageReviewSlot)-s.slots.indexOf(b.imageReviewSlot)||String(a.lecture).localeCompare(String(b.lecture))||slideNum(a)-slideNum(b));
  if(!list.length)return '';
  const n=list.filter(c=>seen[c.id]).length;
  return '<section style="background:#f7f4fc;border:1px solid #e2dcef;border-radius:14px;padding:12px;margin:0 0 12px"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b style="font-size:15px;color:#3b4b71">'+s.icon+' '+E(s.title)+'</b><small style="color:#5d6d84">'+n+' / '+list.length+' opened</small></div><p style="margin:5px 0 10px;font-size:12px;color:#53647c">'+E(s.desc)+'</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:8px">'+
  list.map(c=>{const views=c.images.filter(i=>!/\bannotat(?:ed|ion)\b/i.test((i.view||'')+' '+(i.caption||''))).length;
   return '<button type="button" data-vpqipub="open:'+E(c.id)+'" data-vpqexam3-open="'+E(c.id)+'" style="text-align:left;padding:10px 11px;background:#fff;border:1px solid '+(seen[c.id]?'#9fd3b5':'#d8dfea')+';border-radius:10px;min-height:58px"><strong style="display:block;font-size:12.5px;color:#344f78">'+(seen[c.id]?'✓ ':'')+E(label(c))+'</strong><small style="color:#68788a">'+E(c.species||'')+(c.region?' · '+E(c.region):'')+' · '+views+' view'+(views===1?'':'s')+'</small></button>'}).join('')+'</div></section>';
 }).join('');
 api.showModal('🦴 Exam 3 · MSK, skull & spine',
  '<div style="font-size:13px;color:#354967;line-height:1.55"><div class="buttonrow" style="margin-bottom:10px"><button type="button" data-vpqexam3="back">← X-ray hub</button></div>'+
  '<div style="background:linear-gradient(120deg,#f4eaff,#eaf9f5);padding:12px 14px;border:1px solid #e0d6ed;border-radius:13px;margin-bottom:12px"><b>How to use each case:</b> look at every view → write your findings (projection, anatomy, Roentgen signs) → press <b>Reveal</b> → open the <b>annotated lecture slide</b> to check. <span style="color:#5d6d84">'+done+' of '+all.length+' cases opened.</span></div>'+
  sec+'<p style="font-size:11px;color:#6b7a90">LMU CVM 743 course radiographs, used with LMU permission for non-commercial study. Images are lecture-slide copies, so don\'t measure from them.</p></div>');
}
function open(){return (window.VPQ_IMAGING_PUBLISH?.load?.()||Promise.resolve()).then(render).catch(render)}
function init(ctx){
 api=ctx;if(api.body.__vpqExam3Init)return;api.body.__vpqExam3Init=true;
 // capture phase: record "opened" before the publisher's handler stops propagation
 api.body.addEventListener('click',e=>{
  const o=e.target.closest('[data-vpqexam3-open]');if(o)markOpened(o.dataset.vpqexam3Open);
  const b=e.target.closest('[data-vpqexam3]');if(!b)return;e.preventDefault();
  if(b.dataset.vpqexam3==='back')return window.VPQ_IMAGING_SUITE?.xrayHome?.();
 },true);
}
window.VPQ_RADIOLOGY_EXAM3=Object.freeze({init,open});
})();
