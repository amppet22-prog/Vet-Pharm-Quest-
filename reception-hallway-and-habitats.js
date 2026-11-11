/* Connected reception annexes and blueprint. Original vector room art. */
window.VPQ_RECEPTION_WINGS=function(api){
'use strict';
const {state,rooms}=api,stage=document.getElementById('stage'),prior=window.VPQ_SCENERY.roomArt.bind(window.VPQ_SCENERY);
const destinations={vpqGoHallway:'hallway',vpqGoCat:'catcorner',vpqGoYard:'yardview',vpqWingLobby:'reception',vpqWingExam:'exam',vpqWingTreatment:'treatment',vpqWingSurgery:'surgery',vpqWingIsolation:'isolation',vpqWingClinpath:'clinpath',vpqWingImaging:'imaging',vpqWingStudy:'study',vpqWingPharmacy:'pharmacy'};
const slots={
hallway:[['🩺 Exam','vpqWingExam',8],['❤️ Treatment','vpqWingTreatment',20],['🩺 Surgery','vpqWingSurgery',32],['🛡️ Isolation','vpqWingIsolation',44],['🔬 Clin Path','vpqWingClinpath',56],['🩻 Imaging','vpqWingImaging',68],['📚 Study','vpqWingStudy',80],['💊 Pharmacy','vpqWingPharmacy',92]],
catcorner:[['🌳 Cat tree & toys','vpqCatShop',16],['🐈 FAS Score Lab','vpqCatFAS',40],['🐈 Meet cats','vpqCatView',64],['🚪 Reception','vpqWingLobby',90]],
yardview:[['🐕 FAS Score Lab','vpqDogFAS',17],['🐕 Dog play yard','vpqYardView',41],['🎾 Yard upgrades','vpqYardShop',65],['🚪 Reception','vpqWingLobby',90]]
};
for(const [room,arr] of Object.entries(slots))rooms[room]={name:room==='hallway'?'Reception · Clinical Hallway':room==='catcorner'?'Reception Cat Corner':'Dog Kennel & Play Yard Window',color:'#f4eefa',banner:'EXTENDED HOSPITAL',decor:[],props:arr.map(([label,action,x])=>({x,label,action,emoji:label.slice(0,2),bubble:'Interact'}))};
const choices={
'cat-tree':['Cat climbing tree',40,'catcorner','🌳'],
'cat-wall':['Wall climbing shelves',50,'catcorner','🪜'],
'cat-toys':['Feather and yarn toys',20,'catcorner','🧶'],
'cat-extra':['Extra illustrated cats',35,'catcorner','🐈'],
'yard-toys':['Play-yard toys',25,'yardview','🎾'],
'yard-agility':['Agility ramp and tunnel',45,'yardview','🦴']
};
const frame=(name)=>'<svg class="vpqWingArt" viewBox="0 0 1000 500" preserveAspectRatio="none" role="img" aria-label="'+name+'"><rect width="1000" height="500" fill="#e9dcf3"/><path d="M0 0H1000L935 75H65Z" fill="#fffafc"/><path d="M0 0L65 75V348L0 405ZM1000 0L935 75V348L1000 405Z" fill="#c6bcd8"/><rect x="65" y="75" width="870" height="273" fill="#fff7fd"/><path d="M65 348h870l65 152H0Z" fill="#ddcde4"/><path d="M65 348L0 500M935 348L1000 500M300 348L250 500M500 348v152M700 348L750 500M30 433H970M48 390H952" stroke="#fff" fill="none" stroke-width="3"/><rect x="315" y="91" width="370" height="59" rx="23" fill="#fff" stroke="#b9a2d3" stroke-width="5"/><text x="500" y="129" text-anchor="middle" font-family="Arial" font-size="26" font-weight="900" fill="#8266a2">'+name+'</text>';
const dog=(x,y)=>'<g transform="translate('+x+' '+y+')"><ellipse cx="38" cy="39" rx="42" ry="23" fill="#d6a47b"/><circle cx="10" cy="29" r="24" fill="#e4b489"/><path d="M-6 10l-12 -22 21 14M29 9l18 -16 -5 27" fill="#a6755a"/><ellipse cx="-1" cy="40" rx="17" ry="11" fill="#f9e4d3"/><circle cx="-13" cy="37" r="5" fill="#5d4445"/><circle cx="15" cy="26" r="4" fill="#423943"/><path d="M22 62v16M60 61v17" stroke="#ae7a5e" stroke-width="9"/><path d="M75 39q25 -21 26 -2" stroke="#ad7a5d" stroke-width="9" fill="none"/></g>';
const cat=(x,y,color)=>'<g transform="translate('+x+' '+y+')"><ellipse cx="30" cy="52" rx="29" ry="26" fill="'+color+'"/><path d="M7 33L0 9l23 14 25 -14 11 28" fill="'+color+'" stroke="#9986ac" stroke-width="3"/><circle cx="29" cy="28" r="24" fill="'+color+'"/><circle cx="21" cy="27" r="4" fill="#484351"/><circle cx="39" cy="27" r="4" fill="#484351"/><path d="M24 38h10l-5 6z" fill="#d998b2"/><path d="M59 50q27 -17 20 -39" stroke="'+color+'" stroke-width="8" fill="none"/></g>';
function scene(room){
let s=frame(room==='hallway'?'CLINIC HALLWAY':room==='catcorner'?'CAT CORNER':'DOG PLAY YARD');
if(room==='hallway'){const colors=['#f5dde8','#fbe2e6','#d9efe5','#dfeafb','#eadff8','#d5eafa','#f5e8d4','#e1f4db'];slots.hallway.forEach(([name,action],i)=>{const x=18+i*121;s+='<rect x="'+x+'" y="190" width="111" height="179" rx="14" fill="'+colors[i%colors.length]+'" stroke="#b0a3c8" stroke-width="5"/><rect x="'+(x+8)+'" y="201" width="95" height="151" rx="9" fill="#fff" stroke="#c6b2d1" stroke-width="3"/><text x="'+(x+55)+'" y="275" text-anchor="middle" font-size="41">'+name.slice(0,2)+'</text><text x="'+(x+55)+'" y="306" text-anchor="middle" font-size="12" font-weight="900" fill="#726489">'+name.slice(name.indexOf(' ')+1)+'</text>'});}
if(room==='catcorner'){s+='<rect x="90" y="291" width="816" height="26" rx="12" fill="#dfb7d9"/><rect x="90" y="317" width="816" height="79" rx="12" fill="#f6e0ef"/>'+cat(222,219,'#e9bfa4')+cat(673,233,'#b4a9db')+'<path d="M120 207h190M780 209h110" stroke="#d3a2cf" stroke-width="13"/>';const placed=state.receptionHabitats?.placed||[];if(placed.includes('cat-tree'))s+='<rect x="430" y="224" width="25" height="94" fill="#b99b89"/><rect x="385" y="213" width="120" height="16" rx="8" fill="#c89fc7"/>'+cat(405,157,'#c6b3d7');if(placed.includes('cat-wall'))s+='<path d="M722 187h86M804 151h95" stroke="#bd95bd" stroke-width="14"/>';if(placed.includes('cat-toys'))s+='<text x="330" y="386" font-size="43">🧶</text><text x="550" y="385" font-size="43">🪶</text>';if(placed.includes('cat-extra'))s+=cat(305,284,'#e7bda4')+cat(782,276,'#b7b8db');}
if(room==='yardview'){s+='<rect x="92" y="175" width="816" height="188" rx="18" fill="#d6f4f1" stroke="#a4c5c4" stroke-width="7"/><path d="M100 305q250 -67 426 0q211 -66 379 0v55H100Z" fill="#b9dea5"/>'+[130,230,330,430,530,630,730,830].map(x=>'<path d="M'+x+' 180v180" stroke="#fff" stroke-width="5"/>').join('')+'<path d="M100 251h810M100 320h810" stroke="#fff" stroke-width="5"/>'+dog(237,247)+dog(620,244);const placed=state.receptionHabitats?.placed||[];if(placed.includes('yard-toys'))s+='<text x="461" y="343" font-size="43">🎾</text>';if(placed.includes('yard-agility'))s+='<path d="M438 283h131M449 283v58M562 283v58" stroke="#e8b27d" stroke-width="12"/>';}
return s+'</svg>';
}
window.VPQ_SCENERY.roomArt=k=>slots[k]?scene(k):prior(k);
const style=document.createElement('style');
style.textContent='.vpqWingArt{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.stage[data-room="hallway"] .prop,.stage[data-room="catcorner"] .prop,.stage[data-room="yardview"] .prop,.stage[data-room="hallway"] .roomBanner,.stage[data-room="catcorner"] .roomBanner,.stage[data-room="yardview"] .roomBanner{display:none!important}'+
'#vpqWingHits{position:absolute;inset:0;z-index:5;pointer-events:none}.vpqWingHit{position:absolute;pointer-events:auto;background:transparent;border:2px solid transparent;border-radius:16px;box-shadow:none;transform:none!important;padding:0}.vpqWingHit:hover,.vpqWingHit:focus-visible,.vpqWingHit.vpqWingNear{border:3px solid #ffc768;background:#fff1c42c;box-shadow:0 0 17px #ffdb94;outline:2px solid #fffae4}'+
'.vpqWingHit span{position:absolute;bottom:3%;left:50%;transform:translateX(-50%);font-size:12px;font-weight:900;background:#fff9ff;border:2px solid #b4a2d4;color:#675780;border-radius:14px;padding:6px 8px;white-space:nowrap;box-shadow:0 4px 9px #604e7755}.vpqWingHit.vpqWingNear span{background:#fff2c9;border-color:#e9b15e}.vpqWingHit.vpqWingNear:after{content:"E · INTERACT";position:absolute;top:2%;left:50%;transform:translateX(-50%);background:#fff9df;border:2px solid #ecc16e;border-radius:10px;padding:4px 6px;font-size:10px;font-weight:900;white-space:nowrap}'+
'#vpqReceptionExtras{position:absolute;inset:0;z-index:6;pointer-events:none}.vpqReceptionExtra{position:absolute;pointer-events:auto;background:#fffaf4f0;border:2px solid #b59bcc;color:#67517e;border-radius:13px;padding:7px 10px;font-size:12px;font-weight:900;box-shadow:0 5px 8px #68547f55}.vpqReceptionExtra:hover,.vpqReceptionExtra:focus-visible{background:#fff3c8;border-color:#e0b056}@media(max-width:650px){.vpqWingHit span{font-size:9px;white-space:normal;padding:4px}.vpqReceptionExtra{font-size:10px;padding:4px}}';
document.head.appendChild(style);
function refresh(){
 const room=stage.dataset.room,existing=stage.querySelector('#vpqWingHits'),extras=stage.querySelector('#vpqReceptionExtras');
 if(!slots[room]&&room!=='reception'){existing?.remove();extras?.remove();return}
 if(existing?.dataset.room===room && (room!=='reception'||stage.dataset.receptionView!=='isometric'||extras))return;
 existing?.remove();extras?.remove();
 const div=document.createElement('div');div.id='vpqWingHits';div.dataset.room=room;
 if(slots[room])div.innerHTML=slots[room].map(([label,action,x])=>'<button type="button" class="vpqWingHit" data-vpqwingaction="'+action+'" style="left:'+(x-(room==='hallway'?5.5:8))+'%;top:36%;width:'+(room==='hallway'?11:16)+'%;height:43%" aria-label="'+label+'"><span>'+label+'</span></button>').join('');
 if(room==='hallway')div.innerHTML+='<button type="button" class="vpqReceptionExtra" data-vpqwingaction="vpqWingLobby" style="left:2%;top:4%;z-index:8">← Reception Lobby</button>';
 div.addEventListener('click',e=>{const b=e.target.closest('[data-vpqwingaction]');if(b)route(b.dataset.vpqwingaction)});
 stage.appendChild(div);
 if(room==='reception'&&stage.dataset.receptionView==='isometric'){
  const n=document.createElement('div');n.id='vpqReceptionExtras';
  n.innerHTML='<button class="vpqReceptionExtra" data-vpqwingaction="vpqGoHallway" style="left:42%;top:13%">🚪 Explore hallway</button><button class="vpqReceptionExtra" data-vpqwingaction="vpqGoYard" style="right:1%;top:21%">🐕 Dog-yard window</button><button class="vpqReceptionExtra" data-vpqwingaction="vpqGoCat" style="right:1%;top:32%">🐈 Cat corner</button><button class="vpqReceptionExtra" data-vpqwingaction="vpqBlueprint" style="left:2%;top:3%">🗺️ Floor plan</button>';
  n.addEventListener('click',e=>{const b=e.target.closest('[data-vpqwingaction]');if(b)route(b.dataset.vpqwingaction)});
  stage.appendChild(n);
 }
}
function near(room,x){
 if(!slots[room])return null;let best=null;
 for(const [label,action,pos] of slots[room]){let d=Math.abs(pos-x);if(d<16&&(!best||d<best.d))best={label,action,d}}
 stage.querySelectorAll('#vpqWingHits .vpqWingHit').forEach(el=>el.classList.toggle('vpqWingNear',!!best&&el.dataset.vpqwingaction===best.action));
 return best;
}
function interact(room,x){const b=near(room,x);if(!b)return false;route(b.action);return true}
const mapRooms=[['🏠 Reception','reception'],['🚪 Clinical Hall','hallway'],['🩺 Exam','exam'],['❤️ Treatment','treatment'],['💊 Pharmacy','pharmacy'],['🔬 Advanced Lab','clinpath'],['🩻 Imaging','imaging'],['🛡️ One Health','isolation'],['📚 Study','study'],['🐈 Cat Corner','catcorner'],['🐕 Dog Yard','yardview'],['🧬 Mechanism Lab','mechanism'],['🧫 Necropsy & Pathology','necropsy'],['🩺 Surgery & Anesthesia','surgery'],['💉 Clinical Skills · Injection & Blood Draw','skills']];
function map(){
 const mapCells=[
  {x:31,y:38,w:145,h:120,bg:'#d8efd7',e:'🐕',name:'DOG YARD'},
  {x:190,y:38,w:145,h:120,bg:'#f5dff0',e:'🐈',name:'CAT CORNER'},
  {x:350,y:38,w:145,h:120,bg:'#f7e9c8',e:'📚',name:'STUDY'},
  {x:510,y:38,w:160,h:120,bg:'#e7e1f5',e:'💊',name:'PHARMACY'},
  {x:685,y:38,w:172,h:120,bg:'#e2f0f8',e:'🩻',name:'IMAGING'},
  {x:31,y:238,w:162,h:140,bg:'#f4dfe8',e:'🏠',name:'RECEPTION'},
  {x:209,y:238,w:122,h:140,bg:'#e0eff9',e:'🩺',name:'EXAM'},
  {x:347,y:238,w:122,h:140,bg:'#f8e0e5',e:'❤️',name:'TREATMENT'},
  {x:485,y:238,w:122,h:140,bg:'#f5ddeb',e:'🩺',name:'SURGERY'},
  {x:623,y:238,w:122,h:140,bg:'#dff1e7',e:'🛡️',name:'ONE HEALTH'},
  {x:760,y:238,w:109,h:140,bg:'#e7e1f7',e:'🔬',name:'ADV LAB'}
 ];
 const blueprint='<svg viewBox="0 0 900 410" role="img" aria-label="Cute illustrated bird-eye view of veterinary hospital rooms branching from the connected reception hallway" style="display:block;width:100%;max-height:440px;background:#e8f2e6;border:3px solid #bda7d3;border-radius:20px">'+
 '<defs><pattern id="vpqBlueprintTiles" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M23 0H0V23" fill="none" stroke="#e5ddf3" stroke-width="2"/></pattern></defs>'+
 '<rect x="12" y="13" width="875" height="384" rx="22" fill="#fff9fd" stroke="#bbafd0" stroke-width="6"/>'+
 '<path d="M123 188H853" stroke="#c6accd" stroke-width="43" stroke-linecap="round"/>'+
 '<path d="M123 188H853" stroke="#efdef4" stroke-width="34" stroke-linecap="round"/>'+
 '<text x="485" y="194" text-anchor="middle" font-family="Arial" font-size="17" font-weight="900" fill="#7b6297">CONTINUOUS CLINIC HALLWAY</text>'+
 mapCells.map(v=>'<g><rect x="'+v.x+'" y="'+v.y+'" width="'+v.w+'" height="'+v.h+'" rx="13" fill="'+v.bg+'" stroke="#b59fc2" stroke-width="4"/>'+
 '<rect x="'+(v.x+8)+'" y="'+(v.y+10)+'" width="'+(v.w-16)+'" height="'+(v.h-29)+'" rx="9" fill="url(#vpqBlueprintTiles)" opacity=".65"/>'+
 '<text x="'+(v.x+v.w/2)+'" y="'+(v.y+v.h/2+3)+'" text-anchor="middle" font-size="34">'+v.e+'</text>'+
 '<text x="'+(v.x+v.w/2)+'" y="'+(v.y+v.h-11)+'" text-anchor="middle" font-family="Arial" font-size="12" font-weight="900" fill="#65547e">'+v.name+'</text></g>').join('')+
 '<path d="M74 29q18 -18 36 0M803 389q24 -14 48 0" stroke="#a7c5aa" stroke-width="8" fill="none"/>'+
 '<text x="26" y="398" font-size="23">🐾</text><text x="840" y="32" font-size="23">🐾</text></svg>';
 api.showModal('🗺️ Vet Pharm Quest · Building Blueprint','<p>Illustrated navigation plan (not to scale). Choose any room below to enter it. Imaging, Mechanism Lab and Necropsy can also be reached from the buttons.</p>'+blueprint+'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:8px">'+mapRooms.filter(([n,k])=>rooms[k]).map(([n,k])=>'<button data-vpqwingmap="'+k+'" style="border:2px solid #cfb6dd;background:#f9f1fd;border-radius:14px;padding:14px;text-align:left;font-weight:900">'+n+'</button>').join('')+'</div>');
}
function inventory(){if(!state.receptionHabitats)state.receptionHabitats={owned:[],placed:[]};const v=state.receptionHabitats;if(!Array.isArray(v.owned))v.owned=[];if(!Array.isArray(v.placed))v.placed=[];return v}
function preview(id){
 const bg='<svg viewBox="0 0 170 105" role="img" aria-label="Cute illustrated preview of '+choices[id][0]+'" style="display:block;width:100%;height:105px;border-radius:11px;background:#f5e9fa">';
 const close='</svg>';
 if(id==='cat-tree')return bg+'<rect x="82" y="21" width="13" height="72" fill="#b79882"/><rect x="39" y="42" width="105" height="12" rx="6" fill="#cba0ca"/><rect x="65" y="21" width="65" height="10" rx="5" fill="#b6a5df"/><ellipse cx="101" cy="15" rx="21" ry="10" fill="#e3b6ce"/><text x="31" y="80" font-size="32">🐈</text>'+close;
 if(id==='cat-wall')return bg+'<path d="M12 80h55M57 56h60M108 31h49" stroke="#cda0c7" stroke-width="11"/><text x="77" y="54" font-size="31">🐈</text><text x="122" y="28" font-size="28">🐾</text>'+close;
 if(id==='cat-toys')return bg+'<text x="22" y="69" font-size="49">🧶</text><text x="95" y="69" font-size="49">🪶</text>'+close;
 if(id==='cat-extra')return bg+'<text x="12" y="74" font-size="52">🐈</text><text x="94" y="74" font-size="52">🐈</text>'+close;
 if(id==='yard-toys')return bg+'<text x="18" y="69" font-size="48">🎾</text><text x="93" y="70" font-size="49">🦴</text>'+close;
 return bg+'<path d="M18 73L78 20L135 73" fill="none" stroke="#dfa98b" stroke-width="10"/><rect x="102" y="54" width="50" height="27" rx="13" fill="#8dc4e1"/><ellipse cx="118" cy="70" rx="13" ry="17" fill="#b2d6ec"/><text x="24" y="95" font-size="14" fill="#8e6f95">AGILITY</text>'+close;
}
function shop(room){
 const bag=inventory();
 api.showModal(room==='catcorner'?'🐈 Decorate the Cat Corner':'🐕 Decorate the Dog Yard','<p>Each illustrated item has a matching placement spot in this room. Buy once, then switch between displaying or storing it whenever you like. Your main Reception Studio inventory stays separate and unchanged.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px">'+Object.entries(choices).filter(([id,v])=>v[2]===room).map(([id,v])=>'<section style="border:2px solid #d6bedd;border-radius:14px;padding:12px;background:#fff9fe">'+preview(id)+'<b>'+v[3]+' '+v[0]+'</b><p>'+ (bag.owned.includes(id)?bag.placed.includes(id)?'Owned · displayed in its designated spot':'Owned · stored':v[1]+' coins')+'</p><button data-vpqwingbuy="'+id+'">'+(bag.owned.includes(id)?bag.placed.includes(id)?'Store item':'Place item':'Purchase')+'</button></section>').join('')+'</div><p class="tiny">Cosmetic upgrades only. Study activities never require purchases.</p>');
}
function buy(id){
 const c=choices[id];if(!c)return;const bag=inventory();
 if(!bag.owned.includes(id)){if(state.coins<c[1])return api.showModal('Not enough coins','<p>Earn coins by studying. The learning activities stay available.</p>');state.coins-=c[1];bag.owned.push(id);bag.placed.push(id)}
 else if(bag.placed.includes(id))bag.placed=bag.placed.filter(x=>x!==id);else bag.placed.push(id);
 api.persist();api.updateHUD();if(stage.dataset.room===c[2])api.renderRoom();shop(c[2]);
}
function route(cmd){
 if(destinations[cmd]){api.changeRoom(destinations[cmd]);return true}
 if(cmd==='vpqBlueprint'){map();return true}
 if(cmd==='vpqDogFAS'){window.VPQ_FAS_LAB?.home('dog');return true}
 if(cmd==='vpqCatFAS'){window.VPQ_FAS_LAB?.home('cat');return true}
 if(cmd==='vpqCatShop'){shop('catcorner');return true}
 if(cmd==='vpqYardShop'){shop('yardview');return true}
 if(cmd==='vpqCatView'){api.showModal('🐈 Quiet Cat Corner','<p>Explore vertical space, resting shelves, hiding spots and enrichment. Use the Cat Enrichment station to place or store purchased decorations.</p>');return true}
 if(cmd==='vpqYardView'){api.showModal('🐕 Dog Play Yard','<p>See the play yard from the reception window. Dogs shown are part of the scenery, not unassigned patients. Safe play requires supervision, secure fencing and compatible groups.</p>');return true}
 return false;
}
const observer=new MutationObserver(()=>{const room=stage.dataset.room,el=stage.querySelector('#vpqWingHits'),extra=stage.querySelector('#vpqReceptionExtras');if(((!!slots[room]||room==='reception')!==!!el)||(el&&el.dataset.room!==room)||(room==='reception'&&stage.dataset.receptionView==='isometric'&&!extra))refresh()});
observer.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room','data-reception-view']});
api.modalBody.addEventListener('click',e=>{const el=e.target.closest('[data-vpqwingmap],[data-vpqwingbuy]');if(!el)return;if(el.dataset.vpqwingmap){api.closeModal();api.changeRoom(el.dataset.vpqwingmap)}else if(el.dataset.vpqwingbuy)buy(el.dataset.vpqwingbuy)});
refresh();return {route,refresh,near,interact,map};
};