/* Monday pathology exam: Necropsy gross recognition, morphologic diagnosis and histology. */
window.VPQ_PATH_EXAM7=(function(){
'use strict';
const base=window.VPQ_PATH_EXAM7_DATA||[];
// Reuse the existing specimen editing/publishing system for non-disease normal references.
for(const x of window.VPQ_PATH_NORMALS||[]){if(!base.some(v=>v.id===x.id))base.push(x)}
function refreshCustom(){
 const owner=window.VPQ_NECROPSY_OWNER_PUBLISH;
 for(const x of owner?.getCustomSpecimens?.()||[]){if(!base.some(c=>c.id===x.id))base.push(x);}
 return base;
}
const KEY='vpq-path-exam7-user-edits-v1';
let ui=null,mode='gross',tab='lesions',normalSystem='all',filtersOpen=false,scopeFilter='all',filter='all',etiologyFilter='all',speciesFilter='all',frequencyFilter='all',conditionFilter='all',subtypeFilter='all',systemFilter='all',zoonoticFilter='all',search='',listPage=0,current=-1,quiz=[],step=0,revealed=false,unknownDraft={};
const rich=s=>window.VPQ_PATH_RICH_TEXT?.render?.(s)||h(s);
const h=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function edits(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function record(i){const src=base[i],official=window.VPQ_NECROPSY_OWNER_PUBLISH?.getSpecimen?.(src.id)||{},draft=edits()[src.id]||{};const entry=Object.assign({},src,official.text||{},draft);const photos=official.photos?.length?official.photos:(official.photo?.url?[official.photo]:[]);if(photos.length)entry.image=photos[0].url;return entry}

/* Reusable, source-preserving multi-species gross morphology. Independent entries
   are optional; cards without entries retain their original gross paragraphs. */
function parseGrossSpecies(value){
 let arr=value;
 if(typeof arr==='string'){try{arr=JSON.parse(arr||'[]')}catch{return []}}
 if(!Array.isArray(arr))return [];
 return arr.filter(v=>v&&typeof v==='object').slice(0,24).map(v=>({
  name:String(v.name||'').slice(0,120),
  clue:String(v.clue||'').slice(0,240),
  text:String(v.text||'').slice(0,12000)
 })).filter(v=>v.name||v.clue||v.text);
}
function speciesGrossEditorHTML(x){
 const items=parseGrossSpecies(x.grossSpecies),visible=Math.max(3,items.length+2);
 const block=(v,i)=>'<details class="atlas-species-edit" style="border:1px solid #decfe8;border-radius:10px;padding:9px;margin:7px 0;background:#fcf9ff" '+(i===0?'open':'')+'><summary style="font-weight:800;color:#64467e">Species group '+(i+1)+(v.name?' · '+h(v.name):' · New')+'</summary>'+
 '<label style="display:block;margin-top:7px">Species/group name<input data-path7-species-name="'+i+'" style="display:block;width:100%;padding:8px" placeholder="e.g. Ruminants — cattle, sheep, goats" value="'+h(v.name)+'"></label>'+
 '<label style="display:block;margin-top:7px">Quick identifying clue<input data-path7-species-clue="'+i+'" style="display:block;width:100%;padding:8px" placeholder="e.g. Raised caruncles" value="'+h(v.clue)+'"></label>'+
 '<label style="display:block;margin-top:7px">Detailed gross pathology<textarea data-path7-species-text="'+i+'" rows="5" style="display:block;width:100%;padding:8px" placeholder="Species-specific gross lesions, variation and complications">'+h(v.text)+'</textarea></label></details>';
 return '<details class="atlas-species-editor" style="padding:10px;margin:10px 0;border-radius:12px;border:1px solid #d4b8df;background:#fbf6ff" open>'+
 '<summary style="font-weight:850;color:#5b3476">🐾 Expandable species gross descriptions</summary>'+
 '<p style="font-size:12px;margin:8px 0">Keep the <b>general morphology and most characteristic presentation</b> in the main Gross field. Add full species-specific findings below. Leave blank groups empty; they will not be saved.</p>'+
 '<div data-path7-species-editor-rows="1">'+Array.from({length:Math.min(24,visible)},(_,i)=>block(items[i]||{name:'',clue:'',text:''},i)).join('')+'</div>'+
 '<button type="button" data-path7-add-species-row="1" style="padding:6px 10px;font-size:12px">+ Add another species group</button></details>';
}
function readGrossSpecies(root){
 const names=Array.from(root?.querySelectorAll?.('[data-path7-species-name]')||[]);
 const items=names.map(el=>{
  const i=el.dataset.path7SpeciesName;
  return {name:String(el.value||'').trim().slice(0,120),
   clue:String(root.querySelector('[data-path7-species-clue="'+i+'"]')?.value||'').trim().slice(0,240),
   text:String(root.querySelector('[data-path7-species-text="'+i+'"]')?.value||'').trim().slice(0,12000)};
 }).filter(v=>v.name&&v.text);
 return JSON.stringify(items.slice(0,24));
}
function appendGrossSpeciesRow(root){
 const container=root?.querySelector?.('[data-path7-species-editor-rows]');
 if(!container||container.children.length>=24)return;
 const i=container.children.length,element=document.createElement('details');
 element.className='atlas-species-edit';element.open=true;
 element.style.cssText='border:1px solid #decfe8;border-radius:10px;padding:9px;margin:7px 0;background:#fcf9ff';
 element.innerHTML='<summary style="font-weight:800;color:#64467e">Species group '+(i+1)+' · New</summary>'+
 '<label style="display:block;margin-top:7px">Species/group name<input data-path7-species-name="'+i+'" style="display:block;width:100%;padding:8px" placeholder="e.g. Horses"></label>'+
 '<label style="display:block;margin-top:7px">Quick identifying clue<input data-path7-species-clue="'+i+'" style="display:block;width:100%;padding:8px"></label>'+
 '<label style="display:block;margin-top:7px">Detailed gross pathology<textarea data-path7-species-text="'+i+'" rows="5" style="display:block;width:100%;padding:8px"></textarea></label>';
 container.appendChild(element);element.scrollIntoView?.({block:'nearest'});
}
function grossViewModel(x){
 // Compatibility for a previously saved full uterine-prolapse gross description.
 // Do not rewrite or delete owner content; only render the old text in the new layout.
 if(x.id!=='exam7-30')return x;
 const gross=String(x.gross||'');
 const key='**RUMINANTS — CATTLE, SHEEP, GOATS**';
 const end='**ALL SPECIES — COMPLICATIONS**';
 const first=gross.indexOf(key);
 if(first<0||gross.indexOf(end)<0)return x;
 const headings=[
  ['Ruminants — cattle, sheep, goats','Raised maternal caruncles',key],
  ['Pigs / sows','Long uterine horns','**PIGS / SOWS**'],
  ['Horses / mares','Diffuse microcotyledonary placentation','**HORSES / MARES**'],
  ['Small animals — dogs & cats','Zonary placental sites','**SMALL ANIMALS — DOGS & CATS**'],
  ['All species — complications','Hemorrhage, ischemia and trauma',end]
 ];
 const sections=[];
 for(let i=0;i<headings.length;i++){
  const start=gross.indexOf(headings[i][2]);
  if(start<0)continue;
  const until=i+1<headings.length?gross.indexOf(headings[i+1][2],start+headings[i][2].length):-1;
  sections.push({name:headings[i][0],clue:headings[i][1],
   text:gross.slice(start+headings[i][2].length,until<0?undefined:until).trim()});
 }
 if(!sections.length)return x;
 const intro=gross.slice(0,first).replace(/^\*\*GENERAL — WHAT YOU SEE\*\*\s*/,'').trim();
 return {...x,gross:intro,grossSpecies:JSON.stringify(sections)};
}

function renderGrossSpecies(x,sys){
 const items=parseGrossSpecies(x.grossSpecies);
 if(!items.length)return '';
 return '<section class="atlas-species-gross" style="--gross-species-bg:'+sys[3]+';--gross-species-ink:'+sys[4]+'"><div class="atlas-species-gross-title">'+atlasIcon('book',18)+' <b>Species-specific gross findings</b><small>Open a species for the full pathology details</small></div>'+
 items.map((v,i)=>'<details class="atlas-species-gross-item" '+(i===0?'':'')+'><summary><span class="atlas-species-label">'+h(v.name)+'</span><span class="atlas-species-clue">'+h(v.clue)+'</span></summary><div class="atlas-species-gross-text">'+rich(v.text)+'</div></details>').join('')+
 '</section>';
}

function mechanismStrip(x){
 const sequence=String(x.mechanismSummary||'').trim();
 if(!sequence)return '';
 const steps=sequence.split(/\s*(?:→|->|⇒)\s*/).map(y=>y.trim()).filter(Boolean).slice(0,10);
 if(!steps.length)return '';
 return '<div class="atlas-mechanism-strip" role="group" aria-label="Pathogenesis sequence"><b>'+atlasIcon('layers',17)+' Mechanism at a glance</b><div class="atlas-mechanism-steps">'+steps.map((step,i)=>(i?'<span class="atlas-mechanism-arrow" aria-hidden="true">→</span>':'')+'<span class="atlas-mechanism-step">'+h(step)+'</span>').join('')+'</div></div>';
}
function pathogenesisContent(x){
 const flow=mechanismStrip(x);
 if(!flow)return '<p>'+rich(x.why)+'</p>';
 return flow+'<details class="atlas-mechanism-details"><summary>Read the full pathogenesis &amp; clinical consequences</summary><div class="atlas-mechanism-explanation">'+rich(x.why)+'</div></details>';
}
function photoStatus(x){
 const official=window.VPQ_NECROPSY_OWNER_PUBLISH?.getSpecimen?.(x.id)||{};
 const pictures=official.photos?.length?official.photos:(official.photo?.url?[official.photo]:[]);
 const local=!!edits()[x.id]?.image;
 if(pictures.some(p=>p.verified===true&&p.source&&p.credit))return '✓ Photo verified';
 if(pictures.length||local||x.image)return '📷 Photo added';
 if(Number.isInteger(x.lectureAtlasSection)&&[0,1].some(slot=>(window.VPQ_NECROPSY_OWNER_PUBLISH?.getLecturePhotos?.('L'+x.lecture+'-S'+x.lectureAtlasSection+'-P'+slot)||[]).length))return '📷 Published lecture photo linked';
 return '◻ Photo needed';
}
function save(i,part){let d=edits();d[base[i].id]=Object.assign({},d[base[i].id]||{},part);try{localStorage.setItem(KEY,JSON.stringify(d));return true}catch(e){return false}}

const ATLAS_SYSTEMS={
 cns:['🧠','Neurology','#E8D9FB','#7A57B5'],pns:['🧠','Neurology','#E8D9FB','#7A57B5'],
 integument:['🌸','Dermatology','#FFE0E5','#B95676'],ocular:['👁️','Eyes','#DBF5F9','#2A98AA'],
 aural:['👂','Ears','#FFE6D3','#B97F4F'],cardiac:['❤️','Cardiovascular','#FFD2DE','#B84968'],
 respiratory:['🫁','Respiratory','#BDEFE9','#218F90'],
 musculoskeletal:['🦴','Skeletal','#F2E0CC','#9B704D'],
 muscular:['💪','Muscular','#D6E8FF','#557FBC'],endocrine:['⚗️','Endocrine','#FFE9CF','#B57C4A'],
 reproductive:['🌷','Reproductive','#FFE1F0','#B7648C'],
 gastrointestinal:['🌿','Gastrointestinal','#DFEDC8','#6D9155'],
 renal:['🫘','Urinary / Renal','#E8C6DE','#8F5475'],
 hepatobiliary:['🍃','Liver / Biliary','#E8EDB9','#7F8947'],
 lymphatic:['🩸','Hematolymphatic','#F5C9DE','#A84F77'],
 systemic:['🌎','Systemic / One Health','#DFEAF8','#607FA4'],
 other:['🔬','Other','#EDF0F5','#62748B']
};
const ATLAS_ICON_PATHS={"brain":"<path d=\"M12 18V5a3 3 0 0 0-6-1 4 4 0 0 0-2 7 4 4 0 0 0 2 7 4 4 0 0 0 6 0Zm0 0V5a3 3 0 0 1 6-1 4 4 0 0 1 2 7 4 4 0 0 1-2 7 4 4 0 0 1-6 0Z\"/>","skin":"<path d=\"M2 16q5-4 10 0t10 0v5H2Z M12 16V7a3 3 0 1 1 6 0\"/>","eye":"<path d=\"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>","ear":"<path d=\"M6 9a6 6 0 0 1 12 0c0 4-4 6-5 9a3 3 0 0 1-6 0\"/>","heart":"<path d=\"M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 0 0-7 7l8 9 8-9a5 5 0 0 0 0-7Z\"/>","lungs":"<path d=\"M12 3v9m0-5-3 3m3-3 3 3M9 10C6 4 4 4 3 9s-3 12 4 12c2 0 3-2 3-5v-6Zm6 0c3-6 5-6 6-1s3 12-4 12c-2 0-3-2-3-5v-6Z\"/>","bone":"<path d=\"M17 9a3 3 0 1 0-3-3l-8 8a3 3 0 1 0 3 3l8-8Z\"/>","muscle":"<path d=\"M4 16c3-1 3-7 7-8 3-1 4 1 4 3l4-2c3 5 1 10-4 11H7Z\"/>","endocrine":"<path d=\"M9 4c-4 0-5 4-5 7s2 6 6 6l2-4 2 4c4 0 6-3 6-6s-1-7-5-7c-2 0-3 2-3 4 0-2-1-4-3-4Z\"/>","repro":"<path d=\"M12 10v10m0-10C9 6 6 7 4 4m8 6c3-4 6-3 8-6\"/><circle cx=\"4\" cy=\"4\" r=\"2\"/><circle cx=\"20\" cy=\"4\" r=\"2\"/>","gi":"<path d=\"M7 3v5c0 2 2 3 4 3h3c4 0 6 3 6 6a4 4 0 0 1-4 4H9a6 6 0 0 1-6-6V8c0-2 1-4 4-5Z\"/>","renal":"<path d=\"M8 3c-4 0-6 4-6 8s2 7 5 8c4 0 5-3 5-7s-1-9-4-9Zm8 0c4 0 6 4 6 8s-2 7-5 8c-4 0-5-3-5-7s1-9 4-9Z\"/>","liver":"<path d=\"M2 7c7-4 15-4 20 1-2 6-8 4-12 9-4 5-8 2-8-3Z\"/>","blood":"<path d=\"M12 2c4 6 7 10 7 14a7 7 0 0 1-14 0c0-4 3-8 7-14Z\"/>","globe":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c-5 5-5 13 0 18m0-18c5 5 5 13 0 18\"/>","book":"<path d=\"M12 6c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1Z\"/><path d=\"M12 6v15\"/>","camera":"<rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\"/><circle cx=\"12\" cy=\"14\" r=\"4\"/>","filter":"<path d=\"M3 5h18l-7 8v6l-4 2v-8Z\"/>","notes":"<path d=\"M5 3h11l3 3v15H5Z\"/><path d=\"M8 11h8M8 15h8M8 19h5\"/>","flask":"<path d=\"M9 2h6m-5 0v7L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-10V2M7 16h10\"/>","star":"<path d=\"m12 2 3.2 6.5 7.1 1-5.1 5 .9 7-6.1-3.3L5.9 21.5l.9-7-5.1-5 7.1-1Z\"/>","layers":"<path d=\"m12 3 10 6-10 6L2 9Zm-10 11 10 6 10-6\"/>"};
function atlasIcon(k,size=17){return '<svg aria-hidden="true" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-3px;flex-shrink:0">'+(ATLAS_ICON_PATHS[k]||ATLAS_ICON_PATHS.notes)+'</svg>'}
const ATLAS_ICON_KEYS={cns:'brain',pns:'brain',integument:'skin',ocular:'eye',aural:'ear',cardiac:'heart',respiratory:'lungs',musculoskeletal:'bone',muscular:'muscle',endocrine:'endocrine',reproductive:'repro',gastrointestinal:'gi',renal:'renal',hepatobiliary:'liver',lymphatic:'blood',systemic:'globe',other:'flask'};
const atlasExam=n=>{const k=Number(n);return k>=67&&k<=79?7:k>=59&&k<=66?6:k>=50&&k<=58?5:k>=42&&k<=49?4:k>=31&&k<=41?3:k>=17&&k<=30?2:k>=1&&k<=16?1:null};
const ATLAS_EXAMS={1:['#E5F0FF','#5B83B9'],2:['#EDE3FF','#8264C0'],3:['#DAF3ED','#3E9C8A'],4:['#FCECD8','#AD8658'],5:['#FCE3EB','#B25F80'],6:['#E6F3D7','#709A55'],7:['#F0E3FC','#8256B6']};
function atlasSystem(x){
 const m=window.VPQ_PATH_ATLAS_META?.data?.(x)||{},n=Number(x.lecture);
 const title=String(x.title||''),origin=String(x.system||'');
 // Published structured system wins; otherwise use the original specimen's stated system
 // and a narrow set of high-confidence title/site clues. Never classify a lesion by color alone.
 const named=[
  ['ocular',/\b(eye|eyes|ocular|ophthal|cornea|retina|uvea|lens)\b/i],
  ['aural',/\b(ear|ears|aural|otitis|pinna)\b/i],
  ['renal',/\b(renal|urinary|kidney|bladder|ureter\w*|urethra\w*|cystitis|pyelonephritis)\b/i],
  ['hepatobiliary',/\b(hepat\w*|liver|biliar\w*|gallbladder)\b/i],
  ['cardiac',/\b(cardiac|cardiovascular|heart|myocard|arterial|vascular)\b/i],
  ['respiratory',/\b(respirat\w*|pulmon\w*|lung|bronch\w*|alveol\w*|trachea)\b/i],
  ['lymphatic',/\b(hematolymph\w*|hematolog\w*|blood|lymph\w*|leukemia|leukaemia)\b/i],
  ['endocrine',/\b(endocrine|adrenal\w*|thyroid\w*|pituitar\w*)\b/i],
  ['integument',/\b(dermat\w*|integument\w*|skin|cutaneous)\b/i],
  ['reproductive',/\b(reproduct\w*|ovarian|uterine|placent\w*|testic\w*|prostat\w*|mammar\w*)\b/i],
  ['muscular',/\b(muscul|myopath|myositis|skeletal muscle)\b/i],
  ['musculoskeletal',/\b(skeletal|bone|joint|osteomyel|osteoarth|fracture)\b/i],
  ['gastrointestinal',/\b(gastrointestinal|digestiv\w*|intestin\w*|colon\w*|gastric|abomas\w*|pancrea\w*)\b/i],
  ['cns',/\b(neuro|cns|brain|encephal|spinal cord|cerebell|mening)\b/i],
  ['pns',/\b(peripheral nervous|pns|peripheral nerve)\b/i],
  ['systemic',/\b(systemic|one health|multiorgan)\b/i]
 ];
 const explicit=ATLAS_SYSTEMS[m.organSystem]?m.organSystem:'';
 const stated=named.find(([key,re])=>re.test(origin))?.[0]||'';
 const narrowTitle=named.find(([key,re])=>re.test(title))?.[0]||'';
 const fallback=n>=67&&n<=70?'cns':n>=71&&n<=74?'integument':n>=75&&n<=77?'reproductive':n===78?'aural':n===79?'ocular':n>=31&&n<=35?'renal':n>=36&&n<=41?'hepatobiliary':n>=42&&n<=49?'endocrine':n>=50&&n<=53?'cardiac':n>=54&&n<=58?'respiratory':n>=59&&n<=66?'gastrointestinal':'other';
 const key=explicit||stated||narrowTitle||fallback;
 return [key,...(ATLAS_SYSTEMS[key]||ATLAS_SYSTEMS.other)];
}
const atlasEsc=h;
function atlasCardTags(x){
 const m=window.VPQ_PATH_ATLAS_META?.data?.(x)||{},sys=atlasSystem(x);
 const species=Object.keys(m.species||{}).map(k=>window.VPQ_PATH_ATLAS_META?.species?.[k]||k);
 const fallback=species.length?species:(String(x.species||'').trim()?[String(x.species).slice(0,55)]:[]);
 const tags=[...fallback.slice(0,2).map(z=>'<span class="atlas-tag">🐾 '+h(z)+'</span>')];
 if(m.breedTags?.length)tags.push('<span class="atlas-tag atlas-tag-breed">🐕 '+h(m.breedTags[0])+(m.breedTags.length>1?' +'+(m.breedTags.length-1):'')+'</span>');
 const causes=window.VPQ_PATH_ETIOLOGY?.forCard?.(x)?.categories||[];
 if(causes.length)tags.push('<span class="atlas-tag">'+h(causes[0])+'</span>');
 return '<span class="atlas-tag atlas-system" style="--tag-bg:'+sys[3]+';--tag-ink:'+sys[4]+'">'+atlasIcon(ATLAS_ICON_KEYS[sys[0]])+' '+h(sys[2])+'</span>'+tags.join('');
}
const atlasStyle=String.raw`<style>
.atlas-hub,.atlas-detail{--ink:#243753;--line:#d7dbea;color:var(--ink);font-family:inherit}
.atlas-hub button,.atlas-detail button{transition:background .15s,border-color .15s}
.atlas-hub .atlas-actions{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}
.atlas-hub .atlas-actions button,.atlas-detail .atlas-small-links button{font-size:12px!important;padding:7px 11px!important;border-radius:12px!important}
.atlas-hub .atlas-filter-panel{margin:8px 0;padding:9px 11px;border:1px solid #d3c0ed;border-radius:12px;background:linear-gradient(115deg,#f5edff,#edf7ff)}
.atlas-hub .atlas-filter-panel summary{cursor:pointer;color:#49366e;font-size:13px;display:flex;align-items:center;gap:7px;font-weight:800}
.atlas-hub .atlas-filter-count{margin-left:auto;color:#69778b;font-size:11px}
.atlas-hub .atlas-filter-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:9px;margin-top:10px}
.atlas-hub .atlas-filter-grid label{font-size:12px;font-weight:650}
.atlas-hub .atlas-filter-grid select{display:block;width:100%;padding:8px;margin-top:4px;border-radius:8px;border:1px solid #bdcae0;background:white}
.atlas-hub .atlas-lectures{display:flex;flex-wrap:wrap;gap:4px;margin:8px 0;padding:7px;background:#faf7ff;border-radius:11px;border:1px solid #e5dcef}
.atlas-hub .atlas-lectures button{font-size:10px!important;padding:4px 6px!important;min-height:25px!important;border-radius:8px!important;background:color-mix(in srgb,var(--lecture-bg,#f3edfb) 55%,white)!important;border:1px solid color-mix(in srgb,var(--lecture-ink,#8679a7) 35%,white)!important;color:#334566!important;font-weight:750!important;line-height:1.15!important}
.atlas-hub .atlas-lectures button[aria-pressed=true]{background:var(--lecture-bg,#e9dcf7)!important;border-color:var(--lecture-ink,#986fc2)!important;color:#42315f!important;box-shadow:inset 0 0 0 1px var(--lecture-ink,#986fc2)}
.atlas-hub .atlas-index-card{background:color-mix(in srgb,var(--system-bg,#eee7f7) 38%,white)!important;border:1px solid color-mix(in srgb,var(--card-accent,#9571bf) 30%,white)!important;border-left:4px solid var(--card-accent,#9571bf)!important;border-radius:13px!important;padding:11px!important;min-height:88px;box-shadow:0 2px 5px #27355209}
.atlas-hub .atlas-index-card:hover,.atlas-hub .atlas-index-card:focus-visible{background:var(--system-bg,#f8f4ff)!important;outline-offset:2px}
.atlas-hub .atlas-index-card strong{display:block;color:#263b64;font-size:13px;line-height:1.35}
.atlas-hub .atlas-index-card small{display:block;margin-top:4px;font-size:11px}
.atlas-hub .atlas-index-card .atlas-system-line{color:var(--system-ink,#7862a8);font-weight:700}
.atlas-detail .atlas-heading{background:var(--exam-bg,#f2e9fc);border:1px solid #dbc8ef;border-radius:14px;padding:11px 13px;margin:9px 0 12px}
.atlas-detail .atlas-heading h3{font-size:17px!important;line-height:1.3;margin:0 0 8px;color:#312357}
.atlas-detail .atlas-chipline{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.atlas-detail .atlas-exam-tag{background:var(--exam-ink,#8256b6);color:white;border-radius:9px;padding:4px 9px;font-size:12px;font-weight:800}
.atlas-detail .atlas-tag{display:inline-block;background:#f4f6fa;border:1px solid #d9dfeb;color:#374863;border-radius:20px;padding:4px 9px;font-size:11px;font-weight:650}
.atlas-detail .atlas-tag-breed{background:#f6eff8;border-color:#e9d5ea}
.atlas-detail .atlas-tag.atlas-system{background:var(--tag-bg);color:var(--tag-ink);border-color:var(--tag-ink)}
.atlas-detail .atlas-split{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:12px;align-items:start}
.atlas-detail .atlas-media{background:#fff;border:1px solid #dce3ee;border-radius:13px;padding:10px;min-width:0;overflow:hidden}
.atlas-detail .atlas-media img{max-width:100%;height:auto;object-fit:contain;border-radius:9px}
.atlas-detail .atlas-species-gross{margin:10px 0;border:1px solid color-mix(in srgb,var(--gross-species-ink) 37%,white);border-radius:13px;padding:10px;background:color-mix(in srgb,var(--gross-species-bg) 32%,white)}
.atlas-detail .atlas-species-gross-title{display:flex;align-items:center;flex-wrap:wrap;gap:7px;color:#433961;margin:1px 3px 9px}
.atlas-detail .atlas-species-gross-title b{font-size:13px}
.atlas-detail .atlas-species-gross-title small{font-size:11px;color:#6b6b80}
.atlas-detail .atlas-species-gross-item{border:1px solid color-mix(in srgb,var(--gross-species-ink) 30%,white);border-radius:9px;margin:6px 0;overflow:hidden;background:white}
.atlas-detail .atlas-species-gross-item summary{cursor:pointer;padding:9px 12px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;background:color-mix(in srgb,var(--gross-species-bg) 43%,white);color:#42345e;list-style-position:inside}
.atlas-detail .atlas-species-gross-item[open] summary{border-bottom:1px solid #e7dfed}
.atlas-detail .atlas-species-label{font-size:12px;font-weight:850}
.atlas-detail .atlas-species-clue{font-size:11px;color:#687087;margin-left:auto}
.atlas-detail .atlas-species-gross-text{padding:11px 13px;font-size:12px;line-height:1.55;color:#30405a}
.atlas-detail .atlas-species-gross-text strong{color:#49336c}
.atlas-detail .atlas-gross{background:#fff;border:1px solid #d6dbed;border-radius:13px;padding:12px;line-height:1.52;font-size:13px}
.atlas-detail .atlas-gross-hint{background:#f3e5f7;border:1px solid #d9b5e8;border-radius:9px;padding:7px 9px;font-size:11px;font-weight:850;color:#643b7c;margin:10px 0 0}
.atlas-detail .atlas-gross h4{margin:0 0 7px;color:#384278;font-size:14px}
.atlas-detail .atlas-key{display:flex;align-items:flex-start;gap:10px;background:linear-gradient(105deg,#ecd6fa,#fbe7f1);border:2px solid #b477cb;border-left:5px solid #8a43af;border-radius:13px;padding:12px 14px;margin:13px 0;font-size:13px;box-shadow:0 3px 12px #72459316}
.atlas-detail .atlas-key .atlas-star{font-size:24px;color:#7b379e;line-height:1.1}
.atlas-detail .atlas-key strong{font-size:15px;color:#472159;white-space:nowrap;font-weight:950;letter-spacing:.015em}.atlas-detail .atlas-key>span:last-child{color:#362944;font-weight:730;line-height:1.5}
.atlas-detail .atlas-panel{border:1px solid #ded6ed;border-radius:12px;margin:7px 0;overflow:hidden;background:#fff}
.atlas-detail .atlas-panel summary{padding:10px 12px;background:color-mix(in srgb,var(--panel-bg,#f6f1fb) 42%,white);border-left:3px solid var(--panel-ink,#a98bc9);color:#3e3462;font-weight:800;cursor:pointer;list-style-position:inside}
.atlas-detail .atlas-panel .atlas-panel-body{padding:9px 13px;font-size:13px;line-height:1.5}
.atlas-detail .atlas-panel .atlas-panel-body p{margin:2px 0 7px}
.atlas-detail .atlas-footer{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;padding-top:9px;border-top:1px solid #e0deea}
.atlas-detail .atlas-footer button{font-size:12px!important;padding:6px 9px!important;border-radius:10px!important}
.atlas-detail .atlas-mini-meta{display:flex;flex-wrap:wrap;gap:6px;margin:9px 0}
.atlas-detail .atlas-note-content{color:#36455e}
.atlas-detail .atlas-empty-note{font-size:12px;color:#617089;font-style:italic}
.atlas-detail .atlas-note-edit{font-size:11px!important;padding:5px 9px!important;margin-top:7px;background:#f5f0fb!important}
.atlas-detail .atlas-mechanism-strip{background:linear-gradient(115deg,#f2ecfb,#e9f6fa);border:1px solid #d6bfeb;border-radius:11px;padding:11px;margin-bottom:8px}.atlas-detail .atlas-mechanism-strip>b{display:block;color:#503873;font-size:12px;margin-bottom:9px}.atlas-detail .atlas-mechanism-steps{display:flex;gap:5px;align-items:center;flex-wrap:wrap}.atlas-detail .atlas-mechanism-step{background:white;color:#3f4564;border:1px solid #d8d3e9;border-radius:20px;padding:5px 9px;font-size:11px;font-weight:850}.atlas-detail .atlas-mechanism-arrow{color:#805ca8;font-weight:900}.atlas-detail .atlas-mechanism-details{border:1px solid #e1d7ec;border-radius:10px;background:white}.atlas-detail .atlas-mechanism-details summary{background:#faf6fe!important;border:0!important;border-radius:10px;cursor:pointer;font-size:12px!important;padding:9px 11px!important}.atlas-detail .atlas-mechanism-explanation{padding:11px;font-size:12px;line-height:1.6}.atlas-detail .atlas-mechanism-explanation strong{color:#50396e}
.atlas-detail .atlas-caption{font-size:11px;color:#5c6980}
.atlas-detail .atlas-classifications details{margin-top:6px;padding:8px 10px;border:1px solid #e4dfec;border-radius:11px;background:#fbfaff}
.atlas-detail .atlas-classifications details summary{font-size:12px;font-weight:750}
/* Pathology Atlas main cabinet: restore the original compact modal footprint.
   Keep the updated atlas text hierarchy and all specimen-detail typography intact. */
.modal:has(> #modalBody .atlas-hub){width:min(900px,calc(100vw - 28px));max-width:900px;max-height:92vh}
/* Specimen DETAIL only: readable typography and a slightly wider dialog.
   Deliberately never change the shared modal, game stage, other rooms or hub. */
.modal:has(> #modalBody .atlas-detail){width:min(780px,100%);max-height:92vh}
.modal:has(> #modalBody .atlas-detail) #modalBody{padding:14px 18px}
.modal #modalBody .atlas-detail{font-size:15px!important;line-height:1.58}
.modal #modalBody .atlas-detail .atlas-gross{font-size:15px!important;line-height:1.62!important;padding:15px}
.modal #modalBody .atlas-detail .atlas-gross h4{font-size:15px!important}
.modal #modalBody .atlas-detail .atlas-species-gross-text{font-size:14.5px!important;line-height:1.65!important}
.modal #modalBody .atlas-detail .atlas-species-label{font-size:14px!important}
.modal #modalBody .atlas-detail .atlas-species-clue{font-size:12.5px!important}
.modal #modalBody .atlas-detail .atlas-species-gross-title b{font-size:14px!important}
.modal #modalBody .atlas-detail .atlas-panel .atlas-panel-body,
.modal #modalBody .atlas-detail .atlas-note-content{font-size:14.5px!important;line-height:1.64!important}
.modal #modalBody .atlas-detail .atlas-panel summary{font-size:15px!important;line-height:1.45!important}
.modal #modalBody .atlas-detail .atlas-key{font-size:15px!important;line-height:1.53!important}
.modal #modalBody .atlas-detail .atlas-key strong{font-size:16px!important}
.modal #modalBody .atlas-detail .atlas-mechanism-strip>b{font-size:13.5px!important}
.modal #modalBody .atlas-detail .atlas-mechanism-step{font-size:12.5px!important}
.modal #modalBody .atlas-detail .atlas-mechanism-explanation{font-size:14.5px!important}
.modal #modalBody .atlas-detail .atlas-heading h3{font-size:19px!important}
.modal #modalBody .atlas-detail .atlas-caption{font-size:12.5px!important}
@media(max-width:650px){
 .modal:has(> #modalBody .atlas-detail){width:calc(100vw - 12px);max-height:96vh}
 .modal:has(> #modalBody .atlas-detail) #modalBody{padding:10px 11px}
 .atlas-detail .atlas-split{grid-template-columns:minmax(0,1fr)}
 .atlas-detail .atlas-key{flex-wrap:wrap}
}
@media(max-width:610px){.atlas-detail .atlas-split{grid-template-columns:minmax(0,1fr)}.atlas-detail .atlas-heading h3{font-size:15px!important}.atlas-detail .atlas-key{flex-wrap:wrap}.atlas-detail .atlas-key strong{white-space:normal}}
</style>`;
function atlasShell(body,isDetail=false){return atlasStyle+'<div class="'+(isDetail?'atlas-detail':'atlas-hub')+'">'+body+'</div>'}

function modal(title,body){if(ui)ui.showModal(title,/^(🔬 Necropsy · Specimen Cabinet|🔬 Specimen Cabinet · Normal Atlas)$/.test(title)?atlasShell(body):/^(Lecture \d+ · |🌱 Normal reference · )/.test(title)?atlasShell(body,true):body)}
const nameSorter=new Intl.Collator(undefined,{sensitivity:'base',numeric:true,ignorePunctuation:true});
function isUncustomizedDuplicate(x){
 if(!x?.canonicalDuplicateOf)return false;
 const owner=window.VPQ_NECROPSY_OWNER_PUBLISH?.getSpecimen?.(x.id);
 const draft=edits()[x.id];
 // Never suppress an older ID if it contains published text, photographs or local edits.
 const hasPhotos=!!(owner?.photos?.length||owner?.photo?.url);
 const hasText=!!(owner?.text&&Object.keys(owner.text).length);
 const hasDraft=!!(draft&&Object.keys(draft).length);
 return !(hasPhotos||hasText||hasDraft);
}
function visible(){
 refreshCustom();
 const hidden=new Set(window.VPQ_NECROPSY_OWNER_PUBLISH?.getHiddenSpecimens?.()||[]);
 const items=base.map((v,i)=>Object.assign({index:i},record(i))).filter(x=>!hidden.has(x.id)&&!isUncustomizedDuplicate(x)&&((tab==='normals')===!!x.normal)&&(tab==='normals'?(normalSystem==='all'||x.system===normalSystem):((filter==='all'||x.lecture===filter)&&(scopeFilter==='all'||(scopeFilter==='reference'?x.catalogScope==='reference':x.catalogScope!=='reference'))))&&(etiologyFilter==='all'||window.VPQ_PATH_ATLAS_META?.etiologyMatches?.(x,etiologyFilter))&&(speciesFilter==='all'||window.VPQ_PATH_ATLAS_META?.speciesMatches?.(x,speciesFilter,frequencyFilter))&&(conditionFilter==='all'||window.VPQ_PATH_ATLAS_META?.data?.(x)?.conditionType===conditionFilter)&&(subtypeFilter==='all'||window.VPQ_PATH_ATLAS_META?.data?.(x)?.conditionSubtype===subtypeFilter)&&(systemFilter==='all'||window.VPQ_PATH_ATLAS_META?.data?.(x)?.organSystem===systemFilter)&&(zoonoticFilter==='all'||window.VPQ_PATH_ATLAS_META?.data?.(x)?.zoonotic===zoonoticFilter)&&(frequencyFilter==='all'||speciesFilter!=='all'||Object.values(window.VPQ_PATH_ATLAS_META?.data?.(x)?.species||{}).includes(frequencyFilter))&&(!search||[x.title,x.lecture,x.system,x.species,x.gross,x.histo,x.why,x.pathogenNames,x.diseaseId,window.VPQ_PATH_ATLAS_META?.data?.(x)?.pathogen,...(window.VPQ_PATH_ATLAS_META?.data?.(x)?.breedTags||[]),...(window.VPQ_PATH_ATLAS_META?.data?.(x)?.breedSizes||[])].join(' ').toLowerCase().includes(search)));
 // Sort the displayed cards only. Their immutable IDs and original indices
 // remain unchanged so drafts, published images, and edit buttons still match.
 return items.sort((a,b)=>nameSorter.compare(a.title||'',b.title||'')||nameSorter.compare(String(a.lecture||''),String(b.lecture||''))||a.index-b.index);
}
function start(k){listPage=0;mode=k||'gross';tab='lesions';filter='all';normalSystem='all';menu()}
function studyLecture(lecture){listPage=0;tab='lesions';mode='gross';filter=String(lecture||'all');normalSystem='all';search='';etiologyFilter=speciesFilter=frequencyFilter=conditionFilter=subtypeFilter=systemFilter=zoonoticFilter='all';refreshCustom();menu()}
function showTab(kind){tab=kind==='normals'?'normals':'lesions';mode='gross';filter='all';normalSystem='all';search='';refreshCustom();menu()}
// Accessible alphabetical dividers, generated only for letters represented in filtered results.
function alphaKey(title){const first=String(title||'').trim().charAt(0).toUpperCase();return /^[A-Z]$/.test(first)?first:'#';}
function alphaGrid(items,draw){
 let last='';
 return items.map(x=>{
  const letter=alphaKey(x.title),header=letter===last?'':'<div role="heading" aria-level="3" style="grid-column:1/-1;position:relative;margin:14px 0 3px;padding:7px 12px;background:#eaf1f9;border-left:4px solid #718fb1;border-radius:6px;font-size:15px;font-weight:850;letter-spacing:.06em">'+h(letter)+'</div>';
  last=letter;return header+draw(x);
 }).join('');
}
function menu(){
 const selected=visible();
 const pageSize=48,maxPage=Math.max(0,Math.ceil(selected.length/pageSize)-1);
 listPage=Math.min(Math.max(0,listPage),maxPage);
 const pageItems=selected.slice(listPage*pageSize,(listPage+1)*pageSize);
 const lectures=['all',...[...new Set(base.filter(x=>!x.normal).map(x=>String(x.lecture)))].sort(nameSorter.compare)];
 const tabs='<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 12px"><button data-path7-tab="lesions" aria-pressed="'+(tab==='lesions')+'" style="flex:1;min-width:130px;padding:11px;border:2px solid '+(tab==='lesions'?'#6b9cc8':'#cad7e5')+';border-radius:10px;font-weight:800;background:'+(tab==='lesions'?'#edf5ff':'white')+'">'+atlasIcon('flask')+' Disease specimens</button><button data-path7-tab="normals" aria-pressed="'+(tab==='normals')+'" style="flex:1;min-width:130px;padding:11px;border:2px solid '+(tab==='normals'?'#69a68a':'#cad7e5')+';border-radius:10px;font-weight:800;background:'+(tab==='normals'?'#edf9f1':'white')+'">'+atlasIcon('book')+' Normals · reference atlas</button></div>';
 if(tab==='normals'){
  const systems=['all',...new Set(base.filter(x=>x.normal).map(x=>x.system))];
  const selected=visible();
  return modal('🔬 Specimen Cabinet · Normal Atlas',
   tabs+
   '<div class="buttonrow" style="margin:8px 0"><button data-path7-add="normal" style="background:#e5f6eb;font-weight:800">➕ Add normal card</button><button data-path7-manage-hidden="1">Hidden cards / restore</button></div>'+
   '<p style="font-size:13px;margin:6px 0 11px">Recognize <b>healthy gross anatomy and histology</b> before evaluating diseased tissue. Normal variation depends on species, organ site, age, and physiologic state. Photographs are added and published through the existing specimen editor.</p>'+
   '<label style="display:block;font-size:12px;font-weight:700">System<select data-path7-normal-system="1" style="display:block;width:100%;max-width:380px;padding:9px;margin:5px 0 9px;border-radius:8px;background:white"><option value="all">All systems</option>'+systems.filter(x=>x!=='all').map(x=>'<option value="'+h(x)+'"'+(normalSystem===x?' selected':'')+'>'+h(x)+'</option>').join('')+'</select></label>'+
   '<label style="display:block;font-size:12px">Search normal structures<input id="path7Search" data-path7-search="1" style="display:block;width:100%;max-width:380px;padding:9px;margin:5px 0 9px" value="'+h(search)+'" placeholder="e.g. cerebellum, placenta, cornea"></label>'+
   '<p class="tiny"><b>'+selected.length+' normal references</b> shown. Image placeholders are not published photographs.</p>'+
   '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:9px">'+alphaGrid(selected,x=>'<button data-path7-card="'+x.index+'" style="text-align:left;padding:12px;border:1px solid #bbd9c5;border-radius:11px;background:#fafffb"><b>'+h(x.title)+'</b><small style="display:block;margin:5px 0">'+h(x.system)+'</small><small style="display:block;color:#60758a">'+h(x.species)+'</small></button>')+'</div>'+
   '<div class="buttonrow"><button data-path7-library="1">📷 Published photo library</button><button data-path7-differentials="1">Differential cases</button></div>');
 }
 modal('🔬 Necropsy · Specimen Cabinet',
 tabs+
 '<div class="buttonrow" style="margin:8px 0"><button data-path7-add="lesion" style="background:#e5f6eb;font-weight:800">+ Add specimen card</button><button data-path7-manage-hidden="1">🗂 Hidden cards / restore</button></div>'+
 '<p><b>Gross photograph → lesion description → morphologic diagnosis → histology → pathogenesis.</b> This is an exam study bank built from the uploaded lectures, with original summaries and spaces for your editable images and annotations.</p>'+
 '<div class="atlas-actions atlas-utilities"><button data-path7-library="1">'+atlasIcon('camera')+' Published photos</button><button data-path7-differentials="1">'+atlasIcon('book')+' Differential cases</button><button data-path7-test="all">'+atlasIcon('brain')+' Morphologic unknowns</button></div>'+
 '<details data-path7-filters="1" class="atlas-filter-panel" '+(filtersOpen?'open':'')+'><summary><b>'+atlasIcon('filter')+' Filter specimens</b><span class="atlas-filter-count">'+([scopeFilter!=='all',etiologyFilter!=='all',speciesFilter!=='all',frequencyFilter!=='all',conditionFilter!=='all',subtypeFilter!=='all',systemFilter!=='all',zoonoticFilter!=='all'].filter(Boolean).length||'All')+' selected</span></summary><div class="atlas-filter-grid">'+
 '<label>Collection<select data-path7-collection-filter="1"><option value="all"'+(scopeFilter==='all'?' selected':'')+'>All collections</option><option value="course"'+(scopeFilter==='course'?' selected':'')+'>Course exams</option><option value="reference"'+(scopeFilter==='reference'?' selected':'')+'>Beyond Exams / Reference</option></select></label>'+
 '<label>Etiology<select data-path7-etiology-filter="1"><option value="all">All etiologies</option>'+Object.entries(window.VPQ_PATH_ETIOLOGY?.categories||{}).map(([k,v])=>'<option value="'+h(k)+'"'+(etiologyFilter===k?' selected':'')+'>'+h(v.label)+'</option>').join('')+'</select></label>'+
 (function(){const m=window.VPQ_PATH_ATLAS_META;const choose=(name,value,items,placeholder)=>'<label style="font-size:12px">'+name+'<select data-path7-metadata-filter="'+name+'" style="display:block;width:100%;padding:7px;margin-top:4px"><option value="all">'+placeholder+'</option>'+Object.entries(items||{}).map(([k,label])=>'<option value="'+h(k)+'"'+(value===k?' selected':'')+'>'+h(label)+'</option>').join('')+'</select></label>';return choose('species',speciesFilter,{...m?.species,multiple:'Multiple species / broad host range'},'All species')+choose('frequency',frequencyFilter,m?.frequency,'Any occurrence')+choose('condition',conditionFilter,m?.conditionTypes,'All condition types')+choose('subtype',subtypeFilter,m?.subtypes,'All pathogen / tumor groups')+choose('system',systemFilter,m?.systems,'All organ systems')+choose('zoonotic',zoonoticFilter,m?.zoonotic,'All zoonotic statuses')})()+
 '</div><div class="buttonrow"><button data-path7-filter-reset="1" style="font-size:12px">↺ Clear all atlas filters</button></div><p class="tiny">Only verified or manually classified species appear in species-filtered results. Missing tags mean unassessed, not unaffected. Filters combine with the lecture and etiology selections.</p></details>'+ 
'<div class="atlas-lectures">'+lectures.map(l=>{const c=ATLAS_EXAMS[atlasExam(l)]||['#F0ECF9','#8671B6'];return '<button data-path7-filter="'+h(l)+'" style="--lecture-bg:'+c[0]+';--lecture-ink:'+c[1]+'" aria-pressed="'+(filter===l?'true':'false')+'">'+(l==='all'?'All lectures':l==='8'?'L8 · Cell Accumulations*':l==='9'?'L9 · Morphologic DX':'L'+h(l))+'</button>'}).join('')+'</div>'+
 '<p class="tiny"><b>'+selected.length+' matching atlas cards.</b> Showing '+(selected.length?listPage*pageSize+1:0)+'–'+Math.min(selected.length,(listPage+1)*pageSize)+'. *The uploaded Cell Accumulations PDF is file 8 but its title slide says Lecture 9. The separate file 9 teaches morphologic vs etiologic diagnosis. Photo slots are editable; instructor photographs are not copied into this public game.</p>'+ 
 '<label style="display:block;margin:8px 0">Find disease or lesion <input id="path7Search" data-path7-search="1" placeholder="e.g. pyometra, optic nerve, granuloma" value="'+h(search)+'" style="width:min(100%,430px);padding:9px;border:1px solid #bccbe0;border-radius:9px"></label>'+ 
 '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px">'+alphaGrid(pageItems,x=>{const ex=x.catalogScope==='reference'?null:atlasExam(x.lecture),ec=ATLAS_EXAMS[ex]||['#EDF0F5','#708096'],sys=atlasSystem(x);return '<button class="atlas-index-card" style="text-align:left;--card-accent:'+sys[4]+';--card-bg:'+ec[0]+';--system-bg:'+sys[3]+';--system-ink:'+sys[4]+'" data-path7-card="'+x.index+'"><strong>'+h(x.title)+'</strong><small>Lecture '+h(x.lecture)+(ex?' · Exam '+ex:' · Reference')+'</small><small class="atlas-system-line">'+atlasIcon(ATLAS_ICON_KEYS[sys[0]],15)+' '+h(sys[2])+'</small></button>'})+'</div>'+
 (maxPage?'<div class="buttonrow" style="justify-content:center;gap:10px;margin:14px 0"><button data-path7-page="'+(listPage-1)+'" '+(listPage===0?'disabled':'')+'>← Previous 48</button><span style="align-self:center;font-size:12px">Page '+(listPage+1)+' of '+(maxPage+1)+'</span><button data-path7-page="'+(listPage+1)+'" '+(listPage===maxPage?'disabled':'')+'>Next 48 →</button></div>':'') );
}
function card(i){
 current=i;const x=grossViewModel(record(i)),shelf=visible(),at=shelf.findIndex(v=>v.index===i);
 const previous=at>0?shelf[at-1]:null,next=at>=0&&at<shelf.length-1?shelf[at+1]:null;
 const nav='<div class="buttonrow" style="margin:0 0 10px"><button data-path7-back="1">← Back to '+(tab==='normals'?'Normals Atlas':'Disease Atlas')+'</button><button data-path7-view="'+(previous?.index??'')+'" '+(!previous?'disabled':'')+'>◀ Previous</button><button data-path7-view="'+(next?.index??'')+'" '+(!next?'disabled':'')+'>Next specimen ▶</button></div>'+
 '<p class="tiny">'+(at>=0?('Specimen '+(at+1)+' of '+shelf.length+' · '):'')+'Browse within your current tab, search and filter.</p>';
 const gallery=window.VPQ_NECROPSY_OWNER_PUBLISH?.specimenPhotoHTML?.(x.id)||'';
 const publicPhotos=Array.isArray(x.publicLecturePhotos)?x.publicLecturePhotos:[];
 const publicGallery=publicPhotos.length?'<div style="display:grid;gap:9px">'+publicPhotos.map(p=>'<figure style="margin:0;border:1px solid #d8ddea;border-radius:12px;padding:7px"><img alt="'+h(p.caption)+'" src="'+h(p.asset)+'" style="display:block;width:100%;max-height:430px;object-fit:contain"><figcaption style="font-size:12px;line-height:1.4;margin-top:5px"><b>'+h(p.caption)+'</b> · '+h(p.source)+'<div>'+h(p.studyPrompt)+'</div></figcaption></figure>').join('')+'</div>':'';
 const lectureGallery=Number.isInteger(x.lectureAtlasSection)?[0,1].flatMap(slot=>window.VPQ_NECROPSY_OWNER_PUBLISH?.getLecturePhotos?.('L'+x.lecture+'-S'+x.lectureAtlasSection+'-P'+slot)||[]).filter(p=>/^https:\/\//i.test(String(p.url||''))).map(p=>'<figure style="margin:5px 0 10px;border:1px solid #cbdbea;padding:8px;border-radius:10px"><img src="'+h(p.url)+'" alt="'+h(p.caption||'Published lecture photo')+'" loading="lazy" style="width:100%;max-height:430px;object-fit:contain"><figcaption style="font-size:12px;margin-top:7px"><b>'+h(p.type||'Lecture photograph')+'</b> · '+h(p.caption||'Owner-published lecture image')+'</figcaption></figure>').join(''):'';
 const media=gallery||publicGallery||lectureGallery||(x.image?'<img alt="Local pathology image" src="'+h(x.image)+'" style="max-width:100%;max-height:330px;object-fit:contain;border:1px solid #d8ddea;border-radius:12px">':'<div style="min-height:160px;display:grid;place-items:center;padding:16px;border:2px dashed #bbc4da;border-radius:12px;background:#fbf8ff;text-align:center">📷 Editable gross / H&E image slot</div>');
 const exam=x.catalogScope==='reference'?null:atlasExam(x.lecture),theme=ATLAS_EXAMS[exam]||['#e8edf5','#61758c'],sys=atlasSystem(x);
 const meta=window.VPQ_PATH_ATLAS_META?.data?.(x)||{};
 const quickClue=String(x.visualClue||x.compare||'').trim();
 const compactKey=quickClue?quickClue.slice(0,310):'Identify the species, characteristic location and lesion pattern; use histology and history to distinguish look-alike conditions.';
 const diff=window.VPQ_NECROPSY_DIFFERENTIAL_LAB;
 const related=x.normal?[]:diff?.exam7Matches?.(x.lecture,x.title)||[];
 const details=(title,content,open=false)=>'<details class="atlas-panel" style="--panel-bg:'+sys[3]+';--panel-ink:'+sys[4]+'" '+(open?'open':'')+'><summary>'+title+'</summary><div class="atlas-panel-body">'+content+'</div></details>';
 const hasKey=Boolean(!x.normal);
 const header='<div class="atlas-heading" style="--exam-bg:'+theme[0]+';--exam-ink:'+theme[1]+'"><h3>'+h(x.title)+'</h3><div class="atlas-chipline"><span class="atlas-exam-tag">'+(exam?'Exam '+exam:'Reference Library')+' · L'+h(x.lecture)+'</span>'+atlasCardTags(x)+'</div></div>';
 const caseLinks=related.length?'<div class="atlas-small-links buttonrow">'+related.slice(0,4).map(c=>'<button data-path7-navle-case="'+h(c.id)+'">🩺 '+h(c.sourceCaseId||'Case')+'</button>').join('')+(related.length>4?'<span class="atlas-caption">+'+(related.length-4)+' cases</span>':'')+'</div>':'';
 const mediaHTML='<div class="atlas-media"><div class="atlas-caption" style="margin:0 0 8px">📷 '+photoStatus(x)+' · Gross, histology and causal-agent photos</div>'+media+'</div>';
 const grossCount=parseGrossSpecies(x.grossSpecies).length;
 const grossHTML='<div class="atlas-gross"><h4>📋 '+(x.normal?'Normal appearance':'Gross description')+'</h4>'+rich(x.gross)+(grossCount?'<p class="atlas-gross-hint">'+atlasIcon('book',15)+' '+grossCount+' expandable species / comparison sections below ↓</p>':'')+'</div>';
 const keyHTML=hasKey?'<div class="atlas-key"><span class="atlas-star" aria-hidden="true">☆</span><strong>Key distinction</strong><span>'+rich(compactKey)+'</span></div>':'';
 const sectionHTML=
   details(x.normal?'Normal identification':atlasIcon('flask')+' Morphologic diagnosis','<p>'+rich(x.dx)+'</p>',x.normal)+
   details(atlasIcon('flask')+' '+(x.normal?'Normal histology':'Histology'),'<p>'+rich(x.histo)+'</p>',true)+
   details(atlasIcon('brain')+' '+(x.normal?'Normal vs abnormal':'Why it happens / pathogenesis'),pathogenesisContent(x),true)+
   (x.compare&&x.compare!==quickClue?details('⚖️ Don’t confuse with','<p>'+rich(x.compare)+'</p>'): '')+
   '';
 const studyNotes=details(atlasIcon('notes')+' Study notes & annotations',
  '<div class="atlas-note-content">'+(String(x.notes||'').trim()?rich(x.notes):'<p class="atlas-empty-note">No study notes added yet. Keep lecture pearls, mnemonics and personal observations here without repeating the main pathology explanation.</p>')+'</div>'+
  '<button data-path7-edit="'+i+'" class="atlas-note-edit">'+atlasIcon('notes',14)+' Edit notes</button>',true);
 const speciesBreeds=x.normal?'':(meta.breedTags?.length||meta.breedSizes?.length?'<div class="atlas-mini-meta"><b style="font-size:12px">Breed associations:</b> '+[...(meta.breedSizes||[]).map(z=>window.VPQ_PATH_ATLAS_META?.breedSizes?.[z]||z),...(meta.breedTags||[])].map(z=>'<span class="atlas-tag">'+h(z)+'</span>').join('')+'</div>':'');
 const classification=x.normal?'':'<div class="atlas-classifications">'+(window.VPQ_PATH_ATLAS_META?.browseHTML?.(x)||'')+(window.VPQ_PATH_ETIOLOGY?.cardHTML?.(x)||'')+'</div>';
 const source='<details class="atlas-panel"><summary>📖 Study source & details</summary><div class="atlas-panel-body">'+h(x.source||'Not recorded')+'</div></details>';
 const crosslink=x.normal?'':(window.VPQ_PATH_ATLAS_META?.relatedHTML?.(x,base.map((b,j)=>record(j)),id=>base.findIndex(c=>c.id===id))||'');
 const master=window.VPQ_MASTER_DISEASE_LIBRARY?.diseaseForSpecimen?.(x.id);
 const footer='<div class="atlas-footer">'+
  '<button data-path7-back="1">← Atlas</button>'+
  (x.normal?'':'<button data-path7-navle-lecture="'+h(x.lecture)+'">🩺 Related cases</button>')+
  (Number.isInteger(x.lectureAtlasSection)?'<button data-path7-gi-learn="'+h(x.lecture)+'">📖 Lecture notes</button>':'')+
  (master?'<button data-path7-master="'+h(x.id)+'">🔗 Related systems</button>':'')+
  '<button data-path7-edit="'+i+'">✏️ Edit card</button>'+
  '<button data-path7-owner-publish="'+i+'">🚀 Edit / Publish</button>'+
  '<button data-path7-hide="'+i+'">🗂 Hide</button></div>';
 modal((x.normal?'🌱 Normal reference · ':'Lecture '+h(x.lecture)+' · ')+h(x.title),
 nav+
 header+
 keyHTML+
 '<div class="atlas-split">'+mediaHTML+grossHTML+'</div>'+
 renderGrossSpecies(x,sys)+
 sectionHTML+studyNotes+speciesBreeds+
 (caseLinks?'<div class="atlas-small-links"><b style="font-size:12px">🩺 Exact linked cases</b>'+caseLinks+'</div>':'')+
 classification+source+crosslink+footer);

}
function edit(i){
 current=i;const x=record(i);
 modal('✏️ Necropsy image and notes · '+h(x.title),
 '<p>Save Draft keeps your photo and annotations in this browser. To make a photo visible on every device, select <b>🚀 Publish photo now</b> after saving the draft. The public publishing step is owner-authorized.</p>'+
 '<label>Image URL<input id="path7Url" style="width:100%" value="'+h(x.image||'')+'" placeholder="https://…"></label>'+
 '<label>Or choose a photo from your device<input id="path7File" type="file" accept="image/*"></label>'+
 '<label>'+(x.normal?'Normal gross anatomy':'Gross lesion')+'<textarea id="path7Gross" rows="3" style="width:100%">'+h(x.gross)+'</textarea></label>'+
 speciesGrossEditorHTML(x)+
 '<label>'+(x.normal?'Normal identification':'Morphologic DX')+'<textarea id="path7Dx" rows="2" style="width:100%">'+h(x.dx)+'</textarea></label>'+
 '<label>'+(x.normal?'Normal histology':'Histology')+'<textarea id="path7Histo" rows="2" style="width:100%">'+h(x.histo)+'</textarea></label>'+
 '<label>Pathogenesis summary (optional, use arrows → between stages)<input id="path7MechanismSummary" style="width:100%;padding:8px" value="'+h(x.mechanismSummary||'')+'" placeholder="e.g. Venous obstruction → congestion → edema → ischemia → necrosis"></label>'+
 '<label>Quick visual recognition clue<textarea id="path7VisualClue" rows="2" style="width:100%">'+h(x.visualClue||'')+'</textarea></label>'+ 
 '<label>Don’t confuse with / distinguishing differentials<textarea id="path7Compare" rows="3" style="width:100%">'+h(x.compare||'')+'</textarea></label>'+ 
'<label>Instructor annotations / personal clues<textarea id="path7Notes" rows="3" style="width:100%">'+h(x.notes||'')+'</textarea></label>'+
 (x.normal?'':(window.VPQ_PATH_ETIOLOGY?.editorHTML?.(x)||'')+(window.VPQ_PATH_ATLAS_META?.editorHTML?.(x)||'')) +
 '<div class="buttonrow"><button data-path7-save="'+i+'">💾 Save Draft</button><button data-path7-owner-publish="'+i+'">🚀 Publish photo now</button><button data-path7-view="'+i+'">Cancel</button></div>');
}
function saveForm(i){
 const val=n=>ui.body.querySelector('#'+n)?.value||'';
 const part={image:val('path7Url').trim(),gross:val('path7Gross'),dx:val('path7Dx'),histo:val('path7Histo'),notes:val('path7Notes'),visualClue:val('path7VisualClue'),compare:val('path7Compare'),grossSpecies:readGrossSpecies(ui.body),mechanismSummary:val('path7MechanismSummary'),...(window.VPQ_PATH_ETIOLOGY?.readEditor?.(ui.body)||{}),...(window.VPQ_PATH_ATLAS_META?.readEditor?.(ui.body)||{})};
 const finish=()=>{if(save(i,part))card(i);else modal('Local storage full','<p>This image is too large for your browser storage. Try a smaller image or a URL.</p><button data-path7-edit="'+i+'">Back to editor</button>')};
 const file=ui.body.querySelector('#path7File')?.files?.[0];
 if(!file)return finish();
 if(!file.type.startsWith('image/'))return;
 const reader=new FileReader();
 reader.onload=()=>{const img=new Image();img.onload=()=>{const factor=Math.min(1,700/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*factor));canvas.height=Math.max(1,Math.round(img.height*factor));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);part.image=canvas.toDataURL('image/jpeg',0.67);finish()};img.src=String(reader.result)};
 reader.readAsDataURL(file);
}
// Morphologic diagnosis teaching format follows the uploaded instructor lecture:
// lesion description -> organ/process/modifiers/distribution -> supported time and
// severity -> etiologic interpretation. A disease name alone is NOT a morphologic DX.
// Instructor-format coaching examples: model formulations are teaching interpretations,
// not verbatim answers from the instructor's slides. Original atlas fields remain editable.
const MORPH_MODELS={
 'exam7-3':{m:'Leptomeninges: diffuse suppurative meningitis.',e:'Septic bacterial infection is a likely cause in a neonate; organism requires diagnostic confirmation.',why:'Yellow-white exudate follows meningeal surfaces; neutrophils in the subarachnoid space support suppurative inflammation.',omit:'No defensible lesion age or severity from the brief description alone.'},
 'exam7-5':{m:'Brain: multifocal hemorrhagic and necrotizing vasculitis with thrombosis (thrombotic meningoencephalitis).',e:'Histophilus somni is an important suspected cause in feedlot cattle, pending supporting tests.',why:'Vascular fibrin thrombi and necrotizing vasculitis link multifocal hemorrhage to ischemic injury.',omit:'Do not add chronicity from distribution or red discoloration.'},
 'exam7-6':{m:'Brain: focal suppurative encephalitis (abscess).',e:'Bacterial infection is suspected; a specific bacterial species cannot be determined from gross appearance.',why:'A single localized soft, pale lesion with histologic neutrophils supports an abscess.',omit:'Encapsulation or chronicity requires additional evidence.'},
 'exam7-9':{m:'Cerebellum: diffuse hypoplasia.',e:'Congenital cerebellar hypoplasia; an infectious, genetic or other developmental cause requires further investigation.',why:'A small but formed cerebellum indicates underdevelopment rather than destruction of previously mature tissue.',omit:'Developmental defects are not automatically acute or chronic inflammatory lesions.'},
 'exam7-17':{m:'Skin of muzzle/oral region: multifocal proliferative, crusting dermatitis.',e:'Contagious ecthyma (orf; parapoxvirus) is a differential in young small ruminants.',why:'The pattern is proliferative and crusting; species, age and distribution prioritize orf, but gross appearance alone is not definitive.',omit:'Crusting alone does not establish lesion age or severity.'},
 'exam7-23':{m:'Skin: superficial pustular dermatitis with subcorneal acantholysis.',e:'Pemphigus foliaceus is a likely immune-mediated diagnosis; confirm using the pattern and relevant workup.',why:'The level of the pustule and acantholytic keratinocytes carry more diagnostic weight than crusts alone.',omit:'Do not assign severity without extent and clinical context.'},
 'exam7-25':{m:'Skin: multifocal ischemic necrosis with necrotizing vasculitis (when histologically confirmed).',e:'Possible immune-mediated, infectious, drug-associated or other vascular injury; cause remains undetermined.',why:'Purpura and sharply demarcated necrosis raise vascular injury; biopsy is needed to establish vasculitis.',omit:'Black tissue alone is insufficient to label chronicity or etiology.'},
 'exam7-29':{m:'Uterus: cystic endometrial hyperplasia with suppurative endometritis.',e:'CEH–pyometra complex; bacterial infection can complicate progesterone-associated endometrial changes.',why:'Cystic thickened endometrium plus purulent uterine contents supports two related lesions, not merely a disease label.',omit:'Do not infer acute versus chronic from the name alone; assess histologic duration.'},
 'exam7-36':{m:'Pinna: focal ischemic coagulative necrosis.',e:'Consider vascular compromise (including vasculitis or thrombosis); etiology not established by gross appearance.',why:'A sharply demarcated dry dark lesion is compatible with infarction/ischemic necrosis, distinct from fluctuant hematoma.',omit:'Necrosis does not by itself specify chronicity.'},
 'exam7-37':{m:'Pinna: focal hemorrhage forming an auricular hematoma.',e:'Traumatic hemorrhage, often associated with vigorous head shaking from otitis; primary trigger requires investigation.',why:'Blood-filled fluctuant swelling is a hematoma. Organization and fibrosis establish an older/organizing component only when seen in the specimen.',omit:'Do not call this chronic based on swelling; organization/fibrosis are histologic evidence of repair.'},
 'exam7-39':{m:'Cornea: focal stromal necrosis (corneal sequestrum).',e:'Feline corneal sequestrum; predisposing ocular irritation or disease may be involved.',why:'A dark focal corneal lesion needs microscopic confirmation of necrotic stromal collagen; pigmentation is an alternative.',omit:'Dark discoloration alone does not establish chronicity.'},
 'exam7-40':{m:'Lens: bilateral degeneration with cataract formation.',e:'Diabetes-associated cataracts are a strong consideration in a diabetic dog; other causes remain possible.',why:'Bilateral lens opacity is the visible finding; swollen degenerating lens fibers define the tissue change.',omit:'Osmotic injury is pathogenesis, not the lesion distribution.'}
};
const MORPH_TEACHING=[
 ['Description','Record observable findings: tissue/location, number, distribution, dimensions, color, shape, consistency and special features. Avoid naming a disease in the description.'],
 ['Morphologic DX','Organ: primary process ± appropriate modifier, distribution, chronicity and severity when justified. Interpret what the lesion IS.'],
 ['Etiologic DX','Name the suspected cause/disease separately and justify it with signalment, histology, distribution and/or testing.']
];
function morphologyGuide(){
 return '<details style="border:1px solid #c5d4e7;border-radius:10px;padding:11px;margin:9px 0 12px;background:#f8faff"><summary><b>📖 Professor’s morphologic diagnosis framework</b></summary>'+
 MORPH_TEACHING.map(p=>'<p><b>'+p[0]+':</b> '+p[1]+'</p>').join('')+
 '<p><b>Form:</b> Organ: process ± modifier, distribution, chronicity, severity. <b>Do not guess</b> the last two categories.</p>'+
 '<p><b>Example supplied in your practice slides — canine brain:</b> multifocal to coalescing dark red-black lesions with blood-filled vascular spaces on histology. <b>Possible morphologic description:</b> Brain: multifocal to coalescing hemorrhagic neoplasia. <b>Etiologic diagnosis:</b> metastatic hemangiosarcoma. These model wording choices are teaching formulations, not a verbatim professor morphologic answer.</p>'+
 '<p class="tiny">Reference: uploaded “Morphologic Diagnosis vs Etiologic Diagnosis,” especially pp. 3–4 and 7–10. The other slide cases demonstrate the exercise structure but do not supply confirmed etiologic answers for every lesion.</p></details>';
}
function unknownValues(){
 const data={};
 for(const field of ['description','morphology','etiology']){
  const el=ui?.body?.querySelector?.('[data-unknown-field="'+field+'"]');
  if(el)data[field]=el.value;
 }
 unknownDraft[step]={...(unknownDraft[step]||{}),...data};
}
function unknownTextarea(field,label,help){
 const value=unknownDraft[step]?.[field]||'';
 return '<label style="display:block;margin:10px 0"><b>'+label+'</b><small style="display:block;color:#526981;margin:3px 0 5px">'+help+'</small><textarea data-unknown-field="'+field+'" rows="3" style="width:100%;padding:9px" placeholder="Write your answer before revealing">'+h(value)+'</textarea></label>';
}
function test(kind='coached'){
 tab='lesions';
 const eligible=visible().filter(x=>!x.normal);
 const chosen=kind==='all'?eligible:eligible.filter(x=>MORPH_MODELS[x.id]);
 quiz=chosen.sort(()=>Math.random()-.5).slice(0,12);
 step=0;revealed=false;unknownDraft={};question();
}
function question(){
 if(step>=quiz.length){modal('Practice completed','<p>Reviewed '+quiz.length+' lesion unknowns. Try again for additional cases.</p><button data-path7-back="1">Back to atlas</button>');return}
 const x=quiz[step];
 const model=MORPH_MODELS[x.id];
 const explanation=revealed?'<div class="response">'+
  (model?'<p><b>Example morphologic diagnosis:</b> '+h(model.m)+'</p><p><b>Etiologic diagnosis / differential:</b> '+h(model.e)+'</p><p><b>Why these terms fit:</b> '+h(model.why)+'</p><p><b>What not to assume:</b> '+h(model.omit)+'</p>':'<p><b>Atlas entry (not independently checked as formal morphology):</b> '+rich(x.dx)+'</p>')+
  '<p><b>Microscopic description:</b> '+rich(x.histo)+'</p>'+
  '<p><b>Etiology, mechanism, or reasoning from this card:</b> '+rich(x.why)+'</p>'+
  '<p><b>Check your morphology:</b> Did you name the organ, primary lesion process and observed distribution? Add modifiers only when supported by the gross or histologic findings. Chronicity requires evidence of lesion age (e.g., organization/fibrosis) and severity needs enough information to judge extent or damage; neither should be guessed.</p>'+
  '<p class="tiny"><b>Important:</b> Some older atlas DX fields are disease/etiologic labels rather than complete morphologic diagnoses. Treat this as a source reference, not a guaranteed model morphologic answer. We will review these individually.</p></div>':'';
 modal('🎓 Necropsy unknown '+(step+1)+' / '+quiz.length,
 '<p><b>Gross finding:</b> '+rich(x.gross)+'</p>'+(x.image?'<img alt="Gross pathology specimen" src="'+h(x.image)+'" style="max-width:100%;max-height:280px;object-fit:contain">':'')+
 morphologyGuide()+
 unknownTextarea('description','1. Gross lesion description','Location, number, distribution, size/color, shape, consistency and other OBSERVABLE features. No disease name yet.')+
 unknownTextarea('morphology','2. Morphologic diagnosis','Organ: process ± modifier, distribution; chronicity and severity ONLY when justified by observed changes.')+
 unknownTextarea('etiology','3. Etiologic diagnosis / differentials','What caused it? Include differential diagnoses and the evidence that helps separate them.')+
 explanation+
 '<div class="buttonrow">'+(revealed?'<button data-path7-nextq="1">Next unknown →</button>':'<button data-path7-reveal="1">Reveal instructor-style comparison →</button>')+'<button data-path7-back="1">Stop</button></div>');
}
function init(api){
 ui=api;
 window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.init(api);
 window.VPQ_NECROPSY_OWNER_PUBLISH?.init(api);
 window.VPQ_NECROPSY_OWNER_PUBLISH?.load?.().then(()=>{refreshCustom();if(ui===api&&api.body?.querySelector?.('[data-path7-tab]'))menu()}).catch(()=>{});
 api.body.addEventListener('change',ev=>{if(ev.target?.dataset?.path7CollectionFilter!==undefined){filtersOpen=true;listPage=0;scopeFilter=['all','course','reference'].includes(ev.target.value)?ev.target.value:'all';return menu()}if(ev.target?.dataset?.path7MetadataFilter!==undefined){filtersOpen=true;listPage=0;const k=ev.target.dataset.path7MetadataFilter,v=ev.target.value||'all';if(k==='species')speciesFilter=v;else if(k==='frequency')frequencyFilter=v;else if(k==='condition')conditionFilter=v;else if(k==='subtype')subtypeFilter=v;else if(k==='system')systemFilter=v;else if(k==='zoonotic')zoonoticFilter=v;return menu()}if(ev.target?.dataset?.path7EtiologyFilter!==undefined){filtersOpen=true;listPage=0;etiologyFilter=ev.target.value||'all';return menu()}if(ev.target?.dataset?.path7NormalSystem!==undefined){normalSystem=String(ev.target.value||'all');return menu()}if(ev.target?.dataset?.path7Search!==undefined){listPage=0;search=String(ev.target.value||'').toLowerCase().trim();menu()}},true);
 api.body.addEventListener('toggle',ev=>{if(ev.target?.dataset?.path7Filters!==undefined)filtersOpen=!!ev.target.open},true);
 api.body.addEventListener('click',ev=>{
  const b=ev.target.closest('button');if(!b)return;const d=b.dataset;
  if(!Object.keys(d).some(k=>k.startsWith('path7')))return;
  ev.preventDefault();ev.stopImmediatePropagation();
  if(d.path7AddSpeciesRow!==undefined){appendGrossSpeciesRow(api.body);return;}
  if(d.path7Why!==undefined){
  if(current<0||current>=base.length)return;
  const x=record(current),topic=d.path7Why;
  const sections=topic==='gross'
   ?'<p><b>Gross appearance:</b> '+rich(x.gross)+'</p><p><b>Why it appears:</b> '+rich(x.why)+'</p>'
   :topic==='histo'
   ?'<p><b>Microscopic lesion:</b> '+rich(x.histo)+'</p><p><b>Mechanism / why:</b> '+rich(x.why)+'</p><p><b>Morphologic diagnosis:</b> '+rich(x.dx)+'</p>'
   :'<p><b>Key distinction:</b> '+rich(x.why)+'</p><p><b>Use these findings:</b> '+rich(x.gross)+'</p><p><b>Histology:</b> '+rich(x.histo)+'</p>';
  modal('❔ '+h(x.title)+' · '+(topic==='gross'?'Why gross looks this way':topic==='histo'?'Microscopy and mechanism':'Distinguishing clues'),sections+'<p class="tiny">Drawn from this existing study card. Confirm specific interpretations with the lecture slides.</p><button data-path7-view="'+current+'">← Return to specimen</button>');return;
 }
 if(d.path7GiLearn!==undefined)return window.VPQ_NECROPSY_HANDBOOK?.openLecture?.(String(d.path7GiLearn));
 if(d.path7Master!==undefined)return window.VPQ_MASTER_DISEASE_LIBRARY?.openForSpecimen?.(d.path7Master);
 if(d.path7Scope!==undefined){listPage=0;filtersOpen=true;scopeFilter=['all','course','reference'].includes(d.path7Scope)?d.path7Scope:'all';filter='all';return menu()}
 if(d.path7FilterReset!==undefined){listPage=0;filter='all';scopeFilter='all';etiologyFilter=speciesFilter=frequencyFilter=conditionFilter=subtypeFilter=systemFilter=zoonoticFilter='all';search='';return menu()}
 if(d.path7Add!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.newSpecimenEditor?.(d.path7Add==='normal'?'normal':'lesion',tab==='normals'?'67':(filter==='all'?'68':filter));
 if(d.path7ManageHidden!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.hiddenSpecimenMenu?.();
 if(d.path7Hide!==undefined){const item=base[Number(d.path7Hide)];return item&&window.VPQ_NECROPSY_OWNER_PUBLISH?.hideSpecimenEditor?.(item.id,false)}
 if(d.path7Tab!==undefined){tab=d.path7Tab==='normals'?'normals':'lesions';search='';return menu()}
 if(d.path7Library!==undefined)return window.VPQ_NECROPSY_OWNER_PUBLISH?.photoLibrary?.();
 if(d.path7NavleCase!==undefined)return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.openCase?.(d.path7NavleCase);
 if(d.path7NavleLecture!==undefined)return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.openExam7Rounds?.(d.path7NavleLecture);
 if(d.path7Differentials!==undefined)return window.VPQ_NECROPSY_DIFFERENTIAL_LAB?.start(ui,filter);
 if(d.path7Mode!==undefined){tab='lesions';mode=d.path7Mode;return menu()}
  if(d.path7Page!==undefined){const n=Number(d.path7Page);if(Number.isInteger(n)&&n>=0){listPage=n;return menu()}return;}
  if(d.path7Filter!==undefined){listPage=0;filter=d.path7Filter;return menu()}
  if(d.path7Card!==undefined){const i=Number(d.path7Card);return mode==='edit'?edit(i):card(i)}
  if(d.path7Edit!==undefined)return edit(Number(d.path7Edit));
  if(d.path7View!==undefined){const n=Number(d.path7View);return Number.isInteger(n)&&n>=0&&n<base.length?card(n):menu()}
  if(d.path7Save!==undefined)return saveForm(Number(d.path7Save));
  if(d.path7OwnerPublish!==undefined){const i=Number(d.path7OwnerPublish);
   const field=api.body.querySelector('#path7Gross');
   if(field){const val=n=>api.body.querySelector('#'+n)?.value||'';
    save(i,{gross:val('path7Gross'),dx:val('path7Dx'),histo:val('path7Histo'),notes:val('path7Notes'),visualClue:val('path7VisualClue'),compare:val('path7Compare'),grossSpecies:readGrossSpecies(ui.body),mechanismSummary:val('path7MechanismSummary'),...(window.VPQ_PATH_ETIOLOGY?.readEditor?.(ui.body)||{}),...(window.VPQ_PATH_ATLAS_META?.readEditor?.(ui.body)||{})});}
   return window.VPQ_NECROPSY_OWNER_PUBLISH?.editor('specimen',base[i]?.id)
  }
  if(d.path7Back!==undefined)return menu();
  if(d.path7Test!==undefined)return test(d.path7Test==='all'?'all':'coached');
  if(d.path7Reveal!==undefined){unknownValues();revealed=true;return question()}
  if(d.path7Nextq!==undefined){unknownValues();step++;revealed=false;return question()}
 },true);
}
function openCard(id){refreshCustom();const i=base.findIndex(x=>x.id===id);if(i>=0){tab=base[i].normal?'normals':'lesions';return card(i)}return menu()}
function openLectureDisease(lecture,section){const bridge=window.VPQ_PATH_EXAM6_CABINET_BRIDGE;const id=bridge?.get?.(lecture,section);if(!id)return studyLecture(lecture);tab='lesions';filter=String(lecture);search='';etiologyFilter=speciesFilter=frequencyFilter=conditionFilter=subtypeFilter=systemFilter=zoonoticFilter='all';return openCard(id)}
function draftPhoto(id){const d=edits()[id];return String(d?.image||'').startsWith('data:image/jpeg;base64,')?d.image:''}
function draftText(id){const d=edits()[id]||{};return Object.fromEntries(['gross','grossSpecies','mechanismSummary','dx','histo','why','notes','visualClue','compare','etiologyCategories','etiologyAgents','etiologyCertainty','speciesOccurrence','hostScope','speciesEvidence','breedSizes','breedTags','breedEvidence','catalogScope','conditionType','conditionSubtype','organSystem','affectedOrgan','pathogenNames','diseaseId','zoonoticStatus','zoonoticNotes','reportabilityNotes'].filter(k=>Object.prototype.hasOwnProperty.call(d,k)).map(k=>[k,d[k]]))}
function afterPublished(id){const all=edits();if(!all[id])return;for(const k of ['gross','grossSpecies','mechanismSummary','dx','histo','why','notes','visualClue','compare','etiologyCategories','etiologyAgents','etiologyCertainty','speciesOccurrence','hostScope','speciesEvidence','breedSizes','breedTags','breedEvidence','catalogScope','conditionType','conditionSubtype','organSystem','affectedOrgan','pathogenNames','diseaseId','zoonoticStatus','zoonoticNotes','reportabilityNotes'])delete all[id][k];try{localStorage.setItem(KEY,JSON.stringify(all))}catch(e){}}
return {speciesGrossEditorHTML,readGrossSpecies,appendGrossSpeciesRow,parseGrossSpecies,init,start,studyLecture,openLectureDisease,showTab,activeTab:()=>tab,cards:base,openCard,refreshCustom,draftPhoto,draftText,afterPublished};
})();
