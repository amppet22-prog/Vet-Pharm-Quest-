/* Surgical instrument ID — introductory, educational; keeps course-specific technique for later. */
(function(){
'use strict';
const tools=[
 {name:'Scalpel handle and blade',role:'Controlled surgical incisions',avoid:'A blade is not used for blunt dissection or grasping tissue.',hint:'Cutting'},
 {name:'Mayo scissors',role:'Cutting relatively tough tissue or suture, depending on the instrument and purpose',avoid:'Do not use delicate tissue scissors for suture or thick material.',hint:'Cutting'},
 {name:'Metzenbaum scissors',role:'Dissecting and cutting delicate soft tissues',avoid:'Avoid using these fine scissors for cutting suture.',hint:'Dissection'},
 {name:'Adson-Brown tissue forceps',role:'Atraumatic handling of delicate tissues',avoid:'Select an appropriate forceps to avoid crushing fragile tissue.',hint:'Grasping'},
 {name:'Halsted mosquito hemostats',role:'Clamping small vessels or holding delicate material temporarily',avoid:'Not a substitute for reliable ligation and confirmed hemostasis.',hint:'Hemostasis'},
 {name:'Carmalt forceps',role:'Occlusion/clamping of pedicles or tissue bundles during appropriate procedures',avoid:'Never clamp an unidentified structure blindly.',hint:'Pedicle control'},
 {name:'Mayo-Hegar needle holder',role:'Securely holding a surgical needle during suturing',avoid:'Not intended for routine tissue grasping.',hint:'Suturing'},
 {name:'Backhaus towel clamp',role:'Securing surgical drapes and towels',avoid:'Do not place on tissue unless specifically appropriate to the intended use.',hint:'Draping'},
 {name:'Suction tip and tubing',role:'Removing fluid to maintain visualization of the field',avoid:'Avoid traumatic suction contact with tissue.',hint:'Visibility'}
];
let ix=0,score=0,answered=false,firstWrong=false,mode='use';
const features=[
 'A reusable handle with an attached replaceable cutting blade',
 'Sturdy ring-handled scissors with comparatively broad blades',
 'Fine, delicate ring-handled dissection scissors with long shanks',
 'Fine thumb forceps with a broad, atraumatic grasping tip',
 'Small ring-handled locking hemostats for delicate vessel control',
 'Long, stout locking clamps with characteristic longitudinal jaw serrations',
 'Ring-handled driver with short gripping jaws made to control a suture needle',
 'Pointed ratcheted towel clamp commonly used to secure drapes',
 'A hollow tip connected to suction tubing to remove fluid'
];
const handling=[
 'Hold by the handle; maintain blade awareness and use controlled movements.',
 'Use the appropriate portion of the blades, with deliberate cutting under visualization.',
 'Use gentle, fine dissection rather than forcing or crushing tissue.',
 'Use minimum force needed for stable tissue handling.',
 'Engage the ratchet deliberately; reassess tissue before further clamping.',
 'Identify all structures and control tension before placement; never clamp blindly.',
 'Grip the needle securely in the proper portion of the jaws and control its point.',
 'Secure drapes carefully without unintended penetration of patient tissue.',
 'Maintain controlled suction and minimize direct trauma to delicate tissue.'
];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const style=document.createElement('style');style.textContent=
'#vpqSurgToolWrap{position:fixed;inset:0;z-index:100001;background:#1d3659b8;display:flex;align-items:center;justify-content:center;padding:12px}'+
'#vpqSurgToolWrap .panel{width:min(750px,100%);max-height:92vh;overflow-y:auto;border-radius:19px;background:#fffdfc;border:3px solid #b6d8d6;padding:20px;box-shadow:0 19px 48px #243c5a77;color:#35516c;font-family:ui-rounded,"Trebuchet MS",Arial,sans-serif}'+
'#vpqSurgToolWrap button{padding:10px 12px;border:2px solid #bfd2df;background:#f9fcff;color:#35516c;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer}'+
'#vpqSurgToolWrap button:hover:not(:disabled),#vpqSurgToolWrap button:focus-visible{background:#e8f5f3;border-color:#72b6af}'+
'#vpqSurgToolWrap .choice{display:block;width:100%;text-align:left;margin:8px 0}'+
'#vpqSurgToolWrap .feedback{margin:12px 0;padding:11px;border:1px solid #b8d8d2;border-radius:10px;background:#eaf8f4;line-height:1.5}'+
'#vpqSurgToolWrap .toolgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:9px;margin:14px 0}'+
'#vpqSurgToolWrap .toolgrid button{text-align:left;min-height:70px}'+
'#vpqSurgToolWrap .toolcard{padding:14px;border-radius:12px;background:#f1f7fb;border:1px solid #c5dbe5;line-height:1.55}'+
'#vpqSurgToolWrap .toolnav{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}';document.head.append(style);
let host;
function close(){host?.remove();host=null;document.removeEventListener('keydown',escKey,true)}
function escKey(e){if(e.key==='Escape'){e.stopPropagation();close()}}
function shell(title,body){
 host.innerHTML='<section class="panel" role="dialog" aria-modal="true" aria-labelledby="vpqSurgToolHeading"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><h2 id="vpqSurgToolHeading" style="font-size:20px;margin:0">🪡 '+escape(title)+'</h2><button data-close aria-label="Close">✕</button></div>'+body+'</section>';
 host.querySelector('[data-close]').onclick=close;
}
function home(){
 shell('Surgical Instruments · Quick Guide',
 '<p>Learn the name, intended function, limitations and introductory handling principles. Then practice with clinical questions.</p>'+
 '<div class="toolnav"><button data-quiz="id">Identify from features</button><button data-quiz="use">Match instrument to function</button><button data-quiz="safety">Safety &amp; handling quiz</button></div>'+
 '<div class="toolgrid">'+tools.map((t,i)=>'<button data-tool="'+i+'"><b>'+escape(t.name)+'</b><small style="display:block;color:#6e88a0;margin-top:5px">'+escape(t.hint)+'</small></button>').join('')+'</div>'+
 '<div class="toolnav"><button data-prep>🧽 Sterile prep practice</button><button data-skills>💉 Clinical Skills room</button></div>'+
 '<p style="font-size:12px;color:#697e92">Introductory reference only. Illustrations are schematic; photo-based visual ID will be added when verified instrument images are available.</p>');
 host.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>detail(Number(b.dataset.tool)));
 host.querySelectorAll('[data-quiz]').forEach(b=>b.onclick=()=>startQuiz(b.dataset.quiz));
 host.querySelector('[data-prep]').onclick=()=>{close();window.VPQ_SURGERY_NECROPSY?.start('prep')};
 host.querySelector('[data-skills]').onclick=()=>{close();window.VPQ_SURGERY_SKILLS_NAV?.()};
}
function detail(n){
 const t=tools[n];shell(t.name,
 '<div class="toolcard"><p><b>Category:</b> '+escape(t.hint)+'</p><p><b>How to recognize it:</b> '+escape(features[n])+'</p><p><b>Used for:</b> '+escape(t.role)+'</p><p><b>When NOT to use it / common errors:</b> '+escape(t.avoid)+'</p><p><b>Handling principle:</b> '+escape(handling[n])+'</p></div>'+
 '<div class="toolnav"><button data-back>← All instruments</button><button data-next>Next instrument →</button><button data-practice>Practice this topic</button></div>'+
 '<p style="font-size:12px;color:#73869a">Practice technique and instrument selection with your surgical instructor before using on a patient.</p>');
 host.querySelector('[data-back]').onclick=home;
 host.querySelector('[data-next]').onclick=()=>detail((n+1)%tools.length);
 host.querySelector('[data-practice]').onclick=()=>startQuiz('use');
}
function startQuiz(kind){mode=kind;ix=0;score=0;answered=false;firstWrong=false;render()}
function render(){
 const t=tools[ix], idxs=[(ix+2)%tools.length,(ix+4)%tools.length,(ix+6)%tools.length].filter(i=>i!==ix);
 const opts=[ix,...idxs].sort((a,b)=>((tools[a].name.charCodeAt(0)*13+ix)%17)-((tools[b].name.charCodeAt(0)*13+ix)%17));
 const prompt=mode==='safety'?'Which handling or safety principle belongs to this instrument?':mode==='id'?'Which instrument matches these identifying features?':'Which instrument is most appropriate for this function?';
 const clue=mode==='safety'?t.name:mode==='id'?features[ix]:t.role;
 const answer=k=>mode==='safety'?handling[k]:tools[k].name;
 shell((mode==='id'?'Feature identification':mode==='safety'?'Instrument handling':'Instrument functions')+' · '+(ix+1)+'/'+tools.length,
 '<p><b>'+prompt+'</b></p><div class="toolcard">'+escape(clue)+'</div>'+
 '<div id="vpqSurgToolChoices">'+opts.map(k=>'<button class="choice" data-choice="'+k+'">'+escape(answer(k))+'</button>').join('')+'</div>'+
 '<div id="vpqSurgToolFeedback" aria-live="polite"></div><div class="toolnav"><button data-next disabled>'+(ix===tools.length-1?'Finish':'Next →')+'</button><button data-back>← Guide</button></div>');
 host.querySelector('[data-back]').onclick=home;
 host.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{
 const good=Number(b.dataset.choice)===ix;
 if(!good)firstWrong=true;
 host.querySelector('#vpqSurgToolFeedback').innerHTML='<div class="feedback"><b>'+(good?'Correct!':'Try again — consider the safest instrument and handling technique.')+'</b><p>'+escape(t.name)+': '+escape(t.role)+'.</p><p><b>Handling:</b> '+escape(handling[ix])+'</p><p><b>Avoid:</b> '+escape(t.avoid)+'</p></div>';
 if(good){answered=true;if(!firstWrong)score++;host.querySelectorAll('[data-choice]').forEach(x=>x.disabled=true);host.querySelector('[data-next]').disabled=false;}
 });
 host.querySelector('[data-next]').onclick=()=>{
 if(ix===tools.length-1){shell('Practice complete','<p>First-attempt correct: <b>'+score+' / '+tools.length+'</b></p><p>These are educational recognition and reasoning questions, not proof of hands-on surgical competency.</p><div class="toolnav"><button data-home>Return to tool guide</button><button data-again>Retry</button></div>');host.querySelector('[data-home]').onclick=home;host.querySelector('[data-again]').onclick=()=>startQuiz(mode);return}
 ix++;answered=false;firstWrong=false;render();
 };
}
function open(){close();host=document.createElement('div');host.id='vpqSurgToolWrap';document.body.append(host);document.addEventListener('keydown',escKey,true);home()}
window.VPQ_SURGICAL_TOOL_LAB={open};
})();
