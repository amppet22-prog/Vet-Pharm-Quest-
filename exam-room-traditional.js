/* Traditional veterinary examination room — decorative dog/cat on stainless table.
 * Keeps existing Medical Chart, Patient Rounds, and Protocol actions unchanged. */
window.VPQ_EXAM_ROOM_A5=function(api){
'use strict';
const {rooms,doAction,changeRoom}=api,stage=document.getElementById('stage'),art=window.VPQ_SCENERY;
if(!stage||!art||!rooms.exam)return null;
const previous=art.roomArt.bind(art);
let examAnimal='dog';
const escExam=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dogNames=['Husky / Shepherd','German Shepherd','Husky','Corgi','Dachshund','Greyhound','Border Collie','Australian Shepherd','Labrador','Golden Retriever','Mixed Breed','Other Dog'];
const catNames=['Tabby','Black','Orange','Tuxedo','Calico','Longhair','Siamese','Other Cat'];
const catalog=[...dogNames.map((label,i)=>({id:'dog-'+i,label:'Dog · '+label,species:'dog',atlas:i})),...catNames.map((label,i)=>({id:'cat-'+i,label:'Cat · '+label,species:'cat',atlas:i+12})),...['Rabbit','Lizard','Snake','Turtle'].map((label,i)=>({id:label.toLowerCase(),label,species:label.toLowerCase(),atlas:i+22}))];
const allowed={dog:'🐕',cat:'🐈',rabbit:'🐇',lizard:'🦎',snake:'🐍',turtle:'🐢'};
function examPatients(){
 const options=[{id:'dog',label:'Funky original dog',species:'dog'},{id:'cat',label:'Original cartoon cat',species:'cat'},...catalog];
 try{
 const pet=JSON.parse(localStorage.getItem('vpq-v2-clinic-state')||'{}');
 const species=Object.keys(allowed).find(k=>allowed[k]===pet.pet);
 if(species){
  const names=species==='dog'?['husky-shepherd','german-shepherd','husky','corgi','dachshund','greyhound','border-collie','australian-shepherd','labrador','golden-retriever','mixed','other-dog']:['tabby','black','orange','tuxedo','calico','longhair','siamese','other-cat'];
  const i=species==='dog'?Math.max(0,names.indexOf(pet.petBreed)):species==='cat'?12+Math.max(0,names.indexOf(pet.catLook)):catalog.find(x=>x.species===species)?.atlas;
  options.splice(2,0,{id:'saved',label:String(pet.petName||'My companion').slice(0,30)+' · my companion',species,atlas:i});
 }
 }catch(e){}
 (Array.isArray(window.VPQ_EXAM_PATIENTS)?window.VPQ_EXAM_PATIENTS:[]).forEach(p=>{
  const species=String(p?.species||'').toLowerCase();
  if(p&&Object.prototype.hasOwnProperty.call(allowed,species)&&/^[a-z0-9_-]{1,50}$/i.test(p.id||'')&&!options.some(q=>q.id===p.id))
   options.push({id:p.id,label:String(p.label||p.id).slice(0,50),image:p.image,species,atlas:p.atlas});
 });
 return options;
}
function examPatientArt(){
 const p=examPatients().find(x=>x.id===examAnimal)||examPatients()[0];
 if(p.id==='dog'||p.id==='cat')return animalArt();
 if(typeof p.image==='string'&&p.image.startsWith('assets/')&&!p.image.includes('..')&&/\.(png|jpg|jpeg|webp)$/i.test(p.image))
   return '<image href="'+escExam(p.image)+'" x="442" y="208" width="190" height="130" preserveAspectRatio="xMidYMax meet"/>';
 if(Number.isInteger(p.atlas)&&p.atlas>=0&&p.atlas<32){
  const c=p.atlas%8,r=Math.floor(p.atlas/8);
  return '<svg x="446" y="196" width="185" height="139" viewBox="'+c*100+' '+r*100+' 100 100"><image href="assets/vpq-illustrated-pets.webp" x="0" y="0" width="800" height="400" preserveAspectRatio="none"/></svg>';
 }
 return '<text x="535" y="304" text-anchor="middle" font-size="96">'+escExam(allowed[p.species]||'🐾')+'</text>';
}

const animalArt=()=>examAnimal==='cat'
 ? '<g transform="translate(0 0)"><path d="M521 312q-37 -26 -5 -44q22 -9 37 10q14 -13 32 -6q24 7 25 33q-6 27 -43 30l-31 0Z" fill="#d8ac86" stroke="#926c63" stroke-width="6"/><path d="M578 275q18 -31 37 -13l20 34l-12 16" fill="none" stroke="#926c63" stroke-width="10" stroke-linecap="round"/><path d="M496 284l-9 -32l26 17l22 -22l5 35" fill="#d8ac86" stroke="#926c63" stroke-width="6"/><ellipse cx="517" cy="288" rx="29" ry="29" fill="#d8ac86" stroke="#926c63" stroke-width="5"/><path d="M502 285h8m17 0h8" stroke="#584d55" stroke-width="5" stroke-linecap="round"/><path d="M519 290l5 5l-5 3l-5 -3Z" fill="#bb7f89"/><path d="M519 299q-11 7 -18 0m18 0q11 7 19 0" stroke="#795b5d" stroke-width="2" fill="none"/><path d="M548 325v17m33 -14v16" stroke="#926c63" stroke-width="9" stroke-linecap="round"/></g>'
 : '<g><path d="M497 307q19 -35 64 -33q51 1 67 33l-9 24h-114Z" fill="#c59b73" stroke="#8e6b58" stroke-width="6"/><path d="M612 281q40 -45 50 -8" fill="none" stroke="#8e6b58" stroke-width="12" stroke-linecap="round"/><path d="M499 307q-31 4 -43 -17q-13 -24 3 -44q21 -19 46 2l16 33" fill="#c59b73" stroke="#8e6b58" stroke-width="6"/><path d="M456 261l-12 -29q-14 30 -3 47" fill="#a77862" stroke="#8e6b58" stroke-width="5"/><path d="M502 256l20 -23q4 30 -12 48" fill="#a77862" stroke="#8e6b58" stroke-width="5"/><ellipse cx="457" cy="293" rx="27" ry="18" fill="#ead6b5"/><circle cx="475" cy="268" r="4" fill="#3d3b44"/><circle cx="444" cy="289" r="5" fill="#544c52"/><path d="M501 320v21m45 -14v20m39 -19v19" stroke="#8e6b58" stroke-width="10" stroke-linecap="round"/><path d="M485 276q17 -8 26 7" fill="none" stroke="#fff9e9" stroke-width="6"/></g>';
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
 '<g transform="translate(190 269)" filter="url(#exShadow)"><path d="M0 16q23-19 62 0l-9 19H9Z" fill="#fffdf8" stroke="#93babb" stroke-width="4"/><ellipse cx="30" cy="15" rx="33" ry="9" fill="#f2fcfc" stroke="#9dc7c8" stroke-width="3"/><rect x="6" y="34" width="52" height="25" rx="8" fill="#7eacb4" stroke="#507e8c" stroke-width="3"/><rect x="16" y="41" width="32" height="12" rx="3" fill="#e8f6d9"/><text x="32" y="50" font-family="monospace" font-size="10" text-anchor="middle" fill="#476b70">0.00</text></g>',
 '<text x="215" y="260" text-anchor="middle" font-family="Arial" font-size="10" font-weight="800" fill="#607d80">SMALL PET SCALE</text>',
 // Soft paper towels, glove box and clinical consumables.
 '<g><rect x="96" y="224" width="35" height="15" rx="4" fill="#b3d3ce"/><rect x="315" y="234" width="54" height="21" rx="5" fill="#f3d3df" stroke="#cba5b7" stroke-width="3"/><path d="M323 245h38" stroke="#fffaf8" stroke-width="3"/><text x="342" y="248" text-anchor="middle" font-size="9" font-family="Arial" fill="#8e6785">GLOVES</text></g>',
 // SOAP note clipboard on a fixed standing chart board, chart hotspot unchanged.
 '<g transform="translate(331 278) rotate(-6)" filter="url(#exShadow)"><rect width="80" height="100" rx="10" fill="#f9f3df" stroke="#b99381" stroke-width="5"/><rect x="26" y="-5" width="28" height="15" rx="5" fill="#8dabaf"/><path d="M14 29h52M14 45h52M14 61h37" stroke="#b8cbd0" stroke-width="4"/><text x="40" y="88" text-anchor="middle" font-family="Arial" font-size="14" font-weight="800" fill="#73969c">SOAP</text></g>',
 // Caring framed illustration and wall art (not giant emoji decoration).
 '<g filter="url(#exShadow)"><rect x="370" y="222" width="108" height="62" rx="12" fill="#fffdf6" stroke="#d2a9bb" stroke-width="5"/><path d="M393 249q10-18 19 0q9-18 19 0q-5 15-19 23q-14-8-19-23Z" fill="#e4a6ba"/><text x="454" y="250" font-family="Arial" font-size="11" font-weight="800" text-anchor="middle" fill="#7c7883">GENTLE</text><text x="454" y="265" font-family="Arial" font-size="11" font-weight="800" text-anchor="middle" fill="#7c7883">CARE</text></g>',
 // A familiar cute clinical protocol board: remains a distinct action target.
 '<g transform="translate(552 277)" filter="url(#exShadow)"><rect width="104" height="58" rx="12" fill="#fffdf6" stroke="#aac9be" stroke-width="5"/><path d="M15 19h75M15 31h65M15 43h53" stroke="#bed6d4" stroke-width="4"/><rect x="36" y="-7" width="32" height="13" rx="5" fill="#8bb7b3"/></g>',
 // Right-side authentic hydraulic exam table: base, lift column, broad steel top.
 '<g filter="url(#exShadow)"><ellipse cx="783" cy="421" rx="143" ry="25" fill="#a0b8b6" opacity=".35"/><rect x="745" y="354" width="74" height="62" rx="15" fill="#7199a4" stroke="#597d8b" stroke-width="6"/><path d="M755 414h-70m121 0h66" stroke="#5f8390" stroke-width="13" stroke-linecap="round"/><path d="M751 389h66" stroke="#bbd6d4" stroke-width="6"/>',
 '<path d="M607 318L770 272L940 313L769 370Z" fill="url(#exMetal)" stroke="#658c9a" stroke-width="8" stroke-linejoin="round"/>',
 '<path d="M607 318L769 370V389L607 338Z" fill="#91adb8" stroke="#688d9a" stroke-width="6"/><path d="M769 370L940 313V335L769 389Z" fill="#83a8b1" stroke="#688d9a" stroke-width="6"/>',
 '<path d="M638 319L769 284L910 314L772 354Z" fill="#fffaf3" stroke="#c1d9d8" stroke-width="3"/>',
 '<path d="M654 316l5-6 5 6m-3-3v9M891 321l4-6 4 6" stroke="#e4a2b4" stroke-width="2" fill="none" opacity=".8"/></g>',
 // Keep all legacy patients visually on top of the table.
 '<g transform="translate(213 -11)">',examPatientArt(),'</g>',
 // Wipe dispenser and a small sensible waste bin.
 '<g filter="url(#exShadow)"><rect x="880" y="218" width="48" height="43" rx="8" fill="#e9f4ef" stroke="#adc9ca" stroke-width="4"/><path d="M889 235h30" stroke="#93b6b8" stroke-width="4"/><path d="M901 224h8v-13h-8" fill="#fff"/><rect x="918" y="404" width="42" height="51" rx="8" fill="#9cbac0" stroke="#688f99" stroke-width="4"/><path d="M914 404h50" stroke="#647f8b" stroke-width="6"/></g>',
 // Stool and visitor seating are detailed, but kept low and outside stations.
 '<g transform="translate(507 382)"><ellipse cx="36" cy="12" rx="42" ry="14" fill="#8cb2ae"/><ellipse cx="36" cy="8" rx="36" ry="9" fill="#f6d2d3"/><path d="M36 22v61M36 72L6 91M36 72l32 19" stroke="#728f9c" stroke-width="8" stroke-linecap="round" fill="none"/></g>',
 '<g transform="translate(104 423)"><rect x="0" y="-44" width="104" height="14" rx="7" fill="#d0b7b1"/><rect x="1" y="0" width="104" height="19" rx="8" fill="#e5b8c1"/><path d="M12 19v42m80-42v42M12-28v27m80-27v27" stroke="#8da9b4" stroke-width="9"/></g>',
 // Simple potted fern, muted paw-print runner. Less clutter than floating emojis.
 '<ellipse cx="540" cy="471" rx="124" ry="20" fill="#efd0d8" opacity=".85"/><ellipse cx="540" cy="471" rx="112" ry="14" fill="none" stroke="#fff9f5" stroke-width="4" stroke-dasharray="12 11"/>',
 '<g transform="translate(360 402)"><path d="M8 9h39l-7 34H16Z" fill="#e7b0a3" stroke="#bc8b86" stroke-width="4"/><path d="M27 14q-26-30-13-49q24 7 13 49ZM27 8q18-38 43-34q-5 30-43 34ZM26 9q-2-48 13-60q17 23-13 60Z" fill="#87b59b" stroke="#6d9e87" stroke-width="3"/></g>',
 '</svg>'
 ];
 return fragments.join('');
}

