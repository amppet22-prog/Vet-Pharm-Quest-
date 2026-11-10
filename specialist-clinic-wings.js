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
  {x:3,y:42,w:17,h:34,walk:12,label:'🩸 Coagulation',action:'advancedCoag'},
  {x:21,y:42,w:17,h:34,walk:29,label:'🫧 Blood Gas',action:'advancedGas'},
  {x:39,y:42,w:17,h:34,walk:48,label:'🧫 Urinalysis',action:'advancedUrine'},
  {x:57,y:42,w:18,h:34,walk:66,label:'🐾 Referral Cases',action:'advancedCases'},
  {x:77,y:42,w:20,h:34,walk:87,label:'🔬 Microscopy & Lab',action:'classicLabHub'}
 ],
 isolation:[
  {x:9,y:37,w:22,h:39,walk:23,label:'🐶 Isolation patient',action:'onehealth'},
  {x:38,y:37,w:25,h:37,walk:52,label:'📚 Disease library',action:'ohLibrary'},
  {x:69,y:36,w:24,h:38,walk:81,label:'🛡️ Public health',action:'ohHub'}
 ],
 necropsy:[
  {x:5,y:40,w:22,h:39,walk:16,label:'🔎 Gross Lesions',action:'necroGross'},
  {x:28,y:40,w:21,h:39,walk:39,label:'🔬 Histology',action:'necroHisto'},
  {x:52,y:40,w:20,h:39,walk:63,label:'☣️ Biosecurity',action:'necroBio'},
  {x:76,y:40,w:21,h:39,walk:87,label:'🐾 Patient Cases',action:'necroCases'}
 ],
 surgery:[
  {x:5,y:40,w:22,h:39,walk:16,label:'🧽 Sterile Prep',action:'surgPrep'},
  {x:28,y:40,w:21,h:39,walk:39,label:'💗 Anesthesia',action:'surgMonitor'},
  {x:52,y:40,w:20,h:39,walk:63,label:'🛏️ Recovery',action:'surgRecovery'},
  {x:76,y:40,w:21,h:39,walk:87,label:'🐾 Patient Cases',action:'surgCases'}
 ]

};
const rect=(x,y,w,h,fill,stroke='#a4b7c9')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="13" fill="'+fill+'" stroke="'+stroke+'" stroke-width="5"/>';
function scene(key){
 const iso=key==='isolation',cp=key==='clinpath';
 const bg=iso?'#d6eee6':cp?'#dceff8':'#edf1e5';
 const wall=iso?'#effaf7':cp?'#f5faff':'#f7faef';
 const label=iso?'ONE HEALTH & ISOLATION':cp?'ADVANCED PATHOLOGY & MICROSCOPY':key==='surgery'?'SURGERY & ANESTHESIA':'NECROPSY & DIAGNOSTIC PATHOLOGY';
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
   const stations=[
    {x:79,label:'HEMOSTASIS',c:'#f8e4f2',edge:'#c99ac4',screen:'PT / aPTT',symbol:'🩸'},
    {x:264,label:'BLOOD GAS',c:'#e6f5fa',edge:'#9ac9db',screen:'pH / CO₂',symbol:'🫧'},
    {x:448,label:'URINE SEDIMENT',c:'#f6eafa',edge:'#c9a9da',screen:'SEDIMENT',symbol:'🧫'},
    {x:632,label:'CASE BOARD',c:'#eaf0fa',edge:'#a1b6da',screen:'CASE FILE',symbol:'🐾'},
    {x:816,label:'MICROSCOPY',c:'#e8f8f5',edge:'#9dc9ba',screen:'SMEAR',symbol:'🔬'}
   ];
   s+='<g filter="url(#vpqSpecShadow)">'+stations.map(v=>
     rect(v.x,196,145,134,v.c,v.edge)+
     rect(v.x+13,211,119,71,'#405671',v.edge)+
     '<text x="'+(v.x+73)+'" y="241" text-anchor="middle" font-family="Arial" font-size="17" font-weight="900" fill="#d6f4fa">'+v.screen+'</text>'+
     '<path d="M'+(v.x+28)+' 263h21l8 -15 12 26 12 -18h29" fill="none" stroke="#92e4be" stroke-width="4"/>'+
     '<text x="'+(v.x+72)+'" y="313" text-anchor="middle" font-family="Arial" font-size="12" font-weight="900" fill="#6e6688">'+v.label+'</text>'
   ).join('')+'</g><path d="M65 338h868" stroke="#c4b2cf" stroke-width="14"/>'+
   '<g><circle cx="151" cy="181" r="7" fill="#ebafd3"/><circle cx="854" cy="181" r="7" fill="#b6ddcd"/><path d="M152 155l5 10 11 2 -8 8 2 11 -10-5 -10 5 3-11 -8-8 10-2z" fill="#f9d7a3"/></g>';
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
   '<text x="817" y="323" text-anchor="middle" fill="#587b8b" font-size="15" font-weight="900">PUBLIC HEALTH</text></g>'+
   // Infection-control environment: visible risk sign, PPE storage, handwashing and cleaning cart.
   '<g font-family="Arial,sans-serif" font-weight="900">'+
   '<rect x="109" y="111" width="171" height="52" rx="12" fill="#fff2cc" stroke="#e6b56a" stroke-width="4"/>'+
   '<text x="194" y="134" text-anchor="middle" font-size="16" fill="#936b2e">☣ BIOHAZARD</text>'+
   '<text x="194" y="152" text-anchor="middle" font-size="12" fill="#936b2e">CHECK ISOLATION PPE</text>'+
   '<rect x="715" y="104" width="194" height="59" rx="12" fill="#e0f5f4" stroke="#8fbdc4" stroke-width="4"/>'+
   '<text x="810" y="128" text-anchor="middle" font-size="15" fill="#467c82">🧤 GLOVES · 🥼 GOWN</text>'+
   '<text x="810" y="148" text-anchor="middle" font-size="13" fill="#467c82">MASK · HAND HYGIENE</text></g>'+
   '<g><rect x="324" y="272" width="56" height="77" rx="9" fill="#bad4e0" stroke="#8bb1be" stroke-width="4"/>'+
   '<path d="M345 268h23M355 267v-15M349 285h15" fill="none" stroke="#709daa" stroke-width="7"/>'+
   '<rect x="608" y="290" width="76" height="61" rx="9" fill="#b6d6d1" stroke="#82ada8" stroke-width="4"/>'+
   '<rect x="622" y="275" width="22" height="29" rx="5" fill="#d5eaf6" stroke="#9bbccc" stroke-width="3"/>'+
   '<rect x="651" y="278" width="16" height="28" rx="4" fill="#f0dde8" stroke="#c8adc2" stroke-width="3"/>'+
   '<text x="646" y="331" text-anchor="middle" font-size="12" font-family="Arial" font-weight="900" fill="#4e8987">CLEAN</text></g>';
 }else if(key==='surgery'){
   s+='<g filter="url(#vpqSpecShadow)">'+
   rect(74,191,177,148,'#fff2f5','#d5adc5')+
   '<rect x="93" y="214" width="137" height="90" rx="9" fill="#fff" stroke="#b5c4d8" stroke-width="4"/>'+
   '<text x="161" y="241" text-anchor="middle" font-family="Arial" font-size="16" fill="#9a7aaa" font-weight="900">STERILE FIELD</text>'+
   '<text x="160" y="286" font-size="43" text-anchor="middle">🧽</text>'+
   rect(286,177,196,162,'#e4f1fa','#a4bbd6')+
   rect(303,198,165,96,'#405975','#93b4ca')+
   '<path d="M317 254h27l9 -19 12 32 14 -23 13 13h62" fill="none" stroke="#84edc1" stroke-width="6"/>'+
   '<text x="386" y="228" font-size="19" text-anchor="middle" fill="#f6cfdd">♥ 112</text>'+
   rect(523,230,230,103,'#ebdef4','#b7a0cc')+
   '<rect x="535" y="252" width="206" height="31" rx="12" fill="#c6b4db"/>'+
   '<path d="M558 332v36M720 332v36" stroke="#9c9cbd" stroke-width="10"/>'+
   '<path d="M580 243v-36h29" stroke="#9db3ce" stroke-width="9" fill="none"/>'+
   rect(785,194,159,141,'#f4e8f9','#b8add4')+
   rect(799,210,130,92,'#435b7d','#99b6cf')+
   '<text x="862" y="263" font-size="21" text-anchor="middle" fill="#fff">CASE FILES</text>'+
   '</g><g font-size="14" font-family="Arial" font-weight="900" text-anchor="middle" fill="#786b9a">'+
   '<text x="165" y="175">PREP & ASEPSIS</text><text x="389" y="165">ANESTHESIA</text>'+
   '<text x="639" y="208">RECOVERY</text><text x="864" y="177">PATIENT BOARD</text></g>'+
   '<g><rect x="68" y="116" width="170" height="46" rx="12" fill="#fff7cf" stroke="#e8c379" stroke-width="4"/>'+
   '<text x="153" y="144" text-anchor="middle" font-size="16" font-family="Arial" fill="#9e7440" font-weight="900">HAND HYGIENE</text></g>';
 }else{
   s+='<g filter="url(#vpqSpecShadow)">'+
   rect(85,211,213,119,'#e8f1ed','#a2bdb2')+
   '<rect x="102" y="248" width="180" height="39" rx="14" fill="#c1dad8"/>'+
   '<path d="M122 320v35M265 320v35" stroke="#8eada9" stroke-width="9"/>'+
   rect(334,200,173,131,'#e8eefa','#a5bbd4')+
   rect(349,216,143,82,'#405972','#92b8cd')+
   '<circle cx="412" cy="257" r="30" fill="#b6cadd"/><circle cx="412" cy="257" r="16" fill="#445971"/>'+
   rect(545,198,176,136,'#fff0dc','#d1b58f')+
   '<rect x="560" y="215" width="145" height="79" rx="8" fill="#fbfaf7"/>'+
   '<text x="632" y="246" text-anchor="middle" font-size="18" font-family="Arial" font-weight="900" fill="#a87b47">☣ BIOHAZARD</text>'+
   '<text x="632" y="276" text-anchor="middle" font-size="12" fill="#ac8155">GLOVES · GOWN</text>'+
   rect(762,208,167,126,'#efeaf9','#b8a7d1')+
   rect(774,221,142,76,'#405670','#a0bed3')+
   '<text x="845" y="257" text-anchor="middle" font-family="Arial" font-size="16" fill="#fff">CASE BOARD</text>'+
   '</g><g text-anchor="middle" font-family="Arial" font-size="15" fill="#756987" font-weight="900">'+
   '<text x="188" y="187">GROSS EXAM</text><text x="417" y="185">HISTOLOGY</text>'+
   '<text x="634" y="182">BIOSECURITY</text><text x="848" y="188">PATIENTS</text></g>';
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