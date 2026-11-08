/* Vet Pharm Quest illustrated interactive pathway viewer.
   All artwork is self-contained vector illustration (not ad mockup screenshots).
   Clickable in existing modals; never touches save state, coins, XP or grades. */
window.VPQ_VISUAL_PATHWAYS=(function(){
'use strict';
const all=()=>window.VPQ_VISUAL_DATA||[];
const lookup=id=>all().find(x=>x.id===id);
const e=x=>String(x??'').replace(/[&<>"']/g,t=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[t]));
let api=null,current=null,step=0,previous=null;
const palettes={teal:['#e2f5ed','#6cafa0','#336f6f'],rose:['#ffe3ed','#d9829a','#92536c'],blue:['#e4efff','#77a6d0','#3b7397'],purple:['#eee4fc','#ad91d9','#7656a3'],violet:['#f1eaff','#aa96d5','#7656a3'],green:['#e6f6e8','#80ba92','#3d815a'],amber:['#fff2dc','#dbad68','#956b39']};
function art(id,active=0,compact=false){
 const x=lookup(id);if(!x)return '';
 const colors=palettes[x.theme]||palettes.teal;
 const icons=x.steps.map((q,i)=>{
  const xpos=44+i*147,hi=i===active,stroke=hi?colors[2]:'#9caeba',bg=hi?'#ffffff':'#ffffffb9';
  const box='<rect x="'+xpos+'" y="76" rx="16" width="124" height="116" fill="'+bg+'" stroke="'+stroke+'" stroke-width="'+(hi?4:2)+'"/>';
  const decoration='<circle cx="'+(xpos+62)+'" cy="111" r="27" fill="'+(hi?colors[0]:'#eef3f6')+'" stroke="'+colors[1]+'" stroke-width="2"/>'+
   '<text x="'+(xpos+62)+'" y="122" text-anchor="middle" font-size="29">'+e(q.icon)+'</text>';
  const label=e(q.title.length>21?q.title.slice(0,19)+'…':q.title);
  return box+decoration+'<text x="'+(xpos+62)+'" y="157" text-anchor="middle" font-family="Trebuchet MS,Arial" font-weight="900" font-size="12" fill="#334d61">'+label+'</text>'+
   '<text x="'+(xpos+62)+'" y="177" text-anchor="middle" font-family="Arial" font-size="10" fill="#64778a">STEP '+(i+1)+'</text>'+
   (i===3?'':'<path d="M'+(xpos+127)+' 132h14" stroke="'+colors[2]+'" stroke-width="5" stroke-linecap="round"/><path d="M'+(xpos+134)+' 125l9 7-9 7" fill="none" stroke="'+colors[2]+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>');
 }).join('');
 let special='';
 if(id==='abx-pkpd')special='<g><path d="M46 53H610" stroke="#8eabd1" stroke-width="2"/><path d="M46 53L105 28 164 42 210 35 284 48 349 41 425 52 502 43 610 55" fill="none" stroke="#8f76c5" stroke-width="4"/><path d="M46 44H610" stroke="#d59893" stroke-dasharray="9 5" stroke-width="2"/><text x="550" y="39" font-size="11" fill="#955969">MIC</text></g>';
 else special='<g opacity=".5"><circle cx="560" cy="35" r="18" fill="'+colors[0]+'" stroke="'+colors[1]+'" stroke-width="3"/><circle cx="588" cy="40" r="8" fill="'+colors[1]+'"/><circle cx="530" cy="41" r="10" fill="'+colors[1]+'"/></g>';
 return '<svg viewBox="0 0 656 213" class="vpqVPArt" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four-stage illustrated cause-and-effect pathway for '+e(x.title)+'">'+
 '<defs><linearGradient id="vpqVPGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+colors[0]+'"/><stop offset="1" stop-color="#fcfcff"/></linearGradient></defs>'+
 '<rect width="656" height="213" rx="23" fill="url(#vpqVPGradient)"/>'+
 '<text x="28" y="29" font-family="Trebuchet MS,Arial" font-size="15" font-weight="900" fill="'+colors[2]+'">'+e(x.icon)+' '+e(compact?x.group:x.title.length>52?x.title.slice(0,49)+'…':x.title)+'</text>'+
 special+icons+'</svg>';
}
function preview(id){
 const x=lookup(id);if(!x)return '';
 return '<div class="vpqVPPreview"><div>'+art(id,0,true)+'</div><button type="button" data-vpqvp-open="'+e(id)+'">🎨 Explore interactive '+e(x.icon)+' pathway →</button></div>';
}
function gallery(filter){
 const items=all().filter(x=>!filter||x.group.toLowerCase().includes(filter.toLowerCase()));
 return '<div class="vpqVPGrid">'+items.map(x=>'<button type="button" data-vpqvp-open="'+e(x.id)+'"><span class="vpqVPTileImage">'+art(x.id,0,true)+'</span><b>'+e(x.title)+'</b><small>'+e(x.group)+'</small></button>').join('')+'</div>';
}
function open(id){
 const x=lookup(id);if(!x||!api)return;
 if(!current){previous={title:document.getElementById('modalTitle')?.textContent||'Clinic',html:api.body.innerHTML};}
 current=id;step=0;render();
}
function render(){
 const x=lookup(current);if(!x||!api)return;const s=x.steps[step];
 api.showModal('🧬 Visual Pathway · '+x.title,
 '<div class="vpqVPViewer"><div class="vpqVPBanner"><b>'+e(x.group)+'</b><p>Choose any step on the illustrated pathway. The highlighted stage explains the target, cause and clinical consequence.</p></div>'+
 art(current,step)+
 '<div class="vpqVPSteps" aria-label="Pathway steps">'+x.steps.map((q,i)=>'<button type="button" data-vpqvp-step="'+i+'" aria-pressed="'+(i===step?'true':'false')+'" '+(i===step?'class="active"':'')+'><span>'+e(q.icon)+'</span><b>'+(i+1)+'. '+e(q.title)+'</b></button>').join('')+'</div>'+
 '<section class="vpqVPFocus"><b>STEP '+(step+1)+' / 4 · '+e(s.title)+'</b><p>'+e(s.event)+'</p><div><strong>WHY this happens</strong><p>'+e(s.why)+'</p></div></section>'+
 '<div class="vpqVPCompare"><section><h3>🟢 Normal physiology</h3><p>'+e(x.normal)+'</p></section><section><h3>🔴 Toxicant or drug effect</h3><p>'+e(x.changed)+'</p></section></div>'+
 '<div class="buttonrow vpqVPControls"><button data-vpqvp-prev="1" '+(step===0?'disabled':'')+'>← Previous stage</button><button data-vpqvp-next="1" '+(step===x.steps.length-1?'disabled':'')+'>Next stage →</button><button data-vpqvp-back="1">↩ Return to lesson</button></div>'+
 '<p class="tiny">Illustrated conceptual pathway; not a clinical poisoning protocol or drug dosing guide. Use the detailed lecture and clinical cards for species/diagnostic context.</p></div>');
}
function back(){
 if(!api)return;
 if(previous){const p=previous;current=null;previous=null;api.showModal(p.title,p.html)}else{current=null;api.showModal('🧬 Illustrated Mechanism Atlas',gallery())}
}
function init(config){
 api=config;
 api.body.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 const d=b.dataset;
 if(d.vpqvpGallery!==undefined){previous=null;current=null;return api.showModal('🧬 Illustrated Pathway Atlas',gallery(d.vpqvpGallery==='all'?'':d.vpqvpGallery))}
 if(d.vpqvpOpen!==undefined)return open(d.vpqvpOpen);
 if(d.vpqvpStep!==undefined&&current){step=Math.max(0,Math.min(3,Number(d.vpqvpStep)));return render()}
 if(d.vpqvpPrev!==undefined&&current){step=Math.max(0,step-1);return render()}
 if(d.vpqvpNext!==undefined&&current){step=Math.min(3,step+1);return render()}
 if(d.vpqvpBack!==undefined)return back();
 });
 return {open,preview,gallery};
}
const style=document.createElement('style');
style.textContent='.vpqVPPreview{padding:10px;background:#fbf7ff;border:2px solid #d6c5e9;border-radius:14px;margin:12px 0}.vpqVPPreview>div{max-width:100%;overflow:hidden}.vpqVPArt{display:block;width:100%;max-height:235px;filter:drop-shadow(0 3px 3px #514e6333)}.vpqVPPreview button{width:100%;margin-top:6px;padding:10px;border-radius:10px;background:#5c568f;color:#fff;font-weight:900}.vpqVPPreview button:hover,.vpqVPPreview button:focus-visible{background:#443e75}.vpqVPBanner{background:#f2edf9;border-radius:12px;padding:12px;margin-bottom:10px}.vpqVPBanner b{color:#65478b}.vpqVPBanner p{font-size:12px;margin:5px 0}.vpqVPSteps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:10px 0}.vpqVPSteps button{display:flex;align-items:center;flex-direction:column;gap:4px;text-align:center;min-height:68px;background:#f8fbfd;border:2px solid #c9d5db;border-radius:12px;padding:8px 4px}.vpqVPSteps button span{font-size:20px}.vpqVPSteps button b{font-size:11px}.vpqVPSteps button.active{background:#eee6fa;border-color:#9275b9;color:#593c7f}.vpqVPFocus{background:#edf5ff;border-left:5px solid #6b92c0;border-radius:11px;padding:13px}.vpqVPFocus>b{color:#416189;font-size:15px}.vpqVPFocus p{font-size:13px;line-height:1.55;margin:8px 0}.vpqVPFocus>div{background:#fff;padding:8px;border-radius:9px}.vpqVPFocus strong{color:#586385}.vpqVPCompare{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:12px 0}.vpqVPCompare section{padding:12px;background:#e9f6ef;border:1px solid #a4d0b8;border-radius:12px}.vpqVPCompare section+section{background:#fff0ed;border-color:#dfb6ae}.vpqVPCompare h3{font-size:13px;margin:0 0 6px}.vpqVPCompare p{font-size:12px;line-height:1.5}.vpqVPGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}.vpqVPGrid button{text-align:left;border:2px solid #c9d3e1;background:#fff;border-radius:13px;padding:8px}.vpqVPGrid b,.vpqVPGrid small{display:block;padding:3px 5px}.vpqVPGrid b{font-size:13px}.vpqVPGrid small{font-size:11px;color:#627184}.vpqVPControls{margin:12px 0;flex-wrap:wrap}@media(max-width:550px){.vpqVPSteps{grid-template-columns:repeat(2,minmax(0,1fr))}.vpqVPCompare{grid-template-columns:1fr}.vpqVPPreview button{font-size:12px}}';
document.head.appendChild(style);
return {init,preview,gallery,open};
})();