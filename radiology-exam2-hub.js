/* Exam 2 radiology hub: abdomen, GI and GU.
 * Lists the published Exam 2 lecture cases ("exam2-*") by topic and plays them in the shared case
 * player (photos → multiple choice → professor findings → annotated slide, Back / Previous / Next).
 * Also links the existing Abdomen Lab practice questions and the abdomen condition cards.
 */
(function(){'use strict';
const SECTIONS=[
 {icon:'🩺',title:'Start here · course cases',desc:'The three Abdomen Cases from class, with the professor\'s in-class notes as the key. Includes the equivocal hair-tie cat.',sections:['start']},
 {icon:'🫃',title:'Normal abdomen',desc:'Standard views and normal liver, spleen, kidneys, bladder, stomach and colon.',sections:['normal']},
 {icon:'🔎',title:'Abdominal principles',desc:'Serosal and retroperitoneal detail, mass effect, free gas, liver and spleen size.',sections:['abd']},
 {icon:'🌭',title:'GI tract',desc:'GDV, mechanical versus functional ileus, linear foreign bodies and the colon.',sections:['gi']},
 {icon:'💧',title:'Genitourinary',desc:'Retroperitoneal masses, kidneys, uroliths and bladder gas, uterus and prostate.',sections:['gu']}
];
let api=null;
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slideNum=c=>{const m=String(c.title).match(/slide (\d+)/);return m?+m[1]:0};
const label=c=>String(c.title).replace(/^Exam 2 · /,'');
function cases(){return (window.VPQ_IMAGING_PUBLISH?.getCases?.()||[]).filter(c=>/^exam2-/.test(String(c.id))&&c.images?.some(i=>i.url))}
function grouped(){
 const all=cases();
 return SECTIONS.map(s=>({s,list:all.filter(c=>(s.slots||[]).includes(c.imageReviewSlot)||(s.sections||[]).includes(c.exam2Section))
  .sort((a,b)=>((s.slots||[]).indexOf(a.imageReviewSlot)-(s.slots||[]).indexOf(b.imageReviewSlot))||String(a.lecture).localeCompare(String(b.lecture))||slideNum(a)-slideNum(b))})).filter(g=>g.list.length);
}
function flat(){return grouped().flatMap(g=>g.list)}
function play(id){
 const list=flat(),i=Math.max(0,list.findIndex(c=>c.id===id));
 window.VPQ_RADIOLOGY_CASE_PLAYER?.open?.(list,i,{title:'Exam 2 · Abdomen',icon:'🫃',backLabel:'Exam 2 list',onBack:render});
}
function render(){
 const groups=grouped(),total=groups.reduce((n,g)=>n+g.list.length,0),prog=window.VPQ_RADIOLOGY_CASE_PLAYER?.progress?.()||{};
 const seen=id=>prog[id]?.opened,ok=id=>prog[id]?.correct;
 if(!total){api.showModal('🫃 Exam 2 · Abdomen, GI & GU','<p>Exam 2 cases are still loading or not yet published. Try again in a moment.</p><button type="button" data-vpqexam2="back">← X-ray hub</button>');return}
 const all=groups.flatMap(g=>g.list),opened=all.filter(c=>seen(c.id)).length,mastered=all.filter(c=>ok(c.id)).length;
 const sec=groups.map(({s,list})=>'<section style="background:#f7f4fc;border:1px solid #e2dcef;border-radius:14px;padding:12px;margin:0 0 12px"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b style="font-size:15px;color:#3b4b71">'+s.icon+' '+E(s.title)+'</b><small style="color:#5d6d84">'+list.filter(c=>seen(c.id)).length+' / '+list.length+' opened</small></div><p style="margin:5px 0 10px;font-size:12px;color:#53647c">'+E(s.desc)+'</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:8px">'+
  list.map(c=>{const views=c.images.filter(i=>!/\bannotat(?:ed|ion)\b/i.test((i.view||'')+' '+(i.caption||''))).length;
   return '<button type="button" data-vpqexam2-play="'+E(c.id)+'" style="text-align:left;padding:10px 11px;background:#fff;border:1px solid '+(ok(c.id)?'#2e9a57':seen(c.id)?'#9fd3b5':'#d8dfea')+';border-radius:10px;min-height:58px"><strong style="display:block;font-size:12.5px;color:#344f78">'+(ok(c.id)?'⭐ ':seen(c.id)?'✓ ':'')+E(label(c))+'</strong><small style="color:#68788a">'+E(c.species||'')+(c.region?' · '+E(c.region):'')+' · '+views+' view'+(views===1?'':'s')+(c.answer?' · multiple choice':'')+'</small></button>'}).join('')+'</div></section>').join('');
 api.showModal('🫃 Exam 2 · Abdomen, GI & GU',
  '<div style="font-size:13px;color:#354967;line-height:1.55"><div class="buttonrow" style="margin-bottom:10px">'+
  '<button type="button" data-vpqexam2="back">← X-ray hub</button><button type="button" data-vpqexam2="start">▶ Start from the first case</button><button type="button" data-vpqexam2="lab">🧪 Abdomen Lab practice questions</button><button type="button" data-vpqexam2="conditions">🃏 Condition cards · Abdomen</button></div>'+
  '<div style="background:linear-gradient(120deg,#f4eaff,#eaf9f5);padding:12px 14px;border:1px solid #e0d6ed;border-radius:13px;margin-bottom:12px"><b>Each case:</b> look at every view → pick the diagnosis (or write your findings) → read the professor\'s findings → open the annotated lecture slide. Use <b>Previous / Next</b> to move through a topic. <span style="color:#5d6d84">'+opened+' of '+total+' opened · '+mastered+' answered correctly.</span></div>'+
  sec+'<p style="font-size:11px;color:#6b7a90">LMU CVM 743 course radiographs, used with LMU permission for non-commercial study. Images are lecture-slide copies, so don\'t measure from them.</p></div>');
}
function open(){return (window.VPQ_IMAGING_PUBLISH?.load?.()||Promise.resolve()).then(render).catch(render)}
function init(ctx){
 api=ctx;if(api.body.__vpqExam2Init)return;api.body.__vpqExam2Init=true;
 api.body.addEventListener('click',e=>{
  const p=e.target.closest('[data-vpqexam2-play]');if(p){e.preventDefault();return play(p.dataset.vpqexam2Play)}
  const b=e.target.closest('[data-vpqexam2]');if(!b)return;e.preventDefault();
  const k=b.dataset.vpqexam2;
  if(k==='back')return window.VPQ_IMAGING_SUITE?.xrayHome?.();
  if(k==='start'){const l=flat();return l.length&&play(l[0].id)}
  if(k==='lab')return window.VPQ_ABDOMINAL_CHALLENGES?.open?.();
  if(k==='conditions')return window.VPQ_RADIOLOGY_CONDITIONS?.open?.('Abdomen',{backLabel:'Exam 2',onBack:open});
 });
}
window.VPQ_RADIOLOGY_EXAM2=Object.freeze({init,open});
})();
