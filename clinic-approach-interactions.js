/* Vet Pharm Quest: consistent approach-to-interact for existing illustrated rooms.
 * Keeps existing DOM event handlers for each custom room, equipment and menu.
 * No changes to progression, currencies, item ownership or persistence.
 */
window.VPQ_ROOM_INTERACTIONS=function(api){
'use strict';
const stage=document.getElementById('stage');
const toast=document.getElementById('interactToast');
if(!stage)return {updateNearby:()=>null,interactNearest:()=>false};
const configs={
 reception:[
  {selector:'#vpqShadowHotspots [data-shadowaction="welcome"]',x:20,label:'🛎️ Front Desk'},
  {selector:'#vpqShadowHotspots [data-shadowaction="queue"]',x:87,label:'📋 Patient Queue'},
  {selector:'#vpqShadowHotspots [data-shadowaction="vpqGoExam"]',x:31,label:'🚪 Exam Hall'},
  {selector:'#vpqShadowHotspots [data-shadowaction="vpqGoPharmacy"]',x:75,label:'💊 Pharmacy'},
  {selector:'#vpqShadowHotspots [data-shadowaction="vpqGoStudy"]',x:53,label:'📚 Study Lounge'},
  {selector:'#vpqShadowHotspots [data-shadowaction="receptionStudio"]',x:96,label:'🎨 Reception Studio',max:7}
 ],
 exam:[
  {selector:'#vpqExamHotspots [data-vpqexamaction="medicalCharts"]',x:34,label:'📋 Patient Charts'},
  {selector:'#vpqExamHotspots [data-vpqexamaction="patients"]',x:76,label:'🩺 Examination Table'},
  {selector:'#vpqExamHotspots [data-vpqexamaction="protocols"]',x:57,label:'📖 Clinical Protocols'}
 ],
 pharmacy:[
  {selector:'#vpqPNHotspots [data-vpqpnaction="pharmacy"]',x:21,label:'💊 Drug Shelves'},
  {selector:'#vpqPNHotspots [data-vpqpnaction="vpqNutritionGuide"]',x:53,label:'🥣 Pet Nutrition'},
  {selector:'#vpqPNHotspots [data-vpqpnaction="vpqToxPreview"]',x:82,label:'☣️ Toxicology Book'},
  {selector:'#vpqPNHotspots [data-vpqpnaction="vpqMechEnter"]',x:95,label:'🔬 Mechanism Lab',max:9}
 ],
 study:[
  {selector:'#vpqLoungeHotspots [data-vpqstudyaction="study"]',x:51,label:'📖 Study Desk'},
  {selector:'#vpqLoungeHotspots [data-vpqstudyaction="masteryTracker"]',x:35,label:'🏆 Mastery Tracker'},
  {selector:'#vpqLoungeHotspots [data-vpqstudyaction="learningHub"]',x:84,label:'🕹️ Learning Arcade'}
 ],
 mechanism:[
  {selector:'#vpqMechanismHotspots [data-vpqmechgo="vpqMechReceptor"]',x:24,label:'🧬 Receptor Board'},
  {selector:'#vpqMechanismHotspots [data-vpqmechgo="vpqMechMenu"]',x:51,label:'🔬 Why Lab'},
  {selector:'#vpqMechanismHotspots [data-vpqmechgo="vpqMechAntibiotics"]',x:77,label:'🦠 Antibiotic Targets'},
  {selector:'#vpqMechanismHotspots [data-vpqmechgo="vpqMechToxins"]',x:89,label:'☣️ Toxin Targets',max:10}
 ]
};
function findNearby(room,x){
 const entries=configs[room]||[];
 // Reception defaults to its original station system in the 2D view.
 if(room==='reception'&&stage.dataset.receptionView!=='isometric')return null;
 let best=null;
 for(const item of entries){
  const el=stage.querySelector(item.selector);
  if(!el)continue;
  const d=Math.abs(x-item.x);
  if(d>(item.max||16))continue;
  if(!best||d<best.distance)best={...item,el,distance:d};
 }
 return best;
}
function updateNearby(room,x){
 const best=findNearby(room,x);
 stage.querySelectorAll('.vpqApproachObject').forEach(el=>{
  const on=!!best&&el===best.el;
  el.classList.toggle('vpqApproachNear',on);
  el.classList.toggle('vpqApproachObject',false);
  if(!on)el.removeAttribute('aria-current');
 });
 if(best){
  best.el.classList.add('vpqApproachObject','vpqApproachNear');
  best.el.setAttribute('aria-current','true');
  if(toast)toast.textContent='Press E: '+best.label;
 }
 return best;
}
function interactNearest(room,x){
 const item=updateNearby(room,x);
 if(!item)return false;
 // Delegate through the original hotspot so existing action routing remains authoritative.
 item.el.click();
 return true;
}
const style=document.createElement('style');
style.textContent=
 '#vpqExamHotspots .vpqApproachNear,#vpqPNHotspots .vpqApproachNear,#vpqLoungeHotspots .vpqApproachNear,#vpqMechanismHotspots .vpqApproachNear,#vpqShadowHotspots .vpqApproachNear{border:3px solid #ffcd65!important;background:#fff6bf40!important;outline:3px solid #fff5c3!important;box-shadow:0 0 0 5px #ffe39473,0 0 25px #ffca6ba9!important;filter:drop-shadow(0 0 8px #ffe29f);transition:box-shadow .1s,background .1s}'+
 '#vpqExamHotspots .vpqApproachNear span,#vpqPNHotspots .vpqApproachNear span,#vpqLoungeHotspots .vpqApproachNear span,#vpqMechanismHotspots .vpqApproachNear span,#vpqShadowHotspots .vpqApproachNear span{background:linear-gradient(#fffdf3,#ffe4a9)!important;border:3px solid #e6b15b!important;color:#704c33!important;font-weight:1000!important;box-shadow:0 4px 9px #ab874866!important}'+
 '#vpqExamHotspots .vpqApproachNear:after,#vpqPNHotspots .vpqApproachNear:after,#vpqLoungeHotspots .vpqApproachNear:after,#vpqMechanismHotspots .vpqApproachNear:after,#vpqShadowHotspots .vpqApproachNear:after{content:"E · INTERACT";position:absolute;top:3%;left:50%;transform:translateX(-50%);color:#80551c;font-size:11px;font-weight:900;background:#fff7dc;border:2px solid #eaba61;border-radius:12px;padding:4px 7px;white-space:nowrap;pointer-events:none;z-index:4}'+
 '#vpqExamHotspots .vpqExamHot span,#vpqPNHotspots .vpqPNHot span,#vpqLoungeHotspots .vpqLoungeHot span,#vpqMechanismHotspots .vpqMechHot span,#vpqShadowHotspots .vpqShadowHotspot span{font-size:clamp(11px,1.25vw,14px);padding:7px 9px;font-weight:900;box-shadow:0 4px 0 #758ca430,0 5px 10px #5367872b}'+
 '.stage .prop.near .sign{background:#fff4c9!important;border-color:#e6ae54!important;box-shadow:0 4px 12px #edc56895!important}'+
 '.stage .prop:focus-visible{outline:3px solid #efbd63;border-radius:12px}';
document.head.appendChild(style);
return {updateNearby,interactNearest,rooms:Object.keys(configs)};
};