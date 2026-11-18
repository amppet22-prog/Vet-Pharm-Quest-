/* Monday pathology exam: Necropsy gross recognition, morphologic diagnosis and histology. */
window.VPQ_PATH_EXAM7=(function(){
'use strict';
const base=window.VPQ_PATH_EXAM7_DATA||[];
const KEY='vpq-path-exam7-user-edits-v1';
let ui=null,mode='gross',filter='all',search='',current=-1,quiz=[],step=0,revealed=false;
const rich=s=>window.VPQ_PATH_RICH_TEXT?.render?.(s)||h(s);
const h=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function edits(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function record(i){const src=base[i],official=window.VPQ_NECROPSY_OWNER_PUBLISH?.getSpecimen?.(src.id)||{},draft=edits()[src.id]||{};const entry=Object.assign({},src,official.text||{},draft);const photos=official.photos?.length?official.photos:(official.photo?.url?[official.photo]:[]);if(photos.length)entry.image=photos[0].url;return entry}
function save(i,part){let d=edits();d[base[i].id]=Object.assign({},d[base[i].id]||{},part);try{localStorage.setItem(KEY,JSON.stringify(d));return true}catch(e){return false}}
function modal(title,body){if(ui)ui.showModal(title,body)}
function visible(){return base.map((v,i)=>Object.assign({index:i},record(i))).filter(x=>(filter==='all'||x.lecture===filter)&&(!search||[x.title,x.lecture,x.gross,x.histo,x.why].join(' ').toLowerCase().includes(search)))}
function start(k){mode=k||'gross';filter='all';menu()}
function menu(){
 const selected=visible();
 const lectures=['all',...new Set(base.map(x=>x.lecture))];
 modal('🔬 Necropsy · Monday Pathology Exam',
 '<p><b>Gross photograph → lesion description → morphologic diagnosis → histology → pathogenesis.</b> This is an exam study bank built from the uploaded lectures, with original summaries and spaces for your editable images and annotations.</p>'+
 '<div class="buttonrow"><button data-path7-differentials="1" style="background:#e0f3ed;border:2px solid #8ebea8;font-weight:850">🧩 Differential Case Center · Signalment → Histo → Etiology</button></div>'+ 
 '<div class="buttonrow"><button data-path7-library="1">📷 Browse published photos by lecture / system</button></div>'+ 
 '<div class="buttonrow"><button data-path7-mode="gross">🔎 Gross + morphologic DX</button><button data-path7-mode="histo">🔬 Histo + WHY</button><button data-path7-mode="edit">✏️ Edit atlas images</button><button data-path7-test="1">🎓 Exam unknowns</button></div>'+
 '<div class="buttonrow">'+lectures.map(l=>'<button data-path7-filter="'+h(l)+'" style="padding:6px 9px;font-size:11px" aria-pressed="'+(filter===l?'true':'false')+'">'+(l==='all'?'All lectures':'L'+h(l))+'</button>').join('')+'</div>'+
 '<p class="tiny"><b>'+selected.length+' of '+base.length+' slide-linked lesion / recognition cards.</b> Slide images are not copied into the public game; add your own locally.</p>'+ 
 '<label style="display:block;margin:8px 0">Find disease or lesion <input id="path7Search" data-path7-search="1" placeholder="e.g. pyometra, optic nerve, granuloma" value="'+h(search)+'" style="width:min(100%,430px);padding:9px;border:1px solid #bccbe0;border-radius:9px"></label>'+ 
 '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:8px">'+selected.map(x=>'<button style="text-align:left;padding:12px" data-path7-card="'+x.index+'"><strong>'+h(x.title)+'</strong><small style="display:block">Lecture '+h(x.lecture)+'</small><small style="display:block;color:#60758a">'+(mode==='edit'?'Add image and personal notes':mode==='histo'?'Histology & explanation':'Gross ID & morphologic diagnosis')+'</small></button>').join('')+'</div>');
}
function card(i){
 current=i;const x=record(i);
 const gallery=window.VPQ_NECROPSY_OWNER_PUBLISH?.specimenPhotoHTML?.(x.id)||'';
 const media=gallery|| (x.image?'<img alt="Local pathology image" src="'+h(x.image)+'" style="max-width:100%;max-height:330px;object-fit:contain;border:1px solid #d8ddea;border-radius:12px">':'<div style="min-height:160px;display:grid;place-items:center;padding:16px;border:2px dashed #bbc4da;border-radius:12px;background:#fbf8ff;text-align:center">📷 Editable gross / H&E image slot</div>');
 modal('Lecture '+h(x.lecture)+' · '+h(x.title),
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px"><div>'+media+'</div><div><p><b>Gross description:</b> '+rich(x.gross)+' <button type="button" data-path7-why="gross" aria-label="Explain gross findings" title="Why does the lesion look this way?">?</button></p>'+
 '<details '+(mode==='histo'?'open':'')+'><summary><b>Reveal morphologic diagnosis</b> ❔</summary><p>'+rich(x.dx)+'</p></details>'+
 '<details '+(mode==='histo'?'open':'')+'><summary><b>Histology</b> ❔</summary><p>'+rich(x.histo)+'</p></details>'+
 '<details '+(mode==='histo'?'open':'')+'><summary><b>Why it happens / distinctive clues</b> ❔</summary><p>'+rich(x.why)+'</p></details>'+
 (x.notes?'<p><b>Your annotation:</b> '+rich(x.notes)+'</p>':'')+
 '<p class="tiny"><b>Study source:</b> '+h(x.source)+'</p></div></div>'+
 '<div class="buttonrow"><button data-path7-why="histo">❔ Histology & WHY</button><button data-path7-why="compare">❔ What distinguishes it?</button></div>'+ 
 '<div class="buttonrow"><button data-path7-edit="'+i+'">✏️ Edit image, DX, notes</button><button data-path7-owner-publish="'+i+'">🚀 Publish photo now</button><button data-path7-back="1">← Cases</button></div>');
}
function edit(i){
 current=i;const x=record(i);
 modal('✏️ Necropsy image and notes · '+h(x.title),
 '<p>Save Draft keeps your photo and annotations in this browser. To make a photo visible on every device, select <b>🚀 Publish photo now</b> after saving the draft. The public publishing step is owner-authorized.</p>'+
 '<label>Image URL<input id="path7Url" style="width:100%" value="'+h(x.image||'')+'" placeholder="https://…"></label>'+
 '<label>Or choose a photo from your device<input id="path7File" type="file" accept="image/*"></label>'+
 '<label>Gross lesion<textarea id="path7Gross" rows="3" style="width:100%">'+h(x.gross)+'</textarea></label>'+
 '<label>Morphologic DX<textarea id="path7Dx" rows="2" style="width:100%">'+h(x.dx)+'</textarea></label>'+
 '<label>Histology<textarea id="path7Histo" rows="2" style="width:100%">'+h(x.histo)+'</textarea></label>'+
 '<label>Instructor annotations / personal clues<textarea id="path7Notes" rows="3" style="width:100%">'+h(x.notes||'')+'</textarea></label>'+
 '<div class="buttonrow"><button data-path7-save="'+i+'">💾 Save Draft</button><button data-path7-owner-publish="'+i+'">🚀 Publish photo now</button><button data-path7-view="'+i+'">Cancel</button></div>');
}
function saveForm(i){
 const val=n=>ui.body.querySelector('#'+n)?.value||'';
 const part={image:val('path7Url').trim(),gross:val('path7Gross'),dx:val('path7Dx'),histo:val('path7Histo'),notes:val('path7Notes')};
 const finish=()=>{if(save(i,part))card(i);else modal('Local storage full','<p>This image is too large for your browser storage. Try a smaller image or a URL.</p><button data-path7-edit="'+i+'">Back to editor</button>')};
 const file=ui.body.querySelector('#path7File')?.files?.[0];
 if(!file)return finish();
 if(!file.type.startsWith('image/'))return;
 const reader=new FileReader();
 reader.onload=()=>{const img=new Image();img.onload=()=>{const factor=Math.min(1,700/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*factor));canvas.height=Math.max(1,Math.round(img.height*factor));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);part.image=canvas.toDataURL('image/jpeg',0.67);finish()};img.src=String(reader.result)};
 reader.readAsDataURL(file);
}
function test(){
 quiz=visible().sort(()=>Math.random()-.5).slice(0,12);step=0;revealed=false;question();
}
function question(){
 if(step>=quiz.length){modal('Practice completed','<p>Reviewed '+quiz.length+' lesion unknowns. Try again for additional cases.</p><button data-path7-back="1">Back to atlas</button>');return}
 const x=quiz[step];
 modal('🎓 Necropsy unknown '+(step+1)+' / '+quiz.length,
 '<p><b>Gross finding:</b> '+rich(x.gross)+'</p>'+(x.image?'<img alt="User-selected gross pathology" src="'+h(x.image)+'" style="max-width:100%;max-height:280px;object-fit:contain">':'')+
 '<p><b>Write your morphologic diagnosis:</b> Organ + distribution + process, and severity when supported.</p><textarea rows="3" style="width:100%" placeholder="Think through the lesion before revealing"></textarea>'+
 (revealed?'<div class="response"><p><b>Suggested diagnosis:</b> '+rich(x.dx)+'</p><p><b>Histology:</b> '+rich(x.histo)+'</p><p><b>Clinical WHY:</b> '+rich(x.why)+'</p></div>':'')+
 '<div class="buttonrow">'+(revealed?'<button data-path7-nextq="1">Next unknown →</button>':'<button data-path7-reveal="1">Reveal diagnosis & why</button>')+'<button data-path7-back="1">Stop</button></div>');
}
function init(api){
 ui=api;
 window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.init(api);
 window.VPQ_NECROPSY_OWNER_PUBLISH?.init(api);
 api.body.addEventListener('change',ev=>{if(ev.target?.dataset?.path7Search!==undefined){search=String(ev.target.value||'').toLowerCase().trim();menu()}},true);
 api.body.addEventListener('click',ev=>{
  const b=ev.target.closest('button');if(!b)return;const d=b.dataset;
  if(!Object.keys(d).some(k=>k.startsWith('path7')))return;
  ev.preventDefault();ev.stopImmediatePropagation();
  if(d.path7Why!==undefined){
  if(current<0||current>=base.length)return;
  const x=record(current),topic=d.path7Why;
  const sections=topic==='gross'
   ?'<p><b>Gross appearance:</b> '+rich(x.gross)+'</p><p><b>Why it appears:</b> '+rich(x.why)+'</p>'
   :topic==='histo'
   ?'<p><b>Microscopic lesion:</b> '+rich(x.histo)+'</p><p><b>Mechanism / why:</b> '+rich(x.why)+'</p><p><b>Morphologic diagnosis:</b> '+rich(x.dx)+'</p>'
   :'<p><b>Key distinction:</b> '+rich(x.why)+'</p><p><b>Use these findings:</b> '+rich(x.gross)+'</p><p><b>Histology:</b> '+rich(x.histo)+'</p>';
  modal('❔ '+h(x.title)+' · '+(topic==='gross'?'Why gross looks this way':topic==='histo'?'Microscopy and mechanism':'Distinguishing clues'),sections+'<p class="tiny">Drawn from this existing study card. Confirm specific interpretations with the lecture slides.</p><button data-path7-view="'+current+'">← Return to specimen</button>');return;
 }
 if(d.path7Library!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.photoLibrary?.();
 if(d.path7Differentials!==undefined)return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.start(ui,filter);
 if(d.path7Mode!==undefined){mode=d.path7Mode;return menu()}
  if(d.path7Filter!==undefined){filter=d.path7Filter;return menu()}
  if(d.path7Card!==undefined){const i=Number(d.path7Card);return mode==='edit'?edit(i):card(i)}
  if(d.path7Edit!==undefined)return edit(Number(d.path7Edit));
  if(d.path7View!==undefined)return card(Number(d.path7View));
  if(d.path7Save!==undefined)return saveForm(Number(d.path7Save));
  if(d.path7OwnerPublish!==undefined){const i=Number(d.path7OwnerPublish);
   const field=api.body.querySelector('#path7Gross');
   if(field){const val=n=>api.body.querySelector('#'+n)?.value||'';
    save(i,{gross:val('path7Gross'),dx:val('path7Dx'),histo:val('path7Histo'),notes:val('path7Notes')});}
   return window.VPQ_NECROPSY_OWNER_PUBLISH?.editor('specimen',base[i]?.id)
  }
  if(d.path7Back!==undefined)return menu();
  if(d.path7Test!==undefined)return test();
  if(d.path7Reveal!==undefined){revealed=true;return question()}
  if(d.path7Nextq!==undefined){step++;revealed=false;return question()}
 },true);
}
function openCard(id){const i=base.findIndex(x=>x.id===id);return i>=0?card(i):menu()}
function draftPhoto(id){const d=edits()[id];return String(d?.image||'').startsWith('data:image/jpeg;base64,')?d.image:''}
function draftText(id){const d=edits()[id]||{};return Object.fromEntries(['gross','dx','histo','why','notes'].filter(k=>Object.prototype.hasOwnProperty.call(d,k)).map(k=>[k,d[k]]))}
function afterPublished(id){const all=edits();if(!all[id])return;for(const k of ['gross','dx','histo','why','notes'])delete all[id][k];try{localStorage.setItem(KEY,JSON.stringify(all))}catch(e){}}
return {init,start,cards:base,openCard,draftPhoto,draftText,afterPublished};
})();
