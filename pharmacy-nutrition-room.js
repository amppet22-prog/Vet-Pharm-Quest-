/* Pharmacy & Pet Nutrition room — 2.5D shelf scene, accessible hotspots, turtle mascot.
 * Existing drug library, Mechanism Lab, and toxicology reference are untouched.
 * Nutrition is a starter reference, not a formulation or patient diet prescription. */
window.VPQ_PHARMACY_NUTRITION_ROOM=function(api){
'use strict';
const {rooms,doAction,showModal,changeRoom}=api;
const stage=document.getElementById('stage'),art=window.VPQ_SCENERY;
if(!stage||!art||!rooms.pharmacy)return null;
const previous=art.roomArt.bind(art);
const foodCards=[
 {title:'Assess the patient first',tag:'BCS • MCS • Weight trend',detail:'Assess body condition score (BCS), muscle condition score (MCS), weight trend, age, species, life stage, reproductive status, appetite and medical history.',why:'Body weight alone cannot distinguish excess fat from muscle loss. Muscle loss may coexist with excess adiposity, and nutrition needs change with disease and life stage.',clinical:'Ask about all foods, treats, supplements, household members who feed the pet, and recent changes. Track trends rather than relying on one weight.'},
 {title:'Read the food label',tag:'Adequacy • Life stage • Calories',detail:'Check intended species and life stage, the nutritional adequacy statement where applicable, energy density (kcal/cup, can, or kg), feeding instructions and manufacturer information.',why:'Different diets deliver different energy and nutrients per volume. The term “complete and balanced” relates to stated nutritional adequacy for a species and life stage, not proof that it suits every patient.',clinical:'In US pet-food labeling, assess whether an AAFCO nutritional adequacy statement identifies formulation or feeding trials and an appropriate life stage. AAFCO does not itself approve individual products.'},
 {title:'Energy needs are individualized',tag:'RER versus actual feeding plan',detail:'Resting energy requirement (RER) is a starting physiologic estimate of baseline energy use. Actual feeding and maintenance energy requirements depend on activity, health, neuter status, body condition and other factors.',why:'An animal expends energy for basal physiology, movement, thermoregulation and growth or reproduction; illness can change both intake and expenditure.',clinical:'Make diet changes using patient-specific veterinary guidance, monitor body weight and BCS, and adjust from the patient’s observed response rather than assuming one multiplier fits all.'},
 {title:'Species-specific nutrition',tag:'Cats ≠ dogs ≠ herbivores',detail:'Cats are obligate carnivores with dietary requirements that differ from those of dogs. Rabbits and many other herbivorous pets have high-fiber digestive physiology and feeding needs that do not translate from dog/cat diets.',why:'Species differ in nutrient metabolism, gastrointestinal fermentation and capacity to synthesize or utilize specific nutrients.',clinical:'Match food to the correct species; avoid treating dog food as a complete long-term cat diet, or using carnivore-style diets for hindgut-fermenting herbivores.'},
 {title:'Therapeutic diets are clinical tools',tag:'Renal • GI • Urinary • Obesity',detail:'Disease-specific diets are designed to alter nutrient composition or energy delivery for selected indications. They are not interchangeable, and the diagnosis determines whether a particular formulation is appropriate.',why:'Nutrition can affect mineral load, urine composition, gastrointestinal tolerance, energy balance and other disease pathways.',clinical:'Pair diet selection with clinical findings, medications, diagnostics, patient acceptance and monitoring. Avoid assuming that any “renal,” “urinary,” or “weight” product is appropriate for every case.'}
];
function nutritionMenu(){
 showModal('🥣 Pet Nutrition Corner · Starter Reference',
 '<div class="infobox"><b>What this station is for</b><p>Nutrition assessment, food-label interpretation and species differences. This is a starter reference while the full nutrition curriculum and case bank are being developed.</p></div>'+
 '<div class="vpqPNFoodCards">'+foodCards.map((c,i)=>'<button type="button" data-vpqpn-card="'+i+'"><b>'+c.title+'</b><small>'+c.tag+'</small></button>').join('')+'</div>'+
 '<p class="tiny">Nutrition planning is patient-specific. No food in this illustrated shop is being recommended as a brand or treatment.</p>');
}
function nutritionCard(i){
 const c=foodCards[i];if(!c)return nutritionMenu();
 showModal('🥣 '+c.title,'<p class="tiny">Nutrition Corner · '+(i+1)+' of '+foodCards.length+' · '+c.tag+'</p>'+
 '<div class="infobox"><b>What to know</b><p>'+c.detail+'</p></div>'+
 '<div class="infobox"><b>WHY it matters</b><p>'+c.why+'</p></div>'+
 '<div class="infobox"><b>Clinical application</b><p>'+c.clinical+'</p></div>'+
 '<div class="buttonrow"><button type="button" data-vpqpn-back="1">← All nutrition topics</button>'+
 '<button type="button" data-vpqpn-card="'+Math.max(0,i-1)+'" '+(i===0?'disabled':'')+'>← Previous</button>'+
 '<button type="button" data-vpqpn-card="'+Math.min(foodCards.length-1,i+1)+'" '+(i===foodCards.length-1?'disabled':'')+'>Next →</button></div>');
}
const pharmModal=document.getElementById('modalBody');
function addStudyLoungeShortcut(){
 if(!pharmModal||pharmModal.querySelector('#vpqPNLearnInLounge'))return;
 const content=pharmModal.textContent||'';
 const modal=document.getElementById('modal');
 if(!/Search medications|Drug Encyclopedia|Drug indications & NAVLE cases/.test(content))return;
 const link=document.createElement('button');
 link.type='button';link.id='vpqPNLearnInLounge';
 link.textContent='📚 Learn & practice Pharmacology + Toxicology → Student Study Lounge';
 link.style.cssText='display:block;width:100%;margin:8px 0 12px;padding:10px;border:2px solid #9b8ac7;border-radius:12px;background:#f5efff;color:#554573;font-size:13px;font-weight:900;cursor:pointer';
 link.addEventListener('click',()=>{document.getElementById('closeModal')?.click();changeRoom('study')});
 pharmModal.prepend(link);
}
new MutationObserver(addStudyLoungeShortcut).observe(pharmModal,{childList:true,subtree:false});
addStudyLoungeShortcut();
document.getElementById('modalBody').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.vpqpnBack!==undefined){e.preventDefault();nutritionMenu();}
 if(b.dataset.vpqpnCard!==undefined){e.preventDefault();nutritionCard(Number(b.dataset.vpqpnCard));}
});
function drawing(){
 return '<svg class="vpqPharmNutritionArt" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pastel clinic pharmacy with medication cabinets, pet nutrition food bags, a toxicology caution book and a smiling turtle">'+
 '<defs><linearGradient id="vpqPNFloor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e9d7b7"/><stop offset="1" stop-color="#c9b295"/></linearGradient></defs>'+
 // Dimensional room with recessed side walls.
 '<rect width="1000" height="500" fill="#c0e3d8"/><polygon points="0,0 1000,0 930,50 70,50" fill="#fcfff6"/><polygon points="0,0 70,50 70,326 0,395" fill="#9bc8bc"/><polygon points="930,50 1000,0 1000,395 930,326" fill="#9bc8bc"/><rect x="70" y="50" width="860" height="276" fill="#eff8ed"/><path d="M70 326H930L1000 500H0Z" fill="url(#vpqPNFloor)"/><path d="M70 326L0 500M930 326L1000 500M246 326L202 500M490 326L490 500M733 326L775 500M38 422H963M57 371H942" stroke="#fff8eb" fill="none" stroke-width="3" opacity=".75"/><path d="M70 326H930" stroke="#8fbab5" stroke-width="10"/>'+
 // Medicine cabinet wall — clear shelves and recognizable bottles, not one generic tile.
 '<g transform="translate(84 86)"><rect width="314" height="246" rx="12" fill="#8db1aa" stroke="#608e89" stroke-width="9"/><rect x="12" y="12" width="290" height="219" rx="6" fill="#dff2e9"/><path d="M12 83H302M12 152H302M156 12V232" stroke="#7da9a0" stroke-width="9"/>'+
 '<g font-family="sans-serif" font-weight="800" text-anchor="middle" fill="#516f74">'+
 '<rect x="24" y="23" width="39" height="46" rx="6" fill="#fefdfa" stroke="#91b7ba" stroke-width="4"/><path d="M32 24V14h23v10" fill="#f4c9a8"/><text x="43" y="54" font-size="14">Rx</text>'+
 '<rect x="80" y="28" width="58" height="39" rx="6" fill="#f2d4db" stroke="#c19bab" stroke-width="3"/><text x="109" y="53" font-size="13">TAB</text>'+
 '<rect x="174" y="23" width="43" height="46" rx="5" fill="#fff7e3" stroke="#d1bda6" stroke-width="4"/><rect x="185" y="15" width="21" height="10" rx="3" fill="#86b3ac"/><text x="196" y="56" font-size="12">Rx</text>'+
 '<rect x="236" y="27" width="53" height="39" rx="6" fill="#e5d5ee" stroke="#b6a1c9" stroke-width="3"/><text x="262" y="53" font-size="12">CAP</text>'+
 '<rect x="24" y="96" width="53" height="42" rx="5" fill="#e3eefa" stroke="#9fb8d4" stroke-width="3"/><text x="50" y="122" font-size="12">Rx</text>'+
 '<rect x="93" y="96" width="45" height="43" rx="5" fill="#f9f6ef" stroke="#c2b7ad" stroke-width="3"/><text x="115" y="121" font-size="12">Rx</text>'+
 '<rect x="175" y="96" width="47" height="43" rx="5" fill="#fffdf3" stroke="#acc9be" stroke-width="3"/><text x="198" y="121" font-size="12">Rx</text>'+
 '<rect x="242" y="97" width="48" height="42" rx="5" fill="#d6ece2" stroke="#8fb3a1" stroke-width="3"/><text x="266" y="123" font-size="12">Rx</text>'+
 '<rect x="27" y="167" width="109" height="50" rx="5" fill="#fff9ec" stroke="#b7bdab" stroke-width="4"/><text x="81" y="189" font-size="16">CLINIC</text><text x="81" y="207" font-size="13">SUPPLIES</text>'+
 '<rect x="176" y="166" width="108" height="50" rx="6" fill="#f5eee0" stroke="#bac2b7" stroke-width="4"/><text x="230" y="191" font-size="18">💊</text><text x="230" y="209" font-size="12">SHELVES</text></g>'+
 '<rect x="20" y="232" width="272" height="16" rx="4" fill="#77a49c"/></g>'+
 // Nutrition shop fixtures: full food bags, canned-food tiers, and clear treat bins.
 '<g transform="translate(431 107)">'+
 '<rect x="-3" y="3" width="274" height="224" rx="9" fill="#c5ac91" stroke="#9a806f" stroke-width="5"/>'+
 '<rect x="6" y="10" width="257" height="195" rx="5" fill="#fbf1df"/>'+
 '<rect x="12" y="15" width="245" height="22" rx="5" fill="#8fbbb1"/>'+
 '<text x="134" y="31" font-family="Arial" font-size="13" font-weight="900" text-anchor="middle" fill="#fffdf6">PET FOOD &amp; TREATS</text>'+
 '<rect x="14" y="43" width="241" height="67" rx="5" fill="#e2f1e8" stroke="#b9d2c7" stroke-width="2"/>'+
 '<text x="72" y="53" font-family="Arial" font-size="9" font-weight="900" fill="#65877c">CANNED FOOD</text>'+
 '<text x="194" y="53" font-family="Arial" font-size="9" font-weight="900" fill="#65877c">TREATS</text>'+
 // Cans stacked in clearly separated rows with small pet icons.
 [0,1].map((row)=>[0,1,2,3].map((i)=>{const x=21+i*26,y=60+row*23;return '<g><rect x="'+x+'" y="'+y+'" width="21" height="19" rx="4" fill="'+(['#e5ac9c','#a5c7ce','#dbb9db','#a9c7a9'][(i+row)%4])+'" stroke="#9f9a93" stroke-width="1.8"/><ellipse cx="'+(x+10.5)+'" cy="'+y+'" rx="10.5" ry="3" fill="#f8f9f3" stroke="#a2aba9" stroke-width="1"/><text x="'+(x+10.5)+'" y="'+(y+14)+'" font-size="10" text-anchor="middle">'+(row?'🐈':'🐕')+'</text></g>'}).join('')).join('')+
 // Treat containers; distinct from medication bottles.
 [0,1,2].map((i)=>{const x=148+i*35;return '<g><rect x="'+x+'" y="63" width="29" height="39" rx="6" fill="'+(['#efd8b0','#ddc4da','#b9dbce'][i])+'" stroke="#a8a09f" stroke-width="2"/><rect x="'+(x+3)+'" y="59" width="23" height="8" rx="3" fill="#e9eee8" stroke="#a2b8b4" stroke-width="1.3"/><text x="'+(x+14)+'" y="84" font-size="12" text-anchor="middle">'+(['🦴','🐟','🥕'][i])+'</text><text x="'+(x+14)+'" y="97" font-family="Arial" font-size="6.5" text-anchor="middle" fill="#6d6571">TREATS</text></g>'}).join('')+
 '<path d="M13 111h243" stroke="#a78d7b" stroke-width="7"/>'+
 // Staggered front bags with readable DOG/CAT labels, below the supply shelves.
 '<path d="M16 145l10 -22h67l12 22v63H16Z" fill="#e5c195" stroke="#b28f6f" stroke-width="4"/>'+
 '<path d="M24 123l-5 -9h81l-6 9" fill="#cead8c"/><ellipse cx="61" cy="165" rx="32" ry="26" fill="#fff2e0"/>'+
 '<text x="61" y="172" font-size="29" text-anchor="middle">🐕</text><text x="61" y="199" font-family="Arial" font-size="12" font-weight="900" text-anchor="middle" fill="#75604d">DOG FOOD</text>'+
 '<path d="M115 153l12 -29h65l13 29v55H115Z" fill="#c9b0d4" stroke="#a189b2" stroke-width="4"/>'+
 '<path d="M126 124l-4 -10h79l-7 10" fill="#b49ac4"/><ellipse cx="160" cy="168" rx="30" ry="25" fill="#f8f0ff"/>'+
 '<text x="160" y="175" font-size="27" text-anchor="middle">🐈</text><text x="160" y="201" font-family="Arial" font-size="12" font-weight="900" text-anchor="middle" fill="#6c567d">CAT FOOD</text>'+
 '<path d="M212 165l6 -17h35l7 17v43h-48Z" fill="#afc9a3" stroke="#839f83" stroke-width="3"/>'+
 '<text x="236" y="184" font-size="17" text-anchor="middle">🐇</text><text x="236" y="200" font-family="Arial" font-size="8" text-anchor="middle" fill="#567363">SMALL PET</text>'+
 '<path d="M9 210h251" stroke="#9a7e6d" stroke-width="9"/>'+
 '<path d="M5 221H267V328H5Z" fill="#c7aa8d" stroke="#a48670" stroke-width="5"/>'+
 '<path d="M134 224v101M18 244h231" stroke="#ad8d75" stroke-width="3"/>'+
 '<rect x="20" y="255" width="96" height="45" rx="5" fill="#ddc6aa"/><rect x="149" y="255" width="96" height="45" rx="5" fill="#e7d2b8"/>'+
 '<text x="68" y="282" font-family="Arial" font-size="12" font-weight="800" text-anchor="middle" fill="#7d6559">STOCK</text>'+
 '<text x="197" y="282" font-family="Arial" font-size="12" font-weight="800" text-anchor="middle" fill="#7d6559">NUTRITION</text></g>'+
 // Side-wall equipment, safely outside the medication cabinet and food station hotspots.
 '<g font-family="Arial" font-weight="800"><rect x="8" y="104" width="62" height="150" rx="5" fill="#eaf1e9" stroke="#81aa9f" stroke-width="4"/>'+
 '<text x="39" y="117" text-anchor="middle" font-size="9" fill="#577d75">E-COLLARS</text>'+
 '<path d="M16 127h47" stroke="#a8bcb5" stroke-width="3"/>'+
 // Three tapered veterinary recovery cones, with neck openings, stitched edging and fastening tabs.
 '<g transform="translate(11 126)"><path d="M5 16L28 4Q49 16 49 35L25 49Q5 38 5 16Z" fill="#e4f6fb" stroke="#79a4b4" stroke-width="2.5"/><ellipse cx="30" cy="26" rx="10" ry="8" fill="#b9d7d8" stroke="#76a5ad" stroke-width="2"/><path d="M6 17Q18 20 26 43" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/><rect x="41" y="20" width="7" height="7" rx="2" fill="#fff5e6" stroke="#90adae"/></g>'+
 '<g transform="translate(20 175) rotate(-13 22 24)"><path d="M3 11L28 1Q46 13 46 29L24 45Q5 35 3 11Z" fill="#f0e3f4" stroke="#b19bbd" stroke-width="2.5"/><ellipse cx="26" cy="22" rx="9" ry="7" fill="#d9c4df" stroke="#aa90b8" stroke-width="2"/><path d="M5 12L23 40" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/><rect x="38" y="14" width="7" height="7" rx="2" fill="#fbfaf6" stroke="#aa90b8"/></g>'+
 '<g transform="translate(14 211) scale(.65)"><path d="M3 10L34 2Q56 17 55 39L26 58Q4 42 3 10Z" fill="#e5efda" stroke="#86aa93" stroke-width="3"/><ellipse cx="31" cy="29" rx="11" ry="9" fill="#c4d8bb" stroke="#7caa90" stroke-width="2.5"/></g>'+
 '<text x="39" y="244" font-size="8" text-anchor="middle" fill="#577d75">XS • S • M • L</text>'+
 '<rect x="919" y="77" width="64" height="66" rx="5" fill="#f1ede5" stroke="#9ab6ac" stroke-width="4"/>'+
 '<text x="950" y="90" text-anchor="middle" font-size="9" fill="#5a7778">LEASHES</text>'+
 // Individual leash hooks, looped nylon leads, metal D-rings and matching collars.
 [0,1,2].map(i=>{const x=931+i*19,c=['#8e94cd','#d990a2','#78aa95'][i];return '<g><circle cx="'+x+'" cy="99" r="3.4" fill="#8b9f9b"/><path d="M'+x+' 102q-12 10 -7 28q8 11 13 -1v-15q-1 -11 -6 -12" fill="none" stroke="'+c+'" stroke-width="5" stroke-linecap="round"/><path d="M'+(x-8)+' 130q9 14 18 0" fill="none" stroke="'+c+'" stroke-width="3"/><rect x="'+(x+6)+'" y="126" width="5" height="9" rx="2" fill="#e7eeea" stroke="#879d99"/><ellipse cx="'+x+'" cy="141" rx="10" ry="4" fill="none" stroke="'+c+'" stroke-width="3"/></g>'}).join('')+
 '</g>'+
 // Carrier storage above the drug shelves, with vents and doors.
 '<g transform="translate(126 47)"><rect width="77" height="40" rx="8" fill="#e7d7c8" stroke="#a9aaa8" stroke-width="4"/>'+
 '<path d="M20 1Q22 -10 38 -10Q53 -10 57 1" stroke="#b8a99d" stroke-width="5" fill="none"/>'+
 '<rect x="24" y="11" width="30" height="25" rx="4" fill="#849ca6"/>'+
 '<path d="M31 13v20M38 13v20M45 13v20" stroke="#d3e2dd" stroke-width="3"/>'+
 '<path d="M6 14h11m-11 7h11m-11 7h11" stroke="#b8b3aa" stroke-width="2"/>'+
 '<rect x="116" y="-2" width="74" height="42" rx="8" fill="#c6d9cf" stroke="#9bb4ac" stroke-width="4"/>'+
 '<path d="M135 -2q3 -13 17 -13q16 0 20 13" stroke="#91aca7" stroke-width="5" fill="none"/>'+
 '<rect x="140" y="9" width="29" height="27" rx="4" fill="#788e95"/>'+
 '<path d="M147 11v23m8 -23v23m8 -23v23" stroke="#d7e7e0" stroke-width="3"/>'+
 '<path d="M123 13h11m-11 8h11m-11 8h11" stroke="#a2b6ad" stroke-width="2"/>'+
 '</g>'+
 // A small caution book on wall stand; unmistakable toxicology object.
 '<g transform="translate(755 119)"><rect x="-12" y="167" width="177" height="14" rx="5" fill="#a6c5bf"/><rect x="4" y="23" width="135" height="144" rx="10" fill="#efd7c9" stroke="#a76b6e" stroke-width="7"/><rect x="15" y="32" width="109" height="126" rx="6" fill="#ffefd8" stroke="#d6a49a" stroke-width="4"/><rect x="26" y="45" width="88" height="30" rx="5" fill="#cc7074"/><text x="70" y="66" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle" fill="#fff9f2">CAUTION</text><text x="70" y="116" text-anchor="middle" font-size="41">☣️</text><text x="70" y="143" font-family="sans-serif" text-anchor="middle" font-size="14" font-weight="900" fill="#9a565c">TOXICOLOGY</text><path d="M17 35V154" stroke="#c7928c" stroke-width="5"/></g>'+
 // Door into Mechanism Lab at far right, with vertical wall frame.
 '<g transform="translate(914 150)"><rect x="0" y="0" width="74" height="193" rx="6" fill="#7da5a6" stroke="#517f85" stroke-width="9"/><rect x="9" y="12" width="52" height="162" fill="#d3e9e8"/><text x="35" y="59" text-anchor="middle" font-size="25">🔬</text><text x="35" y="82" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#4a7a83">LAB</text><circle cx="17" cy="121" r="6" fill="#ebc77e"/></g>'+
 // Cute turtle terrarium on a low counter (decor only).
 '<g transform="translate(714 362)"><ellipse cx="90" cy="74" rx="93" ry="15" fill="#6b7a79" opacity=".16"/><rect x="8" y="10" width="155" height="76" rx="9" fill="#bde7e3" fill-opacity=".65" stroke="#7eaca9" stroke-width="7"/><path d="M13 71q69 -20 144 0v10H13Z" fill="#e7d5ad"/><ellipse cx="83" cy="58" rx="37" ry="25" fill="#81b89a" stroke="#568d75" stroke-width="5"/><ellipse cx="104" cy="51" rx="27" ry="21" fill="#6da889" stroke="#4d866c" stroke-width="4"/><circle cx="112" cy="45" r="3" fill="#355b56"/><ellipse cx="49" cy="79" rx="13" ry="6" fill="#669d80"/><ellipse cx="111" cy="77" rx="13" ry="6" fill="#669d80"/><path d="M29 40V17M139 41V15" stroke="#78a993" stroke-width="4"/><ellipse cx="26" cy="22" rx="15" ry="10" fill="#82bd9a"/><ellipse cx="141" cy="19" rx="17" ry="10" fill="#82bd9a"/><text x="87" y="103" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="900" fill="#4d7774">TURTLE ASSISTANT</text></g>'+
 '<text x="500" y="34" text-anchor="middle" font-family="sans-serif" font-size="21" font-weight="900" fill="#507973">PHARMACY &amp; NUTRITION</text></svg>';
}

