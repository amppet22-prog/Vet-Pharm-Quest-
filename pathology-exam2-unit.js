/* General Pathology · Exam 2 study units (Dr. Andersson, LMU CVM 730A).
 * Same layout the owner chose for radiology (2026-11-26):
 *  1) Start here — short lessons in a suggested order, all unlocked, each ending in a 5-question quick check.
 *  2) Practice by skill — pick how many; photos have no title until you answer; "show me" opens the marked slide.
 *  3) Class cases, step by step — the lecture's own "complete the morphologic diagnosis" slides and the
 *     instructor practice set, graded one blank at a time, then the answer key.
 *  4) Lesion atlas — clean photo + marked slide, in the owner's card format: Gross · Dx (Organ: dx) · Histo · Why · Notes.
 * Labels: SLIDE = printed lecture text · PROFESSOR = the owner's handwritten class notes (what Dr. Andersson said)
 *         YOUR QUESTION = a question the owner wrote to guide understanding · ADDED = written for the game (Zachary 7e / standard pathology).
 * Lecture data files call VPQ_PATH_EXAM2_UNIT.register({...}). Stable IDs: never rename item/case ids (progress + XP use them).
 * Images: LMU CVM course material, owner-attested permission for non-commercial study.
 */
(function(){'use strict';
let api=null,back=null,cur=null,view='home';
const UNITS={};
const STORE='vpq-path-exam2-unit-v1',NS='path-exam2';
const BASE='https://raw.githubusercontent.com/amppet22-prog/Vet-Pharm-Quest-/main/pathology-course-photos/exam2/';
const U=p=>/^https?:/.test(p)?p:BASE+p;
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function store(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(e){return {}}}
function save(fn){try{const s=store();fn(s);localStorage.setItem(STORE,JSON.stringify(s))}catch(e){}}
function award(id,ok){try{const r=api.awardQuestion?.(NS,id,ok);return r&&r.xp?'+'+r.xp+' study XP':''}catch(e){return ''}}
function order(seed,arr){return arr.slice().sort((a,b)=>hash(seed+a)-hash(seed+b))}
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}

/* ---------------------------------------------------------------- shared helpers for lecture files */
const tag=(t,bg,fg)=>'<span style="font-size:10px;font-weight:800;background:'+bg+';color:'+fg+';border-radius:5px;padding:1px 5px;margin-left:4px;white-space:nowrap">'+t+'</span>';
const H={
 E,U,
 SLIDE:tag('SLIDE','#e8f4ff','#2f5f9a'),
 PROF:tag('PROFESSOR','#e3f6ec','#1f6b43'),
 MINE:tag('YOUR QUESTION','#fff3d6','#8a5a00'),
 ADD:tag('ADDED','#f4ecff','#7d4fb0'),
 fig:(u,c)=>'<figure style="margin:0"><a href="'+E(U(u))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(u))+'" alt="'+E(c)+'" style="display:block;width:100%;max-height:340px;object-fit:contain;border-radius:10px;background:#f3efe9"></a><figcaption style="font-size:11px;color:#6b7a90;margin-top:3px">'+E(c)+'</figcaption></figure>',
 grid:(...f)=>'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:10px;margin:8px 0 12px">'+f.join('')+'</div>',
 box:(t,h,bg='#fff',bd='#e6dccf')=>'<div style="background:'+bg+';border:1px solid '+bd+';border-radius:14px;padding:11px 13px;margin:0 0 11px">'+(t?'<b style="display:block;margin-bottom:4px;color:#5a3f2e">'+t+'</b>':'')+h+'</div>',
 ul:a=>'<ul style="margin:4px 0;padding-left:18px">'+a.map(x=>'<li style="margin:3px 0">'+x+'</li>').join('')+'</ul>',
 table:(head,rows)=>'<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12.5px"><tr>'+head.map(h=>'<th style="text-align:left;font-size:11px;color:#8a5f45;padding:4px 6px">'+h+'</th>').join('')+'</tr>'+rows.map(r=>'<tr>'+r.map((c,i)=>'<td style="border-top:1px solid #efe6db;padding:5px 6px;vertical-align:top'+(i===0?';font-weight:700':'')+'">'+c+'</td>').join('')+'</tr>').join('')+'</table></div>',
 marked:(u,c)=>'<details style="margin:4px 0 12px"><summary style="cursor:pointer;font-weight:800;color:#8a5f45">👉 Show the marked slide'+(c?' · '+E(c):'')+'</summary><a href="'+E(U(u))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(u))+'" alt="Marked slide" style="display:block;width:100%;border-radius:10px;margin-top:6px;border:1px solid #e6dccf"></a></details>',
 q:(q,a,o,ex)=>({q,a,o,ex})
};

