/* Exam 4 · Pleura, mediastinum, esophagus, trachea, diaphragm & ribs unit (same layout as the Lungs and Heart units).
 *  1) 7 short lessons with 5-question quick checks.  2) Practice: where is the problem · name it · signalment → diagnosis.
 *  3) Class cases step by step (L6–L7).
 * Films and slides: LMU CVM 743 (Dr. Lynn Griffin), owner-attested permission for non-commercial study.
 * Textbook figures (owner-approved, 2026-11-28): BSAVA Foundation (Holloway & McConnell 2013), BSAVA Thoracic Imaging 2e
 * (Schwarz & Scrivani 2024), Thrall & Robertson Atlas 2e; each credited by figure number.
 */
(function(){'use strict';
let api=null,view={page:'home'},back=null;
const NS='exam4-cavity',STORE='vpq-exam4-cavity-v1';
const BASE='https://raw.githubusercontent.com/amppet22-prog/Vet-Pharm-Quest-/main/radiology-course-photos/exam4/';
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
const PROF='<span style="font-size:10px;font-weight:800;background:#e6f6ee;color:#23744a;border-radius:5px;padding:1px 5px;margin-left:4px">PROFESSOR</span>';
const BF='BSAVA Manual of Canine and Feline Radiography and Radiology (Holloway & McConnell, 2013)';
const BT='BSAVA Manual of Canine and Feline Thoracic Imaging, 2nd ed. (Schwarz & Scrivani, 2024)';
const AT='Thrall & Robertson, Atlas of Normal Radiographic Anatomy and Anatomic Variants in the Dog and Cat, 2nd ed.';
const TBF=(f,n,src,c)=>fig('_textbook/cavity/'+f+'.jpg','📘 '+(src===BF?'BSAVA Foundation':src===BT?'BSAVA Thoracic Imaging':'Thrall Atlas')+' Fig. '+n+' — '+c);
const film=(id,c)=>{const v=(pub(id)?.images||[]).filter(x=>x.url&&!isKey(x));return v.length?grid(...v.slice(0,2).map((x,i)=>fig(x.url,c+(v.length>1?' ('+'AB'[i]+')':'')))):''};
const TBOX=(...f)=>box('Textbook'+TB,grid(...f),'#fffaf0','#f1d9a8');
const WHERE=['Pleural space — fluid','Pleural space — gas','Mediastinum — mass or widening','Mediastinum — gas','Lymph nodes','Esophagus','Trachea','Diaphragm','Ribs / body wall'];

const LESSONS=[
 {id:'effusion',icon:'💧',title:'Pleural effusion',min:5,
  body:()=>box('Signs'+SL,ul(['<b>Pleural fissure lines</b> — thin may be normal pleura seen edge-on or a little fluid; the thicker they get, the more you worry.','Whole thorax more opaque.','Heart and diaphragm borders <b>effaced</b>.','Lung lobes <b>retracted</b> from the body wall, edges rounded/scalloped.','Mediastinum looks wider on the VD/DV.']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   grid(fig('_guide/L6-p009.jpg','L6 slide 9 — signs of pleural effusion.'))+film('exam4-cav-pe-signs','Pleural effusion (L6 slide 9)')+
   box('It\'s a sign, not a diagnosis'+SL,table(['Group','Causes'],[['Traumatic','Diaphragmatic hernia, chest wall trauma, bleeding'],['Neoplastic','Cranial mediastinal mass, mesothelioma, metastasis, lung lobe torsion'],['Cardiovascular','CHF, vascular or lymphatic obstruction'],['Inflammatory / infectious','Pyothorax, chylothorax, FIP'],['Metabolic','Hypoproteinemia (PLN, PLE, malnutrition)']])+'<p style="margin:6px 0 0">Tap it, analyze the fluid, then <b>re-film</b> — the fluid hides masses and heart size. A horizontal-beam view moves fluid away.</p>')+
   TBOX(TBF('tb-5-82a-effusion-lat','5.82a',BF,'lateral: lung edges lifted off the sternum and scalloped; ventral diaphragm hidden.'),TBF('tb-5-82b-effusion-dv','5.82b',BF,'DV: fissure lines in the 7th intercostal spaces.'),TBF('tb-11-24-unilateral-effusion','11.24',BT,'unilateral left effusion: left lung retracted, mediastinum pushed right.'),TBF('tb-5-83a-cat-before-tap','5.83',BF,'cat before thoracocentesis: rounded, partly collapsed caudal lobes.'),TBF('tb-5-83b-cat-after-tap','5.83b',BF,'same cat after the tap.')),
  check:[q('Which sign is NOT pleural effusion?','Heart lifted off the sternum with gas underneath',['Heart lifted off the sternum with gas underneath','Pleural fissure lines','Effaced heart borders','Retracted, rounded lung edges'],'Slide (L6 9, 21): a heart lifted off the sternum is pneumothorax.'),
   q('A thin pleural fissure line by itself may be…','Normal pleura seen edge-on or a small amount of fluid',['Normal pleura seen edge-on or a small amount of fluid','Always pneumothorax','Always pyothorax','A rib fracture'],'Slide (L6 5–6).'),
   q('What do you do after tapping a big effusion?','Repeat the radiographs',['Repeat the radiographs','Nothing more','Barium study','Echocardiogram only'],'Slide (L6 12–19): re-film to see what the fluid was hiding.'),
   q('Effusion with the mediastinum pushed to the opposite side means…','A large unilateral effusion',['A large unilateral effusion','Lung lobectomy on that side','Normal positioning','Pneumomediastinum'],'Textbook (BSAVA Thoracic Imaging 11.24).'),
   q('Can radiographs tell you the fluid type (chyle vs pus vs blood)?','No — fluid analysis does',['No — fluid analysis does','Yes — chyle is darker','Yes — pus has fissure lines','Yes — blood is always unilateral'],'Slide (L6 11–12): pleural effusion is a clinical sign, not a diagnosis.')]},

 {id:'ptx',icon:'🌬️',title:'Pneumothorax (and its look-alikes)',min:5,
  body:()=>box('Fluid sinks, gas floats'+SL,'<p style="margin:0">Fluid pools <b>ventrally</b> (lateral) and in the dependent side (VD). Gas rises <b>dorsally</b> (lateral) and collects between lung and body wall (VD). Gas is <b>darker</b> than lung.</p>','linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   box('Lateral signs'+SL,ul(['<b>Heart lifted off the sternum</b>, gas between them — most consistent sign.','Retracted lung edges you don\'t normally see.','Lungs more opaque (partly collapsed).','Flattened diaphragm.']))+
   box('VD/DV signs'+SL,ul(['Free gas between lung and the inner body wall.','Lungs more opaque.','<b>No vessel markings</b> in the dark area — look for them.','You don\'t see fissure lines with air.']))+
   film('exam4-cav-ptx-lat','Pneumothorax (L6 slide 21)')+
   box('Look-alikes'+SL,ul(['Heart sitting high: microcardia, over-inflated lungs, deep-chested breeds, pericardial fat, mediastinal shift.','<b>Skin folds</b> — they run past the thorax and cross lines a pneumothorax wouldn\'t.']),'#fff7e0','#f1d9a8')+
   grid(fig('_guide/L6-p021.jpg','L6 slide 21 — lateral signs.'),fig('_guide/L6-p028.jpg','L6 slide 28 — mimics and pitfalls.'))+
   TBOX(TBF('tb-5-85a-ptx-lat','5.85a',BF,'spontaneous pneumothorax: heart lifted off the sternum; gas between lungs and spine.'),TBF('tb-5-85b-ptx-dv','5.85b',BF,'DV: worse on the left.'),TBF('tb-5-84a-bulla-ptx','5.84a',BF,'pneumothorax from a lung bulla (wall above the carina).'),TBF('tb-5-86a-pneumohydrothorax','5.86a',BF,'cat with gas AND fluid (pneumohydrothorax).')),
  check:[q('Most consistent lateral sign of pneumothorax?','Heart lifted off the sternum',['Heart lifted off the sternum','Fissure lines','A globoid heart','Tracheal stripe'],'Slide (L6 21).'),
   q('On the VD, how do you confirm a dark rim is free gas?','No vessel markings in it',['No vessel markings in it','It has fissure lines','It is whiter than lung','It crosses outside the thorax'],'Slide (L6 26–27): look for vessel markings.'),
   q('A line crosses the edge of the thorax and runs onto the body. Most likely?','Skin fold',['Skin fold','Pneumothorax','Pleural effusion','Pneumomediastinum'],'Slide (L6 28).'),
   q('Which can make the heart sit high WITHOUT pneumothorax?','Microcardia or deep-chested breed',['Microcardia or deep-chested breed','Pleural effusion','Megaesophagus','Rib fracture'],'Slide (L6 28).'),
   q('Gas on a lateral goes…','Dorsal',['Dorsal','Ventral','Into the pericardium','Nowhere — it stays mixed'],'Slide (L6 20).')]},

 {id:'mediastinum',icon:'↔️',title:'Mediastinum: shift, widening and masses',min:6,
  body:()=>box('Mediastinal shift'+SL+TB,ul(['The heart moves left or right on the VD/DV.','<b>Volume decrease</b> pulls it toward the problem (collapse, lobectomy).','<b>Volume increase</b> pushes it away (mass, unilateral effusion or tension pneumothorax).','<b>Rotation mimics a shift</b>: if the heart moved the same way as the sternum, it\'s positioning.']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   grid(TBF('tb-10-21a-rotated','10.21a',BT,'rotated VD: heart moved with the sternum — not a true shift.'),TBF('tb-10-21b-straight','10.21b',BT,'same dog straight: heart in the middle.'),TBF('tb-5-87-shift-collapse','5.87',BF,'shift RIGHT from right middle lobe collapse.'))+
   box('Cranial mediastinal widening'+SL,ul(['Dog: cranial mediastinum should be < 2× the width of a vertebra on the VD; cat ≈ 1×.','Fat (brachycephalics!), mass, fluid, esophagus.']))+
   box('Cranial mediastinal mass'+SL,ul(['Lateral: trachea pushed <b>dorsally</b>, opacity in front of the heart, carina and lungs pushed caudally.','VD: midline, wide, convex borders; trachea may move sideways.','Differentials: <b>lymphoma</b> (most common), thymoma, ectopic thyroid carcinoma, chemodectoma, histiocytic sarcoma, granuloma/abscess, cysts.']))+
   grid(fig('_guide/L6-p035.jpg','L6 slide 35 — mass signs.'),fig('_guide/L6-p036.jpg','L6 slide 36 — differentials.'))+
   box('Caudal mediastinum'+SL,ul(['Less common; usually the <b>esophagus</b> (megaesophagus, tumor, FB) or abscess / mediastinitis.','Mimics: fluid trapped in the plica vena cava, diaphragm masses.']))+
   film('exam4-cav-cat-caudal','Caudal mediastinal mass effect, cat (L6)')+
   TBOX(TBF('tb-5-88a-cranial-mass','5.88a',BF,'cranial mediastinal mass lifting the trachea.'),TBF('tb-5-88b-cranial-mass-dv','5.88b',BF,'same: wide cranial mediastinum on the DV.'),TBF('tb-5-89a-caudal-mass','5.89a',BF,'caudal mediastinal (para-esophageal) mass.'),TBF('tb-10-46a-wide-mediastinum','10.46a',BT,'wide cranial mediastinum after trauma, plus pneumothorax.')),
  check:[q('Lung lobe collapse pulls the heart…','Toward the collapsed side',['Toward the collapsed side','Away from it','Dorsally','Nowhere'],'Slide (L6 29–31): volume loss pulls the mediastinum toward it.'),
   q('The heart and the sternum both moved to the left on the VD. Most likely?','Rotation (positioning)',['Rotation (positioning)','A true mediastinal shift','A right lung mass','Pneumothorax'],'Slide (L6 32); textbook 10.21.'),
   q('A cranial mediastinal mass on the lateral pushes the trachea…','Dorsally',['Dorsally','Ventrally','Nowhere','Into the esophagus'],'Slide (L6 35).'),
   q('Most common cranial mediastinal mass?','Lymphoma',['Lymphoma','Thymoma','Chemodectoma','Thymic cyst'],'Slide (L6 36): lymphosarcoma most common.'),
   q('A caudal mediastinal mass is most often from the…','Esophagus',['Esophagus','Thymus','Heart base','Sternal lymph nodes'],'Slide (L6 37).')]},

 {id:'nodes',icon:'🔵',title:'Lymph nodes and pneumomediastinum',min:5,
  body:()=>box('Where the nodes are'+SL,table(['Node','Where','See it best'],[['<b>Sternal</b>','Just dorsal to sternebrae 1–3 (cranioventral)','Lateral only (unless huge); drain the cranial abdomen, mammary glands, diaphragm, ribs'],['<b>Cranial mediastinal</b>','In front of the heart, ventral to the trachea','Lateral'],['<b>Tracheobronchial (hilar)</b>','Around the carina','VD: mainstem bronchi bowed apart; lateral: carina pushed ventrally']]),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   grid(fig('_guide/L6-p062.jpg','L6 slide 62 — sternal node.'),fig('_guide/L6-p065.jpg','L6 slide 65 — tracheobronchial nodes.'))+
   box('Hilar node or big left atrium?'+SL,'<p style="margin:0">Both sit there. An enlarged middle node can look like LA enlargement on the VD — but the LA pushes the carina <b>up</b>, while nodes push it <b>down</b> (ventrally). Differentials: lymphoma, histiocytic sarcoma, fungal/granulomatous disease.</p>','#fff7e0','#f1d9a8')+
   film('exam4-cav-sternal-ln','Sternal lymphadenopathy (L6 slide 62)')+
   box('Pneumomediastinum'+SL,ul(['Gas outlines things you normally can\'t see: trachea walls, esophagus, great vessels, longus colli.','Heart position and lung expansion <b>normal</b>.','Can lead to pneumothorax — <b>not</b> the other way around.','Causes: tracheal tear (trauma, over-inflated ET cuff; cats days after anesthesia), esophageal perforation, gas tracking from the neck or retroperitoneum, alveolar rupture.']))+
   film('exam4-cav-pneumomed','Pneumomediastinum (L6 slide 43)')+
   TBOX(TBF('tb-5-90a-tb-nodes','5.90a',BF,'marked tracheobronchial lymphadenopathy (M = middle node).'),TBF('tb-5-90b-tb-nodes-dv','5.90b',BF,'DV: bronchi pushed apart.'),TBF('tb-5-91-pneumomediastinum','5.91',BF,'cat: gas outlines the longus colli, tracheal wall, brachiocephalic trunk (B), cranial vena cava and azygos.'),TBF('tb-5-92a-sq-emphysema','5.92a',BF,'cat with subcutaneous emphysema, pneumomediastinum and pneumoretroperitoneum.')),
  check:[q('Which node do you usually see only on the lateral?','Sternal',['Sternal','Tracheobronchial','Mandibular','Mesenteric'],'Slide (L6 62).'),
   q('Hilar lymph nodes push the carina…','Ventrally',['Ventrally','Dorsally','Cranially','Nowhere'],'Slide (L6 65–66, 70).'),
   q('Gas outlines the tracheal walls and great vessels; heart and lungs normal. Diagnosis?','Pneumomediastinum',['Pneumomediastinum','Pneumothorax','Megaesophagus','Pleural effusion'],'Slide (L6 42).'),
   q('Which is true?','Pneumomediastinum can cause pneumothorax, not vice versa',['Pneumomediastinum can cause pneumothorax, not vice versa','Pneumothorax always causes pneumomediastinum','They never occur together','Both are always iatrogenic'],'Slide (L6 42).'),
   q('Most common cause of pneumomediastinum?','Tracheal tear',['Tracheal tear','Gas-producing bacteria','Alveolar rupture','Pleural effusion'],'Slide (L6 45).')]},

 {id:'esophagus',icon:'🍽️',title:'Esophagus',min:5,
  body:()=>box('Megaesophagus signs'+SL+PROF,ul(['<b>Tracheal stripe</b> — the shared wall of trachea and gas-filled esophagus.','Trachea pushed <b>ventrally</b>.','<b>Longus colli</b> muscle becomes visible.','Don\'t confuse with pneumomediastinum.','Often clearer on the <b>left</b> lateral; check for aspiration pneumonia.']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   film('exam4-cav-stbernard','Megaesophagus, 5-month St. Bernard (L7 slides 6–7)')+
   box('Causes'+SL,table(['Type','Examples'],[['Transient','Aerophagia with dyspnea, normal swallowing, sedation/anesthesia'],['Focal / segmental','<b>Vascular ring (PRAA)</b>, compressive mass, next to a foreign body'],['Generalized','Congenital, idiopathic acquired, myasthenia gravis, metabolic/toxic, dysautonomia, caudal obstruction (hiatal hernia, GDV)'],['Variants','Redundant esophagus (brachycephalics), diverticulum']]))+
   box('PRAA'+SL,ul(['Most common vascular ring; esophagus trapped at the heart base.','Young dog, regurgitation <b>after weaning</b>.','Focal dilation <b>in front of the heart</b>; trachea deviated <b>left</b> (right-sided aorta) — "pathognomonic".']))+
   box('Esophageal foreign body'+SL,ul(['Hypersalivation, regurgitation.','Lodge at the <b>thoracic inlet, heart base, or just cranial to the diaphragm</b>.','<b>No barium</b> if perforation is suspected (pneumomediastinum, pleural fluid, pneumothorax).']))+
   film('exam4-cav-esoph-fb','Esophageal foreign body (L7 slide 10)')+
   TBOX(TBF('tb-5-98a-megaesoph-lat','5.98a',BF,'generalized megaesophagus: walls tapering to the diaphragm, tracheal stripe.'),TBF('tb-10-54-megaesoph-pup','10.54',BT,'2-month Husky: congenital megaesophagus + aspiration.'),TBF('tb-10-55-megaesoph-vd','10.55',BT,'VD of acquired megaesophagus (myasthenia gravis).'),TBF('tb-6-47-normal-esoph-gas','6-47',AT,'a SMALL gas pocket in front of the carina is normal — don\'t overcall it.')),
  check:[q('Which is a sign of megaesophagus?','Tracheal stripe',['Tracheal stripe','Heart lifted off the sternum','Fissure lines','Split mainstem bronchi'],'Slide (L7 7).'),
   q('A 10-week-old puppy regurgitates since weaning; focal dilation cranial to the heart; trachea to the left. Diagnosis?','Persistent right aortic arch',['Persistent right aortic arch','Myasthenia gravis','Esophageal FB','Hiatal hernia'],'Slide (L7 8).'),
   q('Where do esophageal foreign bodies lodge?','Thoracic inlet, heart base, just cranial to the diaphragm',['Thoracic inlet, heart base, just cranial to the diaphragm','Only in the neck','Only at the stomach','Anywhere equally'],'Slide (L7 9).'),
   q('When should you NOT give barium?','Suspected esophageal perforation',['Suspected esophageal perforation','Every megaesophagus','Every foreign body','Cats'],'Slide (L7 9).'),
   q('A small gas pocket in the esophagus cranial to the carina on a sedated dog is…','Often normal',['Often normal','Always megaesophagus','Always a perforation','Pneumothorax'],'Textbook (Thrall Atlas 6-47).')]},

 {id:'trachea',icon:'🫗',title:'Trachea',min:5,
  body:()=>box('Size: trachea ÷ thoracic inlet'+SL,table(['Dog','Normal ratio'],[['Non-brachycephalic','≈ 0.20'],['Brachycephalic (Pug, Boston)','≈ 0.16'],['English/French Bulldog','≈ 0.13']])+'<p style="margin:6px 0 0">Below these = <b>hypoplasia</b>. Changing diameter between films = <b>collapse</b>.</p>','linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   grid(fig('_guide/L7-p012.jpg','L7 slide 12 — how to measure.'),TBF('tb-10-73-ti-ratio','10.73',BT,'measuring the ratio in a normal Dachshund (0.2).'))+
   box('Tracheal collapse'+SL,ul(['Chondromalacia — <b>small/toy breeds</b>, "honking" cough elicited on palpation.','<b>Inspiration → cervical</b> trachea collapses; <b>expiration → intrathoracic</b> trachea and mainstem bronchi collapse.','Static films can miss it — <b>fluoroscopy</b> is the gold standard.']))+
   grid(TBF('tb-10-80-collapse-mechanism','10.80',BT,'why the cervical part collapses on inspiration and the thoracic part on expiration.'),TBF('tb-10-81a-cervical-collapse','10.81a',BT,'Poodle, inspiration: cervical trachea collapsed.'),TBF('tb-10-81b-thoracic-collapse','10.81b',BT,'same dog, expiration: intrathoracic trachea collapsed.'))+
   film('exam4-cav-mainstem','Intrathoracic + mainstem collapse (L7 slide 14)')+
   box('Don\'t overcall'+TB,'<p style="margin:0">The redundant <b>dorsal tracheal membrane</b> can sag into the lumen, and a big esophagus can overlap — "pseudocollapse".</p>'+grid(TBF('tb-6-46-tracheal-membrane','6-46',AT,'redundant dorsal membrane (hollow arrows) — not collapse.'),TBF('tb-10-74-pseudocollapse','10.74',BT,'pseudocollapse in a healthy Labrador.')),'#fff7e0','#f1d9a8'),
  check:[q('Normal trachea : thoracic inlet ratio in a non-brachycephalic dog?','About 0.20',['About 0.20','About 0.13','About 0.50','About 0.05'],'Slide (L7 12).'),
   q('Expiration collapses which part of the trachea?','Intrathoracic trachea (and mainstem bronchi)',['Intrathoracic trachea (and mainstem bronchi)','Cervical trachea','Neither','Only the larynx'],'Slide (L7 16); textbook 10.80.'),
   q('Gold standard for dynamic tracheal collapse?','Fluoroscopy',['Fluoroscopy','A single lateral','CT only','Barium swallow'],'Slide (L7 16).'),
   q('An English Bulldog with a ratio of 0.09. Diagnosis?','Tracheal hypoplasia',['Tracheal hypoplasia','Tracheal collapse','Normal','Megaesophagus'],'Slide (L7 12–13): bulldogs ≈ 0.13; below = hypoplasia.'),
   q('Which mimics tracheal collapse?','Redundant dorsal tracheal membrane',['Redundant dorsal tracheal membrane','Pleural fissure line','Pneumothorax','Sternal lymph node'],'Textbook (Thrall Atlas 6-46; BSAVA 10.74).')]},

 {id:'diaphragm',icon:'🧱',title:'Diaphragm, ribs and body wall',min:6,
  body:()=>box('Traumatic diaphragmatic hernia'+SL,ul(['Diaphragm line <b>missing or abnormal</b>.','Abdominal organs in the thorax — and <b>missing from the abdomen</b>.','Heart and trachea pushed <b>away</b> from the hernia.','<b>Pleural effusion is common.</b>']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   film('exam4-cav-dh','Traumatic DH, Lab mix (L7 slides 36–38)')+
   box('Congenital hernias'+SL,table(['Hernia','Look for'],[['<b>PPDH</b> (most common congenital)','Huge "heart" with mixed fat/gas opacity; heart and diaphragm borders merge; ventral midline; sternal defects'],['<b>Hiatal</b>','Stomach through the esophageal hiatus — caudodorsal opacity'],['Paraesophageal','Fundus next to the hiatus (rare)'],['<b>Gastroesophageal intussusception</b>','Stomach into the esophagus — usually with megaesophagus; GSDs; <b>surgical emergency</b>']]))+
   grid(fig('_guide/L7-p040.jpg','L7 slide 40 — PPDH features.'),TBF('tb-5-97a-ppdh-lat','5.97a',BF,'PPDH: stomach (S) inside the "heart".'),TBF('tb-5-97b-ppdh-dv','5.97b',BF,'PPDH DV: huge silhouette with gas loops and fat.'))+
   box('Ribs'+SL,table(['','Rib tumor','Healed fracture'],[['Number','Usually <b>one</b>','Often <b>several in a row</b>, same level'],['Look','Expansile, lytic and/or productive; costochondral; adjacent ribs displaced','Callus can look expanded; ribs malaligned'],['Pleura','Aggressive ones invade → pleural fluid','—']]))+
   box('Extrapleural vs pulmonary mass'+SL,'<p style="margin:0"><b>Extrapleural</b> (rib/body wall): broad base, <b>obtuse</b> angle with the lung. <b>Pulmonary</b>: sharp, <b>acute</b> angle.</p>')+
   grid(fig('_guide/L7-p063.jpg','L7 slide 63 — extrapleural vs pulmonary.'),fig('_guide/L7-p065.jpg','L7 slide 65 — tumor or healed fracture?'))+
   TBOX(TBF('tb-5-96a-cat-dh-lat','5.96a',BF,'cat diaphragmatic rupture: stomach displaced cranially, liver/spleen in the thorax.'),TBF('tb-5-96b-cat-dh-dv','5.96b',BF,'DV: spleen on the left, liver on the right of the heart (H).'),TBF('tb-5-94a-rib-tumor-lat','5.94a',BF,'rib tumor: large mass on the lateral.'),TBF('tb-5-94b-rib-tumor-dv','5.94b',BF,'DV localizes it — extrapleural sign, rib destruction.'),TBF('tb-5-93b-rib-fx-dv','5.93b',BF,'fractures of ribs 6 and 7 with pneumothorax — easier on the DV.')),
  check:[q('Which set fits a traumatic diaphragmatic hernia?','Missing diaphragm line, organs in the thorax, pleural fluid',['Missing diaphragm line, organs in the thorax, pleural fluid','Globoid heart with sharp edges','Tracheal stripe','Split bronchi'],'Slide (L7 35, 38).'),
   q('A huge "heart" with gas and fat inside, merging with the diaphragm, in a young dog. Diagnosis?','PPDH',['PPDH','Pericardial effusion','DCM','Hiatal hernia'],'Slide (L7 39–40).'),
   q('GSD with megaesophagus now vomiting blood; soft tissue in the caudal esophagus. Think…','Gastroesophageal intussusception — emergency',['Gastroesophageal intussusception — emergency','Hiatal hernia — monitor','Esophageal FB — barium','Normal'],'Slide (L7 43–44).'),
   q('Several adjacent ribs with callus at the same level — most likely?','Healed fractures',['Healed fractures','Rib tumor','Metastasis','Normal'],'Slide (L7 65–66).'),
   q('A mass with a broad base and obtuse angle against the lung is…','Extrapleural (rib/body wall)',['Extrapleural (rib/body wall)','Pulmonary','Mediastinal','Pericardial'],'Slide (L7 63).')]}
];

/* ------------------------------------------------------------------ skill banks */
const T=(img,ans,ex,key,src,more)=>Object.assign({img:[].concat(img),a:ans,ex,key,src},more||{});
const C1=id=>{const c=pub(id);return (c?.images||[]).filter(v=>v.url&&!isKey(v)).map(v=>v.url)};
const K1=id=>{const c=pub(id);return (c?.images||[]).filter(v=>v.url&&isKey(v)).map(v=>v.url)[0]};
const DX=['Pleural effusion','Pneumothorax','Mediastinal shift','Cranial mediastinal mass','Caudal mediastinal mass','Lymphadenopathy','Pneumomediastinum','Megaesophagus','PRAA','Esophageal foreign body','Tracheal collapse','Tracheal hypoplasia','Diaphragmatic hernia','PPDH','Hiatal hernia','Gastroesophageal intussusception','Rib fractures','Rib tumor'];
const FILM=(id,a,o,q,ex)=>{const c=pub(id);return T(C1(id),a,ex||((c?.findings||'')+' '+(c?.interpretation||'')).trim(),K1(id),c?.title,{q,o,id:q.slice(0,5)+':'+id})};
const TBQ=(f,a,o,q,ex,src)=>T('_textbook/cavity/'+f+'.jpg',a,ex,'',src,{q,o,id:'tb'+q.slice(0,3)+':'+f});
function skills(){
 const WQ='Where is the problem?',DQ='Diagnosis?';
 const filmsW=[['exam4-cav-pe-signs',0],['exam4-cav-pe-volume',0],['exam4-cav-fissure-thick',0],['exam4-cav-ptx-lat',1],['exam4-cav-ptx-vd',1],['exam4-cav-shift-mass',2],['exam4-cav-cat-caudal',2],['exam4-cav-pneumomed',3],['exam4-cav-sternal-ln',4],['exam4-cav-beagle',4],['exam4-cav-stbernard',5],['exam4-cav-praa',5],['exam4-cav-esoph-fb',5],['exam4-cav-mainstem',6],['exam4-cav-hypoplasia',6],['exam4-cav-dh',7],['exam4-cav-hiatal',7],['exam4-cav-rib-fx',8],['exam4-cav-rib-tumor',8],['exam4-cav-healed-rib',8]].map(([id,i])=>FILM(id,WHERE[i],WHERE,WQ));
 const tbW=[['tb-5-82a-effusion-lat',0,'5.82a: lung edges lifted and scalloped, ventral diaphragm hidden — pleural fluid.',BF],['tb-5-85a-ptx-lat',1,'5.85a: heart lifted off the sternum by gas — pneumothorax.',BF],['tb-5-88a-cranial-mass',2,'5.88a: cranioventral mass lifting the trachea — cranial mediastinal mass.',BF],['tb-5-91-pneumomediastinum',3,'5.91: gas outlining the tracheal wall and great vessels — pneumomediastinum.',BF],['tb-5-90a-tb-nodes',4,'5.90a: big middle tracheobronchial node.',BF],['tb-5-98a-megaesoph-lat',5,'5.98a: generalized megaesophagus.',BF],['tb-10-82-chihuahua-collapse',6,'10.82: cervical and thoracic tracheal collapse in a Chihuahua.',BT],['tb-5-96a-cat-dh-lat',7,'5.96a: stomach and liver in the thorax — diaphragmatic rupture.',BF],['tb-5-94a-rib-tumor-lat',8,'5.94a: rib tumor (extrapleural mass).',BF]].map(([f,i,ex,src])=>TBQ(f,WHERE[i],WHERE,WQ,'Textbook ('+(src===BF?'BSAVA Foundation':'BSAVA Thoracic Imaging')+' '+ex+')',src));
 const dx=[FILM('exam4-cav-zoey','Pleural effusion',DX,DQ),FILM('exam4-cav-ptx-vd','Pneumothorax',DX,DQ),FILM('exam4-cav-shift-lobectomy','Mediastinal shift',DX,DQ),FILM('exam4-case4-blue','Cranial mediastinal mass',DX,DQ),FILM('exam4-cav-cat-caudal','Caudal mediastinal mass',DX,DQ),FILM('exam4-cav-beagle','Lymphadenopathy',DX,DQ),FILM('exam4-cav-pneumomed','Pneumomediastinum',DX,DQ),FILM('exam4-cav-stbernard','Megaesophagus',DX,DQ),FILM('exam4-cav-praa','PRAA',DX,DQ),FILM('exam4-cav-esoph-fb','Esophageal foreign body',DX,DQ),FILM('exam4-cav-chihuahua','Tracheal collapse',DX,DQ),FILM('exam4-cav-hypoplasia','Tracheal hypoplasia',DX,DQ),FILM('exam4-cav-dh','Diaphragmatic hernia',DX,DQ),FILM('exam4-cav-hiatal','Hiatal hernia',DX,DQ),FILM('exam4-cav-gsd-ge','Gastroesophageal intussusception',DX,DQ),FILM('exam4-cav-rib-fx','Rib fractures',DX,DQ),FILM('exam4-cav-rib-tumor','Rib tumor',DX,DQ),
  TBQ('tb-5-97a-ppdh-lat','PPDH',DX,'A young dog with a huge "heart". '+DQ,'Textbook (BSAVA Foundation 5.97): stomach (S) and fat inside the pericardium — PPDH.',BF),
  TBQ('tb-5-86a-pneumohydrothorax','Pleural effusion',DX,'A cat: generalized opacity, but also bubbles of gas. Main finding besides the gas?','Textbook (BSAVA Foundation 5.86): pneumohydrothorax — fluid plus free gas.',BF),
  TBQ('tb-5-87-shift-collapse','Mediastinal shift',DX,DQ,'Textbook (BSAVA Foundation 5.87): heart shifted right from right middle lobe collapse.',BF),
  TBQ('tb-10-54-megaesoph-pup','Megaesophagus',DX,'2-month-old Husky regurgitating. '+DQ,'Textbook (BSAVA Thoracic Imaging 10.54): congenital megaesophagus with aspiration.',BT)].filter(x=>x.img.length);
 const where=[['10-week puppy regurgitating since weaning; focal dilation in front of the heart.','PRAA'],['Toy breed with a honking cough on tracheal palpation.','Tracheal collapse'],['Hit by a car last month; now dyspneic; diaphragm line missing on one side, pleural fluid.','Diaphragmatic hernia'],['GSD with known megaesophagus, now hematemesis.','Gastroesophageal intussusception'],['Dog chewed a bone; drooling and regurgitating; angular opacity at the heart base.','Esophageal foreign body'],['Cat a few days after intubation; gas outlining the trachea and great vessels.','Pneumomediastinum'],['Lymphoma dog; carina pushed ventrally; bronchi bowed apart.','Lymphadenopathy'],['English Bulldog puppy; trachea narrow on every film.','Tracheal hypoplasia'],['Single expansile lytic rib lesion with a broad-based mass.','Rib tumor'],['Heart lifted off the sternum after a fall.','Pneumothorax']]
  .map(([s,a],i)=>T([],a,'Slide (L6–L7).','','L6–L7',{q:s+' Most likely?',o:DX,id:'where:'+i}));
 return {where:{title:'Where is the problem?',icon:'📍',items:filmsW.concat(tbW).filter(x=>x.img.length)},dx:{title:'Name it',icon:'🩻',items:dx},story:{title:'Signalment → diagnosis',icon:'📋',items:where}};
}

/* ------------------------------------------------------------------ step-by-step class cases */
const S=(q,a,o,ex)=>({q,a,o:o||[],ex});
const CASES=[
 {g:'L6–L7 class cases',id:'exam4-cav-zoey',steps:[S('Main finding?','Pleural effusion',['Pleural effusion','Pneumothorax','Megaesophagus','Normal'],'Slide: pleural effusion in a lymphoma patient.'),S('Why tap and re-film?','The fluid hides masses and the heart',['The fluid hides masses and the heart','To measure VHS only','It\'s not needed','To give barium'],'Slide: re-film after thoracocentesis; horizontal beam moves fluid away.'),S('Can the films tell you the fluid type?','No — fluid analysis does',['No — fluid analysis does','Yes — it\'s chyle','Yes — it\'s blood','Yes — it\'s pus'],'Slide (L6 11): a clinical sign, not a diagnosis.')]},
 {g:'L6–L7 class cases',id:'exam4-cav-beagle',steps:[S('Where is the opacity?','Around the carina (hilus)',['Around the carina (hilus)','Sternal','Pleural space','Caudal mediastinum'],'Slide: hilar widening on the VD; carina deviated ventrally on the lateral.'),S('Diagnosis?','Tracheobronchial lymphadenopathy',['Tracheobronchial lymphadenopathy','Left atrial enlargement','Pulmonary hypertension','Megaesophagus'],'Slide.'),S('How is it different from LA enlargement?','Nodes push the carina down; the LA pushes it up',['Nodes push the carina down; the LA pushes it up','They look the same in every way','LA makes fissure lines','Nodes cause a tracheal stripe'],'Slide (L6 66, 70).'),S('Top differential with big peripheral nodes?','Lymphoma',['Lymphoma','Heartworm','Pneumonia','Chylothorax'],'Slide: lymphoid neoplasia, histiocytic sarcoma, granulomatous disease.')]},
 {g:'L6–L7 class cases',id:'exam4-cav-stbernard',steps:[S('What is the big tube dorsal to the trachea?','A dilated esophagus',['A dilated esophagus','The trachea','The caudal vena cava','Pneumomediastinum'],'Professor: dilated with fluid; tracheal stripe.'),S('Which sign is present?','Tracheal stripe with ventral tracheal displacement',['Tracheal stripe with ventral tracheal displacement','Heart lifted off the sternum','Fissure lines','Split bronchi'],'Slide (L7 7).'),S('Diagnosis?','Generalized megaesophagus',['Generalized megaesophagus','PRAA','Esophageal FB','Hiatal hernia'],'Slide.'),S('What should you check the lungs for?','Aspiration pneumonia',['Aspiration pneumonia','Metastases','Bullae','Nothing'],'Study aid; textbook 10.54.')]},
 {g:'L6–L7 class cases',id:'exam4-cav-dh',steps:[S('What is missing?','Part of the diaphragm line',['Part of the diaphragm line','The heart','The trachea','The esophagus'],'Slide (L7 35).'),S('What is in the thorax?','Abdominal organs',['Abdominal organs','Air only','A lung mass','Nothing'],'Slide.'),S('What else is common?','Pleural effusion',['Pleural effusion','Megaesophagus','Tracheal collapse','Rib tumor'],'Slide (L7 38).'),S('Diagnosis?','Traumatic diaphragmatic hernia',['Traumatic diaphragmatic hernia','PPDH','Hiatal hernia','Pericardial effusion'],'Slide; HBC 3 months ago.')]},
 {g:'L6–L7 class cases',id:'exam4-case4-blue',steps:[S('Where is the mass?','Cranial thorax / cranial mediastinum',['Cranial thorax / cranial mediastinum','Caudal mediastinum','Pleural space only','Heart base only'],'Case notes.'),S('Trachea?','Deviated dorsally and to the right',['Deviated dorsally and to the right','Normal','Ventrally','Collapsed'],'Case notes.'),S('Anything in the lungs?','Multiple round soft-tissue nodules',['Multiple round soft-tissue nodules','Alveolar pattern','Bronchiectasis','Nothing'],'Case notes.'),S('Conclusion?','Cranial mediastinal mass with pulmonary nodules (thyroid carcinoma, thymic tumor, MH, LSA)',['Cranial mediastinal mass with pulmonary nodules (thyroid carcinoma, thymic tumor, MH, LSA)','Pneumonia','Megaesophagus','Normal'],'Case notes.')]},
 {g:'L6–L7 class cases',id:'exam4-case6-golden',steps:[S('What do you see in the cranial mediastinum?','Gas outlining the structures',['Gas outlining the structures','A mass','Fluid','Nothing'],'Case notes: increased visualization of mediastinal structures.'),S('Gas under the heart, heart a bit lifted — that is…','Mild pneumothorax',['Mild pneumothorax','Normal fat','Pleural effusion','Megaesophagus'],'Case notes.'),S('Gas in the body wall and axilla =','Subcutaneous emphysema',['Subcutaneous emphysema','Rib tumor','Lymphadenopathy','Normal'],'Case notes.'),S('Cause?','Penetrating wound at the thoracic inlet',['Penetrating wound at the thoracic inlet','Heart failure','Lymphoma','Megaesophagus'],'Case notes: SQ emphysema, pneumomediastinum and mild pneumothorax from a penetrating wound.')]}
];

/* ------------------------------------------------------------------ rendering helpers */
function shell(title,html){api.showModal(title,'<div style="font-size:13px;color:#354967;line-height:1.55">'+html+'</div>');try{api.body.scrollTop=0}catch(e){}}
function navBtns(extra){return '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px"><button type="button" data-vpqcu="home">← Chest cavity unit</button>'+(extra||'')+'</div>'}
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
 const lessonRows=LESSONS.map((l,i)=>{const r=L[l.id];return '<button type="button" data-vpqcu="lesson-'+i+'" style="display:flex;gap:10px;align-items:center;text-align:left;width:100%;padding:9px 11px;margin:0 0 6px;background:#fff;border:1px solid '+(r?.score>=4?'#2e9a57':r?'#9fd3b5':'#d8dfea')+';border-radius:12px"><span style="font-size:20px">'+l.icon+'</span><span style="flex:1"><b style="color:#344f78">'+(i+1)+'. '+E(l.title)+'</b><small style="display:block;color:#68788a">about '+l.min+' min · quick check: 5 questions'+(r?' · <b style="color:#1d5e36">best '+r.score+'/5</b>':'')+'</small></span><span style="color:#7d6595;font-weight:800">›</span></button>'}).join('');
 const nxt=LESSONS.findIndex(l=>!(L[l.id]?.score>=4));
 const skillCard=k=>{const s=sk[k],n=s.items.length,done=s.items.filter(it=>items[it.id]).length;
  return '<div style="background:#fff;border:1px solid #d8dfea;border-radius:12px;padding:9px 11px"><b style="color:#344f78">'+s.icon+' '+E(s.title)+'</b><small style="display:block;color:#68788a">'+n+' questions · '+done+' answered correctly</small>'+
  '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">'+[5,10,0].filter(c=>c===0||c<n).map(c=>'<button type="button" data-vpqcu="run-'+k+'-'+c+'" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">'+(c?c+' shuffled':'All '+n)+'</button>').join('')+'</div>'+
  '<details style="margin-top:6px"><summary style="cursor:pointer;font-size:12px;color:#5d6d84;font-weight:700">Pick a film</summary><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">'+s.items.map((it,i)=>'<button type="button" data-vpqcu="pick-'+k+'-'+i+'" style="padding:3px 8px;border-radius:8px;font-size:12px;'+(items[it.id]?'background:#e3f6e8;border:1px solid #2e9a57':'')+'">'+(it.img.length?'Film ':'Q ')+(i+1)+(items[it.id]?' ✓':'')+'</button>').join('')+'</div></details></div>'};
 const groups=[...new Set(CASES.map(c=>c.g))];
 const caseList=groups.map(g=>'<details style="margin:0 0 6px"><summary style="cursor:pointer;font-weight:800;color:#3b4b71">'+E(g)+' <small style="color:#68788a;font-weight:600">('+CASES.filter(c=>c.g===g).length+')</small></summary><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:6px;margin:6px 0">'+CASES.map((c,i)=>[c,i]).filter(([c])=>c.g===g).map(([c,i])=>{const p=pub(c.id);const name=String(p?.title||'').split(' · ').slice(2).join(' · ')||'Case';const r=cs[c.id];return '<button type="button" data-vpqcu="case-'+i+'" style="text-align:left;padding:8px 10px;background:#fff;border:1px solid '+(r?.done?'#2e9a57':'#d8dfea')+';border-radius:10px"><b style="font-size:12.5px;color:#344f78">'+(r?.done?'⭐ ':'')+E(name)+'</b><small style="display:block;color:#68788a">'+E(p?.species||'')+' · '+c.steps.length+' steps'+(r?.done?' · '+r.score+'/'+c.steps.length:'')+'</small></button>'}).join('')+'</div></details>').join('');
 shell('🫀 Exam 4 · Pleura, mediastinum & more',
  '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px"><button type="button" data-vpqcu="back">← '+E(back?.backLabel||'Exam 4')+'</button></div>'+
  box('📖 1 · Start here — learn it','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Suggested order — everything is open. Each lesson ends with a 5-question quick check. 📘 = textbook figure.</p>'+(nxt>=0?'<button type="button" data-vpqcu="lesson-'+nxt+'" style="margin:0 0 8px;background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">▶ '+(nxt===0&&!Object.keys(L).length?'Start':'Continue')+': '+E(LESSONS[nxt].title)+'</button>':'')+lessonRows,'linear-gradient(120deg,#f4eaff,#eaf9f5)','#e0d6ed')+
  box('🎯 2 · Practice by skill','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Pick a skill and how many. Films have no title until you answer.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:8px">'+['where','dx','story'].map(skillCard).join('')+
   '<div style="background:#fff;border:1px solid #d8dfea;border-radius:12px;padding:9px 11px"><b style="color:#344f78">🔀 Mixed practice</b><small style="display:block;color:#68788a">Every skill, shuffled</small><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px"><button type="button" data-vpqcu="run-mixed-10" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">10 shuffled</button><button type="button" data-vpqcu="run-mixed-20" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">20 shuffled</button></div></div></div>','#fff')+
  box('🩺 3 · Class cases, step by step','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Dr. Griffin\'s L6–L7 cases, one step at a time; her answer keys at the end.</p>'+caseList,'#fff')+
  '<p style="font-size:11px;color:#6b7a90">Films and slides: Dr. Lynn Griffin, LMU CVM 743, used with LMU permission for non-commercial study. 📘 Textbook figures: '+E(BF)+'; '+E(BT)+'; '+E(AT)+' — credited by figure number. "Slide"/"Professor" = lecture text and her in-class notes; "study aid" = written for the game from those slides.</p>');
}
let L={i:0,qi:-1,ans:{}};
function lesson(i){
 L={i,qi:-1,ans:{}};const l=LESSONS[i];
 shell(l.icon+' Lesson '+(i+1)+' · '+l.title,navBtns((i>0?'<button type="button" data-vpqcu="lesson-'+(i-1)+'">‹ Lesson '+i+'</button>':'')+(i<LESSONS.length-1?'<button type="button" data-vpqcu="lesson-'+(i+1)+'">Lesson '+(i+2)+' ›</button>':''))+l.body()+
  '<div style="text-align:center;margin:14px 0"><button type="button" data-vpqcu="check" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800;padding:10px 16px">✅ Quick check · 5 questions</button></div>');
}
function check(){
 const l=LESSONS[L.i],k=L.qi,it=l.check[k];
 if(k>=l.check.length){const score=Object.values(L.ans).filter(Boolean).length;save(s=>{s.lessons=s.lessons||{};const old=s.lessons[l.id]?.score||0;s.lessons[l.id]={score:Math.max(old,score)}});
  return shell('✅ Quick check · '+l.title,navBtns()+box('',(score>=4?'<b style="color:#1d5e36;font-size:16px">🎉 '+score+' / 5</b><p>Nice — you\'ve got this lesson.</p>':'<b style="color:#8a4a0c;font-size:16px">'+score+' / 5</b><p>Worth a second look before moving on.</p>')+'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px"><button type="button" data-vpqcu="lesson-'+L.i+'">↺ Review the lesson</button>'+(L.i<LESSONS.length-1?'<button type="button" data-vpqcu="lesson-'+(L.i+1)+'" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">Next: '+E(LESSONS[L.i+1].title)+' ›</button>':'<button type="button" data-vpqcu="run-mixed-10" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">🔀 Try mixed practice</button>')+'</div>','#fff'));
 }
 const o=order(l.id+k,it.o),chosen=L.ans['c'+k];
 shell('✅ Quick check · '+l.title,navBtns('<button type="button" data-vpqcu="lesson-'+L.i+'">↺ Back to the lesson</button>')+'<small style="color:#5d6d84">Question '+(k+1)+' of 5</small>'+
  box('',(it.img?imgsHtml([it.img]):'')+'<b style="font-size:14px">'+E(it.q)+'</b>'+o.map((x,i)=>optBtn(i,x,chosen===undefined?'':x===it.a?'g':i===chosen?'o':'dim','data-vpqcu-qc')).join('')+
  (chosen!==undefined?'<p style="margin:6px 0 0;font-weight:700;color:'+(o[chosen]===it.a?'#1d5e36':'#8a4a0c')+'">'+(o[chosen]===it.a?'✓ Correct.':'Not quite — the answer is in green.')+'</p><p style="margin:4px 0 0;font-size:12.5px">'+E(it.ex)+'</p><div style="text-align:right"><button type="button" data-vpqcu="qnext" style="font-weight:800">'+(k<4?'Next question ›':'See my score ›')+'</button></div>':''),'#f7f1fd','#dacfe8'));
}
let R={list:[],at:0,chosen:{},key:false,title:''};
function run(list,title,at=0){R={list,at,chosen:{},key:false,title};runRender()}
function runRender(){
 const it=R.list[R.at],n=R.list.length,o=opts(it),ch=R.chosen[R.at];
 const nav='<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><button type="button" data-vpqcu="home">← Chest cavity unit</button><button type="button" data-vpqcu="rprev" '+(R.at===0?'disabled':'')+'>‹ Previous</button><button type="button" data-vpqcu="rnext" '+(R.at>=n-1?'disabled':'')+'>Next ›</button><small style="color:#5d6d84;margin-left:auto">'+(it.img.length?'Film':'Question')+' '+(R.at+1)+' of '+n+'</small></div>';
 const done=Object.keys(R.chosen).length===n,score=R.list.filter((x,i)=>R.chosen[i]!==undefined&&opts(x)[R.chosen[i]]===x.a).length;
 shell('🎯 '+R.title,nav+imgsHtml(it.img)+
  box('','<b style="font-size:14px">'+E(it.q)+'</b>'+o.map((x,i)=>optBtn(i,x,ch===undefined?'':x===it.a?'g':i===ch?'o':'dim','data-vpqcu-ans')).join('')+
  (ch!==undefined?'<p style="margin:6px 0 0;font-weight:700;color:'+(o[ch]===it.a?'#1d5e36':'#8a4a0c')+'">'+(o[ch]===it.a?'✓ Correct.':'Not quite — the answer is in green.')+(R.reward?' '+E(R.reward):'')+'</p><p style="margin:4px 0 0;font-size:12.5px">'+E(it.ex)+'</p>'+(it.src?'<p style="margin:4px 0 0;font-size:11px;color:#6b7a90">Source: '+E(String(it.src).replace(/^Exam 4 · /,''))+'</p>':'')+
   (it.key?'<div class="buttonrow" style="margin-top:6px"><button type="button" data-vpqcu="rkey">'+(R.key?'🙈 Hide the marked slide':'👉 Show me where (marked slide)')+'</button></div>'+(R.key?'<a href="'+E(U(it.key))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(it.key))+'" alt="Marked slide" style="display:block;width:100%;border-radius:10px;margin-top:6px"></a>':''):''):''),'#f7f1fd','#dacfe8')+
  (done?box('🏁 Round finished','<b style="font-size:15px;color:'+(score>=n*.8?'#1d5e36':'#8a4a0c')+'">'+score+' / '+n+'</b><div class="buttonrow" style="margin-top:6px"><button type="button" data-vpqcu="home">← Pick another skill</button></div>','#eefaf3','#c7e7d4'):'')+nav);
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
  return '<div style="background:'+(ch===undefined?'#f7f1fd':'#fff')+';border:'+(ch===undefined?'2px solid #3b4b71':'1px solid #dacfe8')+';border-radius:12px;padding:10px 12px;margin:0 0 8px"><b>Step '+(k+1)+' · '+E(s.q)+'</b>'+o.map((x,i)=>optBtn(i,x,ch===undefined?'':x===s.a?'g':i===ch?'o':'dim','data-vpqcu-step')).join('')+
   (ch!==undefined?'<p style="margin:4px 0 0;font-size:12.5px"><b style="color:'+(o[ch]===s.a?'#1d5e36':'#8a4a0c')+'">'+(o[ch]===s.a?'✓ Correct.':'Not quite.')+'</b> '+E(s.ex)+'</p>':'')+'</div>'}).join('');
 const finished=CS.chosen.length===cdef.steps.length&&CS.chosen.every(x=>x!==undefined);
 const score=cdef.steps.filter((s,k)=>CS.chosen[k]!==undefined&&order(cdef.id+k,s.o)[CS.chosen[k]]===s.a).length;
 const pv=CS.i>0,nx=CS.i<CASES.length-1;
 shell('🩺 '+E(cdef.g),'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><button type="button" data-vpqcu="home">← Chest cavity unit</button><button type="button" data-vpqcu="cprev" '+(pv?'':'disabled')+'>‹ Previous case</button><button type="button" data-vpqcu="cnext" '+(nx?'':'disabled')+'>Next case ›</button><small style="color:#5d6d84;margin-left:auto">Case '+(CS.i+1)+' of '+CASES.length+'</small></div>'+
  '<h2 style="font-size:16px;margin:10px 0 2px;color:#3b4b71">'+E(name)+'</h2><p style="margin:0 0 6px;color:#7d6595;font-size:12px">'+E(c.species||'')+' · '+cdef.steps.length+' steps</p>'+
  (c.history?'<div style="border:1px solid #dbe2f0;border-radius:12px;background:#f4f8ff;padding:9px 12px"><b>🏥 History</b><p style="margin:4px 0 0">'+E(c.history)+'</p></div>':'')+imgsHtml(views)+stepHtml+
  (finished?box('🏁 '+score+' / '+cdef.steps.length+' steps correct','<p style="margin:0 0 4px"><b>Findings.</b> '+E(c.findings||'')+'</p><p style="margin:0"><b>Interpretation.</b> '+E(c.interpretation||'')+'</p>'+
   (keys.length?'<div class="buttonrow" style="margin-top:8px"><button type="button" data-vpqcu="ckey">'+(CS.key?'🙈 Hide answer keys':'🖼️ Show answer keys ('+keys.length+')')+'</button></div>'+(CS.key?keys.map(v=>'<figure style="margin:8px 0 0"><a href="'+E(v.url)+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(v.url)+'" alt="" style="width:100%;border-radius:10px;border:1px solid #cfd8e6"></a><figcaption style="font-size:11px;color:#5d6d84">'+E(String(v.view).replace(/^Annotated (teaching key|comparison|textbook view) · /,''))+'</figcaption></figure>').join(''):''):'')+
   '<p style="font-size:11px;color:#6b7a90;margin:8px 0 0">'+E(c.source||'')+'</p>'+(nx?'<div style="text-align:right"><button type="button" data-vpqcu="cnext" style="font-weight:800">Next case ›</button></div>':''),'#f0f9f5','#cce4db'):''));
}

function open(o){back=o||back;return (window.VPQ_IMAGING_PUBLISH?.load?.()||Promise.resolve()).then(home).catch(home)}
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function init(ctx){
 api=ctx;if(api.body.__vpqCuInit)return;api.body.__vpqCuInit=true;
 api.body.addEventListener('click',e=>{
  const qc=e.target.closest('[data-vpqcu-qc]');if(qc){e.preventDefault();const k=L.qi;if(L.ans['c'+k]!==undefined)return;const l=LESSONS[L.i],it=l.check[k],o=order(l.id+k,it.o),i=+qc.dataset.vpqcuQc;L.ans['c'+k]=i;L.ans[k]=o[i]===it.a;award('lesson:'+l.id+':'+k,o[i]===it.a);return check()}
  const an=e.target.closest('[data-vpqcu-ans]');if(an){e.preventDefault();if(R.chosen[R.at]!==undefined)return;const it=R.list[R.at],i=+an.dataset.vpqcuAns,ok=opts(it)[i]===it.a;R.chosen[R.at]=i;R.reward=award(it.id,ok);if(ok)save(s=>{s.items=s.items||{};s.items[it.id]=true});return runRender()}
  const st=e.target.closest('[data-vpqcu-step]');if(st){e.preventDefault();const k=CS.step,cdef=CASES[CS.i];if(CS.chosen[k]!==undefined)return;const s=cdef.steps[k],i=+st.dataset.vpqcuStep,ok=order(cdef.id+k,s.o)[i]===s.a;CS.chosen[k]=i;award('case:'+cdef.id+':'+k,ok);if(k<cdef.steps.length-1)CS.step=k+1;else{const sc=cdef.steps.filter((s2,j)=>order(cdef.id+j,s2.o)[CS.chosen[j]]===s2.a).length;save(s2=>{s2.cases=s2.cases||{};const old=s2.cases[cdef.id]?.score||0;s2.cases[cdef.id]={done:true,score:Math.max(old,sc)}})}return caseRender()}
  const b=e.target.closest('[data-vpqcu]');if(!b||b.disabled)return;e.preventDefault();const k=b.dataset.vpqcu;
  if(k==='back')return back?.onBack?back.onBack():window.VPQ_RADIOLOGY_EXAM4?.open?.();
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
window.VPQ_EXAM4_CAVITY=Object.freeze({init,open,home:open,lessons:LESSONS.length,cases:CASES.length});
})();
