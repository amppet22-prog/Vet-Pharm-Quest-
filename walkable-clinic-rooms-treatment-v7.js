/* Vet Pharm Quest: illustrated, walkable Treatment and Imaging rooms.
 * Environmental SVG art and transparent interactive equipment hotspots.
 * Existing room actions, keyboard controls, movement, save data, coins and XP stay intact.
 * The earlier image-generated mockups are art direction; this vector adaptation is actual UI.
 */
window.VPQ_WALKABLE_CLINIC_ART=function(api){
'use strict';
const stage=document.getElementById('stage');
if(!stage||!window.VPQ_SCENERY)return null;
const prior=window.VPQ_SCENERY.roomArt.bind(window.VPQ_SCENERY);
// Hit targets intentionally hug the depicted equipment, rather than covering room-wide columns.
// Approach is determined by the matching walkable station x-coordinate.
const spec={
 imaging:[
  {x:11,y:49,w:19,h:38,label:'🩻 X-ray',action:'imagingXray'},
  {x:34,y:42,w:15,h:42,label:'📡 Ultrasound',action:'imagingUltrasound'},
  {x:54,y:35,w:20,h:35,label:'💻 CT scanner',action:'imagingCT'},
  {x:77,y:35,w:19,h:34,label:'📋 Reading desk',action:'radiologyDesk'}],
 treatment:[
  {x:9,y:33,w:18,h:41,label:'🐶 Patient',action:'hospitalFollowup'},
  {x:63,y:57,w:9,h:22,label:'🚨 Crash Cart',action:'hospitalAdjust'},
  {x:59,y:34,w:14,h:22,label:'💗 Monitor',action:'hospitalMonitor'},
  {x:88,y:49,w:9,h:22,label:'🧪 Send to Lab',action:'clinpathLabReferral'}]
};

/* Small informational ? targets, separate from the playable stations (Necropsy-style). */
const wardHelp={
 kennels:{title:'🐾 Inpatient Recovery Kennels',tag:'PATIENT CARE · HOUSING',opens:'Recovery kennels for patients requiring observation and nursing care.',learn:'Check patient identity, comfort, bedding, hydration, appetite, elimination, catheter sites and pain at each scheduled nursing round.',different:'Kennel patients are not automatically stable: use individualized vitals and stress-minimizing handling. Cats and dogs need appropriate separate housing.',next:'Use the Patient station for a clinical case and document changes before transferring to treatment.'},
 tables:{title:'🩺 Treatment Tables',tag:'PATIENT CARE · PROCEDURES',opens:'Two treatment surfaces for examination, catheter placement, sample collection and supervised nursing procedures.',learn:'Keep a clean work surface, verify patient identity, apply appropriate restraint and monitor comfort, perfusion and temperature.',different:'Clean between patients and do not leave an animal unattended on a raised table.',next:'Review the patient presentation, then choose monitoring or diagnostics based on findings.'},
 supplies:{title:'🧤 Procedure Supply Station',tag:'TOOLS · ASEPSIS',opens:'Gloves, electric hair clippers, nail trimmers, catheter tape, gauze, wraps and specimen supplies.',learn:'Clip rather than razor-shave catheter sites where possible; prepare skin aseptically, choose secure but nonconstricting tape and inspect catheter sites regularly.',different:'Nail trimmers are for nail care, not vascular access. Sharps and contaminated materials need appropriate disposal.',next:'Use the Clinical Skills Wing to practice safe blood collection and catheter-related steps.'},
 monitor:{title:'💗 Patient Monitor',tag:'VITAL SIGNS · TRENDS',opens:'Displays an example ECG and heart rate as a visual monitoring station.',learn:'Interpret heart rate and ECG alongside pulse quality, respiratory effort, temperature, blood pressure, oxygenation and the species-specific patient assessment.',different:'The displayed 128 is illustrative, not a real vital sign from your selected patient; an ECG trace alone does not establish adequate perfusion.',next:'Open Monitor to practice trend-based reassessment.'},
 crash:{title:'🚨 Emergency Crash Cart',tag:'EMERGENCY · PREPAREDNESS',opens:'A dedicated, organized emergency response cart.',learn:'Know where oxygen delivery supplies, airway equipment, IV access materials, emergency medications and CPR supplies are stored; use current RECOVER guidance and team roles.',different:'Medication choices and doses vary by species, body mass, arrest rhythm and current protocol. Recheck expiry dates and restock after use.',next:'Start with recognition, call for help, and assign roles during a simulated emergency.'},
 oxygen:{title:'🫧 Oxygen / ICU Cage',tag:'RESPIRATORY · CRITICAL CARE',opens:'A controlled oxygen-enriched recovery enclosure for selected respiratory patients.',learn:'Minimize stress, monitor respiratory effort and oxygenation, maintain appropriate temperature and humidity, and document oxygen delivery and weaning.',different:'Oxygen concentration and temperature require monitoring. An oxygen cage does not replace emergency drainage of a significant pleural effusion.',next:'Follow the respiratory patient case through diagnostics, stabilization and monitoring.'},
 exotics:{title:'🐇 Exotics Recovery Enclosure',tag:'EXOTICS · SPECIES CARE',opens:'A quiet enclosure with suitable hiding space, bedding, food and water for an exotic patient.',learn:'Assess species-specific temperature needs, stress, appetite, fecal output, analgesia and husbandry. Rabbits require attentive GI monitoring.',different:'Housing and nutrition must match species: rabbit, reptile and avian patients do not share the same requirements.',next:'Try a rabbit GI case and follow its intake, imaging and treatment.'},
 lab:{title:'🧪 In-House Laboratory',tag:'DIAGNOSTICS · SAMPLE QUALITY',opens:'In-house analyzers and sampling workspace for initial diagnostic testing.',learn:'Correct sample identity, anticoagulant, collection technique, analyzer quality control and species-specific reference intervals all affect interpretation.',different:'An in-house value may need smear review, repeat testing, urinalysis or send-out confirmation; interpret results with the patient.',next:'Choose Send to Lab for advanced clinical pathology work.'}
};
const wardHelpPins=[
 {key:'kennels',x:31.5,y:29},{key:'tables',x:60,y:59},
 {key:'supplies',x:59,y:33},{key:'monitor',x:73.5,y:34},{key:'crash',x:71,y:61},
 {key:'oxygen',x:85,y:33},{key:'exotics',x:96,y:33},{key:'lab',x:96,y:59}
];
function wardHelpModal(key){
 const h=wardHelp[key];if(!h||typeof api.showModal!=='function')return;
 const card=(title,body)=>'<div class="vpqWardHelpCard"><b>'+title+'</b><p>'+body+'</p></div>';
 api.showModal(h.title,'<section class="vpqWardHelpModal"><div class="vpqWardHelpIntro"><small>'+h.tag+'</small><p>'+h.opens+'</p></div>'+
 card('What this station teaches',h.learn)+card('Important clinical distinction',h.different)+card('Where to go next',h.next)+
 '<p class="tiny">This ? is information only. Use the labeled station or E to interact with equipment.</p></section>');
}

const round=(x,y,w,h,fill,stroke='#aaa9ce')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="12" fill="'+fill+'" stroke="'+stroke+'" stroke-width="5"/>';
function base(type){
 const t=type==='imaging',prefix=t?'img25':'trt25',label=t?'DIAGNOSTIC IMAGING':'TREATMENT WARD';
 return '<svg class="vpqWalkArt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500" preserveAspectRatio="none" role="img" aria-label="Original 2.5D perspective veterinary '+(t?'diagnostic imaging suite':'treatment ward')+' with realistic clinic equipment">'+
 '<defs><linearGradient id="'+prefix+'-wall" x2="1" y2="1"><stop stop-color="#f9f6ff"/><stop offset="1" stop-color="'+(t?'#d2e5f6':'#e4d4f3')+'"/></linearGradient>'+
 '<linearGradient id="'+prefix+'-floor" x2="0" y2="1"><stop stop-color="#eae3f2"/><stop offset="1" stop-color="#c6b8dd"/></linearGradient>'+
 '<filter id="'+prefix+'-shadow" x="-25%" y="-25%" width="155%" height="165%"><feDropShadow dx="2" dy="5" stdDeviation="5" flood-color="#55628d" flood-opacity=".24"/></filter></defs>'+
 '<rect width="1000" height="500" fill="#d6e0f3"/><polygon points="0,0 1000,0 925,80 75,80" fill="#f1f0fc"/>'+
 '<polygon points="0,0 75,80 75,344 0,408" fill="#b7bcda"/><polygon points="1000,0 925,80 925,344 1000,408" fill="#b1c4dc"/>'+
 '<rect x="75" y="80" width="850" height="264" fill="url(#'+prefix+'-wall)"/>'+
 '<path d="M75 344H925L1000 500H0Z" fill="url(#'+prefix+'-floor)"/>'+
 '<path d="M75 344L0 500M925 344L1000 500M270 344L220 500M500 344V500M730 344L780 500M18 468H982M41 419H959M61 377H939" fill="none" stroke="#fdfcff" stroke-width="2.5" opacity=".85"/>'+
 '<path d="M75 82H925M75 343H925" stroke="#b0afd4" stroke-width="8"/>'+
 '<path d="M75 22H925M250 0L275 80M450 0L450 80M650 0L625 80M820 0L785 80" stroke="#d1d7ee" stroke-width="3" fill="none"/>'+
 [160,345,657,835].map(x=>'<ellipse cx="'+x+'" cy="42" rx="25" ry="11" fill="#fff2ce" stroke="#ffffff" stroke-width="6"/>').join('')+
 '<g filter="url(#'+prefix+'-shadow)">'+round(346,90,308,60,'#fffbff','#b0a0de')+
 '<text x="500" y="127" text-anchor="middle" fill="#5f7197" font-family="Arial,sans-serif" font-weight="900" font-size="26">'+label+'</text></g>'+
 '<g opacity=".47" fill="#a595d2"><circle cx="305" cy="114" r="7"/><circle cx="293" cy="101" r="4"/><circle cx="305" cy="99" r="4"/><circle cx="318" cy="101" r="4"/><circle cx="694" cy="114" r="7"/><circle cx="682" cy="101" r="4"/><circle cx="694" cy="99" r="4"/><circle cx="707" cy="101" r="4"/></g>';
}
function imaging(){
 let s=base('imaging');
 // Decorative, original grayscale X-ray studies: layered anatomy and
 // tonal attenuation rather than simplified white line art. NOT clinical scans.
 s+='<defs>'+
 '<radialGradient id="vpqRadFilm" cx="45%" cy="40%" r="75%"><stop stop-color="#526170"/><stop offset=".6" stop-color="#27323e"/><stop offset="1" stop-color="#080e16"/></radialGradient>'+
 '<radialGradient id="vpqRadSoft" cx="45%" cy="45%" r="70%"><stop stop-color="#b5bec6" stop-opacity=".77"/><stop offset=".65" stop-color="#74828d" stop-opacity=".52"/><stop offset="1" stop-color="#35424c" stop-opacity=".12"/></radialGradient>'+
 '<filter id="vpqRadBlur"><feGaussianBlur stdDeviation="1.5"/></filter>'+
 '<filter id="vpqRadGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="21" stitchTiles="stitch"/></filter>'+
 '<clipPath id="vpqRadL"><rect x="103" y="183" width="72" height="84" rx="7"/></clipPath>'+
 '<clipPath id="vpqRadR"><rect x="186" y="183" width="70" height="84" rx="7"/></clipPath></defs>'+
 '<g filter="url(#img25-shadow)">'+round(88,169,184,112,'#d8ecfb','#96b7d0')+
 round(101,181,76,88,'#111923','#7c9cb9')+round(184,181,74,88,'#111923','#7c9cb9')+'</g>'+
 // Lateral thorax: spine, scapular border, ribs, pulmonary lucency, cardiac shadow.
 '<g clip-path="url(#vpqRadL)">'+
 '<rect x="103" y="183" width="72" height="84" fill="url(#vpqRadFilm)"/>'+
 '<path d="M102 202Q124 190 160 195L180 209L176 249Q150 258 119 249L100 239Z" fill="url(#vpqRadSoft)" opacity=".73" filter="url(#vpqRadBlur)"/>'+
 '<path d="M107 206Q127 198 166 201L170 238Q158 249 135 246L112 236Z" fill="#121d29" opacity=".91"/>'+
 '<path d="M105 193Q139 186 173 196" stroke="#e0e6eb" stroke-width="5" opacity=".5" fill="none" filter="url(#vpqRadBlur)"/>'+
 '<path d="M105 194Q139 187 173 197" stroke="#c9d2db" stroke-width="2.5" opacity=".78" fill="none"/>'+
 '<g stroke="#adbcc7" stroke-width="1.7" opacity=".65" fill="none">'+
 [0,1,2,3,4,5,6].map(i=>'<path d="M'+(111+i*8)+' '+(195+i*.4)+' C'+(98+i*8)+' '+(210+i*1.1)+' '+(110+i*7)+' '+(236+i*.8)+' '+(122+i*6)+' '+(249+i*.4)+'"/>').join('')+
 '</g>'+
 '<g stroke="#d5dfe6" stroke-width="2" opacity=".56" fill="none">'+
 '<path d="M107 207Q138 199 170 210M108 216Q139 207 171 218M110 227Q140 220 171 229M112 237Q139 232 169 238"/>'+
 '</g>'+
 '<path d="M139 215Q127 213 125 226Q123 242 140 247Q153 247 153 232Q151 218 139 215Z" fill="#8896a1" opacity=".79" filter="url(#vpqRadBlur)"/>'+
 '<path d="M142 215Q131 215 131 225Q127 237 142 241Q151 242 149 230Z" fill="#a2acb5" opacity=".49"/>'+
 '<path d="M108 240Q141 230 171 244" fill="none" stroke="#bac8d3" stroke-width="2" opacity=".75"/>'+
 '<path d="M117 206Q121 225 114 239" stroke="#c4ced6" stroke-width="3" opacity=".5" fill="none"/>'+
 '<rect x="103" y="183" width="72" height="84" fill="#fff" filter="url(#vpqRadGrain)" opacity=".075"/>'+
 '</g>'+
 // Lateral stifle: overlapping femoral condyles, tibial plateau and proximal tibia.
 '<g clip-path="url(#vpqRadR)">'+
 '<rect x="186" y="183" width="70" height="84" fill="url(#vpqRadFilm)"/>'+
 '<path d="M204 180Q201 202 208 214Q211 225 217 226Q226 226 233 216Q239 203 237 183" stroke="#aab7c2" stroke-width="18" opacity=".44" filter="url(#vpqRadBlur)" fill="none"/>'+
 '<path d="M207 181Q204 202 213 214Q216 225 223 221Q231 213 233 181" stroke="#e0e8ed" stroke-width="4" opacity=".79" fill="none"/>'+
 '<path d="M203 218Q209 228 221 227Q233 230 238 220" stroke="#dce6eb" stroke-width="6" opacity=".65" fill="none"/>'+
 '<path d="M203 223Q213 239 210 269M239 224Q229 243 233 269" stroke="#aebcc8" stroke-width="15" opacity=".54" fill="none" filter="url(#vpqRadBlur)"/>'+
 '<path d="M208 228Q216 236 215 248L213 269M233 229Q226 241 227 251L230 269" stroke="#d9e3e9" stroke-width="3" opacity=".8" fill="none"/>'+
 '<path d="M198 228Q206 237 207 247L206 261" stroke="#c6d1d9" stroke-width="3" opacity=".58" fill="none"/>'+
 '<path d="M205 224Q220 220 238 227" stroke="#eef2f6" stroke-width="2.3" opacity=".86" fill="none"/>'+
 '<ellipse cx="219" cy="220" rx="17" ry="9" fill="#becbd5" opacity=".18"/>'+
 '<rect x="186" y="183" width="70" height="84" fill="#fff" filter="url(#vpqRadGrain)" opacity=".075"/>'+
 '</g>'+
 // Small acquisition-style legends inside the display, visually quiet.
 '<g font-family="Arial" font-size="6.3" font-weight="700" fill="#d7e0e7" opacity=".87">'+
 '<text x="106" y="263">THORAX  RL</text><text x="190" y="263">STIFLE  LAT</text></g>';
 // Positioning table and overhead tube
 s+='<g filter="url(#img25-shadow)"><rect x="114" y="342" width="175" height="18" rx="9" fill="#8ebade" stroke="#6288ac" stroke-width="5"/>'+
 round(136,360,130,54,'#eaf2ff','#96afcb')+'<path d="M155 413v16M251 413v16" stroke="#788daf" stroke-width="10"/>'+
 '<path d="M146 251v83M146 252h73v25" stroke="#829dbd" stroke-width="14" fill="none"/>'+round(199,277,50,31,'#e2effc','#8caacc')+
 '<ellipse cx="225" cy="310" rx="19" ry="8" fill="#b5dcf9"/></g>';
 // Ultrasound cart with grayscale original ultrasound sector
 s+='<g filter="url(#img25-shadow)">'+round(333,210,145,116,'#edf4fd','#92a7c7')+round(350,224,113,85,'#253347','#7d99bc')+
 '<path d="M391 238L365 286Q402 303 449 286L424 238Z" fill="#8795a8" stroke="#dce8f2" stroke-width="3"/>'+
 '<path d="M391 251q20 20 33 0M380 276q30 17 58 0" stroke="#d3e3ec" stroke-width="2.2" opacity=".7" fill="none"/>'+
 '<g opacity=".48" fill="#cdd9e1">'+
 Array.from({length:45},(_,i)=>{const x=389+(i*13)%39,y=252+(i*17)%31;return '<circle cx="'+x+'" cy="'+y+'" r="'+(.45+(i%4)*.18)+'"/>'}).join('')+
 '</g>'+
 '<path d="M397 262q10-7 20 1q-10 7-20-1" fill="#4b6072" opacity=".5"/>'+

 round(343,326,125,35,'#d8e0f0','#9aabc8')+
 [366,390,414,438].map(x=>'<circle cx="'+x+'" cy="344" r="5" fill="#a3b4d1"/>').join('')+
 round(359,361,94,45,'#edf2fb','#9caccb')+
 '<path d="M367 408v13M449 408v13" stroke="#869bb8" stroke-width="9"/></g>';
 // CT gantry behind window
 s+='<g>'+round(513,175,216,170,'#d5e7f7','#9cbed8')+
 '<ellipse cx="621" cy="254" rx="85" ry="75" fill="#eef7ff" stroke="#93b6d4" stroke-width="13"/>'+
 '<ellipse cx="621" cy="254" rx="47" ry="47" fill="#3a5671" stroke="#9dd3eb" stroke-width="9"/>'+
 '<rect x="572" y="296" width="107" height="14" rx="6" fill="#eef9ff"/>'+
 '<rect x="543" y="323" width="161" height="16" rx="7" fill="#f4faff" stroke="#8ea9c6" stroke-width="4"/></g>';
 // Reading desk now displays two grayscale axial cross-sectional study illustrations.
 s+='<g filter="url(#img25-shadow)">'+round(750,182,170,116,'#3c516b','#91a8c9')+
 [790,863].map((x,i)=>'<g>'+
 '<ellipse cx="'+x+'" cy="223" rx="29" ry="27" fill="#9cabbc"/>'+
 '<ellipse cx="'+x+'" cy="223" rx="24" ry="23" fill="#4a596e"/>'+
 '<ellipse cx="'+x+'" cy="223" rx="19" ry="20" fill="#778899" opacity=".8"/>'+
 '<ellipse cx="'+(x-9)+'" cy="223" rx="9" ry="15" fill="#2b394e"/>'+
 '<ellipse cx="'+(x+9)+'" cy="223" rx="9" ry="15" fill="#2b394e"/>'+
 '<circle cx="'+x+'" cy="'+(i?229:232)+'" r="4" fill="#d4dbe2" opacity=".85"/>'+
 '<path d="M'+(x-19)+' 216q19-9 38 0" stroke="#becad7" stroke-width="1.4" fill="none" opacity=".6"/>'+
 '</g>').join('')+
 [790,863].map(x=>'<g><circle cx="'+x+'" cy="273" r="16" fill="#8fa0b5"/><circle cx="'+x+'" cy="273" r="11" fill="#3c4d64"/><path d="M'+(x-7)+' 273q7-11 14 0q-7 10-14 0" fill="#b3c1cd" opacity=".7"/></g>').join('')+
 '<rect x="754" y="187" width="158" height="5" rx="2" fill="#27364c"/>'+
 '<text x="757" y="196" fill="#c5d3df" font-family="Arial" font-size="6">CT AXIAL  •  WINDOW / LEVEL</text>'+
 '<rect x="746" y="321" width="185" height="16" rx="5" fill="#f3d6be" stroke="#af9abb" stroke-width="4"/>'+
 '<path d="M762 337v77M914 337v77" stroke="#9a8fb7" stroke-width="10"/>'+
 '<rect x="797" y="344" width="78" height="8" rx="4" fill="#9ca6bd"/></g>';
 // Diagnostic imaging personality + radiation safety, drawn directly in the active 2.5D SVG.
 // All additions are visual only; no new hotspots, actions or movement barriers.
 s+='<g aria-hidden="true" font-family="Arial,sans-serif">'+
 // Left angled wall: caution poster, not an interactable object.
 '<path d="M12 170L64 177V291L12 307Z" fill="#fff9ed" stroke="#bd9a6a" stroke-width="3"/>'+
 '<path d="M19 184L58 188V211L19 210Z" fill="#ffe8a0"/>'+
 '<text x="38" y="199" font-size="9" text-anchor="middle" font-weight="900" fill="#735424">CAUTION</text>'+
 '<text x="38" y="207" font-size="8" text-anchor="middle" font-weight="900" fill="#735424">X-RAY</text>'+
 '<text x="38" y="230" font-size="8" text-anchor="middle" font-weight="900" fill="#6e6480">ALARA</text>'+
 '<text x="19" y="247" font-size="7.5" font-weight="800" fill="#6e6480">TIME</text>'+
 '<text x="19" y="261" font-size="7.5" font-weight="800" fill="#6e6480">DISTANCE</text>'+
 '<text x="19" y="275" font-size="7.2" font-weight="800" fill="#6e6480">SHIELDING</text>'+
 // PPE rail and lead protective apron on the rear wall between the x-ray and ultrasound.
 '<rect x="285" y="192" width="43" height="89" rx="6" fill="#fff8fc" stroke="#c8b5d9" stroke-width="3"/>'+
 '<rect x="288" y="198" width="37" height="16" rx="4" fill="#e9d8f1"/>'+
 '<text x="306" y="209" font-size="9" text-anchor="middle" fill="#765e8b" font-weight="900">PPE</text>'+
 '<path d="M298 222h18l7 12-8 6v28h-17v-28l-7-6z" fill="#9cb7d5" stroke="#6383a7" stroke-width="2"/>'+
 '<path d="M301 221q5-8 11 0" stroke="#6383a7" stroke-width="3" fill="none"/>'+
 '<path d="M294 253l-4 7 4 4 4-6M321 253l4 7-4 4-4-6" fill="#f6d8e8" stroke="#a57b9d" stroke-width="1.7"/>'+
 // Pastel accents and a quiet workstation reminder above the reading desk.
 '<rect x="875" y="307" width="32" height="14" rx="5" fill="#fff6e9" stroke="#d9b9c9" stroke-width="2"/>'+
 '<path d="M885 308q-8-11 0-18m8 18q10-11 1-19" stroke="#6fae97" stroke-width="3" fill="none"/>'+
 '<path d="M882 298q-8-3-5-12 9 3 5 12m12-4q7-9 12-4-6 9-12 4" fill="#7ebda9"/>'+
 // Small safety checklist under wall sign (non-clickable and non-disruptive).
 '<rect x="333" y="171" width="139" height="28" rx="7" fill="#fffdf6" stroke="#dac6e3" stroke-width="2"/>'+
 '<text x="402" y="183" text-anchor="middle" font-size="9" font-weight="900" fill="#7c658c">✓ MARKER  ✓ COLLIMATE</text>'+
 '<text x="402" y="193" text-anchor="middle" font-size="9" font-weight="800" fill="#7c658c">✓ CHECK POSITION</text>'+
 '</g>';
 // Original miniature modality gallery, split across the back wall around the main sign.
 // Symbolic illustrations only, not clinical images or textbook reproductions.
 const miniModalities=[
  {x:99,title:'RADS',kind:'bone'},{x:153,title:'US',kind:'wave'},{x:207,title:'CT',kind:'ring'},{x:261,title:'MRI',kind:'brain'},
  {x:686,title:'PET',kind:'pet'},{x:740,title:'NUC',kind:'pet'},{x:794,title:'CYSTO',kind:'bladder'},{x:848,title:'FLUORO',kind:'wave'}
 ];
 s+='<g aria-hidden="true" font-family="Arial,sans-serif">'+
 '<rect x="91" y="91" width="229" height="66" rx="9" fill="#fffafc" stroke="#c5b6d9" stroke-width="3"/>'+
 '<rect x="678" y="91" width="229" height="66" rx="9" fill="#fffafc" stroke="#c5b6d9" stroke-width="3"/>'+
 '<text x="205" y="104" text-anchor="middle" font-size="10" font-weight="900" fill="#736189">IMAGING MODALITIES</text>'+
 '<text x="793" y="104" text-anchor="middle" font-size="10" font-weight="900" fill="#736189">SPECIAL STUDIES</text>'+
 miniModalities.map(m=>{
 let art='';
 if(m.kind==='bone')art='<path d="M8 3v23M2 7q6-7 12 0M2 13q6-7 12 0M2 19q6-5 12 0M4 25q4-4 8 0" stroke="#e3e9f0" stroke-width="2" fill="none"/>';
 if(m.kind==='wave')art='<path d="M8 2L0 23Q8 31 17 23L12 2Z" fill="#8a9daa" stroke="#d8e7ed" stroke-width="2"/><path d="M3 19q6-5 11 0" stroke="#e6eff4" fill="none"/>';
 if(m.kind==='ring')art='<circle cx="8" cy="14" r="12" fill="#9eabb9"/><circle cx="8" cy="14" r="7" fill="#3d4b5b"/><ellipse cx="6" cy="14" rx="2" ry="5" fill="#758696"/>';
 if(m.kind==='brain')art='<ellipse cx="8" cy="14" rx="11" ry="13" fill="#a5a4b8"/><path d="M7 5q-8 5-2 11t3 8M9 5q9 5 2 11t-1 8" stroke="#43485c" fill="none" stroke-width="2"/>';
 if(m.kind==='pet')art='<ellipse cx="8" cy="14" rx="10" ry="12" fill="#9d668a"/><ellipse cx="8" cy="14" rx="5" ry="7" fill="#f0bb69"/>';
 if(m.kind==='bladder')art='<path d="M8 4q-9 0-9 11t9 11q9 0 9-11T8 4Z" fill="#a5b4c1" stroke="#e9f0f5" stroke-width="2"/><path d="M8 26v4" stroke="#e9f0f5" stroke-width="2"/>';
 return '<g transform="translate('+m.x+' 108)"><rect width="45" height="33" rx="5" fill="#2b3d52"/><g transform="translate(14 1)">'+art+'</g><text x="22" y="42" font-size="8" text-anchor="middle" font-weight="900" fill="#6a6081">'+m.title+'</text></g>';
 }).join('')+'</g>';
 // Cozy details throughout the imaging suite, kept behind / outside interactive equipment.
 s+='<g aria-hidden="true" font-family="Arial,sans-serif">'+
 // Subtle pastel bunting along the back wall, above all workstation monitors.
 '<path d="M89 158Q205 159 320 158M670 158Q802 159 916 158" stroke="#d8a9c5" stroke-width="2" fill="none"/>'+
 '<path d="M115 157l10 0-5 9zM150 158l10 0-5 9zM185 158l10 0-5 9zM220 157l10 0-5 9zM730 157l10 0-5 9zM765 158l10 0-5 9zM800 158l10 0-5 9zM835 157l10 0-5 9zM870 157l10 0-5 9z" fill="#f5c5d4" opacity=".95"/>'+
 // Tiny gold sparkle accents around the imaging department logo.
 '<path d="M329 114l5 0m-2.5-2.5v5M670 114l5 0m-2.5-2.5v5M320 141l4 0m-2-2v4M678 141l4 0m-2-2v4" stroke="#e6b979" stroke-width="2.5" stroke-linecap="round"/>'+
 // Ultrasound label: a small pastel wall plaque, not a new workstation/hotspot.
 '<rect x="349" y="153" width="105" height="17" rx="8" fill="#e3f5ee" stroke="#9ecdbf" stroke-width="2"/>'+
 '<text x="401" y="165" text-anchor="middle" font-size="10" fill="#547e76" font-weight="900">ULTRASOUND</text>'+
 // CT region: compact sign on rear wall, clear of gantry.
 '<rect x="546" y="151" width="132" height="18" rx="8" fill="#e9e5fb" stroke="#b9abd9" stroke-width="2"/>'+
 '<text x="612" y="164" text-anchor="middle" font-size="10" fill="#74669e" font-weight="900">CROSS-SECTIONAL</text>'+
 // Reading desk cozy tea coaster + pencil cup, kept on far right corner.
 '<ellipse cx="916" cy="317" rx="13" ry="4" fill="#d7b3b3" opacity=".8"/>'+
 '<path d="M903 297h19l-2 19h-15z" fill="#f5d1d9" stroke="#b58d9e" stroke-width="2"/>'+
 '<path d="M907 298l-3-10M912 298l2-14M917 298l5-9" stroke="#798faf" stroke-width="2.5"/>'+
 // Small floor pawprints at far corners, avoiding the avatar walk center.
 '<g fill="#f8effc" opacity=".8"><ellipse cx="75" cy="450" rx="10" ry="7" transform="rotate(-25 75 450)"/><circle cx="62" cy="437" r="4"/><circle cx="72" cy="432" r="4"/><circle cx="83" cy="435" r="4"/><ellipse cx="949" cy="453" rx="10" ry="7" transform="rotate(22 949 453)"/><circle cx="939" cy="440" r="4"/><circle cx="950" cy="435" r="4"/><circle cx="961" cy="438" r="4"/></g>'+
 '</g>';
 return s+'</svg>';
}
function treatment(){
 let s=base('treatment');
 // Compact treatment-preparation cabinet replaces the Skills doorway.
 s+='<g filter="url(#trt25-shadow)">'+
 '<rect x="350" y="155" width="128" height="116" rx="8" fill="#e0edf4" stroke="#a2b6c8" stroke-width="5"/>'+
 '<rect x="358" y="164" width="112" height="20" rx="7" fill="#fffdfa" stroke="#bed2dc" stroke-width="2"/>'+
 '<text x="414" y="178" text-anchor="middle" font-family="Arial" font-size="11" font-weight="900" fill="#547d90">TREATMENT PREP</text>'+
 '<rect x="359" y="191" width="45" height="58" rx="5" fill="#fafcff" stroke="#a8becb" stroke-width="3"/>'+
 '<rect x="408" y="191" width="59" height="58" rx="5" fill="#f6faff" stroke="#b3c4d3" stroke-width="3"/>'+
 '<rect x="366" y="198" width="31" height="20" rx="3" fill="#d6eced"/>'+
 '<path d="M372 206h20m-20 6h13" stroke="#8dbbbf" stroke-width="2"/>'+
 '<rect x="416" y="199" width="15" height="29" rx="3" fill="#ccdfeb"/>'+
 '<rect x="435" y="199" width="12" height="29" rx="3" fill="#ead8e9"/>'+
 '<rect x="451" y="199" width="10" height="29" rx="3" fill="#d5eacf"/>'+
 '<path d="M358 251h112" stroke="#93a9bd" stroke-width="5"/></g>';
 // Side-wall recovery and medication safety posters.
 s+='<g font-family="Arial" aria-hidden="true">'+
 '<path d="M14 152l52 6v122l-52 22z" fill="#fffdfa" stroke="#7c9db9" stroke-width="4"/>'+
 '<path d="M20 166l40 4v22l-40 -3z" fill="#d4e9e6"/>'+
 '<text x="40" y="181" text-anchor="middle" font-size="9" font-weight="900" fill="#426f6a">RECOVERY</text>'+
 '<text x="20" y="214" font-size="8" font-weight="800" fill="#58758b">PAIN • HR</text>'+
 '<text x="20" y="229" font-size="8" font-weight="800" fill="#58758b">RR • TEMP</text>'+
 '<text x="20" y="244" font-size="8" font-weight="800" fill="#58758b">EAT / PEE</text>'+
 '<path d="M20 251h35M20 264h31" stroke="#aac6c9" stroke-width="3"/>'+
 '<path d="M939 164l47 -8v140l-47 -20z" fill="#fffefa" stroke="#9ba5c7" stroke-width="4"/>'+
 '<path d="M945 174l35 -4v26l-35 3z" fill="#f6e1eb"/>'+
 '<text x="963" y="183" font-size="8" text-anchor="middle" font-weight="900" fill="#915a78">DRUG</text>'+
 '<text x="963" y="192" font-size="8" text-anchor="middle" font-weight="900" fill="#915a78">CHECK</text>'+
 '<text x="946" y="215" font-size="7.4" font-weight="800" fill="#64758d">PATIENT</text>'+
 '<text x="946" y="230" font-size="7.4" font-weight="800" fill="#64758d">DRUG / DOSE</text>'+
 '<text x="946" y="245" font-size="7.4" font-weight="800" fill="#64758d">ROUTE</text>'+
 '<text x="946" y="260" font-size="7.4" font-weight="800" fill="#64758d">RECHECK</text>'+
 '</g>';
  // Finishing touches: recovery charts and clean supply shelf, kept away from hotspots.
 s+='<g aria-hidden="true"><path d="M95 141h208" stroke="#e4c6db" stroke-width="4" stroke-linecap="round"/>'+
 '<rect x="111" y="129" width="48" height="8" rx="3" fill="#f7ffff" stroke="#a9c2cb" stroke-width="2"/>'+
 '<rect x="120" y="124" width="12" height="5" rx="2" fill="#9fcdbb"/>'+
 '<rect x="270" y="131" width="24" height="8" rx="3" fill="#b8d8cc"/></g>';
 // Two-level inpatient kennel bank: two upper recovery patients and a lower canine kennel.
 // Decorative only: the original Hospital Patient hit target remains unchanged.
 s+='<g filter="url(#trt25-shadow)">'+
 '<rect x="83" y="157" width="226" height="209" rx="13" fill="#dce5f1" stroke="#9baec8" stroke-width="7"/>'+
 '<rect x="93" y="170" width="101" height="80" rx="7" fill="#f7f0fc" stroke="#9eabc7" stroke-width="4"/>'+
 '<rect x="199" y="170" width="100" height="80" rx="7" fill="#f2f9fc" stroke="#9eabc7" stroke-width="4"/>'+
 '<rect x="93" y="256" width="206" height="98" rx="7" fill="#f7f1fa" stroke="#9eabc7" stroke-width="4"/>'+
 '<rect x="104" y="227" width="79" height="13" rx="7" fill="#e7bfda"/>'+
 '<rect x="209" y="227" width="79" height="13" rx="7" fill="#b9deda"/>'+
 '<rect x="106" y="334" width="180" height="12" rx="6" fill="#e0c6e9"/>'+
 // Upper left kennel: curled ginger cat with pointy ears and stripe details.
 '<ellipse cx="146" cy="212" rx="30" ry="15" fill="#d89968"/>'+
 '<path d="M164 214q28 2 19 -19" fill="none" stroke="#c6825d" stroke-width="8" stroke-linecap="round"/>'+
 '<circle cx="132" cy="200" r="16" fill="#e1a475"/>'+
 '<path d="M120 190l1 -16 12 10 10 -10 5 16" fill="#e1a475" stroke="#bc805f" stroke-width="2"/>'+
 '<path d="M125 197h3m11 0h3" stroke="#534752" stroke-width="3" stroke-linecap="round"/>'+
 '<path d="M130 204q3 4 6 0" stroke="#a56d62" stroke-width="2" fill="none"/>'+
 '<path d="M151 202l7 8m-2 -15l8 8" stroke="#b97859" stroke-width="3"/>'+
 // Upper right kennel: small white-and-brown recovering dog.
 '<ellipse cx="254" cy="216" rx="28" ry="15" fill="#e9e3d9"/>'+
 '<circle cx="233" cy="201" r="16" fill="#eee7db"/>'+
 '<path d="M221 193q-10 -2 -7 15l11 -2M240 191q13 -3 12 14l-11 0" fill="#a87962"/>'+
 '<ellipse cx="223" cy="205" rx="7" ry="5" fill="#fff6e7"/>'+
 '<circle cx="220" cy="204" r="3" fill="#464754"/>'+
 '<circle cx="236" cy="200" r="2.5" fill="#464754"/>'+
 '<path d="M265 209q15 -8 18 4" fill="none" stroke="#a87962" stroke-width="6" stroke-linecap="round"/>'+
 // Lower kennel: reclining tan dog on washable pastel bed.
 '<path d="M248 311q26 -23 33 2" stroke="#b88159" stroke-width="10" fill="none" stroke-linecap="round"/>'+
 '<ellipse cx="202" cy="318" rx="65" ry="24" fill="#cf9a6d" stroke="#b88159" stroke-width="3"/>'+
 '<path d="M163 305q28 -7 58 0l15 28h-80z" fill="#f3dbc0"/>'+
 '<ellipse cx="171" cy="331" rx="19" ry="7" fill="#f3dbc0"/><ellipse cx="233" cy="332" rx="20" ry="7" fill="#f3dbc0"/>'+
 '<circle cx="142" cy="305" r="25" fill="#dfac7f"/>'+
 '<path d="M123 293q-20 -2 -15 24l20 -4M157 289q15 -7 9 19l-11 -3" fill="#a4785d"/>'+
 '<ellipse cx="125" cy="318" rx="17" ry="10" fill="#fff0df"/>'+
 '<ellipse cx="113" cy="316" rx="6" ry="4" fill="#4b4952"/>'+
 '<circle cx="140" cy="301" r="3.5" fill="#404453"/>'+
 // Proper stainless cage grids and latch handles.
 [116,139,163,185].map(x=>'<path d="M'+x+' 173V247" stroke="#a6b5c7" stroke-width="2.7"/>').join('')+
 [220,243,266,288].map(x=>'<path d="M'+x+' 173V247" stroke="#a6b5c7" stroke-width="2.7"/>').join('')+
 [113,141,169,197,225,253,281].map(x=>'<path d="M'+x+' 260V351" stroke="#a6b5c7" stroke-width="3"/>').join('')+
 '<path d="M94 208h104M200 208h98M94 302h203" stroke="#a6b5c7" stroke-width="3"/>'+
 '<rect x="184" y="209" width="9" height="13" rx="3" fill="#d1a6b7"/>'+
 '<rect x="291" y="209" width="8" height="13" rx="3" fill="#d1a6b7"/>'+
 '<rect x="288" y="300" width="9" height="16" rx="3" fill="#d1a6b7"/>'+
 '<rect x="103" y="151" width="94" height="16" rx="6" fill="#fff9fe" stroke="#c2b7d2" stroke-width="2"/>'+
 '<text x="150" y="162" font-size="10" text-anchor="middle" font-family="Arial" font-weight="800" fill="#74678a">RECOVERY A / B</text>'+
 '<rect x="218" y="151" width="83" height="16" rx="6" fill="#f4ffff" stroke="#abc8d0" stroke-width="2"/>'+
 '<text x="259" y="162" font-size="10" text-anchor="middle" font-family="Arial" font-weight="800" fill="#60858d">OCCUPIED</text>'+
 '</g>';
 // Stainless-steel treatment island: rear preparation table, front patient table,
 // true perspective top faces, reflected steel, strengthened cross-bracing and under-table storage.
 s+='<g aria-hidden="true">'+
 // Contact shadows under the treatment island give depth without using walkable floor space.
 '<ellipse cx="500" cy="416" rx="119" ry="18" fill="#776b93" opacity=".15"/>'+
 '<ellipse cx="514" cy="338" rx="84" ry="10" fill="#726c90" opacity=".10"/>'+
 '</g>'+
 // Jointed wall-mounted exam lamp, brought forward without crossing the Treatment Ward sign.
 '<path d="M730 167h-46l-55 37 -44 16" stroke="#8198aa" stroke-width="8" fill="none" stroke-linecap="round"/>'+
 '<path d="M727 164h-41l-57 36" stroke="#deebf0" stroke-width="2" fill="none"/>'+
 '<circle cx="682" cy="168" r="7" fill="#b6cbd5" stroke="#879eab" stroke-width="2"/>'+
 '<circle cx="628" cy="204" r="7" fill="#b6cbd5" stroke="#879eab" stroke-width="2"/>'+
 '<ellipse cx="572" cy="225" rx="35" ry="22" fill="#fff5d7" stroke="#91a7b8" stroke-width="8"/>'+
 [554,572,590].map(x=>'<circle cx="'+x+'" cy="225" r="8" fill="#fffdfa"/>').join('')+
 '<g filter="url(#trt25-shadow)">'+
 // Rear exam/prep table: polished working surface with outer stainless lip and raised edge.
 '<path d="M438 276l123 -12 38 23 -122 14z" fill="#dce7eb" stroke="#899eac" stroke-width="5" stroke-linejoin="round"/>'+
 '<path d="M445 275l116 -9 27 16 -113 12z" fill="#f9fdff" stroke="#b7cbd3" stroke-width="2"/>'+
 '<path d="M477 301l122 -14v9l-122 14z" fill="#a1b6bf" stroke="#819ba8" stroke-width="2"/>'+
 '<path d="M460 298v37M580 297v38" stroke="#91aab7" stroke-width="9"/>'+
 '<path d="M461 299v35M580 297v36" stroke="#d2e5eb" stroke-width="3"/>'+
 '<path d="M463 325l111 -1" stroke="#97b0bc" stroke-width="6"/>'+
 // Lower shelf with clean supply drawer under preparation table
 '<path d="M483 314l88 -6 10 6 -87 8z" fill="#d4e0e7" stroke="#9bafbc" stroke-width="2"/>'+
 '<rect x="507" y="314" width="44" height="9" rx="2" fill="#edf5f8" stroke="#b2c3cd" stroke-width="1.5"/>'+
 '<path d="M526 319h10" stroke="#829fae" stroke-width="2"/>'+
 // Front treatment table with shaped steel edge and washable pale patient pad
 '<path d="M391 322h206l10 12 -9 17H390l-10 -12z" fill="#9db4c2" stroke="#7f97a8" stroke-width="4" stroke-linejoin="round"/>'+
 '<path d="M394 319h199l7 12H389z" fill="#f4fafb" stroke="#a8bec9" stroke-width="2"/>'+
 '<path d="M414 322h164l5 7H406z" fill="#e2eef2" opacity=".82"/>'+
 '<path d="M394 345h202" stroke="#dcebef" stroke-width="3" opacity=".8"/>'+
 '<path d="M413 351l12 69M576 350l-11 70" stroke="#869eac" stroke-width="11" stroke-linecap="round"/>'+
 '<path d="M416 354l12 64M573 353l-10 62" stroke="#d0e1e8" stroke-width="3"/>'+
 '<path d="M433 400h127" stroke="#91aab7" stroke-width="8"/>'+
 '<path d="M441 400h110" stroke="#d6e5ea" stroke-width="2"/>'+
 '<rect x="455" y="358" width="72" height="25" rx="5" fill="#e6f0f5" stroke="#9eb5c5" stroke-width="2"/>'+
 '<rect x="460" y="363" width="62" height="15" rx="3" fill="#f8fbfd"/>'+
 '<text x="491" y="374" font-family="Arial" font-size="10" fill="#607d8d" text-anchor="middle" font-weight="800">TREATMENT</text>'+
 '</g>'+
 // Adjustable IV pole, transparent bag, drip chamber and base.
 '<path d="M350 243v145M329 242h43" stroke="#879eac" stroke-width="6" fill="none"/>'+
 '<path d="M353 247v140" stroke="#d9e9ed" stroke-width="2" opacity=".9"/>'+
 '<path d="M350 242v-8m-21 8v7m43 -7v7" stroke="#829bad" stroke-width="3" fill="none"/>'+
 '<rect x="338" y="260" width="24" height="42" rx="4" fill="#edfafd" stroke="#9db9c9" stroke-width="2.5"/>'+
 '<path d="M340 286h20" stroke="#badfe7" stroke-width="2"/>'+
 '<rect x="346" y="303" width="8" height="14" rx="3" fill="#ecf9fc" stroke="#99b7c7" stroke-width="1.5"/>'+
 '<path d="M350 317v13q0 14 16 14" stroke="#a8c9d2" stroke-width="2" fill="none"/>'+
 '<path d="M350 387l-16 10m16 -10l18 10" stroke="#839dab" stroke-width="5" stroke-linecap="round"/>'+
 '<circle cx="335" cy="400" r="4" fill="#657f90"/><circle cx="370" cy="400" r="4" fill="#657f90"/>';
 // Patient monitor with convincing ECG
 s+='<g filter="url(#trt25-shadow)">'+round(593,178,133,104,'#34445b','#a9bad4')+
 '<path d="M608 231h18l8 -13 10 34 9 -41 11 26h46" stroke="#71e7bd" stroke-width="4" fill="none"/>'+
 '<text x="687" y="205" font-size="16" fill="#f4b7cb" font-weight="900" text-anchor="middle">♥ 128</text>'+
 '<rect x="647" y="281" width="15" height="26" fill="#a3b4ce"/>'+
 '<rect x="617" y="307" width="80" height="9" rx="4" fill="#99a3c1"/></g>';
 // Crash cart at right is now the single treatment cart.
 // In-house lab counter with two analyzers, tubes, microscope
 s+='<g filter="url(#trt25-shadow)"><rect x="720" y="327" width="227" height="18" rx="5" fill="#ded0eb" stroke="#b4a2cc" stroke-width="4"/>'+
 round(727,345,214,70,'#eee9f9','#a7a5c7')+
 '<path d="M798 346v68M865 346v68" stroke="#bdb4d5" stroke-width="5"/>'+
 round(738,267,87,57,'#f6f1fd','#a39bc8')+round(751,279,51,27,'#435c80','#b6c7e1')+
 '<path d="M761 294h28" stroke="#9de1c7" stroke-width="5"/>'+
 round(831,281,52,43,'#f3f0fa','#a39fc6')+round(841,288,32,18,'#738daa','#d2e2f3')+
 '<path d="M890 316h45" stroke="#647f9a" stroke-width="8"/><path d="M918 313v-35l-12 -15" stroke="#8495b9" stroke-width="11" fill="none"/>'+
 '<circle cx="902" cy="262" r="11" fill="#ddeafa" stroke="#8aa5c9" stroke-width="6"/>'+
 '<path d="M908 278l-20 35" stroke="#8898bd" stroke-width="8"/>'+
 [761,783,808].map((x,i)=>'<rect x="'+x+'" y="257" width="13" height="10" rx="3" fill="'+(i%2?'#d793b6':'#a58dd3')+'"/>').join('')+'</g>';
 // Procedures and nursing equipment. Shapes intentionally stay off the interactive button labels.
 // A little gray cat sits on the back table, with a blanket rather than an oversized silhouette.
 s+='<g aria-hidden="true">'+
 '<path d="M467 278l85 -8 21 11 -91 10z" fill="#dcebdc" stroke="#b3d1c6" stroke-width="2"/>'+
 '<ellipse cx="516" cy="275" rx="21" ry="9" fill="#9da5b0"/>'+
 '<path d="M530 273q13 3 13 -12" stroke="#9196a5" stroke-width="4" fill="none" stroke-linecap="round"/>'+
 '<circle cx="500" cy="268" r="11" fill="#abb0b9"/>'+
 '<path d="M491 264l1 -11 9 7 8 -8 3 12" fill="#abb0b9" stroke="#878fa1" stroke-width="1.5"/>'+
 '<path d="M496 269h2m8 0h2" stroke="#495263" stroke-width="2" stroke-linecap="round"/>'+
 '<path d="M500 274q2 3 4 0" fill="none" stroke="#74798c" stroke-width="1.5"/>'+
 '<path d="M512 275l4 3" stroke="#858c9c" stroke-width="2"/>'+
 // Exam tray on rear table and gauze.
 '<rect x="551" y="271" width="26" height="8" rx="3" fill="#c3ccda"/>'+
 '<rect x="554" y="266" width="12" height="6" rx="2" fill="#ffffff"/>'+
 // Wall-mounted procedure supplies: examination gloves, clippers, IV catheter tape, gauze, wraps.
 '<rect x="532" y="183" width="58" height="65" rx="7" fill="#e8eff9" stroke="#a6b7d4" stroke-width="3"/>'+
 '<text x="561" y="193" font-size="8" fill="#647f9b" font-weight="900" text-anchor="middle" font-family="Arial">PROCEDURES</text>'+
 '<rect x="537" y="199" width="24" height="18" rx="4" fill="#fcf9ff" stroke="#b5aacb" stroke-width="2"/>'+
 '<path d="M542 215l3 -8 4 3 3 -3 4 8" fill="#f8fbff" stroke="#9fb9ce" stroke-width="1.3"/>'+
 '<rect x="565" y="199" width="18" height="18" rx="4" fill="#d2e6e6" stroke="#97b9bb" stroke-width="2"/>'+
 '<path d="M571 205v8m5 -9v8" stroke="#738e9d" stroke-width="2"/>'+
 '<rect x="537" y="221" width="18" height="17" rx="4" fill="#f5e7fa" stroke="#b9a5cd" stroke-width="2"/>'+
 '<circle cx="546" cy="230" r="6" fill="#f7f7fb" stroke="#c3a8d2" stroke-width="3"/>'+
 '<rect x="560" y="221" width="22" height="17" rx="4" fill="#f9faff" stroke="#b6bfd5" stroke-width="2"/>'+
 '<path d="M565 230h12" stroke="#92a3bf" stroke-width="3"/>'+
 // Electric clipper, small nail trimmer and bandage roll set on rail.
 '<path d="M532 248h59" stroke="#b3accb" stroke-width="4"/>'+
 '<path d="M540 246v-8l6 -2 3 10" fill="#a5bfca" stroke="#6e93aa" stroke-width="2"/>'+
 '<path d="M560 247l5 -10 4 10m-4 -10l7 10" stroke="#8799aa" stroke-width="2" fill="none"/>'+
 '<circle cx="580" cy="243" r="5" fill="#f3f1fb" stroke="#b598d4" stroke-width="2"/>'+
 // Small oxygen supply ports beside the procedure station.
 '<rect x="604" y="157" width="62" height="22" rx="6" fill="#eaf7f8" stroke="#a4bfce" stroke-width="3"/>'+
 '<circle cx="615" cy="168" r="5" fill="#81cbb6"/><circle cx="632" cy="168" r="5" fill="#efc57e"/>'+
 '<circle cx="650" cy="168" r="5" fill="#b2b7d5"/>'+
 // Compact but functional emergency crash cart: dedicated defibrillator/monitor
 // shelf, sealed supplies, distinct medicine drawers, side oxygen accessories and locking wheels.
 '<ellipse cx="672" cy="392" rx="43" ry="9" fill="#857897" opacity=".17"/>'+
 '<rect x="639" y="310" width="69" height="69" rx="7" fill="#e7aab9" stroke="#b97791" stroke-width="4"/>'+
 '<path d="M639 316h69v12h-69z" fill="#f8d6dd"/>'+
 '<rect x="645" y="333" width="56" height="14" rx="3" fill="#fbdfe5" stroke="#c4859b" stroke-width="1.5"/>'+
 '<rect x="645" y="351" width="56" height="14" rx="3" fill="#fbdfe5" stroke="#c4859b" stroke-width="1.5"/>'+
 '<path d="M663 340h18m-18 18h18" stroke="#ae7188" stroke-width="2.5" stroke-linecap="round"/>'+
 '<path d="M675 333v14m-7 -7h14" stroke="#d46382" stroke-width="3" stroke-linecap="round"/>'+
 '<path d="M636 317h-9v35" stroke="#879cab" stroke-width="4" fill="none" stroke-linecap="round"/>'+
 '<path d="M630 352h11" stroke="#879cab" stroke-width="4"/>'+
 // Defibrillator unit and neatly coiled leads on top
 '<rect x="643" y="291" width="48" height="21" rx="5" fill="#e3edf3" stroke="#819bac" stroke-width="2.5"/>'+
 '<rect x="648" y="295" width="23" height="13" rx="2.5" fill="#324f67"/>'+
 '<path d="M650 302h5l2 -3 4 6 3 -4h6" stroke="#78e8c3" stroke-width="1.8" fill="none"/>'+
 '<rect x="676" y="295" width="10" height="11" rx="2" fill="#c0a1bc"/>'+
 '<path d="M688 307q8 -2 8 7" fill="none" stroke="#8296a6" stroke-width="2"/>'+
 '<rect x="637" y="307" width="70" height="6" rx="2.5" fill="#f8e7ee" stroke="#c48aa0" stroke-width="2"/>'+
 // Sterile sealed accessory box at side and wheel casters
 '<rect x="704" y="330" width="11" height="22" rx="3" fill="#e8eef6" stroke="#9caabf" stroke-width="2"/>'+
 '<path d="M706 338h7" stroke="#d3a1be" stroke-width="2"/>'+
 '<path d="M652 379v8m44 -8v8" stroke="#7d889d" stroke-width="4"/>'+
 '<circle cx="650" cy="388" r="7" fill="#6f7c91" stroke="#b4c3d2" stroke-width="2"/>'+
 '<circle cx="697" cy="388" r="7" fill="#6f7c91" stroke="#b4c3d2" stroke-width="2"/>'+
 '<text x="674" y="285" font-family="Arial" font-size="11" font-weight="900" text-anchor="middle" fill="#95516d">EMERGENCY</text>'+
 // Cabinet for oxygen patient next to the in-house laboratory.
 '<rect x="746" y="165" width="109" height="111" rx="11" fill="#e8f9fa" stroke="#92bdc9" stroke-width="5"/>'+
 '<rect x="755" y="182" width="91" height="84" rx="6" fill="#f6ffff" stroke="#b2d4dc" stroke-width="3"/>'+
 '<rect x="752" y="152" width="98" height="21" rx="9" fill="#fbffff" stroke="#9dbfc9" stroke-width="3"/>'+
 '<text x="801" y="166" font-family="Arial" text-anchor="middle" font-size="11" font-weight="900" fill="#6291a0">OXYGEN • ICU</text>'+
 '<rect x="765" y="243" width="71" height="13" rx="6" fill="#d6ebed"/>'+
 // Quiet cat within the O2-enriched enclosure, with observation window.
 '<ellipse cx="796" cy="237" rx="24" ry="11" fill="#d3bbb1"/>'+
 '<circle cx="780" cy="228" r="11" fill="#e2c8b7"/>'+
 '<path d="M770 222l1 -12 10 8 8 -8 3 12" fill="#e2c8b7" stroke="#b99283" stroke-width="1.5"/>'+
 '<circle cx="776" cy="227" r="2" fill="#5d5859"/><circle cx="785" cy="227" r="2" fill="#5d5859"/>'+
 '<path d="M799 237q19 0 17 -14" stroke="#b7958a" stroke-width="5" fill="none" stroke-linecap="round"/>'+
 '<circle cx="826" cy="192" r="7" fill="#ffffff" stroke="#9fc4ca" stroke-width="2"/>'+
 '<text x="826" y="195" font-family="Arial" font-size="7" fill="#6393a0" text-anchor="middle">O₂</text>'+
 // Dedicated exotics recovery cage, compact and partly planted.
 '<rect x="865" y="165" width="76" height="111" rx="9" fill="#e9f7eb" stroke="#a1c4ae" stroke-width="5"/>'+
 '<rect x="871" y="183" width="64" height="82" rx="4" fill="#fbfff8" stroke="#c3d9b9" stroke-width="3"/>'+
 '<rect x="860" y="152" width="84" height="21" rx="9" fill="#fffdf5" stroke="#b5cbb1" stroke-width="3"/>'+
 '<text x="902" y="166" font-family="Arial" font-size="11" fill="#668d70" font-weight="900" text-anchor="middle">EXOTICS</text>'+
 '<rect x="876" y="239" width="52" height="16" rx="7" fill="#e9dcc2"/>'+
 // Rabbit facing right, standing near a hide box.
 '<ellipse cx="898" cy="232" rx="17" ry="12" fill="#ece8de"/>'+
 '<circle cx="911" cy="225" r="10" fill="#f4ede4"/>'+
 '<ellipse cx="910" cy="208" rx="5" ry="18" fill="#eee9e1" stroke="#c4beb8" stroke-width="1.5"/>'+
 '<ellipse cx="919" cy="211" rx="5" ry="18" fill="#eee9e1" stroke="#c4beb8" stroke-width="1.5"/>'+
 '<ellipse cx="910" cy="211" rx="2" ry="12" fill="#e9c5d0"/>'+
 '<circle cx="915" cy="225" r="2" fill="#5c5a62"/>'+
 '<circle cx="882" cy="232" r="6" fill="#f8f5f2"/>'+
 '<path d="M873 238v-13l8 -7 9 7v13" fill="#b2c7a4" stroke="#93b28c" stroke-width="2"/>'+
 // Individual enclosure doors, windows and vents; labels remain outside main gameplay elements.
 [757,780,803,826,845].map(x=>'<path d="M'+x+' 185v77" stroke="#c2dce0" stroke-width="1.5" opacity=".65"/>').join('')+
 [873,890,907,925].map(x=>'<path d="M'+x+' 186v76" stroke="#d1dec9" stroke-width="1.5" opacity=".65"/>').join('')+
 '</g>';
 // Carefully scaled details added after core equipment: facial markings, chart tabs,
 // patient IV monitoring, exotics enrichment and stocked tray. Nothing changes hit targets.
 s+='<g aria-hidden="true">'+
 // Ginger tabby whiskers, stripes, and pink ear linings.
 '<path d="M122 187l4 -8 5 7m8 0l5 -8 2 11" fill="#f5c0a4"/>'+
 '<path d="M129 190l3 5m5 -6l-2 6" stroke="#bb7c58" stroke-width="1.5"/>'+
 '<path d="M122 205l-13 0m13 4l-14 5m29 -8l12 -2m-11 6l12 4" fill="none" stroke="#b77b5d" stroke-width="1.5" stroke-linecap="round"/>'+
 '<path d="M156 205l5 5m-14 -7l7 6m11 -8l5 7" stroke="#b67b59" stroke-width="2.5" fill="none"/>'+
 // Small dog patch, belly and front paws.
 '<ellipse cx="237" cy="200" rx="9" ry="11" fill="#b98b76" opacity=".6"/>'+
 '<path d="M226 222q19 8 38 0" stroke="#f9f1e9" stroke-width="8" fill="none" stroke-linecap="round"/>'+
 '<ellipse cx="245" cy="225" rx="6" ry="3" fill="#f8eee6"/><ellipse cx="264" cy="225" rx="7" ry="3" fill="#f8eee6"/>'+
 '<path d="M227 209q5 5 10 0" fill="none" stroke="#8d736f" stroke-width="1.5"/>'+
 // Big dog muzzle, blaze and depth to coat.
 '<path d="M174 296q19 -11 41 -3t23 24" fill="none" stroke="#b98766" stroke-width="6" opacity=".55"/>'+
 '<path d="M132 287q11 0 13 10l-11 6" fill="#f7dcc2" opacity=".8"/>'+
 '<path d="M131 309q5 6 13 0" fill="none" stroke="#87665f" stroke-width="2"/>'+
 '<path d="M119 324l-11 2m19 -5l-12 9m34 -10l10 7" fill="none" stroke="#bd8a73" stroke-width="1.6" stroke-linecap="round"/>'+
 // Oxygen-monitoring connection with a visible flow selector, not a giant cable.
 '<rect x="814" y="176" width="22" height="12" rx="4" fill="#f8ffff" stroke="#9fc7c9" stroke-width="1.5"/>'+
 '<circle cx="820" cy="182" r="3" fill="#9fdcc8"/><circle cx="830" cy="182" r="3" fill="#e5cf94"/>'+
 '<path d="M823 188v11q-10 5 -9 19" stroke="#abd7d3" stroke-width="2" fill="none"/>'+
 // Exotics: short enrichment branch, natural hay and securely placed water dish.
 '<path d="M881 247l-5 -16m7 14l5 -14" stroke="#88af86" stroke-width="2.2"/>'+
 '<path d="M895 246l-3 -8m4 7l6 -9" stroke="#c3ab79" stroke-width="1.5"/>'+
 '<ellipse cx="924" cy="247" rx="7" ry="3" fill="#b2d8e1" stroke="#8bbaca" stroke-width="1.3"/>'+
 // Small color-coded drawers, procedure supplies and label strip under wall rack.
 '<rect x="587" y="251" width="51" height="19" rx="5" fill="#f9fbfe" stroke="#a9bac9" stroke-width="2"/>'+
 '<rect x="591" y="254" width="11" height="11" rx="2" fill="#b9d8d3"/>'+
 '<rect x="605" y="254" width="11" height="11" rx="2" fill="#ead0da"/>'+
 '<rect x="619" y="254" width="11" height="11" rx="2" fill="#d1c7ea"/>'+
 '</g>';
 // Ward visual upgrade: clearly recognizable sterile stainless treatment surfaces,
 // monitoring ribbon, patient comforts and a dedicated hand-washing station.
 // This group is intentionally drawn above furniture but remains noninteractive.
 s+='<g aria-hidden="true">'+
 // Steel edge and equipment tray on the paired treatment table
 '<path d="M405 334H581" stroke="#a0b7c3" stroke-width="5" stroke-linecap="round"/>'+
 '<path d="M444 286l115 -11" stroke="#ffffff" stroke-width="3" opacity=".8"/>'+
 '<rect x="542" y="307" width="41" height="17" rx="4" fill="#e8eef3" stroke="#a6b6c4" stroke-width="2"/>'+
 '<rect x="548" y="311" width="9" height="8" rx="2" fill="#b8ddd6"/>'+
 '<rect x="560" y="311" width="9" height="8" rx="2" fill="#d9c9e7"/>'+
 '<rect x="571" y="311" width="7" height="8" rx="2" fill="#ffffff"/>'+
 // Patient recovery charts (one for each upper cage) and washable pads
 '<rect x="101" y="177" width="16" height="16" rx="3" fill="#ffffff" stroke="#b6a8cf" stroke-width="2"/>'+
 '<path d="M105 183h8m-8 4h6" stroke="#9ca9c1" stroke-width="1.5"/>'+
 '<rect x="204" y="177" width="16" height="16" rx="3" fill="#ffffff" stroke="#b6a8cf" stroke-width="2"/>'+
 '<path d="M208 183h8m-8 4h6" stroke="#9ca9c1" stroke-width="1.5"/>'+
 // Rounded oxygen cage breathing circuit, soft aqua enclosure wash.
 '<rect x="753" y="180" width="96" height="89" rx="7" fill="none" stroke="#8fc7d4" stroke-width="3"/>'+
 '<path d="M764 181v8h70v-8" fill="none" stroke="#a4dde1" stroke-width="4"/>'+
 '<path d="M828 188v9q-7 8 -7 19" fill="none" stroke="#75baba" stroke-width="3" stroke-linecap="round"/>'+
 '<rect x="769" y="253" width="67" height="10" rx="5" fill="#e4f4f6" stroke="#bbdadd" stroke-width="1.5"/>'+
 // Exotics enclosure gets perforated upper ventilation, a visibly cozy hide and water.
 '<path d="M877 186h51" stroke="#a4c6a7" stroke-width="4" stroke-dasharray="3 5" stroke-linecap="round"/>'+
 '<path d="M877 249v-17l12 -10 12 10v17" fill="#c5dcb9" stroke="#89ad86" stroke-width="2"/>'+
 '<path d="M883 250v-11q6 -7 12 0v11" fill="#a2bc93"/>'+
 '<ellipse cx="923" cy="255" rx="10" ry="4" fill="#a8d9e3" stroke="#83b4c7" stroke-width="2"/>'+
 // Handwash dispenser station between sterile prep and treatment monitor.
 '<rect x="606" y="184" width="36" height="48" rx="6" fill="#eff9fb" stroke="#9fc3cc" stroke-width="3"/>'+
 '<rect x="610" y="190" width="28" height="24" rx="4" fill="#d0e9e9"/>'+
 '<path d="M613 206q12 8 22 0" fill="none" stroke="#8bbebf" stroke-width="2"/>'+
 '<path d="M614 217h20" stroke="#8db2bd" stroke-width="2"/>'+
 '<rect x="614" y="224" width="20" height="4" rx="2" fill="#b2cbd0"/>'+
 '</g>';
 s+='<g font-family="Arial,sans-serif" font-weight="900">'+
 '<rect x="96" y="106" width="163" height="39" rx="18" fill="#fff5fc" stroke="#dda7d6" stroke-width="4"/>'+
 '<text x="177" y="132" font-size="17" fill="#935c8d" text-anchor="middle">PATIENT CARE</text>'+
 '<rect x="751" y="106" width="162" height="39" rx="18" fill="#f2faff" stroke="#99c4d3" stroke-width="4"/>'+
 '<text x="832" y="132" font-size="17" fill="#547a91" text-anchor="middle">IN-HOUSE LAB</text>'+
 '</g>'+
 '<g><circle cx="950" cy="122" r="18" fill="#ffecf3" stroke="#d899b8" stroke-width="4"/>'+
 '<path d="M940 122h20M950 112v20" stroke="#e56e98" stroke-width="6" stroke-linecap="round"/>'+
 ''+
 ''+
 '<circle cx="305" cy="129" r="4" fill="#ffffff"/><circle cx="312" cy="118" r="4" fill="#ffffff"/><circle cx="320" cy="128" r="4" fill="#ffffff"/>'+
 '</g>';
 return s+'</svg>';
}
window.VPQ_SCENERY.roomArt=k=>k==='imaging'?imaging():k==='treatment'?treatment():prior(k);
const styles=document.createElement('style');
styles.textContent='.vpqWalkArt{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'+
'.stage[data-room="imaging"] .prop,.stage[data-room="treatment"] .prop,.stage[data-room="imaging"] .roomdecor,.stage[data-room="treatment"] .roomdecor,.stage[data-room="imaging"] .roomBanner,.stage[data-room="treatment"] .roomBanner{display:none!important}'+
'.vpqWardHelpPin{position:absolute;z-index:8;width:21px;height:21px;padding:0;display:grid;place-items:center;pointer-events:auto;border-radius:50%;background:#fffaf0;color:#674c9e;border:2px solid #a58bcc;box-shadow:0 2px 4px #51437438;font-size:15px;line-height:1;font-weight:900;transform:translate(-50%,-50%)}'+
'.vpqWardHelpPin:hover,.vpqWardHelpPin:focus-visible{background:#fff0bd;border-color:#e4aa55;outline:2px solid #ffe7a6;outline-offset:1px}'+
'.vpqWardHelpModal{font-size:15px;line-height:1.45}.vpqWardHelpIntro{background:#edf6fc;border-left:4px solid #83adc8;padding:10px 12px;border-radius:10px}.vpqWardHelpIntro small{font-size:11px;font-weight:900;color:#477495;letter-spacing:.04em}.vpqWardHelpIntro p{margin:5px 0}.vpqWardHelpCard{background:white;border:1px solid #d6e3ef;border-radius:10px;padding:9px 12px;margin-top:8px}.vpqWardHelpCard b{font-size:15px;color:#274f7a}.vpqWardHelpCard p{font-size:15px;line-height:1.45;margin:4px 0 0}'+
'.vpq25Hotspots{position:absolute;inset:0;z-index:5;pointer-events:none}.vpq25Hit{position:absolute;pointer-events:auto;background:transparent;border:2px solid transparent;border-radius:15px;box-shadow:none;transform:none!important;padding:0;overflow:visible}'+
'.vpq25Hit:hover,.vpq25Hit:focus-visible,.vpq25Hit.vpq25Near{background:linear-gradient(180deg,#fffbd017,#fff3a539);border:2px solid #f0c770;box-shadow:0 0 0 2px #fff1b63f;outline:none}'+
'.vpq25Hit span{position:absolute;bottom:-4%;left:50%;transform:translateX(-50%);padding:4px 7px;border:2px solid #a98cd5;background:linear-gradient(#fff,#f9e9fa);color:#514779;border-radius:16px;font-size:clamp(10px,1.05vw,13px);font-weight:900;white-space:nowrap;box-shadow:0 2px 0 #9473ac44,0 4px 8px #53678722}.vpq25Hit.vpq25Near span{background:linear-gradient(#fff8d8,#ffe8a5);border-color:#e4aa43;color:#714e2e;box-shadow:0 5px 0 #c78e3c60,0 0 15px #ffe89fb0}.vpq25Hit.vpq25Near:after{content:"E · INTERACT";position:absolute;top:2%;left:50%;transform:translateX(-50%);border-radius:13px;border:2px solid #e4ad53;background:#fff9de;color:#765321;font-size:11px;font-weight:900;padding:5px 9px;white-space:nowrap;box-shadow:0 3px 12px #d8b05955;pointer-events:none}'+
'@media(max-width:620px){.vpq25Hit span{font-size:10px;padding:5px 4px;white-space:normal;min-width:80%;line-height:1.1}}';
document.head.appendChild(styles);
function refresh(){
 const old=stage.querySelector('#vpq25Hotspots');
 const room=stage.dataset.room;
 if(!spec[room]){old?.remove();return}
 if(old?.dataset.room===room)return;
 old?.remove();
 const div=document.createElement('div');div.id='vpq25Hotspots';div.className='vpq25Hotspots';div.dataset.room=room;
 div.innerHTML=spec[room].map(p=>'<button type="button" class="vpq25Hit" style="left:'+p.x+'%;top:'+p.y+'%;width:'+p.w+'%;height:'+p.h+'%" data-vpq25act="'+p.action+'" aria-label="Open '+p.label+'"><span>'+p.label+'</span></button>').join('')
 if(room==='treatment')div.innerHTML+=wardHelpPins.map(p=>'<button type="button" class="vpqWardHelpPin" style="left:'+p.x+'%;top:'+p.y+'%" data-vpqward-help="'+p.key+'" title="About '+wardHelp[p.key].title+'" aria-label="About '+wardHelp[p.key].title+'">?</button>').join('');
 div.addEventListener('click',event=>{const help=event.target.closest('[data-vpqward-help]');if(help){event.preventDefault();event.stopPropagation();wardHelpModal(help.dataset.vpqwardHelp);return}const b=event.target.closest('[data-vpq25act]');if(b)api.doAction(b.dataset.vpq25act)});
 stage.appendChild(div);
}
function nearest(room,x){
 const stations=spec[room],roomData=api.rooms?.[room];
 if(!stations||!roomData?.props)return null;
 let result=null;
 for(const p of roomData.props){
  const candidate=stations.find(z=>z.action===p.action);
  if(!candidate)continue;
  const distance=Math.abs(p.x-x);
  if(!result||distance<result.distance)result={station:candidate,distance};
 }
 return result&&result.distance<17?result.station:null;
}
function updateNearby(room,x){
 const active=nearest(room,x);
 const hits=stage.querySelectorAll('#vpq25Hotspots [data-vpq25act]');
 hits.forEach(b=>{
  const match=!!active&&b.dataset.vpq25act===active.action;
  b.classList.toggle('vpq25Near',match);
  b.setAttribute('aria-current',match?'true':'false');
 });
 return active;
}
function interactNearest(room,x){
 const active=updateNearby(room,x);
 if(!active)return false;
 api.doAction(active.action);
 return true;
}
const observer=new MutationObserver(()=>{const room=stage.dataset.room,present=stage.querySelector('#vpq25Hotspots');if((!!spec[room])!==!!present||(present&&present.dataset.room!==room))refresh()});
observer.observe(stage,{attributes:true,attributeFilter:['data-room'],childList:true});
refresh();
return {refresh,imaging,treatment,updateNearby,interactNearest};
};