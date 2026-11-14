/* Clinical Pathology Atlas — local draft editor and GitHub review requests.
   Edits are browser-local. No GitHub credentials are stored in client code.
   Submitted GitHub Issues are proposals, NOT automatic publications. */
window.VPQ_ATLAS_EDITOR=(function(){
'use strict';
const KEY='vpq-atlas-drafts-v1', ISSUE_URL='https://github.com/amppet22-prog/Vet-Pharm-Quest-/issues/new';
const examples=[
  {id:'plateletclump',name:'Platelet clumping',species:'Cat',source:'https://eclinpath.com/atlas/hematology/feline-blood/',credit:'Cornell eClinPath',note:'Platelet clumps can produce falsely low automated platelet counts, especially in cats.'},
  {id:'echinocyte',name:'Echinocytes',species:'Dog / cat / other',source:'https://eclinpath.com/wp-content/uploads/Echinocyte.jpg',credit:'Cornell eClinPath',note:'Numerous regularly spaced short spicules; frequently a preanalytical/storage change.'},
  {id:'acanthocyte',name:'Acanthocytes',species:'Cat / dog',source:'https://eclinpath.com/hematology/morphologic-features/red-blood-cells/quick-guide/',credit:'Cornell eClinPath',note:'Irregularly sized and spaced projections; cats can have acanthocytes. Compare with echinocytes.'},
  {id:'rouleaux',name:'Rouleaux formation',species:'Horse / cat / dog',source:'https://eclinpath.com/hematology/morphologic-features/red-blood-cells/quick-guide/',credit:'Cornell eClinPath',note:'Coin-stack RBCs, often physiologic in horses; distinguish from true agglutination.'}
];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const safeUrl=s=>{try{let u=new URL(String(s||'').trim());return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}};
function read(){try{let d=JSON.parse(localStorage.getItem(KEY)||'{}');return d&&typeof d==='object'&&!Array.isArray(d)?d:{}}catch{return {}}}
function write(data){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch{return false}}
let api=null,selected='plateletclump',returnTo='visual';
const SPECIES=['Dog','Cat','Horse','Cattle','Sheep','Goat','Pig','Bird','Rabbit','Other'];
function fromLegacySpecies(description){
 const text=String(description||'').toLowerCase();
 if(/all species|all mammals|all domestic species|all animals/.test(text))return [...SPECIES];
 const checks={Dog:/\bdogs?\b|canine|pupp(y|ies)/,Cat:/\bcats?\b|feline|kitten/,Horse:/\bhorses?\b|equine|foal/,Cattle:/\bcattle\b|\bcows?\b|bovine|calves|calf/,Sheep:/\bsheep\b|ovine|lamb/,Goat:/\bgoats?\b|caprine/,Pig:/\bpigs?\b|porcine|swine/,Bird:/\bbirds?\b|avian|chicken/,Rabbit:/\brabbits?\b|lagomorph/};
 const found=SPECIES.filter(s=>checks[s]?.test(text));
 return found.length?found:['Other'];
}
function speciesLabel(tags){return tags.length===SPECIES.length?'All species':tags.join(', ')}
function catalogEntry(id){const live=window.VPQ_CLINPATH_VISUAL_ATLAS?.entries?.find(x=>x.id===id)||null;return live||catalog().find(x=>x.id===id)||null}
function speciesInputs(base,draft){
 const original=catalogEntry(base.id);
 const official=window.VPQ_ATLAS_PUBLISHER?.get?.(base.id);
 const current=Array.isArray(draft.speciesTags)?draft.speciesTags:Array.isArray(official?.speciesTags)?official.speciesTags:fromLegacySpecies(draft.species||official?.species||original?.species||base.species);
 const evidence=draft.speciesEvidence||official?.speciesEvidence||{};
 return '<fieldset style="border:1px solid #b8cde4;border-radius:12px;padding:10px;margin:10px 0"><legend><b>Species applicability &amp; filtering</b></legend><p class="tiny">Select each species where this morphology or finding is recognized. For each, document why it applies, important differences, and a source. These selections control the species filter after publishing.</p><div style="display:flex;gap:8px;flex-wrap:wrap">'+SPECIES.map(s=>'<label style="display:inline-flex;align-items:center;gap:5px;padding:7px 10px;border:1px solid #a6bfdf;border-radius:12px;background:'+(current.includes(s)?'#e2f2fd':'#fff')+'"><input type="checkbox" data-atlas-species="'+esc(s)+'" '+(current.includes(s)?'checked':'')+'>'+esc(s)+'</label>').join('')+'</div><div data-atlas-species-details="1">'+SPECIES.map(s=>'<div data-atlas-species-panel="'+esc(s)+'" style="padding:8px;border-bottom:1px solid #dce7f2;'+(current.includes(s)?'':'display:none')+'"><b>'+esc(s)+'</b><label>What supports this finding in '+esc(s)+'? Species differences / clinical caveats</label><textarea data-atlas-species-evidence="'+esc(s)+'" rows="2" style="width:100%" placeholder="Morphology and clinical relevance; distinguish normal/abnormal">'+esc(evidence[s]?.why||'')+'</textarea><label>Reference URL for '+esc(s)+'</label><input type="url" data-atlas-species-source="'+esc(s)+'" style="width:100%" placeholder="https://..." value="'+esc(evidence[s]?.source||'')+'"></div>').join('')+'</div></fieldset>';
}

function catalog(){
 const merged=[...examples],existing=new Set(merged.map(x=>x.id));
 for(const x of window.VPQ_CLINPATH_VISUAL_ATLAS?.entries||[]){if(existing.has(x.id))continue;
 merged.push({id:x.id,name:x.name,species:x.species||'',source:'https://eclinpath.com/atlas/',credit:'Reference source to be provided',note:x.clinical||x.look||''});existing.add(x.id)}
 return merged;
}
function editor(id,from){if(from)returnTo=from;selected=id||selected;const d=read()[selected]||{},base=catalog().find(x=>x.id===selected)||examples[0],slots=Array.isArray(d.photos)?d.photos:[];
const opts=catalog().map(x=>'<option value="'+esc(x.id)+'" '+(x.id===selected?'selected':'')+'>'+esc(x.name)+'</option>').join('');
const imgs=[0,1].map(i=>{const p=slots[i]||{},src=p.dataUrl||safeUrl(p.url);return '<fieldset style="border:1px solid #d5dfee;border-radius:12px;padding:10px;margin:8px 0"><legend>Photo '+(i+1)+'</legend><label>Upload a photo from your device (saved locally)</label><input data-atlas-upload="'+i+'" type="file" accept="image/jpeg,image/png,image/webp" style="display:block;width:100%;margin:6px 0 12px"><label>Or use an image URL (direct https:// image link)</label><input data-atlas-field="url'+i+'" type="url" value="'+esc(p.url||'')+'" placeholder="https://..." style="width:100%;padding:8px"><label>Photo credit / permission or license details</label><input data-atlas-field="credit'+i+'" value="'+esc(p.credit||'')+'" style="width:100%;padding:8px"><label>Source page URL</label><input data-atlas-field="source'+i+'" type="url" value="'+esc(p.source||'')+'" style="width:100%;padding:8px">'+(src?'<img alt="Draft atlas photo preview" loading="lazy" src="'+esc(src)+'" style="display:block;max-width:100%;max-height:180px;margin-top:8px;object-fit:contain">':'')+'</fieldset>'}).join('');
api.showModal('✏️ Atlas editor — personal draft','<p><b>Choose your publishing option here:</b> Save Draft keeps your changes in this browser. <b>Publish Now · Owner</b> opens the GitHub token field and updates the official atlas after verification. Request Review is for suggested edits.</p><div class="buttonrow" style="position:sticky;top:0;z-index:2;background:#f7f9ff;padding:10px;border:1px solid #bcd2ea;border-radius:12px"><button data-atlas-save="1">💾 Save Draft</button><button data-atlas-publish-open="1" style="background:#e2f3e9;border:2px solid #80ad94;font-weight:800">🚀 Publish Now · Owner</button><button data-atlas-request="1">📨 Request Review</button></div><label>Atlas finding</label><select data-atlas-select="1" style="width:100%;padding:9px">'+opts+'</select><p class="tiny">Reference: <a target="_blank" rel="noopener noreferrer" href="'+esc(base.source)+'">'+esc(base.credit)+'</a></p>'+speciesInputs(base,d)+'<label>Explanation or correction</label><textarea data-atlas-field="note" rows="4" style="width:100%">'+esc(d.note??base.note)+'</textarea>'+imgs+'<p class="tiny">Only add images you have permission to redistribute, or use links to the original source. Uploaded photos are saved as compressed previews in this browser, not yet in the official game. To publish, attach the original image in GitHub when submitting the review request.</p><div class="buttonrow"><button data-atlas-save="1">💾 Save draft</button><button data-atlas-request="1">📨 Request Review</button><button data-atlas-publish-open="1">🚀 Publish Now · Owner</button><button data-atlas-close="1">Back to atlas</button></div>');
}
function collect(){const out={id:selected,updated:new Date().toISOString(),photos:[]},root=api.body;out.note=root.querySelector('[data-atlas-field="note"]')?.value.trim()||'';
out.speciesTags=SPECIES.filter(s=>root.querySelector('[data-atlas-species="'+s+'"]')?.checked);
if(!out.speciesTags.length)throw Error('Choose at least one applicable species before saving.');
out.species=speciesLabel(out.speciesTags);out.speciesEvidence={};
for(const species of out.speciesTags){out.speciesEvidence[species]={
 why:root.querySelector('[data-atlas-species-evidence="'+species+'"]')?.value.trim()||'',
 source:root.querySelector('[data-atlas-species-source="'+species+'"]')?.value.trim()||''
};}
for(let i=0;i<2;i++){const get=k=>root.querySelector('[data-atlas-field="'+k+i+'"]')?.value.trim()||'';const url=get('url'),source=get('source'),credit=get('credit');if(url&&!safeUrl(url))throw Error('Photo '+(i+1)+' needs a valid http(s) URL.');if(source&&!safeUrl(source))throw Error('Photo '+(i+1)+' needs a valid source page URL.');const old=read()[selected]?.photos?.[i]||{};out.photos.push({url,source,credit,dataUrl:old.dataUrl||'',fileName:old.fileName||''})}return out}
function save(){try{const draft=collect(),all=read();all[selected]=draft;if(!write(all))throw Error('Browser storage is full or disabled.');editor(selected);return draft}catch(err){api.showModal('Atlas draft issue','<p>'+esc(err.message)+'</p><button data-atlas-edit="'+esc(selected)+'">Return to editing</button>');return null}}
function request(){const draft=save();if(!draft)return;
const base=catalog().find(x=>x.id===selected),title='[Atlas photo request] '+base.name,body=['## Proposed Clinical Pathology atlas update','Finding: '+base.name,'Species: '+draft.species,'Explanation: '+draft.note,'','## Species applicability and evidence',...draft.speciesTags.flatMap(sp=>['Species: '+sp,'Why applicable: '+(draft.speciesEvidence?.[sp]?.why||'(not supplied)'),'Species reference: '+(draft.speciesEvidence?.[sp]?.source||'(not supplied)')]),'','## Proposed photo slots',...draft.photos.flatMap((p,i)=>['Photo '+(i+1)+': '+(p.url||(p.dataUrl?'Locally uploaded: '+p.fileName+' — ATTACH PHOTO TO THIS ISSUE':'(none / upload as attachment in GitHub)')), 'Source: '+(p.source||'(not supplied)'), 'Attribution / permission: '+(p.credit||'(not supplied)')]),'','## Reviewer checklist','- [ ] Species and morphology medically verified','- [ ] Copyright/permission and image attribution reviewed','- [ ] No answer labels visible in quiz mode','- [ ] No duplicate item ID; source URL reachable','- [ ] Publish using a reviewed GitHub change (issue submission alone does not deploy)'].join('\n');
const url=ISSUE_URL+'?title='+encodeURIComponent(title)+'&body='+encodeURIComponent(body);
api.showModal('📨 Publication request ready','<p>Your draft is saved in this browser. Open GitHub, sign in, attach your original uploaded photo(s) to the issue, then select <b>Submit new issue</b>. This is sent to the repository Issues inbox for owner review, not published automatically.</p><p><a target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">Open prefilled GitHub publication request ↗</a></p><p class="tiny">After approval, content and image permissions must be reviewed and the GitHub change merged before anyone else sees it.</p><button data-atlas-edit="'+esc(selected)+'">Back to draft</button>');
}
function init(ctx){if(api)return;api=ctx;ctx.body.addEventListener('click',ev=>{const b=ev.target.closest('[data-atlas-edit],[data-atlas-save],[data-atlas-request],[data-atlas-close]');if(!b)return;if(b.hasAttribute('data-atlas-edit'))return editor(b.dataset.atlasEdit||'plateletclump',b.dataset.atlasFrom||null);if(b.hasAttribute('data-atlas-save'))return save();if(b.hasAttribute('data-atlas-request'))return request();if(b.hasAttribute('data-atlas-close'))return returnTo==='smear'?window.VPQ_BLOOD_SMEAR_LAB?.menu():window.VPQ_CLINPATH_VISUAL_ATLAS?.menu()});
ctx.body.addEventListener('change',ev=>{
 if(ev.target.matches('[data-atlas-select]'))return editor(ev.target.value);
 if(ev.target.matches('[data-atlas-species]')){
  const key=ev.target.dataset.atlasSpecies;const panel=ctx.body.querySelector('[data-atlas-species-panel="'+key+'"]');
  if(panel)panel.style.display=ev.target.checked?'':'none';
  ev.target.closest('label').style.background=ev.target.checked?'#e2f2fd':'#fff';
 }
});
}
return Object.freeze({init,editor,examples,read,catalog,collect,speciesLabel,fromLegacySpecies,SPECIES,show:(title,html)=>api?.showModal(title,html),replaceDrafts:write});
})();
