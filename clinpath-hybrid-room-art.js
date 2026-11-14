/* Programmatic Concept-2/Concept-1 hybrid Clinical Pathology teaching lab.
 All graphics are SVG, with no external image dependencies. */
window.VPQ_CLINPATH_HYBRID_SCENE=(function(){
'use strict';
const R=(x,y,w,h,fill,stroke='#b1b7d6',rx=10)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
const T=(x,y,t,size=14,color='#594773',anchor='middle')=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" font-family="Arial,sans-serif" font-weight="800" font-size="'+size+'" fill="'+color+'">'+t+'</text>';
const P=(d,stroke='#7087a9',sw=4)=>'<path d="'+d+'" stroke="'+stroke+'" stroke-width="'+sw+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
function tubes(x,y,n,cap='#6aa4da',scale=1){let s='';for(let i=0;i<n;i++){let xx=x+i*16*scale;s+='<g transform="translate('+xx+' '+y+') scale('+scale+')">'+R(0,0,12,45,'#f4faff','#9daccd',3)+R(0,0,12,8,cap,'#7c99c1',2)+R(2,28,8,13,'#d8a2bd','none',2)+'</g>'}return s+R(x-4,y+36*scale,n*16*scale+1,8,'#b6c4db','#9aabcb',3)}
function scope(x,y,z=1){return '<g transform="translate('+x+' '+y+') scale('+z+')">'+
 R(4,80,80,12,'#9991b5','#6e729b',7)+P('M22 79Q10 56 32 41','#8b9fbb',9)+
 R(43,12,17,48,'#f8f6ff','#778bac',5)+R(53,3,30,12,'#47557e','#364467',4)+
 P('M59 20L74 36L48 57','#556b98',11)+R(32,57,60,8,'#b9c9dc','#758caa',4)+
 '<circle cx="48" cy="50" r="5" fill="#f1b3c8" stroke="#987ea9" stroke-width="2"/></g>'}
function analyzer(x,y,w,h,lines){let s=R(x,y,w,h,'#fffdfd','#98a7c2',12)+R(x+9,y+10,w-18,Math.round(h*.56),'#3e5f83','#90aec6',5);
 lines.forEach((v,i)=>s+=T(x+w/2,y+29+i*16,v,Math.min(13,w/7),'#e4f8fa'));return s+R(x+14,y+h-18,28,7,'#b8dfdb','#9bb8d1',4)+R(x+w-27,y+h-21,11,9,'#e6b5d3','#c79ab9',4)}
function frame(x,title,sub,fill,stroke){
 return R(x,153,174,204,fill,stroke,22)+R(x+8,160,158,48,'#fffefe',stroke,13)+T(x+87,180,title,16,'#594a7b')+T(x+87,198,sub,12,'#7b709a')+
 R(x+7,340,160,14,'#dfd5eb','#ac9bc6',6)+R(x+13,355,14,38,'#bcc9dd','#93a6c2',5)+R(x+147,355,14,38,'#bcc9dd','#93a6c2',5);
}
function plant(x,y){return R(x-9,y+16,23,26,'#eac3db','#af94bb',7)+P('M'+(x+2)+' '+(y+15)+'L'+x+' '+(y-26),'#83b18b',3)+
 '<ellipse cx="'+(x-11)+'" cy="'+(y-13)+'" rx="10" ry="17" fill="#a4d1b0" transform="rotate(-30 '+(x-11)+' '+(y-13)+')"/>'+
 '<ellipse cx="'+(x+10)+'" cy="'+(y-23)+'" rx="10" ry="16" fill="#8ecab5" transform="rotate(33 '+(x+10)+' '+(y-23)+')"/>'}
function props(){
 let s='';
 // Credible, distinct instrument silhouettes, not branded copies
 s+=analyzer(38,238,89,88,['PT 12.4 s','aPTT 29 s'])+tubes(142,263,3,'#61a8e7',.86)+R(140,316,43,22,'#fffcfa','#c9b6c3',3)+T(161,330,'PT/aPTT',9);
 s+=analyzer(235,237,110,97,['pH 7.32','pCO₂ 52','HCO₃ 26'])+R(356,255,18,60,'#f6f9fd','#92b9d5',5)+P('M346 330L389 330','#8eabd3',7);
 s+=analyzer(431,236,72,96,['UA','SCAN'])+R(513,289,27,43,'#fff3ba','#beab91',7)+R(509,284,35,9,'#f1cb86','#cfb596',4)+
 R(545,258,40,73,'#f3ecfa','#a6a3cb',14)+'<ellipse cx="565" cy="263" rx="19" ry="9" fill="#d5c9df" stroke="#a19abd" stroke-width="2"/>'+
 '<circle cx="565" cy="273" r="11" fill="#8c98be"/>'+P('M510 338L549 350','#7395b3',8)+R(593,275,8,45,'#fff9e2','#b6adc2',2);
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
 s+=R(29,84,188,65,'#ead9ea','#b69fce',9)+R(39,94,167,43,'#fffafa','#c5b8d7',6);
 for(let i=0;i<12;i++)s+=R(45+i*13,102,10,29,['#dab4d8','#95bbdb','#ecc6d3','#dccb97'][i%4],'#fff',2);
 s+=R(91,73,88,26,'#fff4cf','#ad97bb',11)+T(135,92,'LEARN',15);
 s+=R(782,88,166,50,'#f5ebf7','#c5b3d7',8)+T(865,106,'LAB STORAGE',12)+tubes(813,113,5,'#ae9bd2',.55);
 s+=plant(18,105)+plant(965,106);
 // Center-back classroom sign, independent of clickable bench locations
 s+=R(363,95,271,44,'#fffafd','#c7b2d9',12)+T(498,114,'REFERRAL DIAGNOSTICS',16,'#796194')+
 T(498,131,'Learn the WHY · Practice a case',11,'#8b93a9');
 // Cozy science props below benches, away from navigation dock
 s+=R(36,376,190,23,'#ebedf9','#a2b7d1',5)+tubes(48,352,4,'#bd9bd4',.7)+R(142,362,49,26,'#faf6fd','#bdacd7',4)+T(166,377,'SLIDES',9);
 s+=R(781,377,170,22,'#f0ecf8','#b7aacb',6)+R(820,358,58,24,'#f8e8dd','#c1adc7',4)+T(849,374,'FILES',10);
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
 R(78,417,844,78,'#fffaff','#b6a2d5',19)+T(500,435,'📚 REFERENCE &amp; STUDY SHORTCUTS',13,'#7e669b')+
 '</svg>';
 return s;
}
return draw;
})();
