/* Vet Pharm Quest: walkable specialist clinic wings.
 * Treatment Ward = in-house diagnostics; Clinical Pathology = optional advanced lab.
 * Standalone original SVG backgrounds; existing games and save keys unchanged.
 */
window.VPQ_SPECIALIST_ROOMS=function(api){
'use strict';
const stage=document.getElementById('stage');if(!stage||!window.VPQ_SCENERY)return null;
window.VPQ_SURGERY_SKILLS_NAV=()=>api.doAction('skillsWing');
const previous=window.VPQ_SCENERY.roomArt.bind(window.VPQ_SCENERY);

/* Isolation patient selector reuses the authoritative in-game clinical case roster.
   No new case objects, disease assertions or medical advice are introduced. */
// The display can show either a clinical One Health case or an actual owned companion.
// This is a decorative learning-room patient choice, not a diagnosis for a purchased pet.

const isoChoiceKey='vpq-isolation-display-choice-v3';
const isoEscape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function isoOwnedCompanions(){
 const source=window.VPQ_ISOLATION_OWNED_COMPANIONS?.()||[],seen=new Set();
 return source.filter(p=>p&&p.id&&p.src&&p.name&&!seen.has(p.id)&&seen.add(p.id))
 .sort((a,b)=>String(a.species).localeCompare(String(b.species))||String(a.name).localeCompare(String(b.name)));
}
let isoChoice=(()=>{
 try{
  const raw=localStorage.getItem(isoChoiceKey);
  if(raw){const v=JSON.parse(raw);return v?.kind==='companion'&&typeof v.id==='string'?v:null}
  const v=JSON.parse(localStorage.getItem('vpq-isolation-display-choice-v2')||'null');
  return v?.kind==='companion'&&typeof v.id==='string'?v:null;
 }catch(e){return null}
})();
function isoCurrent(){return isoChoice?.kind==='companion'?isoOwnedCompanions().find(p=>p.id===isoChoice.id)||null:null}
function isoSaveChoice(id){
 isoChoice=id?{kind:'companion',id}:null;
 try{localStorage.setItem(isoChoiceKey,JSON.stringify(isoChoice))}catch(e){}
 const old=stage.querySelector('.vpqSpecArt');
 if(old&&stage.dataset.room==='isolation')old.outerHTML=scene('isolation');
}
function isoPatientArt(){
 const pet=isoCurrent();
 if(!pet)return '<g pointer-events="none" aria-label="Empty kennel awaiting an owned companion">'+
 '<rect x="130" y="259" width="158" height="41" rx="12" fill="#f7fffa" stroke="#9fc7c4" stroke-width="2" stroke-dasharray="6 4"/>'+
 '<text x="209" y="276" font-size="12" text-anchor="middle" font-weight="900" fill="#618d91">KENNEL EMPTY</text>'+
 '<text x="209" y="292" font-size="10" text-anchor="middle" fill="#6c979b">Choose an owned pet</text></g>';
 const name=isoEscape(String(pet.name).slice(0,21));
 return '<g pointer-events="none" aria-label="Purchased companion '+name+'">'+
 '<ellipse cx="207" cy="324" rx="72" ry="9" fill="#629a9c" opacity=".16"/>'+
 '<image href="'+isoEscape(pet.src)+'" x="123" y="206" width="169" height="132" preserveAspectRatio="xMidYMax meet"/>'+
 '<rect x="125" y="340" width="164" height="18" rx="8" fill="#fffaf4" stroke="#98b9b8" stroke-width="2"/>'+
 '<text x="207" y="353" text-anchor="middle" font-size="11" font-weight="900" fill="#537f84">'+name+'</text>'+
 '<rect x="134" y="195" width="147" height="19" rx="8" fill="#f6eafa" stroke="#9fb9c7" stroke-width="1.4"/>'+
 '<text x="207" y="208" text-anchor="middle" font-size="9" font-weight="900" fill="#577687">PURCHASED COMPANION</text></g>';
}
function isoPatientSelector(){
 const owned=isoOwnedCompanions(),current=isoCurrent();
 const opts=owned.map(p=>'<option value="'+isoEscape(p.id)+'"'+(current?.id===p.id?' selected':'')+'>'+isoEscape(p.name+' · '+p.species)+'</option>').join('');
 api.showModal('🐾 Place a purchased companion',
 '<p>Choose a pet from <b>your purchased or unlocked companion collection</b>. The kennel starts empty. Clinical cases remain in the separate One Health activity; placing a pet does not imply infection.</p>'+
 '<label for="vpqIsoOwnedChoice" style="display:block;font-weight:900">Owned companion</label>'+
 '<select id="vpqIsoOwnedChoice" style="width:100%;padding:10px;border:1px solid #c2b5d5;border-radius:10px"><option value="">Empty kennel / no animal</option>'+opts+'</select>'+
 (!owned.length?'<p class="tiny">No owned companions with ready artwork yet. Visit the Companion Collection to unlock pets.</p>':'')+
 '<div id="vpqIsoPreview" aria-live="polite" style="margin:12px 0;padding:12px;border:1px solid #cfdbde;border-radius:14px;background:#f6fafb;display:flex;align-items:center;gap:14px;min-height:95px"></div>'+
 '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="vpqIsoCaseApply">Save kennel pet</button><button type="button" id="vpqIsoClear">Clear kennel</button></div>'+
 '<p class="tiny">Display only. Does not modify companion purchases, followers, or clinical case progress. Selection currently saves on this device.</p>');
 const select=document.getElementById('vpqIsoOwnedChoice'),preview=document.getElementById('vpqIsoPreview');if(!select||!preview)return;
 const render=()=>{const pet=owned.find(p=>p.id===select.value);
  preview.innerHTML=pet?'<img src="'+isoEscape(pet.src)+'" alt="'+isoEscape(pet.name)+' companion preview" style="width:106px;height:102px;object-fit:contain;flex-shrink:0"/><div><b>'+isoEscape(pet.name)+'</b><div style="font-size:12px;margin-top:6px;color:#627d89">Purchased / unlocked · '+isoEscape(pet.species)+'</div></div>':
  '<span style="font-size:13px;color:#69838a">No companion selected — kennel will remain empty.</span>';
 };
 select.addEventListener('change',render);render();
 document.getElementById('vpqIsoCaseApply')?.addEventListener('click',()=>{isoSaveChoice(select.value);isoPatientSelector()});
 document.getElementById('vpqIsoClear')?.addEventListener('click',()=>{isoSaveChoice('');isoPatientSelector()});
}
function isoSpecimenIntro(){
 // Educational workflow only. No species/pathogen-specific testing claims and no simulated real lab handling.
 const info={
  specimen:['1. Clinical question & specimen','Start with the suspected syndrome, appropriate specimen site, collection timing and transport requirements. Identify the patient and prevent cross-contamination.','Before choosing a test, what is the clinical question and which specimen could answer it?'],
  method:['2. Choose an appropriate test','PCR detects selected nucleic-acid targets, culture seeks viable organisms, and serology typically evaluates an immune response. Each has limitations depending on the pathogen, sample, timing and method.','Would this test detect an organism, its genetic material, or the host response?'],
  interpretation:['3. Interpret and communicate','Consider sensitivity, specificity, specimen quality, pretest likelihood, exposure history, and possible false results. Compare with the clinical picture and reportable-disease requirements.','What does a positive or negative result mean in this patient?'],
  safety:['4. Biosafety and reporting','Assess pathogen-specific risks, specimen containment and transport, staff protection, decontamination and whether local or federal reporting applies. Use approved protocols and trained supervision.','Who must be notified, and which biosafety restrictions apply?']
 };
 api.showModal('🧪 One Health · Diagnostic Workflow',
 '<p>Practice the <b>reasoning behind specimen testing</b>. This is an educational BSL-inspired area, not a real laboratory operating protocol.</p>'+
 '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:12px 0">'+
 Object.entries(info).map(([key,v])=>'<button type="button" data-vpqisostep="'+key+'" style="font-size:12px">'+v[0]+'</button>').join('')+'</div>'+
 '<section id="vpqIsoDiagnosticStep" aria-live="polite" style="padding:14px;border:1px solid #abc9cb;border-radius:13px;background:#f1faf8;line-height:1.55"></section>'+
 '<p class="tiny">For clinical case-specific questions, use the existing Disease Library or One Health case station. This room does not validate equipment operation, containment level, or actual test orders.</p>');
 const panel=document.getElementById('vpqIsoDiagnosticStep');
 const show=key=>{const item=info[key];if(!item||!panel)return;
  panel.innerHTML='<b>'+item[0]+'</b><p>'+item[1]+'</p><div style="padding:10px;background:white;border-left:4px solid #8eb9bd;border-radius:7px"><b>Think about:</b> '+item[2]+'</div>';
 };
 document.querySelectorAll('[data-vpqisostep]').forEach(button=>button.addEventListener('click',()=>show(button.dataset.vpqisostep)));
 show('specimen');
}

const data={
 clinpath:[
  {x:1.2,y:31,w:15.8,h:40,walk:9,label:'🩸 Coagulation Bench',subtitle:'Questions + interpretation',hint:'Practice PT / aPTT interpretation questions',kind:'practice',action:'advancedCoag'},
  {x:17.6,y:31,w:15.8,h:40,walk:25,label:'🫧 Blood Gas Station',subtitle:'Acid–base practice',hint:'Practice blood gas and acid–base interpretation',kind:'practice',action:'advancedGas'},
  {x:34,y:31,w:15.8,h:40,walk:41,label:'🧫 Urinalysis Bench',subtitle:'UA questions + sediment',hint:'Choose urinalysis questions or visual sediment references',kind:'practice',action:'advancedUrine'},
  {x:50.4,y:31,w:15.8,h:40,walk:58,label:'🩸 CBC + Chemistry',subtitle:'Learn → test → practice',hint:'Start with CBC/chemistry, PCV/TS, rapid testing and send-out interpretive lessons',kind:'practice',action:'advancedHybrid'},
  {x:66.8,y:31,w:15.8,h:40,walk:74,label:'🐾 Referral Cases',subtitle:'Workup questions',hint:'Open patient differential and ancillary testing cases',kind:'practice',action:'advancedCases'},
  {x:83.2,y:31,w:15.6,h:40,walk:91,label:'🔬 Microscopy Lab',subtitle:'Image ID + smear quizzes',hint:'Open blood smear image-identification questions',kind:'practice',action:'vpqClassicSmear'}
 ],
 isolation:[
  {x:8,y:37,w:29,h:36,walk:23,label:'🐾 Place Companion',action:'vpqIsoChooseCompanion'},
  {x:40,y:37,w:28,h:36,walk:52,label:'📚 Disease Library',action:'ohLibrary'},
  {x:71,y:37,w:21,h:36,walk:81,label:'🛡️ Public Health',action:'ohHub'}
 ],
 necropsy:[
  {x:3,y:25,w:20,h:45,walk:14,label:'🦴 Specimen Cabinet',subtitle:'Identify gross lesions',hint:'Gross pathology: recognize the organ, describe the lesion and practice gross diagnoses',action:'necroGross'},
  {x:25,y:27,w:16,h:44,walk:33,label:'📚 Handbook Shelf',subtitle:'Necropsy Handbook · General Pathology',hint:'Learn First: the Necropsy Handbook (Exam 7 lectures) and General Pathology (Exams 1–2)',action:'necroShelf'},
  {x:42,y:30,w:16,h:42,walk:50,label:'📋 Diagnosis Board',subtitle:'Write a morphologic DX',hint:'Morphologic diagnosis: organ, distribution, process and severity',action:'necroDx'},
  {x:59,y:31,w:17,h:42,walk:68,label:'🔬 Microscope',subtitle:'Histology & WHY',hint:'Histology atlas: microscopic features, tissue changes and pathogenesis',action:'necroHisto'},
  {x:78,y:25,w:19,h:44,walk:82,label:'🐾 Case Board',subtitle:'Apply clinical findings',hint:'Patient cases: combine gross lesions, clinical findings and diagnostic reasoning',action:'necroCases'},
  {x:4,y:72,w:20,h:22,walk:13,label:'🧪 Specimen Prep',subtitle:'Collection & handling',hint:'What to collect, when, sample selection, fixation, storage and submission',action:'necroSpecPrep'},
  {x:79,y:71,w:18,h:23,walk:93,label:'🧼 Boot Wash & PPE',subtitle:'Biosecurity & sampling',hint:'Biosecurity: PPE, cleaning and specimen handling',action:'necroBio'}
 ],
 skills:[
  {x:7,y:39,w:26,h:41,walk:19,label:'💉 Injection Practice',action:'injectionPractice'},
  {x:36,y:39,w:27,h:41,walk:50,label:'🩸 Blood Draw',action:'venipuncturePractice'},
  {x:70,y:39,w:24,h:41,walk:82,label:'🧪 Sample Handling',action:'diagnosticSkills'}
 ],
 surgery:[
  {x:2,y:40,w:19,h:39,walk:11,label:'🧽 Sterile Prep',action:'surgPrep'},
  {x:21,y:40,w:19,h:39,walk:30,label:'💗 Anesthesia',action:'surgMonitor'},
  {x:40,y:40,w:20,h:39,walk:50,label:'🪡 Spay Simulation',action:'surgSim'},
  {x:60,y:40,w:19,h:39,walk:69,label:'🛏️ Recovery Ward',action:'surgRecovery'},
  {x:79,y:40,w:19,h:39,walk:89,label:'🐾 Patient Cases',action:'surgCases'}
 ]

};
const rect=(x,y,w,h,fill,stroke='#a4b7c9')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="13" fill="'+fill+'" stroke="'+stroke+'" stroke-width="5"/>';
function isolationScene(){const art="<svg class=\"vpqSpecArt\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 500\" preserveAspectRatio=\"none\" role=\"img\" aria-label=\"One Health veterinary isolation ward, diagnostic specimen lab and public health station\">\n<defs>\n<linearGradient id=\"ohCeiling\" x2=\"0\" y2=\"1\"><stop stop-color=\"#bdd8eb\"/><stop offset=\"1\" stop-color=\"#e6eef4\"/></linearGradient>\n<linearGradient id=\"ohWall\" x2=\"0\" y2=\"1\"><stop stop-color=\"#eef9fa\"/><stop offset=\"1\" stop-color=\"#d3e9e7\"/></linearGradient>\n<linearGradient id=\"ohFloor\" x2=\"0\" y2=\"1\"><stop stop-color=\"#d8e3ef\"/><stop offset=\"1\" stop-color=\"#aaaecb\"/></linearGradient>\n<linearGradient id=\"ohSteel\" x2=\"0\" y2=\"1\"><stop stop-color=\"#f5ffff\"/><stop offset=\".55\" stop-color=\"#bad5d8\"/><stop offset=\"1\" stop-color=\"#8bb4bf\"/></linearGradient>\n<linearGradient id=\"ohGlass\" x2=\"0\" y2=\"1\"><stop stop-color=\"#e5ffff\" stop-opacity=\".9\"/><stop offset=\".7\" stop-color=\"#a7d3df\" stop-opacity=\".28\"/><stop offset=\"1\" stop-color=\"#d8edff\" stop-opacity=\".45\"/></linearGradient>\n<linearGradient id=\"ohMonitor\" x2=\"0\" y2=\"1\"><stop stop-color=\"#365e82\"/><stop offset=\"1\" stop-color=\"#1e3653\"/></linearGradient>\n<filter id=\"ohShadow\" x=\"-30%\" y=\"-30%\" width=\"170%\" height=\"180%\"><feDropShadow dx=\"2\" dy=\"4\" stdDeviation=\"4\" flood-color=\"#52718a\" flood-opacity=\".25\"/></filter>\n<pattern id=\"ohTiles\" width=\"62\" height=\"46\" patternUnits=\"userSpaceOnUse\"><path d=\"M0 0H62V46\" fill=\"none\" stroke=\"#fcffff\" stroke-opacity=\".35\" stroke-width=\"2\"/></pattern>\n</defs>\n<!-- PHASE A / Option 1 approved: fixed architectural shell, no changes to patient or hotspots -->\n<rect width=\"1000\" height=\"500\" fill=\"#d5e6f3\"/>\n<!-- cool violet-blue coffered ceiling with warm recessed panels -->\n<path d=\"M0 0H1000L930 68H70Z\" fill=\"#b6c8e9\"/>\n<path d=\"M0 0H1000L930 68H70Z\" fill=\"url(#ohCeiling)\" opacity=\".54\"/>\n<path d=\"M0 0L70 68V347L0 415Z\" fill=\"#acbedb\"/>\n<path d=\"M1000 0L930 68V347L1000 415Z\" fill=\"#a5bad8\"/>\n<rect x=\"70\" y=\"68\" width=\"860\" height=\"280\" fill=\"#e1f0f7\"/>\n<rect x=\"70\" y=\"68\" width=\"860\" height=\"278\" fill=\"url(#ohWall)\" opacity=\".36\"/>\n<path d=\"M70 346H930L1000 500H0Z\" fill=\"#bfc6e2\"/>\n<path d=\"M70 346H930L1000 500H0Z\" fill=\"url(#ohFloor)\" opacity=\".39\"/>\n<!-- perspective ceramic floor tiles: soft blue/lilac, clear navigation foreground -->\n<path d=\"M70 346L0 500M930 346L1000 500M305 346L248 500M510 346V500M717 346L762 500M20 430H980M43 390H959M0 468H1000\" fill=\"none\" stroke=\"#f8fcff\" stroke-width=\"2.7\" opacity=\".88\"/>\n<path d=\"M0 0H1000L930 68H70Z\" fill=\"url(#ohTiles)\" opacity=\".32\"/>\n<path d=\"M70 84H930M70 343H930\" stroke=\"#85a9c4\" stroke-width=\"6\"/>\n<path d=\"M70 90H930\" stroke=\"#ffffff\" stroke-width=\"2\" opacity=\".68\"/>\n<path d=\"M70 345H930\" stroke=\"#f6fbff\" stroke-width=\"2\" opacity=\".7\"/>\n<!-- architectural room bays remain at existing isolation/lab/public health coordinates -->\n<g aria-label=\"Three fixed clinical bays, observation glazing and ceiling service rail\">\n<rect x=\"70\" y=\"90\" width=\"332\" height=\"261\" fill=\"#e8f2fd\" opacity=\".36\"/>\n<rect x=\"408\" y=\"90\" width=\"291\" height=\"261\" fill=\"#e4f3fb\" opacity=\".30\"/>\n<rect x=\"705\" y=\"90\" width=\"225\" height=\"261\" fill=\"#eaf0fa\" opacity=\".32\"/>\n<path d=\"M404 92v271M702 92v271\" stroke=\"#779cbb\" stroke-width=\"12\" opacity=\".32\"/>\n<path d=\"M406 92v271M700 92v271\" stroke=\"#f7ffff\" stroke-width=\"3\" opacity=\".72\"/>\n<path d=\"M70 150H930\" stroke=\"#91afc7\" stroke-width=\"7\" opacity=\".72\"/>\n<path d=\"M70 157H930\" stroke=\"#f9ffff\" stroke-width=\"3\" opacity=\".7\"/>\n<rect x=\"72\" y=\"147\" width=\"325\" height=\"7\" rx=\"3\" fill=\"#c997c9\"/>\n<rect x=\"412\" y=\"147\" width=\"280\" height=\"7\" rx=\"3\" fill=\"#7faed5\"/>\n<rect x=\"710\" y=\"147\" width=\"219\" height=\"7\" rx=\"3\" fill=\"#82c8b1\"/>\n<path d=\"M78 352H395M413 352H693M705 352H928\" stroke=\"#6899b2\" stroke-width=\"9\" opacity=\".33\"/>\n<path d=\"M78 358H395M413 358H693M705 358H928\" stroke=\"#f5ffff\" stroke-width=\"3\" opacity=\".9\"/>\n</g>\n<!-- soft ceiling coves and realistic warm lights, not new interactive elements -->\n<g fill=\"#fff9e7\" stroke=\"#fff\" stroke-width=\"4\" filter=\"url(#ohShadow)\">\n<ellipse cx=\"169\" cy=\"37\" rx=\"34\" ry=\"11\"/><ellipse cx=\"390\" cy=\"37\" rx=\"34\" ry=\"11\"/>\n<ellipse cx=\"630\" cy=\"37\" rx=\"34\" ry=\"11\"/><ellipse cx=\"848\" cy=\"37\" rx=\"34\" ry=\"11\"/>\n</g>\n<g stroke=\"#d4e7f4\" stroke-width=\"2\" opacity=\".75\">\n<path d=\"M72 68L0 0M930 68l70-68M230 0l-20 68M485 0v68M765 0l20 68\"/>\n</g>\n<!-- clean fixed built-in baseboard details without extra labels or false interaction zones -->\n<g aria-label=\"Cleanable built-in finishes\" pointer-events=\"none\">\n<path d=\"M80 375h310M417 375h276M710 375h211\" fill=\"none\" stroke=\"#fcffff\" stroke-width=\"5\" opacity=\".64\"/>\n<path d=\"M82 383h308M418 383h275M710 383h211\" fill=\"none\" stroke=\"#91b5c8\" stroke-width=\"2\" opacity=\".5\"/>\n</g>\n<!-- PHASE G: calm clinical finish, recessed service-light details and grounded furniture -->\n<g aria-label=\"Fixed architectural accent lighting and hygienic room finishes\" pointer-events=\"none\">\n<path d=\"M76 95h840\" stroke=\"#f7ffff\" stroke-width=\"3\" opacity=\".72\"/>\n<path d=\"M84 143h306M418 143h272M716 143h210\" stroke=\"#d9e3fc\" stroke-width=\"4\" opacity=\".6\"/>\n<path d=\"M83 156h306M418 156h272M716 156h210\" stroke=\"#ffffff\" stroke-width=\"2\" opacity=\".5\"/>\n<path d=\"M74 351h322M411 351h282M706 351h228\" stroke=\"#658ea9\" stroke-width=\"3\" opacity=\".28\"/>\n<path d=\"M70 385H930\" stroke=\"#ffffff\" stroke-width=\"2\" opacity=\".44\"/>\n</g>\n<!-- PHASE B: glass veterinary isolation suite: secure, clean and welcoming -->\n<!-- PHASE H2: deeper glass-fronted isolation suite with soft clinical furnishing and no cage bars -->\n<g aria-label=\"Isolation suite inset depth and comfortable washable furnishings\" pointer-events=\"none\">\n<!-- existing isolation shell retained; rear wall inset and subtle perspective corner -->\n<path d=\"M91 194h281v148H91Z\" fill=\"#d7edf4\" opacity=\".38\"/>\n<path d=\"M91 194l13-12h256l12 12\" fill=\"#effaff\" opacity=\".6\"/>\n<path d=\"M91 194v148l12-14V203Z\" fill=\"#8db6c7\" opacity=\".18\"/>\n<path d=\"M372 194v148l-12-14V203Z\" fill=\"#759cb9\" opacity=\".16\"/>\n<!-- shadow beneath the raised bed and warm task lighting; works with empty or selected pet -->\n<ellipse cx=\"206\" cy=\"345\" rx=\"108\" ry=\"11\" fill=\"#426f8e\" opacity=\".14\"/>\n<path d=\"M164 193h112\" stroke=\"#fff0b9\" stroke-width=\"6\" stroke-linecap=\"round\" opacity=\".7\"/>\n</g>\n\n<g aria-label=\"Spacious glass-fronted veterinary isolation suite\">\n<rect x=\"70\" y=\"163\" width=\"329\" height=\"217\" rx=\"26\" fill=\"#e0eff7\" stroke=\"#719bb5\" stroke-width=\"8\"/>\n<rect x=\"80\" y=\"175\" width=\"309\" height=\"184\" rx=\"17\" fill=\"#d0e8f2\" stroke=\"#bdd9e7\" stroke-width=\"3\"/>\n<path d=\"M86 284h297v72H86Z\" fill=\"#c8dee9\"/>\n<path d=\"M88 308h293\" stroke=\"#f5fcff\" stroke-width=\"3\"/>\n<rect x=\"118\" y=\"306\" width=\"187\" height=\"39\" rx=\"14\" fill=\"#7faccc\" stroke=\"#648eae\" stroke-width=\"3\"/>\n<rect x=\"125\" y=\"309\" width=\"172\" height=\"28\" rx=\"12\" fill=\"#e0f0ff\" stroke=\"#aad0e5\" stroke-width=\"2\"/>\n<path d=\"M138 318h146\" stroke=\"#ffffff\" stroke-width=\"3\" opacity=\".8\"/>\n<path d=\"M139 339v10m149-10v10\" stroke=\"#6f9bad\" stroke-width=\"7\" stroke-linecap=\"round\"/>\n<ellipse cx=\"344\" cy=\"340\" rx=\"24\" ry=\"7\" fill=\"#6298a4\" opacity=\".22\"/>\n<path d=\"M322 326h44l-7 17h-30Z\" fill=\"#a0c8d6\" stroke=\"#719ba9\" stroke-width=\"2.5\"/>\n<ellipse cx=\"344\" cy=\"326\" rx=\"22\" ry=\"6\" fill=\"#f3ffff\" stroke=\"#85acbf\" stroke-width=\"2\"/>\n<ellipse cx=\"344\" cy=\"326\" rx=\"13\" ry=\"3\" fill=\"#7ac8d8\"/>\n<rect x=\"102\" y=\"193\" width=\"53\" height=\"26\" rx=\"5\" fill=\"#e1edf5\" stroke=\"#9bbac8\" stroke-width=\"2\"/>\n<path d=\"M111 200h35m-35 6h35m-35 6h35\" stroke=\"#88aab9\" stroke-width=\"2\"/>\n<rect x=\"311\" y=\"202\" width=\"60\" height=\"49\" rx=\"7\" fill=\"#e6f1f8\" stroke=\"#86aabe\" stroke-width=\"3\"/>\n<rect x=\"318\" y=\"209\" width=\"46\" height=\"28\" rx=\"4\" fill=\"#346d88\"/>\n<path d=\"M320 225h8l5-10 7 17 6-11 5 4h10\" stroke=\"#9ef4c4\" stroke-width=\"2.5\" fill=\"none\"/>\n<circle cx=\"342\" cy=\"243\" r=\"2.5\" fill=\"#8bc1b6\"/>\n<rect x=\"161\" y=\"183\" width=\"116\" height=\"9\" rx=\"4\" fill=\"#fff9df\" stroke=\"#deebf0\" stroke-width=\"2\"/>\n<!-- soft bed top seam and a clean chart holder, intentionally behind patient art -->\n<path d=\"M131 310q76 -9 159 0\" fill=\"none\" stroke=\"#f6ffff\" stroke-width=\"2.5\" opacity=\".55\"/>\n<rect x=\"111\" y=\"228\" width=\"26\" height=\"35\" rx=\"5\" fill=\"#eff9fc\" stroke=\"#9ab6ca\" stroke-width=\"2\"/>\n<path d=\"M117 239h14m-14 6h14m-14 6h9\" stroke=\"#9ebbc9\" stroke-width=\"1.8\"/>\n__PATIENT__\n<!-- broad observation glazing, discreet frame and flush door, no bars -->\n<rect x=\"82\" y=\"177\" width=\"305\" height=\"181\" rx=\"16\" fill=\"#b9e3f3\" fill-opacity=\".08\" stroke=\"#6c93ac\" stroke-width=\"6\" pointer-events=\"none\"/>\n<path d=\"M245 178v178\" stroke=\"#a4bdcb\" stroke-width=\"4\" opacity=\".46\" pointer-events=\"none\"/>\n<path d=\"M252 180v175\" stroke=\"#ffffff\" stroke-width=\"1.5\" opacity=\".65\" pointer-events=\"none\"/>\n<path d=\"M102 184h62l-66 102Z\" fill=\"#ffffff\" opacity=\".13\" pointer-events=\"none\"/>\n<path d=\"M330 184h39l-45 78Z\" fill=\"#ffffff\" opacity=\".12\" pointer-events=\"none\"/>\n<rect x=\"372\" y=\"255\" width=\"8\" height=\"31\" rx=\"4\" fill=\"#7097ab\" stroke=\"#dceef3\" stroke-width=\"1.5\"/>\n<rect x=\"136\" y=\"145\" width=\"202\" height=\"31\" rx=\"15\" fill=\"#fcf6ff\" stroke=\"#a48dbc\" stroke-width=\"3\"/>\n<text x=\"237\" y=\"165\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"900\" fill=\"#655b91\">ISOLATION SUITE</text>\n<rect x=\"73\" y=\"361\" width=\"324\" height=\"16\" rx=\"7\" fill=\"#9ebfd1\" stroke=\"#729fb8\" stroke-width=\"2\"/>\n<path d=\"M84 365h301\" stroke=\"#f8ffff\" stroke-width=\"2\" opacity=\".7\"/>\n</g>\n<!-- practical PPE/handwash at ward boundary -->\n<g filter=\"url(#ohShadow)\">\n<rect x=\"9\" y=\"182\" width=\"54\" height=\"168\" rx=\"8\" fill=\"#effaf7\" stroke=\"#88b6b5\" stroke-width=\"4\"/>\n<text x=\"36\" y=\"201\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"900\" fill=\"#4e8582\">PPE</text>\n<g fill=\"#faffff\" stroke=\"#b4cece\" stroke-width=\"1.5\"><rect x=\"15\" y=\"209\" width=\"42\" height=\"31\" rx=\"5\"/><rect x=\"15\" y=\"246\" width=\"42\" height=\"31\" rx=\"5\"/><rect x=\"15\" y=\"283\" width=\"42\" height=\"31\" rx=\"5\"/></g>\n<path d=\"M23 220l8-6h10l9 6-5 15H28Z\" fill=\"#b4daea\" stroke=\"#7aabb9\" stroke-width=\"2\"/>\n<text x=\"35\" y=\"265\" text-anchor=\"middle\" font-size=\"18\">🧤</text><text x=\"35\" y=\"302\" text-anchor=\"middle\" font-size=\"18\">😷</text>\n<rect x=\"365\" y=\"265\" width=\"37\" height=\"76\" rx=\"7\" fill=\"#def0ef\" stroke=\"#7db3b9\" stroke-width=\"4\"/>\n<path d=\"M371 288q12 12 25 0l-5 28q-9 12-16 0Z\" fill=\"#fff\" stroke=\"#94bfc7\" stroke-width=\"2\"/>\n<path d=\"M384 286v-15q0-8 10-8\" fill=\"none\" stroke=\"#82aeb8\" stroke-width=\"5\"/>\n<rect x=\"364\" y=\"249\" width=\"13\" height=\"19\" rx=\"3\" fill=\"#adceca\"/>\n<text x=\"384\" y=\"354\" text-anchor=\"middle\" font-size=\"9\" font-weight=\"900\" fill=\"#628b8b\">WASH</text>\n</g>\n<!-- PHASE C: enhanced fixed diagnostic bay and specimen-transport trolley; no clickable controls baked into artwork -->\n<g aria-label=\"One Health diagnostics bay with enclosed biosafety workstation, sample racks and PCR analyser\" pointer-events=\"none\">\n<!-- built-in cabinetry and deep worktop, existing laboratory footprint x=418..682 -->\n<rect x=\"416\" y=\"161\" width=\"267\" height=\"205\" rx=\"15\" fill=\"#cde4ed\" stroke=\"#80a7ba\" stroke-width=\"6\"/>\n<rect x=\"424\" y=\"321\" width=\"248\" height=\"42\" rx=\"6\" fill=\"#e3edf5\" stroke=\"#90b5c6\" stroke-width=\"3\"/>\n<path d=\"M437 327v31m49-31v31m48-31v31m50-31v31m45-31v31\" stroke=\"#acc8d7\" stroke-width=\"3\"/>\n<g stroke=\"#7b9eae\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M447 342h27m22 0h26m23 0h26m25 0h23m20 0h21\"/></g>\n<path d=\"M421 317h259l-8 12H430Z\" fill=\"#9cc0d0\" stroke=\"#719bad\" stroke-width=\"2\"/>\n<path d=\"M428 317h244\" stroke=\"#f8ffff\" stroke-width=\"4\"/>\n<!-- task light and softly lit backsplash -->\n<rect x=\"434\" y=\"173\" width=\"155\" height=\"11\" rx=\"4\" fill=\"#9ebdcc\"/>\n<rect x=\"449\" y=\"180\" width=\"117\" height=\"6\" rx=\"3\" fill=\"#fff1c3\" opacity=\".9\"/>\n<!-- tall biosafety cabinet (illustration of enclosure, not a biosafety certification) -->\n<path d=\"M442 189h119l10 15v105H431V204Z\" fill=\"url(#ohSteel)\" stroke=\"#719dab\" stroke-width=\"5\"/>\n<rect x=\"443\" y=\"204\" width=\"116\" height=\"82\" rx=\"5\" fill=\"#cce7ef\" stroke=\"#92bac8\" stroke-width=\"3\"/>\n<rect x=\"449\" y=\"213\" width=\"104\" height=\"66\" rx=\"3\" fill=\"#e9f8fa\" fill-opacity=\".85\" stroke=\"#c2e5ec\" stroke-width=\"2\"/>\n<path d=\"M446 224h111\" stroke=\"#ffffff\" stroke-width=\"3\" opacity=\".8\"/>\n<path d=\"M450 212l31 0-36 63Z\" fill=\"#ffffff\" opacity=\".23\"/>\n<path d=\"M453 282h97\" stroke=\"#789ba7\" stroke-width=\"5\"/>\n<!-- attached pipettes inside cabinet -->\n<g stroke=\"#648da2\" stroke-width=\"2.5\" fill=\"#d4e7f1\">\n<rect x=\"467\" y=\"218\" width=\"8\" height=\"40\" rx=\"3\"/>\n<rect x=\"483\" y=\"218\" width=\"8\" height=\"40\" rx=\"3\"/>\n<rect x=\"499\" y=\"218\" width=\"8\" height=\"40\" rx=\"3\"/>\n</g>\n<g fill=\"#7eaac1\"><rect x=\"466\" y=\"220\" width=\"10\" height=\"7\" rx=\"2\"/><rect x=\"482\" y=\"220\" width=\"10\" height=\"7\" rx=\"2\"/><rect x=\"498\" y=\"220\" width=\"10\" height=\"7\" rx=\"2\"/></g>\n<!-- secure capped sample tubes in compact racks -->\n<rect x=\"454\" y=\"272\" width=\"95\" height=\"10\" rx=\"3\" fill=\"#7ca8bc\"/>\n<g stroke=\"#8caab7\" stroke-width=\"1.5\">\n<path d=\"M462 251v20h9v-20Z\" fill=\"#dff5fd\"/>\n<path d=\"M477 251v20h9v-20Z\" fill=\"#e6f0fd\"/>\n<path d=\"M492 251v20h9v-20Z\" fill=\"#e9f5ff\"/>\n<path d=\"M507 251v20h9v-20Z\" fill=\"#f3edff\"/>\n<path d=\"M522 251v20h9v-20Z\" fill=\"#e2f6f4\"/>\n</g>\n<g fill=\"#db7787\"><rect x=\"461\" y=\"247\" width=\"11\" height=\"5\" rx=\"2\"/><rect x=\"476\" y=\"247\" width=\"11\" height=\"5\" rx=\"2\"/><rect x=\"491\" y=\"247\" width=\"11\" height=\"5\" rx=\"2\"/></g>\n<g fill=\"#6998d4\"><rect x=\"506\" y=\"247\" width=\"11\" height=\"5\" rx=\"2\"/><rect x=\"521\" y=\"247\" width=\"11\" height=\"5\" rx=\"2\"/></g>\n<!-- small slide/sample tray -->\n<rect x=\"452\" y=\"295\" width=\"104\" height=\"17\" rx=\"5\" fill=\"#ddeef5\" stroke=\"#88adbe\" stroke-width=\"2\"/>\n<path d=\"M462 302h26m5 0h18m6 0h21\" stroke=\"#9bc7d4\" stroke-width=\"3\"/>\n<!-- PCR instrument with recognizable display and clear readable label -->\n<rect x=\"575\" y=\"199\" width=\"91\" height=\"113\" rx=\"12\" fill=\"#eaf3f9\" stroke=\"#81aabf\" stroke-width=\"4\"/>\n<rect x=\"584\" y=\"211\" width=\"73\" height=\"51\" rx=\"7\" fill=\"#386f94\" stroke=\"#9ec1d0\" stroke-width=\"3\"/>\n<path d=\"M593 237h12l5-12 7 22 9-17 7 8h12\" fill=\"none\" stroke=\"#9ce9d0\" stroke-width=\"3\"/>\n<text x=\"620\" y=\"285\" font-size=\"17\" font-weight=\"900\" fill=\"#416c91\" text-anchor=\"middle\">PCR</text>\n<path d=\"M594 298h53\" stroke=\"#9bbbc9\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n<circle cx=\"590\" cy=\"297\" r=\"3\" fill=\"#8fceb0\"/>\n<!-- contained small sample storage cubbies, no additional overlay captions -->\n<rect x=\"594\" y=\"170\" width=\"72\" height=\"23\" rx=\"5\" fill=\"#d9eaf3\" stroke=\"#94b6c8\" stroke-width=\"2\"/>\n<rect x=\"600\" y=\"175\" width=\"17\" height=\"14\" rx=\"3\" fill=\"#9ac5e8\"/>\n<rect x=\"621\" y=\"175\" width=\"17\" height=\"14\" rx=\"3\" fill=\"#cfade7\"/>\n<rect x=\"642\" y=\"175\" width=\"17\" height=\"14\" rx=\"3\" fill=\"#9ed6d4\"/>\n<!-- distinct readable top label -->\n<rect x=\"440\" y=\"145\" width=\"212\" height=\"30\" rx=\"14\" fill=\"#fff8fd\" stroke=\"#a68ec6\" stroke-width=\"3\"/>\n<text x=\"546\" y=\"165\" text-anchor=\"middle\" font-size=\"13.5\" font-weight=\"900\" fill=\"#63538f\">DIAGNOSTICS &amp; TESTING</text>\n</g>\n<!-- dedicated rolling, sealed-specimen transport cart: below bench, does not block controls -->\n<g aria-label=\"Specimen transport trolley with sealed containers\" pointer-events=\"none\">\n<path d=\"M466 368v43m174-43v43M466 369h174\" fill=\"none\" stroke=\"#6494ae\" stroke-width=\"6\" stroke-linecap=\"round\"/>\n<rect x=\"475\" y=\"373\" width=\"159\" height=\"31\" rx=\"5\" fill=\"#e3f4f9\" stroke=\"#88b0c2\" stroke-width=\"3\"/>\n<rect x=\"482\" y=\"379\" width=\"53\" height=\"22\" rx=\"5\" fill=\"#b1d9e9\" stroke=\"#76a3bd\" stroke-width=\"2\"/>\n<path d=\"M486 382h45\" stroke=\"#eefbff\" stroke-width=\"3\"/>\n<rect x=\"547\" y=\"379\" width=\"39\" height=\"23\" rx=\"5\" fill=\"#f2d49b\" stroke=\"#c1a166\" stroke-width=\"2\"/>\n<path d=\"M552 383h29\" stroke=\"#fff2c6\" stroke-width=\"3\"/>\n<rect x=\"596\" y=\"380\" width=\"29\" height=\"22\" rx=\"5\" fill=\"#ccb4e8\" stroke=\"#a18bc0\" stroke-width=\"2\"/>\n<path d=\"M600 384h21\" stroke=\"#e9def8\" stroke-width=\"3\"/>\n<path d=\"M473 411h164\" stroke=\"#6c9dad\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n<circle cx=\"485\" cy=\"418\" r=\"7\" fill=\"#526f88\" stroke=\"#9bb7c9\" stroke-width=\"2\"/>\n<circle cx=\"628\" cy=\"418\" r=\"7\" fill=\"#526f88\" stroke=\"#9bb7c9\" stroke-width=\"2\"/>\n<!-- the trolley remains obvious without a second label overlapping equipment -->\n<path d=\"M503 368h107\" stroke=\"#f3ffff\" stroke-width=\"3\" opacity=\".8\"/>\n</g>\n<!-- PHASE E: compact right-wall hygiene and doffing alcove; educational, not a certified isolation airlock -->\n<g aria-label=\"Wall-mounted PPE doffing, hand hygiene and infectious waste station\" pointer-events=\"none\">\n<!-- occupies only narrow right-wall zone, keeping the Public Health monitor and companion path clear -->\n<rect x=\"943\" y=\"169\" width=\"55\" height=\"207\" rx=\"9\" fill=\"#dcecf1\" stroke=\"#81abbd\" stroke-width=\"4\"/>\n<rect x=\"946\" y=\"173\" width=\"48\" height=\"25\" rx=\"6\" fill=\"#fff8ec\" stroke=\"#d2a77d\" stroke-width=\"2\"/>\n<text x=\"970\" y=\"184\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"8\" font-weight=\"900\" fill=\"#825c4c\">DOFF PPE</text>\n<text x=\"970\" y=\"193\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"7\" font-weight=\"800\" fill=\"#825c4c\">&amp; CLEAN</text>\n<!-- wall-mounted PPE disposal guidance and sanitizer -->\n<rect x=\"949\" y=\"205\" width=\"43\" height=\"39\" rx=\"5\" fill=\"#f6fcff\" stroke=\"#a6c4d4\" stroke-width=\"2\"/>\n<path d=\"M955 213h30m-30 6h30\" stroke=\"#9fbcc9\" stroke-width=\"2\"/>\n<text x=\"970\" y=\"234\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"7.5\" font-weight=\"900\" fill=\"#52798e\">REMOVE</text>\n<rect x=\"951\" y=\"251\" width=\"17\" height=\"23\" rx=\"4\" fill=\"#f8fdff\" stroke=\"#94b7c9\" stroke-width=\"2\"/>\n<rect x=\"956\" y=\"245\" width=\"8\" height=\"8\" rx=\"2\" fill=\"#88b5c8\"/>\n<rect x=\"957\" y=\"260\" width=\"6\" height=\"8\" rx=\"2\" fill=\"#9fdecf\"/>\n<!-- sink, simple faucet and soap dispenser -->\n<path d=\"M972 266q11 5 17 0v13q-8 7-17 0Z\" fill=\"#f6ffff\" stroke=\"#7fa5b9\" stroke-width=\"2\"/>\n<path d=\"M979 266v-13q0-4 5-4h6\" fill=\"none\" stroke=\"#76a1b4\" stroke-width=\"3\"/>\n<path d=\"M976 278h13\" stroke=\"#8baebd\" stroke-width=\"2\"/>\n<text x=\"970\" y=\"293\" font-size=\"7.5\" text-anchor=\"middle\" font-family=\"Arial\" font-weight=\"900\" fill=\"#4b7c8f\">WASH</text>\n<!-- waste bins with lids, inside alcove -->\n<rect x=\"949\" y=\"303\" width=\"18\" height=\"35\" rx=\"3\" fill=\"#e5a5ad\" stroke=\"#ae7788\" stroke-width=\"2\"/>\n<rect x=\"948\" y=\"301\" width=\"20\" height=\"6\" rx=\"2\" fill=\"#ba7e8b\"/>\n<text x=\"958\" y=\"323\" text-anchor=\"middle\" font-size=\"12\" font-family=\"Arial\" fill=\"#6b3a50\">☣</text>\n<rect x=\"974\" y=\"303\" width=\"18\" height=\"35\" rx=\"3\" fill=\"#e5eef1\" stroke=\"#8da8ba\" stroke-width=\"2\"/>\n<rect x=\"973\" y=\"301\" width=\"20\" height=\"6\" rx=\"2\" fill=\"#9eafbc\"/>\n<path d=\"M980 316h6m-6 5h6m-6 5h6\" stroke=\"#8ca6b3\" stroke-width=\"1.5\"/>\n<!-- bounded doffing/hand-hygiene location, no false unidirectional entry route -->\n<rect x=\"943\" y=\"347\" width=\"54\" height=\"21\" rx=\"5\" fill=\"#edfaf3\" stroke=\"#92c4b3\" stroke-width=\"2\"/>\n<text x=\"970\" y=\"360\" text-anchor=\"middle\" font-size=\"8\" font-weight=\"900\" font-family=\"Arial\" fill=\"#508d80\">HYGIENE</text>\n</g>\n<!-- color-coded observation display and patient-dedicated equipment -->\n<g aria-label=\"Isolation monitoring and clinical status tags\">\n<rect x=\"272\" y=\"225\" width=\"61\" height=\"54\" rx=\"6\" fill=\"#e9f4f4\" stroke=\"#8daeb2\" stroke-width=\"3\"/>\n<rect x=\"279\" y=\"231\" width=\"48\" height=\"29\" rx=\"4\" fill=\"#3b6c80\"/>\n<path d=\"M285 247h7l4-9 7 18 7-12 5 4h6\" fill=\"none\" stroke=\"#90e0bf\" stroke-width=\"2\"/>\n<circle cx=\"311\" cy=\"268\" r=\"3\" fill=\"#91c7a5\"/>\n<rect x=\"90\" y=\"208\" width=\"61\" height=\"20\" rx=\"6\" fill=\"#fffef8\" stroke=\"#a4c9c4\" stroke-width=\"2\"/>\n\n</g>\n<!-- contained specimen pass-through visual beside the workstation -->\n<g aria-label=\"Labeled specimen transfer hatch\">\n<rect x=\"680\" y=\"205\" width=\"22\" height=\"94\" rx=\"4\" fill=\"#cee5e6\" stroke=\"#81b3b9\" stroke-width=\"3\"/>\n<rect x=\"683\" y=\"219\" width=\"16\" height=\"53\" rx=\"3\" fill=\"#e3f4f1\" stroke=\"#a7caca\" stroke-width=\"2\"/>\n<path d=\"M684 255h14\" stroke=\"#8bb5bb\" stroke-width=\"2\"/>\n</g>\n\n<!-- PHASE D: large, legible One Health surveillance computer, intentionally fixed artwork -->\n<g aria-label=\"Large public health surveillance computer with One Health zoonoses, outbreak and reporting dashboard\" pointer-events=\"none\" filter=\"url(#ohShadow)\">\n<!-- integrated wall mounted wide monitor and clinical workstation -->\n<rect x=\"701\" y=\"151\" width=\"239\" height=\"222\" rx=\"17\" fill=\"#c8dced\" stroke=\"#729dbb\" stroke-width=\"7\"/>\n<rect x=\"709\" y=\"168\" width=\"226\" height=\"161\" rx=\"11\" fill=\"#2e557c\" stroke=\"#a0c9d9\" stroke-width=\"4\"/>\n<rect x=\"719\" y=\"181\" width=\"206\" height=\"134\" rx=\"6\" fill=\"url(#ohMonitor)\"/>\n<path d=\"M730 195h182\" stroke=\"#6a9ab7\" stroke-width=\"2\" opacity=\".68\"/>\n<text x=\"821\" y=\"193\" text-anchor=\"middle\" font-size=\"13.5\" font-weight=\"900\" fill=\"#f2ffff\">ONE HEALTH SURVEILLANCE</text>\n<!-- stylized map on a large clinical teaching monitor; no implied live epidemiology -->\n<path d=\"M727 232l21-11 15 9 13-10 18 15 16-6 15 12 19-8 25 13 36-7-10 14-22 4-13 15-17-5-19 7-15-8-17 5-17-8-21 4-18-10Z\" fill=\"#9fcfaf\"/>\n<path d=\"M748 232l4 6m33-6 5 7m39 6 4 6m45-7 5 9\" stroke=\"#75a88e\" stroke-width=\"1.3\"/>\n<circle cx=\"763\" cy=\"237\" r=\"4.6\" fill=\"#f4ad8b\"/>\n<circle cx=\"812\" cy=\"241\" r=\"4.6\" fill=\"#edc973\"/>\n<circle cx=\"859\" cy=\"251\" r=\"4.6\" fill=\"#f4ad8b\"/>\n<!-- legend/action columns kept visible but not baked as fake buttons -->\n<rect x=\"727\" y=\"272\" width=\"190\" height=\"34\" rx=\"6\" fill=\"#3e6d91\" opacity=\".92\"/>\n<g font-size=\"9\" font-weight=\"800\" fill=\"#edfaff\">\n<text x=\"735\" y=\"284\">ZOONOSES</text><text x=\"805\" y=\"284\">OUTBREAKS</text><text x=\"873\" y=\"284\">REPORT</text>\n</g>\n<path d=\"M735 297h24l7-7 9 10 9-6h21l8-10 7 13 8-5h21\" fill=\"none\" stroke=\"#9de5ca\" stroke-width=\"2.8\"/>\n<g fill=\"#f8d66f\"><rect x=\"865\" y=\"294\" width=\"8\" height=\"5\" rx=\"1\"/><rect x=\"878\" y=\"287\" width=\"8\" height=\"12\" rx=\"1\"/><rect x=\"891\" y=\"280\" width=\"8\" height=\"19\" rx=\"1\"/><rect x=\"904\" y=\"274\" width=\"8\" height=\"25\" rx=\"1\"/></g>\n<!-- top header sign has a single clear station label -->\n<rect x=\"728\" y=\"141\" width=\"193\" height=\"32\" rx=\"15\" fill=\"#f6faff\" stroke=\"#8aa8d1\" stroke-width=\"3\"/>\n<text x=\"824\" y=\"161\" text-anchor=\"middle\" font-size=\"12.5\" font-weight=\"900\" fill=\"#415e92\">PUBLIC HEALTH</text>\n<!-- slim desktop, keyboard and secure report folders, no extra clinic clutter -->\n<path d=\"M711 330h226l-9 12H717Z\" fill=\"#b9d1e0\" stroke=\"#82a9c2\" stroke-width=\"2\"/>\n<rect x=\"713\" y=\"343\" width=\"219\" height=\"30\" rx=\"8\" fill=\"#e6f1f8\" stroke=\"#a0bacc\" stroke-width=\"2\"/>\n<rect x=\"747\" y=\"350\" width=\"85\" height=\"14\" rx=\"4\" fill=\"#b5cbdc\"/>\n<path d=\"M754 357h71\" stroke=\"#86a6bd\" stroke-width=\"2\"/>\n<rect x=\"846\" y=\"349\" width=\"15\" height=\"18\" rx=\"2\" fill=\"#83b5e1\" stroke=\"#5e92c3\" stroke-width=\"1.5\"/>\n<rect x=\"863\" y=\"349\" width=\"15\" height=\"18\" rx=\"2\" fill=\"#bf9ede\" stroke=\"#9478b5\" stroke-width=\"1.5\"/>\n<rect x=\"880\" y=\"349\" width=\"15\" height=\"18\" rx=\"2\" fill=\"#86cbb8\" stroke=\"#6aa798\" stroke-width=\"1.5\"/>\n<!-- station-integrated cabinetry -->\n<path d=\"M716 375h210\" stroke=\"#f4ffff\" stroke-width=\"4\" opacity=\".8\"/>\n<rect x=\"730\" y=\"372\" width=\"186\" height=\"8\" rx=\"4\" fill=\"#8eaec5\"/>\n<path d=\"M746 380v22m154-22v22\" stroke=\"#739ab3\" stroke-width=\"5\"/>\n</g>\n<!-- airflow, PPE and disinfect reminders in overhead clinical infrastructure -->\n<g>\n<rect x=\"95\" y=\"102\" width=\"200\" height=\"32\" rx=\"10\" fill=\"#fff4de\" stroke=\"#d6b57f\" stroke-width=\"2\"/><text x=\"195\" y=\"123\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"15\" font-weight=\"900\" fill=\"#946c40\">☣ ISOLATION</text>\n<rect x=\"378\" y=\"103\" width=\"122\" height=\"31\" rx=\"9\" fill=\"#f0faf9\" stroke=\"#9cc8c6\" stroke-width=\"2\"/><text x=\"439\" y=\"122\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"12\" font-weight=\"800\" fill=\"#518984\">AIRFLOW</text>\n<rect x=\"785\" y=\"103\" width=\"144\" height=\"31\" rx=\"9\" fill=\"#f4fbf4\" stroke=\"#9dc9b1\" stroke-width=\"2\"/><text x=\"857\" y=\"123\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"11.5\" font-weight=\"900\" fill=\"#548879\">HYGIENE / EXIT</text>\n<rect x=\"552\" y=\"103\" width=\"149\" height=\"31\" rx=\"9\" fill=\"#f7fcfb\" stroke=\"#a8cbd1\" stroke-width=\"2\"/><text x=\"626\" y=\"123\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"11\" font-weight=\"900\" fill=\"#508781\">LAB SAFETY</text>\n</g>\n<!-- smaller front-of-room equipment; don't obstruct animal/character travel -->\n<g>\n<rect x=\"90\" y=\"394\" width=\"57\" height=\"46\" rx=\"5\" fill=\"#eeaab3\" stroke=\"#ae7f8b\" stroke-width=\"3\"/>\n<rect x=\"86\" y=\"390\" width=\"65\" height=\"8\" rx=\"3\" fill=\"#c77e8a\"/>\n<text x=\"119\" y=\"418\" font-size=\"13\" text-anchor=\"middle\">☣</text><text x=\"119\" y=\"431\" font-size=\"8\" text-anchor=\"middle\" font-weight=\"900\" fill=\"#714c5c\">WASTE</text>\n<rect x=\"160\" y=\"394\" width=\"56\" height=\"46\" rx=\"5\" fill=\"#f0d58a\" stroke=\"#bd9c58\" stroke-width=\"3\"/>\n<rect x=\"157\" y=\"390\" width=\"62\" height=\"8\" rx=\"3\" fill=\"#c9a657\"/>\n<text x=\"187\" y=\"420\" font-size=\"11\" text-anchor=\"middle\">⚠️</text><text x=\"187\" y=\"432\" font-size=\"8\" text-anchor=\"middle\" font-weight=\"900\" fill=\"#7f6844\">SHARPS</text>\n<rect x=\"271\" y=\"411\" width=\"120\" height=\"25\" rx=\"9\" fill=\"#b6d8dc\" stroke=\"#6d9fa5\" stroke-width=\"3\"/>\n\n</g>\n<text x=\"975\" y=\"450\" text-anchor=\"end\" font-size=\"9\" font-family=\"Arial\" fill=\"#6e94a0\">One Health</text>\n</svg>";return art.replace('__PATIENT__',isoPatientArt())}
function scene(key){
 if(key==='isolation')return isolationScene();
 if(key==='surgery'&&typeof window.VPQ_SURGERY_ROOM_ART==='function')return window.VPQ_SURGERY_ROOM_ART();
 if(key==='necropsy'&&typeof window.VPQ_NECROPSY_ROOM_ART==='function')return window.VPQ_NECROPSY_ROOM_ART();
 if(key==='clinpath'&&typeof window.VPQ_CLINPATH_HYBRID_SCENE==='function')return window.VPQ_CLINPATH_HYBRID_SCENE();
 const iso=key==='isolation',cp=key==='clinpath';
 const bg=iso?'#d6eee6':cp?'#dceff8':'#edf1e5';
 const wall=iso?'#effaf7':cp?'#f5faff':'#f7faef';
 const label=iso?'ONE HEALTH & ISOLATION':cp?'ADVANCED CLINICAL PATHOLOGY':key==='surgery'?'SURGERY & ANESTHESIA':key==='skills'?'CLINICAL SKILLS & PROCEDURES':'NECROPSY & DIAGNOSTIC PATHOLOGY';
 let s='<svg class="vpqSpecArt" viewBox="0 0 1000 500" preserveAspectRatio="none" role="img" aria-label="'+label+' veterinary teaching room">'+
 '<defs><filter id="vpqSpecShadow"><feDropShadow dx="2" dy="5" stdDeviation="5" flood-opacity=".2" flood-color="#5c7394"/></filter></defs>'+
 '<rect width="1000" height="500" fill="'+bg+'"/><polygon points="0,0 1000,0 934,70 66,70" fill="#fffcf7"/>'+
 '<polygon points="0,0 66,70 66,342 0,404" fill="#b3c9d4"/><polygon points="1000,0 934,70 934,342 1000,404" fill="#b3c9d4"/>'+
 '<rect x="66" y="70" width="868" height="272" fill="'+wall+'"/>'+
 '<path d="M66 342H934L1000 500H0Z" fill="#ddd4e4"/>'+
 '<path d="M66 342L0 500M934 342L1000 500M300 342L260 500M500 342V500M700 342L740 500M32 433H969M50 385H950" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>'+
 [155,395,615,845].map(x=>'<ellipse cx="'+x+'" cy="41" rx="28" ry="12" fill="#fff7dd" stroke="#fff" stroke-width="5"/>').join('')+
 (key==='surgery'||iso?'':'<g filter="url(#vpqSpecShadow)">'+rect(321,92,359,54,'#fffdfd','#a8b9d6')+
 '<text x="500" y="127" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="#607b90" text-anchor="middle">'+label+'</text></g>');
 if(cp){
   s+='<text x="500" y="174" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="15" fill="#68839a">REFERRAL DIAGNOSTICS · QUESTIONS &amp; INTERPRETATION</text>';
   const stations=[
    {x:79,label:'COAG QUESTIONS',c:'#f8e4f2',edge:'#c99ac4',screen:'PT / aPTT',symbol:'🩸'},
    {x:264,label:'ACID–BASE QUIZ',c:'#e6f5fa',edge:'#9ac9db',screen:'pH / CO₂',symbol:'🫧'},
    {x:448,label:'UA QUESTIONS',c:'#f6eafa',edge:'#c9a9da',screen:'SEDIMENT',symbol:'🧫'},
    {x:632,label:'PATIENT CASES',c:'#eaf0fa',edge:'#a1b6da',screen:'CASE FILE',symbol:'🐾'},
    {x:816,label:'IMAGE ID QUIZ',c:'#e8f8f5',edge:'#9dc9ba',screen:'SMEAR ID',symbol:'🔬'}
   ];
   s+='<g filter="url(#vpqSpecShadow)">'+stations.map(v=>
     rect(v.x,196,145,134,v.c,v.edge)+
     rect(v.x+13,211,119,71,'#405671',v.edge)+
     '<text x="'+(v.x+73)+'" y="241" text-anchor="middle" font-family="Arial" font-size="17" font-weight="900" fill="#d6f4fa">'+v.screen+'</text>'+
     '<path d="M'+(v.x+28)+' 263h21l8 -15 12 26 12 -18h29" fill="none" stroke="#92e4be" stroke-width="4"/>'+
     '<text x="'+(v.x+72)+'" y="313" text-anchor="middle" font-family="Arial" font-size="12" font-weight="900" fill="#6e6688">'+v.label+'</text>'
   ).join('')+'</g><path d="M65 338h868" stroke="#c4b2cf" stroke-width="14"/>'+
   '<g><circle cx="151" cy="181" r="7" fill="#ebafd3"/><circle cx="854" cy="181" r="7" fill="#b6ddcd"/><path d="M152 155l5 10 11 2 -8 8 2 11 -10-5 -10 5 3-11 -8-8 10-2z" fill="#f9d7a3"/></g>';
 }else if(iso){
   // One Health ward: washable work surfaces, dedicated kennel, clean-to-dirty workflow and supplies.
   s+='<g font-family="Arial,sans-serif">'+
   // Wall hygiene infrastructure and clean/dirty zoning.
   '<path d="M67 333H933" stroke="#89bdb9" stroke-width="10"/>'+
   '<rect x="68" y="72" width="864" height="18" fill="#cce7df"/>'+
   '<path d="M69 345H931" stroke="#fff" stroke-width="3"/>'+
   '<path d="M354 343L308 493M674 343L700 493" fill="none" stroke="#f4f9f6" stroke-width="4" stroke-dasharray="12 9"/>'+
   // Clear circulation space in front of all three interactive stations.
   // Source-backed patient selected from existing game cases; expandable washable kennel with water.
   isoPatientArt()+
   // Dedicated specimen-processing visual with illustrated primary containment and testing.
   // Educational scenery only; no actual laboratory operating procedures.
   '<g aria-label="Specimen processing and diagnostic teaching bench">'+
   '<rect x="382" y="191" width="242" height="157" rx="13" fill="#c9e2dd" stroke="#76aaa7" stroke-width="6"/>'+
   '<rect x="394" y="205" width="217" height="115" rx="9" fill="#edf8f4" stroke="#b1cec9" stroke-width="3"/>'+
   '<path d="M405 294h193" stroke="#86aba8" stroke-width="5"/>'+
   '<rect x="406" y="220" width="125" height="71" rx="7" fill="#9fc4c6" stroke="#5f989d" stroke-width="4"/>'+
   '<path d="M413 233h111v51H413Z" fill="#d9edef" stroke="#a1c8c9" stroke-width="2"/>'+
   '<rect x="416" y="239" width="105" height="34" rx="4" fill="#e9f9f6" stroke="#93b5b9" stroke-width="1.5"/>'+
   '<path d="M412 224h113" stroke="#5a8e97" stroke-width="5"/>'+
   '<rect x="415" y="276" width="106" height="9" rx="2" fill="#91b8b9"/>'+
   '<text x="468" y="217" font-size="9" text-anchor="middle" font-weight="900" fill="#426c74">BIOSAFETY CABINET</text>'+
   '<rect x="538" y="225" width="58" height="62" rx="7" fill="#deedf0" stroke="#8aafb7" stroke-width="3"/>'+
   '<rect x="545" y="233" width="44" height="24" rx="4" fill="#4c8295"/>'+
   '<text x="567" y="248" text-anchor="middle" font-size="12" font-weight="900" fill="#f4ffff">PCR</text>'+
   '<path d="M546 264h38" stroke="#91b0b2" stroke-width="3"/>'+
   '<circle cx="584" cy="276" r="3" fill="#79c6a5"/>'+
   '<g stroke="#719ba2" stroke-width="1.5">'+
   [0,1,2,3,4,5].map(n=>'<rect x="'+(424+n*15)+'" y="261" width="9" height="17" rx="2" fill="'+(n%2?'#d9f0ee':'#f7c5ce')+'"/>').join('')+
   '</g>'+
   '<rect x="411" y="299" width="197" height="29" rx="6" fill="#f9fdf9" stroke="#9fc4bb" stroke-width="2"/>'+
   '<text x="510" y="310" text-anchor="middle" font-size="10" font-weight="900" fill="#3e8580">SPECIMEN TESTING</text>'+
   '<text x="510" y="321" text-anchor="middle" font-size="8" font-weight="800" fill="#628f8b">SAMPLE • TEST • INTERPRET</text>'+
   '<rect x="392" y="337" width="221" height="10" rx="4" fill="#9cbdb8"/>'+
   '<path d="M401 347v20m203-20v20" stroke="#709d9d" stroke-width="7"/>'+
   '</g>'+
   // Public-health reporting terminal with status display.
   '<rect x="712" y="190" width="218" height="155" rx="14" fill="#cce5ed" stroke="#8cb7c7" stroke-width="7"/>'+
   '<rect x="730" y="206" width="180" height="101" rx="10" fill="#365c77" stroke="#83acbc" stroke-width="4"/>'+
   '<text x="819" y="224" text-anchor="middle" font-size="14" font-weight="900" fill="#f3faff">PUBLIC HEALTH</text>'+
   '<path d="M747 266h31l11 -19 12 33 13 -24 11 11h60" stroke="#83dcbf" stroke-width="5" fill="none"/>'+
   '<rect x="747" y="288" width="145" height="6" rx="3" fill="#7397ac"/>'+
   '<rect x="753" y="316" width="129" height="15" rx="4" fill="#f7fffa" stroke="#a2c6cc" stroke-width="2"/>'+
   '<text x="818" y="327" text-anchor="middle" font-size="9" font-weight="900" fill="#608c94">SURVEILLANCE · REPORTING</text>'+
   // Infection-control teaching and public-health dashboard graphics.
   '<g aria-label="One Health dashboard and cross-species surveillance map">'+
   '<path d="M749 236h131v49H749Z" fill="#254e67" opacity=".76"/>'+
   '<path d="M762 246l13-8 14 6 13-3 11 9 11-7 11 11 14-3 12 9-3 11-12 1-7 7-17-5-13 2-12-7-14 4-9-8-13 2Z" fill="#a7cda5" opacity=".8"/>'+
   '<circle cx="783" cy="252" r="5" fill="#f1b89d"/><circle cx="833" cy="263" r="5" fill="#eedb9f"/>'+
   '<rect x="750" y="286" width="128" height="6" rx="3" fill="#79b69e"/>'+
   '<rect x="757" y="300" width="124" height="14" rx="5" fill="#f9fff9" stroke="#a0c8c1" stroke-width="2"/>'+
   '<text x="819" y="310" text-anchor="middle" font-size="9" font-weight="900" fill="#4c8582">SURVEILLANCE &amp; REPORTING</text>'+
   '</g>'+
   // Upper visual header explains One Health without duplicating the station interactions.
   '<g aria-label="One Health animal human and environmental health disciplines">'+
   '<rect x="359" y="91" width="271" height="72" rx="16" fill="#f5fbf8" stroke="#a4c7c5" stroke-width="4"/>'+
   '<text x="495" y="112" text-anchor="middle" font-size="20" font-weight="900" fill="#3f7890">ONE HEALTH</text>'+
   '<circle cx="418" cy="141" r="14" fill="#c5e7d1"/><circle cx="496" cy="141" r="14" fill="#e0d2f1"/><circle cx="574" cy="141" r="14" fill="#c9e5c3"/>'+
   '<text x="418" y="146" text-anchor="middle" font-size="15">🐾</text>'+
   '<text x="496" y="146" text-anchor="middle" font-size="15">👥</text>'+
   '<text x="574" y="146" text-anchor="middle" font-size="15">🌿</text>'+
   '<path d="M434 141h43M511 141h47" stroke="#b1cfc8" stroke-width="3" stroke-dasharray="4 3"/>'+
   '</g>'+
   // Service details: sealed wall surfaces, ventilation grille, observation window and entry threshold.
   '<g transform="translate(625 96)"><rect width="110" height="47" rx="6" fill="#e8f5f4" stroke="#9bbfbf" stroke-width="3"/>'+
   '<text x="55" y="13" text-anchor="middle" font-size="9" font-weight="900" fill="#578481">AIRFLOW CHECK</text>'+
   [0,1,2,3].map(i=>'<path d="M12 '+(20+i*6)+'h85" stroke="#a8c8c7" stroke-width="3"/>').join('')+
   '<circle cx="100" cy="11" r="3" fill="#7cb799"/></g>'+
   '<g transform="translate(947 202)"><rect width="42" height="136" rx="6" fill="#d4e9e7" stroke="#7da9a3" stroke-width="3"/>'+
   '<rect x="7" y="15" width="28" height="72" rx="3" fill="#afd9df" fill-opacity=".68" stroke="#9bc0c1" stroke-width="2"/>'+
   '<path d="M9 33h24m-24 24h24" stroke="#e0f3f1" stroke-width="2"/>'+
   '<circle cx="9" cy="101" r="3" fill="#e1c887"/>'+
   '<text x="21" y="123" text-anchor="middle" font-size="7" font-weight="900" fill="#537e7d">ENTRY</text></g>'+
   '<rect x="899" y="351" width="86" height="17" rx="4" fill="#e4f6ee" stroke="#9dc9b2" stroke-width="2"/>'+
   '<text x="942" y="363" text-anchor="middle" font-size="9" font-weight="900" fill="#578979">DON PPE</text>'+
   '<path d="M932 373v30m0 0 -8 -10m8 10 8 -10" stroke="#83ab9f" stroke-width="3" fill="none"/>'+
   // Signage: meaningful precautions instead of decor only.
   '<rect x="93" y="114" width="191" height="54" rx="10" fill="#fff3d7" stroke="#dcb276" stroke-width="3"/>'+
   '<text x="188" y="135" text-anchor="middle" font-size="16" font-weight="900" fill="#936b2e">☣ BIOHAZARD</text>'+
   '<text x="188" y="153" text-anchor="middle" font-size="11" font-weight="900" fill="#936b2e">VERIFY ISOLATION PRECAUTIONS</text>'+
   '<rect x="753" y="112" width="183" height="55" rx="10" fill="#edf9f3" stroke="#9dc6b0" stroke-width="3"/>'+
   '<text x="844" y="132" text-anchor="middle" font-size="12" font-weight="900" fill="#467c70">PPE BEFORE ENTRY</text>'+
   '<text x="844" y="151" text-anchor="middle" font-size="10" font-weight="800" fill="#467c70">GOWN · GLOVES · HAND HYGIENE</text>'+
   // Small, readable cleaning workflow card in the clear wall space.
   '<g transform="translate(404 156)"><rect width="202" height="27" rx="5" fill="#f9fffb" stroke="#a8cfc1" stroke-width="2"/>'+
   '<text x="101" y="11" text-anchor="middle" font-size="9" font-weight="900" fill="#508675">CLEAN → DISINFECT → CONTACT TIME</text>'+
   '<text x="101" y="22" text-anchor="middle" font-size="8" fill="#709d8e">DEDICATED EQUIPMENT • HAND HYGIENE</text></g>'+
   // Handwash sink left of library: tap, basin, soap, paper towels.
   '<g transform="translate(334 248)"><rect x="1" y="30" width="44" height="48" rx="5" fill="#bedbd8" stroke="#83aeb0" stroke-width="3"/>'+
   '<path d="M5 37Q22 47 41 37L35 56Q22 66 10 56Z" fill="#faffff" stroke="#92bdc2" stroke-width="2.5"/>'+
   '<path d="M22 37V13q0 -9 10 -9h8" stroke="#7a9fa9" stroke-width="5" fill="none"/>'+
   '<path d="M27 41v9" stroke="#8ccfe8" stroke-width="2" stroke-dasharray="3 3"/>'+
   '<rect x="0" y="2" width="12" height="22" rx="3" fill="#b6d9d4" stroke="#7eaca7" stroke-width="2"/>'+
   '<rect x="3" y="0" width="6" height="5" rx="1" fill="#f6fbf8"/>'+
   '<rect x="42" y="7" width="18" height="19" rx="3" fill="#f8f9ed" stroke="#acc3b3" stroke-width="2"/>'+
   '<path d="M47 11h8m-8 5h8" stroke="#b0c6bc" stroke-width="2"/>'+
   '<text x="25" y="91" text-anchor="middle" font-size="9" font-weight="900" fill="#527e7d">WASH</text></g>'+
   // Cleaning/terminal-dedicated supply cart; nothing shared with non-isolation zones.
   '<g transform="translate(631 269)"><rect x="0" y="28" width="67" height="63" rx="5" fill="#bbd7d1" stroke="#88afa9" stroke-width="3"/>'+
   '<path d="M0 47h67M7 71h53" stroke="#8aaea4" stroke-width="3"/>'+
   '<rect x="7" y="2" width="17" height="30" rx="4" fill="#cce9ed" stroke="#92b3c2" stroke-width="2"/>'+
   '<rect x="11" y="-2" width="9" height="7" rx="2" fill="#a6c4d0"/>'+
   '<rect x="29" y="9" width="15" height="22" rx="3" fill="#f6d9df" stroke="#beabb4" stroke-width="2"/>'+
   '<path d="M34 8v-6h12" stroke="#a3b6b6" stroke-width="2" fill="none"/>'+
   '<rect x="47" y="15" width="13" height="16" rx="2" fill="#f4f7ed" stroke="#b0c4b5"/>'+
   '<rect x="8" y="55" width="50" height="11" rx="3" fill="#ecf6f0"/>'+
   '<text x="33" y="63" text-anchor="middle" font-size="8" font-weight="900" fill="#5c8b7f">DISINFECT</text>'+
   '<circle cx="13" cy="92" r="7" fill="#627f84"/><circle cx="55" cy="92" r="7" fill="#627f84"/></g>'+
   // Dedicated isolation supplies near the clean cart: towel rolls, contact-time chart and reusable equipment bin.
   '<g transform="translate(618 164)"><rect width="97" height="48" rx="6" fill="#f9fff9" stroke="#a6c9b8" stroke-width="2.5"/>'+
   '<text x="48" y="12" text-anchor="middle" font-size="9" font-weight="900" fill="#5b8878">CLEANING LOG</text>'+
   '<path d="M8 20h80M8 29h80M8 38h56" stroke="#b2d0c0" stroke-width="2"/>'+
   '<path d="M75 36l4 4 8 -10" stroke="#7aaf91" stroke-width="2.5" fill="none"/></g>'+
   '<g transform="translate(702 274)"><rect width="34" height="46" rx="5" fill="#dfebf0" stroke="#a8bec7" stroke-width="2.5"/>'+
   '<path d="M6 10h23m-22 7h20" stroke="#b2c7d0" stroke-width="2"/>'+
   '<rect x="3" y="-7" width="28" height="12" rx="5" fill="#f9fff9" stroke="#aac5bd" stroke-width="2"/>'+
   '<text x="17" y="36" font-size="6" text-anchor="middle" fill="#7397a5">CLEAN</text></g>'+
   // PPE dispensing station left edge, biohazard waste adjacent to isolation kennel.
   '<g transform="translate(17 201)"><rect width="60" height="117" rx="7" fill="#e8f5ed" stroke="#95bdb0" stroke-width="3"/>'+
   '<text x="30" y="13" text-anchor="middle" font-size="9" font-weight="900" fill="#5e8d80">PPE</text>'+
   '<rect x="7" y="21" width="46" height="28" rx="4" fill="#fdfefd" stroke="#b7cec3"/>'+
   '<path d="M14 35l7 -8h18l8 8 -6 12H20Z" fill="#b8d7e5" stroke="#95b9c5" stroke-width="1.5"/>'+
   '<rect x="7" y="54" width="46" height="23" rx="3" fill="#fffefa" stroke="#b7cec3"/>'+
   '<text x="30" y="70" text-anchor="middle" font-size="10">🧤</text>'+
   '<rect x="7" y="82" width="46" height="28" rx="3" fill="#fef9f2" stroke="#b7cec3"/>'+
   '<text x="30" y="100" text-anchor="middle" font-size="10">😷</text></g>'+
   '<g transform="translate(82 353)"><rect width="30" height="57" rx="4" fill="#e7acac" stroke="#ad808b" stroke-width="3"/>'+
   '<rect x="-3" y="-5" width="36" height="8" rx="3" fill="#b97f83"/>'+
   '<text x="15" y="32" text-anchor="middle" font-size="14">☣</text>'+
   '<text x="15" y="45" text-anchor="middle" font-size="6.5" font-weight="900" fill="#743c4b">WASTE</text></g>'+
   // Boot sole disinfecting mat at the clean-to-dirty threshold.
   '<rect x="314" y="383" width="65" height="29" rx="5" fill="#99bcb1" stroke="#6f9c90" stroke-width="3"/>'+
   '<path d="M322 388h49m-49 7h49m-49 7h49" stroke="#d8e9df" stroke-width="2"/>'+
   '<text x="346" y="422" text-anchor="middle" font-size="8" font-weight="900" fill="#568078">BOOT MAT</text>'+
      '<g aria-label="Color-coded teaching zones">'+
   '<rect x="58" y="447" width="262" height="35" rx="15" fill="#fce2e9" stroke="#c58ea8" stroke-width="4"/>'+
   '<text x="189" y="469" text-anchor="middle" font-size="14" font-weight="900" fill="#96516b">ISOLATION ZONE</text>'+
   '<rect x="355" y="447" width="292" height="35" rx="15" fill="#e4f0ff" stroke="#8db4d1" stroke-width="4"/>'+
   '<text x="501" y="469" text-anchor="middle" font-size="14" font-weight="900" fill="#4f789a">DIAGNOSTICS &amp; BIOSAFETY</text>'+
   '<rect x="680" y="447" width="270" height="35" rx="15" fill="#e8f7e9" stroke="#96c1ab" stroke-width="4"/>'+
   '<text x="815" y="469" text-anchor="middle" font-size="13" font-weight="900" fill="#508b72">ONE HEALTH &amp; REPORTING</text>'+
   '</g>'+
   '<text x="960" y="492" text-anchor="end" font-size="8" font-family="Arial" font-weight="900" fill="#6b8a85">Isolation room v4</text>'+

   '</g>';
 }else if(key==='skills'){
   // Three identifiable work areas: syringe training, venous collection, specimen tubes.
   s+='<g filter="url(#vpqSpecShadow)">'+
   rect(100,183,246,166,'#fce6f0','#ce9ab7')+
   '<rect x="117" y="198" width="212" height="128" rx="13" fill="#fff7fd" stroke="#d5a7c2" stroke-width="4"/>'+
   '<path d="M167 239l80 61" stroke="#8daed4" stroke-width="16" stroke-linecap="round"/>'+
   '<path d="M182 224l-28 28M244 288l25 18M256 299l26 11" stroke="#6594ba" stroke-width="8" stroke-linecap="round"/>'+
   '<rect x="240" y="201" width="27" height="50" rx="5" fill="#f6d4e1" stroke="#c19ab6" stroke-width="5"/>'+
   '<text x="226" y="338" text-anchor="middle" font-family="Arial" font-size="17" font-weight="900" fill="#9c6285">INJECTION PRACTICE</text>'+
   rect(382,183,258,166,'#e2f1fb','#9abfda')+
   '<rect x="399" y="198" width="224" height="128" rx="12" fill="#f8fcff" stroke="#b1ccde" stroke-width="4"/>'+
   '<path d="M422 244h105M443 222v47M499 222v47" stroke="#88a9c5" stroke-width="8"/>'+
   [451,489,527].map((x,i)=>'<rect x="'+x+'" y="268" width="22" height="46" rx="5" fill="'+(i===0?'#e8adce':i===1?'#b2a8e1':'#b4e0dc')+'" stroke="#779bb3" stroke-width="4"/>').join('')+
   '<path d="M541 246l39 -23" stroke="#739dbb" stroke-width="11" stroke-linecap="round"/>'+
   '<text x="512" y="338" text-anchor="middle" font-family="Arial" font-size="17" font-weight="900" fill="#5f89b3">BLOOD DRAW · TUBES</text>'+
   rect(683,186,225,161,'#e2f3e9','#99c9b0')+
   '<rect x="703" y="199" width="186" height="126" rx="9" fill="#f9fff9" stroke="#a4d4bc" stroke-width="3"/>'+
   '<rect x="716" y="225" width="157" height="24" rx="8" fill="#bcdbcd"/>'+
   [738,781,824].map((x,i)=>'<rect x="'+x+'" y="250" width="22" height="54" rx="5" fill="'+['#bca5de','#e7a7c3','#e2c892'][i]+'" stroke="#7fabb1" stroke-width="4"/>').join('')+
   '<text x="795" y="338" text-anchor="middle" font-family="Arial" font-size="17" font-weight="900" fill="#588875">SAMPLE HANDLING</text>'+
   '</g><text x="500" y="162" text-anchor="middle" font-family="Arial" font-weight="900" font-size="16" fill="#8d7298">CHOOSE A SPECIES · LEARN THE REASON · PRACTICE SAFELY</text>';

 }else if(key==='surgery'){
   // Purely scenic SVG: keep existing interactive hit targets and case routing.
   // The low foreground is kept clear for moving avatars and stationary room staff.
   s+=`
   <defs>
     <linearGradient id="vpqSurgGlass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f1fffc"/><stop offset="1" stop-color="#bededb"/></linearGradient>
     <linearGradient id="vpqSurgSteel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset=".5" stop-color="#a9c5c8"/><stop offset="1" stop-color="#e4f1ef"/></linearGradient>
     <linearGradient id="vpqSurgScreen" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#263c58"/><stop offset="1" stop-color="#3d6580"/></linearGradient>
     <linearGradient id="vpqSurgDrape" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c8f1e3"/><stop offset="1" stop-color="#72bbaa"/></linearGradient>
   </defs>
   <!-- Surgery-specific sterile room trim and warm operating lights -->
   <rect x="66" y="70" width="868" height="270" fill="#e8f4f1"/>
   <rect x="66" y="71" width="868" height="21" fill="#c9e4df"/>
   <path d="M66 329H934" stroke="#98c9c2" stroke-width="12"/>
   <path d="M70 339H931" stroke="#fff" stroke-width="3"/>
   <path d="M66 340H934L1000 500H0Z" fill="#d8e9e5"/>
   <path d="M66 340L0 500M934 340L1000 500M272 340L212 500M498 340V500M722 340L784 500M25 418H975M53 376H947" stroke="#fff" stroke-width="3" fill="none" opacity=".82"/>
   <path d="M92 94h814" stroke="#fff" stroke-width="5" opacity=".75"/>
   <rect x="332" y="96" width="336" height="48" rx="17" fill="#fffafc" stroke="#95c4bd" stroke-width="4" filter="url(#vpqSpecShadow)"/>
   <text x="500" y="127" fill="#416f72" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="25">SURGERY &amp; ANESTHESIA</text>
   <text x="500" y="159" fill="#6f9295" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="12">PREP  ·  MONITOR  ·  OPERATE  ·  RECOVER</text>
   <!-- Built-in storage, theatre glass, scrub threshold and overhead track. -->
   <defs>
      <linearGradient id="vpqSurgWallV2" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f7fffe"/><stop offset="1" stop-color="#cee7e4"/></linearGradient>
      <linearGradient id="vpqSurgWarmV2" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff8d5" stop-opacity=".48"/><stop offset="1" stop-color="#fff8d5" stop-opacity="0"/></linearGradient>
   </defs>
   <rect x="67" y="94" width="680" height="75" fill="url(#vpqSurgWallV2)" opacity=".85"/>
   <rect x="68" y="165" width="679" height="4" fill="#b0d6d0"/>
   <rect x="74" y="98" width="172" height="54" rx="7" fill="#f6fffd" stroke="#a2c8c4" stroke-width="3"/>
   <path d="M131 102v46M187 102v46" stroke="#b4d6d2" stroke-width="3"/>
   <path d="M113 126h5M169 126h5M222 126h5" stroke="#6aaba9" stroke-width="4" stroke-linecap="round"/>
   <rect x="264" y="111" width="45" height="38" rx="5" fill="#f1f9fa" stroke="#a4c6ca" stroke-width="3"/>
   <path d="M274 130h24M286 118v24" stroke="#a4d0bb" stroke-width="6"/>
   <path d="M490 96h244" stroke="#a7c2c8" stroke-width="6" stroke-linecap="round"/>
   <path d="M517 97v30M704 97v29" stroke="#9aafb7" stroke-width="4"/>
   <rect x="86" y="350" width="153" height="13" rx="6" fill="#a8c9c3" opacity=".85"/>
   <rect x="88" y="363" width="149" height="8" rx="4" fill="#fff" opacity=".9"/>
   <path d="M242 171v170" stroke="#8bb9b7" stroke-width="7"/>
   <path d="M251 175v164" stroke="#e2fbf5" stroke-width="3"/>
   <rect x="88" y="375" width="144" height="20" rx="10" fill="#fff8e5" stroke="#d9c69b" stroke-width="2"/>
   <text x="160" y="389" text-anchor="middle" font-size="10" font-weight="900" font-family="Arial" fill="#9c8053">SCRUB BEFORE ENTRY</text>
   <!-- 1: Scrub and sterile preparation zone -->
   <g filter="url(#vpqSpecShadow)">
     <rect x="78" y="175" width="169" height="159" rx="16" fill="#f9fefd" stroke="#8bbcb8" stroke-width="6"/>
     <rect x="91" y="189" width="143" height="83" rx="9" fill="url(#vpqSurgGlass)" stroke="#badbd8" stroke-width="3"/>
     <path d="M108 242h104" stroke="#7da9b1" stroke-width="4"/>
     <path d="M136 207v18h46v-18" fill="none" stroke="#719ba9" stroke-width="6" stroke-linecap="round"/>
     <path d="M156 204v-13h26" fill="none" stroke="#719ba9" stroke-width="6" stroke-linecap="round"/>
     <path d="M182 190v11" stroke="#719ba9" stroke-width="4"/>
     <ellipse cx="160" cy="254" rx="38" ry="8" fill="#90bbb8" opacity=".85"/>
     <rect x="101" y="275" width="123" height="39" rx="7" fill="#d5eae9" stroke="#92bab6" stroke-width="2"/>
     <path d="M114 291h32M114 302h32M180 283v23" stroke="#94b7b8" stroke-width="4" stroke-linecap="round"/>
     <rect x="109" y="151" width="105" height="19" rx="9" fill="#fff5dc" stroke="#d6c297" stroke-width="2"/>
     <text x="161" y="165" font-family="Arial" font-size="10" font-weight="900" fill="#816e4c" text-anchor="middle">SCRUB + PREP</text>
   </g>
   <g><rect x="89" y="315" width="148" height="29" rx="10" fill="#fff" stroke="#badad4" stroke-width="3"/><text x="163" y="334" text-anchor="middle" font-family="Arial" font-size="13" font-weight="900" fill="#527b7b">STERILE PREP</text></g>
   <!-- 2: Anesthesia cart with ventilator, capnography and monitoring -->
   <g filter="url(#vpqSpecShadow)">
     <rect x="270" y="171" width="215" height="165" rx="16" fill="#e1eff2" stroke="#8baebd" stroke-width="6"/>
     <rect x="284" y="184" width="184" height="92" rx="11" fill="url(#vpqSurgScreen)" stroke="#9fbfcc" stroke-width="5"/>
     <path d="M295 238h22l7 -15 9 29 12 -19 8 10 9 -6h15l8 -18 11 32 11 -14h22" fill="none" stroke="#8ce7ba" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M300 263h45l15 -10h20l16 9h58" fill="none" stroke="#f5cf8e" stroke-width="3"/>
     <text x="301" y="207" fill="#d6f1f4" font-size="10" font-family="Arial" font-weight="700">ECG   SpO₂   ETCO₂</text>
     <text x="439" y="207" fill="#a8ecc4" font-size="14" font-family="Arial" text-anchor="end">98%</text>
     <rect x="299" y="282" width="149" height="48" rx="9" fill="#f5fcfa" stroke="#a8c6ca" stroke-width="2"/>
     <circle cx="320" cy="306" r="12" fill="#dbeaf0" stroke="#6c97aa" stroke-width="3"/>
     <circle cx="357" cy="306" r="12" fill="#e8f7ed" stroke="#80ad9a" stroke-width="3"/>
     <circle cx="394" cy="306" r="12" fill="#e4eafa" stroke="#9ca9c8" stroke-width="3"/>
     <path d="M453 312q29 22 35 -3q5 -20 27 -12" stroke="#8bafbf" stroke-width="6" fill="none"/>
     <rect x="287" y="335" width="176" height="29" rx="10" fill="#fff" stroke="#b4d4d1" stroke-width="3"/>
     <text x="375" y="355" text-anchor="middle" font-family="Arial" font-size="13" font-weight="900" fill="#527b7b">ANESTHESIA MONITOR</text>
   </g>
   <!-- Anesthesia trolley: oxygen cylinder, breathing circuit, and organized supplies. -->
   <g filter="url(#vpqSpecShadow)">
      <rect x="272" y="369" width="190" height="11" rx="5" fill="#a5c3c6"/>
      <path d="M292 379v19M442 379v19" stroke="#91abb7" stroke-width="6"/>
      <circle cx="292" cy="399" r="6" fill="#6d8897"/><circle cx="442" cy="399" r="6" fill="#6d8897"/>
      <rect x="467" y="229" width="20" height="102" rx="10" fill="#a3cdbb" stroke="#689e90" stroke-width="3"/>
      <rect x="471" y="221" width="12" height="12" rx="3" fill="#d4ece1" stroke="#689e90" stroke-width="2"/>
      <path d="M479 222q33 -19 49 9" fill="none" stroke="#b5ccd5" stroke-width="5" stroke-linecap="round"/>
   </g>
   <!-- Ceiling mounted operating lamps; put lighting above surgical field -->
   <g filter="url(#vpqSpecShadow)">
     <path d="M606 69v39l-34 24" fill="none" stroke="#9badba" stroke-width="9" stroke-linecap="round"/>
     <path d="M572 132l-19 13" stroke="#9badba" stroke-width="8" stroke-linecap="round"/>
     <ellipse cx="548" cy="152" rx="35" ry="16" fill="#b6d1cd" stroke="#7da9a9" stroke-width="5"/>
     <ellipse cx="548" cy="155" rx="24" ry="10" fill="#fff7d5" stroke="#fff" stroke-width="3"/>
     <path d="M747 69v40l-33 24" fill="none" stroke="#9badba" stroke-width="8" stroke-linecap="round"/>
     <ellipse cx="704" cy="145" rx="33" ry="15" fill="#b6d1cd" stroke="#7da9a9" stroke-width="5"/>
     <ellipse cx="704" cy="147" rx="22" ry="9" fill="#fff7d5" stroke="#fff" stroke-width="3"/>
   </g>
   <!-- Additional theatre accents: multi-LED lights and sterile instrument trolley. -->
   <g filter="url(#vpqSpecShadow)">
      <circle cx="548" cy="155" r="17" fill="#fff8d9" stroke="#e3d9ba" stroke-width="2"/>
      <circle cx="538" cy="151" r="4" fill="#fff"/><circle cx="557" cy="151" r="4" fill="#fff"/><circle cx="548" cy="162" r="4" fill="#fff"/>
      <circle cx="704" cy="147" r="15" fill="#fff8d9" stroke="#e3d9ba" stroke-width="2"/>
      <circle cx="697" cy="144" r="3.5" fill="#fff"/><circle cx="711" cy="144" r="3.5" fill="#fff"/><circle cx="704" cy="153" r="3.5" fill="#fff"/>
      <rect x="687" y="191" width="51" height="15" rx="5" fill="url(#vpqSurgSteel)" stroke="#89abb6" stroke-width="3"/>
      <path d="M696 207v18M729 207v18" stroke="#97adb7" stroke-width="5"/>
      <path d="M695 199h15l6 -5 10 5" stroke="#6d9d9c" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="688" y="214" width="48" height="8" rx="4" fill="#dff7ef"/>
   </g>
   <!-- 3: Surgery table, drape, overhead light, trolley and compact patient silhouette -->
   <g filter="url(#vpqSpecShadow)">
     <rect x="504" y="271" width="235" height="28" rx="12" fill="url(#vpqSurgSteel)" stroke="#89adb5" stroke-width="5"/>
     <path d="M534 295l-10 52M714 295l13 52" stroke="#8aa6ac" stroke-width="12" stroke-linecap="round"/>
     <path d="M542 352h183" stroke="#9caeb7" stroke-width="9" stroke-linecap="round"/>
     <ellipse cx="622" cy="267" rx="93" ry="18" fill="#c6e9dc"/>
     <ellipse cx="628" cy="257" rx="64" ry="20" fill="url(#vpqSurgDrape)" stroke="#78b6a7" stroke-width="3"/>
     <path d="M574 254h106M592 246h67" stroke="#e0fff4" stroke-width="3" opacity=".75"/>
     <ellipse cx="578" cy="244" rx="25" ry="17" fill="#caaf99" stroke="#a58b7c" stroke-width="3"/>
     <path d="M559 235l-5 -17 16 9 13 -8 8 17" fill="#c9aa92" stroke="#a58b7c" stroke-width="2"/>
     <path d="M570 244q5 5 10 0" stroke="#735d5b" stroke-width="2" fill="none"/>
     <path d="M594 263q12 5 24 1" stroke="#f3fff8" stroke-width="3" fill="none"/>
     <rect x="547" y="338" width="147" height="27" rx="10" fill="#fff" stroke="#b4d4d1" stroke-width="3"/>
     <text x="621" y="356" text-anchor="middle" font-family="Arial" font-size="13" font-weight="900" fill="#527b7b">OPERATING TABLE</text>
   </g>
   <!-- Clear architectural partition: recovery is a DIFFERENT room behind a closed door. -->
   <path d="M748 92v253" stroke="#76989f" stroke-width="11"/>
   <path d="M750 95v247" stroke="#f3ffff" stroke-width="3"/>
   <rect x="758" y="97" width="178" height="236" rx="5" fill="#dbedfa" opacity=".28"/>
   <path d="M763 112L917 285" stroke="#fff" stroke-width="4" opacity=".3"/>
   <!-- 4: A separate recovery WARD is depicted beyond sealed glass and its own door.
      This is a room cutaway/navigation preview, NOT a recovery cage in the sterile operating room. -->
   <g>
     <rect x="751" y="92" width="190" height="246" rx="3" fill="#f0eafa" stroke="#9c92b9" stroke-width="7"/>
     <path d="M752 94v246" stroke="#807c9f" stroke-width="9"/>
     <rect x="769" y="105" width="153" height="213" rx="7" fill="#e1f7fc" fill-opacity=".85" stroke="#b6bad9" stroke-width="5"/>
     <path d="M846 108v208" stroke="#a2a3c1" stroke-width="5"/>
     <rect x="847" y="175" width="65" height="128" rx="4" fill="#efe6f6" fill-opacity=".9" stroke="#aa9dc3" stroke-width="3"/>
     <circle cx="902" cy="244" r="4" fill="#927c9f"/>
     <rect x="785" y="236" width="52" height="39" rx="8" fill="#a4cbd3" stroke="#7898ac" stroke-width="3"/>
     <path d="M785 248h52M785 259h52" stroke="#f2fffd" stroke-width="3"/>
     <rect x="781" y="125" width="133" height="34" rx="8" fill="#fff" stroke="#b4acd2" stroke-width="3"/>
     <text x="848" y="138" text-anchor="middle" fill="#71658c" font-size="10" font-family="Arial" font-weight="900">SEPARATE RECOVERY</text>
     <text x="848" y="151" text-anchor="middle" fill="#71658c" font-size="10" font-family="Arial" font-weight="900">WARD · DOOR</text>
     <rect x="772" y="321" width="161" height="31" rx="9" fill="#fff" stroke="#b2aacd" stroke-width="3"/>
     <text x="852" y="340" text-anchor="middle" fill="#71658c" font-family="Arial" font-size="12" font-weight="900">RECOVERY BEHIND DOOR</text>
   </g>
      <!-- Warm sterile charm: no fake interactive buttons or obstructing scenery -->
   <g font-family="Arial" text-anchor="middle" font-size="10" font-weight="800">
     <rect x="90" y="112" width="137" height="27" rx="10" fill="#fff8e5" stroke="#decaa5" stroke-width="3"/>
     <text x="158" y="129" fill="#947b57">CLEAN HANDS · PPE</text>
     <rect x="788" y="120" width="123" height="26" rx="10" fill="#fff8e5" stroke="#decaa5" stroke-width="3"/>
     <text x="850" y="137" fill="#947b57">PATIENT SAFETY</text>
   </g>`;
 }else{
   s+='<g filter="url(#vpqSpecShadow)">'+
   rect(85,211,213,119,'#e8f1ed','#a2bdb2')+
   '<rect x="102" y="248" width="180" height="39" rx="14" fill="#c1dad8"/>'+
   '<path d="M122 320v35M265 320v35" stroke="#8eada9" stroke-width="9"/>'+
   rect(334,200,173,131,'#e8eefa','#a5bbd4')+
   rect(349,216,143,82,'#405972','#92b8cd')+
   '<circle cx="412" cy="257" r="30" fill="#b6cadd"/><circle cx="412" cy="257" r="16" fill="#445971"/>'+
   rect(545,198,176,136,'#fff0dc','#d1b58f')+
   '<rect x="560" y="215" width="145" height="79" rx="8" fill="#fbfaf7"/>'+
   '<text x="632" y="246" text-anchor="middle" font-size="18" font-family="Arial" font-weight="900" fill="#a87b47">☣ BIOHAZARD</text>'+
   '<text x="632" y="276" text-anchor="middle" font-size="12" fill="#ac8155">GLOVES · GOWN</text>'+
   rect(762,208,167,126,'#efeaf9','#b8a7d1')+
   rect(774,221,142,76,'#405670','#a0bed3')+
   '<text x="845" y="257" text-anchor="middle" font-family="Arial" font-size="16" fill="#fff">CASE BOARD</text>'+
   '</g><g text-anchor="middle" font-family="Arial" font-size="15" fill="#756987" font-weight="900">'+
   '<text x="188" y="187">GROSS EXAM</text><text x="417" y="185">HISTOLOGY</text>'+
   '<text x="634" y="182">BIOSECURITY</text><text x="848" y="188">PATIENTS</text></g>';
 }
 return s+'</svg>';
}
window.VPQ_SCENERY.roomArt=k=>data[k]?scene(k):previous(k);
const style=document.createElement('style');
style.textContent='.vpqSpecArt{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'+
'.stage[data-room="surgery"] .prop,.stage[data-room="surgery"] .roomdecor,.stage[data-room="surgery"] .roomBanner,.stage[data-room="skills"] .prop,.stage[data-room="skills"] .roomdecor,.stage[data-room="skills"] .roomBanner,.stage[data-room="clinpath"] .prop,.stage[data-room="isolation"] .prop,.stage[data-room="necropsy"] .prop,.stage[data-room="clinpath"] .roomdecor,.stage[data-room="isolation"] .roomdecor,.stage[data-room="necropsy"] .roomdecor,.stage[data-room="clinpath"] .roomBanner,.stage[data-room="isolation"] .roomBanner,.stage[data-room="necropsy"] .roomBanner{display:none!important}'+
'#vpqSpecHits{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqSpecHit{position:absolute;pointer-events:auto;background:transparent;border:2px solid transparent;border-radius:16px;box-shadow:none;transform:none!important;padding:0}'+
'.vpqSpecHit:hover,.vpqSpecHit:focus-visible,.vpqSpecHit.vpqSpecNear{background:#fff2c52b;border:3px solid #ffcb65;outline:2px solid #fff5cc;box-shadow:0 0 20px #ffc8738e}'+
'.vpqSpecHit span{position:absolute;bottom:-14%;left:50%;transform:translateX(-50%);font-size:clamp(10px,1.10vw,13px);font-weight:900;background:#fffdfb;color:#5b597b;border:3px solid #b7a8d7;border-radius:13px;padding:5px 7px;white-space:normal;min-width:94%;line-height:1.25;box-shadow:0 4px 10px #60718d40}'+
'.vpqSpecHit span small{display:block;font-size:10px;color:#66738c;font-weight:700;line-height:1.2;margin-top:3px}.vpqSpecHit[data-vpqspec-kind="practice"] span{border-color:#e0b583;background:#fff9ec}'+
'.vpqSpecHit.vpqSpecNear span{background:#fff1c9;border-color:#e8b35b}'+
'.stage[data-room="surgery"] .vpqSpecHit{border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important}'+
'.stage[data-room="surgery"] .vpqSpecHit:hover,.stage[data-room="surgery"] .vpqSpecHit:focus-visible,.stage[data-room="surgery"] .vpqSpecHit.vpqSpecNear{border:0!important;outline:0!important;box-shadow:inset 0 -3px 0 #78bca8!important;background:linear-gradient(to top,#c6f2e735,transparent 22%)!important}'+
'.stage[data-room="surgery"] .vpqSpecHit span{border:2px solid #b8cddc;background:#fffffff1;box-shadow:0 2px 7px #506b8530;font-size:clamp(9px,1vw,12px);padding:4px 5px;min-width:90%;border-radius:10px}'+
'.stage[data-room="surgery"] .vpqSpecHit.vpqSpecNear span{background:#e9f7f2;border-color:#8cc4b7}'+
'.vpqSurgToolWall{position:absolute;z-index:8;pointer-events:auto;cursor:pointer;border:1px solid transparent;background:transparent;border-radius:8px;box-shadow:none;color:transparent;font-size:0;padding:0}'+
'.vpqSurgToolWall:hover,.vpqSurgToolWall:focus-visible{border:2px solid #80b6c6;background:#ebfbff7d;outline:0;box-shadow:0 0 8px #a4d6de70}'+
'.vpqSurgAirwayWall{position:absolute;z-index:8;pointer-events:auto;cursor:pointer;background:transparent;border:1px solid transparent;box-shadow:none;padding:0}'+
'.vpqSurgAirwayWall:hover,.vpqSurgAirwayWall:focus-visible{background:#eefaff66;border:2px solid #8bbfcc;outline:0;box-shadow:none}'+

'.vpqClinpathQuickLinks{position:absolute;left:9%;right:9%;bottom:2%;height:13%;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:16px minmax(0,1fr);gap:3px 7px;align-items:stretch;pointer-events:auto;z-index:12}.vpqClinpathQuickLinks .vpqQuickTitle{grid-column:1/4;display:block;font-weight:900;font-size:clamp(10px,1.05vw,12px);color:#665180;text-align:center;letter-spacing:.5px;line-height:16px}.vpqClinpathQuickLinks .vpqPracticeTitle{grid-column:4/5}.vpqClinpathQuickLinks button{border:2px solid #afbddb;border-radius:12px;background:#fff;color:#3e5279;font-size:clamp(9px,1.05vw,13px);font-weight:900;padding:4px;min-width:0;white-space:normal;line-height:1.2;box-shadow:0 2px 5px #40517133;cursor:pointer}.vpqClinpathQuickLinks button[data-vpq-type="practice"]{border-color:#e1b36f;background:#fff2d7}.vpqClinpathQuickLinks button:hover,.vpqClinpathQuickLinks button:focus-visible{background:#e6f5ff;border-color:#729ad0}.vpqLearnShelfLink{position:absolute;left:3%;top:15%;width:18%;height:15%;border:2px solid transparent;border-radius:13px;background:transparent;cursor:pointer;z-index:13;pointer-events:auto}.vpqLearnShelfLink:hover,.vpqLearnShelfLink:focus-visible{border-color:#d8ad53;background:#ffedaa2b;outline:2px solid #fff6d8}.vpqLearnShelfLink:focus-visible{outline-offset:2px}'+
'.vpqBenchGuide{position:absolute;top:42%;width:24px;height:24px;border:2px solid #a69ac6;border-radius:50%;background:#fffef8;color:#684f86;font-size:13px;font-weight:900;line-height:18px;padding:0;pointer-events:auto;z-index:14;cursor:help;box-shadow:0 1px 4px #6c628142}.vpqBenchGuide:hover,.vpqBenchGuide:focus-visible{background:#fff3cc;border-color:#d1a15d;outline:2px solid #fff7de}'+
'.stage[data-room="clinpath"] .interactToast{left:7px;top:5px;max-width:128px;font-size:9px;padding:4px 6px;line-height:1.15;border-width:1px;border-radius:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:none;background:#ffffffeb}'+
'.stage[data-room="clinpath"] .vpqSpecHit[data-vpqspecact="advancedCases"]{z-index:6;cursor:pointer}'+
'.stage[data-room="clinpath"] .vpqSpecHit span{display:none!important}.stage[data-room="clinpath"] .vpqSpecHit{border-radius:17px}.stage[data-room="clinpath"] .vpqSpecHit.vpqSpecNear:after{top:auto;bottom:5%;font-size:11px}.stage[data-room="clinpath"] .vpqSpecHit:hover{background:#fff6c82a}'+
'.stage[data-room="surgery"] .vpqSpecHit.vpqSpecNear:after{display:none!important}'+
'.vpqSpecHit.vpqSpecNear:after{content:"E · INTERACT";position:absolute;top:1%;left:50%;transform:translateX(-50%);font-size:11px;font-weight:900;color:#744d22;background:#fff8dd;border:2px solid #e9bf76;border-radius:12px;padding:4px 8px;white-space:nowrap}'+
'@media(max-width:650px){.vpqSpecHit span{font-size:10px;padding:4px 5px;white-space:normal;min-width:80%}}';
document.head.appendChild(style);

const isolationPolish=document.createElement('style');
isolationPolish.id='vpq-isolation-room-polish';
isolationPolish.textContent=
 '.stage[data-room="isolation"] #vpqSpecHits .vpqSpecHit{border:1px solid transparent;background:transparent;box-shadow:none}'+
 '.stage[data-room="isolation"] #vpqSpecHits .vpqSpecHit:hover,.stage[data-room="isolation"] #vpqSpecHits .vpqSpecHit:focus-visible,.stage[data-room="isolation"] #vpqSpecHits .vpqSpecHit.vpqSpecNear{border:1.5px solid #74b0a8!important;background:#c9eee514!important;outline:none!important;box-shadow:0 0 0 2px #c7e9df66!important}'+
 '.stage[data-room="isolation"] #vpqSpecHits .vpqSpecHit span{font-size:11px;min-width:0;width:max-content;max-width:100%;top:-12%;bottom:auto;padding:4px 8px;border:1.5px solid #9ebcb5;background:#fffdf7;color:#466a6b;box-shadow:0 2px 5px #2f555324}'+
 '.stage[data-room="isolation"] #vpqSpecHits .vpqSpecHit.vpqSpecNear span{background:#edf8ef!important;border-color:#8cb9aa!important}'+
 '.stage[data-room="isolation"] #vpqSpecHits .vpqIsoHelp{position:absolute;pointer-events:auto;width:31px;height:31px;min-width:31px;min-height:31px;padding:0;border-radius:50%;background:#fff5c9;color:#304f91;border:3px solid #5c82bc;z-index:19;font-size:19px;line-height:1;font-weight:1000;transform:none!important;box-shadow:0 2px 8px #263e6870}'+
 '.stage[data-room="isolation"] #vpqSpecHits .vpqIsoHelp:hover{background:#e0f6ee}'+
 '.stage[data-room="isolation"] #vpqSpecHits .vpqIsoEquipmentHelp{width:29px;height:29px;min-width:29px;min-height:29px;font-size:17px;background:#fff5c9;border-color:#6485b3}';
document.head.appendChild(isolationPolish);
const isoCaseStyle=document.createElement('style');
isoCaseStyle.textContent=
 '.stage[data-room="isolation"] .vpqIsoChoose,.stage[data-room="isolation"] .vpqIsoCases,.stage[data-room="isolation"] .vpqIsoTest{position:absolute;z-index:16;top:88%;height:31px;padding:3px 8px;font-size:11px;font-weight:900;border:2px solid #a8c7c8;border-radius:11px;background:#fffcf5f5;color:#366d70;box-shadow:0 2px 5px #365a5a22;white-space:nowrap;transform:none;display:flex;align-items:center;justify-content:center}'+
 '.stage[data-room="isolation"] .vpqIsoChoose{left:9%;width:22%}'+
 '.stage[data-room="isolation"] .vpqIsoTest{left:39%;width:22%}'+
 '.stage[data-room="isolation"] .vpqIsoCases{left:68%;width:22%}'+
 '.stage[data-room="isolation"] .vpqSpecHit[data-vpqspecact="vpqIsoChooseCompanion"] span,.stage[data-room="isolation"] .vpqSpecHit[data-vpqspecact="ohLibrary"] span,.stage[data-room="isolation"] .vpqSpecHit[data-vpqspecact="ohHub"] span{display:none!important}'+
 '.stage[data-room="isolation"] .vpqIsoHelp{opacity:1;transition:background .16s ease,box-shadow .16s ease}'+
 '.stage[data-room="isolation"] .vpqIsoHelp:hover,.stage[data-room="isolation"] .vpqIsoHelp:focus-visible{opacity:1;background:#fff1bc;box-shadow:0 0 0 3px #fff9db,0 4px 12px #354d7699;outline:2px solid #425c9e;outline-offset:2px}'+
 '.stage[data-room="isolation"] .vpqIsoChoose:hover,.stage[data-room="isolation"] .vpqIsoCases:hover,.stage[data-room="isolation"] .vpqIsoTest:hover{background:#e0f8f2;border-color:#5b9e9c}'+
 '@media(max-width:700px){.stage[data-room="isolation"] .vpqIsoChoose,.stage[data-room="isolation"] .vpqIsoCases,.stage[data-room="isolation"] .vpqIsoTest{font-size:9px;padding:3px 4px;height:29px}}';
document.head.appendChild(isoCaseStyle);
// Phase G: keep interaction controls legible without adding more always-on labels.
const isoFinalPolish=document.createElement('style');
isoFinalPolish.id='vpq-onehealth-phase-g-controls';
isoFinalPolish.textContent=
 '.stage[data-room="isolation"] .vpqIsoChoose,.stage[data-room="isolation"] .vpqIsoTest,.stage[data-room="isolation"] .vpqIsoCases{border-color:#8caec2;background:#fffdfcf5;box-shadow:0 3px 7px #536e8a2e;line-height:1.2}'+
 '.stage[data-room="isolation"] .vpqIsoChoose:focus-visible,.stage[data-room="isolation"] .vpqIsoTest:focus-visible,.stage[data-room="isolation"] .vpqIsoCases:focus-visible{outline:3px solid #4578bc;outline-offset:2px}'+
 '.stage[data-room="isolation"] .vpqIsoHelp:focus-visible{outline:3px solid #314f96;outline-offset:2px}'+
 '@media(max-width:700px){.stage[data-room="isolation"] #vpqSpecHits .vpqIsoHelp{width:28px;height:28px;min-width:28px;min-height:28px;font-size:17px}.stage[data-room="isolation"] .vpqIsoChoose,.stage[data-room="isolation"] .vpqIsoTest,.stage[data-room="isolation"] .vpqIsoCases{font-size:10px;line-height:1.1}}';
document.head.appendChild(isoFinalPolish);



// Necropsy labels should not cover the illustrated tables, specimens, or player.
const necroStyle=document.createElement('style');
necroStyle.textContent='.stage[data-room="necropsy"] .vpqSpecHit span{bottom:-1%;min-width:0;width:max-content;max-width:125px;white-space:normal;font-size:10px;line-height:1.15;padding:3px 6px;border-width:1px;border-radius:9px;background:#fffdf4e8;box-shadow:0 2px 5px #60718d27;opacity:.68;transition:opacity .15s,transform .15s}'+
'.stage[data-room="necropsy"] .vpqSpecHit span small{display:none}'+
'.stage[data-room="necropsy"] .vpqSpecHit:hover span,.stage[data-room="necropsy"] .vpqSpecHit:focus-visible span,.stage[data-room="necropsy"] .vpqSpecHit.vpqSpecNear span{opacity:1;background:#fff9eb;max-width:150px;font-size:11px;border-width:2px;z-index:3}'+
'.stage[data-room="necropsy"] .vpqSpecHit:hover span small,.stage[data-room="necropsy"] .vpqSpecHit:focus-visible span small,.stage[data-room="necropsy"] .vpqSpecHit.vpqSpecNear span small{display:block;font-size:9px;margin-top:2px}'+
'.stage[data-room="necropsy"] .vpqSpecHit.vpqSpecNear:after{font-size:9px;padding:2px 5px;top:2%}'+
'@media(max-width:650px){.stage[data-room="necropsy"] .vpqSpecHit span{max-width:85px;font-size:9px;padding:2px 3px}}';
document.head.appendChild(necroStyle);
const necroPolish=document.createElement('style');
necroPolish.textContent='.stage[data-room="necropsy"] .vpqSpecHit span{bottom:3%;font-size:9px;line-height:1.1;padding:2px 4px;max-width:105px;opacity:.48;border:1px solid #c5b5c8;background:#fffdf6d9;box-shadow:0 1px 3px #42567426}'+
'.stage[data-room="necropsy"] .vpqSpecHit:hover span,.stage[data-room="necropsy"] .vpqSpecHit:focus-visible span,.stage[data-room="necropsy"] .vpqSpecHit.vpqSpecNear span{opacity:1;max-width:145px;font-size:10px;background:#fffbea;border:2px solid #d4ae78}'+
'.stage[data-room="necropsy"] .vpqSpecHit{border-radius:10px}'+
'.stage[data-room="necropsy"] .vpqSpecHit.vpqSpecNear:after{top:5%;font-size:9px;padding:2px 5px}';
document.head.appendChild(necroPolish);
const necroGuideStyle=document.createElement('style');
necroGuideStyle.textContent='.stage[data-room="necropsy"] .vpqNecroGuide{position:absolute;right:2%;top:2%;z-index:15;pointer-events:auto;border:2px solid #b6a3c6;border-radius:10px;background:#fffaf0eb;color:#635976;font-size:11px;font-weight:900;padding:5px 9px;box-shadow:0 2px 7px #4b57702d;white-space:nowrap}'+
'.stage[data-room="necropsy"] .vpqNecroGuide:hover,.stage[data-room="necropsy"] .vpqNecroGuide:focus-visible{background:#f4e4ff;border-color:#866fb1}'+
'.stage[data-room="necropsy"] .vpqSpecHit[data-vpqspecact="necroBio"] span{bottom:3%;left:49%;max-width:125px}'+
'.stage[data-room="necropsy"] .vpqSpecHit[data-vpqspecact="necroCases"] span{bottom:5%}';
document.head.appendChild(necroGuideStyle);
const necroQuestionStyle=document.createElement('style');
necroQuestionStyle.textContent='.stage[data-room="necropsy"] .vpqNecroHelp{position:absolute;z-index:18;pointer-events:auto;width:26px;height:26px;padding:0;transform:translate(-50%,-50%);display:grid;place-items:center;border-radius:50%;border:2px solid #967fba;background:#fff9e9;color:#725b99;box-shadow:0 2px 7px #43526e4a;font-size:15px;font-weight:900;line-height:1;cursor:help}'+
'.stage[data-room="necropsy"] .vpqNecroHelp:hover,.stage[data-room="necropsy"] .vpqNecroHelp:focus-visible{background:#eadcff;border-color:#6f56a4;outline:2px solid #fff5bf;outline-offset:2px;transform:translate(-50%,-50%) scale(1.1)}'+
'@media(max-width:640px){.stage[data-room="necropsy"] .vpqNecroHelp{width:23px;height:23px;font-size:13px}}';
document.head.appendChild(necroQuestionStyle);




// The ? help panels describe actual station destinations; no phantom separate activity.
const necroHelp={
 necroGross:{title:'🦴 Specimen Cabinet',tag:'GROSS · OBSERVE',opens:'Opens the Specimen Cabinet in its gross-lesion view.',learn:'Identify the organ, location, lesion type, distribution and appearance before naming a cause.',different:'This is a specimen-based atlas, not a patient scenario.',next:'Compare histology or attempt guided morphologic diagnosis.'},
 necroShelf:{title:'📚 Handbook Shelf',tag:'LEARN FIRST',opens:'Opens a menu: the Necropsy Handbook (Exam 7 lectures) or General Pathology (Exams 1–2, Lectures 1–30).',learn:'Systemic lecture handbooks plus the general pathology foundations: cell injury, inflammation, immunology, circulation, neoplasia.',different:'The reading shelf. The Specimen Cabinet and Patient Cases are for practice.',next:'Pick a book, then practise in the cabinet or cases.'},
 necroHandbook:{title:'📚 Necropsy Handbook',tag:'LECTURES · LEARN FIRST',opens:'Opens the pathology lecture and body-system handbook.',learn:'Learn gross lesions, histology, pathogenesis, differentials and why the body responds as it does.',different:'The reference and learning station rather than an unknown-specimen challenge.',next:'Take what you learned to the Specimen Cabinet or Patient Cases.'},
 necroDx:{title:'📋 Diagnosis Board',tag:'MORPHOLOGY · PRACTICE',opens:'Currently opens the same gross Specimen Cabinet page as the gross-lesion station.',learn:'Write a supported morphologic diagnosis: organ/tissue, process, distribution and relevant modifiers.',different:'The focus is precise lesion description, not guessing a specific etiology.',next:'Select the guided morphologic-diagnosis activity within the shared atlas.'},
 necroHisto:{title:'🔬 Microscope',tag:'HISTOLOGY · EXPLAIN WHY',opens:'Opens the shared Specimen Cabinet with histology-focused study selected.',learn:'Identify microscopic patterns of cellular injury, inflammation, degeneration, neoplasia and repair.',different:'Focuses on microscopic evidence and why it produces the gross lesion.',next:'Compare the corresponding gross lesion and related diagnosis.'},
 necroCases:{title:'📋 Patient Cases',tag:'CLINICAL · DIFFERENTIALS',opens:'Opens the dedicated Differential Diagnosis Case Center.',learn:'Use signalment, history, gross lesions, histology and testing to rank and distinguish diagnoses.',different:'Multispecies patient-based clinical reasoning instead of a specimen-only reference.',next:'Review the linked lecture and atlas sources when available.'},
 necroSpecPrep:{title:'🧪 Specimen Prep',tag:'COLLECT · HANDLE · SUBMIT',opens:'Opens the necropsy specimen collection and submission learning station.',learn:'Learn which specimens to collect, when to collect them, how to select samples, avoid contamination, preserve tissue and submit to a diagnostic laboratory.',different:'Covers collection workflow rather than morphologic diagnosis or differential identification.',next:'Practice separate PPE and biosecurity questions at the Boot Wash station.'},
 pathFoundations:{title:'📘 General Pathology',tag:'EXAMS 1–2 · LEARN FIRST',opens:'Opens Pathology Foundations (Lectures 1–30) and the Exam 2 study units.',learn:'Cell injury and death, growth disorders, circulation, immunology, inflammation, morphologic diagnosis and neoplasia.',different:'General (Exams 1–2) material; the Necropsy Handbook and Specimen Cabinet cover the systemic Exam 7 lectures.',next:'Start with a lecture unit, then practise in its class cases.'},
 necroBio:{title:'🧼 Cleaning & PPE',tag:'SAFETY · SAMPLING',opens:'Opens the necropsy biosecurity and sampling activity.',learn:'Review PPE, clean/dirty workflow, sample handling, contamination and decontamination.',different:'Protects staff and sample integrity; it is not a diagnostic case center.',next:'Apply precautions to necropsy scenarios and sample collection.'}
};
function necroHelpModal(action){
 const h=necroHelp[action];if(!h)return;
 const item=(label,body)=>'<div style="padding:10px 12px;border:1px solid #d5e2ef;border-radius:10px;background:white;margin:8px 0"><b style="display:block;color:#214b78;font-size:13px;margin-bottom:5px">'+label+'</b><div style="font-size:13px;line-height:1.55;color:#304862">'+body+'</div></div>';
 api.showModal(h.title,'<div style="padding:11px 13px;border-radius:10px;background:#eaf3ff;border-left:4px solid #668dc5"><small style="font-weight:900;letter-spacing:.06em;color:#4a6b97">'+h.tag+'</small><p style="margin:6px 0 0;font-weight:800;color:#25486d;font-size:13px">'+h.opens+'</p></div>'+
 item('What you learn',h.learn)+item('What makes this station different',h.different)+item('Where to go next',h.next)+
 '<p class="tiny">The question mark provides information only. Click the actual station or walk nearby and press E to enter.</p>');
}

const isoHelp={
 onehealth:['🐶 Isolation patient','Assess the patient, identify plausible transmission routes, and choose appropriate precautions based on the suspected or confirmed pathogen. Separate contaminated equipment and clean/disinfect between patients.'],
 ohLibrary:['📚 Disease library','Review pathogen reservoir, zoonotic potential, exposure routes, susceptible species, environmental persistence, infection-control guidance, and reporting considerations.'],
 ohHub:['🛡️ Public health','Explore surveillance, case reporting, source investigation and risk communication. Reporting requirements depend on disease and jurisdiction.'],
 ppe:['🧤 PPE & entry','Use the isolation precautions appropriate to the suspected pathogen. Choose and don PPE before entering, and doff according to facility protocol while preventing contamination. Hand hygiene remains essential.'],
 wash:['🧼 Handwashing station','Perform hand hygiene at required points of care, especially after glove removal. Use soap and water when specifically required for a pathogen or when hands are visibly soiled.'],
 clean:['🧽 Decontamination &amp; doffing','Use patient-dedicated equipment and remove PPE according to the facility isolation protocol without contaminating clean surfaces. Perform hand hygiene after glove removal. Clean organic material before using a pathogen-appropriate disinfectant at its labeled contact time. The right-wall alcove is an educational illustration, not a real isolation airlock.'],
 waste:['☣️ Waste handling','Segregate contaminated materials into appropriate designated containers based on facility policy and local rules. Do not assume all infectious waste requires identical disposal.'],
 boot:['👢 Entry threshold','Keep isolation-zone footwear and equipment from spreading contamination. Follow the facility-specific clean-to-dirty workflow; a floor mat does not replace cleaning, PPE or hand hygiene.']
};
function isoHelpModal(action){
 const info=isoHelp[action];if(!info)return;
 api.showModal(info[0]+' · Station guide','<div class="infobox"><b>What this station does</b><p>'+info[1]+'</p></div>'+
 '<div class="infobox"><b>Clean-to-dirty workflow</b><p>Check the required isolation category; perform hand hygiene; don indicated PPE; use dedicated equipment; clean and disinfect with the correct product and contact time; remove PPE and perform hand hygiene when leaving. Adjust the sequence to the actual pathogen, facility protocol and exposure risk.</p></div>'+
 '<p class="tiny">The question mark opens this explanation only. Select the corresponding station to enter the activity.</p>');
}
function refresh(){
 const room=stage.dataset.room,old=stage.querySelector('#vpqSpecHits');
 if(!data[room]){old?.remove();return}
 if(old?.dataset.room===room)return;
 old?.remove();const div=document.createElement('div');div.id='vpqSpecHits';div.dataset.room=room;
 div.innerHTML=data[room].map(p=>'<button type="button" class="vpqSpecHit" style="left:'+p.x+'%;top:'+p.y+'%;width:'+p.w+'%;height:'+p.h+'%" data-vpqspecact="'+p.action+'" data-vpqspec-kind="'+(p.kind||'practice')+'" title="'+(p.hint||p.label)+'" aria-label="'+p.label+(p.subtitle?' — '+p.subtitle:'')+'"><span>'+p.label+(p.subtitle?'<small>'+p.subtitle+'</small>':'')+'</span></button>').join('')+
 (room==='surgery'?'<button type="button" class="vpqSurgAirwayWall" style="left:2.6%;top:49%;width:5.8%;height:18%" data-vpqsurgairway="1" title="Airway equipment: ET tubes and safety" aria-label="Open endotracheal tube wall board"> </button>':'')+
 (room==='surgery'?'<button type="button" class="vpqSurgToolWall" style="left:2.2%;top:22%;width:6.5%;height:26%" data-vpqsurgtools="1" title="Surgical instruments: identify each tool and its purpose" aria-label="Open Surgical Tool Quick Guide and practice">?</button>':'')+
 (room==='clinpath'?['coag','gas','urine','hybrid','cases','microscopy'].map((key,i)=>'<button type="button" class="vpqBenchGuide" style="left:'+([13.7,30.1,46.5,62.9,79.3,95.2][i])+'%" data-vpqbench-guide="'+key+'" title="What does this lab equipment do?" aria-label="About '+key+' equipment and specimen interpretation">?</button>').join(''):'')+
 (room==='isolation'?
 '<button type="button" class="vpqIsoChoose" data-vpqisopatient="1" title="Choose from your owned companion collection">🐾 Place Pet</button>'+ 
 '<button type="button" class="vpqIsoCases" data-vpqisocases="1" title="Open separate One Health clinical cases">🩺 Cases</button>'+ 
 '<button type="button" class="vpqIsoTest" data-vpqisotest="1" title="Specimen testing and lab biosafety overview">🧪 Lab Testing</button>'+
 // Phase F: intentional help positions outside primary equipment and patient artwork.
 [['onehealth',36,36],['ohLibrary',63,32],['ohHub',91,36]].map(([key,left,top])=>'<button type="button" class="vpqIsoHelp" style="left:'+left+'%;top:'+top+'%" data-vpqisohelp="'+key+'" title="About '+isoHelp[key][0]+'" aria-label="Help: '+isoHelp[key][0]+'">?</button>').join('')+
 [['ppe',5,48],['wash',39,57],['clean',96,73],['waste',12,74]].map(([key,left,top])=>'<button type="button" class="vpqIsoHelp vpqIsoEquipmentHelp" style="left:'+left+'%;top:'+top+'%" data-vpqisohelp="'+key+'" title="About '+isoHelp[key][0]+'" aria-label="Help: '+isoHelp[key][0]+'">?</button>').join('')
 :'')+
 (room==='necropsy'?data.necropsy.filter(p=>necroHelp[p.action]).map(p=>'<button type="button" class="vpqNecroHelp" data-vpqnecro-help="'+p.action+'" style="left:'+Math.min(95,p.x+p.w-2)+'%;top:'+Math.max(3,p.y-3)+'%" title="About '+p.label+'" aria-label="What does '+p.label+' teach?">?</button>').join(''):'')+
 (room==='necropsy'?'<button type="button" class="vpqNecroGuide" data-vpqnecro-guide="1" title="What does each Necropsy station do?" aria-label="Necropsy room guide: what each station teaches">? What’s where</button>':'')+
 (room==='clinpath'?'<button type="button" class="vpqLearnShelfLink" data-vpqspecact="vpqClinpathGuided" title="Start here — what CBC, chemistry and each diagnostic test measures" aria-label="Beginner Clinical Pathology report-reading guide"></button><div class="vpqClinpathQuickLinks" role="group" aria-label="Clinical Pathology study and practice shortcuts"><div class="vpqQuickTitle">📚 STUDY &amp; REFERENCE</div><div class="vpqQuickTitle vpqPracticeTitle">🎯 PRACTICE</div><button type="button" data-vpqspecact="vpqClinpathGuided" title="Learn clinical pathology from the beginning">📖 Start Here</button><button type="button" data-vpqspecact="vpqClinpathAtlas" title="Visual microscope and urine morphology atlas">🔬 Microscope Atlas</button><button type="button" data-vpqspecact="vpqClinpathCellReference" title="Cell identification and morphology reference">🩸 Cell Recognition</button><button type="button" data-vpq-type="practice" data-vpqspecact="vpqClassicSmear" title="Blood smear identification quizzes">🎯 Smear Quizzes</button></div>':'');
 div.addEventListener('click',e=>{
 const isoChoose=e.target.closest('[data-vpqisopatient]');if(isoChoose){e.preventDefault();e.stopPropagation();isoPatientSelector();return}
 const isoCasesButton=e.target.closest('[data-vpqisocases]');if(isoCasesButton){e.preventDefault();e.stopPropagation();return api.doAction('onehealth')}
 const isoTestClick=e.target.closest('[data-vpqisotest]');if(isoTestClick){e.preventDefault();e.stopPropagation();isoSpecimenIntro();return}
 const isoGuide=e.target.closest('[data-vpqisohelp]');
 if(isoGuide){e.preventDefault();e.stopPropagation();isoHelpModal(isoGuide.dataset.vpqisohelp);return}
 const help=e.target.closest('[data-vpqnecro-help]');
 if(help){e.preventDefault();e.stopPropagation();necroHelpModal(help.dataset.vpqnecroHelp);return}
 if(e.target.closest('[data-vpqnecro-guide]')){
  api.showModal('🦴 Necropsy Lab · Station Guide',
  '<p><b>How the room fits together:</b> Handbook → Gross observations → Morphologic diagnosis → Histology → Patient differentials. PPE and sampling apply throughout.</p>'+
  '<div style="background:#f7faff;border:1px solid #d6e3ef;border-radius:11px;padding:12px;font-size:13px;line-height:1.75">'+
  '<b>📚 Handbook:</b> lecture reference, pathology and WHY.<hr style="border:0;border-top:1px solid #dce7f2">'+
  '<b>🦴 Specimen Cabinet:</b> gross specimen atlas.<hr style="border:0;border-top:1px solid #dce7f2">'+
  '<b>📋 Diagnosis Board:</b> guided morphologic diagnosis. Shares the gross atlas page for now.<hr style="border:0;border-top:1px solid #dce7f2">'+
  '<b>🔬 Microscope:</b> histology view of the shared specimen atlas.<hr style="border:0;border-top:1px solid #dce7f2">'+
  '<b>🐾 Patient Cases:</b> dedicated multispecies differential diagnosis cases.<hr style="border:0;border-top:1px solid #dce7f2">'+
  '<b>🧼 Cleaning & PPE:</b> necropsy safety and sampling.</div>'+
  '<div style="margin-top:10px;padding:11px 13px;border:1px solid #d7c8e5;background:#f6f0fa;border-radius:10px;font-size:13px"><b>🔎 Future Veterinary Forensics Case Files</b><p style="margin:5px 0">Planned as a separate case library and station. It will focus on scene and history, documentation, injuries, postmortem changes, evidence handling, and defensible interpretations. No forensic cases are currently included.</p></div>'+
  '<p class="tiny">Click a station or walk up and press E. The stainless tables are scenery, not separate clickable stations.</p>');return}
 const airway=e.target.closest('[data-vpqsurgairway]');if(airway){e.preventDefault();e.stopPropagation();return api.showModal('🫁 ET Tube &amp; Airway Equipment Board','<p><b>Endotracheal tubes:</b> help maintain a patent airway and deliver inhalant anesthetic and oxygen when indicated.</p><p><b>Quick check:</b> distinguish tube size, cuff, connector, pilot balloon and depth markings; select an appropriate tube using patient assessment and clinic protocol.</p><p><b>Safety:</b> check equipment function, confirm placement using appropriate clinical methods and capnography where available, secure the tube and monitor the patient. Avoid traumatic insertion and overinflating the cuff.</p><p><b>Clinical skills link:</b> practice tube setup, sterile preparation and handling with supervised instruction. This is an introductory reference, not an intubation procedure.</p>')}
 const toolsButton=e.target.closest('[data-vpqsurgtools]');if(toolsButton){e.preventDefault();e.stopPropagation();return window.VPQ_SURGICAL_TOOL_LAB?.open?.()}
 const guide=e.target.closest('[data-vpqbench-guide]');if(guide){if(guide.dataset.vpqbenchGuide==='hybrid')return api.doAction('advancedHybrid');window.VPQ_CLINPATH_BENCH_GUIDES?.open?.(guide.dataset.vpqbenchGuide,api);return}const b=e.target.closest('[data-vpqspecact]');if(b){
 if(room==='clinpath'){
  if(b.dataset.vpqspecact==='vpqClinpathGuided'){
   e.preventDefault();e.stopPropagation();
   return window.VPQ_CLINPATH_REPORT_ACADEMY?.open?.('start');
  }
  const guideByAction={advancedCoag:'coag',advancedGas:'gas',advancedUrine:'urine',advancedCases:'cases',vpqClassicSmear:'microscopy'};
  const station=guideByAction[b.dataset.vpqspecact];
  if(station){
   e.preventDefault();e.stopPropagation();
   return window.VPQ_CLINPATH_BENCH_GUIDES?.open?.(station,api);
  }
 }
if(b.dataset.vpqspecact==='vpqIsoChooseCompanion'){e.preventDefault();e.stopPropagation();isoPatientSelector();return}
 if(b.dataset.vpqspecact==='advancedCases'&&typeof window.VPQ_CLINPATH_REFERRAL_PILOT?.home==='function'){e.preventDefault();e.stopPropagation();return window.VPQ_CLINPATH_REFERRAL_PILOT.home()}return api.doAction(b.dataset.vpqspecact)}});
 stage.appendChild(div);
}
function updateNearby(room,x){
 const items=data[room];if(!items)return null;
 let best=null;for(const p of items){const d=Math.abs(x-p.walk);if(d<17&&(!best||d<best.distance))best={...p,distance:d}}
 stage.querySelectorAll('#vpqSpecHits .vpqSpecHit').forEach(el=>{
  const on=!!best&&el.dataset.vpqspecact===best.action;
  el.classList.toggle('vpqSpecNear',on);
  el.setAttribute('aria-current',on?'true':'false');
 });
 return best;
}
function interactNearest(room,x){
 const best=updateNearby(room,x);if(!best)return false;
 if(best.action==='vpqIsoChooseCompanion'){isoPatientSelector();return true}
 if(best.action==='advancedCases'&&typeof window.VPQ_CLINPATH_REFERRAL_PILOT?.home==='function'){window.VPQ_CLINPATH_REFERRAL_PILOT.home();return true}api.doAction(best.action);return true;
}
const observer=new MutationObserver(()=>{const room=stage.dataset.room,present=stage.querySelector('#vpqSpecHits');if(!!data[room]!==!!present||(present&&present.dataset.room!==room))refresh()});
observer.observe(stage,{attributes:true,attributeFilter:['data-room'],childList:true});
refresh();
return {refresh,updateNearby,interactNearest};
};