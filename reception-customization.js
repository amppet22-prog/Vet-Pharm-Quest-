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
const wallpaperArt={
 'wall-halloween':'assets/reception/theme-wall-halloween.svg',
 'wall-winter':'assets/reception/theme-wall-winter.svg',
 'wall-pride':'assets/reception/theme-wall-pride.svg',
 'wall-floral':'assets/reception/theme-wall-spring.svg'
};
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
const find=id=>catalog.find(x=>x.id===id);
const equipped=id=>find(id)?.type==='wall'?bag.equippedWall===id:bag.placed.includes(id);
function persistLocal(){persist();updateHUD();if(state.room==='reception')renderRoom()}
function appendTransaction(item){bag.transactions.unshift({id:item.id,price:item.price,kind:'purchase',date:new Date().toISOString()});bag.transactions=bag.transactions.slice(0,100);persistLocal()}
function preview(id){const item=find(id);if(!item)return;
const owned=bag.owned.includes(id),active=equipped(id),able=state.coins>=item.price;
const scene=wallpaperArt[id]?'<div class="vpqRPreview" style="background:#fff7f5"><img src="'+wallpaperArt[id]+'" alt="'+first(item.name)+' pattern" style="width:100%;max-height:215px;object-fit:cover;border-radius:9px"><small>Actual wallpaper pattern · will appear behind the reception furniture and doors</small></div>':'<div class="vpqRPreview" style="background:'+first(item.color||'#f5e9da')+'"><div class="vpqRPreviewIcons">'+first(item.icon)+' <span>🛎️ 🐕</span> 🪑</div><small>Conceptual room/item preview</small></div>';
showModal('🎨 Preview · '+first(item.name),'<p>'+first(item.detail||'Choose a color or theme for your waiting room.')+'</p>'+scene+
'<p><b>'+ (owned?'Already owned':item.price+' 🪙')+'</b> · Current coin balance: '+state.coins+'</p>'+
'<div class="buttonrow">'+(owned?'<button data-vpqr-equip="'+item.id+'">'+(active?(item.type==='wall'?'Currently equipped':item.type==='furniture'?'Current sofa':'Remove from room'):(item.type==='wall'?'Apply wallpaper':item.type==='furniture'?'Use this sofa':'Place in reception'))+'</button>': '<button data-vpqr-buy="'+item.id+'" '+(!able?'disabled':'')+'>Confirm purchase · '+item.price+' 🪙</button>')+
'<button data-vpqr-menu="1">← Shop / Collection</button></div>'+
(!owned&&!able?'<p class="small">Not enough earned coins yet. Play learning rounds to earn more; no real-money purchases.</p>':''));
}
function claimTestCoins(){
 // 500 coins one time per existing browser save. Does not alter study rewards.
 if(state.receptionTestCoins500Claimed)return wallet();
 state.receptionTestCoins500Claimed=true;
 state.coins=Math.max(0,Number(state.coins)||0)+500;
 bag.transactions.unshift({id:'test-coins-500',price:-500,kind:'test-grant',date:new Date().toISOString()});
 bag.transactions=bag.transactions.slice(0,100);
 persistLocal();
 wallet();
}
function wallet(){showModal('🪙 Clinic Coin Bank','<div class="infobox"><h2>'+state.coins+' 🪙 available</h2><p>Coins earned in the existing game remain your balance. Purchases here use the same wallet; no premium currency.</p></div>'+
'<p><b>🧪 Testing bonus:</b> '+(state.receptionTestCoins500Claimed?'✓ Your one-time 500-coin bonus was claimed':'You can add 500 coins once to test decorations')+'</p>'+(state.receptionTestCoins500Claimed?'':'<button data-vpqr-testcoins="1">🪙 Claim 500 Test Coins</button>')+'<h3>Recent purchases / testing bonuses</h3>'+(bag.transactions.length?bag.transactions.slice(0,15).map(x=>'<p>'+(x.kind==='test-grant'?'+500 coins · 🧪 Test bonus':'−'+x.price+' coins · '+first(find(x.id)?.name||x.id))+' <small>'+first(x.date.slice(0,10))+'</small></p>').join(''):'<p>No reception purchases yet. Historical coin earnings before this feature were not tracked separately.</p>')+
'<div class="buttonrow"><button data-vpqr-menu="1">🎨 Shop and collection</button><button data-vpqr-yard="1">🐕 Kennel & play yard preview</button></div>')}
function menu(filter='all'){const visible=catalog.filter(x=>filter==='all'||filter==='owned'&&bag.owned.includes(x.id)||filter==='wall'&&x.type==='wall'||filter==='decor'&&x.type==='decor'||filter==='furniture'&&x.type==='furniture');
showModal('🎨 Reception Studio · Shop & Collection','<div class="infobox"><b>🪙 '+state.coins+' clinic coins</b> · '+bag.owned.length+' / '+catalog.length+' items owned <button data-vpqr-wallet="1">Open coin bank</button></div>'+
'<p>Choose Sofas, Decor or Wallpapers. Purchased sofas and decorations are placed in the waiting room automatically; wallpapers are applied after purchase. Open My collection to remove decorations or change owned sofa styles at no extra cost. All choices are saved in this browser.</p>'+
'<div class="vpqRFilters"><button data-vpqr-filter="all">All items</button><button data-vpqr-filter="wall">Wallpapers</button><button data-vpqr-filter="furniture">Sofas</button><button data-vpqr-filter="decor">Decor</button><button data-vpqr-filter="owned">My collection</button></div>'+
'<div class="vpqRCatalog">'+visible.map(x=>'<button data-vpqr-preview="'+x.id+'">'+(wallpaperArt[x.id]?'<img src="'+wallpaperArt[x.id]+'" alt="" style="height:78px;width:100%;object-fit:cover;border-radius:8px;margin-bottom:6px">':'<span class="vpqRIcon">'+first(x.icon)+'</span>')+'<b>'+first(x.name)+'</b><small>'+(equipped(x.id)?'✓ In reception':bag.owned.includes(x.id)?'Owned · reusable':x.price+' 🪙')+'</small><em>Preview</em></button>').join('')+'</div>'+
'<div class="vpqRPend"><b>🐕 Kennel & 3D-style play yard — Coming Soon</b><p>Future fenced yard, dog behavior cases, enrichment, intake and safe isolation workflows. This is a preview only; no kennel has been purchased or built.</p><button data-vpqr-yard="1">See planned expansion</button></div>');
}
function yard(){showModal('🐕 Kennel & Play Yard · Coming Soon','<h3>Planned veterinary learning expansion</h3><p>A 2.5D dog play yard with fenced areas, individual kennel runs, enrichment upgrades and clinical learning stations for canine behavior, triage, parasite control and infection prevention.</p><p><b>Not yet playable:</b> no kennels, dog housing, purchases or clinical cases are enabled in this preview.</p><button data-vpqr-menu="1">← Reception Studio</button>')}
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
const actualWallpaper=wallpaperArt[wall.id]?'<image href="'+wallpaperArt[wall.id]+'" x="0" y="0" width="1000" height="385" preserveAspectRatio="none"/>':pattern;
art=art.replace(/<rect width="1000" height="385" fill="[^"]+"\/>/,'<rect width="1000" height="385" fill="'+wall.color+'"/>'+actualWallpaper);
const coords=[[8,35],[25,35],[43,35],[62,35],[78,35]];
const decoration=bag.placed.filter(id=>find(id)?.type==='decor').slice(0,5).map((id,i)=>{const item=find(id),point=coords[i];return item?'<text x="'+(point[0]*10)+'" y="'+(point[1]*10)+'" font-size="52">'+item.icon+'</text>':''}).join('');
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
