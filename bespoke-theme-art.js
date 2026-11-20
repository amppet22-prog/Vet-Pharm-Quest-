/* Hand-shaped themed furniture pieces that should never look like recolored generic items.
   Keeps the existing item IDs, rewards and ownership untouched. */
(function(){
'use strict';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const path=(d,fill,stroke='#594851',sw=3)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-linejoin="round" stroke-linecap="round"/>';
const rect=(x,y,w,h,fill,stroke='#594851',r=0,sw=3)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
const el=(x,y,rx,ry,fill,stroke='none',sw=2)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
const cir=(x,y,r,fill,stroke='none')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/>';
const line=(d,stroke,sw=3)=>'<path d="'+d+'" fill="none" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-linecap="round"/>';
const gold='#e5b966',ivory='#fff1d9',oak='#956843',dark='#4c304a',rose='#9c5b70',moss='#74967b';
function svg(item,body){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 165" role="img" aria-label="'+esc(item.label)+' collectible illustration">'+el(122,147,90,9,'#57485820')+body+'</svg>'}
function hoof(x,y){return '<g transform="translate('+x+' '+y+')">'+path('M-10-10Q-21 6-8 14Q0 20 8 14Q21 6 10-10L1-4 -1-4Z','#704e3c','#704e3c',1)+line('M0-4V14','#dfc6ac',2)+'</g>'}
function cowsplot(x,y,rotation=0){return '<g transform="translate('+x+' '+y+') rotate('+rotation+')">'+path('M-21-8Q-17-21 1-13Q11-24 22-6Q20 8 9 13Q-2 18-12 9Q-25 5-21-8Z','#44454a','#44454a',2)+'</g>'}
function horseshoe(x,y){return '<g transform="translate('+x+' '+y+')">'+path('M-22 2V-12Q-21-35 0-35Q22-35 22-12V2H10V-11Q10-23 0-23Q-10-23-10-11V2Z',gold,'#8c6749',3)+cir(-16,-8,2,'#fff0cf')+cir(16,-8,2,'#fff0cf')+'</g>'}
function cactus(x,y){return '<g transform="translate('+x+' '+y+')">'+line('M0 13v-51m0 34q-21 0-21-14v-18m21 13q21 0 21-15v-13','#558b6b',13)+line('M0 13v-51m0 34q-21 0-21-14v-18m21 13q21 0 21-15v-13','#8ab89a',7)+'</g>'}
function cactusflower(x,y){return '<g transform="translate('+x+' '+y+')">'+cir(0,0,8,'#cf8899')+cir(-5,-5,5,'#efaec0')+cir(6,-5,5,'#efaec0')+cir(0,0,3,'#f6d17f')+'</g>'}
function leatherSofa(){return path('M27 79Q27 40 53 39H186Q211 38 213 79V115H27Z','#a56f4a','#67482f',5)+path('M40 70Q45 43 69 48H170Q194 45 200 70V101H40Z','#bc8b61','#67482f',3)+path('M45 109Q120 92 198 109L200 127H40Z','#80543b','#67432d',4)+
  path('M20 82Q15 77 13 96V125H45V79Z','#976447','#69452d',4)+path('M195 79H221V125H195Z','#976447','#69452d',4)+
  line('M116 49v54M49 91h141','#785039',2)+line('M38 130v8m166-8v8','#6e4b33',9)+
  '<g fill="#e0b57e">'+[49,71,94,117,140,163,185].map(x=>cir(x,106,1.5,'#e0b57e')).join('')+'</g>'+
  path('M66 54L91 60 89 84 64 75Z','#ead1ab','#9f7652',2)+path('M144 57L177 54 179 76 149 83Z','#d4a778','#886344',2)+horseshoe(121,87);
}
function westernRug(){return el(120,105,94,40,'#6c4b3b','#7a583d',4)+el(120,100,86,33,'#edd3af','#856246',2)+
 path('M30 99l18-16 15 16 16-16 15 16 16-16 16 16 16-16 16 16 16-16 16 16','#8a4e48','#89584a',2)+
 path('M42 113q26-14 52 0t52 0t52 0','none','#826a56',3)+horseshoe(119,100)+hoof(74,105)+hoof(165,105);}
function westernTrough(){return path('M22 73H217L199 133H40Z','#a17950','#674933',5)+path('M28 73h184v15H28Z','#d7b58b','#6c4a32',3)+
 [52,83,115,147,179].map(x=>line('M'+x+' 90l-5 33','#7b5236',2)).join('')+
 path('M53 77L67 48 86 77Z','#a76d51','#6b4735')+
 horseshoe(121,116)+path('M133 74q18-36 32-11','#d6a77d','#815e3f')+
 cir(169,68,12,'#c49c73','#876747')+path('M68 76q11-38 25-22','#f2df9f','#997858');
}
function draculaCoffin(){return path('M112 9L151 11 184 39 174 133 68 133 58 39 88 11Z','#32273c','#241f31',5)+
 path('M112 19L143 21 172 45 164 124 77 124 69 45 97 21Z','#6f465d','#ab7990',3)+
 path('M114 22v100','#a87b8b',2)+path('M82 42L143 42 153 54 75 54Z','#8e5a71','#9d728c')+
 path('M80 87Q121 69 161 87L159 120H80Z','#a0779b','#b48fa4',3)+
 path('M85 89Q114 77 150 89','#e0b5ce','#b48ba6',3)+
 path('M95 60q25-16 50 0','#512b48','#512b48',2)+
 cir(112,70,5,'#e3bba8')+cir(129,70,5,'#e3bba8')+
 path('M85 132L73 144M159 132l13 12','none','#38283b',6)+
 path('M107 96l-8 8 8 11 11-11-11-8z',gold,'#9a7247',2);
}
function draculaCandle(){return path('M67 133H173','#5c3d58','#36273c',7)+
 [88,120,152].map((x,i)=>rect(x-8,76-i%2*11,16,59+i%2*11,'#ece0d0','#8c6c75',4,2)+
 path('M'+(x-1)+' '+(76-i%2*11)+'q-12-16 0-25q13 11 0 25Z','#f0b968','#b36d52',1)).join('')+
 path('M62 133q59 12 115 0','none','#705168',4)+path('M120 41q22-17 32 0','#85617c','#85617c',2);
}
function draculaWebRug(){return el(120,98,91,44,'#3f314d','#8a7089',4)+el(120,98,78,34,'#6c5276','#c49caf',2)+
 [0,30,60,90,120,150,180,210,240,270,300,330].map(a=>{const t=a*Math.PI/180;return line('M120 98L'+(120+Math.cos(t)*76).toFixed(1)+' '+(98+Math.sin(t)*33).toFixed(1),'#d6c1dc',1.8)}).join('')+
 [13,25,35].map(r=>el(120,98,r*2,r,'none','#d4bed9',1.7)).join('')+cir(145,83,4,'#362e46');
}
function draculaToyBox(){return path('M51 75L76 62H163L190 75 179 138H63Z','#49394e','#32263b',4)+path('M45 71h150v20H45Z','#755575','#3e2e49',3)+
 path('M74 94v29m92-29v29','#9b7591',3)+
 path('M100 105L119 98 139 105 131 120H108Z','#a17d9d','#4b3550',2)+
 cir(114,110,2,'#f3cc9b')+cir(126,110,2,'#f3cc9b')+
 path('M62 74q10-39 25-13M154 71q17-43 30-9','none','#6d546d',8)+
 cir(89,60,9,'#d7ac77')+cir(178,59,9,'#ac7a9d');
}
function cowSofa(){return path('M27 63Q31 39 60 39H177Q207 39 212 66V116H28Z','#fff3dc','#9b8981',5)+
 path('M39 53H200V109H39Z','#fffdf1','#a89b8f',3)+
 cowsplot(76,75,13)+cowsplot(164,65,-15)+cowsplot(131,103,30)+
 path('M35 109q84-18 167 0v23H35Z','#e8c4b6','#a1878a',4)+
 path('M23 83Q14 80 13 100V130H48V82Z','#fff3dc','#a39b8d',4)+
 path('M192 82H225V130H192Z','#fff3dc','#a39b8d',4)+
 path('M58 133v9m128-9v9','none','#977d6c',8)+
 path('M104 95q16-11 32 0','#d7a4a3','#b08b92',2)+cir(114,96,4,'#bd7f86')+cir(127,96,4,'#bd7f86');
}
function cowRug(){return el(120,99,95,43,'#fff0d9','#a08c79',4)+
 cowsplot(80,88,-20)+cowsplot(151,111,28)+cowsplot(173,76,-10)+
 [54,105,137,184].map(x=>'<g transform="translate('+x+' 117)">'+Array.from({length:5},(_,i)=>'<ellipse cx="0" cy="-9" rx="4" ry="7" fill="#fffaf1" stroke="#cbb890" stroke-width=".8" transform="rotate('+(i*72)+')"/>').join('')+cir(0,-9,3,'#e4ba6c')+'</g>').join('');
}
function cowToy(){return path('M42 72q77-19 157 0l-14 67H56Z','#f4e7d8','#9a8680',4)+
 cowsplot(84,107)+cowsplot(152,95,-20)+
 path('M36 70q81-18 170 0v16H36Z','#e8bdaf','#a48783',3)+
 cir(113,105,18,'#efb8b5','#ae8386')+cir(105,104,5,'#9c7881')+cir(121,104,5,'#9c7881')+
 '<path d="M69 64q9-34 26-15M149 62q19-38 32-17" fill="none" stroke="#9e8773" stroke-width="7"/>';
}
function horseSofa(){return path('M30 43h181v81H30Z','#b68e65','#745b46',4)+
 [42,75,108,141,174,199].map(x=>rect(x,45,10,77,'#825f46','#785a41',1,1)).join('')+
 path('M42 80Q120 58 199 80V121H42Z','#b6a581','#756950',3)+
 path('M44 105Q119 88 197 105V132H44Z','#8e705b','#715440',3)+
 horseshoe(120,96)+hoof(80,107)+hoof(161,107)+
 path('M45 135v8m147-8v8','none','#795c44',8);
}
function horseBanner(){return rect(48,25,144,107,'#e0c79e','#8a654c',6)+
 path('M50 34H190V80H50Z','#aed0bd','#7b967c',1)+
 path('M50 81q34-29 70-12t70 9v44H50Z','#80a77d','#628d6c',1)+
 path('M80 104q10-45 29-42l19 20 2 32H98Z','#a97750','#79583f',3)+
 path('M100 68q13-17 31-13l10 10-15 13Z','#74553f','#74553f',1)+
 cir(119,74,3,'#272c30')+line('M53 131h134','#76563e',4);
}
function reptileTerrarium(){return rect(27,37,184,104,'#9d8067','#5f6b5e',12)+rect(38,46,162,81,'#d6eee3','#6b9e90',8,3)+
 path('M42 111q33-24 79-2t75-7v22H42Z','#b3c79b','#79a187',2)+
 path('M63 114v-48l-13-12m13 39 19-13m96 35V69l12-15','none','#62836c',5)+
 path('M89 103q30-24 49-3l20-4q9 11-4 14l-18-2q-33 15-47-5Z','#7aaa8a','#4e806e',3)+
 cir(146,98,3,'#2b4a44')+line('M112 113l-14 9m39-14 15 12','#518675',3)+
 rect(37,40,164,5,'#b89b79','#947b5e',1,1);
}
function reptileShelf(){return rect(49,23,142,119,'#a57d59','#735943',5)+rect(59,31,122,104,'#f0e7c9','#917f63',1,2)+
 line('M59 66h122M59 101h122','#8f6e51',6)+
 [66,91,114,137,160].map((x,i)=>rect(x,36+(i%2)*3,13,25,'#'+['79a990','afc9a0','d6a77a','8cae9f','a898c4'][i], '#7b8267',1,1)).join('')+
 path('M78 92q17-32 33-8l12 2q8 18-10 17H90Z','#6ea888','#457c6f',2)+
 cir(113,85,2,'#334e49')+
 path('M131 113q10-16 26-7t17 15h-40Z','#8baa7d','#4d796d',2);
}
function reptileRug(){return path('M29 108Q46 62 90 70Q119 48 148 68Q195 56 210 101Q207 135 143 131Q92 142 46 126Z','#6eaf96','#4c8575',4)+
 path('M58 112Q65 86 105 85Q125 63 152 83Q174 75 191 100Q178 119 143 117Q94 129 58 112Z','#b4d6ae','#649b80',3)+
 path('M55 94q29-49 66-19m51 9q37-5 33 22','none','#477969',5)+
 cir(163,92,5,'#3e6255')+cir(165,91,1.7,'#fff')+
 path('M173 108q15 0 17 7','none','#42725c',2);
}
function jurassicCouch(){return path('M42 80Q27 67 33 52Q50 19 69 47Q86 16 108 43Q136 17 156 46Q177 22 203 55L200 125H38Z','#7bab81','#527e62',4)+
 path('M51 71Q118 44 191 74V107H51Z','#a7ce95','#63936d',3)+
 path('M38 99q80-20 164 0v28H38Z','#6a9a76','#4c7a63',4)+
 path('M32 51L48 34 57 55 74 30 90 55 109 31 126 56 148 35 159 56 180 36 193 58','#5c8d6b','#4c735a',3)+
 path('M21 99q-15-10-14 13l12 21h29V97Z','#729e78','#52795f',3)+
 path('M192 97h30l10 18-14 18h-26Z','#729e78','#52795f',3)+
 cir(84,75,3,'#456b56')+pawdino(130,108);
}
function pawdino(x,y){return path('M'+(x-11)+' '+(y-1)+'q11-20 22 0l-5 17h-13Z','#416c5d','#416c5d',2)+[x-10,x,x+10].map(xx=>cir(xx,y-13,3.5,'#416c5d')).join('')}
function jurassicTower(){return path('M97 143V71L109 24H151L166 71V143Z','#a77e69','#755c50',4)+
 path('M104 50Q120 26 146 50L151 73Q125 83 99 73Z','#d68061','#a35f57',3)+
 path('M107 72q12-13 21-2t26-2','none','#dfac6a',5)+
 path('M120 143V109Q119 89 137 89Q156 91 156 112V143Z','#4c554e','#4c554e',1)+
 path('M57 82Q70 42 108 59l-6 22Z','#79a374','#4c795f',4)+
 path('M144 47q38-37 68 12l-28 21-31-18Z','#6d9b70','#4f795d',4)+
 path('M48 80q20 14 52 1M165 81q24 15 45-14','none','#4a785f',3)+
 cir(130,103,2,'#dfc6a0');
}
function jurassicRug(){return el(120,98,94,45,'#93bd8a','#557b68',4)+el(120,98,81,33,'#bbd69d','#6e9977',2)+
 [65,98,136,174].map((x,i)=>pawdino(x,88+(i%2)*17)).join('')+
 path('M54 89q60-38 127 0','none','#709a79',3);
}
function art(item){
 const group=String(item.themeGroup||''),kind=item.furnitureKind,name=String(item.label||'').toLowerCase();
 let body=null;
 if(group.includes("Dracula's Castle")){
  if(kind==='tree')body=draculaCoffin();
  if(kind==='rug')body=draculaWebRug();
  if(kind==='lamp')body=draculaCandle();
  if(kind==='box')body=draculaToyBox();
 }
 if(group.includes('Cowboy Ranch')){
  if(kind==='sofa')body=leatherSofa();
  if(kind==='rug')body=westernRug();
  if(kind==='box')body=westernTrough();
  if(kind==='banner')body=path('M48 27H192V131L169 115 122 132 75 114 48 131Z','#d2aa76','#81583d',4)+horseshoe(120,85)+line('M51 33h138','#805d40',8);
  if(kind==='plant')body=path('M73 104h95l-12 36H86Z','#bd8e6b','#835c43',4)+cactus(118,111)+cactusflower(119,65)+cactusflower(98,91);
  if(kind==='pod')body=path('M30 100q90-66 180 0l-15 39H45Z','#e5d0a9','#76543d',4)+cowsplot(82,106)+cowsplot(145,91)+path('M100 138V106q20-29 40 0v32Z','#5e4a42','#5e4a42',2);
 }
 if(group.includes('Cow Cottage')||group.includes('Barnyard Buddies')){
  if(kind==='sofa')body=cowSofa();
  if(kind==='rug')body=cowRug();
  if(kind==='box')body=cowToy();
  if(kind==='banner')body=cowRug()+line('M48 26h144','#876a58',7);
 }
 if(group.includes('Horse Stable')){
  if(kind==='sofa')body=horseSofa();
  if(kind==='rug')body=el(120,99,96,42,'#e2c9a4','#927354',4)+hoof(78,89)+hoof(124,111)+hoof(165,86);
  if(kind==='banner')body=horseBanner();
  if(kind==='box')body=westernTrough()+hoof(117,113);
 }
 if(group.includes('Reptile Rescue')){
  if(kind==='terrarium')body=reptileTerrarium();
  if(kind==='shelf')body=reptileShelf();
  if(kind==='rug')body=reptileRug();
  if(kind==='banner')body=rect(50,24,140,117,'#dfefdd','#558274',5)+path('M71 96q36-49 69-21l25-5q15 12 0 25l-30-2q-22 32-64 3Z','#83b89a','#558b77',4)+cir(152,82,4,'#2e5f4a');
  if(kind==='pod')body=path('M27 113q-9-67 88-70q97-7 98 70l-17 20H44Z','#8bb99b','#588772',4)+path('M89 130V94q29-29 62 0v36Z','#577868','#577868',2)+cir(166,80,5,'#406b56')+cir(183,80,5,'#406b56');
 }
 if(group.includes('Jurassic Vet')){
  if(kind==='tree')body=jurassicTower();
  if(kind==='rug')body=jurassicRug();
  if(kind==='sofa')body=jurassicCouch();
  if(kind==='terrarium')body=reptileTerrarium()+path('M99 112q25-30 43-7l18 5-19 6Z','#639579','#49725d',2);
 }
 // Other collections: unique shapes for the storybook theme, not a shared motif.
 if(group.includes('Comic Heroes')){
  if(kind==='sofa')body=path('M28 68L47 45H193L211 69V123H28Z','#5274c1','#263c80',4)+
   path('M47 56H193V106H47Z','#9ebcf0','#304e96',3)+
   path('M42 105h157v24H42Z','#e6b44f','#a46c3a',4)+
   path('M22 87Q12 83 12 106v23h34V87Z','#da645e','#a64654',4)+
   path('M194 87h31v42h-31Z','#da645e','#a64654',4)+
   path('M107 54l-17 26h18l-9 28 46-40h-21l10-14z','#f9e77e','#e4a54b',3)+
   el(120,132,73,4,'#364777')+line('M52 133v7m136-7v7','#25396b',8);
  if(kind==='rug')body=path('M26 101L51 79 75 90 92 66 120 87 141 62 164 84 192 73 218 103 188 128 47 128Z','#edce67','#476baf',4)+
    path('M118 61L96 99h23l-12 33 42-47h-20l12-24Z','#e97b55','#7e4e62',3);
  if(kind==='banner')body=rect(38,27,164,110,'#f7d46f','#4561a2',5)+
   path('M44 36L77 60 61 79 90 86 76 119 134 91 162 121 181 86 198 55 162 61 140 31Z','#e57c65','#926b7b',3)+
   path('M113 43l-20 34h18l-12 37 43-51h-19l10-20Z','#fff3b0','#d2a652',3);
 }
 if(group.includes('Snow Day')){
  if(kind==='sofa')body=path('M28 72Q23 42 52 38H186Q216 38 214 75v51H28Z','#d8edf5','#83a9c3',4)+
    path('M38 54h165v54H38Z','#f7fbff','#83a9c3',3)+
    path('M37 108q81-16 169 0v23H37Z','#a8cfe4','#729fbd',4)+
    path('M22 87Q12 76 13 103v28h31V85Z','#b9dbe9','#789fbb',4)+
    path('M197 85h29v45h-29Z','#b9dbe9','#789fbb',4)+
    cir(82,81,20,'#fff','#9cbaca')+cir(82,65,12,'#fff','#9cbaca')+
    cir(76,62,2,'#48586a')+cir(88,62,2,'#48586a')+
    path('M80 66l10 3-9 3Z','#df9261','#df9261',2)+
    path('M68 83h30','#9dbdd0','#9dbdd0',2)+line('M51 135v8m142-8v8','#7598ad',8);
  if(kind==='pod')body=path('M33 123q-1-83 86-85q87 2 89 85l-20 12H49Z','#effaff','#83aec2',4)+
    path('M82 131V99q3-33 39-34q36 1 39 34v32Z','#a6cad8','#6a99ae',3)+
    cir(62,82,6,'#fff')+cir(185,82,6,'#fff')+
    path('M80 54q42-25 82 0','none','#d0e8ee',6);
  if(kind==='rug')body=el(120,100,90,43,'#e7f5fa','#7ba7bf',4)+
    [67,119,172].map((x,i)=>{let y=100+(i%2?17:-9);return line('M'+x+' '+(y-19)+'v38m-17-29 34 20m-34 0 34-20','#9dc8d9',4)+cir(x,y,5,'#f8fbff')}).join('');
 }
 if(group.includes('Piggy Picnic')){
  if(kind==='sofa')body=path('M34 80Q30 43 65 47L83 32Q100 29 109 48Q132 31 147 44Q200 34 208 80L209 123H31Z','#e6a3b8','#a96d81',4)+
    path('M44 73h155v41H44Z','#f5c7d1','#c3859b',3)+
    path('M43 107q75-16 158 0v24H43Z','#db91aa','#a66783',4)+
    el(120,78,35,25,'#f5b6c2','#b47992',3)+cir(109,78,7,'#bb7e8e')+cir(131,78,7,'#bb7e8e')+
    cir(94,59,4,'#554650')+cir(147,59,4,'#554650')+
    path('M23 94q-13-5-10 17l10 17h23V93Z','#f0bed0','#ac7992',3)+
    path('M194 92h28l5 17-6 18h-27Z','#f0bed0','#ac7992',3);
  if(kind==='rug')body=el(120,99,93,45,'#f5c7d6','#b77d91',4)+
   el(120,99,43,29,'#eaa5bc','#b77d91',2)+
   cir(105,98,8,'#a96682')+cir(135,98,8,'#a96682')+
   [58,181].map(x=>cir(x,101,7,'#f8e0e6')).join('');
 }
 if(group.includes('Hedgehog Hollow')){
  if(kind==='pod')body=path('M30 107Q33 55 76 42L66 25 98 37 111 20 128 37 150 22 159 44Q208 52 211 107L194 136H47Z','#a6957c','#736654',4)+
    [54,73,92,110,128,146,165,186].map((x,i)=>path('M'+x+' 65l-8-21 21 9z','#82765d','#706554',2)).join('')+
    path('M86 132V104q34-37 68 0v28Z','#65584c','#65584c',2)+
    cir(112,112,4,'#f6d1bb')+cir(128,112,4,'#f6d1bb')+
    cir(120,121,5,'#4f403c');
  if(kind==='sofa')body=path('M30 83q4-35 36-31l12-19 19 13 21-25 16 24 28-13 15 21q36 0 35 32v40H30Z','#aa9276','#776855',4)+
    path('M43 74q74-25 156 0v40H43Z','#cfb8a0','#9e8572',3)+
    path('M37 107q80-15 168 0v24H37Z','#8f7c68','#6c5c4e',3)+
    path('M21 94h26v34H21ZM192 94h28v34h-28Z','#9f8b73','#6d6150',3)+
    cir(108,80,4,'#594d47')+cir(133,80,4,'#594d47')+cir(120,87,4,'#8d6b69');
 }
 if(group.includes('Pink Paradise')&&kind==='sofa')body=path('M32 89Q17 50 56 47Q62 13 99 35Q123 7 151 34Q191 19 199 49Q221 60 208 100L200 129H37Z','#f7a8d5','#ce77aa',4)+
   path('M42 91Q58 53 89 70Q119 41 148 69Q183 50 203 91V121H42Z','#ffe1ef','#e49cbe',3)+
   path('M46 111q75-22 152 0v18H46Z','#f2a6cf','#d17ead',3)+
   path('M29 105q-16-17-11 12l12 17h26V104Z','#e99bc2','#c57da3',3)+
   path('M188 105h24l11 14-10 14h-25Z','#e99bc2','#c57da3',3)+
   path('M120 75q-10-16-23-5q-9 12 23 33q31-21 22-33q-14-11-22 5Z','#ee87af','#ca6995',2);
  return body?svg(item,body):null;
}
window.VPQ_BESPOKE_THEME_ART={art};
})();