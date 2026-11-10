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
 'wall-winter':['#eaf5fb','#bbd8e8','#8cacc9','#dcecf4','#9db9ce']
 };
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function drawing(){
  const bag=state.receptionCollection||{},c=palette[bag.equippedWall]||palette['paint-peach'];
  const placed=Array.isArray(bag.placed)?bag.placed:[];
  const has=id=>placed.includes(id);
  const flora=has('decor-cat')?'<g transform="translate(24 282)"><rect x="10" y="42" width="98" height="65" rx="13" fill="#e2bfd1" stroke="#947e9e" stroke-width="5"/><text x="59" y="88" font-size="37" text-anchor="middle">🐈</text><path d="M-3 110h127" stroke="#a98ea8" stroke-width="12"/></g>':'<g transform="translate(34 318)"><rect width="96" height="36" rx="16" fill="#d8c8d9"/><text x="48" y="28" font-size="26" text-anchor="middle">🐾</text></g>';
  const kids=has('decor-kids')?'<g transform="translate(829 310)"><rect width="116" height="63" rx="15" fill="#f5debb" stroke="#d6b7a7" stroke-width="5"/><text x="57" y="44" font-size="36" text-anchor="middle">🧸</text></g>':'<g transform="translate(865 331)"><rect x="0" y="18" width="64" height="38" rx="11" fill="#f4dfdf" stroke="#c5a5c0" stroke-width="4"/><text x="32" y="43" text-anchor="middle" font-size="24">🐾</text></g>';
  const decorations=has('decor-pumpkin')?'<text x="824" y="404" font-size="31">🎃</text>':'';
  const holiday=has('decor-holiday')?'<text x="881" y="85" font-size="25">✨</text>':'';
  const rainbow=has('decor-rainbow')?'<text x="105" y="129" font-size="28">🌈</text>':'';

  // Sofas are rendered as actual cushioned furniture, with a single equipped style.
  const sofa=placed.includes('seat-sofa-sage')?['#8cbda8','#679a8e','#c2e4d4']:placed.includes('seat-sofa-blue')?['#83b2d8','#5f90bc','#b4d7eb']:['#b8a2d7','#8f7bb7','#e4d5ee'];
  const couch='<g transform="translate(794 336)">'+
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
  const plant=has('decor-planter')?'<g transform="translate(943 268)"><path d="M-4 50h47l-9 48H7Z" fill="#c9a98e" stroke="#997d73" stroke-width="5"/><path d="M19 50V-16M19 20Q-21 -12 -29 13M19 3Q45 -27 66 -7M19 32Q49 10 69 26" fill="none" stroke="#609a78" stroke-width="8"/><ellipse cx="-24" cy="8" rx="18" ry="9" fill="#8ac09b"/><ellipse cx="57" cy="-8" rx="21" ry="10" fill="#83b995"/><ellipse cx="58" cy="24" rx="19" ry="10" fill="#77ad8d"/></g>':'';
  const plantPair=has('decor-plant-pair')?'<g><g transform="translate(722 302)"><path d="M0 22h49l-8 47H8Z" fill="#d8b396"/><path d="M24 25V-34M24 -3Q-3 -22 -22 -12M24 -23Q45 -49 65 -32" fill="none" stroke="#649b72" stroke-width="9"/><ellipse cx="-19" cy="-13" rx="17" ry="9" fill="#84bb94"/><ellipse cx="64" cy="-32" rx="18" ry="10" fill="#89c39c"/></g><g transform="translate(946 389) scale(.65)"><path d="M0 22h49l-8 47H8Z" fill="#e1c3ab"/><path d="M24 25V-34M24 -3Q-3 -22 -22 -12M24 -23Q45 -49 65 -32" fill="none" stroke="#649b72" stroke-width="9"/><ellipse cx="-19" cy="-13" rx="17" ry="9" fill="#84bb94"/><ellipse cx="64" cy="-32" rx="18" ry="10" fill="#89c39c"/></g></g>':'';
  const catTree=has('decor-cat-tree')?'<g transform="translate(848 244)"><path d="M25 50v108M88 39v115" stroke="#bda18e" stroke-width="17"/><path d="M7 54h113v12H7Z" fill="#ceb7a0"/><path d="M18 103h95v15H18Z" fill="#d6bca8"/><rect x="22" y="121" width="82" height="48" rx="16" fill="#dfc8bb" stroke="#a98d83" stroke-width="5"/><circle cx="63" cy="142" r="18" fill="#876b6c"/><path d="M6 43Q22 28 45 39L61 45V56H6ZM67 23Q91 5 112 28v16H67Z" fill="#ddc8b0" stroke="#ae9587" stroke-width="4"/><text x="77" y="16" font-size="23">🐈</text></g>':'';
  const catCarrier=has('decor-carrier')?'<g transform="translate(683 408)"><path d="M4 13h95l14 54H0Z" fill="#ded4e8" stroke="#8f89ad" stroke-width="5"/><path d="M28 14Q29 -7 52 -7Q76 -7 80 14" stroke="#8e88ad" stroke-width="7" fill="none"/><rect x="22" y="28" width="69" height="31" rx="6" fill="#68778b"/><path d="M33 31V57M47 30V59M62 30V59M76 30V59" stroke="#dce6e9" stroke-width="4"/><circle cx="9" cy="70" r="7" fill="#7e7393"/><circle cx="102" cy="70" r="7" fill="#7e7393"/><text x="58" y="50" text-anchor="middle" font-size="19">🐱</text></g>':'';
  const dogCarrier=has('decor-dog-carrier')?'<g transform="translate(702 438)"><rect width="100" height="43" rx="8" fill="#b7d1d0" stroke="#6d9193" stroke-width="5"/><path d="M8 4V37M28 4V37M48 4V37M68 4V37M88 4V37" stroke="#72989d" stroke-width="4"/><path d="M23 1Q50 -26 77 1" fill="none" stroke="#78989c" stroke-width="6"/><text x="51" y="31" text-anchor="middle" font-size="23">🐶</text></g>':'';
  const gallery=has('decor-pet-art')?'<g><g transform="translate(95 98)"><rect width="55" height="58" rx="4" fill="#fff6e7" stroke="#b49d94" stroke-width="5"/><text x="28" y="40" text-anchor="middle" font-size="31">🐶</text></g><g transform="translate(160 98)"><rect width="55" height="58" rx="4" fill="#fff6e7" stroke="#b49d94" stroke-width="5"/><text x="28" y="40" text-anchor="middle" font-size="31">🐱</text></g></g>':'';
  const pawArt=has('decor-paw-art')?'<g opacity=".62" font-size="29"><text x="636" y="91">🐾</text><text x="615" y="126">🐾</text><text x="645" y="165">🐾</text></g>':'';

  return '<svg class="vpqShadowboxArt" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-label="Perspective veterinary reception with front desk and a short hallway to the exam room, pharmacy and study lounge" role="img">'+
   '<defs><linearGradient id="vpqShadowFloor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="'+c[3]+'"/><stop offset="1" stop-color="#c5b1ad"/></linearGradient><linearGradient id="vpqShadowHall" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7e8a9e"/><stop offset="1" stop-color="#d7cbd6"/></linearGradient><filter id="vpqShadowAmbient" x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="10"/></filter></defs>'+
   // ceiling, thick sidewalls, back wall; shadowbox edges
   '<rect width="1000" height="500" fill="'+c[1]+'"/>'+
   '<polygon points="0,0 1000,0 932,52 68,52" fill="#fffdf7"/>'+
   '<polygon points="0,0 68,52 68,320 0,394" fill="'+c[2]+'"/>'+
   '<polygon points="932,52 1000,0 1000,394 932,320" fill="'+c[2]+'"/>'+
   '<rect x="68" y="52" width="864" height="268" fill="'+c[0]+'"/>'+
   '<path d="M68 52H932M68 320H932" stroke="'+c[4]+'" stroke-width="10" opacity=".65"/>'+
   // main hall recedes to a tiny rear study entrance
   '<path d="M419 130L465 87H579L623 130V315H419Z" fill="url(#vpqShadowHall)" stroke="#79778c" stroke-width="12"/>'+
   '<path d="M451 143L475 104H572L593 143V308H451Z" fill="#c6b9ca" stroke="#f9e7d4" stroke-width="5"/>'+
   '<path d="M475 104L451 143V308L475 263Z M572 104L593 143V308L572 263Z" fill="#9487a0"/>'+
   '<path d="M475 263L451 308H593L572 263Z" fill="#e8d4c1"/>'+
   '<path d="M487 137H562V265H487Z" fill="#8eaca9" stroke="#597b80" stroke-width="6"/>'+
   '<rect x="497" y="161" width="56" height="45" rx="5" fill="#e5f6f6"/>'+
   '<text x="525" y="178" text-anchor="middle" font-size="13" font-family="sans-serif" font-weight="800" fill="#315b69">CLINIC</text>'+
   '<text x="525" y="193" text-anchor="middle" font-size="12" font-family="sans-serif" fill="#315b69">HALL</text>'+
   '<circle cx="551" cy="224" r="5" fill="#e6bd67"/>'+
   // floor trapezoid + grout projecting toward viewer
   '<path d="M68 320H932L1000 500H0Z" fill="url(#vpqShadowFloor)"/>'+
   '<path d="M68 320L0 500M932 320L1000 500 M224 320L178 500 M377 320L362 500M525 320V500 M673 320L693 500M824 320L872 500 M44 425H957 M59 360H942" fill="none" stroke="#fff7ef" stroke-width="3" opacity=".65"/>'+
   '<ellipse cx="494" cy="344" rx="240" ry="26" fill="#695e6d" opacity=".19" filter="url(#vpqShadowAmbient)"/>'+
   // clinical hall doorway (left), pharmacy doorway (right)
   '<g><rect x="243" y="109" width="151" height="208" rx="8" fill="#668c9d" stroke="#567989" stroke-width="12"/><rect x="260" y="124" width="119" height="180" fill="#cbe4e7"/><path d="M263 125L380 125L367 155H275Z" fill="#effbfa" opacity=".75"/><rect x="266" y="149" width="107" height="47" rx="8" fill="#fffaf1" stroke="#a4c4ce" stroke-width="3"/><text x="320" y="169" text-anchor="middle" font-size="16" font-weight="800" font-family="sans-serif" fill="#35596f">CLINICAL</text><text x="320" y="186" text-anchor="middle" font-size="14" font-weight="700" font-family="sans-serif" fill="#35596f">HALL</text><rect x="275" y="223" width="89" height="62" rx="7" fill="#e6f2f1"/><text x="319" y="263" text-anchor="middle" font-size="31">🩺</text></g>'+
   '<g><rect x="669" y="109" width="148" height="208" rx="8" fill="#8e9bad" stroke="#687f99" stroke-width="12"/><rect x="685" y="124" width="116" height="180" fill="#dbecda"/><rect x="690" y="149" width="105" height="47" rx="8" fill="#fffaf1" stroke="#bdd6c1" stroke-width="3"/><text x="742" y="178" text-anchor="middle" font-size="17" font-weight="800" font-family="sans-serif" fill="#426a60">PHARMACY</text><rect x="698" y="216" width="89" height="69" rx="7" fill="#f0faf0"/><text x="742" y="261" text-anchor="middle" font-size="34">💊</text></g>'+
   // dimensional front desk on foreground left
   '<ellipse cx="230" cy="411" rx="203" ry="28" fill="#4f4e65" opacity=".21" filter="url(#vpqShadowAmbient)"/>'+
   '<g><path d="M30 333L109 298H341L419 333L347 360H95Z" fill="#fff6e8" stroke="#b88f81" stroke-width="6"/>'+
   '<path d="M95 360H347V440H95Z" fill="#b8d5de" stroke="#7b9caa" stroke-width="7"/>'+
   '<path d="M30 333L95 360V440L30 398Z" fill="#88aebb" stroke="#7194a0" stroke-width="6"/>'+
   '<path d="M347 360L419 333V400L347 440Z" fill="#88afbb" stroke="#7194a0" stroke-width="6"/>'+
   '<rect x="151" y="377" width="151" height="43" rx="10" fill="#f4f9f5" stroke="#91bac3" stroke-width="4"/>'+
   '<text x="227" y="404" text-anchor="middle" font-size="20" font-weight="800" font-family="sans-serif" fill="#486b80">CHECK IN</text>'+
   '<rect x="169" y="267" width="82" height="58" rx="7" fill="#536d82"/><rect x="176" y="273" width="69" height="43" fill="#bde9ed"/><path d="M204 325v13h16v-13" stroke="#627e92" stroke-width="7"/>'+
   '<rect x="103" y="301" width="51" height="22" rx="5" fill="#fdf5e3" stroke="#cebdb0" stroke-width="3"/><path d="M117 302h24" stroke="#89b3a0" stroke-width="4"/>'+
   '<path d="M284 312q13-18 26 0v6h-26Z" fill="#e4b164"/><circle cx="297" cy="298" r="5" fill="#e4b164"/><rect x="270" y="317" width="56" height="6" rx="3" fill="#a78868"/></g>'+
   // wall notice and patient chairs, corners
   '<g transform="translate(86 138)"><rect width="128" height="97" rx="10" fill="#fff9ee" stroke="'+c[4]+'" stroke-width="6"/><text x="64" y="23" text-anchor="middle" font-size="14" font-weight="800" font-family="sans-serif" fill="#5d667a">WELCOME</text><text x="64" y="52" text-anchor="middle" font-size="29">🐾</text><text x="64" y="73" text-anchor="middle" font-size="12" font-family="sans-serif" fill="#687990">Your clinic</text></g>'+
   couch+plant+plantPair+catTree+catCarrier+dogCarrier+gallery+pawArt+
   flora+kids+decorations+holiday+rainbow+
   '<text x="509" y="34" text-anchor="middle" font-size="20" font-weight="800" font-family="sans-serif" fill="#57667d">VET PHARM QUEST • RECEPTION</text>'+
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
   ['front','Front desk · check in','welcome'],
   ['patients','Patient queue · new patient cases','queue'],
   ['clinical','Enter clinical hall and examination room','vpqGoExam'],
   ['pharmacy','Enter pharmacy and drug shelves','vpqGoPharmacy'],
   ['study','Enter clinical hallway and clinic departments','vpqGoHallway'],
   ['studio','Customize waiting room · Reception Studio','receptionStudio']
  ];
  node.innerHTML=hotspots.map(([id,label,name])=>'<button type="button" class="vpqShadowHotspot vpqShadow-'+id+'" data-shadowaction="'+name+'" aria-label="'+label+'" title="'+label+'"><span>'+({front:'🛎️ Desk',patients:'📋 Patients',clinical:'Clinical Hall',pharmacy:'Pharmacy',study:'Clinic Hallway',studio:'🎨 Decorate'}[id])+'</span></button>').join('');
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
 '.vpqShadowHotspot:hover,.vpqShadowHotspot:focus-visible{border-color:#ffd980;background:#fff9d522;outline:2px solid #fff9ed;outline-offset:1px}'+
 '.vpqShadow-front{left:7%;top:65%;width:34%;height:24%}.vpqShadow-front span{left:26%;bottom:26%;transform:translate(-50%,0)}'+
 '.vpqShadow-patients{left:80%;top:66%;width:15%;height:19%}.vpqShadow-patients span{bottom:15%;transform:translate(-50%,0)}'+
 '.vpqShadow-clinical{left:24%;top:22%;width:15%;height:42%}.vpqShadow-pharmacy{left:67%;top:22%;width:15%;height:42%}.vpqShadow-study{left:47%;top:26%;width:12%;height:34%}'+
 '.vpqShadow-clinical span,.vpqShadow-pharmacy span,.vpqShadow-study span{bottom:7%;transform:translate(-50%,0)}'+
 '.vpqShadow-studio{right:1%;top:3%;width:16%;height:9%;border-radius:12px;background:#fff8edbb}.vpqShadow-studio span{bottom:0;transform:translate(-50%,0);font-size:11px}'+
 '@media(max-width:600px){.vpqShadowHotspot span{font-size:9px;padding:3px 5px}.vpqShadow-front span,.vpqShadow-patients span{bottom:15%}}';
 document.head.appendChild(css);
 // Add to every subsequent render, not the old 2D fallback.
 const observer=new MutationObserver(()=>{if(stage.dataset.room==='reception'&&state.receptionView==='isometric'&&!stage.querySelector('#vpqShadowHotspots'))refresh();else if((stage.dataset.room!=='reception'||state.receptionView!=='isometric')&&stage.querySelector('#vpqShadowHotspots'))refresh()});
 observer.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room','data-reception-view']});
 refresh();
 return {refresh,drawing};
};