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
  {x:35,y:34,w:12,h:19,label:'💉 Skills Wing',action:'skillsWing'},
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
 s+='<g filter="url(#trt25-shadow)">'+round(352,158,124,113,'#e2f0fa','#9bafcf')+
 '<rect x="363" y="183" width="102" height="77" rx="9" fill="#f9ecf7" stroke="#b8a0ca" stroke-width="4"/>'+
 '<path d="M414 183v77" stroke="#bfa8d3" stroke-width="5"/>'+
 '<circle cx="407" cy="232" r="5" fill="#c6a6d1"/><circle cx="424" cy="232" r="5" fill="#c6a6d1"/>'+
 '<rect x="355" y="161" width="119" height="21" rx="12" fill="#fff5fc" stroke="#b79aca" stroke-width="3"/>'+
 '<text x="414" y="176" font-family="Arial" text-anchor="middle" font-size="11" fill="#8e6297" font-weight="900">CLINICAL SKILLS</text>'+
 '<text x="391" y="228" font-size="18" text-anchor="middle">💉</text><text x="443" y="228" font-size="18" text-anchor="middle">🩸</text></g>';
  // Finishing touches: recovery charts and clean supply shelf, kept away from hotspots.
 s+='<g aria-hidden="true"><path d="M95 141h208" stroke="#e4c6db" stroke-width="4" stroke-linecap="round"/>'+
 '<rect x="111" y="129" width="48" height="8" rx="3" fill="#f7ffff" stroke="#a9c2cb" stroke-width="2"/>'+
 '<rect x="120" y="124" width="12" height="5" rx="2" fill="#9fcdbb"/>'+
 '<rect x="270" y="131" width="24" height="8" rx="3" fill="#b8d8cc"/></g>';
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
 // Two back-to-back stainless treatment tables in a compact island; walking remains in foreground.
 // Rear table is higher in perspective, front table retains the main treatment surface.
 s+='<path d="M527 82v94l-35 18" stroke="#99a3c5" stroke-width="10" fill="none"/>'+
 '<ellipse cx="491" cy="202" rx="36" ry="23" fill="#fff6d6" stroke="#a2acd1" stroke-width="9"/>'+
 [473,491,509].map(x=>'<circle cx="'+x+'" cy="202" r="9" fill="#fffefa"/>').join('')+
 '<g filter="url(#trt25-shadow)">'+
 // Rear treatment table, angled slightly upward into the room.
 '<path d="M444 275l117 -10 37 21 -116 12z" fill="#f6f4fc" stroke="#9baac1" stroke-width="5"/>'+
 '<path d="M468 299v31M573 291v34" stroke="#9ca9bc" stroke-width="8"/>'+
 '<rect x="488" y="318" width="75" height="9" rx="4" fill="#c8c8de"/>'+
 // Front treatment table
 '<rect x="389" y="330" width="209" height="23" rx="10" fill="#e7e0f3" stroke="#8e9fb9" stroke-width="5"/>'+
 '<rect x="404" y="324" width="177" height="11" rx="6" fill="#f9f9fd"/>'+
 '<path d="M415 353l11 68M576 353l-11 68" stroke="#9da8bf" stroke-width="11"/>'+
 '<path d="M431 399h129" stroke="#a8b4cb" stroke-width="7"/>'+
 '<rect x="450" y="357" width="81" height="25" rx="5" fill="#e0e8f4" stroke="#b2bdd0" stroke-width="3"/>'+
 '<text x="492" y="374" font-family="Arial" font-size="10" fill="#7485a4" text-anchor="middle" font-weight="800">TREATMENT</text>'+
 '</g>'+
 // IV stand placed to the LEFT of the tables, leaving the patient area open.
 '<path d="M350 245v142M328 243h44" stroke="#9ca5bc" stroke-width="6" fill="none"/>'+
 '<rect x="338" y="260" width="24" height="40" rx="4" fill="#eaf9fc" stroke="#9bb2cb" stroke-width="3"/>'+
 '<path d="M349 300v23q0 12 14 13" stroke="#c0c5d3" stroke-width="2" fill="none"/>';
 // Patient monitor with convincing ECG
 s+='<g filter="url(#trt25-shadow)">'+round(593,178,133,104,'#34445b','#a9bad4')+
 '<path d="M608 231h18l8 -13 10 34 9 -41 11 26h46" stroke="#71e7bd" stroke-width="4" fill="none"/>'+
 '<text x="687" y="205" font-size="16" fill="#f4b7cb" font-weight="900" text-anchor="middle">♥ 128</text>'+
 '<rect x="647" y="281" width="15" height="26" fill="#a3b4ce"/>'+
 '<rect x="617" y="307" width="80" height="9" rx="4" fill="#99a3c1"/></g>';
 // Compact treatment-cart station. Wall cages will use the right upper panel instead of giant cabinets.
 s+='<g>'+round(299,298,64,83,'#f1ebfa','#aaa6c8')+
 '<path d="M306 327h50M306 350h50" stroke="#a3a8c5" stroke-width="3"/>'+
 '<rect x="306" y="295" width="50" height="8" rx="4" fill="#dce8f3"/>'+
 '<circle cx="313" cy="385" r="6" fill="#7787a7"/><circle cx="351" cy="385" r="6" fill="#7787a7"/>'+
 '</g>';
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
 // Procedures and nursing equipment. Shapes intentionally stay off the interactive button labels.
 // A little gray cat sits on the back table, with a blanket rather than an oversized silhouette.
 s+='<g aria-hidden="true">'+
 '<path d="M467 278l85 -8 21 11 -91 10z" fill="#dcebdc" stroke="#b3d1c6" stroke-width="2"/>'+
 '<ellipse cx="516" cy="275" rx="21" ry="9" fill="#9da5b0"/>'+
 '<path d="M530 273q13 3 13 -12" stroke="#9196a5" stroke-width="4" fill="none" stroke-linecap="round"/>'+
 '<circle cx="500" cy="268" r="11" fill="#abb0b9"/>'+
 '<path d="M491 264l1 -11 9 7 8 -8 3 12" fill="#abb0b9" stroke="#878fa1" stroke-width="1.5"/>'+
 '<path d="M496 269h2m8 0h2" stroke="#495263" stroke-width="2" stroke-linecap="round"/>'+
 '<path d="M500 274q2 3 4 0" fill="none" stroke="#74798c" stroke-width="1.5"/>'+
 '<path d="M512 275l4 3" stroke="#858c9c" stroke-width="2"/>'+
 // Exam tray on rear table and gauze.
 '<rect x="551" y="271" width="26" height="8" rx="3" fill="#c3ccda"/>'+
 '<rect x="554" y="266" width="12" height="6" rx="2" fill="#ffffff"/>'+
 // Wall-mounted procedure supplies: examination gloves, clippers, IV catheter tape, gauze, wraps.
 '<rect x="532" y="183" width="58" height="65" rx="7" fill="#e8eff9" stroke="#a6b7d4" stroke-width="3"/>'+
 '<text x="561" y="193" font-size="8" fill="#647f9b" font-weight="900" text-anchor="middle" font-family="Arial">PROCEDURES</text>'+
 '<rect x="537" y="199" width="24" height="18" rx="4" fill="#fcf9ff" stroke="#b5aacb" stroke-width="2"/>'+
 '<path d="M542 215l3 -8 4 3 3 -3 4 8" fill="#f8fbff" stroke="#9fb9ce" stroke-width="1.3"/>'+
 '<rect x="565" y="199" width="18" height="18" rx="4" fill="#d2e6e6" stroke="#97b9bb" stroke-width="2"/>'+
 '<path d="M571 205v8m5 -9v8" stroke="#738e9d" stroke-width="2"/>'+
 '<rect x="537" y="221" width="18" height="17" rx="4" fill="#f5e7fa" stroke="#b9a5cd" stroke-width="2"/>'+
 '<circle cx="546" cy="230" r="6" fill="#f7f7fb" stroke="#c3a8d2" stroke-width="3"/>'+
 '<rect x="560" y="221" width="22" height="17" rx="4" fill="#f9faff" stroke="#b6bfd5" stroke-width="2"/>'+
 '<path d="M565 230h12" stroke="#92a3bf" stroke-width="3"/>'+
 // Electric clipper, small nail trimmer and bandage roll set on rail.
 '<path d="M532 248h59" stroke="#b3accb" stroke-width="4"/>'+
 '<path d="M540 246v-8l6 -2 3 10" fill="#a5bfca" stroke="#6e93aa" stroke-width="2"/>'+
 '<path d="M560 247l5 -10 4 10m-4 -10l7 10" stroke="#8799aa" stroke-width="2" fill="none"/>'+
 '<circle cx="580" cy="243" r="5" fill="#f3f1fb" stroke="#b598d4" stroke-width="2"/>'+
 // Small oxygen supply ports beside the procedure station.
 '<rect x="604" y="157" width="62" height="22" rx="6" fill="#eaf7f8" stroke="#a4bfce" stroke-width="3"/>'+
 '<circle cx="615" cy="168" r="5" fill="#81cbb6"/><circle cx="632" cy="168" r="5" fill="#efc57e"/>'+
 '<circle cx="650" cy="168" r="5" fill="#b2b7d5"/>'+
 // Separate red emergency cart beneath the ECG; readable mark at real game size.
 '<rect x="636" y="320" width="67" height="60" rx="7" fill="#f7c6c7" stroke="#ca7c91" stroke-width="4"/>'+
 '<rect x="632" y="314" width="75" height="11" rx="4" fill="#fff1f2" stroke="#ca7c91" stroke-width="3"/>'+
 '<path d="M646 339h48M646 357h48" stroke="#d89caf" stroke-width="3"/>'+
 '<path d="M665 329v16M657 337h16" stroke="#e66c85" stroke-width="5" stroke-linecap="round"/>'+
 '<circle cx="646" cy="385" r="6" fill="#747b98"/><circle cx="691" cy="385" r="6" fill="#747b98"/>'+
 '<text x="670" y="307" text-anchor="middle" fill="#a66e82" font-family="Arial" font-size="11" font-weight="900">CRASH</text>'+
 // Cabinet for oxygen patient next to the in-house laboratory.
 '<rect x="746" y="165" width="109" height="111" rx="11" fill="#e8f9fa" stroke="#92bdc9" stroke-width="5"/>'+
 '<rect x="755" y="182" width="91" height="84" rx="6" fill="#f6ffff" stroke="#b2d4dc" stroke-width="3"/>'+
 '<rect x="752" y="152" width="98" height="21" rx="9" fill="#fbffff" stroke="#9dbfc9" stroke-width="3"/>'+
 '<text x="801" y="166" font-family="Arial" text-anchor="middle" font-size="11" font-weight="900" fill="#6291a0">OXYGEN • ICU</text>'+
 '<rect x="765" y="243" width="71" height="13" rx="6" fill="#d6ebed"/>'+
 // Quiet cat within the O2-enriched enclosure, with observation window.
 '<ellipse cx="796" cy="237" rx="24" ry="11" fill="#d3bbb1"/>'+
 '<circle cx="780" cy="228" r="11" fill="#e2c8b7"/>'+
 '<path d="M770 222l1 -12 10 8 8 -8 3 12" fill="#e2c8b7" stroke="#b99283" stroke-width="1.5"/>'+
 '<circle cx="776" cy="227" r="2" fill="#5d5859"/><circle cx="785" cy="227" r="2" fill="#5d5859"/>'+
 '<path d="M799 237q19 0 17 -14" stroke="#b7958a" stroke-width="5" fill="none" stroke-linecap="round"/>'+
 '<circle cx="826" cy="192" r="7" fill="#ffffff" stroke="#9fc4ca" stroke-width="2"/>'+
 '<text x="826" y="195" font-family="Arial" font-size="7" fill="#6393a0" text-anchor="middle">O₂</text>'+
 // Dedicated exotics recovery cage, compact and partly planted.
 '<rect x="865" y="165" width="76" height="111" rx="9" fill="#e9f7eb" stroke="#a1c4ae" stroke-width="5"/>'+
 '<rect x="871" y="183" width="64" height="82" rx="4" fill="#fbfff8" stroke="#c3d9b9" stroke-width="3"/>'+
 '<rect x="860" y="152" width="84" height="21" rx="9" fill="#fffdf5" stroke="#b5cbb1" stroke-width="3"/>'+
 '<text x="902" y="166" font-family="Arial" font-size="11" fill="#668d70" font-weight="900" text-anchor="middle">EXOTICS</text>'+
 '<rect x="876" y="239" width="52" height="16" rx="7" fill="#e9dcc2"/>'+
 // Rabbit facing right, standing near a hide box.
 '<ellipse cx="898" cy="232" rx="17" ry="12" fill="#ece8de"/>'+
 '<circle cx="911" cy="225" r="10" fill="#f4ede4"/>'+
 '<ellipse cx="910" cy="208" rx="5" ry="18" fill="#eee9e1" stroke="#c4beb8" stroke-width="1.5"/>'+
 '<ellipse cx="919" cy="211" rx="5" ry="18" fill="#eee9e1" stroke="#c4beb8" stroke-width="1.5"/>'+
 '<ellipse cx="910" cy="211" rx="2" ry="12" fill="#e9c5d0"/>'+
 '<circle cx="915" cy="225" r="2" fill="#5c5a62"/>'+
 '<circle cx="882" cy="232" r="6" fill="#f8f5f2"/>'+
 '<path d="M873 238v-13l8 -7 9 7v13" fill="#b2c7a4" stroke="#93b28c" stroke-width="2"/>'+
 // Individual enclosure doors, windows and vents; labels remain outside main gameplay elements.
 [757,780,803,826,845].map(x=>'<path d="M'+x+' 185v77" stroke="#c2dce0" stroke-width="1.5" opacity=".65"/>').join('')+
 [873,890,907,925].map(x=>'<path d="M'+x+' 186v76" stroke="#d1dec9" stroke-width="1.5" opacity=".65"/>').join('')+
 '</g>';
 // Carefully scaled details added after core equipment: facial markings, chart tabs,
 // patient IV monitoring, exotics enrichment and stocked tray. Nothing changes hit targets.
 s+='<g aria-hidden="true">'+
 // Ginger tabby whiskers, stripes, and pink ear linings.
 '<path d="M122 187l4 -8 5 7m8 0l5 -8 2 11" fill="#f5c0a4"/>'+
 '<path d="M129 190l3 5m5 -6l-2 6" stroke="#bb7c58" stroke-width="1.5"/>'+
 '<path d="M122 205l-13 0m13 4l-14 5m29 -8l12 -2m-11 6l12 4" fill="none" stroke="#b77b5d" stroke-width="1.5" stroke-linecap="round"/>'+
 '<path d="M156 205l5 5m-14 -7l7 6m11 -8l5 7" stroke="#b67b59" stroke-width="2.5" fill="none"/>'+
 // Small dog patch, belly and front paws.
 '<ellipse cx="237" cy="200" rx="9" ry="11" fill="#b98b76" opacity=".6"/>'+
 '<path d="M226 222q19 8 38 0" stroke="#f9f1e9" stroke-width="8" fill="none" stroke-linecap="round"/>'+
 '<ellipse cx="245" cy="225" rx="6" ry="3" fill="#f8eee6"/><ellipse cx="264" cy="225" rx="7" ry="3" fill="#f8eee6"/>'+
 '<path d="M227 209q5 5 10 0" fill="none" stroke="#8d736f" stroke-width="1.5"/>'+
 // Big dog muzzle, blaze and depth to coat.
 '<path d="M174 296q19 -11 41 -3t23 24" fill="none" stroke="#b98766" stroke-width="6" opacity=".55"/>'+
 '<path d="M132 287q11 0 13 10l-11 6" fill="#f7dcc2" opacity=".8"/>'+
 '<path d="M131 309q5 6 13 0" fill="none" stroke="#87665f" stroke-width="2"/>'+
 '<path d="M119 324l-11 2m19 -5l-12 9m34 -10l10 7" fill="none" stroke="#bd8a73" stroke-width="1.6" stroke-linecap="round"/>'+
 // Oxygen-monitoring connection with a visible flow selector, not a giant cable.
 '<rect x="814" y="176" width="22" height="12" rx="4" fill="#f8ffff" stroke="#9fc7c9" stroke-width="1.5"/>'+
 '<circle cx="820" cy="182" r="3" fill="#9fdcc8"/><circle cx="830" cy="182" r="3" fill="#e5cf94"/>'+
 '<path d="M823 188v11q-10 5 -9 19" stroke="#abd7d3" stroke-width="2" fill="none"/>'+
 // Exotics: short enrichment branch, natural hay and securely placed water dish.
 '<path d="M881 247l-5 -16m7 14l5 -14" stroke="#88af86" stroke-width="2.2"/>'+
 '<path d="M895 246l-3 -8m4 7l6 -9" stroke="#c3ab79" stroke-width="1.5"/>'+
 '<ellipse cx="924" cy="247" rx="7" ry="3" fill="#b2d8e1" stroke="#8bbaca" stroke-width="1.3"/>'+
 // Small color-coded drawers, procedure supplies and label strip under wall rack.
 '<rect x="587" y="251" width="51" height="19" rx="5" fill="#f9fbfe" stroke="#a9bac9" stroke-width="2"/>'+
 '<rect x="591" y="254" width="11" height="11" rx="2" fill="#b9d8d3"/>'+
 '<rect x="605" y="254" width="11" height="11" rx="2" fill="#ead0da"/>'+
 '<rect x="619" y="254" width="11" height="11" rx="2" fill="#d1c7ea"/>'+
 '</g>';
 // Ward visual upgrade: clearly recognizable sterile stainless treatment surfaces,
 // monitoring ribbon, patient comforts and a dedicated hand-washing station.
 // This group is intentionally drawn above furniture but remains noninteractive.
 s+='<g aria-hidden="true">'+
 // Steel edge and equipment tray on the paired treatment table
 '<path d="M405 334H581" stroke="#a0b7c3" stroke-width="5" stroke-linecap="round"/>'+
 '<path d="M444 286l115 -11" stroke="#ffffff" stroke-width="3" opacity=".8"/>'+
 '<rect x="542" y="307" width="41" height="17" rx="4" fill="#e8eef3" stroke="#a6b6c4" stroke-width="2"/>'+
 '<rect x="548" y="311" width="9" height="8" rx="2" fill="#b8ddd6"/>'+
 '<rect x="560" y="311" width="9" height="8" rx="2" fill="#d9c9e7"/>'+
 '<rect x="571" y="311" width="7" height="8" rx="2" fill="#ffffff"/>'+
 // Patient recovery charts (one for each upper cage) and washable pads
 '<rect x="101" y="177" width="16" height="16" rx="3" fill="#ffffff" stroke="#b6a8cf" stroke-width="2"/>'+
 '<path d="M105 183h8m-8 4h6" stroke="#9ca9c1" stroke-width="1.5"/>'+
 '<rect x="204" y="177" width="16" height="16" rx="3" fill="#ffffff" stroke="#b6a8cf" stroke-width="2"/>'+
 '<path d="M208 183h8m-8 4h6" stroke="#9ca9c1" stroke-width="1.5"/>'+
 // Rounded oxygen cage breathing circuit, soft aqua enclosure wash.
 '<rect x="753" y="180" width="96" height="89" rx="7" fill="none" stroke="#8fc7d4" stroke-width="3"/>'+
 '<path d="M764 181v8h70v-8" fill="none" stroke="#a4dde1" stroke-width="4"/>'+
 '<path d="M828 188v9q-7 8 -7 19" fill="none" stroke="#75baba" stroke-width="3" stroke-linecap="round"/>'+
 '<rect x="769" y="253" width="67" height="10" rx="5" fill="#e4f4f6" stroke="#bbdadd" stroke-width="1.5"/>'+
 // Exotics enclosure gets perforated upper ventilation, a visibly cozy hide and water.
 '<path d="M877 186h51" stroke="#a4c6a7" stroke-width="4" stroke-dasharray="3 5" stroke-linecap="round"/>'+
 '<path d="M877 249v-17l12 -10 12 10v17" fill="#c5dcb9" stroke="#89ad86" stroke-width="2"/>'+
 '<path d="M883 250v-11q6 -7 12 0v11" fill="#a2bc93"/>'+
 '<ellipse cx="923" cy="255" rx="10" ry="4" fill="#a8d9e3" stroke="#83b4c7" stroke-width="2"/>'+
 // Emergency cart top defibrillator kit, clearly separated from monitor station.
 '<rect x="641" y="300" width="45" height="16" rx="4" fill="#f2f6fb" stroke="#a6b4cb" stroke-width="2"/>'+
 '<rect x="647" y="303" width="19" height="9" rx="2" fill="#40566d"/>'+
 '<path d="M650 308h4l2 -2 2 4 3 -2h3" stroke="#70dcc4" stroke-width="1.3" fill="none"/>'+
 '<rect x="671" y="303" width="9" height="9" rx="2" fill="#d5a6b2"/>'+
 // Handwash dispenser station between sterile prep and treatment monitor.
 '<rect x="606" y="184" width="36" height="48" rx="6" fill="#eff9fb" stroke="#9fc3cc" stroke-width="3"/>'+
 '<rect x="610" y="190" width="28" height="24" rx="4" fill="#d0e9e9"/>'+
 '<path d="M613 206q12 8 22 0" fill="none" stroke="#8bbebf" stroke-width="2"/>'+
 '<path d="M614 217h20" stroke="#8db2bd" stroke-width="2"/>'+
 '<rect x="614" y="224" width="20" height="4" rx="2" fill="#b2cbd0"/>'+
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
'.vpq25Hit span{position:absolute;bottom:-4%;left:50%;transform:translateX(-50%);padding:4px 7px;border:2px solid #a98cd5;background:linear-gradient(#fff,#f9e9fa);color:#514779;border-radius:16px;font-size:clamp(10px,1.05vw,13px);font-weight:900;white-space:nowrap;box-shadow:0 2px 0 #9473ac44,0 4px 8px #53678722}.vpq25Hit.vpq25Near span{background:linear-gradient(#fff8d8,#ffe8a5);border-color:#e4aa43;color:#714e2e;box-shadow:0 5px 0 #c78e3c60,0 0 15px #ffe89fb0}.vpq25Hit.vpq25Near:after{content:"E · INTERACT";position:absolute;top:2%;left:50%;transform:translateX(-50%);border-radius:13px;border:2px solid #e4ad53;background:#fff9de;color:#765321;font-size:11px;font-weight:900;padding:5px 9px;white-space:nowrap;box-shadow:0 3px 12px #d8b05955;pointer-events:none}'+
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