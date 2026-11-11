/* Reception customization v1 — mounted by the main clinic's game engine. */
window.VPQReceptionCreate=function(api){
'use strict';
const {state,persist,updateHUD,renderRoom,showModal,escapeHtml,ROOMS}=api;
const catalog=[
{id:'paint-peach',name:'Peach clinic',type:'wall',price:0,color:'#fef2e7',pattern:'solid',icon:'🍑'},
{id:'paint-mint',name:'Soft mint',type:'wall',price:0,color:'#dcf5ea',pattern:'solid',icon:'🌿'},
{id:'paint-blue',name:'Sky blue',type:'wall',price:0,color:'#e0f1ff',pattern:'solid',icon:'🩵'},
{id:'paint-lavender',name:'Lavender',type:'wall',price:0,color:'#f0e5ff',pattern:'solid',icon:'💜'},
{id:'wall-floral',name:'Spring floral wallpaper',type:'wall',price:35,color:'#fce4ed',pattern:'floral',icon:'🌸'},
{id:'wall-halloween',name:'Halloween wallpaper',type:'wall',price:50,color:'#f5d8bb',pattern:'halloween',icon:'🎃'},
{id:'wall-pride',name:'Community & Pride wallpaper',type:'wall',price:40,color:'#f7edff',pattern:'pride',icon:'🌈'},
{id:'wall-winter',name:'Winter lights wallpaper',type:'wall',price:45,color:'#e3f1ff',pattern:'winter',icon:'❄️'},
{id:'decor-cat',name:'Calm cat corner',type:'decor',price:50,icon:'🐈',detail:'Quiet retreat with hiding spaces and a species-separated waiting area.'},
{id:'decor-kids',name:'Kids reading and play corner',type:'decor',price:45,icon:'🧸',detail:'Visible caregiver-supervised corner with books, easy-clean toys and seating.'},
{id:'decor-pumpkin',name:'Pumpkin display',type:'decor',price:20,icon:'🎃',detail:'Seasonal reception decoration.'},
{id:'decor-rainbow',name:'Pride/community board',type:'decor',price:20,icon:'🌈',detail:'Optional year-round inclusive community decoration.'},
{id:'decor-holiday',name:'Winter lights',type:'decor',price:25,icon:'✨',detail:'Non-denominational winter lights; more inclusive holiday collections are planned.'},
{id:'seat-sofa-lavender',name:'Lavender waiting-room sofa',type:'furniture',price:0,icon:'🛋️',detail:'Free cushioned three-seat sofa with arms, backrest and legs. Included in the waiting room.'},
{id:'seat-sofa-sage',name:'Sage green sofa',type:'furniture',price:45,icon:'🛋️',detail:'Sage upholstered waiting-room sofa. Replaces the current sofa; owned styles can be switched freely.'},
{id:'seat-sofa-blue',name:'Blue cloud sofa',type:'furniture',price:50,icon:'🛋️',detail:'Soft blue waiting-room sofa. Replaces the current sofa; owned styles can be switched freely.'},
{id:'decor-planter',name:'Floor plant & planter',type:'decor',price:25,icon:'🪴',detail:'A tall clinic-safe corner plant display beside the waiting-room seating.'},
{id:'decor-plant-pair',name:'Two leafy plants',type:'decor',price:35,icon:'🌿',detail:'Two leafy plants to soften the reception waiting area.'},
{id:'decor-cat-tree',name:'Cat tree with hideout',type:'decor',price:65,icon:'🐈',detail:'Climbing platforms, scratching posts and a cozy hiding cubby for the cat waiting corner.'},
{id:'decor-carrier',name:'Cat carrier',type:'decor',price:20,icon:'🐈',detail:'A secure waiting-room cat carrier, placed near the cat-friendly corner.'},
{id:'decor-dog-carrier',name:'Dog travel crate',type:'decor',price:30,icon:'🐕',detail:'A sturdy travel crate for a waiting-room dog vignette.'},
{id:'decor-pet-art',name:'Framed pet portraits',type:'decor',price:30,icon:'🖼️',detail:'A little gallery of cheerful framed dog and cat art on the clinic walls.'},
{id:'decor-paw-art',name:'Paw-print mural',type:'decor',price:20,icon:'🐾',detail:'Small painted paw-print wall art, safely above the furniture.'}
];
const free=catalog.filter(x=>x.price===0).map(x=>x.id);
const sofaIds=catalog.filter(x=>x.type==='furniture').map(x=>x.id);
if(!state.receptionCollection||typeof state.receptionCollection!=='object')state.receptionCollection={owned:[],equippedWall:'paint-peach',placed:[],transactions:[]};
const bag=state.receptionCollection;
bag.owned=Array.isArray(bag.owned)?bag.owned:[];
bag.placed=Array.isArray(bag.placed)?bag.placed:[];
bag.transactions=Array.isArray(bag.transactions)?bag.transactions:[];
bag.owned=[...new Set([...free,...bag.owned.filter(x=>catalog.some(c=>c.id===x))])];
// Existing saves inherit the free sofa; sofa style is a single-selection furniture slot.
if(!bag.placed.some(id=>sofaIds.includes(id)))bag.placed.push('seat-sofa-lavender');
if(bag.placed.filter(id=>sofaIds.includes(id)).length>1){const last=bag.placed.filter(id=>sofaIds.includes(id)).slice(-1)[0];bag.placed=bag.placed.filter(id=>!sofaIds.includes(id)||id===last)}
if(!bag.owned.includes(bag.equippedWall))bag.equippedWall='paint-peach';
bag.placed=bag.placed.filter(x=>bag.owned.includes(x));
const first=s=>escapeHtml(String(s??''));
const itemArt={
 'decor-planter':'assets/reception/decor-planter.svg',
 'decor-pumpkin':'assets/reception/decor-pumpkin.svg',
 'decor-cat-tree':'assets/reception/decor-cat-tree.svg'
};
const find=id=>catalog.find(x=>x.id===id);
const equipped=id=>find(id)?.type==='wall'?bag.equippedWall===id:bag.placed.includes(id);
function persistLocal(){persist();updateHUD();if(state.room==='reception')renderRoom()}
function appendTransaction(item){bag.transactions.unshift({id:item.id,price:item.price,kind:'purchase',date:new Date().toISOString()});bag.transactions=bag.transactions.slice(0,100);persistLocal()}
function preview(id){const item=find(id);if(!item)return;
const owned=bag.owned.includes(id),active=equipped(id),able=state.coins>=item.price;
const scene=itemArt[id]?'<div class="vpqRPreview" style="background:#faf3f9"><img src="'+itemArt[id]+'" alt="'+first(item.name)+'" style="height:160px;max-width:95%;object-fit:contain"><small>Actual room decoration artwork · transparent asset</small></div>':'<div class="vpqRPreview" style="background:'+first(item.color||'#f5e9da')+'"><div class="vpqRPreviewIcons">'+first(item.icon)+' <span>🛎️ 🐕</span> 🪑</div><small>Conceptual room/item preview · artwork update needed</small></div>';
showModal('🎨 Preview · '+first(item.name),'<p>'+first(item.detail||'Choose a color or theme for your waiting room.')+'</p>'+scene+
'<p><b>'+ (owned?'Already owned':item.price+' 🪙')+'</b> · Current coin balance: '+state.coins+'</p>'+
'<div class="buttonrow">'+(owned?'<button data-vpqr-equip="'+item.id+'">'+(active?(item.type==='wall'?'Currently equipped':item.type==='furniture'?'Current sofa':'Remove from room'):(item.type==='wall'?'Apply wallpaper':item.type==='furniture'?'Use this sofa':'Place in reception'))+'</button>': '<button data-vpqr-buy="'+item.id+'" '+(!able?'disabled':'')+'>Confirm purchase · '+item.price+' 🪙</button>')+
'<button data-vpqr-menu="1">← Shop / Collection</button></div>'+
(!owned&&!able?'<p class="small">Not enough earned coins yet. Play learning rounds to earn more; no real-money purchases.</p>':''));
}
function claimTestCoins(){
 // One grant per local save, kept distinct from first-mastery study rewards.
 if(state.receptionTestCoins500Claimed)return wallet();
 state.receptionTestCoins500Claimed=true;
 state.coins=Math.max(0,Number(state.coins)||0)+500;
 bag.transactions.unshift({id:'test-coins-500',price:-500,kind:'test-grant',date:new Date().toISOString()});
 bag.transactions=bag.transactions.slice(0,100);
 persistLocal();wallet();
}
function wallet(){showModal('🪙 Clinic Coin Bank','<div class="infobox"><h2>'+state.coins+' 🪙 available</h2><p>Coins earned in the existing game remain your balance. Purchases here use the same wallet; no premium currency.</p></div>'+
'<p><b>🧪 Decoration testing:</b> '+(state.receptionTestCoins500Claimed?'✓ 500 test coins already claimed in this browser save':'Claim a one-time 500-coin bonus to try reception, cat-corner and yard purchases')+'</p>'+(state.receptionTestCoins500Claimed?'':'<button data-vpqr-testcoins="1">🪙 Claim 500 test coins</button>')+'<h3>Recent reception purchases / testing grants</h3>'+(bag.transactions.length?bag.transactions.slice(0,15).map(x=>'<p>'+(x.kind==='test-grant'?'+500 coins · 🧪 Test grant':'−'+x.price+' coins · '+first(find(x.id)?.name||x.id))+' <small>'+first(x.date.slice(0,10))+'</small></p>').join(''):'<p>No reception purchases yet. Historical coin earnings before this feature were not tracked separately.</p>')+
'<div class="buttonrow"><button data-vpqr-menu="1">🎨 Shop and collection</button><button data-vpqr-yard="1">🐕 Kennel & play yard preview</button></div>')}
function menu(filter='all'){const visible=catalog.filter(x=>filter==='all'||filter==='owned'&&bag.owned.includes(x.id)||filter==='wall'&&x.type==='wall'||filter==='decor'&&x.type==='decor'||filter==='furniture'&&x.type==='furniture');
showModal('🎨 Reception Studio · Shop & Collection','<div class="infobox"><b>🪙 '+state.coins+' clinic coins</b> · '+bag.owned.length+' / '+catalog.length+' items owned · '+bag.placed.length+' placed <button data-vpqr-wallet="1">🪙 Coin Bank / Testing Bonus</button></div>'+
'<p>Choose Sofas, Decor or Wallpapers. Purchased sofas and decorations are placed in the waiting room automatically; wallpapers are applied after purchase. Open My collection to remove decorations or change owned sofa styles at no extra cost. All choices are saved in this browser.</p>'+
'<div class="vpqRFilters"><button data-vpqr-filter="all">All items</button><button data-vpqr-filter="wall">Wallpapers</button><button data-vpqr-filter="furniture">Sofas</button><button data-vpqr-filter="decor">Decor</button><button data-vpqr-filter="owned">My collection</button></div>'+
'<div class="vpqRCatalog">'+visible.map(x=>'<button data-vpqr-preview="'+x.id+'">'+(itemArt[x.id]?'<img src="'+itemArt[x.id]+'" alt="" style="height:85px;width:100%;object-fit:contain;background:#fdf8fc;border-radius:9px">':'<span class="vpqRIcon">'+first(x.icon)+'</span>')+'<b>'+first(x.name)+'</b><small>'+(equipped(x.id)?'✓ In reception':bag.owned.includes(x.id)?'Owned · reusable':x.price+' 🪙')+'</small><em>Preview</em></button>').join('')+'</div>'+
'<div class="vpqRPend"><b>🐕 Kennel & Cat Corner</b><p>Visit the existing dog play-yard view and quiet cat corner to use their own decoration slots and FAS learning stations. Yard and cat accessories are tracked separately from Reception Studio purchases.</p><button data-vpqr-yard="1">Learn about annex upgrades</button></div>');
}
function yard(){showModal('🐕 Kennel & Cat Corner · Room upgrades','<h3>Two existing annex spaces</h3><p><b>Dog Yard:</b> FAS rounds, fenced scenery and play-yard cosmetic purchases. <b>Quiet Cat Corner:</b> feline FAS rounds, climbing shelves and cat enrichment cosmetics.</p><p>Use the illustrated hallway/room map to reach these spaces. Your reception sofa, wallpapers and decorations remain a separate collection.</p><button data-vpqr-menu="1">← Reception Studio</button>')}
function apply(id){const x=find(id);if(!x||!bag.owned.includes(id))return;
if(x.type==='wall')bag.equippedWall=id;
else if(x.type==='furniture')bag.placed=[...bag.placed.filter(v=>!sofaIds.includes(v)),id];
else if(bag.placed.includes(id))bag.placed=bag.placed.filter(v=>v!==id);else bag.placed.push(id);
persistLocal();preview(id);
}
function buy(id){const item=find(id);if(!item||bag.owned.includes(id)||item.price<=0||state.coins<item.price)return;
state.coins-=item.price;bag.owned.push(id);
if(item.type==='wall')bag.equippedWall=id;
else if(item.type==='furniture')bag.placed=[...bag.placed.filter(v=>!sofaIds.includes(v)),id];
else if(item.type==='decor'&&!bag.placed.includes(id))bag.placed.push(id);
appendTransaction(item);preview(id);
}
const prevAction=api.getAction();
api.setAction(function(action){if(action==='receptionStudio')return menu();if(action==='receptionYard')return yard();if(action==='receptionBank')return wallet();return prevAction(action)});
const props=ROOMS.reception.props;
props[0].x=12;props[1].x=31;props[2].x=51;
props.push({x:72,emoji:'🎨',label:'Reception Studio',bubble:'Decorate',action:'receptionStudio'});
props.push({x:91,emoji:'🐕',label:'Kennel & yard',bubble:'Coming soon',action:'receptionYard'});
// Replace only the reception SVG wall fill (not scenery or navigation).
const oldArt=window.VPQ_SCENERY.roomArt.bind(window.VPQ_SCENERY);
window.VPQ_SCENERY.roomArt=function(k){
let art=oldArt(k);if(k!=='reception')return art;
const wall=find(bag.equippedWall)||catalog[0];
const motifs={solid:'',floral:'🌸',halloween:'🎃',pride:'🌈',winter:'❄️'};
const m=motifs[wall.pattern];
const pattern=m?'<g opacity=".2" font-size="45" aria-hidden="true"><text x="100" y="120">'+m+'</text><text x="360" y="225">'+m+'</text><text x="690" y="115">'+m+'</text><text x="890" y="245">'+m+'</text></g>':'';
art=art.replace(/<rect width="1000" height="385" fill="[^"]+"\/>/,'<rect width="1000" height="385" fill="'+wall.color+'"/>'+pattern);
const decorSlots={
 'decor-cat':[85,325,49],'decor-kids':[906,339,44],'decor-pumpkin':[822,381,33],
 'decor-rainbow':[116,113,38],'decor-holiday':[899,110,38],
 'decor-planter':[935,340,46],'decor-plant-pair':[744,348,41],
 'decor-cat-tree':[165,313,45],'decor-carrier':[293,400,39],
 'decor-dog-carrier':[670,403,39],'decor-pet-art':[220,123,36],
 'decor-paw-art':[776,138,37]
};
// Named placement slots keep every owned decoration visible in classic reception;
// do not truncate to five items or relocate purchases based on unrelated additions.
const decoration=bag.placed.filter(id=>find(id)?.type==='decor'&&decorSlots[id]&&!['decor-planter','decor-pumpkin','decor-cat-tree'].includes(id)).map(id=>{const item=find(id),point=decorSlots[id];return '<text x="'+point[0]+'" y="'+point[1]+'" font-size="'+point[2]+'" text-anchor="middle" aria-label="'+first(item.name)+'">'+first(item.icon)+'</text>'}).join('');
art=art.replace('</svg>',decoration+'</svg>');return art;
};
document.getElementById('modalBody').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
if(d.vpqrMenu!==undefined)return menu();
if(d.vpqrWallet!==undefined)return wallet();
if(d.vpqrTestcoins!==undefined)return claimTestCoins();
if(d.vpqrYard!==undefined)return yard();
if(d.vpqrFilter!==undefined)return menu(d.vpqrFilter);
if(d.vpqrPreview!==undefined)return preview(d.vpqrPreview);
if(d.vpqrEquip!==undefined)return apply(d.vpqrEquip);
if(d.vpqrBuy!==undefined)return buy(d.vpqrBuy);
});
const style=document.createElement('style');style.textContent='.vpqRFilters,.vpqRCatalog{display:grid;gap:9px}.vpqRFilters{grid-template-columns:repeat(5,minmax(0,1fr));margin:12px 0}.vpqRFilters button{font-size:12px;padding:8px 3px}.vpqRCatalog{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}.vpqRCatalog button{background:#fff;text-align:left;border-radius:12px;padding:12px}.vpqRCatalog b,.vpqRCatalog small,.vpqRCatalog em{display:block}.vpqRCatalog em{font-style:normal;font-size:11px;color:#447596}.vpqRIcon{font-size:35px;display:block}.vpqRPend{margin-top:17px;padding:14px;background:#f4effd;border-radius:12px}.vpqRPreview{min-height:175px;display:flex;flex-direction:column;align-items:center;justify-content:space-around;border:6px solid white;outline:1px solid #c9cde4;border-radius:15px}.vpqRPreviewIcons{font-size:45px}.vpqRPreviewIcons span{font-size:32px}.vpqRPreview small{font-size:11px;background:#ffffffc4;padding:5px}.vpqRCatalog small{font-size:11px;margin:5px 0}@media(max-width:480px){.vpqRFilters{grid-template-columns:repeat(2,minmax(0,1fr))}}';document.head.appendChild(style);
persist();
return {catalog,menu,wallet,yard};
};
