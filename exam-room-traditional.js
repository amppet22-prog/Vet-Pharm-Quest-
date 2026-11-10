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
 // Small-animal exam room: fixed wall exam table on right, worktop on left,
 // and open floor in the middle. The little cartoon patient is intentional.
 return '<svg class="vpqExamRoomArt" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cozy small animal exam room, left cabinet and sink counter, right wall-mounted folding exam table with goofy '+examAnimal+' patient">'+
 '<defs><linearGradient id="vpqExamWalls" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e8f4f5"/><stop offset="1" stop-color="#d0e5e9"/></linearGradient><linearGradient id="vpqExamSteel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7fbfb"/><stop offset=".54" stop-color="#a5b7bf"/><stop offset="1" stop-color="#dfe9e9"/></linearGradient></defs>'+
 // shallow shadow-box shell
 '<rect width="1000" height="500" fill="#9ab9c4"/><polygon points="0,0 1000,0 932,48 68,48" fill="#fffaf4"/><polygon points="0,0 68,48 68,328 0,397" fill="#91b4bf"/><polygon points="932,48 1000,0 1000,397 932,328" fill="#91b4bf"/><rect x="68" y="48" width="864" height="280" fill="url(#vpqExamWalls)"/><path d="M68 328H932L1000 500H0Z" fill="#d6c8b7"/><path d="M68 328L0 500M932 328L1000 500M258 328L222 500M498 328V500M744 328L779 500M24 431H976M55 370H945" stroke="#f6efe5" stroke-width="3" opacity=".75" fill="none"/><path d="M68 328H932" stroke="#95b3bd" stroke-width="10"/>'+
 // left upper cabinetry and open shelves
 '<g transform="translate(93 75)"><rect width="244" height="93" rx="7" fill="#fcfaf5" stroke="#8cabb5" stroke-width="7"/><path d="M122 0v92" stroke="#9ab7bc" stroke-width="5"/><path d="M103 35v19m37 -19v19" stroke="#849ca6" stroke-width="6" stroke-linecap="round"/><rect x="2" y="100" width="245" height="8" rx="4" fill="#99b4b8"/><rect x="8" y="115" width="226" height="43" rx="5" fill="#f6f1e8" stroke="#a6bbb8" stroke-width="4"/><text x="26" y="145" font-size="23">🧻</text><text x="96" y="146" font-size="22">🧴</text><text x="158" y="146" font-size="21">🩺</text></g>'+
 // counter, inset basin, faucet, cabinet doors
 '<g><path d="M83 294L357 294L394 321H83Z" fill="url(#vpqExamSteel)" stroke="#90aab0" stroke-width="6"/><path d="M83 321H394V413H83Z" fill="#b7a093" stroke="#8e807d" stroke-width="6"/><path d="M235 324v85" stroke="#927c77" stroke-width="6"/><path d="M209 358v21m56 -21v21" stroke="#e7dbcf" stroke-width="6" stroke-linecap="round"/><rect x="94" y="330" width="100" height="70" rx="6" fill="#c8b5a8" stroke="#968479" stroke-width="5"/><path d="M120 366h48" stroke="#998579" stroke-width="6"/><ellipse cx="284" cy="304" rx="55" ry="11" fill="#829da8"/><ellipse cx="284" cy="302" rx="45" ry="7" fill="#d3e6e8"/><path d="M282 294v-41q2 -16 23 -16h19" fill="none" stroke="#779eaa" stroke-width="9"/><path d="M321 239v14" stroke="#789fa9" stroke-width="7"/></g>'+
 // paper dispenser, cute pet photo, clinical poster
 '<g><rect x="91" y="202" width="78" height="62" rx="9" fill="#f8f9f4" stroke="#8eaab5" stroke-width="6"/><path d="M105 236h48" stroke="#89a8b2" stroke-width="7"/><path d="M116 250h29v24h-29Z" fill="#fffefa"/><rect x="373" y="84" width="118" height="97" rx="8" fill="#fffaf2" stroke="#a3b9ba" stroke-width="6"/><text x="432" y="127" text-anchor="middle" font-size="38">🐶</text><text x="432" y="158" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#64818a" font-weight="800">GOOD PATIENT</text></g>'+
 // patient chart clipboard in plain view on left worktop
 '<g transform="translate(337 258) rotate(7)"><rect width="69" height="84" rx="7" fill="#fffdf1" stroke="#7194a2" stroke-width="5"/><rect x="21" y="-5" width="26" height="12" rx="4" fill="#839aa4"/><path d="M13 24h44M13 40h44M13 56h31" stroke="#a6bdc3" stroke-width="4"/><text x="35" y="75" font-family="sans-serif" font-size="13" text-anchor="middle" fill="#4a7480">SOAP</text></g>'+
 // wall chart and binder for clinical protocols, separate from exam table
 '<g><rect x="508" y="96" width="140" height="160" rx="9" fill="#fffefa" stroke="#98b3b8" stroke-width="7"/><rect x="523" y="111" width="110" height="30" rx="5" fill="#d6e7e6"/><text x="577" y="132" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="900" fill="#557c85">PROTOCOLS</text><path d="M526 159h99M526 180h99M526 201h87" stroke="#aac5c9" stroke-width="6"/><text x="578" y="239" text-anchor="middle" font-size="22">📋</text></g>'+
 // right wall attachment: no central pedestal legs
 '<g><rect x="838" y="190" width="78" height="164" rx="12" fill="#60747b" stroke="#485f68" stroke-width="8"/><circle cx="874" cy="229" r="11" fill="#8db9c2"/><path d="M867 279h15M867 311h15" stroke="#b8d1d3" stroke-width="8"/><path d="M843 290L713 362L727 383L850 326Z" fill="#778f99" stroke="#627e88" stroke-width="7"/><path d="M843 326L749 382" stroke="#cadbdf" stroke-width="9"/>'+
 // stainless fold-down top sits at right, open floor left
 '<path d="M585 320L776 278L923 316L721 367Z" fill="url(#vpqExamSteel)" stroke="#79949d" stroke-width="8"/><path d="M585 320L721 367V386L585 339Z" fill="#9fb5bc" stroke="#7c959e" stroke-width="6"/><path d="M721 367L923 316V336L721 386Z" fill="#8ba8b1" stroke="#7c959e" stroke-width="6"/>'+
 // removable pad, paw prints; animal is sitting ON the table
 '<path d="M612 318L779 290L887 318L721 356Z" fill="#fffaf4" opacity=".93" stroke="#aec6c8" stroke-width="3"/><text x="788" y="325" font-size="19" opacity=".5">🐾</text><text x="692" y="332" font-size="15" opacity=".5">🐾</text></g>'+
 '<g transform="translate(213 -11)">'+animalArt()+'</g>'+
 // small clinical stool and client seating; central floor remains walkable
 '<g transform="translate(437 369)"><ellipse cx="45" cy="14" rx="47" ry="12" fill="#78969e"/><ellipse cx="45" cy="8" rx="41" ry="8" fill="#b5d6dc"/><path d="M45 20v54M45 68L9 87M45 68l36 19M45 68v19" stroke="#617e89" stroke-width="8" stroke-linecap="round"/></g>'+
 '<g transform="translate(102 418)"><rect x="0" y="0" width="100" height="17" rx="7" fill="#9db2c1"/><path d="M12 18v40M87 18v40M7 -42v41M93 -42v41" stroke="#7c9aa8" stroke-width="9"/><rect x="0" y="-49" width="100" height="13" rx="6" fill="#a1bdc5"/></g>'+
 '<text x="500" y="31" font-family="sans-serif" font-size="21" font-weight="900" text-anchor="middle" fill="#4a7281">SMALL ANIMAL EXAM ROOM</text>'+
 '</svg>';
}

