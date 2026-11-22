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
 '<rect x="176" y="166" width="108" height="50" rx="6" fill="#f5eee0" stroke="#bac2b7" stroke-width="4"/><text x="230" y="191" font-size="18">💊</text><text x="230" y="209" font-size="12">SUPPLIES</text></g>'+

 // Clean medication packaging details, confined to each label (no lines across the bottles).
 '<g font-family="Arial" text-anchor="middle" font-weight="800">'+
 '<rect x="23" y="4" width="74" height="13" rx="3" fill="#fffaf0" stroke="#8faeaa" stroke-width="1"/><text x="60" y="14" font-size="8" fill="#4c7774">ORAL MEDS</text>'+
 '<rect x="174" y="4" width="113" height="13" rx="3" fill="#fffaf0" stroke="#8faeaa" stroke-width="1"/><text x="230" y="14" font-size="8" fill="#4c7774">STOCK · CHECK LOT</text>'+
 '<g fill="#fff" stroke="#b3c5c0" stroke-width="1"><rect x="33" y="31" width="23" height="7" rx="2"/><rect x="183" y="30" width="25" height="7" rx="2"/></g>'+
 '<text x="44" y="37" font-size="5.5" fill="#5b8781">10 mg</text><text x="195" y="36" font-size="5.5" fill="#5b8781">5 mL</text>'+
 '<g transform="translate(35 174)"><rect width="25" height="11" rx="2" fill="#fafcfc" stroke="#96ada6"/><circle cx="6" cy="5.5" r="2.2" fill="#f4d4bd"/><circle cx="13" cy="5.5" r="2.2" fill="#f4d4bd"/><circle cx="20" cy="5.5" r="2.2" fill="#f4d4bd"/></g>'+
 '<g transform="translate(107 179) rotate(-24)"><rect width="20" height="3" rx="1.5" fill="#d4eeed" stroke="#729ca4"/><path d="M4 -3v9M18 -2v7" stroke="#668ba2"/><rect x="20" y="-1" width="8" height="5" fill="#eff5f0" stroke="#9db8b1"/></g>'+
 '<g transform="translate(191 176)"><rect width="20" height="14" rx="2" fill="#f8ede3" stroke="#b9aaa2"/><rect x="5" y="-4" width="10" height="5" rx="1.2" fill="#9db9af"/><rect x="3" y="5" width="14" height="5" fill="#fffefa"/><text x="10" y="9" font-size="5" fill="#6e8a85">Rx</text></g>'+
 '<g transform="translate(239 178)"><rect width="28" height="11" rx="2" fill="#f6f4ee" stroke="#b5b0a1"/><path d="M5 4h17M5 7h14" stroke="#94b8ab" stroke-width="1.2"/></g>'+
 '</g>'+
 '<rect x="20" y="232" width="272" height="16" rx="4" fill="#77a49c"/></g>'+
 // Nutrition shop fixtures: full food bags, canned-food tiers, and clear treat bins.
 '<g transform="translate(431 64)">'+
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
 '<path d="M5 221H267V268H5Z" fill="#c7aa8d" stroke="#a48670" stroke-width="5"/>'+
 '<path d="M134 224v41M18 240h231" stroke="#ad8d75" stroke-width="2.5"/>'+
 '<rect x="20" y="245" width="96" height="18" rx="3" fill="#ddc6aa"/><rect x="149" y="245" width="96" height="18" rx="3" fill="#e7d2b8"/>'+
 '<text x="68" y="258" font-family="Arial" font-size="10" font-weight="800" text-anchor="middle" fill="#7d6559">STOCK</text>'+
 '<text x="197" y="258" font-family="Arial" font-size="10" font-weight="800" text-anchor="middle" fill="#7d6559">NUTRITION</text></g>'+
 // Wall-mounted transparent Elizabethan collars: stacked curved cones in a horizontal keeper rack.
 '<g font-family="Arial" font-weight="800">'+
 '<rect x="7" y="104" width="71" height="164" rx="5" fill="#eff5ee" stroke="#81aa9f" stroke-width="3"/>'+
 '<text x="42" y="118" text-anchor="middle" font-size="9" fill="#577d75">E-COLLARS</text>'+
 '<path d="M12 128h61" stroke="#668b86" stroke-width="3.5"/>'+
 '<circle cx="20" cy="129" r="3" fill="#87a9a2"/><circle cx="64" cy="129" r="3" fill="#87a9a2"/>'+
 // Shallow view into open transparent cone (outer rim, narrowing toward inner neck opening).
 [0,1,2].map((i)=>{const y=139+i*34, width=55-i*5, lx=42-width/2, rx=42+width/2;return '<g>'+
 '<path d="M'+lx+' '+y+' Q42 '+(y-9)+' '+rx+' '+y+' L'+(rx-5)+' '+(y+25)+' Q42 '+(y+32)+' '+(lx+5)+' '+(y+25)+' Z" fill="'+(['#e1f2ee','#e1eefa','#f0e6f1'][i])+'" fill-opacity=".78" stroke="'+(['#799c9c','#8da8b5','#ae9fb2'][i])+'" stroke-width="2"/>'+
 '<path d="M'+lx+' '+y+' Q42 '+(y-12)+' '+rx+' '+y+'" fill="none" stroke="#557d83" stroke-width="3.2"/>'+
 '<ellipse cx="42" cy="'+(y+17)+'" rx="'+(8-i)+'" ry="4" fill="#b9d6d1" fill-opacity=".75" stroke="#86a9a3" stroke-width="1.4"/>'+
 '<path d="M'+(lx+5)+' '+(y+23)+'Q42 '+(y+29)+' '+(rx-5)+' '+(y+23)+'" fill="none" stroke="#a4c4c0" stroke-width="1.3"/>'+
 '</g>'}).join('')+
 '<path d="M11 238h63" stroke="#9bb3ad" stroke-width="2"/><text x="42" y="251" text-anchor="middle" font-size="8" fill="#577d75">XS · S · M · L</text>'+
 '</g>'+
