/* Phase A.4 — Mechanism Lab: dedicated study room and mechanism-first stations. */
window.VPQ_MECHANISM_LAB_A4=function(api){
'use strict';
const {rooms,showModal,changeRoom,doAction}=api;
const art=window.VPQ_SCENERY,stage=document.getElementById('stage');
if(!art||!stage)return null;
const previousArt=art.roomArt.bind(art);
const concepts=[
 {id:'receptor',title:'Receptor agonists vs antagonists',concept:'An agonist activates a receptor to produce a response. A competitive antagonist occupies the receptor without activating it, reducing agonist access. An irreversible or noncompetitive antagonist may reduce the maximum achievable response.',why:'Cells use receptors to convert extracellular signals into controlled physiological responses. Therapeutic activation or blockade changes those signals; the same effect can cause unwanted responses in other tissues.',example:'A beta-1 antagonist can reduce cardiac rate and contractility; watch perfusion, blood pressure, and the patient context.'},
 {id:'beta',title:'Beta-lactams and cell-wall synthesis',concept:'Penicillins and cephalosporins bind penicillin-binding proteins involved in peptidoglycan cross-linking. Susceptible growing bacteria develop weakened cell walls.',why:'Bacteria need structural peptidoglycan to resist osmotic stress. Mammalian cells lack peptidoglycan, providing selective toxicity.',example:'For beta-lactams, unbound time above MIC (fT > MIC) is often a key PK/PD metric. Resistance can involve beta-lactamases, altered targets, or reduced drug access.'},
 {id:'amino',title:'Aminoglycosides and the 30S ribosome',concept:'Aminoglycosides bind the bacterial 30S subunit, disrupting translation and causing misreading of mRNA. Bacterial uptake requires oxygen-dependent energy processes.',why:'Protein synthesis is essential to bacterial survival; oxygen-dependent entry helps explain poor activity against obligate anaerobes.',example:'Peak-to-MIC exposure can be relevant to killing, while renal tubular accumulation and ototoxicity constrain safe use.'},
 {id:'nsaid',title:'COX inhibition and prostaglandins',concept:'NSAIDs inhibit cyclooxygenase pathways, lowering production of prostanoids that contribute to pain, inflammation and fever.',why:'Prostaglandins also help protect the gastrointestinal mucosa and support renal blood flow in vulnerable perfusion states; blocking them can remove useful compensation.',example:'Dehydration, hypovolemia and concurrent medications can increase the risk of NSAID-related injury.'}
];
function lesson(id){
 const x=concepts.find(t=>t.id===id);if(!x)return menu();
 showModal('🔬 '+x.title,'<div class="infobox"><b>Mechanism</b><p>'+x.concept+'</p></div><div class="infobox"><b>WHY the body or organism responds this way</b><p>'+x.why+'</p></div><div class="infobox"><b>Clinical application and caution</b><p>'+x.example+'</p></div><div class="buttonrow"><button type="button" data-vpqmechmenu="1">← All mechanism lessons</button><button type="button" data-vpqmechpractice="1">Practice in Learning Games</button></div><p class="tiny">Educational review; specific drug, species, dose, infection, and contraindications require individual assessment.</p>');
}
function menu(){
 showModal('🔬 Mechanism Lab · Understand the WHY','<p>This room teaches how drugs affect cells and organs, why intended effects happen, and how those same pathways lead to adverse effects. Pharmacy remains the drug-card reference.</p><div class="vpqMechLessonGrid">'+concepts.map(x=>'<button type="button" data-vpqmechlesson="'+x.id+'"><b>'+x.title+'</b><small>'+x.why+'</small></button>').join('')+'</div><div class="buttonrow"><button type="button" data-vpqmechpractice="1">🎮 Apply in Learning Games</button><button type="button" data-vpqmechpharmacy="1">💊 Pharmacy Reference</button></div>');
}
function drawing(){
 return '<svg class="vpqMechanismArt" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dimensional mechanism teaching lab with receptor board, antibiotic pathway diagrams and workbench">'+
 '<defs><linearGradient id="vpqMechFloor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d0e4e6"/><stop offset="1" stop-color="#99bbbd"/></linearGradient></defs>'+
 '<rect width="1000" height="500" fill="#aacccf"/><polygon points="0,0 1000,0 932,54 68,54" fill="#f8fff5"/><polygon points="0,0 68,54 68,318 0,390" fill="#87b4bc"/><polygon points="932,54 1000,0 1000,390 932,318" fill="#87b4bc"/><rect x="68" y="54" width="864" height="264" fill="#eaf6f5"/><path d="M68 318H932L1000 500H0Z" fill="url(#vpqMechFloor)"/><path d="M68 318L0 500M932 318L1000 500M260 318L214 500M500 318V500M739 318L789 500M36 420H963M55 363H946" fill="none" stroke="#f8ffff" stroke-width="3" opacity=".65"/>'+
 '<g transform="translate(84 88)"><rect width="337" height="228" rx="13" fill="#fdfdf7" stroke="#7eacae" stroke-width="10"/><text x="168" y="33" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="21" fill="#38687b">RECEPTOR SIGNALING</text>'+
 '<path d="M30 140H310" stroke="#a9d5d0" stroke-width="13"/><path d="M166 140v-48" stroke="#5678ae" stroke-width="12" stroke-linecap="round"/><path d="M135 83q31 -27 62 0" fill="none" stroke="#5678ae" stroke-width="11" stroke-linecap="round"/><circle cx="89" cy="75" r="20" fill="#eba8ab"/><circle cx="244" cy="75" r="19" fill="#f3c675"/><path d="M89 95L124 114M244 95L213 115" stroke="#778ba6" stroke-width="5" stroke-dasharray="8 5"/><path d="M166 149V191" stroke="#74b5ab" stroke-width="8"/><path d="M150 178l16 18l16 -18" fill="none" stroke="#74b5ab" stroke-width="6"/><text x="166" y="216" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" fill="#517b86">CELLULAR RESPONSE</text></g>'+
 '<g transform="translate(582 84)"><rect width="322" height="228" rx="12" fill="#fffdf6" stroke="#7eacae" stroke-width="9"/><text x="161" y="32" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="21" fill="#38687b">ANTIBIOTIC TARGETS</text><ellipse cx="97" cy="108" rx="55" ry="44" fill="#c8e4d0" stroke="#68ac96" stroke-width="8"/><ellipse cx="97" cy="108" rx="32" ry="24" fill="#e9f7e6"/><path d="M65 105l23 15l30 -36" fill="none" stroke="#82a6b6" stroke-width="7"/><text x="94" y="170" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="800" fill="#42677a">Cell wall</text><ellipse cx="236" cy="104" rx="48" ry="25" fill="#ac9ad2"/><ellipse cx="237" cy="115" rx="38" ry="20" fill="#e4c0ed"/><path d="M198 109h75" stroke="#8e6aaf" stroke-width="6"/><text x="240" y="170" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="800" fill="#42677a">Ribosome</text><path d="M130 200h66" stroke="#8bb1aa" stroke-width="5"/><path d="M184 191l13 9l-13 9" fill="none" stroke="#8bb1aa" stroke-width="5"/><text x="162" y="222" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#64818c">Drug → target → effect</text></g>'+
 '<g transform="translate(243 328)"><path d="M0 15l68 -30h422l79 31l-69 26H68Z" fill="#ecf6f4" stroke="#78aab1" stroke-width="7"/><path d="M68 42h432v65H68Z" fill="#78abb7" stroke="#5f929d" stroke-width="6"/><path d="M0 15l68 27v65L0 73Z" fill="#6196a5"/><path d="M500 42l69 -26v61l-69 30Z" fill="#6196a5"/><path d="M99 104v63M470 104v63" stroke="#62818a" stroke-width="15"/>'+
 '<path d="M134 -5l28 -28h139l28 28Z" fill="#5d8796"/><rect x="172" y="-85" width="139" height="64" rx="6" fill="#506e80"/><rect x="181" y="-77" width="121" height="49" fill="#b9e5eb"/><text x="242" y="-56" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="900" fill="#52788a">WHY LAB</text><text x="242" y="-40" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#52788a">PATHWAY VIEWER</text>'+
 '<path d="M368 -13h22l-7 -55h-8Z" fill="#c0e6ee" stroke="#699eae" stroke-width="5"/><path d="M361 -70h38" stroke="#76aeba" stroke-width="5"/><circle cx="380" cy="-31" r="8" fill="#82c5c6"/><path d="M416 5h26l-7 -36h-12Z" fill="#e6d2ef" stroke="#9a94b6" stroke-width="4"/><path d="M410 -32h37" stroke="#9a94b6" stroke-width="5"/></g>'+
 '<text x="492" y="32" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="22" fill="#4c7c85">MECHANISM &amp; PHYSIOLOGY LAB</text></svg>';
}
art.roomArt=function(k){return k==='mechanism'?drawing():previousArt(k)};
rooms.mechanism={name:'Mechanism & Physiology Lab',color:'#e6f5f4',banner:'MECHANISM LAB',decor:[],props:[
 {x:23,emoji:'🧬',label:'Receptor Board',action:'vpqMechReceptor',bubble:'Targets & signals'},
 {x:52,emoji:'🔬',label:'Mechanism Lessons',action:'vpqMechMenu',bubble:'WHY it works'},
 {x:81,emoji:'🦠',label:'Antibiotic Targets',action:'vpqMechAntibiotics',bubble:'Bacteria & drugs'}
]};
rooms.pharmacy.props[1]={x:52,emoji:'🔬',label:'Mechanism Lab Door',action:'vpqMechEnter',bubble:'Enter lab'};
const route=(action)=>{
 if(action==='vpqMechEnter')return changeRoom('mechanism');
 if(action==='vpqMechMenu')return menu();
 if(action==='vpqMechReceptor')return lesson('receptor');
 if(action==='vpqMechAntibiotics')return lesson('beta');
 return doAction(action);
};
document.getElementById('modalBody').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.vpqmechlesson)return lesson(b.dataset.vpqmechlesson);
 if(b.dataset.vpqmechmenu!==undefined)return menu();
 if(b.dataset.vpqmechpractice!==undefined)return doAction('learningHub');
 if(b.dataset.vpqmechpharmacy!==undefined)return changeRoom('pharmacy');
});
function refresh(){
 stage.querySelector('#vpqMechanismHotspots')?.remove();
 if(stage.dataset.room!=='mechanism')return;
 const n=document.createElement('div');n.id='vpqMechanismHotspots';
 n.innerHTML='<button class="vpqMechHot vpqMechReceptor" data-vpqmechgo="vpqMechReceptor" aria-label="Receptor and signaling lesson"><span>🧬 Receptors</span></button><button class="vpqMechHot vpqMechPath" data-vpqmechgo="vpqMechMenu" aria-label="Browse mechanism and physiology lessons"><span>🔬 Why Lab</span></button><button class="vpqMechHot vpqMechBacteria" data-vpqmechgo="vpqMechAntibiotics" aria-label="Antibiotic targets lesson"><span>🦠 Antibiotics</span></button><button class="vpqMechExit" data-vpqmechgo="vpqMechBack">← Pharmacy</button>';
 n.addEventListener('click',e=>{let b=e.target.closest('[data-vpqmechgo]');if(!b)return;if(b.dataset.vpqmechgo==='vpqMechBack')return changeRoom('pharmacy');return route(b.dataset.vpqmechgo)});
 stage.appendChild(n);
}
const style=document.createElement('style');
style.textContent='.vpqMechanismArt{display:block;position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.stage[data-room="mechanism"] .prop,.stage[data-room="mechanism"] .roomdecor{display:none!important}#vpqMechanismHotspots{position:absolute;inset:0;z-index:5;pointer-events:none}.vpqMechHot,.vpqMechExit{position:absolute;pointer-events:auto;border:2px solid #758ba666;border-radius:13px;background:#ffffff12;box-shadow:none;transform:none!important}.vpqMechHot:hover,.vpqMechHot:focus-visible,.vpqMechExit:hover,.vpqMechExit:focus-visible{background:#fff0a540;border:3px solid #ecc76d;outline:2px solid white}.vpqMechHot span{position:absolute;bottom:7%;left:50%;transform:translateX(-50%);white-space:nowrap;border:2px solid #7798a7;border-radius:12px;padding:5px 8px;background:#fffef5;color:#315972;font-weight:900;font-size:12px}.vpqMechReceptor{left:9%;top:17%;width:32%;height:45%}.vpqMechBacteria{left:58%;top:17%;width:32%;height:45%}.vpqMechPath{left:39%;top:63%;width:27%;height:24%}.vpqMechExit{top:9%;right:2%;padding:6px 10px;background:#ffffffed;font-size:12px;color:#315972}.vpqMechLessonGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:9px;margin:15px 0}.vpqMechLessonGrid button{padding:13px;text-align:left;background:#f6fcff}.vpqMechLessonGrid b,.vpqMechLessonGrid small{display:block}.vpqMechLessonGrid small{margin-top:7px;line-height:1.4;font-size:12px;font-weight:400}@media(max-width:560px){.vpqMechHot span{font-size:10px;padding:3px 5px}.vpqMechExit{font-size:10px}}';
document.head.appendChild(style);
const observer=new MutationObserver(()=>{if((stage.dataset.room==='mechanism')!==!!stage.querySelector('#vpqMechanismHotspots'))refresh()});
observer.observe(stage,{childList:true,attributes:true,attributeFilter:['data-room']});refresh();
return {route,menu,lesson,refresh};
};