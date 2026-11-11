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
   classic:kind==='rug'?[579,386,285,86]:kind==='desk'?[88,311,176,135]:kind==='hanging'?[48,18,230,117]:[875,314,99,103],
   isometric:kind==='rug'?[591,398,319,94]:kind==='desk'?[93,262,110,81]:kind==='hanging'?[71,52,135,89]:[890,299,111,117]
  };
 }
}
Object.assign(manifest,{
 'decor-paw-floor-lamp':{src:'assets/reception/decor-paw-floor-lamp.svg',kind:'floorLamp',classic:[562,236,85,165],isometric:[670,302,79,145]},
 'decor-pet-table-lamp':{src:'assets/reception/decor-pet-table-lamp.svg',kind:'tableLamp',classic:[565,364,56,76],isometric:[692,384,49,65]},
 'decor-paw-ottoman':{src:'assets/reception/decor-paw-ottoman.svg',kind:'ottoman',classic:[854,414,110,77],isometric:[883,429,94,65]},
 'decor-donut-dog-bed':{src:'assets/reception/decor-donut-dog-bed.svg',kind:'dogBed',classic:[498,417,134,75],isometric:[525,431,118,70]},
 'decor-moon-cat-bed':{src:'assets/reception/decor-moon-cat-bed.svg',kind:'catBed',classic:[837,387,123,105],isometric:[902,369,92,97]},
 'decor-coffee-tray':{src:'assets/reception/decor-coffee-tray.svg',kind:'tableTop',classic:[745,390,75,61],isometric:[771,406,75,60]},
 'decor-coffee-table':{src:'assets/reception/decor-coffee-table.svg',kind:'coffeeTable',classic:[716,403,150,85],isometric:[730,420,162,82]},
 'decor-coffee-table-cloud':{src:'assets/reception/decor-coffee-table-cloud.svg',kind:'coffeeTable',classic:[716,403,150,85],isometric:[730,420,162,82]},
 'decor-coffee-table-scifi':{src:'assets/reception/decor-coffee-table-scifi.svg',kind:'coffeeTable',classic:[716,403,150,85],isometric:[730,420,162,82]},
 'decor-carrier':{src:'assets/reception/decor-carrier.svg',kind:'decor',classic:[680,350,136,116],isometric:[441,399,114,100]},
 'decor-cat-blanket':{src:'assets/reception/decor-cat-blanket.svg',kind:'decor',classic:[784,359,115,96],isometric:[893,414,102,82]},
 'decor-cat-carrier-cozy':{src:'assets/reception/decor-cat-carrier-cozy.svg',kind:'decor',classic:[680,350,136,116],isometric:[441,399,114,100]},
 'decor-armchair':{src:'assets/reception/decor-armchair.svg',kind:'decor',classic:[617,333,121,132],isometric:[620,348,112,121]},
 'decor-side-table':{src:'assets/reception/decor-side-table.svg',kind:'decor',classic:[558,404,90,75],isometric:[696,425,66,62]},
 'decor-bookcase':{src:'assets/reception/decor-bookcase.svg',kind:'decor',classic:[81,185,123,204],isometric:[835,197,79,141]},
 'decor-scifi-testtubes':{src:'assets/reception/decor-scifi-testtubes.svg',kind:'decor',classic:[330,301,114,130],isometric:[810,279,76,88]},
 'decor-scifi-alien':{src:'assets/reception/decor-scifi-alien.svg',kind:'decor',classic:[731,308,108,138],isometric:[904,294,83,104]},
 'decor-scifi-ufo':{src:'assets/reception/decor-scifi-ufo.svg',kind:'decor',classic:[420,64,126,110],isometric:[787,55,99,82]},
 'decor-scifi-planter':{src:'assets/reception/decor-scifi-planter.svg',kind:'decor',classic:[899,281,94,140],isometric:[942,310,56,100]},
 'decor-scifi-console':{src:'assets/reception/decor-scifi-console.svg',kind:'decor',classic:[276,293,137,148],isometric:[814,273,81,90]},
 'decor-planter':{src:'assets/reception/decor-planter.svg',kind:'decor',classic:[900,280,91,145],isometric:[944,317,54,108]},
 'decor-pumpkin':{src:'assets/reception/decor-pumpkin.svg',kind:'decor',classic:[373,355,92,89],isometric:[929,428,63,56]},
 'decor-cat-tree':{src:'assets/reception/decor-cat-tree.svg',kind:'decor',classic:[800,216,145,171],isometric:[881,203,111,148]},
 'decor-cat-tree-cloud':{src:'assets/reception/decor-cat-tree-cloud.svg',kind:'decor',classic:[800,216,145,171],isometric:[881,203,111,148]},
 'decor-toy-bin':{src:'assets/reception/decor-toy-bin.svg',kind:'decor',classic:[743,398,110,91],isometric:[534,433,82,65]},
 'decor-magazines':{src:'assets/reception/decor-magazines.svg',kind:'decor',classic:[342,316,105,70],isometric:[307,287,80,48]},
 'decor-treat-display':{src:'assets/reception/decor-treat-display.svg',kind:'decor',classic:[934,189,62,168],isometric:[938,214,58,124]},
 'decor-paw-art':{src:'assets/reception/decor-paw-mural-deluxe.svg',kind:'mural',classic:[692,70,240,94],isometric:[74,55,205,78]},
 'decor-cat-tree-castle':{src:'assets/reception/decor-cat-tree-castle.svg',kind:'decor',classic:[800,216,145,171],isometric:[881,203,111,148]},
 'decor-cat-tree-forest':{src:'assets/reception/decor-cat-tree-forest.svg',kind:'decor',classic:[800,216,145,171],isometric:[881,203,111,148]},
 'decor-cat-tree-moon':{src:'assets/reception/decor-cat-tree-moon.svg',kind:'decor',classic:[800,216,145,171],isometric:[881,203,111,148]}
});
for(const theme of ['christmas','hanukkah','kwanzaa','snow','valentines','stpatricks','midnight','unicorn','boho','coffee','scifi']){
 manifest['display-'+theme]={src:'assets/reception/display-'+theme+'.svg',kind:'themeDisplay',
   classic:[351,305,115,135],isometric:[866,263,94,107]};
}
for(const plant of ['monstera','fern','orchid','pothos','succulent','lavender']){
 manifest['plant-'+plant]={src:'assets/reception/plant-'+plant+'.svg',kind:'plantFloor',
   classic:[900,287,89,146],isometric:[941,307,59,111]};
}
function render(state,mode,part='all'){
 const placed=state?.receptionCollection?.placed;
 if(!Array.isArray(placed))return '';
 const items=Object.keys(manifest).filter(id=>placed.includes(id)&&
  (part==='all'||(part==='rug'?manifest[id].kind==='rug':manifest[id].kind!=='rug')));
 return items.sort((a,b)=>(manifest[a].kind==='tableTop'?1:0)-(manifest[b].kind==='tableTop'?1:0)).map(id=>{
  const item=manifest[id],p=item[mode]||item.classic;
  return '<image href="'+item.src+'" x="'+p[0]+'" y="'+p[1]+'" width="'+p[2]+'" height="'+p[3]+'" preserveAspectRatio="xMidYMid meet" pointer-events="none" aria-hidden="true"/>';
 }).join('');
}
return Object.freeze({manifest,render});
})();
