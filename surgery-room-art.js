/* Vet Pharm Quest — approved OR mockup inspired, original scalable surgery-room artwork.
 * Background only. Existing interactive stations / avatar / staff / save remain authoritative.
 */
(function(){
'use strict';
window.VPQ_SURGERY_ROOM_ART=function(){
 const f=(n)=>Number(n).toFixed(1);
 const rect=(x,y,w,h,fill,stroke='',r=0,sw=2)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+fill+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+sw+'"':'')+'/>';
 const path=(d,stroke,sw=2,fill='none')=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round"/>';
 const txt=(x,y,t,size=13,color='#3b5b76',weight=800)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" fill="'+color+'" font-weight="'+weight+'" font-family="Arial,sans-serif" text-anchor="middle">'+t+'</text>';
 const label=(x,y,w,caption)=>rect(x,y,w,22,'#fffaf1','#deb995',11,2)+txt(x+w/2,y+15,caption,10,'#694c71',900);
 const cabinet=(x,y,w,h,glass=false)=>rect(x,y,w,h,glass?'url(#sCabGlass)':'#faf3ef','#b8b5c9',5,2)+path('M'+(x+w/2)+' '+(y+4)+'v'+(h-8),'#d8d1d4',2)+rect(x+w/2-12,y+h/2-7,3,15,'#9c9ba8','',2)+rect(x+w/2+9,y+h/2-7,3,15,'#9c9ba8','',2);
 let s='<svg class="vpqSpecArt" viewBox="0 0 1000 500" preserveAspectRatio="none" role="img" aria-label="Vet Pharm Quest veterinary operating theatre; clean prep area left, operating table center, anesthesia machine, and separate recovery ward behind a glass door on the right"><defs>'+
 '<linearGradient id="sWall" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d5eaf1"/><stop offset="1" stop-color="#c4e2e1"/></linearGradient>'+
 '<linearGradient id="sFloor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eaf5fa"/><stop offset="1" stop-color="#bfd5e6"/></linearGradient>'+
 '<linearGradient id="sSteel" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#faffff"/><stop offset=".48" stop-color="#9ab6c2"/><stop offset="1" stop-color="#e5f4f7"/></linearGradient>'+
 '<linearGradient id="sCabGlass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#9fc5d6"/><stop offset=".5" stop-color="#f5f7fa"/><stop offset="1" stop-color="#b1d3e1"/></linearGradient>'+
 '<linearGradient id="sGlass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e8fbff" stop-opacity=".65"/><stop offset="1" stop-color="#aac7e2" stop-opacity=".20"/></linearGradient>'+
 '<radialGradient id="sLight"><stop stop-color="#fffbea"/><stop offset=".6" stop-color="#ffefb9"/><stop offset="1" stop-color="#b9a7a8"/></radialGradient>'+
 '<filter id="sSh"><feDropShadow dx="1" dy="4" stdDeviation="4" flood-color="#46637c" flood-opacity=".25"/></filter>'+
 '</defs>';
 // Perspective theatre architecture.
 s+=rect(0,0,1000,500,'#f7fcff')+rect(0,32,1000,307,'url(#sWall)');
 s+='<polygon points="0,0 1000,0 944,60 63,60" fill="#f9fbfc"/><polygon points="0,0 63,60 63,344 0,408" fill="#a9c8d2"/><polygon points="1000,0 944,60 944,344 1000,408" fill="#a9c2d1"/>';
 s+=path('M63 60H944M63 337H944','#ecfbff',5)+path('M0 408L63 344H944L1000 408V500H0Z','#c7dce9',0,'url(#sFloor)');
 s+='<path d="M63 344L0 500M944 344L1000 500M286 344L250 500M540 344V500M771 344L801 500M0 412H1000" stroke="#fff" stroke-width="3" opacity=".65" fill="none"/>';
 // Ceiling tile geometry.
 for(let x=70;x<=930;x+=140)s+=path('M'+x+' 2L'+(x+13)+' 59','#cbd8df',1);
 for(let x of [148,372,617,846])s+='<ellipse cx="'+x+'" cy="29" rx="28" ry="9" fill="#fffbe6" stroke="#fff" stroke-width="4"/>';
 s+=rect(64,61,877,9,'#f4fdff');
 // Clean-prep left panel, deep cabinet bank and packs.
 s+=rect(68,88,317,252,'#cce1e7')+rect(68,95,312,7,'#f6fcfb');
 for(let i=0;i<3;i++)s+=cabinet(80+i*90,112,84,62,i===1);
 for(let i=0;i<4;i++)s+=rect(179+i*20,122,13,25,['#c9c3f0','#b8dcef','#90cbd8','#cfb9d7'][i],'#e5eeed',2,1);
 s+=rect(74,198,273,12,'url(#sSteel)','#8eafc4',3)+rect(78,210,260,125,'#e1e9f0','#adc1ce',4);
 for(let x of [83,163,245])s+=cabinet(x,218,74,104);
 // Two scrub sink bowls.
 s+=rect(84,207,157,33,'#9cb6c5','#f6fdff',5)+rect(91,213,70,21,'#7699b2','#c7e4ed',9)+rect(165,213,69,21,'#7699b2','#c7e4ed',9);
 for(let x of [127,194])s+=path('M'+x+' 209v-19q0 -6 7 -6h10v16','#7197ae',5);
 // Pack storage and glass cupboard.
 s+=rect(256,123,112,70,'#d3e4eb','#a9bece',4);
 for(let row=0;row<3;row++)for(let col=0;col<5;col++)s+=rect(264+col*19,130+row*19,16,12,['#b5d8eb','#b6cbdc','#d7caec'][row],'#fff',2,1);
 // Wrapped sterile packs on prep trolley.
 s+=rect(247,282,132,11,'url(#sSteel)','#87a8b8',4)+path('M258 293v36M365 293v36','#8cabb9',5)+rect(259,326,108,6,'#9bb9c8');
 for(let row=0;row<2;row++)for(let col=0;col<3;col++)s+=rect(267+col*32,260+row*18,29,15,'#a8d7e9','#eafcff',3,1.5)+path('M'+(282+col*32)+' '+(261+row*18)+'v12','#f5feff',1.5);
 s+=label(104,77,199,'CLEAN PREP &amp; SUPPLIES');
 // Physical partition / doorway.
 s+=rect(382,57,13,308,'url(#sSteel)','#7996ad',3,3)+rect(395,90,22,239,'url(#sGlass)','#b0c9d8',1,2)+path('M395 92L416 120M397 182L416 202','#f8ffff',4);
 s+=rect(381,343,40,8,'#9bb9c6')+label(269,341,103,'PACK STORAGE');
 // Header over OR area kept high, not over devices.
 s+=rect(448,74,380,42,'#f8fbff','#8bb5c8',18,3)+txt(638,102,'SURGERY &amp; ANESTHESIA',21,'#426b91',900);
 // Storage behind equipment.
 s+=rect(425,149,105,65,'#d4e8f0','#91aebf',4);
 for(let j=0;j<2;j++)for(let i=0;i<4;i++)s+=rect(435+i*23,158+j*24,18,18,['#c8bde6','#b7d6e2','#c4d6cf','#d3c1df'][i],'#f3fbff',2,1);
 // Anesthesia machine central-left with cylinders and breathing bag.
 s+='<g filter="url(#sSh)">'+rect(429,225,109,103,'#ecf4f7','#8caab7',9,4)+rect(441,175,91,51,'#e3f0f5','#7d9fb0',6,3)+rect(450,183,64,32,'#304e66','#9bb8c4',4,2)+path('M457 201h10l5 -10 6 16 5 -7h12l6 -7 7 10','#9cdebc',2.5)+rect(450,242,75,13,'#f8fcfe','#a0bbcb',4);
 for(let x of [458,483,508])s+=rect(x,265,16,33,x===483?'#e4c4e7':'#b7d9e2','#8daebd',4);
 s+=path('M437 328v16M528 328v16','#7c9aa9',6)+'<circle cx="440" cy="348" r="6" fill="#6c8ea1"/><circle cx="525" cy="348" r="6" fill="#6c8ea1"/>';
 s+=path('M510 225q65 -25 64 40','#a5c8cf',5)+ '<ellipse cx="571" cy="273" rx="13" ry="31" fill="#69bbaa" stroke="#3d9994" stroke-width="3"/>';
 s+='</g>'+label(427,130,114,'ANESTHESIA MACHINE');
 // Separate large patient monitor raised on pole.
 s+='<g filter="url(#sSh)">'+rect(561,180,112,76,'#deeef4','#8ba9bd',8,5)+rect(572,190,90,54,'#263f59','#466b80',4)+path('M579 224h13l5 -11 5 21 7 -16 8 7h8l7 -12 7 17 6 -9h11','#64dcb3',3)+txt(648,207,'98',13,'#c7edb1',900)+txt(646,238,'96',12,'#c4e6f4',900)+path('M619 256v17','#8aa8b8',5)+rect(597,273,44,12,'url(#sSteel)','#a7bdc4',3)+'</g>';
 s+=label(564,154,103,'PATIENT MONITOR');
 // Multi-lamp articulating LED heads above the surgical field.
 s+=path('M705 0v88l-62 42M705 61l69 62','#91a6b7',9);
 for(let [x,y] of [[633,145],[778,138]]){
 s+='<ellipse cx="'+x+'" cy="'+y+'" rx="36" ry="27" fill="url(#sSteel)" stroke="#8aa4b3" stroke-width="5"/><ellipse cx="'+x+'" cy="'+y+'" rx="27" ry="20" fill="url(#sLight)" stroke="#f8fcff" stroke-width="3"/>';
 for(let k=0;k<7;k++){let a=k*Math.PI*2/7;s+='<circle cx="'+f(x+17*Math.cos(a))+'" cy="'+f(y+12*Math.sin(a))+'" r="4" fill="#fff8dd" stroke="#fff" stroke-width="1"/>'}
 s+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#fff9d7"/>';
 }
 // Stainless operating table: dominant central element, no cartoon patient permanently baked in.
 s+='<g filter="url(#sSh)">'+rect(575,286,206,25,'url(#sSteel)','#769eb1',8,4)+path('M593 307h173','#f8ffff',3)+rect(664,312,39,47,'url(#sSteel)','#779bad',4,3)+rect(622,356,122,14,'url(#sSteel)','#7b9fae',5,3)+'</g>';
 // Instrument/ Mayo stand and instrument line.
 s+='<g filter="url(#sSh)">'+rect(544,305,69,10,'#8eaeae','#e3f3f0',4)+rect(548,311,61,8,'#6bc3bd')+path('M554 319v39M601 319v39','#7b9fab',5)+rect(543,358,70,10,'url(#sSteel)','#94b2ba',3);
 for(let x of [551,564,577,590])s+=path('M'+x+' 311l7 -10','#658b97',2);
 s+='</g>'+label(634,371,111,'OPERATING TABLE');
 // OR equipment drawer cart and supplies.
 s+=rect(791,242,69,111,'url(#sSteel)','#86a8b6',8,3);
 for(let i=0;i<3;i++){s+=rect(798,263+i*27,55,22,'#e3f2f5','#9bbac7',3)+path('M818 '+(275+i*27)+'h16','#8eb2bc',2);}
 s+=rect(789,230,76,11,'#a9c3ca','#fff',3)+rect(808,217,11,13,'#d9f8f8','#8cb8c6',2);
 // Warming device with modest warm glow but no patient in OR recovery bed.
 s+=rect(784,151,98,34,'#d3e6f1','#a6b5cf',6,3)+rect(799,160,36,14,'#395a72','#b3c8d5',3)+path('M847 188l-15 45','#e7b278',3);
 s+='<path d="M820 190l-32 91h66z" fill="#ffe4a8" opacity=".20"/>'+label(786,118,96,'WARMING');
 // Glass recovery door in separate back/right alcove.
 s+=rect(872,88,108,263,'#c1afd8','#8d82b6',10,7)+rect(882,102,89,229,'#d8f0f6','#a8b8d3',5,3);
 s+=rect(888,209,76,114,'url(#sGlass)','#a8b6d1',4,2);
 s+=rect(895,266,64,31,'#acc8dc','#7ba3b7',4)+path('M900 272h53M900 285h53','#e6f9fa',3);
 s+=rect(887,160,74,60,'#e6e9f3','#b4b4ce',3);
 for(let x of [904,921,938,955])s+=path('M'+x+' 166v48','#a9afc6',2);
 s+=path('M920 104v224','#a7a4c2',4)+ '<circle cx="952" cy="244" r="4" fill="#917a9e"/>';
 s+=label(866,65,119,'RECOVERY WARD');

 // Clearly identifiable wall-mounted airway supplies outside operating zone.
 s+=rect(72,110,86,90,'#f7fcff','#8eafc2',7,3);
 s+=txt(115,124,'ET TUBES',10,'#4c728e',900)+path('M82 135h66','#a1b8c7',3);
 for(let i=0;i<5;i++){let x=85+i*13;s+=path('M'+x+' 142v32q0 9 8 9','#accbd6',3)+rect(x-3,134,7,10,'#e0f7fc','#86b7c2',2,1);}
 s+=rect(96,186,40,7,'#c4e5e9','#89bcc5',3)+txt(116,199,'AIRWAY',8,'#6583a3');
 // Sterilizer/autoclave recessed in clean storage, visually distinct from prep sink.
 s+=rect(250,194,86,74,'url(#sSteel)','#89aabd',7,4);
 s+=rect(259,203,68,47,'#e3eff4','#7c9fb3',5,2);
 s+='<circle cx="291" cy="226" r="18" fill="#799eae" stroke="#d6f6f8" stroke-width="4"/><circle cx="291" cy="226" r="12" fill="#cbe6ee" stroke="#86b0bc" stroke-width="2"/>';
 s+=rect(261,255,12,6,'#72c0b3','',2)+txt(293,275,'AUTOCLAVE',11,'#557993',900);
 // PPE shelving: separated from surgical field by partial glass wall.
 s+=rect(191,110,153,85,'#f7fbff','#9ebfcb',6,3)+path('M197 139h141M197 171h141','#a9cbd6',3);
 for(let i=0;i<4;i++){
   let x=200+i*34;
   s+=rect(x,118,28,15,['#d5c5ef','#c0e5f2','#cde7e2','#e6d8ed'][i],'#fff',3,1);
   s+=rect(x,148,28,17,['#dceaf7','#a9d5e8','#cbd9f5','#d2ebe2'][i],'#e8fdff',2,1);
 }
 s+=txt(266,186,'GOWNS · DRAPES · CAPS · MASKS',9,'#64849d',800);
 // Tool ID display on supply wall, with recognizable forceps, scissors, needle holder.
 s+=rect(333,108,45,97,'#fcfcff','#a7bdcd',4,3);
 s+=txt(355,120,'TOOLS',9,'#587e9c',900);
 s+=path('M345 136l20 18M364 136l-19 18M344 147l22 0','#7e9fac',2.5);
 s+='<circle cx="348" cy="164" r="4" fill="none" stroke="#759ca8" stroke-width="2"/><circle cx="361" cy="164" r="4" fill="none" stroke="#759ca8" stroke-width="2"/>';
 s+=path('M349 164l15 19M361 164l-12 19','#829faf',2);
 s+=txt(355,195,'ID',9,'#587e9c');
 // Electrosurgical generator with foot pedal and holstered handpiece (training representation).
 s+=rect(746,215,72,45,'#e9f0f9','#8eabc2',8,3)+rect(757,224,38,21,'#304f69','#8fb8c9',4,2);
 s+=txt(776,240,'ESU',11,'#c6f7f2',900);
 s+=rect(800,226,7,15,'#ebcda5','#9fa6b2',2,1);
 s+=path('M806 246q20 24 6 42','#778baf',3)+rect(807,285,25,8,'#8ca6b7','#d7e7eb',3,1);
 s+=txt(783,271,'ELECTROSURGERY',8,'#69839b',900);
 // Recovery room cutaway: depth, a kennel bank and cozy recovery bed beyond glass.
 s+=rect(883,113,84,204,'#bddce9','#a3c0d7',4,2);
 s+=rect(889,169,71,74,'#e9f0f7','#93adbd',4,2);
 s+=rect(892,177,66,59,'#d3e5ef','#aabcca',3,2);
 for(let j=0;j<5;j++)s+=path('M'+(899+j*12)+' 178v57','#9aaebf',2);
 s+=rect(893,242,61,12,'#dcb9db','#a9a8ce',5,1);
 s+=rect(892,260,67,37,'#91bbc9','#7199ae',6,2)+rect(899,267,53,22,'#e7d8ec','#c5a9d8',5);
 s+='<ellipse cx="926" cy="283" rx="17" ry="5" fill="#e0bcdc"/>';
 s+=rect(883,113,84,204,'url(#sGlass)','#aba4cb',4,1);
 s+=path('M880 113v204M967 113v204M922 112v205','#9b91bd',4);
 s+=rect(874,101,100,12,'#e6ddf2','#a99ccc',5,2);
 s+=txt(923,110,'SEPARATE WARD',9,'#7966a1',900);

 // A few floor reflections indicate depth, leaving foreground walkable for avatars.
 s+='<path d="M71 377H376M429 382H952" stroke="#ffffff" stroke-width="3" opacity=".65"/>';
 s+='<path d="M375 353L339 500M863 353L904 500" stroke="#effcff" stroke-width="2" opacity=".65"/>';
 s+='</svg>';return s;
};
})();