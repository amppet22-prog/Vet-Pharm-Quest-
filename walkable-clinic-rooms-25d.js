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
// Hit targets intentionally hug the depicted equipment, rather than covering room-wide columns.
// Approach is determined by the matching walkable station x-coordinate.
const spec={
 imaging:[
  {x:11,y:49,w:19,h:38,label:'🩻 X-ray',action:'imagingXray'},
  {x:34,y:42,w:15,h:42,label:'📡 Ultrasound',action:'imagingUltrasound'},
  {x:54,y:35,w:20,h:35,label:'💻 CT scanner',action:'imagingCT'},
  {x:77,y:35,w:19,h:34,label:'📋 Reading desk',action:'radiologyDesk'}],
 treatment:[
  {x:9,y:33,w:18,h:41,label:'🐶 Patient',action:'hospitalFollowup'},
  {x:28,y:54,w:10,h:26,label:'💉 Cart',action:'hospitalAdjust'},
  {x:37,y:29,w:13,h:23,label:'💉 Skills Wing',action:'skillsWing'},
  {x:59,y:35,w:14,h:29,label:'💗 Monitor',action:'hospitalMonitor'},
  {x:88,y:49,w:9,h:22,label:'🧪 Send to Lab',action:'clinpathLabReferral'}]
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
 // Distinct, walkable skills doorway behind the treatment cart.
 s+='<g filter="url(#trt25-shadow)">'+round(350,151,150,123,'#e2f0fa','#9bafcf')+
 '<rect x="363" y="177" width="124" height="82" rx="9" fill="#f9ecf7" stroke="#b8a0ca" stroke-width="4"/>'+
 '<path d="M424 180v78" stroke="#bfa8d3" stroke-width="5"/>'+
 '<circle cx="413" cy="229" r="5" fill="#c6a6d1"/><circle cx="437" cy="229" r="5" fill="#c6a6d1"/>'+
 '<rect x="355" y="155" width="142" height="29" rx="12" fill="#fff5fc" stroke="#b79aca" stroke-width="3"/>'+
 '<text x="426" y="175" font-family="Arial" text-anchor="middle" font-size="15" fill="#8e6297" font-weight="900">CLINICAL SKILLS</text>'+
 '<text x="395" y="219" font-size="25" text-anchor="middle">💉</text><text x="461" y="219" font-size="25" text-anchor="middle">🩸</text></g>';
  // Two-level inpatient kennel bank: two upper recovery patients and a lower canine kennel.
 // Decorative only: the original Hospital Patient hit target remains unchanged.
 s+='<g filter="url(#trt25-shadow)">'+
 '<rect x="83" y="157" width="226" height="209" rx="13" fill="#dce5f1" stroke="#9baec8" stroke-width="7"/>'+
 '<rect x="93" y="170" width="101" height="80" rx="7" fill="#f7f0fc" stroke="#9eabc7" stroke-width="4"/>'+
 '<rect x="199" y="170" width="100" height="80" rx="7" fill="#f2f9fc" stroke="#9eabc7" stroke-width="4"/>'+
 '<rect x="93" y="256" width="206" height="98" rx="7" fill="#f7f1fa" stroke="#9eabc7" stroke-width="4"/>'+
 '<rect x="104" y="227" width="79" height="13" rx="7" fill="#e7bfda"/>'+
 '<rect x="209" y="227" width="79" height="13" rx="7" fill="#b9deda"/>'+
 '<rect x="106" y="334" width="180" height="12" rx="6" fill="#e0c6e9"/>'+
 // Upper left kennel: curled ginger cat with pointy ears and stripe details.
 '<ellipse cx="146" cy="212" rx="30" ry="15" fill="#d89968"/>'+
 '<path d="M164 214q28 2 19 -19" fill="none" stroke="#c6825d" stroke-width="8" stroke-linecap="round"/>'+
 '<circle cx="132" cy="200" r="16" fill="#e1a475"/>'+
 '<path d="M120 190l1 -16 12 10 10 -10 5 16" fill="#e1a475" stroke="#bc805f" stroke-width="2"/>'+
 '<path d="M125 197h3m11 0h3" stroke="#534752" stroke-width="3" stroke-linecap="round"/>'+
 '<path d="M130 204q3 4 6 0" stroke="#a56d62" stroke-width="2" fill="none"/>'+
 '<path d="M151 202l7 8m-2 -15l8 8" stroke="#b97859" stroke-width="3"/>'+
 // Upper right kennel: small white-and-brown recovering dog.
 '<ellipse cx="254" cy="216" rx="28" ry="15" fill="#e9e3d9"/>'+
 '<circle cx="233" cy="201" r="16" fill="#eee7db"/>'+
 '<path d="M221 193q-10 -2 -7 15l11 -2M240 191q13 -3 12 14l-11 0" fill="#a87962"/>'+
 '<ellipse cx="223" cy="205" rx="7" ry="5" fill="#fff6e7"/>'+
 '<circle cx="220" cy="204" r="3" fill="#464754"/>'+
 '<circle cx="236" cy="200" r="2.5" fill="#464754"/>'+
 '<path d="M265 209q15 -8 18 4" fill="none" stroke="#a87962" stroke-width="6" stroke-linecap="round"/>'+
 // Lower kennel: reclining tan dog on washable pastel bed.
 '<path d="M248 311q26 -23 33 2" stroke="#b88159" stroke-width="10" fill="none" stroke-linecap="round"/>'+
 '<ellipse cx="202" cy="318" rx="65" ry="24" fill="#cf9a6d" stroke="#b88159" stroke-width="3"/>'+
 '<path d="M163 305q28 -7 58 0l15 28h-80z" fill="#f3dbc0"/>'+
 '<ellipse cx="171" cy="331" rx="19" ry="7" fill="#f3dbc0"/><ellipse cx="233" cy="332" rx="20" ry="7" fill="#f3dbc0"/>'+
 '<circle cx="142" cy="305" r="25" fill="#dfac7f"/>'+
 '<path d="M123 293q-20 -2 -15 24l20 -4M157 289q15 -7 9 19l-11 -3" fill="#a4785d"/>'+
 '<ellipse cx="125" cy="318" rx="17" ry="10" fill="#fff0df"/>'+
 '<ellipse cx="113" cy="316" rx="6" ry="4" fill="#4b4952"/>'+
 '<circle cx="140" cy="301" r="3.5" fill="#404453"/>'+
 // Proper stainless cage grids and latch handles.
 [116,139,163,185].map(x=>'<path d="M'+x+' 173V247" stroke="#a6b5c7" stroke-width="2.7"/>').join('')+
 [220,243,266,288].map(x=>'<path d="M'+x+' 173V247" stroke="#a6b5c7" stroke-width="2.7"/>').join('')+
 [113,141,169,197,225,253,281].map(x=>'<path d="M'+x+' 260V351" stroke="#a6b5c7" stroke-width="3"/>').join('')+
 '<path d="M94 208h104M200 208h98M94 302h203" stroke="#a6b5c7" stroke-width="3"/>'+
 '<rect x="184" y="209" width="9" height="13" rx="3" fill="#d1a6b7"/>'+
 '<rect x="291" y="209" width="8" height="13" rx="3" fill="#d1a6b7"/>'+
 '<rect x="288" y="300" width="9" height="16" rx="3" fill="#d1a6b7"/>'+
 '<rect x="103" y="151" width="94" height="16" rx="6" fill="#fff9fe" stroke="#c2b7d2" stroke-width="2"/>'+
 '<text x="150" y="162" font-size="10" text-anchor="middle" font-family="Arial" font-weight="800" fill="#74678a">RECOVERY A / B</text>'+
 '<rect x="218" y="151" width="83" height="16" rx="6" fill="#f4ffff" stroke="#abc8d0" stroke-width="2"/>'+
 '<text x="259" y="162" font-size="10" text-anchor="middle" font-family="Arial" font-weight="800" fill="#60858d">OCCUPIED</text>'+
 '</g>';
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
 // Realistic stocked treatment area: small patient on exam table, crash cart,
 // IV fluid bag, patient charts, sink and sharps disposal; not new click targets.
 s+='<g aria-hidden="true">'+
 // Tucked-in feline patient on the worktable, positioned clear of the walking sprites.
 '<ellipse cx="495" cy="305" rx="36" ry="12" fill="#d9dbec" opacity=".6"/>'+
 '<ellipse cx="497" cy="298" rx="32" ry="15" fill="#a3a6ae"/>'+
 '<path d="M517 299q21 1 18 -20" fill="none" stroke="#8c919b" stroke-width="7" stroke-linecap="round"/>'+
 '<circle cx="472" cy="291" r="16" fill="#b5b5b5"/>'+
 '<path d="M460 283l2 -16 12 8 11 -10 4 18" fill="#b5b5b5" stroke="#898d97" stroke-width="2"/>'+
 '<path d="M465 291l5 2m12 -2l-5 2" stroke="#4f535f" stroke-width="2.5" stroke-linecap="round"/>'+
 '<path d="M470 299q4 2 7 -1" stroke="#77717b" stroke-width="2" fill="none"/>'+
 '<rect x="449" y="311" width="104" height="10" rx="5" fill="#fff3f8" opacity=".85"/>'+
 // Clean treatment tray and folded gauze, kept to side of the patient.
 '<rect x="561" y="301" width="31" height="9" rx="3" fill="#b8c5d9"/>'+
 '<rect x="565" y="296" width="17" height="7" rx="2" fill="#ffffff"/>'+
 '<rect x="578" y="295" width="6" height="9" rx="2" fill="#a7c5d3"/>'+
 // IV fluid bag on existing pole, marked drip line.
 '<rect x="339" y="248" width="22" height="44" rx="4" fill="#e8f6fc" stroke="#a9bfd0" stroke-width="2"/>'+
 '<path d="M350 251v-10M344 274h12" stroke="#97bbc6" stroke-width="2"/>'+
 '<path d="M350 292v21q0 16 15 16" stroke="#b3b9c9" stroke-width="2" fill="none"/>'+
 // Oxygen hookups, wall glove box, and color-coded clinical waste.
 '<rect x="558" y="152" width="62" height="26" rx="7" fill="#e6f4fa" stroke="#a4bfce" stroke-width="3"/>'+
 '<circle cx="572" cy="164" r="6" fill="#8acbb6"/><circle cx="591" cy="164" r="6" fill="#f1cf83"/>'+
 '<circle cx="610" cy="164" r="5" fill="#b3b6d2"/>'+
 '<rect x="545" y="202" width="36" height="25" rx="5" fill="#effbfd" stroke="#a3bdca" stroke-width="3"/>'+
 '<rect x="551" y="208" width="24" height="9" rx="2" fill="#c9e0e3"/>'+
 '<path d="M563 216l-6 12 6 -4 7 5 0 -12" fill="#fbfbff"/>'+
 '<rect x="667" y="342" width="33" height="42" rx="5" fill="#e6c5ce" stroke="#c693a8" stroke-width="3"/>'+
 '<rect x="663" y="338" width="41" height="8" rx="3" fill="#bb859f"/>'+
 '<path d="M679 357h10m-5 -5v11" stroke="#fff" stroke-width="4"/>'+
 // Clipboard and neatly arranged color-coded supply bins on lab counter.
 '<rect x="900" y="219" width="43" height="37" rx="5" fill="#f5f2fc" stroke="#ad9fc9" stroke-width="3"/>'+
 '<path d="M912 231h20M912 239h16M912 247h18" stroke="#9eaaca" stroke-width="2.2"/>'+
 '<rect x="915" y="214" width="13" height="9" rx="4" fill="#b7a6ce"/>'+
 '</g>';
 s+='<g font-family="Arial,sans-serif" font-weight="900">'+
 '<rect x="96" y="106" width="163" height="39" rx="18" fill="#fff5fc" stroke="#dda7d6" stroke-width="4"/>'+
 '<text x="177" y="132" font-size="17" fill="#935c8d" text-anchor="middle">PATIENT CARE</text>'+
 '<rect x="751" y="106" width="162" height="39" rx="18" fill="#f2faff" stroke="#99c4d3" stroke-width="4"/>'+
 '<text x="832" y="132" font-size="17" fill="#547a91" text-anchor="middle">IN-HOUSE LAB</text>'+
 '</g>'+
 '<g><circle cx="950" cy="122" r="18" fill="#ffecf3" stroke="#d899b8" stroke-width="4"/>'+
 '<path d="M940 122h20M950 112v20" stroke="#e56e98" stroke-width="6" stroke-linecap="round"/>'+
 '<path d="M300 157l5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1z" fill="#ffd49b" stroke="#e7a772" stroke-width="2"/>'+
 '<path d="M725 154l5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1z" fill="#ffd49b" stroke="#e7a772" stroke-width="2"/>'+
 '<circle cx="305" cy="129" r="4" fill="#ffffff"/><circle cx="312" cy="118" r="4" fill="#ffffff"/><circle cx="320" cy="128" r="4" fill="#ffffff"/>'+
 '</g>';
 return s+'</svg>';
}
window.VPQ_SCENERY.roomArt=k=>k==='imaging'?imaging():k==='treatment'?treatment():prior(k);
const styles=document.createElement('style');
styles.textContent='.vpqWalkArt{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'+
'.stage[data-room="imaging"] .prop,.stage[data-room="treatment"] .prop,.stage[data-room="imaging"] .roomdecor,.stage[data-room="treatment"] .roomdecor,.stage[data-room="imaging"] .roomBanner,.stage[data-room="treatment"] .roomBanner{display:none!important}'+
'.vpq25Hotspots{position:absolute;inset:0;z-index:5;pointer-events:none}.vpq25Hit{position:absolute;pointer-events:auto;background:transparent;border:2px solid transparent;border-radius:15px;box-shadow:none;transform:none!important;padding:0;overflow:visible}'+
'.vpq25Hit:hover,.vpq25Hit:focus-visible,.vpq25Hit.vpq25Near{background:linear-gradient(180deg,#fffbd017,#fff3a539);border:3px solid #ffc85c;box-shadow:0 0 0 5px #fff1b65c,0 0 24px #ffc96eaa;outline:none}'+
'.vpq25Hit span{position:absolute;bottom:-9%;left:50%;transform:translateX(-50%);padding:6px 8px;border:3px solid #a98cd5;background:linear-gradient(#fff,#f9e9fa);color:#514779;border-radius:16px;font-size:clamp(11px,1.3vw,15px);font-weight:1000;white-space:nowrap;box-shadow:0 4px 0 #9473ac55,0 7px 15px #53678733}.vpq25Hit.vpq25Near span{background:linear-gradient(#fff8d8,#ffe8a5);border-color:#e4aa43;color:#714e2e;box-shadow:0 5px 0 #c78e3c60,0 0 15px #ffe89fb0}.vpq25Hit.vpq25Near:after{content:"E · INTERACT";position:absolute;top:2%;left:50%;transform:translateX(-50%);border-radius:13px;border:2px solid #e4ad53;background:#fff9de;color:#765321;font-size:11px;font-weight:900;padding:5px 9px;white-space:nowrap;box-shadow:0 3px 12px #d8b05955;pointer-events:none}'+
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
function nearest(room,x){
 const stations=spec[room],roomData=api.rooms?.[room];
 if(!stations||!roomData?.props)return null;
 let result=null;
 for(const p of roomData.props){
  const candidate=stations.find(z=>z.action===p.action);
  if(!candidate)continue;
  const distance=Math.abs(p.x-x);
  if(!result||distance<result.distance)result={station:candidate,distance};
 }
 return result&&result.distance<17?result.station:null;
}
function updateNearby(room,x){
 const active=nearest(room,x);
 const hits=stage.querySelectorAll('#vpq25Hotspots [data-vpq25act]');
 hits.forEach(b=>{
  const match=!!active&&b.dataset.vpq25act===active.action;
  b.classList.toggle('vpq25Near',match);
  b.setAttribute('aria-current',match?'true':'false');
 });
 return active;
}
function interactNearest(room,x){
 const active=updateNearby(room,x);
 if(!active)return false;
 api.doAction(active.action);
 return true;
}
const observer=new MutationObserver(()=>{const room=stage.dataset.room,present=stage.querySelector('#vpq25Hotspots');if((!!spec[room])!==!!present||(present&&present.dataset.room!==room))refresh()});
observer.observe(stage,{attributes:true,attributeFilter:['data-room'],childList:true});
refresh();
return {refresh,imaging,treatment,updateNearby,interactNearest};
};