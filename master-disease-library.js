/* Master Disease Library (Study Lounge). Single-source index over atlas records;
   curated clinical names only. No duplicate disease detail or fake course links. */
window.VPQ_MASTER_DISEASE_LIBRARY=(function(){
'use strict';
let host=null,search='',species='all',system='all',etiology='all',kind='all',selected=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const slug=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const curated={
'exam7-3':['neonatal-septic-meningitis','Neonatal septic meningitis','infectious','cns'],
'exam7-4':['listeriosis','Listeriosis','infectious','cns'],
'exam7-5':['thrombotic-meningoencephalitis','Thrombotic meningoencephalitis','infectious','cns'],
'exam7-7':['hydrocephalus','Hydrocephalus','','cns'],
'exam7-8':['hydranencephaly','Hydranencephaly','malformation','cns'],
'exam7-9':['cerebellar-hypoplasia','Cerebellar hypoplasia','congenital','cns'],
'exam7-10':['lissencephaly','Lissencephaly','malformation','cns'],
'exam7-11':['equine-recurrent-laryngeal-neuropathy','Equine recurrent laryngeal neuropathy','degenerative','pns'],
'exam7-12':['equine-grass-sickness','Equine grass sickness','degenerative','pns'],
'exam7-13':['schwannoma','Schwannoma','neoplasm','pns'],
'exam7-16':['endocrine-alopecia','Endocrine alopecia','endocrine','integument'],
'exam7-17':['contagious-ecthyma','Contagious ecthyma (orf)','infectious','integument'],
'exam7-18':['sheeppox','Sheeppox','infectious','integument'],
'exam7-19':['fowlpox','Fowlpox','infectious','integument'],
'exam7-20':['demodicosis','Demodicosis','infectious','integument'],
'exam7-21':['sarcoptic-mange','Sarcoptic mange','infectious','integument'],
'exam7-22':['notoedric-mange','Notoedric mange','infectious','integument'],
'exam7-23':['pemphigus-foliaceus','Pemphigus foliaceus','inflammatory','integument'],
'exam7-24':['pemphigus-vulgaris','Pemphigus vulgaris','inflammatory','integument'],
'exam7-25':['cutaneous-vasculitis','Cutaneous vasculitis','vascular','integument'],
'exam7-26':['cryptorchidism','Cryptorchidism','congenital','reproductive'],
'exam7-28':['sertoli-cell-tumor','Sertoli cell tumor','neoplasm','reproductive'],
'exam7-29':['ceh-pyometra','Canine CEH–pyometra','inflammatory','reproductive'],
'exam7-30':['uterine-prolapse','Uterine prolapse','malformation','reproductive'],
'exam7-31':['granulosa-theca-cell-tumor','Granulosa-theca cell tumor','neoplasm','reproductive'],
'exam7-32':['ovarian-teratoma','Ovarian teratoma','neoplasm','reproductive'],
'exam7-35':['otitis-externa','Otitis externa','inflammatory','aural'],
'exam7-38':['glaucoma','Glaucoma','other','ocular'],
'exam7-39':['corneal-sequestrum','Corneal sequestrum','degenerative','ocular'],
'exam7-40':['diabetic-cataract','Diabetic cataract','nutritional','ocular']
};
const excluded=/\b(necrosis|apoptosis|cellular swelling|nuclear changes|gangrene)\b/i;
function sourceCards(){
 window.VPQ_PATH_EXAM7?.refreshCustom?.();
 const hidden=new Set(window.VPQ_NECROPSY_OWNER_PUBLISH?.getHiddenSpecimens?.()||[]);
 return (window.VPQ_PATH_EXAM7?.cards||window.VPQ_PATH_EXAM7_DATA||[]).filter(x=>!x.normal&&!hidden.has(x.id));
}
// Merge on read, not by mutating the shared base atlas records.
// The published record is authoritative; local draft metadata is visible in
// this browser until the owner publishes it for all users.
function readCard(card){
 const owner=window.VPQ_NECROPSY_OWNER_PUBLISH?.getSpecimen?.(card.id);
 const draft=window.VPQ_PATH_EXAM7?.draftText?.(card.id)||{};
 const seed=curated[card.id];
 const fallback=seed?{diseaseId:seed[0],conditionType:seed[2],organSystem:seed[3]}:{};
 return {...fallback,...card,...(owner?.text||{}),...draft};
}
function diseaseForSpecimen(id){
 const c=sourceCards().find(x=>x.id===id);
 if(!c)return '';
 const card=readCard(c);
 return window.VPQ_PATH_ATLAS_META?.data?.(card)?.diseaseId||curated[id]?.[0]||'';
}
function openForSpecimen(id){
 const disease=diseaseForSpecimen(id);
 if(disease)return detail(disease);
 return show();
}
function getGroups(){
 const map=new Map();
 for(const original of sourceCards()){
  const c=readCard(original),spec=curated[c.id];
  const meta=window.VPQ_PATH_ATLAS_META?.data?.(c)||{};
  const id=meta.diseaseId||spec?.[0];
  if(!id||(!spec&&excluded.test(c.title)))continue;
  const label=spec?.[1]||c.title;
  if(!map.has(id))map.set(id,{id,name:label,cards:[],types:new Set(),systems:new Set(),etiologies:new Set(),species:new Set(),pathogens:new Set()});
  const g=map.get(id);g.cards.push(c);
  const typ=meta.conditionType||spec?.[2];if(typ&&typ!=='other')g.types.add(typ);
  const sys=meta.organSystem||spec?.[3];if(sys)g.systems.add(sys);
  const eti=window.VPQ_PATH_ETIOLOGY?.forCard?.(c)?.categories||[];
  for(const t of eti)g.etiologies.add(t);
  for(const k of Object.keys(window.VPQ_PATH_ETIOLOGY?.categories||{}))if(window.VPQ_PATH_ATLAS_META?.etiologyMatches?.(c,k))g.etiologies.add(k);
  for(const k of Object.keys(meta.species||{}))g.species.add(k);
  if(meta.hostScope==='multiple'||Object.keys(meta.species||{}).length>=2)g.species.add('multiple');
  for(const p of (meta.pathogen||'').split(/[;,]/).map(z=>z.trim()).filter(Boolean))g.pathogens.add(p);
 }
 return [...map.values()].sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base'}));
}
const selector=(field,choice,items,allLabel)=>'<label style="font-size:12px;font-weight:700">'+field+'<select data-master-filter="'+field+'" style="display:block;width:100%;padding:8px;border:1px solid #cbd6e5;border-radius:9px;margin-top:4px"><option value="all">'+allLabel+'</option>'+Object.entries(items).map(([key,label])=>'<option value="'+esc(key)+'"'+(key===choice?' selected':'')+'>'+esc(label)+'</option>').join('')+'</select></label>';
function show(){
 const m=window.VPQ_PATH_ATLAS_META||{};
 const groups=getGroups();
 const matched=groups.filter(g=>(species==='all'||g.species.has(species))&&(system==='all'||g.systems.has(system))&&(etiology==='all'||g.etiologies.has(etiology))&&(kind==='all'||g.types.has(kind))&&(!search||[g.name,g.id,...g.pathogens,...g.cards.map(c=>c.title)].join(' ').toLowerCase().includes(search)));
 const body='<p style="font-size:13px;color:#47617a">One disease, linked manifestations: pathology specimens remain editable in their original lectures. Cross-course links will appear when source-verified materials are connected.</p>'+
 '<p><b>'+groups.length+' indexed named conditions</b> · '+matched.length+' shown · '+sourceCards().length+' pathology specimens available</p>'+
 '<label style="display:block;font-size:12px;font-weight:750">Search disease, pathogen or lesion<input data-master-search="1" value="'+esc(search)+'" placeholder="e.g. Listeriosis, toxoplasmosis" style="display:block;width:100%;padding:10px;margin-top:5px;border:1px solid #cbd6e5;border-radius:9px"></label>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:8px;margin:12px 0">'+
 selector('Species',species,{...(m.species||{}),multiple:'Multiple species / broad host range'},'All species')+selector('Organ',system,m.systems||{},'All systems')+
 selector('Etiology',etiology,Object.fromEntries(Object.entries(window.VPQ_PATH_ETIOLOGY?.categories||{}).map(([k,v])=>[k,v.label])),'All etiologies')+
 selector('Condition',kind,m.conditionTypes||{},'All condition types')+'</div>'+
 '<p class="tiny">Species matches require documented metadata. Unclassified diseases are excluded from species-specific results, not assumed unaffected.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:9px">'+matched.map(g=>'<button data-master-open="'+esc(g.id)+'" style="text-align:left;padding:12px;border:1px solid #c8d9ea;border-radius:12px;background:#f9fcff"><b>'+esc(g.name)+'</b><small style="display:block;color:#61788e;margin-top:5px">'+g.cards.length+' organ/lecture specimen'+(g.cards.length===1?'':'s')+'</small><small style="display:block;color:#63798a">'+[...g.systems].map(k=>m.systems?.[k]||k).join(' · ')+'</small></button>').join('')+'</div>'+
 (!matched.length?'<p>No indexed disease matches these filters. Try All species or broader categories; older cards may need tags.</p>':'')+
 '<div class="buttonrow"><button data-master-reset="1">Clear filters</button></div>';
 host?.showModal('📚 Master Disease Library · Study Lounge',body);
}
function detail(id){
 const g=getGroups().find(g=>g.id===id);if(!g)return show();selected=id;
 const m=window.VPQ_PATH_ATLAS_META||{};
 const head='<div class="buttonrow"><button data-master-back="1">← Disease Library</button></div>'+
 '<h3>'+esc(g.name)+'</h3><p class="tiny">Shared disease ID: '+esc(g.id)+'</p>'+
 '<p><b>Etiologies:</b> '+([...g.etiologies].map(k=>esc(window.VPQ_PATH_ETIOLOGY?.categories?.[k]?.label||k)).join(', ')||'Not classified yet')+'</p>'+
 '<p><b>Species:</b> '+([...g.species].map(k=>esc(m.species?.[k]||k)).join(', ')||'Not assessed')+'</p>'+
 (g.pathogens.size?'<p><b>Pathogen names entered:</b> '+[...g.pathogens].map(esc).join(', ')+'</p>':'')+
 '<h4>🫀 Affected organs / lecture manifestations</h4>'+
 g.cards.map(c=>{const cm=m.data?.(c)||{};const system=cm.organSystem||curated[c.id]?.[3];return '<div style="padding:10px;margin:6px 0;border:1px solid #d4e1ef;border-radius:10px"><b>'+esc(c.title)+'</b> · Lecture '+esc(c.lecture)+'<small style="display:block;color:#5f758c">'+esc(cm.organ||m.systems?.[system]||'Organ context not yet classified')+'</small><button data-master-specimen="'+esc(c.id)+'" style="margin-top:5px">🔬 Open original editable atlas card</button></div>'}).join('')+
 '<h4>🔗 Future shared clinical sections</h4><p style="font-size:13px">Clinical pathology findings · Diagnostic tests · One Health · Pharmacology / treatment · NAVLE comparisons</p>'+
 '<p class="tiny">These cross-course links are not populated until a verified source record is connected. The pathology entries above are live links to existing cards, not copied notes.</p>';
 host?.showModal('📚 '+g.name+' · Master Disease Profile',head);
}
function init(api){
 if(host)return;host=api;
 api.body.addEventListener('click',e=>{
  const el=e.target.closest('[data-master-open],[data-master-back],[data-master-specimen],[data-master-reset]');if(!el)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(el.dataset.masterOpen!==undefined)return detail(el.dataset.masterOpen);
  if(el.dataset.masterBack!==undefined)return show();
  if(el.dataset.masterSpecimen!==undefined)return window.VPQ_PATH_EXAM7?.openCard?.(el.dataset.masterSpecimen);
  if(el.dataset.masterReset!==undefined){search='';species=system=etiology=kind='all';return show()}
 },true);
 api.body.addEventListener('change',e=>{
  const el=e.target;
  if(el.dataset.masterFilter!==undefined){const v=el.value||'all';switch(el.dataset.masterFilter){case 'Species':species=v;break;case 'Organ':system=v;break;case 'Etiology':etiology=v;break;case 'Condition':kind=v;break;}return show()}
  if(el.dataset.masterSearch!==undefined){search=el.value.toLowerCase().trim();return show()}
 },true);
}
return {init,open:show,openDisease:detail,openForSpecimen,diseaseForSpecimen,groups:getGroups};
})();
