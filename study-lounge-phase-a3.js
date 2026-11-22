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
'<g transform="translate(95 104)"><rect width="155" height="209" rx="8" fill="#ad8c72" stroke="#846d63" stroke-width="8"/><rect x="10" y="12" width="135" height="185" fill="#f4dec6"/><path d="M10 82H145M10 142H145" stroke="#a6816b" stroke-width="9"/><rect x="21" y="28" width="18" height="51" rx="3" fill="#83afbe"/><rect x="45" y="21" width="18" height="58" rx="3" fill="#c6a3d9"/><rect x="68" y="30" width="20" height="49" rx="3" fill="#dfa882"/><rect x="93" y="24" width="21" height="55" rx="3" fill="#91bbac"/><rect x="25" y="94" width="19" height="45" rx="3" fill="#ca94aa"/><rect x="49" y="90" width="20" height="49" rx="3" fill="#89aacf"/><rect x="75" y="96" width="18" height="43" rx="3" fill="#8ab9a5"/><text x="39" y="184" font-size="32">📚</text><text x="100" y="185" font-size="29">🐾</text></g>'+
'<g transform="translate(426 88) scale(.77 1)"><rect width="360" height="170" rx="13" fill="#fffefc" stroke="#a79ac7" stroke-width="9"/><rect x="13" y="14" width="335" height="135" rx="5" fill="#f8fcfd"/><text x="180" y="39" text-anchor="middle" font-family="sans-serif" font-size="21" font-weight="800" fill="#4b6f85">TODAY\'S STUDY PLAN</text><circle cx="60" cy="80" r="13" fill="#87baa4"/><path d="M52 80l6 7l11 -16" stroke="white" stroke-width="4" fill="none"/><text x="88" y="85" font-family="sans-serif" font-size="17" fill="#536e85">Understand the WHY</text><circle cx="60" cy="122" r="13" fill="#d3b0d9"/><text x="88" y="127" font-family="sans-serif" font-size="17" fill="#536e85">Practice • Apply • Review</text><rect x="9" y="156" width="343" height="8" rx="4" fill="#acb7c5"/></g>'+
'<g transform="translate(725 91)"><rect width="163" height="131" rx="7" fill="#b1dceb" stroke="#91abc4" stroke-width="9"/><path d="M8 113Q55 55 101 104T155 80V123H8Z" fill="#a4cbb4"/><path d="M80 4V127M5 66H157" stroke="#f3fbff" stroke-width="7"/><path d="M-8 132H172" stroke="#f2eadf" stroke-width="13"/></g>'+
'<ellipse cx="507" cy="421" rx="256" ry="32" fill="#59465a" opacity=".23" filter="url(#vpqSLShade)"/>'+
'<g transform="translate(185 35) scale(.72)"><path d="M274 340L345 296H655L735 340L660 373H350Z" fill="#e6bc92" stroke="#a87d65" stroke-width="7"/><path d="M350 373H660V427H350Z" fill="#bf8e73" stroke="#94716a" stroke-width="6"/><path d="M274 340L350 373V427L274 386Z" fill="#a67b69" stroke="#94716a" stroke-width="5"/><path d="M660 373L735 340V385L660 427Z" fill="#ad806c" stroke="#94716a" stroke-width="5"/><path d="M303 417V474M702 413V472" stroke="#87685d" stroke-width="14"/>'+
'<rect x="433" y="261" width="140" height="73" rx="8" fill="#536d83"/><rect x="441" y="269" width="124" height="54" rx="4" fill="#c9e7ee"/><text x="503" y="292" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="800" fill="#52758d">STUDY PORTAL</text><text x="503" y="311" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#52758d">PHARM • TOX</text><path d="M412 332h184l13 13H399Z" fill="#849bad"/><path d="M345 323l69 -17l23 16l-69 13Z" fill="#fff9ef" stroke="#c3aca2" stroke-width="3"/><rect x="620" y="316" width="29" height="24" rx="4" fill="#f2c1d3"/><path d="M650 319q18 -6 13 10q-4 10 -13 3" stroke="#c595a7" stroke-width="5" fill="none"/></g>'+
// Built-in small coffee maker atop the fitted kitchenette; upgraded by the studio.
'<g transform="translate(272 222)"><rect width="32" height="31" rx="5" fill="#a7c4c5" stroke="#879ea5" stroke-width="3"/><rect x="5" y="4" width="22" height="10" rx="3" fill="#eaf4f1"/><path d="M15 16v7" stroke="#fff" stroke-width="4"/><path d="M8 23h16l-3 6H11Z" fill="#f9eee7"/><circle cx="26" cy="18" r="2" fill="#e5c779"/></g>'+
'<g transform="translate(771 228)">'+
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
'<ellipse cx="163" cy="440" rx="120" ry="23" fill="#dcbcd9"/><g transform="rotate(-9 171 383)"><rect x="78" y="316" width="194" height="114" rx="28" fill="#9d88bd" stroke="#77649e" stroke-width="7"/><rect x="94" y="330" width="164" height="64" rx="22" fill="#dfd1f0"/><rect x="63" y="360" width="47" height="68" rx="19" fill="#af9bce" stroke="#8674ae" stroke-width="5"/><rect x="243" y="360" width="47" height="68" rx="19" fill="#af9bce" stroke="#8674ae" stroke-width="5"/><rect x="102" y="389" width="153" height="39" rx="16" fill="#c5b0df" stroke="#9985ba" stroke-width="4"/><rect x="119" y="340" width="47" height="44" rx="11" fill="#f3baa9"/><rect x="178" y="340" width="47" height="44" rx="11" fill="#a7d3c4"/><path d="M115 425v16M248 425v16" stroke="#816c99" stroke-width="10"/></g>'+
// Skills practice nook on the right rear wall, away from the desk and arcade.
'<g><rect x="722" y="90" width="169" height="112" rx="12" fill="#e8f4f9" stroke="#96b4c5" stroke-width="6"/>'+
'<rect x="731" y="98" width="151" height="26" rx="9" fill="#fff9ff" stroke="#c8b4d2" stroke-width="2"/>'+
'<text x="807" y="116" font-family="Arial" text-anchor="middle" font-size="14" font-weight="900" fill="#745d92">CLINICAL SKILLS</text>'+
'<rect x="738" y="133" width="65" height="54" rx="6" fill="#f8fbff" stroke="#b3c6d3" stroke-width="3"/>'+
'<rect x="808" y="133" width="65" height="54" rx="6" fill="#fff5fa" stroke="#c7adc7" stroke-width="3"/>'+
'<text x="771" y="166" text-anchor="middle" font-size="24">💉</text><text x="840" y="166" text-anchor="middle" font-size="24">🩸</text></g>'+
'<g font-family="Arial" font-weight="800"><rect x="111" y="226" width="20" height="50" rx="2" fill="#789dbe"/><rect x="134" y="219" width="20" height="57" rx="2" fill="#d296a8"/><rect x="157" y="224" width="20" height="52" rx="2" fill="#a6bda7"/><rect x="181" y="220" width="20" height="56" rx="2" fill="#b59ad0"/><rect x="205" y="225" width="20" height="51" rx="2" fill="#e0aa80"/><text transform="translate(125 268) rotate(-90)" font-size="9" fill="white">PHARM</text><text transform="translate(148 268) rotate(-90)" font-size="9" fill="white">TOX</text><text transform="translate(171 268) rotate(-90)" font-size="9" fill="white">PATH</text><text transform="translate(195 268) rotate(-90)" font-size="9" fill="white">CLIN</text><text x="111" y="306" font-size="10" fill="#765f78">TEXTBOOK LIBRARY</text></g>'+
// The kitchenette is a single fitted cabinet, not floating unrelated objects.
'<g transform="translate(260 238)"><rect x="0" y="0" width="112" height="87" rx="7" fill="#e4d9d1" stroke="#b39c9c" stroke-width="4"/><path d="M0 19H112" stroke="#bd9fa1" stroke-width="5"/><rect x="6" y="25" width="44" height="55" rx="4" fill="#d6e9e6" stroke="#8faeaf" stroke-width="3"/><path d="M9 48H47" stroke="#9db6b6" stroke-width="3"/><rect x="17" y="31" width="19" height="6" rx="2" fill="#f9fffc"/><text x="28" y="71" font-size="8" text-anchor="middle" font-family="Arial" font-weight="800" fill="#577784">FRIDGE</text><rect x="56" y="25" width="48" height="55" rx="3" fill="#d6b8a7" stroke="#a38b83" stroke-width="3"/><path d="M78 43v23" stroke="#9c827a" stroke-width="2"/><rect x="54" y="3" width="54" height="20" rx="4" fill="#faf8f1" stroke="#9fb9bf" stroke-width="3"/><ellipse cx="81" cy="12" rx="16" ry="5" fill="#bad8db"/><path d="M81 9v-15h13v12" fill="none" stroke="#849faa" stroke-width="4"/><text x="81" y="70" font-family="Arial" font-size="8" font-weight="800" fill="#75596a" text-anchor="middle">CABINET</text><text x="56" y="-12" text-anchor="middle" font-family="Arial" font-size="11" font-weight="900" fill="#736283">COFFEE NOOK</text></g>'+
// A lit window and an actual sill for the player-selected plant collection.
'<g><rect x="268" y="90" width="147" height="133" rx="12" fill="#faf6eb" stroke="#c5a6c8" stroke-width="6"/><rect x="276" y="99" width="132" height="107" rx="6" fill="#cde8f0"/><path d="M276 174q32 -20 67 1t65 -5v36H276Z" fill="#a2cdb7"/><path d="M341 99v108M276 151h132" stroke="#fffdf9" stroke-width="7"/><rect x="257" y="211" width="166" height="12" rx="5" fill="#cba89d" stroke="#aa8d94" stroke-width="3"/><text x="341" y="84" font-family="Arial" font-size="11" text-anchor="middle" font-weight="900" fill="#79658b">BOTANICAL WINDOW</text></g>'+
'<g font-family="Arial" font-weight="900" text-anchor="middle"><text x="497" y="74" font-size="12" fill="#735893">PHARM • TOX • CLINICAL LEARNING</text></g>'+
'<text x="117" y="94" font-family="sans-serif" font-size="14" font-weight="800" fill="#736589">STUDENT LOUNGE</text></svg>';
}
art.roomArt=function(k){return k==='study'?lounge():previous(k)};
const p=rooms.study.props;
p[0].x=50;p[0].label='Study Desk · Learn & Review';p[0].action='study';
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
'.vpqLoungeDesk{left:41%;top:53%;width:18%;height:22%}.vpqLoungeMastery{left:32%;top:16%;width:36%;height:34%}.vpqLoungeGames{left:80%;top:52%;width:13%;height:33%}'+
'.vpqLoungeSkills{position:absolute;left:73%;top:24%;width:15%;height:17%;padding:0;pointer-events:auto;border:2px solid transparent;background:transparent;color:transparent;border-radius:10px;font-size:0;cursor:pointer;box-shadow:none}.vpqLoungeSkills:hover,.vpqLoungeSkills:focus-visible{border:2px dashed #e5b657;background:#fff4c522;outline:none}'+
'.vpqLoungeExit{top:8%;right:2%;padding:6px 10px;border-radius:15px;background:#fffaf0ed;color:#584d70;font-size:11px;font-weight:800}'+
'@media(max-width:600px){.vpqLoungeHot span{font-size:9px;padding:3px 5px}.vpqLoungeExit{font-size:9px;padding:5px}}';
document.head.appendChild(css);
const obs=new MutationObserver(()=>{if((stage.dataset.room==='study')!==!!stage.querySelector('#vpqLoungeHotspots'))refresh()});
obs.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
refresh();
return {refresh,lounge};
};