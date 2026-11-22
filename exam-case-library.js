/* Vet Pharm Quest — Exam Room Patient Case Library.
 * One browser for the canonical case records already returned by dataCases().
 * This module never clones cases, invents patients, or changes save/reward schema.
 */
window.VPQ_PATIENT_CASE_LIBRARY=(function(){
'use strict';
let api, page=0, venue='pharm', filters={specialty:'All specialties',course:'All courses',species:'All species',status:'All patients',level:'All levels',lectureScope:'Selected Pharmacology lectures',query:''};
const specialtyNames=['All specialties','Parasitology','Infectious Disease & Isolation','Endocrinology','Gastrointestinal','Oncology','Toxicology','Cardiology','Orthopedics','Clinical Pathology','Surgery & Anesthesia','Pharmacology','Other Cases'];
const courseNames=['All courses','Pharmacology','One Health','Clinical Pathology','Parasitology','Surgery','Necropsy','Other'];
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function allCases(){
 const arr=api.getCases();const seen=new Set();
 return (Array.isArray(arr)?arr:[]).filter(c=>{if(!c||typeof c.id!=='string'||!c.id||!Array.isArray(c.steps)||!c.steps.length||seen.has(c.id))return false;seen.add(c.id);return true})
}
function specialties(c){
 const t=[c.name,c.intro,c.clues,c.protocol,c.track,...(c.steps||[]).map(s=>s.tag||'')].join(' ').toLowerCase(),set=new Set(),track=String(c.track||'').toLowerCase();
 if(track==='parasitology'||/parasite|parasitic|helminth|nematod|cestod|trematod|protozo|coccidi|giardia|fecal flotation|heartworm|tick|flea|cryptosporid|toxoplas|babesi|anaplasm|leishman/.test(t))set.add('Parasitology');
 if(track==='one health'||/infect|bacteri|viral|virus|zoono|isolation|quarantine|leptospir|salmonell|brucell|rabies|influenza|fungal|mycosis|ringworm|transmiss|sepsis|pathogen/.test(t))set.add('Infectious Disease & Isolation');
 if(/endocrin|thyroid|adrenal|cushing|addison|diabet|insulin|glucose|hypercalcem|hypocalcem|parathyroid|cortisol|acth/.test(t))set.add('Endocrinology');
 if(/gastro|intestinal|diarrh|vomit|enteritis|gastric|pancrea|hepat|liver|biliary|cholangi|colitis|ileus|obstruct|melena|malabsorp|abdomen/.test(t))set.add('Gastrointestinal');
 if(/oncolog|tumor|tumour|neoplas|carcinoma|sarcoma|lymphoma|leukemia|cancer|mass lesion|metast/.test(t))set.add('Oncology');
 if(/toxic|poison|ingestion|overdose|antifreeze|ethylene glycol|rodenticid|organophosph|metaldehyde|acetaminophen|chocolate|grape|raisins|lily tox|xylitol/.test(t))set.add('Toxicology');
 if(/cardio|cardiac|heart fail|murmur|arrhythm|congestive|valvular|pericard|cardiomyop/.test(t))set.add('Cardiology');
 if(/orthoped|orthopaed|fracture|lameness|limb injury|joint disease|cranial cruciate|osteochond|patell|bone lesion|limping/.test(t))set.add('Orthopedics');
 if(track==='clinical pathology'||/clin.?path|hematolog|blood smear|coagulat|cbc|erythro|thrombocyt|leukog|urinalysis|blood gas|chemistry panel|azotem|electrolyte/.test(t))set.add('Clinical Pathology');
 if(track==='surgery'||/surg|anesthes|anaesthes|operative|incision|sterile|necropsy/.test(t))set.add('Surgery & Anesthesia');
 if(track==='pharmacology'||/drug|antibiot|antimicrob|pharmacolog|medicat|analges|nsaid|macrolid|cephalosporin|dose/.test(t))set.add('Pharmacology');
 if(set.size===0)set.add('Other Cases');
 return [...set];
}
function course(c){return courseNames.includes(c.track)?c.track:'Other'}
function species(c){return String(c.species||'Unspecified').trim()||'Unspecified'}
function filterItems(items){
 const q=filters.query.trim().toLowerCase(),completed=api.getCompleted(),selected=api.getSelectedLectures?.()||[];
 return items.filter(c=>(filters.specialty==='All specialties'||specialties(c).includes(filters.specialty))&&
 (filters.course==='All courses'||course(c)===filters.course)&&
 (filters.species==='All species'||species(c)===filters.species)&&
 (filters.status==='All patients'||(filters.status==='Completed'?completed.includes(c.id):!completed.includes(c.id)))&&
 (filters.level==='All levels'||(filters.level==='Advanced referral'?!!c.advanced:!c.advanced))&&
 (course(c)!=='Pharmacology'||(selected.length===0&&!filters.lectureFocus)||(!c.lecture&&!Array.isArray(c.lectureTags))||(Array.isArray(c.lectureTags)&&c.lectureTags.length?c.lectureTags.some(l=>selected.includes(l)):selected.includes(c.lecture)))&&
 (!filters.lectureFocus||course(c)!=='Pharmacology'||c.lecture===filters.lectureFocus||(Array.isArray(c.lectureTags)&&c.lectureTags.includes(filters.lectureFocus)))&&
 (!q||[c.name,c.intro,c.clues,c.protocol,c.track,c.lecture,c.species,...specialties(c)].join(' ').toLowerCase().includes(q)));
}
function opts(values,current){return values.map(v=>'<option value="'+e(v)+'" '+(current===v?'selected':'')+'>'+e(v)+'</option>').join('')}
function home(nextVenue='pharm'){venue=['pharm','reception','exam','treatment'].includes(nextVenue)?nextVenue:'pharm';filters.course=venue==='pharm'?'Pharmacology':'All courses';filters.specialty='All specialties';filters.species='All species';filters.status='All patients';filters.level='All levels';filters.lectureFocus='';filters.query='';filters.lectureScope='Selected Pharmacology lectures';page=0;draw()}
function draw(){
 const all=allCases().filter(c=>venue==='pharm'?course(c)==='Pharmacology':venue==='treatment'?(!!c.journeyRooms||c.steps.length>1||c.advanced||c.location==='treatment'):venue==='exam'?true:(!!c.journeyRooms||c.steps.length<=2&&!c.advanced)).sort((a,b)=>Number(!!b.journeyRooms)-Number(!!a.journeyRooms)),result=filterItems(all),sp=['All species',...new Set(all.map(species))].sort((a,b)=>a==='All species'?-1:b==='All species'?1:a.localeCompare(b));
 const completed=api.getCompleted(),count=all.filter(c=>completed.includes(c.id)).length;
 const pageCount=Math.max(1,Math.ceil(result.length/24));page=Math.min(Math.max(0,page),pageCount-1);
 const cards=result.slice(page*24,page*24+24).map(c=>{
 const categories=specialties(c);const finished=completed.includes(c.id);
 return '<button type="button" class="quest" data-case="'+e(c.id)+'" style="text-align:left;min-height:155px"><div style="font-size:28px">'+e(c.emoji||'🐾')+'</div><b>'+e(c.name||'Patient case')+'</b><p class="small">'+e(species(c))+' · '+e(course(c))+(c.lecture?' · '+e(c.lecture):'')+'</p><p>'+e(String(c.intro||'Review this patient case.').slice(0,145))+'</p><p class="small">'+e(categories.slice(0,3).join(' · '))+'</p><span class="badge">'+(finished?'✓ Completed':'Start patient')+'</span></button>'
 }).join('');
 api.showModal(venue==='pharm'?'💊 Pharmacology · Patient Case Library':venue==='reception'?'🏠 Reception · Patient Check-In':venue==='treatment'?'❤️ Treatment Ward · Clinical Rounds':'🩺 Exam Room · Patient Cases', '<p>'+(venue==='pharm'?'Medication-focused patient questions and pharmacology clinical decisions.':'Shared hospital patient records; Reception checks in patients, Exam evaluates them, and Treatment follows longer inpatient rounds.')+' Completion and rewards stay linked across rooms.</p>'+
 (venue==='pharm'?'<div class="infobox"><b>💊 Pharmacology only</b><p>Use the medication patient cases and extended pharmacology rounds here. Other clinical patients live in Reception, Exam and Treatment.</p><button type="button" data-vpqcaselib="reception">🏠 Go to Reception patients →</button></div>':'<div class="buttonrow"><button data-vpqcaselib="reception">🏠 Reception</button><button data-vpqcaselib="exam">🩺 Exam</button><button data-vpqcaselib="treatment">❤️ Treatment</button><button data-vpqcaselib="pharm">💊 Pharm cases</button></div>')+
 (venue==='pharm'?'<p class="small" style="margin:9px 0 6px"><b>📚 Current lecture:</b> '+e(filters.lectureFocus||((api.getSelectedLectures?.()||[]).join(', ')||'No lecture selected — displaying all Pharmacology cases'))+'</p><p class="small">'+result.length+' matching medication patient cases · '+result.filter(c=>completed.includes(c.id)).length+' completed. Change lectures in the Pharmacology Learning Center.</p>':'<div class="infobox"><b>'+all.length+' available case records · '+count+' completed</b><p>Choose a patient or narrow the list by specialty, species, or course.</p></div>')+
 (venue==='pharm'?'':('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:10px;margin:12px 0">'+
 '<label>Specialty<select class="input" data-vpqcasefilter="specialty">'+opts(specialtyNames,filters.specialty)+'</select></label>'+
 (venue==='pharm'?'':'<label>Course<select class="input" data-vpqcasefilter="course">'+opts(courseNames,filters.course)+'</select></label>')+
 '<label>Species<select class="input" data-vpqcasefilter="species">'+opts(sp,filters.species)+'</select></label>'+
 '<label>Progress<select class="input" data-vpqcasefilter="status">'+opts(['All patients','Not completed','Completed'],filters.status)+'</select></label>'+ 
 '<label>Complexity<select class="input" data-vpqcasefilter="level">'+opts(['All levels','Standard case','Advanced referral'],filters.level)+'</select></label>'+ 
 (venue==='pharm'?'<label>Pharmacology lecture scope<select class="input" data-vpqcasefilter="lectureScope">'+opts(['Selected Pharmacology lectures','All Pharmacology lectures'],filters.lectureScope)+'</select></label>':'')+'</div>'+
 '<label>Search names, signs, and topics<input id="vpqCaseLibQuery" class="input" type="search" placeholder="e.g. Addison, Giardia, neoplasia..." value="'+e(filters.query)+'"></label>'+
 '<div class="buttonrow"><button data-vpqcaselib="search">🔎 Search</button><button data-vpqcaselib="reset">Reset filters</button><button data-vpqcaselib="surprise" '+(!result.length?'disabled':'')+'>🎲 Surprise patient from '+result.length+' matches</button><button data-vpqcaselib="map">🗺️ Hospital map</button></div>'+
 (filters.lectureFocus?'<p class="small">Focused on '+e(filters.lectureFocus)+' · <button data-vpqcaselib="alllectures">Show all Pharmacology lectures</button></p>':'')))+
 '<h3>'+(venue==='pharm'?'Lecture patient cases':'Hospital patient records')+' ('+result.length+')</h3>'+
 (cards?'<div class="twocol">'+cards+'</div>':'<div class="infobox"><b>No matching case is currently available.</b><p>Try another specialty or reset filters. This does not mean the course topic is unimportant; it means no matching patient record has been entered yet.</p></div>')+
 '<div class="buttonrow"><button data-vpqcaselib="previous" '+(page===0?'disabled':'')+'>← Previous</button><span class="small">Page '+(page+1)+' of '+pageCount+'</span><button data-vpqcaselib="next" '+(page>=pageCount-1?'disabled':'')+'>Next →</button></div>'+ 
 (venue==='pharm'?'<p class="tiny">These are lecture-linked pharmacology practice cases. For connected clinical journeys, use Go to Reception patients.</p>':'<p class="tiny">All rooms reuse the same patient IDs; connected cases progress from Reception to Exam to Treatment.</p>'));
}
function init(ctx){api=ctx;ctx.body.addEventListener('change',ev=>{const t=ev.target.closest('[data-vpqcasefilter]');if(!t)return;filters[t.dataset.vpqcasefilter]=t.value;page=0;const input=ctx.body.querySelector('#vpqCaseLibQuery');if(input)filters.query=input.value;draw()});
 ctx.body.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&ev.target.id==='vpqCaseLibQuery'){ev.preventDefault();filters.query=ev.target.value;page=0;draw()}});
 ctx.body.addEventListener('click',ev=>{const b=ev.target.closest('[data-vpqcaselib]');if(!b)return;
 const action=b.dataset.vpqcaselib,field=ctx.body.querySelector('#vpqCaseLibQuery');
 if(field)filters.query=field.value;
 if(['pharm','reception','exam','treatment'].includes(action)){if(action!=='pharm')api.changeRoom?.(action);return home(action)}
 if(action==='pharmexam2')return window.VPQ_PHARM_ROOM_CASES_HUB?.();
 if(action==='search'){page=0;return draw()}
 if(action==='alllectures'){filters.lectureFocus='';page=0;return draw()}
 if(action==='previous'){page=Math.max(0,page-1);return draw()}
 if(action==='next'){page++;return draw()}
 if(action==='reset'){filters={specialty:'All specialties',course:'All courses',species:'All species',status:'All patients',level:'All levels',lectureScope:'Selected Pharmacology lectures',lectureFocus:'',query:''};page=0;return home(venue)}
 if(action==='surprise'){const pool=filterItems(allCases().filter(c=>venue==='pharm'?course(c)==='Pharmacology':venue==='treatment'?(!!c.journeyRooms||c.steps.length>1||c.advanced||c.location==='treatment'):venue==='exam'?true:(!!c.journeyRooms||c.steps.length<=2&&!c.advanced)));if(pool.length)return ctx.openCase(pool[Math.floor(Math.random()*pool.length)].id)}
 if(action==='map'){ctx.openMap?.()}
 }) }
function focus(courseName,lecture){
 venue=courseName==='Pharmacology'?'pharm':'exam';
 filters.course=courseNames.includes(courseName)?courseName:'All courses';
 filters.specialty='All specialties';filters.species='All species';
 filters.status='All patients';filters.level='All levels';
 filters.lectureScope='Selected Pharmacology lectures';
 filters.query='';
 page=0;
 // Filter to a selected lecture, including cases shared across multiple lectures.
 if(lecture&&filters.course==='Pharmacology')filters.lectureFocus=lecture;
 else filters.lectureFocus='';
 draw();
}
return Object.freeze({init,home,focus,allCases,specialties,filterItems});
})();
