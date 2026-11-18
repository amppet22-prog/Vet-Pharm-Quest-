/* Monday pathology exam: Necropsy gross recognition, morphologic diagnosis and histology. */
window.VPQ_PATH_EXAM7=(function(){
'use strict';
const base=window.VPQ_PATH_EXAM7_DATA||[];
const KEY='vpq-path-exam7-user-edits-v1';
let ui=null,mode='gross',filter='all',current=-1,quiz=[],step=0,revealed=false;
const h=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function edits(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function record(i){return Object.assign({},base[i],edits()[base[i].id]||{})}
function save(i,part){let d=edits();d[base[i].id]=Object.assign({},d[base[i].id]||{},part);try{localStorage.setItem(KEY,JSON.stringify(d));return true}catch(e){return false}}
function modal(title,body){if(ui)ui.showModal(title,body)}
function visible(){return base.map((v,i)=>Object.assign({index:i},record(i))).filter(x=>filter==='all'||x.lecture===filter)}
function start(k){mode=k||'gross';filter='all';menu()}
function menu(){
 const selected=visible();
 const lectures=['all',...new Set(base.map(x=>x.lecture))];
 modal('🔬 Necropsy · Monday Pathology Exam',
 '<p><b>Gross photograph → lesion description → morphologic diagnosis → histology → pathogenesis.</b> This is an exam study bank built from the uploaded lectures, with original summaries and spaces for your editable images and annotations.</p>'+
 '<div class="buttonrow"><button data-path7-mode="gross">🔎 Gross + morphologic DX</button><button data-path7-mode="histo">🔬 Histo + WHY</button><button data-path7-mode="edit">✏️ Edit atlas images</button><button data-path7-test="1">🎓 Exam unknowns</button></div>'+
 '<div class="buttonrow">'+lectures.map(l=>'<button data-path7-filter="'+h(l)+'" style="padding:6px 9px;font-size:11px" aria-pressed="'+(filter===l?'true':'false')+'">'+(l==='all'?'All lectures':'L'+h(l))+'</button>').join('')+'</div>'+
 '<p class="tiny">'+selected.length+' original lesion cases. Slide images are not copied into the public game; edit/add your own images locally.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:8px">'+selected.map(x=>'<button style="text-align:left;padding:12px" data-path7-card="'+x.index+'"><strong>'+h(x.title)+'</strong><small style="display:block">Lecture '+h(x.lecture)+'</small><small style="display:block;color:#60758a">'+(mode==='edit'?'Add image and personal notes':mode==='histo'?'Histology & explanation':'Gross ID & morphologic diagnosis')+'</small></button>').join('')+'</div>');
}
function card(i){
 current=i;const x=record(i);
 const media=x.image?'<img alt="User-provided pathology image" src="'+h(x.image)+'" style="max-width:100%;max-height:330px;object-fit:contain;border:1px solid #d8ddea;border-radius:12px">':'<div style="min-height:160px;display:grid;place-items:center;padding:16px;border:2px dashed #bbc4da;border-radius:12px;background:#fbf8ff;text-align:center">📷 Editable gross / H&E image slot</div>';
 modal('Lecture '+h(x.lecture)+' · '+h(x.title),
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px"><div>'+media+'</div><div><p><b>Gross description:</b> '+h(x.gross)+'</p>'+
 '<details '+(mode==='histo'?'open':'')+'><summary><b>Reveal morphologic diagnosis</b></summary><p>'+h(x.dx)+'</p></details>'+
 '<details '+(mode==='histo'?'open':'')+'><summary><b>Histology</b></summary><p>'+h(x.histo)+'</p></details>'+
 '<details '+(mode==='histo'?'open':'')+'><summary><b>Why it happens / distinctive clues</b></summary><p>'+h(x.why)+'</p></details>'+
 (x.notes?'<p><b>Your annotation:</b> '+h(x.notes)+'</p>':'')+
 '<p class="tiny"><b>Study source:</b> '+h(x.source)+'</p></div></div>'+
 '<div class="buttonrow"><button data-path7-edit="'+i+'">✏️ Edit image, DX, notes</button><button data-path7-back="1">← Cases</button></div>');
}
function edit(i){
 current=i;const x=record(i);
 modal('✏️ Necropsy image and notes · '+h(x.title),
 '<p>Image and annotation edits are stored in <b>your browser only</b>; they do not publish to GitHub. Keep a backup of important edits.</p>'+
 '<label>Image URL<input id="path7Url" style="width:100%" value="'+h(x.image||'')+'" placeholder="https://…"></label>'+
 '<label>Or choose a photo from your device<input id="path7File" type="file" accept="image/*"></label>'+
 '<label>Gross lesion<textarea id="path7Gross" rows="3" style="width:100%">'+h(x.gross)+'</textarea></label>'+
 '<label>Morphologic DX<textarea id="path7Dx" rows="2" style="width:100%">'+h(x.dx)+'</textarea></label>'+
 '<label>Histology<textarea id="path7Histo" rows="2" style="width:100%">'+h(x.histo)+'</textarea></label>'+
 '<label>Instructor annotations / personal clues<textarea id="path7Notes" rows="3" style="width:100%">'+h(x.notes||'')+'</textarea></label>'+
 '<div class="buttonrow"><button data-path7-save="'+i+'">💾 Save locally</button><button data-path7-view="'+i+'">Cancel</button></div>');
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
 '<p><b>Gross finding:</b> '+h(x.gross)+'</p>'+(x.image?'<img alt="User-selected gross pathology" src="'+h(x.image)+'" style="max-width:100%;max-height:280px;object-fit:contain">':'')+
 '<p><b>Write your morphologic diagnosis:</b> Organ + distribution + process, and severity when supported.</p><textarea rows="3" style="width:100%" placeholder="Think through the lesion before revealing"></textarea>'+
 (revealed?'<div class="response"><p><b>Suggested diagnosis:</b> '+h(x.dx)+'</p><p><b>Histology:</b> '+h(x.histo)+'</p><p><b>Clinical WHY:</b> '+h(x.why)+'</p></div>':'')+
 '<div class="buttonrow">'+(revealed?'<button data-path7-nextq="1">Next unknown →</button>':'<button data-path7-reveal="1">Reveal diagnosis & why</button>')+'<button data-path7-back="1">Stop</button></div>');
}
function init(api){
 ui=api;
 api.body.addEventListener('click',ev=>{
  const b=ev.target.closest('button');if(!b)return;const d=b.dataset;
  if(!Object.keys(d).some(k=>k.startsWith('path7')))return;
  ev.preventDefault();ev.stopImmediatePropagation();
  if(d.path7Mode!==undefined){mode=d.path7Mode;return menu()}
  if(d.path7Filter!==undefined){filter=d.path7Filter;return menu()}
  if(d.path7Card!==undefined){const i=Number(d.path7Card);return mode==='edit'?edit(i):card(i)}
  if(d.path7Edit!==undefined)return edit(Number(d.path7Edit));
  if(d.path7View!==undefined)return card(Number(d.path7View));
  if(d.path7Save!==undefined)return saveForm(Number(d.path7Save));
  if(d.path7Back!==undefined)return menu();
  if(d.path7Test!==undefined)return test();
  if(d.path7Reveal!==undefined){revealed=true;return question()}
  if(d.path7Nextq!==undefined){step++;revealed=false;return question()}
 },true);
}
return {init,start,cards:base};
})();