/* ---------------------------------------------------------------- shell */
const C={ink:'#4a3426',accent:'#8a5f45',soft:'#fbf5ee',line:'#e6dccf',ok:'#2e9a57',okbg:'#e3f6e8',okfg:'#1d5e36',no:'#e07b1a',nobg:'#fff0e0',nofg:'#8a4a0c'};
function shell(title,html){api.showModal(title,'<div style="font-size:13px;color:'+C.ink+';line-height:1.55">'+html+'</div>');try{api.body.scrollTop=0}catch(e){}}
const btn=(k,t,primary)=>'<button type="button" data-vpqp2="'+k+'"'+(primary?' style="background:'+C.accent+';color:#fff;border-color:'+C.accent+';font-weight:800"':'')+'>'+t+'</button>';
function navBtns(extra){return '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">'+btn('home','← Lecture '+cur.n+' unit')+(extra||'')+'</div>'}
const optBtn=(i,x,state,attr)=>{let st='background:#fff;border:1px solid #e0d6ca;color:#4a3426';if(state==='g')st='background:'+C.okbg+';border:2px solid '+C.ok+';color:'+C.okfg;else if(state==='o')st='background:'+C.nobg+';border:2px solid '+C.no+';color:'+C.nofg;else if(state==='dim')st='background:#fafafa;border:1px solid #ece6de;color:#9a8f84';
 return '<button type="button" '+attr+'="'+i+'" aria-disabled="'+(state!=='')+'" style="display:block;width:100%;text-align:left;margin:6px 0;padding:10px 12px;border-radius:10px;font-weight:700;opacity:1;'+st+'">'+'ABCDEF'[i]+'. '+E(x)+(state==='g'?' ✓':'')+'</button>'};
const imgsHtml=list=>list&&list.length?'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:8px;margin:8px 0">'+list.map((u,i)=>'<figure style="margin:0;background:#2b2420;border-radius:10px;overflow:hidden"><a href="'+E(U(u))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(u))+'" alt="Image '+'ABCD'[i]+'" style="display:block;width:100%;max-height:380px;object-fit:contain"></a><figcaption style="background:#f6efe7;color:#5a3f2e;font-size:11.5px;padding:5px 8px"><b>Image '+'ABCD'[i]+'</b> · tap to enlarge</figcaption></figure>').join('')+'</div>':'';
function opts(it){if(it.o.length<=4)return order(it.id,it.o);const others=order(it.id,it.o.filter(x=>x!==it.a)).slice(0,3);return order(it.id+'x',[it.a,...others])}
const verdict=(ok,ex)=>'<p style="margin:6px 0 0;font-weight:700;color:'+(ok?C.okfg:C.nofg)+'">'+(ok?'✓ Correct.':'Not quite — the answer is in green.')+'</p>'+(ex?'<p style="margin:4px 0 0;font-size:12.5px">'+ex+'</p>':'');

