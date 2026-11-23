/* Vet Pharm Quest — Owner-published Diagnostic Imaging cases.
 * Public cases live in a dedicated GitHub JSON manifest. Only verified
 * repository owner tokens can write. No token is saved in plaintext here. */
(function(){
'use strict';
const OWNER='amppet22-prog',REPO='Vet-Pharm-Quest-',FILE='diagnostic-imaging-published.json';
const API='https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/';
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','&':'&amp;',"'":'&#39;'}[c]));
const enc=s=>{const a=new TextEncoder().encode(s);let b='';for(let i=0;i<a.length;i+=8192)b+=String.fromCharCode(...a.subarray(i,i+8192));return btoa(b)};
const dec=s=>new TextDecoder().decode(Uint8Array.from(atob(String(s).replace(/\s/g,'')),x=>x.charCodeAt(0)));
const val=(root,id)=>String(root.querySelector('#'+id)?.value||'').trim();
let api=null,data={version:1,cases:{}},selected=null,ownerDraft=null,lastStatus='';
const available=()=>Object.values(data.cases||{}).filter(x=>x&&x.id&&x.title).sort((a,b)=>String(a.title).localeCompare(String(b.title)));
const button=(key,name)=>'<button type="button" data-vpqipub="'+key+'">'+name+'</button>';
function screen(title,content){api.showModal('🩻 '+title,content)}
async function load(){
 try{const r=await fetch('./'+FILE+'?reload='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('Could not load the published imaging manifest ('+r.status+').');const j=await r.json();if(!j||typeof j.cases!=='object'||Array.isArray(j.cases))throw Error('Imaging manifest is malformed.');data=j;lastStatus='';}
 catch(e){lastStatus=e.message}
 return available();
}
function ownerControls(){
 return '<label style="display:block;margin:8px 0;font-size:12px;font-weight:800">Owner publishing password<input id="vpqiPassword" type="password" autocomplete="off" placeholder="Your existing owner password" style="display:block;padding:9px;width:100%"></label>'+
 (window.VPQ_OWNER_KEY_VAULT?.exists?.()?'':'<label style="display:block;font-size:12px;font-weight:800">GitHub owner token · first setup only<input id="vpqiToken" type="password" autocomplete="off" placeholder="Fine-grained GitHub Contents: Read/write" style="display:block;padding:9px;width:100%"></label>')+
 '<p style="font-size:11px;color:#64748b">Your GitHub token is not included in the public imaging files. Publishing checks that the token belongs to the repository owner.</p>';
}
async function github(url,token,method='GET',body=null){
 const r=await fetch(url,{method,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
 if(!r.ok){let msg='';try{msg=(await r.json()).message||''}catch(e){}throw Error('GitHub '+method+' failed ('+r.status+'): '+msg.slice(0,160))}
 return r.json();
}
async function auth(password,token){
 const vault=window.VPQ_OWNER_KEY_VAULT;
 if(!token){if(!vault?.exists?.())throw Error('Enter the owner GitHub token for first-time setup.');if(!password)throw Error('Enter your owner publishing password.');token=await vault.unlock(password)}
 const person=await github('https://api.github.com/user',token);
 if(String(person.login||'').toLowerCase()!==OWNER.toLowerCase())throw Error('Only '+OWNER+' may publish imaging cases.');
 return token;
}
function viewRow(i,v){
 return '<div style="padding:10px;border:1px solid #d1dfed;background:#fff;border-radius:11px;margin:8px 0">'+
 '<b style="display:block;color:#3e5577">Image '+(i+1)+'</b>'+
 (v?.url?'<img src="'+E(v.url)+'" alt="'+E(v.view||'Published imaging view')+'" style="height:110px;width:100%;object-fit:contain;background:#222c3a;border-radius:8px;margin:6px 0">':'')+
 '<label style="display:block;font-size:12px;margin:6px 0">Projection / view<input data-vpqi-view="'+i+'" style="display:block;width:100%;padding:8px" value="'+E(v?.view||'')+'" placeholder="e.g. Right lateral, VD, DP"></label>'+
 '<label style="display:block;font-size:12px;margin:6px 0">Image description / caption<input data-vpqi-caption="'+i+'" style="display:block;width:100%;padding:8px" value="'+E(v?.caption||'')+'" placeholder="Describe anatomy without giving away diagnosis"></label>'+
 '<label style="display:block;font-size:12px;margin:6px 0">Add / replace image<input data-vpqi-file="'+i+'" type="file" accept="image/png,image/jpeg,image/webp" style="display:block;width:100%;margin-top:5px"></label>'+
 (v?.url?'<label style="display:block;font-size:12px"><input data-vpqi-remove="'+i+'" type="checkbox"> Remove this image when publishing</label>':'')+
 '</div>';
}
function edit(id=null){
 selected=id||null;
 const card=id?data.cases[id]:null;if(id&&!card)return list();
 const c=card||{title:'',kind:'case',lecture:'',species:'Dog',modality:'X-ray',region:'',history:'',lookFor:'',quality:'',findings:'',interpretation:'',differentials:'',why:'',next:'',source:'',credit:'',images:[]};
 ownerDraft=c;
 screen((card?'Edit':'Add')+' Imaging '+(c.kind==='normal'?'Normal Reference':'Case'),
 '<div style="padding:10px;background:#f4f0fa;border:1px solid #ded2eb;border-radius:10px"><b>'+(card?'Edit published record':'Create permanent imaging record')+'</b><p style="font-size:12px;margin:4px 0">Each named projection belongs to the same case. Add new images in the image slots below. Existing images stay unless you replace or remove them.</p></div>'+
 '<div style="display:flex;gap:8px;margin:10px 0"><label style="flex:1;font-size:12px;font-weight:800">Card type<select id="vpqiKind" style="width:100%;display:block;padding:8px">'+[['case','Clinical Case'],['normal','Normal Reference']].map(([v,l])=>'<option value="'+v+'"'+(c.kind===v?' selected':'')+'>'+l+'</option>').join('')+'</select></label><label style="flex:1;font-size:12px;font-weight:800">Modality<select id="vpqiModality" style="display:block;width:100%;padding:8px">'+['X-ray','Ultrasound','CT','MRI'].map(v=>'<option'+(v===c.modality?' selected':'')+'>'+v+'</option>').join('')+'</select></label></div>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px">'+
 [['Title','Title','e.g. Canine Thorax · Case 001'],['Lecture','Lecture','e.g. DI Exam 4 / Thorax'],['Species','Species','e.g. Dog'],['Region','Region','e.g. Thorax'],['History','History','Presenting complaint / context'],['LookFor','What to look for','Student-friendly questions about the anatomy and signs, without revealing the diagnosis'],['Quality','Quality','Projection, exposure, positioning, artifacts'],['Findings','Findings','Objective radiographic signs'],['Interpretation','Interpretation','Diagnosis or assessment · revealed after practice'],['Differentials','Differentials','Competing explanations'],['Why','Why','Imaging signs and underlying pathophysiology'],['Next','Next','Diagnostic next steps / limitations'],['Source','Source','Lecture / original study reference'],['Credit','Credit','Rights holder or educational source']].map(([label,id,placeholder])=>'<label style="display:block;font-size:12px;font-weight:800">'+label+(id==='Title'||id==='Species'||id==='Region'||id==='Source'?' *':'')+
 (['History','LookFor','Quality','Findings','Interpretation','Differentials','Why','Next'].includes(id)?'<textarea rows="3" id="vpqi'+id+'" placeholder="'+E(placeholder)+'" style="display:block;width:100%;padding:9px;border:1px solid #d3dce9;border-radius:8px">'+E((id==='LookFor'?c.lookFor:c[id.toLowerCase()])||'')+'</textarea>':'<input id="vpqi'+id+'" value="'+E(c[id.toLowerCase()]||'')+'" placeholder="'+E(placeholder)+'" style="display:block;width:100%;padding:9px;border:1px solid #d3dce9;border-radius:8px">')+'</label>').join('')+
 '</div><h4 style="margin:14px 0 4px">📷 Views in this case</h4>'+
 '<p style="font-size:12px;color:#556a83">Image 1, 2 and 3 are independent upload slots. Label the projection before publishing. You can add views later without losing previously published files.</p>'+
 [0,1,2].map(i=>viewRow(i,c.images?.[i])).join('')+
 '<label style="display:block;font-size:12px;margin:8px 0"><input id="vpqiRights" type="checkbox"> I have permission to publish these images to the public game and have excluded identifying patient/owner information</label>'+
 '<div style="padding:10px;background:#f4f8fd;border:1px solid #d3e0ed;border-radius:11px;margin-top:10px"><b>🔐 Owner publishing</b>'+ownerControls()+'</div>'+
 '<div class="buttonrow" style="margin:12px 0">'+button('publish','🚀 Publish Now')+button('library','← Published cases')+'</div>'+
 '<p id="vpqiStatus" role="status" style="font-size:12px"></p>');
}
function list(){
 const all=available();
 screen('Diagnostic Imaging · Published Library',
 '<div style="padding:10px 12px;border:1px solid #d5c7e6;background:#f7f2fd;border-radius:11px"><b>Shared imaging library</b><p style="font-size:12px;margin:5px 0">Every published image and interpretation is visible to students. Only the verified owner can publish or edit records. Choose a case to study its views before revealing findings.</p></div>'+
 '<div class="buttonrow" style="margin:10px 0">'+button('add','➕ Add / Publish Imaging Case')+button('reload','↻ Refresh library')+button('viewer','🖼️ Temporary image viewer')+'</div>'+
 (lastStatus?'<p style="color:#a86229;font-size:12px">Latest refresh: '+E(lastStatus)+'</p>':'')+
 (all.length?'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:9px">'+all.map(c=>'<button data-vpqipub="open:'+E(c.id)+'" style="text-align:left;padding:12px;background:#fff;border:1px solid #d5ddeb;border-radius:12px"><b>'+E(c.title)+'</b><small style="display:block;margin:7px 0;color:#6e7890">'+E(c.kind==='normal'?'Normal reference':'Clinical case')+' · '+E(c.species)+' · '+E(c.modality)+' · '+E(c.region)+'</small><small style="display:block">'+(c.images||[]).length+' view(s) · '+E(c.lecture)+'</small></button>').join('')+'</div>':'<p style="font-size:13px;padding:14px;background:#f9fbff;border:1px dashed #ccdbe9;border-radius:10px">No cases published yet. Use <b>Add / Publish Imaging Case</b> to add the first permanent teaching case.</p>'));
}
function open(id,showAnswer=false,showAnnotations=false){
 const c=data.cases[id];if(!c)return list();selected=id;
 const all=c.images||[];
 const annotated=v=>/\bannotat(?:ed|ion)\b/i.test([v.view,v.caption].join(' '));
 const hasPair=all.some(annotated)&&all.some(v=>!annotated(v));
 const visible=hasPair&&!showAnnotations?all.filter(v=>!annotated(v)):all;
 screen(c.title,
 '<div class="buttonrow">'+button('library','← Imaging library')+button('edit:'+E(id),'✏️ Edit / Publish')+button('viewer','🖼️ Personal image viewer')+'</div>'+
 '<p style="font-size:12px;color:#65758b">'+E(c.species)+' · '+E(c.region)+' · '+E(c.modality)+' · '+E(c.lecture)+'</p>'+
 (hasPair?'<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0;padding:9px 11px;background:#f4f0fc;border-radius:10px"><b style="font-size:12px">Study images:</b>'+button(showAnnotations?'plain:'+E(id):'annotate:'+E(id),showAnnotations?'🖼️ Hide annotation key':'✨ Show annotated teaching version')+'<small style="color:#6c5b81">Original image first · teaching annotations optional</small></div>':'')+
 '<div style="display:flex;flex-wrap:wrap;gap:9px">'+visible.map((v,i)=>'<figure style="flex:1 1 260px;margin:0;border:1px solid #cfdaea;background:#263242;border-radius:11px;overflow:hidden"><img loading="lazy" src="'+E(v.url)+'" alt="'+E(v.view||'Imaging view')+'" style="width:100%;height:clamp(180px,35vw,440px);object-fit:contain"><figcaption style="padding:8px;background:#eef3fa;color:#394e69;font-size:12px"><b>'+E(v.view||'Radiograph')+'</b>'+(showAnswer?' · '+E(v.caption||''):' · '+(annotated(v)?'Annotated teaching radiograph':'Describe findings before revealing the key'))+'</figcaption></figure>').join('')+'</div>'+
 '<div style="padding:12px;background:#f3f8ff;border-radius:10px;margin:12px 0"><b>🔎 What to look at</b><p style="font-size:12px;white-space:pre-wrap">'+E(c.lookFor||'Check projection, coverage and positioning. Identify anatomy, describe opacity, distribution and margins, then consider differentials.')+'</p><p style="font-size:12px">Judge technical quality, identify objective findings and write your differential before revealing the published interpretation.</p>'+
 '<label style="font-size:12px">Your observations<textarea id="vpqiSelfNotes" rows="3" placeholder="Where? Opacity? Distribution? What does the pattern suggest?" style="width:100%;display:block;padding:9px"></textarea></label></div>'+
 (showAnswer?'<div style="padding:13px;background:#f4edfc;border:1px solid #d8caed;border-radius:11px"><b>Published teaching interpretation</b>'+[['History',c.history],['Image quality',c.quality],['Objective findings',c.findings],['Interpretation',c.interpretation],['Differentials',c.differentials],['Why / mechanism',c.why],['Recommendations',c.next],['Credit',c.credit]].filter(x=>x[1]).map(([k,v])=>'<p style="white-space:pre-wrap"><b>'+E(k)+':</b> '+E(v)+'</p>').join('')+
 (c.source?'<p><b>Image source:</b> '+E(c.source)+'</p>':'')+'</div>':button('reveal:'+E(id),'🔍 Reveal interpretation'))+
 '<p style="font-size:11px;color:#6f7d8a">Source-linked educational images and owner-authored teaching notes. Clinical findings are not independently validated by the game. Source and license details are shown after revealing the answer.</p>');
}
function imageBase64(file){
 return new Promise((resolve,reject)=>{
 const img=new Image(),url=URL.createObjectURL(file);
 img.onload=()=>{
  URL.revokeObjectURL(url);
  try{
   const canvas=document.createElement('canvas'),scale=Math.min(1,2000/Math.max(img.naturalWidth,img.naturalHeight));
   canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
   canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
   const base=canvas.toDataURL('image/jpeg',0.84).split(',')[1];
   if(base.length>6500000)throw Error('Image is too large after resizing. Please use a smaller source image.');
   resolve(base);
  }catch(e){reject(e)}
 };
 img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Cannot decode the selected image.'))};
 img.src=url;
 });
}
async function publish(){
 const root=api.body,status=root.querySelector('#vpqiStatus');
 const v=id=>val(root,'vpqi'+id);
 const id=selected||'imaging-'+Date.now().toString(36);
 const old=selected?data.cases[selected]:null;
 const images=[0,1,2].map(i=>({
  old:old?.images?.[i]||null,
  file:root.querySelector('[data-vpqi-file="'+i+'"]')?.files?.[0]||null,
  view:root.querySelector('[data-vpqi-view="'+i+'"]')?.value?.trim()||'',
  caption:root.querySelector('[data-vpqi-caption="'+i+'"]')?.value?.trim()||'',
  remove:!!root.querySelector('[data-vpqi-remove="'+i+'"]')?.checked
 }));
 if(!v('Title')||!v('Species')||!v('Region')||!v('Source'))throw Error('Enter a title, species, region and original source.');
 if(v('Title').length>180)throw Error('The title must be 180 characters or fewer.');
 if(images.some(x=>x.file&&(!/^image\/(jpeg|png|webp)$/.test(x.file.type)||x.file.size>22*1024*1024)))throw Error('Choose JPEG, PNG or WebP images smaller than 22 MB each.');
 if(images.some(x=>x.file&&!x.view))throw Error('Name the projection for each new image.');
 if(!root.querySelector('#vpqiRights')?.checked)throw Error('Confirm that you have publishing permission and have excluded identifying information.');
 if(images.filter(x=>!x.remove&&(x.old?.url||x.file)).length===0)throw Error('At least one image is required for a public imaging case.');
 const password=v('Password'),rawToken=v('Token');
 let token=await auth(password,rawToken);
 if(status)status.textContent='Owner verified. Publishing images…';
 const raw=await github(API+FILE+'?ref=main',token),manifest=JSON.parse(dec(raw.content));
 if(!manifest.cases||typeof manifest.cases!=='object')throw Error('Published manifest is invalid.');
 if(!old&&Object.values(manifest.cases).some(c=>String(c.title).toLowerCase()===v('Title').toLowerCase()))throw Error('A case with that title already exists. Edit it instead.');
 const newImages=[];
 for(let i=0;i<images.length;i++){
  const it=images[i];if(it.remove)continue;
  let url=it.old?.url||'';
  if(it.file){
   if(status)status.textContent='Publishing radiograph '+(i+1)+'…';
   const filename='diagnostic-imaging-photos/'+id+'-'+Date.now()+'-'+i+'.jpg';
   await github(API+filename,token,'PUT',{message:'Owner publish imaging view '+id+' #'+(i+1),content:await imageBase64(it.file),branch:'main'});
   url='https://raw.githubusercontent.com/'+OWNER+'/'+REPO+'/main/'+filename;
  }
  if(url)newImages.push({url,view:it.view||it.old?.view||'',caption:it.caption||it.old?.caption||''});
 }
 if(!newImages.length)throw Error('The case requires at least one view.');
 const card={id,title:v('Title').slice(0,180),kind:v('Kind')==='normal'?'normal':'case',modality:v('Modality')||'X-ray',lecture:v('Lecture').slice(0,120),species:v('Species').slice(0,120),region:v('Region').slice(0,140),history:v('History').slice(0,3500),lookFor:v('LookFor').slice(0,3500),quality:v('Quality').slice(0,3500),findings:v('Findings').slice(0,3500),interpretation:v('Interpretation').slice(0,3500),differentials:v('Differentials').slice(0,3500),why:v('Why').slice(0,3500),next:v('Next').slice(0,3500),source:v('Source').slice(0,500),credit:v('Credit').slice(0,500),images:newImages,updated:new Date().toISOString()};
 manifest.cases[id]=card;
 if(status)status.textContent='Publishing case and interpretation…';
 await github(API+FILE,token,'PUT',{message:'Owner '+(old?'update':'create')+' Diagnostic Imaging case '+id,content:enc(JSON.stringify(manifest,null,2)+'\n'),sha:raw.sha,branch:'main'});
 data=manifest;selected=id;
 const vault=window.VPQ_OWNER_KEY_VAULT;
 if(rawToken&&password&&!vault?.exists?.()){try{await vault.store(rawToken,password)}catch(e){}}
 screen('✓ Imaging case published','<p><b>'+E(card.title)+'</b> was published to the shared imaging library with '+newImages.length+' image(s). Students can now open it.</p>'+button('open:'+E(id),'Open case')+button('library','Published library'));
}
function init(context){
 api=context;if(api.body.__vpqImagingPublishInit)return;api.body.__vpqImagingPublishInit=true;
 api.body.addEventListener('click',event=>{
  const btn=event.target.closest('[data-vpqipub]');if(!btn)return;
  event.preventDefault();event.stopImmediatePropagation();const act=btn.dataset.vpqipub;
  if(act==='library')return list();
  if(act==='reload')return load().then(list);
  if(act==='add')return edit();
  if(act==='viewer')return window.VPQ_DIAGNOSTIC_IMAGING_VIEWER?.open?.();
  if(act.startsWith('edit:'))return edit(act.slice(5));
  if(act.startsWith('open:'))return open(act.slice(5));
  if(act.startsWith('annotate:'))return open(act.slice(9),false,true);
  if(act.startsWith('plain:'))return open(act.slice(6),false,false);
  if(act.startsWith('reveal:'))return open(act.slice(7),true);
  if(act==='publish'){
   if(btn.disabled)return;btn.disabled=true;
   const status=api.body.querySelector('#vpqiStatus');
   publish().catch(e=>{if(status)status.textContent='Publish failed: '+e.message+'. Your draft remains in the editor.'}).finally(()=>{if(btn.isConnected)btn.disabled=false});
  }
 },true);
}
window.VPQ_IMAGING_PUBLISH=Object.freeze({init,load,library:()=>load().then(list),list,edit,getCases:available});
})();