/* Student Lounge decoration studio. Shared ownership; independent lounge placements. */
window.VPQ_STUDY_LOUNGE_DECOR=function(api){
'use strict';
const {state,persist,updateHUD,renderRoom,showModal,changeRoom}=api;
const stage=document.getElementById('stage'), art=window.VPQ_SCENERY,body=document.getElementById('modalBody');
if(!stage||!art||!body)return null;
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const items=[
{id:'lounge-coffee-deluxe',slot:'coffee',min:3},{id:'lounge-microwave',slot:'microwave',min:2},
{id:'lounge-snack-bin',slot:'snack',min:1},{id:'lounge-egg-chair',slot:'chair',min:4},
{id:'lounge-hanging-chair',slot:'chair',min:6},{id:'lounge-stools',slot:'stools',min:3},
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
 const options=[['all','All'],['owned','Owned'],['plants','Greenery'],['chair','Chairs'],['coffee','Coffee bar'],['habitat','Reptiles'],['receptionDecor','Shared Reception'],['levelReward','Level rewards']];
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
 let s='<g opacity=".97"><path d="M78 54q-7 30 6 56t0 53M925 53q-15 23-6 53t-3 30M326 55q12 19 0 44" fill="none" stroke="#568d79" stroke-width="5"/>';
 for(const [x,y] of [[79,79],[84,106],[87,133],[921,83],[918,107],[327,85],[342,68],[937,66],[71,61]])s+='<ellipse cx="'+x+'" cy="'+y+'" rx="12" ry="5" fill="#83b69b" transform="rotate(-35 '+x+' '+y+')"/>';
 s+='</g>';
 if(chosen('vines')==='lounge-vines')s+='<g><path d="M240 52q26 46 5 84M680 51q-30 38 0 82M300 55q-20 45 0 80" fill="none" stroke="#4b9875" stroke-width="5"/>'+Array.from({length:13},(_,i)=>'<ellipse cx="'+(240+(i%3)*9+(i>7?420:0))+'" cy="'+(55+i*6)+'" rx="10" ry="5" fill="'+(i%2?'#6da988':'#a1ceb0')+'"/>').join('')+'</g>';
 return s;
}
function habitat(){
 const del=chosen('habitat')==='lounge-reptile-deluxe';
 return '<g transform="translate(675 246)"><rect x="0" y="0" width="101" height="83" rx="9" fill="#6d9a85" stroke="#658374" stroke-width="5"/><rect x="7" y="6" width="87" height="61" rx="5" fill="#dff5dc" stroke="#a0c4a6" stroke-width="3"/><path d="M8 51q43 -20 85 0v16H8Z" fill="#bbac84"/><path d="M15 44q4 -22 22 -16m30 16q0 -26 13 -33" fill="none" stroke="#729b6d" stroke-width="5"/><path d="M30 57q19 -15 34 -2l10 2-9 9H40Z" fill="#89ab75" stroke="#51735e" stroke-width="2"/><circle cx="66" cy="55" r="2" fill="#314e3d"/><path d="M9 29h84M50 6v60" stroke="#a3c7b2" stroke-width="2" opacity=".6"/><text x="50" y="79" text-anchor="middle" font-family="Arial" font-weight="900" font-size="10" fill="#f9fff4">'+(del?'BIOACTIVE HABITAT':'REPTILE CORNER')+'</text></g>';
}
function svgDecor(){
 let s='<g class="vpqLoungeDecorScenery">'+botanicals()+habitat();
 if(chosen('coffee')==='lounge-coffee-deluxe')s+='<g transform="translate(274 270)"><rect width="58" height="40" rx="7" fill="#9bb6b7" stroke="#718e97" stroke-width="4"/><rect x="9" y="9" width="40" height="11" rx="5" fill="#f1ebee"/><path d="M27 21v12" stroke="#fff" stroke-width="5"/><text x="29" y="8" text-anchor="middle" font-size="8" font-weight="800" fill="#4b6174">BARISTA</text></g>';
 if(chosen('microwave')==='lounge-microwave')s+='<g transform="translate(291 216)"><rect width="53" height="33" rx="5" fill="#e5c9dd" stroke="#ae92b4" stroke-width="3"/><rect x="7" y="6" width="31" height="20" rx="3" fill="#adcfda"/><circle cx="45" cy="11" r="3" fill="#fff"/><circle cx="45" cy="22" r="3" fill="#fff"/></g>';
 if(chosen('snack')==='lounge-snack-bin')s+='<g transform="translate(363 300)"><path d="M0 6H47L40 43H7Z" fill="#ddab85" stroke="#ab7a6a" stroke-width="3"/><text x="23" y="27" font-family="Arial" font-size="10" text-anchor="middle" fill="#fff" font-weight="900">SNACKS</text><text x="8" y="6" font-size="21">🍎</text><text x="22" y="6" font-size="20">🥨</text></g>';
 if(chosen('chair')==='lounge-egg-chair')s+='<g transform="translate(34 221)"><path d="M80 0v33" stroke="#806d8d" stroke-width="6"/><ellipse cx="80" cy="118" rx="70" ry="83" fill="#c39d7d" stroke="#8a6f65" stroke-width="8"/><ellipse cx="80" cy="125" rx="51" ry="63" fill="#f7e7dd"/><ellipse cx="80" cy="150" rx="49" ry="31" fill="#d8bcd9"/><path d="M80 201v21" stroke="#876b77" stroke-width="6"/></g>';
 if(chosen('chair')==='lounge-hanging-chair')s+='<g transform="translate(43 234)"><path d="M78 0v50" stroke="#876f99" stroke-width="6"/><path d="M18 83Q78 182 138 83" stroke="#a57cbe" stroke-width="13" fill="none"/><path d="M27 82Q78 151 131 82" stroke="#e8cfe5" stroke-width="18" fill="none"/><path d="M40 82Q78 117 118 82" stroke="#fff1de" stroke-width="18" fill="none"/></g>';
 if(chosen('stools')==='lounge-stools')for(const x of [408,592])s+='<g transform="translate('+x+' 385)"><ellipse cx="0" cy="0" rx="25" ry="11" fill="#a991c8" stroke="#786c96" stroke-width="4"/><path d="M-14 9l-8 48M14 9l8 48" stroke="#9c806e" stroke-width="6"/></g>';
 if(chosen('magazines')==='lounge-magazines')s+='<g transform="translate(398 351) rotate(-12)"><rect width="56" height="36" rx="3" fill="#bd9ac9" stroke="#8d77a6" stroke-width="2"/><rect x="7" y="6" width="42" height="24" rx="2" fill="#f4e9f4"/><text x="27" y="17" font-size="8" font-weight="900" text-anchor="middle" fill="#72558e">VET MED</text><text x="27" y="26" font-size="8" text-anchor="middle" fill="#72558e">JOURNAL</text></g>';
 if(chosen('table')==='lounge-coffee-table')s+='<g transform="translate(163 418)"><ellipse rx="72" ry="13" fill="#cfa884" stroke="#9b756e" stroke-width="5"/><path d="M-47 8v28M47 8v28" stroke="#96786e" stroke-width="7"/></g>';
 const plant=chosen('receptionPlants');if(plant!=='none'&&plantLibrary().includes(plant))s+=pic('assets/reception/'+plant+'.svg',628,315,83,108);
 const extra=chosen('plants')==='lounge-planter-pack';if(extra)s+='<g><text x="666" y="310" font-size="45">🪴</text><text x="231" y="313" font-size="39">🌿</text><text x="958" y="323" font-size="42">🌱</text></g>';
 if(!extra)s+='<g><text x="670" y="316" font-size="36">🪴</text><text x="960" y="323" font-size="31">🌿</text></g>';
 const plantPositions=[[248,315],[619,321],[965,321],[369,239],[917,211],[75,285]];const count=Math.min(6,Math.max(2,Number(bag().plantCount)||3));for(let i=0;i<count;i++){const [px,py]=plantPositions[i];s+='<text x="'+px+'" y="'+py+'" font-size="'+(i%2?31:37)+'" text-anchor="middle">'+(['🌿','🪴','🌱'][i%3])+'</text>'}
 const decor=chosen('receptionDecor');const src=window.VPQ_RECEPTION_MODULAR_ASSETS?.manifest?.[decor]?.src;if(src)s+=pic(src,559,313,88,68);
 const reward=levelArtItems().find(x=>x.id===chosen('levelReward'));if(reward){const glyph=reward.furnitureGlyph||'⭐';s+='<g transform="translate(573 349)"><rect width="67" height="56" rx="12" fill="#f2e5f7" stroke="#a18fbc" stroke-width="4"/><text x="33" y="39" font-size="34" text-anchor="middle">'+h(glyph)+'</text></g>'}
 return s+'</g>';
}
const oldArt=art.roomArt.bind(art);
art.roomArt=function(k){const svg=oldArt(k);return k==='study'?svg.replace(/<\/svg>\s*$/,svgDecor()+'</svg>'):svg};
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