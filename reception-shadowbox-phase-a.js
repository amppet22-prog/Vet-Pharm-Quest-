/* Phase A1+A2: shadow-box reception and shallow clinical corridor.
 * Runs only in reception's 2.5D view; classic 2D and existing game modes stay intact.
 * The SVG is scenery; accessible HTML buttons are the interactive hit targets. */
window.VPQ_SHADOWBOX_RECEPTION=function(api){
 'use strict';
 const {state,rooms,changeRoom,doAction,persist,renderRoom}=api;
 const stage=document.getElementById('stage');
 const sceneArt=window.VPQ_SCENERY;
 if(!stage||!sceneArt)return null;
 const previousArt=sceneArt.roomArt.bind(sceneArt);
 const palette={
 'paint-peach':['#fff0e6','#ead1c9','#b9a1aa','#e5d0d3','#b39b91'],
 'paint-mint':['#e5f5ed','#c1ded4','#83b2a4','#d5e8df','#8aa79a'],
 'paint-blue':['#e8f4ff','#c0d8e9','#81a8c1','#dbe8ef','#89a9bd'],
 'paint-lavender':['#f2eaff','#d9c7e7','#a995c0','#e6daf1','#a796bf'],
 'wall-floral':['#fae6ef','#dcb6c8','#ba8ba4','#f6dce8','#bb92ac'],
 'wall-halloween':['#f9e0cb','#c9ac96','#9b817e','#ebd3c0','#a98771'],
 'wall-pride':['#f5eafe','#d5c4e9','#a897c8','#e9d9f4','#a191b5'],
 'wall-winter':['#eaf5fb','#bbd8e8','#8cacc9','#dcecf4','#9db9ce'],
 'wall-christmas':['#F5E8EF','#E5DAEA','#C7B5CB','#E1D1D9','#AF96B6'],
 'wall-hanukkah':['#F5E8EF','#E5DAEA','#C7B5CB','#E1D1D9','#AF96B6'],
 'wall-kwanzaa':['#F5E8EF','#E5DAEA','#C7B5CB','#E1D1D9','#AF96B6'],
 'wall-snowglow':['#F5E8EF','#E5DAEA','#C7B5CB','#E1D1D9','#AF96B6'],
 'wall-valentines':['#F5E8EF','#E5DAEA','#C7B5CB','#E1D1D9','#AF96B6'],
 'wall-stpatricks':['#F5E8EF','#E5DAEA','#C7B5CB','#E1D1D9','#AF96B6'],
 'wall-midnight':['#303553','#252C4A','#434E75','#313959','#8C8BB5'],
 'wall-unicorn':['#F5E8EF','#E5DAEA','#C7B5CB','#E1D1D9','#AF96B6'],
 'wall-boho':['#F5E8EF','#E5DAEA','#C7B5CB','#E1D1D9','#AF96B6'],
 'wall-coffee':['#F5E8EF','#E5DAEA','#C7B5CB','#E1D1D9','#AF96B6'],
 'wall-scifi':['#E5F5F7','#D2E5E8','#A0C5D2','#C1D5D9','#80AEC0']
 };
 const wallpaperArt={
  'wall-halloween':'assets/reception/wallpaper-halloween-approved.webp',
  'wall-winter':'assets/reception/wallpaper-winter-approved.webp',
  'wall-pride':'assets/reception/wallpaper-pride-approved.webp',
  'wall-floral':'assets/reception/wallpaper-spring-approved.webp',
  'wall-christmas':'assets/reception/wallpaper-christmas-theme.svg',
  'wall-hanukkah':'assets/reception/wallpaper-hanukkah-theme.svg',
  'wall-kwanzaa':'assets/reception/wallpaper-kwanzaa-theme.svg',
  'wall-snowglow':'assets/reception/wallpaper-snowglow-theme.svg',
  'wall-valentines':'assets/reception/wallpaper-valentines-theme.svg',
  'wall-stpatricks':'assets/reception/wallpaper-stpatricks-theme.svg',
  'wall-midnight':'assets/reception/wallpaper-midnight-theme.svg',
  'wall-unicorn':'assets/reception/wallpaper-unicorn-theme.svg',
  'wall-boho':'assets/reception/wallpaper-boho-theme.svg',
  'wall-coffee':'assets/reception/wallpaper-coffee-theme.svg',
  'wall-scifi':'assets/reception/wallpaper-scifi-theme.svg'
 };
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function drawing(){
  const bag=state.receptionCollection||{},c=palette[bag.equippedWall]||palette['paint-peach'];
  // Use the SAME purchased pattern on the back and both perspective side walls.
  // Each narrow side wall has its own cropped image so the pattern remains visible;
  // clipping keeps wallpaper out of the floor, ceiling, and navigation hotspots.
  const artSrc=wallpaperArt[bag.equippedWall];
  const wallpaper=artSrc?'<image href="'+artSrc+'" x="68" y="52" width="864" height="268" preserveAspectRatio="none"/>':'';
  const sideWallpaper=artSrc?'<g aria-hidden="true">'+
    '<image href="'+artSrc+'" x="-37" y="0" width="270" height="400" preserveAspectRatio="none" clip-path="url(#vpqWallLeftClip)"/>'+
    '<image href="'+artSrc+'" x="782" y="0" width="270" height="400" preserveAspectRatio="none" clip-path="url(#vpqWallRightClip)"/>'+
    '<path d="M0 0L68 52V320L0 394Z" fill="#604a6a" opacity=".10"/>'+
    '<path d="M1000 0L932 52V320L1000 394Z" fill="#604a6a" opacity=".10"/>'+
    '</g>':'';
  const placed=Array.isArray(bag.placed)?bag.placed:[];
  const has=id=>placed.includes(id);
  const flora=has('decor-cat')?'<g transform="translate(24 282)"><rect x="10" y="42" width="98" height="65" rx="13" fill="#e2bfd1" stroke="#947e9e" stroke-width="5"/><text x="59" y="88" font-size="37" text-anchor="middle">🐈</text><path d="M-3 110h127" stroke="#a98ea8" stroke-width="12"/></g>':'';
  const kids=has('decor-kids')?'<g transform="translate(921 275) scale(.68)"><rect width="116" height="63" rx="15" fill="#f5debb" stroke="#d6b7a7" stroke-width="5"/><text x="57" y="44" font-size="36" text-anchor="middle">🧸</text></g>':'<g transform="translate(937 308) scale(.5)"><rect x="0" y="18" width="64" height="38" rx="11" fill="#f4dfdf" stroke="#c5a5c0" stroke-width="4"/><text x="32" y="43" text-anchor="middle" font-size="24">🐾</text></g>';
  const decorations='';
  const holiday=has('decor-holiday')?'<text x="881" y="85" font-size="25">✨</text>':'';
  const rainbow=has('decor-rainbow')?'<g><path d="M90 108Q144 39 203 108" fill="none" stroke="#dd87bd" stroke-width="11"/><path d="M97 109Q144 55 196 109" fill="none" stroke="#f3c073" stroke-width="9"/><path d="M103 111Q146 68 190 111" fill="none" stroke="#8acfb3" stroke-width="7"/><path d="M110 113Q146 79 183 113" fill="none" stroke="#84b9e7" stroke-width="6"/></g>':'';

  // Sofas are rendered as actual cushioned furniture, with a single equipped style.
  const sofa=placed.includes('seat-sofa-sage')?['#8cbda8','#679a8e','#c2e4d4']:placed.includes('seat-sofa-blue')?['#83b2d8','#5f90bc','#b4d7eb']:['#b8a2d7','#8f7bb7','#e4d5ee'];
  const couch='<g transform="translate(742 343) scale(.81)">'+
    '<ellipse cx="92" cy="109" rx="102" ry="15" fill="#65596b" opacity=".24"/>'+
    '<path d="M15 4Q15 -10 32 -10H165Q183 -10 183 9V79H15Z" fill="'+sofa[1]+'" stroke="#6b6486" stroke-width="6"/>'+
    '<path d="M24 15Q24 4 39 4H94V80H24Z" fill="'+sofa[0]+'" stroke="#84779b" stroke-width="3"/>'+
    '<path d="M101 4H158Q173 4 173 17V80H101Z" fill="'+sofa[0]+'" stroke="#84779b" stroke-width="3"/>'+
    '<path d="M18 67Q18 52 37 52H156Q175 52 175 67V104H18Z" fill="'+sofa[0]+'" stroke="#79708a" stroke-width="6"/>'+
    '<path d="M99 57V100" stroke="#8b80a0" stroke-width="4"/>'+
    '<path d="M18 59Q0 45 1 64V100Q4 112 24 108L30 78Z" fill="'+sofa[1]+'" stroke="#6b6486" stroke-width="5"/>'+
    '<path d="M175 59Q193 45 192 66V101Q187 112 170 108L166 78Z" fill="'+sofa[1]+'" stroke="#6b6486" stroke-width="5"/>'+
    '<path d="M28 107V120M160 107V120" stroke="#8e7b6d" stroke-width="10"/>'+
    '<path d="M39 34q13 -10 26 0v14H39Z M127 34q12 -10 24 0v14H127Z" fill="'+sofa[2]+'" opacity=".88"/></g>';
  const sofaArt=window.VPQ_RECEPTION_MODULAR_ASSETS.manifest;
  const upgradedSofa=['seat-sofa-rose','seat-sofa-midnight','seat-sofa-linen'].find(id=>placed.includes(id));
  // Level-up sofas occupy the existing illustrated couch slot, never a second floating object.
  const levelSofas=(window.VPQ_EXPANDED_ROOM_FURNITURE||[]).filter(u=>u.levelRoom==='reception'&&u.furnitureKind==='sofa'&&(state.upgrades||[]).includes(u.id));
  const selectedLevelSofa=levelSofas.find(u=>u.id===state.activeReceptionLevelSofa)||levelSofas[0];
  const levelSofaArt=selectedLevelSofa&&window.VPQ_REWARD_ART?.art(selectedLevelSofa);
  const sofaVisual=levelSofaArt?'<svg x="738" y="335" width="181" height="123" viewBox="0 0 240 165" overflow="visible" aria-label="'+esc(selectedLevelSofa.label)+'">'+levelSofaArt+'</svg>':
    upgradedSofa?'<image href="'+sofaArt[upgradedSofa].src+'" x="744" y="341" width="169" height="110" preserveAspectRatio="xMidYMid meet" pointer-events="none"/>':couch;
  const plant='';
  const plantPair=has('decor-plant-pair')?'<g><g transform="translate(642 328) scale(.78)"><path d="M0 22h49l-8 47H8Z" fill="#d8b396"/><path d="M24 25V-34M24 -3Q-3 -22 -22 -12M24 -23Q45 -49 65 -32" fill="none" stroke="#649b72" stroke-width="9"/><ellipse cx="-19" cy="-13" rx="17" ry="9" fill="#84bb94"/><ellipse cx="64" cy="-32" rx="18" ry="10" fill="#89c39c"/></g><g transform="translate(956 383) scale(.55)"><path d="M0 22h49l-8 47H8Z" fill="#e1c3ab"/><path d="M24 25V-34M24 -3Q-3 -22 -22 -12M24 -23Q45 -49 65 -32" fill="none" stroke="#649b72" stroke-width="9"/><ellipse cx="-19" cy="-13" rx="17" ry="9" fill="#84bb94"/><ellipse cx="64" cy="-32" rx="18" ry="10" fill="#89c39c"/></g></g>':'';
  const catTree='';
  const catCarrier=''; // Replaced by shared illustrated modular carrier.
  const dogCarrier=has('decor-dog-carrier')?'<g transform="translate(55 425) scale(.83)"><rect width="100" height="43" rx="8" fill="#b7d1d0" stroke="#6d9193" stroke-width="5"/><path d="M8 4V37M28 4V37M48 4V37M68 4V37M88 4V37" stroke="#72989d" stroke-width="4"/><path d="M23 1Q50 -26 77 1" fill="none" stroke="#78989c" stroke-width="6"/><text x="51" y="31" text-anchor="middle" font-size="23">🐶</text></g>':'';
  const gallery=has('decor-pet-art')?'<g><g transform="translate(97 79) scale(.55)"><rect width="55" height="58" rx="4" fill="#fff6e7" stroke="#b49d94" stroke-width="5"/><text x="28" y="40" text-anchor="middle" font-size="31">🐶</text></g><g transform="translate(129 79) scale(.55)"><rect width="55" height="58" rx="4" fill="#fff6e7" stroke="#b49d94" stroke-width="5"/><text x="28" y="40" text-anchor="middle" font-size="31">🐱</text></g></g>':'';
  const pawArt='';

  return '<svg class="vpqShadowboxArt" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-label="Perspective veterinary reception with front desk and a short hallway to the exam room, pharmacy and study lounge" role="img">'+
   '<defs><linearGradient id="vpqShadowFloor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="'+c[3]+'"/><stop offset="1" stop-color="#c5b1ad"/></linearGradient><linearGradient id="vpqShadowHall" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7e8a9e"/><stop offset="1" stop-color="#d7cbd6"/></linearGradient><filter id="vpqShadowAmbient" x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="10"/></filter><clipPath id="vpqWallLeftClip"><path d="M0 0L68 52V320L0 394Z"/></clipPath><clipPath id="vpqWallRightClip"><path d="M1000 0L932 52V320L1000 394Z"/></clipPath></defs>'+
   // ceiling, thick sidewalls, back wall; shadowbox edges
   '<rect width="1000" height="500" fill="'+c[1]+'"/>'+
   '<polygon points="0,0 1000,0 932,52 68,52" fill="#fffdf7"/>'+
   '<polygon points="0,0 68,52 68,320 0,394" fill="'+c[2]+'"/>'+
   '<polygon points="932,52 1000,0 1000,394 932,320" fill="'+c[2]+'"/>'+
   sideWallpaper+
   '<rect x="68" y="52" width="864" height="268" fill="'+c[0]+'"/>'+
   wallpaper+
   '<path d="M68 52H932M68 320H932" stroke="'+c[4]+'" stroke-width="10" opacity=".65"/>'+
   // main hall recedes to a tiny rear study entrance
   '<path d="M419 130L465 87H579L623 130V315H419Z" fill="url(#vpqShadowHall)" stroke="#79778c" stroke-width="12"/>'+
   '<path d="M451 143L475 104H572L593 143V308H451Z" fill="#c6b9ca" stroke="#f9e7d4" stroke-width="5"/>'+
   '<path d="M475 104L451 143V308L475 263Z M572 104L593 143V308L572 263Z" fill="#9487a0"/>'+
   '<path d="M475 263L451 308H593L572 263Z" fill="#e8d4c1"/>'+
   '<path d="M487 137H562V265H487Z" fill="#d7c9df" stroke="#597b80" stroke-width="6"/>'+ '<path d="M500 260L512 144H538L550 260" fill="#ede6ef" stroke="#a6a0bd" stroke-width="3"/>'+ '<path d="M500 260L487 283H562L550 260Z" fill="#d5bfcf"/>'+ '<path d="M512 144h26M508 174h35M503 211h44" stroke="#a6a0bd" stroke-width="4"/>'+
   '<rect x="497" y="161" width="56" height="45" rx="5" fill="#e5f6f6"/>'+
   '<text x="525" y="178" text-anchor="middle" font-size="13" font-family="sans-serif" font-weight="800" fill="#315b69">CLINIC</text>'+
   '<text x="525" y="193" text-anchor="middle" font-size="12" font-family="sans-serif" fill="#315b69">HALL</text>'+
   '<circle cx="551" cy="224" r="5" fill="#e6bd67"/>'+
   // floor trapezoid + grout projecting toward viewer
   '<path d="M68 320H932L1000 500H0Z" fill="url(#vpqShadowFloor)"/>'+
   '<path d="M68 320L0 500M932 320L1000 500 M224 320L178 500 M377 320L362 500M525 320V500 M673 320L693 500M824 320L872 500 M44 425H957 M59 360H942" fill="none" stroke="#fff7ef" stroke-width="3" opacity=".65"/>'+
   '<ellipse cx="750" cy="438" rx="150" ry="44" fill="#bca4d5" opacity=".24"/>'+'<g transform="translate(178 18) scale(.87 .92)">'+window.VPQ_RECEPTION_MODULAR_ASSETS.render(state,'isometric','rug')+'</g>'+
   '<ellipse cx="494" cy="344" rx="240" ry="26" fill="#695e6d" opacity=".19" filter="url(#vpqShadowAmbient)"/>'+
   // clinical hall doorway (left), pharmacy doorway (right)
   '<g><rect x="243" y="109" width="151" height="208" rx="8" fill="#668c9d" stroke="#567989" stroke-width="12"/><rect x="260" y="124" width="119" height="180" fill="#cbe4e7"/><path d="M263 125L380 125L367 155H275Z" fill="#effbfa" opacity=".75"/><rect x="266" y="149" width="107" height="47" rx="8" fill="#fffaf1" stroke="#a4c4ce" stroke-width="3"/><text x="320" y="176" text-anchor="middle" font-size="17" font-weight="800" font-family="sans-serif" fill="#35596f">EXAM ROOM</text><rect x="275" y="223" width="89" height="62" rx="7" fill="#e6f2f1"/><text x="319" y="263" text-anchor="middle" font-size="31">🩺</text></g>'+
   '<g><rect x="669" y="109" width="148" height="208" rx="8" fill="#8e9bad" stroke="#687f99" stroke-width="12"/><rect x="685" y="124" width="116" height="180" fill="#dbecda"/><rect x="690" y="149" width="105" height="47" rx="8" fill="#fffaf1" stroke="#bdd6c1" stroke-width="3"/><text x="742" y="178" text-anchor="middle" font-size="17" font-weight="800" font-family="sans-serif" fill="#426a60">PHARMACY</text><rect x="698" y="216" width="89" height="69" rx="7" fill="#f0faf0"/><text x="742" y="261" text-anchor="middle" font-size="34">💊</text></g>'+
   // Cozy illustrated check-in desk: patient list monitor and clipboard.
   // SVG-only scenery; the existing HTML front-desk hotspot remains clickable.
   '<ellipse cx="223" cy="422" rx="215" ry="32" fill="#4d4a63" opacity=".21" filter="url(#vpqShadowAmbient)"/>'+
   '<g transform="translate(34 79) scale(.85)">'+
   // Rounded pastel desk with dimensional side panels.
   '<path d="M22 330L106 291H336L421 330L351 366H94Z" fill="#fff9ed" stroke="#b992a7" stroke-width="6" stroke-linejoin="round"/>'+
   '<path d="M93 357H352V447Q260 468 93 447Z" fill="#b1d9d4" stroke="#7faea9" stroke-width="6"/>'+
   '<path d="M22 330L94 357V447L22 400Z" fill="#8fbbb7" stroke="#719c99" stroke-width="6"/>'+
   '<path d="M352 357L421 330V401L352 447Z" fill="#9dc8c3" stroke="#719c99" stroke-width="6"/>'+
   '<path d="M100 359Q220 376 345 359" stroke="#f0fffa" stroke-width="5" fill="none" opacity=".8"/>'+
   '<rect x="143" y="387" width="164" height="43" rx="18" fill="#fff8f2" stroke="#ab90b6" stroke-width="4"/>'+
   '<text x="225" y="413" font-size="20" font-weight="900" text-anchor="middle" font-family="Arial,sans-serif" fill="#665078">RECEPTION</text>'+
   '<g fill="#fbe3ed" opacity=".9"><circle cx="112" cy="400" r="8"/><circle cx="337" cy="400" r="8"/></g>'+
   // Tablet-style computer showing the patient list, not an empty decorative screen.
   '<g transform="translate(165 219)">'+
   '<rect x="-6" y="-6" width="150" height="112" rx="14" fill="#77698d" opacity=".16"/>'+
   '<rect width="140" height="105" rx="13" fill="#5a617d" stroke="#413c62" stroke-width="4"/>'+
   '<rect x="8" y="8" width="124" height="85" rx="7" fill="#f5fbff"/>'+
   '<path d="M8 15Q8 8 15 8H125Q132 8 132 15V33H8Z" fill="#d6c8ee"/>'+
   '<text x="70" y="25" font-family="Arial,sans-serif" font-size="11" font-weight="900" text-anchor="middle" fill="#50436b">PATIENT LIST</text>'+
   '<circle cx="22" cy="44" r="5" fill="#b7dcd1"/><rect x="33" y="40" width="74" height="7" rx="3.5" fill="#93b7cb"/><circle cx="117" cy="44" r="5" fill="#e4ad83"/>'+
   '<circle cx="22" cy="60" r="5" fill="#f0c6d2"/><rect x="33" y="56" width="62" height="7" rx="3.5" fill="#aebbd7"/><circle cx="117" cy="60" r="5" fill="#9bcda9"/>'+
   '<circle cx="22" cy="76" r="5" fill="#e8d3a6"/><rect x="33" y="72" width="71" height="7" rx="3.5" fill="#93b7cb"/><circle cx="117" cy="76" r="5" fill="#9bcda9"/>'+
   '<rect x="53" y="105" width="34" height="12" rx="3" fill="#737895"/><path d="M40 118H101" stroke="#5b5e79" stroke-width="8" stroke-linecap="round"/>'+
   '</g>'+
   // Physical clipboard with a visible patient-check-in checklist.
   '<g transform="translate(68 290) rotate(-8 39 35)">'+
   '<rect x="0" y="0" width="82" height="78" rx="8" fill="#bb91b4" stroke="#967096" stroke-width="3"/>'+
   '<rect x="8" y="9" width="66" height="60" rx="4" fill="#fffdf7"/>'+
   '<rect x="27" y="-5" width="30" height="12" rx="5" fill="#81748e"/>'+
   '<text x="41" y="23" font-family="Arial,sans-serif" font-size="10" text-anchor="middle" font-weight="900" fill="#695275">CHECK-IN</text>'+
   '<g stroke="#90b2aa" stroke-width="2.5" fill="none"><path d="M16 34l4 4 7-9 M16 48l4 4 7-9"/></g>'+
   '<path d="M33 35h31M33 49h26M16 61h48" stroke="#c7bfcb" stroke-width="3" stroke-linecap="round"/>'+
   '</g>'+
   // Clinic front-counter accessories: clear treat jar, pamphlets and reception bell.
   '<g transform="translate(327 251)">'+
   '<ellipse cx="17" cy="57" rx="27" ry="8" fill="#6c6d83" opacity=".17"/>'+
   '<rect x="-4" y="10" width="43" height="50" rx="9" fill="#e1f5f1" stroke="#81a8a9" stroke-width="3"/>'+
   '<rect x="-9" y="7" width="53" height="10" rx="5" fill="#cba1b8" stroke="#a77c9b" stroke-width="2"/>'+
   '<rect x="7" y="-2" width="20" height="9" rx="4" fill="#e9c1d4"/>'+
   '<g fill="#dfaf72" stroke="#b9885f" stroke-width="1.5"><path d="M2 28q5-7 10 0l10 0q6-7 10 0q-5 7-10 2H12q-5 5-10-2Z"/><path d="M4 42q4-5 9 0h9q5-5 9 0q-4 6-9 2h-9q-5 4-9-2Z"/></g>'+
   '<rect x="0" y="45" width="35" height="12" rx="5" fill="#fff7e9"/><text x="17" y="53.5" font-size="8" font-weight="900" text-anchor="middle" font-family="Arial,sans-serif" fill="#84617e">TREATS</text>'+
   '</g>'+
   // Free-standing brochure/pamphlet holder, three different health handouts.
   '<g transform="translate(47 255)">'+
   '<path d="M0 21H83L76 80H6Z" fill="#b6cad7" stroke="#879fb7" stroke-width="3"/>'+
   '<rect x="5" y="0" width="24" height="66" rx="3" fill="#f4d9e5" stroke="#c79cb5" stroke-width="2"/>'+
   '<rect x="29" y="-9" width="23" height="72" rx="3" fill="#d8e9d9" stroke="#9fbca9" stroke-width="2"/>'+
   '<rect x="52" y="5" width="22" height="58" rx="3" fill="#e3dbf6" stroke="#b0a1d1" stroke-width="2"/>'+
   '<g font-family="Arial,sans-serif" font-weight="900" font-size="7" text-anchor="middle" fill="#69536f"><text x="17" y="14">PET</text><text x="17" y="23">CARE</text><text x="40" y="6">VACCINE</text><text x="63" y="20">NEW</text><text x="63" y="29">PETS</text></g>'+
   '<path d="M3 45H77L72 76H8Z" fill="#f8f4ec" opacity=".9" stroke="#9ba9bf" stroke-width="2"/>'+
   '<text x="40" y="61" font-size="10" font-family="Arial,sans-serif" font-weight="800" fill="#766a89" text-anchor="middle">INFO</text>'+
   '</g>'+
   '<g transform="translate(280 336)"><path d="M-9 0Q0 -22 13 0Z" fill="#f4cb87" stroke="#c29962" stroke-width="3"/><rect x="-15" y="1" width="33" height="6" rx="3" fill="#bb9267"/><circle cx="1" cy="-16" r="4" fill="#d8ac68"/></g>'+
   '</g>'+
   // Architectural exterior picture window with visible dog-yard scenery.
   '<g aria-label="Glass viewing window into dog play yard">'+
   '<rect x="79" y="103" width="153" height="159" rx="12" fill="#fbf9ff" stroke="#9585ad" stroke-width="8"/>'+
   '<rect x="87" y="111" width="137" height="139" rx="6" fill="#dff3f3" stroke="#b8a3c9" stroke-width="2"/>'+
   '<image href="assets/reception/dog-yard-enrichment.svg?v=20261128-facility-depth-v7" x="89" y="113" width="133" height="134" preserveAspectRatio="xMidYMid slice" pointer-events="none"/>'+
   '<path d="M155 112V249M88 178H223" stroke="#fffaf9" stroke-width="5" opacity=".94"/>'+
   '<path d="M94 119L131 119L94 156Z M172 121L211 121L172 161Z" fill="#fff" opacity=".22"/>'+
   '<rect x="76" y="249" width="160" height="12" rx="5" fill="#e2d2e9" stroke="#a28db7" stroke-width="2"/>'+
   '<rect x="95" y="259" width="120" height="22" rx="10" fill="#fffdf7" stroke="#a28db7" stroke-width="2"/>'+
   '<text x="155" y="275" text-anchor="middle" font-size="11.5" font-weight="900" font-family="Trebuchet MS,Arial" fill="#645379">DOG PLAY YARD</text></g>'+
   // Cat corner is a glazed interior room with an entry door, visible from the lobby.
   '<g aria-label="Glass-front cat corner and entrance">'+
   '<rect x="827" y="102" width="127" height="211" rx="11" fill="#f6eef8" stroke="#9587af" stroke-width="8"/>'+
   // A mini view into the built Cat Studio: multi-level perches, two hides, scratch tower and toys.
   '<rect x="834" y="110" width="113" height="194" rx="5" fill="#f5eaf5"/>'+
   '<rect x="838" y="118" width="104" height="176" rx="4" fill="#f5eaf7"/>'+
   '<path d="M839 265Q884 253 943 265V300H839Z" fill="#d7c2de"/>'+
   '<path d="M844 164H938M847 217H932" stroke="#ac8dbb" stroke-width="7" stroke-linecap="round"/>'+
   '<path d="M859 166v41M916 166v40" stroke="#cfad87" stroke-width="8"/>'+
   '<path d="M852 186h28v14h-28ZM902 186h27v14h-27Z" fill="#ddc7b4" stroke="#b79292" stroke-width="1.5"/>'+
   '<path d="M852 236h37v36h-37Z" fill="#d3b8df" stroke="#a78db8" stroke-width="3"/>'+
   '<circle cx="871" cy="251" r="11" fill="#8a739b"/>'+
   '<rect x="899" y="226" width="33" height="49" rx="9" fill="#d6c3a9" stroke="#a78e86" stroke-width="3"/>'+
   '<path d="M902 231v37M908 230v40M914 230v40M920 230v40M926 230v39" stroke="#f4dfbb" stroke-width="1.4" stroke-dasharray="4 4"/>'+
   '<path d="M886 162v24M894 162v30" stroke="#9d80a9" stroke-width="2"/>'+
   '<circle cx="886" cy="191" r="6" fill="#a1cdd0"/><circle cx="895" cy="198" r="5" fill="#f0b3cb"/>'+
   // Fluffy cream cat lounging on the elevated left platform.
   '<g transform="translate(866 151)"><ellipse cx="0" cy="3" rx="15" ry="7" fill="#ebc7ab"/><path d="M-8 -4l-4-11 9 5 9-5 6 11" fill="#f7dbba"/><circle cy="-4" r="11" fill="#f7dbba"/><circle cx="-4" cy="-5" r="1.8" fill="#57475b"/><circle cx="4" cy="-5" r="1.8" fill="#57475b"/><path d="M-3 0q3 3 6 0" stroke="#aa8890" fill="none" stroke-width="1.3"/><path d="M11 5q9-4 9-13" fill="none" stroke="#e2b899" stroke-width="5" stroke-linecap="round"/></g>'+
   // Tuxedo kitty perched on the upper right platform.
   '<g transform="translate(920 151)"><ellipse cx="0" cy="4" rx="12" ry="7" fill="#54526b"/><path d="M-9-5l-3-11 8 5 7-5 8 11" fill="#4b4b63"/><circle cy="-5" r="11" fill="#4b4b63"/><path d="M-4-1l4 5 4-5" fill="#fff9f0"/><circle cx="-4" cy="-6" r="1.7" fill="#eef6a6"/><circle cx="4" cy="-6" r="1.7" fill="#eef6a6"/><path d="M10 5q10 0 8-12" fill="none" stroke="#4b4b63" stroke-width="4" stroke-linecap="round"/></g>'+
   // Orange tabby peeking from the middle shelf.
   '<g transform="translate(874 206)"><ellipse cx="0" cy="2" rx="12" ry="7" fill="#e9a36f"/><path d="M-9-5l-3-10 8 5 8-5 7 10" fill="#e9a36f"/><circle cy="-5" r="11" fill="#edb27b"/><path d="M-6-10l2 5M0-12v5M5-10l-2 5" stroke="#bc805f" stroke-width="1.8"/><circle cx="-4" cy="-6" r="1.7" fill="#594557"/><circle cx="4" cy="-6" r="1.7" fill="#594557"/><path d="M-3 0q3 3 6 0" stroke="#aa766f" fill="none" stroke-width="1.2"/></g>'+
   '<ellipse cx="928" cy="284" rx="10" ry="5" fill="#f2b5c9"/><path d="M921 280l12 9m0-9-12 9" stroke="#fff2f4" stroke-width="2"/>'+
   '<rect x="842" y="280" width="26" height="9" rx="4" fill="#bfdeca"/>'+
   '<path d="M853 280v-11m0 3q-9-9-10-4m10 2q7-10 11-4" fill="none" stroke="#73a18b" stroke-width="2"/>'+
   '<rect x="837" y="113" width="107" height="189" rx="5" fill="#d5f3f5" fill-opacity=".11" stroke="#fffdfc" stroke-width="4"/>'+
   '<path d="M895 113V303" stroke="#b9b0c8" stroke-width="5"/>'+
   '<path d="M842 119L865 119L842 176Z M904 121L937 121L904 181Z" fill="#fff" opacity=".25"/>'+
   '<circle cx="906" cy="233" r="5" fill="#c6a46f" stroke="#fffdf5" stroke-width="2"/>'+
   '<rect x="828" y="94" width="127" height="27" rx="10" fill="#fffdf8" stroke="#a993bc" stroke-width="3"/>'+
   '<text x="891" y="112" text-anchor="middle" font-family="Trebuchet MS,Arial" font-size="13" font-weight="900" fill="#665579">CAT CORNER</text></g>'+
   // Welcome notice without an unexplained paw-print ornament.
   '<g transform="translate(714 94)"><rect width="91" height="44" rx="11" fill="#fff9ee" stroke="'+c[4]+'" stroke-width="4"/><text x="45" y="19" font-size="12" font-family="Arial,sans-serif" font-weight="900" fill="#766a89" text-anchor="middle">WELCOME</text><text x="45" y="34" font-family="Arial,sans-serif" font-size="9" fill="#8c7797" text-anchor="middle">Check in here!</text></g>'+
   sofaVisual+plant+plantPair+catTree+catCarrier+dogCarrier+gallery+pawArt+
   flora+kids+decorations+holiday+rainbow+
   window.VPQ_RECEPTION_MODULAR_ASSETS.render(state,'isometric','nonrug')+
   '<g transform="translate(525 40) scale(1.2) translate(-500 -40)" aria-label="Vet Pharm Quest veterinary teaching hospital logo">'+
   '<rect x="374" y="13" width="252" height="54" rx="17" fill="#f8f0fb" stroke="#a78bbe" stroke-width="3"/>'+
   '<rect x="380" y="19" width="240" height="42" rx="13" fill="#fffdf8" stroke="#edd8e8" stroke-width="2"/>'+
   '<path d="M389 20Q500 10 611 20" fill="none" stroke="#e8a8c7" stroke-width="3" stroke-linecap="round"/>'+
   '<g transform="translate(399 40)"><circle r="15" fill="#d9f2e7" stroke="#97c8b9" stroke-width="1.5"/><path d="M-3 -10H3V-3H10V3H3V10H-3V3H-10V-3H-3Z" fill="#5a9c93"/><path d="M-7 9Q0 14 7 9" fill="none" stroke="#ffffff" stroke-width="1.5"/></g>'+
   '<g transform="translate(601 40)"><circle r="15" fill="#fbe4ed" stroke="#e2b5cf" stroke-width="1.5"/><path d="M-8 1Q-8 -6 -2 -7Q2 -7 3 -2Q5 -7 9 -5Q14 2 3 10L0 12L-3 9Q-9 5 -8 1Z" fill="#d887ac"/><path d="M-2 2H2M0 0V4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></g>'+
   '<text x="500" y="38" text-anchor="middle" font-size="19" font-weight="900" font-family="Trebuchet MS,Arial,sans-serif" letter-spacing=".45" fill="#405c81">VET PHARM QUEST</text>'+
   '<path d="M435 44H565" stroke="#e6c7dd" stroke-width="1.3"/>'+
   '<text x="500" y="55" text-anchor="middle" font-size="9.6" font-weight="800" font-family="Trebuchet MS,Arial,sans-serif" letter-spacing="1.1" fill="#98749f">TEACHING HOSPITAL</text></g>'+

   '</svg>';
 }
 sceneArt.roomArt=function(key){return key==='reception'&&state.receptionView==='isometric'?drawing():previousArt(key)};
 // Existing nearest-station E interaction follows these spatial coordinates.
 rooms.reception.props=[
  {x:15,emoji:'🛎️',label:'Front Desk',action:'welcome',bubble:'Check in'},
  {x:32,emoji:'📋',label:'Patient Queue',action:'queue',bubble:'Patients'},
  {x:51,emoji:'🚪',label:'Clinical Hall',action:'vpqGoExam',bubble:'Exam rooms'},
  {x:73,emoji:'💊',label:'Pharmacy',action:'vpqGoPharmacy',bubble:'Medications'},
  {x:88,emoji:'📚',label:'Study Lounge',action:'vpqGoStudy',bubble:'Study'}
 ];
 const jump={vpqGoExam:'exam',vpqGoPharmacy:'pharmacy',vpqGoStudy:'study'};
 function action(name){if(jump[name])return changeRoom(jump[name]);return doAction(name)}
 function refresh(){
  stage.querySelector('#vpqShadowHotspots')?.remove();
  if(stage.dataset.room!=='reception'||state.receptionView!=='isometric')return;
  const node=document.createElement('div');node.id='vpqShadowHotspots';
  const hotspots=[
   ['front','Open patient list on reception computer','queue'],
   ['exam','Enter the examination room','vpqGoExam'],
   ['clinical','Enter the main clinical hallway','vpqGoHallway'],
   ['pharmacy','Enter pharmacy and drug shelves','vpqGoPharmacy'],
   ['studio','Customize waiting room · Reception Studio','receptionStudio']
  ];
  node.innerHTML=hotspots.map(([id,label,name])=>'<button type="button" class="vpqShadowHotspot vpqShadow-'+id+'" data-shadowaction="'+name+'" aria-label="'+label+'" title="'+label+'"><span>'+({front:'↗',exam:'↗',clinical:'↗',pharmacy:'↗',studio:'🎨 Decorate'}[id])+'</span></button>').join('');
  node.addEventListener('click',ev=>{const button=ev.target.closest('[data-shadowaction]');if(button)action(button.dataset.shadowaction)});
  stage.appendChild(node);
 }
 const css=document.createElement('style');
 css.textContent=
 '.vpqShadowboxArt{position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none}'+
 '.stage[data-room="reception"][data-reception-view="isometric"] .roomdecor,.stage[data-room="reception"][data-reception-view="isometric"] .prop{display:none!important}'+
 '.stage[data-room="reception"][data-reception-view="isometric"] .interactToast{font-size:11px;max-width:75%;background:#fffdf4f0}'+
 '#vpqShadowHotspots{position:absolute;inset:0;z-index:5;pointer-events:none}'+
 '.vpqShadowHotspot{position:absolute;display:block;pointer-events:auto;background:transparent;border:2px solid transparent;border-radius:12px;padding:0;color:#29445a;box-shadow:none;transform:none!important}'+
 '.vpqShadowHotspot span{position:absolute;left:50%;bottom:-2px;transform:translate(-50%,100%);white-space:nowrap;display:block;background:#fff9edeb;border:1px solid #b7c8d3;border-radius:15px;padding:3px 8px;font-size:10px;font-weight:800;box-shadow:0 3px 4px #384e5b22}'+
 '.vpqShadowHotspot:hover,.vpqShadowHotspot:focus-visible{border-color:#e8bd65;background:#fff9d50c;outline:1px solid #fff9ed;outline-offset:0;box-shadow:0 0 6px #f5d98777}'+
 '.vpqShadow-front{left:17%;top:52%;width:13%;height:18%;border-radius:9px}.vpqShadow-front span{position:absolute!important;left:auto!important;right:-7px!important;top:-8px!important;bottom:auto!important;transform:none!important;display:grid!important;place-items:center!important;width:20px!important;height:20px!important;padding:0!important;border-radius:50%!important;font-size:12px!important;line-height:1!important;color:#5e537c!important;background:#fffdf6f0!important;border:1px solid #ad9abe!important;box-shadow:0 2px 5px #51486d38!important}.vpqShadow-front:hover,.vpqShadow-front:focus-visible{border-color:#b2a2c7!important;outline:1px solid #fefdfc!important;background:#e7f5f510!important}.vpqShadow-front.vpqApproachNear{border-color:#b2a2c7!important;outline:none!important;box-shadow:0 0 4px #aea0c866!important;background:transparent!important}.vpqShadow-front.vpqApproachNear:after{display:none!important}' +
 
 '.vpqShadow-exam{left:24.6%;top:23%;width:15%;height:35%}.vpqShadow-clinical{left:48.6%;top:31.5%;width:7.1%;height:11%;border-radius:7px}.vpqShadow-pharmacy{left:67%;top:23%;width:15%;height:33%}'+
 '.vpqShadow-exam span,.vpqShadow-clinical span,.vpqShadow-pharmacy span{left:auto!important;right:3px!important;top:3px!important;bottom:auto!important;transform:none!important;display:grid!important;place-items:center!important;width:20px!important;height:20px!important;padding:0!important;border:1px solid #ad9abe!important;border-radius:50%!important;background:#fffdf6e8!important;color:#5e537c!important;font-size:12px!important;box-shadow:0 2px 5px #51486d33!important}'+
 '.vpqShadow-exam:hover,.vpqShadow-clinical:hover,.vpqShadow-pharmacy:hover{border-color:#aa9cc1!important;background:#ffffff0d!important;box-shadow:0 0 4px #b9a4d560!important;outline:none!important}'+
 '.vpqShadow-clinical span{right:-7px!important;top:-8px!important;width:17px!important;height:17px!important;font-size:10px!important}'+
 '.vpqShadow-clinical:hover,.vpqShadow-clinical:focus-visible,.vpqShadow-clinical.vpqApproachNear{border:1px solid #a99cba!important;background:#ffffff08!important;outline:none!important;box-shadow:0 0 3px #ac9bb655!important;filter:none!important}'+
 '.vpqShadow-clinical.vpqApproachNear:after{display:none!important;content:none!important}'+
 '.vpqShadow-studio{right:1%;top:3%;width:16%;height:9%;border-radius:12px;background:#fff8edbb}.vpqShadow-studio span{bottom:0;transform:translate(-50%,0);font-size:11px}'+
 '@media(max-width:600px){.vpqShadowHotspot span{font-size:9px;padding:3px 5px}.vpqShadow-front span,.vpqShadow-patients span{bottom:15%}}';
 document.head.appendChild(css);
 // Add to every subsequent render, not the old 2D fallback.
 const observer=new MutationObserver(()=>{if(stage.dataset.room==='reception'&&state.receptionView==='isometric'&&!stage.querySelector('#vpqShadowHotspots'))refresh();else if((stage.dataset.room!=='reception'||state.receptionView!=='isometric')&&stage.querySelector('#vpqShadowHotspots'))refresh()});
 observer.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room','data-reception-view']});
 refresh();
 return {refresh,drawing};
};