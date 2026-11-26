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
 s+='<path d="M63 344L0 500M944 344L1000 500M286 344L250 500M540 344V500M771 344L801 500M0 412H1000" stroke="#fff" stroke-width="2.5" opacity=".5" fill="none"/>';
 s+='<path d="M63 343H944" stroke="#86b8c5" stroke-width="6" opacity=".5"/>';
 // Ceiling tile geometry.
 for(let x=70;x<=930;x+=140)s+=path('M'+x+' 2L'+(x+13)+' 59','#cbd8df',1);
 for(let x of [148,372,617,846])s+='<ellipse cx="'+x+'" cy="29" rx="28" ry="9" fill="#fffbe6" stroke="#fff" stroke-width="4"/>';
 s+=rect(64,61,877,9,'#f4fdff');
 // Supply and scrub side: clear wall bands and explicit non-overlapping equipment zones.
 s+=rect(101,88,284,252,'#d5e9ed')+rect(101,95,281,7,'#f6fcfb')+label(179,77,180,'CLEAN PREP &amp; SUPPLIES');
 // Two vertically stacked fixtures on the LEFT angled wall: tools above, smaller ET tube rack below.
 s+='<polygon points="0,46 99,91 99,351 0,407" fill="#aecbd5" stroke="#91b1c1" stroke-width="3"/>';
 // Tool board recessed into the angled wall; small silhouettes support the interactive overview.
 s+='<polygon points="22,109 88,132 88,226 22,240" fill="#f8fcff" stroke="#88aabe" stroke-width="3"/>';
 s+=txt(55,146,'SURGICAL',8,'#4a718e',900)+txt(55,158,'TOOLS',10,'#4a718e',900);
 s+=path('M33 169l15 16M48 169l-15 16M60 169l15 16M75 169l-15 16','#779cb0',2.4);
 s+='<circle cx="41" cy="194" r="4" fill="none" stroke="#7299ac" stroke-width="2"/><circle cx="52" cy="194" r="4" fill="none" stroke="#7299ac" stroke-width="2"/>';
 s+=path('M41 194l19 15M52 194l14 15M73 196v14','#779cb0',2);
 s+=txt(55,221,'TAP TO LEARN',7,'#7295aa',800);
 // ET rack reduced and deliberately located directly BELOW the tools board.
 s+='<polygon points="26,248 83,241 83,314 26,334" fill="#f6fcff" stroke="#91b2c1" stroke-width="3"/>';
 s+=txt(54,261,'ET TUBES',8,'#5b829b',900);
 for(let i=0;i<4;i++){let x=35+i*12;s+=rect(x,269,6,7,'#e9faff','#91b9c5',1,1)+path('M'+(x+3)+' 277v24q0 5 3 5','#86b8c4',1.7);}
 s+=path('M33 265h45','#a4c8d0',1.5);
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
 // Partial glass partition with framed pass-through between clean prep and OR.
 s+='<polygon points="382,55 402,67 402,350 382,363" fill="url(#sSteel)" stroke="#799bac" stroke-width="3"/>';
 s+='<polygon points="403,88 426,95 426,333 403,339" fill="url(#sGlass)" stroke="#a8c5d4" stroke-width="3"/>';
 s+=path('M405 107L424 129M405 165L424 190M405 229L424 254','#ffffff',3);
 s+=path('M400 80v272M429 99v229','#90b4c4',2);
 s+='<polygon points="383,353 425,341 435,349 394,365" fill="#95b5c3" stroke="#6f9da9" stroke-width="2"/>';
 s+=rect(381,343,40,8,'#9bb9c6');
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
 // Airway machine flowmeters, vaporizer knob and breathing circuit.
 for(let k=0;k<3;k++){let x=444+k*15;s+=rect(x,231,11,31,'#c9e9ee','#8ab5bb',4,2)+rect(x+3,240+k*3,5,12,'#77c3c2','',2);}
 s+=rect(501,230,21,24,'#e6e5f0','#a4b8ca',5,2)+'<circle cx="512" cy="242" r="6" fill="#90a6c2" stroke="#eefaff" stroke-width="2"/>';
 s+=path('M541 255q20 -17 35 7','#c3dce0',5);
 s+='</g>'; // no floating station label
 // Separate large patient monitor raised on pole.
 s+='<g filter="url(#sSh)">'+rect(561,180,112,76,'#deeef4','#8ba9bd',8,5)+rect(572,190,90,54,'#263f59','#466b80',4)+path('M579 224h13l5 -11 5 21 7 -16 8 7h8l7 -12 7 17 6 -9h11','#64dcb3',3)+txt(648,207,'98',13,'#c7edb1',900)+txt(646,238,'96',12,'#c4e6f4',900);
 s+=path('M580 236h29l6 -5 10 6h16','#edc78e',2)+txt(581,200,'ECG',8,'#c4dce5',700)+txt(646,225,'SpO₂',8,'#acdcd2',700);
 s+=path('M619 256v17','#8aa8b8',5)+rect(597,273,44,12,'url(#sSteel)','#a7bdc4',3)+'</g>';
 // Monitor display identifies the station without another overlapping label.
 // Multi-lamp articulating LED heads above the surgical field.
 s+=path('M705 0v88l-62 42M705 61l69 62','#91a6b7',9);
 for(let [x,y] of [[633,145],[778,138]]){
 s+='<ellipse cx="'+x+'" cy="'+y+'" rx="36" ry="27" fill="url(#sSteel)" stroke="#8aa4b3" stroke-width="5"/><ellipse cx="'+x+'" cy="'+y+'" rx="27" ry="20" fill="url(#sLight)" stroke="#f8fcff" stroke-width="3"/>';
 for(let k=0;k<7;k++){let a=k*Math.PI*2/7;s+='<circle cx="'+f(x+17*Math.cos(a))+'" cy="'+f(y+12*Math.sin(a))+'" r="4" fill="#fff8dd" stroke="#fff" stroke-width="1"/>'}
 s+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#fff9d7"/>';
 }
 // Sculpted 2.5D stainless operating table, thick apron and pedestal.
 s+='<ellipse cx="691" cy="373" rx="114" ry="15" fill="#658fa4" opacity=".16"/>';
 s+='<g filter="url(#sSh)">';
 s+='<polygon points="578,274 756,274 792,290 602,292" fill="#f3fbfe" stroke="#8eafbd" stroke-width="4"/>';
 s+='<polygon points="587,277 753,278 781,289 604,288" fill="#a5d7d7" stroke="#d8f8f7" stroke-width="2"/>';
 s+='<path d="M603 290h177" stroke="#f9ffff" stroke-width="2.5" opacity=".85"/>';
 s+='<polygon points="602,292 792,290 786,308 606,312" fill="url(#sSteel)" stroke="#789cae" stroke-width="3"/>';
 s+=path('M612 288h166M611 302h169','#f7ffff',2);
 s+='<polygon points="650,312 735,310 730,322 654,325" fill="#b0cbd4" stroke="#789bac" stroke-width="3"/>';
 s+='<polygon points="678,323 710,322 708,361 681,362" fill="url(#sSteel)" stroke="#80a4b4" stroke-width="3"/>';
 s+='<polygon points="638,360 750,358 763,373 625,374" fill="url(#sSteel)" stroke="#86a7b6" stroke-width="4"/>';
 s+=path('M663 369h75','#f5feff',3);
 s+='</g>';
 // Mayo stand just beside the table, without obscuring its main surface.
 s+='<g filter="url(#sSh)">';
 s+='<polygon points="549,292 599,289 619,297 561,301" fill="#d7f5eb" stroke="#7baea5" stroke-width="3"/>';
 s+='<polygon points="561,301 619,297 615,309 564,314" fill="#89c9bf" stroke="#6fa89f" stroke-width="2"/>';
 s+=path('M563 311v44M609 308v46','#83a5b2',4)+rect(555,353,62,7,'url(#sSteel)','#8babb9',3);
 for(let x of [560,574,586,598])s+=path('M'+x+' 296l7 -5','#7597a7',2);
 s+='</g>';
 // OR equipment drawer cart and supplies.
 s+=rect(791,242,69,111,'url(#sSteel)','#86a8b6',8,3);
 for(let i=0;i<3;i++){s+=rect(798,263+i*27,55,22,'#e3f2f5','#9bbac7',3)+path('M818 '+(275+i*27)+'h16','#8eb2bc',2);}
 s+=rect(789,230,76,11,'#a9c3ca','#fff',3)+rect(808,217,11,13,'#d9f8f8','#8cb8c6',2);
 // Compact warming equipment parked below the wall guide, not across its display.
 s+=rect(821,235,34,21,'#d3e6f1','#98b4c6',4,2)+rect(826,240,20,8,'#3d627c','#afcad3',2,1);
 s+='<path d="M835 259l-18 33h32z" fill="#ffe1a6" opacity=".16"/>';
  // Recovery entrance is added last as an angled RIGHT SIDE WALL doorway, not the back wall.

 // Electrosurgical unit in theatre (no overlaid redundant caption).
 s+=rect(787,192,65,48,'#e9f0f9','#8eabc2',7,3)+rect(797,202,35,20,'#304f69','#8fb8c9',3,2);
 s+=txt(814,216,'ESU',10,'#c6f7f2',900)+rect(839,203,8,14,'#e6c69e','#9fa6b2',2);
 s+=path('M844 218q18 20 6 42','#778baf',3);
 // The upper-right plane is explicitly the side wall. Keep the OR free of recovery beds.
 s+='<polygon points="865,72 1000,0 1000,406 865,342" fill="#bfd4e1" stroke="#96aec1" stroke-width="5"/>';
 // Right wall reserved entirely for a clear passage into the separate recovery ward.
 // Recessed purple jamb, perspective reveals the recovery room behind the RIGHT wall.
 s+='<polygon points="883,101 987,54 987,375 883,329" fill="#9c8cbe" stroke="#8074a7" stroke-width="6"/>';
 s+='<polygon points="892,111 977,74 977,356 892,322" fill="#dae9f4" stroke="#f5f4fe" stroke-width="3"/>';
 s+='<polygon points="900,125 969,97 969,333 900,309" fill="#c5e3ee"/>';
 s+='<polygon points="910,153 964,133 964,144 910,164" fill="#e9faff" opacity=".85"/>';
 s+='<polygon points="905,308 967,291 967,331 905,314" fill="#99bed0" opacity=".45"/>';
 s+='<polygon points="917,173 953,162 953,180 917,192" fill="#f7fbff" stroke="#a2bfd3" stroke-width="2"/>';
 s+='<polygon points="924,177 948,170 948,178 924,185" fill="#4b7389"/>';
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
 s+='<path d="M865 342L835 390L1000 445V408Z" fill="#61879d" opacity=".10"/>';
 // A few floor reflections indicate depth, leaving foreground walkable for avatars.
 s+='<path d="M71 377H376M429 382H952" stroke="#ffffff" stroke-width="3" opacity=".65"/>';
 s+='<path d="M375 353L339 500M863 353L904 500" stroke="#effcff" stroke-width="2" opacity=".65"/>';
 s+='</svg>';return s;
};
})();