/* Play & Enrich — interactive, one-time-reward feline enrichment in the existing Cat Corner. */
window.VPQ_CAT_ENRICHMENT=function(api){
'use strict';
const catSource=window.VPQ_MEET_CATS;
const challenges=[
{id:'mochi',name:'Mochi',scene:'A timid cat in a busy clinic',intro:'Mochi ducks into a cubby when people enter. She watches but will not approach.',goal:'Help Mochi feel safer before any voluntary exploration.',options:[
 ['Covered carrier, hide box, quiet space','hide','Best choice: a quiet hiding space and predictable access reduce exposure and allow choice.','cozy'],
 ['Loud automatic chasing toy','loud','Noise and rapid unpredictable motion may increase her fear.','worried'],
 ['Remove hiding options','open','Forced exposure removes control and may worsen stress.','worried']
],correct:0,follow:'Offer choices, allow time to decompress, and reassess behavior; urgent medical care may still require carefully planned handling.'},
{id:'juniper',name:'Juniper',scene:'A confident explorer',intro:'Juniper loves tall perches and wakes up by stretching and scratching.',goal:'Build a safe vertical space with normal scratching outlets.',options:[
 ['Wobbly shelf above a busy door','wobble','Unstable high perches create a fall risk and discourage secure climbing.','worried'],
 ['Stable tiered tower with scratcher and easy route down','tree','Correct: stability, varied heights and an accessible descent support exploration and scratching.','cozy'],
 ['Remove scratching surfaces','none','Scratching is a normal behavior; give appropriate surfaces rather than removing all outlets.','worried']
],correct:1,follow:'For seniors or mobility-limited cats, adjust heights, use steps or ramps, and avoid painful jumps.'},
{id:'pebble',name:'Pebble',scene:'The energetic hunter',intro:'Pebble stalks, pounces and chases, but sometimes whips her tail during long play sessions.',goal:'Choose satisfying predatory play without overstimulating her.',options:[
 ['Wave a toy endlessly out of reach','endless','Frustration can increase when capture is never possible.','worried'],
 ['Wiggle bare fingers as prey','hands','Hand play can teach biting and scratching people; use a toy instead.','worried'],
 ['Short wand-play session with stalking, chase and a catch','wand','Excellent: let Pebble complete parts of the predatory sequence and pause if arousal rises.','cozy']
],correct:2,follow:'End with an achievable capture, then offer a calm transition such as a small appropriate food reward.'},
{id:'luna',name:'Luna',scene:'A window-watching observer',intro:'Luna relaxes on a sunny perch but occasionally becomes tense when birds linger outside.',goal:'Preserve her choice and comfort while offering visual enrichment.',options:[
 ['Secure shaded perch with a retreat path','window','Right: choice, a safe perch and the option to leave make visual enrichment more flexible.','cozy'],
 ['Unscreened open window at a high floor','unsafe','Open unscreened windows are dangerous. Cats can fall or escape.','worried'],
 ['Keep bird stimuli intense when she becomes distressed','intense','Some cats become frustrated or distressed with inaccessible prey-like stimuli; adjust the view.','worried']
],correct:0,follow:'Watch posture, vocalization and disengagement; modify intensity or offer another activity if she cannot settle.'},
{id:'biscuit',name:'Biscuit',scene:'A food-motivated problem solver',intro:'Biscuit is eager to investigate objects and enjoys working for part of his normal meal.',goal:'Introduce a food puzzle that is fun rather than frustrating.',options:[
 ['Difficult puzzle with no visible food on the first day','difficult','Start easy and increase challenge gradually; severe difficulty may cause frustration.','worried'],
 ['Easy puzzle with his usual diet, then gradually increase difficulty','puzzle','Great: puzzle feeding encourages foraging while respecting diet and learning pace.','cozy'],
 ['Withhold all meals until he solves it','withhold','Never use enrichment to compromise nutrition; medical and nutritional needs come first.','worried']
],correct:1,follow:'In hospitalized, ill or anorexic cats prioritize adequate intake and comfort over puzzle difficulty.'}
];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function progress(){
 if(!api.state.catEnrichment||typeof api.state.catEnrichment!=='object')api.state.catEnrichment={mastered:[],attempted:{},current:null};
 const r=api.state.catEnrichment;
 if(!Array.isArray(r.mastered))r.mastered=[];
 if(!r.attempted||typeof r.attempted!=='object')r.attempted={};
 return r;
}
function cat(id){return catSource?.({state:api.state,showModal:api.showModal,persist:api.persist,updateHUD:api.updateHUD,modalBody:api.modalBody})?.cats?.find(c=>c.id===id)}
// Shared portraits are supplied by the mounted Meet Cats module, avoiding duplicate controllers.
function portrait(c,pose){
 const source=api.behavior;
 const character=source?.cats?.find(x=>x.id===c.id);
 return character&&source.portrait?source.portrait(character,pose):'<div style="font-size:70px" aria-label="Cat illustration">🐈</div>';
}
function menu(){
 const p=progress();
 api.showModal('🧶 Play & Enrich · Kitty Playground',
 '<p>Choose enrichment for five different feline personalities. See their response and learn the <b>why</b> behind a good setup.</p>'+
 '<p><b>Mastered: '+p.mastered.length+' / 5.</b> First mastery of each challenge: 20 EXP + 4 coins. Complete all five for a one-time 40 EXP + 8 coin bonus.</p>'+
 '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px">'+challenges.map(c=>
 '<button data-enrich-cat="'+c.id+'" style="border:2px solid #d7bbdf;background:#fff7fb;border-radius:15px;padding:12px;color:#71577f">'+
 portrait(c,'relaxed')+'<strong style="display:block">'+esc(c.name)+'</strong><small>'+esc(c.scene)+'</small><div style="font-weight:800">'+(p.mastered.includes(c.id)?'✓ Mastered':'Try enrichment')+'</div></button>').join('')+'</div>');
}
function card(id){
 const c=challenges.find(x=>x.id===id)||challenges[0];const p=progress();p.current=c.id;
 api.showModal('🐈 '+c.name+' · Enrichment Challenge',
 '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:14px"><div style="background:#f9e9f7;border:2px solid #d9b8e1;border-radius:20px;padding:7px">'+portrait(c,'relaxed')+'</div><div style="flex:1;min-width:200px"><h3>'+esc(c.scene)+'</h3><p>'+esc(c.intro)+'</p></div></div>'+
 '<h3>🎯 '+esc(c.goal)+'</h3><div style="display:grid;gap:9px">'+c.options.map((o,i)=>'<button data-enrich-choice="'+i+'" style="padding:12px;text-align:left;white-space:normal;border:2px solid #d3b9df;background:#fffafc;border-radius:12px"><b>'+esc(o[0])+'</b></button>').join('')+'</div><button data-enrich-menu="1">← All cats</button>');
}
function answer(i){
 const p=progress(),c=challenges.find(x=>x.id===p.current);if(!c||!Number.isInteger(i)||i<0||i>=c.options.length)return menu();
 const correct=i===c.correct,old=p.mastered.includes(c.id);p.attempted[c.id]=(Number(p.attempted[c.id])||0)+1;
 let xp=0,coins=0;
 if(correct&&!old){p.mastered.push(c.id);xp+=20;coins+=4}
 if(p.mastered.length===challenges.length&&!p.bonus){p.bonus=true;xp+=40;coins+=8}
 api.state.xp=(Number(api.state.xp)||0)+xp;api.state.coins=(Number(api.state.coins)||0)+coins;
 api.persist();api.updateHUD();
 api.showModal((correct?'🌟 Happy paws!':'🐾 Try another setup')+' · '+c.name,
 '<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center"><div style="border:2px solid #dfbfe8;background:#fff1fa;border-radius:18px;padding:8px">'+portrait(c,correct?'sleeping':'fearful')+'</div><div style="flex:1;min-width:195px"><h3>'+(correct?'The cat can engage at their own pace':'The cat seems uncomfortable')+'</h3><p>'+esc(c.options[i][2])+'</p><p><b>Clinical pearl:</b> '+esc(c.follow)+'</p></div></div>'+
 '<p><b>Earned:</b> +'+xp+' EXP · +'+coins+' coins'+(xp>20?' · All-cat bonus unlocked!':'')+'</p>'+
 '<div style="display:flex;gap:9px;flex-wrap:wrap"><button data-enrich-retry="'+c.id+'">'+(correct?'Replay challenge':'Try again')+'</button><button data-enrich-menu="1">🐈 More cats</button></div>');
}
api.modalBody.addEventListener('click',e=>{
 const b=e.target.closest('[data-enrich-cat],[data-enrich-choice],[data-enrich-menu],[data-enrich-retry]');if(!b)return;
 if(b.dataset.enrichMenu!==undefined)return menu();
 if(b.dataset.enrichCat!==undefined)return card(b.dataset.enrichCat);
 if(b.dataset.enrichRetry!==undefined)return card(b.dataset.enrichRetry);
 if(b.dataset.enrichChoice!==undefined)return answer(Number(b.dataset.enrichChoice));
});
return Object.freeze({menu,card});
};