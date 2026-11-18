/* Necropsy Case Center: differential-first clinical pathology reasoning. */
window.VPQ_NECROPSY_DIFFERENTIAL_LAB=(function(){
'use strict';
const data=window.VPQ_NECROPSY_DIFFERENTIAL_CASES?.cases||[];
const KEY='vpq-necropsy-differential-local-images-v1';
let ui=null,filter='all',current=null,phase=0,leading=-1,shortlist=[],showWhy=false;
const safe=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function photoStore(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function updatePhoto(id,image){const state=photoStore();if(image)state[id]=image;else delete state[id];try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){return false}}
function modal(title,body){ui?.showModal(title,body)}
function start(api,chosen='all'){ui=api;filter=chosen;menu()}
function menu(){
 const matched=data.filter(x=>filter==='all'||x.lecture===filter);
 const counts=[...new Set(data.map(x=>x.lecture))];
 modal('🔬 Necropsy Case Center · Build the differential',
 '<div style="padding:11px;border:1px solid #b7d1eb;background:#f2f8ff;border-radius:12px"><b>Think like a pathologist:</b> signalment and history → anatomic location/gross pattern → shortlist differentials → histology → leading etiology and next test. These are <b>simulated teaching cases</b>, not photographs of real patients.</div>'+
 '<div class="buttonrow" style="margin:10px 0">'+['all',...counts].map(n=>'<button data-pathdiff-filter="'+safe(n)+'" aria-pressed="'+(filter===n?'true':'false')+'">'+(n==='all'?'All systems':'L'+safe(n))+'</button>').join('')+'</div>'+
 '<p class="tiny">'+matched.length+' instructor-slide-linked differential cases in this first module. Each includes four etiologic possibilities and why they become more or less likely.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:9px">'+matched.map(x=>'<button data-pathdiff-open="'+safe(x.id)+'" style="text-align:left;padding:12px;border:1px solid #b7cce5;border-radius:12px;background:#fff"><b>'+safe(x.title)+'</b><small style="display:block;margin-top:5px">L'+safe(x.lecture)+' · '+safe(x.species)+' · '+safe(x.system)+'</small></button>').join('')+'</div>'+
 '<div class="buttonrow"><button data-pathdiff-return="1">← Necropsy study bank</button></div>');
}
function sourcedPhotos(x){
 const d=window.VPQ_NECROPSY_DIFFERENTIAL_IMAGES?.[x.id];
 if(!d)return '';
 const pics=(d.images||[]).map(p=>{
  const filename=String(p.file||'');
  const url='https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(filename);
  const source='https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(filename).replace(/%20/g,'_');
  if(p.type==='histology'&&phase===0)return '<div style="padding:10px;background:#f3f1fa;border:1px dashed #c1bcd3;border-radius:9px;font-size:12px;margin:7px 0">🔬 Histology reference becomes visible after the histology clue.</div>';
  return '<div style="padding:8px;border:1px solid #d2deed;border-radius:10px;background:white;margin:7px 0"><img src="'+safe(url)+'" alt="'+safe(p.caption)+'" loading="lazy" style="display:block;width:100%;max-height:210px;object-fit:contain;border-radius:6px"><div style="font-size:12px;margin-top:5px"><b>'+safe(p.type==='histology'?'Microscopic reference':'Visual reference')+'</b> · '+(phase>=2?safe(p.caption):'Observe the lesion first; the diagnosis and full caption are revealed after the comparison.')+'</div><div style="font-size:11px;color:#5b718b">Credit: '+safe(p.credit)+' · <a target="_blank" rel="noopener noreferrer" href="'+safe(source)+'">Source / license</a></div></div>';
 }).join('');
 const links=(d.links||[]).map(p=>'<a target="_blank" rel="noopener noreferrer" href="'+safe(p.url)+'" style="display:block;margin:6px 0;font-size:12px;text-decoration:underline;color:#315b9b">🔎 '+safe(p.label)+'</a>').join('');
 return '<div style="background:#eff8f5;border:1px solid #c5dace;border-radius:10px;padding:9px;margin:7px 0"><b style="font-size:13px">📸 Original veterinary references (not this simulated patient)</b>'+pics+(links?'<details '+(phase>=2?'open':'')+' style="margin:6px 0"><summary style="font-size:12px;font-weight:700">Additional pathology references (may reveal diagnosis)</summary>'+links+'</details>':'')+(d.note?'<p style="font-size:12px;color:#536375">'+safe(d.note)+'</p>':'')+'</div>';
}
function photoHTML(x){const photo=photoStore()[x.id];return '<div style="max-width:330px;padding:10px;background:#f8faff;border:1px dashed #bdcce0;border-radius:10px">'+(photo?'<img src="'+safe(photo)+'" alt="User added necropsy specimen" style="max-width:100%;max-height:205px;object-fit:contain;display:block;margin:auto">':'<div style="min-height:92px;display:grid;place-items:center;color:#566a89;font-size:13px">📷 No source photograph yet — add one from your lectures</div>')+'<label style="display:block;margin-top:7px;font-size:12px"><b>Add / replace this case image (local only)</b><input type="file" accept="image/*" data-pathdiff-photo="'+safe(x.id)+'" style="max-width:100%;font-size:12px"></label>'+(photo?'<button style="margin-top:5px;font-size:11px" data-pathdiff-remove="'+safe(x.id)+'">Remove local photo</button>':'')+'<small style="display:block;color:#66758b">Your image is stored in this browser; it is not published to GitHub. Only use photos you have permission to share.</small></div>'}
function view(){
 const x=data.find(v=>v.id===current);if(!x)return menu();
 const revealed=phase>=2;
 const opted=leading>=0?x.options[leading]:null;
 modal('🔬 Differential case · L'+safe(x.lecture)+' · '+safe(x.title),
 '<div class="buttonrow"><button data-pathdiff-list="1">← All differential cases</button><button data-pathdiff-reset="1">↺ Restart case</button></div>'+
 '<div style="background:#f1f7ff;border-left:4px solid #7798cb;padding:10px;border-radius:8px;margin:10px 0"><b>'+safe(x.species)+' — presenting history</b><p>'+safe(x.history)+'</p><b>Gross lesion / localization:</b> '+safe(x.gross)+'</div>'+
 '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,300px);gap:12px;align-items:start;max-width:100%;overflow-wrap:anywhere"><div>'+
 '<h4 style="margin:4px 0">1. Build your differential list</h4><p class="tiny">Select every reasonable possibility. More than one diagnosis may fit early findings.</p>'+
 x.options.map((o,i)=>'<button data-pathdiff-toggle="'+i+'" aria-pressed="'+shortlist.includes(i)+'" style="display:block;width:100%;text-align:left;margin:6px 0;padding:10px;border:2px solid '+(shortlist.includes(i)?'#4784b5':'#dbe4ef')+';background:'+(shortlist.includes(i)?'#ecf6ff':'#fff')+';border-radius:10px">'+(shortlist.includes(i)?'☑ ':'☐ ')+safe(o.name)+'</button>').join('')+
 '<h4 style="margin:14px 0 5px">2. Choose the most likely diagnosis</h4><p class="tiny">Pick your leading possibility based on the evidence currently visible.</p>'+
 '<select id="pathdiff-lead" style="width:100%;padding:9px;border:1px solid #a9bed5;border-radius:9px"><option value="-1">Choose a leading diagnosis...</option>'+x.options.map((o,i)=>'<option value="'+i+'"'+(leading===i?' selected':'')+'>'+safe(o.name)+'</option>').join('')+'</select>'+
 '<div class="buttonrow" style="margin:9px 0"><button data-pathdiff-histo="1">'+(phase===0?'🔬 Reveal histology clue':'🔬 Histology revealed ✓')+'</button>'+(phase>=1?'<button data-pathdiff-compare="1">📋 Compare all etiologies</button>':'')+'</div>'+
 (phase>=1?'<div style="background:#f5eefc;border:1px solid #d8c9ed;padding:12px;border-radius:10px"><b>3. Histology revealed</b><p>'+safe(x.histo)+'</p><small>Now reconsider whether the differentials remain equally plausible.</small></div>':'')+
 '</div><div>'+sourcedPhotos(x)+photoHTML(x)+'</div></div>'+
 (revealed?'<div style="margin-top:14px;border-top:2px solid #cbd9e9;padding-top:10px"><h4>4. Evidence-weighted differential comparison</h4><p>'+(opted?(opted.name===x.best?'✅ Your leading diagnosis matched the best-supported etiology.':'Your initial leader was <b>'+safe(opted.name)+'</b>. Compare the evidence below and revise your conclusion.'):'No leading diagnosis selected. Compare the possibilities below before returning to the case.')+'</p>'+
 '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Differential</th><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Supports</th><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Makes less likely / limitation</th><th style="text-align:left;padding:7px;border-bottom:2px solid #d6dce9">Histology distinction</th></tr></thead><tbody>'+x.options.map(o=>'<tr><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6"><b>'+safe(o.name)+'</b>'+(o.role==='best'?' ★':'')+'</td><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6">'+safe(o.supports)+'</td><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6">'+safe(o.against)+'</td><td style="vertical-align:top;padding:8px;border-bottom:1px solid #edf1f6">'+safe(o.hist)+'</td></tr>').join('')+'</tbody></table></div>'+
 '<div style="background:#eef8f0;border:1px solid #b8d7bf;border-radius:12px;padding:11px;margin-top:12px"><b>Best-supported etiology:</b> '+safe(x.best)+'<p><b>Morphologic diagnosis:</b> '+safe(x.morph)+'</p><p><b>Why it happens:</b> '+safe(x.mechanism)+'</p><p><b>What confirms it / next tests:</b> '+safe(x.tests)+'</p><small>Grounded in '+safe(x.ref)+'. This is an educational differential, not a definitive diagnosis from a simulated history.</small></div></div>':'')+
 '<div class="buttonrow" style="margin-top:12px"><button data-pathdiff-list="1">All cases</button><button data-pathdiff-reset="1">Try without clues again</button></div>');
}
function init(api){
 ui=api;
 api.body.addEventListener('click',ev=>{
 const button=ev.target.closest('button');if(!button||!Object.keys(button.dataset).some(k=>k.startsWith('pathdiff')))return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const d=button.dataset;
 if(d.pathdiffList!==undefined)return menu();
 if(d.pathdiffFilter!==undefined){filter=d.pathdiffFilter;return menu()}
 if(d.pathdiffOpen!==undefined){current=d.pathdiffOpen;phase=0;leading=-1;shortlist=[];return view()}
 if(d.pathdiffReturn!==undefined)return window.VPQ_PATH_EXAM7?.start('histo');
 if(d.pathdiffReset!==undefined){phase=0;leading=-1;shortlist=[];return view()}
 if(d.pathdiffToggle!==undefined){const i=Number(d.pathdiffToggle);shortlist=shortlist.includes(i)?shortlist.filter(v=>v!==i):[...shortlist,i];return view()}
 if(d.pathdiffHisto!==undefined){phase=Math.max(phase,1);return view()}
 if(d.pathdiffCompare!==undefined){if(phase<1)return;const el=api.body.querySelector('#pathdiff-lead');leading=el?Number(el.value):-1;phase=2;return view()}
 if(d.pathdiffRemove!==undefined){updatePhoto(d.pathdiffRemove,'');return view()}
 },true);
 api.body.addEventListener('change',ev=>{
 const d=ev.target?.dataset;if(!d||d.pathdiffPhoto===undefined)return;
 const input=ev.target,file=input.files?.[0];if(!file||!file.type.startsWith('image/'))return;
 const reader=new FileReader();
 reader.onload=()=>{const img=new Image();img.onload=()=>{const k=Math.min(1,780/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*k));c.height=Math.max(1,Math.round(img.height*k));c.getContext('2d').drawImage(img,0,0,c.width,c.height);const ok=updatePhoto(d.pathdiffPhoto,c.toDataURL('image/jpeg',0.67));if(ok)view();else modal('Image too large','<p>Browser storage is full. Please resize the image and try again.</p><button data-pathdiff-list="1">Return to cases</button>')};img.src=String(reader.result)};reader.readAsDataURL(file);
 },true);
}
return {init,start,cases:data};
})();