function pharmacyHelp(topic){
 const help={
  drugs:['💊 Drug Shelves','Look up medication classes, mechanisms of action, species considerations, contraindications, adverse effects and clinical monitoring. This station is the drug reference, not the exam or quiz area.'],
  rounds:['🩺 Clinical Rounds','Practice using drug mechanisms in veterinary patient scenarios: choose treatments, explain your reasoning and monitor adverse effects. Pharmacology learning by lecture is in the Student Study Lounge.'],
  food:['🥣 Pet Nutrition','Review body condition, nutrition assessment, food labels, species-specific nutrient needs, energy requirements and therapeutic diet considerations.'],
  tox:['☣️ Caution Book','Study toxic exposures, clinical signs, target organs, species risks, emergency priorities, and monitoring. Always verify protocols and doses with current clinical references.'],
  lab:['🔬 Mechanism Lab','Enter the Mechanism Lab to examine pharmacologic targets, mechanisms and why treatments produce physiologic effects.']
 };
 const x=help[topic];if(!x)return;
 showModal(x[0]+' · What is this?', '<div class="infobox"><b>What this section does</b><p>'+x[1]+'</p></div><p class="tiny">Close this explanation, then select the station label to open it.</p>');
}
art.roomArt=function(k){return k==='pharmacy'?drawing():previous(k)};
rooms.pharmacy.name='Pharmacy & Pet Nutrition';
rooms.pharmacy.props=[
 {x:18,emoji:'💊',label:'Drug Shelves',action:'pharmacy',bubble:'Drug reference'},
 {x:45,emoji:'🥣',label:'Pet Nutrition',action:'vpqNutritionGuide',bubble:'Food & physiology'},
 {x:67,emoji:'☣️',label:'Caution Book',action:'vpqToxPreview',bubble:'Toxicology reference'},
 {x:90,emoji:'🔬',label:'Mechanism Lab Door',action:'vpqMechEnter',bubble:'Enter lab'}
];
function refresh(){
 stage.querySelector('#vpqPNHotspots')?.remove();
 if(stage.dataset.room!=='pharmacy')return;
 const node=document.createElement('div');node.id='vpqPNHotspots';
 node.innerHTML='<button type="button" class="vpqPNHot vpqPNDrugs" data-vpqpnaction="pharmacy" aria-label="Open the medication cabinets and drug encyclopedia"><span>💊 Drug Shelves</span></button>'+
 '<button type="button" class="vpqPNStudyLink" data-vpqpn-study="1" aria-label="Go to Student Study Lounge for pharmacology and toxicology lessons, cases and practice">📚 Learn &amp; practice Pharm / Tox in Student Lounge →</button>'+ 
 '<button type="button" class="vpqPNHot vpqPNRounds" data-vpqpnaction="vpqPharmVisualRounds" aria-label="Open clinical pharmacology visual cases and testing"><span>🩺 Clinical Rounds</span></button>'+ 
 '<button type="button" class="vpqPNHot vpqPNFood" data-vpqpnaction="vpqNutritionGuide" aria-label="Open the pet nutrition corner and reference cards"><span>🥣 Pet Nutrition</span></button>'+
 '<button type="button" class="vpqPNHot vpqPNTox" data-vpqpnaction="vpqToxPreview" aria-label="Open the toxicology caution book reference preview"><span>☣️ Caution Book</span></button>'+
 '<button type="button" class="vpqPNHot vpqPNLab" data-vpqpnaction="vpqMechEnter" aria-label="Enter the mechanism lab"><span>🔬 Lab</span></button>'+
 '<button type="button" class="vpqPNHelp vpqPNHelpDrugs" data-vpqpnhelp="drugs" aria-label="What are the Drug Shelves for?" title="About Drug Shelves">?</button>'+
 '<button type="button" class="vpqPNHelp vpqPNHelpRounds" data-vpqpnhelp="rounds" aria-label="What are Clinical Rounds for?" title="About Clinical Rounds">?</button>'+
 '<button type="button" class="vpqPNHelp vpqPNHelpFood" data-vpqpnhelp="food" aria-label="What is Pet Nutrition for?" title="About Pet Nutrition">?</button>'+
 '<button type="button" class="vpqPNHelp vpqPNHelpTox" data-vpqpnhelp="tox" aria-label="What is the Caution Book for?" title="About the Caution Book">?</button>'+
 '<button type="button" class="vpqPNHelp vpqPNHelpLab" data-vpqpnhelp="lab" aria-label="What is the Mechanism Lab for?" title="About the Mechanism Lab">?</button>';
 node.addEventListener('click',e=>{const help=e.target.closest('[data-vpqpnhelp]');if(help){e.preventDefault();e.stopPropagation();pharmacyHelp(help.dataset.vpqpnhelp);return}const go=e.target.closest('[data-vpqpn-study]');if(go){changeRoom('study');return}const b=e.target.closest('[data-vpqpnaction]');if(b)doAction(b.dataset.vpqpnaction)});
 stage.appendChild(node);
}
const style=document.createElement('style');
style.textContent='.vpqPharmNutritionArt{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}'+
'.stage[data-room="pharmacy"] .prop,.stage[data-room="pharmacy"] .roomdecor{display:none!important}'+
'#vpqPNHotspots{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqPNHot{position:absolute;pointer-events:auto;border:2px solid #87a9a955;border-radius:12px;box-shadow:none;transform:none!important;background:#ffffff0d}'+
'.vpqPNHot:hover{border-color:#78aeb6;background:#e1f5ef16;outline:none}.vpqPNHot:focus-visible{border-color:#5f99a8;background:#e1f5ef16;outline:2px solid #568ea4;outline-offset:2px}'+
'.vpqPNHot span{position:absolute;bottom:3%;left:50%;transform:translate(-50%,0);white-space:nowrap;border:2px solid #7ea9a6;background:#fffdf5;color:#375f68;font-size:11px;font-weight:900;padding:5px 8px;border-radius:13px;box-shadow:0 3px 0 #567f8030}'+
'.vpqPNRounds{left:10%;top:68%;width:30%;height:20%;border:2px solid #e4aa91;background:#fff4da26}.vpqPNRounds span{bottom:6%;background:#fff5eb;border-color:#e4b6a8;color:#895568}'+
 '.vpqPNDrugs{left:9%;top:18%;width:30%;height:49%}.vpqPNFood{left:44%;top:23%;width:23%;height:49%}.vpqPNTox{left:75%;top:22%;width:15%;height:39%}.vpqPNLab{left:92%;top:28%;width:7%;height:38%}.vpqPNLab span{left:auto;right:0;transform:none}'+
