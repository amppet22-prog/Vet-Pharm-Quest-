/* Atlas metadata v1: species occurrence, zoonotic route, morphology context,
   etiology subtypes and explicit disease-to-organ links. Never infer frequency. */
window.VPQ_PATH_ATLAS_META=(function(){
'use strict';
const species={dog:'Dog',cat:'Cat',horse:'Horse',cattle:'Cattle',sheep:'Sheep',goat:'Goat',pig:'Pig',poultry:'Poultry',other_bird:'Other birds',reptile:'Reptiles',small_mammal:'Small mammals',wildlife:'Wildlife / exotics',human:'Human'};
const frequency={reported:'Reported; frequency unknown',common:'Commonly reported',occasional:'Occasionally reported',rare:'Rarely reported',exceptional:'Exceptionally rare'};
const conditionTypes={infectious:'Infectious disease',congenital:'Congenital / developmental anomaly',malformation:'Structural anomaly',neoplasm:'Neoplasia / tumor',inflammatory:'Inflammatory / immune-mediated',degenerative:'Degenerative',vascular:'Vascular / ischemic',toxic:'Toxic / drug-induced',nutritional:'Nutritional / metabolic',endocrine:'Endocrine disorder',traumatic:'Traumatic',idiopathic:'Idiopathic / undetermined',adaptation:'Cell adaptation',artifact:'Artifact / non-lesion'};
const subtypes={protozoa:'Protozoal pathogens',bacteria:'Bacterial pathogens',viruses:'Viral pathogens',fungi:'Fungal pathogens',helminths:'Helminths',arthropods:'Arthropods',epithelial_tumor:'Epithelial neoplasms',mesenchymal_tumor:'Mesenchymal neoplasms',round_cell_tumor:'Round-cell neoplasms',germ_cell_tumor:'Germ-cell neoplasms',neuroectodermal_tumor:'Neural/neuroectodermal neoplasms',birth_defect:'Birth defects',genetic:'Genetic disorders',endocrine:'Endocrine disorders'};
const systems={cns:'CNS / Brain & Spinal cord',pns:'Peripheral Nervous System',respiratory:'Respiratory',gastrointestinal:'Gastrointestinal',hepatobiliary:'Liver & Biliary',renal:'Urinary / Renal',cardiac:'Cardiovascular',integument:'Skin / Integument',reproductive:'Reproductive',musculoskeletal:'Musculoskeletal',ocular:'Eye',aural:'Ear',lymphatic:'Hematolymphatic',endocrine:'Endocrine',systemic:'Systemic / Multiorgan',other:'Other'};
const zoonotic={unknown:'Not assessed',direct:'Direct animal-to-human transmission possible',vector:'Vector-borne zoonotic risk',foodborne:'Foodborne zoonotic risk',environment:'Shared environmental source; not necessarily animal-to-human',no_established:'No established animal-to-human transmission'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeChoice=(map,v,fallback='')=>Object.hasOwn(map,v)?v:fallback;
function parseSpecies(v){
 try{const raw=typeof v==='string'?JSON.parse(v||'{}'):v||{};return Object.fromEntries(Object.entries(raw).filter(([k,z])=>species[k]&&frequency[z]))}catch{return {}}
}
// Source-grounded initial selections. These are documented hosts/teaching
// associations, NOT population prevalence estimates. Published edits override.
const lectureSeed={
 'pathx-68-28':{speciesOccurrence:JSON.stringify({dog:'reported'}),conditionType:'infectious',conditionSubtype:'protozoa',organSystem:'cns',affectedOrgan:'Brain and spinal cord',pathogenNames:'Toxoplasma gondii',diseaseId:'toxoplasmosis',speciesEvidence:'Instructor Lecture 68, slide 33; dog CNS associations noted. Occurrence frequency not quantified.'},
 'pathx-68-37':{speciesOccurrence:JSON.stringify({dog:'reported'}),conditionType:'infectious',conditionSubtype:'helminths',organSystem:'cns',affectedOrgan:'Brain and spinal cord',pathogenNames:'Toxocara canis',diseaseId:'toxocara-can-nerve-migration',speciesEvidence:'Instructor Lecture 68, slide 40; dogs listed. Nematode larval migration, distinct from toxoplasmosis.'},
 'pathx-68-27':{speciesOccurrence:JSON.stringify({dog:'reported'}),conditionType:'infectious',conditionSubtype:'protozoa',organSystem:'cns',pathogenNames:'Neospora caninum',diseaseId:'neosporosis',speciesEvidence:'Instructor Lecture 68, slide 32; dog neural disease described.'},
 'pathx-68-29':{speciesOccurrence:JSON.stringify({horse:'reported'}),conditionType:'infectious',conditionSubtype:'protozoa',organSystem:'cns',pathogenNames:'Sarcocystis neurona; Neospora hughesi',diseaseId:'equine-protozoal-myeloencephalitis',speciesEvidence:'Instructor Lecture 68, slides 34–35; equine disease discussed.'},
 'pathx-68-26':{conditionType:'infectious',conditionSubtype:'fungi',organSystem:'cns',pathogenNames:'Cryptococcus neoformans / gattii',diseaseId:'cryptococcosis'},
 'pathx-68-11':{conditionType:'infectious',conditionSubtype:'viruses',organSystem:'cns',pathogenNames:'Rabies lyssavirus',diseaseId:'rabies'}
};
const seeded=x=>{const seed=lectureSeed[x?.id]||{};return {...seed,...x}};
function data(x){
 x=seeded(x||{});
 return {
  species:parseSpecies(x?.speciesOccurrence),
  conditionType:safeChoice(conditionTypes,x?.conditionType),
  conditionSubtype:safeChoice(subtypes,x?.conditionSubtype),
  organSystem:safeChoice(systems,x?.organSystem),
  organ:String(x?.affectedOrgan||'').trim(),
  diseaseId:String(x?.diseaseId||'').trim().toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,110),
  pathogen:String(x?.pathogenNames||'').trim(),
  zoonotic:safeChoice(zoonotic,x?.zoonoticStatus,'unknown'),
  zoonoticNotes:String(x?.zoonoticNotes||'').trim(),
  reportability:String(x?.reportabilityNotes||'').trim(),
  evidence:String(x?.speciesEvidence||'').trim()
 };
}
function speciesMatches(x,key,rank){
 const d=data(x),status=d.species[key];
 return !!status&&(rank==='all'||status===rank);
}
function browseHTML(x){
 const d=data(x);
 const items=Object.entries(d.species).map(([key,level])=>'<span style="display:inline-block;margin:3px;padding:5px 8px;border-radius:12px;border:1px solid #cadce7;background:#f5faff;font-size:12px">'+esc(species[key])+': '+esc(frequency[level])+'</span>').join('');
 return '<details style="border-top:1px solid #d4dce8;padding-top:10px;margin-top:12px" open><summary><b>🐾 Species, One Health & condition classification</b></summary>'+
 (items?'<div style="margin:7px 0">'+items+'</div>':'<p class="tiny">Species frequencies not yet assessed. No occurrence is assumed.</p>')+
 (d.conditionType?'<p><b>Condition type:</b> '+esc(conditionTypes[d.conditionType])+(d.conditionSubtype?' · '+esc(subtypes[d.conditionSubtype]):'')+'</p>':'')+
 (d.organSystem?'<p><b>Organ system:</b> '+esc(systems[d.organSystem])+(d.organ?' · '+esc(d.organ):'')+'</p>':'')+
 (d.pathogen?'<p><b>Pathogen(s) / causal agents:</b> '+esc(d.pathogen)+'</p>':'')+
 '<p><b>Human/zoonotic relevance:</b> '+esc(zoonotic[d.zoonotic])+(d.zoonoticNotes?' · '+esc(d.zoonoticNotes):'')+'</p>'+
 (d.reportability?'<p><b>Reportability:</b> '+esc(d.reportability)+'</p>':'')+
 (d.evidence?'<p class="tiny"><b>Species evidence:</b> '+esc(d.evidence)+'</p>':'')+
 '</details>';
}
function selectHTML(map,id,val,blank){
 return '<select id="'+esc(id)+'" style="display:block;width:100%;padding:6px;margin:4px 0 8px">'+
 (blank?'<option value="">Not assigned</option>':'')+
 Object.entries(map).map(([k,label])=>'<option value="'+esc(k)+'"'+(val===k?' selected':'')+'>'+esc(label)+'</option>').join('')+'</select>';
}
function editorHTML(x){
 const d=data(x);
 return '<fieldset style="border:1px solid #bdd3e5;border-radius:12px;padding:10px;margin:12px 0"><legend><b>🐾 Species & disease connections</b></legend>'+
 '<p class="tiny">Only select species with documentation. Missing means unassessed, NOT unaffected. Common/rare describe reported frequency, not population prevalence.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:6px">'+Object.entries(species).map(([key,label])=>'<label style="font-size:12px">'+esc(label)+'<select data-path-species="'+esc(key)+'" style="width:100%;padding:5px"><option value="">Not assessed</option>'+Object.entries(frequency).map(([f,v])=>'<option value="'+esc(f)+'"'+(d.species[key]===f?' selected':'')+'>'+esc(v)+'</option>').join('')+'</select></label>').join('')+'</div>'+
 '<label>Evidence/source for frequency<textarea id="pathMetaEvidence" rows="2" style="width:100%">'+esc(d.evidence)+'</textarea></label>'+
 '<label>Condition type'+selectHTML(conditionTypes,'pathMetaType',d.conditionType,true)+'</label>'+
 '<label>Subtype / pathogen or neoplasm family'+selectHTML(subtypes,'pathMetaSubtype',d.conditionSubtype,true)+'</label>'+
 '<label>Organ system'+selectHTML(systems,'pathMetaSystem',d.organSystem,true)+'</label>'+
 '<label>Affected organ<input id="pathMetaOrgan" style="width:100%" value="'+esc(d.organ)+'" placeholder="e.g. Brain, Lung, Small intestine"></label>'+
 '<label>Specific pathogen name(s)<textarea id="pathMetaPathogen" rows="2" style="width:100%" placeholder="Only if supported">'+esc(d.pathogen)+'</textarea></label>'+
 '<label>Shared disease ID<input id="pathMetaDisease" style="width:100%" value="'+esc(d.diseaseId)+'" placeholder="e.g. toxoplasmosis (use same ID across organs)"></label>'+
 '<p class="tiny">Only use the same disease ID for manifestations of the SAME disease. A gross process (necrosis, edema) is not automatically one disease.</p>'+
 '<label>Zoonotic/transmission status'+selectHTML(zoonotic,'pathMetaZoon',d.zoonotic,false)+'</label>'+
 '<label>Transmission / One Health notes<textarea id="pathMetaZoonNotes" rows="2" style="width:100%">'+esc(d.zoonoticNotes)+'</textarea></label>'+
 '<label>Notifiable/reportable information + jurisdiction/date<textarea id="pathMetaReport" rows="2" style="width:100%">'+esc(d.reportability)+'</textarea></label></fieldset>';
}
function readEditor(root){
 const v=id=>String(root.querySelector('#'+id)?.value||'').slice(0,1800);
 const ranks={};
 root.querySelectorAll('[data-path-species]').forEach(el=>{if(species[el.dataset.pathSpecies]&&frequency[el.value])ranks[el.dataset.pathSpecies]=el.value});
 return {
 speciesOccurrence:JSON.stringify(ranks),speciesEvidence:v('pathMetaEvidence'),
 conditionType:v('pathMetaType'),conditionSubtype:v('pathMetaSubtype'),
 organSystem:v('pathMetaSystem'),affectedOrgan:v('pathMetaOrgan'),
 pathogenNames:v('pathMetaPathogen'),diseaseId:v('pathMetaDisease').toLowerCase().replace(/[^a-z0-9-]/g,''),
 zoonoticStatus:v('pathMetaZoon'),zoonoticNotes:v('pathMetaZoonNotes'),
 reportabilityNotes:v('pathMetaReport')
 };
}
function relatedHTML(x,all,indexFor){
 const d=data(x);if(!d.diseaseId)return '';
 const matches=all.filter(y=>y.id!==x.id&&data(y).diseaseId===d.diseaseId);
 if(!matches.length)return '<p class="tiny"><b>Linked disease:</b> '+esc(d.diseaseId)+' · No additional organ manifestation cards published yet.</p>';
 return '<div style="border-top:1px solid #d9e1e8;padding-top:9px;margin-top:8px"><b>🔗 Other organ manifestations of this disease</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">'+
 matches.map(y=>'<button type="button" data-path7-view="'+indexFor(y.id)+'">'+esc(y.title)+' · '+esc(systems[data(y).organSystem]||data(y).organ||'Other site')+'</button>').join('')+'</div></div>';
}
return {species,frequency,conditionTypes,subtypes,systems,zoonotic,data,speciesMatches,browseHTML,editorHTML,readEditor,relatedHTML,lectureSeed};
})();
