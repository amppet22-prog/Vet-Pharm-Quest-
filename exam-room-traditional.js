/* Traditional veterinary examination room — decorative dog/cat on stainless table.
 * Keeps existing Medical Chart, Patient Rounds, and Protocol actions unchanged. */
window.VPQ_EXAM_ROOM_A5=function(api){
'use strict';
const {rooms,doAction,changeRoom}=api,stage=document.getElementById('stage'),art=window.VPQ_SCENERY;
if(!stage||!art||!rooms.exam)return null;
const previous=art.roomArt.bind(art);
let examAnimal=''; // Blank exam table until the user chooses a patient.
const escExam=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Exam-table patients are now sourced from the current uploaded companion artwork,
 // not the original cartoon breed atlas. This does not change the equipped companion.
function examPatients(){
 const current=window.VPQ_EXAM_PATIENTS;
 return Array.isArray(current)?current.filter(p=>p&&typeof p.id==='string'&&typeof p.image==='string'):[];
}
function examPatientArt(){
 if(!examAnimal)return '';
 const p=examPatients().find(x=>x.id===examAnimal);
 if(!p)return '';
 // Validated, uploaded root or assets image paths only. Keep SVG rendering to
 // retain the existing exam room scene, position and interactions.
 const path=String(p.image||'');
 if(!path||path.includes('..')||!(path.startsWith('assets/')?path.slice(7).indexOf('/')===-1:path.indexOf('/')===-1)||!/\.(png|jpe?g|webp)$/i.test(path))return '';
 const url=path.split('/').map(encodeURIComponent).join('/');
 return '<image href="'+escExam(url)+'" x="442" y="208" width="190" height="130" preserveAspectRatio="xMidYMax meet"/>';
}
function drawing(){
 // Fully illustrated small animal examination room. Equipment is drawn as SVG,
 // not emoji: treat jar, stethoscope rack, wall-mounted otoscope/ophthalmoscope,
 // neonatal/small-pet scale, exam table, wash station and patient chart.
 const fragments=[
 '<svg class="vpqExamRoomArt" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrated cozy veterinary examination room with a small pet scale, treats, stethoscopes, otoscope and ophthalmoscope, plus a patient on the exam table">',
 '<defs>',
 '<linearGradient id="exWall" x2="0" y2="1"><stop stop-color="#fff9f2"/><stop offset="1" stop-color="#dff3ed"/></linearGradient>',
 '<linearGradient id="exFloor" x2="0" y2="1"><stop stop-color="#f3e6d5"/><stop offset="1" stop-color="#d7bdac"/></linearGradient>',
 '<linearGradient id="exWood" x2=".8" y2="1"><stop stop-color="#ead6c8"/><stop offset="1" stop-color="#bf9d8e"/></linearGradient>',
 '<linearGradient id="exMetal" x2=".7" y2="1"><stop stop-color="#fafffd"/><stop offset=".48" stop-color="#c0d8da"/><stop offset="1" stop-color="#8daeb7"/></linearGradient>',
 '<linearGradient id="exGlass" x2="0" y2="1"><stop stop-color="#f9ffff" stop-opacity=".88"/><stop offset="1" stop-color="#c4e9e1" stop-opacity=".78"/></linearGradient>',
 '<filter id="exShadow" x="-35%" y="-35%" width="170%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#57727a" flood-opacity=".21"/></filter>',
 '<pattern id="exFloorDots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1.8" fill="#fff8ed" opacity=".55"/></pattern>',
 '</defs>',
 // The walkable foreground is broad enough for a perspective-sized student.
 // Architecture keeps all instruments on the upper wall plane.
 // Architecture: a genuine bright clinical room with softened shapes and depth.
 '<rect x="0" y="0" width="1000" height="500" fill="#9cbfc4"/>',
 '<path d="M0 0H1000L937 48H65Z" fill="#fff7ed"/>',
 '<path d="M0 0L65 48V333L0 399Z" fill="#97bfc2"/>',
 '<path d="M1000 0L937 48V333L1000 399Z" fill="#90b8b9"/>',
 '<rect x="65" y="48" width="872" height="286" fill="url(#exWall)"/>',
 '<rect x="65" y="315" width="872" height="19" fill="#a4c8bf"/>',
 '<path d="M65 334H937L1000 500H0Z" fill="url(#exFloor)"/>',
 '<path d="M65 334H937L1000 500H0Z" fill="url(#exFloorDots)"/>',
 '<g stroke="#fffaf1" stroke-width="3" opacity=".65"><path d="M65 379H937M33 434H970M227 334L170 500M467 334L442 500M700 334L749 500M937 334L1000 500"/></g>',
 '<path d="M67 50H935" stroke="#c1dfd8" stroke-width="9"/>',
 // Top cornice and cozy hand-lettered clinic plaque.
 '<rect x="345" y="9" width="308" height="48" rx="22" fill="#fffcf7" stroke="#b4d5cd" stroke-width="5" filter="url(#exShadow)"/>',
 '<text x="499" y="39" text-anchor="middle" font-family="Trebuchet MS,Arial,sans-serif" font-size="20" font-weight="900" fill="#497580">✦ SMALL ANIMAL EXAM ✦</text>',
 // Window to add warmth, drawn rather than a generic flat wall rectangle.
 '<g filter="url(#exShadow)"><rect x="695" y="72" width="173" height="123" rx="18" fill="#fef9ee" stroke="#c6a5ab" stroke-width="7"/><rect x="707" y="85" width="149" height="96" rx="10" fill="#d5eff2"/><circle cx="824" cy="114" r="21" fill="#fff1bb"/><path d="M707 164Q740 123 775 158Q814 132 856 155V181H707Z" fill="#95c8ad"/><path d="M707 172Q744 148 782 173Q824 143 856 166V181H707Z" fill="#73b5a4"/><path d="M781 85v96" stroke="#fffaf1" stroke-width="7"/><path d="M707 136H856" stroke="#fffaf1" stroke-width="6"/></g>',
 '<g fill="#88bfa7"><path d="M694 76q-24 12-17 38q24-10 17-38ZM868 84q24 12 13 38q-23-10-13-38Z"/><path d="M681 105q-12 22 7 32q13-20-7-32Z"/></g>',
 // Left upper cabinetry and feature shelf.
 '<g filter="url(#exShadow)"><rect x="96" y="93" width="245" height="105" rx="12" fill="#fffcf5" stroke="#8bb3b4" stroke-width="6"/><path d="M219 94v102" stroke="#a8c7c5" stroke-width="6"/><path d="M204 132v27m31-27v27" stroke="#8eacae" stroke-width="7" stroke-linecap="round"/><rect x="96" y="203" width="245" height="9" rx="4" fill="#b9d7cf"/></g>',
 '<path d="M112 220h218" stroke="#f6fffa" stroke-width="3" opacity=".8"/>',
 // Dedicated hanging stethoscope station (three actual illustrated instruments).
 '<g transform="translate(366 100)" filter="url(#exShadow)"><rect x="-3" y="-4" width="118" height="110" rx="13" fill="#fffdf8" stroke="#a5c7be" stroke-width="5"/><rect x="8" y="7" width="97" height="22" rx="8" fill="#f8e4ea"/><text x="56" y="23" font-family="Arial" font-size="12" font-weight="800" text-anchor="middle" fill="#806b83">STETHOSCOPES</text>',
 '<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M25 43v18q0 24 18 24t17-22V43" stroke="#6c9fb0" stroke-width="5"/><path d="M66 43v22q0 19 15 19t14-23V43" stroke="#ba8ab2" stroke-width="5"/><path d="M43 85v10m38-11v11" stroke="#61677b" stroke-width="4"/></g>',
 '<g fill="#dfecee" stroke="#687e90" stroke-width="2"><circle cx="25" cy="42" r="5"/><circle cx="60" cy="42" r="5"/><circle cx="66" cy="42" r="5"/><circle cx="95" cy="42" r="5"/><circle cx="43" cy="97" r="7"/><circle cx="81" cy="97" r="7"/></g></g>',
 // Wall diagnostic station: two secured cordless charging holders, real distinct heads.
 '<g transform="translate(502 96)" filter="url(#exShadow)"><rect width="148" height="173" rx="15" fill="#fffef9" stroke="#97babb" stroke-width="6"/><rect x="13" y="12" width="122" height="27" rx="8" fill="#dceceb"/><text x="74" y="30" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#537987">DIAGNOSTICS</text>',
 '<rect x="17" y="50" width="53" height="102" rx="12" fill="#e5f0ed" stroke="#bad0d2" stroke-width="3"/><rect x="79" y="50" width="53" height="102" rx="12" fill="#f3e8ed" stroke="#d9c7d3" stroke-width="3"/>',
 '<g fill="#556b7b" stroke="#44576d" stroke-width="2"><rect x="37" y="88" width="15" height="46" rx="6"/><rect x="99" y="87" width="15" height="47" rx="6"/><path d="M42 88v-14h10v14Z"/><path d="M104 87v-13h8v13Z"/></g>',
 '<path d="M38 75l-8-8q12-14 23 0l-4 12Z" fill="#4c5e71"/><circle cx="106" cy="68" r="13" fill="#526a7f"/><circle cx="106" cy="68" r="6" fill="#f9ecca"/><circle cx="106" cy="68" r="2.5" fill="#3f5067"/>',
 '<text x="43" y="146" text-anchor="middle" font-family="Arial" font-size="9" font-weight="800" fill="#576a7a">OTOSCOPE</text><text x="106" y="146" text-anchor="middle" font-family="Arial" font-size="8" font-weight="800" fill="#576a7a">OPHTHALMO</text></g>',
 // Counter and wash station, round-corner hardware.
 '<g filter="url(#exShadow)"><path d="M87 314H377L405 339H87Z" fill="url(#exMetal)" stroke="#7b9fa9" stroke-width="6"/><path d="M88 338H390V432Q388 444 376 444H103Q89 444 89 431Z" fill="url(#exWood)" stroke="#9d8790" stroke-width="6"/><path d="M245 338v104" stroke="#aa9796" stroke-width="5"/><path d="M314 338v104" stroke="#aa9796" stroke-width="5"/><rect x="103" y="349" width="124" height="80" rx="9" fill="#e5d3c5" stroke="#b79c98" stroke-width="4"/><rect x="116" y="361" width="98" height="54" rx="6" fill="#fff4e7"/><path d="M254 380v21m70-21v21" stroke="#f8f4ea" stroke-width="7" stroke-linecap="round"/></g>',
 '<ellipse cx="291" cy="318" rx="49" ry="12" fill="#85a8b1"/><ellipse cx="291" cy="316" rx="42" ry="8" fill="#e4f5f4"/><path d="M288 304v-32q1-15 17-15h18v12" fill="none" stroke="#6d9da9" stroke-width="9" stroke-linecap="round"/>',
 // Treat jar: illustrated glass jar with cookies, heart label and a secure lid.
 '<g transform="translate(114 237)" filter="url(#exShadow)"><rect x="4" y="13" width="63" height="65" rx="13" fill="url(#exGlass)" stroke="#77b7b0" stroke-width="4"/><rect x="0" y="8" width="71" height="12" rx="6" fill="#e6a4bb" stroke="#b77d9b" stroke-width="3"/><rect x="8" y="2" width="55" height="10" rx="5" fill="#f3c4cf"/>',
 '<g fill="#bd8c5e" stroke="#a87d60" stroke-width="2"><circle cx="19" cy="52" r="9"/><circle cx="45" cy="57" r="10"/><circle cx="33" cy="38" r="9"/><circle cx="56" cy="42" r="7"/></g><g fill="#7b584b"><circle cx="18" cy="50" r="2"/><circle cx="31" cy="40" r="2"/><circle cx="47" cy="56" r="2"/></g>',
 '<rect x="9" y="62" width="54" height="12" rx="5" fill="#fffbec"/><text x="36" y="71" text-anchor="middle" font-family="Arial" font-weight="900" font-size="10" fill="#ac6483">TREATS ♡</text></g>',
 // Small-patient baby scale on left counter, complete weighing tray and display.
 '<g transform="translate(184 239) scale(1.47)" filter="url(#exShadow)"><path d="M0 16q23-19 62 0l-9 19H9Z" fill="#fffdf8" stroke="#93babb" stroke-width="4"/><ellipse cx="30" cy="15" rx="33" ry="9" fill="#f2fcfc" stroke="#9dc7c8" stroke-width="3"/><rect x="6" y="34" width="52" height="25" rx="8" fill="#7eacb4" stroke="#507e8c" stroke-width="3"/><rect x="16" y="41" width="32" height="12" rx="3" fill="#e8f6d9"/><text x="32" y="50" font-family="monospace" font-size="10" text-anchor="middle" fill="#476b70">0.00</text></g>',
 '<text x="226" y="231" text-anchor="middle" font-family="Arial" font-size="10" font-weight="800" fill="#607d80">SMALL PET SCALE</text>',
 // Soft paper towels, glove box and clinical consumables.
 '<g><rect x="96" y="224" width="35" height="15" rx="4" fill="#b3d3ce"/><rect x="315" y="234" width="54" height="21" rx="5" fill="#f3d3df" stroke="#cba5b7" stroke-width="3"/><path d="M323 245h38" stroke="#fffaf8" stroke-width="3"/><text x="342" y="248" text-anchor="middle" font-size="9" font-family="Arial" fill="#8e6785">GLOVES</text></g>',
 // SOAP note clipboard on a fixed standing chart board, chart hotspot unchanged.
 // Medical chart is hung visibly on the wall rather than covering the player.
 '<g transform="translate(380 215)" filter="url(#exShadow)"><rect width="103" height="88" rx="11" fill="#fff9e9" stroke="#c7a9ae" stroke-width="5"/><rect x="33" y="-7" width="37" height="15" rx="5" fill="#8db6b5"/><text x="51" y="25" font-size="12" font-weight="900" text-anchor="middle" font-family="Arial" fill="#5b7f87">PATIENT CHART</text><path d="M14 38h72M14 51h72M14 64h49" stroke="#aec6c8" stroke-width="4"/><text x="81" y="77" font-size="15" text-anchor="middle" fill="#c58ba0">♥</text></g>',

 // Caring framed illustration and wall art (not giant emoji decoration).
 // Delicate wall decals: two little trails of paw prints, away from equipment.
 '<g fill="#d7a6b7" opacity=".65"><g transform="translate(128 73) scale(.56)"><ellipse cx="0" cy="15" rx="14" ry="11"/><circle cx="-17" cy="-2" r="6"/><circle cx="-5" cy="-10" r="6"/><circle cx="9" cy="-10" r="6"/><circle cx="21" cy="-2" r="6"/></g><g transform="translate(164 72) rotate(19) scale(.4)"><ellipse cy="15" rx="14" ry="11"/><circle cx="-17" cy="-2" r="6"/><circle cx="-5" cy="-10" r="6"/><circle cx="9" cy="-10" r="6"/><circle cx="21" cy="-2" r="6"/></g><g transform="translate(902 119) rotate(-18) scale(.8)"><ellipse cy="15" rx="14" ry="11"/><circle cx="-17" cy="-2" r="6"/><circle cx="-5" cy="-10" r="6"/><circle cx="9" cy="-10" r="6"/><circle cx="21" cy="-2" r="6"/></g><g transform="translate(917 160) rotate(20) scale(.55)"><ellipse cy="15" rx="14" ry="11"/><circle cx="-17" cy="-2" r="6"/><circle cx="-5" cy="-10" r="6"/><circle cx="9" cy="-10" r="6"/><circle cx="21" cy="-2" r="6"/></g></g>',

 // A familiar cute clinical protocol board: remains a distinct action target.
 '<g transform="translate(284 209)" filter="url(#exShadow)"><rect width="104" height="58" rx="12" fill="#fffdf6" stroke="#aac9be" stroke-width="5"/><path d="M15 19h75M15 31h65M15 43h53" stroke="#bed6d4" stroke-width="4"/><rect x="36" y="-7" width="32" height="13" rx="5" fill="#8bb7b3"/></g>',
 // Patient table now has a grounded pedestal cabinet and a safer working height.
 // Patient table is a realistic-height anchored clinical fixture, not a floating prop.
 // Compact non-floating stainless examination table: a strong pedestal with
 // a floor-contacting footplate, drawers, and rounded tray at the veterinarian's waist.
 '<g filter="url(#exShadow)"><ellipse cx="790" cy="454" rx="109" ry="13" fill="#89a6a9" opacity=".32"/>',
 '<path d="M728 425L850 425L878 451L699 451Z" fill="#819fa9" stroke="#64848e" stroke-width="5"/>',
 '<path d="M744 356L851 354V439L744 439Z" fill="#c7dfe0" stroke="#7598a3" stroke-width="6"/>',
 '<path d="M759 374H832V405H759Z" fill="#f3f9f7" stroke="#9ab9bb" stroke-width="3" rx="6"/><path d="M773 388h46" stroke="#849faa" stroke-width="5" stroke-linecap="round"/>',
 '<path d="M761 414H832V431H761Z" fill="#e0efed" stroke="#9ab9bb" stroke-width="3"/><path d="M786 421h21" stroke="#7e9aa3" stroke-width="4" stroke-linecap="round"/>',
 '<path d="M618 323L775 278L941 319L782 366Z" fill="url(#exMetal)" stroke="#658d9c" stroke-width="8" stroke-linejoin="round"/>',
 '<path d="M618 323L782 366V382L618 341Z" fill="#a6c4ca" stroke="#668d9a" stroke-width="5"/>',
 '<path d="M782 366L941 319V337L782 382Z" fill="#84a7b2" stroke="#658a98" stroke-width="5"/>',
 '<path d="M647 319L777 291L908 321L783 352Z" fill="#fffaf5" stroke="#c3d6d5" stroke-width="4"/>',
 '<path d="M653 318L774 291" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>',
 '<g fill="#7c969d"><circle cx="910" cy="337" r="4"/><circle cx="886" cy="344" r="4"/></g></g>',
 // Art occupies the pad, not the upper wall; blank table is valid before selection.
 '<g transform="translate(213 17)">',examPatientArt(),'</g>',
 // Dedicated clean-wipe dispenser and a lidded clinical-waste bin against wall.
 '<g filter="url(#exShadow)"><rect x="882" y="219" width="48" height="43" rx="8" fill="#e9f4ef" stroke="#adc9ca" stroke-width="4"/><path d="M889 235h30" stroke="#93b6b8" stroke-width="4"/><path d="M901 224h8v-13h-8" fill="#fff"/><rect x="944" y="390" width="36" height="59" rx="6" fill="#a7c6ca" stroke="#70949d" stroke-width="4"/><path d="M938 388h48" stroke="#657f8a" stroke-width="6"/></g>',
 // The floor stays clear and washable: no rug and no stool in the walkway.
 // Guest chair is tucked under the counter end, not blocking the exam approach.
 '<g transform="translate(110 426)"><rect x="0" y="-40" width="96" height="13" rx="6" fill="#d5b8b0"/><rect x="0" y="-2" width="96" height="16" rx="7" fill="#dfb6bf"/><path d="M12 14v48m73-48v48M12-27v24m73-24v24" stroke="#8da9b4" stroke-width="8"/></g>',
 '<g transform="translate(360 402)"><path d="M8 9h39l-7 34H16Z" fill="#e7b0a3" stroke="#bc8b86" stroke-width="4"/><path d="M27 14q-26-30-13-49q24 7 13 49ZM27 8q18-38 43-34q-5 30-43 34ZM26 9q-2-48 13-60q17 23-13 60Z" fill="#87b59b" stroke="#6d9e87" stroke-width="3"/></g>',
 '</svg>'
 ];
 return fragments.join('');
}

art.roomArt=function(k){return k==='exam'?drawing():previous(k)};
const p=rooms.exam.props;
p[0].x=43;p[0].label='Patient Charts';
p[1].x=78;p[1].label='Examine Patient';
p[2].x=34;p[2].label='Clinical Protocols';
function refresh(){
 stage.querySelector('#vpqExamHotspots')?.remove();
 if(stage.dataset.room!=='exam')return;
 const el=document.createElement('div');el.id='vpqExamHotspots';
 el.innerHTML='<button type="button" class="vpqExamHot vpqExamCharts" data-vpqexamaction="medicalCharts" aria-label="Open patient medical charts"><span>📋 Patient Charts</span></button>'+
 '<button type="button" class="vpqExamHot vpqExamPatient" data-vpqexamaction="patients" aria-label="Examine patient and start patient cases"><span>🩺 Examine Patient</span></button>'+
 '<button type="button" class="vpqExamHot vpqExamProtocol" data-vpqexamaction="protocols" aria-label="Open clinical protocols"><span>📖 Protocols</span></button>'+
 '<button type="button" class="vpqExamHelp vpqExamHelpCharts" data-examhelp="charts" aria-label="What are patient charts?">?</button>'+
 '<button type="button" class="vpqExamHelp vpqExamHelpProtocol" data-examhelp="protocols" aria-label="What are clinical protocols?">?</button>'+
 '<button type="button" class="vpqExamHelp vpqExamHelpPatient" data-examhelp="patients" aria-label="What happens when I examine a patient?">?</button>'+
 '<button type="button" class="vpqExamHelp vpqExamHelpSkills" data-examhelp="skills" aria-label="What is the clinical skills area?">?</button>'+
 '<button type="button" class="vpqExamHelp vpqExamHelpPicker" data-examhelp="picker" aria-label="How do I select an exam-room patient?">?</button>'+
 '<div class="vpqExamHelpPopover" id="vpqExamHelpPopover" hidden role="status" aria-live="polite"></div>'+
 '<label class="vpqExamPatientPicker">🐾 Exam animal <select data-vpqexamanimal="1" aria-label="Choose an uploaded animal for the exam table"><option value=""'+(!examAnimal?' selected':'')+'>Select an animal…</option>'+examPatients().map(p=>'<option value="'+escExam(p.id)+'"'+(p.id===examAnimal?' selected':'')+'>'+escExam(p.label)+'</option>').join('')+'</select></label>'+
 '<button type="button" class="vpqExamSkills" data-vpqexamaction="skillsWing" aria-label="Walk into Clinical Skills for injection and blood draw">💉 🩸 Clinical Skills · Injection / Blood Draw</button>'+ 
 '<button type="button" class="vpqExamExit" data-vpqexamreturn="1">← Reception</button>';
 el.addEventListener('change',e=>{if(e.target.matches('[data-vpqexamanimal]')){examAnimal=e.target.value;const svg=document.getElementById('scene')?.querySelector('.vpqExamRoomArt');if(svg)svg.outerHTML=drawing();}});
 el.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.examhelp){
  const notes={
   charts:'Patient Charts: open the SOAP notes and medical chart for your practice cases.',
   protocols:'Clinical Protocols: review clinical checklists, safety steps, and patient workflows.',
   patients:'Examine Patient: start clinical cases and apply what you learned to the patient.',
   skills:'Clinical Skills: practice injections, venipuncture, and sample handling.',
   picker:'Exam animal: choose from the newly uploaded dogs, cats, pocket pets, birds, and exotics. This changes only the animal displayed on the table, not your equipped companion or clinical cases.'
  };
  const pop=el.querySelector('#vpqExamHelpPopover');
  const active=pop.dataset.open===b.dataset.examhelp&&!pop.hidden;
  el.querySelectorAll('.vpqExamHelp').forEach(x=>x.setAttribute('aria-expanded',String(!active&&x===b)));
  if(active){pop.hidden=true;pop.dataset.open='';}
  else{pop.textContent=notes[b.dataset.examhelp]||'';pop.dataset.open=b.dataset.examhelp;pop.hidden=false;}
  return;
 }
 if(b.dataset.vpqexamreturn!==undefined)return changeRoom('reception');
 if(b.dataset.vpqexamaction)return doAction(b.dataset.vpqexamaction);
});
 stage.appendChild(el);
}
const style=document.createElement('style');style.textContent=
'.vpqExamRoomArt{display:block;position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'+
'.stage[data-room="exam"] #avatarSprite .vpq-game-avatar{width:100%;height:100%}'+
'.stage[data-room="exam"] #vpqExamHotspots .vpqExamHot.vpqApproachNear{background:transparent!important;outline:none!important;border:2px solid #b8a7ba!important;box-shadow:none!important;filter:none!important}'+
'.stage[data-room="exam"] #vpqExamHotspots .vpqExamHot.vpqApproachNear:after{content:"E"!important;top:0!important;left:auto!important;right:0!important;transform:translateY(-50%)!important;padding:2px 5px!important;font-size:9px!important;border:1px solid #b7a2bd!important;background:#fff9f5!important;color:#6c5872!important}'+
'.stage[data-room="exam"] #vpqExamHotspots .vpqExamHot.vpqApproachNear span{background:#fffdf8!important;border:2px solid #9abdc0!important;box-shadow:0 2px 4px #64718a33!important;color:#42697a!important}'+
'.stage[data-room="exam"] .roomdecor,.stage[data-room="exam"] .prop{display:none!important}'+
'#vpqExamHotspots{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqExamHot,.vpqExamExit{pointer-events:auto;position:absolute;border:2px solid #99bbc2bb;border-radius:12px;background:#ffffff15;box-shadow:none;transform:none!important}'+
'.vpqExamHot:hover,.vpqExamHot:focus-visible,.vpqExamExit:hover,.vpqExamExit:focus-visible{border:3px solid #f1c66d;outline:2px solid #fff;background:#fff6ba48}'+
'.vpqExamHot span{position:absolute;bottom:7%;left:50%;transform:translateX(-50%);white-space:nowrap;background:#fffdf5;color:#355a70;border:2px solid #83acb5;border-radius:14px;padding:5px 9px;font-size:12px;font-weight:900;box-shadow:0 3px 0 #708c962e}.vpqExamCharts span{bottom:-23%}.vpqExamProtocol span{bottom:-30%}'+
'.vpqExamCharts{left:38%;top:43%;width:10%;height:18%}.vpqExamPatient{left:62%;top:51%;width:31%;height:32%}.vpqExamProtocol{left:28%;top:42%;width:11%;height:13%}'+
'.vpqExamHelp{position:absolute;pointer-events:auto;z-index:9;width:24px;height:24px;min-height:24px;min-width:24px;padding:0;border:2px solid #a99ac6;border-radius:50%;background:#fffaf4;color:#7a608e;font:900 14px Arial;box-shadow:0 2px 4px #5c507a2d;cursor:pointer}.vpqExamHelp:hover,.vpqExamHelp:focus-visible{background:#f2e6ff;outline:2px solid #fff}.vpqExamHelpCharts{left:45.5%;top:42%}.vpqExamHelpProtocol{left:37.5%;top:40%}.vpqExamHelpPatient{left:88%;top:77%}.vpqExamHelpSkills{left:28%;top:7%}.vpqExamHelpPicker{right:2%;bottom:17%}.vpqExamHelpPopover{pointer-events:auto;position:absolute;z-index:12;right:18%;bottom:8%;width:min(310px,58%);background:#fffdf9;border:2px solid #c3a9cb;border-radius:12px;padding:12px 14px;font-size:12px;line-height:1.45;font-weight:700;color:#584c6c;box-shadow:0 5px 16px #55486933}.vpqExamHelpPopover[hidden]{display:none!important}'+
'.vpqExamSkills{pointer-events:auto;position:absolute;left:3%;top:8%;background:#fff4fadd;border:3px solid #b79bda;border-radius:14px;color:#745588;padding:9px 12px;font-size:13px;font-weight:900;box-shadow:0 5px 0 #bfa8d455;cursor:pointer;z-index:3}.vpqExamSkills:hover,.vpqExamSkills:focus-visible{background:#fff1bd;border-color:#eab65c;outline:2px solid #fff9dd}'+
'.vpqExamPatientPicker{pointer-events:auto;position:absolute;bottom:3%;right:2%;z-index:8;background:#fffaf8f2;color:#684b6d;border:2px solid #cda7c8;border-radius:13px;padding:7px;font-size:11px;font-weight:900;box-shadow:0 3px 0 #b49ab044}.vpqExamPatientPicker select{font:inherit;max-width:160px;color:#435f68;background:transparent;border:0;cursor:pointer}.vpqExamExit{top:8%;right:2%;background:#fffdf5ed;color:#365e66;font-size:11px;padding:6px 9px}'+
'@media(max-width:600px){.vpqExamHot span{font-size:10px;padding:3px 5px}.vpqExamPatientPicker{font-size:9px}.vpqExamPatientPicker select{max-width:105px}.vpqExamExit{font-size:10px}}';
document.head.appendChild(style);
const observer=new MutationObserver(()=>{if((stage.dataset.room==='exam')!==!!stage.querySelector('#vpqExamHotspots'))refresh()});
observer.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
refresh();
return {refresh,drawing};
};