/* Phase A.3 cozy student study lounge: perspective background and existing study tools. */
window.VPQ_STUDY_LOUNGE_A3=function(api){
'use strict';
const {rooms,doAction,changeRoom}=api,stage=document.getElementById('stage'),art=window.VPQ_SCENERY;
if(!stage||!art||!rooms.study)return null;
const previous=art.roomArt.bind(art);
function lounge(){
return '<svg class="vpqStudyLoungeArt" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Walkable student study lounge with comfy sofa, textbook shelves, study computer, mini kitchen, clinical skills and arcade">'+
'<defs><linearGradient id="vpqSLFloor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f0dcba"/><stop offset="1" stop-color="#c6a98f"/></linearGradient><filter id="vpqSLShade"><feGaussianBlur stdDeviation="11"/></filter></defs>'+
'<rect width="1000" height="500" fill="#d7bce2"/><polygon points="0,0 1000,0 930,55 70,55" fill="#fff9ed"/><polygon points="0,0 70,55 70,320 0,391" fill="#c7b1d4"/><polygon points="930,55 1000,0 1000,391 930,320" fill="#c7b1d4"/><rect x="70" y="55" width="860" height="265" fill="#f7eefa"/>'+
'<path d="M70 320H930L1000 500H0Z" fill="url(#vpqSLFloor)"/><path d="M70 320L0 500M930 320L1000 500M240 320L202 500M390 320L374 500M535 320V500M690 320L709 500M835 320L887 500M27 431H974M55 364H947" stroke="#fff8e9" stroke-width="3" fill="none" opacity=".7"/>'+
'<path d="M70 55H930M70 320H930" stroke="#b69bbb" stroke-width="10" fill="none" opacity=".5"/>'+
// A single cohesive bookcase; spine lettering is limited to shelf tags, not stacked duplicates.
'<g><rect x="96" y="112" width="165" height="214" rx="12" fill="#9c7967" stroke="#806553" stroke-width="6"/>'+
'<rect x="107" y="124" width="143" height="184" rx="5" fill="#f1dcc5"/>'+
'<path d="M108 183H249M108 247H249M108 300H249" stroke="#a17c67" stroke-width="9"/>'+
'<rect x="117" y="139" width="18" height="39" rx="2" fill="#7ca9bc"/><rect x="138" y="133" width="20" height="45" rx="2" fill="#c7a4d7"/>'+
'<rect x="161" y="143" width="18" height="35" rx="2" fill="#e0ae93"/><rect x="182" y="137" width="20" height="41" rx="2" fill="#91bbaa"/>'+
'<rect x="205" y="133" width="19" height="45" rx="2" fill="#bd97b7"/><rect x="227" y="143" width="14" height="35" rx="2" fill="#90a5cc"/>'+
'<path d="M120 150v18M143 144v24M166 152v16M187 147v21M210 145v23M232 153v15" stroke="#fff8e9" stroke-width="2" opacity=".8"/>'+
'<rect x="117" y="194" width="19" height="47" rx="2" fill="#d699a6"/><rect x="139" y="203" width="17" height="38" rx="2" fill="#94b5c7"/>'+
'<rect x="159" y="196" width="17" height="45" rx="2" fill="#9cbd9f"/><rect x="179" y="200" width="20" height="41" rx="2" fill="#d9b28c"/>'+
'<rect x="203" y="195" width="17" height="46" rx="2" fill="#bda4d1"/><rect x="223" y="202" width="17" height="39" rx="2" fill="#90bdb1"/>'+
'<path d="M123 205v25M145 212v20M165 206v25M185 209v22M209 205v24M229 211v20" stroke="#fdf4ec" stroke-width="2"/>'+
'<rect x="117" y="259" width="58" height="14" rx="3" fill="#8da5c0"/><rect x="120" y="276" width="54" height="13" rx="3" fill="#d4a3b7"/>'+
'<rect x="190" y="259" width="20" height="33" rx="2" fill="#a9baa1"/><rect x="212" y="263" width="25" height="29" rx="2" fill="#d4b496"/>'+
'<text x="145" y="269" text-anchor="middle" font-family="Arial" font-size="8" font-weight="900" fill="white">VET JOURNAL</text>'+
'<text x="147" y="286" text-anchor="middle" font-family="Arial" font-size="8" font-weight="900" fill="white">CASE FILES</text>'+
'<rect x="110" y="306" width="136" height="15" rx="4" fill="#fff7ee" stroke="#a77d70" stroke-width="2"/>'+
'<text x="178" y="317" font-family="Arial" font-size="10" font-weight="900" text-anchor="middle" fill="#745d74">VET STUDY LIBRARY</text></g>'+ 
'<g transform="translate(426 88) scale(.77 1)"><rect width="360" height="170" rx="13" fill="#fffefc" stroke="#a79ac7" stroke-width="9"/><rect x="13" y="14" width="335" height="135" rx="5" fill="#f8fcfd"/><text x="180" y="39" text-anchor="middle" font-family="sans-serif" font-size="21" font-weight="800" fill="#4b6f85">TODAY\'S STUDY PLAN</text><circle cx="60" cy="80" r="13" fill="#87baa4"/><path d="M52 80l6 7l11 -16" stroke="white" stroke-width="4" fill="none"/><text x="88" y="85" font-family="sans-serif" font-size="17" fill="#536e85">Understand the WHY</text><circle cx="60" cy="122" r="13" fill="#d3b0d9"/><text x="88" y="127" font-family="sans-serif" font-size="17" fill="#536e85">Practice • Apply • Review</text><rect x="9" y="156" width="343" height="8" rx="4" fill="#acb7c5"/></g>'+
'<g transform="translate(725 91)"><rect width="163" height="131" rx="7" fill="#b1dceb" stroke="#91abc4" stroke-width="9"/><path d="M8 113Q55 55 101 104T155 80V123H8Z" fill="#a4cbb4"/><path d="M80 4V127M5 66H157" stroke="#f3fbff" stroke-width="7"/><path d="M-8 132H172" stroke="#f2eadf" stroke-width="13"/></g>'+
'<ellipse cx="507" cy="421" rx="256" ry="32" fill="#59465a" opacity=".23" filter="url(#vpqSLShade)"/>'+
// Compact recognizable study table, offset to the right, with an elevated monitor and four visible legs.
'<g><ellipse cx="592" cy="395" rx="139" ry="16" fill="#735b69" opacity=".16"/>'+
'<path d="M454 344L507 314H685L742 344L696 370H496Z" fill="#edcaa7" stroke="#a77f6d" stroke-width="6"/>'+
'<path d="M496 370H696V389H496Z" fill="#bd947c" stroke="#9e796f" stroke-width="4"/>'+
'<path d="M454 344L496 370V389L454 365Z" fill="#b08375" stroke="#9e796f" stroke-width="3"/>'+
'<path d="M696 370L742 344V365L696 389Z" fill="#b3897c" stroke="#9e796f" stroke-width="3"/>'+
'<path d="M507 389v46M685 389v46M468 365v35M724 365v35" stroke="#8f6b63" stroke-width="9"/>'+
'<rect x="547" y="251" width="106" height="76" rx="9" fill="#687c91" stroke="#52687b" stroke-width="5"/>'+
'<rect x="555" y="259" width="90" height="58" rx="4" fill="#e9f4f7"/>'+
'<rect x="561" y="265" width="78" height="15" rx="3" fill="#b6d8dc"/>'+
'<text x="600" y="276" font-family="Arial" font-size="11" font-weight="900" text-anchor="middle" fill="#3d6882">VET STUDY</text>'+
'<text x="600" y="294" font-family="Arial" font-size="11" font-weight="900" text-anchor="middle" fill="#74598a">PHARM • TOX</text>'+
'<text x="600" y="309" font-family="Arial" font-size="9" text-anchor="middle" fill="#526c7e">Study • Cases • Quiz</text>'+
'<path d="M599 327v13m-24 0h49" stroke="#687c91" stroke-width="6" stroke-linecap="round"/>'+
'<path d="M548 345h104l9 7H541Z" fill="#95a7b6" stroke="#71899a" stroke-width="2"/>'+
'<path d="M494 329l38 -11 23 12 -37 13Z" fill="#fdf9ef" stroke="#cfbdb1" stroke-width="2"/>'+
'<path d="M518 322v15" stroke="#d4a7bf" stroke-width="2"/>'+
'<rect x="677" y="327" width="21" height="24" rx="4" fill="#dfb1ce"/><path d="M698 333q14 -4 9 9 -2 6 -9 3" fill="none" stroke="#c69bbd" stroke-width="4"/>'+
'</g>'+ 
// Built-in small coffee maker atop the fitted kitchenette; upgraded by the studio.
'<g transform="translate(838 167) scale(.76 .82)">'+
'<ellipse cx="88" cy="235" rx="92" ry="18" fill="#443d69" opacity=".23"/>'+
'<path d="M17 23L49 4H159L175 25V208L156 229H16Z" fill="#56478d" stroke="#352f65" stroke-width="7"/>'+
'<path d="M17 23H147L159 4H49Z" fill="#a58cdd" stroke="#514589" stroke-width="5"/>'+
'<path d="M147 23L175 25V208L156 229L147 207Z" fill="#372e63"/>'+
'<path d="M18 22H147V207H18Z" fill="#9870cf" stroke="#443278" stroke-width="5"/>'+
'<rect x="28" y="34" width="107" height="39" rx="7" fill="#f7da81" stroke="#fee9b8" stroke-width="4"/>'+
'<text x="81" y="50" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="900" fill="#3b376f">VET PHARM</text>'+
'<text x="81" y="66" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="900" fill="#3b376f">ARCADE</text>'+
'<rect x="28" y="81" width="107" height="74" rx="8" fill="#302d5d" stroke="#b3dbdf" stroke-width="5"/>'+
'<rect x="37" y="91" width="89" height="55" rx="6" fill="#75c7d4"/>'+
'<path d="M45 135Q61 105 84 118T119 101V140H45Z" fill="#3f91b4"/>'+
'<text x="83" y="110" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="900" fill="#fff8b2">PLAY!</text>'+
'<text x="83" y="131" text-anchor="middle" font-size="18">🐾</text>'+
'<path d="M17 161H146L154 182H12Z" fill="#e7b3dc" stroke="#7954a2" stroke-width="5"/>'+
'<circle cx="52" cy="172" r="7" fill="#403566"/><path d="M52 167v-14" stroke="#35305c" stroke-width="6"/><circle cx="52" cy="149" r="7" fill="#f5d576"/>'+
'<circle cx="93" cy="170" r="7" fill="#78d0c3"/><circle cx="116" cy="170" r="7" fill="#ffd17d"/>'+
'<path d="M26 184H139V207H26Z" fill="#6d599f"/>'+
'<text x="82" y="197" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="800" fill="#faf4ff">MINIGAMES</text>'+
'<rect x="27" y="209" width="25" height="15" rx="3" fill="#352e65"/><rect x="114" y="209" width="25" height="15" rx="3" fill="#352e65"/>'+
'</g>'+ 
// Side-facing lounge sofa, softened by rounded arm cushions and an oblique seat edge.
'<ellipse cx="178" cy="449" rx="122" ry="24" fill="#dfcbe8"/>'+
'<g><path d="M98 350Q99 330 123 325L247 320Q276 320 287 346L291 402Q291 421 269 433L120 437Q89 428 85 410Z" fill="#a792c5" stroke="#806a9f" stroke-width="6"/>'+
'<path d="M119 344Q130 331 151 331L252 329Q275 330 276 352L264 382L123 383Q104 373 119 344Z" fill="#ded0ef" stroke="#a08abc" stroke-width="4"/>'+
'<path d="M117 376Q145 365 187 368L255 368Q276 369 277 385L255 419Q211 428 140 425Q104 415 108 391Z" fill="#cbb8e3" stroke="#9780b9" stroke-width="5"/>'+
'<path d="M94 361Q80 355 73 371L69 407Q71 429 95 433L119 425Q105 402 115 383Q114 364 94 361Z" fill="#b7a4d2" stroke="#8a77a7" stroke-width="5"/>'+
'<path d="M265 358Q287 343 302 360Q316 378 306 406Q299 421 276 432L253 420Q274 390 265 358Z" fill="#b29bcf" stroke="#8a76aa" stroke-width="5"/>'+
'<path d="M133 362Q144 348 166 348Q181 352 183 368L177 388L135 387Q121 379 133 362Z" fill="#f0b9b0"/>'+
'<path d="M190 349Q218 345 235 352L250 379L237 390L186 386Z" fill="#9fceb9"/>'+
'<path d="M110 428v12M278 428v11" stroke="#806b9a" stroke-width="9" stroke-linecap="round"/></g>'+ 
// Smaller arcade-like clinical skills simulator sits farther back on the right wall.
'<g transform="translate(708 169) scale(.72 .82)">'+
'<ellipse cx="84" cy="218" rx="86" ry="13" fill="#5d527d" opacity=".15"/>'+
'<path d="M9 24L43 6H136L154 25V191L136 209H9Z" fill="#6b92a6" stroke="#486b87" stroke-width="7"/>'+
'<path d="M9 24H133L136 6H43Z" fill="#add8d6" stroke="#6188a1" stroke-width="4"/>'+
'<path d="M133 24L154 25V191L136 209L133 185Z" fill="#4f718e"/>'+
'<rect x="18" y="29" width="114" height="158" rx="6" fill="#9dd1d1" stroke="#577f9c" stroke-width="4"/>'+
'<rect x="24" y="35" width="102" height="38" rx="8" fill="#fbe5c3" stroke="#fff8e3" stroke-width="3"/>'+
'<text x="75" y="49" text-anchor="middle" font-family="Arial" font-weight="900" font-size="13" fill="#536388">CLINICAL</text>'+
'<text x="75" y="65" text-anchor="middle" font-family="Arial" font-weight="900" font-size="14" fill="#536388">SKILLS</text>'+
'<rect x="25" y="84" width="100" height="66" rx="8" fill="#496c90" stroke="#e5eff3" stroke-width="4"/>'+
'<rect x="32" y="91" width="86" height="51" rx="5" fill="#d1f0e8"/>'+
'<text x="75" y="117" text-anchor="middle" font-size="25">💉</text>'+
'<text x="75" y="134" text-anchor="middle" font-size="20">🩸</text>'+
'<path d="M17 157H134L143 176H9Z" fill="#d4b4d9" stroke="#6186a1" stroke-width="4"/>'+
'<circle cx="48" cy="164" r="7" fill="#7ca3c8"/><circle cx="95" cy="164" r="7" fill="#f3b1a9"/>'+
'<path d="M18 180H132V194H18Z" fill="#547c99"/>'+
'<text x="75" y="191" font-family="Arial" font-size="10" text-anchor="middle" fill="#fff9ee" font-weight="900">PRACTICE LAB</text></g>'+
// The kitchenette is a single fitted cabinet, not floating unrelated objects.
// Expanded kitchenette beneath window: independent fridge, usable counter, sink and coffee-machine space.
'<g transform="translate(279 267)"><rect x="0" y="0" width="172" height="84" rx="6" fill="#d3b6a8" stroke="#aa9088" stroke-width="4"/>'+
'<rect x="4" y="4" width="51" height="75" rx="4" fill="#d8ecea" stroke="#93b0b6" stroke-width="3"/>'+
'<path d="M7 35H52" stroke="#a1bcc0" stroke-width="3"/><rect x="15" y="13" width="24" height="8" rx="3" fill="#f7fffe"/>'+
'<text x="29" y="66" font-family="Arial" font-size="9" text-anchor="middle" font-weight="900" fill="#638794">FRIDGE</text>'+
'<rect x="60" y="6" width="108" height="70" rx="4" fill="#ead9cd" stroke="#b69991" stroke-width="3"/>'+
'<path d="M113 17v49M65 22h98" stroke="#bea69e" stroke-width="2"/>'+
'<path d="M-5 -4h183" stroke="#f7ebe1" stroke-width="13" stroke-linecap="round"/>'+
'<ellipse cx="133" cy="-5" rx="20" ry="8" fill="#b4d6dc" stroke="#96b4bd" stroke-width="3"/>'+
'<path d="M133 -8v-22h17v15" fill="none" stroke="#819ea9" stroke-width="5" stroke-linecap="round"/>'+
'<text x="94" y="51" font-family="Arial" font-size="10" font-weight="900" fill="#887083" text-anchor="middle">STORAGE</text></g>'+
// A lit window and an actual sill for the player-selected plant collection.
'<g><rect x="268" y="90" width="147" height="133" rx="12" fill="#faf6eb" stroke="#c5a6c8" stroke-width="6"/><rect x="276" y="99" width="132" height="107" rx="6" fill="#cde8f0"/><path d="M276 174q32 -20 67 1t65 -5v36H276Z" fill="#a2cdb7"/><path d="M341 99v108M276 151h132" stroke="#fffdf9" stroke-width="7"/><rect x="257" y="211" width="166" height="12" rx="5" fill="#cba89d" stroke="#aa8d94" stroke-width="3"/><text x="341" y="84" font-family="Arial" font-size="11" text-anchor="middle" font-weight="900" fill="#79658b">GREENHOUSE WINDOW</text></g>'+
'<g transform="translate(352 223) scale(1.12)"><rect width="32" height="31" rx="5" fill="#a7c4c5" stroke="#879ea5" stroke-width="3"/><rect x="5" y="4" width="22" height="10" rx="3" fill="#eaf4f1"/><path d="M15 16v7" stroke="#fff" stroke-width="4"/><path d="M8 23h16l-3 6H11Z" fill="#f9eee7"/><circle cx="26" cy="18" r="2" fill="#e5c779"/></g>'+
'<g font-family="Arial" font-weight="900" text-anchor="middle"><text x="572" y="77" font-size="12" fill="#735893">PHARMACOLOGY • TOXICOLOGY</text></g>'+
'<text x="122" y="95" font-family="sans-serif" font-size="13" font-weight="800" fill="#736589">STUDENT LIBRARY</text></svg>';
}
art.roomArt=function(k){return k==='study'?lounge():previous(k)};
const p=rooms.study.props;
p[0].x=59;p[0].label='Study Computer · Pharm & Tox';p[0].action='study';
p[1].x=30;p[1].label='Mastery Tracker';
p[2].x=78;p[2].label='Game Arcade · Practice';
function refresh(){
 stage.querySelector('#vpqLoungeHotspots')?.remove();
 if(stage.dataset.room!=='study')return;
 const node=document.createElement('div');node.id='vpqLoungeHotspots';
 node.innerHTML='<button type="button" class="vpqLoungeHot vpqLoungeDesk" data-vpqstudyaction="study" aria-label="Study computer: Pharmacology, Toxicology and clinical learning"><span><b>💻 Study Computer</b><small>Lectures &amp; cases</small></span></button>'+
 '<button type="button" class="vpqLoungeHot vpqLoungeMastery" data-vpqstudyaction="masteryTracker" aria-label="Mastery Tracker: revisit weak concepts"><span><b>🏆 Progress</b><small>Mastery tracker</small></span></button>'+
 '<button type="button" class="vpqLoungeHot vpqLoungeGames" data-vpqstudyaction="learningHub" aria-label="Play the arcade cabinet: Drug Match, Bug Battles and Exam Boss"><span><b>🕹️ Arcade</b><small>Drug Match • Bug Battles</small></span></button>'+
 '<button type="button" class="vpqLoungeSkills" data-vpqstudyaction="skillsWing" aria-label="Enter the Clinical Skills Wing to practice injections and blood collection">💉 Skills Wing</button>'+
'<button type="button" class="vpqLoungeExit" data-vpqstudyreturn="1" aria-label="Return to reception">← Reception</button>';
 node.addEventListener('click',e=>{let b=e.target.closest('button');if(!b)return;if(b.dataset.vpqstudyreturn!==undefined)changeRoom('reception');else if(b.dataset.vpqstudyaction)doAction(b.dataset.vpqstudyaction)});
 stage.appendChild(node);
}
const css=document.createElement('style');
css.textContent='.vpqStudyLoungeArt{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}'+
'.stage[data-room="study"] .roomdecor,.stage[data-room="study"] .prop{display:none!important}'+
'#vpqLoungeHotspots{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqLoungeHot{position:absolute;pointer-events:auto;border:2px solid transparent!important;background:transparent!important;border-radius:12px;box-shadow:none!important;transform:none!important;cursor:pointer}'+
'.vpqLoungeHot:hover,.vpqLoungeHot:focus-visible{border:2px dashed #d1a85d!important;background:#fff4c220!important;outline:none}'+
'.vpqLoungeHot span{display:none;position:absolute;bottom:100%;left:50%;transform:translateX(-50%);min-width:120px;max-width:145px;text-align:center;background:#fffaf4;border:2px solid #9ba7bd;color:#303c64;border-radius:9px;padding:5px 7px;font-size:11px;font-weight:800;box-shadow:0 3px 7px #65728636;z-index:3}'+
'.vpqLoungeHot:is(:hover,:focus-visible) span{display:block}.vpqLoungeHot b,.vpqLoungeHot small{display:block}.vpqLoungeHot small{font-size:10px;font-weight:600}'+
'.vpqLoungeDesk{left:53%;top:45%;width:12%;height:23%}.vpqLoungeMastery{left:43%;top:18%;width:26%;height:26%}.vpqLoungeGames{left:84%;top:33%;width:13%;height:34%}'+
'.vpqLoungeSkills{position:absolute;left:71%;top:33%;width:11%;height:35%;padding:0;pointer-events:auto;border:2px solid transparent;background:transparent;color:transparent;border-radius:10px;font-size:0;cursor:pointer;box-shadow:none}.vpqLoungeSkills:hover,.vpqLoungeSkills:focus-visible{border:2px dashed #e5b657;background:#fff4c522;outline:none}'+
'.vpqLoungeExit{top:8%;right:2%;padding:6px 10px;border-radius:15px;background:#fffaf0ed;color:#584d70;font-size:11px;font-weight:800}'+
'@media(max-width:600px){.vpqLoungeHot span{font-size:9px;padding:3px 5px}.vpqLoungeExit{font-size:9px;padding:5px}}';
document.head.appendChild(css);
const obs=new MutationObserver(()=>{if((stage.dataset.room==='study')!==!!stage.querySelector('#vpqLoungeHotspots'))refresh()});
obs.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
refresh();
return {refresh,lounge};
};