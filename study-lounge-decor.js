/* Student Lounge decoration studio. Shared ownership; independent lounge placements. */
window.VPQ_STUDY_LOUNGE_DECOR=function(api){
'use strict';
const {state,persist,updateHUD,renderRoom,showModal,changeRoom}=api;
const stage=document.getElementById('stage'), art=window.VPQ_SCENERY,body=document.getElementById('modalBody');
if(!stage||!art||!body)return null;
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const items=[
{id:'lounge-coffee-deluxe',slot:'coffee',min:3},{id:'lounge-microwave',slot:'microwave',min:2},
{id:'lounge-snack-bin',slot:'snack',min:1},{id:'lounge-egg-chair',slot:'seating',min:4},
{id:'lounge-hanging-chair',slot:'seating',min:6},{id:'lounge-stools',slot:'stools',min:3},
{id:'lounge-vines',slot:'vines',min:2},{id:'lounge-planter-pack',slot:'plants',min:3},
{id:'lounge-reptile-deluxe',slot:'habitat',min:5},{id:'lounge-magazines',slot:'magazines',min:1},
{id:'lounge-coffee-table',slot:'table',min:2}
];
const catalog=()=>window.VPQ_RECEPTION_COLLECTION_ITEMS||[];
const inventory=()=>state.receptionCollection||(state.receptionCollection={owned:[],placed:[],equippedWall:'paint-peach'});
const owned=id=>(inventory().owned||[]).includes(id)||(state.upgrades||[]).includes(id);
const level=()=>Math.floor((Number(state.xp)||0)/130)+1;
const icons={coffee:'☕',microwave:'🍲',snack:'🍪',chair:'🪑',stools:'🪑',vines:'🌿',plants:'🪴',habitat:'🦎',magazines:'📚',table:'🫖'};
const defaults={coffee:'basic',habitat:'basic',vines:'basic',plants:'basic',plantCount:3};
function bag(){
 if(!state.studyLoungeDecor||typeof state.studyLoungeDecor!=='object')state.studyLoungeDecor={...defaults};
 if(!state.studyLoungeDecor.seating&&['lounge-egg-chair','lounge-hanging-chair'].includes(state.studyLoungeDecor.chair)){state.studyLoungeDecor.seating=state.studyLoungeDecor.chair;delete state.studyLoungeDecor.chair}
 return state.studyLoungeDecor;
}
const slots=[...new Set(items.map(x=>x.slot)), 'receptionPlants','receptionDecor','levelReward'];
function chosen(slot){return bag()[slot]||defaults[slot]||'none'}
function save(){persist();updateHUD();renderRoom()}
function itemInfo(id){return catalog().find(x=>x.id===id)}
function plantLibrary(){return (catalog().filter(x=>x.type==='plantFloor'&&owned(x.id))).map(x=>x.id)}
function otherDecor(){return catalog().filter(x=>['decor','furniture','coffeeTable','ottoman','floorLamp','tableLamp'].includes(x.type)&&!x.id.startsWith('lounge-')&&owned(x.id)).map(x=>x.id)}
function levelArtItems(){return (window.VPQ_LOUNGE_LEVEL_FURNITURE||[]).filter(x=>x.furnitureKind&&x.furnitureKind!=='flag'&&(state.upgrades||[]).includes(x.id))}
function info(id){
 const custom=items.find(x=>x.id===id);const x=itemInfo(id);
 if(x)return {id,name:x.name,price:x.price||0,slot:custom?.slot||'receptionDecor',min:custom?.min||1,icon:x.icon||'🪴'};
 const lvl=levelArtItems().find(x=>x.id===id);
 return lvl?{id,name:lvl.label,price:0,slot:'levelReward',min:1,icon:lvl.furnitureGlyph||'⭐'}:null;
}
function cards(filter){
 const all=items.map(x=>info(x.id)).filter(Boolean);
 const add=(ids,slot)=>ids.map(id=>{const x=info(id);return x?{...x,slot}:null}).filter(Boolean);
 return [...all,...add(plantLibrary(),'receptionPlants'),...add(otherDecor(),'receptionDecor'),...add(levelArtItems().map(x=>x.id),'levelReward')]
 .filter(x=>filter==='all'||filter==='owned'&&owned(x.id)||filter===x.slot)
 .filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i);
}
function studio(filter='all'){
 const options=[['all','All'],['owned','Owned'],['plants','Greenery'],['seating','Seating swaps'],['coffee','Coffee bar'],['habitat','Reptiles'],['receptionDecor','Shared Reception'],['levelReward','Level rewards']];
 const links=options.map(([v,label])=>'<button data-vpqloungedecor-filter="'+v+'" style="padding:7px 10px;border-radius:10px;'+(filter===v?'background:#e2f4e8;border:2px solid #649e80;':'')+'">'+label+'</button>').join('');
 const list=cards(filter).map(x=>{
 const have=owned(x.id),required=level()<x.min,active=chosen(x.slot)===x.id;
 return '<article style="border:1px solid #c6d3df;border-radius:13px;background:#fff;padding:11px;min-width:0"><div style="font-size:28px">'+h(x.icon)+'</div><b>'+h(x.name)+'</b><p class="tiny">'+(have?'✓ In your collection':required?'🔒 Unlock at Level '+x.min:'🪙 '+x.price+' coins')+'</p><button '+(required||(!have&&state.coins<x.price)?'disabled':'')+' data-vpqloungedecor-'+(have?'equip':'buy')+'="'+h(x.id)+'" style="width:100%;padding:8px;border-radius:9px">'+(have?(active?'✓ Placed — remove':'Place in Lounge'):'Buy & place · '+x.price+' 🪙')+'</button></article>'
 }).join('');
 showModal('🌿 Student Lounge · Decorate & Collect','<p><b>Make this space your own!</b> Your Reception purchases and level rewards are shared. Lounge placements are independent; nothing is removed from the Reception, cat study or dog kennel.</p><p class="small">Level '+level()+' · '+state.coins+' coins · Base coffee maker, plants, and reptile habitat included. Upgrades use the same coins and unlock progress as the rest of the clinic.</p><div class="buttonrow"><button data-vpqloungedecor-collection="1">💝 My collection</button><button data-vpqloungedecor-shop="1">🎨 Reception Shop</button><button data-vpqloungedecor-reset="1">↺ Reset Lounge placement</button></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin:11px 0">'+links+'</div><div style="border:1px solid #b5d9bc;background:#f1fbf2;padding:10px;border-radius:10px;margin:9px 0"><b>🌿 Botanical corners</b><p class="tiny">Choose how many decorative planters appear here. Your plants and purchases remain available in Reception, too.</p><div class="buttonrow">'+[2,3,4,5,6].map(n=>'<button data-vpqloungedecor-plants="'+n+'" '+((Number(bag().plantCount)||3)===n?'style="background:#d6efdd;border:2px solid #5e9a76"':'')+'>'+n+' plants</button>').join('')+'</div></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px">'+(list||'<p>No items in this category yet. Explore the Reception shop or level rewards to unlock more.</p>')+'</div>');
}
function equip(id){
 const x=info(id);if(!x||!owned(id))return;
 const slot=x.slot;bag()[slot]=bag()[slot]===id?(defaults[slot]||'none'):id;save();studio('owned');
}
function buy(id){
 const x=info(id);if(!x||owned(id)||level()<x.min||state.coins<x.price||!itemInfo(id))return;
 state.coins-=x.price;
 const b=inventory();b.owned=Array.isArray(b.owned)?b.owned:[];
 b.transactions=Array.isArray(b.transactions)?b.transactions:[];
 b.owned.push(id);b.transactions.unshift({id,price:x.price,kind:'purchase',date:new Date().toISOString()});
 bag()[x.slot]=id;save();studio('owned');
}
function pic(path,x,y,w,z){return '<image href="'+h(path)+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+z+'" preserveAspectRatio="xMidYMid meet"/>'}
function botanicals(){
 // All vines are attached to the new window frame and trailing over its sill.
 let s='<g><path d="M268 88Q293 71 320 88T414 88M268 88q-15 35 0 76M414 88q18 35 3 75" fill="none" stroke="#719a7d" stroke-width="5"/>';
 for(const [x,y,angle] of [[275,93,-35],[293,79,25],[316,87,-25],[340,82,25],[369,84,-25],[389,80,15],[411,92,30],[266,115,-30],[415,118,30],[267,144,-35],[416,144,25]])
 s+='<ellipse cx="'+x+'" cy="'+y+'" rx="12" ry="6" fill="#8ebb99" transform="rotate('+angle+' '+x+' '+y+')"/>';
 s+='</g>';
 if(chosen('vines')==='lounge-vines'){
 s+='<g><path d="M274 90q-26 60 -4 124M409 90q26 56 3 126" stroke="#588d74" stroke-width="5" fill="none"/>';
 for(let i=0;i<9;i++){const y=109+i*12;s+='<ellipse cx="'+(i%2?265:279)+'" cy="'+y+'" rx="11" ry="6" fill="#80b89b" transform="rotate('+(i%2?-25:35)+' '+(i%2?265:279)+' '+y+')"/><ellipse cx="'+(i%2?407:419)+'" cy="'+y+'" rx="11" ry="6" fill="#7eae8a"/>'}
 s+='</g>';
 }
 return s;
}
function habitat(){
 const deluxe=chosen('habitat')==='lounge-reptile-deluxe';
 // Tall, left-wall display, with visible lizard, climbing/basking surfaces and a real cabinet base.
 // Decorative illustration only; species-specific welfare requirements are not represented as a care guide.
 return '<g transform="matrix(.55 -.09 .075 1.04 3 163)">'+
 // Angled right-hand depth, top rim, and a slim visible side panel make the case follow the left wall.
 '<path d="M140 0l19 -12v155l-19 12Z" fill="#486e69" stroke="#385e5a" stroke-width="4"/>'+
 '<path d="M0 0L19 -12H159L140 0Z" fill="#819d8d" stroke="#4e6d65" stroke-width="4"/>'+
 '<rect x="0" y="0" width="140" height="155" rx="8" fill="#5f827a" stroke="#466e69" stroke-width="6"/>'+
 '<rect x="7" y="9" width="126" height="117" rx="4" fill="#dceacc" stroke="#92ac9e" stroke-width="3"/>'+
 '<rect x="8" y="11" width="124" height="12" rx="3" fill="#708e7f"/>'+
 // Upper screened ventilation, two separate light fixtures, a thermometer readout.
 '<path d="M13 15h114" stroke="#b9dac8" stroke-width="2" stroke-dasharray="2 3"/>'+
 '<rect x="18" y="22" width="33" height="6" rx="2" fill="#5c766d"/><rect x="61" y="22" width="38" height="6" rx="2" fill="#768c7b"/>'+
 '<path d="M26 28l-6 11h17l-7 -11M76 28l-4 11h14l-5 -11" fill="#ecd7a6" opacity=".65"/>'+
 '<rect x="105" y="31" width="18" height="15" rx="3" fill="#f5f0d8" stroke="#8aa697" stroke-width="1.8"/>'+
 '<text x="114" y="41" text-anchor="middle" font-family="Arial" font-weight="900" font-size="7" fill="#678778">TEMP</text>'+
 '<path d="M13 17h114" stroke="#b3d9c9" stroke-width="2" stroke-dasharray="3 3"/>'+
 '<path d="M10 105Q42 90 74 102T130 100V125H10Z" fill="#ccb28a"/>'+
 '<path d="M13 108L31 72L66 77L82 109Z" fill="#b5a185" stroke="#91846b" stroke-width="2"/>'+
 '<path d="M23 97Q40 82 58 96" fill="#6d775a" opacity=".42"/>'+
 '<path d="M112 110Q110 78 119 53M110 93q-26 -18 -24 -39" stroke="#64876b" stroke-width="5" fill="none"/>'+
 '<ellipse cx="116" cy="73" rx="14" ry="6" fill="#83ab7c" transform="rotate(-24 116 73)"/>'+
 '<ellipse cx="91" cy="68" rx="13" ry="5" fill="#91b587" transform="rotate(29 91 68)"/>'+
 '<path d="M14 51Q35 43 53 56" stroke="#9a826c" stroke-width="6" stroke-linecap="round" fill="none"/>'+
 '<ellipse cx="106" cy="112" rx="15" ry="4" fill="#b6cfd4" stroke="#88acb3" stroke-width="2"/>'+
 '<ellipse cx="105" cy="112" rx="10" ry="2" fill="#d7edf3"/>'+
 '<path d="M26 112q1 -17 14 -20q15 -2 20 20Z" fill="#8b7860" stroke="#6b645a" stroke-width="2"/>'+
 '<path d="M35 112q4 -13 12 -10q6 2 7 10" fill="#4b5947"/>'+
 '<path d="M16 61q23 -20 44 -19t28 8" stroke="#937e60" stroke-width="6" stroke-linecap="round" fill="none"/>'+
 '<path d="M19 114l3 2m13 -2 3 2m25 -3 4 2m13 -2 3 2" stroke="#a39472" stroke-width="2"/>'+
 // A recognizable stylized bearded dragon: tapering banded tail, stocky torso, four feet, triangular head, ear opening, eye and beard scales.
 '<path d="M31 91Q18 98 10 108Q18 105 31 101Q44 97 52 92Q62 87 77 85Q88 81 95 79L112 74Q119 71 127 78L124 88Q116 91 107 87L94 94Q76 104 56 99Q42 100 31 91Z" fill="#8ea86b" stroke="#536c4d" stroke-width="2.5"/>'+
 '<path d="M48 94Q57 81 78 85Q90 82 102 82" fill="none" stroke="#b3c68b" stroke-width="4"/>'+
 '<path d="M60 95L53 109l-10 3m15 -14 -2 10m27 -13 8 13 10 1m-11 -15 7 8" fill="none" stroke="#647c56" stroke-width="4" stroke-linecap="round"/>'+
 '<path d="M43 111l-5 2m10 -1 -4 4m52 -7 3 4m-8 -4 -2 5" stroke="#536c4d" stroke-width="2" stroke-linecap="round"/>'+
 '<path d="M106 87l6 7 3 -7 4 6 3 -7 4 4" fill="#758b5a" stroke="#536c4d" stroke-width="1.5"/>'+
 '<path d="M44 94L35 96M40 96l-5 1M31 99l-4 2M24 103l-3 2" stroke="#5f764e" stroke-width="2.5"/>'+
 '<path d="M52 89l-5 -3 8 1 1 -5 7 4 2 -6 7 5 3 -5 6 4" fill="#7b9161" stroke="#61764f" stroke-width="1.5"/>'+
 '<circle cx="116" cy="79" r="2.8" fill="#403d2d"/><circle cx="116.7" cy="78.2" r=".8" fill="#fff5d8"/>'+
 '<circle cx="104" cy="84" r="2" fill="#6e7954" stroke="#495c42" stroke-width=".7"/>'+
 '<path d="M121 86q3 2 6 -1" stroke="#536c4d" stroke-width="1.2" fill="none"/>'+
 '<path d="M65 89l7 3 9 -5M53 95l7 1m25 -3 8 -3" stroke="#657d56" stroke-width="1.8" fill="none"/>'+
 '<path d="M12 40h120M70 10v114" stroke="#c4dfd4" stroke-width="2" opacity=".34"/>'+
 (deluxe?'<path d="M15 55q-7 -19 2 -30M126 54q11 -18 1 -29" stroke="#5e9870" stroke-width="4" fill="none"/><ellipse cx="44" cy="40" rx="12" ry="7" fill="#81b18a"/><circle cx="42" cy="30" r="7" fill="#e7c685"/>':'')+
 '<rect x="-5" y="128" width="150" height="12" rx="3" fill="#b8957f" stroke="#866e69" stroke-width="3"/>'+
 '<rect x="4" y="140" width="132" height="25" rx="3" fill="#ad8c79" stroke="#88736c" stroke-width="3"/>'+
 '<path d="M69 143v20" stroke="#8b756a" stroke-width="2"/>'+
 '<text x="70" y="156" font-family="Arial" font-size="9" font-weight="900" text-anchor="middle" fill="#fff7ed">'+(deluxe?'BIOACTIVE DISPLAY':'LIZARD HABITAT')+'</text>'+
 '</g>';
}
function svgDecor(){
 let s='<g class="vpqLoungeDecorScenery">'+botanicals();
 if(chosen('coffee')==='lounge-coffee-deluxe')s+='<g transform="translate(350 217) scale(.86)"><rect width="58" height="40" rx="7" fill="#9bb6b7" stroke="#718e97" stroke-width="4"/><rect x="9" y="9" width="40" height="11" rx="5" fill="#f1ebee"/><path d="M27 21v12" stroke="#fff" stroke-width="5"/><text x="29" y="8" text-anchor="middle" font-size="8" font-weight="800" fill="#4b6174">BARISTA</text></g>';
 if(chosen('microwave')==='lounge-microwave')s+='<g transform="translate(402 224) scale(.68)"><rect width="53" height="33" rx="5" fill="#e5c9dd" stroke="#ae92b4" stroke-width="3"/><rect x="7" y="6" width="31" height="20" rx="3" fill="#adcfda"/><circle cx="45" cy="11" r="3" fill="#fff"/><circle cx="45" cy="22" r="3" fill="#fff"/></g>';
 if(chosen('snack')==='lounge-snack-bin')s+='<g transform="translate(430 248) scale(.6)"><path d="M0 6H47L40 43H7Z" fill="#ddab85" stroke="#ab7a6a" stroke-width="3"/><text x="23" y="27" font-family="Arial" font-size="10" text-anchor="middle" fill="#fff" font-weight="900">SNACKS</text><text x="8" y="6" font-size="21">🍎</text><text x="22" y="6" font-size="20">🥨</text></g>';
 if(chosen('seating')==='lounge-egg-chair')s+='<g transform="translate(125 333) scale(.63)"><path d="M80 0v33" stroke="#806d8d" stroke-width="6"/><ellipse cx="80" cy="118" rx="70" ry="83" fill="#c39d7d" stroke="#8a6f65" stroke-width="8"/><ellipse cx="80" cy="125" rx="51" ry="63" fill="#f7e7dd"/><ellipse cx="80" cy="150" rx="49" ry="31" fill="#d8bcd9"/><path d="M80 201v21" stroke="#876b77" stroke-width="6"/></g>';
 if(chosen('seating')==='lounge-hanging-chair')s+='<g transform="translate(126 324) scale(.72)"><path d="M78 0v50" stroke="#876f99" stroke-width="6"/><path d="M18 83Q78 182 138 83" stroke="#a57cbe" stroke-width="13" fill="none"/><path d="M27 82Q78 151 131 82" stroke="#e8cfe5" stroke-width="18" fill="none"/><path d="M40 82Q78 117 118 82" stroke="#fff1de" stroke-width="18" fill="none"/></g>';
 if(chosen('stools')==='lounge-stools')for(const x of [505,691])s+='<g transform="translate('+x+' 385)"><ellipse cx="0" cy="0" rx="25" ry="11" fill="#a991c8" stroke="#786c96" stroke-width="4"/><path d="M-14 9l-8 48M14 9l8 48" stroke="#9c806e" stroke-width="6"/></g>';
 if(chosen('magazines')==='lounge-magazines')s+='<g transform="translate(506 333) rotate(-12) scale(.65)"><rect width="56" height="36" rx="3" fill="#bd9ac9" stroke="#8d77a6" stroke-width="2"/><rect x="7" y="6" width="42" height="24" rx="2" fill="#f4e9f4"/><text x="27" y="17" font-size="8" font-weight="900" text-anchor="middle" fill="#72558e">VET MED</text><text x="27" y="26" font-size="8" text-anchor="middle" fill="#72558e">JOURNAL</text></g>';
 if(chosen('table')==='lounge-coffee-table')s+='<g transform="translate(163 418)"><ellipse rx="72" ry="13" fill="#cfa884" stroke="#9b756e" stroke-width="5"/><path d="M-47 8v28M47 8v28" stroke="#96786e" stroke-width="7"/></g>';
 const plant=chosen('receptionPlants');if(plant!=='none'&&plantLibrary().includes(plant))s+=pic('assets/reception/'+plant+'.svg',278,160,45,58);
 const extra=chosen('plants')==='lounge-planter-pack';if(extra)s+='<g><path d="M274 97Q283 128 270 161M410 100Q395 128 414 163" fill="none" stroke="#6d9a79" stroke-width="4"/><ellipse cx="271" cy="137" rx="12" ry="6" fill="#83b895"/><ellipse cx="412" cy="143" rx="13" ry="7" fill="#9bca99"/></g>';
 
 // Botanical accents use actual illustrated planters, anchored to corners and furniture.
 // Planters sit on the window ledge first, then the reading nook / arcade corners.
 const plantPositions=[[293,187],[340,187],[389,187],[75,319],[965,315],[251,318]];
 const count=Math.min(6,Math.max(2,Number(bag().plantCount)||3));
 for(let i=0;i<count;i++){
 const [px,py]=plantPositions[i];const scale=i<3?.65:.9;
 s+='<g transform="translate('+px+' '+py+') scale('+scale+')"><rect x="-16" y="0" width="32" height="31" rx="5" fill="'+(i%2?'#b699c7':'#cba58d')+'" stroke="#988a9e" stroke-width="2"/><path d="M0 3Q-31 -23 -16 -42M0 4Q29 -32 17 -44M0 4V-51" stroke="#618e75" stroke-width="4" fill="none"/><ellipse cx="-16" cy="-32" rx="13" ry="7" fill="#80b293" transform="rotate(23 -16 -32)"/><ellipse cx="17" cy="-37" rx="13" ry="7" fill="#7fae88" transform="rotate(-27 17 -37)"/><ellipse cx="0" cy="-49" rx="10" ry="6" fill="#a6cba1"/></g>';
 }

 const decor=chosen('receptionDecor');const src=window.VPQ_RECEPTION_MODULAR_ASSETS?.manifest?.[decor]?.src;if(src)s+=pic(src,716,349,67,56);
 const reward=levelArtItems().find(x=>x.id===chosen('levelReward'));if(reward){const glyph=reward.furnitureGlyph||'⭐';s+='<g transform="translate(573 349)"><rect width="67" height="56" rx="12" fill="#f2e5f7" stroke="#a18fbc" stroke-width="4"/><text x="33" y="39" font-size="34" text-anchor="middle">'+h(glyph)+'</text></g>'}
 return s+'</g>';
}
const oldArt=art.roomArt.bind(art);
art.roomArt=function(k){
 const svg=oldArt(k);if(k!=='study')return svg;
 // Place the terrarium AFTER the bookshelf, before the study-board and sofa.
 // Drawing it before the bookshelf covered the animal and almost all of the glass.
 const afterBooks='<g transform="translate(426 88) scale(.77 1)">';
 let withHabitat=svg.includes(afterBooks)?svg.replace(afterBooks,habitat()+afterBooks):svg;
 if(chosen('coffee')==='lounge-coffee-deluxe')withHabitat=withHabitat.replace(/<g transform="translate\(352 223\) scale\(1\.12\)">[\s\S]*?<\/g>/,'');
 if(['lounge-egg-chair','lounge-hanging-chair'].includes(chosen('seating')))withHabitat=withHabitat.replace(/<ellipse cx="178" cy="449"[\s\S]*?(?=<g transform="translate(723 169) scale(.72 .82)">)/,'');
 return withHabitat.replace(/<\/svg>\s*$/,svgDecor()+'</svg>');
};
function buttons(){
 stage.querySelector('#vpqLoungeDecorButtons')?.remove();
 if(stage.dataset.room!=='study')return;
 const node=document.createElement('div');node.id='vpqLoungeDecorButtons';
 node.innerHTML='<button type="button" class="vpqLoungeDecorBtn" data-vpqloungedecor-open="1">🌿 Decorate Lounge</button>';
 node.addEventListener('click',e=>{if(e.target.closest('[data-vpqloungedecor-open]'))studio()});
 stage.append(node);
}
const style=document.createElement('style');style.textContent='#vpqLoungeDecorButtons{position:absolute;inset:0;pointer-events:none;z-index:9}.vpqLoungeDecorBtn{pointer-events:auto;position:absolute;top:2.5%;left:19%;padding:7px 10px;border-radius:12px;border:2px solid #79a894;background:#fbfff2;color:#3e6f5b;font-size:12px;font-weight:900;box-shadow:0 3px 7px #53666544;cursor:pointer}.vpqLoungeDecorBtn:hover,.vpqLoungeDecorBtn:focus-visible{background:#e9f9df;border-color:#448d70}';document.head.appendChild(style);
const observer=new MutationObserver(()=>{if((stage.dataset.room==='study')!==!!stage.querySelector('#vpqLoungeDecorButtons'))buttons()});observer.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
body.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.vpqloungedecorOpen!==undefined){e.preventDefault();studio()}
 if(d.vpqloungedecorFilter!==undefined){e.preventDefault();studio(d.vpqloungedecorFilter)}
 else if(d.vpqloungedecorEquip!==undefined){e.preventDefault();equip(d.vpqloungedecorEquip)}
 else if(d.vpqloungedecorBuy!==undefined){e.preventDefault();buy(d.vpqloungedecorBuy)}
 else if(d.vpqloungedecorPlants!==undefined){e.preventDefault();bag().plantCount=Math.min(6,Math.max(2,Number(d.vpqloungedecorPlants)||3));save();studio('plants')}
 else if(d.vpqloungedecorReset!==undefined){e.preventDefault();state.studyLoungeDecor={...defaults};save();studio('owned')}
 else if(d.vpqloungedecorCollection!==undefined){e.preventDefault();window.VPQ_OPEN_MY_COLLECTION?.()}
 else if(d.vpqloungedecorShop!==undefined){e.preventDefault();changeRoom('reception');api.doAction('receptionStudio')}
},true);
buttons();return {studio,refresh:buttons,items};
};