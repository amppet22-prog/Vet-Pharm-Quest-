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
 }else if(kind==='plant'){
 shape='<ellipse cx="120" cy="145" rx="63" ry="8" fill="'+dark+'" opacity=".14"/>'+
 '<path d="M75 99h90l-13 42H88z" fill="'+main+'" '+stroke+'/>'+
 '<ellipse cx="120" cy="99" rx="46" ry="12" fill="'+light+'" '+stroke+'/>'+
 '<path d="M120 98V29M120 79Q81 65 64 38M120 66Q160 54 175 25M120 88Q86 93 69 76M120 91Q158 82 180 64" fill="none" stroke="#548b6f" stroke-width="6" stroke-linecap="round"/>'+
 '<path d="M119 48Q91 11 71 28Q77 49 119 48M120 70Q148 13 176 21Q177 51 120 70M118 87Q70 51 54 73Q65 97 118 87M124 89Q164 55 189 74Q184 100 124 89" fill="#8eb79a" stroke="#598e73" stroke-width="2"/>'+
 '<path d="M105 112q15-8 30 0" fill="none" stroke="'+dark+'" stroke-width="3"/>';
 }else if(kind==='cart'){
 shape='<path d="M37 52h166v18H37z" fill="'+light+'" '+stroke+'/>'+
 '<path d="M47 84h146v17H47z" fill="'+main+'" '+stroke+'/>'+
 '<path d="M58 71v52m124-52v52" stroke="'+dark+'" stroke-width="8"/>'+
 '<circle cx="58" cy="133" r="12" fill="'+light+'" stroke="'+dark+'" stroke-width="4"/>'+
 '<circle cx="182" cy="133" r="12" fill="'+light+'" stroke="'+dark+'" stroke-width="4"/>'+
 '<rect x="88" y="28" width="64" height="24" rx="8" fill="'+main+'" '+stroke+'/>';
 }else if(kind==='shelf'){
 shape='<path d="M49 23h142v119H49z" fill="'+main+'" '+stroke+'/>'+
 '<path d="M57 28h126v106H57z" fill="'+light+'" stroke="'+dark+'" stroke-width="2"/>'+
 '<path d="M57 63h126m-126 36h126" stroke="'+dark+'" stroke-width="6"/>'+
 [65,86,108,134,161].map((x,i)=>'<rect x="'+x+'" y="'+(34+i%2*4)+'" width="14" height="'+(23-i%2*4)+'" rx="2" fill="'+[main,dark,'#80b9aa','#e8bf9a','#ae9ec6'][i]+'"/>').join('')+
 '<path d="M96 103v28m8-26v26" stroke="'+dark+'" stroke-width="8"/>';
 }else if(kind==='terrarium'){
 shape='<rect x="42" y="43" width="156" height="89" rx="17" fill="'+light+'" '+stroke+'/>'+
 '<path d="M51 106 Q115 73 189 111v13H51z" fill="'+main+'"/>'+
 '<path d="M72 103V76l-12-10m12 23 14-13m80 27V75l13-8" stroke="'+dark+'" stroke-width="4" fill="none"/>'+motif;
 }else{
 shape='<path d="M54 124V78 Q120 28 186 78v46z" fill="'+main+'" '+stroke+'/>'+
 '<ellipse cx="120" cy="118" rx="83" ry="21" fill="'+light+'" '+stroke+'/>'+motif;
 }

 // Bespoke storybook sculpting: different silhouettes, not repeated emoji-stamped furniture.
 const group=String(item.themeGroup||''),label=String(item.label||'').toLowerCase();
 const path=(d,fill,strokeColor=dark,sw=3)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+strokeColor+'" stroke-width="'+sw+'" stroke-linejoin="round" stroke-linecap="round"/>';
 const ellipse=(cx,cy,rx,ry,fill,outline='none',sw=2)=>'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'" stroke="'+outline+'" stroke-width="'+sw+'"/>';
 const circle=(cx,cy,r,fill,outline='none',sw=2)=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+fill+'" stroke="'+outline+'" stroke-width="'+sw+'"/>';
 const flower=(x,y,c='#efb7c8')=>'<g transform="translate('+x+' '+y+')">'+[0,72,144,216,288].map(a=>'<ellipse rx="5" ry="9" cy="-7" fill="'+c+'" transform="rotate('+a+')"/>').join('')+circle(0,0,4,'#f4cc68')+'</g>';
 const leaf=(x,y,r=0)=>'<path d="M'+x+' '+y+'q-14 -22 -30 -9q13 21 30 9q14 -25 32 -15q-9 21 -32 15" fill="#7fa889" stroke="#54836e" stroke-width="2" transform="rotate('+r+' '+x+' '+y+')"/>';
 const mushroom=(x,y,z=1,c='#d77366')=>'<g transform="translate('+x+' '+y+') scale('+z+')">'+
   path('M-12 0Q-10 -19 -6 -23H6Q12 -18 12 0Z','#f7e1ba','#a88778',2)+
   path('M-24 -21Q-21 -51 0 -52Q22 -51 24 -21Q0 -12 -24 -21Z',c,'#925d5d',2.6)+
   circle(-9,-29,4,'#fff7e9')+circle(6,-37,5,'#fff7e9')+circle(14,-25,3,'#fff7e9')+
   path('M-21 -20Q0 -13 21 -20','none','#f6e4c8',2)+'</g>';
 const star=(x,y,color='#f4d588')=>path('M'+x+' '+(y-9)+'l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',color,color,1);
 const paw=(x,y,col=dark)=>'<g fill="'+col+'">'+ellipse(x,y+7,9,7,col)+circle(x-11,y-3,3.5,col)+circle(x-4,y-9,3.5,col)+circle(x+5,y-9,3.5,col)+circle(x+12,y-2,3.5,col)+'</g>';
 const makeMushroomSofa=()=>{
  const cap=path('M17 75Q20 22 110 18Q201 14 223 77L210 90Q119 106 28 89Z','#ca7766','#9a5c55',4);
  const pleats=path('M26 82Q120 113 213 80Q190 111 120 120Q43 113 26 82Z','#f7dec0','#b88679',3)+
    [46,64,83,102,120,139,157,176,194].map(x=>'<path d="M'+x+' 91l'+(x<120?9:-9)+' 17" stroke="#bc8d7e" stroke-width="1.6"/>').join('');
  const spots=[[62,54,9],[98,35,11],[143,39,9],[182,57,12],[121,70,6]].map(([x,y,r])=>ellipse(x,y,r,r*.7,'#fff3df')).join('');
  const cushions='<path d="M38 102Q58 83 88 95Q116 91 121 111Q153 89 185 98Q206 105 205 128H37Z" fill="#f1cfc1" stroke="#a56f72" stroke-width="3"/>'+
    '<path d="M38 109Q24 102 18 121L23 137H217L223 122Q216 99 200 109" fill="#c67d78" stroke="#925d62" stroke-width="4"/>';
  return shadow+cap+spots+pleats+cushions+
   mushroom(61,137,.28,'#e09a7e')+mushroom(193,137,.24,'#d57069')+
   leaf(39,137)+leaf(198,137)+flower(72,107)+flower(160,107,'#fae8bb');
 };
 if(group.includes('Mushroom Cottage')){
  if(kind==='sofa')shape=makeMushroomSofa();
  else if(kind==='tree'||kind==='tower'){
   shape=shadow+path('M99 142Q102 110 110 87L114 46H151L157 142Z','#d1a57c','#856850',4)+
    path('M42 77Q44 11 128 10Q211 10 223 76Q131 97 42 77Z','#cf746d','#935a5b',5)+
    [[81,49,11],[119,28,12],[164,43,11],[190,69,8],[109,68,7]].map(([x,y,r])=>ellipse(x,y,r,r*.72,'#fff2df')).join('')+
    path('M47 78Q120 103 217 76Q197 102 134 106Q69 102 47 78Z','#f1d8b7','#a7806e',3)+
    path('M122 139V115Q126 91 145 92Q161 94 165 116V139Z','#705c5d','#806658',2)+
    ellipse(144,138,21,5,'#4c504b')+
    path('M66 92l5 46m108-44-5 47','none','#95715d',6)+
    ellipse(70,87,30,11,'#b57a68',dark,3)+ellipse(178,83,30,11,'#b57a68',dark,3)+
    leaf(59,142)+leaf(182,143)+mushroom(39,147,.39)+mushroom(211,146,.28,'#e6aa7d')+
    flower(62,135)+flower(190,126,'#ebde8b');
  }else if(kind==='rug'||kind==='carpet'){
   shape=ellipse(120,116,99,28,'#799979')+ellipse(120,98,99,44,'#96ac84','#5e846d',4)+
    ellipse(120,98,87,32,'#c5d4a7','#668e75',2)+
    path('M50 103Q92 66 130 99T195 99','none','#668971',3)+
    [61,81,159,181].map((x,i)=>mushroom(x,i%2?107:96,.32,i%2?'#dc9b80':'#ce776b')).join('')+
    [55,91,145,187].map((x,i)=>flower(x,118-(i%2)*35,i%2?'#f1d4c8':'#f5dd9f')).join('')+
    leaf(109,97)+leaf(147,91);
  }else if(kind==='box'||kind==='chest'){
   shape=shadow+path('M41 89Q50 73 66 76H176Q194 74 199 91L189 139H53Z','#b47b5f','#815b56',4)+
    path('M38 87Q45 63 120 64Q193 63 203 87Z','#d3a987','#946e64',3)+
    '<rect x="99" y="96" width="48" height="32" rx="10" fill="#edd5b4" stroke="#90675f" stroke-width="3"/>'+
    paw(122,104,'#bd8976')+
    mushroom(66,83,.65)+mushroom(176,84,.58,'#dfa785')+
    '<path d="M79 81Q91 42 111 60" fill="none" stroke="#7c9378" stroke-width="12" stroke-linecap="round"/>'+
    '<path d="M142 82Q167 39 178 61" fill="none" stroke="#93ac90" stroke-width="12" stroke-linecap="round"/>'+
    flower(62,135)+leaf(179,136);
  }else if(kind==='plant'){
   shape=shadow+path('M69 99H172L161 145H79Z','#c49a7e','#8a6d5a',4)+
    path('M67 99h107v9H67Z','#e1c39f','#8a6d5a',2)+
    [0,1,2,3,4,5].map(i=>leaf(120+(i-2.5)*12,94-i*9,i%2?24:-20)).join('')+
    mushroom(90,103,.68)+mushroom(152,107,.5,'#e0a474')+
    flower(69,93)+flower(173,96,'#f4e5b2');
  }else if(kind==='lamp'){
   shape=shadow+path('M118 67v69','none','#977860',7)+path('M88 136h65','none','#977860',7)+
    path('M56 69Q65 12 119 12Q173 12 184 69Q121 87 56 69Z','#d47b72','#8e5c63',4)+
    [[94,44,7],[134,33,9],[155,61,5],[112,62,6]].map(([x,y,r])=>circle(x,y,r,'#fff6dd')).join('')+
    path('M59 72Q120 96 181 72Q163 109 120 108Q75 108 59 72Z','#ffe6a6','#b58a72',3)+
    '<path d="M91 102Q120 116 151 102" stroke="#ead39f" stroke-width="4" fill="none"/>'+
    flower(81,137)+leaf(161,139);
  }
 }else{
  // Collection-specific finishing details alter the silhouettes, not just their colors.
  let accent='';
  if(group.includes('Fairy Garden')){
   accent=[flower(64,103,'#f1a9d1'),flower(174,95,'#baa3e8'),flower(105,62,'#f2d8a5'),leaf(56,117),leaf(188,114),
    path('M42 62Q63 27 86 59Q64 77 42 62Z','#d6c0f2','#aa87c1',2),
    path('M152 52Q173 13 201 47Q181 77 152 52Z','#f1c6e0','#aa87c1',2),star(131,26)].join('');
  }else if(group.includes('Royal Palace')){
   accent=path('M93 64l-8-25 17 9 18-24 18 24 17-9-8 25z','#f0ce76','#99785f',3)+
    [98,120,142].map(x=>circle(x,56,4,'#ad7cba')).join('')+
    path('M56 108q64 32 128 0','none','#f9da96',5)+star(60,77)+star(182,77);
  }else if(group.includes("Dracula")){
   accent=path('M36 63Q61 26 90 57Q119 27 146 54Q174 24 207 68Q174 59 162 82Q140 65 120 84Q98 63 73 82Q61 64 36 63Z','#322a40','#59435e',3)+
    '<path d="M49 106Q77 87 103 109M136 106Q160 80 196 104" fill="none" stroke="#e5c1d3" stroke-width="2"/>';
  }else if(group.includes('Comic Heroes')){
   accent=path('M112 19l-29 49h23l-12 43 57-60h-28l16-32z','#ffe06b','#474d81',4)+
    star(52,65,'#f7d06a')+star(184,88,'#f7d06a');
  }else if(group.includes('Snow Day')){
   accent=[55,98,148,184].map((x,i)=>star(x,48+(i%2)*42,'#ffffff')).join('')+
    circle(121,92,16,'#f9fcff','#94b5ca',2)+circle(121,68,11,'#f9fcff','#94b5ca',2)+
    path('M114 48h15v7h-15z','#83a9c1','#83a9c1',1);
  }else if((group.includes('Cow Cottage')||group.includes('Barnyard Buddies'))){
   accent=[ellipse(72,82,21,13,'#55575c'),ellipse(150,55,16,13,'#55575c'),ellipse(180,100,11,7,'#55575c')].join('')+
    flower(112,55,'#f5d9a4');
  }else if(group.includes('Jurassic')){
   accent=path('M45 92Q55 70 75 81L91 60 113 80 136 56 154 84 180 69Q200 75 201 109Q167 117 138 111Q102 122 70 114Z','#86aa79','#52765e',3)+
    [75,100,129,158].map(x=>path('M'+x+' 84l10-16 10 18z','#bad29f','#6a926a',2)).join('')+
    paw(115,101,'#577b62');
  }else if(group.includes('Horse')||group.includes('Cowboy')){
   accent=path('M69 59q14-22 26 0l-6 20q-12 13-20 0z','#a17857','#795c49',3)+
    path('M148 66Q156 92 170 65','none','#d3a765',7)+
    star(112,67,'#efcf87')+leaf(178,117);
  }else if(group.includes('Piggy')){
   accent=ellipse(120,83,34,25,'#f5bbc7','#ae7c8e',3)+circle(110,82,5,'#be8595')+circle(130,82,5,'#be8595')+
    flower(70,81,'#edb9ca')+flower(178,82,'#edb9ca');
  }else if(group.includes('Hedgehog')){
   accent=path('M63 96Q69 38 126 55Q164 55 187 95L176 116H78Z','#a38c70','#746b59',3)+
    [80,96,112,128,144,160].map(x=>path('M'+x+' 63l-5-19 17 15z','#806e5e','#806e5e',1)).join('')+
    leaf(65,123)+leaf(177,121);
  }else if(group.includes('Reptile')){
   accent=path('M59 95Q80 57 132 69Q152 51 169 74Q187 83 174 99Q159 110 147 95Q112 115 87 98Z','#75b59d','#477d74',3)+
    circle(158,80,3,'#304d53')+leaf(72,115)+leaf(184,114);
  }else if(group.includes('Pride')){
   accent=['#f8b3ca','#f4d57c','#b3daac','#aed3fa','#c0afea'].map((c,i)=>path('M'+(65+i*16)+' 89q-15-40 1-50q18 10 1 50z',c,'none',0)).join('')+
    star(120,73,'#ffffff');
  }else if(group.includes('Stars & Stripes')){
   accent=star(85,59,'#fafafa')+star(150,55,'#ffffff')+star(116,92,'#f5e8d1')+
    path('M55 107q65-26 130 0','none','#c55d64',7);
  }
  shape+=accent;
 }

 const flag=Array.isArray(item.flagPalette)&&item.flagPalette.length?'<rect x="43" y="48" width="154" height="78" rx="3" fill="url(#flag'+id+')"/><path d="M36 31v112" stroke="'+dark+'" stroke-width="6"/>':'';
 const paletteDef=Array.isArray(item.flagPalette)?'<linearGradient id="flag'+id+'" x1="0" y1="0" x2="0" y2="1">'+item.flagPalette.map((c,i)=>'<stop offset="'+(i*100/Math.max(1,item.flagPalette.length-1))+'%" stop-color="'+esc(c)+'"/>').join('')+'</linearGradient>':'';
 const body=item.flagPalette?shadow+flag:shadow+shape;
 return '<svg viewBox="0 0 240 165" role="img" aria-label="'+esc(item.label)+' illustrated collectible" xmlns="http://www.w3.org/2000/svg">'+
 '<defs>'+paletteDef+'</defs><g>'+body+'</g></svg>';
}
window.VPQ_REWARD_ART={art,colors};
})();