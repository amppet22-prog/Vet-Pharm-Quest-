/* Phase A.3 cozy student study lounge: perspective background and existing study tools. */
window.VPQ_STUDY_LOUNGE_A3=function(api){
'use strict';
const {rooms,doAction,changeRoom}=api,stage=document.getElementById('stage'),art=window.VPQ_SCENERY;
if(!stage||!art||!rooms.study)return null;
const previous=art.roomArt.bind(art);
function lounge(){
return '<svg class="vpqStudyLoungeArt" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Student study lounge with study desk, bookshelves, whiteboard, coffee maker and snacks">'+
'<defs><linearGradient id="vpqSLFloor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f0dcba"/><stop offset="1" stop-color="#c6a98f"/></linearGradient><filter id="vpqSLShade"><feGaussianBlur stdDeviation="11"/></filter></defs>'+
'<rect width="1000" height="500" fill="#d7bce2"/><polygon points="0,0 1000,0 930,55 70,55" fill="#fff9ed"/><polygon points="0,0 70,55 70,320 0,391" fill="#c7b1d4"/><polygon points="930,55 1000,0 1000,391 930,320" fill="#c7b1d4"/><rect x="70" y="55" width="860" height="265" fill="#f7eefa"/>'+
'<path d="M70 320H930L1000 500H0Z" fill="url(#vpqSLFloor)"/><path d="M70 320L0 500M930 320L1000 500M240 320L202 500M390 320L374 500M535 320V500M690 320L709 500M835 320L887 500M27 431H974M55 364H947" stroke="#fff8e9" stroke-width="3" fill="none" opacity=".7"/>'+
'<path d="M70 55H930M70 320H930" stroke="#b69bbb" stroke-width="10" fill="none" opacity=".5"/>'+
'<g transform="translate(95 104)"><rect width="155" height="209" rx="8" fill="#ad8c72" stroke="#846d63" stroke-width="8"/><rect x="10" y="12" width="135" height="185" fill="#f4dec6"/><path d="M10 82H145M10 142H145" stroke="#a6816b" stroke-width="9"/><rect x="21" y="28" width="18" height="51" rx="3" fill="#83afbe"/><rect x="45" y="21" width="18" height="58" rx="3" fill="#c6a3d9"/><rect x="68" y="30" width="20" height="49" rx="3" fill="#dfa882"/><rect x="93" y="24" width="21" height="55" rx="3" fill="#91bbac"/><rect x="25" y="94" width="19" height="45" rx="3" fill="#ca94aa"/><rect x="49" y="90" width="20" height="49" rx="3" fill="#89aacf"/><rect x="75" y="96" width="18" height="43" rx="3" fill="#8ab9a5"/><text x="39" y="184" font-size="32">📚</text><text x="100" y="185" font-size="29">🐾</text></g>'+
'<g transform="translate(317 88)"><rect width="360" height="170" rx="13" fill="#fffefc" stroke="#a79ac7" stroke-width="9"/><rect x="13" y="14" width="335" height="135" rx="5" fill="#f8fcfd"/><text x="180" y="39" text-anchor="middle" font-family="sans-serif" font-size="21" font-weight="800" fill="#4b6f85">TODAY\'S STUDY PLAN</text><circle cx="60" cy="80" r="13" fill="#87baa4"/><path d="M52 80l6 7l11 -16" stroke="white" stroke-width="4" fill="none"/><text x="88" y="85" font-family="sans-serif" font-size="17" fill="#536e85">Understand the WHY</text><circle cx="60" cy="122" r="13" fill="#d3b0d9"/><text x="88" y="127" font-family="sans-serif" font-size="17" fill="#536e85">Practice • Apply • Review</text><rect x="9" y="156" width="343" height="8" rx="4" fill="#acb7c5"/></g>'+
'<g transform="translate(725 91)"><rect width="163" height="131" rx="7" fill="#b1dceb" stroke="#91abc4" stroke-width="9"/><path d="M8 113Q55 55 101 104T155 80V123H8Z" fill="#a4cbb4"/><path d="M80 4V127M5 66H157" stroke="#f3fbff" stroke-width="7"/><path d="M-8 132H172" stroke="#f2eadf" stroke-width="13"/></g>'+
'<ellipse cx="507" cy="421" rx="256" ry="32" fill="#59465a" opacity=".23" filter="url(#vpqSLShade)"/>'+
'<g><path d="M274 340L345 296H655L735 340L660 373H350Z" fill="#e6bc92" stroke="#a87d65" stroke-width="7"/><path d="M350 373H660V427H350Z" fill="#bf8e73" stroke="#94716a" stroke-width="6"/><path d="M274 340L350 373V427L274 386Z" fill="#a67b69" stroke="#94716a" stroke-width="5"/><path d="M660 373L735 340V385L660 427Z" fill="#ad806c" stroke="#94716a" stroke-width="5"/><path d="M303 417V474M702 413V472" stroke="#87685d" stroke-width="14"/>'+
'<rect x="433" y="261" width="140" height="73" rx="8" fill="#536d83"/><rect x="441" y="269" width="124" height="54" rx="4" fill="#c9e7ee"/><text x="503" y="292" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="800" fill="#52758d">STUDY DESK</text><text x="503" y="311" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#52758d">Learn • Practice</text><path d="M412 332h184l13 13H399Z" fill="#849bad"/><path d="M345 323l69 -17l23 16l-69 13Z" fill="#fff9ef" stroke="#c3aca2" stroke-width="3"/><rect x="620" y="316" width="29" height="24" rx="4" fill="#f2c1d3"/><path d="M650 319q18 -6 13 10q-4 10 -13 3" stroke="#c595a7" stroke-width="5" fill="none"/></g>'+
'<g transform="translate(755 265)"><rect x="4" y="4" width="172" height="101" rx="11" fill="#f9eddd" stroke="#bda398" stroke-width="6"/><path d="M0 107H181V166H0Z" fill="#c9aca6" stroke="#a28281" stroke-width="6"/><rect x="14" y="18" width="87" height="72" rx="9" fill="#748b9c"/><rect x="25" y="28" width="65" height="36" rx="4" fill="#d8e4e4"/><rect x="43" y="65" width="28" height="21" rx="6" fill="#f7f0e0"/><path d="M72 72q16 -7 14 7q-4 9 -14 3" stroke="#f7f0e0" stroke-width="4" fill="none"/><circle cx="120" cy="39" r="6" fill="#7fbd9d"/><text x="143" y="86" font-size="30">🍎</text><text x="90" y="133" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="14" fill="#6f5b6d">COFFEE + SNACKS</text></g>'+
'<ellipse cx="163" cy="433" rx="109" ry="25" fill="#dcbcd9"/><path d="M92 350q-8 -55 26 -68h106q32 19 20 67l-13 56H104Z" fill="#b5a5d1" stroke="#8c80b2" stroke-width="8"/><rect x="98" y="355" width="137" height="56" rx="20" fill="#d8c9ed" stroke="#9f91c2" stroke-width="7"/><path d="M118 413v24M215 413v24" stroke="#8b739e" stroke-width="11"/>'+
'<text x="117" y="94" font-family="sans-serif" font-size="14" font-weight="800" fill="#736589">STUDENT LOUNGE</text></svg>';
}
art.roomArt=function(k){return k==='study'?lounge():previous(k)};
const p=rooms.study.props;
p[0].x=50;p[0].label='Study Desk';p[0].action='study';
p[1].x=30;p[1].label='Mastery Tracker';
p[2].x=78;p[2].label='Learning Games';
function refresh(){
 stage.querySelector('#vpqLoungeHotspots')?.remove();
 if(stage.dataset.room!=='study')return;
 const node=document.createElement('div');node.id='vpqLoungeHotspots';
 node.innerHTML='<button type="button" class="vpqLoungeHot vpqLoungeDesk" data-vpqstudyaction="study" aria-label="Open study desk and lecture learning"><span>📖 Study Desk</span></button>'+
 '<button type="button" class="vpqLoungeHot vpqLoungeMastery" data-vpqstudyaction="masteryTracker" aria-label="Open mastery tracker"><span>🏆 Mastery</span></button>'+
 '<button type="button" class="vpqLoungeHot vpqLoungeGames" data-vpqstudyaction="learningHub" aria-label="Open learning games"><span>🎮 Games</span></button>'+
 '<button type="button" class="vpqLoungeExit" data-vpqstudyreturn="1" aria-label="Return to reception">← Reception</button>';
 node.addEventListener('click',e=>{let b=e.target.closest('button');if(!b)return;if(b.dataset.vpqstudyreturn!==undefined)changeRoom('reception');else if(b.dataset.vpqstudyaction)doAction(b.dataset.vpqstudyaction)});
 stage.appendChild(node);
}
const css=document.createElement('style');
css.textContent='.vpqStudyLoungeArt{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}'+
'.stage[data-room="study"] .roomdecor,.stage[data-room="study"] .prop{display:none!important}'+
'#vpqLoungeHotspots{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqLoungeHot,.vpqLoungeExit{pointer-events:auto;position:absolute;border:2px solid transparent;background:transparent;box-shadow:none;transform:none!important}'+
'.vpqLoungeHot:hover,.vpqLoungeHot:focus-visible,.vpqLoungeExit:hover,.vpqLoungeExit:focus-visible{border:2px solid #fac86f;background:#fff7d026;outline:2px solid #fff}'+
'.vpqLoungeHot span{position:absolute;bottom:8%;left:50%;transform:translateX(-50%);white-space:nowrap;background:#fffaf0ed;border:1px solid #b6abbf;color:#53476d;border-radius:14px;padding:4px 9px;font-size:11px;font-weight:900}'+
'.vpqLoungeDesk{left:36%;top:53%;width:30%;height:33%}.vpqLoungeMastery{left:29%;top:15%;width:39%;height:36%}.vpqLoungeGames{left:75%;top:52%;width:19%;height:35%}'+
'.vpqLoungeExit{top:8%;right:2%;padding:6px 10px;border-radius:15px;background:#fffaf0ed;color:#584d70;font-size:11px;font-weight:800}'+
'@media(max-width:600px){.vpqLoungeHot span{font-size:9px;padding:3px 5px}.vpqLoungeExit{font-size:9px;padding:5px}}';
document.head.appendChild(css);
const obs=new MutationObserver(()=>{if((stage.dataset.room==='study')!==!!stage.querySelector('#vpqLoungeHotspots'))refresh()});
obs.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
refresh();
return {refresh,lounge};
};