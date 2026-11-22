/* Vet Pharm Quest — shared 2.5-D hospital movement.
 * A single depth model for every walkable hospital room.
 * W/S and Up/Down change the floor depth; A/D and Left/Right continue to
 * use the existing horizontal navigation and E keeps its existing action.
 * This code does not modify progression, case routing, saved companions, or rooms.
 */
(function(){
'use strict';
function start(){
 const stage=document.getElementById('stage');
 const avatar=document.getElementById('avatarSprite');
 const pet=document.getElementById('petSprite');
 if(!stage||!avatar||window.VPQ_HOSPITAL_DEPTH)return;
 const roomDepths=Object.create(null);
 let currentRoom='', held=0,depth=.72,last=0,frame=0;
 const min=.05,max=.98;
 function room(){
  return stage.dataset.room||'reception';
 }
 function blocked(e){
  const node=e?.target;
  if(node?.closest?.('input,textarea,select,[contenteditable="true"],[role="textbox"]'))return true;
  return !!document.querySelector('dialog[open],.modal.show,.modal.visible,.modal[aria-hidden="false"]');
 }
 function syncRoom(){
  const r=room();
  if(r!==currentRoom){
   if(currentRoom)roomDepths[currentRoom]=depth;
   currentRoom=r;
   depth=Object.prototype.hasOwnProperty.call(roomDepths,r)?roomDepths[r]:.72;
   held=0;
  }
 }
 function render(){
  syncRoom();
  // A character near the back wall is smaller. A near character is full size.
  // The foot position follows the floor, keeping the wall apparatus visible.
  const h=Math.round(161+depth*91);
  avatar.style.setProperty('--vpq-depth-height',h+'px');
  avatar.style.setProperty('--vpq-depth-width',Math.round(h*.55)+'px');
  avatar.style.setProperty('--vpq-depth-bottom',(27-depth*24)+'%');
  pet?.style.setProperty('--vpq-depth-pet-bottom',(24-depth*21)+'%');
  pet?.style.setProperty('--vpq-depth-pet-scale',(0.68+depth*.51).toFixed(3));
  stage.dataset.depthBand=depth<.35?'back':depth>.7?'front':'middle';
 }
 function key(e,down){
  const k=String(e.key||'').toLowerCase();
  if(!['w','s','arrowup','arrowdown'].includes(k))return;
  if(blocked(e))return;
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  e.preventDefault();
  if(down)held=(k==='w'||k==='arrowup')?-1:1;
  else if(held===((k==='w'||k==='arrowup')?-1:1))held=0;
 }
 document.addEventListener('keydown',e=>key(e,true),true);
 document.addEventListener('keyup',e=>key(e,false),true);
 window.addEventListener('blur',()=>held=0);
 const style=document.createElement('style');
 style.id='vpqSharedHospitalDepthStyles';
 style.textContent=
  '.stage #avatarSprite{display:block!important;visibility:visible!important;opacity:1!important;position:absolute!important;width:var(--vpq-depth-width,230px)!important;height:var(--vpq-depth-height,230px)!important;bottom:var(--vpq-depth-bottom,8%)!important;transform-origin:center bottom;transition:left .08s linear,bottom .11s linear,height .11s linear,width .11s linear;filter:drop-shadow(2px 5px 3px #435d7240);z-index:11!important}'+
  '.stage #avatarSprite.vpq-portrait-walk .vpq-game-avatar{width:100%!important;height:100%!important;left:0!important;bottom:0!important;position:absolute!important;display:block!important;overflow:visible!important}'+
  '.stage #avatarSprite .vpq-game-avatar img,.stage #avatarSprite .vpq-game-avatar svg,.stage #avatarSprite .vpq-game-avatar .vpq-standing-art,.stage #avatarSprite .vpq-game-avatar .vpq-art-sprite{width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;object-position:center bottom!important}'+
  '.stage #petSprite{bottom:var(--vpq-depth-pet-bottom,7%)!important;transform:scale(var(--vpq-depth-pet-scale,1))!important;transform-origin:center bottom;transition:bottom .11s linear,transform .11s linear;z-index:8!important}'+
  '.stage #avatarSprite.left{transform:scaleX(-1)}'+
  '#stage[data-room="reception"][data-reception-view="isometric"] #avatarSprite{transform:none!important;bottom:var(--vpq-depth-bottom,8%)!important}'+
  '#stage[data-room="reception"][data-reception-view="isometric"] #avatarSprite.left{transform:scaleX(-1)!important}'+
  '@media(max-width:600px){.stage #avatarSprite{width:calc(var(--vpq-depth-width,230px) * .83)!important;height:calc(var(--vpq-depth-height,230px) * .83)!important}}';
 document.head.appendChild(style);
 function tick(now){
  syncRoom();
  const dt=last?Math.min(40,now-last):16;
  last=now;
  if(held&&!document.querySelector('dialog[open],.modal.show,.modal.visible,.modal[aria-hidden="false"]')){
   depth=Math.max(min,Math.min(max,depth+held*dt*.00063));
   roomDepths[currentRoom]=depth;
  }
  // Updating every few frames avoids needless inline styles every animation frame.
  if(held||++frame%5===0)render();
  requestAnimationFrame(tick);
 }
 render();requestAnimationFrame(tick);
 window.VPQ_HOSPITAL_DEPTH={version:'2026-11-21-shared-2',getDepth:()=>depth,setDepth(value){depth=Math.max(min,Math.min(max,Number(value)||.72));render();},resetRoom(){depth=.72;roomDepths[room()]=depth;render();}};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
else start();
})();
