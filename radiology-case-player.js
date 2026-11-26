/* Shared radiology case player (Exam 2 / Exam 3 lecture cases).
 * Plays a list of published imaging cases one at a time:
 *   images (tap to enlarge) → pick-the-diagnosis multiple choice → reveal professor findings
 *   → optional annotated lecture slide, with Back / Previous / Next navigation.
 * Uses the existing published-case data (VPQ_IMAGING_PUBLISH). Graded colours follow the
 * project rule: GREEN for correct, ORANGE for incorrect, neutral before answering.
 * Study XP: first correct answer per case via the game's awardQuestion (no repeat farming).
 */
(function(){'use strict';
let api=null,list=[],at=0,opts={},chosen=null,revealed=false,showKey=false,notes='';
const NS='radiology-lecture-case-mc';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isKey=v=>/\bannotat(?:ed|ion)\b/i.test((v.view||'')+' '+(v.caption||''));
const PROG='vpq-lecture-case-progress-v1';
function prog(){try{return JSON.parse(localStorage.getItem(PROG)||'{}')||{}}catch(e){return {}}}
function saveProg(id,val){try{const p=prog();p[id]=Object.assign({},p[id],val);localStorage.setItem(PROG,JSON.stringify(p))}catch(e){}}
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function options(c){
 if(!c.answer)return null;
 const own=norm(c.answer),seen=new Set([own]),pick=[];
 const add=x=>{const n=norm(x);if(!x||seen.has(n))return;seen.add(n);pick.push(x)};
 const exam=(String(c.id).match(/^exam(\d)/)||[])[1];
 const global=(window.VPQ_IMAGING_PUBLISH?.getCases?.()||[]).filter(x=>x.answer&&exam&&String(x.id).startsWith('exam'+exam));
 const sec=x=>x.exam2Section||x.exam3Section||x.exam4Section||x.imageReviewSlot;
 const pools=[list.filter(x=>x.imageReviewSlot&&x.imageReviewSlot===c.imageReviewSlot),list.filter(x=>sec(x)===sec(c)),global.filter(x=>sec(x)===sec(c)),list,global];
 for(const pool of pools){const sorted=pool.filter(x=>x.id!==c.id&&x.answer).sort((a,b)=>hash(c.id+a.id)-hash(c.id+b.id));for(const x of sorted){if(pick.length>=3)break;add(x.answer)}if(pick.length>=3)break}
 if(pick.length<2)return null;
 const all=[c.answer,...pick];const r=hash(c.id)%all.length;return all.slice(r).concat(all.slice(0,r));
}
function btn(k,label,extra=''){return '<button type="button" data-vpqplay="'+k+'" '+extra+'>'+label+'</button>'}
function nav(){
 const n=list.length;
 return '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">'+btn('back','← '+E(opts.backLabel||'Back'))+btn('prev','‹ Previous',at===0?'disabled':'')+btn('next','Next ›',at>=n-1?'disabled':'')+'<small style="color:#5d6d84;margin-left:auto">Case '+(at+1)+' of '+n+'</small></div>';
}
function imgs(c){
 const views=(c.images||[]).filter(v=>v.url&&!isKey(v));
 return '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:8px;margin:10px 0">'+views.map(v=>'<figure style="margin:0;background:#202a3b;border-radius:10px;overflow:hidden"><a href="'+E(v.url)+'" target="_blank" rel="noopener" title="Open full size"><img loading="lazy" src="'+E(v.url)+'" alt="'+E(v.view||'Radiograph')+'" style="display:block;width:100%;max-height:420px;object-fit:contain;background:#202a3b"></a><figcaption style="background:#eef2f8;color:#344f78;font-size:11.5px;padding:6px 8px"><b>'+E(v.view||'View')+'</b>'+(revealed&&v.caption?' · '+E(v.caption):' · tap to enlarge')+'</figcaption></figure>').join('')+'</div>';
}
function mc(c){
 const o=options(c);
 if(!o)return '<div style="border:1px solid #dbe2f0;border-radius:12px;background:#f4f8ff;padding:11px;margin:10px 0"><b>✍️ Your findings</b><p style="font-size:12px;margin:4px 0">'+(c.answer?'':'This case has no answer key in the course source, so there is no multiple choice. ')+'Write projection, anatomy and Roentgen signs, then reveal.</p><textarea data-vpqplay-notes rows="3" style="width:100%;box-sizing:border-box" placeholder="Where? Opacity? Distribution? What does the pattern suggest?">'+E(notes)+'</textarea></div>';
 return '<div style="border:1px solid #dacfe8;background:#f7f1fd;padding:11px;border-radius:12px;margin:10px 0"><b>🎯 Pick the best answer</b><p style="font-size:12px;margin:4px 0">Look at every view first. Which of these best matches the radiographs?</p>'+o.map((x,i)=>{
  let st='background:#fff;border:1px solid #d8dfea;color:#344f78';
  if(chosen!==null){if(x===c.answer)st='background:#e3f6e8;border:2px solid #2e9a57;color:#1d5e36';else if(i===chosen)st='background:#fff0e0;border:2px solid #e07b1a;color:#8a4a0c';else st='background:#fafafa;border:1px solid #e3e6ee;color:#8a95a8'}
  return '<button type="button" data-vpqplay="pick-'+i+'" aria-disabled="'+(chosen!==null)+'" style="display:block;width:100%;text-align:left;margin:6px 0;padding:10px 12px;border-radius:10px;font-weight:700;opacity:1;cursor:'+(chosen!==null?'default':'pointer')+';'+st+'">'+'ABCD'[i]+'. '+E(x)+(chosen!==null&&x===c.answer?' ✓':'')+'</button>'}).join('')+
  (chosen!==null?'<p style="margin:6px 0 0;font-weight:700;color:'+(o[chosen]===c.answer?'#1d5e36':'#8a4a0c')+'">'+(o[chosen]===c.answer?'✓ Correct.':'Not quite. The answer is highlighted in green.')+(opts.lastReward?' '+E(opts.lastReward):'')+'</p>':'')+'</div>';
}
function answerPanel(c){
 if(!revealed)return '<div class="buttonrow">'+btn('reveal','🔎 Reveal findings & interpretation')+'</div>';
 const keys=(c.images||[]).filter(v=>v.url&&isKey(v));
 const sec=(t,v)=>v?'<h3 style="font-size:14px;margin:10px 0 4px">'+t+'</h3><p style="margin:0;white-space:pre-line">'+E(v)+'</p>':'';
 const kl=keys.length===1?'annotated lecture slide':'answer keys ('+keys.length+': lecture slides, comparisons, textbook)';
 const fig=v=>'<figure style="margin:8px 0 0"><a href="'+E(v.url)+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(v.url)+'" alt="'+E(v.view||'Answer key')+'" style="width:100%;border-radius:10px;border:1px solid #cfd8e6"></a><figcaption style="font-size:11px;color:#5d6d84"><b>'+E(String(v.view||'').replace(/^Annotated (teaching key|comparison|textbook view) · /,function(m,k){return {'teaching key':'Lecture slide · ','comparison':'Comparison · ','textbook view':'📘 Textbook · '}[k]}))+'</b>'+(v.caption?' — '+E(v.caption):'')+'</figcaption></figure>';
 return '<div style="background:#f0f9f5;border:1px solid #cce4db;border-radius:12px;padding:13px;margin:10px 0">'+sec('Findings',c.findings)+sec('Interpretation',c.interpretation)+sec('Differentials',c.differentials)+sec('Next step',c.next)+
  (keys.length?'<div class="buttonrow" style="margin-top:10px">'+btn('key',showKey?'🙈 Hide '+kl:'🖼️ Show '+kl)+'</div>'+(showKey?keys.map(fig).join(''):''):'')+
  '<p style="font-size:11px;color:#6b7a90;margin:10px 0 0">'+E(c.source||'')+(c.credit?' · '+E(c.credit):'')+'</p></div>';
}
function render(){
 const c=list[at];if(!c)return opts.onBack?.();
 const p=prog()[c.id]||{};
 api.showModal((opts.icon||'🩻')+' '+(opts.title||'Radiology case'),'<div style="font-size:13px;color:#354967;line-height:1.55">'+nav()+
  '<h2 style="font-size:16px;margin:10px 0 2px;color:#3b4b71">'+(opts.hideTitle&&!revealed?'Film '+(at+1):E(String(c.title).replace(/^Exam \d · /,'')))+'</h2>'+
  '<p style="margin:0 0 6px;color:#7d6595;font-size:12px">'+(opts.hideTitle&&!revealed?[c.species,c.region]:[c.species,c.region,c.lecture]).filter(Boolean).map(E).join(' · ')+(p.correct?' · <b style="color:#1d5e36">✓ mastered</b>':'')+'</p>'+
  (c.history?'<div style="border:1px solid #dbe2f0;border-radius:12px;background:#f4f8ff;padding:10px 12px"><b>🏥 History</b><p style="margin:4px 0 0">'+E(c.history)+'</p></div>':'')+
  imgs(c)+mc(c)+answerPanel(c)+
  (c.studyImageReview?.note?'<p style="font-size:11px;color:#8a6d3b">'+E(c.studyImageReview.note)+'</p>':'')+nav()+'</div>');
 try{api.body.scrollTop=0}catch(e){}
}
function go(i){at=Math.max(0,Math.min(list.length-1,i));chosen=null;revealed=false;showKey=false;notes='';opts.lastReward='';saveProg(list[at].id,{opened:true});render()}
function open(cases,index=0,options={}){list=cases.slice();opts=Object.assign({},options);go(index)}
function init(ctx){
 api=ctx;if(api.body.__vpqPlayerInit)return;api.body.__vpqPlayerInit=true;
 api.body.addEventListener('input',e=>{if(e.target.matches?.('[data-vpqplay-notes]'))notes=e.target.value});
 api.body.addEventListener('click',e=>{
  const b=e.target.closest('[data-vpqplay]');if(!b||b.disabled)return;e.preventDefault();
  const k=b.dataset.vpqplay,c=list[at];
  if(k==='back')return opts.onBack?.();
  if(k==='prev')return go(at-1);
  if(k==='next')return go(at+1);
  if(k==='reveal'){revealed=true;return render()}
  if(k==='key'){showKey=!showKey;return render()}
  if(k.startsWith('pick-')&&chosen===null){
   chosen=+k.slice(5);const o=options(c)||[];const ok=o[chosen]===c.answer;revealed=true;
   saveProg(c.id,ok?{correct:true}:{tried:true});
   try{const r=api.awardQuestion?.(NS,c.id,ok);opts.lastReward=r&&r.xp?'+'+r.xp+' study XP':''}catch(err){opts.lastReward=''}
   return render();
  }
 });
}
window.VPQ_RADIOLOGY_CASE_PLAYER=Object.freeze({init,open,progress:prog});
})();
