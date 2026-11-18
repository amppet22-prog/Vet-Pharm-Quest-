/* Private in-browser lecture PDF slide viewer.
 * Original lecture PDFs remain on the learner's device (IndexedDB); do not upload to GitHub.
 * Uses PDF.js for canvas rendering; supports displaying exact course-slide figures in study lessons.
 */
window.VPQ_PATH_SLIDES=(function(){
'use strict';
const DB='vpq-private-pathology-pdfs-v1', STORE='lecturePDFs';
let cache=new Map(), viewers=new Map(), inFlight=new Map();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function db(){return new Promise((res,rej)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error)})}
async function stored(key){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readonly'),q=tx.objectStore(STORE).get(key);q.onsuccess=()=>{res(q.result);d.close()};q.onerror=()=>{rej(q.error);d.close()}})}
async function persist(key,blob){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readwrite');tx.objectStore(STORE).put(blob,key);tx.oncomplete=()=>{res();d.close()};tx.onerror=()=>{rej(tx.error);d.close()}})}
async function remove(key){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(key);tx.oncomplete=()=>{res();d.close()};tx.onerror=()=>{rej(tx.error);d.close()}})}
async function pdfFor(lecture){
 if(cache.has(lecture))return cache.get(lecture);
 if(inFlight.has(lecture))return inFlight.get(lecture);
 const task=(async()=>{
   const blob=cache.get('BLOB-'+lecture)||await stored('L'+lecture);if(!blob)return null;
   if(!window.pdfjsLib)throw Error('PDF preview library did not load. Refresh while online.');
   window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
   const bytes=await blob.arrayBuffer();
   const pdf=await window.pdfjsLib.getDocument({data:new Uint8Array(bytes)}).promise;
   cache.set(lecture,pdf);return pdf;
 })().finally(()=>inFlight.delete(lecture));inFlight.set(lecture,task);return task;
}
const pageMap={'BOOK':[1], '67':[5,8,15,16,20,21,25,27,28,30,32,34,35,39,43],
'68':[2,5,6,7,8,10,13,17,22,27,33,40],
'69':[2,5,8,10,15,20,25,30,35,40,45,50],
'70':[2,5,9,12,15,19,23,27],
'71':[2,5,7,11,14,20,28,35,43,52],
'72':[2,5,9,13,18,25,32,40],
'73':[2,5,8,13,18,23,30,36],
'74':[2,4,8,14,20,27,34,41,49],
'75':[2,4,8,13,18,24,31,36],
'76':[2,4,10,15,22,30,38,45],
'77':[2,5,9,14,20,27],
'78':[2,5,9,15,22,29,36,43,51],
'79':[2,4,7,9,12,15,18,21]};
function slide(lecture,i,start){const p=pageMap[lecture]?.[i]||start||2;return '<div class="np-slide-view" data-npslideview="'+esc(lecture)+'" data-nppage="'+p+'" style="padding:10px;border:1px solid #b3cadf;border-radius:11px;background:#f7fbff;margin:12px 0;max-width:100%;min-width:0"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><b style="font-size:12px">📷 Original lecture slide photograph</b><span style="font-size:11px;color:#526778">Private on this device</span></div><div class="np-slide-state" style="font-size:12px;margin:7px 0">Select the original lecture PDF above to show the actual slide here.</div><div class="np-slide-controls" style="display:none;gap:5px;align-items:center;flex-wrap:wrap"><button data-npslideprev="1" type="button" style="font-size:12px;padding:5px 8px">◀</button><label style="font-size:12px">Slide <input class="np-slide-pagenum" type="number" min="1" value="'+p+'" style="width:65px;font-size:12px"></label><button data-npslidenext="1" type="button" style="font-size:12px;padding:5px 8px">▶</button><button data-npslidezoom="1" type="button" style="font-size:12px;padding:5px 8px">Zoom</button></div><canvas class="np-slide-canvas" style="display:none;max-width:100%;height:auto;margin:8px auto 0;border-radius:8px;border:1px solid #dde4ed"></canvas><p style="font-size:11px;margin:5px 0">Use the arrows to move to adjacent slides. Textbook figures may be opened separately using your own textbook PDF.</p></div>'}
function uploader(lecture){const book=lecture==='BOOK';return '<div data-nppdfuploader="'+esc(lecture)+'" style="background:#fff;border:1px solid #b3cadf;border-radius:12px;padding:12px;margin:12px 0"><b>📚 View your actual course images</b><p style="font-size:12px;line-height:1.5;margin:5px 0">Choose your '+(book?'pathology textbook':'professor’s Lecture '+esc(lecture))+' PDF from your computer. The game displays original figures here without uploading the file to GitHub. Large textbook files might not fit in browser storage.</p><label style="font-size:12px">'+(book?'Choose textbook PDF':'Choose Lecture '+esc(lecture)+' PDF')+' <input type="file" accept="application/pdf,.pdf" data-nplecturepdf="'+esc(lecture)+'" style="max-width:100%;font-size:12px"></label><div class="np-slide-uploadstatus" style="font-size:12px;margin:7px 0"></div><button type="button" data-npdeletepdf="'+esc(lecture)+'" style="font-size:11px;padding:5px 8px">Remove saved PDF</button></div>'}
async function renderOne(el,pdf){
 if(!el.isConnected||!pdf)return;
 let page=Math.max(1,Math.min(pdf.numPages,Number(el.dataset.nppage)||1));
 el.dataset.nppage=page;
 const input=el.querySelector('.np-slide-pagenum');if(input){input.value=page;input.max=pdf.numPages}
 const label=el.querySelector('.np-slide-state');label.textContent='Lecture slide '+page+' / '+pdf.numPages;
 const controls=el.querySelector('.np-slide-controls');controls.style.display='flex';
 const canv=el.querySelector('canvas');canv.style.display='block';
 const req=String(page),token=(Number(el.dataset.renderToken||0)+1);el.dataset.renderToken=String(token);
 try{
  const pg=await pdf.getPage(page);if(!el.isConnected||el.dataset.renderToken!==String(token))return;
  const width=Math.min(780,Math.max(260,el.clientWidth-22||500));
  const unscaled=pg.getViewport({scale:1});const scale=width/unscaled.width;
  const view=pg.getViewport({scale});const dpi=Math.min(2,window.devicePixelRatio||1);
  canv.width=Math.round(view.width*dpi);canv.height=Math.round(view.height*dpi);
  canv.style.width=Math.round(view.width)+'px';canv.style.height=Math.round(view.height)+'px';
  await pg.render({canvasContext:canv.getContext('2d'),viewport:pg.getViewport({scale:scale*dpi})}).promise;
 }catch(e){label.textContent='Could not display this PDF page: '+e.message}
}
async function hydrate(root,lecture){
 const holder=root.querySelector('[data-nppdfuploader="'+lecture+'"] .np-slide-uploadstatus');
 try{
  const pdf=await pdfFor(lecture);
  if(!root.isConnected)return;
  if(holder)holder.textContent=pdf?'✓ Original Lecture '+lecture+' PDF available in this browser ('+pdf.numPages+' pages)':'No source PDF selected yet.';
  if(!pdf)return;
  const views=Array.from(root.querySelectorAll('[data-npslideview="'+lecture+'"]'));
  for(const v of views)await renderOne(v,pdf);
 }catch(e){if(holder)holder.textContent='Preview unavailable: '+e.message}
}
async function fileSelected(root,input){
 const lecture=input.dataset.nplecturepdf,file=input.files?.[0];if(!file)return;
 const status=root.querySelector('[data-nppdfuploader="'+lecture+'"] .np-slide-uploadstatus');if(file.type!=='application/pdf'&&!file.name.toLowerCase().endsWith('.pdf')){status.textContent='Please choose a PDF.';return}
 status.textContent='Reading local PDF…';
 try{if(file.size>55*1024*1024){cache.set('BLOB-'+lecture,file);status.textContent='Large PDF loaded for this visit (not saved between visits).'}else await persist('L'+lecture,file);const old=cache.get(lecture);if(old)await old.destroy();cache.delete(lecture);await hydrate(root,lecture)}
 catch(e){status.textContent='Unable to save/read this PDF: '+e.message}
}
async function clicked(root,button){
 if(button.dataset.npdeletepdf!==undefined){
  const l=button.dataset.npdeletepdf;await remove('L'+l);const old=cache.get(l);if(old)await old.destroy();cache.delete(l);cache.delete('BLOB-'+l);
  root.querySelectorAll('[data-npslideview="'+l+'"]').forEach(el=>{el.querySelector('.np-slide-state').textContent='No private lecture PDF selected.';el.querySelector('.np-slide-controls').style.display='none';el.querySelector('canvas').style.display='none'});
  const status=root.querySelector('[data-nppdfuploader="'+l+'"] .np-slide-uploadstatus');if(status)status.textContent='Removed the saved PDF from this browser.';return;
 }
 const v=button.closest('[data-npslideview]');if(!v)return;
 const lecture=v.dataset.npslideview,pdf=await pdfFor(lecture);if(!pdf)return;
 const cur=Number(v.dataset.nppage)||1;
 if(button.dataset.npslideprev!==undefined)v.dataset.nppage=String(Math.max(1,cur-1));
 else if(button.dataset.npslidenext!==undefined)v.dataset.nppage=String(Math.min(pdf.numPages,cur+1));
 else if(button.dataset.npslidezoom!==undefined){const canvas=v.querySelector('canvas');if(canvas?.toDataURL){const w=window.open('','_blank');if(w){w.document.write('<title>Lecture '+esc(lecture)+' slide '+cur+'</title><img style="max-width:100%" src="'+canvas.toDataURL('image/png')+'">');w.document.close()}return}}
 await renderOne(v,pdf);
}
async function pageChanged(input){const v=input.closest('[data-npslideview]');if(!v)return;v.dataset.nppage=String(Number(input.value)||1);const pdf=await pdfFor(v.dataset.npslideview);if(pdf)await renderOne(v,pdf)}
return{uploader,slide,hydrate,fileSelected,clicked,pageChanged};
})();
