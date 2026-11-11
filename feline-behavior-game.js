/* Meet the Cats: short evidence-aligned feline body language learning game.
 * Runs in the existing walkable Cat Corner; uses the clinic's save and reward state.
 */
window.VPQ_MEET_CATS=function(api){
'use strict';
const cats=[
 {id:'mochi',name:'Mochi',subtitle:'The shy hideout expert',coat:'#edbc94',secondary:'#fff0d7',eye:'#659b8c',ears:'side',tail:'low',
  qs:[
  {id:'hide',title:'Mochi retreats into her cubby',signs:'Crouched posture, ears turned sideways, dilated pupils, and avoidance of reaching hands.',prompt:'What is the best initial response?',options:['Reach into the cubby and lift her out','Offer hiding options and let her choose when to approach','Remove all covers so you can watch her'],answer:1,why:'A hiding place and choice reduce perceived threats. Forced removal can increase fear and defensive behavior. Assess medical urgency, but use the least stressful safe approach.'},
  {id:'carrier',title:'Mochi arrives at the clinic',signs:'She remains inside a carrier and watches quietly; her body is tense but she is not trying to escape.',prompt:'Which exam-room setup is most cat-friendly?',options:['Put the carrier on a raised stable surface and offer a towel cover','Place the carrier in the middle of a busy floor','Immediately tip the carrier to encourage her to leave'],answer:0,why:'Elevating a secure carrier, providing a visual barrier and allowing voluntary exit support feline control and reduce exposure to noise and unfamiliar animals.'}
 ]},
 {id:'juniper',name:'Juniper',subtitle:'The curious climber',coat:'#49445e',secondary:'#fff9f1',eye:'#a5d9b5',ears:'forward',tail:'up',
  qs:[
  {id:'height',title:'Juniper surveys the lounge',signs:'Upright tail, forward ears, relaxed movement and interest in elevated platforms.',prompt:'Which enrichment is most appropriate?',options:['A secure multi-level perch with a stable route down','Only an empty floor without hiding places','A dangling toy next to an unsafe open window'],answer:0,why:'Safe vertical space supports exploration and observation. A stable route up and down gives the cat control over where to rest.'},
  {id:'scratch',title:'Juniper scratches beside the tower',signs:'He stretches upward and scratches a vertical post after waking.',prompt:'How should you respond?',options:['Punish the scratching to stop the behavior','Provide a stable scratching surface near the preferred location','Remove all scratching surfaces'],answer:1,why:'Scratching is normal feline behavior for claw maintenance, stretching and scent/visual communication. Providing preferred surfaces supports welfare.'}
 ]},
 {id:'pebble',name:'Pebble',subtitle:'The playful little hunter',coat:'#b1b5c9',secondary:'#eff2fb',eye:'#5b859c',ears:'forward',tail:'active',
  qs:[
  {id:'hunt',title:'Pebble spots the feather wand',signs:'Focused gaze, low playful stalk, brief pounce, then a relaxed reset.',prompt:'Which play pattern best supports her natural behavior?',options:['Let her stalk, chase, pounce and catch a toy','Wave it constantly out of reach until she gives up','Use your hands as the moving target'],answer:0,why:'Predatory-style play with opportunities to catch a toy provides an outlet for normal hunting behavior. Avoid using hands as prey targets.'},
  {id:'pause',title:'Pebble suddenly switches signals',signs:'Rapid tail lashing, ears flattening, body stiffening and attempts to turn away.',prompt:'What is the best next step?',options:['Keep touching her until she settles','Pause interaction and give her space to disengage','Restrain her more tightly'],answer:1,why:'A sudden combination of tail lashing, ear changes and tension can indicate rising arousal or discomfort. Stop and reassess instead of pushing interaction.'}
 ]},
 {id:'luna',name:'Luna',subtitle:'The peaceful window watcher',coat:'#9e8fae',secondary:'#e6dfee',eye:'#68a999',ears:'neutral',tail:'curled',
  qs:[
  {id:'window',title:'Luna watches birds from the perch',signs:'Loose resting posture and soft eyes; she can retreat whenever she wishes.',prompt:'How can you maintain this enrichment safely?',options:['Provide a secure cushioned perch and an escape route','Leave an unscreened window wide open','Block every hiding option'],answer:0,why:'Predictable visual stimulation can enrich the environment when the cat remains comfortable and has safe, voluntary access.'},
  {id:'frustration',title:'Luna is no longer relaxed',signs:'She repeatedly lunges at the window, vocalizes intensely and cannot settle.',prompt:'What should you consider?',options:['All window watching is always calming','Reduce the triggering stimulus and provide alternative enrichment','Increase the frustrating view without breaks'],answer:1,why:'Individual cats can become frustrated by inaccessible stimuli. Watch behavior and adjust the environment rather than assuming every visual stimulus is beneficial.'}
 ]},
 {id:'biscuit',name:'Biscuit',subtitle:'The food puzzle enthusiast',coat:'#f0d6a6',secondary:'#fff8e8',eye:'#86b092',ears:'forward',tail:'curled',
  qs:[
  {id:'puzzle',title:'Biscuit wants a puzzle feeder',signs:'He readily explores and manipulates objects for his usual meal.',prompt:'How should you introduce the puzzle?',options:['Start with an easy food puzzle and gradually increase difficulty','Immediately use the hardest puzzle and withhold the meal until solved','Use the same feeding puzzle for every cat regardless of ability'],answer:0,why:'A simple, achievable food puzzle can support foraging and problem-solving. Gradual difficulty changes help avoid frustration; account for mobility, diet and the individual cat.'},
  {id:'clinical',title:'Biscuit is hospitalized',signs:'He is eating poorly and is recovering from illness.',prompt:'What takes priority when choosing enrichment?',options:['Maximize puzzle difficulty regardless of food intake','Ensure adequate nutrition and comfort; offer low-effort enrichment when appropriate','Force puzzle play before allowing normal food'],answer:1,why:'Ill cats need nutritional intake and comfort prioritized. An enrichment plan should never obstruct adequate feeding or clinical care.'}
 ]}
];
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function record(){
 if(!api.state.catBehavior||typeof api.state.catBehavior!=='object')api.state.catBehavior={answered:{},mastered:[],current:null};
 const r=api.state.catBehavior;
 if(!r.answered||typeof r.answered!=='object')r.answered={};
 if(!Array.isArray(r.mastered))r.mastered=[];
 return r;
}
function portrait(cat,pose='relaxed'){
 const fearful=pose==='fearful',eyes= fearful?7:4.5;
 const ears= fearful?'<path d="M63 48L40 43L66 62M137 48L160 43L134 62" fill="'+cat.coat+'" stroke="#8a788a" stroke-width="4"/>':'<path d="M65 55L57 18L84 39M115 39L143 18L135 55" fill="'+cat.coat+'" stroke="#8a788a" stroke-width="4"/>';
 const tail= fearful?'<path d="M141 132Q164 148 171 132" stroke="'+cat.coat+'" stroke-width="13" fill="none"/>':cat.tail==='up'?'<path d="M141 133Q180 91 173 67" stroke="'+cat.coat+'" stroke-width="13" fill="none"/>':'<path d="M140 139Q177 148 166 119" stroke="'+cat.coat+'" stroke-width="13" fill="none"/>';
 return '<svg viewBox="0 0 200 180" width="170" height="160" role="img" aria-label="'+escape(cat.name)+' drawn as a soft illustrated feline"><ellipse cx="103" cy="163" rx="72" ry="11" fill="#927ca7" opacity=".16"/>'+tail+'<ellipse cx="101" cy="127" rx="53" ry="42" fill="'+cat.coat+'" stroke="#958399" stroke-width="4"/>'+ears+'<circle cx="100" cy="80" r="56" fill="'+cat.coat+'" stroke="#958399" stroke-width="4"/><ellipse cx="100" cy="111" rx="33" ry="21" fill="'+cat.secondary+'"/><ellipse cx="80" cy="80" rx="'+eyes+'" ry="'+(fearful?11:7)+'" fill="'+cat.eye+'"/><ellipse cx="119" cy="80" rx="'+eyes+'" ry="'+(fearful?11:7)+'" fill="'+cat.eye+'"/><circle cx="79" cy="77" r="2" fill="#fff"/><circle cx="118" cy="77" r="2" fill="#fff"/><path d="M94 108l6 4 6-4M100 113q-7 9-14 2m14-2q7 9 14 2" fill="none" stroke="#997b88" stroke-width="3" stroke-linecap="round"/><g stroke="#9f8997" stroke-width="2.5"><path d="M67 109l-26-9m26 16-26 2m91-9 26-9m-26 16 26 2"/></g><path d="M79 150v15m42-15v15" stroke="'+cat.coat+'" stroke-width="14" stroke-linecap="round"/><path d="M80 132q20 10 39 0" stroke="'+cat.secondary+'" stroke-width="7" fill="none"/></svg>';
}
function pick(catId,qId){const cat=cats.find(x=>x.id===catId)||cats[0];const q=cat.qs.find(x=>x.id===qId)||cat.qs[0];return {cat,q,key:cat.id+':'+q.id}}
function menu(){
 const r=record();
 api.showModal('🐈 Meet the Cats · Behavior Studio','<p>Meet five illustrated feline personalities. Read their whole body posture, choose a low-stress response, and discover <b>why</b> it helps.</p><p><b>Mastered:</b> '+r.mastered.length+' / 10 scenarios · Correct first-time answers earn 10 EXP and 2 clinic coins; each completed cat has a one-time 30 EXP / 6 coin bonus.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:12px">'+cats.map(c=>'<button data-cat-open="'+c.id+'" style="border:2px solid #d9bddc;border-radius:18px;background:#fff7fc;padding:12px;color:#6b547e">'+portrait(c)+'<strong style="display:block;font-size:16px">'+escape(c.name)+'</strong><small>'+escape(c.subtitle)+'</small><div style="font-weight:800;margin-top:5px">'+c.qs.filter(q=>r.mastered.includes(c.id+':'+q.id)).length+' / 2 mastered</div></button>').join('')+'</div><p style="font-size:12px">Behavior interpretation relies on context and multiple signals. No one tail or ear position diagnoses a cat\'s mood.</p>');
}
function card(catId,qId){
 const {cat,q,key}=pick(catId,qId),r=record();r.current=key;
 const done=r.answered[key];const pose=q.signs.includes('Crouched')||q.signs.includes('flattening')?'fearful':'relaxed';
 api.showModal('🐾 '+cat.name+' · Behavior Challenge','<div style="display:flex;flex-wrap:wrap;gap:15px;align-items:center"><div style="border-radius:18px;background:#f8eafa;border:2px solid #d7b5da">'+portrait(cat,pose)+'</div><div style="flex:1;min-width:200px"><h3>'+escape(q.title)+'</h3><p>'+escape(q.signs)+'</p></div></div><h3>'+escape(q.prompt)+'</h3><div style="display:grid;gap:8px">'+q.options.map((option,i)=>'<button data-cat-answer="'+i+'" style="white-space:normal;text-align:left;padding:12px;border:2px solid #d5bfdc;border-radius:12px;background:#fff9fb">'+String.fromCharCode(65+i)+'. '+escape(option)+'</button>').join('')+'</div><p style="font-size:12px">'+(done?'Previously answered · You may replay for practice without duplicate rewards.':'First-time correct answers award EXP and clinic coins.')+'</p><button data-cat-menu="1">← All cats</button>');
}
function answer(index){
 const r=record();if(!r.current)return menu();
 const [id,qid]=r.current.split(':'),{cat,q,key}=pick(id,qid),correct=index===q.answer,already=r.answered[key]!==undefined;
 let earnedXp=0,earnedCoins=0,bonus=false;
 if(!already){
  r.answered[key]={correct,selected:index};
  api.state.attempts=(Number(api.state.attempts)||0)+1;
  if(correct){api.state.correct=(Number(api.state.correct)||0)+1;earnedXp=10;earnedCoins=2;r.mastered.push(key)}
  if(cat.qs.every(x=>r.answered[cat.id+':'+x.id]!==undefined)&&!r.answered[cat.id+':bonus']){
   r.answered[cat.id+':bonus']=true;earnedXp+=30;earnedCoins+=6;bonus=true;
  }
  api.state.xp=(Number(api.state.xp)||0)+earnedXp;
  api.state.coins=(Number(api.state.coins)||0)+earnedCoins;
  api.persist();api.updateHUD();
 }
 const next=cat.qs.find(x=>x.id!==q.id);
 api.showModal((correct?'🌟 Well done!':'🐾 Learning moment')+' · '+cat.name,
 '<p><b>'+ (correct?'Good clinical reasoning.':'The better choice is: '+escape(q.options[q.answer]))+'</b></p><p>'+escape(q.why)+'</p>'+
 (already?'<p>Replay complete — no additional coins or EXP.</p>':'<p><b>Earned:</b> +'+earnedXp+' EXP · +'+earnedCoins+' clinic coins'+(bonus?' · Completed '+escape(cat.name)+'\'s two scenarios!':'')+'</p>')+
 '<div style="display:flex;gap:8px;flex-wrap:wrap"><button data-cat-next="'+cat.id+':'+(next?next.id:q.id)+'">'+(next?'Try the other '+escape(cat.name)+' case':'Replay this case')+'</button><button data-cat-menu="1">🐈 All cats</button></div>');
}
api.modalBody.addEventListener('click',e=>{
 const el=e.target.closest('[data-cat-open],[data-cat-question],[data-cat-answer],[data-cat-menu],[data-cat-next]');
 if(!el)return;
 const d=el.dataset;
 if(d.catMenu!==undefined)return menu();
 if(d.catOpen!==undefined){const cat=cats.find(x=>x.id===d.catOpen)||cats[0];const r=record();const q=cat.qs.find(q=>r.answered[cat.id+':'+q.id]===undefined)||cat.qs[0];return card(cat.id,q.id)}
 if(d.catQuestion!==undefined||d.catNext!==undefined){const key=d.catQuestion||d.catNext;const [id,qid]=key.split(':');return card(id,qid)}
 if(d.catAnswer!==undefined)return answer(Number(d.catAnswer));
});
return Object.freeze({menu,cats});
};
