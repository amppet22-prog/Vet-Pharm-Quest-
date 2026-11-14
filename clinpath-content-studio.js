/* Vet Pharm Quest Content Studio — Cell Recognition editor.
 * Shared owner-publish identity; drafts are private to this browser.
 * All published content overlays original educational references.
 */
window.VPQ_CONTENT_STUDIO=(function(){
'use strict';
const KEY='vpq-cell-reference-drafts-v1',SPECIES=['Dog','Cat','Horse','Cattle','Sheep','Goat','Pig','Bird','Rabbit','Other'];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const safeUrl=v=>{try{const u=new URL(String(v||''));return u.protocol==='https:'?u.href:''}catch{return ''}};
let api=null,current=null,pending=null;
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch{return {}}}
function write(x){try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch{return false}}
function originals(){return window.VPQ_BLOOD_SMEAR_LAB?.cells||[]}
function official(id){return window.VPQ_ATLAS_PUBLISHER?.get?.('cell-'+id)||null}
function published(){return Object.entries(window.VPQ_ATLAS_PUBLISHER?.all?.()||{}).filter(([id])=>id.startsWith('cell-')).map(([id,x])=>({...x,id:id.slice(5)}))}
function records(showDraft=true){
 const base=originals().map(x=>({...x}));
 for(const item of published()){const i=base.findIndex(x=>x.id===item.id);if(i>=0)base[i]={...base[i],...item};else base.push(item)}
 if(showDraft)for(const item of Object.values(read())){if(!item?.id)continue;const i=base.findIndex(x=>x.id===item.id);if(i>=0)base[i]={...base[i],...item,_draft:true};else base.push({...item,_draft:true})}
 return base;
}
function get(id,showDraft=true){return records(showDraft).find(x=>x.id===id)||null}
function photo(id,showDraft=true){
 const p=get(id,showDraft)?.photos?.find(x=>x?.dataUrl||x?.url);
 return p||null;
}
function originalSpecies(description){return window.VPQ_ATLAS_EDITOR?.fromLegacySpecies?.(description)||['Dog']}
function editing(id){
 current=id;
 const live=get(id),existing=originals().find(x=>x.id===id)||{},d=read()[id]||{},entry={...existing,...official(id),...d};
 if(!live&&!entry.name)return;
 const basePhoto=window.VPQ_BLOOD_SMEAR_LAB?.realCellPhotos?.[id];
 if(!entry.photos?.some(p=>p?.dataUrl||p?.url)&&basePhoto)entry.photos=[{url:basePhoto[0],source:basePhoto[1],credit:basePhoto[2],originalPhoto:false}];
 const tags=Array.isArray(entry.speciesTags)?entry.speciesTags:originalSpecies(entry.species);
 const evidence=entry.speciesEvidence||{};
 const opts=SPECIES.map(s=>'<label style="display:inline-flex;gap:5px;margin:3px;padding:6px;border:1px solid #b8c9db;border-radius:9px"><input type="checkbox" data-cell-species="'+esc(s)+'" '+(tags.includes(s)?'checked':'')+'>'+esc(s)+'</label>').join('');
 const speciesDocs=SPECIES.map(s=>'<div data-cell-species-panel="'+esc(s)+'" style="'+(tags.includes(s)?'':'display:none;')+'padding:6px;border-bottom:1px solid #dbe5f0"><b>'+esc(s)+'</b><label>Clinical relevance and identification in this species</label><textarea data-cell-evidence="'+esc(s)+'" rows="2" style="width:100%">'+esc(evidence[s]?.why||'')+'</textarea><label>Source page for species (optional for your own observations)</label><input data-cell-source="'+esc(s)+'" type="url" style="width:100%" value="'+esc(evidence[s]?.source||'')+'"></div>').join('');
 const photoFields=[0,1].map(i=>{const p=entry.photos?.[i]||{};return '<fieldset style="margin:10px 0;border:1px solid #cbd8e5;padding:10px;border-radius:12px"><legend>Photo '+(i+1)+'</legend><label>Upload photo from computer</label><input type="file" accept="image/jpeg,image/png,image/webp" data-cell-upload="'+i+'" style="width:100%;margin:5px 0"><label>Or direct image URL</label><input data-cell-photo-url="'+i+'" type="url" style="width:100%" value="'+esc(p.url||'')+'"><label style="display:block;margin:8px 0"><input data-cell-original="'+i+'" type="checkbox" '+(p.originalPhoto?'checked':'')+'> My original photograph / I own reuse rights</label><label>Credit or permission</label><input data-cell-credit="'+i+'" style="width:100%" value="'+esc(p.credit||'')+'"><label>External source URL (optional for owned photos)</label><input data-cell-photo-source="'+i+'" type="url" style="width:100%" value="'+esc(p.source||'')+'">'+(p.dataUrl||p.url?'<img alt="Photo preview" src="'+esc(p.dataUrl||p.url)+'" style="width:100%;max-height:180px;object-fit:contain;margin-top:8px">':'')+'</fieldset>'}).join('');
 const groupOptions=['White cells','Red cells','Platelets','Artifacts','Other'];
 const html='<p><b>Personal draft</b> — changes are saved only on this device until published. Editing existing content does not erase the original cards or questions.</p>'+
 '<div style="position:sticky;top:0;background:#eef5ff;padding:8px;z-index:3;border:1px solid #c9d9ed;border-radius:9px"><button data-cell-save="1">💾 Save Draft</button> <button data-cell-publish-open="1">🚀 Publish Now · Owner</button> <button data-cell-review="1">📨 Request Review</button><p data-cell-status="1" style="font-size:12px;margin:5px 0" role="status" aria-live="polite"></p></div>'+
 '<p><label>Finding / cell name</label><input data-cell-field="name" style="width:100%" value="'+esc(entry.name||'')+'"></p>'+
 '<p><label>Category</label><select data-cell-field="group" style="width:100%">'+groupOptions.map(g=>'<option '+(entry.group===g?'selected':'')+'>'+g+'</option>').join('')+'</select></p>'+
 [['look','Appearance — what to identify'],['meaning','Clinical meaning'],['why','WHY and physiology / mechanism'],['note','Additional teaching notes and comparisons']].map(([k,label])=>'<p><label>'+label+'</label><textarea data-cell-field="'+k+'" rows="3" style="width:100%">'+esc(entry[k]||'')+'</textarea></p>').join('')+
 '<fieldset style="border:1px solid #b9cee2;padding:9px;border-radius:12px"><legend><b>Applicable species — use these to filter</b></legend><p class="tiny">Select every species where the finding is recognized; add why it applies and a source when expanding species coverage.</p>'+opts+speciesDocs+'</fieldset>'+
 photoFields+'<button data-cell-back="1">← Cell Recognition Reference</button>';
 api.showModal('✏️ Edit Cell Recognition — '+(entry.name||'New finding'),html);
}
function addNew(){
 const name=prompt('New cell or morphology finding name:');if(!name?.trim())return;
 const slug=name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48);
 if(!slug)return;const id='custom-'+slug;
 if(get(id)){return editing(id)}
 const all=read();all[id]={id,name:name.trim(),group:'Other',look:'',meaning:'',why:'',note:'',species:'Dog',speciesTags:['Dog'],speciesEvidence:{},photos:[]};
 if(!write(all)){alert('Unable to create local draft. Check browser storage.');return}editing(id);
}
function collect(){
 if(!current)throw Error('Select a cell finding first.');
 const root=api.body,el=k=>root.querySelector(k),val=k=>el(k)?.value.trim()||'';
 const entry={id:current,photos:[],speciesEvidence:{},updated:new Date().toISOString()};
 for(const k of ['name','group','look','meaning','why','note'])entry[k]=val('[data-cell-field="'+k+'"]');
 if(!entry.name)throw Error('Enter a cell finding name.');
 entry.speciesTags=SPECIES.filter(s=>el('[data-cell-species="'+s+'"]')?.checked);
 if(!entry.speciesTags.length)throw Error('Select at least one applicable species.');
 entry.species=entry.speciesTags.join(', ');
 for(const s of entry.speciesTags)entry.speciesEvidence[s]={why:val('[data-cell-evidence="'+s+'"]'),source:val('[data-cell-source="'+s+'"]')};
 const stored=read()[current];
 for(let i=0;i<2;i++){
  const old=stored?.photos?.[i]||{},url=val('[data-cell-photo-url="'+i+'"]'),source=val('[data-cell-photo-source="'+i+'"]'),credit=val('[data-cell-credit="'+i+'"]');
  if(url&&!safeUrl(url))throw Error('Photo '+(i+1)+' needs an HTTPS image URL.');
  if(source&&!safeUrl(source))throw Error('Photo '+(i+1)+' needs a valid HTTPS source URL.');
  entry.photos.push({url,source,credit,originalPhoto:!!el('[data-cell-original="'+i+'"]')?.checked,dataUrl:old.dataUrl||'',fileName:old.fileName||''});
 }
 return entry;
}
function status(message,bad=false){api.body.querySelectorAll('[data-cell-status]').forEach(x=>{x.textContent=message;x.style.color=bad?'#b1323a':'#1a6b48'})}
function save(){try{const e=collect(),all=read();all[e.id]=e;if(!write(all)||read()[e.id]?.name!==e.name)throw Error('Browser storage failed.');status('✓ Draft saved on this device · '+new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}));return e}catch(err){status('Save failed: '+err.message,true);return null}}
async function upload(input){
 const index=Number(input.dataset.cellUpload),file=input.files?.[0];if(!file)return;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15*1024*1024){status('Choose a JPEG, PNG or WebP under 15 MB.',true);return}
 const draft=save();if(!draft)return;
 try{
  const bitmap=await createImageBitmap(file),ratio=Math.min(1,700/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
  const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();
  let data=canvas.toDataURL('image/jpeg',0.68);if(data.length>280000)data=canvas.toDataURL('image/jpeg',0.42);
  draft.photos[index]={...draft.photos[index],dataUrl:data,fileName:file.name};
  const all=read();all[draft.id]=draft;if(!write(all))throw Error('Browser storage full.');
  editing(draft.id);
 }catch(error){status('Photo upload failed: '+error.message,true)}
}
function review(){
 const item=save();if(!item)return;
 const lines=['Cell Recognition update: '+item.name,'Finding ID: '+item.id,'Appearance: '+item.look,'Clinical meaning: '+item.meaning,'WHY: '+item.why,'Notes: '+item.note,'Species: '+item.species,...item.photos.flatMap((p,i)=>['Photo '+(i+1)+': '+(p.url||p.fileName||'(none)'),'Original image: '+(p.originalPhoto?'yes':'no'),'Credit: '+p.credit,'Source: '+p.source])];
 const href='https://github.com/amppet22-prog/Vet-Pharm-Quest-/issues/new?title='+encodeURIComponent('[Cell Recognition update] '+item.name)+'&body='+encodeURIComponent(lines.join('\n'));
 api.showModal('📨 Request Review','<p>Draft saved. Open GitHub and attach any locally uploaded original photographs to your request.</p><a href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">Open Cell Recognition review issue</a><p><button data-cell-edit="'+esc(item.id)+'">← Back to editing</button></p>');
}
function publishForm(){
 const item=save();if(!item)return;
 pending=item;const vault=window.VPQ_OWNER_KEY_VAULT,saved=vault?.exists?.();
 api.showModal('🚀 Publish Cell Recognition','<p><b>'+esc(item.name)+'</b> — Publish content and photos to GitHub. Requires a GitHub token with repository Contents: Read and write.</p>'+
 '<p>'+(saved?'Encrypted publishing key is saved on this browser. Enter your password, or replace it with a new token.':'On first setup, enter a fine-grained GitHub token. Optionally create a password (12+ characters) to save the token encrypted on this browser.')+'</p>'+
 '<label>Publishing password</label><input data-cell-pass type="password" autocomplete="off" style="width:100%"><label>GitHub token (optional if encrypted key exists)</label><input data-cell-token type="password" autocomplete="off" style="width:100%">'+
 '<p><button data-cell-publish-confirm="1">🚀 Publish Now</button> <button data-cell-edit="'+esc(item.id)+'">← Back to editing</button></p><p data-cell-publish-status role="status" aria-live="polite"></p>');
}
function init(context){
 if(api)return;api=context;
 context.body.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-cell-edit],[data-cell-new],[data-cell-save],[data-cell-review],[data-cell-back],[data-cell-publish-open],[data-cell-publish-confirm]');
  if(!b)return;
  if(b.hasAttribute('data-cell-edit'))return editing(b.dataset.cellEdit);
  if(b.hasAttribute('data-cell-new'))return addNew();
  if(b.hasAttribute('data-cell-save'))return save();
  if(b.hasAttribute('data-cell-review'))return review();
  if(b.hasAttribute('data-cell-back'))return window.VPQ_BLOOD_SMEAR_LAB?.reference();
  if(b.hasAttribute('data-cell-publish-open'))return publishForm();
  if(b.hasAttribute('data-cell-publish-confirm')){
   const tokenBox=context.body.querySelector('[data-cell-token]'),passBox=context.body.querySelector('[data-cell-pass]');
   const entered=tokenBox?.value.trim()||'',pass=passBox?.value||'';if(tokenBox)tokenBox.value='';if(passBox)passBox.value='';
   const status=text=>{const x=context.body.querySelector('[data-cell-publish-status]');if(x)x.textContent=text};
   b.disabled=true;
   (async()=>{
    const vault=window.VPQ_OWNER_KEY_VAULT;const token=entered||await vault?.unlock(pass);
    if(!token)throw Error('Enter your GitHub token or unlock a saved token with a password.');
    await window.VPQ_ATLAS_PUBLISHER.publishCell(token,pending,status);
    if(entered&&pass&&vault?.available?.())await vault.store(entered,pass);
    const all=read();delete all[pending.id];write(all);
    return pending.name;
   })().then(name=>api.showModal('✅ Cell Reference Published','<p><b>'+esc(name)+'</b> was committed to GitHub. Once GitHub Pages deploys, the updated reference will be visible to other learners.</p><button data-cell-back="1">Open Cell Recognition</button>'))
   .catch(error=>{status('Publish failed: '+error.message);b.disabled=false});
  }
 });
 context.body.addEventListener('change',ev=>{if(ev.target.matches('[data-cell-upload]'))upload(ev.target);if(ev.target.matches('[data-cell-species]')){const s=ev.target.dataset.cellSpecies,p=context.body.querySelector('[data-cell-species-panel="'+s+'"]');if(p)p.style.display=ev.target.checked?'':'none'}});
}
return Object.freeze({init,editing,addNew,get,records,read,photo});
})();
