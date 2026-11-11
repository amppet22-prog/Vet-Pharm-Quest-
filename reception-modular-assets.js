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
 'decor-carrier':{src:'assets/reception/decor-carrier.svg',kind:'decor',classic:[680,350,136,116],isometric:[659,390,122,102]},
 'decor-cat-blanket':{src:'assets/reception/decor-cat-blanket.svg',kind:'decor',classic:[784,359,115,96],isometric:[778,394,108,90]},
 'decor-cat-carrier-cozy':{src:'assets/reception/decor-cat-carrier-cozy.svg',kind:'decor',classic:[680,350,136,116],isometric:[659,390,122,102]},
 'decor-armchair':{src:'assets/reception/decor-armchair.svg',kind:'decor',classic:[617,333,121,132],isometric:[599,355,112,122]},
 'decor-side-table':{src:'assets/reception/decor-side-table.svg',kind:'decor',classic:[558,404,90,75],isometric:[544,421,88,72]},
 'decor-bookcase':{src:'assets/reception/decor-bookcase.svg',kind:'decor',classic:[81,185,123,204],isometric:[87,173,109,193]},
 'decor-scifi-testtubes':{src:'assets/reception/decor-scifi-testtubes.svg',kind:'decor',classic:[330,301,114,130],isometric:[360,320,110,122]},
 'decor-scifi-alien':{src:'assets/reception/decor-scifi-alien.svg',kind:'decor',classic:[731,308,108,138],isometric:[744,321,103,128]},
 'decor-scifi-ufo':{src:'assets/reception/decor-scifi-ufo.svg',kind:'decor',classic:[420,64,126,110],isometric:[440,82,123,108]},
 'decor-scifi-planter':{src:'assets/reception/decor-scifi-planter.svg',kind:'decor',classic:[899,281,94,140],isometric:[902,284,89,136]},
 'decor-scifi-console':{src:'assets/reception/decor-scifi-console.svg',kind:'decor',classic:[276,293,137,148],isometric:[286,315,130,137]},
 'decor-planter':{src:'assets/reception/decor-planter.svg',kind:'decor',classic:[900,280,91,145],isometric:[919,263,80,145]},
 'decor-pumpkin':{src:'assets/reception/decor-pumpkin.svg',kind:'decor',classic:[373,355,92,89],isometric:[798,369,81,80]},
 'decor-cat-tree':{src:'assets/reception/decor-cat-tree.svg',kind:'decor',classic:[800,216,145,171],isometric:[852,211,128,166]},
 'decor-cat-tree-cloud':{src:'assets/reception/decor-cat-tree-cloud.svg',kind:'decor',classic:[800,216,145,171],isometric:[852,211,128,166]},
 'decor-toy-bin':{src:'assets/reception/decor-toy-bin.svg',kind:'decor',classic:[743,398,110,91],isometric:[759,414,98,79]},
 'decor-magazines':{src:'assets/reception/decor-magazines.svg',kind:'decor',classic:[342,316,105,70],isometric:[364,308,94,58]},
 'decor-treat-display':{src:'assets/reception/decor-treat-display.svg',kind:'decor',classic:[934,189,62,168],isometric:[936,205,61,163]},
 'decor-paw-art':{src:'assets/reception/decor-paw-mural-deluxe.svg',kind:'mural',classic:[699,91,125,91],isometric:[824,85,107,80]},
 'decor-cat-tree-castle':{src:'assets/reception/decor-cat-tree-castle.svg',kind:'decor',classic:[800,216,145,171],isometric:[852,211,128,166]},
 'decor-cat-tree-forest':{src:'assets/reception/decor-cat-tree-forest.svg',kind:'decor',classic:[800,216,145,171],isometric:[852,211,128,166]},
 'decor-cat-tree-moon':{src:'assets/reception/decor-cat-tree-moon.svg',kind:'decor',classic:[800,216,145,171],isometric:[852,211,128,166]}
});
for(const theme of ['christmas','hanukkah','kwanzaa','snow','valentines','stpatricks','midnight','unicorn','boho','coffee','scifi']){
 manifest['display-'+theme]={src:'assets/reception/display-'+theme+'.svg',kind:'themeDisplay',
   classic:[351,305,115,135],isometric:[366,311,111,134]};
}
for(const plant of ['monstera','fern','orchid','pothos','succulent','lavender']){
 manifest['plant-'+plant]={src:'assets/reception/plant-'+plant+'.svg',kind:'plantFloor',
   classic:[900,287,89,146],isometric:[904,290,84,151]};
}
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
