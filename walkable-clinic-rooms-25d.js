/* Vet Pharm Quest: illustrated, walkable Treatment and Imaging rooms.
 * Environmental SVG art and transparent interactive equipment hotspots.
 * Existing room actions, keyboard controls, movement, save data, coins and XP stay intact.
 * The earlier image-generated mockups are art direction; this vector adaptation is actual UI.
 */
window.VPQ_WALKABLE_CLINIC_ART=function(api){
'use strict';
const stage=document.getElementById('stage');
if(!stage||!window.VPQ_SCENERY)return null;
const prior=window.VPQ_SCENERY.roomArt.bind(window.VPQ_SCENERY);
const spec={
 imaging:[
  {x:10,y:40,w:22,h:49,label:'🩻 X-ray Table',action:'imagingXray'},
  {x:33,y:39,w:21,h:50,label:'📡 Ultrasound',action:'imagingUltrasound'},
  {x:56,y:39,w:21,h:50,label:'💻 CT Station',action:'imagingCT'},
  {x:80,y:39,w:18,h:50,label:'📋 Read Images',action:'radiologyDesk'}],
 treatment:[
  {x:3,y:39,w:18,h:48,label:'🐾 Patient',action:'hospitalFollowup'},
  {x:22,y:39,w:17,h:48,label:'💉 Treatment',action:'hospitalAdjust'},
  {x:40,y:39,w:18,h:48,label:'💗 Monitor',action:'hospitalMonitor'},
  {x:59,y:39,w:19,h:48,label:'🩸 CBC + Chem',action:'treatmentDiagnostics'},
  {x:79,y:39,w:19,h:48,label:'🔬 Microscope',action:'microscopeDetective'}]
};
const round=(x,y,w,h,fill,stroke='#aaa9ce')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="12" fill="'+fill+'" stroke="'+stroke+'" stroke-width="5"/>';
function base(type){
 const t=type==='imaging',prefix=t?'img25':'trt25',label=t?'DIAGNOSTIC IMAGING':'TREATMENT WARD';
 return '<svg class="vpqWalkArt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500" preserveAspectRatio="none" role="img" aria-label="Original 2.5D perspective veterinary '+(t?'diagnostic imaging suite':'treatment ward')+' with realistic clinic equipment">'+
 '<defs><linearGradient id="'+prefix+'-wall" x2="1" y2="1"><stop stop-color="#f9f6ff"/><stop offset="1" stop-color="'+(t?'#d2e5f6':'#e4d4f3')+'"/></linearGradient>'+
 '<linearGradient id="'+prefix+'-floor" x2="0" y2="1"><stop stop-color="#eae3f2"/><stop offset="1" stop-color="#c6b8dd"/></linearGradient>'+
 '<filter id="'+prefix+'-shadow" x="-25%" y="-25%" width="155%" height="165%"><feDropShadow dx="2" dy="5" stdDeviation="5" flood-color="#55628d" flood-opacity=".24"/></filter></defs>'+
 '<rect width="1000" height="500" fill="#d6e0f3"/><polygon points="0,0 1000,0 925,80 75,80" fill="#f1f0fc"/>'+
 '<polygon points="0,0 75,80 75,344 0,408" fill="#b7bcda"/><polygon points="1000,0 925,80 925,344 1000,408" fill="#b1c4dc"/>'+
 '<rect x="75" y="80" width="850" height="264" fill="url(#'+prefix+'-wall)"/>'+
 '<path d="M75 344H925L1000 500H0Z" fill="url(#'+prefix+'-floor)"/>'+
 '<path d="M75 344L0 500M925 344L1000 500M270 344L220 500M500 344V500M730 344L780 500M18 468H982M41 419H959M61 377H939" fill="none" stroke="#fdfcff" stroke-width="2.5" opacity=".85"/>'+
 '<path d="M75 82H925M75 343H925" stroke="#b0afd4" stroke-width="8"/>'+
 '<path d="M75 22H925M250 0L275 80M450 0L450 80M650 0L625 80M820 0L785 80" stroke="#d1d7ee" stroke-width="3" fill="none"/>'+
 [160,345,657,835].map(x=>'<ellipse cx="'+x+'" cy="42" rx="25" ry="11" fill="#fff2ce" stroke="#ffffff" stroke-width="6"/>').join('')+
 '<g filter="url(#'+prefix+'-shadow)">'+round(346,90,308,60,'#fffbff','#b0a0de')+
 '<text x="500" y="127" text-anchor="middle" fill="#5f7197" font-family="Arial,sans-serif" font-weight="900" font-size="26">'+label+'</text></g>'+
 '<g opacity=".47" fill="#a595d2"><circle cx="305" cy="114" r="7"/><circle cx="293" cy="101" r="4"/><circle cx="305" cy="99" r="4"/><circle cx="318" cy="101" r="4"/><circle cx="694" cy="114" r="7"/><circle cx="682" cy="101" r="4"/><circle cx="694" cy="99" r="4"/><circle cx="707" cy="101" r="4"/></g>';
}
function imaging(){
 let s=base('imaging');
 // Backlit radiology display with original stylized diagnostic linework
 s+='<g filter="url(#img25-shadow)">'+round(88,169,184,112,'#d8ecfb','#96b7d0')+
 round(101,181,76,88,'#27394f','#7c9cb9')+round(184,181,74,88,'#27394f','#7c9cb9')+
 '<g fill="none" stroke="#c2eafa" stroke-width="3"><path d="M112 206q24 -19 54 3M112 214q24 -12 54 9M113 224q24 -8 53 10M118 234q23 -6 48 10M137 190v57"/><path d="M218 190v65M201 202l17 11 17 -11M207 249h23M218 248l-11 13M218 248l12 13"/></g></g>';
 // Positioning table and overhead tube
 s+='<g filter="url(#img25-shadow)"><rect x="114" y="342" width="175" height="18" rx="9" fill="#8ebade" stroke="#6288ac" stroke-width="5"/>'+
 round(136,360,130,54,'#eaf2ff','#96afcb')+'<path d="M155 413v16M251 413v16" stroke="#788daf" stroke-width="10"/>'+
 '<path d="M146 251v83M146 252h73v25" stroke="#829dbd" stroke-width="14" fill="none"/>'+round(199,277,50,31,'#e2effc','#8caacc')+
 '<ellipse cx="225" cy="310" rx="19" ry="8" fill="#b5dcf9"/></g>';
 // Ultrasound cart with grayscale original ultrasound sector
 s+='<g filter="url(#img25-shadow)">'+round(333,210,145,116,'#edf4fd','#92a7c7')+round(350,224,113,85,'#253347','#7d99bc')+
 '<path d="M391 238L365 286Q402 303 449 286L424 238Z" fill="#8795a8" stroke="#dce8f2" stroke-width="3"/>'+
 '<path d="M391 251q20 20 33 0M380 276q30 17 58 0" stroke="#d3e3ec" stroke-width="3" opacity=".7" fill="none"/>'+
 round(343,326,125,35,'#d8e0f0','#9aabc8')+
 [366,390,414,438].map(x=>'<circle cx="'+x+'" cy="344" r="5" fill="#a3b4d1"/>').join('')+
 round(359,361,94,45,'#edf2fb','#9caccb')+
 '<path d="M367 408v13M449 408v13" stroke="#869bb8" stroke-width="9"/></g>';
 // CT gantry behind window
 s+='<g>'+round(513,175,216,170,'#d5e7f7','#9cbed8')+
 '<ellipse cx="621" cy="254" rx="85" ry="75" fill="#eef7ff" stroke="#93b6d4" stroke-width="13"/>'+
 '<ellipse cx="621" cy="254" rx="47" ry="47" fill="#3a5671" stroke="#9dd3eb" stroke-width="9"/>'+
 '<rect x="572" y="296" width="107" height="14" rx="6" fill="#eef9ff"/>'+
 '<rect x="543" y="323" width="161" height="16" rx="7" fill="#f4faff" stroke="#8ea9c6" stroke-width="4"/></g>';
 // CT workstation with axial displays, desk
 s+='<g filter="url(#img25-shadow)">'+round(750,182,170,116,'#3c516b','#91a8c9')+
 [790,863].map(x=>'<circle cx="'+x+'" cy="222" r="28" fill="#aabed6"/><ellipse cx="'+(x-9)+'" cy="223" rx="10" ry="18" fill="#34465e"/><ellipse cx="'+(x+9)+'" cy="223" rx="10" ry="18" fill="#34465e"/>').join('')+
 [790,863].map(x=>'<circle cx="'+x+'" cy="273" r="16" fill="#879eb9"/>').join('')+
 '<rect x="746" y="321" width="185" height="16" rx="5" fill="#f3d6be" stroke="#af9abb" stroke-width="4"/>'+
 '<path d="M762 337v77M914 337v77" stroke="#9a8fb7" stroke-width="10"/>'+
 '<rect x="797" y="344" width="78" height="8" rx="4" fill="#9ca6bd"/></g>';
 return s+'</svg>';
}
function treatment(){
 let s=base('treatment');
 // Patient kennel with vertical metal bars and sleepy dog
 s+='<g filter="url(#trt25-shadow)">'+round(92,167,185,192,'#e2eafa','#a4a7cb')+
 '<rect x="106" y="303" width="157" height="41" rx="8" fill="#b9b3e5"/>'+
 '<ellipse cx="179" cy="294" rx="51" ry="22" fill="#ce9d75"/><circle cx="132" cy="274" r="27" fill="#deab7c"/>'+
 '<path d="M114 252l-3 -29 25 22M140 250l19 -24 3 39" fill="#987358"/><circle cx="119" cy="271" r="4" fill="#394458"/>'+
 [120,148,176,204,232,260].map(x=>'<path d="M'+x+' 174V351" stroke="#a8b3ce" stroke-width="4"/>').join('')+
 '<path d="M99 219H270M99 266H270M99 311H270" stroke="#a8b3ce" stroke-width="4"/></g>';
 // Overhead exam lamp, treatment table and IV
 s+='<path d="M457 81v86l-38 23" stroke="#99a3c5" stroke-width="12" fill="none"/>'+
 '<ellipse cx="419" cy="202" rx="47" ry="28" fill="#fff6d6" stroke="#a2acd1" stroke-width="11"/>'+
 [395,419,443].map(x=>'<circle cx="'+x+'" cy="202" r="10" fill="#fffefa"/>').join('')+
 '<g filter="url(#trt25-shadow)"><rect x="370" y="324" width="223" height="25" rx="12" fill="#b8ade1" stroke="#887caf" stroke-width="5"/>'+
 '<path d="M394 350l27 71M565 350l-27 71" stroke="#a7a1c6" stroke-width="12"/>'+
 '<rect x="385" y="310" width="190" height="21" rx="10" fill="#efdcf7"/></g>'+
 '<path d="M350 244v144M327 242h45" stroke="#9ca5bc" stroke-width="7" fill="none"/>'+
 '<rect x="339" y="263" width="23" height="43" rx="4" fill="#e5f6ff" stroke="#9bb2cb" stroke-width="3"/>';
 // Patient monitor with convincing ECG
 s+='<g filter="url(#trt25-shadow)">'+round(593,178,133,104,'#34445b','#a9bad4')+
 '<path d="M608 231h18l8 -13 10 34 9 -41 11 26h46" stroke="#71e7bd" stroke-width="4" fill="none"/>'+
 '<text x="687" y="205" font-size="16" fill="#f4b7cb" font-weight="900" text-anchor="middle">♥ 128</text>'+
 '<rect x="647" y="281" width="15" height="26" fill="#a3b4ce"/>'+
 '<rect x="617" y="307" width="80" height="9" rx="4" fill="#99a3c1"/></g>';
 // Rolling treatment trolley and stocked wall cabinets
 s+='<g>'+round(286,279,78,100,'#f1ebfa','#aaa6c8')+
 '<path d="M292 305h66M292 337h66" stroke="#a3a8c5" stroke-width="4"/>'+
 '<circle cx="301" cy="386" r="9" fill="#7787a7"/><circle cx="353" cy="386" r="9" fill="#7787a7"/>'+
 round(734,173,155,83,'#eee8fb','#ac9ecb')+
 '<path d="M789 176v79M744 216h134" stroke="#c2b5db" stroke-width="5"/>'+
 [748,772,816,841,865].map((x,i)=>'<rect x="'+x+'" y="'+(i%2?193:185)+'" width="17" height="27" rx="3" fill="'+(i%2?'#9cd3d1':'#e6abd6')+'"/>').join('')+'</g>';
 // In-house lab counter with two analyzers, tubes, microscope
 s+='<g filter="url(#trt25-shadow)"><rect x="720" y="327" width="227" height="18" rx="5" fill="#ded0eb" stroke="#b4a2cc" stroke-width="4"/>'+
 round(727,345,214,70,'#eee9f9','#a7a5c7')+
 '<path d="M798 346v68M865 346v68" stroke="#bdb4d5" stroke-width="5"/>'+
 round(738,267,87,57,'#f6f1fd','#a39bc8')+round(751,279,51,27,'#435c80','#b6c7e1')+
 '<path d="M761 294h28" stroke="#9de1c7" stroke-width="5"/>'+
 round(831,281,52,43,'#f3f0fa','#a39fc6')+round(841,288,32,18,'#738daa','#d2e2f3')+
 '<path d="M890 316h45" stroke="#647f9a" stroke-width="8"/><path d="M918 313v-35l-12 -15" stroke="#8495b9" stroke-width="11" fill="none"/>'+
 '<circle cx="902" cy="262" r="11" fill="#ddeafa" stroke="#8aa5c9" stroke-width="6"/>'+
 '<path d="M908 278l-20 35" stroke="#8898bd" stroke-width="8"/>'+
 [761,783,808].map((x,i)=>'<rect x="'+x+'" y="257" width="13" height="10" rx="3" fill="'+(i%2?'#d793b6':'#a58dd3')+'"/>').join('')+'</g>';
 return s+'</svg>';
}
window.VPQ_SCENERY.roomArt=k=>k==='imaging'?imaging():k==='treatment'?treatment():prior(k);
const styles=document.createElement('style');
styles.textContent='.vpqWalkArt{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'+
'.stage[data-room="imaging"] .prop,.stage[data-room="treatment"] .prop,.stage[data-room="imaging"] .roomdecor,.stage[data-room="treatment"] .roomdecor,.stage[data-room="imaging"] .roomBanner,.stage[data-room="treatment"] .roomBanner{display:none!important}'+
'.vpq25Hotspots{position:absolute;inset:0;z-index:5;pointer-events:none}.vpq25Hit{position:absolute;pointer-events:auto;background:transparent;border:2px solid transparent;border-radius:15px;box-shadow:none;transform:none!important;padding:0}'+
'.vpq25Hit:hover,.vpq25Hit:focus-visible{background:#fff1cf30;border:3px solid #ffcc61;box-shadow:0 0 18px #ffeab2aa;outline:none}'+
'.vpq25Hit span{position:absolute;bottom:3%;left:50%;transform:translateX(-50%);padding:9px 10px;border:3px solid #a98cd5;background:linear-gradient(#fff,#f9e9fa);color:#514779;border-radius:16px;font-size:clamp(11px,1.3vw,15px);font-weight:1000;white-space:nowrap;box-shadow:0 4px 0 #9473ac55,0 7px 15px #53678733}'+
'@media(max-width:620px){.vpq25Hit span{font-size:10px;padding:5px 4px;white-space:normal;min-width:80%;line-height:1.1}}';
document.head.appendChild(styles);
function refresh(){
 const old=stage.querySelector('#vpq25Hotspots');
 const room=stage.dataset.room;
 if(!spec[room]){old?.remove();return}
 if(old?.dataset.room===room)return;
 old?.remove();
 const div=document.createElement('div');div.id='vpq25Hotspots';div.className='vpq25Hotspots';div.dataset.room=room;
 div.innerHTML=spec[room].map(p=>'<button type="button" class="vpq25Hit" style="left:'+p.x+'%;top:'+p.y+'%;width:'+p.w+'%;height:'+p.h+'%" data-vpq25act="'+p.action+'" aria-label="Open '+p.label+'"><span>'+p.label+'</span></button>').join('');
 div.addEventListener('click',event=>{const b=event.target.closest('[data-vpq25act]');if(b)api.doAction(b.dataset.vpq25act)});
 stage.appendChild(div);
}
const observer=new MutationObserver(()=>{const room=stage.dataset.room,present=stage.querySelector('#vpq25Hotspots');if((!!spec[room])!==!!present||(present&&present.dataset.room!==room))refresh()});
observer.observe(stage,{attributes:true,attributeFilter:['data-room'],childList:true});
refresh();
return {refresh,imaging,treatment};
};