'.vpqPNStudyLink{position:absolute;z-index:6;left:9%;top:10%;width:38%;pointer-events:auto;border:2px solid #8a94c8;border-radius:12px;background:#fffdf2;color:#534c85;padding:7px 10px;font-size:11px;font-weight:900;box-shadow:0 3px 8px #35436633;cursor:pointer}.vpqPNStudyLink:hover,.vpqPNStudyLink:focus-visible{background:#fff2c7;outline:2px solid #f5c66f}'+
'/* Small floating question marks explain each interactable section without blocking entry. */'+
'.vpqPNHelp{position:absolute;pointer-events:auto;z-index:9;width:24px;height:24px;padding:0;display:grid;place-items:center;border:2px solid #79a7ac;border-radius:50%;background:#fcfffa;color:#276775;font-size:15px;font-weight:1000;box-shadow:0 2px 5px #254a4a30;transform:none!important;line-height:1;cursor:help}'+
'.vpqPNHelp:hover,.vpqPNHelp:focus-visible{background:#d6f3ed;outline:2px solid #447f86;outline-offset:2px}'+
'.vpqPNHelpDrugs{left:36%;top:20%}.vpqPNHelpRounds{left:36%;top:70%}.vpqPNHelpFood{left:65%;top:25%}.vpqPNHelpTox{left:87%;top:24%}.vpqPNHelpLab{left:96%;top:29%}'+
'.vpqPNFoodCards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:9px;margin:12px 0}.vpqPNFoodCards button{display:block;text-align:left;background:#f6fcf7;border:2px solid #b9d7c8;border-radius:13px;padding:13px}.vpqPNFoodCards b,.vpqPNFoodCards small{display:block}.vpqPNFoodCards small{color:#617e75;font-size:12px;margin-top:6px}'+
'@media(max-width:620px){.vpqPNHot span{font-size:9px;padding:3px 4px}.vpqPNLab span{right:0}.vpqPNTox span{bottom:12%}}';
document.head.appendChild(style);
const obs=new MutationObserver(()=>{const needed=stage.dataset.room==='pharmacy',present=!!stage.querySelector('#vpqPNHotspots');if(needed!==present)refresh()});
obs.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
refresh();
return {refresh,drawing,nutritionMenu};
};