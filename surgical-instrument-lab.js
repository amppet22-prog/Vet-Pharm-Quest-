/* Surgical instrument ID — introductory, educational; keeps course-specific technique for later. */
(function(){
'use strict';
const tools=[
 {name:'Scalpel handle and blade',role:'Controlled surgical incisions',avoid:'A blade is not used for blunt dissection or grasping tissue.',hint:'Cutting'},
 {name:'Mayo scissors',role:'Cutting relatively tough tissue or suture, depending on the instrument and purpose',avoid:'Do not use delicate tissue scissors for suture or thick material.',hint:'Cutting'},
 {name:'Metzenbaum scissors',role:'Dissecting and cutting delicate soft tissues',avoid:'Avoid using these fine scissors for cutting suture.',hint:'Dissection'},
 {name:'Adson-Brown tissue forceps',role:'Atraumatic handling of delicate tissues',avoid:'Select an appropriate forceps to avoid crushing fragile tissue.',hint:'Grasping'},
 {name:'Halsted mosquito hemostats',role:'Clamping small vessels or holding delicate material temporarily',avoid:'Not a substitute for reliable ligation and confirmed hemostasis.',hint:'Hemostasis'},
 {name:'Carmalt forceps',role:'Occlusion/clamping of pedicles or tissue bundles during appropriate procedures',avoid:'Never clamp an unidentified structure blindly.',hint:'Pedicle control'},
 {name:'Mayo-Hegar needle holder',role:'Securely holding a surgical needle during suturing',avoid:'Not intended for routine tissue grasping.',hint:'Suturing'},
 {name:'Backhaus towel clamp',role:'Securing surgical drapes and towels',avoid:'Do not place on tissue unless specifically appropriate to the intended use.',hint:'Draping'},
 {name:'Suction tip and tubing',role:'Removing fluid to maintain visualization of the field',avoid:'Avoid traumatic suction contact with tissue.',hint:'Visibility'}
];
let ix=0,score=0,answered=false,firstWrong=false;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const style=document.createElement('style');style.textContent=
'#vpqSurgToolWrap{position:fixed;inset:0;z-index:100001;background:#1d3659a8;display:flex;align-items:center;justify-content:center;padding:12px}'+
'#vpqSurgToolWrap .panel{width:min(650px,100%);max-height:92vh;overflow-y:auto;border-radius:19px;background:#fffdfc;border:3px solid #b6d8d6;padding:20px;box-shadow:0 19px 48px #243c5a77;color:#35516c;font-family:ui-rounded,"Trebuchet MS",Arial,sans-serif}'+
'#vpqSurgToolWrap button{padding:10px;border:2px solid #bfd2df;background:#f9fcff;color:#35516c;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer}'+
'#vpqSurgToolWrap .choice{display:block;width:100%;text-align:left;margin:8px 0}'+
'#vpqSurgToolWrap .feedback{margin:12px 0;padding:11px;border:1px solid #b8d8d2;border-radius:10px;background:#eaf8f4;line-height:1.5}';document.head.append(style);
let host;
function close(){host?.remove();host=null;document.removeEventListener('keydown',escKey,true)}
function escKey(e){if(e.key==='Escape'){e.stopPropagation();close()}}
function render(){
 if(!host)return;
 const entry=tools[ix], distractors=tools.filter((v,k)=>k!==ix);
 const idxs=[(ix+2)%tools.length,(ix+4)%tools.length,(ix+6)%tools.length].filter(i=>i!==ix).slice(0,3);
 const opts=[entry,...idxs.map(i=>tools[i])].sort((a,b)=>((a.name.charCodeAt(0)*13+ix)%17)-((b.name.charCodeAt(0)*13+ix)%17));
 host.innerHTML='<div class="panel" role="dialog" aria-modal="true" aria-labelledby="vpqSurgToolHeading"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><h2 id="vpqSurgToolHeading" style="margin:0;font-size:20px">🪡 Surgical Tool ID</h2><button data-close aria-label="Close">✕</button></div><p style="font-size:12px;color:#6c8193">Introductory recognition practice · '+(ix+1)+' of '+tools.length+'</p>'+
 '<p><strong>Which instrument is mainly used for this task?</strong></p><p style="background:#f0f7fa;border-radius:12px;padding:13px">'+escape(entry.role)+'</p>'+
 '<div id="vpqSurgToolChoices">'+opts.map(o=>'<button class="choice" data-choice="'+tools.indexOf(o)+'">'+escape(o.name)+'</button>').join('')+'</div><div id="vpqSurgToolFeedback" aria-live="polite"></div>'+
 '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button data-next disabled>'+(ix===tools.length-1?'Finish':'Next instrument →')+'</button><button data-prep>Review sterile prep</button><button data-skills>Clinical Skills room</button></div>'+
 '<p style="font-size:11px;color:#687d91">These are general instrument functions, not a substitute for practical technique, faculty teaching, or facility protocols. Illustrated identification can be expanded when verified image references are available.</p></div>';
 host.querySelector('[data-close]').onclick=close;
 host.querySelector('[data-prep]').onclick=()=>{close();window.VPQ_SURGERY_NECROPSY?.start('prep')};
 host.querySelector('[data-skills]').onclick=()=>{close();if(typeof window.VPQ_SURGERY_SKILLS_NAV==='function')window.VPQ_SURGERY_SKILLS_NAV();};
 host.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{
 const good=Number(b.dataset.choice)===ix;
 if(!good&&!answered)firstWrong=true;
 const feed=host.querySelector('#vpqSurgToolFeedback');
 feed.innerHTML='<div class="feedback"><strong>'+(good?'Correct!':'Not quite — try again.')+'</strong><p>'+escape(entry.name)+': '+escape(entry.role)+'.</p><p><strong>Safety:</strong> '+escape(entry.avoid)+'</p></div>';
 if(good){answered=true;if(!firstWrong)score++;host.querySelectorAll('[data-choice]').forEach(x=>x.disabled=true);host.querySelector('[data-next]').disabled=false}
 });
 host.querySelector('[data-next]').onclick=()=>{if(ix===tools.length-1){host.querySelector('.panel').innerHTML='<h2>Tool ID complete!</h2><p>Correct on first attempt: '+score+' / '+tools.length+'</p><p>Use these as an introduction before supervised practical handling.</p><button data-done>Return to Surgery</button><button data-again>Practice again</button>';host.querySelector('[data-done]').onclick=close;host.querySelector('[data-again]').onclick=()=>{ix=0;score=0;answered=false;firstWrong=false;render()};return}ix++;answered=false;firstWrong=false;render()};
}
function open(){close();ix=0;score=0;answered=false;firstWrong=false;host=document.createElement('div');host.id='vpqSurgToolWrap';document.body.append(host);document.addEventListener('keydown',escKey,true);render()}
window.VPQ_SURGICAL_TOOL_LAB={open};
})();