/* Illustrated miniature reward furniture for the Level Rewards boutique.
   Original vector art generated in-game; no external image dependencies. */
(function(){
'use strict';
const palettes={
'Mushroom Cottage':['#d9918c','#935a65','#f9e8c0'],
'Fairy Garden':['#ba9cdd','#8a71b4','#f9efc5'],
'Royal Palace':['#b494d9','#7963a2','#f7db95'],
'Pink Paradise':['#f5a2ce','#c46da4','#fff0e8'],
"Dracula's Castle":['#856b99','#4c395f','#e1a3af'],
'Comic Heroes':['#7b9fe6','#3f568e','#f3d36f'],
'Snow Day':['#b8deef','#85adc5','#ffffff'],
'Stars & Stripes':['#cd7882','#5e83b9','#fff5e9'],
'Cowboy Ranch':['#c49b7d','#8a624a','#f5d7a1'],
'Barnyard Buddies':['#d4b7a5','#92726a','#f9e7df'],
'Reptile Rescue':['#9dc5a7','#588c78','#e6efb9'],
'Jurassic Vet':['#9bbb88','#547c65','#e9cb87'],
'Cow Cottage':['#d5d1d1','#707779','#ffffff'],
'Horse Stable':['#c49b76','#8d684f','#eed6af'],
'Piggy Picnic':['#e9a3bd','#bf748d','#fff0d7'],
'Hedgehog Hollow':['#c4b69b','#8c7d67','#f2e2c0'],
'Pride Celebration':['#d49dcf','#766cb4','#ffe7a7']};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function colors(item){return Object.entries(palettes).find(([k])=>String(item.themeGroup||'').includes(k))?.[1]||['#c4a4c7','#7c829e','#f8e5c7']}
function art(item){
 const [main,dark,light]=colors(item),kind=String(item.furnitureKind||'decor'),id=esc(item.id||'item');
 const g=item.furnitureGlyph||({sofa:'🛋️',rug:'✿',tree:'🐈',bed:'♡',banner:'✦',box:'🧸',flag:'🏳️',plant:'🌿',table:'☕',lamp:'✦',terrarium:'🦎'}[kind]||'✦');
 const motif='<text x="120" y="89" text-anchor="middle" font-size="30" font-family="Arial,Segoe UI Emoji,sans-serif">'+esc(g)+'</text>';
 const stroke='stroke="'+dark+'" stroke-width="4" stroke-linejoin="round"';
 const shadow='<ellipse cx="120" cy="143" rx="87" ry="10" fill="'+dark+'" opacity=".11"/>';
 let shape='';
 if(kind==='sofa'){
 shape='<rect x="37" y="57" width="166" height="68" rx="22" fill="'+main+'" '+stroke+'/>'+
 '<rect x="50" y="53" width="140" height="40" rx="17" fill="'+light+'" '+stroke+'/>'+
 '<rect x="27" y="84" width="38" height="43" rx="15" fill="'+main+'" '+stroke+'/>'+
 '<rect x="175" y="84" width="38" height="43" rx="15" fill="'+main+'" '+stroke+'/>'+
 '<path d="M64 100 Q120 111 176 100" fill="none" stroke="'+dark+'" stroke-width="3"/>'+
 '<path d="M55 127v10m130-10v10" stroke="'+dark+'" stroke-width="8" stroke-linecap="round"/>'+
 '<path d="M97 65l5 10 10 3-10 3-5 10-5-10-10-3 10-3z" fill="'+main+'" opacity=".75"/>';
 }else if(kind==='rug'||kind==='carpet'){
 shape='<ellipse cx="120" cy="101" rx="91" ry="42" fill="'+dark+'" opacity=".2"/>'+
 '<ellipse cx="120" cy="95" rx="92" ry="41" fill="'+main+'" '+stroke+'/>'+
 '<ellipse cx="120" cy="95" rx="79" ry="29" fill="'+light+'" stroke="'+dark+'" stroke-width="2" stroke-dasharray="4 5"/>'+
 '<ellipse cx="120" cy="95" rx="64" ry="23" fill="'+main+'" opacity=".55"/>'+motif;
 }else if(kind==='tree'||kind==='tower'){
 shape='<path d="M46 136h150" stroke="'+dark+'" stroke-width="9" stroke-linecap="round"/>'+
 '<rect x="108" y="62" width="24" height="74" rx="7" fill="'+light+'" '+stroke+'/>'+
 '<path d="M112 71l-7 58m21-57 7 58" stroke="'+main+'" stroke-width="5" stroke-dasharray="5 6"/>'+
 '<ellipse cx="87" cy="78" rx="49" ry="19" fill="'+main+'" '+stroke+'/>'+
 '<ellipse cx="163" cy="43" rx="47" ry="19" fill="'+light+'" '+stroke+'/>'+
 '<path d="M132 42v25m61-25v25" stroke="'+dark+'" stroke-width="5"/>'+
 '<path d="M123 31l10-19 16 16m31-1 15-16 8 22" fill="'+main+'" '+stroke+'/>'+
 '<rect x="134" y="38" width="60" height="41" rx="16" fill="'+main+'" '+stroke+'/>'+
 '<path d="M157 76q8-27 19 0" fill="'+dark+'"/>';
 }else if(kind==='bed'||kind==='pod'){
 shape='<path d="M28 103 Q35 52 120 55 Q205 52 212 103 L209 124 Q120 157 31 124 Z" fill="'+main+'" '+stroke+'/>'+
 '<ellipse cx="120" cy="102" rx="71" ry="32" fill="'+light+'" stroke="'+dark+'" stroke-width="3"/>'+
 '<ellipse cx="120" cy="105" rx="47" ry="17" fill="'+main+'" opacity=".65"/>'+motif;
 }else if(kind==='banner'||kind==='flag'){
 shape='<path d="M54 32h132v95l-33-17-33 17-33-17-33 17z" fill="'+main+'" '+stroke+'/>'+
 '<path d="M63 39h114v71l-24-14-33 18-33-18-24 14z" fill="'+light+'" opacity=".62"/>'+
 '<path d="M43 27h154" stroke="'+dark+'" stroke-width="9" stroke-linecap="round"/>'+motif;
 }else if(kind==='box'||kind==='chest'){
 shape='<path d="M38 78h164l-14 60H52z" fill="'+main+'" '+stroke+'/>'+
 '<path d="M34 74h172v18H34z" fill="'+light+'" '+stroke+'/>'+
 '<path d="M70 74v-22m100 22V52" stroke="'+dark+'" stroke-width="5"/>'+
 '<circle cx="70" cy="48" r="16" fill="'+light+'" stroke="'+dark+'" stroke-width="3"/>'+
 '<circle cx="170" cy="48" r="16" fill="'+main+'" stroke="'+dark+'" stroke-width="3"/>'+motif;
 }else if(kind==='table'){
 shape='<ellipse cx="120" cy="68" rx="89" ry="25" fill="'+light+'" '+stroke+'/>'+
 '<path d="M62 82l-12 54m128-54 12 54" stroke="'+dark+'" stroke-width="10" stroke-linecap="round"/>'+
 '<path d="M88 58h62l-8 16H94z" fill="'+main+'" '+stroke+'/>'+motif;
 }else if(kind==='lamp'){
 shape='<path d="M76 135h88" stroke="'+dark+'" stroke-width="9" stroke-linecap="round"/>'+
 '<path d="M120 63v70" stroke="'+dark+'" stroke-width="8"/>'+
 '<path d="M78 71l18-47h48l18 47z" fill="'+main+'" '+stroke+'/>'+
 '<path d="M96 76h48" stroke="'+light+'" stroke-width="6"/>'+motif;
 }else if(kind==='terrarium'){
 shape='<rect x="42" y="43" width="156" height="89" rx="17" fill="'+light+'" '+stroke+'/>'+
 '<path d="M51 106 Q115 73 189 111v13H51z" fill="'+main+'"/>'+
 '<path d="M72 103V76l-12-10m12 23 14-13m80 27V75l13-8" stroke="'+dark+'" stroke-width="4" fill="none"/>'+motif;
 }else{
 shape='<path d="M54 124V78 Q120 28 186 78v46z" fill="'+main+'" '+stroke+'/>'+
 '<ellipse cx="120" cy="118" rx="83" ry="21" fill="'+light+'" '+stroke+'/>'+motif;
 }
 const flag=Array.isArray(item.flagPalette)&&item.flagPalette.length?'<rect x="43" y="48" width="154" height="78" rx="3" fill="url(#flag'+id+')"/><path d="M36 31v112" stroke="'+dark+'" stroke-width="6"/>':'';
 const paletteDef=Array.isArray(item.flagPalette)?'<linearGradient id="flag'+id+'" x1="0" y1="0" x2="0" y2="1">'+item.flagPalette.map((c,i)=>'<stop offset="'+(i*100/Math.max(1,item.flagPalette.length-1))+'%" stop-color="'+esc(c)+'"/>').join('')+'</linearGradient>':'';
 const body=item.flagPalette?shadow+flag:shadow+shape;
 return '<svg viewBox="0 0 240 165" role="img" aria-label="'+esc(item.label)+' illustrated collectible" xmlns="http://www.w3.org/2000/svg">'+
 '<defs>'+paletteDef+'</defs><g>'+body+'</g></svg>';
}
window.VPQ_REWARD_ART={art,colors};
})();