/* ---------------------------------------------------------------- home */
function lectureTabs(){const ns=Object.keys(UNITS).map(Number).sort((a,b)=>a-b);return ns.length>1?'<div style="display:flex;flex-wrap:wrap;gap:5px;margin:0 0 10px">'+ns.map(n=>'<button type="button" data-vpqp2="unit-'+n+'" style="padding:4px 9px;border-radius:8px;font-size:12px;'+(n===cur.n?'background:'+C.accent+';color:#fff;border-color:'+C.accent+';font-weight:800':'')+'">L'+n+'</button>').join('')+'</div>':''}
function home(){
 view='home';const u=cur,st=store(),Ls=(st.lessons||{}),items=st.items||{},cs=st.cases||{};
 const lessonRows=u.lessons.map((l,i)=>{const r=Ls[l.id];return '<button type="button" data-vpqp2="lesson-'+i+'" style="display:flex;gap:10px;align-items:center;text-align:left;width:100%;padding:9px 11px;margin:0 0 6px;background:#fff;border:1px solid '+(r?.score>=4?C.ok:r?'#9fd3b5':C.line)+';border-radius:12px"><span style="font-size:20px">'+l.icon+'</span><span style="flex:1"><b>'+(i+1)+'. '+E(l.title)+'</b><small style="display:block;color:#7b6a5c">about '+l.min+' min · quick check: '+l.check.length+' questions'+(r?' · <b style="color:'+C.okfg+'">best '+r.score+'/'+l.check.length+'</b>':'')+'</small></span><span style="color:'+C.accent+';font-weight:800">›</span></button>'}).join('');
 const nxt=u.lessons.findIndex(l=>!(Ls[l.id]?.score>=4));
 const skillCard=k=>{const s=u.drills[k],n=s.items.length,done=s.items.filter(it=>items[it.id]).length;
  return '<div style="background:#fff;border:1px solid '+C.line+';border-radius:12px;padding:9px 11px"><b>'+s.icon+' '+E(s.title)+'</b><small style="display:block;color:#7b6a5c">'+n+' questions · '+done+' answered correctly</small>'+(s.note?'<small style="display:block;color:#7b6a5c">'+E(s.note)+'</small>':'')+
  '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">'+[5,10,0].filter(c=>c===0||c<n).map(c=>'<button type="button" data-vpqp2="run-'+k+'-'+c+'" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">'+(c?c+' shuffled':'All '+n)+'</button>').join('')+'</div>'+
  '<details style="margin-top:6px"><summary style="cursor:pointer;font-size:12px;color:#7b6a5c;font-weight:700">Pick one</summary><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">'+s.items.map((it,i)=>'<button type="button" data-vpqp2="pick-'+k+'-'+i+'" style="padding:3px 8px;border-radius:8px;font-size:12px;'+(items[it.id]?'background:'+C.okbg+';border:1px solid '+C.ok:'')+'">'+(it.img&&it.img.length?'Photo ':'Q ')+(i+1)+(items[it.id]?' ✓':'')+'</button>').join('')+'</div></details></div>'};
 const groups=[...new Set(u.cases.map(c=>c.g))];
 const caseList=groups.map(g=>'<details style="margin:0 0 6px"'+(g===groups[0]?' open':'')+'><summary style="cursor:pointer;font-weight:800">'+E(g)+' <small style="color:#7b6a5c;font-weight:600">('+u.cases.filter(c=>c.g===g).length+')</small></summary><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:6px;margin:6px 0">'+u.cases.map((c,i)=>[c,i]).filter(([c])=>c.g===g).map(([c,i])=>{const r=cs[c.id];return '<button type="button" data-vpqp2="case-'+i+'" style="text-align:left;padding:8px 10px;background:#fff;border:1px solid '+(r?.done?C.ok:C.line)+';border-radius:10px"><b style="font-size:12.5px">'+(r?.done?'⭐ ':'')+E(c.label)+'</b><small style="display:block;color:#7b6a5c">'+c.steps.length+' step'+(c.steps.length>1?'s':'')+(r?.done?' · '+r.score+'/'+c.steps.length:'')+'</small></button>'}).join('')+'</div></details>').join('');
 const atlasN=(u.atlas||[]).length;
 shell('🔬 Lecture '+u.n+' · '+u.title,
  '<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">'+btn('back','← '+E(back?.backLabel||'Pathology Foundations'))+'</div>'+lectureTabs()+
  H.box('📖 1 · Start here — learn it','<p style="margin:0 0 8px;font-size:12.5px;color:#7b6a5c">Suggested order — everything is open. Each lesson ends with a quick check.</p>'+(nxt>=0?'<button type="button" data-vpqp2="lesson-'+nxt+'" style="margin:0 0 8px;background:'+C.accent+';color:#fff;border-color:'+C.accent+';font-weight:800">▶ '+(nxt===0&&!Object.keys(Ls).some(k=>u.lessons.some(l=>l.id===k))?'Start':'Continue')+': '+E(u.lessons[nxt].title)+'</button>':'')+lessonRows,'linear-gradient(120deg,#fff3e6,#eef8f1)','#eadccb')+
  H.box('🎯 2 · Practice by skill','<p style="margin:0 0 8px;font-size:12.5px;color:#7b6a5c">Pick a skill and how many. Photos have no title until you answer.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:8px">'+Object.keys(u.drills).map(skillCard).join('')+
   '<div style="background:#fff;border:1px solid '+C.line+';border-radius:12px;padding:9px 11px"><b>🔀 Mixed practice</b><small style="display:block;color:#7b6a5c">Every skill, shuffled</small><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px"><button type="button" data-vpqp2="run-mixed-10" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">10 shuffled</button><button type="button" data-vpqp2="run-mixed-20" style="padding:4px 9px;border-radius:8px;font-weight:800;font-size:12px">20 shuffled</button></div></div></div>')+
  H.box('🩺 3 · Class cases, step by step','<p style="margin:0 0 8px;font-size:12.5px;color:#7b6a5c">Fill the blanks one at a time; the answer key and the marked slide open at the end.</p>'+caseList)+
  (atlasN?H.box('🖼️ 4 · Lesion atlas','<p style="margin:0 0 8px;font-size:12.5px;color:#7b6a5c">'+atlasN+' lesions from this lecture — clean photo first, marked slide on tap. Gross · Dx · Histo · Why · Notes.</p>'+btn('atlas','Open the atlas ›',true)):'')+
  '<p style="font-size:11px;color:#8a7b6e">'+E(u.credit||'Slides and photos: LMU CVM 730A General Pathology (Dr. Andersson), used with LMU permission for non-commercial study.')+' Labels: '+H.SLIDE+' printed slide · '+H.PROF+' your class notes (what she said) · '+H.MINE+' your own guiding question · '+H.ADD+' written for the game.</p>');
}

