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
 // Standing product display with stylized dog/cat food bags (not real brands).
 '<g transform="translate(445 129)"><rect x="-12" y="173" width="241" height="20" rx="5" fill="#a58165"/><path d="M0 192h219v107H0Z" fill="#c8ab8d" stroke="#9e806c" stroke-width="6"/><path d="M108 195v99" stroke="#aa8a72" stroke-width="5"/><path d="M88 227v31m43 -31v31" stroke="#8e7666" stroke-width="5" stroke-linecap="round"/>'+
 '<g><path d="M7 58L23 35H92L105 58V176H7Z" fill="#dfbd8c" stroke="#ad8c69" stroke-width="5"/><path d="M23 35l-6 -13h80l-6 13" fill="#c99a79"/><ellipse cx="56" cy="109" rx="36" ry="30" fill="#fff2dd"/><text x="56" y="118" text-anchor="middle" font-size="37">🐕</text><text x="56" y="153" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="900" fill="#775f4f">DOG FOOD</text></g>'+
 '<g><path d="M114 72L132 43H200L215 72V177H114Z" fill="#baa4cf" stroke="#9580ad" stroke-width="5"/><path d="M132 44l-6 -13h79l-5 13" fill="#a48cbb"/><ellipse cx="166" cy="115" rx="34" ry="30" fill="#f7eefb"/><text x="166" y="125" text-anchor="middle" font-size="37">🐈</text><text x="166" y="155" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="900" fill="#69557c">CAT FOOD</text></g></g>'+
 // A small caution book on wall stand; unmistakable toxicology object.
 '<g transform="translate(755 119)"><rect x="-12" y="167" width="177" height="14" rx="5" fill="#a6c5bf"/><rect x="4" y="23" width="135" height="144" rx="10" fill="#efd7c9" stroke="#a76b6e" stroke-width="7"/><rect x="15" y="32" width="109" height="126" rx="6" fill="#ffefd8" stroke="#d6a49a" stroke-width="4"/><rect x="26" y="45" width="88" height="30" rx="5" fill="#cc7074"/><text x="70" y="66" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle" fill="#fff9f2">CAUTION</text><text x="70" y="116" text-anchor="middle" font-size="41">☣️</text><text x="70" y="143" font-family="sans-serif" text-anchor="middle" font-size="14" font-weight="900" fill="#9a565c">TOXICOLOGY</text><path d="M17 35V154" stroke="#c7928c" stroke-width="5"/></g>'+
 // Door into Mechanism Lab at far right, with vertical wall frame.
 '<g transform="translate(914 150)"><rect x="0" y="0" width="74" height="193" rx="6" fill="#7da5a6" stroke="#517f85" stroke-width="9"/><rect x="9" y="12" width="52" height="162" fill="#d3e9e8"/><text x="35" y="59" text-anchor="middle" font-size="25">🔬</text><text x="35" y="82" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#4a7a83">LAB</text><circle cx="17" cy="121" r="6" fill="#ebc77e"/></g>'+
 // Cute turtle terrarium on a low counter (decor only).
 '<g transform="translate(714 362)"><ellipse cx="90" cy="74" rx="93" ry="15" fill="#6b7a79" opacity=".16"/><rect x="8" y="10" width="155" height="76" rx="9" fill="#bde7e3" fill-opacity=".65" stroke="#7eaca9" stroke-width="7"/><path d="M13 71q69 -20 144 0v10H13Z" fill="#e7d5ad"/><ellipse cx="83" cy="58" rx="37" ry="25" fill="#81b89a" stroke="#568d75" stroke-width="5"/><ellipse cx="104" cy="51" rx="27" ry="21" fill="#6da889" stroke="#4d866c" stroke-width="4"/><circle cx="112" cy="45" r="3" fill="#355b56"/><ellipse cx="49" cy="79" rx="13" ry="6" fill="#669d80"/><ellipse cx="111" cy="77" rx="13" ry="6" fill="#669d80"/><path d="M29 40V17M139 41V15" stroke="#78a993" stroke-width="4"/><ellipse cx="26" cy="22" rx="15" ry="10" fill="#82bd9a"/><ellipse cx="141" cy="19" rx="17" ry="10" fill="#82bd9a"/><text x="87" y="103" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="900" fill="#4d7774">TURTLE ASSISTANT</text></g>'+
 '<text x="500" y="34" text-anchor="middle" font-family="sans-serif" font-size="21" font-weight="900" fill="#507973">PHARMACY &amp; NUTRITION</text></svg>';
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
 '<button type="button" class="vpqPNHot vpqPNRounds" data-vpqpnaction="vpqPharmVisualRounds" aria-label="Open clinical pharmacology visual cases and testing"><span>🩺 Clinical Rounds</span></button>'+ 
 '<button type="button" class="vpqPNHot vpqPNFood" data-vpqpnaction="vpqNutritionGuide" aria-label="Open the pet nutrition corner and reference cards"><span>🥣 Pet Nutrition</span></button>'+
 '<button type="button" class="vpqPNHot vpqPNTox" data-vpqpnaction="vpqToxPreview" aria-label="Open the toxicology caution book reference preview"><span>☣️ Caution Book</span></button>'+
 '<button type="button" class="vpqPNHot vpqPNLab" data-vpqpnaction="vpqMechEnter" aria-label="Enter the mechanism lab"><span>🔬 Lab</span></button>';
 node.addEventListener('click',e=>{const b=e.target.closest('[data-vpqpnaction]');if(b)doAction(b.dataset.vpqpnaction)});
 stage.appendChild(node);
}
const style=document.createElement('style');
style.textContent='.vpqPharmNutritionArt{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}'+
'.stage[data-room="pharmacy"] .prop,.stage[data-room="pharmacy"] .roomdecor{display:none!important}'+
'#vpqPNHotspots{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqPNHot{position:absolute;pointer-events:auto;border:2px solid #87a9a955;border-radius:12px;box-shadow:none;transform:none!important;background:#ffffff0d}'+
'.vpqPNHot:hover,.vpqPNHot:focus-visible{border:3px solid #f0bf68;background:#ffedbb40;outline:2px solid #ffffff}'+
'.vpqPNHot span{position:absolute;bottom:3%;left:50%;transform:translate(-50%,0);white-space:nowrap;border:2px solid #7ea9a6;background:#fffdf5;color:#375f68;font-size:11px;font-weight:900;padding:5px 8px;border-radius:13px;box-shadow:0 3px 0 #567f8030}'+
'.vpqPNRounds{left:10%;top:68%;width:30%;height:20%;border:2px solid #e4aa91;background:#fff4da26}.vpqPNRounds span{bottom:6%;background:#fff5eb;border-color:#e4b6a8;color:#895568}'+
 '.vpqPNDrugs{left:9%;top:18%;width:30%;height:49%}.vpqPNFood{left:44%;top:23%;width:23%;height:49%}.vpqPNTox{left:75%;top:22%;width:15%;height:39%}.vpqPNLab{left:92%;top:28%;width:7%;height:38%}.vpqPNLab span{left:auto;right:0;transform:none}'+
'.vpqPNFoodCards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:9px;margin:12px 0}.vpqPNFoodCards button{display:block;text-align:left;background:#f6fcf7;border:2px solid #b9d7c8;border-radius:13px;padding:13px}.vpqPNFoodCards b,.vpqPNFoodCards small{display:block}.vpqPNFoodCards small{color:#617e75;font-size:12px;margin-top:6px}'+
'@media(max-width:620px){.vpqPNHot span{font-size:9px;padding:3px 4px}.vpqPNLab span{right:0}.vpqPNTox span{bottom:12%}}';
document.head.appendChild(style);
const obs=new MutationObserver(()=>{const needed=stage.dataset.room==='pharmacy',present=!!stage.querySelector('#vpqPNHotspots');if(needed!==present)refresh()});
obs.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
refresh();
return {refresh,drawing,nutritionMenu};
};