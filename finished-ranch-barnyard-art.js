/* Finished collectible artwork — Cowboy Ranch + Barnyard Buddies.
 * Each asset is individually drawn for its actual furniture function.
 * SVG-only; no image URLs, no purchased content changes, no emoji stickers.
 */
(function(){
'use strict';
const P=(d,f,s='#765440',w=3)=>'<path d="'+d+'" fill="'+f+'" stroke="'+s+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>';
const L=(d,s='#765440',w=3)=>'<path d="'+d+'" fill="none" stroke="'+s+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';
const R=(x,y,w,h,f,s='#765440',r=3,sw=3)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+f+'" stroke="'+s+'" stroke-width="'+sw+'"/>';
const E=(x,y,rx,ry,f,s='none',w=2)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'" stroke="'+s+'" stroke-width="'+w+'"/>';
const C=(x,y,r,f,s='none')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'" stroke="'+s+'" stroke-width="2"/>';
const T=(x,y,t,size=13,color='#795b41')=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="'+size+'" font-weight="800" font-family="Trebuchet MS,Arial,sans-serif" fill="'+color+'">'+t+'</text>';
const outline='#6c5244',wood='#b8855b',tan='#ebc99c',cream='#f6e7cf',sage='#739d7b',red='#b96b65',pink='#edb6bd';
const shadow=E(120,147,91,9,'#514a4030');
const patch=(x,y,sc=1)=>'<g transform="translate('+x+' '+y+') scale('+sc+')">'+P('M-19-8q9-15 23-6q17-7 22 10q-4 15-19 12q-15 10-27-3z','#524945','#524945',1)+'</g>';
const flower=(x,y,c='#f5d2b7')=>'<g transform="translate('+x+' '+y+')">'+[0,72,144,216,288].map(a=>'<ellipse cx="0" cy="-7" rx="5" ry="8" fill="'+c+'" transform="rotate('+a+')"/>').join('')+C(0,0,4,'#eab35d')+'</g>';
const horseShoe=(x,y,sc=1)=>'<g transform="translate('+x+' '+y+') scale('+sc+')">'+P('M-23 14v-22q0-26 23-26t23 26v22H12V-8Q12-22 0-22T-12-8v22z','#dfbb75','#977150',3)+[-16,16].map(xx=>C(xx,5,2.5,'#fff0cc')).join('')+'</g>';
const rope=(x,y)=>'<g transform="translate('+x+' '+y+')">'+E(0,0,20,12,'none','#d3a36b',7)+E(0,0,20,12,'none','#f4d09d',2)+L('M-14-10l5 3m10-8 4 4m8 11 5 4','#98704b',2)+'</g>';
const cactusflower=(x,y)=>flower(x,y,'#efb3ba');
const cactus=(x,y,sc=1)=>'<g transform="translate('+x+' '+y+') scale('+sc+')">'+L('M0 4v-65m0 38q-28 2-28-17v-15m28 20q28 1 28-18v-13','#497b63',16)+L('M0 4v-65m0 38q-28 2-28-17v-15m28 20q28 1 28-18v-13','#81b393',10)+flower(0,-61,'#efb3ba')+'</g>';
const hay=(x,y)=>'<g transform="translate('+x+' '+y+')">'+R(-28,-12,56,26,'#e1b16f','#a77a45',6,2)+[[-20,-7,24,9],[0,-4,17,8],[10,9,22,1]].map(([a,b,c,d])=>L('M'+a+' '+b+'l'+c+' '+d,'#f6da91',2)).join('')+'</g>';
const barn=(x,y,sc=1)=>'<g transform="translate('+x+' '+y+') scale('+sc+')">'+P('M-36-6L0-34 36-6v50h-72z','#b95d56','#8c5047',4)+P('M-42-5L0-39 42-5','#7e4642','#7e4642',4)+R(-13,6,26,38,'#f5e5d0','#805749',2,3)+L('M-11 7l22 34M11 7l-22 34','#b87b60',3)+R(-25,4,8,10,'#f9e1a0','#825f4a',1,1)+R(17,4,8,10,'#f9e1a0','#825f4a',1,1)+'</g>';
const cowFace=(x,y,scale=1)=>'<g transform="translate('+x+' '+y+') scale('+scale+')">'+
 P('M-19-18q-13-10-18 0q-2 11 16 14M19-18q13-10 18 0q2 11-16 14','#fff7e8','#836c60',2)+
 E(0,0,25,26,'#fffbf0','#836c60',3)+patch(-12,-6,.65)+
 E(0,13,17,12,'#eab5b1','#bd8784',2)+C(-8,13,3,'#ab7371')+C(8,13,3,'#ab7371')+C(-9,-7,3,'#413b3a')+C(11,-7,3,'#413b3a')+
 P('M-23-22l7-9 8 9M13-22l8-9 5 10','#f3dabb','#8b7667',2)+'</g>';
const pigFace=(x,y,scale=1)=>'<g transform="translate('+x+' '+y+') scale('+scale+')">'+
 P('M-22-15L-24-31-6-22M22-15L24-31 6-22','#efb6bb','#b87e89',2)+E(0,0,27,23,'#f3c6cb','#bf8795',3)+
 E(0,10,16,11,'#e9a3ad','#bb818b',2)+C(-7,10,3,'#a46c77')+C(7,10,3,'#a46c77')+
 C(-10,-6,3,'#514248')+C(10,-6,3,'#514248')+'</g>';
const horseHead=(x,y,scale=1)=>'<g transform="translate('+x+' '+y+') scale('+scale+')">'+
 P('M-21 25Q-30-13-14-28L-20-47-5-38Q4-49 17-41L18-22Q27-8 13 25Z','#ba8a66','#825c46',3)+
 P('M-21-25q8-28 27-18q-3 15-20 26','#77513d','#77513d',2)+
 E(1,13,16,11,'#e8c1a2','#9d7359',2)+C(-9,-7,3,'#312e2b')+C(6,18,3,'#805b4c')+'</g>';
const hedgehog=(x,y,sc=1)=>'<g transform="translate('+x+' '+y+') scale('+sc+')">'+
 P('M-37 11L-31-6-39-21-21-16-17-34-6-23 7-38 15-22 30-29 31-11 42 7 27 25-24 24Z','#997b60','#725e4a',3)+
 E(8,7,23,19,'#e9d0b1','#b29472',2)+C(12,1,3,'#3f3a35')+C(27,12,4,'#664e49')+
 C(-18,24,4,'#725d4f')+C(17,25,4,'#725d4f')+'</g>';
const paw=(x,y,c='#9b7465')=>'<g transform="translate('+x+' '+y+')">'+E(0,7,11,8,c)+[-12,-4,5,13].map((a,i)=>C(a,i%2?-4:-2,4,c)).join('')+'</g>';
const bone=(x,y)=>'<g transform="translate('+x+' '+y+') rotate(-23)">'+R(-23,-6,46,12,'#f7e6b6','#c38f74',5,2)+[-23,23].map(xx=>C(xx,-8,7,'#f7e6b6','#c38f74')+C(xx,8,7,'#f7e6b6','#c38f74')).join('')+'</g>';
const outer=(name,content)=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 165" role="img" aria-label="'+name.replace(/[<>&"]/g,'')+' illustrated collectible">'+shadow+content+'</svg>';
const art={
 'exclusive-8-0':()=> // Western saddle-leather sofa: rolled arms, saddle blanket and hand-tooled trim
   P('M30 61Q29 32 57 32H187Q211 32 210 63V117H30Z','#88583e','#604531',5)+
   P('M41 57Q54 39 79 48H167Q187 43 198 60V103H41Z','#bf9366','#78513c',4)+
   P('M52 108Q122 91 190 108V132H52Z','#9f6a4b','#6a4937',4)+
   P('M19 86Q11 74 10 104L15 129H55V82Z','#a57453','#77523d',4)+
   P('M187 83H226V129H187Z','#a57453','#77523d',4)+
   P('M87 53l-9 15 9 14 11-14z','#e3c18c','#947450',2)+
   P('M144 53l-9 15 9 14 11-14z','#e3c18c','#947450',2)+
   horseShoe(119,79,.46)+
   L('M52 115h136M51 119h136','#d7a774',2)+
   [53,72,91,110,129,148,167,186].map(x=>C(x,125,1.5,'#f4d5a1')).join('')+
   L('M50 136v8m140-8v8','#78513a',8),
 'exclusive-8-1':()=> // Cowhide silhouette with Southwestern border and braided fringe
   P('M30 82Q28 58 52 60L72 68 91 47 123 59 154 45 173 66 198 61Q217 67 209 93L197 115 180 120 161 112 140 128 116 115 88 130 70 113 52 122Q32 117 30 82Z','#f2e6ce','#986f58',4)+
   patch(76,86,1.15)+patch(157,98,.86)+patch(125,77,.58)+
   L('M42 110L55 103 65 113 76 104 87 116','#b46f60',3)+
   L('M154 111l11-7 10 8 11-7 10 5','#b46f60',3)+
   [[49,119],[68,126],[90,132],[160,122],[178,126],[198,116]].map(([x,y])=>L('M'+x+' '+y+'v8','#c8a179',2)).join(''),
 'exclusive-8-2':()=> // Tall flowering saguaro in painted ceramic and sand
   P('M68 110H174L164 145H79Z','#d59b7b','#916950',4)+
   P('M76 113q45 15 90-1','#f7dbb3','#c89375',3)+
   cactus(116,116,1.3)+
   cactusflower(149,74)+
   [[88,139],[101,136],[138,136],[153,140]].map(([x,y])=>C(x,y,3,'#e4b06f')).join(''),
 'exclusive-8-3':()=> // Tooled leather frame with authentic horseshoe centerpiece and lariat
   P('M53 30H187L198 43V128H42V43Z','#9d6c4f','#6d4b3b',5)+
   R(59,43,122,73,'#eed4a4','#b58765',3,3)+
   horseShoe(120,85,1.05)+
   rope(81,78)+
   P('M53 30l15-9h104l15 9','#bb946d','#7a5540',3)+
   [67,173].map(x=>C(x,50,3,'#daba7c')).join('')+
   L('M45 131H197','#80533b',5),
 'exclusive-8-4':()=> // Old wooden feed trough visibly full of dog enrichment toys
   P('M40 81Q120 67 200 81L190 136H50Z','#b48b62','#775741',5)+
   P('M38 79h164v13H38Z','#dec092','#775741',3)+
   [65,98,131,165].map(x=>L('M'+x+' 96l-3 30','#8c684d',3)).join('')+
   rope(78,69)+bone(150,62)+C(117,62,16,'#d5866a','#905f55')+
   [107,125].map(x=>L('M'+x+' 50v24','#f7c78a',2)).join('')+
   R(58,104,124,4,'#d2aa78','#a77b59',2,1),
 'detail-8-0':()=> // Wildflower cactus cluster with colorful cowboy boot pot
   P('M73 87Q74 77 90 73H145Q161 76 166 87L162 141Q120 153 84 140Z','#b77454','#83533e',4)+
   P('M78 111q46 13 84-4v16q-41 16-80 0','#edb37d','#98694c',2)+
   cactus(103,94,.72)+cactus(139,95,.68)+
   cactusflower(99,51)+cactusflower(142,51)+
   flower(115,84,'#f3d498')+flower(163,78,'#f4c8a7')+
   horseShoe(121,124,.4),
 'detail-8-1':()=> // Cowhide covered barrel hideaway with arched door and saddle blanket
   P('M36 103Q37 53 120 46Q201 51 207 103L196 136H46Z','#edcf9d','#8c654a',5)+
   P('M56 83Q119 41 186 83v10Q119 59 56 96Z','#b56d59','#855241',3)+
   patch(71,109,.7)+patch(167,104,.55)+
   P('M85 138V111Q87 81 120 78Q153 81 155 111V138Z','#58493f','#58493f',3)+
   E(120,136,36,6,'#3f3832')+
   L('M59 114l-12 18m132-18 12 18','#926f55',4)+
   horseShoe(122,65,.35),
 'exclusive-9-0':()=> // Cow-shaped sofa with real upholstered black-white patches and pink snout pillows
   P('M30 76Q29 40 60 39H184Q215 40 213 77V119H28Z','#f6f2e7','#968a81',5)+
   P('M42 62Q53 48 75 54H170Q192 50 201 64V109H42Z','#fffdf8','#aea39b',3)+
   patch(82,79,1.05)+patch(171,68,.72)+patch(135,97,.51)+
   P('M43 107q78-18 157 0v23H43Z','#f0c1c5','#a38287',4)+
   P('M23 82Q11 78 14 105v25h34V82Z','#f8f3e6','#9c9186',3)+
   P('M192 82h32v48h-32Z','#f8f3e6','#9c9186',3)+
   E(119,96,29,12,'#eaaeb7','#be8691',2)+C(109,96,4,'#ac7480')+C(130,96,4,'#ac7480')+
   L('M55 135v9m135-9v9','#8d7968',8),
 'exclusive-9-1':()=> // Pink pig face-shaped floor rug, ears actually change outline
   P('M48 77L38 44 82 61Q120 49 158 61L201 44 191 78Q210 93 198 114Q121 150 40 115Q31 93 48 77Z','#efb6c0','#b87f8e',4)+
   E(120,103,46,25,'#f8ccd0','#d39ba6',2)+
   E(120,108,24,16,'#eda4ae','#c68a96',2)+C(111,108,6,'#b16f7c')+C(130,108,6,'#b16f7c')+
   E(84,89,6,8,'#765d63')+E(155,89,6,8,'#765d63')+
   E(65,104,12,5,'#e8a3af')+E(177,104,12,5,'#e8a3af'),
 'exclusive-9-2':()=> // Framed pasture scene with recognizable foal and stable
   R(30,24,180,112,'#c9a27a','#8b674b',4,5)+R(40,34,160,92,'#b7d5c1','#a77e60',3,2)+
   C(165,51,13,'#f9e6b3')+P('M41 97Q83 64 126 89T199 82V125H41Z','#8cae7e','#759e75',2)+
   barn(74,81,.48)+horseHead(147,98,.78)+
   L('M42 112h154M56 102v23m39-23v23m53-23v23m37-23v23','#f0ddbd',3)+
   flower(100,118,'#f0db9b')+flower(182,118,'#f2c0b2'),
 'exclusive-9-3':()=> // Hedgehog burrow, with real quill roof and plush interior
   P('M30 116Q32 61 72 57L66 39 91 49 102 26 119 44 141 28 152 49 174 36 177 56Q213 70 210 116L195 140H44Z','#a38c73','#776854',4)+
   [49,65,82,98,116,134,151,167,184].map((x,i)=>P('M'+x+' 78l'+(i%2?9:-8)+'-27 15 25Z','#88735e','#76624f',2)).join('')+
   P('M79 138V108Q84 78 119 78Q159 82 161 108V138Z','#615547','#665544',2)+
   E(120,134,44,7,'#493d37')+
   hedgehog(119,119,.55)+
   flower(56,135,'#f2d2b6')+flower(182,135,'#f1dfb0'),
 'exclusive-9-4':()=> // Barn-red toy chest with pink pig snout, filled with plush toys
   P('M42 80Q120 66 198 80L190 140H52Z','#ba665c','#8b4f48',4)+
   P('M38 80H201V91H38Z','#dc8b76','#95544c',3)+
   P('M60 93l59 35 60-35','#e4ac8b','#a86d5c',2)+
   pigFace(119,113,.47)+
   bone(76,66)+C(157,66,13,'#e5bd71','#ae8759')+
   rope(121,64)+
   L('M57 138v6m123-6v6','#815144',5),
 'detail-9-0':()=> // Milk-pail planter: galvanized vessel, sunflowers, clover and leaf stems
   P('M72 91H170L160 142H83Z','#c6d5d1','#728f90',4)+
   P('M76 91q43-12 91 0','#f1eee1','#7a9c9c',3)+
   L('M84 92Q83 46 119 47Q153 46 159 92','#718f8b',5)+
   L('M122 95V30M105 89L88 52M139 90L163 57','#6c9673',6)+
   flower(121,31,'#f7ce69')+flower(86,50,'#f8d57d')+flower(164,55,'#edc16d')+
   flower(144,77,'#f0efe5')+flower(102,76,'#fff1df')+
   E(122,120,12,7,'#eef2e6')+C(118,119,3,'#8aa5a5')+C(127,120,3,'#8aa5a5'),
 'detail-9-1':()=> // Barn-red multi-tier cat climbing loft with roof, cubby, ramps and hay details
   P('M38 68L120 19 203 68V133H37Z','#bd6962','#8c524a',4)+
   P('M30 68L120 13 211 68','#824b45','#824b45',8)+
   R(49,76,142,16,'#e6b786','#80594a',3)+
   R(63,112,128,17,'#e4b688','#8c6049',3)+
   R(104,84,36,38,'#6d5149','#805a4e',15)+
   L('M72 128V92m103 36V92','#81594b',7)+
   P('M45 140L102 95','#d9b084','#8b6754',5)+
   [58,71,84].map((x,i)=>L('M'+x+' '+(136-i*13)+'l8 8','#9c7157',2)).join('')+
   hay(175,137)+
   C(122,103,4,'#f9d19f')+C(134,103,4,'#f9d19f')+
   P('M104 90l6-11 8 10M126 89l10-10 7 12','#b58d78','#6f5146',2)
};
window.VPQ_FINISHED_RANCH_BARNYARD_ART={art:item=>{const fn=art[item?.id];return fn?outer(item.label,fn()):null},ids:Object.keys(art)};
})();