/* ---------------------------------------------------------------- lessons + quick check */
let L={i:0,qi:-1,ans:{}};
function lesson(i){
 view='lesson';L={i,qi:-1,ans:{}};const l=cur.lessons[i];
 shell(l.icon+' L'+cur.n+' · Lesson '+(i+1)+' · '+l.title,navBtns((i>0?btn('lesson-'+(i-1),'‹ Lesson '+i):'')+(i<cur.lessons.length-1?btn('lesson-'+(i+1),'Lesson '+(i+2)+' ›'):''))+l.body(H)+
  '<div style="text-align:center;margin:14px 0">'+btn('check','✅ Quick check · '+l.check.length+' questions',true)+'</div>');
}
function check(){
 const l=cur.lessons[L.i],k=L.qi,n=l.check.length;
 if(k>=n){const score=Object.keys(L.ans).filter(x=>!x.startsWith('c')&&L.ans[x]).length;save(s=>{s.lessons=s.lessons||{};const old=s.lessons[l.id]?.score||0;s.lessons[l.id]={score:Math.max(old,score)}});
  return shell('✅ Quick check · '+l.title,navBtns()+H.box('',(score>=n-1?'<b style="color:'+C.okfg+';font-size:16px">🎉 '+score+' / '+n+'</b><p>Nice — you\'ve got this lesson.</p>':'<b style="color:'+C.nofg+';font-size:16px">'+score+' / '+n+'</b><p>Worth a second look before moving on.</p>')+'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px">'+btn('lesson-'+L.i,'↺ Review the lesson')+(L.i<cur.lessons.length-1?btn('lesson-'+(L.i+1),'Next: '+E(cur.lessons[L.i+1].title)+' ›',true):btn('run-mixed-10','🔀 Try mixed practice',true))+'</div>'));
 }
 const it=l.check[k],o=order(l.id+k,it.o),chosen=L.ans['c'+k];
 shell('✅ Quick check · '+l.title,navBtns(btn('lesson-'+L.i,'↺ Back to the lesson'))+'<small style="color:#7b6a5c">Question '+(k+1)+' of '+n+'</small>'+
  H.box('',(it.img?imgsHtml([it.img]):'')+'<b style="font-size:14px">'+E(it.q)+'</b>'+o.map((x,i)=>optBtn(i,x,chosen===undefined?'':x===it.a?'g':i===chosen?'o':'dim','data-vpqp2-qc')).join('')+
  (chosen!==undefined?verdict(o[chosen]===it.a,it.ex)+'<div style="text-align:right">'+btn('qnext',k<n-1?'Next question ›':'See my score ›')+'</div>':''),C.soft,C.line));
}

