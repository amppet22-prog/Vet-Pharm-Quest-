/* Exam 4 · Heart & vessels unit (same layout as the Lungs unit).
 *  1) Start here: 6 short lessons, each ending in a 5-question quick check.
 *  2) Practice by skill: which chamber · which vessel pattern · name the disease · signalment → disease · mixed.
 *  3) Class cases, step by step: Dr. Griffin's L4–5 cases (Cocker, kitten, Arthur, Samantha, RA hemangiosarcoma).
 * Films and slides: LMU CVM 743 (Dr. Lynn Griffin), owner-attested permission for non-commercial study.
 * Textbook figures (owner-approved for use, 2026-11-28): BSAVA Foundation Manual (Holloway & McConnell 2013),
 * BSAVA Thoracic Imaging 2e (Schwarz & Scrivani 2024), Thrall & Robertson Atlas 2e; each figure is credited by number.
 */
(function(){'use strict';
let api=null,view={page:'home'},back=null;
const NS='exam4-heart',STORE='vpq-exam4-heart-v1';
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
const TBF=(f,n,src,c)=>fig('_textbook/heart/'+f,'📘 '+src.split(' (')[0].replace('BSAVA Manual of Canine and Feline ','BSAVA ')+' Fig. '+n+' — '+c);
const film=(id,c)=>{const v=(pub(id)?.images||[]).filter(x=>x.url&&!isKey(x));return v.length?grid(...v.slice(0,2).map((x,i)=>fig(x.url,c+(v.length>1?' ('+'AB'[i]+')':'')))):''};
const CHAMBERS=['Left atrium','Left ventricle','Right atrium','Right ventricle','Main pulmonary artery','Aorta','Generalized / globoid'];
const VESSELS=['Arteries AND veins enlarged','Veins enlarged (arteries normal)','Arteries enlarged (veins normal)','Arteries AND veins small','Normal vessels'];

const LESSONS=[
 {id:'size',icon:'📏',title:'How big is the heart?',min:4,
  body:()=>box('What radiographs can and can\'t do'+SL,ul(['Screening tool for marked abnormalities — <b>insensitive and nonspecific</b>.','Mild enlargement is debatable; often positioning or breed.','"At the end of the day you might need an echo to know for sure."']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   box('Ask in this order'+SL,ul(['Is the heart size normal, reduced or enlarged?','Are specific chambers or great vessels enlarged?','Are the pulmonary vessels normal or enlarged?','Are the lungs and pleural space normal?']))+
   box('Vertebral heart sum (VHS)'+SL,table(['','Dog','Cat'],[['Normal','9.7 ± 0.5 vertebrae (range 8.5–10.5) — <b>breed varies</b>','7.5 ± 0.3; <b>less than 8</b> vertebrae'],['Other rules','—','Long axis more parallel to the sternum; ≤ 2.5 intercostal spaces wide; ½–⅔ of the thorax width on the VD/DV']])+
    '<p style="margin:6px 0 0">How: long axis carina → apex, short axis at 90° across the widest part; lay each line along the spine starting at <b>T4</b>, count vertebrae, add them.</p>')+
   grid(fig('_guide/L45-p008.jpg','L4–5 slide 8 — VHS numbers.'),fig('_guide/L45-p009.jpg','L4–5 slide 9 — how to draw and count.'),fig('_guide/L45-p012.jpg','L4–5 slide 12 — normal cat heart size.'),TBF('tb-5-64-vhs.jpg','5.64a',BF,'normal dog, VHS 5.75 + 4.75 = 10.5.'))+
   box('Small · normal · big — the professor\'s flow chart'+SL,table(['Heart looks…','Think'],[['Small (microcardia)','Reduced perfusion — hypovolemia, shock, dehydration; Addison\'s'],['Normal size','Normal, early/undetermined disease, <b>feline cardiomyopathy</b>, constrictive pericarditis'],['Big','Which chamber? → left, right, or generalized/globoid (pericardial effusion, DCM, combined)']]))+
   grid(fig('_guide/L45-p006.jpg','L4–5 slide 6 — the flow chart.'),TBF('tb-5-72-microcardia.jpg','5.72',BF,'microcardia from hypoadrenocorticism: small, pointed heart lifted off the sternum; thin vessels.'))+
   box('Fake cardiomegaly'+TB,'<p style="margin:0">On <b>expiration</b> or under sedation the thorax is smaller, so the heart looks bigger and the lungs whiter. Check the small triangle of lung between heart, caudal vena cava and diaphragm — tiny triangle = expiratory film.</p>'+grid(TBF('tb-6-27-expiration.jpg','6-27',AT,'A expiration (small triangle, circled) vs B full inspiration.'),TBF('tb-6-3-sedation.jpg','6-3',AT,'same Husky: A awake at inspiration, B sedated at expiration — the heart looks bigger in B.')),'#fff7e0','#f1d9a8'),
  check:[q('What is the normal VHS range in a dog?','8.5–10.5 vertebrae (about 9.7)',['8.5–10.5 vertebrae (about 9.7)','6–7 vertebrae','Less than 8 vertebrae','12–14 vertebrae'],'Slide (L4–5 8): 9.7 ± 0.5; range 8.5–10.5; breed variation affects it.'),
   q('A cat\'s heart is too big if the VHS is…','8 or more vertebrae',['8 or more vertebrae','More than 10.5 vertebrae','More than 12 vertebrae','Any value — VHS isn\'t used in cats'],'Slide (L4–5 12): normal cat VHS is less than 8 (7.5 ± 0.3).'),
   q('Where do you start counting when you lay the VHS lines on the spine?','The cranial edge of T4',['The cranial edge of T4','T1','The carina','The last rib'],'Slide (L4–5 9): measure parallel to the spine beginning at T4.'),
   q('A dog\'s heart looks small and pointed, lifted off the sternum, with thin vessels. Most likely?','Hypovolemia / hypoadrenocorticism',['Hypovolemia / hypoadrenocorticism','Pericardial effusion','Dilated cardiomyopathy','Mitral valve disease'],'Slide (L4–5 6): small heart = reduced perfusion (shock, dehydration) or Addison\'s. Textbook 5.72 shows this.'),
   q('The heart looks big but the film was taken on expiration. What do you do?','Repeat at full inspiration before calling cardiomegaly',['Repeat at full inspiration before calling cardiomegaly','Call it generalized cardiomegaly','Call it pericardial effusion','Ignore the lungs'],'Textbook (Atlas 6-27, 6-3): expiration and sedation make the heart look bigger. Study aid: confirm with a good inspiratory film or echo.')]},

 {id:'chambers',icon:'🕐',title:'Which chamber is big? (the clock face)',min:5,
  body:()=>box('The clock face on the VD/DV'+SL,table(['o\'clock','Structure'],[['11–1','Aorta'],['1–2','Main pulmonary artery (MPA)'],['2–3','Left auricle (LAA)'],['3–5','Left ventricle'],['5–9','Right ventricle'],['9–11','Right atrium']]),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   grid(fig('_guide/L45-p014.jpg','L4–5 slide 14 — chamber positions.'))+
   box('Left atrium (LA)'+SL+PROF,ul(['Lateral: <b>straight caudodorsal heart margin</b> ("backpack sign"); trachea elevated.','VD: <b>splitting of the mainstem bronchi</b>; round opacity over the caudal heart ("double bubble"); severe → left <b>auricular</b> bulge at 2–3 o\'clock (atrium ≠ auricle!).']))+
   film('exam4-hrt-lae','Left atrial enlargement (L4–5 slide 18)')+
   box('Left ventricle (LV)'+SL,ul(['May look normal.','Severe: the heart elongates.','The <b>whole thoracic trachea</b> is pushed dorsally (inlet to carina).']))+
   box('Right atrium (RA)'+SL,ul(['Bulge at <b>9–11 o\'clock</b>.','Professor: on the lateral, cranial:caudal should be about 3:2; RA bulge pushes the apex.']))+
   box('Right ventricle (RV)'+SL+PROF,ul(['Usually hypertrophy — heartworm or pulmonic stenosis.','Increased contact with the sternum.','Bulging on the VD/DV → <b>"reverse D"</b>.','Apex lifted off the sternum on the left lateral — <b>more specific</b>.']))+
   grid(fig('_guide/L45-p020.jpg','L4–5 slide 20 — LA enlargement.'),fig('_guide/L45-p024.jpg','L4–5 slide 24 — RV enlargement, with your notes.'))+
   box('Textbook examples'+TB,grid(TBF('tb-5-67-mmvd.jpg','5.67',BF,'mitral disease: straight caudal border, LA "tenting", trachea elevated; DV bulge at the LAA, apex to the right.'),TBF('tb-5-68-ps.jpg','5.68',BF,'pulmonic stenosis: more sternal contact; DV "reverse D" and MPA bulge at 1–2 o\'clock.'),TBF('tb-9-31-tricuspid.jpg','9.31',BT,'tricuspid dysplasia in a 7-month-old Old English Sheepdog: right atrial enlargement (arrows).'),TBF('tb-5-69-right-heart.jpg','5.69',BF,'Westie with pulmonary fibrosis: apex lifted off the sternum, "reverse D".')),'#fffaf0','#f1d9a8'),
  check:[q('On the VD, a bulge at 1–2 o\'clock is the…','Main pulmonary artery',CHAMBERS,'Slide (L4–5 14): MPA 1–2 o\'clock.'),
   q('A straight caudodorsal heart margin and an elevated trachea on the lateral point to…','Left atrium',CHAMBERS,'Slide (L4–5 20) and professor: straightening of the caudodorsal margin, "backpack sign".'),
   q('Which VD sign also means left atrial enlargement?','Splitting of the mainstem bronchi',['Splitting of the mainstem bronchi','"Reverse D" shape','Bulge at 9–11 o\'clock','Apex lifted off the sternum'],'Slide (L4–5 20).'),
   q('"Reverse D" heart on the VD means…','Right ventricle',CHAMBERS,'Slide (L4–5 24): RV enlargement — bulging on VD/DV, "reverse D".'),
   q('Which RV sign is the MOST specific?','Apex lifted off the sternum on the left lateral',['Apex lifted off the sternum on the left lateral','More sternal contact','A round heart','A tall heart'],'Slide (L4–5 24): elevation of the apex from the sternum on the left lateral — more specific.')]},

 {id:'vessels',icon:'🩸',title:'Read the pulmonary vessels',min:5,
  body:()=>box('The vessels are a window into the heart'+SL,ul(['<b>Lateral</b> (cranial lobar): artery and vein the same size, each no wider than the proximal ¼ of the <b>4th rib</b>. Artery dorsal, vein ventral.','<b>DV</b> (better) or VD (caudal lobar): artery and vein the same size, no wider than the <b>9th rib</b> where they cross. Artery lateral, vein medial.']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   grid(fig('_guide/L45-p161.jpg','L4–5 slide 161 — lateral rule (4th rib).'),fig('_guide/L45-p162.jpg','L4–5 slide 162 — DV rule (9th rib).'),TBF('tb-9-28-measure.jpg','9.28',BT,'right caudal lobar artery (white) and vein (black) measured where they cross the 9th rib.'),TBF('tb-6-22-dv-vessels.jpg','6-22',AT,'normal DV: each caudal lobar artery lies lateral to its vein.'))+
   box('The four patterns'+SL,table(['Pattern','Causes'],[['<b>Arteries + veins big</b> (overcirculation)','IV fluid overload; fluid retention from ↓ cardiac output; <b>left-to-right shunt</b> (PDA, VSD, ASD); peripheral AV fistula'],['<b>Arteries + veins small</b> (undercirculation)','Hypovolemia, shock, dehydration, <b>Addison\'s</b>; severe pulmonic stenosis; right-to-left shunt (tetralogy of Fallot, VSD with PS)'],['<b>Veins big</b>, arteries normal','<b>Left heart failure</b>: mitral insufficiency, early L→R shunt (veins dilate more easily), cardiomyopathy; LA obstruction'],['<b>Arteries big</b>, veins normal','<b>Heartworm</b>, pulmonary hypertension, thromboembolism']]))+
   grid(fig('_guide/L45-p163.jpg','L4–5 slide 163 — the four patterns.'),TBF('tb-9-42-vessels.jpg','9.42',BT,'(a) enlarged cranial lobar veins in heart failure; (b) severely enlarged right caudal lobar artery in heartworm.'))+
   box('Great vessels'+SL,ul(['<b>MPA</b> enlargement: bulge at 1 o\'clock on the VD (consistent); craniodorsal bulge on the lateral (uncommon).','<b>Aorta</b>: bulge between 11 and 1 o\'clock on the VD; craniodorsal on the lateral. MPA, RA and aorta overlap on the lateral!']))+
   film('exam4-ves-under','Arteries and veins small (L4–5 slide 168)'),
  check:[q('On a lateral, the cranial lobar vessels should be no wider than…','The proximal ¼ of the 4th rib',['The proximal ¼ of the 4th rib','The 9th rib','The trachea','The caudal vena cava'],'Slide (L4–5 161).'),
   q('Veins enlarged, arteries normal. Most likely?','Left-sided heart failure',['Left-sided heart failure','Heartworm disease','Hypovolemia','Fluid overload'],'Slide (L4–5 170).'),
   q('Arteries enlarged and tortuous, veins normal. Most likely?','Heartworm disease',['Heartworm disease','Mitral insufficiency','Dehydration','PDA'],'Slide (L4–5 173–174).'),
   q('Arteries AND veins enlarged in a puppy with a loud murmur. Think…','A left-to-right shunt (PDA, VSD)',['A left-to-right shunt (PDA, VSD)','Addison\'s disease','Heartworm disease','Normal for a puppy'],'Slide (L4–5 165).'),
   q('On the DV, where do you compare the caudal lobar vessels?','Where they cross the 9th rib',['Where they cross the 9th rib','At the 4th rib','At the carina','At the diaphragm'],'Slide (L4–5 162); textbook 9.28.')]},

 {id:'failure',icon:'💧',title:'Left vs right heart failure',min:5,
  body:()=>box('Failure goes "upstream"'+SL,'<p style="margin:0">Failure of one <b>ventricle</b> backs up the circulation before it. One side is most common; both late in disease.</p>','linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   box('Left-sided failure → lungs'+SL+PROF,ul(['<b>First sign: pulmonary venous congestion</b> — the vein is wider than its artery.','Then edema: interstitial early → alveolar if severe.','Dogs: <b>perihilar and caudodorsal</b>, patchy to diffuse; rarely peribronchial (large-breed DCM).','<b>Labile</b>: responds to diuretics in 12–24 h; films can lag behind the patient.','Cats: <b>random, patchy, perivascular</b> — "can be anywhere it wants"; dramatic response to treatment.']))+
   film('exam4-hrt-lchf-edema','Cardiogenic edema (L4–5 slides 47–48)')+
   box('Right-sided failure → body'+SL,ul(['Systemic venous congestion.','<b>Hepatosplenomegaly, ascites, pleural effusion, enlarged caudal vena cava</b> (CVC should be about the aorta\'s diameter).']))+
   film('exam4-hrt-rchf','Right heart failure (L4–5 slide 52)')+
   box('Cardiogenic vs non-cardiogenic edema'+SL,table(['','Cardiogenic','Non-cardiogenic'],[['Where','Perihilar / caudodorsal (dog)','Generalized, worse caudodorsal, often peripheral'],['Heart + veins','LA big, veins big','<b>Normal</b>'],['Causes','Left heart failure','Seizure, head trauma, electric shock, drowning, anaphylaxis, uremia, pancreatitis, inhalants']]))+
   box('Textbook'+TB,grid(TBF('tb-5-76-lchf-vessels.jpg','5.76',BF,'left-sided CHF: cranial lobar artery (A) and vein (V) both wider than the 4th rib, vein larger; severe edema limits the view.')),'#fffaf0','#f1d9a8'),
  check:[q('Earliest radiographic sign of left-sided decompensation?','Pulmonary venous congestion',['Pulmonary venous congestion','Pleural effusion','Hepatomegaly','A globoid heart'],'Slide (L4–5 45, 56).'),
   q('Where is cardiogenic edema in a dog?','Perihilar and caudodorsal',['Perihilar and caudodorsal','Cranioventral','Only the right middle lobe','Peripheral rim only'],'Slide (L4–5 50).'),
   q('Where is cardiogenic edema in a cat?','Random, patchy, perivascular — anywhere',['Random, patchy, perivascular — anywhere','Always perihilar','Always cranioventral','Never in the lungs'],'Slide (L4–5 75); professor: "can be anywhere it wants".'),
   q('Which set means RIGHT heart failure?','Ascites, hepatosplenomegaly, pleural effusion, big CVC',['Ascites, hepatosplenomegaly, pleural effusion, big CVC','Pulmonary venous congestion and perihilar edema','Split mainstem bronchi','Small heart, thin vessels'],'Slide (L4–5 52).'),
   q('A dog after a seizure: caudodorsal edema, normal heart and veins. Most likely?','Non-cardiogenic edema',['Non-cardiogenic edema','Cardiogenic edema','Aspiration pneumonia','Heartworm'],'Slide (L4–5 36–37).')]},

 {id:'acquired',icon:'🫀',title:'Acquired heart disease',min:6,
  body:()=>box('Mitral valve disease (MMVD)'+SL,ul(['Middle-aged to old <b>small-breed</b> dogs; cough.','<b>LA enlargement</b> → then LV.','Cough: LA squashes the left caudal lobar bronchus, or edema.','→ left-sided CHF.']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   film('exam4-hrt-mvi','Mitral insufficiency (L4–5 slide 55)')+
   box('Dilated cardiomyopathy (DCM)'+SL,ul(['<b>Large/giant</b> breeds (Great Dane, Boxer, Doberman; also Cocker).','Heart normal to severe cardiomegaly; LA enlargement may be the <b>only</b> change.','Giant breeds: generalized to globoid, left + right failure.']))+
   box('Feline hypertrophic cardiomyopathy (HCM)'+SL,ul(['Any age, all breeds (Maine Coon); check <b>hyperthyroidism</b> in older cats.','Murmur, gallop, severe dyspnea, "saddle thrombus".','<b>Heart may be normal!</b> LA enlargement; apex shifted right; <b>"valentine" heart</b>.']))+
   film('exam4-hrt-cat-lae','Feline LA enlargement (L4–5 slide 69)')+
   box('Heartworm disease'+SL,ul(['Endemic areas, any dog > 6 months; cough, exercise intolerance.','<b>Pulmonary arteries first</b>: dilated, blunted, tortuous.','Then right-sided enlargement and <b>MPA bulge at 1 o\'clock</b>.','Lungs: eosinophilic bronchopneumopathy, thromboemboli.']))+
   film('exam4-hrt-hwd-classic','Classic heartworm (L4–5 slide 86)')+
   box('Pericardial effusion'+SL,ul(['<b>Globoid</b> heart with a very sharp, curved caudodorsal border.','Often hidden by pleural effusion — repeat after thoracocentesis.','Right-heart failure signs (big CVC, hepatosplenomegaly, ascites).','Causes: <b>right atrial tumor (hemangiosarcoma)</b>, heart base tumor, idiopathic (Goldens), pericarditis, trauma, PPDH.']))+
   box('Textbook'+TB,grid(TBF('tb-5-71-cat-hcm.jpg','5.71',BF,'cat HCM: tall heart, wide dorsal third, filling the thorax width on the DV.'),TBF('tb-5-74-cat-pe.jpg','5.74',BF,'cat pericardial effusion: large round heart, sharp margins.'),TBF('tb-5-73-heart-base-mass.jpg','5.73',BF,'(a,b) dog heart base mass — trachea lifted and pushed right, pleural effusion, ascites; (c,d) cat perihilar lymph node mass.'),TBF('tb-5-70-generalized.jpg','5.70',BF,'generalized cardiomegaly, VHS 12.5 — think congenital, pericardial, DCM, valvular, anemia, bradycardia.')),'#fffaf0','#f1d9a8'),
  check:[q('Old small-breed dog with a cough; LA enlarged, then LV. Most likely?','Mitral valve disease',['Mitral valve disease','Dilated cardiomyopathy','Pulmonic stenosis','Heartworm disease'],'Slide (L4–5 54–55).'),
   q('A Doberman whose only change is LA enlargement — consider…','Dilated cardiomyopathy',['Dilated cardiomyopathy','Mitral valve dysplasia','Pericardial effusion','Hypovolemia'],'Slide (L4–5 78): LA enlargement may be the only change.'),
   q('"Valentine" heart in a cat means…','Left atrial enlargement (often HCM)',['Left atrial enlargement (often HCM)','Pericardial effusion','Right heart failure','Normal'],'Slide (L4–5 68–69).'),
   q('Which changes come FIRST in heartworm disease?','Pulmonary artery changes',['Pulmonary artery changes','Left atrial enlargement','Pleural effusion','Pulmonary venous congestion'],'Slide (L4–5 82): arteries change before the heart.'),
   q('Globoid heart with a sharp, curved caudodorsal border — and the commonest cause?','Pericardial effusion — often a right atrial tumor',['Pericardial effusion — often a right atrial tumor','DCM — Doberman','MMVD — Cavalier','Heartworm — right ventricle'],'Slide (L4–5 88–92).')]},

 {id:'congenital',icon:'👶',title:'Congenital heart disease',min:6,
  body:()=>box('Four groups'+SL,ul(['Valvular <b>stenosis</b> (pressure overload → hypertrophy): SAS, PS.','Valvular <b>incompetence</b> (volume overload): mitral or tricuspid dysplasia.','<b>Shunts</b> — almost always left → right → overcirculation: PDA, VSD.','Vascular ring anomalies (skipped in class).']),'linear-gradient(120deg,#f4eaff,#eaf9f5)')+
   box('Patent ductus arteriosus (PDA)'+SL,ul(['Aorta → pulmonary artery; flow continues after birth.','<b>Generalized cardiomegaly</b> + <b>overcirculation</b> (big arteries and veins).','"Three knuckles" is rare (aorta, MPA 1–2, left auricle 3) — usually 1–2 bulges.']))+
   film('exam4-hrt-pda','PDA (L4–5 slide 129)')+
   box('Ventricular septal defect (VSD)'+SL,ul(['English Bulldog, Springer Spaniel, cats.','Often hard to see — heart may be normal; mild overcirculation. Echo needed.']))+
   box('Subaortic stenosis (SAS)'+SL,ul(['Often normal on films.','LV elongated (hypertrophy); ± LA if mitral leak follows.','<b>Aortic arch bulge</b> at 11–1 o\'clock on the VD.']))+
   box('Pulmonic stenosis (PS)'+SL,ul(['Bulldog, Basset, Beagle, Boxer, Chihuahua, Cocker, Schnauzer, terriers.','<b>MPA bulge at 1–2 o\'clock</b>; RV hypertrophy ("reverse D"); apex lifted on the lateral.']))+
   film('exam4-hrt-ps','Pulmonic stenosis (L4–5 slide 115)')+
   box('Mitral valve dysplasia'+SL,ul(['Left heart enlargement (LA ± LV) ± venous congestion; Cavalier King Charles (and cats).']))+
   box('Textbook'+TB,grid(TBF('tb-5-66-pda.jpg','5.66',BF,'PDA: wide, tall heart, LA straightening, big cranial lobar artery and vein; DV bulges at aorta (A), PA and LAA.'),TBF('tb-5-77-cat-vsd.jpg','5.77',BF,'cat VSD: generalized cardiomegaly; arteries and veins wider than the 4th/9th ribs.'),TBF('tb-9-81-vsd.jpg','9.81',BT,'Cocker with a small VSD: mild cardiomegaly, enlarged left caudal lobar artery and vein.')),'#fffaf0','#f1d9a8'),
  check:[q('Puppy: big heart plus enlarged arteries AND veins. Top differential?','PDA',['PDA','Pulmonic stenosis','Subaortic stenosis','Heartworm disease'],'Slide (L4–5 129): generalized cardiomegaly with overcirculation.'),
   q('A bulge at 1–2 o\'clock with a "reverse D" heart in a young Bulldog →','Pulmonic stenosis',['Pulmonic stenosis','Subaortic stenosis','PDA','Mitral dysplasia'],'Slide (L4–5 113–115).'),
   q('Subaortic stenosis bulge is at…','11–1 o\'clock (aortic arch)',['11–1 o\'clock (aortic arch)','1–2 o\'clock (MPA)','2–3 o\'clock (LAA)','9–11 o\'clock (RA)'],'Slide (L4–5 109).'),
   q('Which shunt is often invisible on radiographs?','Small VSD',['Small VSD','Large PDA','Severe PS','Severe SAS'],'Slide (L4–5 125): VSD often difficult to identify; echo essential.'),
   q('Shunts almost always go…','Left to right → pulmonary overcirculation',['Left to right → pulmonary overcirculation','Right to left → undercirculation','Nowhere — they close by 1 year','Into the pericardium'],'Slide (L4–5 122).')]}
];

/* ------------------------------------------------------------------ skill banks */
const T=(img,ans,ex,key,src,more)=>Object.assign({img:[].concat(img),a:ans,ex,key,src},more||{});
const C1=id=>{const c=pub(id);return (c?.images||[]).filter(v=>v.url&&!isKey(v)).map(v=>v.url)};
const K1=id=>{const c=pub(id);return (c?.images||[]).filter(v=>v.url&&isKey(v)).map(v=>v.url)[0]};
const DIS=['Mitral valve disease','Dilated cardiomyopathy','Feline cardiomyopathy (HCM)','Heartworm disease','Pericardial effusion','Patent ductus arteriosus','Pulmonic stenosis','Subaortic stenosis','Mitral valve dysplasia','Ventricular septal defect','Hypovolemia / Addison\'s','Heart base mass'];
const FILM=(id,a,o,q,ex)=>{const c=pub(id);return T(C1(id),a,ex||((c?.findings||'')+' '+(c?.interpretation||'')).trim(),K1(id),c?.title,{q,o,id:q.slice(0,6)+':'+id})};
const TBQ=(f,a,o,q,ex,src)=>T('_textbook/heart/'+f,a,ex,'',src,{q,o,id:'tb:'+f});
function skills(){
 const CQ='Which chamber or great vessel is enlarged?',VQ='Which pulmonary vessel pattern?',DQ='Most likely diagnosis?';
 const ch=[FILM('exam4-hrt-lae','Left atrium',CHAMBERS,CQ),FILM('exam4-hrt-lae-2','Left atrium',CHAMBERS,CQ),FILM('exam4-hrt-lve','Left ventricle',CHAMBERS,CQ),FILM('exam4-hrt-rae','Right atrium',CHAMBERS,CQ),FILM('exam4-ves-mpa','Main pulmonary artery',CHAMBERS,CQ),FILM('exam4-ves-aorta','Aorta',CHAMBERS,CQ),FILM('exam4-hrt-ps','Right ventricle',CHAMBERS,CQ,'Slide (L4–5 115): RV hypertrophy ("reverse D") with a dilated MPA at 1–2 o\'clock — pulmonic stenosis.'),FILM('exam4-hrt-pe-globoid','Generalized / globoid',CHAMBERS,CQ),FILM('exam4-hrt-cat-lae','Left atrium',CHAMBERS,CQ),
  TBQ('tb-9-31-tricuspid.jpg','Right atrium',CHAMBERS,CQ,'Textbook (BSAVA Thoracic Imaging 9.31): tricuspid dysplasia — right atrial enlargement on both views (arrows).',BT),
  TBQ('tb-5-69-right-heart.jpg','Right ventricle',CHAMBERS,CQ,'Textbook (BSAVA 5.69): apex lifted off the sternum and "reverse D" — right-sided cardiomegaly (Westie with pulmonary fibrosis).',BF),
  TBQ('tb-5-70-generalized.jpg','Generalized / globoid',CHAMBERS,CQ,'Textbook (BSAVA 5.70): wide and tall heart, VHS 12.5, no single chamber — generalized cardiomegaly.',BF)].filter(x=>x.img.length);
 const vs=[FILM('exam4-ves-overcirc',VESSELS[0],VESSELS,VQ),FILM('exam4-ves-fluid',VESSELS[0],VESSELS,VQ),FILM('exam4-ves-under',VESSELS[3],VESSELS,VQ),FILM('exam4-ves-hcm-veins',VESSELS[1],VESSELS,VQ),FILM('exam4-hrt-lchf-veins',VESSELS[1],VESSELS,VQ),FILM('exam4-hrt-hwd-174',VESSELS[2],VESSELS,VQ),FILM('exam4-hrt-hwd-classic',VESSELS[2],VESSELS,VQ),
  TBQ('tb-5-72-microcardia.jpg',VESSELS[3],VESSELS,VQ,'Textbook (BSAVA 5.72): thin, thready cranial lobar vessels and a small heart — hypovolemia from hypoadrenocorticism.',BF),
  TBQ('tb-5-77-cat-vsd.jpg',VESSELS[0],VESSELS,VQ,'Textbook (BSAVA 5.77): arteries and veins wider than the 4th rib (lateral) and 9th rib (DV) — overcirculation from a VSD.',BF),
  TBQ('tb-9-81-vsd.jpg',VESSELS[0],VESSELS,VQ,'Textbook (BSAVA Thoracic Imaging 9.81): enlarged left caudal lobar artery and vein — overcirculation (small VSD).',BT)].filter(x=>x.img.length);
 const dx=[FILM('exam4-hrt-mvi','Mitral valve disease',DIS,DQ),FILM('exam4-hrt-dcm-giant','Dilated cardiomyopathy',DIS,DQ),FILM('exam4-hrt-cat-lae','Feline cardiomyopathy (HCM)',DIS,DQ),FILM('exam4-hrt-hwd-vd','Heartworm disease',DIS,DQ),FILM('exam4-hrt-hwd-classic','Heartworm disease',DIS,DQ),FILM('exam4-hrt-pe-lat','Pericardial effusion',DIS,DQ),FILM('exam4-hrt-pda','Patent ductus arteriosus',DIS,DQ),FILM('exam4-hrt-ps','Pulmonic stenosis',DIS,DQ),FILM('exam4-hrt-sas-2','Subaortic stenosis',DIS,DQ),FILM('exam4-hrt-mvd-2','Mitral valve dysplasia',DIS,DQ),FILM('exam4-ves-under','Hypovolemia / Addison\'s',DIS,DQ),
  TBQ('tb-5-67-mmvd.jpg','Mitral valve disease',DIS,'An older small-breed dog. '+DQ,'Textbook (BSAVA 5.67): straight caudal border, LA tenting, trachea elevated; DV bulge at the LAA — degenerative mitral valve disease.',BF),
  TBQ('tb-5-66-pda.jpg','Patent ductus arteriosus',DIS,'A young dog with a continuous murmur. '+DQ,'Textbook (BSAVA 5.66): generalized cardiomegaly, overcirculation, bulges at aorta, PA and LAA — PDA.',BF),
  TBQ('tb-5-68-ps.jpg','Pulmonic stenosis',DIS,'A young Boxer with a left basilar murmur. '+DQ,'Textbook (BSAVA 5.68): "reverse D", sternal contact, MPA bulge at 1–2 o\'clock — pulmonic stenosis.',BF),
  TBQ('tb-5-71-cat-hcm.jpg','Feline cardiomyopathy (HCM)',DIS,'A dyspneic cat. '+DQ,'Textbook (BSAVA 5.71): tall heart with a wide dorsal third — HCM.',BF),
  TBQ('tb-5-74-cat-pe.jpg','Pericardial effusion',DIS,'A cat. '+DQ,'Textbook (BSAVA 5.74): large, round heart with very sharp margins — pericardial effusion.',BF),
  TBQ('tb-5-73-heart-base-mass.jpg','Heart base mass',DIS,'Look at panels a and b (dog). '+DQ,'Textbook (BSAVA 5.73): terminal trachea lifted and pushed right, with pleural effusion and ascites — heart base mass.',BF)].filter(x=>x.img.length);
 const where=[['Old Cavalier with a cough; LA big; perihilar edema.','Mitral valve disease'],['Doberman, dyspneic; big LA only.','Dilated cardiomyopathy'],['Maine Coon, gallop rhythm, hind-limb paralysis.','Feline cardiomyopathy (HCM)'],['Dog from the Southeast; tortuous, blunted pulmonary arteries; MPA bulge.','Heartworm disease'],['Golden Retriever, collapse, pale; globoid heart.','Pericardial effusion'],['Puppy, continuous murmur; big heart, big arteries and veins.','Patent ductus arteriosus'],['Young Bulldog, "reverse D" heart, bulge at 1–2 o\'clock.','Pulmonic stenosis'],['Young Golden/GSD/Rottweiler; aortic arch bulge at 11–1 o\'clock.','Subaortic stenosis'],['Dog in shock: small heart, thin vessels.','Hypovolemia / Addison\'s'],['Young cat, small heart murmur, films nearly normal.','Ventricular septal defect']]
  .map(([s,a],i)=>T([],a,'Slide (L4–5, acquired and congenital disease sections).','','L4–5',{q:s+' Most likely?',o:DIS,id:'where:'+i}));
 return {chamber:{title:'Which chamber?',icon:'🕐',items:ch},vessel:{title:'Which vessel pattern?',icon:'🩸',items:vs},disease:{title:'Name the disease',icon:'🫀',items:dx},where:{title:'Signalment → disease',icon:'📋',items:where}};
}

/* ------------------------------------------------------------------ step-by-step class cases */
const S=(q,a,o,ex)=>({q,a,o:o||[],ex});
const CASES=[
 {g:'L4–5 class cases',id:'exam4-hrt-cocker',steps:[S('What is the lung pattern?','Interstitial coalescing to alveolar',['Interstitial coalescing to alveolar','Bronchial','Structured interstitial (nodules)','Normal'],'Professor: interstitial coalescing to alveolar (air bronchograms).'),S('Where is it worst?','Caudodorsal and perihilar, left > right',['Caudodorsal and perihilar, left > right','Cranioventral','Peripheral rim','Right middle lobe only'],'Slide report: primarily caudodorsal, L > R.'),S('What is big on the heart?','Left ventricle and left atrium',['Left ventricle and left atrium','Right ventricle','Right atrium','Nothing — normal heart'],'Professor: "what is it that\'s big on this dog?" LV + LA; trachea starting to run parallel.'),S('What do the cranial lobar veins show?','Mild venous congestion',['Mild venous congestion','Arterial enlargement','Small arteries and veins','Nothing'],'Professor: veins are ventral + central; bigger = venous congestion.'),S('Diagnosis?','Cardiogenic edema from left-sided CHF',['Cardiogenic edema from left-sided CHF','Aspiration pneumonia','Non-cardiogenic edema','Heartworm disease'],'Slide diagnosis: cardiogenic edema secondary to left-sided congestive heart failure.')]},
 {g:'L4–5 class cases',id:'exam4-hrt-kitten',steps:[S('First: normal or abnormal?','Abnormal — patchy, hazy interstitial pattern',['Abnormal — patchy, hazy interstitial pattern','Normal thorax','Abnormal — pneumothorax only','Abnormal — megaesophagus'],'Professor: patchy, ill-defined interstitial pattern, hazy ground glass.'),S('Heart?','Big, starting to look like a valentine',['Big, starting to look like a valentine','Small','Normal','Globoid with sharp edges'],'Professor: starting to get valentine shape; > 7.5 vertebral bodies.'),S('Heart failure in an 11-month-old cat suggests…','A congenital cause',['A congenital cause','Acquired mitral valve disease','Heartworm','Old age'],'Professor: very young cat with heart failure → congenital.'),S('Best answer?','Cardiogenic edema, likely from a congenital malformation',['Cardiogenic edema, likely from a congenital malformation','Normal thorax','Non-cardiogenic edema','Cardiogenic edema from acquired mitral disease'],'Answer circled in class.'),S('After Lasix it improved. That confirms…','Cardiogenic pulmonary edema',['Cardiogenic pulmonary edema','Pneumonia','Neoplasia','Pleural effusion'],'Slide: post-Lasix improvement; diagnosis cardiomyopathy with LA enlargement.')]},
 {g:'L4–5 class cases',id:'exam4-hrt-arthur',steps:[S('Heart size?','Generalized cardiomegaly',['Generalized cardiomegaly','Normal','Small','Right side only'],'Slide: 4–5 ICS wide on the lateral, > ⅔ of the thorax on the VD.'),S('Which chamber shows the double opacity and caudodorsal bulge?','Left atrium',CHAMBERS,'Slide: bulge at the caudodorsal heart margin and double opacity on the VD — enlarged LA.'),S('Vessels?','Arteries AND veins enlarged — overcirculation',VESSELS,'Slide: distension of the cranial lobar artery and vein and the caudal vessels.'),S('Primary differential?','Patent ductus arteriosus',['Patent ductus arteriosus','Ventricular septal defect','Pulmonic stenosis','Mitral valve dysplasia'],'Slide: PDA — VSD unlikely because of the aortic and possible MPA bulges.'),S('Why the new dyspnea?','Cardiogenic pulmonary edema (CHF)',['Cardiogenic pulmonary edema (CHF)','Tracheal compression','Aspiration pneumonia','Lung collapse'],'Slide: perihilar interstitial to alveolar infiltrates — CHF. Echo confirmed PDA; coil embolization.')]},
 {g:'L4–5 class cases',id:'exam4-hrt-samantha',steps:[S('Initial impression of the heart?','Right-sided heart enlargement',['Right-sided heart enlargement','Normal','Left-sided heart enlargement','Globoid — pericardial effusion'],'Slide: "reverse D" with mild leftward apex shift — right-sided cardiomegaly.'),S('The bulge at 1 o\'clock on the VD is…','Main pulmonary artery',CHAMBERS,'Slide: enlarged MPA.'),S('Pulmonary vessels and lungs?','Normal',['Normal','Overcirculated','Undercirculated','Alveolar edema'],'Slide: normal pulmonary vasculature and parenchyma.'),S('Diagnosis?','Pulmonic stenosis',['Pulmonic stenosis','Heartworm disease','Cor pulmonale','Mitral dysplasia'],'Slide: pulmonic stenosis.'),S('Any decompensation?','No — CVC and liver normal, good peritoneal detail',['No — CVC and liver normal, good peritoneal detail','Yes — ascites','Yes — pulmonary edema','Yes — pleural effusion'],'Slide: no evidence of decompensation.')]},
 {g:'L4–5 class cases',id:'exam4-hrt-ra-hsa',steps:[S('What is in the pleural space?','Pleural effusion (fissure lines)',['Pleural effusion (fissure lines)','Pneumothorax','Nothing','Mass'],'Professor: pleural fissure lines; pleural effusion.'),S('The heart?','Pericardial effusion',['Pericardial effusion','Normal','Microcardia','LA enlargement only'],'Professor: pleural + pericardial effusion.'),S('What else is concerning?','A right atrial mass',['A right atrial mass','Megaesophagus','Rib fracture','Bronchial pattern'],'Professor: RA marked on the VD; liver enlarged.'),S('Most likely?','Right atrial hemangiosarcoma',['Right atrial hemangiosarcoma','Idiopathic effusion','Heart base chemodectoma','Pericarditis'],'Slide: right atrial hemangiosarcoma.')]}
];

/* ------------------------------------------------------------------ rendering helpers */
function shell(title,html){api.showModal(title,'<div style="font-size:13px;color:#354967;line-height:1.55">'+html+'</div>');try{api.body.scrollTop=0}catch(e){}}
function navBtns(extra){return '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px"><button type="button" data-vpqhu="home">← Heart unit</button>'+(extra||'')+'</div>'}
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
 const lessonRows=LESSONS.map((l,i)=>{const r=L[l.id];return '<button type="button" data-vpqhu="lesson-'+i+'" style="display:flex;gap:10px;align-items:center;text-align:left;width:100%;padding:9px 11px;margin:0 0 6px;background:#fff;border:1px solid '+(r?.score>=4?'#2e9a57':r?'#9fd3b5':'#d8dfea')+';border-radius:12px"><span style="font-size:20px">'+l.icon+'</span><span style="flex:1"><b style="color:#344f78">'+(i+1)+'. '+E(l.title)+'</b><small style="display:block;color:#68788a">about '+l.min+' min · quick check: 5 questions'+(r?' · <b style="color:#1d5e36">best '+r.score+'/5</b>':'')+'</small></span><span style="color:#7d6595;font-weight:800">›</span></button>'}).join('');
 const nxt=LESSONS.findIndex(l=>!(L[l.id]?.score>=4));
 const skillCard=k=>{const s=sk[k],n=s.items.length,done=s.items.filter(it=>items[it.id]).length;
  return '<div style="background:#fff;border:1px solid #d8dfea;border-radius:12px;padding:9px 11px"><b style="color:#344f78">'+s.icon+' '+E(s.title)+'</b><small style="display:block;color:#68788a">'+n+' questions · '+done+' answered correctly</small>'+
  '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">'+[5,10,0].filter(c=>c===0||c<n).map(c=>'<button type="button" data-vpqhu="run-'+k+'-'+c+'" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">'+(c?c+' shuffled':'All '+n)+'</button>').join('')+'</div>'+
  '<details style="margin-top:6px"><summary style="cursor:pointer;font-size:12px;color:#5d6d84;font-weight:700">Pick a film</summary><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">'+s.items.map((it,i)=>'<button type="button" data-vpqhu="pick-'+k+'-'+i+'" style="padding:3px 8px;border-radius:8px;font-size:12px;'+(items[it.id]?'background:#e3f6e8;border:1px solid #2e9a57':'')+'">'+(it.img.length?'Film ':'Q ')+(i+1)+(items[it.id]?' ✓':'')+'</button>').join('')+'</div></details></div>'};
 const groups=[...new Set(CASES.map(c=>c.g))];
 const caseList=groups.map(g=>'<details style="margin:0 0 6px"><summary style="cursor:pointer;font-weight:800;color:#3b4b71">'+E(g)+' <small style="color:#68788a;font-weight:600">('+CASES.filter(c=>c.g===g).length+')</small></summary><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:6px;margin:6px 0">'+CASES.map((c,i)=>[c,i]).filter(([c])=>c.g===g).map(([c,i])=>{const p=pub(c.id);const name=String(p?.title||'').split(' · ').slice(2).join(' · ')||'Case';const r=cs[c.id];return '<button type="button" data-vpqhu="case-'+i+'" style="text-align:left;padding:8px 10px;background:#fff;border:1px solid '+(r?.done?'#2e9a57':'#d8dfea')+';border-radius:10px"><b style="font-size:12.5px;color:#344f78">'+(r?.done?'⭐ ':'')+E(name)+'</b><small style="display:block;color:#68788a">'+E(p?.species||'')+' · '+c.steps.length+' steps'+(r?.done?' · '+r.score+'/'+c.steps.length:'')+'</small></button>'}).join('')+'</div></details>').join('');
 shell('❤️ Exam 4 · Heart & vessels',
  '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px"><button type="button" data-vpqhu="back">← '+E(back?.backLabel||'Exam 4')+'</button></div>'+
  box('📖 1 · Start here — learn it','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Suggested order — everything is open. Each lesson ends with a 5-question quick check. 📘 = textbook figure.</p>'+(nxt>=0?'<button type="button" data-vpqhu="lesson-'+nxt+'" style="margin:0 0 8px;background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">▶ '+(nxt===0&&!Object.keys(L).length?'Start':'Continue')+': '+E(LESSONS[nxt].title)+'</button>':'')+lessonRows,'linear-gradient(120deg,#f4eaff,#eaf9f5)','#e0d6ed')+
  box('🎯 2 · Practice by skill','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Pick a skill and how many. Films have no title until you answer.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:8px">'+['chamber','vessel','disease','where'].map(skillCard).join('')+
   '<div style="background:#fff;border:1px solid #d8dfea;border-radius:12px;padding:9px 11px"><b style="color:#344f78">🔀 Mixed practice</b><small style="display:block;color:#68788a">Every skill, shuffled</small><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px"><button type="button" data-vpqhu="run-mixed-10" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">10 shuffled</button><button type="button" data-vpqhu="run-mixed-20" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">20 shuffled</button></div></div></div>','#fff')+
  box('🩺 3 · Class cases, step by step','<p style="margin:0 0 8px;font-size:12.5px;color:#53647c">Dr. Griffin\'s own questions from class, one step at a time; her answer keys at the end.</p>'+caseList,'#fff')+
  '<p style="font-size:11px;color:#6b7a90">Films and slides: Dr. Lynn Griffin, LMU CVM 743, used with LMU permission for non-commercial study. 📘 Textbook figures: '+E(BF)+'; '+E(BT)+'; '+E(AT)+' — credited by figure number. "Slide"/"Professor" = lecture text and her in-class notes; "study aid" = written for the game from those slides.</p>');
}
let L={i:0,qi:-1,ans:{}};
function lesson(i){
 L={i,qi:-1,ans:{}};const l=LESSONS[i];
 shell(l.icon+' Lesson '+(i+1)+' · '+l.title,navBtns((i>0?'<button type="button" data-vpqhu="lesson-'+(i-1)+'">‹ Lesson '+i+'</button>':'')+(i<LESSONS.length-1?'<button type="button" data-vpqhu="lesson-'+(i+1)+'">Lesson '+(i+2)+' ›</button>':''))+l.body()+
  '<div style="text-align:center;margin:14px 0"><button type="button" data-vpqhu="check" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800;padding:10px 16px">✅ Quick check · 5 questions</button></div>');
}
function check(){
 const l=LESSONS[L.i],k=L.qi,it=l.check[k];
 if(k>=l.check.length){const score=Object.values(L.ans).filter(Boolean).length;save(s=>{s.lessons=s.lessons||{};const old=s.lessons[l.id]?.score||0;s.lessons[l.id]={score:Math.max(old,score)}});
  return shell('✅ Quick check · '+l.title,navBtns()+box('',(score>=4?'<b style="color:#1d5e36;font-size:16px">🎉 '+score+' / 5</b><p>Nice — you\'ve got this lesson.</p>':'<b style="color:#8a4a0c;font-size:16px">'+score+' / 5</b><p>Worth a second look before moving on.</p>')+'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px"><button type="button" data-vpqhu="lesson-'+L.i+'">↺ Review the lesson</button>'+(L.i<LESSONS.length-1?'<button type="button" data-vpqhu="lesson-'+(L.i+1)+'" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">Next: '+E(LESSONS[L.i+1].title)+' ›</button>':'<button type="button" data-vpqhu="run-mixed-10" style="background:#3b4b71;color:#fff;border-color:#3b4b71;font-weight:800">🔀 Try mixed practice</button>')+'</div>','#fff'));
 }
 const o=order(l.id+k,it.o),chosen=L.ans['c'+k];
 shell('✅ Quick check · '+l.title,navBtns('<button type="button" data-vpqhu="lesson-'+L.i+'">↺ Back to the lesson</button>')+'<small style="color:#5d6d84">Question '+(k+1)+' of 5</small>'+
  box('',(it.img?imgsHtml([it.img]):'')+'<b style="font-size:14px">'+E(it.q)+'</b>'+o.map((x,i)=>optBtn(i,x,chosen===undefined?'':x===it.a?'g':i===chosen?'o':'dim','data-vpqhu-qc')).join('')+
  (chosen!==undefined?'<p style="margin:6px 0 0;font-weight:700;color:'+(o[chosen]===it.a?'#1d5e36':'#8a4a0c')+'">'+(o[chosen]===it.a?'✓ Correct.':'Not quite — the answer is in green.')+'</p><p style="margin:4px 0 0;font-size:12.5px">'+E(it.ex)+'</p><div style="text-align:right"><button type="button" data-vpqhu="qnext" style="font-weight:800">'+(k<4?'Next question ›':'See my score ›')+'</button></div>':''),'#f7f1fd','#dacfe8'));
}
let R={list:[],at:0,chosen:{},key:false,title:''};
function run(list,title,at=0){R={list,at,chosen:{},key:false,title};runRender()}
function runRender(){
 const it=R.list[R.at],n=R.list.length,o=opts(it),ch=R.chosen[R.at];
 const nav='<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><button type="button" data-vpqhu="home">← Heart unit</button><button type="button" data-vpqhu="rprev" '+(R.at===0?'disabled':'')+'>‹ Previous</button><button type="button" data-vpqhu="rnext" '+(R.at>=n-1?'disabled':'')+'>Next ›</button><small style="color:#5d6d84;margin-left:auto">'+(it.img.length?'Film':'Question')+' '+(R.at+1)+' of '+n+'</small></div>';
 const done=Object.keys(R.chosen).length===n,score=R.list.filter((x,i)=>R.chosen[i]!==undefined&&opts(x)[R.chosen[i]]===x.a).length;
 shell('🎯 '+R.title,nav+imgsHtml(it.img)+
  box('','<b style="font-size:14px">'+E(it.q)+'</b>'+o.map((x,i)=>optBtn(i,x,ch===undefined?'':x===it.a?'g':i===ch?'o':'dim','data-vpqhu-ans')).join('')+
  (ch!==undefined?'<p style="margin:6px 0 0;font-weight:700;color:'+(o[ch]===it.a?'#1d5e36':'#8a4a0c')+'">'+(o[ch]===it.a?'✓ Correct.':'Not quite — the answer is in green.')+(R.reward?' '+E(R.reward):'')+'</p><p style="margin:4px 0 0;font-size:12.5px">'+E(it.ex)+'</p>'+(it.src?'<p style="margin:4px 0 0;font-size:11px;color:#6b7a90">Source: '+E(String(it.src).replace(/^Exam 4 · /,''))+'</p>':'')+
   (it.key?'<div class="buttonrow" style="margin-top:6px"><button type="button" data-vpqhu="rkey">'+(R.key?'🙈 Hide the marked slide':'👉 Show me where (marked slide)')+'</button></div>'+(R.key?'<a href="'+E(U(it.key))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(it.key))+'" alt="Marked slide" style="display:block;width:100%;border-radius:10px;margin-top:6px"></a>':''):''):''),'#f7f1fd','#dacfe8')+
  (done?box('🏁 Round finished','<b style="font-size:15px;color:'+(score>=n*.8?'#1d5e36':'#8a4a0c')+'">'+score+' / '+n+'</b><div class="buttonrow" style="margin-top:6px"><button type="button" data-vpqhu="home">← Pick another skill</button></div>','#eefaf3','#c7e7d4'):'')+nav);
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
  return '<div style="background:'+(ch===undefined?'#f7f1fd':'#fff')+';border:'+(ch===undefined?'2px solid #3b4b71':'1px solid #dacfe8')+';border-radius:12px;padding:10px 12px;margin:0 0 8px"><b>Step '+(k+1)+' · '+E(s.q)+'</b>'+o.map((x,i)=>optBtn(i,x,ch===undefined?'':x===s.a?'g':i===ch?'o':'dim','data-vpqhu-step')).join('')+
   (ch!==undefined?'<p style="margin:4px 0 0;font-size:12.5px"><b style="color:'+(o[ch]===s.a?'#1d5e36':'#8a4a0c')+'">'+(o[ch]===s.a?'✓ Correct.':'Not quite.')+'</b> '+E(s.ex)+'</p>':'')+'</div>'}).join('');
 const finished=CS.chosen.length===cdef.steps.length&&CS.chosen.every(x=>x!==undefined);
 const score=cdef.steps.filter((s,k)=>CS.chosen[k]!==undefined&&order(cdef.id+k,s.o)[CS.chosen[k]]===s.a).length;
 const pv=CS.i>0,nx=CS.i<CASES.length-1;
 shell('🩺 '+E(cdef.g),'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><button type="button" data-vpqhu="home">← Heart unit</button><button type="button" data-vpqhu="cprev" '+(pv?'':'disabled')+'>‹ Previous case</button><button type="button" data-vpqhu="cnext" '+(nx?'':'disabled')+'>Next case ›</button><small style="color:#5d6d84;margin-left:auto">Case '+(CS.i+1)+' of '+CASES.length+'</small></div>'+
  '<h2 style="font-size:16px;margin:10px 0 2px;color:#3b4b71">'+E(name)+'</h2><p style="margin:0 0 6px;color:#7d6595;font-size:12px">'+E(c.species||'')+' · '+cdef.steps.length+' steps</p>'+
  (c.history?'<div style="border:1px solid #dbe2f0;border-radius:12px;background:#f4f8ff;padding:9px 12px"><b>🏥 History</b><p style="margin:4px 0 0">'+E(c.history)+'</p></div>':'')+imgsHtml(views)+stepHtml+
  (finished?box('🏁 '+score+' / '+cdef.steps.length+' steps correct','<p style="margin:0 0 4px"><b>Findings.</b> '+E(c.findings||'')+'</p><p style="margin:0"><b>Interpretation.</b> '+E(c.interpretation||'')+'</p>'+
   (keys.length?'<div class="buttonrow" style="margin-top:8px"><button type="button" data-vpqhu="ckey">'+(CS.key?'🙈 Hide answer keys':'🖼️ Show answer keys ('+keys.length+')')+'</button></div>'+(CS.key?keys.map(v=>'<figure style="margin:8px 0 0"><a href="'+E(v.url)+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(v.url)+'" alt="" style="width:100%;border-radius:10px;border:1px solid #cfd8e6"></a><figcaption style="font-size:11px;color:#5d6d84">'+E(String(v.view).replace(/^Annotated (teaching key|comparison|textbook view) · /,''))+'</figcaption></figure>').join(''):''):'')+
   '<p style="font-size:11px;color:#6b7a90;margin:8px 0 0">'+E(c.source||'')+'</p>'+(nx?'<div style="text-align:right"><button type="button" data-vpqhu="cnext" style="font-weight:800">Next case ›</button></div>':''),'#f0f9f5','#cce4db'):''));
}

function open(o){back=o||back;return (window.VPQ_IMAGING_PUBLISH?.load?.()||Promise.resolve()).then(home).catch(home)}
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function init(ctx){
 api=ctx;if(api.body.__vpqHuInit)return;api.body.__vpqHuInit=true;
 api.body.addEventListener('click',e=>{
  const qc=e.target.closest('[data-vpqhu-qc]');if(qc){e.preventDefault();const k=L.qi;if(L.ans['c'+k]!==undefined)return;const l=LESSONS[L.i],it=l.check[k],o=order(l.id+k,it.o),i=+qc.dataset.vpqhuQc;L.ans['c'+k]=i;L.ans[k]=o[i]===it.a;award('lesson:'+l.id+':'+k,o[i]===it.a);return check()}
  const an=e.target.closest('[data-vpqhu-ans]');if(an){e.preventDefault();if(R.chosen[R.at]!==undefined)return;const it=R.list[R.at],i=+an.dataset.vpqhuAns,ok=opts(it)[i]===it.a;R.chosen[R.at]=i;R.reward=award(it.id,ok);if(ok)save(s=>{s.items=s.items||{};s.items[it.id]=true});return runRender()}
  const st=e.target.closest('[data-vpqhu-step]');if(st){e.preventDefault();const k=CS.step,cdef=CASES[CS.i];if(CS.chosen[k]!==undefined)return;const s=cdef.steps[k],i=+st.dataset.vpqhuStep,ok=order(cdef.id+k,s.o)[i]===s.a;CS.chosen[k]=i;award('case:'+cdef.id+':'+k,ok);if(k<cdef.steps.length-1)CS.step=k+1;else{const sc=cdef.steps.filter((s2,j)=>order(cdef.id+j,s2.o)[CS.chosen[j]]===s2.a).length;save(s2=>{s2.cases=s2.cases||{};const old=s2.cases[cdef.id]?.score||0;s2.cases[cdef.id]={done:true,score:Math.max(old,sc)}})}return caseRender()}
  const b=e.target.closest('[data-vpqhu]');if(!b||b.disabled)return;e.preventDefault();const k=b.dataset.vpqhu;
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
window.VPQ_EXAM4_HEART=Object.freeze({init,open,home:open,lessons:LESSONS.length,cases:CASES.length});
})();
