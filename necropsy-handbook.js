/* Original Necropsy Handbook — compact, readable, extensible lecture + systems guide. */
window.VPQ_NECROPSY_HANDBOOK=(function(){
'use strict';
const chapters=[
['67','CNS foundations','Neuro','Neurons and glia; normal brain/spinal cord; neuronal necrosis, astrocytosis, demyelination, edema, ischemia and Wallerian degeneration.','Localize gray vs white matter; distinguish vasogenic vs cytotoxic edema; describe symmetric vs focal lesions.','Neuronal necrosis;Wallerian degeneration;Astrocytosis and gliosis;Primary and secondary demyelination;Cytotoxic edema;Vasogenic edema;CNS infarction;Brain herniation'],
['68','CNS inflammation','Neuro','Route of entry changes the lesion: hematogenous infection, direct extension, infected leukocytes or retrograde axonal spread.','Use suppurative versus nonsuppurative versus granulomatous, then distribution (brainstem, gray/white junction, meninges).','Bacterial leptomeningitis;Neonatal septicemia;Cerebral abscess;Vertebral abscess;Choroid plexitis;Ependymitis;Listeriosis;Thrombotic meningoencephalitis;Overeating disease;GME;Rabies;EEE/WEE/VEE;West Nile virus;EHV-1 neurologic disease;Malignant catarrhal fever;CAE;Canine distemper;Canine herpesvirus;FIP;Aspergillosis;Cryptococcosis;Neosporosis;Toxoplasmosis;EPM;Cuterebra;Cerebrospinal nematodiasis;Fibrocartilaginous embolism;IVDD;NME;NLE'],
['69','CNS malformations, toxins & tumors','Neuro','Gross localization is often the best diagnostic clue: compressed tissue versus absent tissue, cortical versus white-matter malacia, intra- versus extra-axial masses.','Hydrocephalus vs hydranencephaly, ventricles vs brain parenchyma; bilateral toxic lesions; astrocyte histology.','Hydrocephalus;Anencephaly;Cerebral aplasia;Porencephaly;Hydranencephaly;Lissencephaly;Cerebellar hypoplasia;Meningocele;Meningoencephalocele;Hydromyelia;Syringomyelia;Chiari-like malformation;Meningioma;Astrocytoma;Oligodendroglioma;Ependymoma;Choroid plexus neoplasm;Metastatic hemangiosarcoma;Histiocytic sarcoma;Medulloblastoma;Hepatic encephalopathy;Organophosphate toxicosis;Selenium toxicosis;Salt toxicosis;Bromethalin toxicosis;Lead toxicosis;Tetanus;Phalaris toxicosis;Fumonisin leukoencephalomalacia;Centaurea poisoning;Thiamine deficiency;Copper deficiency;Wobbler syndrome;SRMA;Equine motor neuron disease;Equine degenerative myeloencephalopathy;Degenerative myelopathy;Cholesteatoma'],
['70','Peripheral nervous system','Neuro','Unlike the CNS, peripheral nerve lesions may be difficult to see grossly. Look for muscle atrophy, nerve thickening and autonomic dysfunction.','Schwann cells myelinate peripheral axons; distinguish sensory root versus motor root and neurapraxia versus axon loss.','Neurapraxia;Axonotmesis;Neurotmesis;Dysautonomia;Peritonitis-associated neuronal injury;Congenital hypomyelinating neuropathy;Coyotillo toxicosis;Vitamin A deficiency;Riboflavin deficiency;Botulism;Schwannoma;Neurofibroma;Perineurioma;Equine grass sickness;Recurrent laryngeal neuropathy;Polyneuritis equi;Acute polyradiculoneuritis;Pointer sensory neuropathy'],
['71','Skin foundations & endocrine','Skin','Use precise lesion vocabulary before guessing an agent. Skin reactions are often nonspecific; signalment, distribution, and depth are essential.','Erosion preserves the basement membrane; ulcer loses it. Endocrine alopecia tends to be symmetric and minimally pruritic.','Atrophy;Lichenification;Callus;Hygroma;Comedone;Epidermal collarette;Papule;Plaque;Nodule;Cyst;Pustule;Papilloma;Crust;Hyperkeratosis;Erosion;Ulceration;Vesicle;Bulla;Leukotrichia;Alopecia;Acne;Photosensitization;Xanthoma;Recurrent flank alopecia;Canine hyperadrenocorticism;Feline hyperadrenocorticism;Ferret adrenal disease;Hypersomatotropism;Hyposomatotropism;Hyperestrogenism;Hypothyroid dermatosis;Equine PPID;Hepatocutaneous syndrome;Feline plasma cell pododermatitis;Bovine papillomatous digital dermatitis'],
['72','Viral & bacterial skin','Skin','Infectious lesions vary by agent and tissue depth: pox proliferation, herpes ulceration, superficial folliculitis versus deep furunculosis.','Poxviruses can be zoonotic; check FMD-like vesicular diseases carefully. Distinguish canker (grows) from thrush (rots).','Sheeppox;Goatpox;Lumpy skin disease;Cowpox;Fowlpox;Orf;Bovine papular stomatitis;Pseudocowpox;Papillomatosis;Equine sarcoid;Feline sarcoid;Bovine ulcerative mammillitis;Equine coital exanthema;Feline herpes dermatitis;Marek disease;Senecavirus A;Superficial pyoderma;Folliculitis;Furunculosis;Deep pyoderma;Cellulitis;Intertrigo;Pyotraumatic dermatitis;Post-grooming furunculosis;Anthrax;Ovine fleece rot;Dermatophilosis;Exudative epidermitis;Erysipelas;Foot rot;Equine canker;Equine thrush;PDNS;Impetigo;Necrotizing fasciitis'],
['73','Parasitic, fungal & nutritional skin','Skin','First ask where a mite lives: hair follicle, stratum corneum or surface. Fungi range from superficial scale to deep pyogranulomatous nodules.','Demodex vs Sarcoptes vs Notoedres vs Otodectes; dermatophyte vs Dermatophilus. Deep nodules with draining tracts demand targeted diagnosis.','Demodex canis;Demodex cati;Demodex gatoi;Sarcoptic mange;Notoedric mange;Otodectes;Psoroptes;Chorioptes;Cheyletiella;Trombiculid mites;Chicken mites;Tick dermatitis;Pediculosis;Fleas;Myiasis;Onchocerca dermatitis;Stephanofilaria;Habronemiasis;Dermatophytosis;Malassezia dermatitis;Phaeohyphomycosis;Sporotrichosis;Pythiosis;Systemic mycoses;Zinc-responsive dermatosis;Copper deficiency;Selenium toxicosis;Pastern dermatitis;Chronic progressive lymphedema;Coronary band dystrophy'],
['74','Immune skin & hypersensitivity','Skin','Level of skin separation explains major autoimmune diseases; immune attack, pruritus and characteristic distribution separate look-alikes.','Pemphigus foliaceus (subcorneal) versus vulgaris (suprabasal) versus bullous disease (subepidermal).','Vasculitis;Pemphigus foliaceus;Pemphigus vulgaris;Paraneoplastic pemphigus;Bullous pemphigoid;Epidermolysis bullosa;Cutaneous lupus;Discoid lupus;Systemic lupus;Erythema multiforme;Stevens-Johnson syndrome;Toxic epidermal necrolysis;VKH syndrome;Dermatomyositis;Vitiligo;Atopic dermatitis;Acral lick dermatitis;Contact dermatitis;Culicoides hypersensitivity;Flea allergy;Urticaria;Angioedema;Mosquito bite hypersensitivity;Eosinophilic granuloma;Eosinophilic plaque;Indolent ulcer;Eosinophilic furunculosis;Ichthyosis;Seborrhea;Congenital hypertrichosis;Collagen dysplasia;Lethal acrodermatitis;Nodular dermatofibrosis;Schnauzer comedo syndrome'],
['75','Male reproductive pathology','Repro','Use structure and cut surface: testis versus epididymis; white tough Sertoli versus yellow greasy Leydig versus soft bulging seminoma.','Unilateral degeneration suggests local disease; bilateral suggests systemic. Sperm leaked from ducts incites granulomatous inflammation.','Scrotal hemangioma;Scrotal trauma;Chorioptic scrotal dermatitis;Scrotal hernia;Cryptorchidism;Monorchism;Polyorchidism;Testicular degeneration;Orchitis;Epididymitis;Brucella-associated disease;Sperm granuloma;Sertoli cell tumor;Leydig cell tumor;Seminoma;Benign prostatic hyperplasia;Prostatic carcinoma;Prostatitis;Prostatic cyst;Prostatic pseudocyst;Ulcerative posthitis;Penile fibropapilloma;Penile SCC;Canine TVT;Persistent frenulum'],
['76','Female repro & mammary','Repro','Separate uterus, ovary, placenta and mammary gland. Look for progesterone-driven CEH/pyometra, reproductive infections and tumor cell of origin.','Endometritis = endometrium; metritis = full wall. Ovarian granulosa-theca tumors may cause steroid effects and contralateral atrophy.','Uterine prolapse;Uterine torsion;Uterine rupture;Uterine artery rupture;Hydrometra;Mucometra;Cystic endometrial hyperplasia;Endometrial polyp;Metritis;Pyometra (dog);Pyometra (cat);Pyometra (cow);Pyometra (mare);Endometritis;Endometrial biopsy;PRRS;Porcine parvovirus;PCV2 reproductive disease;Pseudorabies;Canine herpesvirus;Bovine herpesvirus 1;Equine herpesvirus 1;Feline mammary fibroadenomatous hyperplasia;Staphylococcal mastitis;Streptococcal mastitis;Coliform mastitis;Summer mastitis;Mycoplasma mastitis;Swine mastitis;Ovine/caprine mastitis;Canine mammary neoplasia;Feline mammary carcinoma;Uterine leiomyoma;Bovine uterine lymphoma;Canine TVT;Granulosa-theca cell tumor;Ovarian cystadenoma;Ovarian carcinoma;Dysgerminoma;Teratoma'],
['77','Abortion & placentitis','Repro','Know normal species placentation; abortion interpretation depends on which membranes and fetal tissues are affected. Submit placenta plus representative fetal tissues.','Ruminant cotyledon vs intercotyledonary region; equine endometrial cups may sustain pseudopregnancy.','Canine zonary placenta;Ruminant placentomes;Equine diffuse placenta;Endometrial cups;Early embryonic loss;Fetal mummification;Fetal maceration;Emphysematous fetus;Hydramnios;Hydroallantois;Prolonged gestation;Estrogenic plants;Brucellosis;Campylobacteriosis;Leptospirosis;Salmonellosis;Chlamydiosis;Q fever;Contagious equine metritis;Toxoplasmosis;Neosporosis;Tritrichomoniasis;Mycotic abortion'],
['78','Eyes','Special Senses','Work from eyelid/conjunctiva to cornea, uvea, lens, retina and optic nerve. Many diseases ultimately cause glaucoma or blindness.','Buphthalmos is an enlarged globe; exophthalmos is a normal-sized globe pushed forward.','Anophthalmia;Microphthalmia;Cyclopia;Synophthalmia;Coloboma;Collie eye anomaly;Glaucoma;Entropion;Ectropion;Chalazion;Conjunctivitis;Onchocerca lupi;Thelazia;Meibomian adenoma;Corneal dermoid;Keratoconjunctivitis sicca;Infectious bovine keratoconjunctivitis;Eosinophilic keratitis;Fungal keratitis;Keratomalacia;Corneal sequestrum;Persistent pupillary membrane;Equine recurrent uveitis;VKH uveitis;Phacolytic uveitis;Phacoclastic uveitis;Ocular melanosis;Melanocytoma;Feline diffuse iris melanoma;Lens luxation;Diabetic cataract;Post-traumatic ocular sarcoma;Hypertensive retinopathy;Retinitis;Nutritional retinopathy;Orbital meningioma'],
['79','Ears','Special Senses','External ear is a continuation of skin; chronic otitis causes hyperplasia, stenosis and fibrosis. Middle-ear disease can affect facial/vestibular nerves.','Auricular infarction is dry gangrene, hematoma is a blood-filled pinna, chondritis distorts cartilage.','Otitis externa;Auricular infarction;Auricular hematoma;Auricular chondritis;Dermatophilosis;Dentigerous cyst;Ceruminous gland adenoma;Ceruminous gland adenocarcinoma;Squamous cell carcinoma of pinna;Aural inflammatory polyp;Otitis media;Otitis interna;Tympanokeratoma;Cholesteatoma']
];
const patterns=[
['Distribution','Bilateral symmetry often suggests systemic metabolic, nutritional, toxic or immune disease; random multifocal lesions suggest emboli, hematogenous spread or metastasis.','Ruminant cortical malacia vs equine white-matter malacia; asymmetric EPM vs symmetric thiamine-associated injury.'],
['Inflammation','Suppurative = predominantly neutrophils; granulomatous = macrophage-rich; eosinophilic = parasites/allergy and select toxic disorders; nonsuppurative = lymphocytes/plasma cells.','Listeria microabscesses vs viral lymphocytic cuffs vs cryptococcal granulomas.'],
['Vascular damage','Vasculitis, thrombosis, edema, infarction, hemorrhage and necrosis may occur in unrelated systems.','TME brain, porcine erysipelas skin, auricular infarction, equine EHV-1 spinal cord.'],
['Hormones','Estrogen and progesterone influence skin, prostate, uterus, mammary gland and behavior.','Sertoli estrogen effects vs granulosa-theca tumor; CEH/pyometra vs sterile uterine fluid.'],
['Herpesviruses','Latency and recrudescence; lesions vary across neuro, skin, reproduction and eye.','EHV-1 neurological vascular injury + abortions; FHV-1 facial ulcers + corneal disease.'],
['Immune hypersensitivity','Type I immediate allergy, type II cell targets, type III immune complexes, type IV delayed T-cell mechanisms.','Atopy versus pemphigus versus vasculitis versus VKH.'],
['Same lesion, different cause','Color and texture alone rarely prove an etiology; species, anatomic site, distribution and histology strengthen a morphologic diagnosis.','Dark cornea = sequestrum; dark ear tip = infarct; dark brain masses = hemorrhagic metastases.'],
['Morphologic diagnosis','State affected organ → distribution → severity (when defensible) → lesion type → chronicity (if supported). An etiologic diagnosis is a separate assertion.','Brainstem, multifocal, suppurative encephalitis; skin, diffuse, chronic, hyperkeratotic dermatitis.'],
['Necropsy safety','Stop before opening a potentially reportable/zoonotic carcass; suspected anthrax must not be opened. Plan fresh versus fixed specimens for laboratory testing.','Consult the teaching clinician or diagnostic laboratory for collection and submission protocols.']
];
let api=null,topic='all',search='',chapter='67';
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const theme='<style>.np-cover{background:linear-gradient(115deg,#f3e3ff,#e1f7eb 55%,#ffefdc);border:2px solid #dfc4ef;border-radius:18px;padding:15px;margin:7px 0 13px}.np-tabs{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}.np-tabs button{font-size:12px;padding:7px 10px}.np-chapters{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.np-chapter{padding:13px;background:#fff;border:2px solid #dbd5eb;border-radius:16px;text-align:left}.np-chapter small{display:block;color:#60708c;margin-top:4px}.np-tag{display:inline-block;border-radius:9px;background:#fff4d8;padding:3px 7px;font-size:11px;font-weight:800}.np-pat{padding:12px;background:#f9f8fc;border:1px solid #d6ddec;border-radius:14px;margin:8px 0}.np-scroll{max-height:40vh;overflow:auto;border:1px solid #dfe1ec;border-radius:12px;padding:9px}.np-question{display:inline-grid;place-items:center;vertical-align:middle;min-width:25px;width:25px;height:25px;padding:0;margin-left:6px;border:2px solid #a38ac3;border-radius:50%;background:#fff8e7;color:#755690;font-size:14px;font-weight:900;cursor:help}.np-question:hover,.np-question:focus-visible{background:#e9daf9;outline:2px solid #f5d6ad}.np-entryrow{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 3px;border-bottom:1px solid #eef1f5}.np-entryrow .np-entryname{min-width:0}</style>';
function popup(t,html){api?.showModal(t,theme+html)}
function nav(){return '<div class="np-tabs"><button data-nphome="1">📚 Handbook</button><button data-nppattern="1">🔗 Across systems</button><button data-npstudio="gross">🔍 Gross ID</button><button data-npstudio="histo">🔬 Histology</button><button data-npquiz="1">🎓 Practice Quiz</button><button data-npedit="1">🖼️ Editable atlas</button></div>'}
function show(){
 const systems=['all','Neuro','Skin','Repro','Special Senses'];
 const selected=chapters.filter(c=>topic==='all'||c[2]===topic).filter(c=>!search||[...c].join(' ').toLowerCase().includes(search));
 popup('📚 Necropsy Handbook · Path Exam 7',
 '<style>.np-cover{background:linear-gradient(120deg,#f3e3ff,#e1f7eb 55%,#ffefdc);border:2px solid #dfc4ef;border-radius:18px;padding:15px;margin:7px 0 13px}.np-tabs{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}.np-tabs button{font-size:12px;padding:7px 10px}.np-chapters{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.np-chapter{padding:13px;background:#fff;border:2px solid #dbd5eb;border-radius:16px;text-align:left}.np-chapter small{display:block;color:#60708c;margin-top:4px}.np-tag{display:inline-block;border-radius:9px;background:#fff4d8;padding:3px 7px;font-size:11px;font-weight:800}.np-pat{padding:12px;background:#f9f8fc;border:1px solid #d6ddec;border-radius:14px;margin:8px 0}.np-scroll{max-height:40vh;overflow:auto;border:1px solid #dfe1ec;border-radius:12px;padding:9px}.np-question{display:inline-grid;place-items:center;vertical-align:middle;min-width:25px;width:25px;height:25px;padding:0;margin-left:6px;border:2px solid #a38ac3;border-radius:50%;background:#fff8e7;color:#755690;font-size:14px;font-weight:900;cursor:help}.np-question:hover,.np-question:focus-visible{background:#e9daf9;outline:2px solid #f5d6ad}.np-entryrow{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 3px;border-bottom:1px solid #eef1f5}.np-entryrow .np-entryname{min-width:0}</style>'+
 '<div class="np-cover"><strong style="font-size:19px">🦴 The Little Necropsy Handbook</strong>'+helpButton('intro','0','how to use the pathology Handbook')+'<p style="margin:6px 0">Learn the lesion, understand WHY, then identify it on a specimen. Start with a system or look up a disease. The illustrated specimen room and atlas are linked to this handbook.</p><small>Instructor slides + annotated notes first; supplemental guide cross-checked. Specific lecture entries may still require a slide-by-slide validation.</small></div>'+
 nav()+
 '<div class="buttonrow">'+systems.map(s=>'<button data-npsystem="'+safe(s)+'" aria-pressed="'+(s===topic)+'">'+(s==='all'?'All systems':safe(s))+'</button>').join('')+'</div>'+
 '<label>Find a lecture or disease <input data-npsearch="1" id="npSearch" placeholder="e.g. pyometra, meningitis, eye" value="'+safe(search)+'" style="width:100%"></label>'+
 '<div class="np-chapters">'+selected.map(c=>'<button class="np-chapter" data-npchapter="'+c[0]+'"><span class="np-tag">'+safe(c[2])+' · L'+c[0]+'</span><strong style="display:block;margin-top:6px">'+safe(c[1])+'</strong><small>'+c[5].split(';').length+' named concepts/conditions</small><small>'+safe(c[3].slice(0,115))+'…</small></button>').join('')+'</div>');
}
function lecture(n){
 chapter=n;const c=chapters.find(x=>x[0]===n);if(!c)return show();
 const cases=(window.VPQ_PATH_EXAM7?.cards||[]).filter(x=>x.lecture===n);
 popup('📚 L'+n+' · '+c[1],
 nav()+
 '<div class="np-cover"><span class="np-tag">'+safe(c[2])+'</span><h3>'+safe(c[1])+' '+helpButton('chapter',n,c[1])+'</h3><p>'+safe(c[3])+'</p><p><b>What earns points on an image question?</b> '+safe(c[4])+'</p></div>'+
 (window.VPQ_PATH_LECTURE_LEARN?.[n]?'<div class="buttonrow"><button data-nplearn="'+safe(n)+'" style="font-weight:800;background:#e1f7eb;border:2px solid #8dbda4">📖 Learn the full lecture · Slide-by-slide topics</button></div>':'<p class="tiny">Full lecture lesson pending slide-by-slide verification.</p>')+
 '<h4>All named conditions/concepts in this lecture index ('+c[5].split(';').length+')</h4><div class="np-scroll">'+c[5].split(';').map((x,i)=>'<div class="np-entryrow"><span class="np-entryname">🦴 '+safe(x)+'</span>'+helpButton('entry',n+':'+i,x)+'</div>').join('')+'</div>'+
 '<p class="tiny">Index entries are study coverage reminders, not fabricated histology diagnoses. Detailed specimen cards are shown only where the source supports them.</p>'+
 '<h4>Verified gross / histology practice cards ('+cases.length+')</h4><div class="buttonrow">'+cases.map(x=>'<button data-npstudio="gross" data-npnote="'+safe(x.title)+'">'+safe(x.title)+'</button>').join('')+'</div>'+
 '<div class="buttonrow"><button data-npback="1">← All chapters</button><button data-nppattern="1">🔗 Cross-system patterns</button></div>');
}

function learnLecture(n){
 chapter=n;
 const l=window.VPQ_PATH_LECTURE_LEARN?.[n];if(!l)return lecture(n);
 const images={
  '67':{
   0:[['Normal canine brain, veterinary specimen','https://commons.wikimedia.org/wiki/Special:FilePath/Dog_brain_and_eyeballs.jpg','https://commons.wikimedia.org/wiki/File:Dog_brain_and_eyeballs.jpg','Photo: University of São Paulo Museum of Veterinary Anatomy; open the original for attribution/license.']],
   1:[['Dog brain gross anatomical specimen','https://commons.wikimedia.org/wiki/Special:FilePath/Dog_encephalon.jpg','https://commons.wikimedia.org/wiki/File:Dog_encephalon.jpg','Normal brain anatomy: examine symmetry, sulci and gyri.']],
   7:[['Hypoxic neuronal injury — red neuron (H&E)','https://commons.wikimedia.org/wiki/Special:FilePath/Hypoxic_neuronal_injury%2C_HE_1.jpg','https://commons.wikimedia.org/wiki/File:Hypoxic_neuronal_injury,_HE_1.jpg','Recognize a shrunken, hypereosinophilic cell body. Histology example from an open-licensed educational source.']]
  }
 };
 const panels=images[n]||{};
 const diagram=(i)=>{
  if(n!=='67')return '';
  if(i===4)return '<div class="np-edu-diagram"><b>CSF pathway</b><p>Lateral ventricles → Third ventricle → Cerebral aqueduct → Fourth ventricle → Subarachnoid space → Arachnoid villi</p><small>Original teaching pathway based on lecture slides 19–20.</small></div>';
  if(i===12)return '<div class="np-edu-diagram"><b>Compare the two lecture edema mechanisms</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0"><div style="background:#e6f3ff;border-radius:9px;padding:10px"><b>Cytotoxic</b><p>ATP loss → Na⁺ pump failure → intracellular swelling</p><small>BBB intact</small></div><div style="background:#ffece4;border-radius:9px;padding:10px"><b>Vasogenic</b><p>BBB disruption → plasma leakage → extracellular edema</p><small>BBB disrupted</small></div></div></div>';
  if(i===8)return '<div class="np-edu-diagram"><b>Wallerian degeneration</b><p>Axon injury → blocked axonal transport → distal axonal breakdown → spheroids and macrophage cleanup</p><small>Original mechanism pathway informed by lecture slide 28.</small></div>';
  if(i===9)return '<div class="np-edu-diagram"><b>Primary versus secondary demyelination</b><p><b>Primary:</b> oligodendrocyte/myelin injured first; axon relatively preserved.</p><p><b>Secondary:</b> axon injured first, then myelin breaks down.</p></div>';
  return '';
 };
 const visual=i=>(panels[i]||[]).map(p=>'<figure class="np-lesson-photo"><a href="'+safe(p[2])+'" rel="noopener noreferrer" target="_blank"><img loading="lazy" src="'+safe(p[1])+'" alt="'+safe(p[0])+'" onerror="this.style.display=&quot;none&quot;;this.nextElementSibling.style.display=&quot;block&quot;"><span style="display:none;padding:16px;background:#f1f4f9">Photo preview unavailable. Open original image and its attribution.</span></a><figcaption><b>'+safe(p[0])+'</b><p>'+safe(p[3])+'</p><a href="'+safe(p[2])+'" target="_blank" rel="noopener noreferrer">Open full photograph and credit</a></figcaption></figure>').join('');
 const rows=l.sections.map((sec,i)=>'<details class="np-pat" '+(i===0?'open':'')+'><summary><b>'+safe(sec.title)+'</b> <small>slides '+safe(sec.slides)+'</small></summary>'+visual(i)+diagram(i)+sec.points.map(p=>'<p class="np-learn-point"><b>'+safe(p[0])+':</b> '+safe(p[1])+'</p>').join('')+'</details>').join('');
 popup('📖 L'+n+' · Learn the Lecture',nav()+
 '<style>.np-pat{min-width:0;max-width:100%;white-space:normal;overflow-wrap:anywhere}.np-learn-point{margin:8px 0;line-height:1.5;white-space:normal;overflow-wrap:anywhere}.np-lesson-photo{margin:10px 0;padding:10px;background:white;border:1px solid #cdd9e8;border-radius:12px;max-width:100%}.np-lesson-photo img{display:block;max-width:100%;width:100%;max-height:360px;object-fit:contain;background:#f4f6fb;border-radius:8px}.np-lesson-photo figcaption{font-size:12px;line-height:1.45;margin-top:7px}.np-lesson-photo figcaption p{margin:3px 0}.np-edu-diagram{margin:10px 0;padding:12px;border:1px solid #b9d6eb;background:#f3faff;border-radius:12px;font-size:13px}.np-edu-diagram p{margin:7px 0}</style>'+
 '<div class="np-cover"><strong style="font-size:18px">'+safe(l.title)+'</strong><p>Read the teaching material and study the images directly in each section. Lecture and textbook figures guide the content; public images must be licensed for display.</p><small>'+safe(l.source)+'</small></div>'+
 '<h4>Learn the material ('+l.sections.length+' sections)</h4>'+rows+
 '<h4>Check your understanding</h4>'+l.checks.map((q,i)=>'<details class="np-pat"><summary><b>Q'+(i+1)+'.</b> '+safe(q[0])+'</summary><p>'+safe(q[1])+'</p></details>').join('')+
 '<div class="buttonrow"><button data-npchapter="'+safe(n)+'">← Lecture index</button><button data-npstudio="gross">🔬 Practice lesion cases</button></div>');
}

function across(){
 popup('🔗 Across Systems · Necropsy Handbook',
 nav()+'<div class="np-cover"><h3>Think like a pathologist</h3><p>These patterns reappear across the entire exam. Use them to reason from location and histology rather than memorizing isolated names.</p></div>'+
 patterns.map((p,i)=>'<div class="np-pat">'+helpButton('pattern',i,p[0])+'<details><summary><b>'+safe(p[0])+'</b></summary><p>'+safe(p[1])+'</p><p><b>Compare:</b> '+safe(p[2])+'</p></details></div>').join('')+
 '<div class="buttonrow"><button data-npback="1">← Handbook</button></div>');
}

/* Contextual study hints: only show lesion-specific findings from existing case cards.
 * Index-only entries remain labeled as coverage reminders, not fabricated diagnoses.
 */
function cardFor(term,lectureId){
 const cards=window.VPQ_PATH_EXAM7?.cards||[];
 const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 return cards.find(x=>x.lecture===lectureId&&norm(x.title)===norm(term))||null;
}
function helpButton(kind,id,extra=''){
 return '<button type="button" class="np-question" data-nphelp="'+safe(kind)+'" data-nphelpid="'+safe(id)+'" title="Explain this concept and why it matters" aria-label="Why? Explain '+safe(extra||kind)+'">?</button>';
}
function helpPanel(title,sections,footer){
 popup('❔ '+title,nav()+
 '<div class="np-cover"><h3>'+safe(title)+'</h3><p>Use this explanation to connect the finding to the diagnosis.</p></div>'+
 sections.map(x=>'<div class="np-pat"><b>'+safe(x[0])+'</b><p>'+safe(x[1])+'</p></div>').join('')+
 (footer?'<p class="tiny">'+safe(footer)+'</p>':'')+
 '<div class="buttonrow"><button data-npreturn="1">← Return to lecture</button></div>');
}
function openWhy(kind,id){
 if(kind==='intro')return helpPanel('How to study a lesion',[
 ['Observe','Start with organ and distribution, then identify the lesion rather than immediately guessing an etiologic agent.'],
 ['Explain','Connect the histologic injury to the gross change, clinical signs, and disease mechanism.'],
 ['Differentiate','Compare the closest look-alike and choose the feature that actually separates them.']
 ],'Framework only: the Handbook index is not a complete slide-by-slide disease encyclopedia.');
 if(kind==='chapter'){
  const c=chapters.find(x=>x[0]===id);if(!c)return;
  chapter=c[0];return helpPanel('L'+c[0]+' · '+c[1],[
   ['What is happening?',c[3]],['What to focus on when identifying it',c[4]],
   ['Why this matters','Explain how the site, distribution, and underlying injury lead to the findings. Do not infer a specific organism from a nonspecific lesion.']
  ],'These are lecture-level teaching notes. Individual condition details require matching evidence.');
 }
 if(kind==='entry'){
  const sep=id.indexOf(':');const n=id.slice(0,sep),index=Number(id.slice(sep+1));
  const c=chapters.find(x=>x[0]===n);if(!c)return;
  const term=c[5].split(';')[index];if(!term)return;
  chapter=n;
  const match=cardFor(term,n);
  if(match)return helpPanel(term,[
   ['Gross appearance',match.gross],['Morphologic diagnosis',match.dx],
   ['What you should see microscopically',match.histo],['Why this happens / distinguishing clue',match.why],
   ['Exam strategy','Describe the visible features first. Compare signalment, distribution, and histology before choosing an etiology.']
  ],'Based on an existing original Exam 7 study card; verify against the instructor lecture images.');
  return helpPanel(term,[
   ['Coverage','This condition appears in the L'+n+' lecture index. A validated lesion-specific card has not yet been entered.'],
   ['What to learn','Identify the affected species and tissue, expected distribution, gross lesion, histologic change, underlying mechanism, and the nearest differential using your lecture slides.'],
   ['Why it matters','The ability to describe a lesion and rule out a similar disorder is more useful than memorizing the condition name alone.'],
   ['Lecture-level clue',c[4]]
  ],'Index-only entry: no disease-specific gross or microscopic findings have been invented.');
 }
 if(kind==='pattern'){
  const p=patterns[Number(id)];if(!p)return;
  return helpPanel(p[0],[['What this pattern means',p[1]],['Important comparison',p[2]],['How to use it','Ask where the lesion is, which cells or vessels are affected, and whether the distribution supports one mechanism over another.']],'Cross-system concept; verify the particular lesion against its lecture.');
 }
}

function init(host){
 api=host;
 host.body.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(!Object.keys(d).some(k=>k.startsWith('np')))return;
 e.preventDefault();e.stopImmediatePropagation();
 if(d.nphelp!==undefined)return openWhy(d.nphelp,d.nphelpid||'');
 if(d.npreturn!==undefined)return lecture(chapter);
 if(d.nphome!==undefined||d.npback!==undefined)return show();
 if(d.npslideprev!==undefined||d.npslidenext!==undefined||d.npslidezoom!==undefined||d.npdeletepdf!==undefined){window.VPQ_PATH_SLIDES?.clicked(host.body,b);return}
 if(d.nplearn!==undefined)return learnLecture(d.nplearn);
 if(d.npchapter!==undefined)return lecture(d.npchapter);
 if(d.nppattern!==undefined)return across();
 if(d.npquiz!==undefined)return window.VPQ_NECROPSY_QUIZ?.start();
 if(d.npsystem!==undefined){topic=d.npsystem;return show()}
 if(d.npstudio!==undefined)return window.VPQ_PATH_EXAM7?.start(d.npstudio);
 if(d.npedit!==undefined)return window.VPQ_PATH_EXAM7?.start('edit');
 },true);

 host.body.addEventListener('change',e=>{
   const t=e.target;
   if(t?.dataset?.nplecturepdf!==undefined){window.VPQ_PATH_SLIDES?.fileSelected(host.body,t);return}
   if(t?.classList?.contains('np-slide-pagenum')){window.VPQ_PATH_SLIDES?.pageChanged(t);return}
   if(t?.dataset?.npsearch!==undefined){search=t.value.toLowerCase().trim();show()}
 },true);
}
return {init,open:show,lecture,across,chapters,patterns};
})();