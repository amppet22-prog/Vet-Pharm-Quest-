/* Traditional veterinary examination room — decorative dog/cat on stainless table.
 * Keeps existing Medical Chart, Patient Rounds, and Protocol actions unchanged. */
window.VPQ_EXAM_ROOM_A5=function(api){
'use strict';
const {rooms,doAction,changeRoom}=api,stage=document.getElementById('stage'),art=window.VPQ_SCENERY;
if(!stage||!art||!rooms.exam)return null;
const previous=art.roomArt.bind(art);
let examAnimal='dog';
const animalArt=()=>examAnimal==='cat'
 ? '<g transform="translate(0 0)"><path d="M521 312q-37 -26 -5 -44q22 -9 37 10q14 -13 32 -6q24 7 25 33q-6 27 -43 30l-31 0Z" fill="#d8ac86" stroke="#926c63" stroke-width="6"/><path d="M578 275q18 -31 37 -13l20 34l-12 16" fill="none" stroke="#926c63" stroke-width="10" stroke-linecap="round"/><path d="M496 284l-9 -32l26 17l22 -22l5 35" fill="#d8ac86" stroke="#926c63" stroke-width="6"/><ellipse cx="517" cy="288" rx="29" ry="29" fill="#d8ac86" stroke="#926c63" stroke-width="5"/><path d="M502 285h8m17 0h8" stroke="#584d55" stroke-width="5" stroke-linecap="round"/><path d="M519 290l5 5l-5 3l-5 -3Z" fill="#bb7f89"/><path d="M519 299q-11 7 -18 0m18 0q11 7 19 0" stroke="#795b5d" stroke-width="2" fill="none"/><path d="M548 325v17m33 -14v16" stroke="#926c63" stroke-width="9" stroke-linecap="round"/></g>'
 : '<g><path d="M497 307q19 -35 64 -33q51 1 67 33l-9 24h-114Z" fill="#c59b73" stroke="#8e6b58" stroke-width="6"/><path d="M612 281q40 -45 50 -8" fill="none" stroke="#8e6b58" stroke-width="12" stroke-linecap="round"/><path d="M499 307q-31 4 -43 -17q-13 -24 3 -44q21 -19 46 2l16 33" fill="#c59b73" stroke="#8e6b58" stroke-width="6"/><path d="M456 261l-12 -29q-14 30 -3 47" fill="#a77862" stroke="#8e6b58" stroke-width="5"/><path d="M502 256l20 -23q4 30 -12 48" fill="#a77862" stroke="#8e6b58" stroke-width="5"/><ellipse cx="457" cy="293" rx="27" ry="18" fill="#ead6b5"/><circle cx="475" cy="268" r="4" fill="#3d3b44"/><circle cx="444" cy="289" r="5" fill="#544c52"/><path d="M501 320v21m45 -14v20m39 -19v19" stroke="#8e6b58" stroke-width="10" stroke-linecap="round"/><path d="M485 276q17 -8 26 7" fill="none" stroke="#fff9e9" stroke-width="6"/></g>';
function drawing(){
return '<svg class="vpqExamRoomArt" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Traditional veterinary exam room with upper and lower cabinets, sink, equipment, exam table, and a '+examAnimal+' patient">'+
'<defs><linearGradient id="vpqExamWalls" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e8f5f5"/><stop offset="1" stop-color="#d2e6e6"/></linearGradient><linearGradient id="vpqExamSteel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7faf9"/><stop offset=".5" stop-color="#a8bdc6"/><stop offset="1" stop-color="#e8eeee"/></linearGradient></defs>'+
'<rect width="1000" height="500" fill="#9ebac1"/><polygon points="0,0 1000,0 933,49 67,49" fill="#fffefd"/><polygon points="0,0 67,49 67,315 0,395" fill="#89b1bb"/><polygon points="933,49 1000,0 1000,395 933,315" fill="#89b1bb"/><rect x="67" y="49" width="866" height="266" fill="url(#vpqExamWalls)"/><path d="M67 315H933L1000 500H0Z" fill="#d6c6b8"/><path d="M67 315L0 500M933 315L1000 500M250 315L220 500M500 315V500M750 315L783 500M24 429H973M49 370H953" fill="none" stroke="#f6ede5" stroke-width="3" opacity=".85"/><path d="M67 315H933" stroke="#9fb4ba" stroke-width="11"/>'+
'<g transform="translate(91 79)"><rect x="0" y="0" width="210" height="105" rx="8" fill="#f8f6ed" stroke="#90afb5" stroke-width="7"/><path d="M105 0v105" stroke="#90afb5" stroke-width="5"/><rect x="7" y="16" width="92" height="78" fill="#f5f6f2"/><rect x="113" y="16" width="90" height="78" fill="#f5f6f2"/><path d="M85 46v18M125 46v18" stroke="#80949a" stroke-width="7" stroke-linecap="round"/>'+
'<rect x="0" y="160" width="212" height="22" rx="4" fill="url(#vpqExamSteel)" stroke="#8aadb6" stroke-width="4"/><rect x="0" y="184" width="212" height="110" rx="6" fill="#eef2ed" stroke="#90adb2" stroke-width="7"/><path d="M106 188v103" stroke="#90adb2" stroke-width="5"/><path d="M85 222v29M128 222v29" stroke="#90a2a7" stroke-width="6" stroke-linecap="round"/>'+
'<ellipse cx="147" cy="166" rx="39" ry="10" fill="#8aa7b1"/><ellipse cx="147" cy="163" rx="32" ry="7" fill="#dee9e9"/><path d="M147 155v-35q0 -17 19 -17h24" stroke="#809da7" stroke-width="8" fill="none"/><path d="M187 101v12" stroke="#809da7" stroke-width="7"/></g>'+
'<g transform="translate(730 90)"><rect width="172" height="114" rx="10" fill="#fafbf8" stroke="#90b0b5" stroke-width="7"/><text x="86" y="26" text-anchor="middle" font-size="14" font-family="sans-serif" font-weight="900" fill="#3b7080">EXAM EQUIPMENT</text><path d="M28 47v36m44 -36v36m47 -36v36" stroke="#94a7aa" stroke-width="5"/><circle cx="28" cy="48" r="10" fill="#526f84"/><circle cx="72" cy="48" r="9" fill="#526f84"/><rect x="107" y="44" width="25" height="38" rx="6" fill="#627d89"/><rect x="17" y="90" width="138" height="13" rx="6" fill="#dbe5e3"/></g>'+
'<g transform="translate(740 231)"><rect width="161" height="98" rx="7" fill="#f5f6f1" stroke="#8fadb3" stroke-width="6"/><rect x="13" y="15" width="136" height="24" fill="#eef4f3"/><path d="M80 15v24" stroke="#9bb6bc" stroke-width="3"/><rect x="15" y="47" width="131" height="39" rx="6" fill="#d9e8e7"/><text x="81" y="72" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="14" fill="#5a8590">PATIENT CHARTS</text></g>'+
'<g transform="translate(356 95)"><rect width="289" height="98" rx="10" fill="#ffffff" stroke="#9ebdc0" stroke-width="8"/><text x="145" y="27" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle" fill="#507683">EXAMINATION ROOM</text><path d="M22 65H263" stroke="#d3e1e1" stroke-width="4"/><text x="144" y="53" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#698c95">History • Physical Exam • Plan</text><text x="145" y="83" font-size="23" text-anchor="middle">🐾</text></g>'+
'<ellipse cx="539" cy="434" rx="242" ry="32" fill="#6e777b" opacity=".18"/>'+
'<g><path d="M340 332L405 310H666L744 338L666 365H399Z" fill="url(#vpqExamSteel)" stroke="#8299a0" stroke-width="7"/><path d="M399 365H666V388H399Z" fill="#a6b9bf" stroke="#7d959e" stroke-width="5"/><path d="M340 332L399 365V388L340 359Z" fill="#92a9b1" stroke="#7d959e" stroke-width="5"/><path d="M666 365L744 338V360L666 388Z" fill="#93aab1" stroke="#7d959e" stroke-width="5"/><path d="M453 389v83M619 389v83" stroke="#91a7ad" stroke-width="19"/><path d="M432 472h55M597 472h55" stroke="#91a7ad" stroke-width="12" stroke-linecap="round"/><path d="M466 388h140v20H466Z" fill="#dfe8e7" stroke="#91a7ad" stroke-width="4"/></g>'+
animalArt()+
'<g transform="translate(333 223)"><rect x="0" y="0" width="64" height="81" rx="5" fill="#f8f6ed" stroke="#8da8b1" stroke-width="5"/><path d="M15 18h35M15 36h35M15 54h35" stroke="#a0b6b7" stroke-width="4"/><text x="32" y="77" font-size="13" text-anchor="middle" fill="#5f7f86" font-family="sans-serif">SOAP</text></g>'+
'<text x="488" y="30" font-size="21" text-anchor="middle" font-family="sans-serif" font-weight="900" fill="#4f7886">SMALL ANIMAL EXAM • CLINICAL SKILLS</text></svg>';
}
art.roomArt=function(k){return k==='exam'?drawing():previous(k)};
const p=rooms.exam.props;
p[0].x=21;p[0].label='Patient Charts';
p[1].x=53;p[1].label='Examine Patient';
p[2].x=82;p[2].label='Clinical Protocols';
function refresh(){
 stage.querySelector('#vpqExamHotspots')?.remove();
 if(stage.dataset.room!=='exam')return;
 const el=document.createElement('div');el.id='vpqExamHotspots';
 el.innerHTML='<button type="button" class="vpqExamHot vpqExamCharts" data-vpqexamaction="medicalCharts" aria-label="Open patient medical charts"><span>📋 Patient Charts</span></button>'+
 '<button type="button" class="vpqExamHot vpqExamPatient" data-vpqexamaction="patients" aria-label="Examine patient and start patient cases"><span>🩺 Examine Patient</span></button>'+
 '<button type="button" class="vpqExamHot vpqExamProtocol" data-vpqexamaction="protocols" aria-label="Open clinical protocols"><span>📖 Protocols</span></button>'+
 '<button type="button" class="vpqExamAnimalSwitch" data-vpqexamanimal="1" aria-label="Switch illustrated patient between dog and cat">🐾 Patient: '+(examAnimal==='dog'?'Dog':'Cat')+' · Switch</button>'+
 '<button type="button" class="vpqExamExit" data-vpqexamreturn="1">← Reception</button>';
 el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.vpqexamanimal!==undefined){examAnimal=examAnimal==='dog'?'cat':'dog';const scene=document.getElementById('scene');if(scene){const svg=scene.querySelector('.vpqExamRoomArt');if(svg)svg.outerHTML=drawing()}const toggle=el.querySelector('[data-vpqexamanimal]');if(toggle)toggle.textContent='🐾 Patient: '+(examAnimal==='dog'?'Dog':'Cat')+' · Switch';return;}if(b.dataset.vpqexamreturn!==undefined)return changeRoom('reception');if(b.dataset.vpqexamaction)return doAction(b.dataset.vpqexamaction)});
 stage.appendChild(el);
}
const style=document.createElement('style');style.textContent=
'.vpqExamRoomArt{display:block;position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'+
'.stage[data-room="exam"] .roomdecor,.stage[data-room="exam"] .prop{display:none!important}'+
'#vpqExamHotspots{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqExamHot,.vpqExamAnimalSwitch,.vpqExamExit{pointer-events:auto;position:absolute;border:2px solid #99bbc2bb;border-radius:12px;background:#ffffff15;box-shadow:none;transform:none!important}'+
'.vpqExamHot:hover,.vpqExamHot:focus-visible,.vpqExamAnimalSwitch:hover,.vpqExamAnimalSwitch:focus-visible,.vpqExamExit:hover,.vpqExamExit:focus-visible{border:3px solid #f1c66d;outline:2px solid #fff;background:#fff6ba48}'+
'.vpqExamHot span{position:absolute;bottom:9%;left:50%;transform:translateX(-50%);white-space:nowrap;background:#fffdf5;color:#355a70;border:2px solid #83acb5;border-radius:14px;padding:5px 9px;font-size:12px;font-weight:900}'+
'.vpqExamCharts{left:10%;top:47%;width:23%;height:36%}.vpqExamPatient{left:38%;top:52%;width:34%;height:35%}.vpqExamProtocol{left:75%;top:48%;width:18%;height:37%}'+
'.vpqExamAnimalSwitch{bottom:3%;right:2%;background:#f4fffcf0;color:#365e66;font-size:11px;padding:6px 9px;z-index:2}.vpqExamExit{top:8%;right:2%;background:#fffdf5ed;color:#365e66;font-size:11px;padding:6px 9px}'+
'@media(max-width:600px){.vpqExamHot span{font-size:10px;padding:3px 5px}.vpqExamAnimalSwitch{font-size:9px}.vpqExamExit{font-size:10px}}';
document.head.appendChild(style);
const observer=new MutationObserver(()=>{if((stage.dataset.room==='exam')!==!!stage.querySelector('#vpqExamHotspots'))refresh()});
observer.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
refresh();
return {refresh,drawing};
};