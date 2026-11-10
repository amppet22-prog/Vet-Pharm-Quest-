/* Vet Pharm Quest: walkable specialist clinic wings.
 * Treatment Ward = in-house diagnostics; Clinical Pathology = optional advanced lab.
 * Standalone original SVG backgrounds; existing games and save keys unchanged.
 */
window.VPQ_SPECIALIST_ROOMS=function(api){
'use strict';
const stage=document.getElementById('stage');if(!stage||!window.VPQ_SCENERY)return null;
const previous=window.VPQ_SCENERY.roomArt.bind(window.VPQ_SCENERY);
const data={
 clinpath:[
  {x:7,y:40,w:18,h:35,walk:17,label:'🩸 Coagulation',action:'advancedCoag'},
  {x:31,y:40,w:21,h:35,walk:43,label:'🫧 Blood Gas',action:'advancedGas'},
  {x:58,y:40,w:18,h:35,walk:68,label:'🧫 Urinalysis',action:'advancedUrine'},
  {x:79,y:40,w:18,h:35,walk:87,label:'🐾 Advanced Cases',action:'advancedCases'}
 ],
 isolation:[
  {x:9,y:37,w:22,h:39,walk:23,label:'🐶 Isolation patient',action:'onehealth'},
  {x:38,y:37,w:25,h:37,walk:52,label:'📚 Disease library',action:'ohLibrary'},
  {x:69,y:36,w:24,h:38,walk:81,label:'🛡️ Public health',action:'ohHub'}
 ],
 necropsy:[
  {x:12,y:38,w:30,h:39,walk:24,label:'🔬 Gross pathology preview',action:'necropsySoon'},
  {x:57,y:38,w:30,h:39,walk:68,label:'🧫 Histology preview',action:'necropsySoon'}
 ]
};
const rect=(x,y,w,h,fill,stroke='#a4b7c9')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="13" fill="'+fill+'" stroke="'+stroke+'" stroke-width="5"/>';
function scene(key){
 const iso=key==='isolation',cp=key==='clinpath';
 const bg=iso?'#d6eee6':cp?'#dceff8':'#edf1e5';
 const wall=iso?'#effaf7':cp?'#f5faff':'#f7faef';
 const label=iso?'ONE HEALTH & ISOLATION':cp?'CLINICAL PATHOLOGY':'NECROPSY · PREVIEW';
 let s='<svg class="vpqSpecArt" viewBox="0 0 1000 500" preserveAspectRatio="none" role="img" aria-label="'+label+' veterinary teaching room">'+
 '<defs><filter id="vpqSpecShadow"><feDropShadow dx="2" dy="5" stdDeviation="5" flood-opacity=".2" flood-color="#5c7394"/></filter></defs>'+
 '<rect width="1000" height="500" fill="'+bg+'"/><polygon points="0,0 1000,0 934,70 66,70" fill="#fffcf7"/>'+
 '<polygon points="0,0 66,70 66,342 0,404" fill="#b3c9d4"/><polygon points="1000,0 934,70 934,342 1000,404" fill="#b3c9d4"/>'+
 '<rect x="66" y="70" width="868" height="272" fill="'+wall+'"/>'+
 '<path d="M66 342H934L1000 500H0Z" fill="#ddd4e4"/>'+
 '<path d="M66 342L0 500M934 342L1000 500M300 342L260 500M500 342V500M700 342L740 500M32 433H969M50 385H950" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>'+
 [155,395,615,845].map(x=>'<ellipse cx="'+x+'" cy="41" rx="28" ry="12" fill="#fff7dd" stroke="#fff" stroke-width="5"/>').join('')+
 '<g filter="url(#vpqSpecShadow)">'+rect(321,92,359,54,'#fffdfd','#a8b9d6')+
 '<text x="500" y="127" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="#607b90" text-anchor="middle">'+label+'</text></g>';
 if(cp){
   // Advanced diagnostics equipment: clotting analyzer, blood-gas console, urine bench, referral case monitor.
   s+='<g filter="url(#vpqSpecShadow)">'+
   rect(93,206,166,120,'#fff1f9','#c9aacd')+
   rect(108,221,131,60,'#354c69','#9ec2da')+
   '<path d="M122 253h25l6 -13 8 24 10 -17 9 7h44" fill="none" stroke="#7ce6bb" stroke-width="5"/>'+
   [120,160,200].map(x=>'<rect x="'+x+'" y="291" width="18" height="19" rx="4" fill="#e2a4be"/>').join('')+
   rect(319,202,209,124,'#e5effd','#a2b5d3')+
   rect(337,218,133,68,'#384e6a','#93b3d2')+
   '<text x="401" y="247" font-family="Arial" font-size="16" text-anchor="middle" font-weight="900" fill="#a6f0db">pH 7.28</text>'+
   '<text x="401" y="269" font-family="Arial" font-size="13" text-anchor="middle" fill="#e7f7fe">pCO₂ / HCO₃</text>'+
   [480,505].map(x=>'<circle cx="'+x+'" cy="249" r="9" fill="#93c5e0"/>').join('')+
   rect(580,202,174,124,'#f8effc','#c4abcb')+
   rect(593,215,144,58,'#c3ddeb','#8eaecb')+
   '<circle cx="633" cy="242" r="17" fill="#d9a9b7"/><circle cx="676" cy="244" r="17" fill="#eecba5"/>'+
   [610,646,682,716].map(x=>'<rect x="'+x+'" y="284" width="16" height="24" rx="4" fill="#b38cbf"/>').join('')+
   rect(785,205,155,124,'#eef0fd','#a3add3')+
   rect(797,218,132,82,'#344d6a','#8faaca')+
   '<path d="M807 255h18l8 -15 13 26 15 -26 8 15h51" stroke="#92e5c8" stroke-width="4" fill="none"/>'+
   '<text x="861" y="290" font-size="13" font-weight="900" text-anchor="middle" fill="#fff">CASE BOARD</text>'+
   '<rect x="85" y="329" width="853" height="16" rx="6" fill="#cbb5d8"/></g>'+
   '<g font-family="Arial,sans-serif" font-size="16" font-weight="900" text-anchor="middle">'+
   '<text x="177" y="186" fill="#a56a8f">HEMOSTASIS</text>'+
   '<text x="420" y="186" fill="#648eae">BLOOD GAS</text>'+
   '<text x="667" y="186" fill="#996fa1">URINE SEDIMENT</text>'+
   '<text x="856" y="186" fill="#677fa7">REFERRAL CASES</text></g>'+
   '<path d="M93 166q8 -10 16 0l-8 12zM720 158q8 -10 16 0l-8 12z" fill="#e9afc9"/>';
 }else if(iso){
   s+='<g filter="url(#vpqSpecShadow)">'+rect(95,193,230,145,'#e0f7f2','#8cbab0')+
   '<rect x="115" y="300" width="184" height="23" rx="10" fill="#a8d1c5"/>'+
   '<ellipse cx="211" cy="286" rx="65" ry="26" fill="#d6a87e"/><circle cx="158" cy="265" r="29" fill="#e1b68b"/>'+
   '<path d="M141 242l-11 -26 24 15M174 244l18 -21 1 34" fill="#a87959"/>'+
   '<ellipse cx="144" cy="278" rx="18" ry="11" fill="#fff2df"/><circle cx="149" cy="263" r="4" fill="#3f4752"/>'+
   rect(399,186,205,154,'#f8fefa','#a0c7b5')+
   '<path d="M415 219h170M415 251h170M415 282h170" stroke="#b4d8cb" stroke-width="6"/>'+
   '<text x="502" y="214" text-anchor="middle" font-size="16" font-weight="900" fill="#568b77">DISEASE LIBRARY</text>'+
   [430,465,500,535,570].map((x,i)=>'<rect x="'+x+'" y="295" width="21" height="32" fill="'+(i%2?'#b8a9dd':'#e7acc7')+'"/>').join('')+
   rect(711,195,210,144,'#e9f5f6','#a1bfc9')+
   '<rect x="743" y="216" width="149" height="83" rx="6" fill="#385b73"/>'+
   '<path d="M763 259h29l12 -23 14 36 12 -27 12 14h33" stroke="#85d9bb" stroke-width="5" fill="none"/>'+
   '<text x="817" y="323" text-anchor="middle" fill="#587b8b" font-size="15" font-weight="900">PUBLIC HEALTH</text></g>';
 }else{
   s+='<g filter="url(#vpqSpecShadow)">'+
   rect(126,224,283,104,'#e7eff1','#a2b6bb')+
   '<rect x="143" y="246" width="240" height="40" rx="18" fill="#c1dadd"/>'+
   '<path d="M160 318v66M375 318v66" stroke="#869ca7" stroke-width="12"/>'+
   rect(604,197,253,137,'#e9ecfb','#a9aacb')+
   '<rect x="621" y="211" width="220" height="105" rx="8" fill="#344b64"/>'+
   '<circle cx="700" cy="265" r="34" fill="#abb9ce"/><circle cx="700" cy="265" r="17" fill="#415870"/>'+
   '<circle cx="787" cy="265" r="30" fill="#bdc9d6"/><circle cx="787" cy="265" r="15" fill="#4f657c"/></g>';
 }
 return s+'</svg>';
}
window.VPQ_SCENERY.roomArt=k=>data[k]?scene(k):previous(k);
const style=document.createElement('style');
style.textContent='.vpqSpecArt{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'+
'.stage[data-room="clinpath"] .prop,.stage[data-room="isolation"] .prop,.stage[data-room="necropsy"] .prop,.stage[data-room="clinpath"] .roomdecor,.stage[data-room="isolation"] .roomdecor,.stage[data-room="necropsy"] .roomdecor,.stage[data-room="clinpath"] .roomBanner,.stage[data-room="isolation"] .roomBanner,.stage[data-room="necropsy"] .roomBanner{display:none!important}'+
'#vpqSpecHits{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqSpecHit{position:absolute;pointer-events:auto;background:transparent;border:2px solid transparent;border-radius:16px;box-shadow:none;transform:none!important;padding:0}'+
'.vpqSpecHit:hover,.vpqSpecHit:focus-visible,.vpqSpecHit.vpqSpecNear{background:#fff2c52b;border:3px solid #ffcb65;outline:2px solid #fff5cc;box-shadow:0 0 20px #ffc8738e}'+
'.vpqSpecHit span{position:absolute;bottom:-8%;left:50%;transform:translateX(-50%);font-size:clamp(11px,1.25vw,14px);font-weight:900;background:#fffdfb;color:#5b597b;border:3px solid #b7a8d7;border-radius:15px;padding:7px 9px;white-space:nowrap;box-shadow:0 4px 10px #60718d40}'+
'.vpqSpecHit.vpqSpecNear span{background:#fff1c9;border-color:#e8b35b}'+
'.vpqSpecHit.vpqSpecNear:after{content:"E · INTERACT";position:absolute;top:1%;left:50%;transform:translateX(-50%);font-size:11px;font-weight:900;color:#744d22;background:#fff8dd;border:2px solid #e9bf76;border-radius:12px;padding:4px 8px;white-space:nowrap}'+
'@media(max-width:650px){.vpqSpecHit span{font-size:10px;padding:4px 5px;white-space:normal;min-width:80%}}';
document.head.appendChild(style);
function refresh(){
 const room=stage.dataset.room,old=stage.querySelector('#vpqSpecHits');
 if(!data[room]){old?.remove();return}
 if(old?.dataset.room===room)return;
 old?.remove();const div=document.createElement('div');div.id='vpqSpecHits';div.dataset.room=room;
 div.innerHTML=data[room].map(p=>'<button type="button" class="vpqSpecHit" style="left:'+p.x+'%;top:'+p.y+'%;width:'+p.w+'%;height:'+p.h+'%" data-vpqspecact="'+p.action+'" aria-label="'+p.label+'"><span>'+p.label+'</span></button>').join('');
 div.addEventListener('click',e=>{const b=e.target.closest('[data-vpqspecact]');if(b)api.doAction(b.dataset.vpqspecact)});
 stage.appendChild(div);
}
function updateNearby(room,x){
 const items=data[room];if(!items)return null;
 let best=null;for(const p of items){const d=Math.abs(x-p.walk);if(d<17&&(!best||d<best.distance))best={...p,distance:d}}
 stage.querySelectorAll('#vpqSpecHits [data-vpqspecact]').forEach(el=>{
  const on=!!best&&el.dataset.vpqspecact===best.action;
  el.classList.toggle('vpqSpecNear',on);
  el.setAttribute('aria-current',on?'true':'false');
 });
 return best;
}
function interactNearest(room,x){
 const best=updateNearby(room,x);if(!best)return false;
 api.doAction(best.action);return true;
}
const observer=new MutationObserver(()=>{const room=stage.dataset.room,present=stage.querySelector('#vpqSpecHits');if(!!data[room]!==!!present||(present&&present.dataset.room!==room))refresh()});
observer.observe(stage,{attributes:true,attributeFilter:['data-room'],childList:true});
refresh();
return {refresh,updateNearby,interactNearest};
};