/* ---------------------------------------------------------------- drills */
let R={list:[],at:0,chosen:{},key:false,title:'',reward:''};
function run(list,title,at=0){view='run';R={list,at,chosen:{},key:false,title,reward:''};runRender()}
function runRender(){
 const it=R.list[R.at],n=R.list.length,o=opts(it),ch=R.chosen[R.at],hasImg=it.img&&it.img.length;
 const nav='<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">'+btn('home','← Lecture '+cur.n+' unit')+'<button type="button" data-vpqp2="rprev" '+(R.at===0?'disabled':'')+'>‹ Previous</button><button type="button" data-vpqp2="rnext" '+(R.at>=n-1?'disabled':'')+'>Next ›</button><small style="color:#7b6a5c;margin-left:auto">'+(hasImg?'Photo':'Question')+' '+(R.at+1)+' of '+n+'</small></div>';
 const done=Object.keys(R.chosen).length===n,score=R.list.filter((x,i)=>R.chosen[i]!==undefined&&opts(x)[R.chosen[i]]===x.a).length;
 shell('🎯 '+R.title,nav+imgsHtml(it.img)+
  H.box('','<b style="font-size:14px">'+E(it.q)+'</b>'+o.map((x,i)=>optBtn(i,x,ch===undefined?'':x===it.a?'g':i===ch?'o':'dim','data-vpqp2-ans')).join('')+
  (ch!==undefined?verdict(o[ch]===it.a,it.ex)+(R.reward?'<small style="color:'+C.okfg+'">'+E(R.reward)+'</small>':'')+(it.title?'<p style="margin:4px 0 0;font-size:12px"><b>What this is:</b> '+E(it.title)+'</p>':'')+(it.src?'<p style="margin:2px 0 0;font-size:11px;color:#8a7b6e">Source: '+E(it.src)+'</p>':'')+
   (it.key?'<div class="buttonrow" style="margin-top:6px">'+btn('rkey',R.key?'🙈 Hide the marked slide':'👉 Show me where (marked slide)')+'</div>'+(R.key?'<a href="'+E(U(it.key))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(it.key))+'" alt="Marked slide" style="display:block;width:100%;border-radius:10px;margin-top:6px"></a>':''):''):''),C.soft,C.line)+
  (done?H.box('🏁 Round finished','<b style="font-size:15px;color:'+(score>=n*.8?C.okfg:C.nofg)+'">'+score+' / '+n+'</b><div class="buttonrow" style="margin-top:6px">'+btn('home','← Pick another skill')+'</div>','#eefaf3','#c7e7d4'):'')+nav);
}

/* ---------------------------------------------------------------- step cases */
let CS={i:0,step:0,chosen:[],key:false};
function caseOpen(i){view='case';CS={i,step:0,chosen:[],key:false};caseRender()}
function caseRender(){
 const c=cur.cases[CS.i];
 const stepHtml=c.steps.map((s,k)=>{
  if(k>CS.step)return '<div style="border:1px dashed '+C.line+';border-radius:12px;padding:8px 11px;margin:0 0 8px;color:#a99c90"><b>Step '+(k+1)+'</b> · locked</div>';
  const o=order(c.id+k,s.o),ch=CS.chosen[k];
  return '<div style="background:'+(ch===undefined?C.soft:'#fff')+';border:'+(ch===undefined?'2px solid '+C.accent:'1px solid '+C.line)+';border-radius:12px;padding:10px 12px;margin:0 0 8px"><b>Step '+(k+1)+' · '+E(s.q)+'</b>'+o.map((x,i)=>optBtn(i,x,ch===undefined?'':x===s.a?'g':i===ch?'o':'dim','data-vpqp2-step')).join('')+
   (ch!==undefined?'<p style="margin:4px 0 0;font-size:12.5px"><b style="color:'+(o[ch]===s.a?C.okfg:C.nofg)+'">'+(o[ch]===s.a?'✓ Correct.':'Not quite.')+'</b> '+(s.ex||'')+'</p>':'')+'</div>'}).join('');
 const finished=CS.chosen.length===c.steps.length&&CS.chosen.every(x=>x!==undefined);
 const score=c.steps.filter((s,k)=>CS.chosen[k]!==undefined&&order(c.id+k,s.o)[CS.chosen[k]]===s.a).length;
 const pv=CS.i>0,nx=CS.i<cur.cases.length-1,keys=c.keys||[];
 shell('🩺 '+E(c.g),'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">'+btn('home','← Lecture '+cur.n+' unit')+'<button type="button" data-vpqp2="cprev" '+(pv?'':'disabled')+'>‹ Previous</button><button type="button" data-vpqp2="cnext" '+(nx?'':'disabled')+'>Next ›</button><small style="color:#7b6a5c;margin-left:auto">Case '+(CS.i+1)+' of '+cur.cases.length+'</small></div>'+
  '<h2 style="font-size:16px;margin:10px 0 4px;color:'+C.accent+'">'+E(c.label)+'</h2>'+
  (c.prompt?'<div style="border:1px solid #e6dccf;border-radius:12px;background:#fffaf3;padding:9px 12px;margin-bottom:6px">'+c.prompt+'</div>':'')+imgsHtml(c.img)+stepHtml+
  (finished?H.box('🏁 '+score+' / '+c.steps.length+' correct','<p style="margin:0 0 4px"><b>Answer key.</b> '+c.answer+'</p>'+(c.notes?'<div style="margin:6px 0 0;font-size:12.5px">'+c.notes+'</div>':'')+
   (keys.length?'<div class="buttonrow" style="margin-top:8px">'+btn('ckey',CS.key?'🙈 Hide the slides':'🖼️ Show the marked slide'+(keys.length>1?'s ('+keys.length+')':''))+'</div>'+(CS.key?keys.map(k=>'<figure style="margin:8px 0 0"><a href="'+E(U(k[0]))+'" target="_blank" rel="noopener"><img loading="lazy" src="'+E(U(k[0]))+'" alt="" style="width:100%;border-radius:10px;border:1px solid '+C.line+'"></a><figcaption style="font-size:11px;color:#7b6a5c">'+E(k[1]||'')+'</figcaption></figure>').join(''):''):'')+
   (c.src?'<p style="font-size:11px;color:#8a7b6e;margin:8px 0 0">'+E(c.src)+'</p>':'')+(nx?'<div style="text-align:right">'+btn('cnext','Next case ›',true)+'</div>':''),'#f0f9f5','#cce4db'):''));
}

