/* Vet Pharm Quest — replaceable cosmetic illustration layers.
 * The room remains the existing interactive scene. We only attach decorative
 * transparent images in stable positions above scenery and below hit targets.
 * Assets can be swapped for approved transparent PNG/WebP/SVG by editing src.
 */
window.VPQ_RECEPTION_IMAGE_LAYERS=function(api){
'use strict';
const stage=document.getElementById('stage');
if(!stage)return null;
const art={
 'decor-planter':{src:'assets/reception/decor-planter.svg',slot:{classic:[84,46,13,41],isometric:[91,44,11,37]},label:'Leafy terracotta floor planter'},
 'decor-pumpkin':{src:'assets/reception/decor-pumpkin.svg',slot:{classic:[74,70,10,21],isometric:[76,69,11,23]},label:'Smiling autumn pumpkin'},
 'decor-cat-tree':{src:'assets/reception/decor-cat-tree.svg',slot:{classic:[10,42,18,49],isometric:[76,38,17,47]},label:'Pastel cat tree with cat and toys'}
};
const style=document.createElement('style');
style.textContent='#vpqReceptionImageLayers{position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden}'+
'.vpqDecorImage{position:absolute;object-fit:contain;pointer-events:none;filter:drop-shadow(0px 6px 4px #54475b28)}'+
'.stage[data-room="reception"] #vpqReceptionImageLayers img{user-select:none}'+
'@media(max-width:600px){.vpqDecorImage{filter:drop-shadow(0 3px 3px #54475b24)}}';
document.head.appendChild(style);
let signature='';
function update(){
 const room=stage.dataset.room,old=stage.querySelector('#vpqReceptionImageLayers');
 if(room!=='reception'){if(old)old.remove();signature='';return}
 const bag=api.state.receptionCollection||{},placed=Array.isArray(bag.placed)?bag.placed:[];
 const mode=api.state.receptionView==='isometric'?'isometric':'classic';
 const wanted=Object.keys(art).filter(id=>placed.includes(id));
 const next=mode+'|'+wanted.join('|');
 if(old&&signature===next)return;
 if(old)old.remove();
 const layer=document.createElement('div');
 layer.id='vpqReceptionImageLayers';
 layer.setAttribute('aria-label','Purchased reception decorations');
 for(const id of wanted){
  const item=art[id],p=item.slot[mode],img=document.createElement('img');
  img.className='vpqDecorImage';img.src=item.src;img.alt='';img.setAttribute('aria-hidden','true');
  img.dataset.vpqDecorId=id;
  img.style.left=p[0]+'%';img.style.top=p[1]+'%';img.style.width=p[2]+'%';img.style.height=p[3]+'%';
  layer.appendChild(img);
 }
 stage.appendChild(layer);signature=next;
}
let scheduled=false;
const observer=new MutationObserver(()=>{
 if(scheduled)return;scheduled=true;
 queueMicrotask(()=>{scheduled=false;update()});
});
observer.observe(stage,{childList:true,subtree:false,attributes:true,attributeFilter:['data-room','data-reception-view']});
update();
return Object.freeze({refresh:update,manifest:art});
};
