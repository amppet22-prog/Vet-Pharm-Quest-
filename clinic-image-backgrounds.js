/* Image-backed clinic rooms — artwork is independent from gameplay hit areas.
 * Actual SVG image assets in assets/rooms are displayed using <img>.
 * Existing hotspot, E-key, save and reward layers remain authoritative.
 */
window.VPQ_IMAGE_BACKGROUNDS=function(api){
'use strict';
const original=window.VPQ_SCENERY.roomArt.bind(window.VPQ_SCENERY);
const assets={
 skills:'assets/rooms/clinical-skills.svg',
 hallway:'assets/rooms/clinical-hallway.svg',
 surgery:'assets/rooms/surgery-suite.svg',
 necropsy:'assets/rooms/necropsy-floor.svg',
 catcorner:'assets/rooms/cat-corner.svg',
 yardview:'assets/rooms/dog-play-yard.svg'
};
const css=document.createElement('style');
css.textContent='.vpqClinicBgImg{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;user-select:none;z-index:0}.vpqClinicDecorOverlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}'+
Object.keys(assets).map(k=>'.stage[data-room="'+k+'"] .prop,.stage[data-room="'+k+'"] .roomBanner,.stage[data-room="'+k+'"] .roomdecor{display:none!important}').join(',');
document.head.appendChild(css);
function habitatDecor(room){
 const placed=api?.state?.receptionHabitats?.placed||[];
 const art=[];
 if(room==='catcorner'){
  if(placed.includes('cat-tree'))art.push('<rect x="405" y="228" width="22" height="145" rx="8" fill="#b9a58f"/><rect x="354" y="224" width="127" height="16" rx="7" fill="#cfaccf"/><rect x="378" y="170" width="91" height="15" rx="8" fill="#d7badd"/><ellipse cx="424" cy="162" rx="32" ry="15" fill="#e9cee6"/><text x="395" y="150" font-size="32">🐈</text>');
  if(placed.includes('cat-wall'))art.push('<path d="M696 208h75M777 167h86M855 137h72" stroke="#ceacd2" stroke-width="15" stroke-linecap="round"/>');
  if(placed.includes('cat-toys'))art.push('<text x="260" y="399" font-size="42">🧶</text><text x="647" y="398" font-size="41">🪶</text>');
  if(placed.includes('cat-extra'))art.push('<text x="556" y="275" font-size="56">🐈</text><text x="775" y="316" font-size="49">🐈</text>');
 }
 if(room==='yardview'){
  if(placed.includes('yard-toys'))art.push('<text x="452" y="328" font-size="44">🎾</text><text x="834" y="335" font-size="40">🦴</text>');
  if(placed.includes('yard-agility'))art.push('<path d="M414 296l44 -57 49 57" stroke="#d6ac86" stroke-width="17" fill="none"/><rect x="739" y="290" width="113" height="37" rx="19" fill="#a1c8e5" stroke="#83b1d6" stroke-width="5"/>');
 }
 return art.length?'<svg class="vpqClinicDecorOverlay" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">'+art.join('')+'</svg>':'';
}
window.VPQ_SCENERY.roomArt=function(room){
 const file=assets[room];
 if(!file)return original(room);
 return '<img class="vpqClinicBgImg" src="'+file+'?v=20261110-cute-images2" alt="Illustrated veterinary '+room+' environment with interactive equipment" draggable="false">'+habitatDecor(room);
};
return Object.freeze({assets});
};