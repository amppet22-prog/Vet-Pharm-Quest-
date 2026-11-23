/* Vet Pharm Quest — Diagnostic Imaging local teaching viewer.
   No user image is uploaded, persisted or sent to GitHub. Clinical conclusions
   must come from human review, not simulated detections. */
(function(){
'use strict';
let api=null;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slots=()=>[0,1,2].map(()=>({url:'',name:'',view:'',region:''}));
let images=slots(),active=0,zoom=100,brightness=100,contrast=100,rotation=0,sideBySide=false;
let report={species:'',region:'',history:'',quality:'',normal:'Undetermined',findings:'',assessment:'',next:''};
const button=(act,text)=>'<button type="button" data-vpqviewer="'+act+'">'+text+'</button>';
function release(){images.forEach(x=>{if(x.url)URL.revokeObjectURL(x.url)});images=slots()}
function defaults(){zoom=100;brightness=100;contrast=100;rotation=0;sideBySide=false}
function page(title,html){api.showModal('🩻 '+title,'<div class="vpq-viewer-root">'+html+'</div>')}
function imageBox(item,index){
 const source=item.url;
 return '<div style="min-width:0;flex:1 1 240px;border:1px solid #bdcde2;border-radius:13px;background:#f7f9fe;overflow:hidden">'+
 '<div style="padding:9px 12px;display:flex;justify-content:space-between;gap:6px;flex-wrap:wrap;background:#e8f0fc"><b>View '+(index+1)+'</b><small>'+esc(item.view||'Projection not labeled')+'</small></div>'+
 (source?'<div style="height:clamp(220px,36vw,440px);background:#17202e;overflow:auto;display:flex;align-items:center;justify-content:center"><img alt="Locally opened image: '+esc(item.name)+'" src="'+esc(source)+'" draggable="false" style="width:'+zoom+'%;max-width:none;height:auto;object-fit:contain;filter:brightness('+brightness+'%) contrast('+contrast+'%);transform:rotate('+rotation+'deg);transform-origin:center;display:block"></div>':
 '<div style="height:230px;display:grid;place-items:center;text-align:center;padding:14px;background:#263448;color:#dceaff"><span>📁 Add your lecture radiograph or approved teaching image for View '+(index+1)+'<br><small>Nothing has been uploaded to the game</small></span></div>')+
 '<small style="display:block;padding:8px 11px;color:#596e88">'+esc(item.name||'No image selected')+'</small></div>';
}
function render(){
 const image=images[active];
 page('Multi-view Radiograph Viewer',
 '<div style="padding:10px 12px;background:#f4ecff;border:1px solid #e0cbed;border-radius:11px;font-size:12px;color:#584774"><b>Local teaching workspace.</b> Select files from your device; they stay in this browser session and are not published. Use only images you have permission to study. Image controls adjust the display, <b>not</b> the original radiograph.</div>'+
 '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0">'+images.map((p,i)=>'<button data-vpqviewer="choose-'+i+'" aria-pressed="'+(i===active)+'" style="background:'+(active===i?'#e5dcfc':'#fff')+';border:2px solid '+(active===i?'#9474c7':'#cbd6e6')+'">View '+(i+1)+(p.url?' ✓':'')+'</button>').join('')+'</div>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;background:#f7f9fd;border-radius:10px;padding:10px;margin:7px 0">'+
 '<label style="font-size:12px;font-weight:800">Local image file<input id="vpqViewerFile" type="file" accept="image/png,image/jpeg,image/webp" style="display:block;width:100%;margin-top:5px"></label>'+
 '<label style="font-size:12px;font-weight:800">Projection / view<input data-vpqviewer-field="view" value="'+esc(image.view)+'" placeholder="e.g. Right lateral, VD, DP" style="display:block;width:100%;padding:7px;margin-top:5px"></label>'+
 '<label style="font-size:12px;font-weight:800">Region / side<input data-vpqviewer-field="region" value="'+esc(image.region)+'" placeholder="e.g. Thorax, right forelimb" style="display:block;width:100%;padding:7px;margin-top:5px"></label></div>'+
 '<div style="display:flex;gap:7px;flex-wrap:wrap;margin:10px 0">'+button('minus','− Zoom')+button('plus','+ Zoom')+button('brightness-down','− Brightness')+button('brightness-up','+ Brightness')+button('contrast-down','− Contrast')+button('contrast-up','+ Contrast')+button('rotate','↻ Rotate display')+button('reset','Reset controls')+button('compare',sideBySide?'Single view':'Compare views')+'</div>'+
 '<small style="display:block;color:#526c89;margin:4px 0 10px">Zoom '+zoom+'% · Brightness '+brightness+'% · Contrast '+contrast+'% · Display rotation '+rotation+'°. Display rotation does not change acquisition orientation or correct an inaccurate marker.</small>'+
 '<div style="display:flex;gap:9px;flex-wrap:wrap;align-items:stretch">'+(sideBySide?images.filter(i=>i.url).length?images.map((i,index)=>i.url?imageBox(i,index):'').join(''):imageBox(image,active):imageBox(image,active))+'</div>'+
 '<div class="buttonrow" style="margin:12px 0">'+button('spotter','🎯 Spot the Abnormality')+button('interpret','📝 Structured interpretation')+button('reading','📚 Radiology Reading Desk')+button('clear','Clear images')+'</div>'+
 '<p class="tiny">Viewing unsupported file types or DICOM requires a dedicated validated viewer; this workspace accepts JPEG, PNG and WebP. No lesion identification or diagnosis is automatically generated.</p>');
}
function interpret(){
 page('Image interpretation · Guided report',
 '<p style="font-size:13px">Use a consistent order: <b>image quality → projection & anatomy → findings → assessment → recommendations</b>. Describe objective radiographic signs before assigning a disease name. Images are stored only in the viewer session.</p>'+
 '<div style="padding:9px;background:#f5f9ff;border:1px solid #d5e3f3;border-radius:10px;font-size:12px"><b>Loaded views:</b> '+images.map((im,i)=>im.url?('View '+(i+1)+' · '+esc(im.view||'unlabeled')+' · '+esc(im.region||'region unspecified')):'').filter(Boolean).join(' | ').replace(/^$/,'No image files selected')+'</div>'+
 [['species','Species / patient context','e.g. Dog, 5 years; question: cough'],['region','Region / projections','e.g. Thorax, right lateral and VD'],['history','Reason for imaging / relevant history','Relevant presenting complaint and prior treatment'],['quality','Technical quality','Rotation, coverage, exposure index, motion, artifacts, completeness'],['findings','Objective findings','Location, opacity, number, size, shape, margins, distribution, effects'],['assessment','Assessment and prioritized differentials','Describe possible processes, not unfounded certainty'],['next','Recommendations / limitations','Additional views, ultrasound, correlation, clinician discussion']].map(([key,label,hint])=>'<label style="display:block;margin:8px 0;font-size:12px;font-weight:800">'+label+'<textarea data-vpqviewer-report="'+key+'" rows="'+(key==='findings'?4:2)+'" placeholder="'+esc(hint)+'" style="display:block;width:100%;padding:8px;border:1px solid #cad8e9;border-radius:8px;font-size:13px">'+esc(report[key])+'</textarea></label>').join('')+
 '<label style="display:block;font-size:12px;font-weight:800">Radiographic status<select data-vpqviewer-report="normal" style="display:block;width:100%;padding:8px">'+['Undetermined','No radiographic abnormality identified','Abnormal'].map(v=>'<option'+(report.normal===v?' selected':'')+'>'+v+'</option>').join('')+'</select></label>'+
 '<div class="buttonrow">'+button('viewer','← Return to images')+button('copy','📋 Copy report')+button('clear-report','Clear report')+'</div>'+
 '<p id="vpqViewerFeedback" role="status" style="font-size:12px;color:#476987"></p>');
}
function copyReport(){
 const text=['RADIOGRAPHIC INTERPRETATION — STUDY DRAFT','Species / context: '+report.species,'Anatomy and views: '+report.region,'History: '+report.history,'Status: '+report.normal,'Technical quality: '+report.quality,'Findings: '+report.findings,'Assessment / differentials: '+report.assessment,'Recommendations / limitations: '+report.next,'Study draft: findings are not independently verified by the game.'].join('\n');
 const status=api.body.querySelector('#vpqViewerFeedback');
 if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>{if(status)status.textContent='Report copied to clipboard.'}).catch(()=>{if(status)status.textContent='Clipboard unavailable; use your browser copy tools.'});
 else if(status)status.textContent='Clipboard unavailable; use your browser copy tools.';
}
function init(context){
 api=context;if(api.body.__vpqImagingViewerInit)return;api.body.__vpqImagingViewerInit=true;
 api.body.addEventListener('click',event=>{
  const b=event.target.closest('[data-vpqviewer]');if(!b)return;
  event.preventDefault();event.stopImmediatePropagation();const action=b.dataset.vpqviewer;
  if(action.startsWith('choose-')){active=Number(action.slice(7));return render()}
  if(action==='plus')zoom=Math.min(300,zoom+25);
  else if(action==='minus')zoom=Math.max(50,zoom-25);
  else if(action==='brightness-up')brightness=Math.min(180,brightness+10);
  else if(action==='brightness-down')brightness=Math.max(40,brightness-10);
  else if(action==='contrast-up')contrast=Math.min(180,contrast+10);
  else if(action==='contrast-down')contrast=Math.max(40,contrast-10);
  else if(action==='rotate')rotation=(rotation+90)%360;
  else if(action==='reset')defaults();
  else if(action==='compare')sideBySide=!sideBySide;
  else if(action==='clear'){release();defaults();}
  else if(action==='spotter')return window.VPQ_IMAGING_SPOTTER?.open?.();
  else if(action==='interpret')return interpret();
  else if(action==='copy')return copyReport();
  else if(action==='clear-report'){report={species:'',region:'',history:'',quality:'',normal:'Undetermined',findings:'',assessment:'',next:''};return interpret()}
  else if(action==='reading')return window.VPQ_RADIOLOGY_DESK?.home?.();
  else if(action==='viewer')return render();
  render();
 });
 api.body.addEventListener('change',event=>{
  const target=event.target;
  if(target.id==='vpqViewerFile'){
   const f=target.files?.[0];if(!f)return;
   if(!/^image\/(png|jpeg|webp)$/.test(f.type)||f.size>25*1024*1024){const status=document.createElement('small');status.textContent='Choose a JPEG, PNG or WebP image under 25 MB.';target.insertAdjacentElement('afterend',status);return}
   if(images[active].url)URL.revokeObjectURL(images[active].url);
   images[active].url=URL.createObjectURL(f);images[active].name=f.name.slice(0,120);
   return render();
  }
  if(target.dataset.vpqviewerField){images[active][target.dataset.vpqviewerField]=String(target.value||'').slice(0,150);return}
  if(target.dataset.vpqviewerReport){report[target.dataset.vpqviewerReport]=String(target.value||'').slice(0,5000)}
 },true);
 api.body.addEventListener('input',event=>{
  const t=event.target;if(t.dataset?.vpqviewerReport)report[t.dataset.vpqviewerReport]=String(t.value||'').slice(0,5000);
  if(t.dataset?.vpqviewerField)images[active][t.dataset.vpqviewerField]=String(t.value||'').slice(0,150);
 },true);
}
window.VPQ_DIAGNOSTIC_IMAGING_VIEWER=Object.freeze({init,open:render,report:interpret,getViews:()=>images.map(({url,name,view,region})=>({url,name,view,region})),reset:()=>{release();defaults()}});
})();