art.roomArt=function(k){return k==='exam'?drawing():previous(k)};
const p=rooms.exam.props;
p[0].x=36;p[0].label='Patient Charts';
p[1].x=78;p[1].label='Examine Patient';
p[2].x=61;p[2].label='Clinical Protocols';
function refresh(){
 stage.querySelector('#vpqExamHotspots')?.remove();
 if(stage.dataset.room!=='exam')return;
 const el=document.createElement('div');el.id='vpqExamHotspots';
 el.innerHTML='<button type="button" class="vpqExamHot vpqExamCharts" data-vpqexamaction="medicalCharts" aria-label="Open patient medical charts"><span>📋 Patient Charts</span></button>'+
 '<button type="button" class="vpqExamHot vpqExamPatient" data-vpqexamaction="patients" aria-label="Examine patient and start patient cases"><span>🩺 Examine Patient</span></button>'+
 '<button type="button" class="vpqExamHot vpqExamProtocol" data-vpqexamaction="protocols" aria-label="Open clinical protocols"><span>📖 Protocols</span></button>'+
 '<label class="vpqExamPatientPicker">🐾 Patient <select data-vpqexamanimal="1" aria-label="Choose exam patient">'+examPatients().map(p=>'<option value="'+escExam(p.id)+'"'+(p.id===examAnimal?' selected':'')+'>'+escExam(p.label)+'</option>').join('')+'</select></label>'+
 '<button type="button" class="vpqExamSkills" data-vpqexamaction="skillsWing" aria-label="Walk into Clinical Skills for injection and blood draw">💉 🩸 Clinical Skills · Injection / Blood Draw</button>'+ 
 '<button type="button" class="vpqExamExit" data-vpqexamreturn="1">← Reception</button>';
 el.addEventListener('change',e=>{if(e.target.matches('[data-vpqexamanimal]')){examAnimal=e.target.value;const svg=document.getElementById('scene')?.querySelector('.vpqExamRoomArt');if(svg)svg.outerHTML=drawing();}});
 el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.vpqexamreturn!==undefined)return changeRoom('reception');if(b.dataset.vpqexamaction)return doAction(b.dataset.vpqexamaction)});
 stage.appendChild(el);
}
const style=document.createElement('style');style.textContent=
'.vpqExamRoomArt{display:block;position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'+
'.stage[data-room="exam"] #avatarSprite{width:86px;height:162px;bottom:14%;margin-left:-14px;filter:drop-shadow(3px 6px 3px #54647655)}'+
'.stage[data-room="exam"] #avatarSprite .vpq-game-avatar{width:100%;height:100%}'+
'.stage[data-room="exam"] .roomdecor,.stage[data-room="exam"] .prop{display:none!important}'+
'#vpqExamHotspots{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqExamHot,.vpqExamExit{pointer-events:auto;position:absolute;border:2px solid #99bbc2bb;border-radius:12px;background:#ffffff15;box-shadow:none;transform:none!important}'+
'.vpqExamHot:hover,.vpqExamHot:focus-visible,.vpqExamExit:hover,.vpqExamExit:focus-visible{border:3px solid #f1c66d;outline:2px solid #fff;background:#fff6ba48}'+
'.vpqExamHot span{position:absolute;bottom:7%;left:50%;transform:translateX(-50%);white-space:nowrap;background:#fffdf5;color:#355a70;border:2px solid #83acb5;border-radius:14px;padding:5px 9px;font-size:12px;font-weight:900;box-shadow:0 3px 0 #708c962e}.vpqExamCharts span{bottom:-23%}.vpqExamProtocol span{bottom:-38%}'+
'.vpqExamCharts{left:32%;top:54%;width:11%;height:22%}.vpqExamPatient{left:62%;top:48%;width:30%;height:31%}.vpqExamProtocol{left:55%;top:55%;width:11%;height:12%}'+
'.vpqExamSkills{pointer-events:auto;position:absolute;left:3%;top:8%;background:#fff4fadd;border:3px solid #b79bda;border-radius:14px;color:#745588;padding:9px 12px;font-size:13px;font-weight:900;box-shadow:0 5px 0 #bfa8d455;cursor:pointer;z-index:3}.vpqExamSkills:hover,.vpqExamSkills:focus-visible{background:#fff1bd;border-color:#eab65c;outline:2px solid #fff9dd}'+
'.vpqExamPatientPicker{pointer-events:auto;position:absolute;bottom:3%;right:2%;z-index:8;background:#fffaf8f2;color:#684b6d;border:2px solid #cda7c8;border-radius:13px;padding:7px;font-size:11px;font-weight:900;box-shadow:0 3px 0 #b49ab044}.vpqExamPatientPicker select{font:inherit;max-width:160px;color:#435f68;background:transparent;border:0;cursor:pointer}.vpqExamExit{top:8%;right:2%;background:#fffdf5ed;color:#365e66;font-size:11px;padding:6px 9px}'+
'@media(max-width:600px){.vpqExamHot span{font-size:10px;padding:3px 5px}.vpqExamPatientPicker{font-size:9px}.vpqExamPatientPicker select{max-width:105px}.vpqExamExit{font-size:10px}}';
document.head.appendChild(style);
const observer=new MutationObserver(()=>{if((stage.dataset.room==='exam')!==!!stage.querySelector('#vpqExamHotspots'))refresh()});
observer.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
refresh();
return {refresh,drawing};
};