/* ---------------------------------------------------------------- atlas */
let A={open:-1};
function atlas(){
 view='atlas';const list=cur.atlas||[];
 const groups=[...new Set(list.map(a=>a.group))];
 shell('🖼️ Lecture '+cur.n+' · Lesion atlas',navBtns()+'<p style="margin:0 0 8px;font-size:12.5px;color:#7b6a5c">Tap a card to open it. Titles are shown here on purpose — this is the study view (practice hides them).</p>'+
  groups.map(g=>'<h3 style="font-size:14px;margin:12px 0 6px;color:'+C.accent+'">'+E(g)+'</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:8px">'+list.map((a,i)=>[a,i]).filter(([a])=>a.group===g).map(([a,i])=>'<button type="button" data-vpqp2="card-'+i+'" style="padding:0;text-align:left;background:#fff;border:1px solid '+C.line+';border-radius:12px;overflow:hidden"><img loading="lazy" src="'+E(U(a.img[0]))+'" alt="" style="display:block;width:100%;height:120px;object-fit:cover;background:#2b2420"><span style="display:block;padding:6px 8px;font-size:12px;font-weight:800">'+E(a.title)+'</span></button>').join('')+'</div>').join(''));
}
function card(i){
 view='card';const a=cur.atlas[i],n=cur.atlas.length;
 const row=(k,v,t)=>v?'<tr><td style="width:70px;font-weight:800;color:'+C.accent+';vertical-align:top;padding:5px 6px;border-top:1px solid #efe6db">'+k+'</td><td style="padding:5px 6px;border-top:1px solid #efe6db">'+v+(t||'')+'</td></tr>':'';
 shell('🖼️ '+E(a.title),'<div class="buttonrow" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">'+btn('atlas','← Atlas')+'<button type="button" data-vpqp2="card-'+(i-1)+'" '+(i>0?'':'disabled')+'>‹</button><button type="button" data-vpqp2="card-'+(i+1)+'" '+(i<n-1?'':'disabled')+'>›</button><small style="color:#7b6a5c;margin-left:auto">'+(i+1)+' of '+n+'</small></div>'+
  imgsHtml(a.img)+'<table style="width:100%;border-collapse:collapse;font-size:13px;margin:4px 0 10px">'+row('Gross',a.gross)+row('Dx','<b>'+E(a.dx)+'</b>',a.dxTag)+row('Histo',a.histo)+row('Why',a.why)+row('Notes',a.notes)+'</table>'+
  (a.key?H.marked(a.key,a.keyNote||'your class notes'):'')+(a.src?'<p style="font-size:11px;color:#8a7b6e">'+E(a.src)+'</p>':''));
}

