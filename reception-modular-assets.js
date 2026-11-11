/* Vet Pharm Quest: one reusable visual manifest for owned reception decorations.
 * All image assets are original game illustrations. Views share the same
 * collection state, and artwork never intercepts gameplay hotspots.
 */
window.VPQ_RECEPTION_MODULAR_ASSETS=(function(){
'use strict';
const manifest={};
for(const theme of ['halloween','winter','pride','spring']){
 for(const kind of ['rug','desk','hanging','cat']){
  const id=kind==='cat'?'cataccent-'+theme:kind+'-'+theme;
  const viewKind=kind==='cat'?'cat':kind;
  manifest[id]={
   src:'assets/reception/season-'+theme+'-'+viewKind+'.svg',
   kind,
   classic:kind==='rug'?[480,380,325,110]:kind==='desk'?[88,311,176,135]:kind==='hanging'?[48,18,230,117]:[825,285,150,154],
   isometric:kind==='rug'?[445,388,330,105]:kind==='desk'?[117,291,179,137]:kind==='hanging'?[73,39,228,111]:[821,312,149,150]
  };
 }
}
Object.assign(manifest,{
 'decor-planter':{src:'assets/reception/decor-planter.svg',kind:'decor',classic:[900,280,91,145],isometric:[919,263,80,145]},
 'decor-pumpkin':{src:'assets/reception/decor-pumpkin.svg',kind:'decor',classic:[373,355,92,89],isometric:[798,369,81,80]},
 'decor-cat-tree':{src:'assets/reception/decor-cat-tree.svg',kind:'decor',classic:[800,216,145,171],isometric:[852,211,128,166]}
});
function render(state,mode,part='all'){
 const placed=state?.receptionCollection?.placed;
 if(!Array.isArray(placed))return '';
 const items=Object.keys(manifest).filter(id=>placed.includes(id)&&
  (part==='all'||(part==='rug'?manifest[id].kind==='rug':manifest[id].kind!=='rug')));
 return items.map(id=>{
  const item=manifest[id],p=item[mode]||item.classic;
  return '<image href="'+item.src+'" x="'+p[0]+'" y="'+p[1]+'" width="'+p[2]+'" height="'+p[3]+'" preserveAspectRatio="xMidYMid meet" pointer-events="none" aria-hidden="true"/>';
 }).join('');
}
return Object.freeze({manifest,render});
})();
