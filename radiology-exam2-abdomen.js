/* Exam 2 · Abdomen, GI & GU unit (same layout as the Exam 4 Lungs/Heart units).
 *  1) 7 short lessons with 5-question quick checks.  2) Practice: name it · which ileus · where is the mass from.
 *  3) Class cases step by step (Abdomen Cases + GI/GU lecture patients).
 * Films and slides: LMU CVM 743 (Dr. Rebekah Gallaher), owner-attested permission for non-commercial study.
 * Textbook figures (owner-approved, 2026-11-28): BSAVA Foundation (Holloway & McConnell 2013), Thrall & Robertson Atlas 2e.
 */
(function(){'use strict';
let api=null,view={page:'home'},back=null;
const NS='exam2-abdomen',STORE='vpq-exam2-abdomen-v1';
const BASE='https://raw.githubusercontent.com/amppet22-prog/Vet-Pharm-Quest-/main/radiology-course-photos/exam2/';
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
const AT='Thrall & Robertson, Atlas of Normal Radiographic Anatomy and Anatomic Variants in the Dog and Cat, 2nd ed.';
const BT='';
const TBF=(f,n,src,c)=>fig('_textbook/'+f+'.jpg','📘 '+(src===BF?'BSAVA Foundation':'Thrall Atlas')+' Fig. '+n+' — '+c);
const film=(id,c)=>{const v=(pub(id)?.images||[]).filter(x=>x.url&&!isKey(x));return v.length?grid(...v.slice(0,2).map((x,i)=>fig(x.url,c+(v.length>1?' ('+'AB'[i]+')':'')))):''};
const TBOX=(...f)=>box('Textbook'+TB,grid(...f),'#fffaf0','#f1d9a8');

const LESSONS=[
 {id:'approach',icon:'🧭',title:'Technique and a systematic read',min:4,
  body:()=>box('Views and technique'+SL,ul(['Standard: <b>left and right lateral + VD</b>. Extras: compression, horizontal beam, perineal view (males), contrast.','Goal = <b>contrast</b>: <b>high mAs, low kVp</b> (less scatter, shorter scale of contrast); grid if the body is > 10 cm thick.']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   box('Read in the same order every time'+SL,ul(['Quality: views, positioning, everything included, technique, marker.','Body condition and age; skeleton and outside the abdomen.','Serosal and retroperitoneal detail.','Organs: liver · spleen · retroperitoneum · kidneys · bladder · reproductive tract · stomach · small intestine · colon.','Normally <b>not visible</b> unless big or abnormal: gallbladder, pancreas, lymph nodes, adrenals (mineralized can be normal in cats), ureters, ovaries/uterus.']))+
   box('Words to use'+SL,table(['Term','Meaning'],[['Roentgen signs','Size, shape, opacity, margination, location, number'],['Opacities','Gas · fat · soft tissue/fluid · mineral · metal'],['Superimposition','Overlap that hides or fakes a lesion'],['Border effacement','Two soft tissues touching — the border between them disappears'],['Summation','Overlap adds up to a whiter (or darker) area that may mimic a lesion']]))+
   TBOX(TBF('tb-7-14-normal-dog-labeled','7-14',AT,'normal dog, labeled (spleen SP, kidneys RK/LK).'),TBF('tb-7-29-normal-cat-labeled','7-29',AT,'normal cat, left lateral labeled.'),TBF('tb-7-29-normal-cat-vd-labeled','7-29',AT,'normal cat VD: left kidney dashed, right kidney solid.'),TBF('tb-7-16-liver-spleen-labeled','7-16',AT,'liver (LI), pylorus (PY) and spleen (SP).')),
  check:[q('Best technique for abdominal films?','High mAs, low kVp',['High mAs, low kVp','Low mAs, high kVp','High kVp, no grid','Any — it doesn\'t matter'],'Slide (Abdomen Principles 5).'),
   q('Standard abdominal series?','Left lateral, right lateral and VD',['Left lateral, right lateral and VD','One lateral only','VD only','DV and VD'],'Slide (Abdomen Principles 4).'),
   q('Which is normally NOT visible on survey films?','Pancreas',['Pancreas','Liver','Kidneys','Urinary bladder'],'Slide (Abdomen Principles 11).'),
   q('Two touching soft-tissue organs lose the border between them. Term?','Border effacement',['Border effacement','Summation','Superimposition','Mass effect'],'Slide (Abdomen Principles 14).'),
   q('Which list is the five radiographic opacities?','Gas, fat, soft tissue/fluid, mineral, metal',['Gas, fat, soft tissue/fluid, mineral, metal','Size, shape, number, location, margin','Air, water, bone, blood, pus','Black, gray, white, very white, clear'],'Slide (Abdomen Principles 12).')]},

 {id:'serosal',icon:'🌫️',title:'Serosal detail, fluid and free gas',min:5,
  body:()=>box('Loss of serosal detail'+SL,table(['Pathologic','Not pathologic'],[['Peritoneal effusion · peritonitis/carcinomatosis · mass or organomegaly · <b>too little or too much fat</b>','<b>Young age</b> · wet fur · full GI tract, colon, bladder or gravid uterus · bad exposure or digital processing']])+'<p style="margin:6px 0 0">Radiographs need about <b>8 ml/kg</b> of fluid to show it (ultrasound ~4 ml/kg). Decide: peritoneal or retroperitoneal? generalized or focal? belly tucked or pendulous?</p>','linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   grid(fig('_guide/ABD-p019.jpg','Abdomen Principles slide 19 — causes.'))+film('exam2-abd-p20','Peritoneal effusion (Abdomen Principles)')+film('exam2-abd-p21','Normal puppy — low serosal detail is expected')+
   box('Free gas'+SL,ul(['<b>Pneumoperitoneum</b>: after surgery; perforated GI tract, uterus or bladder; penetrating wounds; ruptured abscess; migrating FB.','Hard to see with fluid — take a <b>horizontal beam</b> (left lateral or dorsal recumbency, wait 5–10 min).','<b>Pneumoretroperitoneum</b>: extension of pneumomediastinum, punctures, migrating FB, perianal wounds.']))+
   film('exam2-abd-p38','Pneumoperitoneum (Abdomen Principles)')+
   TBOX(TBF('tb-6-100-cat-effusion','6.100',BF,'cat with lots of fluid: pendulous belly, all margins effaced, gas loops float up; kidney still seen (retroperitoneum spared).'),TBF('tb-6-102-peritonitis','6.102',BF,'peritonitis: blurred serosal detail, worst ventrally.'),TBF('tb-6-16-localized-peritonitis','6.16',BF,'pancreatitis: hazy only in the cranial mid-abdomen (localized).'),TBF('tb-6-96-pneumoperitoneum','6.96',BF,'pneumoperitoneum: free gas outlines the diaphragm and liver.')),
  check:[q('A 3-month-old puppy has poor serosal detail. Most likely?','Normal for age',['Normal for age','Peritonitis','Carcinomatosis','Hemoabdomen'],'Slide (Abdomen Principles 19, 21).'),
   q('How much fluid do radiographs need to show an effusion?','About 8 ml/kg',['About 8 ml/kg','About 1 ml/kg','About 50 ml/kg','Any amount'],'Slide (Abdomen Principles 17).'),
   q('Best way to confirm a small amount of free abdominal gas?','Horizontal beam, left lateral or dorsal, wait 5–10 min',['Horizontal beam, left lateral or dorsal, wait 5–10 min','Barium series','Right lateral only','Compression view'],'Slide (Abdomen Principles 41).'),
   q('Free gas 2 weeks after a laparotomy, but the dog is septic. Think…','GI perforation (post-op gas shouldn\'t explain sepsis)',['GI perforation (post-op gas shouldn\'t explain sepsis)','Normal post-op gas','Pneumoretroperitoneum','Wet fur'],'Slide (Abdomen Principles 37): post-op gas is one cause, but perforation is the big one. Study aid: correlate with the clinical signs.'),
   q('An emaciated cat has poor serosal detail. Why?','Too little abdominal fat',['Too little abdominal fat','Peritonitis','Obesity','Gravid uterus'],'Slide (Abdomen Principles 19, 23).')]},

 {id:'organs',icon:'🫃',title:'Masses, liver and spleen',min:6,
  body:()=>box('Where is the mass from?'+SL,table(['Region','Think'],[['Cranial','Liver, gallbladder, stomach, duodenum, pancreas'],['Central','Spleen, intestines, lymph nodes, mesentery'],['Caudal','Bladder, urethra, prostate, uterus, colon'],['Retroperitoneal','Kidneys, adrenals, sublumbar nodes']])+'<p style="margin:6px 0 0">Ask: which region? which organs are pushed, and which way? Causes = <b>CHANG</b>: cyst, hematoma/abscess, neoplasia, granuloma, (inflammation, obstruction/torsion, physiologic).</p>','linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   grid(fig('_guide/ABD-p027.jpg','Abdomen Principles slide 27 — organ of origin by region.'),TBF('tb-6-19a-central-mass','6.19a',BF,'central mass pushing the small intestine to the edges.'),TBF('tb-6-19b-central-mass-vd','6.19b',BF,'VD: on the midline — mesenteric node, intestine, (ovary, retained testis).'))+
   box('Liver'+SL,table(['','Look for','Causes'],[['<b>Big (generalized)</b>','Gastric axis pushed <b>caudal, dorsal and left</b>; duodenum pushed left; rounded margins past the ribs','Fat/glycogen (vacuolar hepatopathy, lipidosis), lymphoma/MCT/HCC, metastasis, <b>congestion (right heart failure)</b>, hepatitis, biliary obstruction, regeneration'],['<b>Big (focal)</b>','Displacement depends on the lobe','HCC, metastasis, nodular hyperplasia, cyst, abscess, lobe torsion'],['<b>Small</b>','Gastric axis upright/cranial','Normal in deep-chested dogs; <b>portosystemic shunt</b>; cirrhosis/fibrosis']]))+
   film('exam2-abd-p45','Generalized hepatomegaly')+
   box('Spleen'+SL,ul(['Generalized: sedation/drugs, lymphoma, MCT, HSA, congestion, <b>torsion</b>, GDV, right heart failure, hemolysis, EMH, infection.','Focal: tumor (HSA), hematoma, abscess, nodular hyperplasia.']))+
   film('exam2-abd-p29','Splenic mass')+
   TBOX(TBF('tb-6-42-microhepatia','6.42',BF,'microhepatia: narrow liver band, gastric axis rotated cranially.'),TBF('tb-6-43-choleliths','6.43',BF,'cat with jaundice: choleliths in the gallbladder and bile duct.'),TBF('tb-6-15-lipoma','6.15',BF,'a big FAT-opacity mass (lipoma): organs pushed, but serosal margins still visible.')),
  check:[q('Generalized hepatomegaly pushes the gastric axis…','Caudally, dorsally and to the left',['Caudally, dorsally and to the left','Cranially','To the right','Nowhere'],'Slide (Abdomen Principles 44).'),
   q('A young dog with a small liver. Top differential?','Portosystemic shunt',['Portosystemic shunt','Lipidosis','Right heart failure','Lymphoma'],'Slide (Abdomen Principles 52).'),
   q('A central mid-abdominal mass most likely comes from…','Spleen, intestine, mesenteric lymph nodes',['Spleen, intestine, mesenteric lymph nodes','Kidney','Prostate','Liver'],'Slide (Abdomen Principles 27).'),
   q('Which causes hepatomegaly?','Right-sided heart failure (congestion)',['Right-sided heart failure (congestion)','Portosystemic shunt','Cirrhosis','Deep-chested conformation'],'Slide (Abdomen Principles 47).'),
   q('Can radiographs tell you a mass\'s organ of origin for sure?','Not always — ultrasound often needed',['Not always — ultrasound often needed','Yes, always','Only on the VD','Only with barium'],'Professor (Abdomen Case 2): ultrasound is needed to know where the mass comes from.')]},

 {id:'stomach',icon:'🎈',title:'Stomach and GDV',min:4,
  body:()=>box('Why is the stomach big?'+SL,ul(['After a meal; food or foreign material.','<b>GDV</b>.','Pyloric outflow / proximal duodenal obstruction.','Functional (pancreatitis, sepsis, drugs); aerophagia if gas.','A big stomach pushes the spleen, colon and small intestine caudally.']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   box('GDV'+SL,ul(['Take a <b>right lateral</b>.','Big gas-filled stomach with <b>compartmentalization</b> (a soft-tissue band dividing it — "Popeye arm").','<b>Pylorus dorsal and to the left</b>.','Splenomegaly, megaesophagus, functional ileus, thin caudal vena cava, free gas or fluid, gastric pneumatosis.']))+
   grid(fig('_guide/GI-p010.jpg','GI Principles slide 10 — GDV signs.'),fig('_guide/GI-p011.jpg','GI Principles slide 11 — associated findings.'))+film('exam2-gi-gdv','GDV (GI Principles)')+
   TBOX(TBF('tb-6-27-gdv','6.27',BF,'right lateral GDV: dilated pylorus rotated dorsally (white arrowheads); fundus ventral; soft-tissue fold dividing them (*).')),
  check:[q('Which view for suspected GDV?','Right lateral',['Right lateral','Left lateral','VD only','DV only'],'Slide (GI Principles 10).'),
   q('Where is the pylorus in GDV?','Dorsal and to the left',['Dorsal and to the left','Ventral and to the right','Normal position','In the thorax'],'Slide (GI Principles 10–11).'),
   q('The band of soft tissue across the dilated stomach is called…','Compartmentalization',['Compartmentalization','Plication','Summation','Sentinel loop'],'Slide (GI Principles 11).'),
   q('Which is a GDV-associated finding?','Thin caudal vena cava',['Thin caudal vena cava','Microhepatia','Renomegaly','Prostatomegaly'],'Slide (GI Principles 11).'),
   q('Which is NOT a cause of gastric distension?','Portosystemic shunt',['Portosystemic shunt','Recent meal','Pyloric obstruction','Pancreatitis (functional)'],'Slide (GI Principles 4).')]},

 {id:'ileus',icon:'🌭',title:'Small intestine: mechanical vs functional ileus',min:6,
  body:()=>box('How big is too big?'+SL,table(['','Normal small intestine'],[['Dog','< 1.6 × the height of L5 (narrowest point); < 2 × a rib width'],['Cat','< 12 mm; < 2 × the height of L2']]),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   box('Mechanical vs functional'+SL+PROF,table(['','Mechanical (obstruction)','Functional (paralytic)'],[['Diameter','<b>≥ 2.4 × L5</b>; <b>two populations</b> (dilated + normal)','Mild, <b>uniform</b>, generalized'],['Other signs','Stacking, sentinel loop, colon empty after 24 h, ± FB, ± fluid','—'],['Causes','Intraluminal (FB, parasites), mural (tumor, granuloma), extramural (adhesion, hernia, tumor)','Enteritis (parvo), peritonitis, anesthesia/drugs, ischemia, dysautonomia, toxins, chronic obstruction'],['Plan','Usually surgery','Usually medical']]))+
   grid(fig('_guide/GI-p016.jpg','GI Principles slide 16 — mechanical ileus.'),fig('_guide/GI-p014.jpg','GI Principles slide 14 — functional ileus.'))+
   film('exam2-gi-lab-mechanical','Mechanical ileus, 2 yr Labrador')+film('exam2-gi-gsd-functional','Functional ileus, 4 mo GSD (parvo)')+
   box('Linear foreign body'+PROF,'<p style="margin:0">Small, irregular, <b>crescent/comma-shaped</b> gas bubbles in bunched-up (plicated) intestine. Anchored at the <b>tongue in cats</b> and usually the <b>pylorus in dogs</b>.</p>','#fff7e0','#f1d9a8')+
   TBOX(TBF('tb-6-29a-functional-ileus-dog','6.29a',BF,'functional ileus, dog: gas-filled loops throughout, similar size.'),TBF('tb-6-31a-corncob','6.31a',BF,'corn cob obstruction: rectangular FB with rows of gas bubbles.'),TBF('tb-6-32a-linear-fb','6.32a',BF,'linear FB: bunched intestine with crescent gas.'),TBF('tb-6-33a-intussusception','6.33a',BF,'ileocolic intussusception (I) outlined by gas.')),
  check:[q('Dog small intestine is too big when it is more than…','1.6 × the height of L5',['1.6 × the height of L5','5 × a rib','3 × L2','The width of the colon'],'Slide (GI Principles 12).'),
   q('Two populations of loops, some ≥ 2.4 × L5. Ileus type?','Mechanical',['Mechanical','Functional','Normal','Physiologic'],'Slide (GI Principles 16).'),
   q('Mildly, uniformly dilated loops in a parvo puppy. Ileus type?','Functional',['Functional','Mechanical','Linear FB','Intussusception'],'Slide (GI Principles 14) and professor (GSD case).'),
   q('Crescent/comma gas bubbles in bunched intestine →','Linear foreign body',['Linear foreign body','Parvo','Intussusception','Normal'],'Professor (Min Pin case).'),
   q('In cats a linear FB is usually anchored at the…','Tongue',['Tongue','Pylorus','Colon','Bladder'],'Professor (Min Pin case).')]},

 {id:'urinary',icon:'💧',title:'Kidneys, retroperitoneum and bladder',min:6,
  body:()=>box('Retroperitoneal masses'+SL,table(['From','Pushes'],[['Adrenal','Small intestine ventrally; kidney caudolaterally; (right) duodenum to the left'],['Kidney','Small intestine ventrally and caudally; (right) duodenum ventral and left; (left) intestine to the right']])+'<p style="margin:6px 0 0"><b>Loss of retroperitoneal detail</b> (kidneys hard to see, colon pushed down): hemorrhage, urine, tumor, abscess, FB granuloma.</p>','linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   film('exam2-gu-scottie-renal','Renal mass, Scottish Terrier')+
   box('Uroliths'+SL,table(['Radiopaque','Radiolucent','Variable'],[['Struvite, calcium oxalate, calcium carbonate, silica','<b>Urate</b>, xanthine','Cystine']])+'<p style="margin:6px 0 0">Fast and enema first. Bladder stones sit in the <b>center</b>. In male dogs add a view with the <b>legs pulled forward</b> so stones at the os penis aren\'t missed.</p>')+
   grid(fig('_guide/GU-p019.jpg','GU slide 19 — urolith opacity.'),TBF('tb-7-37-urethra-view','7-37',AT,'legs pulled forward to see the whole urethra (os penis arrowed).'),TBF('tb-7-39-os-penis','7-39',AT,'an os penis with two ossification centers — don\'t call it a stone.'))+
   box('Gas in the bladder'+SL,ul(['Iatrogenic (after catheter/cystocentesis).','<b>Emphysematous cystitis</b> — almost always glucosuria → <b>diabetes mellitus</b>; E. coli most common.','Fistula to intestine or genital tract.']))+
   film('exam2-gu-beagle','Emphysematous cystitis + urethral stones, Beagle')+
   box('Hydronephrosis'+SL,'<p style="margin:0">Plain films: one or both kidneys big, normal shape. IVP (or ultrasound) shows the dilated pelvis; a chronic kidney may not opacify.</p>')+
   TBOX(TBF('tb-6-73b-emphysematous-cystitis','6.73b',BF,'gas in the bladder wall, seen in profile ventrally.'),TBF('tb-6-67a-hydronephrosis','6.67a',BF,'IVU: dilated renal pelves and ureters.'),TBF('tb-6-74-perineal-hernia','6.74',BF,'positive cystogram: bladder retroflexed into a perineal hernia.')),
  check:[q('Which urolith is radiolucent?','Urate',['Urate','Struvite','Calcium oxalate','Silica'],'Slide (GU 19).'),
   q('Why pull the hind legs forward in a male dog?','To see stones along the urethra/os penis',['To see stones along the urethra/os penis','To see the kidneys','To see the liver','It\'s not needed'],'Slide (GU 13); professor (Beagle case).'),
   q('Gas in the bladder wall in a diabetic dog →','Emphysematous cystitis',['Emphysematous cystitis','Normal','Bladder rupture','Urate stones'],'Slide (GU 21–22).'),
   q('A right kidney mass pushes the duodenum…','Ventrally and to the left',['Ventrally and to the left','Dorsally','To the right','Caudally only'],'Slide (GU 6).'),
   q('Poor retroperitoneal detail after trauma. Think…','Hemorrhage or urine (e.g., ureteral tear)',['Hemorrhage or urine (e.g., ureteral tear)','Normal fat','Obesity','Splenomegaly'],'Slide (Abdomen Principles 35).')]},

 {id:'repro',icon:'🧬',title:'Uterus, prostate and contrast studies',min:5,
  body:()=>box('Uterus'+SL,ul(['Normally not seen. Bicornuate: two long horns, short body.','Enlarged: <b>pyometra</b>, hydrometra, mucometra, hemometra, early pregnancy (fetal skeletons mineralize later).']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   film('exam2-gu-p25','Uterine enlargement')+
   box('Prostate'+SL,ul(['Usually not seen.','Enlarged if its height is > <b>70%</b> of the distance from the sacral promontory to the pubic brim.','Differentials: <b>BPH (intact males)</b>, neoplasia (think neutered males), prostatitis, paraprostatic cysts.']))+
   film('exam2-gu-p30','Prostatomegaly')+
   box('Contrast — the rules'+SL,ul(['Negative (air) or positive (barium, iodine).','<b>Barium</b>: GI only — <b>never IV</b>, and <b>not if perforation is suspected</b>.','<b>Iodinated</b>: urinary studies (IVP/EU, cystogram, urethrogram), fistulogram, myelogram. Aspiration → pulmonary edema.','Filling defects in a cystogram: <b>stones central</b> and sharp; <b>clots</b> anywhere, can stick to the wall, fuzzy; <b>air bubbles</b> at the edge of the contrast pool, round.']))+
   grid(fig('_guide/GI-p040.jpg','GI slide 40 — barium.'),fig('_guide/GU-p042.jpg','GU slide 42 — filling defects.'))+
   TBOX(TBF('tb-6-78a-bladder-tumor','6.78a',BF,'pneumocystogram: lobulated bladder tumor at the trigone (filling defect).')),
  check:[q('Prostate is enlarged when its height is more than…','70% of the sacral promontory–pubis distance',['70% of the sacral promontory–pubis distance','The width of L7','Half the bladder','Any visible size'],'Slide (GU 29).'),
   q('Prostatomegaly in an intact older dog — top differential?','Benign prostatic hyperplasia',['Benign prostatic hyperplasia','Paraprostatic cyst','Neoplasia','Normal'],'Slide (GU 29).'),
   q('Barium is contraindicated when…','GI perforation is suspected',['GI perforation is suspected','The dog vomited once','You want an upper GI','Always'],'Slide (GI 40).'),
   q('A round filling defect at the edge of the contrast pool, moving with position →','Air bubble',['Air bubble','Stone','Blood clot','Tumor'],'Slide (GU 42).'),
   q('Which is NOT a cause of uterine enlargement?','Prostatitis',['Prostatitis','Pyometra','Hydrometra','Early pregnancy'],'Slide (GU 24).')]}
];

/* ------------------------------------------------------------------ skill banks */
const T=(img,ans,ex,key,src,more)=>Object.assign({img:[].concat(img),a:ans,ex,key,src},more||{});
const C1=id=>{const c=pub(id);return (c?.images||[]).filter(v=>v.url&&!isKey(v)).map(v=>v.url)};
const K1=id=>{const c=pub(id);return (c?.images||[]).filter(v=>v.url&&isKey(v)).map(v=>v.url)[0]};
const DX=['Peritoneal effusion','Pneumoperitoneum','Normal (young/thin animal)','Hepatomegaly','Microhepatia','Splenomegaly','Splenic mass','Abdominal mass','GDV','Mechanical ileus','Functional ileus','Linear foreign body','Renal mass','Retroperitoneal (adrenal) mass','Uroliths','Emphysematous cystitis','Uterine enlargement','Prostatomegaly','Loss of retroperitoneal detail'];
const FILM=(id,a,q)=>{const c=pub(id);return T(C1(id),a,((c?.findings||'')+' '+(c?.interpretation||'')).trim(),K1(id),c?.title,{q:q||'Diagnosis?',o:DX,id:'dx:'+id})};
const TBQ=(f,a,q,ex)=>T('_textbook/'+f+'.jpg',a,ex,'',BF,{q,o:DX,id:'tb:'+f});
const IL=['Mechanical ileus','Functional ileus','Linear foreign body','Normal small intestine'];
function skills(){
 const dx=[FILM('exam2-abd-p20','Peritoneal effusion'),FILM('exam2-abd-p38','Pneumoperitoneum'),FILM('exam2-abd-p21','Normal (young/thin animal)'),FILM('exam2-abd-p23','Normal (young/thin animal)','Serosal detail is poor. Why?'),FILM('exam2-abd-p46','Hepatomegaly'),FILM('exam2-abd-p54','Microhepatia'),FILM('exam2-abd-p62','Splenomegaly'),FILM('exam2-abd-p29','Splenic mass'),FILM('exam2-abd-p24','Abdominal mass'),FILM('exam2-gi-gdv','GDV'),FILM('exam2-gi-lab-mechanical','Mechanical ileus'),FILM('exam2-gi-gsd-functional','Functional ileus'),FILM('exam2-gi-minpin-linear','Linear foreign body'),FILM('exam2-gu-scottie-renal','Renal mass'),FILM('exam2-gu-adrenal-mass','Retroperitoneal (adrenal) mass'),FILM('exam2-gu-p14','Uroliths'),FILM('exam2-gu-p22','Emphysematous cystitis'),FILM('exam2-gu-p26','Uterine enlargement'),FILM('exam2-gu-p30','Prostatomegaly'),FILM('exam2-abd-p35','Loss of retroperitoneal detail'),
  TBQ('tb-6-27-gdv','GDV','Right lateral of a large-breed dog retching. Diagnosis?','Textbook (BSAVA 6.27): pylorus dorsal, compartmentalized stomach — GDV.'),
  TBQ('tb-6-100-cat-effusion','Peritoneal effusion','Pendulous belly, all margins gone. Diagnosis?','Textbook (BSAVA 6.100): large-volume abdominal fluid in a cat.'),
  TBQ('tb-6-96-pneumoperitoneum','Pneumoperitoneum','Diagnosis?','Textbook (BSAVA 6.96): free gas outlines the diaphragm and liver.'),
  TBQ('tb-6-32a-linear-fb','Linear foreign body','Vomiting dog. Diagnosis?','Textbook (BSAVA 6.32): plicated intestine with crescent gas.'),
  TBQ('tb-6-42-microhepatia','Microhepatia','Diagnosis?','Textbook (BSAVA 6.42): narrow liver band, gastric axis rotated cranially.'),
  TBQ('tb-6-73b-emphysematous-cystitis','Emphysematous cystitis','Diabetic dog with dysuria. Diagnosis?','Textbook (BSAVA 6.73b): gas in the bladder wall.')].filter(x=>x.img.length);
 const il=[['exam2-gi-lab-mechanical',0],['exam2-gi-gsd-functional',1],['exam2-gi-minpin-linear',2],['exam2-gi-dsh-plication',2],['exam2-gi-dsh-linear-compression',2]].map(([id,i])=>{const c=pub(id);return T(C1(id),IL[i],((c?.findings||'')+' '+(c?.interpretation||'')).trim(),K1(id),c?.title,{q:'Mechanical, functional, linear FB or normal?',o:IL,id:'il:'+id})}).concat([
  T('_textbook/tb-6-29a-functional-ileus-dog.jpg',IL[1],'Textbook (BSAVA 6.29a): gas-filled loops all about the same size, throughout — functional ileus.','',BF,{q:'Mechanical, functional, linear FB or normal?',o:IL,id:'il:tb629a'}),
  T('_textbook/tb-6-29b-functional-ileus-cat.jpg',IL[1],'Textbook (BSAVA 6.29b): functional ileus in a cat.','',BF,{q:'Mechanical, functional, linear FB or normal?',o:IL,id:'il:tb629b'}),
  T('_textbook/tb-6-31a-corncob.jpg',IL[0],'Textbook (BSAVA 6.31): corn-cob foreign body; proximal loops stay gas-filled — mechanical obstruction.','',BF,{q:'Mechanical, functional, linear FB or normal?',o:IL,id:'il:tb631'}),
  T('_textbook/tb-6-32a-linear-fb.jpg',IL[2],'Textbook (BSAVA 6.32): bunched intestine with crescent gas — linear FB.','',BF,{q:'Mechanical, functional, linear FB or normal?',o:IL,id:'il:tb632'})]).filter(x=>x.img.length);
 const story=[['Cranial abdominal mass pushing the stomach caudally.','Liver, stomach, pancreas or duodenum'],['Mid-abdominal mass pushing loops to the edges.','Spleen, intestine or mesenteric nodes'],['Caudal mass pushing the colon dorsally in an intact male.','Prostate'],['Mass pushing the intestines ventrally and a kidney caudolaterally.','Adrenal gland (retroperitoneal)'],['Soft-tissue mass in the caudal abdomen of an intact female with PU/PD after heat.','Uterus']]
  .map(([s,a],i)=>T([],a,'Slide (Abdomen Principles 27; GU 5–6, 24, 29).','','Slides',{q:s+' Where is it from?',o:['Liver, stomach, pancreas or duodenum','Spleen, intestine or mesenteric nodes','Prostate','Adrenal gland (retroperitoneal)','Uterus','Bladder'],id:'where:'+i}));
 return {dx:{title:'Name it',icon:'🩻',items:dx},ileus:{title:'Which ileus?',icon:'🌭',items:il},where:{title:'Where is the mass from?',icon:'📍',items:story}};
}

/* ------------------------------------------------------------------ step-by-step class cases */
const S=(q,a,o,ex)=>({q,a,o:o||[],ex});
const CASES=[
 {g:'Abdomen class cases',id:'exam2-case1-dsh',steps:[S('Serosal detail?','Lost — fluid-filled appearance',['Lost — fluid-filled appearance','Excellent','Normal for a kitten','Increased by free gas'],'Professor: loss of serosal detail, ascites appearance.'),S('Intestinal gas?','Mixed populations, fundus very distended',['Mixed populations, fundus very distended','Uniform mild dilation','Normal','No gas at all'],'Professor.'),S('Anything displaced?','Mass effect with leftward displacement',['Mass effect with leftward displacement','Nothing','Diaphragmatic hernia','Kidneys missing'],'Professor.'),S('Can the films give a final diagnosis?','No — ruptured mass, hemoabdomen, FB perforation, ascites all possible',['No — ruptured mass, hemoabdomen, FB perforation, ascites all possible','Yes — lymphoma','Yes — normal','Yes — GDV'],'Class discussion.')]},
 {g:'Abdomen class cases',id:'exam2-case2-dog-mass',steps:[S('Main finding?','A mid-abdominal soft-tissue mass',['A mid-abdominal soft-tissue mass','Free gas','GDV','Normal'],'Professor.'),S('The liver?','Rounded margins but within the rib cage',['Rounded margins but within the rib cage','Small','Not visible','Mineralized'],'Professor.'),S('Intestines?','Pushed ventrally and caudally',['Pushed ventrally and caudally','Dilated, mechanical','Normal position','Plicated'],'Professor.'),S('Next step?','Abdominal ultrasound to find the origin',['Abdominal ultrasound to find the origin','Barium series','Nothing','Repeat in 1 year'],'Professor: you can\'t tell the origin from radiographs alone.')]},
 {g:'Abdomen class cases',id:'exam2-case3-dmh-hairties',steps:[S('Small intestine arrangement?','Abnormal — tortuous turns, stacking, mixed diameters',['Abnormal — tortuous turns, stacking, mixed diameters','Normal','Uniformly dilated','Not visible'],'Professor.'),S('Colon?','Enlarged with feces (constipation)',['Enlarged with feces (constipation)','Empty','Gas only','Normal'],'Professor.'),S('Best summary?','Equivocal: constipation vs FB vs ileus',['Equivocal: constipation vs FB vs ileus','Definitely linear FB','Definitely normal','GDV'],'Professor: the radiologist stated it as equivocal.'),S('Plan?','Enema, then repeat films; decide surgery on clinical signs',['Enema, then repeat films; decide surgery on clinical signs','Immediate barium','Euthanasia','Nothing'],'Class plan.')]},
 {g:'Abdomen class cases',id:'exam2-gi-lab-mechanical',steps:[S('Intestinal diameters?','Mixed population, some gas-dilated',['Mixed population, some gas-dilated','Uniform mild dilation','All normal','Empty'],'Professor.'),S('What is on the VD?','Soft tissue with a textile-like texture',['Soft tissue with a textile-like texture','A metal needle','Nothing','Free gas'],'Professor.'),S('Ileus type?','Mechanical — intraluminal foreign body',['Mechanical — intraluminal foreign body','Functional','Normal','Linear FB anchored at the tongue'],'Professor.')]},
 {g:'Abdomen class cases',id:'exam2-gu-beagle',steps:[S('What is in the bladder?','Gas',['Gas','A mass','Contrast','Nothing'],'Professor.'),S('Diagnosis for the bladder?','Emphysematous cystitis',['Emphysematous cystitis','Bladder rupture','Normal','Urate stones'],'Professor.'),S('Why include the perineal region?','Stones wedged at the os penis are easily missed',['Stones wedged at the os penis are easily missed','To see the kidneys','To measure the prostate','It isn\'t needed'],'Professor.')]}
];

/* ------------------------------------------------------------------ rendering helpers */
function shell(title,html){api.showModal(title,'<div style="font-size:13px;color:#354967;line-height:1.55">'+html+'</div>');try{api.body.scrollTop=0}catch(e){}}
function navBtns(extra){return '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px"><button type="button" data-vpqau="home">← Abdomen unit</button>'+(extra||'')+'</div>'}
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
 const lessonRows=LESSONS.map((l,i)=>{const r=L[l.id];return '<button type="button" data-vpqau="lesson-'+i+'" style="display:flex;gap:10px;align-items:center;text-align:left;width:100%;padding:9px 11px;margin:0 0 6px;background:#fff;border:1px solid '+(r?.score>=4?'#2e9a57':r?'#9fd3b5':'#d8dfea')+';border-radius:12px"><span style="font-size:20px">'+l.icon+'</span><span style="flex:1"><b style="color:#344f78">'+(i+1)+'. '+E(l.title)+'</b><small style="display:block;color:#68788a">about '+l.min+' min · quick check: 5 questions'+(r?' · <b style="color:#1d5e36">best '+r.score+'/5</b>':'')+'</small></span><span style="color:#7d6595;font-weight:800">›</span></button>'}).join('');
 const nxt=LESSONS.findIndex(l=>!(L[l.id]?.score>=4));
 const skillCard=k=>{const s=sk[k],n=s.items.length,done=s.items.filter(it=>items[it.id]).length;
  return '<div style="background:#fff;border:1px solid #d8dfea;border-radius:12px;padding:9px 11px"><b style="color:#344f78">'+s.icon+' '+E(s.title)+'</b><small style="display:block;color:#68788a">'+n+' questions · '+done+' answered correctly</small>'+
  '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">'+[5,10,0].filter(c=>c===0||c<n).map(c=>'<button type="button" data-vpqau="run-'+k+'-'+c+'" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">'+(c?c+' shuffled':'All '+n)+'</button>').join('')+'</div>'+
  '<details style="margin-top:6px"><summary style="cursor:pointer;font-size:12px;color:#5d6d84;font-weight:700">Pick a film</summary><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">'+s.items.map((it,i)=>'<button type="button" data-vpqau="pick-'+k+'-'+i+'" style="padding:3px 8px;border-radius:8px;font-size:12px;'+(items[it.id]?'background:#e3f6e8;border:1px solid #2e9a57':'')+'">'+(it.img.length?'Film ':'Q ')+(i+1)+(items[it.id]?' ✓':'')+'</button>').join('')+'</div></details></div>'};
 const groups=[...new Set(CASES.map(c=>c.g))];
 const caseList=groups.map(g=>'<details style="margin:0 0 6px"><summary style="cursor:pointer;font-weight:800;color:#3b4b71">'+E(g)+' <small style="color:#68788a;font-weight:600">('+CASES.filter(c=>c.g===g).length+')</small></summary><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:6px;margin:6px 0">'+CASES.map((c,i)=>[c,i]).filter(([c])=>c.g===g).map(([c,i])=>{const p=pub(c.id);const name=String(p?.title||'').split(' · ').slice(2).join(' · ')||'Case';const r=cs[c.id];return '<button type="button" data-vpqau="case-'+i+'" style="text-align:left;padding:8px 10px;background:#fff;border:1px solid '+(r?.done?'#2e9a57':'#d8dfea')+';border-radius:10px"><b style="font-size:12.5px;color:#344f78">'+(r?.done?'⭐ ':'')+E(name)+'</b><small style="display:block;color:#68788a">'+E(p?.species||'')+' · '+c.steps.length+' steps'+(r?.done?' · '+r.score+'/'+c.steps.length:'')+'</small></button>'}).join('')+'</div></details>').join('');
 shell('🫃 Exam 2 · Abdomen, GI & GU',
  '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px"><button type="button" data-vpqau="back">← '+E(back?.backLabel||'Exam 2')+'</button></div>'+
  box('📖 1 · Start here — learn it','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Suggested order — everything is open. Each lesson ends with a 5-question quick check. 📘 = textbook figure.</p>'+(nxt>=0?'<button type="button" data-vpqau="lesson-'+nxt+'" style="margin:0 0 8px;background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">▶ '+(nxt===0&&!Object.keys(L).length?'Start':'Continue')+': '+E(LESSONS[nxt].title)+'</button>':'')+lessonRows,'linear-gradient(120deg,#f4eaff,#eaf9f5)','#e0d6ed')+
  box('🎯 2 · Practice by skill','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Pick a skill and how many. Films have no title until you answer.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:8px">'+['dx','ileus','where'].map(skillCard).join('')+
   '<div style="background:#fff;border:1px solid #d8dfea;border-radius:12px;padding:9px 11px"><b style="color:#344f78">🔀 Mixed practice</b><small style="display:block;color:#68788a">Every skill, shuffled</small><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px"><button type="button" data-vpqau="run-mixed-10" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">10 shuffled</button><button type="button" data-vpqau="run-mixed-20" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">20 shuffled</button></div></div></div>','#fff')+
  box('🩺 3 · Class cases, step by step','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">The class cases, one step at a time; the professor\'s notes and keys at the end.</p>'+caseList,'#fff')+
  '<p style="font-size:11px;color:#6b7a90">Films and slides: Dr. Rebekah Gallaher, LMU CVM 743, used with LMU permission for non-commercial study. 📘 Textbook figures: '+E(BF)+'; '+E(AT)+' — credited by figure number. "Slide"/"Professor" = lecture text and her in-class notes; "study aid" = written for the game from those slides.</p>');
}
let L={i:0,qi:-1,ans:{}};
function lesson(i){
 L={i,qi:-1,ans:{}};const l=LESSONS[i];
 shell(l.icon+' Lesson '+(i+1)+' · '+l.title,navBtns((i>0?'<button type="button" data-vpqau="lesson-'+(i-1)+'">‹ Lesson '+i+'</button>':'')+(i<LESSONS.length-1?'<button type="button" data-vpqau="lesson-'+(i+1)+'">Lesson '+(i+2)+' ›</button>':''))+l.body()+
  '<div style="text-align:center;margin:14px 0"><button type="button" data-vpqau="check" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800;padding:10px 16px">✅ Quick check · 5 questions</button></div>');
}
function check(){
 const l=LESSONS[L.i],k=L.qi,it=l.check[k];
 if(k>=l.check.length){const score=Object.values(L.ans).filter(Boolean).length;save(s=>{s.lessons=s.lessons||{};const old=s.lessons[l.id]?.score||0;s.lessons[l.id]={score:Math.max(old,score)}});
  return shell('✅ Quick check · '+l.title,navBtns()+box('',(score>=4?'<b style="color:#1d5e36;font-size:16px">🎉 '+score+' / 5</b><p>Nice — you\'ve got this lesson.</p>':'<b style="color:#8a4a0c;font-size:16px">'+score+' / 5</b><p>Worth a second look before moving on.</p>')+'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px"><button type="button" data-vpqau="lesson-'+L.i+'">↺ Review the lesson</button>'+(L.i<LESSONS.length-1?'<button type="button" data-vpqau="lesson-'+(L.i+1)+'" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">Next: '+E(LESSONS[L.i+1].title)+' ›</button>':'<button type="button" data-vpqau="run-mixed-10" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">🔀 Try mixed practice</button>')+'</div>','#fff'));
 }
 const o=order(l.id+k,it.o),chosen=L.ans['c'+k];
 shell('✅ Quick check · '+l.title,navBtns('<button type="button" data-vpqau="lesson-'+L.i+'">↺ Back to the lesson</button>')+'<small style="color:#5d6d84">Question '+(k+1)+' of 5</small>'+
  box('',(it.img?imgsHtml([it.img]):'')+'<b style="font-size:14px">'+E(it.q)+'</b>'+o.map((x,i)=>optBtn(i,x,chosen===undefined?'':x===it.a?'g':i===chosen?'o':'dim','data-vpqau-qc')).join('')+
  (chosen!==undefined?'<p style="margin:6px 0 0;font-weight:700;color:'+(o[chosen]===it.a?'#1d5e36':'#8a4a0c')+'">'+(o[chosen]===it.a?'✓ Correct.':'Not quite — the answer is in green.')+'</p><p style="margin:4px 0 0;font-size:12.5px">'+E(it.ex)+'</p><div style="text-align:right"><button type="button" data-vpqau="qnext" style="font-weight:800">'+(k<4?'Next question ›':'See my score ›')+'</button></div>':''),'#f7f1fd','#dacfe8'));
}
let R={list:[],at:0,chosen:{},key:false,title:''};
function run(list,title,at=0){R={list,at,chosen:{},key:false,title};runRender()}
function runRender(){
 const it=R.list[R.at],n=R.list.length,o=opts(it),ch=R.chosen[R.at];
 const nav='<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><button type="button" data-vpqau="home">← Abdomen unit</button><button type="button" data-vpqau="rprev" '+(R.at===0?'disabled':'')+'>‹ Previous</button><button type="button" data-vpqau="rnext" '+(R.at>=n-1?'disabled':'')+'>Next ›</button><small style="color:#5d6d84;margin-left:auto">'+(it.img.length?'Film':'Question')+' '+(R.at+1)+' of '+n+'</small></div>';
 const done=Object.keys(R.chosen).length===n,score=R.list.filter((x,i)=>R.chosen[i]!==undefined&&opts(x)[R.chosen[i]]===x.a).length;
 shell('🎯 '+R.title,nav+imgsHtml(it.img)+
  box('','<b style="font-size:14px">'+E(it.q)+'</b>'+o.map((x,i)=>optBtn(i,x,ch===undefined?'':x===it.a?'g':i===ch?'o':'dim','data-vpqau-ans')).join('')+
  (ch!==undefined?'<p style="margin:6px 0 0;font-weight:700;color:'+(o[ch]===it.a?'#1d5e36':'#8a4a0c')+'">'+(o[ch]===it.a?'✓ Correct.':'Not quite — the answer is in green.')+(R.reward?' '+E(R.reward):'')+'</p><p style="margin:4px 0 0;font-size:12.5px">'+E(it.ex)+'</p>'+(it.src?'<p style="margin:4px 0 0;font-size:11px;color:#6b7a90">Source: '+E(String(it.src).replace(/^Exam 4 · /,''))+'</p>':'')+
   (it.key?'<div class="buttonrow" style="margin-top:6px"><button type="button" data-vpqau="rkey">'+(R.key?'🙈 Hide the marked slide':'👉 Show me where (marked slide)')+'</button></div>'+(R.key?'<a href="'+E(U(it.key))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(it.key))+'" alt="Marked slide" style="display:block;width:100%;border-radius:10px;margin-top:6px"></a>':''):''):''),'#f7f1fd','#dacfe8')+
  (done?box('🏁 Round finished','<b style="font-size:15px;color:'+(score>=n*.8?'#1d5e36':'#8a4a0c')+'">'+score+' / '+n+'</b><div class="buttonrow" style="margin-top:6px"><button type="button" data-vpqau="home">← Pick another skill</button></div>','#eefaf3','#c7e7d4'):'')+nav);
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
  return '<div style="background:'+(ch===undefined?'#f7f1fd':'#fff')+';border:'+(ch===undefined?'2px solid #3b4b71':'1px solid #dacfe8')+';border-radius:12px;padding:10px 12px;margin:0 0 8px"><b>Step '+(k+1)+' · '+E(s.q)+'</b>'+o.map((x,i)=>optBtn(i,x,ch===undefined?'':x===s.a?'g':i===ch?'o':'dim','data-vpqau-step')).join('')+
   (ch!==undefined?'<p style="margin:4px 0 0;font-size:12.5px"><b style="color:'+(o[ch]===s.a?'#1d5e36':'#8a4a0c')+'">'+(o[ch]===s.a?'✓ Correct.':'Not quite.')+'</b> '+E(s.ex)+'</p>':'')+'</div>'}).join('');
 const finished=CS.chosen.length===cdef.steps.length&&CS.chosen.every(x=>x!==undefined);
 const score=cdef.steps.filter((s,k)=>CS.chosen[k]!==undefined&&order(cdef.id+k,s.o)[CS.chosen[k]]===s.a).length;
 const pv=CS.i>0,nx=CS.i<CASES.length-1;
 shell('🩺 '+E(cdef.g),'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><button type="button" data-vpqau="home">← Abdomen unit</button><button type="button" data-vpqau="cprev" '+(pv?'':'disabled')+'>‹ Previous case</button><button type="button" data-vpqau="cnext" '+(nx?'':'disabled')+'>Next case ›</button><small style="color:#5d6d84;margin-left:auto">Case '+(CS.i+1)+' of '+CASES.length+'</small></div>'+
  '<h2 style="font-size:16px;margin:10px 0 2px;color:#3b4b71">'+E(name)+'</h2><p style="margin:0 0 6px;color:#7d6595;font-size:12px">'+E(c.species||'')+' · '+cdef.steps.length+' steps</p>'+
  (c.history?'<div style="border:1px solid #dbe2f0;border-radius:12px;background:#f4f8ff;padding:9px 12px"><b>🏥 History</b><p style="margin:4px 0 0">'+E(c.history)+'</p></div>':'')+imgsHtml(views)+stepHtml+
  (finished?box('🏁 '+score+' / '+cdef.steps.length+' steps correct','<p style="margin:0 0 4px"><b>Findings.</b> '+E(c.findings||'')+'</p><p style="margin:0"><b>Interpretation.</b> '+E(c.interpretation||'')+'</p>'+
   (keys.length?'<div class="buttonrow" style="margin-top:8px"><button type="button" data-vpqau="ckey">'+(CS.key?'🙈 Hide answer keys':'🖼️ Show answer keys ('+keys.length+')')+'</button></div>'+(CS.key?keys.map(v=>'<figure style="margin:8px 0 0"><a href="'+E(v.url)+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(v.url)+'" alt="" style="width:100%;border-radius:10px;border:1px solid #cfd8e6"></a><figcaption style="font-size:11px;color:#5d6d84">'+E(String(v.view).replace(/^Annotated (teaching key|comparison|textbook view) · /,''))+'</figcaption></figure>').join(''):''):'')+
   '<p style="font-size:11px;color:#6b7a90;margin:8px 0 0">'+E(c.source||'')+'</p>'+(nx?'<div style="text-align:right"><button type="button" data-vpqau="cnext" style="font-weight:800">Next case ›</button></div>':''),'#f0f9f5','#cce4db'):''));
}

function open(o){back=o||back;return (window.VPQ_IMAGING_PUBLISH?.load?.()||Promise.resolve()).then(home).catch(home)}
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function init(ctx){
 api=ctx;if(api.body.__vpqAuInit)return;api.body.__vpqAuInit=true;
 api.body.addEventListener('click',e=>{
  const qc=e.target.closest('[data-vpqau-qc]');if(qc){e.preventDefault();const k=L.qi;if(L.ans['c'+k]!==undefined)return;const l=LESSONS[L.i],it=l.check[k],o=order(l.id+k,it.o),i=+qc.dataset.vpqauQc;L.ans['c'+k]=i;L.ans[k]=o[i]===it.a;award('lesson:'+l.id+':'+k,o[i]===it.a);return check()}
  const an=e.target.closest('[data-vpqau-ans]');if(an){e.preventDefault();if(R.chosen[R.at]!==undefined)return;const it=R.list[R.at],i=+an.dataset.vpqauAns,ok=opts(it)[i]===it.a;R.chosen[R.at]=i;R.reward=award(it.id,ok);if(ok)save(s=>{s.items=s.items||{};s.items[it.id]=true});return runRender()}
  const st=e.target.closest('[data-vpqau-step]');if(st){e.preventDefault();const k=CS.step,cdef=CASES[CS.i];if(CS.chosen[k]!==undefined)return;const s=cdef.steps[k],i=+st.dataset.vpqauStep,ok=order(cdef.id+k,s.o)[i]===s.a;CS.chosen[k]=i;award('case:'+cdef.id+':'+k,ok);if(k<cdef.steps.length-1)CS.step=k+1;else{const sc=cdef.steps.filter((s2,j)=>order(cdef.id+j,s2.o)[CS.chosen[j]]===s2.a).length;save(s2=>{s2.cases=s2.cases||{};const old=s2.cases[cdef.id]?.score||0;s2.cases[cdef.id]={done:true,score:Math.max(old,sc)}})}return caseRender()}
  const b=e.target.closest('[data-vpqau]');if(!b||b.disabled)return;e.preventDefault();const k=b.dataset.vpqau;
  if(k==='back')return back?.onBack?back.onBack():window.VPQ_RADIOLOGY_EXAM2?.open?.();
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
window.VPQ_EXAM2_ABDOMEN=Object.freeze({init,open,home:open,lessons:LESSONS.length,cases:CASES.length});
})();
