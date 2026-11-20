/* Vet Pharm Quest — uploaded full-body avatar gallery.
 * Replaces legacy mismatched roster/atlas with one file per character.
 * Preserves 'roster-28' Alexandria and 'roster-29' Gary.
 */
window.VPQ_UPLOADED_AVATAR_GALLERY=function(api){
 'use strict';
 const {gallery,getForm,getState,modalBody}=api;
 const items=Array.isArray(window.VPQ_UPLOADED_AVATARS)?window.VPQ_UPLOADED_AVATARS:[];
 const byId=new Map(items.map(x=>[x.id,x]));
 const cats=['All Characters','Purple & Lavender','Blue & Navy','Teal & Green','Pink & Burgundy','Rainbow & Patterns','More Colors'];
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const url=path=>path.split('/').map(encodeURIComponent).join('/');
 const img=(id,kind)=>{const item=byId.get(id);return item?'<img class="vpq-uploaded-image vpq-uploaded-'+kind+'" src="'+escape(url(item.path))+'" alt="Full-body veterinarian illustration" loading="'+(kind==='walk'?'eager':'lazy')+'" draggable="false">':''};
 const priorWalking=gallery.renderWalking;
 gallery.renderWalking=function(p){
  if(!byId.has(p?.portraitId))return priorWalking(p);
  const av=document.getElementById('avatarSprite');if(!av)return;
  av.classList.add('vpq-portrait-walk');av.classList.remove('vpq-storybook-walk');av.style.background='none';
  const holder=av.querySelector('.vpq-game-avatar')||(()=>{const el=document.createElement('div');el.className='vpq-game-avatar';av.appendChild(el);return el})();
  holder.innerHTML=img(p.portraitId,'walk');
 };
 const priorCreator=gallery.creator;
 gallery.creator=function(){
  const f=getForm(),id=f?.elements?.portraitId?.value;
  if(!byId.has(id))return priorCreator();
  const stage=document.getElementById('vpqPreviewStage');if(!stage)return;
  const pet=stage.querySelector('.vpq-preview-pet')?.outerHTML||'';
  stage.innerHTML='<div class="vpq-uploaded-preview">'+img(id,'preview')+'</div><div class="vpq-matched-pet">'+pet+'</div>';
 };
 const priorViewer=gallery.viewer;
 gallery.viewer=function(p){
  if(!byId.has(p?.portraitId))return priorViewer(p);
  const root=modalBody()?.querySelector('.vpq-avatar-showcase');if(!root)return;
  const pet=root.querySelector('.vpq-preview-pet')?.outerHTML||'';
  root.innerHTML='<div class="vpq-uploaded-viewer">'+img(p.portraitId,'viewer')+'</div>'+pet;
 };
 function addGallery(){
  const f=getForm(),section=f?.querySelector('[data-vpqsection="portraits"]');
  if(!section||section.querySelector('#vpqUploadedGallery'))return;
  section.querySelector('.vpq-art-select-wrap')?.remove();
  section.querySelectorAll('.vpq-roster-grid,.vpq-roster-picks,.vpq-portrait-help,.vpq-roster-note,.vpq-avatar-legacy-note').forEach(x=>x.hidden=true);
  const wrap=document.createElement('section');wrap.id='vpqUploadedGallery';wrap.className='vpq-uploaded-gallery';
  wrap.innerHTML='<h3>🐾 Choose Your Veterinarian</h3>'+
   '<p class="tiny">Select a standing character by scrub color. The same illustration appears in the gallery, preview, and hospital. Alexandria and Gary are preserved.</p>'+
   '<div class="vpq-uploaded-special"><button type="button" data-vpqportrait="roster-28">🌷 Alexandria</button><button type="button" data-vpqportrait="roster-29">🧢 Gary</button></div>'+
   '<div class="vpq-uploaded-filters" role="group" aria-label="Scrub color">'+cats.map((c,i)=>'<button type="button" class="'+(i===0?'active':'')+'" data-vpqcolor="'+escape(c)+'">'+escape(c)+'</button>').join('')+'</div>'+
   '<p class="tiny" id="vpqUploadedCount"></p><div class="vpq-uploaded-grid" id="vpqUploadedGrid"></div>';
  section.prepend(wrap);
  let currentColor='All Characters';
  const draw=()=>{
   const chosen=f.elements.portraitId?.value;
   const filtered=currentColor==='All Characters'?items:items.filter(v=>v.color===currentColor);
   const grid=wrap.querySelector('#vpqUploadedGrid');
   grid.innerHTML=filtered.map((v,i)=>'<button type="button" class="vpq-uploaded-card'+(v.id===chosen?' chosen':'')+'" data-vpqportrait="'+escape(v.id)+'" aria-label="Choose veterinarian '+(i+1)+'">'+img(v.id,'tile')+'<span>Vet '+String(i+1).padStart(3,'0')+'</span></button>').join('');
   wrap.querySelector('#vpqUploadedCount').textContent=filtered.length+' characters shown';
   wrap.querySelectorAll('[data-vpqcolor]').forEach(b=>b.classList.toggle('active',b.dataset.vpqcolor===currentColor));
   wrap.querySelectorAll('.vpq-uploaded-special [data-vpqportrait]').forEach(b=>b.classList.toggle('chosen',b.dataset.vpqportrait===chosen));
  };
  wrap.addEventListener('click',e=>{
    const filter=e.target.closest('[data-vpqcolor]');
    if(filter){currentColor=filter.dataset.vpqcolor;draw();return}
    if(e.target.closest('[data-vpqportrait]'))setTimeout(draw,0);
  });
  draw();
 }
 const style=document.createElement('style');
 style.textContent=
 '.vpq-uploaded-gallery{background:#fcf8ff;padding:12px;border:1px solid #decce8;border-radius:16px;margin:8px 0 14px}.vpq-uploaded-gallery h3{margin:0 0 7px}.vpq-uploaded-special,.vpq-uploaded-filters{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.vpq-uploaded-special button,.vpq-uploaded-filters button{border:1px solid #cdb8da;border-radius:999px;background:white;padding:7px 10px;font-size:12px;color:#56416f;font-weight:700}.vpq-uploaded-filters button.active,.vpq-uploaded-special button.chosen{background:#ebd9f7;border-color:#8855ad}.vpq-uploaded-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:9px;max-height:480px;overflow-y:auto;overscroll-behavior:contain;padding:5px}.vpq-uploaded-card{min-width:0;background:white;border:2px solid #ddd0e8;border-radius:12px;padding:6px;display:flex;flex-direction:column;align-items:center;gap:5px}.vpq-uploaded-card.chosen{border-color:#8b5bb6;background:#f4e7ff}.vpq-uploaded-card span{font-size:11px;font-weight:800}.vpq-uploaded-image{display:block;object-fit:contain;object-position:center center;width:100%;height:100%;max-width:100%}.vpq-uploaded-tile{height:135px;width:100%}.vpq-uploaded-preview{min-height:225px;max-height:275px;width:100%;display:flex;justify-content:center}.vpq-uploaded-preview img{height:255px;width:auto;max-width:100%}.vpq-uploaded-viewer{height:330px;display:flex;justify-content:center}.vpq-uploaded-viewer img{height:100%;width:auto;max-width:100%}.vpq-game-avatar .vpq-uploaded-walk{position:absolute;inset:0;height:100%;width:100%;object-fit:contain;object-position:center bottom;pointer-events:none}.vpq-uploaded-gallery [hidden]{display:none!important}@media(max-width:600px){.vpq-uploaded-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.vpq-uploaded-tile{height:108px}.vpq-uploaded-gallery{padding:8px}}';
 document.head.appendChild(style);
 return {addGallery,count:items.length};
};