/* Exam 6 GI — register lecture-backed diseases in the EXISTING Specimen Cabinet.
 * Does not create a second atlas and does not replace existing specimen IDs.
 * Lecture sections remain the authored source; owner edits and photo keys remain intact. */
window.VPQ_PATH_EXAM6_CABINET_BRIDGE=(function(){
 'use strict';
 const lectures=['59','60','61','62','63','64','65','66'];
 const origin=window.VPQ_PATH_LECTURE_LEARN||{};
 const cards=window.VPQ_PATH_EXAM7_DATA||[];
 const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const field=(s,names)=>String((s.points||[]).find(p=>names.some(n=>n.toLowerCase()===String(p[0]||'').toLowerCase()))?.[1]||'');
 let added=0,linked=0;
 const idFor=(lecture,index)=>'vpq-gi-l'+lecture+'-section-'+index;
 function record(lecture,index){
  return cards.find(x=>x.id===idFor(lecture,index));
 }
 for(const lecture of lectures){
  const lesson=origin[lecture];
  if(!lesson?.sections)continue;
  lesson.sections.forEach((s,index)=>{
   if(!s?.diseaseAtlas||!(s.points||[]).length)return;
   const existing=cards.find(x=>String(x.lecture)===lecture&&norm(x.title)===norm(s.title));
   if(existing){s.specimenId=existing.id;linked++;return;}
   const id=idFor(lecture,index);
   const species=field(s,['Species / signalment']);
   const cause=field(s,['Etiology / cause']);
   const supplemental=s.kind==='supplemental';
   const refURL=field(s,['External reference']);
   const source=supplemental?('Supplemental Merck Veterinary Manual · '+refURL):('Pathology Lecture '+lecture+' · '+(field(s,['Atlas source','Instructor source'])||s.slides||'Lecture '+lecture));
   const item={
    id,lecture,title:s.title,normal:false,system:'Gastrointestinal',
    organSystem:'gastrointestinal',
    species:species||'Species not yet specified',
    gross:field(s,['Gross recognition','Gross lesions'])||'Gross lesion details pending source verification.',
    dx:'Use site, distribution and process to formulate the morphologic diagnosis; confirm with histology.',
    histo:field(s,['Histopathology','Histology'])||'Histologic features not yet verified in the lecture.',
    why:field(s,['Pathogenesis — why','Pathogenesis / why'])||cause||'Review pathogenesis in the original lecture.',
    compare:field(s,['Do not confuse with']),
    visualClue:field(s,['Gross recognition','Gross lesions']),
    notes:(cause?'Etiology / cause: '+cause+'\n':'')+(supplemental?'EXTERNAL SUPPLEMENT; professor lecture verification pending.\nReference: '+refURL:''),
    source,
    lectureAtlasSection:index,
    lectureAtlasId:lecture+'|'+s.title,
    diseaseId:'',
    // Classification is deliberately unassessed unless explicitly verified.
    // Never infer occurrence frequency, pathogen class or zoonotic status from a title.
    hostScope:'unspecified',
    speciesEvidence:species?(supplemental?'External reference describes: ':'Lecture '+lecture+' explicitly describes: ')+species:''
   };
   cards.push(item);s.specimenId=id;added++;
  });
 }
 function get(lecture,index){
  const s=origin[String(lecture)]?.sections?.[Number(index)];
  return s?.specimenId||idFor(String(lecture),Number(index));
 }
 window.VPQ_PATH_EXAM6_CABINET_STATUS={added,linked,total:added+linked,lectures};
 return {idFor,get,record,lectures,added,linked};
})();