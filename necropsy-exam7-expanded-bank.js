/* Enrich the Necropsy specimen studio from slide-audited lessons rather than a second partial disease list. No copyrighted slide images are copied. */
(function(){
'use strict';
const bank=window.VPQ_PATH_EXAM7_DATA;
const lessons=window.VPQ_PATH_LECTURE_LEARN;
if(!Array.isArray(bank)||!lessons)return;
const existing=new Set(bank.map(c=>c.lecture+'|'+c.title.toLowerCase()));
const excluded=/^(lecture (objectives|\d+ objectives)|objectives|instructor objectives|normal |what to |how to |sources|general |diagnostic |skin response |biopsy |sampling |histology |clinical pns |pns axons|peripheral nerve sheaths|somatic sensory|sympathetic|autonomic and enteric|axons,|schwann cells|the professor|pregnancy maintenance|pregnancy:|maintenance of|abortion workup|abortion versus|abortion and|placental types|fetal death|embryonic death|cutaneous helminths and filariae: differential|mycotic infection depth classification|mycotic infection depth|external ear tumor differential|eyelid\/conjunctival neoplasms|uterine inflammation terminology|cycle-dependent uterine|lesion recognition|glaucoma gross\/histologic|endocrine effects on pns|equine colonic aganglionosis — objectives|ear mites, ticks and nematodes|otitis externa — primary causes|terminology|biopsy decision|punch biopsy|shave biopsy|wedge biopsy|ancillary diagnostics|hypersensitivity terminology|hypersensitivity clinical naming|epidermis and|epidermal basement|dermis and|subcutis$|melanocytes|lecture \d+|fetal death vs|retinitis — infectious differential)/i;
const strong=/(itis|osis|oma|plasia|dys|atrophy|degeneration|necrosis|malacia|infarct|hemorrhage|abscess|ulcer|erosion|cyst|lupus|pemph|bullous|sarcoid|pustule|mange|allergy|hypersensitivity|deficiency|tox|myiasis|nodule|papule|plaque|prolapse|torsion|edema|infection|syndrome|disease|parasite|neoplasm|tumor|granuloma|pyoderma|dermatitis|dermato|encephal|myelop|neuropath|glaucoma|cataract|retinop|uveitis|keratitis|keratom|conjunctiv|lipoma|fetus|mummy|mummification|maceration|abortion|placentitis|mastitis|polyp|luxation|distemper|brucell|campylobact|leptospir|tritrichomon|toxoplasm|neospor|chlamydia|coxiel|epm|fip|rabies|pox|ehrlich|lice|flea|tick|louse|cryptococ|sporotrich|pythio|malassez|cushing|hypothyroid|hyperadren|reproductive|sarcoptes|demodex|otodect|entropion|ectropion|coloboma|cyclopia|hydrocephalus|anencephaly|hydranencephaly)/i;
const sites={'67':'Brain / spinal cord','68':'Brain / spinal cord / meninges','69':'Brain / spinal cord','70':'Peripheral nerve / autonomic ganglion','71':'Skin / adnexa','72':'Skin / mucosa','73':'Skin / follicles','74':'Skin / mucocutaneous tissues','75':'Testis / epididymis / reproductive tract','76':'Ovary / uterus / mammary gland','77':'Placenta / fetus / uterus','79':'Eye / ocular adnexa','78':'Auricle / ear canal / middle ear'};
const pointsToText=p=>Array.isArray(p)?p.map(x=>Array.isArray(x)?String(x[0]||'')+': '+String(x[1]||''):String(x)).filter(Boolean):[];
const pick=(pts,pattern)=>pts.filter(x=>pattern.test(x)).slice(0,2);
const strip=s=>String(s).replace(/\s+/g,' ').trim();
function compact(arr,max=570){return strip(arr.join(' ')).slice(0,max)}
const extra67=[
['Neuronal necrosis','Irreversibly injured neurons may not create a visible gross lesion early','Brain: neuronal necrosis','Angular shrunken intensely eosinophilic red neurons with pyknotic or lost nuclei','Ischemia/ATP failure or other neuronal injury; distinguish normal neurons from injured red neurons'],
['Astrocytosis and gliosis','Chronic CNS injury may appear as volume loss or firmness rather than an acute focal gross change','CNS: reactive astrocytosis / gliosis','Reactive hypertrophic astrocytes with prominent processes; chronic glial scar','Astrocytes support BBB, metabolism and repair; unlike fibroblasts in other organs they form glial scar'],
['Microgliosis and neuronophagia','Microscopic lesions may occur with no obvious gross abnormality','CNS: microgliosis and neuronophagia','Activated microglia aggregate around or remove injured neurons','Microglial cells are CNS resident phagocytes; neuronophagia signals neuronal damage'],
['Primary demyelination','White matter may appear pale/soft or normal grossly depending on duration','CNS white matter: primary demyelination','Myelin loss with relatively preserved axons early and macrophages containing myelin debris','Myelin or oligodendrocyte injury occurs first; compare secondary axonal degeneration'],
['Secondary demyelination','Distal injured fiber tracts may initially look grossly normal','CNS / PNS: secondary demyelination','Axonal degeneration followed by myelin breakdown and phagocytic removal','Axon is injured FIRST, unlike primary demyelination'],
['Cerebral infarction','Focal regional softening, swelling or hemorrhagic discoloration depending on timing','Brain: focal ischemic infarction / malacia','Neuronal necrosis and later macrophage infiltration with tissue rarefaction','Blood flow failure causes energy depletion and necrosis; distribution follows vessel'],
['Cytotoxic cerebral edema','Diffuse swelling with flattened gyri and narrowed sulci','Brain: diffuse cytotoxic edema','Intracellular swelling of neurons/glia with intact BBB','ATP/pump failure → sodium-water movement into cells'],
['Vasogenic cerebral edema','Brain swelling often prominent in white matter; flattened gyri and narrowed sulci','Brain: diffuse vasogenic edema','Extracellular fluid accumulation particularly within white matter','BBB damage → plasma fluid enters interstitium; compare intracellular cytotoxic edema'],
['Hydrocephalus from impaired CSF flow','Enlarged cerebral ventricles and attenuation of surrounding neural tissue','Brain: ventricular dilatation / hydrocephalus','Ependymal stretching and pressure changes in adjacent parenchyma','CSF production, flow and absorption imbalance; compare congenital destructive hydranencephaly']
];
for(const [title,gross,dx,histo,why] of extra67){const k='67|'+title.toLowerCase();if(existing.has(k))continue;existing.add(k);bank.push({id:'pathx-67-'+bank.length,lecture:'67',title,gross,dx,histo,why,source:'Professor L67 slide-audited CNS foundations; mechanism/appearance study card. No slide image reproduced.'})}
/* Dedicated meningeal inflammation card: owner can edit and publish multiple gross/H&E photos independently. */
if(!bank.some(x=>x.id==='pathx-68-meningitis')){
 bank.push({id:'pathx-68-meningitis',lecture:'68',title:'Meningitis — leptomeningitis vs pachymeningitis',
 gross:'Opaque, hyperemic leptomeninges with yellow-white exudate tracking sulci; distinguish inflammation of pia/arachnoid and subarachnoid space from thickened inflamed dura.',
 dx:'CNS meninges: diffuse fibrinosuppurative leptomeningitis (working pattern; etiology pending)',
 histo:'Suppurative leptomeningitis: abundant neutrophils/fibrin within the subarachnoid space. Nonsuppurative: lymphocytes/mononuclear cells. Granulomatous: macrophages/giant cells and possible fungi. Pachymeningitis: dura. Meningoencephalitis: adjacent brain parenchyma.',
 why:'Septicemia or contiguous infection can seed the meninges; gross appearance and leukocyte pattern localize and classify inflammation, but bacterial identity requires laboratory confirmation.',
 source:'Instructor Lecture 68 slides 7–9 · leptomeningitis versus pachymeningitis and neonatal septicemia. Photos are owner-supplied and publishable.'});
}
/* Consolidate mosquito-borne equine viral encephalitis in the gross specimen atlas.
 * Keep distinct EHV-1 vascular myeloencephalopathy and protozoal EPM separately.
 * The original lecture disease sections and differential cases are NOT removed.
 */
const viralEquineNames=new Set([
 'eastern equine encephalomyelitis (eee)',
 'western equine encephalomyelitis (wee)',
 'venezuelan equine encephalomyelitis (vee)',
 'west nile virus (wnv)'
]);
// One shared alphavirus gross-pattern card. WNV is a DIFFERENT virus and remains separately labeled.
const alphavirusCard={
 id:'pathx-68-equine-arboviral-group',lecture:'68',
 title:'Equine alphavirus encephalomyelitis — EEE / WEE / VEE',
 gross:'**Gross findings are nonspecific** and may be absent. Hyperemia, edema, small hemorrhages, and malacia may be seen, but gross appearance cannot distinguish EEE, WEE, or VEE.',
 dx:'**Brain / spinal cord: nonsuppurative polioencephalomyelitis** (morphologic pattern). Etiology unconfirmed by routine histology.',
 histo:'**Gray matter neuronal necrosis, neuronophagia, microgliosis and mononuclear perivascular cuffing**. The three mosquito-borne alphaviruses overlap substantially in lesion distribution and histology.',
 why:'**EEE (Eastern equine encephalitis virus), WEE (Western equine encephalitis virus) and VEE (Venezuelan equine encephalitis virus) are distinct alphaviruses.** Request pathogen-specific testing (including appropriate RT-PCR or reference-laboratory assays) and consult the diagnostic laboratory about specimen selection, biosafety, and reporting. **West Nile virus is NOT WEE**; it is a flavivirus with a separate card below.',
 source:'Instructor Lecture 68 slides 18–19; EEE / WEE / VEE source-note comparison.'
};
const wnvCard={
 id:'pathx-68-west-nile-virus',lecture:'68',
 title:'West Nile virus (WNV) — equine encephalomyelitis',
 gross:'**Often grossly normal or nonspecific.** Some cases show congestion, edema or petechial hemorrhage in CNS tissue. The lecture emphasizes that hemorrhage may be more noticeable than with EEE/WEE/VEE, but this **does not establish viral identity**.',
 dx:'**Brain and spinal cord: nonsuppurative polioencephalomyelitis**, often involving brainstem and ventral horn gray matter; **specific etiology requires testing**.',
 histo:'Neuronal degeneration/necrosis, **neuronophagia, microgliosis and lymphohistiocytic perivascular cuffs**; frequently brainstem/spinal cord gray matter involvement. The histologic pattern is **not pathognomonic**.',
 why:'**WNV is a mosquito-borne flavivirus, not Western equine encephalomyelitis virus (WEE).** In live horses, **serum or CSF WNV IgM capture ELISA** is often used for diagnosis; viremia is typically low/transient, limiting blood PCR sensitivity. **RT-PCR on suitable CNS tissue or other reference-laboratory testing** may be useful in postmortem investigation, according to laboratory guidance. Interpret assays with vaccination history and epidemiology. WNV gross findings alone cannot separate it from other viral encephalitides.',
 source:'Instructor Lecture 68 slide 20 — West Nile virus (WNV); separate from Western equine encephalomyelitis (WEE) on slides 18–19.'
};
for(const card of [alphavirusCard,wnvCard]){
 if(!bank.some(x=>x.id===card.id)){bank.push(card);existing.add('68|'+card.title.toLowerCase());}
}

for(let n=67;n<=79;n++){
 const num=String(n),lecture=lessons[num];
 if(!lecture?.sections)continue;
 lecture.sections.forEach((sec,i)=>{
  const name=strip(sec.title);
  if(num==='68'&&viralEquineNames.has(name.toLowerCase()))return;
  if(!name||excluded.test(name)||!strong.test(name)||/NONEXAM|FOR REFERENCE ONLY|OBJECTIVES-ONLY/i.test(name))return;
  const k=num+'|'+name.toLowerCase();if(existing.has(k))return;
  const lines=pointsToText(sec.points);
  if(!lines.length)return;
  const gross=pick(lines,/gross|appearance|lesion|cut surface|clinical|signs|distribution|swelling|ulcer|crust|plaque|nodule|cavit|necrosis|discolor|exudate|mass|fluid|hemorrhag|alopec|edema|diagnosis|localiz/i);
  const microscopic=pick(lines,/histolog|microscop|inclusion|neutrophil|lymphocyt|macrophage|acanthol|thromb|necrosis|axon|myelin|hyphae|inflammat|vessel|epitheli|fibrin/i);
  const mechanism=pick(lines,/pathogen|mechanism|transmis|cause|origin|agent|why|route|compare|differen|distinguish|complicat|progress|risk|species|host|exposure/i);
  // Require a specimen clue or anatomical consequence. A name alone is not a pathology identification card.
  if(!gross.length) return;
  const snippet=compact(gross);
  const dx='Working identification: '+name+'. Specimen site: '+sites[num]+'. Formulate the final morphologic diagnosis from the visible tissue, distribution, severity and process; etiology requires supporting evidence.';
  const histo=microscopic.length?compact(microscopic):'No distinctive histologic pattern is specified in this lecture section. Do not infer an organism or cell type from gross morphology alone.';
  const why=mechanism.length?compact(mechanism):'Use the lecture’s host, lesion location and clinical history to narrow the differential; a gross appearance alone is not etiologic confirmation.';
  const id='pathx-'+num+'-'+i;
  const card={id,lecture:num,title:name,gross:snippet,dx,histo,why,source:(lecture.source||'Instructor lecture '+num)+' · section '+(i+1)+(sec.slides?' · slides '+sec.slides:'')+' · original study paraphrase (no source image copied)'};
  bank.push(card);existing.add(k);
 });
}
window.VPQ_PATH_EXAM7_BANK_STATS=bank.reduce((o,x)=>(o[x.lecture]=(o[x.lecture]||0)+1,o),{});
})();
