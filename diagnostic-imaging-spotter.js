/* Vet Pharm Quest — Radiographic Spot the Abnormality.
 * Image-led observational practice for local, user-selected images only.
 * No automated diagnoses, fabricated patient films, upload, or grading of
 * the student's clinical interpretation. */
(function(){
'use strict';
let api=null,chosen=0,stage=0,showHints=false;
const marks=[[],[],[]],notes={quality:'',location:'',observation:'',process:'',differentials:'',next:''};
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','&':'&amp;',"'":'&#39;'}[c]));
const images=()=>window.VPQ_DIAGNOSTIC_IMAGING_VIEWER?.getViews?.()||[];
const button=(id,label)=>'<button type="button" data-vpqspot="'+id+'">'+label+'</button>';
const questions=[
 {name:'1 · Confirm image quality',field:'quality',sub:'Start with patient, orientation, projection and technical limitations.',hint:'Is the region adequately included? Is there rotation, motion, excessive noise, exposure issue, or an incorrect/missing marker?',placeholder:'e.g. Right lateral thorax; adequate coverage, mild rotation; exposure assessable'},
 {name:'2 · Localize your observation',field:'location',sub:'Use the image to mark an area. Do not interpret the mark as a computer-generated diagnosis.',hint:'Localize by side, body region, organ and compartment. Click directly on the displayed radiograph to add an observation marker.',placeholder:'e.g. Left caudal pulmonary region; lateral marker must be confirmed'},
 {name:'3 · Describe objective findings',field:'observation',sub:'Describe what you actually see before naming a disease.',hint:'Use radiographic signs: opacity, size, shape, margin, location, distribution, number, and effects on other structures.',placeholder:'e.g. Increased soft-tissue opacity, focal distribution, ill-defined margin'},
 {name:'4 · Interpret and prioritize',field:'process',sub:'Choose a process only after you have described the signs.',hint:'Think normal anatomy / artifact vs real lesion; consider anatomic localization and a plausible mechanism.',placeholder:'e.g. Pulmonary pattern, possible rotation/artifact limitations'},
 {name:'5 · Differential diagnoses',field:'differentials',sub:'List alternatives rather than declaring a diagnosis from a single view.',hint:'Consider patient context, competing pathologies and additional projections or modalities required to distinguish them.',placeholder:'e.g. 1) ... 2) ...; what finding supports or weakens each?'},
 {name:'6 · Next best step',field:'next',sub:'Make a recommendation appropriate to the question and evidence.',hint:'Would an orthogonal view, ultrasound, physical exam or clinician review change the interpretation? No unnecessary repeat exposures.',placeholder:'e.g. Evaluate the orthogonal projection and clinical history; consult interpreting veterinarian'}
];
function page(title,html){api.showModal('🩻 '+title,'<div class="vpq-spotter" style="color:#283c5c">'+html+'</div>')}
function viewItem(){
 const a=images(),v=a[chosen];return v?.url?v:null;
}
function markerMarkup(){
 return (marks[chosen]||[]).map((m,i)=>'<span title="Student observation marker '+(i+1)+'" aria-label="Student observation marker '+(i+1)+'" style="pointer-events:none;position:absolute;left:'+m.x+'%;top:'+m.y+'%;width:29px;height:29px;transform:translate(-50%,-50%);border:3px solid #ffdf72;background:#a7548933;box-shadow:0 0 0 2px #263e5b;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:11px;font-weight:900">'+(i+1)+'</span>').join('');
}
function exam(){
 const all=images();const v=viewItem();const q=questions[stage];
 page('Spot the Abnormality · Guided reading',
 '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:9px">'+button('viewer','← Multi-view viewer')+button('reset','↺ Start over')+button('quality','✅ Quality guide')+'</div>'+
 '<p style="font-size:12px;background:#f2edff;border:1px solid #d9cbed;border-radius:10px;padding:10px;margin:8px 0"><b>Clinical interpretation practice:</b> the game does not determine which location is abnormal or diagnose images for you. Markings are your own observations; review them against the actual lecture interpretation or a qualified instructor.</p>'+
 '<div style="display:flex;flex-wrap:wrap;gap:7px;margin:8px 0">'+all.map((item,i)=>'<button type="button" data-vpqspot="choose-'+i+'" aria-pressed="'+(i===chosen)+'" style="border:2px solid '+(i===chosen?'#9271c4':'#d1dbea')+';background:'+(i===chosen?'#eadffc':'#fff')+';padding:7px 12px;border-radius:9px">View '+(i+1)+(item?.url?' ✓':'')+'</button>').join('')+'</div>'+
 (v?'<div style="margin:0 auto 11px;max-width:850px"><div data-vpqspot-picture="1" tabindex="0" aria-label="Click on the radiograph to add an observation marker" style="display:block;position:relative;cursor:crosshair;width:100%;background:#18202c;border:2px solid #9cb2cc;border-radius:12px;overflow:hidden"><img src="'+E(v.url)+'" alt="Local teaching radiograph · '+E(v.name||'unnamed image')+'" draggable="false" style="display:block;width:100%;height:auto">'+markerMarkup()+'</div><div style="display:flex;justify-content:space-between;gap:5px;flex-wrap:wrap"><small>'+E(v.view||'Projection unspecified')+' · '+E(v.region||'Region unspecified')+'</small><small>Click image to mark · '+marks[chosen].length+' mark(s) · '+E(v.name||'')+'</small></div></div>':
 '<div style="background:#f5f8fd;border:2px dashed #bdcfe3;border-radius:12px;padding:24px;text-align:center;margin:8px 0"><b>No teaching image loaded for View '+(chosen+1)+'</b><p>Open the Multi-view Viewer to load a lecture image, then return here to practice.</p>'+button('viewer','📁 Load an image')+'</div>')+
 '<div style="display:flex;gap:4px;margin:8px 0 12px">'+questions.map((_,i)=>'<span style="height:5px;flex:1;background:'+(i<=stage?'#9677bc':'#e7e8ef')+';border-radius:7px"></span>').join('')+'</div>'+
 '<div style="padding:13px;border:1px solid #d8dff1;background:#f9faff;border-radius:12px"><b style="color:#543e77">'+E(q.name)+'</b><p style="font-size:13px;margin:5px 0">'+E(q.sub)+'</p><textarea data-vpqspot-note="'+q.field+'" rows="4" placeholder="'+E(q.placeholder)+'" style="width:100%;padding:10px;border:1px solid #cad7e9;border-radius:9px;font-size:13px;line-height:1.5">'+E(notes[q.field])+'</textarea>'+
 '<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:8px">'+button('hint',showHints?'Hide guidance':'? What should I assess?')+(marks[chosen].length?button('undo','↶ Undo last marker'):'')+(marks[chosen].length?button('clear-marks','Clear markers'):'')+'</div>'+
 (showHints?'<p style="border-left:3px solid #a68dcd;background:#f1eaff;padding:9px 11px;font-size:12px">'+E(q.hint)+'</p>':'')+'</div>'+
 '<div class="buttonrow" style="margin:12px 0">'+(stage>0?button('prev','← Previous step'):'')+(stage<questions.length-1?button('next','Next step →'):button('summary','📋 Review my interpretation'))+'</div>');
}
function summary(){
 const loaded=images().filter(x=>x.url);page('Spot the Abnormality · Review',
 '<p style="padding:10px;background:#f0f8f5;border:1px solid #c9e1d4;border-radius:10px"><b>Self-check, not an automatically graded diagnosis.</b> Compare your findings with the lecture key or veterinary radiologist. Marking an area does not mean the finding is abnormal.</p>'+
 '<p><b>Images:</b> '+loaded.length+' loaded · '+marks.reduce((sum,m)=>sum+m.length,0)+' observation marker(s)</p>'+
 questions.map(q=>'<div style="margin:7px 0;padding:10px;border:1px solid #d7ddec;border-radius:9px"><b style="font-size:13px">'+E(q.name)+'</b><p style="font-size:13px;white-space:pre-wrap;margin:4px 0">'+E(notes[q.field]||'Not recorded')+'</p></div>').join('')+
 '<p style="font-size:12px">Before finalizing: were projections and laterality correct? Did you describe findings objectively? Did you consider limitations and competing diagnoses?</p>'+
 '<div class="buttonrow">'+button('last','← Continue editing')+button('copy','📋 Copy my notes')+button('viewer','🖼️ Back to images')+'</div><p id="vpqSpotCopyStatus" role="status" style="font-size:12px"></p>');
}
function copy(){
 const a=['RADIOGRAPHIC SPOTTER · SELF-ASSESSMENT','Views: '+images().filter(x=>x.url).map((x,i)=>'View '+(i+1)+' '+(x.view||'unlabeled')).join('; '),...questions.map(q=>q.name+'\n'+notes[q.field]),'Markers: '+marks.map((m,i)=>'View '+(i+1)+': '+m.length).join('; '),'Not independently verified by Vet Pharm Quest.'].join('\n\n');
 const status=api.body.querySelector('#vpqSpotCopyStatus');if(navigator.clipboard?.writeText)navigator.clipboard.writeText(a).then(()=>{if(status)status.textContent='Copied!'}).catch(()=>{if(status)status.textContent='Clipboard access unavailable.'});else if(status)status.textContent='Clipboard access unavailable.';
}
function init(context){
 api=context;if(api.body.__vpqSpotterInit)return;api.body.__vpqSpotterInit=true;
 api.body.addEventListener('click',ev=>{
  const photo=ev.target.closest('[data-vpqspot-picture]');if(photo){
   const r=photo.getBoundingClientRect();if(r.width>0&&r.height>0){
    ev.preventDefault();ev.stopPropagation();
    const x=Math.max(0,Math.min(100,(ev.clientX-r.left)/r.width*100)),y=Math.max(0,Math.min(100,(ev.clientY-r.top)/r.height*100));
    marks[chosen].push({x:Math.round(x*10)/10,y:Math.round(y*10)/10});return exam();
   }return;
  }
  const b=ev.target.closest('[data-vpqspot]');if(!b)return;ev.preventDefault();ev.stopPropagation();
  const k=b.dataset.vpqspot;
  if(k.startsWith('choose-')){chosen=Number(k.slice(7));return exam()}
  if(k==='viewer')return window.VPQ_DIAGNOSTIC_IMAGING_VIEWER?.open?.();
  if(k==='quality')return window.VPQ_IMAGING_SUITE?.qualityMenu?.();
  if(k==='next'){stage=Math.min(questions.length-1,stage+1);showHints=false;return exam()}
  if(k==='prev'){stage=Math.max(0,stage-1);showHints=false;return exam()}
  if(k==='hint'){showHints=!showHints;return exam()}
  if(k==='undo'){marks[chosen].pop();return exam()}
  if(k==='clear-marks'){marks[chosen]=[];return exam()}
  if(k==='reset'){for(const v of marks)v.length=0;for(const q of questions)notes[q.field]='';stage=0;chosen=0;showHints=false;return exam()}
  if(k==='summary')return summary();
  if(k==='last'){stage=questions.length-1;return exam()}
  if(k==='copy')return copy();
 });
 api.body.addEventListener('input',ev=>{const k=ev.target?.dataset?.vpqspotNote;if(k)notes[k]=String(ev.target.value||'').slice(0,5000)},true);
}
function open(){if(!api)return;exam()}
window.VPQ_IMAGING_SPOTTER=Object.freeze({init,open});
})();