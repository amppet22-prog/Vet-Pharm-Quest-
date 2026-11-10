/* Image-backed clinic rooms — artwork is independent from gameplay hit areas.
 * Actual SVG image assets in assets/rooms are displayed using <img>.
 * Existing hotspot, E-key, save and reward layers remain authoritative.
 */
window.VPQ_IMAGE_BACKGROUNDS=function(){
'use strict';
const original=window.VPQ_SCENERY.roomArt.bind(window.VPQ_SCENERY);
const assets={
 skills:'assets/rooms/clinical-skills.svg',
 hallway:'assets/rooms/clinical-hallway.svg',
 surgery:'assets/rooms/surgery-suite.svg',
 necropsy:'assets/rooms/necropsy-floor.svg'
};
const css=document.createElement('style');
css.textContent='.vpqClinicBgImg{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;user-select:none;z-index:0}'+
Object.keys(assets).map(k=>'.stage[data-room="'+k+'"] .prop,.stage[data-room="'+k+'"] .roomBanner,.stage[data-room="'+k+'"] .roomdecor{display:none!important}').join(',');
document.head.appendChild(css);
window.VPQ_SCENERY.roomArt=function(room){
 const file=assets[room];
 if(!file)return original(room);
 return '<img class="vpqClinicBgImg" src="'+file+'?v=20261110-cute-images1" alt="Illustrated veterinary '+room+' environment with interactive equipment" draggable="false">';
};
return Object.freeze({assets});
};