/* Reception customization v1 — mounted by the main clinic's game engine. */
window.VPQReceptionCreate=function(api){
'use strict';
const {state,persist,updateHUD,renderRoom,showModal,escapeHtml,ROOMS}=api;
const catalog=[
{id:"cat-hide-mushroom",name:"Strawberry mushroom hideaway",type:'catHide',price:46,icon:"🍄",detail:"Plush mushroom cubby with a dark enclosed resting spot and cushioned floor."},
{id:"cat-hide-cottage",name:"Fairy cottage kitty house",type:'catHide',price:55,icon:"🏡",detail:"An illustrated little pastel cottage for hiding and resting."},
{id:"cat-hide-pumpkin",name:"Harvest pumpkin hideout",type:'catHide',price:49,icon:"🎃",detail:"Warm pumpkin-inspired enclosed cat retreat with a soft floor."},
{id:"cat-climb-cloudsteps",name:"Puffy cloud climbing steps",type:'catAccess',price:48,icon:"☁️",detail:"Soft pastel stepped access to an elevated cat area; swaps with the other ramps or stairs."},
{id:"cat-climb-rainbowladder",name:"Rainbow climbing ladder",type:'catAccess',price:44,icon:"🌈",detail:"Colorful ladder to a safely reachable perch; shares the ramp and stairs slot."},
{id:"cat-climb-flowerbridge",name:"Blossom canopy bridge",type:'catBridge',price:59,icon:"🌸",detail:"Decorated stable aerial bridge; swaps with the other bridge styles."},
{id:"cat-climb-starbridge",name:"Midnight star bridge",type:'catBridge',price:62,icon:"🌟",detail:"Blue-purple elevated cat walkway with soft star details; swaps with other bridges."},
{id:"cat-hide-leafpod",name:"Leaf canopy hanging nest",type:'catHammock',price:58,icon:"🌿",detail:"Calm supported leaf-shaped elevated bed, swapping with the hammock."},
{id:"cat-enrich-stairs",name:"Pastel kitty staircase",type:'catAccess',price:42,icon:"🪜",detail:"Soft low steps for senior cats, kittens, and cats who prefer shorter climbs; swaps with ramp."},
{id:"cat-enrich-ramp",name:"Non-slip climbing ramp",type:'catAccess',price:45,icon:"🐾",detail:"An inclined non-slip route to elevated spots for feline mobility support; swaps with stairs."},
{id:"cat-enrich-bridge",name:"Cloud canopy wall bridge",type:'catBridge',price:55,icon:"☁️",detail:"Secure elevated bridge between perches with accessible routes and safe mounting."},
{id:"cat-enrich-tunnel",name:"Lavender crinkle play tunnel",type:'catTunnel',price:39,icon:"🌀",detail:"A soft tunnel for exploration, ambush-style play, and retreat."},
{id:"cat-enrich-puzzle",name:"Mint puzzle-feeder station",type:'catPuzzle',price:38,icon:"🧩",detail:"An adjustable food puzzle for foraging practice using the cat's appropriate diet."},
{id:"cat-enrich-wand",name:"Butterfly feather wand display",type:'catWand',price:25,icon:"🪶",detail:"A supervised teaser toy supporting stalk-chase-pounce-catch play; store strings after use."},
{id:"cat-enrich-hammock",name:"Rosy hanging cat hammock",type:'catHammock',price:52,icon:"🛏️",detail:"A supported, comfortable resting hammock with stable mounting and easy access."},
{id:"cat-enrich-scratchboard",name:"Sisal scratch mat",type:'catScratch',price:29,icon:"🐈",detail:"A textured horizontal scratching option for natural claw and scent-marking behavior."},
{id:"rug-celestial",name:"Celestial midnight rug",type:'rug',price:55,icon:"🌙",detail:"Moon and stars rug for the reception waiting area"},
{id:"rug-paws",name:"Blush paw-print rug",type:'rug',price:40,icon:"🐾",detail:"Pastel paw-print rug for the reception waiting area"},
{id:"rug-forest",name:"Boho forest rug",type:'rug',price:48,icon:"🌿",detail:"Soft green botanical waiting-room rug"},
{id:"rug-coffee",name:"Cozy café rug",type:'rug',price:42,icon:"☕",detail:"Warm neutral coffeehouse waiting-room rug"},
{id:"seat-sofa-rose",name:"Rose petal couch",type:'furniture',price:80,icon:"🛋️",detail:"Blush velvet couch with coordinating pillows"},
{id:"seat-sofa-midnight",name:"Midnight starlight couch",type:'furniture',price:95,icon:"🌙",detail:"Deep blue moonlit couch with contrasting cushions"},
{id:"seat-sofa-linen",name:"Boho linen couch",type:'furniture',price:75,icon:"🛋️",detail:"Cream and sage cozy sofa"},
{id:"cat-companion-tabby",name:"Sunny tabby companion",type:'catCompanion',price:40,icon:"🐈",detail:"Friendly orange tabby companion for the cat lounge"},
{id:"cat-companion-tuxedo",name:"Tuxedo companion",type:'catCompanion',price:45,icon:"🐈‍⬛",detail:"Black-and-white lounge companion"},
{id:"cat-companion-calico",name:"Calico companion",type:'catCompanion',price:45,icon:"🐈",detail:"Calico cat for the lounge"},
{id:"cat-companion-gray",name:"Silver gray companion",type:'catCompanion',price:45,icon:"🐈",detail:"Soft gray kitty for the lounge"},
{id:"cat-room-scratcher",name:"Cat lounge scratching tower",type:'catRoomToy',price:35,icon:"🐾",detail:"Dedicated scratcher and dangling toy in the cat lounge"},
{id:"cat-room-window",name:"Cat lounge sunshine window",type:'catRoomWindow',price:45,icon:"☀️",detail:"Calming window with trees and a low perch"},
{id:"cat-room-toy",name:"Cat lounge enrichment basket",type:'catRoomBasket',price:30,icon:"🧶",detail:"Small basket of feline enrichment toys"},
{id:'decor-paw-floor-lamp',name:'Pastel paw-print floor lamp',type:'floorLamp',price:38,icon:'💡',detail:'Tall lavender lamp with a warm paw-print shade beside the couch.'},
{id:'decor-pet-table-lamp',name:'Pet-heart tabletop lamp',type:'tableLamp',price:28,icon:'💡',detail:'Small pink and lavender accent lamp with pet silhouettes.'},
{id:'decor-paw-ottoman',name:'Quilted paw-print ottoman',type:'ottoman',price:40,icon:'🪑',detail:'Soft lilac footrest with blush paw-print cushion.'},
{id:'decor-donut-dog-bed',name:'Lavender donut dog bed',type:'dogBed',price:42,icon:'🐶',detail:'Soft low donut bed and bone toy in the dog-friendly nook.'},
{id:'decor-moon-cat-bed',name:'Moonlight crescent cat bed',type:'catBed',price:46,icon:'🐈',detail:'Pastel moon-shaped comfy cat bed with warm pink cushion.'},
{id:'decor-coffee-tray',name:'Cozy coffee-table accessory tray',type:'tableTop',price:30,icon:'☕',detail:'Veterinary books, warm mug and pet-safe styled greenery clustered on a decorative tray.'},
{id:'decor-coffee-table',name:'Cozy clinic coffee table',type:'coffeeTable',price:0,icon:'☕',detail:'Free starter coffee table in front of the waiting-room couch, with a magazine stack and a cup.'},
{id:'decor-coffee-table-cloud',name:'Cloud café coffee table',type:'coffeeTable',price:42,icon:'☁️',detail:'Soft pastel cloud-shaped upgrade for the waiting-room coffee-table space. Replaces the basic table.'},
{id:'decor-coffee-table-scifi',name:'Holographic science coffee table',type:'coffeeTable',price:65,icon:'🛸',detail:'Glowing futuristic coffee-table upgrade for the medical sci-fi reception theme. Replaces the other table.'},
{id:"decor-cat-blanket",name:"Blanket-wrapped comfort cat",type:'decor',price:28,icon:"🐈",detail:"A calm, illustrated kitty tucked inside a soft pastel blanket."},
{id:"decor-cat-carrier-cozy",name:"Cozy covered cat carrier",type:'decor',price:38,icon:"🐱",detail:"An alternative carrier with a breathable privacy cover for the feline waiting nook."},
{id:"decor-armchair",name:"Cozy reading armchair",type:'decor',price:45,icon:"🪑",detail:"A plush visitor chair to make the waiting room homier."},
{id:"decor-side-table",name:"Round tea side table",type:'decor',price:28,icon:"☕",detail:"Little round table with a veterinary magazine and plant."},
{id:"decor-bookcase",name:"Clinic bookshelf",type:'decor',price:55,icon:"📚",detail:"Curved wooden bookshelf filled with veterinary books and small decor."},
{id:"decor-scifi-testtubes",name:"Glowing test-tube rack",type:'decor',price:45,icon:"🧪",detail:"Colorful fantasy laboratory test tubes in an enclosed display."},
{id:"decor-scifi-alien",name:"Friendly alien visitor",type:'decor',price:55,icon:"👽",detail:"A smiling teal alien friend visiting the teaching hospital."},
{id:"decor-scifi-ufo",name:"Mini UFO specimen dome",type:'decor',price:60,icon:"🛸",detail:"Floating UFO model with glowing science beams and a glass dome."},
{id:"decor-scifi-planter",name:"Alien crystal planter",type:'decor',price:42,icon:"🪴",detail:"Bioluminescent fantasy crystals and cosmic leaves."},
{id:"decor-scifi-console",name:"Space lab holo-console",type:'decor',price:65,icon:"🧬",detail:"A softly glowing futuristic veterinary diagnostic console."},
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
{id:'decor-paw-art',name:'Paw-print mural',type:'decor',price:20,icon:'🐾',detail:'Small painted paw-print wall art, safely above the furniture.'},
{id:'decor-toy-bin',name:'Dog toy basket',type:'decor',price:30,icon:'🦴',detail:'Pastel toy basket with balls, tug toys and a happy dog motif.'},
{id:'decor-magazines',name:'Vet magazine collection',type:'decor',price:18,icon:'📚',detail:'Two illustrated veterinary reading magazines near the check-in desk.'},
{id:'decor-treat-display',name:'Treat display cabinet',type:'decor',price:45,icon:'🦴',detail:'A glass-front-style display of cute treat jars for reception.'},
{id:'decor-cat-tree-cloud',name:'Cloud cat climbing tower',type:'decor',price:70,icon:'🐈',detail:'Alternative fluffy cloud-style cat tree, which swaps with the original cat tree.'},
{id:'decor-cat-tree-castle',name:'Halloween castle cat tower',type:'decor',price:130,icon:'🐈',detail:'Upgrade your cat climbing tower to a castle-inspired illustrated style. Only one tower appears at once.'},
{id:'decor-cat-tree-forest',name:'Woodland forest cat tower',type:'decor',price:110,icon:'🐈',detail:'Upgrade your cat climbing tower to a forest-inspired illustrated style. Only one tower appears at once.'},
{id:'decor-cat-tree-moon',name:'Midnight moon cat tower',type:'decor',price:125,icon:'🐈',detail:'Upgrade your cat climbing tower to a moon-inspired illustrated style. Only one tower appears at once.'},
{id:'plant-monstera',name:'Monstera leaf planter',type:'plantFloor',price:36,icon:'🪴',detail:'Interchangeable illustrated indoor planter at the reception greenery station.'},
{id:'plant-fern',name:'Feathery fern planter',type:'plantFloor',price:36,icon:'🪴',detail:'Interchangeable illustrated indoor planter at the reception greenery station.'},
{id:'plant-orchid',name:'Pink orchid planter',type:'plantFloor',price:36,icon:'🪴',detail:'Interchangeable illustrated indoor planter at the reception greenery station.'},
{id:'plant-pothos',name:'Trailing pothos planter',type:'plantFloor',price:36,icon:'🪴',detail:'Interchangeable illustrated indoor planter at the reception greenery station.'},
{id:'plant-succulent',name:'Rosette succulent planter',type:'plantFloor',price:36,icon:'🪴',detail:'Interchangeable illustrated indoor planter at the reception greenery station.'},
{id:'plant-lavender',name:'Lavender bloom planter',type:'plantFloor',price:36,icon:'🪴',detail:'Interchangeable illustrated indoor planter at the reception greenery station.'},
{id:'display-christmas',name:'Christmas tree',type:'themeDisplay',price:39,icon:'🎄',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'display-hanukkah',name:'Hanukkah candle display',type:'themeDisplay',price:25,icon:'🕎',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'display-kwanzaa',name:'Kwanzaa kinara display',type:'themeDisplay',price:25,icon:'🕯️',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'display-snow',name:'Snow-globe corner',type:'themeDisplay',price:39,icon:'❄️',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'display-valentines',name:'Valentine hearts display',type:'themeDisplay',price:39,icon:'💗',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'display-stpatricks',name:'St. Patrick’s shamrock display',type:'themeDisplay',price:39,icon:'🍀',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'display-midnight',name:'Midnight moonlight',type:'themeDisplay',price:39,icon:'🌙',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'display-unicorn',name:'Unicorn dreams',type:'themeDisplay',price:39,icon:'🦄',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'display-boho',name:'Boho macramé display',type:'themeDisplay',price:39,icon:'🌾',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'display-coffee',name:'Cozy coffee corner',type:'themeDisplay',price:39,icon:'☕',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'display-scifi',name:'Medical sci-fi scanner',type:'themeDisplay',price:39,icon:'🩺',detail:'Independent thematic display. Swaps with other seasonal or fantasy displays, without changing your wallpaper.'},
{id:'wall-christmas',name:'Christmas pine and ornaments wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'🎄',detail:'Illustrated Christmas pine and ornaments wallpaper applied to reception walls in both room views.'},
{id:'wall-hanukkah',name:'Hanukkah blue and gold wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'🕎',detail:'Illustrated Hanukkah blue and gold wallpaper applied to reception walls in both room views.'},
{id:'wall-kwanzaa',name:'Kwanzaa red black and green wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'🕯️',detail:'Illustrated Kwanzaa red black and green wallpaper applied to reception walls in both room views.'},
{id:'wall-snowglow',name:'Snowy winter night wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'❄️',detail:'Illustrated Snowy winter night wallpaper applied to reception walls in both room views.'},
{id:'wall-valentines',name:'Valentine hearts wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'💕',detail:'Illustrated Valentine hearts wallpaper applied to reception walls in both room views.'},
{id:'wall-stpatricks',name:'St. Patrick’s clovers wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'🍀',detail:'Illustrated St. Patrick’s clovers wallpaper applied to reception walls in both room views.'},
{id:'wall-midnight',name:'Midnight stars wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'🌙',detail:'Illustrated Midnight stars wallpaper applied to reception walls in both room views.'},
{id:'wall-unicorn',name:'Unicorn rainbow magic wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'🦄',detail:'Illustrated Unicorn rainbow magic wallpaper applied to reception walls in both room views.'},
{id:'wall-boho',name:'Boho botanical wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'🌿',detail:'Illustrated Boho botanical wallpaper applied to reception walls in both room views.'},
{id:'wall-coffee',name:'Coffeehouse wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'☕',detail:'Illustrated Coffeehouse wallpaper applied to reception walls in both room views.'},
{id:'wall-scifi',name:'Medical sci-fi lab wallpaper',type:'wall',price:48,color:'#eee6f0',pattern:'illustrated',icon:'🛸',detail:'Illustrated Medical sci-fi lab wallpaper applied to reception walls in both room views.'},
{id:'rug-halloween',name:'Pumpkin Patch rug',type:'rug',price:35,icon:'🎃',detail:'Replaceable floor rug for the reception waiting area; Pumpkin Patch collection.'},
{id:'desk-halloween',name:'Pumpkin Patch counter display',type:'deskAccent',price:25,icon:'🎃',detail:'Decorative counter display that sits beside check-in; Pumpkin Patch collection.'},
{id:'hanging-halloween',name:'Pumpkin Patch hanging greenery',type:'hanging',price:30,icon:'🎃',detail:'Hanging garland and planter in the top corner; Pumpkin Patch collection.'},
{id:'cataccent-halloween',name:'Pumpkin Patch cat nook',type:'catAccent',price:35,icon:'🎃',detail:'Cozy seasonal cat-corner bed and accessories; Pumpkin Patch collection.'},
{id:'rug-winter',name:'Winter Glow rug',type:'rug',price:35,icon:'❄️',detail:'Replaceable floor rug for the reception waiting area; Winter Glow collection.'},
{id:'desk-winter',name:'Winter Glow counter display',type:'deskAccent',price:25,icon:'❄️',detail:'Decorative counter display that sits beside check-in; Winter Glow collection.'},
{id:'hanging-winter',name:'Winter Glow hanging greenery',type:'hanging',price:30,icon:'❄️',detail:'Hanging garland and planter in the top corner; Winter Glow collection.'},
{id:'cataccent-winter',name:'Winter Glow cat nook',type:'catAccent',price:35,icon:'❄️',detail:'Cozy seasonal cat-corner bed and accessories; Winter Glow collection.'},
{id:'rug-pride',name:'Rainbow Joy rug',type:'rug',price:35,icon:'🌈',detail:'Replaceable floor rug for the reception waiting area; Rainbow Joy collection.'},
{id:'desk-pride',name:'Rainbow Joy counter display',type:'deskAccent',price:25,icon:'🌈',detail:'Decorative counter display that sits beside check-in; Rainbow Joy collection.'},
{id:'hanging-pride',name:'Rainbow Joy hanging greenery',type:'hanging',price:30,icon:'🌈',detail:'Hanging garland and planter in the top corner; Rainbow Joy collection.'},
{id:'cataccent-pride',name:'Rainbow Joy cat nook',type:'catAccent',price:35,icon:'🌈',detail:'Cozy seasonal cat-corner bed and accessories; Rainbow Joy collection.'},
{id:'rug-spring',name:'Flower Garden rug',type:'rug',price:35,icon:'🌸',detail:'Replaceable floor rug for the reception waiting area; Flower Garden collection.'},
{id:'desk-spring',name:'Flower Garden counter display',type:'deskAccent',price:25,icon:'🌸',detail:'Decorative counter display that sits beside check-in; Flower Garden collection.'},
{id:'hanging-spring',name:'Flower Garden hanging greenery',type:'hanging',price:30,icon:'🌸',detail:'Hanging garland and planter in the top corner; Flower Garden collection.'},
{id:'cataccent-spring',name:'Flower Garden cat nook',type:'catAccent',price:35,icon:'🌸',detail:'Cozy seasonal cat-corner bed and accessories; Flower Garden collection.'}
];
const wallpaperArt={
 'wall-halloween':'assets/reception/wallpaper-halloween-approved.webp',
 'wall-winter':'assets/reception/wallpaper-winter-approved.webp',
 'wall-pride':'assets/reception/wallpaper-pride-approved.webp',
 'wall-floral':'assets/reception/wallpaper-spring-approved.webp',
 'wall-christmas':'assets/reception/wallpaper-christmas-theme.svg',
 'wall-hanukkah':'assets/reception/wallpaper-hanukkah-theme.svg',
 'wall-kwanzaa':'assets/reception/wallpaper-kwanzaa-theme.svg',
 'wall-snowglow':'assets/reception/wallpaper-snowglow-theme.svg',
 'wall-valentines':'assets/reception/wallpaper-valentines-theme.svg',
 'wall-stpatricks':'assets/reception/wallpaper-stpatricks-theme.svg',
 'wall-midnight':'assets/reception/wallpaper-midnight-theme.svg',
 'wall-unicorn':'assets/reception/wallpaper-unicorn-theme.svg',
 'wall-boho':'assets/reception/wallpaper-boho-theme.svg',
 'wall-coffee':'assets/reception/wallpaper-coffee-theme.svg',
 'wall-scifi':'assets/reception/wallpaper-scifi-theme.svg'
};
const modularArt=window.VPQ_RECEPTION_MODULAR_ASSETS;
const itemArt={...modularArt.manifest};
const free=catalog.filter(x=>x.price===0).map(x=>x.id);
const sofaIds=catalog.filter(x=>x.type==='furniture').map(x=>x.id);
const singleSlotTypes=new Set(['catHide','catHide','catAccess','catBridge','catTunnel','catPuzzle','catWand','catHammock','catScratch','catCompanion','catRoomToy','catRoomWindow','catRoomBasket','floorLamp','tableLamp','ottoman','dogBed','catBed','tableTop','coffeeTable','furniture','rug','deskAccent','hanging','catAccent','themeDisplay','plantFloor']);
const catCarrierIds=['decor-carrier','decor-cat-carrier-cozy'];
const catTreeIds=['decor-cat-tree','decor-cat-tree-cloud','decor-cat-tree-castle','decor-cat-tree-forest','decor-cat-tree-moon'];
const floorPlantIds=['decor-planter',...catalog.filter(x=>x.type==='plantFloor').map(x=>x.id)];
const exclusiveIds=type=>catalog.filter(x=>x.type===type).map(x=>x.id);
if(!state.receptionCollection||typeof state.receptionCollection!=='object')state.receptionCollection={owned:[],equippedWall:'paint-peach',placed:[],transactions:[]};
const bag=state.receptionCollection;
bag.owned=Array.isArray(bag.owned)?bag.owned:[];
bag.placed=Array.isArray(bag.placed)?bag.placed:[];
bag.transactions=Array.isArray(bag.transactions)?bag.transactions:[];
bag.owned=[...new Set([...free,...bag.owned.filter(x=>catalog.some(c=>c.id===x))])];
// Existing saves inherit the free sofa; sofa style is a single-selection furniture slot.
if(!bag.placed.some(id=>sofaIds.includes(id)))bag.placed.push('seat-sofa-lavender');
if(!bag.placed.some(id=>catalog.some(c=>c.type==='coffeeTable'&&c.id===id)))bag.placed.push('decor-coffee-table');
if(bag.placed.filter(id=>sofaIds.includes(id)).length>1){const last=bag.placed.filter(id=>sofaIds.includes(id)).slice(-1)[0];bag.placed=bag.placed.filter(id=>!sofaIds.includes(id)||id===last)}
if(!bag.owned.includes(bag.equippedWall))bag.equippedWall='paint-peach';
bag.placed=bag.placed.filter(x=>bag.owned.includes(x));
{const existing=bag.placed.filter(x=>floorPlantIds.includes(x));if(existing.length>1){const last=existing[existing.length-1];bag.placed=bag.placed.filter(x=>!floorPlantIds.includes(x)||x===last)}}
for(const type of singleSlotTypes){const ids=exclusiveIds(type),chosen=bag.placed.filter(x=>ids.includes(x));if(chosen.length>1){const latest=chosen[chosen.length-1];bag.placed=bag.placed.filter(x=>!ids.includes(x)||x===latest)}}
{const trees=bag.placed.filter(id=>catTreeIds.includes(id));if(trees.length>1){const latest=trees[trees.length-1];bag.placed=bag.placed.filter(id=>!catTreeIds.includes(id)||id===latest)}}
{const carriers=bag.placed.filter(id=>catCarrierIds.includes(id));if(carriers.length>1){const latest=carriers[carriers.length-1];bag.placed=bag.placed.filter(id=>!catCarrierIds.includes(id)||id===latest)}}
const first=s=>escapeHtml(String(s??''));
const find=id=>catalog.find(x=>x.id===id);
const equipped=id=>find(id)?.type==='wall'?bag.equippedWall===id:bag.placed.includes(id);
function persistLocal(){persist();updateHUD();if(['reception','catcorner'].includes(state.room)||document.getElementById('stage')?.dataset.room==='catcorner')renderRoom()}
function appendTransaction(item){bag.transactions.unshift({id:item.id,price:item.price,kind:'purchase',date:new Date().toISOString()});bag.transactions=bag.transactions.slice(0,100);persistLocal()}
function preview(id){const item=find(id);if(!item)return;
const owned=bag.owned.includes(id),active=equipped(id),able=state.coins>=item.price;
const asset=itemArt[id]?.src;
const scene=asset?'<div class="vpqRPreview" style="background:#fff8fc"><img src="'+asset+'" alt="'+first(item.name)+'" style="height:170px;width:95%;object-fit:contain"><small>Exact purchasable artwork · appears in its corresponding room when placed</small></div>':wallpaperArt[id]?'<div class="vpqRPreview" style="background:#fff7f5"><img src="'+wallpaperArt[id]+'" alt="'+first(item.name)+' pattern" style="width:100%;max-height:215px;object-fit:cover;border-radius:9px"><small>Actual wallpaper pattern · will appear behind the reception furniture and doors</small></div>':'<div class="vpqRPreview" style="background:'+first(item.color||'#f5e9da')+'"><div class="vpqRPreviewIcons">'+first(item.icon)+' <span>🛎️ 🐕</span> 🪑</div><small>Conceptual room/item preview</small></div>';
showModal('🎨 Preview · '+first(item.name),'<p>'+first(item.detail||'Choose a color or theme for your waiting room.')+'</p>'+scene+
'<p><b>'+ (owned?'Already owned':item.price+' 🪙')+'</b> · Current coin balance: '+state.coins+'</p>'+
'<div class="buttonrow">'+(owned?'<button data-vpqr-equip="'+item.id+'">'+(active?(item.type==='wall'?'Currently equipped':item.type==='furniture'?'Current sofa':singleSlotTypes.has(item.type)?'Remove from room':'Remove from room'):(item.type==='wall'?'Apply wallpaper':item.type==='furniture'?'Use this sofa':singleSlotTypes.has(item.type)?'Place / swap in reception':'Place in reception'))+'</button>': '<button data-vpqr-buy="'+item.id+'" '+(!able?'disabled':'')+'>Confirm purchase · '+item.price+' 🪙</button>')+
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
function menu(filter='all'){const visible=catalog.filter(x=>filter==='all'||filter==='owned'&&bag.owned.includes(x.id)||filter==='wall'&&x.type==='wall'||filter==='decor'&&x.type==='decor'||filter==='scifi'&&(x.id.includes('scifi')||x.id==='wall-scifi')||filter==='cats'&&(x.id.includes('cat')||x.id==='decor-carrier')||filter==='catenrich'&&['catHide','catAccess','catBridge','catTunnel','catPuzzle','catWand','catHammock','catScratch'].includes(x.type)||filter==='catlounge'&&(['catAccess','catBridge','catTunnel','catPuzzle','catWand','catHammock','catScratch','catCompanion','catRoomToy','catRoomWindow','catRoomBasket','catAccent','catBed'].includes(x.type)||catTreeIds.includes(x.id))||filter==='furniture'&&['furniture','coffeeTable','floorLamp','tableLamp','ottoman'].includes(x.type)||filter==='pets'&&['dogBed','catBed'].includes(x.type)||filter==='accessories'&&['tableTop','tableLamp'].includes(x.type)||filter==='rugs'&&x.type==='rug'||filter==='seasonal'&&['deskAccent','hanging','catAccent','themeDisplay'].includes(x.type)||filter==='trees'&&catTreeIds.includes(x.id)||filter==='plants'&&x.type==='plantFloor');
showModal('🎨 Reception Studio · Shop & Collection','<div class="infobox"><b>🪙 '+state.coins+' clinic coins</b> · '+bag.owned.length+' / '+catalog.length+' items owned <button data-vpqr-wallet="1">Open coin bank</button></div>'+
'<p>Choose Seating & Tables, Decor, Rugs, Science Fiction, Seasonal Accessories or Wallpapers. Purchased sofas and decorations are placed in the waiting room automatically; wallpapers are applied after purchase. Open My collection to remove decorations or change owned sofa styles at no extra cost. All choices are saved in this browser.</p>'+
'<p><button data-vpqr-catlounge="1">🐈 Open Cat Lounge Studio</button></p><div class="vpqRFilters"><button data-vpqr-filter="all">All items</button><button data-vpqr-filter="wall">Wallpapers</button><button data-vpqr-filter="furniture">Furniture & Lights</button><button data-vpqr-filter="pets">Pet beds</button><button data-vpqr-filter="accessories">Table decor</button><button data-vpqr-filter="cats">Cats & carriers</button><button data-vpqr-filter="catlounge">Cat Lounge</button><button data-vpqr-filter="catenrich">Hiding & Climbing</button><button data-vpqr-filter="scifi">Sci-fi lab</button><button data-vpqr-filter="rugs">Rugs</button><button data-vpqr-filter="seasonal">Seasonal extras</button><button data-vpqr-filter="trees">Cat trees</button><button data-vpqr-filter="plants">Plants</button><button data-vpqr-filter="decor">Decor</button><button data-vpqr-filter="owned">My collection</button></div>'+
'<div class="vpqRCatalog">'+visible.map(x=>'<button data-vpqr-preview="'+x.id+'">'+(itemArt[x.id]?.src?'<img src="'+itemArt[x.id].src+'" alt="" style="height:85px;width:100%;object-fit:contain;border-radius:8px;margin-bottom:6px">':wallpaperArt[x.id]?'<img src="'+wallpaperArt[x.id]+'" alt="" style="height:78px;width:100%;object-fit:cover;border-radius:8px;margin-bottom:6px">':'<span class="vpqRIcon">'+first(x.icon)+'</span>')+'<span class="vpqPricePill">'+(bag.owned.includes(x.id)?'✓ Owned':x.price===0?'Free':'🪙 '+x.price+' coins')+'</span><b>'+first(x.name)+'</b><small>'+(equipped(x.id)?'✓ In reception':bag.owned.includes(x.id)?'Owned · reusable':x.price+' 🪙')+'</small><em>Preview</em></button>').join('')+'</div>'+
'<div class="vpqRPend"><b>🐕 Kennel & 3D-style play yard — Coming Soon</b><p>Future fenced yard, dog behavior cases, enrichment, intake and safe isolation workflows. This is a preview only; no kennel has been purchased or built.</p><button data-vpqr-yard="1">See planned expansion</button></div>');
}
function catLounge(){
 const ids=bag.placed.filter(id=>['catAccess','catBridge','catTunnel','catPuzzle','catWand','catHammock','catScratch','catCompanion','catRoomToy','catRoomWindow','catRoomBasket','catAccent','catBed'].includes(find(id)?.type)||catTreeIds.includes(id));
 const selected=ids.map(id=>itemArt[id]?.src).filter(Boolean);
 const gallery=ids.map(id=>'<div style="display:flex;align-items:center;gap:8px;border:1px solid #e8d7ee;border-radius:12px;padding:5px;background:white"><img src="'+itemArt[id]?.src+'" alt="" style="height:65px;width:65px;object-fit:contain"><span><b>'+first(find(id)?.name||id)+'</b></span></div>').join('');
 showModal('🐈 Cat Lounge Studio','<p>Decorate the walkable Cat Corner with calm spaces to hide, climb, rest, watch the window, and play. Choose cottage or mushroom hideaways, ramps or stairs, elevated bridges, play tunnels, puzzle feeders, wand toys, hammocks, and scratching options alongside existing beds and cat trees. Each piece uses a planned space. Owned items remain reusable. These selections now decorate the existing walkable Cat Corner room. Return there after equipping an item to see it in place.</p>'+
 '<div style="position:relative;border-radius:18px;background:linear-gradient(160deg,#f4e7ff 0%,#fff3e9 60%,#e7f3e8 100%);padding:16px;border:4px solid #d2b3db;min-height:250px"><b style="color:#765b90">♡ THE COZY CAT LOUNGE ♡</b><div style="display:flex;flex-wrap:wrap;gap:12px;align-items:end;justify-content:center;min-height:165px">'+(selected.length?selected.map(src=>'<img src="'+src+'" alt="Equipped feline lounge decoration" style="width:115px;max-height:150px;object-fit:contain">').join(''):'<p>Equip a cat companion or lounge decoration to see it here.</p>')+'</div></div>'+
 '<h3>Your placed cat-lounge items</h3>'+(gallery||'<p>No cat lounge accessories equipped yet.</p>')+
 '<div class="buttonrow"><button data-vpqr-filter="catlounge">Shop cat lounge items</button><button data-vpqr-menu="1">← Reception shop</button></div>');
}
function yard(){showModal('🐕 Kennel & Play Yard · Coming Soon','<h3>Planned veterinary learning expansion</h3><p>A 2.5D dog play yard with fenced areas, individual kennel runs, enrichment upgrades and clinical learning stations for canine behavior, triage, parasite control and infection prevention.</p><p><b>Not yet playable:</b> no kennels, dog housing, purchases or clinical cases are enabled in this preview.</p><button data-vpqr-menu="1">← Reception Studio</button>')}
function apply(id){const x=find(id);if(!x||!bag.owned.includes(id))return;
if(x.type==='wall')bag.equippedWall=id;
else if(singleSlotTypes.has(x.type)&&x.type!=='furniture'&&bag.placed.includes(id))bag.placed=bag.placed.filter(v=>v!==id);
else if(floorPlantIds.includes(id))bag.placed=bag.placed.includes(id)?bag.placed.filter(v=>v!==id):[...bag.placed.filter(v=>!floorPlantIds.includes(v)),id];
else if(singleSlotTypes.has(x.type))bag.placed=[...bag.placed.filter(v=>!exclusiveIds(x.type).includes(v)),id];
else if(catCarrierIds.includes(id))bag.placed=bag.placed.includes(id)?bag.placed.filter(v=>v!==id):[...bag.placed.filter(v=>!catCarrierIds.includes(v)),id];
else if(catTreeIds.includes(id))bag.placed=bag.placed.includes(id)?bag.placed.filter(v=>v!==id):[...bag.placed.filter(v=>!catTreeIds.includes(v)),id];
else if(bag.placed.includes(id))bag.placed=bag.placed.filter(v=>v!==id);else bag.placed.push(id);
persistLocal();preview(id);
}
function buy(id){const item=find(id);if(!item||bag.owned.includes(id)||item.price<=0||state.coins<item.price)return;
state.coins-=item.price;bag.owned.push(id);
if(item.type==='wall')bag.equippedWall=id;
else if(floorPlantIds.includes(id))bag.placed=[...bag.placed.filter(v=>!floorPlantIds.includes(v)),id];
else if(singleSlotTypes.has(item.type))bag.placed=[...bag.placed.filter(v=>!exclusiveIds(item.type).includes(v)),id];
else if(catCarrierIds.includes(id))bag.placed=[...bag.placed.filter(v=>!catCarrierIds.includes(v)),id];
else if(catTreeIds.includes(id))bag.placed=[...bag.placed.filter(v=>!catTreeIds.includes(v)),id];
else if(item.type==='decor'&&!bag.placed.includes(id))bag.placed.push(id);
appendTransaction(item);preview(id);
}
const prevAction=api.getAction();
api.setAction(function(action){if(action==='receptionStudio')return menu();if(action==='catLounge')return catLounge();if(action==='receptionYard')return yard();if(action==='receptionBank')return wallet();return prevAction(action)});
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
const decoration=bag.placed.filter(id=>find(id)?.type==='decor'&&!modularArt.manifest[id]).slice(0,5).map((id,i)=>{const item=find(id),point=coords[i];return item?'<text x="'+(point[0]*10)+'" y="'+(point[1]*10)+'" font-size="52">'+item.icon+'</text>':''}).join('');
art=art.replace('</svg>',modularArt.render(state,'classic','all')+decoration+'</svg>');return art;
};
document.getElementById('modalBody').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
if(d.vpqrMenu!==undefined)return menu();
if(d.vpqrCatlounge!==undefined)return catLounge();
if(d.vpqrWallet!==undefined)return wallet();
if(d.vpqrTestcoins!==undefined)return claimTestCoins();
if(d.vpqrYard!==undefined)return yard();
if(d.vpqrFilter!==undefined)return menu(d.vpqrFilter);
if(d.vpqrPreview!==undefined)return preview(d.vpqrPreview);
if(d.vpqrEquip!==undefined)return apply(d.vpqrEquip);
if(d.vpqrBuy!==undefined)return buy(d.vpqrBuy);
});
const style=document.createElement('style');style.textContent='.vpqRFilters,.vpqRCatalog{display:grid;gap:9px}.vpqRFilters{grid-template-columns:repeat(auto-fit,minmax(92px,1fr));margin:12px 0}.vpqRFilters button{font-size:12px;padding:8px 3px}.vpqRCatalog{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}.vpqRCatalog button{background:#fff;text-align:left;border-radius:12px;padding:12px}.vpqRCatalog b,.vpqRCatalog small,.vpqRCatalog em{display:block}.vpqRCatalog em{font-style:normal;font-size:11px;color:#447596}.vpqPricePill{display:inline-block;margin:5px 0 7px;padding:4px 9px;border-radius:999px;background:linear-gradient(120deg,#fce8a9,#f9d7e7);border:1px solid #d0af9c;color:#76556c;font-size:11px;font-weight:900;box-shadow:0 2px 5px #8b77952d}.vpqRIcon{font-size:35px;display:block}.vpqRPend{margin-top:17px;padding:14px;background:#f4effd;border-radius:12px}.vpqRPreview{min-height:175px;display:flex;flex-direction:column;align-items:center;justify-content:space-around;border:6px solid white;outline:1px solid #c9cde4;border-radius:15px}.vpqRPreviewIcons{font-size:45px}.vpqRPreviewIcons span{font-size:32px}.vpqRPreview small{font-size:11px;background:#ffffffc4;padding:5px}.vpqRCatalog small{font-size:11px;margin:5px 0}@media(max-width:480px){.vpqRFilters{grid-template-columns:repeat(2,minmax(0,1fr))}}';document.head.appendChild(style);
persist();
return {catalog,menu,wallet,yard};
};
