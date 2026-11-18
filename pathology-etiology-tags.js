/* Etiology cross-index for necropsy specimen cards.
   Categorization is distinct from morphologic diagnosis and never asserts
   that a suspected agent has been confirmed. */
window.VPQ_PATH_ETIOLOGY=(function(){
'use strict';
const categories={
 'bacterial':{label:'Bacterial',course:'Bacteriology / One Health'},
 'viral':{label:'Viral',course:'Virology / One Health'},
 'fungal':{label:'Fungal',course:'Mycology / One Health'},
 'protozoal':{label:'Protozoal',course:'Parasitology / One Health'},
 'helminthic':{label:'Helminthic',course:'Parasitology / One Health'},
 'arthropod':{label:'Arthropod / ectoparasite',course:'Parasitology'},
 'neoplastic':{label:'Neoplastic',course:'Oncology / Pathology'},
 'immune':{label:'Immune-mediated / inflammatory',course:'Immunology / Pathology'},
 'toxic':{label:'Toxic / drug-associated',course:'Toxicology / Pharmacology'},
 'nutritional':{label:'Nutritional / metabolic',course:'Nutrition / Pathology'},
 'endocrine':{label:'Endocrine',course:'Endocrine / Pharmacology'},
 'vascular':{label:'Vascular / ischemic',course:'Pathology / Clinical Pathology'},
 'traumatic':{label:'Traumatic / mechanical',course:'Surgery / Pathology'},
 'developmental':{label:'Developmental / genetic',course:'Pathology'},
 'degenerative':{label:'Degenerative',course:'Pathology'},
 'idiopathic':{label:'Idiopathic / undetermined',course:'Pathology'}
};
// Targeted teaching tags, not auto-diagnosed from generic gross lesion morphology.
// Arrays are intentionally multi-valued for diseases with multiple pathways.
const preset={
 'Neonatal septic meningitis':{categories:['bacterial'],agents:'Neonatal bacteremia; causative bacterium varies',certainty:'differential'},
 'Listeriosis':{categories:['bacterial'],agents:'Listeria monocytogenes',certainty:'associated'},
 'Thrombotic meningoencephalitis':{categories:['bacterial'],agents:'Histophilus somni',certainty:'associated'},
 'Cerebral abscess':{categories:['bacterial'],agents:'Various pyogenic bacteria; confirm culture where appropriate',certainty:'differential'},
 'Cerebellar hypoplasia':{categories:['developmental','viral'],agents:'Developmental malformation; prenatal viral injury is one possible cause, depending on species',certainty:'differential'},
 'Wallerian degeneration':{categories:['traumatic','degenerative'],agents:'Axonal transection or other axonal injury',certainty:'differential'},
 'Cerebral edema':{categories:['vascular','toxic','traumatic','nutritional'],agents:'Multiple mechanisms: vasogenic barrier failure or cytotoxic ATP loss; categories are examples, not a diagnosis',certainty:'differential'},
 'Hydrocephalus':{categories:['developmental','traumatic','idiopathic'],agents:'Congenital or acquired disturbances of CSF flow',certainty:'differential'},
 'Schwannoma':{categories:['neoplastic'],agents:'Peripheral nerve sheath neoplasia',certainty:'associated'},
 'Contagious ecthyma (orf)':{categories:['viral'],agents:'Orf virus (parapoxvirus)',certainty:'associated'},
 'Sheeppox':{categories:['viral'],agents:'Sheeppox virus (capripoxvirus)',certainty:'associated'},
 'Fowlpox':{categories:['viral'],agents:'Avipoxvirus',certainty:'associated'},
 'Demodicosis':{categories:['arthropod'],agents:'Demodex spp.',certainty:'associated'},
 'Sarcoptic mange':{categories:['arthropod'],agents:'Sarcoptes scabiei',certainty:'associated'},
 'Notoedric mange':{categories:['arthropod'],agents:'Notoedres cati',certainty:'associated'},
 'Pemphigus foliaceus':{categories:['immune'],agents:'Autoimmune acantholysis',certainty:'associated'},
 'Pemphigus vulgaris':{categories:['immune'],agents:'Autoimmune acantholysis',certainty:'associated'},
 'Cutaneous vasculitis':{categories:['immune','bacterial','toxic','idiopathic'],agents:'Can have infectious, immune-mediated, drug-associated or unknown triggers',certainty:'differential'},
 'Sertoli cell tumor':{categories:['neoplastic','endocrine'],agents:'Sertoli cell neoplasia; possible sex steroid effects',certainty:'associated'},
 'Canine CEH–pyometra':{categories:['endocrine','bacterial'],agents:'Progesterone-associated uterine change with possible secondary bacterial infection',certainty:'associated'},
 'Granulosa-theca cell tumor':{categories:['neoplastic','endocrine'],agents:'Ovarian sex-cord stromal neoplasia',certainty:'associated'},
 'Ovarian teratoma':{categories:['neoplastic','developmental'],agents:'Germ cell neoplasm',certainty:'associated'},
 'Auricular infarction':{categories:['vascular'],agents:'Vascular occlusion/ischemia; underlying cause not determined grossly',certainty:'differential'},
 'Auricular hematoma':{categories:['traumatic'],agents:'Trauma or head shaking, often associated with underlying otitis',certainty:'differential'},
 'Corneal sequestrum':{categories:['degenerative','traumatic'],agents:'Corneal stromal necrosis; underlying drivers vary',certainty:'differential'},
 'Diabetic cataract':{categories:['endocrine','nutritional'],agents:'Hyperglycemia and sorbitol-associated lens injury',certainty:'associated'},
 'Granulomatous meningoencephalitis (GME)':{categories:['immune','idiopathic'],agents:'Presumed immune-mediated; specific initiating cause unconfirmed',certainty:'differential'},
 'Cryptococcosis':{categories:['fungal'],agents:'Cryptococcus neoformans/gattii species complexes',certainty:'associated'},
 'Toxoplasmosis':{categories:['protozoal'],agents:'Toxoplasma gondii',certainty:'associated'},
 'Neosporosis':{categories:['protozoal'],agents:'Neospora caninum',certainty:'associated'},
 'Equine protozoal myeloencephalitis (EPM)':{categories:['protozoal'],agents:'Sarcocystis neurona; Neospora hughesi',certainty:'associated'},
 'Rabies':{categories:['viral'],agents:'Rabies lyssavirus',certainty:'associated'},
 'Feline infectious peritonitis (FIP)':{categories:['viral'],agents:'Feline coronavirus',certainty:'associated'}
};
const valid=v=>Array.isArray(v)?v.filter(x=>Object.hasOwn(categories,x)):[];
const parse=v=>Array.isArray(v)?v:(typeof v==='string'?v.split(',').map(x=>x.trim()).filter(Boolean):[]);
function forCard(x){
 const defaults=preset[x?.title]||{};
 const c=x?.etiologyCategories!==undefined?parse(x.etiologyCategories):defaults.categories||[];
 const agents=x?.etiologyAgents!==undefined?x.etiologyAgents:defaults.agents||'';
 const certainty=x?.etiologyCertainty||defaults.certainty||'not-assigned';
 return {categories:valid(c),agents:String(agents||''),certainty};
}
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
function cardHTML(x){
 const t=forCard(x);
 const head='<div style="border-top:1px solid #d6e4ef;padding-top:10px;margin:12px 0"><b>🧬 Etiology tags</b> <small style="color:#5c7187">· Multiple causes possible</small>';
 if(!t.categories.length)return head+'<p class="tiny">Etiology tags not assigned yet. Not evidence that a cause is absent.</p></div>';
 return head+'<div style="display:flex;gap:5px;flex-wrap:wrap;margin:7px 0">'+t.categories.map(k=>'<span title="Future connection: '+escape(categories[k].course)+'" style="border:1px solid #bfd2e9;background:#eef5ff;border-radius:15px;padding:4px 9px;font-size:12px">'+escape(categories[k].label)+'</span>').join('')+'</div>'+
 (t.agents?'<p style="margin:5px 0"><b>Agents / causes to consider:</b> '+escape(t.agents)+'</p>':'')+
 '<small>Evidence: '+escape(({associated:'Established association for this condition (not patient-confirmed)',differential:'Possible causes / differential — not confirmed',confirmed:'Confirmed for this record', 'not-assigned':'Unspecified'}[t.certainty]||'Not verified'))+'</small>'+
 '<details style="margin-top:5px"><summary style="font-size:12px">🔗 Related course branches</summary><p style="font-size:12px">'+[...new Set(t.categories.map(k=>categories[k].course))].map(escape).join(' · ')+'</p><small>Cross-course links are planned; these labels are not active navigation.</small></details></div>';
}
function editorHTML(x){
 const t=forCard(x);
 return '<fieldset style="border:1px solid #cbdbe9;border-radius:10px;margin:12px 0;padding:10px"><legend><b>🧬 Etiology tags (optional, multi-select)</b></legend>'+
 '<p class="tiny">Use only relevant cause branches; this is not the morphologic diagnosis. Do not mark confirmed unless a test or established case evidence confirms it.</p>'+
 '<div style="display:flex;flex-wrap:wrap;gap:10px">'+Object.entries(categories).map(([k,c])=>'<label style="font-size:12px"><input type="checkbox" data-path-etiology="'+k+'"'+(t.categories.includes(k)?' checked':'')+'> '+escape(c.label)+'</label>').join('')+'</div>'+
 '<label style="display:block;margin:9px 0">Specific agents / possible causes<textarea id="path7EtiologyAgents" rows="2" style="width:100%">'+escape(t.agents)+'</textarea></label>'+
 '<label style="display:block">Evidence level<select id="path7EtiologyCertainty" style="display:block;width:100%"><option value="differential"'+(t.certainty==='differential'?' selected':'')+'>Possible / differential</option><option value="associated"'+(t.certainty==='associated'?' selected':'')+'>Known condition association (not patient-confirmed)</option><option value="confirmed"'+(t.certainty==='confirmed'?' selected':'')+'>Confirmed for this record</option></select></label></fieldset>';
}
function readEditor(root){
 const boxes=Array.from(root.querySelectorAll('[data-path-etiology]:checked')).map(x=>x.dataset.pathEtiology);
 return {etiologyCategories:valid(boxes),etiologyAgents:String(root.querySelector('#path7EtiologyAgents')?.value||'').slice(0,1800),etiologyCertainty:root.querySelector('#path7EtiologyCertainty')?.value||'differential'};
}
return {categories,forCard,cardHTML,editorHTML,readEditor};
})();
