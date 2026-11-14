/* Client-only image selection for the Clinical Pathology atlas editor.
 * Compresses and stores a private study preview. No network upload occurs.
 * For publishing, attach original images in the GitHub issue and review rights.
 */
(function(){
'use strict';
const KEY='vpq-atlas-drafts-v1';
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return {}}}
function problem(message){alert('Atlas photo: '+message)}
function current(){
 const root=document.getElementById('modalBody');
 const chosen=root?.querySelector('[data-atlas-select]');
 if(!chosen)return null;
 const id=chosen.value,old=read()[id]||{};
 const val=key=>root.querySelector('[data-atlas-field="'+key+'"]')?.value.trim()||'';
 return {id,photos:[0,1].map(i=>({...old.photos?.[i],url:val('url'+i),source:val('source'+i),credit:val('credit'+i)})),species:val('species'),note:val('note'),updated:new Date().toISOString()};
}
function persist(draft){
 const all=read();all[draft.id]=draft;
 try{localStorage.setItem(KEY,JSON.stringify(all));return true}
 catch{problem('This browser is out of space for more photos. Use smaller images or image URLs; nothing was submitted.');return false}
}
function redraw(draft){window.VPQ_ATLAS_EDITOR?.editor?.(draft.id)}
function fromFile(file,index){
 if(!file)return;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))return problem('Please choose a JPEG, PNG or WebP.');
 if(file.size>15*1024*1024)return problem('Please choose a photo under 15 MB.');
 const draft=current();if(!draft)return problem('Open the photo editor first.');
 const reader=new FileReader();
 reader.onerror=()=>problem('Could not open the selected image.');
 reader.onload=()=>{
  const img=new Image();
  img.onerror=()=>problem('The selected image could not be decoded.');
  img.onload=()=>{
   const ratio=Math.min(1,760/Math.max(img.width,img.height));
   const canvas=document.createElement('canvas');
   canvas.width=Math.max(1,Math.round(img.width*ratio));canvas.height=Math.max(1,Math.round(img.height*ratio));
   const context=canvas.getContext('2d');if(!context)return problem('Could not prepare photo preview.');
   context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(img,0,0,canvas.width,canvas.height);
   let data=canvas.toDataURL('image/jpeg',0.7);
   if(data.length>210000)data=canvas.toDataURL('image/jpeg',0.47);
   draft.photos[index]={...draft.photos[index],dataUrl:data,fileName:file.name};
   if(persist(draft))redraw(draft);
  };
  img.src=reader.result;
 };
 reader.readAsDataURL(file);
}
document.addEventListener('change',event=>{
 const input=event.target.closest?.('[data-atlas-upload]');
 if(input)fromFile(input.files?.[0],Number(input.dataset.atlasUpload));
});
document.addEventListener('click',event=>{
 const button=event.target.closest?.('[data-atlas-photo-download],[data-atlas-photo-remove]');
 if(!button)return;
 event.preventDefault();
 const index=Number(button.dataset.atlasPhotoDownload??button.dataset.atlasPhotoRemove),draft=current();
 if(!draft)return;
 const photo=draft.photos[index];if(!photo?.dataUrl)return;
 if(button.hasAttribute('data-atlas-photo-download')){
  const a=document.createElement('a');a.href=photo.dataUrl;a.download='clinpath-'+draft.id+'-'+(index+1)+'.jpg';document.body.appendChild(a);a.click();a.remove();
 }else{
  delete photo.dataUrl;delete photo.fileName;
  if(persist(draft))redraw(draft);
 }
});
})();
