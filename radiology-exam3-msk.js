/* Exam 3 · MSK, skull & spine "start here" unit (same layout as the Exam 4 Lungs/Heart units).
 *  1) 6 short lessons with 5-question quick checks.  2) Practice: aggressive or not · name the pattern · name the disease.
 *  3) Lecture films step by step.
 * Films and slides: LMU CVM 743 (MSK I/II), owner-attested permission for non-commercial study.
 * Textbook figures (owner-approved, 2026-11-28): Thrall's Textbook of Veterinary Diagnostic Radiology 8e; Thrall & Robertson Atlas 2e.
 */
(function(){'use strict';
let api=null,view={page:'home'},back=null;
const NS='exam3-msk',STORE='vpq-exam3-msk-v1';
const BASE='https://raw.githubusercontent.com/amppet22-prog/Vet-Pharm-Quest-/main/radiology-course-photos/exam3/';
const U=p=>/^https?:/.test(p)?p:BASE+p;
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function store(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(e){return {}}}
function save(fn){try{const s=store();fn(s);localStorage.setItem(STORE,JSON.stringify(s))}catch(e){}}
function award(id,ok){try{const r=api.awardQuestion?.(NS,id,ok);return r&&r.xp?'+'+r.xp+' study XP':''}catch(e){return ''}}
function pub(id){return (window.VPQ_IMAGING_PUBLISH?.getCases?.()||[]).find(c=>c.id===id)}
const isKey=v=>/\bannotat(?:ed|ion)\b/i.test((v.view||'')+' '+(v.caption||''));

const fig=(u,c)=>'<figure style="margin:0"><a href="'+E(U(u))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(u))+'" alt="'+E(c)+'" style="display:block;width:100%;border-radius:10px;background:#1f2838"></a><figcaption style="font-size:11px;color:#6b7a90;margin-top:3px">'+E(c)+'</figcaption></figure>';
const grid=(...f)=>'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:10px;margin:8px 0 12px">'+f.join('')+'</div>';
const box=(t,h,bg='#fff',bd='#e2dcef')=>'<div style="background:'+bg+';border:1px solid '+bd+';border-radius:14px;padding:11px 13px;margin:0 0 11px">'+(t?'<b style="display:block;margin-bottom:4px;color:#3b4b71">'+t+'</b>':'')+h+'</div>';
const SL='<span style="font-size:10px;font-weight:800;background:#e8f4ff;color:#2f5f9a;border-radius:5px;padding:1px 5px;margin-left:4px">SLIDE</span>';
const AID='<span style="font-size:10px;font-weight:800;background:#f4ecff;color:#7d4fb0;border-radius:5px;padding:1px 5px;margin-left:4px">STUDY AID</span>';
const ul=a=>'<ul style="margin:4px 0;padding-left:18px">'+a.map(x=>'<li style="margin:3px 0">'+x+'</li>').join('')+'</ul>';
const table=(head,rows)=>'<table style="width:100%;border-collapse:collapse;font-size:12.5px"><tr>'+head.map(h=>'<th style="text-align:left;font-size:11px;color:#7d6595;padding:4px 6px">'+h+'</th>').join('')+'</tr>'+rows.map(r=>'<tr>'+r.map((c,i)=>'<td style="border-top:1px solid #ece7f4;padding:5px 6px;vertical-align:top'+(i===0?';font-weight:700':'')+'">'+c+'</td>').join('')+'</tr>').join('')+'</table>';
const q=(t,a,o,ex)=>({q:t,a,o,ex});


/* ------------------------------------------------------------------ lessons */
const TB='<span style="font-size:10px;font-weight:800;background:#fff1dc;color:#9a5a12;border-radius:5px;padding:1px 5px;margin-left:4px">TEXTBOOK</span>';
const TH='Thrall\'s Textbook of Veterinary Diagnostic Radiology, 8th ed. (2025)';
const AT='Thrall & Robertson, Atlas of Normal Radiographic Anatomy and Anatomic Variants in the Dog and Cat, 2nd ed.';
const BF='',BT='';
const TBF=(f,n,src,c)=>fig('_textbook/'+f+'.jpg','📘 '+(src===TH?'Thrall Textbook':'Thrall Atlas')+' Fig. '+n+' — '+c);
const film=(id,c)=>{const v=(pub(id)?.images||[]).filter(x=>x.url&&!isKey(x));return v.length?grid(...v.slice(0,2).map((x,i)=>fig(x.url,c+(v.length>1?' ('+'AB'[i]+')':'')))):''};
const TBOX=(...f)=>box('Textbook'+TB,grid(...f),'#fffaf0','#f1d9a8');

const LESSONS=[
 {id:'aggr',icon:'🔥',title:'Aggressive vs non-aggressive bone',min:6,
  body:()=>box('Any ONE of these = aggressive'+SL,ul(['<b>Cortical disruption</b> (→ pathologic fracture).','A lysis pattern that is moth-eaten or permeative.','An active, interrupted, spiculated or amorphous periosteal reaction.','A <b>long zone of transition</b> / indistinct margins.','Aggressive → infection or neoplasia. You can\'t tell which on films: <b>cytology or histopathology</b>.']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   box('Lysis patterns (least → most aggressive)'+SL,table(['Pattern','Looks like','Think'],[['Geographic','One focal area; sharp (benign) or indistinct margins; short transition','Bone cyst… or aggressive if margins are fuzzy'],['Expansile','Geographic lysis that bulges the cortex; ± Codman\'s triangle','Slower-growing lesion'],['Moth-eaten','Many holes of different sizes, indistinct, long transition','Neoplasia, infection'],['Permeative','Tiny pinpoint holes, very long transition','Malignancy, uncontrolled osteomyelitis']]))+
   film('exam3-msk2-p10-msk2-lysis-pattern','Permeative lysis (MSK II slide 10)')+
   box('Periosteal reactions'+SL,table(['Type','Meaning'],[['Solid (smooth)','Benign — remodeling, chronic low-grade trauma, end of healing'],['Lamellar ("onion skin")','Semi-aggressive — repeated episodes; HOD'],['Palisading / columnar','90° to the bone — hypertrophic osteopathy, bacterial osteomyelitis'],['Spiculated / sunburst','Aggressive — malignancy or infection'],['Amorphous','Very aggressive — malignancy']]))+
   film('exam3-msk2-p18-msk2-periosteal','Spiculated (sunburst) reaction (MSK II slide 18)')+
   box('Who does it?'+SL,ul(['<b>Osteosarcoma</b> ≈ 85% of primary bone tumors; highest metastatic rate (often lung mets at diagnosis).','Polyostotic: hematogenous infection (metaphyses), metastasis (UG carcinoma → lumbar spine), multicentric neoplasia, soft-tissue tumors invading bone (joint, subungual), cat <b>lung–digit syndrome</b>.']))+
   TBOX(TBF('tb-17-11-permeative-lysis','17.11',TH,'permeative lysis: distal femur (A) and ilium (B).'),TBF('tb-17-19-well-defined-lysis','17.19',TH,'well-defined lysis with a sharp edge — narrow transition, non-aggressive.'),TBF('tb-17-20-osa-transition','17.20',TH,'osteosarcoma: you can\'t tell where abnormal bone ends — indistinct transition.'),TBF('tb-17-15-active-periosteal','17.15',TH,'osteosarcoma of the radius: active, irregular periosteal reaction.'),TBF('tb-17-22-productive-osa','17.22',TH,'mostly productive (sclerotic) osteosarcoma — still aggressive: no sharp transition.'),TBF('tb-17-18-smooth-callus','17.18',TH,'smooth, solid periosteal reaction = healed fracture callus (benign).')),
  check:[q('Which lysis pattern is MOST aggressive?','Permeative',['Permeative','Geographic with sharp margins','Expansile','None'],'Slide (MSK II 10).'),
   q('Which periosteal reaction is benign?','Solid, smooth',['Solid, smooth','Spiculated','Amorphous','Interrupted'],'Slide (MSK II 14); textbook 17.18.'),
   q('Aggressive lesion in a long bone: tumor or infection?','You can\'t tell on films — cytology/histopathology',['You can\'t tell on films — cytology/histopathology','Always tumor','Always infection','The periosteal type decides'],'Slide (MSK II 24).'),
   q('Most common primary bone tumor in dogs?','Osteosarcoma',['Osteosarcoma','Chondrosarcoma','Fibrosarcoma','Hemangiosarcoma'],'Slide (MSK II 22).'),
   q('A cat lame in several digits with lysis of P3 — check the…','Lungs (lung–digit syndrome)',['Lungs (lung–digit syndrome)','Spine','Hips','Skull'],'Slide (MSK II 32).')]},

 {id:'joints',icon:'🦵',title:'Joints: DJD, effusion and erosive disease',min:5,
  body:()=>box('What to look for'+SL,ul(['<b>Increased synovial mass</b> (effusion or proliferation).','Periarticular bone: <b>osteophytes</b> (joint margin) and <b>enthesophytes</b> (capsule/ligament/tendon attachment).','<b>Subchondral sclerosis</b>.','Joint space wider or narrower; incongruity, subluxation, luxation.','<b>Subchondral lysis is NOT a feature of benign DJD</b> → think septic, joint neoplasia (synovial cell / histiocytic sarcoma), erosive immune disease.']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   box('Stifle'+SL+TB,'<p style="margin:0">The <b>infrapatellar fat pad</b> gets squashed when there is more synovial volume. It means effusion — <b>not</b> proof of a cruciate tear by itself (subluxation helps).</p>'+grid(TBF('tb-5-35-normal-stifle','5-35',AT,'normal stifle — note the fat pad.'),TBF('tb-20-2-stifle-effusion','20.2',TH,'fat pad normal (A) vs squashed by effusion (B).'),TBF('tb-20-24-meniscal-ossicle','20.24',TH,'cats: a meniscal ossicle can be normal.')))+
   film('exam3-msk1-p35-djd-stifle','Stifle effusion + subluxation (CCL rupture), MSK I')+
   box('Erosive disease'+SL,ul(['<b>Septic arthritis</b>: usually one joint (penetrating wound, surgery); several large joints if hematogenous.','<b>Joint-centered neoplasia</b>: one joint, older dog, often on top of DJD.','<b>Erosive polyarthropathy</b> (rare): rheumatoid arthritis, Greyhound polyarthropathy — many distal joints, subchondral lysis, (sub)luxation.']))+
   TBOX(TBF('tb-20-41-immune-arthropathy','20.41',TH,'immune-mediated arthropathy: subluxations and subchondral erosions (arrows).'),TBF('tb-20-42-feline-polyarthritis','20.42',TH,'feline chronic progressive polyarthritis.'),TBF('tb-20-39-cat-osteochondroma','20.39',TH,'cat: ossified mass at the elbow (synovial osteochondroma).')),
  check:[q('Which is NOT a feature of benign DJD?','Subchondral lysis',['Subchondral lysis','Osteophytes','Subchondral sclerosis','Enthesophytes'],'Slide (MSK I 33).'),
   q('A squashed infrapatellar fat pad means…','Stifle effusion (not proof of CCL tear alone)',['Stifle effusion (not proof of CCL tear alone)','Definite CCL rupture','Normal','Patellar luxation'],'Textbook (Thrall 20.2) and pack note.'),
   q('Bone at a joint capsule or ligament attachment is an…','Enthesophyte',['Enthesophyte','Osteophyte','Sequestrum','Joint mouse'],'Slide (MSK I 27).'),
   q('Single joint with subchondral lysis in an old dog with DJD →','Joint-centered neoplasia (or septic)',['Joint-centered neoplasia (or septic)','Normal aging','OCD','Panosteitis'],'Slide (MSK II 33–36).'),
   q('Many distal joints, subchondral lysis and subluxation →','Erosive polyarthropathy',['Erosive polyarthropathy','DJD','Septic arthritis of one joint','HOD'],'Slide (MSK II 37).')]},

 {id:'ocd',icon:'🦴',title:'OCD and elbow dysplasia',min:5,
  body:()=>box('OC/OCD'+SL,ul(['Large breeds (Lab, Rottweiler, Dane); failure of endochondral ossification of the epiphysis.','Sites: <b>caudal humeral head</b>, <b>medial humeral condyle</b>, femoral condyles, talar trochlear ridges. <b>Often bilateral.</b>','Signs: synovial mass, <b>subchondral flattening/concavity + sclerosis</b>, ± mineralized flap ("joint mouse"), early DJD.']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   film('exam3-msk1-p41-ocd-shoulder','Caudal humeral head OCD (MSK I)')+
   box('Elbow dysplasia — four lesions'+SL,ul(['① OC/OCD of the medial humeral condyle.','② <b>Ununited anconeal process</b> (UAP).','③ <b>Fragmented medial coronoid process</b> (FMCP) — indistinct coronoid, osteophytes on the anconeal process.','④ <b>Joint incongruity</b>.','One or several together; large breeds.']))+
   film('exam3-msk1-p85-bsava-elbow','UAP (MSK I)')+
   TBOX(TBF('tb-4-3-normal-shoulder','4-3',AT,'normal shoulder (lateral and caudocranial, labeled).'),TBF('tb-18-3-trochlear-ocd','18.3',TH,'OCD of the medial humeral trochlea: subtle concavity (CT confirms).'),TBF('tb-18-5-fmcp','18.5',TH,'normal coronoid (A) vs FMCP with DJD (B).')),
  check:[q('Most common shoulder OCD site?','Caudal humeral head',['Caudal humeral head','Greater tubercle','Glenoid','Acromion'],'Slide (MSK I 39–41).'),
   q('OCD signs on films?','Subchondral flattening/concavity with sclerosis ± a mineral flap',['Subchondral flattening/concavity with sclerosis ± a mineral flap','Permeative lysis','Sunburst reaction','Medullary opacity'],'Slide (MSK I 40).'),
   q('Which is NOT one of the four elbow dysplasia lesions?','Panosteitis',['Panosteitis','UAP','FMCP','Joint incongruity'],'Slide (MSK I 77).'),
   q('OCD is often…','Bilateral',['Bilateral','Always unilateral','Only in cats','Only in toy breeds'],'Slide (MSK I 39).'),
   q('An indistinct medial coronoid with anconeal osteophytes →','FMCP with DJD',['FMCP with DJD','UAP','Normal elbow','Osteosarcoma'],'Textbook (Thrall 18.5).')]},

 {id:'growing',icon:'🌱',title:'Growing bones: RCC, HOD, panosteitis',min:5,
  body:()=>box('Compare'+SL,table(['','Retained cartilaginous core','HOD','Panosteitis'],[['Who','Large breeds (less common)','Large/giant puppies; <b>Weimaraners</b>','Large breeds; <b>GSD</b>, Basset'],['Where','Distal <b>ulnar metaphysis</b>','<b>Metaphyses</b> (distal radius, ulna, tibia), several bones','<b>Diaphyses</b> near the nutrient foramen, several bones, shifting'],['Looks like','Triangular lucent cone','Lucent line <b>parallel to the physis</b> ("double physis"), sclerosis, swelling; chronic → periosteal <b>cuff</b>','Patchy <b>increased medullary opacity</b>, blurred corticomedullary border, mild solid periosteal reaction'],['Patient','Often incidental; can cause limb deformity','<b>Sick</b>: fever, anorexia, swelling; may follow distemper vaccine; self-limiting','Shifting leg lameness, otherwise OK; self-limiting']]),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   film('exam3x-msk1-p52','Classic HOD (MSK I slide 52)')+film('exam3x-msk1-p55','Panosteitis (MSK I slide 55)')+
   TBOX(TBF('tb-18-19-retained-core','18.19',TH,'retained cartilage core in the distal ulna (arrows).'),TBF('tb-18-17-hod','18.17',TH,'HOD: acute metaphyseal lucency (A, B); chronic palisading periosteal reaction (C).'),TBF('tb-18-20-panosteitis','18.20',TH,'panosteitis: early nodular vs later diffuse medullary opacity.')),
  check:[q('Lucent line parallel to the physis in a feverish Weimaraner puppy →','HOD',['HOD','Panosteitis','Retained cartilaginous core','Osteosarcoma'],'Slide (MSK I 48–52).'),
   q('Patchy increased medullary opacity near the nutrient foramen in a young GSD →','Panosteitis',['Panosteitis','HOD','OCD','Septic arthritis'],'Slide (MSK I 55–56).'),
   q('Where is a retained cartilaginous core?','Distal ulnar metaphysis',['Distal ulnar metaphysis','Femoral head','Humeral head','Skull'],'Slide (MSK I 44); textbook 18.19.'),
   q('Which of these makes the puppy systemically sick?','HOD',['HOD','Panosteitis','Retained cartilaginous core','Normal growth'],'Slide (MSK I 54).'),
   q('Chronic HOD shows…','A metaphyseal periosteal cuff',['A metaphyseal periosteal cuff','Permeative lysis','A joint mouse','Microcardia'],'Slide (MSK I 53).')]},

 {id:'hips',icon:'🐕',title:'Hips',min:5,
  body:()=>box('Normal'+SL+TB,'<p style="margin:0">Symmetric pelvis; the <b>center of the femoral head is covered</b> by the dorsal acetabular rim (> 50%); the cranial third of the joint is parallel (congruent).</p>'+grid(TBF('tb-18-7-normal-hips','18.7',TH,'normal, well-positioned hips with coverage outlined.'),TBF('tb-5-11-iliac-crest','5-11',AT,'unfused iliac crest — a normal variant, not a fracture.')),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   box('Hip dysplasia'+SL,ul(['Large/giant breeds, bilateral (can be asymmetric); laxity → premature DJD.','<b>Early</b>: widened, wedge-shaped joint space; coverage < 50%.','<b>Then</b>: osteophytes, periarticular bone.','<b>Severe</b>: thick femoral necks, flattened femoral heads.']))+
   film('exam3x-msk1-p64','Hip dysplasia with severe DJD (MSK I slide 64)')+
   box('Legg-Calvé-Perthes (aseptic necrosis of the femoral head)'+SL,ul(['<b>Toy/small breeds</b>, young; usually <b>one</b> side.','Ischemia of the femoral head.','Chronic: <b>muscle atrophy</b>, sclerotic irregular femoral head and neck, wide joint space, early DJD.']))+
   film('exam3x-msk1-p70','Chronic Legg-Calvé-Perthes (MSK I slide 70)')+
   box('Physeal dysplasia (slipped capital epiphysis)'+SL,'<p style="margin:0">Young, <b>male, overweight cats neutered early</b>: the femoral head slips off at the proximal physis (normally closes ~11 months).</p>'),
  check:[q('Early hip dysplasia sign?','Coverage < 50% with a wedge-shaped joint space',['Coverage < 50% with a wedge-shaped joint space','Sclerotic femoral head in a Yorkie','Permeative lysis','Lamellar periosteal reaction'],'Slide (MSK I 61).'),
   q('A 7-month-old Yorkie, one hind leg, sclerotic irregular femoral head, thin thigh muscles →','Legg-Calvé-Perthes',['Legg-Calvé-Perthes','Hip dysplasia','Physeal dysplasia','Panosteitis'],'Slide (MSK I 67–71).'),
   q('Overweight young neutered male cat with a slipped femoral head →','Physeal dysplasia',['Physeal dysplasia','Legg-Calvé-Perthes','Hip dysplasia','Septic arthritis'],'Slide (MSK I 73–74).'),
   q('Thick femoral necks and flattened heads mean…','Severe hip dysplasia with DJD',['Severe hip dysplasia with DJD','Normal','Early hip dysplasia','LCP'],'Slide (MSK I 65).'),
   q('An unfused iliac crest on a Labrador is…','A normal variant',['A normal variant','A fracture','Osteosarcoma','Hip dysplasia'],'Textbook (Thrall Atlas 5-11).')]},

 {id:'skull',icon:'💀',title:'Skull and spine views (normal)',min:3,
  body:()=>box('Textbook normals'+TB,'<p style="margin:0 0 6px">Use these to learn the views before the skull and spine disease films in the hub.</p>'+grid(TBF('tb-2-1-normal-skull','2-1',AT,'normal skull, lateral and DV, with labels.'),TBF('tb-2-15-open-mouth-nasal','2-15',AT,'open-mouth view of the nasal cavity.'),TBF('tb-2-25-tmj','2-25',AT,'DV view of the temporomandibular joint.'),TBF('tb-2-33-bulla','2-33',AT,'open-mouth rostrocaudal view of the tympanic bullae.'),TBF('tb-3-13-normal-cspine','3-13',AT,'normal cranial cervical spine in four dogs — the atlas and axis laminae stay in line.')),'linear-gradient(120deg,#f4eaff,#eaf9f5)'),
  check:[q('Which view shows both tympanic bullae best?','Open-mouth rostrocaudal',['Open-mouth rostrocaudal','Lateral','DV','Intraoral'],'Textbook (Thrall Atlas 2-33).'),
   q('On a normal lateral cervical spine, what stays constant?','The dorsal laminae of the atlas and axis are in line',['The dorsal laminae of the atlas and axis are in line','The space between C1 and C2 spinous processes','Disc width','Nothing'],'Textbook (Thrall Atlas 3-13): the linear relationship assesses atlantoaxial alignment.'),
   q('An alternative to an intraoral nasal view on digital systems?','Open-mouth (V20°R-DCdO) view',['Open-mouth (V20°R-DCdO) view','Lateral','DV','Rostrocaudal'],'Textbook (Thrall Atlas 2-15).'),
   q('What does the skull DV show that the lateral can\'t?','Left vs right symmetry',['Left vs right symmetry','Nothing more','Only teeth','Only the bulla'],'Study aid: orthogonal views; textbook 2-1.'),
   q('The TMJ is formed by the mandibular condyle and the…','Mandibular fossa of the temporal bone',['Mandibular fossa of the temporal bone','Occipital condyle','Atlas','Zygomatic arch of the maxilla'],'Textbook (Thrall Atlas 2-25).')]}
];

/* ------------------------------------------------------------------ skill banks */
const T=(img,ans,ex,key,src,more)=>Object.assign({img:[].concat(img),a:ans,ex,key,src},more||{});
const C1=id=>{const c=pub(id);return (c?.images||[]).filter(v=>v.url&&!isKey(v)).map(v=>v.url)};
const K1=id=>{const c=pub(id);return (c?.images||[]).filter(v=>v.url&&isKey(v)).map(v=>v.url)[0]};
const AG=['Aggressive','Non-aggressive'];
const PAT=['Geographic lysis','Expansile lysis','Moth-eaten lysis','Permeative lysis','Solid periosteal reaction','Lamellar periosteal reaction','Palisading periosteal reaction','Spiculated periosteal reaction','Amorphous periosteal reaction'];
const DX=['Osteochondrosis / OCD','UAP','FMCP','Elbow incongruity','Retained cartilaginous core','HOD','Panosteitis','Hip dysplasia','Legg-Calvé-Perthes','Physeal dysplasia','Stifle effusion / CCL rupture','Septic arthritis','Erosive polyarthropathy','Joint-centered neoplasia'];
const FILM=(id,a,o,q)=>{const c=pub(id);return T(C1(id),a,((c?.findings||'')+' '+(c?.interpretation||'')).trim(),K1(id),c?.title,{q,o,id:q.slice(0,5)+':'+id})};
const TBQ=(f,a,o,q,ex)=>T('_textbook/'+f+'.jpg',a,ex,'',TH,{q,o,id:'tb'+q.slice(0,4)+':'+f});
function skills(){
 const AQ='Aggressive or non-aggressive?',PQ='Name the pattern.',DQ='Diagnosis?';
 const ag=[FILM('exam3-msk2-p04-msk2-lysis-pattern','Aggressive',AG,AQ),FILM('exam3-msk2-p09-msk2-lysis-pattern','Aggressive',AG,AQ),FILM('exam3-msk2-p10-msk2-lysis-pattern','Aggressive',AG,AQ),FILM('exam3-msk2-p14-msk2-periosteal','Non-aggressive',AG,AQ),FILM('exam3-msk2-p18-msk2-periosteal','Aggressive',AG,AQ),FILM('exam3-msk2-p19-msk2-periosteal','Aggressive',AG,AQ),FILM('exam3-msk2-p24-bsava-infection-neoplasm','Aggressive',AG,AQ),
  TBQ('tb-17-19-well-defined-lysis','Non-aggressive',AG,AQ,'Textbook (Thrall 17.19): sharp edge, narrow transition, no cortex destruction or active periosteal reaction.'),
  TBQ('tb-17-18-smooth-callus','Non-aggressive',AG,AQ,'Textbook (Thrall 17.18): smooth healed fracture callus.'),
  TBQ('tb-17-20-osa-transition','Aggressive',AG,AQ,'Textbook (Thrall 17.20): indistinct transition + active periosteal reaction — osteosarcoma.'),
  TBQ('tb-17-22-productive-osa','Aggressive',AG,AQ,'Textbook (Thrall 17.22): productive but no sharp transition — osteosarcoma.'),
  TBQ('tb-17-11-permeative-lysis','Aggressive',AG,AQ,'Textbook (Thrall 17.11): permeative lysis.')].filter(x=>x.img.length);
 const pt=[['exam3-msk2-p06-msk2-lysis-pattern',0],['exam3-msk2-p08-msk2-lysis-pattern',1],['exam3-msk2-p09-msk2-lysis-pattern',2],['exam3-msk2-p10-msk2-lysis-pattern',3],['exam3-msk2-p14-msk2-periosteal',4],['exam3-msk2-p16-msk2-periosteal',5],['exam3-msk2-p17-msk2-periosteal',6],['exam3-msk2-p18-msk2-periosteal',7],['exam3-msk2-p19-msk2-periosteal',8]].map(([id,i])=>FILM(id,PAT[i],PAT,PQ)).filter(x=>x.img.length);
 const dx=[['exam3-msk1-p41-ocd-shoulder',0],['exam3-msk1-p42-bsava-elbow',0],['exam3-msk1-p85-bsava-elbow',1],['exam3-msk1-p89-bsava-elbow',2],['exam3-msk1-p91-bsava-elbow',3],['exam3x-msk1-p45',4],['exam3x-msk1-p51',5],['exam3x-msk1-p56',6],['exam3x-msk1-p62',7],['exam3x-msk1-p69',8],['exam3x-msk1-p74',9],['exam3-msk1-p35-djd-stifle',10],['exam3x-msk2-p33',11],['exam3x-msk2-p37',12],['exam3x-msk2-p36',13]].map(([id,i])=>FILM(id,DX[i],DX,DQ)).concat([
  TBQ('tb-18-19-retained-core','Retained cartilaginous core',DX,DQ,'Textbook (Thrall 18.19).'),TBQ('tb-18-17-hod','HOD',DX,DQ,'Textbook (Thrall 18.17).'),TBQ('tb-18-20-panosteitis','Panosteitis',DX,DQ,'Textbook (Thrall 18.20).'),TBQ('tb-18-5-fmcp','FMCP',DX,'Look at panel B. '+DQ,'Textbook (Thrall 18.5B): indistinct coronoid with anconeal osteophytes.'),TBQ('tb-20-41-immune-arthropathy','Erosive polyarthropathy',DX,DQ,'Textbook (Thrall 20.41): subluxations and subchondral erosions in both carpi.')]).filter(x=>x.img.length);
 return {aggr:{title:'Aggressive or not?',icon:'🔥',items:ag},pattern:{title:'Name the pattern',icon:'🩻',items:pt},dx:{title:'Name the disease',icon:'🦴',items:dx}};
}

/* ------------------------------------------------------------------ step-by-step class cases */
const S=(q,a,o,ex)=>({q,a,o:o||[],ex});
const CASES=[
 {g:'MSK lecture films',id:'exam3-msk2-p24-bsava-infection-neoplasm',steps:[S('Aggressive or non-aggressive?','Aggressive',AG,'Slide (MSK II 20): any aggressive sign counts.'),S('Your two big differentials?','Neoplasia or infection',['Neoplasia or infection','DJD or OCD','HOD or panosteitis','Fracture or normal'],'Slide (MSK II 20).'),S('How do you tell them apart?','Cytology or histopathology',['Cytology or histopathology','Another radiograph','The periosteal type','Age alone'],'Slide (MSK II 24).')]},
 {g:'MSK lecture films',id:'exam3x-msk1-p52',steps:[S('Where is the lesion?','Metaphyses',['Metaphyses','Diaphyses','Epiphyses','Joints'],'Slide (MSK I 48–50).'),S('What is the key sign?','Lucent line parallel to the physis',['Lucent line parallel to the physis','Medullary opacity near the nutrient foramen','Subchondral concavity','Permeative lysis'],'Slide (MSK I 52).'),S('Diagnosis?','HOD',['HOD','Panosteitis','Retained cartilaginous core','Osteosarcoma'],'Slide.'),S('What else would the puppy have?','Fever, anorexia, swollen metaphyses',['Fever, anorexia, swollen metaphyses','Nothing — it\'s incidental','A heart murmur','Hind-limb paralysis'],'Slide (MSK I 54).')]},
 {g:'MSK lecture films',id:'exam3x-msk1-p64',steps:[S('Femoral head coverage?','Less than 50%',['Less than 50%','Normal','Over 90%','Can\'t tell'],'Slide (MSK I 61).'),S('Bone changes?','Osteophytes, thick femoral necks, flattened heads',['Osteophytes, thick femoral necks, flattened heads','Permeative lysis','Lucent physeal line','Nothing'],'Slide (MSK I 63–65).'),S('Diagnosis?','Hip dysplasia with severe DJD',['Hip dysplasia with severe DJD','Legg-Calvé-Perthes','Physeal dysplasia','Normal hips'],'Slide.')]},
 {g:'MSK lecture films',id:'exam3x-msk1-p70',steps:[S('Signalment that fits?','Young toy breed, one leg',['Young toy breed, one leg','Old giant breed, both legs','Overweight male cat','Any breed'],'Slide (MSK I 67).'),S('Femoral head?','Sclerotic and irregular, with a wide joint space',['Sclerotic and irregular, with a wide joint space','Normal','Slipped off the physis','Permeative lysis'],'Slide (MSK I 71).'),S('Soft tissue clue?','Muscle atrophy of that limb',['Muscle atrophy of that limb','Swelling','Gas','Nothing'],'Slide (MSK I 71).'),S('Diagnosis?','Legg-Calvé-Perthes (chronic)',['Legg-Calvé-Perthes (chronic)','Hip dysplasia','Septic arthritis','Physeal dysplasia'],'Slide.')]}
];

/* ------------------------------------------------------------------ rendering helpers */
function shell(title,html){api.showModal(title,'<div style="font-size:13px;color:#354967;line-height:1.55">'+html+'</div>');try{api.body.scrollTop=0}catch(e){}}
function navBtns(extra){return '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px"><button type="button" data-vpqmu="home">← MSK unit</button>'+(extra||'')+'</div>'}
function order(seed,arr){return arr.slice().sort((a,b)=>hash(seed+a)-hash(seed+b))}
function opts(it){
 if(it.o.length<=4)return it.o.slice();
 const others=order(it.id,it.o.filter(x=>x!==it.a)).slice(0,3);return order(it.id+'x',[it.a,...others]);
}
const optBtn=(i,x,state,attr)=>{let st='background:#fff;border:1px solid #d8dfea;color:#344f78';if(state==='g')st='background:#e3f6e8;border:2px solid #2e9a57;color:#1d5e36';else if(state==='o')st='background:#fff0e0;border:2px solid #e07b1a;color:#8a4a0c';else if(state==='dim')st='background:#fafafa;border:1px solid #e3e6ee;color:#8a95a8';
 return '<button type="button" '+attr+'="'+i+'" aria-disabled="'+(state!=='')+'" style="display:block;width:100%;text-align:left;margin:6px 0;padding:10px 12px;border-radius:10px;font-weight:700;opacity:1;'+st+'">'+'ABCDEF'[i]+'. '+E(x)+(state==='g'?' ✓':'')+'</button>'};
const imgsHtml=list=>list.length?'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:8px;margin:8px 0">'+list.map((u,i)=>'<figure style="margin:0;background:#202a3b;border-radius:10px;overflow:hidden"><a href="'+E(U(u))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(u))+'" alt="View '+'ABCD'[i]+'" style="display:block;width:100%;max-height:400px;object-fit:contain"></a><figcaption style="background:#eef2f8;color:#344f78;font-size:11.5px;padding:5px 8px"><b>View '+'ABCD'[i]+'</b> · tap to enlarge</figcaption></figure>').join('')+'</div>':'';

/* ------------------------------------------------------------------ pages */
function home(){
 const st=store(),L=st.lessons||{},items=st.items||{},cs=st.cases||{};
 const sk=skills();
 const lessonRows=LESSONS.map((l,i)=>{const r=L[l.id];return '<button type="button" data-vpqmu="lesson-'+i+'" style="display:flex;gap:10px;align-items:center;text-align:left;width:100%;padding:9px 11px;margin:0 0 6px;background:#fff;border:1px solid '+(r?.score>=4?'#2e9a57':r?'#9fd3b5':'#d8dfea')+';border-radius:12px"><span style="font-size:20px">'+l.icon+'</span><span style="flex:1"><b style="color:#344f78">'+(i+1)+'. '+E(l.title)+'</b><small style="display:block;color:#68788a">about '+l.min+' min · quick check: 5 questions'+(r?' · <b style="color:#1d5e36">best '+r.score+'/5</b>':'')+'</small></span><span style="color:#7d6595;font-weight:800">›</span></button>'}).join('');
 const nxt=LESSONS.findIndex(l=>!(L[l.id]?.score>=4));
 const skillCard=k=>{const s=sk[k],n=s.items.length,done=s.items.filter(it=>items[it.id]).length;
  return '<div style="background:#fff;border:1px solid #d8dfea;border-radius:12px;padding:9px 11px"><b style="color:#344f78">'+s.icon+' '+E(s.title)+'</b><small style="display:block;color:#68788a">'+n+' questions · '+done+' answered correctly</small>'+
  '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">'+[5,10,0].filter(c=>c===0||c<n).map(c=>'<button type="button" data-vpqmu="run-'+k+'-'+c+'" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">'+(c?c+' shuffled':'All '+n)+'</button>').join('')+'</div>'+
  '<details style="margin-top:6px"><summary style="cursor:pointer;font-size:12px;color:#5d6d84;font-weight:700">Pick a film</summary><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">'+s.items.map((it,i)=>'<button type="button" data-vpqmu="pick-'+k+'-'+i+'" style="padding:3px 8px;border-radius:8px;font-size:12px;'+(items[it.id]?'background:#e3f6e8;border:1px solid #2e9a57':'')+'">'+(it.img.length?'Film ':'Q ')+(i+1)+(items[it.id]?' ✓':'')+'</button>').join('')+'</div></details></div>'};
 const groups=[...new Set(CASES.map(c=>c.g))];
 const caseList=groups.map(g=>'<details style="margin:0 0 6px"><summary style="cursor:pointer;font-weight:800;color:#3b4b71">'+E(g)+' <small style="color:#68788a;font-weight:600">('+CASES.filter(c=>c.g===g).length+')</small></summary><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:6px;margin:6px 0">'+CASES.map((c,i)=>[c,i]).filter(([c])=>c.g===g).map(([c,i])=>{const p=pub(c.id);const name=String(p?.title||'').split(' · ').slice(2).join(' · ')||'Case';const r=cs[c.id];return '<button type="button" data-vpqmu="case-'+i+'" style="text-align:left;padding:8px 10px;background:#fff;border:1px solid '+(r?.done?'#2e9a57':'#d8dfea')+';border-radius:10px"><b style="font-size:12.5px;color:#344f78">'+(r?.done?'⭐ ':'')+E(name)+'</b><small style="display:block;color:#68788a">'+E(p?.species||'')+' · '+c.steps.length+' steps'+(r?.done?' · '+r.score+'/'+c.steps.length:'')+'</small></button>'}).join('')+'</div></details>').join('');
 shell('🦴 Exam 3 · MSK, skull & spine',
  '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px"><button type="button" data-vpqmu="back">← '+E(back?.backLabel||'Exam 3')+'</button></div>'+
  box('📖 1 · Start here — learn it','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Suggested order — everything is open. Each lesson ends with a 5-question quick check. 📘 = textbook figure.</p>'+(nxt>=0?'<button type="button" data-vpqmu="lesson-'+nxt+'" style="margin:0 0 8px;background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">▶ '+(nxt===0&&!Object.keys(L).length?'Start':'Continue')+': '+E(LESSONS[nxt].title)+'</button>':'')+lessonRows,'linear-gradient(120deg,#f4eaff,#eaf9f5)','#e0d6ed')+
  box('🎯 2 · Practice by skill','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Pick a skill and how many. Films have no title until you answer.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:8px">'+['aggr','pattern','dx'].map(skillCard).join('')+
   '<div style="background:#fff;border:1px solid #d8dfea;border-radius:12px;padding:9px 11px"><b style="color:#344f78">🔀 Mixed practice</b><small style="display:block;color:#68788a">Every skill, shuffled</small><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px"><button type="button" data-vpqmu="run-mixed-10" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">10 shuffled</button><button type="button" data-vpqmu="run-mixed-20" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">20 shuffled</button></div></div></div>','#fff')+
  box('🩺 3 · Lecture films, step by step','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Lecture films worked one step at a time, with the slide keys at the end.</p>'+caseList,'#fff')+
  '<p style="font-size:11px;color:#6b7a90">Films and slides: LMU CVM 743 MSK I/II lectures, used with LMU permission for non-commercial study. 📘 Textbook figures: '+E(TH)+'; '+E(AT)+' — credited by figure number. "Slide"/"Professor" = lecture text and her in-class notes; "study aid" = written for the game from those slides.</p>');
}
let L={i:0,qi:-1,ans:{}};
function lesson(i){
 L={i,qi:-1,ans:{}};const l=LESSONS[i];
 shell(l.icon+' Lesson '+(i+1)+' · '+l.title,navBtns((i>0?'<button type="button" data-vpqmu="lesson-'+(i-1)+'">‹ Lesson '+i+'</button>':'')+(i<LESSONS.length-1?'<button type="button" data-vpqmu="lesson-'+(i+1)+'">Lesson '+(i+2)+' ›</button>':''))+l.body()+
  '<div style="text-align:center;margin:14px 0"><button type="button" data-vpqmu="check" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800;padding:10px 16px">✅ Quick check · 5 questions</button></div>');
}
function check(){
 const l=LESSONS[L.i],k=L.qi,it=l.check[k];
 if(k>=l.check.length){const score=Object.values(L.ans).filter(Boolean).length;save(s=>{s.lessons=s.lessons||{};const old=s.lessons[l.id]?.score||0;s.lessons[l.id]={score:Math.max(old,score)}});
  return shell('✅ Quick check · '+l.title,navBtns()+box('',(score>=4?'<b style="color:#1d5e36;font-size:16px">🎉 '+score+' / 5</b><p>Nice — you\'ve got this lesson.</p>':'<b style="color:#8a4a0c;font-size:16px">'+score+' / 5</b><p>Worth a second look before moving on.</p>')+'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px"><button type="button" data-vpqmu="lesson-'+L.i+'">↺ Review the lesson</button>'+(L.i<LESSONS.length-1?'<button type="button" data-vpqmu="lesson-'+(L.i+1)+'" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">Next: '+E(LESSONS[L.i+1].title)+' ›</button>':'<button type="button" data-vpqmu="run-mixed-10" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">🔀 Try mixed practice</button>')+'</div>','#fff'));
 }
 const o=order(l.id+k,it.o),chosen=L.ans['c'+k];
 shell('✅ Quick check · '+l.title,navBtns('<button type="button" data-vpqmu="lesson-'+L.i+'">↺ Back to the lesson</button>')+'<small style="color:#5d6d84">Question '+(k+1)+' of 5</small>'+
  box('',(it.img?imgsHtml([it.img]):'')+'<b style="font-size:14px">'+E(it.q)+'</b>'+o.map((x,i)=>optBtn(i,x,chosen===undefined?'':x===it.a?'g':i===chosen?'o':'dim','data-vpqmu-qc')).join('')+
  (chosen!==undefined?'<p style="margin:6px 0 0;font-weight:700;color:'+(o[chosen]===it.a?'#1d5e36':'#8a4a0c')+'">'+(o[chosen]===it.a?'✓ Correct.':'Not quite — the answer is in green.')+'</p><p style="margin:4px 0 0;font-size:12.5px">'+E(it.ex)+'</p><div style="text-align:right"><button type="button" data-vpqmu="qnext" style="font-weight:800">'+(k<4?'Next question ›':'See my score ›')+'</button></div>':''),'#f7f1fd','#dacfe8'));
}
let R={list:[],at:0,chosen:{},key:false,title:''};
function run(list,title,at=0){R={list,at,chosen:{},key:false,title};runRender()}
function runRender(){
 const it=R.list[R.at],n=R.list.length,o=opts(it),ch=R.chosen[R.at];
 const nav='<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><button type="button" data-vpqmu="home">← MSK unit</button><button type="button" data-vpqmu="rprev" '+(R.at===0?'disabled':'')+'>‹ Previous</button><button type="button" data-vpqmu="rnext" '+(R.at>=n-1?'disabled':'')+'>Next ›</button><small style="color:#5d6d84;margin-left:auto">'+(it.img.length?'Film':'Question')+' '+(R.at+1)+' of '+n+'</small></div>';
 const done=Object.keys(R.chosen).length===n,score=R.list.filter((x,i)=>R.chosen[i]!==undefined&&opts(x)[R.chosen[i]]===x.a).length;
 shell('🎯 '+R.title,nav+imgsHtml(it.img)+
  box('','<b style="font-size:14px">'+E(it.q)+'</b>'+o.map((x,i)=>optBtn(i,x,ch===undefined?'':x===it.a?'g':i===ch?'o':'dim','data-vpqmu-ans')).join('')+
  (ch!==undefined?'<p style="margin:6px 0 0;font-weight:700;color:'+(o[ch]===it.a?'#1d5e36':'#8a4a0c')+'">'+(o[ch]===it.a?'✓ Correct.':'Not quite — the answer is in green.')+(R.reward?' '+E(R.reward):'')+'</p><p style="margin:4px 0 0;font-size:12.5px">'+E(it.ex)+'</p>'+(it.src?'<p style="margin:4px 0 0;font-size:11px;color:#6b7a90">Source: '+E(String(it.src).replace(/^Exam 4 · /,''))+'</p>':'')+
   (it.key?'<div class="buttonrow" style="margin-top:6px"><button type="button" data-vpqmu="rkey">'+(R.key?'🙈 Hide the marked slide':'👉 Show me where (marked slide)')+'</button></div>'+(R.key?'<a href="'+E(U(it.key))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(it.key))+'" alt="Marked slide" style="display:block;width:100%;border-radius:10px;margin-top:6px"></a>':''):''):''),'#f7f1fd','#dacfe8')+
  (done?box('🏁 Round finished','<b style="font-size:15px;color:'+(score>=n*.8?'#1d5e36':'#8a4a0c')+'">'+score+' / '+n+'</b><div class="buttonrow" style="margin-top:6px"><button type="button" data-vpqmu="home">← Pick another skill</button></div>','#eefaf3','#c7e7d4'):'')+nav);
}
let CS={i:0,step:0,chosen:[],key:false};
function caseOpen(i){CS={i,step:0,chosen:[],key:false};caseRender()}
function caseRender(){
 const cdef=CASES[CS.i],c=pub(cdef.id);if(!c)return home();
 const views=(c.images||[]).filter(v=>v.url&&!isKey(v)).map(v=>v.url),keys=(c.images||[]).filter(v=>v.url&&isKey(v));
 const name=String(c.title||'').split(' · ').slice(2).join(' · ');
 const stepHtml=cdef.steps.map((s,k)=>{
  if(k>CS.step)return '<div style="border:1px dashed #d8dfea;border-radius:12px;padding:8px 11px;margin:0 0 8px;color:#9aa5b8"><b>Step '+(k+1)+'</b> · locked</div>';
  const o=order(cdef.id+k,s.o),ch=CS.chosen[k];
  return '<div style="background:'+(ch===undefined?'#f7f1fd':'#fff')+';border:'+(ch===undefined?'2px solid #3b4b71':'1px solid #dacfe8')+';border-radius:12px;padding:10px 12px;margin:0 0 8px"><b>Step '+(k+1)+' · '+E(s.q)+'</b>'+o.map((x,i)=>optBtn(i,x,ch===undefined?'':x===s.a?'g':i===ch?'o':'dim','data-vpqmu-step')).join('')+
   (ch!==undefined?'<p style="margin:4px 0 0;font-size:12.5px"><b style="color:'+(o[ch]===s.a?'#1d5e36':'#8a4a0c')+'">'+(o[ch]===s.a?'✓ Correct.':'Not quite.')+'</b> '+E(s.ex)+'</p>':'')+'</div>'}).join('');
 const finished=CS.chosen.length===cdef.steps.length&&CS.chosen.every(x=>x!==undefined);
 const score=cdef.steps.filter((s,k)=>CS.chosen[k]!==undefined&&order(cdef.id+k,s.o)[CS.chosen[k]]===s.a).length;
 const pv=CS.i>0,nx=CS.i<CASES.length-1;
 shell('🩺 '+E(cdef.g),'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><button type="button" data-vpqmu="home">← MSK unit</button><button type="button" data-vpqmu="cprev" '+(pv?'':'disabled')+'>‹ Previous case</button><button type="button" data-vpqmu="cnext" '+(nx?'':'disabled')+'>Next case ›</button><small style="color:#5d6d84;margin-left:auto">Case '+(CS.i+1)+' of '+CASES.length+'</small></div>'+
  '<h2 style="font-size:16px;margin:10px 0 2px;color:#3b4b71">'+E(name)+'</h2><p style="margin:0 0 6px;color:#7d6595;font-size:12px">'+E(c.species||'')+' · '+cdef.steps.length+' steps</p>'+
  (c.history?'<div style="border:1px solid #dbe2f0;border-radius:12px;background:#f4f8ff;padding:9px 12px"><b>🏥 History</b><p style="margin:4px 0 0">'+E(c.history)+'</p></div>':'')+imgsHtml(views)+stepHtml+
  (finished?box('🏁 '+score+' / '+cdef.steps.length+' steps correct','<p style="margin:0 0 4px"><b>Findings.</b> '+E(c.findings||'')+'</p><p style="margin:0"><b>Interpretation.</b> '+E(c.interpretation||'')+'</p>'+
   (keys.length?'<div class="buttonrow" style="margin-top:8px"><button type="button" data-vpqmu="ckey">'+(CS.key?'🙈 Hide answer keys':'🖼️ Show answer keys ('+keys.length+')')+'</button></div>'+(CS.key?keys.map(v=>'<figure style="margin:8px 0 0"><a href="'+E(v.url)+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(v.url)+'" alt="" style="width:100%;border-radius:10px;border:1px solid #cfd8e6"></a><figcaption style="font-size:11px;color:#5d6d84">'+E(String(v.view).replace(/^Annotated (teaching key|comparison|textbook view) · /,''))+'</figcaption></figure>').join(''):''):'')+
   '<p style="font-size:11px;color:#6b7a90;margin:8px 0 0">'+E(c.source||'')+'</p>'+(nx?'<div style="text-align:right"><button type="button" data-vpqmu="cnext" style="font-weight:800">Next case ›</button></div>':''),'#f0f9f5','#cce4db'):''));
}

function open(o){back=o||back;return (window.VPQ_IMAGING_PUBLISH?.load?.()||Promise.resolve()).then(home).catch(home)}
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function init(ctx){
 api=ctx;if(api.body.__vpqMuInit)return;api.body.__vpqMuInit=true;
 api.body.addEventListener('click',e=>{
  const qc=e.target.closest('[data-vpqmu-qc]');if(qc){e.preventDefault();const k=L.qi;if(L.ans['c'+k]!==undefined)return;const l=LESSONS[L.i],it=l.check[k],o=order(l.id+k,it.o),i=+qc.dataset.vpqmuQc;L.ans['c'+k]=i;L.ans[k]=o[i]===it.a;award('lesson:'+l.id+':'+k,o[i]===it.a);return check()}
  const an=e.target.closest('[data-vpqmu-ans]');if(an){e.preventDefault();if(R.chosen[R.at]!==undefined)return;const it=R.list[R.at],i=+an.dataset.vpqmuAns,ok=opts(it)[i]===it.a;R.chosen[R.at]=i;R.reward=award(it.id,ok);if(ok)save(s=>{s.items=s.items||{};s.items[it.id]=true});return runRender()}
  const st=e.target.closest('[data-vpqmu-step]');if(st){e.preventDefault();const k=CS.step,cdef=CASES[CS.i];if(CS.chosen[k]!==undefined)return;const s=cdef.steps[k],i=+st.dataset.vpqmuStep,ok=order(cdef.id+k,s.o)[i]===s.a;CS.chosen[k]=i;award('case:'+cdef.id+':'+k,ok);if(k<cdef.steps.length-1)CS.step=k+1;else{const sc=cdef.steps.filter((s2,j)=>order(cdef.id+j,s2.o)[CS.chosen[j]]===s2.a).length;save(s2=>{s2.cases=s2.cases||{};const old=s2.cases[cdef.id]?.score||0;s2.cases[cdef.id]={done:true,score:Math.max(old,sc)}})}return caseRender()}
  const b=e.target.closest('[data-vpqmu]');if(!b||b.disabled)return;e.preventDefault();const k=b.dataset.vpqmu;
  if(k==='back')return back?.onBack?back.onBack():window.VPQ_RADIOLOGY_EXAM3?.open?.();
  if(k==='home')return home();
  if(k.startsWith('lesson-'))return lesson(+k.slice(7));
  if(k==='check'){L.qi=0;L.ans={};return check()}
  if(k==='qnext'){L.qi++;return check()}
    if(k.startsWith('run-')){const [,sk,c]=k.split('-'),all=skills();let list,title;if(sk==='mixed'){list=shuffle(Object.values(all).flatMap(s=>s.items));title='Mixed practice'}else{list=+c?shuffle(all[sk].items):all[sk].items.slice();title=all[sk].title}if(+c)list=list.slice(0,+c);return run(list,title)}
  if(k.startsWith('pick-')){const [,sk,i]=k.split('-'),all=skills();return run(all[sk].items.slice(),all[sk].title,+i)}
  if(k==='rprev'){R.at=Math.max(0,R.at-1);R.key=false;R.reward='';return runRender()}
  if(k==='rnext'){R.at=Math.min(R.list.length-1,R.at+1);R.key=false;R.reward='';return runRender()}
  if(k==='rkey'){R.key=!R.key;return runRender()}
  if(k.startsWith('case-'))return caseOpen(+k.slice(5));
  if(k==='cprev')return caseOpen(CS.i-1);
  if(k==='cnext')return caseOpen(CS.i+1);
  if(k==='ckey'){CS.key=!CS.key;return caseRender()}
 });
}
window.VPQ_EXAM3_MSK=Object.freeze({init,open,home:open,lessons:LESSONS.length,cases:CASES.length});
})();
