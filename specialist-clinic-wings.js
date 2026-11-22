/* Vet Pharm Quest: walkable specialist clinic wings.
 * Treatment Ward = in-house diagnostics; Clinical Pathology = optional advanced lab.
 * Standalone original SVG backgrounds; existing games and save keys unchanged.
 */
window.VPQ_SPECIALIST_ROOMS=function(api){
'use strict';
const stage=document.getElementById('stage');if(!stage||!window.VPQ_SCENERY)return null;
const previous=window.VPQ_SCENERY.roomArt.bind(window.VPQ_SCENERY);
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
  {x:9,y:38,w:23,h:33,walk:23,label:'🐶 Isolation Patient',action:'onehealth'},
  {x:39,y:38,w:23,h:32,walk:52,label:'📚 Disease Library',action:'ohLibrary'},
  {x:71,y:38,w:22,h:32,walk:81,label:'🛡️ Public Health',action:'ohHub'}
 ],
 necropsy:[
  {x:3,y:25,w:20,h:45,walk:14,label:'🦴 Specimen Cabinet',subtitle:'Identify gross lesions',hint:'Gross pathology: recognize the organ, describe the lesion and practice gross diagnoses',action:'necroGross'},
  {x:25,y:27,w:16,h:44,walk:33,label:'📚 Necropsy Handbook',subtitle:'Learn each condition',hint:'Learn First: lecture diseases, gross changes, histology, WHY and differentials',action:'necroHandbook'},
  {x:42,y:30,w:16,h:42,walk:50,label:'📋 Diagnosis Board',subtitle:'Write a morphologic DX',hint:'Morphologic diagnosis: organ, distribution, process and severity',action:'necroDx'},
  {x:59,y:31,w:17,h:42,walk:68,label:'🔬 Microscope',subtitle:'Histology & WHY',hint:'Histology atlas: microscopic features, tissue changes and pathogenesis',action:'necroHisto'},
  {x:78,y:25,w:19,h:44,walk:82,label:'🐾 Case Board',subtitle:'Apply clinical findings',hint:'Patient cases: combine gross lesions, clinical findings and diagnostic reasoning',action:'necroCases'},
  {x:79,y:71,w:18,h:23,walk:93,label:'🧼 Boot Wash & PPE',subtitle:'Biosecurity & sampling',hint:'Biosecurity: PPE, cleaning and specimen handling',action:'necroBio'}
 ],
 skills:[
  {x:7,y:39,w:26,h:41,walk:19,label:'💉 Injection Practice',action:'injectionPractice'},
  {x:36,y:39,w:27,h:41,walk:50,label:'🩸 Blood Draw',action:'venipuncturePractice'},
  {x:70,y:39,w:24,h:41,walk:82,label:'🧪 Sample Handling',action:'diagnosticSkills'}
 ],
 surgery:[
  {x:5,y:40,w:22,h:39,walk:16,label:'🧽 Sterile Prep',action:'surgPrep'},
  {x:28,y:40,w:21,h:39,walk:39,label:'💗 Anesthesia',action:'surgMonitor'},
  {x:52,y:40,w:20,h:39,walk:63,label:'🛏️ Recovery',action:'surgRecovery'},
  {x:76,y:40,w:21,h:39,walk:87,label:'🐾 Patient Cases',action:'surgCases'}
 ]

};
const rect=(x,y,w,h,fill,stroke='#a4b7c9')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="13" fill="'+fill+'" stroke="'+stroke+'" stroke-width="5"/>';
function scene(key){
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
 '<g filter="url(#vpqSpecShadow)">'+rect(321,92,359,54,'#fffdfd','#a8b9d6')+
 '<text x="500" y="127" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="#607b90" text-anchor="middle">'+label+'</text></g>';
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
   // Isolation kennel and recognizable canine patient.
   '<rect x="94" y="192" width="230" height="155" rx="14" fill="#c6e7de" stroke="#79aaa0" stroke-width="7"/>'+
   '<rect x="109" y="208" width="200" height="121" rx="9" fill="#ecf8f3" stroke="#aacdc2" stroke-width="3"/>'+
   '<rect x="115" y="292" width="187" height="27" rx="8" fill="#c3d4c6"/>'+
   '<rect x="120" y="310" width="174" height="7" rx="3" fill="#9dbbaf"/>'+
   '<path d="M115 209v119M309 209v119" stroke="#d4e8df" stroke-width="5"/>'+
   '<path d="M306 215v108" stroke="#78a89b" stroke-width="3"/>'+
   '<circle cx="306" cy="267" r="4" fill="#e0c589"/>'+
   // Patient scaled to leave a proper visible kennel interior and washable bedding.
   '<g transform="translate(63 79) scale(.70)">'+
   '<path d="M258 278q27 -24 31 1" stroke="#b68464" stroke-width="10" fill="none" stroke-linecap="round"/>'+
   '<path d="M178 289v25M238 289v25" stroke="#b78669" stroke-width="11" stroke-linecap="round"/>'+
   '<ellipse cx="218" cy="286" rx="52" ry="27" fill="#dfae83" stroke="#b98869" stroke-width="3"/>'+
   '<path d="M189 268q21 -14 46 3l10 29h-62z" fill="#f5ddc4"/>'+
   '<circle cx="164" cy="269" r="29" fill="#e8b88c" stroke="#be8f70" stroke-width="3"/>'+
   '<path d="M142 253q-18 -13 -19 5q-2 16 10 23l19 -12M179 252q17 -14 16 8q0 10 -17 14" fill="#aa785e" stroke="#966c59" stroke-width="3"/>'+
   '<ellipse cx="145" cy="282" rx="21" ry="11" fill="#fff3df"/>'+
   '<ellipse cx="130" cy="280" rx="6" ry="4" fill="#58454b"/>'+
   '<circle cx="165" cy="265" r="4.5" fill="#44373f"/><circle cx="166" cy="263" r="1.4" fill="#fff"/>'+
   '<path d="M137 291q13 8 21 -2" stroke="#bd8677" stroke-width="2" fill="none"/>'+
   '<ellipse cx="180" cy="313" rx="12" ry="5" fill="#f4d4b3"/><ellipse cx="240" cy="313" rx="12" ry="5" fill="#f4d4b3"/>'+
   '</g>'+
   '<rect x="102" y="199" width="95" height="19" rx="5" fill="#fffdf2" stroke="#99c7b8" stroke-width="2"/>'+
   '<text x="150" y="212" font-size="10" font-weight="900" fill="#57877b" text-anchor="middle">ISOLATION KENNEL</text>'+
   // Dedicated patient bedding, water bowl and kennel-status tag.
   '<rect x="126" y="302" width="165" height="16" rx="7" fill="#b5d8d0" stroke="#94bfb4" stroke-width="1.5"/>'+
   '<ellipse cx="281" cy="311" rx="14" ry="5" fill="#d6ebee" stroke="#7ca8b5" stroke-width="2"/>'+
   '<path d="M270 310q12 8 23 0" fill="#a2d4e2" stroke="#78afbe" stroke-width="1.5"/>'+
   '<rect x="203" y="203" width="78" height="16" rx="3" fill="#fffdf7" stroke="#b2c8bc" stroke-width="1.5"/>'+
   '<text x="242" y="214" text-anchor="middle" font-size="8" font-weight="900" fill="#567f75">DEDICATED CARE</text>'+
   '<path d="M110 207h199M110 324h199" stroke="#d0e4de" stroke-width="2" fill="none"/>'+
   // Library work surface, shelving and reference files.
   '<rect x="393" y="188" width="222" height="154" rx="14" fill="#d2e9df" stroke="#86b4a5" stroke-width="6"/>'+
   '<rect x="408" y="202" width="194" height="125" rx="8" fill="#fbfff9" stroke="#c1d8c8" stroke-width="3"/>'+
   '<text x="505" y="219" text-anchor="middle" font-size="14" font-weight="900" fill="#4b8a78">DISEASE LIBRARY</text>'+
   '<path d="M420 234H591M420 295H591" stroke="#b8d5c9" stroke-width="5"/>'+
   [0,1,2,3,4,5,6].map((n)=>{const x=425+n*23;return '<rect x="'+x+'" y="'+(245+(n%2)*5)+'" width="17" height="'+(42-(n%2)*5)+'" rx="2" fill="'+['#ceb6d9','#a7d5c6','#ebc4b8','#a8c6dd'][n%4]+'" stroke="#ffffff" stroke-width="1.4"/>'}).join('')+
   '<rect x="429" y="301" width="133" height="20" rx="3" fill="#fff5e8" stroke="#bdcfc1" stroke-width="2"/>'+
   '<path d="M441 306h87m-87 5h112m-112 5h73" stroke="#a2bdae" stroke-width="2"/>'+
   '<rect x="570" y="300" width="22" height="22" rx="3" fill="#d2e7e0" stroke="#98bdb0"/>'+
   '<text x="581" y="316" font-size="13" text-anchor="middle">🔬</text>'+
   // Public-health reporting terminal with status display.
   '<rect x="712" y="190" width="218" height="155" rx="14" fill="#cce5ed" stroke="#8cb7c7" stroke-width="7"/>'+
   '<rect x="730" y="206" width="180" height="101" rx="10" fill="#365c77" stroke="#83acbc" stroke-width="4"/>'+
   '<text x="819" y="224" text-anchor="middle" font-size="14" font-weight="900" fill="#f3faff">PUBLIC HEALTH</text>'+
   '<path d="M747 266h31l11 -19 12 33 13 -24 11 11h60" stroke="#83dcbf" stroke-width="5" fill="none"/>'+
   '<rect x="747" y="288" width="145" height="6" rx="3" fill="#7397ac"/>'+
   '<rect x="753" y="316" width="129" height="15" rx="4" fill="#f7fffa" stroke="#a2c6cc" stroke-width="2"/>'+
   '<text x="818" y="327" text-anchor="middle" font-size="9" font-weight="900" fill="#608c94">SURVEILLANCE · REPORTING</text>'+
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
   '<text x="960" y="485" text-anchor="end" font-size="9" font-family="Arial" font-weight="900" fill="#6b8a85">Isolation room v3</text>'+
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
   s+='<g filter="url(#vpqSpecShadow)">'+
   rect(74,191,177,148,'#fff2f5','#d5adc5')+
   '<rect x="93" y="214" width="137" height="90" rx="9" fill="#fff" stroke="#b5c4d8" stroke-width="4"/>'+
   '<text x="161" y="241" text-anchor="middle" font-family="Arial" font-size="16" fill="#9a7aaa" font-weight="900">STERILE FIELD</text>'+
   '<text x="160" y="286" font-size="43" text-anchor="middle">🧽</text>'+
   rect(286,177,196,162,'#e4f1fa','#a4bbd6')+
   rect(303,198,165,96,'#405975','#93b4ca')+
   '<path d="M317 254h27l9 -19 12 32 14 -23 13 13h62" fill="none" stroke="#84edc1" stroke-width="6"/>'+
   '<text x="386" y="228" font-size="19" text-anchor="middle" fill="#f6cfdd">♥ 112</text>'+
   rect(523,230,230,103,'#ebdef4','#b7a0cc')+
   '<rect x="535" y="252" width="206" height="31" rx="12" fill="#c6b4db"/>'+
   // Friendly monitored cat in the recovery bay.
   '<ellipse cx="650" cy="250" rx="68" ry="17" fill="#dfc6e7"/>'+
   '<ellipse cx="642" cy="241" rx="46" ry="19" fill="#c1b4df" stroke="#998abf" stroke-width="3"/>'+
   '<circle cx="601" cy="227" r="20" fill="#d9c3e9" stroke="#a38cbf" stroke-width="3"/>'+
   '<path d="M586 215l-8 -17 19 11 12 -15 10 21" fill="#c4a4d4" stroke="#a38cbf" stroke-width="2"/>'+
   '<path d="M590 227q5 6 10 0M607 227q5 6 10 0" fill="none" stroke="#69566f" stroke-width="2"/>'+
   '<path d="M600 233l6 0 -3 4z" fill="#df93b2"/>'+
   '<path d="M671 241q30 -29 35 -1" stroke="#b9a3d3" stroke-width="10" fill="none"/>'+
   '<path d="M558 332v36M720 332v36" stroke="#9c9cbd" stroke-width="10"/>'+
   '<path d="M580 243v-36h29" stroke="#9db3ce" stroke-width="9" fill="none"/>'+
   rect(785,194,159,141,'#f4e8f9','#b8add4')+
   rect(799,210,130,92,'#435b7d','#99b6cf')+
   '<text x="862" y="263" font-size="21" text-anchor="middle" fill="#fff">CASE FILES</text>'+
   '</g><g font-size="14" font-family="Arial" font-weight="900" text-anchor="middle" fill="#786b9a">'+
   '<text x="165" y="175">PREP & ASEPSIS</text><text x="389" y="165">ANESTHESIA</text>'+
   '<text x="639" y="208">RECOVERY</text><text x="864" y="177">PATIENT BOARD</text></g>'+
   '<g><rect x="68" y="116" width="170" height="46" rx="12" fill="#fff7cf" stroke="#e8c379" stroke-width="4"/>'+
   '<text x="153" y="144" text-anchor="middle" font-size="16" font-family="Arial" fill="#9e7440" font-weight="900">HAND HYGIENE</text></g>';
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
'.stage[data-room="skills"] .prop,.stage[data-room="skills"] .roomdecor,.stage[data-room="skills"] .roomBanner,.stage[data-room="clinpath"] .prop,.stage[data-room="isolation"] .prop,.stage[data-room="necropsy"] .prop,.stage[data-room="clinpath"] .roomdecor,.stage[data-room="isolation"] .roomdecor,.stage[data-room="necropsy"] .roomdecor,.stage[data-room="clinpath"] .roomBanner,.stage[data-room="isolation"] .roomBanner,.stage[data-room="necropsy"] .roomBanner{display:none!important}'+
'#vpqSpecHits{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqSpecHit{position:absolute;pointer-events:auto;background:transparent;border:2px solid transparent;border-radius:16px;box-shadow:none;transform:none!important;padding:0}'+
'.vpqSpecHit:hover,.vpqSpecHit:focus-visible,.vpqSpecHit.vpqSpecNear{background:#fff2c52b;border:3px solid #ffcb65;outline:2px solid #fff5cc;box-shadow:0 0 20px #ffc8738e}'+
'.vpqSpecHit span{position:absolute;bottom:-14%;left:50%;transform:translateX(-50%);font-size:clamp(10px,1.10vw,13px);font-weight:900;background:#fffdfb;color:#5b597b;border:3px solid #b7a8d7;border-radius:13px;padding:5px 7px;white-space:normal;min-width:94%;line-height:1.25;box-shadow:0 4px 10px #60718d40}'+
'.vpqSpecHit span small{display:block;font-size:10px;color:#66738c;font-weight:700;line-height:1.2;margin-top:3px}.vpqSpecHit[data-vpqspec-kind="practice"] span{border-color:#e0b583;background:#fff9ec}'+
'.vpqSpecHit.vpqSpecNear span{background:#fff1c9;border-color:#e8b35b}'+
'.vpqClinpathQuickLinks{position:absolute;left:9%;right:9%;bottom:2%;height:13%;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:16px minmax(0,1fr);gap:3px 7px;align-items:stretch;pointer-events:auto;z-index:12}.vpqClinpathQuickLinks .vpqQuickTitle{grid-column:1/4;display:block;font-weight:900;font-size:clamp(10px,1.05vw,12px);color:#665180;text-align:center;letter-spacing:.5px;line-height:16px}.vpqClinpathQuickLinks .vpqPracticeTitle{grid-column:4/5}.vpqClinpathQuickLinks button{border:2px solid #afbddb;border-radius:12px;background:#fff;color:#3e5279;font-size:clamp(9px,1.05vw,13px);font-weight:900;padding:4px;min-width:0;white-space:normal;line-height:1.2;box-shadow:0 2px 5px #40517133;cursor:pointer}.vpqClinpathQuickLinks button[data-vpq-type="practice"]{border-color:#e1b36f;background:#fff2d7}.vpqClinpathQuickLinks button:hover,.vpqClinpathQuickLinks button:focus-visible{background:#e6f5ff;border-color:#729ad0}.vpqLearnShelfLink{position:absolute;left:3%;top:15%;width:18%;height:15%;border:2px solid transparent;border-radius:13px;background:transparent;cursor:pointer;z-index:13;pointer-events:auto}.vpqLearnShelfLink:hover,.vpqLearnShelfLink:focus-visible{border-color:#d8ad53;background:#ffedaa2b;outline:2px solid #fff6d8}.vpqLearnShelfLink:focus-visible{outline-offset:2px}'+
'.vpqBenchGuide{position:absolute;top:42%;width:24px;height:24px;border:2px solid #a69ac6;border-radius:50%;background:#fffef8;color:#684f86;font-size:13px;font-weight:900;line-height:18px;padding:0;pointer-events:auto;z-index:14;cursor:help;box-shadow:0 1px 4px #6c628142}.vpqBenchGuide:hover,.vpqBenchGuide:focus-visible{background:#fff3cc;border-color:#d1a15d;outline:2px solid #fff7de}'+
'.stage[data-room="clinpath"] .interactToast{left:7px;top:5px;max-width:128px;font-size:9px;padding:4px 6px;line-height:1.15;border-width:1px;border-radius:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:none;background:#ffffffeb}'+
'.stage[data-room="clinpath"] .vpqSpecHit[data-vpqspecact="advancedCases"]{z-index:6;cursor:pointer}'+
'.stage[data-room="clinpath"] .vpqSpecHit span{display:none!important}.stage[data-room="clinpath"] .vpqSpecHit{border-radius:17px}.stage[data-room="clinpath"] .vpqSpecHit.vpqSpecNear:after{top:auto;bottom:5%;font-size:11px}.stage[data-room="clinpath"] .vpqSpecHit:hover{background:#fff6c82a}'+
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
 '.stage[data-room="isolation"] #vpqSpecHits .vpqIsoHelp{position:absolute;pointer-events:auto;width:25px;height:25px;padding:0;border-radius:50%;background:#f7fffb;color:#336b73;border:2px solid #78a6a5;z-index:9;font-size:15px;font-weight:900;transform:none!important;box-shadow:0 2px 6px #39545238}'+
 '.stage[data-room="isolation"] #vpqSpecHits .vpqIsoHelp:hover{background:#e0f6ee}'+
 '.stage[data-room="isolation"] #vpqSpecHits .vpqIsoEquipmentHelp{width:22px;height:22px;font-size:13px;background:#f8fffbf2;border-color:#9ac5b8}';
document.head.appendChild(isolationPolish);

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
 necroHandbook:{title:'📚 Necropsy Handbook',tag:'LECTURES · LEARN FIRST',opens:'Opens the pathology lecture and body-system handbook.',learn:'Learn gross lesions, histology, pathogenesis, differentials and why the body responds as it does.',different:'The reference and learning station rather than an unknown-specimen challenge.',next:'Take what you learned to the Specimen Cabinet or Patient Cases.'},
 necroDx:{title:'📋 Diagnosis Board',tag:'MORPHOLOGY · PRACTICE',opens:'Currently opens the same gross Specimen Cabinet page as the gross-lesion station.',learn:'Write a supported morphologic diagnosis: organ/tissue, process, distribution and relevant modifiers.',different:'The focus is precise lesion description, not guessing a specific etiology.',next:'Select the guided morphologic-diagnosis activity within the shared atlas.'},
 necroHisto:{title:'🔬 Microscope',tag:'HISTOLOGY · EXPLAIN WHY',opens:'Opens the shared Specimen Cabinet with histology-focused study selected.',learn:'Identify microscopic patterns of cellular injury, inflammation, degeneration, neoplasia and repair.',different:'Focuses on microscopic evidence and why it produces the gross lesion.',next:'Compare the corresponding gross lesion and related diagnosis.'},
 necroCases:{title:'📋 Patient Cases',tag:'CLINICAL · DIFFERENTIALS',opens:'Opens the dedicated Differential Diagnosis Case Center.',learn:'Use signalment, history, gross lesions, histology and testing to rank and distinguish diagnoses.',different:'Multispecies patient-based clinical reasoning instead of a specimen-only reference.',next:'Review the linked lecture and atlas sources when available.'},
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
 clean:['🧽 Disinfection cart','Use patient-dedicated equipment. Clean organic material first, then apply a disinfectant effective against the suspected agent at its labeled dilution and wet contact time.'],
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
 (room==='clinpath'?['coag','gas','urine','hybrid','cases','microscopy'].map((key,i)=>'<button type="button" class="vpqBenchGuide" style="left:'+([13.7,30.1,46.5,62.9,79.3,95.2][i])+'%" data-vpqbench-guide="'+key+'" title="What does this lab equipment do?" aria-label="About '+key+' equipment and specimen interpretation">?</button>').join(''):'')+
 (room==='isolation'?
 data.isolation.map(p=>'<button type="button" class="vpqIsoHelp" style="left:'+Math.min(94,p.x+p.w-1)+'%;top:'+Math.max(3,p.y-4)+'%" data-vpqisohelp="'+p.action+'" title="About '+p.label+'" aria-label="Explain '+p.label+'">?</button>').join('')+
 [['ppe',8,36],['wash',37,49],['clean',65,50],['waste',11,76],['boot',34,80]].map(([key,left,top])=>'<button type="button" class="vpqIsoHelp vpqIsoEquipmentHelp" style="left:'+left+'%;top:'+top+'%" data-vpqisohelp="'+key+'" title="Explain '+key+'" aria-label="Explain '+key+' station">?</button>').join('')
 :'')+
 (room==='necropsy'?data.necropsy.filter(p=>necroHelp[p.action]).map(p=>'<button type="button" class="vpqNecroHelp" data-vpqnecro-help="'+p.action+'" style="left:'+Math.min(95,p.x+p.w-2)+'%;top:'+Math.max(3,p.y-3)+'%" title="About '+p.label+'" aria-label="What does '+p.label+' teach?">?</button>').join(''):'')+
 (room==='necropsy'?'<button type="button" class="vpqNecroGuide" data-vpqnecro-guide="1" title="What does each Necropsy station do?" aria-label="Necropsy room guide: what each station teaches">? What’s where</button>':'')+
 (room==='clinpath'?'<button type="button" class="vpqLearnShelfLink" data-vpqspecact="vpqClinpathGuided" title="Start here — what CBC, chemistry and each diagnostic test measures" aria-label="Beginner Clinical Pathology report-reading guide"></button><div class="vpqClinpathQuickLinks" role="group" aria-label="Clinical Pathology study and practice shortcuts"><div class="vpqQuickTitle">📚 STUDY &amp; REFERENCE</div><div class="vpqQuickTitle vpqPracticeTitle">🎯 PRACTICE</div><button type="button" data-vpqspecact="vpqClinpathGuided" title="Learn clinical pathology from the beginning">📖 Start Here</button><button type="button" data-vpqspecact="vpqClinpathAtlas" title="Visual microscope and urine morphology atlas">🔬 Microscope Atlas</button><button type="button" data-vpqspecact="vpqClinpathCellReference" title="Cell identification and morphology reference">🩸 Cell Recognition</button><button type="button" data-vpq-type="practice" data-vpqspecact="vpqClassicSmear" title="Blood smear identification quizzes">🎯 Smear Quizzes</button></div>':'');
 div.addEventListener('click',e=>{
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
 if(best.action==='advancedCases'&&typeof window.VPQ_CLINPATH_REFERRAL_PILOT?.home==='function'){window.VPQ_CLINPATH_REFERRAL_PILOT.home();return true}api.doAction(best.action);return true;
}
const observer=new MutationObserver(()=>{const room=stage.dataset.room,present=stage.querySelector('#vpqSpecHits');if(!!data[room]!==!!present||(present&&present.dataset.room!==room))refresh()});
observer.observe(stage,{attributes:true,attributeFilter:['data-room'],childList:true});
refresh();
return {refresh,updateNearby,interactNearest};
};