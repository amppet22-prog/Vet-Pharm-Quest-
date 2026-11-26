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
 // Supply and scrub side: clear wall bands and explicit non-overlapping equipment zones.
 s+=rect(101,88,284,252,'#d5e9ed')+rect(101,95,281,7,'#f6fcfb')+label(179,77,180,'CLEAN PREP &amp; SUPPLIES');
 // Side-wall inset ET rack: foreshortened by wall perspective and mounted away from floor equipment.
 s+='<polygon points="0,46 99,91 99,351 0,407" fill="#aecbd5" stroke="#91b1c1" stroke-width="3"/>';
 s+='<polygon points="23,118 91,139 91,273 23,295" fill="#f4faff" stroke="#8fb2c5" stroke-width="3"/>';
 s+=txt(58,155,'ET TUBES',9,'#517795',900);
 for(let i=0;i<4;i++){let x=34+i*13;s+=rect(x,172,7,8,'#e8faff','#9cbfca',1,1)+path('M'+(x+3)+' 180v47q0 7 5 7','#85b5c1',2);}
 s+=path('M30 165L85 174M27 256L88 238','#9cbfcd',2);
 // Clean supply shelf, gowns, masks, caps and wrapped drapes.
 s+=rect(181,110,188,80,'#f7fbfe','#a7c1cc',5,2)+path('M188 148h173','#9db9c7',3);
 for(let i=0;i<5;i++){let x=192+i*33;s+=rect(x,117,28,22,['#c5daed','#d8c7ed','#c0dfda','#b8d6e8','#ded3ee'][i],'#f5ffff',2,1)+rect(x,155,28,23,['#e1d6ee','#c5e5e8','#d0dff3','#c9e4e0','#e5d2ec'][i],'#f5ffff',2,1);}
 // Wash station: separate from autoclave without overlapping objects.
 s+=rect(83,211,165,14,'url(#sSteel)','#91afbe',4)+rect(84,226,163,99,'#eef4f7','#aec1cb',5);
 s+=cabinet(90,255,72,66)+cabinet(164,255,74,66);
 s+=rect(93,220,143,28,'#a9c4ce','#f3fdff',7)+rect(99,223,61,20,'#83a9b9','#d9edf2',9)+rect(164,223,64,20,'#83a9b9','#d9edf2',9);
 for(let x of [123,190])s+=path('M'+x+' 219v-18q0 -5 6 -5h8v14','#789aab',4);
 // Dedicated vertical autoclave footprint, no supply trolley drawn underneath.
 s+=rect(261,210,109,116,'url(#sSteel)','#8aa9bb',7,4)+rect(270,220,91,78,'#e8f4f8','#8ea8b8',6,2);
 s+='<circle cx="315" cy="257" r="30" fill="#86a8b7" stroke="#edfaff" stroke-width="5"/><circle cx="315" cy="257" r="22" fill="#d5e9f0" stroke="#90b2bd" stroke-width="3"/>';
 s+=rect(272,305,12,7,'#79c7ac','',2)+txt(315,340,'AUTOCLAVE',10,'#577f99',900);
 // Physical partition / doorway.
 s+=rect(382,57,13,308,'url(#sSteel)','#7996ad',3,3)+rect(395,90,22,239,'url(#sGlass)','#b0c9d8',1,2)+path('M395 92L416 120M397 182L416 202','#f8ffff',4);
 s+=rect(381,343,40,8,'#9bb9c6')+label(269,341,103,'PACK STORAGE');
 // Header over OR area kept high, not over devices.
 s+=rect(446,74,358,42,'#f8fbff','#8bb5c8',18,3)+txt(624,102,'SURGERY &amp; ANESTHESIA',19,'#426b91',900);
 // Storage behind anesthesia machine is deliberately minimal.
 s+=rect(430,145,105,60,'#d9ecf3','#9eb8c6',5,2);
 for(let i=0;i<4;i++)s+=rect(438+i*23,156,17,28,['#c2d9e5','#d4c5e5','#bcd8d2','#c7cee8'][i],'#eef9fc',3,1);
 // Anesthesia machine central-left with cylinders and breathing bag.
 s+='<g filter="url(#sSh)">'+rect(429,225,109,103,'#ecf4f7','#8caab7',9,4)+rect(441,175,91,51,'#e3f0f5','#7d9fb0',6,3)+rect(450,183,64,32,'#304e66','#9bb8c4',4,2)+path('M457 201h10l5 -10 6 16 5 -7h12l6 -7 7 10','#9cdebc',2.5)+rect(450,242,75,13,'#f8fcfe','#a0bbcb',4);
 for(let x of [458,483,508])s+=rect(x,265,16,33,x===483?'#e4c4e7':'#b7d9e2','#8daebd',4);
 s+=path('M437 328v16M528 328v16','#7c9aa9',6)+'<circle cx="440" cy="348" r="6" fill="#6c8ea1"/><circle cx="525" cy="348" r="6" fill="#6c8ea1"/>';
 s+=path('M510 225q65 -25 64 40','#a5c8cf',5)+ '<ellipse cx="571" cy="273" rx="13" ry="31" fill="#69bbaa" stroke="#3d9994" stroke-width="3"/>';
 s+='</g>'+label(427,130,114,'ANESTHESIA MACHINE');
 // Separate large patient monitor raised on pole.
 s+='<g filter="url(#sSh)">'+rect(561,180,112,76,'#deeef4','#8ba9bd',8,5)+rect(572,190,90,54,'#263f59','#466b80',4)+path('M579 224h13l5 -11 5 21 7 -16 8 7h8l7 -12 7 17 6 -9h11','#64dcb3',3)+txt(648,207,'98',13,'#c7edb1',900)+txt(646,238,'96',12,'#c4e6f4',900)+path('M619 256v17','#8aa8b8',5)+rect(597,273,44,12,'url(#sSteel)','#a7bdc4',3)+'</g>';
 s+=label(565,147,103,'PATIENT MONITOR');
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
 s+='</g>'; // Operating table is labeled by existing station button.
 // OR equipment drawer cart and supplies.
 s+=rect(791,242,69,111,'url(#sSteel)','#86a8b6',8,3);
 for(let i=0;i<3;i++){s+=rect(798,263+i*27,55,22,'#e3f2f5','#9bbac7',3)+path('M818 '+(275+i*27)+'h16','#8eb2bc',2);}
 s+=rect(789,230,76,11,'#a9c3ca','#fff',3)+rect(808,217,11,13,'#d9f8f8','#8cb8c6',2);
 // Compact warming equipment parked below the wall guide, not across its display.
 s+=rect(821,235,34,21,'#d3e6f1','#98b4c6',4,2)+rect(826,240,20,8,'#3d627c','#afcad3',2,1);
 s+='<path d="M835 259l-18 33h32z" fill="#ffe1a6" opacity=".16"/>';
  // Recovery entrance is added last as an angled RIGHT SIDE WALL doorway, not the back wall.
 // Small wall-mounted Tool ID placard (the clickable hit area remains in the game).
 
 // Electrosurgical unit in theatre (no overlaid redundant caption).
 s+=rect(778,209,72,48,'#e9f0f9','#8eabc2',7,3)+rect(789,219,35,20,'#304f69','#8fb8c9',3,2);
 s+=txt(807,233,'ESU',10,'#c6f7f2',900)+rect(833,220,8,14,'#e6c69e','#9fa6b2',2);
 s+=path('M839 239q14 14 8 33','#778baf',3);
 // The upper-right plane is explicitly the side wall. Keep the OR free of recovery beds.
 s+='<polygon points="865,72 1000,0 1000,406 865,342" fill="#bfd4e1" stroke="#96aec1" stroke-width="5"/>';
 // Perspective right-wall mount: readable surgical-tool quick-guide with silhouette icons.
 // Kept above mobile equipment and outside the sterile table's working silhouette.
 s+='<polygon points="803,91 891,68 891,334 803,348" fill="#c0d7e3" stroke="#97b6c6" stroke-width="3"/>';
 s+='<polygon points="811,103 880,89 880,205 811,217" fill="#f9fcff" stroke="#92afc4" stroke-width="4"/>';
 s+=txt(845,121,'SURGICAL',9,'#466d8d',900)+txt(845,134,'TOOLS',11,'#466d8d',900);
 s+=path('M823 148l16 22M840 148l-17 22M850 151l17 19M866 151l-16 19','#7099ad',3);
 s+='<circle cx="826" cy="185" r="5" fill="none" stroke="#6892a7" stroke-width="2"/><circle cx="837" cy="185" r="5" fill="none" stroke="#6892a7" stroke-width="2"/>';
 s+=path('M826 182l23 14M837 182l14 14M859 179v17M852 184l14 -3','#7ba0b3',2);
 s+=txt(845,201,'TAP TO LEARN',8,'#6b92a9',800);
 
 // Recessed purple jamb, perspective reveals the recovery room behind the RIGHT wall.
 s+='<polygon points="883,101 987,54 987,375 883,329" fill="#9c8cbe" stroke="#8074a7" stroke-width="6"/>';
 s+='<polygon points="892,111 977,74 977,356 892,322" fill="#dae9f4" stroke="#f5f4fe" stroke-width="3"/>';
 s+='<polygon points="900,125 969,97 969,333 900,309" fill="#c5e3ee"/>';
 // Kennel bank inside the room behind glass with a visible pink bed.
 s+='<polygon points="904,190 965,169 965,256 904,276" fill="#a5becf" stroke="#819eb2" stroke-width="3"/>';
 for(let i=0;i<5;i++){let x=911+i*12;s+=path('M'+x+' '+(187-i*4)+'v87','#89a5b8',2);}
 s+='<polygon points="905,260 965,241 965,285 905,301" fill="#e3cce7" stroke="#bea4d1" stroke-width="3"/>';
 s+='<polygon points="903,303 967,286 967,332 903,312" fill="#9fc7d9"/>';
 // Steel/glass frames and door handle for a real architectural opening.
 s+='<polygon points="885,102 895,108 895,324 885,331" fill="#ddd3ef"/>';
 s+='<polygon points="969,81 978,76 978,352 969,348" fill="#907db4"/>';
 s+=path('M898 117L971 85M897 313L971 338','#f5faff',3);
 s+='<ellipse cx="956" cy="240" rx="4" ry="6" fill="#f6e4b7" stroke="#8e83ab" stroke-width="1"/>';
 s+=rect(892,58,90,22,'#faf7ff','#b2a6cb',7,2)+txt(937,73,'RECOVERY',10,'#6f608f',900);
 // A few floor reflections indicate depth, leaving foreground walkable for avatars.
 s+='<path d="M71 377H376M429 382H952" stroke="#ffffff" stroke-width="3" opacity=".65"/>';
 s+='<path d="M375 353L339 500M863 353L904 500" stroke="#effcff" stroke-width="2" opacity=".65"/>';
 s+='</svg>';return s;
};
})();