/* ---------------------------------------------------------------- open / events */
function allDrillItems(){return Object.values(cur.drills).flatMap(s=>s.items)}
function open(n,o){if(o)back=o;const ns=Object.keys(UNITS).map(Number);if(!ns.length)return false;cur=UNITS[n]||UNITS[Math.min(...ns)];home();return true}
function register(def){UNITS[def.n]=def;return def}
function init(ctx){
 api=ctx;if(api.body.__vpqP2Init)return;api.body.__vpqP2Init=true;
 api.body.addEventListener('click',e=>{
  if(!cur)return;
  const qc=e.target.closest('[data-vpqp2-qc]');if(qc){e.preventDefault();e.stopImmediatePropagation();const k=L.qi;if(L.ans['c'+k]!==undefined)return;const l=cur.lessons[L.i],it=l.check[k],o=order(l.id+k,it.o),i=+qc.dataset.vpqp2Qc;L.ans['c'+k]=i;L.ans[k]=o[i]===it.a;award('L'+cur.n+':lesson:'+l.id+':'+k,o[i]===it.a);return check()}
  const an=e.target.closest('[data-vpqp2-ans]');if(an){e.preventDefault();e.stopImmediatePropagation();if(R.chosen[R.at]!==undefined)return;const it=R.list[R.at],i=+an.dataset.vpqp2Ans,ok=opts(it)[i]===it.a;R.chosen[R.at]=i;R.reward=award(it.id,ok);if(ok)save(s=>{s.items=s.items||{};s.items[it.id]=true});return runRender()}
  const st=e.target.closest('[data-vpqp2-step]');if(st){e.preventDefault();e.stopImmediatePropagation();const k=CS.step,c=cur.cases[CS.i];if(CS.chosen[k]!==undefined)return;const s=c.steps[k],i=+st.dataset.vpqp2Step,ok=order(c.id+k,s.o)[i]===s.a;CS.chosen[k]=i;award('case:'+c.id+':'+k,ok);if(k<c.steps.length-1)CS.step=k+1;else{const sc=c.steps.filter((s2,j)=>order(c.id+j,s2.o)[CS.chosen[j]]===s2.a).length;save(s2=>{s2.cases=s2.cases||{};const old=s2.cases[c.id]?.score||0;s2.cases[c.id]={done:true,score:Math.max(old,sc)}})}return caseRender()}
  const b=e.target.closest('[data-vpqp2]');if(!b||b.disabled)return;e.preventDefault();e.stopImmediatePropagation();const k=b.dataset.vpqp2;
  if(k==='back')return back?.onBack?back.onBack():window.VPQ_PATH_FOUNDATIONS?.open?.();
  if(k==='home')return home();
  if(k.startsWith('unit-')){cur=UNITS[+k.slice(5)]||cur;return home()}
  if(k.startsWith('lesson-'))return lesson(+k.slice(7));
  if(k==='check'){L.qi=0;L.ans={};return check()}
  if(k==='qnext'){L.qi++;return check()}
  if(k.startsWith('run-')){const [,sk,c]=k.split('-');let list,title;if(sk==='mixed'){list=shuffle(allDrillItems());title='Mixed practice'}else{list=+c?shuffle(cur.drills[sk].items):cur.drills[sk].items.slice();title=cur.drills[sk].title}if(+c)list=list.slice(0,+c);return run(list,title)}
  if(k.startsWith('pick-')){const [,sk,i]=k.split('-');return run(cur.drills[sk].items.slice(),cur.drills[sk].title,+i)}
  if(k==='rprev'){R.at=Math.max(0,R.at-1);R.key=false;R.reward='';return runRender()}
  if(k==='rnext'){R.at=Math.min(R.list.length-1,R.at+1);R.key=false;R.reward='';return runRender()}
  if(k==='rkey'){R.key=!R.key;return runRender()}
  if(k.startsWith('case-'))return caseOpen(+k.slice(5));
  if(k==='cprev')return caseOpen(CS.i-1);
  if(k==='cnext')return caseOpen(CS.i+1);
  if(k==='ckey'){CS.key=!CS.key;return caseRender()}
  if(k==='atlas')return atlas();
  if(k.startsWith('card-'))return card(+k.slice(5));
 },true);
}
window.VPQ_PATH_EXAM2_UNIT=Object.freeze({init,open,register,has:n=>!!UNITS[n],units:()=>Object.keys(UNITS).map(Number),helpers:H});
})();