// Lower-wall leash organizer fully inside the right frame.
 '<g transform="translate(-15 0)" font-family="Arial" font-weight="800">'+
 '<rect x="900" y="358" width="94" height="83" rx="7" fill="#eef6ec" stroke="#91b8a8" stroke-width="3"/>'+
 '<rect x="907" y="365" width="80" height="11" rx="4" fill="#a1bcae" stroke="#779b8d" stroke-width="1.3"/>'+
 '<text x="946" y="374" font-size="8" text-anchor="middle" fill="#3e7166">LEADS &amp; COLLARS</text>'+
 '<path d="M906 382H986" stroke="#789d93" stroke-width="3"/>'+
 [0,1,2].map(i=>{const x=919+i*26,c=['#7c92be','#dc97a8','#77a992'][i];return '<g>'+
 '<circle cx="'+x+'" cy="382" r="3.5" fill="#d5e1dc" stroke="#65877e" stroke-width="1.5"/>'+
 '<path d="M'+x+' 385Q'+(x-11)+' 399 '+(x-8)+' 414Q'+x+' 425 '+(x+8)+' 414L'+(x+6)+' 391" fill="none" stroke="'+c+'" stroke-width="4.2" stroke-linecap="round"/>'+
 '<path d="M'+(x-8)+' 414Q'+x+' 426 '+(x+8)+' 414" fill="none" stroke="#f2faf6" stroke-width="1"/>'+
 '<rect x="'+(x+3)+'" y="392" width="7" height="7" rx="2" fill="#e9efec" stroke="#8daba3"/>'+
 '<ellipse cx="'+x+'" cy="428" rx="10" ry="4.5" fill="none" stroke="'+c+'" stroke-width="3.5"/>'+
 '<rect x="'+(x+7)+'" y="424" width="4" height="7" rx="1" fill="#e6eceb" stroke="#8da5a2"/>'+
 '</g>'}).join('')+
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
 // Aquatic turtle enclosure: basking ramp, glass depth, filter and detailed friendly turtle.
 '<g transform="translate(675 343)">'+
 '<ellipse cx="92" cy="93" rx="97" ry="13" fill="#526a66" opacity=".18"/>'+
 '<path d="M9 9L165 9L173 81L9 87Z" fill="#bdded8" fill-opacity=".48" stroke="#79a7a2" stroke-width="5"/>'+
 '<path d="M13 60Q84 48 167 59L170 78L12 82Z" fill="#a5d7d4" fill-opacity=".7"/>'+
 '<path d="M12 75Q75 62 169 74V85H12Z" fill="#e4d4b1"/>'+
 '<path d="M17 68l29 -23h28l21 22Z" fill="#c9b699" stroke="#9d987e" stroke-width="3"/>'+
 '<path d="M32 53h57M38 47h42" stroke="#b2a58d" stroke-width="2"/>'+
 '<g transform="translate(82 37)"><ellipse cx="0" cy="24" rx="34" ry="21" fill="#79ae8e" stroke="#4f8e72" stroke-width="3"/>'+
 '<path d="M-27 25q3 -20 26 -21q26 1 28 21q-24 17 -54 0" fill="#5e997b" stroke="#447d63" stroke-width="3"/>'+
 '<path d="M-8 7L0 24L-22 30M6 8L1 24L21 31M-22 30L1 40L21 31" stroke="#91c29e" fill="none" stroke-width="2"/>'+
 '<ellipse cx="33" cy="24" rx="18" ry="13" fill="#83b99a" stroke="#4a836b" stroke-width="3"/>'+
 '<circle cx="41" cy="20" r="2.7" fill="#274a40"/><circle cx="42" cy="19" r=".85" fill="#fff"/>'+
 '<ellipse cx="-26" cy="40" rx="11" ry="6" fill="#6ba684"/><ellipse cx="21" cy="42" rx="12" ry="6" fill="#6ba684"/>'+
 '</g>'+
 '<path d="M18 72l-4 -32m0 0q-5 -14 7 -20m144 45l6 -30m0 0q-2 -10 -8 -15" stroke="#67a890" stroke-width="3" fill="none"/>'+
 '<ellipse cx="17" cy="24" rx="9" ry="6" fill="#7dbc91"/><ellipse cx="159" cy="27" rx="10" ry="7" fill="#7dbc91"/>'+
 '<g transform="translate(128 -7)"><path d="M0 3v-21h17v21" fill="none" stroke="#809994" stroke-width="4"/><path d="M-2 5h23l-5 11H3Z" fill="#e4d2a8" stroke="#b69e82" stroke-width="2"/><path d="M8 18l-8 12h17Z" fill="#f8e6aa" opacity=".48"/></g>'+
 '<rect x="19" y="11" width="39" height="9" rx="3" fill="#edf7f0" stroke="#a4bdae"/>'+
 '<text x="38" y="18" font-size="6" text-anchor="middle" font-family="Arial" font-weight="900" fill="#60857b">AQUATIC</text>'+
 '<text x="88" y="106" text-anchor="middle" font-family="Arial" font-size="12" font-weight="900" fill="#4d7774">TURTLE ASSISTANT</text>'+
 '</g>'+
 // Finishing touches: wall chart, supply organizers and floor-level medicine restocking crate.
 '<g transform="translate(402 137)" opacity=".95"><rect x="0" y="0" width="24" height="103" rx="4" fill="#faf7ec" stroke="#aac5b8" stroke-width="2"/><text x="12" y="13" text-anchor="middle" font-family="Arial" font-weight="900" font-size="6" fill="#62847c">RX</text><path d="M4 22h16M4 41h16M4 60h16M4 79h16" stroke="#b9ccbd" stroke-width="2"/><circle cx="8" cy="31" r="3" fill="#edcfbc"/><circle cx="8" cy="50" r="3" fill="#b5cad8"/><circle cx="8" cy="69" r="3" fill="#d4c1da"/><circle cx="8" cy="88" r="3" fill="#aed5b7"/></g>'+
 '<g transform="translate(338 331)"><rect width="66" height="37" rx="4" fill="#cba987" stroke="#a68a77" stroke-width="3"/><path d="M4 8h58M7 21h52" stroke="#e5d2b9" stroke-width="2"/><rect x="10" y="9" width="15" height="11" rx="2" fill="#f8f5ea" stroke="#96afa6"/><rect x="29" y="9" width="12" height="11" rx="2" fill="#ebd5e9" stroke="#b39db7"/><rect x="45" y="9" width="11" height="11" rx="2" fill="#e4efdf" stroke="#9bad99"/><text x="33" y="32" text-anchor="middle" font-family="Arial" font-size="7" font-weight="800" fill="#665a4c">RESTOCK</text></g>'+
 '<g transform="translate(716 80)"><rect width="70" height="33" rx="5" fill="#fdfbf2" stroke="#b6d0c2" stroke-width="2"/><text x="35" y="11" font-family="Arial" font-size="8" font-weight="900" text-anchor="middle" fill="#66867c">SAFETY FIRST</text><path d="M9 19h51M9 25h36" stroke="#acc7b6" stroke-width="2"/><circle cx="56" cy="25" r="4" fill="#e9c8ae"/></g>'+
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
 node.dataset.roomBuild='20261122-v7';
 node.innerHTML='<button type="button" class="vpqPNHot vpqPNDrugs" data-vpqpnaction="pharmacy" aria-label="Open the medication cabinets and drug encyclopedia"></button>'+
 '<button type="button" class="vpqPNStudyLink" data-vpqpn-study="1" aria-label="Go to Student Study Lounge for pharmacology and toxicology lessons, cases and practice">📚 Student Lounge →</button>'+ 
 '<button type="button" class="vpqPNHot vpqPNRounds" data-vpqpnaction="vpqPharmVisualRounds" aria-label="Open clinical pharmacology visual cases and testing"><span>🩺 Clinical Rounds</span></button>'+ 
 '<button type="button" class="vpqPNHot vpqPNFood" data-vpqpnaction="vpqNutritionGuide" aria-label="Open the pet nutrition corner and reference cards"></button>'+
 '<button type="button" class="vpqPNHot vpqPNTox" data-vpqpnaction="vpqToxPreview" aria-label="Open the toxicology caution book reference preview"><span>☣️ Caution Book</span></button>'+
 '<button type="button" class="vpqPNHot vpqPNLab" data-vpqpnaction="vpqMechEnter" aria-label="Enter the mechanism lab"><span>🔬 Lab</span></button>'+
 '<button type="button" class="vpqPNHelp vpqPNHelpDrugs" data-vpqpnhelp="drugs" aria-label="What are the Drug Shelves for?" title="About Drug Shelves">?</button>'+
 '<button type="button" class="vpqPNHelp vpqPNHelpRounds" data-vpqpnhelp="rounds" aria-label="What are Clinical Rounds for?" title="About Clinical Rounds">?</button>'+
 '<button type="button" class="vpqPNHelp vpqPNHelpFood" data-vpqpnhelp="food" aria-label="What is Pet Nutrition for?" title="About Pet Nutrition">?</button>'+
 '<button type="button" class="vpqPNHelp vpqPNHelpTox" data-vpqpnhelp="tox" aria-label="What is the Caution Book for?" title="About the Caution Book">?</button>'+
 '<span class="vpqPNVersion" aria-label="Pharmacy room version">Pharmacy room v7</span>'+ 
 '<button type="button" class="vpqPNHelp vpqPNHelpLab" data-vpqpnhelp="lab" aria-label="What is the Mechanism Lab for?" title="About the Mechanism Lab">?</button>';
 node.addEventListener('click',e=>{const help=e.target.closest('[data-vpqpnhelp]');if(help){e.preventDefault();e.stopPropagation();pharmacyHelp(help.dataset.vpqpnhelp);return}const go=e.target.closest('[data-vpqpn-study]');if(go){changeRoom('study');return}const b=e.target.closest('[data-vpqpnaction]');if(b)doAction(b.dataset.vpqpnaction)});
 stage.appendChild(node);
}
const style=document.createElement('style');
style.textContent='.vpqPharmNutritionArt{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}'+
'.stage[data-room="pharmacy"] .prop,.stage[data-room="pharmacy"] .roomdecor{display:none!important}'+
'#vpqPNHotspots{position:absolute;inset:0;z-index:5;pointer-events:none}'+
'.vpqPNHot{position:absolute;pointer-events:auto;border:1px solid transparent;border-radius:12px;box-shadow:none;transform:none!important;background:transparent}'+
'.vpqPNHot:hover{border-color:#78aeb6;background:#e1f5ef16;outline:none}.vpqPNHot:focus-visible{border-color:#5f99a8;background:#e1f5ef16;outline:2px solid #568ea4;outline-offset:2px}'+
'.vpqPNHot span{position:absolute;bottom:3%;left:50%;transform:translate(-50%,0);white-space:nowrap;border:2px solid #7ea9a6;background:#fffdf5;color:#375f68;font-size:11px;font-weight:900;padding:5px 8px;border-radius:13px;box-shadow:0 3px 0 #567f8030}'+
'.vpqPNRounds{left:10%;top:68%;width:30%;height:20%;border:1px solid transparent;background:transparent}.vpqPNRounds span{bottom:6%;background:#fff5eb;border-color:#e4b6a8;color:#895568}'+
 '.vpqPNDrugs{left:9%;top:18%;width:30%;height:49%}.vpqPNFood{left:45%;top:14%;width:25%;height:49%}.vpqPNFood span{bottom:0%;font-size:10px;padding:3px 7px}.vpqPNTox{left:75%;top:22%;width:15%;height:39%}.vpqPNLab{left:92%;top:28%;width:7%;height:38%}.vpqPNLab span{left:auto;right:0;transform:none}'+
