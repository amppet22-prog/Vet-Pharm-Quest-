window.VPQ_PATH_INLINE_PHOTOS=(function(){
'use strict';
const NAME='vpq-path-learning-images',STORE='pictures';
function db(){return new Promise((yes,no)=>{const q=indexedDB.open(NAME,1);q.onupgradeneeded=()=>q.result.createObjectStore(STORE);q.onsuccess=()=>yes(q.result);q.onerror=()=>no(q.error)})}
async function operation(k,value,mode){const d=await db();return new Promise((yes,no)=>{const tx=d.transaction(STORE,mode==='get'?'readonly':'readwrite'),store=tx.objectStore(STORE),req=mode==='get'?store.get(k):mode==='remove'?store.delete(k):store.put(value,k);req.onsuccess=()=>{yes(req.result);d.close()};req.onerror=()=>{no(req.error);d.close()}})}
const key=(l,s,i)=>l+'-'+s+'-'+i;
async function draftPhoto(l,section,slot){
 try{const rec=await operation(key(l,section,slot),null,'get');if(!rec?.blob)return '';
 return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(Error('Could not read saved draft'));reader.readAsDataURL(rec.blob)})}
 catch{return ''}
}
function card(l,s){return '<div class="np-photo-grid" data-path-images-lecture="'+l+'" data-path-images-section="'+s+'">'+[0,1].map(i=>'<div class="np-photo-cell" data-path-images-slot="'+i+'"><div class="np-photo-preview">📷 Photo '+(i+1)+' — add a lecture or textbook image</div><div class="np-photo-buttons"><label class="np-photo-upload">＋ Add / replace<input type="file" accept="image/*" data-path-image-input="'+i+'"></label><button type="button" data-path-image-remove="'+i+'" hidden>Remove</button><button type="button" data-path-image-publish="'+i+'" style="background:#e2f7ea;border-color:#8ac8a1">🚀 Publish Now</button></div><small class="np-photo-status"></small></div>').join('')+'</div>'}
const style='<style>.np-photo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:10px;margin:10px 0}.np-photo-cell{padding:8px;min-width:0;border:1px solid #cddbea;border-radius:10px;background:white}.np-photo-preview{min-height:100px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;text-align:center;background:#f1f5f9;border-radius:8px;padding:5px;color:#5d6d82;font-size:12px}.np-photo-preview img{max-width:100%;max-height:340px;object-fit:contain;border-radius:5px}.np-photo-buttons{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-top:7px}.np-photo-upload,.np-photo-buttons button{border:1px solid #b8cee4;border-radius:8px;background:#edf6ff;padding:6px 8px;color:#264a70;font-size:12px;font-weight:700;cursor:pointer}.np-photo-upload input{position:absolute;opacity:0;width:1px;height:1px}.np-photo-status{display:block;margin-top:5px;color:#527087}.np-pat p{white-space:normal;overflow-wrap:anywhere}</style>';
function show(cell,record){
 const target=cell.querySelector('.np-photo-preview'),button=cell.querySelector('[data-path-image-remove]');
 if(cell.dataset.photoUrl)URL.revokeObjectURL(cell.dataset.photoUrl);
 delete cell.dataset.photoUrl;
 const group=cell.closest('[data-path-images-lecture]'),
 id='L'+group?.dataset.pathImagesLecture+'-S'+group?.dataset.pathImagesSection+'-P'+cell.dataset.pathImagesSlot;
 const approved=window.VPQ_NECROPSY_OWNER_PUBLISH?.getLecturePhotos?.(id)||[];
 target.replaceChildren();
 if(approved.length){
  for(const p of approved){
   const figure=document.createElement('figure');figure.style.cssText='margin:4px 0 8px;padding:5px;border:1px solid #cbdbea;border-radius:8px;width:100%';
   const img=document.createElement('img');img.src=p.url;img.alt=p.caption||'Published lecture photo';img.loading='lazy';figure.appendChild(img);
   const cap=document.createElement('figcaption');cap.textContent='✓ '+(p.type||'Photo')+': '+(p.caption||'Owner-published');cap.style.fontSize='11px';figure.appendChild(cap);
   target.appendChild(figure);
  }
 }
 if(record?.blob){
  const url=URL.createObjectURL(record.blob);cell.dataset.photoUrl=url;
  const title=document.createElement('small');title.textContent='Local draft (not published)';target.appendChild(title);
  const img=document.createElement('img');img.src=url;img.alt='Local draft photo';target.appendChild(img);
  const caption=document.createElement('small');caption.textContent=record.name||'Local upload';target.appendChild(caption);
  button.hidden=false;
 }else{
  button.hidden=true;
  if(!approved.length)target.textContent='📷 Add your lecture or textbook photo';
 }
}
async function hydrate(root,l){for(const cell of root.querySelectorAll('[data-path-images-lecture="'+l+'"] .np-photo-cell')){const g=cell.closest('[data-path-images-section]');try{const image=await operation(key(l,g.dataset.pathImagesSection,cell.dataset.pathImagesSlot),null,'get');if(cell.isConnected)show(cell,image)}catch(e){cell.querySelector('.np-photo-status').textContent='Local storage unavailable.'}}}
function reduce(file){return new Promise((yes,no)=>{const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{try{const scale=Math.min(1,1600/Math.max(img.width,img.height)),can=document.createElement('canvas');can.width=Math.max(1,Math.round(img.width*scale));can.height=Math.max(1,Math.round(img.height*scale));can.getContext('2d').drawImage(img,0,0,can.width,can.height);can.toBlob(blob=>{URL.revokeObjectURL(url);blob?yes(blob):no(Error('Cannot save image'))},'image/jpeg',0.84)}catch(e){URL.revokeObjectURL(url);no(e)}};img.onerror=()=>{URL.revokeObjectURL(url);no(Error('Cannot read image'))};img.src=url})}
async function upload(input){const cell=input.closest('.np-photo-cell'),g=input.closest('[data-path-images-lecture]'),f=input.files&&input.files[0];if(!cell||!g||!f)return;const msg=cell.querySelector('.np-photo-status');msg.textContent='Saving…';try{const blob=await reduce(f),rec={blob,name:f.name};await operation(key(g.dataset.pathImagesLecture,g.dataset.pathImagesSection,cell.dataset.pathImagesSlot),rec,'put');if(cell.isConnected){show(cell,rec);msg.textContent='Saved on this device.'}}catch(e){msg.textContent='Save failed: '+e.message}input.value=''}
async function remove(button){const cell=button.closest('.np-photo-cell'),g=button.closest('[data-path-images-lecture]');if(!cell||!g)return;try{await operation(key(g.dataset.pathImagesLecture,g.dataset.pathImagesSection,cell.dataset.pathImagesSlot),null,'remove');if(cell.isConnected){show(cell,null);cell.querySelector('.np-photo-status').textContent='Removed.'}}catch(e){cell.querySelector('.np-photo-status').textContent='Could not remove photo.'}}
return{card,style,hydrate,upload,remove,draftPhoto};
})();