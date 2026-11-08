/* Avatar standing companion art v1.
 * Portrait selections remain unchanged. The clinic avatar is always full-body SVG.
 * Built for all 31 saved roster IDs plus the customizable classic character.
 * Vector companions are stylized matches, not pixel-identical recreations of portrait sheet.
 */
window.VPQ_STANDING_AVATARS=function(){
'use strict';
const skins=['#eac4a4','#a96843','#784933','#c48a61','#f3d0ba','#9d6147','#d9a07e','#573a31','#b87554','#e5b48e','#8b5541','#d1a081','#a16b55','#f0c9ac','#62402f','#be8061','#dca686','#955f46','#e5bfa1','#764534','#ca8964','#a46c52','#e9b899','#684536','#bb7f62','#d69b7b','#8a503e','#f1c9aa','#b77957','#c48a64','#966045'];
const hairs=['#452e33','#241f2a','#4c3430','#60453c','#8b6144','#26252e','#3a2a32','#27212b','#70483c','#52312c','#313137','#5c3d33','#251f26','#a4774a','#33272e','#3b2a31','#7b543f','#221f28','#4f322d','#29222a','#5c3b39','#33242b','#956747','#241b22','#36282a','#7b4f39','#2d2229','#65432f','#342128','#876649','#2b2631'];
const outfits=['#69a3a1','#6f95b0','#a584ba','#619b9c','#96a87f','#777da4','#b183a1','#6f9d8c','#6f89b8','#6b9b90','#bd8c86','#6a9fba','#8da1ac','#659f99','#9384b8','#aa8c6d','#6ca2aa','#918bb3','#8eb195','#6f99a0','#ab8ea3','#6b8f9d','#a998c9','#77a390','#9e849d','#688fba','#759688','#a478a3','#735f99','#397c83','#8e91ad'];
const types=['feminine','masculine','feminine','masculine','feminine','masculine','feminine','masculine','androgynous','feminine','masculine','androgynous','feminine','masculine','masculine','feminine','androgynous','masculine','feminine','masculine','androgynous','feminine','masculine','feminine','feminine','masculine','androgynous','feminine','feminine','masculine','androgynous'];
const builds=['balanced','broad','full','slim','curvy','full','balanced','slim','balanced','curvy','broad','balanced','full','balanced','full','balanced','slim','broad','curvy','broad','balanced','full','slim','balanced','petite','broad','balanced','curvy','balanced','full','balanced'];
const hairStyles=['long','short','coils','short','wave','short','braids','short','curly','long','short','locs','bun','short','short','wave','ponytail','short','curly','short','locs','long','short','braids','bun','short','coils','wave','long','short','halfup'];
const skinSafe=(s,f)=>/^#[0-9a-f]{6}$/i.test(String(s||''))?s:f;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function look(p){
 const n=Number(String(p?.portraitId||'').replace('roster-',''));
 const preset=/^roster-(?:[0-9]|[12][0-9]|30)$/.test(p?.portraitId||'')&&n>=0&&n<31;
 if(preset)return {skin:skins[n],hair:hairs[n],scrubs:outfits[n],base:types[n],body:builds[n],style:hairStyles[n],coat:n===28?'coat':n%6===4?'coat':'none',glasses:n%9===6,beard:n%6===1,cap:n===29,eye:'#463d39',accessory:n%5===0?'🩺':'',key:n};
 return {skin:skinSafe(p?.skin,'#b77957'),hair:skinSafe(p?.hair,'#3b2930'),scrubs:skinSafe(p?.scrubs,'#699fa6'),base:p?.avatarBase||'androgynous',body:p?.bodyShape||'balanced',style:p?.hairStyle||'classic',coat:p?.outerwear||'none',glasses:p?.glasses&&p.glasses!=='none',beard:!!p?.beard,cap:!!p?.cap,eye:skinSafe(p?.eyeColor,'#503d35'),accessory:p?.avatarAccessory||'',key:'classic'};
}
function svg(p,kind='standing'){
 const a=look(p);const wide=({petite:.84,slim:.89,balanced:1,broad:1.18,curvy:1.16,full:1.3})[a.body]||1;
 const masculine=a.base==='masculine';
 const headRx=masculine?22:20,faceR=masculine?20:23;
 const id='vpqStanding'+String(a.key).replace(/[^a-z0-9]/gi,'');
 const hairBehind=['long','wave','ponytail','pony','braids','locs','halfup'].includes(a.style)?
  '<path d="M42 47Q25 71 35 117L49 119Q51 90 56 72 M78 48Q101 81 89 120L76 120Q75 83 71 72" fill="'+a.hair+'" stroke="#3a303a" stroke-width="2"/>':'';
 let hairTop='<path d="M39 51Q36 20 61 19Q87 20 86 53Q71 44 65 37Q54 51 39 51Z" fill="'+a.hair+'" stroke="#332e36" stroke-width="2.6"/>';
 if(['short'].includes(a.style))hairTop='<path d="M40 49Q37 24 62 25Q86 23 84 50Q62 39 40 49Z" fill="'+a.hair+'" stroke="#332e36" stroke-width="2.6"/>';
 if(['coils','curly','fluffy'].includes(a.style))hairTop='<g fill="'+a.hair+'" stroke="#302b35" stroke-width="1.5">'+[0,1,2,3,4,5,6,7].map((_,i)=>'<circle cx="'+(41+i%4*13)+'" cy="'+(29+Math.floor(i/4)*10)+'" r="11"/>').join('')+'</g>';
 if(['braids','locs'].includes(a.style))hairTop+='<g fill="'+a.hair+'" stroke="#342b34" stroke-width="1.4">'+[0,1,2,3,4,5].map((_,i)=>'<ellipse cx="'+(40+i*9)+'" cy="'+(70+i%2*5)+'" rx="4.5" ry="'+(a.style==='locs'?22:16)+'"/>').join('')+'</g>';
 const bun=a.style==='bun'?'<ellipse cx="64" cy="16" rx="15" ry="11" fill="'+a.hair+'"/>':'';
 const pony=a.style==='ponytail'||a.style==='pony'?'<path d="M84 38Q105 40 98 73Q93 85 83 70" fill="'+a.hair+'" stroke="#352935" stroke-width="2"/>':'';
 const coat=a.coat==='coat'?'<path d="M41 97L52 96L63 125L75 96L89 99L94 173L78 175L68 134L62 142L56 134L48 176L32 173Z" fill="#fffdf5" stroke="#acb9c4" stroke-width="2.4"/><path d="M53 99L64 135L48 121ZM73 99L64 135L82 121Z" fill="#dfe9ed" stroke="#abb9c4" stroke-width="1.5"/>':'';
 const outer=a.coat==='hoodie'||a.coat==='jacket'?'<path d="M41 100L54 95L63 113L74 95L87 100L96 166H31Z" fill="'+(a.coat==='hoodie'?'#ad94bf':'#c49c82')+'" stroke="#6c6674" stroke-width="3"/>':'';
 const glasses=a.glasses?'<g fill="none" stroke="#605459" stroke-width="2.1"><rect x="44" y="59" width="17" height="13" rx="5"/><rect x="67" y="59" width="17" height="13" rx="5"/><path d="M61 63h6"/></g>':'';
 const beard=a.beard?'<path d="M45 73Q47 91 63 91Q80 90 82 73Q73 86 63 83Q52 86 45 73Z" fill="'+a.hair+'" opacity=".92"/>':'';
 const cap=a.cap?'<path d="M38 44Q38 20 63 21Q88 21 88 44Z" fill="#415561" stroke="#303742" stroke-width="3"/><path d="M36 45Q70 38 97 45Q78 54 46 50Z" fill="#425f6b" stroke="#303742" stroke-width="2"/>':'';
 const accent=a.accessory==='🩺'?'<path d="M53 111Q47 142 66 143Q84 144 76 112" stroke="#56616e" stroke-width="3.5" fill="none"/><circle cx="67" cy="143" r="6" fill="#6f7e8b" stroke="#4c5a64" stroke-width="2"/>':'';
 const body='<g transform="translate(64 0) scale('+wide+' 1) translate(-64 0)">'+
 '<path d="M46 158L43 207Q41 215 50 215H62L65 160Z" fill="#4e6077" stroke="#43536a" stroke-width="2.5"/>'+
 '<path d="M66 158L66 215H79Q85 213 81 205L79 158Z" fill="#495b70" stroke="#43536a" stroke-width="2.5"/>'+
 '<path d="M44 211Q36 215 34 224Q34 229 41 230H66V215Z" fill="#4c3b43" stroke="#362f36" stroke-width="2"/>'+
 '<path d="M79 211Q89 215 92 225Q92 230 84 230H62V215Z" fill="#4c3b43" stroke="#362f36" stroke-width="2"/>'+
 '<path d="M37 107Q40 95 54 96H74Q87 96 91 108L88 167H39Z" fill="'+a.scrubs+'" stroke="#4e6074" stroke-width="3"/>'+
 '<path d="M55 98L63 114L73 98" fill="none" stroke="#e6eeee" stroke-width="4"/>'+
 '<path d="M41 109Q26 139 31 169" stroke="'+a.scrubs+'" stroke-width="15" stroke-linecap="round"/>'+
 '<path d="M87 109Q103 139 98 169" stroke="'+a.scrubs+'" stroke-width="15" stroke-linecap="round"/>'+
 '<circle cx="31" cy="172" r="8" fill="'+a.skin+'"/><circle cx="98" cy="172" r="8" fill="'+a.skin+'"/>'+
 '<path d="M42 148H83M55 162H71" stroke="#d4e3e8" opacity=".55" stroke-width="2"/>'+
 '</g>';
 const face='<rect x="58" y="89" width="12" height="13" rx="5" fill="'+a.skin+'"/>'+
 '<ellipse cx="63" cy="64" rx="'+headRx+'" ry="'+faceR+'" fill="'+a.skin+'" stroke="#966c59" stroke-width="2"/>'+
 '<circle cx="44" cy="67" r="5" fill="'+a.skin+'"/><circle cx="83" cy="67" r="5" fill="'+a.skin+'"/>'+
 '<ellipse cx="54" cy="67" rx="3.4" ry="4.3" fill="#fff9ef"/><ellipse cx="73" cy="67" rx="3.4" ry="4.3" fill="#fff9ef"/>'+
 '<circle cx="54" cy="67" r="2.6" fill="'+a.eye+'"/><circle cx="73" cy="67" r="2.6" fill="'+a.eye+'"/>'+
 '<path d="M63 68l-2 7h4" stroke="#a47668" stroke-width="1.6" fill="none"/>'+
 '<path d="M55 79Q63 87 72 79" stroke="#834c55" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
 return '<svg class="vpq-standing-art vpq-standing-'+esc(kind)+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 236" role="img" aria-label="Full-body standing veterinarian illustration" preserveAspectRatio="xMidYMax meet">'+
 '<ellipse cx="64" cy="232" rx="33" ry="3" fill="#37445b" opacity=".18"/>'+body+hairBehind+face+bun+pony+hairTop+glasses+beard+cap+coat+outer+accent+'</svg>';
}
const style=document.createElement('style');
style.textContent='.vpq-standing-art{display:block;width:100%;height:100%;overflow:visible;pointer-events:none}.vpq-game-avatar .vpq-standing-art{position:absolute;left:0;bottom:0;width:100%;height:100%;filter:drop-shadow(0 3px 2px #28374d33)}.vpq-avatar-matched-stand{width:75px;height:114px;position:absolute;inset:0;overflow:visible}.vpq-matched-creator{display:flex;gap:8px;align-items:flex-end;justify-content:center;max-width:100%;min-height:224px}.vpq-matched-frame,.vpq-matched-body{display:flex;align-items:center;flex-direction:column;gap:5px;min-width:0}.vpq-matched-frame{width:46%;max-width:152px}.vpq-matched-body{width:48%;max-width:142px}.vpq-matched-frame .vpq-roster-art,.vpq-matched-frame .vpq-standing-alex{width:100%!important;height:178px!important;object-fit:cover;border:4px ridge #d3b8a1;border-radius:12px;box-shadow:0 3px 6px #4e405238}.vpq-matched-frame .vpq-character-portrait:not(.vpq-roster-art){width:145px;height:178px;max-width:100%;border:4px ridge #d3b8a1;border-radius:12px}.vpq-matched-body .vpq-standing-art{height:198px;width:123px;max-width:100%}.vpq-matched-creator small{font-size:11px;font-weight:800;color:#675978}.vpq-matched-pet{max-width:100%;display:flex;justify-content:center}.vpq-matched-viewer{display:flex;align-items:flex-end;justify-content:center;gap:14px}.vpq-matched-viewer .vpq-character-portrait{width:135px;height:190px;max-width:100%}.vpq-matched-viewer .vpq-standing-art{width:133px;height:205px}.vpq-matched-roster-note{font-size:12px;color:#655b76;background:#f7f0fc;padding:8px 10px;border-radius:10px;margin-top:7px}@media(max-width:560px){.vpq-matched-frame .vpq-roster-art,.vpq-matched-frame .vpq-standing-alex{height:144px!important}.vpq-matched-body .vpq-standing-art{height:166px}.vpq-matched-creator{min-height:175px}}';
document.head.appendChild(style);
function renderWalking(p){
 const av=document.getElementById('avatarSprite');if(!av)return;
 av.classList.add('vpq-portrait-walk');
 av.classList.remove('vpq-storybook-walk');
 av.style.background='none';
 const holder=av.querySelector('.vpq-game-avatar')||(()=>{const el=document.createElement('div');el.className='vpq-game-avatar';av.appendChild(el);return el})();
 holder.innerHTML=svg(p,'walk');
}
function creator(){
 const form=document.getElementById('avatarForm'),stage=document.getElementById('vpqPreviewStage');if(!form||!stage)return;
 const values=Object.fromEntries(new FormData(form).entries());
 const p={...values,beard:values.beard==='true',cap:values.cap==='true'};
 const portrait=stage.querySelector('.vpq-character-portrait,.vpq-storybook-portrait')?.outerHTML||'';
 const pet=stage.querySelector('.vpq-preview-pet')?.outerHTML||'';
 stage.innerHTML='<div class="vpq-matched-creator"><div class="vpq-matched-frame"><small>🖼️ Portrait</small>'+portrait+'</div><div class="vpq-matched-body"><small>🚶 In-game character</small>'+svg(p,'preview')+'</div></div><div class="vpq-matched-pet">'+pet+'</div>';
 const note=stage.parentNode.querySelector('.vpq-matched-roster-note');
 if(note)note.textContent='Your portrait stays in a picture frame; the matching standing illustration appears in every clinic room. Skin, hairstyle, body shape and outfit remain editable in Classic.';
}
function viewer(p){
 const root=document.getElementById('modalBody')?.querySelector('.vpq-avatar-showcase');if(!root)return;
 const portrait=root.querySelector('.vpq-character-portrait,.vpq-storybook-portrait')?.outerHTML||'';
 const pet=root.querySelector('.vpq-preview-pet')?.outerHTML||'';
 root.innerHTML='<div class="vpq-matched-viewer"><div class="vpq-matched-frame"><small>🖼️ Selected portrait</small>'+portrait+'</div><div class="vpq-matched-body"><small>🚶 Walking avatar</small>'+svg(p,'viewer')+'</div></div>'+pet;
}
return {svg,look,renderWalking,creator,viewer};
};