/* Programmatic Concept-2/Concept-1 hybrid Clinical Pathology teaching lab.
 All graphics are SVG, with no external image dependencies. */
window.VPQ_CLINPATH_HYBRID_SCENE=(function(){
'use strict';
const R=(x,y,w,h,fill,stroke='#b1b7d6',rx=10)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
const T=(x,y,t,size=14,color='#594773',anchor='middle')=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" font-family="Arial,sans-serif" font-weight="800" font-size="'+size+'" fill="'+color+'">'+t+'</text>';
const P=(d,stroke='#7087a9',sw=4)=>'<path d="'+d+'" stroke="'+stroke+'" stroke-width="'+sw+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
function tubes(x,y,n,cap='#6aa4da',scale=1){let s='';for(let i=0;i<n;i++){let xx=x+i*16*scale;s+='<g transform="translate('+xx+' '+y+') scale('+scale+')">'+R(0,0,12,45,'#f4faff','#9daccd',3)+R(0,0,12,8,cap,'#7c99c1',2)+R(2,28,8,13,'#d8a2bd','none',2)+'</g>'}return s+R(x-4,y+36*scale,n*16*scale+1,8,'#b6c4db','#9aabcb',3)}
function scope(x,y,z=1){
 // Original, distinct compound light-microscope silhouette: inclined ocular,
 // revolving objectives, broad stage, focus dials, curved arm and weighted base.
 return '<g transform="translate('+x+' '+y+') scale('+z+')">'+
 R(3,84,89,12,'#8895b6','#626f94',9)+
 R(15,78,64,10,'#f0eef9','#8095b2',6)+
 P('M22 78C3 58 13 31 40 26','#7f91b4',13)+
 P('M24 73C15 59 24 42 35 38','#dce8f6',5)+
 // Inclined optical tube and dark eyepiece
 '<g transform="rotate(-24 60 23)">'+R(51,2,20,46,'#eceef8','#6e81a9',5)+R(48,-7,26,14,'#38476b','#34425e',4)+R(54,34,14,13,'#a9bed6','#738ba9',2)+'</g>'+
 // revolving nosepiece and objective lenses
 R(44,43,29,9,'#768db0','#576e9a',4)+
 P('M53 52L48 66','#405477',6)+P('M65 52L65 64','#405477',5)+
 R(44,62,10,5,'#e9c1dc','#9b8caf',2)+R(61,61,9,5,'#c1dce6','#789eae',2)+
 // Clear stage and slide (separate from objective)
 R(25,67,69,8,'#394d76','#3c4c6c',3)+R(43,65,34,3,'#e9f8fc','#9cbcd0',1)+
 P('M34 67L34 74M83 67L83 74','#94aace',2)+
 // Condenser, illumination and visible focus knobs
 R(52,75,16,7,'#b8c4db','#778db4',3)+
 '<circle cx="25" cy="48" r="9" fill="#d5deec" stroke="#758cae" stroke-width="3"/>'+
 '<circle cx="25" cy="48" r="4" fill="#8b9bc0"/>'+
 '<circle cx="33" cy="60" r="5" fill="#dfe8f5" stroke="#7f96b8" stroke-width="2"/>'+
 R(33,79,37,5,'#d6e7f1','#839bb4',2)+'</g>';
}
function analyzer(x,y,w,h,lines){let s=R(x,y,w,h,'#fffdfd','#98a7c2',12)+R(x+9,y+10,w-18,Math.round(h*.56),'#3e5f83','#90aec6',5);
 lines.forEach((v,i)=>s+=T(x+w/2,y+29+i*16,v,Math.min(13,w/7),'#e4f8fa'));return s+R(x+14,y+h-18,28,7,'#b8dfdb','#9bb8d1',4)+R(x+w-27,y+h-21,11,9,'#e6b5d3','#c79ab9',4)}
function frame(x,title,sub,fill,stroke){
 return R(x,153,174,204,fill,stroke,22)+R(x+8,160,158,48,'#fffefe',stroke,13)+T(x+87,180,title,16,'#594a7b')+T(x+87,198,sub,12,'#7b709a')+
 R(x+7,340,160,14,'#dfd5eb','#ac9bc6',6)+R(x+13,355,14,38,'#bcc9dd','#93a6c2',5)+R(x+147,355,14,38,'#bcc9dd','#93a6c2',5);
}
function vines(){
 // Border-only SVG vines: keep the title, benches, walkable floor and dock clear.
 let s='<g opacity=".95" aria-hidden="true">'+
 P('M0 26Q33 17 65 28Q96 14 129 24','#78b89d',5)+
 P('M1000 24Q965 17 935 30Q902 16 871 25','#78b89d',5)+
 P('M13 29Q30 55 17 80Q31 103 13 127','#7eae9b',4)+
 P('M987 29Q971 56 986 82Q970 104 984 128','#7eae9b',4);
 const leaf=(x,y,a,color)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="6" ry="12" transform="rotate('+a+' '+x+' '+y+')" fill="'+color+'" stroke="#79b19b" stroke-width="1"/>';
 [[29,23,-45],[49,28,52],[73,21,-46],[92,24,50],[115,20,-47],[971,22,46],[947,26,-53],[926,21,45],[900,25,-50],[882,19,48],[17,53,-43],[26,75,52],[16,101,-45],[981,53,43],[976,79,-52],[984,105,43]].forEach((v,i)=>s+=leaf(v[0],v[1],v[2],i%3===0?'#8ac7aa':i%3===1?'#b0dabb':'#9ccead'));
 return s+'</g>';
}
function props(){
 let s='';
 // Credible, distinct instrument silhouettes, not branded copies
 s+=analyzer(38,238,89,88,['PT 12.4 s','aPTT 29 s'])+tubes(142,263,3,'#61a8e7',.86)+R(140,316,43,22,'#fffcfa','#c9b6c3',3)+T(161,330,'PT/aPTT',9);
 s+=analyzer(235,237,110,97,['pH 7.32','pCO₂ 52','HCO₃ 26'])+R(356,255,18,60,'#f6f9fd','#92b9d5',5)+P('M346 330L389 330','#8eabd3',7);
 // Urinalysis: visually distinct analyzer, capped urine cup, DIP bottle and
 // multicolor test strip, compact centrifuge and SG handheld refractometer.
 s+=analyzer(429,237,70,93,['UA','SCAN'])+
 R(504,285,28,43,'#fff6bd','#c4a88d',7)+R(502,281,32,10,'#f1d18d','#bd9f7e',4)+
 '<path d="M508 300H528V323H508Z" fill="#f1cc69" opacity=".76"/>'+
 // Dipstick bottle labeled DIP
 R(536,257,22,64,'#fff8df','#b2a6be',5)+
 R(535,251,24,10,'#9ab6d4','#8096bb',3)+
 T(547,278,'DIP',10,'#87739d')+
 R(539,284,16,24,'#fff','#ddcfc6',1)+
 // Multicolored reagent pads on a separate dipstick
 '<g transform="rotate(-19 552 303)">'+R(550,283,5,45,'#fffdf4','#9fa9b6',1)+
 R(550,291,5,6,'#be8c9c','#a890a1',1)+R(550,299,5,6,'#9abeae','#91b7a2',1)+
 R(550,307,5,6,'#dbb47d','#c9a274',1)+R(550,315,5,5,'#b2a4d4','#a5a0ca',1)+'</g>'+
 // Small recognizable centrifuge with lid
 R(565,278,24,49,'#e8e6f4','#a4a2c3',9)+
 '<ellipse cx="577" cy="280" rx="12" ry="6" fill="#c9c8e1" stroke="#968fb7" stroke-width="2"/>'+
 '<ellipse cx="577" cy="288" rx="8" ry="6" fill="#8c99bd"/>'+
 '<circle cx="577" cy="288" r="3" fill="#f8e8d8"/>'+
 // Handheld SG refractometer: eyepiece, grip, optical prism
 '<g transform="rotate(16 520 327)">'+
 R(496,324,49,11,'#6694b9','#4f739b',6)+R(497,325,14,9,'#43587b','#3d4b73',4)+
 R(529,324,13,11,'#badbeb','#779ab9',3)+R(542,326,16,7,'#e4f3f4','#809bb6',2)+'</g>'+
 T(520,344,'SG',9,'#756c96');
 s+=R(630,237,114,76,'#e3ebf9','#839bc0',8)+R(639,245,96,55,'#f7fbff','#b6c8e2',5)+
 T(684,262,'PATIENT',12,'#6581ae')+P('M648 281L667 272L677 284L693 269L725 275','#a4b3ce',3)+
 R(680,313,22,9,'#98b5d4','#809ab8',3)+R(653,320,74,8,'#cddbea','#a9bad1',3)+
 R(747,254,25,66,'#fff0d1','#ceafd2',5)+T(760,272,'CASE',9,'#9b81ad');
 s+=scope(816,247,.88)+scope(910,260,.76)+R(868,323,41,20,'#eadff2','#b59fce',4)+T(888,337,'SLIDES',9)+tubes(950,295,2,'#b294d4',.67);
 return s;
}
function decor(){
 let s='';
 // Actual coded bookshelf with books and LEARN title, plus hanging plants
 s+=R(26,82,195,69,'#e7d6e9','#ad94c7',10)+R(38,103,171,37,'#fffafa','#bda8d4',6);
 for(let i=0;i<12;i++)s+=R(44+i*13,107,10,29,['#dab4d8','#95bbdb','#ecc6d3','#dccb97'][i%4],'#fff',2);
 s+=R(54,72,142,34,'#fff0bb','#aa88b2',13)+T(125,86,'📖 LEARN FIRST',14,'#67477f')+
 T(125,99,'START HERE · STUDY',8.5,'#85669a');
 // Clean background supply cupboard: no floating paw motifs or tiny props.
 s+=R(799,87,148,57,'#f6f2fb','#b9abc9',8)+
 R(807,94,132,17,'#e2d5eb','#b9accd',4)+
 T(873,106,'SUPPLIES',11,'#706087')+
 R(813,116,28,19,'#b9cce1','#8fa6c5',3)+
 R(848,115,28,20,'#f1d6e2','#b9a4c6',3)+
 R(883,112,15,25,'#d3c5e5','#ae9fc5',2)+
 R(902,119,26,16,'#e8e9f7','#a8accb',3);
 s+=vines();
 // Center-back classroom sign, independent of clickable bench locations
 s+=R(363,95,271,44,'#fffafd','#c7b2d9',12)+T(498,114,'REFERRAL DIAGNOSTICS',16,'#796194')+
 T(498,131,'LEARN THE WHY · THEN PRACTICE THE CASE',11,'#70628c');
 // Keep the space beneath benches visually clear for walking and navigation.
 return s;
}
function draw(){
 let s='<svg class="vpqSpecArt vpqHybridLabSvg" viewBox="0 0 1000 500" preserveAspectRatio="none" role="img" aria-label="Cozy veterinary referral lab with coagulation, blood gas, urinalysis, patient cases, microscopy, reference books and clinical equipment">'+
 '<defs><linearGradient id="vpqHybridWall" x2="0" y2="1"><stop stop-color="#fbf6ff"/><stop offset="1" stop-color="#eaf6fc"/></linearGradient><linearGradient id="vpqHybridFloor" x2="0" y2="1"><stop stop-color="#e6ddeb"/><stop offset="1" stop-color="#c9c1e0"/></linearGradient><filter id="vpqHybridShadow"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#776a95" flood-opacity=".18"/></filter></defs>'+
 R(0,0,1000,500,'url(#vpqHybridWall)','none',0)+
 '<path d="M0 353H1000V500H0Z" fill="url(#vpqHybridFloor)"/>'+
 P('M0 353H1000M0 446H1000M140 353L87 500M325 353L303 500M500 353V500M675 353L700 500M860 353L915 500','#fff8ff',2)+
 '<g filter="url(#vpqHybridShadow)">'+R(168,12,664,63,'#fffafd','#b493d0',28)+T(500,52,'ADVANCED CLINICAL PATHOLOGY',29,'#684b8b')+'</g>'+
 decor()+'<g filter="url(#vpqHybridShadow)">'+
 frame(22,'Coagulation','PT/aPTT questions','#fce9f5','#c99ec4')+
 frame(219,'Blood Gas','Acid–base practice','#eaf7fb','#99c6de')+
 frame(416,'Urinalysis','UA + sediment cases','#fff4e7','#e1ba99')+
 frame(613,'Referral Cases','Diagnostic workups','#f1edfc','#bca6dc')+
 frame(810,'Microscopy','Smear image ID','#e9f8f3','#9bcdbb')+
 props()+'</g>'+
 '<ellipse cx="500" cy="411" rx="151" ry="13" fill="#e4cae4" opacity=".7"/>'+
 R(78,412,844,83,'#fffaff','#b6a2d5',19)+
 P('M706 427V488','#cbb8dd',2)+
 '</svg>';
 return s;
}
return draw;
})();
