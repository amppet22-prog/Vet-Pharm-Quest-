/* Reception Hall 2.5D v1.
 * Perspective SVG scene with persistent Classic/2.5D switch.
 * Existing avatar movement, companion, game stations, save and clinic rooms remain intact. */
window.VPQReceptionHall25D=function(api){
'use strict';
const {state,persist,renderRoom}=api;
const stage=document.getElementById('stage');
const controls=document.querySelector('.stageframe .controls');
const art=window.VPQ_SCENERY;
if(!stage||!controls||!art)return null;
if(!['classic','isometric'].includes(state.receptionView))state.receptionView='isometric';
const colors={
 'paint-peach':['#fef2e7','#f3dcd0','#eacbb9','#d3b3a2','#b78291',''],
 'paint-mint':['#dcf5ea','#bcded6','#c7dacd','#a0cbbd','#6ca990',''],
 'paint-blue':['#e0f1ff','#bdd9e9','#c9dce8','#9bbdd7','#638ebd',''],
 'paint-lavender':['#f0e5ff','#d7c6e9','#e4d5e5','#baa9d8','#977bbc',''],
 'wall-floral':['#fce4ed','#f0cad9','#e8d3c6','#cba6b1','#ce8aa8','🌸'],
 'wall-halloween':['#f5d8bb','#d7b49f','#dbc0a6','#ae8e79','#ac744e','🎃'],
 'wall-pride':['#f7edff','#d3c5ed','#e8d5e4','#b6a3c6','#9179b7','🌈'],
 'wall-winter':['#e3f1ff','#bbdce8','#d8e8ed','#9cbac9','#75b2d1','❄️']
};
const originalArt=art.roomArt.bind(art);
function svg(){
 const bag=state.receptionCollection||{};
 const c=colors[bag.equippedWall]||colors['paint-peach'];
 const placed=Array.isArray(bag.placed)?bag.placed:[];
 const has=id=>placed.includes(id);
 const motif=c[5]?'<g opacity=".4" font-size="28" aria-hidden="true"><text x="215" y="88">'+c[5]+'</text><text x="365" y="126">'+c[5]+'</text><text x="630" y="84">'+c[5]+'</text><text x="778" y="134">'+c[5]+'</text></g>':'';
 const seasonal=[has('decor-pumpkin')?'<text x="687" y="282" font-size="31">🎃</text>':'',has('decor-holiday')?'<text x="750" y="146" font-size="30">✨</text>':'',has('decor-rainbow')?'<g transform="translate(755 96)"><rect width="108" height="68" rx="8" fill="#fffdfb" stroke="'+c[4]+'" stroke-width="4"/><text x="54" y="42" font-size="31" text-anchor="middle">🌈</text></g>':''].join('');
 const cat=has('decor-cat')?'<g transform="translate(56 242)"><path d="M0 33L45 -4L91 32V101H0Z" fill="#e6d7ca" stroke="#977d74" stroke-width="5"/><path d="M25 100V62A22 22 0 0 1 69 62V100Z" fill="#605b6a"/><text x="45" y="83" font-size="34" text-anchor="middle">🐈</text><rect x="-17" y="98" width="131" height="15" rx="7" fill="#bf9cae"/></g>':'<g transform="translate(58 263)"><ellipse cx="44" cy="65" rx="51" ry="16" fill="#c9babc"/><rect x="8" y="12" width="78" height="45" rx="16" fill="#c6abc2" stroke="#937d9e" stroke-width="5"/><text x="47" y="46" font-size="20" text-anchor="middle">🐾</text></g>';
 const kids=has('decor-kids')?'<g transform="translate(844 270)"><path d="M-15 25L48 0L114 29V98H-15Z" fill="#f5e3a8" stroke="#d2af8b" stroke-width="5"/><rect x="8" y="40" width="84" height="52" rx="10" fill="#fef8e4"/><text x="47" y="80" text-anchor="middle" font-size="37">🧸</text></g>':'<g transform="translate(867 315)"><path d="M0 0l61 -16l18 21l-61 15Z" fill="#a8d3c5"/><text x="24" y="1" font-size="28">🪴</text></g>';
 return '<svg class="vpqHallArt25" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
 '<defs><linearGradient id="vpqHallLight25" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffffff" stop-opacity=".65"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient><pattern id="vpqHallFloor25" width="110" height="65" patternUnits="userSpaceOnUse"><path d="M0 0H110V65H0Z" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="3"/></pattern></defs>'+
 // Ceiling/vanishing geometry, 3 visible walls
 '<rect width="1000" height="500" fill="'+c[2]+'"/>'+
 '<polygon points="0,0 1000,0 875,83 125,83" fill="#fffaf4"/>'+
 '<polygon points="0,0 125,83 125,318 0,383" fill="'+c[1]+'"/>'+
 '<polygon points="875,83 1000,0 1000,383 875,318" fill="'+c[1]+'"/>'+
 '<polygon points="125,83 875,83 875,318 125,318" fill="'+c[0]+'"/>'+
 '<polygon points="125,83 875,83 875,318 125,318" fill="url(#vpqHallLight25)"/>'+
 motif+
 '<path d="M125 318H875" stroke="'+c[4]+'" stroke-opacity=".6" stroke-width="10"/>'+
 '<path d="M125 83V318 M875 83V318" stroke="'+c[4]+'" stroke-opacity=".45" stroke-width="7"/>'+
 // Perspective floor and grouting
 '<polygon points="125,318 875,318 1000,500 0,500" fill="'+c[2]+'"/>'+
 '<path d="M125 318L0 500M875 318L1000 500M250 318L225 500M375 318L445 500M500 318V500M625 318L555 500M750 318L775 500 M0 423H1000 M60 365H940 M98 337H902" fill="none" stroke="'+c[3]+'" stroke-width="3" opacity=".58"/>'+
 // Back window 3d recess
 '<g transform="translate(680 136)"><path d="M0 5l143 -12v122l-143 11Z" fill="#b0d5e5" stroke="'+c[4]+'" stroke-width="8"/><path d="M10 12l125 -9v104l-125 9Z" fill="#dbf2fd"/><path d="M20 105Q57 35 95 87T135 64V107L20 114Z" fill="#9bd3ba"/><path d="M78 10v98M10 62h125" stroke="#9ebfd5" stroke-width="6"/></g>'+
 // Backwall door, logo and dimensional shelf
 '<g transform="translate(167 110)"><rect x="0" y="0" width="115" height="205" rx="6" fill="#9cbaa8" stroke="#688e84" stroke-width="8"/><path d="M17 15h82v85H17Z" fill="#e4f5ef"/><circle cx="92" cy="127" r="8" fill="#efcc7f"/></g>'+
 '<g transform="translate(337 98)"><rect width="240" height="75" rx="13" fill="#fffdf9" stroke="'+c[4]+'" stroke-width="6"/><text x="120" y="28" text-anchor="middle" font-size="21" font-family="sans-serif" font-weight="800" fill="#4e6880">VET PHARM QUEST</text><text x="120" y="51" text-anchor="middle" font-size="15" font-family="sans-serif" fill="#678293">WELCOME TO YOUR CLINIC</text></g>'+
 '<g transform="translate(347 193)"><polygon points="0,0 240,0 264,25 22,25" fill="#f9f5e7" stroke="#a5a5ad" stroke-width="4"/><rect x="22" y="25" width="242" height="107" rx="7" fill="#b4cadd" stroke="#779cb0" stroke-width="6"/><polygon points="22,25 0,0 0,99 22,132" fill="#91aac3"/><rect x="62" y="50" width="160" height="57" rx="8" fill="#e9f6f4"/><text x="143" y="83" text-anchor="middle" fill="#4d7888" font-size="23" font-family="sans-serif" font-weight="800">RECEPTION</text><rect x="105" y="-40" width="102" height="49" rx="5" fill="#667789"/><rect x="112" y="-33" width="88" height="35" fill="#bfdce7"/><path d="M145 9h21v14h-21Z" fill="#75899a"/></g>'+
 // Chairs: visible height + side planes
 '<g transform="translate(220 329)"><path d="M0 0l49-17 56 27-49 17Z" fill="#c8b2d5"/><path d="M0 0v48l56 27V27Z" fill="#9279aa"/><path d="M56 27l49-17v46L56 75Z" fill="#bba1ca"/><path d="M0 -60l49-19 56 24-56 22Z" fill="#a7c1d8"/><path d="M0 -60v60l49 27v-60Z" fill="#668ead"/></g>'+
 '<g transform="translate(718 327)"><path d="M0 0l58-17 57 28-58 19Z" fill="#c9b4dd"/><path d="M0 0v48l57 27V30Z" fill="#9279b2"/><path d="M57 30l58-19v41L57 75Z" fill="#b39aca"/><path d="M0 -59l58-17 57 25-58 18Z" fill="#a7d9d1"/><path d="M0 -59v59l57 30v-63Z" fill="#78b7ab"/></g>'+
 cat+kids+seasonal+
 '<g transform="translate(900 116)"><rect x="14" y="40" width="18" height="88" fill="#8eae86"/><ellipse cx="17" cy="40" rx="36" ry="23" fill="#75bda4"/><ellipse cx="38" cy="21" rx="32" ry="25" fill="#9ad1b5"/><path d="M-2 122h54l-7 27H7Z" fill="#ba9b7c"/></g>'+
 '<text x="502" y="478" text-anchor="middle" font-size="16" font-family="sans-serif" font-weight="700" fill="#786975" opacity=".8">2.5D RECEPTION HALL • DEPTH-VIEW PREVIEW</text></svg>';
}
art.roomArt=function(key){if(key==='reception'&&state.receptionView==='isometric')return svg();return originalArt(key)};
function sync(){
 stage.dataset.receptionView=stage.dataset.room==='reception'?state.receptionView:'other';
 toggle.textContent=state.receptionView==='isometric'?'🏠 Reception view: 2.5D ✓':'🏠 Reception view: Classic 2D';
 toggle.setAttribute('aria-pressed',state.receptionView==='isometric'?'true':'false');
 toggle.hidden=stage.dataset.room!=='reception';
}
const toggle=document.createElement('button');
toggle.id='vpqReceptionView25';toggle.type='button';toggle.className='vpqReceptionView25';
toggle.setAttribute('aria-label','Toggle reception between 2.5D perspective and classic 2D');
toggle.onclick=()=>{
 state.receptionView=state.receptionView==='isometric'?'classic':'isometric';
 persist();renderRoom();sync();
};
controls.insertAdjacentElement('afterend',toggle);
const previousRender=renderRoom;
api.setRenderRoom?.(function(){previousRender();sync()});
const previousRoomArt=art.roomArt;
const style=document.createElement('style');
style.textContent='.vpqReceptionView25{display:block;margin:9px auto 0;padding:9px 16px;border:2px solid #acb9e4;border-radius:14px;background:#f5efff;color:#4d507c;font-size:13px;font-weight:800;cursor:pointer}.vpqReceptionView25:focus-visible{outline:3px solid #6184c1;outline-offset:3px}.vpqReceptionView25[hidden]{display:none}.stage[data-reception-view="isometric"] .floor{background:transparent;border-top:0}.stage[data-reception-view="isometric"] .walls{background:transparent}.stage[data-reception-view="isometric"]:after{display:none}.stage[data-reception-view="isometric"] .prop .emoji{font-size:clamp(35px,5vw,62px)}.stage[data-reception-view="isometric"] .prop{bottom:24%}.vpqHallArt25{width:100%;height:100%;position:absolute;inset:0;display:block;pointer-events:none}';
document.head.appendChild(style);
const observer=new MutationObserver(()=>sync());observer.observe(stage,{attributes:true,attributeFilter:['data-room']});
sync();persist();
return {toggle,svg,refresh:sync};
};
