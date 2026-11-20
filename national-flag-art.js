/* National flag artwork: individually drawn flag layouts, rather than one shared striped flag.
   Flag proportions are adapted to a consistent shop display. */
(function(){
'use strict';
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rect(x,y,w,h,c){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+c+'"/>';}
function path(d,c){return '<path d="'+d+'" fill="'+c+'"/>';}
function circle(x,y,r,c){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'"/>';}
function star(cx,cy,r,c){const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,z=i%2?r*.4:r;pts.push((cx+Math.cos(a)*z).toFixed(1)+','+(cy+Math.sin(a)*z).toFixed(1));}return '<polygon points="'+pts.join(' ')+'" fill="'+c+'"/>'}
const stripe=(list,w=174,h=99)=>list.map((c,i)=>rect(0,i*h/list.length,w,h/list.length+.02,c)).join('');
function flag(code){
 let out='';
 switch(code){
 case 'us':out=stripe(Array.from({length:13},(_,i)=>i%2?'#fff':'#b22234'));out+=rect(0,0,70,54,'#3c3b6e');for(let row=0;row<9;row++)for(let col=0;col<(row%2?5:6);col++)out+=star(5+col*11+(row%2?5.5:0),5+row*5.7,2.45,'white');break;
 case 'ca':out=rect(0,0,44,99,'#d80621')+rect(44,0,86,99,'#fff')+rect(130,0,44,99,'#d80621')+path('M87 16l8 20 13-6-5 13 16 9-16 7 5 13-18-5-3 19-4-19-18 5 5-13-16-7 16-9-5-13 13 6z','#d80621');break;
 case 'mx':out=rect(0,0,58,99,'#006847')+rect(58,0,58,99,'#fff')+rect(116,0,58,99,'#ce1126')+'<g transform="translate(87 50)">'+path('M-10 -16q14-10 18 1l-5 6 8 8-9 5-3-10-5 7 5 9-9-4-8-16z','#74623b')+circle(6,-8,2,'#eed7a0')+path('M-18 4Q-22 21 0 24Q19 21 20 4','none')+'<path d="M-19 4Q-23 22 0 24Q23 22 19 4" fill="none" stroke="#458b58" stroke-width="3"/></g>';break;
 case 'gb':out=rect(0,0,174,99,'#012169')+path('M0 0l174 99m0-99L0 99','none')+'<path d="M-8 -7L184 106M184 -7L-8 106" stroke="#fff" stroke-width="23"/><path d="M-8 -7L184 106M184 -7L-8 106" stroke="#c8102e" stroke-width="10"/>'+rect(0,36,174,27,'#fff')+rect(73,0,28,99,'#fff')+rect(0,42,174,15,'#c8102e')+rect(79,0,16,99,'#c8102e');break;
 case 'pr':out=stripe(['#ed0000','#fff','#ed0000','#fff','#ed0000'])+path('M0 0L83 49.5 0 99Z','#0050f0')+star(27,50,17,'#fff');break;
 case 'br':out=rect(0,0,174,99,'#009c3b')+path('M87 7L166 49.5 87 92 8 49.5Z','#ffdf00')+circle(87,49.5,30,'#002776')+'<path d="M59 42q35-14 58 13" fill="none" stroke="#fff" stroke-width="7"/>'+Array.from({length:13},(_,i)=>circle(67+(i*19)%42,32+(i*13)%33,1.4,'white')).join('');break;
 case 'ph':out=rect(0,0,174,49.5,'#0038a8')+rect(0,49.5,174,49.5,'#ce1126')+path('M0 0L89 49.5 0 99Z','#fff')+circle(26,50,9,'#fcd116')+Array.from({length:8},(_,i)=>{let a=i*Math.PI/4;return path('M'+(26+Math.cos(a)*11)+' '+(50+Math.sin(a)*11)+'l'+(Math.cos(a)*7)+' '+(Math.sin(a)*7)+' -4 -3Z','#fcd116')}).join('')+star(9,12,6,'#fcd116')+star(9,87,6,'#fcd116')+star(72,50,6,'#fcd116');break;
 case 'ua':out=stripe(['#0057b7','#ffd700']);break;
 case 'ie':out=rect(0,0,58,99,'#169b62')+rect(58,0,58,99,'#fff')+rect(116,0,58,99,'#ff883e');break;
 case 'jp':out=rect(0,0,174,99,'#fff')+circle(87,49.5,29,'#bc002d');break;
 case 'in':out=stripe(['#ff9933','#fff','#138808'])+circle(87,49.5,16,'none')+'<circle cx="87" cy="49.5" r="16" stroke="#000080" stroke-width="2.5" fill="none"/>'+Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return '<path d="M87 49.5L'+(87+Math.cos(a)*14).toFixed(2)+' '+(49.5+Math.sin(a)*14).toFixed(2)+'" stroke="#000080" stroke-width="1"/>'}).join('')+circle(87,49.5,2.5,'#000080');break;
 case 'de':out=stripe(['#000','#dd0000','#ffce00']);break;
 case 'za':out=rect(0,0,174,49.5,'#de3831')+rect(0,49.5,174,49.5,'#002395')+path('M0 0L89 49.5 0 99Z','#fff')+path('M0 8L76 49.5 0 91Z','#007a4d')+path('M0 22L50 49.5 0 77Z','#ffb612')+path('M0 32L32 49.5 0 67Z','#000')+path('M61 37H174V63H61L45 49.5Z','#fff')+path('M60 41H174V57H60L48 49.5Z','#007a4d');break;
 case 'jm':out=rect(0,0,174,99,'#f9ce00')+path('M0 0L79 49.5 0 99Z','#000')+path('M174 0L95 49.5 174 99Z','#000')+path('M17 0H157L87 42Z','#009b3a')+path('M17 99H157L87 57Z','#009b3a')+path('M0 0L174 99M174 0L0 99','none')+'<path d="M0 0L174 99M174 0L0 99" fill="none" stroke="#f9ce00" stroke-width="14"/>';break;
 default:return '';
 }
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 165" role="img" aria-label="'+esc(code.toUpperCase())+' national flag">'+
 '<ellipse cx="127" cy="149" rx="92" ry="8" fill="#3c5267" opacity=".13"/>'+
 '<rect x="27" y="18" width="6" height="126" rx="3" fill="#9b8b89"/>'+
 '<g transform="translate(38 24)"><svg width="174" height="99" viewBox="0 0 174 99" overflow="hidden">'+out+'</svg></g>'+
 '<path d="M38 24H212V123H38Z" fill="none" stroke="#ddd4cd" stroke-width="1.4"/>'+
 '<circle cx="30" cy="16" r="6" fill="#cfa975"/></svg>';
}
const codes=['us','ca','mx','gb','pr','br','ph','ua','ie','jp','in','de','za','jm'];
const codeFor=item=>{const m=String(item?.id||'').match(/^flag-national-(\d+)$/);return m?codes[Number(m[1])]||null:null};
window.VPQ_NATIONAL_FLAG_ART={art:item=>{const code=codeFor(item);return code?flag(code):null},imageSrc:item=>{const code=codeFor(item);return code?'https://flagcdn.com/w320/'+code+'.png':null}};
})();