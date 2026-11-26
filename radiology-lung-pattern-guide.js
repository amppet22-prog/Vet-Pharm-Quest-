/* Exam 4 · Lung pattern guide ("here are the patterns and how to see and check them").
 * A short visual lesson before the Exam 4 cases: one page per pattern with what it looks like,
 * how to check for it, unmarked vs marked lecture films ("Show me where"), the common-causes table,
 * sampling, and a Practice button that plays that pattern's Exam 4 cases in the shared case player.
 * Text marked "Slide" is Dr. Griffin's lecture text (L1, L2, L8); "Study aid" text is a summary
 * written for the game from those slides. Images: LMU CVM 743 course slides (owner-attested permission).
 */
(function(){'use strict';
let api=null,tab='how',marked={},back=null;
const BASE='https://raw.githubusercontent.com/amppet22-prog/Vet-Pharm-Quest-/main/radiology-course-photos/exam4/';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IMG=p=>BASE+p;
// Mini cartoons of each pattern (drawn for the game, not radiographs).
const ICON={
 bronch:'<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#fff4e6"/><circle cx="20" cy="22" r="7" fill="none" stroke="#c7791f" stroke-width="4"/><circle cx="44" cy="40" r="6" fill="none" stroke="#c7791f" stroke-width="4"/><path d="M14 52 L36 30 M20 56 L42 34" stroke="#c7791f" stroke-width="3.5" stroke-linecap="round"/></svg>',
 ui:'<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#eef1ff"/><path d="M10 50 Q30 30 54 12" stroke="#8d9bd8" stroke-width="5" fill="none" opacity=".5"/><path d="M14 56 Q34 38 58 24" stroke="#8d9bd8" stroke-width="4" fill="none" opacity=".45"/><circle cx="32" cy="32" r="24" fill="#a9b5ea" opacity=".35"/></svg>',
 si:'<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#eafaf2"/><circle cx="18" cy="20" r="6" fill="#3c9f6b"/><circle cx="42" cy="18" r="4" fill="#3c9f6b"/><circle cx="30" cy="38" r="8" fill="#3c9f6b"/><circle cx="50" cy="46" r="5" fill="#3c9f6b"/><circle cx="14" cy="48" r="3" fill="#3c9f6b"/></svg>',
 alv:'<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#fdeef3"/><path d="M8 58 L8 26 Q32 6 56 26 L56 58Z" fill="#d97b99" opacity=".75"/><path d="M32 58 L32 34 M32 44 L22 34 M32 40 L42 30" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>'
};
const P={
 bronch:{name:'Bronchial pattern',icon:ICON.bronch,color:'#c7791f',bg:'#fff8ef',answer:'Bronchial pattern',
  tell:'Airway WALLS you can see: donuts (end-on) and tramlines (side-on), further out in the lung than normal. The lung around them is still full of air.',
  looks:['Slide: thickened end-on bronchi = rings or "donuts" (thick ring, lucent center; sometimes the adjacent vessels beside it).','Slide: thickened long-axis bronchi = paired parallel lines or "tramtracks"; seen more peripherally than normal; thinner than vessels.','Slide: the lung around the thickened airways is still well aerated, sometimes hyperinflated. In some severe cases the whole lung is web-like ("lacy, cobblestone" — professor).','Slide (normal): airway walls sit between the artery–vein pair to the cranial lobes; normally you can\'t see 2nd/3rd-generation walls.'],
  check:['Find the artery–vein pair to a cranial lobe; the airway is between them.','Follow airways out toward the periphery: walls still visible far out = abnormal.','Hunt for donuts (look end-on) and tramlines (side-on) — especially peripherally, where mild cases show best.','Confirm the lung between them is still aerated (if it\'s filling in, think interstitial/alveolar too).','Look for the consequences: lobar collapse (R middle), hyperinflation with flat/tented diaphragm, bronchiectasis, rib fx (9th–13th), mineralization.'],
  trap:'Old dogs: mineralized walls are thin and bright (opaque, not thick) — "old dog lung", not disease.',
  causes:[['Allergic airway disease','Common in cats; may have hyperinflated lungs / tented diaphragm'],['Infection','Bacterial, parasitic (Toxoplasma)'],['Chronic irritation','e.g., smoke exposure'],['Diffuse neoplasia','Rare; cats with metastatic mammary carcinoma, can be asymptomatic'],['Atypical peribronchial cardiogenic edema','Cats (and Doberman DCM)'],['Bronchial mineralization','"Old dog lung", hyperadrenocorticism'],['Pulmonary fibrosis','']],
  sample:'Airway → BAL or transtracheal wash (TTW).',
  films:[{t:'Normal vs bronchial (L1 slide 50)',u:'patterns/exam4-pat-bronch-moderate__01.jpg',m:'_answer-keys/L1-p050.jpg',n:'Marked: normal dog — you can\'t see 2nd/3rd-generation walls; bronchial dog — 2nd/3rd bronchi highlighted.'},
   {t:'Donuts & tramlines (L3 slides 22–23)',u:'lung/exam4-lung-l3-cat-smoker__01.jpg',m:'_guide/L3-p023.jpg',n:'Marked: red arrows on thickened airways in a very severe feline case ("donuts!").'},
   {t:'Marked bronchial, lacy (L1 slide 48)',u:'patterns/exam4-pat-bronch-lacy__01.jpg',m:'_answer-keys/L1-p048.jpg',n:'Professor: "lacy, cobblestone", involving the parenchyma; you see the smaller airways.'},
   {t:'Diffuse bronchial, donuts circled (L3 slide 35)',u:'lung/exam4-lung-l3-rml__01.jpg',m:'_guide/L3-p035.jpg',n:'Marked: donuts drawn on end-on airways on both views.'}],
  extra:[{t:'How the pattern is built (L1 slides 43–44)',u:'_guide/L1-p043.jpg'},{t:'Doughnuts and tramtracks (L1 slide 44)',u:'_guide/L1-p044.jpg'}]},
 ui:{name:'Unstructured interstitial pattern',icon:ICON.ui,color:'#5a6bc2',bg:'#f4f6ff',answer:'Unstructured interstitial pattern',
  tell:'A hazy, "textured" grey veil over the lung. Vessels are still VISIBLE but fuzzy (small peripheral ones may disappear).',
  looks:['Slide: increased background opacity of the lung; with material in the interstitium it has a subtle "textured" appearance; unevenly distributed.','Slide: not as severe as alveolar — you can still see the larger pulmonary vessels, but they look fuzzy; smaller peripheral vessels may not be visible.','Slide: on the VD/DV you can compare one side of the lung with the other.','Slide (mechanism in reality): small amounts of material in the alveolar space look interstitial, so interstitial often progresses into alveolar ("coalescing" — professor).'],
  check:['FIRST rule out the look-alikes: expiration, obesity, underexposure, obliquity, skin folds (see the Look-alikes tab).','Pick a vessel and follow it: can you still see its edges? Fuzzy but there = interstitial. Gone = think alveolar.','Compare left vs right on the VD/DV and the two laterals.','Note where it\'s worst (perihilar/caudodorsal? patchy? diffuse?) — distribution drives the differential.','Look at the heart and veins: big LA + big veins = cardiogenic edema.'],
  trap:'Expiratory films make a fake caudodorsal "interstitial" pattern that goes away on inspiration — check the heart–CVC–diaphragm triangle.',
  causes:[['Artifact','Expiration, increased BCS, underexposed'],['Fibrosis','"Old dog lung", idiopathic'],['Pulmonary edema','Cardiogenic or non-cardiogenic'],['Hemorrhage','Often patchy'],['Interstitial pneumonia','Viral (distemper), lepto (may be nodular)'],['Neoplasia','Diffuse — think lymphoma']],
  sample:'Interstitium → fine-needle aspirate, biopsy.',
  films:[{t:'Normal vs interstitial (L2 slide 19)',u:'patterns/exam4-pat-ui-moderate__01.jpg',m:'_answer-keys/L2-p019.jpg',n:'Slide shows the diffuse moderate interstitial dog next to a normal dog.'},
   {t:'Diffuse, marked (L2 slide 18)',u:'patterns/exam4-pat-ui-marked__01.jpg',m:'_answer-keys/L2-p018.jpg',n:'Professor: "interstitial coalescing into alveolar!"'},
   {t:'Hazy close-ups (L3 slides 16–18)',u:'patterns/exam4-pat-ui-l3__01.jpg',m:'_guide/L3-p018.jpg',n:'Professor: hazy opacity, unstructured, vessels still visible.'},
   {t:'One-sided: compare sides (L2 slide 17)',u:'patterns/exam4-pat-ui-right__01.jpg',m:'_answer-keys/L2-p017.jpg',n:'Slide: moderate, right-sided — the VD lets you compare with the opposite lung.'}],
  extra:[{t:'Normal vs interstitial vs alveolar diagram (L2 slide 15)',u:'_guide/L2-p015.jpg'}]},
 si:{name:'Structured interstitial pattern (nodules/masses)',icon:ICON.si,color:'#2f8a5c',bg:'#f1fbf6',answer:'Structured interstitial pattern (nodules/masses)',
  tell:'Discrete ROUND soft-tissue opacities (nodules or masses) — solitary, multiple, or miliary (tiny and everywhere).',
  looks:['Slide: nodules or masses — solid or cavitary (gas + soft tissue); solitary, multiple or diffuse.','Slide: miliary nodules are very tiny (metastatic cancer); nodules can also be larger.','Slide: a nodule generally has to be ~5 mm to be detected on radiographs.','Slide: one definition — masses ≥2 cm, nodules <2 cm.'],
  check:['Scan every lung field on BOTH laterals + the VD/DV (the down lung hides nodules — always take both laterals for a met check).','For each "dot": is it soft tissue and round, and ≥5 mm? Anything you can see <5 mm is probably mineral.','Rule out mimics: osteoma (mineral, irregular, peripheral), end-on vessel (perfectly round, same size as the vessel beside it, brighter), nipple/skin nodule (one sharper margin, outside the lung on the orthogonal view).','Count them: multiple → metastatic first; one mid–large mass → primary tumor (location!).','Look for lymphadenopathy (fungal granulomas) and the history (geography, primary tumor, lameness).'],
  trap:'Nipples and skin masses: confirm with the orthogonal view or barium paste on the nipple.',
  causes:[['Neoplasia – metastatic','Multiple nodules or miliary pattern'],['Neoplasia – primary','Primary pulmonary carcinoma (caudodorsal); histiocytic sarcoma (ventral right middle)'],['Granulomas','Fungal — geography, lymphadenopathy'],['Abscess','May be cavitary, inflammation around lesion'],['Rule outs','Osteomas, end-on vessels, external structures — mineral opacity, can see when <5 mm']],
  sample:'Interstitium → fine-needle aspirate, biopsy.',
  films:[{t:'Larger nodules (L2 slide 49)',u:'patterns/exam4-pat-si-large__01.jpg',m:'_answer-keys/L2-p049.jpg',n:'Slide: pulmonary nodules can also be larger — metastatic cancer.'},
   {t:'Miliary nodules (L2 slide 48)',u:'patterns/exam4-pat-si-miliary__01.jpg',m:'_answer-keys/L2-p048.jpg',n:'Slide: miliary nodules are very tiny — metastatic cancer.'},
   {t:'Fungal vs metastatic (L3 slide 61)',u:'lung/exam4-lung-l3-blasto__01.jpg',m:'_answer-keys/L3-p061.jpg',n:'Professor: both have a structured interstitial pattern — nodules circled.'}],
  extra:[]},
 alv:{name:'Alveolar pattern',icon:ICON.alv,color:'#b8476b',bg:'#fff3f7',answer:'Alveolar pattern',
  tell:'Air is REPLACED: solid fluid-white lung where you can\'t see vessels, plus at least one of air bronchogram · lobar sign · border effacement.',
  looks:['Slide: soft-tissue opaque portions of lung with at least one of: air bronchograms AND/OR lobar sign AND/OR border effacement with adjacent soft-tissue structures (heart, diaphragm).','Slide: air bronchogram — lucent airway with surrounding soft-tissue opacity; walls not seen, only the lumen; vessels are border-effaced.','Slide: lobar sign — well-defined marked change in opacity between adjacent lung lobes.','Slide: uniform, homogeneous fluid opacity (faint → fluffy → solid); can\'t see blood vessels; usually focal — diffuse alveolar is very rare unless very severe.'],
  check:['Find the whitest lung. Can you see vessels through it? No → alveolar.','Prove it: look for black branching airways inside the white (air bronchogram).','Look for a straight sharp edge where one lobe meets a normal lobe (lobar sign).','Check if the heart or diaphragm border disappears into it (border effacement).','Say WHERE: ventral cranial–mid (aspiration), perihilar/caudodorsal (cardiogenic edema), one lobe with volume loss (atelectasis), patchy + trauma (hemorrhage). This is the most severe pattern — it wins.'],
  trap:'Anesthesia / recumbency atelectasis looks just like ventral pneumonia — reposition, ventilate and repeat.',
  causes:[['Pneumonia','Aspiration and bronchopneumonia often ventral; hematogenous diffuse'],['Pulmonary edema (severe)',''],['Hemorrhage','Trauma or coagulopathy'],['Atelectasis','Anesthesia, prolonged recumbency, bronchial plugging'],['Neoplasia','Histiocytic sarcoma (R middle most common) or primary carcinoma (caudal lung lobes)'],['PTE','May see a focal alveolar pattern OR hyperlucency']],
  sample:'Alveolar → BAL or fine-needle aspirate / biopsy.',
  films:[{t:'Air bronchogram (L2 slide 84)',u:'patterns/exam4-pat-alv-bronchogram__01.jpg',m:'_answer-keys/L2-p084.jpg',n:'Slide: the highlighted version traces the black branching airways inside the white lung.'},
   {t:'Lobar sign, VD (L2 slide 86)',u:'patterns/exam4-pat-alv-lobar-vd__01.jpg',m:'_answer-keys/L2-p086.jpg',n:'Arrows: sharp line between the filled lobe and the aerated lobe.'},
   {t:'Lobar sign, lateral (L2 slide 87)',u:'patterns/exam4-pat-alv-lobar-lat__01.jpg',m:'_answer-keys/L2-p087.jpg',n:'Professor: accessory lung lobe.'},
   {t:'Lobar sign in a bronchial cat (L3 slide 34)',u:'lung/exam4-lung-l3-rml__01.jpg',m:'_guide/L3-p034.jpg',n:'Slide: lobar sign — component of alveolar (red line).'}],
  extra:[{t:'What an alveolar pattern needs (L2 slide 81)',u:'_guide/L2-p081.jpg'}]}
};
const TABS=[['how','🧭 How to check'],['bronch','🍩 Bronchial'],['ui','🌫️ Unstructured interstitial'],['si','⚪ Structured interstitial'],['alv','💧 Alveolar'],['mixed','🎨 Mixed'],['mimic','🎭 Look-alikes']];
const MIMICS=[['Expiratory film','mim-expiration-1','Fake caudodorsal haze; small heart–CVC–diaphragm triangle. Take at peak inspiration.'],['Obesity','mim-obesity','Fat superimposed over the whole lung: diffuse homogeneous opacity.'],['Underexposure','mim-underexposed','Pure white that brightness/contrast can\'t fix.'],['Obliquity','mim-obliquity','Rotated VD: one side greyer, homogeneous, no texture.'],['Skin fold','mim-skinfold','Brightest at its edge; crosses lobe borders and leaves the lung.'],['Anesthesia / recumbency atelectasis','mim-anesthesia','Down lung collapses — reposition or ventilate and repeat.'],['Pulmonary osteomas','mim-osteomas','Tiny, mineral, irregular, peripheral — visible even <5 mm.'],['End-on vessel','mim-endon','Perfectly round, same size as the vessel beside it, brighter than a nodule.'],['Nipple / skin nodule','mim-nipple','One margin sharper; outside the lung on the orthogonal view.']];
function cases(){return (window.VPQ_IMAGING_PUBLISH?.getCases?.()||[]).filter(c=>/^exam4-/.test(c.id)).sort((a,b)=>(a.exam4Order||0)-(b.exam4Order||0))}
function practice(answer){
 const list=cases().filter(c=>c.answer===answer&&['patterns','lung'].includes(c.exam4Section));
 if(!list.length)return;
 window.VPQ_RADIOLOGY_CASE_PLAYER?.open?.(list,0,{title:'Practice · '+answer,icon:'🫁',backLabel:'Lung pattern guide',onBack:()=>open(tab,back)});
}
function playIds(ids,i=0,title='Look-alikes',from='mimic'){
 const all=cases(),list=ids.map(id=>all.find(c=>c.id===id)).filter(Boolean);if(!list.length)return;
 window.VPQ_RADIOLOGY_CASE_PLAYER?.open?.(list,i,{title,icon:'🫁',backLabel:'Lung pattern guide',onBack:()=>open(from,back)});
}
const card=(h,b='#fff',bd='#e2dcef')=>'<div style="background:'+b+';border:1px solid '+bd+';border-radius:14px;padding:12px 14px;margin:0 0 12px">'+h+'</div>';
const img=(u,alt)=>'<a href="'+E(IMG(u))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(IMG(u))+'" alt="'+E(alt)+'" style="display:block;width:100%;max-height:380px;object-fit:contain;background:#1f2838;border-radius:10px"></a>';
function filmBox(k,f,i){
 const id=k+i,on=!!marked[id];
 return '<figure style="margin:0;background:#f7f8fc;border:1px solid #dfe4ef;border-radius:12px;padding:8px"><figcaption style="font-weight:800;font-size:12.5px;color:#344f78;margin:0 0 6px">'+E(f.t)+'</figcaption>'+img(on?f.m:f.u,f.t)+
  '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:6px"><button type="button" data-vpqlpg="mark-'+id+'" style="padding:6px 10px;border-radius:9px;font-weight:800">'+(on?'🙈 Unmarked film':'👉 Show me where')+'</button><small style="color:#5d6d84;flex:1;min-width:150px">'+(on?E(f.n):'Find it yourself first, then check the marked slide.')+'</small></div></figure>';
}
function patternPage(k){
 const p=P[k];
 const head='<div style="display:flex;gap:12px;align-items:center;background:'+p.bg+';border:2px solid '+p.color+';border-radius:16px;padding:12px 14px;margin:0 0 12px">'+p.icon+'<div><b style="font-size:17px;color:'+p.color+'">'+E(p.name)+'</b><p style="margin:4px 0 0;font-size:13px"><b>★ The tell:</b> '+E(p.tell)+'</p></div></div>';
 const looks=card('<b>👀 What it looks like</b><ul style="margin:6px 0 0;padding-left:18px">'+p.looks.map(x=>'<li style="margin:3px 0">'+E(x)+'</li>').join('')+'</ul>');
 const check=card('<b>✅ How to check for it</b> <small style="color:#7d6595">(study aid built from the slides)</small><ol style="margin:6px 0 0;padding-left:20px">'+p.check.map(x=>'<li style="margin:4px 0">'+E(x)+'</li>').join('')+'</ol><p style="margin:8px 0 0;background:#fff7e0;border-radius:9px;padding:7px 9px;font-size:12.5px"><b>⚠️ Trap:</b> '+E(p.trap)+'</p>','#fbfcff','#d9e2f2');
 const films='<b style="display:block;margin:4px 0 8px;color:#3b4b71">🩻 Practice spotting it — lecture films</b><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:10px;margin-bottom:12px">'+p.films.map((f,i)=>filmBox(k,f,i)).join('')+'</div>';
 const extra=p.extra.length?'<details style="margin:0 0 12px"><summary style="cursor:pointer;font-weight:800;color:#3b4b71">📑 Teaching slides ('+p.extra.length+')</summary><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:10px;margin-top:8px">'+p.extra.map(x=>'<figure style="margin:0"><figcaption style="font-size:12px;font-weight:700;margin-bottom:4px">'+E(x.t)+'</figcaption>'+img(x.u,x.t)+'</figure>').join('')+'</div></details>':'';
 const causes=card('<b>🧠 Common causes (Slide review table)</b><table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:12.5px">'+p.causes.map(r=>'<tr><td style="border-top:1px solid #ece7f4;padding:5px 6px;font-weight:700;width:42%">'+E(r[0])+'</td><td style="border-top:1px solid #ece7f4;padding:5px 6px">'+E(r[1])+'</td></tr>').join('')+'</table><p style="margin:6px 0 0;font-size:11.5px;color:#6b7a90">Slide: lists are not a complete compilation of differentials.</p><p style="margin:6px 0 0"><b>🧪 Sampling:</b> '+E(p.sample)+'</p>');
 const n=cases().filter(c=>c.answer===p.answer&&['patterns','lung'].includes(c.exam4Section)).length;
 return head+looks+check+films+extra+causes+(n?'<div class="buttonrow"><button type="button" data-vpqlpg="practice-'+k+'">🎯 Practice '+n+' '+E(p.name.toLowerCase().replace(/ \(.*\)/,''))+' films (multiple choice)</button></div>':'');
}
function howPage(){
 const step=(n,t,b,c)=>'<div style="display:flex;gap:10px;margin:0 0 10px"><div style="flex:0 0 34px;height:34px;border-radius:50%;background:'+c+';color:#fff;font-weight:900;display:flex;align-items:center;justify-content:center">'+n+'</div><div style="flex:1;background:#fff;border:1px solid #e2e7f1;border-radius:12px;padding:9px 11px"><b>'+t+'</b><div style="font-size:12.8px;margin-top:3px">'+b+'</div></div></div>';
 const jump=k=>'<button type="button" data-vpqlpg="tab-'+k+'" style="padding:3px 9px;border-radius:8px;font-size:12px;font-weight:800;margin:2px">'+E(TABS.find(t=>t[0]===k)[1])+' →</button>';
 return card('<b style="font-size:15px">Pick the pattern in 5 questions</b><p style="margin:4px 0 0;font-size:12.5px;color:#5d6d84">Study aid built from Dr. Griffin\'s L1–L2 pattern slides and the L8 approach slide ("Evaluate the radiographs — what is the most prominent pulmonary pattern and where is it located?").</p>','linear-gradient(120deg,#f4eaff,#eaf9f5)')+
  step(1,'Is the film good enough?','Peak inspiration? Exposed right? Straight (sternum over spine)? Fat or skin folds on top? If not, the "pattern" may be fake. '+jump('mimic'),'#7a6bd1')+
  step(2,'Can you see the vessels through the white?','<b>No</b> → alveolar. Prove it with an air bronchogram, a lobar sign or a border that disappears (heart/diaphragm). '+jump('alv'),'#b8476b')+
  step(3,'Vessels there but fuzzy, with a grey textured haze?','→ unstructured interstitial (rule out expiration and obesity first). '+jump('ui'),'#5a6bc2')+
  step(4,'Round soft-tissue dots ≥5 mm?','→ structured interstitial (nodules/masses). Not round or mineral, perfectly round on a vessel, or outside the lung → it\'s a mimic. '+jump('si'),'#2f8a5c')+
  step(5,'Airway walls (donuts/tramlines) far out, with the lung still aerated?','→ bronchial. '+jump('bronch'),'#c7791f')+
  card('<b>🏁 Then commit</b><ul style="margin:6px 0 0;padding-left:18px;font-size:12.8px"><li>Slide: patterns overlap and progress (interstitial → alveolar). Call the <b>most severe</b> pattern — alveolar hides the others. '+jump('mixed')+'</li><li>Slide: <b>where</b> is it? Focal / multifocal / diffuse; ventral vs dorsal; which lobe. Location drives the differential.</li><li>Slide: based on the radiographs, COMMIT to your primary differential — then list other plausible and unlikely-but-serious ones ("what must I NOT miss").</li></ul>','#f0f9f5','#cce4db')+
  '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:8px">'+['bronch','ui','si','alv'].map(k=>'<button type="button" data-vpqlpg="tab-'+k+'" style="display:flex;gap:8px;align-items:center;text-align:left;padding:8px;border-radius:12px;background:'+P[k].bg+';border:1px solid '+P[k].color+'">'+P[k].icon.replace(/width="56" height="56"/,'width="40" height="40"')+'<b style="font-size:12.5px;color:'+P[k].color+'">'+E(P[k].name.replace(/ \(.*\)/,''))+'</b></button>').join('')+'</div>';
}
function mixedPage(){
 return card('<b style="font-size:15px">🎨 Mixed patterns — which one wins?</b><ul style="margin:6px 0 0;padding-left:18px"><li>Slide: often the pattern is mixed, due to more advanced, progressed disease in some lung regions (cat in congestive heart failure). Professor: rare to get a single pattern.</li><li>Slide: interstitial is "not as severe as alveolar"; small amounts of alveolar material look interstitial.</li><li>Study aid: name the most severe pattern first, then mention the others ("alveolar AND bronchial", Case 9).</li></ul>','#fff')+
  '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:10px">'+
  [['Bronchial · interstitial · alveolar side by side (L2 slide 94)','_guide/L2-p094.jpg'],['CT: interstitial vs alveolar in one dog (L2 slide 91)','_guide/L2-p091.jpg'],['Cat in CHF: mixed (L2 slide 95)','_answer-keys/L2-p095.jpg']].map(x=>'<figure style="margin:0"><figcaption style="font-size:12px;font-weight:700;margin-bottom:4px">'+E(x[0])+'</figcaption>'+img(x[1],x[0])+'</figure>').join('')+'</div>'+
  '<div class="buttonrow" style="margin-top:10px"><button type="button" data-vpqlpg="practice-mixed">🎯 Practice the mixed-pattern films (2)</button></div>';
}
function mimicPage(){
 const all=cases();
 return card('<b style="font-size:15px">🎭 Look-alikes — rule these out before you call a pattern</b><p style="margin:4px 0 0;font-size:12.5px">Slides: L2 "Look-alikes for interstitial pattern", "Things that mimic pulmonary nodules", atelectasis. Tap a card to practice it.</p>')+
  '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:8px">'+MIMICS.map((m,i)=>{const c=all.find(x=>x.id==='exam4-'+m[1]);const u=c?.images?.[0]?.url;
   return '<button type="button" data-vpqlpg="mimic-'+i+'" style="text-align:left;background:#fff;border:1px solid #e2dcef;border-radius:12px;padding:8px">'+(u?'<img loading="lazy" src="'+E(u)+'" alt="" style="display:block;width:100%;height:120px;object-fit:cover;border-radius:8px;background:#1f2838">':'')+'<b style="display:block;margin-top:6px;color:#344f78">'+E(m[0])+'</b><small style="color:#5d6d84">'+E(m[2])+'</small></button>'}).join('')+'</div>';
}
function render(){
 const tabs='<div style="display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px">'+TABS.map(([k,l])=>'<button type="button" data-vpqlpg="tab-'+k+'" style="padding:7px 11px;border-radius:999px;font-weight:800;font-size:12.5px;'+(k===tab?'background:#3b4b71;color:#fff;border:1px solid #3b4b71':'background:#fff;border:1px solid #d8dfea;color:#3b4b71')+'">'+E(l)+'</button>').join('')+'</div>';
 const body=tab==='how'?howPage():tab==='mixed'?mixedPage():tab==='mimic'?mimicPage():patternPage(tab);
 api.showModal('🫁 Lung patterns · how to see and check them','<div style="font-size:13px;color:#354967;line-height:1.55"><div class="buttonrow" style="margin-bottom:10px"><button type="button" data-vpqlpg="back">← '+E(back?.backLabel||'Exam 4')+'</button><button type="button" data-vpqlpg="cases">▶ Exam 4 lung-pattern cases</button></div>'+tabs+body+
  '<p style="font-size:11px;color:#6b7a90;margin-top:12px">Films and slides: Dr. Lynn Griffin, LMU CVM 743, used with LMU permission for non-commercial study. "Slide" = lecture text; "Professor" = her in-class notes; "study aid" = a summary written for the game from those slides.</p></div>');
 try{api.body.scrollTop=0}catch(e){}
}
function open(t='how',o){tab=P[t]||['how','mixed','mimic'].includes(t)?t:'how';back=o||back;return (window.VPQ_IMAGING_PUBLISH?.load?.()||Promise.resolve()).then(render).catch(render)}
function init(ctx){
 api=ctx;if(api.body.__vpqLpgInit)return;api.body.__vpqLpgInit=true;
 api.body.addEventListener('click',e=>{
  const b=e.target.closest('[data-vpqlpg]');if(!b)return;e.preventDefault();const k=b.dataset.vpqlpg;
  if(k==='back')return back?.onBack?back.onBack():window.VPQ_RADIOLOGY_EXAM4?.open?.();
  if(k==='cases'){const l=cases().filter(c=>c.exam4Section==='patterns');return l.length&&window.VPQ_RADIOLOGY_CASE_PLAYER?.open?.(l,0,{title:'Exam 4 · Lung patterns',icon:'🫁',backLabel:'Lung pattern guide',onBack:()=>open(tab,back)})}
  if(k.startsWith('tab-')){tab=k.slice(4);return render()}
  if(k.startsWith('mark-')){const id=k.slice(5);marked[id]=!marked[id];return render()}
  if(k==='practice-mixed')return playIds(['exam4-pat-mixed-cat','exam4-case9-mainecoon'],0,'Mixed patterns','mixed');
  if(k.startsWith('practice-'))return practice(P[k.slice(9)].answer);
  if(k.startsWith('mimic-'))return playIds(MIMICS.map(m=>'exam4-'+m[1]),+k.slice(6));
 });
}
window.VPQ_LUNG_PATTERN_GUIDE=Object.freeze({init,open});
})();
