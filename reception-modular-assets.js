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
   isometric:kind==='rug'?[594,405,295,85]:kind==='desk'?[93,269,95,66]:kind==='hanging'?[74,51,113,75]:[897,321,87,92]
  };
 }
}
Object.assign(manifest,{
 'decor-carrier':{src:'assets/reception/decor-carrier.svg',kind:'decor',classic:[680,350,136,116],isometric:[431,414,89,77]},
 'decor-cat-blanket':{src:'assets/reception/decor-cat-blanket.svg',kind:'decor',classic:[784,359,115,96],isometric:[899,419,79,71]},
 'decor-cat-carrier-cozy':{src:'assets/reception/decor-cat-carrier-cozy.svg',kind:'decor',classic:[680,350,136,116],isometric:[431,414,89,77]},
 'decor-armchair':{src:'assets/reception/decor-armchair.svg',kind:'decor',classic:[617,333,121,132],isometric:[633,364,91,92]},
 'decor-side-table':{src:'assets/reception/decor-side-table.svg',kind:'decor',classic:[558,404,90,75],isometric:[720,412,52,53]},
 'decor-bookcase':{src:'assets/reception/decor-bookcase.svg',kind:'decor',classic:[81,185,123,204],isometric:[848,220,65,114]},
 'decor-scifi-testtubes':{src:'assets/reception/decor-scifi-testtubes.svg',kind:'decor',classic:[330,301,114,130],isometric:[826,286,55,58]},
 'decor-scifi-alien':{src:'assets/reception/decor-scifi-alien.svg',kind:'decor',classic:[731,308,108,138],isometric:[908,302,57,81]},
 'decor-scifi-ufo':{src:'assets/reception/decor-scifi-ufo.svg',kind:'decor',classic:[420,64,126,110],isometric:[800,54,79,68]},
 'decor-scifi-planter':{src:'assets/reception/decor-scifi-planter.svg',kind:'decor',classic:[899,281,94,140],isometric:[950,318,45,83]},
 'decor-scifi-console':{src:'assets/reception/decor-scifi-console.svg',kind:'decor',classic:[276,293,137,148],isometric:[822,281,61,69]},
 'decor-planter':{src:'assets/reception/decor-planter.svg',kind:'decor',classic:[900,280,91,145],isometric:[949,322,42,90]},
 'decor-pumpkin':{src:'assets/reception/decor-pumpkin.svg',kind:'decor',classic:[373,355,92,89],isometric:[909,403,44,43]},
 'decor-cat-tree':{src:'assets/reception/decor-cat-tree.svg',kind:'decor',classic:[800,216,145,171],isometric:[901,229,89,114]},
 'decor-cat-tree-cloud':{src:'assets/reception/decor-cat-tree-cloud.svg',kind:'decor',classic:[800,216,145,171],isometric:[901,229,89,114]},
 'decor-toy-bin':{src:'assets/reception/decor-toy-bin.svg',kind:'decor',classic:[743,398,110,91],isometric:[526,440,61,49]},
 'decor-magazines':{src:'assets/reception/decor-magazines.svg',kind:'decor',classic:[342,316,105,70],isometric:[311,292,60,36]},
 'decor-treat-display':{src:'assets/reception/decor-treat-display.svg',kind:'decor',classic:[934,189,62,168],isometric:[948,234,42,96]},
 'decor-paw-art':{src:'assets/reception/decor-paw-mural-deluxe.svg',kind:'mural',classic:[699,91,125,91],isometric:[821,72,76,62]},
 'decor-cat-tree-castle':{src:'assets/reception/decor-cat-tree-castle.svg',kind:'decor',classic:[800,216,145,171],isometric:[901,229,89,114]},
 'decor-cat-tree-forest':{src:'assets/reception/decor-cat-tree-forest.svg',kind:'decor',classic:[800,216,145,171],isometric:[901,229,89,114]},
 'decor-cat-tree-moon':{src:'assets/reception/decor-cat-tree-moon.svg',kind:'decor',classic:[800,216,145,171],isometric:[901,229,89,114]}
});
for(const theme of ['christmas','hanukkah','kwanzaa','snow','valentines','stpatricks','midnight','unicorn','boho','coffee','scifi']){
 manifest['display-'+theme]={src:'assets/reception/display-'+theme+'.svg',kind:'themeDisplay',
   classic:[351,305,115,135],isometric:[877,280,65,78]};
}
for(const plant of ['monstera','fern','orchid','pothos','succulent','lavender']){
 manifest['plant-'+plant]={src:'assets/reception/plant-'+plant+'.svg',kind:'plantFloor',
   classic:[900,287,89,146],isometric:[948,319,45,93]};
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
