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
 clinpath:'assets/rooms/advanced-clinpath.svg',
 isolation:'assets/rooms/isolation-one-health.svg',
 catcorner:'assets/rooms/cat-corner.svg',
 yardview:'assets/rooms/dog-play-yard.svg'
};
const css=document.createElement('style');
css.textContent='.vpqClinicBgImg{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;user-select:none;z-index:0}.vpqClinicDecorOverlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}.vpqStationOverlay{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;user-select:none}'+
Object.keys(assets).map(k=>'.stage[data-room="'+k+'"] .prop,.stage[data-room="'+k+'"] .roomBanner,.stage[data-room="'+k+'"] .roomdecor{display:none!important}').join(',');
document.head.appendChild(css);

/* Decorative image overlay: existing specialist hitboxes remain the only controls.
 * Each label is aligned to its corresponding room station; no reward/save logic changes.
 * Original SVG shapes and characters; easy to extend with additional room art later.
 */
const stationCards={
 skills:[
  {x:188,t:'INJECTION PRACTICE',sub:'Route & body region',icon:'💉',color:'#fce5f1',edge:'#dca5c8'},
  {x:495,t:'BLOOD DRAW',sub:'Venipuncture & tubes',icon:'🩸',color:'#e1f6fb',edge:'#8fc8d6'},
  {x:814,t:'SAMPLE HANDLING',sub:'Label • store • submit',icon:'🧪',color:'#eaf8e7',edge:'#abd5a5'}
 ],
 surgery:[
  {x:160,t:'STERILE PREP',sub:'Asepsis & safety',icon:'🧼',color:'#e6f7ed',edge:'#a4d5b7'},
  {x:391,t:'ANESTHESIA',sub:'Monitor & respond',icon:'💗',color:'#e9f3ff',edge:'#a7c4ee'},
  {x:631,t:'RECOVERY',sub:'Pain & perfusion',icon:'🐕',color:'#fff0e1',edge:'#e4be9e'},
  {x:867,t:'PATIENT CASES',sub:'Clinical decisions',icon:'📋',color:'#f7eafb',edge:'#d8bae8'}
 ],
 necropsy:[
  {x:160,t:'GROSS LESIONS',sub:'Describe patterns',icon:'🔎',color:'#fff0e4',edge:'#dfbea5'},
  {x:391,t:'HISTOLOGY',sub:'Tissue & cells',icon:'🔬',color:'#e4f5fb',edge:'#9dc9d8'},
  {x:631,t:'BIOSECURITY',sub:'PPE & sampling',icon:'🧤',color:'#e8f9ed',edge:'#9ed3b5'},
  {x:867,t:'PATIENT CASES',sub:'Find the cause',icon:'🐾',color:'#f9eafb',edge:'#d7b8df'}
 ]
};
function stationOverlay(room){
 const cards=stationCards[room];if(!cards)return '';
 const narrow=cards.length===4;
 const w=narrow?204:256;
 const art=cards.map(c=>{
  const x=c.x-w/2;
  return '<g>'+
   '<rect x="'+x+'" y="365" width="'+w+'" height="78" rx="21" fill="'+c.color+'" stroke="'+c.edge+'" stroke-width="5" opacity=".97"/>'+
   '<rect x="'+(x+8)+'" y="372" width="'+(w-16)+'" height="62" rx="16" fill="#ffffff" opacity=".84"/>'+
   '<circle cx="'+(x+34)+'" cy="403" r="26" fill="'+c.color+'" stroke="'+c.edge+'" stroke-width="2"/>'+
   '<text x="'+(x+34)+'" y="416" text-anchor="middle" font-size="32">'+c.icon+'</text>'+
   '<text x="'+(x+65)+'" y="400" font-family="Trebuchet MS,Arial,sans-serif" font-size="'+(narrow?15:18)+'" font-weight="900" fill="#465874">'+c.t+'</text>'+
   '<text x="'+(x+65)+'" y="421" font-family="Trebuchet MS,Arial,sans-serif" font-size="'+(narrow?12:14)+'" font-weight="700" fill="#6b7387">'+c.sub+'</text>'+
   '</g>';
 }).join('');
 const skillsExtras=room==='skills'?
  '<g aria-hidden="true" opacity=".95">'+
  '<rect x="89" y="204" width="98" height="37" rx="17" fill="#fff2fb" stroke="#dba8cb" stroke-width="4"/>'+
  '<text x="138" y="228" text-anchor="middle" font-size="16" font-weight="900" fill="#a66795">SC • IM • IV</text>'+
  '<rect x="392" y="204" width="177" height="37" rx="17" fill="#edfbff" stroke="#8fc4d4" stroke-width="4"/>'+
  '<text x="480" y="228" text-anchor="middle" font-size="16" font-weight="900" fill="#5b93a9">SITE • TUBE • ORDER</text>'+
  '<rect x="736" y="204" width="169" height="37" rx="17" fill="#f1ffef" stroke="#a6cfa7" stroke-width="4"/>'+
  '<text x="820" y="228" text-anchor="middle" font-size="16" font-weight="900" fill="#739b74">ID • LABEL • TEMP</text>'+
  '</g>':'';
 return '<svg class="vpqStationOverlay" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">'+skillsExtras+art+'</svg>';
}

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
 return '<img class="vpqClinicBgImg" src="'+file+'?v=20261110-cute-images3" alt="Illustrated veterinary '+room+' environment with interactive equipment" draggable="false">'+stationOverlay(room)+habitatDecor(room);
};
return Object.freeze({assets});
};