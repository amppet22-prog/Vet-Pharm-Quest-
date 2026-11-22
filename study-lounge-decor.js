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
 // Left wall, behind the couch: proper stand, shaded basking rock and visible lizard.
 return '<g transform="translate(19 185)"><ellipse cx="69" cy="141" rx="64" ry="10" fill="#827884" opacity=".16"/>'+
 '<rect x="7" y="4" width="128" height="108" rx="9" fill="#5e8079" stroke="#557a79" stroke-width="6"/>'+
 '<rect x="15" y="12" width="112" height="84" rx="5" fill="#d6e7c6" stroke="#b5c9b0" stroke-width="3"/>'+
 '<path d="M17 73Q72 60 125 76V95H17Z" fill="#d0b58a"/>'+
 '<path d="M22 70Q43 56 64 62L84 43L110 51L121 71Z" fill="#aa9876" stroke="#938365" stroke-width="2"/>'+
 '<path d="M25 67q-2 -23 13 -36M112 65q-5 -28 3 -41" stroke="#6d9b67" stroke-width="4" fill="none"/>'+
 '<ellipse cx="43" cy="39" rx="9" ry="5" fill="#8fbf82"/><ellipse cx="112" cy="39" rx="12" ry="7" fill="#81af7f"/>'+
 // Lizard silhouette: body, legs, tail, head and eye.
 '<path d="M46 69Q61 54 83 61Q93 60 100 55Q108 53 111 60Q109 68 97 67L89 72Q71 81 57 73Q46 80 31 83Q43 73 46 69Z" fill="#74a46c" stroke="#47765a" stroke-width="2"/>'+
 '<path d="M62 72l-8 11m27 -11 9 10M97 65l5 6" stroke="#47765a" stroke-width="3" stroke-linecap="round"/>'+
 '<circle cx="106" cy="60" r="2" fill="#263e32"/>'+
 (deluxe?'<path d="M17 24h108" stroke="#c2e6cd" stroke-width="4" opacity=".8"/><circle cx="72" cy="21" r="8" fill="#f3d99d"/><path d="M25 57q-10 -25 5 -35" stroke="#638e69" stroke-width="4" fill="none"/>':'')+
 '<path d="M71 12v83" stroke="#aac8bb" stroke-width="3" opacity=".35"/>'+
 '<rect x="1" y="112" width="142" height="13" rx="4" fill="#bc9a80" stroke="#9c7f70" stroke-width="3"/>'+
 '<path d="M14 125v25M127 125v25" stroke="#997968" stroke-width="8"/>'+
 '<text x="72" y="121" font-family="Arial" font-size="9" font-weight="900" text-anchor="middle" fill="#fff5e6">'+(deluxe?'BIOACTIVE LIZARD HABITAT':'LIZARD HABITAT')+'</text></g>';
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
 // Layer the terrarium BEHIND the sofa and bookshelf instead of over them.
 const couchAnchor='<ellipse cx="180" cy="444"';
 let withHabitat=svg.includes(couchAnchor)?svg.replace(couchAnchor,habitat()+couchAnchor):svg;
 if(chosen('coffee')==='lounge-coffee-deluxe')withHabitat=withHabitat.replace(/<g transform="translate\(352 223\) scale\(1\.12\)">[\s\S]*?<\/g>/,'');
 if(['lounge-egg-chair','lounge-hanging-chair'].includes(chosen('seating')))withHabitat=withHabitat.replace(/<ellipse cx="180" cy="444"[\s\S]*?(?=<!-- Skills practice nook|<g><rect x="722" y="90")/,'');
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