/* Illustrated standing-character roster v1
 * New unlabelled full-body art: 22 selectable choices, sprite atlas 6x4.
 * User-owned portraits and named Alexandria/Gary IDs remain unchanged.
 */
window.VPQ_ILLUSTRATED_CHOICES=function(api){
 'use strict';
 const {gallery,getForm,getState,modalBody}=api;
 const atlas='assets/vpq-standing-art-22.webp';
 const total=22,columns=6,rows=4;
 // Lead with the most complete individual cutouts: purple-streaked woman, braided man, blonde man, red-haired man and fuller-built man.
 const galleryOrder=[17,18,19,20,21,8,9,10,11,12,13,14,15,16,0,1,2,3,4,5,6,7];
 const isArt=id=>/^standing-(?:[0-9]|1[0-9]|2[01])$/.test(id||'');
 const idx=id=>Number(String(id||'').slice(9));
 const image=(id,kind='tile')=>{
   const n=idx(id);if(!isArt(id))return '';
   const x=(n%columns)*100/(columns-1),y=Math.floor(n/columns)*100/(rows-1);
   return '<span class="vpq-art-sprite vpq-art-'+kind+'" role="img" aria-label="Illustrated full-body veterinarian option '+(n+1)+'" style="background-image:url(&quot;'+atlas+'&quot;);background-position:'+x.toFixed(5)+'% '+y.toFixed(5)+'%"></span>';
 };
 // Single source image for every state: no fabricated headshot/body pairing.
 const oldRender=gallery.renderWalking;
 gallery.renderWalking=function(p){
   if(!isArt(p?.portraitId))return oldRender(p);
   const av=document.getElementById('avatarSprite');if(!av)return;
   av.classList.add('vpq-portrait-walk');av.classList.remove('vpq-storybook-walk');av.style.background='none';
   const body=av.querySelector('.vpq-game-avatar')||(()=>{const h=document.createElement('div');h.className='vpq-game-avatar';av.appendChild(h);return h})();
   body.innerHTML=image(p.portraitId,'walk');
 };
 const oldCreator=gallery.creator;
 gallery.creator=function(){
   const f=getForm(),id=f?.elements?.portraitId?.value;
   if(!isArt(id))return oldCreator();
   const stage=document.getElementById('vpqPreviewStage');if(!stage)return;
   const pet=stage.querySelector('.vpq-preview-pet')?.outerHTML||'';
   stage.innerHTML='<div class="vpq-matched-creator"><div class="vpq-matched-frame"><small>🖼️ Selected illustration</small>'+image(id,'portrait')+'</div><div class="vpq-matched-body"><small>🚶 Standing character</small>'+image(id,'preview')+'</div></div><div class="vpq-matched-pet">'+pet+'</div>';
 };
 const oldViewer=gallery.viewer;
 gallery.viewer=function(p){
   if(!isArt(p?.portraitId))return oldViewer(p);
   const root=modalBody()?.querySelector('.vpq-avatar-showcase');if(!root)return;
   const pet=root.querySelector('.vpq-preview-pet')?.outerHTML||'';
   root.innerHTML='<div class="vpq-matched-viewer"><div class="vpq-matched-frame"><small>Selected illustration</small>'+image(p.portraitId,'portrait')+'</div><div class="vpq-matched-body"><small>Clinic character</small>'+image(p.portraitId,'viewer')+'</div></div>'+pet;
 };
 function addChoices(){
   const f=getForm();if(!f)return;
   const portraitSection=f.querySelector('[data-vpqsection="portraits"]');
   const existing=portraitSection?.querySelector('.vpq-art-select-wrap');
   if(!portraitSection||existing)return;
   const wrap=document.createElement('div');wrap.className='vpq-art-select-wrap';
   wrap.innerHTML='<h3>🐾 Choose Your Veterinarian</h3>'+
    '<p class="tiny">Each picture is linked to the same standing veterinarian you will see in the hospital. Choose a character, then save your choice below. You can still name your veterinarian and pet.</p>'+
    '<div class="vpq-art-select-grid">'+Array.from({length:total},(_,i)=>{
       const id='standing-'+galleryOrder[i];
       return '<button type="button" class="vpq-art-select-btn" data-vpqportrait="'+id+'" aria-label="Choose illustrated veterinarian '+(i+1)+'">'+image(id,'tile')+'<span>Veterinarian '+String(i+1).padStart(2,'0')+'</span></button>';
    }).join('')+'</div>';
   portraitSection.prepend(wrap);
   // The older 31-photo roster is not matched to its vector standing avatars.
   // Keep it in the form DOM for backward compatibility but hide the mismatched catalog.
   portraitSection.querySelectorAll('.vpq-roster-grid,.vpq-roster-picks,.vpq-portrait-help,.vpq-roster-note').forEach(x=>x.hidden=true);
   const prior=getState()?.portraitId||'';
   if(!isArt(prior)){
     const legacy=document.createElement('p');
     legacy.className='vpq-avatar-legacy-note';
     legacy.textContent='Your previously saved character stays selected until you choose a new matching illustration. Existing avatar progress is not deleted.';
     wrap.insertAdjacentElement('afterend',legacy);
   }
   const selected=f.elements.portraitId?.value;
   wrap.querySelectorAll('[data-vpqportrait]').forEach(b=>b.classList.toggle('chosen',b.dataset.vpqportrait===selected));
 }
 const style=document.createElement('style');
 style.textContent=
 '.vpq-art-sprite{display:block;position:relative;flex-shrink:0;overflow:hidden;background-repeat:no-repeat;background-size:600% 400%;background-color:transparent;aspect-ratio:95/197;margin:0 auto;image-rendering:auto}'+
 '.vpq-art-select-wrap{margin:18px 0 10px;padding:13px;background:#fcf8fe;border:1px solid #d7bcda;border-radius:16px}.vpq-art-select-wrap h3{margin:0 0 6px;font-size:17px}'+
 '.vpq-art-select-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(94px,1fr));gap:10px;margin:11px 0}'+
 '.vpq-art-select-btn{padding:8px 5px 7px;border:2px solid #d8bfd5;border-radius:12px;background:#fff9f7;color:#4b3a5c;display:flex;flex-direction:column;align-items:center;gap:5px;min-width:0}'+
 '.vpq-art-select-btn.chosen{border:3px solid #a064bd;background:#f2e3fa;box-shadow:0 0 0 2px #f6eafb}.vpq-art-select-btn span:not(.vpq-art-sprite){font-size:11px;font-weight:800;text-align:center}'+
 '.vpq-art-tile{width:72px;height:145px;max-width:100%}.vpq-art-portrait{height:169px;width:82px;max-width:100%;border:4px solid #d4bca5;border-radius:9px;box-shadow:0 2px 5px #302c3b40}'+
 '.vpq-art-preview,.vpq-art-viewer{width:94px;height:195px;max-width:100%}.vpq-art-walk{width:54px;height:112px;max-width:100%;position:absolute;bottom:0;left:50%;transform:translateX(-50%)}'+
 '.vpq-matched-frame:has(.vpq-art-portrait){display:flex;align-items:center}.vpq-matched-body:has(.vpq-art-preview),.vpq-matched-body:has(.vpq-art-viewer){display:flex;align-items:center}'+
 '@media(max-width:650px){.vpq-art-select-grid{grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:6px}.vpq-art-tile{width:62px;height:129px}.vpq-art-select-btn{padding:6px 3px}}';

// Keep the avatar setup simple without changing saved fields or removing pet choices.
style.textContent +=
 '.vpq-art-select-wrap{margin:8px 0 13px;padding:12px;background:#faf6ff}.vpq-art-select-grid{grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:9px}'+
 '.vpq-art-select-btn{background:#fff;transition:border-color .12s,box-shadow .12s}.vpq-art-select-btn:hover{border-color:#a480c0}.vpq-art-sprite{image-rendering:auto;filter:none;transform:translateZ(0)}'+
 '.vpq-avatar-legacy-note{font-size:12px;line-height:1.5;color:#6b5877;background:#fff4dd;border:1px solid #e9d8af;border-radius:10px;padding:9px;margin:7px 0}'+
 '#avatarForm [data-vpqsection="vet"]{display:none!important}'+
 '#avatarForm [data-vpqtab="vet"]{display:none!important}'+
 '#avatarForm .vpqStandingPresets{display:none!important}'+
 '#avatarForm [data-vpqsection="portraits"]>.vpq-roster-grid,#avatarForm [data-vpqsection="portraits"]>.vpq-roster-picks{display:none!important}'+
 '#avatarForm .vpq-art-select-wrap .vpq-art-select-btn.chosen{border-color:#8b5bb6;box-shadow:0 0 0 3px #eee0ff}'+
 '@media(max-width:600px){.vpq-art-select-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.vpq-art-select-btn{padding:6px 2px}.vpq-art-tile{max-height:130px}}';
 document.head.appendChild(style);
 return {addChoices,image,isArt,total};
};