art.roomArt=function(k){return k==='exam'?drawing():previous(k)};
const p=rooms.exam.props;
p[0].x=26;p[0].label='Patient Charts';
p[1].x=76;p[1].label='Examine Patient';
p[2].x=54;p[2].label='Clinical Protocols';
function refresh(){
 stage.querySelector('#vpqExamHotspots')?.remove();
 if(stage.dataset.room!=='exam')return;
 const el=document.createElement('div');el.id='vpqExamHotspots';
 el.innerHTML='<button type="button" class="vpqExamHot vpqExamCharts" data-vpqexamaction="medicalCharts" aria-label="Open patient medical charts"><span>📋 Patient Charts</span></button>'+
 '<button type="button" class="vpqExamHot vpqExamPatient" data-vpqexamaction="patients" aria-label="Examine patient and start patient cases"><span>🩺 Examine Patient</span></button>'+
 '<button type="button" class="vpqExamHot vpqExamProtocol" data-vpqexamaction="protocols" aria-label="Open clinical protocols"><span>📖 Protocols</span></button>'+
 '<button type="button" class="vpqExamAnimalSwitch" data-vpqexamanimal="1" aria-label="Switch illustrated patient between dog and cat">🐾 Patient: '+(examAnimal==='dog'?'Dog':'Cat')+' · Switch</button>'+
 '<button type="button" class="vpqExamSkills" data-vpqexamaction="skillsWing" aria-label="Walk into Clinical Skills for injection and blood draw">💉 🩸 Clinical Skills · Injection / Blood Draw</button>'+ 
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
'.vpqExamHot span{position:absolute;bottom:7%;left:50%;transform:translateX(-50%);white-space:nowrap;background:#fffdf5;color:#355a70;border:2px solid #83acb5;border-radius:14px;padding:5px 9px;font-size:12px;font-weight:900;box-shadow:0 3px 0 #708c962e}.vpqExamCharts span{bottom:-16%}.vpqExamProtocol span{bottom:-8%}'+
'.vpqExamCharts{left:29%;top:50%;width:13%;height:24%}.vpqExamPatient{left:59%;top:42%;width:33%;height:39%}.vpqExamProtocol{left:51%;top:20%;width:14%;height:33%}'+
'.vpqExamSkills{pointer-events:auto;position:absolute;left:3%;top:8%;background:#fff4fadd;border:3px solid #b79bda;border-radius:14px;color:#745588;padding:9px 12px;font-size:13px;font-weight:900;box-shadow:0 5px 0 #bfa8d455;cursor:pointer;z-index:3}.vpqExamSkills:hover,.vpqExamSkills:focus-visible{background:#fff1bd;border-color:#eab65c;outline:2px solid #fff9dd}'+
'.vpqExamAnimalSwitch{bottom:3%;right:2%;background:#f4fffcf0;color:#365e66;font-size:11px;padding:6px 9px;z-index:2}.vpqExamExit{top:8%;right:2%;background:#fffdf5ed;color:#365e66;font-size:11px;padding:6px 9px}'+
'@media(max-width:600px){.vpqExamHot span{font-size:10px;padding:3px 5px}.vpqExamAnimalSwitch{font-size:9px}.vpqExamExit{font-size:10px}}';
document.head.appendChild(style);
const observer=new MutationObserver(()=>{if((stage.dataset.room==='exam')!==!!stage.querySelector('#vpqExamHotspots'))refresh()});
observer.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
refresh();
return {refresh,drawing};
};