'.vpqPNStudyLink{position:absolute;z-index:6;left:4%;top:89%;width:17%;pointer-events:auto;border:1.5px solid #a6a7c8;border-radius:10px;background:#fffdf6e8;color:#534c85;padding:5px 6px;font-size:10px;font-weight:850;box-shadow:0 2px 5px #3543661c;cursor:pointer}.vpqPNStudyLink:hover,.vpqPNStudyLink:focus-visible{background:#fff2c7;outline:2px solid #f5c66f}'+
'.vpqPNFood span{display:none!important}'+
'.vpqPNVersion{position:absolute;right:2%;bottom:2%;pointer-events:none;font-size:9px;font-weight:900;color:#416b65;background:#f2fff4dd;border:1px solid #9ebbb2;border-radius:6px;padding:2px 5px;z-index:8}'+
'/* Small floating question marks explain each interactable section without blocking entry. */'+
'.vpqPNHelp{position:absolute;pointer-events:auto;z-index:9;width:24px;height:24px;padding:0;display:grid;place-items:center;border:2px solid #79a7ac;border-radius:50%;background:#fcfffa;color:#276775;font-size:15px;font-weight:1000;box-shadow:0 2px 5px #254a4a30;transform:none!important;line-height:1;cursor:help}'+
'.vpqPNHelp:hover,.vpqPNHelp:focus-visible{background:#d6f3ed;outline:2px solid #447f86;outline-offset:2px}'+
'.vpqPNHelpDrugs{left:37%;top:19%}.vpqPNHelpRounds{left:37%;top:76%}.vpqPNHelpFood{left:68%;top:17%}.vpqPNHelpTox{left:88%;top:28%}.vpqPNHelpLab{left:96%;top:30%}'+
'.vpqPNFoodCards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:9px;margin:12px 0}.vpqPNFoodCards button{display:block;text-align:left;background:#f6fcf7;border:2px solid #b9d7c8;border-radius:13px;padding:13px}.vpqPNFoodCards b,.vpqPNFoodCards small{display:block}.vpqPNFoodCards small{color:#617e75;font-size:12px;margin-top:6px}'+
'@media(max-width:620px){.vpqPNHot span{font-size:9px;padding:3px 4px}.vpqPNLab span{right:0}.vpqPNTox span{bottom:12%}}';
document.head.appendChild(style);
const obs=new MutationObserver(()=>{const needed=stage.dataset.room==='pharmacy',present=!!stage.querySelector('#vpqPNHotspots');if(needed!==present)refresh()});
obs.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});
refresh();
return {refresh,drawing,nutritionMenu};
};