/* Vet Pharm Quest — original dog and cat Fear, Anxiety & Stress practice.
 * Observe the entire patient, then decide how to proceed.
 * Educational examples adapted from the concepts of the Fear Free 0–5 FAS scale;
 * not a replacement for the official rubric or clinical judgment.
 */
window.VPQ_FAS_LAB=(function(){
'use strict';
let api=null,session=null;
const source='https://www.fearfree.com/handout/emotional-medical-record-fas-scale/';
const cases={
dog:[
 {id:'dog0',name:'Mochi',situation:'Mochi enters on a loose leash, explores, shows soft eyes and neutral ears, and approaches the technician voluntarily.',score:0,why:'No visible FAS signs and voluntary exploration support a low-stress assessment.',plan:'Reinforce voluntary participation; continue observing for changes.'},
 {id:'dog1',name:'Pip',situation:'Pip turns her head away and briefly lip-licks twice in a minute, but accepts treats and chooses to approach.',score:1,why:'A few subtle displacement/avoidance signs with ongoing voluntary interaction suggest mild FAS.',plan:'Slow down, offer choice and rewards, and keep watching.'},
 {id:'dog2',name:'Barry',situation:'Barry has a lowered tail and slightly pinned ears, with a tight-mouth pant once or twice in a minute. He continues to accept treats and greeting.',score:2,why:'A small number of moderate signs, occurring infrequently while accepting reinforcement, best fit level 2.',plan:'Reduce triggers and use gentle, voluntary handling.'},
 {id:'dog3',name:'Zuko',situation:'Zuko repeatedly fidgets, shifts away, tucks his ears, and pants with a tense mouth several times each minute. He briefly stops taking treats but is not actively avoiding the team.',score:3,why:'Multiple recurring moderate signals and intermittent reinforcer refusal without active avoidance fit level 3.',plan:'Pause and reassess; simplify the plan and discuss preventive support for future visits.'},
 {id:'dog4',name:'Rex',situation:'Rex trembles, crouches with a tightly tucked tail, refuses food and repeatedly attempts to retreat from the examination area. He does not threaten or lunge.',score:4,why:'Severe avoidance and escape responses without aggression indicate level 4.',plan:'Stop nonurgent procedures; provide space and a low-stress veterinary plan.'},
 {id:'dog5',name:'Mera',situation:'Cornered near a kennel door, Mera stiffens, growls, lunges and snaps when a handler tries to reach in. She cannot tolerate the planned exam.',score:5,why:'Marked FAS with threat or defensive aggression and inability to tolerate a procedure corresponds to level 5.',plan:'Stop. Never reach into the kennel; protect patient and staff and develop a veterinarian-led alternative plan.'}
],
cat:[
 {id:'cat0',name:'Jinx',situation:'Jinx sits loosely in an open carrier, soft eyes and neutral ears, then comes forward to rub the carrier edge and solicit attention.',score:0,why:'Relaxed posture and voluntary greeting with no visible FAS signs suggest level 0.',plan:'Use patient choice, quiet handling, and keep a safe retreat available.'},
 {id:'cat1',name:'Raven',situation:'Raven turns her head away and briefly pauses when approached; her ears remain mostly neutral, and she returns to voluntarily sniff the offered hand.',score:1,why:'A few subtle signs while continuing voluntary interaction indicate level 1.',plan:'Allow her to choose whether to interact; avoid reaching into her hiding place.'},
 {id:'cat2',name:'Theta',situation:'Theta has ears slightly to the side and a lowered tail for brief moments, but accepts a preferred treat and voluntarily steps onto a towel.',score:2,why:'A couple of moderate signs with retained willingness to engage suggest level 2.',plan:'Use a non-slip towel, decrease noise and reinforce voluntary movement.'},
 {id:'cat3',name:'Selena',situation:'Selena repeatedly swishes her tail and shifts tensely several times per minute; she briefly refuses a favorite treat, yet remains near the technician without actively fleeing.',score:3,why:'Several repeated moderate signs with intermittent reinforcer refusal suggest level 3.',plan:'Pause, minimize handling, and reassess before the next step.'},
 {id:'cat4',name:'Zephyr',situation:'Zephyr crouches tightly at the back of the carrier, pupils wide, ears flattened, tail thrashing, and tries to withdraw from every approach. No hissing or swatting occurs.',score:4,why:'Severe avoidance and tense body language without aggression match level 4.',plan:'Do not pull the cat out; stop nonurgent handling and use a considerate plan.'},
 {id:'cat5',name:'Onyx',situation:'Onyx is trapped in a narrow kennel corner, hisses, growls, swats and attempts to bite when approached. The planned procedure cannot be performed safely.',score:5,why:'Strong FAS with defensive aggression and procedure intolerance is level 5.',plan:'Stop and reassess with a veterinarian; avoid forced restraint or cornering.'}
]
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const badge=n=>n<=1?'LOW · GO':n<=3?'MODERATE · CAUTION':'HIGH · STOP';
const nav=species=>'<div class="buttonrow"><button data-vpqfas="dog">🐕 Dog kennel</button><button data-vpqfas="cat">🐈 Cat corner</button><button data-vpqfas="reference">📚 FAS overview</button></div>';
function home(species='dog'){
 session=null;
 const title=species==='dog'?'🐕 Dog Kennel · FAS Rounds':'🐈 Cat Corner · FAS Rounds';
 const first='<p>Read body language, rate fear, anxiety & stress on a 0–5 scale, then decide what handling changes to make. Each animal has a different clinical observation. The cases teach recognition, not a formal certification.</p>';
 api.showModal(title,first+nav(species)+
 '<div class="infobox"><b>New learning wing:</b> 6 original '+species+' cases with explanations and patient-first handling plans. Questions can earn normal study rewards once per case.</div>'+
 '<p>🐾 <b>Future animal husbandry:</b> lecture-aligned care, housing, enrichment, nutrition and welfare lessons will be added when course notes are available.</p>'+
 '<div class="buttonrow"><button data-vpqfas="start-'+species+'">▶ Start FAS practice</button><button data-vpqfas="reference">View scale guide</button></div>'+
 '<p class="small">Reference: <a href="'+source+'" target="_blank" rel="noopener noreferrer">Fear Free FAS scoring and emotional record</a>.</p>');
}
function reference(){
 session=null;
 api.showModal('📚 FAS Quick Reference',nav('dog')+
 '<p><b>0:</b> Relaxed, social; no FAS signs. <b>1:</b> A few subtle signs with voluntary engagement. <b>2:</b> One or two infrequent moderate signs; accepts rewards. <b>3:</b> Several recurring moderate signs; inconsistent interest in rewards. <b>4:</b> Severe distress and active avoidance without aggression. <b>5:</b> Severe FAS with aggression and inability to tolerate procedures.</p>'+
 '<p><b>Observe:</b> ears, eyes, pupils, posture, mouth, tail, movement, vocalizations, escape attempts and willingness to engage. A single cue never tells the whole story.</p>'+
 '<p><b>Why?</b> Fear activates defensive responses. Reducing pressure, giving choices and modifying the environment can prevent escalation. Aggression can be fear-based, not misbehavior. Pain or illness can also change behavior.</p>'+
 '<p><b>Stop means stop nonessential procedures:</b> address urgent medical needs using an individualized veterinary safety and welfare plan.</p>'+
 '<p><a href="'+source+'" target="_blank" rel="noopener noreferrer">Official Fear Free FAS reference</a></p>');
}
function start(species){session={species,i:0,choice:null,awarded:[]};draw()}
function draw(){
 if(!session)return;
 const {species,i,choice}=session,list=cases[species];
 if(i>=list.length){api.showModal('🏅 FAS Rounds Complete','<p>Excellent. You observed all '+list.length+' '+species+' patients. FAS is reassessed throughout a visit: scores may rise or fall as conditions change.</p>'+nav(species)+'<button data-vpqfas="start-'+species+'">Practice again</button>');return}
 const c=list[i];
 let options='<div class="buttonrow">'+[0,1,2,3,4,5].map(n=>'<button data-vpqfaschoice="'+n+'" '+(choice!==null?'disabled':'')+' style="min-width:54px">'+n+'</button>').join('')+'</div>';
 const feedback=choice===null?'': '<div class="infobox"><b>'+(choice===c.score?'✓ Correct':'Not quite')+' — FAS '+c.score+' ('+badge(c.score)+')</b><p>'+esc(c.why)+'</p><p><b>Next handling decision:</b> '+esc(c.plan)+'</p></div><button data-vpqfas="next">Next patient →</button>';
 api.showModal((species==='dog'?'🐕':'🐈')+' FAS Case '+(i+1)+' / '+list.length,
 '<p><b>'+esc(c.name)+'</b> · '+esc(c.situation)+'</p><p><b>What is this patient’s best-supported FAS score?</b></p>'+options+feedback+
 '<p class="small">Consider the frequency and severity of signs, social interaction and acceptance of reinforcers. Educational case; assess in context.</p>');
}
function init(nextApi){
 api=nextApi;
 api.body.addEventListener('click',ev=>{
  const score=ev.target.closest('[data-vpqfaschoice]');
  if(score){if(!session||session.choice!==null)return;const c=cases[session.species][session.i];session.choice=Number(score.dataset.vpqfaschoice);if(session.choice===c.score){api.awardQuestion?.('fas-'+session.species,c.id,true)}return draw()}
  const b=ev.target.closest('[data-vpqfas]');if(!b)return;
  const cmd=b.dataset.vpqfas;
  if(cmd==='dog'||cmd==='cat')return home(cmd);
  if(cmd==='reference')return reference();
  if(cmd==='next'&&session){session.i++;session.choice=null;return draw()}
  if(cmd.startsWith('start-'))return start(cmd.slice(6))
 });
}
return Object.freeze({init,home,reference,cases});
})();
