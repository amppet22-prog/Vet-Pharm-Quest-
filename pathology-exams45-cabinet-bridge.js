/* Pathology Exams 4–5 bridge: connect existing authored L42–58 lecture
 * source sections to the editable Specimen Cabinet without duplicating data.
 * A lecture concept is NOT represented as a verified specimen diagnosis. */
window.VPQ_PATH_EXAMS45_CABINET_BRIDGE=(function(){
'use strict';
const source=window.VPQ_PATH_LECTURE_LEARN||{};
const cards=window.VPQ_PATH_EXAM7_DATA||[];
const lectures=Array.from({length:17},(_,i)=>String(i+42));
const clean=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const get=(sec,names)=>String((sec.points||[]).find(p=>names.some(k=>clean(k)===clean(p[0])))?.[1]||'');
let added=0,linked=0,skipped=0;
for(const n of lectures){
 const lesson=source[n];
 if(!lesson?.sections){skipped++;continue}
 lesson.sections.forEach((sec,i)=>{
  if(!sec.title||!sec.points?.length)return;
  const old=cards.find(c=>String(c.lecture)===n&&clean(c.title)===clean(sec.title));
  if(old){sec.specimenId=old.id;linked++;return}
  const id='vpq-path-l'+n+'-section-'+i;
  if(cards.some(x=>x.id===id)){sec.specimenId=id;linked++;return}
  const detailed=sec.diseaseAtlas===true;
  const gross=get(sec,['Gross recognition','Gross lesions','Gross or histology recognition','Gross and histologic clues']);
  const core=get(sec,['Gross and mechanism / lecture emphasis','Core / species','Lecture content / species']);
  const histo=get(sec,['Histopathology','Histology']);
  const mechanism=get(sec,['Pathogenesis — why','Pathogenesis — WHY','Pathophysiology — WHY']);
  const compare=get(sec,['Do not confuse with','Distinguish from']);
  const species=get(sec,['Species / signalment']);
  const etiology=get(sec,['Etiology / cause']);
  const context=core||get(sec,['Gross and mechanism / lecture emphasis']);
  const item={
   id,lecture:n,title:sec.title,normal:false,
   system:sec.organSystem||sec.group||'Pathology',
   organSystem:/endocrine/i.test(sec.organSystem||sec.group||'')?'endocrine':
      /hemolymph|lymph|spleen/i.test(sec.organSystem||sec.group||'')?'lymphatic':
      /muscle|skeletal|bone/i.test(sec.organSystem||sec.group||'')?'musculoskeletal':
      /cardio/i.test(sec.organSystem||sec.group||'')?'cardiac':
      /respirat/i.test(sec.organSystem||sec.group||'')?'respiratory':'',
   species:species||'Species details in original lecture',
   gross:gross||context||'This lecture entry does not provide a separate gross lesion description.',
   dx:detailed?'Formulate morphology from the source lesions; consult histology and clinical context.':'Lecture learning concept / differential; not an independently verified morphologic diagnosis.',
   histo:histo||'A separate histologic description has not yet been verified for this topic.',
   why:mechanism||context||'Review source lesson for mechanism.',
   compare:compare,
   notes:[etiology?'Etiology: '+etiology:'',detailed?'Detailed lecture disease record':'Lecture topic — may be normal anatomy, review, or a condition; do not mistake for a confirmed gross specimen'].filter(Boolean).join(' · '),
   source:'Pathology Lecture '+n+' · '+(get(sec,['Atlas source','Source','Source PDF'])||sec.slides||lesson.source||'source-linked lecture notes'),
   visualClue:gross||'',
   lectureAtlasSection:i,
   lectureAtlasId:n+'|'+sec.title,
   atlasLectureTopic:!detailed,
   hostScope:'unspecified'
  };
  cards.push(item);sec.specimenId=id;added++;
 })
}
const report={lectures,added,linked,skipped};
window.VPQ_PATH_EXAMS45_CABINET_STATUS=report;
return report;
})();